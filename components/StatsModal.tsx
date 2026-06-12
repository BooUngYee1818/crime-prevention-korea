"use client";
import { useEffect, useState } from "react";

interface Stats {
  total: number;
  gender: Record<string, number>;
  age: Record<string, number>;
}

interface GuestEntry {
  id: string;
  message: string;
  gender: string;
  ageGroup: string;
  createdAt: number;
}

const AGE_ORDER = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];
const AGE_COLOR = ["#3b82f6","#8b5cf6","#ec4899","#f59e0b","#22c55e","#ef4444"];
const GENDER_EMOJI: Record<string, string> = { 남성: "👨", 여성: "👩", 비공개: "🔒" };
const GENDER_COLOR: Record<string, string> = { 남성: "#3b82f6", 여성: "#ec4899", 비공개: "#6b7280" };

function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "방금";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default function StatsModal({ onClose }: { onClose: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [msg, setMsg] = useState("");
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => setStats({ total: 0, gender: {}, age: {} }))
      .finally(() => setLoadingStats(false));

    fetch("/api/guestbook")
      .then(r => r.json())
      .then(d => setEntries(d.entries ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoadingEntries(false));
  }, []);

  const totalGender = Object.values(stats?.gender ?? {}).reduce((a, b) => a + b, 0) || 1;
  const totalAge = Object.values(stats?.age ?? {}).reduce((a, b) => a + b, 0) || 1;

  async function handleSubmit() {
    if (!msg.trim() || !gender || !ageGroup) {
      setSubmitError("메시지, 성별, 나잇대를 모두 입력해주세요.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg.trim(), gender, ageGroup }),
      });
      const data = await res.json();
      if (data.ok) {
        setSubmitDone(true);
        setMsg("");
        setGender("");
        setAgeGroup("");
        if (data.entry) setEntries(prev => [data.entry, ...prev]);
      }
    } catch {
      setSubmitError("전송 실패. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 99998,
        background: "rgba(0,0,0,0.88)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      {/* 바텀시트 팝업 */}
      <div style={{
        width: "100%", maxWidth: 480,
        background: "#0a0a0a",
        border: "1px solid #1e1e1e",
        borderRadius: "24px 24px 0 0",
        maxHeight: "90vh", overflowY: "auto",
        padding: "0 0 40px",
      }}>
        {/* 드래그 핸들 */}
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#2a2a2a" }} />
        </div>

        {/* 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 20px" }}>
          <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 20, margin: 0 }}>📊 이용 통계 & 방명록</h2>
          <button onClick={onClose} style={{
            background: "#1a1a1a", border: "1px solid #2a2a2a",
            color: "#6b7280", width: 32, height: 32, borderRadius: "50%",
            cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 14 }}>

          {loadingStats ? (
            <div style={{ textAlign: "center", color: "#6b7280", padding: 40 }}>불러오는 중...</div>
          ) : (
            <>
              {/* 총 이용자 */}
              <div style={{
                background: "linear-gradient(135deg,#0a1628,#0d1f3c)",
                border: "1px solid #1e3a5f", borderRadius: 20, padding: "24px",
                textAlign: "center",
              }}>
                <p style={{ color: "#60a5fa", fontSize: 13, marginBottom: 6 }}>누적 체험자</p>
                <p style={{ color: "#fff", fontWeight: 900, fontSize: 52, lineHeight: 1 }}>
                  {(stats?.total ?? 0).toLocaleString()}
                </p>
                <p style={{ color: "#4b7ab5", fontSize: 12, marginTop: 8 }}>명이 범죄 수법을 체험했습니다</p>
                <div style={{ marginTop: 14, padding: "10px 16px", background: "#0d2a4a", borderRadius: 12, display: "inline-block" }}>
                  <p style={{ color: "#22c55e", fontSize: 13, fontWeight: 700 }}>
                    🛡 추정 예방 인원: {Math.floor((stats?.total ?? 0) * 0.73).toLocaleString()}명
                  </p>
                  <p style={{ color: "#4b7ab5", fontSize: 11, marginTop: 2 }}>체험 후 설문 기준 73% 예방 효과</p>
                </div>
              </div>

              {/* 성별 통계 */}
              <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 20, padding: "20px" }}>
                <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>성별 분포</p>
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
                          height: "100%", borderRadius: 4, width: `${pct}%`,
                          background: GENDER_COLOR[g], transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 연령대 통계 */}
              <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 20, padding: "20px" }}>
                <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>연령대 분포</p>
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
                          height: "100%", borderRadius: 4, width: `${pct}%`,
                          background: AGE_COLOR[i], transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── 방명록 ── */}
          <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 20, padding: "20px" }}>
            <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>
              💬 방명록 — 익명으로 한 마디
            </p>

            {submitDone ? (
              <div style={{ background: "#0a2a14", border: "1px solid #22c55e44", borderRadius: 14, padding: "16px", textAlign: "center", marginBottom: 16 }}>
                <p style={{ color: "#22c55e", fontWeight: 700, fontSize: 14 }}>✅ 등록되었습니다!</p>
                <button onClick={() => setSubmitDone(false)} style={{ marginTop: 8, background: "none", border: "none", color: "#4b7ab5", fontSize: 12, cursor: "pointer" }}>
                  한 번 더 쓰기
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    style={{
                      flex: 1, padding: "9px 10px", borderRadius: 10, fontSize: 13,
                      background: "#1a1a1a", border: "1px solid #2a2a2a", color: gender ? "#fff" : "#6b7280",
                      outline: "none", cursor: "pointer",
                    }}
                  >
                    <option value="" disabled>성별 선택</option>
                    <option value="남성">👨 남성</option>
                    <option value="여성">👩 여성</option>
                    <option value="비공개">🔒 비공개</option>
                  </select>
                  <select
                    value={ageGroup}
                    onChange={e => setAgeGroup(e.target.value)}
                    style={{
                      flex: 1, padding: "9px 10px", borderRadius: 10, fontSize: 13,
                      background: "#1a1a1a", border: "1px solid #2a2a2a", color: ageGroup ? "#fff" : "#6b7280",
                      outline: "none", cursor: "pointer",
                    }}
                  >
                    <option value="" disabled>나잇대 선택</option>
                    {AGE_ORDER.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div style={{ position: "relative" }}>
                  <textarea
                    id="guestbook-textarea"
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    maxLength={200}
                    rows={3}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 10, fontSize: 13,
                      background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#fff",
                      outline: "none", resize: "none", lineHeight: 1.6,
                      fontFamily: "inherit", boxSizing: "border-box",
                    }}
                  />
                  {msg === "" && (
                    <div
                      onClick={() => document.getElementById("guestbook-textarea")?.focus()}
                      style={{
                        position: "absolute", inset: 0,
                        padding: "10px 12px",
                        pointerEvents: "none",
                        display: "flex", flexDirection: "column", justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#2e2e2e", fontSize: 13, lineHeight: 1.6 }}>
                        방명록은 평생 삭제되지 않습니다
                      </span>
                      <span style={{ color: "#3a3a3a", fontSize: 11 }}>
                        체험 소감, 예방 다짐 등 자유롭게 남겨주세요
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#4a4a4a", fontSize: 11 }}>{msg.length}/200</span>
                  {submitError && <span style={{ color: "#ef4444", fontSize: 11 }}>{submitError}</span>}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    padding: "11px 0", borderRadius: 12, fontSize: 13, fontWeight: 700,
                    background: submitting ? "#1a1a1a" : "linear-gradient(135deg,#534AB7,#7c3aed)",
                    color: submitting ? "#4a4a4a" : "#fff",
                    border: "none", cursor: submitting ? "default" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {submitting ? "등록 중..." : "익명으로 남기기 →"}
                </button>
              </div>
            )}

            {loadingEntries ? (
              <div style={{ textAlign: "center", color: "#4a4a4a", fontSize: 13, padding: 16 }}>불러오는 중...</div>
            ) : entries.length === 0 ? (
              <div style={{ textAlign: "center", color: "#4a4a4a", fontSize: 13, padding: 16 }}>
                아직 방명록이 없습니다. 첫 번째로 남겨보세요!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {entries.map(entry => (
                  <div key={entry.id} style={{
                    background: "#141414", border: "1px solid #222", borderRadius: 14,
                    padding: "12px 14px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: GENDER_COLOR[entry.gender] ?? "#6b7280", fontWeight: 700 }}>
                        {GENDER_EMOJI[entry.gender] ?? "👤"} {entry.gender}
                      </span>
                      <span style={{ display: "inline-block", width: 1, height: 10, background: "#2a2a2a" }} />
                      <span style={{ fontSize: 11, color: "#6b7280" }}>{entry.ageGroup}</span>
                      <span style={{ marginLeft: "auto", fontSize: 10, color: "#4a4a4a" }}>{timeAgo(entry.createdAt)}</span>
                    </div>
                    <p style={{ color: "#d1d5db", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{entry.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p style={{ color: "#374151", fontSize: 11, textAlign: "center" }}>
            실시간 집계 · 개인정보 미수집 · 완전 익명
          </p>
        </div>
      </div>
    </div>
  );
}
