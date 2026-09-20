/* Four ocean stages keep the established IDs; 2-4 is the WORLD 2 boss stage. */
(function(H){
 const chapters=[
  ['산호초','reef','얕은 산호 바다에서 첫 탐험을 시작해요.',['바다','고래','상어','문어','조개','새우','파도','모래','물고기','산호','소라','거북이']],
  ['해초 숲','kelp','흔들리는 해초 사이에서 길을 찾아요.',['해초','초록','나무','풀잎','숨바꼭질','친구','위쪽','아래쪽','가까이','멀리','천천히','함께']],
  ['조개 마을','shell','진주 조개를 열고 마을의 빛을 찾아요.',['조개','진주','마을','모래성','불가사리','소라게','돌고래','산호초','바닷속','모래사장','반짝반짝','고마워요']],
  ['심해 수호자의 성','abyss','난파선과 해저 유적, 해구와 동굴을 지나 물결왕을 만나요.',['탐험','바닷속','잠수함','수호자','물결','별빛','약속','친구','바다를 지켜요','함께 힘을 내요','빛을 되찾아요','집으로 돌아가요']]
 ];
 const first=H.worldStages.findIndex(s=>s.worldId===2),oldBoss=H.worldStages.find(s=>s.id==='2-4').boss;
 const defs=chapters.map(([name,oceanBiome,story,words],i)=>({id:`2-${i+1}`,worldId:2,number:i+1,name,oceanBiome,story,words,span:920,mode:'swim',theme:'ocean',gap:0,ordered:i===2,current:i>0,...(i===3?{oceanBiomes:['wreck','ruins','trench','jelly','cavern','abyss'],boss:{...oldBoss,name:'심해왕 루모',questions:words.slice(0,5).map((w,j)=>[`${w} 찾기`,w,words[(j+3)%12],words[(j+6)%12]])}}:{})}));
 H.worldStages.splice(first,4,...defs);
 H.isWorldStageUnlocked=(progress,id)=>{const index=H.worldStages.findIndex(s=>s.id===id),stage=H.worldStages[index];if(!stage)return false;const previousWorld=stage.worldId-1,legacyBoss=progress.stages?.[`${previousWorld}-4`]?.boss;return index===0||!!progress.stages[id]||!!progress.stages[H.worldStages[index-1]?.id]||(stage.number===1&&(!!progress.worldRewards?.[previousWorld]||!!legacyBoss));};
 const decorate=H.decorateWorldStage;
 H.decorateWorldStage=s=>{decorate(s);if(s.worldId!==2)return;
  s.killY=660;s.checkpoints[0].y=310;s.oceanDepth=(s.number-1)/3;s.oceanShells=[];
  // Broad terraces leave at least 150 logical pixels beneath the reward rows.
  const base=s.platforms.filter(p=>p.kind==='ground');s.platforms=s.platforms.filter(p=>p.kind!=='ground');
  for(const [i,p] of base.entries()){const heights=s.number>=6?[500,440,510]:[500,470,510],third=p.w/3;for(let j=0;j<3;j++)s.platforms.push({...p,x:p.x+j*third,w:third+1,y:heights[(i+j+s.number)%3],kind:'ground'});}
  for(const b of s.blocks){const floor=s.platforms.find(p=>p.kind==='ground'&&b.x>=p.x&&b.x<p.x+p.w)?.y||510;b.y=floor-H.PLAYER_FORMS.big.h-38-b.h;b.oceanSkin=b.kind==='reward'?'pearl':b.kind==='breakable'?'coral':'relic';}
  s.words.forEach((word,i)=>{const x=i*s.span,letter=s.items.find(t=>t.id===`letter-${i}`);letter.x=x+245;Object.assign(letter,H.learningTile?H.learningTile(word):{w:62,h:62});letter.y=[135,240,335][(i+s.number-1)%3];
   if(i%3===1){s.oceanShells.push({id:`clam-${i}`,x:x+680,y:404,w:82,h:55,opened:false,rewardId:`pearl-${i}`});s.items.push({id:`pearl-${i}`,kind:'coin',x:x+704,y:355,w:30,h:36,contained:true});}
   if(i%3===2){s.currents.push({x:x+730,w:100,y:140,h:345,vx:0,vy:-280,kind:'bubble-column'});s.items.push({id:`cave-star-${i}`,kind:'star',x:x+765,y:95,w:32,h:36});}
   if(['wreck','ruins','cavern','abyss'].includes(s.oceanBiome)&&i%2===1){s.platforms.push({x:x+40,y:70,w:135,h:32,oneWay:false,kind:'reef-ceiling'});}
   if(i%3===2)s.platforms.push({x:x+695,y:220,w:158,h:30,oneWay:true,kind:'reef-platform'});
   if(s.oceanBiome==='cavern'&&i%3===2)s.platforms.push({x:x+650,y:70,w:235,h:42,oneWay:false,kind:'reef-ceiling'});
   s.chapters[i].text=`${s.name} · ${['산호 길을 살펴봐요','조개의 보물을 찾아요','기포를 타고 올라가요'][i%3]}`;

  });
  s.enemies.forEach((e,i)=>{if(e.x<330){e.x+=260;e.left+=260;e.right+=260;}const kind=e.originalKind;e.homeY=Math.min(420,e.homeY);if(kind==='reef-crab'){e.homeY=464;e.y=464;e.behavior='pinch';}
   if(s.number>=4&&i%7===3){e.behavior='ink';e.marineKind='octopus';}
   if(s.number>=4&&i%9===4){e.behavior='shark';e.marineKind='shark';e.w=e.baseW=70;e.h=e.baseH=42;}
   if(s.number>=4&&i%11===5){e.behavior='eel';e.marineKind='eel';e.w=e.baseW=76;e.h=e.baseH=32;}
   if(kind==='ink-sprite'&&!e.marineKind)e.behavior='jelly';
   if(e.marineKind==='shark'||e.marineKind==='eel'){e.left=Math.max(i?80:360,e.left);e.right=e.left+260;}
   e.oceanSchool=true;e.hp=s.number>=4&&i%4===0?2:1;e.speed=Math.min(70,e.speed);e.attackTimer=2.5+i%4;
  });
  for(const letter of s.items.filter(i=>i.kind==='letter')){const floor=Math.min(...s.platforms.filter(p=>p.kind==='ground'&&letter.x+letter.w>p.x&&letter.x<p.x+p.w).map(p=>p.y));letter.y=Math.min(letter.y,floor-letter.h-22);}
  // Keep rewards outside the new wider learning tiles and the reef collision geometry.
  for(const item of s.items){if(item.contained||item.kind==='letter')continue;
   const section=Math.floor(item.x/s.span),letter=s.items.find(a=>a.id===`letter-${section}`);
   if(letter&&H.overlaps(item,letter)){item.x=section*s.span+120;item.y=Math.max(45,letter.y-55);}
   for(const block of s.blocks)if(H.overlaps(item,block))item.y=block.y-item.h-14;
  }
 };

 const before=H.WorldEngine.prototype.beforePhysics;
 H.WorldEngine.prototype.beforePhysics=function(dt){before.call(this,dt);if(this.stage.worldId!==2||this.sceneState!=='RUN_STAGE')return;const p=this.player;
  for(const clam of this.stage.oceanShells||[])if(!clam.opened&&H.overlaps(p,{...clam,x:clam.x-10,y:clam.y-18,w:clam.w+20,h:clam.h+18})){clam.opened=true;const item=this.stage.items.find(i=>i.id===clam.rewardId);item.contained=false;item.pop=.4;this.burst(clam.x+40,clam.y);this.emit('clam');}
  for(const e of this.stage.enemies){if(e.defeated||Math.abs(e.x-p.x)>this.viewport+200)continue;const t=e.behaviorTime,near=Math.abs(e.x-p.x)<180&&Math.abs(e.y-p.y)<140;
   if(e.originalKind==='reef-crab'){const floor=this.stage.platforms.find(a=>a.kind==='ground'&&e.x+e.w/2>=a.x&&e.x+e.w/2<a.x+a.w);if(floor)e.y=floor.y-e.h;}
   if(e.behavior==='inflate'){const target=near?.34:0;e.swell=(e.swell||0)+(target-(e.swell||0))*Math.min(1,dt*2);e.w=e.baseW*(1+e.swell);e.h=e.baseH*(1+e.swell);e.y=e.homeY-(e.h-e.baseH);e.telegraph=near&&e.swell<.25;}
   if(e.behavior==='jelly')e.y=e.homeY+Math.sin(t*1.1)*62;
   if(e.behavior==='shark'){const cycle=t%4.5;e.telegraph=cycle<.9;e.speed=cycle<.9?10:cycle<1.6?225:45;if(cycle<.9)e.dir=p.x<e.x?-1:1;}
   if(e.behavior==='ink'||e.behavior==='eel'){e.telegraph=e.attackTimer<.9;if(e.attackTimer<=0){if(e.behavior==='ink'){const dx=p.x-e.x,dy=p.y-e.y,len=Math.max(1,Math.hypot(dx,dy));this.enemyShots.push({kind:'ink',x:e.x,y:e.y+15,w:24,h:24,vx:dx/len*125,vy:dy/len*125,life:3});}else this.enemyShots.push({kind:'electric-ring',x:e.x-28,y:e.y-28,w:e.w+56,h:e.h+56,vx:0,vy:0,life:.55});e.attackTimer=4.2;this.emit('enemyFire',{enemy:e});}}
  }
 };
})(HangulRunner);
