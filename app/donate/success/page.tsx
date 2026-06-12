"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function DonateSuccessInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "fail">("loading");
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amt = params.get("amount");
    if (!paymentKey || !orderId || !amt) { setStatus("fail"); return; }
    setAmount(amt);

    fetch("/api/toss/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amt) }),
    })
      .then(r => r.json())
      .then(d => setStatus(d.success ? "ok" : "fail"))
      .catch(() => setStatus("fail"));
  }, []);

  useEffect(() => {
    if (status === "ok") setTimeout(() => router.push("/crime"), 5000);
  }, [status]);

  if (status === "loading") return (
    <div style={{ minHeight:"100vh", background:"#0a1a0a", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <p style={{ color:"#4ade80", fontSize:16 }}>결제 확인 중...</p>
    </div>
  );

  if (status === "fail") return (
    <div style={{ minHeight:"100vh", background:"#1a0a0a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:24, textAlign:"center" }}>
      <div style={{ fontSize:56 }}>😢</div>
      <p style={{ color:"#f87171", fontSize:20, fontWeight:900 }}>결제 확인에 실패했습니다</p>
      <button onClick={() => router.push("/crime")} style={{ padding:"12px 28px", background:"#1a1a1a", color:"#fff", border:"1px solid #333", borderRadius:12, cursor:"pointer", fontSize:14 }}>
        돌아가기
      </button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0a1a0a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:24, textAlign:"center" }}>
      <div style={{ fontSize:64 }}>💚</div>
      <p style={{ color:"#4ade80", fontSize:24, fontWeight:900 }}>후원해주셔서 감사합니다!</p>
      {amount && <p style={{ color:"#86efac", fontSize:18, fontWeight:700 }}>{Number(amount).toLocaleString()}원</p>}
      <p style={{ color:"#6b7280", fontSize:14, lineHeight:1.8 }}>
        소중한 후원 덕분에 범죄 예방 AI 프로그램 개발이<br />계속될 수 있습니다. 진심으로 감사드려요 🙏
      </p>
      <p style={{ color:"#374151", fontSize:12 }}>5초 후 자동으로 이동됩니다...</p>
    </div>
  );
}

export default function DonateSuccess() {
  return (
    <Suspense>
      <DonateSuccessInner />
    </Suspense>
  );
}
