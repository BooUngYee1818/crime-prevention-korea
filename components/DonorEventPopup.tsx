"use client";
import { useEffect, useState } from "react";

export default function DonorEventPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("donor_popup_hidden_until");
    if (stored && Date.now() < parseInt(stored)) return;
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  function hideToday() {
    const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("donor_popup_hidden_until", String(tomorrow));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      onClick={hideToday}
      style={{
        position: "fixed", inset: 0, zIndex: 99998,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "fadeInBg 0.3s ease",
      }}
    >
      <style>{`
        @keyframes fadeInBg { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp  { from { transform:translateY(40px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        @keyframes shimmer  {
          0%   { background-position: -400px 0 }
          100% { background-position: 400px 0 }
        }
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: 24,
          maxWidth: 440, width: "100%",
          overflow: "hidden",
          animation: "slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
        }}
      >
        {/* 상단 노란 배너 */}
        <div style={{
          background: "#F5C400",
          padding: "28px 28px 22px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* 배경 패턴 — 큰 이름들 */}
          <div style={{
            position: "absolute", inset: 0,
            fontSize: 52, fontWeight: 900, color: "#ffffff20",
            display: "flex", alignItems: "center",
            whiteSpace: "nowrap", overflow: "hidden",
            userSelect: "none", pointerEvents: "none",
            lineHeight: 1,
          }}>
            부엉이 안 양진오 노영국이 김미경 주현옥
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{
              fontSize: 11, fontWeight: 800, letterSpacing: 4,
              color: "#7a6200", textTransform: "uppercase", marginBottom: 10,
            }}>Limited Event</p>
            <h2 style={{
              fontSize: 26, fontWeight: 900, color: "#1a1000",
              lineHeight: 1.3, margin: 0,
            }}>
              💛 후원자 명예의 전당<br/>등재 이벤트
            </h2>
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: "24px 28px 28px" }}>
          <p style={{
            fontSize: 15, color: "#1a1a1a", lineHeight: 1.75,
            fontWeight: 600, marginBottom: 16,
          }}>
            후원에 참여해 주시면<br/>
            <span style={{ color: "#c49500", fontWeight: 900 }}>사이트 메인 화면 명예의 전당</span>에<br/>
            닉네임이 영구 등재됩니다.
          </p>

          <div style={{
            background: "#fffbea",
            border: "1.5px solid #F5C40060",
            borderRadius: 14,
            padding: "14px 18px",
            marginBottom: 20,
          }}>
            <p style={{ fontSize: 13, color: "#7a6200", margin: 0, lineHeight: 1.7 }}>
              ✅ 후원 확인 즉시 이름 반영<br/>
              ✅ 원하는 닉네임으로 등재<br/>
              ✅ 이 사이트가 운영되는 한 영구 유지<br/>
              ✅ 범죄 예방 교육에 직접 기여
            </p>
          </div>

          <a
            href={`mailto:itnlifecn@gmail.com?subject=후원 및 명예의 전당 등재 신청&body=닉네임:%0A후원 방법 문의:`}
            style={{
              display: "block", width: "100%",
              background: "#F5C400",
              border: "none", borderRadius: 14,
              padding: "15px 0",
              fontSize: 15, fontWeight: 900, color: "#1a1000",
              textAlign: "center", cursor: "pointer",
              textDecoration: "none",
              boxSizing: "border-box",
            }}
            onClick={hideToday}
          >
            후원 문의하기 →
          </a>

          <button
            onClick={hideToday}
            style={{
              display: "block", width: "100%", marginTop: 12,
              background: "none", border: "none",
              fontSize: 12, color: "#aaa", cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            오늘 하루 보지 않기
          </button>
        </div>
      </div>
    </div>
  );
}
