"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  66%  { box-shadow: 0 0 14px 4px #2563ebaa; border-color: #2563eb; }
  83%  { box-shadow: 0 0 14px 4px #9333eaaa; border-color: #9333ea; }
  100% { box-shadow: 0 0 14px 4px #ff0000aa; border-color: #ff0000; }
}
@keyframes rainbow-text {
  0%   { color: #ff4444; }
  16%  { color: #ff8800; }
  33%  { color: #d4a000; }
  50%  { color: #16a34a; }
  66%  { color: #2563eb; }
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
    { org: t("rpt_police_org", lang), number: "112",  desc: t("rpt_police_desc", lang), color: "#2563eb" },
    { org: t("rpt_fss_org", lang),    number: "1332", desc: t("rpt_fss_desc", lang),    color: "#0891b2" },
    { org: t("rpt_kisa_org", lang),   number: "118",  desc: t("rpt_kisa_desc", lang),   color: "#059669" },
    { org: t("rpt_gamble_org", lang), number: "1336", desc: t("rpt_gamble_desc", lang), color: "#7c3aed" },
  ];

  const GUIDE_TABS = [
    {
      id: "parents",
      label: "👴👵 " + t("popup2_tab1", lang),
      subtitle: lang === "ko" ? "자녀가 부모님을 도와드리는 방법" : lang === "en" ? "How children can help their parents" : lang === "ja" ? "子どもが親を助ける方法" : lang === "zh" ? "子女帮助父母的方法" : lang === "vi" ? "Cách con cái giúp cha mẹ" : "Cómo los hijos ayudan a sus padres",
      color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe",
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
    <div style={{ minHeight: "100vh", background: "#f0f4ff", color: "#1e293b" }}>
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
            background: "#fff", borderRadius: 24, padding: "36px 36px 32px",
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
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #2563eb, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                🛡️
              </div>
              <div>
                <p style={{ color: "#0f172a", fontWeight: 900, fontSize: 18 }}>{t("popup1_title", lang)}</p>
                <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 600 }}>{t("popup1_sub", lang)}</p>
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
                  background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                  color: "#fff", border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: 14,
                  boxShadow: "0 4px 16px #2563eb30",
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
            background: "#fff", borderRadius: 24, padding: "32px 32px 28px",
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
            <p style={{ color: "#0f172a", fontWeight: 900, fontSize: 20, marginBottom: 6 }}>{t("popup2_who", lang)}</p>
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
                      <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{step.title}</p>
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
          background: "#fff", border: "2px solid #ff4444",
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
            background: "linear-gradient(135deg, #2563eb, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#1e293b", letterSpacing: -0.3 }}>{t("nav_brand", lang)}</span>
            <span style={{
              marginLeft: 8, fontSize: 10, fontWeight: 600, color: "#2563eb",
              background: "#eff6ff", padding: "2px 7px", borderRadius: 20,
              border: "1px solid #bfdbfe",
            }}>{t("nav_edu_badge", lang)}</span>
          </div>
        </div>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="#scenarios" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{t("nav_scenarios", lang)}</a>
          <a href="#how" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{t("nav_howto", lang)}</a>
          <a href="#report" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{t("nav_numbers", lang)}</a>
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
              background: "linear-gradient(135deg, #2563eb, #4f46e5)",
              color: "#fff", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 700,
              boxShadow: "0 2px 12px #2563eb40",
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
            background: "linear-gradient(135deg, #2563eb, #4f46e5)",
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

          <h1 style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.15, marginBottom: 20, letterSpacing: -1.5, color: "#0f172a" }}>
            {t("hero_title1", lang)}<br />
            <span style={{
              background: "linear-gradient(90deg, #2563eb, #7c3aed)",
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
                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                color: "#fff", border: "none", cursor: "pointer",
                fontSize: 15, fontWeight: 700,
                boxShadow: "0 4px 20px #2563eb40",
              }}
            >
              {t("hero_cta", lang)} <ChevronRight size={16} />
            </button>
            <a href="#scenarios" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "15px 22px", borderRadius: 14,
              background: "#fff", color: "#475569",
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
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: 18, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <Shield size={18} color="#2563eb" style={{ flexShrink: 0 }} />
            <p style={{ color: "#1d4ed8", fontSize: 13, lineHeight: 1.5 }}>
              {t("hero_edu_full", lang)}
            </p>
          </div>
        </div>
      </section>

      {/* ── 홍보 영상 ── */}
      <section style={{
        background: "#0a0a0f", borderTop: "1px solid #1e1e2e",
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
                  background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900, color: "#fff", flexShrink: 0,
                }}>1</div>
                <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15 }}>최초 홍보 영상</p>
                <span style={{ color: "#374151", fontSize: 11, background: "#1e1e2e", border: "1px solid #374151", borderRadius: 20, padding: "2px 10px" }}>2024</span>
              </div>
              <div style={{
                position: "relative", width: "100%", paddingTop: "56.25%",
                borderRadius: 16, overflow: "hidden",
                boxShadow: "0 16px 48px #00000060",
                border: "1px solid #1e1e2e",
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
                  src="https://www.youtube.com/embed/Be7nrFNTid4"
                  title="범죄예방 체험관 홍보영상 2"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                />
              </div>
            </div>

          </div>

          {/* ── 업데이트 내역 ── */}
          <div style={{ marginTop: 56, borderTop: "1px solid #1e1e2e", paddingTop: 48 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <p style={{ color: "#6b7280", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>CHANGELOG</p>
              <h3 style={{ color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>업데이트 내역</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                {
                  version: "v1.3",
                  date: "2025.06",
                  badge: "최신",
                  badgeColor: "#4ade80",
                  badgeBg: "#052e16",
                  items: [
                    "📞 전화 사기 체험 — 삼성·아이폰 통화 UI + AI 목소리 (TTS) 추가",
                    "🔗 링크·다운로드 사기 시나리오 추가 (가짜 개인정보 해킹 애니메이션)",
                    "💬 AI 대화 자연스러움 개선 — ZETA 앱 스타일 실제 대화형",
                    "⚙️ 자극 강도 설정 추가 (순화 / 보통 / 실전)",
                    "🏆 거절 3회 시 축하 메시지 + 결과 화면 분기",
                    "🔢 시나리오 9개 → 10개로 확대",
                  ],
                },
                {
                  version: "v1.2",
                  date: "2025.04",
                  badge: null,
                  badgeColor: "#60a5fa",
                  badgeBg: "#0a1628",
                  items: [
                    "🎰 불법도박 시나리오 추가",
                    "🌏 10개 언어 다국어 지원 추가",
                    "📊 이용 통계 실시간 표시",
                    "👑 명예의 전당 기능 추가",
                  ],
                },
                {
                  version: "v1.1",
                  date: "2025.02",
                  badge: null,
                  badgeColor: "#a78bfa",
                  badgeBg: "#1e1b4b",
                  items: [
                    "💸 가짜 송금 애니메이션 및 결과 화면 개선",
                    "📱 모바일 최적화",
                    "🏦 가짜 은행 앱 UI 추가 (KB·카카오·토스)",
                  ],
                },
                {
                  version: "v1.0",
                  date: "2024.11",
                  badge: null,
                  badgeColor: "#6b7280",
                  badgeBg: "#111",
                  items: [
                    "🚀 서비스 최초 출시",
                    "📋 8가지 기본 사기 시나리오",
                    "🤖 Gemini AI 기반 범인 대화 엔진",
                  ],
                },
              ].map((log, i) => (
                <div key={i} style={{ display: "flex", gap: 20, paddingBottom: 28, position: "relative" }}>
                  {/* 타임라인 선 */}
                  {i < 3 && (
                    <div style={{
                      position: "absolute", left: 39, top: 32, bottom: 0,
                      width: 1, background: "#1e1e2e",
                    }} />
                  )}
                  {/* 버전 배지 */}
                  <div style={{ flexShrink: 0, width: 80, textAlign: "center" }}>
                    <div style={{
                      background: log.badgeBg, border: `1px solid ${log.badgeColor}44`,
                      borderRadius: 10, padding: "6px 0", marginBottom: 4,
                    }}>
                      <p style={{ color: log.badgeColor, fontWeight: 900, fontSize: 13 }}>{log.version}</p>
                    </div>
                    <p style={{ color: "#374151", fontSize: 10 }}>{log.date}</p>
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
                  {/* 항목들 */}
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    {log.items.map((item, j) => (
                      <p key={j} style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.8 }}>{item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 제작 목적 & 실제 통계 ── */}
      <section id="why" style={{
        background: "#fff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0",
        padding: "80px 40px",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>

          {/* 섹션 헤더 */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>WHY WE BUILT THIS</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#0f172a", marginBottom: 14 }}>
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
                  <p style={{ color: "#a78bfa", fontSize: 11 }}>
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
                    border: row.highlight ? "1px solid #c4b5fd" : "none",
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
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
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
                { n: "1336", l: lang === "ko" ? "도박중독 24시간 무료 상담 전화" : "Gambling addiction 24h free helpline", c: "#a78bfa" },
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
            background: "linear-gradient(135deg, #f0fdf4, #eff6ff)",
            border: "1px solid #bbf7d0",
            borderRadius: 20, padding: "32px 36px", marginBottom: 24,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #2563eb, #059669)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26,
              }}>
                🙋
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                  <p style={{ color: "#0f172a", fontWeight: 800, fontSize: 18 }}>
                    {lang === "ko" ? "만든 사람 이야기" : lang === "en" ? "About the Creator" : lang === "ja" ? "作成者について" : lang === "zh" ? "关于创作者" : lang === "vi" ? "Về người tạo ra" : "Sobre el creador"}
                  </p>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" }}>
                    {lang === "ko" ? "일반 시민 제작" : lang === "en" ? "Made by a Citizen" : lang === "ja" ? "一般市民制作" : lang === "zh" ? "普通市民制作" : lang === "vi" ? "Người dân bình thường tạo ra" : "Hecho por un ciudadano"}
                  </span>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>
                    AI Claude
                  </span>
                </div>
                <p style={{ color: "#334155", fontSize: 15, lineHeight: 1.95, marginBottom: 20 }}>
                  {lang === "ko" ? <>저는 법률 전문가도, 경찰도 아닌 <strong style={{ color: "#0f172a" }}>평범한 일반 시민</strong>입니다.<br />보이스피싱에 속아 전재산을 잃고, 도박 빚으로 삶을 포기하는<br />이웃들을 보며 &ldquo;내가 뭔가 할 수 있지 않을까&rdquo; 하는 마음으로 시작했습니다.<br /><br /><strong style={{ color: "#0f172a" }}>Anthropic의 AI Claude</strong>와 함께 직접 개발한 이 프로그램이<br />단 한 명이라도 범죄 피해로부터 지킬 수 있다면, 그걸로 충분합니다.</> : lang === "en" ? <>I&apos;m not a legal expert or police officer — just an <strong style={{ color: "#0f172a" }}>ordinary citizen</strong>.<br />Seeing neighbors lose everything to scams and gambling debt made me think:<br />&ldquo;Can I do something?&rdquo;<br /><br />Built with <strong style={{ color: "#0f172a" }}>Anthropic&apos;s AI Claude</strong>, I hope this program<br />protects even one person from becoming a victim.</> : lang === "ja" ? <>私は法律の専門家でも警察官でもなく、<strong style={{ color: "#0f172a" }}>ごく普通の市民</strong>です。<br />詐欺で全財産を失い、ギャンブル借金で人生を諦める隣人を見て<br />「何かできないか」という思いで始めました。<br /><br /><strong style={{ color: "#0f172a" }}>AnthropicのAI Claude</strong>と一緒に開発したこのプログラムが<br />一人でも犯罪被害から守れるなら、それで十分です。</> : lang === "zh" ? <>我不是法律专家，也不是警察，只是一名<strong style={{ color: "#0f172a" }}>普通市民</strong>。<br />看到邻居因诈骗失去一切，因赌博债务放弃生命，<br />我想：「我能做些什么吗？」<br /><br />与<strong style={{ color: "#0f172a" }}>Anthropic的AI Claude</strong>共同开发的这个程序，<br />希望能保护哪怕一个人免受犯罪侵害。</> : lang === "vi" ? <>Tôi không phải chuyên gia pháp luật hay cảnh sát — chỉ là một <strong style={{ color: "#0f172a" }}>công dân bình thường</strong>.<br />Thấy hàng xóm mất tất cả vì lừa đảo và nợ cờ bạc, tôi nghĩ:<br />&ldquo;Mình có thể làm gì đó không?&rdquo;<br /><br />Được phát triển cùng <strong style={{ color: "#0f172a" }}>AI Claude của Anthropic</strong>,<br />tôi hy vọng chương trình này bảo vệ được dù chỉ một người.</> : <>No soy experto legal ni policía — solo un <strong style={{ color: "#0f172a" }}>ciudadano ordinario</strong>.<br />Ver a vecinos perder todo por estafas y deudas de juego me hizo pensar:<br />&ldquo;¿Puedo hacer algo?&rdquo;<br /><br />Desarrollado con <strong style={{ color: "#0f172a" }}>AI Claude de Anthropic</strong>,<br />espero que este programa proteja aunque sea a una persona.</>}
                </p>
              </div>
            </div>
          </div>

          {/* 기관 협력 배너 */}
          <div style={{
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: 20, padding: "28px 32px",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Shield size={18} color="#2563eb" />
                  <p style={{ color: "#1d4ed8", fontWeight: 800, fontSize: 16 }}>
                    {lang === "ko" ? "국가기관과 함께하고 싶습니다" : lang === "en" ? "We want to partner with public institutions" : lang === "ja" ? "国家機関と連携したいです" : lang === "zh" ? "我们希望与公共机构合作" : lang === "vi" ? "Chúng tôi muốn hợp tác với các cơ quan nhà nước" : "Queremos colaborar con instituciones públicas"}
                  </p>
                </div>
                <p style={{ color: "#3b82f6", fontSize: 14, lineHeight: 1.8 }}>
                  {lang === "ko" ? <>{lang === "ko" && "이 프로그램은 "}<strong style={{ color: "#1d4ed8" }}>경찰청, 교육청, 금융감독원, 지자체</strong>{lang === "ko" ? " 등 공공기관과의 협력을 희망합니다." : ""}</> : lang === "en" ? <>This program seeks collaboration with <strong style={{ color: "#1d4ed8" }}>the police, schools, financial regulators, and local governments</strong>.</> : lang === "ja" ? <>このプログラムは<strong style={{ color: "#1d4ed8" }}>警察庁、教育委員会、金融監督院、地方自治体</strong>との協力を希望します。</> : lang === "zh" ? <>本程序寻求与<strong style={{ color: "#1d4ed8" }}>警察局、教育局、金融监督院、地方政府</strong>合作。</> : lang === "vi" ? <>Chương trình này mong muốn hợp tác với <strong style={{ color: "#1d4ed8" }}>cảnh sát, trường học, cơ quan tài chính và chính quyền địa phương</strong>.</> : <>Este programa busca colaborar con <strong style={{ color: "#1d4ed8" }}>policía, escuelas, reguladores financieros y gobiernos locales</strong>.</>}
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
                    background: "#fff", borderRadius: 10, padding: "10px 16px",
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
              marginTop: 20, paddingTop: 18, borderTop: "1px solid #bfdbfe",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>📧</span>
              <p style={{ color: "#3b82f6", fontSize: 13 }}>
                {lang === "ko" ? "협력·도입 문의:" : lang === "en" ? "Partnership inquiry:" : lang === "ja" ? "協力・導入のお問い合わせ:" : lang === "zh" ? "合作咨询:" : lang === "vi" ? "Liên hệ hợp tác:" : "Consulta de alianza:"}{" "}
                <strong style={{ color: "#1d4ed8" }}>itnlifecn@gmail.com</strong>
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
            <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>HOW IT WORKS</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#0f172a" }}>{t("how_title", lang)}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: <BookOpen size={22} color="#2563eb" />, bg: "#eff6ff", border: "#bfdbfe", step: "01", titleKey: "step1_title" as const, descKey: "step1_desc" as const },
              { icon: <Phone size={22} color="#7c3aed" />, bg: "#faf5ff", border: "#ddd6fe", step: "02", titleKey: "step2_title" as const, descKey: "step2_desc" as const },
              { icon: <Shield size={22} color="#059669" />, bg: "#f0fdf4", border: "#bbf7d0", step: "03", titleKey: "step3_title" as const, descKey: "step3_desc" as const },
            ].map((item) => (
              <div key={item.step} style={{
                background: "#fff", border: "1px solid #f1f5f9",
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
                <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{t(item.titleKey, lang)}</p>
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
            <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>SCENARIOS</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#0f172a" }}>{t("sc_section_title", lang)}</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 10 }}>{t("sc_section_sub", lang)}</p>
          </div>
          <button
            onClick={() => router.push("/crime")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 10,
              background: "#fff", color: "#2563eb",
              border: "1px solid #bfdbfe", cursor: "pointer", fontSize: 13, fontWeight: 600,
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
              onClick={() => router.push(s.id === "illegal-gambling" ? "/gambling" : `/crime/${s.id}`)}
              style={{
                background: "#fff", border: "1px solid #f1f5f9",
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
              <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 15, marginBottom: 6, lineHeight: 1.4 }}>{s.title}</p>
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

      {/* ── 신고 번호 ── */}
      <section id="report" style={{
        background: "#fff", borderTop: "1px solid #e2e8f0",
        padding: "72px 40px",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>EMERGENCY</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#0f172a" }}>{t("rpt_section_title", lang)}</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 10 }}>{t("rpt_section_sub", lang)}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {REPORT_NUMBERS.map((r) => (
              <a
                key={r.number}
                href={`tel:${r.number}`}
                style={{
                  display: "block", background: "#fff",
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
      <section style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "52px 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
            borderRadius: 24, padding: "40px 44px",
            display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: 28 }}>🏛️</span>
                <p style={{ color: "#93c5fd", fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>INSTITUTIONAL SALES</p>
              </div>
              <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 26, letterSpacing: -0.5, marginBottom: 14, lineHeight: 1.4 }}>
                {lang === "ko" ? <>교육부·경찰청·지자체·학교 등<br />국가 교육기관에 납품 가능합니다</> : lang === "en" ? <>Available for Ministry of Education, Police,<br />Local Governments, Schools & More</> : lang === "ja" ? <>教育部・警察庁・地方自治体・学校等<br />国家教育機関への提供が可能です</> : lang === "zh" ? <>可向教育部、警察局、地方政府、<br />学校等国家教育机构供应</> : lang === "vi" ? <>Có thể cung cấp cho Bộ Giáo dục, Cảnh sát,<br />Chính quyền địa phương, Trường học, v.v.</> : <>Disponible para Ministerio de Educación, Policía,<br />Gobiernos Locales, Escuelas y más</>}
              </h2>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.9, marginBottom: 20 }}>
                {lang === "ko" ? <>범죄 예방 교육 콘텐츠로 공공기관·교육청·복지관·기업 등에 도입을 원하시면 이메일로 연락 주세요.<br /><strong style={{ color: "#60a5fa" }}>비영리·공익 목적 기관은 무료 제공을 우선합니다.</strong></> : lang === "en" ? <>Contact us via email to adopt this for public agencies, schools, welfare centers, or companies.<br /><strong style={{ color: "#60a5fa" }}>Non-profit and public interest institutions are given free access first.</strong></> : lang === "ja" ? <>犯罪予防教育コンテンツとして公共機関・教育委員会・福祉館・企業等への導入を希望される方はメールでご連絡ください。<br /><strong style={{ color: "#60a5fa" }}>非営利・公益目的機関は無料提供を優先します。</strong></> : lang === "zh" ? <>如需将犯罪预防教育内容引入公共机构、教育局、福利中心或企业，请通过电子邮件联系我们。<br /><strong style={{ color: "#60a5fa" }}>非营利及公益目的机构优先免费提供。</strong></> : lang === "vi" ? <>Liên hệ qua email để áp dụng cho cơ quan công cộng, trường học, trung tâm phúc lợi hoặc công ty.<br /><strong style={{ color: "#60a5fa" }}>Các tổ chức phi lợi nhuận và công ích được ưu tiên miễn phí.</strong></> : <>Contáctanos por email para adoptar esto en agencias públicas, escuelas, centros de bienestar o empresas.<br /><strong style={{ color: "#60a5fa" }}>Las instituciones sin fines de lucro tienen acceso gratuito primero.</strong></>}
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20, padding: "28px 32px", minWidth: 260, flexShrink: 0,
            }}>
              <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>
                {lang === "ko" ? "문의 · 도입 연락처" : lang === "en" ? "Contact & Inquiry" : lang === "ja" ? "お問い合わせ" : lang === "zh" ? "联系方式" : lang === "vi" ? "Liên hệ" : "Contacto"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>
                    {lang === "ko" ? "기관 도입 · 납품 문의" : lang === "en" ? "Institutional adoption" : lang === "ja" ? "機関導入・納品" : lang === "zh" ? "机构采购" : lang === "vi" ? "Hợp tác tổ chức" : "Adopción institucional"}
                  </p>
                  <a href="mailto:itnlifecn@gmail.com" style={{ color: "#60a5fa", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
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
                    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
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
      <div style={{ background: "#0f172a", padding: "32px 40px" }}>
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
              background: "linear-gradient(135deg, #534AB7, #7c3aed)",
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

      {/* ── 후원자 명예의 전당 ── */}
      <HallOfFame />

      {/* ── 푸터 ── */}
      <footer style={{
        borderTop: "1px solid #1e293b", padding: "24px 40px",
        background: "#0f172a",
      }}>
        <div style={{
          maxWidth: 1140, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={14} color="#2563eb" />
            <span style={{ color: "#475569", fontSize: 13 }}>{t("footer_brand_text", lang)}</span>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <button onClick={() => router.push("/privacy")} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", fontSize: 12, textDecoration: "underline" }}>
              {t("footer_privacy", lang)}
            </button>
            <button onClick={() => router.push("/privacy")} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", fontSize: 12, textDecoration: "underline" }}>
              {t("footer_terms", lang)}
            </button>
            <button onClick={() => router.push("/privacy")} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", fontSize: 12, textDecoration: "underline" }}>
              {t("footer_disclaimer", lang)}
            </button>
            <button onClick={() => router.push("/partnership")} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", fontSize: 12, textDecoration: "underline" }}>
              {t("footer_contact", lang)}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
