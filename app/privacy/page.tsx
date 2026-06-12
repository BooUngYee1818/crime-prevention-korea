"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, CheckCircle, XCircle, BarChart2 } from "lucide-react";

const KOREA_POPULATION = 51_740_000;

export default function PrivacyPage() {
  const router = useRouter();

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
          <Shield size={14} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>개인정보처리방침 · 이용약관 · 면책조항</span>
      </nav>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "60px 40px 80px" }}>

        {/* 핵심 요약 배너 */}
        <div style={{
          background: "linear-gradient(135deg, #f0fdf4, #eff6ff)",
          border: "1px solid #bbf7d0", borderRadius: 22,
          padding: "32px 36px", marginBottom: 48,
          boxShadow: "0 2px 16px #0000000a",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <Shield size={22} color="#059669" />
            <p style={{ color: "#0f172a", fontWeight: 900, fontSize: 20 }}>한 줄 요약</p>
          </div>
          <p style={{ color: "#0f172a", fontSize: 18, fontWeight: 700, lineHeight: 1.9 }}>
            이 사이트는 귀하의 <span style={{ color: "#dc2626" }}>이름, 전화번호, 주소, 계좌번호, 주민등록번호</span> 등<br />
            <strong style={{ color: "#dc2626" }}>어떠한 개인 신상정보도 수집하거나 저장하지 않습니다.</strong>
          </p>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 12, lineHeight: 1.7 }}>
            체험 중 입력하는 계좌번호·금액은 화면에만 표시되며, 실제 금융기관과 연결되지 않습니다.<br />
            이 사이트를 이용하더라도 귀하의 통장에서 단 1원도 빠져나가지 않습니다.
          </p>
        </div>

        {/* 수집 여부 체크리스트 */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 32px", marginBottom: 32, border: "1px solid #f1f5f9", boxShadow: "0 2px 12px #0000000a" }}>
          <p style={{ color: "#0f172a", fontWeight: 800, fontSize: 18, marginBottom: 24 }}>📋 수집 항목 명세</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { item: "이름 / 성함",               collected: false },
              { item: "전화번호 / 휴대폰 번호",     collected: false },
              { item: "주민등록번호",               collected: false },
              { item: "주소 / 거주지",              collected: false },
              { item: "실제 계좌번호",              collected: false },
              { item: "신용카드 정보",              collected: false },
              { item: "비밀번호",                   collected: false },
              { item: "위치 정보 (GPS)",            collected: false },
              { item: "카메라·마이크 접근",          collected: false },
              { item: "익명 방문자 수 (국가 통계용)", collected: true,  note: "개인 식별 불가, IP 비저장" },
              { item: "기관 문의 이메일 (자발적 제출)", collected: true, note: "문의 답변 전용, 제3자 미제공" },
            ].map((row, i) => (
              <div key={row.item} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "13px 0",
                borderBottom: i < 10 ? "1px solid #f8fafc" : "none",
              }}>
                {row.collected
                  ? <CheckCircle size={18} color="#059669" style={{ flexShrink: 0 }} />
                  : <XCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                }
                <span style={{ color: "#0f172a", fontSize: 14, flex: 1 }}>{row.item}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                  background: row.collected ? "#f0fdf4" : "#fef2f2",
                  color: row.collected ? "#15803d" : "#dc2626",
                  border: `1px solid ${row.collected ? "#bbf7d0" : "#fecaca"}`,
                }}>
                  {row.collected ? "수집" : "수집 안 함"}
                </span>
                {row.note && <span style={{ color: "#94a3b8", fontSize: 11, minWidth: 180 }}>{row.note}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* 이용 통계 안내 */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 32px", marginBottom: 32, border: "1px solid #f1f5f9", boxShadow: "0 2px 12px #0000000a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <BarChart2 size={20} color="#2563eb" />
            <p style={{ color: "#0f172a", fontWeight: 800, fontSize: 18 }}>이용 현황 통계 수집 방식</p>
          </div>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.9, marginBottom: 20 }}>
            이 사이트는 <strong style={{ color: "#334155" }}>Vercel Analytics</strong>를 통해 익명 방문 통계를 수집합니다.<br />
            대한민국 인구(약 {KOREA_POPULATION.toLocaleString()}명) 대비 몇 퍼센트가 이 프로그램을 체험했는지 파악하여,
            범죄 예방 교육의 사회적 효과를 측정하기 위한 목적입니다.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "✅", title: "수집하는 것", items: ["페이지 방문 횟수", "접속 국가 (대한민국 여부)", "사용 기기 종류 (PC/모바일)", "시나리오별 체험 횟수"] },
              { icon: "❌", title: "수집하지 않는 것", items: ["IP 주소 (저장 안 함)", "브라우저 지문(Fingerprint)", "쿠키 추적", "개인 식별 가능 정보 일체"] },
            ].map((col) => (
              <div key={col.title} style={{
                background: col.icon === "✅" ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${col.icon === "✅" ? "#bbf7d0" : "#fecaca"}`,
                borderRadius: 14, padding: "18px 20px",
              }}>
                <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: col.icon === "✅" ? "#15803d" : "#dc2626" }}>
                  {col.icon} {col.title}
                </p>
                {col.items.map((item) => (
                  <p key={item} style={{ color: "#475569", fontSize: 12, lineHeight: 2 }}>· {item}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 면책조항 */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 32px", marginBottom: 32, border: "1px solid #f1f5f9", boxShadow: "0 2px 12px #0000000a" }}>
          <p style={{ color: "#0f172a", fontWeight: 800, fontSize: 18, marginBottom: 20 }}>⚖️ 면책조항 (Disclaimer)</p>
          {[
            { title: "교육 목적 전용", desc: "이 사이트는 범죄 예방 교육만을 목적으로 제작되었습니다. 범죄를 조장하거나 실제 범죄 행위를 유도하지 않습니다." },
            { title: "실제 금융거래 없음", desc: "체험 중 표시되는 은행 화면, 계좌번호, 금액은 모두 시뮬레이션입니다. 실제 금융기관(KB국민은행 등)과 아무런 연결이 없으며, 실제 이체·출금이 발생하지 않습니다." },
            { title: "AI 대화 안전성", desc: "AI(Claude)와의 대화는 범죄 수법 체험용 교육 콘텐츠이며, 대화 내용은 서버에 저장되지 않습니다. Claude API를 통해 처리되며 Anthropic의 개인정보처리방침을 따릅니다." },
            { title: "제3자 정보 제공 없음", desc: "수집된 익명 통계 데이터는 어떠한 제3자(광고사, 기업, 정부기관 포함)에게도 판매하거나 제공하지 않습니다." },
            { title: "법적 책임 한계", desc: "본 사이트 이용 중 발생하는 사용자의 자발적인 외부 행동(실제 범죄 사이트 접속 등)에 대해 개발자는 법적 책임을 지지 않습니다." },
          ].map((item, i) => (
            <div key={item.title} style={{
              paddingBottom: i < 4 ? 18 : 0,
              marginBottom: i < 4 ? 18 : 0,
              borderBottom: i < 4 ? "1px solid #f1f5f9" : "none",
            }}>
              <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{item.title}</p>
              <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.8 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 이용약관 */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 32px", marginBottom: 32, border: "1px solid #f1f5f9", boxShadow: "0 2px 12px #0000000a" }}>
          <p style={{ color: "#0f172a", fontWeight: 800, fontSize: 18, marginBottom: 20 }}>📄 이용약관</p>
          {[
            { title: "제1조 (목적)", desc: "본 약관은 범죄예방 체험관(이하 '사이트')의 이용 조건 및 절차, 운영자와 이용자 간의 권리·의무를 규정함을 목적으로 합니다." },
            { title: "제2조 (서비스 내용)", desc: "사이트는 보이스피싱·스미싱·투자사기·불법도박 등 범죄 수법 체험 교육 서비스를 무료로 제공합니다. 모든 체험은 시뮬레이션이며 실제 금전 거래가 발생하지 않습니다." },
            { title: "제3조 (이용자 의무)", desc: "이용자는 본 사이트를 교육 목적으로만 이용해야 합니다. 체험을 통해 습득한 범죄 수법을 실제로 활용하는 행위는 엄격히 금지되며, 해당 행위에 대한 법적 책임은 전적으로 이용자에게 있습니다." },
            { title: "제4조 (개인정보)", desc: "사이트는 이용자의 개인 신상정보를 수집하지 않습니다. 자발적으로 제출한 기관 문의 이메일은 답변 목적 외에 사용되지 않으며, 요청 시 즉시 삭제합니다." },
            { title: "제5조 (서비스 변경 및 중단)", desc: "운영자는 서비스 내용을 사전 고지 없이 변경하거나 중단할 수 있습니다. 서비스 중단으로 인한 손해에 대해 운영자는 책임을 지지 않습니다." },
          ].map((item, i) => (
            <div key={item.title} style={{
              paddingBottom: i < 4 ? 18 : 0,
              marginBottom: i < 4 ? 18 : 0,
              borderBottom: i < 4 ? "1px solid #f1f5f9" : "none",
            }}>
              <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{item.title}</p>
              <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.8 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 시행일·문의 */}
        <div style={{
          background: "#f8fafc", borderRadius: 16, padding: "22px 28px",
          border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>시행일</p>
            <p style={{ color: "#475569", fontSize: 13, fontWeight: 600 }}>2026년 6월 12일 제정 · 수시 업데이트</p>
          </div>
          <div>
            <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>개인정보 관련 문의</p>
            <p style={{ color: "#2563eb", fontSize: 13, fontWeight: 600 }}>itnlifecn@gmail.com</p>
          </div>
          <button onClick={() => router.push("/")} style={{
            padding: "10px 20px", borderRadius: 10, background: "#fff",
            color: "#64748b", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 13,
          }}>
            ← 메인으로
          </button>
        </div>

      </div>
    </div>
  );
}
