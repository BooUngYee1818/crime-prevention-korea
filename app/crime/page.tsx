"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, ChevronRight, Phone } from "lucide-react";
import { CRIME_SCENARIOS } from "@/lib/crimes";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

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
};

const REPORT_NUMBERS = [
  { labelKey: "report_police",  number: "112",  color: "#2563eb" },
  { labelKey: "report_fss",     number: "1332", color: "#0891b2" },
  { labelKey: "report_kisa",    number: "118",  color: "#059669" },
  { labelKey: "report_gamble",  number: "1336", color: "#7c3aed" },
];

export default function CrimeCenterPage() {
  const router = useRouter();
  const { lang } = useLang();

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", color: "#1e293b" }}>

      {/* 헤더 */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", gap: 12,
        padding: "0 40px", height: 60,
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
          background: "linear-gradient(135deg, #2563eb, #4f46e5)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Shield size={14} color="#fff" />
        </div>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{t("crime_center_title", lang)}</h1>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "40px 40px" }}>

        {/* 안내 배너 */}
        <div style={{
          background: "linear-gradient(135deg, #eff6ff, #f0fdf4)",
          border: "1px solid #bfdbfe", borderRadius: 20, padding: "20px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 40, flexWrap: "wrap", gap: 16,
          boxShadow: "0 2px 12px #2563eb0a",
        }}>
          <div>
            <p style={{ color: "#1d4ed8", fontWeight: 700, fontSize: 15, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={16} color="#2563eb" /> {t("crime_free_badge", lang)}
            </p>
            <p style={{ color: "#3b82f6", fontSize: 13, lineHeight: 1.6 }}>
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
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: "#0f172a" }}>{t("crime_select_title", lang)}</h2>
        </div>

        {/* 시나리오 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 40 }}>
          {CRIME_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => router.push(scenario.id === "illegal-gambling" ? "/gambling" : `/crime/${scenario.id}`)}
              style={{
                display: "flex", alignItems: "center", gap: 18,
                background: "#fff", borderRadius: 20, padding: "18px 22px",
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
                  <span style={{ color: "#0f172a", fontWeight: 700, fontSize: 15 }}>
                    {t((SC_TITLE_MAP[scenario.id] ?? "sc_gambling_title") as Parameters<typeof t>[0], lang)}
                  </span>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700,
                    background: scenario.color + "14", color: scenario.color,
                    border: `1px solid ${scenario.color}28`,
                  }}>
                    {t((CAT_MAP[scenario.id] ?? "cat_gambling") as Parameters<typeof t>[0], lang)}
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
                  {t((SC_SUB_MAP[scenario.id] ?? "sc_gambling_sub") as Parameters<typeof t>[0], lang)}
                </p>
                <p style={{ color: "#94a3b8", fontSize: 11, marginTop: 3 }}>{scenario.reveal.stats}</p>
              </div>
              <ChevronRight size={16} color="#cbd5e1" style={{ flexShrink: 0 }} />
            </button>
          ))}
        </div>

        {/* 신고 번호 */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: 20, padding: "24px 28px",
          boxShadow: "0 2px 12px #0000000a",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Phone size={14} color="#dc2626" />
            <p style={{ color: "#dc2626", fontWeight: 700, fontSize: 13 }}>{t("crime_report_title", lang)}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
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
