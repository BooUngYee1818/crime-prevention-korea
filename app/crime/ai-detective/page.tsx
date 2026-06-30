"use client";
import { useState } from "react";

// ── 문제 데이터 ─────────────────────────────────────────────────────────────
// 실제 영상 대신 특징 묘사 + 시각적 힌트로 구성 (AI 생성 특징 교육 목적)
const ROUNDS = [
  {
    title: "이 얼굴, 진짜일까요?",
    items: [
      {
        isAI: true,
        thumb: "🤖",
        bg: "linear-gradient(135deg,#1a1a2e,#16213e)",
        label: "영상 A",
        clues: ["눈이 완벽하게 대칭이에요", "머리카락이 배경에 자연스럽게 섞이지 않아요", "귀걸이가 한쪽만 제대로 보여요"],
        tag: "AI 생성",
        tagColor: "#c58dc6",
      },
      {
        isAI: false,
        thumb: "🙂",
        bg: "linear-gradient(135deg,#1a2e1a,#162116)",
        label: "영상 B",
        clues: ["얼굴에 작은 주근깨가 있어요", "머리카락 몇 가닥이 흐트러져 있어요", "눈 밑에 약간의 다크서클이 있어요"],
        tag: "진짜 사람",
        tagColor: "#34d399",
      },
    ],
    question: "AI가 만든 가짜 얼굴은 어느 쪽인가요?",
    answer: 0,
    explanation: "AI 영상의 특징: 너무 완벽한 대칭, 이상한 귀/귀걸이, 배경과 어색하게 섞이는 머리카락. 실제 사람 얼굴에는 자연스러운 불완전함이 있어요.",
    hint: "너무 완벽하면 의심하세요 👀",
  },
  {
    title: "이 영상 속 손가락, 몇 개인가요?",
    items: [
      {
        isAI: false,
        thumb: "✋",
        bg: "linear-gradient(135deg,#1e2a1e,#162e20)",
        label: "영상 A",
        clues: ["손가락이 정확히 5개예요", "손톱 모양이 각각 달라요", "손금이 자연스럽게 그려져 있어요"],
        tag: "진짜 영상",
        tagColor: "#34d399",
      },
      {
        isAI: true,
        thumb: "🖐️",
        bg: "linear-gradient(135deg,#2e1a1a,#1e1016)",
        label: "영상 B",
        clues: ["손가락이 6개처럼 보여요", "손가락 마디가 부자연스럽게 구부러져 있어요", "손바닥과 손가락 경계가 이상해요"],
        tag: "AI 생성",
        tagColor: "#c58dc6",
      },
    ],
    question: "AI가 만든 가짜 영상은 어느 쪽인가요?",
    answer: 1,
    explanation: "AI는 손가락 개수를 틀리게 만드는 경우가 많아요. 6개, 4개, 손가락이 합쳐진 것처럼 보이거나 마디가 이상하면 AI 의심!",
    hint: "손가락 개수를 세어보세요 🖐️",
  },
  {
    title: "이 배경, 뭔가 이상하지 않나요?",
    items: [
      {
        isAI: true,
        thumb: "🌆",
        bg: "linear-gradient(135deg,#231232,#0f0f1a)",
        label: "영상 A",
        clues: ["창문 프레임이 중간에 끊겨요", "건물 간판 글씨가 알 수 없는 글자예요", "사람 옆 기둥이 구부러져 있어요"],
        tag: "AI 생성",
        tagColor: "#c58dc6",
      },
      {
        isAI: false,
        thumb: "🏙️",
        bg: "linear-gradient(135deg,#0a1a2e,#0f1e3a)",
        label: "영상 B",
        clues: ["간판에 읽을 수 있는 한글이 있어요", "건물 선이 직선으로 이어져요", "그림자 방향이 일정해요"],
        tag: "진짜 영상",
        tagColor: "#34d399",
      },
    ],
    question: "AI가 만든 가짜 배경은 어느 쪽인가요?",
    answer: 0,
    explanation: "AI는 배경의 글자를 제대로 만들지 못해요. 간판이나 책에 적힌 글씨가 뭉개지거나 알 수 없는 기호처럼 보이면 AI입니다.",
    hint: "배경 글자를 읽어보세요 🔍",
  },
  {
    title: "이 사람의 눈, 자세히 보면?",
    items: [
      {
        isAI: false,
        thumb: "👁️",
        bg: "linear-gradient(135deg,#2a1a3a,#181828)",
        label: "영상 A",
        clues: ["눈을 깜빡이는 타이밍이 자연스러워요", "홍채 색이 미묘하게 불규칙해요", "눈동자 초점이 실제 카메라를 보고 있어요"],
        tag: "진짜 영상",
        tagColor: "#34d399",
      },
      {
        isAI: true,
        thumb: "😶",
        bg: "linear-gradient(135deg,#2e1e1e,#1e1010)",
        label: "영상 B",
        clues: ["눈을 거의 깜빡이지 않아요", "홍채 패턴이 완벽하게 대칭이에요", "눈동자가 카메라가 아닌 허공을 봐요"],
        tag: "AI 생성",
        tagColor: "#c58dc6",
      },
    ],
    question: "AI가 만든 가짜 영상은 어느 쪽인가요?",
    answer: 1,
    explanation: "AI 딥페이크는 눈 깜빡임 횟수가 적고 홍채가 비현실적으로 완벽해요. 또 시선이 렌즈를 제대로 보지 않는 경우가 많아요.",
    hint: "눈 깜빡임 횟수를 세어보세요 👁️",
  },
  {
    title: "목소리가 담긴 영상, 진짜일까요?",
    items: [
      {
        isAI: true,
        thumb: "🎙️",
        bg: "linear-gradient(135deg,#1a0a2e,#120820)",
        label: "영상 A",
        clues: ["입 모양과 소리가 약간 어긋나요", "숨소리·침 삼키는 소리가 전혀 없어요", "목소리 톤이 감정과 관계없이 일정해요"],
        tag: "AI 생성",
        tagColor: "#c58dc6",
      },
      {
        isAI: false,
        thumb: "🗣️",
        bg: "linear-gradient(135deg,#1a102a,#081408)",
        label: "영상 B",
        clues: ["말하다가 잠깐 '음...' 하고 멈춰요", "입 모양이 소리와 자연스럽게 맞아요", "목소리가 감정에 따라 높낮이가 달라요"],
        tag: "진짜 영상",
        tagColor: "#34d399",
      },
    ],
    question: "AI가 만든 가짜 목소리 영상은 어느 쪽인가요?",
    answer: 0,
    explanation: "AI 목소리는 감정 변화가 없고 너무 매끄러워요. 실제 사람은 말할 때 '음', '어' 같은 말버릇, 숨소리, 실수가 자연스럽게 섞여요.",
    hint: "말할 때 숨소리가 들리나요? 🎵",
  },
];

const BADGES = [
  { min: 0, max: 2, icon: "🔍", name: "탐정 견습생", color: "#94a3b8", desc: "아직 연습이 필요해요. 힌트를 잘 읽어보세요!" },
  { min: 3, max: 3, icon: "🕵️", name: "탐정 수습생", color: "#f59e0b", desc: "절반 이상 맞췄어요! 조금만 더 연습하면 완벽해요." },
  { min: 4, max: 4, icon: "🦸", name: "AI 탐정", color: "#a57cbb", desc: "거의 다 맞췄어요! AI 눈을 가졌네요!" },
  { min: 5, max: 5, icon: "🏆", name: "AI 탐정 마스터", color: "#22c55e", desc: "완벽해요! 당신은 진짜 AI 전문가입니다!" },
];

const REWARDS = [
  { score: 3, icon: "🎯", title: "도전 코드 해제", desc: "도박 체험에서 비밀 '탐정 모드' 해제! 모든 게임의 조작 원리가 실시간으로 표시됩니다.", code: "DETECTIVE2024" },
  { score: 4, icon: "🎖️", title: "히어로 뱃지 해제", desc: "체험 완료 시 화면에 나타나는 'AI 탐정' 금색 뱃지를 획득합니다.", code: "HERO-BADGE" },
  { score: 5, icon: "🌟", title: "마스터 증명서", desc: "5문제 전부 정답! 스크린샷으로 저장할 수 있는 AI 탐정 마스터 증명서를 드립니다.", code: "MASTER-CERT" },
];

export default function AIDetectivePage() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showExplain, setShowExplain] = useState(false);

  const cur = ROUNDS[round];
  const badge = BADGES.find(b => score >= b.min && score <= b.max) ?? BADGES[0];
  const unlockedRewards = REWARDS.filter(r => score >= r.score);

  const handleSelect = (idx: number) => {
    if (confirmed) return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const correct = selected === cur.answer;
    setConfirmed(true);
    setShowExplain(true);
    setAnswers(prev => [...prev, correct]);
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (round + 1 >= ROUNDS.length) {
      setPhase("result");
    } else {
      setRound(r => r + 1);
      setSelected(null);
      setConfirmed(false);
      setShowExplain(false);
    }
  };

  const reset = () => {
    setPhase("intro"); setRound(0); setSelected(null);
    setConfirmed(false); setScore(0); setAnswers([]); setShowExplain(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#f4f4f5", fontFamily: "'Apple SD Gothic Neo','Noto Sans KR',sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes badgePop { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes correctPulse { 0%{box-shadow:0 0 0 0 #22c55e66} 70%{box-shadow:0 0 0 12px transparent} 100%{box-shadow:0 0 0 0 transparent} }
      `}</style>

      {/* 헤더 */}
      <div style={{ background: "#130c1c", borderBottom: "1px solid #2a1a3a", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <a href="/crime" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}>← 뒤로</a>
        <div style={{ width: 1, height: 16, background: "#2a1a3a" }} />
        <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700 }}>AI 탐정 도전</span>
        {phase === "quiz" && (
          <span style={{ marginLeft: "auto", color: "#6b7280", fontSize: 12 }}>
            {round + 1} / {ROUNDS.length} 문제
          </span>
        )}
      </div>

      {/* ── 인트로 ── */}
      {phase === "intro" && (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px", textAlign: "center", animation: "fadeUp 0.4s ease" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🕵️</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 12, letterSpacing: -0.5 }}>AI 영상 탐정 도전!</h1>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.9, marginBottom: 28 }}>
            요즘 사기꾼들은 <strong style={{ color: "#c58dc6" }}>AI로 만든 가짜 영상</strong>으로 사람들을 속여요.<br />
            진짜 영상과 AI가 만든 가짜 영상을 구별할 수 있나요?<br />
            <strong style={{ color: "#fbbf24" }}>5문제</strong>를 다 맞추면 특별한 선물이 기다려요! 🎁
          </p>

          {/* 뱃지 미리보기 */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 28 }}>
            {BADGES.map(b => (
              <div key={b.name} style={{ textAlign: "center", opacity: 0.5 }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{b.icon}</div>
                <p style={{ color: b.color, fontSize: 9, fontWeight: 700 }}>{b.name}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "#0f0f1a", border: "1px solid #2a1a3a", borderRadius: 16, padding: "18px 20px", marginBottom: 28, textAlign: "left" }}>
            <p style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>🔍 AI 영상의 특징을 배우게 돼요</p>
            {["손가락 개수가 이상해요", "배경 글자가 뭉개져 있어요", "눈 깜빡임이 너무 적어요", "입 모양과 소리가 맞지 않아요", "너무 완벽한 얼굴 대칭"].map((t, i) => (
              <p key={i} style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.8, paddingLeft: 8, borderLeft: "2px solid #2a1a3a" }}>{t}</p>
            ))}
          </div>

          <button
            onClick={() => setPhase("quiz")}
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#fff", fontWeight: 900, fontSize: 16, padding: "16px 48px", borderRadius: 50, border: "none", cursor: "pointer", boxShadow: "0 0 32px #f59e0b44" }}
          >
            🕵️ 탐정 도전 시작!
          </button>
        </div>
      )}

      {/* ── 퀴즈 ── */}
      {phase === "quiz" && (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px", animation: "fadeUp 0.3s ease" }}>
          {/* 진행바 */}
          <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
            {ROUNDS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i < round ? "#22c55e" : i === round ? "#fbbf24" : "#2a1a3a", transition: "background 0.3s" }} />
            ))}
          </div>

          {/* 힌트 배너 */}
          <div style={{ background: "#1a1400", border: "1px solid #fbbf2433", borderRadius: 10, padding: "8px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>💡</span>
            <p style={{ color: "#fbbf24", fontSize: 12 }}>{cur.hint}</p>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, lineHeight: 1.4 }}>{cur.title}<br /><span style={{ color: "#94a3b8", fontSize: 14, fontWeight: 500 }}>{cur.question}</span></h2>

          {/* 선택지 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            {cur.items.map((item, idx) => {
              const isSelected = selected === idx;
              const isCorrect = confirmed && idx === cur.answer;
              const isWrong = confirmed && isSelected && idx !== cur.answer;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  style={{
                    background: isCorrect ? "#052e16" : isWrong ? "#1a0000" : isSelected ? "#1a1a2e" : "#0f0f1a",
                    border: `2px solid ${isCorrect ? "#22c55e" : isWrong ? "#ef4444" : isSelected ? "#fbbf24" : "#2a1a3a"}`,
                    borderRadius: 16, padding: "20px 16px", cursor: confirmed ? "default" : "pointer",
                    textAlign: "left" as const, transition: "all 0.2s",
                    animation: isCorrect ? "correctPulse 0.4s ease" : "none",
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 10, textAlign: "center" as const }}>{item.thumb}</div>
                  <p style={{ color: "#f4f4f5", fontWeight: 700, fontSize: 14, marginBottom: 10, textAlign: "center" as const }}>{item.label}</p>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 5 }}>
                    {item.clues.map((c, j) => (
                      <p key={j} style={{ color: "#6b7280", fontSize: 11, lineHeight: 1.5 }}>· {c}</p>
                    ))}
                  </div>
                  {confirmed && (
                    <div style={{ marginTop: 12, textAlign: "center" as const }}>
                      <span style={{ background: `${item.tagColor}22`, border: `1px solid ${item.tagColor}55`, borderRadius: 20, padding: "3px 10px", color: item.tagColor, fontSize: 11, fontWeight: 700 }}>
                        {isCorrect ? "✓ " : ""}{item.tag}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* 해설 */}
          {showExplain && (
            <div style={{ background: "#1a102a", border: "1px solid #22c55e33", borderRadius: 14, padding: "16px 18px", marginBottom: 16, animation: "fadeUp 0.3s ease" }}>
              <p style={{ color: "#22c55e", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                {answers[answers.length - 1] ? "✅ 정답이에요!" : "❌ 틀렸어요. 이것만 기억하세요!"}
              </p>
              <p style={{ color: "#86efac", fontSize: 13, lineHeight: 1.7 }}>{cur.explanation}</p>
            </div>
          )}

          {/* 버튼 */}
          {!confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              style={{ width: "100%", padding: "14px", borderRadius: 14, fontWeight: 700, fontSize: 15, border: "none", cursor: selected === null ? "default" : "pointer", background: selected === null ? "#2a1a3a" : "linear-gradient(135deg,#fbbf24,#d97706)", color: selected === null ? "#374151" : "#fff" }}
            >
              {selected === null ? "영상을 골라보세요 👆" : "이게 가짜예요! 선택 확인"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{ width: "100%", padding: "14px", borderRadius: 14, fontWeight: 900, fontSize: 15, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff" }}
            >
              {round + 1 >= ROUNDS.length ? "결과 보기 🏆" : "다음 문제 →"}
            </button>
          )}
        </div>
      )}

      {/* ── 결과 ── */}
      {phase === "result" && (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>

          {/* 뱃지 */}
          <div style={{ animation: "badgePop 0.6s ease", marginBottom: 8 }}>
            <div style={{ fontSize: 72, marginBottom: 8 }}>{badge.icon}</div>
            <div style={{ display: "inline-block", background: `${badge.color}22`, border: `2px solid ${badge.color}`, borderRadius: 50, padding: "6px 20px", marginBottom: 16 }}>
              <span style={{ color: badge.color, fontWeight: 900, fontSize: 16 }}>{badge.name} 획득!</span>
            </div>
          </div>

          <p style={{ color: "#94a3b8", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{score} / {ROUNDS.length}</p>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 8 }}>{badge.desc}</p>

          {/* 문제별 결과 */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32 }}>
            {answers.map((a, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: a ? "#052e16" : "#1a0000", border: `2px solid ${a ? "#22c55e" : "#ef4444"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                {a ? "✓" : "✗"}
              </div>
            ))}
          </div>

          {/* 보상 */}
          {unlockedRewards.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>🎁 획득한 혜택</p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                {unlockedRewards.map((r, i) => (
                  <div key={i} style={{ background: "#0f0f1a", border: "1px solid #fbbf2433", borderRadius: 14, padding: "16px 18px", textAlign: "left" as const, animation: `fadeUp 0.4s ease ${i * 0.1}s both` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 22 }}>{r.icon}</span>
                      <p style={{ color: "#fbbf24", fontWeight: 700, fontSize: 13 }}>{r.title}</p>
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>{r.desc}</p>
                    <div style={{ background: "#1a1400", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ color: "#6b7280", fontSize: 11 }}>코드</span>
                      <span style={{ color: "#fbbf24", fontFamily: "monospace", fontWeight: 900, fontSize: 14, letterSpacing: 2 }}>{r.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3점 미만 — 격려 */}
          {score < 3 && (
            <div style={{ background: "#0f0f1a", border: "1px solid #2a1a3a", borderRadius: 14, padding: "16px 20px", marginBottom: 24, textAlign: "left" as const }}>
              <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8 }}>
                괜찮아요! AI 영상을 구별하는 건 어른들도 어려워요.<br />
                한 번 더 도전하면서 해설을 잘 읽어보세요. 📚<br />
                <strong style={{ color: "#fbbf24" }}>3문제 이상 맞추면 특별 혜택이 기다려요!</strong>
              </p>
            </div>
          )}

          {/* AI 탐정 증명서 (5점 달성) */}
          {score === 5 && (
            <div style={{ background: "linear-gradient(135deg,#1a1400,#2a1e00)", border: "2px solid #fbbf24", borderRadius: 20, padding: "24px 20px", marginBottom: 24 }}>
              <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>AI DETECTIVE MASTER CERTIFICATE</p>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 18, marginBottom: 4 }}>AI 탐정 마스터 증명서</p>
              <p style={{ color: "#d97706", fontSize: 13, marginBottom: 16 }}>5문제 전부 정답 달성 · AI 영상 구별 능력 인증</p>
              <p style={{ color: "#6b7280", fontSize: 11 }}>이 화면을 스크린샷으로 저장하세요 📸</p>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={reset} style={{ flex: 1, padding: "14px", borderRadius: 14, fontWeight: 700, fontSize: 14, background: "#2a1a3a", border: "1px solid #374151", color: "#94a3b8", cursor: "pointer" }}>
              다시 도전
            </button>
            <a href="/crime" style={{ flex: 2, padding: "14px", borderRadius: 14, fontWeight: 700, fontSize: 14, background: "linear-gradient(135deg,#fbbf24,#d97706)", color: "#fff", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
              다른 체험 보기 →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
