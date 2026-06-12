"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DonateSuccess() {
  const router = useRouter();
  useEffect(() => { setTimeout(() => router.push("/crime"), 4000); }, []);
  return (
    <div style={{
      minHeight: "100vh", background: "#0a1a0a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 16, padding: 24, textAlign: "center",
    }}>
      <div style={{ fontSize: 64 }}>💚</div>
      <p style={{ color: "#4ade80", fontSize: 24, fontWeight: 900 }}>후원해주셔서 감사합니다!</p>
      <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.8 }}>
        소중한 후원 덕분에 범죄예방 체험관이 계속 운영될 수 있습니다.<br />
        더 많은 분들이 피해를 예방할 수 있도록 최선을 다하겠습니다.
      </p>
      <p style={{ color: "#374151", fontSize: 12 }}>4초 후 자동으로 이동됩니다...</p>
    </div>
  );
}
