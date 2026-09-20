/* Offline renderer evidence, not a Safari/device test. Uses the shipped canvas code. */
const fs=require('fs'),vm=require('vm'),{createCanvas,Image,GlobalFonts}=require('@napi-rs/canvas');
GlobalFonts.registerFromPath('assets/PretendardVariable.woff2','Pretendard');
const ctx=vm.createContext({Image,document:{createElement:()=>createCanvas(1,1)},window:{devicePixelRatio:2},console});
for(const f of ['stage-data','engine','world-data','world-engine','world-forest','world-ocean','world-sky','world-underground','world-expansion','ocean-expedition','boss','renderer','ocean-renderer'])vm.runInContext(fs.readFileSync(`js/games/hangul-runner/${f}.js`,'utf8'),ctx);
(async()=>{const H=ctx.HangulRunner,art=await H.loadArt(),out=process.argv[2]||'/tmp/ocean-renders';fs.mkdirSync(out,{recursive:true});
 for(const width of [320,390,430])for(const n of [1,2,3,4,5,6,7,8,9]){const e=new H.WorldEngine(H.buildWorldStage(`2-${n}`)),canvas=createCanvas(1280,1080),renderer=new H.Renderer(canvas,art);renderer.resize(width);e.elapsed=4;e.player.x=165;e.player.y=240;e.mode='swim';e.player.velocityX=150;renderer.paint(e);const scaled=createCanvas(width,Math.round(width*540/640));scaled.getContext('2d').drawImage(canvas,0,0,scaled.width,scaled.height);fs.writeFileSync(`${out}/ocean-${n}-${width}.png`,scaled.toBuffer('image/png'));}
 console.log('Rendered 27 shipped-code canvas scenes; no DOM/Safari claim.');})();
