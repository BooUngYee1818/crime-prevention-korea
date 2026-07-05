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
  const [phase, setPhase] = useState<"learn" | "intro" | "quiz" | "result">("learn");
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
    setPhase("learn"); setRound(0); setSelected(null);
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

      {/* ── 학습 콘텐츠 ── */}
      {phase === "learn" && (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 60px", animation: "fadeUp 0.4s ease" }}>

          {/* 타이틀 */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎬</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10, letterSpacing: -0.5 }}>AI 영상, 이제는 진짜처럼 보입니다</h1>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8 }}>
              사기꾼들이 AI 영상으로 사람들을 속이기 시작했어요.<br />
              어떻게 발전했는지, 어떻게 구별하는지 알아봐요.
            </p>
          </div>

          {/* ── SECTION 1: 발전 비교 ── */}
          <div style={{ background: "#0f0f1a", border: "1px solid #2a1a3a", borderRadius: 20, padding: "22px 20px", marginBottom: 18 }}>
            <p style={{ color: "#fbbf24", fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 16 }}>📈 AI 영상의 발전 — 1년 사이에 이렇게 달라졌어요</p>

            {/* Before / After 비교 카드 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              <div style={{ background: "#1a1a2e", border: "2px solid #ef444466", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ background: "#ef444422", padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#ef4444", fontSize: 10, fontWeight: 800 }}>1년 전 AI 영상</span>
                </div>
                {/* 이미지 자리 — /public/ai-before.jpg 저장 시 아래 주석 해제 */}
                {/* <img src="/ai-before.jpg" alt="1년전 AI" style={{ width:"100%", display:"block" }} /> */}
                <div style={{ padding: "14px 12px" }}>
                  <p style={{ color: "#374151", fontSize: 10, marginBottom: 8, fontStyle: "italic" }}>
                    출처: Google 검색 (윌 스미스 AI 영상 캡처)
                  </p>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                    {["손가락이 6개 또는 4개로 보임", "머리카락 끝이 배경에 녹아들어 흐릿함", "눈 깜빡임이 없거나 어색함", "치아가 뭉개지거나 이상하게 붙어 있음"].map((t, i) => (
                      <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                        <span style={{ color: "#ef4444", fontSize: 10, marginTop: 2, flexShrink: 0 }}>✗</span>
                        <p style={{ color: "#9ca3af", fontSize: 11, lineHeight: 1.5 }}>{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ background: "#0f1e10", border: "2px solid #22c55e66", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ background: "#22c55e22", padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#22c55e", fontSize: 10, fontWeight: 800 }}>현재 AI 영상</span>
                </div>
                {/* 이미지 자리 — /public/ai-after.jpg 저장 시 아래 주석 해제 */}
                {/* <img src="/ai-after.jpg" alt="현재 AI" style={{ width:"100%", display:"block" }} /> */}
                <div style={{ padding: "14px 12px" }}>
                  <p style={{ color: "#374151", fontSize: 10, marginBottom: 8, fontStyle: "italic" }}>
                    출처: Google 검색 (윌 스미스 AI 영상 캡처)
                  </p>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                    {["손가락 개수가 정확히 5개", "머리카락 윤곽이 선명하게 분리됨", "자연스러운 눈 깜빡임과 표정 변화", "치아와 입 모양이 자연스러움"].map((t, i) => (
                      <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                        <span style={{ color: "#22c55e", fontSize: 10, marginTop: 2, flexShrink: 0 }}>✓</span>
                        <p style={{ color: "#9ca3af", fontSize: 11, lineHeight: 1.5 }}>{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p style={{ color: "#374151", fontSize: 10, fontStyle: "italic", textAlign: "right" as const, marginBottom: 8 }}>
              ※ 위 이미지는 Google 검색을 통해 수집된 자료입니다. 교육 목적으로만 사용됩니다.
            </p>
            <div style={{ background: "#13082a", border: "1px solid #f97316", borderRadius: 12, padding: "13px 16px" }}>
              <p style={{ color: "#fed7aa", fontSize: 13, lineHeight: 1.9 }}>
                요즘 AI는 정말 똑같이 만들어 냅니다. 예전에는 AI에게 사람을 그려달라고 하면 팔이 두 개이거나 손가락이 어딘가 잘린 듯한 부자연스러운 모습이었어요.
                하지만 요즘은 그 기술도 발전하여, <strong style={{ color: "#f97316" }}>사람의 신체 전체가 자연스럽게 보이도록</strong> 만들어 줄 수 있게 됐습니다.
                <br /><br />
                이를 통해 알 수 있는 부분은 <strong style={{ color: "#fb923c" }}>&apos;AI는 많은 유저들의 기획과 프롬프트(명령)를 통해 새롭게 발전해 나간다&apos;</strong>는 것입니다.
                이것이 우리가 AI의 영상이나 사진을 눈여겨봐야 하는 이유입니다.
              </p>
            </div>
          </div>

          {/* ── SECTION 2: Sora 소개 ── */}
          <div style={{ background: "#0a0a1a", border: "1px solid #3b82f666", borderRadius: 20, padding: "20px", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              {/* Sora 로고 CSS 표현 */}
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #1e3a5f, #0a1628)", border: "1px solid #3b82f644", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#60a5fa", fontSize: 22, fontWeight: 900 }}>S</span>
              </div>
              <div>
                <p style={{ color: "#60a5fa", fontWeight: 800, fontSize: 16 }}>Sora — OpenAI의 AI 영상 생성 도구</p>
                <p style={{ color: "#6b7280", fontSize: 12 }}>텍스트 한 줄로 실제 같은 영상을 만들어냅니다</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { icon: "⌨️", label: "명령어(프롬프트) 입력", desc: "\"해변에서 걷는 남성\" 한 줄" },
                { icon: "🤖", label: "AI가 영상 생성", desc: "수초~수분 안에 완성" },
                { icon: "🎬", label: "실제 같은 영상 출력", desc: "구별 거의 불가능" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#111128", borderRadius: 10, padding: "12px 10px", textAlign: "center" as const }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <p style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, marginBottom: 3 }}>{s.label}</p>
                  <p style={{ color: "#4b5563", fontSize: 10, lineHeight: 1.4 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 3: AI 워터마크 ── */}
          <div style={{ background: "#0f0f1a", border: "1px solid #fbbf2444", borderRadius: 20, padding: "22px 20px", marginBottom: 18 }}>
            <p style={{ color: "#fbbf24", fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 6 }}>🔍 AI 워터마크 — 이것을 확인하세요</p>
            <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
              AI들은 보통 영상이나 이미지를 만들 때 <strong style={{ color: "#fbbf24" }}>워터마크</strong>를 생성합니다.
              영상의 각 모서리나 화면 어딘가에 AI 프로그램의 표시가 기본으로 삽입돼요.
              법적으로도 표기 의무가 있지만, 이를 없애려는 사람들도 있습니다.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {/* Instagram 워터마크 */}
              <div style={{ background: "#1a1a2e", borderRadius: 14, overflow: "hidden", border: "1px solid #2a2a4a" }}>
                <div style={{ background: "linear-gradient(135deg,#405de6,#833ab4,#fd1d1d,#fcb045)", padding: "8px 12px" }}>
                  <p style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>📱 인스타그램 / 릴스</p>
                </div>
                {/* 실제 스크린샷 이미지 자리 */}
                {/* <img src="/watermark-instagram.jpg" style={{ width:"100%", display:"block" }} /> */}
                <div style={{ padding: "12px", textAlign: "center" as const }}>
                  <p style={{ color: "#374151", fontSize: 10, marginBottom: 8, fontStyle: "italic", textAlign: "left" as const }}>출처: Google 검색</p>
                  <div style={{ background: "#000", borderRadius: 20, padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 12 }}>✨</span>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>AI로 생성한 콘텐츠</span>
                  </div>
                  <p style={{ color: "#6b7280", fontSize: 11, lineHeight: 1.5 }}>영상 하단에 이 표시가 뜨면 AI 생성 콘텐츠</p>
                </div>
              </div>

              {/* Gemini 워터마크 */}
              <div style={{ background: "#1a1a2e", borderRadius: 14, overflow: "hidden", border: "1px solid #2a2a4a" }}>
                <div style={{ background: "linear-gradient(135deg,#1a73e8,#4285f4)", padding: "8px 12px" }}>
                  <p style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>🔷 Gemini (구글)</p>
                </div>
                {/* 실제 스크린샷 이미지 자리 */}
                {/* <img src="/watermark-gemini.jpg" style={{ width:"100%", display:"block" }} /> */}
                <div style={{ padding: "12px", textAlign: "center" as const }}>
                  <p style={{ color: "#374151", fontSize: 10, marginBottom: 8, fontStyle: "italic", textAlign: "left" as const }}>출처: Google 검색</p>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>✦</div>
                  <p style={{ color: "#9ca3af", fontSize: 11, lineHeight: 1.5 }}>우측 하단 별모양이 Gemini 워터마크. 잘라내도 이미지 비율이 틀려짐</p>
                </div>
              </div>
            </div>

            {/* 다른 AI 워터마크 */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
              {[
                { tool: "Sora", mark: "우측 하단 'S' 마크", color: "#60a5fa" },
                { tool: "Midjourney", mark: "이미지 하단 MJ 서명", color: "#a78bfa" },
                { tool: "DALL-E", mark: "메타데이터에 숨겨진 표시", color: "#34d399" },
                { tool: "Runway", mark: "모서리 R 아이콘", color: "#f87171" },
              ].map((w, i) => (
                <div key={i} style={{ background: "#111128", borderRadius: 8, padding: "7px 11px", display: "flex", gap: 7, alignItems: "center" }}>
                  <span style={{ color: w.color, fontSize: 11, fontWeight: 800 }}>{w.tool}</span>
                  <span style={{ color: "#4b5563", fontSize: 10 }}>{w.mark}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 4: 워터마크 없을 때 대처법 ── */}
          <div style={{ background: "#0a1628", border: "2px solid #ef4444", borderRadius: 20, padding: "20px", marginBottom: 24 }}>
            <p style={{ color: "#ef4444", fontSize: 13, fontWeight: 800, marginBottom: 12 }}>⚠️ 워터마크가 보이지 않을 때는?</p>
            <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>
              요즘은 워터마크를 없애는 도구도 많아졌어요. 워터마크가 없다고 안심하면 안 됩니다.
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
              {[
                { num: "1", title: "눈을 확대해서 확인하세요", desc: "실제 눈동자에는 주변 환경이 반사돼 보여요. AI 눈에는 반사가 없거나 틀려요.", icon: "👁️" },
                { num: "2", title: "배경 글자를 읽어보세요", desc: "AI는 배경 간판이나 책의 글자를 제대로 만들지 못해요. 뭉개지거나 알 수 없는 기호가 섞임.", icon: "📖" },
                { num: "3", title: "구글 이미지 검색 / 역이미지 검색", desc: "의심스러운 사진은 구글에 이미지를 직접 끌어다 놓아 출처를 확인하세요.", icon: "🔍" },
                { num: "4", title: "AI 탐지 도구를 활용하세요", desc: "Hive Moderation, Illuminarty, FotoForensics 등 AI 이미지 탐지 웹사이트가 있어요.", icon: "🛡️" },
                { num: "5", title: "너무 완벽하면 의심하세요", desc: "피부가 너무 매끄럽고 조명이 완벽하고 표정이 자연스럽지 않으면 AI일 가능성 높아요.", icon: "🤔" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, background: "#0d1a2e", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#ef444422", border: "1px solid #ef444455", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div>
                    <p style={{ color: "#f87171", fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{s.num}. {s.title}</p>
                    <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 퀴즈 시작 버튼 ── */}
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>배운 내용을 토대로 직접 AI 영상을 구별해 보세요!</p>
            <button
              onClick={() => setPhase("intro")}
              style={{
                background: "linear-gradient(135deg,#f59e0b,#d97706)",
                color: "#fff", fontWeight: 900, fontSize: 17,
                padding: "18px 56px", borderRadius: 50, border: "none",
                cursor: "pointer", boxShadow: "0 0 40px #f59e0b55",
                letterSpacing: 0.5,
              }}
            >
              🕵️ 퀴즈 풀기
            </button>
          </div>
        </div>
      )}

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
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#fff", fontWeight: 900, fontSize: 16, padding: "16px 48px", borderRadius: 50, border: "none", cursor: "pointer", boxShadow: "0 0 32px #f59e0b44", marginBottom: 36 }}
          >
            🕵️ 탐정 도전 시작!
          </button>

          {/* ── 관련 영상 모음 ── */}
          <div style={{ textAlign: "left", marginTop: 8 }}>
            <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, letterSpacing: 2, textAlign: "center", marginBottom: 16 }}>📺 AI 탐정 관련 영상 모음</p>

            {/* AI가 만든 영상 예시 */}
            <div style={{ background: "#0f0f1a", border: "1px solid #fbbf2422", borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
              <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>🤖 AI가 만든 딥페이크 예시 (유튜브 공개 영상)</p>
              {[
                { title: "딥페이크로 만든 오바마 연설 — 가짜 영상 최초 공개", channel: "BuzzFeedVideo", tag: "유명 딥페이크 사례" },
                { title: "AI가 만든 가짜 뉴스 앵커 영상 — 실제 방송처럼 보이는 이유", channel: "VICE Korea", tag: "딥페이크 뉴스" },
                { title: "내 얼굴로 영상 만들어봤다 — AI 영상 생성 실험", channel: "테크 유튜버", tag: "체험 영상" },
              ].map((v, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid #1a1a2e" : "none" }}>
                  <div style={{ width: 36, height: 36, background: "#1a1400", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🎬</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#f1f5f9", fontSize: 12, fontWeight: 600, marginBottom: 2, lineHeight: 1.4 }}>{v.title}</p>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ color: "#6b7280", fontSize: 10 }}>{v.channel}</span>
                      <span style={{ background: "#fbbf2422", color: "#fbbf24", fontSize: 9, padding: "1px 6px", borderRadius: 6, fontWeight: 700 }}>{v.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
              <p style={{ color: "#374151", fontSize: 10, marginTop: 8 }}>💡 유튜브에서 &quot;딥페이크 탐지&quot; &quot;AI 가짜 영상&quot; 으로 검색해보세요</p>
            </div>

            {/* 사람이 만든 교육 영상 */}
            <div style={{ background: "#0f0f1a", border: "1px solid #22c55e22", borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
              <p style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>👨‍🏫 사람이 만든 AI 탐지 교육 영상</p>
              {[
                { title: "AI 영상인지 5초 안에 구별하는 방법 — 전문가가 알려주는 3가지 신호", channel: "경찰청 공식 유튜브", tag: "공식 교육" },
                { title: "딥페이크 피해 실제 사례 — 20대 피해자 인터뷰 (재연)", channel: "MBC 뉴스", tag: "피해 사례" },
                { title: "AI가 내 목소리를 복제하는 데 걸리는 시간은? — 3초 실험", channel: "SBS 뉴스", tag: "실험 영상" },
              ].map((v, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid #0f2010" : "none" }}>
                  <div style={{ width: 36, height: 36, background: "#0f2010", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📹</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#f1f5f9", fontSize: 12, fontWeight: 600, marginBottom: 2, lineHeight: 1.4 }}>{v.title}</p>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ color: "#6b7280", fontSize: 10 }}>{v.channel}</span>
                      <span style={{ background: "#22c55e22", color: "#22c55e", fontSize: 9, padding: "1px 6px", borderRadius: 6, fontWeight: 700 }}>{v.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
              <p style={{ color: "#374151", fontSize: 10, marginTop: 8 }}>💡 유튜브에서 &quot;딥페이크 탐지 방법&quot; &quot;AI 사기 피해&quot; 로 검색해보세요</p>
            </div>

            {/* 검색 팁 */}
            <div style={{ background: "#1a0a2e", border: "1px solid #7c3aed33", borderRadius: 12, padding: "12px 14px" }}>
              <p style={{ color: "#c58dc6", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>🔍 직접 찾아보는 법</p>
              {["유튜브: \"딥페이크 탐지\" \"AI 목소리 복제\" \"보이스피싱 실제 통화\"",
                "구글: \"딥페이크 사례 뉴스\" \"AI 생성 영상 구별법\"",
                "경찰청 유튜브 채널에 공식 교육 영상이 많아요!"].map((tip, i) => (
                <p key={i} style={{ color: "#7c3aed", fontSize: 11, lineHeight: 1.8 }}>· {tip}</p>
              ))}
            </div>
          </div>
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
