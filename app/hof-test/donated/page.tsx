"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HofDonatedTest() {
  const router = useRouter();

  useEffect(() => {
    try { localStorage.setItem("hof_donated", "1"); } catch {}
    router.push("/");
  }, [router]);

  return (
    <div style={{
      minHeight: "100vh", background: "#0d1a0d",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <p style={{ color: "#4ade80", fontSize: 16, fontWeight: 700 }}>
        💛 후원 플래그 설정 중... 메인으로 이동합니다
      </p>
    </div>
  );
}
