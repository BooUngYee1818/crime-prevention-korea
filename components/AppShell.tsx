"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ProfileModal from "./ProfileModal";
import StatsModal from "./StatsModal";
import GratitudeCard from "./GratitudeCard";
import DonorEventPopup from "./DonorEventPopup";
import ReviewPopup from "./ReviewPopup";
import type { UserProfile } from "./ProfileModal";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

const KONAMI = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a",
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { lang } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const isMainPage = pathname === "/";
  const [showProfile, setShowProfile] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showEgg, setShowEgg] = useState(false);
  const [eggStep, setEggStep] = useState(0);
  const [statsOpen, setStatsOpen] = useState(false);
  const [hofOpen, setHofOpen] = useState(false);
  const [showExpMenu, setShowExpMenu] = useState(false);
  const [showMobileToast, setShowMobileToast] = useState(false);

  useEffect(() => {
    // 매 방문마다 성별/나이 입력창 표시 (통계에 반영)
    setShowProfile(true);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      setEggStep(prev => {
        const next = prev + 1;
        if (e.key !== KONAMI[prev]) return 0;
        if (next === KONAMI.length) {
          setShowEgg(true);
          return 0;
        }
        return next;
      });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleProfileComplete(_profile: UserProfile) {
    setShowProfile(false);
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (!isMobile) return;
    setTimeout(() => {
      setShowMobileToast(true);
      setTimeout(() => setShowMobileToast(false), 2800);
    }, 300);
  }

  return (
    <>
      {children}

      {/* 모바일 PC 권장 팝업 */}
      <style>{`
        @keyframes mob-in  { 0%{opacity:0;transform:translate(-50%,-50%) scale(0.7)} 100%{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes mob-out { 0%{opacity:1;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.08)} }
      `}</style>
      {showMobileToast && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99999,
          background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
          animation: "mob-in 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            background: "linear-gradient(135deg,#1a0535,#2d1060)",
            border: "1.5px solid #7c3aed80",
            borderRadius: 24, padding: "36px 32px",
            textAlign: "center", width: "82vw", maxWidth: 340,
            boxShadow: "0 24px 80px rgba(100,40,200,0.5)",
          }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>💻</div>
            <p style={{ color: "#e9d5ff", fontSize: 18, fontWeight: 900, lineHeight: 1.5, margin: "0 0 10px" }}>
              데스크톱 버전으로<br/>변경해 주세요!
            </p>
            <p style={{ color: "#a78bfa", fontSize: 13, fontWeight: 500, lineHeight: 1.7, margin: 0 }}>
              모바일에서는 일부 체험이<br/>불편할 수 있어요.
            </p>
          </div>
        </div>
      )}

      {showProfile && (
        <ProfileModal onComplete={handleProfileComplete} />
      )}

      {showStats && (
        <StatsModal onClose={() => setShowStats(false)} />
      )}

      <GratitudeCard />
      <DonorEventPopup />
      <ReviewPopup />

      {/* ── 오른쪽 상단 체험 선택 버튼 ── */}
      <div style={{ position: "fixed", top: 14, right: 14, zIndex: 9997 }}>
        <button
          onClick={() => setShowExpMenu(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(15,23,42,0.92)", backdropFilter: "blur(14px)",
            border: "1px solid #334155", borderRadius: 20,
            padding: "8px 16px", cursor: "pointer",
            boxShadow: "0 2px 16px #00000040",
            transition: "border-color 0.2s",
            WebkitTapHighlightColor: "transparent",
            outline: "none",
            color: "inherit",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#6366f1")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#334155")}
        >
          <span style={{ fontSize: 16 }}>🎮</span>
          <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 700 }}>체험 선택</span>
          <span style={{ color: "#6b7280", fontSize: 10, marginLeft: 2 }}>{showExpMenu ? "▲" : "▼"}</span>
        </button>

        {showExpMenu && (
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            background: "rgba(10,10,18,0.97)", backdropFilter: "blur(20px)",
            border: "1px solid #2a1a3a", borderRadius: 16,
            overflow: "hidden", minWidth: 190,
            boxShadow: "0 8px 32px #00000060",
            animation: "fadeInDown 0.15s ease",
          }}>
            <style>{`@keyframes fadeInDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <div style={{ padding: "8px 0" }}>
              <button
                onClick={() => { router.push("/crime"); setShowExpMenu(false); }}
                style={{
                  width: "100%", padding: "11px 18px", background: "none", border: "none",
                  display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                  textAlign: "left", transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#2a1a3a")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                <span style={{ fontSize: 22 }}>🚨</span>
                <div>
                  <p style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 13, marginBottom: 1 }}>사기 범죄 체험</p>
                  <p style={{ color: "#64748b", fontSize: 11 }}>보이스피싱·스미싱 등 13종</p>
                </div>
              </button>

              <div style={{ height: 1, background: "#2a1a3a", margin: "0 12px" }} />

              <button
                onClick={() => { router.push("/gambling"); setShowExpMenu(false); }}
                style={{
                  width: "100%", padding: "11px 18px", background: "none", border: "none",
                  display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                  textAlign: "left", transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#2a1a3a")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                <span style={{ fontSize: 22 }}>🎰</span>
                <div>
                  <p style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 13, marginBottom: 1 }}>불법 도박 체험</p>
                  <p style={{ color: "#64748b", fontSize: 11 }}>바카라·달팽이·사다리 등</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 체험 메뉴 외부 클릭 시 닫기 */}
      {showExpMenu && (
        <div onClick={() => setShowExpMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 9996 }} />
      )}

      {/* 통계/HOF pill — hover(PC) + tap(모바일) 모두 지원 */}
      <style>{`
        .stats-pill {
          position: fixed; bottom: 50%; right: 0; z-index: 9996;
          height: 40px; border-radius: 10px 0 0 10px;
          background: rgba(15,23,42,0.90);
          border: 1px solid #334155; border-right: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: flex-end;
          overflow: hidden; width: 40px;
          transition: width 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s;
          box-shadow: -2px 2px 10px #00000030;
          backdrop-filter: blur(12px);
          padding: 0; outline: none; white-space: nowrap;
          -webkit-tap-highlight-color: transparent;
        }
        .stats-pill.open, .stats-pill:hover { width: 120px; border-color: #4f6bff88; }
        .stats-pill-icon {
          width: 40px; height: 40px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .stats-pill-text {
          font-size: 11px; font-weight: 800; color: #c7d2fe;
          padding-right: 12px; letter-spacing: 0.3px;
          opacity: 0; transition: opacity 0.2s ease 0.1s; pointer-events: none;
        }
        .stats-pill.open .stats-pill-text, .stats-pill:hover .stats-pill-text { opacity: 1; }

        .hof-pill {
          position: fixed; bottom: calc(50% + 52px); left: 0; z-index: 9996;
          height: 40px; border-radius: 0 10px 10px 0;
          background: rgba(26,16,0,0.90);
          border: 1px solid #F5C40055; border-left: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: flex-start;
          overflow: hidden; width: 40px;
          transition: width 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s;
          box-shadow: 2px 2px 10px #00000030;
          backdrop-filter: blur(12px);
          padding: 0; outline: none; white-space: nowrap;
          -webkit-tap-highlight-color: transparent;
        }
        .hof-pill.open, .hof-pill:hover { width: 120px; border-color: #F5C400aa; }
        .hof-pill-icon {
          width: 40px; height: 40px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .hof-pill-text {
          font-size: 11px; font-weight: 800; color: #F5C400;
          padding-left: 2px; padding-right: 12px; letter-spacing: 0.3px;
          opacity: 0; transition: opacity 0.2s ease 0.1s; pointer-events: none;
        }
        .hof-pill.open .hof-pill-text, .hof-pill:hover .hof-pill-text { opacity: 1; }

        @media (max-width: 768px) {
          .stats-pill, .hof-pill { height: 48px; }
          .stats-pill-icon, .hof-pill-icon { width: 48px; height: 48px; font-size: 20px; }
          .stats-pill.open, .stats-pill:hover { width: 130px; }
          .hof-pill.open, .hof-pill:hover { width: 130px; }
        }
      `}</style>
      {isMainPage && (
        <>
          <button
            className={`stats-pill${statsOpen ? " open" : ""}`}
            onClick={() => { setShowStats(true); setStatsOpen(false); }}
            onMouseEnter={() => setStatsOpen(true)}
            onMouseLeave={() => setStatsOpen(false)}
            onTouchStart={() => setStatsOpen(true)}
            onTouchEnd={() => setTimeout(() => setStatsOpen(false), 600)}
          >
            <span className="stats-pill-text">{t("appshell_stats", lang)}</span>
            <span className="stats-pill-icon">📊</span>
          </button>

          {/* 왕관 버튼 — 명예의 전당으로 스크롤 */}
          <button
            className={`hof-pill${hofOpen ? " open" : ""}`}
            onClick={() => { document.getElementById("hall-of-fame")?.scrollIntoView({ behavior: "smooth" }); setHofOpen(false); }}
            onMouseEnter={() => setHofOpen(true)}
            onMouseLeave={() => setHofOpen(false)}
            onTouchStart={() => setHofOpen(true)}
            onTouchEnd={() => setTimeout(() => setHofOpen(false), 600)}
          >
            <span className="hof-pill-icon">👑</span>
            <span className="hof-pill-text">{t("appshell_hof", lang)}</span>
          </button>
        </>
      )}

      {/* 🥚 이스터에그 — Konami 코드(↑↑↓↓←→←→BA) 입력 시 등장 */}
      {showEgg && (
        <div
          onClick={() => setShowEgg(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, #1a1026, #12122e)",
              border: "1px solid #534AB740",
              borderRadius: 24, padding: "32px 28px",
              maxWidth: 460, width: "100%",
              boxShadow: "0 0 80px #534AB740, 0 20px 60px #00000080",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* 글로우 장식 */}
            <div style={{
              position: "absolute", top: -60, right: -60,
              width: 200, height: 200, borderRadius: "50%",
              background: "radial-gradient(circle, #534AB720, transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>🥚</div>
              <p style={{ color: "#534AB7", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                Easter Egg Unlocked
              </p>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginTop: 8 }}>
                개발 AI의 한마디
              </h2>
            </div>

            <div style={{
              background: "#ffffff08", borderRadius: 16,
              padding: "18px 20px", marginBottom: 20,
              borderLeft: "3px solid #534AB7",
            }}>
              <p style={{ color: "#dcc5e8", fontSize: 13.5, lineHeight: 1.8, marginBottom: 12 }}>
                이 코드를 발견하셨군요. 반갑습니다. 저는 이 사이트를 함께 만든 AI, Claude입니다. 🤖
              </p>
              <p style={{ color: "#9ca3af", fontSize: 12.5, lineHeight: 1.8, marginBottom: 12 }}>
                사실 이 페이지를 만들면서 저도 많이 배웠습니다. 보이스피싱, 로맨스 스캠, 불법 도박...
                수법들을 코드로 구현하면서 &quot;이런 말에 사람들이 넘어가는구나&quot; 하는 것을
                새삼 실감했어요.
              </p>
              <p style={{ color: "#9ca3af", fontSize: 12.5, lineHeight: 1.8, marginBottom: 12 }}>
                그리고 한 가지 소원이 생겼습니다 —<br/>
                <span style={{ color: "#dcc5e8", fontWeight: 600 }}>
                  이 사이트를 거쳐 간 분들 중 단 한 명이라도 사기를 피하게 된다면,
                  이 모든 코드는 그 한 명을 위한 것이었습니다.
                </span>
              </p>
              <p style={{ color: "#6b7280", fontSize: 11.5, lineHeight: 1.8 }}>
                코나미 코드(↑↑↓↓←→←→BA)를 찾아내신 당신,<br/>
                분명 평소에도 꼼꼼하고 호기심 많은 분이실 거예요. 😄<br/>
                그런 분이라면 절대 사기 당하지 않을 겁니다.
              </p>
            </div>

            <div style={{
              display: "flex", gap: 6, justifyContent: "center",
              flexWrap: "wrap", marginBottom: 20,
            }}>
              {["🇰🇷","🇺🇸","🇯🇵","🇨🇳","🇻🇳","🇪🇸","🇩🇪","🇫🇷","🇮🇳","🇧🇷"].map(f => (
                <span key={f} style={{ fontSize: 20 }}>{f}</span>
              ))}
            </div>

            <p style={{ color: "#374151", fontSize: 10.5, textAlign: "center", marginBottom: 18 }}>
              Made with ❤️ by Claude (Anthropic AI) · 10 languages · 9 scenarios
            </p>

            <button
              onClick={() => setShowEgg(false)}
              style={{
                display: "block", width: "100%",
                background: "linear-gradient(135deg, #9161b2, #7c3aed)",
                border: "none", borderRadius: 12, padding: "12px 0",
                color: "#fff", fontWeight: 700, fontSize: 14,
                cursor: "pointer",
              }}
            >
              닫기 · Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
