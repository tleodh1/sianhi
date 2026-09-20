const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({});for(const f of ['stage-data','engine','world-data','world-engine','world-forest','world-ocean','world-sky','world-underground','world-expansion','boss'])vm.runInContext(fs.readFileSync(`js/games/hangul-runner/${f}.js`,'utf8'),ctx);
const H=ctx.HangulRunner,e=new H.WorldEngine(H.buildWorldStage('1-1'));
assert.equal(e.player.powerState,'small');assert.equal(e.player.h,64);
for(const form of ['big','small']){const feet=e.player.y+e.player.h;e.setForm(form);assert.equal(e.player.y+e.player.h,feet);for(let i=0;i<20;i++)e.step(.02,{});assert.equal(e.player.y+e.player.h,420);const s={w:160,h:250,sole:238},r=H.playerRenderBounds(e.player,s);assert.equal(r.y+r.h*s.sole/s.h,420);assert.equal(r.feet,420);}
console.log('PASS SMALL/BIG dimensions, invariant sole and physical landing');
