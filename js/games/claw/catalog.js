/* Original plush catalog. Sizes are collision radii in the cabinet floor plane. */
var SianClaw = globalThis.SianClaw || {};
(function(C){
 C.rarities=[{id:'COMMON',name:'포근한 친구',stars:1,color:'#438f82'},{id:'RARE',name:'반짝 친구',stars:2,color:'#4088cf'},{id:'EPIC',name:'신비한 친구',stars:3,color:'#965ecc'},{id:'LEGENDARY',name:'전설의 친구',stars:4,color:'#cd8c24'}];
 C.catalog=[
  ['bunny','모모 토끼',0,36,.72,'작은 목도리를 두른 다정한 토끼.'],
  ['bear','쿨쿨 곰',0,40,.90,'햇살 아래서 낮잠을 좋아해요.'],
  ['fox','방긋 여우',0,35,.76,'웃는 눈으로 친구를 반겨요.'],
  ['penguin','보라 펭귄',0,34,.69,'작은 발로 폴짝폴짝 춤을 춰요.'],
  ['jelly','몽글 젤리',1,38,.78,'바다에서 온 말랑말랑 친구.'],
  ['hedgehog','꽃송 고슴',1,41,.94,'가시 대신 부드러운 꽃잎이 있어요.'],
  ['dino','새싹 공룡',1,40,.89,'풀잎을 좋아하는 초록 공룡.'],
  ['lamb','구름 양',1,42,.85,'구름처럼 포근한 털을 가졌어요.'],
  ['cat','별빛 고양이',2,37,.88,'작은 날개에 별빛을 담았어요.'],
  ['dragon','잎새 용',2,43,1.02,'숲을 지키는 상냥한 아기 용.'],
  ['deer','달빛 사슴',3,40,1.04,'금빛 달이 뿔 위에서 반짝여요.'],
  ['phoenix','햇살 불사조',3,39,1.00,'무지개 날개로 희망을 전해요.']
 ].map(([id,name,rarity,radius,mass,story],sprite)=>({id,name,rarity,radius,mass,story,sprite}));
 C.layout=function(){return C.catalog.map((d,i)=>({id:d.id,x:[-168,-57,62,173][i%4]+[0,7,-12,0,8,-9,8,-7,10,-3,9,-8][i],z:[.85,.52,.18][Math.floor(i/4)]+[0,.035,-.035,0,.025,-.015,.03,-.03,0,.02,-.015,.035][i],height:0,vy:0,tilt:(i%3-1)*.12,won:false}));};
 C.clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
})(SianClaw);
