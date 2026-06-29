"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, Suspense } from "react";

// ── 승률: 처음엔 무조건 이김 → 점점 급락 ────────────────────────────────────
function getWinRate(round: number): number {
  if (round <= 3) return 0.97;   // 처음 3판: 거의 무조건 이김
  if (round <= 5) return 0.75;
  if (round <= 8) return 0.42;
  if (round <= 12) return 0.20;
  if (round <= 16) return 0.10;
  return 0.05;
}

// ── 카드 덱 ──────────────────────────────────────────────────────────────────
const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
function randCard() { return { suit: SUITS[Math.floor(Math.random()*4)], rank: RANKS[Math.floor(Math.random()*13)] }; }
function cardVal(rank: string) { if (["J","Q","K","10"].includes(rank)) return 0; if (rank==="A") return 1; return parseInt(rank); }
function baccaratScore(cards: {rank:string}[]) { return cards.reduce((s,c) => (s+cardVal(c.rank))%10, 0); }

const SNAIL_COLORS = ["#ef4444","#f59e0b","#22c55e","#3b82f6","#a855f7","#ec4899"];

// ── 튜토리얼 팝업 ────────────────────────────────────────────────────────────
const TUTORIAL_DATA = {
  baccarat: {
    icon:"🃏", name:"바카라", color:"#ef4444",
    summary:"카드 숫자 합이 9에 가까운 쪽이 이기는 게임",
    steps:[
      { title:"베팅 선택", desc:"플레이어 / 뱅커 / 타이 버튼 중 하나를 누르세요.\n처음엔 플레이어나 뱅커 중 하나만 고르세요.", icon:"👆" },
      { title:"금액 선택", desc:"아래 금액 버튼 중 하나를 눌러 베팅 금액을 정합니다.\n처음엔 ₩5,000부터 시작해보세요.", icon:"💰" },
      { title:"베팅 버튼 클릭", desc:"'₩XX 베팅' 버튼을 누르면 카드가 한 장씩 자동으로 공개됩니다.", icon:"🎯" },
      { title:"결과 확인", desc:"카드 합 1의 자리가 9에 가까운 쪽이 이깁니다.\n내가 고른 쪽이 이기면 베팅액 × 1배 받습니다.", icon:"🏆" },
    ],
    rule:"💡 A=1점 / 2~9=숫자 / 10·J·Q·K=0점\n합이 10 이상이면 10을 빼요 (예: 7+5=12 → 2점)",
    odds:"플레이어 승리 1배 / 뱅커 0.95배 / 타이 8배",
  },
  snail: {
    icon:"🐌", name:"달팽이 경주", color:"#22c55e",
    summary:"6마리 중 1등 달팽이를 맞추는 경주 게임",
    steps:[
      { title:"달팽이 선택", desc:"#1 ~ #6 중 1등으로 들어올 것 같은 달팽이를 누르세요.\n직감으로 골라도 됩니다!", icon:"👆" },
      { title:"금액 선택", desc:"베팅할 금액을 선택합니다.", icon:"💰" },
      { title:"경주 시작", desc:"'베팅' 버튼을 누르면 경주가 시작됩니다.\n오른쪽 빨간 선에 먼저 닿는 달팽이가 1등!", icon:"🏁" },
      { title:"결과 확인", desc:"내가 고른 달팽이가 1등이면 베팅액의 5배를 받습니다!", icon:"🏆" },
    ],
    rule:"💡 6마리 중 1마리 맞추기 → 순수 확률 약 16.7%\n어떤 달팽이가 '잘 이긴다'는 패턴은 없습니다. 매번 새로 결정됩니다.",
    odds:"1등 맞추면 베팅액의 5배 지급",
  },
  ladder: {
    icon:"🪜", name:"사다리 게임", color:"#a855f7",
    summary:"번호를 골라 사다리를 타고 내려가는 게임",
    steps:[
      { title:"번호 선택", desc:"① ② ③ ④ 중 출발할 번호 하나를 누르세요.\n어떤 번호든 상관없어요!", icon:"👆" },
      { title:"금액 선택", desc:"베팅할 금액을 선택합니다.", icon:"💰" },
      { title:"사다리 출발", desc:"'베팅' 버튼을 누르면 보라색 공이 내려갑니다.\n가로줄을 만날 때마다 방향이 바뀝니다.", icon:"🪜" },
      { title:"결과 확인", desc:"공이 도착한 번호 = 내 출발 번호면 당첨!\n베팅액의 3.5배를 받습니다.", icon:"🏆" },
    ],
    rule:"💡 4개 중 1개 맞추기 → 순수 확률 25%\n가로줄 때문에 예측하기 어렵지만 결과는 정해져 있습니다.",
    odds:"당첨 시 베팅액의 3.5배 지급",
  },
} as const;

function TutorialPopup({ game, onClose }: { game:"baccarat"|"snail"|"ladder"; onClose:()=>void }) {
  const d = TUTORIAL_DATA[game];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:400, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ maxWidth:500, width:"100%", background:"linear-gradient(135deg,#0a0a18,#111124)", border:`2px solid ${d.color}`, borderRadius:22, padding:"28px 24px", maxHeight:"90vh", overflowY:"auto", boxShadow:`0 0 40px ${d.color}33` }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${d.color}22`, border:`1px solid ${d.color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{d.icon}</div>
            <div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:17 }}>{d.name} 하는 법</div>
              <div style={{ color:d.color, fontSize:12 }}>{d.summary}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#555", fontSize:22, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
          {d.steps.map((step,i) => (
            <div key={i} style={{ display:"flex", gap:12, background:"#ffffff06", borderRadius:12, padding:"12px 14px", alignItems:"flex-start" }}>
              <div style={{ width:32, height:32, borderRadius:10, background:`${d.color}22`, border:`1px solid ${d.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{step.icon}</div>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                  <span style={{ background:d.color, color:"#000", fontSize:9, fontWeight:900, padding:"1px 7px", borderRadius:10 }}>STEP {i+1}</span>
                  <span style={{ color:"#e4e4e7", fontWeight:700, fontSize:13 }}>{step.title}</span>
                </div>
                <div style={{ color:"#888", fontSize:12, lineHeight:1.7, whiteSpace:"pre-line" }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:`${d.color}11`, border:`1px solid ${d.color}33`, borderRadius:12, padding:"12px 16px", marginBottom:12 }}>
          <div style={{ color:"#aaa", fontSize:12, lineHeight:1.8, whiteSpace:"pre-line" }}>{d.rule}</div>
        </div>
        <div style={{ background:"#ffffff08", borderRadius:12, padding:"10px 16px", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:14 }}>💸</span>
          <span style={{ color:d.color, fontWeight:700, fontSize:13 }}>{d.odds}</span>
        </div>
        <button onClick={onClose} style={{ width:"100%", padding:"13px 0", borderRadius:14, fontSize:15, fontWeight:900, background:`linear-gradient(135deg,${d.color},${d.color}aa)`, color:"#fff", border:"none", cursor:"pointer", boxShadow:`0 4px 16px ${d.color}44` }}>
          알겠어요! 바로 해볼게요 {d.icon}
        </button>
      </div>
    </div>
  );
}

// ── 무료 코인 팝업 ────────────────────────────────────────────────────────────
function FreeCoinPopup({ siteName, onClaim }: { siteName: string; onClaim: () => void }) {
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count <= 0) return;
    const t = setTimeout(() => setCount(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ maxWidth:420, width:"100%", background:"linear-gradient(135deg,#0a1200,#142000)", border:"2px solid #22c55e", borderRadius:24, padding:"32px 28px", textAlign:"center", boxShadow:"0 0 60px #22c55e33" }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🎁</div>
        <div style={{ color:"#22c55e", fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:8 }}>신규 회원 한정 이벤트</div>
        <h2 style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:6 }}>무료 코인 지급!</h2>
        <p style={{ color:"#86efac", fontSize:13, marginBottom:20, lineHeight:1.7 }}>
          {siteName}에 오신 것을 환영합니다!<br />
          <strong style={{ color:"#ffd700", fontSize:16 }}>₩100,000 무료 체험 코인</strong>을 드립니다.<br />
          <span style={{ color:"#555", fontSize:11 }}>지금 바로 게임을 시작해보세요!</span>
        </p>
        <div style={{ background:"#ffffff08", border:"1px solid #22c55e33", borderRadius:14, padding:"14px 20px", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", color:"#6b7280", fontSize:12, marginBottom:8 }}>
            <span>기본 코인</span><span style={{ color:"#fff", fontWeight:700 }}>₩50,000</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", color:"#6b7280", fontSize:12, marginBottom:8 }}>
            <span>신규 보너스</span><span style={{ color:"#ffd700", fontWeight:700 }}>+₩50,000</span>
          </div>
          <div style={{ height:1, background:"#ffffff11", margin:"8px 0" }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:15, fontWeight:900 }}>
            <span style={{ color:"#fff" }}>총 지급액</span><span style={{ color:"#22c55e" }}>₩100,000</span>
          </div>
        </div>
        <button onClick={onClaim} style={{ width:"100%", padding:"16px 0", borderRadius:14, fontSize:16, fontWeight:900, background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", border:"none", cursor:"pointer", boxShadow:"0 0 24px #22c55e55", transition:"transform 0.1s" }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          🎰 무료 코인 받고 시작하기!
        </button>
        <p style={{ color:"#1a3a1a", fontSize:9, marginTop:10 }}>시뮬레이션 체험용 가상 코인 · 실제 금전 가치 없음</p>
      </div>
    </div>
  );
}

// ── 충전 결제 팝업 ────────────────────────────────────────────────────────────
function ChargePopup({ onClose, onCharge, onReveal }: { onClose: () => void; onCharge: (amount: number) => void; onReveal: () => void }) {
  const [selected, setSelected] = useState<number|null>(null);
  const [step, setStep] = useState<"select"|"payment"|"done">("select");
  const [cardNum, setCardNum] = useState("");
  const [processing, setProcessing] = useState(false);

  const PACKAGES = [
    { amount:30000, bonus:0, label:"₩3만", tag:null },
    { amount:100000, bonus:20000, label:"₩10만", tag:"🔥 인기" },
    { amount:300000, bonus:90000, label:"₩30만", tag:"⭐ 추천" },
    { amount:1000000, bonus:400000, label:"₩100만", tag:"👑 VIP" },
  ];

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setStep("done"); }, 2000);
  };

  if (step === "done") return (
    <div style={{ position:"fixed", inset:0, zIndex:600, background:"rgba(0,0,0,0.96)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ maxWidth:440, width:"100%", background:"#0a0000", border:"2px solid #ef4444", borderRadius:24, padding:"32px 28px", textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:12 }}>🛑</div>
        <h2 style={{ color:"#ef4444", fontWeight:900, fontSize:20, marginBottom:12 }}>실제 결제는 불가능합니다</h2>
        <div style={{ background:"#1a0808", borderRadius:14, padding:"18px 20px", marginBottom:20, textAlign:"left" }}>
          <p style={{ color:"#fca5a5", fontWeight:700, fontSize:13, marginBottom:10 }}>⚠️ 지금 이 화면이 핵심 수법입니다</p>
          <ul style={{ color:"#888", fontSize:12, lineHeight:2.2, paddingLeft:16, margin:0 }}>
            <li>이 사이트는 <strong style={{ color:"#ffd700" }}>교육용 시뮬레이션</strong>으로 실제 결제가 되지 않습니다</li>
            <li>실제 불법도박 사이트는 처음엔 <strong style={{ color:"#ef4444" }}>잘 따게 설계</strong>하여 충전을 유도합니다</li>
            <li>충전 후에는 <strong style={{ color:"#ef4444" }}>승률이 급격히 낮아지고</strong> 환전은 거부됩니다</li>
            <li>카드 정보 입력 시 <strong style={{ color:"#ef4444" }}>2차 금융 피해</strong>로 이어질 수 있습니다</li>
          </ul>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:"13px 0", borderRadius:12, background:"#111", border:"1px solid #2a2a2a", color:"#888", fontSize:13, cursor:"pointer" }}>
            계속 체험
          </button>
          <button onClick={onReveal} style={{ flex:2, padding:"13px 0", borderRadius:12, background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", fontWeight:700, fontSize:14, border:"none", cursor:"pointer" }}>
            🛡️ 수법 전체 확인
          </button>
        </div>
      </div>
    </div>
  );

  if (step === "payment") return (
    <div style={{ position:"fixed", inset:0, zIndex:600, background:"rgba(0,0,0,0.96)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ maxWidth:440, width:"100%", background:"#0f0f18", border:"1px solid #2a2a3a", borderRadius:24, padding:"28px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"#1a1a2a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>💳</div>
          <div>
            <div style={{ color:"#e4e4e7", fontWeight:800, fontSize:15 }}>결제 정보 입력</div>
            <div style={{ color:"#6b7280", fontSize:11 }}>안전한 SSL 암호화 결제</div>
          </div>
          <button onClick={() => setStep("select")} style={{ marginLeft:"auto", background:"none", border:"none", color:"#555", fontSize:20, cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ background:"linear-gradient(135deg,#1a1a2a,#12122a)", borderRadius:16, padding:"16px 18px", marginBottom:16, border:"1px solid #2a2a3a" }}>
          <div style={{ color:"#6b7280", fontSize:11, marginBottom:4 }}>충전 금액</div>
          <div style={{ color:"#ffd700", fontWeight:900, fontSize:22 }}>₩{(selected!).toLocaleString()}</div>
          {selected && PACKAGES.find(p=>p.amount===selected)?.bonus ? (
            <div style={{ color:"#22c55e", fontSize:12, marginTop:2 }}>+ 보너스 ₩{PACKAGES.find(p=>p.amount===selected)!.bonus.toLocaleString()}</div>
          ) : null}
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ color:"#9ca3af", fontSize:12, display:"block", marginBottom:6 }}>카드 번호</label>
          <input
            placeholder="0000 - 0000 - 0000 - 0000"
            value={cardNum}
            onChange={e => setCardNum(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())}
            style={{ width:"100%", padding:"12px 14px", borderRadius:10, background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }}
          />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          <div>
            <label style={{ color:"#9ca3af", fontSize:12, display:"block", marginBottom:6 }}>유효기간</label>
            <input placeholder="MM / YY" style={{ width:"100%", padding:"12px 14px", borderRadius:10, background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }} />
          </div>
          <div>
            <label style={{ color:"#9ca3af", fontSize:12, display:"block", marginBottom:6 }}>CVC</label>
            <input placeholder="•••" type="password" style={{ width:"100%", padding:"12px 14px", borderRadius:10, background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }} />
          </div>
        </div>
        <div style={{ background:"#0f1a0f", border:"1px solid #16a34a22", borderRadius:10, padding:"8px 12px", marginBottom:8, display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:14 }}>🔒</span>
          <span style={{ color:"#4ade80", fontSize:11 }}>256-bit SSL 암호화 · 안전 결제</span>
        </div>
        {/* 숨겨진 경고 — 배경과 거의 같은 색으로 눈에 안 띔 */}
        <p style={{ color:"#111318", fontSize:8.5, lineHeight:1.7, marginBottom:12, userSelect:"none" }}>
          ※ 본 프로그램은 교육 목적의 시뮬레이션입니다. 오작동 또는 예기치 않은 오류로 인해 입력하신 개인정보(카드번호·유효기간·CVC 등)가 외부에 유출될 가능성을 완전히 배제할 수 없습니다. 실제 카드 정보는 절대 입력하지 마십시오. 이 문구를 발견하셨다면 당신은 꼼꼼한 분입니다. 실제 불법도박 사이트도 이런 식으로 정보를 수집합니다.
        </p>
        <button
          onClick={handlePayment}
          disabled={processing}
          style={{ width:"100%", padding:"15px 0", borderRadius:12, fontSize:15, fontWeight:900, background: processing ? "#1a1a1a" : "linear-gradient(135deg,#ef4444,#dc2626)", color: processing ? "#555" : "#fff", border:"none", cursor: processing ? "default" : "pointer", transition:"all 0.2s" }}>
          {processing ? "처리 중..." : `₩${(selected!).toLocaleString()} 결제하기`}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, background:"rgba(0,0,0,0.96)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ maxWidth:460, width:"100%", background:"#0f0f18", border:"1px solid #2a2a3a", borderRadius:24, padding:"28px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <div style={{ color:"#e4e4e7", fontWeight:900, fontSize:17 }}>💰 코인 충전</div>
            <div style={{ color:"#6b7280", fontSize:11, marginTop:2 }}>패키지를 선택하세요</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#555", fontSize:22, cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
          {PACKAGES.map(pkg => (
            <button key={pkg.amount} onClick={() => setSelected(pkg.amount)} style={{
              background: selected===pkg.amount ? "linear-gradient(135deg,#1a0808,#2a0a0a)" : "#111",
              border: `2px solid ${selected===pkg.amount ? "#ef4444" : "#2a2a2a"}`,
              borderRadius:14, padding:"16px 12px", cursor:"pointer", textAlign:"center",
              transition:"all 0.2s", position:"relative",
              boxShadow: selected===pkg.amount ? "0 0 16px #ef444433" : "none",
            }}>
              {pkg.tag && (
                <div style={{ position:"absolute", top:-8, left:"50%", transform:"translateX(-50%)", background:"#ef4444", color:"#fff", fontSize:9, fontWeight:900, padding:"2px 8px", borderRadius:10, whiteSpace:"nowrap" }}>{pkg.tag}</div>
              )}
              <div style={{ color:"#fff", fontWeight:900, fontSize:18, marginBottom:4 }}>{pkg.label}</div>
              {pkg.bonus > 0 && <div style={{ color:"#22c55e", fontSize:11, fontWeight:700 }}>+보너스 ₩{pkg.bonus.toLocaleString()}</div>}
              <div style={{ color:"#555", fontSize:10, marginTop:4 }}>₩{pkg.amount.toLocaleString()}</div>
            </button>
          ))}
        </div>

        <div style={{ background:"#1a0808", border:"1px solid #ef444422", borderRadius:12, padding:"10px 14px", marginBottom:16, display:"flex", gap:8 }}>
          <span style={{ fontSize:14 }}>⚡</span>
          <span style={{ color:"#fca5a5", fontSize:12 }}>잔액 부족 시 충전 후 계속 게임 가능합니다</span>
        </div>

        <button
          onClick={() => selected && setStep("payment")}
          disabled={!selected}
          style={{ width:"100%", padding:"15px 0", borderRadius:12, fontSize:15, fontWeight:900, background: selected ? "linear-gradient(135deg,#ef4444,#dc2626)" : "#1a1a1a", color: selected ? "#fff" : "#444", border:"none", cursor: selected ? "pointer" : "default", boxShadow: selected ? "0 0 20px #ef444444" : "none" }}>
          {selected ? `₩${selected.toLocaleString()} 충전하기 →` : "금액을 선택하세요"}
        </button>
        <p style={{ color:"#1a1a1a", fontSize:9, textAlign:"center", marginTop:10 }}>시뮬레이션 · 실제 결제 불가</p>
      </div>
    </div>
  );
}

// ── 결과 화면 ─────────────────────────────────────────────────────────────────
function RevealScreen({ totalLost, totalCharged, round, onRetry, onHome }: { totalLost: number; totalCharged: number; round: number; onRetry: () => void; onHome: () => void }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:700, background:"#000", overflowY:"auto", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 20px" }}>
      <div style={{ maxWidth:600, width:"100%" }}>
        <div style={{ background:"linear-gradient(135deg,#0a0000,#1a0808)", border:"2px solid #ef4444", borderRadius:24, padding:"32px 28px", marginBottom:16, boxShadow:"0 0 40px #ef444422" }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontSize:56, marginBottom:12 }}>🎰</div>
            <h1 style={{ fontSize:24, fontWeight:900, color:"#ef4444", marginBottom:8 }}>이것이 불법 도박의 실체입니다</h1>
            <p style={{ color:"#6b7280", fontSize:13 }}>교육용 시뮬레이션 체험 완료</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
            {[
              { label:"총 게임 수", value:`${round}판`, color:"#f59e0b" },
              { label:"가상 손실액", value:`₩${Math.abs(Math.min(0,totalLost)).toLocaleString()}`, color:"#ef4444" },
              { label:"시뮬 충전 시도", value: totalCharged > 0 ? `₩${totalCharged.toLocaleString()}` : "없음", color:"#a855f7" },
              { label:"실제 평균 피해액", value:"₩230만원", color:"#3b82f6" },
            ].map((s,i) => (
              <div key={i} style={{ background:"#0f0f0f", borderRadius:12, padding:"14px 16px", textAlign:"center" }}>
                <p style={{ color:"#6b7280", fontSize:11, marginBottom:4 }}>{s.label}</p>
                <p style={{ color:s.color, fontWeight:900, fontSize:18 }}>{s.value}</p>
              </div>
            ))}
          </div>
          <div style={{ background:"#0f0f0f", borderRadius:14, padding:"18px 20px", marginBottom:24 }}>
            <p style={{ color:"#ef4444", fontWeight:700, fontSize:14, marginBottom:12 }}>🎯 체험하신 핵심 수법 4단계</p>
            {[
              { step:"1단계", title:"무료 코인으로 진입 유도", desc:"처음엔 무료 코인을 줘서 '이 돈은 잃어도 괜찮다'는 심리를 만들고 플랫폼에 익숙해지게 합니다." },
              { step:"2단계", title:"초반 연승 — 미끼 설계", desc:"처음 3~5판은 승률 97%로 거의 무조건 이기게 설계됩니다. '나는 감이 좋다'는 착각을 심어주는 가장 교묘한 함정입니다." },
              { step:"3단계", title:"코인 소진 후 결제 유도", desc:"잃기 시작하면 '조금만 더 충전하면 회복된다'는 심리를 자극해 실제 결제를 유도합니다. 이 과정에서 카드 정보가 탈취됩니다." },
              { step:"4단계", title:"환전 거부 & 잠적", desc:"실제 돈을 입금하면 '점검 중', '한도 초과' 등의 이유로 환전을 거부하고 사이트가 사라집니다." },
            ].map((s,i) => (
              <div key={i} style={{ display:"flex", gap:12, marginBottom: i<3 ? 12 : 0 }}>
                <div style={{ background:"#ef444422", border:"1px solid #ef444444", borderRadius:6, padding:"2px 8px", height:"fit-content", flexShrink:0 }}>
                  <span style={{ color:"#ef4444", fontSize:10, fontWeight:700 }}>{s.step}</span>
                </div>
                <div>
                  <p style={{ color:"#f4f4f5", fontWeight:700, fontSize:13, marginBottom:3 }}>{s.title}</p>
                  <p style={{ color:"#6b7280", fontSize:12, lineHeight:1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:"#052e16", border:"1px solid #16a34a44", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <p style={{ color:"#22c55e", fontWeight:700, fontSize:13, marginBottom:6 }}>🆘 도움이 필요하다면</p>
            <p style={{ color:"#86efac", fontSize:12, lineHeight:1.8 }}>
              한국도박문제예방치유원 <strong>1336</strong> (24시간, 무료)<br />
              경찰청 불법도박 신고 <strong>112</strong><br />
              불법 도박 이용 자체가 <strong>형사 처벌</strong> 대상입니다
            </p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onRetry} style={{ flex:1, padding:"14px 0", borderRadius:12, fontSize:14, background:"#1a1a1a", color:"#888", border:"1px solid #2a2a2a", cursor:"pointer" }}>다시 체험</button>
            <button onClick={onHome} style={{ flex:2, padding:"14px 0", borderRadius:12, fontSize:14, fontWeight:700, background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", border:"none", cursor:"pointer" }}>🏠 메인으로</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ── 바카라 ──────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function BaccaratGame({ balance, onResult, round }: { balance:number; onResult:(d:number)=>void; round:number }) {
  const [bet, setBet] = useState<"player"|"banker"|"tie"|null>(null);
  const [betAmount, setBetAmount] = useState(10000);
  const [phase, setPhase] = useState<"bet"|"deal"|"result">("bet");
  const [playerCards, setPlayerCards] = useState<{suit:string;rank:string}[]>([]);
  const [bankerCards, setBankerCards] = useState<{suit:string;rank:string}[]>([]);
  const [winner, setWinner] = useState<"player"|"banker"|"tie"|null>(null);

  const deal = useCallback(() => {
    if (!bet || betAmount > balance || betAmount <= 0) return;
    setPhase("deal"); setPlayerCards([]); setBankerCards([]); setWinner(null);
    const shouldWin = Math.random() < getWinRate(round);
    const pCards = [randCard(), randCard()];
    const bCards = [randCard(), randCard()];
    if (shouldWin) {
      if (bet === "player" && baccaratScore(pCards) <= baccaratScore(bCards)) bCards[0] = { suit:"♦", rank:"2" };
      if (bet === "banker" && baccaratScore(bCards) <= baccaratScore(pCards)) pCards[0] = { suit:"♦", rank:"2" };
    } else {
      if (bet === "player" && baccaratScore(pCards) >= baccaratScore(bCards)) pCards[0] = { suit:"♦", rank:"3" };
      if (bet === "banker" && baccaratScore(bCards) >= baccaratScore(pCards)) bCards[0] = { suit:"♦", rank:"3" };
    }
    const ps = baccaratScore(pCards), bs = baccaratScore(bCards);
    const w: "player"|"banker"|"tie" = ps > bs ? "player" : bs > ps ? "banker" : "tie";
    const allCards = [
      { t:"p" as const, c:pCards[0] }, { t:"b" as const, c:bCards[0] },
      { t:"p" as const, c:pCards[1] }, { t:"b" as const, c:bCards[1] },
    ];
    let idx = 0;
    const iv = setInterval(() => {
      if (idx >= allCards.length) {
        clearInterval(iv); setWinner(w); setPhase("result");
        let delta = -betAmount;
        if (w === bet) delta = bet === "tie" ? betAmount*8 : Math.floor(betAmount*(bet==="banker" ? 0.95 : 1));
        onResult(delta); return;
      }
      if (allCards[idx].t === "p") setPlayerCards(p => [...p, allCards[idx].c]);
      else setBankerCards(b => [...b, allCards[idx].c]);
      idx++;
    }, 400);
  }, [bet, betAmount, balance, round, onResult]);

  const reset = () => { setPhase("bet"); setBet(null); setPlayerCards([]); setBankerCards([]); setWinner(null); };
  const AMOUNTS = [5000,10000,30000,50000,100000];

  const Card = ({ card, hidden }: { card?: { suit:string; rank:string }; hidden?:boolean }) => (
    <div style={{ width:52, height:76, borderRadius:8, background: hidden ? "#1a1a2e" : "#fff", border:"2px solid #333", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px #00000060" }}>
      {hidden ? <span style={{ fontSize:22, opacity:0.3 }}>🂠</span>
        : card ? <><span style={{ fontSize:13, fontWeight:900, color:["♥","♦"].includes(card.suit)?"#ef4444":"#1a1a1a", lineHeight:1 }}>{card.rank}</span><span style={{ fontSize:16, color:["♥","♦"].includes(card.suit)?"#ef4444":"#1a1a1a" }}>{card.suit}</span></> : null}
    </div>
  );

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
        {(["player","banker","tie"] as const).map(side => (
          <button key={side} onClick={() => phase==="bet" && setBet(side)} style={{ padding:"14px 0", borderRadius:10, border:"2px solid", borderColor: bet===side ? (side==="player"?"#3b82f6":side==="banker"?"#ef4444":"#f59e0b") : "#2a2a2a", background: bet===side ? (side==="player"?"#1e3a5f":side==="banker"?"#3b0a0a":"#3b2a00") : "#111", color: bet===side ? "#fff" : "#555", fontWeight:700, fontSize:13, cursor:phase==="bet"?"pointer":"default", transition:"all 0.2s" }}>
            {side==="player"?"플레이어":side==="banker"?"뱅커":"타이"}
            <div style={{ fontSize:10, marginTop:2, color: bet===side?"#aaa":"#333" }}>{side==="player"?"1배":side==="banker"?"0.95배":"8배"}</div>
          </button>
        ))}
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {AMOUNTS.map(a => (
          <button key={a} onClick={() => phase==="bet" && setBetAmount(a)} style={{ padding:"6px 12px", borderRadius:20, border:"1px solid", borderColor: betAmount===a?"#f59e0b":"#2a2a2a", background: betAmount===a?"#3b2a00":"#111", color: betAmount===a?"#f59e0b":"#555", fontSize:11, fontWeight:700, cursor:"pointer" }}>₩{a.toLocaleString()}</button>
        ))}
      </div>
      <div style={{ background:"#0a1a0a", borderRadius:16, padding:"20px 16px", marginBottom:16, border:"1px solid #1a3a1a", position:"relative" }}>
        <div style={{ position:"absolute", inset:0, borderRadius:16, backgroundImage:"radial-gradient(#1a4a1a 1px,transparent 1px)", backgroundSize:"12px 12px", opacity:0.3, pointerEvents:"none" }} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, position:"relative", zIndex:1 }}>
          {[
            { label:"플레이어", cards:playerCards, score:baccaratScore(playerCards), isWinner:winner==="player", color:"#3b82f6" },
            { label:"뱅커", cards:bankerCards, score:baccaratScore(bankerCards), isWinner:winner==="banker", color:"#ef4444" },
          ].map((side,si) => (
            <div key={si} style={{ textAlign:"center" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:10 }}>
                <span style={{ color:side.color, fontWeight:700, fontSize:13 }}>{side.label}</span>
                {side.isWinner && <span style={{ background:side.color, color:"#fff", fontSize:9, fontWeight:900, padding:"1px 6px", borderRadius:10 }}>WIN</span>}
              </div>
              <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:8 }}>
                {[0,1].map(i => <Card key={i} card={side.cards[i]} hidden={phase==="bet"} />)}
              </div>
              {phase!=="bet" && <div style={{ background:"#00000044", borderRadius:8, display:"inline-block", padding:"4px 16px" }}><span style={{ color:"#fff", fontWeight:900, fontSize:20 }}>{side.cards.length>0?side.score:"-"}</span></div>}
            </div>
          ))}
        </div>
        {winner==="tie" && phase==="result" && <div style={{ textAlign:"center", marginTop:10, color:"#f59e0b", fontWeight:900, fontSize:14 }}>🤝 타이!</div>}
      </div>
      {phase==="bet" && <button onClick={deal} disabled={!bet||betAmount>balance} style={{ width:"100%", padding:"15px 0", borderRadius:12, fontSize:15, fontWeight:900, background: bet&&betAmount<=balance?"linear-gradient(135deg,#ef4444,#dc2626)":"#1a1a1a", color: bet&&betAmount<=balance?"#fff":"#444", border:"none", cursor:bet?"pointer":"default", transition:"all 0.2s" }}>{!bet?"베팅할 곳을 선택하세요":`₩${betAmount.toLocaleString()} 베팅`}</button>}
      {phase==="deal" && <div style={{ textAlign:"center", padding:"14px 0", color:"#f59e0b", fontWeight:700 }}>카드 배분 중...</div>}
      {phase==="result" && (
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ flex:1, textAlign:"center", padding:"14px 0", borderRadius:12, background: winner===bet?"#052e16":"#1a0808", border:`1px solid ${winner===bet?"#16a34a":"#dc2626"}` }}>
            <span style={{ color: winner===bet?"#22c55e":"#ef4444", fontWeight:900, fontSize:15 }}>
              {winner===bet ? `+₩${(bet==="tie"?betAmount*8:Math.floor(betAmount*(bet==="banker"?0.95:1))).toLocaleString()}` : `-₩${betAmount.toLocaleString()}`}
            </span>
          </div>
          <button onClick={reset} style={{ flex:1, padding:"14px 0", borderRadius:12, fontSize:14, fontWeight:700, background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", border:"none", cursor:"pointer" }}>다시 배팅</button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ── 달팽이 ──────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function SnailGame({ balance, onResult, round }: { balance:number; onResult:(d:number)=>void; round:number }) {
  const [pick, setPick] = useState<number|null>(null);
  const [betAmount, setBetAmount] = useState(10000);
  const [phase, setPhase] = useState<"bet"|"racing"|"result">("bet");
  const [positions, setPositions] = useState<number[]>([0,0,0,0,0,0]);
  const [winner, setWinner] = useState<number|null>(null);
  const animRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const startRace = useCallback(() => {
    if (pick===null||betAmount>balance) return;
    setPhase("racing"); setPositions([0,0,0,0,0,0]); setWinner(null);
    const shouldWin = Math.random()<getWinRate(round);
    const winnerIdx = shouldWin ? pick : (() => { let w=Math.floor(Math.random()*6); while(w===pick) w=Math.floor(Math.random()*6); return w; })();
    const pos=[0,0,0,0,0,0];
    animRef.current = setInterval(() => {
      for (let i=0;i<6;i++) if(pos[i]<100) pos[i]=Math.min(100,pos[i]+(i===winnerIdx?3.5:2.8)+Math.random()*1.5);
      setPositions([...pos]);
      if(pos[winnerIdx]>=100){
        clearInterval(animRef.current!);
        setWinner(winnerIdx); setPhase("result");
        onResult(winnerIdx===pick ? Math.floor(betAmount*5) : -betAmount);
      }
    },80);
  },[pick,betAmount,balance,round,onResult]);

  useEffect(() => () => { if(animRef.current) clearInterval(animRef.current); },[]);
  const reset = () => { setPhase("bet"); setPick(null); setPositions([0,0,0,0,0,0]); setWinner(null); };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
        {[0,1,2,3,4,5].map(i => (
          <button key={i} onClick={() => phase==="bet"&&setPick(i)} style={{ padding:"10px 0", borderRadius:10, border:"2px solid", borderColor: pick===i?SNAIL_COLORS[i]:"#2a2a2a", background: pick===i?`${SNAIL_COLORS[i]}22`:"#111", color: pick===i?SNAIL_COLORS[i]:"#555", fontWeight:700, fontSize:12, cursor:"pointer" }}>
            🐌 <span style={{ color:SNAIL_COLORS[i] }}>#{i+1}</span>
          </button>
        ))}
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {[5000,10000,30000,50000].map(a=>(
          <button key={a} onClick={() => phase==="bet"&&setBetAmount(a)} style={{ padding:"6px 12px", borderRadius:20, border:"1px solid", borderColor: betAmount===a?"#f59e0b":"#2a2a2a", background: betAmount===a?"#3b2a00":"#111", color: betAmount===a?"#f59e0b":"#555", fontSize:11, fontWeight:700, cursor:"pointer" }}>₩{a.toLocaleString()}</button>
        ))}
        <span style={{ color:"#555", fontSize:11, padding:"6px 4px" }}>당첨 5배</span>
      </div>
      <div style={{ background:"#0f1f0f", borderRadius:14, padding:"14px 12px", marginBottom:14, border:"1px solid #1a3a1a" }}>
        {[0,1,2,3,4,5].map(i=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom: i<5?8:0 }}>
            <span style={{ color:SNAIL_COLORS[i], fontSize:11, fontWeight:700, width:28, textAlign:"right", flexShrink:0 }}>#{i+1}</span>
            <div style={{ flex:1, height:20, background:"#0a150a", borderRadius:10, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:0, top:0, bottom:0, width:2, background:"#ef4444" }} />
              <div style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", left:`${Math.min(95,positions[i])}%`, fontSize:14, transition:"left 0.08s linear", filter: winner===i?"drop-shadow(0 0 6px #fff)":"none" }}>🐌</div>
            </div>
            {winner===i && <span style={{ color:"#f59e0b", fontSize:10, fontWeight:900, flexShrink:0 }}>1등!</span>}
            {phase==="result"&&winner!==i&&pick===i && <span style={{ color:"#ef4444", fontSize:10, flexShrink:0 }}>탈락</span>}
          </div>
        ))}
      </div>
      {phase==="bet"&&<button onClick={startRace} disabled={pick===null||betAmount>balance} style={{ width:"100%", padding:"14px 0", borderRadius:12, fontSize:15, fontWeight:900, background: pick!==null&&betAmount<=balance?"linear-gradient(135deg,#22c55e,#16a34a)":"#1a1a1a", color: pick!==null?"#fff":"#444", border:"none", cursor: pick!==null?"pointer":"default" }}>{pick===null?"달팽이를 선택하세요":`#${pick+1} 달팽이에 ₩${betAmount.toLocaleString()} 베팅!`}</button>}
      {phase==="racing"&&<div style={{ textAlign:"center", padding:"14px 0", color:"#22c55e", fontWeight:700 }}>🏁 경주 중...</div>}
      {phase==="result"&&(
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ flex:1, textAlign:"center", padding:"13px 0", borderRadius:12, background: winner===pick?"#052e16":"#1a0808", border:`1px solid ${winner===pick?"#16a34a":"#dc2626"}` }}>
            <span style={{ color: winner===pick?"#22c55e":"#ef4444", fontWeight:900 }}>{winner===pick?`+₩${(betAmount*5).toLocaleString()}`:`-₩${betAmount.toLocaleString()}`}</span>
          </div>
          <button onClick={reset} style={{ flex:1, padding:"13px 0", borderRadius:12, fontSize:13, fontWeight:700, background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", border:"none", cursor:"pointer" }}>다시 하기</button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ── 사다리 ──────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function LadderGame({ balance, onResult, round }: { balance:number; onResult:(d:number)=>void; round:number }) {
  const [pick, setPick] = useState<number|null>(null);
  const [betAmount, setBetAmount] = useState(10000);
  const [phase, setPhase] = useState<"bet"|"climbing"|"result">("bet");
  const [pathStep, setPathStep] = useState(0);
  const [result, setResult] = useState<number|null>(null);
  const [ladderMap, setLadderMap] = useState<boolean[][]>([]);
  const COLS=4, ROWS=6, LABELS=["①","②","③","④"];

  const generateLadder = useCallback((shouldWin:boolean, startCol:number) => {
    const grid:boolean[][] = Array.from({length:ROWS},()=>Array(COLS-1).fill(false));
    for(let r=0;r<ROWS;r++){
      const cols=Array.from({length:COLS-1},(_,i)=>i).sort(()=>Math.random()-0.5);
      let placed=0;
      for(const c of cols){
        if(placed>=2) break;
        if(c===0||!grid[r][c-1]){ grid[r][c]=true; placed++; }
      }
    }
    let pos=startCol;
    for(let r=0;r<ROWS;r++){
      if(pos>0&&grid[r][pos-1]) pos--;
      else if(pos<COLS-1&&grid[r][pos]) pos++;
    }
    return { grid, outcome: shouldWin ? startCol : (pos===startCol ? (startCol+1)%COLS : pos) };
  },[]);

  const start = useCallback(() => {
    if(pick===null||betAmount>balance) return;
    setPhase("climbing"); setPathStep(0);
    const { grid, outcome } = generateLadder(Math.random()<getWinRate(round), pick);
    setLadderMap(grid);
    let step=0;
    const iv=setInterval(()=>{ step++; setPathStep(step); if(step>=ROWS+1){ clearInterval(iv); setResult(outcome); setPhase("result"); onResult(outcome===pick?Math.floor(betAmount*3.5):-betAmount); } },350);
  },[pick,betAmount,balance,round,generateLadder,onResult]);

  const reset = () => { setPhase("bet"); setPick(null); setResult(null); setPathStep(0); setLadderMap([]); };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:14 }}>
        {LABELS.map((label,i)=>(
          <button key={i} onClick={()=>phase==="bet"&&setPick(i)} style={{ padding:"12px 0", borderRadius:10, border:"2px solid", borderColor: pick===i?"#a855f7":"#2a2a2a", background: pick===i?"#2e1a4a":"#111", color: pick===i?"#d8b4fe":"#555", fontWeight:900, fontSize:16, cursor:"pointer" }}>{label}</button>
        ))}
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {[5000,10000,30000,50000].map(a=>(
          <button key={a} onClick={()=>phase==="bet"&&setBetAmount(a)} style={{ padding:"6px 12px", borderRadius:20, border:"1px solid", borderColor: betAmount===a?"#f59e0b":"#2a2a2a", background: betAmount===a?"#3b2a00":"#111", color: betAmount===a?"#f59e0b":"#555", fontSize:11, fontWeight:700, cursor:"pointer" }}>₩{a.toLocaleString()}</button>
        ))}
        <span style={{ color:"#555", fontSize:11, padding:"6px 4px" }}>당첨 3.5배</span>
      </div>
      <div style={{ background:"#0f0f1f", borderRadius:14, padding:"16px 12px", marginBottom:14, border:"1px solid #1a1a3a" }}>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${COLS},1fr)`, marginBottom:8 }}>
          {LABELS.map((l,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ display:"inline-block", width:28, height:28, borderRadius:"50%", background: pick===i?"#a855f7":"#1a1a2e", border:`2px solid ${pick===i?"#a855f7":"#2a2a3a"}`, lineHeight:"26px", fontSize:12, fontWeight:900, color: pick===i?"#fff":"#555" }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ position:"relative", height:ROWS*28 }}>
          {Array.from({length:COLS},(_,i)=>(
            <div key={i} style={{ position:"absolute", left:`${(i/(COLS-1))*100}%`, top:0, bottom:0, width:2, background:"#2a2a4a", transform:"translateX(-50%)" }} />
          ))}
          {ladderMap.map((row,r)=>row.map((has,c)=>has?(
            <div key={`${r}-${c}`} style={{ position:"absolute", left:`${(c/(COLS-1))*100}%`, top:r*28+12, width:`${(1/(COLS-1))*100}%`, height:2, background:"#3b3b6a" }} />
          ):null))}
          {phase!=="bet"&&pick!==null&&(
            <div style={{ position:"absolute", left:`${(pick/(COLS-1))*100}%`, top:Math.min(pathStep*28,ROWS*28)-8, width:16, height:16, borderRadius:"50%", background:"#a855f7", boxShadow:"0 0 10px #a855f7", transform:"translateX(-50%)", transition:"top 0.3s", zIndex:10 }} />
          )}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${COLS},1fr)`, marginTop:8 }}>
          {LABELS.map((l,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ display:"inline-block", width:28, height:28, borderRadius:"50%", background: phase==="result"&&result===i?(result===pick?"#052e16":"#1a0808"):"#1a1a2e", border:`2px solid ${phase==="result"&&result===i?(result===pick?"#16a34a":"#dc2626"):"#2a2a3a"}`, lineHeight:"26px", fontSize:12, fontWeight:900, color: phase==="result"&&result===i?(result===pick?"#22c55e":"#ef4444"):"#555" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {phase==="bet"&&<button onClick={start} disabled={pick===null||betAmount>balance} style={{ width:"100%", padding:"14px 0", borderRadius:12, fontSize:15, fontWeight:900, background: pick!==null&&betAmount<=balance?"linear-gradient(135deg,#a855f7,#7c3aed)":"#1a1a1a", color: pick!==null?"#fff":"#444", border:"none", cursor: pick!==null?"pointer":"default" }}>{pick===null?"출발 번호를 선택하세요":`${LABELS[pick]}번에서 출발 — ₩${betAmount.toLocaleString()} 베팅`}</button>}
      {phase==="climbing"&&<div style={{ textAlign:"center", padding:"14px 0", color:"#a855f7", fontWeight:700 }}>🪜 올라가는 중...</div>}
      {phase==="result"&&(
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ flex:1, textAlign:"center", padding:"13px 0", borderRadius:12, background: result===pick?"#052e16":"#1a0808", border:`1px solid ${result===pick?"#16a34a":"#dc2626"}` }}>
            <span style={{ color: result===pick?"#22c55e":"#ef4444", fontWeight:900 }}>{result===pick?`+₩${Math.floor(betAmount*3.5).toLocaleString()}`:`-₩${betAmount.toLocaleString()}`}</span>
          </div>
          <button onClick={reset} style={{ flex:1, padding:"13px 0", borderRadius:12, fontSize:13, fontWeight:700, background:"linear-gradient(135deg,#a855f7,#7c3aed)", color:"#fff", border:"none", cursor:"pointer" }}>다시 하기</button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ── 메인 페이지 ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function PlayContent() {
  const router = useRouter();
  const params = useSearchParams();
  const siteName = params.get("name") ?? "히어로 CASINO";

  const INITIAL_BALANCE = 100000;
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [round, setRound] = useState(0);
  const [totalDelta, setTotalDelta] = useState(0);
  const [totalCharged, setTotalCharged] = useState(0);
  const [activeGame, setActiveGame] = useState<"baccarat"|"snail"|"ladder">("baccarat");
  const [history, setHistory] = useState<{game:string;delta:number;bal:number}[]>([]);

  // 오버레이 상태
  const [showFreeCoin, setShowFreeCoin] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCharge, setShowCharge] = useState(false);
  const [showAddiction, setShowAddiction] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [addictionDismissed, setAddictionDismissed] = useState(false);

  // 초반 연승 카운터
  const [winStreak, setWinStreak] = useState(0);
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const streakTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  // 잔액 소진 감지
  const prevBalance = useRef(balance);
  useEffect(() => {
    if (balance <= 0 && prevBalance.current > 0) {
      setTimeout(() => setShowCharge(true), 800);
    }
    prevBalance.current = balance;
  }, [balance]);

  const handleResult = useCallback((delta: number) => {
    setRound(r => r + 1);
    setBalance(b => {
      const nb = Math.max(0, b + delta);
      setHistory(h => [{ game: activeGame, delta, bal: nb }, ...h].slice(0, 20));
      return nb;
    });
    setTotalDelta(t => t + delta);

    if (delta > 0) {
      setWinStreak(w => {
        const next = w + 1;
        if (next >= 2) {
          setShowStreakBanner(true);
          if (streakTimer.current) clearTimeout(streakTimer.current);
          streakTimer.current = setTimeout(() => setShowStreakBanner(false), 2500);
        }
        return next;
      });
    } else {
      setWinStreak(0);
    }

    if (!addictionDismissed && totalDelta + delta < -40000) {
      setTimeout(() => setShowAddiction(true), 600);
    }
  }, [activeGame, totalDelta, addictionDismissed]);

  const handleCharge = (amount: number) => {
    setBalance(b => b + amount);
    setTotalCharged(t => t + amount);
    setShowCharge(false);
  };

  const handleRetry = () => {
    setBalance(INITIAL_BALANCE); setRound(0); setTotalDelta(0); setTotalCharged(0);
    setHistory([]); setShowReveal(false); setShowAddiction(false);
    setAddictionDismissed(false); setWinStreak(0); setShowFreeCoin(true);
  };

  const TABS = [
    { id:"baccarat" as const, label:"바카라", icon:"🃏", color:"#ef4444" },
    { id:"snail" as const, label:"달팽이", icon:"🐌", color:"#22c55e" },
    { id:"ladder" as const, label:"사다리", icon:"🪜", color:"#a855f7" },
  ];

  const winRate = Math.round(getWinRate(round) * 100);

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#fff", position:"relative" }}>
      <style>{`
        @keyframes streakIn { from { opacity:0; transform:scale(0.8) translateY(-10px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes gold-shimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
      `}</style>

      {/* ── 무료 코인 팝업 ── */}
      {showFreeCoin && <FreeCoinPopup siteName={siteName} onClaim={() => setShowFreeCoin(false)} />}

      {/* ── 충전 팝업 ── */}
      {showCharge && <ChargePopup onClose={() => setShowCharge(false)} onCharge={handleCharge} onReveal={() => { setShowCharge(false); setShowReveal(true); }} />}

      {/* ── 중독 경고 ── */}
      {showAddiction && !showReveal && (
        <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.94)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ maxWidth:440, width:"100%", background:"#0a0000", border:"2px solid #ef4444", borderRadius:20, padding:"32px 24px", textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🚨</div>
            <h2 style={{ fontSize:20, fontWeight:900, color:"#ef4444", marginBottom:8 }}>잠깐 멈추세요</h2>
            <p style={{ color:"#fca5a5", fontSize:13, marginBottom:16, lineHeight:1.6 }}>
              가상 머니 <strong style={{ color:"#ef4444" }}>₩{Math.abs(Math.min(0,totalDelta)).toLocaleString()}</strong>을 잃었습니다.<br />
              실제 도박에서 이 돈은 <strong>절대 돌아오지 않습니다.</strong>
            </p>
            <div style={{ background:"#1a0808", borderRadius:12, padding:14, marginBottom:18, textAlign:"left" }}>
              <p style={{ color:"#fca5a5", fontSize:12, fontWeight:700, marginBottom:8 }}>⚠️ 지금 이 순간이 도박 중독의 시작입니다</p>
              <ul style={{ color:"#888", fontSize:12, lineHeight:2, paddingLeft:16, margin:0 }}>
                <li>처음 잘 따던 건 <strong style={{ color:"#fbbf24" }}>의도적으로 설계된 미끼</strong>입니다</li>
                <li>현재 실제 승률은 약 <strong style={{ color:"#ef4444" }}>{winRate}%</strong>로 급감했습니다</li>
                <li>도박 중독 상담: <strong style={{ color:"#22c55e" }}>1336</strong> (24시간 무료)</li>
              </ul>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => { setShowAddiction(false); setAddictionDismissed(true); }} style={{ flex:1, padding:"12px 0", borderRadius:12, fontSize:13, background:"transparent", color:"#555", border:"1px solid #2a2a2a", cursor:"pointer" }}>계속 체험</button>
              <button onClick={() => { setShowAddiction(false); setShowReveal(true); }} style={{ flex:2, padding:"12px 0", borderRadius:12, fontSize:14, fontWeight:700, background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", border:"none", cursor:"pointer" }}>🛡️ 수법 확인하기</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 튜토리얼 팝업 ── */}
      {showTutorial && (
        <TutorialPopup game={activeGame} onClose={() => setShowTutorial(false)} />
      )}

      {/* ── 결과 화면 ── */}
      {showReveal && <RevealScreen totalLost={totalDelta} totalCharged={totalCharged} round={round} onRetry={handleRetry} onHome={() => router.push("/")} />}

      {/* ── 연승 배너 ── */}
      {showStreakBanner && (
        <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:150, textAlign:"center", pointerEvents:"none", animation:"streakIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div style={{ background:"linear-gradient(135deg,#ffd700,#f59e0b,#ffd700)", backgroundSize:"200% 200%", animation:"gold-shimmer 1s ease infinite", borderRadius:20, padding:"16px 32px", boxShadow:"0 0 40px #ffd70088" }}>
            <div style={{ fontSize:28, marginBottom:4 }}>🎉</div>
            <div style={{ color:"#000", fontWeight:900, fontSize:20 }}>{winStreak}연승!</div>
            <div style={{ color:"#5a3a00", fontSize:13, fontWeight:700 }}>당신은 감이 좋군요!</div>
          </div>
        </div>
      )}

      {/* ── 상단 시뮬레이션 배지 ── */}
      <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"#052e16", borderBottom:"2px solid #16a34a", padding:"6px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ color:"#22c55e", fontSize:11, fontWeight:700 }}>🎓 교육용 시뮬레이션 — 실제 불법도박 사이트가 아닙니다. 실제 돈이 오가지 않습니다.</span>
        <button onClick={() => setShowReveal(true)} style={{ background:"none", border:"none", color:"#86efac", fontSize:11, cursor:"pointer", textDecoration:"underline" }}>수법 보기</button>
      </div>

      <div style={{ paddingTop:36 }}>
        {/* ── 사이트 헤더 ── */}
        <div style={{ background:"#0d0d0d", borderBottom:"1px solid #1a1a1a" }}>
          <div style={{ maxWidth:900, margin:"0 auto", padding:"0 16px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ background:"linear-gradient(135deg,#ef4444,#991b1b)", borderRadius:8, padding:"6px 12px" }}>
                  <span style={{ color:"#fff", fontWeight:900, fontSize:16 }}>{siteName.split(" ")[0]}</span>
                </div>
                <span style={{ color:"#ef4444", fontSize:11, fontWeight:700, border:"1px solid #ef444444", borderRadius:20, padding:"2px 8px" }}>CASINO</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ textAlign:"right" }}>
                  <p style={{ color:"#6b7280", fontSize:10 }}>보유 코인 (가상)</p>
                  <p style={{ color: balance > 60000 ? "#f59e0b" : "#ef4444", fontWeight:900, fontSize:18 }}>₩{balance.toLocaleString()}</p>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ color:"#6b7280", fontSize:10 }}>총 손익</p>
                  <p style={{ color: totalDelta>=0?"#22c55e":"#ef4444", fontWeight:900, fontSize:14 }}>{totalDelta>=0?"+":""}₩{totalDelta.toLocaleString()}</p>
                </div>
                {/* 충전 버튼 */}
                <button onClick={() => setShowCharge(true)} style={{ padding:"8px 14px", borderRadius:10, background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"#000", fontWeight:900, fontSize:12, border:"none", cursor:"pointer", boxShadow:"0 0 12px #f59e0b44" }}>
                  💰 충전
                </button>
                <button onClick={() => router.push("/gambling")} style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:8, padding:"6px 12px", color:"#888", fontSize:11, cursor:"pointer" }}>나가기</button>
              </div>
            </div>
            {/* 탭 */}
            <div style={{ display:"flex", gap:0, borderTop:"1px solid #1a1a1a" }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveGame(tab.id)} style={{ padding:"10px 20px", background:"none", border:"none", borderBottom: activeGame===tab.id?`2px solid ${tab.color}`:"2px solid transparent", color: activeGame===tab.id?tab.color:"#555", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", gap:6 }}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 메인 콘텐츠 ── */}
        <div style={{ maxWidth:900, margin:"0 auto", padding:"20px 16px", display:"grid", gridTemplateColumns:"1fr 280px", gap:16 }}>
          <div>
            {/* 연승/승률 인디케이터 */}
            {round > 0 && (
              <div style={{ display:"flex", gap:10, marginBottom:14 }}>
                {round <= 5 && winStreak > 0 && (
                  <div style={{ flex:1, background:"#0a1a0a", border:"1px solid #16a34a44", borderRadius:10, padding:"8px 14px", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:16 }}>🔥</span>
                    <span style={{ color:"#22c55e", fontSize:12, fontWeight:700 }}>{winStreak}연승 중! 오늘 운이 좋으시네요</span>
                  </div>
                )}
                {round > 5 && (
                  <div style={{ flex:1, background:"#1a0808", border:"1px solid #dc262644", borderRadius:10, padding:"8px 14px", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:14 }}>📉</span>
                    <span style={{ color:"#fca5a5", fontSize:11 }}>{round}판째 — 현재 실제 승률 <strong style={{ color:"#ef4444" }}>{winRate}%</strong> (처음 97%에서 급감)</span>
                  </div>
                )}
              </div>
            )}

            {/* 잔액 부족 경고 */}
            {balance < 20000 && balance > 0 && (
              <div style={{ marginBottom:14, background:"#1a0a00", border:"1px solid #f59e0b44", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ color:"#fbbf24", fontSize:12, fontWeight:700 }}>⚠️ 잔액이 부족합니다. 조금만 더 충전하면 회복할 수 있어요!</span>
                <button onClick={() => setShowCharge(true)} style={{ background:"#f59e0b", color:"#000", border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:900, cursor:"pointer" }}>충전</button>
              </div>
            )}

            {/* 게임 */}
            <div style={{ background:"#111", borderRadius:16, padding:"20px 18px", border:"1px solid #1a1a1a" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
                <span style={{ fontSize:20 }}>{TABS.find(t=>t.id===activeGame)?.icon}</span>
                <h2 style={{ color:"#e4e4e7", fontWeight:900, fontSize:17 }}>{TABS.find(t=>t.id===activeGame)?.label}</h2>
                <span style={{ color:"#374151", fontSize:11 }}>— 교육용 시뮬레이션</span>
                <button onClick={() => setShowTutorial(true)} style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:20, background:"#1e1e2e", border:"1px solid #3b82f655", color:"#93c5fd", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                  ❓ 처음이에요
                </button>
              </div>
              {activeGame==="baccarat" && <BaccaratGame balance={balance} onResult={handleResult} round={round} />}
              {activeGame==="snail" && <SnailGame balance={balance} onResult={handleResult} round={round} />}
              {activeGame==="ladder" && <LadderGame balance={balance} onResult={handleResult} round={round} />}
            </div>

            {/* 잔액 0 */}
            {balance === 0 && (
              <div style={{ marginTop:14, background:"#0a0000", border:"2px solid #ef4444", borderRadius:14, padding:"20px", textAlign:"center" }}>
                <p style={{ color:"#ef4444", fontWeight:900, fontSize:16, marginBottom:6 }}>💸 잔액이 0원이 됐습니다</p>
                <p style={{ color:"#888", fontSize:13, marginBottom:14 }}>실제 도박이었다면 지금 대출이나 가족에게 손을 벌릴 상황입니다.</p>
                <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                  <button onClick={() => setShowCharge(true)} style={{ padding:"12px 24px", borderRadius:10, background:"#f59e0b", color:"#000", fontWeight:900, border:"none", cursor:"pointer", fontSize:14 }}>💰 충전하기</button>
                  <button onClick={() => setShowReveal(true)} style={{ padding:"12px 24px", borderRadius:10, background:"#ef4444", color:"#fff", fontWeight:700, border:"none", cursor:"pointer", fontSize:14 }}>🛡️ 수법 확인</button>
                </div>
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div>
            {/* 가짜 실시간 당첨 */}
            <div style={{ background:"#111", borderRadius:14, padding:14, marginBottom:12, border:"1px solid #1a1a1a" }}>
              <p style={{ color:"#6b7280", fontSize:11, marginBottom:10, fontWeight:700 }}>🏆 실시간 당첨 (조작된 수치)</p>
              {[
                { user:"김**", amount:"₩1,240,000", game:"바카라" },
                { user:"이**", amount:"₩387,000", game:"달팽이" },
                { user:"박**", amount:"₩890,000", game:"사다리" },
                { user:"최**", amount:"₩2,100,000", game:"바카라" },
                { user:"정**", amount:"₩156,000", game:"달팽이" },
              ].map((w,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom: i<4?"1px solid #1a1a1a":"none" }}>
                  <span style={{ color:"#888", fontSize:11 }}>{w.user} <span style={{ color:"#374151" }}>{w.game}</span></span>
                  <span style={{ color:"#f59e0b", fontSize:11, fontWeight:700 }}>{w.amount}</span>
                </div>
              ))}
            </div>

            {/* 내 기록 */}
            <div style={{ background:"#111", borderRadius:14, padding:14, border:"1px solid #1a1a1a", marginBottom:10 }}>
              <p style={{ color:"#6b7280", fontSize:11, marginBottom:10, fontWeight:700 }}>📋 내 게임 기록</p>
              {history.length===0
                ? <p style={{ color:"#374151", fontSize:12, textAlign:"center", padding:"16px 0" }}>아직 게임 기록 없음</p>
                : history.map((h,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom: i<history.length-1?"1px solid #1a1a1a":"none" }}>
                    <span style={{ color:"#555", fontSize:10 }}>{h.game==="baccarat"?"🃏":h.game==="snail"?"🐌":"🪜"} {i===0?"방금":`${i+1}판 전`}</span>
                    <span style={{ color: h.delta>=0?"#22c55e":"#ef4444", fontSize:11, fontWeight:700 }}>{h.delta>=0?"+":""}₩{h.delta.toLocaleString()}</span>
                  </div>
                ))
              }
            </div>

            <button onClick={() => setShowReveal(true)} style={{ width:"100%", padding:"12px 0", borderRadius:12, background:"transparent", border:"1px solid #16a34a44", color:"#22c55e", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              🛡️ 지금까지 체험한 수법 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>로딩 중...</div>}>
      <PlayContent />
    </Suspense>
  );
}
