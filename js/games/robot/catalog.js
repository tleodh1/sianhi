(function () {
  const part = (id, name, stats, shape) => ({ id, name, stats, shape });
  window.SianRobot = {
    slots: ["head", "body", "leftArm", "rightArm", "leftLeg", "rightLeg", "back", "weapon"],
    labels: { head: "머리", body: "몸통", leftArm: "왼팔", rightArm: "오른팔", leftLeg: "왼다리", rightLeg: "오른다리", back: "등 장치", weapon: "무기" },
    parts: {
      head: [part("scout", "탐험형", { speed: 2, energy: 1 }, "round"), part("space", "우주형", { energy: 3, defense: -1 }, "visor"), part("dino", "공룡형", { power: 2, jump: 1 }, "crest"), part("knight", "기사형", { defense: 3, speed: -1 }, "helm"), part("future", "미래형", { energy: 2, speed: 1 }, "fin")],
      body: [part("light", "경량", { speed: 3, defense: -1 }, "slim"), part("standard", "표준", { hp: 2, defense: 1 }, "core"), part("heavy", "중장갑", { hp: 4, defense: 3, speed: -2 }, "wide"), part("energy", "에너지", { energy: 4, hp: -1 }, "glow")],
      leftArm: [part("basic", "기본", { power: 1 }, "arm"), part("power", "파워", { power: 3, speed: -1 }, "heavy"), part("speed", "스피드", { speed: 2, power: -1 }, "light"), part("shield", "실드", { defense: 3 }, "shield"), part("drill", "드릴", { power: 2, energy: 1 }, "drill")],
      rightArm: [],
      leftLeg: [part("basic", "기본", { jump: 1 }, "boot"), part("speed", "스피드", { speed: 3, defense: -1 }, "wheel"), part("heavy", "헤비", { defense: 3, speed: -1 }, "tank"), part("jump", "점프", { jump: 4, hp: -1 }, "spring")],
      rightLeg: [],
      back: [part("jet", "제트팩", { jump: 2, energy: 1 }, "jet"), part("boost", "부스터", { speed: 3 }, "boost"), part("pack", "에너지팩", { energy: 4, speed: -1 }, "pack")],
      weapon: [part("blaster", "블래스터", { power: 2, energy: 1 }, "blaster"), part("sword", "에너지 검", { power: 3, defense: -1 }, "sword"), part("hammer", "해머", { power: 4, speed: -2 }, "hammer"), part("drill", "드릴", { power: 3, jump: 1 }, "drill"), part("guard", "가드 실드", { defense: 4, power: -1 }, "shield")],
    },
  };
  window.SianRobot.parts.rightArm = window.SianRobot.parts.leftArm.map((p) => ({ ...p }));
  window.SianRobot.parts.rightLeg = window.SianRobot.parts.leftLeg.map((p) => ({ ...p }));
})();
