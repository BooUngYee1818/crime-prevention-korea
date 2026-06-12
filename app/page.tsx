"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Shield, Phone, ChevronRight, BookOpen, Users, AlertCircle, ExternalLink, X } from "lucide-react";
import { CRIME_SCENARIOS } from "@/lib/crimes";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

const STATS = [
  { value: "1조원+", label: "2025년 보이스피싱 피해액", icon: "📉", bg: "#fef2f2", color: "#dc2626" },
  { value: "7.8만건", label: "연간 피해 신고 건수", icon: "📋", bg: "#fff7ed", color: "#ea580c" },
  { value: "5,290만원", label: "1건당 평균 피해액", icon: "💸", bg: "#fefce8", color: "#ca8a04" },
  { value: "200만명", label: "도박 중독 추정 인구", icon: "⚠️", bg: "#fdf4ff", color: "#9333ea" },
];

const CATEGORY_LABELS: Record<string, string> = {
  "family-impersonation": "보이스피싱",
  "prosecutor-impersonation": "기관 사칭",
  "romance-scam": "로맨스 스캠",
  "investment-scam": "투자 사기",
  "loan-fraud": "대출 사기",
  "delivery-scam": "스미싱",
  "kakaotalk-impersonation": "메신저 사기",
  "used-goods-scam": "중고거래 사기",
  "illegal-gambling": "불법 도박",
};

const REPORT_NUMBERS = [
  { org: "경찰청 신고", number: "112", desc: "즉각 신고·수사", color: "#2563eb" },
  { org: "금융감독원", number: "1332", desc: "금융 피해 상담", color: "#0891b2" },
  { org: "인터넷진흥원", number: "118", desc: "스미싱·해킹 신고", color: "#059669" },
  { org: "도박중독 상담", number: "1336", desc: "24시간 무료 상담", color: "#7c3aed" },
];

// ── 무지개 글로우 keyframe ──
const RAINBOW_STYLE = `
@keyframes rainbow-glow {
  0%   { box-shadow: 0 0 14px 4px #ff0000aa; border-color: #ff0000; }
  16%  { box-shadow: 0 0 14px 4px #ff8800aa; border-color: #ff8800; }
  33%  { box-shadow: 0 0 14px 4px #ffff00aa; border-color: #ffff00; }
  50%  { box-shadow: 0 0 14px 4px #00cc44aa; border-color: #00cc44; }
  66%  { box-shadow: 0 0 14px 4px #2563ebaa; border-color: #2563eb; }
  83%  { box-shadow: 0 0 14px 4px #9333eaaa; border-color: #9333ea; }
  100% { box-shadow: 0 0 14px 4px #ff0000aa; border-color: #ff0000; }
}
@keyframes rainbow-text {
  0%   { color: #ff4444; }
  16%  { color: #ff8800; }
  33%  { color: #d4a000; }
  50%  { color: #16a34a; }
  66%  { color: #2563eb; }
  83%  { color: #9333ea; }
  100% { color: #ff4444; }
}
`;

// ── 이용 가이드 탭 데이터 ──
const GUIDE_TABS = [
  {
    id: "parents",
    label: "👴👵 부모님께 알려드릴 때",
    subtitle: "자녀가 부모님을 도와드리는 방법",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    steps: [
      {
        icon: "📺",
        title: "이렇게 설명해 드리세요",
        desc: `"아버지/어머니, 요즘 전화로 돈 빼앗는 사람들이 많아서 제가 연습 프로그램 찾았어요. 진짜 같은데 돈은 하나도 안 나가요. 한번 해볼까요?"`,
      },
      {
        icon: "🖥️",
        title: "앉아서 함께 화면을 보세요",
        desc: "처음엔 부모님 옆에서 함께 진행하세요. '이런 전화가 오면 이렇게 하시면 돼요'라고 설명하며 시나리오를 골라드리세요.",
      },
      {
        icon: "📞",
        title: "추천 시나리오 (부모님용)",
        desc: "① 자녀 사칭 보이스피싱  ② 검찰·경찰 사칭  ③ 대출 사기 — 이 3가지가 어르신 피해 1~3위입니다.",
      },
      {
        icon: "💬",
        title: "체험 후 꼭 나눠보세요",
        desc: `"이런 전화 실제로 오면 끊으시고 저한테 전화 주세요." 한 마디가 실제 사기를 막습니다.`,
      },
    ],
  },
  {
    id: "mom",
    label: "👩‍👧 자녀 교육으로 활용할 때",
    subtitle: "초등학생부터 중·고등학생 자녀와 함께",
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#fbcfe8",
    steps: [
      {
        icon: "🎮",
        title: "게임처럼 접근하세요",
        desc: `"AI랑 대화하는 건데, 이 사람이 사기꾼이래. 너가 안 속으면 이기는 거야!" — 아이들이 흥미를 느끼는 방식으로 시작하세요.`,
      },
      {
        icon: "📱",
        title: "추천 시나리오 (자녀용)",
        desc: "① 중고거래 사기 (초등 고학년~)  ② 불법 도박  ③ 스미싱 — 아이들이 실제로 많이 노출되는 수법입니다.",
      },
      {
        icon: "🗣️",
        title: "체험 중 함께 대화하세요",
        desc: `"이 사람 뭔가 이상하지 않아?" "왜 돈을 달라는 것 같아?" 질문을 던지며 아이 스스로 생각하게 유도하세요.`,
      },
      {
        icon: "✅",
        title: "마지막에 약속을 만드세요",
        desc: `"모르는 사람이 돈 얘기 하면 엄마한테 먼저 얘기해줄 수 있어?" 체험 후 간단한 약속이 아이를 지킵니다.`,
      },
    ],
  },
  {
    id: "edu",
    label: "🏫 교육기관 활용 방법",
    subtitle: "학교·복지관·경로당·기업 교육 담당자",
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    steps: [
      {
        icon: "🖥️",
        title: "수업·강의 도입부에 활용",
        desc: "빔 프로젝터로 전체 화면을 띄우고 강사가 직접 시나리오를 진행하며 학생들의 반응을 유도하세요. 15~20분이면 충분합니다.",
      },
      {
        icon: "👥",
        title: "조별 체험 활동으로 활용",
        desc: "2~3명씩 조를 만들어 각자 다른 시나리오를 체험하고 발표하게 하세요. '내가 어떻게 속을 뻔했는지' 이야기하는 것이 핵심입니다.",
      },
      {
        icon: "📊",
        title: "통계 데이터 수업 자료로 활용",
        desc: "상단 '📊 범죄 통계' 버튼의 공식 데이터를 수업 자료로 활용하세요. 경찰청·금감원 출처 링크가 모두 포함되어 있습니다.",
      },
      {
        icon: "📋",
        title: "기관 도입 문의",
        desc: "기관 전용 커스터마이징, 수료증 발급, 통계 리포트가 필요하시면 '기관 도입' 버튼에서 무료로 문의하세요.",
      },
    ],
  },
];

export default function HomePage() {
  const router = useRouter();
  const { lang } = useLang();
  const [popup1Open, setPopup1Open] = useState(false);
  const [popup2Open, setPopup2Open] = useState(false);
  const [guideTab, setGuideTab] = useState("parents");

  useEffect(() => {
    const t = setTimeout(() => setPopup1Open(true), 600);
    return () => clearTimeout(t);
  }, []);

  function closePopup1() {
    setPopup1Open(false);
    setTimeout(() => setPopup2Open(true), 400);
  }

  const activeTab = GUIDE_TABS.find(t => t.id === guideTab) || GUIDE_TABS[0];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", color: "#1e293b" }}>
      <style>{RAINBOW_STYLE}</style>

      {/* ── 팝업 1: 피해 신고 안내 ── */}
      {popup1Open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}>
          <div style={{
            background: "#fff", borderRadius: 24, padding: "36px 36px 32px",
            maxWidth: 520, width: "100%", position: "relative",
            boxShadow: "0 24px 80px #00000030",
          }}>
            <button onClick={closePopup1} style={{
              position: "absolute", top: 16, right: 16,
              width: 32, height: 32, borderRadius: "50%",
              background: "#f1f5f9", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <X size={16} color="#64748b" />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #2563eb, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                🛡️
              </div>
              <div>
                <p style={{ color: "#0f172a", fontWeight: 900, fontSize: 18 }}>{t("popup1_title", lang)}</p>
                <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 600 }}>{t("popup1_sub", lang)}</p>
              </div>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 16, padding: "18px 20px", marginBottom: 20, border: "1px solid #e2e8f0" }}>
              <p style={{ color: "#334155", fontSize: 14, lineHeight: 2 }}>
                {t("popup1_body1", lang)}<br /><br />
                {t("popup1_body2", lang)}
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setPopup1Open(false); router.push("/report"); }}
                style={{
                  flex: 1, padding: "14px 0", borderRadius: 14,
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  color: "#fff", border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: 14,
                  boxShadow: "0 4px 16px #dc262630",
                }}
              >
                🆘 신고 방법 알아보기
              </button>
              <button
                onClick={closePopup1}
                style={{
                  flex: 1, padding: "14px 0", borderRadius: 14,
                  background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                  color: "#fff", border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: 14,
                  boxShadow: "0 4px 16px #2563eb30",
                }}
              >
                체험 시작하기 →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 팝업 2: 이용 가이드 ── */}
      {popup2Open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}>
          <div style={{
            background: "#fff", borderRadius: 24, padding: "32px 32px 28px",
            maxWidth: 600, width: "100%", position: "relative",
            boxShadow: "0 24px 80px #00000030",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <button onClick={() => setPopup2Open(false)} style={{
              position: "absolute", top: 16, right: 16,
              width: 32, height: 32, borderRadius: "50%",
              background: "#f1f5f9", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <X size={16} color="#64748b" />
            </button>

            <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>HOW TO USE</p>
            <p style={{ color: "#0f172a", fontWeight: 900, fontSize: 20, marginBottom: 6 }}>누구와 함께 사용하시나요?</p>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 22 }}>상황에 맞는 활용 방법을 안내해 드립니다.</p>

            {/* 탭 */}
            <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
              {GUIDE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setGuideTab(tab.id)}
                  style={{
                    padding: "9px 16px", borderRadius: 22, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", border: "none", transition: "all 0.15s",
                    background: guideTab === tab.id ? tab.color : "#f1f5f9",
                    color: guideTab === tab.id ? "#fff" : "#64748b",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 탭 내용 */}
            <div style={{ background: activeTab.bg, borderRadius: 16, padding: "20px 22px", border: `1px solid ${activeTab.border}`, marginBottom: 20 }}>
              <p style={{ color: activeTab.color, fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{activeTab.subtitle}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {activeTab.steps.map((step) => (
                  <div key={step.title} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{step.icon}</span>
                    <div>
                      <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{step.title}</p>
                      <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.7 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setPopup2Open(false); router.push("/crime"); }}
              style={{
                width: "100%", padding: "14px 0", borderRadius: 14,
                background: `linear-gradient(135deg, ${activeTab.color}, ${activeTab.color}cc)`,
                color: "#fff", border: "none", cursor: "pointer",
                fontWeight: 700, fontSize: 15,
              }}
            >
              바로 체험 시작하기 →
            </button>
          </div>
        </div>
      )}

      {/* ── 무지개 고정 버튼 ── */}
      <button
        onClick={() => router.push("/report")}
        style={{
          position: "fixed", top: 80, right: 24, zIndex: 900,
          padding: "11px 18px", borderRadius: 24,
          background: "#fff", border: "2px solid #ff4444",
          cursor: "pointer", fontWeight: 700, fontSize: 13,
          animation: "rainbow-glow 3s linear infinite",
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 0 14px 4px #ff000066",
        }}
      >
        <span style={{ animation: "rainbow-text 3s linear infinite", fontWeight: 900 }}>🆘</span>
        <span style={{ animation: "rainbow-text 3s linear infinite" }}>2차 피해 예방 신고</span>
      </button>

      {/* ── 네비게이션 바 ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 62,
        boxShadow: "0 1px 8px #0000000a",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #2563eb, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#1e293b", letterSpacing: -0.3 }}>범죄예방 체험관</span>
            <span style={{
              marginLeft: 8, fontSize: 10, fontWeight: 600, color: "#2563eb",
              background: "#eff6ff", padding: "2px 7px", borderRadius: 20,
              border: "1px solid #bfdbfe",
            }}>교육 목적 전용</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="#scenarios" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>시나리오</a>
          <a href="#how" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>이용 방법</a>
          <a href="#report" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>신고 번호</a>
          <button
            onClick={() => router.push("/stats")}
            style={{
              padding: "9px 18px", borderRadius: 22,
              background: "#fefce8", color: "#ca8a04",
              border: "1px solid #fde68a", cursor: "pointer",
              fontSize: 13, fontWeight: 700,
            }}
          >
            📊 범죄 통계
          </button>
          <button
            onClick={() => router.push("/partnership")}
            style={{
              padding: "9px 18px", borderRadius: 22,
              background: "#f0fdf4", color: "#15803d",
              border: "1px solid #bbf7d0", cursor: "pointer",
              fontSize: 13, fontWeight: 700,
            }}
          >
            🏛️ 기관 도입
          </button>
          <button
            onClick={() => router.push("/crime")}
            style={{
              padding: "9px 22px", borderRadius: 22,
              background: "linear-gradient(135deg, #2563eb, #4f46e5)",
              color: "#fff", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 700,
              boxShadow: "0 2px 12px #2563eb40",
            }}
          >
            체험 시작 →
          </button>
        </div>
      </nav>

      {/* ── 히어로 섹션 ── */}
      <section style={{
        maxWidth: 1140, margin: "0 auto", padding: "80px 40px 70px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center",
      }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 20, padding: "6px 14px", marginBottom: 24,
          }}>
            <AlertCircle size={13} color="#dc2626" />
            <span style={{ color: "#dc2626", fontSize: 12, fontWeight: 700 }}>2025년 피해액 1조원 돌파</span>
          </div>

          <h1 style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, marginBottom: 20, letterSpacing: -1.5, color: "#0f172a" }}>
            {t("hero_title1", lang)}<br />
            <span style={{
              background: "linear-gradient(90deg, #2563eb, #7c3aed)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {t("hero_title2", lang)}
            </span>
          </h1>

          <p style={{ color: "#64748b", fontSize: 17, lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
            {t("hero_subtitle", lang)}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/crime")}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "15px 30px", borderRadius: 14,
                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                color: "#fff", border: "none", cursor: "pointer",
                fontSize: 15, fontWeight: 700,
                boxShadow: "0 4px 20px #2563eb40",
              }}
            >
              {t("hero_cta", lang)} <ChevronRight size={16} />
            </button>
            <a href="#scenarios" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "15px 22px", borderRadius: 14,
              background: "#fff", color: "#475569",
              border: "1px solid #e2e8f0", cursor: "pointer",
              fontSize: 15, textDecoration: "none", fontWeight: 500,
            }}>
              {t("nav_scenarios", lang)}
            </a>
          </div>

          <div style={{ display: "flex", gap: 20, marginTop: 24 }}>
            {(["완전 무료", "실제 돈 없음", "교육 전용"] as const).map((label) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ color: "#64748b", fontSize: 13 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 통계 카드 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              background: s.bg, borderRadius: 18, padding: "24px 20px",
              border: `1px solid ${s.color}20`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
              <p style={{ fontSize: 30, fontWeight: 900, color: s.color, marginBottom: 6, letterSpacing: -1 }}>{s.value}</p>
              <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>{s.label}</p>
            </div>
          ))}
          <div style={{
            gridColumn: "1 / -1",
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: 18, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <Shield size={18} color="#2563eb" style={{ flexShrink: 0 }} />
            <p style={{ color: "#1d4ed8", fontSize: 13, lineHeight: 1.5 }}>
              이 플랫폼은 순수 교육 목적입니다.{" "}
              <strong>AI가 사기범 역할을 연기</strong>하지만 실제 돈은 절대 나가지 않습니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 제작 목적 & 실제 통계 ── */}
      <section id="why" style={{
        background: "#fff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0",
        padding: "80px 40px",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>

          {/* 섹션 헤더 */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>WHY WE BUILT THIS</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#0f172a", marginBottom: 14 }}>
              왜 이 프로그램이 필요한가
            </h2>
            <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
              대한민국에서는 매년 수십만 명의 시민이 범죄에 속아 전 재산을 잃습니다.<br />
              <strong style={{ color: "#334155" }}>알면 막을 수 있습니다.</strong> 이 프로그램은 그 앎을 드리기 위해 만들어졌습니다.
            </p>
          </div>

          {/* 2열: 사기 피해 + 도박 피해 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>

            {/* 보이스피싱·사기 통계 */}
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 22, padding: "32px 30px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Phone size={18} color="#fff" />
                </div>
                <div>
                  <p style={{ color: "#dc2626", fontWeight: 800, fontSize: 16 }}>보이스피싱 · 사기 피해</p>
                  <p style={{ color: "#f87171", fontSize: 11 }}>출처: 경찰청 사이버범죄 통계 / 금융감독원</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { stat: "약 1조 2,000억원", desc: "2023년 보이스피싱 연간 피해액 (경찰청)", highlight: true },
                  { stat: "약 18,000건", desc: "2023년 보이스피싱 피해 신고 건수 (경찰청)", highlight: false },
                  { stat: "약 5,290만원", desc: "1건당 평균 피해액 — 노인 가구 연소득 초과 (금감원)", highlight: false },
                  { stat: "피해자 34%", desc: "60대 이상 고령자 — 가장 취약한 연령대 (경찰청)", highlight: false },
                  { stat: "연간 78,000건+", desc: "전체 사기 범죄 신고 건수 (경찰청 범죄통계)", highlight: false },
                ].map((row) => (
                  <div key={row.stat} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "10px 14px", borderRadius: 12,
                    background: row.highlight ? "#dc262610" : "transparent",
                    border: row.highlight ? "1px solid #fca5a5" : "none",
                  }}>
                    <span style={{ color: "#dc2626", fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>▸</span>
                    <div>
                      <p style={{ color: "#b91c1c", fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>{row.stat}</p>
                      <p style={{ color: "#64748b", fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>{row.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 도박 중독 통계 */}
            <div style={{
              background: "#fdf4ff", border: "1px solid #e9d5ff",
              borderRadius: 22, padding: "32px 30px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>
                  🎰
                </div>
                <div>
                  <p style={{ color: "#7c3aed", fontWeight: 800, fontSize: 16 }}>불법 도박 피해</p>
                  <p style={{ color: "#a78bfa", fontSize: 11 }}>출처: 한국도박문제관리센터(KCGP) / 한국형사정책연구원</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { stat: "추정 200만명", desc: "도박 중독 추정 인구 — 성인 인구의 약 5% (KCGP 2023)", highlight: true },
                  { stat: "연간 약 84조원", desc: "불법 도박 시장 규모 추정 (한국형사정책연구원)", highlight: false },
                  { stat: "중독자 30.4%", desc: "자살 충동 경험률 — 일반인의 10배 이상 (KCGP)", highlight: false },
                  { stat: "평균 빚 3,800만원", desc: "도박 중독으로 인한 평균 부채 (KCGP 상담 데이터)", highlight: false },
                  { stat: "36.9%", desc: "처음 도박을 시작한 계기가 '온라인/모바일' (KCGP 2022)", highlight: false },
                ].map((row) => (
                  <div key={row.stat} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "10px 14px", borderRadius: 12,
                    background: row.highlight ? "#7c3aed10" : "transparent",
                    border: row.highlight ? "1px solid #c4b5fd" : "none",
                  }}>
                    <span style={{ color: "#7c3aed", fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>▸</span>
                    <div>
                      <p style={{ color: "#6d28d9", fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>{row.stat}</p>
                      <p style={{ color: "#64748b", fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>{row.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 자살 통계 강조 배너 */}
          <div style={{
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            borderRadius: 20, padding: "28px 36px",
            display: "flex", alignItems: "center", gap: 32, marginBottom: 40,
            flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>통계청 사망원인통계 2022</p>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 22, lineHeight: 1.4, marginBottom: 6 }}>
                연간 <span style={{ color: "#f87171" }}>12,906명</span>이 스스로 목숨을 끊습니다
              </p>
              <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
                그 중 경제적 이유(사기 피해·도박 빚 포함)가 주요 원인 중 하나입니다.<br />
                <strong style={{ color: "#94a3b8" }}>단 한 명이라도 막을 수 있다면, 이 프로그램은 충분히 가치 있습니다.</strong>
              </p>
            </div>
            <div style={{
              display: "flex", flexDirection: "column", gap: 10, flexShrink: 0,
            }}>
              {[
                { n: "12,906명", l: "2022년 자살 사망자 (통계청)", c: "#f87171" },
                { n: "하루 35명", l: "매일 35명이 스스로 목숨을 끊습니다", c: "#fb923c" },
                { n: "1336", l: "도박중독 24시간 무료 상담 전화", c: "#a78bfa" },
              ].map((d) => (
                <div key={d.n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: d.c, fontWeight: 900, fontSize: 20, minWidth: 90 }}>{d.n}</span>
                  <span style={{ color: "#475569", fontSize: 12 }}>{d.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 제작자 소개 */}
          <div style={{
            background: "linear-gradient(135deg, #f0fdf4, #eff6ff)",
            border: "1px solid #bbf7d0",
            borderRadius: 20, padding: "32px 36px", marginBottom: 24,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #2563eb, #059669)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26,
              }}>
                🙋
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                  <p style={{ color: "#0f172a", fontWeight: 800, fontSize: 18 }}>만든 사람 이야기</p>
                  <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700,
                    background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0",
                  }}>일반 시민 제작</span>
                  <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700,
                    background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe",
                  }}>AI Claude와 협업</span>
                </div>
                <p style={{ color: "#334155", fontSize: 15, lineHeight: 1.95, marginBottom: 20 }}>
                  저는 법률 전문가도, 경찰도 아닌 <strong style={{ color: "#0f172a" }}>평범한 일반 시민</strong>입니다.<br />
                  뉴스에서 보이스피싱에 속아 전재산을 잃고, 도박 빚으로 삶을 포기하는<br />
                  이웃들의 이야기를 보며 &ldquo;내가 뭔가 할 수 있지 않을까&rdquo; 하는 마음으로 시작했습니다.<br /><br />
                  <strong style={{ color: "#0f172a" }}>Anthropic의 AI Claude</strong>와 함께 밤낮으로 직접 개발한 이 프로그램이<br />
                  단 한 명이라도 범죄 피해로부터 지킬 수 있다면, 그걸로 충분합니다.
                </p>
                {/* 편지 */}
                <div style={{
                  background: "#fffbf0", borderRadius: 16, padding: "28px 28px 24px",
                  border: "1px solid #fde68a",
                  boxShadow: "0 2px 12px #f59e0b0a",
                  position: "relative", overflow: "hidden",
                }}>
                  {/* 편지지 줄 배경 */}
                  <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #fde68a44 31px, #fde68a44 32px)",
                    backgroundPosition: "0 44px",
                  }} />

                  <p style={{ color: "#92400e", fontWeight: 800, fontSize: 13, marginBottom: 18, letterSpacing: 0.5, position: "relative" }}>
                    💌 &nbsp;이 프로그램을 만들게 된 이유 — 여러분께 드리는 편지
                  </p>

                  <div style={{ color: "#44403c", fontSize: 14, lineHeight: 2.1, position: "relative" }}>
                    <p style={{ marginBottom: 14 }}>
                      안녕하세요. 저는 법률 전문가도, 경찰관도 아닌 평범한 시민입니다.
                    </p>
                    <p style={{ marginBottom: 14 }}>
                      어느 날, OTT 플랫폼에 올라온 한 드라마를 보게 되었습니다.<br />
                      교권이 무너진 학교 현장에서 나쁜 학생들을 바로잡기 위해<br />
                      교육부 장관이 만든 &lsquo;교권보호국&rsquo;의 이야기를 다룬 작품이었습니다.<br /><br />
                      그 중 한 에피소드에서 충격적인 장면을 보았습니다.<br />
                      <strong style={{ color: "#0f172a" }}>불법 도박을 하는 학생의 나이가 고작 9살</strong>이었습니다.<br />
                      단순한 드라마 속 설정이 아니라, 현실에서도 실제로 일어나고 있는 일이라는 것을<br />
                      그 순간 깨달았습니다.
                    </p>
                    <p style={{ marginBottom: 14 }}>
                      현실에서도 수많은 분들이 보이스피싱·투자사기·불법도박에 속아<br />
                      집을 팔고, 논을 팔고, 결국 삶까지 포기하고 있습니다.<br />
                      <strong style={{ color: "#0f172a" }}>범죄를 저지르지도, 이용당하지도, 악용당하지도 않는 세상.</strong><br />
                      그 작은 바람이 이 프로그램을 만든 계기가 되었습니다.
                    </p>
                    <p style={{ marginBottom: 14 }}>
                      AI Claude와 함께 밤낮으로 개발한 이 시뮬레이션이<br />
                      학교에서, 가정에서, 지역사회에서 범죄 예방 교육의 작은 씨앗이 되길 바라며,<br />
                      경찰청·교육청·금융감독원 등 국가기관과 함께<br />
                      더 많은 분들께 닿을 수 있기를 진심으로 희망합니다.
                    </p>
                    <p>
                      이 프로그램을 경험하신 모든 분들이<br />
                      범죄로 인해 소중한 돈을 잃거나, 삶을 포기하는 일이<br />
                      <strong style={{ color: "#0f172a" }}>단 한 번도 없기를 바랍니다.</strong>
                    </p>
                  </div>

                  <p style={{
                    textAlign: "right", color: "#78716c", fontSize: 13,
                    marginTop: 24, fontStyle: "italic", position: "relative",
                  }}>
                    — 범죄예방 체험관 개발자 드림 🙏
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 기관 협력 배너 */}
          <div style={{
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: 20, padding: "28px 32px",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Shield size={18} color="#2563eb" />
                  <p style={{ color: "#1d4ed8", fontWeight: 800, fontSize: 16 }}>국가기관과 함께하고 싶습니다</p>
                </div>
                <p style={{ color: "#3b82f6", fontSize: 14, lineHeight: 1.8 }}>
                  이 프로그램은 <strong style={{ color: "#1d4ed8" }}>경찰청, 교육청, 금융감독원, 지자체</strong> 등 공공기관과의 협력을 희망합니다.<br />
                  학교·주민센터·경로당·군부대 등 범죄 예방 교육이 필요한 현장에서<br />
                  무료로 활용될 수 있도록 배포하는 것이 목표입니다.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
                {[
                  { icon: "🏛️", label: "경찰청 / 사이버수사대", desc: "공식 교육 자료 인증" },
                  { icon: "🎓", label: "시·도 교육청", desc: "청소년 범죄 예방 교육" },
                  { icon: "🏦", label: "금융감독원", desc: "금융 사기 예방 교육" },
                  { icon: "🏠", label: "지자체 / 복지관", desc: "어르신 보이스피싱 예방" },
                ].map((org) => (
                  <div key={org.label} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: "#fff", borderRadius: 10, padding: "10px 16px",
                    border: "1px solid #e0e7ff", minWidth: 260,
                  }}>
                    <span style={{ fontSize: 18 }}>{org.icon}</span>
                    <div>
                      <p style={{ color: "#1e40af", fontWeight: 700, fontSize: 13 }}>{org.label}</p>
                      <p style={{ color: "#64748b", fontSize: 11 }}>{org.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              marginTop: 20, paddingTop: 18, borderTop: "1px solid #bfdbfe",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>📧</span>
              <p style={{ color: "#3b82f6", fontSize: 13 }}>
                협력·도입 문의: <strong style={{ color: "#1d4ed8" }}>itnlifecn@gmail.com</strong>
                <span style={{ color: "#94a3b8", marginLeft: 12 }}>— 교육 목적의 무료 제공을 원칙으로 합니다</span>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 이용 방법 ── */}
      <section id="how" style={{
        background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0",
        padding: "72px 40px",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>HOW IT WORKS</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#0f172a" }}>어떻게 체험하나요?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: <BookOpen size={22} color="#2563eb" />, bg: "#eff6ff", border: "#bfdbfe", step: "01", title: "시나리오 선택", desc: "보이스피싱, 투자사기, 불법도박 등 9가지 실제 범죄 유형 중 하나를 선택합니다." },
              { icon: <Phone size={22} color="#7c3aed" />, bg: "#faf5ff", border: "#ddd6fe", step: "02", title: "AI와 대화 체험", desc: "실제 사기범처럼 행동하는 AI와 대화하며 범죄 수법을 직접 경험합니다. 실제 돈은 나가지 않습니다." },
              { icon: <Shield size={22} color="#059669" />, bg: "#f0fdf4", border: "#bbf7d0", step: "03", title: "범죄 수법 확인", desc: "체험 후 해당 범죄의 수법, 예방법, 신고 번호를 상세히 알려드립니다." },
            ].map((item) => (
              <div key={item.step} style={{
                background: "#fff", border: "1px solid #f1f5f9",
                borderRadius: 22, padding: "30px 28px",
                boxShadow: "0 2px 16px #0000000a",
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: item.bg, border: `1px solid ${item.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                }}>
                  {item.icon}
                </div>
                <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>STEP {item.step}</p>
                <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{item.title}</p>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 시나리오 그리드 ── */}
      <section id="scenarios" style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 44 }}>
          <div>
            <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>SCENARIOS</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#0f172a" }}>9가지 범죄 시나리오</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 10 }}>2024–2025년 실제 신고 데이터 기반으로 제작했습니다</p>
          </div>
          <button
            onClick={() => router.push("/crime")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 10,
              background: "#fff", color: "#2563eb",
              border: "1px solid #bfdbfe", cursor: "pointer", fontSize: 13, fontWeight: 600,
              boxShadow: "0 1px 4px #0000000a",
            }}
          >
            전체 목록 <ExternalLink size={13} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {CRIME_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => router.push(s.id === "illegal-gambling" ? "/gambling" : `/crime/${s.id}`)}
              style={{
                background: "#fff", border: "1px solid #f1f5f9",
                borderRadius: 20, padding: "22px 20px", textAlign: "left",
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 2px 12px #0000000a",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 6px 24px ${s.color}22`;
                e.currentTarget.style.borderColor = s.color + "40";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 12px #0000000a";
                e.currentTarget.style.borderColor = "#f1f5f9";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: s.color + "16",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 14,
              }}>
                {s.icon}
              </div>
              <div style={{
                display: "inline-block", marginBottom: 10,
                fontSize: 10, padding: "3px 9px", borderRadius: 20,
                background: s.color + "14", color: s.color,
                border: `1px solid ${s.color}28`, fontWeight: 700,
              }}>
                {CATEGORY_LABELS[s.id] ?? "불법 도박"}
              </div>
              <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 15, marginBottom: 6, lineHeight: 1.4 }}>{s.title}</p>
              <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>{s.subtitle}</p>
              {s.targetAge === "senior" && (
                <div style={{
                  marginTop: 12, display: "inline-flex", alignItems: "center", gap: 4,
                  background: "#fff7ed", color: "#c2410c",
                  fontSize: 10, padding: "3px 9px", borderRadius: 20,
                  border: "1px solid #fed7aa", fontWeight: 700,
                }}>
                  ⚠️ 어르신 주의
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── 신고 번호 ── */}
      <section id="report" style={{
        background: "#fff", borderTop: "1px solid #e2e8f0",
        padding: "72px 40px",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>EMERGENCY</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#0f172a" }}>피해 즉시 신고하세요</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 10 }}>범죄 피해를 당했거나 의심되면 즉시 전화하세요</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {REPORT_NUMBERS.map((r) => (
              <a
                key={r.number}
                href={`tel:${r.number}`}
                style={{
                  display: "block", background: "#fff",
                  border: "1px solid #e2e8f0", borderRadius: 20,
                  padding: "26px 22px", textDecoration: "none",
                  transition: "all 0.2s",
                  boxShadow: "0 2px 12px #0000000a",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = r.color + "40";
                  e.currentTarget.style.boxShadow = `0 6px 24px ${r.color}18`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "0 2px 12px #0000000a";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: r.color + "14",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 14,
                }}>
                  <Phone size={16} color={r.color} />
                </div>
                <p style={{ color: "#64748b", fontSize: 12, marginBottom: 6 }}>{r.org}</p>
                <p style={{ color: r.color, fontSize: 36, fontWeight: 900, letterSpacing: -1, marginBottom: 4 }}>{r.number}</p>
                <p style={{ color: "#94a3b8", fontSize: 12 }}>{r.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 기관 판매 문의 배너 ── */}
      <section style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "52px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
            borderRadius: 24, padding: "40px 44px",
            display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center",
            flexWrap: "wrap",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: 28 }}>🏛️</span>
                <p style={{ color: "#93c5fd", fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>INSTITUTIONAL SALES</p>
              </div>
              <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 26, letterSpacing: -0.5, marginBottom: 14, lineHeight: 1.4 }}>
                교육부·경찰청·지자체·학교 등<br />국가 교육기관에 납품 가능합니다
              </h2>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.9, marginBottom: 20 }}>
                범죄 예방 교육 콘텐츠로 공공기관·교육청·복지관·기업 등에 도입을 원하시면 아래 이메일로 연락 주세요.<br />
                기관 맞춤 커스터마이징, 수료증 발급, 통계 리포트, 강사 파견 등 다양한 형태로 제공 가능합니다.<br />
                <strong style={{ color: "#60a5fa" }}>비영리·공익 목적 기관은 무료 제공을 우선합니다.</strong>
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { icon: "🎓", label: "교육부 · 교육청" },
                  { icon: "👮", label: "경찰청 · 지자체" },
                  { icon: "🏦", label: "금융기관" },
                  { icon: "🏥", label: "복지관 · 상담센터" },
                  { icon: "🏢", label: "기업 교육" },
                ].map((tag) => (
                  <span key={tag.label} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", borderRadius: 20,
                    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                    color: "#cbd5e1", fontSize: 12, fontWeight: 600,
                  }}>
                    {tag.icon} {tag.label}
                  </span>
                ))}
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20, padding: "28px 32px", minWidth: 260, flexShrink: 0,
            }}>
              <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>문의 · 도입 연락처</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>기관 도입 · 납품 문의</p>
                  <a href="mailto:itnlifecn@gmail.com" style={{ color: "#60a5fa", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                    itnlifecn@gmail.com
                  </a>
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
                <div>
                  <p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>일반 협력 · 파트너십</p>
                  <a href="mailto:itnlifecn@gmail.com" style={{ color: "#94a3b8", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                    itnlifecn@gmail.com
                  </a>
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
                <p style={{ color: "#475569", fontSize: 12, lineHeight: 1.7 }}>
                  문의 후 <strong style={{ color: "#94a3b8" }}>24시간 내</strong> 답변드립니다.<br />
                  제안서·견적서 무료 제공.
                </p>
                <a
                  href="mailto:itnlifecn@gmail.com?subject=[기관 도입 문의] 범죄예방 체험관&body=기관명:%0A담당자:%0A연락처:%0A문의내용:"
                  style={{
                    display: "block", textAlign: "center",
                    padding: "12px 0", borderRadius: 12,
                    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                    color: "#fff", textDecoration: "none",
                    fontWeight: 700, fontSize: 14,
                  }}
                >
                  📧 바로 문의하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 개인정보 안심 배너 ── */}
      <div style={{
        background: "#0f172a", padding: "32px 40px",
      }}>
        <div style={{
          maxWidth: 1140, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
        }}>
          {[
            { icon: "🔒", title: "개인정보 수집 없음", desc: "이름·전화번호·주민번호·계좌번호 등 어떠한 개인 신상정보도 수집하지 않습니다." },
            { icon: "💳", title: "실제 금전 거래 없음", desc: "체험 중 표시되는 모든 금액과 계좌는 시뮬레이션입니다. 실제 이체·출금이 발생하지 않습니다." },
            { icon: "📊", title: "익명 통계만 수집", desc: "IP를 저장하지 않는 익명 방문 통계만 수집합니다. 대한민국 인구 대비 교육 도달률 측정 목적입니다." },
          ].map((item) => (
            <div key={item.title} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{item.title}</p>
                <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 푸터 ── */}
      <footer style={{
        borderTop: "1px solid #1e293b", padding: "24px 40px",
        background: "#0f172a",
      }}>
        <div style={{
          maxWidth: 1140, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={14} color="#2563eb" />
            <span style={{ color: "#475569", fontSize: 13 }}>범죄예방 체험관 · 교육 목적 전용 · AI Claude 협업 제작</span>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <button onClick={() => router.push("/privacy")} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#475569", fontSize: 12, textDecoration: "underline",
            }}>
              개인정보처리방침
            </button>
            <button onClick={() => router.push("/privacy")} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#475569", fontSize: 12, textDecoration: "underline",
            }}>
              이용약관
            </button>
            <button onClick={() => router.push("/privacy")} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#475569", fontSize: 12, textDecoration: "underline",
            }}>
              면책조항
            </button>
            <button onClick={() => router.push("/partnership")} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#475569", fontSize: 12, textDecoration: "underline",
            }}>
              기관 도입 문의
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
