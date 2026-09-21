/* Additive adventure content. Existing world/stage IDs and saved records stay valid. */
(function(H){
 const lessons=[
  ['가','나','다','라','마','바','사','아','자','차','카','타','파','하'],
  ['바다','고래','상어','문어','조개','새우','파도','모래','물고기','산호','거북','해마'],
  ['하늘','구름','바람','날개','비행','햇살','노을','무지개','참새','비둘기','높이','멀리'],
  ['동굴','바위','돌멩이','그림자','수정','보석','탐험','길잡이','반딧불','어둠','빛','출구'],
  ['공룡','발자국','화석','초원','풀잎','나뭇잎','뿔','꼬리','알','둥지','육식','초식'],
  ['눈송이','눈사람','고드름','얼음','빙하','북극','겨울','장갑','목도리','눈썰매','펭귄','따뜻해요'],
  ['화산','용암','불꽃','연기','열기','불씨','뜨거워요','조심해요','소방관','안전','대피','도와줘요'],
  ['번개','천둥','폭풍','소나기','먹구름','전기','빛나요','우산','비바람','안전한 곳','기다려요','맑아져요'],
  ['우주','행성','지구','달','태양','은하수','우주선','우주 비행사','별이 빛나요','달에 가요','지구를 지켜요','함께 돌아가요']
 ];
 const specs=[
  [5,'공룡의 계곡','dinosaur','#609e44','화석 길을 따라 사라진 둥지를 찾아요','태고왕 브라곤'],
  [6,'얼음 왕국','ice','#7ecddd','얼어붙은 마을에 따뜻한 빛을 전해요','빙하왕 설크'],
  [7,'불꽃 산맥','fire','#ec713b','용암 다리를 건너 불씨를 되찾아요','화염왕 라그온'],
  [8,'번개 요새','lightning','#9672db','폭풍 속 발전소에 별빛을 밝혀요','뇌전왕 볼티르'],
  [9,'별빛 우주','space','#695db6','아홉 세계의 빛을 모아 지구로 돌아와요','성운왕 오르비스']
 ];
 for(const [id,name,theme,color,description,bossName] of specs){const words=lessons[id-1];H.registerWorld({id,name,theme,color,description,mode:'run',notes:[392+id*12,523+id*12,659+id*12]},Array.from({length:4},(_,i)=>({number:i+1,name:[`${name} 입구`,'잃어버린 빛','수호자의 길',bossName][i],story:description,words:[...words],moving:i>0,gap:80+i*12,...(i===3?{boss:{name:bossName,style:theme,questions:words.slice(0,4+Math.floor((id-5)/2)).map((w,j)=>[`${w} 찾기`,w,words[(j+3)%words.length],words[(j+6)%words.length]])}}:{})})));}
 for(const s of H.worldStages){const pool=lessons[s.worldId-1];if(!pool)continue;
  s.words=pool.slice(s.number-1).concat(pool.slice(0,s.number-1));
  if(s.worldId===1)s.words=[['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ','가','나'],pool,['나무','나비','사과','바나나','아기','오리','토끼','사자','모자','구두','하마','바지']][s.number-1].slice();
  s.span=s.mode==='swim'?880:980;
  s.story=(s.story||'')+' 별빛 쉼터를 지나 모든 글자를 모으고 마지막 신호기까지 가요.';
  if(s.worldId===3)s.flightPickup=true;
 }
 const decorate=H.decorateWorldStage;
 H.decorateWorldStage=s=>{decorate?.(s);
  if(s.flightPickup){s.runZones=[];s.items.push({id:'flight-wings',kind:'flight',x:112,y:351,w:48,h:48});
   s.items.forEach(item=>{if(item.kind==='letter'){item.y=329;}if(item.kind==='star'){item.requiresFlight=item.index!==0&&item.id!=='star-0';item.y=item.requiresFlight?100:260;}});
   s.words.forEach((_,i)=>{if(i)s.items.push({id:`flight-backup-${i}`,kind:'flight',x:i*s.span+90,y:351,w:48,h:48});});
   // Walkable lower route remains complete even if the wings are missed.
   s.platforms.forEach(p=>{if(p.y===420)p.w=Math.max(p.w,s.span-65);});
  }
  if(s.worldId!==1)s.words.forEach((_,i)=>{const x=i*s.span;
   const y=s.mode==='swim'?350:265;
   for(let j=0;j<3;j++)s.blocks.push({id:`extra-block-${i}-${j}`,x:x+500+j*60,y,w:52,h:48,kind:j===1?'reward':j===0?'breakable':'hard',fragile:true,revealed:true,rewardId:`extra-reward-${i}`});
   s.items.push({id:`extra-reward-${i}`,kind:i%4===2?'powerStar':i%3===0?'power':'coin',x:0,y:0,w:i%4===2?40:36,h:i%4===2?42:40,contained:true});
   if(s.worldId===3&&i%3===1)s.enemies.push({id:`sky-cactus-${i}`,kind:'pipe-snapper',x:x+760,y:420,baseY:420,w:48,h:52,left:x+760,right:x+760,dir:-1,speed:0,phase:i,hp:1});
   if(s.worldId>=5){const ledge={x:x+200,y:320,w:165,h:28,oneWay:true,kind:'floating'};if(i%3===1)Object.assign(ledge,{originX:ledge.x,originY:ledge.y,motion:{x:38,y:28,speed:.7}});s.platforms.push(ledge);
    if(s.worldId===5)s.hazards.push({kind:'rock',x:x+890,y:395,w:32,h:25});
    if(s.worldId===7)s.hazards.push({kind:'lava',x:x+890,y:404,w:40,h:16,phase:i});
    if(s.worldId===8)s.hazards.push({kind:'electric',x:x+875,y:370,w:30,h:50,phase:i});
    if(s.worldId===9)s.currents.push({x:x+650,w:180,vx:0,vy:-35});
    const kind=['seed-shell','fire-imp','pipe-snapper','berry-bandit'][(i+s.number)%4];s.enemies.push({id:`world-enemy-${i}`,kind,x:x+735,y:374,baseY:374,w:54,h:46,left:x+670,right:x+850,dir:-1,speed:45+s.worldId*4,level:s.worldId,hp:s.worldId>=7?2:1,armored:kind==='seed-shell',state:'walk',phase:i});
   }
  });
  // Six authored route motifs vary the optional challenge while the lower learning path stays open.
  const motifs=['arrival','stepping-stones','reward-bridge','moving-lookout','secret-overlook','guardian-approach'];
  s.chapters=s.words.map((word,i)=>({x:i*s.span,kind:motifs[(i+s.number-1)%motifs.length],text:`${s.world.name} · ${['첫 발걸음','징검다리 길','별빛 다리','움직이는 전망대','숨은 보물길','수호자의 길'][(i+s.number-1)%6]} · ${word}`}));
  if(![2,3].includes(s.worldId))for(const [i,chapter] of s.chapters.entries()){const x=i*s.span;
   if(chapter.kind==='stepping-stones')s.platforms.push({x:x+60,y:348,w:105,h:24,kind:'floating',oneWay:true},{x:x+170,y:285,w:110,h:24,kind:'floating',oneWay:true});
   if(chapter.kind==='reward-bridge')s.platforms.push({x:x+645,y:330,w:155,h:24,kind:'bridge',oneWay:true});
   if(chapter.kind==='moving-lookout')s.platforms.push({x:x+40,y:310,w:130,h:24,kind:'floating',oneWay:true,originX:x+40,originY:310,motion:{x:25,y:25,speed:.65}});
   if(chapter.kind==='secret-overlook'){s.platforms.push({x:x+660,y:340,w:125,h:24,kind:'floating',oneWay:true},{x:x+775,y:270,w:125,h:24,kind:'floating',oneWay:true});s.items.push({id:`lookout-star-${i}`,kind:'star',x:x+820,y:225,w:32,h:36});}
  }
  // Headroom is derived from the BIG collision body; SMALL still reaches the underside.
  s.killY=600;const floor=s.mode==='swim'?510:420,headroom=H.PLAYER_FORMS.big.h+32;
  for(const b of s.blocks){b.fragile=false;if(b.id?.startsWith('rolling-wall')){b.y=floor-b.h;continue;}
   const support=b.hidden?s.platforms.filter(a=>a.oneWay&&a.x<b.x+b.w&&a.x+a.w>b.x&&a.y>b.y).sort((a,c)=>a.y-c.y)[0]:null;
   b.y=(support?.y??floor)-headroom-b.h;
   const reward=s.items.find(i=>i.id===b.rewardId);if(reward?.contained&&reward.kind==='coin'&&b.kind==='reward'&&Number(b.id.match(/\d+/)?.[0]||0)%3===0){reward.kind='power';reward.w=40;reward.h=45;}
  }
  for(const item of s.items){const match=item.id.match(/^coin-(\d+)-(\d+)$/);if(match){const row=s.blocks.find(b=>b.id===`block-${match[1]}-0`||b.id===`extra-block-${match[1]}-0`);if(row)item.x=row.x-155+Number(match[2])*45;}}
  for(const item of s.items){if(item.contained)continue;for(const b of s.blocks){if(b.hidden&&!b.revealed)continue;if(H.overlaps(item,b)){item.y=b.y-item.h-12;}}}
  for(const [i,e] of s.enemies.entries()){e.theme=s.theme;e.worldId=s.worldId;e.homeY=e.baseY;e.baseW=e.w;e.baseH=e.h;e.behaviorTime=i*.7;e.attackTimer=2+i%3;
   e.artIndex=s.worldId>=5?({5:9,6:10,7:3,8:11,9:6})[s.worldId]:undefined;
   const behaviors={1:['walk','roll','emerge'],2:['swim','pinch','inflate'],3:['swoop','wind'],4:['dive','fall'],5:['chase','charge','hop'],6:['slide','ice'],7:['fire','lava'],8:['blink-dash','electric'],9:['float','teleport','energy']};
   e.behavior=behaviors[s.worldId][i%behaviors[s.worldId].length];if(s.worldId===2)e.behavior=e.kind==='reef-crab'?'pinch':e.kind==='bubble-puffer'?'inflate':'swim';
   if(e.kind==='pipe-snapper'){e.kind='cactus';e.behavior='emerge';e.speed=0;e.left=e.right=e.x;e.drainY=floor;e.y=floor;e.baseY=floor;e.retracted=true;e.artIndex=2;e.stompable=false;s.platforms.push({x:e.x-8,y:floor-12,w:e.w+16,h:12,kind:'drain',oneWay:false});}
   else if(s.worldId>=2){e.originalKind=e.kind;e.kind='world-creature';e.artIndex??=({'bubble-puffer':4,'reef-crab':5,'ink-sprite':6,'cloud-rascal':7,'storm-bat':7,'spark-drake':7,'tunnel-bat':8,'gear-shell':1})[e.originalKind]??0;}
  }
 };
 /* Late worlds get distinct terrain vocabulary and hazard rhythm. */
 H.LATE_SCENES={
  5:{silhouette:'ridge',hazard:'rock'},6:{silhouette:'peak',hazard:'icicle'},
  7:{silhouette:'volcano',hazard:'lava'},8:{silhouette:'tower',hazard:'electric'},
  9:{silhouette:'planet',hazard:'meteor'}
 };
 H.decorateLateWorld=(s,{floor,end,n,pits})=>{
  const id=s.worldId;s.lateScene={...H.LATE_SCENES[id],stage:n};
  for(const p of s.platforms)if(p.kind==='ground')p.lateKind=id;
  const count=1+n+Math.floor((id-5)/2);
  Array.from({length:count},(_,i)=>.16+(.72*i)/Math.max(1,count-1)).forEach((f,i)=>{
   const x=end*f;if(pits.some(p=>x>p.x-140&&x<p.x+p.w+140))return;
   if(id===5)s.hazards.push({kind:'rock',x,y:floor-25,w:36,h:25});
   if(id===6){s.hazards.push({kind:'thorn',x,y:floor-30,w:38,h:30});if(i%2===0)s.platforms.push({x:x-90,y:floor-118,w:150,h:24,kind:'ice',oneWay:true,slippery:true});}
   if(id===7)s.hazards.push({kind:'lava',x,y:floor-18,w:42,h:18,phase:i*.8});
   if(id===8)s.hazards.push({kind:'electric',x,y:floor-60,w:30,h:60,phase:i*.9});
   if(id===9){s.currents.push({x:x-80,w:160,y:130,h:floor-160,vx:0,vy:-46,kind:'wind'});s.platforms.push({x:x-70,y:floor-128-(i%2)*54,w:130,h:24,kind:'meteor',oneWay:true,originX:x-70,originY:floor-128-(i%2)*54,motion:{x:26,y:34,speed:.55+i*.06}});}
  });
  s.landmarks=Array.from({length:4},(_,i)=>({x:end*(.1+i*.27),kind:H.LATE_SCENES[id].silhouette,scale:.7+(i%3)*.22}));
 };
 const before=H.WorldEngine.prototype.beforePhysics;
 H.WorldEngine.prototype.beforePhysics=function(dt){before.call(this,dt);const p=this.player;
  const chapter=this.stage.chapters?.findLast(c=>p.x>=c.x);if(this.sceneState==='RUN_STAGE'&&chapter&&chapter!==this.chapter){this.chapter=chapter;this.emit('chapter',{text:chapter.text});}
  if(this.sceneState==='RUN_STAGE'&&!this.freeMotion&&this.stage.worldId===9)p.gravity=1100;
  for(const h of this.stage.hazards)if(h.kind==='electric')h.inactive=(this.elapsed+(h.phase||0))%4<2;
  for(const e of this.stage.enemies){if(e.defeated)continue;e.behaviorTime+=dt;e.attackTimer-=dt;e.hitTime=Math.max(0,(e.hitTime||0)-dt);
   if(e.kind!=='cactus'){
    if(e.state==='shell'||e.state==='rolling')continue;
    const t=e.behaviorTime,near=Math.abs(p.x-e.x)<this.viewport*.8;
    if(['swim','float','wind','energy'].includes(e.behavior))e.y=e.homeY+Math.sin(t*1.6)*35;
    if(e.behavior==='inflate'){const swell=(Math.sin(t*1.7)+1)*.16;e.w=e.baseW*(1+swell);e.h=e.baseH*(1+swell);e.y=e.homeY-(e.h-e.baseH);e.telegraph=swell>.25;}
    if(['dive','fall','swoop','hop'].includes(e.behavior)){const cycle=t%3.8;e.telegraph=cycle<.7;e.y=e.homeY-Math.sin(Math.max(0,cycle-.7)/3.1*Math.PI)*(e.behavior==='hop'?76:125);}
    if(e.behavior==='chase'&&near){e.dir=p.x<e.x?-1:1;e.speed=65+(e.level||1)*5;}
    if(['charge','blink-dash'].includes(e.behavior)){const cycle=t%4;e.telegraph=cycle<.8;e.speed=cycle<.8?0:cycle<1.6?190+(e.level||1)*6:38;if(cycle<.8&&near)e.dir=p.x<e.x?-1:1;}
    if(e.behavior==='slide')e.speed=100;
    if(e.behavior==='teleport'){const cycle=t%5;e.telegraph=cycle>3.7;e.fade=cycle>4.5?.35:1;if(cycle>4.85&&!e.didTeleport){const target=e.left+(e.right-e.left)*((Math.sin(t*3)+1)/2);if(Math.abs(target-p.x)>90){this.burst(e.x,e.y);e.x=target;e.didTeleport=true;}}if(cycle<1)e.didTeleport=false;}
    if(['pinch','wind','ice','fire','lava','electric','energy'].includes(e.behavior)&&near){e.telegraph=e.attackTimer<.65;if(e.attackTimer<=0){const dir=p.x<e.x?-1:1,kind=e.behavior==='pinch'?'pinch':e.behavior;this.enemyShots.push({kind,x:e.x+e.w/2,y:e.y+e.h*.45,w:kind==='pinch'?40:24,h:22,vx:kind==='pinch'?dir*65:dir*(125+(e.level||1)*7),vy:0,life:kind==='pinch'?.5:2.8});e.attackTimer=3.6;this.emit('enemyFire',{enemy:e});}}
    continue;
   }const phase=(this.elapsed+(e.phase||0)*.7)%4.8;
   const rise=phase<1.4?0:phase<2?((phase-1.4)/.6):phase<3.6?1:Math.max(0,1-(phase-3.6)/.6);
   e.retracted=rise<.25;e.y=e.drainY-rise*(e.h+12);e.warning=phase>1&&phase<1.4;
 }};
 const motion=H.WorldEngine.prototype.motion;
 H.WorldEngine.prototype.motion=function(dt,input){motion.call(this,dt,input);if(this.stage.worldId===6&&this.sceneState==='RUN_STAGE'){const target=this.player.velocityX;this.slideVelocity=(this.slideVelocity||0)+(target-(this.slideVelocity||0))*Math.min(1,dt*(target?7:3));this.player.velocityX=this.slideVelocity;}};
})(HangulRunner);
