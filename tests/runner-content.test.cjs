const fs=require('fs'),vm=require('vm'),a=require('assert/strict');const c=vm.createContext({});
for(const f of ['stage-data','engine','world-data','world-engine','world-forest','world-ocean','world-sky','world-underground','boss'])if(fs.existsSync(`js/games/hangul-runner/${f}.js`))vm.runInContext(fs.readFileSync(`js/games/hangul-runner/${f}.js`,'utf8'),c);
const H=c.HangulRunner;
for(const d of H.worldStages){const s=H.buildWorldStage(d.id),e=new H.WorldEngine(s);for(let n=0;n<120;n++)e.step(1/120,{right:true,jump:d.mode!=='run'});a(Number.isFinite(e.player.x));a.equal(s.words.length,s.items.filter(i=>i.kind==='letter').length);a(s.length>1000);}
a.equal(H.worldStages.slice(0,3).flatMap(s=>s.words).join(''),'가나다라마바사아자차카타파하');
const e=new H.WorldEngine(H.buildWorldStage('1-2')),p=e.stage.platforms.find(a=>a.motion);const y=p.y;e.step(.02);a.notEqual(p.y,y);
console.log('PASS content registry, letters, finite simulation and moving platforms:',H.worldStages.length,'stages');
module.exports=H;
