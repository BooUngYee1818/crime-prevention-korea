"use client";
import { useState, useEffect, useRef } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface Props {
  systemPrompt: string;      // 사기꾼 캐릭터 설정 프롬프트
  openingMessage: string;    // 첫 번째 사기꾼 메시지
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
  maxTurns?: number;         // 몇 번 주고받으면 결말로 이동
  onComplete: () => void;
}

export default function AiCrimeChat({
  systemPrompt,
  openingMessage,
  header,
  userBubbleColor  = "#4c1d95",
  scamBubbleColor  = "#111827",
  placeholder      = "메시지를 입력하세요...",
  maxTurns         = 6,
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
        body: JSON.stringify({
          systemPrompt,
          messages: newMessages,
        }),
      });
      const data = await res.json();
      const aiMsg: Message = { role: "assistant", content: data.content };
      setMessages(prev => [...prev, aiMsg]);

      if (nextTurns >= maxTurns) {
        setTimeout(() => onComplete(), 1200);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "..." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

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
        {/* 진행도 */}
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {Array.from({ length: maxTurns }).map((_, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: i < turns ? (header.badgeColor ?? "#a855f7") : "#374151",
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
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "78%",
              background: msg.role === "user" ? userBubbleColor : scamBubbleColor,
              border: msg.role === "assistant" ? "1px solid #1f2937" : "none",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "10px 14px",
            }}>
              <p style={{ color: "#f9fafb", fontSize: 14, lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {/* AI 타이핑 중 */}
        {loading && (
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

      {/* 입력창 */}
      <div style={{
        background: "#111827",
        borderTop: "1px solid #1f2937",
        padding: "10px 12px",
        display: "flex", gap: 8, alignItems: "flex-end",
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
            background: loading ? "#0f172a" : "#1f2937",
            border: "1px solid #374151",
            borderRadius: 22,
            padding: "10px 16px",
            color: "#f9fafb",
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
            background: !loading && input.trim() ? userBubbleColor : "#1f2937",
            border: "none",
            cursor: !loading && input.trim() ? "pointer" : "default",
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
