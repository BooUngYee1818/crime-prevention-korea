"use client";
import { useState, useEffect, useRef } from "react";

export interface ChatMsg {
  from: "scammer" | "user";
  text: string;
}

interface Props {
  script: ChatMsg[];           // 전체 대화 스크립트
  header: {                    // 채팅방 헤더
    icon: string;
    name: string;
    sub?: string;
    badge?: string;
    badgeColor?: string;
    bg?: string;
  };
  userBubbleColor?: string;    // 내 말풍선 색
  scamBubbleColor?: string;    // 상대방 말풍선 색
  placeholder?: string;        // 입력창 힌트
  onComplete: () => void;      // 스크립트 끝나면 호출
}

export default function CrimeChat({
  script,
  header,
  userBubbleColor  = "#4c1d95",
  scamBubbleColor  = "#111827",
  placeholder      = "메시지 입력...",
  onComplete,
}: Props) {
  // 화면에 보여진 메시지들
  const [shown, setShown]       = useState<ChatMsg[]>([]);
  // 스크립트 커서 (다음에 처리할 index)
  const [cursor, setCursor]     = useState(0);
  // 상대방 타이핑 중
  const [typing, setTyping]     = useState(false);
  // 사용자 입력값
  const [input, setInput]       = useState("");
  // 완료 여부
  const [done, setDone]         = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // 자동으로 scammer 메시지 보여주기
  useEffect(() => {
    if (done || cursor >= script.length) return;

    const msg = script[cursor];

    // 사용자 차례면 자동 진행 안 함 — 입력 기다림
    if (msg.from === "user") return;

    // scammer 메시지: 타이핑 딜레이 후 표시
    setTyping(true);
    const delay = 900 + msg.text.length * 18;
    const t = setTimeout(() => {
      setTyping(false);
      setShown(prev => [...prev, msg]);
      setCursor(c => c + 1);
    }, delay);

    return () => clearTimeout(t);
  }, [cursor, done, script]);

  // 스크롤 맨 아래
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [shown, typing]);

  // 사용자 메시지 전송
  function send() {
    const text = input.trim();
    if (!text || typing || done) return;

    const expected = script[cursor];
    if (!expected || expected.from !== "user") return;

    // 사용자 메시지 표시
    setShown(prev => [...prev, { from: "user", text }]);
    setInput("");
    const next = cursor + 1;
    setCursor(next);
    inputRef.current?.focus();

    // 스크립트 끝이면 완료
    if (next >= script.length) {
      setTimeout(() => { setDone(true); onComplete(); }, 600);
    }
  }

  // 현재 사용자 차례인지
  const isUserTurn = !done && cursor < script.length && script[cursor]?.from === "user" && !typing;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#080808" }}>

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

        {/* 타이핑 인디케이터 */}
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
          onClick={send}
          disabled={!isUserTurn || !input.trim()}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            background: isUserTurn && input.trim() ? "#534AB7" : "#1f2937",
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
