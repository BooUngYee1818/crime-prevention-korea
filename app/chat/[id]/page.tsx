"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Send, Smile } from "lucide-react";
import { Character, Message, STYLE_LABELS, STYLE_COLORS } from "@/lib/types";
import { getCharacters, getChatRoom, addMessage } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

type L = "ko"|"en"|"ja"|"zh"|"vi"|"es"|"de"|"fr"|"hi"|"pt";

const MOOD_TR: Record<string, Record<L, string>> = {
  분노: { ko:"분노", en:"Anger",     ja:"怒り",   zh:"愤怒", vi:"Tức giận",   es:"Ira",       de:"Wut",        fr:"Colère",      hi:"क्रोध",  pt:"Raiva" },
  슬픔: { ko:"슬픔", en:"Sadness",   ja:"悲しみ", zh:"悲伤", vi:"Buồn bã",   es:"Tristeza",  de:"Traurigkeit",fr:"Tristesse",   hi:"दुख",    pt:"Tristeza" },
  설렘: { ko:"설렘", en:"Excitement",ja:"ときめき",zh:"心动", vi:"Hồi hộp",   es:"Emoción",   de:"Aufregung",  fr:"Excitation",  hi:"उत्साह", pt:"Animação" },
  기쁨: { ko:"기쁨", en:"Joy",       ja:"喜び",   zh:"喜悦", vi:"Vui mừng",  es:"Alegría",   de:"Freude",     fr:"Joie",        hi:"खुशी",   pt:"Alegria" },
  심심: { ko:"심심", en:"Bored",     ja:"退屈",   zh:"无聊", vi:"Chán",      es:"Aburrido",  de:"Gelangweilt",fr:"Ennui",       hi:"उबाऊ",   pt:"Entediado" },
  일반: { ko:"일반", en:"Normal",    ja:"普通",   zh:"普通", vi:"Bình thường",es:"Normal",    de:"Normal",     fr:"Normal",      hi:"सामान्य",pt:"Normal" },
};

function tr(map: Record<L, string>, lang: string) {
  return map[lang as L] ?? map["en"];
}

const PLACEHOLDER: Record<L, string> = {
  ko:"메시지 입력...", en:"Type a message...", ja:"メッセージを入力...",
  zh:"输入消息...", vi:"Nhập tin nhắn...", es:"Escribe un mensaje...",
  de:"Nachricht eingeben...", fr:"Écrire un message...", hi:"संदेश लिखें...", pt:"Digite uma mensagem...",
};
const EMPTY_MSG: Record<L, string> = {
  ko:"에게 말을 걸어보세요", en:"Say something to", ja:"に話しかけてみてください",
  zh:"和", vi:"Hãy nói chuyện với", es:"Dile algo a",
  de:"Sag etwas zu", fr:"Dites quelque chose à", hi:"से बात करें", pt:"Diga algo para",
};
const DETECTED: Record<L, string> = {
  ko:"감지", en:"detected", ja:"検知", zh:"检测", vi:"phát hiện", es:"detectado",
  de:"erkannt", fr:"détecté", hi:"पहचाना", pt:"detectado",
};

const EMOJIS = ["😂","😍","🥺","😡","😭","🔥","💀","👊","💕","🤣","😘","🫠"];

const MOOD_COLORS: Record<string, string> = {
  분노: "#ef4444", 슬픔: "#818cf8", 설렘: "#ec4899",
  기쁨: "#f59e0b", 심심: "#6b7280", 일반: "#374151",
};

export default function ChatPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();

  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);

  useEffect(() => {
    const char = getCharacters().find((c) => c.id === id);
    if (!char) { router.push("/"); return; }
    setCharacter(char);
    setMessages(getChatRoom(id).messages);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const content = text || input.trim();
    if (!content || loading || !character) return;
    setInput(""); setShowEmoji(false);

    const userMsg: Message = { id: Date.now().toString(), role: "user", content, timestamp: Date.now() };
    const updated = addMessage(id, userMsg);
    setMessages([...updated.messages]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character, messages: updated.messages.slice(-20), userMessage: content, lang }),
      });
      const data = await res.json();
      if (data.mood) setCurrentMood(data.mood);
      const aiMsg: Message = {
        id: (Date.now()+1).toString(), role: "assistant",
        content: data.reply || "...", mood: data.mood,
        subtitle: data.subtitle,
        timestamp: Date.now(),
      };
      setMessages([...addMessage(id, aiMsg).messages]);
    } catch {
      setMessages([...addMessage(id, { id: (Date.now()+1).toString(), role: "assistant", content: t("chat_error", lang), timestamp: Date.now() }).messages]);
    } finally {
      setLoading(false);
    }
  }

  if (!character) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0d0d0d" }}>

      {/* 헤더 */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "52px 16px 12px",
        borderBottom: "0.5px solid #1e1e1e", flexShrink: 0,
        background: "#0d0d0d",
      }}>
        <button onClick={() => router.push("/")} style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: "#888" }}>
          <ArrowLeft size={20} />
        </button>
        {character.photo
          ? <img src={character.photo} alt={character.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
          : <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
        }
        <div style={{ flex: 1 }}>
          <p style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{character.name}</p>
          <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
            {character.style.slice(0, 2).map((s) => (
              <span key={s} style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 20,
                background: STYLE_COLORS[s].bg + "44", color: STYLE_COLORS[s].text,
              }}>{STYLE_LABELS[s]}</span>
            ))}
          </div>
        </div>
        {currentMood && (
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "#1a1a1a", borderRadius: 30, padding: "4px 10px",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: MOOD_COLORS[currentMood] || "#6b7280", animation: "pulse 1.5s infinite" }} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <span style={{ fontSize: 11, color: MOOD_COLORS[currentMood] || "#9ca3af" }}>{currentMood}</span>
              {lang !== "ko" && (
                <span style={{ fontSize: 9, color: (MOOD_COLORS[currentMood] || "#9ca3af") + "99" }}>
                  {MOOD_TR[currentMood]?.[lang as L] ?? ""}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 메시지 목록 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 4 }}>
            <span style={{ color: "#444", fontSize: 13 }}>{character.name}에게 말을 걸어보세요</span>
            {lang !== "ko" && (
              <span style={{ color: "#333", fontSize: 11 }}>
                {lang === "zh" || lang === "vi"
                  ? `${EMPTY_MSG[lang as L]} ${character.name}`
                  : `${EMPTY_MSG[lang as L]} ${character.name}`}
              </span>
            )}
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
            {msg.role === "assistant" && (
              <div style={{ flexShrink: 0, alignSelf: "flex-end" }}>
                {character.photo
                  ? <img src={character.photo} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
                  : <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>👤</div>
                }
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: "74%", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              {msg.role === "assistant" && msg.mood && (
                <span style={{
                  fontSize: 10, padding: "2px 7px", borderRadius: 20, marginLeft: 4,
                  background: (MOOD_COLORS[msg.mood] || "#374151") + "30",
                  color: MOOD_COLORS[msg.mood] || "#9ca3af",
                  display: "flex", flexDirection: "column", gap: 0,
                }}>
                  <span>{msg.mood} 감지</span>
                  {lang !== "ko" && (
                    <span style={{ fontSize: 9, opacity: 0.7 }}>
                      {MOOD_TR[msg.mood]?.[lang as L] ?? ""} {DETECTED[lang as L]}
                    </span>
                  )}
                </span>
              )}
              <div style={{
                padding: "10px 14px", fontSize: 14, lineHeight: 1.55, color: "#fff",
                background: msg.role === "user" ? "#534AB7" : "#1e1e1e",
                borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
              }}>
                {msg.content}
                {msg.subtitle && (
                  <p style={{
                    margin: "6px 0 0", paddingTop: 6,
                    borderTop: "1px solid #ffffff18",
                    fontSize: 11, color: "#ffffff80", lineHeight: 1.5,
                    fontStyle: "italic",
                  }}>
                    {msg.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>👤</div>
            <div style={{ background: "#1e1e1e", padding: "12px 16px", borderRadius: "4px 18px 18px 18px", display: "flex", gap: 4 }}>
              {[0, 150, 300].map((d) => (
                <span key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "#666", display: "inline-block", animation: `bounce 1s ${d}ms infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 이모지 패널 */}
      {showEmoji && (
        <div style={{ padding: "12px 16px", background: "#111", borderTop: "0.5px solid #1e1e1e", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {EMOJIS.map((e) => (
              <button key={e} onClick={() => sendMessage(e)} style={{ fontSize: 24, background: "none", border: "none", cursor: "pointer", padding: 4 }}>{e}</button>
            ))}
          </div>
        </div>
      )}

      {/* 입력창 */}
      <div style={{ padding: "8px 16px 32px", background: "#0d0d0d", borderTop: "0.5px solid #1e1e1e", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1a1a1a", borderRadius: 24, padding: "6px 8px 6px 14px" }}>
          <button onClick={() => setShowEmoji((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: showEmoji ? "#534AB7" : "#555", padding: 4 }}>
            <Smile size={20} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={lang === "ko" ? "메시지 입력..." : `메시지 입력... · ${PLACEHOLDER[lang as L]}`}
            style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 14, outline: "none" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer",
              background: input.trim() && !loading ? "#534AB7" : "#2a2a2a",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "background 0.15s",
            }}
          >
            <Send size={14} color="#fff" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}
