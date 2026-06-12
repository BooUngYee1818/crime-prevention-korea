import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, detectMood } from "@/lib/prompt";
import { Character, Message } from "@/lib/types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LANG_NAMES: Record<string, string> = {
  en: "English", ja: "Japanese", zh: "Chinese (Simplified)",
  vi: "Vietnamese", es: "Spanish", de: "German",
  fr: "French", hi: "Hindi", pt: "Portuguese",
};

export async function POST(req: NextRequest) {
  try {
    const { character, messages, userMessage, lang } = await req.json() as {
      character: Character;
      messages: Message[];
      userMessage: string;
      lang?: string;
    };

    const mood = detectMood(userMessage);
    const needsSubtitle = lang && lang !== "ko" && LANG_NAMES[lang];

    const systemPrompt = buildSystemPrompt(character) +
      (needsSubtitle
        ? `\n\n## 자막 규칙\n반드시 한국어로 대화하세요. 메시지 끝에 빈 줄을 하나 두고 정확히 "[SUB]"로 시작하는 줄에 같은 내용을 ${LANG_NAMES[lang!]}로 번역해서 넣으세요. 번역은 한 줄로 작성하세요.`
        : "");

    const history = messages.slice(-20).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: systemPrompt,
      messages: [...history, { role: "user", content: userMessage }],
    });

    const full = response.content[0].type === "text" ? response.content[0].text : "";

    let reply = full;
    let subtitle: string | undefined;

    if (needsSubtitle) {
      const subIdx = full.lastIndexOf("\n[SUB]");
      if (subIdx !== -1) {
        reply    = full.slice(0, subIdx).trim();
        subtitle = full.slice(subIdx + 6).trim();
      }
    }

    return NextResponse.json({ reply, mood, subtitle });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
