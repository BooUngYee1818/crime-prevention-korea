"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, ExternalLink, ChevronDown, ChevronUp, BarChart2 } from "lucide-react";

const SOURCES = [
  { name: "경찰청 범죄통계", url: "https://www.police.go.kr/user/bbs/BD_selectBbsList.do?q_bbsCode=1006", color: "#2563eb" },
  { name: "금융감독원 보이스피싱 통계", url: "https://www.fss.or.kr/fss/main/contents.do?menuNo=200467", color: "#0891b2" },
  { name: "한국도박문제관리센터(KCGP)", url: "https://www.kcgp.or.kr", color: "#7c3aed" },
  { name: "통계청 사망원인통계", url: "https://kostat.go.kr/board.es?mid=a10301010000&bid=218", color: "#dc2626" },
  { name: "한국형사정책연구원", url: "https://www.kic.re.kr", color: "#059669" },
  { name: "대검찰청 범죄분석", url: "https://www.spo.go.kr/site/spo/crimeStats.do", color: "#ca8a04" },
  { name: "방송통신위원회 스미싱 통계", url: "https://www.kcc.go.kr", color: "#ea580c" },
];

const CRIME_STATS = [
  {
    id: "family-impersonation",
    icon: "👨‍👩‍👧",
    title: "자녀·가족 사칭 보이스피싱",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    summary: "연간 약 5,000건 · 피해액 약 600억원",
    stats: [
      { label: "연간 피해 건수 (2023)", value: "약 5,000건", source: "경찰청", bold: true },
      { label: "연간 피해액", value: "약 600억원", source: "금융감독원" },
      { label: "주요 피해 연령", value: "50~70대 (전체의 68%)", source: "경찰청" },
      { label: "평균 피해액", value: "약 1,200만원/건", source: "금융감독원" },
      { label: "수법", value: "자녀 폰 고장·사고 핑계로 급전 요청", source: "경찰청" },
      { label: "주요 채널", value: "카카오톡·문자 (87%)", source: "경찰청" },
    ],
    sources: ["경찰청 범죄통계", "금융감독원 보이스피싱 통계"],
    note: "\"엄마 나야, 폰 고장났어\" 한 마디에 평균 1,200만원을 잃습니다.",
  },
  {
    id: "prosecutor-impersonation",
    icon: "👮",
    title: "검찰·경찰·금융기관 사칭",
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
    summary: "1건당 평균 피해액 5,290만원 · 최고 피해 수법",
    stats: [
      { label: "연간 피해 건수 (2023)", value: "약 3,200건", source: "경찰청", bold: true },
      { label: "1건당 평균 피해액", value: "5,290만원", source: "금융감독원", bold: true },
      { label: "최고 단일 피해액", value: "23억원 (2022)", source: "경찰청" },
      { label: "주요 피해 연령", value: "40~60대 (전체의 72%)", source: "경찰청" },
      { label: "수법", value: "\"계좌 범죄 연루\" 협박 후 안전계좌 이체 요구", source: "경찰청" },
      { label: "평균 통화 시간", value: "약 40분 (심리적 압박 유지)", source: "금융감독원" },
    ],
    sources: ["경찰청 범죄통계", "금융감독원 보이스피싱 통계"],
    note: "실제 검사·경찰은 전화로 계좌이체를 요구하지 않습니다.",
  },
  {
    id: "romance-scam",
    icon: "💝",
    title: "로맨스 스캠",
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#fbcfe8",
    summary: "연간 피해액 약 900억원 · 피해 인식률 매우 낮음",
    stats: [
      { label: "연간 피해 건수 (2023)", value: "약 2,800건", source: "경찰청", bold: true },
      { label: "연간 피해액", value: "약 900억원", source: "경찰청·금감원" },
      { label: "1건당 평균 피해액", value: "약 3,200만원", source: "금융감독원" },
      { label: "피해자 중 여성 비율", value: "61%", source: "경찰청" },
      { label: "평균 사기 기간", value: "약 4.3개월 (장기 신뢰 형성)", source: "경찰청" },
      { label: "신고 비율", value: "약 30% (수치심으로 미신고 多)", source: "경찰청" },
    ],
    sources: ["경찰청 범죄통계", "금융감독원 보이스피싱 통계"],
    note: "피해자 10명 중 7명은 신고조차 못 합니다. 수치심이 아닌 범죄 피해임을 기억하세요.",
  },
  {
    id: "investment-scam",
    icon: "📈",
    title: "투자 사기·주식리딩방",
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    summary: "연간 피해액 약 1조 3,000억원 · 전 연령 피해",
    stats: [
      { label: "연간 피해액 (2022)", value: "약 1조 3,000억원", source: "대검찰청", bold: true },
      { label: "연간 피해 건수", value: "약 26,000건", source: "대검찰청", bold: true },
      { label: "1건당 평균 피해액", value: "약 5,000만원", source: "대검찰청" },
      { label: "주식리딩방 피해 비율", value: "전체의 43%", source: "금융감독원" },
      { label: "피해자 연령 분포", value: "30~50대 (전체의 74%)", source: "경찰청" },
      { label: "SNS·메신저 유입 비율", value: "78%", source: "경찰청" },
    ],
    sources: ["대검찰청 범죄분석", "금융감독원 보이스피싱 통계", "경찰청 범죄통계"],
    note: "\"확실한 수익 보장\"은 사기의 시작입니다. 합법 투자는 원금 손실 가능성을 반드시 고지합니다.",
  },
  {
    id: "loan-fraud",
    icon: "🏦",
    title: "대출 사기·저금리 전환 사기",
    color: "#ca8a04",
    bg: "#fefce8",
    border: "#fde68a",
    summary: "연간 약 8,000건 · 서민·취약계층 집중 피해",
    stats: [
      { label: "연간 피해 건수 (2023)", value: "약 8,000건", source: "금융감독원", bold: true },
      { label: "연간 피해액", value: "약 1,400억원", source: "금융감독원" },
      { label: "1건당 평균 피해액", value: "약 1,750만원", source: "금융감독원" },
      { label: "피해자 신용등급", value: "4~7등급 (취약계층 74%)", source: "금융감독원" },
      { label: "선수수료 명목 피해", value: "전체의 58%", source: "금융감독원" },
      { label: "주요 연령", value: "30~50대 (전체의 68%)", source: "경찰청" },
    ],
    sources: ["금융감독원 보이스피싱 통계", "경찰청 범죄통계"],
    note: "합법 금융기관은 대출 실행 전 어떠한 수수료도 요구하지 않습니다.",
  },
  {
    id: "delivery-scam",
    icon: "📦",
    title: "스미싱 (문자 피싱)",
    color: "#ea580c",
    bg: "#fff7ed",
    border: "#fed7aa",
    summary: "연간 50만건+ 발송 · 클릭 1회로 전 재산 위험",
    stats: [
      { label: "연간 스미싱 문자 발송 건수 (2022)", value: "약 50만 건+", source: "방송통신위원회", bold: true },
      { label: "악성앱 설치 피해 건수", value: "약 4,300건", source: "경찰청" },
      { label: "1건당 평균 피해액", value: "약 820만원", source: "금융감독원" },
      { label: "주요 사칭 유형", value: "택배(41%), 공공기관(28%), 지인(18%)", source: "방통위" },
      { label: "피해자 연령", value: "50대 이상 (전체의 54%)", source: "경찰청" },
      { label: "악성앱 탐지 건수", value: "연간 약 21만 개", source: "한국인터넷진흥원(KISA)" },
    ],
    sources: ["방송통신위원회", "경찰청 범죄통계", "금융감독원 보이스피싱 통계"],
    note: "출처 불명 링크는 절대 클릭하지 마세요. 클릭 1회로 스마트폰 전체가 장악될 수 있습니다.",
  },
  {
    id: "kakaotalk-impersonation",
    icon: "💬",
    title: "카카오톡·메신저 사기",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    summary: "연간 약 14,000건 · 전체 보이스피싱의 최다 수법",
    stats: [
      { label: "연간 피해 건수 (2023)", value: "약 14,000건", source: "경찰청", bold: true },
      { label: "전체 보이스피싱 대비 비중", value: "약 38% (최다 수법)", source: "경찰청", bold: true },
      { label: "연간 피해액", value: "약 2,100억원", source: "금융감독원" },
      { label: "평균 피해액", value: "약 1,500만원", source: "금융감독원" },
      { label: "주요 피해 연령", value: "50~70대 (전체의 71%)", source: "경찰청" },
      { label: "계좌 개설 악용 비율", value: "전체의 29%", source: "경찰청" },
    ],
    sources: ["경찰청 범죄통계", "금융감독원 보이스피싱 통계"],
    note: "카카오톡 프로필 사진·이름은 쉽게 도용됩니다. 돈 요청 시 반드시 전화 통화로 확인하세요.",
  },
  {
    id: "used-goods-scam",
    icon: "📱",
    title: "중고거래 사기",
    color: "#6366f1",
    bg: "#eef2ff",
    border: "#c7d2fe",
    summary: "연간 약 26,000건 · 가장 빈번한 일상 범죄",
    stats: [
      { label: "연간 피해 건수 (2022)", value: "약 26,000건", source: "경찰청", bold: true },
      { label: "전체 사기 범죄 내 비중", value: "약 14%", source: "대검찰청" },
      { label: "1건당 평균 피해액", value: "약 32만원", source: "경찰청" },
      { label: "주요 피해 품목", value: "전자기기(38%), 의류·잡화(21%), 티켓(17%)", source: "경찰청" },
      { label: "주요 피해 플랫폼", value: "중고나라·당근마켓·번개장터", source: "경찰청" },
      { label: "피해자 연령", value: "20~30대 (전체의 62%)", source: "경찰청" },
    ],
    sources: ["경찰청 범죄통계", "대검찰청 범죄분석"],
    note: "선입금 요구 후 잠수는 전형적인 수법입니다. 직거래 또는 안전결제 서비스를 이용하세요.",
  },
  {
    id: "illegal-gambling",
    icon: "🎰",
    title: "불법 도박 중독",
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#ddd6fe",
    summary: "추정 중독자 200만명 · 연 불법 도박 84조원 · 자살충동 30.4%",
    stats: [
      { label: "도박 중독 추정 인구 (2023)", value: "약 200만명 (성인의 5%)", source: "KCGP", bold: true },
      { label: "불법 도박 시장 규모", value: "연 약 84조원", source: "한국형사정책연구원", bold: true },
      { label: "도박 중독자 자살 충동 경험", value: "30.4% (일반인의 10배)", source: "KCGP", bold: true },
      { label: "평균 도박 부채", value: "약 3,800만원", source: "KCGP" },
      { label: "온라인·모바일 첫 도박 비율", value: "36.9%", source: "KCGP 2022" },
      { label: "도박 문제 인식 치료 비율", value: "8.3% (치료받지 않는 경우 91.7%)", source: "KCGP" },
      { label: "가족 해체(이혼·별거) 비율", value: "중독자의 54%", source: "KCGP" },
      { label: "자살 시도 경험", value: "중독자의 9.8%", source: "KCGP" },
      { label: "도박 중독 상담 전화", value: "1336 (24시간 무료)", source: "KCGP" },
    ],
    sources: ["한국도박문제관리센터(KCGP)", "한국형사정책연구원", "통계청 사망원인통계"],
    note: "도박은 '운'이 아닙니다. 처음엔 이기도록 설계되어 있습니다. 중독되면 혼자 멈추기 어렵습니다.",
  },
];

export default function StatsPage() {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", color: "#1e293b" }}>

      {/* 네비 */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", gap: 12,
        padding: "0 40px", height: 62,
        boxShadow: "0 1px 8px #0000000a",
      }}>
        <button onClick={() => router.push("/")} style={{ padding: 8, background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", borderRadius: 8 }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #2563eb, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BarChart2 size={14} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>국가기관 공식 범죄 통계</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", background: "#f0fdf4", padding: "2px 8px", borderRadius: 20, border: "1px solid #bbf7d0" }}>
          경찰청·금감원·KCGP 데이터
        </span>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "52px 40px 80px" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 44 }}>
          <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>OFFICIAL DATA</p>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#0f172a", marginBottom: 14 }}>
            국가가 공식 집계한 범죄 통계
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8 }}>
            이 페이지의 모든 통계는 <strong style={{ color: "#334155" }}>경찰청·금융감독원·한국도박문제관리센터·통계청·대검찰청</strong> 등<br />
            대한민국 공식 국가기관의 발표 자료를 기반으로 합니다.<br />
            각 항목 하단의 출처 링크에서 원문 데이터를 직접 확인하실 수 있습니다.
          </p>
        </div>

        {/* 대한민국 국민 모두를 위한 안내 배너 */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          borderRadius: 20, padding: "26px 32px", marginBottom: 36,
          display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
        }}>
          <Shield size={32} color="#60a5fa" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
              이 프로그램은 대한민국 모든 시민을 위해 만들어졌습니다
            </p>
            <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8 }}>
              학생·청년·직장인·어르신·누구나 무료로 이용할 수 있습니다. 범죄를 당하지도, 저지르지도, 악용하지도 않는 사회를 위해.<br />
              <strong style={{ color: "#60a5fa" }}>알면 막을 수 있습니다.</strong> 이 통계가 바로 그 증거입니다.
            </p>
          </div>
        </div>

        {/* 출처 사이트 바로가기 */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "24px 28px",
          border: "1px solid #f1f5f9", marginBottom: 36,
          boxShadow: "0 2px 12px #0000000a",
        }}>
          <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            📎 공식 출처 사이트 바로가기
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {SOURCES.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 22,
                  background: s.color + "0e",
                  border: `1px solid ${s.color}28`,
                  color: s.color, fontSize: 12, fontWeight: 600,
                  textDecoration: "none", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = s.color + "18";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = s.color + "0e";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {s.name} <ExternalLink size={11} />
              </a>
            ))}
          </div>
        </div>

        {/* 범죄별 통계 아코디언 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {CRIME_STATS.map((crime) => {
            const isOpen = openId === crime.id;
            return (
              <div key={crime.id} style={{
                background: "#fff", borderRadius: 18,
                border: `1px solid ${isOpen ? crime.color + "40" : "#f1f5f9"}`,
                boxShadow: isOpen ? `0 4px 24px ${crime.color}12` : "0 2px 8px #0000000a",
                overflow: "hidden", transition: "all 0.2s",
              }}>
                {/* 헤더 버튼 */}
                <button
                  onClick={() => setOpenId(isOpen ? null : crime.id)}
                  style={{
                    width: "100%", padding: "20px 24px",
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 16,
                    textAlign: "left",
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: crime.bg, border: `1px solid ${crime.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>
                    {crime.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{crime.title}</p>
                    <p style={{ color: crime.color, fontSize: 13, fontWeight: 600 }}>{crime.summary}</p>
                  </div>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: isOpen ? crime.color + "18" : "#f8fafc",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}>
                    {isOpen
                      ? <ChevronUp size={16} color={crime.color} />
                      : <ChevronDown size={16} color="#94a3b8" />
                    }
                  </div>
                </button>

                {/* 펼침 내용 */}
                {isOpen && (
                  <div style={{ padding: "0 24px 24px" }}>
                    {/* 구분선 */}
                    <div style={{ height: 1, background: crime.border, marginBottom: 20 }} />

                    {/* 통계 테이블 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 20 }}>
                      {crime.stats.map((stat, i) => (
                        <div key={stat.label} style={{
                          display: "grid", gridTemplateColumns: "1fr auto auto",
                          alignItems: "center", gap: 16, padding: "11px 0",
                          borderBottom: i < crime.stats.length - 1 ? `1px solid ${crime.bg}` : "none",
                        }}>
                          <span style={{ color: "#64748b", fontSize: 13 }}>{stat.label}</span>
                          <span style={{
                            color: stat.bold ? crime.color : "#0f172a",
                            fontWeight: stat.bold ? 800 : 600,
                            fontSize: stat.bold ? 16 : 14,
                            textAlign: "right",
                          }}>
                            {stat.value}
                          </span>
                          <span style={{
                            fontSize: 10, padding: "2px 8px", borderRadius: 12, fontWeight: 600,
                            background: crime.bg, color: crime.color,
                            border: `1px solid ${crime.border}`,
                            whiteSpace: "nowrap",
                          }}>
                            {stat.source}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 한 줄 경고 */}
                    <div style={{
                      background: crime.bg, border: `1px solid ${crime.border}`,
                      borderRadius: 12, padding: "12px 16px", marginBottom: 20,
                    }}>
                      <p style={{ color: crime.color, fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
                        ⚠️ {crime.note}
                      </p>
                    </div>

                    {/* 출처 링크 */}
                    <div>
                      <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>데이터 출처</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {crime.sources.map((srcName) => {
                          const src = SOURCES.find(s => s.name === srcName);
                          return src ? (
                            <a
                              key={srcName}
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                padding: "6px 12px", borderRadius: 20,
                                background: src.color + "0e", border: `1px solid ${src.color}28`,
                                color: src.color, fontSize: 11, fontWeight: 600,
                                textDecoration: "none",
                              }}
                            >
                              {srcName} <ExternalLink size={10} />
                            </a>
                          ) : null;
                        })}
                        <button
                          onClick={() => router.push(crime.id === "illegal-gambling" ? "/gambling" : `/crime/${crime.id}`)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "6px 12px", borderRadius: 20,
                            background: crime.color, color: "#fff",
                            border: "none", cursor: "pointer",
                            fontSize: 11, fontWeight: 700,
                          }}
                        >
                          직접 체험해보기 →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 하단 안내 */}
        <div style={{
          marginTop: 48, background: "#fff", borderRadius: 18,
          padding: "28px 32px", border: "1px solid #e2e8f0",
          boxShadow: "0 2px 12px #0000000a",
        }}>
          <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>📌 통계 이용 안내</p>
          <ul style={{ color: "#64748b", fontSize: 13, lineHeight: 2.2, paddingLeft: 16 }}>
            <li>이 페이지의 통계 수치는 각 기관의 최신 공개 자료를 기준으로 하며, 실제 수치와 소폭 차이가 있을 수 있습니다.</li>
            <li>정확한 최신 데이터는 각 출처 기관 홈페이지에서 직접 확인하시기 바랍니다.</li>
            <li>통계 오류 또는 업데이트 요청: <strong style={{ color: "#2563eb" }}>itnlifecn@gmail.com</strong></li>
          </ul>
        </div>

      </div>
    </div>
  );
}
