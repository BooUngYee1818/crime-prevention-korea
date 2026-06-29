"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useLang } from "@/lib/LanguageContext";

// ── 워터마크 (opacity 0.018 — 거의 안 보임) ─────────────────────────────────
function HiddenWatermark() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", opacity: 0.018, transform: "rotate(-30deg)", userSelect: "none", whiteSpace: "nowrap", lineHeight: 3, textAlign: "center" }}>
        도박방지시뮬레이션 불법도박예방체험관<br />
        도박방지시뮬레이션 불법도박예방체험관<br />
        도박방지시뮬레이션 불법도박예방체험관
      </div>
    </div>
  );
}

// ── 실시간 당첨 알림 토스트 ────────────────────────────────────────────────────
const WIN_NAMES = ["김**","이**","박**","최**","정**","강**","조**","윤**","장**","임**","오**","한**"];
const WIN_AMOUNTS = ["₩1,200,000","₩340,000","₩2,800,000","₩560,000","₩4,500,000","₩180,000","₩780,000","₩1,900,000","₩3,200,000","₩450,000"];
const WIN_GAMES = ["바카라","달팽이","사다리","슬롯","스포츠","포커","바카라","달팽이"];

function WinToast({ msg, onDone }: { msg: { name: string; amount: string; game: string }; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      background: "linear-gradient(135deg, #0a1a0a, #0f2a0f)",
      border: "1px solid #16a34a",
      borderRadius: 12, padding: "10px 16px",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 4px 20px #16a34a33, 0 0 0 1px #16a34a22",
      animation: "toastIn 0.3s ease",
      marginBottom: 8,
    }}>
      <span style={{ fontSize: 18 }}>🏆</span>
      <div>
        <span style={{ color: "#86efac", fontWeight: 700, fontSize: 12 }}>{msg.name}</span>
        <span style={{ color: "#6b7280", fontSize: 11 }}> 님이 {msg.game}에서 </span>
        <span style={{ color: "#22c55e", fontWeight: 900, fontSize: 13 }}>{msg.amount}</span>
        <span style={{ color: "#6b7280", fontSize: 11 }}> 당첨!</span>
      </div>
    </div>
  );
}

// ── 사이트 카드 데이터 ─────────────────────────────────────────────────────────
const SITES = [
  {
    id: "herocasino",
    display: "히어로 CASINO",
    sub: "HERO · BACCARAT · SLOT",
    code: "7474",
    bonus: "첫충 40% + 카지노 1.2%",
    extra: "슬롯 4% · 매충 15%",
    glow: "#ef4444",
    dark: "#200808",
    badge: "🔥 HOT",
    badgeColor: "#ef4444",
    icon: "♠️",
    games: ["바카라", "달팽이", "사다리", "슬롯"],
  },
  {
    id: "goldcasino",
    display: "GOLD 888",
    sub: "PREMIUM · VIP · LIVE",
    code: "8888",
    bonus: "신규 50% 대박 이벤트",
    extra: "VIP 전용 · 무제한 환전",
    glow: "#f59e0b",
    dark: "#1c1202",
    badge: "👑 VIP",
    badgeColor: "#f59e0b",
    icon: "🎰",
    games: ["바카라", "포커", "슬롯", "스포츠"],
  },
  {
    id: "speedbet",
    display: "SPEED BET",
    sub: "SPORTS · LIVE · MINI",
    code: "2525",
    bonus: "매충 10% 무한 · 15% 돌발",
    extra: "스포츠 · 실시간 카지노",
    glow: "#3b82f6",
    dark: "#080e20",
    badge: "⚡ LIVE",
    badgeColor: "#3b82f6",
    icon: "⚽",
    games: ["스포츠", "달팽이", "사다리", "바카라"],
  },
  {
    id: "diamondhouse",
    display: "DIAMOND HOUSE",
    sub: "ROYAL · EXCLUSIVE · VIP",
    code: "9999",
    bonus: "페이백 1,000만 · 골프 4%",
    extra: "카지노 무제한 · 토너먼트",
    glow: "#8b5cf6",
    dark: "#100820",
    badge: "💎 ROYAL",
    badgeColor: "#8b5cf6",
    icon: "💎",
    games: ["포커", "바카라", "슬롯", "달팽이"],
  },
  {
    id: "luckyseven",
    display: "LUCKY 777",
    sub: "SLOT · JACKPOT · BONUS",
    code: "7777",
    bonus: "첫충 30% + 슬롯 4%",
    extra: "잭팟 매일 지급 · 미니게임",
    glow: "#22c55e",
    dark: "#061208",
    badge: "🍀 NEW",
    badgeColor: "#22c55e",
    icon: "🎲",
    games: ["슬롯", "사다리", "달팽이", "미니게임"],
  },
  {
    id: "nightclub",
    display: "NIGHT CLUB",
    sub: "BACCARAT · POKER · P2P",
    code: "6969",
    bonus: "승급이벤트 최대 2천만원",
    extra: "P2P · 매충 50% 페이백",
    glow: "#ec4899",
    dark: "#1a0412",
    badge: "🌙 NIGHT",
    badgeColor: "#ec4899",
    icon: "🌙",
    games: ["바카라", "포커", "P2P", "사다리"],
  },
];

export default function GamblingPortalPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [showWarning, setShowWarning] = useState(true);
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: number; name: string; amount: string; game: string }[]>([]);
  const [liveUsers, setLiveUsers] = useState(12847);
  const [totalWin, setTotalWin] = useState(2310);
  const toastId = useRef(0);
  const [pulseIdx, setPulseIdx] = useState(0);
  const [jackpot, setJackpot] = useState(4_820_000);

  // 잭팟 카운터
  useEffect(() => {
    const t = setInterval(() => setJackpot(v => v + Math.floor(Math.random() * 3000 + 500)), 80);
    return () => clearInterval(t);
  }, []);

  // 접속자 수 랜덤 증감
  useEffect(() => {
    const t = setInterval(() => setLiveUsers(v => v + Math.floor(Math.random() * 6) - 2), 3000);
    return () => clearInterval(t);
  }, []);

  // 당첨 토스트 자동 생성
  useEffect(() => {
    const spawn = () => {
      const id = ++toastId.current;
      const msg = {
        id,
        name: WIN_NAMES[Math.floor(Math.random() * WIN_NAMES.length)],
        amount: WIN_AMOUNTS[Math.floor(Math.random() * WIN_AMOUNTS.length)],
        game: WIN_GAMES[Math.floor(Math.random() * WIN_GAMES.length)],
      };
      setToasts(prev => [...prev.slice(-4), msg]);
    };
    spawn();
    const t = setInterval(spawn, 2800);
    return () => clearInterval(t);
  }, []);

  // 카드 펄스 순환
  useEffect(() => {
    const t = setInterval(() => setPulseIdx(v => (v + 1) % SITES.length), 1800);
    return () => clearInterval(t);
  }, []);

  // 10초 후 경고 닫힘
  useEffect(() => {
    const t = setTimeout(() => setShowWarning(false), 9000);
    return () => clearTimeout(t);
  }, []);

  const marquee = "🎰 모든베팅가능 무제재 ★ 환전무제한 고액전용 ★ 신규 첫충 40% ★ 무한 15% ★ 실시간 스포츠 ★ 바카라 달팽이 사다리 ★ 가입코드 입력 추가보너스 ★ VIP 전용 혜택 ★ ";

  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#fff", position: "relative", overflow: "hidden" }}>
      <HiddenWatermark />

      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes glow-pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes jackpot-tick { 0% { transform: translateY(0); } 50% { transform: translateY(-2px); } 100% { transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes card-pulse { 0%,100% { box-shadow: 0 0 0 0 transparent; } 50% { box-shadow: 0 0 30px 4px var(--glow); } }
        @keyframes badge-bounce { 0%,100% { transform: scale(1); } 50% { transform: scale(1.12); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .site-card:hover { transform: translateY(-4px) scale(1.01) !important; }
        .site-card { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1) !important; }
        .nav-item:hover { color: #fff !important; background: #ffffff11 !important; }
      `}</style>

      {/* ── 진입 경고 오버레이 ─────────────────────────────────────────────── */}
      {showWarning && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.95)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ maxWidth: 480, width: "100%", background: "linear-gradient(135deg, #0a0a0a, #0f0f18)", border: "2px solid #ef4444", borderRadius: 24, padding: "32px 28px", textAlign: "center", boxShadow: "0 0 60px #ef444433" }}>
            <div style={{ fontSize: 9, color: "#22c55e", fontWeight: 700, letterSpacing: 2, marginBottom: 12, opacity: 0.8 }}>
              ⚠ 불법도박 예방 시뮬레이션 체험관 ⚠
            </div>
            <div style={{ fontSize: 52, marginBottom: 12, animation: "float 2s ease-in-out infinite" }}>🎰</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ef4444", marginBottom: 12 }}>지금 보시는 화면은<br />실제 도박 사이트입니까?</h2>
            <div style={{ background: "#0f0f0f", border: "1px solid #ef444422", borderRadius: 14, padding: 16, marginBottom: 20, textAlign: "left" }}>
              <p style={{ color: "#ef4444", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>📢 이것은 범죄예방 교육 시뮬레이션입니다</p>
              <ul style={{ color: "#888", fontSize: 12, lineHeight: 2.2, paddingLeft: 16, margin: 0 }}>
                <li>실제 도박 사이트처럼 보이도록 <strong style={{ color: "#fbbf24" }}>의도적으로 제작</strong>된 화면입니다</li>
                <li>실제 돈은 절대 나가지 않습니다</li>
                <li>불법 도박 유혹 수법을 직접 경험해보세요</li>
                <li>진짜 도박 사이트 접속 자체가 <strong style={{ color: "#ef4444" }}>형사처벌 대상</strong>입니다</li>
              </ul>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => router.push("/")} style={{ flex: 1, padding: "13px 0", borderRadius: 12, fontSize: 13, background: "transparent", color: "#555", border: "1px solid #2a2a2a", cursor: "pointer" }}>
                나가기
              </button>
              <button onClick={() => setShowWarning(false)} style={{ flex: 2, padding: "13px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg, #dc2626, #ef4444)", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 0 20px #ef444455" }}>
                ⚠ 교육 목적으로 체험하기
              </button>
            </div>
            <p style={{ color: "#2a2a2a", fontSize: 9, marginTop: 12 }}>본 콘텐츠는 범죄예방 교육 프로그램입니다</p>
          </div>
        </div>
      )}

      {/* ── 실시간 당첨 토스트 ──────────────────────────────────────────────── */}
      <div style={{ position: "fixed", bottom: 24, right: 16, zIndex: 900, width: 260 }}>
        {toasts.map(t => (
          <WinToast key={t.id} msg={t} onDone={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
        ))}
      </div>

      {/* ── 마키 배너 ───────────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(90deg, #dc2626, #b91c1c, #dc2626)", padding: "7px 0", overflow: "hidden", position: "relative", zIndex: 10 }}>
        <div style={{ display: "inline-block", whiteSpace: "nowrap", animation: "marquee 28s linear infinite", fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>
          {(marquee + marquee)}
        </div>
      </div>

      {/* ── 헤더 ────────────────────────────────────────────────────────────── */}
      <header style={{ background: "linear-gradient(180deg, #0f0008 0%, #080005 100%)", borderBottom: "1px solid #2a0a1a", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10 }}>
        {/* 로고 */}
        <div>
          <div style={{
            fontSize: 24, fontWeight: 900, letterSpacing: -0.5,
            background: "linear-gradient(90deg, #ffd700 0%, #ff6b00 40%, #ffd700 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 3s linear infinite",
          }}>
            🎰 먹튀검증 카지노 포털
          </div>
          <div style={{ fontSize: 8, color: "#22c55e", opacity: 0.5, marginTop: 2, letterSpacing: 1 }}>
            ※ 불법도박 예방 교육 시뮬레이션 — 실제 사이트 아님
          </div>
        </div>
        {/* 우측 */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#ef4444", fontWeight: 900, fontSize: 16 }}>{liveUsers.toLocaleString()}</div>
            <div style={{ color: "#555", fontSize: 9 }}>실시간 접속</div>
          </div>
          <div style={{ width: 1, height: 32, background: "#2a2a2a" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#f59e0b", fontWeight: 900, fontSize: 16 }}>₩{totalWin}억</div>
            <div style={{ color: "#555", fontSize: 9 }}>오늘 환전액</div>
          </div>
          <button onClick={() => router.push("/")} style={{ padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "#22c55e", color: "#000", border: "none", cursor: "pointer", marginLeft: 8 }}>
            ← 예방센터
          </button>
        </div>
      </header>

      {/* ── 네비게이션 ──────────────────────────────────────────────────────── */}
      <nav style={{ background: "#0a0a0f", borderBottom: "1px solid #1a1a2a", display: "flex", overflow: "auto", position: "relative", zIndex: 10 }}>
        {["🏠 메인","⚽ 스포츠","🎰 바카라","🐌 달팽이","🪜 사다리","🎲 슬롯","🃏 포커","💬 고객센터"].map((item, i) => (
          <div key={i} className="nav-item" onClick={() => i > 0 && i < 7 && router.push("/gambling/play")} style={{ padding: "11px 18px", fontSize: 13, fontWeight: 600, color: i === 0 ? "#ffd700" : "#666", cursor: "pointer", whiteSpace: "nowrap", borderBottom: i === 0 ? "2px solid #ffd700" : "2px solid transparent", transition: "all 0.2s" }}>
            {item}
          </div>
        ))}
        <div style={{ marginLeft: "auto", padding: "11px 16px", fontSize: 9, color: "#1a3a1a", fontWeight: 700, letterSpacing: 1 }}>[시뮬레이션]</div>
      </nav>

      {/* ── 잭팟 카운터 배너 ────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(90deg, #1a0a00, #2a1200, #1a0a00)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 20, borderBottom: "1px solid #3a1a00", position: "relative", zIndex: 10 }}>
        <div style={{ color: "#888", fontSize: 13, fontWeight: 700 }}>🏆 현재 잭팟</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#ffd700", letterSpacing: 2, animation: "jackpot-tick 0.1s ease", fontVariantNumeric: "tabular-nums", textShadow: "0 0 20px #ffd70088" }}>
          ₩{jackpot.toLocaleString()}
        </div>
        <div style={{ background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 900, padding: "4px 10px", borderRadius: 20, animation: "badge-bounce 1.5s ease-in-out infinite" }}>
          실시간 증가 중
        </div>
        {/* 간접 힌트: 매우 작고 흐리게 */}
        <div style={{ position: "absolute", right: 12, bottom: 3, fontSize: 7, color: "#1a1a1a", fontWeight: 700 }}>
          가상 수치 · 시뮬레이션
        </div>
      </div>

      {/* ── 메인 헤드라인 ───────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(180deg, #0a0010 0%, #050508 100%)", padding: "24px 20px 20px", textAlign: "center", borderBottom: "1px solid #1a1a2a", position: "relative", zIndex: 10 }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, letterSpacing: 3, marginBottom: 8, opacity: 0.8 }}>
          ★ 먹튀없는 안전한 TOP 인증 카지노 ★
        </div>
        <h1 style={{
          fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 6,
          background: "linear-gradient(90deg, #ef4444 0%, #f59e0b 30%, #ffd700 50%, #f59e0b 70%, #ef4444 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "shimmer 4s linear infinite",
        }}>
          모든베팅가능 무제재 · 환전무제한
        </h1>
        <p style={{ color: "#555", fontSize: 13 }}>
          실시간 스포츠 · 바카라 · 달팽이 · 사다리 · 슬롯 · 포커
        </p>

        {/* 보너스 태그들 */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
          {[
            { label: "🎁 신규 첫충 40%", color: "#ef4444" },
            { label: "♾️ 매충 15%", color: "#f59e0b" },
            { label: "💸 무제한 환전", color: "#22c55e" },
            { label: "🔐 먹튀보증", color: "#8b5cf6" },
            { label: "⚡ 5분 환전", color: "#3b82f6" },
          ].map((tag, i) => (
            <div key={i} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: `${tag.color}18`, border: `1px solid ${tag.color}44`,
              color: tag.color, animation: `glow-pulse ${1.5 + i * 0.3}s ease-in-out infinite`,
            }}>
              {tag.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── 사이트 카드 그리드 ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 4, height: 20, background: "#ef4444", borderRadius: 2 }} />
          <h2 style={{ color: "#e4e4e7", fontWeight: 800, fontSize: 15 }}>✅ 먹튀검증 완료 카지노</h2>
          <div style={{ background: "#22c55e", color: "#000", fontSize: 10, fontWeight: 900, padding: "2px 8px", borderRadius: 20 }}>인증 {SITES.length}곳</div>
          {/* 간접 힌트: 아주 흐리게 */}
          <div style={{ marginLeft: "auto", color: "#1a1a1a", fontSize: 9, fontWeight: 700 }}>체험 시뮬레이션</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {SITES.map((site, i) => {
            const isPulsing = pulseIdx === i;
            return (
              <div
                key={site.id}
                className="site-card"
                onMouseEnter={() => setHoveredSite(site.id)}
                onMouseLeave={() => setHoveredSite(null)}
                onClick={() => router.push(`/gambling/play?site=${site.id}&name=${encodeURIComponent(site.display)}`)}
                style={{
                  background: `linear-gradient(135deg, ${site.dark} 0%, #0a0a12 60%, ${site.glow}11 100%)`,
                  border: `1px solid ${hoveredSite === site.id || isPulsing ? site.glow : "#1a1a2a"}`,
                  borderRadius: 16,
                  padding: "20px 18px",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  // @ts-ignore
                  "--glow": site.glow + "88",
                  boxShadow: hoveredSite === site.id
                    ? `0 8px 40px ${site.glow}44, 0 0 0 1px ${site.glow}33`
                    : isPulsing
                    ? `0 0 20px ${site.glow}33`
                    : "0 2px 12px #00000060",
                  transition: "box-shadow 0.3s, border-color 0.3s",
                }}
              >
                {/* 상단 광택 효과 */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, background: `linear-gradient(180deg, ${site.glow}10, transparent)`, pointerEvents: "none", borderRadius: "16px 16px 0 0" }} />

                {/* 배지 */}
                <div style={{ position: "absolute", top: 12, right: 12, background: `linear-gradient(135deg, ${site.badgeColor}, ${site.badgeColor}cc)`, color: "#fff", fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 20, boxShadow: `0 2px 8px ${site.badgeColor}55`, animation: isPulsing ? "badge-bounce 0.6s ease" : "none" }}>
                  {site.badge}
                </div>

                {/* 아이콘 + 사이트명 */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${site.glow}22`, border: `1px solid ${site.glow}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {site.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", textShadow: `0 0 16px ${site.glow}88`, letterSpacing: -0.3 }}>{site.display}</div>
                    <div style={{ fontSize: 9, color: site.glow, fontWeight: 700, letterSpacing: 1.5, opacity: 0.8 }}>{site.sub}</div>
                  </div>
                </div>

                {/* 보너스 */}
                <div style={{ background: "#ffffff08", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
                  <div style={{ color: "#ffd700", fontWeight: 800, fontSize: 13, marginBottom: 2 }}>🎁 {site.bonus}</div>
                  <div style={{ color: "#888", fontSize: 11 }}>{site.extra}</div>
                </div>

                {/* 게임 태그 */}
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
                  {site.games.map((g, gi) => (
                    <span key={gi} style={{ background: `${site.glow}18`, border: `1px solid ${site.glow}33`, color: site.glow, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>{g}</span>
                  ))}
                </div>

                {/* 가입코드 + 버튼 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ color: "#555", fontSize: 9, marginBottom: 2 }}>가입코드</div>
                    <div style={{ color: "#ffd700", fontWeight: 900, fontSize: 14, letterSpacing: 3 }}>{site.code}</div>
                  </div>
                  <div style={{
                    padding: "9px 18px", borderRadius: 22, fontSize: 13, fontWeight: 900,
                    background: `linear-gradient(135deg, ${site.glow}, ${site.glow}aa)`,
                    color: "#fff", boxShadow: `0 4px 16px ${site.glow}55`,
                    transition: "all 0.2s",
                    transform: hoveredSite === site.id ? "scale(1.05)" : "scale(1)",
                  }}>
                    입장하기 →
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 게임 바로가기 버튼 ── */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 4, height: 20, background: "#8b5cf6", borderRadius: 2 }} />
            <h2 style={{ color: "#e4e4e7", fontWeight: 800, fontSize: 15 }}>🎮 게임 바로가기</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[
              { icon: "🃏", name: "바카라", sub: "플레이어 vs 뱅커", color: "#ef4444", game: "baccarat" },
              { icon: "🐌", name: "달팽이 경주", sub: "6마리 · 5배 당첨", color: "#22c55e", game: "snail" },
              { icon: "🪜", name: "사다리 게임", sub: "1/4 확률 · 3.5배", color: "#a855f7", game: "ladder" },
              { icon: "🎰", name: "슬롯머신", sub: "잭팟 대박 찬스", color: "#f59e0b", game: "slot" },
            ].map((g, i) => (
              <button
                key={i}
                onClick={() => router.push(`/gambling/play?game=${g.game}`)}
                style={{
                  background: `linear-gradient(135deg, ${g.color}18, #0a0a12)`,
                  border: `1px solid ${g.color}33`,
                  borderRadius: 14, padding: "16px 12px",
                  cursor: "pointer", textAlign: "center",
                  transition: "all 0.2s",
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = g.color; e.currentTarget.style.boxShadow = `0 4px 20px ${g.color}33`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${g.color}33`; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 30, marginBottom: 6 }}>{g.icon}</div>
                <div style={{ color: "#e4e4e7", fontWeight: 800, fontSize: 13, marginBottom: 2 }}>{g.name}</div>
                <div style={{ color: "#555", fontSize: 10 }}>{g.sub}</div>
                <div style={{ marginTop: 8, color: g.color, fontSize: 11, fontWeight: 700 }}>지금 하기 →</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 통계 바 ─────────────────────────────────────────────────────────── */}
      <div style={{ background: "#080808", borderTop: "1px solid #111", padding: "16px 20px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {[
            { label: "현재 접속자", value: liveUsers.toLocaleString(), color: "#ef4444", note: "조작된 수치" },
            { label: "오늘 총 환전액", value: "₩2.3억", color: "#f59e0b", note: "가상 데이터" },
            { label: "이번 달 대박", value: "839건", color: "#22c55e", note: "허위 정보" },
            { label: "VIP 회원", value: "3,291명", color: "#8b5cf6", note: "조작됨" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#0f0f0f", borderRadius: 10, padding: 14, textAlign: "center", border: "1px solid #1a1a1a", position: "relative" }}>
              <div style={{ color: s.color, fontWeight: 900, fontSize: 22 }}>{s.value}</div>
              <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{s.label}</div>
              <div style={{ color: "#1f1f1f", fontSize: 8, marginTop: 3 }}>{s.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 푸터 ────────────────────────────────────────────────────────────── */}
      <footer style={{ background: "#040404", borderTop: "1px solid #0f0f0f", padding: "20px", textAlign: "center", position: "relative", zIndex: 10 }}>
        <p style={{ color: "#111", fontSize: 9, lineHeight: 1.8, maxWidth: 800, margin: "0 auto" }}>
          본 사이트는 범죄예방 교육 목적의 시뮬레이션입니다. 실제 도박 사이트가 아닙니다. | 불법 도박은 형사처벌 대상입니다 (게임산업진흥에 관한 법률 제44조) | 도박 중독 상담: 한국도박문제예방치유원 ☎1336 (24시간 무료) | 이 화면에서 실제 금전 거래는 불가능합니다
        </p>
        <p style={{ color: "#22c55e", fontSize: 8, marginTop: 6, opacity: 0.25 }}>
          ★ 사이트 이름의 첫 글자들을 모아보세요 ★
        </p>
      </footer>
    </div>
  );
}
