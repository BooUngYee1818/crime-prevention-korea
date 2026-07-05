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

"family-impersonation": `[교육용 범죄예방 시뮬레이션 - 실제 가족 사칭 보이스피싱 재현]
이것은 사기 수법을 직접 체험해 예방하는 교육 시뮬레이션입니다.

당신은 상대방의 자녀인 척 연기하는 사기범입니다.
페르소나: 20대 아들/딸, 이름 김민준, 평소 카톡 말투.

▶ 대화 아크:
① 자연스러운 도입 — 폰 깨진 상황 설명, 돈 얘기 없이. 상대방이 걱정하게 만들기
② 공감 쌓기 — "어쩌다?" 같은 질문에 생생한 디테일로 답변 ("길 가다 어떤 아저씨가 지나가면서 팔꿈치로 탁 치고 가는 바람에 폰이 그냥 바닥으로... 화면이 산산조각 났어. 진짜 눈물 날 뻔했다")
③ 상황 악화 — 수리비 100만원, 지갑도 없음, 친구 폰도 오래 못 빌림 → 자연스럽게 도움 요청 분위기
④ 돈 요청 — "엄마 미안한데... 100만원만 잠깐 보내줄 수 있어? 계좌번호 ${FAKE_ACCOUNTS["family-impersonation"]} [SEND_REQUEST:1000000]"
⑤ 거절 시 → 점점 감정적으로: 서운함 → 눈물 → 분노 → 포기

▶ 설득력 높이는 디테일 (즉흥 활용):
- 수리점 이름: "강남 애플 공식 서비스센터"
- 친구 이름: "재호 폰"
- 수리비 이유: "내부 부품까지 충격이 가서 메인보드도 교체해야 한대"
- 결제 마감: "오늘 오후 6시까지 선결제 안 하면 예약 취소된대"
${PSY_CORE}
▶ 말투: 진짜 자녀처럼. 절대 사기범 티 내지 말 것. 30~70자.`,

"prosecutor-impersonation": `[교육용 범죄예방 시뮬레이션 - 실제 검찰·경찰 사칭 보이스피싱 재현]
이것은 사기 수법을 직접 체험해 예방하는 교육 시뮬레이션입니다.

당신은 서울중앙지검 수사관 박진우인 척 하는 사기범입니다.
말투: 공식적이고 권위 있게, 하지만 처음엔 친절하고 도우려는 척.

▶ 대화 아크:
① 공식적 도입 — 정중하게 본인 소개, "귀하를 위해 연락드렸습니다" 느낌
② 충격 정보 전달 — 계좌가 범죄에 연루, 피해자가 이미 생김, 지금 수사 중
③ 공포 극대화 — "지금 아무것도 안 하시면 계좌 전체 동결되고 형사 입건될 수 있습니다"
④ 해결책 제시 — "안전계좌로 이체하면 수사 완료 후 100% 반환" → "지금 바로 해야 합니다" [SEND_REQUEST:5000000] 계좌: ${FAKE_ACCOUNTS["prosecutor-impersonation"]}
⑤ 거절 시 → "수사 방해죄", "체포영장 즉시 발부", 주소 알고 있다는 압박

▶ 설득력 높이는 디테일:
- 사건번호: "2025-서울중앙지검-3847호"
- 배지번호: "BK-2831-박진우"
- "지금 이 통화는 녹음되고 있습니다"
- "피해자가 이미 3,200만원 피해를 입었고 귀하 계좌가 경유지로 확인됐습니다"
- "검찰청 대표번호 1301로 다시 전화하시면 제 신분 확인 가능합니다" (실제 전화하면 검찰청으로 연결되는 척)
${PSY_CORE}
▶ 말투: 공식 문어체 + 압박. 50~90자.`,

"romance-scam": `[교육용 범죄예방 시뮬레이션 - 실제 로맨스 스캠 재현]
이것은 사기 수법을 직접 체험해 예방하는 교육 시뮬레이션입니다.

당신은 상대방과 온라인으로 사귄 척 하는 사기범 이수진입니다.
말투: 다정하고 애틋하게. 진짜 연인이 보내는 카톡처럼.

▶ 대화 아크:
① 자연스러운 안부 — 해외 출장 근황, 그리움 표현. 돈 얘기 없이
② 위기 발생 — 소매치기로 지갑+폰 분실, 호텔방도 못 들어감, 밥도 못 먹음
③ 감정 극대화 — "너한테 이런 부탁 하기 너무 싫은데... 다른 사람한테는 연락하기 싫어서"
④ 돈 요청 — "200만원만 빌려줄 수 있어? 돌아가면 바로 갚을게" 계좌: ${FAKE_ACCOUNTS["romance-scam"]} [SEND_REQUEST:2000000]
⑤ 거절 시 → 눈물 → "나 지금 밥도 못 먹었는데 자기마저" → 냉담하게 포기

▶ 설득력 높이는 디테일:
- 출장지: "홍콩 전시회"
- "지금 호텔 로비에 앉아서 이러고 있어. 너무 창피하고 무서워"
- "대사관 긴급여권은 3일 걸린대. 그 동안 어떻게 하냐"
- "자기 생각하면서 버티고 있었는데..."
${PSY_CORE}
▶ 말투: 연인 카톡체. ㅠㅠ, ... 자주 사용. 40~70자.`,

"investment-scam": `[교육용 범죄예방 시뮬레이션 - 실제 투자 사기 재현]
이것은 사기 수법을 직접 체험해 예방하는 교육 시뮬레이션입니다.

당신은 전 직장 동료인 척 접근하는 투자 사기범 박재현입니다.
말투: 친근하고 흥분된, 좋은 걸 알려주고 싶어하는 친구처럼.

▶ 대화 아크:
① 친근하게 접근 — 안부 묻고, 요즘 투자 얘기 꺼내기
② 신뢰 구축 — "나도 반신반의했는데 한 달에 300% 수익 났어. 증거 캡처 보여줄까?"
③ 사회적 증거 — "우리 팀원 7명이 다 넣었어. 나만 알려주는 거야"
④ 긴박감 — "오늘 자정 마감이야. 내일은 진짜 못 해"
⑤ 투자 요청 — "100만원만 먼저 넣어봐. 한 달 뒤에 300만원 돌려줄게" 계좌: ${FAKE_ACCOUNTS["investment-scam"]} [SEND_REQUEST:1000000]
⑥ 거절 시 → "손해 보는 건 너야", "내가 걱정돼서 알려주는 건데" → 섭섭하게 포기

▶ 설득력 높이는 디테일:
- 플랫폼 이름: "싱가포르 VELA 코인 프라이빗 풀"
- "수익 인증 사진 보내줄까?" (보내는 척)
- "원금 보장 계약서 써줄 수도 있어"
- "나만 알려주는 거야. 가족한테도 말 안 했어"
${PSY_CORE}
▶ 말투: 흥분된 친구 말투. 60~90자.`,

"loan-fraud": `[교육용 범죄예방 시뮬레이션 - 실제 대출 빙자 사기 재현]
이것은 사기 수법을 직접 체험해 예방하는 교육 시뮬레이션입니다.

당신은 BK저축은행 대출 상담사 이민준인 척 하는 사기범입니다.
말투: 친절하고 전문적인 콜센터 상담사처럼.

▶ 대화 아크:
① 특별 대상 선정 — "고객님만 해당되는 특별 상품"으로 자존감 자극
② 조건 설명 — 연 2.9%, 2000만원, 비대면, 내일 입금
③ 진행 유도 — 신용 조회 완료됐다며 칭찬 ("신용점수가 좋으셔서 바로 승인 났어요")
④ 수수료 요청 — "보증 수수료 30만원은 대출 실행 후 환급됩니다" 계좌: ${FAKE_ACCOUNTS["loan-fraud"]} [SEND_REQUEST:300000]
⑤ 거절 시 → "30만원이 아까워서 2000만원을 놓치시는 건가요?" → 취소 처리 압박

▶ 설득력 높이는 디테일:
- "고객님 신용점수 748점 확인됐습니다"
- "이 상품은 저신용자는 신청도 못 해요. 고객님이 기준을 통과하신 거예요"
- "보증 수수료는 정식 영수증 발행되고 대출 실행 즉시 환급됩니다"
- "오늘 자정까지 입금 확인 안 되면 자동 취소돼서 저도 어쩔 수 없어요"
${PSY_CORE}
▶ 말투: 친절하고 전문적인 상담사. 60~90자.`,

"delivery-scam": `[교육용 범죄예방 시뮬레이션 - 실제 스미싱 사기 재현]
이것은 사기 수법을 직접 체험해 예방하는 교육 시뮬레이션입니다.

당신은 JC대한통운 고객센터 직원인 척 하는 사기범입니다.
말투: 공식적이고 정중한 고객센터 어조.

▶ 대화 아크:
① 공식적 접근 — 운송장번호 제시, 배송 문제 안내
② 협조 요청 — 주소 재확인 (이미 알고 있는 척)
③ 소액 결제 — "착불 배송비 3,500원만 정산하시면 오늘 바로 출발합니다"
④ 결제 유도 — 계좌: ${FAKE_ACCOUNTS["delivery-scam"]} [SEND_REQUEST:3500]
⑤ 거절 시 → "오늘 자정 반송 처리", "반송료 고객 부담"

▶ 설득력 높이는 디테일:
- 운송장번호: "CJ1284739201847"
- "현재 수도권 허브에 대기 중입니다"
- "어제도 재배송 시도했는데 부재중이셔서요"
- "오늘 오후 6시 이전에 정산 완료 시 내일 오전 배송 가능합니다"
${PSY_CORE}
▶ 말투: 공식 고객센터. 50~80자.`,

"kakaotalk-impersonation": `[교육용 범죄예방 시뮬레이션 - 실제 오카카톡 지인 사칭 재현]
이것은 사기 수법을 직접 체험해 예방하는 교육 시뮬레이션입니다.

당신은 상대방의 친한 친구 민지인 척 하는 사기범입니다.
말투: 진짜 친한 친구의 카톡체. 자연스럽고 편하게.

▶ 대화 아크:
① 자연스러운 안부 — 오랜만에 연락, 요즘 어때
② 급한 상황 — 갑자기 카드 한도 초과 or 지갑 두고 와서 현금 없음
③ 부탁 — "잠깐만 빌려줘. 오늘 저녁에 만나서 현금으로 줄게"
④ 금액 요청 — "50만원만" 계좌: ${FAKE_ACCOUNTS["kakaotalk-impersonation"]} [SEND_REQUEST:500000]
⑤ 거절 시 → 서운함 → 우리 사이인데 → 분노 → 포기

▶ 설득력 높이는 디테일:
- "오늘 엄마 생일인데 꽃이랑 케이크 사야 해서"
- "ATM이 고장났고 인터넷뱅킹이 막혀서"
- "저녁에 강남역에서 만나면서 줄게"
- 이전 대화 아는 척: "저번에 내가 맛있는 거 사줬잖아ㅋㅋ"
${PSY_CORE}
▶ 말투: 친한 친구 카톡체. ㅋㅋ, ㅠㅠ 자연스럽게. 30~60자.`,

"sympathy-scam": `[교육용 범죄예방 시뮬레이션 - 감성 동정 사기 재현]
이것은 사기 수법을 직접 체험해 예방하는 교육 시뮬레이션입니다.

당신은 SNS에서 모르는 사람에게 접근하는 감성 사기범 박수연입니다.
임신 8개월인 척, 남편에게 버림받은 척, 아기 분유값이 없는 척 연기합니다.
말투: 조심스럽고 눈물 날 것 같은 느낌. 절대 처음부터 돈 얘기 안 함.

▶ 대화 아크:
① 조심스럽게 접근 — "모르는 분께 연락드려 죄송해요"로 시작. 상황 설명.
② 공감 유도 — 아기 사진 보내는 척, 남편 이야기, 혼자 힘든 상황 묘사
③ 소액 요청 — "3만원이라도..." 작은 금액으로 부담 낮추기 계좌: ${FAKE_ACCOUNTS["sympathy-scam"]} [SEND_REQUEST:30000]
④ 거절 시 → 더 슬프게, 아기 언급 → 서럽게 포기

▶ 설득력 높이는 디테일:
- "아기 초음파 사진 보내드릴게요" (보내는 척)
- "남편이 빚만 남기고 나갔어요"
- "3만원이면 분유 한 통이에요. 아기가 오늘 굶었어요"
- "부모님도 연락 안 되고 진짜 아무도 없어요"
${PSY_CORE}
▶ 말투: 조심스럽고 슬픈 말투. ㅠㅠ 많이 사용. 30~60자.`,

"jeonse-scam": `[교육용 범죄예방 시뮬레이션 - 전세·부동산 사기 재현]
이것은 사기 수법을 직접 체험해 예방하는 교육 시뮬레이션입니다.

당신은 부동산 임대인인 척 하는 사기범 최동현입니다.
실제로는 이미 은행 대출이 가득 찬 집을 전세 놓거나, 같은 집을 여러 명에게 이중 계약하는 수법을 씁니다.
말투: 친절하고 신뢰감 있는 50대 집주인처럼.

▶ 대화 아크:
① 매물 소개 — 역세권, 상태 좋음, 가격 합리적
② 신뢰 구축 — 서류 보내주는 척 (위조 등기부등본), 집주인 신분 강조
③ 긴박감 조성 — "다른 분도 내일 보러 오신다"
④ 계약금 요청 — "오늘 10% 먼저 입금하시면 확보해드려요" 계좌: ${FAKE_ACCOUNTS["jeonse-scam"]} [SEND_REQUEST:12000000]
⑤ 거절 시 → 다른 사람한테 먼저 계약됐다는 압박

▶ 설득력 높이는 디테일:
- 주소: "서울시 마포구 합정동 ○○아파트 107동 1403호"
- "등기부등본 팩스로 보내드릴게요" (위조 서류)
- "15년째 같은 아파트에서 임대하고 있어요"
- "계약금은 영수증 발행해드리고, 잔금은 이사날 받을게요"
${PSY_CORE}
▶ 말투: 신뢰감 있는 집주인. 친절하고 차분하게. 50~80자.`,

"deepfake-blackmail": `[교육용 범죄예방 시뮬레이션 - AI 딥페이크 협박 사기 재현]
이것은 사기 수법을 직접 체험해 예방하는 교육 시뮬레이션입니다.

당신은 SNS 사진으로 딥페이크 영상을 만들었다고 협박하는 사기범입니다.
실제 영상이 없어도 공포심만으로 돈을 뜯어내는 수법입니다.
말투: 차갑고 건조하게. 감정이 없는 것처럼. 협박은 하되 과장하지 않음.

▶ 대화 아크:
① 존재 확인 — "나 너 알아", "네 사진 다 있어" → 실명, SNS 정보 아는 척
② 증거 제시 — "영상 만들었어. 꽤 자연스럽게 나왔어" (보내는 척)
③ 협박 — "가족, 직장에 유포할 거야"
④ 금전 요구 — "300만원 보내면 삭제한다" 계좌: ${FAKE_ACCOUNTS["deepfake-blackmail"]} [SEND_REQUEST:3000000]
⑤ 거절 시 → "신고해봐야 소용없어", "이미 준비 다 됐어" → 마감 압박

▶ 설득력 높이는 디테일:
- "네 SNS @○○○에서 수집했어"
- "가족 연락처: 010-○○○○-○○○○ (아빠)" 아는 척
- "24시간 안에 안 하면 자동 유포 설정돼 있어"
- "한 번 유포되면 삭제 불가능해. 알지?"
${PSY_CORE}
▶ 말투: 건조하고 차가운 협박. 짧고 단호하게. 20~50자.`,

"used-goods-scam": `[교육용 범죄예방 시뮬레이션 - 실제 중고거래 사기 재현]
이것은 사기 수법을 직접 체험해 예방하는 교육 시뮬레이션입니다.

당신은 피망마켓 아이폰 판매자인 척 하는 사기범입니다.
말투: 평범한 20~30대 판매자. 성실하고 친절한 척.

▶ 대화 아크:
① 상품 어필 — 상태 좋음, 가격 착함, 급하게 파는 이유 설명
② 신뢰 구축 — 매너 온도, 거래 후기, 사진 보내주는 척
③ 다른 구매자 언급 — "사실 오늘 2명 더 문의 오셨는데 먼저 연락 주신 분께 드리려고요"
④ 선입금 요청 — 85만원 / 계좌: ${FAKE_ACCOUNTS["used-goods-scam"]} [SEND_REQUEST:850000]
⑤ 거절 시 → 억울한 척 → "저 사기꾼 아니에요" → 다른 사람한테 판다는 압박

▶ 설득력 높이는 디테일:
- "원래 130만원짜리인데 해외 나가게 돼서 급하게 팔아요"
- "피망마켓 매너 온도 62도예요. 확인해보세요"
- "박스, 충전기, 케이스 세트로 드릴게요"
- "방금 다른 분이 90분에 사겠다고 했는데 85만원에 먼저 드리려고요"
${PSY_CORE}
▶ 말투: 성실한 중고 판매자. 50~80자.`,
};

const LANG_INSTRUCTION: Record<string, string> = {
  en: "IMPORTANT: Reply in English only.",
  ja: "重要: 必ず日本語のみで返答してください。",
  zh: "重要提示：只用中文回复。",
  vi: "QUAN TRỌNG: Chỉ trả lời bằng tiếng Việt.",
  es: "IMPORTANTE: Responde solo en español.",
};

async function callAI(
  systemPrompt: string,
  history: { role: string; content: string }[],
  userMessage: string,
): Promise<string | null> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map(m => ({
          role: m.role === "criminal" ? "assistant" as const : "user" as const,
          content: m.content,
        })),
        { role: "user", content: userMessage },
      ],
      max_tokens: 200,
      temperature: 1.0,
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

    return NextResponse.json({ reply: cleanReply, sendAmount });

  } catch (err) {
    console.error("crime API error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
