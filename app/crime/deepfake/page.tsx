"use client";
import { useState, useEffect, useRef } from "react";

type Phase = "intro" | "video-call" | "chat" | "demand" | "reveal";

const SCAMMER_NAME = "엄마";
const SCAMMER_AVATAR = "👩";

const VIDEO_SCRIPT = [
  { delay: 0, text: "여보세요? 나야, 엄마." },
  { delay: 3000, text: "얼굴 보고 싶어서 영상통화 했어. 잘 지내고 있어?" },
  { delay: 7000, text: "응, 나도 잘 있어. 근데 있잖아..." },
  { delay: 11000, text: "사실... 지금 좀 급한 상황이야." },
];

const CHAT_FLOW: { from: "scammer" | "user"; text: string; options?: string[] }[] = [
  { from: "scammer", text: "영상통화 끊어서 미안해. 배터리가 다 됐어. 문자로 얘기할게." },
  { from: "scammer", text: "있잖아, 엄마 지금 병원 응급실이야. 갑자기 쓰러졌는데 검사비가 필요해." },
  {
    from: "user",
    text: "",
    options: ["얼마나 필요해요?", "지금 바로 갈게요!", "다른 가족한테 연락해봐요"],
  },
  { from: "scammer", text: "너한테만 연락했어. 아빠는 출장 중이고 언니는 연락이 안 돼." },
  { from: "scammer", text: "300만원만 먼저 보내줄 수 있어? 보험 처리되면 바로 돌려줄게." },
  {
    from: "user",
    text: "",
    options: ["네, 계좌 알려주세요", "잠깐, 직접 전화해볼게요", "어느 병원이에요?"],
  },
  { from: "scammer", text: "국민은행 홍길동 110-XXX-XXXXXX 이야. 빨리 보내줘, 응급 상황이라 시간이 없어." },
  { from: "scammer", text: "제발 빨리... 엄마 많이 아파 😢" },
];

const REVEAL_TACTICS = [
  { icon: "🎭", title: "AI 딥페이크 얼굴 합성", desc: "SNS에 올린 사진 몇 장으로 실제 가족 얼굴과 목소리를 AI가 실시간 합성합니다. 화질이 낮은 것도 '배터리·신호 불량'으로 자연스럽게 설명합니다." },
  { icon: "📵", title: "영상통화 → 문자로 전환", desc: "영상은 짧게 보여준 뒤 '배터리 방전'을 핑계로 문자로 전환합니다. 글자로는 AI 여부를 전혀 확인할 수 없기 때문입니다." },
  { icon: "⏰", title: "시간 압박과 감정 자극", desc: "'응급실', '수술', '빨리'라는 단어로 이성적 판단을 차단합니다. 당황한 상태에서는 계좌번호 확인조차 건너뜁니다." },
  { icon: "🚫", title: "다른 연락처 차단", desc: "아빠·언니 등 확인 가능한 경로를 사전에 '연락 안 됨'으로 막아둡니다. 피해자가 진위를 확인할 통로를 원천 차단합니다." },
  { icon: "💸", title: "소액 → 고액 단계 요구", desc: "처음엔 '보험 처리되면 돌려준다'는 말로 죄책감을 낮춥니다. 한 번 보내면 '추가 검사비'로 반복 요구합니다." },
  { icon: "👤", title: "타인 명의 계좌", desc: "범인 본인 계좌가 아닌 대포통장을 사용해 추적을 피합니다. 입금 즉시 현금 인출 후 잠적합니다." },
];

const PREVENTION = [
  "📞 영상통화 중 '사전에 약속한 가족 암호'를 물어보세요",
  "🏥 병원 이름을 물어보고 직접 그 병원에 전화 확인하세요",
  "💳 가족이라도 처음 보는 계좌로 즉시 이체는 절대 금지",
  "👨‍👩‍👧 당사자 외 다른 가족에게 교차 확인 전화를 반드시 하세요",
  "🕵️ 경찰청 112 또는 금융감독원 1332에 즉시 신고하세요",
];

export default function DeepfakePage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [videoLine, setVideoLine] = useState(-1);
  const [chatIdx, setChatIdx] = useState(0);
  const [messages, setMessages] = useState<{ from: "scammer" | "user"; text: string }[]>([]);
  const [glitch, setGlitch] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const id = setInterval(() => setScanLine(p => (p + 1) % 100), 30);
    return () => clearInterval(id);
  }, []);

  const startVideoCall = () => {
    setPhase("video-call");
    setVideoLine(0);
    VIDEO_SCRIPT.forEach((line, i) => {
      setTimeout(() => setVideoLine(i), line.delay);
    });
    setTimeout(() => setPhase("chat"), 15000);
  };

  const handleOption = (text: string) => {
    const newMsg = { from: "user" as const, text };
    setMessages(prev => [...prev, newMsg]);

    const next = CHAT_FLOW.slice(chatIdx + 1);
    let delay = 1200;
    let idx = chatIdx + 1;
    for (const item of next) {
      if (item.from === "scammer") {
        setTimeout(() => {
          setMessages(prev => [...prev, { from: "scammer", text: item.text }]);
          setChatIdx(idx);
          if (idx >= CHAT_FLOW.length - 1) {
            setTimeout(() => setPhase("demand"), 1500);
          }
        }, delay);
        delay += 1800;
        idx++;
      } else {
        setChatIdx(idx);
        break;
      }
    }
  };

  const handleDemand = (send: boolean) => {
    if (send) {
      setGlitch(true);
      setTimeout(() => {
        setGlitch(false);
        setPhase("reveal");
      }, 2500);
    } else {
      setPhase("reveal");
    }
  };

  const currentOptions = CHAT_FLOW[chatIdx]?.from === "user" ? CHAT_FLOW[chatIdx].options : undefined;

  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#f4f4f5", fontFamily: "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}>
      <style>{`
        @keyframes glitchShake {
          0%,100% { transform: translate(0); }
          10% { transform: translate(-4px, 2px); }
          20% { transform: translate(4px, -2px); }
          30% { transform: translate(-2px, 4px); }
          40% { transform: translate(2px, -4px); }
          50% { transform: translate(-4px, -2px); }
          60% { transform: translate(4px, 2px); }
          70% { transform: translate(-2px, -4px); }
          80% { transform: translate(2px, 4px); }
          90% { transform: translate(-4px, 2px); }
        }
        @keyframes scanAnim {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
      `}</style>

      {/* 상단 헤더 */}
      <div style={{ background: "#130c1c", borderBottom: "1px solid #2a1a3a", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <a href="/crime" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}>← 뒤로</a>
        <div style={{ width: 1, height: 16, background: "#2a1a3a" }} />
        <span style={{ color: "#c58dc6", fontSize: 13, fontWeight: 700 }}>AI 딥페이크 사기 체험</span>
        <span style={{ marginLeft: "auto", background: "#7c3aed22", border: "1px solid #7c3aed55", borderRadius: 20, padding: "2px 10px", color: "#c58dc6", fontSize: 11, fontWeight: 700 }}>SIMULATION</span>
      </div>

      {/* ── INTRO ── */}
      {phase === "intro" && (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎭</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 12, letterSpacing: -0.5 }}>AI 딥페이크 가족 사칭 사기</h1>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.9, marginBottom: 32 }}>
            실제로 일어나고 있는 수법입니다.<br />
            AI가 <strong style={{ color: "#c58dc6" }}>가족의 얼굴과 목소리</strong>를 합성해 영상통화를 겁니다.<br />
            당신은 이것이 사기임을 알아챌 수 있을까요?
          </p>
          <div style={{ background: "#0f0f1a", border: "1px solid #7c3aed44", borderRadius: 16, padding: "20px 24px", marginBottom: 32, textAlign: "left" }}>
            <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>⚠️ 시뮬레이션 안내</p>
            <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.8 }}>
              이 체험은 실제 개인정보나 금융 정보를 수집하지 않습니다.<br />
              영상통화 화면은 AI 합성 시뮬레이션이며, 실제 가족과는 무관합니다.
            </p>
          </div>
          <button
            onClick={startVideoCall}
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 48px", borderRadius: 50, border: "none", cursor: "pointer", boxShadow: "0 0 32px #7c3aed44" }}
          >
            📞 영상통화 받기
          </button>
        </div>
      )}

      {/* ── VIDEO CALL ── */}
      {phase === "video-call" && (
        <div style={{ maxWidth: 400, margin: "0 auto", padding: "40px 24px" }}>
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: 12, marginBottom: 16 }}>
            <span style={{ color: "#22c55e", animation: "pulse 1s infinite" }}>● </span>영상통화 연결 중...
          </p>
          {/* 가짜 영상 화면 */}
          <div style={{
            background: "#1a1a2e",
            borderRadius: 20,
            overflow: "hidden",
            aspectRatio: "9/16",
            maxHeight: 480,
            position: "relative",
            border: "2px solid #7c3aed55",
            boxShadow: "0 0 40px #7c3aed33",
          }}>
            {/* 스캔라인 효과 */}
            <div style={{
              position: "absolute", left: 0, right: 0, height: 2,
              background: "rgba(167,139,250,0.3)",
              top: `${scanLine}%`,
              transition: "top 0.03s linear",
              zIndex: 2,
            }} />
            {/* 가짜 글리치 노이즈 */}
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)", zIndex: 1, pointerEvents: "none" }} />
            {/* 아바타 */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#2d2d44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, border: "3px solid #7c3aed55" }}>
                {SCAMMER_AVATAR}
              </div>
              <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 16 }}>{SCAMMER_NAME}</p>
              <div style={{ background: "#0f0f1a99", borderRadius: 8, padding: "4px 12px" }}>
                <p style={{ color: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}>HD 720p · AI Enhanced</p>
              </div>
            </div>
            {/* 자막 */}
            {videoLine >= 0 && (
              <div style={{
                position: "absolute", bottom: 24, left: 16, right: 16,
                background: "rgba(0,0,0,0.75)", borderRadius: 8, padding: "8px 12px",
                animation: "fadeIn 0.3s ease",
                zIndex: 3,
              }}>
                <p style={{ color: "#f4f4f5", fontSize: 13, lineHeight: 1.5, textAlign: "center" }}>
                  {VIDEO_SCRIPT[videoLine]?.text}
                </p>
              </div>
            )}
          </div>
          <p style={{ textAlign: "center", color: "#374151", fontSize: 11, marginTop: 16 }}>
            잠시 후 문자로 전환됩니다...
          </p>
        </div>
      )}

      {/* ── CHAT ── */}
      {phase === "chat" && (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 0", display: "flex", flexDirection: "column", height: "calc(100vh - 57px)" }}>
          {/* 채팅 상단 */}
          <div style={{ background: "#0f0f1a", padding: "12px 20px", borderBottom: "1px solid #2a1a3a", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2d2d44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{SCAMMER_AVATAR}</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14 }}>{SCAMMER_NAME}</p>
              <p style={{ color: "#22c55e", fontSize: 11 }}>● 온라인</p>
            </div>
          </div>
          {/* 메시지 목록 */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", animation: "fadeIn 0.3s ease" }}>
                {m.from === "scammer" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2d2d44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginRight: 8, flexShrink: 0 }}>{SCAMMER_AVATAR}</div>
                )}
                <div style={{
                  background: m.from === "user" ? "#7c3aed" : "#2a1a3a",
                  color: "#f4f4f5",
                  borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "10px 14px",
                  fontSize: 14,
                  maxWidth: "75%",
                  lineHeight: 1.6,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {/* 선택지 */}
          {currentOptions && (
            <div style={{ padding: "12px 20px", borderTop: "1px solid #2a1a3a", display: "flex", flexDirection: "column", gap: 8 }}>
              {currentOptions.map((opt, i) => (
                <button key={i} onClick={() => handleOption(opt)} style={{
                  background: "#2a1a3a", border: "1px solid #374151", borderRadius: 12,
                  padding: "12px 16px", color: "#f4f4f5", fontSize: 13, cursor: "pointer",
                  textAlign: "left", transition: "border-color 0.2s",
                }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── DEMAND (송금 결정) ── */}
      {phase === "demand" && (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px" }}>
          {glitch && (
            <div style={{
              position: "fixed", inset: 0, background: "#000", zIndex: 100,
              animation: "glitchShake 0.15s infinite",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#c58dc6", fontFamily: "monospace", fontSize: 18, animation: "blink 0.2s infinite" }}>
                  ▓▒░ TRANSFERRING... ░▒▓
                </p>
                <p style={{ color: "#374151", fontSize: 12, marginTop: 16 }}>국민은행 → 홍길동 계좌</p>
              </div>
            </div>
          )}
          <div style={{ background: "#0f1117", border: "1px solid #dc2626aa", borderRadius: 20, padding: "32px 28px", marginBottom: 24 }}>
            <p style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: 2 }}>⚠️ 송금 요청</p>
            <div style={{ background: "#1a0f0f", borderRadius: 12, padding: "20px", marginBottom: 20 }}>
              <p style={{ color: "#6b7280", fontSize: 11, marginBottom: 4 }}>받는 분</p>
              <p style={{ color: "#f4f4f5", fontWeight: 700, fontSize: 16 }}>홍길동 (국민은행)</p>
              <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>110-XXX-XXXXXX</p>
              <div style={{ height: 1, background: "#2d1a1a", margin: "16px 0" }} />
              <p style={{ color: "#6b7280", fontSize: 11, marginBottom: 4 }}>금액</p>
              <p style={{ color: "#f87171", fontWeight: 900, fontSize: 28 }}>₩ 3,000,000</p>
            </div>
            <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.7 }}>
              엄마라고 주장하는 사람이 300만원 즉시 이체를 요구합니다.<br />
              어떻게 하시겠습니까?
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button onClick={() => handleDemand(true)} style={{
              background: "#dc2626", color: "#fff", fontWeight: 700, fontSize: 15,
              padding: "16px", borderRadius: 14, border: "none", cursor: "pointer",
            }}>
              💸 300만원 이체하기
            </button>
            <button onClick={() => handleDemand(false)} style={{
              background: "#2a1a3a", color: "#94a3b8", fontWeight: 700, fontSize: 15,
              padding: "16px", borderRadius: 14, border: "1px solid #374151", cursor: "pointer",
            }}>
              🚫 이상한 것 같아, 안 보내기
            </button>
          </div>
        </div>
      )}

      {/* ── REVEAL ── */}
      {phase === "reveal" && (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎭</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#c58dc6", marginBottom: 8 }}>이것은 AI 딥페이크 사기였습니다</h2>
            <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.8 }}>
              방금 체험한 영상통화의 얼굴과 목소리는 모두 AI가 합성한 것입니다.<br />
              실제 사기는 이보다 훨씬 정교합니다.
            </p>
          </div>

          {/* 사기 수법 해설 */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ color: "#c58dc6", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>사용된 수법 분석</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {REVEAL_TACTICS.map((t, i) => (
                <div key={i} style={{ background: "#0f0f1a", border: "1px solid #7c3aed33", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14, animation: `fadeIn 0.4s ease ${i * 0.1}s both` }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{t.icon}</span>
                  <div>
                    <p style={{ color: "#c58dc6", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t.title}</p>
                    <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.7 }}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 예방법 */}
          <div style={{ background: "#1a102a", border: "1px solid #22c55e44", borderRadius: 16, padding: "24px 20px", marginBottom: 32 }}>
            <p style={{ color: "#22c55e", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 14 }}>✅ 이렇게 막을 수 있습니다</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PREVENTION.map((p, i) => (
                <p key={i} style={{ color: "#86efac", fontSize: 13, lineHeight: 1.6 }}>{p}</p>
              ))}
            </div>
          </div>

          {/* 신고 */}
          <div style={{ background: "#1a0a0a", border: "1px solid #dc262644", borderRadius: 16, padding: "20px 20px", marginBottom: 32, textAlign: "center" }}>
            <p style={{ color: "#f87171", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>피해를 당했다면 즉시 신고하세요</p>
            <p style={{ color: "#dc2626", fontSize: 24, fontWeight: 900 }}>☎ 112 · 1332</p>
            <p style={{ color: "#6b7280", fontSize: 11, marginTop: 6 }}>경찰청 · 금융감독원 (24시간)</p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => { setPhase("intro"); setMessages([]); setChatIdx(0); setVideoLine(-1); }} style={{
              flex: 1, background: "#2a1a3a", border: "1px solid #374151", borderRadius: 14,
              padding: "14px", color: "#94a3b8", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>
              다시 체험하기
            </button>
            <a href="/crime" style={{
              flex: 1, background: "linear-gradient(135deg, #7c3aed, #c58dc6)",
              borderRadius: 14, padding: "14px", color: "#fff", fontWeight: 700, fontSize: 14,
              textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              다른 체험 보기
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
