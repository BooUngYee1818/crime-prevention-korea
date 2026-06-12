// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {} as any);

const PLANS = {
  monthly: {
    price: 990000,
    name: "AI Chat 월정액",
    description: "30일 무제한 AI 채팅",
  },
  yearly: {
    price: 7900000,
    name: "AI Chat 연간 구독",
    description: "365일 무제한 AI 채팅 (34% 할인)",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { plan, successUrl, cancelUrl } = await req.json();

    const planData = PLANS[plan as keyof typeof PLANS];
    if (!planData) {
      return NextResponse.json({ error: "잘못된 플랜" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "krw",
            product_data: {
              name: planData.name,
              description: planData.description,
            },
            unit_amount: planData.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${req.nextUrl.origin}/payment/success`,
      cancel_url: cancelUrl || `${req.nextUrl.origin}/payment/cancel`,
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "결제 세션 생성 실패" }, { status: 500 });
  }
}
