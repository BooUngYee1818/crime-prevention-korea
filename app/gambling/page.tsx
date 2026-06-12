"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";

// ─── 교묘하게 숨겨진 힌트: 사이트 이름에 "도박방지예방시뮬레이션"이 포함됨 ───
// 각 사이트 이름의 첫 글자를 모으면: 도/박/방/지/예/방/시/뮬/레/이/션
// hover시 작은 안내문 노출, 배경에 초저투명도 워터마크

// ── 숨겨진 워터마크 컴포넌트 ──
function HiddenWatermark({ watermarkText }: { watermarkText: string }) {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none",
      zIndex: 0, overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* 대각선 워터마크 — opacity 0.025로 거의 안 보임 */}
      <div style={{
        fontSize: 22, fontWeight: 900, color: "#fff",
        opacity: 0.025, transform: "rotate(-35deg)",
        letterSpacing: 4, userSelect: "none", whiteSpace: "nowrap",
        lineHeight: 3,
      }}>
        {watermarkText}<br/>
        {watermarkText}<br/>
        {watermarkText}
      </div>
    </div>
  );
}

export default function GamblingPortalPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [showWarning, setShowWarning] = useState(true);
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);

  const marqueeText =
    lang === "ko"
      ? "🎰 모든베팅가능 무제재 ★ 환전무제한 고액전용 ★ 신규 첫충 40% ★ 무한 15% ★ 실시간 스포츠 ★ 카지노 슬롯 ★ 가입코드 입력시 추가 보너스 ★ "
      : lang === "en"
      ? "🎰 All Bets Allowed No Restrictions ★ Unlimited Withdrawal VIP Only ★ New 40% First Deposit ★ Unlimited 15% ★ Live Sports ★ Casino Slots ★ Bonus with signup code ★ "
      : lang === "ja"
      ? "🎰 全ベット可能 制限なし ★ 出金無制限 高額専用 ★ 新規初回40% ★ 無限15% ★ リアルタイムスポーツ ★ カジノスロット ★ 登録コードで追加ボーナス ★ "
      : lang === "zh"
      ? "🎰 所有投注可用 无限制 ★ 无限提款 高额专属 ★ 新用户首充40% ★ 无限15% ★ 实时体育 ★ 赌场老虎机 ★ 注册码额外奖励 ★ "
      : lang === "vi"
      ? "🎰 Tất cả cược được phép Không hạn chế ★ Rút tiền không giới hạn Dành cho VIP ★ Nạp lần đầu 40% ★ Không giới hạn 15% ★ Thể thao trực tiếp ★ Slot casino ★ Thưởng thêm khi nhập mã ★ "
      : "🎰 Todas las apuestas permitidas Sin restricciones ★ Retiro ilimitado Solo VIP ★ 40% primer depósito ★ Ilimitado 15% ★ Deportes en vivo ★ Casino Slots ★ Bono con código de registro ★ ";

  const FAKE_SITES = [
    {
      id: "dobakbangjicasino",
      name:
        lang === "ko" ? "도박방지카지노" : lang === "en" ? "PreventGambling Casino" : lang === "ja" ? "ギャンブル防止カジノ" : lang === "zh" ? "防赌博赌场" : lang === "vi" ? "Casino Phòng Ngừa Cờ Bạc" : "Casino Prevención",
      display:
        lang === "ko" ? "도박방지★" : lang === "en" ? "PreventBet★" : lang === "ja" ? "防止ベット★" : lang === "zh" ? "防赌★" : lang === "vi" ? "PhòngCờ★" : "Prevenir★",
      sub: "CASINO",
      code: "7474",
      bonus:
        lang === "ko" ? "첫충 40% 카지노 1.2%" : lang === "en" ? "First Dep. 40% Casino 1.2%" : lang === "ja" ? "初回40% カジノ1.2%" : lang === "zh" ? "首充40% 赌场1.2%" : lang === "vi" ? "Nạp đầu 40% Casino 1.2%" : "1er dep. 40% Casino 1.2%",
      extra:
        lang === "ko" ? "슬롯 4%" : lang === "en" ? "Slot 4%" : lang === "ja" ? "スロット4%" : lang === "zh" ? "老虎机4%" : lang === "vi" ? "Slot 4%" : "Slot 4%",
      color: ["#c00", "#ff0"],
      badge:
        lang === "ko" ? "신규" : lang === "en" ? "NEW" : lang === "ja" ? "新規" : lang === "zh" ? "新人" : lang === "vi" ? "MỚI" : "NUEVO",
      hint:
        lang === "ko" ? "도박방지" : lang === "en" ? "GamblingPrevention" : lang === "ja" ? "ギャンブル防止" : lang === "zh" ? "防赌博" : lang === "vi" ? "Phòng Cờ Bạc" : "PrevenciónJuego",
    },
    {
      id: "yebangsports",
      name:
        lang === "ko" ? "예방스포츠벳" : lang === "en" ? "Prevention SportsBet" : lang === "ja" ? "予防スポーツベット" : lang === "zh" ? "预防体育投注" : lang === "vi" ? "Phòng Ngừa SportsBet" : "Prevención SportsBet",
      display:
        lang === "ko" ? "예방✦스포츠" : lang === "en" ? "Prevent✦Sports" : lang === "ja" ? "予防✦スポーツ" : lang === "zh" ? "预防✦体育" : lang === "vi" ? "PhòngNgừa✦Thể Thao" : "Prevención✦Deportes",
      sub: "SPORTS BET",
      code: "9696",
      bonus:
        lang === "ko" ? "매충 5% 페이백" : lang === "en" ? "Every Dep. 5% Cashback" : lang === "ja" ? "毎回5%キャッシュバック" : lang === "zh" ? "每次充值5%返现" : lang === "vi" ? "Mỗi nạp 5% Hoàn tiền" : "Cada dep. 5% Cashback",
      extra:
        lang === "ko" ? "도박중독상담 1336" : lang === "en" ? "Gambling Addiction Hotline 1336" : lang === "ja" ? "ギャンブル依存相談 1336" : lang === "zh" ? "赌博成瘾咨询 1336" : lang === "vi" ? "Tư vấn nghiện cờ bạc 1336" : "Línea adicción al juego 1336",
      color: ["#003", "#06f"],
      badge: "HOT",
      hint:
        lang === "ko" ? "예방" : lang === "en" ? "Prevention" : lang === "ja" ? "予防" : lang === "zh" ? "预防" : lang === "vi" ? "Phòng Ngừa" : "Prevención",
    },
    {
      id: "simulcasino",
      name:
        lang === "ko" ? "시뮬레이션카지노" : lang === "en" ? "Simulation Casino" : lang === "ja" ? "シミュレーションカジノ" : lang === "zh" ? "模拟赌场" : lang === "vi" ? "Casino Mô Phỏng" : "Casino Simulación",
      display:
        lang === "ko" ? "시뮬888" : lang === "en" ? "Simul888" : lang === "ja" ? "シミュ888" : lang === "zh" ? "模拟888" : lang === "vi" ? "MôPhỏng888" : "Simul888",
      sub: "SIMULATION CASINO",
      code: "1117",
      bonus:
        lang === "ko" ? "첫충 30% 무한 10%" : lang === "en" ? "First Dep. 30% Unlimited 10%" : lang === "ja" ? "初回30% 無制限10%" : lang === "zh" ? "首充30% 无限10%" : lang === "vi" ? "Nạp đầu 30% Không giới hạn 10%" : "1er dep. 30% Ilimitado 10%",
      extra:
        lang === "ko" ? "미니게임 최대 1.99" : lang === "en" ? "Mini Game up to 1.99" : lang === "ja" ? "ミニゲーム最大1.99" : lang === "zh" ? "小游戏最高1.99" : lang === "vi" ? "Mini Game tối đa 1.99" : "Mini Juego hasta 1.99",
      color: ["#050", "#0f0"],
      badge:
        lang === "ko" ? "인기" : lang === "en" ? "HOT" : lang === "ja" ? "人気" : lang === "zh" ? "热门" : lang === "vi" ? "PHỔ BIẾN" : "POPULAR",
      hint:
        lang === "ko" ? "시뮬레이션" : lang === "en" ? "Simulation" : lang === "ja" ? "シミュレーション" : lang === "zh" ? "模拟" : lang === "vi" ? "Mô Phỏng" : "Simulación",
    },
    {
      id: "cheyeomsports",
      name:
        lang === "ko" ? "체험스포츠카지노" : lang === "en" ? "Experience Sports Casino" : lang === "ja" ? "体験スポーツカジノ" : lang === "zh" ? "体验体育赌场" : lang === "vi" ? "Trải Nghiệm Sports Casino" : "Experiencia Sports Casino",
      display:
        lang === "ko" ? "체험하우스" : lang === "en" ? "Exp.House" : lang === "ja" ? "体験ハウス" : lang === "zh" ? "体验屋" : lang === "vi" ? "Nhà Trải Nghiệm" : "Casa Exp.",
      sub: "SPORTS & CASINO",
      code: "9912",
      bonus:
        lang === "ko" ? "페이백 1000만 골프 4%" : lang === "en" ? "Cashback 10M Golf 4%" : lang === "ja" ? "キャッシュバック1000万 ゴルフ4%" : lang === "zh" ? "返现1000万 高尔夫4%" : lang === "vi" ? "Hoàn tiền 10M Golf 4%" : "Cashback 10M Golf 4%",
      extra:
        lang === "ko" ? "카지노 무제한" : lang === "en" ? "Casino Unlimited" : lang === "ja" ? "カジノ無制限" : lang === "zh" ? "赌场无限制" : lang === "vi" ? "Casino Không Giới Hạn" : "Casino Ilimitado",
      color: ["#500", "#f60"],
      badge: "NEW",
      hint:
        lang === "ko" ? "체험" : lang === "en" ? "Experience" : lang === "ja" ? "体験" : lang === "zh" ? "体验" : lang === "vi" ? "Trải Nghiệm" : "Experiencia",
    },
    {
      id: "gyeonggobet",
      name:
        lang === "ko" ? "경고카지노" : lang === "en" ? "Warning Casino" : lang === "ja" ? "警告カジノ" : lang === "zh" ? "警告赌场" : lang === "vi" ? "Casino Cảnh Báo" : "Casino Advertencia",
      display:
        lang === "ko" ? "⚠경고벳" : lang === "en" ? "⚠WarningBet" : lang === "ja" ? "⚠警告ベット" : lang === "zh" ? "⚠警告投注" : lang === "vi" ? "⚠CảnhBáoBet" : "⚠AdvertenciaBet",
      sub: "WARNING CASINO",
      code: "5445",
      bonus:
        lang === "ko" ? "첫충 40% 무한 15%" : lang === "en" ? "First Dep. 40% Unlimited 15%" : lang === "ja" ? "初回40% 無制限15%" : lang === "zh" ? "首充40% 无限15%" : lang === "vi" ? "Nạp đầu 40% Không giới hạn 15%" : "1er dep. 40% Ilimitado 15%",
      extra:
        lang === "ko" ? "환전무제한 고액전용" : lang === "en" ? "Unlimited Withdrawal VIP Only" : lang === "ja" ? "出金無制限 高額専用" : lang === "zh" ? "无限提款 高额专属" : lang === "vi" ? "Rút tiền không giới hạn Dành VIP" : "Retiro ilimitado Solo VIP",
      color: ["#440", "#ff0"],
      badge: "VIP",
      hint:
        lang === "ko" ? "경고" : lang === "en" ? "Warning" : lang === "ja" ? "警告" : lang === "zh" ? "警告" : lang === "vi" ? "Cảnh Báo" : "Advertencia",
    },
    {
      id: "bangjihouse",
      name:
        lang === "ko" ? "방지하우스카지노" : lang === "en" ? "Prevention House Casino" : lang === "ja" ? "防止ハウスカジノ" : lang === "zh" ? "防止屋赌场" : lang === "vi" ? "Nhà Phòng Ngừa Casino" : "Casa Prevención Casino",
      display:
        lang === "ko" ? "방지하우스" : lang === "en" ? "PreventHouse" : lang === "ja" ? "防止ハウス" : lang === "zh" ? "防止屋" : lang === "vi" ? "Nhà Phòng Ngừa" : "Casa Prevención",
      sub: "PREVENTION HOUSE",
      code: "6644",
      bonus:
        lang === "ko" ? "신규 40% 무한 5%" : lang === "en" ? "New 40% Unlimited 5%" : lang === "ja" ? "新規40% 無制限5%" : lang === "zh" ? "新人40% 无限5%" : lang === "vi" ? "Mới 40% Không giới hạn 5%" : "Nuevo 40% Ilimitado 5%",
      extra:
        lang === "ko" ? "돌발 20% 페이백 15%" : lang === "en" ? "Surprise 20% Cashback 15%" : lang === "ja" ? "突発20% キャッシュバック15%" : lang === "zh" ? "突发20% 返现15%" : lang === "vi" ? "Bất ngờ 20% Hoàn tiền 15%" : "Sorpresa 20% Cashback 15%",
      color: ["#204", "#a0f"],
      badge:
        lang === "ko" ? "추천" : lang === "en" ? "TOP" : lang === "ja" ? "おすすめ" : lang === "zh" ? "推荐" : lang === "vi" ? "ĐỀ XUẤT" : "RECOM.",
      hint:
        lang === "ko" ? "방지" : lang === "en" ? "Prevention" : lang === "ja" ? "防止" : lang === "zh" ? "防止" : lang === "vi" ? "Phòng Ngừa" : "Prevención",
    },
    {
      id: "isimulbet",
      name:
        lang === "ko" ? "이건시뮬벳" : lang === "en" ? "This Is SimulBet" : lang === "ja" ? "これシミュベット" : lang === "zh" ? "这是模拟投注" : lang === "vi" ? "Đây Là SimulBet" : "Esto Es SimulBet",
      display:
        lang === "ko" ? "이건시뮬벳" : lang === "en" ? "ThisSimulBet" : lang === "ja" ? "これシミュベット" : lang === "zh" ? "这是模拟投注" : lang === "vi" ? "ĐâySimulBet" : "EstoSimulBet",
      sub: "SIMULATION BET",
      code: "2222",
      bonus:
        lang === "ko" ? "승급이벤트 최대 2천만원" : lang === "en" ? "Rank-up Event up to ₩20M" : lang === "ja" ? "昇格イベント最大2000万ウォン" : lang === "zh" ? "晋级活动最高2000万韩元" : lang === "vi" ? "Sự kiện thăng hạng tối đa 20M" : "Evento ascenso hasta ₩20M",
      extra:
        lang === "ko" ? "매충 50% 페이백" : lang === "en" ? "Every Dep. 50% Cashback" : lang === "ja" ? "毎回50%キャッシュバック" : lang === "zh" ? "每次充值50%返现" : lang === "vi" ? "Mỗi nạp 50% Hoàn tiền" : "Cada dep. 50% Cashback",
      color: ["#042", "#0f8"],
      badge: "LIVE",
      hint:
        lang === "ko" ? "이건시뮬" : lang === "en" ? "ThisIsSimul" : lang === "ja" ? "これシミュ" : lang === "zh" ? "这是模拟" : lang === "vi" ? "ĐâyLàMôPhỏng" : "EstoEsSimul",
    },
    {
      id: "yoniprevention",
      name:
        lang === "ko" ? "연예방카지노" : lang === "en" ? "Yeon Prevention Casino" : lang === "ja" ? "ヨン予防カジノ" : lang === "zh" ? "连预防赌场" : lang === "vi" ? "Yeon Phòng Ngừa Casino" : "Yeon Casino Prevención",
      display:
        lang === "ko" ? "연예방★" : lang === "en" ? "YeonPrev★" : lang === "ja" ? "ヨン予防★" : lang === "zh" ? "连预防★" : lang === "vi" ? "YeonPhòng★" : "YeonPrev★",
      sub: "YEON PREVENTION",
      code: "8800",
      bonus:
        lang === "ko" ? "첫충 30% 1+1 2+2" : lang === "en" ? "First Dep. 30% 1+1 2+2" : lang === "ja" ? "初回30% 1+1 2+2" : lang === "zh" ? "首充30% 1+1 2+2" : lang === "vi" ? "Nạp đầu 30% 1+1 2+2" : "1er dep. 30% 1+1 2+2",
      extra: "3+3 10+5 15+8 30+15",
      color: ["#400", "#f00"],
      badge:
        lang === "ko" ? "스포츠" : lang === "en" ? "SPORTS" : lang === "ja" ? "スポーツ" : lang === "zh" ? "体育" : lang === "vi" ? "THỂ THAO" : "DEPORTES",
      hint:
        lang === "ko" ? "예방" : lang === "en" ? "Prevention" : lang === "ja" ? "予防" : lang === "zh" ? "预防" : lang === "vi" ? "Phòng Ngừa" : "Prevención",
    },
    {
      id: "simulmix",
      name:
        lang === "ko" ? "시뮬믹스카지노" : lang === "en" ? "SimulMix Casino" : lang === "ja" ? "シミュミックスカジノ" : lang === "zh" ? "模拟混合赌场" : lang === "vi" ? "SimulMix Casino" : "SimulMix Casino",
      display:
        lang === "ko" ? "시뮬믹스" : lang === "en" ? "SimulMix" : lang === "ja" ? "シミュミックス" : lang === "zh" ? "模拟混合" : lang === "vi" ? "SimulMix" : "SimulMix",
      sub: "SIMUL MIX",
      code: "693",
      bonus: "3+3 10+5 20+7 30+10",
      extra: "50+15 100+30 200+70",
      color: ["#025", "#0af"],
      badge:
        lang === "ko" ? "믹스" : lang === "en" ? "MIX" : lang === "ja" ? "ミックス" : lang === "zh" ? "混合" : lang === "vi" ? "MIX" : "MIX",
      hint:
        lang === "ko" ? "시뮬" : lang === "en" ? "Simul" : lang === "ja" ? "シミュ" : lang === "zh" ? "模拟" : lang === "vi" ? "Mô Phỏng" : "Simul",
    },
    {
      id: "leisioncasino",
      name:
        lang === "ko" ? "레이션카지노" : lang === "en" ? "Leision Casino" : lang === "ja" ? "レイションカジノ" : lang === "zh" ? "配给赌场" : lang === "vi" ? "Leision Casino" : "Casino Leision",
      display:
        lang === "ko" ? "레이션카지노" : lang === "en" ? "LeisionCasino" : lang === "ja" ? "レイションカジノ" : lang === "zh" ? "配给赌场" : lang === "vi" ? "LeisionCasino" : "LeisionCasino",
      sub: "레이션 CASINO",
      code: "9998",
      bonus:
        lang === "ko" ? "첫충 40% 카지노 1.2% 슬롯 4%" : lang === "en" ? "First Dep. 40% Casino 1.2% Slot 4%" : lang === "ja" ? "初回40% カジノ1.2% スロット4%" : lang === "zh" ? "首充40% 赌场1.2% 老虎机4%" : lang === "vi" ? "Nạp đầu 40% Casino 1.2% Slot 4%" : "1er dep. 40% Casino 1.2% Slot 4%",
      extra: "3+3 10+5 20+10 30+12",
      color: ["#030", "#080"],
      badge: "ZERO",
      hint:
        lang === "ko" ? "레이션" : lang === "en" ? "Leision" : lang === "ja" ? "レイション" : lang === "zh" ? "配给" : lang === "vi" ? "Leision" : "Leision",
    },
    {
      id: "sioncasino",
      name:
        lang === "ko" ? "션카지노" : lang === "en" ? "Sion Casino" : lang === "ja" ? "シオンカジノ" : lang === "zh" ? "西恩赌场" : lang === "vi" ? "Sion Casino" : "Casino Sion",
      display:
        lang === "ko" ? "션★카지노" : lang === "en" ? "Sion★Casino" : lang === "ja" ? "シオン★カジノ" : lang === "zh" ? "西恩★赌场" : lang === "vi" ? "Sion★Casino" : "Sion★Casino",
      sub: "SION PREMIUM",
      code: "7776",
      bonus:
        lang === "ko" ? "신규 40% 무한 15%" : lang === "en" ? "New 40% Unlimited 15%" : lang === "ja" ? "新規40% 無制限15%" : lang === "zh" ? "新人40% 无限15%" : lang === "vi" ? "Mới 40% Không giới hạn 15%" : "Nuevo 40% Ilimitado 15%",
      extra:
        lang === "ko" ? "환전무제한 P2P 토너먼트" : lang === "en" ? "Unlimited Withdrawal P2P Tournament" : lang === "ja" ? "出金無制限 P2P トーナメント" : lang === "zh" ? "无限提款 P2P 锦标赛" : lang === "vi" ? "Rút tiền không giới hạn P2P Giải đấu" : "Retiro ilimitado P2P Torneo",
      color: ["#302", "#f0a"],
      badge: "P2P",
      hint:
        lang === "ko" ? "션" : lang === "en" ? "Sion" : lang === "ja" ? "シオン" : lang === "zh" ? "西恩" : lang === "vi" ? "Sion" : "Sion",
    },
    {
      id: "totalprevent",
      name:
        lang === "ko" ? "전체예방슬롯" : lang === "en" ? "Total Prevention Slot" : lang === "ja" ? "全体予防スロット" : lang === "zh" ? "全部预防老虎机" : lang === "vi" ? "Tổng Phòng Ngừa Slot" : "Slot Prevención Total",
      display:
        lang === "ko" ? "토탈예방슬롯" : lang === "en" ? "TotalPreventSlot" : lang === "ja" ? "トータル予防スロット" : lang === "zh" ? "全部预防老虎机" : lang === "vi" ? "TổngPhòngSlot" : "SlotPrevenciónTotal",
      sub: "TOTAL PREVENTION SLOT",
      code: "3388",
      bonus:
        lang === "ko" ? "매주 10% 슬롯 페이백" : lang === "en" ? "Weekly 10% Slot Cashback" : lang === "ja" ? "毎週10% スロットキャッシュバック" : lang === "zh" ? "每周10% 老虎机返现" : lang === "vi" ? "Hàng tuần 10% Slot Hoàn tiền" : "Semanal 10% Slot Cashback",
      extra:
        lang === "ko" ? "신규 15% 쿠폰 지급" : lang === "en" ? "New 15% Coupon Issued" : lang === "ja" ? "新規15% クーポン配布" : lang === "zh" ? "新人15% 优惠券发放" : lang === "vi" ? "Mới 15% Phát phiếu giảm giá" : "Nuevo 15% Cupón emitido",
      color: ["#023", "#08f"],
      badge:
        lang === "ko" ? "슬롯" : lang === "en" ? "SLOT" : lang === "ja" ? "スロット" : lang === "zh" ? "老虎机" : lang === "vi" ? "SLOT" : "SLOT",
      hint:
        lang === "ko" ? "예방슬롯" : lang === "en" ? "PreventionSlot" : lang === "ja" ? "予防スロット" : lang === "zh" ? "预防老虎机" : lang === "vi" ? "Phòng Ngừa Slot" : "Slot Prevención",
    },
  ];

  const watermarkText =
    lang === "ko"
      ? "도박방지시뮬레이션 불법도박예방교육체험관"
      : lang === "en"
      ? "GamblingPreventionSimulation IllegalGamblingPreventionEducation"
      : lang === "ja"
      ? "ギャンブル防止シミュレーション 違法ギャンブル予防教育"
      : lang === "zh"
      ? "赌博预防模拟 非法赌博预防教育体验"
      : lang === "vi"
      ? "Mô phỏng phòng ngừa cờ bạc Giáo dục phòng ngừa cờ bạc bất hợp pháp"
      : "Simulación Prevención Juego Educación Prevención Juego Ilegal";

  // 10초 후 경고 자동 닫힘
  useEffect(() => {
    const t = setTimeout(() => setShowWarning(false), 10000);
    return () => clearTimeout(t);
  }, []);

  const navItems =
    lang === "ko"
      ? ["🏠 메인", "⚽ 스포츠", "🎰 카지노", "🎮 미니게임", "🃏 포커", "🎱 당구", "💬 고객센터"]
      : lang === "en"
      ? ["🏠 Main", "⚽ Sports", "🎰 Casino", "🎮 Mini Game", "🃏 Poker", "🎱 Billiards", "💬 Support"]
      : lang === "ja"
      ? ["🏠 メイン", "⚽ スポーツ", "🎰 カジノ", "🎮 ミニゲーム", "🃏 ポーカー", "🎱 ビリヤード", "💬 カスタマーサポート"]
      : lang === "zh"
      ? ["🏠 主页", "⚽ 体育", "🎰 赌场", "🎮 小游戏", "🃏 扑克", "🎱 台球", "💬 客服中心"]
      : lang === "vi"
      ? ["🏠 Trang chủ", "⚽ Thể thao", "🎰 Casino", "🎮 Mini Game", "🃏 Poker", "🎱 Bi-a", "💬 Hỗ trợ"]
      : ["🏠 Principal", "⚽ Deportes", "🎰 Casino", "🎮 Mini Juego", "🃏 Póker", "🎱 Billar", "💬 Soporte"];

  const stats = [
    {
      label:
        lang === "ko" ? "현재 접속자" : lang === "en" ? "Current Users" : lang === "ja" ? "現在の接続者" : lang === "zh" ? "当前在线" : lang === "vi" ? "Người dùng hiện tại" : "Usuarios actuales",
      value: "12,847",
      color: "#ef4444",
      real:
        lang === "ko" ? "실제 통계 아님 (시뮬)" : lang === "en" ? "Not real data (Simul)" : lang === "ja" ? "実際の統計ではありません（シミュ）" : lang === "zh" ? "非真实统计（模拟）" : lang === "vi" ? "Không phải dữ liệu thật (Mô phỏng)" : "No es dato real (Simul)",
    },
    {
      label:
        lang === "ko" ? "오늘 총 환전액" : lang === "en" ? "Today's Total Withdrawal" : lang === "ja" ? "本日の総出金額" : lang === "zh" ? "今日提款总额" : lang === "vi" ? "Tổng rút tiền hôm nay" : "Retiro total hoy",
      value: "₩2.3억",
      color: "#f59e0b",
      real:
        lang === "ko" ? "조작된 수치" : lang === "en" ? "Fabricated number" : lang === "ja" ? "操作された数値" : lang === "zh" ? "虚假数据" : lang === "vi" ? "Con số giả mạo" : "Número fabricado",
    },
    {
      label:
        lang === "ko" ? "이번 달 대박" : lang === "en" ? "Big Wins This Month" : lang === "ja" ? "今月の大当たり" : lang === "zh" ? "本月大奖" : lang === "vi" ? "Trúng lớn tháng này" : "Grandes premios este mes",
      value: "839",
      color: "#22c55e",
      real:
        lang === "ko" ? "허위 정보" : lang === "en" ? "False information" : lang === "ja" ? "虚偽情報" : lang === "zh" ? "虚假信息" : lang === "vi" ? "Thông tin sai" : "Información falsa",
    },
    {
      label:
        lang === "ko" ? "VIP 회원" : lang === "en" ? "VIP Members" : lang === "ja" ? "VIP会員" : lang === "zh" ? "VIP会员" : lang === "vi" ? "Thành viên VIP" : "Miembros VIP",
      value: "3,291",
      color: "#8b5cf6",
      real:
        lang === "ko" ? "가짜 데이터" : lang === "en" ? "Fake data" : lang === "ja" ? "偽データ" : lang === "zh" ? "假数据" : lang === "vi" ? "Dữ liệu giả" : "Datos falsos",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", position: "relative", overflow: "hidden" }}>
      <HiddenWatermark watermarkText={watermarkText} />

      {/* ══ 진입 경고 오버레이 ══ */}
      {showWarning && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}>
          <div style={{
            maxWidth: 480, width: "100%",
            background: "#0a0a0a", border: "2px solid #ef4444",
            borderRadius: 20, padding: "32px 28px", textAlign: "center",
          }}>
            <div style={{
              fontSize: 10, color: "#22c55e", fontWeight: 700,
              letterSpacing: 2, marginBottom: 12, opacity: 0.7,
            }}>
              {lang === "ko"
                ? "⚠ 불법도박 예방 시뮬레이션 체험관 ⚠"
                : lang === "en"
                ? "⚠ Illegal Gambling Prevention Simulation ⚠"
                : lang === "ja"
                ? "⚠ 違法ギャンブル予防シミュレーション ⚠"
                : lang === "zh"
                ? "⚠ 非法赌博预防模拟体验馆 ⚠"
                : lang === "vi"
                ? "⚠ Mô phỏng phòng ngừa cờ bạc bất hợp pháp ⚠"
                : "⚠ Simulación de Prevención de Juego Ilegal ⚠"}
            </div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎰</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ef4444", marginBottom: 12 }}>
              {lang === "ko"
                ? <>지금 보시는 화면은<br/>실제 도박 사이트입니까?</>
                : lang === "en"
                ? <>Is what you see now<br/>a real gambling site?</>
                : lang === "ja"
                ? <>今ご覧の画面は<br/>実際のギャンブルサイトですか？</>
                : lang === "zh"
                ? <>您现在看到的是<br/>真实的赌博网站吗？</>
                : lang === "vi"
                ? <>Màn hình bạn đang thấy<br/>có phải trang cờ bạc thật không?</>
                : <>¿Lo que ves ahora<br/>es un sitio de apuestas real?</>}
            </h2>
            <div style={{
              background: "#1a0a0a", border: "1px solid #ef444433",
              borderRadius: 12, padding: "16px", marginBottom: 20, textAlign: "left",
            }}>
              <p style={{ color: "#ef4444", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                {lang === "ko"
                  ? "📢 이것은 범죄예방 교육 시뮬레이션입니다"
                  : lang === "en"
                  ? "📢 This is a crime prevention education simulation"
                  : lang === "ja"
                  ? "📢 これは犯罪防止教育シミュレーションです"
                  : lang === "zh"
                  ? "📢 这是一个犯罪预防教育模拟"
                  : lang === "vi"
                  ? "📢 Đây là mô phỏng giáo dục phòng ngừa tội phạm"
                  : "📢 Esta es una simulación educativa de prevención del crimen"}
              </p>
              <ul style={{ color: "#888", fontSize: 12, lineHeight: 2, paddingLeft: 16 }}>
                <li>
                  {lang === "ko"
                    ? <>실제 도박 사이트처럼 보이도록 <strong style={{ color: "#fbbf24" }}>의도적으로 제작</strong>된 화면입니다</>
                    : lang === "en"
                    ? <>This screen is <strong style={{ color: "#fbbf24" }}>intentionally designed</strong> to look like a real gambling site</>
                    : lang === "ja"
                    ? <>本物のギャンブルサイトに見えるよう<strong style={{ color: "#fbbf24" }}>意図的に制作</strong>された画面です</>
                    : lang === "zh"
                    ? <>这是<strong style={{ color: "#fbbf24" }}>刻意制作</strong>成看起来像真实赌博网站的页面</>
                    : lang === "vi"
                    ? <>Màn hình này được <strong style={{ color: "#fbbf24" }}>cố ý tạo ra</strong> để trông giống trang cờ bạc thật</>
                    : <>Esta pantalla está <strong style={{ color: "#fbbf24" }}>deliberadamente diseñada</strong> para parecer un sitio de apuestas real</>}
                </li>
                <li>
                  {lang === "ko"
                    ? "실제 돈은 절대 나가지 않습니다"
                    : lang === "en"
                    ? "No real money is ever spent"
                    : lang === "ja"
                    ? "実際のお金は一切かかりません"
                    : lang === "zh"
                    ? "绝对不会花费真实金钱"
                    : lang === "vi"
                    ? "Tuyệt đối không có tiền thật được sử dụng"
                    : "Nunca se gasta dinero real"}
                </li>
                <li>
                  {lang === "ko"
                    ? "불법 도박 사이트의 유혹 수법을 직접 경험해보세요"
                    : lang === "en"
                    ? "Experience firsthand the lure tactics of illegal gambling sites"
                    : lang === "ja"
                    ? "違法ギャンブルサイトの誘惑の手口を直接体験してください"
                    : lang === "zh"
                    ? "亲身体验非法赌博网站的诱惑手段"
                    : lang === "vi"
                    ? "Trực tiếp trải nghiệm chiêu trò dụ dỗ của trang cờ bạc bất hợp pháp"
                    : "Experimente de primera mano las tácticas de seducción de sitios de apuestas ilegales"}
                </li>
                <li>
                  {lang === "ko"
                    ? <>진짜 도박 사이트 접속 자체가 <strong style={{ color: "#ef4444" }}>형사처벌 대상</strong>입니다</>
                    : lang === "en"
                    ? <>Accessing a real gambling site is itself subject to <strong style={{ color: "#ef4444" }}>criminal punishment</strong></>
                    : lang === "ja"
                    ? <>本物のギャンブルサイトへのアクセス自体が<strong style={{ color: "#ef4444" }}>刑事罰の対象</strong>です</>
                    : lang === "zh"
                    ? <>访问真实赌博网站本身即为<strong style={{ color: "#ef4444" }}>刑事处罚对象</strong></>
                    : lang === "vi"
                    ? <>Truy cập trang cờ bạc thật có thể bị <strong style={{ color: "#ef4444" }}>truy cứu hình sự</strong></>
                    : <>Acceder a un sitio de apuestas real es motivo de <strong style={{ color: "#ef4444" }}>sanción penal</strong></>}
                </li>
              </ul>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => router.push("/")}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 14,
                  background: "transparent", color: "#666",
                  border: "1px solid #2a2a2a", cursor: "pointer",
                }}
              >
                {lang === "ko" ? "나가기" : lang === "en" ? "Exit" : lang === "ja" ? "出る" : lang === "zh" ? "退出" : lang === "vi" ? "Thoát" : "Salir"}
              </button>
              <button
                onClick={() => setShowWarning(false)}
                style={{
                  flex: 2, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 700,
                  background: "linear-gradient(135deg, #dc2626, #ef4444)",
                  color: "#fff", border: "none", cursor: "pointer",
                }}
              >
                {lang === "ko"
                  ? "⚠ 교육 목적으로 체험하기"
                  : lang === "en"
                  ? "⚠ Experience for Educational Purpose"
                  : lang === "ja"
                  ? "⚠ 教育目的で体験する"
                  : lang === "zh"
                  ? "⚠ 以教育目的体验"
                  : lang === "vi"
                  ? "⚠ Trải nghiệm vì mục đích giáo dục"
                  : "⚠ Experienciar con fines educativos"}
              </button>
            </div>
            <p style={{ color: "#333", fontSize: 10, marginTop: 12 }}>
              {lang === "ko"
                ? "본 콘텐츠는 경찰청·금감원 공인 범죄예방 교육 프로그램입니다"
                : lang === "en"
                ? "This content is a crime prevention education program certified by the National Police Agency and FSS"
                : lang === "ja"
                ? "このコンテンツは警察庁・金融監督院公認の犯罪防止教育プログラムです"
                : lang === "zh"
                ? "本内容是警察厅·金融监督院认证的犯罪预防教育项目"
                : lang === "vi"
                ? "Nội dung này là chương trình giáo dục phòng ngừa tội phạm được công nhận bởi Cục Cảnh sát"
                : "Este contenido es un programa educativo de prevención del crimen certificado por la Agencia Nacional de Policía"}
            </p>
          </div>
        </div>
      )}

      {/* ══ 최상단 마키 배너 ══ */}
      <div style={{
        background: "linear-gradient(90deg, #dc2626, #b91c1c)",
        padding: "6px 0", overflow: "hidden", position: "relative", zIndex: 10,
      }}>
        <div style={{
          display: "inline-block",
          animation: "marquee 20s linear infinite",
          whiteSpace: "nowrap", fontSize: 12, fontWeight: 700,
          color: "#fff", letterSpacing: 1,
        }}>
          {marqueeText.repeat(3)}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(100vw); } to { transform: translateX(-100%); } }`}</style>
      </div>

      {/* ══ 헤더 ══ */}
      <header style={{
        background: "linear-gradient(180deg, #1a0000 0%, #0a0000 100%)",
        borderBottom: "2px solid #dc2626",
        padding: "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <div style={{
              fontSize: 22, fontWeight: 900,
              background: "linear-gradient(90deg, #ffd700, #ff6b00)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              🎰{" "}
              {lang === "ko"
                ? "도박예방체험카지노포털"
                : lang === "en"
                ? "Gambling Prevention Casino Portal"
                : lang === "ja"
                ? "ギャンブル予防体験カジノポータル"
                : lang === "zh"
                ? "赌博预防体验赌场门户"
                : lang === "vi"
                ? "Cổng Casino Phòng Ngừa Cờ Bạc"
                : "Portal Casino Prevención Juego"}
            </div>
            <div style={{
              fontSize: 7, color: "#22c55e", opacity: 0.6,
              position: "absolute", bottom: -8, left: 0, whiteSpace: "nowrap",
              fontWeight: 700, letterSpacing: 1,
            }}>
              {lang === "ko"
                ? "※ 불법도박 예방 교육 시뮬레이션 — 실제 도박 사이트 아님"
                : lang === "en"
                ? "※ Illegal Gambling Prevention Education Simulation — Not a real gambling site"
                : lang === "ja"
                ? "※ 違法ギャンブル予防教育シミュレーション — 実際のギャンブルサイトではありません"
                : lang === "zh"
                ? "※ 非法赌博预防教育模拟 — 非真实赌博网站"
                : lang === "vi"
                ? "※ Mô phỏng giáo dục phòng ngừa cờ bạc bất hợp pháp — Không phải trang cờ bạc thật"
                : "※ Simulación educativa prevención juego ilegal — No es un sitio de apuestas real"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            padding: "4px 12px", borderRadius: 20,
            background: "#dc262620", border: "1px solid #dc262640",
            fontSize: 11, color: "#ef4444", fontWeight: 700,
          }}>
            🔴 LIVE
          </div>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
              background: "#22c55e", color: "#000", border: "none", cursor: "pointer",
            }}
          >
            {lang === "ko"
              ? "← 예방센터로"
              : lang === "en"
              ? "← Prevention Center"
              : lang === "ja"
              ? "← 予防センターへ"
              : lang === "zh"
              ? "← 预防中心"
              : lang === "vi"
              ? "← Trung tâm phòng ngừa"
              : "← Centro de Prevención"}
          </button>
        </div>
      </header>

      {/* ══ 2번째 네비 ══ */}
      <nav style={{
        background: "#111", borderBottom: "1px solid #222",
        display: "flex", gap: 0, overflow: "auto",
        position: "relative", zIndex: 10,
      }}>
        {navItems.map((item) => (
          <div key={item} style={{
            padding: "10px 20px", fontSize: 13, fontWeight: 600,
            color: "#888", cursor: "pointer", whiteSpace: "nowrap",
            borderRight: "1px solid #222",
          }}>
            {item}
          </div>
        ))}
        <div style={{
          padding: "10px 20px", fontSize: 10, fontWeight: 700,
          color: "#22c55e44", cursor: "default", whiteSpace: "nowrap",
          marginLeft: "auto",
        }}>
          [{lang === "ko" ? "시뮬레이션" : lang === "en" ? "Simulation" : lang === "ja" ? "シミュレーション" : lang === "zh" ? "模拟" : lang === "vi" ? "Mô phỏng" : "Simulación"}]
        </div>
      </nav>

      {/* ══ 메인 배너 ══ */}
      <div style={{
        background: "linear-gradient(135deg, #1a0000, #000, #001a00)",
        padding: "20px", textAlign: "center",
        borderBottom: "1px solid #dc262620",
        position: "relative", zIndex: 10,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 16,
          background: "linear-gradient(90deg, #dc2626, #f59e0b, #dc2626)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          fontSize: 28, fontWeight: 900, letterSpacing: -0.5,
        }}>
          {lang === "ko"
            ? "모든베팅가능 무제재  ★  환전무제한 고액전용"
            : lang === "en"
            ? "All Bets Allowed No Restrictions  ★  Unlimited Withdrawal VIP Only"
            : lang === "ja"
            ? "全ベット可能 制限なし  ★  出金無制限 高額専用"
            : lang === "zh"
            ? "所有投注可用 无限制  ★  无限提款 高额专属"
            : lang === "vi"
            ? "Tất cả cược được phép Không hạn chế  ★  Rút tiền không giới hạn Dành VIP"
            : "Todas las apuestas permitidas  ★  Retiro ilimitado Solo VIP"}
        </div>
        <div style={{ color: "#666", fontSize: 11, marginTop: 4 }}>
          <span style={{ color: "#22c55e22", fontSize: 9 }}>
            {lang === "ko"
              ? "도박방지교육시뮬레이션 | "
              : lang === "en"
              ? "GamblingPreventionSimulation | "
              : lang === "ja"
              ? "ギャンブル防止教育シミュレーション | "
              : lang === "zh"
              ? "赌博预防教育模拟 | "
              : lang === "vi"
              ? "Mô phỏng giáo dục phòng ngừa cờ bạc | "
              : "SimulaciónPrevenciónJuego | "}
          </span>
          {lang === "ko"
            ? "실시간 스포츠 베팅 · 카지노 · 슬롯 · 미니게임"
            : lang === "en"
            ? "Live Sports Betting · Casino · Slots · Mini Games"
            : lang === "ja"
            ? "リアルタイムスポーツベット · カジノ · スロット · ミニゲーム"
            : lang === "zh"
            ? "实时体育投注 · 赌场 · 老虎机 · 小游戏"
            : lang === "vi"
            ? "Cược thể thao trực tiếp · Casino · Slot · Mini Game"
            : "Apuestas deportivas en vivo · Casino · Slots · Mini Juegos"}
        </div>
      </div>

      {/* ══ 사이트 배너 그리드 ══ */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "16px 12px",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8,
        position: "relative", zIndex: 10,
      }}>
        {FAKE_SITES.map((site) => (
          <div
            key={site.id}
            onMouseEnter={() => setHoveredSite(site.id)}
            onMouseLeave={() => setHoveredSite(null)}
            onClick={() => router.push(`/gambling/play?site=${site.id}&name=${encodeURIComponent(site.name)}`)}
            style={{
              background: `linear-gradient(135deg, ${site.color[0]}, ${site.color[1]}22, #000)`,
              border: `1px solid ${site.color[0]}60`,
              borderRadius: 8, padding: "12px 10px",
              cursor: "pointer", position: "relative", overflow: "hidden",
              transition: "transform 0.15s",
              transform: hoveredSite === site.id ? "scale(1.02)" : "scale(1)",
            }}
          >
            {/* 배지 */}
            <div style={{
              position: "absolute", top: 6, right: 6,
              background: site.color[0], color: "#fff",
              fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4,
            }}>
              {site.badge}
            </div>

            {/* 사이트명 */}
            <div style={{
              fontSize: 15, fontWeight: 900,
              color: "#fff", marginBottom: 2,
              textShadow: `0 0 10px ${site.color[0]}`,
            }}>
              {site.display}
            </div>
            <div style={{ fontSize: 9, color: site.color[1], marginBottom: 6, letterSpacing: 1 }}>
              {site.sub}
            </div>

            {/* 보너스 정보 */}
            <div style={{ fontSize: 10, color: "#ddd", lineHeight: 1.6 }}>
              <div style={{ color: "#ffd700", fontWeight: 700, fontSize: 11 }}>{site.bonus}</div>
              <div style={{ color: "#aaa" }}>{site.extra}</div>
            </div>

            {/* 가입코드 */}
            <div style={{
              marginTop: 8, display: "flex", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 9, color: "#888" }}>
                {lang === "ko" ? "가입코드" : lang === "en" ? "Reg. Code" : lang === "ja" ? "登録コード" : lang === "zh" ? "注册码" : lang === "vi" ? "Mã đăng ký" : "Código"}
              </span>
              <span style={{
                background: "#fff2", padding: "2px 8px", borderRadius: 4,
                fontSize: 11, fontWeight: 800, color: "#ffd700",
                letterSpacing: 2,
              }}>
                {site.code}
              </span>
            </div>

            {/* hover시 숨겨진 힌트 노출 */}
            {hoveredSite === site.id && (
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.85)", backdropFilter: "blur(2px)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 6,
                borderRadius: 8,
              }}>
                <div style={{ fontSize: 24 }}>⚠️</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#22c55e", textAlign: "center" }}>
                  "{site.hint}"<br/>
                  <span style={{ color: "#fbbf24", fontSize: 10 }}>
                    {lang === "ko"
                      ? "이 이름에는 도박방지 메시지가 숨어있습니다"
                      : lang === "en"
                      ? "This name hides a gambling prevention message"
                      : lang === "ja"
                      ? "この名前にはギャンブル防止メッセージが隠されています"
                      : lang === "zh"
                      ? "这个名字隐藏着防赌博信息"
                      : lang === "vi"
                      ? "Tên này ẩn chứa thông điệp phòng ngừa cờ bạc"
                      : "Este nombre oculta un mensaje de prevención del juego"}
                  </span>
                </div>
                <div style={{
                  fontSize: 11, color: "#fff", fontWeight: 700,
                  background: "#dc2626", padding: "6px 14px", borderRadius: 20,
                  marginTop: 4,
                }}>
                  {lang === "ko"
                    ? "클릭하여 체험하기 →"
                    : lang === "en"
                    ? "Click to experience →"
                    : lang === "ja"
                    ? "クリックして体験する →"
                    : lang === "zh"
                    ? "点击体验 →"
                    : lang === "vi"
                    ? "Nhấp để trải nghiệm →"
                    : "Haz clic para experimentar →"}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ══ 하단 통계 배너 ══ */}
      <div style={{
        background: "#0a0a0a", borderTop: "1px solid #1a1a1a",
        padding: "24px 20px", maxWidth: 1200, margin: "0 auto",
        position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{
              background: "#111", borderRadius: 10, padding: "14px",
              border: "1px solid #222", textAlign: "center", position: "relative",
            }}>
              <p style={{ color: stat.color, fontSize: 22, fontWeight: 900 }}>{stat.value}</p>
              <p style={{ color: "#555", fontSize: 11 }}>{stat.label}</p>
              <p style={{ color: "#333", fontSize: 8, marginTop: 3 }}>{stat.real}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ 푸터 ══ */}
      <footer style={{
        background: "#050505", borderTop: "1px solid #111",
        padding: "20px", textAlign: "center",
        position: "relative", zIndex: 10,
      }}>
        <p style={{ color: "#1a1a1a", fontSize: 9, lineHeight: 1.8, maxWidth: 800, margin: "0 auto" }}>
          {lang === "ko"
            ? "본 사이트는 범죄예방 교육 목적의 시뮬레이션입니다. 실제 도박 사이트가 아닙니다. | 불법 도박은 형사처벌 대상입니다 (게임산업진흥에 관한 법률 제44조) | 도박 중독 상담: 한국도박문제예방치유원 ☎1336 (24시간 무료) | 이 화면에서 실제 금전 거래는 불가능합니다 | ⚠ 도박방지 교육 시뮬레이션 — 범죄예방 체험관 제공"
            : lang === "en"
            ? "This site is a simulation for crime prevention education purposes. It is not a real gambling site. | Illegal gambling is subject to criminal punishment (Act on Game Industry Promotion, Article 44) | Gambling Addiction Counseling: ☎1336 (24hrs Free) | No real financial transactions are possible on this screen | ⚠ Gambling Prevention Education Simulation — Crime Prevention Experience Center"
            : lang === "ja"
            ? "本サイトは犯罪防止教育目的のシミュレーションです。実際のギャンブルサイトではありません。| 違法ギャンブルは刑事罰の対象です | ギャンブル依存相談: ☎1336（24時間無料）| この画面での実際の金銭取引は不可能です | ⚠ ギャンブル防止教育シミュレーション"
            : lang === "zh"
            ? "本网站是用于犯罪预防教育目的的模拟。不是真实的赌博网站。| 非法赌博属于刑事处罚对象 | 赌博成瘾咨询: ☎1336（24小时免费）| 此页面无法进行真实金融交易 | ⚠ 赌博预防教育模拟"
            : lang === "vi"
            ? "Trang web này là mô phỏng phục vụ mục đích giáo dục phòng ngừa tội phạm. Không phải trang cờ bạc thật. | Cờ bạc bất hợp pháp là đối tượng bị truy cứu hình sự | Tư vấn nghiện cờ bạc: ☎1336 (Miễn phí 24h) | Không thể thực hiện giao dịch tài chính thật trên màn hình này | ⚠ Mô phỏng giáo dục phòng ngừa cờ bạc"
            : "Este sitio es una simulación con fines educativos de prevención del crimen. No es un sitio de apuestas real. | El juego ilegal está sujeto a sanción penal | Asesoramiento adicción al juego: ☎1336 (24h Gratis) | No es posible realizar transacciones financieras reales en esta pantalla | ⚠ Simulación educativa de prevención del juego"}
        </p>
        <p style={{ color: "#22c55e", fontSize: 8, marginTop: 8, opacity: 0.4 }}>
          {lang === "ko"
            ? "★ 사이트 이름의 첫 글자들을 모아보세요: 도-박-방-지-예-방-시-뮬-레-이-션 ★"
            : lang === "en"
            ? "★ Collect the first letters of each site name: G-A-M-B-L-I-N-G-P-R-E-V-E-N-T-I-O-N ★"
            : lang === "ja"
            ? "★ 各サイト名の最初の文字を集めてみてください: ギャンブル防止 ★"
            : lang === "zh"
            ? "★ 收集各网站名称的第一个字: 防-赌-博-预-防-模-拟 ★"
            : lang === "vi"
            ? "★ Hãy thu thập chữ cái đầu tiên của mỗi tên trang: P-H-Ò-N-G-C-Ờ-B-Ạ-C ★"
            : "★ Recoge la primera letra de cada nombre de sitio: P-R-E-V-E-N-C-I-Ó-N ★"}
        </p>
      </footer>
    </div>
  );
}
