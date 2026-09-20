(function(global){
 const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 const arc=(cx,cy,rx,ry,a0,a1,n=18)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+Math.cos(a)*rx,cy+Math.sin(a)*ry];});
 const G={
  A:[[[18,84],[50,14],[82,84]],[[31,58],[69,58]]],
  B:[[[23,14],[23,86]],[[23,14],...arc(23,35,30,21,-Math.PI/2,Math.PI/2,12)],[[23,50],...arc(23,68,32,18,-Math.PI/2,Math.PI/2,12)]],
  C:[arc(55,50,34,36,.25*Math.PI,1.75*Math.PI,26)],
  D:[[[24,14],[24,86]],[[24,14],...arc(24,50,39,36,-Math.PI/2,Math.PI/2,20)]],
  E:[[[25,14],[25,86]],[[25,14],[78,14]],[[25,50],[67,50]],[[25,86],[78,86]]],
  F:[[[25,14],[25,86]],[[25,14],[78,14]],[[25,50],[67,50]]],
  G:[arc(54,50,35,36,.2*Math.PI,1.75*Math.PI,25),[[57,55],[82,55],[82,73]]],
  H:[[[22,14],[22,86]],[[78,14],[78,86]],[[22,50],[78,50]]],
  I:[[[30,14],[70,14]],[[50,14],[50,86]],[[30,86],[70,86]]],
  J:[[[30,14],[76,14]],[[62,14],[62,67],...arc(43,67,19,20,0,Math.PI,12)]],
  K:[[[24,14],[24,86]],[[76,14],[24,52]],[[24,52],[78,86]]],
  L:[[[24,14],[24,86],[78,86]]],
  M:[[[18,86],[18,14],[50,58],[82,14],[82,86]]],
  N:[[[20,86],[20,14],[80,86],[80,14]]],
  O:[[...arc(50,50,34,36,0,Math.PI*2,30)]],
  P:[[[23,86],[23,14]],[[23,14],...arc(23,35,31,21,-Math.PI/2,Math.PI/2,14)]],
  Q:[[...arc(50,48,33,35,0,Math.PI*2,30)],[[58,65],[82,88]]],
  R:[[[23,86],[23,14]],[[23,14],...arc(23,35,31,21,-Math.PI/2,Math.PI/2,14)],[[48,51],[80,86]]],
  S:[...[]],
  T:[[[18,14],[82,14]],[[50,14],[50,86]]],
  U:[[[20,14],[20,63],...arc(50,63,30,23,Math.PI,0,16),[80,14]]],
  V:[[[18,14],[50,86],[82,14]]],
  W:[[[12,14],[28,86],[50,44],[72,86],[88,14]]],
  X:[[[20,14],[80,86]],[[80,14],[20,86]]],
  Y:[[[18,14],[50,50],[82,14]],[[50,50],[50,86]]],
  Z:[[[18,14],[82,14],[18,86],[82,86]]]
 };
 G.S=[[[75,20],[64,13],[44,13],[27,24],[24,39],[33,49],[64,54],[76,64],[73,78],[59,87],[37,86],[24,76]]];
 const phases={A:'진한 선 따라쓰기',B:'점선 따라쓰기',C:'도움선 살짝 보기',D:'기억해서 쓰기'};
 function guideFor(ch){return G[String(ch).toUpperCase()]||G.A;}
 function sample(path){const out=[];for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],n=Math.max(1,Math.ceil(dist(a,b)/2));for(let j=0;j<n;j++)out.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);}out.push(path.at(-1));return out;}
 function nearest(p,set){let m=1e9;for(const q of set)m=Math.min(m,dist(p,q));return m;}
 function assess(input,guide,pointerType){
  if(input.length<3)return false;const a=sample(input),b=sample(guide),tol=pointerType==='touch'?14:11;
  if(dist(a[0],b[0])>tol*1.8||dist(a.at(-1),b.at(-1))>tol*1.8)return false;
  return a.filter(p=>nearest(p,b)<tol).length/a.length>.72&&b.filter(p=>nearest(p,a)<tol*1.15).length/b.length>.68;
 }
 function mount(host,q,onSuccess){
  const text=String(q.writeText||q.word||'A').toUpperCase().replace(/[^A-Z]/g,'')||'A';
  const list=q.tracePhases||(q.mode==='writeWord'?['B','C','D']:['A','B','C','D']);
  let phaseIndex=0,charIndex=0,strokeIndex=0,active=null,ink=[],accepted=[],done=false,disposed=false,raf=0,dot=null,animating=false;
  host.innerHTML='<div class="englishTraceHead"><strong class="englishTraceWord"></strong><span class="englishTracePhase"></span></div><div class="englishTraceBoard"><canvas class="englishTraceCanvas" aria-label="영어 알파벳 따라쓰기"></canvas></div><p class="englishTraceMessage" aria-live="polite"></p><div class="englishTraceTools"><button type="button" data-et="reset">다시 쓰기</button><button type="button" data-et="hint">획순 보기</button><button type="button" data-et="sound">🔊 소리</button></div>';
  const canvas=host.querySelector('canvas'),g=canvas.getContext('2d'),msg=host.querySelector('.englishTraceMessage'),wordEl=host.querySelector('.englishTraceWord'),phaseEl=host.querySelector('.englishTracePhase');
  const current=()=>guideFor(text[charIndex]);
  function draw(){
   if(disposed)return;const size=canvas.clientWidth,dpr=Math.min(2,devicePixelRatio||1);if(canvas.width!==Math.round(size*dpr)){canvas.width=canvas.height=Math.round(size*dpr);}
   g.setTransform(canvas.width/100,0,0,canvas.height/100,0,0);g.clearRect(0,0,100,100);g.lineCap=g.lineJoin='round';
   const stroke=(ps,color,width,dash=[])=>{if(!ps.length)return;g.beginPath();g.strokeStyle=color;g.lineWidth=width;g.setLineDash(dash);ps.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();g.setLineDash([]);};
   stroke([[50,5],[50,95]],'#e7edf1',.5,[2,2]);stroke([[5,50],[95,50]],'#e7edf1',.5,[2,2]);
   const ph=list[phaseIndex],guide=current(),show=ph!=='D'||animating;
   guide.forEach((s,i)=>{if(show){const color=ph==='C'?'#d7e2e8':'#b9d6e4',width=ph==='A'?7:ph==='B'?2.2:3.2,dash=ph==='B'?[2,2]:[];stroke(s,color,width,dash);}if(i===strokeIndex&&!done){const p=s[0];g.fillStyle='#e3ab45';g.beginPath();g.arc(p[0],p[1],2.5,0,Math.PI*2);g.fill();g.fillStyle='#294562';g.font='4px sans-serif';g.fillText(String(i+1),p[0]-6,p[1]-4);}});
   accepted.forEach(s=>stroke(s,'#2d7892',3.4));stroke(ink,'#2d7892',3.4);if(dot){g.fillStyle='#f2b84f';g.beginPath();g.arc(dot[0],dot[1],3,0,Math.PI*2);g.fill();}
   wordEl.innerHTML=[...text].map((c,i)=>'<span class="'+(i<charIndex?'done':i===charIndex?'current':'')+'">'+c+'</span>').join('');
   phaseEl.textContent=phases[ph]+' · '+(charIndex+1)+'/'+text.length+' 글자';
  }
  const point=e=>{const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100];};
  function demo(){cancelAnimationFrame(raf);animating=true;ink=[];const pts=sample(current()[strokeIndex]);let start;function frame(t){if(disposed)return;start??=t;const p=Math.min(1,(t-start)/650);dot=pts[Math.min(pts.length-1,Math.floor(p*(pts.length-1)))];draw();if(p<1)raf=requestAnimationFrame(frame);else{dot=null;animating=false;msg.textContent='이제 직접 써 볼까?';draw();}}raf=requestAnimationFrame(frame);}
  function nextStep(){
   const guide=current();strokeIndex++;if(strokeIndex<guide.length){msg.textContent='잘했어! 다음 획을 써 보자.';draw();return;}
   charIndex++;strokeIndex=0;accepted=[];if(charIndex<text.length){msg.textContent='다음 글자로 넘어가자.';draw();return;}
   phaseIndex++;charIndex=0;if(phaseIndex<list.length){msg.textContent=phases[list[phaseIndex]]+' 단계야.';draw();return;}
   done=true;msg.textContent='⭐ 잘 썼어! '+text+' 완성!';host.classList.add('englishTraceComplete');draw();onSuccess();
  }
  function down(e){if(done||animating||active!==null||e.button>0)return;e.preventDefault();active=e.pointerId;canvas.setPointerCapture(active);ink=[point(e)];draw();}
  function move(e){if(active!==e.pointerId)return;e.preventDefault();for(const p of e.getCoalescedEvents?.()||[e]){const n=point(p);if(dist(n,ink.at(-1))>.35)ink.push(n);}draw();}
  function up(e){if(active!==e.pointerId)return;active=null;const ok=assess(ink,current()[strokeIndex],e.pointerType);if(ok){accepted.push(ink);ink=[];nextStep();}else{msg.textContent='선 가까이에서 천천히 다시 써 보자.';ink=[];draw();}}
  function cancel(){active=null;ink=[];draw();}
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',cancel);
  host.querySelector('[data-et="reset"]').onclick=()=>{cancelAnimationFrame(raf);phaseIndex=0;charIndex=0;strokeIndex=0;accepted=[];ink=[];done=false;animating=false;host.classList.remove('englishTraceComplete');msg.textContent='첫 시작점부터 천천히 써 보자.';draw();};
  host.querySelector('[data-et="hint"]').onclick=()=>{if(!done)demo();};
  host.querySelector('[data-et="sound"]').onclick=e=>global.LearningSpeech?.speak([{text,lang:'en-US'}],{button:e.currentTarget});
  const observer=new ResizeObserver(draw);observer.observe(canvas);msg.textContent='빛나는 시작점부터 손가락으로 따라 써 보자.';draw();demo();
  return ()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',cancel);};
 }
 global.EnglishTrace={mount,guideFor,assess};
})(window);