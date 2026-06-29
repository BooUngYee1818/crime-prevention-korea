"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, Suspense } from "react";

// ── 판 수에 따른 승률 (초반 미끼 → 후반 거의 불가) ──────────────────────────
function getWinRate(round: number): number {
  if (round <= 2) return 0.88;
  if (round <= 4) return 0.65;
  if (round <= 7) return 0.35;
  if (round <= 11) return 0.18;
  return 0.08;
}

// ── 카드 덱 ──────────────────────────────────────────────────────────────────
const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
function randCard() {
  return {
    suit: SUITS[Math.floor(Math.random() * 4)],
    rank: RANKS[Math.floor(Math.random() * 13)],
    value: 0,
  };
}
function cardVal(rank: string): number {
  if (["J", "Q", "K", "10"].includes(rank)) return 0;
  if (rank === "A") return 1;
  return parseInt(rank);
}
function baccaratScore(cards: { rank: string }[]): number {
  return cards.reduce((s, c) => (s + cardVal(c.rank)) % 10, 0);
}

// ── 달팽이 레이스 ────────────────────────────────────────────────────────────
const SNAIL_NAMES = ["🐌 달팽이1", "🐌 달팽이2", "🐌 달팽이3", "🐌 달팽이4", "🐌 달팽이5", "🐌 달팽이6"];
const SNAIL_COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];

// ── 워터마크 ─────────────────────────────────────────────────────────────────
function Watermark() {
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 80, fontWeight: 900, color: "#fff", opacity: 0.018, transform: "rotate(-30deg)", userSelect: "none", whiteSpace: "nowrap" }}>
        도박방지 시뮬레이션
      </div>
    </div>
  );
}

// ── 중독 경고 오버레이 ────────────────────────────────────────────────────────
function AddictionWarning({ lost, onContinue, onReveal }: { lost: number; onContinue: () => void; onReveal: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.94)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ maxWidth: 440, width: "100%", background: "#0a0000", border: "2px solid #ef4444", borderRadius: 20, padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🚨</div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ef4444", marginBottom: 8 }}>잠깐 멈추세요</h2>
        <p style={{ color: "#fca5a5", fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
          가상 머니 <strong style={{ color: "#ef4444" }}>₩{lost.toLocaleString()}</strong>을 잃었습니다.<br />
          실제 도박에서 이 돈은 <strong>절대 돌아오지 않습니다.</strong>
        </p>
        <div style={{ background: "#1a0808", borderRadius: 12, padding: 14, marginBottom: 18, textAlign: "left" }}>
          <p style={{ color: "#fca5a5", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>⚠️ 지금 이 순간이 도박 중독의 시작입니다</p>
          <ul style={{ color: "#888", fontSize: 12, lineHeight: 2, paddingLeft: 16 }}>
            <li>「한 판만 더」라는 생각이 드신다면 이미 중독 징후</li>
            <li>처음 이긴 건 <strong style={{ color: "#fbbf24" }}>의도적으로 설계된 미끼</strong>입니다</li>
            <li>실제 불법 도박 이용 시 <strong style={{ color: "#ef4444" }}>형사 처벌</strong> 대상</li>
            <li>도박 중독 상담: <strong style={{ color: "#22c55e" }}>한국도박문제예방치유원 1336</strong></li>
          </ul>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onContinue} style={{ flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 13, background: "transparent", color: "#555", border: "1px solid #2a2a2a", cursor: "pointer" }}>
            계속 체험
          </button>
          <button onClick={onReveal} style={{ flex: 2, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", border: "none", cursor: "pointer" }}>
            🛡️ 수법 확인하기
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 결과 화면 ─────────────────────────────────────────────────────────────────
function RevealScreen({ totalLost, round, onRetry, onHome }: { totalLost: number; round: number; onRetry: () => void; onHome: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "#000", overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: 600, width: "100%" }}>
        <div style={{ background: "linear-gradient(135deg, #0a0000, #1a0808)", border: "2px solid #ef4444", borderRadius: 24, padding: "32px 28px", marginBottom: 16 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎰</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#ef4444", marginBottom: 8 }}>이것이 불법 도박의 실체입니다</h1>
            <p style={{ color: "#6b7280", fontSize: 13 }}>교육용 시뮬레이션 체험 완료</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {[
              { label: "총 게임 수", value: `${round}판`, color: "#f59e0b" },
              { label: "가상 손실액", value: `₩${Math.abs(totalLost).toLocaleString()}`, color: "#ef4444" },
              { label: "실제 불법도박 평균 최초 피해", value: "₩230만원", color: "#a855f7" },
              { label: "도박 중독 회복까지", value: "평균 7.3년", color: "#3b82f6" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#0f0f0f", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                <p style={{ color: "#6b7280", fontSize: 11, marginBottom: 4 }}>{s.label}</p>
                <p style={{ color: s.color, fontWeight: 900, fontSize: 18 }}>{s.value}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "#0f0f0f", borderRadius: 14, padding: "18px 20px", marginBottom: 24 }}>
            <p style={{ color: "#ef4444", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🎯 지금 체험하신 수법</p>
            {[
              { step: "1단계", title: "처음엔 이기게 설계", desc: "초반 높은 승률로 '나는 운이 좋다'는 착각 유도. 이 것이 불법도박 사이트의 가장 교묘한 함정입니다." },
              { step: "2단계", title: "점진적 승률 하락", desc: "판 수가 늘수록 수학적으로 반드시 잃게 설계. 10판 이후 승률은 8% 미만입니다." },
              { step: "3단계", title: "손실 회복 심리 자극", desc: "잃을수록 '한 판만 더'라는 생각이 강해지게 만듦. 이것이 중독의 핵심 메커니즘입니다." },
              { step: "4단계", title: "출금 불가 & 잠적", desc: "실제 사이트는 일정 이상 따면 '점검 중' 처리 후 잠적. 환전은 처음부터 불가능하도록 설계됩니다." },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 12 : 0 }}>
                <div style={{ background: "#ef444422", border: "1px solid #ef444444", borderRadius: 6, padding: "2px 8px", height: "fit-content", flexShrink: 0 }}>
                  <span style={{ color: "#ef4444", fontSize: 10, fontWeight: 700 }}>{s.step}</span>
                </div>
                <div>
                  <p style={{ color: "#f4f4f5", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{s.title}</p>
                  <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#052e16", border: "1px solid #16a34a44", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
            <p style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>🆘 도움이 필요하다면</p>
            <p style={{ color: "#86efac", fontSize: 12, lineHeight: 1.8 }}>
              한국도박문제예방치유원 <strong>1336</strong> (24시간, 무료)<br />
              경찰청 불법도박 신고 <strong>112</strong><br />
              불법 도박 이용 자체가 <strong>형사 처벌</strong> 대상입니다
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onRetry} style={{ flex: 1, padding: "14px 0", borderRadius: 12, fontSize: 14, background: "#1a1a1a", color: "#888", border: "1px solid #2a2a2a", cursor: "pointer" }}>
              다시 체험
            </button>
            <button onClick={onHome} style={{ flex: 2, padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", border: "none", cursor: "pointer" }}>
              🏠 메인으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ── 바카라 게임 ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function BaccaratGame({ balance, onResult, round }: { balance: number; onResult: (delta: number) => void; round: number }) {
  const [bet, setBet] = useState<"player" | "banker" | "tie" | null>(null);
  const [betAmount, setBetAmount] = useState(10000);
  const [phase, setPhase] = useState<"bet" | "deal" | "result">("bet");
  const [playerCards, setPlayerCards] = useState<{ suit: string; rank: string; value: number }[]>([]);
  const [bankerCards, setBankerCards] = useState<{ suit: string; rank: string; value: number }[]>([]);
  const [winner, setWinner] = useState<"player" | "banker" | "tie" | null>(null);
  const [dealIdx, setDealIdx] = useState(0);

  const deal = useCallback(() => {
    if (!bet || betAmount > balance || betAmount <= 0) return;
    setPhase("deal");
    setDealIdx(0);
    setPlayerCards([]);
    setBankerCards([]);
    setWinner(null);

    const shouldWin = Math.random() < getWinRate(round);
    const pCards = [randCard(), randCard()];
    const bCards = [randCard(), randCard()];

    // 결과 조작: 베팅한 쪽이 이기거나 지게
    let pScore = baccaratScore(pCards);
    let bScore = baccaratScore(bCards);

    if (shouldWin) {
      if (bet === "player" && pScore <= bScore) {
        bCards[0] = { ...bCards[0], rank: "2" }; // 뱅커 점수 낮추기
      } else if (bet === "banker" && bScore <= pScore) {
        pCards[0] = { ...pCards[0], rank: "2" };
      }
    } else {
      if (bet === "player" && pScore >= bScore) {
        pCards[0] = { ...pCards[0], rank: "3" };
      } else if (bet === "banker" && bScore >= pScore) {
        bCards[0] = { ...bCards[0], rank: "3" };
      }
    }

    pScore = baccaratScore(pCards);
    bScore = baccaratScore(bCards);
    const w: "player" | "banker" | "tie" = pScore > bScore ? "player" : bScore > pScore ? "banker" : "tie";

    // 카드 한 장씩 공개 애니메이션
    const allCards: { target: "p" | "b"; card: typeof pCards[0] }[] = [
      { target: "p", card: pCards[0] },
      { target: "b", card: bCards[0] },
      { target: "p", card: pCards[1] },
      { target: "b", card: bCards[1] },
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= allCards.length) {
        clearInterval(interval);
        setWinner(w);
        setPhase("result");
        let delta = -betAmount;
        if (w === bet) {
          delta = bet === "tie" ? betAmount * 8 : Math.floor(betAmount * (bet === "banker" ? 0.95 : 1));
        }
        onResult(delta);
        return;
      }
      const { target, card } = allCards[idx];
      if (target === "p") setPlayerCards(prev => [...prev, card]);
      else setBankerCards(prev => [...prev, card]);
      idx++;
      setDealIdx(idx);
    }, 400);
  }, [bet, betAmount, balance, round, onResult]);

  const reset = () => {
    setPhase("bet");
    setBet(null);
    setPlayerCards([]);
    setBankerCards([]);
    setWinner(null);
    setDealIdx(0);
  };

  const CardEl = ({ card, hidden }: { card?: { suit: string; rank: string }; hidden?: boolean }) => (
    <div style={{
      width: 52, height: 76, borderRadius: 8,
      background: hidden ? "#1a1a2e" : "#fff",
      border: "2px solid #333",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      boxShadow: "0 2px 8px #00000060",
      transition: "all 0.3s",
    }}>
      {hidden ? (
        <span style={{ fontSize: 22, opacity: 0.3 }}>🂠</span>
      ) : card ? (
        <>
          <span style={{ fontSize: 13, fontWeight: 900, color: ["♥", "♦"].includes(card.suit) ? "#ef4444" : "#1a1a1a", lineHeight: 1 }}>{card.rank}</span>
          <span style={{ fontSize: 16, color: ["♥", "♦"].includes(card.suit) ? "#ef4444" : "#1a1a1a" }}>{card.suit}</span>
        </>
      ) : null}
    </div>
  );

  const BET_AMOUNTS = [5000, 10000, 30000, 50000, 100000];

  return (
    <div>
      {/* 배팅 선택 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {(["player", "banker", "tie"] as const).map(side => (
          <button key={side} onClick={() => phase === "bet" && setBet(side)} style={{
            padding: "14px 0", borderRadius: 10, border: "2px solid",
            borderColor: bet === side ? (side === "player" ? "#3b82f6" : side === "banker" ? "#ef4444" : "#f59e0b") : "#2a2a2a",
            background: bet === side ? (side === "player" ? "#1e3a5f" : side === "banker" ? "#3b0a0a" : "#3b2a00") : "#111",
            color: bet === side ? "#fff" : "#555",
            fontWeight: 700, fontSize: 13, cursor: phase === "bet" ? "pointer" : "default",
            transition: "all 0.2s",
          }}>
            {side === "player" ? "플레이어" : side === "banker" ? "뱅커" : "타이"}
            <div style={{ fontSize: 10, marginTop: 2, color: bet === side ? "#aaa" : "#333" }}>
              {side === "player" ? "1배" : side === "banker" ? "0.95배" : "8배"}
            </div>
          </button>
        ))}
      </div>

      {/* 배팅 금액 */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {BET_AMOUNTS.map(a => (
          <button key={a} onClick={() => phase === "bet" && setBetAmount(a)} style={{
            padding: "6px 12px", borderRadius: 20, border: "1px solid",
            borderColor: betAmount === a ? "#f59e0b" : "#2a2a2a",
            background: betAmount === a ? "#3b2a00" : "#111",
            color: betAmount === a ? "#f59e0b" : "#555",
            fontSize: 11, fontWeight: 700, cursor: "pointer",
          }}>
            ₩{a.toLocaleString()}
          </button>
        ))}
      </div>

      {/* 카드 테이블 */}
      <div style={{ background: "#0a1a0a", borderRadius: 16, padding: "20px 16px", marginBottom: 16, border: "1px solid #1a3a1a", position: "relative" }}>
        {/* 초록 펠트 패턴 */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 16, backgroundImage: "radial-gradient(#1a4a1a 1px, transparent 1px)", backgroundSize: "12px 12px", opacity: 0.3, pointerEvents: "none" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, position: "relative", zIndex: 1 }}>
          {[
            { label: "플레이어", cards: playerCards, score: baccaratScore(playerCards), isWinner: winner === "player", color: "#3b82f6" },
            { label: "뱅커", cards: bankerCards, score: baccaratScore(bankerCards), isWinner: winner === "banker", color: "#ef4444" },
          ].map((side, si) => (
            <div key={si} style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ color: side.color, fontWeight: 700, fontSize: 13 }}>{side.label}</span>
                {side.isWinner && <span style={{ background: side.color, color: "#fff", fontSize: 9, fontWeight: 900, padding: "1px 6px", borderRadius: 10 }}>WIN</span>}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 8 }}>
                {[0, 1].map(i => (
                  <CardEl key={i} card={side.cards[i]} hidden={phase === "bet"} />
                ))}
              </div>
              {phase !== "bet" && (
                <div style={{ background: "#00000044", borderRadius: 8, display: "inline-block", padding: "4px 16px" }}>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>{side.cards.length > 0 ? side.score : "-"}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {winner === "tie" && phase === "result" && (
          <div style={{ textAlign: "center", marginTop: 10, color: "#f59e0b", fontWeight: 900, fontSize: 14 }}>🤝 타이!</div>
        )}
      </div>

      {/* 버튼 */}
      {phase === "bet" && (
        <button onClick={deal} disabled={!bet || betAmount > balance} style={{
          width: "100%", padding: "15px 0", borderRadius: 12, fontSize: 15, fontWeight: 900,
          background: bet && betAmount <= balance ? "linear-gradient(135deg, #ef4444, #dc2626)" : "#1a1a1a",
          color: bet && betAmount <= balance ? "#fff" : "#444",
          border: "none", cursor: bet ? "pointer" : "default", transition: "all 0.2s",
        }}>
          {!bet ? "베팅할 곳을 선택하세요" : `₩${betAmount.toLocaleString()} 베팅`}
        </button>
      )}
      {phase === "deal" && (
        <div style={{ textAlign: "center", padding: "14px 0", color: "#f59e0b", fontWeight: 700 }}>카드 배분 중...</div>
      )}
      {phase === "result" && (
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{
            flex: 1, textAlign: "center", padding: "14px 0", borderRadius: 12,
            background: winner === bet ? "#052e16" : "#1a0808",
            border: `1px solid ${winner === bet ? "#16a34a" : "#dc2626"}`,
          }}>
            <span style={{ color: winner === bet ? "#22c55e" : "#ef4444", fontWeight: 900, fontSize: 15 }}>
              {winner === bet ? `+₩${(bet === "tie" ? betAmount * 8 : Math.floor(betAmount * (bet === "banker" ? 0.95 : 1))).toLocaleString()}` : `-₩${betAmount.toLocaleString()}`}
            </span>
          </div>
          <button onClick={reset} style={{
            flex: 1, padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 700,
            background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", border: "none", cursor: "pointer",
          }}>
            다시 배팅
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ── 달팽이 경주 ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function SnailGame({ balance, onResult, round }: { balance: number; onResult: (delta: number) => void; round: number }) {
  const [pick, setPick] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(10000);
  const [phase, setPhase] = useState<"bet" | "racing" | "result">("bet");
  const [positions, setPositions] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [winner, setWinner] = useState<number | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRace = useCallback(() => {
    if (pick === null || betAmount > balance) return;
    setPhase("racing");
    setPositions([0, 0, 0, 0, 0, 0]);
    setWinner(null);

    const shouldWin = Math.random() < getWinRate(round);
    const winnerIdx = shouldWin ? pick : (() => {
      let w = Math.floor(Math.random() * 6);
      while (w === pick) w = Math.floor(Math.random() * 6);
      return w;
    })();

    const pos = [0, 0, 0, 0, 0, 0];
    const FINISH = 100;

    animRef.current = setInterval(() => {
      for (let i = 0; i < 6; i++) {
        if (pos[i] < FINISH) {
          const boost = i === winnerIdx ? 3.5 : 2.8;
          pos[i] = Math.min(FINISH, pos[i] + boost + Math.random() * 1.5);
        }
      }
      setPositions([...pos]);

      if (pos[winnerIdx] >= FINISH) {
        clearInterval(animRef.current!);
        setWinner(winnerIdx);
        setPhase("result");
        const delta = winnerIdx === pick ? Math.floor(betAmount * 5) : -betAmount;
        onResult(delta);
      }
    }, 80);
  }, [pick, betAmount, balance, round, onResult]);

  useEffect(() => () => { if (animRef.current) clearInterval(animRef.current); }, []);

  const reset = () => { setPhase("bet"); setPick(null); setPositions([0, 0, 0, 0, 0, 0]); setWinner(null); };
  const BET_AMOUNTS = [5000, 10000, 30000, 50000];

  return (
    <div>
      {/* 달팽이 선택 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
        {SNAIL_NAMES.map((name, i) => (
          <button key={i} onClick={() => phase === "bet" && setPick(i)} style={{
            padding: "10px 0", borderRadius: 10, border: "2px solid",
            borderColor: pick === i ? SNAIL_COLORS[i] : "#2a2a2a",
            background: pick === i ? `${SNAIL_COLORS[i]}22` : "#111",
            color: pick === i ? SNAIL_COLORS[i] : "#555",
            fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>
            {name.split(" ")[0]} <span style={{ color: SNAIL_COLORS[i] }}>#{i + 1}</span>
          </button>
        ))}
      </div>

      {/* 배팅 금액 */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {BET_AMOUNTS.map(a => (
          <button key={a} onClick={() => phase === "bet" && setBetAmount(a)} style={{
            padding: "6px 12px", borderRadius: 20, border: "1px solid",
            borderColor: betAmount === a ? "#f59e0b" : "#2a2a2a",
            background: betAmount === a ? "#3b2a00" : "#111",
            color: betAmount === a ? "#f59e0b" : "#555",
            fontSize: 11, fontWeight: 700, cursor: "pointer",
          }}>
            ₩{a.toLocaleString()}
          </button>
        ))}
        <span style={{ color: "#555", fontSize: 11, padding: "6px 4px" }}>당첨 5배</span>
      </div>

      {/* 레이스 트랙 */}
      <div style={{ background: "#0f1f0f", borderRadius: 14, padding: "14px 12px", marginBottom: 14, border: "1px solid #1a3a1a" }}>
        {SNAIL_NAMES.map((name, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < 5 ? 8 : 0 }}>
            <span style={{ color: SNAIL_COLORS[i], fontSize: 11, fontWeight: 700, width: 28, textAlign: "right", flexShrink: 0 }}>#{i + 1}</span>
            <div style={{ flex: 1, height: 20, background: "#0a150a", borderRadius: 10, position: "relative", overflow: "hidden" }}>
              {/* 결승선 */}
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 2, background: "#ef4444" }} />
              {/* 달팽이 */}
              <div style={{
                position: "absolute", top: "50%", transform: "translateY(-50%)",
                left: `${Math.min(95, positions[i])}%`,
                fontSize: 14, transition: "left 0.08s linear",
                filter: winner === i ? "drop-shadow(0 0 6px #fff)" : "none",
              }}>
                🐌
              </div>
            </div>
            {winner === i && <span style={{ color: "#f59e0b", fontSize: 10, fontWeight: 900, flexShrink: 0 }}>1등!</span>}
            {phase === "result" && winner !== i && pick === i && <span style={{ color: "#ef4444", fontSize: 10, flexShrink: 0 }}>탈락</span>}
          </div>
        ))}
      </div>

      {/* 버튼 */}
      {phase === "bet" && (
        <button onClick={startRace} disabled={pick === null || betAmount > balance} style={{
          width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 15, fontWeight: 900,
          background: pick !== null && betAmount <= balance ? "linear-gradient(135deg, #22c55e, #16a34a)" : "#1a1a1a",
          color: pick !== null ? "#fff" : "#444", border: "none", cursor: pick !== null ? "pointer" : "default",
        }}>
          {pick === null ? "달팽이를 선택하세요" : `${SNAIL_NAMES[pick]} 에 ₩${betAmount.toLocaleString()} 베팅!`}
        </button>
      )}
      {phase === "racing" && (
        <div style={{ textAlign: "center", padding: "14px 0", color: "#22c55e", fontWeight: 700, animation: "pulse 0.5s infinite" }}>🏁 경주 중...</div>
      )}
      {phase === "result" && (
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{
            flex: 1, textAlign: "center", padding: "13px 0", borderRadius: 12,
            background: winner === pick ? "#052e16" : "#1a0808",
            border: `1px solid ${winner === pick ? "#16a34a" : "#dc2626"}`,
          }}>
            <span style={{ color: winner === pick ? "#22c55e" : "#ef4444", fontWeight: 900 }}>
              {winner === pick ? `+₩${(betAmount * 5).toLocaleString()}` : `-₩${betAmount.toLocaleString()}`}
            </span>
          </div>
          <button onClick={reset} style={{
            flex: 1, padding: "13px 0", borderRadius: 12, fontSize: 13, fontWeight: 700,
            background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", border: "none", cursor: "pointer",
          }}>
            다시 하기
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ── 사다리 게임 ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function LadderGame({ balance, onResult, round }: { balance: number; onResult: (delta: number) => void; round: number }) {
  const [pick, setPick] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(10000);
  const [phase, setPhase] = useState<"bet" | "climbing" | "result">("bet");
  const [pathStep, setPathStep] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [ladderMap, setLadderMap] = useState<boolean[][]>([]);
  const COLS = 4;
  const ROWS = 6;

  const generateLadder = useCallback((forcedWin: boolean, startCol: number): { grid: boolean[][]; outcome: number } => {
    const grid: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS - 1).fill(false));
    // 각 행에 랜덤 가로줄 생성 (겹치지 않게)
    for (let r = 0; r < ROWS; r++) {
      const cols = Array.from({ length: COLS - 1 }, (_, i) => i).sort(() => Math.random() - 0.5);
      let placed = 0;
      for (const c of cols) {
        if (placed >= 2) break;
        if (c === 0 || !grid[r][c - 1]) {
          grid[r][c] = true;
          placed++;
        }
      }
    }
    // 실제 경로 계산
    let pos = startCol;
    for (let r = 0; r < ROWS; r++) {
      if (pos > 0 && grid[r][pos - 1]) pos--;
      else if (pos < COLS - 1 && grid[r][pos]) pos++;
    }
    const outcomes = [0, 1, 2, 3];
    if (forcedWin && pos !== startCol) {
      // 강제 교환
      outcomes[pos] = startCol;
      outcomes[startCol] = pos;
    }
    return { grid, outcome: forcedWin ? startCol : pos };
  }, []);

  const start = useCallback(() => {
    if (pick === null || betAmount > balance) return;
    setPhase("climbing");
    setPathStep(0);
    const shouldWin = Math.random() < getWinRate(round);
    const { grid, outcome } = generateLadder(shouldWin, pick);
    setLadderMap(grid);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setPathStep(step);
      if (step >= ROWS + 1) {
        clearInterval(interval);
        setResult(outcome);
        setPhase("result");
        const delta = outcome === pick ? Math.floor(betAmount * 3.5) : -betAmount;
        onResult(delta);
      }
    }, 350);
  }, [pick, betAmount, balance, round, generateLadder, onResult]);

  const reset = () => { setPhase("bet"); setPick(null); setResult(null); setPathStep(0); setLadderMap([]); };
  const BET_AMOUNTS = [5000, 10000, 30000, 50000];
  const LABELS = ["①", "②", "③", "④"];

  return (
    <div>
      {/* 출발 선택 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
        {LABELS.map((label, i) => (
          <button key={i} onClick={() => phase === "bet" && setPick(i)} style={{
            padding: "12px 0", borderRadius: 10, border: "2px solid",
            borderColor: pick === i ? "#a855f7" : "#2a2a2a",
            background: pick === i ? "#2e1a4a" : "#111",
            color: pick === i ? "#d8b4fe" : "#555",
            fontWeight: 900, fontSize: 16, cursor: "pointer",
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* 배팅 금액 */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {BET_AMOUNTS.map(a => (
          <button key={a} onClick={() => phase === "bet" && setBetAmount(a)} style={{
            padding: "6px 12px", borderRadius: 20, border: "1px solid",
            borderColor: betAmount === a ? "#f59e0b" : "#2a2a2a",
            background: betAmount === a ? "#3b2a00" : "#111",
            color: betAmount === a ? "#f59e0b" : "#555",
            fontSize: 11, fontWeight: 700, cursor: "pointer",
          }}>₩{a.toLocaleString()}</button>
        ))}
        <span style={{ color: "#555", fontSize: 11, padding: "6px 4px" }}>당첨 3.5배</span>
      </div>

      {/* 사다리 */}
      <div style={{ background: "#0f0f1f", borderRadius: 14, padding: "16px 12px", marginBottom: 14, border: "1px solid #1a1a3a" }}>
        {/* 출발 라벨 */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, marginBottom: 8 }}>
          {LABELS.map((l, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                display: "inline-block", width: 28, height: 28, borderRadius: "50%",
                background: pick === i ? "#a855f7" : "#1a1a2e",
                border: `2px solid ${pick === i ? "#a855f7" : "#2a2a3a"}`,
                lineHeight: "26px", fontSize: 12, fontWeight: 900,
                color: pick === i ? "#fff" : "#555",
              }}>{l}</div>
            </div>
          ))}
        </div>
        {/* 사다리 격자 */}
        <div style={{ position: "relative", height: ROWS * 28 }}>
          {/* 세로선 */}
          {Array.from({ length: COLS }, (_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${(i / (COLS - 1)) * 100}%`,
              top: 0, bottom: 0, width: 2,
              background: "#2a2a4a",
              transform: "translateX(-50%)",
            }} />
          ))}
          {/* 가로선 */}
          {ladderMap.map((row, r) => row.map((has, c) => has ? (
            <div key={`${r}-${c}`} style={{
              position: "absolute",
              left: `${(c / (COLS - 1)) * 100}%`,
              top: r * 28 + 12,
              width: `${(1 / (COLS - 1)) * 100}%`,
              height: 2,
              background: "#3b3b6a",
            }} />
          ) : null))}
          {/* 진행 표시 */}
          {phase !== "bet" && pick !== null && (
            <div style={{
              position: "absolute",
              left: `${(pick / (COLS - 1)) * 100}%`,
              top: Math.min(pathStep * 28, ROWS * 28) - 8,
              width: 16, height: 16, borderRadius: "50%",
              background: "#a855f7",
              boxShadow: "0 0 10px #a855f7",
              transform: "translateX(-50%)",
              transition: "top 0.3s",
              zIndex: 10,
            }} />
          )}
        </div>
        {/* 결과 라벨 */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, marginTop: 8 }}>
          {LABELS.map((l, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                display: "inline-block", width: 28, height: 28, borderRadius: "50%",
                background: phase === "result" && result === i ? (result === pick ? "#052e16" : "#1a0808") : "#1a1a2e",
                border: `2px solid ${phase === "result" && result === i ? (result === pick ? "#16a34a" : "#dc2626") : "#2a2a3a"}`,
                lineHeight: "26px", fontSize: 12, fontWeight: 900,
                color: phase === "result" && result === i ? (result === pick ? "#22c55e" : "#ef4444") : "#555",
              }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 버튼 */}
      {phase === "bet" && (
        <button onClick={start} disabled={pick === null || betAmount > balance} style={{
          width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 15, fontWeight: 900,
          background: pick !== null && betAmount <= balance ? "linear-gradient(135deg, #a855f7, #7c3aed)" : "#1a1a1a",
          color: pick !== null ? "#fff" : "#444", border: "none", cursor: pick !== null ? "pointer" : "default",
        }}>
          {pick === null ? "출발 번호를 선택하세요" : `${LABELS[pick]}번에서 출발 — ₩${betAmount.toLocaleString()} 베팅`}
        </button>
      )}
      {phase === "climbing" && (
        <div style={{ textAlign: "center", padding: "14px 0", color: "#a855f7", fontWeight: 700 }}>🪜 올라가는 중...</div>
      )}
      {phase === "result" && (
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{
            flex: 1, textAlign: "center", padding: "13px 0", borderRadius: 12,
            background: result === pick ? "#052e16" : "#1a0808",
            border: `1px solid ${result === pick ? "#16a34a" : "#dc2626"}`,
          }}>
            <span style={{ color: result === pick ? "#22c55e" : "#ef4444", fontWeight: 900 }}>
              {result === pick ? `+₩${Math.floor(betAmount * 3.5).toLocaleString()}` : `-₩${betAmount.toLocaleString()}`}
            </span>
          </div>
          <button onClick={reset} style={{
            flex: 1, padding: "13px 0", borderRadius: 12, fontSize: 13, fontWeight: 700,
            background: "linear-gradient(135deg, #a855f7, #7c3aed)", color: "#fff", border: "none", cursor: "pointer",
          }}>
            다시 하기
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ── 메인 게임 페이지 ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function PlayContent() {
  const router = useRouter();
  const params = useSearchParams();
  const siteName = params.get("name") ?? "히어로 카지노";

  const INITIAL_BALANCE = 100000;
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [round, setRound] = useState(0);
  const [totalDelta, setTotalDelta] = useState(0);
  const [activeGame, setActiveGame] = useState<"baccarat" | "snail" | "ladder">("baccarat");
  const [history, setHistory] = useState<{ game: string; delta: number; bal: number }[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [warningDismissed, setWarningDismissed] = useState(false);

  const handleResult = useCallback((delta: number) => {
    setRound(r => r + 1);
    setBalance(b => {
      const nb = Math.max(0, b + delta);
      setHistory(h => [{ game: activeGame, delta, bal: nb }, ...h].slice(0, 20));
      return nb;
    });
    setTotalDelta(t => t + delta);
    if (!warningDismissed && totalDelta + delta < -30000) {
      setTimeout(() => setShowWarning(true), 600);
    }
  }, [activeGame, totalDelta, warningDismissed]);

  const handleRetry = () => {
    setBalance(INITIAL_BALANCE);
    setRound(0);
    setTotalDelta(0);
    setHistory([]);
    setShowReveal(false);
    setShowWarning(false);
    setWarningDismissed(false);
  };

  const TABS = [
    { id: "baccarat" as const, label: "바카라", icon: "🃏", color: "#ef4444" },
    { id: "snail" as const, label: "달팽이", icon: "🐌", color: "#22c55e" },
    { id: "ladder" as const, label: "사다리", icon: "🪜", color: "#a855f7" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", position: "relative" }}>
      <Watermark />

      {showWarning && !showReveal && (
        <AddictionWarning
          lost={Math.abs(Math.min(0, totalDelta))}
          onContinue={() => { setShowWarning(false); setWarningDismissed(true); }}
          onReveal={() => { setShowWarning(false); setShowReveal(true); }}
        />
      )}
      {showReveal && (
        <RevealScreen
          totalLost={totalDelta}
          round={round}
          onRetry={handleRetry}
          onHome={() => router.push("/")}
        />
      )}

      {/* ── 시뮬레이션 안내 배지 (항상 상단 고정) ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#052e16", borderBottom: "2px solid #16a34a",
        padding: "6px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700 }}>
          🎓 교육용 시뮬레이션 — 실제 불법도박 사이트가 아닙니다. 실제 돈이 오가지 않습니다.
        </span>
        <button onClick={() => setShowReveal(true)} style={{ background: "none", border: "none", color: "#86efac", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
          수법 보기
        </button>
      </div>

      <div style={{ paddingTop: 36 }}>
        {/* ── 사이트 헤더 ── */}
        <div style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
            {/* 로고 + 잔액 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  background: "linear-gradient(135deg, #ef4444, #991b1b)",
                  borderRadius: 8, padding: "6px 12px",
                }}>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: 16, letterSpacing: -0.5 }}>{siteName.split("카지노")[0] || "히어로"}</span>
                </div>
                <span style={{ color: "#ef4444", fontSize: 11, fontWeight: 700, border: "1px solid #ef444444", borderRadius: 20, padding: "2px 8px" }}>CASINO</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* 잔액 */}
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "#6b7280", fontSize: 10 }}>보유 머니 (가상)</p>
                  <p style={{ color: balance > INITIAL_BALANCE * 0.5 ? "#f59e0b" : "#ef4444", fontWeight: 900, fontSize: 18 }}>
                    ₩{balance.toLocaleString()}
                  </p>
                </div>
                {/* 손익 */}
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "#6b7280", fontSize: 10 }}>총 손익</p>
                  <p style={{ color: totalDelta >= 0 ? "#22c55e" : "#ef4444", fontWeight: 900, fontSize: 14 }}>
                    {totalDelta >= 0 ? "+" : ""}₩{totalDelta.toLocaleString()}
                  </p>
                </div>
                <button onClick={() => router.push("/gambling")} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "6px 12px", color: "#888", fontSize: 11, cursor: "pointer" }}>
                  나가기
                </button>
              </div>
            </div>
            {/* 네비 탭 */}
            <div style={{ display: "flex", gap: 0, borderTop: "1px solid #1a1a1a" }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveGame(tab.id)} style={{
                  padding: "10px 20px", background: "none", border: "none",
                  borderBottom: activeGame === tab.id ? `2px solid ${tab.color}` : "2px solid transparent",
                  color: activeGame === tab.id ? tab.color : "#555",
                  fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {tab.icon} {tab.label}
                  {activeGame === tab.id && <span style={{ background: `${tab.color}22`, border: `1px solid ${tab.color}55`, borderRadius: 20, padding: "0px 6px", fontSize: 9, color: tab.color }}>진행중</span>}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <span style={{ color: "#374151", fontSize: 10, padding: "10px 12px", alignSelf: "center" }}>가입코드: 7474 (가짜)</span>
            </div>
          </div>
        </div>

        {/* ── 메인 콘텐츠 ── */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>

          {/* 게임 영역 */}
          <div>
            {/* 중독 위험도 바 */}
            {round > 0 && (
              <div style={{ background: "#111", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "#6b7280", fontSize: 11, flexShrink: 0 }}>중독 위험도</span>
                <div style={{ flex: 1, height: 6, background: "#1a1a1a", borderRadius: 3 }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    width: `${Math.min(100, round * 8)}%`,
                    background: round < 5 ? "#22c55e" : round < 9 ? "#f59e0b" : "#ef4444",
                    transition: "width 0.5s, background 0.5s",
                  }} />
                </div>
                <span style={{ color: round < 5 ? "#22c55e" : round < 9 ? "#f59e0b" : "#ef4444", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                  {round < 5 ? "낮음" : round < 9 ? "주의" : "위험"}
                </span>
              </div>
            )}

            {/* 승률 힌트 */}
            {round >= 5 && (
              <div style={{ background: "#1a0808", border: "1px solid #dc262644", borderRadius: 10, padding: "8px 12px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>📉</span>
                <span style={{ color: "#fca5a5", fontSize: 11 }}>
                  {round}판째 — 현재 실제 승률은 약 <strong style={{ color: "#ef4444" }}>{Math.round(getWinRate(round) * 100)}%</strong>입니다. 처음 ({Math.round(getWinRate(1) * 100)}%)보다 훨씬 낮습니다.
                </span>
              </div>
            )}

            {/* 게임 */}
            <div style={{ background: "#111", borderRadius: 16, padding: "20px 18px", border: "1px solid #1a1a1a" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <span style={{ fontSize: 20 }}>{TABS.find(t => t.id === activeGame)?.icon}</span>
                <h2 style={{ color: "#e4e4e7", fontWeight: 900, fontSize: 17 }}>{TABS.find(t => t.id === activeGame)?.label}</h2>
                <span style={{ color: "#374151", fontSize: 11 }}>— 교육용 시뮬레이션</span>
              </div>

              {activeGame === "baccarat" && <BaccaratGame balance={balance} onResult={handleResult} round={round} />}
              {activeGame === "snail" && <SnailGame balance={balance} onResult={handleResult} round={round} />}
              {activeGame === "ladder" && <LadderGame balance={balance} onResult={handleResult} round={round} />}
            </div>

            {balance === 0 && (
              <div style={{ marginTop: 14, background: "#0a0000", border: "2px solid #ef4444", borderRadius: 14, padding: "20px", textAlign: "center" }}>
                <p style={{ color: "#ef4444", fontWeight: 900, fontSize: 16, marginBottom: 6 }}>💸 잔액이 0원이 됐습니다</p>
                <p style={{ color: "#888", fontSize: 13, marginBottom: 14 }}>실제 도박이었다면 지금 대출이나 가족에게 손을 벌릴 상황입니다.</p>
                <button onClick={() => setShowReveal(true)} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                  🛡️ 수법 확인하기
                </button>
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div>
            {/* 실시간 당첨 (가짜) */}
            <div style={{ background: "#111", borderRadius: 14, padding: "14px", marginBottom: 12, border: "1px solid #1a1a1a" }}>
              <p style={{ color: "#6b7280", fontSize: 11, marginBottom: 10, fontWeight: 700 }}>🏆 실시간 당첨 (조작된 수치)</p>
              {[
                { user: "김**", amount: "₩1,240,000", game: "바카라" },
                { user: "이**", amount: "₩387,000", game: "달팽이" },
                { user: "박**", amount: "₩890,000", game: "사다리" },
                { user: "최**", amount: "₩2,100,000", game: "바카라" },
                { user: "정**", amount: "₩156,000", game: "달팽이" },
              ].map((w, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 4 ? "1px solid #1a1a1a" : "none" }}>
                  <span style={{ color: "#888", fontSize: 11 }}>{w.user} <span style={{ color: "#374151" }}>{w.game}</span></span>
                  <span style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700 }}>{w.amount}</span>
                </div>
              ))}
              <p style={{ color: "#374151", fontSize: 9, marginTop: 8, textAlign: "center" }}>※ 실제 당첨이 아닌 조작된 숫자입니다</p>
            </div>

            {/* 내 게임 기록 */}
            <div style={{ background: "#111", borderRadius: 14, padding: "14px", border: "1px solid #1a1a1a" }}>
              <p style={{ color: "#6b7280", fontSize: 11, marginBottom: 10, fontWeight: 700 }}>📋 내 게임 기록</p>
              {history.length === 0 ? (
                <p style={{ color: "#374151", fontSize: 12, textAlign: "center", padding: "16px 0" }}>아직 게임 기록 없음</p>
              ) : history.map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < history.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                  <span style={{ color: "#555", fontSize: 10 }}>
                    {h.game === "baccarat" ? "🃏" : h.game === "snail" ? "🐌" : "🪜"} {i === 0 ? "방금" : `${i + 1}판 전`}
                  </span>
                  <span style={{ color: h.delta >= 0 ? "#22c55e" : "#ef4444", fontSize: 11, fontWeight: 700 }}>
                    {h.delta >= 0 ? "+" : ""}₩{h.delta.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* 수법 확인 버튼 */}
            <button onClick={() => setShowReveal(true)} style={{
              width: "100%", marginTop: 10, padding: "12px 0", borderRadius: 12,
              background: "transparent", border: "1px solid #16a34a44",
              color: "#22c55e", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>
              🛡️ 지금까지 체험한 수법 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>로딩 중...</div>}>
      <PlayContent />
    </Suspense>
  );
}
