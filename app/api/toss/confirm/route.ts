import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await req.json();
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "결제 키 미설정" }, { status: 503 });
    }

    const encoded = Buffer.from(`${secretKey}:`).toString("base64");
    const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || "결제 확인 실패" }, { status: 400 });
    }
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
