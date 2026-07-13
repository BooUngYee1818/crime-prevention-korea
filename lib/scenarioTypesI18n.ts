import { SCENARIO_TYPES } from "./scenarioTypes";

interface LocalizedVariant {
  icon: string;
  label: string;
  desc: string;
  isThis?: boolean;
}

interface LocalizedScenarioTypeInfo {
  summary: string;
  psychWeapon: string;
  variants: LocalizedVariant[];
}

type TranslationMap = Record<string, LocalizedScenarioTypeInfo>;

const translations: Record<string, TranslationMap> = {
  en: {
    "family-impersonation": {
      summary: "Scammers impersonate a family member, create urgency, and demand money.",
      psychWeapon: "Worry · Guilt",
      variants: [
        {
          icon: "📞",
          label: "Phone Call Impersonation",
          desc: "\"Mom, it's me — I broke my phone, this is my new number.\" Creates urgency over a call then asks for a transfer.",
        },
        {
          icon: "💬",
          label: "Messenger Impersonation",
          desc: "Hacks or clones a family member's KakaoTalk/Telegram account, then asks for small payments or tricks the victim into clicking a link.",
        },
        {
          icon: "🔗",
          label: "SMS Link",
          desc: "\"Mom, save my photo!\" — a malicious link installs spyware that steals personal and financial information.",
        },
      ],
    },
    "prosecutor-impersonation": {
      summary: "Scammers pose as investigators or prosecutors to instill fear and redirect money to a 'safe account'.",
      psychWeapon: "Fear · Submission to Authority",
      variants: [
        {
          icon: "📞",
          label: "Phone Pressure",
          desc: "\"This is Prosecutor Kim. Your account is linked to a crime.\" — psychological pressure over a direct call.",
        },
        {
          icon: "📋",
          label: "Fake Documents",
          desc: "Sends forged arrest warrants or investigation notices by email or fax, then demands a deposit.",
        },
        {
          icon: "🖥️",
          label: "Remote Access",
          desc: "\"Please install this app to verify evidence.\" — gains remote control and directly steals financial credentials.",
        },
      ],
    },
    "romance-scam": {
      summary: "Scammers build emotional bonds over time, then stage a crisis to demand money.",
      psychWeapon: "Love · Compassion",
      variants: [
        {
          icon: "📱",
          label: "SNS / Dating App Romance",
          desc: "Approaches via Instagram or dating apps, builds intimacy over months, then stages an overseas emergency and asks for a wire transfer.",
        },
        {
          icon: "📈",
          label: "Romance + Investment Combo",
          desc: "After forming a romantic relationship, reveals a \"secret investment tip\" — combining romance and investment fraud.",
        },
        {
          icon: "📸",
          label: "Video Chat Blackmail",
          desc: "Builds intimacy, lures the victim into a video call, records it, then demands money under threat of sharing the footage.",
        },
      ],
    },
    "investment-scam": {
      summary: "Scammers lure victims with 'guaranteed high returns', then block withdrawals and steal the money.",
      psychWeapon: "Greed · FOMO (Fear Of Missing Out)",
      variants: [
        {
          icon: "💬",
          label: "Fake Trading Group",
          desc: "A fake expert appears in an open chat or Telegram group — small wins are staged to build trust before pushing large investments.",
        },
        {
          icon: "📸",
          label: "SNS Influencer Scam",
          desc: "Ads impersonating celebrities on Instagram or YouTube: \"If you don't buy this coin now, you'll regret it.\"",
        },
        {
          icon: "🏢",
          label: "Fake Office Visit",
          desc: "A convincing office with suited staff builds offline credibility before executing a large-scale fraud.",
        },
      ],
    },
    "loan-fraud": {
      summary: "Scammers offer low-interest or special loans as bait and collect fees upfront.",
      psychWeapon: "Desperation · Hope",
      variants: [
        {
          icon: "📞",
          label: "Telemarketing Call",
          desc: "\"We have a special low-interest loan for you.\" — an unsolicited call coaxes the victim into paying an upfront fee.",
        },
        {
          icon: "📱",
          label: "SMS / Fake App",
          desc: "\"Your loan has been approved.\" → installs a fraudulent banking app → steals personal data and commits identity theft.",
        },
        {
          icon: "🤝",
          label: "Middleman Broker",
          desc: "\"I can connect you to a bank officer.\" — demands a broker fee before any loan is ever processed.",
        },
      ],
    },
    "delivery-scam": {
      summary: "Phishing texts impersonating delivery services or government agencies steal personal and financial data via malicious links.",
      psychWeapon: "Everyday Familiarity · Unconscious Clicking",
      variants: [
        {
          icon: "📦",
          label: "Delivery Fee Phishing",
          desc: "\"Unpaid shipping fee.\" → victim clicks a link → a fake payment page harvests card details.",
        },
        {
          icon: "🏥",
          label: "Health Insurance / Government Agency",
          desc: "\"Check your health screening results\" or \"Claim your refund\" — impersonates public institutions to appear trustworthy.",
        },
        {
          icon: "💳",
          label: "Bank / Card Company Phishing",
          desc: "\"Abnormal transaction detected.\" — impersonates a financial institution to create panic, then harvests credentials.",
        },
      ],
    },
    "kakaotalk-impersonation": {
      summary: "Scammers hack or impersonate a contact's messenger account and start with small requests.",
      psychWeapon: "Trust (Belief That It's Someone You Know)",
      variants: [
        {
          icon: "💬",
          label: "Account Hijack",
          desc: "Takes over a real contact's account: \"It's me, I'm in a tight spot.\" — uses the real name and profile picture.",
        },
        {
          icon: "🆕",
          label: "New Number Impersonation",
          desc: "\"I changed my phone, this is my new number.\" — fabricates a reason for the number change to prevent the victim from verifying.",
        },
        {
          icon: "👔",
          label: "Boss Impersonation",
          desc: "\"It's your team leader. I'm in a meeting and can't call. Can you wire the payment to the client first?\"",
        },
      ],
    },
    "used-goods-scam": {
      summary: "Scammers exploit secondhand marketplaces with fake escrow services or request upfront payments then disappear.",
      psychWeapon: "Familiarity with Trading · Expectation of a Bargain",
      variants: [
        {
          icon: "🔗",
          label: "Fake Escrow / Safe Payment",
          desc: "\"I'll use Market Safe Pay.\" → sends an external link → a fake page steals card details.",
        },
        {
          icon: "💸",
          label: "Upfront Payment Scam",
          desc: "\"Send the money first and I'll ship immediately.\" — disappears after receiving payment. The simplest method.",
        },
        {
          icon: "📦",
          label: "Counterfeit / Damaged Goods",
          desc: "Lists genuine product photos but ships fakes or damaged items → refuses refunds → blocks all contact.",
        },
      ],
    },
    "sympathy-scam": {
      summary: "Scammers fabricate a sob story to trigger compassion and then ask for money.",
      psychWeapon: "Compassion · Goodwill",
      variants: [
        {
          icon: "💬",
          label: "SNS Story",
          desc: "Posts a heartbreaking story on social media, spreads it widely, then asks followers to donate directly to a bank account.",
        },
        {
          icon: "🚶",
          label: "In-Person Approach",
          desc: "Approaches strangers on the street or subway: \"I can't afford my child's surgery.\" — demands cash on the spot.",
        },
        {
          icon: "☎️",
          label: "Phone Story",
          desc: "\"My niece has been kidnapped, please help me!\" — stages an urgent story over the phone and demands a transfer.",
        },
      ],
    },
    "jeonse-scam": {
      summary: "Scammers pocket the deposit using false registry information or double contracts.",
      psychWeapon: "Dream of Homeownership · Expectation of a Cheap Lease",
      variants: [
        {
          icon: "📄",
          label: "Over-Leveraged Lease",
          desc: "A property with excessive loans relative to its value takes the lease deposit — when auctioned, the tenant recovers nothing.",
        },
        {
          icon: "✍️",
          label: "Double Contract",
          desc: "Signs lease contracts with multiple tenants for the same property — collects deposits then vanishes.",
        },
        {
          icon: "🏢",
          label: "Undisclosed Trust Registration",
          desc: "Poses as the owner of a trust-registered property — the contract is void because someone else is the real owner.",
        },
      ],
    },
    "deepfake-blackmail": {
      summary: "Scammers threaten to distribute synthesized explicit videos or photos to extort money.",
      psychWeapon: "Shame · Fear",
      variants: [
        {
          icon: "🎭",
          label: "Deepfake Composite",
          desc: "Uses AI to create explicit videos from SNS photos, then threatens to send them to contacts or the victim's workplace.",
        },
        {
          icon: "📹",
          label: "Video Chat Recording",
          desc: "Lures the victim into a video call while playing a pre-recorded clip — records the victim's exposed screen then blackmails.",
        },
        {
          icon: "🔓",
          label: "Account Hacking",
          desc: "Hacks SNS or cloud storage to steal private photos, then threatens to leak them — no prior contact needed.",
        },
      ],
    },
  },

  zh: {
    "family-impersonation": {
      summary: "冒充家属制造紧迫感，索要钱财。",
      psychWeapon: "担忧·愧疚感",
      variants: [
        {
          icon: "📞",
          label: "电话冒充型",
          desc: "「妈，是我，手机摔坏了，这是新号码。」通话中制造紧迫感，要求转账。",
        },
        {
          icon: "💬",
          label: "即时通讯冒充型",
          desc: "盗取或克隆家属的KakaoTalk/Telegram账号，要求小额转账或诱导点击链接。",
        },
        {
          icon: "🔗",
          label: "短信链接型",
          desc: "「妈，帮我保存一下这张照片！」恶意链接安装间谍软件，窃取个人信息和金融信息。",
        },
      ],
    },
    "prosecutor-impersonation": {
      summary: "冒充检察官或侦查机关，以威慑手段诱导受害者将资金转入「安全账户」。",
      psychWeapon: "恐惧·对权威的服从",
      variants: [
        {
          icon: "📞",
          label: "电话施压型",
          desc: "「我是检察官金某某，您的账户涉嫌犯罪。」通过直接通话进行心理施压。",
        },
        {
          icon: "📋",
          label: "伪造文件型",
          desc: "通过电子邮件或传真发送伪造的逮捕令或调查通知书，要求汇款。",
        },
        {
          icon: "🖥️",
          label: "远程控制型",
          desc: "「请安装此应用以确认证据。」获得远程访问权限后直接盗取金融信息。",
        },
      ],
    },
    "romance-scam": {
      summary: "长期积累感情后，制造危机情境索要钱财。",
      psychWeapon: "爱情·同情心",
      variants: [
        {
          icon: "📱",
          label: "社交媒体·交友App型",
          desc: "通过Instagram或交友软件接近，数月内建立亲密感，再以海外突发事故为由索要汇款。",
        },
        {
          icon: "📈",
          label: "恋爱+投资复合型",
          desc: "建立恋人关系后，「分享独家投资秘诀」——将恋爱诈骗与投资诈骗相结合。",
        },
        {
          icon: "📸",
          label: "视频勒索型",
          desc: "培养亲密感后诱导视频通话，录制后以散布威胁索要钱财。",
        },
      ],
    },
    "investment-scam": {
      summary: "以「保本高收益」刺激贪欲，随后阻止提款，骗取资金。",
      psychWeapon: "贪婪·FOMO（害怕错失机会）",
      variants: [
        {
          icon: "💬",
          label: "荐股群诈骗型",
          desc: "在公开聊天室或Telegram中出现虚假专家，安排小额盈利体验，再引导进行大额投资。",
        },
        {
          icon: "📸",
          label: "社交媒体网红型",
          desc: "在Instagram或YouTube投放名人冒充广告：「不买这个币，你会后悔的！」",
        },
        {
          icon: "🏢",
          label: "办公室拜访型",
          desc: "布置逼真的办公室和西装革履的员工，通过线下建立信任后实施大规模诈骗。",
        },
      ],
    },
    "loan-fraud": {
      summary: "以低息或特殊贷款为诱饵，要求提前支付手续费。",
      psychWeapon: "绝望·希望",
      variants: [
        {
          icon: "📞",
          label: "电话营销型",
          desc: "「尊敬的客户，为您推介特别低息贷款。」主动来电，诱导受害者支付前期费用。",
        },
        {
          icon: "📱",
          label: "短信·假App型",
          desc: "「您的贷款已获批准。」→ 安装虚假金融App → 窃取个人信息并盗用身份。",
        },
        {
          icon: "🤝",
          label: "中间经纪人型",
          desc: "「我来帮您对接银行客户经理。」——以经纪费用为由要求预付款，贷款从未真正落实。",
        },
      ],
    },
    "delivery-scam": {
      summary: "冒充快递公司或政府机构发送钓鱼短信，通过恶意链接窃取个人信息和金融信息。",
      psychWeapon: "日常习惯·无意识点击",
      variants: [
        {
          icon: "📦",
          label: "快递运费型",
          desc: "「您有未付运费。」→ 点击链接 → 虚假支付页面窃取银行卡信息。",
        },
        {
          icon: "🏥",
          label: "医疗保险·政府机构型",
          desc: "「查看您的体检结果」或「领取退款通知」——冒充公共机构以提高可信度。",
        },
        {
          icon: "💳",
          label: "银行·信用卡公司型",
          desc: "「检测到异常交易。」——冒充金融机构制造恐慌，诱导受害者泄露个人信息。",
        },
      ],
    },
    "kakaotalk-impersonation": {
      summary: "盗取或冒充熟人的即时通讯账户，从小额请求开始实施诈骗。",
      psychWeapon: "信任（以为是认识的人）",
      variants: [
        {
          icon: "💬",
          label: "账户盗取型",
          desc: "盗取真实熟人账户后：「是我，急用钱。」——使用真实姓名和头像。",
        },
        {
          icon: "🆕",
          label: "新号码冒充型",
          desc: "「我换手机了，这是新号码。」——编造换号理由，阻止受害者核实身份。",
        },
        {
          icon: "👔",
          label: "上司冒充型",
          desc: "「我是组长，正在开会不方便打电话。能先帮我给客户那边打款吗？」",
        },
      ],
    },
    "used-goods-scam": {
      summary: "利用二手交易平台，通过虚假担保支付或预付款诈骗骗取钱财。",
      psychWeapon: "交易习惯·对低价的期待",
      variants: [
        {
          icon: "🔗",
          label: "虚假担保支付型",
          desc: "「我用XXX安全支付吧。」→ 发送外部链接 → 虚假页面窃取银行卡信息。",
        },
        {
          icon: "💸",
          label: "预付款跑路型",
          desc: "「先付款，我马上发货。」——收款后立即失联。最简单直接的手法。",
        },
        {
          icon: "📦",
          label: "假冒·残次品型",
          desc: "发布正品图片，实际发送假货或残次品 → 拒绝退款 → 拉黑屏蔽。",
        },
      ],
    },
    "sympathy-scam": {
      summary: "以悲惨遭遇博取同情后索要钱财。",
      psychWeapon: "同情心·善良",
      variants: [
        {
          icon: "💬",
          label: "社交媒体故事型",
          desc: "在社交媒体发布感人故事并扩散传播，随后请求粉丝向指定账户捐款。",
        },
        {
          icon: "🚶",
          label: "直接接近型",
          desc: "在街头或地铁直接搭讪：「我孩子要做手术没有钱。」——当场索要现金。",
        },
        {
          icon: "☎️",
          label: "电话故事型",
          desc: "「我侄女被绑架了，求求您帮帮我！」——电话中演绎紧迫故事，要求立即转账。",
        },
      ],
    },
    "jeonse-scam": {
      summary: "通过虚假登记信息或一房多租骗取租房押金。",
      psychWeapon: "置业梦想·对低价租房的期待",
      variants: [
        {
          icon: "📄",
          label: "空壳全租型",
          desc: "房产贷款远超房价，加上租房押金——一旦拍卖，租客分文拿不回。",
        },
        {
          icon: "✍️",
          label: "一房多租型",
          desc: "同一房产与多名租客签订合同——收完押金后失踪。",
        },
        {
          icon: "🏢",
          label: "信托未告知型",
          desc: "以所有者身份签订已被信托登记的房产租约——实际所有权另属他人，合同无效。",
        },
      ],
    },
    "deepfake-blackmail": {
      summary: "以散布合成的不雅视频或图片相威胁，敲诈勒索钱财。",
      psychWeapon: "羞耻感·恐惧",
      variants: [
        {
          icon: "🎭",
          label: "深度伪造合成型",
          desc: "利用AI对社交媒体照片进行合成，制作不雅视频，并威胁发送给受害者的联系人或所在单位。",
        },
        {
          icon: "📹",
          label: "视频录制勒索型",
          desc: "诱导受害者进行视频通话，同时播放预录片段——录制受害者画面后实施勒索。",
        },
        {
          icon: "🔓",
          label: "账户盗取型",
          desc: "入侵社交媒体或云存储，盗取私人照片后威胁泄露——无需与受害者预先接触。",
        },
      ],
    },
  },

  ja: {
    "family-impersonation": {
      summary: "家族になりすまして緊迫感をあおり、お金を要求します。",
      psychWeapon: "心配・罪悪感",
      variants: [
        {
          icon: "📞",
          label: "電話なりすまし型",
          desc: "「お母さん、僕だよ。スマホ壊れて新しい番号だよ。」通話で緊迫感を演出し、送金を要求します。",
        },
        {
          icon: "💬",
          label: "メッセンジャーなりすまし型",
          desc: "家族のKakaoTalk・Telegramアカウントを乗っ取り、少額送金を求めたりリンクのクリックを誘導します。",
        },
        {
          icon: "🔗",
          label: "SMSリンク型",
          desc: "「お母さん、この写真保存しておいて！」悪意あるリンクからスパイウェアがインストールされ、個人情報・金融情報が盗まれます。",
        },
      ],
    },
    "prosecutor-impersonation": {
      summary: "捜査機関の権威を悪用して恐怖心を植え付け、「安全口座」へ誘導します。",
      psychWeapon: "恐怖・権威への服従",
      variants: [
        {
          icon: "📞",
          label: "電話圧力型",
          desc: "「検察官の金○○です。あなたの口座が犯罪に使われています。」直接の通話で心理的に追い詰めます。",
        },
        {
          icon: "📋",
          label: "偽造書類型",
          desc: "逮捕状や捜査通知書などの偽造公文書をメールやFAXで送り付け、入金を要求します。",
        },
        {
          icon: "🖥️",
          label: "遠隔操作型",
          desc: "「証拠確認のためアプリをインストールしてください。」遠隔アクセスで金融情報を直接盗み取ります。",
        },
      ],
    },
    "romance-scam": {
      summary: "長期間かけて感情的な絆を築いた後、危機状況を演出してお金を要求します。",
      psychWeapon: "愛情・同情心",
      variants: [
        {
          icon: "📱",
          label: "SNS・マッチングアプリ恋愛型",
          desc: "InstagramやマッチングアプリでアプローチしA数か月かけて親密さを育て、海外での緊急事態を演出して送金を求めます。",
        },
        {
          icon: "📈",
          label: "ロマンス＋投資複合型",
          desc: "恋人関係を築いた後、「私だけが知る投資先を教えてあげる」とロマンス詐欺と投資詐欺を組み合わせます。",
        },
        {
          icon: "📸",
          label: "ビデオ通話脅迫型",
          desc: "親密さを育てたうえでビデオ通話に誘導し、録画した後に拡散をほのめかしてお金を要求します。",
        },
      ],
    },
    "investment-scam": {
      summary: "「元本保証・高利回り」で欲望をあおり、出金を防いで資金を騙し取ります。",
      psychWeapon: "欲·FOMO（機会を逃す恐怖）",
      variants: [
        {
          icon: "💬",
          label: "リーディングルーム詐欺型",
          desc: "オープンチャットやTelegramに偽の専門家が登場し、少額の成功体験を演出してから大きな投資を誘導します。",
        },
        {
          icon: "📸",
          label: "SNSインフルエンサー型",
          desc: "InstagramやYouTubeで有名人を装った広告：「この通貨を今買わないと後悔しますよ。」",
        },
        {
          icon: "🏢",
          label: "事務所訪問型",
          desc: "本物らしいオフィスとスーツ姿のスタッフで対面の信頼を勝ち取り、大規模な詐欺を実行します。",
        },
      ],
    },
    "loan-fraud": {
      summary: "低金利・特別ローンを餌に、手数料を先払いさせます。",
      psychWeapon: "切迫感・希望",
      variants: [
        {
          icon: "📞",
          label: "テレマーケティング型",
          desc: "「お客様限定の特別低金利ローンをご案内します。」こちらから電話をかけて前払いへ誘導します。",
        },
        {
          icon: "📱",
          label: "SMS・偽アプリ型",
          desc: "「ローンが承認されました。」→偽の金融アプリをインストール→個人情報を盗み、なりすましに悪用します。",
        },
        {
          icon: "🤝",
          label: "仲介ブローカー型",
          desc: "「銀行担当者につなぎます。」仲介手数料名目で前払いを求め、ローンは実行されません。",
        },
      ],
    },
    "delivery-scam": {
      summary: "宅配業者や公的機関を装ったフィッシングSMSのリンクから個人情報・金融情報を盗み取ります。",
      psychWeapon: "日常の慣れ・無意識のクリック",
      variants: [
        {
          icon: "📦",
          label: "宅配送料型",
          desc: "「配送料が未払いです。」→リンクをクリック→偽の決済ページでカード情報を盗み取ります。",
        },
        {
          icon: "🏥",
          label: "健康保険・政府機関型",
          desc: "「健康診断の結果をご確認ください」「還付金のご案内」など、公共機関を装って信頼度を高めます。",
        },
        {
          icon: "💳",
          label: "カード会社・銀行なりすまし型",
          desc: "「不正利用が検出されました。」金融機関を装って不安をあおり、個人情報を盗み取ります。",
        },
      ],
    },
    "kakaotalk-impersonation": {
      summary: "知人のメッセンジャーアカウントを乗っ取るかなりすまして、少額から要求します。",
      psychWeapon: "信頼（知っている人という思い込み）",
      variants: [
        {
          icon: "💬",
          label: "アカウント乗っ取り型",
          desc: "実際の知人アカウントを乗っ取り「ね、急いでるんだけど」と本名・プロフィール画像そのままで接触します。",
        },
        {
          icon: "🆕",
          label: "新番号なりすまし型",
          desc: "「スマホ変えたんだ、新しい番号だよ。」番号が変わった理由を作り上げ、元の番号への確認を防ぎます。",
        },
        {
          icon: "👔",
          label: "上司なりすまし型",
          desc: "「チームリーダーだけど、今会議中で電話できないんだ。取引先への振り込み先にお願いできる？」",
        },
      ],
    },
    "used-goods-scam": {
      summary: "フリマアプリを悪用し、偽エスカローサービスや前払い詐欺を仕掛けます。",
      psychWeapon: "取引への慣れ・格安品への期待",
      variants: [
        {
          icon: "🔗",
          label: "偽安全決済型",
          desc: "「○○の安全払いで支払います。」→外部リンクを送付→偽ページでカード情報を盗み取ります。",
        },
        {
          icon: "💸",
          label: "前払い逃げ型",
          desc: "「先に入金してくれたらすぐ発送します。」受取後すぐ音信不通。最もシンプルな手口です。",
        },
        {
          icon: "📦",
          label: "偽物・不良品送付型",
          desc: "正規品の写真を掲載して偽物や不良品を発送→返金を拒否→連絡を遮断します。",
        },
      ],
    },
    "sympathy-scam": {
      summary: "不幸な身の上話で同情心をあおり、金銭を要求します。",
      psychWeapon: "同情心・善意",
      variants: [
        {
          icon: "💬",
          label: "SNS身の上話型",
          desc: "SNSに感動的な話を投稿・拡散させ、口座番号に直接支援を呼びかけます。",
        },
        {
          icon: "🚶",
          label: "直接接触型",
          desc: "路上や地下鉄で直接声をかけ「子どもの手術費が払えないんです。」現場で現金を要求します。",
        },
        {
          icon: "☎️",
          label: "電話身の上話型",
          desc: "「姪が誘拐されました、助けてください！」電話で緊迫した状況を演出し、送金を要求します。",
        },
      ],
    },
    "jeonse-scam": {
      summary: "登記簿の虚偽情報や二重契約で保証金を騙し取ります。",
      psychWeapon: "マイホームへの夢・格安チョンセへの期待",
      variants: [
        {
          icon: "📄",
          label: "オーバーローン型",
          desc: "物件価格を大幅に超えるローン残高に保証金が加わり、競売になっても保証金は一切戻りません。",
        },
        {
          icon: "✍️",
          label: "二重契約型",
          desc: "同一物件で複数の契約者と契約を結び、入金を確認後に姿を消します。",
        },
        {
          icon: "🏢",
          label: "信託未告知型",
          desc: "信託登記された物件を所有者として契約させます。実所有者が別にいるため、契約自体が無効になります。",
        },
      ],
    },
    "deepfake-blackmail": {
      summary: "合成した動画・画像を拡散すると脅してお金を脅し取ります。",
      psychWeapon: "羞恥心・恐怖",
      variants: [
        {
          icon: "🎭",
          label: "ディープフェイク合成型",
          desc: "SNSの写真をAIで合成して性的な動画を作成し、知人や職場に拡散すると脅します。",
        },
        {
          icon: "📹",
          label: "ビデオ通話録画型",
          desc: "ビデオ通話に誘い込んで相手の映像だけ事前録画を再生し、被害者が映った画面を録画して脅します。",
        },
        {
          icon: "🔓",
          label: "アカウント不正アクセス型",
          desc: "SNS・クラウドを不正アクセスして個人写真を盗んだ後、拡散を脅しに使います。事前の接触は不要です。",
        },
      ],
    },
  },

  vi: {
    "family-impersonation": {
      summary: "Kẻ lừa đảo giả danh thành viên gia đình, tạo cảm giác cấp bách rồi đòi tiền.",
      psychWeapon: "Lo lắng · Cảm giác tội lỗi",
      variants: [
        {
          icon: "📞",
          label: "Giả danh qua điện thoại",
          desc: "\"Mẹ ơi, con đây, điện thoại con vỡ rồi, đây là số mới.\" — Tạo áp lực tâm lý qua cuộc gọi trực tiếp rồi yêu cầu chuyển khoản.",
        },
        {
          icon: "💬",
          label: "Giả danh qua tin nhắn",
          desc: "Hack hoặc clone tài khoản KakaoTalk/Telegram của thành viên gia đình, rồi yêu cầu chuyển tiền nhỏ hoặc dụ nhấp vào liên kết.",
        },
        {
          icon: "🔗",
          label: "Liên kết SMS",
          desc: "\"Mẹ lưu ảnh này cho con nhé!\" — Liên kết độc hại cài phần mềm gián điệp, đánh cắp thông tin cá nhân và tài chính.",
        },
      ],
    },
    "prosecutor-impersonation": {
      summary: "Kẻ lừa đảo giả danh cơ quan điều tra để gieo rắc nỗi sợ hãi và dẫn dụ nạn nhân chuyển tiền vào 'tài khoản an toàn'.",
      psychWeapon: "Sợ hãi · Phục tùng quyền lực",
      variants: [
        {
          icon: "📞",
          label: "Gây áp lực qua điện thoại",
          desc: "\"Tôi là kiểm sát viên Nguyễn Văn A, tài khoản của bạn liên quan đến tội phạm.\" — Tạo áp lực tâm lý qua cuộc gọi trực tiếp.",
        },
        {
          icon: "📋",
          label: "Tài liệu giả mạo",
          desc: "Gửi lệnh bắt giữ hoặc thông báo điều tra giả qua email hoặc fax, sau đó yêu cầu nộp tiền.",
        },
        {
          icon: "🖥️",
          label: "Kiểm soát từ xa",
          desc: "\"Hãy cài ứng dụng này để xác minh bằng chứng.\" — Truy cập từ xa và trực tiếp đánh cắp thông tin tài chính.",
        },
      ],
    },
    "romance-scam": {
      summary: "Kẻ lừa đảo xây dựng tình cảm lâu dài, sau đó dàn dựng tình huống khủng hoảng để đòi tiền.",
      psychWeapon: "Tình yêu · Lòng trắc ẩn",
      variants: [
        {
          icon: "📱",
          label: "Tán tỉnh qua mạng xã hội / ứng dụng hẹn hò",
          desc: "Tiếp cận qua Instagram hoặc app hẹn hò, xây dựng sự thân thiết trong nhiều tháng, rồi dàn dựng tình huống khẩn cấp ở nước ngoài để đòi chuyển khoản.",
        },
        {
          icon: "📈",
          label: "Kết hợp lừa tình và đầu tư",
          desc: "Sau khi xây dựng mối quan hệ tình cảm, \"chia sẻ bí quyết đầu tư chỉ mình ta biết\" — kết hợp lừa đảo tình cảm với lừa đảo đầu tư.",
        },
        {
          icon: "📸",
          label: "Tống tiền qua video",
          desc: "Xây dựng thân tình, dụ nạn nhân vào cuộc gọi video, quay lại rồi đe dọa phát tán để đòi tiền.",
        },
      ],
    },
    "investment-scam": {
      summary: "Kẻ lừa đảo kích thích lòng tham bằng lời hứa 'lợi nhuận cao, an toàn vốn', sau đó chặn rút tiền và chiếm đoạt tài sản.",
      psychWeapon: "Lòng tham · FOMO (Sợ bỏ lỡ cơ hội)",
      variants: [
        {
          icon: "💬",
          label: "Nhóm tư vấn đầu tư giả",
          desc: "Chuyên gia giả xuất hiện trong nhóm chat mở hoặc Telegram — dàn dựng chiến thắng nhỏ ban đầu để lấy lòng tin, rồi dụ đầu tư số tiền lớn.",
        },
        {
          icon: "📸",
          label: "Giả danh người nổi tiếng trên mạng",
          desc: "Quảng cáo mạo danh người nổi tiếng trên Instagram hoặc YouTube: \"Không mua đồng coin này bây giờ, bạn sẽ hối hận!\"",
        },
        {
          icon: "🏢",
          label: "Văn phòng giả",
          desc: "Văn phòng hoành tráng, nhân viên ăn mặc lịch sự — xây dựng lòng tin trực tiếp trước khi thực hiện lừa đảo quy mô lớn.",
        },
      ],
    },
    "loan-fraud": {
      summary: "Kẻ lừa đảo dùng lãi suất thấp hoặc khoản vay đặc biệt làm mồi nhử và thu phí trước.",
      psychWeapon: "Tuyệt vọng · Hi vọng",
      variants: [
        {
          icon: "📞",
          label: "Tiếp thị qua điện thoại",
          desc: "\"Kính chào quý khách, chúng tôi có gói vay ưu đãi lãi suất thấp đặc biệt.\" — Chủ động gọi điện để dụ nạn nhân đóng phí trước.",
        },
        {
          icon: "📱",
          label: "SMS / Ứng dụng giả mạo",
          desc: "\"Khoản vay của bạn đã được duyệt.\" → Cài ứng dụng ngân hàng giả → Đánh cắp thông tin cá nhân và mạo danh.",
        },
        {
          icon: "🤝",
          label: "Môi giới trung gian",
          desc: "\"Tôi sẽ kết nối bạn với chuyên viên ngân hàng.\" — Yêu cầu phí môi giới trước, khoản vay không bao giờ được giải ngân.",
        },
      ],
    },
    "delivery-scam": {
      summary: "Tin nhắn lừa đảo giả danh dịch vụ giao hàng hoặc cơ quan chính phủ đánh cắp thông tin cá nhân và tài chính qua liên kết độc hại.",
      psychWeapon: "Thói quen hàng ngày · Nhấp chuột vô thức",
      variants: [
        {
          icon: "📦",
          label: "Phí giao hàng chưa thanh toán",
          desc: "\"Bạn chưa thanh toán phí vận chuyển.\" → Nhấp vào liên kết → Trang thanh toán giả đánh cắp thông tin thẻ.",
        },
        {
          icon: "🏥",
          label: "Bảo hiểm y tế / Cơ quan chính phủ",
          desc: "\"Xem kết quả khám sức khỏe\" hoặc \"Thông báo hoàn tiền\" — mạo danh cơ quan công quyền để tăng độ tin cậy.",
        },
        {
          icon: "💳",
          label: "Giả danh ngân hàng / công ty thẻ",
          desc: "\"Phát hiện giao dịch bất thường.\" — Mạo danh tổ chức tài chính để gây hoảng loạn rồi đánh cắp thông tin.",
        },
      ],
    },
    "kakaotalk-impersonation": {
      summary: "Kẻ lừa đảo hack hoặc giả danh tài khoản tin nhắn của người quen và bắt đầu bằng yêu cầu nhỏ.",
      psychWeapon: "Niềm tin (Tưởng là người quen)",
      variants: [
        {
          icon: "💬",
          label: "Chiếm đoạt tài khoản",
          desc: "Chiếm đoạt tài khoản của người quen thật rồi nhắn: \"Tao đây, cần tiền gấp.\" — Dùng tên thật và ảnh đại diện thật.",
        },
        {
          icon: "🆕",
          label: "Giả danh số mới",
          desc: "\"Mày ơi tao đổi điện thoại rồi, số mới đây.\" — Bịa lý do đổi số để ngăn nạn nhân kiểm tra số cũ.",
        },
        {
          icon: "👔",
          label: "Giả danh cấp trên",
          desc: "\"Anh là trưởng nhóm đây. Anh đang họp không gọi điện được. Em chuyển tiền cho đối tác trước giúp anh được không?\"",
        },
      ],
    },
    "used-goods-scam": {
      summary: "Kẻ lừa đảo lợi dụng sàn mua bán đồ cũ với dịch vụ ký gửi giả hoặc yêu cầu đặt cọc trước rồi biến mất.",
      psychWeapon: "Quen thuộc với giao dịch · Kỳ vọng giá rẻ",
      variants: [
        {
          icon: "🔗",
          label: "Thanh toán an toàn giả",
          desc: "\"Mình dùng thanh toán an toàn nhé.\" → Gửi liên kết ngoài → Trang giả đánh cắp thông tin thẻ.",
        },
        {
          icon: "💸",
          label: "Nhận tiền rồi bỏ trốn",
          desc: "\"Chuyển tiền trước mình gửi hàng ngay.\" — Nhận tiền xong mất liên lạc. Thủ đoạn đơn giản nhất.",
        },
        {
          icon: "📦",
          label: "Gửi hàng giả / hàng lỗi",
          desc: "Đăng ảnh hàng thật nhưng gửi hàng giả hoặc hàng hỏng → Từ chối hoàn tiền → Chặn liên lạc.",
        },
      ],
    },
    "sympathy-scam": {
      summary: "Kẻ lừa đảo bịa đặt hoàn cảnh đáng thương để kích thích lòng trắc ẩn rồi xin tiền.",
      psychWeapon: "Lòng trắc ẩn · Tấm lòng tốt",
      variants: [
        {
          icon: "💬",
          label: "Câu chuyện trên mạng xã hội",
          desc: "Đăng câu chuyện cảm động lên mạng, lan truyền rộng rãi, rồi kêu gọi donate trực tiếp vào tài khoản.",
        },
        {
          icon: "🚶",
          label: "Tiếp cận trực tiếp",
          desc: "Chặn người qua đường hoặc trên tàu điện ngầm: \"Con tôi cần tiền mổ.\" — Đòi tiền mặt ngay tại chỗ.",
        },
        {
          icon: "☎️",
          label: "Câu chuyện qua điện thoại",
          desc: "\"Cháu tôi bị bắt cóc rồi, xin hãy giúp tôi!\" — Dựng tình huống khẩn cấp qua điện thoại rồi đòi chuyển khoản.",
        },
      ],
    },
    "jeonse-scam": {
      summary: "Kẻ lừa đảo chiếm đoạt tiền đặt cọc thuê nhà thông qua thông tin đăng ký giả hoặc hợp đồng kép.",
      psychWeapon: "Mơ ước có nhà · Kỳ vọng thuê rẻ",
      variants: [
        {
          icon: "📄",
          label: "Căn hộ thế chấp quá mức",
          desc: "Khoản vay vượt xa giá trị bất động sản cộng với tiền đặt cọc thuê — khi phát mại, người thuê không lấy lại được xu nào.",
        },
        {
          icon: "✍️",
          label: "Hợp đồng kép",
          desc: "Ký hợp đồng cho thuê cùng một bất động sản với nhiều người — nhận tiền đặt cọc rồi biến mất.",
        },
        {
          icon: "🏢",
          label: "Không tiết lộ đăng ký ủy thác",
          desc: "Ký hợp đồng với bất động sản đã đăng ký ủy thác như thể là chủ sở hữu — hợp đồng vô hiệu vì chủ thực sự là người khác.",
        },
      ],
    },
    "deepfake-blackmail": {
      summary: "Kẻ lừa đảo đe dọa phát tán video hoặc ảnh ghép để tống tiền nạn nhân.",
      psychWeapon: "Xấu hổ · Sợ hãi",
      variants: [
        {
          icon: "🎭",
          label: "Ghép video deepfake",
          desc: "Dùng AI ghép ảnh từ mạng xã hội thành video nhạy cảm, rồi đe dọa gửi cho người quen hoặc nơi làm việc của nạn nhân.",
        },
        {
          icon: "📹",
          label: "Quay lén qua video call",
          desc: "Dụ nạn nhân vào cuộc gọi video trong khi phát clip thu sẵn — quay màn hình nạn nhân rồi tống tiền.",
        },
        {
          icon: "🔓",
          label: "Hack tài khoản",
          desc: "Xâm nhập mạng xã hội hoặc lưu trữ đám mây để đánh cắp ảnh riêng tư rồi đe dọa phát tán — không cần tiếp xúc trước.",
        },
      ],
    },
  },
};

export function getLocalizedScenarioType(
  scenario: string,
  lang: string
): {
  summary: string;
  psychWeapon: string;
  variants: { icon: string; label: string; desc: string; isThis?: boolean }[];
} | null {
  const koreanData = SCENARIO_TYPES[scenario];
  if (!koreanData) return null;

  // Resolve language: supported are ko, en, zh, ja, vi; everything else falls back to en
  const resolvedLang = lang === "ko" ? "ko" : (translations[lang] ? lang : "en");

  if (resolvedLang === "ko") {
    return koreanData;
  }

  const langMap = translations[resolvedLang];
  const localized = langMap?.[scenario];

  if (!localized) {
    // Fall back to English
    const enLocalized = translations["en"]?.[scenario];
    if (!enLocalized) return koreanData;

    return {
      summary: enLocalized.summary,
      psychWeapon: enLocalized.psychWeapon,
      variants: enLocalized.variants.map((v, i) => ({
        ...v,
        isThis: koreanData.variants[i]?.isThis,
      })),
    };
  }

  return {
    summary: localized.summary,
    psychWeapon: localized.psychWeapon,
    variants: localized.variants.map((v, i) => ({
      ...v,
      isThis: koreanData.variants[i]?.isThis,
    })),
  };
}
