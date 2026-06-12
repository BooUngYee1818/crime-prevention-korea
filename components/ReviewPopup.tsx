"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function ReviewPopup() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("review_popup_hidden_until");
    if (stored && Date.now() < parseInt(stored)) return;
    const timer = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  function hideToday() {
    localStorage.setItem("review_popup_hidden_until", String(Date.now() + 24 * 60 * 60 * 1000));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div onClick={hideToday} style={{
      position: "fixed", inset: 0, zIndex: 99997,
      background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      paddingBottom: 32, animation: "reviewBgIn 0.3s ease",
    }}>
      <style>{`
        @keyframes reviewBgIn  { from{opacity:0} to{opacity:1} }
        @keyframes reviewSlide { from{transform:translateY(60px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes heartbeat   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
      `}</style>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0d0d1e", border: "1px solid #534AB730",
        borderRadius: 24, maxWidth: 420, width: "calc(100% - 32px)",
        overflow: "hidden", animation: "reviewSlide 0.45s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: "0 -8px 60px rgba(83,74,183,0.25), 0 20px 80px rgba(0,0,0,0.5)",
      }}>
        <div style={{
          background: "linear-gradient(135deg,#534AB7,#7c3aed)",
          padding: "22px 24px 18px", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -20, right: -20,
            width: 120, height: 120, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32, animation: "heartbeat 2s ease-in-out infinite", display: "inline-block" }}>💜</span>
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: "#c4b5fd80", textTransform: "uppercase", marginBottom: 4 }}>
                {t("review_badge", lang)}
              </p>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 900, margin: 0, lineHeight: 1.3 }}>
                {t("review_heading", lang)}
              </h3>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 24px 24px" }}>
          <p style={{ color: "#c4b5fd", fontSize: 14, lineHeight: 1.85, marginBottom: 18, fontWeight: 600 }}>
            {t("review_body", lang).split("\n").map((line, i, arr) => (
              <span key={i}>{i === 2 ? <span style={{ color: "#a78bfa", fontWeight: 900 }}>{line}</span> : line}{i < arr.length - 1 && <br/>}</span>
            ))}
          </p>

          <div style={{ background: "#1a1a2e", border: "1px solid #534AB730", borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
            <p style={{ color: "#6b7280", fontSize: 12.5, margin: 0, lineHeight: 1.8 }}>
              {t("review_bullet1", lang)}<br/>
              {t("review_bullet2", lang)}<br/>
              {t("review_bullet3", lang)}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                hideToday();
                document.getElementById("guestbook-textarea")?.focus();
                document.querySelector("[data-stats-btn]")?.dispatchEvent(new Event("click", { bubbles: true }));
              }}
              style={{
                flex: 1, background: "linear-gradient(135deg,#534AB7,#7c3aed)",
                border: "none", borderRadius: 12, padding: "13px 0",
                color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer",
              }}
            >
              {t("review_goto", lang)}
            </button>
            <button onClick={hideToday} style={{
              padding: "13px 16px", background: "#ffffff10", border: "1px solid #ffffff10",
              borderRadius: 12, color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              {t("review_later", lang)}
            </button>
          </div>

          <button onClick={hideToday} style={{
            display: "block", width: "100%", marginTop: 12,
            background: "none", border: "none", fontSize: 11, color: "#374151",
            cursor: "pointer", textDecoration: "underline",
          }}>
            {t("review_hide", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
