(function(global){
 const line=(...p)=>p, circle=()=>Array.from({length:33},(_,i)=>[50-30*Math.sin(i*Math.PI/16),50-30*Math.cos(i*Math.PI/16)]);
 const strokes={
 'ㄱ':[[[20,20],[80,20],[80,80]]],'ㄴ':[[[20,20],[20,80],[80,80]]],'ㄷ':[[[20,20],[80,20]],[[20,20],[20,80],[80,80]]],
 'ㄹ':[[[20,20],[80,20],[80,50]],[[20,50],[80,50]],[[20,50],[20,80],[80,80]]],
 'ㅁ':[[[20,20],[20,80]],[[20,20],[80,20],[80,80]],[[20,80],[80,80]]],
 'ㅂ':[[[20,20],[20,80]],[[80,20],[80,80]],[[20,48],[80,48]],[[20,80],[80,80]]],
 'ㅅ':[[[50,20],[20,80]],[[50,20],[80,80]]],'ㅇ':[circle()],
 'ㅈ':[[[20,20],[80,20],[25,80]],[[52,50],[80,80]]],
 'ㅊ':[[[45,10],[55,18]],[[20,30],[80,30],[25,85]],[[52,55],[80,85]]],
 'ㅋ':[[[20,20],[80,20],[80,80]],[[20,50],[80,50]]],
 'ㅌ':[[[20,20],[80,20]],[[20,50],[80,50]],[[20,20],[20,80],[80,80]]],
 'ㅍ':[[[15,20],[85,20]],[[30,20],[30,80]],[[70,20],[70,80]],[[15,80],[85,80]]],
 'ㅎ':[[[40,10],[60,10]],[[20,28],[80,28]],circle().map(([x,y])=>[x,40+y*.55])],
 'ㅏ':[[[45,15],[45,85]],[[45,48],[80,48]]],'ㅑ':[[[45,15],[45,85]],[[45,35],[80,35]],[[45,65],[80,65]]],
 'ㅓ':[[[20,48],[55,48]],[[55,15],[55,85]]],'ㅕ':[[[20,35],[55,35]],[[20,65],[55,65]],[[55,15],[55,85]]],
 'ㅗ':[[[50,20],[50,65]],[[15,65],[85,65]]],'ㅛ':[[[35,20],[35,65]],[[65,20],[65,65]],[[15,65],[85,65]]],
 'ㅜ':[[[15,35],[85,35]],[[50,35],[50,80]]],'ㅠ':[[[15,35],[85,35]],[[35,35],[35,80]],[[65,35],[65,80]]],
 'ㅡ':[[[15,50],[85,50]]],'ㅣ':[[[50,15],[50,85]]]
 };
 const fit=(ss,x,y,w,h)=>ss.map(s=>s.map(([a,b])=>[x+a*w/100,y+b*h/100]));
 for(const [key,base] of Object.entries({'ㄲ':'ㄱ','ㄸ':'ㄷ','ㅃ':'ㅂ','ㅆ':'ㅅ','ㅉ':'ㅈ'}))strokes[key]=[...fit(strokes[base],0,0,48,100),...fit(strokes[base],52,0,48,100)];
 for(const [key,base] of Object.entries({'ㅐ':'ㅏ','ㅒ':'ㅑ','ㅔ':'ㅓ','ㅖ':'ㅕ'}))strokes[key]=[...fit(strokes[base],0,0,65,100),[[82,15],[82,85]]];
 for(const [key,pair] of Object.entries({'ㅘ':['ㅗ','ㅏ'],'ㅙ':['ㅗ','ㅐ'],'ㅚ':['ㅗ','ㅣ'],'ㅝ':['ㅜ','ㅓ'],'ㅞ':['ㅜ','ㅔ'],'ㅟ':['ㅜ','ㅣ'],'ㅢ':['ㅡ','ㅣ']}))strokes[key]=[...fit(strokes[pair[0]],0,10,60,85),...fit(strokes[pair[1]],58,0,42,100)];
 const initials=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'],vowels=[...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'],finals=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
 for(const [key,pair] of Object.entries({'ㄳ':'ㄱㅅ','ㄵ':'ㄴㅈ','ㄶ':'ㄴㅎ','ㄺ':'ㄹㄱ','ㄻ':'ㄹㅁ','ㄼ':'ㄹㅂ','ㄽ':'ㄹㅅ','ㄾ':'ㄹㅌ','ㄿ':'ㄹㅍ','ㅀ':'ㄹㅎ','ㅄ':'ㅂㅅ'}))strokes[key]=[...fit(strokes[pair[0]],0,0,48,100),...fit(strokes[pair[1]],52,0,48,100)];
 function glyph(c){if(strokes[c])return strokes[c];const n=c.charCodeAt(0)-44032;if(n<0||n>11171)return [];const a=initials[Math.floor(n/588)],v=vowels[Math.floor(n%588/28)],f=finals[n%28],height=f?65:100;let top;if('ㅗㅛㅜㅠㅡ'.includes(v))top=[...fit(strokes[a],10,0,80,height*.55),...fit(strokes[v],0,height*.52,100,height*.48)];else if('ㅘㅙㅚㅝㅞㅟㅢ'.includes(v))top=[...fit(strokes[a],0,0,55,height*.53),...fit(strokes[v],0,height*.26,100,height*.74)];else top=[...fit(strokes[a],0,0,55,height),...fit(strokes[v],55,0,45,height)];return f?[...top,...fit(strokes[f],15,68,70,32)]:top;}
 function paths(text){return [...text].flatMap((c,i)=>fit(glyph(c),i*100,0,100,100));}
 function samples(path){const out=[];for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2));for(let j=0;j<n;j++)out.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);}out.push(path.at(-1));return out;}
 const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 function assess(input,guide,tolerance=10){if(input.length<3)return false;const a=samples(input),b=samples(guide),near=(p,set)=>Math.min(...set.map(x=>distance(p,x)));const quarter=b[Math.floor(b.length*.25)],lastQuarter=b[Math.floor(b.length*.75)];if(distance(a[Math.floor(a.length*.25)],quarter)>tolerance*2||distance(a[Math.floor(a.length*.75)],lastQuarter)>tolerance*2)return false;const length=ps=>ps.slice(1).reduce((s,p,i)=>s+distance(p,ps[i]),0);return distance(a[0],b[0])<tolerance*1.5&&distance(a.at(-1),b.at(-1))<tolerance*1.5&&a.filter(p=>near(p,b)<tolerance).length/a.length>.8&&b.filter(p=>near(p,a)<tolerance).length/b.length>.8&&length(a)<length(b)*1.85&&length(a)>length(b)*.65;}
 function mount(host,q,onSuccess){const chars=[...q.ans];let char=0,index=0,user=[],active=null,done=false,animating=true,raf=0,disposed=false,guide=glyph(chars[0]);host.innerHTML='<div class="traceProgress"></div><canvas class="traceCanvas" aria-label="한글 따라쓰기 영역"></canvas><p class="traceMessage" aria-live="polite"></p><div class="traceTools"><button type="button" data-trace="reset">다시 쓰기</button><button type="button" data-trace="hint">획순 보기</button></div>';const canvas=host.querySelector('canvas'),g=canvas.getContext('2d'),msg=host.querySelector('.traceMessage');let ink=[],dot=null;
 function draw(){if(disposed)return;const size=canvas.clientWidth,dpr=Math.min(2,devicePixelRatio||1);if(canvas.width!==Math.round(size*dpr)){canvas.width=canvas.height=Math.round(size*dpr);}g.setTransform(canvas.width/100,0,0,canvas.height/100,0,0);g.clearRect(0,0,100,100);g.lineCap=g.lineJoin='round';const stroke=(ps,color,width,dash=[])=>{if(!ps.length)return;g.strokeStyle=color;g.lineWidth=width;g.setLineDash(dash);g.beginPath();ps.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();};guide.forEach((s,i)=>{stroke(s,done?'#a9dfc5':'#c0dce8',7);stroke(s,'#729bae',.7,[1.5,2]);g.setLineDash([]);g.fillStyle=i===index?'#f09971':'#7891a6';g.beginPath();g.arc(s[0][0],s[0][1],i===index?3:2,0,7);g.fill();if(i===index){g.fillStyle='#294562';g.font='4px sans-serif';g.fillText(String(i+1),s[0][0]-6,s[0][1]-3);}});user.forEach(s=>stroke(s,'#28759a',3.3));stroke(ink,'#28759a',3.3);if(dot){g.fillStyle='#f4b44d';g.beginPath();g.arc(...dot,3,0,7);g.fill();}host.querySelector('.traceProgress').textContent=q.ans+' · '+(char+1)+'/'+chars.length+' 글자 · '+Math.min(index+1,guide.length)+'/'+guide.length+'획';}
 function demo(){cancelAnimationFrame(raf);animating=true;active=null;ink=[];const all=guide.map(samples);let start;function frame(t){if(disposed)return;start??=t;const elapsed=(t-start)/650,k=Math.floor(elapsed);if(k>=all.length){dot=null;animating=false;msg.textContent='이제 직접 써 볼까?';draw();return;}dot=all[k][Math.min(all[k].length-1,Math.floor(elapsed%1*all[k].length))];msg.textContent='빛나는 점을 따라 획순을 보아요.';draw();raf=requestAnimationFrame(frame);}raf=requestAnimationFrame(frame);}
 const point=e=>{const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100];};
 function down(e){if(animating||done||active!==null)return;e.preventDefault();active=e.pointerId;canvas.setPointerCapture(active);ink=[point(e)];draw();}
 function move(e){if(active!==e.pointerId)return;e.preventDefault();for(const p of e.getCoalescedEvents?.()||[e]){const next=point(p);if(distance(next,ink.at(-1))>.35)ink.push(next);}draw();}
 function up(e){if(active!==e.pointerId)return;active=null;const ok=assess(ink,guide[index],e.pointerType==='touch'?11:9);if(ok){user.push(ink);index++;msg.textContent='잘 썼어! 다음 시작점을 찾아보자.';if(index===guide.length){if(char<chars.length-1){char++;index=0;user=[];guide=glyph(chars[char]);demo();}else{done=true;msg.textContent='⭐ 잘 썼어! '+q.ans+' 완성!';host.classList.add('traceComplete');onSuccess();}}}else msg.textContent=distance(ink[0],guide[index][0])>18?'여기서 시작해 볼까? 빛나는 점을 찾아봐.':'거의 다 됐어! 이 획을 한 번 더 써 볼까?';ink=[];draw();}
 function cancel(){active=null;ink=[];draw();}canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',cancel);
 host.querySelector('[data-trace="reset"]').onclick=()=>{if(done)return;cancelAnimationFrame(raf);char=0;index=0;user=[];ink=[];guide=glyph(chars[0]);animating=false;draw();msg.textContent='첫 시작점부터 천천히 써 보자.';};host.querySelector('[data-trace="hint"]').onclick=()=>{if(!done)demo();};const observer=new ResizeObserver(draw);observer.observe(canvas);draw();demo();return ()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',cancel);};}
 global.HangulTrace={paths,glyph,assess,mount};
})(window);
