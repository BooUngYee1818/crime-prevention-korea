"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function DonorEventPopup() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("donor_popup_hidden_until");
    if (stored && Date.now() < parseInt(stored)) return;
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  function hideToday() {
    localStorage.setItem("donor_popup_hidden_until", String(Date.now() + 24 * 60 * 60 * 1000));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div onClick={hideToday} style={{
      position: "fixed", inset: 0, zIndex: 99998,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, animation: "fadeInBg 0.3s ease",
    }}>
      <style>{`
        @keyframes fadeInBg { from{opacity:0} to{opacity:1} }
        @keyframes slideUp  { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#ffffff", borderRadius: 24, maxWidth: 440, width: "100%",
        overflow: "hidden", animation: "slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
      }}>
        {/* 노란 배너 */}
        <div style={{ background: "#F5C400", padding: "28px 28px 22px", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0, fontSize: 52, fontWeight: 900, color: "#ffffff20",
            display: "flex", alignItems: "center", whiteSpace: "nowrap", overflow: "hidden",
            userSelect: "none", pointerEvents: "none", lineHeight: 1,
          }}>
            Hall of Fame · 명예의 전당 · 殿堂 · 荣誉殿堂
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 4, color: "#7a6200", textTransform: "uppercase", marginBottom: 10 }}>
              {t("donor_badge", lang)}
            </p>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1a1000", lineHeight: 1.3, margin: 0 }}>
              {t("donor_title", lang).split("\n").map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
              ))}
            </h2>
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: "24px 28px 28px" }}>
          <p style={{ fontSize: 15, color: "#1a1a1a", lineHeight: 1.75, fontWeight: 600, marginBottom: 16 }}>
            {t("donor_desc", lang).split("\n").map((line, i, arr) => (
              <span key={i}>{i === 1 ? <span style={{ color: "#c49500", fontWeight: 900 }}>{line}</span> : line}{i < arr.length - 1 && <br/>}</span>
            ))}
          </p>

          <div style={{ background: "#fffbea", border: "1.5px solid #F5C40060", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "#7a6200", margin: 0, lineHeight: 1.7 }}>
              {t("donor_check1", lang)}<br/>
              {t("donor_check2", lang)}<br/>
              {t("donor_check3", lang)}<br/>
              {t("donor_check4", lang)}
            </p>
          </div>

          <a
            href={`mailto:itnlifecn@gmail.com?subject=${encodeURIComponent("후원 및 명예의 전당 등재 신청")}&body=${encodeURIComponent("닉네임:\n후원 방법 문의:")}`}
            style={{
              display: "block", width: "100%", background: "#F5C400",
              border: "none", borderRadius: 14, padding: "15px 0",
              fontSize: 15, fontWeight: 900, color: "#1a1000",
              textAlign: "center", cursor: "pointer", textDecoration: "none", boxSizing: "border-box",
            }}
            onClick={hideToday}
          >
            {t("donor_contact", lang)}
          </a>

          <button onClick={hideToday} style={{
            display: "block", width: "100%", marginTop: 12,
            background: "none", border: "none", fontSize: 12, color: "#aaa",
            cursor: "pointer", textDecoration: "underline",
          }}>
            {t("donor_hide", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
