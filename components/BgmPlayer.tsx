"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

function getSrc(pathname: string) {
  if (pathname === "/") return "/music-main.mp3";
  if (pathname.startsWith("/crime/")) return "/music-simulation.mp3";
  return "/music-other.mp3";
}

// 페이지별 기본 볼륨
function getBaseVolume(pathname: string) {
  if (pathname.startsWith("/crime/")) return 0.22;
  return 0.13;
}

export default function BgmPlayer() {
  const pathname     = usePathname();
  const audioRef     = useRef<HTMLAudioElement>(null);
  const [playing,  setPlaying]  = useState(false);
  const [muted,    setMuted]    = useState(false);
  const [volume,   setVolume]   = useState(getBaseVolume(pathname));
  const [open,     setOpen]     = useState(false);
  const startedRef  = useRef(false);
  const pulseRef    = useRef<NodeJS.Timeout | null>(null);
  const pulsePhase  = useRef(0);
  const isSimulation = pathname.startsWith("/crime/");

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
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !startedRef.current || muted) return;

    const newSrc  = getSrc(pathname);
    const newBase = getBaseVolume(pathname);
    if (audio.getAttribute("data-src") === newSrc) return;
    audio.setAttribute("data-src", newSrc);

    stopPulse();
    setVolume(newBase);

    let v = audio.volume;
    const fadeOut = setInterval(() => {
      v = Math.max(0, v - 0.025);
      audio.volume = v;
      if (v <= 0) {
        clearInterval(fadeOut);
        audio.pause();
        audio.src = newSrc;
        audio.load();
        audio.play().then(() => {
          audio.volume = 0;
          let fv = 0;
          const fadeIn = setInterval(() => {
            fv = Math.min(newBase, fv + 0.02);
            audio.volume = fv;
            if (fv >= newBase) {
              clearInterval(fadeIn);
              if (pathname.startsWith("/crime/")) startPulse(newBase);
            }
          }, 60);
        }).catch(() => {});
      }
    }, 50);
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

  return (
    <>
      <audio ref={audioRef} src={getSrc(pathname)} data-src={getSrc(pathname)} preload="auto" />

      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9998, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>

        {/* 볼륨 패널 */}
        {open && (
          <div style={{
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
              .vol-slider::-webkit-slider-thumb { -webkit-appearance:none; width:22px; height:22px; border-radius:50%; background:#534AB7; cursor:pointer; border:2px solid #fff; box-shadow:0 2px 6px #00000030; }
              .vol-btn { width:44px; height:44px; border-radius:50%; border:1.5px solid #e2e8f0; background:#f8f9fa; font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
              .vol-btn:active { background:#e2e8f0; }
            `}</style>

            <p style={{ fontSize: 12, fontWeight: 800, color: "#6b7280", marginBottom: 14, letterSpacing: 1, textAlign: "center" }}>
              🎵 음량 조절
            </p>

            {/* 큰 버튼 방식 (어르신용) */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <button className="vol-btn" onClick={() => handleVolume(Math.max(0, volume - 0.04))}>🔉</button>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#534AB7", lineHeight: 1 }}>
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
              style={{ background: `linear-gradient(to right, #534AB7 ${pct}%, #e2e8f0 ${pct}%)` }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <button
                onClick={() => handleVolume(0)}
                style={{ fontSize: 11, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}
              >
                음소거
              </button>
              <button
                onClick={() => handleVolume(0.2)}
                style={{ fontSize: 11, color: "#534AB7", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", fontWeight: 700 }}
              >
                적당히
              </button>
              <button
                onClick={() => handleVolume(0.4)}
                style={{ fontSize: 11, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}
              >
                최대
              </button>
            </div>
          </div>
        )}

        {/* 메인 버튼 */}
        <div style={{ display: "flex", gap: 8 }}>
          {/* 볼륨 조절 토글 */}
          <button
            onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
            title="음량 조절"
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: open ? "#534AB7" : "rgba(255,255,255,0.92)",
              border: `1.5px solid ${open ? "#534AB7" : "#e2e8f0"}`,
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
            title={playing ? "음악 끄기" : "음악 켜기"}
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
