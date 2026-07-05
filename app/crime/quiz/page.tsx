"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const QUESTIONS = [
  {
    id: 1,
    type: "SMS",
    sender: "국민건강보험공단",
    senderNum: "1577-1000",
    msg: "[국민건강보험공단] 고객님의 건강보험료 환급금 128,400원이 발생하였습니다. 아래 링크에서 신청하세요.\nhttp://nhis-refund.kr/apply",
    isScam: true,
    category: "기관사칭",
    explanation: "공식 기관은 문자로 링크를 보내지 않습니다. 'nhis-refund.kr'은 건강보험공단 공식 도메인(nhis.or.kr)이 아닌 사기 도메인입니다. 환급금은 직접 공단(1577-1000)에 전화해 확인하세요.",
    redFlags: ["공식 도메인이 아닌 링크 포함", "문자로 환급금 신청 유도", "긴박감 조성 없음처럼 보이지만 기한 암시"],
  },
  {
    id: 2,
    type: "SMS",
    sender: "BK국민카드",
    senderNum: "1588-1688",
    msg: "[BK국민카드] 1월 결제대금 230,000원이 2월 15일 출금 예정입니다. 문의: 1588-1688",
    isScam: false,
    category: "정상문자",
    explanation: "정상 카드사 문자입니다. 링크가 없고, 개인정보 입력을 요구하지 않으며, 공식 번호(1588-1688)만 안내합니다. 이런 문자는 안전합니다.",
    redFlags: [],
  },
  {
    id: 3,
    type: "SMS",
    sender: "JC대한통운",
    senderNum: "1588-1255",
    msg: "[JC대한통운] 택배 배송 중 고객님 부재로 보관 중입니다. 배송비 3,500원 입금 후 재배송 가능합니다.\n협농 302-9384-7291-41",
    isScam: true,
    category: "택배사칭",
    explanation: "택배사는 절대 계좌이체를 요구하지 않습니다. 재배송 신청은 공식 앱이나 홈페이지에서만 합니다. 계좌번호가 문자에 있으면 100% 사기입니다.",
    redFlags: ["계좌번호 직접 문자 발송", "소액으로 경계심 낮추기", "공식 앱 안내 없음"],
  },
  {
    id: 4,
    type: "오카카",
    sender: "엄마",
    senderNum: "",
    msg: "나 폰 고장났어. 이 번호로 연락해. 지금 급하게 돈 50만원만 보내줘. 나중에 갚을게. 오카카뱅크 3333-04-1928374",
    isScam: true,
    category: "가족사칭",
    explanation: "가족을 사칭한 메신저 피싱입니다. 폰이 고장났다며 새 번호로 연락하고 즉시 송금을 요구하는 건 대표적인 사기 수법입니다. 반드시 기존 번호로 직접 전화해 확인하세요.",
    redFlags: ["폰 고장 핑계로 새 번호 접촉", "즉시 송금 요구", "계좌번호 직접 제시"],
  },
  {
    id: 5,
    type: "SMS",
    sender: "국세청",
    senderNum: "126",
    msg: "[국세청] 고객님의 종합소득세 환급금 342,000원이 결정되었습니다. 홈택스(hometax.go.kr) 접속 또는 ARS 126으로 신청하세요.",
    isScam: false,
    category: "정상문자",
    explanation: "정상적인 국세청 안내 문자입니다. 공식 도메인(hometax.go.kr)과 공식 번호(126)만 안내하며, 링크 클릭이나 개인정보 입력을 요구하지 않습니다.",
    redFlags: [],
  },
  {
    id: 6,
    type: "전화",
    sender: "서울중앙지검",
    senderNum: "02-530-4114",
    msg: '안녕하세요. 서울중앙지검 수사관 김민준입니다. 고객님 명의의 계좌가 보이스피싱 범죄에 이용된 정황이 포착되었습니다. 지금 즉시 수사에 협조하셔야 합니다. 계좌 보호를 위해 잠시 후 안전계좌로 이체가 필요합니다.',
    isScam: true,
    category: "검찰사칭",
    explanation: "검찰·경찰·금감원은 절대 전화로 계좌이체를 요구하지 않습니다. '안전계좌 이체'라는 말 자체가 100% 사기입니다. 전화를 끊고 직접 검찰청(1301)에 확인하세요.",
    redFlags: ["공공기관 사칭", "'안전계좌' 이체 요구", "즉각적 협조 압박", "전화로 수사 진행 주장"],
  },
  {
    id: 7,
    type: "SNS",
    sender: "해외 친구 (인스타)",
    senderNum: "@jake_crypto_2024",
    msg: "안녕! 나 지난달에 코인으로 1200만원 벌었어. 내 멘토가 알려준 방법인데, 너도 해볼래? 처음엔 30만원만 넣으면 돼. 수익 나면 출금 자유야. 링크 보내줄게!",
    isScam: true,
    category: "SNS투자사기",
    explanation: "SNS에서 갑자기 투자를 권유하는 건 전형적인 사기입니다. '처음엔 소액'으로 시작해 수익을 보여준 뒤 큰 금액을 유도합니다. 출금 시도하면 각종 명목으로 추가 입금을 요구합니다.",
    redFlags: ["SNS로 투자 권유", "단기간 고수익 주장", "'처음엔 소액' 유도", "링크 클릭 유도"],
  },
  {
    id: 8,
    type: "피망마켓",
    sender: "구매자",
    senderNum: "피망마켓",
    msg: "안녕하세요! 맥북 아직 있나요? 직거래 어렵고 택배 거래 원해요. 안전결제로 하면 어떨까요? 제가 먼저 안전결제 링크 보내드릴게요~\nhttps://daangn-safe.pay-kr.com/link/a8f3k",
    isScam: true,
    category: "중고거래사기",
    explanation: "피망마켓 공식 안전결제 링크는 앱 내에서만 생성됩니다. 외부 링크('daangn-safe.pay-kr.com')는 100% 피싱 사이트입니다. 구매자가 먼저 결제 링크를 보내는 것도 사기 패턴입니다.",
    redFlags: ["외부 링크로 안전결제 유도", "공식 앱 밖에서 거래 유도", "구매자가 먼저 링크 제시"],
  },
  {
    id: 9,
    type: "SMS",
    sender: "남은행",
    senderNum: "1588-5000",
    msg: "[남은행] 고객님 계좌에서 해외 로그인이 감지되었습니다. 본인이 아닌 경우 지금 즉시 아래 링크에서 인증하세요. (10분 내 미인증 시 계좌 동결)\nhttp://woori-secure.net/auth",
    isScam: true,
    category: "금융사칭",
    explanation: "은행은 문자 링크로 인증을 요구하지 않습니다. '10분 내 계좌 동결'은 공포심을 이용한 긴박감 조성입니다. 의심되면 링크 클릭 말고 은행 공식 앱이나 1588-5000으로 직접 전화하세요.",
    redFlags: ["계좌 동결 협박", "짧은 시간 제한", "외부 링크 인증 요구"],
  },
  {
    id: 10,
    type: "SMS",
    sender: "신한카드",
    senderNum: "1544-7000",
    msg: "[신한카드] 해외가맹점 $89.99 승인. 본인 거래 아닌 경우 1544-7000으로 문의. (자동발신)",
    isScam: false,
    category: "정상문자",
    explanation: "정상 카드 승인 문자입니다. 링크가 없고, 공식 번호로만 문의를 안내합니다. 해외 결제가 의심되면 문자 링크 말고 문자에 있는 번호(1544-7000)로 직접 전화하세요.",
    redFlags: [],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "기관사칭": "#ef4444",
  "정상문자": "#22c55e",
  "택배사칭": "#f59e0b",
  "가족사칭": "#a855f7",
  "검찰사칭": "#ef4444",
  "SNS투자사기": "#ec4899",
  "중고거래사기": "#f97316",
  "금융사칭": "#ef4444",
};

export default function QuizPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro"|"quiz"|"result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(boolean|null)[]>(Array(QUESTIONS.length).fill(null));
  const [showExplain, setShowExplain] = useState(false);
  const [selected, setSelected] = useState<boolean|null>(null);

  const q = QUESTIONS[current];
  const correct = answers.filter((a, i) => a === QUESTIONS[i].isScam).length;
  const wrong = answers.filter((a, i) => a !== null && a !== QUESTIONS[i].isScam);
  const weakCategories = QUESTIONS
    .filter((q, i) => answers[i] !== null && answers[i] !== q.isScam)
    .map(q => q.category);

  function answer(isScam: boolean) {
    if (selected !== null) return;
    setSelected(isScam);
    setShowExplain(true);
    const next = [...answers];
    next[current] = isScam;
    setAnswers(next);
  }

  function next() {
    setShowExplain(false);
    setSelected(null);
    if (current + 1 >= QUESTIONS.length) {
      setPhase("result");
    } else {
      setCurrent(c => c + 1);
    }
  }

  const typeIcon = (t: string) => t === "SMS" ? "💬" : t === "오카카" ? "💛" : t === "전화" ? "📞" : t === "SNS" ? "📸" : "🥕";

  if (phase === "intro") return (
    <div style={{ minHeight:"100vh", background:"#0f172a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 16px", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <style>{`* { -webkit-tap-highlight-color: transparent !important; box-sizing: border-box; } button { outline: none; }`}</style>
      <button onClick={() => router.push("/crime")} style={{ position:"fixed", top:14, left:14, background:"rgba(255,255,255,0.06)", border:"1px solid #ffffff18", borderRadius:12, padding:"8px 14px", color:"#94a3b8", fontSize:13, cursor:"pointer" }}>← 돌아가기</button>
      <div style={{ maxWidth:460, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:56, marginBottom:16 }}>🕵️</div>
        <h1 style={{ color:"#f1f5f9", fontSize:24, fontWeight:900, marginBottom:8 }}>사기 문자 판별 퀴즈</h1>
        <p style={{ color:"#64748b", fontSize:14, lineHeight:1.8, marginBottom:32 }}>
          진짜 문자인지, 사기 문자인지 맞춰보세요.<br/>
          총 {QUESTIONS.length}문제 · 실제 사기 사례 기반
        </p>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"20px 24px", marginBottom:28, textAlign:"left" }}>
          {[
            { icon:"💬", text:"SMS·오카카·SNS·전화 등 다양한 유형 출제" },
            { icon:"🔴", text:"사기면 '사기입니다' / 정상이면 '정상입니다' 선택" },
            { icon:"📊", text:"마지막에 내가 어떤 수법에 취약한지 분석" },
          ].map((tip, i) => (
            <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:i<2?12:0 }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{tip.icon}</span>
              <p style={{ color:"#cbd5e1", fontSize:13, lineHeight:1.6 }}>{tip.text}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("quiz")} style={{ width:"100%", padding:"16px 0", borderRadius:16, background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", fontWeight:900, fontSize:16, border:"none", cursor:"pointer", boxShadow:"0 0 24px #ef444455" }}>
          퀴즈 시작하기 →
        </button>
      </div>
    </div>
  );

  if (phase === "result") return (
    <div style={{ minHeight:"100vh", background:"#0f172a", display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 16px 40px", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <style>{`* { -webkit-tap-highlight-color: transparent !important; box-sizing: border-box; } button { outline: none; }`}</style>
      <div style={{ maxWidth:480, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:56, marginBottom:12 }}>
            {correct >= 9 ? "🏆" : correct >= 7 ? "🛡️" : correct >= 5 ? "⚠️" : "😱"}
          </div>
          <h2 style={{ color:"#f1f5f9", fontSize:22, fontWeight:900, marginBottom:6 }}>
            {correct}/{QUESTIONS.length}개 정답
          </h2>
          <p style={{ color:"#64748b", fontSize:14 }}>
            {correct >= 9 ? "탁월합니다! 사기에 잘 속지 않을 거예요." :
             correct >= 7 ? "준수한 수준이지만 방심은 금물입니다." :
             correct >= 5 ? "주의가 필요합니다. 취약한 유형을 확인하세요." :
             "사기에 노출될 위험이 높습니다. 꼭 학습하세요."}
          </p>
        </div>

        {/* 점수 바 */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"16px 20px", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ color:"#94a3b8", fontSize:12 }}>정답률</span>
            <span style={{ color:"#f1f5f9", fontWeight:700, fontSize:12 }}>{Math.round(correct/QUESTIONS.length*100)}%</span>
          </div>
          <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:8, height:10, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${correct/QUESTIONS.length*100}%`, background: correct >= 7 ? "linear-gradient(90deg,#22c55e,#16a34a)" : correct >= 5 ? "linear-gradient(90deg,#f59e0b,#d97706)" : "linear-gradient(90deg,#ef4444,#dc2626)", borderRadius:8, transition:"width 1s ease" }} />
          </div>
        </div>

        {/* 취약 유형 */}
        {weakCategories.length > 0 && (
          <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:16, padding:"18px 20px", marginBottom:20 }}>
            <p style={{ color:"#ef4444", fontWeight:700, fontSize:13, marginBottom:12 }}>🎯 내가 취약한 사기 유형</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {[...new Set(weakCategories)].map((cat, i) => (
                <span key={i} style={{ background:`${CATEGORY_COLORS[cat] ?? "#ef4444"}22`, border:`1px solid ${CATEGORY_COLORS[cat] ?? "#ef4444"}44`, color: CATEGORY_COLORS[cat] ?? "#ef4444", fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20 }}>{cat}</span>
              ))}
            </div>
            <p style={{ color:"#fca5a5", fontSize:12, lineHeight:1.7, marginTop:12 }}>
              위 유형의 사기 문자를 실제로 받으면 특히 주의하세요.<br/>의심스러우면 링크 클릭 전에 반드시 공식 번호로 전화하세요.
            </p>
          </div>
        )}

        {/* 문항별 리뷰 */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"18px 20px", marginBottom:24 }}>
          <p style={{ color:"#94a3b8", fontWeight:700, fontSize:13, marginBottom:14 }}>📋 문항별 결과</p>
          {QUESTIONS.map((q, i) => {
            const userAns = answers[i];
            const isCorrect = userAns === q.isScam;
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom: i < QUESTIONS.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <span style={{ fontSize:16 }}>{isCorrect ? "✅" : "❌"}</span>
                <span style={{ color:"#64748b", fontSize:11, flexShrink:0 }}>{typeIcon(q.type)} {q.type}</span>
                <span style={{ color:"#94a3b8", fontSize:12, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{q.sender}</span>
                <span style={{ fontSize:10, padding:"2px 8px", borderRadius:12, fontWeight:700, background:`${CATEGORY_COLORS[q.category]??'#64748b'}22`, color:CATEGORY_COLORS[q.category]??'#94a3b8', flexShrink:0 }}>{q.category}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => { setPhase("intro"); setCurrent(0); setAnswers(Array(QUESTIONS.length).fill(null)); setSelected(null); setShowExplain(false); }} style={{ flex:1, padding:"14px 0", borderRadius:14, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", color:"#cbd5e1", fontWeight:700, fontSize:14, cursor:"pointer" }}>다시 풀기</button>
          <button onClick={() => router.push("/crime")} style={{ flex:1, padding:"14px 0", borderRadius:14, background:"linear-gradient(135deg,#ef4444,#b91c1c)", border:"none", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>다른 체험</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0f172a", display:"flex", flexDirection:"column", padding:"0 0 40px", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <style>{`* { -webkit-tap-highlight-color: transparent !important; box-sizing: border-box; } button { outline: none; } ::-webkit-scrollbar{width:0}`}</style>

      {/* 헤더 */}
      <div style={{ background:"rgba(15,23,42,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"14px 16px", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:50 }}>
        <button onClick={() => router.push("/crime")} style={{ background:"none", border:"none", color:"#60a5fa", fontSize:15, cursor:"pointer", padding:"4px 2px" }}>‹</button>
        <div style={{ flex:1 }}>
          <p style={{ color:"#f1f5f9", fontWeight:700, fontSize:14 }}>사기 판별 퀴즈</p>
          <div style={{ display:"flex", gap:4, marginTop:4 }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i < current ? "#22c55e" : i === current ? "#3b82f6" : "rgba(255,255,255,0.1)" }} />
            ))}
          </div>
        </div>
        <span style={{ color:"#64748b", fontSize:12 }}>{current+1}/{QUESTIONS.length}</span>
      </div>

      <div style={{ flex:1, padding:"20px 16px", maxWidth:520, margin:"0 auto", width:"100%" }}>
        {/* 유형 배지 */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          <span style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"4px 12px", color:"#94a3b8", fontSize:12 }}>{typeIcon(q.type)} {q.type}</span>
          <span style={{ background:`${CATEGORY_COLORS[q.category]??'#64748b'}22`, border:`1px solid ${CATEGORY_COLORS[q.category]??'#64748b'}44`, borderRadius:20, padding:"4px 12px", color:CATEGORY_COLORS[q.category]??'#94a3b8', fontSize:12, fontWeight:700 }}>{q.category}</span>
        </div>

        {/* 메시지 카드 */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"20px", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, paddingBottom:14, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#1e293b,#334155)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{typeIcon(q.type)}</div>
            <div>
              <p style={{ color:"#f1f5f9", fontWeight:700, fontSize:14 }}>{q.sender}</p>
              {q.senderNum && <p style={{ color:"#475569", fontSize:11 }}>{q.senderNum}</p>}
            </div>
          </div>
          <p style={{ color:"#e2e8f0", fontSize:14, lineHeight:1.8, whiteSpace:"pre-wrap", wordBreak:"break-all" }}>{q.msg}</p>
        </div>

        {/* 선택 버튼 */}
        {!showExplain ? (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <button onClick={() => answer(true)} style={{ padding:"18px 0", borderRadius:16, background:"rgba(239,68,68,0.1)", border:"2px solid rgba(239,68,68,0.3)", color:"#ef4444", fontWeight:900, fontSize:15, cursor:"pointer", transition:"all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,0.2)"; e.currentTarget.style.borderColor="#ef4444"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(239,68,68,0.1)"; e.currentTarget.style.borderColor="rgba(239,68,68,0.3)"; }}>
              🚨 사기입니다
            </button>
            <button onClick={() => answer(false)} style={{ padding:"18px 0", borderRadius:16, background:"rgba(34,197,94,0.1)", border:"2px solid rgba(34,197,94,0.3)", color:"#22c55e", fontWeight:900, fontSize:15, cursor:"pointer", transition:"all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(34,197,94,0.2)"; e.currentTarget.style.borderColor="#22c55e"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(34,197,94,0.1)"; e.currentTarget.style.borderColor="rgba(34,197,94,0.3)"; }}>
              ✅ 정상입니다
            </button>
          </div>
        ) : (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* 정오 표시 */}
            <div style={{ background: selected === q.isScam ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border:`2px solid ${selected === q.isScam ? "#22c55e" : "#ef4444"}`, borderRadius:16, padding:"14px 18px", marginBottom:14, display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>{selected === q.isScam ? "✅" : "❌"}</span>
              <div>
                <p style={{ color: selected === q.isScam ? "#22c55e" : "#ef4444", fontWeight:900, fontSize:15 }}>
                  {selected === q.isScam ? "정답!" : "오답!"} — 이것은 {q.isScam ? "사기" : "정상"} 문자입니다
                </p>
              </div>
            </div>

            {/* 해설 */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"16px 18px", marginBottom:q.redFlags.length > 0 ? 12 : 16 }}>
              <p style={{ color:"#94a3b8", fontWeight:700, fontSize:12, marginBottom:8 }}>💡 해설</p>
              <p style={{ color:"#cbd5e1", fontSize:13, lineHeight:1.7 }}>{q.explanation}</p>
            </div>

            {/* 위험 신호 */}
            {q.redFlags.length > 0 && (
              <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:16, padding:"14px 18px", marginBottom:16 }}>
                <p style={{ color:"#ef4444", fontWeight:700, fontSize:12, marginBottom:8 }}>🚩 위험 신호</p>
                {q.redFlags.map((f, i) => (
                  <p key={i} style={{ color:"#fca5a5", fontSize:12, lineHeight:1.7 }}>· {f}</p>
                ))}
              </div>
            )}

            <button onClick={next} style={{ width:"100%", padding:"15px 0", borderRadius:14, background:"linear-gradient(135deg,#3b82f6,#2563eb)", color:"#fff", fontWeight:900, fontSize:15, border:"none", cursor:"pointer" }}>
              {current + 1 >= QUESTIONS.length ? "결과 보기 →" : "다음 문제 →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
