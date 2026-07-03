"use client";
import { useState, useEffect, useRef } from "react";

export interface ChatMsg {
  from: "scammer" | "user";
  text: string;
  suggestions?: string[];   // 사용자 차례일 때 보여줄 추천 답변 칩
}

interface Props {
  script: ChatMsg[];
  header: {
    icon: string;
    name: string;
    sub?: string;
    badge?: string;
    badgeColor?: string;
    bg?: string;
  };
  userBubbleColor?: string;
  scamBubbleColor?: string;
  placeholder?: string;
  onComplete: () => void;
}

export default function CrimeChat({
  script,
  header,
  userBubbleColor  = "#4c1d95",
  scamBubbleColor  = "#111827",
  placeholder      = "메시지 입력...",
  onComplete,
}: Props) {
  const [shown, setShown]   = useState<ChatMsg[]>([]);
  const [cursor, setCursor] = useState(0);
  const [typing, setTyping] = useState(false);
  const [input, setInput]   = useState("");
  const [done, setDone]     = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // 스캐머 메시지 자동 표시
  useEffect(() => {
    if (done || cursor >= script.length) return;
    const msg = script[cursor];
    if (msg.from === "user") return;

    setTyping(true);
    const delay = 800 + msg.text.length * 15;
    const t = setTimeout(() => {
      setTyping(false);
      setShown(prev => [...prev, msg]);
      setCursor(c => c + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [cursor, done, script]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [shown, typing]);

  function send(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || typing || done) return;

    const expected = script[cursor];
    if (!expected || expected.from !== "user") return;

    setShown(prev => [...prev, { from: "user", text }]);
    setInput("");
    const next = cursor + 1;
    setCursor(next);
    inputRef.current?.focus();

    if (next >= script.length) {
      setTimeout(() => { setDone(true); onComplete(); }, 600);
    }
  }

  const isUserTurn = !done && cursor < script.length && script[cursor]?.from === "user" && !typing;
  const suggestions = isUserTurn ? (script[cursor]?.suggestions ?? []) : [];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", flexDirection: "column", background: "#080808" }}>

      {/* 헤더 */}
      <div style={{
        background: header.bg ?? "#111827",
        borderBottom: "1px solid #1f2937",
        padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
        flexShrink: 0,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "linear-gradient(135deg,#374151,#4b5563)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0,
        }}>
          {header.icon}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: "#f9fafb", fontWeight: 700, fontSize: 14, margin: 0 }}>{header.name}</p>
          {header.sub && <p style={{ color: "#22c55e", fontSize: 11, margin: 0 }}>{header.sub}</p>}
        </div>
        {header.badge && (
          <div style={{
            background: (header.badgeColor ?? "#374151") + "33",
            border: `1px solid ${header.badgeColor ?? "#374151"}`,
            borderRadius: 20, padding: "3px 10px",
          }}>
            <span style={{ color: header.badgeColor ?? "#94a3b8", fontSize: 10, fontWeight: 700 }}>
              {header.badge}
            </span>
          </div>
        )}
      </div>

      {/* 메시지 목록 */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "16px 14px",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {shown.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "78%",
              background: msg.from === "user" ? userBubbleColor : scamBubbleColor,
              border: msg.from === "scammer" ? "1px solid #1f2937" : "none",
              borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "10px 14px",
            }}>
              <p style={{ color: "#f9fafb", fontSize: 14, lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ display: "flex" }}>
            <div style={{
              background: scamBubbleColor,
              border: "1px solid #1f2937",
              borderRadius: "18px 18px 18px 4px",
              padding: "12px 18px",
            }}>
              <span style={{ color: "#6b7280", fontSize: 20, letterSpacing: 2 }}>• • •</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 추천 답변 칩 */}
      {suggestions.length > 0 && (
        <div style={{
          display: "flex", gap: 8, overflowX: "auto",
          padding: "10px 14px 0",
          flexShrink: 0,
          scrollbarWidth: "none",
        }}>
          <style>{`.chip-row::-webkit-scrollbar { display: none; }`}</style>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => send(s)}
              style={{
                flexShrink: 0,
                background: "transparent",
                border: `1.5px solid ${userBubbleColor}`,
                borderRadius: 20,
                padding: "7px 14px",
                color: "#e2e8f0",
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = userBubbleColor + "55")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* 입력창 */}
      <div style={{
        background: "#111827",
        borderTop: "1px solid #1f2937",
        padding: "10px 12px",
        display: "flex", gap: 8, alignItems: "flex-end",
        flexShrink: 0,
        marginTop: suggestions.length > 0 ? 8 : 0,
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={isUserTurn ? placeholder : "상대방이 입력 중..."}
          disabled={!isUserTurn}
          style={{
            flex: 1,
            background: isUserTurn ? "#1f2937" : "#0f172a",
            border: "1px solid #374151",
            borderRadius: 22,
            padding: "10px 16px",
            color: "#f9fafb",
            fontSize: 14,
            outline: "none",
            opacity: isUserTurn ? 1 : 0.45,
            transition: "opacity 0.2s",
          }}
        />
        <button
          onClick={() => send()}
          disabled={!isUserTurn || !input.trim()}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            background: isUserTurn && input.trim() ? userBubbleColor : "#1f2937",
            border: "none", cursor: isUserTurn && input.trim() ? "pointer" : "default",
            color: "#fff", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s", flexShrink: 0,
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
