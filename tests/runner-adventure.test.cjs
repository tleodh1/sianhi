const fs=require('node:fs'),vm=require('node:vm'),a=require('node:assert/strict');
const c=vm.createContext({Math,Date});
for(const f of ['stage-data','engine','world-data','world-engine','world-forest','world-ocean','world-sky','world-underground','boss'])vm.runInContext(fs.readFileSync(`js/games/hangul-runner/${f}.js`,'utf8'),c);
const H=c.HangulRunner;
a.equal(H.worlds.length,4);a.equal(H.worldStages.length,16);a.deepEqual([...new Set(H.worldStages.map(s=>s.theme))],['forest','ocean','sky','underground']);
for(const id of ['1-4','2-4','3-4','4-4']){
 const e=new H.WorldEngine(H.buildWorldStage(id));
 for(let i=0;i<e.stage.words.length;i++){const item=e.stage.items.find(v=>v.id===`letter-${i}`);e.player.x=item.x;e.player.y=item.y;e.step(1/120,{});}
 a.equal(e.letterCount,e.stage.words.length,`${id} collects every correct answer`);a.equal(e.boss.hp,0,`${id} boss is defeated by answers`);
 e.player.x=e.stage.goal.x;e.player.y=e.stage.goal.y;e.step(1/120,{});a.equal(e.status,'clear',`${id} can clear after boss defeat`);
}
const underground=new H.WorldEngine(H.buildWorldStage('4-2'));underground.player.x=300;underground.player.y=300;underground.step(1/120,{jump:true});a.equal(underground.mode,'swim');
const ui=fs.readFileSync('js/games/hangul-runner.js','utf8'),html=fs.readFileSync('index.html','utf8');
for(const token of ['hr-world-map','data-world-stage','recordWorldClear','WorldEngine'])a(ui.includes(token),`UI contains ${token}`);
for(const module of ['world-data','world-engine','world-forest','world-ocean','world-sky','world-underground','boss'])a(html.includes(`hangul-runner/${module}.js`),`${module} loaded`);
console.log('PASS 4-world map wiring, underground swimming, four answer-action bosses and clear flow');
