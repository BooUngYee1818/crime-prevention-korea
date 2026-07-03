"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Phase = "intro" | "normal" | "hacked" | "negotiation" | "reveal";

const DEVICES = [
  { id: "door", icon: "🔒", label: "현관문", status: "정상", lockedMsg: "잠금 해제 불가 — 원격 제어 중" },
  { id: "cam", icon: "📷", label: "보안카메라", status: "정상", lockedMsg: "피드 차단 — 해커가 시청 중" },
  { id: "ac", icon: "❄️", label: "에어컨", status: "정상", lockedMsg: "오작동 중 — 40°C 강제 가동" },
  { id: "gas", icon: "🔥", label: "가스밸브", status: "정상", lockedMsg: "원격 제어 감지 — 즉시 차단 필요" },
  { id: "light", icon: "💡", label: "조명 전체", status: "정상", lockedMsg: "꺼짐 불가 — 원격 점멸 중" },
  { id: "car", icon: "🚗", label: "스마트카 잠금", status: "정상", lockedMsg: "차량 원격 잠금 — 시동 불가" },
];

const RANSOM_NOTE = `⚠️ 당신의 스마트홈이 해킹되었습니다

집의 모든 IoT 기기가 저희 서버에 연결되었습니다.
현관문·카메라·가스밸브·차량까지 원격 제어 중입니다.

48시간 내 ₩3,000,000(또는 0.08 BTC)을 송금하지 않으면:
— 보안카메라 영상을 가족에게 전송
— 가스밸브를 원격으로 개방
— 집주인 정보를 다크웹에 판매

송금 주소: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
문의 텔레그램: @smarthack_kr_2027

⏱ 남은 시간: 47:52:18`;

export default function SmarthomeRansomwarePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [countdown, setCountdown] = useState(47 * 3600 + 52 * 60 + 18);
  const [deviceIdx, setDeviceIdx] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [choice, setChoice] = useState<"pay" | "report" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase === "hacked") {
      timerRef.current = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current!); };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "normal") {
      const t = setTimeout(() => {
        setGlitch(true);
        setTimeout(() => { setGlitch(false); setPhase("hacked"); }, 1800);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  function fmt(s: number) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
  }

  if (phase === "reveal") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#020c02,#001a0a)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:540, width:"100%" }}>
        <div style={{ background:"linear-gradient(135deg,#052e16,#064e3b)", border:"2px solid #22c55e", borderRadius:24, padding:"32px 28px", marginBottom:20 }}>
          <div style={{ fontSize:56, textAlign:"center", marginBottom:16 }}>🏠</div>
          <h2 style={{ color:"#22c55e", fontSize:22, fontWeight:900, textAlign:"center", marginBottom:8 }}>스마트홈 랜섬웨어 해설</h2>
          <p style={{ color:"#6b7280", fontSize:12, textAlign:"center", marginBottom:20 }}>⚠️ 아직 국내 대규모 피해 사례는 없으나, 2027년 이후 현실화 가능성이 매우 높은 미래형 범죄입니다</p>
          <div style={{ background:"#041a0e", borderRadius:14, padding:"16px 20px", marginBottom:20 }}>
            {[
              { icon:"📡", t:"공격 경로", d:"취약한 공유기 → IoT 기기 순차 감염. 기본 비밀번호를 바꾸지 않은 기기가 주요 타깃입니다." },
              { icon:"💸", t:"랜섬웨어 협박 방식", d:"가스밸브·현관문 등 위험 장치를 제어한다고 협박해 피해자를 공황 상태로 만듭니다." },
              { icon:"🔑", t:"예방법 1 — 기본 비밀번호 변경", d:"IoT 기기 설치 즉시 제조사 기본 비밀번호를 복잡한 비밀번호로 변경하세요." },
              { icon:"🌐", t:"예방법 2 — IoT 전용 공유기 분리", d:"스마트홈 기기는 PC·스마트폰과 다른 네트워크(게스트 Wi-Fi)에 연결하세요." },
              { icon:"🛡️", t:"예방법 3 — 물리 차단 장치 유지", d:"가스는 물리 밸브, 현관은 기계식 잠금장치를 함께 사용하세요. 디지털만 믿지 마세요." },
            ].map((it,i) => (
              <div key={i} style={{ display:"flex", gap:12, marginBottom:i<4?12:0 }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{it.icon}</span>
                <div>
                  <p style={{ color:"#4ade80", fontSize:12, fontWeight:700, marginBottom:2 }}>{it.t}</p>
                  <p style={{ color:"#6b7280", fontSize:12, lineHeight:1.6, margin:0 }}>{it.d}</p>
                </div>
              </div>
            ))}
          </div>
          {choice === "pay" && <div style={{ background:"#1a0808", border:"1px solid #ef444444", borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
            <p style={{ color:"#fca5a5", fontSize:13, margin:0 }}>💸 실제로 돈을 보냈다면: 해커는 돈을 받고 잠적하거나 추가 요구를 합니다. <strong style={{ color:"#ef4444" }}>절대 송금하지 마세요.</strong></p>
          </div>}
          <a href="tel:118" style={{ display:"block", background:"#22c55e", color:"#fff", fontWeight:900, fontSize:16, borderRadius:14, padding:"14px 0", textDecoration:"none", textAlign:"center", marginBottom:10 }}>🛡️ 사이버범죄 신고 118 (KISA)</a>
          <button onClick={() => router.push("/")} style={{ width:"100%", background:"none", border:"1px solid #1e3028", borderRadius:14, padding:"12px 0", color:"#4a6a55", fontSize:13, cursor:"pointer" }}>← 메인으로</button>
        </div>
      </div>
    </div>
  );

  if (phase === "negotiation") return (
    <div style={{ minHeight:"100vh", background:"#000", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:460, width:"100%" }}>
        <div style={{ background:"#0a0a0a", border:"2px solid #ef4444", borderRadius:20, padding:"28px 24px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <p style={{ color:"#ef4444", fontSize:12, fontWeight:800, letterSpacing:2 }}>RANSOMWARE CONTROL</p>
            <span style={{ color:"#f87171", fontWeight:900, fontFamily:"monospace", fontSize:18 }}>{fmt(countdown)}</span>
          </div>
          <p style={{ color:"#6b7280", fontSize:13, lineHeight:1.8, marginBottom:20 }}>어떻게 하시겠습니까?</p>
          <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
            <button onClick={() => { setChoice("pay"); setPhase("reveal"); }} style={{ background:"#1a0000", border:"2px solid #ef4444", borderRadius:14, padding:"16px", color:"#f87171", fontWeight:700, fontSize:14, cursor:"pointer", textAlign:"left" as const }}>
              💸 ₩3,000,000 송금하기<br/>
              <span style={{ color:"#555", fontSize:12, fontWeight:400 }}>빨리 끝내고 싶다. 돈을 보내겠다</span>
            </button>
            <button onClick={() => { setChoice("report"); setPhase("reveal"); }} style={{ background:"#052e16", border:"2px solid #22c55e", borderRadius:14, padding:"16px", color:"#22c55e", fontWeight:700, fontSize:14, cursor:"pointer", textAlign:"left" as const }}>
              📵 절대 안 낸다 — 118 신고하기<br/>
              <span style={{ color:"#555", fontSize:12, fontWeight:400 }}>사기임을 직감. 즉시 신고한다</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (phase === "hacked") return (
    <div style={{ minHeight:"100vh", background:"#000", position:"relative", overflow:"hidden" }}>
      <style>{`
        @keyframes scan { 0%{top:-4px} 100%{top:100vh} }
        @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:0.85} 92%{opacity:0.6} 94%{opacity:1} }
        @keyframes blink-red { 0%,100%{background:#ef444411} 50%{background:#ef444433} }
      `}</style>
      {/* CRT 스캔라인 */}
      <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)", pointerEvents:"none", zIndex:50, animation:"flicker 0.15s infinite" }} />
      <div style={{ position:"fixed", left:0, right:0, height:3, background:"rgba(255,0,0,0.35)", zIndex:51, animation:"scan 3s linear infinite" }} />

      <div style={{ maxWidth:500, margin:"0 auto", padding:"40px 20px", position:"relative", zIndex:10 }}>
        {/* 경고 헤더 */}
        <div style={{ background:"#ef444422", border:"2px solid #ef4444", borderRadius:12, padding:"14px 18px", marginBottom:20, animation:"blink-red 1s ease-in-out infinite" }}>
          <p style={{ color:"#ef4444", fontWeight:900, fontSize:16, margin:0, textAlign:"center" }}>🚨 YOUR HOME HAS BEEN HACKED 🚨</p>
        </div>

        {/* 카운트다운 */}
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <p style={{ color:"#6b7280", fontSize:11, marginBottom:4 }}>남은 시간</p>
          <p style={{ color:"#ef4444", fontWeight:900, fontSize:42, fontFamily:"monospace", letterSpacing:4 }}>{fmt(countdown)}</p>
        </div>

        {/* 기기 상태 */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
          {DEVICES.map((d) => (
            <div key={d.id} style={{ background:"#0a0a0a", border:"1px solid #ef444444", borderRadius:12, padding:"12px 14px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <span style={{ fontSize:18 }}>{d.icon}</span>
                <span style={{ color:"#9ca3af", fontSize:11, fontWeight:700 }}>{d.label}</span>
              </div>
              <p style={{ color:"#ef4444", fontSize:10, margin:0, lineHeight:1.5 }}>⚠️ {d.lockedMsg}</p>
            </div>
          ))}
        </div>

        {/* 랜섬 노트 */}
        <div style={{ background:"#0a0000", border:"1px solid #ef444466", borderRadius:14, padding:"18px 20px", marginBottom:20, fontFamily:"monospace" }}>
          <pre style={{ color:"#fca5a5", fontSize:12, lineHeight:1.8, whiteSpace:"pre-wrap", margin:0 }}>{RANSOM_NOTE}</pre>
        </div>

        <button onClick={() => setPhase("negotiation")} style={{ width:"100%", background:"linear-gradient(135deg,#7c3aed,#4c1d95)", border:"none", borderRadius:14, padding:"16px 0", color:"#fff", fontWeight:900, fontSize:15, cursor:"pointer" }}>
          → 어떻게 할지 선택하기
        </button>
        <div style={{ marginTop:10, textAlign:"center" }}>
          <span style={{ color:"#374151", fontSize:10 }}>⚠️ 교육용 시뮬레이션 — 실제 해킹이 아닙니다</span>
        </div>
      </div>
    </div>
  );

  if (phase === "normal") return (
    <div style={{ minHeight:"100vh", background: glitch ? "#ff0000" : "linear-gradient(160deg,#0f172a,#1e293b)", display:"flex", flexDirection:"column" as const, alignItems:"center", justifyContent:"center", padding:24, transition:"background 0.1s" }}>
      <style>{`@keyframes glitch-shake{0%,100%{transform:translate(0)}25%{transform:translate(-8px,4px)}50%{transform:translate(8px,-4px)}75%{transform:translate(-4px,8px)}}`}</style>
      <div style={{ animation: glitch ? "glitch-shake 0.1s infinite" : "none", textAlign:"center", maxWidth:400, width:"100%" }}>
        <p style={{ color: glitch ? "#000" : "#22c55e", fontSize:14, marginBottom:24, fontWeight:700 }}>
          {glitch ? "⚠️ 연결 오류 감지 중..." : "✅ 스마트홈 연결 정상"}
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
          {DEVICES.map((d) => (
            <div key={d.id} style={{ background: glitch ? "#cc000088" : "#1e293b", border:`1px solid ${glitch?"#ff000088":"#334155"}`, borderRadius:12, padding:"14px 12px", textAlign:"center" as const }}>
              <div style={{ fontSize:28, marginBottom:4 }}>{d.icon}</div>
              <p style={{ color: glitch ? "#fff" : "#64748b", fontSize:11, margin:0 }}>{d.label}</p>
              <p style={{ color: glitch ? "#ff4444" : "#22c55e", fontSize:10, marginTop:3 }}>{glitch ? "⚠️ 오류" : "● 정상"}</p>
            </div>
          ))}
        </div>
        {!glitch && <p style={{ color:"#334155", fontSize:12 }}>잠시 후 해킹 시뮬레이션이 시작됩니다...</p>}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0f172a,#0a1628)", padding:"40px 20px" }}>
      <div style={{ maxWidth:560, margin:"0 auto" }}>
        <button onClick={() => router.push("/")} style={{ background:"none", border:"none", color:"#555", fontSize:13, cursor:"pointer", marginBottom:24 }}>← 메인으로</button>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-block", background:"#7c3aed22", border:"1px solid #7c3aed55", borderRadius:20, padding:"4px 12px", marginBottom:12 }}>
            <span style={{ color:"#a78bfa", fontSize:11, fontWeight:800, letterSpacing:2 }}>🔮 FUTURE CRIME · 2027년 예상</span>
          </div>
          <h1 style={{ color:"#fff", fontSize:26, fontWeight:900, marginBottom:10 }}>🏠 스마트홈 랜섬웨어</h1>
          <p style={{ color:"#64748b", fontSize:14, lineHeight:1.7 }}>집 전체를 인질로 잡는 미래형 사이버 범죄.<br/>현관문·가스·카메라까지 해커가 원격 제어합니다.</p>
        </div>
        <div style={{ background:"#111827", border:"1px solid #1f2937", borderRadius:20, padding:"24px", marginBottom:20 }}>
          <p style={{ color:"#a78bfa", fontSize:11, fontWeight:800, letterSpacing:2, marginBottom:16 }}>🔮 미래 범죄 위험도 분석</p>
          {[
            { label:"현실화 가능성", value:92, color:"#ef4444" },
            { label:"예상 피해 규모", value:78, color:"#f59e0b" },
            { label:"현재 기술 존재 여부", value:85, color:"#a78bfa" },
          ].map((b) => (
            <div key={b.label} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ color:"#94a3b8", fontSize:12 }}>{b.label}</span>
                <span style={{ color:b.color, fontWeight:700, fontSize:12 }}>{b.value}%</span>
              </div>
              <div style={{ height:6, background:"#1f2937", borderRadius:10 }}>
                <div style={{ height:"100%", background:b.color, borderRadius:10, width:`${b.value}%`, transition:"width 1s ease" }} />
              </div>
            </div>
          ))}
          <p style={{ color:"#475569", fontSize:12, lineHeight:1.7, marginTop:16, margin:0 }}>
            이미 미국·유럽에서는 산업시설 IoT 랜섬웨어 피해가 발생했습니다.<br/>국내 스마트홈 보급률 68% → 2027년 가정용 타깃 본격화 예상.
          </p>
        </div>
        <button onClick={() => setPhase("normal")} style={{ width:"100%", background:"linear-gradient(135deg,#1d4ed8,#7c3aed)", border:"none", borderRadius:18, padding:"18px 0", color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer", boxShadow:"0 4px 24px #7c3aed44" }}>
          🏠 스마트홈 해킹 체험 시작
        </button>
      </div>
    </div>
  );
}
