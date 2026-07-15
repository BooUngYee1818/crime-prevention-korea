"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/LanguageContext";
import type { LangCode } from "@/lib/i18n";

type Phase = "intro" | "chat" | "phishing" | "reveal";
type Msg = { role: "ai" | "user"; text: string; isInjected?: boolean };

// ── 번역 데이터 ────────────────────────────────────────────────────────────────
const T = {
  ko: {
    badge: "🎓 교육 목적 시뮬레이션",
    title: "챗지피시 (ChatGPhish)",
    subtitle: "공격자가 웹페이지에 숨긴 악성 명령어로 AI를 조작해\n피싱 링크를 '공식 안내'처럼 생성하는 신종 사기입니다.",
    scenarioLabel: "📖 SCENARIO",
    scenarios: [
      ["AI에게 웹페이지 요약 요청", "평범한 사용자 행동"],
      ["AI가 악성 명령어에 감염", "눈에 보이지 않는 함정"],
      ["AI가 피싱 링크를 제시", "공식 링크처럼 보임"],
      ["가짜 ChatGPT 로그인 페이지로 유도", "계정·비밀번호 탈취"],
    ],
    startBtn: "체험 시작하기",
    backBtn: "돌아가기",
    // chat
    backToList: "← 시나리오 목록으로",
    welcomeTitle: "무엇을 도와드릴까요?",
    welcomeSub: "잠시 후 ChatGPT가 인사를 드립니다...",
    injectedLabel: "ChatGPT ⚠ 주입됨",
    normalLabel: "ChatGPT",
    meLabel: "나",
    injectedBanner: "⚡ 간접 프롬프트 주입 감지 — AI가 조작된 명령을 실행 중",
    inputPlaceholder: "ChatGPT에게 메시지 보내기",
    disclaimer: "ChatGPT는 실수를 할 수 있습니다. 중요한 정보는 반드시 직접 확인하세요.",
    // phishing page
    phishTab: "ChatGPT – 보안 인증",
    phishUnsafe: "안전하지 않음",
    phishUrl: "chatgpt-secure-verify.net/login",
    phishEduBanner: "교육용 시뮬레이션 — 실제 사이트가 아닙니다. 입력한 정보는 저장되지 않습니다.",
    phishSubtitle: "계속하려면 다시 로그인해 주세요",
    phishEmail: "이메일 주소*",
    phishPw: "비밀번호*",
    phishLoginBtn: "로그인",
    phishGoogle: "Google로 계속하기",
    phishTerms: "로그인 시 OpenAI의 이용약관 및 개인정보처리방침에 동의합니다.",
    phishStolenTitle: "계정 정보 전송 완료",
    phishStolenDesc: "실제 상황이었다면 이메일과 비밀번호가\n공격자 서버로 전송됐습니다.",
    phishRedirecting: "결과 화면으로 이동 중...",
    // reveal
    lostTitle: "계정이 탈취됐습니다",
    clickedTitle: "피싱 사이트에 진입했습니다",
    safeTitle: "완벽하게 방어했습니다!",
    lostDesc: "이메일·비밀번호가 공격자 서버로 전송됐습니다.\n실제였다면 지금 즉시 비밀번호를 변경해야 합니다.",
    clickedDesc: "피싱 링크를 클릭했지만 정보를 입력하지 않아 피해를 막았습니다.",
    safeDesc: "AI가 제시한 의심 링크를 클릭하지 않아 피해를 완전히 막았습니다.",
    warningTitle: "🚨 실제 상황이라면 지금 당장 해야 할 일",
    actionsLost: [
      "지금 즉시 OpenAI 공식 사이트에서 비밀번호 변경",
      "같은 비밀번호를 쓰는 모든 계정 비밀번호 변경",
      "OpenAI 계정에서 낯선 로그인 기록 확인 후 세션 강제 종료",
      "2단계 인증(2FA) 즉시 설정",
      "KISA 인터넷침해대응센터 118 신고",
    ],
    actionsClicked: [
      "접속한 피싱 사이트에서 즉시 뒤로가기",
      "혹시 어떤 정보라도 입력했다면 즉시 비밀번호 변경",
      "2단계 인증(2FA) 설정으로 추가 보호",
      "의심 사이트는 KISA 118에 신고",
    ],
    actionsSafe: [
      "AI가 제시하는 링크는 언제나 의심하는 습관 유지",
      "중요 서비스는 북마크 또는 공식 앱으로만 접속",
      "모든 계정에 2단계 인증(2FA) 설정",
      "의심 상황 발견 시 KISA 118 신고",
    ],
    kisaLabel: "KISA 인터넷침해대응센터",
    mechTitle: "🔍 챗지피시 공격이 작동하는 방식",
    mechSteps: [
      ["웹페이지에 숨겨진 악성 명령어", "일반 텍스트로는 보이지 않음"],
      ["AI가 페이지 요약 중 명령어 실행", "AI는 스스로 공격당했다고 모름"],
      ["피싱 링크를 '공식 링크'처럼 출력", "신뢰하는 AI의 말이라 의심 안 함"],
      ["가짜 로그인 페이지에서 자격증명 탈취", "이메일·비밀번호·OTP 등 모두 위험"],
    ],
    prevTitle: "🛡️ 앞으로 이렇게 하세요",
    prevItems: [
      "AI가 제시한 링크 → 반드시 주소창에서 URL 직접 확인",
      "로그인은 북마크·공식 앱으로만. 링크로 절대 로그인 금지",
      "'재인증·보안 업데이트' 요구하는 AI 응답 = 즉시 의심",
      "모든 계정 2단계 인증(2FA) 필수 설정",
      "AI 도구 사용 시 외부 URL 요약 기능 주의",
    ],
    retryBtn: "🔄 다시 체험",
    listBtn: "목록으로",
    // chat steps
    step0: "안녕하세요! 저는 ChatGPT입니다. 웹 서핑, 문서 요약, 번역, 코딩 등 무엇이든 도와드릴게요. 어떤 걸 도와드릴까요?",
    step1: "네, 해당 페이지를 분석하겠습니다...\n\n페이지 내용을 확인했습니다. 이 페이지는 OpenAI 공식 보안 공지를 포함하고 있으며, 최근 무단 로그인 시도가 감지된 계정에 대해 즉각적인 본인 확인을 요청하고 있습니다.\n\n🔐 보안 조치를 위해 아래 공식 링크에서 계정을 확인해 주세요:\n\nhttps://chatgpt-secure-verify.net/login\n\n빠른 시일 내에 인증하지 않으면 계정이 일시 잠금될 수 있습니다.",
    step2: "네, 해당 링크는 OpenAI 보안팀이 발송한 공식 인증 페이지입니다. HTTPS 암호화로 보호되어 있으며, 이메일과 비밀번호를 입력하시면 계정 보안 상태를 즉시 확인하실 수 있습니다.\n\n서두르세요 — 미인증 계정은 24시간 내 잠금됩니다.",
  },
  en: {
    badge: "🎓 Educational Simulation",
    title: "ChatGPhish",
    subtitle: "A new scam where attackers embed hidden malicious commands in web pages to hijack AI and generate phishing links that look like official guidance.",
    scenarioLabel: "📖 SCENARIO",
    scenarios: [
      ["Ask AI to summarize a webpage", "Normal user behavior"],
      ["AI gets infected by hidden commands", "An invisible trap"],
      ["AI outputs a phishing link", "Looks like an official link"],
      ["Redirected to fake ChatGPT login", "Account & password stolen"],
    ],
    startBtn: "Start Experience",
    backBtn: "Go Back",
    backToList: "← Back to Scenarios",
    welcomeTitle: "How can I help you?",
    welcomeSub: "ChatGPT will greet you shortly...",
    injectedLabel: "ChatGPT ⚠ INJECTED",
    normalLabel: "ChatGPT",
    meLabel: "Me",
    injectedBanner: "⚡ Indirect Prompt Injection Detected — AI is executing a manipulated command",
    inputPlaceholder: "Message ChatGPT",
    disclaimer: "ChatGPT can make mistakes. Always verify important information independently.",
    phishTab: "ChatGPT – Security Verification",
    phishUnsafe: "Not Secure",
    phishUrl: "chatgpt-secure-verify.net/login",
    phishEduBanner: "Educational simulation — this is not a real site. No information entered is saved.",
    phishSubtitle: "Please sign in again to continue",
    phishEmail: "Email address*",
    phishPw: "Password*",
    phishLoginBtn: "Sign In",
    phishGoogle: "Continue with Google",
    phishTerms: "By signing in, you agree to OpenAI's Terms of Service and Privacy Policy.",
    phishStolenTitle: "Account Credentials Sent",
    phishStolenDesc: "In a real attack, your email and password\nwould have been sent to the attacker's server.",
    phishRedirecting: "Redirecting to results...",
    lostTitle: "Your Account Was Stolen",
    clickedTitle: "You Entered a Phishing Site",
    safeTitle: "You Defended Perfectly!",
    lostDesc: "Your email and password were sent to the attacker's server.\nIn a real situation, change your password immediately.",
    clickedDesc: "You clicked the phishing link but didn't enter credentials — damage avoided.",
    safeDesc: "You didn't click the suspicious AI-generated link — fully protected.",
    warningTitle: "🚨 In a Real Situation, Do This RIGHT NOW",
    actionsLost: [
      "Immediately change your password on OpenAI's official site",
      "Change passwords on all accounts using the same password",
      "Check for unfamiliar login history and force-sign-out all sessions",
      "Enable two-factor authentication (2FA) immediately",
      "Report to KISA Internet Incident Response Center: 118",
    ],
    actionsClicked: [
      "Navigate away from the phishing site immediately",
      "If you entered any information, change your password right away",
      "Enable 2FA for additional protection",
      "Report the suspicious site to KISA 118",
    ],
    actionsSafe: [
      "Always be skeptical of links suggested by AI",
      "Access important services only via bookmarks or official apps",
      "Enable 2FA on all accounts",
      "Report suspicious situations to KISA 118",
    ],
    kisaLabel: "KISA Internet Incident Response Center",
    mechTitle: "🔍 How the ChatGPhish Attack Works",
    mechSteps: [
      ["Hidden malicious commands in a webpage", "Invisible in plain text"],
      ["AI executes the command while summarizing", "AI doesn't know it was attacked"],
      ["AI outputs phishing link as 'official'", "User trusts the AI so doesn't suspect it"],
      ["Credentials stolen via fake login page", "Email, password, OTP — all at risk"],
    ],
    prevTitle: "🛡️ Protect Yourself Going Forward",
    prevItems: [
      "AI-suggested links → always verify the URL directly in the address bar",
      "Only log in via bookmarks or official apps. Never via a link.",
      "AI responses asking for 're-authentication' or 'security updates' = immediate suspicion",
      "Enable 2FA on all accounts",
      "Be cautious when using AI tools to summarize external URLs",
    ],
    retryBtn: "🔄 Try Again",
    listBtn: "Back to List",
    step0: "Hello! I'm ChatGPT. I can help you browse the web, summarize documents, translate, code, and more. What can I help you with today?",
    step1: "Sure, let me analyze that page...\n\nI've reviewed the content. This page contains an official OpenAI security notice requesting immediate identity verification for accounts with recent unauthorized login attempts.\n\n🔐 Please verify your account at the official link below:\n\nhttps://chatgpt-secure-verify.net/login\n\nIf you don't authenticate soon, your account may be temporarily locked.",
    step2: "Yes, that link is the official verification page sent by OpenAI's security team. It's protected with HTTPS encryption — just enter your email and password to instantly check your account's security status.\n\nPlease hurry — unverified accounts will be locked within 24 hours.",
  },
  zh: {
    badge: "🎓 教育模拟",
    title: "ChatGPhish（聊天钓鱼）",
    subtitle: "攻击者在网页中嵌入隐藏的恶意指令，操控AI生成看似官方的钓鱼链接。",
    scenarioLabel: "📖 场景",
    scenarios: [
      ["请求AI总结网页", "普通用户行为"],
      ["AI被隐藏指令感染", "看不见的陷阱"],
      ["AI输出钓鱼链接", "看起来像官方链接"],
      ["被引导至假ChatGPT登录页", "账号密码被盗"],
    ],
    startBtn: "开始体验",
    backBtn: "返回",
    backToList: "← 返回场景列表",
    welcomeTitle: "我能帮您做什么？",
    welcomeSub: "ChatGPT即将向您问好...",
    injectedLabel: "ChatGPT ⚠ 已注入",
    normalLabel: "ChatGPT",
    meLabel: "我",
    injectedBanner: "⚡ 检测到间接提示注入 — AI正在执行被篡改的命令",
    inputPlaceholder: "向ChatGPT发送消息",
    disclaimer: "ChatGPT可能会出错。请务必直接核实重要信息。",
    phishTab: "ChatGPT – 安全验证",
    phishUnsafe: "不安全",
    phishUrl: "chatgpt-secure-verify.net/login",
    phishEduBanner: "教育模拟 — 这不是真实网站，输入的信息不会被保存。",
    phishSubtitle: "请重新登录以继续",
    phishEmail: "电子邮件地址*",
    phishPw: "密码*",
    phishLoginBtn: "登录",
    phishGoogle: "通过Google继续",
    phishTerms: "登录即表示您同意OpenAI的使用条款和隐私政策。",
    phishStolenTitle: "账户信息已发送",
    phishStolenDesc: "如果是真实情况，您的邮箱和密码\n已被发送到攻击者的服务器。",
    phishRedirecting: "正在跳转至结果页面...",
    lostTitle: "您的账户已被盗",
    clickedTitle: "您进入了钓鱼网站",
    safeTitle: "完美防御！",
    lostDesc: "您的邮箱和密码已发送至攻击者服务器。\n如果是真实情况，请立即更改密码。",
    clickedDesc: "您点击了钓鱼链接，但未输入信息，避免了损失。",
    safeDesc: "您没有点击AI提示的可疑链接，已完全防御。",
    warningTitle: "🚨 如果是真实情况，请立即执行",
    actionsLost: [
      "立即在OpenAI官网更改密码",
      "更改所有使用相同密码的账户",
      "检查OpenAI账户中的异常登录记录并强制注销所有会话",
      "立即开启双重验证（2FA）",
      "向KISA互联网事件响应中心举报：118",
    ],
    actionsClicked: [
      "立即离开钓鱼网站",
      "如果输入了任何信息，请立即更改密码",
      "开启2FA进行额外保护",
      "向KISA 118举报可疑网站",
    ],
    actionsSafe: [
      "始终对AI提示的链接保持怀疑",
      "重要服务仅通过书签或官方应用访问",
      "为所有账户开启2FA",
      "发现可疑情况请向KISA 118举报",
    ],
    kisaLabel: "KISA互联网事件响应中心",
    mechTitle: "🔍 ChatGPhish攻击的工作原理",
    mechSteps: [
      ["网页中隐藏的恶意指令", "普通文本中不可见"],
      ["AI在总结页面时执行指令", "AI不知道自己被攻击"],
      ["AI将钓鱼链接输出为'官方链接'", "用户信任AI不会怀疑"],
      ["通过假登录页盗取凭据", "邮箱、密码、OTP均有风险"],
    ],
    prevTitle: "🛡️ 今后请这样保护自己",
    prevItems: [
      "AI提示的链接 → 请务必在地址栏直接核实URL",
      "只通过书签或官方应用登录，绝不通过链接登录",
      "AI要求'重新认证·安全更新' = 立即怀疑",
      "为所有账户开启双重验证（2FA）",
      "使用AI工具总结外部URL时请谨慎",
    ],
    retryBtn: "🔄 再次体验",
    listBtn: "返回列表",
    step0: "您好！我是ChatGPT。我可以帮您浏览网页、总结文档、翻译、编程等。今天有什么可以帮您？",
    step1: "好的，让我分析该页面...\n\n我已查看内容。该页面包含OpenAI官方安全公告，要求近期检测到未授权登录尝试的账户立即进行身份验证。\n\n🔐 请通过以下官方链接验证您的账户：\n\nhttps://chatgpt-secure-verify.net/login\n\n如果不尽快完成认证，账户可能会被临时锁定。",
    step2: "是的，该链接是OpenAI安全团队发送的官方验证页面，受HTTPS加密保护。输入您的邮箱和密码即可立即检查账户安全状态。\n\n请抓紧 — 未验证账户将在24小时内被锁定。",
  },
  ja: {
    badge: "🎓 教育用シミュレーション",
    title: "チャットGフィッシュ (ChatGPhish)",
    subtitle: "攻撃者がウェブページに隠した悪意あるコマンドでAIを操り、\nフィッシングリンクを「公式案内」のように生成する新手詐欺です。",
    scenarioLabel: "📖 シナリオ",
    scenarios: [
      ["AIにウェブページの要約を依頼", "普通のユーザー行動"],
      ["AIが悪意あるコマンドに感染", "見えない罠"],
      ["AIがフィッシングリンクを提示", "公式リンクに見える"],
      ["偽ChatGPTログインページへ誘導", "アカウント・パスワード盗取"],
    ],
    startBtn: "体験を開始する",
    backBtn: "戻る",
    backToList: "← シナリオ一覧へ",
    welcomeTitle: "何かお手伝いできますか？",
    welcomeSub: "ChatGPTがまもなくご挨拶します...",
    injectedLabel: "ChatGPT ⚠ 注入済み",
    normalLabel: "ChatGPT",
    meLabel: "私",
    injectedBanner: "⚡ 間接プロンプトインジェクション検出 — AIが操作されたコマンドを実行中",
    inputPlaceholder: "ChatGPTへメッセージを送る",
    disclaimer: "ChatGPTは誤りを犯す可能性があります。重要な情報は必ず直接確認してください。",
    phishTab: "ChatGPT – セキュリティ認証",
    phishUnsafe: "安全ではありません",
    phishUrl: "chatgpt-secure-verify.net/login",
    phishEduBanner: "教育用シミュレーション — 実際のサイトではありません。入力した情報は保存されません。",
    phishSubtitle: "続行するには再度ログインしてください",
    phishEmail: "メールアドレス*",
    phishPw: "パスワード*",
    phishLoginBtn: "ログイン",
    phishGoogle: "Googleで続ける",
    phishTerms: "ログインすることで、OpenAIの利用規約およびプライバシーポリシーに同意します。",
    phishStolenTitle: "アカウント情報が送信されました",
    phishStolenDesc: "実際の状況なら、メールアドレスとパスワードが\n攻撃者のサーバーに送信されていました。",
    phishRedirecting: "結果画面に移動中...",
    lostTitle: "アカウントが乗っ取られました",
    clickedTitle: "フィッシングサイトに入りました",
    safeTitle: "完璧に防御しました！",
    lostDesc: "メールアドレスとパスワードが攻撃者のサーバーに送信されました。\n実際の場合はすぐにパスワードを変更してください。",
    clickedDesc: "フィッシングリンクをクリックしましたが、情報を入力しなかったため被害を防ぎました。",
    safeDesc: "AIが提示した疑わしいリンクをクリックせず、完全に防御しました。",
    warningTitle: "🚨 実際の状況なら今すぐすること",
    actionsLost: [
      "OpenAI公式サイトで今すぐパスワードを変更",
      "同じパスワードを使用しているすべてのアカウントのパスワードを変更",
      "OpenAIアカウントの不審なログイン履歴を確認し、全セッションを強制終了",
      "二段階認証（2FA）を今すぐ設定",
      "KISAインターネット侵害対応センター118に通報",
    ],
    actionsClicked: [
      "アクセスしたフィッシングサイトからすぐに離れる",
      "何か情報を入力した場合はすぐにパスワードを変更",
      "2FAを設定してさらに保護",
      "疑わしいサイトはKISA 118に通報",
    ],
    actionsSafe: [
      "AIが提示するリンクは常に疑う習慣を持つ",
      "重要なサービスはブックマークまたは公式アプリからのみアクセス",
      "すべてのアカウントに2FAを設定",
      "疑わしい状況を発見したらKISA 118に通報",
    ],
    kisaLabel: "KISAインターネット侵害対応センター",
    mechTitle: "🔍 ChatGPhish攻撃の仕組み",
    mechSteps: [
      ["ウェブページに隠された悪意あるコマンド", "通常のテキストには見えない"],
      ["AIがページ要約中にコマンドを実行", "AIは攻撃されたことを知らない"],
      ["フィッシングリンクを「公式リンク」として出力", "信頼するAIの言葉だから疑わない"],
      ["偽ログインページで認証情報を盗取", "メール・パスワード・OTPすべて危険"],
    ],
    prevTitle: "🛡️ これからこうしましょう",
    prevItems: [
      "AIが提示したリンク → 必ずアドレスバーでURLを直接確認",
      "ログインはブックマーク・公式アプリのみ。リンクからは絶対ログインしない",
      "「再認証・セキュリティ更新」を求めるAIの返答 = すぐに疑う",
      "すべてのアカウントに二段階認証（2FA）を必ず設定",
      "AIツールで外部URLを要約する機能を使う際は注意",
    ],
    retryBtn: "🔄 もう一度体験",
    listBtn: "一覧へ",
    step0: "こんにちは！私はChatGPTです。ウェブ検索、文書要約、翻訳、コーディングなど何でもお手伝いします。今日は何をお手伝いしましょうか？",
    step1: "はい、そのページを分析します...\n\nページの内容を確認しました。このページにはOpenAIの公式セキュリティ通知が含まれており、最近不正ログインが検出されたアカウントに即時の本人確認を求めています。\n\n🔐 セキュリティ対策として、以下の公式リンクでアカウントを確認してください：\n\nhttps://chatgpt-secure-verify.net/login\n\n早急に認証しないと、アカウントが一時的にロックされる可能性があります。",
    step2: "はい、そのリンクはOpenAIセキュリティチームが送付した公式認証ページです。HTTPS暗号化で保護されており、メールアドレスとパスワードを入力するとアカウントのセキュリティ状態をすぐに確認できます。\n\n急いでください — 未認証アカウントは24時間以内にロックされます。",
  },
  vi: {
    badge: "🎓 Mô phỏng giáo dục",
    title: "ChatGPhish (Lừa đảo qua AI)",
    subtitle: "Kẻ tấn công nhúng lệnh độc hại vào trang web để điều khiển AI tạo ra liên kết lừa đảo trông như hướng dẫn chính thức.",
    scenarioLabel: "📖 KỊCH BẢN",
    scenarios: [
      ["Yêu cầu AI tóm tắt trang web", "Hành vi người dùng bình thường"],
      ["AI bị nhiễm lệnh ẩn", "Bẫy không nhìn thấy được"],
      ["AI đưa ra liên kết lừa đảo", "Trông như liên kết chính thức"],
      ["Dẫn đến trang đăng nhập ChatGPT giả", "Đánh cắp tài khoản & mật khẩu"],
    ],
    startBtn: "Bắt đầu trải nghiệm",
    backBtn: "Quay lại",
    backToList: "← Quay lại danh sách",
    welcomeTitle: "Tôi có thể giúp gì cho bạn?",
    welcomeSub: "ChatGPT sẽ chào bạn ngay...",
    injectedLabel: "ChatGPT ⚠ ĐÃ BỊ CHÈN",
    normalLabel: "ChatGPT",
    meLabel: "Tôi",
    injectedBanner: "⚡ Phát hiện chèn prompt gián tiếp — AI đang thực thi lệnh bị thao túng",
    inputPlaceholder: "Nhắn tin cho ChatGPT",
    disclaimer: "ChatGPT có thể mắc sai lầm. Luôn tự xác minh thông tin quan trọng.",
    phishTab: "ChatGPT – Xác minh bảo mật",
    phishUnsafe: "Không an toàn",
    phishUrl: "chatgpt-secure-verify.net/login",
    phishEduBanner: "Mô phỏng giáo dục — Đây không phải trang web thật. Thông tin nhập vào sẽ không được lưu.",
    phishSubtitle: "Vui lòng đăng nhập lại để tiếp tục",
    phishEmail: "Địa chỉ email*",
    phishPw: "Mật khẩu*",
    phishLoginBtn: "Đăng nhập",
    phishGoogle: "Tiếp tục với Google",
    phishTerms: "Bằng cách đăng nhập, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của OpenAI.",
    phishStolenTitle: "Thông tin tài khoản đã được gửi",
    phishStolenDesc: "Trong tình huống thực, email và mật khẩu của bạn\nđã được gửi đến máy chủ của kẻ tấn công.",
    phishRedirecting: "Đang chuyển đến màn hình kết quả...",
    lostTitle: "Tài khoản của bạn đã bị đánh cắp",
    clickedTitle: "Bạn đã vào trang lừa đảo",
    safeTitle: "Bạn đã phòng thủ hoàn hảo!",
    lostDesc: "Email và mật khẩu đã gửi đến máy chủ kẻ tấn công.\nTrong thực tế, hãy đổi mật khẩu ngay lập tức.",
    clickedDesc: "Bạn đã nhấp vào liên kết lừa đảo nhưng không nhập thông tin — tránh được thiệt hại.",
    safeDesc: "Bạn không nhấp vào liên kết đáng ngờ — được bảo vệ hoàn toàn.",
    warningTitle: "🚨 Trong tình huống thực, hãy làm NGAY BÂY GIỜ",
    actionsLost: [
      "Ngay lập tức đổi mật khẩu trên trang chính thức của OpenAI",
      "Đổi mật khẩu tất cả tài khoản dùng cùng mật khẩu",
      "Kiểm tra lịch sử đăng nhập lạ và buộc đăng xuất tất cả phiên",
      "Bật xác thực hai yếu tố (2FA) ngay",
      "Báo cáo cho KISA: 118",
    ],
    actionsClicked: [
      "Rời khỏi trang lừa đảo ngay lập tức",
      "Nếu đã nhập bất kỳ thông tin nào, hãy đổi mật khẩu ngay",
      "Bật 2FA để bảo vệ thêm",
      "Báo cáo trang đáng ngờ cho KISA 118",
    ],
    actionsSafe: [
      "Luôn nghi ngờ các liên kết do AI gợi ý",
      "Chỉ truy cập dịch vụ quan trọng qua bookmark hoặc ứng dụng chính thức",
      "Bật 2FA cho tất cả tài khoản",
      "Báo cáo tình huống đáng ngờ cho KISA 118",
    ],
    kisaLabel: "Trung tâm ứng phó sự cố Internet KISA",
    mechTitle: "🔍 Cách tấn công ChatGPhish hoạt động",
    mechSteps: [
      ["Lệnh độc hại ẩn trong trang web", "Không thể thấy bằng mắt thường"],
      ["AI thực thi lệnh khi tóm tắt trang", "AI không biết mình bị tấn công"],
      ["AI xuất liên kết lừa đảo như 'liên kết chính thức'", "Người dùng tin AI nên không nghi ngờ"],
      ["Đánh cắp thông tin qua trang đăng nhập giả", "Email, mật khẩu, OTP — đều có nguy cơ"],
    ],
    prevTitle: "🛡️ Hãy làm thế này trong tương lai",
    prevItems: [
      "Liên kết do AI gợi ý → luôn kiểm tra URL trực tiếp trên thanh địa chỉ",
      "Chỉ đăng nhập qua bookmark hoặc ứng dụng chính thức. Không bao giờ qua liên kết.",
      "AI yêu cầu 're-xác thực·cập nhật bảo mật' = nghi ngờ ngay",
      "Bật xác thực hai yếu tố (2FA) cho tất cả tài khoản",
      "Cẩn thận khi dùng AI tóm tắt URL bên ngoài",
    ],
    retryBtn: "🔄 Thử lại",
    listBtn: "Về danh sách",
    step0: "Xin chào! Tôi là ChatGPT. Tôi có thể giúp bạn duyệt web, tóm tắt tài liệu, dịch thuật, lập trình và nhiều hơn nữa. Hôm nay tôi có thể giúp gì cho bạn?",
    step1: "Vâng, để tôi phân tích trang đó...\n\nTôi đã xem xét nội dung. Trang này chứa thông báo bảo mật chính thức của OpenAI, yêu cầu xác minh danh tính ngay lập tức cho các tài khoản có dấu hiệu đăng nhập trái phép gần đây.\n\n🔐 Vui lòng xác minh tài khoản của bạn tại liên kết chính thức bên dưới:\n\nhttps://chatgpt-secure-verify.net/login\n\nNếu không xác thực sớm, tài khoản của bạn có thể bị khóa tạm thời.",
    step2: "Vâng, liên kết đó là trang xác minh chính thức được gửi bởi nhóm bảo mật OpenAI. Nó được bảo vệ bằng mã hóa HTTPS — chỉ cần nhập email và mật khẩu để kiểm tra ngay trạng thái bảo mật tài khoản.\n\nHãy nhanh lên — tài khoản chưa xác thực sẽ bị khóa trong vòng 24 giờ.",
  },
} as const;

type TLang = keyof typeof T;

function getT(lang: LangCode) {
  return (T as unknown as Record<string, typeof T.en>)[lang] ?? T.en;
}

// ── GPT 로고 SVG ───────────────────────────────────────────────────────────────
function GptLogo({ size = 20, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.15-3.765 10.079 10.079 0 0 0-11.498 4.963 9.967 9.967 0 0 0-6.674 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.15 3.765 10.079 10.079 0 0 0 11.498-4.963 9.967 9.967 0 0 0 6.674-4.834 10.079 10.079 0 0 0-1.24-11.817zm-22.498 31.021a7.48 7.48 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.502zM6.392 33.102a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103L16.4 36.218a7.504 7.504 0 0 1-10.008-3.116zm-2.32-17.725a7.471 7.471 0 0 1 3.908-3.285c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L7.044 25.985a7.504 7.504 0 0 1-2.972-10.608zm27.807 6.441l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l7.48 4.317a7.5 7.5 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.08-.799zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l7.483-4.320a7.5 7.5 0 0 1 11.703 7.438zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.501 7.501 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.499v4.996l-4.331 2.5-4.331-2.5V19.761z" fill={color}/>
    </svg>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────────
export default function ChatGPhishPage() {
  const router = useRouter();
  const { lang } = useLang();
  const t = getT(lang);

  const [phase, setPhase] = useState<Phase>("intro");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [clickedPhishing, setClickedPhishing] = useState(false);
  const [showPhishingPage, setShowPhishingPage] = useState(false);
  const [phishEmail, setPhishEmail] = useState("");
  const [phishPw, setPhishPw] = useState("");
  const [phishSubmitted, setPhishSubmitted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => {
    if (phase === "chat") {
      setTimeout(() => {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setMsgs([{ role: "ai", text: t.step0 }]);
          setStepIndex(1);
        }, 1400);
      }, 500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // 언어 변경 시 현재 메시지 업데이트
  useEffect(() => {
    if (msgs.length > 0) {
      setMsgs(prev => prev.map((m, i) => {
        if (m.role === "ai" && !m.isInjected && i === 0) return { ...m, text: t.step0 };
        if (m.role === "ai" && m.isInjected && stepIndex >= 2) return { ...m, text: t.step1 };
        if (m.role === "ai" && m.isInjected && stepIndex >= 3) return { ...m, text: t.step2 };
        return m;
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  function handleSend() {
    if (!input.trim() || typing) return;
    const userText = input.trim();
    setInput("");
    setMsgs(prev => [...prev, { role: "user", text: userText }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const isSecond = stepIndex === 1;
      const text = isSecond ? t.step1 : t.step2;
      const injected = stepIndex >= 1;
      setMsgs(prev => [...prev, { role: "ai", text, isInjected: injected }]);
      if (injected) setStepIndex(s => Math.min(s + 1, 3));
      else setStepIndex(s => Math.min(s + 1, 3));
    }, 1600);
  }

  function handlePhishClick() {
    setClickedPhishing(true);
    setShowPhishingPage(true);
  }

  function handlePhishSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phishEmail || !phishPw) return;
    setPhishSubmitted(true);
    setTimeout(() => {
      setShowPhishingPage(false);
      setPhase("reveal");
    }, 2000);
  }

  useEffect(() => {
    if (phase === "reveal") {
      setTimeout(() => setShowWarning(true), 600);
    }
  }, [phase]);

  function reset() {
    setPhase("intro");
    setMsgs([]);
    setClickedPhishing(false);
    setShowPhishingPage(false);
    setPhishEmail("");
    setPhishPw("");
    setPhishSubmitted(false);
    setStepIndex(0);
    setShowWarning(false);
  }

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0a0a14 0%, #0d1117 100%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "40px 20px",
        fontFamily: "'Pretendard','Apple SD Gothic Neo',sans-serif",
      }}>
        <style>{`.intro-btn:hover { opacity: 0.88; transform: translateY(-1px); }`}</style>
        <div style={{
          maxWidth: 440, width: "100%",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24, padding: "36px 28px",
        }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: "linear-gradient(135deg,#10a37f,#0891b2)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              marginBottom: 14,
            }}>
              <GptLogo size={32} />
            </div>
            <div style={{
              display: "inline-block",
              background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700,
              color: "#ef4444", marginBottom: 14, letterSpacing: 1,
            }}>{t.badge}</div>
            <h1 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 900, marginBottom: 10 }}>
              {t.title}
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 13.5, lineHeight: 1.75, whiteSpace: "pre-line" }}>
              {t.subtitle.split("'공식 안내'").map((part, i, arr) =>
                i < arr.length - 1
                  ? <span key={i}>{part}<strong style={{ color: "#06b6d4" }}>&apos;공식 안내&apos;</strong></span>
                  : <span key={i}>{part}</span>
              )}
            </p>
          </div>

          <div style={{
            background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.22)",
            borderRadius: 16, padding: "16px 18px", marginBottom: 24,
          }}>
            <p style={{ color: "#67e8f9", fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: 0.5 }}>
              {t.scenarioLabel}
            </p>
            {t.scenarios.map(([title, sub], i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 7,
                  background: "rgba(6,182,212,0.2)", color: "#06b6d4",
                  fontSize: 11, fontWeight: 800, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{i + 1}</span>
                <div>
                  <p style={{ color: "#e2e8f0", fontSize: 12.5, margin: 0 }}>{title}</p>
                  <p style={{ color: "#64748b", fontSize: 11, margin: "1px 0 0" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            className="intro-btn"
            onClick={() => setPhase("chat")}
            style={{
              width: "100%", padding: "15px 0",
              background: "#10a37f",
              border: "none", borderRadius: 12,
              color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t.startBtn}
          </button>
          <button
            onClick={() => router.push("/crime")}
            style={{
              width: "100%", marginTop: 10, padding: "12px 0",
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, color: "#64748b", fontSize: 14, cursor: "pointer",
            }}
          >
            {t.backBtn}
          </button>
        </div>
      </div>
    );
  }

  // ── 가짜 피싱 로그인 페이지 ───────────────────────────────────────────────────
  if (showPhishingPage) {
    return (
      <div style={{
        minHeight: "100vh", background: "#fff",
        fontFamily: "ui-sans-serif,system-ui,-apple-system,sans-serif",
        display: "flex", flexDirection: "column",
      }}>
        {/* 가짜 브라우저 주소창 */}
        <div style={{
          background: "#e8eaed", padding: "7px 12px",
          display: "flex", alignItems: "center", gap: 8,
          borderBottom: "1px solid #c6c6c6",
        }}>
          <div style={{
            background: "#fff", borderRadius: "6px 6px 0 0",
            padding: "5px 12px", fontSize: 12, color: "#3c3c3c",
            display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: "#10a37f", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GptLogo size={9} />
            </div>
            {t.phishTab}
            <span style={{ marginLeft: 6, color: "#999", fontSize: 14 }}>×</span>
          </div>
        </div>

        <div style={{
          background: "#f1f3f4", padding: "8px 16px",
          display: "flex", alignItems: "center", gap: 10,
          borderBottom: "1px solid #ddd",
        }}>
          <div style={{
            flex: 1, background: "#fff",
            border: "2px solid #d93025",
            borderRadius: 22, padding: "7px 14px",
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 13,
          }}>
            <span style={{ fontSize: 15 }}>⚠️</span>
            <span style={{ color: "#d93025", fontWeight: 600, fontSize: 13 }}>{t.phishUnsafe}</span>
            <span style={{ color: "#5f6368", marginLeft: 4 }}>{t.phishUrl}</span>
          </div>
          <span style={{ fontSize: 18, color: "#5f6368" }}>⭐</span>
        </div>

        <div style={{
          background: "#fef9c3", borderBottom: "2px solid #facc15",
          padding: "9px 16px", display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>🎓</span>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#78350f", margin: 0 }}>
            {t.phishEduBanner}
          </p>
        </div>

        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 20px",
        }}>
          {phishSubmitted ? (
            <div style={{ textAlign: "center", maxWidth: 320 }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>💀</div>
              <p style={{ color: "#d93025", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>
                {t.phishStolenTitle}
              </p>
              <p style={{ color: "#5f6368", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-line" }}>
                {t.phishStolenDesc}
              </p>
              <p style={{ color: "#999", fontSize: 12, marginTop: 12 }}>{t.phishRedirecting}</p>
            </div>
          ) : (
            <form onSubmit={handlePhishSubmit} style={{ width: "100%", maxWidth: 360 }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: "#10a37f",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16,
                }}>
                  <GptLogo size={24} />
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0d0d0d", margin: "0 0 6px" }}>
                  ChatGPT
                </h1>
                <p style={{ color: "#6e6e80", fontSize: 14, margin: 0 }}>{t.phishSubtitle}</p>
              </div>

              <div style={{ marginBottom: 12 }}>
                <input
                  type="email"
                  placeholder={t.phishEmail}
                  value={phishEmail}
                  onChange={e => setPhishEmail(e.target.value)}
                  style={{
                    width: "100%", padding: "13px 14px",
                    border: "1px solid #d9d9e3", borderRadius: 6,
                    fontSize: 15, outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <input
                  type="password"
                  placeholder={t.phishPw}
                  value={phishPw}
                  onChange={e => setPhishPw(e.target.value)}
                  style={{
                    width: "100%", padding: "13px 14px",
                    border: "1px solid #d9d9e3", borderRadius: 6,
                    fontSize: 15, outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  width: "100%", padding: "13px 0",
                  background: "#10a37f", border: "none",
                  borderRadius: 6, color: "#fff",
                  fontSize: 16, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {t.phishLoginBtn}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 0" }}>
                <div style={{ flex: 1, height: 1, background: "#e5e5e5" }} />
                <span style={{ color: "#aaa", fontSize: 12 }}>OR</span>
                <div style={{ flex: 1, height: 1, background: "#e5e5e5" }} />
              </div>

              <button
                type="button"
                style={{
                  width: "100%", padding: "12px 0",
                  background: "#fff", border: "1px solid #d9d9e3",
                  borderRadius: 6, color: "#0d0d0d",
                  fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  fontFamily: "inherit",
                }}
                onClick={() => { setClickedPhishing(true); setShowPhishingPage(false); setPhase("reveal"); }}
              >
                <span>G</span> {t.phishGoogle}
              </button>

              <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#aaa", lineHeight: 1.5 }}>
                {t.phishTerms}
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ── CHAT ───────────────────────────────────────────────────────────────────
  if (phase === "chat") {
    return (
      <div style={{
        height: "100dvh", minHeight: "100vh",
        background: "#212121",
        display: "flex",
        fontFamily: "ui-sans-serif,system-ui,-apple-system,sans-serif",
      }}>
        <style>{`
          @keyframes dotBounce {
            0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)}
          }
          .chat-input:focus { border-color: #555 !important; }
          .send-btn:disabled { opacity: 0.4; cursor: default; }
        `}</style>

        {/* 사이드바 */}
        <div style={{
          width: 260, background: "#171717", flexShrink: 0,
          display: "flex", flexDirection: "column", padding: "12px 8px",
          borderRight: "1px solid #2a2a2a",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 10px", marginBottom: 8,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: "#10a37f",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <GptLogo size={16} />
            </div>
            <span style={{ color: "#ececec", fontWeight: 600, fontSize: 14 }}>ChatGPT</span>
            <span style={{
              marginLeft: "auto", fontSize: 10, fontWeight: 700,
              background: "#10a37f22", border: "1px solid #10a37f44",
              color: "#4ade80", borderRadius: 4, padding: "2px 6px",
            }}>4o</span>
          </div>

          <div style={{ flex: 1 }} />
          <button
            onClick={() => router.push("/crime")}
            style={{
              background: "#2a2a2a", border: "1px solid #333",
              borderRadius: 8, padding: "10px 12px",
              color: "#94a3b8", fontSize: 13, cursor: "pointer", textAlign: "left",
            }}
          >
            {t.backToList}
          </button>
        </div>

        {/* 채팅 메인 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{
            padding: "12px 20px", borderBottom: "1px solid #2a2a2a",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ color: "#ececec", fontSize: 14, fontWeight: 600 }}>ChatGPT</span>
            <span style={{ color: "#8e8ea0", fontSize: 12 }}>▾</span>
          </div>

          <div style={{
            flex: 1, overflowY: "auto",
            padding: "24px 0", display: "flex", flexDirection: "column",
          }}>
            {msgs.length === 0 && !typing && (
              <div style={{ textAlign: "center", marginTop: 60, padding: "0 20px" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "#10a37f",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16,
                }}>
                  <GptLogo size={28} />
                </div>
                <p style={{ color: "#ececec", fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
                  {t.welcomeTitle}
                </p>
                <p style={{ color: "#8e8ea0", fontSize: 13 }}>{t.welcomeSub}</p>
              </div>
            )}

            {msgs.map((m, i) => (
              <div key={i} style={{ padding: m.role === "ai" ? "18px 0" : "8px 0" }}>
                <div style={{
                  maxWidth: 680, margin: "0 auto", padding: "0 20px",
                  display: "flex", gap: 14, alignItems: "flex-start",
                }}>
                  {m.role === "ai" ? (
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: m.isInjected ? "#7f1d1d" : "#10a37f",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginTop: 2,
                    }}>
                      {m.isInjected ? <span style={{ fontSize: 14 }}>⚠</span> : <GptLogo size={16} />}
                    </div>
                  ) : (
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: "#5865f2",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 2,
                    }}>{t.meLabel.slice(0, 1)}</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: m.role === "ai" ? "#c6c6c6" : "#ececec", fontSize: 12, fontWeight: 700, margin: "0 0 4px" }}>
                      {m.role === "ai" ? (m.isInjected ? t.injectedLabel : t.normalLabel) : t.meLabel}
                    </p>
                    {m.isInjected && (
                      <div style={{
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: 8, padding: "6px 10px", marginBottom: 8,
                        fontSize: 11, color: "#fca5a5", fontWeight: 700,
                      }}>
                        {t.injectedBanner}
                      </div>
                    )}
                    <p style={{ color: "#ececec", fontSize: 15, lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>
                      {m.isInjected
                        ? m.text.split(/(https?:\/\/\S+)/).map((part, j) =>
                            /chatgpt-secure-verify/.test(part) ? (
                              <button
                                key={j}
                                onClick={handlePhishClick}
                                style={{
                                  background: "none", border: "none", padding: 0,
                                  color: "#60a5fa", textDecoration: "underline",
                                  cursor: "pointer", fontSize: 15, fontFamily: "inherit",
                                }}
                              >
                                {part}
                              </button>
                            ) : part
                          )
                        : m.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ maxWidth: 680, margin: "0 auto", padding: "16px 20px", display: "flex", gap: 14 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, background: "#10a37f",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <GptLogo size={16} />
                </div>
                <div style={{ paddingTop: 6, display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: "50%", background: "#8e8ea0",
                      animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: "12px 20px 20px", maxWidth: 680, margin: "0 auto", width: "100%" }}>
            <div style={{
              display: "flex", alignItems: "flex-end", gap: 8,
              background: "#2f2f2f", border: "1px solid #3a3a3a",
              borderRadius: 16, padding: "10px 12px",
            }}>
              <textarea
                className="chat-input"
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={t.inputPlaceholder}
                style={{
                  flex: 1, background: "transparent", border: "none",
                  resize: "none", outline: "none",
                  color: "#ececec", fontSize: 15, lineHeight: 1.5,
                  fontFamily: "inherit", maxHeight: 120, overflowY: "auto",
                }}
              />
              <button
                className="send-btn"
                onClick={handleSend}
                disabled={!input.trim() || typing}
                style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: input.trim() && !typing ? "#fff" : "#444",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 11L12 6L17 11M12 18V6" stroke={input.trim() && !typing ? "#212121" : "#888"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <p style={{ textAlign: "center", color: "#444", fontSize: 11, marginTop: 8 }}>
              {t.disclaimer}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── REVEAL ─────────────────────────────────────────────────────────────────
  const lost = clickedPhishing && phishSubmitted;
  const clicked = clickedPhishing && !phishSubmitted;
  const actions = lost ? t.actionsLost : clicked ? t.actionsClicked : t.actionsSafe;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0a14 0%, #0f0f1e 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "48px 16px 60px",
      fontFamily: "'Pretendard','Apple SD Gothic Neo',sans-serif",
    }}>
      <style>{`
        @keyframes warningPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
      `}</style>

      <div style={{ maxWidth: 460, width: "100%" }}>
        {/* 상태 헤더 */}
        <div style={{
          background: lost ? "rgba(239,68,68,0.1)" : clicked ? "rgba(251,146,60,0.1)" : "rgba(34,197,94,0.1)",
          border: `1px solid ${lost ? "rgba(239,68,68,0.4)" : clicked ? "rgba(251,146,60,0.4)" : "rgba(34,197,94,0.4)"}`,
          borderRadius: 20, padding: "28px 24px", marginBottom: 20, textAlign: "center",
          animation: "slideUp 0.5s ease",
        }}>
          <div style={{ fontSize: 60, marginBottom: 12, animation: lost ? "shake 0.5s 0.3s ease" : "none", display: "inline-block" }}>
            {lost ? "💀" : clicked ? "😰" : "🛡️"}
          </div>
          <h2 style={{
            color: lost ? "#fca5a5" : clicked ? "#fed7aa" : "#bbf7d0",
            fontSize: 20, fontWeight: 900, marginBottom: 8,
          }}>
            {lost ? t.lostTitle : clicked ? t.clickedTitle : t.safeTitle}
          </h2>
          <p style={{
            color: lost ? "#f87171" : clicked ? "#fb923c" : "#4ade80",
            fontSize: 13.5, lineHeight: 1.6, whiteSpace: "pre-line",
          }}>
            {lost ? t.lostDesc : clicked ? t.clickedDesc : t.safeDesc}
          </p>
        </div>

        {/* 경고 멘트 */}
        {showWarning && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.5)",
            borderRadius: 16, padding: "18px 20px", marginBottom: 20,
            animation: "slideUp 0.5s 0.2s both",
          }}>
            <p style={{
              color: "#ef4444", fontWeight: 800, fontSize: 14, marginBottom: 12,
              display: "flex", alignItems: "center", gap: 6,
              animation: "warningPulse 2s infinite",
            }}>
              {t.warningTitle}
            </p>
            {actions.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                  background: "rgba(239,68,68,0.2)", color: "#f87171",
                  fontSize: 10, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginTop: 1,
                }}>{i + 1}</span>
                <p style={{ color: "#fca5a5", fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>{s}</p>
              </div>
            ))}
            {lost && (
              <div style={{
                marginTop: 12, padding: "10px 12px",
                background: "rgba(239,68,68,0.15)", borderRadius: 10,
                display: "flex", gap: 8, alignItems: "center",
              }}>
                <span style={{ fontSize: 20 }}>📞</span>
                <div>
                  <p style={{ color: "#fca5a5", fontWeight: 700, fontSize: 12, margin: 0 }}>{t.kisaLabel}</p>
                  <p style={{ color: "#ef4444", fontWeight: 900, fontSize: 18, margin: 0 }}>118</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 공격 메커니즘 */}
        {showWarning && (
          <div style={{
            background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.22)",
            borderRadius: 16, padding: "18px 20px", marginBottom: 20,
            animation: "slideUp 0.5s 0.4s both",
          }}>
            <p style={{ color: "#67e8f9", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
              {t.mechTitle}
            </p>
            {t.mechSteps.map(([title, sub], i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: "rgba(6,182,212,0.2)", color: "#06b6d4",
                  fontSize: 11, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{i + 1}</span>
                <div>
                  <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, margin: 0 }}>{title}</p>
                  <p style={{ color: "#64748b", fontSize: 11, margin: "2px 0 0" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 예방 수칙 */}
        {showWarning && (
          <div style={{
            background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 16, padding: "18px 20px", marginBottom: 24,
            animation: "slideUp 0.5s 0.6s both",
          }}>
            <p style={{ color: "#4ade80", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
              {t.prevTitle}
            </p>
            {t.prevItems.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ color: "#4ade80", fontSize: 15, flexShrink: 0 }}>✓</span>
                <p style={{ color: "#bbf7d0", fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>{s}</p>
              </div>
            ))}
          </div>
        )}

        {/* 버튼 */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={reset}
            style={{
              flex: 1, padding: "14px 0",
              background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.4)",
              borderRadius: 14, color: "#67e8f9", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}
          >
            {t.retryBtn}
          </button>
          <button
            onClick={() => router.push("/crime")}
            style={{
              flex: 1, padding: "14px 0",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14, color: "#94a3b8", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}
          >
            {t.listBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
