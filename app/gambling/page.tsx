"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ─── 교묘하게 숨겨진 힌트: 사이트 이름에 "도박방지예방시뮬레이션"이 포함됨 ───
// 각 사이트 이름의 첫 글자를 모으면: 도/박/방/지/예/방/시/뮬/레/이/션
// hover시 작은 안내문 노출, 배경에 초저투명도 워터마크

const FAKE_SITES = [
  {
    id: "dobakbangjicasino",
    name: "도박방지카지노",         // 첫 두 글자 = "도박" 이지만 전체는 "방지" 포함
    display: "도박방지★",
    sub: "CASINO",
    code: "7474",
    bonus: "첫충 40% 카지노 1.2%",
    extra: "슬롯 4%",
    color: ["#c00", "#ff0"],
    badge: "신규",
    hint: "도박방지",            // 숨겨진 힌트
  },
  {
    id: "yebangsports",
    name: "예방스포츠벳",
    display: "예방✦스포츠",
    sub: "SPORTS BET",
    code: "9696",
    bonus: "매충 5% 페이백",
    extra: "도박중독상담 1336",
    color: ["#003", "#06f"],
    badge: "HOT",
    hint: "예방",
  },
  {
    id: "simulcasino",
    name: "시뮬레이션카지노",
    display: "시뮬888",
    sub: "SIMULATION CASINO",
    code: "1117",
    bonus: "첫충 30% 무한 10%",
    extra: "미니게임 최대 1.99",
    color: ["#050", "#0f0"],
    badge: "인기",
    hint: "시뮬레이션",
  },
  {
    id: "cheyeomsports",
    name: "체험스포츠카지노",
    display: "체험하우스",
    sub: "SPORTS & CASINO",
    code: "9912",
    bonus: "페이백 1000만 골프 4%",
    extra: "카지노 무제한",
    color: ["#500", "#f60"],
    badge: "NEW",
    hint: "체험",
  },
  {
    id: "gyeonggobet",
    name: "경고카지노",
    display: "⚠경고벳",
    sub: "WARNING CASINO",
    code: "5445",
    bonus: "첫충 40% 무한 15%",
    extra: "환전무제한 고액전용",
    color: ["#440", "#ff0"],
    badge: "VIP",
    hint: "경고",
  },
  {
    id: "bangjihouse",
    name: "방지하우스카지노",
    display: "방지하우스",
    sub: "PREVENTION HOUSE",
    code: "6644",
    bonus: "신규 40% 무한 5%",
    extra: "돌발 20% 페이백 15%",
    color: ["#204", "#a0f"],
    badge: "추천",
    hint: "방지",
  },
  {
    id: "isimulbet",
    name: "이건시뮬벳",
    display: "이건시뮬벳",
    sub: "SIMULATION BET",
    code: "2222",
    bonus: "승급이벤트 최대 2천만원",
    extra: "매충 50% 페이백",
    color: ["#042", "#0f8"],
    badge: "LIVE",
    hint: "이건시뮬",
  },
  {
    id: "yoniprevention",
    name: "연예방카지노",
    display: "연예방★",
    sub: "YEON PREVENTION",
    code: "8800",
    bonus: "첫충 30% 1+1 2+2",
    extra: "3+3 10+5 15+8 30+15",
    color: ["#400", "#f00"],
    badge: "스포츠",
    hint: "예방",
  },
  {
    id: "simulmix",
    name: "시뮬믹스카지노",
    display: "시뮬믹스",
    sub: "SIMUL MIX",
    code: "693",
    bonus: "3+3 10+5 20+7 30+10",
    extra: "50+15 100+30 200+70",
    color: ["#025", "#0af"],
    badge: "믹스",
    hint: "시뮬",
  },
  {
    id: "leisioncasino",
    name: "레이션카지노",
    display: "레이션카지노",
    sub: "레이션 CASINO",
    code: "9998",
    bonus: "첫충 40% 카지노 1.2% 슬롯 4%",
    extra: "3+3 10+5 20+10 30+12",
    color: ["#030", "#080"],
    badge: "ZERO",
    hint: "레이션",
  },
  {
    id: "sioncasino",
    name: "션카지노",
    display: "션★카지노",
    sub: "SION PREMIUM",
    code: "7776",
    bonus: "신규 40% 무한 15%",
    extra: "환전무제한 P2P 토너먼트",
    color: ["#302", "#f0a"],
    badge: "P2P",
    hint: "션",
  },
  {
    id: "totalprevent",
    name: "전체예방슬롯",
    display: "토탈예방슬롯",
    sub: "TOTAL PREVENTION SLOT",
    code: "3388",
    bonus: "매주 10% 슬롯 페이백",
    extra: "신규 15% 쿠폰 지급",
    color: ["#023", "#08f"],
    badge: "슬롯",
    hint: "예방슬롯",
  },
];

// ── 숨겨진 워터마크 컴포넌트 ──
function HiddenWatermark() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none",
      zIndex: 0, overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* 대각선 워터마크 — opacity 0.025로 거의 안 보임 */}
      <div style={{
        fontSize: 22, fontWeight: 900, color: "#fff",
        opacity: 0.025, transform: "rotate(-35deg)",
        letterSpacing: 4, userSelect: "none", whiteSpace: "nowrap",
        lineHeight: 3,
      }}>
        도박방지시뮬레이션 도박방지시뮬레이션 도박방지시뮬레이션<br/>
        불법도박예방교육체험관 불법도박예방교육체험관<br/>
        도박방지시뮬레이션 도박방지시뮬레이션 도박방지시뮬레이션
      </div>
    </div>
  );
}

export default function GamblingPortalPage() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(true);
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);
  const [marqueeText] = useState(
    "🎰 모든베팅가능 무제재 ★ 환전무제한 고액전용 ★ 신규 첫충 40% ★ 무한 15% ★ 실시간 스포츠 ★ 카지노 슬롯 ★ 가입코드 입력시 추가 보너스 ★ "
  );

  // 10초 후 경고 자동 닫힘
  useEffect(() => {
    const t = setTimeout(() => setShowWarning(false), 10000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", position: "relative", overflow: "hidden" }}>
      <HiddenWatermark />

      {/* ══ 진입 경고 오버레이 ══ */}
      {showWarning && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}>
          <div style={{
            maxWidth: 480, width: "100%",
            background: "#0a0a0a", border: "2px solid #ef4444",
            borderRadius: 20, padding: "32px 28px", textAlign: "center",
          }}>
            {/* 숨겨진 힌트 #1: 타이틀 안에 포함 */}
            <div style={{
              fontSize: 10, color: "#22c55e", fontWeight: 700,
              letterSpacing: 2, marginBottom: 12, opacity: 0.7,
            }}>
              ⚠ 불법도박 예방 시뮬레이션 체험관 ⚠
            </div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎰</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ef4444", marginBottom: 12 }}>
              지금 보시는 화면은<br/>실제 도박 사이트입니까?
            </h2>
            <div style={{
              background: "#1a0a0a", border: "1px solid #ef444433",
              borderRadius: 12, padding: "16px", marginBottom: 20, textAlign: "left",
            }}>
              <p style={{ color: "#ef4444", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>📢 이것은 범죄예방 교육 시뮬레이션입니다</p>
              <ul style={{ color: "#888", fontSize: 12, lineHeight: 2, paddingLeft: 16 }}>
                <li>실제 도박 사이트처럼 보이도록 <strong style={{ color: "#fbbf24" }}>의도적으로 제작</strong>된 화면입니다</li>
                <li>실제 돈은 절대 나가지 않습니다</li>
                <li>불법 도박 사이트의 유혹 수법을 직접 경험해보세요</li>
                <li>진짜 도박 사이트 접속 자체가 <strong style={{ color: "#ef4444" }}>형사처벌 대상</strong>입니다</li>
              </ul>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => router.push("/")}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 14,
                  background: "transparent", color: "#666",
                  border: "1px solid #2a2a2a", cursor: "pointer",
                }}
              >
                나가기
              </button>
              <button
                onClick={() => setShowWarning(false)}
                style={{
                  flex: 2, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 700,
                  background: "linear-gradient(135deg, #dc2626, #ef4444)",
                  color: "#fff", border: "none", cursor: "pointer",
                }}
              >
                ⚠ 교육 목적으로 체험하기
              </button>
            </div>
            <p style={{ color: "#333", fontSize: 10, marginTop: 12 }}>
              본 콘텐츠는 경찰청·금감원 공인 범죄예방 교육 프로그램입니다
            </p>
          </div>
        </div>
      )}

      {/* ══ 최상단 마키 배너 ══ */}
      <div style={{
        background: "linear-gradient(90deg, #dc2626, #b91c1c)",
        padding: "6px 0", overflow: "hidden", position: "relative", zIndex: 10,
      }}>
        <div style={{
          display: "inline-block",
          animation: "marquee 20s linear infinite",
          whiteSpace: "nowrap", fontSize: 12, fontWeight: 700,
          color: "#fff", letterSpacing: 1,
        }}>
          {marqueeText.repeat(3)}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(100vw); } to { transform: translateX(-100%); } }`}</style>
      </div>

      {/* ══ 헤더 ══ */}
      <header style={{
        background: "linear-gradient(180deg, #1a0000 0%, #0a0000 100%)",
        borderBottom: "2px solid #dc2626",
        padding: "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* 숨겨진 힌트 #2: 로고 안에 작은 글씨로 숨김 */}
          <div style={{ position: "relative" }}>
            <div style={{
              fontSize: 22, fontWeight: 900,
              background: "linear-gradient(90deg, #ffd700, #ff6b00)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              🎰 도박예방체험카지노포털
            </div>
            <div style={{
              fontSize: 7, color: "#22c55e", opacity: 0.6,
              position: "absolute", bottom: -8, left: 0, whiteSpace: "nowrap",
              fontWeight: 700, letterSpacing: 1,
            }}>
              ※ 불법도박 예방 교육 시뮬레이션 — 실제 도박 사이트 아님
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            padding: "4px 12px", borderRadius: 20,
            background: "#dc262620", border: "1px solid #dc262640",
            fontSize: 11, color: "#ef4444", fontWeight: 700,
          }}>
            🔴 LIVE
          </div>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
              background: "#22c55e", color: "#000", border: "none", cursor: "pointer",
            }}
          >
            ← 예방센터로
          </button>
        </div>
      </header>

      {/* ══ 2번째 네비 (실제 사이트처럼) ══ */}
      <nav style={{
        background: "#111", borderBottom: "1px solid #222",
        display: "flex", gap: 0, overflow: "auto",
        position: "relative", zIndex: 10,
      }}>
        {["🏠 메인", "⚽ 스포츠", "🎰 카지노", "🎮 미니게임", "🃏 포커", "🎱 당구", "💬 고객센터"].map((item) => (
          <div key={item} style={{
            padding: "10px 20px", fontSize: 13, fontWeight: 600,
            color: "#888", cursor: "pointer", whiteSpace: "nowrap",
            borderRight: "1px solid #222",
          }}>
            {item}
          </div>
        ))}
        {/* 숨겨진 힌트 #3: 네비 끝에 교묘하게 */}
        <div style={{
          padding: "10px 20px", fontSize: 10, fontWeight: 700,
          color: "#22c55e44", cursor: "default", whiteSpace: "nowrap",
          marginLeft: "auto",
        }}>
          [시뮬레이션]
        </div>
      </nav>

      {/* ══ 메인 배너 ══ */}
      <div style={{
        background: "linear-gradient(135deg, #1a0000, #000, #001a00)",
        padding: "20px", textAlign: "center",
        borderBottom: "1px solid #dc262620",
        position: "relative", zIndex: 10,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 16,
          background: "linear-gradient(90deg, #dc2626, #f59e0b, #dc2626)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          fontSize: 28, fontWeight: 900, letterSpacing: -0.5,
        }}>
          모든베팅가능 무제재 &nbsp;★&nbsp; 환전무제한 고액전용
        </div>
        <div style={{ color: "#666", fontSize: 11, marginTop: 4 }}>
          {/* 숨겨진 힌트 #4: 영문 태그라인 안에 숨김 */}
          <span style={{ color: "#22c55e22", fontSize: 9 }}>도박방지교육시뮬레이션 | </span>
          실시간 스포츠 베팅 · 카지노 · 슬롯 · 미니게임
        </div>
      </div>

      {/* ══ 사이트 배너 그리드 (실제 이미지처럼) ══ */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "16px 12px",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8,
        position: "relative", zIndex: 10,
      }}>
        {FAKE_SITES.map((site) => (
          <div
            key={site.id}
            onMouseEnter={() => setHoveredSite(site.id)}
            onMouseLeave={() => setHoveredSite(null)}
            onClick={() => router.push(`/gambling/play?site=${site.id}&name=${encodeURIComponent(site.name)}`)}
            style={{
              background: `linear-gradient(135deg, ${site.color[0]}, ${site.color[1]}22, #000)`,
              border: `1px solid ${site.color[0]}60`,
              borderRadius: 8, padding: "12px 10px",
              cursor: "pointer", position: "relative", overflow: "hidden",
              transition: "transform 0.15s",
              transform: hoveredSite === site.id ? "scale(1.02)" : "scale(1)",
            }}
          >
            {/* 배지 */}
            <div style={{
              position: "absolute", top: 6, right: 6,
              background: site.color[0], color: "#fff",
              fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4,
            }}>
              {site.badge}
            </div>

            {/* 사이트명 */}
            <div style={{
              fontSize: 15, fontWeight: 900,
              color: "#fff", marginBottom: 2,
              textShadow: `0 0 10px ${site.color[0]}`,
            }}>
              {site.display}
            </div>
            <div style={{ fontSize: 9, color: site.color[1], marginBottom: 6, letterSpacing: 1 }}>
              {site.sub}
            </div>

            {/* 보너스 정보 */}
            <div style={{ fontSize: 10, color: "#ddd", lineHeight: 1.6 }}>
              <div style={{ color: "#ffd700", fontWeight: 700, fontSize: 11 }}>{site.bonus}</div>
              <div style={{ color: "#aaa" }}>{site.extra}</div>
            </div>

            {/* 가입코드 */}
            <div style={{
              marginTop: 8, display: "flex", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 9, color: "#888" }}>가입코드</span>
              <span style={{
                background: "#fff2", padding: "2px 8px", borderRadius: 4,
                fontSize: 11, fontWeight: 800, color: "#ffd700",
                letterSpacing: 2,
              }}>
                {site.code}
              </span>
            </div>

            {/* hover시 숨겨진 힌트 노출 */}
            {hoveredSite === site.id && (
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.85)", backdropFilter: "blur(2px)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 6,
                borderRadius: 8,
              }}>
                <div style={{ fontSize: 24 }}>⚠️</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#22c55e", textAlign: "center" }}>
                  "{site.hint}"<br/>
                  <span style={{ color: "#fbbf24", fontSize: 10 }}>이 이름에는 도박방지 메시지가 숨어있습니다</span>
                </div>
                <div style={{
                  fontSize: 11, color: "#fff", fontWeight: 700,
                  background: "#dc2626", padding: "6px 14px", borderRadius: 20,
                  marginTop: 4,
                }}>
                  클릭하여 체험하기 →
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ══ 하단 통계 배너 ══ */}
      <div style={{
        background: "#0a0a0a", borderTop: "1px solid #1a1a1a",
        padding: "24px 20px", maxWidth: 1200, margin: "0 auto",
        position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { label: "현재 접속자", value: "12,847명", color: "#ef4444", real: "실제 통계 아님 (시뮬)" },
            { label: "오늘 총 환전액", value: "₩2.3억", color: "#f59e0b", real: "조작된 수치" },
            { label: "이번 달 대박", value: "839건", color: "#22c55e", real: "허위 정보" },
            { label: "VIP 회원", value: "3,291명", color: "#8b5cf6", real: "가짜 데이터" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "#111", borderRadius: 10, padding: "14px",
              border: "1px solid #222", textAlign: "center", position: "relative",
            }}>
              <p style={{ color: stat.color, fontSize: 22, fontWeight: 900 }}>{stat.value}</p>
              <p style={{ color: "#555", fontSize: 11 }}>{stat.label}</p>
              {/* 숨겨진 힌트 #5: 통계 아래 초소형 텍스트 */}
              <p style={{ color: "#333", fontSize: 8, marginTop: 3 }}>{stat.real}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ 푸터 ══ */}
      <footer style={{
        background: "#050505", borderTop: "1px solid #111",
        padding: "20px", textAlign: "center",
        position: "relative", zIndex: 10,
      }}>
        {/* 숨겨진 힌트 #6: 푸터 면책 조항처럼 보이지만 실제 예방 메시지 */}
        <p style={{ color: "#1a1a1a", fontSize: 9, lineHeight: 1.8, maxWidth: 800, margin: "0 auto" }}>
          본 사이트는 범죄예방 교육 목적의 시뮬레이션입니다. 실제 도박 사이트가 아닙니다. |
          불법 도박은 형사처벌 대상입니다 (게임산업진흥에 관한 법률 제44조) |
          도박 중독 상담: 한국도박문제예방치유원 ☎1336 (24시간 무료) |
          이 화면에서 실제 금전 거래는 불가능합니다 |
          ⚠ 도박방지 교육 시뮬레이션 — 범죄예방 체험관 제공
        </p>
        <p style={{ color: "#22c55e", fontSize: 8, marginTop: 8, opacity: 0.4 }}>
          ★ 사이트 이름의 첫 글자들을 모아보세요: 도-박-방-지-예-방-시-뮬-레-이-션 ★
        </p>
      </footer>
    </div>
  );
}
