"use client";
import { useState, useEffect, useRef } from "react";

const ROWS_CFG = [
  { dir:  1, sz: 88,  rot: -2,   spd: 10 },
  { dir: -1, sz: 72,  rot:  1.5, spd:  8 },
  { dir:  1, sz: 96,  rot: -1,   spd: 11 },
  { dir: -1, sz: 80,  rot:  2,   spd:  9 },
  { dir:  1, sz: 68,  rot: -1.5, spd:  8 },
  { dir: -1, sz: 104, rot:  1,   spd: 12 },
  { dir:  1, sz: 76,  rot: -2.5, spd:  9 },
];

const STORAGE_KEY = "hof_donors_list";

function HallPreview({ names }: { names: string[] }) {
  if (names.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 0", color: "#ccc", fontSize: 16 }}>
      이름을 추가해보세요
    </div>
  );

  return (
    <div style={{ overflow: "hidden", paddingBottom: 24 }}>
      {ROWS_CFG.map((row, ri) => {
        const shuffled = [...names].sort(() => Math.sin(ri * 5.1 + 1) - 0.5);
        const repeat = Math.max(3, Math.ceil(20 / names.length));
        const unit = shuffled.map(n =>
          `<span style="display:inline-block;font-size:${row.sz}px;font-weight:900;color:#F5C400;padding:0 14px;line-height:1.12;white-space:nowrap;text-shadow:2px 2px 0 #d4a00033;font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;">${n}<span style="color:#F5C40028;font-size:${Math.round(row.sz*0.28)}px;margin:0 8px;">·</span></span>`
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
}

export default function HofTestPage() {
  const [names, setNames] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 저장된 목록 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setNames(JSON.parse(saved)); } catch {}
    }
  }, []);

  function save(list: string[]) {
    setNames(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function notify(text: string, ok = true) {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 2000);
  }

  function addName() {
    const v = input.trim();
    if (!v) return;
    if (names.includes(v)) { notify("이미 있는 이름이에요", false); return; }
    save([...names, v]);
    setInput("");
    notify(`✅ ${v} 추가됨`);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function removeName(i: number) {
    const updated = names.filter((_, idx) => idx !== i);
    save(updated);
    notify("🗑 삭제됨");
  }

  function copyCode() {
    const code = `const DONORS = [\n${names.map(n => `  "${n}",`).join("\n")}\n];`;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0d0d1e",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "36px 32px",
          maxWidth: 360, width: "100%", textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 6px" }}>관리자 인증</h2>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 24px" }}>명예의 전당 관리 페이지</p>
          <input
            type="password"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && keyInput === "bueong2025" && setAuthed(true)}
            placeholder="관리자 키 입력"
            style={{
              width: "100%", padding: "11px 14px", borderRadius: 10,
              border: "1.5px solid #ddd", fontSize: 14, outline: "none",
              marginBottom: 12, boxSizing: "border-box",
            }}
          />
          <button
            onClick={() => {
              if (keyInput === "bueong2025") setAuthed(true);
              else { alert("키가 틀렸습니다"); setKeyInput(""); }
            }}
            style={{
              width: "100%", padding: "12px 0",
              background: "#F5C400", border: "none", borderRadius: 10,
              fontWeight: 900, fontSize: 14, cursor: "pointer", color: "#1a1000",
            }}
          >
            입장하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8" }}>
      <style>{`
        @keyframes scrollL { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes scrollR { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* 헤더 */}
      <div style={{
        background: "#1a1a2e", color: "#fff",
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
      }}>
        <div>
          <p style={{ fontSize: 10, color: "#F5C400", fontWeight: 800, letterSpacing: 2, margin: "0 0 2px" }}>🧪 ADMIN TEST</p>
          <h1 style={{ fontSize: 17, fontWeight: 900, margin: 0 }}>명예의 전당 관리</h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {msg && (
            <span style={{
              fontSize: 13, fontWeight: 700,
              color: msg.ok ? "#F5C400" : "#ef4444",
              animation: "fadeIn 0.2s ease",
            }}>
              {msg.text}
            </span>
          )}
          <span style={{ fontSize: 12, color: "#ffffff40" }}>현재 {names.length}명</span>
        </div>
      </div>

      {/* 컨트롤 */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "16px 24px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addName()}
            placeholder="후원자 닉네임 입력 후 Enter"
            maxLength={20}
            autoFocus
            style={{
              flex: 1, minWidth: 160, padding: "10px 14px",
              borderRadius: 8, border: "1.5px solid #F5C400",
              fontSize: 15, outline: "none", fontWeight: 600,
            }}
          />
          <button
            onClick={addName}
            disabled={!input.trim()}
            style={{
              padding: "10px 20px", background: "#F5C400", border: "none",
              borderRadius: 8, fontWeight: 900, fontSize: 14, cursor: "pointer", color: "#1a1000",
              opacity: input.trim() ? 1 : 0.5,
            }}
          >
            + 추가
          </button>
          <button
            onClick={() => { if (confirm("전체 삭제할까요?")) { save([]); notify("🔄 초기화됨"); } }}
            style={{
              padding: "10px 14px", background: "#fee2e2", border: "none",
              borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", color: "#991b1b",
            }}
          >
            전체 삭제
          </button>
        </div>

        {/* 이름 태그 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: names.length > 0 ? 14 : 0 }}>
          {names.map((n, i) => (
            <div key={i} style={{
              background: "#FFF9E0", border: "1.5px solid #F5C400",
              borderRadius: 20, padding: "5px 12px",
              fontSize: 13, fontWeight: 700, color: "#7a6200",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 11, color: "#d4a000", marginRight: 2 }}>#{i + 1}</span>
              {n}
              <span
                onClick={() => removeName(i)}
                style={{ cursor: "pointer", color: "#ddd", fontSize: 16, lineHeight: 1, marginLeft: 2 }}
              >×</span>
            </div>
          ))}
          {names.length === 0 && (
            <span style={{ fontSize: 12, color: "#ccc", padding: "4px 0" }}>아직 등재된 후원자가 없습니다</span>
          )}
        </div>

        {/* 코드 복사 버튼 */}
        {names.length > 0 && (
          <div style={{
            background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10,
            padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: "#0369a1", margin: "0 0 2px" }}>✅ 목록 확정 후 코드 복사</p>
              <p style={{ fontSize: 11, color: "#0284c7", margin: 0 }}>
                복사 후 Claude에게 붙여넣기하면 사이트에 바로 적용됩니다
              </p>
            </div>
            <button
              onClick={copyCode}
              style={{
                padding: "9px 18px", background: copied ? "#22c55e" : "#0ea5e9",
                border: "none", borderRadius: 8, color: "#fff",
                fontWeight: 800, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              {copied ? "✅ 복사됨!" : "📋 코드 복사"}
            </button>
          </div>
        )}
      </div>

      {/* 명예의 전당 미리보기 */}
      <div style={{ background: "#ffffff" }}>
        <div style={{ textAlign: "center", paddingTop: 48, paddingBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 5, color: "#d4a00060", textTransform: "uppercase", marginBottom: 8 }}>
            Hall of Fame
          </p>
          <h2 style={{ fontSize: "clamp(24px, 4.5vw, 46px)", fontWeight: 900, color: "#1a1a1a", margin: "0 0 8px" }}>
            💛 후원자 명예의 전당
          </h2>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>이 프로그램을 함께 키워주신 분들입니다</p>
        </div>
        <HallPreview names={names} />
      </div>

      <div style={{ textAlign: "center", padding: "20px 0 40px" }}>
        <a href="/" style={{ fontSize: 13, color: "#888", textDecoration: "underline" }}>← 메인 사이트로 돌아가기</a>
      </div>
    </div>
  );
}
