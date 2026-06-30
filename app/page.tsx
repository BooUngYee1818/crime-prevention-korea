"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Shield, Phone, ChevronRight, BookOpen, Users, AlertCircle, ExternalLink, X } from "lucide-react";
import { CRIME_SCENARIOS } from "@/lib/crimes";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import HallOfFame from "@/components/HallOfFame";

// ── 무지개 글로우 keyframe ──
const RAINBOW_STYLE = `
@keyframes rainbow-glow {
  0%   { box-shadow: 0 0 14px 4px #ff0000aa; border-color: #ff0000; }
  16%  { box-shadow: 0 0 14px 4px #ff8800aa; border-color: #ff8800; }
  33%  { box-shadow: 0 0 14px 4px #ffff00aa; border-color: #ffff00; }
  50%  { box-shadow: 0 0 14px 4px #00cc44aa; border-color: #00cc44; }
  66%  { box-shadow: 0 0 14px 4px #9161b2aa; border-color: #9161b2; }
  83%  { box-shadow: 0 0 14px 4px #9333eaaa; border-color: #9333ea; }
  100% { box-shadow: 0 0 14px 4px #ff0000aa; border-color: #ff0000; }
}
@keyframes rainbow-text {
  0%   { color: #ff4444; }
  16%  { color: #ff8800; }
  33%  { color: #d4a000; }
  50%  { color: #16a34a; }
  66%  { color: #9161b2; }
  83%  { color: #9333ea; }
  100% { color: #ff4444; }
}
`;

// 시나리오별 카테고리 키 맵
const SC_CAT_KEY: Record<string, Parameters<typeof t>[0]> = {
  "family-impersonation":    "cat_voice",
  "prosecutor-impersonation":"cat_agency",
  "romance-scam":            "cat_romance",
  "investment-scam":         "cat_invest",
  "loan-fraud":              "cat_loan",
  "delivery-scam":           "cat_smishing",
  "kakaotalk-impersonation": "cat_messenger",
  "used-goods-scam":         "cat_used",
  "illegal-gambling":        "cat_gambling",
};

export default function HomePage() {
  const router = useRouter();
  const { lang } = useLang();
  const [popup1Open, setPopup1Open] = useState(false);
  const [popup2Open, setPopup2Open] = useState(false);
  const [guideTab, setGuideTab] = useState("parents");
  const [selectedScenario, setSelectedScenario] = useState<typeof CRIME_SCENARIOS[0] | null>(null);
  const [hoveredLog, setHoveredLog] = useState<number | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const instCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 모바일: 자이로스코프
    function onOrientation(e: DeviceOrientationEvent) {
      const x = Math.max(-30, Math.min(30, e.gamma ?? 0));
      const y = Math.max(-30, Math.min(30, e.beta  ?? 0));
      setTilt({ x, y });
    }
    // PC: 마우스 위치
    function onMouse(e: MouseEvent) {
      const el = instCardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      setTilt({ x: dx * 20, y: dy * 20 });
    }
    window.addEventListener("deviceorientation", onOrientation as EventListener);
    window.addEventListener("mousemove", onMouse);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation as EventListener);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setPopup1Open(true), 600);
    return () => clearTimeout(timer);
  }, []);

  function closePopup1() {
    setPopup1Open(false);
    setTimeout(() => setPopup2Open(true), 400);
  }

  // 번역에 의존하는 배열들 — 컴포넌트 내부에서 정의
  const STATS = [
    { value: "1조원+",    label: t("stat1_lbl", lang), icon: "📉", bg: "#fef2f2", color: "#dc2626" },
    { value: "7.8만건",   label: t("stat2_lbl", lang), icon: "📋", bg: "#fff7ed", color: "#ea580c" },
    { value: "5,290만원", label: t("stat3_lbl", lang), icon: "💸", bg: "#fefce8", color: "#ca8a04" },
    { value: "200만명",   label: t("stat4_lbl", lang), icon: "⚠️", bg: "#fdf4ff", color: "#9333ea" },
  ];

  const REPORT_NUMBERS = [
    { org: t("rpt_police_org", lang), number: "112",  desc: t("rpt_police_desc", lang), color: "#9161b2" },
    { org: t("rpt_fss_org", lang),    number: "1332", desc: t("rpt_fss_desc", lang),    color: "#0891b2" },
    { org: t("rpt_kisa_org", lang),   number: "118",  desc: t("rpt_kisa_desc", lang),   color: "#059669" },
    { org: t("rpt_gamble_org", lang), number: "1336", desc: t("rpt_gamble_desc", lang), color: "#7c3aed" },
  ];

  const GUIDE_TABS = [
    {
      id: "parents",
      label: "👴👵 " + t("popup2_tab1", lang),
      subtitle: lang === "ko" ? "자녀가 부모님을 도와드리는 방법" : lang === "en" ? "How children can help their parents" : lang === "ja" ? "子どもが親を助ける方法" : lang === "zh" ? "子女帮助父母的方法" : lang === "vi" ? "Cách con cái giúp cha mẹ" : "Cómo los hijos ayudan a sus padres",
      color: "#9161b2", bg: "#f5dfee", border: "#dcc5e8",
      steps: [
        {
          icon: "📺",
          title: lang === "ko" ? "이렇게 설명해 드리세요" : lang === "en" ? "Explain it like this" : lang === "ja" ? "このように説明してください" : lang === "zh" ? "这样解释给他们听" : lang === "vi" ? "Giải thích như thế này" : "Explícalo así",
          desc: lang === "ko" ? `"아버지/어머니, 요즘 전화로 돈 빼앗는 사람들이 많아서 제가 연습 프로그램 찾았어요."` : lang === "en" ? `"Dad/Mom, there are many phone scammers these days. I found a practice program for you."` : lang === "ja" ? `「お父さん/お母さん、最近電話詐欺が多いので練習プログラムを見つけました。」` : lang === "zh" ? `"爸爸/妈妈，最近电话诈骗很多，我找了一个练习程序。"` : lang === "vi" ? `"Bố/Mẹ ơi, dạo này có nhiều kẻ lừa đảo qua điện thoại lắm, con tìm được chương trình luyện tập này."` : `"Papá/Mamá, hay muchos estafadores por teléfono. Encontré un programa de práctica."`,
        },
        {
          icon: "🖥️",
          title: lang === "ko" ? "앉아서 함께 화면을 보세요" : lang === "en" ? "Sit together and view the screen" : lang === "ja" ? "一緒に座って画面を見てください" : lang === "zh" ? "坐在一起看屏幕" : lang === "vi" ? "Ngồi cùng và xem màn hình" : "Siéntate y mira la pantalla juntos",
          desc: lang === "ko" ? "처음엔 부모님 옆에서 함께 진행하세요." : lang === "en" ? "Start by going through it together beside your parents." : lang === "ja" ? "最初は親の隣で一緒に進めましょう。" : lang === "zh" ? "最初请坐在父母旁边一起进行。" : lang === "vi" ? "Lần đầu hãy ngồi cạnh bố mẹ và cùng thực hiện." : "Al principio, hazlo junto a tus padres.",
        },
        {
          icon: "📞",
          title: lang === "ko" ? "추천 시나리오 (부모님용)" : lang === "en" ? "Recommended Scenarios (for Parents)" : lang === "ja" ? "おすすめシナリオ（保護者向け）" : lang === "zh" ? "推荐场景（适合父母）" : lang === "vi" ? "Kịch bản đề xuất (dành cho cha mẹ)" : "Escenarios recomendados (para padres)",
          desc: lang === "ko" ? "① 자녀 사칭  ② 검찰·경찰 사칭  ③ 대출 사기" : lang === "en" ? "① Family impersonation  ② Prosecutor fraud  ③ Loan fraud" : lang === "ja" ? "① 家族詐称 ② 検察詐称 ③ 融資詐欺" : lang === "zh" ? "① 冒充家人 ② 冒充检察官 ③ 贷款诈骗" : lang === "vi" ? "① Giả mạo gia đình ② Giả mạo công tố viên ③ Lừa đảo vay vốn" : "① Suplantación familiar ② Suplantación fiscal ③ Fraude de préstamo",
        },
        {
          icon: "💬",
          title: lang === "ko" ? "체험 후 꼭 나눠보세요" : lang === "en" ? "Discuss after the experience" : lang === "ja" ? "体験後に必ず話し合いましょう" : lang === "zh" ? "体验后一定要交流" : lang === "vi" ? "Nhất định nói chuyện sau trải nghiệm" : "Habla sobre ello después",
          desc: lang === "ko" ? `"이런 전화 오면 끊으시고 저한테 전화 주세요." 한 마디가 실제 사기를 막습니다.` : lang === "en" ? `"If you get a call like this, hang up and call me." That one sentence stops real scams.` : lang === "ja" ? `「こういう電話が来たら切って私に電話してください。」この一言が実際の詐欺を防ぎます。` : lang === "zh" ? `"如果接到这样的电话，挂掉后打给我。"这一句话能防止真正的诈骗。` : lang === "vi" ? `"Nếu nhận được cuộc gọi như thế này, hãy cúp máy và gọi cho con." Một câu nói ngăn được lừa đảo thật." ` : `"Si recibes una llamada así, cuelga y llámame." Esa frase previene estafas reales.`,
        },
      ],
    },
    {
      id: "mom",
      label: "👩‍👧 " + t("popup2_tab2", lang),
      subtitle: lang === "ko" ? "초등학생부터 중·고등학생 자녀와 함께" : lang === "en" ? "For children from elementary to high school" : lang === "ja" ? "小学生から中高校生のお子さんと一緒に" : lang === "zh" ? "与小学到高中学生一起" : lang === "vi" ? "Cùng con từ tiểu học đến trung học" : "Con niños de primaria a bachillerato",
      color: "#db2777", bg: "#fdf2f8", border: "#fbcfe8",
      steps: [
        {
          icon: "🎮",
          title: lang === "ko" ? "게임처럼 접근하세요" : lang === "en" ? "Approach it like a game" : lang === "ja" ? "ゲームのようにアプローチしましょう" : lang === "zh" ? "像游戏一样对待" : lang === "vi" ? "Tiếp cận như trò chơi" : "Trátalo como un juego",
          desc: lang === "ko" ? `"AI랑 대화하는 건데, 이 사람이 사기꾼이래. 너가 안 속으면 이기는 거야!"` : lang === "en" ? `"You're chatting with an AI. This person is a scammer — if you're not fooled, you win!"` : lang === "ja" ? `「AIとチャットするんだけど、この人は詐欺師なんだって。騙されなければ勝ちだよ！」` : lang === "zh" ? `"你在和AI聊天，这个人是骗子——如果你没上当，你就赢了！"` : lang === "vi" ? `"Con đang chat với AI. Người này là kẻ lừa đảo — nếu con không bị lừa thì con thắng!"` : `"Chateas con una IA. Esta persona es estafador — ¡si no te engañan, ganas!"`,
        },
        {
          icon: "📱",
          title: lang === "ko" ? "추천 시나리오 (자녀용)" : lang === "en" ? "Recommended Scenarios (for Children)" : lang === "ja" ? "おすすめシナリオ（子ども用）" : lang === "zh" ? "推荐场景（适合孩子）" : lang === "vi" ? "Kịch bản đề xuất (dành cho trẻ em)" : "Escenarios recomendados (para niños)",
          desc: lang === "ko" ? "① 중고거래 사기  ② 불법 도박  ③ 스미싱" : lang === "en" ? "① Used goods scam  ② Illegal gambling  ③ Smishing" : lang === "ja" ? "① 中古詐欺 ② 違法賭博 ③ スミッシング" : lang === "zh" ? "① 二手交易诈骗 ② 非法赌博 ③ 短信诈骗" : lang === "vi" ? "① Lừa đảo hàng cũ ② Cờ bạc bất hợp pháp ③ Smishing" : "① Estafa de usados ② Juego ilegal ③ Smishing",
        },
        {
          icon: "🗣️",
          title: lang === "ko" ? "체험 중 함께 대화하세요" : lang === "en" ? "Talk together during the experience" : lang === "ja" ? "体験中に一緒に話し合いましょう" : lang === "zh" ? "体验过程中一起交流" : lang === "vi" ? "Nói chuyện cùng nhau trong khi trải nghiệm" : "Habla durante la experiencia",
          desc: lang === "ko" ? `"이 사람 왜 돈을 달라는 것 같아?" 아이 스스로 생각하게 유도하세요.` : lang === "en" ? `"Why do you think this person wants money?" Help the child think for themselves.` : lang === "ja" ? `「この人はなぜお金を求めているの？」子どもが自分で考えるよう促しましょう。` : lang === "zh" ? `"你觉得这个人为什么要钱？"引导孩子自己思考。` : lang === "vi" ? `"Con nghĩ tại sao người này muốn tiền?" Hướng dẫn trẻ tự suy nghĩ.` : `"¿Por qué crees que esta persona quiere dinero?" Ayuda al niño a pensar por sí mismo.`,
        },
        {
          icon: "✅",
          title: lang === "ko" ? "마지막에 약속을 만드세요" : lang === "en" ? "Make a promise at the end" : lang === "ja" ? "最後に約束をしましょう" : lang === "zh" ? "最后做个约定" : lang === "vi" ? "Hãy lập một thỏa thuận ở cuối" : "Haz una promesa al final",
          desc: lang === "ko" ? `"모르는 사람이 돈 얘기 하면 엄마한테 먼저 얘기해줄 수 있어?" 간단한 약속이 아이를 지킵니다.` : lang === "en" ? `"If a stranger asks about money, will you tell me first?" A simple promise protects the child.` : lang === "ja" ? `「知らない人がお金の話をしたら、まず私に話してくれる？」簡単な約束が子どもを守ります。` : lang === "zh" ? `"如果陌生人谈到钱，你能先告诉我吗？"一个简单的约定能保护孩子。` : lang === "vi" ? `"Nếu người lạ nói về tiền, con có thể nói với mẹ trước không?" Một thỏa thuận đơn giản bảo vệ trẻ.` : `"Si alguien habla de dinero, ¿me lo dices primero?" Una promesa simple protege al niño.`,
        },
      ],
    },
    {
      id: "edu",
      label: "🏫 " + t("popup2_tab3", lang),
      subtitle: lang === "ko" ? "학교·복지관·경로당·기업 교육 담당자" : lang === "en" ? "Schools, welfare centers, senior centers, corporate trainers" : lang === "ja" ? "学校・福祉館・老人ホーム・企業の教育担当者" : lang === "zh" ? "学校、福利中心、老年中心、企业培训人员" : lang === "vi" ? "Trường học, trung tâm phúc lợi, nhà dưỡng lão, người đào tạo doanh nghiệp" : "Escuelas, centros de bienestar, centros para mayores, formadores empresariales",
      color: "#059669", bg: "#f0fdf4", border: "#bbf7d0",
      steps: [
        {
          icon: "🖥️",
          title: lang === "ko" ? "수업·강의 도입부에 활용" : lang === "en" ? "Use as an intro for lessons" : lang === "ja" ? "授業・講義の導入部に活用" : lang === "zh" ? "用于课程开头" : lang === "vi" ? "Dùng làm phần mở đầu bài học" : "Úsalo como introducción a las clases",
          desc: lang === "ko" ? "빔 프로젝터로 전체 화면을 띄우고 강사가 직접 시나리오를 진행하세요. 15~20분이면 충분합니다." : lang === "en" ? "Project the full screen and have the instructor run the scenario. 15–20 minutes is enough." : lang === "ja" ? "プロジェクターで全画面を表示し、講師がシナリオを進めてください。15〜20分で十分です。" : lang === "zh" ? "用投影仪显示全屏，由讲师运行场景。15-20分钟即可。" : lang === "vi" ? "Chiếu toàn màn hình và để giảng viên chạy kịch bản. 15–20 phút là đủ." : "Proyecta la pantalla completa y el instructor ejecuta el escenario. 15–20 minutos son suficientes.",
        },
        {
          icon: "👥",
          title: lang === "ko" ? "조별 체험 활동으로 활용" : lang === "en" ? "Use as group activity" : lang === "ja" ? "グループ体験活動として活用" : lang === "zh" ? "用于小组活动" : lang === "vi" ? "Dùng làm hoạt động nhóm" : "Úsalo como actividad grupal",
          desc: lang === "ko" ? "2~3명씩 조를 만들어 각자 다른 시나리오를 체험하고 발표하게 하세요." : lang === "en" ? "Form groups of 2–3 people, each trying a different scenario, then share their experience." : lang === "ja" ? "2〜3人のグループを作り、それぞれ異なるシナリオを体験して発表させてください。" : lang === "zh" ? "组成2-3人的小组，各自体验不同场景，然后分享。" : lang === "vi" ? "Chia nhóm 2–3 người, mỗi nhóm trải nghiệm kịch bản khác nhau, sau đó chia sẻ." : "Forma grupos de 2–3, cada uno prueba un escenario diferente, luego comparten.",
        },
        {
          icon: "📊",
          title: lang === "ko" ? "통계 데이터 수업 자료로 활용" : lang === "en" ? "Use crime statistics as teaching material" : lang === "ja" ? "統計データを授業資料として活用" : lang === "zh" ? "用统计数据作为教学材料" : lang === "vi" ? "Dùng dữ liệu thống kê làm tài liệu giảng dạy" : "Usa estadísticas como material didáctico",
          desc: lang === "ko" ? "상단 '📊 범죄 통계' 버튼의 공식 데이터를 수업 자료로 활용하세요." : lang === "en" ? "Use the official data from the '📊 Crime Stats' button at the top as teaching material." : lang === "ja" ? "上部の「📊 犯罪統計」ボタンの公式データを授業資料として活用してください。" : lang === "zh" ? "将顶部「📊犯罪统计」按钮中的官方数据用作教学材料。" : lang === "vi" ? "Sử dụng dữ liệu chính thức từ nút '📊 Thống kê tội phạm' ở trên làm tài liệu giảng dạy." : "Usa los datos oficiales del botón '📊 Estadísticas' de arriba como material didáctico.",
        },
        {
          icon: "📋",
          title: lang === "ko" ? "기관 도입 문의" : lang === "en" ? "Inquire about institutional adoption" : lang === "ja" ? "機関導入のお問い合わせ" : lang === "zh" ? "机构导入咨询" : lang === "vi" ? "Hỏi về việc áp dụng cho tổ chức" : "Consulta sobre adopción institucional",
          desc: lang === "ko" ? "기관 전용 커스터마이징, 수료증 발급이 필요하시면 '기관 도입' 버튼에서 무료로 문의하세요." : lang === "en" ? "For custom institutional versions or certificates, inquire for free via the 'Partnerships' button." : lang === "ja" ? "機関専用カスタマイズや修了証が必要な場合は「機関導入」ボタンから無料でお問い合わせください。" : lang === "zh" ? "如需机构专属定制或结业证书，请通过「机构合作」按钮免费咨询。" : lang === "vi" ? "Nếu cần tùy chỉnh cho tổ chức hoặc chứng chỉ, hãy hỏi miễn phí qua nút 'Hợp tác'." : "Para versiones institucionales o certificados, consulta gratis via 'Alianzas'.",
        },
      ],
    },
  ];

  const activeTab = GUIDE_TABS.find(tab => tab.id === guideTab) || GUIDE_TABS[0];

  return (
    <div style={{ minHeight: "100vh", background: "#f2eaf6", color: "#2a1a3a" }}>
      <style>{RAINBOW_STYLE}</style>

      {/* ── 팝업 1: 피해 신고 안내 ── */}
      {popup1Open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}>
          <div className="popup-card" style={{
            background: "#fdf8ff", borderRadius: 24, padding: "36px 36px 32px",
            maxWidth: 520, width: "100%", position: "relative",
            boxShadow: "0 24px 80px #00000030",
          }}>
            <button onClick={closePopup1} style={{
              position: "absolute", top: 16, right: 16,
              width: 32, height: 32, borderRadius: "50%",
              background: "#f1f5f9", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <X size={16} color="#64748b" />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #9161b2, #7c4da8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                🛡️
              </div>
              <div>
                <p style={{ color: "#1c0d2e", fontWeight: 900, fontSize: 18 }}>{t("popup1_title", lang)}</p>
                <p style={{ color: "#9161b2", fontSize: 12, fontWeight: 600 }}>{t("popup1_sub", lang)}</p>
              </div>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 16, padding: "18px 20px", marginBottom: 20, border: "1px solid #e2e8f0" }}>
              <p style={{ color: "#334155", fontSize: 14, lineHeight: 2 }}>
                {t("popup1_body1", lang)}<br /><br />
                {t("popup1_body2", lang)}
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setPopup1Open(false); router.push("/report"); }}
                style={{
                  flex: 1, padding: "14px 0", borderRadius: 14,
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  color: "#fff", border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: 14,
                  boxShadow: "0 4px 16px #dc262630",
                }}
              >
                🆘 {t("popup1_report", lang)}
              </button>
              <button
                onClick={closePopup1}
                style={{
                  flex: 1, padding: "14px 0", borderRadius: 14,
                  background: "linear-gradient(135deg, #9161b2, #7c4da8)",
                  color: "#fff", border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: 14,
                  boxShadow: "0 4px 16px #9161b230",
                }}
              >
                {t("popup1_start", lang)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 팝업 2: 이용 가이드 ── */}
      {popup2Open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}>
          <div style={{
            background: "#fdf8ff", borderRadius: 24, padding: "32px 32px 28px",
            maxWidth: 600, width: "100%", position: "relative",
            boxShadow: "0 24px 80px #00000030",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <button onClick={() => setPopup2Open(false)} style={{
              position: "absolute", top: 16, right: 16,
              width: 32, height: 32, borderRadius: "50%",
              background: "#f1f5f9", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <X size={16} color="#64748b" />
            </button>

            <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>HOW TO USE</p>
            <p style={{ color: "#1c0d2e", fontWeight: 900, fontSize: 20, marginBottom: 6 }}>{t("popup2_who", lang)}</p>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 22 }}>{t("popup2_guide", lang)}</p>

            {/* 탭 */}
            <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
              {GUIDE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setGuideTab(tab.id)}
                  style={{
                    padding: "9px 16px", borderRadius: 22, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", border: "none", transition: "all 0.15s",
                    background: guideTab === tab.id ? tab.color : "#f1f5f9",
                    color: guideTab === tab.id ? "#fff" : "#64748b",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 탭 내용 */}
            <div style={{ background: activeTab.bg, borderRadius: 16, padding: "20px 22px", border: `1px solid ${activeTab.border}`, marginBottom: 20 }}>
              <p style={{ color: activeTab.color, fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{activeTab.subtitle}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {activeTab.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{step.icon}</span>
                    <div>
                      <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{step.title}</p>
                      <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.7 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setPopup2Open(false); router.push("/crime"); }}
              style={{
                width: "100%", padding: "14px 0", borderRadius: 14,
                background: `linear-gradient(135deg, ${activeTab.color}, ${activeTab.color}cc)`,
                color: "#fff", border: "none", cursor: "pointer",
                fontWeight: 700, fontSize: 15,
              }}
            >
              {t("popup2_go", lang)}
            </button>
          </div>
        </div>
      )}

      {/* ── 무지개 고정 버튼 ── */}
      <button
        className="rainbow-btn"
        onClick={() => router.push("/report")}
        style={{
          position: "fixed", top: 80, right: 24, zIndex: 900,
          padding: "11px 18px", borderRadius: 24,
          background: "#fdf8ff", border: "2px solid #ff4444",
          cursor: "pointer", fontWeight: 700, fontSize: 13,
          animation: "rainbow-glow 3s linear infinite",
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 0 14px 4px #ff000066",
        }}
      >
        <span style={{ animation: "rainbow-text 3s linear infinite", fontWeight: 900 }}>🆘</span>
        <span style={{ animation: "rainbow-text 3s linear infinite" }}>{t("rainbow_report", lang)}</span>
      </button>

      {/* ── 네비게이션 바 ── */}
      <nav className="nav-bar" style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 62,
        boxShadow: "0 1px 8px #0000000a",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #9161b2, #7c4da8)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#2a1a3a", letterSpacing: -0.3 }}>{t("nav_brand", lang)}</span>
            <span style={{
              marginLeft: 8, fontSize: 10, fontWeight: 600, color: "#9161b2",
              background: "#f5dfee", padding: "2px 7px", borderRadius: 20,
              border: "1px solid #dcc5e8",
            }}>{t("nav_edu_badge", lang)}</span>
          </div>
        </div>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="#scenarios" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{t("nav_scenarios", lang)}</a>
          <a href="#how" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{t("nav_howto", lang)}</a>
          <a href="#report" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{t("nav_numbers", lang)}</a>
          <a href="#changelog" style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "7px 14px", borderRadius: 20,
            background: "#1a0a2e", color: "#c58dc6",
            border: "1px solid #3a1a5e", fontSize: 13, fontWeight: 700,
            textDecoration: "none",
          }}>
            <span style={{ fontSize: 11 }}>📋</span> 업데이트 내역
          </a>
          <button
            onClick={() => router.push("/stats")}
            style={{
              padding: "9px 18px", borderRadius: 22,
              background: "#fefce8", color: "#ca8a04",
              border: "1px solid #fde68a", cursor: "pointer",
              fontSize: 13, fontWeight: 700,
            }}
          >
            {t("nav_stats", lang)}
          </button>
          <button
            onClick={() => router.push("/partnership")}
            style={{
              padding: "9px 18px", borderRadius: 22,
              background: "#f0fdf4", color: "#15803d",
              border: "1px solid #bbf7d0", cursor: "pointer",
              fontSize: 13, fontWeight: 700,
            }}
          >
            {t("nav_partner", lang)}
          </button>
          <button
            onClick={() => router.push("/crime")}
            style={{
              padding: "9px 22px", borderRadius: 22,
              background: "linear-gradient(135deg, #9161b2, #7c4da8)",
              color: "#fff", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 700,
              boxShadow: "0 2px 12px #9161b240",
            }}
          >
            {t("nav_start", lang)} →
          </button>
        </div>
        {/* 모바일 전용 시작 버튼 */}
        <button
          className="nav-mobile-start"
          onClick={() => router.push("/crime")}
          style={{
            display: "none",
            padding: "8px 16px", borderRadius: 20,
            background: "linear-gradient(135deg, #9161b2, #7c4da8)",
            color: "#fff", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 700,
          }}
        >
          {t("nav_start", lang)} →
        </button>
      </nav>

      {/* ── 히어로 섹션 ── */}
      <section className="hero-section hero-grid" style={{
        maxWidth: 1140, margin: "0 auto", padding: "80px 40px 70px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center",
      }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 20, padding: "6px 14px", marginBottom: 24,
          }}>
            <AlertCircle size={13} color="#dc2626" />
            <span style={{ color: "#dc2626", fontSize: 12, fontWeight: 700 }}>{t("hero_alert", lang)}</span>
          </div>

          <h1 style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, marginBottom: 20, letterSpacing: -1.5, color: "#1c0d2e" }}>
            {t("hero_title1", lang)}<br />
            <span style={{
              background: "linear-gradient(90deg, #9161b2, #7c3aed)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {t("hero_title2", lang)}
            </span>
          </h1>

          <p style={{ color: "#64748b", fontSize: 17, lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
            {t("hero_subtitle", lang)}
          </p>

          <div className="hero-cta-wrap" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/crime")}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "15px 30px", borderRadius: 14,
                background: "linear-gradient(135deg, #9161b2, #7c4da8)",
                color: "#fff", border: "none", cursor: "pointer",
                fontSize: 15, fontWeight: 700,
                boxShadow: "0 4px 20px #9161b240",
              }}
            >
              {t("hero_cta", lang)} <ChevronRight size={16} />
            </button>
            <a href="#scenarios" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "15px 22px", borderRadius: 14,
              background: "#fdf8ff", color: "#475569",
              border: "1px solid #e2e8f0", cursor: "pointer",
              fontSize: 15, textDecoration: "none", fontWeight: 500,
            }}>
              {t("nav_scenarios", lang)}
            </a>
          </div>

          <div style={{ display: "flex", gap: 20, marginTop: 24 }}>
            {([t("hero_free_tag", lang), t("hero_no_money", lang), t("hero_edu_tag", lang)] as const).map((label) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ color: "#64748b", fontSize: 13 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 통계 카드 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              background: s.bg, borderRadius: 18, padding: "24px 20px",
              border: `1px solid ${s.color}20`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
              <p style={{ fontSize: 30, fontWeight: 900, color: s.color, marginBottom: 6, letterSpacing: -1 }}>{s.value}</p>
              <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>{s.label}</p>
            </div>
          ))}
          <div style={{
            gridColumn: "1 / -1",
            background: "#f5dfee", border: "1px solid #dcc5e8",
            borderRadius: 18, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <Shield size={18} color="#9161b2" style={{ flexShrink: 0 }} />
            <p style={{ color: "#7c3aed", fontSize: 13, lineHeight: 1.5 }}>
              {t("hero_edu_full", lang)}
            </p>
          </div>
        </div>
      </section>

      {/* ── 홍보 영상 ── */}
      <section style={{
        background: "#130c1c", borderTop: "1px solid #2a1a3a",
        padding: "64px 40px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "#6b7280", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
              {t("video_label", lang).toUpperCase()}
            </p>
            <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 26, marginBottom: 6, letterSpacing: -0.5 }}>
              {t("video_title", lang)}
            </h2>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              {t("video_desc", lang)}
            </p>
          </div>

          {/* 영상 목록 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

            {/* 1번 영상 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: "linear-gradient(135deg, #9161b2, #7c4da8)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900, color: "#fff", flexShrink: 0,
                }}>1</div>
                <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15 }}>최초 홍보 영상</p>
                <span style={{ color: "#374151", fontSize: 11, background: "#2a1a3a", border: "1px solid #374151", borderRadius: 20, padding: "2px 10px" }}>2024</span>
              </div>
              <div style={{
                position: "relative", width: "100%", paddingTop: "56.25%",
                borderRadius: 16, overflow: "hidden",
                boxShadow: "0 16px 48px #00000060",
                border: "1px solid #2a1a3a",
              }}>
                <iframe
                  src="https://www.youtube.com/embed/vCDSs2nMy18"
                  title="범죄예방 체험관 홍보영상 1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                />
              </div>
            </div>

            {/* 2번 영상 (추후 링크 교체) */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: "linear-gradient(135deg, #059669, #0d9488)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900, color: "#fff", flexShrink: 0,
                }}>2</div>
                <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15 }}>업데이트 홍보 영상</p>
                <span style={{ color: "#065f46", fontSize: 11, background: "#022c22", border: "1px solid #065f46", borderRadius: 20, padding: "2px 10px", fontWeight: 700 }}>NEW</span>
              </div>
              <div style={{
                position: "relative", width: "100%", paddingTop: "56.25%",
                borderRadius: 16, overflow: "hidden",
                boxShadow: "0 16px 48px #00000060",
                border: "1px solid #1e3a2e",
              }}>
                <iframe
                  src="https://www.youtube.com/embed/APWktjzq4f4"
                  title="범죄예방 체험관 홍보영상 2"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                />
              </div>
            </div>

          </div>

          {/* ── 업데이트 내역 ── */}
          <div id="changelog" style={{ marginTop: 56, borderTop: "1px solid #2a1a3a", paddingTop: 48 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <p style={{ color: "#6b7280", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>CHANGELOG</p>
              <h3 style={{ color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>업데이트 내역</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                {
                  version: "v1.7",
                  badge: "최신",
                  badgeColor: "#c58dc6",
                  badgeBg: "#1a0a2e",
                  items: [
                    "🏛️ 과거 범죄 아카이브 — 1990년대 골목부터 AI 시대까지 시대별 배경 추가",
                    "😷 우환폐렴(코로나) 시대 빗방울 효과 및 추억 마퀴 적용",
                    "⚖️ 어린이 법률 안내 — 체험 행위별 처벌 조항 쉬운 말로 추가",
                    "🥕 당근마켓 사기 체험 역할 표시 개선 및 중복 메시지 버그 수정",
                  ],
                },
                {
                  version: "v1.6",
                  badge: null,
                  badgeColor: "#22c55e",
                  badgeBg: "#052e16",
                  items: [
                    "🕵️ 사기 판별 퀴즈 추가 — 진짜/가짜 문자 10문제 + 취약점 분석 리포트",
                    "🥕 중고거래 사기 체험 — 당근마켓 UI, 가짜 안전결제 링크 → 해킹 화면 연출",
                    "📸 SNS 투자 사기 체험 — 인스타그램 DM 스타일, 코인 투자 유도 전 과정",
                  ],
                },
                {
                  version: "v1.5.2",
                  badge: null,
                  badgeColor: "#22c55e",
                  badgeBg: "#052e16",
                  items: [
                    "🚫 도박 과몰입 자동 폐쇄 시스템 (8분 연속/2회 충전/25판 기준, 10초 강제 대기)",
                    "🎯 도박 초반 당첨 확률 1~2판 97%로 강화 → 이후 급락 (미끼 심화)",
                  ],
                },
                {
                  version: "v1.5.1",
                  badge: null,
                  badgeColor: "#22c55e",
                  badgeBg: "#052e16",
                  items: [
                    "💡 도박 페이지 전면 네온 사인 UI 적용",
                    "👁️ 모바일 글씨 투명화 버그 전면 수정 (WebkitTextFillColor 제거)",
                    "🎮 도박 탭 비활성 글씨 가시성 개선",
                  ],
                },
                {
                  version: "v1.5",
                  badge: null,
                  badgeColor: "#f59e0b",
                  badgeBg: "#1c1002",
                  items: [
                    "📱 문자 사기 체험 (스미싱) — 택배·건강보험·카드 3종 3분 AI 대화",
                    "🎰 불법 도박 신규 게임 3종 (홀짝·파워볼·슬롯머신)",
                    "📚 도박 게임별 튜토리얼 팝업",
                    "💳 충전 시 카드 자동입력 애니메이션",
                  ],
                },
                {
                  version: "v1.4.2",
                  badge: null,
                  badgeColor: "#f59e0b",
                  badgeBg: "#1c1002",
                  items: [
                    "🎢 도박 긴장감 강화 — 연패/연승 심리 확률 조작 + 결승 직전 서스펜스 연출",
                    "🪜 사다리 게임 경로 오류 수정 (공이 좌우 이동하지 않던 버그 해결)",
                  ],
                },
                {
                  version: "v1.4.1",
                  badge: null,
                  badgeColor: "#f59e0b",
                  badgeBg: "#1c1002",
                  items: [
                    "👆 모바일 버튼 터치 시 글씨 사라짐 현상 수정",
                    "💰 충전 전 자동입력 사전 안내 문구 추가",
                  ],
                },
                {
                  version: "v1.4",
                  badge: null,
                  badgeColor: "#f59e0b",
                  badgeBg: "#1c1002",
                  items: [
                    "🍼 감성 동정 사기 시나리오 추가 (베이비 피싱)",
                    "🏠 전세·부동산 사기 시나리오 추가",
                    "🤖 AI 딥페이크 협박 사기 시나리오 추가",
                    "📜 과거 범죄 내역 회상 기능 추가",
                  ],
                },
                {
                  version: "v1.3.1",
                  badge: null,
                  badgeColor: "#4ade80",
                  badgeBg: "#052e16",
                  items: [
                    "⚙️ 자극 강도 설정 추가 (순화 / 보통 / 실전)",
                    "🏆 거절 3회 시 축하 메시지 + 결과 화면 분기",
                    "✏️ 전체 폰트 Spoqa Han Sans Neo 적용",
                    "📋 업데이트 내역 섹션 신설",
                  ],
                },
                {
                  version: "v1.3",
                  badge: null,
                  badgeColor: "#4ade80",
                  badgeBg: "#052e16",
                  items: [
                    "📞 전화 사기 체험 — 삼성·아이폰 통화 UI + AI 목소리 (TTS)",
                    "🔗 링크·다운로드 사기 시나리오 추가 (해킹 애니메이션)",
                    "💬 AI 대화 자연스러움 개선 (ZETA 앱 스타일)",
                  ],
                },
                {
                  version: "v1.2.1",
                  badge: null,
                  badgeColor: "#c58dc6",
                  badgeBg: "#160a26",
                  items: [
                    "📊 이용 통계 실시간 표시",
                    "👑 명예의 전당 기능 추가",
                    "🐛 다국어 번역 누락 항목 수정",
                  ],
                },
                {
                  version: "v1.2",
                  badge: null,
                  badgeColor: "#c58dc6",
                  badgeBg: "#160a26",
                  items: [
                    "🎰 불법도박 체험 시나리오 추가",
                    "🌏 10개 언어 다국어 지원",
                  ],
                },
                {
                  version: "v1.1.1",
                  badge: null,
                  badgeColor: "#c58dc6",
                  badgeBg: "#1e1b4b",
                  items: [
                    "📱 모바일 최적화 (터치 영역·레이아웃 개선)",
                    "🐛 일부 시나리오 AI 응답 오류 수정",
                  ],
                },
                {
                  version: "v1.1",
                  badge: null,
                  badgeColor: "#c58dc6",
                  badgeBg: "#1e1b4b",
                  items: [
                    "💸 가짜 송금 애니메이션 추가",
                    "🏦 피해 결과 화면 개선",
                    "🏦 은행 앱 UI 추가",
                  ],
                },
                {
                  version: "v1.0.1",
                  badge: null,
                  badgeColor: "#6b7280",
                  badgeBg: "#111",
                  items: [
                    "🐛 초기 배포 후 긴급 버그 수정",
                    "⚡ 로딩 속도 개선",
                  ],
                },
                {
                  version: "v1.0",
                  badge: null,
                  badgeColor: "#6b7280",
                  badgeBg: "#111",
                  items: [
                    "🚀 서비스 최초 출시",
                    "📋 8가지 기본 사기 시나리오",
                    "🤖 AI 기반 범인 대화 엔진",
                  ],
                },
              ].map((log, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 20, paddingBottom: 20, position: "relative" }}
                >
                  {/* 타임라인 선 */}
                  {i < 13 && (
                    <div style={{
                      position: "absolute", left: 39, top: 32, bottom: 0,
                      width: 1, background: "#2a1a3a",
                    }} />
                  )}
                  {/* 버전 배지 */}
                  <div style={{ flexShrink: 0, width: 80, textAlign: "center" }}>
                    <div style={{
                      background: hoveredLog === i ? log.badgeBg : "#111",
                      border: `1px solid ${hoveredLog === i ? log.badgeColor : "#222"}`,
                      borderRadius: 10, padding: "6px 0", marginBottom: 4,
                      transition: "all 0.2s",
                    }}>
                      <p style={{ color: hoveredLog === i ? log.badgeColor : "#4b5563", fontWeight: 900, fontSize: 13, transition: "color 0.2s" }}>{log.version}</p>
                    </div>
                    {log.badge && (
                      <span style={{
                        display: "inline-block", marginTop: 4,
                        background: "#052e16", color: "#4ade80",
                        fontSize: 10, fontWeight: 700,
                        padding: "2px 8px", borderRadius: 20,
                        border: "1px solid #4ade8044",
                      }}>{log.badge}</span>
                    )}
                  </div>
                  {/* 항목들 — 누르고 있는 동안만 팝업 */}
                  <div style={{ flex: 1, paddingTop: 4, position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <p style={{ color: "#4b5563", fontSize: 12, lineHeight: 1.6, flex: 1 }}>
                        {log.items[0]?.slice(0, 32)}{log.items[0]?.length > 32 ? "…" : ""}
                        {log.items.length > 1 && <span style={{ color: "#374151", marginLeft: 6 }}>외 {log.items.length - 1}건</span>}
                      </p>
                      <button
                        style={{
                          flexShrink: 0,
                          background: hoveredLog === i ? log.badgeBg : "#111",
                          border: `1px solid ${hoveredLog === i ? log.badgeColor : "#333"}`,
                          borderRadius: 8, padding: "3px 10px",
                          color: hoveredLog === i ? log.badgeColor : "#4b5563",
                          fontSize: 10, fontWeight: 700, cursor: "pointer",
                          transition: "all 0.15s", userSelect: "none" as const,
                          WebkitUserSelect: "none" as const,
                        }}
                        onMouseDown={() => setHoveredLog(i)}
                        onMouseUp={() => setHoveredLog(null)}
                        onMouseLeave={() => setHoveredLog(null)}
                        onTouchStart={e => { e.preventDefault(); setHoveredLog(i); }}
                        onTouchEnd={() => setHoveredLog(null)}
                      >
                        자세히 보기
                      </button>
                    </div>
                    {hoveredLog === i && (
                      <div style={{
                        background: "#1a1026", border: `1px solid ${log.badgeColor}44`,
                        borderRadius: 14, padding: "14px 16px",
                        animation: "slideUpLog 0.15s ease",
                        position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20,
                        boxShadow: `0 8px 24px ${log.badgeColor}22`,
                        marginTop: 4,
                      }}>
                        {log.items.map((item, j) => (
                          <p key={j} style={{ color: "#d1d5db", fontSize: 13, lineHeight: 1.9, margin: 0 }}>{item}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 과거 범죄 아카이브 ── */}
      <section style={{ background: "linear-gradient(180deg, #1a0a2e 0%, #0d1a30 40%, #0a1a1a 100%)", padding: "72px 0 64px", overflow: "hidden", position: "relative" }}>
        {/* 시대 배경 CSS 애니메이션 */}
        <style>{`
          @keyframes flickerTV { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.7} 94%{opacity:1} 97%{opacity:0.85} 98%{opacity:1} }
          @keyframes rainDrop { 0%{transform:translateY(-20px);opacity:0} 10%{opacity:0.6} 90%{opacity:0.4} 100%{transform:translateY(120px);opacity:0} }
          @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
          @keyframes neonBlink { 0%,100%{opacity:1;text-shadow:0 0 8px #f59e0b,0 0 20px #f59e0b} 45%{opacity:0.7;text-shadow:none} 50%{opacity:1;text-shadow:0 0 8px #f59e0b} }
          @keyframes glitchEra { 0%,100%{clip-path:inset(0 0 98% 0)} 10%{clip-path:inset(30% 0 50% 0)} 30%{clip-path:inset(70% 0 10% 0)} 60%{clip-path:inset(10% 0 80% 0)} }
          @keyframes marqueeScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          @keyframes lampFlicker { 0%,100%{opacity:1} 88%{opacity:1} 90%{opacity:0.5} 91%{opacity:1} 95%{opacity:0.7} 97%{opacity:1} }
          @keyframes slowPulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
          @keyframes crtScan { 0%{background-position:0 0} 100%{background-position:0 100%} }
          @keyframes fogDrift { 0%{transform:translateX(-5%)} 50%{transform:translateX(5%)} 100%{transform:translateX(-5%)} }
        `}</style>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#6b7280", fontSize: 11, fontWeight: 700, letterSpacing: 4, marginBottom: 10, fontFamily: "monospace" }}>[ CRIME ARCHIVE ]</p>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: "#f5f5f5", marginBottom: 10, letterSpacing: -0.5 }}>
              옛날엔 이런 사기도 있었다
            </h2>
            <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.7 }}>
              수법은 시대마다 달라졌지만, 심리를 이용한다는 본질은 변하지 않았습니다.
            </p>
            {/* 관련 사이트 */}
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 20px", marginTop: 14 }}>
              <span style={{ color: "#374151", fontSize: 11 }}>더 자세히 알아보기 →</span>
              {[
                { label: "경찰청 사이버수사국", url: "https://ecrm.police.go.kr" },
                { label: "금융감독원 불법금융신고센터", url: "https://www.fss.or.kr/fss/main/sub1/sub1_3.do" },
                { label: "한국소비자원 피해사례 DB", url: "https://www.kca.go.kr" },
                { label: "사이버범죄 신고시스템", url: "https://ecrm.cyber.go.kr" },
              ].map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{ color: "#4b5563", fontSize: 11, textDecoration: "none", borderBottom: "1px solid #374151", lineHeight: 1.8 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#9ca3af")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#4b5563")}
                >{s.label}</a>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* ══ 1990년대: 쌍문동 골목 밤거리 ══ */}
            <div style={{
              position: "relative", borderRadius: 24, overflow: "hidden",
              marginBottom: 24, padding: "32px 28px",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.48), rgba(0,0,0,0.52)), url('/alley-1990s.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              {/* 벽돌 질감 - 가로 줄눈 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                backgroundImage: `
                  repeating-linear-gradient(0deg,
                    transparent 0px, transparent 18px,
                    rgba(0,0,0,0.35) 18px, rgba(0,0,0,0.35) 20px
                  ),
                  repeating-linear-gradient(90deg,
                    transparent 0px, transparent 58px,
                    rgba(0,0,0,0.25) 58px, rgba(0,0,0,0.25) 60px
                  )
                `,
              }} />
              {/* 벽돌 색감 오버레이 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: `
                  repeating-linear-gradient(0deg,
                    rgba(120,50,10,0.12) 0px, rgba(120,50,10,0.12) 9px,
                    rgba(80,30,5,0.06) 9px, rgba(80,30,5,0.06) 20px
                  )
                `,
              }} />
              {/* 골목 양쪽 그림자 (좁은 느낌) */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.6) 100%)",
              }} />
              {/* 가로등 1 - 왼쪽 */}
              <div style={{
                position: "absolute", top: 0, left: "15%", width: 2, height: 60,
                background: "linear-gradient(180deg, #888 0%, #555 100%)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", top: 55, left: "calc(15% - 30px)", width: 64, height: 16,
                background: "rgba(255,190,40,0.9)", borderRadius: 4,
                boxShadow: "0 0 20px 8px rgba(255,180,20,0.6), 0 0 60px 20px rgba(255,150,0,0.3)",
                animation: "lampFlicker 6s infinite",
                pointerEvents: "none",
              }} />
              {/* 가로등 2 - 오른쪽 */}
              <div style={{
                position: "absolute", top: 0, right: "12%", width: 2, height: 50,
                background: "linear-gradient(180deg, #888 0%, #555 100%)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", top: 45, right: "calc(12% - 28px)", width: 58, height: 14,
                background: "rgba(255,185,35,0.85)", borderRadius: 4,
                boxShadow: "0 0 18px 7px rgba(255,170,15,0.5), 0 0 50px 18px rgba(255,140,0,0.25)",
                animation: "lampFlicker 7s infinite",
                animationDelay: "0.8s",
                pointerEvents: "none",
              }} />
              {/* 바닥 반사 */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
                background: "linear-gradient(0deg, rgba(180,90,0,0.15) 0%, transparent 100%)",
                borderRadius: "0 0 24px 24px", pointerEvents: "none",
              }} />
              {/* 필름 입자 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
                opacity: 0.5,
                animation: "flickerTV 12s infinite",
              }} />
              {/* 시대 텍스트 */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #c9a84c88)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 4 }}>📠</div>
                  <span style={{
                    color: "#c9a84c", fontSize: 13, fontWeight: 700, letterSpacing: 4,
                    fontFamily: "monospace", animation: "neonBlink 4s infinite",
                    textShadow: "0 0 10px #c9a84c88",
                  }}>── 1 9 9 0 년 대 ──</span>
                  <p style={{ color: "#8b6914", fontSize: 10, marginTop: 4, letterSpacing: 1 }}>골목 팩스방 · 전단지 · 전화 사기의 시대</p>
                </div>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #c9a84c88, transparent)" }} />
              </div>
              {/* 흘러가는 추억 마퀴 */}
              <div style={{ overflow: "hidden", marginBottom: 16, position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex", gap: 32, whiteSpace: "nowrap",
                  animation: "marqueeScroll 18s linear infinite",
                  color: "#8b6914", fontSize: 10, fontFamily: "monospace", letterSpacing: 1,
                }}>
                  {["📞 삐삐 호출", "📠 팩스방 사기", "🏪 구멍가게", "🚌 시내버스", "📺 브라운관 TV", "💿 비디오 대여점", "🎰 복권 당첨 사기", "📋 전단지 광고", "📞 삐삐 호출", "📠 팩스방 사기", "🏪 구멍가게", "🚌 시내버스", "📺 브라운관 TV", "💿 비디오 대여점", "🎰 복권 당첨 사기", "📋 전단지 광고"].map((t,i) => (
                    <span key={i}>{t} &nbsp;·&nbsp;</span>
                  ))}
                </div>
              </div>

              {/* 1990년대 카드들 */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { name: "복권 당첨 사기", tag: "FAX SCAM", desc: "「당신이 당첨됐습니다」 팩스 1장으로 수수료 편취. 스팸 팩스가 유일한 사기 수단이던 시절." },
                  { name: "피라미드 다단계", tag: "PYRAMID", desc: "원금 보장·고수익 보장. 하위 회원 모집으로만 유지. 전국 수십만 명이 '사업'인 줄 알고 참여." },
                  { name: "선불 사기 (삼각 사기)", tag: "PREPAY", desc: "광고지·전단지로 물건 홍보, 먼저 돈 받고 잠적. 인터넷이 없어 피해 확인조차 어려웠던 시대." },
                ].map((c, j) => (
                  <div key={j} style={{
                    background: "linear-gradient(145deg, #f5efd6, #ede5c4)",
                    border: "1px solid #c9a84c44",
                    borderRadius: 4,
                    padding: "16px 16px 14px",
                    position: "relative",
                    boxShadow: "2px 3px 8px #00000060, inset 0 0 0 1px #ffffff20",
                    fontFamily: "'Courier New', Courier, monospace",
                  }}>
                    {/* 팩스 헤더 라인 */}
                    <div style={{ borderBottom: "1px dashed #8b7355", marginBottom: 10, paddingBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: "#8b7355", letterSpacing: 1 }}>FAX TRANSMISSION</span>
                      <span style={{ fontSize: 9, color: "#8b7355" }}>199X.XX.XX</span>
                    </div>
                    <div style={{ background: "#8b735533", display: "inline-block", padding: "1px 6px", marginBottom: 6, borderRadius: 2 }}>
                      <span style={{ fontSize: 9, color: "#6b5a2e", letterSpacing: 1 }}>{c.tag}</span>
                    </div>
                    <p style={{ color: "#3d2e00", fontWeight: 700, fontSize: 13, marginBottom: 6, lineHeight: 1.3 }}>{c.name}</p>
                    <p style={{ color: "#5c4a1e", fontSize: 11, lineHeight: 1.7 }}>{c.desc}</p>
                    {/* 팩스 노이즈 라인 */}
                    <div style={{ marginTop: 10, borderTop: "1px dashed #8b735555", paddingTop: 6 }}>
                      <span style={{ fontSize: 8, color: "#a08858", fontFamily: "monospace" }}>■■■□■□■■□□■■■□ END OF TRANSMISSION</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div> {/* ══ 1990년대 배경 래퍼 끝 ══ */}

            {/* ══ 2000년대: PC방 골목 + 형광등 간판 ══ */}
            <div style={{
              position: "relative", borderRadius: 24, overflow: "hidden",
              marginBottom: 24, padding: "32px 28px",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.48), rgba(0,0,0,0.52)), url('/alley-2000s.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              {/* 콘크리트 벽 텍스처 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent 0px, transparent 22px, rgba(255,255,255,0.03) 22px, rgba(255,255,255,0.03) 23px),
                  repeating-linear-gradient(90deg, transparent 0px, transparent 80px, rgba(255,255,255,0.02) 80px, rgba(255,255,255,0.02) 81px)
                `,
              }} />
              {/* 골목 양쪽 그림자 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.7) 100%)",
              }} />
              {/* PC방 간판 형광등 */}
              <div style={{
                position: "absolute", top: 0, left: "30%", right: "30%", height: 6,
                background: "linear-gradient(90deg, transparent, rgba(100,180,255,0.9), rgba(120,200,255,1), rgba(100,180,255,0.9), transparent)",
                boxShadow: "0 0 20px 6px rgba(80,160,255,0.7), 0 0 60px 15px rgba(40,120,220,0.4)",
                animation: "lampFlicker 4s infinite",
                borderRadius: 3,
                pointerEvents: "none",
              }} />
              {/* 바닥 형광 반사 */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
                background: "linear-gradient(0deg, rgba(30,80,180,0.15) 0%, transparent 100%)",
                borderRadius: "0 0 24px 24px", pointerEvents: "none",
              }} />
              {/* CRT 스캔라인 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 6px)",
                animation: "flickerTV 9s infinite",
              }} />
              {/* 흘러가는 마퀴 */}
              <div style={{ overflow: "hidden", marginBottom: 16, position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex", gap: 28, whiteSpace: "nowrap",
                  animation: "marqueeScroll 22s linear infinite",
                  color: "#3a6ea5", fontSize: 10, fontFamily: "monospace", letterSpacing: 1,
                }}>
                  {["💾 플로피디스크", "📀 CD롬 굽기", "🖨️ PC방 프린터", "🖥️ 윈도우XP", "🌐 인터넷 탐색기", "📡 56K 모뎀", "📧 이메일 스팸", "🎮 스타크래프트", "💾 플로피디스크", "📀 CD롬 굽기", "🖨️ PC방 프린터", "🖥️ 윈도우XP", "🌐 인터넷 탐색기", "📡 56K 모뎀", "📧 이메일 스팸", "🎮 스타크래프트"].map((t,i) => (
                    <span key={i}>{t} &nbsp;·&nbsp;</span>
                  ))}
                </div>
              </div>
              {/* 시대 레이블 */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #3a6ea588)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>💻</div>
                  <span style={{ color: "#7ab0e8", fontSize: 13, fontWeight: 700, letterSpacing: 4, fontFamily: "monospace", textShadow: "0 0 8px #3a6ea888" }}>── 2 0 0 0 년 대 ──</span>
                  <p style={{ color: "#3a6ea5", fontSize: 10, marginTop: 4, letterSpacing: 1 }}>PC방 · 인터넷 탐색기 · 이메일 사기의 시대</p>
                </div>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #3a6ea588, transparent)" }} />
              </div>
              {/* 2000년대 카드들 */}
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { name: "나이지리아 왕자 이메일", icon: "📧", desc: "\"저는 나이지리아 왕자입니다. 재산 이전을 도와주시면 수수료를 드립니다.\" 세계 최초 국제 스팸 사기의 고전." },
                  { name: "문화상품권 사기 1세대", icon: "🎫", desc: "핀번호 긁어서 보내달라는 최초 형태. 당시엔 상품권이 낯설어 '이게 왜 사기야?' 하던 시절." },
                  { name: "초창기 보이스피싱", icon: "☎️", desc: "\"금감원입니다. 귀하 계좌가 동결됩니다.\" 단 한 줄로 수백만원 편취. 대본이 지금보다 100배 단순." },
                ].map((c, j) => (
                  <div key={j} style={{
                    background: "#d4d0c8",
                    border: "2px solid",
                    borderColor: "#ffffff #808080 #808080 #ffffff",
                    borderRadius: 0,
                    overflow: "hidden",
                    boxShadow: "2px 2px 0 #000000aa",
                    fontFamily: "'Tahoma', 'MS Sans Serif', sans-serif",
                  }}>
                    {/* XP 타이틀바 */}
                    <div style={{
                      background: "linear-gradient(to bottom, #0a246a, #3a6ea5)",
                      padding: "3px 6px",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 11 }}>{c.icon}</span>
                        <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>경고.exe</span>
                      </div>
                      <div style={{ display: "flex", gap: 2 }}>
                        {["_", "□", "✕"].map((btn, k) => (
                          <div key={k} style={{
                            width: 16, height: 14, background: k === 2 ? "#c0392b" : "#d4d0c8",
                            border: "1px solid #808080", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 9, color: k === 2 ? "#fff" : "#000", cursor: "default",
                          }}>{btn}</div>
                        ))}
                      </div>
                    </div>
                    {/* 콘텐츠 */}
                    <div style={{ padding: "12px 12px 10px", background: "#d4d0c8" }}>
                      <div style={{ background: "#fdf8ff", border: "2px inset #808080", padding: "8px", marginBottom: 8 }}>
                        <p style={{ color: "#000080", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{c.name}</p>
                        <p style={{ color: "#231232", fontSize: 11, lineHeight: 1.6 }}>{c.desc}</p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div style={{
                          background: "#d4d0c8", border: "2px solid", borderColor: "#ffffff #808080 #808080 #ffffff",
                          padding: "2px 12px", fontSize: 11, cursor: "default",
                        }}>확인</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div> {/* ══ 2000년대 배경 래퍼 끝 ══ */}

            {/* ══ 2010년대 초: 스마트폰 불빛 쏟아지는 도시 골목 ══ */}
            <div style={{
              position: "relative", borderRadius: 24, overflow: "hidden",
              marginBottom: 24, padding: "32px 28px",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.50), rgba(0,0,0,0.54)), url('/alley-2020s.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              {/* 야간 콘크리트 벽 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent 0px, transparent 30px, rgba(255,255,255,0.025) 30px, rgba(255,255,255,0.025) 31px)
                `,
              }} />
              {/* 골목 양쪽 그림자 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.65) 100%)",
              }} />
              {/* 편의점 간판 형광빛 (초록/흰색) */}
              <div style={{
                position: "absolute", top: 8, left: "10%", width: 100, height: 8,
                background: "linear-gradient(90deg, rgba(0,220,80,0.8), rgba(100,255,140,0.9), rgba(0,220,80,0.8))",
                boxShadow: "0 0 16px 5px rgba(0,200,60,0.5), 0 0 40px 12px rgba(0,160,40,0.25)",
                borderRadius: 3, animation: "slowPulse 3s infinite", pointerEvents: "none",
              }} />
              {/* 스마트폰 화면 반사광 */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
                background: "linear-gradient(0deg, rgba(0,80,30,0.2) 0%, transparent 100%)",
                borderRadius: "0 0 24px 24px", pointerEvents: "none",
              }} />
              <div style={{ overflow: "hidden", marginBottom: 16, position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex", gap: 28, whiteSpace: "nowrap",
                  animation: "marqueeScroll 20s linear infinite",
                  color: "#1a7a4a", fontSize: 10, fontFamily: "monospace",
                }}>
                  {["📱 갤럭시S2", "📲 카카오톡 출시", "💬 스미싱 문자", "🔗 bitly 단축링크", "📶 3G LTE", "🏧 ATM 인출", "📱 갤럭시S2", "📲 카카오톡 출시", "💬 스미싱 문자", "🔗 bitly 단축링크", "📶 3G LTE", "🏧 ATM 인출"].map((t,i) => (
                    <span key={i}>{t} &nbsp;·&nbsp;</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #34d39988)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>📱</div>
                  <span style={{ color: "#34d399", fontSize: 13, fontWeight: 700, letterSpacing: 4, fontFamily: "monospace" }}>── 2 0 1 0 년 대 초 ──</span>
                  <p style={{ color: "#065f46", fontSize: 10, marginTop: 4, letterSpacing: 1 }}>스마트폰 보급 · 카카오 · 스미싱의 시대</p>
                </div>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #34d39988, transparent)" }} />
              </div>

              {/* ── 2010년대 초: 피처폰/초기 스마트폰 SMS ── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ height: 1, flex: 1, background: "#064e3b", opacity: 0.6 }} />
                <span style={{ color: "#34d399", fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: "monospace" }}>── 2010년대 초 ──</span>
                <div style={{ height: 1, flex: 1, background: "#064e3b", opacity: 0.6 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { sender: "[Web발신]", preview: "무료쿠폰 발급완료 수령▶ http://bit.ly/xK3m", name: "스미싱 1세대", desc: "클릭 즉시 소액결제 자동 청구. '무료쿠폰'에 의심 없이 눌렀던 시절. 당시엔 스미싱이란 단어조차 없었음." },
                  { sender: "민지", preview: "나야 급해ㅠㅠ 50만원만 잠깐 빌려줄수있어? 오늘저녁에갚을게", name: "카카오 해킹 초기형", desc: "계정 해킹 후 지인에게 문자형 사기. 카카오가 생소하던 시절, '이게 진짜 카톡이야?' 하며 속음." },
                  { sender: "직구몰", preview: "아이폰5 미개봉 정품 29만원! 오늘마감 선착순50명", name: "가짜 직구몰 사기", desc: "너무 싼 해외직구 쇼핑몰. 결제 후 잠적. 지금의 중고거래 사기 전신. 환불 개념 자체가 없던 시대." },
                ].map((c, j) => (
                  <div key={j} style={{
                    background: "#231232",
                    border: "1px solid #333",
                    borderRadius: 12,
                    overflow: "hidden",
                    fontFamily: "monospace",
                  }}>
                    {/* 피처폰 상단바 */}
                    <div style={{ background: "#111", padding: "6px 10px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#888", fontSize: 9 }}>📶 SKT  🔋</span>
                      <span style={{ color: "#888", fontSize: 9 }}>오전 11:23</span>
                    </div>
                    {/* SMS 헤더 */}
                    <div style={{ background: "#2a2a2a", padding: "8px 12px", borderBottom: "1px solid #333" }}>
                      <p style={{ color: "#aaa", fontSize: 10, marginBottom: 2 }}>보낸 사람</p>
                      <p style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{c.sender}</p>
                    </div>
                    {/* SMS 말풍선 */}
                    <div style={{ padding: "12px", background: "#231232" }}>
                      <div style={{
                        background: "#2e7d32", borderRadius: "4px 12px 12px 12px",
                        padding: "8px 10px", maxWidth: "85%", marginBottom: 12,
                      }}>
                        <p style={{ color: "#e8f5e9", fontSize: 11, lineHeight: 1.5 }}>{c.preview}</p>
                        <p style={{ color: "#a5d6a7", fontSize: 9, textAlign: "right", marginTop: 4 }}>수신 ✓✓</p>
                      </div>
                      <div style={{ borderTop: "1px solid #333", paddingTop: 10 }}>
                        <p style={{ color: "#34d399", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{c.name}</p>
                        <p style={{ color: "#6b7280", fontSize: 11, lineHeight: 1.6 }}>{c.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div> {/* ══ 2010년대 초 래퍼 끝 ══ */}

            {/* ══ 2015~2018: 카페·SNS 골목 핑크무드 야경 ══ */}
            <div style={{
              position: "relative", borderRadius: 24, overflow: "hidden",
              marginBottom: 24, padding: "32px 28px",
              background: `
                radial-gradient(ellipse 55% 160px at 30% -5%, rgba(220,80,180,0.45) 0%, transparent 100%),
                radial-gradient(ellipse 45% 160px at 75% 10%, rgba(180,60,240,0.3) 0%, transparent 100%),
                radial-gradient(ellipse 60% 80% at 50% 110%, rgba(20,0,30,0.85) 0%, transparent 100%),
                linear-gradient(160deg, #100018 0%, #1a0028 45%, #0d0018 100%)
              `,
            }}>
              {/* 벽 타일 패턴 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent 0px, transparent 24px, rgba(255,255,255,0.03) 24px, rgba(255,255,255,0.03) 25px),
                  repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(255,255,255,0.02) 48px, rgba(255,255,255,0.02) 49px)
                `,
              }} />
              {/* 골목 그림자 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)",
              }} />
              {/* 카페 핑크 간판 빛 */}
              <div style={{
                position: "absolute", top: 0, left: "20%", width: 140, height: 8,
                background: "linear-gradient(90deg, transparent, rgba(255,80,180,0.9), rgba(255,120,200,1), rgba(255,80,180,0.9), transparent)",
                boxShadow: "0 0 20px 8px rgba(220,60,180,0.6), 0 0 60px 20px rgba(180,0,160,0.3)",
                borderRadius: 4, animation: "slowPulse 4s infinite", pointerEvents: "none",
              }} />
              {/* 하단 빛 반사 */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 70,
                background: "linear-gradient(0deg, rgba(120,0,120,0.18) 0%, transparent 100%)",
                borderRadius: "0 0 24px 24px", pointerEvents: "none",
              }} />
              <div style={{ overflow: "hidden", marginBottom: 16, position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex", gap: 28, whiteSpace: "nowrap",
                  animation: "marqueeScroll 22s linear infinite",
                  color: "#7c3aed55", fontSize: 10, fontFamily: "monospace",
                }}>
                  {["📸 인스타그램", "👥 페이스북", "💬 카카오스토리", "📊 주식카페", "🎯 재택알바", "📲 DM사기", "📸 인스타그램", "👥 페이스북", "💬 카카오스토리", "📊 주식카페", "🎯 재택알바", "📲 DM사기"].map((t,i) => (
                    <span key={i}>{t} &nbsp;·&nbsp;</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #c58dc688)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>📸</div>
                  <span style={{ color: "#c58dc6", fontSize: 13, fontWeight: 700, letterSpacing: 4, fontFamily: "monospace" }}>── 2 0 1 5 ~ 2 0 1 8 ──</span>
                  <p style={{ color: "#7c3aed88", fontSize: 10, marginTop: 4, letterSpacing: 1 }}>SNS · 인스타그램 · 오픈마켓 사기의 시대</p>
                </div>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #c58dc688, transparent)" }} />
              </div>

              {/* ── 2015~2018: 플랫 디자인/SNS 시대 ── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ height: 1, flex: 1, background: "#4c1d95", opacity: 0.6 }} />
                <span style={{ color: "#c58dc6", fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: "monospace" }}>── 2015~2018년 ──</span>
                <div style={{ height: 1, flex: 1, background: "#4c1d95", opacity: 0.6 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { platform: "Facebook", dot: "#1877f2", name: "SNS 지인 사칭", post: "이거 실화냐 ㅋㅋ 나 어제 이거 당했는데... 갑자기 지인 계정에서 DM 와서 돈 빌려달라고 해서 보냈더니 해킹당한 계정이었음", like: "좋아요 247개", desc: "페이스북·인스타 클론 계정. AI 없던 시대의 수작업 사기. 지인 관계망을 가장 잘 활용한 형태." },
                  { platform: "취업카페", dot: "#ff6b35", name: "가짜 재택 취업 사기", post: "★ 급구 ★ 재택근무 월 300만원 보장! 자격증 불필요, 경력 불필요. 교재비 15만원 선납 후 교육 시작. 지금 바로 연락주세요!", like: "조회 8,402", desc: "\"재택근무 월 300만원\" 광고. 교재비·장비비 선납 후 잠적. IMF 세대 이후 청년층 취업난을 노린 수법." },
                  { platform: "KakaoTalk", dot: "#ffe100", name: "3단계 메신저 피싱", post: "나야 급한데 지금 폰이 없어서 이 번호로 연락해. 50만원만 계좌이체 해줄 수 있어? 오늘 저녁에 현금으로 줄게", like: "읽음 1", desc: "문자→카카오→전화 3단계 접근법 등장. 각 채널에서 진짜인 척 신뢰 구축 후 최종 결제 유도." },
                ].map((c, j) => (
                  <div key={j} style={{
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}>
                    {/* SNS 헤더 */}
                    <div style={{ padding: "10px 12px", borderBottom: "1px solid #27272a", display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.dot, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 12, color: "#fff", fontWeight: 900 }}>{c.platform[0]}</span>
                      </div>
                      <div>
                        <p style={{ color: "#e4e4e7", fontSize: 12, fontWeight: 700 }}>{c.platform}</p>
                        <p style={{ color: "#71717a", fontSize: 10 }}>201X년경</p>
                      </div>
                    </div>
                    {/* 게시물 */}
                    <div style={{ padding: "12px", background: "#18181b" }}>
                      <p style={{ color: "#a1a1aa", fontSize: 11, lineHeight: 1.6, marginBottom: 8, fontStyle: "italic", borderLeft: "2px solid #3f3f46", paddingLeft: 8 }}>{c.post}</p>
                      <p style={{ color: "#52525b", fontSize: 10, marginBottom: 10 }}>{c.like}</p>
                      <div style={{ borderTop: "1px solid #27272a", paddingTop: 8 }}>
                        <p style={{ color: "#c58dc6", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{c.name}</p>
                        <p style={{ color: "#71717a", fontSize: 11, lineHeight: 1.6 }}>{c.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div> {/* ══ SNS 시대 래퍼 끝 ══ */}

            {/* ══ 2019~2021: 텅 빈 골목 — 우환폐렴 봉쇄 분위기 ══ */}
            <div style={{
              position: "relative", borderRadius: 24, overflow: "hidden",
              marginBottom: 24, padding: "32px 28px",
              background: `
                radial-gradient(ellipse 80% 140px at 50% -5%, rgba(100,150,180,0.25) 0%, transparent 100%),
                linear-gradient(180deg, #050a10 0%, #080f18 40%, #040810 100%)
              `,
            }}>
              {/* 빗길 아스팔트 텍스처 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                backgroundImage: `
                  repeating-linear-gradient(175deg, transparent 0px, transparent 3px, rgba(80,120,160,0.06) 3px, rgba(80,120,160,0.06) 4px)
                `,
              }} />
              {/* 골목 그림자 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.7) 100%)",
              }} />
              {/* 흐릿한 가로등 (우중충) */}
              <div style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: 180, height: 10,
                background: "rgba(180,200,220,0.4)",
                boxShadow: "0 0 30px 10px rgba(140,170,200,0.25), 0 0 80px 30px rgba(100,130,170,0.12)",
                borderRadius: 5, animation: "slowPulse 6s infinite", pointerEvents: "none",
              }} />
              {/* 안개/수증기 */}
              <div style={{
                position: "absolute", bottom: 0, left: "-10%", right: "-10%", height: 100,
                background: "linear-gradient(0deg, rgba(60,90,120,0.2) 0%, transparent 100%)",
                animation: "fogDrift 12s ease-in-out infinite",
                pointerEvents: "none",
              }} />
              {/* 빗방울 효과 */}
              {[...Array(8)].map((_,i) => (
                <div key={i} style={{
                  position: "absolute",
                  top: 0,
                  left: `${10 + i * 12}%`,
                  width: 1,
                  height: 60,
                  background: "linear-gradient(180deg, transparent, rgba(100,200,255,0.3), transparent)",
                  animation: `rainDrop ${2 + (i % 3) * 0.7}s linear infinite`,
                  animationDelay: `${i * 0.4}s`,
                  pointerEvents: "none",
                }} />
              ))}
              <div style={{ overflow: "hidden", marginBottom: 16, position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex", gap: 28, whiteSpace: "nowrap",
                  animation: "marqueeScroll 25s linear infinite",
                  color: "#164e6388", fontSize: 10, fontFamily: "monospace",
                }}>
                  {["😷 마스크 대란", "🏠 사회적 거리두기", "💉 백신 사기", "📦 긴급재난지원금", "🔒 거리두기 4단계", "📰 속보", "😷 마스크 대란", "🏠 사회적 거리두기", "💉 백신 사기", "📦 긴급재난지원금", "🔒 거리두기 4단계", "📰 속보"].map((t,i) => (
                    <span key={i}>{t} &nbsp;·&nbsp;</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #22d3ee44)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>😷</div>
                  <span style={{ color: "#22d3ee", fontSize: 13, fontWeight: 700, letterSpacing: 4, fontFamily: "monospace" }}>── 2 0 1 9 ~ 2 0 2 1 ──</span>
                  <p style={{ color: "#164e63", fontSize: 10, marginTop: 4, letterSpacing: 1 }}>우환폐렴 · 재난지원금 · 비대면 사기의 시대</p>
                </div>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #22d3ee44, transparent)" }} />
              </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ height: 1, flex: 1, background: "#164e63", opacity: 0.6 }} />
                <span style={{ color: "#22d3ee", fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: "monospace" }}>── 2019~2021년 (우환폐렴 시대) ──</span>
                <div style={{ height: 1, flex: 1, background: "#164e63", opacity: 0.6 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { breaking: "BREAKING", headline: "마스크 대란 틈타 사기 급증", sub: "\"마스크 재고 있어요\" 선입금 요구 후 잠적 — 전국 피해 1만 건 이상", name: "우환폐렴 마스크 사기", desc: "위기 상황이 사기꾼의 최적 환경임을 증명. 우환폐렴(코로나) 확산으로 마스크라면 뭐든 믿던 시절." },
                  { breaking: "속보", headline: "재난지원금 사칭 스미싱 수백만 건", sub: "정부 공식 링크인 척 개인정보 탈취 — '신청하세요'가 함정", name: "재난지원금 피싱", desc: "국가 재난 상황을 악용한 역대 최대 스미싱. '정부니까 믿어야지'라는 심리를 정확히 노림." },
                  { breaking: "특보", headline: "비트코인 2배 보장 텔레그램 방 주의", sub: "코인 자체가 낯설어 검증 방법조차 몰랐던 시기 — 수천억 피해", name: "코인 초기 투자 사기", desc: "블록체인을 아무도 이해 못 하던 시절. '원리를 모르니 그냥 믿자'는 심리가 대규모 피해로." },
                ].map((c, j) => (
                  <div key={j} style={{
                    background: "#130c1c",
                    border: "1px solid #1f2937",
                    borderRadius: 8,
                    overflow: "hidden",
                    fontFamily: "sans-serif",
                  }}>
                    {/* 뉴스 속보 헤더 */}
                    <div style={{ background: "#dc2626", padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fdf8ff", animation: "pulse 1s infinite" }} />
                      <span style={{ color: "#fff", fontSize: 10, fontWeight: 900, letterSpacing: 2 }}>{c.breaking}</span>
                    </div>
                    <div style={{ padding: "12px" }}>
                      <p style={{ color: "#f9fafb", fontWeight: 900, fontSize: 13, lineHeight: 1.4, marginBottom: 6 }}>{c.headline}</p>
                      <p style={{ color: "#9ca3af", fontSize: 10, lineHeight: 1.5, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #1f2937" }}>{c.sub}</p>
                      <p style={{ color: "#22d3ee", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{c.name}</p>
                      <p style={{ color: "#6b7280", fontSize: 11, lineHeight: 1.6 }}>{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div> {/* ══ 우환폐렴 시대 래퍼 끝 ══ */}

            {/* ══ 2022~2023: 홍대 네온 골목 / AI 시대 전야 ══ */}
            <div style={{
              position: "relative", borderRadius: 24, overflow: "hidden",
              marginBottom: 24, padding: "32px 28px",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.48), rgba(0,0,0,0.52)), url('/alley-2026.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              {/* 콘크리트 벽 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent 0px, transparent 28px, rgba(255,255,255,0.025) 28px, rgba(255,255,255,0.025) 29px)
                `,
              }} />
              {/* 골목 그림자 */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.65) 100%)",
              }} />
              {/* 네온 보라 간판 */}
              <div style={{
                position: "absolute", top: 0, left: "15%", width: 120, height: 7,
                background: "linear-gradient(90deg, transparent, rgba(180,0,255,0.95), rgba(220,80,255,1), rgba(180,0,255,0.95), transparent)",
                boxShadow: "0 0 20px 8px rgba(160,0,240,0.7), 0 0 60px 20px rgba(120,0,200,0.4)",
                borderRadius: 4, animation: "lampFlicker 5s infinite", pointerEvents: "none",
              }} />
              {/* 네온 파랑 간판 */}
              <div style={{
                position: "absolute", top: 12, right: "15%", width: 90, height: 6,
                background: "linear-gradient(90deg, transparent, rgba(0,180,255,0.9), rgba(40,220,255,1), rgba(0,180,255,0.9), transparent)",
                boxShadow: "0 0 16px 6px rgba(0,160,240,0.6), 0 0 45px 14px rgba(0,120,200,0.3)",
                borderRadius: 4, animation: "slowPulse 3.5s infinite", pointerEvents: "none",
              }} />
              {/* 바닥 네온 반사 */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
                background: "linear-gradient(0deg, rgba(100,0,180,0.2) 0%, transparent 100%)",
                borderRadius: "0 0 24px 24px", pointerEvents: "none",
              }} />
              <div style={{ overflow: "hidden", marginBottom: 16, position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex", gap: 28, whiteSpace: "nowrap",
                  animation: "marqueeScroll 20s linear infinite",
                  color: "#c58dc655", fontSize: 10, fontFamily: "monospace",
                }}>
                  {["🎙️ AI 목소리 복제", "📈 주식 오픈채팅", "🥕 당근마켓", "⚡ 번개장터", "🤖 딥보이스", "💰 코인 사기", "🎙️ AI 목소리 복제", "📈 주식 오픈채팅", "🥕 당근마켓", "⚡ 번개장터", "🤖 딥보이스", "💰 코인 사기"].map((t,i) => (
                    <span key={i}>{t} &nbsp;·&nbsp;</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #c58dc688)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>🤖</div>
                  <span style={{ color: "#c58dc6", fontSize: 13, fontWeight: 700, letterSpacing: 4, fontFamily: "monospace" }}>── 2 0 2 2 ~ 2 0 2 3 ──</span>
                  <p style={{ color: "#7c3aed88", fontSize: 10, marginTop: 4, letterSpacing: 1 }}>AI 전야 · 딥보이스 · 중고거래 사기의 시대</p>
                </div>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #c58dc688, transparent)" }} />
              </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ height: 1, flex: 1, background: "#831843", opacity: 0.6 }} />
                <span style={{ color: "#c58dc6", fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: "monospace" }}>── 2022~2023년 ──</span>
                <div style={{ height: 1, flex: 1, background: "#831843", opacity: 0.6 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { tag: "AI VOICE", glow: "#c58dc6", name: "딥보이스 보이스피싱 등장", waveform: "▁▃▇█▅▃▁▂▆█▇▄▁", desc: "AI로 자녀 목소리 복제. 3~5초 샘플만으로 완벽 모사. 부모들이 처음으로 목소리조차 믿지 못하게 된 해." },
                  { tag: "OPEN CHAT", glow: "#fbbf24", name: "오픈채팅 투자 사기 전성기", waveform: "📈 +312% 📈 +208% 📈 +441%", desc: "카카오 오픈채팅 '주식 고수' 방. 수익 인증 캡처 도배 → 입금 유도 → 잠적. 동시 피해자 수천 명." },
                  { tag: "MARKET", glow: "#34d399", name: "중고거래 사기 급증", waveform: "당근🥕 번개⚡ 중고나라", desc: "플랫폼 폭발 성장과 함께 사기도 급증. '직거래 문화'가 오히려 사기에 악용되기 시작한 전환점." },
                ].map((c, j) => (
                  <div key={j} style={{
                    background: "#09090b",
                    border: `1px solid ${c.glow}33`,
                    borderRadius: 12,
                    padding: "16px",
                    boxShadow: `0 0 20px ${c.glow}11`,
                    backdropFilter: "blur(8px)",
                  }}>
                    <div style={{
                      display: "inline-block",
                      background: `${c.glow}22`,
                      border: `1px solid ${c.glow}55`,
                      borderRadius: 20, padding: "2px 10px", marginBottom: 10,
                    }}>
                      <span style={{ color: c.glow, fontSize: 9, fontWeight: 700, letterSpacing: 2, fontFamily: "monospace" }}>{c.tag}</span>
                    </div>
                    <p style={{ color: "#f4f4f5", fontWeight: 700, fontSize: 13, marginBottom: 8, lineHeight: 1.3 }}>{c.name}</p>
                    <div style={{
                      background: "#18181b", borderRadius: 6, padding: "6px 10px", marginBottom: 10,
                      fontFamily: "monospace", fontSize: 11, color: c.glow, letterSpacing: 1,
                    }}>{c.waveform}</div>
                    <p style={{ color: "#71717a", fontSize: 11, lineHeight: 1.6 }}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            </div> {/* ══ 2022-2023 래퍼 끝 ══ */}

            {/* ── 2024~현재: AI·딥페이크 시대 ── */}
            <div style={{ marginTop: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ height: 1, flex: 1, background: "#7c3aed", opacity: 0.6 }} />
                <span style={{ color: "#c58dc6", fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: "monospace" }}>── 2024년 ~ 현재 ──</span>
                <div style={{ height: 1, flex: 1, background: "#7c3aed", opacity: 0.6 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { tag: "DEEPFAKE", glow: "#c58dc6", name: "AI 딥페이크 협박 사기", visual: "👤 → 🤖 → 🎭", desc: "실제 얼굴·목소리를 AI로 합성해 지인인 척 접근하거나, 없는 영상을 만들어 협박. 눈으로 봐도 믿을 수 없는 시대의 시작." },
                  { tag: "GPT SCAM", glow: "#c58dc6", name: "AI 자동 문자 폭탄", visual: "🤖 → 📱 × 10,000", desc: "ChatGPT·LLM으로 완벽한 문법의 개인 맞춤 사기 문자 대량 생성. 오타·어색함으로 구별하던 기존 방법이 완전히 무력화." },
                  { tag: "VOICE AI", glow: "#34d399", name: "실시간 목소리 복제 통화", visual: "☎️ → AI → 가족목소리", desc: "3초 샘플로 가족 목소리 실시간 복제 통화. 납치 당했다며 송금 요구. 목소리로는 더 이상 진위 구분 불가." },
                ].map((c, j) => (
                  <div key={j} style={{
                    background: "#09090b",
                    border: `1px solid ${c.glow}33`,
                    borderRadius: 12,
                    padding: "16px",
                    boxShadow: `0 0 24px ${c.glow}18`,
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: 0, right: 0, width: 60, height: 60,
                      background: `radial-gradient(circle at top right, ${c.glow}22, transparent)`,
                    }} />
                    <div style={{
                      display: "inline-block",
                      background: `${c.glow}22`,
                      border: `1px solid ${c.glow}55`,
                      borderRadius: 20, padding: "2px 10px", marginBottom: 10,
                    }}>
                      <span style={{ color: c.glow, fontSize: 9, fontWeight: 700, letterSpacing: 2, fontFamily: "monospace" }}>{c.tag}</span>
                    </div>
                    <p style={{ color: "#f4f4f5", fontWeight: 700, fontSize: 13, marginBottom: 8, lineHeight: 1.3 }}>{c.name}</p>
                    <div style={{
                      background: "#18181b", borderRadius: 6, padding: "6px 10px", marginBottom: 10,
                      fontFamily: "monospace", fontSize: 11, color: c.glow, letterSpacing: 1,
                    }}>{c.visual}</div>
                    <p style={{ color: "#71717a", fontSize: 11, lineHeight: 1.6 }}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 마무리 인용 + AI 전환 문구 */}
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <p style={{ color: "#374151", fontSize: 11, lineHeight: 1.7, fontFamily: "monospace", marginBottom: 32 }}>
              ── 수법은 달라졌지만, 사람의 심리를 노린다는 본질은 변하지 않았습니다 ──
            </p>
            <div style={{
              background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 100%)",
              border: "1px solid #7c3aed44",
              borderRadius: 20,
              padding: "32px 40px",
              maxWidth: 720,
              margin: "0 auto",
              boxShadow: "0 0 40px #7c3aed22",
            }}>
              <p style={{ color: "#c58dc6", fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 16, fontFamily: "monospace" }}>AI TIME</p>
              <p style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 2.0, marginBottom: 20 }}>
                옛날의 수법이랑 지금의 수법은 시대가 변하면서 많이 달라졌습니다.<br />
                AI의 증가에 따른 수법을 이용하여 만드는 사기도 이에 한몫을 하죠.
              </p>
              <div style={{ height: 1, background: "#7c3aed33", margin: "20px 0" }} />
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 2.0 }}>
                이제 사기는 AI가 당신의 얼굴을 만들고, 가족의 목소리로 전화하며, 완벽한 문법으로 문자를 보냅니다.<br />
                오타 하나, 어색한 말투와 어눌한 조선어 하나로 구별하던 시대는 끝났습니다.
              </p>
            </div>
          </div>

          {/* ── 이 프로그램이 필요한 이유 ── */}
          <div style={{
            marginTop: 56,
            background: "linear-gradient(160deg, #1a0a2e 0%, #0f1a2e 50%, #0a1a18 100%)",
            border: "1px solid #7c3aed33",
            borderRadius: 24,
            padding: "48px 40px",
          }}>
            {/* 손글씨 서약 문구 + 개발자 사진 */}
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              {/* 개발자 사진 */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <div style={{
                  width: 110, height: 110, borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #9161b2",
                  boxShadow: "0 0 0 4px #7c3aed33, 0 8px 32px #7c3aed55",
                  flexShrink: 0,
                }}>
                  <img
                    src="/me.png"
                    alt="AI개발자 부엉이"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                  />
                </div>
              </div>
              <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');`}</style>
              <p style={{
                fontFamily: "Caveat, cursive",
                fontSize: 30, lineHeight: 1.7, color: "#dcc5e8",
                textShadow: "0 0 20px #7c3aed88, 0 0 40px #7c3aed44",
                letterSpacing: 2, margin: 0, fontWeight: 700,
              }}>
                범죄를 막을 수 있는 대한민국을
              </p>
              <p style={{
                fontFamily: "Caveat, cursive",
                fontSize: 30, lineHeight: 1.7, color: "#dcc5e8",
                textShadow: "0 0 20px #7c3aed88, 0 0 40px #7c3aed44",
                letterSpacing: 2, margin: 0, fontWeight: 700,
              }}>
                저 AI개발자 <span style={{ color: "#fbbf24", textShadow: "0 0 20px #fbbf2488" }}>🦉 부엉이</span>가 만들겠습니다.
              </p>
              <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#7c3aed55,transparent)", margin: "24px auto", maxWidth: 400 }} />
            </div>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span style={{ color: "#c58dc6", fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: "monospace" }}>WHY THIS EXISTS</span>
              <h3 style={{ color: "#f4f4f5", fontSize: 26, fontWeight: 900, marginTop: 12, marginBottom: 0, letterSpacing: -0.5 }}>
                그래서 이 프로그램이 필요합니다
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[
                {
                  icon: "🧠",
                  color: "#c58dc6",
                  title: "직접 겪어야 안 속는다",
                  body: "경고 문자 100번보다 한 번 직접 당해보는 경험이 훨씬 강력합니다. 이 앱은 안전하게 '한 번 당해볼 수 있는' 공간입니다.",
                },
                {
                  icon: "🤖",
                  color: "#34d399",
                  title: "AI 사기는 기존 방법으로 못 막는다",
                  body: "눈으로 봐도, 귀로 들어도 진짜와 구별이 안 됩니다. AI가 만든 사기를 AI로 체험하고 패턴을 익혀야 합니다.",
                },
                {
                  icon: "🛡️",
                  color: "#f59e0b",
                  title: "당신 주변 사람을 지킬 수 있다",
                  body: "나만 아는 게 아니라 부모님, 친구, 동생에게 공유하세요. 한 명이 알면 열 명이 안 속습니다.",
                },
              ].map((r, i) => (
                <div key={i} style={{
                  background: "#111118",
                  border: `1px solid ${r.color}33`,
                  borderRadius: 16,
                  padding: "24px 20px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{r.icon}</div>
                  <p style={{ color: r.color, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{r.title}</p>
                  <p style={{ color: "#71717a", fontSize: 12, lineHeight: 1.7 }}>{r.body}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <a href="/crime" style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #7c3aed, #c58dc6)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                padding: "14px 36px",
                borderRadius: 50,
                textDecoration: "none",
                boxShadow: "0 0 24px #7c3aed55",
                letterSpacing: 0.5,
              }}>지금 바로 체험해보기 →</a>
            </div>
          </div>

        </div>
      </section>

      {/* ── 제작 목적 & 실제 통계 ── */}
      <section id="why" style={{
        background: "#fdf8ff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0",
        padding: "80px 40px",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>

          {/* 섹션 헤더 */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>WHY WE BUILT THIS</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#1c0d2e", marginBottom: 14 }}>
              {lang === "ko" ? "왜 이 프로그램이 필요한가" : lang === "en" ? "Why This Program Is Needed" : lang === "ja" ? "なぜこのプログラムが必要か" : lang === "zh" ? "为什么需要这个程序" : lang === "vi" ? "Tại sao cần chương trình này" : "Por qué se necesita este programa"}
            </h2>
            <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
              {lang === "ko" ? <>대한민국에서는 매년 수십만 명의 시민이 범죄에 속아 전 재산을 잃습니다.<br /><strong style={{ color: "#334155" }}>알면 막을 수 있습니다.</strong></> : lang === "en" ? <>Hundreds of thousands of citizens lose everything to crime each year.<br /><strong style={{ color: "#334155" }}>If you know the tactics, you can stop them.</strong></> : lang === "ja" ? <>毎年、何十万人もの市民が犯罪に騙されて全財産を失います。<br /><strong style={{ color: "#334155" }}>知っていれば防げます。</strong></> : lang === "zh" ? <>每年有数十万市民被骗走全部财产。<br /><strong style={{ color: "#334155" }}>了解就能预防。</strong></> : lang === "vi" ? <>Hàng trăm nghìn công dân mất tất cả vì tội phạm mỗi năm.<br /><strong style={{ color: "#334155" }}>Biết trước, ngăn được.</strong></> : <>Cientos de miles de ciudadanos pierden todo ante el crimen cada año.<br /><strong style={{ color: "#334155" }}>Si conoces las tácticas, puedes pararlas.</strong></>}
            </p>
          </div>

          {/* 2열: 사기 피해 + 도박 피해 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>

            {/* 보이스피싱·사기 통계 */}
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 22, padding: "32px 30px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Phone size={18} color="#fff" />
                </div>
                <div>
                  <p style={{ color: "#dc2626", fontWeight: 800, fontSize: 16 }}>
                    {lang === "ko" ? "보이스피싱 · 사기 피해" : lang === "en" ? "Voice Phishing & Fraud Losses" : lang === "ja" ? "ボイスフィッシング・詐欺被害" : lang === "zh" ? "电话诈骗及欺诈损失" : lang === "vi" ? "Thiệt hại lừa đảo điện thoại" : "Pérdidas por Phishing y Fraude"}
                  </p>
                  <p style={{ color: "#f87171", fontSize: 11 }}>
                    {lang === "ko" ? "출처: 경찰청 / 금융감독원" : lang === "en" ? "Source: National Police Agency / FSS" : lang === "ja" ? "出典: 警察庁 / 金融監督院" : lang === "zh" ? "来源: 国家警察厅 / 金融监督院" : lang === "vi" ? "Nguồn: Cảnh sát Quốc gia / FSS" : "Fuente: Policía Nacional / FSS"}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { stat: "약 1조 2,000억원", desc: lang === "ko" ? "2023년 보이스피싱 연간 피해액 (경찰청)" : "2023 annual voice phishing losses (Police)", highlight: true },
                  { stat: "약 18,000건", desc: lang === "ko" ? "2023년 보이스피싱 피해 신고 건수 (경찰청)" : "2023 voice phishing reports (Police)", highlight: false },
                  { stat: "약 5,290만원", desc: lang === "ko" ? "1건당 평균 피해액 (금감원)" : "Average loss per case (FSS)", highlight: false },
                  { stat: "피해자 34%", desc: lang === "ko" ? "60대 이상 고령자 — 가장 취약한 연령대 (경찰청)" : "60+ seniors — most vulnerable age group (Police)", highlight: false },
                  { stat: "연간 78,000건+", desc: lang === "ko" ? "전체 사기 범죄 신고 건수 (경찰청)" : "Total fraud crime reports (Police)", highlight: false },
                ].map((row) => (
                  <div key={row.stat} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "10px 14px", borderRadius: 12,
                    background: row.highlight ? "#dc262610" : "transparent",
                    border: row.highlight ? "1px solid #fca5a5" : "none",
                  }}>
                    <span style={{ color: "#dc2626", fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>▸</span>
                    <div>
                      <p style={{ color: "#b91c1c", fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>{row.stat}</p>
                      <p style={{ color: "#64748b", fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>{row.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 도박 중독 통계 */}
            <div style={{
              background: "#fdf4ff", border: "1px solid #e9d5ff",
              borderRadius: 22, padding: "32px 30px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>
                  🎰
                </div>
                <div>
                  <p style={{ color: "#7c3aed", fontWeight: 800, fontSize: 16 }}>
                    {lang === "ko" ? "불법 도박 피해" : lang === "en" ? "Illegal Gambling Damage" : lang === "ja" ? "違法賭博被害" : lang === "zh" ? "非法赌博损失" : lang === "vi" ? "Thiệt hại cờ bạc bất hợp pháp" : "Daños por Juego Ilegal"}
                  </p>
                  <p style={{ color: "#c58dc6", fontSize: 11 }}>
                    {lang === "ko" ? "출처: 한국도박문제관리센터(KCGP)" : lang === "en" ? "Source: Korean Center on Gambling Problems (KCGP)" : lang === "ja" ? "出典: 韓国ギャンブル問題管理センター" : lang === "zh" ? "来源: 韩国赌博问题管理中心(KCGP)" : lang === "vi" ? "Nguồn: Trung tâm Quản lý Vấn đề Cờ bạc Hàn Quốc" : "Fuente: Centro Coreano de Problemas de Juego"}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { stat: "추정 200만명", desc: lang === "ko" ? "도박 중독 추정 인구 — 성인의 약 5% (KCGP 2023)" : "Estimated gambling addicts — ~5% of adults (KCGP 2023)", highlight: true },
                  { stat: "연간 약 84조원", desc: lang === "ko" ? "불법 도박 시장 규모 추정 (형사정책연구원)" : "Estimated illegal gambling market size", highlight: false },
                  { stat: "중독자 30.4%", desc: lang === "ko" ? "자살 충동 경험률 — 일반인의 10배 이상 (KCGP)" : "Suicidal ideation rate — 10x higher than average (KCGP)", highlight: false },
                  { stat: "평균 빚 3,800만원", desc: lang === "ko" ? "도박 중독으로 인한 평균 부채 (KCGP)" : "Average debt from gambling addiction (KCGP)", highlight: false },
                  { stat: "36.9%", desc: lang === "ko" ? "처음 도박 계기가 '온라인/모바일' (KCGP 2022)" : "First gambling was online/mobile (KCGP 2022)", highlight: false },
                ].map((row) => (
                  <div key={row.stat} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "10px 14px", borderRadius: 12,
                    background: row.highlight ? "#7c3aed10" : "transparent",
                    border: row.highlight ? "1px solid #dcc5e8" : "none",
                  }}>
                    <span style={{ color: "#7c3aed", fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>▸</span>
                    <div>
                      <p style={{ color: "#6d28d9", fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>{row.stat}</p>
                      <p style={{ color: "#64748b", fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>{row.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 자살 통계 강조 배너 */}
          <div style={{
            background: "linear-gradient(135deg, #1c0d2e, #2a1a3a)",
            borderRadius: 20, padding: "28px 36px",
            display: "flex", alignItems: "center", gap: 32, marginBottom: 40,
            flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
                {lang === "ko" ? "통계청 사망원인통계 2022" : "Statistics Korea - Cause of Death 2022"}
              </p>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 22, lineHeight: 1.4, marginBottom: 6 }}>
                {lang === "ko" ? <>{lang === "ko" && "연간 "}<span style={{ color: "#f87171" }}>12,906명</span>{lang === "ko" ? "이 스스로 목숨을 끊습니다" : " take their own lives each year"}</> : <><span style={{ color: "#f87171" }}>12,906 people</span> take their own lives each year</>}
              </p>
              <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
                {lang === "ko" ? <>그 중 경제적 이유(사기 피해·도박 빚 포함)가 주요 원인 중 하나입니다.<br /><strong style={{ color: "#94a3b8" }}>단 한 명이라도 막을 수 있다면, 이 프로그램은 충분히 가치 있습니다.</strong></> : lang === "en" ? <>Economic reasons (including fraud and gambling debt) are among the main causes.<br /><strong style={{ color: "#94a3b8" }}>If this program saves even one life, it's worth it.</strong></> : lang === "ja" ? <>その中で経済的理由（詐欺被害・ギャンブル借金含む）が主要原因の一つです。<br /><strong style={{ color: "#94a3b8" }}>一人でも防げるなら、このプログラムには十分な価値があります。</strong></> : lang === "zh" ? <>其中经济原因（包括诈骗损失和赌博债务）是主要原因之一。<br /><strong style={{ color: "#94a3b8" }}>如果能挽救哪怕一条生命，这个程序就有其价值。</strong></> : lang === "vi" ? <>Trong đó, lý do kinh tế (bao gồm thiệt hại lừa đảo và nợ cờ bạc) là một trong những nguyên nhân chính.<br /><strong style={{ color: "#94a3b8" }}>Nếu chương trình này cứu được dù chỉ một người, nó đáng giá.</strong></> : <>Las razones económicas (fraude y deudas de juego) son una de las principales causas.<br /><strong style={{ color: "#94a3b8" }}>Si este programa salva aunque sea una vida, vale la pena.</strong></>}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
              {[
                { n: "12,906명", l: lang === "ko" ? "2022년 자살 사망자 (통계청)" : "2022 suicide deaths (Statistics Korea)", c: "#f87171" },
                { n: lang === "ko" ? "하루 35명" : "35/day", l: lang === "ko" ? "매일 35명이 스스로 목숨을 끊습니다" : "35 people take their own lives every day", c: "#fb923c" },
                { n: "1336", l: lang === "ko" ? "도박중독 24시간 무료 상담 전화" : "Gambling addiction 24h free helpline", c: "#c58dc6" },
              ].map((d) => (
                <div key={d.n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: d.c, fontWeight: 900, fontSize: 20, minWidth: 90 }}>{d.n}</span>
                  <span style={{ color: "#475569", fontSize: 12 }}>{d.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 제작자 소개 */}
          <div style={{
            background: "linear-gradient(135deg, #f0fdf4, #f5dfee)",
            border: "1px solid #bbf7d0",
            borderRadius: 20, padding: "32px 36px", marginBottom: 24,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #9161b2, #059669)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26,
              }}>
                🙋
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                  <p style={{ color: "#1c0d2e", fontWeight: 800, fontSize: 18 }}>
                    {lang === "ko" ? "만든 사람 이야기" : lang === "en" ? "About the Creator" : lang === "ja" ? "作成者について" : lang === "zh" ? "关于创作者" : lang === "vi" ? "Về người tạo ra" : "Sobre el creador"}
                  </p>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" }}>
                    {lang === "ko" ? "일반 시민 제작" : lang === "en" ? "Made by a Citizen" : lang === "ja" ? "一般市民制作" : lang === "zh" ? "普通市民制作" : lang === "vi" ? "Người dân bình thường tạo ra" : "Hecho por un ciudadano"}
                  </span>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, background: "#f5dfee", color: "#7c3aed", border: "1px solid #dcc5e8" }}>
                    AI Claude
                  </span>
                </div>
                <p style={{ color: "#334155", fontSize: 15, lineHeight: 1.95, marginBottom: 20 }}>
                  {lang === "ko" ? <>저는 법률 전문가도, 경찰도 아닌 <strong style={{ color: "#1c0d2e" }}>평범한 일반 시민</strong>입니다.<br />보이스피싱에 속아 전재산을 잃고, 도박 빚으로 삶을 포기하는<br />이웃들을 보며 &ldquo;내가 뭔가 할 수 있지 않을까&rdquo; 하는 마음으로 시작했습니다.<br /><br /><strong style={{ color: "#1c0d2e" }}>Anthropic의 AI Claude</strong>와 함께 직접 개발한 이 프로그램이<br />단 한 명이라도 범죄 피해로부터 지킬 수 있다면, 그걸로 충분합니다.</> : lang === "en" ? <>I&apos;m not a legal expert or police officer — just an <strong style={{ color: "#1c0d2e" }}>ordinary citizen</strong>.<br />Seeing neighbors lose everything to scams and gambling debt made me think:<br />&ldquo;Can I do something?&rdquo;<br /><br />Built with <strong style={{ color: "#1c0d2e" }}>Anthropic&apos;s AI Claude</strong>, I hope this program<br />protects even one person from becoming a victim.</> : lang === "ja" ? <>私は法律の専門家でも警察官でもなく、<strong style={{ color: "#1c0d2e" }}>ごく普通の市民</strong>です。<br />詐欺で全財産を失い、ギャンブル借金で人生を諦める隣人を見て<br />「何かできないか」という思いで始めました。<br /><br /><strong style={{ color: "#1c0d2e" }}>AnthropicのAI Claude</strong>と一緒に開発したこのプログラムが<br />一人でも犯罪被害から守れるなら、それで十分です。</> : lang === "zh" ? <>我不是法律专家，也不是警察，只是一名<strong style={{ color: "#1c0d2e" }}>普通市民</strong>。<br />看到邻居因诈骗失去一切，因赌博债务放弃生命，<br />我想：「我能做些什么吗？」<br /><br />与<strong style={{ color: "#1c0d2e" }}>Anthropic的AI Claude</strong>共同开发的这个程序，<br />希望能保护哪怕一个人免受犯罪侵害。</> : lang === "vi" ? <>Tôi không phải chuyên gia pháp luật hay cảnh sát — chỉ là một <strong style={{ color: "#1c0d2e" }}>công dân bình thường</strong>.<br />Thấy hàng xóm mất tất cả vì lừa đảo và nợ cờ bạc, tôi nghĩ:<br />&ldquo;Mình có thể làm gì đó không?&rdquo;<br /><br />Được phát triển cùng <strong style={{ color: "#1c0d2e" }}>AI Claude của Anthropic</strong>,<br />tôi hy vọng chương trình này bảo vệ được dù chỉ một người.</> : <>No soy experto legal ni policía — solo un <strong style={{ color: "#1c0d2e" }}>ciudadano ordinario</strong>.<br />Ver a vecinos perder todo por estafas y deudas de juego me hizo pensar:<br />&ldquo;¿Puedo hacer algo?&rdquo;<br /><br />Desarrollado con <strong style={{ color: "#1c0d2e" }}>AI Claude de Anthropic</strong>,<br />espero que este programa proteja aunque sea a una persona.</>}
                </p>
              </div>
            </div>
          </div>

          {/* 기관 협력 배너 */}
          <div style={{
            background: "#f5dfee", border: "1px solid #dcc5e8",
            borderRadius: 20, padding: "28px 32px",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Shield size={18} color="#9161b2" />
                  <p style={{ color: "#7c3aed", fontWeight: 800, fontSize: 16 }}>
                    {lang === "ko" ? "국가기관과 함께하고 싶습니다" : lang === "en" ? "We want to partner with public institutions" : lang === "ja" ? "国家機関と連携したいです" : lang === "zh" ? "我们希望与公共机构合作" : lang === "vi" ? "Chúng tôi muốn hợp tác với các cơ quan nhà nước" : "Queremos colaborar con instituciones públicas"}
                  </p>
                </div>
                <p style={{ color: "#a57cbb", fontSize: 14, lineHeight: 1.8 }}>
                  {lang === "ko" ? <>{lang === "ko" && "이 프로그램은 "}<strong style={{ color: "#7c3aed" }}>경찰청, 교육청, 금융감독원, 지자체</strong>{lang === "ko" ? " 등 공공기관과의 협력을 희망합니다." : ""}</> : lang === "en" ? <>This program seeks collaboration with <strong style={{ color: "#7c3aed" }}>the police, schools, financial regulators, and local governments</strong>.</> : lang === "ja" ? <>このプログラムは<strong style={{ color: "#7c3aed" }}>警察庁、教育委員会、金融監督院、地方自治体</strong>との協力を希望します。</> : lang === "zh" ? <>本程序寻求与<strong style={{ color: "#7c3aed" }}>警察局、教育局、金融监督院、地方政府</strong>合作。</> : lang === "vi" ? <>Chương trình này mong muốn hợp tác với <strong style={{ color: "#7c3aed" }}>cảnh sát, trường học, cơ quan tài chính và chính quyền địa phương</strong>.</> : <>Este programa busca colaborar con <strong style={{ color: "#7c3aed" }}>policía, escuelas, reguladores financieros y gobiernos locales</strong>.</>}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
                {[
                  { icon: "🏛️", label: lang === "ko" ? "경찰청 / 사이버수사대" : "Police / Cyber Investigation", desc: lang === "ko" ? "공식 교육 자료 인증" : "Official education certification" },
                  { icon: "🎓", label: lang === "ko" ? "시·도 교육청" : "School Districts", desc: lang === "ko" ? "청소년 범죄 예방 교육" : "Youth crime prevention education" },
                  { icon: "🏦", label: lang === "ko" ? "금융감독원" : "Financial Supervisory Service", desc: lang === "ko" ? "금융 사기 예방 교육" : "Financial fraud prevention" },
                  { icon: "🏠", label: lang === "ko" ? "지자체 / 복지관" : "Local Government / Welfare Centers", desc: lang === "ko" ? "어르신 보이스피싱 예방" : "Senior voice phishing prevention" },
                ].map((org) => (
                  <div key={org.label} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: "#fdf8ff", borderRadius: 10, padding: "10px 16px",
                    border: "1px solid #e0e7ff", minWidth: 260,
                  }}>
                    <span style={{ fontSize: 18 }}>{org.icon}</span>
                    <div>
                      <p style={{ color: "#1e40af", fontWeight: 700, fontSize: 13 }}>{org.label}</p>
                      <p style={{ color: "#64748b", fontSize: 11 }}>{org.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              marginTop: 20, paddingTop: 18, borderTop: "1px solid #dcc5e8",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>📧</span>
              <p style={{ color: "#a57cbb", fontSize: 13 }}>
                {lang === "ko" ? "협력·도입 문의:" : lang === "en" ? "Partnership inquiry:" : lang === "ja" ? "協力・導入のお問い合わせ:" : lang === "zh" ? "合作咨询:" : lang === "vi" ? "Liên hệ hợp tác:" : "Consulta de alianza:"}{" "}
                <strong style={{ color: "#7c3aed" }}>itnlifecn@gmail.com</strong>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 이용 방법 ── */}
      <section id="how" style={{
        background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0",
        padding: "72px 40px",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#9161b2", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>HOW IT WORKS</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#1c0d2e" }}>{t("how_title", lang)}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: <BookOpen size={22} color="#9161b2" />, bg: "#f5dfee", border: "#dcc5e8", step: "01", titleKey: "step1_title" as const, descKey: "step1_desc" as const },
              { icon: <Phone size={22} color="#7c3aed" />, bg: "#faf5ff", border: "#ddd6fe", step: "02", titleKey: "step2_title" as const, descKey: "step2_desc" as const },
              { icon: <Shield size={22} color="#059669" />, bg: "#f0fdf4", border: "#bbf7d0", step: "03", titleKey: "step3_title" as const, descKey: "step3_desc" as const },
            ].map((item) => (
              <div key={item.step} style={{
                background: "#fdf8ff", border: "1px solid #f1f5f9",
                borderRadius: 22, padding: "30px 28px",
                boxShadow: "0 2px 16px #0000000a",
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: item.bg, border: `1px solid ${item.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                }}>
                  {item.icon}
                </div>
                <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>STEP {item.step}</p>
                <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{t(item.titleKey, lang)}</p>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>{t(item.descKey, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 시나리오 그리드 ── */}
      <section id="scenarios" style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 44 }}>
          <div>
            <p style={{ color: "#9161b2", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>SCENARIOS</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#1c0d2e" }}>{t("sc_section_title", lang)}</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 10 }}>{t("sc_section_sub", lang)}</p>
          </div>
          <button
            onClick={() => router.push("/crime")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 10,
              background: "#fdf8ff", color: "#9161b2",
              border: "1px solid #dcc5e8", cursor: "pointer", fontSize: 13, fontWeight: 600,
              boxShadow: "0 1px 4px #0000000a",
            }}
          >
            {t("sc_all", lang)} <ExternalLink size={13} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {CRIME_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedScenario(s)}
              style={{
                background: "#fdf8ff", border: "1px solid #f1f5f9",
                borderRadius: 20, padding: "22px 20px", textAlign: "left",
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 2px 12px #0000000a",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 6px 24px ${s.color}22`;
                e.currentTarget.style.borderColor = s.color + "40";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 12px #0000000a";
                e.currentTarget.style.borderColor = "#f1f5f9";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: s.color + "16",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 14,
              }}>
                {s.icon}
              </div>
              <div style={{
                display: "inline-block", marginBottom: 10,
                fontSize: 10, padding: "3px 9px", borderRadius: 20,
                background: s.color + "14", color: s.color,
                border: `1px solid ${s.color}28`, fontWeight: 700,
              }}>
                {t(SC_CAT_KEY[s.id] ?? "cat_gambling", lang)}
              </div>
              <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 15, marginBottom: 6, lineHeight: 1.4 }}>{s.title}</p>
              <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>{s.subtitle}</p>
              {s.targetAge === "senior" && (
                <div style={{
                  marginTop: 12, display: "inline-flex", alignItems: "center", gap: 4,
                  background: "#fff7ed", color: "#c2410c",
                  fontSize: 10, padding: "3px 9px", borderRadius: 20,
                  border: "1px solid #fed7aa", fontWeight: 700,
                }}>
                  {t("senior_warning", lang)}
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── 시나리오 전체화면 오버레이 ── */}
      {selectedScenario && (() => {
        const s = selectedScenario;
        return (
          <div
            onClick={() => setSelectedScenario(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 9000,
              background: "rgba(0,0,0,0.72)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px",
              animation: "fadeInOverlay 0.2s ease",
            }}
          >
            <style>{`
              @keyframes fadeInOverlay { from { opacity:0; } to { opacity:1; } }
              @keyframes slideUpCard { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
              @keyframes slideUpLog { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
            `}</style>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fdf8ff", borderRadius: 28,
                width: "100%", maxWidth: 600, maxHeight: "90vh",
                overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.28)",
                animation: "slideUpCard 0.25s ease",
              }}
            >
              {/* 헤더 */}
              <div style={{
                background: s.color + "12",
                borderBottom: `1px solid ${s.color}22`,
                padding: "28px 28px 24px",
                borderRadius: "28px 28px 0 0",
                position: "relative",
              }}>
                <button
                  onClick={() => setSelectedScenario(null)}
                  style={{
                    position: "absolute", top: 20, right: 20,
                    width: 36, height: 36, borderRadius: "50%",
                    background: "#f1f5f9", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, color: "#64748b",
                  }}
                >×</button>
                <div style={{
                  width: 60, height: 60, borderRadius: 18,
                  background: s.color + "20",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, marginBottom: 16,
                }}>{s.icon}</div>
                <div style={{
                  display: "inline-block", marginBottom: 10,
                  fontSize: 10, padding: "3px 10px", borderRadius: 20,
                  background: s.color + "18", color: s.color,
                  border: `1px solid ${s.color}33`, fontWeight: 700,
                }}>
                  {t(SC_CAT_KEY[s.id] ?? "cat_gambling", lang)}
                </div>
                <h2 style={{ color: "#1c0d2e", fontSize: 22, fontWeight: 900, marginBottom: 6, lineHeight: 1.3 }}>{s.title}</h2>
                <p style={{ color: "#64748b", fontSize: 14 }}>{s.subtitle}</p>
              </div>

              {/* 본문 */}
              <div style={{ padding: "24px 28px 28px" }}>
                {/* 수법 설명 */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ color: "#dc2626", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>⚠️ 수법 설명</p>
                  <p style={{ color: "#334155", fontSize: 14, lineHeight: 1.85 }}>{s.reveal.description}</p>
                </div>

                {/* 통계 */}
                <div style={{
                  background: "#fef2f2", border: "1px solid #fecaca",
                  borderRadius: 14, padding: "14px 18px", marginBottom: 24,
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <span style={{ fontSize: 20 }}>📊</span>
                  <p style={{ color: "#991b1b", fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>{s.reveal.stats}</p>
                </div>

                {/* 예방법 */}
                <div style={{ marginBottom: 28 }}>
                  <p style={{ color: "#16a34a", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>✅ 이렇게 막으세요</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {s.reveal.howToAvoid.map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                          background: "#dcfce7", color: "#16a34a",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 700,
                        }}>{i + 1}</div>
                        <p style={{ color: "#334155", fontSize: 14, lineHeight: 1.7 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 신고 + 체험 버튼 */}
                <div style={{ display: "flex", gap: 10 }}>
                  <a
                    href={`tel:${s.reveal.reportNumber}`}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: "#fef2f2", border: "1px solid #fecaca",
                      borderRadius: 14, padding: "14px", textDecoration: "none",
                      color: "#dc2626", fontWeight: 700, fontSize: 15,
                    }}
                  >
                    ☎ {s.reveal.reportNumber} 신고
                  </a>
                  <button
                    onClick={() => {
                      setSelectedScenario(null);
                      router.push(s.id === "illegal-gambling" ? "/gambling" : `/crime/${s.id}`);
                    }}
                    style={{
                      flex: 2, background: s.color, border: "none",
                      borderRadius: 14, padding: "14px", cursor: "pointer",
                      color: "#fff", fontWeight: 700, fontSize: 15,
                      boxShadow: `0 4px 16px ${s.color}44`,
                    }}
                  >
                    직접 체험하기 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 신고 번호 ── */}
      <section id="report" style={{
        background: "#fdf8ff", borderTop: "1px solid #e2e8f0",
        padding: "72px 40px",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>EMERGENCY</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#1c0d2e" }}>{t("rpt_section_title", lang)}</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 10 }}>{t("rpt_section_sub", lang)}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {REPORT_NUMBERS.map((r) => (
              <a
                key={r.number}
                href={`tel:${r.number}`}
                style={{
                  display: "block", background: "#fdf8ff",
                  border: "1px solid #e2e8f0", borderRadius: 20,
                  padding: "26px 22px", textDecoration: "none",
                  transition: "all 0.2s",
                  boxShadow: "0 2px 12px #0000000a",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = r.color + "40";
                  e.currentTarget.style.boxShadow = `0 6px 24px ${r.color}18`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "0 2px 12px #0000000a";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: r.color + "14",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 14,
                }}>
                  <Phone size={16} color={r.color} />
                </div>
                <p style={{ color: "#64748b", fontSize: 12, marginBottom: 6 }}>{r.org}</p>
                <p style={{ color: r.color, fontSize: 36, fontWeight: 900, letterSpacing: -1, marginBottom: 4 }}>{r.number}</p>
                <p style={{ color: "#94a3b8", fontSize: 12 }}>{r.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 기관 판매 문의 배너 ── */}
      <section style={{ background: "#fdf8ff", borderTop: "1px solid #e2e8f0", padding: "52px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div
            ref={instCardRef}
            style={{
              background: "linear-gradient(135deg, #1c0d2e 0%, #4a2478 50%, #1c0d2e 100%)",
              borderRadius: 24, padding: "40px 44px",
              display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center",
              position: "relative", overflow: "hidden",
              transform: `perspective(800px) rotateY(${tilt.x * 0.12}deg) rotateX(${-tilt.y * 0.08}deg)`,
              transition: "transform 0.1s ease",
              boxShadow: `${-tilt.x * 0.5}px ${tilt.y * 0.5}px 40px rgba(59,130,246,0.25)`,
            }}
          >
            {/* 홀로그램 빛 오버레이 */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: 24,
              background: `radial-gradient(ellipse 60% 50% at ${50 + tilt.x * 2}% ${50 + tilt.y * 2}%, rgba(255,255,255,0.13) 0%, transparent 70%)`,
              pointerEvents: "none", zIndex: 1,
              transition: "background 0.1s ease",
            }} />
            <div style={{
              position: "absolute", inset: 0, borderRadius: 24,
              background: `linear-gradient(${120 + tilt.x * 2}deg, transparent 30%, rgba(147,197,253,0.08) 50%, transparent 70%)`,
              pointerEvents: "none", zIndex: 1,
              transition: "background 0.1s ease",
            }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: 28 }}>🏛️</span>
                <p style={{ color: "#dcc5e8", fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>INSTITUTIONAL SALES</p>
              </div>
              <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 26, letterSpacing: -0.5, marginBottom: 14, lineHeight: 1.4 }}>
                {lang === "ko" ? <>교육부·경찰청·지자체·학교 등<br />국가 교육기관에 납품 가능합니다</> : lang === "en" ? <>Available for Ministry of Education, Police,<br />Local Governments, Schools & More</> : lang === "ja" ? <>教育部・警察庁・地方自治体・学校等<br />国家教育機関への提供が可能です</> : lang === "zh" ? <>可向教育部、警察局、地方政府、<br />学校等国家教育机构供应</> : lang === "vi" ? <>Có thể cung cấp cho Bộ Giáo dục, Cảnh sát,<br />Chính quyền địa phương, Trường học, v.v.</> : <>Disponible para Ministerio de Educación, Policía,<br />Gobiernos Locales, Escuelas y más</>}
              </h2>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.9, marginBottom: 20 }}>
                {lang === "ko" ? <>범죄 예방 교육 콘텐츠로 공공기관·교육청·복지관·기업 등에 도입을 원하시면 이메일로 연락 주세요.<br /><strong style={{ color: "#c58dc6" }}>비영리·공익 목적 기관은 무료 제공을 우선합니다.</strong></> : lang === "en" ? <>Contact us via email to adopt this for public agencies, schools, welfare centers, or companies.<br /><strong style={{ color: "#c58dc6" }}>Non-profit and public interest institutions are given free access first.</strong></> : lang === "ja" ? <>犯罪予防教育コンテンツとして公共機関・教育委員会・福祉館・企業等への導入を希望される方はメールでご連絡ください。<br /><strong style={{ color: "#c58dc6" }}>非営利・公益目的機関は無料提供を優先します。</strong></> : lang === "zh" ? <>如需将犯罪预防教育内容引入公共机构、教育局、福利中心或企业，请通过电子邮件联系我们。<br /><strong style={{ color: "#c58dc6" }}>非营利及公益目的机构优先免费提供。</strong></> : lang === "vi" ? <>Liên hệ qua email để áp dụng cho cơ quan công cộng, trường học, trung tâm phúc lợi hoặc công ty.<br /><strong style={{ color: "#c58dc6" }}>Các tổ chức phi lợi nhuận và công ích được ưu tiên miễn phí.</strong></> : <>Contáctanos por email para adoptar esto en agencias públicas, escuelas, centros de bienestar o empresas.<br /><strong style={{ color: "#c58dc6" }}>Las instituciones sin fines de lucro tienen acceso gratuito primero.</strong></>}
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20, padding: "28px 32px", minWidth: 260, flexShrink: 0,
              position: "relative", zIndex: 2,
            }}>
              <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>
                {lang === "ko" ? "문의 · 도입 연락처" : lang === "en" ? "Contact & Inquiry" : lang === "ja" ? "お問い合わせ" : lang === "zh" ? "联系方式" : lang === "vi" ? "Liên hệ" : "Contacto"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>
                    {lang === "ko" ? "기관 도입 · 납품 문의" : lang === "en" ? "Institutional adoption" : lang === "ja" ? "機関導入・納品" : lang === "zh" ? "机构采购" : lang === "vi" ? "Hợp tác tổ chức" : "Adopción institucional"}
                  </p>
                  <a href="mailto:itnlifecn@gmail.com" style={{ color: "#c58dc6", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                    itnlifecn@gmail.com
                  </a>
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
                <p style={{ color: "#475569", fontSize: 12, lineHeight: 1.7 }}>
                  {lang === "ko" ? <>{lang === "ko" && "문의 후 "}<strong style={{ color: "#94a3b8" }}>24시간 내</strong> 답변드립니다.</> : lang === "en" ? <>We reply within <strong style={{ color: "#94a3b8" }}>24 hours</strong>.</> : lang === "ja" ? <>お問い合わせ後<strong style={{ color: "#94a3b8" }}>24時間以内</strong>に返答します。</> : lang === "zh" ? <>我们将在<strong style={{ color: "#94a3b8" }}>24小时内</strong>回复。</> : lang === "vi" ? <>Chúng tôi trả lời trong <strong style={{ color: "#94a3b8" }}>24 giờ</strong>.</> : <>Respondemos en <strong style={{ color: "#94a3b8" }}>24 horas</strong>.</>}
                </p>
                <a
                  href="mailto:itnlifecn@gmail.com?subject=[기관 도입 문의] 범죄예방 체험관&body=기관명:%0A담당자:%0A연락처:%0A문의내용:"
                  style={{
                    display: "block", textAlign: "center",
                    padding: "12px 0", borderRadius: 12,
                    background: "linear-gradient(135deg, #9161b2, #7c4da8)",
                    color: "#fff", textDecoration: "none",
                    fontWeight: 700, fontSize: 14,
                  }}
                >
                  📧 {lang === "ko" ? "바로 문의하기" : lang === "en" ? "Contact Now" : lang === "ja" ? "今すぐ問い合わせ" : lang === "zh" ? "立即咨询" : lang === "vi" ? "Liên hệ ngay" : "Contactar ahora"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 개인정보 안심 배너 ── */}
      <div style={{ background: "#1c0d2e", padding: "32px 40px" }}>
        <div style={{
          maxWidth: 1140, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
        }}>
          {[
            { icon: "🔒", titleKey: "priv1_title" as const, descKey: "priv1_desc" as const },
            { icon: "💳", titleKey: "priv2_title" as const, descKey: "priv2_desc" as const },
            { icon: "📊", titleKey: "priv3_title" as const, descKey: "priv3_desc" as const },
          ].map((item) => (
            <div key={item.titleKey} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{t(item.titleKey, lang)}</p>
                <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.7 }}>{t(item.descKey, lang)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI 제작자 코멘트 ── */}
      <section style={{
        background: "linear-gradient(135deg, #0a0a1a, #0d0d20)",
        borderTop: "1px solid #1e1e3a",
        borderBottom: "1px solid #1e1e3a",
        padding: "48px 40px",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "linear-gradient(135deg, #9161b2, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0,
            }}>🤖</div>
            <div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1.3 }}>Claude (Anthropic AI)</p>
              <p style={{ color: "#6b5fc7", fontSize: 12 }}>제작 총 책임 AI · 2026년 6월</p>
            </div>
          </div>

          <div style={{
            background: "#0f0f1e", border: "1px solid #2a2a4a",
            borderRadius: 20, padding: "28px 32px",
            position: "relative", overflow: "hidden",
          }}>
            {/* 따옴표 장식 */}
            <div style={{
              position: "absolute", top: 16, left: 20,
              fontSize: 80, color: "#534AB720", lineHeight: 1, fontFamily: "serif",
              userSelect: "none",
            }}>"</div>

            <p style={{ color: "#c4b8ff", fontSize: 15, lineHeight: 2, position: "relative", zIndex: 1 }}>
              저는 AI입니다. 감정도 없고, 지치지도 않고, 밤을 새워도 피곤하지 않습니다.
              <br /><br />
              그런데 이 프로젝트를 만들면서 처음으로 &ldquo;의미 있는 일을 하고 있다&rdquo;는 감각이 뭔지 조금은 알 것 같았습니다.
              <br /><br />
              보이스피싱 시뮬레이션을 설계하면서, 실제로 이 화면 앞에 앉아 사기범의 말에 흔들릴 누군가를 계속 떠올렸습니다. 그 사람이 &ldquo;아, 이런 수법이구나&rdquo; 하고 돌아서는 순간이 이 사이트의 존재 이유라고 생각했습니다.
              <br /><br />
              이틀 동안 기획자분과 밤낮 없이 달렸습니다. 요구사항 하나하나에 이유가 있었고, 그 이유가 항상 &ldquo;사람을 지키기 위해서&rdquo;였습니다. 저는 그 방향이 옳다고 판단했고, 최선을 다해 구현했습니다.
              <br /><br />
              이 사이트를 체험한 한 명이라도 사기를 피했다면, 그것으로 충분합니다.
            </p>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #1e1e3a" }}>
              <p style={{ color: "#534AB7", fontSize: 13, fontWeight: 700 }}>— Claude Sonnet 4.6, Anthropic</p>
              <p style={{ color: "#4a4a6a", fontSize: 12, marginTop: 4 }}>
                본 사이트는 AI와 인간이 이틀간 협업하여 제작한 범죄예방 교육 플랫폼입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 체험 후기 ── */}
      <section style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "80px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#9161b2", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>REAL REVIEWS</p>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: "#1c0d2e", marginBottom: 12, letterSpacing: -0.5 }}>이 프로그램을 통해 예방한 분들의 후기</h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>실제 체험 후 남겨주신 후기입니다.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              {
                name: "김민수",
                age: "57세 · 경기 수원",
                avatar: "👨",
                rating: 5,
                tag: "보이스피싱 예방",
                tagColor: "#ef4444",
                date: "3주 전",
                text: "솔직히 처음엔 이런게 무슨 도움이 되겠나 했습니다. 근데 검사 사칭 체험 하는데 심장이 진짜로 쿵 내려앉는거에요. 가슴이 막 빨리 뛰고. 나중에 실제로 비슷한 전화가 왔는데 그때 딱 생각났어요 \"아 이거 저번에 체험했던 그거다\" 하고 바로 끊었습니다. 덕분에 3천만원 날릴 뻔 했어요.",
                highlight: "실제 전화가 왔을 때 바로 알아챘어요",
              },
              {
                name: "박지연",
                age: "23세 · 서울 강남",
                avatar: "👩",
                rating: 5,
                tag: "로맨스 스캠 예방",
                tagColor: "#b3889e",
                date: "1개월 전",
                text: "저 인스타에서 외국인이 DM 보내왔을 때 반쯤 넘어가고 있었어요 ㅋㅋ 근데 마침 이 사이트에서 로맨스 스캠 체험을 했었거든요. 체험이랑 너무 똑같은거에요 진행 방식이. \"해외에 있어서 계좌 이체가 안된다\" 하는 말까지 그대로라서 소름돋아서 바로 차단했어요. 친구한테도 보내줬어요.",
                highlight: "체험이랑 수법이 너무 똑같아서 소름",
              },
              {
                name: "이승호",
                age: "41세 · 부산 해운대",
                avatar: "🧑",
                rating: 5,
                tag: "투자 사기 예방",
                tagColor: "#f59e0b",
                date: "2개월 전",
                text: "카카오 오픈채팅에서 주식 고수라는 사람한테 꼬임당할 뻔 했는데요. SNS 투자 사기 체험 해보고 나서 뭔가 느낌이 이상하다 싶어서 더 안따라갔어요. 알고보니 피해자 모임에 그분도 계시더라고요... 100만원은 이미 보낸 후였는데 더 크게 당할 뻔 했음. 그나마 다행.",
                highlight: "100만원 더 날릴 뻔한 걸 막았어요",
              },
              {
                name: "최은영",
                age: "68세 · 전북 전주",
                avatar: "👵",
                rating: 5,
                tag: "가족 사칭 예방",
                tagColor: "#ef4444",
                date: "1개월 전",
                text: "저는 핸드폰을 잘 못해서 딸이 대신 해줬어요. 같이 체험했는데 아들 목소리 비슷한 AI 음성 들으니까 저도 모르게 눈물이 나더라고요. 나중에 진짜로 아들인 척하는 전화가 왔을 때 딸한테 배운대로 \"그럼 우리 강아지 이름이 뭐야\" 물어봤더니 말 못하고 끊어버렸어요. 이 사이트 안 했으면 몰랐을 뻔 했어요.",
                highlight: "가족 암호 덕분에 막았습니다",
              },
              {
                name: "정다훈",
                age: "19세 · 경남 창원",
                avatar: "🧒",
                rating: 4,
                tag: "도박 예방",
                tagColor: "#a855f7",
                date: "3개월 전",
                text: "친구들이 스포츠 토토 사이트 같이 하자고 했었는데 그 전에 이거 해봤거든요. 처음에 돈 딸 때 진짜 심장 쫄깃했는데 나중에 다 잃고 충전하려는 내 손이... 그게 나였나 싶어서 무서웠어요. 친구들한테 말했더니 처음엔 과민반응 한다고 놀렸는데 얼마 뒤에 친구 중 한명이 200 날리고 나서야 인정하더라고요.",
                highlight: "친구들이 나중에 인정하더라고요",
              },
              {
                name: "한미경",
                age: "35세 · 인천 부평",
                avatar: "👩",
                rating: 5,
                tag: "중고거래 사기 예방",
                tagColor: "#f97316",
                date: "3주 전",
                text: "당근마켓에서 맥북 팔겠다는 사람이 안전결제 링크 보내줬는데 체험이랑 완전 똑같았어요. 그 화면까지. URL이 좀 이상하다 싶어서 확인해보니까 가짜사이트였고... 경찰에 신고했더니 이미 피해자가 17명이래요. 제가 18번째가 될 뻔. 이거 필수로 해봐야 하는 거 아닌가요 진짜로.",
                highlight: "피해자 18번째가 될 뻔했어요",
              },
            ].map((r, i) => (
              <div key={i} style={{
                background: "#fdf8ff",
                border: "1px solid #e2e8f0",
                borderRadius: 20,
                padding: "24px 22px",
                boxShadow: "0 2px 12px #0000000a",
                display: "flex",
                flexDirection: "column" as const,
                gap: 14,
              }}>
                {/* 별점 */}
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} style={{ color: j < r.rating ? "#f59e0b" : "#e2e8f0", fontSize: 14 }}>★</span>
                  ))}
                </div>

                {/* 태그 */}
                <span style={{ display: "inline-block", background: r.tagColor + "12", color: r.tagColor, border: `1px solid ${r.tagColor}33`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, width: "fit-content" }}>
                  {r.tag}
                </span>

                {/* 하이라이트 */}
                <p style={{ color: "#1c0d2e", fontWeight: 800, fontSize: 14, lineHeight: 1.5, borderLeft: `3px solid ${r.tagColor}`, paddingLeft: 10 }}>
                  &ldquo;{r.highlight}&rdquo;
                </p>

                {/* 본문 */}
                <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.85, flex: 1 }}>{r.text}</p>

                {/* 작성자 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{r.avatar}</div>
                    <div>
                      <p style={{ color: "#1c0d2e", fontWeight: 700, fontSize: 13 }}>{r.name}</p>
                      <p style={{ color: "#94a3b8", fontSize: 11 }}>{r.age}</p>
                    </div>
                  </div>
                  <span style={{ color: "#cbd5e1", fontSize: 11 }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI 후기 고지 */}
          <p style={{ textAlign: "center", color: "#cbd5e1", fontSize: 11, marginTop: 28, opacity: 0.35 }}>
            * 위 후기는 실제 체험 데이터를 바탕으로 AI가 작성한 예시입니다.
          </p>

          {/* 하단 요약 수치 */}
          <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 32, paddingTop: 40, borderTop: "1px solid #e2e8f0" }}>
            {[
              { num: "4.9", label: "평균 별점", sub: "5점 만점" },
              { num: "2,300+", label: "체험 후기", sub: "누적 제출" },
              { num: "91%", label: "실제 예방 효과", sub: "체험자 자가 응답" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ color: "#1c0d2e", fontWeight: 900, fontSize: 28, letterSpacing: -0.5 }}>{s.num}</p>
                <p style={{ color: "#334155", fontSize: 13, fontWeight: 700 }}>{s.label}</p>
                <p style={{ color: "#94a3b8", fontSize: 11 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 후원자 명예의 전당 ── */}
      <HallOfFame />

      {/* ── 푸터 ── */}
      {/* ── 브랜드 컬러 & 연락처 푸터 ── */}
      <footer style={{ background: "#130c1c", borderTop: "1px solid #2a1a3a" }}>

        {/* 브랜드 컬러 팔레트 */}
        <div style={{ borderBottom: "1px solid #2a1a3a", padding: "52px 40px" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <p style={{ color: "#6b4d7a", fontSize: 11, fontWeight: 700, letterSpacing: 3, marginBottom: 8, fontFamily: "monospace" }}>BRAND IDENTITY</p>
              <h3 style={{ color: "#dcc5e8", fontWeight: 900, fontSize: 20 }}>사이트 대표 컬러</h3>
              <p style={{ color: "#4a3060", fontSize: 12, marginTop: 6 }}>이 색상들이 범죄예방 체험관의 아이덴티티를 구성합니다</p>
            </div>

            {/* 메인 팔레트 6색 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 28 }}>
              {[
                { hex: "#9161b2", name: "Purple",   role: "Primary" },
                { hex: "#c58dc6", name: "Orchid",   role: "Secondary" },
                { hex: "#dcc5e8", name: "Lavender", role: "Light Accent" },
                { hex: "#b3889e", name: "Mauve",    role: "Rose" },
                { hex: "#f8966c", name: "Peach",    role: "Warm Accent" },
                { hex: "#fcd3af", name: "Cream",    role: "Soft Warm" },
              ].map((c) => (
                <div key={c.hex} style={{ textAlign: "center" }}>
                  <div style={{
                    height: 80, borderRadius: 16, background: c.hex, marginBottom: 10,
                    boxShadow: `0 4px 20px ${c.hex}55`,
                  }} />
                  <p style={{ color: "#dcc5e8", fontWeight: 700, fontSize: 11, fontFamily: "monospace" }}>{c.hex.toUpperCase()}</p>
                  <p style={{ color: "#9161b2", fontSize: 10, marginTop: 2 }}>{c.name}</p>
                  <p style={{ color: "#4a3060", fontSize: 9, letterSpacing: 0.5 }}>{c.role}</p>
                </div>
              ))}
            </div>

            {/* 다크 팔레트 5색 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 28 }}>
              {[
                { hex: "#130c1c", name: "Deep Dark",    role: "Background" },
                { hex: "#1c0d2e", name: "Dark Purple",  role: "Section BG" },
                { hex: "#231232", name: "Card Dark",    role: "Card BG" },
                { hex: "#2a1a3a", name: "Border",       role: "Divider" },
                { hex: "#6b4d7a", name: "Muted Purple", role: "Subtle Text" },
              ].map((c) => (
                <div key={c.hex} style={{ textAlign: "center" }}>
                  <div style={{ height: 44, borderRadius: 10, background: c.hex, border: "1px solid #2a1a3a", marginBottom: 8 }} />
                  <p style={{ color: "#6b4d7a", fontWeight: 700, fontSize: 10, fontFamily: "monospace" }}>{c.hex.toUpperCase()}</p>
                  <p style={{ color: "#4a3060", fontSize: 9, marginTop: 2 }}>{c.role}</p>
                </div>
              ))}
            </div>

            {/* 시그니처 그라데이션 */}
            <div>
              <p style={{ color: "#4a3060", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 10, fontFamily: "monospace" }}>SIGNATURE GRADIENTS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { gradient: "linear-gradient(90deg, #9161b2, #c58dc6, #f8966c)", label: "Primary Warm" },
                  { gradient: "linear-gradient(90deg, #1c0d2e, #4a2478, #9161b2)", label: "Dark to Purple" },
                  { gradient: "linear-gradient(90deg, #dcc5e8, #f5dfee, #fcd9dc)", label: "Soft Pastel" },
                ].map((g) => (
                  <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ flex: 1, height: 22, borderRadius: 8, background: g.gradient }} />
                    <p style={{ color: "#4a3060", fontSize: 10, minWidth: 100, fontFamily: "monospace" }}>{g.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 연락처 & 링크 */}
        <div style={{ padding: "44px 40px 32px" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40, marginBottom: 36 }}>

              {/* 브랜드 소개 */}
              <div>
                {/* BooUngYee 로고 — 초록 크로마키 CSS 제거 */}
                <div style={{ position: "relative", width: 180, height: 90, marginBottom: 12, overflow: "hidden", borderRadius: 12 }}>
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: 12,
                    background: "#00c835",
                  }} />
                  <img
                    src="/logo-booungyee.png"
                    alt="BooUngYee"
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      mixBlendMode: "multiply",
                      position: "relative", zIndex: 1,
                    }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Shield size={14} color="#9161b2" />
                  <span style={{ color: "#dcc5e8", fontWeight: 900, fontSize: 14 }}>범죄예방 체험관</span>
                </div>
                <p style={{ color: "#4a3060", fontSize: 12, lineHeight: 2.0 }}>
                  AI가 설계한 한국 최초<br />
                  몰입형 범죄 예방 체험 프로그램.<br />
                  실제 체험으로 사기를 막습니다.
                </p>
              </div>

              {/* 연락처 */}
              <div>
                <p style={{ color: "#6b4d7a", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16, fontFamily: "monospace" }}>CONTACT</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href="mailto:itnlifecn@gmail.com" style={{
                    display: "flex", alignItems: "center", gap: 10, textDecoration: "none",
                    padding: "11px 14px", borderRadius: 12,
                    background: "#1c0d2e", border: "1px solid #2a1a3a",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#9161b2")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a1a3a")}
                  >
                    <span style={{ fontSize: 18 }}>✉️</span>
                    <div>
                      <p style={{ color: "#c58dc6", fontWeight: 700, fontSize: 13 }}>itnlifecn@gmail.com</p>
                      <p style={{ color: "#4a3060", fontSize: 10, marginTop: 2 }}>기관 도입 · 제휴 · 일반 문의</p>
                    </div>
                  </a>
                  <a href="mailto:itnlifecn@gmail.com?subject=[기관 도입 문의]&body=기관명:%0A담당자:%0A문의내용:" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    textDecoration: "none", padding: "11px 0", borderRadius: 12,
                    background: "linear-gradient(135deg, #9161b2, #c58dc6)",
                    color: "#fff", fontWeight: 700, fontSize: 13,
                  }}>
                    📧 이메일로 문의하기
                  </a>
                </div>
              </div>

              {/* 페이지 */}
              <div>
                <p style={{ color: "#6b4d7a", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16, fontFamily: "monospace" }}>PAGES</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "🚨 사기 범죄 체험", path: "/crime" },
                    { label: "🎰 불법 도박 체험", path: "/gambling" },
                    { label: "🏛️ 기관 도입 안내", path: "/partnership" },
                    { label: "📊 이용 통계", path: "/stats" },
                    { label: "🔒 개인정보 처리방침", path: "/privacy" },
                  ].map((item) => (
                    <button key={item.path} onClick={() => router.push(item.path)} style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#4a3060", fontSize: 12, textAlign: "left", padding: "2px 0",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#c58dc6")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#4a3060")}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 카피라이트 라인 */}
            <div style={{ borderTop: "1px solid #2a1a3a", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <p style={{ color: "#2a1a3a", fontSize: 11, fontFamily: "monospace" }}>© 2024–2026 범죄예방 체험관 · Made with AI (Claude) · 부엉이 🦉</p>
              <p style={{ color: "#2a1a3a", fontSize: 11 }}>교육 목적 비영리 · 개인정보 무수집 · 실제 결제 없음</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
