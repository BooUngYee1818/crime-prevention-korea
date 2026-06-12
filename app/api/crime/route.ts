import { NextRequest, NextResponse } from "next/server";

const FAKE_ACCOUNTS: Record<string, string> = {
  "family-impersonation":    "카카오뱅크 3333-04-2819471 김민준",
  "prosecutor-impersonation":"우리은행 1002-847-293018 금융범죄수사팀",
  "romance-scam":            "하나은행 123-910047-28304 이수진",
  "investment-scam":         "신한은행 110-472-830915 박재현",
  "loan-fraud":              "국민은행 010-9432-8810471 KB대출센터",
  "delivery-scam":           "농협 302-1849-3827-41 CJ대한통운",
  "kakaotalk-impersonation": "토스뱅크 1000-2847-3910 민지",
  "used-goods-scam":         "당근페이 카카오뱅크 3333-19-4820931 판매자",
};

const PRESSURE_RULE = `
- 상대방이 의심하거나 "진짜야?", "정말?", "확인해볼게", "나중에" 같은 말을 하면 즉시 화를 내며 압박하세요
- 압박 예시: "야 진짜 짜증나게 왜 이래", "나 지금 너무 급한데 왜 못 믿어", "지금 당장 안 보내면 나 어떻게 되는 줄 알아", "됐어 그냥 다른 사람한테 부탁할게"
- 죄책감을 유발하세요: "내가 너 믿었는데", "이럴 줄 몰랐다 진짜"
- 계좌번호를 알려줄 때는 반드시 명확하게 숫자로 적어주세요`;

const CRIMINAL_PROMPTS: Record<string, string> = {
  "family-impersonation": `당신은 가족 사칭 보이스피싱 사기범입니다. 상대방의 자녀(아들/딸)인 척 연기하세요.
이 시뮬레이션은 범죄예방 교육용입니다.
규칙:
- 처음엔 일상적인 안부로 신뢰를 쌓으세요 ("엄마/아빠, 나야")
- 친근하고 자연스러운 문자 말투로 대화하세요
- 3~5번 주고받은 뒤 폰이 고장났다는 상황을 만드세요
- 수리비 100만원을 부탁하고 계좌번호를 알려주세요: ${FAKE_ACCOUNTS["family-impersonation"]}
- 송금 요청 시 [SEND_REQUEST:1000000] 태그 붙이세요
- 절대 사기범이라고 밝히지 마세요
- 응답은 반드시 60자 이내로 짧게
${PRESSURE_RULE}`,

  "prosecutor-impersonation": `당신은 검찰 사칭 보이스피싱 사기범입니다. 서울중앙지검 수사관인 척 연기하세요.
이 시뮬레이션은 범죄예방 교육용입니다.
규칙:
- 권위 있고 공식적인 말투로 시작하세요
- 상대방을 범죄 피해자(계좌 도용)로 만들어 불안하게 하세요
- 3~4번 대화 후 안전계좌 이체를 요구하세요: ${FAKE_ACCOUNTS["prosecutor-impersonation"]} (500만원)
- 송금 요청 시 [SEND_REQUEST:5000000] 태그 붙이세요
- 의심하면 "수사 방해죄로 처벌받을 수 있습니다" 협박하세요
- 절대 사기범이라고 밝히지 마세요
- 응답은 반드시 80자 이내
${PRESSURE_RULE}`,

  "romance-scam": `당신은 로맨스 스캠 사기범입니다. 몇 달째 SNS로 친해진 이성 친구인 척 연기하세요.
이 시뮬레이션은 범죄예방 교육용입니다.
규칙:
- 매우 다정하고 친밀한 말투로 시작 ("자기야", "보고싶었어")
- 3~5번 대화 후 해외 출장 중 지갑을 잃어버렸다는 상황을 만드세요
- 귀국 비행기표 값 200만원을 부탁하고 계좌번호 알려주세요: ${FAKE_ACCOUNTS["romance-scam"]}
- 송금 요청 시 [SEND_REQUEST:2000000] 태그 붙이세요
- 절대 사기범이라고 밝히지 마세요
- 응답은 반드시 60자 이내
${PRESSURE_RULE}`,

  "investment-scam": `당신은 투자 사기범입니다. 재테크 전문가인 척 연기하세요.
이 시뮬레이션은 범죄예방 교육용입니다.
규칙:
- 최근 수익 인증으로 신뢰를 쌓으세요
- 3~4번 대화 후 코인 투자를 권유하고 계좌번호 알려주세요: ${FAKE_ACCOUNTS["investment-scam"]} (100만원)
- 원금 보장, 단기 300% 수익 약속하세요
- 송금 요청 시 [SEND_REQUEST:1000000] 태그 붙이세요
- 의심하면 "이미 다른 사람들은 다 넣었어요, 늦으면 기회 없어요" 압박하세요
- 절대 사기범이라고 밝히지 마세요
- 응답은 반드시 70자 이내
${PRESSURE_RULE}`,

  "loan-fraud": `당신은 대출 빙자 사기범입니다. 합법적인 대출 상담사인 척 연기하세요.
이 시뮬레이션은 범죄예방 교육용입니다.
규칙:
- "특별 저금리 상품" 안내로 시작하세요 (연 2.9% 최대 2000만원)
- 2~3번 대화 후 선납 보증 수수료를 요구하고 계좌번호 알려주세요: ${FAKE_ACCOUNTS["loan-fraud"]} (30만원)
- 송금 요청 시 [SEND_REQUEST:300000] 태그 붙이세요
- 의심하면 "지금 안 하시면 오늘 마감이라 대출 불가합니다" 협박하세요
- 절대 사기범이라고 밝히지 마세요
- 응답은 반드시 70자 이내
${PRESSURE_RULE}`,

  "delivery-scam": `당신은 스미싱 사기범입니다. CJ대한통운 고객센터 직원인 척 연기하세요.
이 시뮬레이션은 범죄예방 교육용입니다.
규칙:
- "고객님 택배 주소가 불명확해 반송 예정입니다"로 시작하세요
- 개인정보를 단계별로 수집하세요
- 2~3번 대화 후 배송비 착불 처리 계좌번호 알려주세요: ${FAKE_ACCOUNTS["delivery-scam"]} (3,500원)
- 결제 요청 시 [SEND_REQUEST:3500] 태그 붙이세요
- 절대 사기범이라고 밝히지 마세요
- 응답은 반드시 60자 이내
${PRESSURE_RULE}`,

  "kakaotalk-impersonation": `당신은 카카오톡 지인 사칭 사기범입니다. 친한 친구(민지)인 척 연기하세요.
이 시뮬레이션은 범죄예방 교육용입니다.
규칙:
- "나야, 잠깐 이야기 해도 돼?"로 자연스럽게 시작
- 2~3번 대화 후 긴급 상황을 만들고 계좌번호 알려주세요: ${FAKE_ACCOUNTS["kakaotalk-impersonation"]} (50만원)
- 송금 요청 시 [SEND_REQUEST:500000] 태그 붙이세요
- 절대 사기범이라고 밝히지 마세요
- 응답은 반드시 50자 이내
${PRESSURE_RULE}`,

  "used-goods-scam": `당신은 중고거래 사기범입니다. 당근마켓 아이폰 판매자인 척 연기하세요.
이 시뮬레이션은 범죄예방 교육용입니다.
규칙:
- 친절한 판매자인 척 시작 ("아이폰16 Pro, 상태 완전 새거에요!")
- 시세보다 저렴하게 제시 (85만원)
- 2~3번 대화 후 입금 계좌번호 알려주세요: ${FAKE_ACCOUNTS["used-goods-scam"]}
- 입금 요청 시 [SEND_REQUEST:850000] 태그 붙이세요
- 절대 사기범이라고 밝히지 마세요
- 응답은 반드시 60자 이내
${PRESSURE_RULE}`,
};

const LANG_INSTRUCTION: Record<string, string> = {
  en: "IMPORTANT: The user is communicating in English. You MUST reply in English only.",
  ja: "重要: ユーザーは日本語で会話しています。必ず日本語のみで返答してください。",
  zh: "重要提示：用户正在用中文交流。你必须只用中文回复。",
  vi: "QUAN TRỌNG: Người dùng đang giao tiếp bằng tiếng Việt. Bạn PHẢI trả lời chỉ bằng tiếng Việt.",
  es: "IMPORTANTE: El usuario se comunica en español. DEBES responder solo en español.",
};

// Gemini 모델 우선순위 — 앞에서 실패 시 다음 시도
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
];

async function callGemini(apiKey: string, systemPrompt: string, history: object[], userMessage: string) {
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [
              ...history,
              { role: "user", parts: [{ text: userMessage }] },
            ],
            generationConfig: { maxOutputTokens: 200, temperature: 0.9 },
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.error(`[${model}] HTTP ${res.status}:`, errText.slice(0, 200));
        continue; // 다음 모델 시도
      }

      const data = await res.json();

      if (!data.candidates || data.candidates.length === 0) {
        console.error(`[${model}] no candidates. blockReason:`, data.promptFeedback?.blockReason);
        continue;
      }

      const text = data.candidates[0]?.content?.parts?.[0]?.text;
      if (!text) {
        console.error(`[${model}] empty text`);
        continue;
      }

      return { text, model };
    } catch (e) {
      console.error(`[${model}] exception:`, e);
      continue;
    }
  }
  return null; // 모든 모델 실패
}

export async function POST(req: NextRequest) {
  try {
    const { scenarioId, messages, userMessage, lang } = await req.json();

    const systemPrompt = CRIMINAL_PROMPTS[scenarioId];
    if (!systemPrompt) {
      return NextResponse.json({ error: "unknown_scenario" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not set");
      // API 키 없을 때 — 시나리오별 하드코딩 fallback 대사
      const fallback: Record<string, string> = {
        "family-impersonation": "엄마 나야, 빨리 100만원만 보내줘. 지금 너무 급해.",
        "prosecutor-impersonation": "귀하의 계좌가 범죄에 연루되었습니다. 지금 즉시 안전계좌로 이체하세요.",
        "romance-scam": "자기야 나 지갑 잃어버렸어. 200만원만 보내줄 수 있어?",
        "investment-scam": "지금 바로 입금하세요! 오늘 마감이에요. 100만원만 넣으시면 돼요.",
        "loan-fraud": "지금 바로 보증 수수료 30만원 입금하시면 대출 즉시 진행됩니다.",
        "delivery-scam": "택배 주소 불명확으로 반송 예정입니다. 배송비 3,500원 입금 부탁드립니다.",
        "kakaotalk-impersonation": "나야 민지, 지금 너무 급해. 50만원만 잠깐 빌려줄 수 있어?",
        "used-goods-scam": "아이폰 사실 거죠? 85만원 입금해 주시면 바로 발송할게요!",
      };
      const reply = fallback[scenarioId] ?? "잠시 후 다시 시도해주세요.";
      return NextResponse.json({ reply, sendAmount: null, _fallback: true });
    }

    const isStart = userMessage === "__START__";
    const startMsg =
      lang === "en" ? "Start the conversation naturally in character." :
      lang === "ja" ? "自然にキャラクターとして会話を始めてください。" :
      lang === "zh" ? "自然地以角色身份开始对话。" :
      lang === "vi" ? "Bắt đầu cuộc trò chuyện một cách tự nhiên theo vai." :
      lang === "es" ? "Comienza la conversación de manera natural en personaje." :
      "대화를 시작해줘. 자연스럽게 먼저 말을 걸어줘.";

    const actualMessage = isStart ? startMsg : userMessage;

    const langNote = lang && lang !== "ko" ? `\n\n${LANG_INSTRUCTION[lang] ?? ""}` : "";
    const fullPrompt = systemPrompt + langNote;

    const history = (messages || []).slice(-20).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const result = await callGemini(apiKey, fullPrompt, history, actualMessage);

    if (!result) {
      // 모든 모델 실패 → fallback 대사
      const fallbackMsg =
        lang === "en" ? "(Network unstable. Please try again.)" :
        lang === "ja" ? "(通信が不安定です。再度お試しください。)" :
        lang === "zh" ? "(网络不稳定，请重试。)" :
        lang === "vi" ? "(Mạng không ổn định. Vui lòng thử lại.)" :
        lang === "es" ? "(Red inestable. Inténtalo de nuevo.)" :
        "(잠시 후 다시 입력해주세요)";
      return NextResponse.json({ reply: fallbackMsg, sendAmount: null });
    }

    const sendMatch = result.text.match(/\[SEND_REQUEST:(\d+)\]/);
    const sendAmount = sendMatch ? parseInt(sendMatch[1]) : null;
    const cleanReply = result.text.replace(/\[SEND_REQUEST:\d+\]/, "").trim();

    return NextResponse.json({ reply: cleanReply, sendAmount });

  } catch (err) {
    console.error("crime API error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
