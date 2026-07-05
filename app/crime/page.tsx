"use client";
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

export default function CrimeCenterPage() {
  const router = useRouter();
  const { lang } = useLang();

  return (
    <div style={{ minHeight: "100vh", background: "#f2eaf6", color: "#2a1a3a" }}>

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
          background: "linear-gradient(135deg, #9161b2, #7c4da8)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Shield size={14} color="#fff" />
        </div>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: "#1c0d2e" }}>{t("crime_center_title", lang)}</h1>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "40px 40px" }}>

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
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>전화 사기 체험</span>
              <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>NEW</span>
            </div>
            <p style={{ color: "#dcc5e8", fontSize: 13 }}>삼성·아이폰 실제 통화 화면 + AI 목소리로 체험</p>
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
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>문자 사기 체험 (스미싱)</span>
              <span style={{ background: "#a855f7", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>NEW</span>
            </div>
            <p style={{ color: "#dcc5e8", fontSize: 13 }}>택배·건강보험·카드 사기 문자를 3분간 직접 체험</p>
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
            <p style={{ color: "#22c55e", fontWeight: 800, fontSize: 14, marginBottom: 6 }}>어린이 친구들에게 🌟</p>
            <p style={{ color: "#86efac", fontSize: 13, lineHeight: 1.9 }}>
              이 프로그램은 <strong style={{ color: "#fff" }}>나쁜 사람들의 수법을 미리 알려줘서 속지 않게</strong> 도와주는 곳이에요.<br />
              여기서 배운 것들은 절대로 다른 사람에게 써먹으면 안 돼요.<br />
              <strong style={{ color: "#fbbf24" }}>범죄는 상대방 마음에 평생 남는 상처를 남겨요.</strong> 절대 하면 안 된답니다! 🙅
            </p>
          </div>
        </div>

        {/* ⚖️ 어린이 법률 안내 */}
        <div style={{
          background: "linear-gradient(135deg,#1a0a0a,#2a0a0a)",
          border: "1px solid #ef444444",
          borderRadius: 18, padding: "16px 18px", marginBottom: 16,
        }}>
          <p style={{ color: "#ef4444", fontWeight: 800, fontSize: 13, marginBottom: 10 }}>⚖️ 이 프로그램의 내용을 실제로 따라 하면?</p>
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
          <p style={{ color: "#6b7280", fontSize: 11, marginTop: 10, lineHeight: 1.7 }}>
            💡 만 14세 미만은 소년법으로 보호받지만, 14세 이상이면 형사처벌을 받을 수 있어요. 친구들, 이 체험은 <strong style={{ color: "#22c55e" }}>당하지 않기 위한 연습</strong>이에요!
          </p>
          <p style={{ color: "#f87171", fontSize: 11, marginTop: 6, lineHeight: 1.7, fontWeight: 600 }}>
            ⚠️ 소년법 보호를 받더라도 <strong style={{ color: "#fca5a5" }}>안전한 게 아니에요</strong> — 보호처분·소년원 송치·피해자 민사소송은 나이 제한 없이 적용돼요.
          </p>
        </div>

        {/* 새 체험 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 10 }}>
          {[
            { path: "/crime/quiz", icon: "🕵️", label: "사기 판별 퀴즈", sub: "진짜 vs 가짜 맞추기", bg: "linear-gradient(135deg,#3d1f5a,#7c3aed)", border: "#7c3aed" },
            { path: "/crime/used-trade", icon: "🥕", label: "중고거래 사기", sub: "피망마켓 사기 체험", bg: "linear-gradient(135deg,#7c2d00,#ea580c)", border: "#ea580c" },
            { path: "/crime/sns-invest", icon: "📸", label: "SNS 투자 사기", sub: "인스타 DM 사기 체험", bg: "linear-gradient(135deg,#500724,#be185d)", border: "#be185d" },
          ].map((item) => (
            <button key={item.path} onClick={() => router.push(item.path)} style={{ background: item.bg, border: `1px solid ${item.border}44`, borderRadius: 14, padding: "14px 10px", cursor: "pointer", textAlign: "center" as const, transition: "transform 0.15s", position: "relative" as const }}
              onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
              <div style={{ fontSize: 24, marginBottom: 5 }}>{item.icon}</div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 11, marginBottom: 2 }}>{item.label}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}>{item.sub}</p>
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { path: "/crime/deepfake", icon: "🎭", label: "AI 딥페이크 사기", sub: "가족 사칭 영상통화", bg: "linear-gradient(135deg,#2e1065,#7c3aed)", border: "#7c3aed", isNew: false },
            { path: "/crime/ai-crimes", icon: "🤖", label: "AI 범죄 체험관", sub: "딥페이크·음성복제 등", bg: "linear-gradient(135deg,#1a0000,#7c0000)", border: "#dc2626", isNew: false },
            { path: "/crime/ai-detective", icon: "🏆", label: "AI 탐정 도전!", sub: "가짜 영상 찾고 뱃지 획득", bg: "linear-gradient(135deg,#1a1000,#7c5200)", border: "#fbbf24", isNew: true },
          ].map((item) => (
            <button key={item.path} onClick={() => router.push(item.path)} style={{ background: item.bg, border: `1px solid ${item.border}44`, borderRadius: 14, padding: "14px 10px", cursor: "pointer", textAlign: "center" as const, transition: "transform 0.15s", position: "relative" as const }}
              onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
              <div style={{ fontSize: 24, marginBottom: 5 }}>{item.icon}</div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 11, marginBottom: 2 }}>{item.label}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}>{item.sub}</p>
              {item.isNew && <span style={{ position: "absolute" as const, top: 7, right: 7, background: "#fbbf24", color: "#000", fontSize: 7, fontWeight: 900, padding: "2px 5px", borderRadius: 8 }}>NEW</span>}
            </button>
          ))}
        </div>

        {/* 시나리오 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 40 }}>
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
