"use client";
import { useEffect, useState, useRef } from "react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

type Phase = "normal" | "tricked" | "qr";

export default function DonorEventPopup() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("normal");
  const [contactPos, setContactPos] = useState({ x: 0, y: 0 });
  const [showGuiltyMsg, setShowGuiltyMsg] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("donor_popup_hidden_v2");
    if (stored && Date.now() < parseInt(stored)) return;
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    function onMouseMove(e: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.08;
      const dy = (e.clientY - cy) * 0.08;
      setContactPos({ x: dx, y: dy });
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [visible]);

  useEffect(() => {
    if (phase === "qr") {
      import("qrcode").then(QRCode => {
        QRCode.toDataURL("mailto:itnlifecn@gmail.com?subject=후원 및 명예의 전당 등재 신청", {
          width: 180, margin: 2, color: { dark: "#1a1000", light: "#fffbea" },
        }).then(url => setQrUrl(url));
      });
    }
  }, [phase]);

  function hideToday() {
    localStorage.setItem("donor_popup_hidden_v2", String(Date.now() + 24 * 60 * 60 * 1000));
    setVisible(false);
  }

  function onClickX() {
    setShowGuiltyMsg(true);
    setTimeout(() => hideToday(), 1800);
  }

  function onClickFakeHide() {
    setPhase("tricked");
    setTimeout(() => setPhase("qr"), 1600);
  }

  if (!visible) return null;

  return (
    <div onClick={phase === "normal" ? hideToday : undefined} style={{
      position: "fixed", inset: 0, zIndex: 99998,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, animation: "fadeInBg 0.3s ease",
    }}>
      <style>{`
        @keyframes fadeInBg { from{opacity:0} to{opacity:1} }
        @keyframes slideUp  { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes popIn    { from{transform:scale(0.7);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
      `}</style>
      <div ref={containerRef} onClick={e => e.stopPropagation()} style={{
        background: "#ffffff", borderRadius: 24, maxWidth: 440, width: "100%",
        overflow: "visible", animation: "slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.35)", position: "relative",
      }}>
        {/* X 닫기 버튼 */}
        <button onClick={onClickX} style={{
          position: "absolute", top: 12, right: 12, zIndex: 10,
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(0,0,0,0.15)", border: "none",
          fontSize: 16, color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 900,
        }}>✕</button>

        {/* 죄책감 유발 메시지 */}
        {showGuiltyMsg && (
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 20, textAlign: "center",
            background: "rgba(255,255,255,0.97)",
            borderRadius: 20, padding: "28px 32px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
            animation: "slideUp 0.3s ease",
            width: "90%",
          }}>
            <p style={{ fontSize: 22, marginBottom: 8 }}>🥲</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>
              후원 해주면 고마울텐데...
            </p>
          </div>
        )}

        {/* 노란 배너 */}
        <div style={{ background: "#F5C400", padding: "28px 28px 22px", position: "relative", overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
          <div style={{
            position: "absolute", inset: 0, fontSize: 52, fontWeight: 900, color: "#ffffff20",
            display: "flex", alignItems: "center", whiteSpace: "nowrap", overflow: "hidden",
            userSelect: "none", pointerEvents: "none", lineHeight: 1,
          }}>
            Hall of Fame · 명예의 전당 · 殿堂 · 荣誉殿堂
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 4, color: "#7a6200", textTransform: "uppercase", marginBottom: 10 }}>
              {t("donor_badge", lang)}
            </p>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1a1000", lineHeight: 1.3, margin: 0 }}>
              {t("donor_title", lang).split("\n").map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
              ))}
            </h2>
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: "24px 28px 28px" }}>

          {/* QR 단계 */}
          {phase === "qr" ? (
            <div style={{ textAlign: "center", animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#1a1000", marginBottom: 12 }}>
                진짜 해주시게요❓<br/>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#7a6200" }}>아이 안하셔도 된다니까~</span>
              </p>
              {qrUrl && <img src={qrUrl} alt="후원 QR" style={{ width: 160, height: 160, borderRadius: 12, margin: "0 auto 12px", display: "block" }} />}
              <p style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>itnlifecn@gmail.com</p>
              <p style={{ fontSize: 12, color: "#e67e22", fontWeight: 700, marginBottom: 16 }}>⚠️ 10대는 부모님 허락 받아와라❗️</p>
              <button onClick={hideToday} style={{
                background: "#F5C400", border: "none", borderRadius: 12,
                padding: "12px 28px", fontWeight: 800, fontSize: 14,
                color: "#1a1000", cursor: "pointer", marginRight: 8,
              }}>후원할게요 😊</button>
              <button onClick={hideToday} style={{
                background: "#f0f0f0", border: "none", borderRadius: 12,
                padding: "12px 28px", fontWeight: 600, fontSize: 14,
                color: "#888", cursor: "pointer",
              }}>다음에요</button>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 15, color: "#1a1a1a", lineHeight: 1.75, fontWeight: 600, marginBottom: 16 }}>
                {t("donor_desc", lang).split("\n").map((line, i, arr) => (
                  <span key={i}>{i === 1 ? <span style={{ color: "#c49500", fontWeight: 900 }}>{line}</span> : line}{i < arr.length - 1 && <br/>}</span>
                ))}
              </p>

              <div style={{ background: "#fffbea", border: "1.5px solid #F5C40060", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: "#7a6200", margin: 0, lineHeight: 1.7 }}>
                  {t("donor_check1", lang)}<br/>
                  {t("donor_check2", lang)}<br/>
                  {t("donor_check3", lang)}<br/>
                  {t("donor_check4", lang)}
                </p>
              </div>

              {/* 마우스 따라오는 후원 버튼 */}
              <div style={{ position: "relative", height: 52, marginBottom: 4 }}>
                <a
                  href={`mailto:itnlifecn@gmail.com?subject=${encodeURIComponent("후원 및 명예의 전당 등재 신청")}&body=${encodeURIComponent("닉네임:\n후원 방법 문의:")}`}
                  style={{
                    position: "absolute",
                    left: `calc(50% + ${contactPos.x}px)`,
                    top: `${contactPos.y}px`,
                    transform: "translateX(-50%)",
                    transition: "left 0.2s ease, top 0.2s ease",
                    display: "block", background: "#F5C400",
                    border: "none", borderRadius: 14, padding: "15px 32px",
                    fontSize: 15, fontWeight: 900, color: "#1a1000",
                    textAlign: "center", cursor: "pointer", textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                  onClick={hideToday}
                >
                  {t("donor_contact", lang)}
                </a>
              </div>

              {/* 훼이크 버튼 */}
              <div style={{ textAlign: "center", marginTop: 16, minHeight: 48 }}>
                {phase === "normal" && (
                  <button onClick={onClickFakeHide} style={{
                    background: "none", border: "none", fontSize: 12, color: "#aaa",
                    cursor: "pointer", textDecoration: "underline",
                  }}>
                    {t("donor_hide", lang)}
                  </button>
                )}
                {phase === "tricked" && (
                  <div style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#c49500", marginBottom: 8 }}>
                      아쌍 후원 감사함다 히히히힣 🎉
                    </p>
                    <a
                      href={`mailto:itnlifecn@gmail.com?subject=${encodeURIComponent("후원 및 명예의 전당 등재 신청")}&body=${encodeURIComponent("닉네임:\n후원 방법 문의:")}`}
                      style={{
                        display: "inline-block", background: "#F5C400",
                        border: "none", borderRadius: 14, padding: "13px 28px",
                        fontSize: 15, fontWeight: 900, color: "#1a1000",
                        textDecoration: "none", cursor: "pointer",
                        animation: "shake 0.4s ease",
                      }}
                    >
                      후원 문의하기 →
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
