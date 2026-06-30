"use client";
import { useState, useEffect, useRef } from "react";

type Scene = null | "deepfake-blackmail" | "voice-clone" | "spear-phishing" | "fake-doc" | "malware-gpt";

interface CrimeCard {
  id: Scene;
  icon: string;
  tag: string;
  color: string;
  bg: string;
  title: string;
  subtitle: string;
  year: string;
  reality: string;
}

const CRIMES: CrimeCard[] = [
  {
    id: "deepfake-blackmail",
    icon: "🎭",
    tag: "DEEPFAKE",
    color: "#c58dc6",
    bg: "linear-gradient(135deg,#500724,#be185d)",
    title: "딥페이크 성착취 협박",
    subtitle: "얼굴만 있으면 만든다",
    year: "2023~현재",
    reality: "국내 10대 피해자 급증, 텔레그램 N번방 계열 신종",
  },
  {
    id: "voice-clone",
    icon: "🎙️",
    tag: "VOICE AI",
    color: "#c58dc6",
    bg: "linear-gradient(135deg,#2e1065,#7c3aed)",
    title: "AI 음성 복제 보이스피싱",
    subtitle: "3초면 당신 목소리가 된다",
    year: "2022~현재",
    reality: "가족·CEO 목소리 복제, 실시간 통화 중 AI 변조",
  },
  {
    id: "spear-phishing",
    icon: "🎯",
    tag: "GPT PHISH",
    color: "#34d399",
    bg: "linear-gradient(135deg,#052e16,#16a34a)",
    title: "AI 맞춤 스피어피싱",
    subtitle: "개인 정보 분석 후 완벽한 사기 문자",
    year: "2023~현재",
    reality: "SNS 크롤링 → 개인화 문자 → 피해 1건당 수천만원",
  },
  {
    id: "fake-doc",
    icon: "📄",
    tag: "FAKE DOC",
    color: "#fbbf24",
    bg: "linear-gradient(135deg,#1c1002,#d97706)",
    title: "AI 위조 서류·신분증",
    subtitle: "완벽한 가짜 계약서·여권",
    year: "2023~현재",
    reality: "전세사기·투자사기에 AI 생성 가짜 등기부등본 활용",
  },
  {
    id: "malware-gpt",
    icon: "🦠",
    tag: "AI HACK",
    color: "#f87171",
    bg: "linear-gradient(135deg,#1a0000,#dc2626)",
    title: "AI 악성코드 자동 생성",
    subtitle: "코딩 몰라도 해킹 가능",
    year: "2023~현재",
    reality: "WormGPT·FraudGPT 등 범죄 특화 LLM 암시장 유통",
  },
];

// ── 딥페이크 성착취 협박 시뮬레이션 ──
function DeepfakeBlackmailSim({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      bg: "#0a0010",
      content: (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
          <p style={{ color: "#c58dc6", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>텔레그램 DM 수신</p>
          <div style={{ background: "#1a0020", border: "1px solid #c58dc644", borderRadius: 12, padding: "16px 20px", marginBottom: 20, textAlign: "left" }}>
            <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>알 수 없는 번호 · 방금 전</p>
            <p style={{ color: "#f4f4f5", fontSize: 14, lineHeight: 1.8 }}>
              안녕하세요. 귀하의 얼굴이 포함된 영상을 보유하고 있습니다.<br />
              24시간 내에 응하지 않으시면 지인 전체에게 유포하겠습니다.
            </p>
          </div>
          <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.7 }}>
            SNS 프로필 사진 한 장으로<br />AI가 가짜 영상을 생성합니다.
          </p>
        </div>
      ),
    },
    {
      bg: "#0a0010",
      content: (
        <div>
          <p style={{ color: "#c58dc6", fontWeight: 700, fontSize: 13, marginBottom: 16 }}>🤖 AI가 하는 일</p>
          {[
            { step: "①", text: "인스타·페이스북 공개 사진 수집", detail: "얼굴 각도 3장 이상이면 충분" },
            { step: "②", text: "딥페이크 생성 (처리 시간 약 2분)", detail: "무료 오픈소스 AI 도구로 가능" },
            { step: "③", text: "텔레그램으로 협박 DM 발송", detail: "봇이 수천 명에게 동시 발송" },
            { step: "④", text: "입금 계좌 안내 (가상화폐)", detail: "추적 불가능한 해외 거래소 활용" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 12, background: "#150020", border: "1px solid #f472b422", borderRadius: 10, padding: "12px 14px" }}>
              <span style={{ color: "#c58dc6", fontWeight: 900, fontSize: 16, flexShrink: 0 }}>{r.step}</span>
              <div>
                <p style={{ color: "#f4f4f5", fontSize: 13, fontWeight: 700 }}>{r.text}</p>
                <p style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      bg: "#0a0010",
      content: (
        <div>
          <p style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>✅ 이렇게 대응하세요</p>
          {[
            "절대 돈을 보내지 마세요 — 한 번 보내면 추가 요구가 이어집니다",
            "경찰청 사이버수사대 182 또는 여성긴급전화 1366에 신고하세요",
            "SNS 프로필 사진을 비공개로 전환하세요",
            "텔레그램·카카오에 해당 계정을 신고·차단하세요",
            "증거 스크린샷을 보관한 뒤 메시지는 삭제하지 마세요",
          ].map((t, i) => (
            <p key={i} style={{ color: "#86efac", fontSize: 12, lineHeight: 1.7, paddingLeft: 8, borderLeft: "2px solid #22c55e44", marginBottom: 8 }}>{t}</p>
          ))}
          <div style={{ background: "#1a102a", borderRadius: 10, padding: "12px 14px", marginTop: 16 }}>
            <p style={{ color: "#22c55e", fontSize: 13, fontWeight: 700 }}>☎ 182 · 1366 · 117</p>
            <p style={{ color: "#6b7280", fontSize: 11 }}>사이버수사대 · 여성긴급전화 · 학교폭력신고</p>
          </div>
        </div>
      ),
    },
  ];
  return <SimModal title="딥페이크 성착취 협박" color="#c58dc6" steps={steps} step={step} setStep={setStep} onClose={onClose} />;
}

// ── AI 음성 복제 시뮬레이션 ──
function VoiceCloneSim({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [waveActive, setWaveActive] = useState(false);
  useEffect(() => { if (step === 0) { setWaveActive(true); const t = setTimeout(() => setWaveActive(false), 3000); return () => clearTimeout(t); } }, [step]);
  const steps = [
    {
      bg: "#0a001a",
      content: (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📞</div>
          <p style={{ color: "#c58dc6", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>수신 전화 — "아버지"</p>
          <div style={{ background: "#1a1030", border: "1px solid #7c3aed44", borderRadius: 12, padding: "20px", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 4, justifyContent: "center", alignItems: "flex-end", height: 36, marginBottom: 8 }}>
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} style={{ width: 4, borderRadius: 2, background: waveActive ? "#c58dc6" : "#374151", height: waveActive ? `${Math.random() * 28 + 8}px` : "8px", transition: "height 0.1s, background 0.3s" }} />
              ))}
            </div>
            <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.9, fontStyle: "italic" }}>
              "야, 나야. 아버지.<br />
              지금 갑자기 교통사고가 났는데<br />합의금이 급하게 필요해..."
            </p>
          </div>
          <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.7 }}>
            목소리는 100% 진짜처럼 들립니다.<br />3초 분량 샘플로 실시간 복제가 가능합니다.
          </p>
        </div>
      ),
    },
    {
      bg: "#0a001a",
      content: (
        <div>
          <p style={{ color: "#c58dc6", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>🤖 AI 음성 복제 과정</p>
          {[
            { label: "샘플 수집", desc: "유튜브 영상, 전화 녹음, SNS 라이브 3초~30초면 충분" },
            { label: "음성 모델 학습", desc: "ElevenLabs·RVC 등 무료 AI로 목소리 패턴·억양·숨소리까지 복제" },
            { label: "실시간 변조 통화", desc: "전화 중 본인 목소리를 실시간으로 복제 목소리로 변환해 발신" },
            { label: "긴급 상황 설정", desc: "사고·납치·체포 등 확인할 시간이 없게 만드는 시나리오 삽입" },
          ].map((r, i) => (
            <div key={i} style={{ background: "#150030", border: "1px solid #7c3aed33", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
              <p style={{ color: "#c58dc6", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>STEP {i + 1} · {r.label}</p>
              <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      bg: "#0a001a",
      content: (
        <div>
          <p style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>✅ 방어법 — 가족 암호 설정</p>
          <div style={{ background: "#1a102a", border: "1px solid #22c55e44", borderRadius: 12, padding: "20px", marginBottom: 16 }}>
            <p style={{ color: "#86efac", fontWeight: 700, fontSize: 14, marginBottom: 10 }}>지금 바로 가족 암호를 정하세요</p>
            <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.8 }}>
              예시: "우리 강아지 이름이 뭐야?"<br />
              → AI는 실시간으로 정확한 답을 알 수 없습니다.<br />
              → 맞추지 못하면 즉시 전화를 끊고 직접 연락하세요.
            </p>
          </div>
          {[
            "전화 중 계좌이체 요구는 무조건 끊고 직접 확인",
            "발신 번호가 저장된 번호여도 목소리만으로 믿지 마세요",
            "경찰청 사이버수사대 182에 신고",
          ].map((t, i) => (
            <p key={i} style={{ color: "#86efac", fontSize: 12, lineHeight: 1.7, marginBottom: 8, paddingLeft: 8, borderLeft: "2px solid #22c55e44" }}>{t}</p>
          ))}
        </div>
      ),
    },
  ];
  return <SimModal title="AI 음성 복제 보이스피싱" color="#c58dc6" steps={steps} step={step} setStep={setStep} onClose={onClose} />;
}

// ── 스피어피싱 시뮬레이션 ──
function SpearPhishingSim({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const fullText = "[김민준]님, 오늘 제주도 여행 즐거우셨나요? 방금 OO카드에서 제주 렌터카 결제 34만원이 승인됐습니다. 본인 아니면 즉시 → bit.ly/card-stop";
  useEffect(() => {
    if (step === 0) {
      setTyped("");
      let i = 0;
      const id = setInterval(() => {
        setTyped(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(id);
      }, 40);
      return () => clearInterval(id);
    }
  }, [step]);
  const steps = [
    {
      bg: "#001a0a",
      content: (
        <div>
          <p style={{ color: "#34d399", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>📱 문자 수신 — 방금 전</p>
          <div style={{ background: "#0a1a10", border: "1px solid #34d39944", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
            <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 8 }}>발신: 카드사-공식</p>
            <p style={{ color: "#f4f4f5", fontSize: 14, lineHeight: 1.9, fontFamily: "monospace", minHeight: 80 }}>{typed}<span style={{ animation: "blink 0.7s infinite", color: "#34d399" }}>|</span></p>
          </div>
          <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.7 }}>
            실명·현재 위치·실제 카드사명까지 정확합니다.<br />
            AI가 SNS를 분석해 맞춤 제작한 사기 문자입니다.
          </p>
        </div>
      ),
    },
    {
      bg: "#001a0a",
      content: (
        <div>
          <p style={{ color: "#34d399", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>🤖 AI 스피어피싱 과정</p>
          {[
            { label: "SNS 크롤링", desc: "인스타그램 게시물·위치태그·팔로워 분석으로 현재 행동 파악" },
            { label: "개인 맞춤 문자 생성", desc: "GPT로 실명·장소·금액을 넣어 진짜처럼 보이는 문자 자동 생성" },
            { label: "발신번호 스푸핑", desc: "카드사·은행 공식 번호처럼 보이게 조작해 발신" },
            { label: "피싱 페이지 연결", desc: "링크 클릭 시 실제 카드사와 동일하게 복사한 가짜 사이트로 연결" },
          ].map((r, i) => (
            <div key={i} style={{ background: "#001510", border: "1px solid #34d39933", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
              <p style={{ color: "#34d399", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>0{i + 1} · {r.label}</p>
              <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      bg: "#001a0a",
      content: (
        <div>
          <p style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>✅ 방어법</p>
          {[
            "문자 속 링크는 절대 클릭 금지 — 직접 앱이나 공식 전화로 확인",
            "카드사·은행은 문자로 링크를 보내지 않습니다",
            "발신번호는 조작 가능 — 번호가 같아도 믿지 마세요",
            "개인정보 공유 최소화 — 위치태그·일정 SNS 공개 자제",
            "한국인터넷진흥원 118 / 금감원 1332 신고",
          ].map((t, i) => (
            <p key={i} style={{ color: "#86efac", fontSize: 12, lineHeight: 1.7, marginBottom: 8, paddingLeft: 8, borderLeft: "2px solid #22c55e44" }}>{t}</p>
          ))}
        </div>
      ),
    },
  ];
  return <SimModal title="AI 맞춤 스피어피싱" color="#34d399" steps={steps} step={step} setStep={setStep} onClose={onClose} />;
}

// ── 위조 서류 시뮬레이션 ──
function FakeDocSim({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      bg: "#1a1000",
      content: (
        <div>
          <p style={{ color: "#fbbf24", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>📄 받은 서류</p>
          <div style={{ background: "#fdf8ff", borderRadius: 12, padding: "20px", marginBottom: 16, position: "relative" as const }}>
            <div style={{ position: "absolute" as const, top: 8, right: 8, background: "#dc2626", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>AI 생성 가짜</div>
            <p style={{ color: "#3d1f5a", fontWeight: 900, fontSize: 13, marginBottom: 6, borderBottom: "2px solid #3d1f5a", paddingBottom: 6 }}>부동산 등기부등본 (갑구)</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4px 12px" }}>
              {[["소재지", "서울특별시 강남구 ○○동 123-45"], ["면적", "84.52㎡ (25.57평)"], ["소유자", "김○○ (등록번호 ●●●●●●-●●●●●●●)"], ["근저당권", "없음"], ["발급일", "2025.06.28"]].map(([k, v], i) => (
                <>
                  <p key={`k${i}`} style={{ color: "#64748b", fontSize: 10 }}>{k}</p>
                  <p key={`v${i}`} style={{ color: "#1c0d2e", fontSize: 10, fontWeight: 600 }}>{v}</p>
                </>
              ))}
            </div>
            <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px solid #e2e8f0" }}>
              <p style={{ color: "#64748b", fontSize: 9, textAlign: "center" }}>대한민국 법원 등기소 | 이 등기부는 법적 효력이 있습니다</p>
            </div>
          </div>
          <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.7 }}>
            육안으로는 진짜와 구별이 불가능합니다.<br />
            AI가 5분 만에 생성한 가짜 서류입니다.
          </p>
        </div>
      ),
    },
    {
      bg: "#1a1000",
      content: (
        <div>
          <p style={{ color: "#fbbf24", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>🤖 AI 위조 서류 활용 범죄</p>
          {[
            { icon: "🏠", title: "전세 사기", desc: "가짜 등기부등본으로 근저당 없는 척. 보증금 수억원 수령 후 잠적" },
            { icon: "💼", title: "투자 사기", desc: "AI 생성 사업자등록증·감사보고서로 투자금 유치 후 횡령" },
            { icon: "🪪", title: "신분증 위조", desc: "타인 사진으로 AI가 주민등록증·여권 이미지 생성 → 비대면 대출" },
            { icon: "📋", title: "가짜 계약서", desc: "공증 서명·직인까지 AI 합성. 법적 분쟁 시 가짜 증거로 악용" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 12, background: "#150a00", border: "1px solid #fbbf2433", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{r.icon}</span>
              <div>
                <p style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{r.title}</p>
                <p style={{ color: "#94a3b8", fontSize: 11, lineHeight: 1.6 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      bg: "#1a1000",
      content: (
        <div>
          <p style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>✅ 위조 서류 구별법</p>
          {[
            "등기부등본은 반드시 대법원 인터넷등기소(iros.go.kr)에서 직접 발급받으세요",
            "QR코드·열람번호로 진위 확인 가능 (AI 가짜엔 없음)",
            "계약 전 공인중개사를 통해 실물 서류 교차 확인",
            "비대면 계약·이체 요구 시 100% 의심하세요",
            "정부24(gov.kr)에서 각종 증명서 진위 조회 가능",
          ].map((t, i) => (
            <p key={i} style={{ color: "#86efac", fontSize: 12, lineHeight: 1.7, marginBottom: 8, paddingLeft: 8, borderLeft: "2px solid #22c55e44" }}>{t}</p>
          ))}
        </div>
      ),
    },
  ];
  return <SimModal title="AI 위조 서류·신분증" color="#fbbf24" steps={steps} step={step} setStep={setStep} onClose={onClose} />;
}

// ── AI 악성코드 시뮬레이션 ──
function MalwareGPTSim({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [termLines, setTermLines] = useState<string[]>([]);
  const TERM = [
    "> WormGPT v3.2 연결 중...",
    "> [완료] 연결됨 — 익명 Tor 네트워크",
    "> 요청: 개인정보 탈취 키로거 생성",
    "> 분석 중... ██████████ 100%",
    "> keylogger_v2.exe 생성 완료 (37KB)",
    "> 탐지 우회 코드 적용 중...",
    "> [완료] 바이러스토탈 탐지율 0/72",
    "> 이메일 첨부파일 위장 완료",
    "> 준비 완료. 발송 대상 입력 시 즉시 발송.",
  ];
  useEffect(() => {
    if (step === 0) {
      setTermLines([]);
      let i = 0;
      const id = setInterval(() => {
        if (i < TERM.length) { setTermLines(prev => [...prev, TERM[i]]); i++; }
        else clearInterval(id);
      }, 400);
      return () => clearInterval(id);
    }
  }, [step]);
  const steps = [
    {
      bg: "#000",
      content: (
        <div>
          <p style={{ color: "#f87171", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>🦠 암시장 AI — WormGPT</p>
          <div style={{ background: "#000", border: "1px solid #dc262644", borderRadius: 10, padding: "16px", fontFamily: "monospace", fontSize: 11, minHeight: 180 }}>
            {termLines.map((l, i) => (
              <p key={i} style={{ color: l.startsWith(">") ? "#22c55e" : "#f87171", marginBottom: 4, animation: "fadeIn 0.2s ease" }}>{l}</p>
            ))}
            {termLines.length < TERM.length && <span style={{ color: "#22c55e", animation: "blink 0.7s infinite" }}>█</span>}
          </div>
          <p style={{ color: "#6b7280", fontSize: 11, marginTop: 10, lineHeight: 1.7 }}>
            실제 다크웹에서 월 60~200달러에 판매 중인 범죄 특화 AI입니다.
          </p>
        </div>
      ),
    },
    {
      bg: "#0a0000",
      content: (
        <div>
          <p style={{ color: "#f87171", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>🤖 AI 해킹 도구의 현실</p>
          {[
            { label: "WormGPT", desc: "ChatGPT 제한 없는 버전. 악성코드·피싱 메일 생성 전문", price: "$60/월" },
            { label: "FraudGPT", desc: "신용카드 위조, 해킹 툴 제작, 사기 스크립트 자동화", price: "$90/월" },
            { label: "DarkBERT", desc: "다크웹 데이터로 학습된 범죄 특화 언어 모델", price: "비공개" },
          ].map((r, i) => (
            <div key={i} style={{ background: "#1a0000", border: "1px solid #dc262633", borderRadius: 10, padding: "12px 14px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "#f87171", fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{r.label}</p>
                <p style={{ color: "#94a3b8", fontSize: 11, lineHeight: 1.6, maxWidth: 260 }}>{r.desc}</p>
              </div>
              <span style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{r.price}</span>
            </div>
          ))}
          <p style={{ color: "#6b7280", fontSize: 11, marginTop: 8 }}>코딩을 전혀 모르는 사람도 AI에게 물어보면 해킹 도구를 받을 수 있습니다.</p>
        </div>
      ),
    },
    {
      bg: "#0a0000",
      content: (
        <div>
          <p style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>✅ 내 기기 보호법</p>
          {[
            "출처 불명 첨부파일·링크는 절대 클릭하지 마세요",
            "OS·백신·앱을 항상 최신 버전으로 유지하세요",
            "공공 와이파이에서 금융·개인정보 입력 금지",
            "중요 계정은 2단계 인증(OTP) 반드시 활성화",
            "수상한 앱 설치 요구는 100% 사기입니다",
            "한국인터넷진흥원 118 — 해킹·악성코드 신고",
          ].map((t, i) => (
            <p key={i} style={{ color: "#86efac", fontSize: 12, lineHeight: 1.7, marginBottom: 8, paddingLeft: 8, borderLeft: "2px solid #22c55e44" }}>{t}</p>
          ))}
        </div>
      ),
    },
  ];
  return <SimModal title="AI 악성코드 자동 생성" color="#f87171" steps={steps} step={step} setStep={setStep} onClose={onClose} />;
}

// ── 공통 모달 컴포넌트 ──
function SimModal({
  title, color, steps, step, setStep, onClose,
}: {
  title: string; color: string;
  steps: { bg: string; content: React.ReactNode }[];
  step: number; setStep: (n: number) => void; onClose: () => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(0,0,0,0.85)" }} onClick={onClose}>
      <div style={{ background: steps[step].bg, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 520, maxHeight: "88vh", overflow: "auto", padding: "28px 24px 32px" }} onClick={e => e.stopPropagation()}>
        {/* 핸들 */}
        <div style={{ width: 40, height: 4, background: "#374151", borderRadius: 2, margin: "0 auto 20px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <p style={{ color, fontWeight: 700, fontSize: 15 }}>{title}</p>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ minHeight: 300 }}>{steps[step].content}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={{ flex: 1, background: "#2a1a3a", border: "1px solid #374151", borderRadius: 12, padding: "12px", color: "#94a3b8", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>← 이전</button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} style={{ flex: 2, background: color, border: "none", borderRadius: 12, padding: "12px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>다음 →</button>
          ) : (
            <button onClick={onClose} style={{ flex: 2, background: "#22c55e", border: "none", borderRadius: 12, padding: "12px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>✅ 완료</button>
          )}
        </div>
        {/* 스텝 인디케이터 */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i === step ? color : "#374151", transition: "width 0.3s, background 0.3s" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AICrimesPage() {
  const [active, setActive] = useState<Scene>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#f4f4f5", fontFamily: "'Apple SD Gothic Neo','Noto Sans KR',sans-serif" }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }
        @keyframes blink { 0%,100%{opacity:1;}50%{opacity:0;} }
        @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.4;} }
        @keyframes scanline { 0%{top:0;}100%{top:100%;} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px currentColor;}50%{box-shadow:0 0 40px currentColor;} }
      `}</style>

      {/* 헤더 */}
      <div style={{ background: "#130c1c", borderBottom: "1px solid #2a1a3a", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <a href="/crime" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}>← 뒤로</a>
        <div style={{ width: 1, height: 16, background: "#2a1a3a" }} />
        <span style={{ color: "#f87171", fontSize: 13, fontWeight: 700 }}>AI 범죄 체험관</span>
        <span style={{ marginLeft: "auto", background: "#dc262622", border: "1px solid #dc262644", borderRadius: 20, padding: "2px 10px", color: "#f87171", fontSize: 11, fontWeight: 700 }}>AI CRIME</span>
      </div>

      {/* 히어로 */}
      <div style={{ background: "linear-gradient(180deg,#0a0010 0%,#050508 100%)", padding: "48px 24px 40px", textAlign: "center", borderBottom: "1px solid #2a1a3a", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 0%, #7c3aed18, transparent)", pointerEvents: "none" }} />
        <p style={{ color: "#f87171", fontSize: 11, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>AI × CRIME</p>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, marginBottom: 12, lineHeight: 1.3 }}>
          AI를 이용한 신종 범죄
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.9, maxWidth: 480, margin: "0 auto 24px" }}>
          딥페이크, 음성 복제, 맞춤형 피싱, 위조 서류, AI 해킹 도구.<br />
          이제 범죄자에게 기술 실력은 필요 없습니다.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          {[["5종", "AI 범죄 유형"], ["3초", "음성 복제 시간"], ["0원", "딥페이크 도구 비용"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ color: "#f87171", fontWeight: 900, fontSize: 22 }}>{num}</p>
              <p style={{ color: "#6b7280", fontSize: 10 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 카드 그리드 */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>
        <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 20, textAlign: "center" }}>카드를 눌러 실제 범죄 수법을 체험해보세요</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CRIMES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              style={{
                background: "linear-gradient(135deg,#0f0f1a,#1a1a2e)",
                border: `1px solid ${c.color}33`,
                borderRadius: 18,
                padding: "20px 22px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 18,
                transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
                animation: `fadeIn 0.4s ease ${i * 0.07}s both`,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = `${c.color}77`; e.currentTarget.style.boxShadow = `0 8px 24px ${c.color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = `${c.color}33`; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* 아이콘 */}
              <div style={{ width: 56, height: 56, borderRadius: 16, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                {c.icon}
              </div>
              {/* 텍스트 */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ background: `${c.color}22`, border: `1px solid ${c.color}55`, borderRadius: 20, padding: "1px 8px", color: c.color, fontSize: 9, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace" }}>{c.tag}</span>
                  <span style={{ color: "#374151", fontSize: 10 }}>{c.year}</span>
                </div>
                <p style={{ color: "#f4f4f5", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{c.title}</p>
                <p style={{ color: "#71717a", fontSize: 12 }}>{c.subtitle}</p>
                <p style={{ color: "#4b5563", fontSize: 10, marginTop: 4, lineHeight: 1.5 }}>{c.reality}</p>
              </div>
              {/* 화살표 */}
              <span style={{ color: c.color, fontSize: 18, opacity: 0.6 }}>›</span>
            </button>
          ))}
        </div>

        {/* 하단 경고 배너 */}
        <div style={{ background: "#1a0000", border: "1px solid #dc262633", borderRadius: 16, padding: "20px 22px", marginTop: 32, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>⚠️</span>
          <div>
            <p style={{ color: "#f87171", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>피해를 당했다면</p>
            <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.8 }}>
              경찰청 사이버수사대 <strong style={{ color: "#f4f4f5" }}>182</strong> · 금융감독원 <strong style={{ color: "#f4f4f5" }}>1332</strong><br />
              여성긴급전화 <strong style={{ color: "#f4f4f5" }}>1366</strong> · 인터넷침해대응 <strong style={{ color: "#f4f4f5" }}>118</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 시뮬레이션 모달 */}
      {active === "deepfake-blackmail" && <DeepfakeBlackmailSim onClose={() => setActive(null)} />}
      {active === "voice-clone" && <VoiceCloneSim onClose={() => setActive(null)} />}
      {active === "spear-phishing" && <SpearPhishingSim onClose={() => setActive(null)} />}
      {active === "fake-doc" && <FakeDocSim onClose={() => setActive(null)} />}
      {active === "malware-gpt" && <MalwareGPTSim onClose={() => setActive(null)} />}
    </div>
  );
}
