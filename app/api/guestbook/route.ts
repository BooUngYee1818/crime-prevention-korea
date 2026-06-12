import { NextRequest, NextResponse } from "next/server";

async function getKV() {
  try {
    const { kv } = await import("@vercel/kv");
    return kv;
  } catch {
    return null;
  }
}

export interface GuestEntry {
  id: string;
  message: string;
  gender: string;
  ageGroup: string;
  createdAt: number;
}

// 방명록 목록 조회
export async function GET() {
  try {
    const kv = await getKV();
    if (!kv) return NextResponse.json({ entries: [] });

    // 최신 50개
    const ids = await kv.lrange<string>("guestbook:ids", 0, 49);
    if (!ids || ids.length === 0) return NextResponse.json({ entries: [] });

    const entries = await Promise.all(
      ids.map((id: string) => kv.get<GuestEntry>(`guestbook:entry:${id}`))
    );

    return NextResponse.json({ entries: entries.filter(Boolean) });
  } catch {
    return NextResponse.json({ entries: [] });
  }
}

// 방명록 글 작성
export async function POST(req: NextRequest) {
  try {
    const { message, gender, ageGroup } = await req.json();

    if (!message || !gender || !ageGroup) {
      return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
    }
    if (message.length > 200) {
      return NextResponse.json({ error: "200자 이내로 작성해주세요" }, { status: 400 });
    }

    const kv = await getKV();
    if (!kv) return NextResponse.json({ ok: true });

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const entry: GuestEntry = {
      id,
      message: message.trim(),
      gender,
      ageGroup,
      createdAt: Date.now(),
    };

    await kv.set(`guestbook:entry:${id}`, entry);
    await kv.lpush("guestbook:ids", id);
    // 방명록은 영구 보존 — ltrim 없음

    return NextResponse.json({ ok: true, entry });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
