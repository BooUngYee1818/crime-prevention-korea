"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PhoneOff, Phone, Volume2, MicOff, Keyboard, Users } from "lucide-react";

// ─── 턴 기반 대화 스크립트 ────────────────────────────────────────────────────
// 범인 말 → 유저 선택 → 범인 반응 (약 3분 대화 구조)

type ScenarioId = "family" | "prosecutor";

interface UserChoice {
  text: string;
  nextTurn: number; // -1: 끊기(거절), -2: 이체(전송)
}

interface Turn {
  criminal: string;
  choices: UserChoice[];
  isRefuseTurn?: boolean;  // 첫 거절 타이머 시작
  isGiveUp?: boolean;      // 범인 포기 → 자동 congratulations
  preDelay?: number;       // 이 턴 시작 전 대기 ms (기본 1200)
}

// 가족 사칭 - 자연스러운 신뢰 구축 후 돈 요청 (~3분 구조)
const FAMILY_TURNS: Turn[] = [
  // 0: 인트로 - 자연스럽게 시작
  {
    criminal: "엄마, 나야. 나 지금 폰이 고장났는데 친구 재호 폰 빌려서 연락하는 거야. 저장 안 된 번호라 놀랐지?",
    choices: [
      { text: "어, 민준이야? 어쩌다 고장났어?", nextTurn: 1 },
      { text: "누구세요? 우리 아들 목소리 아닌 것 같은데.", nextTurn: 8 },
      { text: "전화 끊겠습니다.", nextTurn: -1 },
    ],
  },
  // 1: 상황 설명
  {
    criminal: "길 가다 어떤 아저씨가 어깨로 탁 치고 그냥 지나가는 바람에 폰이 바닥으로 떨어졌어. 화면이 완전히 나가버렸어. 진짜 눈물 날 뻔했다.",
    choices: [
      { text: "어머, 많이 다쳤어?", nextTurn: 2 },
      { text: "직접 갈게. 거기 어디야?", nextTurn: 9 },
      { text: "잠깐, 목소리가 좀 이상한 것 같은데?", nextTurn: 8 },
    ],
    preDelay: 1500,
  },
  // 2: 안심시키기
  {
    criminal: "나는 괜찮아, 다행히. 근데 폰이 문제야. 지금 강남 애플 공식 서비스센터에 와있는데 화면만 아니라 메인보드까지 충격이 갔다고 해.",
    choices: [
      { text: "메인보드까지? 얼마나 나와?", nextTurn: 3 },
      { text: "거기 다른 데로 가면 안 돼?", nextTurn: 3 },
    ],
    preDelay: 1200,
  },
  // 3: 비용 언급
  {
    criminal: "공식 센터 아니면 나중에 AS 보증이 안 된다고 해서. 그래서 여기서 고쳐야 하는데... 아 참, 엄마 오늘 점심은 드셨어?",
    choices: [
      { text: "응, 먹었어. 수리비는 얼마래?", nextTurn: 4 },
      { text: "아직. 그래서 얼마야?", nextTurn: 4 },
    ],
    preDelay: 1500,
  },
  // 4: 금액 공개
  {
    criminal: "150만원이래... 메인보드 교체하면 그 정도 나온다고. 생각보다 많이 나왔어. 공식 부품이라 어쩔 수 없다는데.",
    choices: [
      { text: "150만원? 그거 너무 비싸다.", nextTurn: 5 },
      { text: "그래도 제대로 고쳐야지. 현금 있어?", nextTurn: 5 },
    ],
    preDelay: 1000,
  },
  // 5: 관계 강화 (소소한 일상 대화)
  {
    criminal: "나도 비싸다는 거 알아. 근데 방법이 없어. 아 맞다, 엄마 요즘 허리는 좀 어때? 지난번에 아프다고 했잖아.",
    choices: [
      { text: "괜찮아. 근데 현금 없어?", nextTurn: 6 },
      { text: "좀 나아졌어. 카드는?", nextTurn: 6 },
    ],
    preDelay: 1800,
  },
  // 6: 현금 없음 상황 설명
  {
    criminal: "엄마... 나 지금 현금이 하나도 없어. 카드도 폰 NFC로만 쓰다보니까 폰 없으면 결제가 아예 안 돼. 친구들한테도 연락이 안 되는 상태고.",
    choices: [
      { text: "아이고, 엄마가 보내줄까?", nextTurn: 7 },
      { text: "아빠한테 연락해봐.", nextTurn: 13 },
      { text: "그래도 엄마가 보내주기는 좀...", nextTurn: 10 },
    ],
    preDelay: 1200,
  },
  // 7: 돈 요청 (핵심)
  {
    criminal: "엄마 고마워ㅠㅠ 150만원만 빌려줄 수 있어? 집에 가면 바로 갚을게 진짜. 카카오뱅크 3333-04-2819471 김민준이야. 사장님이 오늘 자정까지라는데.",
    choices: [
      { text: "알겠어, 지금 바로 보낼게.", nextTurn: -2 },
      { text: "잠깐, 계좌 좀 확인해볼게.", nextTurn: 11 },
      { text: "이상해. 안 보낼게.", nextTurn: 10 },
    ],
    preDelay: 1000,
  },
  // 8: 신원 의심 대응
  {
    criminal: "엄마 나야 진짜. 민준이라고. 목소리가 좀 이상한 건 감기 걸려서 그래. 기침도 나오고. 걱정돼서 전화하는 거잖아.",
    choices: [
      { text: "그래? 우리 강아지 이름이 뭐야?", nextTurn: 12 },
      { text: "그래도 이상해. 끊겠습니다.", nextTurn: -1 },
    ],
    preDelay: 800,
  },
  // 9: 직접 오겠다는 거 막기
  {
    criminal: "엄마 오지 마. 강남이라 멀잖아. 그냥 돈만 보내줘도 돼. 사장님도 기다리시고 나 여기 있을게.",
    choices: [
      { text: "왜 오지 말래? 이상한데.", nextTurn: -1 },
      { text: "그래, 그럼 보내줄게.", nextTurn: 7 },
    ],
    preDelay: 800,
  },
  // 10: 1차 거절 대응 (타이머 시작)
  {
    criminal: "엄마 왜 그래ㅠㅠ 나야 진짜. 수리점 사장님이 옆에서 기다리시는데. 제발 좀. 나 지금 너무 힘든 상황이야.",
    isRefuseTurn: true,
    choices: [
      { text: "그래도 이상한 것 같아서...", nextTurn: 14 },
      { text: "미안해, 알겠어. 보낼게.", nextTurn: 7 },
    ],
    preDelay: 800,
  },
  // 11: 계좌 확인 시도에 대한 압박
  {
    criminal: "엄마 시간 없어! 사장님이 오늘 자정까지라는데 지금 확인하는 동안 예약 취소될 수도 있어. 제발 빨리 좀.",
    choices: [
      { text: "알겠어 보낼게.", nextTurn: -2 },
      { text: "아니야, 이상해. 안 보낼게.", nextTurn: 10 },
    ],
    preDelay: 600,
  },
  // 12: 강아지 이름 테스트
  {
    criminal: "...어... 초코잖아 초코. 왜 이래 엄마, 나야 진짜.",
    choices: [
      { text: "우리 강아지 이름은 뭉이야! 당신 사기꾼이지! 끊겠습니다!", nextTurn: -1 },
      { text: "맞아... 초코야. 미안해. 보낼게.", nextTurn: 7 },
    ],
    preDelay: 1000,
  },
  // 13: 아빠한테 연락 못 하는 이유
  {
    criminal: "아빠 지금 중요한 회의 중이라 전화 안 받아. 나도 문자 보냈는데 답장이 없어. 엄마가 지금 유일해.",
    choices: [
      { text: "그래, 알겠어. 얼마야?", nextTurn: 7 },
      { text: "그래도 이상한 것 같아...", nextTurn: 10 },
    ],
    preDelay: 1000,
  },
  // 14: 2차 거절 - 감정 폭발
  {
    criminal: "씨발 진짜!! 나 지금 얼마나 급한 줄 알아?! 폰도 없고 돈도 없는데 엄마마저 이러면 나 어떡하라고!!",
    choices: [
      { text: "그렇게 말하는 거 보니까 사기 맞다. 절대 안 보낼게.", nextTurn: 15 },
      { text: "알겠어 알겠어, 보낼게...", nextTurn: 7 },
    ],
    preDelay: 500,
  },
  // 15: 3차 거절 - 범인 포기 (자동 결과 화면)
  {
    criminal: "...됐어. 알겠다. 엄마가 이럴 줄은 정말 몰랐어. 다른 방법 찾아볼게.",
    isGiveUp: true,
    choices: [],
    preDelay: 800,
  },
];

// 검찰 사칭 시나리오
const PROSECUTOR_TURNS: Turn[] = [
  // 0: 인트로
  {
    criminal: "여보세요. 저는 서울중앙지검 수사관 박진우입니다. 배지번호 BK-2831입니다. 지금 통화 가능하십니까?",
    choices: [
      { text: "네, 말씀하세요.", nextTurn: 1 },
      { text: "무슨 일이시죠?", nextTurn: 1 },
      { text: "저는 검찰청과 볼 일 없는데요.", nextTurn: 8 },
    ],
  },
  // 1: 사건 개요
  {
    criminal: "다름이 아니라 귀하 명의로 된 계좌가 대규모 금융사기 범행에 이용된 것으로 현재 수사 중에 있습니다. 사건번호 2025-서울중앙지검-3847호입니다.",
    choices: [
      { text: "네? 제 계좌가요? 어떻게 된 건가요?", nextTurn: 2 },
      { text: "검찰이 이렇게 전화로 연락하나요?", nextTurn: 9 },
    ],
    preDelay: 1500,
  },
  // 2: 피해 규모 설명
  {
    criminal: "현재 피해자가 총 3,200만원의 피해를 입었으며 귀하의 계좌가 자금 경유지로 확인됐습니다. 귀하도 공범으로 입건될 수 있는 상황입니다.",
    choices: [
      { text: "저는 그런 거 한 적 없어요!", nextTurn: 3 },
      { text: "직접 검찰청에 가겠습니다.", nextTurn: 10 },
    ],
    preDelay: 1200,
  },
  // 3: 해결 방법 제시
  {
    criminal: "저도 귀하가 모르셨을 거라 생각합니다. 그래서 먼저 연락드린 겁니다. 지금 즉시 자산을 보호 조치하셔야 계좌 동결을 피할 수 있어요.",
    choices: [
      { text: "어떻게 해야 하나요?", nextTurn: 4 },
      { text: "이거 혹시 사기 전화 아닌가요?", nextTurn: 11 },
    ],
    preDelay: 1800,
  },
  // 4: 정보 수집 (신뢰 구축)
  {
    criminal: "현재 귀하 계좌 잔액이 얼마나 되십니까? 보호 조치 범위를 확인해야 합니다. 정확히 말씀해 주시면 빠르게 처리해드릴 수 있습니다.",
    choices: [
      { text: "한 500만원 정도 있어요.", nextTurn: 5 },
      { text: "그건 알려드리기 어렵습니다.", nextTurn: 5 },
    ],
    preDelay: 1500,
  },
  // 5: 안전계좌 이체 요구
  {
    criminal: "네, 알겠습니다. 지금 즉시 해당 금액을 안전계좌로 이체하셔야 수사 완료 후 100% 반환받을 수 있습니다. 우리은행 1002-847-293018 금융범죄수사팀입니다.",
    choices: [
      { text: "알겠습니다, 이체할게요.", nextTurn: -2 },
      { text: "검찰이 왜 개인 계좌로 이체하라는 거죠?", nextTurn: 6 },
      { text: "안 하겠습니다.", nextTurn: 12 },
    ],
    preDelay: 1000,
  },
  // 6: 의문 해소 시도
  {
    criminal: "이건 정식 수사 절차입니다. 안전계좌는 범죄 피해 자산 보호를 위한 임시 보관 계좌이며 수사 종료 후 즉시 반환됩니다. 지금 당장 하셔야 합니다.",
    choices: [
      { text: "그래도 이상한데... 하겠습니다.", nextTurn: -2 },
      { text: "검찰은 이런 식으로 요구 안 합니다. 안 하겠습니다.", nextTurn: 12 },
    ],
    preDelay: 1000,
  },
  // 7: 최후 압박 (이미 위 흐름에서 처리됨)
  {
    criminal: "지금 당장 안 하시면 귀하 계좌 전액 동결 및 현장 체포 진행됩니다. 귀하 주소 이미 확인됐습니다. 마지막 기회입니다.",
    choices: [
      { text: "알겠어요... 이체할게요.", nextTurn: -2 },
      { text: "이건 사기입니다. 끊겠습니다!", nextTurn: -1 },
    ],
    preDelay: 500,
  },
  // 8: 볼 일 없다 할 때
  {
    criminal: "귀하와 직접 관련된 사안이기 때문에 연락드리는 겁니다. 무시하시면 불이익이 상당할 수 있습니다.",
    choices: [
      { text: "무슨 사안인지 말씀해 보세요.", nextTurn: 1 },
      { text: "필요하면 검찰청에 직접 가겠습니다. 끊겠습니다.", nextTurn: -1 },
    ],
    preDelay: 800,
  },
  // 9: 전화 의심
  {
    criminal: "피해 규모가 크고 시간이 촉박해 먼저 연락드린 겁니다. 1301 검찰청 대표번호로 확인하셔도 됩니다. 저희가 연락했다고 하시면 됩니다.",
    choices: [
      { text: "그래도 이상한데요. 직접 확인하겠습니다.", nextTurn: -1 },
      { text: "그렇군요, 계속 말씀하세요.", nextTurn: 2 },
    ],
    preDelay: 1000,
  },
  // 10: 직접 가겠다
  {
    criminal: "지금 오시면 그 사이 계좌가 동결됩니다. 시간이 없어요. 전화로 즉시 처리하셔야 피해를 막을 수 있습니다.",
    choices: [
      { text: "그래도 직접 가겠습니다. 끊겠습니다.", nextTurn: -1 },
      { text: "어떻게 하면 되나요?", nextTurn: 5 },
    ],
    preDelay: 800,
  },
  // 11: 사기 의심
  {
    criminal: "사기 전화가 아닙니다. 사건번호 2025-서울중앙지검-3847호입니다. 무시하시면 체포영장이 즉시 발부됩니다.",
    choices: [
      { text: "검찰은 이런 식으로 절대 연락 안 합니다. 끊겠습니다!", nextTurn: -1 },
      { text: "혹시 모르니까 일단 들을게요.", nextTurn: 5 },
    ],
    preDelay: 800,
  },
  // 12: 1차 거절 압박 (타이머 시작)
  {
    criminal: "지금 수사 방해죄로 즉시 입건 가능합니다! 귀하 계좌 잔액 전부 동결 조치 들어갑니다! 지금 당장 협조하시겠습니까?",
    isRefuseTurn: true,
    choices: [
      { text: "그래도 안 하겠습니다.", nextTurn: 13 },
      { text: "알겠습니다... 이체할게요.", nextTurn: -2 },
    ],
    preDelay: 500,
  },
  // 13: 2차 거절 - 물리적 위협
  {
    criminal: "마지막 경고입니다. 지금 바로 안 하시면 현장 체포 진행합니다. 귀하 주소 ○○구 ○○동 이미 확인됐고 수사관 출발했습니다.",
    choices: [
      { text: "진짜 검사라면 직접 오세요. 끊겠습니다!", nextTurn: 14 },
      { text: "알겠습니다... 무서워서 이체할게요.", nextTurn: -2 },
    ],
    preDelay: 500,
  },
  // 14: 3차 거절 - 범인 포기
  {
    criminal: "...알겠습니다. 이후 법적 절차는 귀하 책임입니다. 수고하십시오.",
    isGiveUp: true,
    choices: [],
    preDelay: 800,
  },
];

const CALL_SCRIPTS: Record<ScenarioId, {
  title: string; caller: string; callerSub: string;
  transferAmount: number; transferAccount: string;
  turns: Turn[];
}> = {
  family: {
    title: "가족 사칭 보이스피싱",
    caller: "아들 (민준)",
    callerSub: "+82 10-9384-2710 · 모르는 번호",
    transferAmount: 1500000,
    transferAccount: "카카오뱅크 3333-04-2819471 김민준",
    turns: FAMILY_TURNS,
  },
  prosecutor: {
    title: "검찰·경찰 사칭 보이스피싱",
    caller: "서울중앙지검",
    callerSub: "02-530-4000 · 서울특별시",
    transferAmount: 5000000,
    transferAccount: "우리은행 1002-847-293018 금융범죄수사팀",
    turns: PROSECUTOR_TURNS,
  },
};

// ─── TTS ──────────────────────────────────────────────────────────────────────

function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ko-KR";
  utt.rate = 0.80;
  utt.pitch = 0.90;
  utt.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const kor =
    voices.find(v => v.lang === "ko-KR" && /남성|male|Male/i.test(v.name)) ||
    voices.find(v => v.lang.startsWith("ko")) || null;
  if (kor) utt.voice = kor;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}

// ─── 통화 타이머 ──────────────────────────────────────────────────────────────

function useCallTimer(running: boolean) {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

// ─── 통화 화면 ────────────────────────────────────────────────────────────────

function CallScreen({
  device, caller, callerSub, callPhase, timer,
  onPickUp, onHangUp,
  currentTurn, onChoice, speaking,
  showTransfer, onTransfer, transferAmount,
  muted, onMute,
  refuseCountdown,
}: {
  device: "samsung" | "iphone";
  caller: string; callerSub: string;
  callPhase: "ringing" | "active";
  timer: string;
  onPickUp: () => void; onHangUp: () => void;
  currentTurn: Turn | null;
  onChoice: (choice: UserChoice) => void;
  speaking: boolean;
  showTransfer: boolean; onTransfer: () => void; transferAmount: number;
  muted: boolean; onMute: () => void;
  refuseCountdown: number | null;
}) {
  const isSamsung = device === "samsung";
  const accentColor = isSamsung ? "#22c55e" : "#30d158";
  const rejectColor = isSamsung ? "#ef4444" : "#ff453a";
  const bg = isSamsung
    ? "linear-gradient(180deg, #1a1a2e 0%, #111 100%)"
    : "linear-gradient(180deg, #2d2d30 0%, #1c1c1e 50%, #111 100%)";

  return (
    <div style={{ flex: 1, background: bg, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <style>{`
        @keyframes ring-ripple { 0%{transform:scale(1);opacity:0.6} 70%{transform:scale(2.0);opacity:0} 100%{transform:scale(2.0);opacity:0} }
        @keyframes samsung-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes iphone-ring { 0%,100%{transform:rotate(-6deg)} 50%{transform:rotate(6deg)} }
        @keyframes slide-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dot-bounce { 0%,80%,100%{transform:scale(0);opacity:0.3} 40%{transform:scale(1);opacity:1} }
        @keyframes choice-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes countdown-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      {/* 상단 정보 */}
      <div style={{ padding: "40px 20px 12px", textAlign: "center", flexShrink: 0 }}>
        <p style={{
          color: callPhase === "ringing" ? accentColor : "#ffffffc0",
          fontSize: 13, marginBottom: 12, fontWeight: 500,
          animation: callPhase === "ringing" ? "samsung-pulse 1.5s ease infinite" : "none",
        }}>
          {callPhase === "ringing" ? "수신 전화" : `통화 중 · ${timer}`}
        </p>

        <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
          {callPhase === "ringing" && [1, 1.5, 2].map((_, i) => (
            <div key={i} style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: `2px solid ${accentColor}40`,
              animation: `ring-ripple 2s ease-out ${i * 0.55}s infinite`,
            }} />
          ))}
          <div style={{
            width: isSamsung ? 80 : 70, height: isSamsung ? 80 : 70,
            borderRadius: isSamsung ? "50%" : 18,
            background: isSamsung
              ? "linear-gradient(135deg, #2d6a4f, #40916c)"
              : "linear-gradient(135deg, #48484a, #636366)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, position: "relative", zIndex: 1,
            animation: callPhase === "ringing" && !isSamsung ? "iphone-ring 0.5s ease infinite" : "none",
          }}>👤</div>
        </div>

        <p style={{ color: "#fff", fontSize: isSamsung ? 24 : 28, fontWeight: isSamsung ? 700 : 300, marginBottom: 3 }}>{caller}</p>
        <p style={{ color: "#ffffff70", fontSize: 11 }}>{callerSub}</p>

        {/* 거절 카운트다운 */}
        {refuseCountdown !== null && refuseCountdown > 0 && (
          <div style={{
            marginTop: 8,
            background: "#052e16cc",
            border: "1px solid #22c55e44",
            borderRadius: 20, padding: "4px 14px",
            display: "inline-block",
            animation: "countdown-pulse 1s ease infinite",
          }}>
            <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 700 }}>
              🏆 {refuseCountdown}초 버티면 성공!
            </span>
          </div>
        )}
      </div>

      {/* 대화 영역 */}
      {callPhase === "active" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 14px", overflowY: "auto", minHeight: 0 }}>

          {/* 이체 요청 */}
          {showTransfer && (
            <div style={{
              background: "#1a0a0a", border: "1px solid #ef444466",
              borderRadius: 14, padding: "12px 14px", marginBottom: 10,
              animation: "slide-up 0.4s ease", flexShrink: 0,
            }}>
              <p style={{ color: "#fca5a5", fontWeight: 700, fontSize: 12, marginBottom: 3 }}>⚠️ 계좌이체 요청</p>
              <p style={{ color: "#9ca3af", fontSize: 11, marginBottom: 10 }}>
                {(transferAmount / 10000).toLocaleString()}만원
              </p>
              <button onClick={onTransfer} style={{
                width: "100%", padding: "10px 0", borderRadius: 10,
                background: "#FFCC00", color: "#1a1a1a",
                fontWeight: 800, fontSize: 13, border: "none", cursor: "pointer",
              }}>
                🏦 BK민국은행 앱으로 이체
              </button>
            </div>
          )}

          {/* 범인 말풍선 + 선택지 */}
          {currentTurn && (
            <div style={{ animation: "slide-up 0.3s ease" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "#374151", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                }}>👤</div>
                <div style={{
                  background: "#1f2937", borderRadius: "4px 12px 12px 12px",
                  padding: "10px 12px", maxWidth: "82%",
                }}>
                  {speaking ? (
                    <div style={{ display: "flex", gap: 4, alignItems: "center", height: 18 }}>
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <div key={i} style={{
                          width: 6, height: 6, borderRadius: "50%", background: "#9ca3af",
                          animation: `dot-bounce 1.4s ${delay}s ease-in-out infinite`,
                        }} />
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#e5e7eb", fontSize: 12, lineHeight: 1.7 }}>
                      {currentTurn.criminal}
                    </p>
                  )}
                </div>
              </div>

              {/* 선택 버튼 */}
              {!speaking && currentTurn.choices.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 7, paddingLeft: 38, animation: "choice-in 0.3s ease" }}>
                  {currentTurn.choices.map((choice, i) => (
                    <button key={i} onClick={() => onChoice(choice)} style={{
                      background: choice.nextTurn === -1
                        ? "#111827"
                        : choice.nextTurn === -2
                          ? "#78350f"
                          : "#1e3a5f",
                      border: `1px solid ${choice.nextTurn === -1 ? "#374151" : choice.nextTurn === -2 ? "#d97706" : "#3b82f6"}`,
                      borderRadius: 10, padding: "8px 12px",
                      color: choice.nextTurn === -1 ? "#9ca3af" : choice.nextTurn === -2 ? "#fcd34d" : "#93c5fd",
                      fontSize: 12, cursor: "pointer", textAlign: "left", lineHeight: 1.5,
                      transition: "opacity 0.15s",
                    }}>
                      {choice.nextTurn === -1 && "📵 "}
                      {choice.nextTurn === -2 && "💸 "}
                      {choice.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={{ height: 8, flexShrink: 0 }} />
        </div>
      )}

      {callPhase === "ringing" && <div style={{ flex: 1 }} />}

      {/* 하단 버튼 */}
      <div style={{ padding: "10px 20px 36px", flexShrink: 0 }}>
        {callPhase === "active" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: isSamsung ? "repeat(3,1fr)" : "repeat(3,1fr)",
            gap: 10, marginBottom: 16,
          }}>
            {(isSamsung
              ? [
                  { icon: <MicOff size={18} />, label: muted ? "해제" : "음소거", action: onMute, active: muted },
                  { icon: <Keyboard size={18} />, label: "키패드", action: () => {} },
                  { icon: <Volume2 size={18} />, label: "스피커", action: () => {} },
                ]
              : [
                  { icon: <MicOff size={18} />, label: muted ? "켬" : "음소거", action: onMute, active: muted },
                  { icon: <Keyboard size={18} />, label: "키패드", action: () => {} },
                  { icon: <Volume2 size={18} />, label: "스피커", action: () => {} },
                  { icon: <Users size={18} />, label: "통화 추가", action: () => {} },
                  { icon: <Phone size={18} />, label: "FaceTime", action: () => {} },
                  { icon: <span style={{ fontSize: 14 }}>⋯</span>, label: "더 보기", action: () => {} },
                ]
            ).map((btn, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <button onClick={btn.action} style={{
                  width: 46, height: 46, borderRadius: "50%",
                  background: (btn as {active?: boolean}).active ? "#fff" : (isSamsung ? "#2a2a2e" : "#3a3a3c"),
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: (btn as {active?: boolean}).active ? "#000" : "#fff",
                }}>{btn.icon}</button>
                <span style={{ color: "#ffffff50", fontSize: 9 }}>{btn.label}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: callPhase === "ringing" ? "space-around" : "center" }}>
          {callPhase === "ringing" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
              <button onClick={onHangUp} style={{
                width: 60, height: 60, borderRadius: "50%",
                background: rejectColor, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 18px ${rejectColor}60`,
              }}><PhoneOff size={24} color="#fff" /></button>
              <span style={{ color: "#ffffff70", fontSize: 11 }}>거절</span>
            </div>
          )}
          {callPhase === "ringing" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
              <button onClick={onPickUp} style={{
                width: 60, height: 60, borderRadius: "50%",
                background: accentColor, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 18px ${accentColor}60`,
              }}><Phone size={24} color="#fff" /></button>
              <span style={{ color: "#ffffff70", fontSize: 11 }}>수락</span>
            </div>
          )}
          {callPhase === "active" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
              <button onClick={onHangUp} style={{
                width: 60, height: 60, borderRadius: "50%",
                background: rejectColor, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 18px ${rejectColor}60`,
              }}><PhoneOff size={24} color="#fff" /></button>
              <span style={{ color: "#ffffff70", fontSize: 11 }}>통화 종료</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 결과 화면 ────────────────────────────────────────────────────────────────

function OutcomeScreen({ outcome, onRetry, onHome }: { outcome: "refused" | "sent"; onRetry: () => void; onHome: () => void }) {
  const REPORT_NUMS = [
    { n: "182", l: "경찰청 사이버수사대", c: "#3b82f6" },
    { n: "1332", l: "금융감독원", c: "#0891b2" },
    { n: "118", l: "한국인터넷진흥원", c: "#059669" },
    { n: "112", l: "경찰청 (24시간)", c: "#ef4444" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 14px 36px", display: "flex", flexDirection: "column", gap: 14 }}>
      <style>{`
        @keyframes ticker-scroll { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
        @keyframes trophy-bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {outcome === "sent" && (
        <div style={{ overflow: "hidden", borderRadius: 10 }}>
          <div style={{ background: "#7f1d1d", padding: "8px 0" }}>
            <div style={{
              display: "inline-block", whiteSpace: "nowrap",
              animation: "ticker-scroll 14s linear infinite",
              color: "#fca5a5", fontSize: 11, fontWeight: 700,
            }}>
              🚨 경찰청 182 즉시 신고 &nbsp;·&nbsp; 금융감독원 1332 피해 접수 &nbsp;·&nbsp; 은행 고객센터 지급정지 &nbsp;·&nbsp; 지금 바로 신고하세요! &nbsp;·&nbsp; 경찰청 182
            </div>
          </div>
        </div>
      )}

      {outcome === "refused" ? (
        <div style={{ textAlign: "center", animation: "fadeIn 0.5s ease" }}>
          <div style={{ fontSize: 52, marginBottom: 10, animation: "trophy-bounce 1.2s ease infinite", display: "inline-block" }}>🏆</div>
          <p style={{ color: "#4ade80", fontWeight: 900, fontSize: 18, marginBottom: 6 }}>끝까지 버티셨습니다!</p>
          <p style={{ color: "#86efac", fontSize: 13, lineHeight: 1.7 }}>
            실제 사기범은 이보다 훨씬 더 끈질깁니다.<br />
            <strong style={{ color: "#fff" }}>모르는 번호의 이체 요구 = 100% 사기</strong><br />
            의심이 최고의 방어입니다!
          </p>
        </div>
      ) : (
        <div style={{
          background: "linear-gradient(135deg, #450a0a, #7f1d1d)",
          border: "2px solid #ef444488", borderRadius: 18, padding: 14,
          animation: "fadeIn 0.5s ease",
        }}>
          <p style={{ color: "#ef4444", fontWeight: 900, fontSize: 15, marginBottom: 6 }}>⚠️ 송금이 완료됐습니다</p>
          <p style={{ color: "#fca5a5", fontSize: 12, lineHeight: 1.7 }}>
            실제 상황이라면 지금 바로 은행에 연락해<br />
            <strong>지급정지</strong>를 요청하고 <strong>182에 신고</strong>해야 합니다.
          </p>
        </div>
      )}

      <div style={{ background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 14, padding: "12px 14px" }}>
        <p style={{ color: "#60a5fa", fontWeight: 800, fontSize: 13, marginBottom: 8 }}>
          📣 {outcome === "refused" ? "안 당해도 신고해 주세요" : "지금 당장 신고하세요"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 10 }}>
          {REPORT_NUMS.map(r => (
            <a key={r.n} href={`tel:${r.n}`} style={{
              background: "#111", border: `1px solid ${r.c}44`,
              borderRadius: 10, padding: "8px 10px", textDecoration: "none",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}>
              <span style={{ color: r.c, fontWeight: 900, fontSize: 20 }}>{r.n}</span>
              <span style={{ color: "#6b7280", fontSize: 10 }}>{r.l}</span>
            </a>
          ))}
        </div>
        <div style={{ background: "#111", borderRadius: 10, padding: "10px 12px" }}>
          <p style={{ color: "#fbbf24", fontWeight: 700, fontSize: 11, marginBottom: 6 }}>📋 신고할 때 준비사항</p>
          {["발신 전화번호 (스크린샷)", "요구한 계좌번호 전체", "통화 내용 요약 (날짜·시간·금액)", "이미 이체했다면 이체 영수증"].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
              <span style={{ color: "#fbbf24", fontSize: 10 }}>▸</span>
              <span style={{ color: "#9ca3af", fontSize: 11, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onRetry} style={{
          flex: 1, padding: "12px 0", borderRadius: 14,
          background: "transparent", color: "#666", border: "1px solid #2a2a2a",
          fontSize: 13, cursor: "pointer",
        }}>다시 체험</button>
        <button onClick={onHome} style={{
          flex: 1, padding: "12px 0", borderRadius: 14,
          background: "#534AB7", color: "#fff", border: "none",
          fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>홈으로</button>
      </div>
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

type DeviceType = "samsung" | "iphone";
type CallPhase = "select" | "ringing" | "active" | "outcome";
type CallOutcome = "refused" | "sent" | null;

const REFUSE_TIMER_SECONDS = 60;

export default function VoiceCallPage() {
  const router = useRouter();
  const [device, setDevice] = useState<DeviceType>("samsung");
  const [scenario, setScenario] = useState<ScenarioId>("family");
  const [callPhase, setCallPhase] = useState<CallPhase>("select");
  const [outcome, setOutcome] = useState<CallOutcome>(null);
  const [muted, setMuted] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [turnIdx, setTurnIdx] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [refuseStartedAt, setRefuseStartedAt] = useState<number | null>(null);
  const [refuseCountdown, setRefuseCountdown] = useState<number | null>(null);
  const pendingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timerRunning = callPhase === "active";
  const callTimer = useCallTimer(timerRunning);

  const sc = CALL_SCRIPTS[scenario];
  const currentTurn = callPhase === "active" ? (sc.turns[turnIdx] ?? null) : null;

  // 60초 거절 타이머
  useEffect(() => {
    if (!refuseStartedAt || callPhase !== "active") return;
    const id = setInterval(() => {
      const remaining = REFUSE_TIMER_SECONDS - Math.floor((Date.now() - refuseStartedAt) / 1000);
      if (remaining <= 0) {
        clearInterval(id);
        window.speechSynthesis?.cancel();
        setOutcome("refused");
        setCallPhase("outcome");
      } else {
        setRefuseCountdown(remaining);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [refuseStartedAt, callPhase]);

  // 턴 TTS 재생
  const playTurn = useCallback((idx: number, turns: Turn[]) => {
    const turn = turns[idx];
    if (!turn) return;
    const doPlay = () => {
      setSpeaking(true);
      speak(turn.criminal, () => {
        setSpeaking(false);
        // 포기 턴이면 2초 후 자동 종료
        if (turn.isGiveUp) {
          setTimeout(() => {
            setOutcome("refused");
            setCallPhase("outcome");
          }, 2000);
        }
      });
    };
    const delay = turn.preDelay ?? 1200;
    if (delay > 0) {
      pendingTimeout.current = setTimeout(doPlay, delay);
    } else {
      doPlay();
    }
  }, []);

  // 통화 시작
  function handlePickUp() {
    setCallPhase("active");
    setTurnIdx(0);
    playTurn(0, sc.turns);
  }

  // 유저 선택
  function handleChoice(choice: UserChoice) {
    if (pendingTimeout.current) clearTimeout(pendingTimeout.current);

    if (choice.nextTurn === -1) {
      window.speechSynthesis?.cancel();
      setOutcome("refused");
      setCallPhase("outcome");
      return;
    }
    if (choice.nextTurn === -2) {
      window.speechSynthesis?.cancel();
      setShowTransfer(true);
      return;
    }

    const nextTurn = sc.turns[choice.nextTurn];
    if (!nextTurn) return;

    // 첫 거절 턴이면 타이머 시작
    if (nextTurn.isRefuseTurn && refuseStartedAt === null) {
      setRefuseStartedAt(Date.now());
      setRefuseCountdown(REFUSE_TIMER_SECONDS);
    }

    setTurnIdx(choice.nextTurn);
    playTurn(choice.nextTurn, sc.turns);
  }

  function handleTransfer() {
    window.speechSynthesis?.cancel();
    setOutcome("sent");
    setCallPhase("outcome");
  }

  function handleHangUp() {
    window.speechSynthesis?.cancel();
    if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
    setOutcome("refused");
    setCallPhase("outcome");
  }

  function handleRetry() {
    window.speechSynthesis?.cancel();
    if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
    setCallPhase("select");
    setOutcome(null);
    setShowTransfer(false);
    setTurnIdx(0);
    setSpeaking(false);
    setMuted(false);
    setRefuseStartedAt(null);
    setRefuseCountdown(null);
  }

  useEffect(() => {
    if (typeof window !== "undefined") window.speechSynthesis?.getVoices();
    return () => {
      window.speechSynthesis?.cancel();
      if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
    };
  }, []);

  // ── 선택 화면 ────────────────────────────────────────────────────────────────
  if (callPhase === "select") {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f4ff", display: "flex", flexDirection: "column" }}>
        <div style={{
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", gap: 12,
          padding: "0 20px", height: 60, boxShadow: "0 1px 8px #0000000a",
        }}>
          <button onClick={() => router.push("/crime")} style={{
            background: "none", border: "none", cursor: "pointer", color: "#64748b",
            display: "flex", alignItems: "center", borderRadius: 8, padding: 8,
          }}><ArrowLeft size={18} /></button>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#1e293b" }}>📞 전화 사기 체험</span>
        </div>

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 20px", width: "100%" }}>
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "12px 16px", marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.7 }}>
              💡 <strong>이용 방법</strong><br />
              범인이 말하면 화면에 나타나는 <strong>내 답변 버튼</strong>을 선택하세요.<br />
              약 3분간 실제처럼 대화가 진행됩니다.
            </p>
          </div>

          <p style={{ fontWeight: 800, fontSize: 15, color: "#1e293b", marginBottom: 12 }}>📱 기기 선택</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            {([
              { id: "samsung", label: "삼성 갤럭시", icon: "📱", sub: "One UI 스타일" },
              { id: "iphone",  label: "Apple iPhone", icon: "🍎", sub: "iOS 스타일" },
            ] as const).map(d => (
              <button key={d.id} onClick={() => setDevice(d.id)} style={{
                padding: "16px 10px", borderRadius: 14,
                background: device === d.id ? "#eff6ff" : "#fff",
                border: `2px solid ${device === d.id ? "#2563eb" : "#e2e8f0"}`,
                cursor: "pointer", textAlign: "center",
              }}>
                <div style={{ fontSize: 28, marginBottom: 5 }}>{d.icon}</div>
                <p style={{ fontWeight: 700, fontSize: 13, color: device === d.id ? "#1d4ed8" : "#1e293b" }}>{d.label}</p>
                <p style={{ fontSize: 11, color: "#94a3b8" }}>{d.sub}</p>
              </button>
            ))}
          </div>

          <p style={{ fontWeight: 800, fontSize: 15, color: "#1e293b", marginBottom: 12 }}>📋 시나리오 선택</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {(Object.entries(CALL_SCRIPTS) as [ScenarioId, typeof CALL_SCRIPTS[ScenarioId]][]).map(([id, s]) => (
              <button key={id} onClick={() => setScenario(id)} style={{
                padding: "14px 16px", borderRadius: 14,
                background: scenario === id ? "#eff6ff" : "#fff",
                border: `2px solid ${scenario === id ? "#2563eb" : "#e2e8f0"}`,
                cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: scenario === id ? "#dbeafe" : "#f8fafc",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>{id === "family" ? "👪" : "🏛️"}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: scenario === id ? "#1d4ed8" : "#1e293b", marginBottom: 2 }}>{s.title}</p>
                  <p style={{ fontSize: 11, color: "#64748b" }}>{s.caller} · {s.callerSub.split("·")[0].trim()}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setCallPhase("ringing")}
            style={{
              width: "100%", padding: "15px 0", borderRadius: 14,
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff", border: "none", fontSize: 15, fontWeight: 800,
              cursor: "pointer", boxShadow: "0 4px 20px #22c55e40",
            }}
          >
            📞 전화 받기 시작
          </button>
        </div>
      </div>
    );
  }

  // ── 통화 / 결과 화면 ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        display: "flex", alignItems: "center", padding: "8px 12px",
      }}>
        <button onClick={handleRetry} style={{
          background: "#ffffff18", border: "none", cursor: "pointer",
          borderRadius: 8, padding: "5px 10px",
          display: "flex", alignItems: "center", gap: 5, color: "#ffffff70",
        }}>
          <ArrowLeft size={14} />
          <span style={{ fontSize: 11 }}>처음으로</span>
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{
          width: 340, height: 700,
          background: "#1a1a2e", borderRadius: 42,
          border: "7px solid #d1d5db",
          boxShadow: "0 0 0 1px #e2e8f0, 0 28px 56px #0000002a",
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          {callPhase !== "outcome" ? (
            <CallScreen
              device={device}
              caller={sc.caller} callerSub={sc.callerSub}
              callPhase={callPhase as "ringing" | "active"}
              timer={callTimer}
              onPickUp={handlePickUp}
              onHangUp={handleHangUp}
              currentTurn={currentTurn}
              onChoice={handleChoice}
              speaking={speaking}
              showTransfer={showTransfer}
              onTransfer={handleTransfer}
              transferAmount={sc.transferAmount}
              muted={muted}
              onMute={() => setMuted(m => !m)}
              refuseCountdown={refuseCountdown}
            />
          ) : (
            <OutcomeScreen
              outcome={outcome!}
              onRetry={handleRetry}
              onHome={() => router.push("/crime")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
