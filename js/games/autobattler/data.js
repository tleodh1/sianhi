(function (global) {
  "use strict";

  const roles = {
    GUARDIAN: { ko: "수호자", color: "#54c9ff", behavior: "front" },
    FIGHTER: { ko: "전투가", color: "#ff805f", behavior: "front" },
    RANGER: { ko: "사수", color: "#ffd75b", behavior: "range" },
    MAGE: { ko: "마도사", color: "#be88ff", behavior: "range" },
    SUPPORT: { ko: "지원가", color: "#72e6a5", behavior: "support" },
    ASSASSIN: { ko: "추적자", color: "#ff70ba", behavior: "back" },
    ENGINEER: { ko: "기술자", color: "#82a9ff", behavior: "range" },
  };

  const traits = {
    Mechanical: { ko: "기계", color: "#7fd9ff", tiers: [2, 4], text: "방어력 강화" },
    Forest: { ko: "숲", color: "#6ee59d", tiers: [2, 4], text: "생명 회복" },
    Ocean: { ko: "바다", color: "#56b8ff", tiers: [2, 4], text: "에너지 회복" },
    Sky: { ko: "하늘", color: "#a9e7ff", tiers: [2, 4], text: "공격 속도" },
    Star: { ko: "별", color: "#ffd76b", tiers: [2, 4], text: "스킬 위력" },
    Electric: { ko: "전기", color: "#e9ff5e", tiers: [2, 3], text: "연쇄 번개" },
    Fire: { ko: "불꽃", color: "#ff795d", tiers: [2, 4], text: "공격력 강화" },
    Ice: { ko: "얼음", color: "#8ceaff", tiers: [2, 4], text: "적 둔화" },
    Light: { ko: "빛", color: "#fff09a", tiers: [2, 4], text: "보호막" },
    Shadow: { ko: "그림자", color: "#bd8cff", tiers: [2, 4], text: "치명타" },
  };

  const characters = [
    ["bolt", "볼트콩", 1, "FIGHTER", "Electric", 620, 58, 16, 1.05, 1, "번개 주먹", "dash", "#ffe14f"],
    ["moss", "모스링", 1, "SUPPORT", "Forest", 540, 42, 15, 0.9, 3, "새싹 회복", "heal", "#63df8a"],
    ["fin", "핀가드", 1, "GUARDIAN", "Ocean", 760, 44, 28, 0.75, 1, "물결 방패", "shield", "#55c7ff"],
    ["spark", "스파키", 1, "RANGER", "Mechanical", 500, 56, 13, 1.1, 4, "펄스 탄환", "bolt", "#69a8ff"],
    ["ember", "엠버링", 2, "MAGE", "Fire", 560, 70, 13, 0.8, 4, "별불꽃", "fireball", "#ff7056"],
    ["cloud", "구르미온", 2, "SUPPORT", "Sky", 590, 48, 17, 0.95, 3, "순풍 날개", "haste", "#a5e8ff"],
    ["gear", "기어독", 2, "ENGINEER", "Mechanical", 650, 55, 21, 0.9, 3, "꼬마 드론", "drone", "#7ea6e8"],
    ["shade", "쉐이드캣", 2, "ASSASSIN", "Shadow", 570, 78, 12, 1.2, 1, "그림자 도약", "dash", "#b47aff"],
    ["nova", "노바윙", 3, "RANGER", "Star", 670, 88, 18, 1.05, 5, "별빛 관통포", "beam", "#ffd55e"],
    ["reef", "리프론", 3, "GUARDIAN", "Ocean", 990, 62, 36, 0.72, 1, "산호 요새", "shield", "#38d4c9"],
    ["drake", "메카드래코", 3, "FIGHTER", "Fire", 820, 94, 24, 0.92, 1, "용맥 돌진", "dash", "#ff634f"],
    ["aurora", "오로라핀", 4, "MAGE", "Ice", 760, 112, 22, 0.78, 4, "빙하 폭발", "freeze", "#80e9ff"],
    ["titan", "티탄버디", 4, "GUARDIAN", "Mechanical", 1280, 82, 46, 0.68, 1, "중력 장벽", "shield", "#568cff"],
    ["sol", "솔라리온", 5, "MAGE", "Light", 980, 145, 30, 0.85, 5, "태양의 고리", "nova", "#ffe76e"],
    ["cosmo", "코스모래빗", 5, "ASSASSIN", "Star", 850, 156, 24, 1.28, 1, "유성 점프", "dash", "#ff7edb"],
  ].map(([id, name, grade, role, trait, hp, attack, defense, speed, range, skillName, skill, color]) => ({
    id, name, grade, role, trait, hp, attack, defense, speed, range, skillName, skill, color,
  }));

  const materials = {
    power: { id: "power", name: "파워 코어", icon: "◆", color: "#ff755f", sell: 1 },
    armor: { id: "armor", name: "아머 플레이트", icon: "⬡", color: "#7ca4d9", sell: 1 },
    crystal: { id: "crystal", name: "에너지 크리스털", icon: "✦", color: "#66e4ff", sell: 1 },
    gear: { id: "gear", name: "스피드 기어", icon: "⚙", color: "#ffd35f", sell: 1 },
    orb: { id: "orb", name: "매직 오브", icon: "●", color: "#b984ff", sell: 1 },
    chip: { id: "chip", name: "스타 칩", icon: "★", color: "#fff078", sell: 1 },
  };

  const equipment = {
    rapid: { id: "rapid", name: "래피드 코어", icon: "⚡", stats: { speed: 0.22 }, text: "공격 속도 +22%" },
    barrier: { id: "barrier", name: "에너지 실드", icon: "◈", stats: { shield: 220 }, text: "전투 시작 보호막 220" },
    cannon: { id: "cannon", name: "스타 캐논", icon: "✹", stats: { proc: 0.3 }, text: "3번째 공격마다 별 탄환" },
    healer: { id: "healer", name: "힐링 모듈", icon: "✚", stats: { regen: 18 }, text: "초당 체력 18 회복" },
    critical: { id: "critical", name: "크리티컬 기어", icon: "✧", stats: { crit: 0.2 }, text: "치명타 확률 +20%" },
    reactor: { id: "reactor", name: "플레어 리액터", icon: "☀", stats: { attack: 0.2 }, text: "공격력 +20%" },
  };

  const recipes = {
    "gear+power": "rapid",
    "armor+crystal": "barrier",
    "chip+orb": "cannon",
    "crystal+orb": "healer",
    "chip+gear": "critical",
    "armor+power": "reactor",
  };

  const shopOdds = [
    [100, 0, 0, 0, 0], [75, 25, 0, 0, 0], [60, 30, 10, 0, 0],
    [45, 35, 18, 2, 0], [30, 36, 27, 7, 0], [20, 32, 32, 15, 1],
    [14, 25, 35, 22, 4], [10, 20, 30, 30, 10], [5, 15, 25, 35, 20],
  ];

  const stages = Array.from({ length: 16 }, (_, i) => {
    const world = Math.floor(i / 4) + 1;
    const round = (i % 4) + 1;
    return {
      id: `${world}-${round}`,
      type: round === 4 ? (world % 2 ? "ELITE" : "BOSS") : round === 3 ? "REWARD" : "BATTLE",
      count: Math.min(8, 2 + Math.floor(i / 2)),
      power: 0.86 + i * 0.1,
      reward: 4 + Math.floor(i / 4),
    };
  });

  global.AutoBattlerData = { roles, traits, characters, materials, equipment, recipes, shopOdds, stages };
})(window);
