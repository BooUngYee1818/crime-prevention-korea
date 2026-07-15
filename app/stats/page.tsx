"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, ExternalLink, ChevronDown, ChevronUp, BarChart2 } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

export default function StatsPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [openId, setOpenId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const t = (ko: string, en: string, ja: string, zh: string, vi: string, es: string) =>
    lang === "ko" ? ko : lang === "en" ? en : lang === "ja" ? ja : lang === "zh" ? zh : lang === "vi" ? vi : es;

  const SOURCES = [
    {
      name: t("경찰청 범죄통계", "National Police Agency Crime Statistics", "警察庁犯罪統計", "警察厅犯罪统计", "Thống kê tội phạm Cảnh sát Quốc gia", "Estadísticas de Crimen de la Policía Nacional"),
      url: "https://www.police.go.kr/user/bbs/BD_selectBbsList.do?q_bbsCode=1006",
      color: "#9161b2",
    },
    {
      name: t("금융감독원 보이스피싱 통계", "FSS Voice Phishing Statistics", "金融監督院ボイスフィッシング統計", "金融监督院语音钓鱼统计", "Thống kê lừa đảo qua điện thoại FSS", "Estadísticas de Fraude Telefónico FSS"),
      url: "https://www.fss.or.kr/fss/main/contents.do?menuNo=200467",
      color: "#0891b2",
    },
    {
      name: t("한국도박문제관리센터(KCGP)", "Korea Center on Gambling Problems (KCGP)", "韓国ギャンブル問題管理センター(KCGP)", "韩国赌博问题管理中心(KCGP)", "Trung tâm Quản lý Vấn đề Cờ bạc Hàn Quốc (KCGP)", "Centro de Gestión de Problemas de Juego de Corea (KCGP)"),
      url: "https://www.kcgp.or.kr",
      color: "#7c3aed",
    },
    {
      name: t("통계청 사망원인통계", "Statistics Korea Cause of Death", "統計庁死亡原因統計", "统计厅死亡原因统计", "Thống kê Nguyên nhân Tử vong - Cục Thống kê", "Estadísticas de Causa de Muerte - KOSTAT"),
      url: "https://kostat.go.kr/board.es?mid=a10301010000&bid=218",
      color: "#dc2626",
    },
    {
      name: t("한국형사정책연구원", "Korea Institute of Criminology", "韓国刑事政策研究院", "韩国刑事政策研究院", "Viện Nghiên cứu Chính sách Hình sự Hàn Quốc", "Instituto Coreano de Criminología"),
      url: "https://www.kic.re.kr",
      color: "#059669",
    },
    {
      name: t("대검찰청 범죄분석", "Supreme Prosecutors' Office Crime Analysis", "大検察庁犯罪分析", "大检察厅犯罪分析", "Phân tích Tội phạm - Viện Kiểm sát Tối cao", "Análisis Criminal de la Fiscalía Suprema"),
      url: "https://www.spo.go.kr/site/spo/crimeStats.do",
      color: "#ca8a04",
    },
    {
      name: t("방송통신위원회 스미싱 통계", "KCC Smishing Statistics", "放送通信委員会スミッシング統計", "广播通信委员会短信钓鱼统计", "Thống kê Smishing - Ủy ban Phát thanh và Truyền thông", "Estadísticas de Smishing de la KCC"),
      url: "https://www.kcc.go.kr",
      color: "#ea580c",
    },
  ];

  const CRIME_STATS = [
    {
      id: "family-impersonation",
      icon: "👨‍👩‍👧",
      title: t("자녀·가족 사칭 보이스피싱", "Family Impersonation Voice Phishing", "家族成りすましボイスフィッシング", "冒充子女/家人的语音钓鱼", "Lừa đảo giả mạo con cái/gia đình", "Vishing por Suplantación Familiar"),
      color: "#dc2626",
      bg: "#fef2f2",
      border: "#fecaca",
      summary: t("연간 약 5,000건 · 피해액 약 600억원", "~5,000 cases/year · ~₩60B in losses", "年間約5,000件・被害額約600億ウォン", "年约5,000起·损失约600亿韩元", "~5.000 vụ/năm · thiệt hại ~600 tỷ won", "~5.000 casos/año · pérdidas ~₩60B"),
      stats: [
        { label: t("연간 피해 건수 (2023)", "Annual Cases (2023)", "年間被害件数 (2023)", "年度案例数 (2023)", "Số vụ hàng năm (2023)", "Casos Anuales (2023)"), value: "약 5,000건", source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN"), bold: true },
        { label: t("연간 피해액", "Annual Loss", "年間被害額", "年度损失额", "Thiệt hại hàng năm", "Pérdida Anual"), value: "약 600억원", source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS") },
        { label: t("주요 피해 연령", "Primary Victim Age", "主な被害年齢", "主要受害年龄", "Độ tuổi nạn nhân chủ yếu", "Edad Primaria de Víctimas"), value: t("50~70대 (전체의 68%)", "50s–70s (68% of all)", "50〜70代（全体の68%）", "50-70岁（占总数68%）", "50–70 tuổi (68% tổng số)", "50–70 años (68% del total)"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("평균 피해액", "Avg. Loss per Case", "平均被害額", "平均损失额", "Thiệt hại trung bình", "Pérdida Promedio"), value: "약 1,200만원/건", source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS") },
        { label: t("수법", "Method", "手口", "作案手法", "Phương thức", "Método"), value: t("자녀 폰 고장·사고 핑계로 급전 요청", "Claiming child's phone broke/accident, urgent money request", "子どもの携帯故障・事故を口実に急ぎの送金要求", "以子女手机损坏/事故为由紧急索钱", "Giả vờ điện thoại con bị hỏng/tai nạn, xin tiền gấp", "Fingir que el teléfono del hijo/a está roto, pedir dinero urgente"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("주요 채널", "Main Channel", "主なチャネル", "主要渠道", "Kênh chủ yếu", "Canal Principal"), value: t("오카카톡·문자 (87%)", "KakaoTalk/SMS (87%)", "カカオトーク・SMS（87%）", "KakaoTalk/短信（87%）", "KakaoTalk/SMS (87%)", "KakaoTalk/SMS (87%)"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
      ],
      sources: [
        t("경찰청 범죄통계", "National Police Agency Crime Statistics", "警察庁犯罪統計", "警察厅犯罪统计", "Thống kê tội phạm Cảnh sát Quốc gia", "Estadísticas de Crimen de la Policía Nacional"),
        t("금융감독원 보이스피싱 통계", "FSS Voice Phishing Statistics", "金融監督院ボイスフィッシング統計", "金融监督院语音钓鱼统计", "Thống kê lừa đảo qua điện thoại FSS", "Estadísticas de Fraude Telefónico FSS"),
      ],
      note: t(
        '"엄마 나야, 폰 고장났어" 한 마디에 평균 1,200만원을 잃습니다.',
        '"Mom, it\'s me, my phone broke" — one message costs an average of ₩12M.',
        '「お母さん、携帯壊れた」一言で平均1,200万ウォンを失います。',
        '"妈，是我，手机坏了"——一句话平均损失1,200万韩元。',
        '"Mẹ ơi, con đây, điện thoại con hỏng rồi" — một tin nhắn mất trung bình 12 triệu won.',
        '"Mamá, soy yo, se me rompió el teléfono" — un mensaje cuesta en promedio ₩12M.',
      ),
    },
    {
      id: "prosecutor-impersonation",
      icon: "👮",
      title: t("검찰·경찰·금융기관 사칭", "Prosecutor/Police/Financial Institution Impersonation", "検察・警察・金融機関成りすまし", "冒充检察院/警察/金融机构", "Giả mạo Viện Kiểm sát/Cảnh sát/Ngân hàng", "Suplantación de Fiscalía/Policía/Banco"),
      color: "#7c3aed",
      bg: "#f5dfee",
      border: "#dcc5e8",
      summary: t("1건당 평균 피해액 5,290만원 · 최고 피해 수법", "Avg. ₩52.9M per case · Highest-loss method", "1件あたり平均被害額5,290万ウォン・最高被害手口", "每起平均损失5,290万韩元·最高损失手法", "Trung bình 52,9 triệu won/vụ · Phương thức thiệt hại lớn nhất", "Promedio ₩52.9M por caso · Método de mayor pérdida"),
      stats: [
        { label: t("연간 피해 건수 (2023)", "Annual Cases (2023)", "年間被害件数 (2023)", "年度案例数 (2023)", "Số vụ hàng năm (2023)", "Casos Anuales (2023)"), value: "약 3,200건", source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN"), bold: true },
        { label: t("1건당 평균 피해액", "Avg. Loss per Case", "1件あたり平均被害額", "每起平均损失额", "Thiệt hại trung bình/vụ", "Pérdida Promedio por Caso"), value: "5,290만원", source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS"), bold: true },
        { label: t("최고 단일 피해액", "Largest Single Loss", "最大単一被害額", "最大单笔损失", "Thiệt hại đơn lẻ lớn nhất", "Mayor Pérdida Individual"), value: t("23억원 (2022)", "₩2.3B (2022)", "23億ウォン（2022）", "23亿韩元（2022）", "2,3 tỷ won (2022)", "₩2.3B (2022)"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("주요 피해 연령", "Primary Victim Age", "主な被害年齢", "主要受害年龄", "Độ tuổi nạn nhân chủ yếu", "Edad Primaria de Víctimas"), value: t("40~60대 (전체의 72%)", "40s–60s (72% of all)", "40〜60代（全体の72%）", "40-60岁（占总数72%）", "40–60 tuổi (72% tổng số)", "40–60 años (72% del total)"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("수법", "Method", "手口", "作案手法", "Phương thức", "Método"), value: t('"계좌 범죄 연루" 협박 후 안전계좌 이체 요구', 'Threaten "account linked to crime," demand transfer to "safe account"', '「口座が犯罪に関与」と脅し安全口座への送金を要求', '"账户涉嫌犯罪"恐吓后要求转账到安全账户', 'Đe dọa "tài khoản liên quan tội phạm", yêu cầu chuyển đến "tài khoản an toàn"', 'Amenazar "cuenta vinculada a crimen," exigir transferencia a "cuenta segura"'), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("평균 통화 시간", "Avg. Call Duration", "平均通話時間", "平均通话时长", "Thời gian cuộc gọi trung bình", "Duración Promedio de Llamada"), value: t("약 40분 (심리적 압박 유지)", "~40 min (maintaining psychological pressure)", "約40分（心理的圧力を維持）", "约40分钟（保持心理压力）", "~40 phút (duy trì áp lực tâm lý)", "~40 min (manteniendo presión psicológica)"), source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS") },
      ],
      sources: [
        t("경찰청 범죄통계", "National Police Agency Crime Statistics", "警察庁犯罪統計", "警察厅犯罪统计", "Thống kê tội phạm Cảnh sát Quốc gia", "Estadísticas de Crimen de la Policía Nacional"),
        t("금융감독원 보이스피싱 통계", "FSS Voice Phishing Statistics", "金融監督院ボイスフィッシング統計", "金融监督院语音钓鱼统计", "Thống kê lừa đảo qua điện thoại FSS", "Estadísticas de Fraude Telefónico FSS"),
      ],
      note: t(
        "실제 검사·경찰은 전화로 계좌이체를 요구하지 않습니다.",
        "Real prosecutors and police never demand bank transfers over the phone.",
        "実際の検察官・警察は電話で口座振替を要求しません。",
        "真正的检察官和警察不会通过电话要求银行转账。",
        "Công tố viên và cảnh sát thật sự không bao giờ yêu cầu chuyển tiền qua điện thoại.",
        "Los fiscales y policías reales nunca exigen transferencias bancarias por teléfono.",
      ),
    },
    {
      id: "romance-scam",
      icon: "💝",
      title: t("로맨스 스캠", "Romance Scam", "ロマンス詐欺", "网络恋爱诈骗", "Lừa đảo tình cảm", "Estafa Romántica"),
      color: "#db2777",
      bg: "#fdf2f8",
      border: "#fbcfe8",
      summary: t("연간 피해액 약 900억원 · 피해 인식률 매우 낮음", "~₩90B annual losses · Very low victim awareness", "年間被害額約900億ウォン・被害認識率が非常に低い", "年损失约900亿韩元·受害认知率极低", "Thiệt hại ~900 tỷ won/năm · Tỷ lệ nhận thức nạn nhân rất thấp", "~₩90B pérdidas anuales · Muy baja conciencia de víctimas"),
      stats: [
        { label: t("연간 피해 건수 (2023)", "Annual Cases (2023)", "年間被害件数 (2023)", "年度案例数 (2023)", "Số vụ hàng năm (2023)", "Casos Anuales (2023)"), value: "약 2,800건", source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN"), bold: true },
        { label: t("연간 피해액", "Annual Loss", "年間被害額", "年度损失额", "Thiệt hại hàng năm", "Pérdida Anual"), value: "약 900억원", source: t("경찰청·금감원", "NPA·FSS", "警察庁・金融監督院", "警察厅·金融监督院", "NPA·FSS", "PNN·FSS") },
        { label: t("1건당 평균 피해액", "Avg. Loss per Case", "1件あたり平均被害額", "每起平均损失额", "Thiệt hại trung bình/vụ", "Pérdida Promedio por Caso"), value: "약 3,200만원", source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS") },
        { label: t("피해자 중 여성 비율", "Female Victim Rate", "被害者中の女性割合", "受害者中女性比例", "Tỷ lệ nạn nhân nữ", "Porcentaje de Víctimas Mujeres"), value: "61%", source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("평균 사기 기간", "Avg. Scam Duration", "平均詐欺期間", "平均诈骗时长", "Thời gian lừa đảo trung bình", "Duración Promedio de Estafa"), value: t("약 4.3개월 (장기 신뢰 형성)", "~4.3 months (long-term trust building)", "約4.3ヶ月（長期信頼構築）", "约4.3个月（长期建立信任）", "~4,3 tháng (xây dựng lòng tin lâu dài)", "~4,3 meses (construcción de confianza a largo plazo)"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("신고 비율", "Reporting Rate", "通報率", "报案率", "Tỷ lệ báo án", "Tasa de Denuncia"), value: t("약 30% (수치심으로 미신고 多)", "~30% (many don't report due to shame)", "約30%（羞恥心から未報告が多い）", "约30%（因羞耻感大量未报案）", "~30% (nhiều người không báo vì xấu hổ)", "~30% (muchos no denuncian por vergüenza)"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
      ],
      sources: [
        t("경찰청 범죄통계", "National Police Agency Crime Statistics", "警察庁犯罪統計", "警察厅犯罪统计", "Thống kê tội phạm Cảnh sát Quốc gia", "Estadísticas de Crimen de la Policía Nacional"),
        t("금융감독원 보이스피싱 통계", "FSS Voice Phishing Statistics", "金融監督院ボイスフィッシング統計", "金融监督院语音钓鱼统计", "Thống kê lừa đảo qua điện thoại FSS", "Estadísticas de Fraude Telefónico FSS"),
      ],
      note: t(
        "피해자 10명 중 7명은 신고조차 못 합니다. 수치심이 아닌 범죄 피해임을 기억하세요.",
        "7 out of 10 victims never report it. Remember: you are a crime victim, not a source of shame.",
        "被害者10人中7人は通報すらできません。恥ずかしいのではなく、犯罪被害者であることを忘れないでください。",
        "10名受害者中有7名甚至无法报案。请记住，这是犯罪受害，而非羞耻。",
        "7 trong 10 nạn nhân không dám báo án. Hãy nhớ: bạn là nạn nhân của tội phạm, không phải điều đáng xấu hổ.",
        "7 de cada 10 víctimas nunca lo denuncian. Recuerda: eres víctima de un crimen, no motivo de vergüenza.",
      ),
    },
    {
      id: "investment-scam",
      icon: "📈",
      title: t("투자 사기·주식리딩방", "Investment Fraud / Stock Tip Groups", "投資詐欺・株式リーディングルーム", "投资诈骗/股票荐股群", "Lừa đảo đầu tư / Nhóm tư vấn chứng khoán", "Fraude de Inversión / Grupos de Tips Bursátiles"),
      color: "#059669",
      bg: "#f0fdf4",
      border: "#bbf7d0",
      summary: t("연간 피해액 약 1조 3,000억원 · 전 연령 피해", "~₩1.3T annual losses · All age groups affected", "年間被害額約1兆3,000億ウォン・全年齢が被害", "年损失约1.3万亿韩元·各年龄段均受害", "Thiệt hại ~1,3 nghìn tỷ won/năm · Mọi lứa tuổi bị ảnh hưởng", "~₩1.3T pérdidas anuales · Todas las edades afectadas"),
      stats: [
        { label: t("연간 피해액 (2022)", "Annual Loss (2022)", "年間被害額 (2022)", "年度损失额 (2022)", "Thiệt hại hàng năm (2022)", "Pérdida Anual (2022)"), value: "약 1조 3,000억원", source: t("대검찰청", "SPO", "大検察庁", "大检察厅", "SPO", "SPO"), bold: true },
        { label: t("연간 피해 건수", "Annual Cases", "年間被害件数", "年度案例数", "Số vụ hàng năm", "Casos Anuales"), value: "약 26,000건", source: t("대검찰청", "SPO", "大検察庁", "大检察厅", "SPO", "SPO"), bold: true },
        { label: t("1건당 평균 피해액", "Avg. Loss per Case", "1件あたり平均被害額", "每起平均损失额", "Thiệt hại trung bình/vụ", "Pérdida Promedio por Caso"), value: "약 5,000만원", source: t("대검찰청", "SPO", "大検察庁", "大检察厅", "SPO", "SPO") },
        { label: t("주식리딩방 피해 비율", "Stock Tip Group Fraud Rate", "株式リーディングルーム被害割合", "股票荐股群受害比例", "Tỷ lệ lừa đảo qua nhóm tư vấn chứng khoán", "Tasa de Fraude por Grupos de Tips"), value: t("전체의 43%", "43% of total", "全体の43%", "占总数43%", "43% tổng số", "43% del total"), source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS") },
        { label: t("피해자 연령 분포", "Victim Age Distribution", "被害者年齢分布", "受害者年龄分布", "Phân bố tuổi nạn nhân", "Distribución de Edad de Víctimas"), value: t("30~50대 (전체의 74%)", "30s–50s (74% of all)", "30〜50代（全体の74%）", "30-50岁（占总数74%）", "30–50 tuổi (74% tổng số)", "30–50 años (74% del total)"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("SNS·메신저 유입 비율", "SNS/Messenger Recruitment Rate", "SNS・メッセンジャー流入割合", "通过社交媒体/即时通讯引诱比例", "Tỷ lệ tiếp cận qua MXH/tin nhắn", "Tasa de Captación por SNS/Mensajería"), value: "78%", source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
      ],
      sources: [
        t("대검찰청 범죄분석", "Supreme Prosecutors' Office Crime Analysis", "大検察庁犯罪分析", "大检察厅犯罪分析", "Phân tích Tội phạm - Viện Kiểm sát Tối cao", "Análisis Criminal de la Fiscalía Suprema"),
        t("금융감독원 보이스피싱 통계", "FSS Voice Phishing Statistics", "金融監督院ボイスフィッシング統計", "金融监督院语音钓鱼统计", "Thống kê lừa đảo qua điện thoại FSS", "Estadísticas de Fraude Telefónico FSS"),
        t("경찰청 범죄통계", "National Police Agency Crime Statistics", "警察庁犯罪統計", "警察厅犯罪统计", "Thống kê tội phạm Cảnh sát Quốc gia", "Estadísticas de Crimen de la Policía Nacional"),
      ],
      note: t(
        '"확실한 수익 보장"은 사기의 시작입니다. 합법 투자는 원금 손실 가능성을 반드시 고지합니다.',
        '"Guaranteed returns" is where fraud begins. Legitimate investments must disclose the risk of principal loss.',
        '「確実な収益保証」は詐欺の始まりです。合法投資は必ず元本損失リスクを告知します。',
        '"保证盈利"是诈骗的开始。合法投资必须告知本金损失风险。',
        '"Đảm bảo lợi nhuận chắc chắn" là khởi đầu của lừa đảo. Đầu tư hợp pháp phải thông báo rủi ro mất vốn.',
        '"Ganancias garantizadas" es donde comienza el fraude. Las inversiones legítimas deben divulgar el riesgo de pérdida del capital.',
      ),
    },
    {
      id: "loan-fraud",
      icon: "🏦",
      title: t("대출 사기·저금리 전환 사기", "Loan Fraud / Low-Rate Conversion Scam", "貸付詐欺・低金利転換詐欺", "贷款诈骗/低利率转换诈骗", "Lừa đảo vay vốn / Chuyển đổi lãi suất thấp", "Fraude de Préstamo / Estafa de Tasa Baja"),
      color: "#ca8a04",
      bg: "#fefce8",
      border: "#fde68a",
      summary: t("연간 약 8,000건 · 서민·취약계층 집중 피해", "~8,000 cases/year · Low-income & vulnerable groups hit hardest", "年間約8,000件・低所得者・脆弱層に集中した被害", "年约8,000起·低收入及弱势群体受害集中", "~8.000 vụ/năm · Nhóm thu nhập thấp & dễ bị tổn thương bị ảnh hưởng nặng nhất", "~8.000 casos/año · Los más afectados: grupos de bajos ingresos y vulnerables"),
      stats: [
        { label: t("연간 피해 건수 (2023)", "Annual Cases (2023)", "年間被害件数 (2023)", "年度案例数 (2023)", "Số vụ hàng năm (2023)", "Casos Anuales (2023)"), value: "약 8,000건", source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS"), bold: true },
        { label: t("연간 피해액", "Annual Loss", "年間被害額", "年度损失额", "Thiệt hại hàng năm", "Pérdida Anual"), value: "약 1,400억원", source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS") },
        { label: t("1건당 평균 피해액", "Avg. Loss per Case", "1件あたり平均被害額", "每起平均损失额", "Thiệt hại trung bình/vụ", "Pérdida Promedio por Caso"), value: "약 1,750만원", source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS") },
        { label: t("피해자 신용등급", "Victim Credit Grade", "被害者の信用等級", "受害者信用等级", "Hạng tín dụng nạn nhân", "Calificación Crediticia de Víctimas"), value: t("4~7등급 (취약계층 74%)", "Grade 4–7 (74% vulnerable)", "4〜7等級（脆弱層74%）", "4-7级（弱势群体74%）", "Hạng 4–7 (74% dễ bị tổn thương)", "Grado 4–7 (74% vulnerables)"), source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS") },
        { label: t("선수수료 명목 피해", "Upfront Fee Losses", "先行手数料名目の被害", "以预收费用名义的损失", "Thiệt hại dưới danh nghĩa phí trước", "Pérdidas por Honorarios Anticipados"), value: t("전체의 58%", "58% of total", "全体の58%", "占总数58%", "58% tổng số", "58% del total"), source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS") },
        { label: t("주요 연령", "Primary Age Group", "主な年齢", "主要年龄段", "Nhóm tuổi chủ yếu", "Grupo de Edad Principal"), value: t("30~50대 (전체의 68%)", "30s–50s (68% of all)", "30〜50代（全体の68%）", "30-50岁（占总数68%）", "30–50 tuổi (68% tổng số)", "30–50 años (68% del total)"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
      ],
      sources: [
        t("금융감독원 보이스피싱 통계", "FSS Voice Phishing Statistics", "金融監督院ボイスフィッシング統計", "金融监督院语音钓鱼统计", "Thống kê lừa đảo qua điện thoại FSS", "Estadísticas de Fraude Telefónico FSS"),
        t("경찰청 범죄통계", "National Police Agency Crime Statistics", "警察庁犯罪統計", "警察厅犯罪统计", "Thống kê tội phạm Cảnh sát Quốc gia", "Estadísticas de Crimen de la Policía Nacional"),
      ],
      note: t(
        "합법 금융기관은 대출 실행 전 어떠한 수수료도 요구하지 않습니다.",
        "Legitimate financial institutions never demand any fee before disbursing a loan.",
        "合法な金融機関は融資実行前に一切の手数料を要求しません。",
        "合法金融机构在放款前不会要求任何费用。",
        "Tổ chức tài chính hợp pháp không bao giờ yêu cầu phí trước khi giải ngân.",
        "Las instituciones financieras legítimas nunca exigen ningún honorario antes de desembolsar un préstamo.",
      ),
    },
    {
      id: "delivery-scam",
      icon: "📦",
      title: t("스미싱 (문자 피싱)", "Smishing (SMS Phishing)", "スミッシング（SMS詐欺）", "短信钓鱼诈骗", "Smishing (Lừa đảo qua SMS)", "Smishing (Phishing por SMS)"),
      color: "#ea580c",
      bg: "#fff7ed",
      border: "#fed7aa",
      summary: t("연간 50만건+ 발송 · 클릭 1회로 전 재산 위험", "500K+ texts/year · One click can cost everything", "年間50万件以上送信・1クリックで全財産が危険", "年发送50万条以上·点击一次即危及全部财产", "500K+ tin nhắn/năm · Một cú nhấp có thể mất tất cả", "500K+ mensajes/año · Un clic puede costar todo"),
      stats: [
        { label: t("연간 스미싱 문자 발송 건수 (2022)", "Annual Smishing Texts Sent (2022)", "年間スミッシング文字送信件数 (2022)", "年度短信钓鱼发送量 (2022)", "Số tin nhắn smishing gửi hàng năm (2022)", "Mensajes de Smishing Enviados Anualmente (2022)"), value: "약 50만 건+", source: t("방송통신위원회", "KCC", "放送通信委員会", "广播通信委员会", "KCC", "KCC"), bold: true },
        { label: t("악성앱 설치 피해 건수", "Malicious App Install Cases", "悪性アプリインストール被害件数", "恶意APP安装受害案例数", "Số vụ cài đặt ứng dụng độc hại", "Casos de Instalación de App Maliciosa"), value: "약 4,300건", source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("1건당 평균 피해액", "Avg. Loss per Case", "1件あたり平均被害額", "每起平均损失额", "Thiệt hại trung bình/vụ", "Pérdida Promedio por Caso"), value: "약 820만원", source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS") },
        { label: t("주요 사칭 유형", "Main Impersonation Types", "主な成りすまし類型", "主要冒充类型", "Các loại giả mạo chủ yếu", "Principales Tipos de Suplantación"), value: t("택배(41%), 공공기관(28%), 지인(18%)", "Delivery (41%), Gov't (28%), Acquaintance (18%)", "宅配（41%）、公共機関（28%）、知人（18%）", "快递(41%)、公共机构(28%)、熟人(18%)", "Giao hàng (41%), Cơ quan công (28%), Người quen (18%)", "Mensajería (41%), Gobierno (28%), Conocidos (18%)"), source: t("방통위", "KCC", "放通委", "广通委", "KCC", "KCC") },
        { label: t("피해자 연령", "Victim Age", "被害者年齢", "受害者年龄", "Tuổi nạn nhân", "Edad de Víctimas"), value: t("50대 이상 (전체의 54%)", "50+ years old (54% of all)", "50代以上（全体の54%）", "50岁以上（占总数54%）", "50 tuổi trở lên (54% tổng số)", "50+ años (54% del total)"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("악성앱 탐지 건수", "Malicious App Detections", "悪性アプリ検知件数", "恶意APP检测量", "Số lượng phát hiện ứng dụng độc hại", "Detecciones de Apps Maliciosas"), value: t("연간 약 21만 개", "~210,000/year", "年間約21万個", "年约21万个", "~210.000/năm", "~210.000/año"), source: t("한국인터넷진흥원(KISA)", "KISA", "韓国インターネット振興院(KISA)", "韩国互联网振兴院(KISA)", "KISA", "KISA") },
      ],
      sources: [
        t("방송통신위원회 스미싱 통계", "KCC Smishing Statistics", "放送通信委員会スミッシング統計", "广播通信委员会短信钓鱼统计", "Thống kê Smishing - Ủy ban Phát thanh và Truyền thông", "Estadísticas de Smishing de la KCC"),
        t("경찰청 범죄통계", "National Police Agency Crime Statistics", "警察庁犯罪統計", "警察厅犯罪统计", "Thống kê tội phạm Cảnh sát Quốc gia", "Estadísticas de Crimen de la Policía Nacional"),
        t("금융감독원 보이스피싱 통계", "FSS Voice Phishing Statistics", "金融監督院ボイスフィッシング統計", "金融监督院语音钓鱼统计", "Thống kê lừa đảo qua điện thoại FSS", "Estadísticas de Fraude Telefónico FSS"),
      ],
      note: t(
        "출처 불명 링크는 절대 클릭하지 마세요. 클릭 1회로 스마트폰 전체가 장악될 수 있습니다.",
        "Never click links from unknown sources. One click can give attackers full control of your smartphone.",
        "出所不明のリンクは絶対にクリックしないでください。1回のクリックでスマートフォン全体が乗っ取られる可能性があります。",
        "切勿点击来源不明的链接。一次点击可能导致智能手机被完全控制。",
        "Tuyệt đối không nhấp vào liên kết không rõ nguồn gốc. Một cú nhấp có thể khiến kẻ tấn công kiểm soát toàn bộ điện thoại thông minh của bạn.",
        "Nunca hagas clic en enlaces de fuentes desconocidas. Un clic puede dar a los atacantes control total de tu smartphone.",
      ),
    },
    {
      id: "kakaotalk-impersonation",
      icon: "💬",
      title: t("오카카톡·메신저 사기", "KakaoTalk / Messenger Fraud", "カカオトーク・メッセンジャー詐欺", "KakaoTalk/即时通讯诈骗", "Lừa đảo qua KakaoTalk / Tin nhắn", "Fraude por KakaoTalk / Mensajería"),
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fde68a",
      summary: t("연간 약 14,000건 · 전체 보이스피싱의 최다 수법", "~14,000 cases/year · Most common voice phishing method", "年間約14,000件・全体ボイスフィッシングの最多手口", "年约14,000起·语音钓鱼中最常见手法", "~14.000 vụ/năm · Phương thức phổ biến nhất trong lừa đảo giọng nói", "~14.000 casos/año · Método de vishing más común"),
      stats: [
        { label: t("연간 피해 건수 (2023)", "Annual Cases (2023)", "年間被害件数 (2023)", "年度案例数 (2023)", "Số vụ hàng năm (2023)", "Casos Anuales (2023)"), value: "약 14,000건", source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN"), bold: true },
        { label: t("전체 보이스피싱 대비 비중", "Share of All Voice Phishing", "全体ボイスフィッシングに対する割合", "占全体语音钓鱼比重", "Tỷ trọng trong tổng lừa đảo giọng nói", "Porción del Total de Vishing"), value: t("약 38% (최다 수법)", "~38% (most common)", "約38%（最多手口）", "约38%（最常见手法）", "~38% (phổ biến nhất)", "~38% (más común)"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN"), bold: true },
        { label: t("연간 피해액", "Annual Loss", "年間被害額", "年度损失额", "Thiệt hại hàng năm", "Pérdida Anual"), value: "약 2,100억원", source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS") },
        { label: t("평균 피해액", "Avg. Loss", "平均被害額", "平均损失额", "Thiệt hại trung bình", "Pérdida Promedio"), value: "약 1,500만원", source: t("금융감독원", "FSS", "金融監督院", "金融监督院", "FSS", "FSS") },
        { label: t("주요 피해 연령", "Primary Victim Age", "主な被害年齢", "主要受害年龄", "Độ tuổi nạn nhân chủ yếu", "Edad Primaria de Víctimas"), value: t("50~70대 (전체의 71%)", "50s–70s (71% of all)", "50〜70代（全体の71%）", "50-70岁（占总数71%）", "50–70 tuổi (71% tổng số)", "50–70 años (71% del total)"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("계좌 개설 악용 비율", "Account Opening Abuse Rate", "口座開設悪用割合", "账户开设滥用比例", "Tỷ lệ lạm dụng mở tài khoản", "Tasa de Abuso de Apertura de Cuenta"), value: t("전체의 29%", "29% of total", "全体の29%", "占总数29%", "29% tổng số", "29% del total"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
      ],
      sources: [
        t("경찰청 범죄통계", "National Police Agency Crime Statistics", "警察庁犯罪統計", "警察厅犯罪统计", "Thống kê tội phạm Cảnh sát Quốc gia", "Estadísticas de Crimen de la Policía Nacional"),
        t("금융감독원 보이스피싱 통계", "FSS Voice Phishing Statistics", "金融監督院ボイスフィッシング統計", "金融监督院语音钓鱼统计", "Thống kê lừa đảo qua điện thoại FSS", "Estadísticas de Fraude Telefónico FSS"),
      ],
      note: t(
        "오카카톡 프로필 사진·이름은 쉽게 도용됩니다. 돈 요청 시 반드시 전화 통화로 확인하세요.",
        "KakaoTalk profile photos and names are easily stolen. Always verify money requests with a phone call.",
        "カカオトークのプロフィール写真・名前は簡単に盗用されます。送金要求時は必ず電話で確認してください。",
        "KakaoTalk头像和姓名很容易被盗用。收到金钱请求时，务必通过电话确认。",
        "Ảnh đại diện và tên trên KakaoTalk dễ bị đánh cắp. Hãy luôn xác minh yêu cầu chuyển tiền bằng cuộc gọi điện thoại.",
        "Las fotos de perfil y nombres de KakaoTalk son fáciles de robar. Siempre verifica las solicitudes de dinero con una llamada telefónica.",
      ),
    },
    {
      id: "used-goods-scam",
      icon: "📱",
      title: t("중고거래 사기", "Second-hand Goods Fraud", "中古品取引詐欺", "二手交易诈骗", "Lừa đảo mua bán đồ cũ", "Fraude en Compraventa de Segunda Mano"),
      color: "#6366f1",
      bg: "#eef2ff",
      border: "#c7d2fe",
      summary: t("연간 약 26,000건 · 가장 빈번한 일상 범죄", "~26,000 cases/year · Most frequent everyday crime", "年間約26,000件・最も頻繁な日常犯罪", "年约26,000起·最常见日常犯罪", "~26.000 vụ/năm · Tội phạm hàng ngày phổ biến nhất", "~26.000 casos/año · El crimen cotidiano más frecuente"),
      stats: [
        { label: t("연간 피해 건수 (2022)", "Annual Cases (2022)", "年間被害件数 (2022)", "年度案例数 (2022)", "Số vụ hàng năm (2022)", "Casos Anuales (2022)"), value: "약 26,000건", source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN"), bold: true },
        { label: t("전체 사기 범죄 내 비중", "Share of All Fraud Crimes", "全体詐欺犯罪における割合", "占全体诈骗犯罪比重", "Tỷ trọng trong tổng tội phạm lừa đảo", "Porción del Total de Fraudes"), value: "약 14%", source: t("대검찰청", "SPO", "大検察庁", "大检察厅", "SPO", "SPO") },
        { label: t("1건당 평균 피해액", "Avg. Loss per Case", "1件あたり平均被害額", "每起平均损失额", "Thiệt hại trung bình/vụ", "Pérdida Promedio por Caso"), value: "약 32만원", source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("주요 피해 품목", "Main Victim Items", "主な被害品目", "主要受害商品", "Mặt hàng nạn nhân chủ yếu", "Artículos Víctimas Principales"), value: t("전자기기(38%), 의류·잡화(21%), 티켓(17%)", "Electronics (38%), Clothing/Goods (21%), Tickets (17%)", "電子機器（38%）、衣類・雑貨（21%）、チケット（17%）", "电子设备(38%)、服装/杂货(21%)、票券(17%)", "Điện tử (38%), Quần áo/Hàng hóa (21%), Vé (17%)", "Electrónica (38%), Ropa/Artículos (21%), Entradas (17%)"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("주요 피해 플랫폼", "Main Fraud Platforms", "主な被害プラットフォーム", "主要受害平台", "Nền tảng lừa đảo chủ yếu", "Principales Plataformas de Fraude"), value: t("평화나라·피망마켓·개번장터", "Joonggonara, Karrot, Bungaejangter", "中古なら・カロット・バンゲジャンター", "中古那拉·萝卜市场·闪电市场", "Joonggonara, Karrot, Bungaejangter", "Joonggonara, Karrot, Bungaejangter"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
        { label: t("피해자 연령", "Victim Age", "被害者年齢", "受害者年龄", "Tuổi nạn nhân", "Edad de Víctimas"), value: t("20~30대 (전체의 62%)", "20s–30s (62% of all)", "20〜30代（全体の62%）", "20-30岁（占总数62%）", "20–30 tuổi (62% tổng số)", "20–30 años (62% del total)"), source: t("경찰청", "NPA", "警察庁", "警察厅", "NPA", "PNN") },
      ],
      sources: [
        t("경찰청 범죄통계", "National Police Agency Crime Statistics", "警察庁犯罪統計", "警察厅犯罪统计", "Thống kê tội phạm Cảnh sát Quốc gia", "Estadísticas de Crimen de la Policía Nacional"),
        t("대검찰청 범죄분석", "Supreme Prosecutors' Office Crime Analysis", "大検察庁犯罪分析", "大检察厅犯罪分析", "Phân tích Tội phạm - Viện Kiểm sát Tối cao", "Análisis Criminal de la Fiscalía Suprema"),
      ],
      note: t(
        "선입금 요구 후 잠수는 전형적인 수법입니다. 직거래 또는 안전결제 서비스를 이용하세요.",
        "Demanding upfront payment then disappearing is the classic trick. Use in-person or escrow payment.",
        "前払い要求後の音信不通は典型的な手口です。直接取引または安全決済サービスをご利用ください。",
        "要求先付款后消失是典型手法。请使用当面交易或安全支付服务。",
        "Yêu cầu thanh toán trước rồi biến mất là chiêu trò điển hình. Hãy giao dịch trực tiếp hoặc dùng dịch vụ thanh toán escrow.",
        "Exigir pago por adelantado y luego desaparecer es el truco clásico. Usa pago en persona o por depósito en garantía.",
      ),
    },
    {
      id: "illegal-gambling",
      icon: "🎰",
      title: t("불법 도박 중독", "Illegal Gambling Addiction", "違法ギャンブル中毒", "非法赌博成瘾", "Nghiện cờ bạc bất hợp pháp", "Adicción al Juego Ilegal"),
      color: "#7c3aed",
      bg: "#faf5ff",
      border: "#ddd6fe",
      summary: t(
        "추정 중독자 200만명 · 연 불법 도박 84조원 · 자살충동 30.4%",
        "~2M estimated addicts · ₩84T illegal gambling/year · 30.4% suicidal ideation",
        "推定中毒者200万人・年間違法ギャンブル84兆ウォン・自殺衝動30.4%",
        "估计成瘾者200万人·年非法赌博84万亿韩元·自杀冲动30.4%",
        "~2 triệu người nghiện ước tính · 84 nghìn tỷ won cờ bạc bất hợp pháp/năm · 30,4% có ý định tự tử",
        "~2M adictos estimados · ₩84T juego ilegal/año · 30.4% ideación suicida",
      ),
      stats: [
        { label: t("도박 중독 추정 인구 (2023)", "Estimated Gambling Addicts (2023)", "ギャンブル中毒推定人口 (2023)", "预估赌博成瘾人数 (2023)", "Dân số nghiện cờ bạc ước tính (2023)", "Adictos Estimados al Juego (2023)"), value: t("약 200만명 (성인의 5%)", "~2M (5% of adults)", "約200万人（成人の5%）", "约200万人（成人的5%）", "~2 triệu người (5% người lớn)", "~2M (5% de adultos)"), source: "KCGP", bold: true },
        { label: t("불법 도박 시장 규모", "Illegal Gambling Market Size", "違法ギャンブル市場規模", "非法赌博市场规模", "Quy mô thị trường cờ bạc bất hợp pháp", "Tamaño del Mercado de Juego Ilegal"), value: "연 약 84조원", source: t("한국형사정책연구원", "KIC", "韓国刑事政策研究院", "韩国刑事政策研究院", "KIC", "KIC"), bold: true },
        { label: t("도박 중독자 자살 충동 경험", "Suicidal Ideation Among Addicts", "ギャンブル中毒者の自殺衝動経験", "赌博成瘾者自杀冲动经历", "Ý định tự tử trong người nghiện cờ bạc", "Ideación Suicida en Adictos"), value: t("30.4% (일반인의 10배)", "30.4% (10x the general public)", "30.4%（一般人の10倍）", "30.4%（普通人的10倍）", "30,4% (gấp 10 lần người bình thường)", "30.4% (10 veces el público general)"), source: "KCGP", bold: true },
        { label: t("평균 도박 부채", "Avg. Gambling Debt", "平均ギャンブル負債", "平均赌博债务", "Nợ cờ bạc trung bình", "Deuda Promedio por Juego"), value: "약 3,800만원", source: "KCGP" },
        { label: t("온라인·모바일 첫 도박 비율", "First Gambling via Online/Mobile", "オンライン・モバイル初回ギャンブル割合", "首次通过网络/手机赌博比例", "Tỷ lệ lần đầu cờ bạc qua online/điện thoại", "Primera Experiencia de Juego en Línea/Móvil"), value: "36.9%", source: "KCGP 2022" },
        { label: t("도박 문제 인식 치료 비율", "Treatment Rate Among Addicts", "ギャンブル問題認識治療率", "赌博问题认知治疗率", "Tỷ lệ điều trị trong người nhận thức vấn đề cờ bạc", "Tasa de Tratamiento de Adictos"), value: t("8.3% (치료받지 않는 경우 91.7%)", "8.3% seek treatment (91.7% do not)", "8.3%（治療を受けない場合91.7%）", "8.3%（不接受治疗的占91.7%）", "8,3% điều trị (91,7% không điều trị)", "8.3% buscan tratamiento (91.7% no lo hacen)"), source: "KCGP" },
        { label: t("가족 해체(이혼·별거) 비율", "Family Breakdown Rate (Divorce/Separation)", "家族崩壊（離婚・別居）率", "家庭破裂（离婚/分居）率", "Tỷ lệ gia đình tan vỡ (ly hôn/ly thân)", "Tasa de Ruptura Familiar (Divorcio/Separación)"), value: t("중독자의 54%", "54% of addicts", "中毒者の54%", "成瘾者的54%", "54% người nghiện", "54% de adictos"), source: "KCGP" },
        { label: t("자살 시도 경험", "Suicide Attempt History", "自殺試図経験", "自杀尝试经历", "Tiền sử tự tử", "Historial de Intentos de Suicidio"), value: t("중독자의 9.8%", "9.8% of addicts", "中毒者の9.8%", "成瘾者的9.8%", "9,8% người nghiện", "9.8% de adictos"), source: "KCGP" },
        { label: t("도박 중독 상담 전화", "Gambling Addiction Helpline", "ギャンブル中毒相談電話", "赌博成瘾咨询热线", "Đường dây hỗ trợ nghiện cờ bạc", "Línea de Ayuda para Adicción al Juego"), value: t("1336 (24시간 무료)", "1336 (24-hour free)", "1336（24時間無料）", "1336（24小时免费）", "1336 (miễn phí 24/24)", "1336 (gratuito 24 horas)"), source: "KCGP" },
      ],
      sources: [
        t("한국도박문제관리센터(KCGP)", "Korea Center on Gambling Problems (KCGP)", "韓国ギャンブル問題管理センター(KCGP)", "韩国赌博问题管理中心(KCGP)", "Trung tâm Quản lý Vấn đề Cờ bạc Hàn Quốc (KCGP)", "Centro de Gestión de Problemas de Juego de Corea (KCGP)"),
        t("한국형사정책연구원", "Korea Institute of Criminology", "韓国刑事政策研究院", "韩国刑事政策研究院", "Viện Nghiên cứu Chính sách Hình sự Hàn Quốc", "Instituto Coreano de Criminología"),
        t("통계청 사망원인통계", "Statistics Korea Cause of Death", "統計庁死亡原因統計", "统计厅死亡原因统计", "Thống kê Nguyên nhân Tử vong - Cục Thống kê", "Estadísticas de Causa de Muerte - KOSTAT"),
      ],
      note: t(
        "도박은 '운'이 아닙니다. 처음엔 이기도록 설계되어 있습니다. 중독되면 혼자 멈추기 어렵습니다.",
        "Gambling is not about 'luck.' It is designed to make you win at first. Once addicted, stopping alone is very hard.",
        "ギャンブルは「運」ではありません。最初は勝つように設計されています。中毒になると一人では止めにくいです。",
        "赌博不是'运气'。它被设计成让你一开始就赢。一旦上瘾，独自停下来非常困难。",
        "Cờ bạc không phải 'may mắn'. Nó được thiết kế để bạn thắng lúc đầu. Khi đã nghiện, rất khó tự dừng lại.",
        "El juego no es 'suerte'. Está diseñado para que ganes al principio. Una vez adicto, es muy difícil parar solo.",
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f2eaf6", color: "#2a1a3a" }}>

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
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #9161b2, #7c4da8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BarChart2 size={14} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#1c0d2e" }}>
          {t("국가기관 공식 범죄 통계", "Official Government Crime Statistics", "国家機関公式犯罪統計", "国家机关官方犯罪统计", "Thống kê Tội phạm Chính thức của Cơ quan Nhà nước", "Estadísticas Oficiales de Crimen del Gobierno")}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", background: "#f0fdf4", padding: "2px 8px", borderRadius: 20, border: "1px solid #bbf7d0" }}>
          {t("경찰청·금감원·KCGP 데이터", "NPA · FSS · KCGP Data", "警察庁・金融監督院・KCGPデータ", "警察厅·金融监督院·KCGP数据", "Dữ liệu NPA · FSS · KCGP", "Datos NPA · FSS · KCGP")}
        </span>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "28px 16px 80px" : "52px 40px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <p style={{ color: "#9161b2", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>OFFICIAL DATA</p>
          <h1 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 900, letterSpacing: -1, color: "#1c0d2e", marginBottom: 14 }}>
            {t("국가가 공식 집계한 범죄 통계", "Officially Compiled Government Crime Statistics", "国家が公式に集計した犯罪統計", "国家官方汇编的犯罪统计", "Thống kê Tội phạm được Nhà nước Chính thức Tổng hợp", "Estadísticas de Crimen Oficialmente Compiladas por el Gobierno")}
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8 }}>
            {t(
              "이 페이지의 모든 통계는 ",
              "All statistics on this page are based on official publications by ",
              "このページのすべての統計は",
              "本页所有统计数据均基于",
              "Tất cả thống kê trên trang này dựa trên tài liệu chính thức của ",
              "Todas las estadísticas de esta página se basan en publicaciones oficiales de ",
            )}
            <strong style={{ color: "#334155" }}>
              {t(
                "경찰청·금융감독원·한국도박문제관리센터·통계청·대검찰청",
                "the National Police Agency, FSS, KCGP, Statistics Korea, and the Supreme Prosecutors' Office",
                "警察庁・金融監督院・韓国ギャンブル問題管理センター・統計庁・大検察庁",
                "警察厅、金融监督院、韩国赌博问题管理中心、统计厅、大检察厅",
                "Cảnh sát Quốc gia, FSS, KCGP, Cục Thống kê và Viện Kiểm sát Tối cao",
                "la Policía Nacional, FSS, KCGP, Statistics Korea y la Fiscalía Suprema",
              )}
            </strong>
            {t(
              " 등\n대한민국 공식 국가기관의 발표 자료를 기반으로 합니다.\n각 항목 하단의 출처 링크에서 원문 데이터를 직접 확인하실 수 있습니다.",
              ".\nYou can verify the original data via source links at the bottom of each section.",
              "などの\n大韓民国公式国家機関の発表資料を基にしています。\n各項目下部の出典リンクから原文データを直接確認できます。",
              "等\n大韩民国官方国家机关的发布资料。\n您可以通过每个项目底部的来源链接直接查看原始数据。",
              ".\nBạn có thể xác minh dữ liệu gốc qua liên kết nguồn ở cuối mỗi mục.",
              ".\nPuedes verificar los datos originales a través de los enlaces de fuente al final de cada sección.",
            )}
          </p>
        </div>

        {/* Banner */}
        <div style={{
          background: "linear-gradient(135deg, #1c0d2e, #2a1a3a)",
          borderRadius: 20, padding: isMobile ? "20px 18px" : "26px 32px", marginBottom: 36,
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        }}>
          <Shield size={32} color="#c58dc6" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
              {t(
                "이 프로그램은 대한민국 모든 시민을 위해 만들어졌습니다",
                "This program was made for every citizen of Korea",
                "このプログラムは大韓民国のすべての市民のために作られました",
                "本程序为大韩民国所有市民而制作",
                "Chương trình này được tạo ra cho mọi công dân Hàn Quốc",
                "Este programa fue creado para todos los ciudadanos de Corea",
              )}
            </p>
            <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8 }}>
              {t(
                "학생·청년·직장인·어르신·누구나 무료로 이용할 수 있습니다. 범죄를 당하지도, 저지르지도, 악용하지도 않는 사회를 위해.",
                "Students, young people, workers, seniors — everyone can use it for free. For a society where no one is victimized, commits, or exploits crime.",
                "学生・若者・会社員・高齢者・誰でも無料で利用できます。犯罪に遭わず、犯さず、悪用しない社会のために。",
                "学生、青年、上班族、老人——任何人都可以免费使用。为了一个不受犯罪侵害、不犯罪、不恶意利用的社会。",
                "Học sinh, người trẻ, người đi làm, người cao tuổi — ai cũng có thể sử dụng miễn phí. Vì một xã hội không ai bị tội phạm nhắm tới, thực hiện hay lợi dụng.",
                "Estudiantes, jóvenes, trabajadores, adultos mayores — todos pueden usarlo gratis. Por una sociedad donde nadie sea víctima, cometa ni explote el crimen.",
              )}
              <br />
              <strong style={{ color: "#c58dc6" }}>
                {t(
                  "알면 막을 수 있습니다.",
                  "Knowledge is prevention.",
                  "知れば防げます。",
                  "知道就能预防。",
                  "Biết là có thể ngăn chặn.",
                  "Saber es prevenir.",
                )}
              </strong>
              {" "}
              {t(
                "이 통계가 바로 그 증거입니다.",
                "These statistics are the proof.",
                "この統計がその証拠です。",
                "这些统计数据就是证明。",
                "Những thống kê này chính là bằng chứng.",
                "Estas estadísticas son la prueba.",
              )}
            </p>
          </div>
        </div>

        {/* Sources */}
        <div style={{
          background: "#fdf8ff", borderRadius: 20, padding: "24px 28px",
          border: "1px solid #f1f5f9", marginBottom: 36,
          boxShadow: "0 2px 12px #0000000a",
        }}>
          <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            📎 {t("공식 출처 사이트 바로가기", "Official Source Sites", "公式出典サイトへ", "官方来源网站", "Trang web nguồn chính thức", "Sitios de Fuente Oficial")}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {SOURCES.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 22,
                  background: s.color + "0e",
                  border: `1px solid ${s.color}28`,
                  color: s.color, fontSize: 12, fontWeight: 600,
                  textDecoration: "none", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = s.color + "18";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = s.color + "0e";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {s.name} <ExternalLink size={11} />
              </a>
            ))}
          </div>
        </div>

        {/* Crime stats accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {CRIME_STATS.map((crime) => {
            const isOpen = openId === crime.id;
            return (
              <div key={crime.id} style={{
                background: "#fdf8ff", borderRadius: 18,
                border: `1px solid ${isOpen ? crime.color + "40" : "#f1f5f9"}`,
                boxShadow: isOpen ? `0 4px 24px ${crime.color}12` : "0 2px 8px #0000000a",
                overflow: "hidden", transition: "all 0.2s",
              }}>
                <button
                  onClick={() => setOpenId(isOpen ? null : crime.id)}
                  style={{
                    width: "100%", padding: "20px 24px",
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 16,
                    textAlign: "left",
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: crime.bg, border: `1px solid ${crime.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>
                    {crime.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{crime.title}</p>
                    <p style={{ color: crime.color, fontSize: 13, fontWeight: 600 }}>{crime.summary}</p>
                  </div>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: isOpen ? crime.color + "18" : "#f8fafc",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}>
                    {isOpen
                      ? <ChevronUp size={16} color={crime.color} />
                      : <ChevronDown size={16} color="#94a3b8" />
                    }
                  </div>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 24px 24px" }}>
                    <div style={{ height: 1, background: crime.border, marginBottom: 20 }} />

                    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 20 }}>
                      {crime.stats.map((stat, i) => (
                        <div key={stat.label} style={{
                          display: isMobile ? "flex" : "grid",
                          flexDirection: isMobile ? "column" : undefined,
                          gridTemplateColumns: isMobile ? undefined : "1fr auto auto",
                          alignItems: isMobile ? "flex-start" : "center",
                          gap: isMobile ? 4 : 16, padding: "11px 0",
                          borderBottom: i < crime.stats.length - 1 ? `1px solid ${crime.bg}` : "none",
                        }}>
                          <span style={{ color: "#64748b", fontSize: 13 }}>{stat.label}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{
                            color: stat.bold ? crime.color : "#1c0d2e",
                            fontWeight: stat.bold ? 800 : 600,
                            fontSize: stat.bold ? (isMobile ? 14 : 16) : 14,
                          }}>
                            {stat.value}
                          </span>
                          <span style={{
                            fontSize: 10, padding: "2px 8px", borderRadius: 12, fontWeight: 600,
                            background: crime.bg, color: crime.color,
                            border: `1px solid ${crime.border}`,
                            whiteSpace: "nowrap",
                          }}>
                            {stat.source}
                          </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      background: crime.bg, border: `1px solid ${crime.border}`,
                      borderRadius: 12, padding: "12px 16px", marginBottom: 20,
                    }}>
                      <p style={{ color: crime.color, fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
                        ⚠️ {crime.note}
                      </p>
                    </div>

                    <div>
                      <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>
                        {t("데이터 출처", "Data Sources", "データ出典", "数据来源", "Nguồn dữ liệu", "Fuentes de Datos")}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {crime.sources.map((srcName) => {
                          const src = SOURCES.find(s => s.name === srcName);
                          return src ? (
                            <a
                              key={srcName}
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                padding: "6px 12px", borderRadius: 20,
                                background: src.color + "0e", border: `1px solid ${src.color}28`,
                                color: src.color, fontSize: 11, fontWeight: 600,
                                textDecoration: "none",
                              }}
                            >
                              {srcName} <ExternalLink size={10} />
                            </a>
                          ) : null;
                        })}
                        <button
                          onClick={() => router.push(crime.id === "illegal-gambling" ? "/gambling" : `/crime/${crime.id}`)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "6px 12px", borderRadius: 20,
                            background: crime.color, color: "#fff",
                            border: "none", cursor: "pointer",
                            fontSize: 11, fontWeight: 700,
                          }}
                        >
                          {t("직접 체험해보기 →", "Try It Yourself →", "直接体験してみる →", "直接体验 →", "Thử trải nghiệm trực tiếp →", "Pruébalo Tú Mismo →")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: 48, background: "#fdf8ff", borderRadius: 18,
          padding: "28px 32px", border: "1px solid #e2e8f0",
          boxShadow: "0 2px 12px #0000000a",
        }}>
          <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
            📌 {t("통계 이용 안내", "Statistics Usage Notice", "統計利用案内", "统计使用说明", "Hướng dẫn Sử dụng Thống kê", "Aviso de Uso de Estadísticas")}
          </p>
          <ul style={{ color: "#64748b", fontSize: 13, lineHeight: 2.2, paddingLeft: 16 }}>
            <li>
              {t(
                "이 페이지의 통계 수치는 각 기관의 최신 공개 자료를 기준으로 하며, 실제 수치와 소폭 차이가 있을 수 있습니다.",
                "Statistics on this page are based on the latest public data from each institution and may differ slightly from actual figures.",
                "このページの統計数値は各機関の最新公開資料を基準とし、実際の数値と若干差がある場合があります。",
                "本页统计数据以各机构最新公开资料为准，可能与实际数字略有差异。",
                "Số liệu thống kê trên trang này dựa trên tài liệu công khai mới nhất của từng cơ quan và có thể khác đôi chút so với số liệu thực tế.",
                "Las estadísticas en esta página se basan en los datos públicos más recientes de cada institución y pueden diferir ligeramente de las cifras reales.",
              )}
            </li>
            <li>
              {t(
                "정확한 최신 데이터는 각 출처 기관 홈페이지에서 직접 확인하시기 바랍니다.",
                "For the most accurate and up-to-date data, please check the official websites of each source institution directly.",
                "正確な最新データは各出典機関のホームページで直接ご確認ください。",
                "如需准确的最新数据，请直接访问各来源机构官方网站。",
                "Để có dữ liệu chính xác và mới nhất, vui lòng kiểm tra trực tiếp trên trang web chính thức của từng cơ quan nguồn.",
                "Para obtener los datos más precisos y actualizados, consulte directamente los sitios web oficiales de cada institución fuente.",
              )}
            </li>
            <li>
              {t(
                "통계 오류 또는 업데이트 요청: ",
                "Report errors or request updates: ",
                "統計エラーまたは更新リクエスト: ",
                "统计错误或更新请求: ",
                "Báo lỗi hoặc yêu cầu cập nhật: ",
                "Reportar errores o solicitar actualizaciones: ",
              )}
              <strong style={{ color: "#9161b2" }}>itnlifecn@gmail.com</strong>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
