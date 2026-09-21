(function(H){
 H.registerWorld({id:3,name:'하늘 왕국',theme:'sky',mode:'fly',color:'#7565cf',description:'비행 장치로 구름과 성 사이를 날아요',notes:[659,880,1046]},[
 {number:1,name:'구름길',words:['하','늘','구','름'],story:'떠 있는 섬에서는 달리고, 무지개 구간에서는 ↑ ↓로 날아요.',hybrid:true,gap:160},
 {number:2,name:'하늘 정원',words:['바람','새','날개','비행'],story:'바람을 느끼며 움직이는 비행선 사이를 날아요.',moving:true,current:true,gap:220},
 {number:3,name:'비행선 항로',words:['하늘','구름','나는','새'],story:'하늘 → 구름 → 나는 → 새! 순서대로 읽으며 모아요.',ordered:true,gap:250},
 {number:4,name:'폭풍의 신전',words:['늘','름','새','요'],story:'날면서 알맞은 글자를 찾아 폭풍을 잠재워요.',boss:{name:'폭풍날개 세루',style:'sky',attacks:['wind','lightning','charge'],questions:[['하○','늘','물','길'],['구○','름','달','별'],['나는 ○','새','집','물'],['날아○','요','가','다']]}}
 ]);
 /* Sky prop atlas indices (assets/hangul-runner/sky-props.webp, 4 x 2 grid):
    0 grass island · 1 cloud platform · 2 sky castle · 3 airship
    4 windmill island · 5 cloud · 6 storm temple · 7 tree island */
 H.SKY_SCENES={
  1:{name:'구름길',sky:['#7fc4ff','#bfe2ff','#f6fbff'],landmark:2,landmarkScale:1,mid:[0,7],props:[1,5],ribbon:'#ffffffcc'},
  2:{name:'하늘 정원',sky:['#8fb8ff','#e4c9ff','#fff2dc'],landmark:4,landmarkScale:.85,mid:[4,0],props:[5,1],ribbon:'#ffe9f4cc'},
  3:{name:'비행선 항로',sky:['#6fa9f2','#cfe4ff','#ffeccb'],landmark:3,landmarkScale:.9,mid:[3,0],props:[1,5],ribbon:'#fff4d8cc'},
  4:{name:'폭풍의 신전',sky:['#2b2350','#5a3f87','#8f6fc0'],landmark:6,landmarkScale:1.05,mid:[6,0],props:[5,5],ribbon:'#d9c6ffaa',storm:true}
 };
 // Called by stage-pacing once the route exists: dresses it as an actual sky kingdom.
 H.decorateSkyRoute=(s,{floor,end,n,pits})=>{
  s.skyScene=H.SKY_SCENES[n]||H.SKY_SCENES[1];
  // Ground becomes floating land; terraces and ledges become cloud banks and islands.
  for(const p of s.platforms){if(p.kind==='ground')p.skyKind=n===3?'tree':n===4?'storm':'island';else if(p.kind==='cloud')p.skyKind='cloud';else if(p.kind==='island')p.skyKind='island';}
  // Updrafts and cross-winds: the sky pushes back, and it is visible in the renderer.
  const winds=n===1?[]:n===2?[.34,.68]:n===3?[.24,.5,.78]:[.2,.45,.7,.9];
  winds.forEach((f,i)=>s.currents.push({x:end*f-90,w:180,y:120,h:floor-150,vx:i%2?42:-36,vy:-24,kind:'wind'}));
  // A drifting airship deck and a windmill platform, both real moving platforms.
  if(n>=2){const x=end*.42;s.platforms.push({x,y:floor-150,w:180,h:26,kind:'airship',oneWay:true,originX:x,originY:floor-150,motion:{x:60,y:18,speed:.5}});}
  if(n>=3){const x=end*.72;s.platforms.push({x,y:floor-206,w:150,h:26,kind:'airship',oneWay:true,originX:x,originY:floor-206,motion:{x:48,y:30,speed:.62}});
   s.platforms.push({x:x-210,y:floor-118,w:140,h:26,kind:'cloud',oneWay:true});}
  // Small cloud stepping stones beside the widest gaps: an optional upper line, never a bridge.
  pits.forEach((pit,i)=>{if(pit.w<110)return;s.platforms.push({x:pit.x-16,y:floor-126,w:Math.min(96,pit.w+32),h:22,kind:'cloud',oneWay:true,originX:pit.x-16,originY:floor-126,motion:{x:0,y:16,speed:.8+i*.07}});});
 };
 const previous=H.decorateWorldStage;H.decorateWorldStage=s=>{previous?.(s);if(s.worldId!==3)return;
  if(s.hybrid)s.runZones=s.words.map((_,i)=>({x:i*s.span,w:290}));
  s.platforms.forEach((a,i)=>{a.kind='floating';a.oneWay=true;a.h=55;if(s.moving){a.originX=a.x;a.originY=a.y;a.motion={x:30,y:60,speed:.65+i*.05};}});
  s.words.forEach((_,i)=>{const x=i*s.span,level=s.number,kind=['cloud-rascal','storm-bat','spark-drake'][(i+level-1)%3];if(s.current)s.currents.push({x:x+250,w:350,vx:i%2?-55:65,vy:-20});s.enemies.push({x:x+425,y:130+(i%3)*85,w:50,h:48,left:x+300,right:x+565,dir:i%2?1:-1,speed:48+level*10,kind,baseY:130+(i%3)*85,phase:i,level,hp:level>=3&&kind==='spark-drake'?2:1,flying:true});if(level>=3&&i%2===0)s.enemies.push({x:x+560,y:245,w:46,h:44,left:x+500,right:x+625,dir:-1,speed:62+level*8,kind:'storm-bat',baseY:245,phase:i+4,level,hp:level===4?2:1,flying:true});});
 };
})(HangulRunner);
