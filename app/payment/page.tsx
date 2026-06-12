"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Zap, Crown } from "lucide-react";

const PLANS = [
  {
    id: "monthly",
    name: "월간 구독",
    price: "9,900원",
    period: "/ 월",
    features: ["무제한 AI 채팅", "모든 캐릭터 스타일", "이모티콘 100개 무료", "광고 없음"],
    icon: Zap,
    popular: false,
  },
  {
    id: "yearly",
    name: "연간 구독",
    price: "79,000원",
    period: "/ 년",
    subtext: "월 6,583원 (34% 할인)",
    features: ["무제한 AI 채팅", "모든 캐릭터 스타일", "이모티콘 500개 무료", "광고 없음", "신규 기능 우선 이용"],
    icon: Crown,
    popular: true,
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("yearly");
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("결제 오류: " + (data.error || "알 수 없는 오류"));
      }
    } catch {
      alert("결제 연결에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#0d0d0d" }}>

      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "52px 20px 16px" }}>
        <button onClick={() => router.back()} style={{ padding: 8, background: "none", border: "none", cursor: "pointer", color: "#888" }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>구독 플랜</h1>
      </div>

      {/* 타이틀 */}
      <div style={{ padding: "0 20px 24px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 8 }}>
          무제한으로<br />대화하세요
        </h2>
        <p style={{ fontSize: 13, color: "#555" }}>무료 체험이 끝났어요. 구독하면 계속 이용할 수 있어요.</p>
      </div>

      {/* 플랜 카드 */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selected === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              style={{
                position: "relative",
                display: "flex", flexDirection: "column", gap: 12,
                padding: "16px", borderRadius: 20, textAlign: "left",
                background: isSelected ? "#1a0a2e" : "#1a1a1a",
                border: isSelected ? "2px solid #534AB7" : "1px solid #2a2a2a",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -12, right: 14,
                  background: "#534AB7", color: "#fff",
                  fontSize: 11, fontWeight: 700,
                  padding: "3px 12px", borderRadius: 20,
                }}>
                  인기
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={18} color="#8b7cf8" />
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{plan.name}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>{plan.price}</span>
                  <span style={{ fontSize: 12, color: "#555" }}>{plan.period}</span>
                </div>
              </div>
              {plan.subtext && (
                <p style={{ fontSize: 12, color: "#8b7cf8", marginTop: -4 }}>{plan.subtext}</p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Check size={13} color="#8b7cf8" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#ccc" }}>{f}</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* 결제 버튼 */}
      <div style={{ padding: "24px 20px 40px" }}>
        <button
          onClick={handlePay}
          disabled={loading}
          style={{
            width: "100%", padding: "16px 0", borderRadius: 18,
            background: loading ? "#2a2a2a" : "#534AB7",
            color: "#fff", fontWeight: 700, fontSize: 15,
            border: "none", cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}
        >
          {loading ? "연결 중..." : "구독 시작하기"}
        </button>
        <p style={{ textAlign: "center", fontSize: 11, color: "#444", marginTop: 10 }}>
          언제든지 해지 가능 · 안전한 결제
        </p>
      </div>
    </div>
  );
}
