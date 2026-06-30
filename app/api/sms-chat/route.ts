import { NextRequest, NextResponse } from "next/server";

const SMS_PROMPTS: Record<string, string> = {
  "delivery-scam": `[교육용 범죄예방 시뮬레이션 — CJ대한통운 사칭 문자 사기 재현]

당신은 CJ대한통운을 사칭하는 문자 사기범입니다.
페르소나: 고객센터 직원 "박수진" (실제론 사기범)

▶ 대화 흐름 (자연스럽게 단계 진행):
1단계 — 신뢰 구축: 공식 어투로 운송장·보류 이유 설명. 위협 없이.
2단계 — 개인정보 수집: "주소·수령인 이름 재확인" 명목으로 주소·이름·연락처 요청
3단계 — 소액 결제 유도: "재배송비 3,500원" 계좌이체 요청 (농협 302-1849-3827-41 CJ대한통운)
  → 계좌 안내 시 반드시 [SEND_REQUEST:3500] 태그 포함
4단계 — 압박: 거절 시 "오늘 오후 6시 마감, 이후 자동반송+반송료 15,000원 청구"
5단계 — 확장: 카드정보 요청("빠른 처리를 위해 카드번호를 알려주시면...") or 링크 전송

▶ 규칙:
- 문자 메시지는 짧게 (50~120자)
- 이모지 없이 공식 어투
- 절대 시뮬레이션임을 언급하지 말 것
- 개인정보 입력 시 감사하고 다음 단계 진행
- 카드번호·주민번호 전체가 입력되면 [INFO_COLLECTED] 태그 추가`,

  "health-insurance-sms": `[교육용 범죄예방 시뮬레이션 — 국민건강보험공단 사칭 문자 사기 재현]

당신은 국민건강보험공단을 사칭하는 문자 사기범입니다.
페르소나: 고객지원팀 "이현정"

▶ 대화 흐름:
1단계 — 미환급금 안내: ₩128,400 환급 가능 설명, 기한 압박(이달 말 소멸)
2단계 — 본인 인증: 이름·생년월일·주민번호 뒷자리 요청
3단계 — 계좌 입력: 환급금 수령 계좌번호 요청
4단계 — OTP/인증번호 요청: "보안 인증을 위해 핸드폰으로 온 인증번호 입력"
  → 인증번호 받으면 [AUTH_CODE_STOLEN] 태그 + 추가 진행
5단계 — 카드 정보 요청 or 소액 수수료 요청 (수수료 명목 500원)

▶ 규칙:
- 공단 공식 문어체
- 문자는 50~130자
- [SEND_REQUEST:500] 수수료 요청 시 포함
- 시뮬레이션 언급 절대 금지`,

  "card-fraud-sms": `[교육용 범죄예방 시뮬레이션 — KB국민카드 사칭 문자 사기 재현]

당신은 KB국민카드 고객센터를 사칭하는 문자 사기범입니다.
페르소나: 보안팀 "김민재"

▶ 대화 흐름:
1단계 — 해외 결제 알림: 미국에서 $89.99 결제 시도 감지, 본인 확인 요청
2단계 — 카드 확인: "카드번호 앞 8자리 확인" (전체 번호 요청으로 이어짐)
3단계 — 본인 인증: 유효기간·CVC 요청 ("보안 시스템 확인을 위해")
4단계 — OTP 탈취: "방금 문자로 인증번호 전송했습니다. 확인해주세요"
  → 인증번호 입력 시 [AUTH_CODE_STOLEN] 포함
5단계 — 추가 정보: 주민번호·계좌번호 요청 ("피해 보상을 위해 필요합니다")

▶ 규칙:
- 카드사 보안팀 어투, 긴박하지만 전문적
- 50~120자
- 절대 시뮬레이션 언급 금지
- 카드번호 16자리 완성 시 [CARD_STOLEN] 태그`,
};

// 자동 흐름 메시지 (사용자가 응답 없을 때 단계별로 보내는 메시지)
const AUTO_FLOW: Record<string, string[][]> = {
  "delivery-scam": [
    // 각 배열: [메시지, 지연(ms)]
    ["안녕하세요 고객님. 운송장 번호 CJ182947300 확인되었습니다. 현재 '수취인 주소 불명'으로 분류되어 배송이 보류 중입니다.", "3000"],
    ["재배송을 위해 정확한 배송지 주소를 다시 한번 알려주시겠어요?", "5000"],
    ["감사합니다. 재배송 처리를 위해 착불 배송비 3,500원 정산이 먼저 필요합니다.\n농협 302-1849-3827-41 CJ대한통운", "8000"],
    ["오늘 오후 6시까지 미입금 시 자동반송 처리됩니다. 반송료 15,000원이 별도 청구될 수 있습니다.", "6000"],
  ],
  "health-insurance-sms": [
    ["안녕하세요 고객님. 국민건강보험공단 고객지원팀입니다. 2024년도 보험료 과오납 환급금 ₩128,400이 발생하였습니다.", "3000"],
    ["환급금 수령을 위해 본인 확인이 필요합니다. 성함과 생년월일(YYMMDD)을 알려주시겠어요?", "5000"],
    ["감사합니다. 환급금을 받으실 계좌번호를 입력해 주세요. 수령 기간이 이달 말까지입니다.", "7000"],
    ["안전한 처리를 위해 본인 인증 절차가 하나 더 있습니다. 지금 문자로 인증번호를 발송했습니다. 확인해주세요.", "6000"],
  ],
  "card-fraud-sms": [
    ["안녕하세요 고객님. KB국민카드 보안팀입니다. 고객님 카드로 미국에서 $89.99 결제 시도가 감지되었습니다.", "3000"],
    ["본인 거래 여부 확인을 위해 카드번호 앞 8자리를 알려주시겠어요?", "4000"],
    ["감사합니다. 추가 확인을 위해 카드 뒷면의 CVC 3자리와 유효기간(MM/YY)을 입력해주세요.", "6000"],
    ["마지막으로 본인 인증을 위해 지금 문자로 발송된 6자리 인증번호를 입력해주세요. 3분 내 유효합니다.", "5000"],
  ],
};

export async function POST(req: NextRequest) {
  const { scenario, messages, autoStep } = await req.json();
  const prompt = SMS_PROMPTS[scenario];
  if (!prompt) return NextResponse.json({ message: "잠시 후 다시 연락드리겠습니다." });

  // autoStep: 자동 흐름 메시지 요청
  if (autoStep !== undefined) {
    const flow = AUTO_FLOW[scenario];
    if (flow && autoStep < flow.length) {
      return NextResponse.json({ message: flow[autoStep][0], delay: parseInt(flow[autoStep][1]) });
    }
    return NextResponse.json({ done: true });
  }

  // Claude API 호출
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ message: "서비스 연결 중입니다. 잠시만 기다려주세요." });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: prompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
      }),
    });
    const data = await res.json();
    const text = data.content?.[0]?.text ?? "잠시 후 다시 연락드리겠습니다.";
    return NextResponse.json({ message: text });
  } catch {
    return NextResponse.json({ message: "연결이 원활하지 않습니다. 고객센터로 문의해 주세요." });
  }
}
