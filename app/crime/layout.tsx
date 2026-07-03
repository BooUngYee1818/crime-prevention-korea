export default function CrimeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 공공장소 안전 배너 — 모바일 최상단 고정 */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: "rgba(13,5,32,0.92)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(251,191,36,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "7px 16px",
      }}>
        <span style={{ fontSize: 13 }}>⚠️</span>
        <span style={{
          color: "#fbbf24",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 0.5,
        }}>
          교육용 범죄 예방 시뮬레이션 — 실제 신고·거래가 아닙니다
        </span>
      </div>
      {children}
    </>
  );
}
