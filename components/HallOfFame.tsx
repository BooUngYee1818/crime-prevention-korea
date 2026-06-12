"use client";
import { useEffect, useState, useRef } from "react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

const EXAMPLE = [
  "윤서준","박로봇","정혁","김도윤","이경환",
  "윤광철","공미영","강한별","김민지","김박최수연",
  "윤승민","땅땅이","김덕배","찌찌","슘댱이",
  "유수민","새대갈","김현식","주정연","장삐쭈",
  "짤태식","육천원","빵빵이","옥지","박태준",
];

const YOUTUBERS = [
  "김동희 세계관","고순호","끼발산","낭만박상환","슈중위",
  "캡틴 김상호","효자손","앗싸참수리","웃경호","파크모",
  "꾸몽","마인애플","에프지 카운터","김무진","김솔",
  "이석하","키득가득","허팝","잇섭","언더케이지",
  "서울리안","가전주부","우주하마",
];

const ROWS_CFG = [
  { dir:  1, sz: 88,  rot: -2,   spd: 10 },
  { dir: -1, sz: 72,  rot:  1.5, spd:  8 },
  { dir:  1, sz: 96,  rot: -1,   spd: 11 },
  { dir: -1, sz: 80,  rot:  2,   spd:  9 },
  { dir:  1, sz: 68,  rot: -1.5, spd:  8 },
  { dir: -1, sz: 104, rot:  1,   spd: 12 },
  { dir:  1, sz: 76,  rot: -2.5, spd:  9 },
];

export default function HallOfFame() {
  const { lang } = useLang();
  const [names, setNames]       = useState<string[]>([]);
  const [eligible, setEligible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [nickname, setNickname] = useState("");
  const [sent, setSent]         = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem("hof_donated") === "1") setEligible(true);
    } catch {}

    fetch("/api/donors")
      .then(r => r.json())
      .then(d => { if (d.donors?.length > 0) setNames(d.donors); })
      .catch(() => {});
  }, []);

  function submitNickname() {
    const v = nickname.trim();
    if (!v) return;
    const subject = encodeURIComponent("명예의 전당 등재 신청");
    const body    = encodeURIComponent(`닉네임: ${v}\n\n(후원 감사합니다 💛)`);
    window.open(`mailto:itnlifecn@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
    try { localStorage.removeItem("hof_donated"); } catch {}
  }

  const isExample = names.length === 0;
  const list = isExample ? EXAMPLE : names;

  return (
    <section id="hall-of-fame" style={{ width: "100%", background: "#ffffff", overflow: "hidden" }}>
      <style>{`
        @keyframes scrollL  { from{transform:translateX(0)}   to{transform:translateX(-50%)} }
        @keyframes scrollR  { from{transform:translateX(-50%)}to{transform:translateX(0)}    }
        @keyframes hofSlide { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .hof-t:hover { animation-play-state: paused !important; }
        .hof-form-wrap { animation: hofSlide 0.4s cubic-bezier(0.34,1.56,0.64,1); }
      `}</style>

      {/* 타이틀 */}
      <div style={{ textAlign: "center", paddingTop: 56, paddingBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 6, color: "#d4a00070", textTransform: "uppercase", marginBottom: 10 }}>
          Hall of Fame
        </p>
        <h2 style={{ fontSize: "clamp(26px, 4.5vw, 48px)", fontWeight: 900, color: "#1a1a1a", margin: "0 0 10px" }}>
          {t("hof_title", lang)}
        </h2>
        <p style={{ fontSize: 14, color: "#999", margin: 0 }}>
          {t("hof_sub", lang)}
        </p>

        {/* 예시 배지 — 실제 후원자 없을 때만 표시 */}
        {isExample && (
          <div style={{
            display: "inline-block", marginTop: 14,
            background: "#fffbea", border: "1.5px dashed #F5C400",
            borderRadius: 20, padding: "5px 16px",
            fontSize: 12, fontWeight: 700, color: "#a07800",
          }}>
            {t("hof_example_badge", lang)}
          </div>
        )}
      </div>

      {/* 후원자 전용 등록 폼 */}
      {eligible && !sent && (
        <div className="hof-form-wrap" style={{ maxWidth: 480, margin: "0 auto 40px", padding: "0 20px" }}>
          {!showForm ? (
            <button
              onClick={() => { setShowForm(true); setTimeout(() => inputRef.current?.focus(), 80); }}
              style={{
                width: "100%", padding: "16px 0",
                background: "linear-gradient(135deg, #F5C400, #f0a800)",
                border: "none", borderRadius: 16,
                fontSize: 15, fontWeight: 900, color: "#1a1000",
                cursor: "pointer", boxShadow: "0 4px 20px #F5C40040",
              }}
            >
              {t("hof_btn_register", lang)}
            </button>
          ) : (
            <div style={{ background: "#fffbea", border: "2px solid #F5C400", borderRadius: 18, padding: "22px 22px 18px" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#7a6200", marginBottom: 14 }}>
                {t("hof_thanks", lang)}<br/>
                <span style={{ fontWeight: 500, color: "#a07800", fontSize: 12 }}>
                  {t("hof_placeholder_desc", lang).split("\n").map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br/>}</span>
                  ))}
                </span>
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  ref={inputRef}
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submitNickname()}
                  placeholder={t("hof_input_ph", lang)}
                  maxLength={20}
                  style={{
                    flex: 1, padding: "11px 14px", borderRadius: 10,
                    border: "1.5px solid #F5C400", fontSize: 14,
                    outline: "none", fontWeight: 600, background: "#fff",
                  }}
                />
                <button
                  onClick={submitNickname}
                  disabled={!nickname.trim()}
                  style={{
                    padding: "11px 18px",
                    background: nickname.trim() ? "#F5C400" : "#f0f0f0",
                    border: "none", borderRadius: 10,
                    fontWeight: 900, fontSize: 13,
                    cursor: nickname.trim() ? "pointer" : "default",
                    color: "#1a1000",
                  }}
                >
                  {t("hof_submit", lang)}
                </button>
              </div>
              <p style={{ fontSize: 11, color: "#aaa", marginTop: 10, textAlign: "center" }}>
                {t("hof_review_note", lang)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 제출 완료 메시지 */}
      {sent && (
        <div style={{ maxWidth: 480, margin: "0 auto 40px", padding: "0 20px" }}>
          <div style={{
            background: "#f0fdf4", border: "2px solid #86efac",
            borderRadius: 16, padding: "18px 20px", textAlign: "center",
          }}>
            <p style={{ fontSize: 22, marginBottom: 6 }}>🎉</p>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#166534", margin: 0 }}>
              {t("hof_done_title", lang)}
            </p>
            <p style={{ fontSize: 12, color: "#4ade80", marginTop: 6, marginBottom: 0 }}>
              {t("hof_done_sub", lang)}
            </p>
          </div>
        </div>
      )}

      {/* ── 최고 명예의 전당 — 유튜버 + 일반 후원자 통합 ── */}
      <div style={{ background: "#0d0d0d", padding: "48px 0 0", marginTop: 8 }}>
        <div style={{ textAlign: "center", paddingBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 6, color: "#ffd70050", textTransform: "uppercase", marginBottom: 10 }}>
            Ultimate Hall of Fame
          </p>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 40px)", fontWeight: 900, color: "#FFD700", margin: "0 0 8px" }}>
            👑 {t("hof_ultimate_label", lang)}
          </h2>
          <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
            {t("hof_ultimate_all", lang)}
          </p>
        </div>

        {/* 통합 마퀴 — 유튜버 + 일반 후원자 혼합, 예시 시 흐리게 */}
        {(() => {
          const combined = [...YOUTUBERS, ...list];
          const opacity = isExample ? 0.35 : 1;
          return (
            <div style={{ paddingBottom: 48, opacity, transition: "opacity 0.5s" }}>
              {ROWS_CFG.map((row, ri) => {
                const shuffled = [...combined].sort(() => Math.sin(ri * 4.3 + 1.7) - 0.5);
                const repeat   = Math.max(2, Math.ceil(20 / combined.length));
                const unit     = shuffled.map(n =>
                  `<span style="display:inline-block;font-size:${row.sz}px;font-weight:900;color:#FFD700;padding:0 14px;line-height:1.12;white-space:nowrap;text-shadow:0 0 20px #ffd70060,2px 2px 0 #b8860030;font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;">${n}<span style="color:#FFD70030;font-size:${Math.round(row.sz * 0.28)}px;margin:0 8px;">★</span></span>`
                ).join("");
                const content = unit.repeat(repeat);
                const dur = Math.max(5, row.spd * 1.2 * (combined.length / 15));
                return (
                  <div key={ri} style={{
                    overflow: "hidden",
                    transform: `rotate(${row.rot}deg) scaleX(1.1)`,
                    margin: `${ri === 0 ? 4 : -12}px 0`,
                  }}>
                    <div
                      className="hof-t"
                      style={{
                        display: "flex", width: "200%", willChange: "transform",
                        animation: `${row.dir === 1 ? "scrollL" : "scrollR"} ${dur}s linear infinite`,
                      }}
                      dangerouslySetInnerHTML={{ __html: content + content }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    </section>
  );
}
