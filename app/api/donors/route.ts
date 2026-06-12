import { NextRequest, NextResponse } from "next/server";

const ADMIN_KEY = "bueong2025";

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
    if (!kv) return NextResponse.json({ donors: [] });
    const donors = await kv.get<string[]>("donors:list");
    return NextResponse.json({ donors: donors ?? [] });
  } catch {
    return NextResponse.json({ donors: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, action, key } = await req.json();
    if (key !== ADMIN_KEY) {
      return NextResponse.json({ error: "인증 실패" }, { status: 401 });
    }

    const kv = await getKV();
    if (!kv) return NextResponse.json({ ok: true, donors: [] });

    const current = await kv.get<string[]>("donors:list") ?? [];

    let updated: string[];
    if (action === "add") {
      if (!name || current.includes(name)) {
        return NextResponse.json({ ok: false, error: "이미 있거나 이름 없음" });
      }
      updated = [...current, name];
    } else if (action === "remove") {
      updated = current.filter((n: string) => n !== name);
    } else if (action === "reset") {
      updated = [];
    } else {
      return NextResponse.json({ error: "잘못된 액션" }, { status: 400 });
    }

    await kv.set("donors:list", updated);
    return NextResponse.json({ ok: true, donors: updated });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
