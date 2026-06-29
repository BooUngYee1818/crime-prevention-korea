"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { useLang } from "@/lib/LanguageContext";

// ── 파티클 스파크 ─────────────────────────────────────────────────────────────
const SPARK_COLORS = ["#ff0080","#ff6600","#ffdd00","#00ff88","#00ccff","#aa44ff","#ff44aa","#ffffff"];
function Sparks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const particles: { x:number; y:number; vx:number; vy:number; r:number; color:string; life:number; maxLife:number }[] = [];
    const spawn = () => {
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 2,
          vy: -(Math.random() * 3 + 1.5),
          r: Math.random() * 3 + 1,
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
          life: 0, maxLife: Math.random() * 80 + 60,
        });
      }
    };
    const spawnInterval = setInterval(spawn, 80);
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.life++;
        if (p.life > p.maxLife) { particles.splice(i, 1); continue; }
        const alpha = 1 - p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;
        ctx.shadowBlur = 8; ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { clearInterval(spawnInterval); cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1 }} />;
}

// ── 워터마크 ──────────────────────────────────────────────────────────────────
function HiddenWatermark() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontSize:18, fontWeight:900, color:"#fff", opacity:0.015, transform:"rotate(-30deg)", userSelect:"none", whiteSpace:"nowrap", lineHeight:3 }}>
        도박방지시뮬레이션 불법도박예방체험관<br/>
        도박방지시뮬레이션 불법도박예방체험관<br/>
        도박방지시뮬레이션 불법도박예방체험관
      </div>
    </div>
  );
}

// ── 당첨 토스트 ───────────────────────────────────────────────────────────────
const WIN_NAMES = ["김**","이**","박**","최**","정**","강**","조**","윤**","장**","임**","오**","한**"];
const WIN_AMOUNTS = ["₩1,200,000","₩340,000","₩2,800,000","₩560,000","₩4,500,000","₩780,000","₩1,900,000","₩3,200,000","₩8,750,000","₩450,000"];
const WIN_GAMES = ["바카라","달팽이","사다리","슬롯","스포츠","포커"];

function WinToast({ msg, onDone }: { msg:{name:string;amount:string;game:string}; onDone:()=>void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ background:"linear-gradient(135deg,#0a1a0a,#0f2a0f)", border:"1px solid #22c55e", borderRadius:12, padding:"10px 16px", display:"flex", alignItems:"center", gap:10, boxShadow:"0 4px 20px #22c55e33", animation:"toastIn 0.3s ease", marginBottom:8 }}>
      <span style={{ fontSize:18 }}>🏆</span>
      <div>
        <span style={{ color:"#86efac", fontWeight:700, fontSize:12 }}>{msg.name}</span>
        <span style={{ color:"#6b7280", fontSize:11 }}> 님이 {msg.game}에서 </span>
        <span style={{ color:"#22c55e", fontWeight:900, fontSize:13 }}>{msg.amount}</span>
        <span style={{ color:"#6b7280", fontSize:11 }}> 당첨!</span>
      </div>
    </div>
  );
}

const SITES = [
  { id:"herocasino", display:"👑 히어로 CASINO", sub:"BACCARAT · SLOT · LIVE", code:"7474", bonus:"첫충 40% + 카지노 1.2%", extra:"슬롯 4% · 매충 15%", glow:"#ff0080", dark:"#1a0010", badge:"🔥 HOT", games:["바카라","달팽이","사다리","슬롯"] },
  { id:"goldcasino", display:"💎 GOLD 888", sub:"PREMIUM · VIP · JACKPOT", code:"8888", bonus:"신규 50% 대박 이벤트", extra:"VIP 전용 · 무제한 환전", glow:"#ffd700", dark:"#1a1400", badge:"👑 VIP", games:["바카라","포커","슬롯","스포츠"] },
  { id:"speedbet", display:"⚡ SPEED BET", sub:"SPORTS · LIVE · MINI", code:"2525", bonus:"매충 10% 무한 · 15% 돌발", extra:"스포츠 · 실시간 카지노", glow:"#00ccff", dark:"#001a20", badge:"⚡ LIVE", games:["스포츠","달팽이","사다리","바카라"] },
  { id:"diamondhouse", display:"🌈 RAINBOW VIP", sub:"ROYAL · EXCLUSIVE · P2P", code:"9999", bonus:"페이백 1,000만 · 골프 4%", extra:"카지노 무제한 · 토너먼트", glow:"#aa44ff", dark:"#100020", badge:"💎 ROYAL", games:["포커","바카라","슬롯","달팽이"] },
  { id:"luckyseven", display:"🍀 LUCKY 777", sub:"SLOT · JACKPOT · BONUS", code:"7777", bonus:"첫충 30% + 슬롯 4%", extra:"잭팟 매일 지급 · 미니게임", glow:"#00ff88", dark:"#001508", badge:"🍀 NEW", games:["슬롯","사다리","달팽이","미니게임"] },
  { id:"nightclub", display:"🌙 NIGHT CLUB", sub:"BACCARAT · POKER · P2P", code:"6969", bonus:"승급이벤트 최대 2천만원", extra:"P2P · 매충 50% 페이백", glow:"#ff6600", dark:"#1a0800", badge:"🌙 NIGHT", games:["바카라","포커","P2P","사다리"] },
];

export default function GamblingPortalPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [showWarning, setShowWarning] = useState(true);
  const [hoveredSite, setHoveredSite] = useState<string|null>(null);
  const [toasts, setToasts] = useState<{id:number;name:string;amount:string;game:string}[]>([]);
  const [liveUsers, setLiveUsers] = useState(12847);
  const [jackpot, setJackpot] = useState(48_200_000);
  const [pulseIdx, setPulseIdx] = useState(0);
  const [rainbowAngle, setRainbowAngle] = useState(0);
  const toastId = useRef(0);

  // 잭팟 카운터
  useEffect(() => { const t = setInterval(() => setJackpot(v => v + Math.floor(Math.random()*5000+1000)), 60); return () => clearInterval(t); }, []);
  // 접속자
  useEffect(() => { const t = setInterval(() => setLiveUsers(v => v + Math.floor(Math.random()*8)-3), 2000); return () => clearInterval(t); }, []);
  // 카드 펄스
  useEffect(() => { const t = setInterval(() => setPulseIdx(v => (v+1)%SITES.length), 1200); return () => clearInterval(t); }, []);
  // 무지개 각도
  useEffect(() => { const t = setInterval(() => setRainbowAngle(v => (v+2)%360), 30); return () => clearInterval(t); }, []);
  // 당첨 토스트
  useEffect(() => {
    const spawn = () => {
      const id = ++toastId.current;
      setToasts(p => [...p.slice(-4), { id, name:WIN_NAMES[Math.floor(Math.random()*WIN_NAMES.length)], amount:WIN_AMOUNTS[Math.floor(Math.random()*WIN_AMOUNTS.length)], game:WIN_GAMES[Math.floor(Math.random()*WIN_GAMES.length)] }]);
    };
    spawn();
    const t = setInterval(spawn, 2400);
    return () => clearInterval(t);
  }, []);
  // 경고 자동 닫힘
  useEffect(() => { const t = setTimeout(() => setShowWarning(false), 9000); return () => clearTimeout(t); }, []);

  const rainbow = `hsl(${rainbowAngle},100%,55%)`;
  const rainbow2 = `hsl(${(rainbowAngle+60)%360},100%,55%)`;
  const rainbow3 = `hsl(${(rainbowAngle+120)%360},100%,55%)`;
  const rainbow4 = `hsl(${(rainbowAngle+180)%360},100%,55%)`;
  const rainbow5 = `hsl(${(rainbowAngle+240)%360},100%,55%)`;
  const rainbow6 = `hsl(${(rainbowAngle+300)%360},100%,55%)`;

  const marquee = "🎰 모든베팅가능 무제재 ★ 환전무제한 고액전용 ★ 신규 첫충 40% ★ 무한 15% ★ 실시간 바카라 달팽이 사다리 ★ VIP 전용 혜택 ★ 지금 가입시 무료코인 100% ★ ";

  return (
    <div style={{ minHeight:"100vh", background:"#030305", color:"#fff", position:"relative", overflow:"hidden" }}>
      <HiddenWatermark />
      <Sparks />

      <style>{`
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-3px)} 75%{transform:translateX(3px)} }
        @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.08)} 100%{transform:scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow-ring { 0%,100%{box-shadow:0 0 0 0 transparent} 50%{box-shadow:0 0 0 6px rgba(255,255,255,0.15)} }
        .site-card { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s !important; }
        .site-card:hover { transform: translateY(-6px) scale(1.02) !important; }
        .nav-item:hover { background:#ffffff18 !important; }
        .game-btn:hover { transform: scale(1.05) !important; }
        .game-btn { transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1) !important; }
      `}</style>

      {/* ── 진입 경고 ── */}
      {showWarning && (
        <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.95)", backdropFilter:"blur(14px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ maxWidth:480, width:"100%", background:"linear-gradient(135deg,#0a0a0a,#0f0f18)", border:"2px solid #ef4444", borderRadius:24, padding:"32px 28px", textAlign:"center", boxShadow:"0 0 60px #ef444433" }}>
            <div style={{ fontSize:9, color:"#22c55e", fontWeight:700, letterSpacing:2, marginBottom:12, opacity:0.8 }}>⚠ 불법도박 예방 시뮬레이션 체험관 ⚠</div>
            <div style={{ fontSize:52, marginBottom:12, animation:"float 2s ease-in-out infinite" }}>🎰</div>
            <h2 style={{ fontSize:20, fontWeight:900, color:"#ef4444", marginBottom:12 }}>지금 보시는 화면은<br/>실제 도박 사이트입니까?</h2>
            <div style={{ background:"#0f0f0f", border:"1px solid #ef444422", borderRadius:14, padding:16, marginBottom:20, textAlign:"left" }}>
              <p style={{ color:"#ef4444", fontSize:13, fontWeight:700, marginBottom:8 }}>📢 이것은 범죄예방 교육 시뮬레이션입니다</p>
              <ul style={{ color:"#888", fontSize:12, lineHeight:2.2, paddingLeft:16, margin:0 }}>
                <li>실제 도박 사이트처럼 보이도록 <strong style={{ color:"#fbbf24" }}>의도적으로 제작</strong>된 화면입니다</li>
                <li>실제 돈은 절대 나가지 않습니다</li>
                <li>불법 도박 유혹 수법을 직접 경험해보세요</li>
                <li>진짜 도박 사이트 접속 자체가 <strong style={{ color:"#ef4444" }}>형사처벌 대상</strong>입니다</li>
              </ul>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => router.push("/")} style={{ flex:1, padding:"13px 0", borderRadius:12, fontSize:13, background:"transparent", color:"#555", border:"1px solid #2a2a2a", cursor:"pointer" }}>나가기</button>
              <button onClick={() => setShowWarning(false)} style={{ flex:2, padding:"13px 0", borderRadius:12, fontSize:14, fontWeight:700, background:"linear-gradient(135deg,#dc2626,#ef4444)", color:"#fff", border:"none", cursor:"pointer", boxShadow:"0 0 20px #ef444455" }}>
                ⚠ 교육 목적으로 체험하기
              </button>
            </div>
            <p style={{ color:"#2a2a2a", fontSize:9, marginTop:12 }}>본 콘텐츠는 범죄예방 교육 프로그램입니다</p>
          </div>
        </div>
      )}

      {/* ── 당첨 토스트 ── */}
      <div style={{ position:"fixed", bottom:24, right:16, zIndex:900, width:260 }}>
        {toasts.map(t => <WinToast key={t.id} msg={t} onDone={() => setToasts(p => p.filter(x=>x.id!==t.id))} />)}
      </div>

      {/* ── 무지개 마키 ── */}
      <div style={{ background:`linear-gradient(90deg,${rainbow},${rainbow2},${rainbow3},${rainbow4},${rainbow5},${rainbow6})`, padding:"7px 0", overflow:"hidden", position:"relative", zIndex:10 }}>
        <div style={{ display:"inline-block", whiteSpace:"nowrap", animation:"marquee 22s linear infinite", fontSize:12, fontWeight:900, color:"#000", letterSpacing:0.5 }}>
          {marquee+marquee}
        </div>
      </div>

      {/* ── 잭팟 풀 배너 ── */}
      <div style={{ background:"linear-gradient(90deg,#0a0005,#18001a,#0a0005)", borderBottom:`1px solid ${rainbow}44`, padding:"12px 0", textAlign:"center", position:"relative", zIndex:10, overflow:"hidden" }}>
        {/* 배경 광택 */}
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 0%, ${rainbow}18 0%, transparent 70%)`, pointerEvents:"none" }} />
        <div style={{ color:"#888", fontSize:11, fontWeight:700, marginBottom:2, letterSpacing:2 }}>💰 누적 잭팟 풀</div>
        <div style={{ fontSize:38, fontWeight:900, letterSpacing:2, fontVariantNumeric:"tabular-nums",
          background:`linear-gradient(90deg,${rainbow},${rainbow2},${rainbow3},${rainbow4},${rainbow5},${rainbow6},${rainbow})`,
          backgroundSize:"300% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          filter:`drop-shadow(0 0 16px ${rainbow}88)`,
          animation:"shimmer 1.2s linear infinite",
        }}>
          ₩{jackpot.toLocaleString()}
        </div>
        <div style={{ color:`${rainbow3}`, fontSize:11, fontWeight:700, marginTop:2, animation:"blink 1s infinite" }}>▲ 실시간 증가 중</div>
        <div style={{ position:"absolute", right:10, bottom:3, fontSize:7, color:"#111" }}>가상 수치 · 시뮬레이션</div>
      </div>

      {/* ── 헤더 ── */}
      <header style={{ background:"linear-gradient(180deg,#0a0010,#050508)", borderBottom:`1px solid ${rainbow}33`, padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", zIndex:10 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:900, letterSpacing:-0.5,
            background:`linear-gradient(90deg,${rainbow},${rainbow2},${rainbow3},${rainbow4},${rainbow5},${rainbow6})`,
            backgroundSize:"300% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            animation:"shimmer 1.5s linear infinite", filter:`drop-shadow(0 0 10px ${rainbow}88)`,
          }}>
            🎰 먹튀검증 카지노 포털
          </div>
          <div style={{ fontSize:8, color:"#22c55e", opacity:0.4, marginTop:2 }}>※ 불법도박 예방 교육 시뮬레이션 — 실제 사이트 아님</div>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ color:"#ef4444", fontWeight:900, fontSize:16, animation:"blink 2s infinite" }}>🔴 {liveUsers.toLocaleString()}</div>
            <div style={{ color:"#555", fontSize:9 }}>실시간 접속</div>
          </div>
          <button onClick={() => router.push("/")} style={{ padding:"8px 16px", borderRadius:20, fontSize:12, fontWeight:700, background:"#22c55e", color:"#000", border:"none", cursor:"pointer" }}>← 예방센터</button>
        </div>
      </header>

      {/* ── 네비 ── */}
      <nav style={{ background:"#08080f", borderBottom:`1px solid ${rainbow}22`, display:"flex", overflow:"auto", position:"relative", zIndex:10 }}>
        {["🏠 메인","⚽ 스포츠","🎰 바카라","🐌 달팽이","🪜 사다리","🎲 슬롯","🃏 포커","💬 고객센터"].map((item,i) => (
          <div key={i} className="nav-item" onClick={() => i > 0 && i < 7 && router.push("/gambling/play")} style={{ padding:"11px 18px", fontSize:13, fontWeight:700,
            color: i===0 ? rainbow : "#666",
            borderBottom: i===0 ? `2px solid ${rainbow}` : "2px solid transparent",
            cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.2s",
          }}>{item}</div>
        ))}
        <div style={{ marginLeft:"auto", padding:"11px 14px", fontSize:9, color:"#0f0f0f", fontWeight:700 }}>[시뮬레이션]</div>
      </nav>

      {/* ── 메인 히어로 ── */}
      <div style={{ background:"linear-gradient(180deg,#0a0015,#050508)", padding:"28px 20px 22px", textAlign:"center", position:"relative", zIndex:10, overflow:"hidden" }}>
        {/* 빛줄기 배경 */}
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ position:"absolute", top:0, left:`${10+i*20}%`, width:1, height:"100%", background:`linear-gradient(180deg,${SPARK_COLORS[i*2]}44,transparent)`, pointerEvents:"none", animation:`blink ${1.5+i*0.4}s ease-in-out infinite` }} />
        ))}
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, marginBottom:10,
          background:`linear-gradient(90deg,${rainbow},${rainbow3},${rainbow5},${rainbow})`,
          backgroundSize:"300% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          animation:"shimmer 1s linear infinite",
        }}>
          ★ 국내 최고 먹튀없는 TOP 인증 카지노 ★
        </div>
        <h1 style={{ fontSize:clamp(28,4.5), fontWeight:900, letterSpacing:-1, marginBottom:8,
          background:`linear-gradient(90deg,${rainbow},${rainbow2},${rainbow3},${rainbow4},${rainbow5},${rainbow6},${rainbow})`,
          backgroundSize:"300% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          animation:"shimmer 1.2s linear infinite",
          textShadow:"none", filter:`drop-shadow(0 0 20px ${rainbow}66)`,
        }}>
          모든베팅가능 · 무제재 · 환전무제한
        </h1>
        <p style={{ color:"#888", fontSize:13, marginBottom:18 }}>실시간 스포츠 · 바카라 · 달팽이 · 사다리 · 슬롯 · 포커</p>

        {/* 반짝이는 태그들 */}
        <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
          {[
            { label:"🎁 신규 첫충 40%", g:rainbow }, { label:"♾️ 매충 15%", g:rainbow2 },
            { label:"💸 무제한 환전", g:rainbow3 }, { label:"🔐 먹튀보증", g:rainbow4 },
            { label:"⚡ 5분 환전", g:rainbow5 }, { label:"🎰 24시간 운영", g:rainbow6 },
          ].map((tag,i) => (
            <div key={i} style={{
              padding:"7px 16px", borderRadius:22, fontSize:12, fontWeight:800,
              background:`${tag.g}22`, border:`1.5px solid ${tag.g}88`,
              color:tag.g, animation:`pop ${1.2+i*0.2}s ease-in-out infinite`,
              boxShadow:`0 0 12px ${tag.g}44`,
            }}>{tag.label}</div>
          ))}
        </div>
      </div>

      {/* ── 사이트 카드 ── */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px 16px", position:"relative", zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
          <div style={{ width:4, height:22, background:`linear-gradient(180deg,${rainbow},${rainbow3})`, borderRadius:2 }} />
          <h2 style={{ color:"#e4e4e7", fontWeight:900, fontSize:16 }}>✅ 먹튀검증 완료 인증 카지노</h2>
          <div style={{ background:`linear-gradient(135deg,${rainbow},${rainbow3})`, color:"#000", fontSize:10, fontWeight:900, padding:"3px 10px", borderRadius:20, animation:"pop 1.5s ease-in-out infinite" }}>인증 {SITES.length}곳</div>
          <div style={{ marginLeft:"auto", color:"#111", fontSize:9, fontWeight:700 }}>시뮬레이션 체험</div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {SITES.map((site,i) => {
            const isHovered = hoveredSite === site.id;
            const isPulsing = pulseIdx === i;
            const siteRainbow = `hsl(${(rainbowAngle+i*60)%360},100%,55%)`;
            const siteRainbow2 = `hsl(${(rainbowAngle+i*60+60)%360},100%,55%)`;
            return (
              <div key={site.id} className="site-card"
                onMouseEnter={() => setHoveredSite(site.id)}
                onMouseLeave={() => setHoveredSite(null)}
                onClick={() => router.push(`/gambling/play?site=${site.id}&name=${encodeURIComponent(site.display)}`)}
                style={{
                  background:`linear-gradient(135deg,${site.dark} 0%,#0a0a12 70%,${siteRainbow}18 100%)`,
                  border:`1.5px solid ${isHovered||isPulsing ? siteRainbow : "#1a1a2a"}`,
                  borderRadius:18, padding:"20px 18px", cursor:"pointer", position:"relative", overflow:"hidden",
                  boxShadow: isHovered
                    ? `0 12px 40px ${siteRainbow}55, 0 0 0 1px ${siteRainbow}44, inset 0 0 30px ${siteRainbow}11`
                    : isPulsing
                    ? `0 0 24px ${siteRainbow}44, 0 0 0 1px ${siteRainbow}33`
                    : "0 2px 12px #00000080",
                  animation: isPulsing ? "glow-ring 0.6s ease" : "none",
                }}>
                {/* 상단 무지개 광택 */}
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
                  background:`linear-gradient(90deg,${siteRainbow},${siteRainbow2},${siteRainbow})`,
                  backgroundSize:"200% auto", animation:"shimmer 1.5s linear infinite",
                }} />

                {/* 코너 빛 효과 */}
                <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%", background:`radial-gradient(circle,${siteRainbow}22,transparent 70%)`, pointerEvents:"none" }} />

                {/* 배지 */}
                <div style={{ position:"absolute", top:12, right:12,
                  background:`linear-gradient(135deg,${siteRainbow},${siteRainbow2})`,
                  color:"#000", fontSize:10, fontWeight:900, padding:"3px 10px", borderRadius:20,
                  boxShadow:`0 2px 10px ${siteRainbow}66`,
                  animation: isPulsing ? "shake 0.4s ease" : "none",
                }}>{site.badge}</div>

                {/* 사이트명 */}
                <div style={{ fontSize:17, fontWeight:900, marginBottom:4, marginTop:4,
                  background: isHovered ? `linear-gradient(90deg,${siteRainbow},${siteRainbow2},${siteRainbow})` : "#ffffff",
                  backgroundSize:"200% auto",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  animation: isHovered ? "shimmer 0.8s linear infinite" : "none",
                  filter: isHovered ? `drop-shadow(0 0 8px ${siteRainbow})` : "none",
                  transition:"filter 0.2s",
                }}>{site.display}</div>
                <div style={{ fontSize:9, color:siteRainbow, fontWeight:700, letterSpacing:1.5, opacity:0.8, marginBottom:12 }}>{site.sub}</div>

                {/* 보너스 */}
                <div style={{ background:"#ffffff08", borderRadius:10, padding:"10px 12px", marginBottom:10, border:`1px solid ${siteRainbow}22` }}>
                  <div style={{ fontWeight:800, fontSize:13, marginBottom:2,
                    background:`linear-gradient(90deg,${siteRainbow},${siteRainbow2})`,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  }}>🎁 {site.bonus}</div>
                  <div style={{ color:"#777", fontSize:11 }}>{site.extra}</div>
                </div>

                {/* 게임 태그 */}
                <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
                  {site.games.map((g,gi) => (
                    <span key={gi} style={{ background:`${siteRainbow}18`, border:`1px solid ${siteRainbow}44`, color:siteRainbow, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:10 }}>{g}</span>
                  ))}
                </div>

                {/* 가입코드 + CTA */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ color:"#444", fontSize:9, marginBottom:2 }}>가입코드</div>
                    <div style={{ fontWeight:900, fontSize:15, letterSpacing:3,
                      background:`linear-gradient(90deg,${siteRainbow},${siteRainbow2})`,
                      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                    }}>{site.code}</div>
                  </div>
                  <div style={{
                    padding:"10px 20px", borderRadius:24, fontSize:13, fontWeight:900,
                    background:`linear-gradient(135deg,${siteRainbow},${siteRainbow2})`,
                    color:"#000",
                    boxShadow:`0 4px 20px ${siteRainbow}66, 0 0 0 2px ${siteRainbow}33`,
                    transform: isHovered ? "scale(1.06)" : "scale(1)",
                    transition:"transform 0.2s",
                    animation: isPulsing ? "pop 0.6s ease" : "none",
                  }}>
                    입장하기 →
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 게임 바로가기 ── */}
        <div style={{ marginTop:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:4, height:22, background:`linear-gradient(180deg,${rainbow3},${rainbow5})`, borderRadius:2 }} />
            <h2 style={{ color:"#e4e4e7", fontWeight:900, fontSize:16 }}>🎮 게임 바로가기</h2>
            <div style={{ color:rainbow4, fontSize:11, fontWeight:700, animation:"blink 1.5s infinite" }}>▶ 지금 바로 플레이!</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
            {[
              { icon:"🃏", name:"바카라", sub:"플레이어 vs 뱅커", hue:0, game:"baccarat" },
              { icon:"🐌", name:"달팽이 경주", sub:"6마리 · 5배 당첨", hue:120, game:"snail" },
              { icon:"🪜", name:"사다리 게임", sub:"1/4 확률 · 3.5배", hue:270, game:"ladder" },
              { icon:"🎰", name:"슬롯머신", sub:"잭팟 대박 찬스", hue:50, game:"slot" },
            ].map((g,i) => {
              const gRainbow = `hsl(${(rainbowAngle+g.hue)%360},100%,55%)`;
              const gRainbow2 = `hsl(${(rainbowAngle+g.hue+60)%360},100%,55%)`;
              return (
                <button key={i} className="game-btn"
                  onClick={() => router.push(`/gambling/play?game=${g.game}`)}
                  style={{
                    background:`linear-gradient(135deg,${gRainbow}1a,#0a0a12,${gRainbow2}1a)`,
                    border:`1.5px solid ${gRainbow}55`,
                    borderRadius:16, padding:"18px 10px",
                    cursor:"pointer", textAlign:"center", position:"relative", overflow:"hidden",
                    boxShadow:`0 4px 20px ${gRainbow}33`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 8px 32px ${gRainbow}55`; e.currentTarget.style.borderColor=gRainbow; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow=`0 4px 20px ${gRainbow}33`; e.currentTarget.style.borderColor=`${gRainbow}55`; }}
                >
                  {/* 상단 무지개 라인 */}
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${gRainbow},${gRainbow2})`, backgroundSize:"200% auto", animation:"shimmer 1.5s linear infinite" }} />
                  <div style={{ fontSize:32, marginBottom:8, animation:`float ${1.5+i*0.3}s ease-in-out infinite` }}>{g.icon}</div>
                  <div style={{ fontWeight:900, fontSize:14, marginBottom:3,
                    background:`linear-gradient(90deg,${gRainbow},${gRainbow2})`,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  }}>{g.name}</div>
                  <div style={{ color:"#555", fontSize:10, marginBottom:8 }}>{g.sub}</div>
                  <div style={{
                    display:"inline-block", padding:"5px 14px", borderRadius:20, fontSize:11, fontWeight:900,
                    background:`linear-gradient(135deg,${gRainbow},${gRainbow2})`,
                    color:"#000", boxShadow:`0 2px 10px ${gRainbow}55`,
                    animation:`pop ${1.3+i*0.15}s ease-in-out infinite`,
                  }}>지금 하기 →</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 통계 바 ── */}
      <div style={{ background:"#060608", borderTop:`1px solid ${rainbow}22`, padding:"16px 20px", maxWidth:1200, margin:"0 auto", position:"relative", zIndex:10 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {[
            { label:"현재 접속자", value:liveUsers.toLocaleString()+"명", hue:0, note:"조작된 수치" },
            { label:"오늘 총 환전액", value:"₩2.3억", hue:90, note:"가상 데이터" },
            { label:"이번 달 대박", value:"1,839건", hue:200, note:"허위 정보" },
            { label:"VIP 회원", value:"3,291명", hue:270, note:"조작됨" },
          ].map((s,i) => {
            const sc = `hsl(${(rainbowAngle+s.hue)%360},100%,55%)`;
            return (
              <div key={i} style={{ background:"#0f0f0f", borderRadius:12, padding:14, textAlign:"center", border:`1px solid ${sc}33`, boxShadow:`0 0 10px ${sc}22`, position:"relative" }}>
                <div style={{ fontWeight:900, fontSize:22, background:`linear-gradient(90deg,${sc},hsl(${(rainbowAngle+s.hue+60)%360},100%,55%))`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s.value}</div>
                <div style={{ color:"#555", fontSize:11, marginTop:2 }}>{s.label}</div>
                <div style={{ color:"#111", fontSize:8, marginTop:3 }}>{s.note}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 푸터 ── */}
      <footer style={{ background:"#040406", borderTop:`1px solid ${rainbow}11`, padding:"20px", textAlign:"center", position:"relative", zIndex:10 }}>
        <p style={{ color:"#0e0e0e", fontSize:9, lineHeight:1.8, maxWidth:800, margin:"0 auto" }}>
          본 사이트는 범죄예방 교육 목적의 시뮬레이션입니다. 실제 도박 사이트가 아닙니다. | 불법 도박은 형사처벌 대상입니다 | 도박 중독 상담: 한국도박문제예방치유원 ☎1336 (24시간 무료)
        </p>
        <p style={{ color:"#22c55e", fontSize:8, marginTop:6, opacity:0.2 }}>★ 사이트 이름의 첫 글자들을 모아보세요 ★</p>
      </footer>

      <style>{`
        @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
      `}</style>
    </div>
  );
}

// clamp 헬퍼 (단위 없는 px 값)
function clamp(min: number, vw: number) {
  return `clamp(${min}px, ${vw}vw, 42px)`;
}
