import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, detectMood } from "@/lib/prompt";
import { Character, Message } from "@/lib/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { character, messages, userMessage } = await req.json() as {
      character: Character;
      messages: Message[];
      userMessage: string;
    };

    const mood = detectMood(userMessage);
    const systemPrompt = buildSystemPrompt(character);

    const history = messages.slice(-20).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        ...history,
        { role: "user", content: userMessage },
      ],
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ reply, mood });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
