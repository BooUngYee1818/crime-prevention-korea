"use client";
import { useState } from "react";
import { LANGUAGES } from "@/lib/i18n";
import { useLang } from "@/lib/LanguageContext";

export default function LanguageSelector() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 20,
          background: "rgba(255,255,255,0.9)",
          border: "1px solid #e2e8f0",
          cursor: "pointer", fontSize: 13, fontWeight: 600,
          color: "#0f172a", boxShadow: "0 1px 4px #0000000a",
        }}
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>▼</span>
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 998 }}
          />
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            background: "#fff", borderRadius: 14, zIndex: 999,
            boxShadow: "0 8px 32px #0000001a", border: "1px solid #f1f5f9",
            overflow: "hidden", minWidth: 150,
          }}>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "10px 16px", border: "none",
                  background: l.code === lang ? "#eff6ff" : "#fff",
                  cursor: "pointer", fontSize: 13,
                  color: l.code === lang ? "#2563eb" : "#334155",
                  fontWeight: l.code === lang ? 700 : 400,
                  textAlign: "left",
                }}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
