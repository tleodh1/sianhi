/* Authored short routes. Registry IDs, curriculum pools and physics remain unchanged. */
(function(H){
 H.LEARNING_TILE={unit:48,maxWidth:72,height:48};
 H.learningTile=function(text){return {w:String(text).length>2?72:48,h:48};};
 const themes={1:['첫 글자 산책','성장 벽돌 정원','별빛 다리'],2:['산호 사이 수영','해초 물살 탐험','진주 조개 보물'],3:['날개 첫 비행','움직이는 구름','바람의 징검다리'],4:['수정 발판','숨은 보석 벽돌','박쥐 동굴 길'],5:['화석 다리','둥지 보물','공룡 발자국'],6:['눈꽃 미끄럼','얼음 전망대','숨은 눈별'],7:['용암 징검다리','불씨 벽돌','화산 타이밍'],8:['폭풍 발판','전기 타이밍','번개 보물'],9:['낮은 중력 도약','떠다니는 전망대','별자리 순서']};
 for(const d of H.worldStages){d.curriculumPool=[...d.words];if(d.worldId===3)d.ordered=true;const count=d.boss?6:d.worldId===1?4:d.number===3?6:4;
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
  // Real terrain gaps: WORLD 1 now has jumpable pits that are fatal on a miss.
  const forestPitBeats=s.worldId===1?(n===1?[4]:n===2?[2,5]:n===3?[2,4,6]:[3,5]):[];
  const skyPitBeats=s.worldId===3?(n===1?[3]:n===2?[2,5]:n===3?[1,3,5]:[2,5]):[];
  const undergroundPitBeats=s.worldId===4?(n===1?[2,5]:n===2?[1,3,5]:n===3?[1,2,4,6]:[1,3,5]):[];
  for(let i=0;i<7;i++){const x=i*beat,isForestPit=forestPitBeats.includes(i),isSkyPit=skyPitBeats.includes(i),isUndergroundPit=undergroundPitBeats.includes(i),isFatalPit=isForestPit||isSkyPit||isUndergroundPit,gap=isForestPit?(n===1?76:n===2?92:108):isSkyPit?(n===1?90:n===2?110:125):isUndergroundPit?(n===1?95:n===2?112:132):(!swim&&!sky&&n===3&&[2,4].includes(i)?85:0);s.platforms.push({x,y:swim?[510,480,500][i%3]:420,w:Math.max(120,beat-gap)+1,h:300,kind:'ground'});
   if(gap&&!isFatalPit){s.platforms.push({x:x+beat-180,y:340,w:110,h:24,kind:'bridge',oneWay:true});}
   if(isFatalPit){const pitStart=x+Math.max(120,beat-gap),pitWidth=gap;s.hazards.push({kind:'void',x:pitStart,y:420,w:pitWidth,h:180,fatal:true});}
  }
  s.items=s.words.map((text,i)=>({id:`letter-${i}`,index:i,kind:'letter',text,x:300+(end-1000)*i/(s.words.length-1),y:swim?[270,215,310,250,300,210][i]:sky?329:368,...H.learningTile(text)}));
  // Coins lead the eye between learning stops; a modest replay-only bonus shift never moves answers.
  const bonusShift=Math.floor(Math.random()*3)*12;
  for(let i=0;i<18;i++)s.items.push({id:`route-coin-${i}`,kind:'coin',x:400+i*(end-900)/18,y:swim?340:350,w:26,h:30});
  for(let i=0;i<3;i++)s.items.push({id:`star-${i}`,kind:'star',x:end*[.23,.55,.8][i]+bonusShift,y:swim?160:sky?(i?120:260):260,w:32,h:36,requiresFlight:sky&&i>0});
  if(![1,2,3,4].includes(s.worldId))s.items.push({id:'route-growth',kind:'power',x:490,y:swim?285:365,w:40,h:45},{id:'route-power-star',kind:'powerStar',x:end*.4,y:swim?250:365,w:40,h:42});
  const rowFractions=s.worldId===1?(n===1?[.14,.32,.52,.72]:n===2?[.12,.3,.5,.7,.84]:[.14,.28,.45,.62,.78]):s.worldId===2?(n===1?[.13,.31,.52,.74]:n===2?[.1,.26,.44,.62,.8]:n===3?[.08,.21,.36,.52,.68,.83]:[.1,.24,.4,.56,.72,.86]):s.worldId===3?(n===1?[.12,.28,.46,.65,.82]:n===2?[.1,.24,.39,.55,.7,.84]:n===3?[.09,.21,.34,.48,.62,.76,.88]:[.1,.24,.4,.57,.73,.86]):s.worldId===4?(n===1?[.11,.27,.46,.66,.83]:n===2?[.09,.23,.39,.56,.72,.87]:n===3?[.08,.2,.34,.49,.64,.78,.9]:[.1,.24,.4,.57,.73,.87]):n===2?[.18,.47,.7]:[.2,.67];
  rowFractions.forEach((fraction,i)=>{const x=end*fraction,y=floor-H.PLAYER_FORMS.big.h-38-48;
   for(let j=0;j<3;j++){const blockY=(s.worldId===4&&s.boss&&i===1&&j===0)?y-48:y;s.blocks.push({id:`route-block-${i}-${j}`,x:x+j*54,y:blockY,w:48,h:48,kind:['breakable','reward','hard'][j],revealed:true,rewardId:j===1?`route-reward-${i}`:null,oceanSkin:j===1?'pearl':j===0?'coral':'relic'});}
   const rewardKind=s.worldId===1?(i%4===0?'power':i%4===1?'powerStar':i%4===2?'coin':'star'):s.worldId===2?(i%4===0?'power':i%4===1?'powerStar':i%4===2?'star':'coin'):s.worldId===3?(i%3===0?'power':i%3===1?'powerStar':'star'):s.worldId===4?(i%4===0?'power':i%4===1?'powerStar':i%4===2?'coin':'star'):(i===0?'power':'star');s.items.push({id:`route-reward-${i}`,kind:rewardKind,x:0,y:0,w:40,h:rewardKind==='power'?45:42,contained:true});
  });
  for(const fraction of (n===2?[.35,.77]:n===3?[.28,.63,.83]:[.56])){const x=end*fraction;s.platforms.push({x,y:swim?400:310,w:150,h:24,kind:'floating',oneWay:true,...(n===2?{originX:x,originY:swim?400:310,motion:{x:40,y:25,speed:.7}}:{})});}
  const total=s.worldId===1?(s.boss?8:n===1?6:n===2?8:9):s.worldId===2?(s.boss?16:n===1?8:n===2?10:12):s.worldId===3?(s.boss?10:n===1?6:n===2?8:10):s.worldId===4?(s.boss?14:n===1?8:n===2?10:12):(s.boss?(swim?6:4):n===1?2:3),used=new Set();
  const preferred=swim?(s.boss?['inflate','ink','shark','eel','pinch','jelly']:n===1?['inflate','jelly']:n===2?['pinch','jelly','inflate']:['jelly','pinch','inflate']):null;
  for(let i=0;i<total;i++){let e=candidates.find(a=>!used.has(a)&&preferred?.[i]===a.behavior)||candidates.find(a=>!used.has(a)&&a.behavior!==s.enemies.at(-1)?.behavior&&(a.originalKind||a.kind)!==(s.enemies.at(-1)?.originalKind||s.enemies.at(-1)?.kind))||candidates.find(a=>!used.has(a));if(!e&&s.worldId===2&&candidates.length){const src=candidates[i%candidates.length];e={...src,id:`ocean-extra-${n}-${i}`,phase:i+11,behaviorTime:i*.47};}if(!e&&s.worldId===3&&candidates.length){const src=candidates[i%candidates.length];e={...src,id:`sky-extra-${n}-${i}`,phase:i+7,behaviorTime:i*.53};}if(!e&&s.worldId===4&&candidates.length){const src=candidates[i%candidates.length];e={...src,id:`underground-extra-${n}-${i}`,phase:i+13,behaviorTime:i*.49};}if(!e)continue;used.add(e);
   const x=end*(total===1?.48:.26+i*.56/Math.max(1,total-1));Object.assign(e,{x,left:x-65,right:x+95,speed:Math.min(65,e.speed),hp:s.worldId>=7?2:1,level:Math.min(3,e.level||1),phase:i,behaviorTime:i*.7});
   if(!swim){e.y=e.baseY=e.homeY=sky?190:420-e.h;if(s.worldId===4){e.flying=false;e.behavior=e.behavior==='dive'?'patrol':e.behavior;}}else{e.y=e.baseY=e.homeY=[360,130,390,145,430,170][i];}
   if(e.kind==='cactus'){e.left=e.right=x;e.drainY=floor;e.y=e.baseY=floor;s.platforms.push({x:x-8,y:floor-12,w:e.w+16,h:12,kind:'drain'});}s.enemies.push(e);
  }
  if(s.worldId===1){
   const forestExtra=n===1?[.22,.41,.61,.82]:[.18,.36,.57,.76,.88];
   forestExtra.forEach((fraction,i)=>{const x=end*fraction;
    if(i%2===0)s.platforms.push({x:x-80,y:300-(i%3)*28,w:145,h:24,kind:i%3===0?'bridge':'floating',oneWay:true});
    if(n>=2&&i%2===1)s.platforms.push({x:x-70,y:275,w:140,h:24,kind:'floating',oneWay:true,originX:x-70,originY:275,motion:{x:34,y:24,speed:.72+i*.04}});
   });
   if(n>=2)s.hazards.push({kind:'log',x:end*.44,y:395,w:38,h:25},{kind:'thorn',x:end*.74,y:392,w:40,h:28});
   // Keep enemies away from pit centers so deaths feel fair rather than unavoidable.
   for(const e of s.enemies){for(const h of s.hazards.filter(a=>a.kind==='pit')){const center=h.x+h.w/2;if(Math.abs(e.x-center)<120){const shift=e.x<center?-150:150;e.x+=shift;e.left+=shift;e.right+=shift;}}}
  }
  if(s.worldId===3){
   // WORLD 3 is strictly sequential: target 1 is always encountered before target 2, etc.
   const rewardBlocks=s.blocks.filter(b=>b.kind==='reward').sort((a,b)=>a.x-b.x);
   const orderedLetters=s.items.filter(a=>a.kind==='letter').sort((a,b)=>a.index-b.index);
   orderedLetters.forEach((letter,i)=>{letter.x=280+(end-900)*i/Math.max(1,orderedLetters.length-1);letter.index=i;});
   const hiddenLetterCount=s.boss?3:n===3?4:3;
   const letterCandidates=orderedLetters.slice(0,hiddenLetterCount);
   letterCandidates.forEach((letter,i)=>{const bi=Math.min(rewardBlocks.length-1,1+i*2),block=rewardBlocks[bi];if(!block)return;const orphan=block.rewardId;block.rewardId=letter.id;letter.contained=true;s.items=s.items.filter(a=>a.id!==orphan);});
   // Ensure both growth steps exist in remaining reward blocks.
   const remaining=rewardBlocks.filter(b=>!letterCandidates.some(l=>b.rewardId===l.id));
   const ensureReward=(idx,kind)=>{const b=remaining[idx];if(!b)return;const old=b.rewardId;s.items=s.items.filter(a=>a.id!==old);const id=`sky-${kind}-${idx}`;b.rewardId=id;s.items.push({id,kind,x:0,y:0,w:40,h:kind==='power'?45:42,contained:true});};
   ensureReward(0,'power');ensureReward(1,'powerStar');
   // Add more floating combat lanes, but keep every fatal pit readable.
   const lanes=n===1?[.2,.5,.74]:n===2?[.16,.34,.58,.78]:[.14,.3,.46,.64,.81];
   lanes.forEach((fraction,i)=>{const x=end*fraction;s.platforms.push({x:x-65,y:250-(i%3)*52,w:135,h:24,kind:'floating',oneWay:true,...(n>=2&&i%2?{originX:x-65,originY:250-(i%3)*52,motion:{x:34,y:34,speed:.75+i*.04}}:{})});});
   for(const e of s.enemies){for(const h of s.hazards.filter(a=>a.kind==='void')){const center=h.x+h.w/2;if(Math.abs(e.x-center)<130){const shift=e.x<center?-165:165;e.x+=shift;e.left+=shift;e.right+=shift;}}}
  }
  if(s.worldId===4){
   // WORLD 4 uses the same exploration loop as WORLD 1/2: some letters are visible,
   // while key letters and powerups come from reward blocks instead of lying on the floor.
   const rewardBlocks=s.blocks.filter(b=>b.kind==='reward').sort((a,b)=>a.x-b.x);
   const letters=s.items.filter(a=>a.kind==='letter').sort((a,b)=>a.index-b.index);
   const visibleYs=n===2?[255,190,315,225,285,165]:[300,235,175,285,215,150];
   letters.forEach((letter,i)=>{letter.y=visibleYs[(i+n)%visibleYs.length];letter.x+=((i%3)-1)*85;});
   const hiddenCount=s.boss?3:n===3?3:n===2?2:2;
   const hiddenLetters=letters.filter((_,i)=>i%2===1).slice(0,hiddenCount);
   hiddenLetters.forEach((letter,i)=>{const block=rewardBlocks[Math.min(rewardBlocks.length-1,1+i*2)]||rewardBlocks[i];if(!block)return;const old=block.rewardId;block.rewardId=letter.id;letter.contained=true;s.items=s.items.filter(a=>a.id!==old);});
   // 4-3 remains ordered: visible/hidden targets still progress left-to-right.
   if(s.ordered){letters.forEach((letter,i)=>{letter.index=i;letter.x=300+(end-1050)*i/Math.max(1,letters.length-1);});rewardBlocks.forEach((b,i)=>{const letter=hiddenLetters[i];if(letter&&b.rewardId===letter.id)b.x=Math.max(b.x,letter.x-40);});}
   // 4-4 SMALL form must always have a reachable escape route before a fatal pit.
   if(s.boss){
    const bossVoids=s.hazards.filter(a=>a.kind==='void');
    bossVoids.forEach((h,i)=>{const px=Math.max(80,h.x-125);s.platforms.push({x:px,y:350,w:92,h:20,kind:'pipe',oneWay:true});});
   }
   // Growth and power star must be earned from blocks.
   const occupied=new Set(rewardBlocks.filter(b=>hiddenLetters.some(l=>b.rewardId===l.id)));
   const available=rewardBlocks.filter(b=>!occupied.has(b));
   const setReward=(idx,kind)=>{const b=available[idx];if(!b)return;const old=b.rewardId;s.items=s.items.filter(a=>a.id!==old);const id=`underground-${kind}-${idx}`;b.rewardId=id;s.items.push({id,kind,x:0,y:0,w:40,h:kind==='power'?45:42,contained:true});};
   setReward(0,'power');setReward(1,'powerStar');
   // Keep coins as a route guide, but lift them off the floor so the stage no longer looks carpeted with pickups.
   s.items.filter(a=>a.kind==='coin'&&!a.contained).forEach((coin,i)=>{coin.y=[310,245,185,275][i%4];});
   // Sewer/drain hazards and vertical enemy variety.
   const pits=s.hazards.filter(a=>a.kind==='void');
   const drainFractions=n===1?[.18,.38,.68,.86]:n===2?[.12,.29,.47,.66,.84]:[.1,.24,.39,.54,.69,.84];
   drainFractions.forEach((fraction,i)=>{const x=end*fraction;s.platforms.push({x:x-30,y:408,w:60,h:12,kind:'drain',oneWay:false});
    if(i%2===0)s.enemies.push({id:`sewer-cactus-${n}-${i}`,kind:'cactus',x:x-18,y:420,w:48,h:52,left:x-18,right:x-18,dir:-1,speed:0,baseY:420,homeY:420,drainY:420,phase:i+20,level:n,hp:1,retracted:true,stompable:false,behavior:'emerge'});
    else s.enemies.push({id:`sewer-shell-${n}-${i}`,kind:'gear-shell',x:x-30,y:372,w:50,h:48,left:x-110,right:x+110,dir:i%3?1:-1,speed:52+n*5,baseY:372,homeY:372,phase:i+24,level:n,hp:n>=3?2:1,flying:false,armored:true,behavior:'patrol',behaviorTime:i*.6,rollSpeed:360+n*12});
   });
   for(const f of (n===1?[.3,.76]:n===2?[.2,.55,.78]:[.17,.33,.58,.77,.91])){const x=end*f;s.hazards.push({kind:'open-drain',x:x-22,y:402,w:44,h:28,fatal:true});}
   for(const e of s.enemies)for(const h of pits){const center=h.x+h.w/2,margin=s.boss?180:105;if(Math.abs(e.x-center)<margin){const shift=e.x<center?-(margin+45):(margin+45);e.x+=shift;e.left+=shift;e.right+=shift;}}
  }
  if(s.worldId===2){
   const rewardBlocks=s.blocks.filter(b=>b.kind==='reward');
   const hideCount=s.boss?4:n===3?2:n===2?3:2;
   const letters=s.items.filter(a=>a.kind==='letter');
   // Visible letters no longer sit on one flat line: alternate upper/middle/lower swim lanes.
   const lanes=[155,245,335,205,300,120];
   letters.forEach((letter,i)=>{letter.y=lanes[(i+n)%lanes.length];letter.x+=((i%3)-1)*70;if(n===3&&i===2){letter.y=125;letter.x+=90;letter.contained=false;}});
   letters.slice(0,hideCount).forEach((letter,i)=>{const block=rewardBlocks[Math.min(rewardBlocks.length-1,i*2+1)]||rewardBlocks[i];if(!block)return;const old=block.rewardId;block.rewardId=letter.id;letter.contained=true;s.items=s.items.filter(a=>a.id!==old);});
   const occupied=new Set(letters.filter(l=>l.contained).map(l=>rewardBlocks.find(b=>b.rewardId===l.id)));
   const available=rewardBlocks.filter(b=>!occupied.has(b));
   const setReward=(idx,kind)=>{const b=available[idx];if(!b)return;const old=b.rewardId;s.items=s.items.filter(a=>a.id!==old);const id=`ocean-${kind}-${idx}`;b.rewardId=id;s.items.push({id,kind,x:0,y:0,w:40,h:kind==='power'?45:42,contained:true});};
   setReward(0,'power');setReward(1,'powerStar');
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
