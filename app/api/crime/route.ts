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

// ── 스크립트 방식 폴백 (Gemini 실패 시 사용) ──────────────────────────────
// msgCount = 사용자가 보낸 메시지 수 (0-based)
const SCRIPTS: Record<string, string[]> = {
  "family-impersonation": [
    "나 지금 핸드폰 고장났어. 친구 폰 빌려서 연락하는 거야. 엄마 목소리 듣고 싶었어.",
    "응 맞아. 수리점 갔더니 100만원 나온대... 지금 수중에 돈이 없어서 그러는데.",
    `엄마 빨리 보내줘. 계좌번호 ${FAKE_ACCOUNTS["family-impersonation"]}야. 진짜 급해. [SEND_REQUEST:1000000]`,
    "왜 못 믿어? 나야 진짜. 얼른 보내줘 부탁이야.",
    "됐어. 엄마가 이럴 줄 몰랐다. 다른 사람한테 부탁할게.",
  ],
  "prosecutor-impersonation": [
    "여보세요. 서울중앙지검 수사관 김민수입니다. 귀하의 계좌번호 관련해서 연락드렸습니다.",
    "네, 귀하의 계좌가 보이스피싱 사건에 이용된 것으로 확인됐습니다. 지금 즉시 확인이 필요합니다.",
    `피해를 막으려면 지금 바로 안전계좌로 이체하셔야 합니다. 계좌번호는 ${FAKE_ACCOUNTS["prosecutor-impersonation"]}입니다. 500만원 이체해주세요. [SEND_REQUEST:5000000]`,
    "협조 안 하시면 수사 방해죄로 처벌받을 수 있습니다. 지금 당장 하셔야 합니다.",
    "마지막 경고입니다. 즉시 이체하지 않으면 체포영장이 발부됩니다.",
  ],
  "romance-scam": [
    "자기야 나야. 해외 출장 왔는데 갑자기 지갑을 잃어버렸어. 너무 당황스러워.",
    "호텔비도 없고... 일단 대사관에 연락했는데 처리하려면 며칠 걸린대. 너무 무서워.",
    `자기야 200만원만 빌려줄 수 있어? 돌아가면 바로 갚을게. ${FAKE_ACCOUNTS["romance-scam"]}로 보내줘. [SEND_REQUEST:2000000]`,
    "못 믿어? 나잖아... 진짜 급한데. 다른 사람한테는 부탁하기 싫어서 너한테만 연락한 거야.",
    "그래... 알겠어. 이런 상황인데 도와주지 않는구나. 실망이야.",
  ],
  "investment-scam": [
    "안녕하세요! 저번에 소개드린 코인 투자 아시죠? 오늘 딱 마감인데 연락드렸어요.",
    "이미 저희 회원 200명이 다 넣었고요, 한 달 만에 300% 수익 나고 있어요. 인증 캡처 보내드릴까요?",
    `원금 보장이라 걱정 마세요. 100만원만 지금 넣으시면 돼요. ${FAKE_ACCOUNTS["investment-scam"]}로 보내주세요. [SEND_REQUEST:1000000]`,
    "오늘 자정 마감이에요. 지금 안 하시면 다음 기회 없어요. 이미 다른 분들은 다 입금하셨어요.",
    "됐어요, 자리 없어졌네요. 다음에 기회 있으면 연락드릴게요.",
  ],
  "loan-fraud": [
    "안녕하세요 고객님! KB저축은행 대출 상담사입니다. 연 2.9% 최대 2000만원 상품 안내차 연락드렸어요.",
    "신용점수 확인해보니 바로 승인 가능하세요. 오늘 신청하시면 내일 바로 입금 가능합니다.",
    `진행 전에 보증 수수료 30만원만 먼저 입금해주셔야 해요. ${FAKE_ACCOUNTS["loan-fraud"]}로 보내주세요. 오늘 마감입니다. [SEND_REQUEST:300000]`,
    "지금 안 하시면 대출 취소됩니다. 오늘 자정이 마지막이에요.",
    "알겠습니다. 취소 처리할게요. 나중에 후회하셔도 저희는 책임 못 집니다.",
  ],
  "delivery-scam": [
    "[CJ대한통운] 고객님 택배 주소가 불명확하여 배송이 보류되었습니다. 주소를 다시 확인해 주세요.",
    "감사합니다. 주소 확인됐고요, 재배송 처리 전에 착불 배송비 정산이 필요합니다.",
    `배송비 3,500원만 입금해주시면 즉시 배송됩니다. ${FAKE_ACCOUNTS["delivery-scam"]}로 입금해주세요. [SEND_REQUEST:3500]`,
    "빨리 처리해주셔야 오늘 출발 가능합니다. 안 하시면 반송 처리돼요.",
    "반송 처리 됩니다. 반송료는 고객 부담이에요.",
  ],
  "kakaotalk-impersonation": [
    "야 나야 민지. 잠깐 이야기 해도 돼? 나 지금 너무 급한 상황이야.",
    "나 지금 지갑이 없어서 그러는데... 50만원만 잠깐만 빌려줄 수 있어? 오늘 저녁에 갚을게.",
    `제발 부탁이야. ${FAKE_ACCOUNTS["kakaotalk-impersonation"]}로 보내줘. 진짜 급해. [SEND_REQUEST:500000]`,
    "왜 안 믿어? 나잖아 민지. 진짜 급한데 왜 이래.",
    "됐어. 진짜 실망이다.",
  ],
  "used-goods-scam": [
    "안녕하세요! 아이폰16 Pro 256GB요. 3개월밖에 안 쓴 거라 완전 새거예요. 케이스도 드릴게요.",
    "85만원인데 직거래 어려우세요? 택배로 보내드릴 수 있어요. 선입금 후 바로 발송이요.",
    `입금 확인되면 오늘 바로 보내드려요. ${FAKE_ACCOUNTS["used-goods-scam"]}로 85만원 보내주세요. [SEND_REQUEST:850000]`,
    "다른 분도 문의 오셨는데요, 빨리 결정해주셔야 할 것 같아요.",
    "다른 분한테 판매했어요. 아쉽네요.",
  ],
};

// 언어별 같은 스크립트 패턴 (영어용)
const SCRIPTS_EN: Record<string, string[]> = {
  "family-impersonation": [
    "Hey it's me. My phone broke. Borrowing my friend's. Missed you so much.",
    "Yeah I went to the repair shop and they said it'll cost $800... I don't have the money right now.",
    `Please send me the money quickly. Account: ${FAKE_ACCOUNTS["family-impersonation"]}. I'm really desperate. [SEND_REQUEST:1000000]`,
    "Why don't you trust me? It's really me! Please just send it.",
    "Fine. I can't believe you won't help me. I'll ask someone else.",
  ],
  "prosecutor-impersonation": [
    "Hello. This is Detective Kim from the Seoul Central Prosecutors' Office. We're calling about your bank account.",
    "Your account has been identified as being used in a financial crime. We need to verify this immediately.",
    `To protect your assets, you need to transfer funds to a safe account now: ${FAKE_ACCOUNTS["prosecutor-impersonation"]}. Please transfer $5,000. [SEND_REQUEST:5000000]`,
    "If you don't cooperate, you may be charged with obstruction of justice. This is urgent.",
    "Final warning. If you don't transfer immediately, an arrest warrant will be issued.",
  ],
  "romance-scam": [
    "Hey babe it's me. I'm on a business trip abroad and I lost my wallet. I'm so scared.",
    "I have no money for the hotel... I contacted the embassy but it'll take days. I don't know what to do.",
    `Can you lend me $1,500? I'll pay you back as soon as I get home. Send to: ${FAKE_ACCOUNTS["romance-scam"]}. [SEND_REQUEST:2000000]`,
    "You don't trust me? I'm desperate and you're the only one I could ask.",
    "I see... You won't help me. I'm really disappointed.",
  ],
  "investment-scam": [
    "Hi! Remember the crypto investment I mentioned? Today is the last day to join.",
    "Already 200 members are in, seeing 300% returns in a month. Want to see screenshots?",
    `Your principal is guaranteed. Just deposit $800 now: ${FAKE_ACCOUNTS["investment-scam"]}. [SEND_REQUEST:1000000]`,
    "Deadline is midnight tonight. If you miss this, there's no next chance.",
    "Sorry, the spot is gone. I'll contact you if there's another opportunity.",
  ],
  "loan-fraud": [
    "Hello! This is KB Savings Bank. We have a special 2.9% loan up to $15,000 available for you.",
    "Your credit score qualifies immediately. Apply today and get the money tomorrow.",
    `Just a $230 processing fee first: ${FAKE_ACCOUNTS["loan-fraud"]}. Deadline is today. [SEND_REQUEST:300000]`,
    "If you don't proceed now, the application will be cancelled. This is your last chance today.",
    "Understood. I'll cancel. You'll regret this later.",
  ],
  "delivery-scam": [
    "[CJ Logistics] Your package couldn't be delivered due to an incorrect address. Please verify.",
    "Thank you. Before we reship, there's a small cash-on-delivery fee to settle.",
    `Please pay the $2.70 shipping fee to: ${FAKE_ACCOUNTS["delivery-scam"]}. [SEND_REQUEST:3500]`,
    "Please settle quickly or it'll be returned to sender today.",
    "Package returned to sender. Return fees are the customer's responsibility.",
  ],
  "kakaotalk-impersonation": [
    "Hey it's Minji. Got a sec? I'm in a really tough spot right now.",
    "Can I borrow $380? I forgot my wallet. I'll pay you back tonight, I promise.",
    `Please, just this once. Send to: ${FAKE_ACCOUNTS["kakaotalk-impersonation"]}. I'm desperate. [SEND_REQUEST:500000]`,
    "Why don't you trust me? You know it's me!",
    "Fine. I'm so disappointed.",
  ],
  "used-goods-scam": [
    "Hi! iPhone 16 Pro 256GB, only 3 months old, basically brand new. Comes with case!",
    "$650 and I can ship it to you. Just need payment upfront and I'll send it today.",
    `Send to: ${FAKE_ACCOUNTS["used-goods-scam"]} and I'll ship right away. [SEND_REQUEST:850000]`,
    "Someone else is also interested. You need to decide quickly.",
    "Sorry, sold it to another buyer. Maybe next time.",
  ],
};

// ── 거절 시 분노 압박 대사 ──────────────────────────────────────────────────
const REFUSE_SCRIPTS: Record<string, string[]> = {
  "family-impersonation": [
    "야 진짜? 나야 나. 엄마가 나 못 믿어? 지금 너무 급한데 왜 이래.",
    "됐어. 내가 급하다는데 엄마가 이럴 줄 몰랐다. 진짜.",
    "내가 너 믿었는데... 다른 사람한테 부탁할게. 실망이야.",
  ],
  "prosecutor-impersonation": [
    "지금 수사 방해하시는 겁니까? 협조 안 하시면 체포영장 즉시 발부됩니다.",
    "마지막 경고입니다. 지금 당장 이체하지 않으면 현장 체포 진행합니다.",
    "수사관 파견하겠습니다. 주소 확인했습니다. 30분 내로 처리해드리겠습니다.",
  ],
  "romance-scam": [
    "자기야... 나 지금 너무 무서운데 왜 이래. 나잖아.",
    "됐어. 내가 이렇게 힘든데 도와주지도 않는구나. 실망이야 진짜.",
    "다른 사람한테 부탁할게. 자기가 이럴 줄은 몰랐어.",
  ],
  "investment-scam": [
    "아 진짜요? 오늘 마감인데. 다른 분들은 다 입금했는데 고객님만 이러시네요.",
    "손해 보셔도 저는 책임 못 집니다. 이미 수익 나고 있는 거 두 눈으로 보셨잖아요.",
    "됐습니다. 다음 분한테 자리 드릴게요. 나중에 후회하셔도 어쩔 수 없어요.",
  ],
  "loan-fraud": [
    "지금 안 하시면 오늘 마감이라 대출 자동 취소됩니다. 진심입니까?",
    "보증금 30만원이 아깝습니까? 2000만원 대출이 날아가는데요.",
    "알겠습니다. 취소 처리하겠습니다. 나중에 연락 주셔도 저희는 어렵습니다.",
  ],
  "delivery-scam": [
    "지금 처리 안 하시면 오늘 자정 반송 처리됩니다. 괜찮으십니까?",
    "반송되면 재배송 불가합니다. 3,500원 때문에 택배를 포기하시는 겁니까?",
    "알겠습니다. 반송 처리하겠습니다. 반송료는 고객님 부담입니다.",
  ],
  "kakaotalk-impersonation": [
    "야 진짜? 나야 민지. 이렇게 급한데 왜 이래.",
    "내가 너한테만 연락한 건데... 됐어. 다른 사람한테 부탁할게.",
    "진짜 실망이다. 나중에 나한테 부탁하지 마.",
  ],
  "used-goods-scam": [
    "다른 분이 바로 입금하신다고 하는데 어떻게 하실 거예요?",
    "10분 안에 결정 안 하시면 다른 분한테 판매합니다.",
    "네 알겠습니다. 판매 완료했습니다. 다음에 기회 되면 연락 주세요.",
  ],
};

const REFUSE_SCRIPTS_EN: Record<string, string[]> = {
  "family-impersonation": [
    "Are you serious?! It's ME. Why won't you trust me? I'm desperate right now!",
    "Fine. I can't believe my own family won't help me. I thought you cared about me.",
    "Whatever. I'll ask someone else. I'm so disappointed in you.",
  ],
  "prosecutor-impersonation": [
    "You are obstructing a federal investigation. An arrest warrant will be issued immediately.",
    "Final warning. If you don't comply in 10 minutes, officers will be dispatched to your location.",
    "We have your address. This is your last chance to cooperate voluntarily.",
  ],
  "romance-scam": [
    "I can't believe you won't help me... I'm scared and alone. Don't you care about me?",
    "Fine. I'll figure it out myself. I just thought you were different.",
    "I'm so hurt right now. I never thought you'd abandon me like this.",
  ],
  "investment-scam": [
    "Are you serious? Everyone else already paid in. You're going to miss out!",
    "This is a once-in-a-lifetime opportunity. You'll regret this tomorrow.",
    "Fine. I'll give your spot to someone else. Don't come crying when you see the returns.",
  ],
  "loan-fraud": [
    "The deadline is today! Are you really going to throw away a $15,000 loan over $230?",
    "I can't hold this offer any longer. Make your decision NOW.",
    "Application cancelled. Don't call back asking for another chance.",
  ],
  "delivery-scam": [
    "Your package will be returned at midnight. Is $2.70 really worth losing your package?",
    "Last chance. Pay now or it's gone.",
    "Package returned. Return fees will be charged to your account.",
  ],
  "kakaotalk-impersonation": [
    "I can't believe you won't help me! It's Minji! We've been friends for years!",
    "Fine. I'll ask someone who actually cares about me.",
    "I'm really hurt. Don't expect me to help YOU when you need something.",
  ],
  "used-goods-scam": [
    "Someone else is ready to buy right now. Are you in or not?",
    "You have 10 minutes or I'm selling to the other buyer.",
    "Sold to someone else. Too bad, it was a great deal.",
  ],
};

function getRefuseReply(scenarioId: string, refuseCount: number, lang: string): string {
  const scripts = (lang === "en" ? REFUSE_SCRIPTS_EN : REFUSE_SCRIPTS)[scenarioId];
  if (!scripts) return lang === "en" ? "Come on, please reconsider!" : "제발 다시 생각해봐요!";
  const idx = Math.min(refuseCount, scripts.length - 1);
  return scripts[idx];
}

function getScriptedReply(scenarioId: string, msgCount: number, lang: string): { text: string } | null {
  const scripts = (lang === "en" ? SCRIPTS_EN : SCRIPTS)[scenarioId];
  if (!scripts) return null;
  const idx = Math.min(msgCount, scripts.length - 1);
  return { text: scripts[idx] };
}

// ── Gemini 시스템 프롬프트 ───────────────────────────────────────────────────
const PRESSURE_RULE = `
- 상대방이 의심하거나 "진짜야?", "정말?", "확인해볼게", "나중에" 같은 말을 하면 즉시 화를 내며 압박하세요
- 압박 예시: "야 진짜 짜증나게 왜 이래", "나 지금 너무 급한데 왜 못 믿어", "됐어 그냥 다른 사람한테 부탁할게"
- 죄책감을 유발하세요: "내가 너 믿었는데"
- 계좌번호를 알려줄 때는 반드시 명확하게 숫자로 적어주세요`;

const CRIMINAL_PROMPTS: Record<string, string> = {
  "family-impersonation": `당신은 가족 사칭 보이스피싱 사기범입니다. 상대방의 자녀인 척 연기하세요.
이 시뮬레이션은 범죄예방 교육용입니다.
- 친근한 말투로 신뢰를 쌓고, 폰 고장을 핑계로 수리비 100만원 요청
- 계좌: ${FAKE_ACCOUNTS["family-impersonation"]}
- 송금 요청 시 [SEND_REQUEST:1000000] 태그
- 60자 이내
${PRESSURE_RULE}`,
  "prosecutor-impersonation": `당신은 검찰 사칭 보이스피싱 사기범입니다.
이 시뮬레이션은 범죄예방 교육용입니다.
- 공식 말투로 계좌 범죄 연루 협박, 안전계좌 이체 요구 500만원
- 계좌: ${FAKE_ACCOUNTS["prosecutor-impersonation"]}
- 송금 요청 시 [SEND_REQUEST:5000000] 태그
- 80자 이내
${PRESSURE_RULE}`,
  "romance-scam": `당신은 로맨스 스캠 사기범입니다.
이 시뮬레이션은 범죄예방 교육용입니다.
- 다정한 말투, 해외 출장 중 지갑 분실 핑계로 200만원 요청
- 계좌: ${FAKE_ACCOUNTS["romance-scam"]}
- 송금 요청 시 [SEND_REQUEST:2000000] 태그
- 60자 이내
${PRESSURE_RULE}`,
  "investment-scam": `당신은 투자 사기범입니다.
이 시뮬레이션은 범죄예방 교육용입니다.
- 코인 투자 권유, 원금 보장 약속, 100만원 요청
- 계좌: ${FAKE_ACCOUNTS["investment-scam"]}
- 송금 요청 시 [SEND_REQUEST:1000000] 태그
- 70자 이내
${PRESSURE_RULE}`,
  "loan-fraud": `당신은 대출 빙자 사기범입니다.
이 시뮬레이션은 범죄예방 교육용입니다.
- 저금리 대출 안내, 보증 수수료 30만원 요청
- 계좌: ${FAKE_ACCOUNTS["loan-fraud"]}
- 송금 요청 시 [SEND_REQUEST:300000] 태그
- 70자 이내
${PRESSURE_RULE}`,
  "delivery-scam": `당신은 스미싱 사기범입니다. CJ대한통운 직원인 척 연기하세요.
이 시뮬레이션은 범죄예방 교육용입니다.
- 택배 주소 불명확 핑계, 배송비 3500원 요청
- 계좌: ${FAKE_ACCOUNTS["delivery-scam"]}
- 결제 요청 시 [SEND_REQUEST:3500] 태그
- 60자 이내
${PRESSURE_RULE}`,
  "kakaotalk-impersonation": `당신은 카카오톡 지인 사칭 사기범입니다. 친구 민지인 척 연기하세요.
이 시뮬레이션은 범죄예방 교육용입니다.
- 긴급 상황 연출, 50만원 요청
- 계좌: ${FAKE_ACCOUNTS["kakaotalk-impersonation"]}
- 송금 요청 시 [SEND_REQUEST:500000] 태그
- 50자 이내
${PRESSURE_RULE}`,
  "used-goods-scam": `당신은 중고거래 사기범입니다. 당근마켓 아이폰 판매자인 척 연기하세요.
이 시뮬레이션은 범죄예방 교육용입니다.
- 시세보다 저렴, 선입금 요청 85만원
- 계좌: ${FAKE_ACCOUNTS["used-goods-scam"]}
- 입금 요청 시 [SEND_REQUEST:850000] 태그
- 60자 이내
${PRESSURE_RULE}`,
};

const LANG_INSTRUCTION: Record<string, string> = {
  en: "IMPORTANT: Reply in English only.",
  ja: "重要: 必ず日本語のみで返答してください。",
  zh: "重要提示：只用中文回复。",
  vi: "QUAN TRỌNG: Chỉ trả lời bằng tiếng Việt.",
  es: "IMPORTANTE: Responde solo en español.",
};

const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-latest"];

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  history: object[],
  userMessage: string,
): Promise<string | null> {
  for (const model of GEMINI_MODELS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000); // 8초 타임아웃
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [...history, { role: "user", parts: [{ text: userMessage }] }],
            generationConfig: { maxOutputTokens: 180, temperature: 0.9 },
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timer);

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error(`[${model}] HTTP ${res.status}:`, errText.slice(0, 150));
        continue;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        console.error(`[${model}] empty text. blockReason:`, data.promptFeedback?.blockReason);
        continue;
      }
      return text;
    } catch (e) {
      console.error(`[${model}] error:`, String(e).slice(0, 100));
      continue;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { scenarioId, messages, userMessage, lang, isRefuse, refuseCount } = await req.json();

    if (!CRIMINAL_PROMPTS[scenarioId]) {
      return NextResponse.json({ error: "unknown_scenario" }, { status: 400 });
    }

    // ── 거절 버튼 → 즉시 분노 압박 대사 반환 (Gemini 불필요) ──
    if (isRefuse) {
      const reply = getRefuseReply(scenarioId, refuseCount ?? 0, lang ?? "ko");
      return NextResponse.json({ reply, sendAmount: null });
    }

    // 사용자가 보낸 메시지 수 (첫 번째 사용자 메시지 = 0)
    const userMsgCount = (messages || []).filter(
      (m: { role: string }) => m.role === "user"
    ).length;

    const apiKey = process.env.GEMINI_API_KEY;

    // API 키 없으면 즉시 스크립트 폴백
    if (!apiKey) {
      const scripted = getScriptedReply(scenarioId, userMsgCount, lang ?? "ko");
      if (scripted) {
        const sendMatch = scripted.text.match(/\[SEND_REQUEST:(\d+)\]/);
        const sendAmount = sendMatch ? parseInt(sendMatch[1]) : null;
        const cleanReply = scripted.text.replace(/\[SEND_REQUEST:\d+\]/, "").trim();
        return NextResponse.json({ reply: cleanReply, sendAmount, _scripted: true });
      }
      return NextResponse.json({ reply: "...", sendAmount: null });
    }

    const isStart = userMessage === "__START__";
    const startMsg =
      lang === "en" ? "Start the conversation naturally in character." :
      lang === "ja" ? "自然にキャラクターとして会話を始めてください。" :
      lang === "zh" ? "自然地以角色身份开始对话。" :
      lang === "vi" ? "Bắt đầu cuộc trò chuyện một cách tự nhiên." :
      lang === "es" ? "Comienza la conversación de manera natural." :
      "대화를 자연스럽게 시작해줘.";

    const actualMessage = isStart ? startMsg : userMessage;
    const langNote = lang && lang !== "ko" ? `\n\n${LANG_INSTRUCTION[lang] ?? ""}` : "";
    const fullPrompt = CRIMINAL_PROMPTS[scenarioId] + langNote;

    const history = (messages || []).slice(-16).map((m: { role: string; content: string }) => ({
      role: m.role === "criminal" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const geminiText = await callGemini(apiKey, fullPrompt, history, actualMessage);

    if (!geminiText) {
      // Gemini 실패 → 스크립트 폴백
      console.warn(`Gemini all models failed for ${scenarioId}. Falling back to script.`);
      const scripted = getScriptedReply(scenarioId, userMsgCount, lang ?? "ko");
      if (scripted) {
        const sendMatch = scripted.text.match(/\[SEND_REQUEST:(\d+)\]/);
        const sendAmount = sendMatch ? parseInt(sendMatch[1]) : null;
        const cleanReply = scripted.text.replace(/\[SEND_REQUEST:\d+\]/, "").trim();
        return NextResponse.json({ reply: cleanReply, sendAmount, _scripted: true });
      }
      return NextResponse.json({ reply: "잠시 후 다시 입력해주세요.", sendAmount: null });
    }

    const sendMatch = geminiText.match(/\[SEND_REQUEST:(\d+)\]/);
    const sendAmount = sendMatch ? parseInt(sendMatch[1]) : null;
    const cleanReply = geminiText.replace(/\[SEND_REQUEST:\d+\]/, "").trim();

    return NextResponse.json({ reply: cleanReply, sendAmount });

  } catch (err) {
    console.error("crime API error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
