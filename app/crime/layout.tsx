"use client";
import { useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function CrimeLayout({ children }: { children: React.ReactNode }) {
  const [infoOpen, setInfoOpen] = useState(false);
  const { lang } = useLang();

  return (
    <>
      {/* ── 최상단 교육 배너 (sticky) ── */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 300,
        background: "#0d0520f5",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "2px solid #f59e0b66",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          maxWidth: 720,
          margin: "0 auto",
        }}>
          {/* 좌: 앱 이름 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🛡️</span>
            <div>
              <p style={{ color: "#fff", fontSize: 12, fontWeight: 900, margin: 0, letterSpacing: 0.5 }}>{t("layout_sim_name", lang)}</p>
              <p style={{ color: "#f59e0b", fontSize: 10, margin: 0, fontWeight: 700 }}>Crime Prevention Korea</p>
            </div>
          </div>

          {/* 중앙: 교육용 뱃지 */}
          <div style={{
            background: "#f59e0b22",
            border: "1.5px solid #f59e0b",
            borderRadius: 20,
            padding: "4px 12px",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}>
            <span style={{ fontSize: 11 }}>🎓</span>
            <span style={{ color: "#fbbf24", fontSize: 11, fontWeight: 900, letterSpacing: 0.5 }}>{t("layout_edu_badge", lang)}</span>
          </div>

          {/* 우: 정보 버튼 */}
          <button
            onClick={() => setInfoOpen(true)}
            style={{
              background: "#ffffff18",
              border: "1px solid #ffffff30",
              borderRadius: 20,
              padding: "4px 10px",
              color: "#94a3b8",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {t("layout_app_info", lang)}
          </button>
        </div>
      </div>

      {/* ── 대각선 워터마크 (전체 화면 고정) ── */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        <div style={{
          transform: "rotate(-35deg)",
          opacity: 0.045,
          userSelect: "none",
          textAlign: "center",
          lineHeight: 2.2,
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ display: "flex", gap: "60px", marginLeft: i % 2 === 0 ? 0 : -80 }}>
              {Array.from({ length: 5 }).map((_, j) => (
                <span key={j} style={{ color: "#f59e0b", fontSize: 28, fontWeight: 900, whiteSpace: "nowrap" }}>
                  🎓 {t("layout_edu_badge", lang)}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 컨텐츠 */}
      <div style={{ position: "relative", zIndex: 150 }}>
        {children}
      </div>

      {/* ── 우하단 플로팅 교육 뱃지 ── */}
      <div style={{
        position: "fixed",
        bottom: 20,
        right: 16,
        zIndex: 300,
        background: "#0d0520ee",
        border: "1.5px solid #f59e0b",
        borderRadius: 20,
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        gap: 5,
        pointerEvents: "none",
        backdropFilter: "blur(8px)",
      }}>
        <span style={{ fontSize: 12 }}>🎓</span>
        <span style={{ color: "#fbbf24", fontSize: 10, fontWeight: 800 }}>{t("layout_non_sim", lang)}</span>
      </div>

      {/* ── 앱 정보 모달 ── */}
      {infoOpen && (
        <div
          onClick={() => setInfoOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            background: "#000000cc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#0d0520",
              border: "2px solid #f59e0b",
              borderRadius: 24,
              padding: "28px 24px",
              maxWidth: 400,
              width: "100%",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🛡️</div>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 900, margin: 0, marginBottom: 4 }}>{t("layout_sim_name", lang)}</h2>
              <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, margin: 0 }}>Crime Prevention Korea</p>
            </div>

            <div style={{ background: "#07030f", borderRadius: 16, padding: "16px 18px", marginBottom: 16 }}>
              {[
                { icon: "🎓", titleKey: "layout_info_p1t", bodyKey: "layout_info_p1b" },
                { icon: "🚫", titleKey: "layout_info_p2t", bodyKey: "layout_info_p2b" },
                { icon: "📵", titleKey: "layout_info_p3t", bodyKey: "layout_info_p3b" },
                { icon: "👮", titleKey: "layout_info_p4t", bodyKey: "layout_info_p4b" },
              ].map((it, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 3 ? 12 : 0 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{it.icon}</span>
                  <div>
                    <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, margin: 0, marginBottom: 2 }}>{t(it.titleKey as Parameters<typeof t>[0], lang)}</p>
                    <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{t(it.bodyKey as Parameters<typeof t>[0], lang)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#07030f", border: "1px solid #f59e0b33", borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
              <p style={{ color: "#64748b", fontSize: 11, lineHeight: 1.7, margin: 0, textAlign: "center" }}>
                개발·운영: Crime Prevention Korea<br />
                문의: skypay757@gmail.com<br />
                <span style={{ color: "#f59e0b", fontWeight: 700 }}>{t("layout_info_disclaimer", lang)}</span>
              </p>
            </div>

            <button
              onClick={() => setInfoOpen(false)}
              style={{
                width: "100%",
                background: "#f59e0b",
                border: "none",
                borderRadius: 14,
                padding: "14px 0",
                color: "#0d0520",
                fontWeight: 900,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              {t("btn_confirm", lang)}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
