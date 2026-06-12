"use client";
import { useRef, useState } from "react";

interface Props {
  onClose: () => void;
}

const DONATE_AMOUNTS = [
  { label: "🪙 소액 후원", amount: 1000 },
  { label: "☕ 커피 한 잔", amount: 3000 },
  { label: "🌟 특별 후원", amount: 5000 },
  { label: "💛 든든한 후원", amount: 10000 },
];

export default function Certificate({ onClose }: Props) {
  const certRef = useRef<HTMLDivElement>(null);
  const [donating, setDonating] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const today = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

  async function handleDonate(amount: number) {
    if (donating) return;
    setDonating(true);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "결제 연결에 실패했습니다.");
    } catch {
      alert("잠시 후 다시 시도해주세요.");
    } finally {
      setDonating(false);
    }
  }

  function handlePrint() {
    const el = certRef.current;
    if (!el) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>범죄예방 체험 상장</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { background:#fff; display:flex; justify-content:center; align-items:center; min-height:100vh; font-family:'Apple SD Gothic Neo',sans-serif; }
      @media print { body { margin:0; } }
    </style></head><body>${el.outerHTML}</body></html>`;
    const w = window.open("", "_blank", "width=800,height=600");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 300);
  }

  const finalAmount = customAmount ? parseInt(customAmount.replace(/,/g, "")) : selectedAmount;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      background: "rgba(0,0,0,0.92)",
      overflowY: "auto", padding: "24px 16px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
    }}>
      {/* 닫기 */}
      <button onClick={onClose} style={{
        alignSelf: "flex-end", background: "none", border: "none",
        color: "#666", fontSize: 28, cursor: "pointer", lineHeight: 1,
      }}>×</button>

      {/* ── 상장 ── */}
      <div ref={certRef} style={{
        width: "100%", maxWidth: 520,
        background: "#fffdf5",
        border: "6px double #c8a96e",
        borderRadius: 4,
        padding: "32px 28px",
        textAlign: "center",
        fontFamily: "'Apple SD Gothic Neo', 'Noto Serif KR', serif",
        boxShadow: "0 8px 40px #00000040",
        position: "relative",
      }}>
        {/* 금박 코너 장식 */}
        {["top:4px;left:4px", "top:4px;right:4px", "bottom:4px;left:4px", "bottom:4px;right:4px"].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", width: 18, height: 18,
            ...Object.fromEntries(pos.split(";").map(p => p.split(":"))),
            fontSize: 14, lineHeight: "18px",
          }}>✦</div>
        ))}

        <div style={{ fontSize: 28, marginBottom: 4 }}>🏅</div>
        <p style={{ fontSize: 11, color: "#a07840", letterSpacing: 6, marginBottom: 2 }}>CERTIFICATE OF AWARENESS</p>
        <h1 style={{
          fontSize: 28, fontWeight: 900, color: "#1a1a1a",
          letterSpacing: 4, marginBottom: 16,
          borderBottom: "2px solid #c8a96e", paddingBottom: 12,
        }}>상 장</h1>

        <div style={{
          background: "#fff8e8", border: "1px solid #e8d5a0",
          borderRadius: 8, padding: "12px 16px", marginBottom: 16,
        }}>
          <p style={{ fontSize: 13, color: "#a07840", marginBottom: 6 }}>수 상 부 문</p>
          <p style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", letterSpacing: 2 }}>
            보이스피싱 예방 우수 체험자
          </p>
        </div>

        <p style={{ fontSize: 13, color: "#444", lineHeight: 2.0, marginBottom: 16 }}>
          위 분은 범죄예방 체험관 시뮬레이션에서<br />
          보이스피싱 범죄의 유혹에 굴하지 않고<br />
          <strong style={{ color: "#c8511a" }}>스스로의 판단으로 송금을 거부</strong>하였기에<br />
          이 상장을 드립니다.
        </p>

        <div style={{
          display: "flex", justifyContent: "center", gap: 16,
          marginBottom: 20, flexWrap: "wrap",
        }}>
          {["🚫 송금 거부 완료", "🛡️ 범죄 예방 성공", "✅ 체험 수료"].map(b => (
            <div key={b} style={{
              background: "#f0f9e8", border: "1px solid #86c840",
              borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#3a7a00",
            }}>{b}</div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>{today}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ height: 1, flex: 1, background: "#ddd" }} />
          <p style={{ fontSize: 13, fontWeight: 700, color: "#555", whiteSpace: "nowrap" }}>
            범죄예방 체험관
          </p>
          <div style={{ height: 1, flex: 1, background: "#ddd" }} />
        </div>
        <p style={{ fontSize: 10, color: "#bbb", marginTop: 6 }}>crime-prevention-korea.vercel.app</p>
      </div>

      {/* 인쇄 버튼 */}
      <button onClick={handlePrint} style={{
        width: "100%", maxWidth: 520, padding: "13px 0",
        background: "#1a1a1a", color: "#fff", border: "1px solid #333",
        borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        🖨️ 상장 인쇄하기
      </button>

      {/* ── 후원 섹션 ── */}
      <div style={{
        width: "100%", maxWidth: 520,
        background: "#0d1a0d", border: "1px solid #22c55e44",
        borderRadius: 20, padding: "20px 18px",
      }}>
        <p style={{ color: "#4ade80", fontWeight: 900, fontSize: 16, marginBottom: 4 }}>
          💚 이 서비스를 후원해주세요
        </p>
        <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.8, marginBottom: 16 }}>
          작은 후원이 제가 범죄 예방을 할 수 있는<br />
          <strong style={{ color: "#86efac" }}>AI 프로그램 개발에 큰 도움</strong>이 됩니다.<br />
          강제가 아닌 자유롭게 참여해주세요 🙏
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {DONATE_AMOUNTS.map(({ label, amount }) => (
            <button key={amount} onClick={() => setSelectedAmount(amount)}
              style={{
                padding: "10px 8px", borderRadius: 12, fontSize: 12, fontWeight: 700,
                cursor: "pointer", textAlign: "center",
                background: selectedAmount === amount ? "#166534" : "#0a1a0a",
                color: selectedAmount === amount ? "#4ade80" : "#9ca3af",
                border: `1px solid ${selectedAmount === amount ? "#22c55e" : "#1a2a1a"}`,
                transition: "all 0.15s",
              }}>
              <div>{label}</div>
              <div style={{ fontSize: 14, marginTop: 2 }}>{amount.toLocaleString()}원</div>
            </button>
          ))}
        </div>

        {/* 직접 입력 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
          <input
            type="number"
            placeholder="직접 입력 (원)"
            value={customAmount}
            onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 12,
              background: "#0a1a0a", border: "1px solid #1a2a1a",
              color: "#fff", fontSize: 13, outline: "none",
            }}
          />
        </div>

        <button
          onClick={() => finalAmount && finalAmount >= 1000 && handleDonate(finalAmount)}
          disabled={donating || !finalAmount || finalAmount < 1000}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 14,
            background: finalAmount && finalAmount >= 1000 ? "#16a34a" : "#1a2a1a",
            color: finalAmount && finalAmount >= 1000 ? "#fff" : "#4b5563",
            border: "none", fontSize: 15, fontWeight: 900, cursor: "pointer",
            transition: "all 0.15s",
          }}>
          {donating ? "결제 연결 중..." : `💳 ${finalAmount ? finalAmount.toLocaleString() + "원 후원하기" : "금액을 선택해주세요"}`}
        </button>

        <p style={{ color: "#374151", fontSize: 10, textAlign: "center", marginTop: 8 }}>
          🔒 Stripe 보안 결제 · 국내외 Visa·Mastercard·해외카드 모두 가능 · 최소 1,000원
        </p>
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}
