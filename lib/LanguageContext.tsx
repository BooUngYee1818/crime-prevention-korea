"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LangCode, LANGUAGES } from "./i18n";

const LanguageContext = createContext<{
  lang: LangCode;
  setLang: (l: LangCode) => void;
}>({ lang: "ko", setLang: () => {} });

// 주요 5개 언어 (큰 카드로 표시)
const MAJOR_LANGS: LangCode[] = ["ko", "en", "zh", "ja", "vi"];

// 언어별 "언어를 선택해 주세요" 문구
const PICK_TEXT: Record<LangCode, string> = {
  ko: "언어를 선택해 주세요",
  en: "Please select your language",
  ja: "言語を選択してください",
  zh: "请选择语言",
  vi: "Vui lòng chọn ngôn ngữ",
  es: "Por favor seleccione su idioma",
  de: "Bitte wählen Sie Ihre Sprache",
  fr: "Veuillez choisir votre langue",
  hi: "कृपया अपनी भाषा चुनें",
  pt: "Por favor selecione seu idioma",
  th: "กรุณาเลือกภาษาของคุณ",
  uz: "Iltimos, tilingizni tanlang",
  tl: "Mangyaring piliin ang iyong wika",
  mn: "Хэлээ сонгоно уу",
  ru: "Пожалуйста, выберите язык",
  id: "Silakan pilih bahasa Anda",
};

// 사이트 이름 번역
const SITE_NAME: Record<LangCode, string> = {
  ko: "범죄예방 시뮬레이션",
  en: "Crime Prevention Simulation",
  ja: "犯罪予防シミュレーション",
  zh: "犯罪预防模拟",
  vi: "Mô phỏng Phòng chống Tội phạm",
  es: "Simulación de Prevención del Crimen",
  de: "Verbrechenspräventionssimulation",
  fr: "Simulation de Prévention du Crime",
  hi: "अपराध रोकथाम सिमुलेशन",
  pt: "Simulação de Prevenção ao Crime",
  th: "การจำลองการป้องกันอาชญากรรม",
  uz: "Jinoyatni Oldini Olish Simulyatsiyasi",
  tl: "Simulasyon ng Pag-iwas sa Krimen",
  mn: "Гэмт хэргийн урьдчилан сэргийлэх дүрслэл",
  ru: "Симуляция предотвращения преступлений",
  id: "Simulasi Pencegahan Kejahatan",
};

function LangSelectModal({ onSelect }: { onSelect: (l: LangCode) => void }) {
  const [hovered, setHovered] = useState<LangCode | null>(null);

  const majorLangs = LANGUAGES.filter((l) => MAJOR_LANGS.includes(l.code));
  const otherLangs = LANGUAGES.filter((l) => !MAJOR_LANGS.includes(l.code));

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "linear-gradient(135deg, #0d0520 0%, #1a0d35 50%, #0a1628 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
      overflow: "auto",
    }}>
      <style>{`
        @keyframes lang-fade-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lang-pulse {
          0%,100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0.7; transform: scale(1.05); }
        }
        .lang-card-hover {
          transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease, background 0.18s ease;
        }
        .lang-card-hover:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 16px 40px rgba(124,58,237,0.4) !important;
        }
        .lang-mini-hover {
          transition: all 0.15s ease;
        }
        .lang-mini-hover:hover {
          background: rgba(124,58,237,0.25) !important;
          transform: scale(1.05);
        }
      `}</style>

      {/* 배경 장식 원들 */}
      <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #7c3aed22 0%, transparent 70%)", animation: "lang-pulse 4s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, #3b82f622 0%, transparent 70%)", animation: "lang-pulse 5s ease-in-out 1s infinite" }} />
      </div>

      {/* 헤더 */}
      <div style={{ textAlign: "center", marginBottom: 32, animation: "lang-fade-in 0.5s ease both" }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🛡️</div>
        <p style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 6, letterSpacing: -0.5 }}>
          Crime Prevention Korea
        </p>
        <p style={{ color: "#a78bfa", fontSize: 13, marginBottom: 20 }}>
          {MAJOR_LANGS.map((lc) => SITE_NAME[lc]).join(" · ")}
        </p>
        <div style={{
          display: "inline-block", background: "rgba(124,58,237,0.2)",
          border: "1.5px solid rgba(124,58,237,0.5)", borderRadius: 24,
          padding: "8px 20px",
        }}>
          <p style={{ color: "#c4b5fd", fontSize: 14, fontWeight: 700 }}>
            {MAJOR_LANGS.map((lc) => PICK_TEXT[lc]).join("  /  ")}
          </p>
        </div>
      </div>

      {/* 주요 5개 언어 — 큰 카드 */}
      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
        marginBottom: 20, animation: "lang-fade-in 0.5s ease 0.1s both",
      }}>
        {majorLangs.map((l) => (
          <button
            key={l.code}
            className="lang-card-hover"
            onClick={() => onSelect(l.code)}
            onMouseEnter={() => setHovered(l.code)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              padding: "20px 28px", minWidth: 110, borderRadius: 20,
              background: hovered === l.code
                ? "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(59,130,246,0.25))"
                : "rgba(255,255,255,0.07)",
              border: hovered === l.code
                ? "2px solid rgba(124,58,237,0.8)"
                : "2px solid rgba(255,255,255,0.12)",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ fontSize: 36 }}>{l.flag}</span>
            <span style={{ color: "#fff", fontSize: 15, fontWeight: 800 }}>{l.label}</span>
            <span style={{ color: "#94a3b8", fontSize: 11 }}>
              {PICK_TEXT[l.code as LangCode].split(" ").slice(0, 2).join(" ")}
            </span>
          </button>
        ))}
      </div>

      {/* 구분선 */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%", maxWidth: 560,
        marginBottom: 16, animation: "lang-fade-in 0.5s ease 0.2s both",
      }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        <span style={{ color: "#475569", fontSize: 11, whiteSpace: "nowrap" }}>Other languages</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
      </div>

      {/* 나머지 11개 언어 — 작은 버튼 */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center",
        maxWidth: 560, animation: "lang-fade-in 0.5s ease 0.25s both",
      }}>
        {otherLangs.map((l) => (
          <button
            key={l.code}
            className="lang-mini-hover"
            onClick={() => onSelect(l.code)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 20,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer", color: "#cbd5e1", fontSize: 12, fontWeight: 600,
            }}
          >
            <span style={{ fontSize: 16 }}>{l.flag}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>

      <p style={{
        color: "#334155", fontSize: 11, marginTop: 28,
        animation: "lang-fade-in 0.5s ease 0.35s both",
        textAlign: "center",
      }}>
        You can change the language anytime from the button at the bottom-left.
      </p>
    </div>
  );
}

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
  const [showLangPicker, setShowLangPicker] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as LangCode | null;
    if (saved && LANGUAGES.find((l) => l.code === saved)) {
      setLangState(saved);
      // 이미 선택한 적 있으면 팝업 안 띄움
    } else {
      // 첫 방문 — 언어 선택 팝업
      setShowLangPicker(true);
    }
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  function handlePickLang(l: LangCode) {
    setLang(l);
    setShowLangPicker(false);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {showLangPicker && <LangSelectModal onSelect={handlePickLang} />}
      {children}
      <FloatingLanguageSelector />
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
