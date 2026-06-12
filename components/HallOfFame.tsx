"use client";
import { useEffect, useState } from "react";

const DONORS = [
  "부엉이 안", "양진오", "노영국이", "김미경", "주현옥",
  "안성태", "김진은", "양도상국", "장리관", "인국은",
];

const ROWS = [
  { dir: 1,  size: 88,  speed: 38, rot: -2 },
  { dir: -1, size: 72,  speed: 30, rot:  1.5 },
  { dir: 1,  size: 96,  speed: 44, rot: -1 },
  { dir: -1, size: 80,  speed: 34, rot:  2 },
  { dir: 1,  size: 68,  speed: 28, rot: -1.5 },
  { dir: -1, size: 104, speed: 50, rot:  1 },
  { dir: 1,  size: 76,  speed: 36, rot: -2.5 },
];

function makeTrack(rowIdx: number) {
  const shuffled = [...DONORS].sort(() => Math.sin(rowIdx * 7.3 + Math.PI) - 0.5);
  return [...shuffled, ...shuffled, ...shuffled, ...shuffled];
}

export default function HallOfFame() {
  return (
    <section style={{
      width: "100%", background: "#ffffff",
      overflow: "hidden", padding: "0",
      position: "relative",
    }}>
      <style>{`
        @keyframes scrollL { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes scrollR { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        .hof-track-l { animation: scrollL linear infinite; }
        .hof-track-r { animation: scrollR linear infinite; }
        .hof-track-l:hover, .hof-track-r:hover { animation-play-state: paused; }
      `}</style>

      {/* 타이틀 */}
      <div style={{
        textAlign: "center", paddingTop: 56, paddingBottom: 32,
        position: "relative", zIndex: 2,
      }}>
        <p style={{
          fontSize: 13, fontWeight: 800, letterSpacing: 6,
          color: "#d4a00080", textTransform: "uppercase", marginBottom: 10,
        }}>Hall of Fame</p>
        <h2 style={{
          fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900,
          color: "#1a1a1a", margin: 0, lineHeight: 1.2,
        }}>
          💛 후원자 명예의 전당
        </h2>
        <p style={{
          marginTop: 14, fontSize: 15, color: "#888",
          fontWeight: 500,
        }}>
          이 프로그램을 함께 키워주신 분들입니다
        </p>
      </div>

      {/* 스크롤 마퀴 열들 */}
      <div style={{ paddingBottom: 48 }}>
        {ROWS.map((row, ri) => {
          const track = makeTrack(ri);
          const dur = `${(track.length / 4) * (100 / row.speed)}s`;
          return (
            <div key={ri} style={{
              overflow: "hidden",
              transform: `rotate(${row.rot}deg) scaleX(1.08)`,
              margin: `${ri === 0 ? 8 : -6}px 0`,
            }}>
              <div
                className={row.dir === 1 ? "hof-track-l" : "hof-track-r"}
                style={{
                  display: "flex", width: "200%",
                  animationDuration: dur,
                  willChange: "transform",
                }}
              >
                {track.map((name, ni) => (
                  <span
                    key={ni}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: row.size,
                      fontWeight: 900,
                      color: "#F5C400",
                      whiteSpace: "nowrap",
                      padding: "0 32px",
                      lineHeight: 1.15,
                      textShadow: "3px 3px 0 #d4a00040",
                      fontFamily: "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
                    }}
                  >
                    {name}
                    <span style={{ color: "#F5C40030", fontSize: row.size * 0.4, margin: "0 18px" }}>✦</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 그라데이션 마스크 */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
        background: "linear-gradient(to bottom, transparent, #ffffff)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 60,
        background: "linear-gradient(to top, transparent, #ffffff)",
        pointerEvents: "none",
      }} />
    </section>
  );
}
