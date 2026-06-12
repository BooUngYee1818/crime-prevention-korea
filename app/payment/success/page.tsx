"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { getUser, saveUser } from "@/lib/store";

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    user.isPremium = true;
    user.premiumExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    saveUser(user);
    setTimeout(() => router.push("/"), 3000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0d0d0d] gap-4">
      <CheckCircle size={64} className="text-green-400" />
      <h1 className="text-xl font-bold text-white">구독 완료!</h1>
      <p className="text-gray-400 text-sm">이제 무제한으로 대화할 수 있어요</p>
      <p className="text-gray-600 text-xs">잠시 후 홈으로 이동합니다...</p>
    </div>
  );
}
