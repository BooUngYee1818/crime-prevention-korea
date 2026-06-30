"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const SCAM_TYPES = [
  {
    id: "delivery-scam",
    name: "택배 미수령 사기",
    sender: "CJ대한통운",
    senderNum: "080-001-2345",
    icon: "📦",
    desc: "배송 실패 문자로 소액 결제 및 개인정보 탈취",
    color: "#1e40af",
    bgGrad: "linear-gradient(135deg, #1e3a8a, #1e40af)",
    firstMsg: "[CJ대한통운] 고객님, 택배(운송장 CJ182947300)가 주소 불명으로 배송 보류 중입니다. 재배송 신청이 필요합니다.",
    tactics: ["긴박감 조성 (마감시한)", "소액으로 경계심 낮추기", "공식기관 사칭", "개인정보→금융정보 단계적 탈취"],
  },
  {
    id: "health-insurance-sms",
    name: "건강보험 환급금 사기",
    sender: "국민건강보험공단",
    senderNum: "1577-1000",
    icon: "🏥",
    desc: "미환급금 수령 명목으로 금융정보·인증번호 탈취",
    color: "#166534",
    bgGrad: "linear-gradient(135deg, #14532d, #166534)",
    firstMsg: "[국민건강보험공단] 고객님의 2024년 건강보험료 미환급금 ₩128,400이 발생하였습니다. 수령기간 2025.06.30까지. 확인 및 신청 요망.",
    tactics: ["환급금 미끼로 자발적 참여 유도", "주민번호·계좌 순서적 수집", "인증번호(OTP) 탈취", "기한 압박으로 이성 차단"],
  },
  {
    id: "card-fraud-sms",
    name: "카드 해외결제 도용 사기",
    sender: "KB국민카드",
    senderNum: "1588-1688",
    icon: "💳",
    desc: "해외 도용 결제 알림으로 카드정보·OTP 탈취",
    color: "#6d28d9",
    bgGrad: "linear-gradient(135deg, #4c1d95, #6d28d9)",
    firstMsg: "[KB국민카드] 고객님 카드(4***-****-****-3829) 해외 결제 시도가 감지되었습니다. 본인 거래가 아닌 경우 즉시 확인이 필요합니다.",
    tactics: ["공포심으로 즉각 반응 유도", "카드번호→CVC→유효기간 단계적 탈취", "OTP 인증번호 요청", "피해 보상 명목 추가 정보 요구"],
  },
];

type Msg = { role: "scammer" | "user"; text: string; time: string };

function now() {
  return new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function SmsChatPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"select" | "chat" | "reveal">("select");
  const [scam, setScam] = useState(SCAM_TYPES[0]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [timer, setTimer] = useState(180);
  const [loading, setLoading] = useState(false);
  const [autoStep, setAutoStep] = useState(0);
  const [infoWarning, setInfoWarning] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const msgsRef = useRef<Msg[]>([]);
  msgsRef.current = msgs;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const addMsg = useCallback((role: "scammer" | "user", text: string) => {
    const m: Msg = { role, text: text.replace(/\[.*?\]/g, "").trim(), time: now() };
    setMsgs(prev => [...prev, m]);
  }, []);

  const endChat = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoRef.current) clearTimeout(autoRef.current);
    setPhase("reveal");
  }, []);

  // 자동 흐름: 사용자가 아무 말 안 할 때 사기범이 다음 메시지 전송
  const scheduleAutoMsg = useCallback((step: number, scenarioId: string) => {
    if (autoRef.current) clearTimeout(autoRef.current);
    autoRef.current = setTimeout(async () => {
      // 이미 사용자가 최근에 답했으면 스킵
      const last = msgsRef.current[msgsRef.current.length - 1];
      if (last?.role === "user") return;
      const res = await fetch("/api/sms-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scenario: scenarioId, autoStep: step }),
      });
      const data = await res.json();
      if (data.done) return;
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        addMsg("scammer", data.message);
        scheduleAutoMsg(step + 1, scenarioId);
      }, 2000);
    }, 18000); // 18초 무응답 시 자동 발송
  }, [addMsg]);

  function startChat(s: typeof SCAM_TYPES[0]) {
    setScam(s);
    setMsgs([]);
    setTimer(180);
    setAutoStep(0);
    setInfoWarning(null);
    setPhase("chat");

    // 첫 메시지 1.5초 후 등장
    setTimeout(() => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        addMsg("scammer", s.firstMsg);
        scheduleAutoMsg(0, s.id);
      }, 1800);
    }, 1500);

    // 타이머 시작
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setPhase("reveal");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function sendMsg() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    addMsg("user", text);
    if (autoRef.current) clearTimeout(autoRef.current);

    // 개인정보 감지
    const infoPatterns = [
      { re: /\d{6}-[1-4]\d{6}/, label: "주민등록번호" },
      { re: /\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}/, label: "카드번호" },
      { re: /\d{3}-\d{4}-\d{4}/, label: "전화번호" },
      { re: /\d{10,14}/, label: "계좌번호" },
    ];
    for (const p of infoPatterns) {
      if (p.re.test(text)) {
        setInfoWarning(`⚠️ 실제 ${p.label}를 입력하셨습니다! 이건 시뮬레이션이지만, 실제 상황에서는 절대 입력하지 마세요.`);
        break;
      }
    }

    setLoading(true);
    setTyping(true);

    const history = msgsRef.current.map(m => ({
      role: m.role === "scammer" ? "assistant" : "user",
      content: m.text,
    }));
    history.push({ role: "user", content: text });

    try {
      const res = await fetch("/api/sms-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scenario: scam.id, messages: history }),
      });
      const data = await res.json();
      setTimeout(() => {
        setTyping(false);
        setLoading(false);
        addMsg("scammer", data.message);
        scheduleAutoMsg(autoStep + 1, scam.id);
        setAutoStep(p => p + 1);
      }, 1200 + Math.random() * 800);
    } catch {
      setTyping(false);
      setLoading(false);
    }
  }

  // ── 선택 화면 ──────────────────────────────────────────────────────────────
  if (phase === "select") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0a0a14 0%, #0f0f1e 50%, #0a0a14 100%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "24px 16px",
        fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
      }}>
        <style>{`
          * { -webkit-tap-highlight-color: transparent !important; box-sizing: border-box; }
          button { -webkit-tap-highlight-color: transparent !important; outline: none; }
        `}</style>

        <button
          onClick={() => router.push("/crime")}
          style={{
            position: "fixed", top: 14, left: 14, zIndex: 99,
            background: "rgba(255,255,255,0.06)", border: "1px solid #ffffff18",
            borderRadius: 12, padding: "8px 14px", color: "#94a3b8",
            fontSize: 13, cursor: "pointer",
          }}
        >← 돌아가기</button>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📱</div>
          <h1 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            문자 사기 체험
          </h1>
          <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>
            실제 스미싱 수법을 3분간 직접 체험해보세요.<br/>
            <span style={{ color: "#ef4444", fontWeight: 600 }}>실제 개인정보는 절대 입력하지 마세요.</span>
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 400 }}>
          {SCAM_TYPES.map(s => (
            <button
              key={s.id}
              onClick={() => startChat(s)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20, padding: "20px 22px",
                cursor: "pointer", textAlign: "left",
                transition: "all 0.2s", display: "flex", alignItems: "center", gap: 16,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: s.bgGrad, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24,
              }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{s.name}</p>
                <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
              <span style={{ color: "#475569", fontSize: 18 }}>›</span>
            </button>
          ))}
        </div>

        <p style={{ color: "#1e293b", fontSize: 10, marginTop: 32, textAlign: "center" }}>
          이 시뮬레이션에 입력한 정보는 저장되지 않습니다.
        </p>
      </div>
    );
  }

  // ── 결과 화면 ──────────────────────────────────────────────────────────────
  if (phase === "reveal") {
    const userMsgs = msgs.filter(m => m.role === "user");
    const infoProvided = userMsgs.some(m =>
      /\d{6}|카드|계좌|인증|비밀번호|주소|생년/.test(m.text)
    );
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0a0a14 0%, #0f0f1e 100%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "60px 16px 40px",
        fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
      }}>
        <style>{`* { -webkit-tap-highlight-color: transparent !important; box-sizing: border-box; } button { -webkit-tap-highlight-color: transparent !important; outline: none; }`}</style>

        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24, padding: "32px 24px", maxWidth: 440, width: "100%",
        }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>
              {infoProvided ? "😱" : "🛡️"}
            </div>
            <h2 style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
              {infoProvided ? "위험! 사기 피해 가능성 있음" : "체험 완료 — 잘 하셨습니다!"}
            </h2>
            <p style={{ color: "#64748b", fontSize: 13 }}>
              {infoProvided
                ? "실제 상황이었다면 개인정보가 유출되었을 수 있습니다."
                : "정보를 제공하지 않아 피해를 막을 수 있었습니다."}
            </p>
          </div>

          {/* 대화 통계 */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 12, marginBottom: 24,
          }}>
            {[
              { label: "총 대화 수", val: msgs.length + "회" },
              { label: "내 답장", val: userMsgs.length + "개" },
              { label: "사기 유형", val: scam.name },
              { label: "체험 시간", val: `${3 - Math.floor(timer / 60)}분 ${60 - (timer % 60)}초` },
            ].map(({ label, val }) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.04)", borderRadius: 14,
                padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>{label}</p>
                <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14 }}>{val}</p>
              </div>
            ))}
          </div>

          {/* 사기 수법 분석 */}
          <div style={{
            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 16, padding: "18px 20px", marginBottom: 24,
          }}>
            <p style={{ color: "#ef4444", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
              🎯 이 사기에서 사용된 심리 조작 수법
            </p>
            {scam.tactics.map((t, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8,
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 6,
                  background: "rgba(239,68,68,0.2)", color: "#ef4444",
                  fontSize: 11, fontWeight: 800, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{i + 1}</span>
                <p style={{ color: "#fca5a5", fontSize: 12.5, lineHeight: 1.6 }}>{t}</p>
              </div>
            ))}
          </div>

          {/* 예방 수칙 */}
          <div style={{
            background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 16, padding: "18px 20px", marginBottom: 28,
          }}>
            <p style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
              ✅ 실제 상황에서 이렇게 하세요
            </p>
            {[
              "문자에 포함된 링크는 절대 클릭하지 마세요.",
              "개인정보·카드번호·인증번호는 문자로 요청받는 순간 사기입니다.",
              "공식 번호(1577-1000 등)는 발신번호 조작 가능 — 역으로 직접 전화하세요.",
              "의심스러우면 경찰청 사이버수사대 182, 금융감독원 1332로 신고하세요.",
            ].map((tip, i) => (
              <p key={i} style={{ color: "#86efac", fontSize: 12, lineHeight: 1.7, marginBottom: 4 }}>
                · {tip}
              </p>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { setPhase("select"); setMsgs([]); }}
              style={{
                flex: 1, padding: "14px 0", borderRadius: 14,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                color: "#cbd5e1", fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}
            >다시 체험</button>
            <button
              onClick={() => router.push("/crime")}
              style={{
                flex: 1, padding: "14px 0", borderRadius: 14,
                background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}
            >다른 체험 보기</button>
          </div>
        </div>
      </div>
    );
  }

  // ── 채팅 화면 ──────────────────────────────────────────────────────────────
  return (
    <div style={{
      height: "100dvh", display: "flex", flexDirection: "column",
      background: "#0a0a14",
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
    }}>
      <style>{`
        * { -webkit-tap-highlight-color: transparent !important; box-sizing: border-box; }
        button { -webkit-tap-highlight-color: transparent !important; outline: none; }
        textarea { resize: none; outline: none; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* 상단 헤더 (SMS 앱 스타일) */}
      <div style={{
        background: "rgba(10,10,20,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid #1e293b",
        padding: "12px 16px 10px",
        flexShrink: 0, position: "relative",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={endChat}
            style={{
              background: "none", border: "none", color: "#60a5fa",
              fontSize: 15, cursor: "pointer", padding: "4px 2px",
            }}
          >‹ 메시지</button>

          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: scam.bgGrad,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, margin: "0 auto 2px",
            }}>{scam.icon}</div>
            <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 13 }}>{scam.sender}</p>
            <p style={{ color: "#475569", fontSize: 10 }}>{scam.senderNum}</p>
          </div>

          {/* 타이머 */}
          <div style={{
            background: timer < 30 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${timer < 30 ? "rgba(239,68,68,0.4)" : "#1e293b"}`,
            borderRadius: 10, padding: "6px 12px", minWidth: 60, textAlign: "center",
            transition: "all 0.3s",
          }}>
            <p style={{ color: timer < 30 ? "#ef4444" : "#94a3b8", fontSize: 11, fontWeight: 700 }}>
              {formatTime(timer)}
            </p>
          </div>
        </div>

        {/* 진행 바 */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          width: `${(timer / 180) * 100}%`, height: 2,
          background: timer < 30
            ? "linear-gradient(90deg, #ef4444, #dc2626)"
            : "linear-gradient(90deg, #3b82f6, #6366f1)",
          transition: "width 1s linear, background 0.5s",
        }} />
      </div>

      {/* 스미싱 알림 배너 */}
      <div style={{
        background: "rgba(239,68,68,0.08)", borderBottom: "1px solid rgba(239,68,68,0.15)",
        padding: "8px 16px", flexShrink: 0,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 12 }}>⚠️</span>
        <p style={{ color: "#fca5a5", fontSize: 11 }}>
          <strong>스미싱 체험 시뮬레이션</strong> — 절대 실제 정보를 입력하지 마세요
        </p>
      </div>

      {/* 개인정보 경고 */}
      {infoWarning && (
        <div style={{
          background: "rgba(239,68,68,0.12)", borderBottom: "1px solid rgba(239,68,68,0.3)",
          padding: "10px 16px", flexShrink: 0,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <p style={{ color: "#fca5a5", fontSize: 12, lineHeight: 1.5, flex: 1 }}>{infoWarning}</p>
          <button
            onClick={() => setInfoWarning(null)}
            style={{ background: "none", border: "none", color: "#64748b", fontSize: 16, cursor: "pointer", padding: "0 4px", flexShrink: 0 }}
          >✕</button>
        </div>
      )}

      {/* 메시지 영역 */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px 14px",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {/* 날짜 헤더 */}
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <span style={{
            background: "rgba(255,255,255,0.06)", borderRadius: 10,
            padding: "4px 12px", color: "#475569", fontSize: 11,
          }}>오늘</span>
        </div>

        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: m.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-end", gap: 8,
            }}
          >
            {/* 사기범 아바타 */}
            {m.role === "scammer" && (
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: scam.bgGrad,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14,
              }}>{scam.icon}</div>
            )}

            <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start", gap: 3 }}>
              {m.role === "scammer" && (
                <p style={{ color: "#475569", fontSize: 10, paddingLeft: 4 }}>{scam.sender}</p>
              )}
              <div style={{
                background: m.role === "user"
                  ? "linear-gradient(135deg, #1d4ed8, #2563eb)"
                  : "rgba(30,41,59,0.9)",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "10px 14px",
                border: m.role === "scammer" ? "1px solid #334155" : "none",
              }}>
                <p style={{
                  color: "#f1f5f9", fontSize: 13.5, lineHeight: 1.6,
                  whiteSpace: "pre-wrap", wordBreak: "break-all",
                }}>{m.text}</p>
              </div>
              <p style={{ color: "#334155", fontSize: 10 }}>{m.time}</p>
            </div>
          </div>
        ))}

        {/* 타이핑 인디케이터 */}
        {typing && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: scam.bgGrad,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
            }}>{scam.icon}</div>
            <div style={{
              background: "rgba(30,41,59,0.9)", borderRadius: "18px 18px 18px 4px",
              padding: "12px 16px", border: "1px solid #334155",
            }}>
              <style>{`
                @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
                .dot { width:6px; height:6px; borderRadius:50%; background:#64748b; animation:bounce 1.2s infinite; display:inline-block; margin:0 2px; }
              `}</style>
              <span className="dot" style={{ animationDelay: "0s" }} />
              <span className="dot" style={{ animationDelay: "0.2s" }} />
              <span className="dot" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 입력 영역 */}
      <div style={{
        background: "rgba(10,10,20,0.95)", backdropFilter: "blur(20px)",
        borderTop: "1px solid #1e293b", padding: "10px 14px",
        display: "flex", gap: 10, alignItems: "flex-end",
        flexShrink: 0,
        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMsg();
            }
          }}
          placeholder="답장하기..."
          rows={1}
          style={{
            flex: 1, background: "rgba(255,255,255,0.07)",
            border: "1px solid #334155", borderRadius: 20,
            padding: "10px 16px", color: "#f1f5f9", fontSize: 14,
            fontFamily: "inherit",
          }}
          onInput={e => {
            const t = e.currentTarget;
            t.style.height = "auto";
            t.style.height = Math.min(t.scrollHeight, 100) + "px";
          }}
        />
        <button
          onClick={sendMsg}
          disabled={!input.trim() || loading}
          style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            background: input.trim() && !loading
              ? "linear-gradient(135deg, #1d4ed8, #2563eb)"
              : "rgba(255,255,255,0.08)",
            border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, transition: "all 0.2s", color: "#fff",
          }}
        >↑</button>
      </div>
    </div>
  );
}
