const a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const calls=[],gradient={addColorStop(){}},g=new Proxy({},{get:(_,k)=>k==='createRadialGradient'?()=>gradient:(...args)=>calls.push([k,...args]),set:()=>true});
const canvas={width:0,height:0,setAttribute(){},getContext:()=>g,remove(){}},scene={clientWidth:320,clientHeight:480,append(){}};
const ctx=vm.createContext({SianBrick:{},document:{createElement:()=>canvas},window:{devicePixelRatio:3},ResizeObserver:class{observe(){}disconnect(){}}});
vm.runInContext(fs.readFileSync('js/games/brick/visuals.js','utf8'),ctx);const B=ctx.SianBrick;
for(const width of [320,390,430]){
 const r=B.ballRadius(width),box={x:100,y:100,w:55,h:20};
 for(const [x,y,nx,ny] of [[100-r+1,110,-1,0],[155+r-1,110,1,0],[125,100-r+1,0,-1],[125,120+r-1,0,1]]){const n=B.circleContact(x,y,r,box);a(n);a.equal(n.x,nx);a.equal(n.y,ny);}
 a.equal(B.circleContact(80,80,r,box),null);a(B.circleContact(100-r*.6,100-r*.6,r,box));
}
const render=new B.StarRenderer(scene);a.equal(canvas.width,640);a.equal(canvas.height,960);
const balls=[{x:50,y:50,vx:1,vy:-1}];for(let i=0;i<200;i++){balls[0].x=10+i%80;render.paint(balls,1/60)}a.equal(balls[0].trail.length,7);
a.equal(calls.filter(c=>c[0]==='clearRect').length,200);a(calls.filter(c=>c[0]==='clearRect').every(c=>c[3]===640&&c[4]===960));
scene.clientWidth=430;scene.clientHeight=600;render.resize();a.equal(canvas.width,860);render.paint(balls,1/60);a(calls.some(c=>c[0]==='clearRect'&&c[3]===860&&c[4]===1200));
for(let i=0;i<100;i++)render.impact(50,50);a(render.sparks.length<=48);render.destroy();
const crane=vm.createContext({globalThis:{}});for(const f of ['catalog','renderer'])vm.runInContext(fs.readFileSync(`js/games/claw/${f}.js`,'utf8'),crane);const C=crane.SianClaw;
const front=C.project(50,.12),back=C.project(50,.89);a(front.y-back.y>150);a(front.scale/back.scale>1.35);
console.log('PASS pixel-radius contacts in four directions/corners, bounded trail/sparks, full-frame DPR clears, resize and claw depth projection');
