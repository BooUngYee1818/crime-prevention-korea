"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LangCode, LANGUAGES } from "./i18n";

const LanguageContext = createContext<{
  lang: LangCode;
  setLang: (l: LangCode) => void;
}>({ lang: "ko", setLang: () => {} });

function FloatingLanguageSelector() {
  const { lang, setLang } = useContext(LanguageContext);
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div style={{ position: "fixed", bottom: 24, left: 24, zIndex: 9999 }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 14px", borderRadius: 24,
          background: "rgba(255,255,255,0.95)",
          border: "1.5px solid #e2e8f0",
          cursor: "pointer", fontSize: 13, fontWeight: 700,
          color: "#0f172a",
          boxShadow: "0 4px 20px #00000018",
          backdropFilter: "blur(12px)",
        }}
      >
        <span style={{ fontSize: 16 }}>{current.flag}</span>
        <span>{current.label}</span>
        <span style={{ fontSize: 9, color: "#94a3b8", marginLeft: 2 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: -1 }} />
          <div style={{
            position: "absolute", bottom: "calc(100% + 8px)", left: 0,
            background: "#fff", borderRadius: 16, zIndex: 9999,
            boxShadow: "0 8px 40px #00000020", border: "1px solid #f1f5f9",
            overflow: "hidden", minWidth: 160,
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
                <span style={{ fontSize: 16 }}>{l.flag}</span>
                <span>{l.label}</span>
                {l.code === lang && <span style={{ marginLeft: "auto", color: "#2563eb", fontSize: 11 }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("ko");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as LangCode | null;
    if (saved && LANGUAGES.find((l) => l.code === saved)) setLangState(saved);
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
      <FloatingLanguageSelector />
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
