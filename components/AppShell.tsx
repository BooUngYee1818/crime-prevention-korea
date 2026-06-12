"use client";
import { useEffect, useState } from "react";
import ProfileModal from "./ProfileModal";
import StatsModal from "./StatsModal";
import type { UserProfile } from "./ProfileModal";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("user_profile");
    if (!saved) setShowProfile(true);
  }, []);

  function handleProfileComplete(_profile: UserProfile) {
    setShowProfile(false);
  }

  return (
    <>
      {children}

      {showProfile && (
        <ProfileModal onComplete={handleProfileComplete} />
      )}

      {showStats && (
        <StatsModal onClose={() => setShowStats(false)} />
      )}

      {/* 통계 버튼 — 메일 버튼 위에 배치 */}
      <div style={{ position: "fixed", bottom: 136, right: 24, zIndex: 9996 }}>
        <button
          onClick={() => setShowStats(true)}
          title="이용 통계"
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(15,23,42,0.95)",
            border: "1.5px solid #334155",
            cursor: "pointer", fontSize: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px #00000030",
            backdropFilter: "blur(12px)",
          }}
        >
          📊
        </button>
      </div>
    </>
  );
}
