(function(H){
 H.registerWorld({id:3,name:'하늘 왕국',theme:'sky',mode:'fly',color:'#7565cf',description:'비행 장치로 구름과 성 사이를 날아요',notes:[659,880,1046]},[
 {number:1,name:'구름길',words:['하','늘','구','름'],story:'떠 있는 섬에서는 달리고, 무지개 구간에서는 ↑ ↓로 날아요.',hybrid:true,gap:160},
 {number:2,name:'비행선',words:['바람','새','날개','비행'],story:'바람을 느끼며 움직이는 비행선 사이를 날아요.',moving:true,current:true,gap:220},
 {number:3,name:'하늘 성',words:['하늘','구름','나는','새'],story:'하늘 → 구름 → 나는 → 새! 순서대로 읽으며 모아요.',ordered:true,gap:250},
 {number:4,name:'하늘왕',words:['늘','름','새','요'],story:'날면서 알맞은 글자를 찾아 폭풍을 잠재워요.',boss:{name:'폭풍날개 세루',style:'sky',attacks:['wind','lightning','charge'],questions:[['하○','늘','물','길'],['구○','름','달','별'],['나는 ○','새','집','물'],['날아○','요','가','다']]}}
 ]);
 const previous=H.decorateWorldStage;H.decorateWorldStage=s=>{previous?.(s);if(s.worldId!==3)return;
  if(s.hybrid)s.runZones=s.words.map((_,i)=>({x:i*650,w:290}));
  s.platforms.forEach((a,i)=>{a.kind='floating';a.oneWay=true;a.h=55;if(s.moving){a.originX=a.x;a.originY=a.y;a.motion={x:30,y:60,speed:.65+i*.05};}});
  s.words.forEach((_,i)=>{const x=i*650,level=s.number,kind=['cloud-rascal','storm-bat','spark-drake'][(i+level-1)%3];if(s.current)s.currents.push({x:x+250,w:350,vx:i%2?-55:65,vy:-20});s.enemies.push({x:x+425,y:130+(i%3)*85,w:50,h:48,left:x+300,right:x+565,dir:i%2?1:-1,speed:48+level*10,kind,baseY:130+(i%3)*85,phase:i,level,hp:level>=3&&kind==='spark-drake'?2:1,flying:true});if(level>=3&&i%2===0)s.enemies.push({x:x+560,y:245,w:46,h:44,left:x+500,right:x+625,dir:-1,speed:62+level*8,kind:'storm-bat',baseY:245,phase:i+4,level,hp:level===4?2:1,flying:true});});
 };
})(HangulRunner);
