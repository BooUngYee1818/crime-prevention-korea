"use client";
import { useEffect, useState } from "react";

interface Stats {
  total: number;
  gender: Record<string, number>;
  age: Record<string, number>;
}

const AGE_ORDER = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];
const GENDER_EMOJI: Record<string, string> = { 남성: "👨", 여성: "👩", 비공개: "🔒" };
const AGE_COLOR = ["#3b82f6","#8b5cf6","#ec4899","#f59e0b","#22c55e","#ef4444"];

export default function StatsModal({ onClose }: { onClose: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => setStats({ total: 0, gender: {}, age: {} }))
      .finally(() => setLoading(false));
  }, []);

  const totalGender = Object.values(stats?.gender ?? {}).reduce((a, b) => a + b, 0) || 1;
  const totalAge = Object.values(stats?.age ?? {}).reduce((a, b) => a + b, 0) || 1;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99998,
      background: "rgba(0,0,0,0.92)",
      display: "flex", flexDirection: "column", alignItems: "center",
      overflowY: "auto", padding: "24px 20px",
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>📊 이용 통계</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "#6b7280",
            fontSize: 28, cursor: "pointer", lineHeight: 1,
          }}>×</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#6b7280", padding: 40 }}>불러오는 중...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* 총 이용자 */}
            <div style={{
              background: "linear-gradient(135deg,#0a1628,#0d1f3c)",
              border: "1px solid #1e3a5f", borderRadius: 20, padding: "24px",
              textAlign: "center",
            }}>
              <p style={{ color: "#60a5fa", fontSize: 13, marginBottom: 6 }}>누적 이용자</p>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 52, lineHeight: 1 }}>
                {(stats?.total ?? 0).toLocaleString()}
              </p>
              <p style={{ color: "#374151", fontSize: 12, marginTop: 6 }}>명이 체험했습니다</p>
            </div>

            {/* 성별 통계 */}
            <div style={{
              background: "#0d0d0d", border: "1px solid #1e1e1e",
              borderRadius: 20, padding: "20px",
            }}>
              <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>
                성별 분포
              </p>
              {["남성", "여성", "비공개"].map((g) => {
                const count = stats?.gender?.[g] ?? 0;
                const pct = Math.round((count / totalGender) * 100);
                return (
                  <div key={g} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ color: "#d1d5db", fontSize: 13 }}>{GENDER_EMOJI[g]} {g}</span>
                      <span style={{ color: "#9ca3af", fontSize: 13 }}>{count.toLocaleString()}명 ({pct}%)</span>
                    </div>
                    <div style={{ height: 8, background: "#1a1a1a", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 4,
                        width: `${pct}%`,
                        background: g === "남성" ? "#3b82f6" : g === "여성" ? "#ec4899" : "#6b7280",
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 연령대 통계 */}
            <div style={{
              background: "#0d0d0d", border: "1px solid #1e1e1e",
              borderRadius: 20, padding: "20px",
            }}>
              <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>
                연령대 분포
              </p>
              {AGE_ORDER.map((ag, i) => {
                const count = stats?.age?.[ag] ?? 0;
                const pct = Math.round((count / totalAge) * 100);
                return (
                  <div key={ag} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ color: "#d1d5db", fontSize: 13 }}>{ag}</span>
                      <span style={{ color: "#9ca3af", fontSize: 13 }}>{count.toLocaleString()}명 ({pct}%)</span>
                    </div>
                    <div style={{ height: 8, background: "#1a1a1a", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 4,
                        width: `${pct}%`,
                        background: AGE_COLOR[i],
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <p style={{ color: "#374151", fontSize: 11, textAlign: "center" }}>
              실시간 집계 · 개인정보 미수집
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
