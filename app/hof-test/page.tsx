"use client";
import { useState, useEffect } from "react";

const ROWS_CFG = [
  { dir:  1, sz: 88,  rot: -2,   spd: 10 },
  { dir: -1, sz: 72,  rot:  1.5, spd:  8 },
  { dir:  1, sz: 96,  rot: -1,   spd: 11 },
  { dir: -1, sz: 80,  rot:  2,   spd:  9 },
  { dir:  1, sz: 68,  rot: -1.5, spd:  8 },
  { dir: -1, sz: 104, rot:  1,   spd: 12 },
  { dir:  1, sz: 76,  rot: -2.5, spd:  9 },
];

const DEFAULT_NAMES = [
  "부엉이 안","양진오","노영국이","김미경","주현옥",
  "안성태","김진은","양도상국","장리관","인국은",
];

function HallPreview({ names }: { names: string[] }) {
  if (names.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 0", color: "#ccc", fontSize: 16 }}>
      이름을 추가해보세요
    </div>
  );

  return (
    <div style={{ padding: "8px 0 16px", overflow: "hidden" }}>
      {ROWS_CFG.map((row, ri) => {
        const shuffled = [...names].sort(() => Math.sin(ri * 5.1 + 1) - 0.5);
        const repeat = Math.max(3, Math.ceil(20 / names.length));
        const unit = shuffled.map(n =>
          `<span style="display:inline-block;font-size:${row.sz}px;font-weight:900;color:#F5C400;padding:0 14px;line-height:1.12;white-space:nowrap;font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;">${n}<span style="color:#F5C40030;font-size:${Math.round(row.sz * 0.28)}px;margin:0 6px;">·</span></span>`
        ).join("");
        const content = unit.repeat(repeat);
        const dur = Math.max(4, row.spd * (names.length / 10));

        return (
          <div key={ri} style={{
            overflow: "hidden",
            transform: `rotate(${row.rot}deg) scaleX(1.1)`,
            margin: `${ri === 0 ? 4 : -12}px 0`,
          }}>
            <div
              style={{
                display: "flex",
                animation: `${row.dir === 1 ? "scrollL" : "scrollR"} ${dur}s linear infinite`,
                width: "200%",
                willChange: "transform",
              }}
              dangerouslySetInnerHTML={{ __html: content + content }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function HofTestPage() {
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);
  const [input, setInput] = useState("");
  const [showDonorPopup, setShowDonorPopup] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);

  function addName() {
    const v = input.trim();
    if (!v || names.includes(v)) return;
    setNames(prev => [...prev, v]);
    setInput("");
  }

  function removeName(i: number) {
    setNames(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8" }}>
      <style>{`
        @keyframes scrollL { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes scrollR { from { transform: translateX(-50%) } to { transform: translateX(0) } }
      `}</style>

      {/* 헤더 */}
      <div style={{
        background: "#1a1a2e", color: "#fff",
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, flexWrap: "wrap",
      }}>
        <div>
          <p style={{ fontSize: 11, color: "#534AB7", fontWeight: 800, letterSpacing: 2, margin: "0 0 2px" }}>
            🧪 TEST PAGE
          </p>
          <h1 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>명예의 전당 — 미리보기</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowDonorPopup(true)}
            style={{
              padding: "8px 14px", background: "#F5C400", border: "none",
              borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", color: "#1a1000",
            }}
          >
            💛 후원 팝업 테스트
          </button>
          <button
            onClick={() => setShowReviewPopup(true)}
            style={{
              padding: "8px 14px", background: "#534AB7", border: "none",
              borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", color: "#fff",
            }}
          >
            💜 후기 팝업 테스트
          </button>
        </div>
      </div>

      {/* 컨트롤 패널 */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #eee",
        padding: "16px 24px",
      }}>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 10, fontWeight: 600 }}>
          이름 추가 · 삭제하면 아래 명예의 전당이 실시간 반영됩니다
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addName()}
            placeholder="닉네임 입력 후 Enter"
            maxLength={20}
            style={{
              flex: 1, minWidth: 160, padding: "9px 14px",
              borderRadius: 8, border: "1.5px solid #ddd",
              fontSize: 14, outline: "none",
            }}
          />
          <button
            onClick={addName}
            style={{
              padding: "9px 18px", background: "#F5C400", border: "none",
              borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: "pointer", color: "#1a1000",
            }}
          >
            + 추가
          </button>
          <button
            onClick={() => setNames([])}
            style={{
              padding: "9px 14px", background: "#fee2e2", border: "none",
              borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", color: "#991b1b",
            }}
          >
            전체 삭제
          </button>
          <button
            onClick={() => setNames(DEFAULT_NAMES)}
            style={{
              padding: "9px 14px", background: "#f0f0f0", border: "none",
              borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", color: "#555",
            }}
          >
            초기화
          </button>
        </div>

        {/* 이름 태그 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {names.map((n, i) => (
            <div key={i} style={{
              background: "#FFF9E0", border: "1.5px solid #F5C400",
              borderRadius: 20, padding: "4px 12px",
              fontSize: 12, fontWeight: 700, color: "#7a6200",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {n}
              <span
                onClick={() => removeName(i)}
                style={{ cursor: "pointer", color: "#ccc", fontSize: 15, lineHeight: 1 }}
              >×</span>
            </div>
          ))}
        </div>
      </div>

      {/* 명예의 전당 본체 */}
      <div style={{ background: "#ffffff" }}>
        {/* 타이틀 */}
        <div style={{ textAlign: "center", paddingTop: 48, paddingBottom: 28 }}>
          <p style={{
            fontSize: 11, fontWeight: 800, letterSpacing: 5,
            color: "#d4a00060", textTransform: "uppercase", marginBottom: 8,
          }}>Hall of Fame</p>
          <h2 style={{
            fontSize: "clamp(26px, 5vw, 48px)", fontWeight: 900,
            color: "#1a1a1a", margin: "0 0 10px",
          }}>
            💛 후원자 명예의 전당
          </h2>
          <p style={{ fontSize: 14, color: "#888", margin: 0 }}>
            이 프로그램을 함께 키워주신 분들입니다
          </p>
        </div>

        <HallPreview names={names} />
      </div>

      {/* 후원 팝업 */}
      {showDonorPopup && (
        <div
          onClick={() => setShowDonorPopup(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 24,
              maxWidth: 420, width: "100%", overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ background: "#F5C400", padding: "26px 24px 20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: "#7a620090", textTransform: "uppercase", margin: "0 0 6px" }}>Limited Event</p>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: "#1a1000", margin: 0, lineHeight: 1.3 }}>
                💛 후원자 명예의 전당<br/>등재 이벤트
              </h3>
            </div>
            <div style={{ padding: "20px 24px 24px" }}>
              <p style={{ fontSize: 14, color: "#1a1a1a", lineHeight: 1.75, fontWeight: 600, marginBottom: 14 }}>
                후원에 참여해 주시면<br/>
                <span style={{ color: "#c49500", fontWeight: 900 }}>사이트 메인 화면 명예의 전당</span>에<br/>
                닉네임이 영구 등재됩니다.
              </p>
              <div style={{ background: "#fffbea", border: "1.5px solid #F5C40060", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#7a6200", margin: 0, lineHeight: 1.8 }}>
                  ✅ 후원 확인 즉시 이름 반영<br/>
                  ✅ 원하는 닉네임으로 등재<br/>
                  ✅ 이 사이트가 운영되는 한 영구 유지<br/>
                  ✅ 범죄 예방 교육에 직접 기여
                </p>
              </div>
              <div style={{ background: "#F5C400", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 900, color: "#1a1000", textAlign: "center" }}>
                후원 문의하기 →
              </div>
              <button onClick={() => setShowDonorPopup(false)} style={{ display: "block", width: "100%", marginTop: 12, background: "none", border: "none", fontSize: 11, color: "#aaa", cursor: "pointer", textDecoration: "underline" }}>
                닫기 (테스트)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 후기 팝업 */}
      {showReviewPopup && (
        <div
          onClick={() => setShowReviewPopup(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 32,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#0d0d1e", border: "1px solid #534AB730",
              borderRadius: 24, maxWidth: 420, width: "calc(100% - 32px)", overflow: "hidden",
              boxShadow: "0 -8px 60px rgba(83,74,183,0.25)",
            }}
          >
            <div style={{ background: "linear-gradient(135deg,#534AB7,#7c3aed)", padding: "20px 22px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>💜</span>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: "#c4b5fd70", textTransform: "uppercase", margin: "0 0 4px" }}>소중한 한 마디</p>
                  <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 900, margin: 0 }}>후기를 남겨주세요</h3>
                </div>
              </div>
            </div>
            <div style={{ padding: "18px 22px 20px" }}>
              <p style={{ color: "#c4b5fd", fontSize: 13, lineHeight: 1.85, marginBottom: 14, fontWeight: 600 }}>
                짧은 한 마디라도 방명록에 남겨주시면<br/>
                <span style={{ color: "#a78bfa", fontWeight: 900 }}>영원히 소중히 간직하겠습니다.</span>
              </p>
              <div style={{ background: "#1a1a2e", border: "1px solid #534AB730", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                <p style={{ color: "#6b7280", fontSize: 12, margin: 0, lineHeight: 1.8 }}>
                  💜 방명록은 <strong style={{ color: "#a78bfa" }}>영구 보존</strong>됩니다<br/>
                  💜 익명으로 작성 가능합니다<br/>
                  💜 성별 · 나잇대만 선택하면 끝!
                </p>
              </div>
              <button onClick={() => setShowReviewPopup(false)} style={{ display: "block", width: "100%", background: "none", border: "none", fontSize: 11, color: "#374151", cursor: "pointer", textDecoration: "underline", marginTop: 8 }}>
                닫기 (테스트)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
