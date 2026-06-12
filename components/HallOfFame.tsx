"use client";
import { useEffect, useState } from "react";

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
  const [names, setNames] = useState<string[]>(FALLBACK);

  useEffect(() => {
    fetch("/api/donors")
      .then(r => r.json())
      .then(d => { if (d.donors?.length > 0) setNames(d.donors); })
      .catch(() => {});
  }, []);

  const list = names.length > 0 ? names : FALLBACK;

  return (
    <section style={{ width: "100%", background: "#ffffff", overflow: "hidden" }}>
      <style>{`
        @keyframes scrollL { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes scrollR { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        .hof-t:hover { animation-play-state: paused !important; }
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

      {/* 마퀴 열 */}
      <div style={{ paddingBottom: 48 }}>
        {ROWS_CFG.map((row, ri) => {
          const shuffled = [...list].sort(() => Math.sin(ri * 5.1 + 1) - 0.5);
          const repeat = Math.max(3, Math.ceil(20 / list.length));
          const unit = shuffled.map(n =>
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
                  display: "flex",
                  width: "200%",
                  animation: `${row.dir === 1 ? "scrollL" : "scrollR"} ${dur}s linear infinite`,
                  willChange: "transform",
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
