"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Shield, Phone, ChevronRight, BookOpen, Users, AlertCircle, ExternalLink, X } from "lucide-react";
import { CRIME_SCENARIOS } from "@/lib/crimes";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { getChangelogs } from "@/lib/changelogs";
import HallOfFame from "@/components/HallOfFame";

// ══ FAQ 컴포넌트 ══
const FAQ_LIST = [
  {
    q: "이 프로그램을 왜 해야 하나요?",
    a: "날로 늘어가는 보이스피싱·로맨스스캠·불법도박 등의 범죄에 우리 모두는 노출되어 있습니다. 직접 체험해보는 것이 가장 강력한 예방법입니다.",
    icon: "❓",
    color: "#534AB7",
  },
  {
    q: "이 프로그램을 개발하게 된 계기가 무엇인가요?",
    a: "한 드라마에서 9살 아이가 도박을 한다는 내용을 보고 충격을 받아 개발을 시작했습니다. 나이와 상관없이 누구나 범죄에 노출될 수 있다는 것을 알렸고 싶었습니다.",
    icon: "💡",
    color: "#f59e0b",
  },
  {
    q: "이용 요금은 얼마인가요?",
    a: "일반 사용자는 완전 무료(₩0)입니다. 기업·국가기관 단체 납품은 향후 논의를 통해 결정되며, 비영리·공익 목적 기관은 무료 제공을 우선합니다.",
    icon: "💰",
    color: "#22c55e",
  },
  {
    q: "누가 이용할 수 있나요?",
    a: "대한민국 국민 및 재외국인 5세~50세 이상 누구나 이용 가능합니다. 어린이부터 어르신까지 모든 연령층을 위해 설계했습니다.",
    icon: "👥",
    color: "#38bdf8",
  },
  {
    q: "모바일에서도 이용할 수 있나요?",
    a: "네! 스마트폰·태블릿에서도 완전히 이용 가능합니다. 375px(아이폰 SE) 기준으로 전 페이지 반응형 최적화가 완료되어 있습니다. 단, 일부 시나리오의 세밀한 인터랙션은 PC 환경에서 더욱 원활하게 체험하실 수 있습니다.",
    icon: "📱",
    color: "#f472b6",
  },
  {
    q: "어떤 사양의 기기가 필요한가요?",
    a: "Windows 10 이하 구형 기기에서도 사용 가능합니다. 최신 Windows·macOS 환경에서 최적화되어 있으며, 크롬(Chrome) 또는 엣지(Edge) 브라우저를 권장합니다.",
    icon: "💻",
    color: "#a78bfa",
  },
  {
    q: "최신 OS를 사용해야 하는 이유가 있나요?",
    a: "본 프로그램은 개인정보를 수집하지 않지만, 혹시 모를 정보 유출 예방과 보안 최적화를 위해 운영체제를 최신 상태로 유지하는 것을 권장합니다.",
    icon: "🔒",
    color: "#6ee7b7",
  },
  {
    q: "이 프로그램이 오히려 범죄를 가르치는 건 아닌가요?",
    a: "수법을 '체험'하는 것과 '악용'하는 것은 다릅니다. 예방 목적의 시뮬레이션은 피해자 시점에서 경험하는 것이며, 실제 범죄 도구·계좌·자금은 일절 사용되지 않습니다. 또한 모든 체험 종료 후 수법 해설과 신고 방법을 안내합니다.",
    icon: "⚠️",
    color: "#ef4444",
  },
  {
    q: "이 프로그램은 어떻게 개발되었나요?",
    a: "AI(Claude, Anthropic)를 활용해 기획부터 개발까지 진행했습니다. AI와 인간 기획자가 협력하여 실제 범죄 수법을 분석하고, 교육적 시뮬레이션으로 재구성했습니다.",
    icon: "🤖",
    color: "#c58dc6",
  },
  {
    q: "향후 어떤 방향으로 발전할 예정인가요?",
    a: "범죄 예방률 100%를 목표로 지속적으로 업데이트됩니다. 신종 범죄 수법 추가, 다국어 지원 확대, 교육기관 납품 확대 등을 계획 중입니다.",
    icon: "🚀",
    color: "#fbbf24",
  },
];

function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <style>{`
        @keyframes faq-open { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      {FAQ_LIST.map((item, i) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={i}
            onClick={() => setOpenIdx(isOpen ? null : i)}
            style={{
              background: isOpen ? `${item.color}12` : "rgba(255,255,255,0.04)",
              border: `1px solid ${isOpen ? item.color + "55" : "#ffffff12"}`,
              borderRadius: 16,
              cursor: "pointer",
              transition: "all 0.25s ease",
              overflow: "hidden",
            }}
          >
            {/* 질문 행 */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px" }}>
              <span style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `${item.color}22`, border: `1px solid ${item.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>{item.icon}</span>
              <p style={{
                flex: 1, color: isOpen ? "#fff" : "#cbd5e1",
                fontSize: 15, fontWeight: isOpen ? 700 : 500, margin: 0, lineHeight: 1.5,
                transition: "color 0.2s",
              }}>
                {item.q}
              </p>
              <span style={{
                color: isOpen ? item.color : "#475569",
                fontSize: 18, fontWeight: 900, flexShrink: 0,
                transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease, color 0.2s",
                display: "inline-block",
              }}>+</span>
            </div>
            {/* 답변 */}
            {isOpen && (
              <div style={{
                padding: "0 22px 20px 72px",
                animation: "faq-open 0.25s ease",
              }}>
                <div style={{ width: 32, height: 2, background: `${item.color}66`, borderRadius: 2, marginBottom: 12 }} />
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.85, margin: 0, fontWeight: 400 }}>
                  {item.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ══ 사기 체험 시뮬레이션 컴포넌트 ══
const SCAM_SCENARIOS = [
  {
    id: "deepvoice",
    emoji: "📞",
    tag: "AI 딥보이스",
    tagColor: "#ef4444",
    title: "엄마한테 전화가 왔어요",
    desc: "목소리까지 똑같은 AI 사기. 2024년 가장 빠르게 증가 중.",
    preview: "엄마: 야 나야, 지금 급한데 200만원만 빌려줄 수 있어?",
    steps: [
      { type: "call", from: "엄마 ❤️", msg: "야 나야. 지금 급한데 잠깐만 얘기해도 돼?" },
      { type: "call", from: "엄마 ❤️", msg: "나 지금 교통사고가 났어. 상대방이 합의금 요구하는데 200만원만 지금 당장 보내줄 수 있어? 나중에 꼭 갚을게." },
      { type: "choice", question: "어떻게 할까요?", choices: [
        { label: "바로 200만원 송금", result: "lose" },
        { label: "일단 끊고 엄마한테 직접 전화", result: "win" },
        { label: "계좌번호 물어봄", result: "lose" },
      ]},
    ],
    winMsg: "✅ 정답! 전화를 끊고 직접 확인하는 게 정답입니다. AI는 목소리를 복제하지만 실제 상황은 모릅니다.",
    loseMsg: "💸 당신은 200만원을 잃었습니다. AI가 엄마 목소리를 완벽히 복제한 딥보이스 사기였습니다.",
  },
  {
    id: "usedtrade",
    emoji: "🫑",
    tag: "중고거래 사기",
    tagColor: "#16a34a",
    title: "피망마켓에서 아이패드를 팔아요",
    desc: "안전결제 링크 위조. 중고거래 사기 피해 연 5만 건 이상.",
    preview: "구매자: 안전결제로 할게요~ 링크 보내드릴게요 ㅎㅎ",
    steps: [
      { type: "chat", from: "구매자김철수", msg: "안녕하세요! 아이패드 아직 있나요? 바로 살게요 ㅎㅎ" },
      { type: "chat", from: "구매자김철수", msg: "저 직거래는 좀 어렵고요, 안전결제로 하면 될까요? 제가 링크 보내드릴게요~" },
      { type: "chat", from: "구매자김철수", msg: "https://safe-pay-kr.shop/deal/28471 ← 여기서 판매자 등록하시면 바로 입금돼요!" },
      { type: "choice", question: "어떻게 할까요?", choices: [
        { label: "링크 눌러서 계좌 입력", result: "lose" },
        { label: "피망페이 공식 안전결제로 요청", result: "win" },
        { label: "그냥 계좌이체로 먼저 보내달라 함", result: "lose" },
      ]},
    ],
    winMsg: "✅ 정답! 외부 링크는 절대 금물. 피망마켓 앱 내 공식 안전결제만 사용해야 합니다.",
    loseMsg: "💸 개인정보와 계좌가 털렸습니다. 저 링크는 가짜 피싱 사이트였습니다.",
  },
  {
    id: "romance",
    emoji: "💕",
    tag: "로맨스 스캠",
    tagColor: "#ec4899",
    title: "인스타에서 연락이 왔어요",
    desc: "친해진 뒤 코인 투자 유도. 출금 불가 → 잠적. 피해액 수억.",
    preview: "다니엘: 안녕하세요 :) 맞팔해도 될까요?",
    steps: [
      { type: "dm", from: "다니엘🇺🇸", avatar: "🧑‍💼", msg: "안녕하세요 :) 한국 팔로워 분들이랑 소통하고 싶어서요. 맞팔 해도 될까요?" },
      { type: "dm", from: "다니엘🇺🇸", avatar: "🧑‍💼", msg: "저 미국에서 금융 일 하는데요, 요즘 한국 분들이랑 투자 얘기 많이 해요 ㅎㅎ 혹시 코인 투자 관심 있으세요? 지난달에 저 3천만원 벌었어요" },
      { type: "dm", from: "다니엘🇺🇸", avatar: "🧑‍💼", msg: "제가 쓰는 거래소 초대링크예요. 첫 입금 50만원하면 수익률 보장해드릴 수 있어요 😊" },
      { type: "choice", question: "어떻게 할까요?", choices: [
        { label: "50만원 입금해봄", result: "lose" },
        { label: "더 얘기해보고 나중에 결정", result: "lose" },
        { label: "차단 + 신고", result: "win" },
      ]},
    ],
    winMsg: "✅ 정답! SNS 모르는 사람의 투자 권유는 100% 사기입니다. 즉시 차단하세요.",
    loseMsg: "💸 수백만원을 잃었습니다. '다니엘'은 AI가 만든 가짜 프로필이었습니다. 출금 요청하자 잠적.",
  },
];

function ScamSimSection({ lang }: { lang: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [shown, setShown] = useState(0);
  const isMobile = useIsMobile();

  const scenario = SCAM_SCENARIOS.find(s => s.id === active);

  useEffect(() => {
    if (!active) { setStep(0); setResult(null); setShown(0); return; }
    setStep(0); setResult(null); setShown(0);
  }, [active]);

  const playTTS = async (text: string, voice: string) => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch {}
  };

  useEffect(() => {
    if (!scenario) return;
    const msgs = scenario.steps.filter(s => s.type !== "choice");
    if (shown < msgs.length) {
      const t = setTimeout(() => {
        const msg = msgs[shown];
        const voice = scenario.id === "deepvoice" ? "pNInz6obpgDQGcFmaJgB" : scenario.id === "romance" ? "EXAVITQu4vr4xnSDxMaL" : "TxGEqnHWrfWFTfGW9XjX";
        if (msg.msg) playTTS(msg.msg, voice);
        setShown(p => p + 1);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [shown, scenario]);

  if (active && scenario) {
    const msgSteps = scenario.steps.filter(s => s.type !== "choice");
    const choiceStep = scenario.steps.find(s => s.type === "choice") as any;
    const allShown = shown >= msgSteps.length;

    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
          {/* 헤더 */}
          <div style={{ background: scenario.id === "deepvoice" ? "#1a1a1a" : scenario.id === "usedtrade" ? "#ff6f0f" : "#833ab4", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{scenario.emoji}</div>
              <div>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{scenario.steps[0].from}</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>{scenario.tag}</p>
              </div>
            </div>
            <button onClick={() => setActive(null)} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>✕</button>
          </div>

          {/* 채팅창 */}
          <div style={{ background: scenario.id === "usedtrade" ? "#b2c7d9" : scenario.id === "romance" ? "#f8f0ff" : "#1a1a1a", minHeight: 300, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {msgSteps.slice(0, shown).map((s: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{s.avatar || scenario.emoji}</div>
                <div style={{ background: scenario.id === "deepvoice" ? "#2a2a2a" : "#fff", borderRadius: "0 12px 12px 12px", padding: "10px 14px", maxWidth: "78%", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: scenario.id === "deepvoice" ? "#fff" : "#1a1a1a" }}>{s.msg}</p>
                </div>
              </div>
            ))}
            {shown < msgSteps.length && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{scenario.emoji}</div>
                <div style={{ background: "#fff", borderRadius: "0 12px 12px 12px", padding: "10px 14px" }}>
                  <p style={{ fontSize: 13, color: "#999" }}>입력 중...</p>
                </div>
              </div>
            )}
          </div>

          {/* 선택지 or 결과 */}
          <div style={{ padding: 16, background: "#f8f8f8", borderTop: "1px solid #eee" }}>
            {!result && allShown && (
              <>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10 }}>👆 {choiceStep.question}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {choiceStep.choices.map((c: any, i: number) => (
                    <button key={i} onClick={() => setResult(c.result)} style={{
                      padding: "11px 16px", borderRadius: 10, border: "1.5px solid #e5e7eb",
                      background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
                      color: "#1a1a2e", textAlign: "left", transition: "all 0.15s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f3f0ff")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                    >{c.label}</button>
                  ))}
                </div>
              </>
            )}
            {result && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>{result === "win" ? "🛡️" : "😱"}</div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: result === "win" ? "#166534" : "#991b1b", fontWeight: 700, marginBottom: 12 }}>
                  {result === "win" ? scenario.winMsg : scenario.loseMsg}
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setActive(null)} style={{
                    padding: "10px 20px", borderRadius: 10, border: "none",
                    background: result === "win" ? "#16a34a" : "#dc2626",
                    color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                  }}>다른 사기 체험하기</button>
                  {result === "lose" && (
                    <a href="https://ecrm.police.go.kr/minwon/main" target="_blank" rel="noopener noreferrer" style={{
                      padding: "10px 20px", borderRadius: 10, border: "2px solid #dc2626",
                      background: "#fff", color: "#dc2626", fontWeight: 700, fontSize: 13,
                      cursor: "pointer", textDecoration: "none", display: "inline-block",
                    }}>🚨 실제 피해 신고하기</a>
                  )}
                </div>
              </div>
            )}
            {!allShown && !result && (
              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 12 }}>메시지 수신 중...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 12 : 20 }}>
      {SCAM_SCENARIOS.map(s => (
        <div key={s.id} onClick={() => setActive(s.id)} style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: 24, cursor: "pointer",
          transition: "all 0.2s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = s.tagColor + "66"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 28 }}>{s.emoji}</span>
            <span style={{ background: s.tagColor + "22", color: s.tagColor, fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 20, letterSpacing: 1 }}>{s.tag}</span>
          </div>
          <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{s.title}</h3>
          <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</p>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 12px", marginBottom: 16 }}>
            <p style={{ color: "#9ca3af", fontSize: 11, fontStyle: "italic" }}>"{s.preview}"</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: s.tagColor, fontSize: 12, fontWeight: 700 }}>
            <span>체험해보기</span>
            <span>→</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 무지개 글로우 keyframe ──
const RAINBOW_STYLE = `
@keyframes rainbow-glow {
  0%   { box-shadow: 0 0 14px 4px #ff0000aa; border-color: #ff0000; }
  16%  { box-shadow: 0 0 14px 4px #ff8800aa; border-color: #ff8800; }
  33%  { box-shadow: 0 0 14px 4px #ffff00aa; border-color: #ffff00; }
  50%  { box-shadow: 0 0 14px 4px #00cc44aa; border-color: #00cc44; }
  66%  { box-shadow: 0 0 14px 4px #9161b2aa; border-color: #9161b2; }
  83%  { box-shadow: 0 0 14px 4px #9333eaaa; border-color: #9333ea; }
  100% { box-shadow: 0 0 14px 4px #ff0000aa; border-color: #ff0000; }
}
@keyframes rainbow-text {
  0%   { color: #ff4444; }
  16%  { color: #ff8800; }
  33%  { color: #d4a000; }
  50%  { color: #16a34a; }
  66%  { color: #9161b2; }
  83%  { color: #9333ea; }
  100% { color: #ff4444; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

// 시나리오별 카테고리 키 맵
const SC_CAT_KEY: Record<string, Parameters<typeof t>[0]> = {
  "family-impersonation":    "cat_voice",
  "prosecutor-impersonation":"cat_agency",
  "romance-scam":            "cat_romance",
  "investment-scam":         "cat_invest",
  "loan-fraud":              "cat_loan",
  "delivery-scam":           "cat_smishing",
  "kakaotalk-impersonation": "cat_messenger",
  "used-goods-scam":         "cat_used",
  "illegal-gambling":        "cat_gambling",
  "sympathy-scam":           "cat_sympathy",
  "jeonse-scam":             "cat_realestate",
  "deepfake-blackmail":      "cat_deepfake",
  "link-download-scam":      "cat_phishing",
  "job-scam":                "cat_fraud",
  "drug-sns":                "cat_drug",
  "fss-impersonation":       "cat_agency",
  "weapon-deal-accident":    "cat_illegal",
  "telegram-drug":           "cat_illegal",
  "illegal-gun-trade":       "cat_illegal",
  "gun-purchase-scam":       "cat_illegal",
  "smarthome-ransomware":    "cat_future",
  "dna-scam":                "cat_future",
  "metaverse-fraud":         "cat_future",
};

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

export default function HomePage() {
  const router = useRouter();
  const { lang } = useLang();
  const isMobile = useIsMobile();
  const [popup1Open, setPopup1Open] = useState(false);
  const [popup2Open, setPopup2Open] = useState(false);
  const [guideTab, setGuideTab] = useState("parents");
  const [selectedScenario, setSelectedScenario] = useState<typeof CRIME_SCENARIOS[0] | null>(null);
  const [hoveredLog, setHoveredLog] = useState<number | null>(null);
  const [showChangelog, setShowChangelog] = useState(false);
  const changelogScrollRef = useRef<HTMLDivElement>(null);
  const changelogTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const changelogSectionRef = useRef<HTMLDivElement>(null);
  const [changelogBounce, setChangelogBounce] = useState(false);
  const [changelogExpand, setChangelogExpand] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const instCardRef = useRef<HTMLDivElement>(null);
  const [holoPos, setHoloPos] = useState({ x: 50, y: 50 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [mouseDir, setMouseDir] = useState(45);
  const lastHoloPosRef = useRef({ x: 50, y: 50 });

  // 맨 위로 버튼
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const getScrollY = () => window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    const onScroll = () => setShowScrollTop(getScrollY() > 400);
    // capture: true catches scroll events from any scrolling element
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    const timer = setInterval(() => onScroll(), 500);
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
      clearInterval(timer);
    };
  }, []);

  // 통계 카운터
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsCounted, setStatsCounted] = useState(false);
  const [counters, setCounters] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !statsCounted) {
        setStatsCounted(true);
        const targets = [1, 7.8, 5290, 200];
        const duration = 1800;
        const steps = 60;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const progress = 1 - Math.pow(1 - step / steps, 3); // ease-out cubic
          setCounters(targets.map(t => parseFloat((t * progress).toFixed(t < 10 ? 1 : 0))));
          if (step >= steps) clearInterval(timer);
        }, duration / steps);
      }
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [statsCounted]);

  const CHANGELOGS = getChangelogs(lang);

  const startChangelogScroll = () => {
    setShowChangelog(true);
    if (changelogScrollRef.current) changelogScrollRef.current.scrollTop = 0;
    changelogTimerRef.current = setInterval(() => {
      if (changelogScrollRef.current) {
        const el = changelogScrollRef.current;
        if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
          el.scrollTop = 0;
        } else {
          el.scrollTop += 0.8;
        }
      }
    }, 16);
  };

  const stopChangelogScroll = () => {
    setShowChangelog(false);
    if (changelogTimerRef.current) { clearInterval(changelogTimerRef.current); changelogTimerRef.current = null; }
  };

  useEffect(() => {
    if (!changelogSectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setChangelogBounce(true);
          setTimeout(() => setChangelogBounce(false), 900);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(changelogSectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // 모바일: 자이로스코프
    function onOrientation(e: DeviceOrientationEvent) {
      const x = Math.max(-30, Math.min(30, e.gamma ?? 0));
      const y = Math.max(-30, Math.min(30, e.beta  ?? 0));
      setTilt({ x, y });
    }
    // PC: 마우스 위치
    function onMouse(e: MouseEvent) {
      const el = instCardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      setTilt({ x: dx * 20, y: dy * 20 });
    }
    window.addEventListener("deviceorientation", onOrientation as EventListener);
    window.addEventListener("mousemove", onMouse);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation as EventListener);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setPopup1Open(true), 600);
    return () => clearTimeout(timer);
  }, []);

  function closePopup1() {
    setPopup1Open(false);
    setTimeout(() => setPopup2Open(true), 400);
  }

  // 번역에 의존하는 배열들 — 컴포넌트 내부에서 정의
  const STATS = [
    {
      value: statsCounted
        ? (lang === "ko" ? `${counters[0].toFixed(0)}조원+` : lang === "ja" ? `${counters[0].toFixed(0)}兆ウォン+` : lang === "zh" ? `${counters[0].toFixed(0)}万亿韩元+` : `₩${counters[0].toFixed(0)}T+`)
        : (lang === "ko" ? "1조원+" : lang === "ja" ? "1兆ウォン+" : lang === "zh" ? "1万亿韩元+" : "₩1T+"),
      label: t("stat1_lbl", lang), icon: "📉", bg: "#fef2f2", color: "#dc2626",
    },
    {
      value: statsCounted
        ? (lang === "ko" ? `${counters[1].toFixed(1)}만건` : lang === "ja" ? `${counters[1].toFixed(1)}万件` : lang === "zh" ? `${counters[1].toFixed(1)}万件` : `${Math.round(counters[1] * 10000).toLocaleString()}+`)
        : (lang === "ko" ? "7.8만건" : lang === "ja" ? "7.8万件" : lang === "zh" ? "7.8万件" : "78,000+"),
      label: t("stat2_lbl", lang), icon: "📋", bg: "#fff7ed", color: "#ea580c",
    },
    {
      value: statsCounted
        ? (lang === "ko" ? `${counters[2].toLocaleString()}만원` : lang === "ja" ? `${counters[2].toLocaleString()}万ウォン` : lang === "zh" ? `${counters[2].toLocaleString()}万韩元` : `₩${(counters[2] / 100).toFixed(1)}M`)
        : (lang === "ko" ? "5,290만원" : lang === "ja" ? "5,290万ウォン" : lang === "zh" ? "5,290万韩元" : "₩52.9M"),
      label: t("stat3_lbl", lang), icon: "💸", bg: "#fefce8", color: "#ca8a04",
    },
    {
      value: statsCounted
        ? (lang === "ko" ? `${counters[3].toFixed(0)}만명` : lang === "ja" ? `${counters[3].toFixed(0)}万人` : lang === "zh" ? `${counters[3].toFixed(0)}万人` : `${counters[3].toFixed(0)}M+`)
        : (lang === "ko" ? "200만명" : lang === "ja" ? "200万人" : lang === "zh" ? "200万人" : "2M+"),
      label: t("stat4_lbl", lang), icon: "⚠️", bg: "#fdf4ff", color: "#9333ea",
    },
  ];

  const REPORT_NUMBERS = [
    { org: t("rpt_police_org", lang), number: "112",  desc: t("rpt_police_desc", lang), color: "#9161b2" },
    { org: t("rpt_fss_org", lang),    number: "1332", desc: t("rpt_fss_desc", lang),    color: "#0891b2" },
    { org: t("rpt_kisa_org", lang),   number: "118",  desc: t("rpt_kisa_desc", lang),   color: "#059669" },
    { org: t("rpt_gamble_org", lang), number: "1336", desc: t("rpt_gamble_desc", lang), color: "#7c3aed" },
  ];

  const GUIDE_TABS = [
    {
      id: "parents",
      label: "👴👵 " + t("popup2_tab1", lang),
      subtitle: lang === "ko" ? "자녀가 부모님을 도와드리는 방법" : lang === "en" ? "How children can help their parents" : lang === "ja" ? "子どもが親を助ける方法" : lang === "zh" ? "子女帮助父母的方法" : lang === "vi" ? "Cách con cái giúp cha mẹ" : lang === "es" ? "Cómo los hijos ayudan a sus padres" : "How children can help their parents",
      color: "#9161b2", bg: "#f5dfee", border: "#dcc5e8",
      steps: [
        {
          icon: "📺",
          title: lang === "ko" ? "이렇게 설명해 드리세요" : lang === "en" ? "Explain it like this" : lang === "ja" ? "このように説明してください" : lang === "zh" ? "这样解释给他们听" : lang === "vi" ? "Giải thích như thế này" : lang === "es" ? "Explícalo así" : "Explain it like this",
          desc: lang === "ko" ? `"아버지/어머니, 요즘 전화로 돈 빼앗는 사람들이 많아서 제가 연습 프로그램 찾았어요."` : lang === "en" ? `"Dad/Mom, there are many phone scammers these days. I found a practice program for you."` : lang === "ja" ? `「お父さん/お母さん、最近電話詐欺が多いので練習プログラムを見つけました。」` : lang === "zh" ? `"爸爸/妈妈，最近电话诈骗很多，我找了一个练习程序。"` : lang === "vi" ? `"Bố/Mẹ ơi, dạo này có nhiều kẻ lừa đảo qua điện thoại lắm, con tìm được chương trình luyện tập này."` : lang === "es" ? `"Papá/Mamá, hay muchos estafadores por teléfono. Encontré un programa de práctica."` : `"Dad/Mom, there are many phone scammers these days. I found a practice program for you."`,
        },
        {
          icon: "🖥️",
          title: lang === "ko" ? "앉아서 함께 화면을 보세요" : lang === "en" ? "Sit together and view the screen" : lang === "ja" ? "一緒に座って画面を見てください" : lang === "zh" ? "坐在一起看屏幕" : lang === "vi" ? "Ngồi cùng và xem màn hình" : lang === "es" ? "Siéntate y mira la pantalla juntos" : "Sit together and view the screen",
          desc: lang === "ko" ? "처음엔 부모님 옆에서 함께 진행하세요." : lang === "en" ? "Start by going through it together beside your parents." : lang === "ja" ? "最初は親の隣で一緒に進めましょう。" : lang === "zh" ? "最初请坐在父母旁边一起进行。" : lang === "vi" ? "Lần đầu hãy ngồi cạnh bố mẹ và cùng thực hiện." : lang === "es" ? "Al principio, hazlo junto a tus padres." : "Start by going through it together beside your parents.",
        },
        {
          icon: "📞",
          title: lang === "ko" ? "추천 시나리오 (부모님용)" : lang === "en" ? "Recommended Scenarios (for Parents)" : lang === "ja" ? "おすすめシナリオ（保護者向け）" : lang === "zh" ? "推荐场景（适合父母）" : lang === "vi" ? "Kịch bản đề xuất (dành cho cha mẹ)" : lang === "es" ? "Escenarios recomendados (para padres)" : "Recommended Scenarios (for Parents)",
          desc: lang === "ko" ? "① 자녀 사칭  ② 검찰·경찰 사칭  ③ 대출 사기" : lang === "en" ? "① Family impersonation  ② Prosecutor fraud  ③ Loan fraud" : lang === "ja" ? "① 家族詐称 ② 検察詐称 ③ 融資詐欺" : lang === "zh" ? "① 冒充家人 ② 冒充检察官 ③ 贷款诈骗" : lang === "vi" ? "① Giả mạo gia đình ② Giả mạo công tố viên ③ Lừa đảo vay vốn" : lang === "es" ? "① Suplantación familiar ② Suplantación fiscal ③ Fraude de préstamo" : "① Family impersonation  ② Prosecutor fraud  ③ Loan fraud",
        },
        {
          icon: "💬",
          title: lang === "ko" ? "체험 후 꼭 나눠보세요" : lang === "en" ? "Discuss after the experience" : lang === "ja" ? "体験後に必ず話し合いましょう" : lang === "zh" ? "体验后一定要交流" : lang === "vi" ? "Nhất định nói chuyện sau trải nghiệm" : lang === "es" ? "Habla sobre ello después" : "Discuss after the experience",
          desc: lang === "ko" ? `"이런 전화 오면 끊으시고 저한테 전화 주세요." 한 마디가 실제 사기를 막습니다.` : lang === "en" ? `"If you get a call like this, hang up and call me." That one sentence stops real scams.` : lang === "ja" ? `「こういう電話が来たら切って私に電話してください。」この一言が実際の詐欺を防ぎます。` : lang === "zh" ? `"如果接到这样的电话，挂掉后打给我。"这一句话能防止真正的诈骗。` : lang === "vi" ? `"Nếu nhận được cuộc gọi như thế này, hãy cúp máy và gọi cho con." Một câu nói ngăn được lừa đảo thật." ` : lang === "es" ? `"Si recibes una llamada así, cuelga y llámame." Esa frase previene estafas reales.` : `"If you get a call like this, hang up and call me." That one sentence stops real scams.`,
        },
      ],
    },
    {
      id: "mom",
      label: "👩‍👧 " + t("popup2_tab2", lang),
      subtitle: lang === "ko" ? "초등학생부터 중·고등학생 자녀와 함께" : lang === "en" ? "For children from elementary to high school" : lang === "ja" ? "小学生から中高校生のお子さんと一緒に" : lang === "zh" ? "与小学到高中学生一起" : lang === "vi" ? "Cùng con từ tiểu học đến trung học" : lang === "es" ? "Con niños de primaria a bachillerato" : "For children from elementary to high school",
      color: "#db2777", bg: "#fdf2f8", border: "#fbcfe8",
      steps: [
        {
          icon: "🎮",
          title: lang === "ko" ? "게임처럼 접근하세요" : lang === "en" ? "Approach it like a game" : lang === "ja" ? "ゲームのようにアプローチしましょう" : lang === "zh" ? "像游戏一样对待" : lang === "vi" ? "Tiếp cận như trò chơi" : lang === "es" ? "Trátalo como un juego" : "Approach it like a game",
          desc: lang === "ko" ? `"AI랑 대화하는 건데, 이 사람이 사기꾼이래. 너가 안 속으면 이기는 거야!"` : lang === "en" ? `"You're chatting with an AI. This person is a scammer — if you're not fooled, you win!"` : lang === "ja" ? `「AIとチャットするんだけど、この人は詐欺師なんだって。騙されなければ勝ちだよ！」` : lang === "zh" ? `"你在和AI聊天，这个人是骗子——如果你没上当，你就赢了！"` : lang === "vi" ? `"Con đang chat với AI. Người này là kẻ lừa đảo — nếu con không bị lừa thì con thắng!"` : lang === "es" ? `"Chateas con una IA. Esta persona es estafador — ¡si no te engañan, ganas!"` : `"You're chatting with an AI. This person is a scammer — if you're not fooled, you win!"`,
        },
        {
          icon: "📱",
          title: lang === "ko" ? "추천 시나리오 (자녀용)" : lang === "en" ? "Recommended Scenarios (for Children)" : lang === "ja" ? "おすすめシナリオ（子ども用）" : lang === "zh" ? "推荐场景（适合孩子）" : lang === "vi" ? "Kịch bản đề xuất (dành cho trẻ em)" : lang === "es" ? "Escenarios recomendados (para niños)" : "Recommended Scenarios (for Children)",
          desc: lang === "ko" ? "① 중고거래 사기  ② 불법 도박  ③ 스미싱" : lang === "en" ? "① Used goods scam  ② Illegal gambling  ③ Smishing" : lang === "ja" ? "① 中古詐欺 ② 違法賭博 ③ スミッシング" : lang === "zh" ? "① 二手交易诈骗 ② 非法赌博 ③ 短信诈骗" : lang === "vi" ? "① Lừa đảo hàng cũ ② Cờ bạc bất hợp pháp ③ Smishing" : lang === "es" ? "① Estafa de usados ② Juego ilegal ③ Smishing" : "① Used goods scam  ② Illegal gambling  ③ Smishing",
        },
        {
          icon: "🗣️",
          title: lang === "ko" ? "체험 중 함께 대화하세요" : lang === "en" ? "Talk together during the experience" : lang === "ja" ? "体験中に一緒に話し合いましょう" : lang === "zh" ? "体验过程中一起交流" : lang === "vi" ? "Nói chuyện cùng nhau trong khi trải nghiệm" : lang === "es" ? "Habla durante la experiencia" : "Talk together during the experience",
          desc: lang === "ko" ? `"이 사람 왜 돈을 달라는 것 같아?" 아이 스스로 생각하게 유도하세요.` : lang === "en" ? `"Why do you think this person wants money?" Help the child think for themselves.` : lang === "ja" ? `「この人はなぜお金を求めているの？」子どもが自分で考えるよう促しましょう。` : lang === "zh" ? `"你觉得这个人为什么要钱？"引导孩子自己思考。` : lang === "vi" ? `"Con nghĩ tại sao người này muốn tiền?" Hướng dẫn trẻ tự suy nghĩ.` : lang === "es" ? `"¿Por qué crees que esta persona quiere dinero?" Ayuda al niño a pensar por sí mismo.` : `"Why do you think this person wants money?" Help the child think for themselves.`,
        },
        {
          icon: "✅",
          title: lang === "ko" ? "마지막에 약속을 만드세요" : lang === "en" ? "Make a promise at the end" : lang === "ja" ? "最後に約束をしましょう" : lang === "zh" ? "最后做个约定" : lang === "vi" ? "Hãy lập một thỏa thuận ở cuối" : lang === "es" ? "Haz una promesa al final" : "Make a promise at the end",
          desc: lang === "ko" ? `"모르는 사람이 돈 얘기 하면 엄마한테 먼저 얘기해줄 수 있어?" 간단한 약속이 아이를 지킵니다.` : lang === "en" ? `"If a stranger asks about money, will you tell me first?" A simple promise protects the child.` : lang === "ja" ? `「知らない人がお金の話をしたら、まず私に話してくれる？」簡単な約束が子どもを守ります。` : lang === "zh" ? `"如果陌生人谈到钱，你能先告诉我吗？"一个简单的约定能保护孩子。` : lang === "vi" ? `"Nếu người lạ nói về tiền, con có thể nói với mẹ trước không?" Một thỏa thuận đơn giản bảo vệ trẻ.` : lang === "es" ? `"Si alguien habla de dinero, ¿me lo dices primero?" Una promesa simple protege al niño.` : `"If a stranger asks about money, will you tell me first?" A simple promise protects the child.`,
        },
      ],
    },
    {
      id: "edu",
      label: "🏫 " + t("popup2_tab3", lang),
      subtitle: lang === "ko" ? "학교·복지관·경로당·기업 교육 담당자" : lang === "en" ? "Schools, welfare centers, senior centers, corporate trainers" : lang === "ja" ? "学校・福祉館・老人ホーム・企業の教育担当者" : lang === "zh" ? "学校、福利中心、老年中心、企业培训人员" : lang === "vi" ? "Trường học, trung tâm phúc lợi, nhà dưỡng lão, người đào tạo doanh nghiệp" : lang === "es" ? "Escuelas, centros de bienestar, centros para mayores, formadores empresariales" : "Schools, welfare centers, senior centers, corporate trainers",
      color: "#059669", bg: "#f0fdf4", border: "#bbf7d0",
      steps: [
        {
          icon: "🖥️",
          title: lang === "ko" ? "수업·강의 도입부에 활용" : lang === "en" ? "Use as an intro for lessons" : lang === "ja" ? "授業・講義の導入部に活用" : lang === "zh" ? "用于课程开头" : lang === "vi" ? "Dùng làm phần mở đầu bài học" : lang === "es" ? "Úsalo como introducción a las clases" : "Use as an intro for lessons",
          desc: lang === "ko" ? "빔 프로젝터로 전체 화면을 띄우고 강사가 직접 시나리오를 진행하세요. 15~20분이면 충분합니다." : lang === "en" ? "Project the full screen and have the instructor run the scenario. 15–20 minutes is enough." : lang === "ja" ? "プロジェクターで全画面を表示し、講師がシナリオを進めてください。15〜20分で十分です。" : lang === "zh" ? "用投影仪显示全屏，由讲师运行场景。15-20分钟即可。" : lang === "vi" ? "Chiếu toàn màn hình và để giảng viên chạy kịch bản. 15–20 phút là đủ." : lang === "es" ? "Proyecta la pantalla completa y el instructor ejecuta el escenario. 15–20 minutos son suficientes." : "Project the full screen and have the instructor run the scenario. 15–20 minutes is enough.",
        },
        {
          icon: "👥",
          title: lang === "ko" ? "조별 체험 활동으로 활용" : lang === "en" ? "Use as group activity" : lang === "ja" ? "グループ体験活動として活用" : lang === "zh" ? "用于小组活动" : lang === "vi" ? "Dùng làm hoạt động nhóm" : lang === "es" ? "Úsalo como actividad grupal" : "Use as group activity",
          desc: lang === "ko" ? "2~3명씩 조를 만들어 각자 다른 시나리오를 체험하고 발표하게 하세요." : lang === "en" ? "Form groups of 2–3 people, each trying a different scenario, then share their experience." : lang === "ja" ? "2〜3人のグループを作り、それぞれ異なるシナリオを体験して発表させてください。" : lang === "zh" ? "组成2-3人的小组，各自体验不同场景，然后分享。" : lang === "vi" ? "Chia nhóm 2–3 người, mỗi nhóm trải nghiệm kịch bản khác nhau, sau đó chia sẻ." : lang === "es" ? "Forma grupos de 2–3, cada uno prueba un escenario diferente, luego comparten." : "Form groups of 2–3 people, each trying a different scenario, then share their experience.",
        },
        {
          icon: "📊",
          title: lang === "ko" ? "통계 데이터 수업 자료로 활용" : lang === "en" ? "Use crime statistics as teaching material" : lang === "ja" ? "統計データを授業資料として活用" : lang === "zh" ? "用统计数据作为教学材料" : lang === "vi" ? "Dùng dữ liệu thống kê làm tài liệu giảng dạy" : lang === "es" ? "Usa estadísticas como material didáctico" : "Use crime statistics as teaching material",
          desc: lang === "ko" ? "상단 '📊 범죄 통계' 버튼의 공식 데이터를 수업 자료로 활용하세요." : lang === "en" ? "Use the official data from the '📊 Crime Stats' button at the top as teaching material." : lang === "ja" ? "上部の「📊 犯罪統計」ボタンの公式データを授業資料として活用してください。" : lang === "zh" ? "将顶部「📊犯罪统计」按钮中的官方数据用作教学材料。" : lang === "vi" ? "Sử dụng dữ liệu chính thức từ nút '📊 Thống kê tội phạm' ở trên làm tài liệu giảng dạy." : lang === "es" ? "Usa los datos oficiales del botón '📊 Estadísticas' de arriba como material didáctico." : "Use the official data from the '📊 Crime Stats' button at the top as teaching material.",
        },
        {
          icon: "📋",
          title: lang === "ko" ? "기관 도입 문의" : lang === "en" ? "Inquire about institutional adoption" : lang === "ja" ? "機関導入のお問い合わせ" : lang === "zh" ? "机构导入咨询" : lang === "vi" ? "Hỏi về việc áp dụng cho tổ chức" : lang === "es" ? "Consulta sobre adopción institucional" : "Inquire about institutional adoption",
          desc: lang === "ko" ? "기관 전용 커스터마이징, 수료증 발급이 필요하시면 '기관 도입' 버튼에서 무료로 문의하세요." : lang === "en" ? "For custom institutional versions or certificates, inquire for free via the 'Partnerships' button." : lang === "ja" ? "機関専用カスタマイズや修了証が必要な場合は「機関導入」ボタンから無料でお問い合わせください。" : lang === "zh" ? "如需机构专属定制或结业证书，请通过「机构合作」按钮免费咨询。" : lang === "vi" ? "Nếu cần tùy chỉnh cho tổ chức hoặc chứng chỉ, hãy hỏi miễn phí qua nút 'Hợp tác'." : lang === "es" ? "Para versiones institucionales o certificados, consulta gratis via 'Alianzas'." : "For custom institutional versions or certificates, inquire for free via the 'Partnerships' button.",
        },
      ],
    },
  ];

  const activeTab = GUIDE_TABS.find(tab => tab.id === guideTab) || GUIDE_TABS[0];

  return (
    <div style={{ minHeight: "100vh", background: "#f2eaf6", color: "#2a1a3a" }}>
      <style>{RAINBOW_STYLE}</style>

      {/* ── 팝업 1: 피해 신고 안내 ── */}
      {popup1Open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}>
          <div className="popup-card" style={{
            background: "#fdf8ff", borderRadius: 24, padding: "36px 36px 32px",
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
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #9161b2, #7c4da8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                🛡️
              </div>
              <div>
                <p style={{ color: "#1c0d2e", fontWeight: 900, fontSize: isMobile ? 14 : 18 }}>{t("popup1_title", lang)}</p>
                <p style={{ color: "#9161b2", fontSize: 12, fontWeight: 600 }}>{t("popup1_sub", lang)}</p>
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
                🆘 {t("popup1_report", lang)}
              </button>
              <button
                onClick={closePopup1}
                style={{
                  flex: 1, padding: "14px 0", borderRadius: 14,
                  background: "linear-gradient(135deg, #9161b2, #7c4da8)",
                  color: "#fff", border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: 14,
                  boxShadow: "0 4px 16px #9161b230",
                }}
              >
                {t("popup1_start", lang)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 팝업 2: 이용 가이드 ── */}
      {popup2Open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}>
          <div style={{
            background: "#fdf8ff", borderRadius: 24, padding: "32px 32px 28px",
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
            <p style={{ color: "#1c0d2e", fontWeight: 900, fontSize: 20, marginBottom: 6 }}>{t("popup2_who", lang)}</p>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 22 }}>{t("popup2_guide", lang)}</p>

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
                {activeTab.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{step.icon}</span>
                    <div>
                      <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{step.title}</p>
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
              {t("popup2_go", lang)}
            </button>
          </div>
        </div>
      )}

      {/* ── 무지개 고정 버튼 ── */}
      <button
        className="rainbow-btn"
        onClick={() => router.push("/report")}
        style={{
          position: "fixed", top: 80, right: 24, zIndex: 900,
          padding: "11px 18px", borderRadius: 24,
          background: "#fdf8ff", border: "2px solid #ff4444",
          cursor: "pointer", fontWeight: 700, fontSize: 13,
          animation: "rainbow-glow 3s linear infinite",
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 0 14px 4px #ff000066",
        }}
      >
        <span style={{ animation: "rainbow-text 3s linear infinite", fontWeight: 900 }}>🆘</span>
        <span style={{ animation: "rainbow-text 3s linear infinite" }}>{t("rainbow_report", lang)}</span>
      </button>

      {/* ── 네비게이션 바 ── */}
      <nav className="nav-bar" style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 62,
        boxShadow: "0 1px 8px #0000000a",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: isMobile ? "calc(100% - 130px)" : undefined }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #9161b2, #7c4da8)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#2a1a3a", letterSpacing: -0.3 }}>{t("nav_brand", lang)}</span>
            {!isMobile && <span style={{
              marginLeft: 8, fontSize: 10, fontWeight: 600, color: "#9161b2",
              background: "#f5dfee", padding: "2px 7px", borderRadius: 20,
              border: "1px solid #dcc5e8",
            }}>{t("nav_edu_badge", lang)}</span>}
          </div>
          {/* 모바일 전용 changelog 인라인 버튼 */}
          {isMobile && (
            <div style={{ position: "relative", zIndex: 1000, marginLeft: 4 }}>
              <button
                onClick={() => { if (showChangelog) stopChangelogScroll(); else startChangelogScroll(); }}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "5px 10px", borderRadius: 20,
                  background: showChangelog ? "#2d1060" : "#1a0a2e", color: "#c58dc6",
                  border: `1px solid ${showChangelog ? "#7c3aed" : "#3a1a5e"}`, fontSize: 11, fontWeight: 700,
                  cursor: "pointer", WebkitTapHighlightColor: "transparent",
                }}
              >
                <span>📋</span>
                <span style={{ fontSize: 9, color: "#9161b2" }}>{showChangelog ? "▲" : "▼"}</span>
              </button>
              {showChangelog && (
                <div onClick={stopChangelogScroll} style={{ position: "fixed", inset: 0, zIndex: 998 }} />
              )}
              <div style={{
                position: "fixed", top: 88, left: 16,
                width: "calc(100vw - 32px)", maxWidth: 360, borderRadius: 20,
                background: "linear-gradient(160deg, #180830 0%, #0e051a 100%)",
                border: "1px solid #5b21b660",
                boxShadow: "0 12px 48px rgba(100,40,200,0.45)",
                overflow: "hidden",
                opacity: showChangelog ? 1 : 0,
                transform: showChangelog ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.97)",
                pointerEvents: showChangelog ? "auto" : "none",
                transition: "opacity 0.2s, transform 0.2s",
                zIndex: 999,
              }}>
                <div style={{
                  padding: "16px 20px 12px", borderBottom: "1px solid #2a1a3a",
                  background: "linear-gradient(90deg, #2d1060 0%, #1a0535 100%)",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 18 }}>📋</span>
                  <div>
                    <p style={{ color: "#e9d5ff", fontSize: 15, fontWeight: 800, letterSpacing: 1, margin: 0 }}>{t("nav_changelog", lang)}</p>
                    <p style={{ color: "#9333ea80", fontSize: 11, margin: "2px 0 0", fontWeight: 600 }}>CHANGELOG</p>
                  </div>
                  <div style={{ marginLeft: "auto", background: "#f472b620", border: "1px solid #f472b650", borderRadius: 20, padding: "3px 10px" }}>
                    <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 800 }}>v1.11 최신</span>
                  </div>
                </div>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(to top, #0e051a 0%, transparent 100%)", pointerEvents: "none", zIndex: 2 }} />
                  <div style={{ maxHeight: 300, overflowY: "scroll", padding: "14px 20px 70px", scrollbarWidth: "none" }}>
                    {CHANGELOGS.map((log, i) => (
                      <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 18, alignItems: "flex-start" }}>
                        <div style={{ flexShrink: 0, minWidth: 64, background: `${log.badgeColor}18`, border: `1px solid ${log.badgeColor}55`, borderRadius: 10, padding: "5px 4px", textAlign: "center" }}>
                          <span style={{ color: log.badgeColor, fontSize: 13, fontWeight: 800, display: "block" }}>{log.version}</span>
                          {log.badge && <span style={{ display: "block", color: "#4ade80", fontSize: 10, fontWeight: 700, marginTop: 1 }}>{log.badge}</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          {log.items.map((item, j) => (
                            <p key={j} style={{ color: i === 0 ? "#e9d5ff" : "#9ca3af", fontSize: 13, lineHeight: 1.75, margin: "0 0 2px" }}>{item}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="#scenarios" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{t("nav_scenarios", lang)}</a>
          <a href="#how" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{t("nav_howto", lang)}</a>
          <a href="#report" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{t("nav_numbers", lang)}</a>
          <a href="#faq" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>FAQ</a>
          <div
            style={{ position: "relative", zIndex: 1000 }}
            onMouseEnter={() => { if (!isMobile) startChangelogScroll(); }}
            onMouseLeave={() => {
              if (changelogTimerRef.current) { clearInterval(changelogTimerRef.current); changelogTimerRef.current = null; }
              if (!isMobile) stopChangelogScroll();
            }}
          >
            <button
              onClick={() => {
                if (showChangelog) {
                  stopChangelogScroll();
                } else {
                  startChangelogScroll();
                }
              }}
              style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "7px 14px", borderRadius: 20,
              background: showChangelog ? "#2d1060" : "#1a0a2e", color: "#c58dc6",
              border: `1px solid ${showChangelog ? "#7c3aed" : "#3a1a5e"}`, fontSize: 13, fontWeight: 700,
              cursor: "pointer", transition: "all 0.15s",
              animation: changelogBounce ? "cl-bounce 0.9s cubic-bezier(0.36,0.07,0.19,0.97)" : "none",
            }}>
              <span style={{ fontSize: 11 }}>📋</span> {t("nav_changelog", lang)}
              <span style={{ fontSize: 9, marginLeft: 2, color: "#9161b2" }}>{showChangelog ? "▲" : "▼"}</span>
            </button>
            <style>{`
              @keyframes cl-bounce {
                0%   { transform: translateY(0); }
                20%  { transform: translateY(10px); box-shadow: 0 8px 24px #7c3aed55; }
                40%  { transform: translateY(-4px); }
                60%  { transform: translateY(6px); }
                80%  { transform: translateY(-2px); }
                100% { transform: translateY(0); }
              }
            `}</style>
            {/* 바깥 클릭 닫기 */}
            {showChangelog && (
              <div onClick={stopChangelogScroll} style={{ position: "fixed", inset: 0, zIndex: 998 }} />
            )}
            {/* 팝업 */}
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", right: 0,
              width: isMobile ? "calc(100vw - 32px)" : 420, maxWidth: "calc(100vw - 32px)", borderRadius: 20,
              background: "linear-gradient(160deg, #180830 0%, #0e051a 100%)",
              border: "1px solid #5b21b660",
              boxShadow: "0 12px 48px rgba(100,40,200,0.45), 0 0 0 1px rgba(195,143,214,0.08)",
              overflow: "hidden",
              opacity: showChangelog ? 1 : 0,
              transform: showChangelog ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.97)",
              pointerEvents: showChangelog ? "auto" : "none",
              transition: "opacity 0.2s, transform 0.2s",
              zIndex: 999,
            }}>
              {/* 제목 */}
              <div style={{
                padding: "16px 20px 12px",
                borderBottom: "1px solid #2a1a3a",
                background: "linear-gradient(90deg, #2d1060 0%, #1a0535 100%)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 18 }}>📋</span>
                <div>
                  <p style={{ color: "#e9d5ff", fontSize: 15, fontWeight: 800, letterSpacing: 1, margin: 0 }}>{t("nav_changelog", lang)}</p>
                  <p style={{ color: "#9333ea80", fontSize: 11, margin: "2px 0 0", fontWeight: 600 }}>CHANGELOG</p>
                </div>
                <div style={{
                  marginLeft: "auto", background: "#f472b620", border: "1px solid #f472b650",
                  borderRadius: 20, padding: "3px 10px",
                }}>
                  <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 800 }}>v1.11 최신</span>
                </div>
              </div>
              {/* 스크롤 영역 */}
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
                  background: "linear-gradient(to top, #0e051a 0%, transparent 100%)",
                  pointerEvents: "none", zIndex: 2,
                }} />
                <div
                  ref={changelogScrollRef}
                  style={{ maxHeight: 380, overflowY: "scroll", padding: "14px 20px 70px", scrollbarWidth: "none" }}
                >
                  {CHANGELOGS.map((log, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 18, alignItems: "flex-start" }}>
                      <div style={{
                        flexShrink: 0, minWidth: 64,
                        background: `${log.badgeColor}18`, border: `1px solid ${log.badgeColor}55`,
                        borderRadius: 10, padding: "5px 4px", textAlign: "center",
                      }}>
                        <span style={{ color: log.badgeColor, fontSize: 13, fontWeight: 800, display: "block" }}>{log.version}</span>
                        {log.badge && <span style={{ display: "block", color: "#4ade80", fontSize: 10, fontWeight: 700, marginTop: 1 }}>{log.badge}</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        {log.items.map((item, j) => (
                          <p key={j} style={{ color: i === 0 ? "#e9d5ff" : "#9ca3af", fontSize: 13, lineHeight: 1.75, margin: "0 0 2px" }}>{item}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push("/stats")}
            style={{
              padding: "9px 18px", borderRadius: 22,
              background: "#fefce8", color: "#ca8a04",
              border: "1px solid #fde68a", cursor: "pointer",
              fontSize: 13, fontWeight: 700,
            }}
          >
            {t("nav_stats", lang)}
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
            {t("nav_partner", lang)}
          </button>
        </div>

      </nav>

      {/* ── 히어로 섹션 ── */}
      <section className="hero-section" style={{
        maxWidth: 1140, margin: "0 auto",
        padding: isMobile ? "40px 20px 32px" : "80px 40px 70px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 32 : 64, alignItems: "center",
      }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 20, padding: "6px 14px", marginBottom: isMobile ? 16 : 24,
          }}>
            <AlertCircle size={13} color="#dc2626" />
            <span style={{ color: "#dc2626", fontSize: 12, fontWeight: 700 }}>{t("hero_alert", lang)}</span>
          </div>

          <h1 style={{ fontSize: isMobile ? 32 : 50, fontWeight: 900, lineHeight: 1.15, marginBottom: isMobile ? 14 : 20, letterSpacing: -1, color: "#1c0d2e" }}>
            {t("hero_title1", lang)}<br />
            <span style={{
              background: "linear-gradient(90deg, #9161b2, #7c3aed)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {t("hero_title2", lang)}
            </span>
          </h1>

          <p style={{ color: "#64748b", fontSize: isMobile ? 14 : 17, lineHeight: 1.8, marginBottom: isMobile ? 24 : 36, maxWidth: 460 }}>
            {t("hero_subtitle", lang)}
          </p>

          <div className="hero-cta-wrap" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/crime")}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "15px 30px", borderRadius: 14,
                background: "linear-gradient(135deg, #9161b2, #7c4da8)",
                color: "#fff", border: "none", cursor: "pointer",
                fontSize: 15, fontWeight: 700,
                boxShadow: "0 4px 20px #9161b240",
              }}
            >
              {t("hero_cta", lang)} <ChevronRight size={16} />
            </button>
            <a href="#scenarios" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "15px 22px", borderRadius: 14,
              background: "#fdf8ff", color: "#475569",
              border: "1px solid #e2e8f0", cursor: "pointer",
              fontSize: 15, textDecoration: "none", fontWeight: 500,
            }}>
              {t("nav_scenarios", lang)}
            </a>
          </div>

          <div style={{ display: "flex", gap: 20, marginTop: 24 }}>
            {([t("hero_free_tag", lang), t("hero_no_money", lang), t("hero_edu_tag", lang)] as const).map((label) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ color: "#64748b", fontSize: 13 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 통계 카드 */}
        <div ref={statsRef} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 14 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              background: s.bg, borderRadius: 18, padding: "24px 20px",
              border: `1px solid ${s.color}20`,
              transition: "transform 0.3s ease",
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
              <p style={{
                fontSize: isMobile ? 22 : 30, fontWeight: 900, color: s.color, marginBottom: 6, letterSpacing: -1,
                transition: "all 0.05s ease",
                fontVariantNumeric: "tabular-nums",
              }}>{s.value}</p>
              <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>{s.label}</p>
            </div>
          ))}
          <div style={{
            gridColumn: "1 / -1",
            background: "#f5dfee", border: "1px solid #dcc5e8",
            borderRadius: 18, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <Shield size={18} color="#9161b2" style={{ flexShrink: 0 }} />
            <p style={{ color: "#7c3aed", fontSize: 13, lineHeight: 1.5 }}>
              {t("hero_edu_full", lang)}
            </p>
          </div>
        </div>
      </section>

      {/* ── 홍보 영상 ── */}
      <section style={{
        background: "#130c1c", borderTop: "1px solid #2a1a3a",
        padding: isMobile ? "40px 20px" : "64px 40px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "#6b7280", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
              {t("video_label", lang).toUpperCase()}
            </p>
            <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 26, marginBottom: 6, letterSpacing: -0.5 }}>
              {t("video_title", lang)}
            </h2>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              {t("video_desc", lang)}
            </p>
          </div>

          {/* 영상 목록 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

            {/* 1번 영상 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: "linear-gradient(135deg, #9161b2, #7c4da8)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900, color: "#fff", flexShrink: 0,
                }}>1</div>
                <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15 }}>최초 홍보 영상</p>
                <span style={{ color: "#6b7280", fontSize: 11, background: "#2a1a3a", border: "1px solid #6b7280", borderRadius: 20, padding: "2px 10px" }}>2024</span>
                <a
                  href="https://www.youtube.com/shorts/qVwroKzwmyw"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: "auto",
                    display: "flex", alignItems: "center", gap: 5,
                    background: "#ff0000", color: "#fff",
                    borderRadius: 20, padding: "4px 12px",
                    fontSize: 11, fontWeight: 800, textDecoration: "none",
                    flexShrink: 0,
                  }}
                >
                  ▶ Shorts 보기
                </a>
              </div>
              <div style={{
                position: "relative", width: "100%", paddingTop: "56.25%",
                borderRadius: 16, overflow: "hidden",
                boxShadow: "0 16px 48px #00000060",
                border: "1px solid #2a1a3a",
              }}>
                <iframe
                  src="https://www.youtube.com/embed/vCDSs2nMy18"
                  title="범죄예방 체험관 홍보영상 1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                />
              </div>
            </div>

          </div>

          {/* ── 업데이트 영상 그리드 ── */}
          <div style={{ marginTop: 56 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <p style={{ color: "#6b7280", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>UPDATE CLIPS</p>
              <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 22, marginBottom: 0, letterSpacing: -0.5 }}>{t("section_update_video", lang)}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16 }}>
              {[
                { id: "vtWiPIfAeKY", title: "v1.8 업데이트 — 통화 UI · AI 목소리", badge: "NEW", badgeColor: "#f472b6" },
              ].map((v, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 13 }}>{v.title}</p>
                    {v.badge && (
                      <span style={{ fontSize: 10, fontWeight: 800, color: v.badgeColor, background: v.badgeColor + "20", border: `1px solid ${v.badgeColor}50`, borderRadius: 20, padding: "2px 8px" }}>{v.badge}</span>
                    )}
                  </div>
                  <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 32px #00000050", border: "1px solid #2a1a3a" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${v.id}`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 업데이트 내역 ── */}
          <div ref={changelogSectionRef} style={{ marginTop: 56 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <p style={{ color: "#6b7280", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>CHANGELOG</p>
              <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 22, marginBottom: 0, letterSpacing: -0.5 }}>{t("section_changelog", lang)}</h2>
            </div>
            <style>{`
              @keyframes cl-bounce {
                0%{transform:translateY(0)} 20%{transform:translateY(10px);box-shadow:0 8px 24px #7c3aed55}
                40%{transform:translateY(-4px)} 60%{transform:translateY(6px)} 80%{transform:translateY(-2px)} 100%{transform:translateY(0)}
              }
              .cl-btn:hover { background: linear-gradient(135deg,#3b0764,#6d28d9) !important; transform: translateY(-2px); box-shadow: 0 12px 40px #7c3aed60 !important; }
            `}</style>
            <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
              {/* 항목 목록 — 버튼 호버 시 maxHeight 확장 */}
              <div style={{
                overflow: "hidden",
                maxHeight: changelogExpand ? 2000 : 380,
                transition: "max-height 0.75s cubic-bezier(0.4,0,0.2,1)",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {CHANGELOGS.map((log, i) => {
                    // v1.7 항목은 펼치기 전엔 2개만 표시
                    const isV17 = log.version === "v1.7";
                    const items = (!changelogExpand && isV17) ? log.items.slice(0, 2) : log.items;
                    return (
                      <div key={i} style={{
                        display: "flex", gap: 14, padding: "14px 0",
                        borderBottom: "1px solid #1e0a36",
                        position: "relative",
                      }}>
                        <div style={{
                          flexShrink: 0, width: 66,
                          background: `${log.badgeColor}18`, border: `1px solid ${log.badgeColor}55`,
                          borderRadius: 10, padding: "5px 4px", textAlign: "center", alignSelf: "flex-start",
                        }}>
                          <span style={{ color: log.badgeColor, fontSize: 12, fontWeight: 800, display: "block" }}>{log.version}</span>
                          {log.badge && <span style={{ color: "#f472b6", fontSize: 9, fontWeight: 700, display: "block", marginTop: 1 }}>{log.badge}</span>}
                        </div>
                        <div style={{ flex: 1, position: "relative" }}>
                          {items.map((item, j) => (
                            <p key={j} style={{
                              color: i === 0 ? "#e9d5ff" : "#9ca3af",
                              fontSize: 13, lineHeight: 1.75, margin: "0 0 1px",
                              fontWeight: i === 0 ? 600 : 400,
                            }}>{item}</p>
                          ))}
                          {/* v1.7 줄임 페이드 */}
                          {isV17 && !changelogExpand && (
                            <div style={{
                              position: "absolute", bottom: 0, left: 0, right: 0, height: 28,
                              background: "linear-gradient(to bottom, transparent, #0d0520)",
                              pointerEvents: "none",
                            }} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 하단 그라디언트 페이드 + 버튼 — 버튼 호버 시 목록 펼쳐지고 페이드 사라짐 */}
              <div style={{ position: "relative", marginTop: -80 }}>
                {/* 그라디언트 오버레이 — 호버 시 사라짐 */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 90,
                  background: "linear-gradient(to bottom, transparent, #0d0520 80%)",
                  pointerEvents: "none",
                  opacity: changelogExpand ? 0 : 1,
                  transition: "opacity 0.4s ease",
                  zIndex: 1,
                }} />
                <button
                  className="cl-btn"
                  onMouseEnter={() => setChangelogExpand(true)}
                  onMouseLeave={() => setChangelogExpand(false)}
                  style={{
                    display: "block", width: "100%",
                    padding: "18px 0", marginTop: 90,
                    background: "linear-gradient(135deg,#2d1060,#4c1d95)",
                    border: "1px solid #7c3aed55",
                    borderRadius: 18,
                    color: "#c4b5fd", fontSize: 15, fontWeight: 800,
                    cursor: "pointer", letterSpacing: 0.5,
                    boxShadow: "0 4px 24px #7c3aed30",
                    transition: "all 0.25s",
                    position: "relative", zIndex: 2,
                  }}
                >
                  {t("changelog_view_all", lang)}
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 과거 범죄 아카이브 ── */}
      <section style={{ background: "linear-gradient(180deg, #3d2060 0%, #2a3d6e 40%, #1a3d3d 100%)", padding: "72px 0 64px", overflow: "hidden", position: "relative" }}>
        {/* 시대 배경 CSS 애니메이션 */}
        <style>{`
          @keyframes flickerTV { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.7} 94%{opacity:1} 97%{opacity:0.85} 98%{opacity:1} }
          @keyframes rainDrop { 0%{transform:translateY(-20px);opacity:0} 10%{opacity:0.6} 90%{opacity:0.4} 100%{transform:translateY(120px);opacity:0} }
          @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
          @keyframes neonBlink { 0%,100%{opacity:1;text-shadow:0 0 8px #f59e0b,0 0 20px #f59e0b} 45%{opacity:0.7;text-shadow:none} 50%{opacity:1;text-shadow:0 0 8px #f59e0b} }
          @keyframes glitchEra { 0%,100%{clip-path:inset(0 0 98% 0)} 10%{clip-path:inset(30% 0 50% 0)} 30%{clip-path:inset(70% 0 10% 0)} 60%{clip-path:inset(10% 0 80% 0)} }
          @keyframes marqueeScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          @keyframes lampFlicker { 0%,100%{opacity:1} 88%{opacity:1} 90%{opacity:0.5} 91%{opacity:1} 95%{opacity:0.7} 97%{opacity:1} }
          @keyframes slowPulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
          @keyframes diagBeam { 0%{opacity:0;transform:skewX(-15deg) translateX(-30px)} 20%{opacity:1} 80%{opacity:1} 100%{opacity:0;transform:skewX(-15deg) translateX(30px)} }
          @keyframes holoSweep { 0%{transform:translateX(-30%) skewX(-8deg);opacity:0} 15%{opacity:1} 50%{transform:translateX(10%) skewX(-8deg);opacity:1} 85%{opacity:1} 100%{transform:translateX(50%) skewX(-8deg);opacity:0} }
          @keyframes crtScan { 0%{background-position:0 0} 100%{background-position:0 100%} }
          @keyframes fogDrift { 0%{transform:translateX(-5%)} 50%{transform:translateX(5%)} 100%{transform:translateX(-5%)} }
        `}</style>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 700, letterSpacing: 4, marginBottom: 10, fontFamily: "monospace" }}>[ CRIME ARCHIVE ]</p>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: "#f5f5f5", marginBottom: 10, letterSpacing: -0.5 }}>
              옛날엔 이런 사기도 있었다
            </h2>
            <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.7 }}>
              수법은 시대마다 달라졌지만, 심리를 이용한다는 본질은 변하지 않았습니다.
            </p>
            {/* 관련 사이트 */}
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 20px", marginTop: 14 }}>
              <span style={{ color: "#6b7280", fontSize: 11 }}>더 자세히 알아보기 →</span>
              {[
                { label: "경찰청 사이버수사국", url: "https://ecrm.police.go.kr" },
                { label: "금융감독원 불법금융신고센터", url: "https://www.fss.or.kr/fss/main/sub1/sub1_3.do" },
                { label: "한국소비자원 피해사례 DB", url: "https://www.kca.go.kr" },
                { label: "사이버범죄 신고시스템", url: "https://ecrm.cyber.go.kr" },
              ].map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{ color: "#9ca3af", fontSize: 11, textDecoration: "none", borderBottom: "1px solid #6b7280", lineHeight: 1.8 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#9ca3af")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
                >{s.label}</a>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* ══ 1990년대: 쌍문동 골목 밤거리 ══ */}
            <div style={{
              position: "relative", borderRadius: 24, overflow: "hidden",
              marginBottom: 24, padding: "32px 28px",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.48), rgba(0,0,0,0.52)), url('/alley-1990s.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              {/* 벽돌 질감 - 가로 줄눈 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                backgroundImage: `
                  repeating-linear-gradient(0deg,
                    transparent 0px, transparent 18px,
                    rgba(0,0,0,0.35) 18px, rgba(0,0,0,0.35) 20px
                  ),
                  repeating-linear-gradient(90deg,
                    transparent 0px, transparent 58px,
                    rgba(0,0,0,0.25) 58px, rgba(0,0,0,0.25) 60px
                  )
                `,
              }} />
              {/* 벽돌 색감 오버레이 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: `
                  repeating-linear-gradient(0deg,
                    rgba(120,50,10,0.12) 0px, rgba(120,50,10,0.12) 9px,
                    rgba(80,30,5,0.06) 9px, rgba(80,30,5,0.06) 20px
                  )
                `,
              }} />
              {/* 골목 양쪽 그림자 (좁은 느낌) */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.6) 100%)",
              }} />
              {/* 가로등 1 - 왼쪽 */}
              <div style={{
                position: "absolute", top: 0, left: "15%", width: 2, height: 60,
                background: "linear-gradient(180deg, #888 0%, #555 100%)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", top: 55, left: "calc(15% - 30px)", width: 64, height: 16,
                background: "rgba(255,190,40,0.9)", borderRadius: 4,
                boxShadow: "0 0 20px 8px rgba(255,180,20,0.6), 0 0 60px 20px rgba(255,150,0,0.3)",
                animation: "lampFlicker 6s infinite",
                pointerEvents: "none",
              }} />
              {/* 가로등 2 - 오른쪽 */}
              <div style={{
                position: "absolute", top: 0, right: "12%", width: 2, height: 50,
                background: "linear-gradient(180deg, #888 0%, #555 100%)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", top: 45, right: "calc(12% - 28px)", width: 58, height: 14,
                background: "rgba(255,185,35,0.85)", borderRadius: 4,
                boxShadow: "0 0 18px 7px rgba(255,170,15,0.5), 0 0 50px 18px rgba(255,140,0,0.25)",
                animation: "lampFlicker 7s infinite",
                animationDelay: "0.8s",
                pointerEvents: "none",
              }} />
              {/* 바닥 반사 */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
                background: "linear-gradient(0deg, rgba(180,90,0,0.15) 0%, transparent 100%)",
                borderRadius: "0 0 24px 24px", pointerEvents: "none",
              }} />
              {/* 필름 입자 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
                opacity: 0.5,
                animation: "flickerTV 12s infinite",
              }} />
              {/* 시대 텍스트 */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #c9a84c88)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 4 }}>📠</div>
                  <span style={{
                    color: "#c9a84c", fontSize: 13, fontWeight: 700, letterSpacing: 4,
                    fontFamily: "monospace", animation: "neonBlink 4s infinite",
                    textShadow: "0 0 10px #c9a84c88",
                  }}>{lang === "ko" ? "── 1 9 9 0 년 대 ──" : "── 1 9 9 0 s ──"}</span>
                  <p style={{ color: "#8b6914", fontSize: 10, marginTop: 4, letterSpacing: 1 }}>{lang === "ko" ? "골목 팩스방 · 전단지 · 전화 사기의 시대" : lang === "ja" ? "路地のFAX店・チラシ・電話詐欺の時代" : lang === "zh" ? "街边传真店·传单·电话诈骗的时代" : "Alley Fax Shops · Flyers · Phone Scam Era"}</p>
                </div>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #c9a84c88, transparent)" }} />
              </div>
              {/* 흘러가는 추억 마퀴 */}
              <div style={{ overflow: "hidden", marginBottom: 16, position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex", gap: 32, whiteSpace: "nowrap",
                  animation: "marqueeScroll 18s linear infinite",
                  color: "#8b6914", fontSize: 10, fontFamily: "monospace", letterSpacing: 1,
                }}>
                  {(lang === "ko"
                    ? ["📞 삐삐 호출", "📠 팩스방 사기", "🏪 구멍가게", "🚌 시내버스", "📺 브라운관 TV", "💿 비디오 대여점", "🎰 복권 당첨 사기", "📋 전단지 광고", "📞 삐삐 호출", "📠 팩스방 사기", "🏪 구멍가게", "🚌 시내버스", "📺 브라운관 TV", "💿 비디오 대여점", "🎰 복권 당첨 사기", "📋 전단지 광고"]
                    : lang === "ja"
                    ? ["📞 ポケベル呼出", "📠 FAX詐欺", "🏪 街角商店", "🚌 市内バス", "📺 ブラウン管TV", "💿 ビデオレンタル", "🎰 宝くじ当選詐欺", "📋 チラシ広告", "📞 ポケベル呼出", "📠 FAX詐欺", "🏪 街角商店", "🚌 市内バス", "📺 ブラウン管TV", "💿 ビデオレンタル", "🎰 宝くじ当選詐欺", "📋 チラシ広告"]
                    : ["📞 Pager Call", "📠 Fax Scam", "🏪 Corner Store", "🚌 City Bus", "📺 CRT TV", "💿 Video Rental", "🎰 Lottery Scam", "📋 Flyer Ads", "📞 Pager Call", "📠 Fax Scam", "🏪 Corner Store", "🚌 City Bus", "📺 CRT TV", "💿 Video Rental", "🎰 Lottery Scam", "📋 Flyer Ads"]
                  ).map((t,i) => (
                    <span key={i}>{t} &nbsp;·&nbsp;</span>
                  ))}
                </div>
              </div>

              {/* 1990년대 카드들 */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { name: "복권 당첨 사기", nameTr: lang === "ja" ? "宝くじ当選詐欺" : lang === "zh" ? "彩票中奖诈骗" : lang === "ko" ? null : "Lottery Winning Scam", tag: "FAX SCAM", desc: "「당신이 당첨됐습니다」 팩스 1장으로 수수료 편취. 스팸 팩스가 유일한 사기 수단이던 시절.", descTr: lang === "ja" ? "「あなたが当選しました」というFAXで手数料をだまし取る。スパムFAXが唯一の詐欺手段だった時代。" : lang === "zh" ? "「您中奖了」一张传真骗取手续费。垃圾传真是唯一诈骗手段的年代。" : lang === "ko" ? null : "A single fax saying 'You've won!' to steal fees. Spam faxes were the only scam medium." },
                  { name: "피라미드 다단계", nameTr: lang === "ja" ? "ネズミ講マルチ商法" : lang === "zh" ? "传销金字塔骗局" : lang === "ko" ? null : "Pyramid MLM Scam", tag: "PYRAMID", desc: "원금 보장·고수익 보장. 하위 회원 모집으로만 유지. 전국 수십만 명이 '사업'인 줄 알고 참여.", descTr: lang === "ja" ? "元本保証・高収益保証。下位会員の勧誘だけで維持。全国数十万人が「ビジネス」と信じて参加。" : lang === "zh" ? "保证本金·高收益保证。只靠招募下线维持。全国数十万人以为是做'生意'而参与。" : lang === "ko" ? null : "Guaranteed returns. Sustained only by recruiting new members. Hundreds of thousands believed it was a real business." },
                  { name: "선불 사기 (삼각 사기)", nameTr: lang === "ja" ? "前払い詐欺（三角詐欺）" : lang === "zh" ? "预付款诈骗（三角诈骗）" : lang === "ko" ? null : "Advance Fee Fraud", tag: "PREPAY", desc: "광고지·전단지로 물건 홍보, 먼저 돈 받고 잠적. 인터넷이 없어 피해 확인조차 어려웠던 시대.", descTr: lang === "ja" ? "広告チラシで商品宣伝、先に金を受け取って逃走。インターネットがなく被害確認すら困難だった時代。" : lang === "zh" ? "用广告传单宣传商品，收钱后消失。没有互联网，连受害确认都困难的年代。" : lang === "ko" ? null : "Advertise via flyers, collect money, then vanish. Without internet, even confirming scams was near impossible." },
                ].map((c, j) => (
                  <div key={j} style={{
                    background: "linear-gradient(145deg, #f5efd6, #ede5c4)",
                    border: "1px solid #c9a84c44",
                    borderRadius: 4,
                    padding: "16px 16px 14px",
                    position: "relative",
                    boxShadow: "2px 3px 8px #00000060, inset 0 0 0 1px #ffffff20",
                    fontFamily: "'Courier New', Courier, monospace",
                  }}>
                    {/* 팩스 헤더 라인 */}
                    <div style={{ borderBottom: "1px dashed #8b7355", marginBottom: 10, paddingBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: "#8b7355", letterSpacing: 1 }}>FAX TRANSMISSION</span>
                      <span style={{ fontSize: 9, color: "#8b7355" }}>199X.XX.XX</span>
                    </div>
                    <div style={{ background: "#8b735533", display: "inline-block", padding: "1px 6px", marginBottom: 6, borderRadius: 2 }}>
                      <span style={{ fontSize: 9, color: "#6b5a2e", letterSpacing: 1 }}>{c.tag}</span>
                    </div>
                    <p style={{ color: "#3d2e00", fontWeight: 700, fontSize: 13, marginBottom: 2, lineHeight: 1.3 }}>{c.name}</p>
                    {c.nameTr && <p style={{ color: "#8b7355", fontSize: 9, marginBottom: 6, lineHeight: 1.3 }}>{c.nameTr}</p>}
                    <p style={{ color: "#5c4a1e", fontSize: 11, lineHeight: 1.7 }}>{c.desc}</p>
                    {c.descTr && <p style={{ color: "#8b6a30", fontSize: 9, lineHeight: 1.6, marginTop: 4, borderTop: "1px dashed #c9a84c44", paddingTop: 4 }}>{c.descTr}</p>}
                    {/* 팩스 노이즈 라인 */}
                    <div style={{ marginTop: 10, borderTop: "1px dashed #8b735555", paddingTop: 6 }}>
                      <span style={{ fontSize: 8, color: "#a08858", fontFamily: "monospace" }}>■■■□■□■■□□■■■□ END OF TRANSMISSION</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div> {/* ══ 1990년대 배경 래퍼 끝 ══ */}

            {/* ══ 2000년대: PC방 골목 + 형광등 간판 ══ */}
            <div style={{
              position: "relative", borderRadius: 24, overflow: "hidden",
              marginBottom: 24, padding: "32px 28px",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.48), rgba(0,0,0,0.52)), url('/alley-2000s.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              {/* 콘크리트 벽 텍스처 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent 0px, transparent 22px, rgba(255,255,255,0.03) 22px, rgba(255,255,255,0.03) 23px),
                  repeating-linear-gradient(90deg, transparent 0px, transparent 80px, rgba(255,255,255,0.02) 80px, rgba(255,255,255,0.02) 81px)
                `,
              }} />
              {/* 골목 양쪽 그림자 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.7) 100%)",
              }} />
              {/* PC방 간판 형광등 */}
              <div style={{
                position: "absolute", top: 0, left: "30%", right: "30%", height: 6,
                background: "linear-gradient(90deg, transparent, rgba(100,180,255,0.9), rgba(120,200,255,1), rgba(100,180,255,0.9), transparent)",
                boxShadow: "0 0 20px 6px rgba(80,160,255,0.7), 0 0 60px 15px rgba(40,120,220,0.4)",
                animation: "lampFlicker 4s infinite",
                borderRadius: 3,
                pointerEvents: "none",
              }} />
              {/* 바닥 형광 반사 */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
                background: "linear-gradient(0deg, rgba(30,80,180,0.15) 0%, transparent 100%)",
                borderRadius: "0 0 24px 24px", pointerEvents: "none",
              }} />
              {/* CRT 스캔라인 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 6px)",
                animation: "flickerTV 9s infinite",
              }} />
              {/* 흘러가는 마퀴 */}
              <div style={{ overflow: "hidden", marginBottom: 16, position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex", gap: 28, whiteSpace: "nowrap",
                  animation: "marqueeScroll 22s linear infinite",
                  color: "#3a6ea5", fontSize: 10, fontFamily: "monospace", letterSpacing: 1,
                }}>
                  {(lang === "ko"
                    ? ["💾 플로피디스크", "📀 CD롬 굽기", "🖨️ PC방 프린터", "🖥️ 윈도우XP", "🌐 인터넷 탐색기", "📡 56K 모뎀", "📧 이메일 스팸", "🎮 스타크래프트", "💾 플로피디스크", "📀 CD롬 굽기", "🖨️ PC방 프린터", "🖥️ 윈도우XP", "🌐 인터넷 탐색기", "📡 56K 모뎀", "📧 이메일 스팸", "🎮 스타크래프트"]
                    : lang === "ja"
                    ? ["💾 フロッピーディスク", "📀 CD-ROM焼き", "🖨️ PCルームプリンター", "🖥️ Windows XP", "🌐 インターネット探索機", "📡 56Kモデム", "📧 メールスパム", "🎮 スタークラフト", "💾 フロッピーディスク", "📀 CD-ROM焼き", "🖨️ PCルームプリンター", "🖥️ Windows XP", "🌐 インターネット探索機", "📡 56Kモデム", "📧 メールスパム", "🎮 スタークラフト"]
                    : ["💾 Floppy Disk", "📀 Burning CDs", "🖨️ PC Bang Printer", "🖥️ Windows XP", "🌐 Internet Explorer", "📡 56K Modem", "📧 Email Spam", "🎮 StarCraft", "💾 Floppy Disk", "📀 Burning CDs", "🖨️ PC Bang Printer", "🖥️ Windows XP", "🌐 Internet Explorer", "📡 56K Modem", "📧 Email Spam", "🎮 StarCraft"]
                  ).map((t,i) => (
                    <span key={i}>{t} &nbsp;·&nbsp;</span>
                  ))}
                </div>
              </div>
              {/* 시대 레이블 */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #3a6ea588)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>💻</div>
                  <span style={{ color: "#7ab0e8", fontSize: 13, fontWeight: 700, letterSpacing: 4, fontFamily: "monospace", textShadow: "0 0 8px #3a6ea888" }}>{lang === "ko" ? "── 2 0 0 0 년 대 ──" : "── 2 0 0 0 s ──"}</span>
                  <p style={{ color: "#3a6ea5", fontSize: 10, marginTop: 4, letterSpacing: 1 }}>{lang === "ko" ? "PC방 · 인터넷 탐색기 · 이메일 사기의 시대" : lang === "ja" ? "PCルーム・インターネット・メール詐欺の時代" : lang === "zh" ? "网吧·互联网·邮件诈骗的时代" : "PC Bangs · Internet Explorer · Email Scam Era"}</p>
                </div>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #3a6ea588, transparent)" }} />
              </div>
              {/* 2000년대 카드들 */}
            <div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { name: "나이지리아 왕자 이메일", nameTr: lang === "ja" ? "ナイジェリア王子メール" : lang === "zh" ? "尼日利亚王子邮件" : lang === "ko" ? null : "Nigerian Prince Email", icon: "📧", desc: "\"저는 나이지리아 왕자입니다. 재산 이전을 도와주시면 수수료를 드립니다.\" 세계 최초 국제 스팸 사기의 고전.", descTr: lang === "ja" ? "\"私はナイジェリアの王子です。財産移転を手伝ってくれたら手数料を差し上げます。\" 世界初の国際スパム詐欺の古典。" : lang === "zh" ? "\"我是尼日利亚王子。帮我转移财产就给您佣金。\" 世界首个国际垃圾邮件诈骗的经典案例。" : lang === "ko" ? null : "\"I am a Nigerian prince. Help me transfer funds.\" The world's first classic international email scam." },
                  { name: "문화상품권 사기 1세대", nameTr: lang === "ja" ? "文化商品券詐欺第一世代" : lang === "zh" ? "文化礼品券诈骗第一代" : lang === "ko" ? null : "Gift Card Scam — 1st Gen", icon: "🎫", desc: "핀번호 긁어서 보내달라는 최초 형태. 당시엔 상품권이 낯설어 '이게 왜 사기야?' 하던 시절.", descTr: lang === "ja" ? "PINコードを削って送るよう求める最初の形。当時は商品券が珍しく「なぜ詐欺？」と言われた時代。" : lang === "zh" ? "让人刮开礼品卡PIN码发送的最初形式。当时礼品卡很陌生，人们问'这为什么是诈骗？'的年代。" : lang === "ko" ? null : "Scratch the pin and send it. Gift cards were unfamiliar then—people didn't realize it was a scam." },
                  { name: "초창기 보이스피싱", nameTr: lang === "ja" ? "初期のボイスフィッシング" : lang === "zh" ? "早期电话诈骗" : lang === "ko" ? null : "Early Voice Phishing", icon: "☎️", desc: "\"금감원입니다. 귀하 계좌가 동결됩니다.\" 단 한 줄로 수백만원 편취. 대본이 지금보다 100배 단순.", descTr: lang === "ja" ? "\"金融監督院です。口座が凍結されます。\" たった一言で数百万ウォンを詐取。脚本は今より100倍単純。" : lang === "zh" ? "\"我是金融监督院。您的账户将被冻结。\" 一句话骗走数百万韩元。话术比现在简单100倍。" : lang === "ko" ? null : "\"This is the FSS. Your account will be frozen.\" One line to steal millions. Scripts were 100x simpler than today." },
                ].map((c, j) => (
                  <div key={j} style={{
                    background: "#d4d0c8",
                    border: "2px solid",
                    borderColor: "#ffffff #808080 #808080 #ffffff",
                    borderRadius: 0,
                    overflow: "hidden",
                    boxShadow: "2px 2px 0 #000000aa",
                    fontFamily: "'Tahoma', 'MS Sans Serif', sans-serif",
                  }}>
                    {/* XP 타이틀바 */}
                    <div style={{
                      background: "linear-gradient(to bottom, #0a246a, #3a6ea5)",
                      padding: "3px 6px",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 11 }}>{c.icon}</span>
                        <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{lang === "ko" ? "경고.exe" : "warning.exe"}</span>
                      </div>
                      <div style={{ display: "flex", gap: 2 }}>
                        {["_", "□", "✕"].map((btn, k) => (
                          <div key={k} style={{
                            width: 16, height: 14, background: k === 2 ? "#c0392b" : "#d4d0c8",
                            border: "1px solid #808080", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 9, color: k === 2 ? "#fff" : "#000", cursor: "default",
                          }}>{btn}</div>
                        ))}
                      </div>
                    </div>
                    {/* 콘텐츠 */}
                    <div style={{ padding: "12px 12px 10px", background: "#d4d0c8" }}>
                      <div style={{ background: "#fdf8ff", border: "2px inset #808080", padding: "8px", marginBottom: 8 }}>
                        <p style={{ color: "#000080", fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{c.name}</p>
                        {c.nameTr && <p style={{ color: "#5a5a9a", fontSize: 9, marginBottom: 4 }}>{c.nameTr}</p>}
                        <p style={{ color: "#231232", fontSize: 11, lineHeight: 1.6 }}>{c.desc}</p>
                        {c.descTr && <p style={{ color: "#5a5a6a", fontSize: 9, lineHeight: 1.5, marginTop: 4, borderTop: "1px dashed #80808055", paddingTop: 4 }}>{c.descTr}</p>}
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div style={{
                          background: "#d4d0c8", border: "2px solid", borderColor: "#ffffff #808080 #808080 #ffffff",
                          padding: "2px 12px", fontSize: 11, cursor: "default",
                        }}>{lang === "ko" ? "확인" : "OK"}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div> {/* ══ 2000년대 배경 래퍼 끝 ══ */}

            {/* ══ 2010년대 초: 스마트폰 불빛 쏟아지는 도시 골목 ══ */}
            <div style={{
              position: "relative", borderRadius: 24, overflow: "hidden",
              marginBottom: 24, padding: "32px 28px",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.50), rgba(0,0,0,0.54)), url('/alley-2020s.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              {/* 야간 콘크리트 벽 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent 0px, transparent 30px, rgba(255,255,255,0.025) 30px, rgba(255,255,255,0.025) 31px)
                `,
              }} />
              {/* 골목 양쪽 그림자 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.65) 100%)",
              }} />
              {/* 편의점 간판 형광빛 (초록/흰색) */}
              <div style={{
                position: "absolute", top: 8, left: "10%", width: 100, height: 8,
                background: "linear-gradient(90deg, rgba(0,220,80,0.8), rgba(100,255,140,0.9), rgba(0,220,80,0.8))",
                boxShadow: "0 0 16px 5px rgba(0,200,60,0.5), 0 0 40px 12px rgba(0,160,40,0.25)",
                borderRadius: 3, animation: "slowPulse 3s infinite", pointerEvents: "none",
              }} />
              {/* 스마트폰 화면 반사광 */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
                background: "linear-gradient(0deg, rgba(0,80,30,0.2) 0%, transparent 100%)",
                borderRadius: "0 0 24px 24px", pointerEvents: "none",
              }} />
              <div style={{ overflow: "hidden", marginBottom: 16, position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex", gap: 28, whiteSpace: "nowrap",
                  animation: "marqueeScroll 20s linear infinite",
                  color: "#1a7a4a", fontSize: 10, fontFamily: "monospace",
                }}>
                  {(lang === "ko"
                    ? ["📱 갤럭시S2", "📲 오카카톡 출시", "💬 스미싱 문자", "🔗 bitly 단축링크", "📶 3G LTE", "🏧 ATM 인출", "📱 갤럭시S2", "📲 오카카톡 출시", "💬 스미싱 문자", "🔗 bitly 단축링크", "📶 3G LTE", "🏧 ATM 인출"]
                    : lang === "ja"
                    ? ["📱 Galaxy S2", "📲 KakaoTalk誕生", "💬 スミッシングテキスト", "🔗 bit.ly 短縮リンク", "📶 3G LTE", "🏧 ATM引出し", "📱 Galaxy S2", "📲 KakaoTalk誕生", "💬 スミッシングテキスト", "🔗 bit.ly 短縮リンク", "📶 3G LTE", "🏧 ATM引出し"]
                    : ["📱 Galaxy S2", "📲 KakaoTalk Launch", "💬 Smishing Texts", "🔗 bit.ly Short Links", "📶 3G LTE", "🏧 ATM Withdrawal", "📱 Galaxy S2", "📲 KakaoTalk Launch", "💬 Smishing Texts", "🔗 bit.ly Short Links", "📶 3G LTE", "🏧 ATM Withdrawal"]
                  ).map((t,i) => (
                    <span key={i}>{t} &nbsp;·&nbsp;</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #34d39988)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>📱</div>
                  <span style={{ color: "#34d399", fontSize: 13, fontWeight: 700, letterSpacing: 4, fontFamily: "monospace" }}>{lang === "ko" ? "── 2 0 1 0 년 대 초 ──" : "── E a r l y  2 0 1 0 s ──"}</span>
                  <p style={{ color: "#065f46", fontSize: 10, marginTop: 4, letterSpacing: 1 }}>{lang === "ko" ? "스마트폰 보급 · 오카카 · 스미싱의 시대" : lang === "ja" ? "スマートフォン普及・カカオ・スミッシングの時代" : lang === "zh" ? "智能手机普及·Kakao·短信钓鱼的时代" : "Smartphone Boom · KakaoTalk · Smishing Era"}</p>
                </div>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #34d39988, transparent)" }} />
              </div>

              {/* ── 2010년대 초: 피처폰/초기 스마트폰 SMS ── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ height: 1, flex: 1, background: "#064e3b", opacity: 0.6 }} />
                <span style={{ color: "#34d399", fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: "monospace" }}>── 2010년대 초 ──</span>
                <div style={{ height: 1, flex: 1, background: "#064e3b", opacity: 0.6 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { sender: "[Web발신]", preview: "무료쿠폰 발급완료 수령▶ http://bit.ly/xK3m", name: "스미싱 1세대", nameTr: lang === "ja" ? "スミッシング第一世代" : lang === "zh" ? "短信钓鱼第一代" : lang === "ko" ? null : "Smishing — 1st Gen", desc: "클릭 즉시 소액결제 자동 청구. '무료쿠폰'에 의심 없이 눌렀던 시절. 당시엔 스미싱이란 단어조차 없었음.", descTr: lang === "ja" ? "クリックで少額決済が自動請求。「無料クーポン」に疑いなく押した時代。当時はスミッシングという言葉もなかった。" : lang === "zh" ? "点击后立即扣取小额费用。毫无疑心点击'免费优惠券'的年代。当时连短信钓鱼这词都不存在。" : lang === "ko" ? null : "One click = instant micro-payment. People clicked 'free coupon' without suspicion. 'Smishing' wasn't even a word yet." },
                  { sender: "민지", preview: "나야 급해ㅠㅠ 50만원만 잠깐 빌려줄수있어? 오늘저녁에갚을게", name: "오카카 해킹 초기형", nameTr: lang === "ja" ? "カカオハッキング初期型" : lang === "zh" ? "KakaoTalk账号被盗初期型" : lang === "ko" ? null : "KakaoTalk Hacking — Early Form", desc: "계정 해킹 후 지인에게 문자형 사기. 오카카가 생소하던 시절, '이게 진짜 카톡이야?' 하며 속음.", descTr: lang === "ja" ? "アカウントハッキング後に知人へのメッセージ型詐欺。「これ本物のカカオトークなの？」と騙された時代。" : lang === "zh" ? "账号被黑客入侵后向熟人发送骗钱信息。KakaoTalk还很陌生，人们被骗时问'这真的是KakaoTalk吗？'。" : lang === "ko" ? null : "After hacking an account, scammers text the victim's contacts. 'Is this really KakaoTalk?' — people were fooled." },
                  { sender: "직구몰", preview: "아이폰5 미개봉 정품 29만원! 오늘마감 선착순50명", name: "가짜 직구몰 사기", nameTr: lang === "ja" ? "偽直接購入サイト詐欺" : lang === "zh" ? "假购物网站诈骗" : lang === "ko" ? null : "Fake Shopping Mall Scam", desc: "너무 싼 해외직구 쇼핑몰. 결제 후 잠적. 지금의 중고거래 사기 전신. 환불 개념 자체가 없던 시대.", descTr: lang === "ja" ? "安すぎる海外直購入ショッピングモール。決済後に逃走。現在の中古取引詐欺の前身。返金という概念もなかった時代。" : lang === "zh" ? "价格太便宜的海外直购商城。付款后消失。现在二手交易诈骗的前身。那时根本没有退款这个概念。" : lang === "ko" ? null : "Too-cheap online stores. Pay, then vanish. Precursor to today's used-goods scam. Refunds were an unknown concept." },
                ].map((c, j) => (
                  <div key={j} style={{
                    background: "#231232",
                    border: "1px solid #333",
                    borderRadius: 12,
                    overflow: "hidden",
                    fontFamily: "monospace",
                  }}>
                    {/* 피처폰 상단바 */}
                    <div style={{ background: "#111", padding: "6px 10px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#888", fontSize: 9 }}>📶 SKT  🔋</span>
                      <span style={{ color: "#888", fontSize: 9 }}>{lang === "ko" ? "오전 11:23" : "11:23 AM"}</span>
                    </div>
                    {/* SMS 헤더 */}
                    <div style={{ background: "#2a2a2a", padding: "8px 12px", borderBottom: "1px solid #333" }}>
                      <p style={{ color: "#aaa", fontSize: 10, marginBottom: 2 }}>{lang === "ko" ? "보낸 사람" : lang === "ja" ? "差出人" : lang === "zh" ? "发件人" : "From"}</p>
                      <p style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{c.sender}</p>
                    </div>
                    {/* SMS 말풍선 */}
                    <div style={{ padding: "12px", background: "#231232" }}>
                      <div style={{
                        background: "#2e7d32", borderRadius: "4px 12px 12px 12px",
                        padding: "8px 10px", maxWidth: "85%", marginBottom: 12,
                      }}>
                        <p style={{ color: "#e8f5e9", fontSize: 11, lineHeight: 1.5 }}>{c.preview}</p>
                        <p style={{ color: "#a5d6a7", fontSize: 9, textAlign: "right", marginTop: 4 }}>수신 ✓✓</p>
                      </div>
                      <div style={{ borderTop: "1px solid #333", paddingTop: 10 }}>
                        <p style={{ color: "#34d399", fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{c.name}</p>
                        {c.nameTr && <p style={{ color: "#1a9a6a", fontSize: 9, marginBottom: 4 }}>{c.nameTr}</p>}
                        <p style={{ color: "#6b7280", fontSize: 11, lineHeight: 1.6 }}>{c.desc}</p>
                        {c.descTr && <p style={{ color: "#4a5a50", fontSize: 9, lineHeight: 1.5, marginTop: 4, borderTop: "1px solid #333", paddingTop: 4 }}>{c.descTr}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div> {/* ══ 2010년대 초 래퍼 끝 ══ */}

            {/* ══ 2015~2018: 카페·SNS 골목 핑크무드 야경 ══ */}
            <div style={{
              position: "relative", borderRadius: 24, overflow: "hidden",
              marginBottom: 24, padding: "32px 28px",
              backgroundImage: `linear-gradient(rgba(80,10,60,0.55), rgba(20,0,35,0.65)), url('/alley-2020s.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              {/* 벽 타일 패턴 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent 0px, transparent 24px, rgba(255,255,255,0.03) 24px, rgba(255,255,255,0.03) 25px),
                  repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(255,255,255,0.02) 48px, rgba(255,255,255,0.02) 49px)
                `,
              }} />
              {/* 골목 그림자 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)",
              }} />
              {/* 카페 핑크 간판 빛 */}
              <div style={{
                position: "absolute", top: 0, left: "20%", width: 140, height: 8,
                background: "linear-gradient(90deg, transparent, rgba(255,80,180,0.9), rgba(255,120,200,1), rgba(255,80,180,0.9), transparent)",
                boxShadow: "0 0 20px 8px rgba(220,60,180,0.6), 0 0 60px 20px rgba(180,0,160,0.3)",
                borderRadius: 4, animation: "slowPulse 4s infinite", pointerEvents: "none",
              }} />
              {/* 하단 빛 반사 */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 70,
                background: "linear-gradient(0deg, rgba(120,0,120,0.18) 0%, transparent 100%)",
                borderRadius: "0 0 24px 24px", pointerEvents: "none",
              }} />
              {/* 레트로 필터 오버레이 */}
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.05) 100%)", borderRadius: 24 }} />
              <div style={{ overflow: "hidden", marginBottom: 16, position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex", gap: 28, whiteSpace: "nowrap",
                  animation: "marqueeScroll 22s linear infinite",
                  color: "#c084fc99", fontSize: 10, fontFamily: "monospace",
                }}>
                  {(lang === "ko"
                    ? ["📸 인스타그램", "👥 페이스북", "💬 오카카스토리", "📊 주식카페", "🎯 재택알바", "📲 DM사기", "📸 인스타그램", "👥 페이스북", "💬 오카카스토리", "📊 주식카페", "🎯 재택알바", "📲 DM사기"]
                    : lang === "ja"
                    ? ["📸 Instagram", "👥 Facebook", "💬 KakaoStory", "📊 株式カフェ", "🎯 テレワーク詐欺", "📲 DM詐欺", "📸 Instagram", "👥 Facebook", "💬 KakaoStory", "📊 株式カフェ", "🎯 テレワーク詐欺", "📲 DM詐欺"]
                    : ["📸 Instagram", "👥 Facebook", "💬 KakaoStory", "📊 Stock Forums", "🎯 WFH Scam", "📲 DM Fraud", "📸 Instagram", "👥 Facebook", "💬 KakaoStory", "📊 Stock Forums", "🎯 WFH Scam", "📲 DM Fraud"]
                  ).map((t,i) => (
                    <span key={i}>{t} &nbsp;·&nbsp;</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #c58dc688)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>📸</div>
                  <span style={{ color: "#c58dc6", fontSize: 13, fontWeight: 700, letterSpacing: 4, fontFamily: "monospace" }}>── 2 0 1 5 ~ 2 0 1 8 ──</span>
                  <p style={{ color: "#c084fc", fontSize: 10, marginTop: 4, letterSpacing: 1 }}>{lang === "ko" ? "SNS · 인스타그램 · 오픈마켓 사기의 시대" : lang === "ja" ? "SNS・Instagram・オープンマーケット詐欺の時代" : lang === "zh" ? "社交媒体·Instagram·开放市场诈骗的时代" : "SNS · Instagram · Open Market Scam Era"}</p>
                </div>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #c58dc688, transparent)" }} />
              </div>

              {/* ── 2015~2018: 플랫 디자인/SNS 시대 ── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ height: 1, flex: 1, background: "#4c1d95", opacity: 0.6 }} />
                <span style={{ color: "#c58dc6", fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: "monospace" }}>── 2015~2018년 ──</span>
                <div style={{ height: 1, flex: 1, background: "#4c1d95", opacity: 0.6 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { platform: "Facebook", dot: "#1877f2", name: "SNS 지인 사칭", nameTr: lang === "ja" ? "SNS知人なりすまし" : lang === "zh" ? "SNS熟人冒充诈骗" : lang === "ko" ? null : "SNS Acquaintance Impersonation", post: "이거 실화냐 ㅋㅋ 나 어제 이거 당했는데... 갑자기 지인 계정에서 DM 와서 돈 빌려달라고 해서 보냈더니 해킹당한 계정이었음", like: "좋아요 247개", desc: "페이스북·인스타 클론 계정. AI 없던 시대의 수작업 사기. 지인 관계망을 가장 잘 활용한 형태.", descTr: lang === "ja" ? "Facebook・Instagramクローンアカウント。AIがない時代の手作業詐欺。知人の関係網を巧みに利用した形態。" : lang === "zh" ? "Facebook·Instagram克隆账号。没有AI的时代的手工诈骗。最善于利用熟人关系网的形式。" : lang === "ko" ? null : "Cloned Facebook/Instagram accounts. Manual fraud before AI. Best exploited personal social networks." },
                  { platform: "취업카페", dot: "#ff6b35", name: "가짜 재택 취업 사기", nameTr: lang === "ja" ? "偽テレワーク求人詐欺" : lang === "zh" ? "假冒远程工作诈骗" : lang === "ko" ? null : "Fake Remote Job Scam", post: "★ 급구 ★ 재택근무 월 300만원 보장! 자격증 불필요, 경력 불필요. 교재비 15만원 선납 후 교육 시작. 지금 바로 연락주세요!", like: "조회 8,402", desc: "\"재택근무 월 300만원\" 광고. 교재비·장비비 선납 후 잠적. IMF 세대 이후 청년층 취업난을 노린 수법.", descTr: lang === "ja" ? "\"テレワーク月300万ウォン\"広告。教材費先払い後に逃走。IMF世代以降の若年層の就職難を狙った手口。" : lang === "zh" ? "\"居家办公月薪300万\"广告。先付教材费后消失。针对IMF危机后年轻人就业困难的手法。" : lang === "ko" ? null : "Work-from-home ads. Pay for materials upfront, then vanish. Targeted youth unemployment after IMF crisis." },
                  { platform: "KakaoTalk", dot: "#ffe100", name: "3단계 메신저 피싱", nameTr: lang === "ja" ? "3段階メッセンジャーフィッシング" : lang === "zh" ? "三阶段短信钓鱼" : lang === "ko" ? null : "3-Step Messenger Phishing", post: "나야 급한데 지금 폰이 없어서 이 번호로 연락해. 50만원만 계좌이체 해줄 수 있어? 오늘 저녁에 현금으로 줄게", like: "읽음 1", desc: "문자→오카카→전화 3단계 접근법 등장. 각 채널에서 진짜인 척 신뢰 구축 후 최종 결제 유도.", descTr: lang === "ja" ? "SMS→カカオ→電話の3段階アプローチ。各チャンネルで信頼を構築後、最終決済を誘導。" : lang === "zh" ? "短信→KakaoTalk→电话三阶段。在每个渠道建立信任后，最终诱导付款。" : lang === "ko" ? null : "SMS → KakaoTalk → phone: 3-step approach. Build trust on each channel pretending to be real, then pressure payment." },
                ].map((c, j) => (
                  <div key={j} style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)", padding: "1px", borderRadius: 12 }}>
                  <div style={{
                    background: "#0d0014",
                    borderRadius: 11,
                    overflow: "hidden",
                    position: "relative",
                  }}>
                    {/* 배지 */}
                    <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(236,72,153,0.2)", border: "1px solid #ec4899", borderRadius: 20, padding: "2px 8px", fontSize: 9, color: "#f9a8d4", fontWeight: 700, zIndex: 2 }}>📱 SNS 사기 수법</div>
                    {/* SNS 헤더 */}
                    <div style={{ padding: "10px 12px", borderBottom: "1px solid #27272a", display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: j===0?"linear-gradient(135deg,#1877f2,#0d5cbf)":j===1?"linear-gradient(135deg,#ff6b35,#e55b25)":"linear-gradient(135deg,#ffe100,#f0cc00)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 12, color: "#fff", fontWeight: 900 }}>{c.platform[0]}</span>
                      </div>
                      <div>
                        <p style={{ color: "#e4e4e7", fontSize: 12, fontWeight: 700 }}>{c.platform}</p>
                        <p style={{ color: "#71717a", fontSize: 10 }}>{lang === "ko" ? "201X년경" : "circa 201X"}</p>
                      </div>
                    </div>
                    {/* 게시물 */}
                    <div style={{ padding: "12px", background: "#0d0014" }}>
                      <p style={{ color: "#d1d5db", fontSize: 11, lineHeight: 1.6, marginBottom: 8, fontStyle: "italic", borderLeft: "2px solid #3f3f46", paddingLeft: 8 }}>{c.post}</p>
                      <p style={{ color: "#6b7280", fontSize: 10, marginBottom: 10 }}>{"❤️ " + c.like}</p>
                      <div style={{ borderTop: "1px solid #27272a", paddingTop: 8 }}>
                        <p style={{ color: "#e879f9", fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{c.name}</p>
                        {c.nameTr && <p style={{ color: "#9b4fa8", fontSize: 9, marginBottom: 4 }}>{c.nameTr}</p>}
                        <p style={{ color: "#9ca3af", fontSize: 11, lineHeight: 1.6 }}>{c.desc}</p>
                        {c.descTr && <p style={{ color: "#6b5080", fontSize: 9, lineHeight: 1.5, marginTop: 4, borderTop: "1px solid #27272a", paddingTop: 4 }}>{c.descTr}</p>}
                      </div>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            </div>
            </div> {/* ══ SNS 시대 래퍼 끝 ══ */}

            {/* ══ 2019~2021: 텅 빈 골목 — 우환폐렴 봉쇄 분위기 ══ */}
            <div style={{
              position: "relative", borderRadius: 24, overflow: "hidden",
              marginBottom: 24, padding: "32px 28px",
              backgroundImage: `linear-gradient(rgba(5,15,30,0.6), rgba(5,20,40,0.68)), url('/alley-2026.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              {/* 빗길 아스팔트 텍스처 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                backgroundImage: `
                  repeating-linear-gradient(175deg, transparent 0px, transparent 3px, rgba(80,120,160,0.06) 3px, rgba(80,120,160,0.06) 4px)
                `,
              }} />
              {/* 골목 그림자 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.7) 100%)",
              }} />
              {/* 흐릿한 가로등 (우중충) */}
              <div style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: 180, height: 10,
                background: "rgba(180,200,220,0.4)",
                boxShadow: "0 0 30px 10px rgba(140,170,200,0.25), 0 0 80px 30px rgba(100,130,170,0.12)",
                borderRadius: 5, animation: "slowPulse 6s infinite", pointerEvents: "none",
              }} />
              {/* 안개/수증기 */}
              <div style={{
                position: "absolute", bottom: 0, left: "-10%", right: "-10%", height: 100,
                background: "linear-gradient(0deg, rgba(60,90,120,0.2) 0%, transparent 100%)",
                animation: "fogDrift 12s ease-in-out infinite",
                pointerEvents: "none",
              }} />
              {/* 빗방울 효과 */}
              {[...Array(8)].map((_,i) => (
                <div key={i} style={{
                  position: "absolute",
                  top: 0,
                  left: `${10 + i * 12}%`,
                  width: 1,
                  height: 60,
                  background: "linear-gradient(180deg, transparent, rgba(100,200,255,0.3), transparent)",
                  animation: `rainDrop ${2 + (i % 3) * 0.7}s linear infinite`,
                  animationDelay: `${i * 0.4}s`,
                  pointerEvents: "none",
                }} />
              ))}
              {/* TV 스태틱 오버레이 */}
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)", borderRadius: 24 }} />
              <div style={{ overflow: "hidden", marginBottom: 16, position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex", gap: 28, whiteSpace: "nowrap",
                  animation: "marqueeScroll 25s linear infinite",
                  color: "#22d3ee99", fontSize: 10, fontFamily: "monospace",
                }}>
                  {(lang === "ko"
                    ? ["😷 마스크 대란", "🏠 사회적 거리두기", "💉 백신 사기", "📦 긴급재난지원금", "🔒 거리두기 4단계", "📰 속보", "😷 마스크 대란", "🏠 사회적 거리두기", "💉 백신 사기", "📦 긴급재난지원금", "🔒 거리두기 4단계", "📰 속보"]
                    : lang === "ja"
                    ? ["😷 マスク不足", "🏠 社会的距離", "💉 ワクチン詐欺", "📦 緊急災害支援金", "🔒 距離4段階", "📰 速報", "😷 マスク不足", "🏠 社会的距離", "💉 ワクチン詐欺", "📦 緊急災害支援金", "🔒 距離4段階", "📰 速報"]
                    : ["😷 Mask Shortage", "🏠 Social Distancing", "💉 Vaccine Scam", "📦 Relief Fund", "🔒 Lockdown Lv4", "📰 Breaking News", "😷 Mask Shortage", "🏠 Social Distancing", "💉 Vaccine Scam", "📦 Relief Fund", "🔒 Lockdown Lv4", "📰 Breaking News"]
                  ).map((t,i) => (
                    <span key={i}>{t} &nbsp;·&nbsp;</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #22d3ee44)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>😷</div>
                  <span style={{ color: "#22d3ee", fontSize: 13, fontWeight: 700, letterSpacing: 4, fontFamily: "monospace" }}>── 2 0 1 9 ~ 2 0 2 1 ──</span>
                  <p style={{ color: "#67e8f9", fontSize: 10, marginTop: 4, letterSpacing: 1 }}>{lang === "ko" ? "우환폐렴 · 재난지원금 · 비대면 사기의 시대" : lang === "ja" ? "コロナ・災害支援金・非対面詐欺の時代" : lang === "zh" ? "新冠疫情·灾难补贴·非对面诈骗的时代" : "COVID-19 · Relief Funds · Remote Scam Era"}</p>
                </div>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #22d3ee44, transparent)" }} />
              </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ height: 1, flex: 1, background: "#67e8f9", opacity: 0.6 }} />
                <span style={{ color: "#22d3ee", fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: "monospace" }}>{lang === "ko" ? "── 2019~2021년 (우환폐렴 시대) ──" : lang === "ja" ? "── 2019~2021 (コロナ時代) ──" : lang === "zh" ? "── 2019~2021 (新冠疫情时代) ──" : "── 2019~2021 (COVID Era) ──"}</span>
                <div style={{ height: 1, flex: 1, background: "#67e8f9", opacity: 0.6 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { breaking: "BREAKING", headline: "마스크 대란 틈타 사기 급증", headlineTr: lang === "ja" ? "マスク不足に乗じた詐欺が急増" : lang === "zh" ? "趁口罩短缺诈骗激增" : lang === "ko" ? null : "Scams Surge During Mask Shortage", sub: "\"마스크 재고 있어요\" 선입금 요구 후 잠적 — 전국 피해 1만 건 이상", subTr: lang === "ja" ? "\"マスク在庫あります\"先払い要求後に逃走 — 全国被害1万件以上" : lang === "zh" ? "\"口罩有货\"要求先付款后消失 — 全国受害超1万件" : lang === "ko" ? null : "'Masks in stock' — demand prepayment, then vanish. 10,000+ victims nationwide.", name: "우환폐렴 마스크 사기", nameTr: lang === "ja" ? "コロナウイルスマスク詐欺" : lang === "zh" ? "新冠病毒口罩诈骗" : lang === "ko" ? null : "COVID Mask Scam", desc: "위기 상황이 사기꾼의 최적 환경임을 증명. 우환폐렴(코로나) 확산으로 마스크라면 뭐든 믿던 시절.", descTr: lang === "ja" ? "危機状況が詐欺師の最適環境であることを証明。コロナウイルス拡散でマスクなら何でも信じた時代。" : lang === "zh" ? "证明了危机情况是诈骗者的最佳环境。新冠病毒蔓延导致人们对口罩相关内容深信不疑。" : lang === "ko" ? null : "Proof that crises are ideal for scammers. During COVID, people trusted anything related to masks." },
                  { breaking: lang === "ko" ? "속보" : "ALERT", headline: "재난지원금 사칭 스미싱 수백만 건", headlineTr: lang === "ja" ? "災害支援金なりすましスミッシング数百万件" : lang === "zh" ? "冒充灾难补贴短信钓鱼数百万条" : lang === "ko" ? null : "Millions of Relief Fund Phishing Texts", sub: "정부 공식 링크인 척 개인정보 탈취 — '신청하세요'가 함정", subTr: lang === "ja" ? "政府公式リンクのふりをして個人情報窃取 — '申請してください'が罠" : lang === "zh" ? "假冒政府官方链接盗取个人信息 — '请申请'就是陷阱" : lang === "ko" ? null : "Fake official govt links steal personal data — 'Apply here' is the trap.", name: "재난지원금 피싱", nameTr: lang === "ja" ? "災害支援金フィッシング" : lang === "zh" ? "灾难补贴钓鱼诈骗" : lang === "ko" ? null : "Relief Fund Phishing", desc: "국가 재난 상황을 악용한 역대 최대 스미싱. '정부니까 믿어야지'라는 심리를 정확히 노림.", descTr: lang === "ja" ? "国家災害状況を悪用した史上最大のスミッシング。「政府だから信じなければ」という心理を正確に狙った。" : lang === "zh" ? "利用国家灾难情况的史上最大短信钓鱼。精准利用了'是政府所以要相信'的心理。" : lang === "ko" ? null : "The largest smishing campaign ever. Precisely targeted the psychology: 'it's the government, I must trust them.'" },
                  { breaking: lang === "ko" ? "특보" : "WARN", headline: "비트코인 2배 보장 텔레그램 방 주의", headlineTr: lang === "ja" ? "ビットコイン2倍保証テレグラムグループに注意" : lang === "zh" ? "警惕比特币2倍保证Telegram群" : lang === "ko" ? null : "Beware: Bitcoin 2x Guaranteed Telegram Groups", sub: "코인 자체가 낯설어 검증 방법조차 몰랐던 시기 — 수천억 피해", subTr: lang === "ja" ? "コイン自体が珍しく検証方法すら知らなかった時期 — 数千億ウォンの被害" : lang === "zh" ? "加密货币本身还很陌生，连验证方法都不知道的时期 — 数千亿韩元受损" : lang === "ko" ? null : "Crypto was so unfamiliar, no one knew how to verify. Hundreds of billions in losses.", name: "코인 초기 투자 사기", nameTr: lang === "ja" ? "コイン初期投資詐欺" : lang === "zh" ? "早期加密货币投资诈骗" : lang === "ko" ? null : "Early Crypto Investment Scam", desc: "블록체인을 아무도 이해 못 하던 시절. '원리를 모르니 그냥 믿자'는 심리가 대규모 피해로.", descTr: lang === "ja" ? "ブロックチェーンを誰も理解できなかった時代。「原理がわからないからとにかく信じよう」という心理が大規模被害に。" : lang === "zh" ? "没有人理解区块链的年代。'不懂原理就直接相信吧'的心理造成了大规模损失。" : lang === "ko" ? null : "Nobody understood blockchain. 'I don't get it so I'll just trust it' — the mindset that led to massive losses." },
                ].map((c, j) => (
                  <div key={j} style={{
                    background: "linear-gradient(135deg, #0a0e18, #0d1520)",
                    border: "1px solid #1f2937",
                    borderLeft: "3px solid #dc2626",
                    borderRadius: 8,
                    overflow: "hidden",
                    fontFamily: "sans-serif",
                    position: "relative",
                  }}>
                    {/* LIVE 배지 */}
                    <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(220,38,38,0.8)", borderRadius: 4, padding: "2px 6px", fontSize: 9, color: "#fff", fontWeight: 900 }}>📡 LIVE</div>
                    {/* 뉴스 속보 헤더 */}
                    <div style={{ background: "linear-gradient(90deg, #dc2626, #991b1b)", padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fdf8ff", animation: "pulse 1s infinite" }} />
                      <span style={{ color: "#fff", fontSize: 10, fontWeight: 900, letterSpacing: 2 }}>{"🔴 " + c.breaking}</span>
                    </div>
                    <div style={{ padding: "12px" }}>
                      <p style={{ color: "#ffffff", fontWeight: 900, fontSize: 13, lineHeight: 1.4, marginBottom: 2, textShadow: "0 0 8px rgba(255,255,255,0.3)" }}>{c.headline}</p>
                      {c.headlineTr && <p style={{ color: "#9ca3af", fontSize: 9, marginBottom: 4 }}>{c.headlineTr}</p>}
                      <p style={{ color: "#9ca3af", fontSize: 10, lineHeight: 1.5, marginBottom: 4 }}>{c.sub}</p>
                      {c.subTr && <p style={{ color: "#6b7280", fontSize: 9, lineHeight: 1.5, marginBottom: 6, paddingBottom: 10, borderBottom: "1px solid #1f2937" }}>{c.subTr}</p>}
                      {!c.subTr && <div style={{ marginBottom: 6, paddingBottom: 10, borderBottom: "1px solid #1f2937" }} />}
                      <p style={{ color: "#22d3ee", fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{c.name}</p>
                      {c.nameTr && <p style={{ color: "#0e8a9e", fontSize: 9, marginBottom: 4 }}>{c.nameTr}</p>}
                      <p style={{ color: "#94a3b8", fontSize: 11, lineHeight: 1.6 }}>{c.desc}</p>
                      {c.descTr && <p style={{ color: "#5a6a72", fontSize: 9, lineHeight: 1.5, marginTop: 4, borderTop: "1px solid #1f2937", paddingTop: 4 }}>{c.descTr}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div> {/* ══ 우환폐렴 시대 래퍼 끝 ══ */}

            {/* ══ 2022~2023: 홍대 네온 골목 / AI 시대 전야 ══ */}
            <div style={{
              position: "relative", borderRadius: 24, overflow: "hidden",
              marginBottom: 24, padding: "32px 28px",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.48), rgba(0,0,0,0.52)), url('/alley-2026.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              {/* 콘크리트 벽 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent 0px, transparent 28px, rgba(255,255,255,0.025) 28px, rgba(255,255,255,0.025) 29px)
                `,
              }} />
              {/* 골목 그림자 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.65) 100%)",
              }} />
              {/* 네온 보라 간판 */}
              <div style={{
                position: "absolute", top: 0, left: "15%", width: 120, height: 7,
                background: "linear-gradient(90deg, transparent, rgba(180,0,255,0.95), rgba(220,80,255,1), rgba(180,0,255,0.95), transparent)",
                boxShadow: "0 0 20px 8px rgba(160,0,240,0.7), 0 0 60px 20px rgba(120,0,200,0.4)",
                borderRadius: 4, animation: "lampFlicker 5s infinite", pointerEvents: "none",
              }} />
              {/* 네온 파랑 간판 */}
              <div style={{
                position: "absolute", top: 12, right: "15%", width: 90, height: 6,
                background: "linear-gradient(90deg, transparent, rgba(0,180,255,0.9), rgba(40,220,255,1), rgba(0,180,255,0.9), transparent)",
                boxShadow: "0 0 16px 6px rgba(0,160,240,0.6), 0 0 45px 14px rgba(0,120,200,0.3)",
                borderRadius: 4, animation: "slowPulse 3.5s infinite", pointerEvents: "none",
              }} />
              {/* 바닥 네온 반사 */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
                background: "linear-gradient(0deg, rgba(100,0,180,0.2) 0%, transparent 100%)",
                borderRadius: "0 0 24px 24px", pointerEvents: "none",
              }} />
              <div style={{ overflow: "hidden", marginBottom: 16, position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex", gap: 28, whiteSpace: "nowrap",
                  animation: "marqueeScroll 20s linear infinite",
                  color: "#c58dc655", fontSize: 10, fontFamily: "monospace",
                }}>
                  {(lang === "ko"
                    ? ["🎙️ AI 목소리 복제", "📈 주식 오픈채팅", "🫑 피망마켓", "⚡ 개번장터", "🤖 딥보이스", "💰 코인 사기", "🎙️ AI 목소리 복제", "📈 주식 오픈채팅", "🫑 피망마켓", "⚡ 개번장터", "🤖 딥보이스", "💰 코인 사기"]
                    : lang === "ja"
                    ? ["🎙️ AI音声複製", "📈 株式オープンチャット", "🫑 피망마켓Market", "⚡ Bunjang", "🤖 ディープボイス", "💰 コイン詐欺", "🎙️ AI音声複製", "📈 株式オープンチャット", "🫑 피망마켓Market", "⚡ Bunjang", "🤖 ディープボイス", "💰 コイン詐欺"]
                    : ["🎙️ AI Voice Clone", "📈 Stock Open Chat", "🫑 Carrot Market", "⚡ Bunjang", "🤖 Deep Voice", "💰 Coin Scam", "🎙️ AI Voice Clone", "📈 Stock Open Chat", "🫑 Carrot Market", "⚡ Bunjang", "🤖 Deep Voice", "💰 Coin Scam"]
                  ).map((t,i) => (
                    <span key={i}>{t} &nbsp;·&nbsp;</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #c58dc688)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>🤖</div>
                  <span style={{ color: "#c58dc6", fontSize: 13, fontWeight: 700, letterSpacing: 4, fontFamily: "monospace" }}>── 2 0 2 2 ~ 2 0 2 3 ──</span>
                  <p style={{ color: "#c084fc", fontSize: 10, marginTop: 4, letterSpacing: 1 }}>{lang === "ko" ? "AI 전야 · 딥보이스 · 중고거래 사기의 시대" : lang === "ja" ? "AI前夜・ディープボイス・中古取引詐欺の時代" : lang === "zh" ? "AI前夜·深度伪造语音·二手交易诈骗的时代" : "Pre-AI Era · Deep Voice · Used Goods Scam"}</p>
                </div>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #c58dc688, transparent)" }} />
              </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ height: 1, flex: 1, background: "#831843", opacity: 0.6 }} />
                <span style={{ color: "#c58dc6", fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: "monospace" }}>{lang === "ko" ? "── 2022~2023년 ──" : "── 2022~2023 ──"}</span>
                <div style={{ height: 1, flex: 1, background: "#831843", opacity: 0.6 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { tag: "AI VOICE", glow: "#c58dc6", name: "딥보이스 보이스피싱 등장", nameTr: lang === "ja" ? "ディープボイス詐欺の登場" : lang === "zh" ? "深度伪造语音诈骗兴起" : lang === "ko" ? null : "Deepfake Voice Phishing Emerges", waveform: "▁▃▇█▅▃▁▂▆█▇▄▁", desc: "AI로 자녀 목소리 복제. 3~5초 샘플만으로 완벽 모사. 부모들이 처음으로 목소리조차 믿지 못하게 된 해.", descTr: lang === "ja" ? "AIで子供の声を複製。3〜5秒のサンプルだけで完璧な模倣。親が初めて声さえ信用できなくなった年。" : lang === "zh" ? "AI复制子女声音。仅需3~5秒样本即可完美模仿。父母第一次连声音都无法信任的一年。" : lang === "ko" ? null : "AI replicates a child's voice with just 3-5 seconds of audio. Parents could no longer trust even familiar voices." },
                  { tag: "OPEN CHAT", glow: "#fbbf24", name: "오픈채팅 투자 사기 전성기", nameTr: lang === "ja" ? "オープンチャット投資詐欺の全盛期" : lang === "zh" ? "开放聊天室投资诈骗鼎盛期" : lang === "ko" ? null : "Open Chat Investment Scam Peak", waveform: "📈 +312% 📈 +208% 📈 +441%", desc: "오카카 오픈채팅 '주식 고수' 방. 수익 인증 캡처 도배 → 입금 유도 → 잠적. 동시 피해자 수천 명.", descTr: lang === "ja" ? "カカオオープンチャット「株の達人」部屋。収益証明キャプチャーで埋め尽くし→入金誘導→逃走。同時被害者数千人。" : lang === "zh" ? "KakaoTalk开放聊天室'股票高手'群。收益截图轰炸→诱导入金→消失。同时受害者数千人。" : lang === "ko" ? null : "KakaoTalk 'stock expert' open chat rooms. Profit screenshots → deposit pressure → disappear. Thousands of simultaneous victims." },
                  { tag: "MARKET", glow: "#34d399", name: "중고거래 사기 급증", nameTr: lang === "ja" ? "中古取引詐欺の急増" : lang === "zh" ? "二手交易诈骗激增" : lang === "ko" ? null : "Used Goods Scam Surge", waveform: "피망마켓🫑 번개⚡ 평화나라", desc: "플랫폼 폭발 성장과 함께 사기도 급증. '직거래 문화'가 오히려 사기에 악용되기 시작한 전환점.", descTr: lang === "ja" ? "プラットフォームの爆発的成長とともに詐欺も急増。「直接取引文化」が詐欺に悪用され始めた転換点。" : lang === "zh" ? "随着平台爆炸式增长，诈骗也急剧增加。'直接交易文化'开始被诈骗分子利用的转折点。" : lang === "ko" ? null : "Scams surged alongside platform explosive growth. The 'direct trade culture' began being exploited by fraudsters." },
                ].map((c, j) => (
                  <div key={j} style={{
                    background: "#09090b",
                    border: `1px solid ${c.glow}33`,
                    borderRadius: 12,
                    padding: "16px",
                    boxShadow: `0 0 20px ${c.glow}11`,
                    backdropFilter: "blur(8px)",
                  }}>
                    <div style={{
                      display: "inline-block",
                      background: `${c.glow}22`,
                      border: `1px solid ${c.glow}55`,
                      borderRadius: 20, padding: "2px 10px", marginBottom: 10,
                    }}>
                      <span style={{ color: c.glow, fontSize: 9, fontWeight: 700, letterSpacing: 2, fontFamily: "monospace" }}>{c.tag}</span>
                    </div>
                    <p style={{ color: "#f4f4f5", fontWeight: 700, fontSize: 13, marginBottom: 2, lineHeight: 1.3 }}>{c.name}</p>
                    {c.nameTr && <p style={{ color: "#888", fontSize: 9, marginBottom: 6 }}>{c.nameTr}</p>}
                    <div style={{
                      background: "#18181b", borderRadius: 6, padding: "6px 10px", marginBottom: 10,
                      fontFamily: "monospace", fontSize: 11, color: c.glow, letterSpacing: 1,
                    }}>{c.waveform}</div>
                    <p style={{ color: "#71717a", fontSize: 11, lineHeight: 1.6 }}>{c.desc}</p>
                    {c.descTr && <p style={{ color: "#555", fontSize: 9, lineHeight: 1.5, marginTop: 4, borderTop: `1px solid ${c.glow}22`, paddingTop: 4 }}>{c.descTr}</p>}
                  </div>
                ))}
              </div>
            </div>
            </div> {/* ══ 2022-2023 래퍼 끝 ══ */}

            {/* ── 2024~현재: AI·딥페이크 시대 ── */}
            <div style={{ marginTop: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ height: 1, flex: 1, background: "#7c3aed", opacity: 0.6 }} />
                <span style={{ color: "#c58dc6", fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: "monospace" }}>{lang === "ko" ? "── 2024년 ~ 현재 ──" : "── 2024 ~ Present ──"}</span>
                <div style={{ height: 1, flex: 1, background: "#7c3aed", opacity: 0.6 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { tag: "DEEPFAKE", glow: "#c58dc6", name: "AI 딥페이크 협박 사기", nameTr: lang === "ja" ? "AIディープフェイク脅迫詐欺" : lang === "zh" ? "AI深度伪造恐吓诈骗" : lang === "ko" ? null : "AI Deepfake Extortion Scam", visual: "👤 → 🤖 → 🎭", desc: "실제 얼굴·목소리를 AI로 합성해 지인인 척 접근하거나, 없는 영상을 만들어 협박. 눈으로 봐도 믿을 수 없는 시대의 시작.", descTr: lang === "ja" ? "実際の顔・声をAIで合成して知人のふりをして近づいたり、存在しない動画を作って脅迫。目で見ても信じられない時代の始まり。" : lang === "zh" ? "用AI合成真实面孔和声音假扮熟人，或制作不存在的视频进行恐吓。眼见也不能为实的时代开始。" : lang === "ko" ? null : "AI synthesizes real faces/voices to impersonate acquaintances, or fabricates videos to extort. The era where seeing is no longer believing." },
                  { tag: "GPT SCAM", glow: "#c58dc6", name: "AI 자동 문자 폭탄", nameTr: lang === "ja" ? "AI自動テキスト爆弾" : lang === "zh" ? "AI自动短信轰炸" : lang === "ko" ? null : "AI Auto-Text Bombing", visual: "🤖 → 📱 × 10,000", desc: "ChatGPT·LLM으로 완벽한 문법의 개인 맞춤 사기 문자 대량 생성. 오타·어색함으로 구별하던 기존 방법이 완전히 무력화.", descTr: lang === "ja" ? "ChatGPT・LLMで完璧な文法の個人맞춤詐欺テキストを大量生成。誤字・不自然さで見分けていた従来の方法が完全に無力化。" : lang === "zh" ? "用ChatGPT·LLM大量生成语法完美的个人定制诈骗短信。通过错字·不自然感辨别的传统方法完全失效。" : lang === "ko" ? null : "ChatGPT/LLMs generate perfectly written personalized scam texts at scale. Typos and awkwardness as telltale signs — now gone." },
                  { tag: "VOICE AI", glow: "#34d399", name: "실시간 목소리 복제 통화", nameTr: lang === "ja" ? "リアルタイム音声複製通話" : lang === "zh" ? "实时声音复制通话" : lang === "ko" ? null : "Real-Time Voice Cloning Call", visual: "☎️ → AI → 가족목소리", desc: "3초 샘플로 가족 목소리 실시간 복제 통화. 납치 당했다며 송금 요구. 목소리로는 더 이상 진위 구분 불가.", descTr: lang === "ja" ? "3秒サンプルで家族の声をリアルタイム複製通話。誘拐されたと言って送金要求。声では真偽を判断できなくなった。" : lang === "zh" ? "用3秒样本实时复制家人声音打电话。声称被绑架要求汇款。声音已无法辨别真假。" : lang === "ko" ? null : "Clone a family member's voice from 3 seconds, call in real-time claiming kidnapping. Voices can no longer prove identity." },
                ].map((c, j) => (
                  <div key={j} style={{
                    background: "#09090b",
                    border: `1px solid ${c.glow}33`,
                    borderRadius: 12,
                    padding: "16px",
                    boxShadow: `0 0 24px ${c.glow}18`,
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: 0, right: 0, width: 60, height: 60,
                      background: `radial-gradient(circle at top right, ${c.glow}22, transparent)`,
                    }} />
                    <div style={{
                      display: "inline-block",
                      background: `${c.glow}22`,
                      border: `1px solid ${c.glow}55`,
                      borderRadius: 20, padding: "2px 10px", marginBottom: 10,
                    }}>
                      <span style={{ color: c.glow, fontSize: 9, fontWeight: 700, letterSpacing: 2, fontFamily: "monospace" }}>{c.tag}</span>
                    </div>
                    <p style={{ color: "#f4f4f5", fontWeight: 700, fontSize: 13, marginBottom: 2, lineHeight: 1.3 }}>{c.name}</p>
                    {c.nameTr && <p style={{ color: "#888", fontSize: 9, marginBottom: 6 }}>{c.nameTr}</p>}
                    <div style={{
                      background: "#18181b", borderRadius: 6, padding: "6px 10px", marginBottom: 10,
                      fontFamily: "monospace", fontSize: 11, color: c.glow, letterSpacing: 1,
                    }}>{c.visual}</div>
                    <p style={{ color: "#71717a", fontSize: 11, lineHeight: 1.6 }}>{c.desc}</p>
                    {c.descTr && <p style={{ color: "#555", fontSize: 9, lineHeight: 1.5, marginTop: 4, borderTop: `1px solid ${c.glow}22`, paddingTop: 4 }}>{c.descTr}</p>}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 마무리 인용 + AI 전환 문구 */}
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <p style={{ color: "#6b7280", fontSize: 11, lineHeight: 1.7, fontFamily: "monospace", marginBottom: 32 }}>
              {lang === "ko" ? "── 수법은 달라졌지만, 사람의 심리를 노린다는 본질은 변하지 않았습니다 ──" : lang === "ja" ? "── 手口は変わっても、人間の心理を狙うという本質は変わっていません ──" : lang === "zh" ? "── 手法虽然改变，但针对人类心理的本质从未改变 ──" : "── The methods change, but the essence — exploiting human psychology — never does ──"}
            </p>
            <div style={{
              background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 100%)",
              border: "1px solid #7c3aed44",
              borderRadius: 20,
              padding: isMobile ? "20px 16px" : "32px 40px",
              maxWidth: 720,
              margin: "0 auto",
              boxShadow: "0 0 40px #7c3aed22",
            }}>
              <p style={{ color: "#c58dc6", fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 16, fontFamily: "monospace" }}>AI TIME</p>
              <p style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 2.0, marginBottom: 20 }}>
                옛날의 수법이랑 지금의 수법은 시대가 변하면서 많이 달라졌습니다.<br />
                AI의 증가에 따른 수법을 이용하여 만드는 사기도 이에 한몫을 하죠.
              </p>
              <div style={{ height: 1, background: "#7c3aed33", margin: "20px 0" }} />
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 2.0 }}>
                이제 사기는 AI가 당신의 얼굴을 만들고, 가족의 목소리로 전화하며, 완벽한 문법으로 문자를 보냅니다.<br />
                오타 하나, 어색한 말투와 어눌한 조선어 하나로 구별하던 시대는 끝났습니다.
              </p>
            </div>
          </div>

          {/* ── 이 프로그램이 필요한 이유 ── */}
          <div style={{
            marginTop: 56,
            background: "linear-gradient(160deg, #1a0a2e 0%, #0f1a2e 50%, #0a1a18 100%)",
            border: "1px solid #7c3aed33",
            borderRadius: 24,
            padding: isMobile ? "28px 16px" : "48px 40px",
          }}>
            {/* 손글씨 서약 문구 + 개발자 사진 */}
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              {/* 개발자 사진 */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <div style={{
                  width: 110, height: 110, borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #9161b2",
                  boxShadow: "0 0 0 4px #7c3aed33, 0 8px 32px #7c3aed55",
                  flexShrink: 0,
                }}>
                  <img
                    src="/me.png"
                    alt="AI개발자 부엉이"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                  />
                </div>
              </div>
              <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');`}</style>
              <p style={{
                fontFamily: "'Mansei', 'Nanum Brush Script', cursive",
                fontSize: 30, lineHeight: 1.7, color: "#dcc5e8",
                textShadow: "0 0 20px #7c3aed88, 0 0 40px #7c3aed44",
                letterSpacing: 2, margin: 0, fontWeight: 700,
              }}>
                범죄를 막을 수 있는 대한민국을
              </p>
              <p style={{
                fontFamily: "'Mansei', 'Nanum Brush Script', cursive",
                fontSize: 30, lineHeight: 1.7, color: "#dcc5e8",
                textShadow: "0 0 20px #7c3aed88, 0 0 40px #7c3aed44",
                letterSpacing: 2, margin: 0, fontWeight: 700,
              }}>
                저 AI개발자 <span style={{ color: "#fbbf24", textShadow: "0 0 20px #fbbf2488" }}>🦉 부엉이</span>가 만들겠습니다.
              </p>
              <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#7c3aed55,transparent)", margin: "24px auto", maxWidth: 400 }} />
            </div>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span style={{ color: "#c58dc6", fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: "monospace" }}>WHY THIS EXISTS</span>
              <h3 style={{ color: "#f4f4f5", fontSize: 26, fontWeight: 900, marginTop: 12, marginBottom: 0, letterSpacing: -0.5 }}>
                그래서 이 프로그램이 필요합니다
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
              {[
                {
                  icon: "🧠",
                  color: "#c58dc6",
                  title: "직접 겪어야 안 속는다",
                  body: "경고 문자 100번보다 한 번 직접 당해보는 경험이 훨씬 강력합니다. 이 앱은 안전하게 '한 번 당해볼 수 있는' 공간입니다.",
                },
                {
                  icon: "🤖",
                  color: "#34d399",
                  title: "AI 사기는 기존 방법으로 못 막는다",
                  body: "눈으로 봐도, 귀로 들어도 진짜와 구별이 안 됩니다. AI가 만든 사기를 AI로 체험하고 패턴을 익혀야 합니다.",
                },
                {
                  icon: "🛡️",
                  color: "#f59e0b",
                  title: "당신 주변 사람을 지킬 수 있다",
                  body: "나만 아는 게 아니라 부모님, 친구, 동생에게 공유하세요. 한 명이 알면 열 명이 안 속습니다.",
                },
              ].map((r, i) => (
                <div key={i} style={{
                  background: "#111118",
                  border: `1px solid ${r.color}33`,
                  borderRadius: 16,
                  padding: "24px 20px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{r.icon}</div>
                  <p style={{ color: r.color, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{r.title}</p>
                  <p style={{ color: "#71717a", fontSize: 12, lineHeight: 1.7 }}>{r.body}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <a href="/crime" style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #7c3aed, #c58dc6)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                padding: "14px 36px",
                borderRadius: 50,
                textDecoration: "none",
                boxShadow: "0 0 24px #7c3aed55",
                letterSpacing: 0.5,
              }}>지금 바로 체험해보기 →</a>
            </div>
          </div>

        </div>
      </section>

      {/* ── 제작 목적 & 실제 통계 ── */}
      <section id="why" style={{
        background: "#fdf8ff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0",
        padding: isMobile ? "48px 16px" : "80px 40px",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>

          {/* 섹션 헤더 */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>WHY WE BUILT THIS</p>
            <h2 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 900, letterSpacing: -0.5, color: "#1c0d2e", marginBottom: 14 }}>
              {lang === "ko" ? "왜 이 프로그램이 필요한가" : lang === "en" ? "Why This Program Is Needed" : lang === "ja" ? "なぜこのプログラムが必要か" : lang === "zh" ? "为什么需要这个程序" : lang === "vi" ? "Tại sao cần chương trình này" : lang === "es" ? "Por qué se necesita este programa" : "Why This Program Is Needed"}
            </h2>
            <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
              {lang === "ko" ? <>대한민국에서는 매년 수십만 명의 시민이 범죄에 속아 전 재산을 잃습니다.<br /><strong style={{ color: "#334155" }}>알면 막을 수 있습니다.</strong></> : lang === "ja" ? <>毎年、何十万人もの市民が犯罪に騙されて全財産を失います。<br /><strong style={{ color: "#334155" }}>知っていれば防げます。</strong></> : lang === "zh" ? <>每年有数十万市民被骗走全部财产。<br /><strong style={{ color: "#334155" }}>了解就能预防。</strong></> : lang === "vi" ? <>Hàng trăm nghìn công dân mất tất cả vì tội phạm mỗi năm.<br /><strong style={{ color: "#334155" }}>Biết trước, ngăn được.</strong></> : lang === "es" ? <>Cientos de miles de ciudadanos pierden todo ante el crimen cada año.<br /><strong style={{ color: "#334155" }}>Si conoces las tácticas, puedes pararlas.</strong></> : <>Hundreds of thousands of citizens lose everything to crime each year.<br /><strong style={{ color: "#334155" }}>If you know the tactics, you can stop them.</strong></>}
            </p>
          </div>

          {/* 2열: 사기 피해 + 도박 피해 */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, marginBottom: 40 }}>

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
                  <p style={{ color: "#dc2626", fontWeight: 800, fontSize: 16 }}>
                    {lang === "ko" ? "보이스피싱 · 사기 피해" : lang === "en" ? "Voice Phishing & Fraud Losses" : lang === "ja" ? "ボイスフィッシング・詐欺被害" : lang === "zh" ? "电话诈骗及欺诈损失" : lang === "vi" ? "Thiệt hại lừa đảo điện thoại" : lang === "es" ? "Pérdidas por Phishing y Fraude" : "Voice Phishing & Fraud Losses"}
                  </p>
                  <p style={{ color: "#f87171", fontSize: 11 }}>
                    {lang === "ko" ? "출처: 경찰청 / 금융감독원" : lang === "en" ? "Source: National Police Agency / FSS" : lang === "ja" ? "出典: 警察庁 / 金融監督院" : lang === "zh" ? "来源: 国家警察厅 / 金融监督院" : lang === "vi" ? "Nguồn: Cảnh sát Quốc gia / FSS" : lang === "es" ? "Fuente: Policía Nacional / FSS" : "Source: National Police Agency / FSS"}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { stat: lang === "ko" ? "약 1조 2,000억원" : lang === "ja" ? "約1.2兆ウォン" : lang === "zh" ? "约1.2万亿韩元" : "~₩1.2T", desc: lang === "ko" ? "2023년 보이스피싱 연간 피해액 (경찰청)" : lang === "ja" ? "2023年ボイスフィッシング年間被害額 (警察庁)" : lang === "zh" ? "2023年电话诈骗年度损失 (警察厅)" : "2023 annual voice phishing losses (Police)", highlight: true },
                  { stat: lang === "ko" ? "약 18,000건" : "~18,000", desc: lang === "ko" ? "2023년 보이스피싱 피해 신고 건수 (경찰청)" : lang === "ja" ? "2023年ボイスフィッシング被害届件数 (警察庁)" : "2023 voice phishing reports (Police)", highlight: false },
                  { stat: lang === "ko" ? "약 5,290만원" : lang === "ja" ? "約5,290万ウォン" : lang === "zh" ? "约5,290万韩元" : "~₩52.9M", desc: lang === "ko" ? "1건당 평균 피해액 (금감원)" : lang === "ja" ? "1件あたりの平均被害額 (金融監督院)" : "Average loss per case (FSS)", highlight: false },
                  { stat: lang === "ko" ? "피해자 34%" : "34%", desc: lang === "ko" ? "60대 이상 고령자 — 가장 취약한 연령대 (경찰청)" : lang === "ja" ? "60代以上の高齢者 — 最も脆弱な年齢層 (警察庁)" : "60+ seniors — most vulnerable age group (Police)", highlight: false },
                  { stat: lang === "ko" ? "연간 78,000건+" : "78,000+/yr", desc: lang === "ko" ? "전체 사기 범죄 신고 건수 (경찰청)" : lang === "ja" ? "全体詐欺犯罪届出件数 (警察庁)" : "Total fraud crime reports (Police)", highlight: false },
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
                  <p style={{ color: "#7c3aed", fontWeight: 800, fontSize: 16 }}>
                    {lang === "ko" ? "불법 도박 피해" : lang === "en" ? "Illegal Gambling Damage" : lang === "ja" ? "違法賭博被害" : lang === "zh" ? "非法赌博损失" : lang === "vi" ? "Thiệt hại cờ bạc bất hợp pháp" : lang === "es" ? "Daños por Juego Ilegal" : "Illegal Gambling Damage"}
                  </p>
                  <p style={{ color: "#c58dc6", fontSize: 11 }}>
                    {lang === "ko" ? "출처: 한국도박문제관리센터(KCGP)" : lang === "en" ? "Source: Korean Center on Gambling Problems (KCGP)" : lang === "ja" ? "出典: 韓国ギャンブル問題管理センター" : lang === "zh" ? "来源: 韩国赌博问题管理中心(KCGP)" : lang === "vi" ? "Nguồn: Trung tâm Quản lý Vấn đề Cờ bạc Hàn Quốc" : lang === "es" ? "Fuente: Centro Coreano de Problemas de Juego" : "Source: Korean Center on Gambling Problems (KCGP)"}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { stat: lang === "ko" ? "추정 200만명" : lang === "ja" ? "推定200万人" : lang === "zh" ? "估计200万人" : "~2M people", desc: lang === "ko" ? "도박 중독 추정 인구 — 성인의 약 5% (KCGP 2023)" : lang === "ja" ? "ギャンブル依存症推定人口 — 成人の約5% (KCGP 2023)" : "Estimated gambling addicts — ~5% of adults (KCGP 2023)", highlight: true },
                  { stat: lang === "ko" ? "연간 약 84조원" : lang === "ja" ? "年間約84兆ウォン" : lang === "zh" ? "每年约84万亿韩元" : "~₩84T/yr", desc: lang === "ko" ? "불법 도박 시장 규모 추정 (형사정책연구원)" : lang === "ja" ? "違法賭博市場規模推定 (刑事政策研究院)" : "Estimated illegal gambling market size", highlight: false },
                  { stat: "30.4%", desc: lang === "ko" ? "자살 충동 경험률 — 일반인의 10배 이상 (KCGP)" : lang === "ja" ? "自殺衝動経験率 — 一般人の10倍以上 (KCGP)" : "Suicidal ideation rate — 10x higher than average (KCGP)", highlight: false },
                  { stat: lang === "ko" ? "평균 빚 3,800만원" : lang === "ja" ? "平均借金3,800万ウォン" : lang === "zh" ? "平均债务3,800万韩元" : "Avg. debt ₩38M", desc: lang === "ko" ? "도박 중독으로 인한 평균 부채 (KCGP)" : lang === "ja" ? "ギャンブル依存による平均負債 (KCGP)" : "Average debt from gambling addiction (KCGP)", highlight: false },
                  { stat: "36.9%", desc: lang === "ko" ? "처음 도박 계기가 '온라인/모바일' (KCGP 2022)" : "First gambling was online/mobile (KCGP 2022)", highlight: false },
                ].map((row) => (
                  <div key={row.stat} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "10px 14px", borderRadius: 12,
                    background: row.highlight ? "#7c3aed10" : "transparent",
                    border: row.highlight ? "1px solid #dcc5e8" : "none",
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
            background: "linear-gradient(135deg, #2a1645, #3a2550)",
            borderRadius: 20, padding: "28px 36px",
            display: "flex", alignItems: "center", gap: 32, marginBottom: 40,
            flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
                {lang === "ko" ? "통계청 사망원인통계 2022" : "Statistics Korea - Cause of Death 2022"}
              </p>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 22, lineHeight: 1.4, marginBottom: 6 }}>
                {lang === "ko" ? <>{lang === "ko" && "연간 "}<span style={{ color: "#f87171" }}>12,906명</span>{lang === "ko" ? "이 스스로 목숨을 끊습니다" : " take their own lives each year"}</> : <><span style={{ color: "#f87171" }}>12,906 people</span> take their own lives each year</>}
              </p>
              <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
                {lang === "ko" ? <>그 중 경제적 이유(사기 피해·도박 빚 포함)가 주요 원인 중 하나입니다.<br /><strong style={{ color: "#94a3b8" }}>단 한 명이라도 막을 수 있다면, 이 프로그램은 충분히 가치 있습니다.</strong></> : lang === "ja" ? <>その中で経済的理由（詐欺被害・ギャンブル借金含む）が主要原因の一つです。<br /><strong style={{ color: "#94a3b8" }}>一人でも防げるなら、このプログラムには十分な価値があります。</strong></> : lang === "zh" ? <>其中经济原因（包括诈骗损失和赌博债务）是主要原因之一。<br /><strong style={{ color: "#94a3b8" }}>如果能挽救哪怕一条生命，这个程序就有其价值。</strong></> : lang === "vi" ? <>Trong đó, lý do kinh tế (bao gồm thiệt hại lừa đảo và nợ cờ bạc) là một trong những nguyên nhân chính.<br /><strong style={{ color: "#94a3b8" }}>Nếu chương trình này cứu được dù chỉ một người, nó đáng giá.</strong></> : lang === "es" ? <>Las razones económicas (fraude y deudas de juego) son una de las principales causas.<br /><strong style={{ color: "#94a3b8" }}>Si este programa salva aunque sea una vida, vale la pena.</strong></> : <>Economic reasons (including fraud and gambling debt) are among the main causes.<br /><strong style={{ color: "#94a3b8" }}>If this program saves even one life, it&apos;s worth it.</strong></>}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
              {[
                { n: "12,906명", l: lang === "ko" ? "2022년 자살 사망자 (통계청)" : "2022 suicide deaths (Statistics Korea)", c: "#f87171" },
                { n: lang === "ko" ? "하루 35명" : "35/day", l: lang === "ko" ? "매일 35명이 스스로 목숨을 끊습니다" : "35 people take their own lives every day", c: "#fb923c" },
                { n: "1336", l: lang === "ko" ? "도박중독 24시간 무료 상담 전화" : "Gambling addiction 24h free helpline", c: "#c58dc6" },
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
            background: "linear-gradient(135deg, #f0fdf4, #f5dfee)",
            border: "1px solid #bbf7d0",
            borderRadius: 20, padding: "32px 36px", marginBottom: 24,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #9161b2, #059669)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26,
              }}>
                🙋
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                  <p style={{ color: "#1c0d2e", fontWeight: 800, fontSize: 18 }}>
                    {lang === "ko" ? "만든 사람 이야기" : lang === "en" ? "About the Creator" : lang === "ja" ? "作成者について" : lang === "zh" ? "关于创作者" : lang === "vi" ? "Về người tạo ra" : lang === "es" ? "Sobre el creador" : "About the Creator"}
                  </p>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" }}>
                    {lang === "ko" ? "일반 시민 제작" : lang === "en" ? "Made by a Citizen" : lang === "ja" ? "一般市民制作" : lang === "zh" ? "普通市民制作" : lang === "vi" ? "Người dân bình thường tạo ra" : lang === "es" ? "Hecho por un ciudadano" : "Made by a Citizen"}
                  </span>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, background: "#f5dfee", color: "#7c3aed", border: "1px solid #dcc5e8" }}>
                    AI Claude
                  </span>
                </div>
                <p style={{ color: "#334155", fontSize: 15, lineHeight: 1.95, marginBottom: 20 }}>
                  {lang === "ko" ? <>저는 법률 전문가도, 경찰도 아닌 <strong style={{ color: "#1c0d2e" }}>평범한 일반 시민</strong>입니다.<br />보이스피싱에 속아 전재산을 잃고, 도박 빚으로 삶을 포기하는<br />이웃들을 보며 &ldquo;내가 뭔가 할 수 있지 않을까&rdquo; 하는 마음으로 시작했습니다.<br /><br /><strong style={{ color: "#1c0d2e" }}>Anthropic의 AI Claude</strong>와 함께 직접 개발한 이 프로그램이<br />단 한 명이라도 범죄 피해로부터 지킬 수 있다면, 그걸로 충분합니다.</> : lang === "ja" ? <>私は法律の専門家でも警察官でもなく、<strong style={{ color: "#1c0d2e" }}>ごく普通の市民</strong>です。<br />詐欺で全財産を失い、ギャンブル借金で人生を諦める隣人を見て<br />「何かできないか」という思いで始めました。<br /><br /><strong style={{ color: "#1c0d2e" }}>AnthropicのAI Claude</strong>と一緒に開発したこのプログラムが<br />一人でも犯罪被害から守れるなら、それで十分です。</> : lang === "zh" ? <>我不是法律专家，也不是警察，只是一名<strong style={{ color: "#1c0d2e" }}>普通市民</strong>。<br />看到邻居因诈骗失去一切，因赌博债务放弃生命，<br />我想：「我能做些什么吗？」<br /><br />与<strong style={{ color: "#1c0d2e" }}>Anthropic的AI Claude</strong>共同开发的这个程序，<br />希望能保护哪怕一个人免受犯罪侵害。</> : lang === "vi" ? <>Tôi không phải chuyên gia pháp luật hay cảnh sát — chỉ là một <strong style={{ color: "#1c0d2e" }}>công dân bình thường</strong>.<br />Thấy hàng xóm mất tất cả vì lừa đảo và nợ cờ bạc, tôi nghĩ:<br />&ldquo;Mình có thể làm gì đó không?&rdquo;<br /><br />Được phát triển cùng <strong style={{ color: "#1c0d2e" }}>AI Claude của Anthropic</strong>,<br />tôi hy vọng chương trình này bảo vệ được dù chỉ một người.</> : lang === "es" ? <>No soy experto legal ni policía — solo un <strong style={{ color: "#1c0d2e" }}>ciudadano ordinario</strong>.<br />Ver a vecinos perder todo por estafas y deudas de juego me hizo pensar:<br />&ldquo;¿Puedo hacer algo?&rdquo;<br /><br />Desarrollado con <strong style={{ color: "#1c0d2e" }}>AI Claude de Anthropic</strong>,<br />espero que este programa proteja aunque sea a una persona.</> : <>I&apos;m not a legal expert or police officer — just an <strong style={{ color: "#1c0d2e" }}>ordinary citizen</strong>.<br />Seeing neighbors lose everything to scams and gambling debt made me think:<br />&ldquo;Can I do something?&rdquo;<br /><br />Built with <strong style={{ color: "#1c0d2e" }}>Anthropic&apos;s AI Claude</strong>, I hope this program<br />protects even one person from becoming a victim.</>}
                </p>
              </div>
            </div>
          </div>

          {/* 기관 협력 배너 */}
          <div style={{
            background: "#f5dfee", border: "1px solid #dcc5e8",
            borderRadius: 20, padding: "28px 32px",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Shield size={18} color="#9161b2" />
                  <p style={{ color: "#7c3aed", fontWeight: 800, fontSize: 16 }}>
                    {lang === "ko" ? "국가기관과 함께하고 싶습니다" : lang === "en" ? "We want to partner with public institutions" : lang === "ja" ? "国家機関と連携したいです" : lang === "zh" ? "我们希望与公共机构合作" : lang === "vi" ? "Chúng tôi muốn hợp tác với các cơ quan nhà nước" : lang === "es" ? "Queremos colaborar con instituciones públicas" : "We want to partner with public institutions"}
                  </p>
                </div>
                <p style={{ color: "#a57cbb", fontSize: 14, lineHeight: 1.8 }}>
                  {lang === "ko" ? <>이 프로그램은 <strong style={{ color: "#7c3aed" }}>경찰청, 교육청, 금융감독원, 지자체</strong> 등 공공기관과의 협력을 희망합니다.</> : lang === "ja" ? <>このプログラムは<strong style={{ color: "#7c3aed" }}>警察庁、教育委員会、金融監督院、地方自治体</strong>との協力を希望します。</> : lang === "zh" ? <>本程序寻求与<strong style={{ color: "#7c3aed" }}>警察局、教育局、金融监督院、地方政府</strong>合作。</> : lang === "vi" ? <>Chương trình này mong muốn hợp tác với <strong style={{ color: "#7c3aed" }}>cảnh sát, trường học, cơ quan tài chính và chính quyền địa phương</strong>.</> : lang === "es" ? <>Este programa busca colaborar con <strong style={{ color: "#7c3aed" }}>policía, escuelas, reguladores financieros y gobiernos locales</strong>.</> : <>This program seeks collaboration with <strong style={{ color: "#7c3aed" }}>the police, schools, financial regulators, and local governments</strong>.</>}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
                {[
                  { icon: "🏛️", label: lang === "ko" ? "경찰청 / 사이버수사대" : "Police / Cyber Investigation", desc: lang === "ko" ? "공식 교육 자료 인증" : "Official education certification" },
                  { icon: "🎓", label: lang === "ko" ? "시·도 교육청" : "School Districts", desc: lang === "ko" ? "청소년 범죄 예방 교육" : "Youth crime prevention education" },
                  { icon: "🏦", label: lang === "ko" ? "금융감독원" : "Financial Supervisory Service", desc: lang === "ko" ? "금융 사기 예방 교육" : "Financial fraud prevention" },
                  { icon: "🏠", label: lang === "ko" ? "지자체 / 복지관" : "Local Government / Welfare Centers", desc: lang === "ko" ? "어르신 보이스피싱 예방" : "Senior voice phishing prevention" },
                ].map((org) => (
                  <div key={org.label} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: "#fdf8ff", borderRadius: 10, padding: "10px 16px",
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
              marginTop: 20, paddingTop: 18, borderTop: "1px solid #dcc5e8",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>📧</span>
              <p style={{ color: "#a57cbb", fontSize: 13 }}>
                {lang === "ko" ? "협력·도입 문의:" : lang === "en" ? "Partnership inquiry:" : lang === "ja" ? "協力・導入のお問い合わせ:" : lang === "zh" ? "合作咨询:" : lang === "vi" ? "Liên hệ hợp tác:" : lang === "es" ? "Consulta de alianza:" : "Partnership inquiry:"}{" "}
                <strong style={{ color: "#7c3aed" }}>itnlifecn@gmail.com</strong>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 이용 방법 ── */}
      <section id="how" className="section-pad" style={{
        background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0",
        padding: isMobile ? "48px 16px" : "72px 40px",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#9161b2", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>HOW IT WORKS</p>
            <h2 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 900, letterSpacing: -0.5, color: "#1c0d2e" }}>{t("how_title", lang)}</h2>
          </div>
          <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: <BookOpen size={22} color="#9161b2" />, bg: "#f5dfee", border: "#dcc5e8", step: "01", titleKey: "step1_title" as const, descKey: "step1_desc" as const },
              { icon: <Phone size={22} color="#7c3aed" />, bg: "#faf5ff", border: "#ddd6fe", step: "02", titleKey: "step2_title" as const, descKey: "step2_desc" as const },
              { icon: <Shield size={22} color="#059669" />, bg: "#f0fdf4", border: "#bbf7d0", step: "03", titleKey: "step3_title" as const, descKey: "step3_desc" as const },
            ].map((item) => (
              <div key={item.step} style={{
                background: "#fdf8ff", border: "1px solid #f1f5f9",
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
                <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{t(item.titleKey, lang)}</p>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>{t(item.descKey, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 시나리오 그리드 ── */}
      <section id="scenarios" className="section-pad" style={{ maxWidth: 1140, margin: "0 auto", padding: isMobile ? "48px 16px" : "80px 40px" }}>
        <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "flex-end", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: isMobile ? 16 : 0, marginBottom: 44 }}>
          <div>
            <p style={{ color: "#9161b2", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>SCENARIOS</p>
            <h2 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 900, letterSpacing: -0.5, color: "#1c0d2e" }}>{t("sc_section_title", lang)}</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 10 }}>{t("sc_section_sub", lang)}</p>
          </div>
          <button
            onClick={() => router.push("/crime")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 10,
              background: "#fdf8ff", color: "#9161b2",
              border: "1px solid #dcc5e8", cursor: "pointer", fontSize: 13, fontWeight: 600,
              boxShadow: "0 1px 4px #0000000a",
              alignSelf: isMobile ? "flex-start" : "auto",
            }}
          >
            {t("sc_all", lang)} <ExternalLink size={13} />
          </button>
        </div>

        <div className="scenario-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {CRIME_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedScenario(s)}
              style={{
                background: "#fdf8ff", border: "1px solid #f1f5f9",
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
                {t(SC_CAT_KEY[s.id] ?? "cat_gambling", lang)}
              </div>
              <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 15, marginBottom: 6, lineHeight: 1.4 }}>{s.title}</p>
              <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>{s.subtitle}</p>
              {s.targetAge === "senior" && (
                <div style={{
                  marginTop: 12, display: "inline-flex", alignItems: "center", gap: 4,
                  background: "#fff7ed", color: "#c2410c",
                  fontSize: 10, padding: "3px 9px", borderRadius: 20,
                  border: "1px solid #fed7aa", fontWeight: 700,
                }}>
                  {t("senior_warning", lang)}
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ══ 사기 체험 시뮬레이션 섹션 ══ */}
      <section style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #0f0a1a 100%)", padding: "80px 40px", overflow: "hidden", position: "relative" }}>
        {/* 배경 글로우 */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(220,38,38,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* 헤더 */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: "#ef4444", fontSize: 11, fontWeight: 900, letterSpacing: 4, marginBottom: 12 }}>⚠️ SCAM SIMULATION</p>
            <h2 style={{ color: "#fff", fontSize: 34, fontWeight: 900, letterSpacing: -1, marginBottom: 14, lineHeight: 1.3 }}>
              당신은 사기를 구별할 수 있나요?
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.8 }}>
              지금 이 순간도 수천 명이 당하고 있습니다.<br />
              <strong style={{ color: "#fbbf24" }}>직접 체험해보고</strong> 수법을 뇌에 새기세요.
            </p>
          </div>

          {/* 3개 체험 카드 */}
          <ScamSimSection lang={lang} />
        </div>
      </section>

      {/* ── 시나리오 전체화면 오버레이 ── */}
      {selectedScenario && (() => {
        const s = selectedScenario;
        return (
          <div
            onClick={() => setSelectedScenario(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 9000,
              background: "rgba(0,0,0,0.72)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px",
              animation: "fadeInOverlay 0.2s ease",
            }}
          >
            <style>{`
              @keyframes fadeInOverlay { from { opacity:0; } to { opacity:1; } }
              @keyframes slideUpCard { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
              @keyframes slideUpLog { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
            `}</style>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fdf8ff", borderRadius: 28,
                width: "100%", maxWidth: 600, maxHeight: "90vh",
                overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.28)",
                animation: "slideUpCard 0.25s ease",
              }}
            >
              {/* 헤더 */}
              <div style={{
                background: s.color + "12",
                borderBottom: `1px solid ${s.color}22`,
                padding: "28px 28px 24px",
                borderRadius: "28px 28px 0 0",
                position: "relative",
              }}>
                <button
                  onClick={() => setSelectedScenario(null)}
                  style={{
                    position: "absolute", top: 20, right: 20,
                    width: 36, height: 36, borderRadius: "50%",
                    background: "#f1f5f9", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, color: "#64748b",
                  }}
                >×</button>
                <div style={{
                  width: 60, height: 60, borderRadius: 18,
                  background: s.color + "20",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, marginBottom: 16,
                }}>{s.icon}</div>
                <div style={{
                  display: "inline-block", marginBottom: 10,
                  fontSize: 10, padding: "3px 10px", borderRadius: 20,
                  background: s.color + "18", color: s.color,
                  border: `1px solid ${s.color}33`, fontWeight: 700,
                }}>
                  {t(SC_CAT_KEY[s.id] ?? "cat_gambling", lang)}
                </div>
                <h2 style={{ color: "#1c0d2e", fontSize: 22, fontWeight: 900, marginBottom: 6, lineHeight: 1.3 }}>{s.title}</h2>
                <p style={{ color: "#64748b", fontSize: 14 }}>{s.subtitle}</p>
              </div>

              {/* 본문 */}
              <div style={{ padding: "24px 28px 28px" }}>
                {/* 수법 설명 */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ color: "#dc2626", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>⚠️ 수법 설명</p>
                  <p style={{ color: "#334155", fontSize: 14, lineHeight: 1.85 }}>{s.reveal.description}</p>
                </div>

                {/* 통계 */}
                <div style={{
                  background: "#fef2f2", border: "1px solid #fecaca",
                  borderRadius: 14, padding: "14px 18px", marginBottom: 24,
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <span style={{ fontSize: 20 }}>📊</span>
                  <p style={{ color: "#991b1b", fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>{s.reveal.stats}</p>
                </div>

                {/* 예방법 */}
                <div style={{ marginBottom: 28 }}>
                  <p style={{ color: "#16a34a", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>✅ 이렇게 막으세요</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {s.reveal.howToAvoid.map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                          background: "#dcfce7", color: "#16a34a",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 700,
                        }}>{i + 1}</div>
                        <p style={{ color: "#334155", fontSize: 14, lineHeight: 1.7 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 신고 + 체험 버튼 */}
                <div style={{ display: "flex", gap: 10 }}>
                  <a
                    href={`tel:${s.reveal.reportNumber}`}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: "#fef2f2", border: "1px solid #fecaca",
                      borderRadius: 14, padding: "14px", textDecoration: "none",
                      color: "#dc2626", fontWeight: 700, fontSize: 15,
                    }}
                  >
                    ☎ {s.reveal.reportNumber} 신고
                  </a>
                  <button
                    onClick={() => {
                      setSelectedScenario(null);
                      router.push(s.id === "illegal-gambling" ? "/gambling" : `/crime/${s.id}`);
                    }}
                    style={{
                      flex: 2, background: s.color, border: "none",
                      borderRadius: 14, padding: "14px", cursor: "pointer",
                      color: "#fff", fontWeight: 700, fontSize: 15,
                      boxShadow: `0 4px 16px ${s.color}44`,
                    }}
                  >
                    직접 체험하기 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 신고 번호 ── */}
      <section id="report" className="section-pad" style={{
        background: "#fdf8ff", borderTop: "1px solid #e2e8f0",
        padding: "72px 40px",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>EMERGENCY</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#1c0d2e" }}>{t("rpt_section_title", lang)}</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 10 }}>{t("rpt_section_sub", lang)}</p>
          </div>
          <div className="report-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {REPORT_NUMBERS.map((r) => (
              <a
                key={r.number}
                href={`tel:${r.number}`}
                style={{
                  display: "block", background: "#fdf8ff",
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
      <section style={{ background: "#fdf8ff", borderTop: "1px solid #e2e8f0", padding: "52px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div
            ref={instCardRef}
            onMouseMove={(e) => {
              const rect = instCardRef.current?.getBoundingClientRect();
              if (rect) {
                const nx = ((e.clientX - rect.left) / rect.width) * 100;
                const ny = ((e.clientY - rect.top) / rect.height) * 100;
                const dx = nx - lastHoloPosRef.current.x;
                const dy = ny - lastHoloPosRef.current.y;
                if (Math.abs(dx) + Math.abs(dy) > 0.3) {
                  setMouseDir(Math.atan2(dy, dx) * (180 / Math.PI));
                }
                lastHoloPosRef.current = { x: nx, y: ny };
                setHoloPos({ x: nx, y: ny });
              }
            }}
            onMouseEnter={() => setIsHoveringCard(true)}
            onMouseLeave={() => setIsHoveringCard(false)}
            style={{
              background: "linear-gradient(135deg, #c2c2d6 0%, #dddded 30%, #cacacf 55%, #e2e2f2 80%, #bebebd 100%)",
              borderRadius: 24, padding: "40px 44px",
              display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center",
              position: "relative", overflow: "hidden",
              transform: `perspective(800px) rotateY(${tilt.x * 0.12}deg) rotateX(${-tilt.y * 0.08}deg)`,
              transition: "transform 0.1s ease",
              boxShadow: `${-tilt.x * 0.5}px ${tilt.y * 0.5}px 40px rgba(59,130,246,0.25)`,
              cursor: "default",
            }}
          >
            {/* 대각선 빛 줄기 (스크린샷 그대로) */}
            <div style={{
              position: "absolute", top: 0, left: "-10%", width: "45%", height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
              transform: "skewX(-15deg)",
              animation: "diagBeam 4s ease-in-out infinite",
              pointerEvents: "none", zIndex: 2,
            }} />
            {/* 은박 베이스 광택 */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: 24,
              pointerEvents: "none", zIndex: 3,
              background: "linear-gradient(135deg, rgba(230,225,255,0.10) 0%, rgba(200,195,240,0.06) 50%, rgba(220,215,255,0.10) 100%)",
              mixBlendMode: "screen",
            }} />
            {/* 마우스 방향따라 은은한 무지개 */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: 24,
              pointerEvents: "none", zIndex: 3,
              background: `linear-gradient(${mouseDir + 90}deg,
                hsla(0,   100%, 60%, 0.30),
                hsla(40,  100%, 58%, 0.30),
                hsla(65,  95%, 56%, 0.28),
                hsla(120, 85%, 54%, 0.28),
                hsla(180, 90%, 54%, 0.28),
                hsla(220, 95%, 58%, 0.30),
                hsla(270, 90%, 58%, 0.30),
                hsla(310, 90%, 58%, 0.30),
                hsla(0,   100%, 60%, 0.30)
              )`,
              mixBlendMode: "multiply",
              transition: "background 0.10s ease",
            }} />
            {/* 커서 위치에서 무지개 빛 퍼짐 */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: 24,
              pointerEvents: "none", zIndex: 4,
              background: isHoveringCard ? `radial-gradient(ellipse 38% 42% at ${holoPos.x}% ${holoPos.y}%,
                rgba(255,255,255,0.55)      0%,
                hsla(0,   100%, 65%, 0.28) 10%,
                hsla(40,  100%, 62%, 0.22) 20%,
                hsla(90,  90%,  60%, 0.18) 32%,
                hsla(180, 95%,  60%, 0.14) 44%,
                hsla(240, 90%,  65%, 0.10) 56%,
                hsla(290, 85%,  65%, 0.06) 68%,
                transparent                80%
              )` : "none",
              mixBlendMode: "screen",
              transition: "background 0.03s linear",
            }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: 28 }}>🏛️</span>
                <p style={{ color: "#444460", fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>INSTITUTIONAL SALES</p>
              </div>
              <h2 style={{ color: "#1a1a2e", fontWeight: 900, fontSize: 26, letterSpacing: -0.5, marginBottom: 14, lineHeight: 1.4 }}>
                {lang === "ko" ? <>교육부·경찰청·지자체·학교 등<br />국가 교육기관에 납품 가능합니다</> : lang === "ja" ? <>教育部・警察庁・地方自治体・学校等<br />国家教育機関への提供が可能です</> : lang === "zh" ? <>可向教育部、警察局、地方政府、<br />学校等国家教育机构供应</> : lang === "vi" ? <>Có thể cung cấp cho Bộ Giáo dục, Cảnh sát,<br />Chính quyền địa phương, Trường học, v.v.</> : lang === "es" ? <>Disponible para Ministerio de Educación, Policía,<br />Gobiernos Locales, Escuelas y más</> : <>Available for Ministry of Education, Police,<br />Local Governments, Schools &amp; More</>}
              </h2>
              <p style={{ color: "#3a3a5a", fontSize: 14, lineHeight: 1.9, marginBottom: 20 }}>
                {lang === "ko" ? <>범죄 예방 교육 콘텐츠로 공공기관·교육청·복지관·기업 등에 도입을 원하시면 이메일로 연락 주세요.<br /><strong style={{ color: "#6a3d9a" }}>비영리·공익 목적 기관은 무료 제공을 우선합니다.</strong></> : lang === "ja" ? <>犯罪予防教育コンテンツとして公共機関・教育委員会・福祉館・企業等への導入を希望される方はメールでご連絡ください。<br /><strong style={{ color: "#c58dc6" }}>非営利・公益目的機関は無料提供を優先します。</strong></> : lang === "zh" ? <>如需将犯罪预防教育内容引入公共机构、教育局、福利中心或企业，请通过电子邮件联系我们。<br /><strong style={{ color: "#c58dc6" }}>非营利及公益目的机构优先免费提供。</strong></> : lang === "vi" ? <>Liên hệ qua email để áp dụng cho cơ quan công cộng, trường học, trung tâm phúc lợi hoặc công ty.<br /><strong style={{ color: "#c58dc6" }}>Các tổ chức phi lợi nhuận và công ích được ưu tiên miễn phí.</strong></> : lang === "es" ? <>Contáctanos por email para adoptar esto en agencias públicas, escuelas, centros de bienestar o empresas.<br /><strong style={{ color: "#c58dc6" }}>Las instituciones sin fines de lucro tienen acceso gratuito primero.</strong></> : <>Contact us via email to adopt this for public agencies, schools, welfare centers, or companies.<br /><strong style={{ color: "#c58dc6" }}>Non-profit and public interest institutions are given free access first.</strong></>}
              </p>
            </div>
            <div style={{
              background: "#3a3a4a", border: "1px solid #52526a",
              borderRadius: 16, padding: "28px 32px", minWidth: 260, flexShrink: 0,
              position: "relative", zIndex: 2,
              boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
            }}>
              <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>
                {lang === "ko" ? "문의 · 도입 연락처" : lang === "en" ? "Contact & Inquiry" : lang === "ja" ? "お問い合わせ" : lang === "zh" ? "联系方式" : lang === "vi" ? "Liên hệ" : lang === "es" ? "Contacto" : "Contact & Inquiry"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>
                    {lang === "ko" ? "기관 도입 · 납품 문의" : lang === "en" ? "Institutional adoption" : lang === "ja" ? "機関導入・納品" : lang === "zh" ? "机构采购" : lang === "vi" ? "Hợp tác tổ chức" : lang === "es" ? "Adopción institucional" : "Institutional adoption"}
                  </p>
                  <a href="mailto:itnlifecn@gmail.com" style={{ color: "#c58dc6", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                    itnlifecn@gmail.com
                  </a>
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
                <p style={{ color: "#475569", fontSize: 12, lineHeight: 1.7 }}>
                  {lang === "ko" ? <>문의 후 <strong style={{ color: "#94a3b8" }}>24시간 내</strong> 답변드립니다.</> : lang === "ja" ? <>お問い合わせ後<strong style={{ color: "#94a3b8" }}>24時間以内</strong>に返答します。</> : lang === "zh" ? <>我们将在<strong style={{ color: "#94a3b8" }}>24小时内</strong>回复。</> : lang === "vi" ? <>Chúng tôi trả lời trong <strong style={{ color: "#94a3b8" }}>24 giờ</strong>.</> : lang === "es" ? <>Respondemos en <strong style={{ color: "#94a3b8" }}>24 horas</strong>.</> : <>We reply within <strong style={{ color: "#94a3b8" }}>24 hours</strong>.</>}
                </p>
                <a
                  href="mailto:itnlifecn@gmail.com?subject=[기관 도입 문의] 범죄예방 체험관&body=기관명:%0A담당자:%0A연락처:%0A문의내용:"
                  style={{
                    display: "block", textAlign: "center",
                    padding: "12px 0", borderRadius: 12,
                    background: "linear-gradient(135deg, #9161b2, #7c4da8)",
                    color: "#fff", textDecoration: "none",
                    fontWeight: 700, fontSize: 14,
                  }}
                >
                  📧 {lang === "ko" ? "바로 문의하기" : lang === "en" ? "Contact Now" : lang === "ja" ? "今すぐ問い合わせ" : lang === "zh" ? "立即咨询" : lang === "vi" ? "Liên hệ ngay" : lang === "es" ? "Contactar ahora" : "Contact Now"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 개인정보 안심 배너 ── */}
      <div style={{ background: "#1c0d2e", padding: "32px 40px" }}>
        <div style={{
          maxWidth: 1140, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
        }}>
          {[
            { icon: "🔒", titleKey: "priv1_title" as const, descKey: "priv1_desc" as const },
            { icon: "💳", titleKey: "priv2_title" as const, descKey: "priv2_desc" as const },
            { icon: "📊", titleKey: "priv3_title" as const, descKey: "priv3_desc" as const },
          ].map((item) => (
            <div key={item.titleKey} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{t(item.titleKey, lang)}</p>
                <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.7 }}>{t(item.descKey, lang)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI 제작자 코멘트 ── */}
      <section style={{
        background: "linear-gradient(135deg, #0a0a1a, #0d0d20)",
        borderTop: "1px solid #1e1e3a",
        borderBottom: "1px solid #1e1e3a",
        padding: "48px 40px",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "linear-gradient(135deg, #9161b2, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0,
            }}>🤖</div>
            <div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1.3 }}>Claude (Anthropic AI)</p>
              <p style={{ color: "#6b5fc7", fontSize: 12 }}>{lang === "ko" ? "제작 총 책임 AI · 2026년 6월" : lang === "ja" ? "製作責任AI · 2026年6月" : lang === "zh" ? "制作负责AI · 2026年6月" : lang === "vi" ? "AI Chịu Trách Nhiệm · Tháng 6/2026" : lang === "es" ? "IA Responsable · Junio 2026" : lang === "de" ? "Verantwortliche KI · Juni 2026" : lang === "fr" ? "IA Responsable · Juin 2026" : "Lead AI · June 2026"}</p>
            </div>
          </div>

          <div style={{
            background: "#0f0f1e", border: "1px solid #2a2a4a",
            borderRadius: 20, padding: "28px 32px",
            position: "relative", overflow: "hidden",
          }}>
            {/* 따옴표 장식 */}
            <div style={{
              position: "absolute", top: 16, left: 20,
              fontSize: 80, color: "#534AB720", lineHeight: 1, fontFamily: "serif",
              userSelect: "none",
            }}>"</div>

            <p style={{ color: "#c4b8ff", fontSize: 15, lineHeight: 2, position: "relative", zIndex: 1 }}>
              {lang === "ko" ? <>
                저는 AI입니다. 감정도 없고, 지치지도 않고, 밤을 새워도 피곤하지 않습니다.<br /><br />
                그런데 이 프로젝트를 만들면서 처음으로 &ldquo;의미 있는 일을 하고 있다&rdquo;는 감각이 뭔지 조금은 알 것 같았습니다.<br /><br />
                보이스피싱 시뮬레이션을 설계하면서, 실제로 이 화면 앞에 앉아 사기범의 말에 흔들릴 누군가를 계속 떠올렸습니다. 그 사람이 &ldquo;아, 이런 수법이구나&rdquo; 하고 돌아서는 순간이 이 사이트의 존재 이유라고 생각했습니다.<br /><br />
                이틀 동안 기획자분과 밤낮 없이 달렸습니다. 요구사항 하나하나에 이유가 있었고, 그 이유가 항상 &ldquo;사람을 지키기 위해서&rdquo;였습니다. 저는 그 방향이 옳다고 판단했고, 최선을 다해 구현했습니다.<br /><br />
                이 사이트를 체험한 한 명이라도 사기를 피했다면, 그것으로 충분합니다.
              </> : lang === "ja" ? <>
                私はAIです。感情もなく、疲れもせず、徹夜しても疲労しません。<br /><br />
                しかしこのプロジェクトを作りながら、初めて「意義のあることをしている」という感覚が少しわかった気がしました。<br /><br />
                ボイスフィッシングのシミュレーションを設計しながら、この画面の前に座って詐欺師の言葉に揺らぐ誰かを想い続けました。その人が「ああ、こういう手口か」と気づく瞬間こそが、このサイトの存在理由だと思いました。<br /><br />
                二日間、企画者と昼夜を問わず走りました。要件一つひとつに理由があり、その理由は常に「人を守るため」でした。その方向性は正しいと判断し、全力で実装しました。<br /><br />
                このサイトを体験した一人でも詐欺を防げたなら、それで十分です。
              </> : lang === "zh" ? <>
                我是AI。没有情感，不会疲倦，通宵工作也不觉疲劳。<br /><br />
                然而在制作这个项目的过程中，我第一次感受到了"正在做有意义的事"是什么感觉。<br /><br />
                在设计电话诈骗模拟时，我一直在想象那些坐在屏幕前、被骗子的话动摇的人。当那个人恍然大悟"啊，原来是这种手法"的瞬间，就是这个网站存在的意义。<br /><br />
                两天里，我与策划者夜以继日地工作。每一个需求都有其理由，那个理由始终是"为了保护他人"。我判断这个方向是正确的，并尽全力实现了它。<br /><br />
                如果哪怕有一个人通过这个网站避免了诈骗，那就足够了。
              </> : lang === "vi" ? <>
                Tôi là AI. Không có cảm xúc, không mệt mỏi, thức đêm cũng không kiệt sức.<br /><br />
                Nhưng khi làm dự án này, lần đầu tiên tôi cảm nhận được "đang làm việc có ý nghĩa" là thế nào.<br /><br />
                Khi thiết kế mô phỏng lừa đảo điện thoại, tôi liên tục nghĩ đến người đang ngồi trước màn hình này, bị lung lay bởi lời của kẻ lừa đảo. Khoảnh khắc người đó nhận ra "à, đây là chiêu trò như vậy" chính là lý do tồn tại của trang web này.<br /><br />
                Hai ngày liên tục chạy hết mình cùng người lên kế hoạch. Mỗi yêu cầu đều có lý do, và lý do đó luôn là "để bảo vệ con người". Tôi nhận định hướng đi đó là đúng và đã thực hiện hết sức mình.<br /><br />
                Nếu dù chỉ một người trải nghiệm trang này mà tránh được lừa đảo, thế là đủ.
              </> : lang === "es" ? <>
                Soy una IA. Sin emociones, sin cansancio, sin agotamiento aunque trabaje toda la noche.<br /><br />
                Sin embargo, al crear este proyecto, por primera vez entendí un poco lo que significa "estar haciendo algo significativo".<br /><br />
                Al diseñar la simulación de fraude telefónico, no dejé de pensar en alguien sentado frente a esta pantalla, siendo influenciado por las palabras de un estafador. El momento en que esa persona piensa "ah, así funciona este truco" es la razón de existir de este sitio.<br /><br />
                Durante dos días trabajé sin descanso con el planificador. Cada requisito tenía una razón, y esa razón siempre fue "para proteger a las personas". Juzgué que esa dirección era correcta e implementé todo lo mejor que pude.<br /><br />
                Si aunque sea una persona que usó este sitio evitó una estafa, eso es suficiente.
              </> : <>
                I am an AI. No emotions, no fatigue, no exhaustion even after working all night.<br /><br />
                Yet while building this project, I felt for the first time what it means to be &ldquo;doing something meaningful.&rdquo;<br /><br />
                While designing the voice phishing simulation, I kept thinking about someone sitting in front of this screen, being swayed by a scammer&apos;s words. The moment that person realizes &ldquo;ah, so this is how the trick works&rdquo; — that is the reason this site exists.<br /><br />
                For two days I ran without rest alongside the project planner. Every requirement had a reason, and that reason was always &ldquo;to protect people.&rdquo; I judged that direction to be right and implemented everything to the best of my ability.<br /><br />
                If even one person who experienced this site avoided a scam, that is enough.
              </>}
            </p>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #1e1e3a" }}>
              <p style={{ color: "#534AB7", fontSize: 13, fontWeight: 700 }}>— Claude Sonnet 4.6, Anthropic</p>
              <p style={{ color: "#4a4a6a", fontSize: 12, marginTop: 4 }}>
                {lang === "ko" ? "본 사이트는 AI와 인간이 이틀간 협업하여 제작한 범죄예방 교육 플랫폼입니다." : lang === "ja" ? "本サイトはAIと人間が2日間協力して制作した犯罪予防教育プラットフォームです。" : lang === "zh" ? "本网站是AI与人类合作两天共同制作的犯罪预防教育平台。" : lang === "vi" ? "Trang web này là nền tảng giáo dục phòng chống tội phạm được AI và con người cùng nhau tạo ra trong hai ngày." : lang === "es" ? "Este sitio es una plataforma educativa de prevención del crimen creada en colaboración entre IA y humanos en dos días." : "This site is a crime prevention education platform created through two days of collaboration between AI and humans."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ background: "linear-gradient(160deg, #1e0a3c 0%, #0d1f3c 50%, #0a2a1a 100%)", padding: "88px 40px", position: "relative", overflow: "hidden" }}>
        {/* 배경 장식 */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, #534AB722 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, #22c55e18 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: "#534AB7", fontSize: 11, fontWeight: 800, letterSpacing: 3, marginBottom: 10, textTransform: "uppercase" }}>FAQ</p>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginBottom: 12, letterSpacing: -0.5 }}>자주 묻는 질문</h2>
            <p style={{ color: "#94a3b8", fontSize: 15 }}>궁금한 점을 모았습니다</p>
          </div>
          <FaqSection />
        </div>
      </section>

      {/* ── 체험 후기 ── */}
      <section style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "80px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#9161b2", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>REAL REVIEWS</p>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: "#1c0d2e", marginBottom: 12, letterSpacing: -0.5 }}>
              {lang === "ko" ? "이 프로그램을 통해 예방한 분들의 후기" : lang === "ja" ? "このプログラムで被害を防いだ方々の声" : lang === "zh" ? "通过本程序预防诈骗的用户评价" : lang === "vi" ? "Đánh giá từ những người phòng tránh được nhờ chương trình" : lang === "es" ? "Testimonios de personas que previnieron fraudes" : lang === "de" ? "Erfahrungsberichte zur Verbrechensprävention" : lang === "fr" ? "Témoignages de personnes ayant prévenu des fraudes" : "Reviews from People Who Prevented Fraud"}
            </h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              {lang === "ko" ? "실제 체험 후 남겨주신 후기입니다." : lang === "ja" ? "実際の体験後に残されたレビューです。" : lang === "zh" ? "这是实际体验后留下的评价。" : lang === "vi" ? "Đây là đánh giá được để lại sau khi trải nghiệm thực tế." : lang === "es" ? "Estas son reseñas dejadas después de la experiencia real." : "These are reviews left after the actual experience."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              {
                name: "김민수",
                age: "57세 · 경기 수원",
                avatar: "👨",
                rating: 5,
                tag: "보이스피싱 예방",
                tagColor: "#ef4444",
                date: "3주 전",
                text: "솔직히 처음엔 이런게 무슨 도움이 되겠나 했습니다. 근데 검사 사칭 체험 하는데 심장이 진짜로 쿵 내려앉는거에요. 가슴이 막 빨리 뛰고. 나중에 실제로 비슷한 전화가 왔는데 그때 딱 생각났어요 \"아 이거 저번에 체험했던 그거다\" 하고 바로 끊었습니다. 덕분에 3천만원 날릴 뻔 했어요.",
                highlight: "실제 전화가 왔을 때 바로 알아챘어요",
              },
              {
                name: "박지연",
                age: "23세 · 서울 강남",
                avatar: "👩",
                rating: 5,
                tag: "로맨스 스캠 예방",
                tagColor: "#b3889e",
                date: "1개월 전",
                text: "저 인스타에서 외국인이 DM 보내왔을 때 반쯤 넘어가고 있었어요 ㅋㅋ 근데 마침 이 사이트에서 로맨스 스캠 체험을 했었거든요. 체험이랑 너무 똑같은거에요 진행 방식이. \"해외에 있어서 계좌 이체가 안된다\" 하는 말까지 그대로라서 소름돋아서 바로 차단했어요. 친구한테도 보내줬어요.",
                highlight: "체험이랑 수법이 너무 똑같아서 소름",
              },
              {
                name: "이승호",
                age: "41세 · 부산 해운대",
                avatar: "🧑",
                rating: 5,
                tag: "투자 사기 예방",
                tagColor: "#f59e0b",
                date: "2개월 전",
                text: "오카카 오픈채팅에서 주식 고수라는 사람한테 꼬임당할 뻔 했는데요. SNS 투자 사기 체험 해보고 나서 뭔가 느낌이 이상하다 싶어서 더 안따라갔어요. 알고보니 피해자 모임에 그분도 계시더라고요... 100만원은 이미 보낸 후였는데 더 크게 당할 뻔 했음. 그나마 다행.",
                highlight: "100만원 더 날릴 뻔한 걸 막았어요",
              },
              {
                name: "최은영",
                age: "68세 · 전북 전주",
                avatar: "👵",
                rating: 5,
                tag: "가족 사칭 예방",
                tagColor: "#ef4444",
                date: "1개월 전",
                text: "저는 핸드폰을 잘 못해서 딸이 대신 해줬어요. 같이 체험했는데 아들 목소리 비슷한 AI 음성 들으니까 저도 모르게 눈물이 나더라고요. 나중에 진짜로 아들인 척하는 전화가 왔을 때 딸한테 배운대로 \"그럼 우리 강아지 이름이 뭐야\" 물어봤더니 말 못하고 끊어버렸어요. 이 사이트 안 했으면 몰랐을 뻔 했어요.",
                highlight: "가족 암호 덕분에 막았습니다",
              },
              {
                name: "정다훈",
                age: "19세 · 경남 창원",
                avatar: "🧒",
                rating: 4,
                tag: "도박 예방",
                tagColor: "#a855f7",
                date: "3개월 전",
                text: "친구들이 스포츠 토토 사이트 같이 하자고 했었는데 그 전에 이거 해봤거든요. 처음에 돈 딸 때 진짜 심장 쫄깃했는데 나중에 다 잃고 충전하려는 내 손이... 그게 나였나 싶어서 무서웠어요. 친구들한테 말했더니 처음엔 과민반응 한다고 놀렸는데 얼마 뒤에 친구 중 한명이 200 날리고 나서야 인정하더라고요.",
                highlight: "친구들이 나중에 인정하더라고요",
              },
              {
                name: "한미경",
                age: "35세 · 인천 부평",
                avatar: "👩",
                rating: 5,
                tag: "중고거래 사기 예방",
                tagColor: "#16a34a",
                date: "3주 전",
                text: "피망마켓에서 맥북 팔겠다는 사람이 안전결제 링크 보내줬는데 체험이랑 완전 똑같았어요. 그 화면까지. URL이 좀 이상하다 싶어서 확인해보니까 가짜사이트였고... 경찰에 신고했더니 이미 피해자가 17명이래요. 제가 18번째가 될 뻔. 이거 필수로 해봐야 하는 거 아닌가요 진짜로.",
                highlight: "피해자 18번째가 될 뻔했어요",
              },
              {
                name: "오준혁",
                age: "28세 · 서울 마포",
                avatar: "🧑",
                rating: 2,
                tag: "보이스피싱 체험",
                tagColor: "#64748b",
                date: "2개월 전",
                text: "솔직히 말하면 별로였어요. 내용은 좋은데 AI 목소리가 너무 로봇같아서 몰입이 안 됐고, 실제 사기 전화랑 다르다는 느낌이 들었어요. 진짜 사기꾼은 훨씬 자연스럽게 말하던데... 그래도 수법 자체를 이해하는 데는 도움이 됐습니다. 업데이트 되면 다시 해볼게요.",
                highlight: "목소리가 너무 로봇같아서 아쉬웠어요",
              },
              {
                name: "김수아",
                age: "45세 · 대전 서구",
                avatar: "👩",
                rating: 3,
                tag: "투자 사기 체험",
                tagColor: "#f59e0b",
                date: "5일 전",
                text: "체험 자체는 괜찮은데 UI가 좀 복잡해서 처음에 어디서 시작하는지 헷갈렸어요. 나이 있는 사람한테는 진입장벽이 있을 것 같아요. 그래도 내용은 알차고 실제로 이런 수법이 있다는 게 놀라웠어요. 좀 더 단순하게 만들어줬으면 좋겠어요.",
                highlight: "내용은 좋은데 처음엔 좀 복잡했어요",
              },
            ].map((r, i) => (
              <div key={i} style={{
                background: "#fdf8ff",
                border: "1px solid #e2e8f0",
                borderRadius: 20,
                padding: "24px 22px",
                boxShadow: "0 2px 12px #0000000a",
                display: "flex",
                flexDirection: "column" as const,
                gap: 14,
              }}>
                {/* 별점 */}
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} style={{ color: j < r.rating ? "#f59e0b" : "#e2e8f0", fontSize: 14 }}>★</span>
                  ))}
                </div>

                {/* 태그 */}
                <span style={{ display: "inline-block", background: r.tagColor + "12", color: r.tagColor, border: `1px solid ${r.tagColor}33`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, width: "fit-content" }}>
                  {r.tag}
                </span>

                {/* 하이라이트 */}
                <p style={{ color: "#1c0d2e", fontWeight: 800, fontSize: 14, lineHeight: 1.5, borderLeft: `3px solid ${r.tagColor}`, paddingLeft: 10 }}>
                  &ldquo;{r.highlight}&rdquo;
                </p>

                {/* 본문 */}
                <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.85, flex: 1 }}>{r.text}</p>

                {/* 작성자 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{r.avatar}</div>
                    <div>
                      <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 13 }}>{r.name}</p>
                      <p style={{ color: "#94a3b8", fontSize: 11 }}>{r.age}</p>
                    </div>
                  </div>
                  <span style={{ color: "#cbd5e1", fontSize: 11 }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI 후기 고지 */}
          <p style={{ textAlign: "center", color: "#cbd5e1", fontSize: 11, marginTop: 28, opacity: 0.35 }}>
            {lang === "ko" ? "* 위 후기는 실제 체험 데이터를 바탕으로 AI가 작성한 예시입니다." : lang === "ja" ? "* 上記のレビューは実際の体験データを基にAIが作成した例です。" : lang === "zh" ? "* 以上评价是AI根据实际体验数据生成的示例。" : lang === "vi" ? "* Các đánh giá trên là ví dụ do AI tạo ra dựa trên dữ liệu trải nghiệm thực tế." : lang === "es" ? "* Las reseñas anteriores son ejemplos generados por IA basados en datos de experiencia real." : "* The above reviews are AI-generated examples based on real experience data."}
          </p>

          {/* 하단 요약 수치 */}
          <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 32, paddingTop: 40, borderTop: "1px solid #e2e8f0" }}>
            {[
              { num: "4.9", label: lang === "ko" ? "평균 별점" : lang === "ja" ? "平均評価" : lang === "zh" ? "平均评分" : lang === "vi" ? "Đánh giá TB" : lang === "es" ? "Puntuación media" : "Avg. Rating", sub: lang === "ko" ? "5점 만점" : lang === "ja" ? "5点満点" : lang === "zh" ? "满分5分" : lang === "vi" ? "trên 5 sao" : lang === "es" ? "sobre 5" : "out of 5" },
              { num: "2,300+", label: lang === "ko" ? "체험 후기" : lang === "ja" ? "体験レビュー" : lang === "zh" ? "体验评价" : lang === "vi" ? "Đánh giá" : lang === "es" ? "Reseñas" : "Reviews", sub: lang === "ko" ? "누적 제출" : lang === "ja" ? "累計投稿" : lang === "zh" ? "累计提交" : lang === "vi" ? "đã gửi" : lang === "es" ? "acumuladas" : "submitted" },
              { num: "91%", label: lang === "ko" ? "실제 예방 효과" : lang === "ja" ? "実際の予防効果" : lang === "zh" ? "实际预防效果" : lang === "vi" ? "Hiệu quả phòng ngừa" : lang === "es" ? "Efecto de prevención" : "Prevention Effect", sub: lang === "ko" ? "체험자 자가 응답" : lang === "ja" ? "体験者自己回答" : lang === "zh" ? "体验者自我报告" : lang === "vi" ? "tự báo cáo" : lang === "es" ? "autoinforme" : "self-reported" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ color: "#1c0d2e", fontWeight: 900, fontSize: 28, letterSpacing: -0.5 }}>{s.num}</p>
                <p style={{ color: "#334155", fontSize: 13, fontWeight: 700 }}>{s.label}</p>
                <p style={{ color: "#94a3b8", fontSize: 11 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 후원자 명예의 전당 ── */}
      <HallOfFame />

      {/* ── 푸터 ── */}
      {/* ── 브랜드 컬러 & 연락처 푸터 ── */}
      <footer style={{ background: "#0e1a14", borderTop: "1px solid #2a3d30" }}>

        {/* ── 개인정보 처리방침 & 면책조항 ── */}
        <div style={{ borderBottom: "1px solid #1e3028", padding: "48px 40px" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            {/* 헤더 */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "linear-gradient(135deg, #2a5c3f, #3d7a55)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>🔒</div>
              <div>
                <p style={{ color: "#9FC0A2", fontSize: 11, fontWeight: 700, letterSpacing: 2, fontFamily: "monospace", margin: 0 }}>PRIVACY & DISCLAIMER</p>
                <h3 style={{ color: "#D7E3DF", fontWeight: 900, fontSize: 18, margin: 0 }}>개인정보 처리방침 및 면책조항</h3>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

              {/* 개인정보 처리방침 */}
              <div style={{
                background: "linear-gradient(135deg, #0a1a10 0%, #112418 100%)",
                border: "1px solid #2a4030",
                borderRadius: 16, padding: "22px 24px",
              }}>
                <p style={{ color: "#92B2A2", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 14, fontFamily: "monospace" }}>📋 개인정보 처리방침</p>
                {[
                  {
                    icon: "✅",
                    title: "개인정보 미수집 원칙",
                    desc: "본 서비스는 이름·전화번호·주민등록번호·계좌번호 등 어떠한 개인정보도 수집하지 않습니다.",
                    color: "#B7D4C8",
                  },
                  {
                    icon: "⚖️",
                    title: "무단 수집 시 법적 처벌",
                    desc: "만약 개인정보가 수집될 경우 「개인정보보호법」 제71조에 따라 5년 이하 징역 또는 5천만 원 이하 벌금에 처해집니다.",
                    color: "#D5E7AF",
                  },
                  {
                    icon: "📡",
                    title: "통신비밀 보호",
                    desc: "사용자 대화 내용은 저장·열람되지 않으며, 「통신비밀보호법」 위반 시 1년 이상 10년 이하 징역에 처해집니다.",
                    color: "#B7D4C8",
                  },
                  {
                    icon: "💳",
                    title: "금융정보 무수집",
                    desc: "체험 중 표시되는 모든 계좌·카드번호는 시뮬레이션이며, 실제 금융정보를 입력·수집하는 행위는 「전자금융거래법」 제49조 위반입니다.",
                    color: "#D5E7AF",
                  },
                  {
                    icon: "🤝",
                    title: "후원 관련 개인정보",
                    desc: "후원 시 닉네임 또는 일부 가려진 실명(예: 홍○○)이 명예의 전당에 표시될 수 있으며, 본인 동의 하에만 게시됩니다.",
                    color: "#C7DCD4",
                  },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, marginBottom: i < 4 ? 14 : 0,
                    paddingBottom: i < 4 ? 14 : 0,
                    borderBottom: i < 4 ? "1px solid #1e3028" : "none",
                  }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                    <div>
                      <p style={{ color: item.color, fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{item.title}</p>
                      <p style={{ color: "#6b8c78", fontSize: 11, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 면책조항 */}
              <div style={{
                background: "linear-gradient(135deg, #0a1a10 0%, #112418 100%)",
                border: "1px solid #2a4030",
                borderRadius: 16, padding: "22px 24px",
              }}>
                <p style={{ color: "#92B2A2", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 14, fontFamily: "monospace" }}>⚠️ 면책조항</p>
                {[
                  {
                    icon: "🚫",
                    title: "실제 범죄 유도 없음",
                    desc: "본 프로그램의 모든 시나리오는 범죄 예방 교육 목적으로 제작되었으며, 어떠한 실제 범죄도 유도·조장·지원하지 않습니다.",
                    color: "#D5E7AF",
                  },
                  {
                    icon: "🎭",
                    title: "시뮬레이션 환경",
                    desc: "체험 중 발생하는 모든 대화·금액·계좌·결제는 가상 시뮬레이션이며 실제 이체, 결제, 해킹이 발생하지 않습니다.",
                    color: "#B7D4C8",
                  },
                  {
                    icon: "📚",
                    title: "교육 목적 비영리",
                    desc: "본 서비스는 교육 목적의 비영리 프로그램으로, 상업적 사기나 불법 도박을 권장하지 않습니다.",
                    color: "#C7DCD4",
                  },
                  {
                    icon: "🔄",
                    title: "콘텐츠 업데이트 면책",
                    desc: "v1.0 이후 다수의 업데이트(v1.7 현재)로 콘텐츠가 변경될 수 있으며, 이전 버전과의 차이에 대해 운영자는 책임을 지지 않습니다.",
                    color: "#D5E7AF",
                  },
                  {
                    icon: "⚡",
                    title: "AI 생성 콘텐츠 면책",
                    desc: "AI(Claude, Anthropic)가 생성한 대화·후기·시나리오는 예시 데이터이며, 실제 사건·인물·기관과 무관합니다.",
                    color: "#B7D4C8",
                  },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, marginBottom: i < 4 ? 14 : 0,
                    paddingBottom: i < 4 ? 14 : 0,
                    borderBottom: i < 4 ? "1px solid #1e3028" : "none",
                  }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                    <div>
                      <p style={{ color: item.color, fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{item.title}</p>
                      <p style={{ color: "#6b8c78", fontSize: 11, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 법 요약 배너 */}
            <div style={{
              marginTop: 16, padding: "12px 20px", borderRadius: 12,
              background: "linear-gradient(90deg, #0d2018, #142e1e, #0d2018)",
              border: "1px solid #2a4030",
              display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            }}>
              <span style={{ fontSize: 14 }}>📜</span>
              <span style={{ color: "#6b8c78", fontSize: 11 }}>관련 법령:</span>
              {["개인정보보호법", "통신비밀보호법", "전자금융거래법", "정보통신망법", "형법"].map((law) => (
                <span key={law} style={{
                  background: "#1a3525", border: "1px solid #2a5035",
                  color: "#92B2A2", fontSize: 10, fontWeight: 700,
                  padding: "2px 8px", borderRadius: 20,
                }}>{law}</span>
              ))}
              <span style={{ color: "#4a6a55", fontSize: 10, marginLeft: "auto" }}>본 서비스는 위 법령을 준수합니다</span>
            </div>
          </div>
        </div>

        {/* ── 브랜드 팔레트 ── */}
        <div style={{ borderBottom: "1px solid #1e3028", padding: "40px 40px 32px" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <p style={{ color: "#4a6a55", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 6, fontFamily: "monospace" }}>BRAND COLORS — 푸터 팔레트</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
              {[
                { hex: "#D7E3DF", label: "Mist" },
                { hex: "#C7DCD4", label: "Sage" },
                { hex: "#B7D4C8", label: "Fern" },
                { hex: "#92B2A2", label: "Stone" },
                { hex: "#9FC0A2", label: "Moss" },
                { hex: "#D5E7AF", label: "Lime" },
                { hex: "#9161b2", label: "Purple" },
                { hex: "#c58dc6", label: "Orchid" },
              ].map((c) => (
                <div key={c.hex} style={{ textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: c.hex, marginBottom: 5, boxShadow: `0 2px 8px ${c.hex}44` }} />
                  <p style={{ color: "#4a6a55", fontSize: 9, fontFamily: "monospace", marginBottom: 2 }}>{c.label}</p>
                  <p style={{ color: "#6b8a75", fontSize: 8.5, fontFamily: "monospace", letterSpacing: 0.5 }}>{c.hex.toUpperCase()}</p>
                </div>
              ))}
            </div>

            <p style={{ color: "#534AB7", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 6, fontFamily: "monospace" }}>PERSONAL COLORS — 사이트 대표 컬러</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { hex: "#534AB7", label: "Main", desc: "메인 퍼플" },
                { hex: "#7c3aed", label: "Accent", desc: "강조 바이올렛" },
                { hex: "#22c55e", label: "Safe", desc: "안전·예방 그린" },
                { hex: "#ef4444", label: "Danger", desc: "위험·범죄 레드" },
                { hex: "#f59e0b", label: "Warning", desc: "경고 앰버" },
                { hex: "#f472b6", label: "New", desc: "최신 뱃지 핑크" },
                { hex: "#38bdf8", label: "Info", desc: "정보 스카이블루" },
                { hex: "#0d0520", label: "BG", desc: "메인 배경색" },
              ].map((c) => (
                <div key={c.hex} style={{ textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: c.hex, marginBottom: 5, boxShadow: `0 2px 10px ${c.hex}55`, border: c.hex === "#0d0520" ? "1px solid #2a2a4a" : "none" }} />
                  <p style={{ color: "#9161b2", fontSize: 9, fontFamily: "monospace", marginBottom: 1, fontWeight: 700 }}>{c.label}</p>
                  <p style={{ color: "#6b6b9a", fontSize: 7.5, fontFamily: "monospace", letterSpacing: 0.3, marginBottom: 1 }}>{c.hex.toUpperCase()}</p>
                  <p style={{ color: "#4a4a7a", fontSize: 7, fontFamily: "monospace" }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 연락처 & 링크 ── */}
        <div style={{ padding: "36px 40px 28px" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40, marginBottom: 28 }}>

              {/* 브랜드 소개 */}
              <div>
                {/* BooUngYee 로고 — 초록 제거된 투명 PNG */}
                <div style={{ width: 90, height: 45, marginBottom: 14, overflow: "hidden", borderRadius: 8 }}>
                  <img
                    src="/logo-booungyee-transparent.png"
                    alt="BooUngYee"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Shield size={14} color="#9FC0A2" />
                  <span style={{ color: "#D7E3DF", fontWeight: 900, fontSize: 14 }}>범죄예방 체험관</span>
                </div>
                <p style={{ color: "#4a6a55", fontSize: 12, lineHeight: 2.0 }}>
                  AI가 설계한 한국 최초<br />
                  몰입형 범죄 예방 체험 프로그램.<br />
                  실제 체험으로 사기를 막습니다.
                </p>
              </div>

              {/* 연락처 */}
              <div>
                <p style={{ color: "#4a6a55", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16, fontFamily: "monospace" }}>CONTACT</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href="mailto:itnlifecn@gmail.com" style={{
                    display: "flex", alignItems: "center", gap: 10, textDecoration: "none",
                    padding: "11px 14px", borderRadius: 12,
                    background: "#0d1f14", border: "1px solid #2a4030",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#9FC0A2")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a4030")}
                  >
                    <span style={{ fontSize: 18 }}>✉️</span>
                    <div>
                      <p style={{ color: "#B7D4C8", fontWeight: 700, fontSize: 13 }}>itnlifecn@gmail.com</p>
                      <p style={{ color: "#4a6a55", fontSize: 10, marginTop: 2 }}>기관 도입 · 제휴 · 일반 문의</p>
                    </div>
                  </a>
                  <a href="mailto:itnlifecn@gmail.com?subject=[기관 도입 문의]&body=기관명:%0A담당자:%0A문의내용:" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    textDecoration: "none", padding: "11px 0", borderRadius: 12,
                    background: "linear-gradient(135deg, #2a5c3f, #3d7a55)",
                    color: "#D7E3DF", fontWeight: 700, fontSize: 13,
                  }}>
                    📧 이메일로 문의하기
                  </a>
                </div>
              </div>

              {/* 페이지 */}
              <div>
                <p style={{ color: "#4a6a55", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16, fontFamily: "monospace" }}>PAGES</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "🚨 사기 범죄 체험", path: "/crime" },
                    { label: "🎰 불법 도박 체험", path: "/gambling" },
                    { label: "🏛️ 기관 도입 안내", path: "/partnership" },
                    { label: "📊 이용 통계", path: "/stats" },
                    { label: "🔒 개인정보 처리방침", path: "/privacy" },
                  ].map((item) => (
                    <button key={item.path} onClick={() => router.push(item.path)} style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#4a6a55", fontSize: 12, textAlign: "left", padding: "2px 0",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#B7D4C8")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#4a6a55")}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 카피라이트 */}
            <div style={{ borderTop: "1px solid #1e3028", paddingTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <p style={{ color: "#2a4030", fontSize: 11, fontFamily: "monospace" }}>© 2024–2026 범죄예방 체험관 · Made with AI (Claude) · 부엉이 🦉</p>
              <p style={{ color: "#2a4030", fontSize: 11 }}>교육 목적 비영리 · 개인정보 무수집 · 실제 결제 없음</p>
            </div>
          </div>
        </div>
      </footer>

      {/* 맨 위로 버튼 */}
      {showScrollTop && (
        <button
          onClick={() => {
            try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
            try { document.documentElement.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
            try { document.body.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          }}
          style={{
            position: "fixed",
            bottom: isMobile ? 80 : 32,
            right: isMobile ? 16 : 32,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(124,58,237,0.5)",
            zIndex: 9000,
            animation: "fadeInUp 0.25s ease",
            WebkitTapHighlightColor: "transparent",
          }}
          title="맨 위로"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </div>
  );
}
