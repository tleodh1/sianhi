const H=require('./runner-content.test.cjs'),a=require('assert/strict');
let e=new H.WorldEngine(H.buildWorldStage('2-1'));for(let n=0;n<120;n++)e.step(1/120,{jump:true});a.equal(e.mode,'swim');a(e.player.y<250);for(let n=0;n<120;n++)e.step(1/120,{down:true});a(e.player.y>250);
e=new H.WorldEngine(H.buildWorldStage('2-3'));const wrong=e.stage.items.find(i=>i.id==='letter-1');a.equal(e.canCollect(wrong),false);a.equal(e.canCollect(e.stage.items[0]),true);a.equal(e.sequence,1);
console.log('PASS swimming ascent/descent and ordered word collection');
