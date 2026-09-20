const assert=require('node:assert/strict');const P=require('../js/games/pang/engine.js');let seed=123;const rng=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
for(let n=1;n<=130;n++){const e=new P.Engine(n,rng);assert.equal(P.runs(e.board).length,0,'no initial match '+n);assert.ok(e.hint().length,'legal move '+n);assert.equal(e.config.seconds,60);const [a,b]=e.hint();assert.ok(e.swap(a,b));assert.equal(e.swap(a,b),false);for(let t=0;t<100;t++)e.tick(.05);assert.ok(e.score>0);assert.equal(new Set(e.board.filter(Boolean).map(c=>c.id)).size,e.board.filter(Boolean).length);}
function fixture(){const e=new P.Engine(1,rng);e.board=Array.from({length:49},(_,i)=>({id:i+1,type:(i%7+(i/7|0)*2)%5,special:null}));e.serial=49;return e;}
for(const [cells,special] of [[[0,1,2,3],'column'],[[0,7,14,21],'row'],[[0,1,2,3,4],'color'],[[1,8,15,14,16],'area']]){const e=fixture();cells.forEach(i=>e.board[i].type=7);e.resolve(P.groups(e.board));assert.ok(e.board.some(c=>c?.special===special),special);}
{const e=fixture();e.board[0].special='row';e.board[3].special='column';e.resolve([],[0]);assert.equal(e.board[45],null);assert.equal(e.board[6],null);}
{const e=fixture(),before=e.time;e.paused=true;for(let i=0;i<50;i++)e.tick(.1);assert.equal(e.time,before);e.paused=false;e.time=0;e.board[0].special='area';for(let i=0;i<60;i++)e.tick(.1);assert.equal(e.phase,'result');assert.ok(e.score>0);}
{const e=fixture();e.board[0].time=true;e.bonus=12;e.resolve([],[0]);assert.equal(e.time,60);}
{const e=new P.Engine(40,rng);const i=e.ice.findIndex(v=>v);e.ice[i]=2;e.resolve([],[i]);assert.equal(e.ice[i],1);assert.ok(e.board[i]);e.resolve([],[i]);assert.equal(e.ice[i],0);assert.equal(e.board[i],null);}
{const e=fixture();e.shuffle();assert.ok(e.hint().length);}
{let s=P.record({}, {level:1,score:3000,stars:3,combo:4,matches:5});s=P.record(s,{level:1,score:0,stars:0,combo:0,matches:0});assert.equal(s.levels[1].stars,3);assert.equal(s.unlocked,2);assert.equal(s.totalMatches,5);assert.ok(!('hearts' in s));}
assert.ok(!P.adjacent(6,7));assert.ok(!P.adjacent(0,8));console.log('PASS Pang: 130 levels, specials, chains, input lock, timer, ice, shuffle, saved bests/unlimited retry');
{const e=fixture();e.heat=99;[0,1,2].forEach(i=>e.board[i].type=7);e.resolve(P.groups(e.board));assert.equal(e.fever,7);assert.ok(e.events.some(v=>v.type==='fever'));}
{const e=fixture();e.board[0].special='color';const color=e.board[1].type;assert.ok(e.swap(0,1));e.tick(.1);e.tick(.1);assert.ok(e.removed[color]>=1);assert.equal(e.phase,'pop');}
{const e=fixture();let pair;for(let i=0;i<48;i++)if(P.adjacent(i,i+1)&&!P.moves(e.board).some(([a,b])=>a===i&&b===i+1)){pair=[i,i+1];break;}const ids=e.board.map(c=>c.id);e.swap(...pair);for(let i=0;i<10;i++)e.tick(.05);assert.deepEqual(e.board.map(c=>c.id),ids);assert.equal(e.score,0);}
console.log('PASS Pang fever duration, color-bomb swap and invalid-swap restoration');
