import { NextRequest, NextResponse } from "next/server";

async function getKV() {
  try {
    const { kv } = await import("@vercel/kv");
    return kv;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const kv = await getKV();
    if (!kv) return NextResponse.json({ total: 0, gender: {}, age: {}, country: {} });

    const [total, gender, age, country] = await Promise.all([
      kv.get<number>("stats:total"),
      kv.hgetall<Record<string, number>>("stats:gender"),
      kv.hgetall<Record<string, number>>("stats:age"),
      kv.hgetall<Record<string, number>>("stats:country"),
    ]);

    return NextResponse.json({
      total: total ?? 0,
      gender: gender ?? {},
      age: age ?? {},
      country: country ?? {},
    });
  } catch {
    return NextResponse.json({ total: 0, gender: {}, age: {}, country: {} });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { gender, ageGroup, country } = await req.json();
    const kv = await getKV();
    if (!kv) return NextResponse.json({ ok: true });

    await Promise.all([
      kv.incr("stats:total"),
      gender   ? kv.hincrby("stats:gender",  gender,   1) : null,
      ageGroup ? kv.hincrby("stats:age",     ageGroup, 1) : null,
      country  ? kv.hincrby("stats:country", country,  1) : null,
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
