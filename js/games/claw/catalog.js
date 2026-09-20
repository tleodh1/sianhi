/* Original plush catalog. Sizes are collision radii in the cabinet floor plane. */
var SianClaw = globalThis.SianClaw || {};
(function (C) {
  C.rarities = [
    { id: "COMMON", name: "포근한 친구", stars: 1, color: "#438f82" },
    { id: "RARE", name: "반짝 친구", stars: 2, color: "#4088cf" },
    { id: "EPIC", name: "신비한 친구", stars: 3, color: "#965ecc" },
    { id: "LEGENDARY", name: "전설의 친구", stars: 4, color: "#cd8c24" },
  ];
  C.catalog = [
    ["bunny", "모모 토끼", 0, 36, 0.72, "작은 목도리를 두른 다정한 토끼.",0],
    ["bear", "쿨쿨 곰", 0, 40, 0.9, "햇살 아래서 낮잠을 좋아해요.",1],
    ["fox", "방긋 여우", 0, 35, 0.76, "웃는 눈으로 친구를 반겨요.",2],
    ["penguin", "보라 펭귄", 0, 34, 0.69, "작은 발로 폴짝폴짝 춤을 춰요.",3],
    ["jelly", "몽글 젤리", 1, 38, 0.78, "바다에서 온 말랑말랑 친구.",4],
    ["hedgehog", "꽃송 고슴", 1, 41, 0.94, "가시 대신 부드러운 꽃잎이 있어요.",5],
    ["dino", "새싹 공룡", 1, 43, 1.05, "풀잎을 좋아하는 초록 공룡.",6],
    ["lamb", "구름 양", 1, 42, 0.85, "구름처럼 포근한 털을 가졌어요.",7],
    ["cat", "별빛 고양이", 2, 37, 0.88, "작은 날개에 별빛을 담았어요.",8],
    ["dragon", "잎새 용", 2, 46, 1.18, "숲을 지키는 상냥한 아기 용.",9],
    ["deer", "달빛 사슴", 3, 40, 1.04, "금빛 달이 뿔 위에서 반짝여요.",10],
    ["phoenix", "햇살 불사조", 3, 39, 1.0, "무지개 날개로 희망을 전해요.",11],
    ["puppy", "콩콩 강아지", 0, 37, 0.8, "꼬리를 흔드는 용감한 강아지.",1],
    ["panda", "대나무 판다", 1, 42, 1.02, "대나무 숲에서 온 둥근 판다.",3],
    ["shark", "파도 상어", 1, 43, 1.08, "파도보다 빠른 장난꾸러기 상어.",4],
    ["whale", "별고래", 2, 47, 1.24, "등에서 별빛 물줄기를 뿜어요.",7],
    ["robot", "틴틴 로봇", 2, 45, 1.3, "반짝 톱니로 친구를 돕는 로봇.",5],
    ["astronaut", "우주 탐험가", 2, 41, 1.05, "별 사이를 여행하는 작은 탐험가.",3],
    ["racer", "번개 레이서", 1, 39, 0.94, "구름 트랙을 달리는 씩씩한 레이서.",2],
    ["star-monster", "반짝 별몬", 2, 40, 0.92, "웃을 때마다 별가루가 톡톡.",8],
    ["forest-monster", "이끼 숲몬", 1, 43, 1.08, "나뭇잎 모자를 쓴 숲의 친구.",6],
    ["water-monster", "방울 물몬", 2, 42, 0.9, "말랑한 물방울 몸을 가졌어요.",4],
    ["electric-monster", "찌릿 전기몬", 3, 44, 1.12, "신나면 노란 불꽃이 반짝여요.",11],
  ].map(([id, name, rarity, radius, mass, story, sprite]) => ({
    id,
    name,
    rarity,
    radius,
    mass,
    story,
    sprite,
  }));
  C.machine = { left: -238, right: 238, front: 0.1, back: 0.9, floor: 0 };
  C.constrainToy = function (toy) {
    const def = C.catalog.find((d) => d.id === toy.id);
    if (!def) return toy;
    const footprint = Math.min(66, def.radius * (toy.scale || 1) * 0.58);
    toy.x = C.clamp(toy.x, C.machine.left + footprint, C.machine.right - footprint);
    toy.z = C.clamp(toy.z, C.machine.front, C.machine.back);
    toy.height = Math.max(C.machine.floor, toy.height || 0);
    return toy;
  };
  C.grabReach = function (toy, def) {
    return C.clamp(def.radius * (toy.scale || 1) * 0.72 + 25, 54, 82);
  };
  C.layout = function () {
    const heroes=['dragon','robot','whale','dino','electric-monster','shark','panda','star-monster','bunny','puppy','phoenix','astronaut','dragon'];
    const ids=[...C.catalog.map(d=>d.id),...heroes];
    const tilts=[-1.18,.18,-.42,.08,.72,-.14,.31,-.86,.12,.48,-.2,1.35,-.1,.25,-.68,.05,.92,-.3,.16,-1.42,.38,-.08,.65,-.24,.1,-.74,.22,1.18,-.17,.44,-.55,.84,-1.25,.29,.63,-.36];
    return ids.map((id,i)=>{const layer=Math.floor(i/9),column=i%9,z=[.89,.64,.38,.12][layer]+((i%3)-1)*.014,x=-208+column*52+(layer%2?22:0),toy={instanceId:`toy-${i}`,id,x,z,height:0,vy:0,tilt:tilts[i],scale:layer===3?[.94,1.06,1.18][i%3]:[.94,1.06,1.18,1.34,1.55,1.82][(i*5+layer)%6],pose:i%6===0?'side':i%9===0?'upside-down':i%5===0?'lean':'upright',won:false};if(toy.z<.2&&toy.x<-70)toy.z=.34;return C.constrainToy(toy);});
  };
  C.clamp = (n, a, b) => Math.max(a, Math.min(b, n));
})(SianClaw);
