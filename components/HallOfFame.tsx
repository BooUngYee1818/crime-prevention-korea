"use client";
import { useEffect, useState, useRef } from "react";

const FALLBACK = [
  "부엉이 안","양진오","노영국이","김미경","주현옥",
  "안성태","김진은","양도상국","장리관","인국은",
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
  const [names, setNames]       = useState<string[]>(FALLBACK);
  const [eligible, setEligible] = useState(false);   // 후원 버튼 경유 여부
  const [showForm, setShowForm] = useState(false);
  const [nickname, setNickname] = useState("");
  const [sent, setSent]         = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 후원 플래그 확인 — 클라이언트 전용, 서버 미전송, 개인정보 없음
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
    // 메일로 전달 — 어떠한 서버 저장도 없음
    const subject = encodeURIComponent("명예의 전당 등재 신청");
    const body    = encodeURIComponent(`닉네임: ${v}\n\n(후원 감사합니다 💛)`);
    window.open(`mailto:itnlifecn@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
    try { localStorage.removeItem("hof_donated"); } catch {}
  }

  const list = names.length > 0 ? names : FALLBACK;

  return (
    <section style={{ width: "100%", background: "#ffffff", overflow: "hidden" }}>
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
          💛 후원자 명예의 전당
        </h2>
        <p style={{ fontSize: 14, color: "#999", margin: 0 }}>
          이 프로그램을 함께 키워주신 분들입니다
        </p>
      </div>

      {/* ── 후원자 전용 등록 폼 ── */}
      {eligible && !sent && (
        <div className="hof-form-wrap" style={{
          maxWidth: 480, margin: "0 auto 40px",
          padding: "0 20px",
        }}>
          {!showForm ? (
            <button
              onClick={() => { setShowForm(true); setTimeout(() => inputRef.current?.focus(), 80); }}
              style={{
                width: "100%", padding: "16px 0",
                background: "linear-gradient(135deg, #F5C400, #f0a800)",
                border: "none", borderRadius: 16,
                fontSize: 15, fontWeight: 900, color: "#1a1000",
                cursor: "pointer",
                boxShadow: "0 4px 20px #F5C40040",
              }}
            >
              💛 명예의 전당에 내 이름 올리기
            </button>
          ) : (
            <div style={{
              background: "#fffbea",
              border: "2px solid #F5C400",
              borderRadius: 18, padding: "22px 22px 18px",
            }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#7a6200", marginBottom: 14 }}>
                💛 후원해 주셔서 감사합니다!<br/>
                <span style={{ fontWeight: 500, color: "#a07800", fontSize: 12 }}>
                  명예의 전당에 올릴 닉네임을 입력해 주세요.<br/>
                  이름 외 어떤 정보도 수집되지 않습니다.
                </span>
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  ref={inputRef}
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submitNickname()}
                  placeholder="닉네임 입력"
                  maxLength={20}
                  style={{
                    flex: 1, padding: "11px 14px", borderRadius: 10,
                    border: "1.5px solid #F5C400", fontSize: 14,
                    outline: "none", fontWeight: 600,
                    background: "#fff",
                  }}
                />
                <button
                  onClick={submitNickname}
                  disabled={!nickname.trim()}
                  style={{
                    padding: "11px 18px",
                    background: nickname.trim() ? "#F5C400" : "#f0f0f0",
                    border: "none", borderRadius: 10,
                    fontWeight: 900, fontSize: 13, cursor: nickname.trim() ? "pointer" : "default",
                    color: "#1a1000",
                  }}
                >
                  신청
                </button>
              </div>
              <p style={{ fontSize: 11, color: "#aaa", marginTop: 10, textAlign: "center" }}>
                운영자 확인 후 명예의 전당에 반영됩니다
              </p>
            </div>
          )}
        </div>
      )}

      {/* 제출 완료 메시지 */}
      {sent && (
        <div style={{
          maxWidth: 480, margin: "0 auto 40px", padding: "0 20px",
        }}>
          <div style={{
            background: "#f0fdf4", border: "2px solid #86efac",
            borderRadius: 16, padding: "18px 20px", textAlign: "center",
          }}>
            <p style={{ fontSize: 22, marginBottom: 6 }}>🎉</p>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#166534", margin: 0 }}>
              신청 완료! 곧 명예의 전당에 등재됩니다.
            </p>
            <p style={{ fontSize: 12, color: "#4ade80", marginTop: 6, marginBottom: 0 }}>
              소중한 후원 감사드립니다 💛
            </p>
          </div>
        </div>
      )}

      {/* 마퀴 열 */}
      <div style={{ paddingBottom: 48 }}>
        {ROWS_CFG.map((row, ri) => {
          const shuffled = [...list].sort(() => Math.sin(ri * 5.1 + 1) - 0.5);
          const repeat   = Math.max(3, Math.ceil(20 / list.length));
          const unit     = shuffled.map(n =>
            `<span style="display:inline-block;font-size:${row.sz}px;font-weight:900;color:#F5C400;padding:0 14px;line-height:1.12;white-space:nowrap;text-shadow:2px 2px 0 #d4a00033;font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;">${n}<span style="color:#F5C40028;font-size:${Math.round(row.sz * 0.28)}px;margin:0 8px;">·</span></span>`
          ).join("");
          const content = unit.repeat(repeat);
          const dur = Math.max(4, row.spd * (list.length / 10));

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
    </section>
  );
}
