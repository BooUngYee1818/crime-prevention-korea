"use client";
import { useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

const KAKAOPAY_URL = "https://qr.kakaopay.com/Ej8RbqcQf";

export default function DonateFloatButton() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: 140, left: 24, zIndex: 9997 }}>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: -1 }} />
          <div style={{
            position: "absolute", bottom: "calc(100% + 8px)", left: 0,
            background: "#0d1a0d", border: "1px solid #22c55e44",
            borderRadius: 18, padding: "14px 14px 10px",
            boxShadow: "0 8px 32px #00000040", minWidth: 200,
          }}>
            <p style={{ color: "#4ade80", fontSize: 12, fontWeight: 900, marginBottom: 4 }}>{t("donate_title", lang)}</p>
            <p style={{ color: "#6b7280", fontSize: 10, lineHeight: 1.6, marginBottom: 10 }}>
              {t("donate_desc1", lang)}<br />{t("donate_desc2", lang)}
            </p>
            <a href={KAKAOPAY_URL} target="_blank" rel="noopener noreferrer"
              onClick={() => {
                try { localStorage.setItem("hof_donated", "1"); } catch {}
              }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                width: "100%", padding: "10px 0", borderRadius: 12, marginBottom: 8,
                background: "#fee500", color: "#3c1e1e", fontWeight: 900, fontSize: 13,
                textDecoration: "none", border: "none", cursor: "pointer",
              }}>
              {t("donate_kakao", lang)}
            </a>
            <p style={{ color: "#4b5563", fontSize: 10, textAlign: "center", marginBottom: 8 }}>
              {t("donate_note1", lang)}<br />{t("donate_note2", lang)}
            </p>
          </div>
        </>
      )}

      {!open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: 0,
          background: "rgba(20,83,45,0.95)", color: "#86efac",
          fontSize: 11, fontWeight: 600, borderRadius: 10,
          padding: "5px 10px", whiteSpace: "nowrap",
          boxShadow: "0 2px 8px #00000030", pointerEvents: "none",
        }}>
          {t("donate_tooltip", lang)}
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} title={t("donate_title", lang)}
        style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(20,83,45,0.95)",
          border: "1.5px solid #22c55e66",
          cursor: "pointer", fontSize: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px #00000030", backdropFilter: "blur(12px)",
        }}>
        💚
      </button>
    </div>
  );
}
