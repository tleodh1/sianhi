const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({});
for(const f of ['stage-data','engine'])vm.runInContext(fs.readFileSync(`js/games/hangul-runner/${f}.js`,'utf8'),context);
const H=context.HangulRunner, make=(id=1)=>new H.Engine(H.buildStage(id));
let count=0;function test(name,fn){fn();console.log('PASS',name);count++;}
function step(e,n,input={}){for(let i=0;i<n;i++)e.step(1/120,input);}
test('exact first alphabet and seven expandable stages',()=>{assert.equal(H.stages[0].words.join(''),'가나다라마바사아자차카타파하');assert.equal(H.stages.length,7);assert(H.buildStage(1).length>8000);});
test('jump, apex, gravity and physical landing',()=>{const e=make();e.step(1/120,{jump:true});assert(e.player.velocityY<0);assert(!e.player.isGrounded);step(e,140);assert.equal(e.player.y,348);assert(e.player.isGrounded);assert(e.events.land);});
test('real gap fall and checkpoint respawn',()=>{const e=make();e.checkpoint=e.stage.checkpoints[1];e.player.x=555;e.player.y=348;step(e,240);assert.equal(e.deaths,1);assert.equal(e.player.x,e.checkpoint.x);assert.equal(e.player.hp,2);});
test('one-way raised platform landing',()=>{const e=make();e.player.x=340;e.player.y=100;e.player.velocityY=120;step(e,80);assert.equal(e.player.y,222);assert(e.player.isGrounded);});
test('damage immunity and growth absorbs first hit',()=>{const e=make();e.player.powerState='big';e.damage();assert.equal(e.player.hp,3);assert.equal(e.player.powerState,'small');e.damage();assert.equal(e.player.hp,3);step(e,200);e.damage();assert.equal(e.player.hp,2);});
test('letter, coin and power collisions collect only once',()=>{const e=make();for(const kind of ['letter','coin','power']){const i=e.stage.items.find(i=>i.kind===kind);e.player.x=i.x;e.player.y=i.y;if(kind==='power'){e.player.x=60;e.player.y=348;i.x=60;i.y=360;}e.step(1/120);e.step(1/120);assert(e.collected.has(i.id));}assert.equal(e.letterCount,1);assert.equal(e.coins,1);assert.equal(e.player.powerState,'big');});
test('monster patrol stays bounded, sprout jumps',()=>{const e=make();const sprout=e.stage.enemies.find(e=>e.kind==='sprout');step(e,700);for(const m of e.stage.enemies)assert(m.x>=m.left&&m.x<=m.right);assert(sprout.y<sprout.baseY);});
test('goal requires all letters, then clear once',()=>{const e=make();e.player.x=e.stage.goal.x;step(e,1);assert.equal(e.status,'playing');assert(e.events.missing);for(const i of e.stage.items.filter(i=>i.kind==='letter'))e.collected.add(i.id);step(e,3);assert.equal(e.status,'clear');assert.equal(e.events.clear,1);});
test('legacy records preserved and best-rating-only reward',()=>{const s={stars:27,done:['old'],progress:{한글:8},level:4,records:{runner:9,tetris:23}};const r={stageId:1,rating:2,seconds:80,coins:7,stars:3};H.recordClear(s,r);assert.equal(s.stars,29);H.recordClear(s,r);assert.equal(s.stars,29);H.recordClear(s,{...r,rating:3});assert.equal(s.stars,30);assert.equal(s.records.runner,9);assert.equal(s.records.tetris,23);assert.equal(s.progress.한글,8);assert.equal(s.level,4);});
test('camera follows world and stays in bounds',()=>{const e=make();step(e,150,{right:true});assert(e.cameraX>0);assert(e.cameraX<=e.stage.length-e.viewport);});
// Input-only deterministic traversal, no teleports or artificial pickups.
test('every stage can be cleared by normal movement and jumps',()=>{for(let id=1;id<=H.stages.length;id++){
 const e=make(id);let previousJump=false;
 for(let n=0;n<120*180&&e.status!=='clear';n++){
  const p=e.player,foot=p.x+p.w;
  const nearEdge=!e.stage.platforms.some(a=>foot+88>=a.x&&foot+88<a.x+a.w&&Math.abs(a.y-(p.y+p.h))<5);
  const hazard=[...e.stage.hazards,...e.stage.enemies].some(a=>a.x-foot<90&&a.x+a.w>p.x&&Math.abs(a.y+a.h-(p.y+p.h))<85);
  const jump=p.isGrounded&&(nearEdge||hazard)&&!previousJump;
  e.step(1/120,{right:true,jump});previousJump=jump;
 }
 assert.equal(e.status,'clear',`stage ${id}, x=${e.player.x}, letters=${e.letterCount}, deaths=${e.deaths}`);
 assert.equal(e.letterCount,e.stage.words.length);
 console.log(`  Stage ${id}: ${e.letterCount} letters, ${Math.round(e.elapsed)}s, ${e.deaths} deaths`);
}});
console.log(`${count} runner engine tests passed`);
