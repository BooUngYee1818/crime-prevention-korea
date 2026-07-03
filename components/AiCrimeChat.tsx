"use client";
import { useState, useEffect, useRef } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface Props {
  systemPrompt: string;
  openingMessage: string;
  header: {
    icon: string;
    name: string;
    sub?: string;
    badge?: string;
    badgeColor?: string;
    bg?: string;
  };
  userBubbleColor?: string;
  placeholder?: string;
  maxTurns?: number;
  onComplete: () => void;
}

export default function AiCrimeChat({
  systemPrompt,
  openingMessage,
  header,
  userBubbleColor = "#6366f1",
  placeholder     = "메시지를 입력하세요...",
  maxTurns        = 6,
  onComplete,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: openingMessage },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [turns, setTurns]     = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("crime-play-start"));
    return () => { window.dispatchEvent(new CustomEvent("crime-play-end")); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const nextTurns = turns + 1;
    setTurns(nextTurns);

    try {
      const res = await fetch("/api/crime-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, messages: newMessages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
      if (nextTurns >= maxTurns) setTimeout(() => onComplete(), 1200);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "..." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const accentColor = header.badgeColor ?? userBubbleColor;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", flexDirection: "column", background: "#f7f7f7" }}>

      {/* 헤더 */}
      <div style={{
        background: header.bg ?? "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "48px 16px 14px",
        display: "flex", alignItems: "center", gap: 12,
        flexShrink: 0,
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: accentColor + "22",
          border: `2px solid ${accentColor}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0,
        }}>
          {header.icon}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: "#1a1a1a", fontWeight: 700, fontSize: 15, margin: 0 }}>{header.name}</p>
          {header.sub && <p style={{ color: "#22c55e", fontSize: 11, margin: 0 }}>{header.sub}</p>}
        </div>
        {header.badge && (
          <div style={{
            background: accentColor + "18",
            border: `1px solid ${accentColor}44`,
            borderRadius: 20, padding: "3px 10px",
          }}>
            <span style={{ color: accentColor, fontSize: 10, fontWeight: 700 }}>
              {header.badge}
            </span>
          </div>
        )}
        {/* 진행도 */}
        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          {Array.from({ length: maxTurns }).map((_, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: i < turns ? accentColor : "#e5e7eb",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* 메시지 목록 */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "16px 14px",
        display: "flex", flexDirection: "column", gap: 10,
        background: "#f7f7f7",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            alignItems: "flex-end", gap: 6,
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "#fff",
                border: "1px solid #e5e7eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}>
                {header.icon}
              </div>
            )}
            <div style={{
              maxWidth: "74%",
              background: msg.role === "user"
                ? `linear-gradient(135deg,${userBubbleColor},${userBubbleColor}dd)`
                : "#ffffff",
              borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
              padding: "10px 14px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}>
              <p style={{
                color: msg.role === "user" ? "#fff" : "#1a1a1a",
                fontSize: 14, lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap",
              }}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "#fff", border: "1px solid #e5e7eb",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}>
              {header.icon}
            </div>
            <div style={{
              background: "#fff",
              borderRadius: "4px 18px 18px 18px",
              padding: "12px 18px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}>
              <span style={{ display: "flex", gap: 4 }}>
                {[0, 150, 300].map(d => (
                  <span key={d} style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#d1d5db", display: "inline-block",
                    animation: "bounce 1s infinite",
                    animationDelay: `${d}ms`,
                  }} />
                ))}
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div style={{
        background: "#ffffff",
        borderTop: "1px solid #f0f0f0",
        padding: "10px 14px 24px",
        display: "flex", gap: 8, alignItems: "center",
        flexShrink: 0,
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }}
          placeholder={loading ? "상대방이 답하는 중..." : placeholder}
          disabled={loading}
          style={{
            flex: 1,
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
            borderRadius: 24,
            padding: "10px 16px",
            color: "#1a1a1a",
            fontSize: 14,
            outline: "none",
            opacity: loading ? 0.5 : 1,
            transition: "opacity 0.2s",
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            background: !loading && input.trim()
              ? `linear-gradient(135deg,${userBubbleColor},${userBubbleColor}bb)`
              : "#e5e7eb",
            border: "none",
            cursor: !loading && input.trim() ? "pointer" : "default",
            color: "#fff", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s", flexShrink: 0,
            boxShadow: !loading && input.trim() ? `0 2px 8px ${userBubbleColor}44` : "none",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
