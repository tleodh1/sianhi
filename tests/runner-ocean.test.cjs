const fs=require('node:fs'),vm=require('node:vm'),a=require('node:assert/strict');
function setup(){const c=vm.createContext({});for(const f of ['stage-data','engine','world-data','world-engine','world-forest','world-ocean','world-sky','world-underground','world-expansion','ocean-expedition','boss'])vm.runInContext(fs.readFileSync(`js/games/hangul-runner/${f}.js`,'utf8'),c);return c.HangulRunner;}
const H=setup(),step=(e,n,input={})=>{for(let i=0;i<n;i++)e.step(1/120,input);};
a.equal(H.worldStages.length,36);a.equal(H.worldStages.filter(s=>s.worldId===2).length,4);a.equal(H.worldStages.filter(s=>s.worldId===2&&s.boss).map(s=>s.id).join(),'2-4');a(!H.worldStages.some(s=>s.id==='2-5'));
const before=JSON.stringify({stages:{'2-4':{boss:true,rating:3},'2-9':{boss:true,rating:2}},worldRewards:{2:{earnedAt:1}}}),saved=JSON.parse(before);
a(H.isWorldStageUnlocked(saved,'3-1'));a(H.isWorldStageUnlocked({stages:{'2-4':{boss:true}},worldRewards:{}},'3-1'));a.equal(JSON.stringify(saved),before);a(!H.isWorldStageUnlocked({stages:{},worldRewards:{}},'3-1'));
let biome=new Set(),patterns=new Set();
for(let n=1;n<=4;n++){
 const idle=new H.WorldEngine(H.buildWorldStage(`2-${n}`));step(idle,600);a.equal(idle.status,'playing',`2-${n} safe idle start`);a.equal(idle.player.hp,3,`2-${n} no spawn damage`);
 const s=H.buildWorldStage(`2-${n}`);biome.add(s.oceanBiome);for(const zone of s.oceanBiomes||[])biome.add(zone);s.enemies.forEach(e=>patterns.add(e.behavior));a(s.length/285>40);a(new Set(s.platforms.filter(p=>p.kind==='ground').map(p=>p.y)).size>=3);
 for(const item of s.items.filter(i=>i.kind==='letter')){a(item.y>=32&&item.y+item.h<470);for(const p of s.platforms)a(!H.overlaps(item,p),`${s.id} ${item.id} outside terrain`);for(const b of s.blocks)a(!H.overlaps(item,b),`${s.id} ${item.id} outside blocks`);}
 const e=new H.WorldEngine(s);e.player.invincible=10000;
 function swimTo(x,y){for(let tick=0;tick<5000;tick++){const p=e.player,dx=x-p.x,dy=y-p.y;if(Math.abs(dx)<7&&Math.abs(dy)<8)return;e.step(.02,{right:dx>5,left:dx< -5,jump:dy< -5,down:dy>5});}a.fail(`${s.id} route stuck at ${e.player.x},${e.player.y}, target ${x},${y}`);}
 for(const letter of s.items.filter(i=>i.kind==='letter')){swimTo(e.player.x,130);swimTo(letter.x+5,130);swimTo(letter.x+5,letter.y+8);a(e.collected.has(letter.id),`${s.id} collect ${letter.id} via inputs`);}
 a.equal(e.letterCount,12);a(e.elapsed>40);a.equal(e.status,'playing');
 const clam=s.oceanShells[0];e.player.x=clam.x;e.player.y=clam.y-10;step(e,1);a(clam.opened);const coin=s.items.find(i=>i.id===clam.rewardId);a(!coin.contained);const count=e.events.clam;step(e,10);a.equal(e.events.clam,count);
 const column=s.currents.find(c=>c.kind==='bubble-column');e.player.x=column.x+10;e.player.y=320;e.player.velocityY=0;step(e,120);a(e.player.y<290,'bubble column lifts idle player');
}
a.equal(biome.size,9);for(const p of ['inflate','pinch','jelly','ink','shark','eel'])a(patterns.has(p),`ocean includes ${p}`);
const ceiling=new H.WorldEngine(H.buildWorldStage('2-4'));ceiling.stage.enemies=[];const roof=ceiling.stage.platforms.find(p=>p.kind==='reef-ceiling');ceiling.player.x=roof.x+20;ceiling.player.y=roof.y+roof.h+5;step(ceiling,100,{jump:true});a(ceiling.player.y>=roof.y+roof.h-1,'solid cave ceiling stops ascent');
const combat=new H.WorldEngine(H.buildWorldStage('2-4'));combat.player.invincible=999;
for(const behavior of ['ink','eel','shark','inflate']){const enemy=combat.stage.enemies.find(e=>e.behavior===behavior);a(enemy);combat.player.x=enemy.x-100;combat.player.y=enemy.y;enemy.attackTimer=.8;enemy.behaviorTime=0;combat.beforePhysics(.02);a(enemy.telegraph,`${behavior} warns before attack`);if(['ink','eel'].includes(behavior)){enemy.attackTimer=0;combat.beforePhysics(.02);a(combat.enemyShots.some(s=>s.kind===(behavior==='ink'?'ink':'electric-ring')));}}
const boss=new H.WorldEngine(H.buildWorldStage('2-4'));H.enterBossArena(boss);boss.player.invincible=999;step(boss,280);a.equal(boss.sceneState,'BOSS_STAGE');
for(let n=0;n<boss.boss.maxHp;n++){for(let t=0;t<1200&&!boss.boss.choices.length;t++)step(boss,1);const q=boss.boss.choices.find(c=>c.correct);a(q);boss.player.x=q.x;boss.player.y=q.y;step(boss,1);step(boss,230);}
a.equal(boss.boss.hp,0);step(boss,250);a.equal(boss.sceneState,'EXIT_OPEN');a.equal(boss.status,'playing');boss.player.x=boss.stage.goal.x;boss.player.y=boss.stage.goal.y;step(boss,1);a.equal(boss.status,'clear');
console.log('PASS ocean: four input-driven stages, 2-4 boss, nine visual zones, >40s travel, terrain, clam, currents, enemy telegraphs and saved-progress preservation');
