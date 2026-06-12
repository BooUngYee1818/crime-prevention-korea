"use client";
import { useEffect, useState } from "react";

const MESSAGES = [
  {
    lang: "한국어",
    flag: "🇰🇷",
    main: "이 프로그램을 찾아주셔서 진심으로 감사합니다.",
    sub: "여러분이 한 번 더 의심하게 된다면, 그것만으로 충분합니다.",
  },
  {
    lang: "English",
    flag: "🌏",
    main: "Thank you sincerely for using this program.",
    sub: "If this makes you pause and think twice, that's everything.",
  },
  {
    lang: "日本語",
    flag: "🇯🇵",
    main: "このプログラムをご利用いただき、心より感謝申し上げます。",
    sub: "一度立ち止まって考えるきっかけになれば、それで十分です。",
  },
  {
    lang: "中文",
    flag: "🇨🇳",
    main: "衷心感谢您使用本程序。",
    sub: "如果这能让您多一份警惕，那便已足够。",
  },
  {
    lang: "Tiếng Việt",
    flag: "🇻🇳",
    main: "Chân thành cảm ơn bạn đã sử dụng chương trình này.",
    sub: "Nếu điều này giúp bạn thận trọng hơn, thế là đủ rồi.",
  },
  {
    lang: "Español",
    flag: "🇪🇸",
    main: "Gracias de corazón por usar este programa.",
    sub: "Si esto te hace dudar un momento, ya es suficiente.",
  },
  {
    lang: "Deutsch",
    flag: "🇩🇪",
    main: "Herzlichen Dank, dass Sie dieses Programm nutzen.",
    sub: "Wenn Sie dadurch auch nur einen Moment zögern, war es das wert.",
  },
  {
    lang: "Français",
    flag: "🇫🇷",
    main: "Merci sincèrement d'utiliser ce programme.",
    sub: "Si cela vous fait réfléchir à deux fois, c'est tout ce qu'il faut.",
  },
  {
    lang: "हिन्दी",
    flag: "🇮🇳",
    main: "इस प्रोग्राम का उपयोग करने के लिए आपका हार्दिक धन्यवाद।",
    sub: "यदि यह आपको एक पल के लिए सोचने पर मजबूर करे, तो यही काफी है।",
  },
  {
    lang: "Português",
    flag: "🇧🇷",
    main: "Muito obrigado por usar este programa.",
    sub: "Se isso fizer você hesitar por um momento, já foi o suficiente.",
  },
];

export default function GratitudeCard() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("gratitude_seen");
    if (seen) return;
    const t = setTimeout(() => setVisible(true), 2200);
    return () => clearTimeout(t);
  }, []);

  // 언어 자동 슬라이드
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setIdx(i => (i + 1) % MESSAGES.length), 3200);
    return () => clearInterval(t);
  }, [visible]);

  function close() {
    setClosing(true);
    localStorage.setItem("gratitude_seen", "1");
    setTimeout(() => setVisible(false), 400);
  }

  if (!visible) return null;

  const msg = MESSAGES[idx];

  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%",
      transform: `translateX(-50%) translateY(${closing ? "120%" : "0"})`,
      transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      zIndex: 99995,
      width: "min(92vw, 420px)",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #0d0d20, #12122a)",
        border: "1px solid #534AB740",
        borderRadius: 22,
        padding: "22px 22px 18px",
        boxShadow: "0 12px 48px #00000060, 0 0 0 1px #534AB720",
        backdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* 배경 글로우 */}
        <div style={{
          position: "absolute", top: -30, right: -30,
          width: 120, height: 120, borderRadius: "50%",
          background: "radial-gradient(circle, #534AB730, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* 닫기 */}
        <button onClick={close} style={{
          position: "absolute", top: 14, right: 14,
          background: "#ffffff10", border: "none",
          color: "#6b7280", width: 26, height: 26,
          borderRadius: "50%", cursor: "pointer",
          fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>

        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #534AB7, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0,
          }}>🙏</div>
          <div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 13, lineHeight: 1.2 }}>
              범죄예방 체험관
            </p>
            <p style={{ color: "#6b5fc7", fontSize: 10 }}>Crime Prevention Korea</p>
          </div>
        </div>

        {/* 슬라이딩 메시지 */}
        <div style={{
          minHeight: 72,
          transition: "all 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{msg.flag}</span>
            <span style={{ color: "#534AB7", fontSize: 11, fontWeight: 700 }}>{msg.lang}</span>
          </div>
          <p style={{
            color: "#e2e0ff", fontSize: 13.5, fontWeight: 600,
            lineHeight: 1.6, marginBottom: 6,
          }}>
            {msg.main}
          </p>
          <p style={{ color: "#6b5fc7", fontSize: 11.5, lineHeight: 1.6 }}>
            {msg.sub}
          </p>
        </div>

        {/* 언어 점 인디케이터 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 16 }}>
          {MESSAGES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{
              width: i === idx ? 18 : 6,
              height: 6, borderRadius: 3,
              background: i === idx ? "#534AB7" : "#2a2a4a",
              border: "none", cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }} />
          ))}
        </div>

        {/* 닫기 텍스트 버튼 */}
        <button onClick={close} style={{
          display: "block", margin: "14px auto 0",
          background: "none", border: "none",
          color: "#4a4a6a", fontSize: 11,
          cursor: "pointer", textDecoration: "underline",
        }}>
          다시 보지 않기 · Don&apos;t show again
        </button>
      </div>
    </div>
  );
}
