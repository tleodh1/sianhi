const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},state:{records:{},completed:{},stars:0},save(){}};vm.createContext(ctx);
for(const f of ['catalog','storage','battle-engine'])vm.runInContext(fs.readFileSync(`js/games/robot/${f}.js`,'utf8'),ctx);
const R=ctx.window.SianRobot;
function arena(weapon='sword'){const b=R.defaultBuild();b.parts.weapon=weapon;const e=new R.BattleEngine(b);e.ai=()=>{};e.player.x=0;e.player.z=0;e.enemy.x=0;e.enemy.z=1;e.player.angle=0;return {e,b};}
function tick(e,seconds){for(let i=0;i<seconds*120;i++)e.tick(1/120);}
let {e,b}=arena('sword'),hp=e.enemy.hp;assert.ok(e.attack(e.player));assert.equal(e.enemy.hp,hp,'damage waits for visible swing');tick(e,.2);assert.ok(e.enemy.hp<hp);assert.ok(e.events.hit);assert.ok(e.particles.length>=18);assert.ok(e.enemy.knockZ>0);
({e}=arena('sword'));e.enemy.y=4;hp=e.enemy.hp;e.attack(e.player);tick(e,.2);assert.equal(e.enemy.hp,hp,'jumping target avoids ground sword');
({e}=arena('sword'));e.enemy.z=5;hp=e.enemy.hp;e.attack(e.player);tick(e,.2);assert.equal(e.enemy.hp,hp,'melee outside range misses');assert.ok(e.events.miss);
({e}=arena('blaster'));e.enemy.x=2;e.enemy.z=5;hp=e.enemy.hp;e.attack(e.player,true);assert.equal(e.projectiles.length,0,'skill charges before launch');tick(e,.64);assert.equal(e.projectiles.length,1);assert.equal(e.projectiles[0].kind,'energyBall');assert.ok(e.projectiles[0].position&&e.projectiles[0].velocity&&e.projectiles[0].direction);assert.ok(e.projectiles[0].velocity.x>0,'projectile snapshots actual target direction');assert.ok(e.events.skillCharge&&e.events.launch);tick(e,.7);assert.ok(e.enemy.hp<hp,'projectile collision applies delayed damage');assert.ok(e.events.hit);
({e}=arena('blaster'));e.enemy.z=5;e.enemy.y=4;hp=e.enemy.hp;e.attack(e.player);tick(e,1);assert.equal(e.enemy.hp,hp,'jump clears projectile height');
({e}=arena('hammer'));e.enemy.z=4;e.attack(e.player,true);tick(e,.6);assert.equal(e.projectiles[0].kind,'shockwave');
({e}=arena('drill'));hp=e.enemy.hp;e.attack(e.player,true);tick(e,.6);assert.ok(e.enemy.hp<hp);assert.ok(e.events.hit>=1,'drill skill has repeated impact windows');
const z=e.player.z;e.input.z=-1;tick(e,.16);assert.ok(e.player.z<z);assert.ok(e.jump(e.player));tick(e,3);assert.equal(e.player.y,0,'gravity lands player');
assert.equal(R.recordBattle(b,'easy',true),2);assert.equal(R.recordBattle(b,'easy',true),0);assert.equal(ctx.state.stars,2);assert.equal(b.record.wins,2);
console.log('PASS staged melee, charge-launch-flight-hit skills, dodge/range, reactions and rewards');
