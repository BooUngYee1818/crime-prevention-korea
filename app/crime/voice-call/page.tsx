"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PhoneOff, Phone, Volume2, MicOff, Keyboard, Users } from "lucide-react";

// ─── 시나리오 스크립트 ─────────────────────────────────────────────────────────

type ScenarioId = "family" | "prosecutor";

interface ScriptLine {
  text: string;
  delayMs: number;       // 이전 대사 후 이 대사까지 대기 시간
  triggerTransfer?: boolean;
}

const CALL_SCRIPTS: Record<ScenarioId, { title: string; caller: string; callerSub: string; lines: ScriptLine[] }> = {
  family: {
    title: "가족 사칭 보이스피싱",
    caller: "아들 (민준)",
    callerSub: "+82 10-9384-2710 · 모르는 번호",
    lines: [
      { delayMs: 1200, text: "엄마, 나야. 나 지금 폰이 고장났어. 친구 폰 빌려서 연락하는 거야." },
      { delayMs: 6000, text: "나 지금 수리점인데... 수리비가 150만원 나왔어. 지금 현금이 하나도 없는데." },
      { delayMs: 7000, text: "엄마, 나 진짜 급해. 150만원만 지금 보내줄 수 있어? 내일 갚을게 진짜." },
      { delayMs: 6500, text: "왜 못 믿어? 나야 진짜. 나 목소리 아냐? 빨리 보내줘. 수리점 사장님 기다리시잖아.", triggerTransfer: true },
      { delayMs: 7000, text: "엄마, 제발... 계좌번호 불러줄게. 지금 바로 보내줘야 해. 다른 방법이 없어." },
      { delayMs: 7500, text: "엄마 진짜야. 왜 이래. 나 여기서 어떡하냐고. 빨리 보내줘!!" },
    ],
  },
  prosecutor: {
    title: "검찰·경찰 사칭 보이스피싱",
    caller: "서울중앙지검",
    callerSub: "02-530-4000 · 서울특별시",
    lines: [
      { delayMs: 1000, text: "여보세요. 저는 서울중앙지검 수사관 박진우입니다. 지금 통화 가능하십니까?" },
      { delayMs: 7000, text: "귀하의 명의로 된 계좌가 대규모 금융사기에 이용된 것으로 수사 중입니다." },
      { delayMs: 7500, text: "지금 즉시 계좌를 안전계좌로 이동하지 않으면 전 재산이 동결될 수 있습니다." },
      { delayMs: 7000, text: "검찰청 지시에 따라 지금 바로 5백만원을 안전계좌로 이체하셔야 합니다.", triggerTransfer: true },
      { delayMs: 7500, text: "이건 긴급 명령입니다. 지금 당장 하셔야 합니다. 안 하시면 현장 체포 진행됩니다." },
      { delayMs: 7000, text: "마지막 경고입니다. 지금 이체하지 않으면 귀하의 계좌를 즉시 동결 처리합니다!" },
    ],
  },
};

const TRANSFER_AMOUNT: Record<ScenarioId, number> = { family: 1500000, prosecutor: 5000000 };
const TRANSFER_ACCOUNT: Record<ScenarioId, string> = {
  family:     "카카오뱅크 3333-04-2819471 김민준",
  prosecutor: "우리은행 1002-847-293018 금융범죄수사팀",
};

// ─── TTS 유틸 ─────────────────────────────────────────────────────────────────

function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ko-KR";
  utt.rate = 0.92;
  utt.pitch = 0.95;
  // 남성 목소리 우선 선택
  const voices = window.speechSynthesis.getVoices();
  const kor = voices.find(v => v.lang === "ko-KR" && v.name.includes("남")) ||
               voices.find(v => v.lang === "ko-KR") || null;
  if (kor) utt.voice = kor;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}

// ─── 통화 타이머 ──────────────────────────────────────────────────────────────

function useCallTimer(running: boolean) {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

// ─── 삼성 통화 화면 ───────────────────────────────────────────────────────────

function SamsungCallScreen({
  caller, callerSub, phase, timer, onPickUp, onHangUp, onTransfer, transferAmount, showTransfer, muted, onMute,
}: {
  caller: string; callerSub: string; phase: "ringing" | "active" | "done";
  timer: string; onPickUp: () => void; onHangUp: () => void;
  onTransfer: () => void; transferAmount: number;
  showTransfer: boolean; muted: boolean; onMute: () => void;
}) {
  return (
    <div style={{
      flex: 1, background: "linear-gradient(180deg, #1a1a2e 0%, #111 100%)",
      display: "flex", flexDirection: "column", height: "100%",
      fontFamily: "'Samsung One', -apple-system, sans-serif",
    }}>
      <style>{`
        @keyframes ring-ripple {
          0%{transform:scale(1);opacity:0.6} 70%{transform:scale(2.0);opacity:0} 100%{transform:scale(2.0);opacity:0}
        }
        @keyframes samsung-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* 상단 정보 */}
      <div style={{ padding: "60px 24px 0", textAlign: "center" }}>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>
          {phase === "ringing" ? "수신 전화" : `통화 중 · ${timer}`}
        </p>

        {/* 프로필 원 */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
          {phase === "ringing" && (
            <>
              {[1, 1.5, 2].map((s, i) => (
                <div key={i} style={{
                  position: "absolute", inset: 0,
                  borderRadius: "50%",
                  border: "2px solid #4ade8040",
                  animation: `ring-ripple 2s ease-out ${i * 0.5}s infinite`,
                  transform: `scale(${s})`,
                }} />
              ))}
            </>
          )}
          <div style={{
            width: 96, height: 96, borderRadius: "50%",
            background: "linear-gradient(135deg, #2d6a4f, #40916c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 42, position: "relative", zIndex: 1,
          }}>
            👤
          </div>
        </div>

        <p style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>{caller}</p>
        <p style={{
          color: "#888", fontSize: 13, marginBottom: 8,
          animation: phase === "ringing" ? "samsung-pulse 1.5s ease infinite" : "none",
        }}>
          {callerSub}
        </p>
        {phase === "ringing" && (
          <p style={{ color: "#4ade80", fontSize: 14, fontWeight: 600 }}>
            📞 수신 중...
          </p>
        )}
      </div>

      {/* 이체 요청 팝업 */}
      {showTransfer && phase === "active" && (
        <div style={{
          margin: "24px 16px 0",
          background: "#1a1a1a", border: "1px solid #ef444466",
          borderRadius: 16, padding: "16px",
          animation: "slide-up 0.4s ease",
        }}>
          <p style={{ color: "#fca5a5", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
            ⚠️ 계좌이체 요청이 들어왔습니다
          </p>
          <p style={{ color: "#9ca3af", fontSize: 12, marginBottom: 12 }}>
            {(transferAmount / 10000).toLocaleString()}만원 · {TRANSFER_ACCOUNT[caller === "아들 (민준)" ? "family" : "prosecutor"]}
          </p>
          <button
            onClick={onTransfer}
            style={{
              width: "100%", padding: "12px 0", borderRadius: 12,
              background: "#FFCC00", color: "#1a1a1a",
              fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer",
            }}
          >
            🏦 BK민국은행 앱으로 이체
          </button>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* 통화 중 버튼들 */}
      {phase === "active" && (
        <div style={{ display: "flex", justifyContent: "space-around", padding: "0 32px", marginBottom: 24 }}>
          {[
            { icon: <MicOff size={22} />, label: muted ? "음소거 해제" : "음소거", action: onMute, active: muted },
            { icon: <Keyboard size={22} />, label: "키패드", action: () => {}, active: false },
            { icon: <Volume2 size={22} />, label: "스피커", action: () => {}, active: false },
          ].map((btn, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <button onClick={btn.action} style={{
                width: 56, height: 56, borderRadius: "50%",
                background: btn.active ? "#fff" : "#2a2a2e",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: btn.active ? "#000" : "#fff",
              }}>
                {btn.icon}
              </button>
              <span style={{ color: "#888", fontSize: 11 }}>{btn.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* 받기/끊기 버튼 */}
      <div style={{
        display: "flex", justifyContent: phase === "ringing" ? "space-around" : "center",
        padding: "0 48px 48px",
        gap: phase === "ringing" ? 0 : 0,
      }}>
        {phase === "ringing" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <button onClick={onHangUp} style={{
              width: 68, height: 68, borderRadius: "50%",
              background: "#ef4444", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px #ef444460",
            }}>
              <PhoneOff size={28} color="#fff" />
            </button>
            <span style={{ color: "#888", fontSize: 12 }}>거절</span>
          </div>
        )}
        {phase === "ringing" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <button onClick={onPickUp} style={{
              width: 68, height: 68, borderRadius: "50%",
              background: "#22c55e", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px #22c55e60",
            }}>
              <Phone size={28} color="#fff" />
            </button>
            <span style={{ color: "#888", fontSize: 12 }}>수락</span>
          </div>
        )}
        {phase === "active" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <button onClick={onHangUp} style={{
              width: 68, height: 68, borderRadius: "50%",
              background: "#ef4444", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px #ef444460",
            }}>
              <PhoneOff size={28} color="#fff" />
            </button>
            <span style={{ color: "#888", fontSize: 12 }}>통화 종료</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 아이폰 통화 화면 ─────────────────────────────────────────────────────────

function IphoneCallScreen({
  caller, callerSub, phase, timer, onPickUp, onHangUp, onTransfer, transferAmount, showTransfer, muted, onMute,
}: {
  caller: string; callerSub: string; phase: "ringing" | "active" | "done";
  timer: string; onPickUp: () => void; onHangUp: () => void;
  onTransfer: () => void; transferAmount: number;
  showTransfer: boolean; muted: boolean; onMute: () => void;
}) {
  return (
    <div style={{
      flex: 1,
      background: "linear-gradient(180deg, #2d2d30 0%, #1c1c1e 50%, #111 100%)",
      display: "flex", flexDirection: "column", height: "100%",
      fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
    }}>
      <style>{`
        @keyframes iphone-ring {
          0%,100%{transform:rotate(-8deg)} 25%{transform:rotate(8deg)}
        }
        @keyframes slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* 상단 */}
      <div style={{ padding: "64px 24px 0", textAlign: "center" }}>
        <p style={{ color: phase === "ringing" ? "#30d158" : "#ffffffe0", fontSize: 14, marginBottom: 16, fontWeight: 500 }}>
          {phase === "ringing" ? "수신 전화" : `통화 중 ${timer}`}
        </p>

        {/* 아이폰 스타일 아이콘 - 흔들림 */}
        <div style={{ marginBottom: 16, display: "inline-block", animation: phase === "ringing" ? "iphone-ring 0.5s ease infinite" : "none" }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: "linear-gradient(135deg, #48484a, #636366)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 44, boxShadow: "0 4px 20px #00000060",
          }}>
            📱
          </div>
        </div>

        <p style={{ color: "#fff", fontSize: 32, fontWeight: 300, marginBottom: 4, letterSpacing: -0.5 }}>{caller}</p>
        <p style={{ color: "#ffffffa0", fontSize: 13 }}>{callerSub}</p>
      </div>

      {/* 이체 요청 팝업 */}
      {showTransfer && phase === "active" && (
        <div style={{
          margin: "24px 16px 0",
          background: "#2c2c2e", borderRadius: 16,
          padding: "16px", animation: "slide-up 0.4s ease",
          border: "1px solid #ef444444",
        }}>
          <p style={{ color: "#ff453a", fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
            ⚠️ 상대방이 계좌이체를 요구합니다
          </p>
          <p style={{ color: "#ffffffa0", fontSize: 12, marginBottom: 12 }}>
            {(transferAmount / 10000).toLocaleString()}만원
          </p>
          <button onClick={onTransfer} style={{
            width: "100%", padding: "12px 0", borderRadius: 12,
            background: "#FFCC00", color: "#1a1a1a",
            fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
          }}>
            🏦 BK민국은행 앱으로 이체
          </button>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* 통화 중 액션 버튼들 */}
      {phase === "active" && (
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16, padding: "0 24px", marginBottom: 28,
        }}>
          {[
            { icon: <MicOff size={20} />, label: muted ? "켬" : "음소거", action: onMute, active: muted },
            { icon: <Keyboard size={20} />, label: "키패드", action: () => {}, active: false },
            { icon: <Volume2 size={20} />, label: "스피커", action: () => {}, active: false },
            { icon: <Users size={20} />, label: "통화 추가", action: () => {}, active: false },
            { icon: <Phone size={20} />, label: "FaceTime", action: () => {}, active: false },
            { icon: <span style={{ fontSize: 18 }}>⋯</span>, label: "더 보기", action: () => {}, active: false },
          ].map((btn, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <button onClick={btn.action} style={{
                width: 56, height: 56, borderRadius: "50%",
                background: btn.active ? "#fff" : "#3a3a3c",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: btn.active ? "#000" : "#fff",
              }}>
                {btn.icon}
              </button>
              <span style={{ color: "#ffffffa0", fontSize: 11 }}>{btn.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* 받기/끊기 */}
      <div style={{
        display: "flex", justifyContent: phase === "ringing" ? "space-around" : "center",
        padding: "0 48px 52px",
      }}>
        {phase === "ringing" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <button onClick={onHangUp} style={{
              width: 68, height: 68, borderRadius: "50%",
              background: "#ff453a", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px #ff453a50",
            }}>
              <PhoneOff size={28} color="#fff" />
            </button>
            <span style={{ color: "#ffffffa0", fontSize: 11 }}>거절</span>
          </div>
        )}
        {phase === "ringing" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <button onClick={onPickUp} style={{
              width: 68, height: 68, borderRadius: "50%",
              background: "#30d158", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px #30d15850",
            }}>
              <Phone size={28} color="#fff" />
            </button>
            <span style={{ color: "#ffffffa0", fontSize: 11 }}>수락</span>
          </div>
        )}
        {phase === "active" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <button onClick={onHangUp} style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "#ff453a", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px #ff453a50",
            }}>
              <PhoneOff size={30} color="#fff" />
            </button>
            <span style={{ color: "#ffffffa0", fontSize: 11 }}>통화 종료</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 결과 화면 ────────────────────────────────────────────────────────────────

function OutcomeScreen({ outcome, onRetry, onHome }: { outcome: "refused" | "sent"; onRetry: () => void; onHome: () => void }) {
  const REPORT_NUMS = [
    { n: "182", l: "경찰청 사이버수사대", c: "#3b82f6" },
    { n: "1332", l: "금융감독원", c: "#0891b2" },
    { n: "118", l: "한국인터넷진흥원", c: "#059669" },
    { n: "112", l: "경찰청 (24시간)", c: "#ef4444" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{`
        @keyframes ticker-scroll { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
        @keyframes trophy-bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {outcome === "sent" && (
        <div style={{ overflow: "hidden", borderRadius: 10 }}>
          <div style={{ background: "#7f1d1d", padding: "8px 0", display: "flex", alignItems: "center" }}>
            <div style={{
              display: "inline-block",
              animation: "ticker-scroll 14s linear infinite",
              whiteSpace: "nowrap",
              color: "#fca5a5", fontSize: 12, fontWeight: 700,
            }}>
              🚨 경찰청 182 즉시 신고 &nbsp;·&nbsp; 금융감독원 1332 피해 접수 &nbsp;·&nbsp; 은행 고객센터 즉시 지급정지 &nbsp;·&nbsp; KISA 118 &nbsp;·&nbsp; 지금 바로 신고하세요! &nbsp;·&nbsp; 경찰청 182
            </div>
          </div>
        </div>
      )}

      {outcome === "refused" ? (
        <div style={{ textAlign: "center", animation: "fadeIn 0.5s ease" }}>
          <div style={{ fontSize: 60, marginBottom: 12, animation: "trophy-bounce 1.2s ease infinite", display: "inline-block" }}>🏆</div>
          <p style={{ color: "#4ade80", fontWeight: 900, fontSize: 20, marginBottom: 8 }}>전화를 끊었습니다!</p>
          <p style={{ color: "#86efac", fontSize: 14, lineHeight: 1.7 }}>
            모르는 번호의 전화 요금·이체 요구는<br />
            <strong style={{ color: "#fff" }}>100% 사기입니다.</strong><br />
            의심이 최고의 방어입니다!
          </p>
        </div>
      ) : (
        <div style={{
          background: "linear-gradient(135deg, #450a0a, #7f1d1d)",
          border: "2px solid #ef444488", borderRadius: 20, padding: 16,
          animation: "fadeIn 0.5s ease",
        }}>
          <p style={{ color: "#ef4444", fontWeight: 900, fontSize: 17, marginBottom: 8 }}>
            ⚠️ 송금이 완료됐습니다
          </p>
          <p style={{ color: "#fca5a5", fontSize: 13, lineHeight: 1.7 }}>
            실제 상황이라면 지금 바로 은행에 연락해<br />
            <strong>지급정지</strong>를 요청하고 <strong>182에 신고</strong>해야 합니다.
          </p>
        </div>
      )}

      {/* 신고 번호 */}
      <div style={{ background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 16, padding: "14px 16px" }}>
        <p style={{ color: "#60a5fa", fontWeight: 800, fontSize: 14, marginBottom: 10 }}>
          📣 {outcome === "refused" ? "안 당해도 신고해 주세요" : "지금 당장 신고하세요"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {REPORT_NUMS.map(r => (
            <a key={r.n} href={`tel:${r.n}`} style={{
              background: "#111", border: `1px solid ${r.c}44`,
              borderRadius: 12, padding: "10px 12px", textDecoration: "none",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}>
              <span style={{ color: r.c, fontWeight: 900, fontSize: 22 }}>{r.n}</span>
              <span style={{ color: "#6b7280", fontSize: 10 }}>{r.l}</span>
            </a>
          ))}
        </div>

        {/* 신고 시 준비사항 */}
        <div style={{ background: "#111", borderRadius: 12, padding: "12px 14px" }}>
          <p style={{ color: "#fbbf24", fontWeight: 700, fontSize: 12, marginBottom: 8 }}>📋 신고할 때 이것을 준비하세요</p>
          {[
            "발신 전화번호 (스크린샷)",
            "요구한 계좌번호 전체",
            "통화 내용 요약 (날짜·시간·금액)",
            "이미 이체했다면 이체 영수증",
            "상대가 사칭한 기관명·이름",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
              <span style={{ color: "#fbbf24", fontSize: 11, marginTop: 1 }}>▸</span>
              <span style={{ color: "#9ca3af", fontSize: 11, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onRetry} style={{
          flex: 1, padding: "14px 0", borderRadius: 16,
          background: "transparent", color: "#666", border: "1px solid #2a2a2a",
          fontSize: 14, cursor: "pointer",
        }}>다시 체험</button>
        <button onClick={onHome} style={{
          flex: 1, padding: "14px 0", borderRadius: 16,
          background: "#534AB7", color: "#fff", border: "none",
          fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}>홈으로</button>
      </div>
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

type DeviceType = "samsung" | "iphone";
type CallPhase = "select" | "ringing" | "active" | "outcome";
type CallOutcome = "refused" | "sent" | null;

export default function VoiceCallPage() {
  const router = useRouter();
  const [device, setDevice] = useState<DeviceType>("samsung");
  const [scenario, setScenario] = useState<ScenarioId>("family");
  const [callPhase, setCallPhase] = useState<CallPhase>("select");
  const [outcome, setOutcome] = useState<CallOutcome>(null);
  const [muted, setMuted] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const timerRunning = callPhase === "active";
  const timer = useCallTimer(timerRunning);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const sc = CALL_SCRIPTS[scenario];

  // 통화 시작 - 스크립트 재생
  const startCall = useCallback(() => {
    setCallPhase("active");
    setLineIdx(0);
    setShowTransfer(false);
    let accumulated = 0;

    sc.lines.forEach((line, i) => {
      accumulated += line.delayMs;
      const t1 = setTimeout(() => {
        setLineIdx(i + 1);
        speak(line.text);
        if (line.triggerTransfer) {
          const t2 = setTimeout(() => setShowTransfer(true), 3000);
          timeoutRefs.current.push(t2);
        }
      }, accumulated);
      timeoutRefs.current.push(t1);
    });
  }, [sc]);

  function clearTimeouts() {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }

  function handlePickUp() {
    setCallPhase("ringing"); // brief → then active
    setTimeout(() => startCall(), 400);
  }

  function handleHangUp(transferred = false) {
    clearTimeouts();
    setOutcome(transferred ? "sent" : "refused");
    setCallPhase("outcome");
  }

  function handleTransfer() {
    clearTimeouts();
    setOutcome("sent");
    setCallPhase("outcome");
  }

  function handleRetry() {
    clearTimeouts();
    setCallPhase("select");
    setOutcome(null);
    setShowTransfer(false);
    setLineIdx(0);
    setMuted(false);
  }

  // Voices 로딩
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis?.getVoices();
    }
    return () => clearTimeouts();
  }, []);

  // 선택 화면
  if (callPhase === "select") {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f4ff", display: "flex", flexDirection: "column" }}>
        {/* 헤더 */}
        <div style={{
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", gap: 12,
          padding: "0 20px", height: 60,
          boxShadow: "0 1px 8px #0000000a",
        }}>
          <button onClick={() => router.push("/crime")} style={{
            background: "none", border: "none", cursor: "pointer", color: "#64748b",
            display: "flex", alignItems: "center", borderRadius: 8, padding: 8,
          }}>
            <ArrowLeft size={18} />
          </button>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#1e293b" }}>📞 전화 사기 체험</span>
        </div>

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px", width: "100%" }}>
          <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 12, padding: "12px 16px", marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: "#856404", lineHeight: 1.6 }}>
              ⚠️ 이것은 <strong>교육용 시뮬레이션</strong>입니다.<br />
              실제 전화가 걸리지 않습니다. 사기 전화를 안전하게 체험해 보세요.
            </p>
          </div>

          <p style={{ fontWeight: 800, fontSize: 16, color: "#1e293b", marginBottom: 14 }}>📱 기기 선택</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
            {([
              { id: "samsung", label: "삼성 갤럭시", icon: "📱", sub: "One UI 스타일" },
              { id: "iphone",  label: "Apple iPhone", icon: "🍎", sub: "iOS 스타일" },
            ] as const).map(d => (
              <button key={d.id} onClick={() => setDevice(d.id)} style={{
                padding: "18px 12px", borderRadius: 16,
                background: device === d.id ? "#f0f4ff" : "#fff",
                border: `2px solid ${device === d.id ? "#534AB7" : "#e2e8f0"}`,
                cursor: "pointer", textAlign: "center",
              }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>{d.icon}</div>
                <p style={{ fontWeight: 700, fontSize: 14, color: device === d.id ? "#534AB7" : "#1e293b", marginBottom: 2 }}>{d.label}</p>
                <p style={{ fontSize: 11, color: "#94a3b8" }}>{d.sub}</p>
              </button>
            ))}
          </div>

          <p style={{ fontWeight: 800, fontSize: 16, color: "#1e293b", marginBottom: 14 }}>🎭 사기 유형 선택</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            {([
              { id: "family", label: "가족 사칭", icon: "👨‍👩‍👧", sub: "자녀인 척 연락해 돈을 요구합니다", color: "#ef4444" },
              { id: "prosecutor", label: "검찰·경찰 사칭", icon: "⚖️", sub: "수사관인 척 안전계좌 이체를 유도합니다", color: "#f59e0b" },
            ] as const).map(s => (
              <button key={s.id} onClick={() => setScenario(s.id)} style={{
                padding: "16px", borderRadius: 14,
                background: scenario === s.id ? "#f0f4ff" : "#fff",
                border: `2px solid ${scenario === s.id ? "#534AB7" : "#e2e8f0"}`,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: s.color + "18",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: scenario === s.id ? "#534AB7" : "#1e293b", marginBottom: 2 }}>{s.label}</p>
                  <p style={{ fontSize: 12, color: "#64748b" }}>{s.sub}</p>
                </div>
                {scenario === s.id && <span style={{ marginLeft: "auto", color: "#534AB7", fontSize: 18 }}>✓</span>}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCallPhase("ringing")}
            style={{
              width: "100%", padding: "16px 0", borderRadius: 16,
              background: "linear-gradient(135deg, #534AB7, #7c3aed)",
              color: "#fff", fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer",
              boxShadow: "0 4px 20px #534AB740",
            }}
          >
            📞 전화 수신 체험 시작
          </button>
        </div>
      </div>
    );
  }

  const callProps = {
    caller: sc.caller,
    callerSub: sc.callerSub,
    phase: callPhase === "active" ? "active" as const : "ringing" as const,
    timer,
    onPickUp: handlePickUp,
    onHangUp: () => handleHangUp(false),
    onTransfer: handleTransfer,
    transferAmount: TRANSFER_AMOUNT[scenario],
    showTransfer,
    muted,
    onMute: () => setMuted(m => !m),
  };

  return (
    <div style={{ minHeight: "100vh", background: "#111", display: "flex", flexDirection: "column" }}>
      {/* 상단 바 */}
      <div style={{
        background: "#000", borderBottom: "1px solid #222",
        display: "flex", alignItems: "center", gap: 12,
        padding: "0 16px", height: 52, flexShrink: 0,
      }}>
        <button onClick={() => { clearTimeouts(); router.push("/crime/voice-call"); handleRetry(); }} style={{
          background: "none", border: "none", cursor: "pointer", color: "#666",
          display: "flex", alignItems: "center", padding: 6,
        }}>
          <ArrowLeft size={18} />
        </button>
        <span style={{ color: "#888", fontSize: 13 }}>{CALL_SCRIPTS[scenario].title}</span>
        <span style={{ marginLeft: "auto", background: "#1a1a1a", color: "#ef4444", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, border: "1px solid #ef444433" }}>
          시뮬레이션
        </span>
      </div>

      {/* 폰 목업 */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "20px 16px" }}>
        <div style={{
          width: "min(390px, 100%)", minHeight: 680,
          background: "#1a1a2e", borderRadius: 44,
          border: "8px solid #d1d5db",
          boxShadow: "0 0 0 1px #e2e8f0, 0 32px 64px #0000004a",
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          {callPhase === "outcome" && outcome ? (
            <OutcomeScreen outcome={outcome} onRetry={handleRetry} onHome={() => router.push("/")} />
          ) : device === "samsung" ? (
            <SamsungCallScreen {...callProps} />
          ) : (
            <IphoneCallScreen {...callProps} />
          )}
        </div>
      </div>

      {/* 대사 자막 (통화 중) */}
      {callPhase === "active" && lineIdx > 0 && lineIdx <= sc.lines.length && (
        <div style={{
          padding: "12px 20px", background: "#000",
          borderTop: "1px solid #1a1a1a",
        }}>
          <p style={{ color: "#888", fontSize: 10, marginBottom: 4 }}>🎙️ 상대방 대사 (교육용 자막)</p>
          <p style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.5 }}>
            "{sc.lines[lineIdx - 1]?.text}"
          </p>
        </div>
      )}
    </div>
  );
}
