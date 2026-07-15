"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/LanguageContext";
import { ArrowLeft, Shield, CheckCircle, Phone, Mail, Building2, Users, BookOpen, ChevronRight, Send } from "lucide-react";

export default function PartnershipPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [form, setForm] = useState({ org: "", name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const PACKAGES = [
    {
      name: lang === "ko" ? "기본형" : lang === "en" ? "Basic" : lang === "ja" ? "ベーシック" : lang === "zh" ? "基础版" : lang === "vi" ? "Cơ bản" : "Básico",
      tag: lang === "ko" ? "소규모 기관" : lang === "en" ? "Small Org" : lang === "ja" ? "小規模機関" : lang === "zh" ? "小型机构" : lang === "vi" ? "Tổ chức nhỏ" : "Org. Pequeña",
      price: lang === "ko" ? "협의" : lang === "en" ? "Negotiable" : lang === "ja" ? "要相談" : lang === "zh" ? "协商" : lang === "vi" ? "Thương lượng" : "Negociable",
      color: "#f97316",
      bg: "#f5dfee",
      border: "#dcc5e8",
      features: [
        lang === "ko" ? "웹 플랫폼 무제한 접속 (링크 제공)" : lang === "en" ? "Unlimited web platform access (link provided)" : lang === "ja" ? "Webプラットフォーム無制限アクセス（リンク提供）" : lang === "zh" ? "无限访问Web平台（提供链接）" : lang === "vi" ? "Truy cập nền tảng web không giới hạn (cung cấp liên kết)" : "Acceso ilimitado a plataforma web (enlace proporcionado)",
        lang === "ko" ? "9가지 범죄 시나리오 전체 이용" : lang === "en" ? "Access to all 9 crime scenarios" : lang === "ja" ? "9つの犯罪シナリオ全て利用可能" : lang === "zh" ? "使用全部9种犯罪场景" : lang === "vi" ? "Sử dụng toàn bộ 9 kịch bản tội phạm" : "Acceso a los 9 escenarios de crimen",
        lang === "ko" ? "기관 로고 삽입 (헤더)" : lang === "en" ? "Institution logo insertion (header)" : lang === "ja" ? "機関ロゴ挿入（ヘッダー）" : lang === "zh" ? "机构Logo插入（头部）" : lang === "vi" ? "Chèn logo tổ chức (tiêu đề)" : "Inserción de logo institucional (encabezado)",
        lang === "ko" ? "교육 자료 PDF 제공" : lang === "en" ? "Educational PDF materials provided" : lang === "ja" ? "教育資料PDF提供" : lang === "zh" ? "提供教育资料PDF" : lang === "vi" ? "Cung cấp tài liệu PDF giáo dục" : "Materiales educativos en PDF",
        lang === "ko" ? "이메일 기술 지원" : lang === "en" ? "Email technical support" : lang === "ja" ? "メール技術サポート" : lang === "zh" ? "电子邮件技术支持" : lang === "vi" ? "Hỗ trợ kỹ thuật qua email" : "Soporte técnico por email",
      ],
      target: lang === "ko" ? "주민센터·경로당·소규모 단체" : lang === "en" ? "Community centers · Senior clubs · Small groups" : lang === "ja" ? "住民センター・老人会・小規模団体" : lang === "zh" ? "居委会·老年活动中心·小型团体" : lang === "vi" ? "Trung tâm cộng đồng · Câu lạc bộ người cao tuổi · Nhóm nhỏ" : "Centros comunitarios · Clubes de mayores · Pequeños grupos",
      notIncluded: [
        lang === "ko" ? "강사 파견" : lang === "en" ? "Instructor dispatch" : lang === "ja" ? "講師派遣" : lang === "zh" ? "讲师派遣" : lang === "vi" ? "Cử giảng viên" : "Despacho de instructor",
        lang === "ko" ? "커스텀 시나리오" : lang === "en" ? "Custom scenarios" : lang === "ja" ? "カスタムシナリオ" : lang === "zh" ? "定制场景" : lang === "vi" ? "Kịch bản tùy chỉnh" : "Escenarios personalizados",
      ],
    },
    {
      name: lang === "ko" ? "표준형" : lang === "en" ? "Standard" : lang === "ja" ? "スタンダード" : lang === "zh" ? "标准版" : lang === "vi" ? "Tiêu chuẩn" : "Estándar",
      tag: lang === "ko" ? "추천" : lang === "en" ? "Recommended" : lang === "ja" ? "おすすめ" : lang === "zh" ? "推荐" : lang === "vi" ? "Đề xuất" : "Recomendado",
      price: lang === "ko" ? "협의" : lang === "en" ? "Negotiable" : lang === "ja" ? "要相談" : lang === "zh" ? "协商" : lang === "vi" ? "Thương lượng" : "Negociable",
      color: "#7c3aed",
      bg: "#faf5ff",
      border: "#ddd6fe",
      features: [
        lang === "ko" ? "기본형 전체 포함" : lang === "en" ? "All Basic features included" : lang === "ja" ? "ベーシック全て含む" : lang === "zh" ? "包含全部基础版功能" : lang === "vi" ? "Bao gồm tất cả tính năng Cơ bản" : "Todas las funciones Básicas incluidas",
        lang === "ko" ? "기관 전용 도메인 설정" : lang === "en" ? "Dedicated institution domain setup" : lang === "ja" ? "機関専用ドメイン設定" : lang === "zh" ? "机构专用域名设置" : lang === "vi" ? "Thiết lập tên miền riêng cho tổ chức" : "Configuración de dominio exclusivo",
        lang === "ko" ? "기관명·CI 커스터마이징" : lang === "en" ? "Institution name & CI customization" : lang === "ja" ? "機関名・CIカスタマイズ" : lang === "zh" ? "机构名称·CI定制" : lang === "vi" ? "Tùy chỉnh tên tổ chức & CI" : "Personalización de nombre e identidad",
        lang === "ko" ? "수료증 발급 기능" : lang === "en" ? "Certificate issuance feature" : lang === "ja" ? "修了証発行機能" : lang === "zh" ? "结业证书颁发功能" : lang === "vi" ? "Tính năng cấp chứng chỉ" : "Función de emisión de certificados",
        lang === "ko" ? "월간 이용 통계 리포트" : lang === "en" ? "Monthly usage statistics report" : lang === "ja" ? "月間利用統計レポート" : lang === "zh" ? "月度使用统计报告" : lang === "vi" ? "Báo cáo thống kê sử dụng hàng tháng" : "Informe mensual de estadísticas",
        lang === "ko" ? "전화·화상 기술 지원" : lang === "en" ? "Phone & video technical support" : lang === "ja" ? "電話・ビデオ技術サポート" : lang === "zh" ? "电话·视频技术支持" : lang === "vi" ? "Hỗ trợ kỹ thuật qua điện thoại & video" : "Soporte técnico telefónico y por video",
      ],
      target: lang === "ko" ? "시·도 교육청·지자체·금융기관" : lang === "en" ? "City & Provincial Offices of Education · Local Gov't · Financial Institutions" : lang === "ja" ? "市・道教育庁・地自体・金融機関" : lang === "zh" ? "市·省教育局·地方政府·金融机构" : lang === "vi" ? "Sở Giáo dục Thành phố · Chính quyền địa phương · Tổ chức tài chính" : "Oficinas de Educación · Gobiernos locales · Instituciones financieras",
      notIncluded: [
        lang === "ko" ? "강사 파견" : lang === "en" ? "Instructor dispatch" : lang === "ja" ? "講師派遣" : lang === "zh" ? "讲师派遣" : lang === "vi" ? "Cử giảng viên" : "Despacho de instructor",
      ],
    },
    {
      name: lang === "ko" ? "프리미엄형" : lang === "en" ? "Premium" : lang === "ja" ? "プレミアム" : lang === "zh" ? "高级版" : lang === "vi" ? "Cao cấp" : "Premium",
      tag: lang === "ko" ? "공공기관 전용" : lang === "en" ? "Public Org Only" : lang === "ja" ? "公共機関専用" : lang === "zh" ? "公共机构专用" : lang === "vi" ? "Dành cho cơ quan công" : "Solo Org. Pública",
      price: lang === "ko" ? "협의" : lang === "en" ? "Negotiable" : lang === "ja" ? "要相談" : lang === "zh" ? "协商" : lang === "vi" ? "Thương lượng" : "Negociable",
      color: "#059669",
      bg: "#f0fdf4",
      border: "#bbf7d0",
      features: [
        lang === "ko" ? "표준형 전체 포함" : lang === "en" ? "All Standard features included" : lang === "ja" ? "スタンダード全て含む" : lang === "zh" ? "包含全部标准版功能" : lang === "vi" ? "Bao gồm tất cả tính năng Tiêu chuẩn" : "Todas las funciones Estándar incluidas",
        lang === "ko" ? "기관 맞춤 시나리오 추가 제작" : lang === "en" ? "Custom scenario production for institution" : lang === "ja" ? "機関向けカスタムシナリオ追加制作" : lang === "zh" ? "机构定制场景额外制作" : lang === "vi" ? "Sản xuất kịch bản tùy chỉnh cho tổ chức" : "Producción de escenarios personalizados",
        lang === "ko" ? "오프라인 교육 강사 파견" : lang === "en" ? "Offline training instructor dispatch" : lang === "ja" ? "オフライン教育講師派遣" : lang === "zh" ? "线下培训讲师派遣" : lang === "vi" ? "Cử giảng viên đào tạo ngoại tuyến" : "Despacho de instructor de formación presencial",
        lang === "ko" ? "연간 콘텐츠 업데이트" : lang === "en" ? "Annual content updates" : lang === "ja" ? "年間コンテンツアップデート" : lang === "zh" ? "年度内容更新" : lang === "vi" ? "Cập nhật nội dung hàng năm" : "Actualizaciones de contenido anuales",
        lang === "ko" ? "대시보드 관리자 페이지" : lang === "en" ? "Dashboard admin page" : lang === "ja" ? "ダッシュボード管理者ページ" : lang === "zh" ? "仪表板管理员页面" : lang === "vi" ? "Trang quản trị bảng điều khiển" : "Página de administrador del panel",
        lang === "ko" ? "SLA 기술 지원 보증" : lang === "en" ? "SLA technical support guarantee" : lang === "ja" ? "SLA技術サポート保証" : lang === "zh" ? "SLA技术支持保障" : lang === "vi" ? "Đảm bảo hỗ trợ kỹ thuật SLA" : "Garantía de soporte técnico SLA",
      ],
      target: lang === "ko" ? "경찰청·교육부·대형 공공기관" : lang === "en" ? "National Police Agency · Ministry of Education · Large Public Institutions" : lang === "ja" ? "警察庁・教育省・大型公共機関" : lang === "zh" ? "警察厅·教育部·大型公共机构" : lang === "vi" ? "Cục Cảnh sát · Bộ Giáo dục · Cơ quan công lớn" : "Policía Nacional · Ministerio de Educación · Grandes Instituciones Públicas",
      notIncluded: [] as string[],
    },
  ];

  const TARGETS = [
    {
      icon: "🏛️",
      name: lang === "ko" ? "경찰청·사이버수사대" : lang === "en" ? "National Police Agency · Cyber Investigation" : lang === "ja" ? "警察庁・サイバー捜査隊" : lang === "zh" ? "警察厅·网络侦查队" : lang === "vi" ? "Cục Cảnh sát · Điều tra mạng" : "Policía Nacional · Investigación Cibernética",
      desc: lang === "ko" ? "공식 범죄예방 교육 자료로 활용" : lang === "en" ? "Used as official crime prevention educational material" : lang === "ja" ? "公式犯罪予防教育資料として活用" : lang === "zh" ? "作为官方犯罪预防教育资料使用" : lang === "vi" ? "Sử dụng làm tài liệu giáo dục phòng chống tội phạm chính thức" : "Usado como material educativo oficial de prevención del crimen",
    },
    {
      icon: "🎓",
      name: lang === "ko" ? "시·도 교육청" : lang === "en" ? "City & Provincial Offices of Education" : lang === "ja" ? "市・道教育庁" : lang === "zh" ? "市·省教育局" : lang === "vi" ? "Sở Giáo dục Thành phố & Tỉnh" : "Oficinas de Educación Municipales y Provinciales",
      desc: lang === "ko" ? "중·고등학교 디지털 리터러시 교육" : lang === "en" ? "Middle & high school digital literacy education" : lang === "ja" ? "中・高校デジタルリテラシー教育" : lang === "zh" ? "中·高中数字素养教育" : lang === "vi" ? "Giáo dục kỹ năng số cho trường THCS & THPT" : "Educación en alfabetización digital para secundaria",
    },
    {
      icon: "🏦",
      name: lang === "ko" ? "은행·금융기관" : lang === "en" ? "Banks & Financial Institutions" : lang === "ja" ? "銀行・金融機関" : lang === "zh" ? "银行·金融机构" : lang === "vi" ? "Ngân hàng & Tổ chức tài chính" : "Bancos e Instituciones Financieras",
      desc: lang === "ko" ? "고객·임직원 금융사기 예방 교육" : lang === "en" ? "Customer & employee financial fraud prevention training" : lang === "ja" ? "顧客・従業員金融詐欺予防教育" : lang === "zh" ? "客户·员工金融诈骗预防培训" : lang === "vi" ? "Đào tạo phòng chống gian lận tài chính cho khách hàng & nhân viên" : "Formación en prevención de fraude financiero para clientes y empleados",
    },
    {
      icon: "🏠",
      name: lang === "ko" ? "지자체·주민센터" : lang === "en" ? "Local Gov't · Community Centers" : lang === "ja" ? "地自体・住民センター" : lang === "zh" ? "地方政府·居委会" : lang === "vi" ? "Chính quyền địa phương · Trung tâm cộng đồng" : "Gobiernos locales · Centros comunitarios",
      desc: lang === "ko" ? "어르신 보이스피싱 예방 교육" : lang === "en" ? "Voice phishing prevention education for seniors" : lang === "ja" ? "高齢者向け振り込め詐欺予防教育" : lang === "zh" ? "老年人语音钓鱼预防教育" : lang === "vi" ? "Giáo dục phòng chống lừa đảo qua điện thoại cho người cao tuổi" : "Educación en prevención de phishing telefónico para mayores",
    },
    {
      icon: "⚕️",
      name: lang === "ko" ? "복지관·상담센터" : lang === "en" ? "Welfare Centers · Counseling Centers" : lang === "ja" ? "福祉館・相談センター" : lang === "zh" ? "福利馆·咨询中心" : lang === "vi" ? "Trung tâm phúc lợi · Trung tâm tư vấn" : "Centros de Bienestar · Centros de Asesoramiento",
      desc: lang === "ko" ? "도박 중독 예방 교육 프로그램" : lang === "en" ? "Gambling addiction prevention education program" : lang === "ja" ? "ギャンブル依存症予防教育プログラム" : lang === "zh" ? "赌博成瘾预防教育项目" : lang === "vi" ? "Chương trình giáo dục phòng chống nghiện cờ bạc" : "Programa de educación para prevenir la adicción al juego",
    },
    {
      icon: "🪖",
      name: lang === "ko" ? "군부대·공공기관" : lang === "en" ? "Military Units · Public Institutions" : lang === "ja" ? "軍部隊・公共機関" : lang === "zh" ? "军队·公共机构" : lang === "vi" ? "Đơn vị quân đội · Cơ quan công" : "Unidades Militares · Instituciones Públicas",
      desc: lang === "ko" ? "장병·공무원 보안 의식 교육" : lang === "en" ? "Security awareness training for soldiers & public officials" : lang === "ja" ? "将兵・公務員セキュリティ意識教育" : lang === "zh" ? "军人·公务员安全意识培训" : lang === "vi" ? "Đào tạo nhận thức an ninh cho quân nhân & công chức" : "Formación en conciencia de seguridad para militares y funcionarios",
    },
  ];

  const STEPS = [
    {
      step: "01",
      icon: <Mail size={20} color="#9161b2" />,
      bg: "#f5dfee",
      border: "#dcc5e8",
      title: lang === "ko" ? "도입 문의" : lang === "en" ? "Inquiry" : lang === "ja" ? "導入問い合わせ" : lang === "zh" ? "咨询引入" : lang === "vi" ? "Yêu cầu tư vấn" : "Consulta",
      desc: lang === "ko" ? "아래 양식 또는 이메일로 문의해 주시면 24시간 내 답변드립니다." : lang === "en" ? "Contact us via the form below or by email and we'll respond within 24 hours." : lang === "ja" ? "下記フォームまたはメールでお問い合わせください。24時間以内にご返答します。" : lang === "zh" ? "通过下方表单或电子邮件联系我们，24小时内回复。" : lang === "vi" ? "Liên hệ qua biểu mẫu bên dưới hoặc qua email, chúng tôi sẽ phản hồi trong vòng 24 giờ." : "Contáctenos a través del formulario o por email y responderemos en 24 horas.",
    },
    {
      step: "02",
      icon: <BookOpen size={20} color="#7c3aed" />,
      bg: "#faf5ff",
      border: "#ddd6fe",
      title: lang === "ko" ? "제안서 발송" : lang === "en" ? "Proposal Sent" : lang === "ja" ? "提案書送付" : lang === "zh" ? "发送提案" : lang === "vi" ? "Gửi đề xuất" : "Envío de Propuesta",
      desc: lang === "ko" ? "기관 규모와 목적에 맞는 맞춤형 제안서를 무료로 보내드립니다." : lang === "en" ? "We send a free, customized proposal tailored to your institution's size and purpose." : lang === "ja" ? "機関の規模と目的に合わせたカスタム提案書を無料でお送りします。" : lang === "zh" ? "我们将免费发送根据贵机构规模和目的定制的提案。" : lang === "vi" ? "Chúng tôi gửi miễn phí đề xuất tùy chỉnh phù hợp với quy mô và mục đích của tổ chức bạn." : "Enviamos una propuesta gratuita y personalizada según el tamaño y propósito de su institución.",
    },
    {
      step: "03",
      icon: <Building2 size={20} color="#059669" />,
      bg: "#f0fdf4",
      border: "#bbf7d0",
      title: lang === "ko" ? "계약 및 도입" : lang === "en" ? "Contract & Setup" : lang === "ja" ? "契約及び導入" : lang === "zh" ? "签约与引入" : lang === "vi" ? "Hợp đồng & Triển khai" : "Contrato e Implementación",
      desc: lang === "ko" ? "계약 후 최대 2주 내 세팅 완료. 교육 담당자 온보딩을 지원합니다." : lang === "en" ? "Setup completed within 2 weeks after signing. We support onboarding for your education staff." : lang === "ja" ? "契約後最大2週間以内にセットアップ完了。教育担当者のオンボーディングをサポートします。" : lang === "zh" ? "签约后最多2周内完成设置，支持教育负责人入职培训。" : lang === "vi" ? "Hoàn tất thiết lập trong vòng 2 tuần sau khi ký hợp đồng. Hỗ trợ đào tạo nhân sự phụ trách giáo dục." : "Configuración completada en 2 semanas tras la firma. Apoyamos la incorporación del personal educativo.",
    },
    {
      step: "04",
      icon: <Users size={20} color="#dc2626" />,
      bg: "#fef2f2",
      border: "#fecaca",
      title: lang === "ko" ? "교육 운영" : lang === "en" ? "Training Operation" : lang === "ja" ? "教育運営" : lang === "zh" ? "教育运营" : lang === "vi" ? "Vận hành đào tạo" : "Operación de Formación",
      desc: lang === "ko" ? "교육 현장에서 즉시 활용. 운영 중 기술 문의는 상시 지원합니다." : lang === "en" ? "Immediately usable in the field. Technical inquiries are supported at all times during operation." : lang === "ja" ? "教育現場で即利用可能。運営中の技術的な問い合わせは常時サポートします。" : lang === "zh" ? "在教育现场立即可用。运营期间技术咨询随时提供支持。" : lang === "vi" ? "Có thể sử dụng ngay tại hiện trường. Hỗ trợ kỹ thuật mọi lúc trong quá trình vận hành." : "Utilizable de inmediato en el lugar. Soporte técnico disponible en todo momento durante la operación.",
    },
  ];

  const whyItems = [
    {
      icon: "🎯",
      color: "#f97316",
      bg: "#f5dfee",
      title: lang === "ko" ? "실제 체험 교육" : lang === "en" ? "Hands-on Experience" : lang === "ja" ? "実体験教育" : lang === "zh" ? "实际体验教育" : lang === "vi" ? "Giáo dục trải nghiệm thực tế" : "Experiencia Práctica",
      desc: lang === "ko" ? "AI가 실제 사기범처럼 대화하며 범죄 수법을 몸으로 익힙니다. 강의보다 10배 더 기억에 남습니다." : lang === "en" ? "AI simulates real scammers so participants experience crime tactics firsthand — 10x more memorable than a lecture." : lang === "ja" ? "AIが実際の詐欺師のように会話し、犯罪手口を体で学びます。講義より10倍記憶に残ります。" : lang === "zh" ? "AI像真实骗子一样对话，让参与者亲身体验犯罪手法。比讲座记忆深刻10倍。" : lang === "vi" ? "AI mô phỏng kẻ lừa đảo thật để người tham gia trải nghiệm thủ thuật tội phạm — ghi nhớ gấp 10 lần so với bài giảng." : "La IA simula estafadores reales para que los participantes experimenten tácticas delictivas — 10 veces más memorable que una charla.",
    },
    {
      icon: "💰",
      color: "#059669",
      bg: "#f0fdf4",
      title: lang === "ko" ? "비용 효율적" : lang === "en" ? "Cost Efficient" : lang === "ja" ? "コスト効率的" : lang === "zh" ? "成本高效" : lang === "vi" ? "Tiết kiệm chi phí" : "Rentable",
      desc: lang === "ko" ? "강사 파견 없이 링크 하나로 수백 명이 동시 교육 가능. 1인당 교육 비용을 획기적으로 줄입니다." : lang === "en" ? "Hundreds can train simultaneously with a single link — no instructor needed. Dramatically reduces per-person training costs." : lang === "ja" ? "講師派遣なしにリンク1つで数百人が同時教育可能。1人当たりの教育コストを大幅に削減します。" : lang === "zh" ? "无需派遣讲师，一个链接可同时培训数百人。大幅降低每人培训成本。" : lang === "vi" ? "Hàng trăm người có thể học đồng thời chỉ với một liên kết — không cần giảng viên. Giảm đáng kể chi phí đào tạo mỗi người." : "Cientos pueden formarse simultáneamente con un solo enlace, sin instructor. Reduce drásticamente el coste por persona.",
    },
    {
      icon: "📊",
      color: "#7c3aed",
      bg: "#faf5ff",
      title: lang === "ko" ? "데이터 기반" : lang === "en" ? "Data-Driven" : lang === "ja" ? "データ基盤" : lang === "zh" ? "数据驱动" : lang === "vi" ? "Dựa trên dữ liệu" : "Basado en Datos",
      desc: lang === "ko" ? "경찰청·금감원·통계청 실제 데이터 기반 콘텐츠. 교육 이후 인식 변화를 수치로 확인하세요." : lang === "en" ? "Content based on real data from police agencies and statistical offices. Measure awareness changes after training." : lang === "ja" ? "警察庁・金融監督院・統計庁の実際のデータに基づくコンテンツ。教育後の認識変化を数値で確認できます。" : lang === "zh" ? "基于警察厅·金融监督院·统计局真实数据的内容。用数字确认教育后的认知变化。" : lang === "vi" ? "Nội dung dựa trên dữ liệu thực từ cơ quan cảnh sát và thống kê. Đo lường sự thay đổi nhận thức sau đào tạo." : "Contenido basado en datos reales de agencias policiales y oficinas estadísticas. Mida cambios de conciencia tras la formación.",
    },
    {
      icon: "🔄",
      color: "#dc2626",
      bg: "#fef2f2",
      title: lang === "ko" ? "상시 업데이트" : lang === "en" ? "Constant Updates" : lang === "ja" ? "常時アップデート" : lang === "zh" ? "持续更新" : lang === "vi" ? "Cập nhật liên tục" : "Actualizaciones Constantes",
      desc: lang === "ko" ? "새로운 범죄 수법이 등장하면 콘텐츠를 즉시 업데이트합니다. 항상 최신 정보로 교육합니다." : lang === "en" ? "Content is updated immediately when new crime tactics emerge, ensuring training always uses the latest information." : lang === "ja" ? "新しい犯罪手口が登場するとコンテンツをすぐにアップデートします。常に最新情報で教育します。" : lang === "zh" ? "出现新的犯罪手法时立即更新内容，始终以最新信息进行教育。" : lang === "vi" ? "Nội dung được cập nhật ngay khi xuất hiện thủ thuật tội phạm mới, đảm bảo luôn đào tạo với thông tin mới nhất." : "El contenido se actualiza inmediatamente cuando aparecen nuevas tácticas delictivas, garantizando formación actualizada.",
    },
    {
      icon: "📱",
      color: "#0891b2",
      bg: "#ecfeff",
      title: lang === "ko" ? "설치 불필요" : lang === "en" ? "No Installation Needed" : lang === "ja" ? "インストール不要" : lang === "zh" ? "无需安装" : lang === "vi" ? "Không cần cài đặt" : "Sin Instalación",
      desc: lang === "ko" ? "별도 앱 설치 없이 웹 브라우저만 있으면 어디서나 즉시 교육 가능합니다." : lang === "en" ? "No app installation required — just a web browser is all you need for instant training anywhere." : lang === "ja" ? "別途アプリインストール不要。Webブラウザさえあればどこでも即座に教育可能です。" : lang === "zh" ? "无需安装单独的应用程序，只需网页浏览器即可随时随地立即培训。" : lang === "vi" ? "Không cần cài đặt ứng dụng riêng — chỉ cần trình duyệt web là có thể đào tạo ngay mọi nơi." : "No requiere instalación de aplicación — solo un navegador web para formación inmediata en cualquier lugar.",
    },
    {
      icon: "🛡️",
      color: "#ca8a04",
      bg: "#fefce8",
      title: lang === "ko" ? "안전한 환경" : lang === "en" ? "Safe Environment" : lang === "ja" ? "安全な環境" : lang === "zh" ? "安全环境" : lang === "vi" ? "Môi trường an toàn" : "Entorno Seguro",
      desc: lang === "ko" ? "실제 돈이 나가거나 개인정보가 수집되지 않는 100% 안전한 시뮬레이션 환경입니다." : lang === "en" ? "A 100% safe simulation environment — no real money involved and no personal data collected." : lang === "ja" ? "実際のお金が出たり個人情報が収集されない100%安全なシミュレーション環境です。" : lang === "zh" ? "不涉及真实金钱或收集个人信息的100%安全模拟环境。" : lang === "vi" ? "Môi trường mô phỏng 100% an toàn — không có tiền thật và không thu thập dữ liệu cá nhân." : "Entorno de simulación 100% seguro — sin dinero real y sin recopilación de datos personales.",
    },
  ];

  const formFields = [
    {
      key: "org",
      label: lang === "ko" ? "기관명 *" : lang === "en" ? "Institution Name *" : lang === "ja" ? "機関名 *" : lang === "zh" ? "机构名称 *" : lang === "vi" ? "Tên tổ chức *" : "Nombre de la Institución *",
      placeholder: lang === "ko" ? "예) ○○경찰서, ○○교육청, ○○은행" : lang === "en" ? "e.g. XYZ Police Station, ABC School Board, DEF Bank" : lang === "ja" ? "例）○○警察署、○○教育委員会、○○銀行" : lang === "zh" ? "例）○○警察局、○○教育局、○○银行" : lang === "vi" ? "Vd: Đồn cảnh sát XX, Sở Giáo dục XX, Ngân hàng XX" : "Ej. Comisaría XX, Delegación de Educación XX, Banco XX",
      required: true,
    },
    {
      key: "name",
      label: lang === "ko" ? "담당자 성함 *" : lang === "en" ? "Contact Person *" : lang === "ja" ? "担当者氏名 *" : lang === "zh" ? "负责人姓名 *" : lang === "vi" ? "Người phụ trách *" : "Persona de Contacto *",
      placeholder: lang === "ko" ? "홍길동" : lang === "en" ? "John Doe" : lang === "ja" ? "山田太郎" : lang === "zh" ? "张三" : lang === "vi" ? "Nguyễn Văn A" : "Juan García",
      required: true,
    },
    {
      key: "email",
      label: lang === "ko" ? "이메일 *" : lang === "en" ? "Email *" : lang === "ja" ? "メール *" : lang === "zh" ? "电子邮件 *" : lang === "vi" ? "Email *" : "Correo electrónico *",
      placeholder: "example@org.go.kr",
      required: true,
    },
    {
      key: "phone",
      label: lang === "ko" ? "연락처" : lang === "en" ? "Phone Number" : lang === "ja" ? "連絡先" : lang === "zh" ? "联系方式" : lang === "vi" ? "Số điện thoại" : "Teléfono",
      placeholder: "010-0000-0000",
      required: false,
    },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subjectLabel = lang === "ko" ? "기관 도입 문의" : lang === "en" ? "Institution Inquiry" : lang === "ja" ? "機関導入問い合わせ" : lang === "zh" ? "机构引入咨询" : lang === "vi" ? "Yêu cầu tổ chức" : "Consulta de institución";
    const subject = encodeURIComponent(`[${subjectLabel}] ${form.org} - ${form.name}`);
    const orgLabel = lang === "ko" ? "기관명" : lang === "en" ? "Institution" : lang === "ja" ? "機関名" : lang === "zh" ? "机构名称" : lang === "vi" ? "Tổ chức" : "Institución";
    const nameLabel = lang === "ko" ? "담당자" : lang === "en" ? "Contact" : lang === "ja" ? "担当者" : lang === "zh" ? "负责人" : lang === "vi" ? "Người phụ trách" : "Contacto";
    const emailLabel = lang === "ko" ? "이메일" : lang === "en" ? "Email" : lang === "ja" ? "メール" : lang === "zh" ? "邮件" : lang === "vi" ? "Email" : "Correo";
    const phoneLabel = lang === "ko" ? "연락처" : lang === "en" ? "Phone" : lang === "ja" ? "連絡先" : lang === "zh" ? "联系方式" : lang === "vi" ? "Điện thoại" : "Teléfono";
    const msgLabel = lang === "ko" ? "문의 내용" : lang === "en" ? "Message" : lang === "ja" ? "問い合わせ内容" : lang === "zh" ? "咨询内容" : lang === "vi" ? "Nội dung" : "Mensaje";
    const body = encodeURIComponent(
      `${orgLabel}: ${form.org}\n${nameLabel}: ${form.name}\n${emailLabel}: ${form.email}\n${phoneLabel}: ${form.phone}\n\n${msgLabel}:\n${form.message}`
    );
    window.location.href = `mailto:itnlifecn@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f1f1f3", color: "#2a1a3a" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", gap: 12,
        padding: isMobile ? "0 16px" : "0 40px", height: 62,
        boxShadow: "0 1px 8px #0000000a",
      }}>
        <button onClick={() => router.push("/")} style={{ padding: 8, background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", borderRadius: 8 }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Shield size={14} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#1c0d2e" }}>
          {lang === "ko" ? "기관 도입 안내" : lang === "en" ? "Institution Guide" : lang === "ja" ? "機関導入案内" : lang === "zh" ? "机构引入指南" : lang === "vi" ? "Hướng dẫn tổ chức" : "Guía para Instituciones"}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#ea580c", background: "#fff7ed", padding: "2px 8px", borderRadius: 20, border: "1px solid #fed7aa" }}>
          Partnership
        </span>
      </nav>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(160deg, #160a26 0%, #0f2a5c 35%, #1a1040 70%, #0a0f20 100%)",
        padding: isMobile ? "52px 20px 72px" : "80px 40px 100px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* 장식 원 */}
        <div style={{ position:"absolute", top:-80, right:-80, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, #9161b218 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-60, left:-60, width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, #7c3aed14 0%, transparent 70%)", pointerEvents:"none" }} />
        {/* 황금빛 상단 라인 */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg, transparent, #d4af37, #f5c518, #d4af37, transparent)", pointerEvents:"none" }} />

        <div style={{ maxWidth: 800, margin: "0 auto", position:"relative", zIndex:1 }}>
          {/* 공식 뱃지 */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28,
            background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(245,197,24,0.08))",
            border: "1px solid rgba(212,175,55,0.4)",
            borderRadius: 24, padding: "8px 20px",
          }}>
            <span style={{ fontSize: 14 }}>🏛️</span>
            <span style={{ color: "#f5c518", fontSize: 12, fontWeight: 700, letterSpacing: 1.5 }}>
              {lang === "ko" ? "공공기관 · 교육기관 · 복지관 · 경로당 공식 도입 가능" : lang === "en" ? "Official Adoption for Public · Educational · Welfare Institutions" : lang === "ja" ? "公共機関・教育機関・福祉館・老人会 公式導入可能" : lang === "zh" ? "公共机构·教育机构·福利中心·老年之家 正式引入" : lang === "vi" ? "Dành cho Cơ quan Công · Giáo dục · Phúc lợi · Câu lạc bộ Người cao tuổi" : "Adopción Oficial para Instituciones Públicas · Educativas · Bienestar"}
            </span>
          </div>

          <h1 style={{ fontSize: isMobile ? 30 : 48, fontWeight: 900, color: "#fff", letterSpacing: -1.5, lineHeight: 1.2, marginBottom: 16 }}>
            {lang === "ko" ? "우리 기관에\n범죄예방 교육을" : lang === "en" ? "Bring Crime Prevention\nEducation to Your Institution" : lang === "ja" ? "私たちの機関に\n犯罪予防教育を" : lang === "zh" ? "为我们的机构\n引入犯罪预防教育" : lang === "vi" ? "Đưa Giáo dục\nPhòng chống Tội phạm vào Tổ chức" : "Lleve la Educación de\nPrevención del Crimen a su Institución"}
          </h1>
          <div style={{
            display: "inline-block", marginBottom: 20,
            background: "linear-gradient(90deg, #c58dc6, #c58dc6, #c58dc6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            fontSize: isMobile ? 30 : 48, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.2,
          }}>
            {lang === "ko" ? "지금 바로 도입하세요" : lang === "en" ? "Start Today" : lang === "ja" ? "今すぐ導入しましょう" : lang === "zh" ? "立即引入" : lang === "vi" ? "Bắt đầu ngay hôm nay" : "Comience Hoy"}
          </div>

          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 2.0, marginBottom: 44, marginTop: 8 }}>
            {lang === "ko" ? "연간 1조 2천억원 규모의 보이스피싱 피해, 200만명 도박 중독자." : lang === "en" ? "₩1.2 trillion in annual phishing losses, 2 million gambling addicts." : lang === "ja" ? "年間1兆2千億ウォンのボイスフィッシング被害、200万人のギャンブル依存症。" : lang === "zh" ? "每年1.2万亿韩元的网络钓鱼损失，200万赌博成瘾者。" : lang === "vi" ? "Thiệt hại 1.200 tỷ won mỗi năm do lừa đảo, 2 triệu người nghiện cờ bạc." : "₩1.2 billones en pérdidas anuales por phishing, 2 millones de adictos al juego."}<br />
            <strong style={{ color: "#e2e8f0" }}>
              {lang === "ko" ? "직접 체험하는 AI 예방 교육이 가장 효과적입니다." : lang === "en" ? "Hands-on AI prevention education is the most effective solution." : lang === "ja" ? "直接体験するAI予防教育が最も効果的です。" : lang === "zh" ? "亲身体验的AI预防教育是最有效的方案。" : lang === "vi" ? "Giáo dục phòng ngừa AI trải nghiệm trực tiếp là hiệu quả nhất." : "La educación preventiva con IA es la solución más efectiva."}
            </strong>
          </p>

          {/* 신뢰 지표 3개 */}
          <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap", marginBottom:44 }}>
            {[
              { icon:"🏆", num: lang==="ko"?"무료 제공":"Free", sub: lang==="ko"?"비영리·공익 기관":"For nonprofits" },
              { icon:"⚡", num: lang==="ko"?"24시간":"24h", sub: lang==="ko"?"문의 답변":"Response" },
              { icon:"🛡️", num: lang==="ko"?"100% 안전":"100% Safe", sub: lang==="ko"?"개인정보 무수집":"No data collected" },
            ].map((item, i) => (
              <div key={i} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:16, padding:"16px 28px", textAlign:"center", minWidth:120,
              }}>
                <div style={{ fontSize:22, marginBottom:6 }}>{item.icon}</div>
                <div style={{ color:"#fff", fontWeight:900, fontSize:18 }}>{item.num}</div>
                <div style={{ color:"#64748b", fontSize:11, marginTop:2 }}>{item.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#inquiry" style={{
              padding: "16px 36px", borderRadius: 14,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: 16,
              boxShadow: "0 4px 28px #9161b260",
              display: "flex", alignItems: "center", gap: 8,
              border: "1px solid rgba(255,255,255,0.15)",
            }}>
              {lang === "ko" ? "🏛️  무료 도입 문의하기" : lang === "en" ? "🏛️  Inquire for Free" : lang === "ja" ? "🏛️  無料で導入問い合わせ" : lang === "zh" ? "🏛️  免费咨询引入" : lang === "vi" ? "🏛️  Hỏi miễn phí" : "🏛️  Consultar Gratis"} <ChevronRight size={16} />
            </a>
            <a href="#packages" style={{
              padding: "16px 28px", borderRadius: 14,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#e2e8f0", textDecoration: "none", fontWeight: 600, fontSize: 15,
            }}>
              {lang === "ko" ? "패키지 보기 →" : lang === "en" ? "View Packages →" : lang === "ja" ? "パッケージを見る →" : lang === "zh" ? "查看套餐 →" : lang === "vi" ? "Xem gói →" : "Ver Paquetes →"}
            </a>
          </div>
        </div>
      </section>

      {/* ── 긴급 통계 배너 ── */}
      <div style={{ background:"#0f0f0f", padding: isMobile ? "28px 16px" : "40px 40px" }}>
        <div style={{ maxWidth:1140, margin:"0 auto" }}>
          <p style={{ color:"#f97316", fontSize:11, fontWeight:800, letterSpacing:3, textAlign:"center", marginBottom:28 }}>📊 2025년 대한민국 범죄 피해 현황 — 교육이 시급합니다</p>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap:16 }}>
            {[
              { num:"1조 2천억", unit:"원", label:"연간 보이스피싱 피해액", sub:"하루 평균 32억원 피해", color:"#ef4444" },
              { num:"200만", unit:"명", label:"국내 도박 중독 추정 인원", sub:"10대 비율 매년 증가", color:"#f59e0b" },
              { num:"47%", unit:"↑", label:"10~20대 마약 검거 증가율", sub:"SNS 유통 경로 68%", color:"#a855f7" },
              { num:"85%", unit:"", label:"피해자가 사전 교육 무경험", sub:"\"몰랐다\"는 응답 압도적", color:"#22c55e" },
            ].map((s,i) => (
              <div key={i} style={{ background:"#1a1a1a", borderRadius:16, padding:"20px", borderTop:`3px solid ${s.color}` }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:6 }}>
                  <span style={{ color:s.color, fontSize:28, fontWeight:900 }}>{s.num}</span>
                  <span style={{ color:s.color, fontSize:14, fontWeight:700 }}>{s.unit}</span>
                </div>
                <p style={{ color:"#e2e8f0", fontSize:13, fontWeight:700, marginBottom:4 }}>{s.label}</p>
                <p style={{ color:"#6b7280", fontSize:11 }}>{s.sub}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:24 }}>
            <div style={{ display:"inline-block", background:"#1a0a00", border:"1px solid #f97316", borderRadius:12, padding:"12px 28px" }}>
              <p style={{ color:"#fed7aa", fontSize:13, fontWeight:700 }}>
                ⚡ 강의·유인물보다 <strong style={{ color:"#f97316" }}>직접 체험 교육이 3배 효과적</strong>입니다 — 교육학 연구 기반
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 기관 신뢰 배너 */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e8e8ea", padding:"20px 40px" }}>
        <div style={{ maxWidth:1140, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center", gap:40, flexWrap:"wrap" }}>
          <span style={{ color:"#94a3b8", fontSize:12, fontWeight:600, letterSpacing:1 }}>도입 적합 기관</span>
          {["🚔 경찰청 / 사이버수사대","🎓 시·도 교육청","🏦 금융감독원","🏘️ 지자체 / 복지관","👴 경로당 / 노인회","🏫 중·고등학교"].map((item, i) => (
            <span key={i} style={{ color:"#334155", fontSize:13, fontWeight:600, whiteSpace:"nowrap" }}>{item}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: isMobile ? "36px 16px" : "72px 40px" }}>

        {/* Why */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ color: "#f97316", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>WHY US</p>
          <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 900, letterSpacing: -0.8, color: "#1c0d2e", marginBottom: 14 }}>
            {lang === "ko" ? "왜 이 프로그램인가요?" : lang === "en" ? "Why this program?" : lang === "ja" ? "なぜこのプログラムですか？" : lang === "zh" ? "为什么选择这个项目？" : lang === "vi" ? "Tại sao chọn chương trình này?" : "¿Por qué este programa?"}
          </h2>
          <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8 }}>
            {lang === "ko" ? "단순 강의나 유인물이 아닌, AI와의 실제 대화를 통한 몰입형 체험 교육입니다." : lang === "en" ? "Not a lecture or handout — immersive experiential education through real AI conversation." : lang === "ja" ? "単純な講義やチラシではなく、AIとの実際の会話による没入型体験教育です。" : lang === "zh" ? "不是简单的讲座或宣传册，而是通过与AI真实对话的沉浸式体验教育。" : lang === "vi" ? "Không phải bài giảng hay tờ rơi — giáo dục trải nghiệm nhập vai thông qua hội thoại thực tế với AI." : "No es una conferencia ni un folleto — educación experiencial inmersiva a través de conversación real con IA."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 18, marginBottom: 72 }}>
          {whyItems.map((item) => (
            <div key={item.title} style={{
              background: "#fdf8ff", borderRadius: 20, padding: "26px 24px",
              border: "1px solid #e8e8ea", boxShadow: "0 2px 16px #00000008",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: item.bg, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 16,
              }}>
                {item.icon}
              </div>
              <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{item.title}</p>
              <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Targets */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ color: "#f97316", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>TARGET</p>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -0.8, color: "#1c0d2e" }}>
              {lang === "ko" ? "이런 기관에 적합합니다" : lang === "en" ? "Suitable for these institutions" : lang === "ja" ? "このような機関に適しています" : lang === "zh" ? "适合这些机构" : lang === "vi" ? "Phù hợp với những tổ chức này" : "Adecuado para estas instituciones"}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
            {TARGETS.map((t) => (
              <div key={t.name} style={{
                background: "#fdf8ff", borderRadius: 16, padding: "20px 22px",
                border: "1px solid #e8e8ea", boxShadow: "0 2px 12px #00000008",
                display: "flex", alignItems: "center", gap: 16,
              }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{t.icon}</span>
                <div>
                  <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{t.name}</p>
                  <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ color: "#f97316", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>PROCESS</p>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -0.8, color: "#1c0d2e" }}>
              {lang === "ko" ? "도입 절차" : lang === "en" ? "How It Works" : lang === "ja" ? "導入手順" : lang === "zh" ? "引入流程" : lang === "vi" ? "Quy trình triển khai" : "Cómo Funciona"}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 16 }}>
            {STEPS.map((s, i) => (
              <div key={s.step} style={{ position: "relative" }}>
                <div style={{
                  background: "#fdf8ff", borderRadius: 20, padding: "26px 22px",
                  border: "1px solid #e8e8ea", boxShadow: "0 2px 16px #00000008",
                  height: "100%",
                }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: s.bg, border: `1px solid ${s.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 16,
                  }}>
                    {s.icon}
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>STEP {s.step}</p>
                  <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{s.title}</p>
                  <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: "absolute", top: "50%", right: -10, zIndex: 1,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center",
                    transform: "translateY(-50%)",
                  }}>
                    <ChevronRight size={12} color="#94a3b8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── 체험 먼저 해보기 ── */}
        <div style={{ marginBottom: 72, background:"linear-gradient(135deg,#0f2010,#052e16)", borderRadius:24, padding:"40px", textAlign:"center" }}>
          <p style={{ color:"#4ade80", fontSize:12, fontWeight:800, letterSpacing:2, marginBottom:12 }}>BEFORE YOU DECIDE</p>
          <h2 style={{ fontSize:28, fontWeight:900, color:"#fff", marginBottom:12 }}>도입 전, 먼저 직접 체험해보세요</h2>
          <p style={{ color:"#86efac", fontSize:14, lineHeight:1.9, marginBottom:28 }}>
            담당자께서 먼저 실제로 체험해보시고 판단하세요.<br/>
            로그인 없이 즉시 이용 가능합니다.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            {[
              { label:"🎙️ 보이스피싱 체험", href:"/crime/family-impersonation", color:"#ef4444" },
              { label:"📱 오카카톡 사칭 체험", href:"/crime/kakaotalk-impersonation", color:"#fbbf24" },
              { label:"🎰 도박 사이트 체험", href:"/gambling", color:"#a855f7" },
              { label:"🕵️ AI 영상 탐정 퀴즈", href:"/crime/ai-detective", color:"#22c55e" },
            ].map((b,i) => (
              <a key={i} href={b.href} style={{
                padding:"12px 22px", borderRadius:50, fontWeight:700, fontSize:14,
                background:`${b.color}22`, border:`1.5px solid ${b.color}66`,
                color:b.color, textDecoration:"none", whiteSpace:"nowrap" as const,
              }}>{b.label}</a>
            ))}
          </div>
        </div>

        {/* ── 공공기관 전용 안내 ── */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <p style={{ color:"#f97316", fontSize:12, fontWeight:700, letterSpacing:2, marginBottom:10 }}>FOR GOVERNMENT</p>
            <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:-0.8, color:"#1c0d2e", marginBottom:14 }}>공공기관 담당자분께</h2>
            <p style={{ color:"#64748b", fontSize:14, lineHeight:1.8 }}>공문, 예산 없이 도입 가능하도록 모든 절차를 간소화했습니다.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:20, marginBottom:24 }}>
            {/* 공문 안내 */}
            <div style={{ background:"#f8fafc", border:"2px solid #e2e8f0", borderRadius:20, padding:"28px 26px" }}>
              <div style={{ fontSize:32, marginBottom:14 }}>📋</div>
              <h3 style={{ color:"#1c0d2e", fontWeight:800, fontSize:18, marginBottom:10 }}>공문으로 협조 요청 가능</h3>
              <p style={{ color:"#64748b", fontSize:13, lineHeight:1.9, marginBottom:16 }}>
                기관 공문을 통해 공식 협력을 요청하실 수 있습니다.<br/>
                공문 수신처: <strong style={{ color:"#1c0d2e" }}>itnlifecn@gmail.com</strong><br/>
                공문 제목 예시: <em style={{ color:"#64748b" }}>"범죄예방 교육 프로그램 협력 요청의 건"</em>
              </p>
              <div style={{ background:"#f1f5f9", borderRadius:10, padding:"10px 14px" }}>
                <p style={{ color:"#475569", fontSize:12 }}>📌 공문 수신 후 48시간 내 공식 회신 드립니다</p>
              </div>
            </div>
            {/* 제안서 */}
            <div style={{ background:"#fff7ed", border:"2px solid #fed7aa", borderRadius:20, padding:"28px 26px" }}>
              <div style={{ fontSize:32, marginBottom:14 }}>📄</div>
              <h3 style={{ color:"#1c0d2e", fontWeight:800, fontSize:18, marginBottom:10 }}>기관 제안서 요청</h3>
              <p style={{ color:"#64748b", fontSize:13, lineHeight:1.9, marginBottom:16 }}>
                내부 결재용 제안서(PDF)를 무료로 제공드립니다.<br/>
                포함 내용: 프로그램 소개, 기대효과, 도입 방법, 비용(무료), 담당자 연락처
              </p>
              <a href="mailto:itnlifecn@gmail.com?subject=[제안서 요청] 기관명 기재&body=기관명: %0D%0A담당자명: %0D%0A연락처: %0D%0A제안서 수신 이메일: " style={{
                display:"block", textAlign:"center" as const, padding:"11px 0", borderRadius:10,
                background:"linear-gradient(135deg,#f97316,#ea580c)", color:"#fff",
                fontWeight:700, fontSize:13, textDecoration:"none",
              }}>📧 제안서 이메일로 요청하기</a>
            </div>
          </div>
          {/* 법적 근거 */}
          <div style={{ background:"#1c0d2e", borderRadius:20, padding:"28px 32px" }}>
            <p style={{ color:"#f97316", fontSize:12, fontWeight:800, letterSpacing:2, marginBottom:16 }}>⚖️ 법적 근거 — 범죄예방 교육의 의무성</p>
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap:14 }}>
              {[
                { law:"형사소송법 제197조의3", desc:"경찰의 범죄예방 활동 의무 명시", icon:"🚔" },
                { law:"청소년 보호법 제35조", desc:"학교·지자체의 청소년 범죄예방 교육 실시 권고", icon:"🎓" },
                { law:"금융소비자 보호법 제22조", desc:"금융기관의 금융범죄 예방 교육 의무화", icon:"🏦" },
              ].map((l,i) => (
                <div key={i} style={{ background:"#ffffff0a", borderRadius:12, padding:"16px" }}>
                  <div style={{ fontSize:22, marginBottom:8 }}>{l.icon}</div>
                  <p style={{ color:"#f97316", fontSize:11, fontWeight:700, marginBottom:4 }}>{l.law}</p>
                  <p style={{ color:"#94a3b8", fontSize:12, lineHeight:1.6 }}>{l.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ color:"#4b5563", fontSize:11, marginTop:16 }}>※ 위 법률 조항은 참고 목적이며, 실제 적용 여부는 각 기관의 법무 담당자와 확인하시기 바랍니다.</p>
          </div>
        </div>

        {/* Packages */}
        <div id="packages" style={{ marginBottom: 72 }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ color: "#f97316", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>PACKAGES</p>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -0.8, color: "#1c0d2e", marginBottom: 14 }}>
              {lang === "ko" ? "도입 패키지" : lang === "en" ? "Packages" : lang === "ja" ? "導入パッケージ" : lang === "zh" ? "引入套餐" : lang === "vi" ? "Các gói triển khai" : "Paquetes de Implementación"}
            </h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              {lang === "ko" ? "기관 규모와 목적에 따라 맞춤형으로 제안드립니다. 모든 패키지는 " : lang === "en" ? "We offer customized proposals based on your institution's size and purpose. All packages include " : lang === "ja" ? "機関の規模と目的に応じてカスタム提案をします。全てのパッケージに" : lang === "zh" ? "根据机构规模和目的提供定制方案。所有套餐均享受" : lang === "vi" ? "Chúng tôi đề xuất tùy chỉnh theo quy mô và mục đích của tổ chức. Tất cả các gói đều bao gồm " : "Ofrecemos propuestas personalizadas según el tamaño y propósito de su institución. Todos los paquetes incluyen "}
              <strong style={{ color: "#334155" }}>
                {lang === "ko" ? "교육 목적 비영리 기관 할인" : lang === "en" ? "nonprofit educational institution discounts" : lang === "ja" ? "教育目的非営利機関割引が適用されます" : lang === "zh" ? "教育目的非营利机构折扣" : lang === "vi" ? "chiết khấu cho tổ chức phi lợi nhuận vì mục đích giáo dục" : "descuentos para instituciones educativas sin ánimo de lucro"}
              </strong>
              {lang === "ko" ? "을 적용합니다." : lang === "en" ? "." : lang === "ja" ? "。" : lang === "zh" ? "。" : lang === "vi" ? "." : "."}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} style={{
                background: "#fdf8ff", borderRadius: 22, padding: "32px 28px",
                border: `2px solid ${pkg.color}30`,
                boxShadow: `0 4px 24px ${pkg.color}10`,
                display: "flex", flexDirection: "column",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
                  flexWrap: "wrap",
                }}>
                  <span style={{ color: "#1c0d2e", fontWeight: 800, fontSize: 20 }}>{pkg.name}</span>
                  <span style={{
                    fontSize: 10, padding: "3px 10px", borderRadius: 20, fontWeight: 700,
                    background: pkg.bg, color: pkg.color, border: `1px solid ${pkg.border}`,
                  }}>
                    {pkg.tag}
                  </span>
                </div>
                <p style={{ color: "#64748b", fontSize: 12, marginBottom: 20, lineHeight: 1.5 }}>
                  {lang === "ko" ? "추천 대상: " : lang === "en" ? "Recommended for: " : lang === "ja" ? "推奨対象: " : lang === "zh" ? "推荐对象: " : lang === "vi" ? "Đề xuất cho: " : "Recomendado para: "}
                  <strong style={{ color: "#334155" }}>{pkg.target}</strong>
                </p>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {pkg.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <CheckCircle size={15} color={pkg.color} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ color: "#334155", fontSize: 13, lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                  {pkg.notIncluded.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, opacity: 0.4 }}>
                      <div style={{ width: 15, height: 15, borderRadius: "50%", border: "1.5px solid #94a3b8", flexShrink: 0, marginTop: 1 }} />
                      <span style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#inquiry" style={{
                  display: "block", textAlign: "center",
                  padding: "13px 0", borderRadius: 12, fontWeight: 700, fontSize: 14,
                  background: pkg.bg, color: pkg.color,
                  border: `1.5px solid ${pkg.border}`,
                  textDecoration: "none", cursor: "pointer",
                }}>
                  {lang === "ko" ? "이 패키지로 문의하기" : lang === "en" ? "Inquire about this package" : lang === "ja" ? "このパッケージで問い合わせ" : lang === "zh" ? "咨询此套餐" : lang === "vi" ? "Hỏi về gói này" : "Consultar este paquete"}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiry Form */}
        <div id="inquiry" style={{
          background: "#fdf8ff", borderRadius: 24, padding: "48px 44px",
          border: "1px solid #e8e8ea", boxShadow: "0 4px 40px #00000010",
          position: "relative", overflow: "hidden",
        }}>
          {/* 황금 상단 강조 라인 */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:"linear-gradient(90deg, #9161b2, #7c3aed, #c58dc6)", borderRadius:"24px 24px 0 0" }} />
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 32 : 56, alignItems: "start" }}>

            {/* Left: Info */}
            <div>
              <p style={{ color: "#f97316", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>CONTACT</p>
              <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.6, color: "#1c0d2e", marginBottom: 16 }}>
                {lang === "ko" ? "도입 문의" : lang === "en" ? "Get in Touch" : lang === "ja" ? "導入問い合わせ" : lang === "zh" ? "联系我们" : lang === "vi" ? "Liên hệ" : "Contáctenos"}<br />
                {lang === "ko" ? "지금 바로 해주세요" : lang === "en" ? "Right Now" : lang === "ja" ? "今すぐどうぞ" : lang === "zh" ? "立即联系" : lang === "vi" ? "Ngay bây giờ" : "Ahora Mismo"}
              </h2>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.9, marginBottom: 32 }}>
                {lang === "ko" ? "양식을 작성하시면 " : lang === "en" ? "Fill out the form and we'll respond within " : lang === "ja" ? "フォームを入力いただければ" : lang === "zh" ? "填写表单后，我们将在" : lang === "vi" ? "Điền vào biểu mẫu và chúng tôi sẽ phản hồi trong vòng " : "Complete el formulario y responderemos en "}
                <strong style={{ color: "#334155" }}>
                  {lang === "ko" ? "24시간 내" : lang === "en" ? "24 hours" : lang === "ja" ? "24時間以内に" : lang === "zh" ? "24小时内" : lang === "vi" ? "24 giờ" : "24 horas"}
                </strong>
                {lang === "ko" ? "로" : lang === "en" ? "" : lang === "ja" ? "" : lang === "zh" ? "" : lang === "vi" ? "" : ""}
                <br />
                {lang === "ko" ? "맞춤형 제안서와 함께 답변드립니다." : lang === "en" ? " with a customized proposal." : lang === "ja" ? "カスタム提案書と共にご返答します。" : lang === "zh" ? "回复并附上定制提案。" : lang === "vi" ? " với đề xuất tùy chỉnh." : " con una propuesta personalizada."}
                <br />
                {lang === "ko" ? "상담 및 제안서 발송은 " : lang === "en" ? "Consultation and proposal are " : lang === "ja" ? "相談及び提案書送付は" : lang === "zh" ? "咨询和提案发送" : lang === "vi" ? "Tư vấn và gửi đề xuất là " : "La consulta y la propuesta son "}
                <strong style={{ color: "#334155" }}>
                  {lang === "ko" ? "완전 무료" : lang === "en" ? "completely free" : lang === "ja" ? "完全無料" : lang === "zh" ? "完全免费" : lang === "vi" ? "hoàn toàn miễn phí" : "completamente gratuitas"}
                </strong>
                {lang === "ko" ? "입니다." : lang === "en" ? "." : lang === "ja" ? "です。" : lang === "zh" ? "。" : lang === "vi" ? "." : "."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f5dfee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Mail size={17} color="#9161b2" />
                  </div>
                  <div>
                    <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>
                      {lang === "ko" ? "이메일" : lang === "en" ? "Email" : lang === "ja" ? "メール" : lang === "zh" ? "电子邮件" : lang === "vi" ? "Email" : "Correo electrónico"}
                    </p>
                    <p style={{ color: "#1c0d2e", fontWeight: 600, fontSize: 14 }}>itnlifecn@gmail.com</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Shield size={17} color="#059669" />
                  </div>
                  <div>
                    <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>
                      {lang === "ko" ? "운영 원칙" : lang === "en" ? "Operating Principle" : lang === "ja" ? "運営原則" : lang === "zh" ? "运营原则" : lang === "vi" ? "Nguyên tắc hoạt động" : "Principio Operativo"}
                    </p>
                    <p style={{ color: "#1c0d2e", fontWeight: 600, fontSize: 14 }}>
                      {lang === "ko" ? "교육 목적 무료 제공 우선" : lang === "en" ? "Education-first, free provision priority" : lang === "ja" ? "教育目的無料提供優先" : lang === "zh" ? "教育目的免费提供优先" : lang === "vi" ? "Ưu tiên cung cấp miễn phí vì mục đích giáo dục" : "Prioridad en provisión gratuita con fines educativos"}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#faf5ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Users size={17} color="#7c3aed" />
                  </div>
                  <div>
                    <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>
                      {lang === "ko" ? "제작" : lang === "en" ? "Made by" : lang === "ja" ? "制作" : lang === "zh" ? "制作" : lang === "vi" ? "Được tạo bởi" : "Creado por"}
                    </p>
                    <p style={{ color: "#1c0d2e", fontWeight: 600, fontSize: 14 }}>
                      {lang === "ko" ? "일반 시민 · AI Claude 협업" : lang === "en" ? "Citizen · AI Claude collaboration" : lang === "ja" ? "一般市民・AI Claude協業" : lang === "zh" ? "普通公民 · AI Claude协作" : lang === "vi" ? "Công dân · Cộng tác AI Claude" : "Ciudadano · Colaboración con AI Claude"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            {sent ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "60px 0", textAlign: "center", gap: 16,
              }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle size={32} color="#059669" />
                </div>
                <p style={{ color: "#1c0d2e", fontWeight: 800, fontSize: 20 }}>
                  {lang === "ko" ? "문의가 접수되었습니다" : lang === "en" ? "Inquiry received" : lang === "ja" ? "お問い合わせを受け付けました" : lang === "zh" ? "咨询已收到" : lang === "vi" ? "Đã nhận yêu cầu" : "Consulta recibida"}
                </p>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>
                  {lang === "ko" ? "24시간 내 이메일로 답변드리겠습니다." : lang === "en" ? "We'll reply by email within 24 hours." : lang === "ja" ? "24時間以内にメールでご返答します。" : lang === "zh" ? "我们将在24小时内通过电子邮件回复。" : lang === "vi" ? "Chúng tôi sẽ trả lời qua email trong vòng 24 giờ." : "Le responderemos por email en 24 horas."}<br />
                  {lang === "ko" ? "감사합니다." : lang === "en" ? "Thank you." : lang === "ja" ? "ありがとうございます。" : lang === "zh" ? "谢谢。" : lang === "vi" ? "Cảm ơn bạn." : "Gracias."}
                </p>
                <button
                  onClick={() => setSent(false)}
                  style={{ marginTop: 8, padding: "10px 24px", borderRadius: 10, background: "#f5dfee", color: "#f97316", border: "1px solid #dcc5e8", cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                >
                  {lang === "ko" ? "다시 문의하기" : lang === "en" ? "Submit Another Inquiry" : lang === "ja" ? "再度問い合わせ" : lang === "zh" ? "再次咨询" : lang === "vi" ? "Gửi yêu cầu khác" : "Enviar Otra Consulta"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {formFields.map((field) => (
                  <div key={field.key}>
                    <label style={{ color: "#475569", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>{field.label}</label>
                    <input
                      type={field.key === "email" ? "email" : "text"}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      style={{
                        width: "100%", padding: "12px 16px", borderRadius: 12,
                        border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1c0d2e",
                        background: "#f8fafc", outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#9161b2"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ color: "#475569", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
                    {lang === "ko" ? "문의 내용 *" : lang === "en" ? "Message *" : lang === "ja" ? "問い合わせ内容 *" : lang === "zh" ? "咨询内容 *" : lang === "vi" ? "Nội dung *" : "Mensaje *"}
                  </label>
                  <textarea
                    placeholder={lang === "ko" ? "도입 목적, 예상 교육 인원, 원하는 패키지 등을 자유롭게 작성해 주세요." : lang === "en" ? "Please describe your purpose, expected number of participants, preferred package, etc." : lang === "ja" ? "導入目的、予想教育人数、希望するパッケージなどを自由にご記入ください。" : lang === "zh" ? "请自由描述引入目的、预期培训人数、期望套餐等。" : lang === "vi" ? "Vui lòng mô tả mục đích, số người tham gia dự kiến, gói mong muốn, v.v." : "Describa el propósito, el número esperado de participantes, el paquete deseado, etc."}
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12,
                      border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1c0d2e",
                      background: "#f8fafc", outline: "none", resize: "vertical",
                      fontFamily: "inherit", boxSizing: "border-box",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#9161b2"}
                    onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "15px 0", borderRadius: 14,
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                    color: "#fff", border: "none", cursor: "pointer",
                    fontSize: 15, fontWeight: 700,
                    boxShadow: "0 4px 20px #9161b230",
                  }}
                >
                  <Send size={16} />
                  {lang === "ko" ? "문의 보내기" : lang === "en" ? "Send Inquiry" : lang === "ja" ? "問い合わせを送る" : lang === "zh" ? "发送咨询" : lang === "vi" ? "Gửi yêu cầu" : "Enviar Consulta"}
                </button>
                <p style={{ color: "#94a3b8", fontSize: 12, textAlign: "center" }}>
                  {lang === "ko" ? "제출 시 이메일 앱이 열립니다. 개인정보는 문의 답변 외에 사용되지 않습니다." : lang === "en" ? "Your email app will open upon submission. Personal information is only used to respond to your inquiry." : lang === "ja" ? "送信時にメールアプリが開きます。個人情報は問い合わせ返答以外に使用されません。" : lang === "zh" ? "提交时将打开电子邮件应用程序。个人信息仅用于回复咨询。" : lang === "vi" ? "Ứng dụng email sẽ mở khi gửi. Thông tin cá nhân chỉ được dùng để trả lời yêu cầu." : "Se abrirá su aplicación de email al enviar. La información personal solo se usa para responder su consulta."}
                </p>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        background: "#1c0d2e", padding: "32px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={14} color="#fff" />
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
            {lang === "ko" ? "범죄예방 체험관" : lang === "en" ? "Crime Prevention Experience Center" : lang === "ja" ? "犯罪予防体験館" : lang === "zh" ? "犯罪预防体验馆" : lang === "vi" ? "Trung tâm Trải nghiệm Phòng chống Tội phạm" : "Centro de Experiencias de Prevención del Crimen"}
          </span>
        </div>
        <p style={{ color: "#475569", fontSize: 13 }}>
          {lang === "ko" ? "교육 목적 무료 제공 원칙" : lang === "en" ? "Free educational provision principle" : lang === "ja" ? "教育目的無料提供原則" : lang === "zh" ? "教育目的免费提供原则" : lang === "vi" ? "Nguyên tắc cung cấp miễn phí vì mục đích giáo dục" : "Principio de provisión gratuita educativa"} · itnlifecn@gmail.com
        </p>
        <button onClick={() => router.push("/")} style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>
          ← {lang === "ko" ? "메인으로" : lang === "en" ? "Back to Main" : lang === "ja" ? "メインへ" : lang === "zh" ? "返回主页" : lang === "vi" ? "Về trang chính" : "Volver al Inicio"}
        </button>
      </div>

    </div>
  );
}
