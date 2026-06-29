export interface CrimeScenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  targetAge: "all" | "senior";
  reveal: RevealInfo;
}

export interface RevealInfo {
  crimeName: string;
  description: string;
  howToAvoid: string[];
  stats: string;
  reportNumber: string;
}

export const CRIME_SCENARIOS: CrimeScenario[] = [
  {
    id: "family-impersonation",
    title: "가족 사칭 보이스피싱",
    subtitle: "자녀가 급하게 돈을 요구해요",
    icon: "📱",
    color: "#ef4444",
    targetAge: "senior",
    reveal: {
      crimeName: "가족 사칭 보이스피싱",
      description: "가족인 척 연락해 긴급 상황을 만들고 돈을 요구하는 수법. 2025년 AI 음성 복제 기술로 실제 자녀 목소리를 3~5초 샘플만으로 완벽 복제합니다.",
      howToAvoid: [
        "모르는 번호로 가족이 연락하면 즉시 끊고 직접 전화",
        "아무리 목소리가 같아도 먼저 돈 얘기 꺼내면 의심",
        "112 신고 또는 가족에게 바로 확인 전화",
        "절대 먼저 송금하지 않기",
      ],
      stats: "2025년 피해 1조원 돌파 · 케이스당 평균 피해 5,290만원",
      reportNumber: "182",
    },
  },
  {
    id: "prosecutor-impersonation",
    title: "검찰·경찰 사칭",
    subtitle: "내 계좌가 범죄에 연루됐다고 해요",
    icon: "⚖️",
    color: "#f59e0b",
    targetAge: "senior",
    reveal: {
      crimeName: "검찰·경찰·금감원 사칭 사기",
      description: "공식 기관 직원을 사칭해 계좌 동결·범죄 연루 공포를 주고 '안전계좌'로 이체하도록 유도하는 수법. '안전계좌'는 세상에 존재하지 않습니다.",
      howToAvoid: [
        "검찰·경찰·금감원은 절대 전화로 송금 요구 안 함",
        "'안전계좌' 이체 요구는 100% 사기",
        "전화 즉시 끊고 해당 기관에 직접 전화해서 확인",
        "가족에게 바로 알리기",
      ],
      stats: "2025년 기관 사칭 사기 전체 신고의 43% · 피해 7,800억원",
      reportNumber: "112",
    },
  },
  {
    id: "romance-scam",
    title: "로맨스 스캠",
    subtitle: "온라인에서 사귄 사람이 돈을 요구해요",
    icon: "💔",
    color: "#ec4899",
    targetAge: "all",
    reveal: {
      crimeName: "로맨스 스캠 (피그버처링)",
      description: "SNS·데이팅앱에서 감정을 쌓은 뒤 해외 긴급상황 등을 핑계로 돈을 요구하는 수법. AI 딥페이크로 실존하지 않는 사람 사진을 만들어 사용합니다.",
      howToAvoid: [
        "직접 만난 적 없는 사람에게는 절대 송금 금지",
        "영상통화 요청해보기 (딥페이크 거부하면 바로 사기)",
        "해외에 있다며 돈 요구 = 99% 사기",
        "가족이나 지인에게 먼저 상의",
      ],
      stats: "2025년 피해 1,360억원 · 전년 대비 73% 증가 · 남성 피해자 급증",
      reportNumber: "182",
    },
  },
  {
    id: "investment-scam",
    title: "투자 사기 (코인·주식)",
    subtitle: "확실한 수익 보장 투자처를 알고 있대요",
    icon: "📈",
    color: "#8b5cf6",
    targetAge: "all",
    reveal: {
      crimeName: "투자 사기 (유사수신·코인 사기)",
      description: "카카오톡·텔레그램 투자 오픈채팅방에서 '확실한 수익 보장'으로 유혹. 가짜 수익 화면을 보여주고 출금 시 수수료 명목으로 추가 입금을 요구합니다.",
      howToAvoid: [
        "'원금 보장·고수익 보장' = 100% 불법 유사수신",
        "금융감독원 등록 여부 먼저 확인 (1332)",
        "SNS 투자방 절대 믿지 않기",
        "투자 전 반드시 가족·지인과 상의",
      ],
      stats: "2024년 215명 검거 · 피해액 3,256억원 · 코인 피싱 660% 급증",
      reportNumber: "1332",
    },
  },
  {
    id: "loan-fraud",
    title: "대출 빙자 사기",
    subtitle: "저금리 대출 해드린다며 수수료를 요구해요",
    icon: "🏦",
    color: "#06b6d4",
    targetAge: "all",
    reveal: {
      crimeName: "대출 빙자 사기",
      description: "저신용자를 대상으로 '저금리 대출 승인'을 미끼로 선납 수수료·보험료 등을 요구하는 수법. 수수료를 내면 대출은 실행되지 않고 잠적합니다.",
      howToAvoid: [
        "합법 금융기관은 절대 선납 수수료 요구 안 함",
        "대출 전 돈 요구 = 100% 사기",
        "금융감독원 등록 대부업체 여부 확인",
        "전화 끊고 금감원 1332에 신고",
      ],
      stats: "2025년 대출 빙자 사기 32,000건 이상 · 케이스당 평균 피해 2,400만원",
      reportNumber: "1332",
    },
  },
  {
    id: "delivery-scam",
    title: "택배·기관 문자 사기",
    subtitle: "택배 미수령·관세 납부 문자가 왔어요",
    icon: "📦",
    color: "#10b981",
    targetAge: "senior",
    reveal: {
      crimeName: "스미싱 (택배·기관 사칭 문자 사기)",
      description: "CJ대한통운·우체국·국세청 등을 사칭한 문자로 가짜 링크를 클릭하게 만들어 개인정보와 금융정보를 탈취하는 수법입니다.",
      howToAvoid: [
        "문자 속 링크 절대 클릭하지 않기",
        "공식 앱이나 114 안내로 직접 확인",
        "이미 클릭했다면 즉시 폰 끄고 118(한국인터넷진흥원) 신고",
        "출처 모를 앱 설치 금지",
      ],
      stats: "2025년 스미싱 문자 월 3억 건 이상 발송 · 피해 전년 대비 40% 증가",
      reportNumber: "118",
    },
  },
  {
    id: "kakaotalk-impersonation",
    title: "카카오톡 지인 사칭",
    subtitle: "친구 카톡이 왔는데 갑자기 돈을 빌려달래요",
    icon: "💬",
    color: "#fbbf24",
    targetAge: "all",
    reveal: {
      crimeName: "카카오톡 지인 사칭 사기",
      description: "지인의 카카오톡 계정을 해킹하거나 복제해 지인인 척 긴급 상황을 만들고 계좌이체·상품권 구매를 요구합니다. 2025년 AI 딥보이스로 음성통화까지 사기에 활용됩니다.",
      howToAvoid: [
        "카카오톡으로 돈 요청 오면 반드시 전화로 직접 확인",
        "상품권 구매·핀번호 전달 요청 = 100% 사기",
        "지인이라도 처음 만나는 번호에서 온 경우 의심",
        "카카오 고객센터 신고 및 112 접수",
      ],
      stats: "카카오톡 이용 사기 연 10만 건 이상 · 20~30대 피해자 급증",
      reportNumber: "112",
    },
  },
  {
    id: "used-goods-scam",
    title: "중고거래 사기",
    subtitle: "당근마켓에서 결제했는데 물건이 안 와요",
    icon: "🛍️",
    color: "#f97316",
    targetAge: "all",
    reveal: {
      crimeName: "중고거래 사기",
      description: "중고나라·당근마켓 등에서 시세보다 저렴한 물건을 미끼로 입금 후 잠적하거나, 가짜 결제 링크로 개인정보를 탈취하는 수법입니다.",
      howToAvoid: [
        "거래 전 계좌번호 사기 여부 조회 (경찰청 사이버캅 앱)",
        "플랫폼 내 안전결제 이용 (외부 링크 클릭 금지)",
        "너무 싼 가격 = 의심 필수",
        "직거래 또는 에스크로 결제 활용",
      ],
      stats: "2025년 중고거래 사기 12만 건 · 피해액 8,741억원 · 3년 새 10배 증가",
      reportNumber: "182",
    },
  },
  {
    id: "illegal-gambling",
    title: "불법 도박 사이트",
    subtitle: "처음엔 따지만 결국 전 재산을 잃어요",
    icon: "🎰",
    color: "#dc2626",
    targetAge: "all",
    reveal: {
      crimeName: "불법 온라인 도박 중독",
      description: "합법처럼 보이는 불법 도박 사이트에서 처음엔 의도적으로 돈을 따게 해 중독시킨 뒤 전 재산을 잃게 만드는 수법. 집·땅·자동차를 팔고, 가족에게 사기치고, 극단적 선택으로 이어지는 대한민국 최대 사회 문제 중 하나입니다.",
      howToAvoid: [
        "도박사이트 접속 자체가 불법 (1년 이하 징역 또는 1천만원 이하 벌금)",
        "처음 이기는 건 고의 — 중독을 유도하는 수법",
        "한국도박문제예방치유원 1336에 즉시 상담",
        "가족·지인에게 즉시 알리고 계좌 통제 요청",
      ],
      stats: "국내 도박 중독자 추정 200만명 · 연 피해 5조원 · 10명 중 3명 자살 충동 경험",
      reportNumber: "1336",
    },
  },
  {
    id: "link-download-scam",
    title: "링크·다운로드 사기",
    subtitle: "문자 속 링크를 눌렀더니 개인정보가 털렸어요",
    icon: "🔗",
    color: "#7c3aed",
    targetAge: "all",
    reveal: {
      crimeName: "피싱 링크·악성 앱 설치 사기",
      description: "출처 불명의 링크를 클릭하거나 앱을 설치하면 스마트폰에 악성코드가 심어져 주민번호·금융정보·연락처 등 모든 개인정보가 실시간으로 탈취됩니다. 피해자도 모르는 사이 소액결제·대출이 실행되기도 합니다.",
      howToAvoid: [
        "문자·카카오톡·이메일 속 링크는 절대 클릭하지 않기",
        "출처 불명 앱 설치 금지 — 공식 앱스토어에서만 다운로드",
        "이미 클릭했다면 즉시 비행기 모드 → 118(KISA) 신고",
        "통신사 소액결제 차단 설정 및 금융앱 비밀번호 즉시 변경",
      ],
      stats: "2025년 스미싱·피싱 피해 연 1조 2천억원 · 악성 앱 설치 피해 전년 대비 230% 급증",
      reportNumber: "118",
    },
  },
];
