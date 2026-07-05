export interface ScamVariant {
  icon: string;
  label: string;
  desc: string;
  isThis?: boolean; // 이번 시뮬레이션이 이 유형
}

export interface ScenarioTypeInfo {
  summary: string;       // 이 사기의 핵심 심리 무기
  psychWeapon: string;   // 감정, 공포, 탐욕 등
  variants: ScamVariant[];
}

export const SCENARIO_TYPES: Record<string, ScenarioTypeInfo> = {
  "family-impersonation": {
    summary: "가족을 사칭해 긴박감을 조성한 뒤 돈을 요구합니다",
    psychWeapon: "걱정·죄책감",
    variants: [
      {
        icon: "📞",
        label: "전화 사칭형",
        desc: "\"엄마 나야, 폰 깨져서 새 번호야\" — 직접 통화로 긴박감 조성 후 송금 요구",
        isThis: true,
      },
      {
        icon: "💬",
        label: "메신저 사칭형",
        desc: "오카카톡·텔레그램 계정 해킹 후 가족 행세. 링크 클릭 유도나 소액 요청",
      },
      {
        icon: "🔗",
        label: "문자 링크형",
        desc: "\"엄마 내 사진 저장해줘\" 식 링크 전송 → 악성앱 설치 → 개인정보·금융정보 탈취",
      },
    ],
  },

  "prosecutor-impersonation": {
    summary: "수사기관 권위를 이용해 공포심을 심고 '안전계좌'로 유도합니다",
    psychWeapon: "공포·권위에 대한 복종",
    variants: [
      {
        icon: "📞",
        label: "전화 압박형",
        desc: "\"검사 김OO입니다, 당신 계좌가 범죄에 연루됐습니다\" — 직접 통화로 심리 압박",
        isThis: true,
      },
      {
        icon: "📋",
        label: "가짜 서류형",
        desc: "이메일·팩스로 구속영장·수사통보서 등 위조 공문서 발송 후 입금 요구",
      },
      {
        icon: "🖥️",
        label: "원격제어형",
        desc: "\"증거 확인을 위해 앱 설치해주세요\" → 원격 접속으로 금융정보 직접 탈취",
      },
    ],
  },

  "romance-scam": {
    summary: "장기간 감정을 쌓은 뒤 위기 상황을 연출해 돈을 요구합니다",
    psychWeapon: "사랑·연민",
    variants: [
      {
        icon: "📱",
        label: "SNS·앱 연애형",
        desc: "인스타·데이팅앱에서 접근 → 수개월 친밀감 형성 → 해외 위기 연출 → 송금",
        isThis: true,
      },
      {
        icon: "📈",
        label: "투자 복합형",
        desc: "연인 관계 형성 후 \"나만 아는 투자처 알려줄게\" — 로맨스+투자사기 결합",
      },
      {
        icon: "📸",
        label: "몸캠 협박형",
        desc: "친밀감 형성 → 영상통화 유도 → 녹화 후 유포 협박으로 돈 요구",
      },
    ],
  },

  "investment-scam": {
    summary: "'원금보장 고수익'으로 탐욕을 자극한 뒤 출금을 막아 돈을 빼앗습니다",
    psychWeapon: "탐욕·FOMO(기회 놓칠 것 같은 두려움)",
    variants: [
      {
        icon: "💬",
        label: "리딩방 사기형",
        desc: "오픈채팅·텔레그램에 가짜 전문가 등장 → 소액 성공 체험 → 큰 금액 투자 유도",
        isThis: true,
      },
      {
        icon: "📸",
        label: "SNS 인플루언서형",
        desc: "유명인 사칭 인스타·유튜브 광고 → \"이 코인 지금 안 사면 후회\" 압박",
      },
      {
        icon: "🏢",
        label: "사무실 방문형",
        desc: "그럴듯한 사무실, 정장 차림 직원 — 오프라인 신뢰 형성 후 대규모 사기",
      },
    ],
  },

  "loan-fraud": {
    summary: "저금리·특별 대출을 미끼로 수수료를 먼저 내게 합니다",
    psychWeapon: "절박함·희망",
    variants: [
      {
        icon: "📞",
        label: "텔레마케팅형",
        desc: "\"고객님 특별 저금리 대출 안내드립니다\" — 먼저 전화해서 선입금 유도",
        isThis: true,
      },
      {
        icon: "📱",
        label: "문자·앱 설치형",
        desc: "\"대출 승인됐습니다\" 문자 → 가짜 금융앱 설치 → 개인정보 탈취 후 명의도용",
      },
      {
        icon: "🤝",
        label: "중간 브로커형",
        desc: "\"제가 은행 담당자 연결해드릴게요\" — 브로커 수수료 명목으로 선입금 요구",
      },
    ],
  },

  "delivery-scam": {
    summary: "택배·기관 사칭 문자 링크로 개인정보와 금융정보를 빼냅니다",
    psychWeapon: "일상적 익숙함·무의식적 클릭",
    variants: [
      {
        icon: "📦",
        label: "택배 배송비형",
        desc: "\"배송비 미납입니다\" 문자 → 링크 클릭 → 가짜 결제 페이지로 카드정보 탈취",
        isThis: true,
      },
      {
        icon: "🏥",
        label: "건강보험·정부기관형",
        desc: "\"건강검진 결과 확인\" \"환급금 안내\" — 공공기관 사칭으로 신뢰도 높임",
      },
      {
        icon: "💳",
        label: "카드·은행 사칭형",
        desc: "\"비정상 결제 감지됐습니다\" — 금융기관 사칭으로 공포심 자극 후 정보 탈취",
      },
    ],
  },

  "kakaotalk-impersonation": {
    summary: "지인의 메신저 계정을 해킹하거나 사칭해 소액부터 요구합니다",
    psychWeapon: "신뢰(아는 사람이라는 믿음)",
    variants: [
      {
        icon: "💬",
        label: "계정 해킹형",
        desc: "실제 지인 계정 탈취 후 \"나야, 급해서 그러는데\" — 지인 이름·프로필 그대로 사용",
        isThis: true,
      },
      {
        icon: "🆕",
        label: "새 번호 사칭형",
        desc: "\"폰 바꿨어 새 번호야\" — 번호 바뀐 이유를 만들어 기존 번호 확인을 막음",
      },
      {
        icon: "👔",
        label: "직장 상사 사칭형",
        desc: "\"나 팀장인데 지금 회의 중이라 전화 못 해. 거래처에 먼저 입금해줄 수 있어?\"",
      },
    ],
  },

  "used-goods-scam": {
    summary: "중고거래 플랫폼을 악용해 가짜 안전결제나 선입금 사기를 칩니다",
    psychWeapon: "거래 익숙함·저렴한 가격에 대한 기대",
    variants: [
      {
        icon: "🔗",
        label: "가짜 안전결제형",
        desc: "\"피망마켓 안전결제 쓸게요\" → 외부 링크 전송 → 가짜 페이지에서 카드정보 탈취",
        isThis: true,
      },
      {
        icon: "💸",
        label: "선입금 먹튀형",
        desc: "\"먼저 입금하면 바로 보내드려요\" — 돈 받자마자 연락 두절. 가장 단순한 수법",
      },
      {
        icon: "📦",
        label: "가짜 상품 발송형",
        desc: "정품 사진 올리고 가품·파손품 발송 → 환불 거부 → 연락 차단",
      },
    ],
  },

  "sympathy-scam": {
    summary: "불쌍한 사연을 내세워 동정심을 자극한 뒤 금전을 요구합니다",
    psychWeapon: "연민·선한 마음",
    variants: [
      {
        icon: "💬",
        label: "SNS 사연형",
        desc: "SNS에 감동적인 사연 게시 → 공유 확산 → 계좌번호로 직접 후원 요청",
        isThis: true,
      },
      {
        icon: "🚶",
        label: "직접 접근형",
        desc: "길거리·지하철에서 직접 접근 \"아이 수술비가 없어요\" — 오프라인 즉석 요구",
      },
      {
        icon: "☎️",
        label: "전화 사연형",
        desc: "\"조카가 납치됐어요 도와주세요\" — 전화로 긴박한 사연 연출 후 송금 요구",
      },
    ],
  },

  "jeonse-scam": {
    summary: "등기부등본 허위 정보나 이중계약으로 보증금을 가로챕니다",
    psychWeapon: "내 집 마련 욕구·저렴한 전세에 대한 기대",
    variants: [
      {
        icon: "📄",
        label: "깡통전세형",
        desc: "집값 대비 과도한 대출 + 전세보증금 → 집 경매 시 보증금 한 푼도 못 받음",
        isThis: true,
      },
      {
        icon: "✍️",
        label: "이중계약형",
        desc: "같은 집을 여러 사람과 전세 계약 체결 → 입금만 받고 잠적",
      },
      {
        icon: "🏢",
        label: "신탁 미고지형",
        desc: "신탁등기 된 집을 소유자처럼 계약 — 실소유자가 따로 있어 계약 자체가 무효",
      },
    ],
  },

  "deepfake-blackmail": {
    summary: "합성 영상·사진을 유포하겠다고 협박해 돈을 뜯어냅니다",
    psychWeapon: "수치심·두려움",
    variants: [
      {
        icon: "🎭",
        label: "딥페이크 합성형",
        desc: "SNS 사진을 AI로 합성해 성적 영상 제작 → 지인·직장에 유포하겠다고 협박",
        isThis: true,
      },
      {
        icon: "📹",
        label: "몸캠 녹화형",
        desc: "화상채팅 유도 → 상대방만 유인 영상 재생 → 피해자 노출 화면 녹화 후 협박",
      },
      {
        icon: "🔓",
        label: "계정 해킹형",
        desc: "SNS·클라우드 해킹으로 개인 사진 탈취 후 유포 협박 — 별도 접촉 없이 진행",
      },
    ],
  },
};
