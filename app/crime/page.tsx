"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, ChevronRight, Phone } from "lucide-react";
import { CRIME_SCENARIOS } from "@/lib/crimes";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { SCENARIO_TYPES } from "@/lib/scenarioTypes";

const SCENARIO_KEYS: Record<string, {
  title: keyof ReturnType<typeof import("@/lib/i18n")["t"] extends (k: infer K, l: never) => string ? never : never>;
}> = {};

// 시나리오별 번역 키 매핑
const SC_TITLE_MAP: Record<string, string> = {
  "family-impersonation":    "sc_family_title",
  "prosecutor-impersonation":"sc_prosecutor_title",
  "romance-scam":            "sc_romance_title",
  "investment-scam":         "sc_invest_title",
  "loan-fraud":              "sc_loan_title",
  "delivery-scam":           "sc_delivery_title",
  "kakaotalk-impersonation": "sc_kakao_title",
  "used-goods-scam":         "sc_used_title",
  "illegal-gambling":        "sc_gambling_title",
  "link-download-scam":      "sc_link_title",
  "sympathy-scam":           "sc_sympathy_title",
  "jeonse-scam":             "sc_jeonse_title",
  "deepfake-blackmail":      "sc_deepfake_title",
};
const SC_SUB_MAP: Record<string, string> = {
  "family-impersonation":    "sc_family_sub",
  "prosecutor-impersonation":"sc_prosecutor_sub",
  "romance-scam":            "sc_romance_sub",
  "investment-scam":         "sc_invest_sub",
  "loan-fraud":              "sc_loan_sub",
  "delivery-scam":           "sc_delivery_sub",
  "kakaotalk-impersonation": "sc_kakao_sub",
  "used-goods-scam":         "sc_used_sub",
  "illegal-gambling":        "sc_gambling_sub",
  "link-download-scam":      "sc_link_sub",
  "sympathy-scam":           "sc_sympathy_sub",
  "jeonse-scam":             "sc_jeonse_sub",
  "deepfake-blackmail":      "sc_deepfake_sub",
};
const CAT_MAP: Record<string, string> = {
  "family-impersonation":    "cat_voice",
  "prosecutor-impersonation":"cat_agency",
  "romance-scam":            "cat_romance",
  "investment-scam":         "cat_invest",
  "loan-fraud":              "cat_loan",
  "delivery-scam":           "cat_smishing",
  "kakaotalk-impersonation": "cat_messenger",
  "used-goods-scam":         "cat_used",
  "illegal-gambling":        "cat_gambling",
  "link-download-scam":      "cat_smishing",
  "sympathy-scam":           "cat_sympathy",
  "jeonse-scam":             "cat_realestate",
  "deepfake-blackmail":      "cat_deepfake",
  "job-scam":                "cat_used",
  "drug-sns":                "cat_messenger",
  "fss-impersonation":       "cat_agency",
  "weapon-deal-accident":    "cat_deepfake",
  "telegram-drug":           "cat_messenger",
  "illegal-gun-trade":       "cat_deepfake",
  "gun-purchase-scam":       "cat_deepfake",
  "smarthome-ransomware":    "cat_smishing",
  "dna-scam":                "cat_deepfake",
  "metaverse-fraud":         "cat_invest",
};

const REPORT_NUMBERS = [
  { labelKey: "report_police",  number: "112",  color: "#9161b2" },
  { labelKey: "report_fss",     number: "1332", color: "#0891b2" },
  { labelKey: "report_kisa",    number: "118",  color: "#059669" },
  { labelKey: "report_gamble",  number: "1336", color: "#7c3aed" },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

export default function CrimeCenterPage() {
  const router = useRouter();
  const { lang } = useLang();
  const isMobile = useIsMobile();

  return (
    <div style={{ minHeight: "100vh", background: "#f2eaf6", color: "#2a1a3a" }}>

      {/* 헤더 */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", gap: 12,
        padding: isMobile ? "0 16px" : "0 40px", height: 60,
        boxShadow: "0 1px 8px #0000000a",
      }}>
        <button
          onClick={() => router.push("/")}
          style={{ padding: 8, background: "none", border: "none", cursor: "pointer", color: "#64748b",
            display: "flex", alignItems: "center", borderRadius: 8 }}
        >
          <ArrowLeft size={18} />
        </button>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: "linear-gradient(135deg, #9161b2, #7c4da8)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Shield size={14} color="#fff" />
        </div>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: "#1c0d2e" }}>{t("crime_center_title", lang)}</h1>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: isMobile ? "20px 16px" : "40px 40px" }}>

        {/* 안내 배너 */}
        <div style={{
          background: "linear-gradient(135deg, #f5dfee, #f0fdf4)",
          border: "1px solid #dcc5e8", borderRadius: 20, padding: "20px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 40, flexWrap: "wrap", gap: 16,
          boxShadow: "0 2px 12px #9161b20a",
        }}>
          <div>
            <p style={{ color: "#7c3aed", fontWeight: 700, fontSize: 15, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={16} color="#9161b2" /> {t("crime_free_badge", lang)}
            </p>
            <p style={{ color: "#a57cbb", fontSize: 13, lineHeight: 1.6 }}>
              {t("crime_free_desc", lang)}
            </p>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {REPORT_NUMBERS.map((r) => (
              <a key={r.number} href={`tel:${r.number}`} style={{ textDecoration: "none", textAlign: "center" }}>
                <p style={{ color: "#94a3b8", fontSize: 10, marginBottom: 2 }}>{t(r.labelKey as Parameters<typeof t>[0], lang)}</p>
                <p style={{ color: r.color, fontWeight: 900, fontSize: 22 }}>{r.number}</p>
              </a>
            ))}
          </div>
        </div>

        {/* 섹션 제목 */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>{t("crime_select_hint", lang)}</p>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: "#1c0d2e" }}>{t("crime_select_title", lang)}</h2>
        </div>

        {/* 📞 전화 사기 체험 배너 */}
        <button
          onClick={() => router.push("/crime/voice-call")}
          style={{
            width: "100%", marginBottom: 20, padding: "20px 22px", borderRadius: 20,
            background: "linear-gradient(135deg, #160a26, #3d1f5a)",
            border: "1px solid #3d1f5a",
            cursor: "pointer", textAlign: "left",
            display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 4px 20px #0000001a",
          }}
        >
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: "linear-gradient(135deg, #7c3aed, #a57cbb)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0,
          }}>📞</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{t("crime_voice_title", lang)}</span>
              <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>NEW</span>
            </div>
            <p style={{ color: "#dcc5e8", fontSize: 13 }}>{t("crime_voice_sub", lang)}</p>
          </div>
          <ChevronRight size={18} color="#c58dc6" style={{ flexShrink: 0 }} />
        </button>

        {/* 📱 문자 사기 체험 배너 */}
        <button
          onClick={() => router.push("/crime/sms-chat")}
          style={{
            width: "100%", marginBottom: 20, padding: "20px 22px", borderRadius: 20,
            background: "linear-gradient(135deg, #0f0a28, #1e1050)",
            border: "1px solid #2e1065",
            cursor: "pointer", textAlign: "left",
            display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 4px 20px #0000001a",
          }}
        >
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0,
          }}>📱</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{t("crime_sms_title", lang)}</span>
              <span style={{ background: "#a855f7", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>NEW</span>
            </div>
            <p style={{ color: "#dcc5e8", fontSize: 13 }}>{t("crime_sms_sub", lang)}</p>
          </div>
          <ChevronRight size={18} color="#c58dc6" style={{ flexShrink: 0 }} />
        </button>

        {/* 🧒 어린이 범죄 예방 멘트 */}
        <div style={{
          background: "linear-gradient(135deg,#1a102a,#0f2010)",
          border: "1px solid #22c55e44",
          borderRadius: 18, padding: "18px 20px", marginBottom: 10,
          display: "flex", gap: 14, alignItems: "flex-start",
        }}>
          <div style={{ fontSize: 32, flexShrink: 0 }}>🧒</div>
          <div>
            <p style={{ color: "#22c55e", fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{t("crime_child_title", lang)}</p>
            <p style={{ color: "#86efac", fontSize: 13, lineHeight: 1.9 }}
              dangerouslySetInnerHTML={{ __html: t("crime_child_body", lang).replace(/\n/g, "<br />") }}
            />
          </div>
        </div>

        {/* ⚖️ 어린이 법률 안내 */}
        <div style={{
          background: "linear-gradient(135deg,#1a0a0a,#2a0a0a)",
          border: "1px solid #ef444444",
          borderRadius: 18, padding: "16px 18px", marginBottom: 16,
        }}>
          <p style={{ color: "#ef4444", fontWeight: 800, fontSize: 13, marginBottom: 10 }}>{t("crime_legal_title", lang)}</p>
          {[
            { icon: "📞", act: "전화로 \"경찰이에요\" 하고 속이면", law: "사기죄 (형법 제347조)", penalty: "최대 10년 징역" },
            { icon: "💬", act: "문자로 링크 보내 정보 빼내면", law: "정보통신망법 제49조", penalty: "최대 5년 징역" },
            { icon: "🎭", act: "친구 사진·영상을 AI로 만들어 퍼뜨리면", law: "성폭력처벌법·정보통신망법", penalty: "최대 5년 징역" },
            { icon: "🎰", act: "불법 도박 사이트에서 돈을 걸면", law: "게임산업진흥법·형법 제246조", penalty: "최대 3년 징역 또는 벌금" },
            { icon: "🥕", act: "물건 판다고 속이고 돈만 받으면", law: "사기죄 (형법 제347조)", penalty: "최대 10년 징역" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < 4 ? 8 : 0, padding: "8px 10px", background: "rgba(239,68,68,0.06)", borderRadius: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#fca5a5", fontSize: 12, marginBottom: 2 }}>{item.act}</p>
                <p style={{ color: "#ef4444", fontSize: 11, fontWeight: 700 }}>→ <span style={{ color: "#fbbf24" }}>{item.law}</span>에 의해 <span style={{ color: "#f87171" }}>{item.penalty}</span>이에요!</p>
              </div>
            </div>
          ))}
          <p style={{ color: "#6b7280", fontSize: 11, marginTop: 10, lineHeight: 1.7 }}>{t("crime_legal_note", lang)}</p>
          <p style={{ color: "#f87171", fontSize: 11, marginTop: 6, lineHeight: 1.7, fontWeight: 600 }}>{t("crime_legal_warn", lang)}</p>
        </div>

        {/* 새 체험 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 10, marginBottom: 10 }}>
          {[
            { path: "/crime/quiz", icon: "🕵️", labelKey: "crime_grid_quiz", subKey: "crime_grid_quiz_sub", bg: "linear-gradient(135deg,#3d1f5a,#7c3aed)", border: "#7c3aed" },
            { path: "/crime/used-trade", icon: "🥕", labelKey: "crime_grid_used", subKey: "crime_grid_used_sub", bg: "linear-gradient(135deg,#7c2d00,#ea580c)", border: "#ea580c" },
            { path: "/crime/sns-invest", icon: "📸", labelKey: "crime_grid_sns", subKey: "crime_grid_sns_sub", bg: "linear-gradient(135deg,#500724,#be185d)", border: "#be185d" },
          ].map((item) => (
            <button key={item.path} onClick={() => router.push(item.path)} style={{ background: item.bg, border: `1px solid ${item.border}44`, borderRadius: 14, padding: "14px 10px", cursor: "pointer", textAlign: "center" as const, transition: "transform 0.15s", position: "relative" as const }}
              onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
              <div style={{ fontSize: 24, marginBottom: 5 }}>{item.icon}</div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 11, marginBottom: 2 }}>{t(item.labelKey as Parameters<typeof t>[0], lang)}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}>{t(item.subKey as Parameters<typeof t>[0], lang)}</p>
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { path: "/crime/deepfake", icon: "🎭", labelKey: "crime_grid_deepfake", subKey: "crime_grid_deepfake_sub", bg: "linear-gradient(135deg,#2e1065,#7c3aed)", border: "#7c3aed", isNew: false },
            { path: "/crime/ai-crimes", icon: "🤖", labelKey: "crime_grid_ai", subKey: "crime_grid_ai_sub", bg: "linear-gradient(135deg,#1a0000,#7c0000)", border: "#dc2626", isNew: false },
            { path: "/crime/ai-detective", icon: "🏆", labelKey: "crime_grid_detective", subKey: "crime_grid_detective_sub", bg: "linear-gradient(135deg,#1a1000,#7c5200)", border: "#fbbf24", isNew: true },
          ].map((item) => (
            <button key={item.path} onClick={() => router.push(item.path)} style={{ background: item.bg, border: `1px solid ${item.border}44`, borderRadius: 14, padding: "14px 10px", cursor: "pointer", textAlign: "center" as const, transition: "transform 0.15s", position: "relative" as const }}
              onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
              <div style={{ fontSize: 24, marginBottom: 5 }}>{item.icon}</div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 11, marginBottom: 2 }}>{t(item.labelKey as Parameters<typeof t>[0], lang)}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}>{t(item.subKey as Parameters<typeof t>[0], lang)}</p>
              {item.isNew && <span style={{ position: "absolute" as const, top: 7, right: 7, background: "#fbbf24", color: "#000", fontSize: 7, fontWeight: 900, padding: "2px 5px", borderRadius: 8 }}>NEW</span>}
            </button>
          ))}
        </div>

        {/* 시나리오 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: isMobile ? 10 : 14, marginBottom: 40 }}>
          {CRIME_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => router.push(scenario.id === "illegal-gambling" ? "/gambling" : `/crime/${scenario.id}`)}
              style={{
                display: "flex", alignItems: "center", gap: 18,
                background: "#fdf8ff", borderRadius: 20, padding: "18px 22px",
                border: "1px solid #f1f5f9", cursor: "pointer", textAlign: "left",
                transition: "all 0.2s", boxShadow: "0 2px 10px #0000000a",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 6px 24px ${scenario.color}18`;
                e.currentTarget.style.borderColor = scenario.color + "40";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 10px #0000000a";
                e.currentTarget.style.borderColor = "#f1f5f9";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: scenario.color + "14",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
              }}>
                {scenario.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                  <span style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 15 }}>
                    {SC_TITLE_MAP[scenario.id] ? t(SC_TITLE_MAP[scenario.id] as Parameters<typeof t>[0], lang) : scenario.title}
                  </span>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700,
                    background: scenario.color + "14", color: scenario.color,
                    border: `1px solid ${scenario.color}28`,
                  }}>
                    {CAT_MAP[scenario.id] ? t(CAT_MAP[scenario.id] as Parameters<typeof t>[0], lang) : scenario.reveal.crimeName.split(" ")[0]}
                  </span>
                  {scenario.targetAge === "senior" && (
                    <span style={{
                      fontSize: 10, padding: "2px 8px", borderRadius: 20,
                      background: "#fff7ed", color: "#c2410c",
                      border: "1px solid #fed7aa", fontWeight: 700,
                    }}>
                      {t("senior_warning", lang)}
                    </span>
                  )}
                </div>
                <p style={{ color: "#64748b", fontSize: 13 }}>
                  {SC_SUB_MAP[scenario.id] ? t(SC_SUB_MAP[scenario.id] as Parameters<typeof t>[0], lang) : scenario.subtitle}
                </p>
                {/* 유형 태그 */}
                {SCENARIO_TYPES[scenario.id] && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                    {SCENARIO_TYPES[scenario.id].variants.map((v) => (
                      <span key={v.label} style={{
                        fontSize: 10, padding: "2px 7px", borderRadius: 20,
                        background: v.isThis ? scenario.color + "18" : "#f1f5f9",
                        color: v.isThis ? scenario.color : "#94a3b8",
                        border: v.isThis ? `1px solid ${scenario.color}30` : "1px solid #e2e8f0",
                        fontWeight: v.isThis ? 700 : 500,
                      }}>
                        {v.icon} {v.label}{v.isThis ? " ✓" : ""}
                      </span>
                    ))}
                  </div>
                )}
                <p style={{ color: "#94a3b8", fontSize: 11, marginTop: 5 }}>{scenario.reveal.stats}</p>
              </div>
              <ChevronRight size={16} color="#cbd5e1" style={{ flexShrink: 0 }} />
            </button>
          ))}
        </div>

        {/* 신고 번호 */}
        <div style={{
          background: "#fdf8ff", border: "1px solid #e2e8f0",
          borderRadius: 20, padding: "24px 28px",
          boxShadow: "0 2px 12px #0000000a",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Phone size={14} color="#dc2626" />
            <p style={{ color: "#dc2626", fontWeight: 700, fontSize: 13 }}>{t("crime_report_title", lang)}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12 }}>
            {REPORT_NUMBERS.map((item) => (
              <a key={item.number} href={`tel:${item.number}`} style={{
                background: "#f8fafc", borderRadius: 12, padding: "14px 16px",
                textDecoration: "none", display: "block",
                border: "1px solid #f1f5f9", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = item.color + "0a";
                e.currentTarget.style.borderColor = item.color + "30";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.borderColor = "#f1f5f9";
              }}>
                <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>{t(item.labelKey as Parameters<typeof t>[0], lang)}</p>
                <p style={{ color: item.color, fontWeight: 900, fontSize: 26 }}>{item.number}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
