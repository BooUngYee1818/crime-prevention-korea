// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json({ error: "결제 기능이 준비 중입니다. 잠시 후 다시 시도해주세요." }, { status: 503 });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(key, {} as any);

    const { amount } = await req.json();
    if (!amount || amount < 1000) {
      return NextResponse.json({ error: "최소 후원 금액은 1,000원입니다." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "krw",
            product_data: {
              name: "범죄예방 체험관 후원",
              description: "광고 없는 무료 범죄예방 교육 서비스 유지를 위한 후원금입니다. 감사합니다 🙏",
              images: [],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.nextUrl.origin}/donate/success`,
      cancel_url: `${req.nextUrl.origin}/crime`,
      metadata: { type: "donation", amount: String(amount) },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "결제 세션 생성에 실패했습니다." }, { status: 500 });
  }
}
