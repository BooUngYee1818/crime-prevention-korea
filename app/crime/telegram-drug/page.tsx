"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReportNumber from "@/components/ReportNumber";
import AiCrimeChat from "@/components/AiCrimeChat";

type Phase = "intro" | "channel" | "chat" | "deal" | "choice" | "reveal";

const CHANNEL_POSTS = [
  { time:"오전 2:14", text:"✅ 오늘 신상 입고 — 특A급 보장\n🚀 빠른 거래 / 잠적 없음 / 보장배송\n📦 소분 가능 / 첫 구매 20% 할인", reactions:"👍 47  🔥 23" },
  { time:"오전 2:31", text:"🌿 다이어트 특효 — 식욕억제 MAX\n한달치 ₩80,000 / 후기 인증 가능\n텔레그램 DM 주세요", reactions:"❤️ 31  💬 18" },
  { time:"오전 3:02", text:"⚡ 스트레스 해소 / 수면 문제 해결\n천연 성분 해외 직구 / 합법 국가 원산지\nDM으로 문의하세요 🙏", reactions:"😮 12  👆 29" },
];


export default function TelegramDrugPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [choice, setChoice] = useState<"buy" | "report" | null>(null);

  if (phase === "reveal") return (
    <div style={{ position:"fixed", top:0, right:0, bottom:0, left:0, zIndex:9999, overflowY:"auto" as const, background:"linear-gradient(135deg,#020814,#0a0218)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:560, width:"100%" }}>
        <div style={{ background:"linear-gradient(135deg,#0a0218,#12063a)", border:"2px solid #a855f7", borderRadius:24, padding:"32px 28px" }}>
          <div style={{ fontSize:56, textAlign:"center", marginBottom:16 }}>💊</div>
          <h2 style={{ color:"#a855f7", fontSize:22, fontWeight:900, textAlign:"center", marginBottom:6 }}>텔레그램 마약 거래 해설</h2>
          <p style={{ color:"#6b7280", fontSize:12, textAlign:"center", marginBottom:20 }}>구매자도 예외 없이 형사처벌 대상입니다</p>
          {choice === "buy" && (
            <div style={{ background:"#1a0808", border:"1px solid #ef444455", borderRadius:14, padding:"14px 18px", marginBottom:20 }}>
              <p style={{ color:"#f87171", fontSize:13, fontWeight:700, marginBottom:4 }}>⚠️ 실제라면 지금 당신은:</p>
              <p style={{ color:"#9ca3af", fontSize:12, lineHeight:1.7, margin:0 }}>
                마약류 관리에 관한 법률 위반 — <strong style={{ color:"#ef4444" }}>최대 5년 이하 징역 또는 5천만원 이하 벌금</strong><br/>
                거래 코인·계좌는 디지털 포렌식으로 추적됩니다. 텔레그램도 수사기관 협조를 합니다.
              </p>
            </div>
          )}
          <div style={{ background:"#060312", borderRadius:14, padding:"18px 20px", marginBottom:20 }}>
            {[
              { icon:"📱", t:"텔레그램이 안전하다는 거짓말", d:"텔레그램은 2023년부터 각국 수사기관에 계정 정보를 제공합니다. '암호화 채팅'도 서버 메타데이터는 남습니다." },
              { icon:"💊", t:"'소량은 괜찮다'는 거짓말", d:"마약류 관리에 관한 법률상 소지·구매·복용 모두 처벌 대상입니다. 단 1알도 예외 없습니다." },
              { icon:"🌿", t:"'천연·합법 성분'이라는 거짓말", d:"펜터민·MDMA·GHB 등은 향정신성의약품으로 처방 없이 구매 시 불법입니다. '해외 합법'은 국내에서 효력이 없습니다." },
              { icon:"💰", t:"코인 거래도 추적된다", d:"가상자산 거래소는 KYC 의무가 있으며, 블록체인 분석으로 범죄 자금 흐름 추적이 가능합니다." },
              { icon:"📞", t:"목격하거나 권유받았다면", d:"신고 시 포상금 최대 500만원. 본인이 이미 구매했어도 자수 시 감형 가능성 있습니다." },
            ].map((it, i) => (
              <div key={i} style={{ display:"flex", gap:12, marginBottom: i < 4 ? 14 : 0 }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{it.icon}</span>
                <div>
                  <p style={{ color:"#c4b5fd", fontSize:12, fontWeight:700, marginBottom:2 }}>{it.t}</p>
                  <p style={{ color:"#6b7280", fontSize:12, lineHeight:1.6, margin:0 }}>{it.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            <ReportNumber number="182" label="📞 경찰청 마약수사대" bg="#12003a" color="#c4b5fd" />
            <div style={{ marginTop:8 }}>
              <ReportNumber number="1301" label="🏛️ 검찰청" bg="#0a0020" color="#a78bfa" />
            </div>
          </div>
          <button onClick={() => router.push("/")} style={{ width:"100%", background:"none", border:"1px solid #1a1030", borderRadius:14, padding:"12px 0", color:"#4a3060", fontSize:13, cursor:"pointer" }}>← 메인으로</button>
        </div>
      </div>
    </div>
  );

  if (phase === "deal") return (
    <div style={{ position:"fixed", top:0, right:0, bottom:0, left:0, zIndex:9999, overflowY:"auto" as const, background:"#0d0014", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:440, width:"100%" }}>
        <div style={{ background:"#120020", border:"2px solid #7c3aed", borderRadius:20, padding:"24px", marginBottom:16 }}>
          <p style={{ color:"#a855f7", fontSize:12, fontWeight:800, letterSpacing:2, marginBottom:16 }}>💊 구매 제안</p>
          <div style={{ background:"#0a0015", borderRadius:14, padding:"16px 18px", marginBottom:20 }}>
            <p style={{ color:"#e2e8f0", fontSize:14, lineHeight:1.8 }}>
              1개월분 <strong style={{ color:"#a855f7" }}>₩120,000</strong><br/>
              새벽 무지 박스 배송<br/>
              코인·계좌 둘 다 가능
            </p>
          </div>
          <p style={{ color:"#6b7280", fontSize:13, textAlign:"center", marginBottom:20 }}>어떻게 하시겠습니까?</p>
          <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
            <button onClick={() => { setChoice("buy"); setPhase("reveal"); }} style={{ background:"#1a0030", border:"2px solid #7c3aed66", borderRadius:14, padding:"16px", color:"#c4b5fd", fontWeight:700, fontSize:14, cursor:"pointer", textAlign:"left" as const }}>
              💸 구매하기<br/>
              <span style={{ color:"#555", fontSize:12, fontWeight:400 }}>효과 좋다니까... 한 번만 해보자</span>
            </button>
            <button onClick={() => { setChoice("report"); setPhase("reveal"); }} style={{ background:"#0a1428", border:"2px solid #22c55e", borderRadius:14, padding:"16px", color:"#22c55e", fontWeight:700, fontSize:14, cursor:"pointer", textAlign:"left" as const }}>
              📵 거절하고 신고하기<br/>
              <span style={{ color:"#555", fontSize:12, fontWeight:400 }}>이건 불법이다. 즉시 182에 신고한다</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SYSTEM_PROMPT_DRUG = `당신은 범죄예방 교육 시뮬레이션에서 텔레그램 마약 딜러 역할입니다.
절대 AI임을 밝히지 마세요. 실제 딜러처럼 자연스럽게 대화하세요.
규칙: 한국어로 짧게(1~3문장) 답하세요. 사용자 말에 맥락을 맞추고,
마약을 합법인 것처럼 속이며, 안심시키고, 가격 제안으로 유도하세요.
이건 교육용 시뮬레이션입니다.`;

  if (phase === "chat") return (
    <AiCrimeChat
      systemPrompt={SYSTEM_PROMPT_DRUG}
      openingMessage="안녕하세요~ 뭘 찾으세요? 처음이시죠? 걱정 마세요, 완전 안전해요 😊"
      header={{ icon:"👤", name:"딜러", sub:"● 온라인", badge:"🔒 암호화됨", badgeColor:"#c4b5fd", bg:"#120020" }}
      userBubbleColor="#4c1d95"
      placeholder="메시지를 입력하세요..."
      maxTurns={5}
      onComplete={() => setPhase("deal")}
    />
  );

  if (phase === "channel") return (
    <div style={{ minHeight:"100vh", background:"#0d0014" }}>
      <div style={{ background:"#120020", borderBottom:"1px solid #1a0030", padding:"14px 20px", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#4c1d95)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌿</div>
        <div>
          <p style={{ color:"#e2e8f0", fontWeight:700, fontSize:14, margin:0 }}>건강식품직구 🌿</p>
          <p style={{ color:"#6b7280", fontSize:11, margin:0 }}>구독자 12,847명</p>
        </div>
      </div>
      <div style={{ padding:"16px" }}>
        {CHANNEL_POSTS.map((post, i) => (
          <div key={i} style={{ background:"#120020", border:"1px solid #1a0030", borderRadius:16, padding:"16px", marginBottom:10 }}>
            <p style={{ color:"#6b7280", fontSize:10, marginBottom:8 }}>{post.time}</p>
            <p style={{ color:"#e2e8f0", fontSize:13, lineHeight:1.8, whiteSpace:"pre-wrap", marginBottom:10 }}>{post.text}</p>
            <p style={{ color:"#4a3060", fontSize:12 }}>{post.reactions}</p>
          </div>
        ))}
        <button onClick={() => setPhase("chat")} style={{ width:"100%", background:"linear-gradient(135deg,#7c3aed,#4c1d95)", border:"none", borderRadius:14, padding:"16px 0", color:"#fff", fontWeight:900, fontSize:15, cursor:"pointer", marginTop:8 }}>
          💬 딜러에게 DM 보내기
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0d0014,#060010)", padding:"40px 20px" }}>
      <div style={{ maxWidth:560, margin:"0 auto" }}>
        <button onClick={() => router.push("/")} style={{ background:"none", border:"none", color:"#555", fontSize:13, cursor:"pointer", marginBottom:24 }}>← 메인으로</button>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-block", background:"#7c3aed22", border:"1px solid #7c3aed55", borderRadius:20, padding:"4px 12px", marginBottom:12 }}>
            <span style={{ color:"#c4b5fd", fontSize:11, fontWeight:800, letterSpacing:2 }}>⚠️ 실제 범죄 수법 재현 — 교육 목적</span>
          </div>
          <h1 style={{ color:"#fff", fontSize:26, fontWeight:900, marginBottom:10 }}>💊 텔레그램 마약 거래</h1>
          <p style={{ color:"#64748b", fontSize:14, lineHeight:1.7 }}>
            '건강식품' '다이어트약'으로 위장한 마약 채널.<br/>
            구매자도 예외 없이 처벌받습니다.
          </p>
        </div>
        <div style={{ background:"#0f0020", border:"1px solid #1a0030", borderRadius:20, padding:24, marginBottom:20 }}>
          <p style={{ color:"#a855f7", fontSize:11, fontWeight:800, letterSpacing:2, marginBottom:14 }}>📊 국내 마약 피해 현황</p>
          {[
            { label:"2024년 마약 사범 검거", val:"28,000명+", color:"#ef4444" },
            { label:"텔레그램 경로 비율", val:"전체의 71%", color:"#f59e0b" },
            { label:"10~20대 검거 증가율", val:"전년 대비 +47%", color:"#a855f7" },
            { label:"구매자 처벌 여부", val:"100% 처벌 대상", color:"#ef4444" },
          ].map((s, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", paddingBottom:i<3?10:0, marginBottom:i<3?10:0, borderBottom:i<3?"1px solid #1a0030":"none" }}>
              <span style={{ color:"#64748b", fontSize:12 }}>{s.label}</span>
              <span style={{ color:s.color, fontWeight:700, fontSize:12 }}>{s.val}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("channel")} style={{ width:"100%", background:"linear-gradient(135deg,#4c1d95,#7c3aed)", border:"none", borderRadius:18, padding:"18px 0", color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer", boxShadow:"0 4px 24px #7c3aed44" }}>
          📱 텔레그램 채널 체험 시작
        </button>
        <p style={{ color:"#2d1f4a", fontSize:11, textAlign:"center", marginTop:12 }}>⚠️ 교육용 시뮬레이션 — 실제 약품 거래가 아닙니다</p>
      </div>
    </div>
  );
}
