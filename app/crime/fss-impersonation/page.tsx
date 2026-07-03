"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type Phase = "intro" | "call" | "transfer" | "reveal";
type CallState = "ringing" | "talking" | "hold";

const SCRIPT = [
  { speaker: "사기범", text: "안녕하십니까. 금융감독원 금융소비자보호처 이민준 수사관입니다. 고객님 명의로 개설된 계좌가 현재 보이스피싱 범죄 조직의 대포통장으로 사용되고 있어 연락드렸습니다." },
  { speaker: "사기범", text: "현재 고객님 계좌에서 3개월간 총 4억 2천만원의 의심 거래가 탐지되었습니다. 검찰청 협조 요청이 들어온 사안이라, 지금 즉시 자산 보호 조치를 취하셔야 합니다." },
  { speaker: "사기범", text: "네, 걱정하지 마십시오. 고객님께서 직접 범죄에 연루된 것은 아닙니다. 다만 명의 도용 피해를 막으려면 지금 계좌에 있는 자금을 저희 금융감독원 보호 계좌로 임시 이전하셔야 합니다." },
  { speaker: "사기범", text: "보호 계좌 번호는 국민은행 123-456-789012, 예금주 금감원피해자보호기금입니다. 이체 완료 후 48시간 내 전액 환급 처리됩니다. 지금 바로 인터넷뱅킹 열어 주시겠습니까?" },
  { speaker: "사기범", text: "혹시 가족이나 주변에 말씀하시면 수사에 지장이 생길 수 있습니다. 이 전화는 비밀 수사 채널이라 제3자에게 알리시면 안 됩니다. 지금 바로 이체해 주세요." },
];

const REAL_FACTS = [
  { q: "금융감독원이 전화로 이체를 요구할 수 있나요?", a: "절대 없습니다. 금감원·검찰·경찰은 전화로 계좌이체를 요구하지 않습니다." },
  { q: "\"보호 계좌\"로 이체하면 안전한가요?", a: "\"보호 계좌\"는 존재하지 않습니다. 이체하는 순간 돈은 사라집니다." },
  { q: "\"가족에게 말하지 말라\"는 이유는?", a: "피해자가 정신 차릴 기회를 막으려는 고의적 고립 전술입니다. 즉시 가족에게 알리세요." },
  { q: "이미 이체했다면?", a: "즉시 112 신고 + 해당 은행 고객센터 전화해 지급 정지 요청. 골든타임은 30분입니다." },
];

function now() { return new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }); }

export default function FssImpersonationPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [callState, setCallState] = useState<CallState>("ringing");
  const [scriptIdx, setScriptIdx] = useState(0);
  const [showText, setShowText] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [chose, setChose] = useState<"transfer" | "hangup" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (callState === "talking") {
      timerRef.current = setInterval(() => setCallTime(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callState]);

  function acceptCall() {
    setCallState("talking");
    setShowText(true);
    setScriptIdx(0);
  }

  function nextLine() {
    if (scriptIdx < SCRIPT.length - 1) {
      setScriptIdx(i => i + 1);
    } else {
      setPhase("transfer");
    }
  }

  function fmt(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }

  if (phase === "reveal") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0a1a,#0d1f0a)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 540, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{chose === "hangup" ? "🛡️" : "🚨"}</div>
          <h2 style={{ color: chose === "hangup" ? "#22c55e" : "#ef4444", fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
            {chose === "hangup" ? "잘 판단하셨습니다!" : "피해를 입으셨습니다"}
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>
            {chose === "hangup"
              ? "실제로 이 전화를 끊고 신고하는 것이 정답입니다."
              : "실제 피해자의 평균 피해액은 ₩3,200만원입니다. 아직 늦지 않았습니다."}
          </p>
        </div>
        <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 20, padding: "24px", marginBottom: 16 }}>
          <p style={{ color: "#534AB7", fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 16 }}>금감원·검찰 사칭 보이스피싱 — 핵심 Q&A</p>
          {REAL_FACTS.map((f, i) => (
            <div key={i} style={{ marginBottom: i < 3 ? 16 : 0, paddingBottom: i < 3 ? 16 : 0, borderBottom: i < 3 ? "1px solid #1e293b" : "none" }}>
              <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, marginBottom: 5 }}>Q. {f.q}</p>
              <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7, margin: 0 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
          <a href="tel:1332" style={{ display: "block", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", fontWeight: 900, fontSize: 15, borderRadius: 14, padding: "14px 0", textDecoration: "none", textAlign: "center" }}>🏦 금융감독원 신고 1332</a>
          <a href="tel:112" style={{ display: "block", background: "linear-gradient(135deg,#dc2626,#ef4444)", color: "#fff", fontWeight: 900, fontSize: 15, borderRadius: 14, padding: "14px 0", textDecoration: "none", textAlign: "center" }}>🚔 경찰청 112 — 즉시 지급정지 요청</a>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "1px solid #1e293b", borderRadius: 14, padding: "12px 0", color: "#4b5563", fontSize: 13, cursor: "pointer" }}>← 메인으로 돌아가기</button>
        </div>
      </div>
    </div>
  );

  if (phase === "transfer") return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 440, width: "100%" }}>
        <div style={{ background: "#111", border: "1px solid #1e293b", borderRadius: 20, padding: "28px 24px", marginBottom: 14 }}>
          <p style={{ color: "#6b7280", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16, textAlign: "center" }}>이 상황에서 어떻게 하시겠습니까?</p>
          <div style={{ background: "#0a0a0a", border: "1px solid #1e293b", borderRadius: 14, padding: "16px", marginBottom: 20 }}>
            <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8, margin: 0 }}>
              사기범: <span style={{ color: "#f87171" }}>지금 바로 국민은행 123-456-789012로 이체해주세요. 금감원 보호 계좌입니다. 48시간 내 전액 환급됩니다.</span>
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            <button
              onClick={() => { setChose("transfer"); setPhase("reveal"); }}
              style={{ background: "#1a0808", border: "2px solid #ef4444", borderRadius: 14, padding: "16px", color: "#f87171", fontWeight: 700, fontSize: 14, cursor: "pointer", textAlign: "left" as const }}
            >
              💸 이체하기<br />
              <span style={{ color: "#6b7280", fontSize: 12, fontWeight: 400 }}>금감원 보호 계좌라고 하니 믿어본다</span>
            </button>
            <button
              onClick={() => { setChose("hangup"); setPhase("reveal"); }}
              style={{ background: "#052e16", border: "2px solid #22c55e", borderRadius: 14, padding: "16px", color: "#22c55e", fontWeight: 700, fontSize: 14, cursor: "pointer", textAlign: "left" as const }}
            >
              📵 전화 끊고 112 신고<br />
              <span style={{ color: "#6b7280", fontSize: 12, fontWeight: 400 }}>이상하다. 즉시 신고한다</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (phase === "call") return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes ring-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:0.7}}`}</style>
      {/* 발신자 정보 */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, animation: callState === "ringing" ? "ring-pulse 1s ease-in-out infinite" : "none" }}>🏛️</div>
        <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 4 }}>수신 전화</p>
        <p style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginBottom: 4 }}>금융감독원</p>
        <p style={{ color: "#6b7280", fontSize: 12 }}>1332 — 공식번호 스푸핑</p>
        {callState === "talking" && <p style={{ color: "#22c55e", fontSize: 13, marginTop: 8 }}>통화 중 {fmt(callTime)}</p>}
      </div>

      {/* 대화 내용 */}
      {callState === "talking" && showText && (
        <div style={{ width: "100%", maxWidth: 420, background: "#111", border: "1px solid #1f2937", borderRadius: 20, padding: "20px 22px", marginBottom: 28 }}>
          <p style={{ color: "#6b7280", fontSize: 10, marginBottom: 8, letterSpacing: 1 }}>이민준 수사관 (금감원 사칭)</p>
          <p style={{ color: "#f1f5f9", fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>{SCRIPT[scriptIdx].text}</p>
          <button onClick={nextLine} style={{ width: "100%", background: "#1d4ed8", border: "none", borderRadius: 12, padding: "12px 0", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            {scriptIdx < SCRIPT.length - 1 ? "대답하기 →" : "통화 계속 →"}
          </button>
        </div>
      )}

      {/* 버튼 */}
      {callState === "ringing" && (
        <div style={{ display: "flex", gap: 48 }}>
          <div style={{ textAlign: "center" }}>
            <button onClick={() => router.push("/")} style={{ width: 72, height: 72, borderRadius: "50%", background: "#ef4444", border: "none", fontSize: 28, cursor: "pointer" }}>📵</button>
            <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 8 }}>거절</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={acceptCall} style={{ width: 72, height: 72, borderRadius: "50%", background: "#22c55e", border: "none", fontSize: 28, cursor: "pointer" }}>📞</button>
            <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 8 }}>수신</p>
          </div>
        </div>
      )}
      {callState === "talking" && (
        <button onClick={() => { setCallState("ringing"); setPhase("reveal"); setChose("hangup"); }} style={{ width: 72, height: 72, borderRadius: "50%", background: "#ef4444", border: "none", fontSize: 28, cursor: "pointer" }}>
          📵
        </button>
      )}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: "#052e16", borderBottom: "1px solid #166534", padding: "6px 16px", textAlign: "center" }}>
        <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700 }}>🎓 교육용 시뮬레이션 — 실제 금감원 전화가 아닙니다</span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0a0a1a,#0d1520)", padding: "40px 20px" }}>
      <div style={{ maxWidth: 540, margin: "0 auto" }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "#555", fontSize: 13, cursor: "pointer", marginBottom: 24 }}>← 메인으로</button>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{ color: "#3b82f6", fontSize: 11, fontWeight: 800, letterSpacing: 3, marginBottom: 8 }}>CRIME SIMULATION</p>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 900, marginBottom: 10 }}>🏛️ 금융감독원 사칭 보이스피싱</h1>
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7 }}>
            "검찰·금감원"을 사칭해 수억 원을 이체하게 만드는<br />
            가장 피해액이 큰 보이스피싱 수법입니다.
          </p>
        </div>
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 20, padding: "24px", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            {[
              { icon: "💰", label: "평균 피해액", value: "₩3,200만원", color: "#ef4444" },
              { icon: "👴", label: "주요 피해층", value: "40~70대", color: "#f59e0b" },
              { icon: "📞", label: "사칭 번호", value: "1332 스푸핑", color: "#3b82f6" },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", background: "#0f172a", borderRadius: 12, padding: "12px 8px" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                <p style={{ color: s.color, fontSize: 14, fontWeight: 900, margin: "0 0 2px" }}>{s.value}</p>
                <p style={{ color: "#4b5563", fontSize: 10, margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            실제 금융감독원(1332) 번호로 위장해 전화합니다.<br />
            "당신 계좌가 범죄에 연루됐다"며 겁을 준 뒤<br />
            <strong style={{ color: "#f87171" }}>자산을 '보호 계좌'로 이체하도록 유도</strong>합니다.
          </p>
        </div>
        <button
          onClick={() => setPhase("call")}
          style={{ width: "100%", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", border: "none", borderRadius: 18, padding: "18px 0", color: "#fff", fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 24px #1d4ed844" }}
        >
          📞 전화 받기 체험 시작
        </button>
      </div>
    </div>
  );
}
