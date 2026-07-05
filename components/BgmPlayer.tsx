"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

function getSrc(pathname: string) {
  if (pathname === "/") return "/music-main.mp3";
  if (pathname.startsWith("/crime/")) return "/music-simulation.mp3";
  if (pathname.startsWith("/gambling/")) return "/music-casino.mp3";
  return "/music-other.mp3";
}

// 페이지별 기본 볼륨
function getBaseVolume(pathname: string) {
  if (pathname.startsWith("/crime/")) return 0.22;
  if (pathname.startsWith("/gambling/")) return 0.18;
  return 0.13;
}

export default function BgmPlayer() {
  const pathname     = usePathname();
  const { lang }     = useLang();
  const audioRef     = useRef<HTMLAudioElement>(null);
  const [playing,  setPlaying]  = useState(false);
  const [muted,    setMuted]    = useState(false);
  const [volume,   setVolume]   = useState(getBaseVolume(pathname));
  const [open,     setOpen]     = useState(false);
  const [chatMode, setChatMode] = useState(false); // 채팅 중엔 미니 버튼만
  const startedRef  = useRef(false);
  const pulseRef    = useRef<NodeJS.Timeout | null>(null);
  const pulsePhase  = useRef(0);
  const isSimulation = pathname.startsWith("/crime/");

  // 채팅 플레이 중 미니모드 이벤트
  useEffect(() => {
    const on  = () => setChatMode(true);
    const off = () => setChatMode(false);
    window.addEventListener("crime-play-start", on);
    window.addEventListener("crime-play-end",   off);
    return () => {
      window.removeEventListener("crime-play-start", on);
      window.removeEventListener("crime-play-end",   off);
    };
  }, []);

  // 시뮬레이션 효과: 볼륨이 물결처럼 오르내림
  function startPulse(base: number) {
    if (pulseRef.current) clearInterval(pulseRef.current);
    pulsePhase.current = 0;
    pulseRef.current = setInterval(() => {
      const audio = audioRef.current;
      if (!audio) return;
      pulsePhase.current += 0.018;
      // 사인파: ±40% 범위로 변동
      const wave = Math.sin(pulsePhase.current) * base * 0.4;
      audio.volume = Math.min(1, Math.max(0.03, base + wave));
    }, 80);
  }

  function stopPulse() {
    if (pulseRef.current) { clearInterval(pulseRef.current); pulseRef.current = null; }
  }

  // 첫 로드
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop   = true;

    const tryPlay = () => {
      audio.play().then(() => {
        setPlaying(true);
        startedRef.current = true;
        if (isSimulation) startPulse(volume);
      }).catch(() => {});
    };

    tryPlay();
    const onInteract = () => { if (!startedRef.current) tryPlay(); };
    document.addEventListener("click",      onInteract, { once: true });
    document.addEventListener("touchstart", onInteract, { once: true });
    return () => { stopPulse(); };
  }, []);

  // 경로 변경 → 음악 전환
  // ⚠️ fadeOut 제거: setInterval 딜레이 후 play()를 부르면 브라우저가
  //    "사용자 제스처 없음"으로 판단해 자동재생을 차단함.
  //    클릭(네비게이션) 직후 즉시 play()를 호출해야 모바일에서 작동.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || muted) return;

    const newSrc  = getSrc(pathname);
    const newBase = getBaseVolume(pathname);
    if (audio.getAttribute("data-src") === newSrc) return;
    audio.setAttribute("data-src", newSrc);

    stopPulse();
    setVolume(newBase);

    // 즉시 전환 (fadeOut 없이 바로 새 트랙 재생)
    audio.pause();
    audio.volume = 0;
    audio.src = newSrc;
    audio.load();
    audio.play().then(() => {
      setPlaying(true);
      // 페이드인
      let fv = 0;
      const fadeIn = setInterval(() => {
        fv = Math.min(newBase, fv + 0.025);
        audio.volume = fv;
        if (fv >= newBase) {
          clearInterval(fadeIn);
          if (pathname.startsWith("/crime/")) startPulse(newBase);
        }
      }, 50);
    }).catch(() => {
      // 자동재생 실패 시 — 다음 사용자 인터랙션 때 재시도
      const retry = () => {
        audio.play().then(() => {
          setPlaying(true);
          audio.volume = newBase;
          if (pathname.startsWith("/crime/")) startPulse(newBase);
        }).catch(() => {});
      };
      document.addEventListener("click",      retry, { once: true });
      document.addEventListener("touchstart", retry, { once: true });
    });
  }, [pathname]);

  // 볼륨 슬라이더 변경
  function handleVolume(v: number) {
    setVolume(v);
    const audio = audioRef.current;
    if (!audio) return;
    stopPulse();
    audio.volume = v;
    if (playing && isSimulation) startPulse(v);
  }

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      stopPulse();
      audio.pause();
      setPlaying(false);
      setMuted(true);
    } else {
      if (!startedRef.current) { audio.src = getSrc(pathname); audio.load(); }
      audio.volume = volume;
      audio.play().then(() => {
        setPlaying(true);
        setMuted(false);
        startedRef.current = true;
        if (isSimulation) startPulse(volume);
      }).catch(() => {});
    }
  }

  const pct = Math.round(volume * 100 / 0.4 * 100); // 0~0.4 → 0~100%

  // ── 채팅 플레이 중: 상단 미니 버튼만 표시 ──────────────────────────────
  if (chatMode) return (
    <>
      <audio ref={audioRef} src={getSrc(pathname)} data-src={getSrc(pathname)} preload="auto" />
      <button
        onClick={toggle}
        style={{
          position: "fixed", top: 10, right: 14, zIndex: 10000,
          width: 30, height: 30, borderRadius: "50%",
          background: "rgba(0,0,0,0.45)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff", fontSize: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
        title={playing ? "음악 끄기" : "음악 켜기"}
      >
        {playing ? "🔊" : "🔇"}
      </button>
    </>
  );

  return (
    <>
      <audio ref={audioRef} src={getSrc(pathname)} data-src={getSrc(pathname)} preload="auto" />

      <div className="bgm-wrap" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9998, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>

        {/* 볼륨 패널 */}
        {open && (
          <div className="vol-panel" style={{
            background: "rgba(255,255,255,0.97)",
            border: "1.5px solid #e2e8f0",
            borderRadius: 20, padding: "18px 20px",
            boxShadow: "0 8px 32px #00000020",
            backdropFilter: "blur(16px)",
            minWidth: 200,
            animation: "volSlide 0.2s ease",
          }}>
            <style>{`
              @keyframes volSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
              .vol-slider { -webkit-appearance:none; appearance:none; width:100%; height:8px; border-radius:4px; outline:none; cursor:pointer; }
              .vol-slider::-webkit-slider-thumb { -webkit-appearance:none; width:22px; height:22px; border-radius:50%; background:#f97316; cursor:pointer; border:2px solid #fff; box-shadow:0 2px 6px #00000030; }
              .vol-btn { width:44px; height:44px; border-radius:50%; border:1.5px solid #e2e8f0; background:#f8f9fa; font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
              .vol-btn:active { background:#e2e8f0; }
            `}</style>

            <p style={{ fontSize: 12, fontWeight: 800, color: "#6b7280", marginBottom: 14, letterSpacing: 1, textAlign: "center" }}>
              🎵 {t("bgm_vol_title", lang)}
            </p>

            {/* 큰 버튼 방식 (어르신용) */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <button className="vol-btn" onClick={() => handleVolume(Math.max(0, volume - 0.04))}>🔉</button>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#f97316", lineHeight: 1 }}>
                  {Math.round(volume / 0.4 * 100)}
                </div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>/ 100</div>
              </div>
              <button className="vol-btn" onClick={() => handleVolume(Math.min(0.4, volume + 0.04))}>🔊</button>
            </div>

            {/* 슬라이더 */}
            <input
              type="range" min={0} max={0.4} step={0.01}
              value={volume}
              onChange={e => handleVolume(parseFloat(e.target.value))}
              className="vol-slider"
              style={{ background: `linear-gradient(to right, #f97316 ${pct}%, #e2e8f0 ${pct}%)` }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <button
                onClick={() => handleVolume(0)}
                style={{ fontSize: 11, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}
              >
                {t("bgm_mute", lang)}
              </button>
              <button
                onClick={() => handleVolume(0.2)}
                style={{ fontSize: 11, color: "#f97316", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", fontWeight: 700 }}
              >
                {t("bgm_medium", lang)}
              </button>
              <button
                onClick={() => handleVolume(0.4)}
                style={{ fontSize: 11, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}
              >
                {t("bgm_max", lang)}
              </button>
            </div>
          </div>
        )}

        {/* 메인 버튼 */}
        <div style={{ display: "flex", gap: 8 }}>
          {/* 볼륨 조절 토글 */}
          <button
            onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
            title={t("bgm_vol_title", lang)}
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: open ? "#f97316" : "rgba(255,255,255,0.92)",
              border: `1.5px solid ${open ? "#f97316" : "#e2e8f0"}`,
              cursor: "pointer", fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px #00000018",
              backdropFilter: "blur(12px)",
              color: open ? "#fff" : "#374151",
              fontWeight: 900,
            }}
          >
            🎚️
          </button>

          {/* 재생/정지 */}
          <button
            onClick={toggle}
            title={playing ? t("bgm_off", lang) : t("bgm_on", lang)}
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              border: "1.5px solid #e2e8f0",
              cursor: "pointer", fontSize: 20,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px #00000018",
              backdropFilter: "blur(12px)",
            }}
          >
            {playing ? "🔊" : "🔇"}
          </button>
        </div>
      </div>
    </>
  );
}
