(function(HR){
  HR.Controls=class {
    constructor(root,onPause,onGesture){
      this.root=root;this.pressed=new Set();this.pointers=new Map();this.pulse={};this.destroyed=false;this.listeners=[];
      const bind=(el,type,fn,options)=>{el.addEventListener(type,fn,options);this.listeners.push(()=>el.removeEventListener(type,fn,options));};
      const key={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'jump',Space:'jump',ArrowDown:'down',KeyF:'fire'};
      bind(document,'keydown',e=>{if(e.target.matches('select,input,textarea'))return;if(e.code==='KeyP'){e.preventDefault();if(!e.repeat)onPause();return;}const action=key[e.code];if(!action)return;e.preventDefault();this.pressed.add(action);this.pulse[action]=performance.now()+110;onGesture();});
      bind(document,'keyup',e=>{const action=key[e.code];if(action){e.preventDefault();this.pressed.delete(action);}});
      root.querySelectorAll('[data-control]').forEach(button=>{
        bind(button,'pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);this.pointers.set(e.pointerId,button.dataset.control);button.classList.add('held');this.pulse[button.dataset.control]=performance.now()+130;onGesture();});
        const release=e=>{this.pointers.delete(e.pointerId);button.classList.remove('held');};
        bind(button,'pointerup',release);bind(button,'pointercancel',release);bind(button,'lostpointercapture',release);
        bind(button,'contextmenu',e=>e.preventDefault());
        bind(button,'click',e=>{if(e.detail===0){this.pulse[button.dataset.control]=performance.now()+170;onGesture();}});
      });
      bind(window,'blur',()=>{this.reset();onPause(true);});
      bind(document,'visibilitychange',()=>{if(document.hidden){this.reset();onPause(true);}});
    }
    read(){const now=performance.now(),pointer=new Set(this.pointers.values());return Object.fromEntries(['left','right','jump','down','fire'].map(k=>[k,this.pressed.has(k)||pointer.has(k)||(this.pulse[k]||0)>now]));}
    reset(){this.pressed.clear();this.pointers.clear();this.pulse={};this.root.querySelectorAll('.held').forEach(e=>e.classList.remove('held'));}
    destroy(){if(this.destroyed)return;this.destroyed=true;this.reset();this.listeners.forEach(f=>f());this.listeners=[];}
  };
})(HangulRunner);
