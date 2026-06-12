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
            <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid #f1f5f9" }}>
              <p style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>✉️ 의견·제안 보내기</p>
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{TO}</p>

              {/* 개인정보 안내 */}
              <div style={{
                marginTop: 10, background: "#fef9ec", border: "1px solid #fde68a",
                borderRadius: 10, padding: "8px 10px",
              }}>
                <p style={{ fontSize: 11, color: "#92400e", fontWeight: 700, marginBottom: 3 }}>
                  ⚠️ 개인정보를 적지 말아주세요
                </p>
                <p style={{ fontSize: 10, color: "#b45309", lineHeight: 1.6 }}>
                  이름·연락처·계좌번호 등<br />개인정보는 포함하지 마세요.
                </p>
              </div>

              {/* 국가기관 안내 */}
              <div style={{
                marginTop: 6, background: "#eff6ff", border: "1px solid #bfdbfe",
                borderRadius: 10, padding: "8px 10px",
              }}>
                <p style={{ fontSize: 11, color: "#1d4ed8", fontWeight: 700, marginBottom: 3 }}>
                  🏛️ 경찰·검찰·국가기관 관계자분께
                </p>
                <p style={{ fontSize: 10, color: "#3b82f6", lineHeight: 1.6 }}>
                  소속 기관명과 간단한 문의 목적만<br />알려주시면 빠르게 답변드리겠습니다.
                </p>
              </div>
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
