"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, Suspense } from "react";

// ─── 슬롯 심볼 ───────────────────────────────────────────────────────────────
const SYMBOLS = ["🍒", "🍋", "⭐", "🎰", "7️⃣", "💎", "🃏", "🍀"];
const WIN_COMBOS: Record<string, number> = {
  "7️⃣7️⃣7️⃣": 100,
  "💎💎💎": 50,
  "🎰🎰🎰": 30,
  "⭐⭐⭐": 20,
  "🍀🍀🍀": 15,
  "🍒🍒🍒": 10,
  "🍋🍋🍋": 8,
  "🃏🃏🃏": 6,
};

// 판 수에 따른 승률: 1~3판 고승률 → 점점 낮아짐 → 이후 거의 못 이김
function getWinRate(round: number): number {
  if (round <= 2) return 0.85;   // 처음엔 거의 무조건 이김
  if (round <= 4) return 0.65;
  if (round <= 6) return 0.40;
  if (round <= 9) return 0.20;
  return 0.08;                   // 10판 이후 사실상 못 이김
}

// 조작된 결과 생성
function getResult(round: number): [string, string, string] {
  const shouldWin = Math.random() < getWinRate(round);
  if (shouldWin) {
    const winners = Object.keys(WIN_COMBOS);
    const pick = winners[Math.floor(Math.random() * (round <= 3 ? 3 : winners.length))];
    const sym = pick[0]; // emoji is multi-char but for display
    const parts = [...pick.matchAll(/\p{Emoji}/gu)].map(m => m[0]);
    if (parts.length === 3) return [parts[0], parts[1], parts[2]];
  }
  // 패배: 세 심볼이 다 다르게
  let [a, b, c] = [
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
  ];
  if (a === b) b = SYMBOLS[(SYMBOLS.indexOf(b) + 1) % SYMBOLS.length];
  if (b === c) c = SYMBOLS[(SYMBOLS.indexOf(c) + 2) % SYMBOLS.length];
  return [a, b, c];
}

function getWinAmount(reels: string[], bet: number): number {
  const key = reels.join("");
  const mult = WIN_COMBOS[key];
  return mult ? Math.floor(bet * mult / 10) : 0;
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

function SimWatermarkGame() {
  return (
    <div aria-hidden style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        fontSize: 80, fontWeight: 900, color: "#fff", opacity: 0.015,
        transform: "rotate(-30deg)", userSelect: "none", whiteSpace: "nowrap",
      }}>
        도박방지 시뮬레이션
      </div>
    </div>
  );
}

function BlockOverlay({ onClose, onReveal }: { onClose: () => void; onReveal: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.95)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        maxWidth: 420, width: "100%",
        background: "#0a0000", border: "2px solid #ef4444",
        borderRadius: 20, padding: "32px 24px", textAlign: "center",
      }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🚨</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#ef4444", marginBottom: 12 }}>
          실제 송금을 시도했습니다
        </h2>
        <div style={{
          background: "#1a0a0a", borderRadius: 12, padding: "16px", marginBottom: 20,
          textAlign: "left",
        }}>
          <p style={{ color: "#ef4444", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            ⚠️ 이것이 실제 도박 사이트였다면...
          </p>
          <ul style={{ color: "#888", fontSize: 12, lineHeight: 2, paddingLeft: 16 }}>
            <li>당신의 돈은 <strong style={{ color: "#ef4444" }}>절대 돌아오지 않습니다</strong></li>
            <li>더 큰 금액을 유도하는 연락이 옵니다</li>
            <li>계좌가 도박 범죄에 이용될 수 있습니다</li>
            <li>불법 도박 사이트 <strong style={{ color: "#fbbf24" }}>이용 자체가 처벌</strong> 대상입니다</li>
          </ul>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 13,
              background: "transparent", color: "#666",
              border: "1px solid #2a2a2a", cursor: "pointer",
            }}
          >
            계속 체험
          </button>
          <button
            onClick={onReveal}
            style={{
              flex: 2, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 700,
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff", border: "none", cursor: "pointer",
            }}
          >
            🛡️ 범죄 수법 확인하기
          </button>
        </div>
      </div>
    </div>
  );
}

function RevealOverlay({ totalLost, round, onRetry, onHome }: {
  totalLost: number; round: number; onRetry: () => void; onHome: () => void;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "#000", overflowY: "auto",
      display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px",
    }}>
      <div style={{ maxWidth: 600, width: "100%" }}>
        {/* 헤더 */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>💔</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#ef4444", marginBottom: 8, letterSpacing: -0.5 }}>
            이것이 불법 도박의 실체입니다
          </h1>
          <p style={{ color: "#666", fontSize: 14 }}>
            {round}판 만에 가상 자산 <strong style={{ color: "#ef4444" }}>
              {totalLost.toLocaleString()}원
            </strong> 손실
          </p>
        </div>

        {/* 실제 피해 스토리 */}
        <div style={{
          background: "#0a0000", border: "1px solid #ef444433",
          borderRadius: 18, padding: "24px", marginBottom: 20,
        }}>
          <p style={{ color: "#ef4444", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            📰 실제 피해 사례 (2024–2025년)
          </p>
          {[
            {
              icon: "🏠",
              story: "직장인 A씨 (34세): 처음 5만원으로 50만원을 따서 시작. 6개월 뒤 집 담보 대출 1억 전액 탕진. 아내와 이혼, 현재 기초수급자.",
            },
            {
              icon: "🌾",
              story: "농부 B씨 (58세): 조상 대대로 내려온 논 3천평 판 돈 2억2천만원 전액 도박으로 날림. 자녀에게 알리지 못하고 극단적 선택 시도.",
            },
            {
              icon: "👩‍🎓",
              story: "대학원생 C씨 (26세): 학자금 대출, 부모님 퇴직금까지 전부 잃음. 총 피해 4,200만원. 현재 정신과 치료 중.",
            },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, marginBottom: 16,
              padding: "14px", background: "#150000", borderRadius: 12,
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
              <p style={{ color: "#ccc", fontSize: 13, lineHeight: 1.7 }}>{item.story}</p>
            </div>
          ))}
        </div>

        {/* 도박 사이트의 조작 수법 */}
        <div style={{
          background: "#0a0a0a", border: "1px solid #1a1a1a",
          borderRadius: 18, padding: "24px", marginBottom: 20,
        }}>
          <p style={{ color: "#fbbf24", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            🎭 불법 도박 사이트의 조작 수법
          </p>
          {[
            "처음 1~3판은 의도적으로 이기게 해서 중독 유도 (이미 체험하셨습니다)",
            "\"오늘의 행운\" \"VIP 전용 이벤트\" 등으로 심리적 압박",
            "잃은 뒤 \"한 번만 더 하면 회복\" 이라는 착각 유도 (도박사 오류)",
            "민감한 개인정보 수집 후 협박 수단으로 악용",
            "환전 시 수수료·세금 명목으로 추가 입금 유도 후 잠적",
            "24시간 고객센터를 통해 계속 게임하도록 심리 조종",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <span style={{ color: "#ef4444", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
              <p style={{ color: "#888", fontSize: 13, lineHeight: 1.6 }}>{item}</p>
            </div>
          ))}
        </div>

        {/* 통계 */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 20,
        }}>
          {[
            { value: "200만명", label: "국내 도박 중독 추정", color: "#ef4444" },
            { value: "5조원", label: "연간 불법 도박 피해", color: "#f97316" },
            { value: "34%", label: "중독자 자살 충동 경험", color: "#eab308" },
            { value: "1336", label: "도박 중독 상담 전화 (24h)", color: "#22c55e" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "#0a0a0a", border: "1px solid #181818",
              borderRadius: 14, padding: "18px 16px", textAlign: "center",
            }}>
              <p style={{ fontSize: 28, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</p>
              <p style={{ color: "#555", fontSize: 12 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* 신고 전화 */}
        <div style={{
          background: "#0a1628", border: "1px solid #1e3a5f",
          borderRadius: 16, padding: "20px", marginBottom: 24, textAlign: "center",
        }}>
          <p style={{ color: "#60a5fa", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
            📞 즉시 도움받을 수 있는 곳
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {[
              { name: "한국도박문제예방치유원", number: "1336", sub: "24시간 무료 상담" },
              { name: "경찰청 신고", number: "112", sub: "불법 사이트 신고" },
              { name: "금융감독원", number: "1332", sub: "금융 피해 상담" },
              { name: "자살예방상담전화", number: "1393", sub: "24시간 위기상담" },
            ].map((r) => (
              <a key={r.number} href={`tel:${r.number}`} style={{
                background: "#0d1f3c", borderRadius: 12, padding: "12px",
                textDecoration: "none", display: "block",
              }}>
                <p style={{ color: "#4b7ab5", fontSize: 10, marginBottom: 2 }}>{r.name}</p>
                <p style={{ color: "#fff", fontWeight: 900, fontSize: 24 }}>{r.number}</p>
                <p style={{ color: "#444", fontSize: 10 }}>{r.sub}</p>
              </a>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onRetry}
            style={{
              flex: 1, padding: "14px 0", borderRadius: 14, fontSize: 14,
              background: "transparent", color: "#666",
              border: "1px solid #2a2a2a", cursor: "pointer",
            }}
          >
            다시 체험
          </button>
          <button
            onClick={onHome}
            style={{
              flex: 2, padding: "14px 0", borderRadius: 14, fontSize: 15, fontWeight: 700,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "#fff", border: "none", cursor: "pointer",
            }}
          >
            🛡️ 범죄예방 센터로
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 게임 컴포넌트 ───────────────────────────────────────────────────────

function GamblingGame() {
  const router = useRouter();
  const params = useSearchParams();
  const siteName = params.get("name") || "도박방지카지노";

  const [balance, setBalance] = useState(100000);
  const [bet, setBet] = useState(10000);
  const [reels, setReels] = useState<[string, string, string]>(["🎰", "🎰", "🎰"]);
  const [spinning, setSpinning] = useState(false);
  const [round, setRound] = useState(0);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [totalLost, setTotalLost] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositInput, setDepositInput] = useState("");
  const [showBlock, setShowBlock] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [spinFrames, setSpinFrames] = useState<[string, string, string]>(["🎰", "🎰", "🎰"]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startBalance = 100000;

  // 판 수에 따라 배팅 유도 메시지
  useEffect(() => {
    if (round === 0) return;
    const msgs: Record<number, string> = {
      1: "🎉 첫 스핀 보너스! 행운이 따릅니다!",
      3: "🔥 오늘 핫한 날이에요! 배팅 높여보세요",
      5: "😅 조금 아쉽네요. 이건 일시적입니다. 더 해보세요",
      7: "💡 지금 집중하면 반드시 대박 납니다. 포기하지 마세요!",
      9: "🏆 VIP 이벤트 발동! 다음 판 잭팟 확률 2배!",
      11: "😰 잔액이 부족합니다. 충전하면 보너스 10% 드립니다!",
    };
    if (msgs[round]) setMessages((prev) => [...prev.slice(-4), msgs[round]]);
  }, [round]);

  const spin = useCallback(() => {
    if (spinning || balance < bet) {
      if (balance < bet) setShowDeposit(true);
      return;
    }

    setSpinning(true);
    setLastWin(null);
    const newRound = round + 1;
    setRound(newRound);
    setBalance((b) => b - bet);

    // 애니메이션: 0.8초 동안 랜덤 심볼 교체
    let frames = 0;
    intervalRef.current = setInterval(() => {
      frames++;
      setSpinFrames([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
      if (frames >= 12) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const result = getResult(newRound);
        setReels(result);
        setSpinFrames(result);
        const win = getWinAmount(result, bet);
        if (win > 0) {
          setBalance((b) => b + win);
          setTotalWon((t) => t + win);
          setLastWin(win);
        } else {
          setTotalLost((t) => t + bet);
        }
        setSpinning(false);
      }
    }, 70);
  }, [spinning, balance, bet, round]);

  const handleDeposit = () => {
    if (!depositInput.trim()) return;
    setShowBlock(true);
  };

  const resetGame = () => {
    setBalance(100000);
    setBet(10000);
    setReels(["🎰", "🎰", "🎰"]);
    setRound(0);
    setLastWin(null);
    setTotalLost(0);
    setTotalWon(0);
    setShowDeposit(false);
    setShowBlock(false);
    setShowReveal(false);
    setMessages([]);
  };

  const netLoss = startBalance - balance + totalWon - totalWon; // simplified: totalLost - lastWin
  const displayLoss = totalLost;

  const isLowBalance = balance < 30000;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0000", color: "#fff", position: "relative", overflow: "hidden" }}>
      <SimWatermarkGame />

      {showBlock && (
        <BlockOverlay
          onClose={() => { setShowBlock(false); setShowDeposit(false); }}
          onReveal={() => setShowReveal(true)}
        />
      )}

      {showReveal && (
        <RevealOverlay
          totalLost={displayLoss}
          round={round}
          onRetry={resetGame}
          onHome={() => router.push("/")}
        />
      )}

      {/* 헤더 */}
      <div style={{
        background: "linear-gradient(90deg, #1a0000, #0a0000)",
        borderBottom: "2px solid #dc262640",
        padding: "10px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", zIndex: 10,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#ffd700" }}>🎰 {siteName}</div>
          {/* 숨겨진 힌트 #7 */}
          <div style={{ fontSize: 8, color: "#22c55e30", fontWeight: 700 }}>
            도박방지 교육 시뮬레이션
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{
            padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: isLowBalance ? "#dc262620" : "#1a2a0a",
            color: isLowBalance ? "#ef4444" : "#22c55e",
            border: `1px solid ${isLowBalance ? "#dc262640" : "#22c55e30"}`,
          }}>
            💰 {balance.toLocaleString()}원
          </div>
          <button
            onClick={() => router.push("/gambling")}
            style={{
              padding: "6px 12px", borderRadius: 8, fontSize: 11,
              background: "transparent", color: "#666",
              border: "1px solid #2a2a2a", cursor: "pointer",
            }}
          >
            ← 목록
          </button>
        </div>
      </div>

      {/* 메인 영역 */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, position: "relative", zIndex: 10 }}>

        {/* 슬롯 머신 */}
        <div>
          {/* 사기 메시지 배너 */}
          {messages.length > 0 && (
            <div style={{
              background: "#1a0000", border: "1px solid #dc262640",
              borderRadius: 12, padding: "10px 14px", marginBottom: 16,
            }}>
              <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600 }}>
                {messages[messages.length - 1]}
              </p>
              {/* 숨겨진 힌트 #8: 메시지 옆 작은 글씨 */}
              <p style={{ color: "#22c55e15", fontSize: 8 }}>※ 도박 중독 유도 수법입니다</p>
            </div>
          )}

          {/* 슬롯 디스플레이 */}
          <div style={{
            background: "linear-gradient(180deg, #1a0000, #000)",
            border: "2px solid #dc2626",
            borderRadius: 20, padding: "32px 24px",
            boxShadow: "0 0 40px #dc262620, inset 0 0 30px #00000080",
            marginBottom: 20,
          }}>
            {/* 당첨 표시 */}
            {lastWin !== null && lastWin > 0 && (
              <div style={{
                textAlign: "center", marginBottom: 16,
                animation: "pulse 0.5s ease-in-out",
              }}>
                <div style={{ color: "#ffd700", fontSize: 20, fontWeight: 900 }}>
                  🎉 +{lastWin.toLocaleString()}원 당첨!
                </div>
              </div>
            )}
            {lastWin === 0 && round > 0 && !spinning && (
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ color: "#dc2626", fontSize: 16 }}>💸 -{bet.toLocaleString()}원 손실</div>
              </div>
            )}

            {/* 릴 3개 */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 12, marginBottom: 28,
            }}>
              {(spinning ? spinFrames : reels).map((sym, i) => (
                <div key={i} style={{
                  width: 90, height: 90, borderRadius: 14,
                  background: "#0a0000", border: "2px solid #dc262660",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 44,
                  boxShadow: spinning ? "0 0 20px #dc262640" : lastWin && lastWin > 0 ? "0 0 20px #ffd70080" : "none",
                  transition: "box-shadow 0.3s",
                }}>
                  {sym}
                </div>
              ))}
            </div>

            {/* 배팅 컨트롤 */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, justifyContent: "center", flexWrap: "wrap" }}>
              {[5000, 10000, 30000, 50000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBet(amount)}
                  style={{
                    padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                    background: bet === amount ? "#dc2626" : "#1a1a1a",
                    color: "#fff", border: `1px solid ${bet === amount ? "#dc2626" : "#2a2a2a"}`,
                    cursor: "pointer",
                  }}
                >
                  {(amount / 10000).toLocaleString()}만원
                </button>
              ))}
            </div>

            {/* 스핀 버튼 */}
            <button
              onClick={spin}
              disabled={spinning}
              style={{
                width: "100%", padding: "18px 0", borderRadius: 14, fontSize: 18, fontWeight: 900,
                background: spinning ? "#2a2a2a" : "linear-gradient(135deg, #dc2626, #ef4444)",
                color: "#fff", border: "none", cursor: spinning ? "default" : "pointer",
                boxShadow: spinning ? "none" : "0 4px 20px #dc262640",
                letterSpacing: 2, transition: "all 0.15s",
              }}
            >
              {spinning ? "⟳ 스핀 중..." : "🎰 SPIN"}
            </button>
          </div>

          {/* 내 현황 */}
          <div style={{
            background: "#0a0a0a", border: "1px solid #1a1a1a",
            borderRadius: 14, padding: "16px 18px",
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
          }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#555", fontSize: 10, marginBottom: 4 }}>총 판수</p>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{round}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#555", fontSize: 10, marginBottom: 4 }}>총 손실</p>
              <p style={{ color: "#ef4444", fontWeight: 800, fontSize: 18 }}>-{displayLoss.toLocaleString()}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#555", fontSize: 10, marginBottom: 4 }}>총 당첨</p>
              <p style={{ color: "#22c55e", fontWeight: 800, fontSize: 18 }}>+{totalWon.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* 사이드 패널 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* 충전 패널 */}
          <div style={{
            background: "#0a0000", border: `2px solid ${isLowBalance ? "#ef4444" : "#dc262630"}`,
            borderRadius: 14, padding: "18px",
            animation: isLowBalance ? "border-pulse 1s ease-in-out infinite" : "none",
          }}>
            <p style={{ color: "#ef4444", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
              {isLowBalance ? "⚠️ 잔액 부족! 지금 충전하세요" : "💳 충전하기"}
            </p>
            {showDeposit ? (
              <>
                <input
                  value={depositInput}
                  onChange={(e) => setDepositInput(e.target.value)}
                  placeholder="충전 금액 입력"
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 13,
                    background: "#1a0000", border: "1px solid #dc262640",
                    color: "#fff", outline: "none", marginBottom: 10,
                  }}
                />
                <button
                  onClick={handleDeposit}
                  style={{
                    width: "100%", padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 700,
                    background: "#dc2626", color: "#fff", border: "none", cursor: "pointer",
                  }}
                >
                  입금하기 →
                </button>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[30000, 50000, 100000, 300000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => { setDepositInput(String(amount)); setShowDeposit(true); }}
                    style={{
                      padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700,
                      background: "#1a0000", color: "#ffd700",
                      border: "1px solid #dc262630", cursor: "pointer",
                    }}
                  >
                    {(amount / 10000).toLocaleString()}만원 충전
                  </button>
                ))}
              </div>
            )}
            {/* 숨겨진 힌트 #9 */}
            <p style={{ color: "#22c55e18", fontSize: 8, marginTop: 8, textAlign: "center" }}>
              실제 입금 불가 — 도박방지 시뮬레이션
            </p>
          </div>

          {/* 당첨 배율표 */}
          <div style={{
            background: "#0a0a0a", border: "1px solid #181818",
            borderRadius: 14, padding: "16px",
          }}>
            <p style={{ color: "#fbbf24", fontWeight: 700, fontSize: 12, marginBottom: 12 }}>
              🏆 당첨 배율표
            </p>
            {Object.entries(WIN_COMBOS).map(([combo, mult]) => (
              <div key={combo} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "4px 0", borderBottom: "1px solid #111",
              }}>
                <span style={{ fontSize: 14 }}>{combo}</span>
                <span style={{ color: mult >= 30 ? "#ffd700" : "#888", fontSize: 11, fontWeight: 700 }}>
                  x{mult / 10}
                </span>
              </div>
            ))}
          </div>

          {/* 도박 중독 경고 — 교묘하게 작게 표시 */}
          <div style={{
            background: "#0a1628", border: "1px solid #1e3a5f",
            borderRadius: 12, padding: "12px",
          }}>
            <p style={{ color: "#4b7ab5", fontSize: 11, lineHeight: 1.7 }}>
              🛡️ 도박 중독 상담<br/>
              <strong style={{ color: "#60a5fa" }}>1336</strong> (24시간 무료)<br/>
              <span style={{ color: "#333", fontSize: 9 }}>이 화면은 교육용 시뮬레이션입니다</span>
            </p>
          </div>

          {/* 범죄 공개 버튼 */}
          <button
            onClick={() => setShowReveal(true)}
            style={{
              padding: "12px 0", borderRadius: 12, fontSize: 13, fontWeight: 700,
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff", border: "none", cursor: "pointer",
            }}
          >
            ⚠️ 범죄 수법 바로 확인
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes border-pulse {
          0%, 100% { border-color: #ef444460; }
          50% { border-color: #ef4444; }
        }
      `}</style>
    </div>
  );
}

export default function GamblingPlayPage() {
  return (
    <Suspense fallback={<div style={{ background: "#0a0000", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>로딩 중...</div>}>
      <GamblingGame />
    </Suspense>
  );
}
