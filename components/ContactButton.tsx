"use client";
import { useState } from "react";

const SUBJECT = encodeURIComponent("[범죄예방 체험관] 콘텐츠 제안");
const BODY = encodeURIComponent("안녕하세요,\n\n원하는 내용이나 개선 의견을 자유롭게 적어주세요 😊\n\n");
const TO = "itnlifecn@gmail.com";

const GMAIL_URL = `https://mail.google.com/mail/?view=cm&to=${TO}&su=${SUBJECT}&body=${BODY}`;
const NAVER_URL = `https://mail.naver.com/write/popup?to=${TO}&subject=${SUBJECT}&body=${BODY}`;
const MAILTO_URL = `mailto:${TO}?subject=${SUBJECT}&body=${BODY}`;

export default function ContactButton() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: 80, right: 24, zIndex: 9997 }}>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: -1 }} />
          <div style={{
            position: "absolute", bottom: "calc(100% + 8px)", right: 0,
            background: "#fff", borderRadius: 16,
            boxShadow: "0 8px 32px #00000025", border: "1px solid #f1f5f9",
            overflow: "hidden", minWidth: 200,
          }}>
            <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid #f1f5f9" }}>
              <p style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>✉️ 의견·제안 보내기</p>
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{TO}</p>
            </div>
            {[
              { icon: "🔵", label: "Gmail로 보내기", url: GMAIL_URL },
              { icon: "🟢", label: "네이버메일로 보내기", url: NAVER_URL },
              { icon: "📧", label: "기본 메일앱으로", url: MAILTO_URL },
            ].map(({ icon, label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 16px", textDecoration: "none",
                  color: "#1e293b", fontSize: 13, fontWeight: 500,
                  borderBottom: "1px solid #f8fafc",
                  background: "#fff",
                }}
              >
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        title="의견 보내기"
        style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(255,255,255,0.92)",
          border: "1.5px solid #e2e8f0",
          cursor: "pointer", fontSize: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px #00000018",
          backdropFilter: "blur(12px)",
        }}
      >
        ✉️
      </button>
    </div>
  );
}
