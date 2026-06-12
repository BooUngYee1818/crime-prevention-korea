export const LANGUAGES = [
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
] as const;

export type LangCode = typeof LANGUAGES[number]["code"];

export const T = {
  // ── NAV ──────────────────────────────────────────────────────────
  nav_scenarios: { ko: "시나리오", en: "Scenarios", ja: "シナリオ", zh: "场景", vi: "Kịch bản", es: "Escenarios" },
  nav_howto:     { ko: "이용방법", en: "How to Use", ja: "使い方", zh: "使用方法", vi: "Hướng dẫn", es: "Cómo usar" },
  nav_numbers:   { ko: "신고번호", en: "Report Numbers", ja: "通報番号", zh: "举报电话", vi: "Số báo cáo", es: "Números de denuncia" },
  nav_stats:     { ko: "📊범죄통계", en: "📊Crime Stats", ja: "📊犯罪統計", zh: "📊犯罪统计", vi: "📊Thống kê tội phạm", es: "📊Estadísticas" },
  nav_partner:   { ko: "🏛️기관도입", en: "🏛️Partnerships", ja: "🏛️機関導入", zh: "🏛️机构合作", vi: "🏛️Hợp tác", es: "🏛️Alianzas" },
  nav_start:     { ko: "체험시작", en: "Start", ja: "体験開始", zh: "开始体验", vi: "Bắt đầu", es: "Comenzar" },

  // ── HERO ─────────────────────────────────────────────────────────
  hero_badge:    { ko: "대한민국 No.1 범죄예방 교육 플랫폼", en: "Korea's #1 Crime Prevention Education Platform", ja: "韓国No.1犯罪予防教育プラットフォーム", zh: "韩国第一犯罪预防教育平台", vi: "Nền tảng giáo dục phòng chống tội phạm số 1 Hàn Quốc", es: "Plataforma #1 de Educación para Prevención del Crimen en Corea" },
  hero_title1:   { ko: "당신도", en: "You Could Be", ja: "あなたも", zh: "你也可能", vi: "Bạn cũng có thể", es: "Tú también podrías" },
  hero_title2:   { ko: "속을 수 있습니다", en: "a Victim", ja: "騙される可能性があります", zh: "成为受害者", vi: "trở thành nạn nhân", es: "ser una víctima" },
  hero_subtitle: { ko: "실제 범죄 수법을 직접 체험하고, 당하기 전에 먼저 알아두세요.", en: "Experience real crime tactics firsthand — before you become a victim.", ja: "実際の犯罪手口を体験し、被害に遭う前に知っておきましょう。", zh: "亲身体验真实犯罪手法，在受害之前先了解。", vi: "Trải nghiệm thực tế các chiêu lừa đảo — trước khi bạn trở thành nạn nhân.", es: "Experimenta tácticas reales de crimen — antes de convertirte en víctima." },
  hero_cta:      { ko: "무료 체험 시작하기", en: "Start Free Experience", ja: "無料体験を始める", zh: "开始免费体验", vi: "Bắt đầu trải nghiệm miễn phí", es: "Comenzar experiencia gratuita" },
  hero_report:   { ko: "피해신고 안내", en: "Report a Crime", ja: "被害通報案内", zh: "受害举报指南", vi: "Hướng dẫn báo cáo", es: "Guía de denuncia" },

  // ── STATS SECTION ─────────────────────────────────────────────────
  stats_title:   { ko: "왜 이 프로그램인가", en: "Why This Program?", ja: "なぜこのプログラムか", zh: "为什么需要这个项目", vi: "Tại sao cần chương trình này?", es: "¿Por qué este programa?" },
  stats_sub:     { ko: "대한민국 공식 범죄 통계 기반", en: "Based on Official Korean Crime Statistics", ja: "大韓民国公式犯罪統計に基づく", zh: "基于韩国官方犯罪统计", vi: "Dựa trên thống kê tội phạm chính thức của Hàn Quốc", es: "Basado en estadísticas oficiales de crimen de Corea" },

  // ── SCENARIOS ────────────────────────────────────────────────────
  scenario_voice:    { ko: "보이스피싱", en: "Voice Phishing", ja: "ボイスフィッシング", zh: "电话诈骗", vi: "Lừa đảo qua điện thoại", es: "Phishing telefónico" },
  scenario_smishing: { ko: "스미싱", en: "Smishing", ja: "スミッシング", zh: "短信诈骗", vi: "Lừa đảo qua tin nhắn", es: "Smishing" },
  scenario_invest:   { ko: "투자사기", en: "Investment Fraud", ja: "投資詐欺", zh: "投资诈骗", vi: "Lừa đảo đầu tư", es: "Fraude de inversión" },
  scenario_romance:  { ko: "로맨스스캠", en: "Romance Scam", ja: "ロマンス詐欺", zh: "网恋诈骗", vi: "Lừa đảo tình cảm", es: "Estafa romántica" },
  scenario_gamble:   { ko: "불법도박", en: "Illegal Gambling", ja: "違法賭博", zh: "非法赌博", vi: "Cờ bạc bất hợp pháp", es: "Juego ilegal" },
  scenario_used:     { ko: "중고거래 사기", en: "Used-goods Scam", ja: "中古取引詐欺", zh: "二手交易诈骗", vi: "Lừa đảo mua bán đồ cũ", es: "Estafa de artículos usados" },

  // ── BUTTONS ───────────────────────────────────────────────────────
  btn_experience:  { ko: "체험하기", en: "Experience", ja: "体験する", zh: "开始体验", vi: "Trải nghiệm", es: "Experimentar" },
  btn_back:        { ko: "← 메인으로", en: "← Back to Main", ja: "← メインへ", zh: "← 返回主页", vi: "← Về trang chính", es: "← Volver al inicio" },
  btn_report_now:  { ko: "지금 신고하기", en: "Report Now", ja: "今すぐ通報する", zh: "立即举报", vi: "Báo cáo ngay", es: "Denunciar ahora" },
  btn_start_exp:   { ko: "체험 시작하기", en: "Start Experience", ja: "体験を始める", zh: "开始体验", vi: "Bắt đầu trải nghiệm", es: "Iniciar experiencia" },
  btn_guide_use:   { ko: "이용 가이드 보기", en: "View Guide", ja: "利用ガイドを見る", zh: "查看使用指南", vi: "Xem hướng dẫn", es: "Ver guía" },
  btn_close:       { ko: "닫기", en: "Close", ja: "閉じる", zh: "关闭", vi: "Đóng", es: "Cerrar" },

  // ── POPUP 1 ───────────────────────────────────────────────────────
  popup1_title:  { ko: "범죄예방 체험관에 오신 걸 환영합니다", en: "Welcome to the Crime Prevention Center", ja: "犯罪予防体験館へようこそ", zh: "欢迎来到犯罪预防体验馆", vi: "Chào mừng đến Trung tâm Phòng chống Tội phạm", es: "Bienvenido al Centro de Prevención del Crimen" },
  popup1_sub:    { ko: "대한민국 모든 시민을 위한 무료 교육 프로그램", en: "Free education program for everyone", ja: "すべての市民のための無料教育プログラム", zh: "面向所有市民的免费教育项目", vi: "Chương trình giáo dục miễn phí cho mọi người", es: "Programa educativo gratuito para todos" },
  popup1_body1:  { ko: "이 프로그램은 범죄를 미리 예방하고, 어린이부터 어르신까지 누구나 이용 가능한 범죄 예방 교육 프로그램입니다.", en: "This program helps prevent crime through education, available for everyone from children to seniors.", ja: "このプログラムは犯罪を事前に予防し、子供から高齢者まで誰でも利用できる犯罪予防教育プログラムです。", zh: "本程序旨在预防犯罪，是面向儿童到老年人所有人群的犯罪预防教育项目。", vi: "Chương trình này giúp phòng ngừa tội phạm thông qua giáo dục, dành cho mọi lứa tuổi từ trẻ em đến người cao tuổi.", es: "Este programa ayuda a prevenir el crimen mediante la educación, disponible para todos desde niños hasta adultos mayores." },
  popup1_body2:  { ko: "혹시 이미 피해를 당하셨거나, 2차 피해가 걱정되어 오셨나요? 어디에 신고해야 할지 막막하신 분들은 아래 버튼을 눌러주세요.", en: "Already a victim or worried about further harm? Not sure where to report? Click below.", ja: "すでに被害を受けた方、または二次被害が心配な方は、下のボタンをクリックしてください。", zh: "已经遭受损失，或担心二次伤害？不知道去哪里举报？请点击下方按钮。", vi: "Đã là nạn nhân hoặc lo lắng về thiệt hại thêm? Không biết báo cáo ở đâu? Nhấp vào bên dưới.", es: "¿Ya eres víctima o te preocupa sufrir más daños? ¿No sabes dónde denunciar? Haz clic abajo." },
  popup1_report: { ko: "신고 방법 알아보기", en: "Find Reporting Methods", ja: "通報方法を調べる", zh: "了解举报方法", vi: "Tìm hiểu cách báo cáo", es: "Ver métodos de denuncia" },

  // ── POPUP 2 ───────────────────────────────────────────────────────
  popup2_title:  { ko: "이용 가이드", en: "Usage Guide", ja: "利用ガイド", zh: "使用指南", vi: "Hướng dẫn sử dụng", es: "Guía de uso" },
  popup2_tab1:   { ko: "부모님용", en: "For Parents", ja: "保護者向け", zh: "家长版", vi: "Dành cho phụ huynh", es: "Para padres" },
  popup2_tab2:   { ko: "자녀교육용", en: "For Children", ja: "子ども教育用", zh: "儿童教育版", vi: "Dành cho trẻ em", es: "Para niños" },
  popup2_tab3:   { ko: "교육기관용", en: "For Institutions", ja: "教育機関用", zh: "教育机构版", vi: "Dành cho cơ sở giáo dục", es: "Para instituciones" },

  // ── REPORT PAGE ───────────────────────────────────────────────────
  report_title:     { ko: "2차 피해 예방 · 신고 안내", en: "Reporting Guide & Victim Support", ja: "二次被害防止・通報案内", zh: "举报指南与受害者支持", vi: "Hướng dẫn báo cáo & hỗ trợ nạn nhân", es: "Guía de denuncia y apoyo a víctimas" },
  report_emergency: { ko: "이미 피해를 당하셨나요? 지금 당장 신고하세요.", en: "Already a victim? Report immediately.", ja: "すでに被害を受けましたか？今すぐ通報してください。", zh: "已经受害了吗？立即举报。", vi: "Đã là nạn nhân? Hãy báo cáo ngay.", es: "¿Ya eres víctima? Denuncia de inmediato." },
  report_faster:    { ko: "신고가 빠를수록 계좌 지급정지로 피해금 환급 가능성이 높아집니다.", en: "The faster you report, the higher the chance of recovering your money.", ja: "早く通報するほど、口座凍結により被害金の回収可能性が高まります。", zh: "举报越快，通过账户冻结追回损失的可能性越高。", vi: "Báo cáo càng nhanh, cơ hội thu hồi tiền càng cao.", es: "Cuanto más rápido denuncies, mayor será la posibilidad de recuperar tu dinero." },
  report_not_fault: { ko: "범죄 피해는 당신의 잘못이 아닙니다.", en: "Being a victim is not your fault.", ja: "犯罪被害はあなたのせいではありません。", zh: "成为受害者不是你的错。", vi: "Trở thành nạn nhân không phải lỗi của bạn.", es: "Ser víctima no es tu culpa." },
  report_alone:     { ko: "혼자 감당하지 않아도 됩니다", en: "You don't have to face this alone", ja: "一人で抱え込まなくてもいい", zh: "你不必独自承受", vi: "Bạn không phải đối mặt một mình", es: "No tienes que enfrentarlo solo" },

  // ── PRIVACY PAGE ──────────────────────────────────────────────────
  privacy_title:    { ko: "개인정보처리방침 · 이용약관 · 면책조항", en: "Privacy Policy · Terms · Disclaimer", ja: "プライバシーポリシー・利用規約・免責事項", zh: "隐私政策·服务条款·免责声明", vi: "Chính sách bảo mật · Điều khoản · Miễn trách", es: "Política de privacidad · Términos · Descargo" },
  privacy_summary:  { ko: "한 줄 요약", en: "Summary", ja: "一言要約", zh: "一句话总结", vi: "Tóm tắt", es: "Resumen" },
  privacy_no_collect: { ko: "어떠한 개인 신상정보도 수집하거나 저장하지 않습니다.", en: "We do not collect or store any personal information.", ja: "いかなる個人情報も収集・保存しません。", zh: "我们不收集或存储任何个人信息。", vi: "Chúng tôi không thu thập hoặc lưu trữ bất kỳ thông tin cá nhân nào.", es: "No recopilamos ni almacenamos ninguna información personal." },

  // ── PARTNERSHIP PAGE ──────────────────────────────────────────────
  partner_title:   { ko: "기관 도입 안내", en: "Institutional Partnership", ja: "機関導入案内", zh: "机构合作指南", vi: "Hướng dẫn hợp tác tổ chức", es: "Guía de alianzas institucionales" },
  partner_sub:     { ko: "학교·경찰청·교육청·복지관을 위한 범죄예방 교육 솔루션", en: "Crime prevention education solution for schools, police & welfare centers", ja: "学校・警察署・教育委員会・福祉館のための犯罪予防教育ソリューション", zh: "面向学校、警察局、教育局、福利中心的犯罪预防教育解决方案", vi: "Giải pháp giáo dục phòng chống tội phạm cho trường học, cảnh sát và trung tâm phúc lợi", es: "Solución educativa de prevención del crimen para escuelas, policía y centros de bienestar" },
  partner_contact: { ko: "도입 문의", en: "Contact for Partnership", ja: "導入のお問い合わせ", zh: "合作咨询", vi: "Liên hệ hợp tác", es: "Contacto para alianzas" },

  // ── STATS PAGE ────────────────────────────────────────────────────
  stats_page_title: { ko: "대한민국 범죄 통계", en: "Korea Crime Statistics", ja: "韓国犯罪統計", zh: "韩国犯罪统计", vi: "Thống kê tội phạm Hàn Quốc", es: "Estadísticas del crimen en Corea" },
  stats_page_sub:   { ko: "경찰청·금감원·통계청 공식 자료 기반", en: "Based on official data from the National Police Agency, FSS & Statistics Korea", ja: "警察庁・金融監督院・統計庁公式資料に基づく", zh: "基于国家警察厅、金融监督院、统计厅官方资料", vi: "Dựa trên dữ liệu chính thức từ Cơ quan Cảnh sát Quốc gia, FSS & Thống kê Hàn Quốc", es: "Basado en datos oficiales de la Agencia Nacional de Policía, FSS y Estadísticas de Corea" },

  // ── FOOTER ────────────────────────────────────────────────────────
  footer_privacy:  { ko: "개인정보처리방침", en: "Privacy Policy", ja: "プライバシーポリシー", zh: "隐私政策", vi: "Chính sách bảo mật", es: "Política de privacidad" },
  footer_terms:    { ko: "이용약관", en: "Terms of Use", ja: "利用規約", zh: "服务条款", vi: "Điều khoản sử dụng", es: "Términos de uso" },
  footer_report:   { ko: "피해신고안내", en: "Report Crime", ja: "被害通報案内", zh: "受害举报", vi: "Báo cáo tội phạm", es: "Denunciar crimen" },
  footer_contact:  { ko: "기관 문의", en: "Contact", ja: "お問い合わせ", zh: "联系我们", vi: "Liên hệ", es: "Contacto" },
  footer_rights:   { ko: "All rights reserved.", en: "All rights reserved.", ja: "All rights reserved.", zh: "版权所有。", vi: "Bảo lưu mọi quyền.", es: "Todos los derechos reservados." },
  footer_edu:      { ko: "교육 목적으로만 사용되며, 실제 범죄 행위를 조장하지 않습니다.", en: "For educational purposes only. Does not promote criminal activity.", ja: "教育目的のみで使用。犯罪行為を助長しません。", zh: "仅供教育目的，不宣扬犯罪行为。", vi: "Chỉ dành cho mục đích giáo dục. Không khuyến khích hành vi tội phạm.", es: "Solo con fines educativos. No promueve actividades criminales." },

  // ── RAINBOW BUTTON ────────────────────────────────────────────────
  rainbow_btn:     { ko: "피해신고\n안내", en: "Report\nCrime", ja: "被害\n通報", zh: "举报\n犯罪", vi: "Báo\ncáo", es: "Denun\nciar" },

  // ── GENERAL ───────────────────────────────────────────────────────
  free_badge:      { ko: "무료", en: "FREE", ja: "無料", zh: "免费", vi: "Miễn phí", es: "GRATIS" },
  warning:         { ko: "⚠️ 주의", en: "⚠️ Warning", ja: "⚠️ 注意", zh: "⚠️ 注意", vi: "⚠️ Cảnh báo", es: "⚠️ Advertencia" },
  source:          { ko: "출처", en: "Source", ja: "出典", zh: "来源", vi: "Nguồn", es: "Fuente" },

  // ── CRIME CENTER PAGE ─────────────────────────────────────────────
  crime_center_title:   { ko: "범죄 예방 센터", en: "Crime Prevention Center", ja: "犯罪予防センター", zh: "犯罪预防中心", vi: "Trung tâm Phòng chống Tội phạm", es: "Centro de Prevención del Crimen" },
  crime_free_badge:     { ko: "이 프로그램은 완전 무료입니다", en: "This program is completely free", ja: "このプログラムは完全無料です", zh: "本项目完全免费", vi: "Chương trình này hoàn toàn miễn phí", es: "Este programa es completamente gratuito" },
  crime_free_desc:      { ko: "실제처럼 체험하고 범죄 수법을 미리 알아두세요. 실제 돈은 절대 나가지 않습니다.", en: "Experience real crime tactics — no real money involved, ever.", ja: "実際のように体験し、犯罪手口を事前に知りましょう。実際のお金は一切出ません。", zh: "体验真实犯罪手法——绝不涉及真实金钱。", vi: "Trải nghiệm như thật — không có tiền thật nào liên quan.", es: "Experimenta tácticas reales — nunca se involucra dinero real." },
  crime_select_hint:    { ko: "체험할 시나리오를 선택하세요", en: "Select a scenario to experience", ja: "体験するシナリオを選択してください", zh: "请选择要体验的场景", vi: "Chọn kịch bản để trải nghiệm", es: "Selecciona un escenario" },
  crime_select_title:   { ko: "9가지 범죄 시나리오", en: "9 Crime Scenarios", ja: "9つの犯罪シナリオ", zh: "9种犯罪场景", vi: "9 Kịch bản Tội phạm", es: "9 Escenarios de Crimen" },
  crime_report_title:   { ko: "피해 신고 및 상담", en: "Report & Consultation", ja: "被害通報・相談", zh: "举报与咨询", vi: "Báo cáo & Tư vấn", es: "Denuncia y Consulta" },
  senior_warning:       { ko: "⚠️ 어르신 주의", en: "⚠️ Senior Alert", ja: "⚠️ 高齢者注意", zh: "⚠️ 老年人注意", vi: "⚠️ Cảnh báo người cao tuổi", es: "⚠️ Alerta para mayores" },

  // ── SCENARIO TITLES ───────────────────────────────────────────────
  sc_family_title:      { ko: "가족 사칭 보이스피싱", en: "Family Impersonation", ja: "家族詐称詐欺", zh: "冒充家人诈骗", vi: "Giả mạo gia đình", es: "Suplantación familiar" },
  sc_family_sub:        { ko: "자녀가 급하게 돈을 요구해요", en: "Someone claims to be your child needing money", ja: "子供を装って急にお金を要求", zh: "冒充子女紧急要钱", vi: "Người nào đó giả là con bạn cần tiền", es: "Alguien finge ser tu hijo pidiendo dinero" },
  sc_prosecutor_title:  { ko: "검찰·경찰 사칭", en: "Prosecutor Impersonation", ja: "検察・警察詐称", zh: "冒充检察官/警察", vi: "Giả mạo công tố viên", es: "Suplantación de fiscal" },
  sc_prosecutor_sub:    { ko: "내 계좌가 범죄에 연루됐다고 해요", en: "They say your account is linked to a crime", ja: "あなたの口座が犯罪に関与していると言われる", zh: "称您的账户涉及犯罪", vi: "Họ nói tài khoản bạn liên quan đến tội phạm", es: "Dicen que tu cuenta está vinculada a un crimen" },
  sc_romance_title:     { ko: "로맨스 스캠", en: "Romance Scam", ja: "ロマンス詐欺", zh: "网恋诈骗", vi: "Lừa đảo tình cảm", es: "Estafa romántica" },
  sc_romance_sub:       { ko: "온라인 연인이 돈을 빌려달라고 해요", en: "An online lover asks to borrow money", ja: "オンラインの恋人がお金を借りようとする", zh: "网络恋人要求借钱", vi: "Người yêu online xin mượn tiền", es: "Un amor online pide dinero prestado" },
  sc_invest_title:      { ko: "투자 사기 (코인·주식)", en: "Investment Fraud", ja: "投資詐欺", zh: "投资诈骗", vi: "Lừa đảo đầu tư", es: "Fraude de inversión" },
  sc_invest_sub:        { ko: "확실한 수익 보장 투자처를 알고 있대요", en: "They claim to know a guaranteed investment", ja: "確実な収益が保証された投資先を知っていると言う", zh: "声称知道有保证收益的投资渠道", vi: "Họ tuyên bố biết kênh đầu tư đảm bảo lợi nhuận", es: "Dicen conocer una inversión con ganancias garantizadas" },
  sc_loan_title:        { ko: "대출 빙자 사기", en: "Loan Fraud", ja: "融資詐欺", zh: "贷款诈骗", vi: "Lừa đảo vay vốn", es: "Fraude de préstamo" },
  sc_loan_sub:          { ko: "저금리 대출을 해준다고 연락이 왔어요", en: "They offer a low-interest loan out of nowhere", ja: "低金利ローンを提供すると連絡が来た", zh: "突然联系称可提供低息贷款", vi: "Họ liên hệ đề nghị cho vay lãi suất thấp", es: "Ofrecen un préstamo de bajo interés de la nada" },
  sc_delivery_title:    { ko: "택배 스미싱", en: "Delivery Smishing", ja: "宅配スミッシング", zh: "快递短信诈骗", vi: "Tin nhắn giả giao hàng", es: "Smishing de entrega" },
  sc_delivery_sub:      { ko: "택배 주소 오류로 개인정보를 요구해요", en: "They request personal info due to delivery address error", ja: "配達先住所エラーで個人情報を要求", zh: "以配送地址错误为由索取个人信息", vi: "Họ yêu cầu thông tin cá nhân vì lỗi địa chỉ giao hàng", es: "Piden información personal por error en dirección de entrega" },
  sc_kakao_title:       { ko: "카카오톡 지인 사칭", en: "KakaoTalk Impersonation", ja: "カカオトーク知人詐称", zh: "冒充KakaoTalk联系人", vi: "Giả mạo KakaoTalk", es: "Suplantación en KakaoTalk" },
  sc_kakao_sub:         { ko: "친구인 척 급하게 돈을 빌려달라고 해요", en: "Someone pretends to be your friend needing money urgently", ja: "友人を装って急にお金を借りようとする", zh: "冒充朋友紧急借钱", vi: "Ai đó giả làm bạn bè xin mượn tiền gấp", es: "Alguien finge ser tu amigo pidiendo dinero urgente" },
  sc_used_title:        { ko: "중고거래 사기", en: "Used Goods Scam", ja: "中古品取引詐欺", zh: "二手交易诈骗", vi: "Lừa đảo hàng cũ", es: "Estafa de artículos usados" },
  sc_used_sub:          { ko: "싸게 판다고 해서 입금했는데 잠수탔어요", en: "Paid for a cheap item, seller disappeared", ja: "安く売るというので入金したが逃げられた", zh: "付款后卖家消失了", vi: "Đã thanh toán xong thì người bán mất tích", es: "Pagué por algo barato y el vendedor desapareció" },
  sc_gambling_title:    { ko: "불법 도박", en: "Illegal Gambling", ja: "違法賭博", zh: "非法赌博", vi: "Cờ bạc bất hợp pháp", es: "Juego ilegal" },
  sc_gambling_sub:      { ko: "쉽게 돈을 딸 수 있다고 유혹해요", en: "They lure you with easy money from gambling", ja: "簡単にお金を稼げると誘惑する", zh: "以轻松赚钱为诱饵", vi: "Họ dụ dỗ bạn kiếm tiền dễ dàng", es: "Te atraen con la promesa de dinero fácil" },

  // ── CATEGORY LABELS ───────────────────────────────────────────────
  cat_voice:    { ko: "보이스피싱", en: "Voice Phishing", ja: "ボイスフィッシング", zh: "电话诈骗", vi: "Lừa qua điện thoại", es: "Phishing telefónico" },
  cat_agency:   { ko: "기관 사칭", en: "Agency Fraud", ja: "機関詐称", zh: "冒充机构", vi: "Giả mạo cơ quan", es: "Fraude de agencia" },
  cat_romance:  { ko: "로맨스 스캠", en: "Romance Scam", ja: "ロマンス詐欺", zh: "网恋诈骗", vi: "Lừa đảo tình cảm", es: "Estafa romántica" },
  cat_invest:   { ko: "투자 사기", en: "Investment Fraud", ja: "投資詐欺", zh: "投资诈骗", vi: "Lừa đầu tư", es: "Fraude inversión" },
  cat_loan:     { ko: "대출 사기", en: "Loan Fraud", ja: "融資詐欺", zh: "贷款诈骗", vi: "Lừa vay vốn", es: "Fraude de préstamo" },
  cat_smishing: { ko: "스미싱", en: "Smishing", ja: "スミッシング", zh: "短信诈骗", vi: "Smishing", es: "Smishing" },
  cat_messenger:{ ko: "메신저 사기", en: "Messenger Fraud", ja: "メッセンジャー詐欺", zh: "社交软件诈骗", vi: "Lừa qua tin nhắn", es: "Fraude por mensajería" },
  cat_used:     { ko: "중고거래 사기", en: "Used Goods Scam", ja: "中古詐欺", zh: "二手诈骗", vi: "Lừa hàng cũ", es: "Estafa usados" },
  cat_gambling: { ko: "불법 도박", en: "Illegal Gambling", ja: "違法賭博", zh: "非法赌博", vi: "Cờ bạc bất phép", es: "Juego ilegal" },

  // ── SIMULATION PAGE UI ────────────────────────────────────────────
  sim_guide_title:     { ko: "체험 방법", en: "How to Play", ja: "体験方法", zh: "体验方式", vi: "Cách chơi", es: "Cómo jugar" },
  sim_guide_1:         { ko: "AI가 실제 사기범처럼 대화를 시작합니다", en: "AI starts talking like a real scammer", ja: "AIが実際の詐欺師のように話しかけてきます", zh: "AI会像真实骗子一样开始对话", vi: "AI bắt đầu trò chuyện như kẻ lừa đảo thật", es: "La IA habla como un estafador real" },
  sim_guide_2:         { ko: "자연스럽게 대화에 응해보세요", en: "Respond naturally to the conversation", ja: "自然に会話に応じてみましょう", zh: "自然地回应对话", vi: "Phản hồi tự nhiên trong cuộc trò chuyện", es: "Responde naturalmente a la conversación" },
  sim_guide_3:         { ko: "송금 요청이 오면 어떻게 할지 선택하세요", en: "Choose what to do when a transfer request comes", ja: "送金要求が来たらどうするか選択してください", zh: "收到转账请求时选择如何应对", vi: "Chọn cách xử lý khi nhận yêu cầu chuyển tiền", es: "Elige qué hacer cuando llegue la solicitud de transferencia" },
  sim_guide_4:         { ko: "체험 후 범죄 수법과 예방법을 확인하세요", en: "After the experience, review crime tactics and prevention tips", ja: "体験後、犯罪手口と予防法を確認してください", zh: "体验后查看犯罪手法和预防方法", vi: "Sau trải nghiệm, xem lại thủ thuật tội phạm và cách phòng ngừa", es: "Después, revisa las tácticas y consejos de prevención" },
  sim_stats_label:     { ko: "실제 피해 통계", en: "Real Damage Statistics", ja: "実際の被害統計", zh: "真实受害统计", vi: "Thống kê thiệt hại thực tế", es: "Estadísticas de daño real" },
  sim_safety_notice:   { ko: "실제 돈을 보내거나 외부로 이동하지 마세요. 의심스러우면 즉시 182로 신고하세요.", en: "Do not send real money or go anywhere. If suspicious, report to 182 immediately.", ja: "実際のお金を送ったり外出したりしないでください。不審に思ったら182に通報してください。", zh: "不要转账或外出。如有疑问，请立即拨打182举报。", vi: "Đừng gửi tiền thật hoặc đi đâu. Nếu nghi ngờ, hãy báo 182 ngay.", es: "No envíes dinero real ni salgas. Si sospechas, reporta al 182 de inmediato." },
  sim_other_scenarios: { ko: "← 다른 시나리오 선택", en: "← Other Scenarios", ja: "← 他のシナリオ", zh: "← 其他场景", vi: "← Kịch bản khác", es: "← Otros escenarios" },
  sim_danger_detected: { ko: "위험 감지", en: "Risk Detected", ja: "危険検出", zh: "风险检测", vi: "Phát hiện rủi ro", es: "Riesgo detectado" },
  sim_refuse_btn:      { ko: "🛡️ 돈을 보내지 않겠습니다", en: "🛡️ I will not send money", ja: "🛡️ お金を送りません", zh: "🛡️ 我不会转账", vi: "🛡️ Tôi sẽ không gửi tiền", es: "🛡️ No enviaré dinero" },
  sim_input_placeholder: { ko: "메시지를 입력하세요...", en: "Type a message...", ja: "メッセージを入力...", zh: "输入消息...", vi: "Nhập tin nhắn...", es: "Escribe un mensaje..." },
  sim_sending:         { ko: "전송 중...", en: "Sending...", ja: "送信中...", zh: "发送中...", vi: "Đang gửi...", es: "Enviando..." },

  // ── EMERGENCY BLOCK ───────────────────────────────────────────────
  em_title:            { ko: "🚨 잠깐, 멈추세요!", en: "🚨 Stop right there!", ja: "🚨 ちょっと待って！", zh: "🚨 请停下！", vi: "🚨 Dừng lại!", es: "🚨 ¡Para ahora mismo!" },
  em_leave_title:      { ko: "다른 앱이나 은행으로 이동하려 하세요?", en: "Trying to open a banking app?", ja: "別のアプリや銀行に移動しようとしていますか？", zh: "是否要打开银行或其他应用？", vi: "Bạn đang cố mở ứng dụng ngân hàng?", es: "¿Intentas abrir una app bancaria?" },
  em_leave_body:       { ko: "지금 화면은 범죄 예방 시뮬레이션입니다.\n실제 은행 앱이나 송금 앱을 열어서\n절대 돈을 보내지 마세요.", en: "This screen is a crime prevention simulation.\nDo NOT open a real banking or payment app\nand send money.", ja: "この画面は犯罪予防シミュレーションです。\n実際の銀行アプリや送金アプリを開いて\nお金を送らないでください。", zh: "当前画面是犯罪预防模拟。\n请勿打开真实银行或支付应用\n进行转账。", vi: "Màn hình này là mô phỏng phòng chống tội phạm.\nĐừng mở ứng dụng ngân hàng thật\nđể gửi tiền.", es: "Esta pantalla es una simulación de prevención del crimen.\nNO abras una app bancaria real\nni envíes dinero." },
  em_stay_btn:         { ko: "이 앱에 머물기", en: "Stay Here", ja: "このアプリに留まる", zh: "留在此应用", vi: "Ở lại ứng dụng này", es: "Quedarme aquí" },
  em_continue_btn:     { ko: "계속 체험하기", en: "Continue", ja: "体験を続ける", zh: "继续体验", vi: "Tiếp tục trải nghiệm", es: "Continuar" },
  em_result_btn:       { ko: "교육 결과 보기", en: "View Results", ja: "教育結果を見る", zh: "查看教育结果", vi: "Xem kết quả giáo dục", es: "Ver resultados" },
  em_report_182:       { ko: "이미 돈을 보냈다면 즉시 신고", en: "Already sent money? Report now", ja: "すでにお金を送った場合は即通報", zh: "如已转账请立即举报", vi: "Đã gửi tiền? Báo cáo ngay", es: "¿Ya enviaste dinero? Denuncia ahora" },

  // ── REVEAL SCREEN ─────────────────────────────────────────────────
  rev_this_is_crime:   { ko: "이것은 범죄입니다", en: "This is a crime", ja: "これは犯罪です", zh: "这是犯罪", vi: "Đây là tội phạm", es: "Esto es un crimen" },
  rev_almost_lost:     { ko: "방금 이 금액을 잃을 뻔 했습니다", en: "You almost lost this amount", ja: "今、この金額を失いそうになりました", zh: "您差点损失了这笔钱", vi: "Bạn suýt mất số tiền này", es: "Por poco pierdes esta cantidad" },
  rev_safe:            { ko: "실제 돈은 나가지 않았습니다", en: "No real money was sent", ja: "実際のお金は出ていません", zh: "没有真实金钱流失", vi: "Không có tiền thật nào bị mất", es: "No se envió dinero real" },
  rev_edu_only:        { ko: "범죄 예방 교육 시뮬레이션입니다", en: "This is a crime prevention education simulation", ja: "犯罪予防教育シミュレーションです", zh: "这是犯罪预防教育模拟", vi: "Đây là mô phỏng giáo dục phòng chống tội phạm", es: "Esta es una simulación educativa de prevención del crimen" },
  rev_how_to_avoid:    { ko: "✓ 이렇게 예방하세요", en: "✓ How to prevent this", ja: "✓ このように予防しましょう", zh: "✓ 这样预防", vi: "✓ Cách phòng ngừa", es: "✓ Cómo prevenirlo" },
  rev_retry:           { ko: "다시 체험", en: "Try Again", ja: "再体験", zh: "重新体验", vi: "Thử lại", es: "Intentar de nuevo" },
  rev_other:           { ko: "다른 시나리오", en: "Other Scenarios", ja: "他のシナリオ", zh: "其他场景", vi: "Kịch bản khác", es: "Otros escenarios" },

  // ── REPORT LABELS ─────────────────────────────────────────────────
  report_police:  { ko: "경찰청", en: "Police", ja: "警察庁", zh: "警察局", vi: "Cảnh sát", es: "Policía" },
  report_fss:     { ko: "금융감독원", en: "Financial Supervisory Service", ja: "金融監督院", zh: "金融监督院", vi: "Giám sát tài chính", es: "Supervisión financiera" },
  report_kisa:    { ko: "인터넷진흥원", number: "118", ko2: "인터넷진흥원", en: "Internet Security Agency", ja: "インターネット振興院", zh: "互联网振兴院", vi: "Cơ quan An ninh mạng", es: "Agencia de Seguridad en Internet" },
  report_gamble:  { ko: "도박중독 상담", en: "Gambling Helpline", ja: "ギャンブル依存相談", zh: "赌博成瘾咨询", vi: "Đường dây cờ bạc", es: "Línea de juego" },
} as const;

export function t(key: keyof typeof T, lang: LangCode): string {
  return T[key][lang] ?? T[key]["ko"];
}
