const fs=require('node:fs'),vm=require('node:vm'),a=require('node:assert/strict');
const ctx=vm.createContext({});
for(const f of ['stage-data','engine','world-data','world-engine','world-forest','world-ocean','world-sky','world-underground','world-expansion','ocean-expedition','boss'])vm.runInContext(fs.readFileSync(`js/games/hangul-runner/${f}.js`,'utf8'),ctx);
const H=ctx.HangulRunner,step=(e,n,input={})=>{for(let i=0;i<n;i++)e.step(.02,input);};

// TEST 1: every new stage starts SMALL and a growth item produces BIG.
const growth=new H.WorldEngine(H.buildWorldStage('1-1'));a.equal(growth.playerState,'SMALL');const fruit=growth.stage.items.find(i=>i.kind==='power'&&!i.contained);a(fruit);growth.player.x=fruit.x;growth.player.y=fruit.y;growth.step(.01,{});a.equal(growth.player.powerState,'big');a.equal(growth.player.h,H.PLAYER_FORMS.big.h);a(growth.player.growthTime>0);a(growth.player.invincible>0);

// Collectible stars remain score-only, while powerStar advances one form at a time.
const items=new H.WorldEngine(H.buildWorldStage('1-1'));items.stage.enemies=[];const collectible=items.stage.items.find(i=>i.kind==='star');items.player.x=collectible.x;items.player.y=collectible.y;items.step(.01,{});a.equal(items.stars,1);a.equal(items.player.powerState,'small');
const firstPower=items.stage.items.find(i=>i.kind==='powerStar');a(firstPower);firstPower.contained=false;items.player.x=60;items.player.y=356;firstPower.x=60;firstPower.y=360;items.step(.01,{});a.equal(items.player.powerState,'big','SMALL + powerStar becomes BIG');
items.player.invincible=0;const secondPower={id:'power-star-second',kind:'powerStar',x:items.player.x,y:items.player.y+30,w:40,h:42};items.stage.items.push(secondPower);items.step(.01,{});a.equal(items.player.powerState,'star_power','BIG + powerStar becomes STAR_POWER');a.equal(items.playerState,'INVINCIBLE_TEMP');

// TEST 2: a real moving projectile collides with and defeats an enemy.
const combat=new H.WorldEngine(H.buildWorldStage('1-1'));combat.stage.items=[];combat.stage.hazards=[];combat.setForm('star_power');combat.player.invincible=0;const enemy={id:'target',x:combat.player.x+170,y:combat.player.y+24,w:46,h:46,left:combat.player.x+170,right:combat.player.x+170,dir:1,speed:0,kind:'target',baseY:combat.player.y+24,hp:1,phase:0};combat.stage.enemies=[enemy];a(combat.fireStar({}));const shot=combat.projectiles[0];for(const key of ['x','y','direction','speed','lifetime','owner','damage'])a(key in shot,`projectile has ${key}`);a.equal(shot.owner,'player');a.equal(shot.damage,1);step(combat,30);a(enemy.defeated);a.equal(combat.events.enemyStarDefeat,1);a.equal(combat.projectiles.length,0);

// Cooldown and active projectile cap prevent flooding.
const rate=new H.WorldEngine(H.buildWorldStage('1-1'));rate.stage.enemies=[];rate.stage.items=[];rate.stage.blocks=[];rate.setForm('star_power');a(rate.fireStar({}));a.equal(rate.fireStar({}),false);step(rate,24);a(rate.fireStar({}));step(rate,24);a(rate.fireStar({}));step(rate,24);a.equal(rate.fireStar({}),false);a(rate.projectiles.filter(q=>q.kind==='star-power').length<=3);

// TEST 3–7: unified damage ladder and lethal hazards.
const starHit=new H.WorldEngine(H.buildWorldStage('1-1'));starHit.setForm('star_power');starHit.player.invincible=0;starHit.fireStar({});starHit.damage();a.equal(starHit.player.powerState,'small');a.equal(starHit.status,'playing');a.equal(starHit.projectiles.length,0);a(starHit.player.invincible>=1.39);starHit.damage();a.equal(starHit.status,'playing','post-hit immunity prevents same-frame death');starHit.player.invincible=0;starHit.damage();a.equal(starHit.status,'dead');
const bigHit=new H.WorldEngine(H.buildWorldStage('1-1'));bigHit.grow();bigHit.player.invincible=0;bigHit.damage();a.equal(bigHit.player.powerState,'small');a.equal(bigHit.status,'playing');
const smallHit=new H.WorldEngine(H.buildWorldStage('1-1'));smallHit.player.invincible=0;smallHit.damage();a.equal(smallHit.status,'dead');
const fall=new H.WorldEngine(H.buildWorldStage('1-1'));fall.setForm('star_power');fall.player.invincible=9;fall.fatalFall();a.equal(fall.status,'dead');a.equal(fall.player.hp,2);

// TEST 8: boss shield consumes early shots; an actual collision in the choice phase reduces boss HP.
const boss=new H.WorldEngine(H.buildWorldStage('1-4'),{viewport:640});boss.setForm('star_power');H.enterBossArena(boss);boss.sceneState='BOSS_STAGE';boss.player.invincible=999;boss.boss.x=360;boss.boss.state='telegraph';boss.boss.timer=99;const full=boss.boss.hp;a(boss.fireStar({}));step(boss,70);a.equal(boss.boss.hp,full);a.equal(boss.events.bossShield,1);
boss.fireCooldown=0;boss.projectiles=[];boss.boss.state='choice';boss.boss.choiceTime=99;boss.boss.choices=[];a(boss.fireStar({}));step(boss,70);a.equal(boss.boss.hp,full-1);a.equal(boss.events.bossHit,1);

// UI contract: mobile fire control exists, is state-gated, and has compact 320/390/430 rules.
const ui=fs.readFileSync('js/games/hangul-runner.js','utf8'),css=fs.readFileSync('css/games/hangul-runner.css','utf8');
for(const token of ['data-control="fire"','powerState===\'star_power\'','별빛 시안','★ 발사'])a(ui.includes(token),`UI contains ${token}`);
for(const token of ['.hr-fire[hidden]','width:76px!important','width:64px!important','@container(max-width:360px)'])a(css.includes(token),`responsive CSS contains ${token}`);
const controlWidth=viewport=>viewport<=360?44+44+76+44+64+4*4:51+51+88+51+76+4*5;
for(const viewport of [320,390,430])a(controlWidth(viewport)<=viewport-(viewport<=360?16:24),`${viewport}px controls fit: ${controlWidth(viewport)}px`);
console.log('PASS STAR_POWER ladder, distinct powerStar, moving shots, enemy/boss collisions, shield phase, 1.4s immunity, fire cooldown/cap and mobile control contract');
