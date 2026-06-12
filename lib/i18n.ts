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
} as const;

export function t(key: keyof typeof T, lang: LangCode): string {
  return T[key][lang] ?? T[key]["ko"];
}
