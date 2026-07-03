"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReportNumber from "@/components/ReportNumber";

type Phase = "intro" | "situation" | "options" | "choice" | "reveal";

type OptionKey = "report-cyber" | "report-consumer" | "sue" | "do-nothing" | "threaten";

const OPTIONS: { key: OptionKey; label: string; desc: string; icon: string }[] = [
  { key:"report-cyber", icon:"🚔", label:"경찰청 사이버수사대 신고 (182)", desc:"사기 피해 신고" },
  { key:"report-consumer", icon:"📋", label:"소비자보호원 신고 (1372)", desc:"온라인 쇼핑몰 신고" },
  { key:"sue", icon:"⚖️", label:"민사소송 제기", desc:"사기 피해 금액 청구" },
  { key:"do-nothing", icon:"😶", label:"그냥 포기한다", desc:"괜히 긁어 부스럼 만들 것 같아서" },
  { key:"threaten", icon:"😡", label:"판매자에게 협박 문자 보내기", desc:"내가 어떻게 할 줄 아냐고 겁주기" },
];

const RESULTS: Record<OptionKey, { title: string; color: string; body: string; danger: boolean }> = {
  "report-cyber": {
    title: "최선의 선택입니다 — 하지만 반전이 있습니다",
    color: "#f59e0b",
    danger: false,
    body: `경찰에 신고하면 사기 피해는 접수됩니다.

그러나 수사관이 다음을 물어볼 것입니다:

"구매하려 했던 물건이 불법 총기였습니까?"

→ 불법 총기 구매 시도 자체가 총포·도검·화약류 등 단속법 위반입니다.
→ 사기 피해자이면서 동시에 범죄 시도자가 되어 처벌받을 수 있습니다.
→ 실제로 신고했다가 역으로 입건된 사례가 있습니다.

⚠️ 가장 중요한 사실: 이미 저지른 범죄 시도에 대해 자수하는 효과가 생깁니다.
변호사와 상담 후 신고 여부를 결정하는 것이 현명합니다.`,
  },
  "report-consumer": {
    title: "소비자보호원은 불법 거래를 보호하지 않습니다",
    color: "#ef4444",
    danger: true,
    body: `소비자기본법은 '적법한 거래'를 보호합니다.

불법 물품 거래는 소비자보호 대상이 아닙니다.
1372에 신고해도 처리가 불가능하며,
오히려 불법 구매 시도가 기록될 수 있습니다.

더 큰 문제: 신고 과정에서 불법 거래 사실이 드러나
총기 구매 시도로 수사를 받을 수 있습니다.`,
  },
  "sue": {
    title: "민사소송 — 불가능합니다",
    color: "#ef4444",
    danger: true,
    body: `불법 계약은 민법상 무효입니다.

불법 물품 구매 계약 → 반사회적 법률행위로 무효(민법 제103조)
→ 법원은 불법 거래 피해를 보호하지 않습니다.
→ 소장을 제출하는 순간 불법 구매 시도 사실이 드러납니다.

소송을 제기하면 오히려 본인이 수사받게 됩니다.`,
  },
  "do-nothing": {
    title: "금전적으로는 최선, 법적으로도 가장 안전한 선택",
    color: "#22c55e",
    danger: false,
    body: `아이러니하지만, 불법 거래에서 사기당한 경우
가장 현실적인 결말은 '그냥 포기'입니다.

✅ 더 이상 불법 시도를 하지 않으면 처벌 위험이 줄어듭니다.
✅ 추가 피해(협박 시도 → 역공격, 소송 → 자기 고발)를 막습니다.

하지만 이것이 '정답'이라는 의미가 아닙니다.
가장 현명한 것은 처음부터 불법 구매를 시도하지 않는 것입니다.

💡 이미 피해를 봤다면: 변호사와 비밀 상담 후 대응 방향을 정하세요.`,
  },
  "threaten": {
    title: "최악의 선택 — 당신이 더 큰 범죄자가 됩니다",
    color: "#ef4444",
    danger: true,
    body: `협박 문자 발송 → 협박죄·공갈죄 추가 성립

기존: 불법 총기 구매 시도 (총포법 위반)
추가: 협박죄 (형법 제283조, 3년 이하 징역)
      공갈죄 (형법 제350조, 10년 이하 징역)

판매자는 오히려 이 협박 문자를 증거로 삼아
경찰에 신고할 수 있으며, 그 과정에서
불법 총기 거래 전체가 수사 대상이 됩니다.

→ 결과: 사기 피해자에서 중범죄 피의자가 됩니다.`,
  },
};

export default function GunPurchaseScamPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [chosen, setChosen] = useState<OptionKey | null>(null);

  const result = chosen ? RESULTS[chosen] : null;

  if (phase === "reveal" && result) return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0a0808,#1a0a00)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:560, width:"100%" }}>
        <div style={{ background:"#0f0a00", border:`2px solid ${result.color}`, borderRadius:24, padding:"28px 24px", marginBottom:16 }}>
          <div style={{ fontSize:48, textAlign:"center", marginBottom:16 }}>{result.danger ? "⚠️" : "💡"}</div>
          <h2 style={{ color:result.color, fontSize:18, fontWeight:900, textAlign:"center", marginBottom:16 }}>{result.title}</h2>
          <pre style={{ color:"#94a3b8", fontSize:13, lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"inherit", marginBottom:20 }}>{result.body}</pre>

          {/* 핵심 교훈 */}
          <div style={{ background:"#0a0600", border:"1px solid #2a1800", borderRadius:16, padding:"18px 20px", marginBottom:20 }}>
            <p style={{ color:"#f59e0b", fontSize:12, fontWeight:800, marginBottom:12 }}>📌 핵심 법률 상식</p>
            {[
              { icon:"🔫", t:"불법 총기 구매 시도", d:"총포·도검·화약류 등의 안전관리에 관한 법률 위반 — 무기 또는 10년 이상 징역" },
              { icon:"💸", t:"사기 피해 회수 가능성", d:"불법 계약은 민법상 무효 → 법원 구제 불가. 금액 회수는 사실상 불가능합니다." },
              { icon:"🛡️", t:"지금 할 수 있는 것", d:"더 이상 불법 거래를 시도하지 않는 것. 추가 피해 방지가 최선입니다." },
              { icon:"📞", t:"법률 상담", d:"대한법률구조공단 132에서 무료 법률 상담을 받을 수 있습니다." },
            ].map((it, i) => (
              <div key={i} style={{ display:"flex", gap:12, marginBottom: i < 3 ? 12 : 0 }}>
                <span style={{ fontSize:16, flexShrink:0 }}>{it.icon}</span>
                <div>
                  <p style={{ color:"#fbbf24", fontSize:12, fontWeight:700, marginBottom:1 }}>{it.t}</p>
                  <p style={{ color:"#6b7280", fontSize:11, lineHeight:1.6, margin:0 }}>{it.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            <ReportNumber number="132" label="⚖️ 대한법률구조공단 (무료 상담)" bg="#1a0a00" color="#fbbf24" />
            <button onClick={() => setPhase("options")} style={{ background:"#1a1000", border:"1px solid #2a1800", borderRadius:14, padding:"14px 0", color:"#6b7280", fontSize:14, cursor:"pointer" }}>← 다시 선택</button>
          </div>
          <button onClick={() => router.push("/")} style={{ width:"100%", background:"none", border:"1px solid #1a0f00", borderRadius:14, padding:"12px 0", color:"#5a4020", fontSize:13, cursor:"pointer" }}>← 메인으로</button>
        </div>
      </div>
    </div>
  );

  if (phase === "options") return (
    <div style={{ minHeight:"100vh", background:"#0a0600", padding:"40px 20px" }}>
      <div style={{ maxWidth:520, margin:"0 auto" }}>
        <div style={{ background:"#120a00", border:"2px solid #ef4444", borderRadius:20, padding:"22px 20px", marginBottom:20 }}>
          <p style={{ color:"#ef4444", fontSize:13, fontWeight:800, marginBottom:8 }}>😱 상황 요약</p>
          <p style={{ color:"#94a3b8", fontSize:13, lineHeight:1.7, margin:0 }}>
            인터넷 불법 총기 사이트에서 총기를 구매했는데<br/>
            <strong style={{ color:"#fbbf24" }}>돈은 가져가고 배송을 하지 않았습니다.</strong><br/>
            피해 금액: <strong style={{ color:"#ef4444" }}>₩2,800,000</strong>
          </p>
        </div>
        <p style={{ color:"#64748b", fontSize:14, fontWeight:700, marginBottom:16 }}>어떻게 대처하시겠습니까?</p>
        <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
          {OPTIONS.map((opt) => (
            <button key={opt.key} onClick={() => { setChosen(opt.key); setPhase("reveal"); }} style={{ background:"#0f0800", border:"1px solid #2a1800", borderRadius:16, padding:"16px 18px", textAlign:"left" as const, cursor:"pointer" }}>
              <p style={{ color:"#e2e8f0", fontWeight:700, fontSize:14, margin:0, marginBottom:3 }}>{opt.icon} {opt.label}</p>
              <p style={{ color:"#6b7280", fontSize:12, margin:0 }}>{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (phase === "situation") return (
    <div style={{ minHeight:"100vh", background:"#0a0600", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:480, width:"100%" }}>
        {/* 가짜 주문 내역 */}
        <div style={{ background:"#0f0800", border:"1px solid #2a1800", borderRadius:20, padding:"24px", marginBottom:16 }}>
          <p style={{ color:"#f59e0b", fontSize:11, fontWeight:800, letterSpacing:2, marginBottom:16 }}>📦 주문 내역</p>
          <div style={{ background:"#0a0600", borderRadius:14, padding:"14px 16px", marginBottom:14 }}>
            <p style={{ color:"#94a3b8", fontSize:13, lineHeight:1.8 }}>
              상품: 글록 17 (9mm)<br/>
              결제: ₩2,800,000 (비트코인)<br/>
              주문일: 14일 전<br/>
              배송 상태: <strong style={{ color:"#ef4444" }}>정보 없음</strong>
            </p>
          </div>
          {/* 판매자 연락 차단 */}
          <div style={{ background:"#1a0808", border:"1px solid #ef444433", borderRadius:12, padding:"12px 14px", marginBottom:14 }}>
            <p style={{ color:"#fca5a5", fontSize:12, margin:0 }}>📵 판매자가 연락을 차단했습니다<br/>텔레그램 계정도 삭제된 상태입니다</p>
          </div>
          <div style={{ background:"#0a0806", border:"1px solid #374151", borderRadius:12, padding:"12px 14px" }}>
            <p style={{ color:"#6b7280", fontSize:12, margin:0 }}>
              사이트 URL: <span style={{ color:"#374151", textDecoration:"line-through" }}>www.darkgun-kr.onion</span> (접속 불가)
            </p>
          </div>
        </div>
        <button onClick={() => setPhase("options")} style={{ width:"100%", background:"linear-gradient(135deg,#78350f,#b45309)", border:"none", borderRadius:16, padding:"16px 0", color:"#fff", fontWeight:900, fontSize:15, cursor:"pointer" }}>
          ⚖️ 대처법 선택하기
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0600,#060300)", padding:"40px 20px" }}>
      <div style={{ maxWidth:560, margin:"0 auto" }}>
        <button onClick={() => router.push("/")} style={{ background:"none", border:"none", color:"#555", fontSize:13, cursor:"pointer", marginBottom:24 }}>← 메인으로</button>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-block", background:"#ef444422", border:"1px solid #ef444455", borderRadius:20, padding:"4px 12px", marginBottom:12 }}>
            <span style={{ color:"#fca5a5", fontSize:11, fontWeight:800, letterSpacing:2 }}>⚠️ 이중 피해 — 불법 구매 + 사기</span>
          </div>
          <h1 style={{ color:"#fff", fontSize:24, fontWeight:900, marginBottom:10 }}>🔫 총기 구매 사기 대처법</h1>
          <p style={{ color:"#64748b", fontSize:14, lineHeight:1.7 }}>
            불법 사이트에서 총기를 구매했는데<br/>배송이 안 왔을 때 어떻게 해야 할까?<br/>
            <strong style={{ color:"#fbbf24" }}>정답이 없는 함정을 직접 체험해보세요.</strong>
          </p>
        </div>

        <div style={{ background:"#0f0800", border:"2px solid #ef444444", borderRadius:20, padding:24, marginBottom:20 }}>
          <p style={{ color:"#ef4444", fontSize:13, fontWeight:900, marginBottom:12 }}>⚠️ 먼저 알아야 할 것</p>
          <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
            {[
              { icon:"🔫", text:"불법 총기 구매 시도 자체가 이미 범죄입니다", color:"#ef4444" },
              { icon:"💸", text:"사기를 당해도 법적 보호를 받을 수 없습니다", color:"#f59e0b" },
              { icon:"📞", text:"어떤 신고도 본인에게 불리하게 작용할 수 있습니다", color:"#f59e0b" },
              { icon:"💡", text:"어떤 선택을 하더라도 '정답'은 없습니다", color:"#94a3b8" },
            ].map((it, i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:16 }}>{it.icon}</span>
                <p style={{ color:it.color, fontSize:13, margin:0, lineHeight:1.5 }}>{it.text}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setPhase("situation")} style={{ width:"100%", background:"linear-gradient(135deg,#7f1d1d,#b91c1c)", border:"none", borderRadius:18, padding:"18px 0", color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer", boxShadow:"0 4px 24px #ef444444" }}>
          😱 상황 확인하고 대처법 선택하기
        </button>
        <p style={{ color:"#2a1800", fontSize:11, textAlign:"center", marginTop:12 }}>⚠️ 교육용 시뮬레이션 — 실제 거래가 아닙니다</p>
      </div>
    </div>
  );
}
