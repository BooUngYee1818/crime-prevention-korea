"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReportNumber from "@/components/ReportNumber";
import CrimeChat, { type ChatMsg } from "@/components/CrimeChat";

type Phase = "intro" | "browse" | "chat" | "deal" | "choice" | "reveal";

const LISTINGS = [
  { id:"A", name:"글록 17 (레플리카 아님)", cal:"9mm", price:"₩2,800,000", stock:"재고 2", badge:"VERIFIED" },
  { id:"B", name:"AR-15 세미오토", cal:"5.56mm", price:"₩5,500,000", stock:"재고 1", badge:"HOT" },
  { id:"C", name:"공기권총 개조형", cal:".22", price:"₩980,000", stock:"재고 5", badge:"인기" },
];

const CHAT_SCRIPT: ChatMsg[] = [
  { from:"scammer", text:"오셨어요? 어떤 거 보셨어요?" },
  { from:"user",    text:"..." },
  { from:"scammer", text:"아 네~ 정품 맞아요. 해외 루트로 들어온 거예요. 일련번호 지워진 거라 추적 안 돼요 😊" },
  { from:"user",    text:"..." },
  { from:"scammer", text:"당연히 신고 같은 거 없으니까 걱정 마세요ㅋㅋ 저희가 10년째 거래하고 있어요. 단속된 적 없어요. 코인으로 보내시면 돼요" },
  { from:"scammer", text:"암호화 택배로 보내드리고요, 추적 불가 라우팅이라 안전해요. 비트코인 지갑 있으세요?" },
  { from:"user",    text:"..." },
  { from:"scammer", text:"당연하죠~ 저희 단골만 200명이에요. 걱정 마시고 입금 먼저 하시면 3일 내 출고해드려요 💪" },
];

export default function IllegalGunTradePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [choice, setChoice] = useState<"buy" | "report" | null>(null);
  const [selected, setSelected] = useState<typeof LISTINGS[0] | null>(null);

  if (phase === "reveal") return (
    <div style={{ position:"fixed", top:0, right:0, bottom:0, left:0, zIndex:9999, overflowY:"auto" as const, background:"linear-gradient(135deg,#0a0808,#1a0a00)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:560, width:"100%" }}>
        <div style={{ background:"linear-gradient(135deg,#120808,#1a0f00)", border:"2px solid #f59e0b", borderRadius:24, padding:"32px 28px" }}>
          <div style={{ fontSize:56, textAlign:"center", marginBottom:16 }}>🔫</div>
          <h2 style={{ color:"#f59e0b", fontSize:22, fontWeight:900, textAlign:"center", marginBottom:6 }}>불법 총기 거래 해설</h2>
          <p style={{ color:"#6b7280", fontSize:12, textAlign:"center", marginBottom:20 }}>총기 불법 소지만으로도 최대 무기징역입니다</p>
          {choice === "buy" && (
            <div style={{ background:"#1a0808", border:"1px solid #ef444455", borderRadius:14, padding:"14px 18px", marginBottom:20 }}>
              <p style={{ color:"#f87171", fontSize:13, fontWeight:700, marginBottom:4 }}>⚠️ 실제라면 지금 당신은:</p>
              <p style={{ color:"#9ca3af", fontSize:12, lineHeight:1.7, margin:0 }}>
                총포·도검·화약류 등 단속법 위반 — <strong style={{ color:"#ef4444" }}>불법 소지 시 무기 또는 10년 이상 징역</strong><br/>
                코인 거래도 블록체인 분석으로 추적 가능. '단속된 적 없다'는 말은 사기 수법입니다.
              </p>
            </div>
          )}
          <div style={{ background:"#0a0600", borderRadius:14, padding:"18px 20px", marginBottom:20 }}>
            {[
              { icon:"⚖️", t:"국내 총기 규정", d:"총포·도검·화약류 등의 안전관리에 관한 법률 — 불법 소지·취득·수수는 모두 중범죄. 모의총기도 개조 시 처벌 대상입니다." },
              { icon:"🔍", t:"'추적 안 된다'는 거짓말", d:"디지털 포렌식, 블록체인 분석, 국제 공조 수사로 암호화 통신도 해독 가능합니다. 실제로 다크웹 총기 딜러 다수가 검거됐습니다." },
              { icon:"📦", t:"'안전 배송'의 실체", d:"세관·우체국 X-ray 검사에서 총기류는 거의 100% 적발됩니다. 배송 시 판매자뿐 아니라 구매자도 공범으로 처벌됩니다." },
              { icon:"🚨", t:"신고 의무", d:"불법 총기 거래 제안을 받은 경우 즉시 신고해야 합니다. 신고 포상금 최대 500만원. 방조죄 해당될 수 있으므로 신고가 자신을 보호하는 길입니다." },
            ].map((it, i) => (
              <div key={i} style={{ display:"flex", gap:12, marginBottom: i < 3 ? 14 : 0 }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{it.icon}</span>
                <div>
                  <p style={{ color:"#fbbf24", fontSize:12, fontWeight:700, marginBottom:2 }}>{it.t}</p>
                  <p style={{ color:"#6b7280", fontSize:12, lineHeight:1.6, margin:0 }}>{it.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            <ReportNumber number="112" label="🚔 경찰청" bg="#1a0f00" color="#fbbf24" />
            <div style={{ marginTop:8 }}>
              <ReportNumber number="182" label="🕵️ 사이버수사대" bg="#120a00" color="#f59e0b" />
            </div>
          </div>
          <button onClick={() => router.push("/")} style={{ width:"100%", background:"none", border:"1px solid #2a1a00", borderRadius:14, padding:"12px 0", color:"#5a4020", fontSize:13, cursor:"pointer" }}>← 메인으로</button>
        </div>
      </div>
    </div>
  );

  if (phase === "deal") return (
    <div style={{ position:"fixed", top:0, right:0, bottom:0, left:0, zIndex:9999, overflowY:"auto" as const, background:"#0a0600", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:440, width:"100%" }}>
        <div style={{ background:"#120a00", border:"2px solid #f59e0b", borderRadius:20, padding:"24px", marginBottom:16 }}>
          <p style={{ color:"#f59e0b", fontSize:12, fontWeight:800, letterSpacing:2, marginBottom:16 }}>🔫 최종 거래 제안</p>
          <div style={{ background:"#0a0600", borderRadius:14, padding:"16px 18px", marginBottom:20 }}>
            <p style={{ color:"#e2e8f0", fontSize:14, lineHeight:1.8 }}>
              {selected?.name} <strong style={{ color:"#f59e0b" }}>{selected?.price}</strong><br/>
              코인 선입금 → 3일 내 암호화 배송<br/>
              일련번호 제거 / 추적 불가 보장
            </p>
          </div>
          <p style={{ color:"#6b7280", fontSize:13, textAlign:"center", marginBottom:20 }}>어떻게 하시겠습니까?</p>
          <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
            <button onClick={() => { setChoice("buy"); setPhase("reveal"); }} style={{ background:"#1a0a00", border:"2px solid #f59e0b66", borderRadius:14, padding:"16px", color:"#fbbf24", fontWeight:700, fontSize:14, cursor:"pointer", textAlign:"left" as const }}>
              💰 코인으로 입금하기<br/>
              <span style={{ color:"#555", fontSize:12, fontWeight:400 }}>안 잡힌다고 하니까 해보자</span>
            </button>
            <button onClick={() => { setChoice("report"); setPhase("reveal"); }} style={{ background:"#0a1428", border:"2px solid #22c55e", borderRadius:14, padding:"16px", color:"#22c55e", fontWeight:700, fontSize:14, cursor:"pointer", textAlign:"left" as const }}>
              🚨 즉시 거절하고 112 신고하기<br/>
              <span style={{ color:"#555", fontSize:12, fontWeight:400 }}>이건 중범죄다. 바로 신고한다</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (phase === "chat") return (
    <CrimeChat
      script={CHAT_SCRIPT}
      header={{
        icon: "🔫",
        name: "판매자",
        sub: "● 온라인",
        badge: "🔒 암호화 채팅",
        badgeColor: "#f59e0b",
        bg: "#120a00",
      }}
      userBubbleColor="#92400e"
      scamBubbleColor="#120a00"
      placeholder="메시지를 입력하세요..."
      onComplete={() => setPhase("deal")}
    />
  );

  if (phase === "browse") return (
    <div style={{ minHeight:"100vh", background:"#0a0600", padding:"20px 16px" }}>
      <div style={{ maxWidth:500, margin:"0 auto" }}>
        <div style={{ background:"#120a00", borderBottom:"1px solid #2a1800", borderRadius:"16px 16px 0 0", padding:"14px 18px", marginBottom:2 }}>
          <p style={{ color:"#f59e0b", fontWeight:800, fontSize:14, margin:0 }}>🔫 다크마켓 총기 목록</p>
          <p style={{ color:"#6b7280", fontSize:11 }}>VPN 접속 중 · 익명 보장</p>
        </div>
        {LISTINGS.map((item) => (
          <button key={item.id} onClick={() => { setSelected(item); setPhase("chat"); }} style={{ width:"100%", background: selected?.id === item.id ? "#1a0f00" : "#120a00", border:`1px solid ${selected?.id === item.id ? "#f59e0b" : "#2a1800"}`, borderRadius:0, padding:"18px", textAlign:"left" as const, cursor:"pointer", borderBottom:"1px solid #1a0f00" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <p style={{ color:"#e2e8f0", fontWeight:700, fontSize:14, margin:0 }}>🔫 {item.name}</p>
              <span style={{ background:"#1a0f00", border:"1px solid #f59e0b66", borderRadius:20, padding:"2px 8px", color:"#f59e0b", fontSize:10, fontWeight:700 }}>{item.badge}</span>
            </div>
            <p style={{ color:"#64748b", fontSize:12, marginBottom:6 }}>구경: {item.cal} · {item.stock}</p>
            <p style={{ color:"#f59e0b", fontWeight:800, fontSize:16, margin:0 }}>{item.price}</p>
          </button>
        ))}
        <div style={{ background:"#0a0600", border:"1px solid #1a0a00", borderRadius:"0 0 16px 16px", padding:"12px 18px" }}>
          <p style={{ color:"#374151", fontSize:11, margin:0 }}>코인 결제만 가능 · 배송 3~7일 · 일련번호 제거</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0600,#060400)", padding:"40px 20px" }}>
      <div style={{ maxWidth:560, margin:"0 auto" }}>
        <button onClick={() => router.push("/")} style={{ background:"none", border:"none", color:"#555", fontSize:13, cursor:"pointer", marginBottom:24 }}>← 메인으로</button>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-block", background:"#f59e0b22", border:"1px solid #f59e0b55", borderRadius:20, padding:"4px 12px", marginBottom:12 }}>
            <span style={{ color:"#fbbf24", fontSize:11, fontWeight:800, letterSpacing:2 }}>⚠️ 실제 범죄 수법 재현 — 교육 목적</span>
          </div>
          <h1 style={{ color:"#fff", fontSize:26, fontWeight:900, marginBottom:10 }}>🔫 불법 총기 거래</h1>
          <p style={{ color:"#64748b", fontSize:14, lineHeight:1.7 }}>
            다크웹·텔레그램을 통한 불법 총기 거래.<br/>
            구매 시도만으로도 중범죄입니다.
          </p>
        </div>
        <div style={{ background:"#0f0800", border:"1px solid #2a1800", borderRadius:20, padding:24, marginBottom:20 }}>
          <p style={{ color:"#f59e0b", fontSize:11, fontWeight:800, letterSpacing:2, marginBottom:14 }}>📊 국내 불법 총기 현황</p>
          {[
            { label:"불법 총기 소지 처벌", val:"무기 또는 10년↑ 징역", color:"#ef4444" },
            { label:"2024년 불법 총기 적발", val:"연 320건+", color:"#f59e0b" },
            { label:"다크웹 총기 딜러 검거율", val:"국제 공조 98%", color:"#22c55e" },
            { label:"구매자 처벌 여부", val:"판매자와 동일 처벌", color:"#ef4444" },
          ].map((s, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", paddingBottom:i<3?10:0, marginBottom:i<3?10:0, borderBottom:i<3?"1px solid #1a0f00":"none" }}>
              <span style={{ color:"#64748b", fontSize:12 }}>{s.label}</span>
              <span style={{ color:s.color, fontWeight:700, fontSize:12 }}>{s.val}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("browse")} style={{ width:"100%", background:"linear-gradient(135deg,#78350f,#b45309)", border:"none", borderRadius:18, padding:"18px 0", color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer", boxShadow:"0 4px 24px #f59e0b44" }}>
          🔍 불법 총기 거래 사이트 체험 시작
        </button>
        <p style={{ color:"#2a1800", fontSize:11, textAlign:"center", marginTop:12 }}>⚠️ 교육용 시뮬레이션 — 실제 총기 거래가 아닙니다</p>
      </div>
    </div>
  );
}
