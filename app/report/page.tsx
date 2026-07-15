"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, AlertTriangle } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

export default function ReportPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const REPORT_ITEMS = [
    {
      category:
        lang === "ko" ? "보이스피싱 · 전기통신 금융사기" :
        lang === "en" ? "Voice Phishing · Telecom Financial Fraud" :
        lang === "ja" ? "振り込め詐欺・通信金融詐欺" :
        lang === "zh" ? "电话诈骗·电信金融欺诈" :
        lang === "vi" ? "Lừa đảo qua điện thoại · Gian lận tài chính viễn thông" :
        "Phishing Telefónico · Fraude Financiero Telecomunicaciones",
      color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: "📞",
      agencies: [
        {
          name: lang === "ko" ? "경찰청 112" : lang === "en" ? "Police 112" : lang === "ja" ? "警察庁 112" : lang === "zh" ? "警察局 112" : lang === "vi" ? "Cảnh sát 112" : "Policía 112",
          desc: lang === "ko" ? "즉시 신고 · 계좌 지급정지 요청" : lang === "en" ? "Immediate report · Account freeze request" : lang === "ja" ? "即時通報・口座凍結申請" : lang === "zh" ? "立即举报·申请账户冻结" : lang === "vi" ? "Báo cáo ngay · Yêu cầu đóng băng tài khoản" : "Denuncia inmediata · Solicitud de congelación de cuenta",
          number: "112", url: "https://www.police.go.kr"
        },
        {
          name: lang === "ko" ? "금융감독원 1332" : lang === "en" ? "Financial Supervisory Service 1332" : lang === "ja" ? "金融監督院 1332" : lang === "zh" ? "金融监督院 1332" : lang === "vi" ? "Cơ quan giám sát tài chính 1332" : "Supervisión Financiera 1332",
          desc: lang === "ko" ? "피해 상담 · 계좌 지급정지 · 피해금 환급 신청" : lang === "en" ? "Victim counseling · Account freeze · Refund application" : lang === "ja" ? "被害相談・口座凍結・被害金返還申請" : lang === "zh" ? "受害咨询·账户冻结·申请退款" : lang === "vi" ? "Tư vấn nạn nhân · Đóng băng tài khoản · Yêu cầu hoàn tiền" : "Asesoría a víctimas · Congelación de cuenta · Solicitud de reembolso",
          number: "1332", url: "https://www.fss.or.kr"
        },
        {
          name: lang === "ko" ? "금융결제원 계좌정보통합관리" : lang === "en" ? "Korea Financial Telecommunications & Clearings Institute" : lang === "ja" ? "金融決済院 口座情報統合管理" : lang === "zh" ? "金融结算院账户信息综合管理" : lang === "vi" ? "Viện Thanh toán Tài chính Hàn Quốc" : "Instituto de Telecomunicaciones Financieras de Corea",
          desc: lang === "ko" ? "내 명의 계좌 전체 확인·해지" : lang === "en" ? "Check and close all accounts in your name" : lang === "ja" ? "自分名義の口座全確認・解約" : lang === "zh" ? "查看并注销名下所有账户" : lang === "vi" ? "Kiểm tra và đóng tất cả tài khoản mang tên bạn" : "Verificar y cerrar todas las cuentas a tu nombre",
          number: null, url: "https://www.payinfo.or.kr"
        },
      ],
      steps: [
        lang === "ko" ? "즉시 112 또는 1332에 전화해 계좌 지급정지를 요청하세요" : lang === "en" ? "Call 112 or 1332 immediately to request account freeze" : lang === "ja" ? "すぐに112または1332に電話して口座凍結を申請してください" : lang === "zh" ? "立即拨打112或1332申请账户冻结" : lang === "vi" ? "Gọi ngay 112 hoặc 1332 để yêu cầu đóng băng tài khoản" : "Llama al 112 o 1332 de inmediato para solicitar la congelación de cuenta",
        lang === "ko" ? "피해 입금 계좌번호·금액·날짜를 메모해 두세요" : lang === "en" ? "Note the account number, amount, and date of the fraudulent transfer" : lang === "ja" ? "被害入金の口座番号・金額・日付をメモしてください" : lang === "zh" ? "记录被骗账户号码、金额和日期" : lang === "vi" ? "Ghi lại số tài khoản, số tiền và ngày giao dịch bị lừa" : "Anota el número de cuenta, monto y fecha de la transferencia fraudulenta",
        lang === "ko" ? "경찰서에 방문해 피해신고서를 작성하세요" : lang === "en" ? "Visit a police station to file a victim report" : lang === "ja" ? "警察署を訪問して被害申告書を作成してください" : lang === "zh" ? "前往派出所填写受害报告" : lang === "vi" ? "Đến đồn cảnh sát để lập biên bản tố cáo" : "Ve a una comisaría para presentar el informe de víctima",
        lang === "ko" ? "금감원 보이스피싱 지킴이 사이트에서 피해금 환급을 신청하세요" : lang === "en" ? "Apply for a refund on the FSS voice phishing guardian website" : lang === "ja" ? "金融監督院のボイスフィッシング守護サイトで被害金返還を申請してください" : lang === "zh" ? "在金融监督院语音钓鱼守护网站申请退款" : lang === "vi" ? "Nộp đơn hoàn tiền trên trang web bảo vệ lừa đảo điện thoại của FSS" : "Solicita el reembolso en el sitio de protección contra phishing telefónico de la FSS",
      ],
    },
    {
      category:
        lang === "ko" ? "불법 도박 · 도박 중독" :
        lang === "en" ? "Illegal Gambling · Gambling Addiction" :
        lang === "ja" ? "違法ギャンブル・ギャンブル依存症" :
        lang === "zh" ? "非法赌博·赌博成瘾" :
        lang === "vi" ? "Cờ bạc bất hợp pháp · Nghiện cờ bạc" :
        "Juego Ilegal · Adicción al Juego",
      color: "#7c3aed", bg: "#faf5ff", border: "#ddd6fe", icon: "🎰",
      agencies: [
        {
          name: lang === "ko" ? "한국도박문제관리센터 1336" : lang === "en" ? "Korea Center on Gambling Problems 1336" : lang === "ja" ? "韓国ギャンブル問題管理センター 1336" : lang === "zh" ? "韩国赌博问题管理中心 1336" : lang === "vi" ? "Trung tâm Quản lý Vấn đề Cờ bạc Hàn Quốc 1336" : "Centro de Problemas de Juego de Corea 1336",
          desc: lang === "ko" ? "24시간 무료 상담 · 치료 연계 · 가족 상담" : lang === "en" ? "24-hour free counseling · Treatment referral · Family counseling" : lang === "ja" ? "24時間無料相談・治療連携・家族相談" : lang === "zh" ? "24小时免费咨询·转介治疗·家庭咨询" : lang === "vi" ? "Tư vấn miễn phí 24h · Giới thiệu điều trị · Tư vấn gia đình" : "Asesoría gratuita 24h · Derivación a tratamiento · Asesoría familiar",
          number: "1336", url: "https://www.kcgp.or.kr"
        },
        {
          name: lang === "ko" ? "경찰청 사이버수사대 182" : lang === "en" ? "Police Cyber Investigation Unit 182" : lang === "ja" ? "警察庁サイバー捜査隊 182" : lang === "zh" ? "警察局网络侦查队 182" : lang === "vi" ? "Đội điều tra mạng của cảnh sát 182" : "Unidad de Investigación Cibernética de la Policía 182",
          desc: lang === "ko" ? "불법 도박 사이트 신고" : lang === "en" ? "Report illegal gambling sites" : lang === "ja" ? "違法ギャンブルサイト通報" : lang === "zh" ? "举报非法赌博网站" : lang === "vi" ? "Báo cáo các trang cờ bạc bất hợp pháp" : "Reportar sitios de juego ilegal",
          number: "182", url: "https://ecrm.police.go.kr"
        },
        {
          name: lang === "ko" ? "사행산업통합감독위원회" : lang === "en" ? "National Gambling Control Commission" : lang === "ja" ? "射幸産業統合監督委員会" : lang === "zh" ? "博彩产业综合监管委员会" : lang === "vi" ? "Ủy ban Kiểm soát Cờ bạc Quốc gia" : "Comisión Nacional de Control de Juegos de Azar",
          desc: lang === "ko" ? "불법 사행산업 신고" : lang === "en" ? "Report illegal gambling industry" : lang === "ja" ? "違法射幸産業通報" : lang === "zh" ? "举报非法博彩产业" : lang === "vi" ? "Báo cáo ngành cờ bạc bất hợp pháp" : "Reportar la industria de juego ilegal",
          number: null, url: "https://www.ngcc.go.kr"
        },
      ],
      steps: [
        lang === "ko" ? "1336으로 전화해 즉시 상담을 받으세요 (24시간, 무료, 익명 가능)" : lang === "en" ? "Call 1336 for immediate counseling (24 hours, free, anonymous)" : lang === "ja" ? "1336に電話して即時相談を受けてください（24時間、無料、匿名可能）" : lang === "zh" ? "拨打1336立即获得咨询（24小时、免费、可匿名）" : lang === "vi" ? "Gọi 1336 để được tư vấn ngay (24 giờ, miễn phí, có thể ẩn danh)" : "Llama al 1336 para asesoría inmediata (24 horas, gratuita, anónima)",
        lang === "ko" ? "불법 도박 사이트 주소를 캡처해 경찰청 사이버수사대에 신고하세요" : lang === "en" ? "Screenshot the illegal gambling site URL and report to the police cyber unit" : lang === "ja" ? "違法ギャンブルサイトのURLをキャプチャして警察庁サイバー捜査隊に通報してください" : lang === "zh" ? "截图非法赌博网站地址并向警方网络侦查队举报" : lang === "vi" ? "Chụp ảnh URL trang cờ bạc bất hợp pháp và báo cáo cho đội mạng của cảnh sát" : "Captura la URL del sitio de juego ilegal y repórtala a la unidad cibernética de la policía",
        lang === "ko" ? "도박 앱은 즉시 삭제하고 관련 계정을 탈퇴하세요" : lang === "en" ? "Delete gambling apps immediately and close related accounts" : lang === "ja" ? "ギャンブルアプリを即時削除し、関連アカウントを退会してください" : lang === "zh" ? "立即删除赌博应用并注销相关账户" : lang === "vi" ? "Xóa ngay ứng dụng cờ bạc và đóng các tài khoản liên quan" : "Elimina las apps de juego de inmediato y cierra las cuentas relacionadas",
        lang === "ko" ? "가족과 함께 KCGP 가족 상담 프로그램을 이용하세요" : lang === "en" ? "Use the KCGP family counseling program with your family" : lang === "ja" ? "家族とともにKCGP家族相談プログラムを利用してください" : lang === "zh" ? "与家人一起使用KCGP家庭咨询计划" : lang === "vi" ? "Sử dụng chương trình tư vấn gia đình KCGP cùng gia đình" : "Utiliza el programa de asesoría familiar de KCGP con tu familia",
      ],
    },
    {
      category:
        lang === "ko" ? "스미싱 · 악성앱 · 개인정보 유출" :
        lang === "en" ? "Smishing · Malware · Personal Data Leak" :
        lang === "ja" ? "スミッシング・悪性アプリ・個人情報流出" :
        lang === "zh" ? "短信钓鱼·恶意应用·个人信息泄露" :
        lang === "vi" ? "SMS lừa đảo · Phần mềm độc hại · Rò rỉ dữ liệu cá nhân" :
        "Smishing · Malware · Filtración de Datos Personales",
      color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", icon: "📱",
      agencies: [
        {
          name: lang === "ko" ? "한국인터넷진흥원(KISA) 118" : lang === "en" ? "Korea Internet & Security Agency (KISA) 118" : lang === "ja" ? "韓国インターネット振興院(KISA) 118" : lang === "zh" ? "韩国互联网振兴院(KISA) 118" : lang === "vi" ? "Cơ quan An ninh & Internet Hàn Quốc (KISA) 118" : "Agencia de Seguridad e Internet de Corea (KISA) 118",
          desc: lang === "ko" ? "스미싱·해킹·악성앱·개인정보 유출 신고" : lang === "en" ? "Report smishing, hacking, malware, and data leaks" : lang === "ja" ? "スミッシング・ハッキング・悪性アプリ・個人情報流出通報" : lang === "zh" ? "举报短信钓鱼、黑客、恶意应用和数据泄露" : lang === "vi" ? "Báo cáo smishing, hack, phần mềm độc hại và rò rỉ dữ liệu" : "Reportar smishing, hackeo, malware y filtraciones de datos",
          number: "118", url: "https://www.kisa.or.kr"
        },
        {
          name: lang === "ko" ? "경찰청 사이버수사대 182" : lang === "en" ? "Police Cyber Investigation Unit 182" : lang === "ja" ? "警察庁サイバー捜査隊 182" : lang === "zh" ? "警察局网络侦查队 182" : lang === "vi" ? "Đội điều tra mạng của cảnh sát 182" : "Unidad de Investigación Cibernética de la Policía 182",
          desc: lang === "ko" ? "사이버 범죄 신고" : lang === "en" ? "Report cybercrime" : lang === "ja" ? "サイバー犯罪通報" : lang === "zh" ? "举报网络犯罪" : lang === "vi" ? "Báo cáo tội phạm mạng" : "Reportar cibercrimen",
          number: "182", url: "https://ecrm.police.go.kr"
        },
        {
          name: lang === "ko" ? "개인정보보호위원회" : lang === "en" ? "Personal Information Protection Commission" : lang === "ja" ? "個人情報保護委員会" : lang === "zh" ? "个人信息保护委员会" : lang === "vi" ? "Ủy ban Bảo vệ Thông tin Cá nhân" : "Comisión de Protección de Datos Personales",
          desc: lang === "ko" ? "개인정보 침해 신고" : lang === "en" ? "Report personal data breach" : lang === "ja" ? "個人情報侵害通報" : lang === "zh" ? "举报个人信息侵害" : lang === "vi" ? "Báo cáo vi phạm dữ liệu cá nhân" : "Reportar violación de datos personales",
          number: null, url: "https://www.pipc.go.kr"
        },
      ],
      steps: [
        lang === "ko" ? "악성 앱 설치 시 즉시 스마트폰을 비행기 모드로 전환하세요" : lang === "en" ? "If a malicious app is installed, immediately switch your phone to airplane mode" : lang === "ja" ? "悪性アプリのインストール時は即座にスマートフォンを機内モードに切り替えてください" : lang === "zh" ? "安装恶意应用后立即将手机切换到飞行模式" : lang === "vi" ? "Nếu cài ứng dụng độc hại, hãy ngay lập tức chuyển điện thoại sang chế độ máy bay" : "Si se instala una app maliciosa, cambia tu teléfono al modo avión inmediatamente",
        lang === "ko" ? "118에 전화해 악성앱 제거 방법을 안내받으세요" : lang === "en" ? "Call 118 for guidance on removing the malicious app" : lang === "ja" ? "118に電話して悪性アプリの削除方法の案内を受けてください" : lang === "zh" ? "拨打118获取删除恶意应用的指导" : lang === "vi" ? "Gọi 118 để được hướng dẫn cách xóa ứng dụng độc hại" : "Llama al 118 para recibir orientación sobre cómo eliminar la app maliciosa",
        lang === "ko" ? "금융앱·인터넷뱅킹 비밀번호를 즉시 변경하세요" : lang === "en" ? "Change your banking app and internet banking passwords immediately" : lang === "ja" ? "金融アプリ・インターネットバンキングのパスワードを即時変更してください" : lang === "zh" ? "立即更改金融应用和网上银行密码" : lang === "vi" ? "Thay đổi ngay mật khẩu ứng dụng ngân hàng và internet banking" : "Cambia de inmediato las contraseñas de tu app bancaria e internet banking",
        lang === "ko" ? "통신사에 명의도용 여부를 확인하세요" : lang === "en" ? "Check with your telecom provider for identity theft" : lang === "ja" ? "通信会社に名義盗用の有無を確認してください" : lang === "zh" ? "向电信运营商确认是否存在身份盗用" : lang === "vi" ? "Kiểm tra với nhà mạng xem có bị đánh cắp danh tính không" : "Verifica con tu operadora de telefonía si hay robo de identidad",
      ],
    },
    {
      category:
        lang === "ko" ? "투자 사기 · 주식리딩방" :
        lang === "en" ? "Investment Fraud · Stock Tips Scam" :
        lang === "ja" ? "投資詐欺・株式リーディングルーム" :
        lang === "zh" ? "投资诈骗·股票荐股群" :
        lang === "vi" ? "Lừa đảo đầu tư · Nhóm tư vấn chứng khoán" :
        "Fraude de Inversión · Estafa de Consejos de Bolsa",
      color: "#059669", bg: "#f0fdf4", border: "#bbf7d0", icon: "📈",
      agencies: [
        {
          name: lang === "ko" ? "금융감독원 1332" : lang === "en" ? "Financial Supervisory Service 1332" : lang === "ja" ? "金融監督院 1332" : lang === "zh" ? "金融监督院 1332" : lang === "vi" ? "Cơ quan giám sát tài chính 1332" : "Supervisión Financiera 1332",
          desc: lang === "ko" ? "불법 투자 사기 · 유사수신 신고 · 피해 상담" : lang === "en" ? "Report illegal investment fraud, quasi-deposits, and victim counseling" : lang === "ja" ? "違法投資詐欺・類似受信申告・被害相談" : lang === "zh" ? "举报非法投资欺诈、类储蓄诈骗及受害咨询" : lang === "vi" ? "Báo cáo lừa đảo đầu tư bất hợp pháp, nhận tiền trái phép và tư vấn nạn nhân" : "Reportar fraude de inversión ilegal, cuasi-depósitos y asesoría a víctimas",
          number: "1332", url: "https://www.fss.or.kr"
        },
        {
          name: lang === "ko" ? "경찰청 112" : lang === "en" ? "Police 112" : lang === "ja" ? "警察庁 112" : lang === "zh" ? "警察局 112" : lang === "vi" ? "Cảnh sát 112" : "Policía 112",
          desc: lang === "ko" ? "사기 피해 형사 고소" : lang === "en" ? "File a criminal complaint for fraud" : lang === "ja" ? "詐欺被害の刑事告訴" : lang === "zh" ? "就诈骗受害提起刑事诉讼" : lang === "vi" ? "Nộp đơn tố cáo hình sự về lừa đảo" : "Presentar denuncia penal por fraude",
          number: "112", url: "https://www.police.go.kr"
        },
        {
          name: lang === "ko" ? "한국소비자원 1372" : lang === "en" ? "Korea Consumer Agency 1372" : lang === "ja" ? "韓国消費者院 1372" : lang === "zh" ? "韩国消费者院 1372" : lang === "vi" ? "Cơ quan Bảo vệ Người tiêu dùng Hàn Quốc 1372" : "Agencia del Consumidor de Corea 1372",
          desc: lang === "ko" ? "소비자 피해 구제 신청" : lang === "en" ? "Apply for consumer damage relief" : lang === "ja" ? "消費者被害救済申請" : lang === "zh" ? "申请消费者损害赔偿" : lang === "vi" ? "Nộp đơn xin bồi thường thiệt hại cho người tiêu dùng" : "Solicitar reparación de daños al consumidor",
          number: "1372", url: "https://www.kca.go.kr"
        },
      ],
      steps: [
        lang === "ko" ? "피해 금액·입금 내역·대화 내용을 모두 캡처해 보관하세요" : lang === "en" ? "Screenshot and save all loss amounts, transfer records, and conversations" : lang === "ja" ? "被害金額・入金履歴・会話内容をすべてキャプチャして保管してください" : lang === "zh" ? "截图并保存所有损失金额、转账记录和对话内容" : lang === "vi" ? "Chụp ảnh và lưu tất cả số tiền thiệt hại, lịch sử chuyển khoản và nội dung trò chuyện" : "Captura y guarda todos los montos perdidos, registros de transferencias y conversaciones",
        lang === "ko" ? "금감원 1332에 전화해 해당 업체의 인가 여부를 확인하세요" : lang === "en" ? "Call FSS 1332 to verify if the company is licensed" : lang === "ja" ? "金融監督院1332に電話して当該業者の認可有無を確認してください" : lang === "zh" ? "拨打金融监督院1332确认该公司是否获得许可" : lang === "vi" ? "Gọi FSS 1332 để xác minh công ty có được cấp phép không" : "Llama al FSS 1332 para verificar si la empresa tiene licencia",
        lang === "ko" ? "경찰서에 방문해 사기죄로 형사 고소하세요" : lang === "en" ? "Visit a police station to file a criminal complaint for fraud" : lang === "ja" ? "警察署を訪問して詐欺罪で刑事告訴してください" : lang === "zh" ? "前往派出所以诈骗罪提起刑事诉讼" : lang === "vi" ? "Đến đồn cảnh sát để tố cáo hình sự về tội lừa đảo" : "Ve a una comisaría para presentar una denuncia penal por fraude",
        lang === "ko" ? "법무부 법률구조공단(132)에서 무료 법률 상담을 받으세요" : lang === "en" ? "Get free legal counseling at the Legal Aid Corporation (132)" : lang === "ja" ? "法務部法律救助公団(132)で無料法律相談を受けてください" : lang === "zh" ? "在司法部法律援助公团(132)获得免费法律咨询" : lang === "vi" ? "Nhận tư vấn pháp lý miễn phí tại Tổ chức Hỗ trợ Pháp lý (132)" : "Obtén asesoría legal gratuita en la Corporación de Asistencia Legal (132)",
      ],
    },
    {
      category:
        lang === "ko" ? "로맨스 스캠 · 메신저 사기" :
        lang === "en" ? "Romance Scam · Messenger Fraud" :
        lang === "ja" ? "ロマンス詐欺・メッセンジャー詐欺" :
        lang === "zh" ? "恋爱诈骗·即时通讯诈骗" :
        lang === "vi" ? "Lừa đảo tình cảm · Gian lận tin nhắn" :
        "Estafa Romántica · Fraude por Mensajería",
      color: "#db2777", bg: "#fdf2f8", border: "#fbcfe8", icon: "💝",
      agencies: [
        {
          name: lang === "ko" ? "경찰청 112" : lang === "en" ? "Police 112" : lang === "ja" ? "警察庁 112" : lang === "zh" ? "警察局 112" : lang === "vi" ? "Cảnh sát 112" : "Policía 112",
          desc: lang === "ko" ? "사기죄 형사 고소 · 계좌 지급정지" : lang === "en" ? "File fraud complaint · Account freeze" : lang === "ja" ? "詐欺罪刑事告訴・口座凍結" : lang === "zh" ? "提起诈骗刑事诉讼·账户冻结" : lang === "vi" ? "Nộp đơn tố cáo lừa đảo · Đóng băng tài khoản" : "Presentar denuncia por fraude · Congelación de cuenta",
          number: "112", url: "https://www.police.go.kr"
        },
        {
          name: lang === "ko" ? "금융감독원 1332" : lang === "en" ? "Financial Supervisory Service 1332" : lang === "ja" ? "金融監督院 1332" : lang === "zh" ? "金融监督院 1332" : lang === "vi" ? "Cơ quan giám sát tài chính 1332" : "Supervisión Financiera 1332",
          desc: lang === "ko" ? "피해 계좌 지급정지 요청" : lang === "en" ? "Request freeze of victim account" : lang === "ja" ? "被害口座凍結申請" : lang === "zh" ? "申请冻结受害账户" : lang === "vi" ? "Yêu cầu đóng băng tài khoản bị hại" : "Solicitar congelación de cuenta de la víctima",
          number: "1332", url: "https://www.fss.or.kr"
        },
        {
          name: lang === "ko" ? "오카카 고객센터" : lang === "en" ? "Kakao Customer Center" : lang === "ja" ? "カカオカスタマーセンター" : lang === "zh" ? "Kakao客服中心" : lang === "vi" ? "Trung tâm hỗ trợ Kakao" : "Centro de Atención al Cliente de Kakao",
          desc: lang === "ko" ? "사기 계정 신고 (오카카톡 앱 내 신고)" : lang === "en" ? "Report fraud account (in-app reporting on KakaoTalk)" : lang === "ja" ? "詐欺アカウント通報（カカオトークアプリ内通報）" : lang === "zh" ? "举报诈骗账户（在KakaoTalk应用内举报）" : lang === "vi" ? "Báo cáo tài khoản lừa đảo (báo cáo trong app KakaoTalk)" : "Reportar cuenta fraudulenta (en la app KakaoTalk)",
          number: null, url: "https://cs.kakao.com"
        },
      ],
      steps: [
        lang === "ko" ? "상대방과의 모든 대화 내용을 캡처해 보관하세요" : lang === "en" ? "Screenshot and save all conversations with the other party" : lang === "ja" ? "相手とのすべての会話内容をキャプチャして保管してください" : lang === "zh" ? "截图并保存与对方的所有对话内容" : lang === "vi" ? "Chụp ảnh và lưu tất cả nội dung trò chuyện với đối phương" : "Captura y guarda todas las conversaciones con la otra parte",
        lang === "ko" ? "상대방 계좌로 이체한 금액이 있다면 즉시 112에 신고하세요" : lang === "en" ? "If you transferred money to the other party, report to 112 immediately" : lang === "ja" ? "相手の口座に送金した金額があればすぐに112に通報してください" : lang === "zh" ? "如果向对方账户转账，请立即拨打112举报" : lang === "vi" ? "Nếu đã chuyển tiền cho đối phương, hãy báo cáo ngay cho 112" : "Si transferiste dinero a la otra parte, repórtalo al 112 de inmediato",
        lang === "ko" ? "오카카톡·SNS 계정을 즉시 신고·차단하세요" : lang === "en" ? "Report and block the KakaoTalk/SNS account immediately" : lang === "ja" ? "カカオトーク・SNSアカウントを即時通報・ブロックしてください" : lang === "zh" ? "立即举报并屏蔽KakaoTalk/SNS账户" : lang === "vi" ? "Báo cáo và chặn ngay tài khoản KakaoTalk/SNS" : "Reporta y bloquea la cuenta de KakaoTalk/SNS de inmediato",
        lang === "ko" ? "수치심을 느낄 필요 없습니다. 이건 당신의 잘못이 아닙니다." : lang === "en" ? "You don't need to feel ashamed. This is not your fault." : lang === "ja" ? "恥ずかしく感じる必要はありません。これはあなたのせいではありません。" : lang === "zh" ? "不需要感到羞耻。这不是你的错。" : lang === "vi" ? "Bạn không cần cảm thấy xấu hổ. Đây không phải lỗi của bạn." : "No necesitas sentir vergüenza. Esto no es tu culpa.",
      ],
    },
    {
      category:
        lang === "ko" ? "중고거래 사기" :
        lang === "en" ? "Second-hand Trade Fraud" :
        lang === "ja" ? "中古取引詐欺" :
        lang === "zh" ? "二手交易诈骗" :
        lang === "vi" ? "Lừa đảo mua bán đồ cũ" :
        "Fraude en Compraventa de Segunda Mano",
      color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", icon: "📦",
      agencies: [
        {
          name: lang === "ko" ? "경찰청 사이버수사대 182" : lang === "en" ? "Police Cyber Investigation Unit 182" : lang === "ja" ? "警察庁サイバー捜査隊 182" : lang === "zh" ? "警察局网络侦查队 182" : lang === "vi" ? "Đội điều tra mạng của cảnh sát 182" : "Unidad de Investigación Cibernética de la Policía 182",
          desc: lang === "ko" ? "온라인 사기 신고 (인터넷으로도 가능)" : lang === "en" ? "Report online fraud (also available online)" : lang === "ja" ? "オンライン詐欺通報（インターネットでも可能）" : lang === "zh" ? "举报网络诈骗（也可在线举报）" : lang === "vi" ? "Báo cáo lừa đảo trực tuyến (cũng có thể báo trực tuyến)" : "Reportar fraude en línea (también disponible por internet)",
          number: "182", url: "https://ecrm.police.go.kr"
        },
        {
          name: lang === "ko" ? "더치트 (사기피해 공유)" : lang === "en" ? "TheCheat (Fraud Sharing Site)" : lang === "ja" ? "ザチート（詐欺被害共有）" : lang === "zh" ? "TheCheat（诈骗信息共享网站）" : lang === "vi" ? "TheCheat (Trang chia sẻ lừa đảo)" : "TheCheat (Sitio de Denuncia de Fraudes)",
          desc: lang === "ko" ? "사기꾼 계좌·전화번호 공유 사이트" : lang === "en" ? "Site for sharing scammer account numbers and phone numbers" : lang === "ja" ? "詐欺師の口座・電話番号共有サイト" : lang === "zh" ? "共享诈骗犯账户和电话号码的网站" : lang === "vi" ? "Trang chia sẻ số tài khoản và số điện thoại của kẻ lừa đảo" : "Sitio para compartir cuentas bancarias y teléfonos de estafadores",
          number: null, url: "https://thecheat.co.kr"
        },
        {
          name: lang === "ko" ? "경찰청 112" : lang === "en" ? "Police 112" : lang === "ja" ? "警察庁 112" : lang === "zh" ? "警察局 112" : lang === "vi" ? "Cảnh sát 112" : "Policía 112",
          desc: lang === "ko" ? "사기 피해 형사 고소" : lang === "en" ? "File a criminal complaint for fraud" : lang === "ja" ? "詐欺被害の刑事告訴" : lang === "zh" ? "就诈骗受害提起刑事诉讼" : lang === "vi" ? "Nộp đơn tố cáo hình sự về lừa đảo" : "Presentar denuncia penal por fraude",
          number: "112", url: "https://www.police.go.kr"
        },
      ],
      steps: [
        lang === "ko" ? "거래 내역·대화·입금 영수증을 모두 캡처해 보관하세요" : lang === "en" ? "Screenshot and save all transaction records, conversations, and receipts" : lang === "ja" ? "取引履歴・会話・入金領収書をすべてキャプチャして保管してください" : lang === "zh" ? "截图并保存所有交易记录、对话和收款收据" : lang === "vi" ? "Chụp ảnh và lưu tất cả lịch sử giao dịch, trò chuyện và biên lai" : "Captura y guarda todos los registros de transacciones, conversaciones y recibos",
        lang === "ko" ? "더치트(thecheat.co.kr)에서 해당 계좌·번호를 조회하세요" : lang === "en" ? "Look up the account or phone number on TheCheat (thecheat.co.kr)" : lang === "ja" ? "ザチート(thecheat.co.kr)で当該口座・番号を照会してください" : lang === "zh" ? "在TheCheat(thecheat.co.kr)查询该账户或号码" : lang === "vi" ? "Tra cứu số tài khoản hoặc số điện thoại trên TheCheat (thecheat.co.kr)" : "Busca la cuenta o número de teléfono en TheCheat (thecheat.co.kr)",
        lang === "ko" ? "경찰청 사이버수사대(ecrm.police.go.kr)에 온라인으로 신고하세요" : lang === "en" ? "Report online to the Police Cyber Investigation Unit (ecrm.police.go.kr)" : lang === "ja" ? "警察庁サイバー捜査隊(ecrm.police.go.kr)にオンラインで通報してください" : lang === "zh" ? "在线向警方网络侦查队(ecrm.police.go.kr)举报" : lang === "vi" ? "Báo cáo trực tuyến cho Đội điều tra mạng của cảnh sát (ecrm.police.go.kr)" : "Reporta en línea a la Unidad de Investigación Cibernética (ecrm.police.go.kr)",
        lang === "ko" ? "금액이 크다면 경찰서 방문 후 형사 고소하세요" : lang === "en" ? "If the amount is large, visit a police station to file a criminal complaint" : lang === "ja" ? "金額が大きければ警察署を訪問後に刑事告訴してください" : lang === "zh" ? "如果金额较大，请前往派出所提起刑事诉讼" : lang === "vi" ? "Nếu số tiền lớn, hãy đến đồn cảnh sát để tố cáo hình sự" : "Si el monto es grande, ve a una comisaría para presentar una denuncia penal",
      ],
    },
  ];

  const quickLinks = [
    { n: "112", l: lang === "ko" ? "경찰청" : lang === "en" ? "Police" : lang === "ja" ? "警察庁" : lang === "zh" ? "警察局" : lang === "vi" ? "Cảnh sát" : "Policía" },
    { n: "1332", l: lang === "ko" ? "금융감독원" : lang === "en" ? "FSS" : lang === "ja" ? "金融監督院" : lang === "zh" ? "金融监督院" : lang === "vi" ? "FSS" : "FSS" },
    { n: "118", l: lang === "ko" ? "인터넷진흥원" : lang === "en" ? "KISA" : lang === "ja" ? "インターネット振興院" : lang === "zh" ? "互联网振兴院" : lang === "vi" ? "KISA" : "KISA" },
    { n: "1336", l: lang === "ko" ? "도박중독상담" : lang === "en" ? "Gambling Help" : lang === "ja" ? "ギャンブル相談" : lang === "zh" ? "赌博咨询" : lang === "vi" ? "Tư vấn cờ bạc" : "Ayuda al Juego" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", color: "#1e293b" }}>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", gap: 12,
        padding: isMobile ? "0 16px" : "0 40px", height: 62, boxShadow: "0 1px 8px #0000000a",
      }}>
        <button onClick={() => router.push("/")} style={{ padding: 8, background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", borderRadius: 8 }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #dc2626, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AlertTriangle size={14} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
          {lang === "ko" ? "2차 피해 예방 · 신고 안내" : lang === "en" ? "Secondary Damage Prevention · Report Guide" : lang === "ja" ? "二次被害防止・通報案内" : lang === "zh" ? "二次受害预防·举报指南" : lang === "vi" ? "Ngăn ngừa thiệt hại thứ cấp · Hướng dẫn tố cáo" : "Prevención de Daños Secundarios · Guía de Denuncia"}
        </span>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "28px 16px 80px" : "52px 40px 80px" }}>
        <div style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)", borderRadius: 20, padding: "28px 32px", marginBottom: 40, boxShadow: "0 4px 24px #dc262630" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 36, flexShrink: 0 }}>🆘</span>
            <div>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 20, marginBottom: 10 }}>
                {lang === "ko" ? "이미 피해를 당하셨나요? 지금 당장 신고하세요." : lang === "en" ? "Have you already been victimized? Report it right now." : lang === "ja" ? "すでに被害に遭いましたか？今すぐ通報してください。" : lang === "zh" ? "您已经受害了吗？现在立即举报。" : lang === "vi" ? "Bạn đã bị lừa rồi? Hãy báo cáo ngay bây giờ." : "¿Ya has sido víctima? Repórtalo ahora mismo."}
              </p>
              <p style={{ color: "#fca5a5", fontSize: 14, lineHeight: 1.9 }}>
                {lang === "ko" ? <>신고가 빠를수록 <strong style={{ color: "#fff" }}>계좌 지급정지로 피해금 환급</strong> 가능성이 높아집니다.<br />창피하거나 무서울 필요 없습니다. <strong style={{ color: "#fff" }}>범죄 피해는 당신의 잘못이 아닙니다.</strong></> :
                 lang === "en" ? <>The faster you report, <strong style={{ color: "#fff" }}>the higher the chance of recovering funds through account freeze</strong>.<br />There's no need to feel embarrassed or scared. <strong style={{ color: "#fff" }}>Being a crime victim is not your fault.</strong></> :
                 lang === "ja" ? <>通報が早いほど、<strong style={{ color: "#fff" }}>口座凍結による被害金回収</strong>の可能性が高まります。<br />恥ずかしがったり怖がる必要はありません。<strong style={{ color: "#fff" }}>犯罪被害はあなたのせいではありません。</strong></> :
                 lang === "zh" ? <>举报越快，<strong style={{ color: "#fff" }}>通过账户冻结追回损失</strong>的可能性越大。<br />不需要感到尴尬或害怕。<strong style={{ color: "#fff" }}>成为犯罪受害者不是您的错。</strong></> :
                 lang === "vi" ? <>Báo cáo càng nhanh, <strong style={{ color: "#fff" }}>khả năng thu hồi tiền qua đóng băng tài khoản</strong> càng cao.<br />Không cần phải xấu hổ hay sợ hãi. <strong style={{ color: "#fff" }}>Bị hại vì tội phạm không phải lỗi của bạn.</strong></> :
                 <>Cuanto antes lo reportes, <strong style={{ color: "#fff" }}>mayor es la posibilidad de recuperar fondos mediante la congelación de cuenta</strong>.<br />No tienes que sentirte avergonzado ni asustado. <strong style={{ color: "#fff" }}>Ser víctima de un delito no es tu culpa.</strong></>}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            {quickLinks.map((r) => (
              <a key={r.n} href={`tel:${r.n}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "12px 20px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", minWidth: 80 }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: 24 }}>{r.n}</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 }}>{r.l}</span>
              </a>
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>
          {lang === "ko" ? "피해 유형별 신고 방법" : lang === "en" ? "How to Report by Fraud Type" : lang === "ja" ? "被害種別ごとの通報方法" : lang === "zh" ? "按受害类型举报方式" : lang === "vi" ? "Cách báo cáo theo loại lừa đảo" : "Cómo Denunciar por Tipo de Fraude"}
        </h2>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
          {lang === "ko" ? "해당 피해 유형을 확인하고 즉시 신고하세요." : lang === "en" ? "Identify your fraud type and report immediately." : lang === "ja" ? "該当する被害種別を確認して、すぐに通報してください。" : lang === "zh" ? "确认受害类型并立即举报。" : lang === "vi" ? "Xác định loại lừa đảo và báo cáo ngay." : "Identifica tu tipo de fraude y repórtalo de inmediato."}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {REPORT_ITEMS.map((item) => (
            <div key={item.category} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px #0000000a" }}>
              <div style={{ background: item.bg, borderBottom: `1px solid ${item.border}`, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <p style={{ color: item.color, fontWeight: 800, fontSize: 15 }}>{item.category}</p>
              </div>
              <div style={{ padding: isMobile ? "16px" : "20px 24px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 20 : 24 }}>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
                    {lang === "ko" ? "신고 기관" : lang === "en" ? "REPORTING AGENCIES" : lang === "ja" ? "通報機関" : lang === "zh" ? "举报机构" : lang === "vi" ? "CƠ QUAN BÁO CÁO" : "AGENCIAS DE DENUNCIA"}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {item.agencies.map((agency) => (
                      <div key={agency.name} style={{ padding: "10px 12px", borderRadius: 10, background: item.bg, border: `1px solid ${item.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <p style={{ color: item.color, fontWeight: 700, fontSize: 13 }}>{agency.name}</p>
                          {agency.number && (
                            <a href={`tel:${agency.number}`} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: item.color, color: "#fff", textDecoration: "none", fontWeight: 700 }}>
                              📞 {agency.number}
                            </a>
                          )}
                          {agency.url && (
                            <a href={agency.url} target="_blank" rel="noopener noreferrer" style={{ color: "#94a3b8" }}>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        <p style={{ color: "#64748b", fontSize: 12 }}>{agency.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
                    {lang === "ko" ? "신고 절차" : lang === "en" ? "REPORTING STEPS" : lang === "ja" ? "通報手順" : lang === "zh" ? "举报步骤" : lang === "vi" ? "CÁC BƯỚC BÁO CÁO" : "PASOS PARA DENUNCIAR"}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {item.steps.map((step, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
                        </div>
                        <p style={{ color: "#334155", fontSize: 13, lineHeight: 1.6 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 18, padding: "22px 28px", textAlign: "center" }}>
          <p style={{ color: "#15803d", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
            {lang === "ko" ? "🙏 혼자 감당하지 않아도 됩니다" : lang === "en" ? "🙏 You don't have to face this alone" : lang === "ja" ? "🙏 一人で抱え込まなくても大丈夫です" : lang === "zh" ? "🙏 您不必独自承担" : lang === "vi" ? "🙏 Bạn không phải đối mặt một mình" : "🙏 No tienes que enfrentar esto solo"}
          </p>
          <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.9 }}>
            {lang === "ko" ? <>피해를 당한 것은 당신의 잘못이 아닙니다. 범죄자가 잘못한 것입니다.<br />지금 신고 한 통이 당신과 다음 피해자를 함께 지킵니다.</> :
             lang === "en" ? <>Being victimized is not your fault. The criminal is to blame.<br />One report right now protects both you and the next potential victim.</> :
             lang === "ja" ? <>被害に遭ったのはあなたのせいではありません。犯罪者が悪いのです。<br />今の一通報があなたと次の被害者を守ります。</> :
             lang === "zh" ? <>受害不是您的错。是犯罪者的错。<br />现在的一次举报保护了您和下一位潜在受害者。</> :
             lang === "vi" ? <>Bị hại không phải lỗi của bạn. Tội phạm mới là người sai.<br />Một báo cáo ngay bây giờ bảo vệ cả bạn lẫn nạn nhân tiếp theo.</> :
             <>Haber sido víctima no es tu culpa. El criminal es el responsable.<br />Una denuncia ahora te protege a ti y a la siguiente víctima potencial.</>}
          </p>
        </div>
      </div>
    </div>
  );
}
