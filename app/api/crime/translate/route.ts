import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { text, lang } = await req.json();
    if (!text || !lang) return NextResponse.json({ translation: null });

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `Translate the following Korean text to ${lang}. Return only the translated text, nothing else.` },
        { role: "user", content: text },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    const translation = res.choices[0]?.message?.content?.trim() ?? null;
    return NextResponse.json({ translation });
  } catch {
    return NextResponse.json({ translation: null });
  }
}
