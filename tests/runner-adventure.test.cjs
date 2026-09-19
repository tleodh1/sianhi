const fs=require('node:fs'),vm=require('node:vm'),a=require('node:assert/strict');
const c=vm.createContext({Math,Date});
for(const f of ['stage-data','engine','world-data','world-engine','world-forest','world-ocean','world-sky','world-underground','boss'])vm.runInContext(fs.readFileSync(`js/games/hangul-runner/${f}.js`,'utf8'),c);
const H=c.HangulRunner,advance=(e,seconds,input={})=>{for(let i=0;i<seconds*120;i++)e.step(1/120,input);};
a.equal(H.worlds.length,4);a.equal(H.worldStages.length,16);a.deepEqual([...new Set(H.worldStages.map(s=>s.theme))],['forest','ocean','sky','underground']);
for(const id of ['1-4','2-4','3-4','4-4']){
 const e=new H.WorldEngine(H.buildWorldStage(id));a.equal(e.sceneState,'RUN_STAGE');a.equal(e.boss,undefined,`${id} hides boss during the run`);
 for(let i=0;i<e.stage.words.length;i++){const item=e.stage.items.find(v=>v.id===`letter-${i}`);e.player.x=item.x;e.player.y=item.y;e.step(1/120,{});if(i<e.stage.words.length-1)a.equal(e.sceneState,'RUN_STAGE');}
 a.equal(e.letterCount,e.stage.words.length);a.equal(e.sceneState,'TRANSITION',`${id} enters a real transition after all normal letters`);a.equal(e.boss,undefined);
 advance(e,2.6);a.equal(e.sceneState,'BOSS_INTRO');a.ok(e.boss);a.equal(e.stage.items.length,0);advance(e,2.3);a.equal(e.sceneState,'BOSS_STAGE');e.player.invincible=999;
 for(let i=0;i<e.boss.maxHp;i++){advance(e,.4);const correct=e.boss.choices.find(v=>v.correct);a.ok(correct,`${id} offers an arena learning choice`);e.player.x=correct.x;e.player.y=correct.y;e.step(1/120,{});a.ok(e.projectiles.some(v=>v.team==='player'),`${id} launches a visible player projectile`);advance(e,1.8);if(i<e.boss.maxHp-1)advance(e,.8);}
 a.equal(e.boss.hp,0);a.equal(e.sceneState,'BOSS_DEFEATED');a.notEqual(e.status,'clear',`${id} does not auto-clear on boss defeat`);a.ok(e.events.bossHit>=1);a.ok(e.events.bossAttack>=1);advance(e,2.1);a.equal(e.sceneState,'EXIT_OPEN');a.equal(e.boss.unlocked,true);a.equal(e.events.doorUnlock,1);a.notEqual(e.status,'clear');
 e.player.x=e.stage.goal.x;e.player.y=e.stage.goal.y;e.step(1/120,{});a.equal(e.status,'clear',`${id} clears only after entering the unlocked door`);
}
const underground=new H.WorldEngine(H.buildWorldStage('4-2'));underground.player.x=300;underground.player.y=300;underground.step(1/120,{jump:true});a.equal(underground.mode,'swim');
const ui=fs.readFileSync('js/games/hangul-runner.js','utf8'),html=fs.readFileSync('index.html','utf8'),renderer=fs.readFileSync('js/games/hangul-runner/renderer.js','utf8');
for(const token of ['hr-world-map','data-world-stage','recordWorldClear','WorldEngine'])a(ui.includes(token),`UI contains ${token}`);
for(const token of ['TRANSITION','BOSS_INTRO','BOSS_STAGE','BOSS_DEFEATED','EXIT_OPEN'])a(renderer.includes(token),`renderer owns ${token}`);
for(const module of ['world-data','world-engine','world-forest','world-ocean','world-sky','world-underground','boss'])a(html.includes(`hangul-runner/${module}.js`),`${module} loaded`);
console.log('PASS separate run/transition/boss arenas, answer projectiles, boss attacks, defeat, unlock and door clear');
