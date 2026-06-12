"use client";
import { useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { COUNTRIES } from "@/lib/countries";

export interface UserProfile {
  gender: "남성" | "여성" | "비공개";
  ageGroup: "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상";
  country?: string;
}

interface Props { onComplete: (profile: UserProfile) => void; }

const GENDERS: UserProfile["gender"][] = ["남성", "여성", "비공개"];
const AGE_GROUPS: UserProfile["ageGroup"][] = ["10대","20대","30대","40대","50대","60대 이상"];

export default function ProfileModal({ onComplete }: Props) {
  const { lang } = useLang();
  const [gender, setGender]     = useState<UserProfile["gender"] | null>(null);
  const [ageGroup, setAgeGroup] = useState<UserProfile["ageGroup"] | null>(null);
  const [country, setCountry]   = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const GENDER_LABEL: Record<UserProfile["gender"], string> = {
    "남성":  t("profile_male",    lang),
    "여성":  t("profile_female",  lang),
    "비공개":t("profile_private", lang),
  };
  const AGE_LABEL: Record<UserProfile["ageGroup"], string> = {
    "10대":     t("profile_age_10s",   lang),
    "20대":     t("profile_age_20s",   lang),
    "30대":     t("profile_age_30s",   lang),
    "40대":     t("profile_age_40s",   lang),
    "50대":     t("profile_age_50s",   lang),
    "60대 이상":t("profile_age_60plus",lang),
  };

  async function handleStart() {
    if (!gender || !ageGroup || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender, ageGroup, country: country || "ETC" }),
      });
    } catch {}
    const profile: UserProfile = { gender, ageGroup, country: country || "ETC" };
    localStorage.setItem("user_profile", JSON.stringify(profile));
    onComplete(profile);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(0,0,0,0.95)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-start",
      padding: "20px 16px",
      overflowY: "auto",
    }}>
      <div style={{
        width: "100%", maxWidth: 420,
        background: "#0d0d0d", border: "1px solid #1e1e1e",
        borderRadius: 24, padding: "24px 20px",
        display: "flex", flexDirection: "column", gap: 20,
        marginTop: "auto", marginBottom: "auto",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🛡️</div>
          <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 20, marginBottom: 6 }}>
            {t("profile_title", lang)}
          </h2>
          <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}>
            {t("profile_subtitle", lang).split("\n").map((l, i) => (
              <span key={i}>{l}{i === 0 && <br/>}</span>
            ))}
          </p>
        </div>

        {/* 성별 */}
        <div>
          <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>
            {t("profile_gender_lbl", lang)}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {GENDERS.map((g) => (
              <button key={g} onClick={() => setGender(g)} style={{
                flex: 1, padding: "12px 0", borderRadius: 14, fontSize: 13, fontWeight: 700,
                cursor: "pointer", transition: "all 0.15s",
                background: gender === g ? "#1d4ed8" : "#1a1a1a",
                color: gender === g ? "#fff" : "#6b7280",
                border: `1.5px solid ${gender === g ? "#3b82f6" : "#2a2a2a"}`,
              }}>
                {GENDER_LABEL[g]}
              </button>
            ))}
          </div>
        </div>

        {/* 연령대 */}
        <div>
          <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>
            {t("profile_age_lbl", lang)}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {AGE_GROUPS.map((ag) => (
              <button key={ag} onClick={() => setAgeGroup(ag)} style={{
                padding: "12px 0", borderRadius: 14, fontSize: 13, fontWeight: 700,
                cursor: "pointer", transition: "all 0.15s",
                background: ageGroup === ag ? "#166534" : "#1a1a1a",
                color: ageGroup === ag ? "#4ade80" : "#6b7280",
                border: `1.5px solid ${ageGroup === ag ? "#22c55e" : "#2a2a2a"}`,
              }}>
                {AGE_LABEL[ag]}
              </button>
            ))}
          </div>
        </div>

        {/* 국가 */}
        <div>
          <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>
            {t("profile_country_lbl", lang)}
          </p>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 14, fontSize: 14,
              background: "#1a1a1a", border: `1.5px solid ${country ? "#a78bfa" : "#2a2a2a"}`,
              color: country ? "#fff" : "#6b7280", outline: "none", cursor: "pointer",
              appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
            }}
          >
            <option value="" disabled>{t("profile_country_ph", lang)}</option>
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>
        </div>

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
          {submitting ? t("profile_saving", lang) : t("profile_start", lang)}
        </button>

        <p style={{ color: "#374151", fontSize: 10, textAlign: "center", marginTop: -12 }}>
          {t("profile_privacy", lang)}
        </p>
      </div>
    </div>
  );
}
