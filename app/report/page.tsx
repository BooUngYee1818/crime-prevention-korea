"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, ExternalLink, AlertTriangle } from "lucide-react";

const REPORT_ITEMS = [
  {
    category: "보이스피싱 · 전기통신 금융사기",
    color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: "📞",
    agencies: [
      { name: "경찰청 112", desc: "즉시 신고 · 계좌 지급정지 요청", number: "112", url: "https://www.police.go.kr" },
      { name: "금융감독원 1332", desc: "피해 상담 · 계좌 지급정지 · 피해금 환급 신청", number: "1332", url: "https://www.fss.or.kr" },
      { name: "금융결제원 계좌정보통합관리", desc: "내 명의 계좌 전체 확인·해지", number: null, url: "https://www.payinfo.or.kr" },
    ],
    steps: [
      "즉시 112 또는 1332에 전화해 계좌 지급정지를 요청하세요",
      "피해 입금 계좌번호·금액·날짜를 메모해 두세요",
      "경찰서에 방문해 피해신고서를 작성하세요",
      "금감원 보이스피싱 지킴이 사이트에서 피해금 환급을 신청하세요",
    ],
  },
  {
    category: "불법 도박 · 도박 중독",
    color: "#7c3aed", bg: "#faf5ff", border: "#ddd6fe", icon: "🎰",
    agencies: [
      { name: "한국도박문제관리센터 1336", desc: "24시간 무료 상담 · 치료 연계 · 가족 상담", number: "1336", url: "https://www.kcgp.or.kr" },
      { name: "경찰청 사이버수사대 182", desc: "불법 도박 사이트 신고", number: "182", url: "https://ecrm.police.go.kr" },
      { name: "사행산업통합감독위원회", desc: "불법 사행산업 신고", number: null, url: "https://www.ngcc.go.kr" },
    ],
    steps: [
      "1336으로 전화해 즉시 상담을 받으세요 (24시간, 무료, 익명 가능)",
      "불법 도박 사이트 주소를 캡처해 경찰청 사이버수사대에 신고하세요",
      "도박 앱은 즉시 삭제하고 관련 계정을 탈퇴하세요",
      "가족과 함께 KCGP 가족 상담 프로그램을 이용하세요",
    ],
  },
  {
    category: "스미싱 · 악성앱 · 개인정보 유출",
    color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", icon: "📱",
    agencies: [
      { name: "한국인터넷진흥원(KISA) 118", desc: "스미싱·해킹·악성앱·개인정보 유출 신고", number: "118", url: "https://www.kisa.or.kr" },
      { name: "경찰청 사이버수사대 182", desc: "사이버 범죄 신고", number: "182", url: "https://ecrm.police.go.kr" },
      { name: "개인정보보호위원회", desc: "개인정보 침해 신고", number: null, url: "https://www.pipc.go.kr" },
    ],
    steps: [
      "악성 앱 설치 시 즉시 스마트폰을 비행기 모드로 전환하세요",
      "118에 전화해 악성앱 제거 방법을 안내받으세요",
      "금융앱·인터넷뱅킹 비밀번호를 즉시 변경하세요",
      "통신사에 명의도용 여부를 확인하세요",
    ],
  },
  {
    category: "투자 사기 · 주식리딩방",
    color: "#059669", bg: "#f0fdf4", border: "#bbf7d0", icon: "📈",
    agencies: [
      { name: "금융감독원 1332", desc: "불법 투자 사기 · 유사수신 신고 · 피해 상담", number: "1332", url: "https://www.fss.or.kr" },
      { name: "경찰청 112", desc: "사기 피해 형사 고소", number: "112", url: "https://www.police.go.kr" },
      { name: "한국소비자원 1372", desc: "소비자 피해 구제 신청", number: "1372", url: "https://www.kca.go.kr" },
    ],
    steps: [
      "피해 금액·입금 내역·대화 내용을 모두 캡처해 보관하세요",
      "금감원 1332에 전화해 해당 업체의 인가 여부를 확인하세요",
      "경찰서에 방문해 사기죄로 형사 고소하세요",
      "법무부 법률구조공단(132)에서 무료 법률 상담을 받으세요",
    ],
  },
  {
    category: "로맨스 스캠 · 메신저 사기",
    color: "#db2777", bg: "#fdf2f8", border: "#fbcfe8", icon: "💝",
    agencies: [
      { name: "경찰청 112", desc: "사기죄 형사 고소 · 계좌 지급정지", number: "112", url: "https://www.police.go.kr" },
      { name: "금융감독원 1332", desc: "피해 계좌 지급정지 요청", number: "1332", url: "https://www.fss.or.kr" },
      { name: "카카오 고객센터", desc: "사기 계정 신고 (카카오톡 앱 내 신고)", number: null, url: "https://cs.kakao.com" },
    ],
    steps: [
      "상대방과의 모든 대화 내용을 캡처해 보관하세요",
      "상대방 계좌로 이체한 금액이 있다면 즉시 112에 신고하세요",
      "카카오톡·SNS 계정을 즉시 신고·차단하세요",
      "수치심을 느낄 필요 없습니다. 이건 당신의 잘못이 아닙니다.",
    ],
  },
  {
    category: "중고거래 사기",
    color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", icon: "📦",
    agencies: [
      { name: "경찰청 사이버수사대 182", desc: "온라인 사기 신고 (인터넷으로도 가능)", number: "182", url: "https://ecrm.police.go.kr" },
      { name: "더치트 (사기피해 공유)", desc: "사기꾼 계좌·전화번호 공유 사이트", number: null, url: "https://thecheat.co.kr" },
      { name: "경찰청 112", desc: "사기 피해 형사 고소", number: "112", url: "https://www.police.go.kr" },
    ],
    steps: [
      "거래 내역·대화·입금 영수증을 모두 캡처해 보관하세요",
      "더치트(thecheat.co.kr)에서 해당 계좌·번호를 조회하세요",
      "경찰청 사이버수사대(ecrm.police.go.kr)에 온라인으로 신고하세요",
      "금액이 크다면 경찰서 방문 후 형사 고소하세요",
    ],
  },
];

export default function ReportPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", color: "#1e293b" }}>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", gap: 12,
        padding: "0 40px", height: 62, boxShadow: "0 1px 8px #0000000a",
      }}>
        <button onClick={() => router.push("/")} style={{ padding: 8, background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", borderRadius: 8 }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #dc2626, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AlertTriangle size={14} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>2차 피해 예방 · 신고 안내</span>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 40px 80px" }}>
        {/* 긴급 배너 */}
        <div style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)", borderRadius: 20, padding: "28px 32px", marginBottom: 40, boxShadow: "0 4px 24px #dc262630" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 36, flexShrink: 0 }}>🆘</span>
            <div>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 20, marginBottom: 10 }}>이미 피해를 당하셨나요? 지금 당장 신고하세요.</p>
              <p style={{ color: "#fca5a5", fontSize: 14, lineHeight: 1.9 }}>
                신고가 빠를수록 <strong style={{ color: "#fff" }}>계좌 지급정지로 피해금 환급</strong> 가능성이 높아집니다.<br />
                창피하거나 무서울 필요 없습니다. <strong style={{ color: "#fff" }}>범죄 피해는 당신의 잘못이 아닙니다.</strong>
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            {[{ n: "112", l: "경찰청" }, { n: "1332", l: "금융감독원" }, { n: "118", l: "인터넷진흥원" }, { n: "1336", l: "도박중독상담" }].map((r) => (
              <a key={r.n} href={`tel:${r.n}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "12px 20px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", minWidth: 80 }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: 24 }}>{r.n}</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 }}>{r.l}</span>
              </a>
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>피해 유형별 신고 방법</h2>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>해당 피해 유형을 확인하고 즉시 신고하세요.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {REPORT_ITEMS.map((item) => (
            <div key={item.category} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px #0000000a" }}>
              <div style={{ background: item.bg, borderBottom: `1px solid ${item.border}`, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <p style={{ color: item.color, fontWeight: 800, fontSize: 15 }}>{item.category}</p>
              </div>
              <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>신고 기관</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {item.agencies.map((agency) => (
                      <div key={agency.name} style={{ padding: "10px 12px", borderRadius: 10, background: item.bg, border: `1px solid ${item.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <p style={{ color: item.color, fontWeight: 700, fontSize: 13 }}>{agency.name}</p>
                          {agency.number && (
                            <a href={`tel:${agency.number}`} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: item.color, color: "#fff", textDecoration: "none", fontWeight: 700 }}>
                              📞 {agency.number}
                            </a>
                          )}
                          {agency.url && (
                            <a href={agency.url} target="_blank" rel="noopener noreferrer" style={{ color: "#94a3b8" }}>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        <p style={{ color: "#64748b", fontSize: 12 }}>{agency.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>신고 절차</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {item.steps.map((step, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
                        </div>
                        <p style={{ color: "#334155", fontSize: 13, lineHeight: 1.6 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 18, padding: "22px 28px", textAlign: "center" }}>
          <p style={{ color: "#15803d", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>🙏 혼자 감당하지 않아도 됩니다</p>
          <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.9 }}>
            피해를 당한 것은 당신의 잘못이 아닙니다. 범죄자가 잘못한 것입니다.<br />
            지금 신고 한 통이 당신과 다음 피해자를 함께 지킵니다.
          </p>
        </div>
      </div>
    </div>
  );
}
