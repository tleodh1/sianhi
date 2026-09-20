/* Sian Pang: Square Bomb, TNT, special combinations, cascade/ice safety and random-board fuzzing. */
const assert=require('node:assert/strict'),P=require('../js/games/pang/engine.js');
const seeded=s=>()=>((s=(s*1664525+1013904223)>>>0)/4294967296);
const at=(x,y)=>y*7+x;
function fixture(){const e=new P.Engine(1,seeded(7));e.board=Array.from({length:49},(_,i)=>({id:i+1,type:(i%7+(i/7|0)*2)%5,special:null}));e.serial=49;e.phase='ready';return e;}
const cleared=(before,e)=>before.map((c,i)=>c&&!e.board[i]?i:-1).filter(i=>i>=0);
function fire(e,cells){const before=e.snapshot();e.resolve([],cells);return cleared(before,e);}
function swapSpecials(a,b,sa,sb){const e=fixture();e.board[b].special=sa;e.board[a].special=sb;const before=e.snapshot();assert.ok(e.swap(a,b));e.tick(.18);return {e,hit:cleared(before,e)};}
{const e=fixture();assert.equal(P.squares(e.board).length,0);[at(2,2),at(3,2),at(2,3),at(3,3)].forEach(i=>e.board[i].type=7);const found=P.squares(e.board);assert.equal(found.length,1);const g=P.groups(e.board);assert.equal(g[0].squares.length,1);e.resolve(g);assert.ok(e.board.some(c=>c?.special==='square'));}
{const e=fixture();e.board[at(3,3)].special='square';assert.equal(fire(e,[at(3,3)]).length,9);}
{const e=fixture();e.board[0].special='square';assert.deepEqual(fire(e,[0]).sort((a,b)=>a-b),[0,1,7,8]);}
{const e=fixture();[at(1,0),at(1,1),at(1,2),at(0,2),at(2,2)].forEach(i=>e.board[i].type=7);e.resolve(P.groups(e.board));assert.ok(e.board.some(c=>c?.special==='tnt'));}
{const e=fixture();e.board[at(3,3)].special='tnt';assert.equal(fire(e,[at(3,3)]).length,25);}
for(const i of [0,6,42,48]){const e=fixture();e.board[i].special='tnt';assert.ok(fire(e,[i]).every(k=>k>=0&&k<49));}
{const {hit}=swapSpecials(at(3,3),at(4,3),'row','column');assert.ok(hit.length>=13);}
{const {hit}=swapSpecials(at(3,3),at(4,3),'square','row');assert.ok(hit.length>9);}
{const {hit}=swapSpecials(at(3,3),at(4,3),'square','square');assert.ok(hit.length>9);}
{const {hit}=swapSpecials(at(1,1),at(2,1),'tnt','tnt');assert.ok(hit.length>25);}
{const {hit}=swapSpecials(at(3,3),at(4,3),'tnt','row');assert.ok(hit.length>25);}
{const e=fixture();const type=e.board[at(4,3)].type;e.board[at(3,3)].special='color';assert.ok(e.swap(at(3,3),at(4,3)));e.tick(.18);assert.equal(e.board.filter(c=>c&&c.type===type).length,0);}
for(const kind of ['row','column','square','tnt']){const e=fixture();const type=e.board[at(4,3)].type;e.board[at(3,3)].special='color';e.board[at(4,3)].special=kind;assert.ok(e.swap(at(3,3),at(4,3)));e.tick(.18);assert.equal(e.board.filter(c=>c&&c.type===type).length,0);}
{const e=fixture();e.board[at(3,3)].special='tnt';e.resolve([],[at(3,3)]);let guard=0;while(e.phase!=='ready'&&guard++<400)e.tick(.05);assert.ok(guard<400);assert.equal(e.board.filter(Boolean).length,49);}
{const legacy={unlocked:3,levels:{1:{score:1200,stars:2}},bestCombo:5,totalMatches:40,tutorial:true};const next=P.record(legacy,{level:1,score:400,stars:0,combo:2,matches:3});assert.equal(next.unlocked,3);assert.equal(next.tutorial,true);}
for(let s=1;s<=1200;s++){const e=new P.Engine(1+(s*7)%130,seeded(s*2654435761));assert.equal(P.runs(e.board).length,0);assert.equal(P.squares(e.board).length,0);assert.equal(e.hint().length,2);}
console.log('PASS Pang specials: Square Bomb, TNT, combinations, cascade and compatibility');