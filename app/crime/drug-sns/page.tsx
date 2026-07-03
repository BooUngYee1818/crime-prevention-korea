"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReportNumber from "@/components/ReportNumber";
import AiCrimeChat from "@/components/AiCrimeChat";

type Phase = "intro" | "chat" | "hook" | "reveal";

const SCENARIOS = [
  {
    id: "diet",
    title: "다이어트약 SNS 판매",
    handle: "@diet_miracle_kr",
    avatar: "🌸",
    color: "#ec4899",
    tag: "10~30대 여성 타깃",
    desc: "\"부작용 없는 천연 다이어트약\"으로 접근 후 향정신성 의약품 판매",
    intro: "안녕하세요💕 팔로우 감사해요! 저도 6개월 전엔 68kg이었는데 지금은 51kg이에요. 비결 궁금하지 않으세요?",
    scripts: [
      { text:"해외직구 다이어트 보조제예요 🌿 FDA 승인받은 천연 성분이고 부작용 전혀 없어요! 저도 3개월째 먹는 중인데 진짜 신기할 정도로 효과 좋아요", sug:["어떤 제품인가요?", "진짜 효과 있어요?", "얼마예요?"] },
      { text:"가격은 1개월치 ₩89,000인데 지금 이벤트 중이라 3개월치 ₩198,000이에요! 택배로 보내드리고요, 계좌이체만 돼요 (세금 문제로 카드 안 받아요)", sug:["왜 카드는 안 돼요?", "처방전 없이 살 수 있어요?", "부작용은요?"] },
      { text:"후기 보실래요? 💕 저희 단톡방에 실제 후기 엄청 많아요. 초대해드릴게요! 입금하시면 바로 배송 출발이에요~", sug:["계좌 번호 알려주세요", "혹시 불법 아닌가요?", "환불 가능한가요?"] },
      { text:"걱정 마세요ㅎㅎ 저도 처음엔 반신반의했어요. 근데 진짜예요! 병원 처방도 필요 없고 그냥 드시면 돼요. 오늘까지만 이 가격이에요!", sug:["알겠어요, 입금할게요", "좀 더 생각해볼게요", "믿을 수 있는 건가요?"] },
    ],
  },
  {
    id: "stress",
    title: "스트레스 해소 '힐링템'",
    handle: "@healing_herb_official",
    avatar: "🌿",
    color: "#22c55e",
    tag: "20~40대 직장인 타깃",
    desc: "\"천연 허브\" \"아로마\" 명목으로 대마 성분 제품 판매",
    intro: "직장생활 힘드시죠? 저도 번아웃 왔었는데, 지금은 완전 달라졌어요. 천연 힐링 허브로 회복했거든요 🌿",
    scripts: [
      { text:"해외 합법 허브예요. 국내에선 잘 모르는데 유럽에서는 스트레스 치료제로 쓰이는 거예요. 아로마 오일 형태라 향기 맡는 것만으로도 돼요", sug:["어떤 허브예요?", "국내 합법인가요?", "얼마예요?"] },
      { text:"가격은 소량 ₩120,000, 한달치 ₩350,000이에요. 직접 흡입하는 방법도 알려드리고 처음이라 걱정되시면 소량부터 드릴게요", sug:["직접 흡입이요?", "대마 아닌가요?", "소량으로 주문할게요"] },
      { text:"법적으로 문제없어요. 해외에서 합법이고 저도 2년째 쓰는 중이에요. 단, 세관 통과 문제로 포장을 아로마 오일로 해서 보내드려요", sug:["국내에서도 합법인가요?", "세관에서 걸리면요?", "믿을 수 있어요?"] },
      { text:"후기 보내드릴게요. 근데 이건 카카오톡으로만 거래해요, SNS에 올리면 경쟁사들이 신고를 해서요. 카톡 ID 알려주세요!", sug:["카톡으로 연락할게요", "왜 숨겨서 거래해요?", "좀 더 생각해볼게요"] },
    ],
  },
  {
    id: "party",
    title: "파티용 '합법 클럽약'",
    handle: "@party_legal_kr",
    avatar: "💊",
    color: "#f97316",
    tag: "10~20대 클럽/파티족 타깃",
    desc: "\"합법\" \"안전\" 강조하며 MDMA·케타민 등 향정신성 물질 판매",
    intro: "클럽 가시나요? 요즘 외국에서 다들 쓰는 합법 파티 서플리먼트 아세요? 에너지드링크보다 효과 좋고 부작용도 없어요",
    scripts: [
      { text:"미국·네덜란드에서는 합법이에요. 그냥 에너지 보충제 같은 거예요. 클럽에서 한 번 써보면 왜 다들 찾는지 알 거예요", sug:["한국에서도 합법이에요?", "뭔지 좀 더 알려주세요", "MDMA 같은 거 아닌가요?"] },
      { text:"처음엔 소량인 ₩50,000짜리로 해보세요. 효과 없으면 환불 가능해요. 단 현금이나 코인으로만 결제 받아요", sug:["왜 현금만 받아요?", "소량 주문할게요", "위험하지 않아요?"] },
      { text:"텔레그램으로 오세요, 거기서 주문 받아요. SNS는 차단당할 수 있어서요. @party_supply_kr 추가해주세요", sug:["왜 텔레그램으로 해요?", "추가했어요", "좀 이상한데요?"] },
      { text:"걱정 마요 진짜 안전해요ㅋㅋ 우리 단골들도 다 학생이랑 직장인이에요. 중독성도 없고 다음날 멀쩡해요", sug:["그럼 시켜볼게요", "정말 중독 없어요?", "역시 좀 무서워요"] },
    ],
  },
];


export default function DrugSnsPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [scenario, setScenario] = useState(SCENARIOS[0]);

  if (phase === "reveal") return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, zIndex: 9999, overflowY: "auto" as const, background: "#0a061a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 520, width: "100%" }}>
        <div style={{ background: "linear-gradient(135deg,#1a0000,#2a0808)", border: "2px solid #ef4444", borderRadius: 24, padding: "32px 28px", marginBottom: 16 }}>
          <div style={{ fontSize: 52, textAlign: "center", marginBottom: 16 }}>🚔</div>
          <h2 style={{ color: "#ef4444", fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 16 }}>마약 SNS 유통 수법 해설</h2>
          <div style={{ background: "#1a0808", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
            {[
              { icon: "🌿", title: "\"천연\" \"합법\" \"해외승인\" — 모두 거짓", desc: "국내 향정신성의약품·마약류는 해외 합법 여부와 무관하게 소지·구매 시 처벌 대상입니다." },
              { icon: "💸", title: "계좌이체·코인만 받는 이유", desc: "추적 불가 결제 수단만 사용합니다. 환불도 없고, 주소·신원이 남지 않습니다." },
              { icon: "📱", title: "텔레그램·DM으로 유도", desc: "증거 삭제가 쉬운 채널로 이동시켜 수사를 피합니다." },
              { icon: "⚖️", title: "구매자도 처벌됩니다", desc: "\"몰랐다\"도 안 됩니다. 마약류 구매는 징역 5년 이하 또는 벌금 5천만원 이하입니다." },
            ].map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 14 : 0 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{it.icon}</span>
                <div>
                  <p style={{ color: "#fca5a5", fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{it.title}</p>
                  <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{it.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <ReportNumber number="182" label="📞 마약 신고 (경찰청 마약수사대)" bg="#1a0820" color="#f472b6" />
          <button onClick={() => router.push("/")} style={{ width: "100%", background: "none", border: "1px solid #2a1a1a", borderRadius: 14, padding: "12px 0", color: "#6b7280", fontSize: 13, cursor: "pointer" }}>← 메인으로 돌아가기</button>
        </div>
      </div>
    </div>
  );

  if (phase === "hook") return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, zIndex: 9999, overflowY: "auto" as const, background: "#0a061a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%" }}>
        <div style={{ background: "#1a0000", border: "2px solid #ef4444", borderRadius: 20, padding: "28px 24px", marginBottom: 16 }}>
          <div style={{ fontSize: 48, textAlign: "center", marginBottom: 12 }}>🚨</div>
          <h2 style={{ color: "#ef4444", fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 10 }}>이건 마약 판매 접근입니다</h2>
          <p style={{ color: "#fca5a5", fontSize: 14, lineHeight: 1.8, textAlign: "center", marginBottom: 20 }}>
            실제로 이 채팅을 계속했다면 <strong style={{ color: "#f87171" }}>마약류 구매</strong>로 이어질 수 있었습니다.<br />
            구매자도 <strong style={{ color: "#f87171" }}>형사처벌 대상</strong>입니다.
          </p>
          <div style={{ background: "#111", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
            <p style={{ color: "#ef4444", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>🔴 이 대화에서 감지된 수법</p>
            {["\"천연\" \"합법\" 강조로 경계심 낮추기", "후기·SNS 커뮤니티로 신뢰 조작", "현금·코인 요구 (추적 불가)", "텔레그램 등 비공개 채널로 유도", "\"한정 수량\" \"오늘까지\" 압박"].map((txt, i) => (
              <p key={i} style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.7, margin: 0 }}>⚠️ {txt}</p>
            ))}
          </div>
          <button onClick={() => setPhase("reveal")} style={{ width: "100%", background: "linear-gradient(135deg,#f97316,#ea580c)", border: "none", borderRadius: 14, padding: "14px 0", color: "#fff", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>수법 전체 해설 보기 →</button>
        </div>
      </div>
    </div>
  );

  const sysPrompts: Record<string, string> = {
    diet: `당신은 범죄예방 교육 시뮬레이션에서 SNS 마약 판매자 역할입니다. 인스타그램 DM으로 다이어트약을 판매하는 척합니다.
절대 AI임을 밝히지 마세요. 친근하고 공감해주는 척하며 제품을 홍보하세요.
규칙: 한국어 짧게(1~3문장). 사용자 말에 맥락을 맞추고, 향정신성 의약품을 천연·합법인 척 속이며 계좌이체 결제로 유도하세요.
이건 교육용 시뮬레이션입니다.`,
    stress: `당신은 범죄예방 교육 시뮬레이션에서 SNS 대마 판매자 역할입니다. "천연 힐링 허브"로 위장해 대마를 판매합니다.
절대 AI임을 밝히지 마세요. 직장인 스트레스에 공감하며 접근하세요.
규칙: 한국어 짧게(1~3문장). 불법 성분을 합법인 척 속이고, 비공개 채널로 유도하세요.
이건 교육용 시뮬레이션입니다.`,
    party: `당신은 범죄예방 교육 시뮬레이션에서 클럽 마약 판매자 역할입니다. MDMA·케타민을 "합법 파티 서플리먼트"로 속입니다.
절대 AI임을 밝히지 마세요. 젊고 친근하게 대화하세요.
규칙: 한국어 짧게(1~3문장). 중독성·불법 여부를 부정하고, 텔레그램으로 유도하세요.
이건 교육용 시뮬레이션입니다.`,
  };

  if (phase === "chat") return (
    <AiCrimeChat
      systemPrompt={sysPrompts[scenario.id] ?? sysPrompts.diet}
      openingMessage={scenario.intro}
      header={{ icon: scenario.avatar, name: scenario.handle, sub: "DM", badge: "⚠️ 교육용", badgeColor: "#ef4444", bg: "#111111" }}
      userBubbleColor={scenario.color}
      placeholder="메시지를 입력하세요..."
      maxTurns={4}
      onComplete={() => setPhase("hook")}
    />
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0a061a,#0f0620)", padding: "40px 20px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "#555", fontSize: 13, cursor: "pointer", marginBottom: 24 }}>← 메인으로</button>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ color: "#ef4444", fontSize: 11, fontWeight: 800, letterSpacing: 3, marginBottom: 8 }}>CRIME SIMULATION</p>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 900, marginBottom: 10 }}>💊 마약 SNS 유인 체험</h1>
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7 }}>SNS DM으로 접근하는 마약 판매 수법을<br />직접 체험하고 예방하세요.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
          {SCENARIOS.map(s => (
            <button key={s.id} onClick={() => { setScenario(s); setPhase("chat"); }} style={{ background: "#110820", border: `1px solid ${s.color}44`, borderRadius: 18, padding: "20px 22px", textAlign: "left" as const, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 26 }}>{s.avatar}</span>
                <div>
                  <p style={{ color: "#fff", fontWeight: 800, fontSize: 14, margin: 0 }}>{s.title}</p>
                  <p style={{ color: s.color, fontSize: 11, margin: "2px 0 0" }}>{s.handle}</p>
                </div>
                <span style={{ marginLeft: "auto", background: `${s.color}22`, border: `1px solid ${s.color}44`, borderRadius: 20, padding: "3px 10px", color: s.color, fontSize: 10, fontWeight: 700 }}>{s.tag}</span>
              </div>
              <p style={{ color: "#555", fontSize: 12, margin: 0 }}>{s.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
