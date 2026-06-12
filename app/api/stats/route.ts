import { NextRequest, NextResponse } from "next/server";

// Vercel KV가 없을 때를 대비한 fallback
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
    if (!kv) return NextResponse.json({ total: 0, gender: {}, age: {} });

    const [total, gender, age] = await Promise.all([
      kv.get<number>("stats:total") ?? 0,
      kv.hgetall<Record<string, number>>("stats:gender") ?? {},
      kv.hgetall<Record<string, number>>("stats:age") ?? {},
    ]);

    return NextResponse.json({ total: total ?? 0, gender: gender ?? {}, age: age ?? {} });
  } catch {
    return NextResponse.json({ total: 0, gender: {}, age: {} });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { gender, ageGroup } = await req.json();
    const kv = await getKV();
    if (!kv) return NextResponse.json({ ok: true });

    await Promise.all([
      kv.incr("stats:total"),
      gender ? kv.hincrby("stats:gender", gender, 1) : Promise.resolve(),
      ageGroup ? kv.hincrby("stats:age", ageGroup, 1) : Promise.resolve(),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
