import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase.from("visits").select("gender, age_group, country");
    if (error) throw error;

    const total = data.length;
    const gender: Record<string, number> = {};
    const age: Record<string, number> = {};
    const country: Record<string, number> = {};

    for (const row of data) {
      if (row.gender)    gender[row.gender]       = (gender[row.gender] ?? 0) + 1;
      if (row.age_group) age[row.age_group]        = (age[row.age_group] ?? 0) + 1;
      if (row.country)   country[row.country]      = (country[row.country] ?? 0) + 1;
    }

    return NextResponse.json({ total, gender, age, country });
  } catch {
    return NextResponse.json({ total: 0, gender: {}, age: {}, country: {} });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { gender, ageGroup, country } = await req.json();
    await supabase.from("visits").insert({ gender, age_group: ageGroup, country });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
