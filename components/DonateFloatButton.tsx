"use client";
import { useState } from "react";

const KAKAOPAY_URL = "https://qr.kakaopay.com/Ej8RbqcQf";

export default function DonateFloatButton() {
  const [open, setOpen] = useState(false);

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

            {/* 카카오페이 QR 후원 */}
            <a href={KAKAOPAY_URL} target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                width: "100%", padding: "10px 0", borderRadius: 12, marginBottom: 8,
                background: "#fee500", color: "#3c1e1e", fontWeight: 900, fontSize: 13,
                textDecoration: "none", border: "none", cursor: "pointer",
              }}>
              💛 카카오페이로 후원하기
            </a>
            <p style={{ color: "#4b5563", fontSize: 10, textAlign: "center", marginBottom: 8 }}>
              📱 카카오페이 앱으로 연결됩니다<br />금액은 자유롭게 입력하시면 돼요
            </p>

          </div>
        </>
      )}

      {!open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: 0,
          background: "rgba(20,83,45,0.95)", color: "#86efac",
          fontSize: 11, fontWeight: 600, borderRadius: 10,
          padding: "5px 10px", whiteSpace: "nowrap",
          boxShadow: "0 2px 8px #00000030",
          pointerEvents: "none",
        }}>
          후원은 자유입니다 😊
        </div>
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
