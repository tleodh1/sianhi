const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element extends EventTarget { constructor(){super();this.style={};this.classList={add(){},remove(){}};this.dataset={};} setPointerCapture(){} getBoundingClientRect(){return {left:0,top:0,width:100,height:100}} }
const doc=new Element(),win=new Element(),stick=new Element(),knob=new Element();stick.querySelector=()=>knob;
const buttons=['attack','guard'].map(act=>{const b=new Element();b.dataset.act=act;return b;});
const root={querySelector:()=>stick,querySelectorAll:()=>buttons};
const ctx={window:{SianRobot:{}},AbortController};vm.createContext(ctx);vm.runInContext(fs.readFileSync('js/games/robot/controls.js','utf8'),ctx);
function event(el,type,values){const e=new Event(type);Object.assign(e,values);el.dispatchEvent(e);}
for(let n=0;n<3;n++){let attacks=0;const engine={player:{},input:{},attack(){attacks++},jump(){},dash(){}};
const dispose=ctx.window.SianRobot.bindBattleControls(root,engine,doc,win);
event(stick,'pointerdown',{pointerId:1,clientX:85,clientY:50});event(buttons[0],'pointerdown',{pointerId:2});assert.equal(attacks,1);assert.equal(engine.input.x,1);
event(buttons[0],'pointerup',{pointerId:2});assert.equal(engine.input.x,1,'attack release preserves joystick');
event(stick,'pointercancel',{pointerId:1});assert.equal(engine.input.x,0);
event(buttons[1],'pointerdown',{pointerId:3});assert.equal(engine.input.guard,true);event(win,'blur',{});assert.equal(engine.input.guard,false);
dispose();event(buttons[0],'pointerdown',{pointerId:4});assert.equal(attacks,1,'no listener after disposal');}
console.log('PASS 3 cycles of simultaneous pointers, cancellation, blur and listener disposal');
