"use client";
import { useState, useEffect } from "react";

export interface UserProfile {
  gender: "남성" | "여성" | "비공개";
  ageGroup: "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상";
}

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const AGE_GROUPS = ["10대", "20대", "30대", "40대", "50대", "60대 이상"] as const;
const GENDERS = ["남성", "여성", "비공개"] as const;

export default function ProfileModal({ onComplete }: Props) {
  const [gender, setGender] = useState<UserProfile["gender"] | null>(null);
  const [ageGroup, setAgeGroup] = useState<UserProfile["ageGroup"] | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleStart() {
    if (!gender || !ageGroup || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender, ageGroup }),
      });
    } catch { /* 통계 실패해도 계속 */ }
    const profile: UserProfile = { gender, ageGroup };
    localStorage.setItem("user_profile", JSON.stringify(profile));
    onComplete(profile);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(0,0,0,0.95)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 20px",
    }}>
      <div style={{
        width: "100%", maxWidth: 420,
        background: "#0d0d0d", border: "1px solid #1e1e1e",
        borderRadius: 24, padding: "28px 24px",
        display: "flex", flexDirection: "column", gap: 24,
      }}>
        {/* 헤더 */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🛡️</div>
          <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 20, marginBottom: 6 }}>
            범죄예방 체험관
          </h2>
          <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}>
            시작 전에 간단한 정보를 알려주세요.<br />
            통계 목적으로만 사용됩니다.
          </p>
        </div>

        {/* 성별 */}
        <div>
          <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>
            성별
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {GENDERS.map((g) => (
              <button key={g} onClick={() => setGender(g)} style={{
                flex: 1, padding: "12px 0", borderRadius: 14, fontSize: 14, fontWeight: 700,
                cursor: "pointer", transition: "all 0.15s",
                background: gender === g ? "#1d4ed8" : "#1a1a1a",
                color: gender === g ? "#fff" : "#6b7280",
                border: `1.5px solid ${gender === g ? "#3b82f6" : "#2a2a2a"}`,
              }}>
                {g === "남성" ? "👨 남성" : g === "여성" ? "👩 여성" : "🔒 비공개"}
              </button>
            ))}
          </div>
        </div>

        {/* 연령대 */}
        <div>
          <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>
            연령대
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {AGE_GROUPS.map((ag) => (
              <button key={ag} onClick={() => setAgeGroup(ag)} style={{
                padding: "12px 0", borderRadius: 14, fontSize: 14, fontWeight: 700,
                cursor: "pointer", transition: "all 0.15s",
                background: ageGroup === ag ? "#166534" : "#1a1a1a",
                color: ageGroup === ag ? "#4ade80" : "#6b7280",
                border: `1.5px solid ${ageGroup === ag ? "#22c55e" : "#2a2a2a"}`,
              }}>
                {ag}
              </button>
            ))}
          </div>
        </div>

        {/* 시작 버튼 */}
        <button
          onClick={handleStart}
          disabled={!gender || !ageGroup || submitting}
          style={{
            width: "100%", padding: "16px 0", borderRadius: 16,
            fontSize: 16, fontWeight: 900,
            background: gender && ageGroup ? "linear-gradient(135deg,#1d4ed8,#7c3aed)" : "#1a1a1a",
            color: gender && ageGroup ? "#fff" : "#374151",
            border: "none", cursor: gender && ageGroup ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
        >
          {submitting ? "저장 중..." : "🚀 체험 시작하기"}
        </button>

        <p style={{ color: "#374151", fontSize: 10, textAlign: "center", marginTop: -12 }}>
          개인정보는 수집하지 않으며, 통계 집계에만 활용됩니다
        </p>
      </div>
    </div>
  );
}
