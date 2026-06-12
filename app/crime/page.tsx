"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, ChevronRight, Phone } from "lucide-react";
import { CRIME_SCENARIOS } from "@/lib/crimes";

const CATEGORY_LABELS: Record<string, string> = {
  "family-impersonation": "보이스피싱",
  "prosecutor-impersonation": "기관 사칭",
  "romance-scam": "로맨스 스캠",
  "investment-scam": "투자 사기",
  "loan-fraud": "대출 사기",
  "delivery-scam": "스미싱",
  "kakaotalk-impersonation": "메신저 사기",
  "used-goods-scam": "중고거래 사기",
  "illegal-gambling": "불법 도박",
};

const REPORT_NUMBERS = [
  { label: "경찰청", number: "112", color: "#2563eb" },
  { label: "금융감독원", number: "1332", color: "#0891b2" },
  { label: "인터넷진흥원", number: "118", color: "#059669" },
  { label: "도박중독 상담", number: "1336", color: "#7c3aed" },
];

export default function CrimeCenterPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", color: "#1e293b" }}>

      {/* 헤더 */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", gap: 12,
        padding: "0 40px", height: 60,
        boxShadow: "0 1px 8px #0000000a",
      }}>
        <button
          onClick={() => router.push("/")}
          style={{ padding: 8, background: "none", border: "none", cursor: "pointer", color: "#64748b",
            display: "flex", alignItems: "center", borderRadius: 8 }}
        >
          <ArrowLeft size={18} />
        </button>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: "linear-gradient(135deg, #2563eb, #4f46e5)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Shield size={14} color="#fff" />
        </div>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>범죄 예방 센터</h1>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "40px 40px" }}>

        {/* 안내 배너 */}
        <div style={{
          background: "linear-gradient(135deg, #eff6ff, #f0fdf4)",
          border: "1px solid #bfdbfe", borderRadius: 20, padding: "20px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 40, flexWrap: "wrap", gap: 16,
          boxShadow: "0 2px 12px #2563eb0a",
        }}>
          <div>
            <p style={{ color: "#1d4ed8", fontWeight: 700, fontSize: 15, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={16} color="#2563eb" /> 이 프로그램은 완전 무료입니다
            </p>
            <p style={{ color: "#3b82f6", fontSize: 13, lineHeight: 1.6 }}>
              실제처럼 체험하고 범죄 수법을 미리 알아두세요.{" "}
              <strong style={{ color: "#1d4ed8" }}>실제 돈은 절대 나가지 않습니다.</strong>
            </p>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {REPORT_NUMBERS.map((r) => (
              <a key={r.number} href={`tel:${r.number}`} style={{ textDecoration: "none", textAlign: "center" }}>
                <p style={{ color: "#94a3b8", fontSize: 10, marginBottom: 2 }}>{r.label}</p>
                <p style={{ color: r.color, fontWeight: 900, fontSize: 22 }}>{r.number}</p>
              </a>
            ))}
          </div>
        </div>

        {/* 섹션 제목 */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>체험할 시나리오를 선택하세요</p>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: "#0f172a" }}>9가지 범죄 시나리오</h2>
        </div>

        {/* 시나리오 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 40 }}>
          {CRIME_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => router.push(scenario.id === "illegal-gambling" ? "/gambling" : `/crime/${scenario.id}`)}
              style={{
                display: "flex", alignItems: "center", gap: 18,
                background: "#fff", borderRadius: 20, padding: "18px 22px",
                border: "1px solid #f1f5f9", cursor: "pointer", textAlign: "left",
                transition: "all 0.2s", boxShadow: "0 2px 10px #0000000a",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 6px 24px ${scenario.color}18`;
                e.currentTarget.style.borderColor = scenario.color + "40";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 10px #0000000a";
                e.currentTarget.style.borderColor = "#f1f5f9";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: scenario.color + "14",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
              }}>
                {scenario.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                  <span style={{ color: "#0f172a", fontWeight: 700, fontSize: 15 }}>{scenario.title}</span>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700,
                    background: scenario.color + "14", color: scenario.color,
                    border: `1px solid ${scenario.color}28`,
                  }}>
                    {CATEGORY_LABELS[scenario.id] ?? "불법 도박"}
                  </span>
                  {scenario.targetAge === "senior" && (
                    <span style={{
                      fontSize: 10, padding: "2px 8px", borderRadius: 20,
                      background: "#fff7ed", color: "#c2410c",
                      border: "1px solid #fed7aa", fontWeight: 700,
                    }}>
                      ⚠️ 어르신 주의
                    </span>
                  )}
                </div>
                <p style={{ color: "#64748b", fontSize: 13 }}>{scenario.subtitle}</p>
                <p style={{ color: "#94a3b8", fontSize: 11, marginTop: 3 }}>{scenario.reveal.stats}</p>
              </div>
              <ChevronRight size={16} color="#cbd5e1" style={{ flexShrink: 0 }} />
            </button>
          ))}
        </div>

        {/* 신고 번호 */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: 20, padding: "24px 28px",
          boxShadow: "0 2px 12px #0000000a",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Phone size={14} color="#dc2626" />
            <p style={{ color: "#dc2626", fontWeight: 700, fontSize: 13 }}>피해 신고 및 상담</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {REPORT_NUMBERS.map((item) => (
              <a key={item.number} href={`tel:${item.number}`} style={{
                background: "#f8fafc", borderRadius: 12, padding: "14px 16px",
                textDecoration: "none", display: "block",
                border: "1px solid #f1f5f9", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = item.color + "0a";
                e.currentTarget.style.borderColor = item.color + "30";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.borderColor = "#f1f5f9";
              }}>
                <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>{item.label}</p>
                <p style={{ color: item.color, fontWeight: 900, fontSize: 26 }}>{item.number}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
