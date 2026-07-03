"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReportNumber from "@/components/ReportNumber";

type ScenarioId = "robbery" | "courier" | "raid";
type ChoiceKey = string;

interface Scenario {
  id: ScenarioId;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  situation: string;
  choices: { key: ChoiceKey; label: string; desc: string }[];
  results: Record<ChoiceKey, { title: string; color: string; body: string }>;
  lesson: { icon: string; title: string; body: string }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "robbery",
    icon: "🔪",
    title: "거래 현장에서 강탈당함",
    subtitle: "물건 건네려는 순간 상대방이 총을 꺼냈다",
    color: "#ef4444",
    situation: `불법 총기를 ₩2,800,000에 구매하기로 하고
새벽 2시 외진 주차장에서 직거래를 약속했습니다.

돈을 건네는 순간 판매자가 총을 꺼내 들었습니다.
"돈이랑 폰 다 내놔. 신고하면 너도 총기 구매죄로 잡혀."

현금 ₩2,800,000 + 스마트폰까지 빼앗겼습니다.`,
    choices: [
      { key:"call112", label:"즉시 112에 신고한다", desc:"강도 피해이므로 경찰에 신고" },
      { key:"chase", label:"직접 뒤를 쫓아간다", desc:"놓칠 수 없다. 내 돈 찾겠다" },
      { key:"silent", label:"그냥 조용히 집에 간다", desc:"신고하면 나도 잡힐까봐" },
      { key:"snitch", label:"텔레그램으로 보복 예고", desc:"온라인으로 협박해서 돈 받아내기" },
    ],
    results: {
      call112: {
        title: "신고했지만 — 반전이 있습니다",
        color: "#f59e0b",
        body: `강도 피해 신고는 맞는 행동입니다.

하지만 수사관이 반드시 묻습니다:
"왜 새벽 2시 외진 주차장에 갔나요?"
"무엇을 구매하려 했나요?"

→ 불법 총기 구매 시도 사실이 드러납니다
→ 피해자이면서 동시에 총포법 위반 피의자가 됩니다
→ 강도 피해는 처리되지만 본인도 조사받습니다

💡 신고 전 변호사와 먼저 상담하는 것이 현명합니다.
   법률구조공단 132 (무료 상담)`,
      },
      chase: {
        title: "최악의 선택 — 목숨이 위험합니다",
        color: "#ef4444",
        body: `상대방은 실제 총기를 소지하고 있습니다.

직접 추격 시:
→ 총격 사망 위험 (실제 사례 다수)
→ 설령 잡아도 폭행죄·감금죄 역고소 가능
→ 무기 거래 현장 재방문으로 추가 범죄 성립

이 상황에서 직접 대응은 생명을 위협합니다.
현장에서 즉시 벗어나는 것이 최우선입니다.`,
      },
      silent: {
        title: "단기적으로 가장 안전하지만 — 함정이 있습니다",
        color: "#f59e0b",
        body: `조용히 있으면 당장 처벌은 피할 수 있습니다.

하지만:
→ 강도범은 다음 피해자를 만납니다
→ 범행 현장 CCTV에 당신 얼굴이 찍혔습니다
→ 나중에 수사망에 포착될 수 있습니다

불법 거래 중 피해자가 된 경우,
법률 상담(132)을 통해 자수 감경 가능성을 따져보세요.`,
      },
      snitch: {
        title: "추가 범죄만 늘어납니다",
        color: "#ef4444",
        body: `텔레그램 협박 메시지 발송 시:

→ 협박죄 (형법 제283조): 3년 이하 징역
→ 공갈죄 (형법 제350조): 10년 이하 징역

상대방이 이 메시지를 경찰에 제출하면
당신의 불법 총기 구매 시도까지 한꺼번에 수사받습니다.

피해를 되갚으려다 더 큰 범죄자가 됩니다.`,
      },
    },
    lesson: [
      { icon:"🎯", title:"불법 거래 현장 = 범죄자만 모이는 곳", body:"판매자도 구매자도 법의 보호를 받지 못합니다. 강탈·사기·폭행이 일상적으로 발생합니다." },
      { icon:"📷", title:"CCTV는 피할 수 없습니다", body:"새벽 외진 장소도 도로·건물 CCTV에 찍힙니다. '아무도 모른다'는 착각입니다." },
      { icon:"⚖️", title:"피해자도 처벌받습니다", body:"불법 거래 중 피해를 입어도 구매 시도 자체가 이미 범죄입니다." },
    ],
  },
  {
    id: "courier",
    icon: "📦",
    title: "무기 운반에 연루됨",
    subtitle: "아르바이트인 줄 알았는데 무기를 운반시켰다",
    color: "#a855f7",
    situation: `SNS에서 "박스 배달 아르바이트 — 시급 ₩50,000"
광고를 보고 지원했습니다.

지시대로 박스를 받아 지하 주차장에 전달하는 순간
경찰이 포위하며 체포됩니다.

박스 안에는 불법 개조 총기 5정이 들어있었습니다.
"저는 몰랐어요!" — 경찰은 믿어줄까요?`,
    choices: [
      { key:"deny", label:"몰랐다고 부인한다", desc:"진짜로 몰랐으니까. 억울하다" },
      { key:"cooperate", label:"즉시 협조하고 지시자를 신고한다", desc:"내가 아는 거 다 말하겠다" },
      { key:"escape", label:"도망친다", desc:"일단 현장을 벗어나고 본다" },
      { key:"lawyer", label:"변호사를 요청한다", desc:"아무 말도 하지 않겠다. 변호사를 불러달라" },
    ],
    results: {
      deny: {
        title: "부인해도 — 증거가 있습니다",
        color: "#f59e0b",
        body: `"몰랐다"는 주장은 가능하지만:

→ 수령 장소·전달 장소 모두 CCTV에 포착됨
→ SNS 채용 광고·연락 이력이 디지털 증거로 남음
→ "시급 ₩50,000" 고액 알바 — 의심할 수 있었다는 정황

법원에서 '미필적 고의(대충 알 수 있었다)'가 인정되면
총포법 위반 공범으로 처벌받습니다.

그래도 주장 자체는 할 수 있습니다.
변호사 도움이 반드시 필요한 상황입니다.`,
      },
      cooperate: {
        title: "가장 현명한 선택입니다",
        color: "#22c55e",
        body: `적극적 협조는 형량 감경의 핵심입니다.

→ 수사 협조 → 자수·자백 감경 적용 가능
→ 조직 윗선을 잡는 데 기여 → 추가 감경
→ 진짜로 몰랐다는 사실을 뒷받침하는 증거 확보 기회

협조 + 변호사 선임이 최선입니다.
법률구조공단 132에서 무료 국선 변호사를 신청하세요.`,
      },
      escape: {
        title: "절대 하면 안 됩니다 — 형량이 두 배가 됩니다",
        color: "#ef4444",
        body: `경찰 포위망에서 도주 시:

→ 체포 저항죄 추가 (형법 제136조)
→ 도주죄 추가
→ 어차피 도로·CCTV로 수분 내 재체포

도주는 '범행을 인식하고 있었다'는 증거로 활용됩니다.
이미 포위된 상황에서 도망은 형량만 늘립니다.`,
      },
      lawyer: {
        title: "정답입니다 — 헌법상 당연한 권리입니다",
        color: "#22c55e",
        body: `체포 즉시 변호인 조력권을 행사하는 것은
헌법 제12조가 보장하는 권리입니다.

→ "변호사를 요청합니다" 한마디로 조사 중단 가능
→ 변호사 없이 한 진술은 증거로 불리하게 활용될 수 있음
→ 국선 변호사 신청: 법률구조공단 132

아무 말도 하지 않는 것이 때로 가장 현명합니다.`,
      },
    },
    lesson: [
      { icon:"💰", title:"고액 알바 = 위험 신호", body:"시급 5만원 이상 단순 배달 알바는 마약·총기 운반 범죄에 악용되는 전형적인 수법입니다." },
      { icon:"⚖️", title:"'몰랐다'는 말만으로는 부족합니다", body:"미필적 고의가 인정되면 공범으로 처벌받습니다. 의심스러운 물건은 절대 운반하지 마세요." },
      { icon:"🧑‍⚖️", title:"체포되면 즉시 변호사를 요청하세요", body:"헌법상 권리입니다. 변호사 없이 한 진술은 불리하게 활용될 수 있습니다." },
    ],
  },
  {
    id: "raid",
    icon: "🚔",
    title: "거래 중 경찰 급습",
    subtitle: "판매자 미행하던 경찰이 거래 현장을 덮쳤다",
    color: "#3b82f6",
    situation: `중고 총기 판매자와 연락해 외진 창고에서
₩3,500,000에 직거래를 약속했습니다.

물건을 확인하는 순간 사방에서 경찰이 진입합니다.

"경찰입니다! 움직이지 마세요!"

판매자는 이미 수사망에 포착된 상태였고
거래 상대방(당신)도 함께 체포됩니다.`,
    choices: [
      { key:"resist", label:"저항하며 도망을 시도한다", desc:"일단 벗어나고 나서 생각한다" },
      { key:"comply", label:"즉시 손들고 지시에 따른다", desc:"저항하면 더 불리해진다" },
      { key:"explain", label:"바로 '구매자'라고 설명한다", desc:"나는 판매자가 아니라 피해자다" },
      { key:"silence", label:"아무 말도 안 하고 변호사를 요청한다", desc:"헌법상 권리를 행사한다" },
    ],
    results: {
      resist: {
        title: "가장 위험한 선택입니다",
        color: "#ef4444",
        body: `경찰 진압 과정에서 부상 위험이 있습니다.

법적으로도:
→ 공무집행방해죄 (형법 제136조): 5년 이하 징역
→ 체포 저항으로 형량 가중
→ 도주 = 범행 인식의 증거

이미 포위된 상황에서 저항은
신체적으로도, 법적으로도 최악의 결과를 낳습니다.`,
      },
      comply: {
        title: "올바른 첫 번째 행동입니다",
        color: "#22c55e",
        body: `순순히 지시에 따르는 것이 먼저입니다.

→ 공무집행방해죄 없음
→ 이후 조사에서 자신의 입장 설명 가능
→ 태도 불량이 없으면 구형량에 유리하게 작용

그 다음 단계:
"변호사를 선임하겠습니다"를 요청하세요.
이후 모든 진술은 변호사와 상담 후 하는 것이 최선입니다.`,
      },
      explain: {
        title: "설명은 할 수 있지만 — 즉각 효과는 없습니다",
        color: "#f59e0b",
        body: `현장에서 "나는 구매자"라고 말해도:

→ 경찰은 현장에서 석방하지 않습니다
→ 구매자도 총포법 위반 피의자입니다
→ 현장 진술이 이후 재판에서 불리하게 활용될 수 있음

설명보다는 "변호사를 요청합니다"가
법적으로 더 유리한 선택입니다.`,
      },
      silence: {
        title: "가장 현명한 법적 선택입니다",
        color: "#22c55e",
        body: `헌법 제12조: 누구든지 자기에게 불리한
진술을 강요당하지 않을 권리가 있습니다.

→ 묵비권 행사는 범죄 인정이 아닙니다
→ 변호사 없이 한 진술은 불리하게 쓰일 수 있습니다
→ "변호사 선임 전엔 진술하지 않겠습니다" 한마디

경찰 조사 중 반드시 기억할 한 문장:
"변호사를 요청합니다."`,
      },
    },
    lesson: [
      { icon:"🚔", title:"판매자 수사망은 구매자도 잡습니다", body:"불법 무기 판매자를 추적하는 수사에서 거래 상대방(구매자)도 함께 체포됩니다. '판매자만 잡힌다'는 건 착각입니다." },
      { icon:"🤫", title:"체포 시 가장 중요한 한마디", body:"'변호사를 요청합니다.' 이 말 하나가 이후 재판 결과를 크게 바꿀 수 있습니다." },
      { icon:"📵", title:"묵비권은 범죄 인정이 아닙니다", body:"변호사 없이 한 현장 진술은 재판에서 불리하게 쓰일 수 있습니다. 침묵은 권리입니다." },
    ],
  },
];

export default function WeaponDealAccidentPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Scenario | null>(null);
  const [phase, setPhase] = useState<"list" | "situation" | "choice" | "result" | "lesson">("list");
  const [choiceKey, setChoiceKey] = useState<ChoiceKey | null>(null);

  function reset() { setSelected(null); setPhase("list"); setChoiceKey(null); }

  const result = selected && choiceKey ? selected.results[choiceKey] : null;

  // 교훈 화면
  if (phase === "lesson" && selected) return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0a0606,#0a0a14)", padding:"40px 20px" }}>
      <div style={{ maxWidth:540, margin:"0 auto" }}>
        <div style={{ background:"#0f0f1a", border:`2px solid ${selected.color}`, borderRadius:24, padding:"28px 24px", marginBottom:16 }}>
          <div style={{ fontSize:48, textAlign:"center", marginBottom:12 }}>{selected.icon}</div>
          <h2 style={{ color:selected.color, fontSize:20, fontWeight:900, textAlign:"center", marginBottom:6 }}>핵심 교훈</h2>
          <p style={{ color:"#6b7280", fontSize:12, textAlign:"center", marginBottom:24 }}>{selected.title}</p>
          <div style={{ background:"#07070f", borderRadius:14, padding:"18px 20px", marginBottom:20 }}>
            {selected.lesson.map((it, i) => (
              <div key={i} style={{ display:"flex", gap:12, marginBottom: i < selected.lesson.length - 1 ? 16 : 0 }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{it.icon}</span>
                <div>
                  <p style={{ color:selected.color, fontSize:13, fontWeight:700, marginBottom:3 }}>{it.title}</p>
                  <p style={{ color:"#6b7280", fontSize:12, lineHeight:1.7, margin:0 }}>{it.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:"#0a0606", border:"1px solid #1a0a0a", borderRadius:14, padding:"14px 18px", marginBottom:20 }}>
            <p style={{ color:"#ef4444", fontSize:13, fontWeight:900, marginBottom:6 }}>⚖️ 공통 핵심 원칙</p>
            <p style={{ color:"#94a3b8", fontSize:12, lineHeight:1.8, margin:0 }}>
              불법 무기 거래에서 발생하는 모든 사고는<br/>
              <strong style={{ color:"#fbbf24" }}>처음부터 거래를 시도하지 않았다면</strong> 일어나지 않습니다.<br/>
              어떤 상황에서도 '정답'은 없으며,<br/>
              최선의 대처는 <strong style={{ color:"#22c55e" }}>즉시 변호사(132)에 연락하는 것</strong>입니다.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            <ReportNumber number="132" label="⚖️ 대한법률구조공단 (무료 상담)" bg="#0d1a30" color="#93c5fd" />
            <div style={{ marginTop:8 }}>
              <ReportNumber number="112" label="🚔 경찰청" bg="#1a1a2a" color="#94a3b8" />
            </div>
          </div>
          <button onClick={reset} style={{ width:"100%", background:"none", border:"1px solid #1a1a2a", borderRadius:14, padding:"12px 0", color:"#4a4a6a", fontSize:13, cursor:"pointer", marginBottom:10 }}>← 다른 시나리오 보기</button>
          <button onClick={() => router.push("/")} style={{ width:"100%", background:"none", border:"none", color:"#2a2a3a", fontSize:12, cursor:"pointer" }}>메인으로</button>
        </div>
      </div>
    </div>
  );

  // 결과 화면
  if (phase === "result" && result && selected) return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0a0606,#0a0a14)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:520, width:"100%" }}>
        <div style={{ background:"#0f0f1a", border:`2px solid ${result.color}`, borderRadius:24, padding:"28px 24px", marginBottom:16 }}>
          <h2 style={{ color:result.color, fontSize:17, fontWeight:900, textAlign:"center", marginBottom:16 }}>{result.title}</h2>
          <pre style={{ color:"#94a3b8", fontSize:13, lineHeight:1.9, whiteSpace:"pre-wrap", fontFamily:"inherit", marginBottom:20 }}>{result.body}</pre>
          <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
            <button onClick={() => setPhase("lesson")} style={{ background:`${result.color}22`, border:`1px solid ${result.color}55`, borderRadius:14, padding:"14px 0", color:result.color, fontWeight:900, fontSize:14, cursor:"pointer" }}>
              📌 핵심 교훈 보기
            </button>
            <button onClick={() => setPhase("choice")} style={{ background:"#0a0a14", border:"1px solid #1a1a2a", borderRadius:14, padding:"12px 0", color:"#4a4a6a", fontSize:13, cursor:"pointer" }}>
              ← 다시 선택하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // 선택지 화면
  if (phase === "choice" && selected) return (
    <div style={{ minHeight:"100vh", background:"#0a0606", padding:"40px 20px" }}>
      <div style={{ maxWidth:500, margin:"0 auto" }}>
        <div style={{ background:"#0f0808", border:`2px solid ${selected.color}55`, borderRadius:20, padding:"20px", marginBottom:20 }}>
          <p style={{ color:selected.color, fontSize:11, fontWeight:800, letterSpacing:2, marginBottom:12 }}>😱 상황</p>
          <pre style={{ color:"#94a3b8", fontSize:13, lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0 }}>{selected.situation}</pre>
        </div>
        <p style={{ color:"#64748b", fontSize:14, fontWeight:700, marginBottom:14 }}>어떻게 하시겠습니까?</p>
        <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
          {selected.choices.map((ch) => (
            <button key={ch.key} onClick={() => { setChoiceKey(ch.key); setPhase("result"); }} style={{ background:"#0f0808", border:`1px solid #2a1a1a`, borderRadius:16, padding:"16px 18px", textAlign:"left" as const, cursor:"pointer" }}>
              <p style={{ color:"#e2e8f0", fontWeight:700, fontSize:14, margin:0, marginBottom:3 }}>{ch.label}</p>
              <p style={{ color:"#6b7280", fontSize:12, margin:0 }}>{ch.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // 시나리오 상황 소개
  if (phase === "situation" && selected) return (
    <div style={{ minHeight:"100vh", background:"#0a0606", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:480, width:"100%" }}>
        <div style={{ background:"#0f0808", border:`2px solid ${selected.color}`, borderRadius:20, padding:"28px 24px", marginBottom:16, textAlign:"center" }}>
          <div style={{ fontSize:56, marginBottom:12 }}>{selected.icon}</div>
          <h2 style={{ color:selected.color, fontSize:18, fontWeight:900, marginBottom:8 }}>{selected.title}</h2>
          <p style={{ color:"#64748b", fontSize:13, marginBottom:24 }}>{selected.subtitle}</p>
          <div style={{ background:"#0a0606", borderRadius:14, padding:"16px 18px", marginBottom:24, textAlign:"left" as const }}>
            <pre style={{ color:"#94a3b8", fontSize:13, lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0 }}>{selected.situation}</pre>
          </div>
          <button onClick={() => setPhase("choice")} style={{ width:"100%", background:`linear-gradient(135deg,${selected.color}88,${selected.color})`, border:"none", borderRadius:14, padding:"16px 0", color:"#fff", fontWeight:900, fontSize:15, cursor:"pointer" }}>
            ⚖️ 대처법 선택하기
          </button>
        </div>
      </div>
    </div>
  );

  // 시나리오 목록
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0606,#060410)", padding:"40px 20px" }}>
      <div style={{ maxWidth:560, margin:"0 auto" }}>
        <button onClick={() => router.push("/")} style={{ background:"none", border:"none", color:"#555", fontSize:13, cursor:"pointer", marginBottom:24 }}>← 메인으로</button>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-block", background:"#ef444422", border:"1px solid #ef444455", borderRadius:20, padding:"4px 12px", marginBottom:12 }}>
            <span style={{ color:"#fca5a5", fontSize:11, fontWeight:800, letterSpacing:2 }}>⚠️ 실제 사고 유형 재현 — 교육 목적</span>
          </div>
          <h1 style={{ color:"#fff", fontSize:26, fontWeight:900, marginBottom:10 }}>⚠️ 무기 거래 중 사고</h1>
          <p style={{ color:"#64748b", fontSize:14, lineHeight:1.7 }}>
            불법 무기 거래 중 실제로 발생하는 3가지 사고 유형.<br/>
            각 상황에서 어떤 선택이 최선인지 직접 체험해보세요.
          </p>
        </div>

        <div style={{ display:"flex", flexDirection:"column" as const, gap:12, marginBottom:24 }}>
          {SCENARIOS.map((s) => (
            <button key={s.id} onClick={() => { setSelected(s); setPhase("situation"); }} style={{ background:"#0f0808", border:`1px solid ${s.color}44`, borderRadius:20, padding:"20px 22px", textAlign:"left" as const, cursor:"pointer" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:8 }}>
                <span style={{ fontSize:32 }}>{s.icon}</span>
                <div>
                  <p style={{ color:"#e2e8f0", fontWeight:800, fontSize:15, margin:0, marginBottom:3 }}>{s.title}</p>
                  <p style={{ color:"#6b7280", fontSize:12, margin:0 }}>{s.subtitle}</p>
                </div>
              </div>
              <div style={{ display:"inline-block", background:`${s.color}22`, border:`1px solid ${s.color}44`, borderRadius:20, padding:"3px 10px" }}>
                <span style={{ color:s.color, fontSize:10, fontWeight:700 }}>시나리오 체험 →</span>
              </div>
            </button>
          ))}
        </div>

        <div style={{ background:"#0f0808", border:"1px solid #2a1a1a", borderRadius:16, padding:"16px 20px" }}>
          <p style={{ color:"#ef4444", fontSize:12, fontWeight:800, marginBottom:8 }}>⚠️ 공통 경고</p>
          <p style={{ color:"#6b7280", fontSize:12, lineHeight:1.7, margin:0 }}>
            이 시뮬레이션의 모든 시나리오에서 공통적인 사실:<br/>
            <strong style={{ color:"#fbbf24" }}>불법 무기 거래를 시도하는 순간 이미 범죄입니다.</strong><br/>
            어떤 '사고'가 발생하더라도 법적 보호를 받기 어렵습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
