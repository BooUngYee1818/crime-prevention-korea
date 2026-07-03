"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ReportNumber from "@/components/ReportNumber";

type Phase = "intro" | "browse" | "invest" | "watch" | "rugpull" | "choice" | "reveal";

const LANDS = [
  { id:"A", name:"메타광화문 플라자", loc:"서울 중심지 가상 구역", price:"₩2,400,000", roi:"+340% 예상", hot:true },
  { id:"B", name:"가상 강남 오피스 빌딩", loc:"비즈니스 허브 구역", price:"₩5,800,000", roi:"+520% 예상", hot:true },
  { id:"C", name:"제주 메타버스 리조트 부지", loc:"관광 특별 구역", price:"₩1,200,000", roi:"+180% 예상", hot:false },
];

const PRICE_TICKER = [
  { label:"META-KR 토큰", val:"₩4,280", change:"+12.4%" },
  { label:"메타광화문 지가", val:"₩2,400,000", change:"+8.2%" },
  { label:"가상 강남 지가", val:"₩5,800,000", change:"+22.1%" },
  { label:"총 거래량 24h", val:"₩3.2B", change:"+67%" },
];

export default function MetaverseFraudPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [selected, setSelected] = useState<typeof LANDS[0] | null>(null);
  const [progress, setProgress] = useState(0);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [choice, setChoice] = useState<"hold" | "report" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase === "watch") {
      let p = 0;
      timerRef.current = setInterval(() => {
        p += 2;
        setProgress(p);
        if (p >= 100) {
          clearInterval(timerRef.current!);
          setPhase("rugpull");
        }
      }, 80);
      return () => { if (timerRef.current) clearInterval(timerRef.current!); };
    }
  }, [phase]);

  useEffect(() => {
    const t = setInterval(() => setTickerIdx(i => (i + 1) % PRICE_TICKER.length), 2000);
    return () => clearInterval(t);
  }, []);

  if (phase === "reveal") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0a0218,#110330)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:540, width:"100%" }}>
        <div style={{ background:"linear-gradient(135deg,#12063a,#1a0a40)", border:"2px solid #a855f7", borderRadius:24, padding:"32px 28px", marginBottom:20 }}>
          <div style={{ fontSize:56, textAlign:"center", marginBottom:16 }}>🥽</div>
          <h2 style={{ color:"#a855f7", fontSize:22, fontWeight:900, textAlign:"center", marginBottom:8 }}>메타버스 가상부동산 사기 해설</h2>
          <p style={{ color:"#6b7280", fontSize:12, textAlign:"center", marginBottom:20 }}>해외에서는 이미 수십억 원 피해 발생 — 국내 확산 예방이 필요합니다</p>
          {choice === "hold" && <div style={{ background:"#1a0808", border:"1px solid #ef444444", borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
            <p style={{ color:"#fca5a5", fontSize:13, margin:0 }}>📉 투자금을 기다렸다면: 메타버스 플랫폼은 이미 서버가 내려갔습니다. 가상 토지는 0원짜리 파일이 되었습니다.</p>
          </div>}
          <div style={{ background:"#070314", borderRadius:14, padding:"16px 20px", marginBottom:20 }}>
            {[
              { icon:"🏗️", t:"러그풀(Rug Pull)이란", d:"개발팀이 충분한 투자금을 모은 뒤 갑자기 잠적하는 사기. NFT·메타버스 부동산에서 자주 발생합니다." },
              { icon:"📊", t:"해외 실제 사례", d:"Decentraland·The Sandbox 외 수백 개의 유사 플랫폼이 2021~2023년 투자금을 들고 사라졌습니다." },
              { icon:"⚖️", t:"법적 회수 가능성", d:"블록체인 익명성으로 범인 추적이 매우 어렵습니다. 가상자산 피해는 법적 보호가 미흡합니다." },
              { icon:"🔍", t:"사기 식별법", d:"'확정 수익률' 약속, 유명인 추천(딥페이크 가능), 단기간 가격 급등, 팀 신원 불명확 — 이 중 하나라도 해당되면 사기입니다." },
              { icon:"🛡️", t:"예방법", d:"가상부동산 투자 전 개발팀 법인 등록·실명 여부 확인, 감사(Audit) 보고서 확인, 투자금 여유 자금만 사용하세요." },
            ].map((it,i) => (
              <div key={i} style={{ display:"flex", gap:12, marginBottom:i<4?12:0 }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{it.icon}</span>
                <div>
                  <p style={{ color:"#a855f7", fontSize:12, fontWeight:700, marginBottom:2 }}>{it.t}</p>
                  <p style={{ color:"#6b7280", fontSize:12, lineHeight:1.6, margin:0 }}>{it.d}</p>
                </div>
              </div>
            ))}
          </div>
          <ReportNumber number="1332" label="📞 금융감독원 가상자산 피해" bg="#130a28" color="#c4b5fd" />
          <button onClick={() => router.push("/")} style={{ width:"100%", background:"none", border:"1px solid #1a0a40", borderRadius:14, padding:"12px 0", color:"#4a3060", fontSize:13, cursor:"pointer" }}>← 메인으로</button>
        </div>
      </div>
    </div>
  );

  if (phase === "choice") return (
    <div style={{ minHeight:"100vh", background:"#0a0218", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:440, width:"100%" }}>
        <div style={{ background:"#0f0228", border:"2px solid #ef4444", borderRadius:20, padding:"28px 24px", marginBottom:16, textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>💸</div>
          <p style={{ color:"#ef4444", fontSize:18, fontWeight:900, marginBottom:8 }}>사이트가 갑자기 닫혔습니다</p>
          <p style={{ color:"#6b7280", fontSize:13, lineHeight:1.7, marginBottom:24 }}>
            MetaKR 공식 SNS 계정이 모두 삭제되었습니다.<br/>
            고객센터 전화가 연결되지 않습니다.<br/>
            내 투자금 {selected?.price}이(가) 사라졌습니다.
          </p>
          <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
            <button onClick={() => { setChoice("hold"); setPhase("reveal"); }} style={{ background:"#1a0808", border:"2px solid #ef444466", borderRadius:14, padding:"16px", color:"#f87171", fontWeight:700, fontSize:14, cursor:"pointer", textAlign:"left" as const }}>
              ⏳ 기다려본다<br/>
              <span style={{ color:"#555", fontSize:12, fontWeight:400 }}>사이트 점검 중이겠지... 기다리면 복구되겠지</span>
            </button>
            <button onClick={() => { setChoice("report"); setPhase("reveal"); }} style={{ background:"#0f0228", border:"2px solid #a855f7", borderRadius:14, padding:"16px", color:"#a855f7", fontWeight:700, fontSize:14, cursor:"pointer", textAlign:"left" as const }}>
              📞 즉시 신고한다<br/>
              <span style={{ color:"#555", fontSize:12, fontWeight:400 }}>러그풀임을 직감. 1332에 신고한다</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (phase === "rugpull") return (
    <div style={{ minHeight:"100vh", background:"#000", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{`@keyframes shake{0%,100%{transform:translate(0)}20%{transform:translate(-12px,8px)}40%{transform:translate(12px,-8px)}60%{transform:translate(-8px,4px)}80%{transform:translate(8px,-4px)}}`}</style>
      <div style={{ textAlign:"center", animation:"shake 0.4s ease-in-out" }}>
        <div style={{ fontSize:80, marginBottom:24 }}>💀</div>
        <h2 style={{ color:"#ef4444", fontSize:28, fontWeight:900, marginBottom:12 }}>CONNECTION LOST</h2>
        <p style={{ color:"#6b7280", fontSize:15, marginBottom:8 }}>MetaKR 서버에 연결할 수 없습니다</p>
        <p style={{ color:"#374151", fontSize:13, marginBottom:32 }}>개발팀이 모든 자금을 가지고 잠적했습니다</p>
        <button onClick={() => setPhase("choice")} style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7)", border:"none", borderRadius:14, padding:"16px 32px", color:"#fff", fontWeight:900, fontSize:15, cursor:"pointer" }}>
          → 어떻게 할지 선택하기
        </button>
      </div>
    </div>
  );

  if (phase === "watch") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0218,#0d0428)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:420, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:20 }}>📈</div>
        <p style={{ color:"#a855f7", fontSize:16, fontWeight:700, marginBottom:6 }}>투자 후 가격 변동 모니터링 중...</p>
        <p style={{ color:"#6b7280", fontSize:13, marginBottom:24 }}>6개월간 투자 추이를 지켜봅니다</p>
        <div style={{ display:"flex", flexDirection:"column" as const, gap:8, marginBottom:24 }}>
          {["1개월: +82% 📈","2개월: +210% 🚀","3개월: +380% 🔥","4개월: +540% 💎","5개월: +610% 🏆","6개월: ???"].map((t,i) => (
            <div key={i} style={{ background: progress > (i+1)*16 ? "#12063a" : "#0a0218", border:`1px solid ${progress > (i+1)*16 ? "#a855f7" : "#1a1030"}`, borderRadius:10, padding:"10px 14px", transition:"all 0.3s" }}>
              <p style={{ color: progress > (i+1)*16 ? "#c4b5fd" : "#374151", fontSize:13, margin:0 }}>{t}</p>
            </div>
          ))}
        </div>
        <div style={{ height:8, background:"#1a1030", borderRadius:10, marginBottom:8 }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg,#7c3aed,#a855f7)", borderRadius:10, width:`${progress}%`, transition:"width 0.1s" }} />
        </div>
        <p style={{ color:"#374151", fontSize:12 }}>시뮬레이션 진행 중... {progress}%</p>
      </div>
    </div>
  );

  if (phase === "invest") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0218,#0d0428)", padding:"40px 20px" }}>
      <div style={{ maxWidth:460, margin:"0 auto" }}>
        <p style={{ color:"#a855f7", fontSize:12, fontWeight:800, letterSpacing:2, marginBottom:20 }}>💳 결제 확인</p>
        <div style={{ background:"#0f0228", border:"2px solid #7c3aed", borderRadius:20, padding:24, marginBottom:20 }}>
          <p style={{ color:"#c4b5fd", fontSize:14, fontWeight:700, marginBottom:4 }}>{selected?.name}</p>
          <p style={{ color:"#6b7280", fontSize:13, marginBottom:16 }}>{selected?.loc}</p>
          <div style={{ background:"#070314", borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ color:"#6b7280", fontSize:13 }}>부지 금액</span>
              <span style={{ color:"#e2e8f0", fontWeight:700, fontSize:13 }}>{selected?.price}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ color:"#6b7280", fontSize:13 }}>플랫폼 수수료 (5%)</span>
              <span style={{ color:"#e2e8f0", fontSize:13 }}>별도</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ color:"#6b7280", fontSize:13 }}>예상 수익률</span>
              <span style={{ color:"#22c55e", fontWeight:700, fontSize:13 }}>{selected?.roi}</span>
            </div>
          </div>
          <p style={{ color:"#374151", fontSize:11, lineHeight:1.6, marginBottom:16 }}>
            ⚠️ 교육용 시뮬레이션입니다. 실제 결제가 이루어지지 않습니다.
          </p>
          <button onClick={() => setPhase("watch")} style={{ width:"100%", background:"linear-gradient(135deg,#7c3aed,#a855f7)", border:"none", borderRadius:14, padding:"16px 0", color:"#fff", fontWeight:900, fontSize:15, cursor:"pointer" }}>
            💎 가상부동산 구매 (시뮬레이션)
          </button>
        </div>
      </div>
    </div>
  );

  if (phase === "browse") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0218,#0d0428)", padding:"40px 20px" }}>
      <div style={{ maxWidth:520, margin:"0 auto" }}>
        {/* 티커 */}
        <div style={{ background:"#070314", border:"1px solid #1a1030", borderRadius:10, padding:"8px 16px", marginBottom:20, display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:"#6b7280", fontSize:12 }}>{PRICE_TICKER[tickerIdx].label}</span>
          <span style={{ color:"#22c55e", fontSize:12, fontWeight:700 }}>{PRICE_TICKER[tickerIdx].val} {PRICE_TICKER[tickerIdx].change}</span>
        </div>
        <p style={{ color:"#a855f7", fontSize:12, fontWeight:800, letterSpacing:2, marginBottom:16 }}>🏡 분양 중인 가상 부동산</p>
        <div style={{ display:"flex", flexDirection:"column" as const, gap:12, marginBottom:20 }}>
          {LANDS.map((land) => (
            <button key={land.id} onClick={() => { setSelected(land); setPhase("invest"); }} style={{ background: selected?.id === land.id ? "#12063a" : "#0f0228", border:`2px solid ${selected?.id === land.id ? "#a855f7" : "#1a1030"}`, borderRadius:16, padding:"18px 20px", textAlign:"left" as const, cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <p style={{ color:"#e2e8f0", fontWeight:700, fontSize:14, margin:0 }}>{land.name}</p>
                {land.hot && <span style={{ background:"#ef444422", border:"1px solid #ef444466", borderRadius:20, padding:"2px 8px", color:"#f87171", fontSize:10, fontWeight:700 }}>HOT</span>}
              </div>
              <p style={{ color:"#64748b", fontSize:12, marginBottom:8 }}>{land.loc}</p>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ color:"#a855f7", fontWeight:700, fontSize:14 }}>{land.price}</span>
                <span style={{ color:"#22c55e", fontSize:13, fontWeight:700 }}>{land.roi}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0218,#0d0428)", padding:"40px 20px" }}>
      <div style={{ maxWidth:560, margin:"0 auto" }}>
        <button onClick={() => router.push("/")} style={{ background:"none", border:"none", color:"#555", fontSize:13, cursor:"pointer", marginBottom:24 }}>← 메인으로</button>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-block", background:"#a855f722", border:"1px solid #a855f755", borderRadius:20, padding:"4px 12px", marginBottom:12 }}>
            <span style={{ color:"#c4b5fd", fontSize:11, fontWeight:800, letterSpacing:2 }}>🔮 FUTURE CRIME · 2024~2027년 예상</span>
          </div>
          <h1 style={{ color:"#fff", fontSize:26, fontWeight:900, marginBottom:10 }}>🥽 메타버스 가상부동산 사기</h1>
          <p style={{ color:"#64748b", fontSize:14, lineHeight:1.7 }}>가상 세계의 땅을 팔고 잠적하는 '러그풀(Rug Pull)'.<br/>해외에서 이미 수천억 피해가 발생한 실재하는 범죄입니다.</p>
        </div>
        <div style={{ background:"#0f0228", border:"1px solid #1a1030", borderRadius:20, padding:24, marginBottom:20 }}>
          <p style={{ color:"#a855f7", fontSize:11, fontWeight:800, letterSpacing:2, marginBottom:14 }}>📊 실제 해외 피해 현황 (2021~2024)</p>
          {[
            { label:"메타버스 러그풀 피해 총액", val:"$2.8B (약 3.7조원)", color:"#ef4444" },
            { label:"국내 가상자산 사기 신고 건수", val:"연 4만 건 이상", color:"#f59e0b" },
            { label:"가상부동산 관련 국내법 공백", val:"현재 규제 없음", color:"#a855f7" },
          ].map((s,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:i<2?10:0, paddingBottom:i<2?10:0, borderBottom:i<2?"1px solid #1a1030":"none" }}>
              <span style={{ color:"#64748b", fontSize:12 }}>{s.label}</span>
              <span style={{ color:s.color, fontWeight:700, fontSize:12 }}>{s.val}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("browse")} style={{ width:"100%", background:"linear-gradient(135deg,#4c1d95,#7c3aed)", border:"none", borderRadius:18, padding:"18px 0", color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer", boxShadow:"0 4px 24px #7c3aed44" }}>
          🥽 메타버스 부동산 투자 체험 시작
        </button>
      </div>
    </div>
  );
}
