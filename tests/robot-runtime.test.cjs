const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element extends EventTarget { constructor(){super();this.style={};this.classList={add(){},remove(){}};this.dataset={};} setPointerCapture(){} getBoundingClientRect(){return {left:0,top:0,width:100,height:100}} }
const doc=new Element(),win=new Element(),stick=new Element(),knob=new Element();stick.querySelector=()=>knob;
const buttons=['attack','skill','jump','guard','dash'].map(act=>{const b=new Element();b.dataset.act=act;return b;});
const root={querySelector:()=>stick,querySelectorAll:()=>buttons};
const ctx={window:{SianRobot:{}},AbortController};vm.createContext(ctx);vm.runInContext(fs.readFileSync('js/games/robot/controls.js','utf8'),ctx);
function event(el,type,values){const e=new Event(type);Object.assign(e,values);el.dispatchEvent(e);}
for(let n=0;n<3;n++){let attacks=0,jumps=0,dashes=0;const engine={player:{},input:{},attack(){attacks++},jump(){jumps++},dash(){dashes++}};
const dispose=ctx.window.SianRobot.bindBattleControls(root,engine,doc,win);
event(stick,'pointerdown',{pointerId:1,clientX:85,clientY:50});event(buttons[0],'pointerdown',{pointerId:2});assert.equal(attacks,1);assert.equal(engine.input.x,1);
event(buttons[0],'pointerup',{pointerId:2});assert.equal(engine.input.x,1,'attack release preserves joystick');
event(buttons[1],'pointerdown',{pointerId:3});event(buttons[2],'pointerdown',{pointerId:4});assert.equal(attacks,2);assert.equal(jumps,1);assert.equal(engine.input.x,1,'move + skill + jump remain independent');event(buttons[1],'pointerup',{pointerId:3});event(buttons[2],'pointerup',{pointerId:4});
event(stick,'pointercancel',{pointerId:1});assert.equal(engine.input.x,0);
event(buttons[3],'pointerdown',{pointerId:5});assert.equal(engine.input.guard,true);event(win,'blur',{});assert.equal(engine.input.guard,false);
event(stick,'pointerdown',{pointerId:7,clientX:15,clientY:50});event(buttons[4],'pointerdown',{pointerId:8});assert.equal(dashes,1);assert.equal(engine.input.x,-1,'joystick + dash stay simultaneous');event(buttons[4],'pointerup',{pointerId:8});event(stick,'pointerup',{pointerId:7});
dispose();event(buttons[0],'pointerdown',{pointerId:6});assert.equal(attacks,2,'no listener after disposal');}
console.log('PASS 3 cycles of simultaneous pointers, cancellation, blur and listener disposal');
