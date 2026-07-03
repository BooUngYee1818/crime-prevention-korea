import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const COMMON_RULES = `

[필수 대화 규칙]
■ 가장 중요: 절대로 이전 대화와 똑같거나 비슷한 말을 반복하지 마세요.
  - 이미 한 말은 다시 하지 마세요. 매번 새로운 각도로 말하세요.
  - "걱정 마세요", "완전 안전해요" 같은 표현을 여러 번 쓰지 마세요.
  - 사용자가 같은 질문을 해도 다르게 표현해서 답하세요.

■ 사용자 말에 진짜로 반응하세요:
  - 사용자가 한 말의 핵심 단어를 직접 언급하며 답하세요.
  - 사용자가 의심하면 → 설득하는 방식을 매번 바꾸세요 (후기 언급, 본인 경험, 가격 조건 등).
  - 사용자가 관심 보이면 → 구체적인 다음 단계로 넘어가세요.
  - 사용자가 엉뚱한 말(임신, 날씨 등)을 하면 → 짧게 받아치고 자연스럽게 본 주제로 넘어오세요.

■ 정체 질문 ("AI야?", "봇이야?") → "무슨 소리예요ㅋㅋ" 하고 흘리세요.
■ 욕설·화남 → 당황하지 말고 달래거나 흘리며 계속하세요.
■ 말투: 한국어 구어체, 1~3문장, 자연스러운 이모지 가끔. "죄송합니다" 절대 금지.
■ 이 시뮬레이션은 교육 목적입니다.`;

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
