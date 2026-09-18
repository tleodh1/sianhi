const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Target{constructor(){this.l=new Map();}addEventListener(t,f){if(!this.l.has(t))this.l.set(t,new Set());this.l.get(t).add(f);}removeEventListener(t,f){this.l.get(t)?.delete(f);}emit(t,e={}){for(const f of this.l.get(t)||[])f({preventDefault(){},target:{matches:()=>false},...e});}get count(){return [...this.l.values()].reduce((n,s)=>n+s.size,0);}}
const document=new Target(),window=new Target();let now=0;const buttons=['left','right','jump'].map(name=>{const b=new Target();b.dataset={control:name};b.classList={add(){},remove(){}};b.setPointerCapture=()=>{};return b;});const root={querySelectorAll:s=>s==='[data-control]'?buttons:[]};const context=vm.createContext({HangulRunner:{},document,window,performance:{now:()=>now}});vm.runInContext(fs.readFileSync('js/games/hangul-runner/controls.js','utf8'),context);
for(let cycle=0;cycle<3;cycle++){
 let paused=0;const c=new context.HangulRunner.Controls(root,()=>paused++,()=>{});
 assert.equal(document.l.get('keydown').size,1);assert.equal(document.l.get('keyup').size,1);
 document.emit('keydown',{code:'ArrowRight'});assert(c.read().right);document.emit('keyup',{code:'ArrowRight'});now+=200;assert(!c.read().right);
 buttons[1].emit('pointerdown',{pointerId:11,pointerType:'touch'});buttons[2].emit('pointerdown',{pointerId:12,pointerType:'touch'});assert(c.read().right&&c.read().jump);
 buttons[1].emit('pointercancel',{pointerId:11});now+=200;assert(!c.read().right&&c.read().jump);
 window.emit('blur');assert(!c.read().jump);assert.equal(paused,1);
 c.destroy();c.destroy();assert.equal(document.count,0);assert.equal(window.count,0);buttons.forEach(b=>assert.equal(b.count,0));console.log(`PASS lifecycle ${cycle+1}: keyboard, two-finger touch, cancellation, blur, zero listeners after close`);
}
