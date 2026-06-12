"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, CheckCircle, Phone, Mail, Building2, Users, BookOpen, ChevronRight, Send } from "lucide-react";

const PACKAGES = [
  {
    name: "기본형",
    tag: "소규모 기관",
    price: "협의",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    features: [
      "웹 플랫폼 무제한 접속 (링크 제공)",
      "9가지 범죄 시나리오 전체 이용",
      "기관 로고 삽입 (헤더)",
      "교육 자료 PDF 제공",
      "이메일 기술 지원",
    ],
    target: "주민센터·경로당·소규모 단체",
    notIncluded: ["강사 파견", "커스텀 시나리오"],
  },
  {
    name: "표준형",
    tag: "추천",
    price: "협의",
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#ddd6fe",
    features: [
      "기본형 전체 포함",
      "기관 전용 도메인 설정",
      "기관명·CI 커스터마이징",
      "수료증 발급 기능",
      "월간 이용 통계 리포트",
      "전화·화상 기술 지원",
    ],
    target: "시·도 교육청·지자체·금융기관",
    notIncluded: ["강사 파견"],
  },
  {
    name: "프리미엄형",
    tag: "공공기관 전용",
    price: "협의",
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    features: [
      "표준형 전체 포함",
      "기관 맞춤 시나리오 추가 제작",
      "오프라인 교육 강사 파견",
      "연간 콘텐츠 업데이트",
      "대시보드 관리자 페이지",
      "SLA 기술 지원 보증",
    ],
    target: "경찰청·교육부·대형 공공기관",
    notIncluded: [],
  },
];

const TARGETS = [
  { icon: "🏛️", name: "경찰청·사이버수사대", desc: "공식 범죄예방 교육 자료로 활용" },
  { icon: "🎓", name: "시·도 교육청", desc: "중·고등학교 디지털 리터러시 교육" },
  { icon: "🏦", name: "은행·금융기관", desc: "고객·임직원 금융사기 예방 교육" },
  { icon: "🏠", name: "지자체·주민센터", desc: "어르신 보이스피싱 예방 교육" },
  { icon: "⚕️", name: "복지관·상담센터", desc: "도박 중독 예방 교육 프로그램" },
  { icon: "🪖", name: "군부대·공공기관", desc: "장병·공무원 보안 의식 교육" },
];

const STEPS = [
  { step: "01", icon: <Mail size={20} color="#2563eb" />, bg: "#eff6ff", border: "#bfdbfe", title: "도입 문의", desc: "아래 양식 또는 이메일로 문의해 주시면 24시간 내 답변드립니다." },
  { step: "02", icon: <BookOpen size={20} color="#7c3aed" />, bg: "#faf5ff", border: "#ddd6fe", title: "제안서 발송", desc: "기관 규모와 목적에 맞는 맞춤형 제안서를 무료로 보내드립니다." },
  { step: "03", icon: <Building2 size={20} color="#059669" />, bg: "#f0fdf4", border: "#bbf7d0", title: "계약 및 도입", desc: "계약 후 최대 2주 내 세팅 완료. 교육 담당자 온보딩을 지원합니다." },
  { step: "04", icon: <Users size={20} color="#dc2626" />, bg: "#fef2f2", border: "#fecaca", title: "교육 운영", desc: "교육 현장에서 즉시 활용. 운영 중 기술 문의는 상시 지원합니다." },
];

export default function PartnershipPage() {
  const router = useRouter();
  const [form, setForm] = useState({ org: "", name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`[기관 도입 문의] ${form.org} - ${form.name}`);
    const body = encodeURIComponent(
      `기관명: ${form.org}\n담당자: ${form.name}\n이메일: ${form.email}\n연락처: ${form.phone}\n\n문의 내용:\n${form.message}`
    );
    window.location.href = `mailto:itnlifecn@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

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
        <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>기관 도입 안내</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: 20, border: "1px solid #bfdbfe" }}>
          Partnership
        </span>
      </nav>

      {/* 히어로 */}
      <section style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #1e293b 60%, #0f172a 100%)",
        padding: "80px 40px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 20, padding: "6px 16px", marginBottom: 28,
          }}>
            <Building2 size={13} color="#93c5fd" />
            <span style={{ color: "#93c5fd", fontSize: 12, fontWeight: 700 }}>공공기관·교육기관·금융기관 전용</span>
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 900, color: "#fff", letterSpacing: -1.2, lineHeight: 1.2, marginBottom: 20 }}>
            범죄예방 교육을<br />
            <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              기관에 도입하세요
            </span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.9, marginBottom: 40 }}>
            연간 1조 2천억원 규모의 보이스피싱·사기 피해,<br />
            200만명 도박 중독자. 이 숫자를 줄일 수 있는 가장 효과적인 방법은<br />
            <strong style={{ color: "#e2e8f0" }}>직접 체험하는 예방 교육</strong>입니다.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#inquiry" style={{
              padding: "14px 32px", borderRadius: 14,
              background: "linear-gradient(135deg, #2563eb, #4f46e5)",
              color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 15,
              boxShadow: "0 4px 20px #2563eb50",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              도입 문의하기 <ChevronRight size={16} />
            </a>
            <a href="#packages" style={{
              padding: "14px 24px", borderRadius: 14,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#e2e8f0", textDecoration: "none", fontWeight: 500, fontSize: 15,
            }}>
              패키지 보기
            </a>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "72px 40px" }}>

        {/* 도입 효과 */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>WHY US</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -0.8, color: "#0f172a", marginBottom: 14 }}>왜 이 프로그램인가요?</h2>
          <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8 }}>단순 강의나 유인물이 아닌, AI와의 실제 대화를 통한 몰입형 체험 교육입니다.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 72 }}>
          {[
            { icon: "🎯", color: "#2563eb", bg: "#eff6ff", title: "실제 체험 교육", desc: "AI가 실제 사기범처럼 대화하며 범죄 수법을 몸으로 익힙니다. 강의보다 10배 더 기억에 남습니다." },
            { icon: "💰", color: "#059669", bg: "#f0fdf4", title: "비용 효율적", desc: "강사 파견 없이 링크 하나로 수백 명이 동시 교육 가능. 1인당 교육 비용을 획기적으로 줄입니다." },
            { icon: "📊", color: "#7c3aed", bg: "#faf5ff", title: "데이터 기반", desc: "경찰청·금감원·통계청 실제 데이터 기반 콘텐츠. 교육 이후 인식 변화를 수치로 확인하세요." },
            { icon: "🔄", color: "#dc2626", bg: "#fef2f2", title: "상시 업데이트", desc: "새로운 범죄 수법이 등장하면 콘텐츠를 즉시 업데이트합니다. 항상 최신 정보로 교육합니다." },
            { icon: "📱", color: "#0891b2", bg: "#ecfeff", title: "설치 불필요", desc: "별도 앱 설치 없이 웹 브라우저만 있으면 어디서나 즉시 교육 가능합니다." },
            { icon: "🛡️", color: "#ca8a04", bg: "#fefce8", title: "안전한 환경", desc: "실제 돈이 나가거나 개인정보가 수집되지 않는 100% 안전한 시뮬레이션 환경입니다." },
          ].map((item) => (
            <div key={item.title} style={{
              background: "#fff", borderRadius: 20, padding: "26px 24px",
              border: "1px solid #f1f5f9", boxShadow: "0 2px 12px #0000000a",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: item.bg, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 16,
              }}>
                {item.icon}
              </div>
              <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{item.title}</p>
              <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 도입 대상 */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>TARGET</p>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -0.8, color: "#0f172a" }}>이런 기관에 적합합니다</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {TARGETS.map((t) => (
              <div key={t.name} style={{
                background: "#fff", borderRadius: 16, padding: "20px 22px",
                border: "1px solid #f1f5f9", boxShadow: "0 2px 8px #0000000a",
                display: "flex", alignItems: "center", gap: 16,
              }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{t.icon}</span>
                <div>
                  <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{t.name}</p>
                  <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 도입 절차 */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>PROCESS</p>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -0.8, color: "#0f172a" }}>도입 절차</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {STEPS.map((s, i) => (
              <div key={s.step} style={{ position: "relative" }}>
                <div style={{
                  background: "#fff", borderRadius: 20, padding: "26px 22px",
                  border: "1px solid #f1f5f9", boxShadow: "0 2px 12px #0000000a",
                  height: "100%",
                }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: s.bg, border: `1px solid ${s.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 16,
                  }}>
                    {s.icon}
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>STEP {s.step}</p>
                  <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{s.title}</p>
                  <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: "absolute", top: "50%", right: -10, zIndex: 1,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center",
                    transform: "translateY(-50%)",
                  }}>
                    <ChevronRight size={12} color="#94a3b8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 패키지 */}
        <div id="packages" style={{ marginBottom: 72 }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>PACKAGES</p>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -0.8, color: "#0f172a", marginBottom: 14 }}>도입 패키지</h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>기관 규모와 목적에 따라 맞춤형으로 제안드립니다. 모든 패키지는 <strong style={{ color: "#334155" }}>교육 목적 비영리 기관 할인</strong>을 적용합니다.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} style={{
                background: "#fff", borderRadius: 22, padding: "32px 28px",
                border: `2px solid ${pkg.color}30`,
                boxShadow: `0 4px 24px ${pkg.color}10`,
                display: "flex", flexDirection: "column",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
                  flexWrap: "wrap",
                }}>
                  <span style={{ color: "#0f172a", fontWeight: 800, fontSize: 20 }}>{pkg.name}</span>
                  <span style={{
                    fontSize: 10, padding: "3px 10px", borderRadius: 20, fontWeight: 700,
                    background: pkg.bg, color: pkg.color, border: `1px solid ${pkg.border}`,
                  }}>
                    {pkg.tag}
                  </span>
                </div>
                <p style={{ color: "#64748b", fontSize: 12, marginBottom: 20, lineHeight: 1.5 }}>
                  추천 대상: <strong style={{ color: "#334155" }}>{pkg.target}</strong>
                </p>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {pkg.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <CheckCircle size={15} color={pkg.color} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ color: "#334155", fontSize: 13, lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                  {pkg.notIncluded.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, opacity: 0.4 }}>
                      <div style={{ width: 15, height: 15, borderRadius: "50%", border: "1.5px solid #94a3b8", flexShrink: 0, marginTop: 1 }} />
                      <span style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#inquiry" style={{
                  display: "block", textAlign: "center",
                  padding: "13px 0", borderRadius: 12, fontWeight: 700, fontSize: 14,
                  background: pkg.bg, color: pkg.color,
                  border: `1.5px solid ${pkg.border}`,
                  textDecoration: "none", cursor: "pointer",
                }}>
                  이 패키지로 문의하기
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 문의 폼 */}
        <div id="inquiry" style={{
          background: "#fff", borderRadius: 24, padding: "48px 44px",
          border: "1px solid #e2e8f0", boxShadow: "0 4px 32px #0000000f",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>

            {/* 왼쪽: 소개 */}
            <div>
              <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>CONTACT</p>
              <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.6, color: "#0f172a", marginBottom: 16 }}>
                도입 문의<br />지금 바로 해주세요
              </h2>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.9, marginBottom: 32 }}>
                양식을 작성하시면 <strong style={{ color: "#334155" }}>24시간 내</strong>로<br />
                맞춤형 제안서와 함께 답변드립니다.<br />
                상담 및 제안서 발송은 <strong style={{ color: "#334155" }}>완전 무료</strong>입니다.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Mail size={17} color="#2563eb" />
                  </div>
                  <div>
                    <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>이메일</p>
                    <p style={{ color: "#0f172a", fontWeight: 600, fontSize: 14 }}>itnlifecn@gmail.com</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Shield size={17} color="#059669" />
                  </div>
                  <div>
                    <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>운영 원칙</p>
                    <p style={{ color: "#0f172a", fontWeight: 600, fontSize: 14 }}>교육 목적 무료 제공 우선</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#faf5ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Users size={17} color="#7c3aed" />
                  </div>
                  <div>
                    <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>제작</p>
                    <p style={{ color: "#0f172a", fontWeight: 600, fontSize: 14 }}>일반 시민 · AI Claude 협업</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 폼 */}
            {sent ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "60px 0", textAlign: "center", gap: 16,
              }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle size={32} color="#059669" />
                </div>
                <p style={{ color: "#0f172a", fontWeight: 800, fontSize: 20 }}>문의가 접수되었습니다</p>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>
                  24시간 내 이메일로 답변드리겠습니다.<br />
                  감사합니다.
                </p>
                <button
                  onClick={() => setSent(false)}
                  style={{ marginTop: 8, padding: "10px 24px", borderRadius: 10, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                >
                  다시 문의하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { key: "org", label: "기관명 *", placeholder: "예) ○○경찰서, ○○교육청, ○○은행", required: true },
                  { key: "name", label: "담당자 성함 *", placeholder: "홍길동", required: true },
                  { key: "email", label: "이메일 *", placeholder: "example@org.go.kr", required: true },
                  { key: "phone", label: "연락처", placeholder: "010-0000-0000", required: false },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{ color: "#475569", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>{field.label}</label>
                    <input
                      type={field.key === "email" ? "email" : "text"}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      style={{
                        width: "100%", padding: "12px 16px", borderRadius: 12,
                        border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a",
                        background: "#f8fafc", outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ color: "#475569", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>문의 내용 *</label>
                  <textarea
                    placeholder="도입 목적, 예상 교육 인원, 원하는 패키지 등을 자유롭게 작성해 주세요."
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12,
                      border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a",
                      background: "#f8fafc", outline: "none", resize: "vertical",
                      fontFamily: "inherit", boxSizing: "border-box",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                    onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "15px 0", borderRadius: 14,
                    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                    color: "#fff", border: "none", cursor: "pointer",
                    fontSize: 15, fontWeight: 700,
                    boxShadow: "0 4px 20px #2563eb30",
                  }}
                >
                  <Send size={16} /> 문의 보내기
                </button>
                <p style={{ color: "#94a3b8", fontSize: 12, textAlign: "center" }}>
                  제출 시 이메일 앱이 열립니다. 개인정보는 문의 답변 외에 사용되지 않습니다.
                </p>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* 푸터 */}
      <div style={{
        background: "#0f172a", padding: "32px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #2563eb, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={14} color="#fff" />
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>범죄예방 체험관</span>
        </div>
        <p style={{ color: "#475569", fontSize: 13 }}>교육 목적 무료 제공 원칙 · itnlifecn@gmail.com</p>
        <button onClick={() => router.push("/")} style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>← 메인으로</button>
      </div>

    </div>
  );
}
