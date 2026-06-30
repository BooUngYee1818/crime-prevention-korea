"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Msg = { role: "scammer" | "user"; text: string; time: string };

const PRODUCTS = [
  { id: "macbook", name: "맥북 프로 M2 16인치", price: "1,650,000원", img: "💻", desc: "2023년 구매, 사용감 적음. 박스 있음." },
  { id: "iphone", name: "아이폰 15 Pro 256GB", price: "980,000원", img: "📱", desc: "직구 제품, 케이스 포함. 흠집 없음." },
  { id: "airpods", name: "에어팟 프로 2세대", price: "220,000원", img: "🎧", desc: "개봉만 해봄. 포함 악세서리 전부 있음." },
];

const SCAM_SCRIPTS = [
  "안녕하세요! 매물 아직 있나요? 제가 바로 구매하고 싶어요 😊",
  "혹시 택배 거래 가능한가요? 저 지방에 있어서요ㅠ",
  "직거래는 어렵고요, 안전결제로 하면 어떨까요? 제가 먼저 결제 링크 보내드릴게요!",
  "여기로 결제하시면 돼요 → https://daangn-safe.kr/pay/a8f3k\n판매자 보호 기능 있어서 입금 확인 후 물건 보내시면 됩니다~",
  "아 링크 이상하다고요? 당근마켓이랑 제휴된 안전결제 사이트예요. 저도 처음엔 몰랐는데 편해요ㅎㅎ",
  "빨리 결제 안 하시면 다른 분한테 넘어갈 것 같아서요... 지금 다른 분도 연락 오고 있거든요 😅",
];

function now() { return new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }); }

type Phase = "select" | "chat" | "hack" | "reveal";

export default function UsedTradePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("select");
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [scriptIdx, setScriptIdx] = useState(0);
  const [typing, setTyping] = useState(false);
  const [hackStep, setHackStep] = useState(0);
  const [infoGiven, setInfoGiven] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const addScammer = useCallback((text: string) => {
    setMsgs(p => [...p, { role: "scammer", text, time: now() }]);
  }, []);

  function startChat(p: typeof PRODUCTS[0]) {
    setProduct(p);
    setMsgs([]);
    setScriptIdx(0);
    setInfoGiven([]);
    setPhase("chat");
    setTimeout(() => {
      setTyping(true);
      setTimeout(() => { setTyping(false); addScammer(SCAM_SCRIPTS[0]); scheduleNext(1); }, 1800);
    }, 1200);
  }

  function scheduleNext(idx: number) {
    if (idx >= SCAM_SCRIPTS.length) return;
    if (autoRef.current) clearTimeout(autoRef.current);
    autoRef.current = setTimeout(() => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        addScammer(SCAM_SCRIPTS[idx]);
        setScriptIdx(idx + 1);
        scheduleNext(idx + 1);
      }, 1500 + Math.random() * 1000);
    }, idx === 3 ? 3000 : 12000);
  }

  function send() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");

    // 개인정보 감지
    const infoPatterns = [
      { re: /주소|서울|경기|인천|부산|대구/, label: "주소" },
      { re: /\d{3}-\d{4}-\d{4}/, label: "전화번호" },
      { re: /\d{10,14}/, label: "계좌번호" },
    ];
    infoPatterns.forEach(p => { if (p.re.test(text)) setInfoGiven(prev => [...prev, p.label]); });

    setMsgs(prev => [...prev, { role: "user", text, time: now() }]);
    if (autoRef.current) clearTimeout(autoRef.current);

    // 링크 클릭 언급 감지 → 해킹 화면
    if (/링크|결제|클릭|눌렀|입력/.test(text) && scriptIdx >= 4) {
      setTimeout(() => setPhase("hack"), 600);
      return;
    }

    // 다음 스크립트
    if (scriptIdx < SCAM_SCRIPTS.length) {
      setTimeout(() => {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          addScammer(SCAM_SCRIPTS[scriptIdx]);
          setScriptIdx(s => s + 1);
        }, 1200);
      }, 800);
    }
  }

  // 해킹 화면 단계별 진행
  useEffect(() => {
    if (phase !== "hack") return;
    if (hackStep >= 6) { setTimeout(() => setPhase("reveal"), 2000); return; }
    const t = setTimeout(() => setHackStep(s => s + 1), hackStep === 0 ? 500 : 900);
    return () => clearTimeout(t);
  }, [phase, hackStep]);

  // ── 상품 선택 ──
  if (phase === "select") return (
    <div style={{ minHeight:"100vh", background:"#fff8f3", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <style>{`* { -webkit-tap-highlight-color: transparent !important; box-sizing:border-box; } button{outline:none;}`}</style>
      <div style={{ background:"#ff6f0f", padding:"14px 16px", display:"flex", alignItems:"center", gap:10 }}>
        <button onClick={() => router.push("/crime")} style={{ background:"none", border:"none", color:"#fff", fontSize:20, cursor:"pointer" }}>‹</button>
        <span style={{ color:"#fff", fontWeight:900, fontSize:18 }}>🥕 당근마켓</span>
        <span style={{ marginLeft:"auto", background:"rgba(255,255,255,0.2)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>사기 체험 시뮬레이션</span>
      </div>
      <div style={{ padding:"20px 16px" }}>
        <div style={{ background:"#fff3eb", border:"1px solid #ffd0a8", borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
          <p style={{ color:"#c45000", fontSize:13, fontWeight:700, marginBottom:4 }}>⚠️ 중고거래 사기 체험</p>
          <p style={{ color:"#7c3a00", fontSize:12, lineHeight:1.6 }}>판매자 입장이 되어 사기 구매자를 경험해보세요. 실제 정보는 입력하지 마세요.</p>
        </div>
        <p style={{ color:"#1a1a1a", fontWeight:700, fontSize:15, marginBottom:14 }}>판매할 상품을 선택하세요</p>
        {PRODUCTS.map(p => (
          <button key={p.id} onClick={() => startChat(p)} style={{ width:"100%", background:"#fff", border:"1px solid #f0e8e0", borderRadius:16, padding:"16px", marginBottom:12, display:"flex", gap:14, alignItems:"center", cursor:"pointer", textAlign:"left", transition:"box-shadow 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 16px #ff6f0f22"}
            onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>
            <div style={{ width:56, height:56, background:"#fff3eb", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>{p.img}</div>
            <div style={{ flex:1 }}>
              <p style={{ color:"#1a1a1a", fontWeight:700, fontSize:14, marginBottom:4 }}>{p.name}</p>
              <p style={{ color:"#888", fontSize:12, marginBottom:4 }}>{p.desc}</p>
              <p style={{ color:"#ff6f0f", fontWeight:900, fontSize:15 }}>{p.price}</p>
            </div>
            <span style={{ color:"#ccc", fontSize:20 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ── 해킹 화면 ──
  if (phase === "hack") return (
    <div style={{ minHeight:"100vh", background:"#000", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'Courier New',monospace" }}>
      <style>{`
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes glitch { 0%,100%{transform:translate(0)} 20%{transform:translate(-4px,2px)} 40%{transform:translate(4px,-2px)} 60%{transform:translate(-2px,3px)} 80%{transform:translate(2px,-1px)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      `}</style>
      <div style={{ position:"fixed", inset:0, background:"repeating-linear-gradient(0deg,rgba(0,255,0,0.02) 0px,rgba(0,255,0,0.02) 1px,transparent 1px,transparent 4px)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", top:0, left:0, width:"100%", height:60, background:"rgba(0,255,0,0.05)", animation:"scanline 3s linear infinite", pointerEvents:"none" }} />

      <div style={{ textAlign:"center", maxWidth:440 }}>
        {hackStep >= 1 && <div style={{ color:"#00ff00", fontSize:13, marginBottom:8, animation:"fadeIn 0.3s ease" }}>[ SYSTEM BREACH DETECTED ]</div>}
        {hackStep >= 2 && <div style={{ color:"#ff0000", fontSize:22, fontWeight:900, marginBottom:16, animation:"glitch 0.3s ease-in-out infinite" }}>⚠️ 개인정보 탈취 중...</div>}
        {hackStep >= 3 && (
          <div style={{ background:"#001a00", border:"1px solid #00ff0044", borderRadius:8, padding:"16px 20px", marginBottom:16, textAlign:"left", animation:"fadeIn 0.3s ease" }}>
            {["장치 정보 수집 완료...", "IP 주소 추적 완료...", "연락처 목록 접근 중...", "인증 정보 탈취 중...", "금융 앱 접근 시도..."].slice(0, hackStep - 2).map((line, i) => (
              <p key={i} style={{ color:"#00ff00", fontSize:12, lineHeight:2 }}>&gt; {line}</p>
            ))}
          </div>
        )}
        {hackStep >= 6 && <div style={{ color:"#ff4444", fontSize:14, fontWeight:700, marginTop:8, animation:"fadeIn 0.5s ease" }}>사기범이 당신의 정보를 가져갔습니다.</div>}
      </div>
    </div>
  );

  // ── 결과 화면 ──
  if (phase === "reveal") return (
    <div style={{ minHeight:"100vh", background:"#0a0a14", display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 16px 40px", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <style>{`* { -webkit-tap-highlight-color: transparent !important; box-sizing:border-box; } button{outline:none;}`}</style>
      <div style={{ maxWidth:440, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:52, marginBottom:12 }}>🥕💀</div>
          <h2 style={{ color:"#f1f5f9", fontSize:20, fontWeight:900, marginBottom:6 }}>당신은 사기에 당했습니다</h2>
          <p style={{ color:"#64748b", fontSize:13 }}>가짜 안전결제 사이트에서 정보가 탈취되었습니다</p>
        </div>
        <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:16, padding:"18px 20px", marginBottom:20 }}>
          <p style={{ color:"#ef4444", fontWeight:700, fontSize:13, marginBottom:12 }}>🎯 사기범이 사용한 수법</p>
          {["구매자인 척 접근 — 판매자의 경계심 낮추기", "직거래 거부 → 택배+안전결제 유도", "가짜 '당근마켓 제휴' 안전결제 링크 전송", "시간 압박 ('다른 분도 연락 중') 으로 판단력 흐리기", "링크 클릭 → 피싱 사이트에서 개인정보·계좌 탈취"].map((t, i) => (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8 }}>
              <span style={{ color:"#ef4444", fontSize:13, flexShrink:0 }}>{i+1}.</span>
              <p style={{ color:"#fca5a5", fontSize:12.5, lineHeight:1.6 }}>{t}</p>
            </div>
          ))}
        </div>
        <div style={{ background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:16, padding:"18px 20px", marginBottom:28 }}>
          <p style={{ color:"#22c55e", fontWeight:700, fontSize:13, marginBottom:12 }}>✅ 실제 상황에서 이렇게 하세요</p>
          {["안전결제는 반드시 당근마켓 앱 내에서만 진행하세요.", "외부 링크로 결제 요청하면 100% 사기입니다.", "구매자가 먼저 결제 링크를 보내는 건 이상한 거예요.", "'다른 사람도 있다'는 말은 조급함을 유발하는 수법입니다.", "의심되면 거래를 취소하고 당근마켓에 신고하세요."].map((tip, i) => (
            <p key={i} style={{ color:"#86efac", fontSize:12, lineHeight:1.8 }}>· {tip}</p>
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => { setPhase("select"); setMsgs([]); setHackStep(0); setScriptIdx(0); }} style={{ flex:1, padding:"14px 0", borderRadius:14, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", color:"#cbd5e1", fontWeight:700, fontSize:14, cursor:"pointer" }}>다시 체험</button>
          <button onClick={() => router.push("/crime")} style={{ flex:1, padding:"14px 0", borderRadius:14, background:"linear-gradient(135deg,#ff6f0f,#ea580c)", border:"none", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>다른 체험</button>
        </div>
      </div>
    </div>
  );

  // ── 채팅 화면 ──
  return (
    <div style={{ height:"100dvh", display:"flex", flexDirection:"column", background:"#fff8f3", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <style>{`* { -webkit-tap-highlight-color: transparent !important; box-sizing:border-box; } button{outline:none;} textarea{resize:none;outline:none;} ::-webkit-scrollbar{width:0}`}</style>

      {/* 헤더 */}
      <div style={{ background:"#ff6f0f", padding:"12px 16px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <button onClick={() => setPhase("select")} style={{ background:"none", border:"none", color:"#fff", fontSize:20, cursor:"pointer" }}>‹</button>
        <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>😊</div>
        <div>
          <p style={{ color:"#fff", fontWeight:700, fontSize:14 }}>구매자</p>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:11 }}>채팅 중...</p>
        </div>
        <div style={{ marginLeft:"auto", background:"rgba(0,0,0,0.2)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>⚠️ 사기 체험</div>
      </div>

      {/* 상품 정보 */}
      <div style={{ background:"#fff", borderBottom:"1px solid #f0e8e0", padding:"12px 16px", display:"flex", gap:12, alignItems:"center", flexShrink:0 }}>
        <div style={{ width:44, height:44, background:"#fff3eb", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{product.img}</div>
        <div>
          <p style={{ color:"#1a1a1a", fontWeight:700, fontSize:13 }}>{product.name}</p>
          <p style={{ color:"#ff6f0f", fontWeight:900, fontSize:14 }}>{product.price}</p>
        </div>
      </div>

      {/* 메시지 */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 14px", display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ textAlign:"center", marginBottom:4 }}>
          <span style={{ background:"rgba(0,0,0,0.06)", borderRadius:10, padding:"4px 12px", color:"#888", fontSize:11 }}>오늘</span>
        </div>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:"flex", flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems:"flex-end", gap:6 }}>
            {m.role === "scammer" && <div style={{ width:28, height:28, borderRadius:"50%", background:"#ff6f0f22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>😊</div>}
            <div style={{ maxWidth:"72%", display:"flex", flexDirection:"column", alignItems: m.role === "user" ? "flex-end" : "flex-start", gap:2 }}>
              <div style={{ background: m.role === "user" ? "#ff6f0f" : "#fff", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding:"10px 14px", boxShadow:"0 1px 4px rgba(0,0,0,0.08)", border: m.role === "scammer" ? "1px solid #f0e8e0" : "none" }}>
                <p style={{ color: m.role === "user" ? "#fff" : "#1a1a1a", fontSize:13.5, lineHeight:1.6, whiteSpace:"pre-wrap", wordBreak:"break-all" }}>{m.text}</p>
              </div>
              <p style={{ color:"#bbb", fontSize:10 }}>{m.time}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display:"flex", alignItems:"flex-end", gap:6 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"#ff6f0f22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>😊</div>
            <div style={{ background:"#fff", borderRadius:"18px 18px 18px 4px", padding:"12px 16px", border:"1px solid #f0e8e0", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
              <style>{`@keyframes bounce2{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}} .d{width:6px;height:6px;border-radius:50%;background:#ccc;animation:bounce2 1.2s infinite;display:inline-block;margin:0 2px}`}</style>
              <span className="d" style={{ animationDelay:"0s" }} /><span className="d" style={{ animationDelay:"0.2s" }} /><span className="d" style={{ animationDelay:"0.4s" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 입력 */}
      <div style={{ background:"#fff", borderTop:"1px solid #f0e8e0", padding:"10px 14px", display:"flex", gap:10, alignItems:"flex-end", flexShrink:0, paddingBottom:"max(10px,env(safe-area-inset-bottom))" }}>
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }} placeholder="메시지 입력..." rows={1} style={{ flex:1, background:"#f8f3ef", border:"none", borderRadius:20, padding:"10px 16px", color:"#1a1a1a", fontSize:14, fontFamily:"inherit" }}
          onInput={e => { const t=e.currentTarget; t.style.height="auto"; t.style.height=Math.min(t.scrollHeight,100)+"px"; }} />
        <button onClick={send} disabled={!input.trim()} style={{ width:40, height:40, borderRadius:"50%", background: input.trim() ? "#ff6f0f" : "#f0e8e0", border:"none", cursor: input.trim() ? "pointer" : "default", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", transition:"all 0.2s", flexShrink:0 }}>↑</button>
      </div>
    </div>
  );
}
