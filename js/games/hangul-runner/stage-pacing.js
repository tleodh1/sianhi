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
  s.platforms=[];const beat=end/7,k=Math.min(3,n-1);
  const pitTable={1:[[1],[2,5],[2,4,6],[2,4,6]],3:[[2,5],[1,4,6],[1,3,5,7],[1,3,5,7]],4:[[2,5],[1,3,6,8],[1,3,5,7,9],[1,2,4,6,8,10]],5:[[2,5,8],[1,3,6,9],[1,3,5,7,9],[1,2,4,6,8,10]],6:[[2,6],[1,3,6,9],[1,3,5,7,9],[1,3,5,7,10]],7:[[1,3,6,9],[1,3,5,7,10],[1,3,5,7,9,11],[1,2,4,6,8,10,12]],8:[[1,3,6,9],[1,3,5,7,9,11],[1,3,5,7,9,11,13],[1,2,4,6,8,10,12,14]],9:[[1,3,5,8,11],[1,3,5,7,9,11,13],[1,3,5,7,9,11,13,15],[1,3,5,7,9,11,13,15,17]]};
  const pitSlots=!swim?(pitTable[s.worldId]?.[k]||[]):[],pitUnit=end/19;
  const pits=pitSlots.map((slot,i)=>{const width=Math.min(150,76+s.worldId*5+n*7+(i%2)*8),x=Math.max(240,Math.min(end-520,slot*pitUnit));return {kind:'void',x,y:420,w:width,h:180,fatal:true};}).sort((a,b)=>a.x-b.x);
  if(swim){for(let i=0;i<7;i++)s.platforms.push({x:i*beat,y:[510,480,500][i%3],w:beat+1,h:300,kind:'ground'});}
  else{let cursor=0;for(const pit of pits){if(pit.x-cursor>150)s.platforms.push({x:cursor,y:420,w:pit.x-cursor,h:300,kind:'ground'});s.hazards.push(pit);cursor=pit.x+pit.w;}if(end-cursor>120)s.platforms.push({x:cursor,y:420,w:end-cursor+1,h:300,kind:'ground'});}
  s.items=s.words.map((text,i)=>({id:`letter-${i}`,index:i,kind:'letter',text,x:300+(end-1000)*i/(s.words.length-1),y:swim?[270,215,310,250,300,210][i]:sky?329:368,...H.learningTile(text)}));
  // Coins lead the eye between learning stops; a modest replay-only bonus shift never moves answers.
  const bonusShift=Math.floor(Math.random()*3)*12;
  for(let i=0;i<18;i++)s.items.push({id:`route-coin-${i}`,kind:'coin',x:400+i*(end-900)/18,y:swim?340:350,w:26,h:30});
  for(let i=0;i<3;i++)s.items.push({id:`star-${i}`,kind:'star',x:end*[.23,.55,.8][i]+bonusShift,y:swim?160:sky?(i?120:260):260,w:32,h:36,requiresFlight:sky&&i>0});
  const rowFractions=s.worldId===1?(n===1?[.14,.32,.52,.72]:n===2?[.12,.3,.5,.7,.84]:[.14,.28,.45,.62,.78]):s.worldId===2?(n===1?[.13,.31,.52,.74]:n===2?[.1,.26,.44,.62,.8]:n===3?[.08,.21,.36,.52,.68,.83]:[.1,.24,.4,.56,.72,.86]):s.worldId===3?(n===1?[.12,.28,.46,.65,.82]:n===2?[.1,.24,.39,.55,.7,.84]:n===3?[.09,.21,.34,.48,.62,.76,.88]:[.1,.24,.4,.57,.73,.86]):s.worldId===4?(n===1?[.11,.27,.46,.66,.83]:n===2?[.09,.23,.39,.56,.72,.87]:n===3?[.08,.2,.34,.49,.64,.78,.9]:[.1,.24,.4,.57,.73,.87]):s.worldId>=5?(n===1?[.12,.3,.5,.7,.85]:n===2?[.1,.25,.42,.59,.76,.89]:[.09,.22,.36,.5,.64,.78,.9]):n===2?[.18,.47,.7]:[.2,.67];
  rowFractions.forEach((fraction,i)=>{const x=end*fraction,y=floor-H.PLAYER_FORMS.big.h-38-48;
   for(let j=0;j<3;j++){const blockY=(s.worldId===4&&s.boss&&(i===1||i===3))?y-48:y;s.blocks.push({id:`route-block-${i}-${j}`,x:x+j*54,y:blockY,w:48,h:48,kind:['breakable','reward','hard'][j],revealed:true,rewardId:j===1?`route-reward-${i}`:null,oceanSkin:j===1?'pearl':j===0?'coral':'relic'});}
   const rewardKind=s.worldId===1?(i%4===0?'power':i%4===1?'powerStar':i%4===2?'coin':'star'):s.worldId===2?(i%4===0?'power':i%4===1?'powerStar':i%4===2?'star':'coin'):s.worldId===3?(i%3===0?'power':i%3===1?'powerStar':'star'):s.worldId===4?(i%4===0?'power':i%4===1?'powerStar':i%4===2?'coin':'star'):s.worldId>=5?(i%4===0?'power':i%4===1?'powerStar':i%4===2?'coin':'star'):(i===0?'power':'star');s.items.push({id:`route-reward-${i}`,kind:rewardKind,x:0,y:0,w:40,h:rewardKind==='power'?45:42,contained:true});
  });
  for(const fraction of (n===2?[.35,.77]:n===3?[.28,.63,.83]:[.56])){const x=end*fraction;s.platforms.push({x,y:swim?400:310,w:150,h:24,kind:'floating',oneWay:true,...(n===2?{originX:x,originY:swim?400:310,motion:{x:40,y:25,speed:.7}}:{})});}
  const enemyTable={1:[5,8,10,10],2:[9,11,13,17],3:[8,10,12,13],4:[11,14,17,20],5:[12,15,18,21],6:[13,16,19,22],7:[14,17,20,24],8:[15,18,22,26],9:[17,20,24,28]},total=enemyTable[s.worldId]?.[k]||6,used=new Set();
  const preferred=swim?(s.boss?['inflate','ink','shark','eel','pinch','jelly']:n===1?['inflate','jelly']:n===2?['pinch','jelly','inflate']:['jelly','pinch','inflate']):null;
  for(let i=0;i<total;i++){let e=candidates.find(a=>!used.has(a)&&preferred?.[i]===a.behavior)||candidates.find(a=>!used.has(a)&&a.behavior!==s.enemies.at(-1)?.behavior&&(a.originalKind||a.kind)!==(s.enemies.at(-1)?.originalKind||s.enemies.at(-1)?.kind))||candidates.find(a=>!used.has(a));if(!e&&candidates.length){const src=candidates[i%candidates.length];e={...src,id:`${s.theme}-extra-${n}-${i}`,phase:i+11,behaviorTime:i*.47};}if(!e)continue;if(candidates.includes(e))used.add(e);
   const x=end*(total===1?.48:.1+i*.82/Math.max(1,total-1));Object.assign(e,{x,left:x-65,right:x+95,speed:Math.min(65,e.speed),hp:s.worldId>=7?2:1,level:Math.min(3,e.level||1),phase:i,behaviorTime:i*.7});
   if(!swim){e.y=e.baseY=e.homeY=sky?190:420-e.h;if(s.worldId===4){e.flying=false;e.behavior=e.behavior==='dive'?'patrol':e.behavior;}}else{e.y=e.baseY=e.homeY=[360,130,390,145,430,170][i];}
   if(e.kind==='cactus'){e.left=e.right=x;e.drainY=floor;e.y=e.baseY=floor;s.platforms.push({x:x-8,y:floor-12,w:e.w+16,h:12,kind:'drain'});}s.enemies.push(e);
  }
  if(s.worldId===3&&H.decorateSkyRoute)H.decorateSkyRoute(s,{floor,end,n,pits});
  if(s.worldId>=5&&H.decorateLateWorld)H.decorateLateWorld(s,{floor,end,n,pits});
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
   // WORLD 4 is a pure run/jump world: no swim/flight traversal.
   delete s.waterZones;s.mode='run';s.flightPickup=false;
   for(const item of s.items.filter(a=>a.kind==='flight'))item.contained=true;
   // Every 3-block row must have a reachable takeoff surface underneath.
   const rows=new Map();
   for(const b of s.blocks){const key=b.id?.match(/^route-block-(\d+)-/)?.[1];if(key!==undefined){if(!rows.has(key))rows.set(key,[]);rows.get(key).push(b);}}
   for(const blocks of rows.values()){
    const minX=Math.min(...blocks.map(b=>b.x)),maxX=Math.max(...blocks.map(b=>b.x+b.w));
    const support=s.platforms.some(p=>p.x<=minX+20&&p.x+p.w>=maxX-20&&p.y>=300&&p.y<=420);
    if(!support)s.platforms.push({x:minX-36,y:350,w:(maxX-minX)+72,h:22,kind:'pipe',oneWay:true});
    for(const b of blocks)if(b.y<202)b.y=202;
   }
   // WORLD 4 pickup mix mirrors WORLD 1/2: some on the floor, some elevated, some inside reward blocks.
   const rewardBlocks=s.blocks.filter(b=>b.kind==='reward').sort((a,b)=>a.x-b.x);
   const letters=s.items.filter(a=>a.kind==='letter').sort((a,b)=>a.index-b.index);
   const letterLanes=n===1?[368,300,235,368,280,210]:n===2?[350,275,205,330,245,175]:n===3?[335,250,180,305,225,155]:[320,235,165,290,205,145];
   letters.forEach((letter,i)=>{letter.y=letterLanes[i%letterLanes.length];letter.x+=((i%3)-1)*(n===1?55:75);});
   const hiddenCount=s.boss?3:n===3?3:n===2?2:1;
   const hiddenLetters=letters.filter((_,i)=>i%2===1).slice(0,hiddenCount);
   hiddenLetters.forEach((letter,i)=>{const block=rewardBlocks[Math.min(rewardBlocks.length-1,1+i*2)]||rewardBlocks[i];if(!block)return;const old=block.rewardId;block.rewardId=letter.id;letter.contained=true;s.items=s.items.filter(a=>a.id!==old);});
   // 4-3 remains ordered and traverses left-to-right.
   if(s.ordered){letters.forEach((letter,i)=>{letter.index=i;letter.x=300+(end-1050)*i/Math.max(1,letters.length-1);});}
   // 4-4 hand-tuned jump routes retained.
   if(s.boss){
    const row430=rewardBlocks[3];if(row430)s.platforms.push({x:row430.x-115,y:350,w:78,h:18,kind:'pipe',oneWay:true});
    for(const h of s.hazards.filter(a=>a.kind==='void')){const px=Math.max(80,h.x-125);s.platforms.push({x:px,y:350,w:92,h:20,kind:'pipe',oneWay:true});}
    if(row430){const zoneStart=row430.x-180,zoneEnd=row430.x+180;for(const e of s.enemies){if(e.x>zoneStart&&e.x<zoneEnd){const shift=e.x<row430.x?-170:170;e.x+=shift;e.left+=shift;e.right+=shift;}}}
   }
   // Growth + power star are block rewards; one ordinary star is also hidden in a block.
   const occupied=new Set(rewardBlocks.filter(b=>hiddenLetters.some(l=>b.rewardId===l.id)));
   const available=rewardBlocks.filter(b=>!occupied.has(b));
   const setReward=(idx,kind,id=`underground-${kind}-${idx}`)=>{const b=available[idx];if(!b)return null;const old=b.rewardId;s.items=s.items.filter(a=>a.id!==old);b.rewardId=id;let item=s.items.find(a=>a.id===id);if(!item){item={id,kind,x:0,y:0,w:kind==='coin'?26:40,h:kind==='power'?45:42,contained:true};s.items.push(item);}else item.contained=true;return b;};
   setReward(0,'power');setReward(1,'powerStar');
   const blockStar=s.items.find(a=>a.id==='star-2');if(blockStar&&available[2]){const b=available[2],old=b.rewardId;s.items=s.items.filter(a=>a.id!==old||a===blockStar);b.rewardId=blockStar.id;blockStar.contained=true;}
   // Route coins deliberately alternate floor/elevated heights rather than forming one carpet.
   const coinLanes=n===1?[350,310,350,265,350,225]:n===2?[350,295,245,350,210,280]:n===3?[350,275,215,325,185,250]:[350,260,200,310,170,235];
   s.items.filter(a=>a.kind==='coin'&&!a.contained).forEach((coin,i)=>{coin.y=coinLanes[i%coinLanes.length];});
   const visibleStars=s.items.filter(a=>a.kind==='star'&&!a.contained);visibleStars.forEach((star,i)=>{star.y=i%2?220:340;});
   // Progressive sewer hazards: each stage adds more drains and tougher spacing.
   const pits=s.hazards.filter(a=>a.kind==='void');
   const drainFractions=n===1?[.42,.78]:n===2?[.22,.5,.78]:n===3?[.14,.34,.56,.78]:[.1,.24,.4,.56,.72,.88];
   drainFractions.forEach((fraction,i)=>{const x=end*fraction;s.platforms.push({x:x-30,y:408,w:60,h:12,kind:'drain',oneWay:false});
    if(i%2===0)s.enemies.push({id:`sewer-cactus-${n}-${i}`,kind:'cactus',x:x-18,y:420,w:48,h:52,left:x-18,right:x-18,dir:-1,speed:0,baseY:420,homeY:420,drainY:420,phase:i+20,level:n,hp:n>=3?2:1,retracted:true,stompable:false,behavior:'emerge'});
    else s.enemies.push({id:`sewer-shell-${n}-${i}`,kind:'gear-shell',x:x-30,y:372,w:50,h:48,left:x-110,right:x+110,dir:i%3?1:-1,speed:50+n*6,baseY:372,homeY:372,phase:i+24,level:n,hp:n>=3?2:1,flying:false,armored:true,behavior:'patrol',behaviorTime:i*.6,rollSpeed:350+n*18});
   });
   const openDrainFractions=n===1?[.64]:n===2?[.3,.72]:n===3?[.2,.48,.82]:[.16,.34,.52,.7,.9];
   for(const f of openDrainFractions){const x=end*f;s.hazards.push({kind:'open-drain',x:x-22,y:402,w:44,h:28,fatal:true});}
   // Preserve a readable takeoff/landing zone around every fatal void, especially at higher difficulty.
   for(const e of s.enemies)for(const h of pits){const center=h.x+h.w/2,margin=95+n*20;if(Math.abs(e.x-center)<margin){const shift=e.x<center?-(margin+45):(margin+45);e.x+=shift;e.left+=shift;e.right+=shift;}}
  }
  if(s.worldId>=5){
   const rewardBlocks=s.blocks.filter(b=>b.kind==='reward').sort((a,b)=>a.x-b.x),letters=s.items.filter(a=>a.kind==='letter').sort((a,b)=>a.index-b.index);
   const lanes=[368,305,245,335,205,280,170];letters.forEach((letter,i)=>{letter.y=lanes[(i+n+s.worldId)%lanes.length];letter.x+=((i%3)-1)*65;});
   const hiddenCount=Math.min(letters.length-1,n===1?1:n===2?2:n===3?3:4),chosen=[];
   letters.filter((_,i)=>i%2===1).slice(0,hiddenCount).forEach((letter,i)=>{const block=rewardBlocks.find((b,bi)=>!chosen.includes(b)&&bi>=i);if(!block)return;chosen.push(block);const old=block.rewardId;block.rewardId=letter.id;letter.contained=true;s.items=s.items.filter(a=>a.id!==old||a===letter);});
   const free=rewardBlocks.filter(b=>!chosen.includes(b));
   const setReward=(idx,kind)=>{const b=free[idx];if(!b)return;const old=b.rewardId;s.items=s.items.filter(a=>a.id!==old);const id=`late-${kind}-${idx}`;b.rewardId=id;s.items.push({id,kind,x:0,y:0,w:40,h:kind==='power'?45:42,contained:true});};
   setReward(0,'power');setReward(1,'powerStar');
   const coinLanes=[350,300,240,350,205,275];s.items.filter(a=>a.kind==='coin'&&!a.contained).forEach((coin,i)=>coin.y=coinLanes[i%coinLanes.length]);
   s.items.filter(a=>a.kind==='star'&&!a.contained).forEach((star,i)=>star.y=i%2?215:320);
  }
  if(s.worldId===2){
   const rewardBlocks=s.blocks.filter(b=>b.kind==='reward');
   const hideCount=s.boss?4:n===3?2:n===2?3:2;
   const letters=s.items.filter(a=>a.kind==='letter');
   // Visible letters no longer sit on one flat line: alternate upper/middle/lower swim lanes.
   const lanes=[155,245,335,205,300,120];
   letters.forEach((letter,i)=>{letter.y=lanes[(i+n)%lanes.length];letter.x+=((i%3)-1)*70;if(n===3&&i===2){letter.y=125;letter.x+=90;letter.contained=false;}});
   const chosen=[];letters.slice(0,hideCount).forEach((letter,i)=>{const preferred=[1,3,5,0,2,4][i],block=rewardBlocks[preferred]&&!chosen.includes(rewardBlocks[preferred])?rewardBlocks[preferred]:rewardBlocks.find(b=>!chosen.includes(b));if(!block)return;chosen.push(block);const old=block.rewardId;block.rewardId=letter.id;letter.contained=true;s.items=s.items.filter(a=>a.id!==old||a===letter);});
   const occupied=new Set(letters.filter(l=>l.contained).map(l=>rewardBlocks.find(b=>b.rewardId===l.id)));
   const available=rewardBlocks.filter(b=>!occupied.has(b));
   const setReward=(idx,kind)=>{const b=available[idx];if(!b)return;const old=b.rewardId;s.items=s.items.filter(a=>a.id!==old);const id=`ocean-${kind}-${idx}`;b.rewardId=id;s.items.push({id,kind,x:0,y:0,w:40,h:kind==='power'?45:42,contained:true});};
   setReward(0,'power');setReward(1,'powerStar');
  }
  if(swim){s.oceanShells=[{id:'route-clam',x:end*.58,y:435,w:82,h:55,opened:false,rewardId:'route-pearl'}];s.items.push({id:'route-pearl',kind:'coin',x:end*.58+24,y:390,w:30,h:36,contained:true});s.currents.push({x:end*.73,w:100,y:160,h:310,vx:0,vy:-180,kind:'bubble-column'});if(n>=2)s.currents.push({x:end*.32,w:220,y:150,h:220,vx:n===2?25:-20,vy:0});if(s.boss)s.platforms.push({x:end*.63,y:60,w:190,h:32,kind:'reef-ceiling'});}
  if(sky){for(let i=0;i<4;i++)s.items.push({id:i?`flight-backup-${i}`:'flight-wings',kind:'flight',x:i?end*i/4:112,y:351,w:48,h:48});}
  if(s.worldId===7||s.worldId===8)s.hazards.push({kind:s.worldId===7?'lava':'electric',x:end*.59,y:400,w:32,h:20,phase:0});
  for(const e of s.enemies)for(const h of s.hazards.filter(a=>a.kind==='void')){const center=h.x+h.w/2,margin=130;if(Math.abs(e.x-center)<margin){const shift=e.x<center?-(margin+45):(margin+45);e.x+=shift;e.left+=shift;e.right+=shift;}}
  // Keep required tiles accessible and visually separate from blocks and elevated terrain.
  for(const item of s.items.filter(a=>a.kind==='letter'))for(const obstacle of [...s.blocks,...s.platforms.filter(p=>p.kind!=='ground')])if(H.overlaps(item,obstacle))item.x=obstacle.x+obstacle.w+24;
  s.checkpoints=[{id:0,x:60,y:swim?310:420},{id:1,x:end*.5+200,y:swim?310:420}];
  s.chapters=Array.from({length:7},(_,i)=>({x:i*beat,kind:['arrival','reward-bridge','stepping-stones','moving-lookout','secret-overlook','guardian-approach','goal'][i],text:`${s.routeTheme} · ${['출발','보상 찾기','길 건너기','주변 살피기','별빛 도전','마지막 글자','도착'][i]}`}));
  return s;
 };
})(HangulRunner);
