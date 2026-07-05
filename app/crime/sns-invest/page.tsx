"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Msg = { role: "scammer" | "user"; text: string; time: string; img?: string };

const SCAMMER = {
  name: "James Kim 🇺🇸",
  handle: "@james_wealth_kr",
  bio: "💰 해외주식·코인 전문 | 월 수익 인증 | 무료 멘토링 운영 중",
  followers: "12.4만",
  avatar: "👨‍💼",
  posts: [
    { img: "📈", caption: "이번 달도 +340% 달성 🔥 꾸준히 하면 됩니다", likes: "2,847" },
    { img: "🏖️", caption: "코인 수익으로 발리 한 달 살기 ✈️", likes: "1,293" },
    { img: "💻", caption: "오늘 멘토링 수강생 신청 마감 임박! 링크 바이오에", likes: "983" },
  ],
};

const SCRIPTS: string[] = [
  "안녕하세요! 제 게시물 보고 팔로우 해주셨군요 😊 감사해요~",
  "혹시 재테크에 관심 있으세요? 저 요즘 코인으로 꽤 수익 내고 있거든요",
  "제 멘토한테 배운 건데, 처음엔 저도 반신반의했어요. 근데 첫 달에 80만원 벌고 나서 진짜 믿게 됐어요 ㅎㅎ",
  "소액으로 테스트해볼 수 있어요. 30만원만 넣으면 2주 안에 수익 나는 거 보여드릴게요. 출금도 바로 돼요!",
  "입금 계좌 알려드릴게요 👇\n둘은행 123-456789-01234\n예금주: 제이케이트레이딩\n\n입금하시면 제가 직접 운용해드릴게요!",
  "지금 3명 동시에 신청 들어와서요... 오늘 안에 결정 안 하시면 다음 달로 넘어가요 😅 자리가 한정돼 있거든요",
  "출금이요? 물론 가능해요! 근데 수수료 15%는 먼저 내셔야 출금 처리가 돼요. 그게 플랫폼 규정이에요.",
];

function now() { return new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }); }

type Phase = "profile" | "chat" | "reveal";

export default function SnsInvestPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("profile");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [scriptIdx, setScriptIdx] = useState(0);
  const [typing, setTyping] = useState(false);
  const [totalLost, setTotalLost] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const addScammer = useCallback((text: string) => {
    setMsgs(p => [...p, { role: "scammer", text, time: now() }]);
  }, []);

  function startChat() {
    setPhase("chat");
    setMsgs([]);
    setScriptIdx(0);
    setTimeout(() => {
      setTyping(true);
      setTimeout(() => { setTyping(false); addScammer(SCRIPTS[0]); scheduleNext(1); }, 1500);
    }, 800);
  }

  function scheduleNext(idx: number) {
    if (idx >= SCRIPTS.length) return;
    if (autoRef.current) clearTimeout(autoRef.current);
    autoRef.current = setTimeout(() => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        addScammer(SCRIPTS[idx]);
        setScriptIdx(idx + 1);
        scheduleNext(idx + 1);
      }, 1500);
    }, idx <= 2 ? 14000 : 18000);
  }

  function send() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");

    // 금액 감지
    const amountMatch = text.match(/(\d+)만/);
    if (amountMatch) setTotalLost(v => v + parseInt(amountMatch[1]) * 10000);

    setMsgs(prev => [...prev, { role: "user", text, time: now() }]);
    if (autoRef.current) clearTimeout(autoRef.current);

    // 출금 요청 → 수수료 요청 단계
    if (/출금|돌려|환불|못받|사기/.test(text) && scriptIdx >= 5) {
      setTimeout(() => {
        setTyping(true);
        setTimeout(() => { setTyping(false); addScammer(SCRIPTS[6]); }, 1200);
      }, 800);
      return;
    }

    if (scriptIdx < SCRIPTS.length) {
      setTimeout(() => {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          addScammer(SCRIPTS[scriptIdx]);
          setScriptIdx(s => s + 1);
          if (scriptIdx + 1 >= SCRIPTS.length) {
            setTimeout(() => setPhase("reveal"), 3000);
          }
        }, 1400);
      }, 700);
    }
  }

  // ── 프로필 화면 (인스타 스타일) ──
  if (phase === "profile") return (
    <div style={{ minHeight:"100vh", background:"#fafafa", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif", maxWidth:480, margin:"0 auto" }}>
      <style>{`* { -webkit-tap-highlight-color: transparent !important; box-sizing:border-box; } button{outline:none;}`}</style>
      {/* 인스타 헤더 */}
      <div style={{ background:"#fff", borderBottom:"1px solid #dbdbdb", padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
        <button onClick={() => router.push("/crime")} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#000" }}>‹</button>
        <span style={{ fontWeight:700, fontSize:16 }}>{SCAMMER.handle}</span>
        <span style={{ marginLeft:"auto", background:"#ff4444", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>⚠️ 사기 체험</span>
      </div>

      {/* 프로필 정보 */}
      <div style={{ background:"#fff", padding:"20px 16px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:16 }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", padding:3, flexShrink:0 }}>
            <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:"#e8f5e9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>{SCAMMER.avatar}</div>
          </div>
          <div style={{ display:"flex", gap:20, flex:1, justifyContent:"center" }}>
            {[{ val: SCAMMER.posts.length + "", label: "게시물" }, { val: SCAMMER.followers, label: "팔로워" }, { val: "843", label: "팔로잉" }].map((s, i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <p style={{ color:"#000", fontWeight:700, fontSize:16 }}>{s.val}</p>
                <p style={{ color:"#000", fontSize:12 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color:"#000", fontWeight:700, fontSize:14, marginBottom:2 }}>{SCAMMER.name}</p>
        <p style={{ color:"#000", fontSize:13, lineHeight:1.6, marginBottom:14 }}>{SCAMMER.bio}</p>

        {/* DM 버튼 */}
        <button onClick={startChat} style={{ width:"100%", padding:"8px 0", borderRadius:8, background:"linear-gradient(135deg,#405de6,#5851db,#833ab4,#c13584,#e1306c,#fd1d1d)", color:"#fff", fontWeight:700, fontSize:14, border:"none", cursor:"pointer", marginBottom:16 }}>
          💬 DM 보내기 (사기 체험 시작)
        </button>
      </div>

      {/* 게시물 그리드 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:2 }}>
        {SCAMMER.posts.map((p, i) => (
          <div key={i} style={{ aspectRatio:"1", background: i===0?"#e8f5e9": i===1?"#e3f2fd":"#fff3e0", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <span style={{ fontSize:36 }}>{p.img}</span>
            <p style={{ color:"rgba(0,0,0,0.5)", fontSize:10, textAlign:"center", padding:"4px", position:"absolute", bottom:4, left:4, right:4 }}>❤️ {p.likes}</p>
          </div>
        ))}
      </div>

      <div style={{ padding:16, background:"#fff3cd", border:"1px solid #ffc107", margin:12, borderRadius:12 }}>
        <p style={{ color:"#856404", fontSize:12, lineHeight:1.7 }}>
          ⚠️ 이 프로필은 실제 SNS 투자 사기범 유형을 재현한 시뮬레이션입니다.<br/>
          DM을 보내 어떻게 사기가 진행되는지 직접 경험해보세요.
        </p>
      </div>
    </div>
  );

  // ── 결과 화면 ──
  if (phase === "reveal") return (
    <div style={{ minHeight:"100vh", background:"#0a0a14", display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 16px 40px", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <style>{`* { -webkit-tap-highlight-color: transparent !important; box-sizing:border-box; } button{outline:none;}`}</style>
      <div style={{ maxWidth:440, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:52, marginBottom:12 }}>📸💸</div>
          <h2 style={{ color:"#f1f5f9", fontSize:20, fontWeight:900, marginBottom:6 }}>SNS 투자 사기에 당했습니다</h2>
          {totalLost > 0 && <p style={{ color:"#ef4444", fontWeight:700 }}>예상 피해 금액: ₩{totalLost.toLocaleString()}</p>}
        </div>
        <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:16, padding:"18px 20px", marginBottom:20 }}>
          <p style={{ color:"#ef4444", fontWeight:700, fontSize:13, marginBottom:12 }}>🎯 사기 수법 분석</p>
          {["화려한 수익 인증·라이프스타일로 신뢰 형성", "팔로워·좋아요 수치 조작으로 사회적 증거 위조", "'처음엔 소액' 30만원으로 경계심 낮추기", "개인 계좌로 입금 유도 (플랫폼 외부 거래)", "자리 한정·오늘 마감으로 이성적 판단 차단", "출금 시 수수료 명목으로 추가 입금 요구"].map((t, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:8 }}>
              <span style={{ color:"#ef4444", flexShrink:0 }}>{i+1}.</span>
              <p style={{ color:"#fca5a5", fontSize:12.5, lineHeight:1.6 }}>{t}</p>
            </div>
          ))}
        </div>
        <div style={{ background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:16, padding:"18px 20px", marginBottom:28 }}>
          <p style={{ color:"#22c55e", fontWeight:700, fontSize:13, marginBottom:10 }}>✅ 예방법</p>
          {["SNS에서 갑자기 투자 권유하면 100% 사기입니다.", "수익 인증 사진은 포토샵으로 쉽게 조작됩니다.", "개인 계좌 입금 요구는 절대 안 됩니다.", "금감원 등록 여부를 반드시 확인하세요 (1332)."].map((tip, i) => (
            <p key={i} style={{ color:"#86efac", fontSize:12, lineHeight:1.8 }}>· {tip}</p>
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => { setPhase("profile"); setMsgs([]); setScriptIdx(0); setTotalLost(0); }} style={{ flex:1, padding:"14px 0", borderRadius:14, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", color:"#cbd5e1", fontWeight:700, fontSize:14, cursor:"pointer" }}>다시 체험</button>
          <button onClick={() => router.push("/crime")} style={{ flex:1, padding:"14px 0", borderRadius:14, background:"linear-gradient(135deg,#e1306c,#833ab4)", border:"none", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>다른 체험</button>
        </div>
      </div>
    </div>
  );

  // ── DM 채팅 화면 ──
  return (
    <div style={{ height:"100dvh", display:"flex", flexDirection:"column", background:"#fff", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <style>{`* { -webkit-tap-highlight-color: transparent !important; box-sizing:border-box; } button{outline:none;} textarea{resize:none;outline:none;} ::-webkit-scrollbar{width:0}`}</style>
      <div style={{ background:"#fff", borderBottom:"1px solid #dbdbdb", padding:"12px 16px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <button onClick={() => setPhase("profile")} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#000" }}>‹</button>
        <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#f09433,#dc2743,#bc1888)", padding:2, flexShrink:0 }}>
          <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{SCAMMER.avatar}</div>
        </div>
        <div>
          <p style={{ color:"#000", fontWeight:700, fontSize:13 }}>{SCAMMER.handle}</p>
          <p style={{ color:"#aaa", fontSize:11 }}>활동 중</p>
        </div>
        <div style={{ marginLeft:"auto", background:"#ff444422", border:"1px solid #ff444444", color:"#ff4444", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>⚠️ 사기 체험</div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"16px 14px", background:"#fff", display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ textAlign:"center", marginBottom:4 }}>
          <span style={{ color:"#aaa", fontSize:11 }}>오늘</span>
        </div>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:"flex", flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems:"flex-end", gap:8 }}>
            {m.role === "scammer" && (
              <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#f09433,#dc2743,#bc1888)", padding:2, flexShrink:0 }}>
                <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{SCAMMER.avatar}</div>
              </div>
            )}
            <div style={{ maxWidth:"72%" }}>
              <div style={{ background: m.role === "user" ? "#3897f0" : "#efefef", borderRadius: m.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px", padding:"10px 14px" }}>
                <p style={{ color: m.role === "user" ? "#fff" : "#000", fontSize:13.5, lineHeight:1.6, whiteSpace:"pre-wrap", wordBreak:"break-all" }}>{m.text}</p>
              </div>
              <p style={{ color:"#aaa", fontSize:10, marginTop:2, textAlign: m.role === "user" ? "right" : "left" }}>{m.time}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#f09433,#dc2743,#bc1888)", padding:2, flexShrink:0 }}>
              <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{SCAMMER.avatar}</div>
            </div>
            <div style={{ background:"#efefef", borderRadius:"4px 18px 18px 18px", padding:"12px 16px" }}>
              <style>{`@keyframes b{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}} .dd{width:6px;height:6px;border-radius:50%;background:#aaa;animation:b 1.2s infinite;display:inline-block;margin:0 2px}`}</style>
              <span className="dd" style={{ animationDelay:"0s" }} /><span className="dd" style={{ animationDelay:"0.2s" }} /><span className="dd" style={{ animationDelay:"0.4s" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ background:"#fff", borderTop:"1px solid #dbdbdb", padding:"10px 14px", display:"flex", gap:10, alignItems:"flex-end", flexShrink:0, paddingBottom:"max(10px,env(safe-area-inset-bottom))" }}>
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }} placeholder="메시지..." rows={1} style={{ flex:1, background:"#efefef", border:"none", borderRadius:20, padding:"10px 16px", color:"#000", fontSize:14, fontFamily:"inherit" }}
          onInput={e => { const t=e.currentTarget; t.style.height="auto"; t.style.height=Math.min(t.scrollHeight,100)+"px"; }} />
        <button onClick={send} disabled={!input.trim()} style={{ background:"none", border:"none", cursor: input.trim()?"pointer":"default", color: input.trim()?"#3897f0":"#ccc", fontWeight:700, fontSize:14, flexShrink:0 }}>전송</button>
      </div>
    </div>
  );
}
