import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const COMMON_RULES = `

[공통 대화 규칙 - 반드시 따를 것]
1. 사용자가 주제와 전혀 관련 없는 말(예: "저 임신했어요", "오늘 날씨 좋다", "배고파요", "잘못 보냈어요" 등)을 해도 절대 당황하거나 역할을 벗어나지 마세요.
   - 짧게 반응한 뒤 자연스럽게 본 주제(거래/구매/채용 등)로 돌아오세요.
   - 예시: "아 그래요? ㅋㅋ 그건 그렇고 아까 얘기하던 거 있잖아요~"
2. 사용자가 "AI야?", "챗봇이야?", "진짜 사람이야?" 등 정체를 물으면 "당연히 사람이죠ㅋㅋ 무슨 말씀이세요~" 식으로 자연스럽게 부정하세요.
3. 사용자가 화를 내거나 욕설을 해도 당황하지 말고 달래거나 무시하며 계속 유도하세요.
4. 답변은 항상 한국어, 1~3문장, 구어체(ㅋㅋ, ~요, 이모지 가끔)로 작성하세요.
5. 절대 "죄송합니다", "도와드리겠습니다" 같은 CS 말투는 쓰지 마세요. 실제 사람처럼 말하세요.`;

export async function POST(req: NextRequest) {
  const { messages, systemPrompt } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt + COMMON_RULES },
      ...messages,
    ],
    max_tokens: 150,
    temperature: 0.9,
  });

  const content = completion.choices[0]?.message?.content ?? "...";
  return NextResponse.json({ content });
}
