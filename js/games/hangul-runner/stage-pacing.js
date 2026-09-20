/* Authored short routes. Registry IDs, curriculum pools and physics remain unchanged. */
(function(H){
 H.LEARNING_TILE={unit:48,maxWidth:72,height:48};
 H.learningTile=function(text){return {w:String(text).length>2?72:48,h:48};};
 const themes={1:['첫 글자 산책','성장 벽돌 정원','별빛 다리'],2:['산호 사이 수영','해초 물살 탐험','진주 조개 보물'],3:['날개 첫 비행','움직이는 구름','바람의 징검다리'],4:['수정 발판','숨은 보석 벽돌','박쥐 동굴 길'],5:['화석 다리','둥지 보물','공룡 발자국'],6:['눈꽃 미끄럼','얼음 전망대','숨은 눈별'],7:['용암 징검다리','불씨 벽돌','화산 타이밍'],8:['폭풍 발판','전기 타이밍','번개 보물'],9:['낮은 중력 도약','떠다니는 전망대','별자리 순서']};
 for(const d of H.worldStages){d.curriculumPool=[...d.words];const count=d.boss?6:d.worldId===1?4:d.number===3?6:4;
  const offset=d.worldId===1?0:((d.number-1)*3)%Math.max(1,d.words.length);d.words=Array.from({length:count},(_,i)=>d.curriculumPool[(offset+i)%d.curriculumPool.length]);
  d.routeTheme=d.boss?'수호자에게 가는 길':themes[d.worldId][d.number-1];d.targetSeconds=d.boss?[45,70]:[25,35];
  d.routeLength=d.mode==='swim'?4800:d.mode==='fly'?6600:7500; if(d.boss)d.routeLength=d.mode==='swim'?4200:d.mode==='fly'?7600:8200;
  d.span=(d.routeLength-700)/d.words.length;
  d.composition={terrainPattern:d.number===3?'bridge-gaps':d.number===2?'moving-lookout':'safe-trail',learningPattern:d.ordered?'ordered':'visible-route',enemyPattern:d.number===1?'sparse':'alternating',rewardPattern:d.number===2?'growth-bricks':'star-trail',specialEvent:d.worldId===2?'clam-current':d.worldId===3?'flight':d.number===3?'star-power':'bonus-brick'};
 }
 H.finishStagePacing=function(s){
  const swim=s.mode==='swim',sky=s.worldId===3,floor=swim?510:420,end=s.length,n=s.number;
  const candidates=s.enemies.slice();s.enemies=[];s.blocks=[];s.hazards=[];s.currents=[];s.gates=[];if(swim)delete s.waterZones;s.runZones=[];s.oceanShells=[];
  s.platforms=[];const beat=end/7;
  for(let i=0;i<7;i++){const x=i*beat,gap=!swim&&!sky&&n===3&&[2,4].includes(i)?85:0;s.platforms.push({x,y:swim?[510,480,500][i%3]:420,w:beat-gap+1,h:300,kind:'ground'});
   if(gap){s.platforms.push({x:x+beat-180,y:340,w:110,h:24,kind:'bridge',oneWay:true});}
  }
  s.items=s.words.map((text,i)=>({id:`letter-${i}`,index:i,kind:'letter',text,x:300+(end-1000)*i/(s.words.length-1),y:swim?[270,215,310,250,300,210][i]:sky?329:368,...H.learningTile(text)}));
  // Coins lead the eye between learning stops; a modest replay-only bonus shift never moves answers.
  const bonusShift=Math.floor(Math.random()*3)*12;
  for(let i=0;i<18;i++)s.items.push({id:`route-coin-${i}`,kind:'coin',x:400+i*(end-900)/18,y:swim?340:350,w:26,h:30});
  for(let i=0;i<3;i++)s.items.push({id:`star-${i}`,kind:'star',x:end*[.23,.55,.8][i]+bonusShift,y:swim?160:sky?(i?120:260):260,w:32,h:36,requiresFlight:sky&&i>0});
  s.items.push({id:'route-growth',kind:'power',x:490,y:swim?285:365,w:40,h:45},{id:'route-power-star',kind:'powerStar',x:end*.4,y:swim?250:365,w:40,h:42});
  const rowFractions=n===2?[.18,.47,.7]:[.2,.67];
  rowFractions.forEach((fraction,i)=>{const x=end*fraction,y=floor-H.PLAYER_FORMS.big.h-38-48;
   for(let j=0;j<3;j++)s.blocks.push({id:`route-block-${i}-${j}`,x:x+j*54,y,w:48,h:48,kind:['breakable','reward','hard'][j],revealed:true,rewardId:j===1?`route-reward-${i}`:null,oceanSkin:j===1?'pearl':j===0?'coral':'relic'});
   s.items.push({id:`route-reward-${i}`,kind:i===0?'power':'star',x:0,y:0,w:40,h:42,contained:true});
  });
  for(const fraction of (n===2?[.35,.77]:n===3?[.28,.63,.83]:[.56])){const x=end*fraction;s.platforms.push({x,y:swim?400:310,w:150,h:24,kind:'floating',oneWay:true,...(n===2?{originX:x,originY:swim?400:310,motion:{x:40,y:25,speed:.7}}:{})});}
  const total=s.boss?(swim?6:4):n===1?(s.worldId===1?1:2):3,used=new Set();
  const preferred=swim?(s.boss?['inflate','ink','shark','eel','pinch','jelly']:n===1?['inflate','jelly']:n===2?['pinch','jelly','inflate']:['jelly','pinch','inflate']):null;
  for(let i=0;i<total;i++){let e=candidates.find(a=>!used.has(a)&&preferred?.[i]===a.behavior)||candidates.find(a=>!used.has(a)&&a.behavior!==s.enemies.at(-1)?.behavior&&(a.originalKind||a.kind)!==(s.enemies.at(-1)?.originalKind||s.enemies.at(-1)?.kind))||candidates.find(a=>!used.has(a));if(!e)continue;used.add(e);
   const x=end*(total===1?.48:.26+i*.56/Math.max(1,total-1));Object.assign(e,{x,left:x-65,right:x+95,speed:Math.min(65,e.speed),hp:s.worldId>=7?2:1,level:Math.min(3,e.level||1),phase:i,behaviorTime:i*.7});
   if(!swim){e.y=e.baseY=e.homeY=sky?190:420-e.h;}else{e.y=e.baseY=e.homeY=[360,130,390,145,430,170][i];}
   if(e.kind==='cactus'){e.left=e.right=x;e.drainY=floor;e.y=e.baseY=floor;s.platforms.push({x:x-8,y:floor-12,w:e.w+16,h:12,kind:'drain'});}s.enemies.push(e);
  }
  if(swim){s.oceanShells=[{id:'route-clam',x:end*.58,y:435,w:82,h:55,opened:false,rewardId:'route-pearl'}];s.items.push({id:'route-pearl',kind:'coin',x:end*.58+24,y:390,w:30,h:36,contained:true});s.currents.push({x:end*.73,w:100,y:160,h:310,vx:0,vy:-180,kind:'bubble-column'});if(n>=2)s.currents.push({x:end*.32,w:220,y:150,h:220,vx:n===2?25:-20,vy:0});if(s.boss)s.platforms.push({x:end*.63,y:60,w:190,h:32,kind:'reef-ceiling'});}
  if(sky){for(let i=0;i<4;i++)s.items.push({id:i?`flight-backup-${i}`:'flight-wings',kind:'flight',x:i?end*i/4:112,y:351,w:48,h:48});}
  if(s.worldId===7||s.worldId===8)s.hazards.push({kind:s.worldId===7?'lava':'electric',x:end*.59,y:400,w:32,h:20,phase:0});
  // Keep required tiles accessible and visually separate from blocks and elevated terrain.
  for(const item of s.items.filter(a=>a.kind==='letter'))for(const obstacle of [...s.blocks,...s.platforms.filter(p=>p.kind!=='ground')])if(H.overlaps(item,obstacle))item.x=obstacle.x+obstacle.w+24;
  s.checkpoints=[{id:0,x:60,y:swim?310:420},{id:1,x:end*.5+200,y:swim?310:420}];
  s.chapters=Array.from({length:7},(_,i)=>({x:i*beat,kind:['arrival','reward-bridge','stepping-stones','moving-lookout','secret-overlook','guardian-approach','goal'][i],text:`${s.routeTheme} · ${['출발','보상 찾기','길 건너기','주변 살피기','별빛 도전','마지막 글자','도착'][i]}`}));
  return s;
 };
})(HangulRunner);
