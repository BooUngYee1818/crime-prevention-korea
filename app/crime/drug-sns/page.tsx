"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReportNumber from "@/components/ReportNumber";

type Msg = { role: "dealer" | "user"; text: string; time: string };
type Phase = "intro" | "chat" | "hook" | "reveal";

const SCENARIOS = [
  {
    id: "diet",
    title: "다이어트약 SNS 판매",
    handle: "@diet_miracle_kr",
    avatar: "🌸",
    color: "#ec4899",
    tag: "10~30대 여성 타깃",
    desc: "\"부작용 없는 천연 다이어트약\"으로 접근 후 향정신성 의약품 판매",
    intro: "안녕하세요💕 팔로우 감사해요! 저도 6개월 전엔 68kg이었는데 지금은 51kg이에요. 비결 궁금하지 않으세요?",
    scripts: [
      "해외직구 다이어트 보조제예요 🌿 FDA 승인받은 천연 성분이고 부작용 전혀 없어요! 저도 3개월째 먹는 중인데 진짜 신기할 정도로 효과 좋아요",
      "가격은 1개월치 ₩89,000인데 지금 이벤트 중이라 3개월치 ₩198,000이에요! 택배로 보내드리고요, 계좌이체만 돼요 (세금 문제로 카드 안 받아요)",
      "후기 보실래요? 💕 저희 단톡방에 실제 후기 엄청 많아요. 초대해드릴게요! 입금하시면 바로 배송 출발이에요~",
      "걱정 마세요ㅎㅎ 저도 처음엔 반신반의했어요. 근데 진짜예요! 병원 처방도 필요 없고 그냥 드시면 돼요. 오늘까지만 이 가격이에요!",
    ],
  },
  {
    id: "stress",
    title: "스트레스 해소 '힐링템'",
    handle: "@healing_herb_official",
    avatar: "🌿",
    color: "#22c55e",
    tag: "20~40대 직장인 타깃",
    desc: "\"천연 허브\" \"아로마\" 명목으로 대마 성분 제품 판매",
    intro: "직장생활 힘드시죠? 저도 번아웃 왔었는데, 지금은 완전 달라졌어요. 천연 힐링 허브로 회복했거든요 🌿",
    scripts: [
      "해외 합법 허브예요. 국내에선 잘 모르는데 유럽에서는 스트레스 치료제로 쓰이는 거예요. 아로마 오일 형태라 향기 맡는 것만으로도 돼요",
      "가격은 소량 ₩120,000, 한달치 ₩350,000이에요. 직접 흡입하는 방법도 알려드리고 처음이라 걱정되시면 소량부터 드릴게요",
      "법적으로 문제없어요. 해외에서 합법이고 저도 2년째 쓰는 중이에요. 단, 세관 통과 문제로 포장을 아로마 오일로 해서 보내드려요",
      "후기 보내드릴게요. 근데 이건 카카오톡으로만 거래해요, SNS에 올리면 경쟁사들이 신고를 해서요. 카톡 ID 알려주세요!",
    ],
  },
  {
    id: "party",
    title: "파티용 '합법 클럽약'",
    handle: "@party_legal_kr",
    avatar: "💊",
    color: "#a855f7",
    tag: "10~20대 클럽/파티족 타깃",
    desc: "\"합법\" \"안전\" 강조하며 MDMA·케타민 등 향정신성 물질 판매",
    intro: "클럽 가시나요? 요즘 외국에서 다들 쓰는 합법 파티 서플리먼트 아세요? 에너지드링크보다 효과 좋고 부작용도 없어요",
    scripts: [
      "미국·네덜란드에서는 합법이에요. 그냥 에너지 보충제 같은 거예요. 클럽에서 한 번 써보면 왜 다들 찾는지 알 거예요",
      "처음엔 소량인 ₩50,000짜리로 해보세요. 효과 없으면 환불 가능해요. 단 현금이나 코인으로만 결제 받아요",
      "텔레그램으로 오세요, 거기서 주문 받아요. SNS는 차단당할 수 있어서요. @party_supply_kr 추가해주세요",
      "걱정 마요 진짜 안전해요ㅋㅋ 우리 단골들도 다 학생이랑 직장인이에요. 중독성도 없고 다음날 멀쩡해요",
    ],
  },
];

function now() { return new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }); }

export default function DrugSnsPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [scriptIdx, setScriptIdx] = useState(0);
  const scriptIdxRef = useRef(0);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const addDealer = useCallback((text: string) => {
    setMsgs(p => [...p, { role: "dealer", text, time: now() }]);
  }, []);

  function startChat(s: typeof SCENARIOS[0]) {
    setScenario(s);
    setMsgs([]);
    setScriptIdx(0);
    scriptIdxRef.current = 0;
    setPhase("chat");
    setTimeout(() => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        addDealer(s.intro);
        scriptIdxRef.current = 0;
      }, 1200);
    }, 500);
  }

  function sendMsg() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMsgs(p => [...p, { role: "user", text, time: now() }]);
    const idx = scriptIdxRef.current;
    if (idx >= scenario.scripts.length) {
      setTimeout(() => setPhase("hook"), 800);
      return;
    }
    setTimeout(() => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        addDealer(scenario.scripts[idx]);
        scriptIdxRef.current = idx + 1;
        setScriptIdx(idx + 1);
        if (idx + 1 >= scenario.scripts.length) setTimeout(() => setPhase("hook"), 1000);
      }, 1000 + Math.random() * 700);
    }, 400);
  }

  if (phase === "reveal") return (
    <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 520, width: "100%" }}>
        <div style={{ background: "linear-gradient(135deg,#1a0000,#2a0808)", border: "2px solid #ef4444", borderRadius: 24, padding: "32px 28px", marginBottom: 16 }}>
          <div style={{ fontSize: 52, textAlign: "center", marginBottom: 16 }}>🚔</div>
          <h2 style={{ color: "#ef4444", fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 16 }}>마약 SNS 유통 수법 해설</h2>
          <div style={{ background: "#1a0808", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
            {[
              { icon: "🌿", title: "\"천연\" \"합법\" \"해외승인\" — 모두 거짓", desc: "국내 향정신성의약품·마약류는 해외 합법 여부와 무관하게 소지·구매 시 처벌 대상입니다." },
              { icon: "💸", title: "계좌이체·코인만 받는 이유", desc: "추적 불가 결제 수단만 사용합니다. 환불도 없고, 주소·신원이 남지 않습니다." },
              { icon: "📱", title: "텔레그램·DM으로 유도", desc: "증거 삭제가 쉬운 채널로 이동시켜 수사를 피합니다." },
              { icon: "⚖️", title: "구매자도 처벌됩니다", desc: "\"몰랐다\"도 안 됩니다. 마약류 구매는 징역 5년 이하 또는 벌금 5천만원 이하입니다." },
            ].map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 14 : 0 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{it.icon}</span>
                <div>
                  <p style={{ color: "#fca5a5", fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{it.title}</p>
                  <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{it.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <ReportNumber number="182" label="📞 마약 신고 (경찰청 마약수사대)" bg="#1a0820" color="#f472b6" />
          <button onClick={() => router.push("/")} style={{ width: "100%", background: "none", border: "1px solid #2a1a1a", borderRadius: 14, padding: "12px 0", color: "#6b7280", fontSize: 13, cursor: "pointer" }}>← 메인으로 돌아가기</button>
        </div>
      </div>
    </div>
  );

  if (phase === "hook") return (
    <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%" }}>
        <div style={{ background: "#1a0000", border: "2px solid #ef4444", borderRadius: 20, padding: "28px 24px", marginBottom: 16 }}>
          <div style={{ fontSize: 48, textAlign: "center", marginBottom: 12 }}>🚨</div>
          <h2 style={{ color: "#ef4444", fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 10 }}>이건 마약 판매 접근입니다</h2>
          <p style={{ color: "#fca5a5", fontSize: 14, lineHeight: 1.8, textAlign: "center", marginBottom: 20 }}>
            실제로 이 채팅을 계속했다면 <strong style={{ color: "#f87171" }}>마약류 구매</strong>로 이어질 수 있었습니다.<br />
            구매자도 <strong style={{ color: "#f87171" }}>형사처벌 대상</strong>입니다.
          </p>
          <div style={{ background: "#111", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
            <p style={{ color: "#ef4444", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>🔴 이 대화에서 감지된 수법</p>
            {["\"천연\" \"합법\" 강조로 경계심 낮추기", "후기·SNS 커뮤니티로 신뢰 조작", "현금·코인 요구 (추적 불가)", "텔레그램 등 비공개 채널로 유도", "\"한정 수량\" \"오늘까지\" 압박"].map((t, i) => (
              <p key={i} style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.7, margin: 0 }}>⚠️ {t}</p>
            ))}
          </div>
          <button onClick={() => setPhase("reveal")} style={{ width: "100%", background: "linear-gradient(135deg,#7c3aed,#4c1d95)", border: "none", borderRadius: 14, padding: "14px 0", color: "#fff", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>수법 전체 해설 보기 →</button>
        </div>
      </div>
    </div>
  );

  if (phase === "chat") return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0a0a", display: "flex", flexDirection: "column" as const }}>
      <div style={{ background: "#111", borderBottom: "1px solid #1f1f1f", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "#555", fontSize: 18, cursor: "pointer" }}>←</button>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: scenario.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{scenario.avatar}</div>
        <div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: 0 }}>{scenario.handle}</p>
          <p style={{ color: scenario.color, fontSize: 11, margin: 0 }}>DM</p>
        </div>
        <div style={{ marginLeft: "auto", background: "#ef444422", border: "1px solid #ef444444", borderRadius: 20, padding: "3px 10px" }}>
          <span style={{ color: "#ef4444", fontSize: 10, fontWeight: 700 }}>⚠️ 교육용</span>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" as const, padding: 16, display: "flex", flexDirection: "column" as const, gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
            <div style={{ background: m.role === "user" ? scenario.color : "#1f1f1f", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px" }}>
              <p style={{ color: "#fff", fontSize: 13, margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.text}</p>
            </div>
            <p style={{ color: "#374151", fontSize: 9, margin: "2px 4px 0", textAlign: m.role === "user" ? "right" : "left" }}>{m.time}</p>
          </div>
        ))}
        {typing && (
          <div style={{ alignSelf: "flex-start", background: "#1f1f1f", borderRadius: "18px 18px 18px 4px", padding: "12px 16px" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#555", animation: `dot 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <style>{`@keyframes dot{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}`}</style>
      <div style={{ background: "#111", borderTop: "1px solid #1f1f1f", padding: "12px 16px", display: "flex", gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="메시지 입력..." style={{ flex: 1, background: "#1f1f1f", border: "1px solid #333", borderRadius: 22, padding: "10px 16px", color: "#fff", fontSize: 14, outline: "none" }} />
        <button onClick={sendMsg} style={{ width: 44, height: 44, borderRadius: "50%", background: scenario.color, border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>↑</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0a0a0a,#1a0828)", padding: "40px 20px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "#555", fontSize: 13, cursor: "pointer", marginBottom: 24 }}>← 메인으로</button>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ color: "#ef4444", fontSize: 11, fontWeight: 800, letterSpacing: 3, marginBottom: 8 }}>CRIME SIMULATION</p>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 900, marginBottom: 10 }}>💊 마약 SNS 유인 체험</h1>
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7 }}>SNS DM으로 접근하는 마약 판매 수법을<br />직접 체험하고 예방하세요.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
          {SCENARIOS.map(s => (
            <button key={s.id} onClick={() => startChat(s)} style={{ background: "#111", border: `1px solid ${s.color}44`, borderRadius: 18, padding: "20px 22px", textAlign: "left" as const, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 26 }}>{s.avatar}</span>
                <div>
                  <p style={{ color: "#fff", fontWeight: 800, fontSize: 14, margin: 0 }}>{s.title}</p>
                  <p style={{ color: s.color, fontSize: 11, margin: "2px 0 0" }}>{s.handle}</p>
                </div>
                <span style={{ marginLeft: "auto", background: `${s.color}22`, border: `1px solid ${s.color}44`, borderRadius: 20, padding: "3px 10px", color: s.color, fontSize: 10, fontWeight: 700 }}>{s.tag}</span>
              </div>
              <p style={{ color: "#555", fontSize: 12, margin: 0 }}>{s.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
