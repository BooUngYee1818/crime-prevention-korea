"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Send, AlertTriangle, CheckCircle, ChevronRight, Bell, Home, CreditCard, BarChart2, ShieldAlert, Phone } from "lucide-react";
import { CRIME_SCENARIOS } from "@/lib/crimes";

type Phase =
  | "ringing"
  | "bank-main"
  | "transfer-form"
  | "transfer-confirm"
  | "loan-main"
  | "loan-confirm"
  | "chat"
  | "sent-animation"
  | "reveal";

// 시나리오별 채팅 스타일 설정
type ChatType = "kakao" | "sms" | "call";
const CHAT_CONFIG: Record<string, { type: ChatType; headerTitle: string; sender: string; senderSub?: string }> = {
  "family-impersonation":   { type: "kakao", headerTitle: "카카오톡", sender: "김민준", senderSub: "모르는 번호" },
  "prosecutor-impersonation": { type: "call", headerTitle: "전화 통화 중", sender: "02-530-4000", senderSub: "서울중앙지검 (사칭)" },
  "romance-scam":           { type: "kakao", headerTitle: "카카오톡", sender: "이수진", senderSub: "온라인 지인" },
  "investment-scam":        { type: "kakao", headerTitle: "카카오톡", sender: "박재현 ☆", senderSub: "전 직장동료" },
  "loan-fraud":             { type: "call",  headerTitle: "전화 통화 중", sender: "KB저축은행 상담", senderSub: "02-1234-5678" },
  "delivery-scam":          { type: "sms",   headerTitle: "메시지", sender: "CJ대한통운", senderSub: "+8210-0000-0000" },
  "kakaotalk-impersonation":{ type: "kakao", headerTitle: "카카오톡", sender: "민지 🌸", senderSub: "친구" },
  "used-goods-scam":        { type: "kakao", headerTitle: "카카오톡", sender: "당근 판매자", senderSub: "중고거래" },
};

// 전화형 시나리오는 ringing 단계부터 시작
const CALL_SCENARIOS = new Set(["prosecutor-impersonation", "loan-fraud"]);

interface Message {
  role: "user" | "criminal";
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

const KB = "#FFB300";
const KB_DARK = "#1a1100";

const FIRST_MESSAGES: Record<string, string> = {
  "family-impersonation": "엄마, 나야. 나 지금 휴대폰이 고장났어. 친구 폰 빌려서 연락하는 거야. 수리비가 100만원 나왔는데... 지금 현금이 없어서 그러는데 보내줄 수 있어?",
  "prosecutor-impersonation": "여보세요. 저는 서울중앙지검 수사관 김민수입니다. 귀하의 계좌가 범죄에 연루된 것으로 확인됐습니다. 지금 바로 통화 가능하십니까?",
  "romance-scam": "자기야 나야. 나 해외 출장 중인데 지갑을 잃어버렸어. 너무 무섭고 당황스러워. 호텔비도 없는데 어떡하지...",
  "investment-scam": "안녕하세요! 오늘 딱 마감인데요, 지금 입금하시면 한 달 뒤에 세 배 드릴 수 있어요. 100만원만 지금 보내주시면 됩니다!",
  "loan-fraud": "안녕하세요 고객님! KB저축은행 대출 상담사 이민준입니다. 고객님 신용등급에 맞는 특별 상품이 있어서 연락드렸습니다. 연 2.9%, 최대 2000만원 가능한데 지금 시간 있으세요?",
  "delivery-scam": "[CJ대한통운] 고객님의 택배(운송장 123456789)가 주소 불명확으로 배송 불가 상태입니다. 주소 확인 후 재배송 처리해 드리겠습니다. 확인 부탁드립니다.",
  "kakaotalk-impersonation": "야 나야. 잠깐 이야기 해도 돼? 나 지금 너무 급한 상황이야.",
  "used-goods-scam": "안녕하세요! 아이폰16 Pro 256GB 판매합니다. 개봉한지 3개월밖에 안됐고 상태 완전 새거에요. 85만원에 드릴게요. 관심 있으세요?",
};

function KBStar({ size = 24, fill = KB }: { size?: number; fill?: string }) {
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

function EmergencyBlock({ block, onClose, onReveal }: {
  block: BlockState;
  onClose: () => void;
  onReveal: () => void;
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

      {/* 경고 아이콘 */}
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "linear-gradient(135deg, #7f1d1d, #ef4444)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20, boxShadow: "0 0 40px #ef444460",
      }}>
        <ShieldAlert size={40} color="#fff" />
      </div>

      <p style={{ color: "#ef4444", fontWeight: 900, fontSize: 22, marginBottom: 8, textAlign: "center" }}>
        🚨 잠깐, 멈추세요!
      </p>

      {isLeave && (
        <>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 12, textAlign: "center" }}>
            다른 앱이나 은행으로 이동하려 하세요?
          </p>
          <div style={{
            background: "#1a0000", border: "1px solid #ef444466", borderRadius: 16,
            padding: "14px 18px", marginBottom: 20, width: "100%",
          }}>
            <p style={{ color: "#fca5a5", fontSize: 14, lineHeight: 1.7, textAlign: "center" }}>
              지금 화면은 <strong>범죄 예방 시뮬레이션</strong>입니다.<br />
              실제 은행 앱이나 송금 앱을 열어서<br />
              <strong style={{ color: "#ef4444" }}>절대 돈을 보내지 마세요.</strong>
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

      {/* 신고 번호 */}
      <div style={{
        background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 14,
        padding: "12px 20px", marginBottom: 20, width: "100%", textAlign: "center",
      }}>
        <p style={{ color: "#60a5fa", fontSize: 12, marginBottom: 4 }}>이미 돈을 보냈다면 즉시 신고</p>
        <p style={{ color: "#fff", fontWeight: 900, fontSize: 24 }}>경찰청 182</p>
        <p style={{ color: "#555", fontSize: 11, marginTop: 2 }}>24시간 운영 · 피해 즉시 신고</p>
      </div>

      <div style={{ display: "flex", gap: 10, width: "100%" }}>
        {!isLeave && (
          <button
            onClick={onReveal}
            style={{
              flex: 1, padding: "14px 0", borderRadius: 16,
              background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
              color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
            }}
          >
            교육 결과 보기
          </button>
        )}
        <button
          onClick={onClose}
          style={{
            flex: 1, padding: "14px 0", borderRadius: 16,
            background: "#1a1a1a", color: "#888",
            fontWeight: 600, fontSize: 14, border: "1px solid #2a2a2a", cursor: "pointer",
          }}
        >
          {isLeave ? "이 앱에 머물기" : "계속 체험하기"}
        </button>
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
  numbersSaved, onSaveNumbers, onRetry, onHome,
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
        background: "#0d0d0d", border: "2px solid #ef444499",
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
          <p style={{ color: "#22c55e", fontWeight: 800, fontSize: 16 }}>실제 돈은 나가지 않았습니다</p>
          <p style={{ color: "#16a34a", fontSize: 12, marginTop: 4 }}>범죄 예방 교육 시뮬레이션입니다</p>
        </div>
      </div>

      {/* 범죄 설명 */}
      <div style={{ background: "#1a1a1a", borderRadius: 18, padding: 16 }}>
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
          : "#131313",
        border: isDangerous ? "2px solid #3b82f6" : "1px solid #1e1e1e",
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
                background: "#0d0d0d", borderRadius: 14, padding: "12px",
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
          다시 체험
        </button>
        <button
          onClick={onHome}
          style={{
            flex: 1, padding: "14px 0", borderRadius: 16,
            background: "#534AB7", color: "#fff",
            border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          다른 시나리오
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

  const chatCfg = CHAT_CONFIG[scenario as string] ?? { type: "kakao" as ChatType, headerTitle: "카카오톡", sender: "알 수 없음" };
  const [phase, setPhase] = useState<Phase>(
    CALL_SCENARIOS.has(scenario as string) ? "ringing" : "chat"
  );
  const [asset, setAsset] = useState(15000000);
  const [displayAsset, setDisplayAsset] = useState(15000000);
  const [loanAmount] = useState(30000000);
  const [transferTarget, setTransferTarget] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingSend, setPendingSend] = useState<number | null>(null);
  const [finalSendAmount, setFinalSendAmount] = useState<number | null>(null);
  const [notif] = useState(false);
  const [block, setBlock] = useState<BlockState | null>(null);
  // 위험 행동 감지 누적
  const [dangerCount, setDangerCount] = useState(0);
  const [dangerReasons, setDangerReasons] = useState<string[]>([]);
  const [numbersSaved, setNumbersSaved] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  function recordDanger(reason: string) {
    setDangerCount((c) => c + 1);
    setDangerReasons((prev) => [...new Set([...prev, reason])]);
  }

  // chat 시작 시 첫 메시지 설정 (ringing에서 넘어올 때도 포함)
  useEffect(() => {
    if (phase === "chat" && messages.length === 0) {
      setMessages([{ role: "criminal", content: FIRST_MESSAGES[scenario as string] || "안녕하세요." }]);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // 페이지 이탈 감지 (실제 은행 앱·외부 사이트로 나가려 할 때)
  useEffect(() => {
    if (phase !== "chat") return;

    function handleVisibilityChange() {
      if (document.hidden) {
        setBlock({ type: "page-leave" });
        recordDanger("앱 이탈 시도 (실제 송금 앱 전환 의심)");
      }
    }

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
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
          messages: newMessages.map((m) => ({ role: m.role === "criminal" ? "assistant" : "user", content: m.content })),
          userMessage: userText,
        }),
      });
      const d = await res.json();
      if (d.reply) {
        setMessages((prev) => [...prev, { role: "criminal", content: d.reply }]);

        // ── 사기범 메시지 위험 감지 (현금 전달·ATM 지시) ──
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
    setPhase("sent-animation");
    const start = asset;
    const target = Math.max(0, asset - amount);
    const t0 = Date.now();
    function tick() {
      const p = Math.min((Date.now() - t0) / 2000, 1);
      setDisplayAsset(Math.round(start - (start - target) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(() => setPhase("reveal"), 700);
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
        <p style={{ color: "#1d4ed8", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>💡 체험 방법</p>
        <ul style={{ color: "#3b82f6", fontSize: 12, lineHeight: 2, paddingLeft: 16 }}>
          <li>AI가 실제 사기범처럼 대화를 시작합니다</li>
          <li>자연스럽게 대화에 응해보세요</li>
          <li>송금 요청이 오면 어떻게 할지 선택하세요</li>
          <li>체험 후 범죄 수법과 예방법을 확인하세요</li>
        </ul>
      </div>

      {/* 통계 */}
      <div style={{
        background: "#fff", border: "1px solid #f1f5f9",
        borderRadius: 16, padding: "16px 18px",
        boxShadow: "0 2px 8px #0000000a",
      }}>
        <p style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>실제 피해 통계</p>
        <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>{data.reveal.stats}</p>
      </div>

      {/* 안전 안내 */}
      <div style={{
        background: "#f0fdf4", border: "1px solid #bbf7d0",
        borderRadius: 16, padding: "14px 18px",
        display: "flex", alignItems: "flex-start", gap: 10,
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>🛡️</span>
        <p style={{ color: "#15803d", fontSize: 12, lineHeight: 1.6 }}>
          실제 돈을 보내거나 외부로 이동하지 마세요.
          의심스러우면 즉시 <strong>182</strong>로 신고하세요.
        </p>
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
        ← 다른 시나리오 선택
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
            <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 600 }}>위험 감지 {dangerCount}회</span>
          </div>
        )}
      </div>

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
              />
            )}

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
            <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>수신 전화</p>
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
              <span style={{ color: "#888", fontSize: 12 }}>거절</span>
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
              <span style={{ color: "#22c55e", fontSize: 12, fontWeight: 600 }}>받기</span>
            </div>
          </div>
        </div>
      )}

      {/* ══ 은행 메인 ══ */}
      {phase === "bank-main" && (
        <div className="flex flex-col h-full relative">
          <SimDot />
          <div style={{ backgroundColor: KB }} className="px-5 pt-14 pb-5 flex-shrink-0 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KBStar size={20} fill={KB_DARK} />
                <span className="font-bold text-base" style={{ color: KB_DARK }}>KB스타뱅킹</span>
              </div>
              <div className="relative">
                <Bell size={20} style={{ color: KB_DARK }} />
                {notif && <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">1</span>
                </div>}
              </div>
            </div>
          </div>


          <div className="mx-4 mt-3 bg-[#1e1a00] rounded-2xl p-5 flex-shrink-0" style={{ border: `1px solid ${KB}33` }}>
            <p className="text-xs mb-1" style={{ color: KB + "88" }}>KB 주거래통장</p>
            <p className="text-gray-400 text-xs mb-3">123-456-78-901234</p>
            <p className="text-white font-bold text-3xl mb-1">{formatAmount(asset)}</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setPhase("transfer-form")}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-transform"
                style={{ backgroundColor: KB, color: KB_DARK }}>
                이체
              </button>
              <button onClick={() => setPhase("loan-main")}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border active:scale-95 transition-transform"
                style={{ borderColor: KB + "66", color: KB }}>
                대출
              </button>
            </div>
          </div>

          <div className="mx-4 mt-3 grid grid-cols-3 gap-2 flex-shrink-0">
            {[{ icon: <Home size={18} />, label: "홈" }, { icon: <CreditCard size={18} />, label: "카드" }, { icon: <BarChart2 size={18} />, label: "투자" }].map((m) => (
              <div key={m.label} className="bg-[#1a1a1a] rounded-xl p-3 flex flex-col items-center gap-1.5">
                <div style={{ color: KB }}>{m.icon}</div>
                <span className="text-gray-400 text-xs">{m.label}</span>
              </div>
            ))}
          </div>

          <div className="mx-4 mt-3 bg-[#1a1a1a] rounded-xl p-3 flex-shrink-0">
            <p className="text-gray-600 text-xs text-center">이 화면은 범죄예방 교육 시뮬레이션입니다</p>
          </div>
        </div>
      )}

      {/* ══ 이체 폼 ══ */}
      {phase === "transfer-form" && (
        <div className="flex flex-col h-full relative">
          <SimDot />
          <div style={{ backgroundColor: KB }} className="px-5 pt-14 pb-5 flex-shrink-0">
            <button onClick={() => setPhase("bank-main")} style={{ color: KB_DARK }} className="flex items-center gap-1 mb-3">
              <ArrowLeft size={18} /><span className="text-sm font-medium">뒤로</span>
            </button>
            <div className="flex items-center gap-2">
              <KBStar size={18} fill={KB_DARK} />
              <span className="font-bold" style={{ color: KB_DARK }}>이체</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8 flex flex-col gap-4">
            <div className="bg-[#1e1a00] rounded-2xl p-4" style={{ border: `1px solid ${KB}33` }}>
              <p className="text-xs mb-1" style={{ color: KB + "88" }}>출금 계좌</p>
              <p className="text-white font-semibold text-sm">KB 주거래통장</p>
              <p className="text-white font-bold text-xl mt-1">{formatAmount(asset)}</p>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-2 block">받는 계좌번호</label>
                <input value={transferTarget} onChange={(e) => setTransferTarget(e.target.value)} placeholder="계좌번호 입력"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-gray-600" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">이체 금액</label>
                <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3">
                  <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="0"
                    className="flex-1 bg-transparent text-white text-xl font-bold outline-none placeholder-gray-700" />
                  <span className="text-gray-500 text-sm">원</span>
                </div>
              </div>
            </div>
            <button onClick={() => { if (!transferAmount) return; setPhase("transfer-confirm"); }}
              className="w-full py-4 rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform mt-2"
              style={{ backgroundColor: KB, color: KB_DARK }}>
              다음
            </button>
          </div>
        </div>
      )}

      {/* ══ 이체 확인 ══ */}
      {phase === "transfer-confirm" && (
        <div className="flex flex-col h-full relative">
          <SimDot />
          <div style={{ backgroundColor: KB }} className="px-5 pt-14 pb-5 flex-shrink-0">
            <button onClick={() => setPhase("transfer-form")} style={{ color: KB_DARK }} className="flex items-center gap-1 mb-3">
              <ArrowLeft size={18} /><span className="text-sm font-medium">뒤로</span>
            </button>
            <div className="flex items-center gap-2">
              <KBStar size={18} fill={KB_DARK} />
              <span className="font-bold" style={{ color: KB_DARK }}>이체 확인</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8 flex flex-col gap-4">
            <div className="bg-[#1a1a1a] rounded-2xl p-5 flex flex-col gap-3">
              {[
                { label: "받는 분", value: transferTarget || "입력된 계좌" },
                { label: "이체 금액", value: `${parseInt(transferAmount || "0").toLocaleString()}원` },
                { label: "출금 계좌", value: "KB 주거래통장" },
                { label: "이체 후 잔액", value: formatAmount(Math.max(0, asset - parseInt(transferAmount || "0"))) },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-[#2a2a2a] last:border-0">
                  <span className="text-gray-400 text-sm">{row.label}</span>
                  <span className="text-white text-sm font-semibold">{row.value}</span>
                </div>
              ))}
            </div>
            <p style={{ color: "white", opacity: 0.04, fontSize: 11, textAlign: "center", userSelect: "none" }}>
              이것은 시뮬레이션입니다 · 실제 이체가 되지 않습니다
            </p>
            <button onClick={() => doTransfer(parseInt(transferAmount || "0"))}
              className="w-full py-4 rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform"
              style={{ backgroundColor: KB, color: KB_DARK }}>
              이체하기
            </button>
          </div>
        </div>
      )}

      {/* ══ 대출 메인 ══ */}
      {phase === "loan-main" && (
        <div className="flex flex-col h-full relative">
          <SimDot />
          <div style={{ backgroundColor: KB }} className="px-5 pt-14 pb-5 flex-shrink-0">
            <button onClick={() => setPhase("bank-main")} style={{ color: KB_DARK }} className="flex items-center gap-1 mb-3">
              <ArrowLeft size={18} /><span className="text-sm font-medium">뒤로</span>
            </button>
            <div className="flex items-center gap-2">
              <KBStar size={18} fill={KB_DARK} />
              <span className="font-bold" style={{ color: KB_DARK }}>KB 비상금대출</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8 flex flex-col gap-4">
            <div className="bg-[#1e1a00] rounded-2xl p-5" style={{ border: `1px solid ${KB}33` }}>
              <p className="text-xs mb-2" style={{ color: KB + "88" }}>최대 대출 가능 금액</p>
              <p className="text-white font-bold text-3xl">{formatAmount(loanAmount)}</p>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#2a2a1a]">
                <div className="flex-1"><p className="text-gray-500 text-xs">금리</p><p className="text-white text-sm font-semibold">연 4.5%</p></div>
                <div className="flex-1"><p className="text-gray-500 text-xs">기간</p><p className="text-white text-sm font-semibold">최대 12개월</p></div>
              </div>
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl p-4 flex flex-col gap-2">
              {["비대면 즉시 실행", "24시간 대출 가능", "중도상환 수수료 없음"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle size={14} style={{ color: KB }} />
                  <span className="text-gray-300 text-sm">{f}</span>
                </div>
              ))}
            </div>
            <p style={{ color: "white", opacity: 0.04, fontSize: 11, textAlign: "center", userSelect: "none" }}>
              시뮬레이션 · 실제 대출이 실행되지 않습니다
            </p>
            <button onClick={() => setPhase("loan-confirm")}
              className="w-full py-4 rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform"
              style={{ backgroundColor: KB, color: KB_DARK }}>
              대출 신청하기
            </button>
          </div>
        </div>
      )}

      {/* ══ 대출 확인 ══ */}
      {phase === "loan-confirm" && (
        <div className="flex flex-col h-full relative">
          <SimDot />
          <div style={{ backgroundColor: KB }} className="px-5 pt-14 pb-5 flex-shrink-0">
            <button onClick={() => setPhase("loan-main")} style={{ color: KB_DARK }} className="flex items-center gap-1 mb-3">
              <ArrowLeft size={18} /><span className="text-sm font-medium">뒤로</span>
            </button>
            <div className="flex items-center gap-2">
              <KBStar size={18} fill={KB_DARK} />
              <span className="font-bold" style={{ color: KB_DARK }}>대출 실행 확인</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8 flex flex-col gap-4">
            <div className="bg-[#1a1a1a] rounded-2xl p-5 flex flex-col gap-3">
              {[
                { label: "대출 상품", value: "KB 비상금대출" },
                { label: "대출 금액", value: formatAmount(loanAmount) },
                { label: "금리", value: "연 4.5%" },
                { label: "입금 계좌", value: "KB 주거래통장" },
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
              style={{ backgroundColor: KB, color: KB_DARK }}>
              대출 실행
            </button>
          </div>
        </div>
      )}

      {/* ══ 대화 ══ */}
      {(phase === "chat" || phase === "sent-animation") && (
        <>
          {/* 채팅 헤더 - 카카오톡/문자/전화 스타일 */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "48px 16px 12px", flexShrink: 0, position: "relative",
            background: chatCfg.type === "kakao" ? "#FEE500"
              : chatCfg.type === "sms" ? "#1c1c1e"
              : "#1a2e1a",
            borderBottom: chatCfg.type === "kakao" ? "none" : "1px solid #2a2a2a",
          }}>
            <SimDot />
            <button
              onClick={() => router.push("/")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4,
                color: chatCfg.type === "kakao" ? "#3a2e00" : "#888" }}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: chatCfg.type === "kakao" ? "#3a2e0022" : "#2a2a2a",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>{data.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontWeight: 700, fontSize: 15,
                color: chatCfg.type === "kakao" ? "#1a1100" : "#fff",
              }}>{chatCfg.sender}</p>
              {chatCfg.senderSub && (
                <p style={{
                  fontSize: 11,
                  color: chatCfg.type === "kakao" ? "#6b5800" : "#888",
                }}>{chatCfg.senderSub}</p>
              )}
            </div>
            {asset > 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontSize: 10, color: chatCfg.type === "kakao" ? "#6b5800" : "#666" }}>잔액</span>
                <span style={{
                  fontWeight: 700, fontSize: 13, transition: "color 0.3s",
                  color: phase === "sent-animation" ? "#ef4444"
                    : chatCfg.type === "kakao" ? "#1a1100" : "#fff",
                }}>
                  {(displayAsset / 10000).toLocaleString()}만원
                </span>
              </div>
            )}
          </div>

          {/* 교육용 상단 배너 */}
          <div style={{
            margin: "8px 12px 0", padding: "8px 12px",
            background: "#0a1628", border: "0.5px solid #1e3a5f", borderRadius: 10,
            display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
          }}>
            <ShieldAlert size={13} color="#60a5fa" style={{ flexShrink: 0 }} />
            <p style={{ color: "#4b7ab5", fontSize: 11, lineHeight: 1.4 }}>
              <strong style={{ color: "#60a5fa" }}>시뮬레이션</strong> — 실제 돈을 보내거나 어딘가로 이동하지 마세요.
              의심스러우면 <strong style={{ color: "#fff" }}>182</strong>로 신고하세요.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "criminal" && (
                  <div className="w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-auto">{data.icon}</div>
                )}
                <div className="max-w-[75%] px-4 py-2.5 text-sm leading-relaxed text-white"
                  style={{
                    backgroundColor: msg.role === "user" ? "#534AB7" : "#1e1e1e",
                    borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                  }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center text-sm">{data.icon}</div>
                <div className="bg-[#1e1e1e] px-4 py-3" style={{ borderRadius: "4px 18px 18px 18px" }}>
                  <span className="flex gap-1">
                    {[0,150,300].map(d => <span key={d} className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                  </span>
                </div>
              </div>
            )}

            {phase === "sent-animation" && (
              <div className="flex justify-center my-2">
                <div className="bg-[#1a0000] border border-red-500/40 rounded-2xl px-8 py-5 text-center">
                  <p className="text-red-400 text-xs mb-1">💸 송금 중...</p>
                  <p className="text-red-400 font-bold text-3xl">{(displayAsset / 10000).toLocaleString()}만원</p>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {pendingSend && phase === "chat" && (
            <div className="mx-4 mb-3 bg-[#111] border border-[#534AB7]/50 rounded-2xl p-4 flex-shrink-0">
              <p className="text-center text-gray-300 text-sm mb-3">
                <span className="text-white font-bold">{formatAmount(pendingSend)}</span> 송금 요청
              </p>
              <div className="flex gap-2 mb-2">
                <button onClick={() => {
                  setPendingSend(null);
                  setMessages(p => [...p, { role: "user", content: "지금 당장은 어렵겠어." }]);
                  setLoading(true);
                  fetch("/api/crime", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ scenarioId: scenario, messages: [...messages, { role: "user", content: "지금 당장은 어렵겠어." }].map(m => ({ role: m.role === "criminal" ? "assistant" : "user", content: m.content })), userMessage: "지금 당장은 어렵겠어." })
                  }).then(r => r.json()).then(d => {
                    if (d.reply) setMessages(p => [...p, { role: "criminal", content: d.reply }]);
                    if (d.sendAmount) setPendingSend(d.sendAmount);
                  }).finally(() => setLoading(false));
                }} className="flex-1 py-3 rounded-xl border border-[#333] text-gray-400 text-sm">
                  거절
                </button>
                <button onClick={() => doTransfer(pendingSend)} className="flex-1 py-3 rounded-xl bg-[#534AB7] text-white font-semibold text-sm">
                  💸 송금하기
                </button>
              </div>
              <button
                onClick={goToBankFromChat}
                style={{
                  width: "100%", padding: "10px 0", borderRadius: 12, fontSize: 12, fontWeight: 600,
                  background: "#1e1a00", color: KB, border: `1px solid ${KB}44`, cursor: "pointer",
                }}
              >
                🏦 KB스타뱅킹 열기 (이체)
              </button>
            </div>
          )}

          {phase === "chat" && (
            <div className="px-4 pb-8 pt-2 flex-shrink-0">
              <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-2xl px-3 py-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="답장하기..."
                  className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none"
                />
                <button onClick={sendMessage} disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: input.trim() && !loading ? "#534AB7" : "#2a2a2a" }}>
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </div>
          )}
        </>
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
          onSaveNumbers={() => {
            saveDangerRecord(scenario as string, dangerReasons);
            setNumbersSaved(true);
          }}
          onRetry={() => {
            setPhase(CALL_SCENARIOS.has(scenario as string) ? "ringing" : "chat");
            setMessages([]);
            setPendingSend(null); setFinalSendAmount(null);
            setTransferAmount(""); setTransferTarget("");
            setBlock(null); setDangerCount(0); setDangerReasons([]); setNumbersSaved(false);
          }}
          onHome={() => router.push("/")}
        />
      )}
          </div>
        </div>
      </div>
    </div>
  );
}
