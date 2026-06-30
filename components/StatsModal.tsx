"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { getCountry } from "@/lib/countries";

interface Stats { total: number; gender: Record<string, number>; age: Record<string, number>; country: Record<string, number>; }
interface GuestEntry { id: string; message: string; gender: string; ageGroup: string; createdAt: number; }

const AGE_ORDER = ["10대","20대","30대","40대","50대","60대 이상"];
const AGE_COLOR = ["#a57cbb","#a57cbb","#b3889e","#f59e0b","#22c55e","#ef4444"];
const GENDER_EMOJI: Record<string, string> = { 남성:"👨", 여성:"👩", 비공개:"🔒" };
const GENDER_COLOR: Record<string, string> = { 남성:"#a57cbb", 여성:"#b3889e", 비공개:"#6b7280" };

// 관리자 이메일 (비밀 우회용)
const ADMIN_KEY = "crime_admin_2025";

// 핀 고정 방명록 항목 (관리자 직접 작성)
const PINNED_ENTRY: GuestEntry = {
  id: "pinned-001",
  message: "나이가 좀 있는데... 솔직히 아들이 뭘 만들었나 했어요. 그런데 이런 수준의 프로그램을 무료로 만들다니, 정말 말이 안 되는 거잖아요. 나 같은 사람한테도 딱 필요한 내용인데, 고맙고 대단하다 싶었어요.",
  gender: "비공개",
  ageGroup: "60대 이상",
  createdAt: Date.now() - 1000 * 60 * 30,
};

export default function StatsModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
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
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [titleClickCount, setTitleClickCount] = useState(0);

  // 성별·연령대 표시 레이블 (언어별)
  const GENDER_LABEL: Record<string, string> = {
    남성: t("profile_male", lang).replace("👨 ", ""),
    여성: t("profile_female", lang).replace("👩 ", ""),
    비공개: t("profile_private", lang).replace("🔒 ", ""),
  };
  const AGE_LABEL: Record<string, string> = {
    "10대": t("profile_age_10s", lang), "20대": t("profile_age_20s", lang),
    "30대": t("profile_age_30s", lang), "40대": t("profile_age_40s", lang),
    "50대": t("profile_age_50s", lang), "60대 이상": t("profile_age_60plus", lang),
  };

  function timeAgo(ts: number) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60)    return t("stats_time_just", lang);
    if (diff < 3600)  return `${Math.floor(diff / 60)}${lang === "en" || lang === "de" || lang === "fr" || lang === "pt" || lang === "es" ? " " : ""}${t("stats_time_min", lang)}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}${lang === "en" || lang === "de" || lang === "fr" || lang === "pt" || lang === "es" ? " " : ""}${t("stats_time_hour", lang)}`;
    return `${Math.floor(diff / 86400)}${lang === "en" || lang === "de" || lang === "fr" || lang === "pt" || lang === "es" ? " " : ""}${t("stats_time_day", lang)}`;
  }

  // 마운트 시 이미 제출했는지 확인
  useEffect(() => {
    const isAdmin = localStorage.getItem("gb_admin") === ADMIN_KEY;
    const submitted = localStorage.getItem("gb_submitted_v1") === "true";
    if (submitted && !isAdmin) setAlreadySubmitted(true);
  }, []);

  // 방명록 제목 5번 클릭 → 관리자 모드
  function handleTitleClick() {
    const next = titleClickCount + 1;
    setTitleClickCount(next);
    if (next >= 5) {
      localStorage.setItem("gb_admin", ADMIN_KEY);
      setAlreadySubmitted(false);
      setTitleClickCount(0);
      alert("관리자 모드 활성화 ✅ 여러 번 작성 가능합니다.");
    }
  }

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json()).then(d => setStats(d))
      .catch(() => setStats({ total: 0, gender: {}, age: {}, country: {} }))
      .finally(() => setLoadingStats(false));

    // 서버 방명록 + 로컬 방명록 병합
    const localRaw = localStorage.getItem("guestbook_local");
    const localEntries: GuestEntry[] = localRaw ? JSON.parse(localRaw) : [];

    fetch("/api/guestbook")
      .then(r => r.json())
      .then(d => {
        const serverEntries: GuestEntry[] = d.entries ?? [];
        const serverIds = new Set(serverEntries.map(e => e.id));
        const onlyLocal = localEntries.filter(e => !serverIds.has(e.id));
        // 핀 고정 항목은 항상 맨 앞
        setEntries([PINNED_ENTRY, ...onlyLocal, ...serverEntries]);
      })
      .catch(() => setEntries([PINNED_ENTRY, ...localEntries]))
      .finally(() => setLoadingEntries(false));
  }, []);

  const totalGender  = Object.values(stats?.gender  ?? {}).reduce((a, b) => a + b, 0) || 1;
  const totalAge     = Object.values(stats?.age     ?? {}).reduce((a, b) => a + b, 0) || 1;
  const totalCountry = Object.values(stats?.country ?? {}).reduce((a, b) => a + b, 0) || 1;
  const topCountries = Object.entries(stats?.country ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const COUNTRY_COLORS = ["#f59e0b","#a57cbb","#22c55e","#b3889e","#a57cbb","#f97316","#06b6d4","#e11d48","#84cc16","#c58dc6"];

  async function handleSubmit() {
    if (!msg.trim() || !gender || !ageGroup) { setSubmitError(t("stats_error", lang)); return; }
    setSubmitting(true); setSubmitError("");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg.trim(), gender, ageGroup }),
      });
      const data = await res.json();
      if (data.ok) {
        setSubmitDone(true); setMsg(""); setGender(""); setAgeGroup("");
        const newEntry: GuestEntry = data.entry ?? {
          id: `local-${Date.now()}`,
          message: msg.trim(), gender, ageGroup,
          createdAt: Date.now(),
        };
        // 로컬에도 저장 (KV 없어도 보임)
        const localRaw = localStorage.getItem("guestbook_local");
        const localEntries: GuestEntry[] = localRaw ? JSON.parse(localRaw) : [];
        const updated = [newEntry, ...localEntries].slice(0, 30);
        localStorage.setItem("guestbook_local", JSON.stringify(updated));
        // 1인 1회 제한 표시 (관리자는 제외)
        const isAdmin = localStorage.getItem("gb_admin") === ADMIN_KEY;
        if (!isAdmin) localStorage.setItem("gb_submitted_v1", "true");
        setEntries(prev => [newEntry, ...prev]);
      }
    } catch { setSubmitError(t("stats_send_error", lang)); }
    finally { setSubmitting(false); }
  }

  const unit = t("stats_count_unit", lang);

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: "fixed", inset: 0, zIndex: 99998,
      background: "rgba(0,0,0,0.88)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        width: "100%", maxWidth: 480, background: "#130c1c",
        border: "1px solid #2a1a3a", borderRadius: "24px 24px 0 0",
        maxHeight: "90vh", overflowY: "auto", padding: "0 0 40px",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#2a2a2a" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 20px" }}>
          <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 20, margin: 0 }}>{t("stats_modal_title", lang)}</h2>
          <button onClick={onClose} style={{
            background: "#231232", border: "1px solid #2a2a2a", color: "#6b7280",
            width: 32, height: 32, borderRadius: "50%", cursor: "pointer",
            fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {loadingStats ? (
            <div style={{ textAlign: "center", color: "#6b7280", padding: 40 }}>{t("stats_loading", lang)}</div>
          ) : (
            <>
              {/* 총 이용자 */}
              <div style={{ background:"linear-gradient(135deg,#160a26,#1c0f32)", border:"1px solid #3d1f5a", borderRadius:20, padding:24, textAlign:"center" }}>
                <p style={{ color:"#c58dc6", fontSize:13, marginBottom:6 }}>{t("stats_total_lbl", lang)}</p>
                <p style={{ color:"#fff", fontWeight:900, fontSize:52, lineHeight:1 }}>{(stats?.total ?? 0).toLocaleString()}</p>
                <p style={{ color:"#4b7ab5", fontSize:12, marginTop:8 }}>
                  {unit}{unit ? " " : ""}{t("stats_total_sub", lang)}
                </p>
                <div style={{ marginTop:14, padding:"10px 16px", background:"#241040", borderRadius:12, display:"inline-block" }}>
                  <p style={{ color:"#22c55e", fontSize:13, fontWeight:700 }}>
                    {t("stats_prevention", lang)} {Math.floor((stats?.total ?? 0) * 0.73).toLocaleString()}{unit}
                  </p>
                  <p style={{ color:"#4b7ab5", fontSize:11, marginTop:2 }}>{t("stats_prev_note", lang)}</p>
                </div>
              </div>

              {/* 성별 */}
              <div style={{ background:"#1a1026", border:"1px solid #2a1a3a", borderRadius:20, padding:20 }}>
                <p style={{ color:"#9ca3af", fontSize:12, fontWeight:700, marginBottom:16, letterSpacing:1 }}>{t("stats_gender_dist", lang)}</p>
                {["남성","여성","비공개"].map((g) => {
                  const count = stats?.gender?.[g] ?? 0;
                  const pct = Math.round((count / totalGender) * 100);
                  return (
                    <div key={g} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ color:"#d1d5db", fontSize:13 }}>{GENDER_EMOJI[g]} {GENDER_LABEL[g]}</span>
                        <span style={{ color:"#9ca3af", fontSize:13 }}>{count.toLocaleString()}{unit} ({pct}%)</span>
                      </div>
                      <div style={{ height:8, background:"#231232", borderRadius:4, overflow:"hidden" }}>
                        <div style={{ height:"100%", borderRadius:4, width:`${pct}%`, background:GENDER_COLOR[g], transition:"width 0.6s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 연령대 */}
              <div style={{ background:"#1a1026", border:"1px solid #2a1a3a", borderRadius:20, padding:20 }}>
                <p style={{ color:"#9ca3af", fontSize:12, fontWeight:700, marginBottom:16, letterSpacing:1 }}>{t("stats_age_dist", lang)}</p>
                {AGE_ORDER.map((ag, i) => {
                  const count = stats?.age?.[ag] ?? 0;
                  const pct = Math.round((count / totalAge) * 100);
                  return (
                    <div key={ag} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ color:"#d1d5db", fontSize:13 }}>{AGE_LABEL[ag]}</span>
                        <span style={{ color:"#9ca3af", fontSize:13 }}>{count.toLocaleString()}{unit} ({pct}%)</span>
                      </div>
                      <div style={{ height:8, background:"#231232", borderRadius:4, overflow:"hidden" }}>
                        <div style={{ height:"100%", borderRadius:4, width:`${pct}%`, background:AGE_COLOR[i], transition:"width 0.6s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 국가별 */}
              <div style={{ background:"#1a1026", border:"1px solid #2a1a3a", borderRadius:20, padding:20 }}>
                <p style={{ color:"#9ca3af", fontSize:12, fontWeight:700, marginBottom:16, letterSpacing:1 }}>
                  🌍 {t("stats_country_dist", lang)}
                </p>
                {topCountries.length === 0 ? (
                  <p style={{ color:"#4a4a4a", fontSize:13, textAlign:"center", padding:"16px 0" }}>{t("stats_loading", lang)}</p>
                ) : (
                  topCountries.map(([code, count], i) => {
                    const info = getCountry(code);
                    const pct = Math.round((count / totalCountry) * 100);
                    return (
                      <div key={code} style={{ marginBottom:12 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"center" }}>
                          <span style={{ color:"#d1d5db", fontSize:13 }}>
                            {info ? `${info.flag} ${info.name}` : `🌍 ${code}`}
                          </span>
                          <span style={{ color:"#9ca3af", fontSize:13 }}>{count.toLocaleString()}{unit} ({pct}%)</span>
                        </div>
                        <div style={{ height:8, background:"#231232", borderRadius:4, overflow:"hidden" }}>
                          <div style={{ height:"100%", borderRadius:4, width:`${pct}%`, background:COUNTRY_COLORS[i % COUNTRY_COLORS.length], transition:"width 0.6s ease" }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* 방명록 */}
          <div style={{ background:"#1a1026", border:"1px solid #2a1a3a", borderRadius:20, padding:20 }}>
            <p
              onClick={handleTitleClick}
              style={{ color:"#9ca3af", fontSize:12, fontWeight:700, marginBottom:16, letterSpacing:1, cursor:"default", userSelect:"none" }}
            >
              {t("stats_guestbook", lang)}
            </p>

            {alreadySubmitted ? (
              <div style={{ background:"#0e1a0e", border:"1px solid #22c55e33", borderRadius:14, padding:"16px", textAlign:"center", marginBottom:16 }}>
                <p style={{ fontSize:22, marginBottom:6 }}>🙏</p>
                <p style={{ color:"#4ade80", fontWeight:700, fontSize:14, marginBottom:4 }}>방명록을 남겨주셔서 감사합니다!</p>
                <p style={{ color:"#6b7280", fontSize:12 }}>방명록은 1인 1회만 작성 가능합니다.</p>
              </div>
            ) : submitDone ? (
              <div style={{ background:"#0a2a14", border:"1px solid #22c55e44", borderRadius:14, padding:16, textAlign:"center", marginBottom:16 }}>
                <p style={{ color:"#22c55e", fontWeight:700, fontSize:14 }}>{t("stats_done", lang)}</p>
              </div>
            ) : (
              <div style={{ marginBottom:18, display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ display:"flex", gap:8 }}>
                  <select value={gender} onChange={e => setGender(e.target.value)} style={{
                    flex:1, padding:"9px 10px", borderRadius:10, fontSize:13,
                    background:"#231232", border:"1px solid #2a2a2a", color:gender?"#fff":"#6b7280",
                    outline:"none", cursor:"pointer",
                  }}>
                    <option value="" disabled>{t("stats_gender_sel", lang)}</option>
                    <option value="남성">{t("profile_male", lang)}</option>
                    <option value="여성">{t("profile_female", lang)}</option>
                    <option value="비공개">{t("profile_private", lang)}</option>
                  </select>
                  <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)} style={{
                    flex:1, padding:"9px 10px", borderRadius:10, fontSize:13,
                    background:"#231232", border:"1px solid #2a2a2a", color:ageGroup?"#fff":"#6b7280",
                    outline:"none", cursor:"pointer",
                  }}>
                    <option value="" disabled>{t("stats_age_sel", lang)}</option>
                    {AGE_ORDER.map(a => <option key={a} value={a}>{AGE_LABEL[a]}</option>)}
                  </select>
                </div>

                <div style={{ position:"relative" }}>
                  <textarea
                    id="guestbook-textarea"
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    maxLength={200}
                    rows={3}
                    style={{
                      width:"100%", padding:"10px 12px", borderRadius:10, fontSize:13,
                      background:"#231232", border:"1px solid #2a2a2a", color:"#fff",
                      outline:"none", resize:"none", lineHeight:1.6,
                      fontFamily:"inherit", boxSizing:"border-box",
                    }}
                  />
                  {msg === "" && (
                    <div onClick={() => document.getElementById("guestbook-textarea")?.focus()} style={{
                      position:"absolute", inset:0, padding:"10px 12px",
                      pointerEvents:"none", display:"flex", flexDirection:"column", justifyContent:"space-between",
                    }}>
                      <span style={{ color:"#2e2e2e", fontSize:13, lineHeight:1.6 }}>{t("stats_ph1", lang)}</span>
                      <span style={{ color:"#3a3a3a", fontSize:11 }}>{t("stats_ph2", lang)}</span>
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:"#4a4a4a", fontSize:11 }}>{msg.length}/200</span>
                  {submitError && <span style={{ color:"#ef4444", fontSize:11 }}>{submitError}</span>}
                </div>
                <button onClick={handleSubmit} disabled={submitting} style={{
                  padding:"11px 0", borderRadius:12, fontSize:13, fontWeight:700,
                  background: submitting ? "#231232" : "linear-gradient(135deg,#534AB7,#7c3aed)",
                  color: submitting ? "#4a4a4a" : "#fff",
                  border:"none", cursor: submitting ? "default" : "pointer", transition:"all 0.2s",
                }}>
                  {submitting ? t("stats_submitting", lang) : t("stats_submit_btn", lang)}
                </button>
              </div>
            )}

            {loadingEntries ? (
              <div style={{ textAlign:"center", color:"#4a4a4a", fontSize:13, padding:16 }}>{t("stats_loading", lang)}</div>
            ) : entries.length === 0 ? (
              <div style={{ textAlign:"center", color:"#4a4a4a", fontSize:13, padding:16 }}>{t("stats_no_entries", lang)}</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {entries.map(entry => {
                  const isPinned = entry.id === "pinned-001";
                  return (
                    <div key={entry.id} style={{
                      background: isPinned ? "linear-gradient(135deg,#1a1230,#231040)" : "#1e1028",
                      border: isPinned ? "1px solid #7c3aed55" : "1px solid #222",
                      borderRadius:14, padding:"12px 14px",
                      position: "relative",
                    }}>
                      {isPinned && (
                        <span style={{
                          position:"absolute", top:10, right:12,
                          fontSize:10, color:"#a78bfa", fontWeight:700,
                          background:"#2d1b6933", padding:"2px 8px", borderRadius:20,
                        }}>📌 추천</span>
                      )}
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <span style={{ fontSize:11, color:GENDER_COLOR[entry.gender]??"#6b7280", fontWeight:700 }}>
                          {GENDER_EMOJI[entry.gender]??"👤"} {GENDER_LABEL[entry.gender] ?? entry.gender}
                        </span>
                        <span style={{ display:"inline-block", width:1, height:10, background:"#2a2a2a" }} />
                        <span style={{ fontSize:11, color:"#6b7280" }}>{AGE_LABEL[entry.ageGroup] ?? entry.ageGroup}</span>
                        <span style={{ marginLeft:"auto", fontSize:10, color:"#4a4a4a" }}>{timeAgo(entry.createdAt)}</span>
                      </div>
                      <p style={{ color: isPinned ? "#e2d9f3" : "#d1d5db", fontSize:13, lineHeight:1.6, margin:0 }}>{entry.message}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <p style={{ color:"#374151", fontSize:11, textAlign:"center" }}>{t("stats_footer", lang)}</p>

          {/* 프로필 재설정 */}
          <div style={{ textAlign:"center" }}>
            <button
              onClick={() => {
                localStorage.removeItem("user_profile");
                onClose();
                window.location.reload();
              }}
              style={{ background:"none", border:"none", color:"#374151", fontSize:11, cursor:"pointer", textDecoration:"underline" }}
            >
              🔄 {lang === "ko" ? "프로필 재설정" : lang === "ja" ? "プロフィールをリセット" : lang === "zh" ? "重置个人资料" : lang === "vi" ? "Đặt lại hồ sơ" : lang === "de" ? "Profil zurücksetzen" : lang === "fr" ? "Réinitialiser le profil" : lang === "es" ? "Restablecer perfil" : lang === "hi" ? "प्रोफ़ाइल रीसेट करें" : lang === "pt" ? "Redefinir perfil" : "Reset Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
