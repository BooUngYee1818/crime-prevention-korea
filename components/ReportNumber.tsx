"use client";
import { useState } from "react";

interface ReportNumberProps {
  number: string;
  label: string;
  color?: string;
  bg?: string;
}

export default function ReportNumber({ number, label, color = "#fff", bg = "#1e293b" }: ReportNumberProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(number).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ background: bg, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: color, fontWeight: 800, fontSize: 14, margin: 0 }}>{label}</p>
        <p style={{ color: `${color}99`, fontSize: 12, margin: "2px 0 0", fontFamily: "monospace", letterSpacing: 1 }}>{number}</p>
      </div>
      <button
        onClick={copy}
        style={{
          background: copied ? "#22c55e22" : "#ffffff18",
          border: `1px solid ${copied ? "#22c55e" : "#ffffff30"}`,
          borderRadius: 10,
          padding: "6px 12px",
          color: copied ? "#22c55e" : color,
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          flexShrink: 0,
          transition: "all 0.2s",
          whiteSpace: "nowrap" as const,
        }}
      >
        {copied ? "✅ 복사됨" : "📋 번호 복사"}
      </button>
    </div>
  );
}
