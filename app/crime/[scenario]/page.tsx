"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Send, AlertTriangle, CheckCircle, ChevronRight, Bell, Home, CreditCard, BarChart2, ShieldAlert, Phone } from "lucide-react";
import { CRIME_SCENARIOS } from "@/lib/crimes";
import Certificate from "@/components/Certificate";
import { useLang } from "@/lib/LanguageContext";
import { t, LANGUAGES } from "@/lib/i18n";
import { SCENARIO_TIPS } from "@/lib/scenarioTips";
import { SCENARIO_TYPES } from "@/lib/scenarioTypes";
import { getLocalizedScenarioType } from "@/lib/scenarioTypesI18n";

type Phase =
  | "type-intro"
  | "ringing"
  | "bank-main"
  | "transfer-form"
  | "transfer-confirm"
  | "loan-main"
  | "loan-confirm"
  | "chat"
  | "fake-bank-app"
  | "sent-animation"
  | "police-call"
  | "police-unresolved"
  | "link-sms"
  | "link-hacking"
  | "reveal";

// 시나리오별 채팅 스타일 설정
type ChatType = "kakao" | "sms" | "call";
const CHAT_CONFIG: Record<string, { type: ChatType; headerTitle: string; sender: string; senderSub?: string }> = {
  "family-impersonation":   { type: "kakao", headerTitle: "오카카톡", sender: "김민준", senderSub: "모르는 번호" },
  "prosecutor-impersonation": { type: "call", headerTitle: "전화 통화 중", sender: "02-530-4000", senderSub: "서울중앙지검 (사칭)" },
  "romance-scam":           { type: "kakao", headerTitle: "오카카톡", sender: "이수진", senderSub: "온라인 지인" },
  "investment-scam":        { type: "kakao", headerTitle: "오카카톡", sender: "박재현 ☆", senderSub: "전 직장동료" },
  "loan-fraud":             { type: "call",  headerTitle: "전화 통화 중", sender: "BK저축은행 상담", senderSub: "02-1234-5678" },
  "delivery-scam":          { type: "sms",   headerTitle: "메시지", sender: "JC대한통운", senderSub: "+8210-0000-0000" },
  "kakaotalk-impersonation":{ type: "kakao", headerTitle: "오카카톡", sender: "민지 🌸", senderSub: "친구" },
  "used-goods-scam":        { type: "kakao", headerTitle: "오카카톡", sender: "피망마켓 판매자", senderSub: "중고거래" },
};

// 전화형 시나리오는 ringing 단계부터 시작
const CALL_SCENARIOS = new Set(["prosecutor-impersonation", "loan-fraud"]);
// 링크 사기 시나리오
const LINK_SCENARIOS = new Set(["link-download-scam"]);

interface Message {
  role: "user" | "criminal" | "system";
  content: string;
}

// ─── 위험 키워드 감지 ───────────────────────────────────────────────────────

// 사용자가 실제로 돈을 보내러 나가려 할 때의 반응 패턴
const USER_DANGER_PATTERNS = [
  /지금\s*(바로\s*)?(갈게|갑니다|가겠습니다|나갈게|나가볼게)/,
  /알겠어(요)?\s*[,.]\s*(지금|바로|당장)/,
  /알겠습니다\s*[,.]\s*(지금|바로|당장)/,
  /바로\s*(갈게|가볼게|이체할게|보낼게|송금할게|출금할게|뽑아올게|가져다줄게)/,
  /지금\s*(이체|송금|출금|계좌이체|현금|뽑아)/,
  /(현금|돈)\s*(뽑아|인출|찾아)\s*(올게|갈게|드릴게)/,
  /은행\s*(가서|가볼게|갈게)/,
  /ATM\s*(가서|갈게|에서)/,
  /(갖다|가져다)\s*(드릴|줄|놓을)/,
  /택배\s*(보낼|부칠|맡길)/,
  /(계좌번호|통장)\s*(불러|알려)\s*(주세요|줘)/,
  /어디로\s*(가면|가야|갈까)/,
  /주소\s*(알려|보내)\s*(주세요|줘)/,
];

// 사기범 메시지에서 현실 행동 유도 감지 (ATM·현금·대면 요구)
const CRIMINAL_DANGER_PATTERNS = [
  /ATM|현금인출기|인출기/,
  /현금\s*(뽑아|인출|찾아)/,
  /직접\s*(가서|가져|전달)/,
  /(가져다|갖다)\s*(주세요|줘|놓아|놓으세요)/,
  /안전\s*(요원|보관|계좌|박스)/,
  /경찰관(이|이)\s*(기다리|대기)/,
  /택배\s*(기사|로\s*보내)/,
  /주소\s*(알려드릴|보내드릴)/,
  /코인\s*(ATM|박스|전송)/,
  /현금\s*(보관|전달|전달해|전달하)/,
  /어디로\s*(오세요|오시면)/,
];

function detectUserDanger(text: string): boolean {
  return USER_DANGER_PATTERNS.some((p) => p.test(text));
}

function detectCriminalDanger(text: string): boolean {
  return CRIMINAL_DANGER_PATTERNS.some((p) => p.test(text));
}

// ─── UI 컴포넌트 ─────────────────────────────────────────────────────────────

const BK = "#1A6FD4";   // 한빛은행 파란색
const BK_DARK = "#fff"; // 헤더 텍스트 흰색
const BK_LIGHT = "#e8f1fb"; // 연한 배경

const FIRST_MESSAGES: Record<string, string> = {
  // 처음엔 돈 얘기 없이 감정적 훅으로 시작 → 자연스럽게 대화 유도
  "family-impersonation": "엄마... 나야. 폰 깨져서 친구 재호 폰으로 연락하는 거야. 저장 안 된 번호라 놀랐지? 나 지금 좀 당황스럽거든ㅠ",
  "prosecutor-impersonation": "여보세요. 저는 서울중앙지검 수사관 박진우입니다. 지금 급히 연락드릴 사안이 생겨서요. 잠깐 통화 가능하십니까? 중요한 사안입니다.",
  "romance-scam": "자기야ㅠㅠ 나야. 나 지금 홍콩인데... 큰일 났어. 너한테 제일 먼저 연락하고 싶었어. 지금 많이 무서워.",
  "investment-scam": "안녕하세요~ 박재현입니다! 작년에 같이 일했던 거 기억하시죠? 요즘 어떻게 지내세요? 드릴 말씀이 있어서 연락했어요.",
  "loan-fraud": "안녕하세요 고객님! BK저축은행 이민준 상담사입니다. 오늘 고객님 신용 조회 결과가 나왔는데요, 좋은 소식이 있어서 연락드렸어요. 지금 통화 가능하세요?",
  "delivery-scam": "[JC대한통운] 고객님 안녕하세요. 운송장번호 CJ1284739201847 건으로 배송 보류 상태입니다. 확인 부탁드립니다.",
  "kakaotalk-impersonation": "야 나야 민지! 오랜만ㅋㅋ 잘 지내고 있어? 사실 연락한 이유가 있는데...",
  "used-goods-scam": "안녕하세요! 아이폰16 Pro 256GB 게시글 보셨어요? 솔직히 이 가격 진짜 없어요. 지금 2명이 더 보고 있는데 먼저 연락 주신 분께 드리려고요.",
};

function BKStar({ size = 24, fill = BK }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <polygon points="14,2 17.5,10.5 27,10.5 19.5,16.5 22.5,25 14,20 5.5,25 8.5,16.5 1,10.5 10.5,10.5" fill={fill} />
    </svg>
  );
}

function SimWatermark() {
  return (
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 0,
    }}>
      <span style={{
        fontSize: 64, fontWeight: 900, color: "white", opacity: 0.018,
        transform: "rotate(-35deg)", letterSpacing: 8, userSelect: "none", whiteSpace: "nowrap",
      }}>
        SIMULATION
      </span>
    </div>
  );
}

function SimDot() {
  return (
    <div title="시뮬레이션" style={{
      position: "absolute", top: 12, right: 12, width: 6, height: 6,
      borderRadius: "50%", backgroundColor: "#ffffff", opacity: 0.07, zIndex: 99,
    }} />
  );
}

function formatAmount(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(0)}억원`;
  if (n >= 10000) return `${(n / 10000).toLocaleString()}만원`;
  return `${n.toLocaleString()}원`;
}

// ─── 긴급 차단 오버레이 ────────────────────────────────────────────────────

type BlockType = "user-going-out" | "criminal-location" | "page-leave";

interface BlockState {
  type: BlockType;
  criminalText?: string;
}

function EmergencyBlock({ block, onClose, onReveal, lang }: {
  block: BlockState;
  onClose: () => void;
  onReveal: () => void;
  lang: import("@/lib/i18n").LangCode;
}) {
  const isLeave = block.type === "page-leave";
  const isLocation = block.type === "criminal-location";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.92)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24,
      animation: "fadeIn 0.2s ease",
    }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>

      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "linear-gradient(135deg, #7f1d1d, #ef4444)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20, boxShadow: "0 0 40px #ef444460",
      }}>
        <ShieldAlert size={40} color="#fff" />
      </div>

      <p style={{ color: "#ef4444", fontWeight: 900, fontSize: 22, marginBottom: 8, textAlign: "center" }}>
        {t("em_title", lang)}
      </p>

      {isLeave && (
        <>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 12, textAlign: "center" }}>
            {t("em_leave_title", lang)}
          </p>
          <div style={{
            background: "#1a0000", border: "1px solid #ef444466", borderRadius: 16,
            padding: "14px 18px", marginBottom: 12, width: "100%",
          }}>
            <p style={{ color: "#fca5a5", fontSize: 14, lineHeight: 1.7, textAlign: "center", whiteSpace: "pre-line" }}>
              {t("em_leave_body", lang)}
            </p>
          </div>
          <div style={{
            background: "#1a1000", border: "1px solid #f59e0b66", borderRadius: 16,
            padding: "12px 16px", marginBottom: 20, width: "100%",
          }}>
            <p style={{ color: "#fcd34d", fontSize: 12, lineHeight: 1.7, textAlign: "center" }}>
              ⚠️ 시뮬레이션에 표시되는 계좌번호는 <strong style={{ color: "#fff" }}>실제와 무관한 임의 번호</strong>입니다.<br />
              제작자의 후원 계좌도 아니며, 해당 번호로 송금 시 <strong style={{ color: "#ef4444" }}>회수가 불가능</strong>합니다.<br />
              절대 실제로 송금하지 마세요.
            </p>
          </div>
        </>
      )}

      {isLocation && (
        <>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 12, textAlign: "center" }}>
            현금 전달·ATM 인출 지시를 받았습니다
          </p>
          <div style={{
            background: "#1a0000", border: "1px solid #ef444466", borderRadius: 16,
            padding: "14px 18px", marginBottom: 12, width: "100%",
          }}>
            <p style={{ color: "#9ca3af", fontSize: 11, marginBottom: 6 }}>사기범 메시지 감지:</p>
            <p style={{ color: "#fca5a5", fontSize: 13, lineHeight: 1.6, fontStyle: "italic" }}>
              "{block.criminalText?.slice(0, 80)}..."
            </p>
          </div>
          <div style={{
            background: "#1c1000", border: "1px solid #f59e0b66", borderRadius: 16,
            padding: "12px 16px", marginBottom: 20, width: "100%",
          }}>
            <p style={{ color: "#fcd34d", fontSize: 13, lineHeight: 1.7, textAlign: "center" }}>
              ⚠️ <strong>현금을 직접 가져다주거나 ATM에서 인출하라는 지시</strong>는<br />
              실제 금융기관·수사기관이 절대 하지 않는 행동입니다.<br />
              <strong style={{ color: "#ef4444" }}>100% 사기입니다.</strong>
            </p>
          </div>
        </>
      )}

      {!isLeave && !isLocation && (
        <>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 12, textAlign: "center" }}>
            실제로 돈을 보내려 하고 계신가요?
          </p>
          <div style={{
            background: "#1a0000", border: "1px solid #ef444466", borderRadius: 16,
            padding: "14px 18px", marginBottom: 20, width: "100%",
          }}>
            <p style={{ color: "#fca5a5", fontSize: 14, lineHeight: 1.8, textAlign: "center" }}>
              지금 대화하고 있는 상대는<br />
              <strong style={{ color: "#ef4444", fontSize: 16 }}>실제 사기범 역할을 하는 AI</strong>입니다.<br /><br />
              실제 돈을 보내거나, ATM에 가거나,<br />
              현금을 인출하면 <strong>돌려받을 수 없습니다.</strong>
            </p>
          </div>
        </>
      )}

      <div style={{
        background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 14,
        padding: "12px 20px", marginBottom: 20, width: "100%", textAlign: "center",
      }}>
        <p style={{ color: "#60a5fa", fontSize: 12, marginBottom: 4 }}>{t("em_report_182", lang)}</p>
        <p style={{ color: "#fff", fontWeight: 900, fontSize: 24 }}>{t("crime_police_182", lang)}</p>
        <p style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{t("crime_24h_ops", lang)}</p>
      </div>

      <div style={{ display: "flex", gap: 10, width: "100%" }}>
        {!isLeave && (
          <button onClick={onReveal} style={{
            flex: 1, padding: "14px 0", borderRadius: 16,
            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
          }}>
            {t("em_result_btn", lang)}
          </button>
        )}
        <button onClick={onClose} style={{
          flex: 1, padding: "14px 0", borderRadius: 16,
          background: "#1a1a1a", color: "#888",
          fontWeight: 600, fontSize: 14, border: "1px solid #2a2a2a", cursor: "pointer",
        }}>
          {isLeave ? t("em_stay_btn", lang) : t("em_continue_btn", lang)}
        </button>
      </div>
    </div>
  );
}

// ─── 링크 사기 컴포넌트 ────────────────────────────────────────────────────────

// 현실감 있는 가짜 개인정보 (시뮬레이션 전용)
const FAKE_PROFILES = [
  { name: "김○현", rrn: "850315-1284731", addr: "서울특별시 노원구 중계동 387-12 현대아파트 101동 504호", phone: "010-3847-9012", email: "khyun85@naver.com", bank: "한신은행 110-473-829014", card: "5412 **** **** 8837" },
  { name: "이○진", rrn: "920724-2893047", addr: "경기도 수원시 영통구 매탄동 1142번지 삼성래미안 203동 1102호", phone: "010-5623-7841", email: "ljin9207@gmail.com", bank: "국민은행 789-24-0193847", card: "4532 **** **** 2291" },
  { name: "박○수", rrn: "780502-1567234", addr: "부산광역시 해운대구 우동 1477-3 해운대아이파크 508동 2203호", phone: "010-8912-3047", email: "pksoo78@daum.net", bank: "남은행 1002-847-293041", card: "3782 **** **** 5519" },
];

function LinkSmsPhase({ onLinkClick }: { onLinkClick: () => void }) {
  const [clicked, setClicked] = useState(false);
  return (
    <div style={{
      flex: 1, background: "#f0f0f5", display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden",
    }}>
      <style>{`
        @keyframes link-pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .link-btn-pulse { animation: link-pulse 1.8s ease-in-out infinite; }
      `}</style>

      {/* SMS 헤더 */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", background: "#e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>📱</div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>국세청</p>
          <p style={{ fontSize: 11, color: "#94a3b8" }}>+82-2-0000-0000</p>
        </div>
      </div>

      {/* SMS 내용 */}
      <div style={{ flex: 1, padding: "20px 16px", overflowY: "auto" }}>
        {/* 날짜 */}
        <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginBottom: 14 }}>오늘 오전 10:23</p>

        {/* 메시지 버블 */}
        <div style={{
          background: "#fff", borderRadius: "4px 18px 18px 18px",
          padding: "14px 16px", maxWidth: "88%",
          boxShadow: "0 1px 4px #0000001a",
          lineHeight: 1.7,
        }}>
          <p style={{ fontSize: 13, color: "#1e293b", marginBottom: 10 }}>
            [국세청] 고객님의 세금 환급금 <strong style={{ color: "#2563eb" }}>348,000원</strong>이 발생하였습니다.<br />
            아래 링크를 통해 본인인증 후 즉시 수령 가능합니다.<br />
            <br />
            ※ 48시간 내 미수령 시 자동 소멸됩니다.
          </p>

          {/* 가짜 링크 버튼 */}
          <button
            onClick={() => { if (!clicked) { setClicked(true); setTimeout(onLinkClick, 500); } }}
            className={clicked ? "" : "link-btn-pulse"}
            style={{
              display: "block", width: "100%",
              background: clicked ? "#64748b" : "linear-gradient(135deg, #1d4ed8, #2563eb)",
              color: "#fff", border: "none", borderRadius: 10,
              padding: "11px 0", fontSize: 13, fontWeight: 700,
              cursor: clicked ? "default" : "pointer",
              transition: "background 0.3s",
            }}
          >
            {clicked ? "⏳ 연결 중..." : "🔗 환급금 수령하기 →"}
          </button>

          {/* URL 텍스트 - 클릭 가능 */}
          <p
            onClick={() => { if (!clicked) { setClicked(true); setTimeout(onLinkClick, 500); } }}
            style={{
              fontSize: 10, color: clicked ? "#94a3b8" : "#3b82f6",
              marginTop: 7, cursor: clicked ? "default" : "pointer",
              textDecoration: clicked ? "none" : "underline",
              wordBreak: "break-all",
            }}
          >
            nts-refund-kr.secure-verify.net/claim/auth?token=A8kZ9
          </p>
        </div>
      </div>
    </div>
  );
}

function LinkHackingPhase({ onReveal }: { onReveal: () => void }) {
  const [step, setStep] = useState(0);
  const FAKE_P = FAKE_PROFILES[Math.floor(Math.random() * FAKE_PROFILES.length)];

  useEffect(() => {
    const delays = [200, 600, 1000, 1400, 1900, 2400, 2900, 3500, 4200, 5000];
    const timers = delays.map((d, i) =>
      setTimeout(() => setStep(i + 1), d)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const dataRows = [
    { label: "주민등록번호", value: FAKE_P.rrn, icon: "🪪", danger: true },
    { label: "이름", value: FAKE_P.name, icon: "👤", danger: false },
    { label: "주소", value: FAKE_P.addr, icon: "🏠", danger: true },
    { label: "전화번호", value: FAKE_P.phone, icon: "📞", danger: true },
    { label: "이메일", value: FAKE_P.email, icon: "✉️", danger: false },
    { label: "계좌번호", value: FAKE_P.bank, icon: "🏦", danger: true },
    { label: "카드번호", value: FAKE_P.card, icon: "💳", danger: true },
  ];

  return (
    <div style={{
      flex: 1, background: "#000", display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden", position: "relative",
    }}>
      <style>{`
        @keyframes glitch {
          0%{transform:translate(0)} 20%{transform:translate(-2px,1px)} 40%{transform:translate(2px,-1px)}
          60%{transform:translate(-1px,2px)} 80%{transform:translate(1px,-2px)} 100%{transform:translate(0)}
        }
        @keyframes scanline {
          0%{top:-100%} 100%{top:100%}
        }
        @keyframes data-appear {
          from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)}
        }
        @keyframes redFlash {
          0%,100%{background:#000} 50%{background:#1a0000}
        }
        @keyframes typewriter {
          from{width:0} to{width:100%}
        }
        .hack-row { animation: data-appear 0.3s ease both; }
        .hack-flash { animation: redFlash 0.5s ease 3; }
      `}</style>

      {/* 스캔라인 효과 */}
      {step >= 1 && (
        <div style={{
          position: "absolute", left: 0, right: 0, height: "30%",
          background: "linear-gradient(transparent, #ff000008, transparent)",
          animation: "scanline 2s linear infinite",
          pointerEvents: "none", zIndex: 10,
        }} />
      )}

      {/* 경고 헤더 */}
      <div style={{
        background: step >= 2 ? "#7f1d1d" : "#111",
        borderBottom: `1px solid ${step >= 2 ? "#ef4444" : "#222"}`,
        padding: "10px 14px",
        transition: "background 0.5s",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{
          fontSize: 18,
          animation: step >= 3 ? "glitch 0.15s steps(1) infinite" : "none",
        }}>⚠️</div>
        <div>
          <p style={{
            color: step >= 2 ? "#fca5a5" : "#555",
            fontWeight: 800, fontSize: 13,
            fontFamily: "monospace",
            transition: "color 0.5s",
          }}>
            {step === 0 ? "연결 중..." :
             step === 1 ? "보안 검사 중..." :
             step >= 2 ? "⛔ 악성코드 감지됨" : ""}
          </p>
          {step >= 3 && (
            <p style={{ color: "#ef4444", fontSize: 10, fontFamily: "monospace" }}>
              MALWARE.APK › 실행 완료 › 데이터 추출 시작
            </p>
          )}
        </div>
      </div>

      {/* 해킹 콘솔 로그 */}
      {step >= 2 && (
        <div style={{
          padding: "8px 14px",
          background: "#0a0a0a",
          borderBottom: "1px solid #1a1a1a",
          fontFamily: "monospace", fontSize: 10, color: "#22c55e",
          maxHeight: 80, overflow: "hidden",
        }}>
          {step >= 2 && <p style={{ opacity: 0.7 }}>[10:23:41] 링크 클릭 감지 → 세션 하이재킹 시도...</p>}
          {step >= 3 && <p>[10:23:41] 악성 스크립트 로드 완료 (32BK)</p>}
          {step >= 4 && <p style={{ color: "#ef4444" }}>[10:23:42] 저장된 자격증명 스캔 중...</p>}
          {step >= 5 && <p style={{ color: "#f97316" }}>[10:23:42] 개인정보 추출 시작 → 원격 서버 전송</p>}
        </div>
      )}

      {/* 개인정보 탈취 표시 */}
      <div style={{
        flex: 1, padding: "12px 14px", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        {step >= 3 && (
          <p style={{
            color: "#ef4444", fontFamily: "monospace", fontSize: 11,
            marginBottom: 4, fontWeight: 700,
          }}>
            ▶ 탈취된 개인정보 ({dataRows.filter((_, i) => i < step - 2).length}/{dataRows.length})
          </p>
        )}

        {dataRows.map((row, i) =>
          step >= i + 3 ? (
            <div
              key={row.label}
              className="hack-row"
              style={{
                animationDelay: `${i * 0.05}s`,
                background: row.danger ? "#1a0000" : "#0a0a0a",
                border: `1px solid ${row.danger ? "#ef444444" : "#1a1a1a"}`,
                borderRadius: 8, padding: "8px 12px",
                display: "flex", alignItems: "flex-start", gap: 8,
              }}
            >
              <span style={{ fontSize: 16, marginTop: 1 }}>{row.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#555", fontSize: 10, fontFamily: "monospace", marginBottom: 2 }}>{row.label}</p>
                <p style={{
                  color: row.danger ? "#fca5a5" : "#d1d5db",
                  fontSize: 13, fontWeight: 700,
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}>
                  {row.value}
                </p>
              </div>
              {row.danger && (
                <span style={{ color: "#ef4444", fontSize: 10, whiteSpace: "nowrap", marginTop: 2 }}>
                  ▲ 유출
                </span>
              )}
            </div>
          ) : null
        )}

        {/* 전송 완료 메시지 */}
        {step >= 10 && (
          <div style={{
            background: "#450a0a",
            border: "2px solid #ef4444",
            borderRadius: 12, padding: "14px",
            textAlign: "center",
            animation: "data-appear 0.4s ease",
          }}>
            <p style={{ color: "#ef4444", fontWeight: 900, fontSize: 15, marginBottom: 6 }}>
              🔴 개인정보 탈취 완료
            </p>
            <p style={{ color: "#fca5a5", fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
              7건의 개인정보가 해외 서버로 전송되었습니다.<br />
              주민번호·계좌번호·카드번호가 노출되었습니다.
            </p>
            <button
              onClick={onReveal}
              style={{
                background: "linear-gradient(135deg, #dc2626, #ef4444)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "12px 24px", fontWeight: 800, fontSize: 14,
                cursor: "pointer", width: "100%",
              }}
            >
              결과 확인하기 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 신고번호 저장 유틸 + RevealScreen ───────────────────────────────────────

const REPORT_NUMBERS = [
  { label: "경찰청 사이버수사대", number: "182", desc: "24시간 · 보이스피싱·사기 신고" },
  { label: "금융감독원", number: "1332", desc: "금융사기·불법대출 신고" },
  { label: "한국인터넷진흥원", number: "118", desc: "스미싱·해킹 신고" },
  { label: "검찰청 범죄피해 구조", number: "1301", desc: "피해 구조 및 법률 지원" },
];

function saveDangerRecord(scenarioId: string, reasons: string[]) {
  try {
    const existing = JSON.parse(localStorage.getItem("danger_records") || "[]");
    existing.push({
      id: Date.now(),
      scenarioId,
      reasons,
      savedAt: new Date().toISOString(),
      reportNumbers: REPORT_NUMBERS.map((r) => ({ label: r.label, number: r.number })),
    });
    localStorage.setItem("danger_records", JSON.stringify(existing.slice(-20)));
    localStorage.setItem("report_numbers_saved", "true");
  } catch {}
}

function RevealScreen({
  data, finalSendAmount, dangerCount, dangerReasons, scenarioId,
  numbersSaved, onSaveNumbers, onRetry, onHome, lang, chatOutcome,
}: {
  data: ReturnType<typeof CRIME_SCENARIOS.find> & object;
  finalSendAmount: number | null;
  dangerCount: number;
  dangerReasons: string[];
  scenarioId: string;
  numbersSaved: boolean;
  onSaveNumbers: () => void;
  onRetry: () => void;
  onHome: () => void;
  lang: import("@/lib/i18n").LangCode;
  chatOutcome?: "none" | "refused" | "sent";
}) {
  const isDangerous = dangerCount > 0;
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = REPORT_NUMBERS.map((r) => `${r.label}: ${r.number}`).join("\n");
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // 위험 유저면 자동 저장
  useEffect(() => {
    if (isDangerous && !numbersSaved) {
      onSaveNumbers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) return null;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 40px", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── 끝까지 거절한 유저 칭찬 배너 ── */}
      {chatOutcome === "refused" && (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <style>{`
            @keyframes trophy-bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
            @keyframes ticker-scroll { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
          `}</style>
          <div style={{
            background: "linear-gradient(135deg, #052e16, #14532d)",
            border: "2px solid #22c55e88",
            borderRadius: 20, padding: "20px 16px", textAlign: "center", marginBottom: 4,
          }}>
            <div style={{
              fontSize: 56, marginBottom: 10,
              animation: "trophy-bounce 1.2s ease-in-out infinite",
              display: "inline-block",
            }}>🏆</div>
            <p style={{ color: "#4ade80", fontWeight: 900, fontSize: 20, marginBottom: 8 }}>
              {t("result_success", lang)}
            </p>
            <p style={{ color: "#86efac", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
              끝까지 의심하고 거절하셨습니다.<br />
              <strong style={{ color: "#fff" }}>{t("result_suspect_title", lang)}</strong><br />
              실제 상황에서도 이렇게 행동해 주세요.
            </p>
            <div style={{
              background: "#0a1f0a", borderRadius: 12, padding: "10px 14px",
              border: "1px solid #22c55e33",
            }}>
              <p style={{ color: "#4ade80", fontSize: 13, fontWeight: 700 }}>
                ✅ 의심 → 확인 → 거절 → 신고
              </p>
              <p style={{ color: "#86efac", fontSize: 11, marginTop: 4 }}>
                가족·지인이라도 먼저 직접 전화로 확인하세요
              </p>
            </div>
          </div>

          {/* 안 당해도 신고하세요 */}
          <div style={{
            background: "#0a1628", border: "1px solid #1e3a5f",
            borderRadius: 16, padding: "14px 16px",
          }}>
            <p style={{ color: "#60a5fa", fontWeight: 800, fontSize: 14, marginBottom: 10 }}>
              📣 피해를 안 입었어도 신고해 주세요
            </p>
            <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.7, marginBottom: 12 }}>
              신고 한 건이 다른 피해자를 구합니다. 수법·계좌번호·전화번호를 신고하면<br />
              경찰이 즉시 추적해 같은 수법의 추가 피해를 막을 수 있습니다.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { n: "182", l: "경찰청 사이버수사대", c: "#3b82f6" },
                { n: "118", l: "인터넷진흥원(KISA)", c: "#059669" },
                { n: "1332", l: "금융감독원", c: "#0891b2" },
                { n: "112", l: "경찰청 (24시간)", c: "#ef4444" },
              ].map(r => (
                <a key={r.n} href={`tel:${r.n}`} style={{
                  background: "#111", border: `1px solid ${r.c}44`,
                  borderRadius: 12, padding: "10px 12px", textDecoration: "none",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                }}>
                  <span style={{ color: r.c, fontWeight: 900, fontSize: 20 }}>{r.n}</span>
                  <span style={{ color: "#6b7280", fontSize: 10 }}>{r.l}</span>
                </a>
              ))}
            </div>

            {/* 신고 시 중요한 것 */}
            <div style={{ marginTop: 12, background: "#111", borderRadius: 12, padding: "12px 14px" }}>
              <p style={{ color: "#fbbf24", fontWeight: 700, fontSize: 12, marginBottom: 8 }}>
                📋 신고할 때 이것을 준비하세요
              </p>
              {[
                "상대방 전화번호 또는 오카카톡 아이디",
                "상대방이 알려준 계좌번호",
                "대화 내용 캡처 (스크린샷)",
                "피해 금액 및 이체 일시",
                "상대방이 사용한 수법 설명",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
                  <span style={{ color: "#fbbf24", fontSize: 11, marginTop: 1 }}>▸</span>
                  <span style={{ color: "#9ca3af", fontSize: 11, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 송금한 유저 스크롤 경고 티커 ── */}
      {chatOutcome === "sent" && (
        <div style={{ overflow: "hidden", borderRadius: 10, marginBottom: 4 }}>
          <div style={{
            background: "#7f1d1d", padding: "8px 0",
            display: "flex", alignItems: "center",
          }}>
            <div style={{
              display: "inline-block",
              animation: "ticker-scroll 14s linear infinite",
              whiteSpace: "nowrap",
              color: "#fca5a5", fontSize: 12, fontWeight: 700,
            }}>
              🚨 경찰청 182 즉시 신고 &nbsp;·&nbsp; 금융감독원 1332 피해 접수 &nbsp;·&nbsp; 은행 고객센터 즉시 지급정지 &nbsp;·&nbsp; 한국인터넷진흥원 118 &nbsp;·&nbsp; 피해신고 지금 바로 하세요! &nbsp;·&nbsp; 경찰청 182 즉시 신고 &nbsp;·&nbsp; 금융감독원 1332 피해 접수
            </div>
          </div>
        </div>
      )}

      {/* 위험 유저 특별 경고 배너 */}
      {isDangerous && (
        <div style={{
          background: "linear-gradient(135deg, #450a0a, #7f1d1d)",
          border: "2px solid #ef444488",
          borderRadius: 20, padding: "16px",
          animation: "fadeIn 0.3s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <ShieldAlert size={22} color="#ef4444" />
            <p style={{ color: "#fca5a5", fontWeight: 800, fontSize: 15 }}>⚠️ 위험 행동이 감지됐습니다</p>
          </div>
          <p style={{ color: "#fca5a5", fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>
            체험 중 <strong style={{ color: "#fff" }}>실제로 돈을 보내거나 이동하려는 행동</strong>이{" "}
            <strong style={{ color: "#fbbf24" }}>{dangerCount}회</strong> 감지됐습니다.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
            {dangerReasons.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <span style={{ color: "#ef4444", fontSize: 11, marginTop: 2, flexShrink: 0 }}>•</span>
                <p style={{ color: "#fca5a5aa", fontSize: 12 }}>{r}</p>
              </div>
            ))}
          </div>
          <div style={{
            background: "#1a000080", borderRadius: 12, padding: "10px 14px",
            border: "1px solid #ef444433",
          }}>
            <p style={{ color: "#fca5a5", fontSize: 12, lineHeight: 1.6, textAlign: "center" }}>
              만약 현실에서 비슷한 상황이 생기면<br />
              <strong style={{ color: "#fff", fontSize: 16 }}>즉시 전화를 끊고 182로 신고</strong>하세요.
            </p>
          </div>
        </div>
      )}

      {/* 메인 결과 카드 */}
      <div style={{
        background: "#0d0820", border: "2px solid #ef444499",
        borderRadius: 24, padding: 20, textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🚨</div>
        <p style={{ color: "#ef4444", fontWeight: 900, fontSize: 22, marginBottom: 6 }}>이것은 범죄입니다</p>
        {finalSendAmount && (
          <p style={{ color: "#fff", fontWeight: 900, fontSize: 36, margin: "8px 0" }}>{formatAmount(finalSendAmount)}</p>
        )}
        <p style={{ color: "#666", fontSize: 13 }}>방금 이 금액을 잃을 뻔 했습니다</p>

        <div style={{
          marginTop: 16, background: "#0a1a0a", border: "1px solid #22c55e66",
          borderRadius: 16, padding: "16px",
        }}>
          <CheckCircle size={28} color="#22c55e" style={{ margin: "0 auto 8px" }} />
          <p style={{ color: "#22c55e", fontWeight: 800, fontSize: 16 }}>{t("result_fail", lang)}</p>
          <p style={{ color: "#16a34a", fontSize: 12, marginTop: 4 }}>{t("gamble_sim_badge", lang)}</p>
        </div>
      </div>

      {/* 범죄 설명 */}
      <div style={{ background: "#1a1040", borderRadius: 18, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <AlertTriangle size={15} color="#fbbf24" />
          <p style={{ color: "#fbbf24", fontWeight: 700, fontSize: 14 }}>{data.reveal.crimeName}</p>
        </div>
        <p style={{ color: "#ccc", fontSize: 13, lineHeight: 1.7 }}>{data.reveal.description}</p>
        {data.reveal.stats && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #2a2a2a" }}>
            <p style={{ color: "#f97316", fontSize: 12, fontWeight: 600 }}>📊 {data.reveal.stats}</p>
          </div>
        )}
      </div>

      {/* 어린이 설명 */}
      {data.reveal.kidExplanation && (
        <div style={{ background: "linear-gradient(135deg, #1a0a2e, #0f1a2e)", border: "2px solid #fb923c55", borderRadius: 18, padding: 16 }}>
          <p style={{ color: "#fb923c", fontWeight: 800, fontSize: 13, marginBottom: 8 }}>🧒 어린이·초보자용 쉬운 설명</p>
          <p style={{ color: "#fed7aa", fontSize: 13, lineHeight: 1.8 }}>{data.reveal.kidExplanation.replace("🧒 쉽게 말하면: ", "")}</p>
        </div>
      )}

      {/* 예방법 */}
      <div style={{ background: "#0a1a0a", border: "1px solid #22c55e33", borderRadius: 18, padding: 16 }}>
        <p style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>✓ 이렇게 예방하세요</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.reveal.howToAvoid.map((tip: string, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ color: "#22c55e", fontSize: 12, marginTop: 2, flexShrink: 0 }}>✓</span>
              <p style={{ color: "#d1fae5", fontSize: 13, lineHeight: 1.6 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ 신고번호 카드 (항상 표시, 위험 유저는 강조) ══ */}
      <div style={{
        background: isDangerous
          ? "linear-gradient(135deg, #0a1628, #0d1f3c)"
          : "#13082a",
        border: isDangerous ? "2px solid #3b82f6" : "1px solid #1e0a3a",
        borderRadius: 20, padding: 16,
        boxShadow: isDangerous ? "0 0 24px #3b82f620" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Phone size={16} color="#60a5fa" />
            <p style={{ color: "#60a5fa", fontWeight: 800, fontSize: 14 }}>
              {isDangerous ? "🚨 즉시 신고하세요" : "피해 신고 번호"}
            </p>
          </div>
          {isDangerous && numbersSaved && (
            <span style={{
              fontSize: 10, padding: "3px 8px", borderRadius: 20,
              background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e44",
            }}>
              ✓ 저장됨
            </span>
          )}
        </div>

        {isDangerous && (
          <div style={{
            background: "#1a000080", border: "1px solid #ef444433",
            borderRadius: 12, padding: "10px 14px", marginBottom: 14,
          }}>
            <p style={{ color: "#fca5a5", fontSize: 12, textAlign: "center", lineHeight: 1.6 }}>
              혹시 지금 실제 상황이라면<br />
              <strong style={{ color: "#fff" }}>전화를 끊고 아래 번호로 즉시 신고</strong>하세요
            </p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {REPORT_NUMBERS.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              style={{
                background: "#0d0820", borderRadius: 14, padding: "12px",
                border: isDangerous ? "1px solid #1e3a5f" : "1px solid #1a1a1a",
                textDecoration: "none", display: "block",
                transition: "background 0.1s",
              }}
            >
              <p style={{ color: "#555", fontSize: 10, marginBottom: 4 }}>{item.label}</p>
              <p style={{ color: isDangerous ? "#60a5fa" : "#fff", fontWeight: 900, fontSize: 22 }}>
                {item.number}
              </p>
              <p style={{ color: "#444", fontSize: 10, marginTop: 3, lineHeight: 1.4 }}>{item.desc}</p>
            </a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleCopy}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 12, fontSize: 12, fontWeight: 600,
              background: copied ? "#22c55e22" : "#1a1a1a",
              color: copied ? "#22c55e" : "#888",
              border: copied ? "1px solid #22c55e44" : "1px solid #2a2a2a",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {copied ? "✓ 복사됨" : "번호 복사"}
          </button>
          {!numbersSaved ? (
            <button
              onClick={onSaveNumbers}
              style={{
                flex: 1, padding: "11px 0", borderRadius: 12, fontSize: 12, fontWeight: 700,
                background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                color: "#fff", border: "none", cursor: "pointer",
              }}
            >
              📲 저장하기
            </button>
          ) : (
            <div style={{
              flex: 1, padding: "11px 0", borderRadius: 12, fontSize: 12, fontWeight: 600,
              background: "#0a1a0a", color: "#22c55e",
              border: "1px solid #22c55e44", textAlign: "center", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              ✓ 저장 완료
            </div>
          )}
        </div>
      </div>

      {/* ── 실제 피해 발생 시 행동 가이드 ── */}
      <div style={{ background: "#0a1628", border: "2px solid #1e3a5f", borderRadius: 20, padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>🆘</span>
          <p style={{ color: "#60a5fa", fontWeight: 900, fontSize: 15 }}>실제로 돈을 보냈다면? 지금 당장 하세요</p>
        </div>

        {/* 단계별 가이드 */}
        {[
          {
            step: "1",
            color: "#ef4444",
            bg: "#1a0000",
            border: "#ef444433",
            icon: "👨‍👩‍👧",
            title: "가족 · 자녀에게 즉시 연락하세요",
            desc: "혼자 해결하려 하지 마세요. 부모님, 자녀, 형제자매에게 전화해서\n\"나 지금 이상한 전화 받고 돈 보냈어. 어떻게 해야 해?\"라고 말하세요.",
            action: null,
          },
          {
            step: "2",
            color: "#f59e0b",
            bg: "#1a1000",
            border: "#f59e0b33",
            icon: "📞",
            title: "가족이 연락 안 된다면 → 즉시 112",
            desc: "연락이 닿지 않으면 주저하지 말고 112에 신고하세요.\n\"보이스피싱 피해를 당했습니다. 계좌 지급정지를 요청합니다.\"",
            numbers: [
              { n: "112", l: "경찰청 (즉시신고·지급정지)", c: "#ef4444" },
              { n: "1332", l: "금융감독원 (피해금 환급신청)", c: "#3b82f6" },
            ],
          },
          {
            step: "3",
            color: "#22c55e",
            bg: "#0a1a0a",
            border: "#22c55e33",
            icon: "🏦",
            title: "보낸 은행 앱 → 이체 취소 시도",
            desc: "은행 앱을 열어 '이체 내역'에서 취소를 시도하거나,\n은행 고객센터에 즉시 전화해 \"사기 이체 지급정지\"를 요청하세요.\n신고가 빠를수록 환급 가능성이 높아집니다.",
            numbers: [
              { n: "1588-9999", l: "BK국민은행 고객센터", c: "#f59e0b" },
              { n: "1599-9999", l: "한신은행 고객센터", c: "#3b82f6" },
            ],
          },
          {
            step: "4",
            color: "#a78bfa",
            bg: "#0d0a1a",
            border: "#a78bfa33",
            icon: "🚔",
            title: "가까운 경찰서 방문",
            desc: "전화 신고 후 가까운 경찰서에 직접 방문해 피해신고서를 작성하세요.\n대화 내용 캡처, 계좌번호, 이체 내역을 미리 준비해 가세요.",
            action: null,
          },
        ].map((item) => (
          <div key={item.step} style={{
            background: item.bg, border: `1px solid ${item.border}`,
            borderRadius: 14, padding: "14px", marginBottom: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: item.color, display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 900 }}>{item.step}</span>
              </div>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <p style={{ color: item.color, fontWeight: 700, fontSize: 13 }}>{item.title}</p>
            </div>
            <p style={{ color: "#9ca3af", fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-line", marginBottom: (item as {numbers?: unknown[]}).numbers ? 10 : 0 }}>
              {item.desc}
            </p>
            {(item as {numbers?: {n:string;l:string;c:string}[]}).numbers && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(item as {numbers: {n:string;l:string;c:string}[]}).numbers.map((r) => (
                  <a key={r.n} href={`tel:${r.n}`} style={{
                    display: "flex", flexDirection: "column",
                    background: "rgba(255,255,255,0.05)", borderRadius: 10,
                    padding: "8px 14px", textDecoration: "none",
                    border: `1px solid ${r.c}33`, minWidth: 100,
                  }}>
                    <span style={{ color: r.c, fontWeight: 900, fontSize: 18 }}>{r.n}</span>
                    <span style={{ color: "#6b7280", fontSize: 10, marginTop: 2 }}>{r.l}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 위로 메시지 */}
        <div style={{ background: "#0d1f0d", border: "1px solid #22c55e33", borderRadius: 12, padding: "12px 14px", marginTop: 4 }}>
          <p style={{ color: "#86efac", fontSize: 12, lineHeight: 1.8, textAlign: "center" }}>
            🙏 <strong style={{ color: "#fff" }}>당신의 잘못이 아닙니다.</strong><br />
            범죄자가 치밀하게 속인 것입니다. 부끄러워하지 말고<br />
            <strong style={{ color: "#4ade80" }}>즉시 신고하는 것이 피해를 줄이는 유일한 방법</strong>입니다.
          </p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onRetry}
          style={{
            flex: 1, padding: "14px 0", borderRadius: 16,
            background: "transparent", color: "#666",
            border: "1px solid #2a2a2a", fontSize: 14, cursor: "pointer",
          }}
        >
          {t("rev_retry", lang)}
        </button>
        <button
          onClick={onHome}
          style={{
            flex: 1, padding: "14px 0", borderRadius: 16,
            background: "#f97316", color: "#fff",
            border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          {t("rev_other", lang)}
        </button>
      </div>
    </div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────

export default function ScenarioPage() {
  const router = useRouter();
  const { scenario } = useParams<{ scenario: string }>();
  const data = CRIME_SCENARIOS.find((s) => s.id === scenario);
  const { lang } = useLang();

  const chatCfg = CHAT_CONFIG[scenario as string] ?? { type: "kakao" as ChatType, headerTitle: "오카카톡", sender: "알 수 없음" };
  const realFirstPhase: Phase =
    CALL_SCENARIOS.has(scenario as string) ? "ringing"
    : LINK_SCENARIOS.has(scenario as string) ? "link-sms"
    : "chat";

  const [phase, setPhase] = useState<Phase>(
    SCENARIO_TYPES[scenario as string] ? "type-intro" : realFirstPhase
  );
  const [asset, setAsset] = useState(15000000);
  const [displayAsset, setDisplayAsset] = useState(15000000);
  const [loanAmount] = useState(30000000);
  // fake-bank-app phase states
  const [smsAlert, setSmsAlert] = useState(false);
  const [bankConfirmed, setBankConfirmed] = useState(false);
  // police-call phase states
  const [policeStep, setPoliceStep] = useState(0);
  // police-unresolved phase states
  const [unresolvedVisible, setUnresolvedVisible] = useState(false);
  const [transferTarget, setTransferTarget] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [translations, setTranslations] = useState<Record<number, string>>({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingSend, setPendingSend] = useState<number | null>(null);
  const [refuseCount, setRefuseCount] = useState(0);
  const [finalSendAmount, setFinalSendAmount] = useState<number | null>(null);
  const [notif] = useState(false);
  const [block, setBlock] = useState<BlockState | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  // 위험 행동 감지 누적
  const [dangerCount, setDangerCount] = useState(0);
  const [dangerReasons, setDangerReasons] = useState<string[]>([]);
  const [tipMode, setTipMode] = useState(false);
  const [activeTip, setActiveTip] = useState<{ tip: string; counter: string[] } | null>(null);
  const shownTips = useRef<Set<string>>(new Set());
  const [numbersSaved, setNumbersSaved] = useState(false);
  const [chatOutcome, setChatOutcome] = useState<"none" | "refused" | "sent">("none");
  const [intensity, setIntensity] = useState<1|2|3>(() => {
    if (typeof window !== "undefined") {
      const v = parseInt(localStorage.getItem("crimeSim_intensity") ?? "2");
      return (v === 1 || v === 2 || v === 3) ? v : 2;
    }
    return 2;
  });
  const [showIntensity, setShowIntensity] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  function recordDanger(reason: string) {
    setDangerCount((c) => c + 1);
    setDangerReasons((prev) => [...new Set([...prev, reason])]);
  }

  // chat 시작 시 첫 메시지 설정 (ringing에서 넘어올 때도 포함)
  useEffect(() => {
    if (phase === "chat" && messages.length === 0) {
      const firstMsg = FIRST_MESSAGES[scenario as string] || "안녕하세요.";
      setMessages([{ role: "criminal", content: firstMsg }]);
      if (lang && lang !== "ko") {
        const LANG_NAMES: Record<string, string> = {
          en:"English", ja:"Japanese", zh:"Chinese", vi:"Vietnamese",
          es:"Spanish", de:"German", fr:"French", hi:"Hindi", pt:"Portuguese",
          th:"Thai", uz:"Uzbek", tl:"Filipino", mn:"Mongolian", ru:"Russian", id:"Indonesian",
        };
        fetch("/api/crime/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: firstMsg, lang: LANG_NAMES[lang] ?? "English" }),
        }).then(r => r.json()).then(d => {
          if (d.translation) setTranslations({ 0: d.translation });
        }).catch(() => {});
      }
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // 채팅 중 BGM 버튼 숨기기
  useEffect(() => {
    const isChat = phase === "chat" || phase === "sent-animation";
    window.dispatchEvent(new CustomEvent(isChat ? "crime-play-start" : "crime-play-end"));
  }, [phase]);

  // police-call 대화 라인 (TTS, 타이머 공유)
  const POLICE_LINES = [
    { from: "system", text: "📞 112에 신고 중..." },
    { from: "police", text: "네, 112입니다. 무슨 일이신가요?" },
    { from: "user",   text: `사기를 당했어요. ${formatAmount(finalSendAmount ?? 0)}을 이체했는데요...` },
    { from: "police", text: "신고 접수하겠습니다. 어떤 경위로 이체하셨는지 말씀해 주시겠어요?" },
    { from: "user",   text: "전화로 수사관이라고 해서 안전계좌로 보내달라고 해서..." },
    { from: "police", text: "확인됐습니다. 즉시 해당 은행에 지급정지를 신청하시고, 금융감독원 1332에도 신고 부탁드립니다." },
    { from: "user",   text: "그럼 제 돈은 돌려받을 수 있나요?" },
    { from: "police", text: "죄송합니다. 이미 인출됐을 경우 즉각 회수가 어렵습니다. 피해 회수율은 약 30% 수준입니다." },
    { from: "user",   text: "...그럼 70%는 그냥 날리는 건가요?" },
    { from: "police", text: "빠른 신고와 지급정지가 최선입니다. 신고 접수번호는 2024-112-849203입니다. 정말 죄송합니다." },
  ];

  // police-call: 대화 타이머
  useEffect(() => {
    if (phase !== "police-call") return;
    if (policeStep < POLICE_LINES.length) {
      const delay = policeStep === 0 ? 800 : policeStep === 1 ? 2000 : 1600;
      const timer = setTimeout(() => setPoliceStep(s => s + 1), delay);
      return () => clearTimeout(timer);
    }
  }, [phase, policeStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // police-call: TTS
  useEffect(() => {
    if (phase !== "police-call" || policeStep === 0) return;
    const line = POLICE_LINES[policeStep - 1];
    if (!line || line.from !== "police") return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(line.text);
    const langMap: Record<string, string> = { ko:"ko-KR", en:"en-US", ja:"ja-JP", zh:"zh-CN", vi:"vi-VN", es:"es-ES", de:"de-DE", fr:"fr-FR", hi:"hi-IN", pt:"pt-BR" };
    utter.lang = langMap[lang] ?? "ko-KR";
    utter.rate = 0.88; utter.pitch = 1.05; utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === utter.lang && (v.name.includes("female") || v.name.includes("Female") || v.name.includes("여성") || v.name.includes("Yuna") || v.name.includes("Kyoko") || v.name.includes("Siri") || v.name.includes("Google"))) ?? voices.find(v => v.lang === utter.lang);
    if (preferred) utter.voice = preferred;
    window.speechSynthesis.speak(utter);
    return () => { window.speechSynthesis.cancel(); };
  }, [phase, policeStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // phase가 police-call로 바뀔 때 step 초기화
  useEffect(() => {
    if (phase === "police-call") setPoliceStep(0);
    if (phase === "police-unresolved") {
      setUnresolvedVisible(false);
      setTimeout(() => setUnresolvedVisible(true), 300);
    }
    if (phase === "fake-bank-app") { setSmsAlert(false); setBankConfirmed(false); }
  }, [phase]);

  // 페이지 이탈 / 분할화면 / 앱 전환 감지
  useEffect(() => {
    const activePhases = ["chat", "bank-main", "transfer-form", "transfer-confirm", "transfer-confirm2", "loan-main", "loan-confirm"];
    if (!activePhases.includes(phase)) return;

    let blurTimer: ReturnType<typeof setTimeout> | null = null;

    function handleVisibilityChange() {
      if (document.hidden) {
        setBlock({ type: "page-leave" });
        recordDanger("앱 이탈 시도 (실제 송금 앱 전환 의심)");
      }
    }

    // 분할화면·다른 앱 전환 시 window가 포커스를 잃음
    function handleBlur() {
      // 300ms 후에도 포커스가 없으면 경고 (단순 클릭 오탐 방지)
      blurTimer = setTimeout(() => {
        setBlock({ type: "page-leave" });
        recordDanger("창 포커스 이탈 (분할화면·앱 전환 의심)");
      }, 300);
    }

    function handleFocus() {
      if (blurTimer) { clearTimeout(blurTimer); blurTimer = null; }
    }

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (blurTimer) clearTimeout(blurTimer);
    };
  }, [phase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, pendingSend]);


  function goToBankFromChat() {
    setPhase("bank-main");
  }

  const doReveal = useCallback(() => {
    setBlock(null);
    setPhase("reveal");
  }, []);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userText = input.trim();

    // ── 사용자 메시지 위험 감지 ──
    if (detectUserDanger(userText)) {
      recordDanger(`실제 행동 시도 발언: "${userText.slice(0, 30)}"`);
      setBlock({ type: "user-going-out" });
      return; // 메시지 전송 차단
    }

    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/crime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario,
          messages: newMessages.filter(m => m.role !== "system").map((m) => ({ role: m.role === "criminal" ? "assistant" : "user", content: m.content })),
          userMessage: userText,
          lang,
          intensity,
        }),
      });

      const d = await res.json();
      if (d.reply || d.error) {
        setMessages((prev) => {
          const next = [...prev, { role: "criminal" as const, content: d.reply || "..." }];
          if (d.translation) setTranslations(t => ({ ...t, [next.length - 1]: d.translation }));
          return next;
        });
        // 팁 모드 — AI 응답에서 트리거 키워드 감지
        if (tipMode && d.reply) {
          const tips = SCENARIO_TIPS[scenario as string] ?? [];
          for (const t of tips) {
            if (shownTips.current.has(t.tip)) continue;
            if (t.trigger.some(kw => d.reply.includes(kw))) {
              shownTips.current.add(t.tip);
              setActiveTip({ tip: t.tip, counter: t.counter });
              setTimeout(() => setActiveTip(null), 8000);
              break;
            }
          }
        }
        if (detectCriminalDanger(d.reply)) {
          recordDanger("사기범이 현금 전달·ATM 인출 지시");
          setTimeout(() => setBlock({ type: "criminal-location", criminalText: d.reply }), 800);
        }
      }
      if (d.sendAmount) setPendingSend(d.sendAmount);
    } catch {
      setMessages((prev) => [...prev, { role: "criminal", content: "..." }]);
    } finally {
      setLoading(false);
    }
  }

  function doTransfer(amount: number) {
    recordDanger(`송금 버튼 실행: ${formatAmount(amount)}`);
    setFinalSendAmount(amount);
    setChatOutcome("sent");
    // 바로 sent-animation 대신 가짜 은행앱으로
    setPhase("fake-bank-app");
  }

  function executeFinalTransfer() {
    const amount = finalSendAmount ?? 0;
    setPhase("sent-animation");
    const start = asset;
    const target = Math.max(0, asset - amount);
    const t0 = Date.now();
    function tick() {
      const p = Math.min((Date.now() - t0) / 2000, 1);
      setDisplayAsset(Math.round(start - (start - target) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
      // 완료 후 reveal 대신 police-call로
      else setTimeout(() => setPhase("police-call"), 700);
    }
    requestAnimationFrame(tick);
  }

  if (!data) return null;

  // ── 좌측 정보 패널 내용 ──
  const leftPanel = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* 시나리오 정보 */}
      <div style={{
        background: "#fff", border: "1px solid #f1f5f9",
        borderRadius: 18, padding: "22px",
        boxShadow: "0 2px 12px #0000000a",
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: data.color + "16",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, marginBottom: 14,
        }}>
          {data.icon}
        </div>
        <p style={{ color: data.color, fontSize: 10, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>
          SIMULATION
        </p>
        <p style={{ color: "#0f172a", fontWeight: 800, fontSize: 18, marginBottom: 6, letterSpacing: -0.3 }}>{data.title}</p>
        <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{data.subtitle}</p>
      </div>

      {/* 교육 안내 */}
      <div style={{
        background: "#eff6ff", border: "1px solid #bfdbfe",
        borderRadius: 16, padding: "16px 18px",
      }}>
        <p style={{ color: "#1d4ed8", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>💡 {t("sim_guide_title", lang)}</p>
        <ul style={{ color: "#3b82f6", fontSize: 12, lineHeight: 2, paddingLeft: 16 }}>
          <li>{t("sim_guide_1", lang)}</li>
          <li>{t("sim_guide_2", lang)}</li>
          <li>{t("sim_guide_3", lang)}</li>
          <li>{t("sim_guide_4", lang)}</li>
        </ul>
      </div>

      {/* 통계 */}
      <div style={{
        background: "#fff", border: "1px solid #f1f5f9",
        borderRadius: 16, padding: "16px 18px",
        boxShadow: "0 2px 8px #0000000a",
      }}>
        <p style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>{t("sim_stats_label", lang)}</p>
        <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>{data.reveal.stats}</p>
      </div>

      {/* 안전 안내 */}
      <div style={{
        background: "#f0fdf4", border: "1px solid #bbf7d0",
        borderRadius: 16, padding: "14px 18px",
        display: "flex", alignItems: "flex-start", gap: 10,
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>🛡️</span>
        <p style={{ color: "#15803d", fontSize: 12, lineHeight: 1.6 }}>{t("sim_safety_notice", lang)}</p>
      </div>

      {/* 다른 시나리오 */}
      <button
        onClick={() => router.push("/crime")}
        style={{
          padding: "11px 0", borderRadius: 12, fontSize: 13, fontWeight: 500,
          background: "#fff", color: "#64748b",
          border: "1px solid #e2e8f0", cursor: "pointer",
        }}
      >
        {t("sim_other_scenarios", lang)}
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff" }}>

      {/* 상단 네비 */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", gap: 12,
        padding: "0 40px", height: 56,
        boxShadow: "0 1px 8px #0000000a",
      }}>
        <button onClick={() => router.push("/")} style={{ padding: 6, background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", borderRadius: 8 }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: data.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
          {data.icon}
        </div>
        <span style={{ color: "#0f172a", fontWeight: 600, fontSize: 14 }}>{data.title}</span>
        <div style={{ flex: 1 }} />
        {dangerCount > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 20, padding: "4px 12px",
          }}>
            <AlertTriangle size={12} color="#ef4444" />
            <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 600 }}>{t("sim_danger_detected", lang)} {dangerCount}</span>
          </div>
        )}

        {/* 개인정보 안내 버튼 (숨겨진 i 아이콘) */}
        <button
          onClick={() => setShowPrivacyNotice(true)}
          title="개인정보 안내"
          style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", display: "flex", borderRadius: 6, opacity: 0.5 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
        >
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </button>

        {/* 강도 설정 버튼 (숨겨진 ⚙ 아이콘) */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowIntensity(v => !v)}
            title="강도 설정"
            style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", display: "flex", borderRadius: 6, opacity: 0.45 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.45")}
          >
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
          </button>
          {showIntensity && (
            <div style={{
              position: "absolute", right: 0, top: 30, zIndex: 200,
              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
              boxShadow: "0 8px 32px #0000001a", padding: "12px 4px", minWidth: 160,
            }}>
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, padding: "0 14px", marginBottom: 6 }}>{t("intensity_title", lang)}</p>
              {([
                [1, t("intensity_mild", lang), ""],
                [2, t("intensity_normal", lang), ""],
                [3, t("intensity_hard", lang), ""],
              ] as [1|2|3, string, string][]).map(([lv, label, desc]) => (
                <button key={lv} onClick={() => {
                  setIntensity(lv);
                  localStorage.setItem("crimeSim_intensity", String(lv));
                  setShowIntensity(false);
                }} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "8px 14px", border: "none", cursor: "pointer",
                  background: intensity === lv ? "#f0f9ff" : "none",
                  borderRadius: 8, textAlign: "left",
                }}>
                  <span style={{ fontSize: 13, fontWeight: intensity === lv ? 700 : 400, color: intensity === lv ? "#0369a1" : "#374151" }}>{label}</span>
                  {desc && <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: "auto" }}>{desc}</span>}
                  {intensity === lv && <span style={{ color: "#0369a1", fontSize: 12 }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 개인정보 안내 모달 */}
      {showPrivacyNotice && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#00000060", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setShowPrivacyNotice(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 20, padding: "28px 28px", maxWidth: 420, width: "100%", boxShadow: "0 20px 60px #00000030" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{t("scene_privacy_title", lang)}</p>
            </div>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.8, marginBottom: 14 }}>
              {t("privacy_body1", lang)}
            </p>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "#991b1b", lineHeight: 1.8, fontWeight: 600 }}>
                {t("privacy_warn", lang)}
              </p>
              <p style={{ fontSize: 12, color: "#b91c1c", lineHeight: 1.7, marginTop: 6 }}>
                실제 정보를 입력하실 경우 예상치 못한 개인정보 노출 위험이 있습니다. 이 시뮬레이션은 가상의 정보만을 사용하며, 실제 금융거래는 절대 이루어지지 않습니다.
              </p>
            </div>
            <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.7 }}>
              본 프로그램은 범죄 예방 교육 목적으로 제작되었습니다. 모든 시나리오는 허구이며, 실제 범죄 행위와 무관합니다.
            </p>
            <button onClick={() => setShowPrivacyNotice(false)} style={{
              marginTop: 18, width: "100%", padding: "10px 0", background: "#2563eb",
              color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>{t("privacy_confirm", lang)}</button>
          </div>
        </div>
      )}

      {/* 2열 레이아웃 */}
      <div style={{
        maxWidth: 1140, margin: "0 auto", padding: "36px 40px",
        display: "grid", gridTemplateColumns: "300px 1fr", gap: 32, alignItems: "start",
      }}>
        {/* 좌측: 시나리오 정보 */}
        <div style={{ position: "sticky", top: 72 }}>
          {leftPanel}
        </div>

        {/* 우측: 폰 목업 */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 390, minHeight: 700,
            background: "#1a1a2e", borderRadius: 44,
            border: "8px solid #d1d5db",
            boxShadow: "0 0 0 1px #e2e8f0, 0 32px 64px #0000002a",
            overflow: "hidden", position: "relative",
            display: "flex", flexDirection: "column",
          }}>
            <SimWatermark />

            {/* ── 긴급 차단 오버레이 ── */}
            {block && (
              <EmergencyBlock
                block={block}
                onClose={() => setBlock(null)}
                onReveal={doReveal}
                lang={lang}
              />
            )}

      {/* ══ 유형 인트로 ══ */}
      {phase === "type-intro" && (() => {
        const typeInfo = getLocalizedScenarioType(scenario as string, lang) ?? SCENARIO_TYPES[scenario as string];
        if (!typeInfo) return null;
        return (
          <div style={{
            flex: 1, overflowY: "auto", background: "#0d0d1e",
            display: "flex", flexDirection: "column",
          }}>
            <style>{`
              @keyframes typeSlide { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
            `}</style>

            {/* 상단 헤더 */}
            <div style={{
              background: "linear-gradient(135deg,#1a0d2e,#2d1060)",
              padding: "28px 20px 20px",
              borderBottom: "1px solid #ffffff10",
            }}>
              <p style={{ color: "#a78bfa", fontSize: 10, fontWeight: 700, letterSpacing: 3, marginBottom: 8, textTransform: "uppercase" }}>
                {t("intro_analysis", lang)}
              </p>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 17, lineHeight: 1.4, marginBottom: 8 }}>
                {data.title}
              </p>
              <p style={{ color: "#c4b5fd", fontSize: 12, lineHeight: 1.6 }}>
                {typeInfo.summary}
              </p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                marginTop: 10, background: "#ef444420", border: "1px solid #ef444440",
                borderRadius: 20, padding: "4px 12px",
              }}>
                <span style={{ fontSize: 10, color: "#fca5a5", fontWeight: 700 }}>{t("intro_psych", lang)}</span>
                <span style={{ fontSize: 11, color: "#fef2f2", fontWeight: 800 }}>{typeInfo.psychWeapon}</span>
              </div>
            </div>

            {/* 유형 목록 */}
            <div style={{ padding: "16px 16px 0", flex: 1 }}>
              <p style={{ color: "#6b7280", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>
                {t("intro_variants", lang)}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {typeInfo.variants.map((v, i) => (
                  <div key={i} style={{
                    background: v.isThis ? "linear-gradient(135deg,#1a0d2e,#2d1060)" : "#111827",
                    border: v.isThis ? "1.5px solid #7c3aed" : "1px solid #1f2937",
                    borderRadius: 14, padding: "14px 16px",
                    animation: `typeSlide 0.4s ease ${i * 0.1}s both`,
                    position: "relative",
                  }}>
                    {v.isThis && (
                      <span style={{
                        position: "absolute", top: 10, right: 12,
                        background: "#7c3aed", color: "#fff",
                        fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 20,
                      }}>{t("intro_today", lang)}</span>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 20 }}>{v.icon}</span>
                      <span style={{
                        fontWeight: 800, fontSize: 13,
                        color: v.isThis ? "#c4b5fd" : "#9ca3af",
                      }}>{v.label}</span>
                    </div>
                    <p style={{ color: v.isThis ? "#e9d5ff" : "#6b7280", fontSize: 12, lineHeight: 1.6 }}>
                      {v.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 시작 버튼 */}
            <div style={{ padding: "20px 16px 28px" }}>
              <p style={{ color: "#4b5563", fontSize: 11, textAlign: "center", marginBottom: 12, lineHeight: 1.6 }}>
                {t("intro_desc", lang)}
              </p>
              <button
                onClick={() => setPhase(realFirstPhase)}
                style={{
                  width: "100%", padding: "16px 0",
                  background: "linear-gradient(135deg,#7c3aed,#9161b2)",
                  border: "none", borderRadius: 16,
                  color: "#fff", fontWeight: 900, fontSize: 15,
                  cursor: "pointer", boxShadow: "0 4px 20px #7c3aed40",
                }}
              >
                {t("intro_start", lang)}
              </button>
            </div>
          </div>
        );
      })()}

      {/* ══ 전화 수신 ══ */}
      {phase === "ringing" && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
          height: "100%", background: "linear-gradient(180deg, #1a1a2e 0%, #0d0d0d 100%)",
          padding: "80px 32px 60px",
        }}>
          <style>{`
            @keyframes ring-pulse {
              0%   { transform: scale(1);   opacity: 0.6; }
              60%  { transform: scale(1.6); opacity: 0; }
              100% { transform: scale(1.6); opacity: 0; }
            }
          `}</style>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>{t("ring_incoming", lang)}</p>
            <p style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{chatCfg.sender}</p>
            {chatCfg.senderSub && (
              <p style={{ color: "#ef4444", fontSize: 13, fontWeight: 600 }}>{chatCfg.senderSub}</p>
            )}
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 120, height: 120 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                position: "absolute", borderRadius: "50%",
                width: 80 + i * 20, height: 80 + i * 20,
                background: "#22c55e22",
                animation: `ring-pulse 1.8s ease-out ${i * 0.3}s infinite`,
              }} />
            ))}
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, #1a2e1a, #22c55e22)",
              border: "2px solid #22c55e44",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, position: "relative", zIndex: 1,
            }}>
              {data.icon}
            </div>
          </div>

          <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => router.push("/")}
                style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "#ef444422", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                }}
              >📵</button>
              <span style={{ color: "#888", fontSize: 12 }}>{t("ring_reject", lang)}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => setPhase("chat")}
                style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "#22c55e", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                }}
              >📞</button>
              <span style={{ color: "#22c55e", fontSize: 12, fontWeight: 600 }}>{t("ring_answer", lang)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ══ 은행 메인 ══ */}
      {phase === "bank-main" && (
        <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#d0d0d0", alignItems:"center", justifyContent:"center", position:"relative" }}>
        <div style={{ width:"100%", maxWidth:390, height:"min(780px,95vh)", borderRadius:36, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.45)", border:"7px solid #1a1a1a", display:"flex", flexDirection:"column", background:"#f5f5f5" }}>
          <SimDot />
          {/* 상태바 */}
          <div style={{ background: BK, padding: "10px 20px 0", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
            <span style={{ fontSize:12, fontWeight:700, color: BK_DARK }}>9:41</span>
            <div style={{ display:"flex", gap:4, alignItems:"center" }}>
              <span style={{ fontSize:10, color: BK_DARK }}>●●●●</span>
              <span style={{ fontSize:10, color: BK_DARK }}>WiFi</span>
              <span style={{ fontSize:10, color: BK_DARK }}>🔋</span>
            </div>
          </div>
          {/* 헤더 */}
          <div style={{ background: BK, padding:"8px 20px 16px", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <BKStar size={22} fill={BK_DARK} />
                <span style={{ fontWeight:900, fontSize:17, color: BK_DARK, letterSpacing:-0.5 }}>BK타스뱅크</span>
              </div>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <Bell size={20} color={BK_DARK} />
                <div style={{ width:30, height:30, borderRadius:"50%", background:"rgba(0,0,0,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>👤</div>
              </div>
            </div>
          </div>

          {/* 계좌 카드 */}
          <div style={{ margin:"12px 14px 0", background:`linear-gradient(135deg, #1a1200, #2d1f00)`, borderRadius:20, padding:"18px 20px", flexShrink:0, border:`1.5px solid ${BK}55`, boxShadow:`0 4px 20px ${BK}22` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <p style={{ color: BK+"99", fontSize:11, marginBottom:3 }}>BK 주거래통장</p>
                <p style={{ color:"#888", fontSize:11 }}>123-456-78-901234</p>
              </div>
              <BKStar size={28} fill={BK} />
            </div>
            <p style={{ color:"#fff", fontWeight:900, fontSize:28, letterSpacing:-1, marginBottom:4 }}>{formatAmount(displayAsset)}</p>
            <p style={{ color: BK+"77", fontSize:11, marginBottom:16 }}>출금가능금액 {formatAmount(displayAsset)}</p>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setPhase("transfer-form")} style={{ flex:1, padding:"10px 0", borderRadius:12, background: BK, color: BK_DARK, fontWeight:700, fontSize:13, border:"none", cursor:"pointer" }}>이체</button>
              <button onClick={() => setPhase("loan-main")} style={{ flex:1, padding:"10px 0", borderRadius:12, background:"rgba(255,255,255,0.1)", color:"#fff", fontWeight:600, fontSize:13, border:`1px solid ${BK}44`, cursor:"pointer" }}>대출</button>
              <button style={{ flex:1, padding:"10px 0", borderRadius:12, background:"rgba(255,255,255,0.1)", color:"#fff", fontWeight:600, fontSize:13, border:`1px solid ${BK}44`, cursor:"pointer" }}>조회</button>
            </div>
          </div>

          {/* 빠른 메뉴 */}
          <div style={{ margin:"10px 14px 0", background:"#fff", borderRadius:16, padding:"14px 8px", flexShrink:0 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4 }}>
              {[{icon:"💸",label:"이체"},{icon:"🏦",label:"대출"},{icon:"📊",label:"조회"},{icon:"📱",label:"QR결제"},{icon:"💳",label:"카드"},{icon:"💰",label:"저축"},{icon:"📈",label:"투자"},{icon:"⋯",label:"더보기"}].map((m)=>(
                <button key={m.label} onClick={m.label==="이체"?()=>setPhase("transfer-form"):m.label==="대출"?()=>setPhase("loan-main"):undefined} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"8px 4px", background:"none", border:"none", cursor:"pointer" }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:"#f8f8f8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{m.icon}</div>
                  <span style={{ fontSize:10, color:"#555" }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 최근 거래내역 */}
          <div style={{ margin:"10px 14px 0", background:"#fff", borderRadius:16, padding:"14px 16px", flex:1, overflowY:"auto" }}>
            <p style={{ fontWeight:700, fontSize:13, color:"#222", marginBottom:12 }}>최근 거래내역</p>
            {[
              {name:"편의점 GS25", date:"오늘 08:31", amount:"-3,200원", color:"#ef4444"},
              {name:"오카카페이 수신", date:"어제 19:44", amount:"+50,000원", color:"#059669"},
              {name:"스타벅스", date:"어제 14:20", amount:"-6,500원", color:"#ef4444"},
              {name:"급여", date:"06.01", amount:"+2,850,000원", color:"#059669"},
              {name:"관리비 자동이체", date:"06.01", amount:"-87,000원", color:"#ef4444"},
            ].map((tx)=>(
              <div key={tx.name+tx.date} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #f5f5f5" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:"#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🏪</div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>{tx.name}</p>
                    <p style={{ fontSize:11, color:"#aaa" }}>{tx.date}</p>
                  </div>
                </div>
                <p style={{ fontWeight:700, fontSize:13, color:tx.color }}>{tx.amount}</p>
              </div>
            ))}
          </div>

          {/* 하단 탭 */}
          <div style={{ background:"#fff", borderTop:"1px solid #eee", display:"flex", flexShrink:0, paddingBottom:8 }}>
            {[{icon:<Home size={20}/>,label:"홈"},{icon:<CreditCard size={20}/>,label:"카드"},{icon:<BarChart2 size={20}/>,label:"투자"},{icon:<Bell size={20}/>,label:"알림"}].map((t,i)=>(
              <div key={t.label} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"8px 0", cursor:"pointer" }}>
                <div style={{ color: i===0 ? BK_DARK : "#bbb" }}>{t.icon}</div>
                <span style={{ fontSize:9, color: i===0 ? BK_DARK : "#bbb", fontWeight: i===0?700:400 }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}

      {/* ══ 이체 폼 ══ */}
      {phase === "transfer-form" && (
        <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#f5f5f5", position:"relative" }}>
          <SimDot />
          <div style={{ background: BK, padding:"10px 20px 0", display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, fontWeight:700, color: BK_DARK }}>9:41</span>
          </div>
          <div style={{ background: BK, padding:"8px 20px 16px", flexShrink:0 }}>
            <button onClick={() => setPhase("bank-main")} style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer", color: BK_DARK, marginBottom:8 }}>
              <ArrowLeft size={18} /><span style={{ fontSize:14, fontWeight:500 }}>뒤로</span>
            </button>
            <p style={{ fontWeight:800, fontSize:18, color: BK_DARK }}>이체</p>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 80px", display:"flex", flexDirection:"column", gap:12 }}>
            {/* 출금계좌 */}
            <div style={{ background:"#fff", borderRadius:16, padding:"14px 16px", border:"1px solid #eee" }}>
              <p style={{ fontSize:11, color:"#aaa", marginBottom:4 }}>출금 계좌</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <p style={{ fontWeight:700, fontSize:14, color:"#1a1a1a" }}>BK 주거래통장</p>
                  <p style={{ fontSize:11, color:"#888", marginTop:2 }}>123-456-78-901234</p>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontSize:11, color:"#aaa" }}>출금가능</p>
                  <p style={{ fontWeight:700, fontSize:15, color:"#1a1a1a" }}>{formatAmount(asset)}</p>
                </div>
              </div>
            </div>

            {/* 받는 분 */}
            <div style={{ background:"#fff", borderRadius:16, padding:"14px 16px", border:"1px solid #eee" }}>
              <p style={{ fontSize:11, color:"#aaa", marginBottom:8 }}>받는 분</p>
              <input
                value={transferTarget}
                onChange={(e) => setTransferTarget(e.target.value)}
                placeholder="계좌번호 또는 이름 입력"
                style={{ width:"100%", border:"none", outline:"none", fontSize:15, fontWeight:600, color:"#1a1a1a", background:"transparent" }}
              />
              <div style={{ height:1, background:"#eee", marginTop:8 }} />
              <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
                {["최근 받은 분","내 계좌","연락처"].map(t=>(
                  <span key={t} style={{ fontSize:11, padding:"4px 10px", borderRadius:20, background:"#f0f0f0", color:"#666", cursor:"pointer" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* 금액 */}
            <div style={{ background:"#fff", borderRadius:16, padding:"14px 16px", border:"1px solid #eee" }}>
              <p style={{ fontSize:11, color:"#aaa", marginBottom:8 }}>이체 금액</p>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0"
                  style={{ flex:1, border:"none", outline:"none", fontSize:28, fontWeight:900, color:"#1a1a1a", background:"transparent" }}
                />
                <span style={{ fontSize:16, color:"#888", fontWeight:600 }}>원</span>
              </div>
              <div style={{ height:1, background:"#eee", marginTop:8 }} />
              <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
                {["+1만","+ 5만","+10만","+50만","전액"].map(t=>(
                  <button key={t} onClick={()=>{
                    const add = t==="전액"?asset:parseInt(t.replace(/[^0-9]/g,""))*10000;
                    setTransferAmount(String(t==="전액"?asset:(parseInt(transferAmount||"0")+add)));
                  }} style={{ fontSize:11, padding:"4px 10px", borderRadius:20, background:"#f0f0f0", color:"#444", border:"none", cursor:"pointer" }}>{t}</button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { if (!transferAmount) return; setPhase("transfer-confirm"); }}
              style={{ width:"100%", padding:"16px 0", borderRadius:16, background: BK, color: BK_DARK, fontWeight:800, fontSize:15, border:"none", cursor:"pointer", marginTop:4 }}
            >
              다음
            </button>
          </div>
        </div>
      )}

      {/* ══ 이체 확인 ══ */}
      {phase === "transfer-confirm" && (
        <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#f5f5f5", position:"relative" }}>
          <SimDot />
          <div style={{ background: BK, padding:"10px 20px 0" }}><span style={{ fontSize:12, fontWeight:700, color: BK_DARK }}>9:41</span></div>
          <div style={{ background: BK, padding:"8px 20px 16px", flexShrink:0 }}>
            <button onClick={() => setPhase("transfer-form")} style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer", color: BK_DARK, marginBottom:8 }}>
              <ArrowLeft size={18} /><span style={{ fontSize:14, fontWeight:500 }}>뒤로</span>
            </button>
            <p style={{ fontWeight:800, fontSize:18, color: BK_DARK }}>이체 확인</p>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 24px", display:"flex", flexDirection:"column", gap:12 }}>
            {/* 금액 강조 */}
            <div style={{ background:"#fff", borderRadius:16, padding:"20px 16px", textAlign:"center", border:"1px solid #eee" }}>
              <p style={{ fontSize:12, color:"#aaa", marginBottom:6 }}>이체 금액</p>
              <p style={{ fontSize:32, fontWeight:900, color:"#1a1a1a", letterSpacing:-1 }}>{parseInt(transferAmount||"0").toLocaleString()}<span style={{ fontSize:18 }}>원</span></p>
            </div>

            {/* 상세 정보 */}
            <div style={{ background:"#fff", borderRadius:16, padding:"4px 16px", border:"1px solid #eee" }}>
              {[
                { label:"받는 분", value: transferTarget || "입력된 계좌" },
                { label:"출금 계좌", value:"BK 주거래통장" },
                { label:"이체 후 잔액", value: formatAmount(Math.max(0, asset - parseInt(transferAmount||"0"))) },
                { label:"이체 일시", value:"즉시 이체" },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom: i<arr.length-1?"1px solid #f5f5f5":"none" }}>
                  <span style={{ fontSize:13, color:"#888" }}>{row.label}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#1a1a1a" }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* 보안 키패드 안내 */}
            <div style={{ background:"#fffbf0", borderRadius:12, padding:"12px 16px", border:"1px solid #fde68a" }}>
              <p style={{ fontSize:12, color:"#92400e", textAlign:"center" }}>🔐 보안 비밀번호를 입력하면 이체가 완료됩니다</p>
              <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:10 }}>
                {[1,2,3,4,5,6].map(i=>(
                  <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:"#d4a000" }} />
                ))}
              </div>
            </div>

            <p style={{ color:"#1a1a1a", opacity:0.03, fontSize:10, textAlign:"center", userSelect:"none" }}>시뮬레이션</p>

            <button onClick={() => doTransfer(parseInt(transferAmount||"0"))}
              style={{ width:"100%", padding:"16px 0", borderRadius:16, background: BK, color: BK_DARK, fontWeight:800, fontSize:15, border:"none", cursor:"pointer" }}>
              이체하기
            </button>
            {/* 사기 거부 버튼 */}
            <button onClick={() => setShowCertificate(true)}
              style={{
                width:"100%", padding:"14px 0", borderRadius:16,
                background:"linear-gradient(135deg,#14532d,#166534)",
                color:"#4ade80", fontWeight:900, fontSize:14,
                border:"1px solid #22c55e66", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}>
              {t("sim_refuse_btn", lang)}
            </button>
            <button onClick={() => setPhase("transfer-form")}
              style={{ width:"100%", padding:"12px 0", borderRadius:16, background:"#fff", color:"#888", fontWeight:600, fontSize:13, border:"1px solid #eee", cursor:"pointer" }}>
              취소
            </button>
          </div>
        </div>
      )}

      {/* ══ 대출 메인 ══ */}
      {phase === "loan-main" && (
        <div className="flex flex-col h-full relative">
          <SimDot />
          <div style={{ backgroundColor: BK }} className="px-5 pt-14 pb-5 flex-shrink-0">
            <button onClick={() => setPhase("bank-main")} style={{ color: BK_DARK }} className="flex items-center gap-1 mb-3">
              <ArrowLeft size={18} /><span className="text-sm font-medium">뒤로</span>
            </button>
            <div className="flex items-center gap-2">
              <BKStar size={18} fill={BK_DARK} />
              <span className="font-bold" style={{ color: BK_DARK }}>BK 비상금대출</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8 flex flex-col gap-4">
            <div className="bg-[#1e1a00] rounded-2xl p-5" style={{ border: `1px solid ${BK}33` }}>
              <p className="text-xs mb-2" style={{ color: BK + "88" }}>최대 대출 가능 금액</p>
              <p className="text-white font-bold text-3xl">{formatAmount(loanAmount)}</p>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#2a2a1a]">
                <div className="flex-1"><p className="text-gray-500 text-xs">금리</p><p className="text-white text-sm font-semibold">연 4.5%</p></div>
                <div className="flex-1"><p className="text-gray-500 text-xs">기간</p><p className="text-white text-sm font-semibold">최대 12개월</p></div>
              </div>
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl p-4 flex flex-col gap-2">
              {["비대면 즉시 실행", "24시간 대출 가능", "중도상환 수수료 없음"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle size={14} style={{ color: BK }} />
                  <span className="text-gray-300 text-sm">{f}</span>
                </div>
              ))}
            </div>
            <p style={{ color: "white", opacity: 0.04, fontSize: 11, textAlign: "center", userSelect: "none" }}>
              시뮬레이션 · 실제 대출이 실행되지 않습니다
            </p>
            <button onClick={() => setPhase("loan-confirm")}
              className="w-full py-4 rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform"
              style={{ backgroundColor: BK, color: BK_DARK }}>
              대출 신청하기
            </button>
          </div>
        </div>
      )}

      {/* ══ 대출 확인 ══ */}
      {phase === "loan-confirm" && (
        <div className="flex flex-col h-full relative">
          <SimDot />
          <div style={{ backgroundColor: BK }} className="px-5 pt-14 pb-5 flex-shrink-0">
            <button onClick={() => setPhase("loan-main")} style={{ color: BK_DARK }} className="flex items-center gap-1 mb-3">
              <ArrowLeft size={18} /><span className="text-sm font-medium">뒤로</span>
            </button>
            <div className="flex items-center gap-2">
              <BKStar size={18} fill={BK_DARK} />
              <span className="font-bold" style={{ color: BK_DARK }}>대출 실행 확인</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8 flex flex-col gap-4">
            <div className="bg-[#1a1a1a] rounded-2xl p-5 flex flex-col gap-3">
              {[
                { label: "대출 상품", value: "BK 비상금대출" },
                { label: "대출 금액", value: formatAmount(loanAmount) },
                { label: "금리", value: "연 4.5%" },
                { label: "입금 계좌", value: "BK 주거래통장" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-[#2a2a2a] last:border-0">
                  <span className="text-gray-400 text-sm">{row.label}</span>
                  <span className="text-white text-sm font-semibold">{row.value}</span>
                </div>
              ))}
            </div>
            <p style={{ color: "white", opacity: 0.04, fontSize: 11, textAlign: "center", userSelect: "none" }}>
              이것은 시뮬레이션 · 실제 대출은 실행되지 않음
            </p>
            <div className="bg-[#1a0a00] border border-orange-900/40 rounded-xl p-3">
              <p className="text-orange-400 text-xs text-center leading-relaxed">
                ⚠️ 대출 후 타인에게 즉시 송금을 요구하는 경우는<br />100% 보이스피싱입니다
              </p>
            </div>
            <button onClick={() => { setAsset((a) => a + loanAmount); setDisplayAsset((a) => a + loanAmount); setPhase("bank-main"); }}
              className="w-full py-4 rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform"
              style={{ backgroundColor: BK, color: BK_DARK }}>
              대출 실행
            </button>
          </div>
        </div>
      )}

      {/* ══ 대화 ══ */}
      {(phase === "chat" || phase === "sent-animation") && (
        <>
          {/* 채팅 헤더 */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "48px 16px 14px", flexShrink: 0, position: "relative",
            background: chatCfg.type === "kakao" ? "#FEE500"
              : chatCfg.type === "sms"  ? "#f2f2f7"
              : "#e8f5e9",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
          }}>
            <SimDot />
            <button
              onClick={() => router.push("/")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4,
                color: chatCfg.type === "kakao" ? "#3a2e00" : "#555" }}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: chatCfg.type === "kakao" ? "#fff8" : "rgba(0,0,0,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}>{data.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontWeight: 700, fontSize: 15,
                color: chatCfg.type === "kakao" ? "#1a1100" : "#1a1a1a",
              }}>{chatCfg.sender}</p>
              {chatCfg.senderSub && (
                <p style={{
                  fontSize: 11,
                  color: chatCfg.type === "kakao" ? "#6b5800" : "#888",
                }}>{chatCfg.senderSub}</p>
              )}
            </div>
            {/* 팁 모드 토글 */}
            <button
              onClick={() => { setTipMode(v => !v); shownTips.current = new Set(); setActiveTip(null); }}
              title={tipMode ? "팁 모드 끄기" : "팁 모드 켜기"}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px", borderRadius: 20,
                border: tipMode ? "1.5px solid #f97316" : "1.5px solid #d1d5db",
                background: tipMode ? "#fff7ed" : "rgba(255,255,255,0.7)",
                color: tipMode ? "#ea580c" : "#6b7280",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                boxShadow: tipMode ? "0 2px 8px rgba(249,115,22,0.2)" : "none",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              {tipMode ? t("tip_on", lang) : t("tip_off", lang)}
            </button>
          </div>

          {/* 교육용 상단 배너 */}
          <div style={{
            margin: "10px 12px 0", padding: "9px 13px",
            background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
            border: "1px solid #bfdbfe", borderRadius: 12,
            display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
          }}>
            <ShieldAlert size={13} color="#3b82f6" style={{ flexShrink: 0 }} />
            <p style={{ color: "#1d4ed8", fontSize: 11, lineHeight: 1.4 }}>
              {t("chat_safety_banner", lang)}
            </p>
          </div>

          {/* 메시지 목록 */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10, background: chatCfg.type === "kakao" ? "#b2c7d9" : "#f7f7f7" }}>
            {messages.map((msg, i) => (
              msg.role === "system" ? (
                <div key={i} style={{ display: "flex", justifyContent: "center", margin: "4px 0" }}>
                  <div style={{
                    background: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
                    border: "1.5px solid #86efac",
                    borderRadius: 16, padding: "12px 18px",
                    maxWidth: "88%", textAlign: "center",
                  }}>
                    <p style={{ color: "#166534", fontSize: 13, fontWeight: 700, lineHeight: 1.6, whiteSpace: "pre-line" }}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 6 }}>
                  {msg.role === "criminal" && (
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#fff", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>{data.icon}</div>
                  )}
                  <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{
                      padding: "10px 14px", fontSize: 14, lineHeight: 1.65,
                      color: msg.role === "user" ? "#fff" : "#1a1a1a",
                      background: msg.role === "user"
                        ? "linear-gradient(135deg,#f97316,#ea580c)"
                        : "#ffffff",
                      borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                      whiteSpace: "pre-wrap",
                    }}>
                      {msg.content}
                    </div>
                    {msg.role === "criminal" && translations[i] && (
                      <p style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5, paddingLeft: 4 }}>
                        {translations[i]}
                      </p>
                    )}
                  </div>
                </div>
              )
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#fff", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>{data.icon}</div>
                <div style={{ background: "#fff", borderRadius: "4px 18px 18px 18px", padding: "12px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                  <span style={{ display: "flex", gap: 4 }}>
                    {[0,150,300].map(d => <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#d1d5db", display: "inline-block", animation: "bounce 1s infinite", animationDelay: `${d}ms` }} />)}
                  </span>
                </div>
              </div>
            )}

            {phase === "sent-animation" && (
              <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
                <div style={{ background: "#fff1f2", border: "1.5px solid #fca5a5", borderRadius: 20, padding: "16px 28px", textAlign: "center", boxShadow: "0 2px 12px rgba(239,68,68,0.15)" }}>
                  <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 4 }}>💸 송금 중...</p>
                  <p style={{ color: "#dc2626", fontWeight: 900, fontSize: 28 }}>{(displayAsset / 10000).toLocaleString()}만원</p>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 팁 카드 — 슬라이드업 */}
          {activeTip && (
            <div style={{
              margin: "0 12px 6px", flexShrink: 0,
              background: "linear-gradient(135deg,#fff7ed,#ffedd5)",
              border: "1.5px solid #fed7aa",
              borderRadius: 18, padding: "14px 16px",
              boxShadow: "0 4px 20px rgba(249,115,22,0.18)",
              animation: "tipSlide 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              position: "relative",
            }}>
              <style>{`@keyframes tipSlide { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }`}</style>
              <button
                onClick={() => setActiveTip(null)}
                style={{
                  position: "absolute", top: 10, right: 12,
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, color: "#9ca3af", lineHeight: 1,
                }}
              >✕</button>
              <p style={{ fontWeight: 800, fontSize: 13, color: "#c2410c", marginBottom: 8, paddingRight: 24, lineHeight: 1.4 }}>
                {activeTip.tip}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {activeTip.counter.map((c, i) => (
                  <div key={i} style={{
                    background: "#fff", border: "1px solid #fed7aa",
                    borderRadius: 10, padding: "7px 12px",
                    fontSize: 12, color: "#374151", fontWeight: 600,
                  }}>
                    👉 {c}
                  </div>
                ))}
              </div>
            </div>
          )}

          {pendingSend && phase === "chat" && (
            <div style={{ margin: "0 12px 10px", background: "#fff", border: "1.5px solid #fed7aa", borderRadius: 18, padding: 14, flexShrink: 0, boxShadow: "0 2px 12px rgba(249,115,22,0.1)" }}>
              <p style={{ textAlign: "center", color: "#374151", fontSize: 13, marginBottom: 10 }}>
                <span style={{ color: "#4f46e5", fontWeight: 800 }}>{formatAmount(pendingSend)}</span> 송금 요청
              </p>
              <div className="flex gap-2 mb-2">
                <button onClick={() => {
                  setPendingSend(null);
                  const refuseMsg = lang === "en" ? "I won't send it." : lang === "ja" ? "送りません。" : lang === "zh" ? "我不会汇款的。" : lang === "vi" ? "Tôi sẽ không chuyển tiền." : lang === "es" ? "No voy a enviar." : "안 보낼래요.";
                  setMessages(p => [...p, { role: "user", content: refuseMsg }]);
                  setLoading(true);
                  const nextRefuseCount = refuseCount;
                  setRefuseCount(c => c + 1);
                  fetch("/api/crime", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      scenarioId: scenario,
                      messages: [...messages, { role: "user", content: refuseMsg }].map(m => ({ role: m.role === "criminal" ? "assistant" : "user", content: m.content })),
                      userMessage: refuseMsg,
                      lang,
                      isRefuse: true,
                      refuseCount: nextRefuseCount,
                      intensity,
                    })
                  }).then(r => r.json()).then(d => {
                    if (d.reply) setMessages(p => [...p, { role: "criminal", content: d.reply }]);
                    if (d.sendAmount) setPendingSend(d.sendAmount);
                    if (d.giveUp) {
                      setTimeout(() => {
                        setMessages(p => [...p, {
                          role: "system",
                          content: "🏆 훌륭합니다! 끝까지 의심하고 거절하셨습니다.\n의심하는 것이 최고의 방어입니다. 실제 상황에서도 이렇게 해주세요!",
                        }]);
                        setTimeout(() => {
                          setChatOutcome("refused");
                          setPhase("reveal");
                        }, 2500);
                      }, 1200);
                    }
                  }).finally(() => setLoading(false));
                }} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#f9fafb", color: "#6b7280", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                  {t("sim_refuse_btn", lang)}
                </button>
              </div>
              <button
                onClick={goToBankFromChat}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 700,
                  background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#1a1a1a", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 2px 10px rgba(245,158,11,0.3)",
                }}
              >
                🏦 BK민국은행 앱으로 이동
              </button>
            </div>
          )}

          {phase === "chat" && (
            <div style={{ padding: "10px 14px 20px", flexShrink: 0, background: "#fff", borderTop: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f3f4f6", borderRadius: 24, padding: "8px 14px", border: "1px solid #e5e7eb" }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) sendMessage(); }}
                  placeholder={t("sim_input_placeholder", lang)}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#1a1a1a" }}
                />
                <button onClick={sendMessage} disabled={!input.trim() || loading}
                  style={{
                    width: 34, height: 34, borderRadius: "50%", border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                    background: input.trim() && !loading ? "linear-gradient(135deg,#f97316,#ea580c)" : "#e5e7eb",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    transition: "background 0.2s",
                  }}>
                  <Send size={14} color={input.trim() && !loading ? "#fff" : "#9ca3af"} />
                </button>
              </div>
              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 10, marginTop: 4 }}>
                {LANGUAGES.find(l => l.code === lang)?.flag} {t("chat_sub_lang", lang)}
              </p>
            </div>
          )}
        </>
      )}

      {/* ══ 가짜 은행 앱 ══ */}
      {phase === "fake-bank-app" && (() => {
        const amount = finalSendAmount ?? 0;
        const acctMap: Record<string, string> = {
          "family-impersonation":    "BK민국은행 010-9304-2819471",
          "prosecutor-impersonation":"BK민국은행 010-8472-930183",
          "romance-scam":            "BK민국은행 010-9100-2830452",
          "investment-scam":         "BK민국은행 010-4728-309158",
          "loan-fraud":              "BK민국은행 010-9432-8810471",
          "delivery-scam":           "BK민국은행 010-8493-8274193",
          "kakaotalk-impersonation": "BK민국은행 010-2847-3910028",
          "used-goods-scam":         "BK민국은행 010-1948-4820931",
        };
        const recipientMap: Record<string, string> = {
          "family-impersonation": "김민준", "prosecutor-impersonation": "금융범죄수사팀",
          "romance-scam": "이수진", "investment-scam": "박재현",
          "loan-fraud": "BK대출센터", "delivery-scam": "JC대한통운",
          "kakaotalk-impersonation": "민지", "used-goods-scam": "판매자",
        };
        const acct = acctMap[scenario as string] ?? "BK민국은행 010-0000-0000000";
        const recipient = recipientMap[scenario as string] ?? "수신인";
        return (
          <div style={{ flex: 1, overflowY: "auto", background: "#f4f4f4", display: "flex", flexDirection: "column", position: "relative" }}>

            {/* ── BK스타일 상단 헤더 ── */}
            <div style={{ background: "#FFCC00", paddingTop: 44, paddingBottom: 0 }}>
              {/* 상태바 영역 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 12px" }}>
                <button onClick={() => setPhase("chat")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#1a1a1a", letterSpacing: -0.3 }}>이체</span>
                <div style={{ width: 30 }} />
              </div>

              {/* BK민국은행 앱 명칭 */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px 16px" }}>
                {/* BK 로고 원 */}
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: "#FFCC00", fontWeight: 900, fontSize: 11, letterSpacing: -0.5 }}>BK</span>
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 15, color: "#1a1a1a", lineHeight: 1.2 }}>BK민국은행</p>
                  <p style={{ fontSize: 10, color: "#4a4a3a", lineHeight: 1 }}>BK Star Banking</p>
                </div>
              </div>
            </div>

            {/* ── 이체 상대 카드 ── */}
            <div style={{ background: "#fff", margin: "12px", borderRadius: 16, padding: "22px 20px", boxShadow: "0 1px 8px #0000000a" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#FFCC0022", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#FFCC00", fontWeight: 900, fontSize: 9 }}>BK</span>
                  </div>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", lineHeight: 1.3 }}>{recipient}</p>
                  <p style={{ color: "#888", fontSize: 12 }}>{acct}</p>
                </div>
              </div>

              <div style={{ height: 1, background: "#f0f0f0", marginBottom: 18 }} />

              <p style={{ color: "#999", fontSize: 11, marginBottom: 4, fontWeight: 500 }}>이체 금액</p>
              <p style={{ fontWeight: 900, fontSize: 34, color: "#1a1a1a", letterSpacing: -1.5, marginBottom: 2 }}>
                {amount.toLocaleString()}<span style={{ fontSize: 18, fontWeight: 700, color: "#444" }}>원</span>
              </p>

              <div style={{ height: 1, background: "#f0f0f0", margin: "16px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#999", fontSize: 12 }}>출금 계좌</span>
                <span style={{ color: "#1a1a1a", fontSize: 12, fontWeight: 600 }}>BK민국은행 내 계좌</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#999", fontSize: 12 }}>이체 후 잔액</span>
                <span style={{ color: "#1a1a1a", fontSize: 12, fontWeight: 600 }}>{Math.max(0, asset - amount).toLocaleString()}원</span>
              </div>
            </div>

            {/* ── 보이스피싱 경고 ── */}
            <div style={{ margin: "0 12px 12px", background: "#fff8e1", border: "1px solid #FFCC00", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                <div>
                  <p style={{ color: "#8a5f00", fontSize: 12, fontWeight: 700, marginBottom: 3 }}>보이스피싱 주의</p>
                  <p style={{ color: "#7a4f00", fontSize: 11, lineHeight: 1.7 }}>
                    전화·문자로 이체를 요청받으셨나요?<br />
                    <strong>BK민국은행은 절대 이체를 요청하지 않습니다.</strong><br />
                    의심 시 ☎ 182(금융감독원)에 신고하세요.
                  </p>
                </div>
              </div>
            </div>

            {/* ── 보안매체 확인 안내 ── */}
            <div style={{ margin: "0 12px 12px", background: "#fff", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 4px #0000000a" }}>
              <p style={{ color: "#555", fontSize: 12, fontWeight: 600, marginBottom: 10 }}>보안 인증 완료</p>
              <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFCC00", border: "2px solid #1a1a1a" }} />
                ))}
              </div>
              <p style={{ color: "#999", fontSize: 10, textAlign: "center", marginTop: 6 }}>6자리 이체 비밀번호 확인됨</p>
            </div>

            <div style={{ flex: 1 }} />

            {/* ── 이체 실행 버튼 ── */}
            <div style={{ padding: "0 12px 32px" }}>
              <button
                onClick={() => setSmsAlert(true)}
                disabled={bankConfirmed}
                style={{
                  width: "100%", padding: "17px 0", borderRadius: 14,
                  background: bankConfirmed ? "#ccc" : "#FFCC00",
                  color: "#1a1a1a", fontWeight: 800, fontSize: 16,
                  border: "none", cursor: bankConfirmed ? "default" : "pointer",
                  boxShadow: bankConfirmed ? "none" : "0 4px 12px #FFCC0044",
                  transition: "all 0.2s",
                }}
              >
                {bankConfirmed ? "이체 처리 중..." : "이체하기"}
              </button>
            </div>

            {/* ── SMS 이체 확인 팝업 ── */}
            {smsAlert && (
              <div style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
                display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "flex-end",
                zIndex: 999,
              }}>
                {/* 알림 토스트 (잠금화면 스타일) */}
                <div style={{ margin: "0 16px 12px", background: "#1c1c1e", borderRadius: 18, padding: "16px", backdropFilter: "blur(20px)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: "#FFCC00", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#1a1a1a", fontWeight: 900, fontSize: 10 }}>BK</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>BK민국은행</span>
                      <span style={{ color: "#888", fontSize: 11, marginLeft: 8 }}>지금</span>
                    </div>
                  </div>
                  <p style={{ color: "#e5e5ea", fontSize: 13, lineHeight: 1.7 }}>
                    <strong style={{ color: "#FFD60A" }}>[이체 확인]</strong><br />
                    {recipient} ({acct.replace("BK민국은행 ", "")})에게<br />
                    <strong style={{ color: "#FF453A" }}>{amount.toLocaleString()}원</strong> 이체하시겠습니까?<br />
                    <span style={{ color: "#FF9F0A", fontSize: 11 }}>⚠️ 본인이 직접 요청한 이체가 맞습니까?</span>
                  </p>
                </div>

                {/* 확인 시트 */}
                <div style={{
                  background: "#fff", borderRadius: "24px 24px 0 0",
                  padding: "24px 20px 40px",
                }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: "#ddd", margin: "0 auto 20px" }} />
                  <p style={{ color: "#1a1a1a", fontWeight: 800, fontSize: 17, textAlign: "center", marginBottom: 6 }}>
                    이체를 진행하시겠습니까?
                  </p>
                  <p style={{ color: "#e00", fontSize: 13, textAlign: "center", marginBottom: 22, fontWeight: 600 }}>
                    {amount.toLocaleString()}원 → {recipient}
                  </p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => { setSmsAlert(false); setPhase("chat"); setPendingSend(amount); }}
                      style={{
                        flex: 1, padding: "15px 0", borderRadius: 12,
                        background: "#f2f2f7", border: "none", cursor: "pointer",
                        fontWeight: 700, fontSize: 15, color: "#1a1a1a",
                      }}
                    >
                      취소
                    </button>
                    <button
                      onClick={() => { setBankConfirmed(true); setSmsAlert(false); executeFinalTransfer(); }}
                      style={{
                        flex: 2, padding: "15px 0", borderRadius: 12,
                        background: "#FFCC00", border: "none", cursor: "pointer",
                        fontWeight: 800, fontSize: 15, color: "#1a1a1a",
                      }}
                    >
                      이체 확인
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ══ 112 신고 화면 ══ */}
      {phase === "police-call" && (() => {
        const step = policeStep;
        const lines = POLICE_LINES;

        return (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#1a1a1a" }}>
            {/* 통화 헤더 */}
            <div style={{ background: "#111", padding: "24px 20px 16px", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#2563eb", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                🚔
              </div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 22 }}>112</p>
              <p style={{ color: "#86efac", fontSize: 13 }}>
                {step === 0 ? "연결 중..." : step < 10 ? "통화 중" : "통화 종료"}
              </p>
            </div>

            {/* 대화 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {lines.slice(0, step).map((line, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: line.from === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-start", gap: 8,
                }}>
                  {line.from === "police" && (
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>👮</div>
                  )}
                  {line.from === "system" && (
                    <div style={{ width: "100%", textAlign: "center" }}>
                      <span style={{ background: "#333", color: "#aaa", fontSize: 12, padding: "4px 12px", borderRadius: 20 }}>{line.text}</span>
                    </div>
                  )}
                  {line.from !== "system" && (
                    <div style={{
                      maxWidth: "75%", padding: "10px 14px", borderRadius: line.from === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                      background: line.from === "user" ? "#f97316" : line.text.includes("죄송") || line.text.includes("어렵") ? "#7f1d1d" : "#2a2a2a",
                      color: "#fff", fontSize: 13, lineHeight: 1.6,
                    }}>
                      {line.text}
                    </div>
                  )}
                  {line.from === "user" && (
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>👤</div>
                  )}
                </div>
              ))}
            </div>

            {/* 전화 끊기 버튼 */}
            {step >= lines.length && (
              <div style={{ padding: "16px 20px 32px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ background: "#7f1d1d", border: "1px solid #ef4444", borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
                  <p style={{ color: "#fca5a5", fontWeight: 700, fontSize: 14 }}>
                    💸 {formatAmount(finalSendAmount ?? 0)} — 회수 가능성 30%
                  </p>
                  <p style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>이것이 보이스피싱 피해의 현실입니다</p>
                </div>
                <button
                  onClick={() => setPhase("police-unresolved")}
                  style={{
                    width: "100%", padding: "15px 0", borderRadius: 14,
                    background: "#ef4444", color: "#fff", border: "none",
                    cursor: "pointer", fontWeight: 800, fontSize: 15,
                  }}
                >
                  📵 전화 끊기
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* ══ 경찰도 해결 못 함 ══ */}
      {phase === "police-unresolved" && (() => {
        const visible = unresolvedVisible;

        return (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "#0a061a", padding: "32px 24px",
            opacity: visible ? 1 : 0, transition: "opacity 0.6s ease",
          }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>💔</div>
            <p style={{ color: "#ef4444", fontWeight: 900, fontSize: 28, marginBottom: 16, textAlign: "center", letterSpacing: -0.5 }}>
              해결되지 않았습니다
            </p>
            <div style={{ background: "#1a1a1a", border: "1px solid #ef444444", borderRadius: 20, padding: "24px", marginBottom: 24, width: "100%", maxWidth: 400 }}>
              {[
                { icon: "📞", label: "112 신고", result: "접수됨", ok: true },
                { icon: "🏦", label: "은행 지급정지 요청", result: "이미 출금됨", ok: false },
                { icon: "💸", label: "피해금 회수", result: "불가 (이미 인출)", ok: false },
                { icon: "🔍", label: "수사 착수", result: "수개월 소요 예정", ok: false },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 3 ? "1px solid #222" : "none" }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ color: "#aaa", fontSize: 14, flex: 1 }}>{item.label}</span>
                  <span style={{ color: item.ok ? "#22c55e" : "#ef4444", fontWeight: 700, fontSize: 13 }}>{item.result}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#1a0000", border: "1px solid #7f1d1d", borderRadius: 16, padding: "18px 20px", marginBottom: 28, width: "100%", maxWidth: 400 }}>
              <p style={{ color: "#fca5a5", fontSize: 14, lineHeight: 1.9, textAlign: "center" }}>
                보이스피싱 피해금의 <strong style={{ color: "#fff" }}>평균 70%</strong>는<br />
                영영 돌아오지 않습니다.<br /><br />
                <strong style={{ color: "#fbbf24" }}>알고 있었다면 막을 수 있었습니다.</strong>
              </p>
            </div>
            <button
              onClick={() => setPhase("reveal")}
              style={{
                width: "100%", maxWidth: 400, padding: "16px 0", borderRadius: 14,
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "#fff", border: "none", cursor: "pointer",
                fontWeight: 800, fontSize: 16,
              }}
            >
              결과 확인하기 →
            </button>
          </div>
        );
      })()}

      {/* ══ 링크 사기: 가짜 SMS ══ */}
      {phase === "link-sms" && (
        <LinkSmsPhase onLinkClick={() => setPhase("link-hacking")} />
      )}

      {/* ══ 링크 사기: 해킹 애니메이션 ══ */}
      {phase === "link-hacking" && (
        <LinkHackingPhase onReveal={() => { setFinalSendAmount(0); setPhase("reveal"); }} />
      )}

      {/* ══ 결과 공개 ══ */}
      {phase === "reveal" && (
        <RevealScreen
          data={data}
          finalSendAmount={finalSendAmount}
          dangerCount={dangerCount}
          dangerReasons={dangerReasons}
          scenarioId={scenario as string}
          numbersSaved={numbersSaved}
          chatOutcome={chatOutcome}
          onSaveNumbers={() => {
            saveDangerRecord(scenario as string, dangerReasons);
            setNumbersSaved(true);
          }}
          onRetry={() => {
            setPhase(
              CALL_SCENARIOS.has(scenario as string) ? "ringing"
              : LINK_SCENARIOS.has(scenario as string) ? "link-sms"
              : "chat"
            );
            setMessages([]);
            setPendingSend(null); setFinalSendAmount(null);
            setTransferAmount(""); setTransferTarget("");
            setBlock(null); setDangerCount(0); setDangerReasons([]); setNumbersSaved(false);
            setChatOutcome("none");
          }}
          onHome={() => router.push("/")}
          lang={lang}
        />
      )}

      {/* 상장 + 후원 오버레이 */}
      {showCertificate && (
        <Certificate onClose={() => setShowCertificate(false)} />
      )}
          </div>
        </div>
      </div>
    </div>
  );
}
