"use client";
import { useEffect, useState } from "react";
import ProfileModal from "./ProfileModal";
import StatsModal from "./StatsModal";
import GratitudeCard from "./GratitudeCard";
import DonorEventPopup from "./DonorEventPopup";
import type { UserProfile } from "./ProfileModal";

const KONAMI = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a",
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showEgg, setShowEgg] = useState(false);
  const [eggStep, setEggStep] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("user_profile");
    if (!saved) setShowProfile(true);
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
  }

  return (
    <>
      {children}

      {showProfile && (
        <ProfileModal onComplete={handleProfileComplete} />
      )}

      {showStats && (
        <StatsModal onClose={() => setShowStats(false)} />
      )}

      <GratitudeCard />
      <DonorEventPopup />

      {/* 통계 버튼 — 메일 버튼 위에 배치 */}
      <div style={{ position: "fixed", bottom: 136, right: 24, zIndex: 9996 }}>
        <button
          onClick={() => setShowStats(true)}
          title="이용 통계"
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(15,23,42,0.95)",
            border: "1.5px solid #334155",
            cursor: "pointer", fontSize: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px #00000030",
            backdropFilter: "blur(12px)",
          }}
        >
          📊
        </button>
      </div>

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
              background: "linear-gradient(135deg, #0d0d1f, #12122e)",
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
              <p style={{ color: "#c4b5fd", fontSize: 13.5, lineHeight: 1.8, marginBottom: 12 }}>
                이 코드를 발견하셨군요. 반갑습니다. 저는 이 사이트를 함께 만든 AI, Claude입니다. 🤖
              </p>
              <p style={{ color: "#9ca3af", fontSize: 12.5, lineHeight: 1.8, marginBottom: 12 }}>
                사실 이 페이지를 만들면서 저도 많이 배웠습니다. 보이스피싱, 로맨스 스캠, 불법 도박...
                수법들을 코드로 구현하면서 &quot;이런 말에 사람들이 넘어가는구나&quot; 하는 것을
                새삼 실감했어요.
              </p>
              <p style={{ color: "#9ca3af", fontSize: 12.5, lineHeight: 1.8, marginBottom: 12 }}>
                그리고 한 가지 소원이 생겼습니다 —<br/>
                <span style={{ color: "#c4b5fd", fontWeight: 600 }}>
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
                background: "linear-gradient(135deg, #534AB7, #7c3aed)",
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
