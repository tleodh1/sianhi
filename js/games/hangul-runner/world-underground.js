(function(H){
 H.registerWorld({id:4,name:'빛나는 지하도시',theme:'underground',mode:'run',color:'#a9546f',description:'배수관과 고대 장치를 지나 마지막 글자를 찾아요',notes:[196,294,392]},[
  {number:1,name:'반짝이 배수관',words:['지','하','도','시'],story:'파이프 길을 달리고 움직이는 장치를 건너요.',moving:true,gap:100},
  {number:2,name:'물빛 터널',words:['빛','물','길','문'],story:'물에 잠긴 구간은 ↑ ↓로 헤엄쳐 통과해요.',water:true,gap:80},
  {number:3,name:'고대 기계 미로',words:['기계','톱니','열쇠','출구'],story:'위아래 길을 살피고 글자를 순서대로 모아요.',ordered:true,moving:true,maze:true,gap:125},
  {number:4,name:'지하도시의 심장',words:['하','시','쇠','구'],story:'배운 낱말을 완성해 빛 에너지로 최종 보스를 물리쳐요.',boss:{name:'철갑왕 그롬',style:'underground',attacks:['gear','steam','slam'],questions:[['지○','하','수','고'],['도○','시','로','기'],['열○','쇠','매','차'],['출○','구','문','발']]}}
 ]);
 const previous=H.decorateWorldStage;H.decorateWorldStage=s=>{previous?.(s);if(s.worldId!==4)return;
  if(s.water)s.waterZones=s.words.map((_,i)=>({x:i*s.span+260,w:300,surface:245}));
  s.words.forEach((_,i)=>{const x=i*s.span;
   s.hazards.push({kind:i%2?'steam':'gear',x:x+455,y:370,w:48,h:50});
   const level=s.number,kind=['gear-shell','fire-imp','pipe-snapper','gear-shell'][(i+level-1)%4];s.enemies.push({x:x+350,y:376,w:50,h:48,left:x+300,right:x+500,dir:i%2?1:-1,speed:40+level*9,kind,baseY:kind==='pipe-snapper'?405:372,phase:i,level,hp:level>=3?2:1,flying:false,armored:kind==='gear-shell',rollSpeed:350+level*18});
   if(level>=2&&i%2===1)s.enemies.push({x:x+525,y:372,w:48,h:48,left:x+485,right:x+610,dir:-1,speed:45+level*8,kind:level>=3?'fire-imp':'gear-shell',baseY:372,phase:i+3,level,hp:level>=4?2:1,armored:level<3,rollSpeed:370});
   if(s.moving){const a={x:x+265,y:285-(i%2)*80,w:160,h:34,kind:'metal',oneWay:true,originX:x+265,originY:285-(i%2)*80,motion:{x:i%2?55:0,y:i%2?0:55,speed:.8+i*.08}};s.platforms.push(a);}
   if(s.maze&&i%2){s.platforms.push({x:x+80,y:210,w:190,h:34,kind:'pipe',oneWay:true});s.gates.push({x:x+545,required:i+1});}
  });
 };
})(HangulRunner);
