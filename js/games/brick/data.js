var SianBrick = globalThis.SianBrick || {};
(function (B) {
  const shapes = {
    wall: ["1111111", "1111111", "1111111", "1111111"],
    stairs: ["1000001", "1100011", "1110111", "1111111"],
    heart: ["0110110", "1111111", "1111111", "0111110", "0011100", "0001000"],
    star: ["0001000", "1011101", "0111110", "1111111", "0111110", "0100010"],
    moon: ["0011100", "0110000", "1100000", "1100000", "0110000", "0011100"],
    cloud: ["0001000", "0111110", "1111111", "1111111", "0111110"],
    fish: ["0001100", "1011110", "1111111", "1011110", "0001100"],
    rocket: ["0001000", "0011100", "0111110", "0111110", "0101010", "1010101"],
    robot: ["0111110", "1101011", "1111111", "1011101", "1010101"],
    crown: ["1000001", "1010101", "1111111", "0111110", "0111110"],
    castle: ["1010101", "1111111", "1101011", "1100011", "1111111"],
    tree: ["0001000", "0011100", "0111110", "1111111", "0011100", "0011100"],
    gem: ["0011100", "0111110", "1111111", "0111110", "0011100"],
    butterfly: ["1100011", "1110111", "0111110", "1110111", "1100011"],
    dragon: ["0111000", "1111010", "0111111", "0011110", "0110100", "1100110"],
  };
  const names = ["별빛 벽", "빛의 계단", "두근두근 하트", "별의 문", "초승달", "구름 정원", "은하 물고기", "별 로켓", "로봇 얼굴", "왕관", "별빛 성", "꿈나무", "우주 보석", "빛나비", "기계 드래곤"];
  const keys = Object.keys(shapes);
  function bricks(stage) {
    const rows = shapes[keys[(stage - 1) % keys.length]];
    const hard = stage > 5, moving = stage > 10, metal = stage > 15;
    const out = [];
    rows.forEach((row, y) => [...row].forEach((v, x) => {
      if (v !== "1") return;
      const n = x + y * 7 + stage;
      let type = hard && n % 7 === 0 ? "strong" : "normal";
      if (stage > 10 && n % 11 === 0) type = "hard";
      if (moving && n % 13 === 0) type = "moving";
      if (metal && n % 17 === 0) type = "metal";
      if (n % 19 === 0) type = "explosive";
      if (n % 23 === 0) type = "star";
      if (stage > 6 && n % 29 === 0) type = "multiball";
      if (stage > 12 && n % 31 === 0) type = "mystery";
      out.push({ x, y, type });
    }));
    if (stage === 30) out.push({ x: 3, y: 2, type: "boss" });
    return out;
  }
  B.typeHp = { normal: 1, strong: 2, hard: 3, moving: 2, metal: 99, explosive: 1, star: 1, multiball: 1, mystery: 1, boss: 12 };
  B.stages = Array.from({ length: 30 }, (_, i) => {
    const n = i + 1, cycle = Math.floor(i / 15);
    return {
      id: n,
      name: n === 30 ? "코스믹 코어 BOSS" : (cycle ? `미러 ${names[i % 15]}` : names[i]),
      icon: ["▦", "▟", "♥", "★", "☾", "☁", "🐟", "🚀", "🤖", "♛", "🏰", "🌳", "💎", "🦋", "🐲"][i % 15],
      bricks: bricks(n),
      speed: Math.min(1.75, .78 + n * .025),
      paddle: Math.max(15, 27 - Math.floor(n / 4)),
      lives: n < 11 ? 4 : 3,
      boss: n === 30,
    };
  });
})(SianBrick);
