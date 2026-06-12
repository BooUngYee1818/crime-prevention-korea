"use client";
import { useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

const CLIENT_KEY = "test_ck_ma60RZblrqYP5kbBMkvErwzYWBn1";
const AMOUNTS = [1000, 3000, 5000, 10000];

export default function DonateFloatButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function donate(amount: number) {
    if (loading) return;
    setLoading(true);
    try {
      const tossPayments = await loadTossPayments(CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: `donor_${Date.now()}` });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: amount },
        orderId: `donate_${Date.now()}`,
        orderName: "범죄예방 체험관 후원",
        successUrl: `${window.location.origin}/donate/success`,
        failUrl: `${window.location.origin}/crime`,
        card: { useEscrow: false, flowMode: "DEFAULT", useCardPoint: false, useAppCardOnly: false },
      });
    } catch (e: unknown) {
      if (e && typeof e === "object" && "code" in e && (e as { code: string }).code !== "USER_CANCEL") {
        alert("결제 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: 80, left: 24, zIndex: 9997 }}>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: -1 }} />
          <div style={{
            position: "absolute", bottom: "calc(100% + 8px)", left: 0,
            background: "#0d1a0d", border: "1px solid #22c55e44",
            borderRadius: 18, padding: "14px 14px 10px",
            boxShadow: "0 8px 32px #00000040", minWidth: 190,
          }}>
            <p style={{ color: "#4ade80", fontSize: 12, fontWeight: 900, marginBottom: 4 }}>💚 후원하기</p>
            <p style={{ color: "#6b7280", fontSize: 10, lineHeight: 1.6, marginBottom: 10 }}>
              AI 범죄예방 개발에 도움이 됩니다<br />강제가 아닌 자유롭게 참여해주세요
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {AMOUNTS.map(a => (
                <button key={a} onClick={() => donate(a)} disabled={loading}
                  style={{
                    padding: "8px 4px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                    background: "#0a1a0a", color: "#86efac",
                    border: "1px solid #22c55e44", cursor: "pointer",
                  }}>
                  {a.toLocaleString()}원
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <button onClick={() => setOpen(o => !o)} title="후원하기"
        style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(20,83,45,0.95)",
          border: "1.5px solid #22c55e66",
          cursor: "pointer", fontSize: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px #00000030",
          backdropFilter: "blur(12px)",
        }}>
        💚
      </button>
    </div>
  );
}
