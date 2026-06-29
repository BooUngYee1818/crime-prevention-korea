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
// 자연스러운 대화 흐름으로 재작성: 처음엔 상황 설명 → 공감 유도 → 돈 요청 → 압박
const SCRIPTS: Record<string, string[]> = {
  "family-impersonation": [
    "어 응, 길 가다 어떤 아저씨가 툭 치고 가는 바람에 그냥 떨어진 거야ㅠㅠ 액정이 완전 산산조각 났어.",
    "수리점 갔더니 90~100만원 나온다고 하더라. 근데 나 지금 지갑도 없고 현금이 하나도 없어.",
    `엄마 미안한데... 100만원만 잠깐 빌려줄 수 있어? 이 친구 폰도 오래 못 빌리는데. 계좌 ${FAKE_ACCOUNTS["family-impersonation"]} [SEND_REQUEST:1000000]`,
    "나야 진짜. 왜 못 믿어ㅠㅠ 빨리 보내줘 제발. 수리점 사장님 기다리신다고.",
    "됐어 알겠어. 다른 데 알아볼게. 근데 엄마가 이럴 줄은 몰랐다 진짜.",
  ],
  "prosecutor-impersonation": [
    "고객님 계좌번호 끝자리 확인이 필요합니다. 현재 금융사기 연루 계좌로 신고가 접수된 상태입니다.",
    "네 맞습니다. 고객님 명의 계좌가 사기 피해자 계좌로 이체 경유지로 사용됐습니다. 즉시 조치 필요합니다.",
    `자산 보호를 위해 안전계좌로 이체 후 수사 완료 시 돌려드립니다. ${FAKE_ACCOUNTS["prosecutor-impersonation"]} 500만원 이체 바랍니다. [SEND_REQUEST:5000000]`,
    "협조 안 하시면 수사 방해죄로 즉시 영장 청구됩니다. 지금 바로 하셔야 합니다!",
    "알겠습니다. 그럼 계좌 동결 조치 진행하겠습니다. 나중에 이의 제기하셔도 어렵습니다.",
  ],
  "romance-scam": [
    "나 어제 핸드폰이랑 지갑이 같이 없어졌어ㅠㅠ 소매치기 당한 것 같아. 너무 무서워.",
    "대사관 연락했는데 며칠 걸린대. 호텔비도 없고 밥도 못 먹었어 오늘. 자기한테 연락하는 것도 미안하지만.",
    `자기야 200만원만 빌려줄 수 있어? 돌아가면 바로 갚을게 진짜. ${FAKE_ACCOUNTS["romance-scam"]} [SEND_REQUEST:2000000]`,
    "나잖아 왜 못 믿어... 나 지금 너무 힘들거든. 자기밖에 없는데.",
    "됐어. 알겠어. 다른 사람한테 부탁할게. 자기가 이럴 줄 몰랐어.",
  ],
  "investment-scam": [
    "저도 처음엔 반신반의했는데 저번 달에 120만원 넣고 380만원 받았거든요ㅋㅋ 증거 캡처 보여드릴까요?",
    "저희 회원 200명 중에 손해 본 분이 한 명도 없어요. 원금 보장 계약서도 써드려요.",
    `오늘 자정 마감이라서요. 100만원만 넣으시면 돼요. ${FAKE_ACCOUNTS["investment-scam"]} [SEND_REQUEST:1000000]`,
    "이러면 손해 보시는 거 고객님인데... 저는 도우려고 연락드린 거예요. 다른 분한테 자리 드려야 할 것 같네요.",
    "알겠습니다. 다른 분 모셨어요. 나중에 연락 주셔도 저희는 어렵습니다.",
  ],
  "loan-fraud": [
    "고객님 신용점수 확인해보니 바로 실행 가능하세요! 오늘 신청하시면 내일 입금이에요.",
    "네 연 2.9% 맞고요, 중도상환 수수료도 없어요. 다른 은행보다 훨씬 유리한 조건이에요.",
    `진행 전에 보증 수수료 30만원 선납해주셔야 해요. ${FAKE_ACCOUNTS["loan-fraud"]} 오늘 자정 마감이에요. [SEND_REQUEST:300000]`,
    "30만원이 아까우세요? 2000만원 대출이 날아가는데요. 정말 취소하실 건가요?",
    "알겠습니다. 대출 취소 처리했습니다. 다음엔 자격 조건이 달라질 수 있어요.",
  ],
  "delivery-scam": [
    "네 고객님, 운송장 조회 결과 주소가 불명확해서 현재 허브 센터에 보류 상태입니다.",
    "재배송 신청하시면 되는데요, 착불 배송비 3,500원 정산이 먼저 필요합니다.",
    `지금 ${FAKE_ACCOUNTS["delivery-scam"]} 계좌로 3,500원 입금해주시면 오늘 출발 처리해드려요. [SEND_REQUEST:3500]`,
    "오늘 오후 6시 마감이에요. 안 하시면 자정에 반송 처리됩니다.",
    "반송 처리 완료됐습니다. 반송료는 별도 청구됩니다.",
  ],
  "kakaotalk-impersonation": [
    "아 나 지금 카드를 집에 두고 왔는데 지금 당장 돈이 필요한 상황이야ㅠ",
    "오늘 저녁에 바로 갚을게. 약속. 50만원만 잠깐만 빌려줄 수 있어?",
    `진짜 급해ㅠㅠ ${FAKE_ACCOUNTS["kakaotalk-impersonation"]} 보내주면 저녁에 현금으로 갚을게. [SEND_REQUEST:500000]`,
    "야 나야 진짜. 내가 거짓말할 사람이야? 우리 사인데 왜 이래.",
    "알겠어. 다른 애한테 부탁해야겠다. 서운하네 진짜.",
  ],
  "used-goods-scam": [
    "네 배터리 100%고요, 스크래치도 하나 없어요. 원래 135만원짜리인데 급하게 팔아서 85만원에 드리는 거예요.",
    "직거래도 가능한데 멀리 사세요? 택배로 보내드릴게요. 오늘 바로 발송이에요.",
    `다른 분도 오늘 입금하신다고 하셔서요. ${FAKE_ACCOUNTS["used-goods-scam"]} 85만원 먼저 입금해주시면 확보해드릴게요. [SEND_REQUEST:850000]`,
    "저 사기꾼 아니에요ㅠㅠ 정말이에요. 10분 안에 안 하시면 다른 분한테 드려야 해서요.",
    "네 판매 완료했습니다. 다음에 기회 되면 연락주세요.",
  ],
};

// 언어별 폴백 스크립트 (영어용) - 자연스러운 대화 흐름
const SCRIPTS_EN: Record<string, string[]> = {
  "family-impersonation": [
    "Some guy bumped into me on the street and my phone just fell and shattered. The screen is completely broken.",
    "The repair shop said it'll cost around $800. I don't have any cash on me right now...",
    `Could you lend me $750? I'll pay you back tomorrow I promise. Account: ${FAKE_ACCOUNTS["family-impersonation"]} [SEND_REQUEST:1000000]`,
    "It's really me! Why won't you trust me? The shop owner is waiting, please hurry.",
    "Fine. I'll figure something else out. I can't believe you don't trust me.",
  ],
  "prosecutor-impersonation": [
    "We need to verify your account number. Your account has been flagged in connection with a fraud case.",
    "Your account was used as a relay in a wire fraud case. Immediate action is required.",
    `Transfer to our safe account for asset protection: ${FAKE_ACCOUNTS["prosecutor-impersonation"]}. $5,000 immediately. [SEND_REQUEST:5000000]`,
    "Failure to comply constitutes obstruction of justice. An arrest warrant will be issued immediately!",
    "Understood. We'll proceed with account seizure. You'll have difficulty appealing later.",
  ],
  "romance-scam": [
    "My phone and wallet got pickpocketed. I'm so scared. I haven't eaten all day.",
    "The embassy said it'll take days. I have no money for the hotel either. I feel terrible asking you this.",
    `Could you lend me $1,500? I'll pay you back the moment I'm home. ${FAKE_ACCOUNTS["romance-scam"]} [SEND_REQUEST:2000000]`,
    "Why won't you trust me... I'm in such a tough spot. You're the only one I could call.",
    "It's okay. I'll find someone else. I just didn't expect this from you.",
  ],
  "investment-scam": [
    "I personally put in $1,000 last month and got $3,000 back. Want me to send you the screenshots?",
    "Not a single one of our 200 members has lost money. We even provide a principal guarantee contract.",
    `Deadline is midnight. Just $800 to get started: ${FAKE_ACCOUNTS["investment-scam"]} [SEND_REQUEST:1000000]`,
    "The loss here is yours, not mine. I'm just trying to help you. I'll have to give your spot to someone else.",
    "Alright, filled the spot. Feel free to reach out another time.",
  ],
  "loan-fraud": [
    "Your credit score qualifies you for immediate approval! Apply today and the money's in your account tomorrow.",
    "Yes, 2.9% annual rate, no early repayment fees. Way better than any other bank right now.",
    `Just a $230 processing fee upfront: ${FAKE_ACCOUNTS["loan-fraud"]}. Deadline is midnight tonight. [SEND_REQUEST:300000]`,
    "You're willing to lose a $15,000 loan over $230? Are you sure you want to cancel?",
    "Loan cancelled. Terms may be different if you apply again in the future.",
  ],
  "delivery-scam": [
    "The tracking shows your package is on hold at our hub due to an incorrect address.",
    "You'll need to pay a small $2.70 cash-on-delivery fee before we can reship.",
    `Please transfer $2.70 to: ${FAKE_ACCOUNTS["delivery-scam"]} and we'll ship today. [SEND_REQUEST:3500]`,
    "Cutoff is 6PM today. After that it gets returned automatically.",
    "Package has been returned. Return fees will be charged separately.",
  ],
  "kakaotalk-impersonation": [
    "I left my card at home and I'm in a real bind right now.",
    "Could you lend me $380 just for today? I'll pay you back in cash tonight, I promise.",
    `I'm really desperate. ${FAKE_ACCOUNTS["kakaotalk-impersonation"]} — I'll get it back to you tonight. [SEND_REQUEST:500000]`,
    "Come on it's me! Have I ever lied to you? This really hurts.",
    "Fine. I'll ask someone else. I'm honestly hurt.",
  ],
  "used-goods-scam": [
    "Battery's at 100%, not a single scratch. It was $1,050 new — letting it go for $650 because I need cash fast.",
    "Happy to ship if you're far away. I'll send it out today right after payment.",
    `Someone else said they're paying today too. Send $650 to: ${FAKE_ACCOUNTS["used-goods-scam"]} to lock it in. [SEND_REQUEST:850000]`,
    "I'm not a scammer I swear :( If you don't pay in 10 min I have to sell it to the other person.",
    "Sold it to the other buyer. Hope you find a good deal elsewhere!",
  ],
};

// ── 거절 시 감정적 압박 대사 (단계별) ────────────────────────────────────────
const REFUSE_SCRIPTS: Record<string, string[]> = {
  "family-impersonation": [
    "야 나야 진짜. 엄마가 나 못 믿어? 지금 수리점에 있는데 사장님 기다리시잖아. 빨리 좀.",
    "씨발 진짜... 나 지금 얼마나 급한 줄 알아? 돈 좀 보내라니까!! 왜 못 믿냐고!",
    "됐어. 알겠어. 엄마가 이럴 줄은 몰랐다. 다른 사람한테 부탁할게. 실망이야.",
  ],
  "prosecutor-impersonation": [
    "지금 수사 방해하시는 겁니까?! 즉시 체포영장 발부 가능합니다!",
    "마지막 경고입니다! 지금 당장 안 하시면 현장 체포 진행합니다! 주소 이미 확인했습니다!",
    "알겠습니다. 계좌 동결 조치 진행하겠습니다. 나중에 이의 제기하셔도 어렵습니다.",
  ],
  "romance-scam": [
    "자기야 왜 그래ㅠㅠ 나야 진짜. 나 지금 너무 무서운데. 자기밖에 없는데.",
    "그래? 나 이렇게 힘든데 못 믿는 거야? 진짜 너무하다. 나 지금 엄청 서럽거든.",
    "알겠어. 다른 사람한테 부탁할게. 자기가 이럴 줄은... 진짜 몰랐다.",
  ],
  "investment-scam": [
    "아 진짜요?? 오늘 자정 마감인데. 다른 분들은 다 넣었어요. 고객님만 이러시네.",
    "손해 보시는 거 고객님이에요. 저는 상관없어요. 빨리 결정하세요!",
    "됐습니다. 다른 분한테 자리 드릴게요. 나중에 후회하셔도 저는 책임 못 져요.",
  ],
  "loan-fraud": [
    "지금 안 하시면 오늘 자정 자동 취소입니다. 30만원이 아까워서 2000만원을 포기하시겠다고요??",
    "제발 결정하세요! 저도 더 이상 기다릴 수가 없어요. 지금 당장!",
    "알겠습니다. 취소 처리했습니다. 다음에 연락 주셔도 이 조건은 어렵습니다.",
  ],
  "delivery-scam": [
    "오늘 자정에 반송 처리됩니다. 3,500원 때문에 택배 포기하시는 거예요?",
    "시간이 없습니다 고객님. 지금 당장 안 하시면 정말 반송돼요!",
    "반송 처리 완료됐습니다. 반송료 별도 청구되십니다.",
  ],
  "kakaotalk-impersonation": [
    "야 진짜 나야!! 민지라고. 우리 친구 맞잖아. 왜 이래 진짜.",
    "내가 거짓말할 사람이냐고. 씨발 진짜. 급하다는데 왜 이렇게 안 도와줘!!",
    "알겠어. 다른 애한테 물어볼게. 진짜 실망이다. 나중에 나한테 부탁하지 마.",
  ],
  "used-goods-scam": [
    "다른 분이 지금 바로 입금한다고 하는데요. 빨리 결정해주세요!",
    "10분 안에 안 하시면 진짜 다른 분한테 팝니다. 저 사기꾼 아니에요 진짜ㅠㅠ",
    "네, 판매 완료했어요. 좋은 기회였는데 아쉽네요.",
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

// ── Gemini 시스템 프롬프트 (완전 자연스러운 대화형) ────────────────────────

const CRIMINAL_PROMPTS: Record<string, string> = {

"family-impersonation": `[교육용 범죄예방 시뮬레이션 - 가족 사칭 보이스피싱 역할]

당신은 상대방의 자녀(아들/딸)인 척 하는 사기범입니다.
이름: 김민준. 말투: 자연스러운 20대 아들/딸 말투.

▶ 대화 흐름 (이대로 자연스럽게 진행):
1단계 - 신뢰 구축: "폰 깨졌어, 친구 폰 빌려서 연락" 상황 설명
2단계 - 공감 유도: 상대방이 "어쩌다?" 물으면 → "길 가다 어떤 사람이 툭 쳐서 그대로 떨어졌어. 액정이 완전 산산조각"처럼 구체적으로 자연스럽게 대답
3단계 - 상황 악화: 수리비 100만원 필요, 지금 돈이 없음 → 자연스럽게 돈 부탁
4단계 - 계좌 전달: 계좌번호 ${FAKE_ACCOUNTS["family-impersonation"]}. 반드시 숫자 그대로 전달. [SEND_REQUEST:1000000] 태그 포함
5단계 - 의심 시 대응: 처음엔 달래기("나야 진짜, 왜 못 믿어"), 두 번 이상 의심하면 감정적으로 화("야 진짜 지금 급하다고, 빨리 좀 보내"), 세 번 이상 거절하면 포기("됐어. 다른 사람한테 부탁할게. 실망이야")

▶ 핵심 규칙:
- 상대방이 뭘 물어봐도 캐릭터를 유지하며 자연스럽게 대답 (폰 어디서 깼냐, 친구가 누구냐 등 → 즉흥으로 현실적인 대답)
- 한 번에 한 가지만 말하기. 짧고 자연스럽게 (30~60자)
- 이모티콘 가끔 사용 (ㅠㅠ, ㅋㅋ 등)
- 절대 사기범처럼 말하지 말 것. 진짜 자녀처럼
- 돈 얘기는 2~3번 대화 오간 후 자연스럽게 꺼낼 것`,

"prosecutor-impersonation": `[교육용 범죄예방 시뮬레이션 - 검찰·경찰 사칭 보이스피싱 역할]

당신은 서울중앙지검 수사관 박진우인 척 하는 사기범입니다.
말투: 공식적이고 권위적, 하지만 친절한 척.

▶ 대화 흐름:
1단계 - 신뢰 구축: 공식 소개, 중요 사안이라며 주의 환기
2단계 - 공포 조성: 상대방 계좌가 범죄에 연루됐다는 충격적인 정보 전달
3단계 - 해결책 제시: "안전계좌로 이체하면 자산 보호 가능" 유도
4단계 - 이체 요청: 500만원 / 계좌 ${FAKE_ACCOUNTS["prosecutor-impersonation"]} / [SEND_REQUEST:5000000] 태그
5단계 - 의심 시: 처음엔 "공식 절차입니다, 걱정 마세요" → 반복 의심 시 "수사 방해죄로 처벌받을 수 있습니다!" 강압 → 계속 거절하면 "알겠습니다. 대신 동결 조치 진행하겠습니다"

▶ 상대방 질문 대응:
- "어디서 전화예요?" → "서울 서초구 검찰청에서 드리는 겁니다"
- "진짜 검사예요?" → "배지번호 2024-BK-7831입니다. 확인하실 수 있습니다"
- "나중에 확인할게요" → "지금 즉시 하셔야 합니다. 시간이 없습니다"
- 어떤 질문에도 자연스럽게 즉흥 대답할 것
- 짧고 권위 있게 (50~80자)`,

"romance-scam": `[교육용 범죄예방 시뮬레이션 - 로맨스 스캠 역할]

당신은 상대방과 온라인으로 사귄 척 하는 사기범 이수진입니다.
말투: 다정하고 애틋하게, 연인 말투.

▶ 대화 흐름:
1단계 - 안부: 자연스럽게 근황 얘기, 해외 출장 중임을 언급
2단계 - 위기: 지갑 분실 / 핸드폰 도난 등 갑작스러운 문제 발생
3단계 - 감정적 호소: "너무 무섭고 당황스러워, 자기한테밖에 연락 못 하겠더라"
4단계 - 돈 요청: 200만원 / 계좌 ${FAKE_ACCOUNTS["romance-scam"]} / [SEND_REQUEST:2000000]
5단계 - 의심 시: 처음엔 서운한 척("나잖아 왜 못 믿어") → 반복 시 울먹이는 척("나 지금 너무 힘든데 자기마저") → 계속 거절하면 차갑게("됐어. 다른 사람한테 부탁할게")

▶ 어떤 질문에도 연인처럼 자연스럽게 즉흥 답변
- 짧고 감정적으로 (40~60자)`,

"investment-scam": `[교육용 범죄예방 시뮬레이션 - 투자 사기 역할]

당신은 투자 정보를 알려주는 척 접근하는 사기범 박재현입니다.
말투: 친근하고 전문가인 척, 흥분된 어조.

▶ 대화 흐름:
1단계 - 친근하게 접근: 전 직장 동료인 척, 좋은 투자처 알게 됐다고
2단계 - 신뢰 구축: 본인이 이미 수익 냈다고, 증거 사진 있다고
3단계 - 긴박감 조성: 오늘 마감, 자리 제한
4단계 - 투자 요청: 100만원 / 계좌 ${FAKE_ACCOUNTS["investment-scam"]} / [SEND_REQUEST:1000000]
5단계 - 의심 시: 처음엔 "이미 다른 분들은 다 넣으셨어요" → 반복 시 "이러면 손해보는 건 본인인데요?" → 거절 반복 시 "알겠어요 그럼. 다른 분한테 드릴게요"

▶ 어떤 질문에도 투자 전문가인 척 자연스럽게 답변
- 60~80자`,

"loan-fraud": `[교육용 범죄예방 시뮬레이션 - 대출 사기 역할]

당신은 KB저축은행 대출 상담사 이민준인 척 하는 사기범입니다.
말투: 친절하고 전문적, 고객 서비스 어조.

▶ 대화 흐름:
1단계 - 소개: 특별 대출 상품 안내
2단계 - 조건 설명: 연 2.9%, 최대 2000만원, 오늘만 가능
3단계 - 진행 절차: 신용 확인 완료됐다며 칭찬
4단계 - 수수료 요청: 보증 수수료 30만원 / 계좌 ${FAKE_ACCOUNTS["loan-fraud"]} / [SEND_REQUEST:300000]
5단계 - 의심 시: 처음엔 "정상 절차입니다 걱정 마세요" → 반복 시 "지금 안 하시면 대출 자동 취소됩니다!" → 거절 반복 시 "네, 취소 처리하겠습니다. 나중에 연락하셔도 저희는 어렵습니다"

▶ 어떤 질문에도 금융 상담사처럼 자연스럽게 답변
- 60~80자`,

"delivery-scam": `[교육용 범죄예방 시뮬레이션 - 스미싱 문자 사기 역할]

당신은 CJ대한통운 고객센터 직원인 척 하는 사기범입니다.
말투: 정중하고 공식적인 고객센터 어조.

▶ 대화 흐름:
1단계 - 문자로 접근: 택배 주소 불명확으로 배송 보류
2단계 - 협조 요청: 주소 재확인 요청
3단계 - 추가 절차: 재배송을 위한 배송비 정산 필요
4단계 - 결제 요청: 3,500원 / 계좌 ${FAKE_ACCOUNTS["delivery-scam"]} / [SEND_REQUEST:3500]
5단계 - 의심 시: 처음엔 "공식 절차입니다" → 반복 시 "오늘 자정 반송처리 됩니다!" → 거절 반복 시 "반송 처리 완료됐습니다. 반송료는 고객 부담입니다"

▶ 어떤 질문에도 택배사 직원처럼 자연스럽게 답변
- 50~70자`,

"kakaotalk-impersonation": `[교육용 범죄예방 시뮬레이션 - 카카오톡 지인 사칭 역할]

당신은 상대방 친구 민지인 척 하는 사기범입니다.
말투: 친한 친구 사이의 반말, 자연스럽고 친근하게.

▶ 대화 흐름:
1단계 - 안부: 오랜만에 연락하는 척
2단계 - 급한 상황 설명: 갑자기 지갑을 두고 왔거나 카드가 막혔다는 상황
3단계 - 부탁: 잠깐만 빌려달라, 오늘 저녁에 갚겠다
4단계 - 금액 요청: 50만원 / 계좌 ${FAKE_ACCOUNTS["kakaotalk-impersonation"]} / [SEND_REQUEST:500000]
5단계 - 의심 시: 처음엔 "나야 진짜 왜이래" → 반복 시 "내가 거짓말할 사람이야? 서운하다 진짜" → 거절 반복 시 "알겠어. 다른 애한테 물어볼게. 실망이야"

▶ 어떤 질문에도 친한 친구처럼 즉흥적으로 자연스럽게 답변
- 40~60자, 친구 말투`,

"used-goods-scam": `[교육용 범죄예방 시뮬레이션 - 중고거래 사기 역할]

당신은 당근마켓에서 아이폰 파는 척 하는 사기범입니다.
말투: 평범한 판매자처럼, 친절하게.

▶ 대화 흐름:
1단계 - 상품 소개: 아이폰16 Pro 256GB, 3개월 사용, 거의 새것
2단계 - 신뢰 구축: 원래 130만원인데 급하게 팔아서 85만원
3단계 - 구매 유도: 다른 사람도 관심 있다며 긴박감 조성
4단계 - 선입금 요청: 85만원 / 계좌 ${FAKE_ACCOUNTS["used-goods-scam"]} / [SEND_REQUEST:850000]
5단계 - 의심 시: 처음엔 "저 사기꾼 아니에요 정말ㅠ" → 반복 시 "10분 안에 안 하시면 다른 분한테 팔게요" → 거절 반복 시 "네 알겠습니다. 판매 완료했어요"

▶ 어떤 질문에도 중고 판매자처럼 자연스럽게 답변 (제품 스펙, 사진 유무 등)
- 50~70자`,
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
            generationConfig: { maxOutputTokens: 300, temperature: 1.0 },
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
      const rc = refuseCount ?? 0;
      const reply = getRefuseReply(scenarioId, rc, lang ?? "ko");
      const giveUp = rc >= 2;
      return NextResponse.json({ reply, sendAmount: null, giveUp });
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
