const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({});
for(const f of ['stage-data','engine','world-data','world-engine','world-forest','world-ocean','world-sky','world-underground','world-expansion','boss'])vm.runInContext(fs.readFileSync(`js/games/hangul-runner/${f}.js`,'utf8'),ctx);
const H=ctx.HangulRunner;
assert.equal(H.worlds.length,9);assert.equal(H.worldStages.length,36);
for(const d of H.worldStages){const s=H.buildWorldStage(d.id);assert(s.words.length>=12,d.id);const maxSpeed=s.mode==='swim'?230:s.mode==='fly'?270:270;assert((s.goal.x-60)/maxSpeed>=40,d.id+' minimum travel');assert(s.blocks.length>=30,d.id+' content');assert(s.enemies.length>=10,d.id+' enemies');for(const i of s.items.filter(i=>!i.contained)){assert(i.x>=0&&i.x+i.w<s.length,d.id+' item bounds');assert(i.y>=32,d.id+' item height');}}
const stage=H.buildWorldStage('3-1'),e=new H.WorldEngine(stage),wings=stage.items.find(i=>i.kind==='flight');
assert(wings.x<stage.items.find(i=>i.requiresFlight).x);
assert(stage.items.filter(i=>i.kind==='letter').every(i=>i.y===329));
// Actual initial input walks into the item; no teleport or collection injection.
for(let i=0;i<30;i++)e.step(.02,{right:true});assert(e.player.flight);assert(e.freeMotion);
const y=e.player.y;for(let i=0;i<35;i++)e.step(.02,{jump:true});assert(e.player.y<y-80);
// Missing the item leaves a traversable lower path and repeated pickups.
assert(stage.items.filter(i=>i.kind==='flight').length>=12);
const small=new H.WorldEngine(H.buildWorldStage('1-3'));small.damage(true);assert.equal(small.status,'dead');
const big=new H.WorldEngine(H.buildWorldStage('1-3'));big.player.powerState='big';big.damage(true);assert.equal(big.player.powerState,'small');assert.equal(big.status,'playing');big.damage(true);assert.equal(big.status,'playing');
const cactus=big.stage.enemies.find(i=>i.kind==='cactus');assert(cactus);big.elapsed=0;cactus.phase=0;big.beforePhysics(.02);assert(cactus.retracted);big.elapsed=2.5;big.beforePhysics(.02);assert(!cactus.retracted);assert(cactus.y<cactus.drainY);
const state={stars:19,level:4,progress:{reading:7},records:{claw:{coins:5},hangulRunner:{version:1,stages:{1:{rating:3}},adventure:{stages:{'4-4':{rating:3}},worldRewards:{4:{earnedAt:1}}}}}};
const before=JSON.stringify(state.records.claw);H.recordWorldClear(state,{stageId:'5-1',worldId:5,rating:2,seconds:55,boss:false});assert.equal(state.records.hangulRunner.adventure.stages['4-4'].rating,3);assert.equal(JSON.stringify(state.records.claw),before);assert.equal(state.progress.reading,7);assert.equal(state.level,4);
console.log('PASS 36 stages, content bounds, flight input, cactus damage, immunity, additive saves');
