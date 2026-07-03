"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReportNumber from "@/components/ReportNumber";

type Phase = "intro" | "order" | "chat" | "blackmail" | "choice" | "reveal";

const CHAT_SCRIPT = [
  { from:"bot", text:"🧬 AI DNA 분석 키트 주문이 완료되었습니다. 3~5일 내 배송됩니다!" },
  { from:"user", text:"감사합니다. 기대되네요!" },
  { from:"bot", text:"📦 키트가 도착했군요! 면봉으로 구강 상피를 채취해 제공된 봉투에 넣어 발송하세요." },
  { from:"user", text:"네, 보냈어요 🧫" },
  { from:"bot", text:"✅ 샘플 수령 완료. 분석에 약 7일 소요됩니다. 분석 결과는 앱 내에서 확인 가능합니다." },
  { from:"bot", text:"📊 분석 완료! 결과를 앱에서 확인하세요. 일부 민감한 정보가 포함되어 있습니다." },
  { from:"user", text:"앱을 열었는데 결과가 안 보여요?" },
  { from:"bot", text:"⚠️ 프리미엄 해석 서비스(₩99,000)를 구매하셔야 전체 결과를 보실 수 있습니다." },
  { from:"user", text:"그런 약관은 없었는데요..." },
];

const BLACKMAIL_MSG = `📩 [긴급] 귀하의 유전 정보 관련 중요 통보

안녕하세요. GenAI Lab 법무팀입니다.

귀하의 DNA 분석 과정에서 다음 사항이 확인되었습니다:

1. 특정 유전 질환 보유자 가능성 (보험 관련)
2. 친족 관계 불일치 패턴 감지
3. 당사 파트너 의료기관 공유 예정 데이터

위 정보의 '삭제 처리' 및 '비공개 유지'를 원하시면
72시간 내 ₩1,500,000을 아래 계좌로 입금하세요.

입금 후 모든 데이터를 파기하겠습니다.
미입금 시 보험사 및 가족에게 자동 전송됩니다.

— GenAI Lab 법무팀 (실제 법인이 아닌 사기 조직)`;

export default function DnaScamPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [chatIdx, setChatIdx] = useState(0);
  const [typing, setTyping] = useState(false);
  const [choice, setChoice] = useState<"pay" | "report" | null>(null);

  useEffect(() => {
    if (phase !== "chat") return;
    if (chatIdx >= CHAT_SCRIPT.length) {
      setTimeout(() => setPhase("blackmail"), 800);
      return;
    }
    setTyping(true);
    const delay = CHAT_SCRIPT[chatIdx].from === "bot" ? 1200 : 600;
    const t = setTimeout(() => {
      setTyping(false);
      setChatIdx(i => i + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [phase, chatIdx]);

  if (phase === "reveal") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#030d14,#001524)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:540, width:"100%" }}>
        <div style={{ background:"linear-gradient(135deg,#0c1a2e,#122040)", border:"2px solid #38bdf8", borderRadius:24, padding:"32px 28px", marginBottom:20 }}>
          <div style={{ fontSize:56, textAlign:"center", marginBottom:16 }}>🧬</div>
          <h2 style={{ color:"#38bdf8", fontSize:22, fontWeight:900, textAlign:"center", marginBottom:8 }}>AI 유전자 분석 사기 해설</h2>
          <p style={{ color:"#6b7280", fontSize:12, textAlign:"center", marginBottom:20 }}>유전 정보는 한 번 유출되면 되돌릴 수 없는 영구적 개인정보입니다</p>
          {choice === "pay" && <div style={{ background:"#1a0808", border:"1px solid #ef444444", borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
            <p style={{ color:"#fca5a5", fontSize:13, margin:0 }}>💸 돈을 보냈다면: 협박은 계속됩니다. DNA 데이터는 이미 판매되었을 가능성이 높습니다. <strong style={{ color:"#ef4444" }}>절대 송금하지 마세요.</strong></p>
          </div>}
          <div style={{ background:"#070f1a", borderRadius:14, padding:"16px 20px", marginBottom:20 }}>
            {[
              { icon:"🧬", t:"유전 정보는 최고 민감 개인정보", d:"주민번호는 바꿀 수 있지만 DNA는 바꿀 수 없습니다. 유출되면 평생 위협받을 수 있습니다." },
              { icon:"⚖️", t:"국내 법률", d:"개인정보보호법 제23조: 유전 정보는 민감 정보로 동의 없이 수집·이용 금지. 위반 시 5년 이하 징역." },
              { icon:"🔍", t:"사기 식별법", d:"'분석 완료 후 추가 결제' 요구, 법무팀 협박 메시지, 해외 계좌 입금 — 이 세 가지면 100% 사기입니다." },
              { icon:"🛡️", t:"예방법", d:"국내 식약처 허가 유전자 분석 기관만 이용하세요. 해외 저가 키트는 데이터 활용 약관을 반드시 확인하세요." },
              { icon:"📞", t:"신고처", d:"개인정보침해 신고: 국번 없이 118 / 경찰 사이버수사대: 국번 없이 182" },
            ].map((it,i) => (
              <div key={i} style={{ display:"flex", gap:12, marginBottom:i<4?12:0 }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{it.icon}</span>
                <div>
                  <p style={{ color:"#38bdf8", fontSize:12, fontWeight:700, marginBottom:2 }}>{it.t}</p>
                  <p style={{ color:"#6b7280", fontSize:12, lineHeight:1.6, margin:0 }}>{it.d}</p>
                </div>
              </div>
            ))}
          </div>
          <ReportNumber number="118" label="📞 개인정보 침해 신고" bg="#0a1e2e" color="#38bdf8" />
          <button onClick={() => router.push("/")} style={{ width:"100%", background:"none", border:"1px solid #0c2040", borderRadius:14, padding:"12px 0", color:"#334155", fontSize:13, cursor:"pointer" }}>← 메인으로</button>
        </div>
      </div>
    </div>
  );

  if (phase === "choice") return (
    <div style={{ minHeight:"100vh", background:"#030d14", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:440, width:"100%" }}>
        <div style={{ background:"#070f1a", border:"2px solid #f59e0b", borderRadius:20, padding:"28px 24px", marginBottom:16 }}>
          <div style={{ fontSize:40, textAlign:"center", marginBottom:12 }}>⚠️</div>
          <p style={{ color:"#fbbf24", fontSize:15, fontWeight:800, textAlign:"center", marginBottom:6 }}>어떻게 하시겠습니까?</p>
          <p style={{ color:"#475569", fontSize:13, textAlign:"center", marginBottom:24 }}>협박 메시지를 받았습니다</p>
          <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
            <button onClick={() => { setChoice("pay"); setPhase("reveal"); }} style={{ background:"#1a0a00", border:"2px solid #f59e0b", borderRadius:14, padding:"16px", color:"#fbbf24", fontWeight:700, fontSize:14, cursor:"pointer", textAlign:"left" as const }}>
              💳 ₩1,500,000 입금하기<br/>
              <span style={{ color:"#555", fontSize:12, fontWeight:400 }}>빨리 끝내고 싶다. 데이터를 삭제해달라</span>
            </button>
            <button onClick={() => { setChoice("report"); setPhase("reveal"); }} style={{ background:"#0c1a2e", border:"2px solid #38bdf8", borderRadius:14, padding:"16px", color:"#38bdf8", fontWeight:700, fontSize:14, cursor:"pointer", textAlign:"left" as const }}>
              📵 절대 안 낸다 — 118 신고하기<br/>
              <span style={{ color:"#555", fontSize:12, fontWeight:400 }}>협박이라고 확신. 즉시 신고한다</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (phase === "blackmail") return (
    <div style={{ minHeight:"100vh", background:"#030d14", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:460, width:"100%" }}>
        <div style={{ background:"#0a0808", border:"2px solid #ef4444", borderRadius:20, padding:"24px", marginBottom:16 }}>
          <p style={{ color:"#ef4444", fontSize:11, fontWeight:800, letterSpacing:2, marginBottom:16 }}>📩 수신된 협박 이메일</p>
          <pre style={{ color:"#fca5a5", fontSize:12, lineHeight:1.8, whiteSpace:"pre-wrap", margin:0, fontFamily:"monospace" }}>{BLACKMAIL_MSG}</pre>
        </div>
        <button onClick={() => setPhase("choice")} style={{ width:"100%", background:"linear-gradient(135deg,#7c3aed,#1d4ed8)", border:"none", borderRadius:14, padding:"16px 0", color:"#fff", fontWeight:900, fontSize:15, cursor:"pointer" }}>
          → 어떻게 할지 선택하기
        </button>
      </div>
    </div>
  );

  if (phase === "chat" || phase === "order") return (
    <div style={{ minHeight:"100vh", background:"#030d14", display:"flex", flexDirection:"column" as const }}>
      {/* 앱 헤더 */}
      <div style={{ background:"#0a1628", borderBottom:"1px solid #1e3a5f", padding:"14px 20px", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🧬</div>
        <div>
          <p style={{ color:"#e2e8f0", fontWeight:700, fontSize:14, margin:0 }}>GenAI Lab Assistant</p>
          <p style={{ color:"#22c55e", fontSize:11, margin:0 }}>● 온라인</p>
        </div>
      </div>
      {/* 채팅 */}
      <div style={{ flex:1, padding:"20px 16px", display:"flex", flexDirection:"column" as const, gap:10, overflowY:"auto" as const }}>
        {CHAT_SCRIPT.slice(0, chatIdx).map((msg, i) => (
          <div key={i} style={{ display:"flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth:"75%", background: msg.from === "user" ? "#1d4ed8" : "#0f2040",
              border: msg.from === "bot" ? "1px solid #1e3a5f" : "none",
              borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding:"10px 14px",
            }}>
              <p style={{ color:"#e2e8f0", fontSize:13, lineHeight:1.6, margin:0 }}>{msg.text}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display:"flex" }}>
            <div style={{ background:"#0f2040", border:"1px solid #1e3a5f", borderRadius:"18px 18px 18px 4px", padding:"10px 16px" }}>
              <span style={{ color:"#64748b", fontSize:18 }}>•••</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#030d14,#020816)", padding:"40px 20px" }}>
      <div style={{ maxWidth:560, margin:"0 auto" }}>
        <button onClick={() => router.push("/")} style={{ background:"none", border:"none", color:"#555", fontSize:13, cursor:"pointer", marginBottom:24 }}>← 메인으로</button>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-block", background:"#0ea5e922", border:"1px solid #0ea5e955", borderRadius:20, padding:"4px 12px", marginBottom:12 }}>
            <span style={{ color:"#38bdf8", fontSize:11, fontWeight:800, letterSpacing:2 }}>🔮 FUTURE CRIME · 2025~2028년 예상</span>
          </div>
          <h1 style={{ color:"#fff", fontSize:26, fontWeight:900, marginBottom:10 }}>🧬 AI 유전자 분석 사기</h1>
          <p style={{ color:"#64748b", fontSize:14, lineHeight:1.7 }}>저렴한 DNA 키트로 유전 정보를 탈취한 뒤<br/>유전 질환·가족 관계를 빌미로 협박하는 신종 범죄</p>
        </div>
        <div style={{ background:"#0a1220", border:"1px solid #1e3a5f", borderRadius:20, padding:24, marginBottom:20 }}>
          <p style={{ color:"#38bdf8", fontSize:11, fontWeight:800, letterSpacing:2, marginBottom:16 }}>📦 GenAI DNA Kit — 특가 ₩29,000</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            {["유전 질환 위험도 분석 🏥","조상 계보 추적 🌍","약물 반응 예측 💊","맞춤 식단 추천 🥗"].map((f,i) => (
              <div key={i} style={{ background:"#0f2040", border:"1px solid #1e3a5f", borderRadius:10, padding:"10px 12px" }}>
                <p style={{ color:"#94a3b8", fontSize:12, margin:0 }}>{f}</p>
              </div>
            ))}
          </div>
          <div style={{ background:"#060e1a", borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
            <p style={{ color:"#475569", fontSize:11, margin:0, lineHeight:1.7 }}>
              ⚠️ 실제 국내 피해 사례: 미국 23andMe 2023년 해킹으로 690만 명 유전 데이터 유출 (실제 사건). 국내도 동일 수법 확산 예상.
            </p>
          </div>
        </div>
        <button onClick={() => setPhase("chat")} style={{ width:"100%", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", border:"none", borderRadius:18, padding:"18px 0", color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer", boxShadow:"0 4px 24px #0ea5e944" }}>
          🧬 DNA 키트 주문 체험 시작
        </button>
      </div>
    </div>
  );
}
