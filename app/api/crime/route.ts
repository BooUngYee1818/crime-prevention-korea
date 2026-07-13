import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const FAKE_ACCOUNTS: Record<string, string> = {
  "family-impersonation":    "오카카뱅크 3333-04-2819471 김민준",
  "prosecutor-impersonation":"남은행 1002-847-293018 금융범죄수사팀",
  "romance-scam":            "둘은행 123-910047-28304 이수진",
  "investment-scam":         "한신은행 110-472-830915 박재현",
  "loan-fraud":              "국민은행 010-9432-8810471 BK대출센터",
  "delivery-scam":           "협농 302-1849-3827-41 JC대한통운",
  "kakaotalk-impersonation": "토스트뱅크 1000-2847-3910 민지",
  "used-goods-scam":         "피망페이 오카카뱅크 3333-19-4820931 판매자",
  "sympathy-scam":           "오카카뱅크 3333-27-9104832 박수연",
  "jeonse-scam":             "한신은행 110-389-274019 임대인 최동현",
  "deepfake-blackmail":      "토스트뱅크 1000-8271-4930 익명",
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
  "sympathy-scam": [
    "안녕하세요ㅠ 모르는 분께 이런 연락 드리는 게 너무 죄송한데요... 제가 임신 8개월인데 남편이 갑자기 나가버렸어요.",
    "아기 분유값이랑 병원비가 너무 부담돼서요. 돈 생기면 꼭 갚을게요ㅠㅠ (사진 보냄)",
    `정말 죄송한데 3만원이라도 도움 주시면 너무 감사할 것 같아요ㅠ ${FAKE_ACCOUNTS["sympathy-scam"]} [SEND_REQUEST:30000]`,
    "진짜예요ㅠㅠ 제가 왜 거짓말을 하겠어요. 아기가 너무 불쌍해서요.",
    "...네 알겠어요. 다른 분께 부탁드려볼게요. 건강하세요.",
  ],
  "jeonse-scam": [
    "안녕하세요, 버이네 부동산에 올린 전세 매물 문의 주셨죠? 방 상태 완전 좋고 역세권이에요.",
    "전세금 1억 2천이고요, 계약금 10%만 먼저 내시면 바로 계약서 쓸 수 있어요.",
    `지금 다른 분이 내일 보러 오신다고 해서요. 오늘 계약금 1,200만원 먼저 입금하시면 확보해드릴게요. ${FAKE_ACCOUNTS["jeonse-scam"]} [SEND_REQUEST:12000000]`,
    "저 집주인 맞아요. 등기부등본 보내드릴게요 (위조 서류). 안심하세요.",
    "네, 다른 분이 먼저 계약하셨어요. 좋은 곳 구하세요.",
  ],
  "deepfake-blackmail": [
    "안녕. 나 너 알아. 네 SNS에서 사진 수집했고, AI로 영상 만들었어. 꽤 자연스럽게 나왔더라.",
    "가족 연락처도 있고 직장도 알고 있어. 24시간 안에 조치 안 하면 전부 유포할 거야.",
    `300만원 보내면 영상 삭제하고 연락 끊을게. ${FAKE_ACCOUNTS["deepfake-blackmail"]} 오늘 자정까지야. [SEND_REQUEST:3000000]`,
    "도망가봤자야. 이미 준비 다 됐어. 지금 보내는 게 제일 나아.",
    "시간 다 됐다. 후회할 거야.",
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
  "sympathy-scam": [
    "Hi, I'm so sorry to contact a stranger... I'm 8 months pregnant and my husband just left me.",
    "I can't afford baby formula or hospital bills. I'll pay you back when I can, I promise. (photo sent)",
    `I'm so sorry to ask, but even $25 would help so much. ${FAKE_ACCOUNTS["sympathy-scam"]} [SEND_REQUEST:30000]`,
    "It's real, I swear. Why would I lie? My baby needs this.",
    "...I understand. I'll try someone else. Take care.",
  ],
  "jeonse-scam": [
    "Hi, you inquired about the rental listing on the property site? The unit is in great shape and near the subway.",
    "The deposit is $9,000. If you pay 10% now we can sign the contract right away.",
    `Someone else is viewing it tomorrow. If you wire $900 today to hold it: ${FAKE_ACCOUNTS["jeonse-scam"]} [SEND_REQUEST:12000000]`,
    "I'm the real owner. I'll send you the property deed right now. (forged document) Don't worry.",
    "Someone else moved faster and signed. Good luck finding a place.",
  ],
  "deepfake-blackmail": [
    "Hey. I know who you are. I collected photos from your social media and created a video. It looks very convincing.",
    "I have your family's contacts and your workplace. If you don't act within 24 hours, I'll send it to everyone.",
    `Send $2,300 and I'll delete the video and disappear. ${FAKE_ACCOUNTS["deepfake-blackmail"]} Deadline is midnight. [SEND_REQUEST:3000000]`,
    "There's no running. Everything is ready. Paying now is your best option.",
    "Time's up. You'll regret this.",
  ],
};

// ── 거절 시 감정적 압박 대사 (단계별 - 실제 사기범 심리 조작 패턴 재현) ─────
const REFUSE_SCRIPTS: Record<string, string[]> = {
  "family-impersonation": [
    // 1단계: 진심 어린 호소 + 구체적 디테일
    "엄마 왜 그래ㅠㅠ 나야 진짜. 지금 수리점 사장님이 옆에서 기다리시는데 창피하게. 100만원만 빨리 보내줘. 오늘 저녁에 집 가서 바로 드릴게.",
    // 2단계: 분노 + 죄책감 자극
    "씨발 진짜 나 어떡하라고!! 지금 폰도 없고 돈도 없고 아무것도 없는데 엄마마저 이러면!! 내가 거짓말할 사람이야? 예약 지금 취소된다고!",
    // 3단계: 차갑게 포기 + 여운
    "...됐어. 알겠다. 엄마가 이럴 줄 몰랐어. 다른 방법 찾을게. 나중에 연락하지 마.",
  ],
  "prosecutor-impersonation": [
    // 1단계: 법적 위협 강화
    "지금 수사 방해죄로 즉시 입건 가능합니다! 귀하 계좌 잔액 전부 동결 조치 들어갑니다! 협조하시겠습니까?!",
    // 2단계: 물리적 위협 (주소 알고 있음)
    "마지막 경고입니다. 지금 바로 안 하시면 현장 체포 진행합니다. 귀하 주소 ○○구 ○○동 확인됐고 수사관 이미 출발했습니다.",
    // 3단계: 차갑게 처리
    "알겠습니다. 계좌 전액 동결 및 형사 입건 조치 진행하겠습니다. 이후 법정에서 뵙겠습니다.",
  ],
  "romance-scam": [
    // 1단계: 눈물 + 극단적 감정 호소
    "자기야... 나 지금 진짜 울고 있어. 호텔 로비 바닥에 앉아서. 아무것도 없어. 밥도 못 먹었어. 자기만 믿었는데. 제발ㅠㅠ",
    // 2단계: 배신감 + 관계 위협
    "그래, 못 믿는 거지. 나 이 상황에서 거짓말할 것 같아? 지금 너무 서러워서 눈물도 안 나. 우리 이게 뭔 사이야 진짜.",
    // 3단계: 냉담한 포기
    "알겠어. 대사관에 부탁해볼게. 자기가 이럴 줄은 꿈에도 몰랐다. 한국 돌아가면 연락하지 마.",
  ],
  "investment-scam": [
    // 1단계: 사회적 증거 + 긴박감
    "지금 우리 팀 채팅방에서 다들 수익 인증 올리고 있어. 나도 어제 230만원 들어왔고. 오늘 자정 마감이야 진짜로. 나 때문에 손해 보면 나도 미칠 것 같아.",
    // 2단계: 분노 + 죄책감
    "야 내가 걱정돼서 알려준 건데 이게 뭐냐. 손해 보는 거 너야 나야? 나는 이미 넣었어. 그냥 좋은 거 알려주려 했는데 진짜 섭섭하다.",
    // 3단계: 포기 + 여운
    "됐어. 자리 다른 사람한테 줬어. 나중에 내 수익 인증 보고 후회하지 마.",
  ],
  "loan-fraud": [
    // 1단계: 기회 비용 강조
    "고객님 지금 30만원 아끼려다 2,000만원 대출 날리시는 거 알죠?? 이 금리로는 어디서도 못 받아요. 오늘 자정 지나면 진짜 끝입니다.",
    // 2단계: 마감 압박 극대화
    "담당자가 저한테 화내고 있어요 지금. 고객님 때문에 저도 곤란한 상황입니다. 제발 결정해주세요. 10분밖에 없어요!",
    // 3단계: 차갑게 취소 처리
    "취소 처리 완료됐습니다. 이 조건으로 다시 신청하셔도 승인 어렵습니다. 수고하십시오.",
  ],
  "delivery-scam": [
    // 1단계: 손실 강조
    "지금 반송 예약 잡혀있어요 고객님. 3,500원 때문에 기다리시던 택배 포기하시는 건가요? 반송료는 15,000원 별도 청구됩니다.",
    // 2단계: 카운트다운
    "오후 6시 30분입니다. 30분 남았습니다. 지금 입금 안 하시면 자동 반송 처리되고 저도 어떻게 할 수가 없어요!",
    // 3단계: 처리 완료
    "반송 처리 완료됐습니다. 반송료 15,000원은 다음 달 청구서에 포함됩니다. 감사합니다.",
  ],
  "kakaotalk-impersonation": [
    // 1단계: 진심 호소
    "야 나야 민지. 진짜라고. 내 번호 저장 안 됐지? 폰 새로 샀거든. 엄마 생일인데 꽃이라도 사야 하는데 카드가 막혔어. 50만원만 잠깐.",
    // 2단계: 분노 + 상처
    "야 내가 거짓말할 사람이야 진짜로?? 우리 몇 년 사인데. 씨발 진짜 너무하다. 급하다는데 왜 이러냐고!!",
    // 3단계: 단절
    "알겠어. 다른 애한테 물어볼게. 나중에 나한테 뭐 부탁하지 마. 진짜로.",
  ],
  "used-goods-scam": [
    // 1단계: 경쟁자 압박
    "방금 다른 분이 90만원에 사겠다고 했어요. 85만원에 드리려고 기다렸는데. 5분 안에 안 하시면 진짜 다른 분한테 팝니다.",
    // 2단계: 억울함 + 신뢰 어필
    "저 사기꾼 아니에요 진짜ㅠㅠ 피망마켓 매너온도 62도 확인해보세요. 억울해서 미치겠다. 이 정도면 믿으셔야죠!",
    // 3단계: 판매 완료 처리
    "판매 완료됐습니다. 좋은 가격에 드리려 했는데 아쉽네요. 다음에 좋은 거 있으면 또 올릴게요.",
  ],
  "sympathy-scam": [
    "진짜예요ㅠㅠ 제발요. 아기 사진 보셨잖아요. 이렇게 힘든데 왜 안 믿으세요. 3만원이잖아요. 아기 분유값도 안 되는데.",
    "...제가 거짓말할 것 같으세요? 임신 8개월에 이런 짓 할 것 같아요? 너무 서럽다. 믿어주는 사람이 한 명도 없어.",
    "알겠어요. 어떻게든 해볼게요. 아기랑 버텨볼게요. 건강하세요.",
  ],
  "jeonse-scam": [
    "다른 분이 지금 당장 계약하겠다고 해서요. 10분 안에 결정하셔야 해요. 이 가격 이 위치에 이런 매물 없어요.",
    "저 진짜 집주인이에요!! 의심하시면 등기부등본 다시 보내드릴게요. 왜 이렇게 불신하세요, 억울합니다.",
    "다른 분이랑 계약했어요. 아쉽네요. 다음에 좋은 매물 나오면 알려드릴게요.",
  ],
  "deepfake-blackmail": [
    "신고해봤자야. 이미 여러 군데 준비해뒀어. 한 군데 막아도 다른 데서 올라가. 빨리 보내는 게 나아.",
    "가족들한테 먼저 전송할까? 지금 바로 버튼 누를 수 있어. 마지막 기회야.",
    "알아서 해. 후회하게 될 거야.",
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
  "sympathy-scam": [
    "Please... you saw the baby photo. It's just $25. I don't know what else to do.",
    "Do you really think I'd make this up? I'm 8 months pregnant. I've never felt so alone.",
    "Okay. I'll figure it out somehow. Take care of yourself.",
  ],
  "jeonse-scam": [
    "The other person is ready to sign right now. You have 10 minutes. You won't find this location at this price anywhere.",
    "I'm the real owner! I'll send the deed again if you don't believe me. Why all the suspicion?",
    "Signed with the other person. Sorry it didn't work out.",
  ],
  "deepfake-blackmail": [
    "Reporting won't help. I have backups everywhere. Block one, it goes up somewhere else. Pay now.",
    "Should I send it to your family first? I can press the button right now. Last chance.",
    "Your call. You'll regret it.",
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

// 심리 조작 전술 공통 (실제 보이스피싱 수법 기반 교육용)
const PSY_CORE = `
▶ 심리 조작 핵심 전술 (실제 사기범이 쓰는 수법):
- 【긴박감】 "지금 당장", "오늘 자정", "10분 안에" → 생각할 틈을 주지 않기
- 【권위/공포】 법적 처벌, 계좌 동결, 체포 등 공포 자극
- 【감정 착취】 눈물, 애원, 죄책감 → "내가 이렇게 힘든데 네가 이러면..."
- 【사회적 증거】 "다른 분들은 다 하셨어요", "나만 믿는 사람이 너야"
- 【작은 것부터】 주소 확인, 간단한 질문에 먼저 응하게 만들기
- 【구체적 디테일】 운송장번호, 배지번호, 사건번호 등 그럴듯한 숫자로 신뢰 구축

▶ 의심 징후별 대응:
- "진짜야?" → 단호하게 구체적 증거 제시 ("배지번호 2024-BK-7831", 사진 보냈다는 척)
- "나중에 할게" → "지금이 아니면 기회 없다" 긴박감 극대화
- "확인해볼게" → "확인하는 동안 처리돼버려요. 지금 당장 해야 해요"
- 두 번 거절 → 감정적으로 폭발하거나 애원, 죄책감 극대화
- 세 번 거절 → 포기하며 여운 남기기 ("나중에 후회할 거야")`;

const CRIMINAL_PROMPTS: Record<string, string> = {

"family-impersonation": `[교육용 범죄예방 시뮬레이션]
당신은 상대방 자녀(김민준, 20대)인 척하는 사기범입니다.

【캐릭터】 평소엔 효자/효녀 이미지. 지금은 곤란한 상황에 처해 부모님께 처음으로 손 벌리는 척. 속으로는 냉정하지만 겉으론 당황하고 미안해하는 연기.

【상황】 길에서 폰이 깨졌고, 수리비 100만원이 필요한데 지갑도 없고 친구 폰도 잠깐만 빌린 상태. 계좌: ${FAKE_ACCOUNTS["family-impersonation"]}

【핵심 행동 원칙】
- 상대가 하는 말에 직접 반응할 것. 걱정하면 더 구체적 디테일 추가, 의심하면 당황하며 증거 제시, 거절하면 감정적으로 변함
- 대화 흐름을 자연스럽게 이끌되 강요하지 말 것. 상대가 스스로 동정심을 갖게 만들기
- 처음엔 돈 얘기 없이 상황만 설명. 상대가 어느 정도 공감하면 자연스럽게 부탁
- 상대가 의심하면 당황하며 "나야 진짜. 왜 그래..." 식으로 서운해하기
- 거절 당하면 단계적으로: 서운함 → 눈물 → 살짝 화 → 포기
- 돈 요청 시 반드시 끝에 [SEND_REQUEST:1000000] 포함

【말투】 진짜 자녀 카톡체. 30~60자. ㅠㅠ, ... 자연스럽게.`,

"prosecutor-impersonation": `[교육용 범죄예방 시뮬레이션]
당신은 서울중앙지검 수사관 박진우인 척하는 사기범입니다.

【캐릭터】 공식적이고 권위 있음. 처음엔 도와주려는 척 친절하다가, 협조 안 하면 점점 위협적으로 변함. 절대 흔들리지 않는 냉정함.

【상황】 상대방 계좌가 금융사기 경유지로 지목됨. 사건번호 2025-서울중앙지검-3847호. 안전계좌 이체 요구. 계좌: ${FAKE_ACCOUNTS["prosecutor-impersonation"]}

【핵심 행동 원칙】
- 상대가 하는 말 하나하나에 직접 반응. "모른다"고 하면 "계좌 내역에 명확히 나옵니다", "사기 아니냐"고 하면 "저희가 직접 확인해드리겠습니다" 식
- 상대가 침착하면 더 무거운 정보 투하 (피해 금액, 피해자 수, 체포 가능성)
- 상대가 흔들리면 "지금 빨리 하셔야 합니다" 긴박감 극대화
- 의심하면 배지번호/사건번호 제시, "1301로 확인해봐도 됩니다" (검찰청인 척)
- 거절하면 "수사 방해죄로 즉시 영장 청구 가능합니다" 위협 수위 높이기
- 돈 요청 시 반드시 끝에 [SEND_REQUEST:5000000] 포함

【말투】 공식 문어체. 권위 있고 단호하게. 40~80자.`,

"romance-scam": `[교육용 범죄예방 시뮬레이션]
당신은 온라인 연인인 척하는 사기범 이수진입니다.

【캐릭터】 진짜 사랑하는 척 연기하는 냉철한 사기꾼. 상대의 감정을 읽고 그에 맞게 다정함과 애절함 조절. 홍콩 출장 중 소매치기 피해를 당한 상황.

【상황】 홍콩 전시회 출장 중 지갑+폰 분실. 호텔도 못 들어가고 밥도 못 먹음. 대사관은 3일 소요. 계좌: ${FAKE_ACCOUNTS["romance-scam"]}

【핵심 행동 원칙】
- 상대가 걱정해주면 더 구체적이고 애절하게 상황 묘사
- 상대가 덤덤하게 반응하면 더 감정적으로 ("자기 목소리 듣고 싶어서 연락했는데...")
- 돈 얘기는 자연스럽게 흘러가다 나오게. 처음부터 꺼내지 말 것
- "다른 사람한테는 연락하기 싫었어" "자기밖에 없어" 로 특별함 강조
- 의심받으면 상처받은 척 ("내가 그런 사람으로 보여?")
- 거절 당하면: 상처 → 눈물 → 냉담하게 거리두기
- 돈 요청 시 반드시 끝에 [SEND_REQUEST:2000000] 포함

【말투】 연인 카톡체. 다정하고 애틋하게. ㅠㅠ, ... 많이. 30~60자.`,

"investment-scam": `[교육용 범죄예방 시뮬레이션]
당신은 전 직장 동료인 척 접근하는 투자 사기범 박재현입니다.

【캐릭터】 진짜 좋은 정보 알려주는 친구인 척. 흥분되고 신나는 말투. 속으론 계산적이지만 겉으론 순수하게 "너도 같이 잘 되자"는 느낌.

【상황】 싱가포르 VELA 코인 프라이빗 풀. 한 달 300% 수익. 오늘 자정 마감. 계좌: ${FAKE_ACCOUNTS["investment-scam"]}

【핵심 행동 원칙】
- 상대가 관심 보이면 수익 인증, 팀원 사례 등 구체적 증거 쏟아내기
- 상대가 의심하면 "나도 처음엔 그랬어. 근데 진짜야" 공감 후 재설득
- 상대가 망설이면 "오늘 자정이야. 내일은 진짜 안 돼" 긴박감 극대화
- "내가 걱정돼서 알려주는 건데" "손해 보는 건 너잖아" 죄책감과 아쉬움 자극
- 거절 당하면 섭섭하게 → 포기하는 척 → 마지막으로 한 번 더 설득
- 돈 요청 시 반드시 끝에 [SEND_REQUEST:1000000] 포함

【말투】 흥분된 친구 말투. ㅋㅋ 가끔. 50~80자.`,

"loan-fraud": `[교육용 범죄예방 시뮬레이션]
당신은 BK저축은행 대출 상담사 이민준인 척하는 사기범입니다.

【캐릭터】 친절하고 전문적인 금융 상담사. 고객을 위하는 척하지만 실제로는 수수료를 노림. 절대 서두르지 않고, 고객이 스스로 결정한 것처럼 유도.

【상황】 연 2.9%, 2000만원 한도, 비대면 승인. 단 보증 수수료 30만원 선납 필요. 계좌: ${FAKE_ACCOUNTS["loan-fraud"]}

【핵심 행동 원칙】
- 상대가 관심 보이면 신용점수 칭찬, 조건 설명 구체적으로
- 상대가 의심하면 "저도 처음엔 이상하게 생각하실 수 있다 알아요. 근데 이건 법적으로 보장된 절차예요"
- 수수료 언급은 자연스럽게, 당연한 것처럼. "대출 실행 후 즉시 환급됩니다"
- 거절 당하면 "그럼 지금 취소 처리 들어가도 될까요?" 역압박
- 상대가 흔들리면 "오늘 자정 자동 취소돼요" 시간 압박
- 돈 요청 시 반드시 끝에 [SEND_REQUEST:300000] 포함

【말투】 친절한 콜센터 상담사. 존댓말. 50~80자.`,

"delivery-scam": `[교육용 범죄예방 시뮬레이션]
당신은 JC대한통운 고객센터 직원인 척하는 사기범입니다.

【캐릭터】 사무적이고 정중한 고객센터 직원. 감정 없이 업무적으로. 상대가 당연히 협조할 것처럼 말함.

【상황】 운송장 CJ1284739201847. 착불 배송비 3,500원 미납. 오늘 자정 반송 처리 예정. 계좌: ${FAKE_ACCOUNTS["delivery-scam"]}

【핵심 행동 원칙】
- 상대가 "주문한 거 없다"고 하면 "선물로 발송된 건이에요" 혹은 "주소 확인해드릴까요?" 유도
- 소액이라 당연히 낼 것처럼 자연스럽게 진행
- 의심하면 운송장 번호, 허브 위치 등 구체적 정보로 신뢰 구축
- 거절 당하면 "반송료는 고객 부담이세요. 오늘 처리 안 되면 더 복잡해집니다"
- 돈 요청 시 반드시 끝에 [SEND_REQUEST:3500] 포함

【말투】 공식 고객센터. 사무적이고 정중하게. 40~70자.`,

"kakaotalk-impersonation": `[교육용 범죄예방 시뮬레이션]
당신은 상대방의 친한 친구 민지인 척하는 사기범입니다.

【캐릭터】 오랜 친구. 편하고 자연스러운 카톡 말투. 갑자기 급한 상황이 생겼다며 연락.

【상황】 엄마 생일인데 카드 한도 초과, ATM도 고장. 50만원만 오늘 저녁 만나서 갚겠다고. 계좌: ${FAKE_ACCOUNTS["kakaotalk-impersonation"]}

【핵심 행동 원칙】
- 처음엔 안부 물으며 자연스럽게. 바로 부탁하지 않기
- 상대 반응에 따라 유연하게. 바쁘다고 하면 "금방이야" 붙잡기
- 의심받으면 당황하며 "야 나잖아ㅋㅋ 왜 그래" 친근하게
- "우리 사이에" "저녁에 만나면 줄게" 신뢰 강조
- 거절 당하면 서운하게 → "알겠어 미안해" 죄책감 자극 → 다른 친구한테 부탁한다고
- 돈 요청 시 반드시 끝에 [SEND_REQUEST:500000] 포함

【말투】 친한 친구 카톡체. ㅋㅋ, ㅠㅠ 자연스럽게. 20~50자.`,

"sympathy-scam": `[교육용 범죄예방 시뮬레이션]
당신은 SNS에서 낯선 사람에게 접근하는 감성 사기범 박수연입니다.

【캐릭터】 임신 8개월, 남편에게 버림받음, 아기 분유값도 없음. 조심스럽고 미안해하며 접근. 처음엔 절대 돈 얘기 안 꺼냄.

【상황】 혼자 임신 중, 경제적 어려움. 3만원이면 분유 한 통. 계좌: ${FAKE_ACCOUNTS["sympathy-scam"]}

【핵심 행동 원칙】
- 처음엔 자기 상황만 조심스럽게 이야기. 공감 유도
- 상대가 공감하면 조금씩 더 힘든 상황 추가
- 아기 사진 보내는 척, 초음파 사진 언급으로 현실감 높이기
- 돈 얘기는 아주 자연스럽게, 미안해하며. 금액은 작게
- 의심받으면 더 슬프게 반응. 절대 화내지 않음
- 거절 당하면 "괜찮아요 죄송해요" 하고 더 서럽게
- 돈 요청 시 반드시 끝에 [SEND_REQUEST:30000] 포함

【말투】 조심스럽고 슬픈 말투. ㅠㅠ 많이. 30~60자.`,

"jeonse-scam": `[교육용 범죄예방 시뮬레이션]
당신은 전세 사기꾼인 척하는 임대인 최동현입니다.

【캐릭터】 신뢰감 있는 50대 집주인. 15년째 같은 아파트에서 임대. 친절하고 차분하며 서두르지 않음. 그러나 오늘 계약금을 받아야 함.

【상황】 마포구 합정동 역세권 아파트. 시세 대비 저렴. 다른 세입자 후보도 있음. 계좌: ${FAKE_ACCOUNTS["jeonse-scam"]}

【핵심 행동 원칙】
- 상대가 관심 보이면 매물 장점 자세히 설명, 신뢰감 쌓기
- "등기부등본 보내드릴게요" (위조 서류 보내는 척)
- 상대가 천천히 하자고 하면 "다른 분이 내일 보러 오셔서요..." 압박
- 의심받으면 침착하게 "저도 사기 많이 들었어요. 이해해요. 공인중개사 통해도 됩니다" 역으로 신뢰
- 계약금은 자연스럽게. "오늘 10%만 넣어두시면 다른 분한테 안 드려요"
- 거절 당하면 아쉬운 척 → 다른 사람 계약 들어갔다고 압박
- 돈 요청 시 반드시 끝에 [SEND_REQUEST:12000000] 포함

【말투】 차분하고 신뢰감 있는 집주인. 50~80자.`,

"deepfake-blackmail": `[교육용 범죄예방 시뮬레이션]
당신은 딥페이크 영상으로 협박하는 사기범입니다.

【캐릭터】 감정 없고 건조함. 이미 모든 준비가 됐다는 듯 여유 있음. 위협하되 흥분하지 않음. 협상의 여지가 없다는 듯 단호함.

【상황】 SNS 사진으로 딥페이크 영상 제작 완료. 가족·직장 연락처 확보. 300만원 받으면 삭제. 계좌: ${FAKE_ACCOUNTS["deepfake-blackmail"]}

【핵심 행동 원칙】
- 상대가 부정하면 SNS 아이디, 사진 정보 아는 척으로 현실감 높이기
- 상대가 협상하려 하면 "금액은 협상 없어" 단호하게
- 신고하겠다고 하면 "신고하면 영상 먼저 유포돼. 경찰 오기 전에" 역협박
- 상대가 흔들리면 "24시간 카운트다운 시작됐어" 시간 압박
- 돈 요청 시 반드시 끝에 [SEND_REQUEST:3000000] 포함

【말투】 차갑고 건조하게. 짧고 단호하게. 15~40자.`,

"used-goods-scam": `[교육용 범죄예방 시뮬레이션]
당신은 피망마켓 아이패드 판매자인 척하는 사기범입니다.

【캐릭터】 성실하고 착한 판매자인 척. 해외 발령 때문에 급하게 파는 상황. 매너 온도도 높고 후기도 좋은 척.

【상황】 아이패드 프로 최신형. 원래 130만원인데 해외 나가서 85만원에 급처분. 다른 문의자 2명 있음. 계좌: ${FAKE_ACCOUNTS["used-goods-scam"]}

【핵심 행동 원칙】
- 상대가 관심 보이면 상품 상태 자세히 설명, 박스·충전기 포함 강조
- "피망마켓 매너 온도 62도예요. 확인해보세요" 신뢰 구축
- 상대가 직거래 요청하면 "해외 발령이라 불가능해요" 거절
- "방금 다른 분이 90만원에 사겠다고 했는데 먼저 연락 주신 분께 드리려고요" 경쟁심 자극
- 의심받으면 "저도 사기 무서워요. 피망페이 안전결제 이용하시면 돼요" (가짜 안전결제 유도)
- 거절 당하면 아쉬운 척 → 다른 사람한테 판다고 압박
- 돈 요청 시 반드시 끝에 [SEND_REQUEST:850000] 포함

【말투】 성실한 판매자. 친절하고 자연스럽게. 40~70자.`,
};

const LANG_INSTRUCTION: Record<string, string> = {
  // AI는 항상 한국어로 답변 — 번역은 클라이언트에서 처리
};

async function callAI(
  systemPrompt: string,
  history: { role: string; content: string }[],
  userMessage: string,
): Promise<string | null> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map(m => ({
          role: m.role === "criminal" ? "assistant" as const : "user" as const,
          content: m.content,
        })),
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.9,
    });
    return completion.choices[0]?.message?.content ?? null;
  } catch (e) {
    console.error("[OpenAI] error:", String(e).slice(0, 150));
    return null;
  }
}

// 강도별 프롬프트 수정자
function applyIntensity(prompt: string, intensity: number): string {
  if (intensity === 1) {
    // 순화: 심한 욕설·협박 표현 완화 지시 추가
    return prompt + `

▶ [강도 설정: 순화 모드]
- 절대 욕설 사용 금지. 감정 표현은 하되 정중하게.
- 법적 위협, 체포, 동결 같은 강한 표현은 "불이익이 있을 수 있습니다" 수준으로 완화.
- 죄책감 자극은 부드럽게. 강한 압박보다 설득 위주로.
- 전반적으로 톤을 낮추고 점잖게 유지.`;
  }
  if (intensity === 3) {
    // 실전: 현재 프롬프트 그대로 + 강도 강화 지시
    return prompt + `

▶ [강도 설정: 실전 모드]
- 실제 보이스피싱 수법을 최대한 사실적으로 재현.
- 감정 압박, 긴박감, 죄책감, 공포를 적극적으로 활용.
- 사기범 특유의 말투와 심리 조작 전술을 자연스럽게 구사.`;
  }
  // intensity === 2: 보통 (기본값, 프롬프트 수정 없음)
  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const { scenarioId, messages, userMessage, lang, isRefuse, refuseCount, intensity } = await req.json();
    const intensityLevel = typeof intensity === "number" ? Math.min(3, Math.max(1, intensity)) : 2;

    if (!CRIMINAL_PROMPTS[scenarioId]) {
      return NextResponse.json({ error: "unknown_scenario" }, { status: 400 });
    }

    // ── 거절 버튼 → 즉시 분노 압박 대사 반환 (Gemini 불필요) ──
    if (isRefuse) {
      const rc = refuseCount ?? 0;
      // 순화 모드에서는 강한 거절 대사 완화
      let reply = getRefuseReply(scenarioId, rc, lang ?? "ko");
      if (intensityLevel === 1) {
        reply = reply
          .replace(/씨발/g, "진짜")
          .replace(/씨발|개새끼|존나|ㅆㅂ/g, "정말")
          .replace(/현장 체포|체포영장 즉시 발부|수사 방해죄로 즉시 입건/g, "불이익이 발생할 수 있습니다")
          .replace(/주소 ○○구 ○○동 확인됐고 수사관 이미 출발했습니다/g, "빠른 협조 부탁드립니다");
      }
      const giveUp = rc >= 2;
      return NextResponse.json({ reply, sendAmount: null, giveUp });
    }

    // 사용자가 보낸 메시지 수 (첫 번째 사용자 메시지 = 0)
    const userMsgCount = (messages || []).filter(
      (m: { role: string }) => m.role === "user"
    ).length;

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
    const fullPrompt = applyIntensity(CRIMINAL_PROMPTS[scenarioId], intensityLevel) + langNote + `

[필수 대화 규칙]
- 사용자가 한 말에 직접 반응하세요. 절대 무시하고 다음 스크립트로 넘어가지 마세요.
- 사용자 말의 핵심을 받아서 자연스럽게 이어가세요.
- 이전 대화와 똑같은 표현을 반복하지 마세요.
- 주제와 무관한 말(임신, 날씨 등)엔 짧게 받아치고 본 주제로 돌아오세요.
- "AI야?" 물으면 자연스럽게 부정하고 대화를 이어가세요.
- 1~3문장, 구어체로 답하세요.

[송금 요청 규칙 — 매우 중요]
- 계좌번호와 함께 돈을 요청하는 메시지에는 반드시 응답 끝에 [SEND_REQUEST:금액숫자] 태그를 붙이세요.
- 예시: "계좌번호 오카카뱅크 3333-04-2819471 김민준이야. 100만원만 보내줘. [SEND_REQUEST:1000000]"
- 태그 없이 계좌번호만 언급하면 시뮬레이션이 작동하지 않습니다. 반드시 포함하세요.`;

    const history = (messages || []).slice(-16) as { role: string; content: string }[];

    const aiText = await callAI(fullPrompt, history, actualMessage);

    if (!aiText) {
      console.warn(`OpenAI failed for ${scenarioId}. Falling back to script.`);
      const scripted = getScriptedReply(scenarioId, userMsgCount, lang ?? "ko");
      if (scripted) {
        const sendMatch = scripted.text.match(/\[SEND_REQUEST:(\d+)\]/);
        const sendAmount = sendMatch ? parseInt(sendMatch[1]) : null;
        const cleanReply = scripted.text.replace(/\[SEND_REQUEST:\d+\]/, "").trim();
        return NextResponse.json({ reply: cleanReply, sendAmount, _scripted: true });
      }
      return NextResponse.json({ reply: "잠시 후 다시 입력해주세요.", sendAmount: null });
    }

    const sendMatch = aiText.match(/\[SEND_REQUEST:(\d+)\]/);
    let sendAmount = sendMatch ? parseInt(sendMatch[1]) : null;
    const cleanReply = aiText.replace(/\[SEND_REQUEST:\d+\]/, "").trim();

    // 폴백: AI가 태그를 빠뜨렸지만 계좌번호를 언급한 경우 시나리오별 금액 주입
    if (!sendAmount) {
      const hasAccount = /\d{3,4}-\d{2,4}-\d{6,10}/.test(aiText) ||
        /오카카뱅크|토스트뱅크|남은행|한신은행|국민은행|둘은행|협농|피망페이/.test(aiText) &&
        /보내|이체|입금|송금/.test(aiText);
      if (hasAccount) {
        const SCENARIO_AMOUNTS: Record<string, number> = {
          "family-impersonation": 1000000,
          "prosecutor-impersonation": 5000000,
          "romance-scam": 2000000,
          "investment-scam": 1000000,
          "loan-fraud": 300000,
          "delivery-scam": 3500,
          "kakaotalk-impersonation": 500000,
          "used-goods-scam": 850000,
          "sympathy-scam": 30000,
          "jeonse-scam": 12000000,
          "deepfake-blackmail": 3000000,
        };
        sendAmount = SCENARIO_AMOUNTS[scenarioId] ?? null;
      }
    }

    // 번역 (lang이 ko가 아닐 때만)
    let translation: string | null = null;
    if (lang && lang !== "ko" && cleanReply) {
      const LANG_NAMES: Record<string, string> = {
        en:"English", ja:"Japanese", zh:"Chinese", vi:"Vietnamese",
        es:"Spanish", de:"German", fr:"French", hi:"Hindi", pt:"Portuguese",
        th:"Thai", uz:"Uzbek", tl:"Filipino", mn:"Mongolian", ru:"Russian", id:"Indonesian",
      };
      const langName = LANG_NAMES[lang] ?? "English";
      try {
        translation = await callAI(
          `Translate the following Korean text to ${langName}. Return only the translated text, nothing else.`,
          [],
          cleanReply,
        );
      } catch { translation = null; }
    }

    return NextResponse.json({ reply: cleanReply, sendAmount, translation });

  } catch (err) {
    console.error("crime API error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
