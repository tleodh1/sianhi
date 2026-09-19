(function(R){
  R.bindBattleControls=function(root,engine,doc=document,win=window){
    const abort=new AbortController(),signal=abort.signal,keys=new Set(),pointers=new Map();
    const stick=root.querySelector('[data-stick]'),knob=stick.querySelector('i');let sx=0,sz=0;
    const on=(el,type,fn)=>el.addEventListener(type,fn,{signal});
    function sync(){engine.input.x=Math.max(-1,Math.min(1,sx+(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0)));engine.input.z=Math.max(-1,Math.min(1,sz+(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0)));engine.input.guard=keys.has('l')||[...pointers.values()].some(x=>x.action==='guard');}
    const act=action=>{if(action==='attack')engine.attack(engine.player);if(action==='skill')engine.attack(engine.player,true);if(action==='jump')engine.jump(engine.player);if(action==='dash')engine.dash(engine.player);};
    const clear=()=>{keys.clear();pointers.clear();sx=sz=0;knob.style.transform='';root.querySelectorAll('[data-act]').forEach(b=>b.classList.remove('pressed'));sync();};
    on(doc,'keydown',e=>{const k=e.key.toLowerCase();if(['w','a','s','d','arrowleft','arrowright','arrowup','arrowdown',' ','j','k','l','shift'].includes(k)){e.preventDefault();keys.add(k);if(!e.repeat)act({' ':'jump',j:'attack',k:'skill',shift:'dash'}[k]);sync();}});
    on(doc,'keyup',e=>{keys.delete(e.key.toLowerCase());sync();});
    function aim(e){const r=stick.getBoundingClientRect();sx=Math.max(-1,Math.min(1,(e.clientX-r.left-r.width/2)/35));sz=Math.max(-1,Math.min(1,(e.clientY-r.top-r.height/2)/35));knob.style.transform=`translate(${sx*25}px,${sz*25}px)`;sync();}
    on(stick,'pointerdown',e=>{if([...pointers.values()].some(x=>x.action==='stick'))return;e.preventDefault();stick.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{action:'stick',element:stick});aim(e);});
    on(stick,'pointermove',e=>{if(pointers.get(e.pointerId)?.action==='stick')aim(e);});
    for(const b of root.querySelectorAll('[data-act]'))on(b,'pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{action:b.dataset.act,element:b});b.classList.add('pressed');act(b.dataset.act);sync();});
    function release(e){const old=pointers.get(e.pointerId);if(!old)return;pointers.delete(e.pointerId);if(old.action==='stick'){sx=sz=0;knob.style.transform='';}if(![...pointers.values()].some(x=>x.element===old.element))old.element.classList.remove('pressed');sync();}
    for(const el of [stick,...root.querySelectorAll('[data-act]')])for(const type of ['pointerup','pointercancel','lostpointercapture'])on(el,type,release);
    on(win,'blur',clear);on(doc,'visibilitychange',clear);
    return ()=>{clear();abort.abort();};
  };
})(window.SianRobot);
