"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReportNumber from "@/components/ReportNumber";
import CrimeChat, { type ChatMsg } from "@/components/CrimeChat";

type Phase = "intro" | "chat" | "trap" | "reveal";

const JOBS = [
  {
    id: "data-entry",
    title: "재택 데이터 입력 알바",
    company: "㈜디지털워크솔루션",
    pay: "시급 ₩18,000~25,000",
    tag: "재택근무 · 경력무관",
    icon: "💼",
    color: "#3b82f6",
    desc: "하루 2~3시간, 스마트폰으로 간단한 데이터 입력 업무. 경력 무관 누구나 가능.",
  },
  {
    id: "sns-marketing",
    title: "SNS 마케팅 부업 모집",
    company: "마케팅플러스",
    pay: "건당 ₩5,000~15,000",
    tag: "부업 · 즉시 시작",
    icon: "📱",
    color: "#8b5cf6",
    desc: "SNS 좋아요·팔로우 업무. 하루 1시간이면 충분. 당일 정산.",
  },
  {
    id: "delivery",
    title: "새벽 배송 도우미 단기 알바",
    company: "쿠팡파트너스",
    pay: "일당 ₩120,000~160,000",
    tag: "단기 · 주말 가능",
    icon: "🚚",
    color: "#10b981",
    desc: "주 2~3회 새벽 4시간 근무. 차 없어도 됨. 당일 지급.",
  },
];

const SCRIPTS: Record<string, string[]> = {
  "data-entry": [
    "안녕하세요! 공고 보고 지원하셨군요 😊 지원해주셔서 감사합니다! 간단한 확인만 하면 바로 시작하실 수 있어요.",
    "업무는 정말 간단해요. 엑셀에 상품명·가격 입력하는 거고, 하루 2시간이면 됩니다. 시급 최대 25,000원이고 매주 금요일 정산이에요!",
    "한 가지만 확인하면 돼요. 저희 회사 업무 시스템 접속을 위해 '업무용 앱'을 설치해야 해요. 보안 때문에 공식 앱스토어에는 없고, 아래 링크로 설치해 주세요.\n→ https://digwork-kr.net/app/install",
    "설치하셨으면 앱 접속 후 신분증 앞면 사진 찍어서 업로드해 주세요. 본인확인 목적이고, 업무 배정 즉시 돼요!",
    "신분증 확인됐어요! 이제 업무 보증금 ₩30,000만 입금하시면 바로 업무 배정됩니다. 업무 종료 시 전액 환급되는 보증금이에요. 계좌번호 알려드릴게요.",
    "왜 이상하게 생각하세요? 이거 정식 절차예요. 혹시 사기라고 생각하시는 건가요? 저희 회사 사업자등록증도 보내드릴까요? 😊",
  ],
  "sns-marketing": [
    "지원해주셔서 감사해요! SNS 계정 있으시면 바로 시작 가능해요. 인스타·유튜브·틱톡 중 어떤 거 사용하세요?",
    "완벽해요! 업무는 저희가 알려주는 계정에 좋아요·댓글 달기예요. 건당 5,000원~15,000원이고 하루 10건 가능해요 😊",
    "업무 시작 전에 저희 플랫폼 회원가입이 필요해요. 이름·생년월일·전화번호·계좌번호 입력해주세요. 정산을 위해서 꼭 필요해요!",
    "가입 완료됐어요! 이제 '업무 활성화'를 위해 첫 충전이 필요해요. ₩50,000 충전하시면 바로 업무 배정되고, 첫날 ₩150,000 이상 버실 수 있어요!",
    "충전하면 3배 수익 보장이에요. 저도 처음엔 반신반의했는데 지금은 월 200만원 버는 중이에요ㅎㅎ 빨리 충전하세요, 오늘 마감이에요!",
  ],
  "delivery": [
    "지원해주셔서 감사합니다! 새벽 배송 특성상 신뢰할 수 있는 분만 채용해요. 간단한 신원 확인 후 즉시 배정 가능해요.",
    "업무 일당 ₩140,000 기본 보장이고요, 물량 많을 땐 ₩160,000도 나와요. 주말 포함 원하는 날 선택 가능해요!",
    "한 가지 절차가 있어요. 배송 중 물품 분실 시 보상 보증을 위해 '업무 보증보험'에 가입해야 해요. 저희 지정 보험사 통해서 ₩80,000 납입하시면 돼요.",
    "걱정 마세요. 6개월 근무 후 100% 환급되는 보증 보험이에요. 근무 1일차부터 바로 일당 들어오니까 사실상 무료예요!",
    "혹시 안 하시겠다고요? 그럼 다른 지원자분께 배정할게요. 오늘 마감이라 자리가 1개밖에 안 남았거든요 😅",
  ],
};

function buildScript(jobId: string): ChatMsg[] {
  const scripts = SCRIPTS[jobId];
  const msgs: ChatMsg[] = [{ from: "scammer", text: scripts[0] }];
  for (let i = 1; i < scripts.length; i++) {
    msgs.push({ from: "user", text: "..." });
    msgs.push({ from: "scammer", text: scripts[i] });
  }
  return msgs;
}

const TRAP_STEPS = [
  { icon: "📋", title: "1단계 — 지원서 작성", desc: "이름·나이·연락처 등 기본 정보를 요구합니다.", color: "#f59e0b" },
  { icon: "📱", title: "2단계 — 악성 앱 설치 유도", desc: "\"업무용 앱\"이라며 공식 스토어 외 링크로 악성코드 설치를 유도합니다.", color: "#ef4444" },
  { icon: "🪪", title: "3단계 — 신분증 촬영 요구", desc: "\"본인 확인\"이라며 신분증 앞·뒷면 사진을 요구합니다. → 명의도용·대포폰 개설에 사용됩니다.", color: "#ef4444" },
  { icon: "💸", title: "4단계 — 보증금·선입금 요구", desc: "\"업무 보증금\" \"보험\" 명목으로 입금을 요구하고, 입금 후 잠적합니다.", color: "#dc2626" },
];

export default function JobScamPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [job, setJob] = useState(JOBS[0]);

  if (phase === "reveal") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0a1a,#1a0a2e)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 520, width: "100%" }}>
        <div style={{ background: "linear-gradient(135deg,#052e16,#064e3b)", border: "2px solid #22c55e", borderRadius: 24, padding: "32px 28px", marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🛡️</div>
          <h2 style={{ color: "#22c55e", fontSize: 22, fontWeight: 900, marginBottom: 12 }}>취업 사기 수법 해설</h2>
          <p style={{ color: "#86efac", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
            실제 채용공고처럼 위장한 뒤 <strong style={{ color: "#fbbf24" }}>신분증·보증금</strong>을 빼앗는 수법입니다.<br />
            2024년 취업 사기 피해는 연 <strong style={{ color: "#ef4444" }}>8,200건 이상</strong>으로 20~30대가 70%입니다.
          </p>
          <div style={{ background: "#041a0e", borderRadius: 14, padding: "16px 20px", textAlign: "left", marginBottom: 20 }}>
            <p style={{ color: "#4ade80", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>✅ 취업 사기 예방 체크리스트</p>
            {["공식 사이트(잡코리아·사람인·워크넷) 외 채용공고 주의", "\"보증금\" \"선납금\" 요구하는 회사는 100% 사기", "업무 전 신분증 촬영 요구하는 회사 없음", "공식 앱스토어 외 앱 설치 절대 금지", "의심스러우면 고용노동부 ☎1350 신고"].map((txt, i) => (
              <p key={i} style={{ color: "#6b8c78", fontSize: 12, lineHeight: 1.8, margin: 0 }}>• {txt}</p>
            ))}
          </div>
          <ReportNumber number="1350" label="📞 고용노동부 신고" bg="#052e16" color="#22c55e" />
          <button onClick={() => router.push("/")} style={{ width: "100%", background: "none", border: "1px solid #1e3028", borderRadius: 14, padding: "12px 0", color: "#4a6a55", fontSize: 13, cursor: "pointer" }}>← 메인으로 돌아가기</button>
        </div>
      </div>
    </div>
  );

  if (phase === "trap") return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%" }}>
        <div style={{ background: "#1a0000", border: "2px solid #ef4444", borderRadius: 20, padding: "28px 24px", marginBottom: 16 }}>
          <div style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>🚨</div>
          <h2 style={{ color: "#ef4444", fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 16 }}>당신은 취업 사기의 덫에 걸렸습니다</h2>
          <p style={{ color: "#fca5a5", fontSize: 13, lineHeight: 1.8, marginBottom: 20, textAlign: "center" }}>실제 피해자들은 평균 <strong style={{ color: "#f87171" }}>₩450,000~₩2,000,000</strong>을 잃습니다.</p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 20 }}>
            {TRAP_STEPS.map((s, i) => (
              <div key={i} style={{ background: "#111", border: `1px solid ${s.color}44`, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{s.icon}</span>
                <div>
                  <p style={{ color: s.color, fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{s.title}</p>
                  <p style={{ color: "#9ca3af", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setPhase("reveal")} style={{ width: "100%", background: "linear-gradient(135deg,#22c55e,#16a34a)", border: "none", borderRadius: 14, padding: "14px 0", color: "#fff", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>수법 전체 해설 보기 →</button>
        </div>
      </div>
    </div>
  );

  if (phase === "chat") return (
    <CrimeChat
      script={buildScript(job.id)}
      header={{
        icon: job.icon,
        name: job.company,
        sub: "채용 담당자",
        badge: "⚠️ 교육용 시뮬레이션",
        badgeColor: "#ef4444",
        bg: "#1e293b",
      }}
      userBubbleColor={job.color}
      scamBubbleColor="#1e293b"
      placeholder="메시지를 입력하세요..."
      onComplete={() => setPhase("trap")}
    />
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0f172a,#1e1b4b)", padding: "40px 20px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", marginBottom: 24 }}>← 메인으로</button>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ color: "#ef4444", fontSize: 11, fontWeight: 800, letterSpacing: 3, marginBottom: 8 }}>CRIME SIMULATION</p>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 900, marginBottom: 10 }}>💼 취업 사기 체험</h1>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>가짜 채용공고로 신분증·보증금을 빼앗는 수법을<br />직접 체험하고 예방하세요.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
          {JOBS.map(j => (
            <button key={j.id} onClick={() => { setJob(j); setPhase("chat"); }} style={{ background: "#1e293b", border: `1px solid ${j.color}44`, borderRadius: 18, padding: "20px 22px", textAlign: "left" as const, cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{j.icon}</span>
                <div>
                  <p style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 15, margin: 0 }}>{j.title}</p>
                  <p style={{ color: j.color, fontSize: 12, margin: "2px 0 0", fontWeight: 700 }}>{j.pay}</p>
                </div>
                <span style={{ marginLeft: "auto", background: `${j.color}22`, border: `1px solid ${j.color}44`, borderRadius: 20, padding: "3px 10px", color: j.color, fontSize: 10, fontWeight: 700 }}>{j.tag}</span>
              </div>
              <p style={{ color: "#64748b", fontSize: 12, margin: 0, lineHeight: 1.6 }}>{j.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
