const S=[{n:'연산',i:'➕',c:'#ff6900',d:'10 만들기부터 차근차근',qs:[['6 + ? = 10',['4','3','5','2'],'4','10에서 6을 빼보세요.'],['사과가 5개 있어요. 2개를 먹으면?',['2개','3개','4개','7개'],'3개','5에서 2만큼 뒤로 가요.'],['10 = 7 + ?',['1','2','3','4'],'3','7에서 10까지 몇 칸일까요?']]},{n:'팩토',i:'🧩',c:'#ff3f72',d:'규칙·도형·논리 사고력',qs:[['🔴 🔵 🔴 🔵 다음은?',['🔴','🔵','🟢','🟡'],'🔴','두 색이 번갈아 나와요.'],['다른 하나를 찾아보세요.',['▲','▲','●','▲'],'●','모양이 같은 것끼리 살펴봐요.'],['가장 긴 것은?',['━━','━━━━','━','━━━'],'━━━━','선의 길이를 눈으로 비교해요.']]},{n:'한글',i:'가',c:'#00a8d8',d:'가나다라마바사 낱말 모험',qs:[['「가」로 시작하는 낱말은?',['가방','나무','다리','사과'],'가방','첫 글자의 소리를 읽어봐요.'],['「나」로 시작하는 낱말은?',['바다','나비','하마','모자'],'나비','ㄴ + ㅏ = 나'],['뜻이 자연스러운 문장은?',['나는 밥을 먹어요.','밥은 나를 먹어요.','먹어요 나는 밥.','나는 먹어요를 밥.'],'나는 밥을 먹어요.','누가 무엇을 하는지 생각해요.']]},{n:'영어',i:'A',c:'#7546e8',d:'알파벳과 파닉스 첫걸음',qs:[['A 소리로 시작하는 단어는?',['Apple','Sun','Dog','Moon'],'Apple','A의 대표 소리 애-를 생각해요.'],['대문자 A의 짝꿍 소문자는?',['a','b','c','d'],'a','모양이 달라도 같은 알파벳이에요.'],['B 소리로 시작하는 단어는?',['Cat','Ball','Sun','Fish'],'Ball','브- 소리로 시작해요.']]},{n:'과학',i:'🔬',c:'#00a76b',d:'관찰하고 예상하는 실험실',qs:[['살아있는 것은 무엇일까요?',['🌳 나무','🪨 돌','🚗 자동차','✏️ 연필'],'🌳 나무','자라고 변화하는 것을 찾아봐요.'],['물에 뜰 가능성이 큰 것은?',['🪨 돌','🪵 나무조각','🔩 쇠못','🧱 벽돌'],'🪵 나무조각','재료와 무게를 생각해봐요.'],['그림자는 무엇이 있을 때 생길까요?',['빛과 물체','소리만','바람만','냄새만'],'빛과 물체','빛이 물체에 가려지는 상황이에요.']]},{n:'코딩',i:'🤖',c:'#1769df',d:'명령과 순서로 로봇 움직이기',qs:[['로봇을 오른쪽으로 보내는 명령은?',['→','←','↑','↓'],'→','오른쪽 화살표를 찾아요.'],['앞으로 2칸 가려면?',['↑ ↑','↓ ↓','← →','↑ ↓'],'↑ ↑','같은 앞으로 명령을 두 번 실행해요.'],['↑ → 순서대로 움직이면?',['위, 오른쪽','오른쪽, 위','아래, 왼쪽','제자리'],'위, 오른쪽','명령은 왼쪽부터 실행해요.']]},{n:'한자',i:'山',c:'#e84a35',d:'그림으로 만나는 기초 한자',qs:[['산을 뜻하는 한자는?',['山','水','木','日'],'山','산봉우리 모양을 닮았어요.'],['물을 뜻하는 한자는?',['火','水','月','人'],'水','흐르는 물의 모습을 떠올려요.'],['해를 뜻하는 한자는?',['日','月','山','木'],'日','태양을 네모난 모양으로 나타낸 글자예요.']]}];let state=JSON.parse(localStorage.getItem('sianhi-v2')||'{"stars":0,"done":[],"progress":{}}');state.progress=state.progress||{};const $=s=>document.querySelector(s);function save(){localStorage.setItem('sianhi-v2',JSON.stringify(state));render()}function render(){subjectGrid.innerHTML=S.map((s,i)=>`<button class="subject ${state.done.includes(s.n)?'done':''}" style="background:${s.c}" data-subject="${i}"><span class="ico">${s.i}</span><h3>${s.n}</h3><p>${s.d}</p><em>→</em></button>`).join('');todayCards.innerHTML=[0,1,3].map(i=>`<button class="mini" style="background:${S[i].c}" data-subject="${i}"><b>${S[i].i}</b>${S[i].n} 미션</button>`).join('');subjectGrid.insertAdjacentHTML('beforeend',`<button class="subject gameWorldCard"><span class="ico">🎮</span><h3>게임월드</h3><p>픽셀 게임으로 신나게 놀며 배우기</p><em>→</em></button>`);document.querySelectorAll('.subject[data-subject]').forEach((b,i)=>b.onclick=()=>play(i,state.progress[S[i].n]||0));document.querySelector('.gameWorldCard').onclick=openGameWorld;document.querySelectorAll('.mini').forEach((b,j)=>{const i=[0,1,3][j];b.onclick=()=>play(i,state.progress[S[i].n]||0)});stars.textContent=recordStars.textContent=state.stars;completed.textContent=state.done.length;let lv=Math.floor(state.stars/15)+1;level.textContent=lv;if(document.getElementById('level2'))document.getElementById('level2').textContent=lv;bar.style.width=(state.stars%15)/15*100+'%';nextText.textContent=`LEVEL ${lv+1}까지 별 ${15-(state.stars%15)}개 남았어요!`}window.play=(si,qi)=>{if(si===5)return playCoding(qi);const s=S[si],q=s.qs[qi];gameBody.innerHTML=`<div class="gameHead"><span class="gameIcon">${s.i}</span><h2>${s.n} · ${qi+1}단계</h2><p>${s.d}</p></div><div class="progress"><i style="width:${(qi+1)/s.qs.length*100}%"></i></div><div class="question"><h3>${q[0]}</h3><div class="choices">${q[1].map(x=>`<button class="choice">${x}</button>`).join('')}</div><div class="feedback"></div><button class="hint">💡 힌트 보기</button></div>`;gameBody.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{const f=gameBody.querySelector('.feedback');if(b.textContent===q[2]){f.textContent='정답! 잘했어요 ⭐';gameBody.querySelectorAll('.choice').forEach(x=>x.disabled=true);setTimeout(()=>{if(qi<s.qs.length-1){state.progress[s.n]=qi+1;localStorage.setItem('sianhi-v2',JSON.stringify(state));play(si,qi+1)}else{state.progress[s.n]=0;if(!state.done.includes(s.n))state.done.push(s.n);state.stars+=3;save();gameBody.innerHTML=`<div class="question"><h3>🎉 ${s.n} 한 바퀴 완료!</h3><p>별 3개를 획득했어요.<br>다음 문제 묶음도 계속 도전할 수 있어요.</p><button class="nextBtn" id="continueBtn">계속 학습하기 →</button> <button class="hint" onclick="game.close()">잠깐 쉬기</button></div>`;document.getElementById('continueBtn').onclick=()=>play(si,0)}},650)}else f.textContent='아쉬워요. 한 번 더 생각해볼까요?'});gameBody.querySelector('.hint').onclick=e=>e.target.textContent='💡 '+q[3];game.showModal()};document.querySelector('.close').onclick=()=>game.close();startBtn.onclick=()=>play(0,state.progress[S[0].n]||0);document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.go).scrollIntoView());reset.onclick=()=>{if(confirm('학습 기록을 초기화할까요?')){state={stars:0,done:[],progress:{}};save()}};render();
const CODING_LEVELS=[
 {name:'별빛 숲 1',size:5,start:[4,0],goal:[2,2],walls:[[3,1]],max:5,story:'로보가 별빛 숲에 도착했어! 나무를 피해 반짝이는 별까지 가 보자.'},
 {name:'별빛 숲 2',size:5,start:[4,0],goal:[1,3],walls:[[3,1],[2,1],[2,2]],max:8,story:'길이 조금 복잡해졌어. 막힌 길을 피해 별을 찾아가자!'},
 {name:'구름 성 입구',size:6,start:[5,0],goal:[0,5],walls:[[4,1],[3,1],[3,2],[1,3],[1,4]],max:12,story:'마지막 별은 구름 성 앞에 있어! 명령을 차례대로 조립해 로보를 데려가 줘.'}
];
function playCoding(levelIndex=0){
 const li=Math.max(0,Math.min(levelIndex,CODING_LEVELS.length-1)),L=CODING_LEVELS[li];
 let pos=[...L.start],queue=[],running=false;
 gameBody.innerHTML=`<div class="codingGame">
  <div class="gameHead codingHead"><span class="gameIcon">🤖</span><div><h2>코딩 · ${li+1}단계</h2><p>${L.name}</p></div></div>
  <div class="codingStory"><b>✨ 토토의 별빛 모험</b><span>${L.story}</span></div>
  <div class="codingStage">
   <div class="codingSky"><span class="cloud c1">☁️</span><span class="cloud c2">☁️</span><span class="spark s1">✦</span><span class="spark s2">✦</span></div>
   <div class="codingBoard" style="--n:${L.size}" aria-label="코딩 이동 게임판"></div>
  </div>
  <div class="codingPanel">
   <div class="missionLine"><b>명령을 눌러 길을 만들어 봐!</b><span>최대 ${L.max}개</span></div>
   <div class="commandQueue" aria-live="polite"><span class="emptyQueue">여기에 명령이 쌓여요</span></div>
   <div class="codingControls">
    <button type="button" data-cmd="U">↑<small>위</small></button><button type="button" data-cmd="R">→<small>오른쪽</small></button>
    <button type="button" data-cmd="D">↓<small>아래</small></button><button type="button" data-cmd="L">←<small>왼쪽</small></button>
    <button type="button" class="undoCmd">↶<small>하나 취소</small></button>
   </div>
   <div class="codingActions"><button type="button" class="resetCode">처음부터</button><button type="button" class="runCode">▶ 로보 출발!</button></div>
   <div class="codingFeedback" aria-live="polite">별까지 가는 길을 생각하고 명령을 눌러 봐.</div>
  </div></div>`;
 const board=gameBody.querySelector('.codingBoard'),qbox=gameBody.querySelector('.commandQueue'),fb=gameBody.querySelector('.codingFeedback');
 function key(r,c){return r+'-'+c}
 function draw(){
   board.innerHTML='';
   for(let r=0;r<L.size;r++)for(let c=0;c<L.size;c++){
    const cell=document.createElement('div');cell.className='codeCell';
    if((r+c)%2)cell.classList.add('alt');
    if(L.walls.some(w=>w[0]===r&&w[1]===c)){cell.classList.add('wall');cell.textContent=['🌳','🪨','🌲'][(r+c)%3]}
    if(L.goal[0]===r&&L.goal[1]===c){cell.classList.add('goal');cell.innerHTML='<span class="goalStar">⭐</span>'}
    if(pos[0]===r&&pos[1]===c){cell.classList.add('robotCell');cell.innerHTML='<span class="robot">🤖</span>'}
    board.appendChild(cell);
   }
 }
 function renderQueue(){qbox.innerHTML=queue.length?queue.map((x,i)=>`<span class="cmdChip">${{U:'↑',R:'→',D:'↓',L:'←'}[x]}<i>${i+1}</i></span>`).join(''):'<span class="emptyQueue">여기에 명령이 쌓여요</span>'}
 function reset(keepQueue=false){pos=[...L.start];running=false;if(!keepQueue)queue=[];draw();renderQueue();fb.textContent='별까지 가는 길을 생각하고 명령을 눌러 봐.'}
 gameBody.querySelectorAll('[data-cmd]').forEach(b=>b.addEventListener('click',()=>{if(running)return;if(queue.length>=L.max){fb.textContent='명령은 '+L.max+'개까지 넣을 수 있어! 하나를 취소해 볼까?';return}queue.push(b.dataset.cmd);renderQueue();b.classList.add('pop');setTimeout(()=>b.classList.remove('pop'),180)}));
 gameBody.querySelector('.undoCmd').onclick=()=>{if(!running){queue.pop();renderQueue()}};
 gameBody.querySelector('.resetCode').onclick=()=>reset(false);
 gameBody.querySelector('.runCode').onclick=async()=>{
  if(running||!queue.length){if(!queue.length)fb.textContent='먼저 화살표 명령을 하나 이상 넣어 줘!';return}
  running=true;pos=[...L.start];draw();fb.textContent='로보가 명령을 실행하는 중이야…';
  const delta={U:[-1,0],R:[0,1],D:[1,0],L:[0,-1]};
  for(let i=0;i<queue.length;i++){
   const d=delta[queue[i]],nr=pos[0]+d[0],nc=pos[1]+d[1];
   await new Promise(res=>setTimeout(res,430));
   if(nr<0||nc<0||nr>=L.size||nc>=L.size||L.walls.some(w=>w[0]===nr&&w[1]===nc)){
    board.classList.add('bump');setTimeout(()=>board.classList.remove('bump'),300);fb.textContent='앗! 길이 막혔어. '+(i+1)+'번째 명령부터 다시 생각해 보자.';running=false;return;
   }
   pos=[nr,nc];draw();
   const robot=board.querySelector('.robot');if(robot)robot.classList.add('hop');
   if(pos[0]===L.goal[0]&&pos[1]===L.goal[1]){
    fb.innerHTML='🎉 <b>별을 찾았어! 로보가 정말 움직였어!</b>';
    board.classList.add('win');
    state.progress['코딩']=li<CODING_LEVELS.length-1?li+1:0;state.stars+=1;if(li===CODING_LEVELS.length-1&&!state.done.includes('코딩'))state.done.push('코딩');save();
    setTimeout(()=>{gameBody.querySelector('.codingActions').innerHTML=li<CODING_LEVELS.length-1?'<button class="nextBtn codingNext">다음 모험으로 →</button>':'<button class="nextBtn codingNext">새로운 길 다시 도전 →</button>';gameBody.querySelector('.codingNext').onclick=()=>playCoding(li<CODING_LEVELS.length-1?li+1:0)},550);
    running=false;return;
   }
  }
  fb.textContent='거의 다 왔어! 지금 위치에서 별까지 갈 명령을 더 생각해 보자.';running=false;
 };
 draw();renderQueue();game.showModal();
}


function openGameWorld(){
 gameBody.innerHTML=`<div class="pixelWorld"><div class="pixelTitle"><span>★ ★ ★ ★ ★</span><h2>시안Hi 게임월드</h2><p>원하는 게임을 골라서 출발!</p></div><div class="pixelGames">
 <button class="pixelGame pgMath" data-pg="brick"><b>🧱</b><strong>벽돌깨기</strong><small>별 공으로 벽돌을 모두 깨요!</small></button>
 <button class="pixelGame pgHangul" data-pg="runner"><b>🏃</b><strong>한글 달리기</strong><small>점프해서 글자를 모아요!</small></button>
 <button class="pixelGame pgEnglish" data-pg="memory"><b>🃏</b><strong>영어 카드 뒤집기</strong><small>같은 알파벳 짝을 찾아요!</small></button>
 <button class="pixelGame pgCoding" data-pg="claw"><b>🕹️</b><strong>인형뽑기</strong><small>코인을 넣고 집게로 인형을 뽑아요!</small></button>
 <button class="pixelGame pgShape" data-pg="shape"><b>🧩</b><strong>퍼즐 맞추기</strong><small>공룡·동물·자동차·로봇 그림 퍼즐!</small></button>
 <button class="pixelGame pgTetris" data-pg="tetris"><b>🟦</b><strong>테트리스</strong><small>블록을 움직여 줄을 완성해요!</small></button></div><div class="pixelHint">★ 모든 게임을 바로 플레이할 수 있어요.</div></div>`;
 game.showModal();
 gameBody.querySelector('[data-pg="brick"]').onclick=playBrick;
 gameBody.querySelector('[data-pg="runner"]').onclick=playRunner;
 gameBody.querySelector('[data-pg="memory"]').onclick=playMemory;
 gameBody.querySelector('[data-pg="claw"]').onclick=playClaw;
 gameBody.querySelector('[data-pg="shape"]').onclick=playShape;
 gameBody.querySelector('[data-pg="tetris"]').onclick=playTetris;
}
function gameShell(title,body,controls=''){gameBody.innerHTML=`<div class="arcade"><div class="arcadeTop"><b>${title}</b><button class="backWorld">← 게임월드</button></div>${body}<div class="arcadeControls">${controls}</div></div>`;gameBody.querySelector('.backWorld').onclick=openGameWorld}
function playBrick(){
 gameShell('🧱 벽돌깨기',`<div class="brickScene plainBrick"><div class="brickField"></div><div class="pixelBall">⭐</div><div class="pixelPaddle"></div></div><p class="gameStatus">마우스나 버튼으로 받침대를 움직여 벽돌을 모두 깨요!</p>`,`<button class="moveL">◀</button><button class="moveR">▶</button>`);
 let x=50,y=75,vx=1.05,vy=-1.15,p=50,lives=3,run=true,raf;const scene=gameBody.querySelector('.brickScene'),field=gameBody.querySelector('.brickField'),ball=gameBody.querySelector('.pixelBall'),pad=gameBody.querySelector('.pixelPaddle'),msg=gameBody.querySelector('.gameStatus');
 for(let i=0;i<24;i++){let e=document.createElement('div');e.className='plainBlock';e.style.left=(5+(i%6)*15.5)+'%';e.style.top=(10+Math.floor(i/6)*8)+'%';field.appendChild(e)}
 const draw=()=>{ball.style.left=x+'%';ball.style.top=y+'%';pad.style.left=p+'%'};
 function step(){if(!run)return;x+=vx;y+=vy;if(x<2||x>98)vx*=-1;if(y<3)vy=Math.abs(vy);if(y>82&&y<88&&Math.abs(x-p)<13)vy=-Math.abs(vy);
 for(const e of [...field.children]){let ex=parseFloat(e.style.left),ey=parseFloat(e.style.top);if(Math.abs(x-(ex+6))<8&&Math.abs(y-ey)<5){vy*=-1;e.remove();if(!field.children.length){run=false;msg.textContent='🎉 전부 깼다! 벽돌깨기 성공! ⭐';state.stars++;save()}break}}
 if(y>98){lives--;x=50;y=70;vy=-1.15;if(lives<1){run=false;msg.textContent='다시 도전! 게임월드에서 벽돌깨기를 다시 눌러 봐.'}}draw();raf=requestAnimationFrame(step)}scene.onmousemove=e=>{let r=scene.getBoundingClientRect();p=Math.max(13,Math.min(87,(e.clientX-r.left)/r.width*100));draw()};gameBody.querySelector('.moveL').onclick=()=>{p=Math.max(13,p-12);draw()};gameBody.querySelector('.moveR').onclick=()=>{p=Math.min(87,p+12);draw()};draw();raf=requestAnimationFrame(step)
}
function playMemory(){
 const vals=['A','A','B','B','C','C','D','D','E','E','F','F'].sort(()=>Math.random()-.5);let first=null,lock=false,done=0;
 gameShell('🃏 영어 카드 뒤집기',`<div class="memoryGrid">${vals.map((v,i)=>`<button class="memoryCard" data-v="${v}"><span>?</span></button>`).join('')}</div><p class="gameStatus">같은 알파벳 두 장을 찾아봐!</p>`);
 gameBody.querySelectorAll('.memoryCard').forEach(c=>c.onclick=()=>{if(lock||c.classList.contains('matched')||c===first)return;c.classList.add('open');c.querySelector('span').textContent=c.dataset.v;if(!first){first=c;return}if(first.dataset.v===c.dataset.v){first.classList.add('matched');c.classList.add('matched');first=null;done+=2;if(done===vals.length){gameBody.querySelector('.gameStatus').textContent='🎉 모든 알파벳 짝을 찾았어! ⭐';state.stars++;save()}}else{lock=true;let a=first;first=null;setTimeout(()=>{a.classList.remove('open');c.classList.remove('open');a.querySelector('span').textContent=c.querySelector('span').textContent='?';lock=false},650)}})
}
function playRunner(){
 const rounds=[
  {name:'가나다 길',items:['가','나','다','라','마','바','사','아','자','차','카','타','파','하']},
  {name:'받침 숲',items:['산','달','별','문','집','꽃','눈','밤','공','책']},
  {name:'낱말 마을',items:['가방','나무','다리','라면','마음','바다','사과','아기','자동차','차표']},
  {name:'문장 길',items:['나는','오늘','학교에','가서','친구와','신나게','공부를','했어요']}
 ];
 let round=0,score=0,x=7,jumping=false,finished=false,keyHandler;
 gameShell('🏃 한글 달리기',
 '<div class="runnerHud"><b>STAGE <span id="runStage">1</span>/4</b><b><span id="runName">가나다 길</span></b><b>모은 글자 <span id="runScore">0</span></b></div><div class="runnerScene longRunner"><div class="runnerKid facingRight">🏃‍➡️</div><div class="runnerItems"></div><div class="runnerObstacle" style="left:38%">🪵</div><div class="runnerObstacle" style="left:69%">🪨</div><div class="runnerGround"></div></div><div class="wordTrail"></div><p class="gameStatus">→로 달리고 ↑ 또는 Space로 점프해서 글자를 모아요!</p>',
 '<button data-m="L">◀</button><button data-m="J">⬆ 점프</button><button data-m="R">▶</button>');
 const scene=gameBody.querySelector('.runnerScene'),kid=gameBody.querySelector('.runnerKid'),itemsEl=gameBody.querySelector('.runnerItems'),msg=gameBody.querySelector('.gameStatus'),trail=gameBody.querySelector('.wordTrail');
 function loadRound(){
  finished=false;x=7;score=0;kid.style.left=x+'%';gameBody.querySelector('#runStage').textContent=round+1;gameBody.querySelector('#runName').textContent=rounds[round].name;gameBody.querySelector('#runScore').textContent=0;trail.innerHTML='';
  const arr=rounds[round].items;itemsEl.innerHTML=arr.map((v,i)=>'<span class="hangulCoin" data-i="'+i+'" style="left:'+(14+i*(78/Math.max(1,arr.length-1)))+'%;bottom:'+(i%3===1?92:48)+'px">'+v+'</span>').join('');
  msg.textContent=(round+1)+'단계 '+rounds[round].name+' — 글자를 순서대로 모아봐!';
 }
 function collect(){
  const arr=rounds[round].items;const next=itemsEl.querySelector('.hangulCoin:not(.got)');if(!next)return;
  const cx=parseFloat(next.style.left),high=parseFloat(next.style.bottom)>70;
  if(Math.abs(x-cx)<5 && (!high||jumping)){next.classList.add('got');score++;gameBody.querySelector('#runScore').textContent=score;trail.insertAdjacentHTML('beforeend','<span>'+next.textContent+'</span>');if(score===arr.length)completeRound()}
 }
 function completeRound(){finished=true;if(round<rounds.length-1){msg.textContent='🎉 '+rounds[round].name+' 성공! 다음 길이 열렸어!';setTimeout(()=>{round++;loadRound()},750)}else{msg.textContent='🏆 한글 달리기 완주! 가나다부터 문장까지 모두 모았어! ⭐';state.stars++;save()}}
 function move(d){if(finished)return;x=Math.max(3,Math.min(94,x+d));kid.style.left=x+'%';kid.classList.toggle('faceLeft',d<0);collect()}
 function jump(){if(jumping||finished)return;jumping=true;kid.classList.add('jumping');collect();setTimeout(()=>{collect();kid.classList.remove('jumping');jumping=false},520)}
 gameBody.querySelector('[data-m="L"]').onclick=()=>move(-4);gameBody.querySelector('[data-m="R"]').onclick=()=>move(4);gameBody.querySelector('[data-m="J"]').onclick=jump;
 keyHandler=e=>{if(!game.open)return;if(e.key==='ArrowLeft'){e.preventDefault();move(-3)}if(e.key==='ArrowRight'){e.preventDefault();move(3)}if(e.key==='ArrowUp'||e.key===' '){e.preventDefault();jump()}};
 document.addEventListener('keydown',keyHandler);const back=gameBody.querySelector('.backWorld');if(back)back.addEventListener('click',()=>document.removeEventListener('keydown',keyHandler),{once:true});loadRound()
}
function playShape(){
 const themes=[
  {name:'공룡 월드',icon:'🦖',tiles:['🌋','🌴','🦕','🥚','🦖','🌿','🪨','☀️','🌳']},
  {name:'동물 친구',icon:'🦁',tiles:['🦁','🐼','🐯','🐻','🐰','🐶','🦊','🐵','🐨']},
  {name:'자동차 도시',icon:'🚙',tiles:['🚗','🚕','🚙','🏎️','🚓','🚑','🚒','🚜','🚌']},
  {name:'몬스터 모험',icon:'👾',tiles:['👾','🐲','🔥','⚡','💧','🌿','⭐','🥚','🏆']},
  {name:'로봇 연구소',icon:'🤖',tiles:['🤖','⚙️','🔋','🦾','🛸','📡','💡','🔧','🚀']},
  {name:'우주 탐험',icon:'🚀',tiles:['🚀','🌍','🌙','⭐','🪐','👨‍🚀','☄️','🛸','🌌']}
 ]; let ti=0,moves=0,start=Date.now(),selected=null;
 gameShell('🧩 퍼즐 맞추기','<div class="jigsawGame"><aside class="puzzleThemes"></aside><section><div class="puzzleInfo"><b id="pTitle"></b><span>이동 <strong id="pMoves">0</strong>회</span><span id="pTime">00:00</span></div><div class="jigsawBoard"></div><p class="gameStatus">두 조각을 차례로 눌러 자리를 바꿔 완성해요.</p></section></div>');
 const themesEl=gameBody.querySelector('.puzzleThemes'),board=gameBody.querySelector('.jigsawBoard');
 themesEl.innerHTML=themes.map((t,i)=>'<button data-theme="'+i+'">'+t.icon+' '+t.name+'</button>').join('');
 function load(i){ti=i;moves=0;selected=null;start=Date.now();const t=themes[i];gameBody.querySelector('#pTitle').textContent=t.icon+' '+t.name;gameBody.querySelector('#pMoves').textContent=0;let arr=t.tiles.map((v,n)=>({v,n})).sort(()=>Math.random()-.5);if(arr.every((x,n)=>x.n===n))[arr[0],arr[1]]=[arr[1],arr[0]];board.innerHTML=arr.map(x=>'<button class="jPiece" data-home="'+x.n+'">'+x.v+'</button>').join('');bind()}
 function bind(){board.querySelectorAll('.jPiece').forEach(p=>p.onclick=()=>{if(!selected){selected=p;p.classList.add('picked');return}if(selected===p){p.classList.remove('picked');selected=null;return}const marker=document.createElement('span');selected.before(marker);p.before(selected);marker.replaceWith(p);selected.classList.remove('picked');selected=null;moves++;gameBody.querySelector('#pMoves').textContent=moves;check()})}
 function check(){const ok=[...board.children].every((p,i)=>+p.dataset.home===i);if(ok){gameBody.querySelector('.gameStatus').textContent='🎉 퍼즐 완성! '+moves+'번 만에 성공했어! ⭐';state.stars++;save();board.querySelectorAll('button').forEach(x=>x.disabled=true)}}
 themesEl.querySelectorAll('button').forEach(b=>b.onclick=()=>load(+b.dataset.theme));load(0);
 const clock=setInterval(()=>{if(!game.open){clearInterval(clock);return}let n=Math.floor((Date.now()-start)/1000);let e=gameBody.querySelector('#pTime');if(e)e.textContent=String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')},1000)
}
function playClaw(){
 let coins=10,x=50,prizes=0,busy=false,downHandler,round=0;
 const icons=['🧸','🦖','🤖','🐼','🚗','🦁','🐰','🐯','🐶','🦊','🐨','🐵','🐙','🦈','🚀','🚒','🏎️','⚽','🐲','🐧','🦕','🐻','🐸','🛸'];
 const toys=Array.from({length:34},(_,i)=>({icon:icons[i%icons.length],x:5+Math.random()*90,y:3+Math.random()*82,rot:-25+Math.random()*50,size:34+Math.random()*18,won:false}));
 gameShell('🕹️ 인형뽑기',
 '<div class="clawHud"><b>🪙 코인 <span id="clawCoins">10</span></b><b>🎁 뽑은 인형 <span id="clawWins">0</span></b><b>🎯 집게 위치 <span id="clawPos">50</span></b></div><div class="clawMachine realClaw"><div class="clawRail"><div class="clawHead"><span class="clawCar">▰</span><div class="clawArm"><i></i><span class="clawGrip">⌄</span></div></div></div><div class="toyBin"></div><div class="clawGlass"></div><div class="clawSlot">🪙 1 COIN</div></div><p class="gameStatus">← → 로 위치를 아주 잘 맞춘 뒤 Space! 집게 힘이 매번 달라서 쉽게 안 뽑혀요.</p>',
 '<button data-claw="L">◀</button><button data-claw="R">▶</button><button data-claw="GO">🪙 넣고 뽑기 (Space)</button>');
 const head=gameBody.querySelector('.clawHead'),arm=gameBody.querySelector('.clawArm'),grip=gameBody.querySelector('.clawGrip'),bin=gameBody.querySelector('.toyBin'),msg=gameBody.querySelector('.gameStatus');
 toys.forEach((t,i)=>{let e=document.createElement('span');e.className='clawToy';e.dataset.i=i;e.textContent=t.icon;e.style.left=t.x+'%';e.style.bottom=t.y+'px';e.style.fontSize=t.size+'px';e.style.transform='translateX(-50%) rotate('+t.rot+'deg)';e.style.zIndex=1+Math.floor(t.y/10);bin.appendChild(e)});
 function draw(){head.style.left=x+'%';gameBody.querySelector('#clawPos').textContent=Math.round(x)}
 function move(d){if(!busy){x=Math.max(5,Math.min(95,x+d));draw()}}
 function go(){
  if(busy)return;if(coins<=0){msg.textContent='코인이 없어! 다시 시작하면 코인이 충전돼.';return}
  coins--;round++;gameBody.querySelector('#clawCoins').textContent=coins;busy=true;grip.classList.remove('closed');arm.classList.add('down');msg.textContent='집게가 내려가는 중...';
  setTimeout(()=>{
   const candidates=toys.map((t,i)=>({t,i,dist:Math.abs(t.x-x)})).filter(o=>!o.t.won&&o.dist<10).sort((a,b)=>a.dist-b.dist);
   const target=candidates[0];let success=false;
   if(target){
    const center=Math.max(0,1-target.dist/10);
    const crowd=candidates.length;
    const gripPower=.28+Math.random()*.42;
    const buried=Math.min(.35,target.t.y/220)+(crowd>2?.12:0);
    const chance=Math.max(.08,Math.min(.68,center*.62+gripPower*.35-buried));
    success=Math.random()<chance;
    const el=bin.querySelector('[data-i="'+target.i+'"]');
    grip.classList.add('closed');
    if(success){
     msg.textContent='잡았다! 떨어뜨리지 않게 버텨라...';el.classList.add('caught');
     setTimeout(()=>{
      const holdChance=.58+Math.min(.2,center*.2);
      if(Math.random()<holdChance){target.t.won=true;el.classList.add('won');el.classList.remove('caught');prizes++;gameBody.querySelector('#clawWins').textContent=prizes;msg.textContent='🎉 '+target.t.icon+' 뽑기 성공! ⭐';state.stars++;save()}
      else{el.classList.remove('caught');el.classList.add('dropped');target.t.x=Math.max(6,Math.min(94,target.t.x+(Math.random()-.5)*12));target.t.y=Math.max(2,target.t.y-8);el.style.left=target.t.x+'%';el.style.bottom=target.t.y+'px';setTimeout(()=>el.classList.remove('dropped'),450);msg.textContent='앗! 올라오다가 떨어졌어. 위치를 다시 맞춰봐!'}
     },700)
    }else msg.textContent=target.dist<4?'집게가 인형을 눌렀지만 힘이 부족했어!':'살짝 빗나갔어. 인형 중심을 더 정확히 맞춰봐!';
   }else msg.textContent='허공을 잡았어! 인형 위에 집게 중심을 맞춰야 해.';
   setTimeout(()=>{arm.classList.remove('down');grip.classList.remove('closed');setTimeout(()=>busy=false,650)},success?1450:650)
  },950)
 }
 gameBody.querySelector('[data-claw="L"]').onclick=()=>move(-3);gameBody.querySelector('[data-claw="R"]').onclick=()=>move(3);gameBody.querySelector('[data-claw="GO"]').onclick=go;
 downHandler=e=>{if(!game.open)return;if(e.key==='ArrowLeft'){e.preventDefault();move(-2)}if(e.key==='ArrowRight'){e.preventDefault();move(2)}if(e.key===' '){e.preventDefault();go()}};
 document.addEventListener('keydown',downHandler);const back=gameBody.querySelector('.backWorld');if(back)back.addEventListener('click',()=>document.removeEventListener('keydown',downHandler),{once:true});draw()
}
function playTetris(){
 const W=10,H=16,board=Array.from({length:H},()=>Array(W).fill(0)),pieces=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0],[1,0],[1,1]],[[0,1],[0,1],[1,1]]];let piece,x,y,timer,score=0,over=false;
 gameShell('🟦 테트리스',`<div class="tetrisWrap"><div class="tetrisBoard"></div><div class="tetrisSide"><b>점수</b><strong id="tScore">0</strong><p>블록을 움직여<br>가로줄을 채워요!</p></div></div><p class="gameStatus">시작!</p>`,`<button data-t="L">◀</button><button data-t="R">▶</button><button data-t="D">▼</button><button data-t="X">↻ 회전</button>`);
 const el=gameBody.querySelector('.tetrisBoard'),msg=gameBody.querySelector('.gameStatus');function spawn(){piece=pieces[Math.floor(Math.random()*pieces.length)].map(r=>[...r]);x=3;y=0;if(hit(0,0,piece)){over=true;clearInterval(timer);msg.textContent='게임 종료! 점수 '+score+'점'}}
 function hit(dx,dy,p=piece){return p.some((r,yy)=>r.some((v,xx)=>v&&(y+yy+dy>=H||x+xx+dx<0||x+xx+dx>=W||board[y+yy+dy]?.[x+xx+dx])))}
 function renderT(){let temp=board.map(r=>[...r]);piece?.forEach((r,yy)=>r.forEach((v,xx)=>{if(v&&temp[y+yy])temp[y+yy][x+xx]=2}));el.innerHTML=temp.flat().map(v=>`<i class="${v?'on':''} ${v===2?'fall':''}"></i>`).join('')}
 function lock(){piece.forEach((r,yy)=>r.forEach((v,xx)=>{if(v)board[y+yy][x+xx]=1}));for(let r=H-1;r>=0;r--)if(board[r].every(Boolean)){board.splice(r,1);board.unshift(Array(W).fill(0));score+=100;document.getElementById('tScore').textContent=score;r++}spawn();renderT()}
 function drop(){if(over)return;if(!hit(0,1)){y++}else lock();renderT()}function rotate(){let p=piece[0].map((_,i)=>piece.map(r=>r[i]).reverse());if(!hit(0,0,p))piece=p;renderT()}
 gameBody.querySelector('[data-t="L"]').onclick=()=>{if(!hit(-1,0))x--;renderT()};gameBody.querySelector('[data-t="R"]').onclick=()=>{if(!hit(1,0))x++;renderT()};gameBody.querySelector('[data-t="D"]').onclick=drop;gameBody.querySelector('[data-t="X"]').onclick=rotate;spawn();renderT();timer=setInterval(drop,600)
}


/* ===== 100-stage curriculum engine: Nuri bridge -> Grade 3 ===== */
const CURRICULUM100 = {
 '연산':[
  ['수 감각 모험','10·20까지 수, 수의 순서와 크기, 10 만들기'],['덧셈 마을','한 자리 수 덧셈, 합이 20 이하'],['뺄셈 동굴','한 자리 수 뺄셈, 받아내림 전 기초'],['100 숫자성','두 자리 수, 자릿값, 100까지 수'],['계산 다리','두 자리 수 덧셈·뺄셈'],['곱셈 숲','묶어 세기와 곱셈구구'],['나눗셈 항구','똑같이 나누기와 나눗셈'],['큰 수 사막','세 자리 수와 받아올림·내림'],['곱셈 공장','두·세 자리 수 × 한 자리 수'],['분수 별나라','분수 기초와 생활 속 계산']
 ],
 '수학':[
  ['수와 양','수 세기·대응·비교'],['측정 놀이터','길이·높이·무게·들이 비교'],['시계 마을','시각과 시간'],['돈 가게','동전·화폐와 생활 계산'],['표와 분류','기준 세우기와 자료 정리'],['규칙 왕국','반복·증가 규칙'],['문제해결 숲','그림·식으로 나타내기'],['곱셈 관계','배·묶음·배열'],['분수 지도','전체와 부분'],['자료 탐정단','표·그래프 읽기']
 ],
 '팩토':[
  ['같은 것 찾기','분류·짝짓기·공통점'],['규칙 기차','반복 규칙과 다음 항'],['도형 공방','평면도형 구성·분해'],['공간 미로','위치·방향·회전'],['조건 탐정','조건 1~2개로 추리'],['측정 연구소','길이·넓이·들이 비교'],['대칭 성','선대칭과 모양 완성'],['논리 다리','순서·관계·경우 찾기'],['전개도 행성','입체 감각·쌓기나무'],['캥거루 챌린지','복합 규칙·논리 문제해결']
 ],
 '한글':[
  ['소리 숲','자음·모음 소리와 글자 대응'],['가나다 마을','기본 음절과 첫소리'],['받침 동굴','기초 받침 낱말'],['낱말 정원','낱말 뜻·범주·반대말'],['문장 기차','문장 순서와 조사 기초'],['이야기 숲','짧은 글 읽고 내용 찾기'],['맞춤법 마을','띄어쓰기·기초 맞춤법'],['독해 탐정단','중심 내용·원인과 결과'],['표현 극장','문장 바꾸기·이어 쓰기'],['책 속 왕국','초3 수준 짧은 글 독해·어휘']
 ],
 '영어':[
  ['ABC 섬','대·소문자와 알파벳 소리'],['파닉스 숲','기초 자음 소리'],['모음 호수','short vowel CVC'],['단어 마을','생활 기초 어휘'],['문장 기차','I am / This is / I like'],['소리 동굴','blends·digraphs 기초'],['읽기 정원','짧은 문장 읽기'],['질문 탐정','who·what·where 기초'],['이야기 극장','짧은 영어 이야기 순서'],['리딩 스타','초3 기초 문장·짧은 지문 이해']
 ],
 '과학':[
  ['관찰 숲','오감으로 관찰하고 분류'],['생명 정원','동물·식물과 성장'],['물질 주방','고체·액체와 재료 성질'],['날씨 마을','계절·날씨·생활'],['힘 놀이터','밀기·당기기·자석'],['빛과 소리 성','빛·그림자·소리'],['지구 탐험대','땅·물·하늘 관찰'],['생태 섬','생물과 환경의 관계'],['물질 연구소','상태·혼합·분리 기초'],['과학 탐정단','예상→실험→관찰→결론']
 ],
 '코딩':[
  ['명령 숲','방향과 한 단계 명령'],['순서 다리','명령 순서와 실행'],['반복 동굴','같은 움직임 반복'],['조건 마을','만약~라면 선택'],['디버그 연구소','틀린 순서 고치기'],['좌표 섬','격자·위치와 경로'],['패턴 공장','반복 패턴 압축'],['알고리즘 성','여러 방법 비교'],['미션 로봇','장애물·아이템 복합 경로'],['코딩 챌린지','반복·조건·최단경로 종합']
 ],
 '한자':[
  ['그림 한자','日月山川木火水'],['사람과 몸','人大口目耳手足'],['숫자 한자','一二三四五六七八九十'],['자연 마을','天地雨石田林'],['방향 성','上下左右中大小'],['생활 한자','門車学校年'],['뜻 연결','부수 그림과 뜻 연결'],['한자 낱말','생활 속 한자어 기초'],['반대 짝','大小·上下·左右 등'],['한자 탐정단','초등 기초 한자 뜻·음 종합']
 ]
};
function build100(subject){
 const zones=CURRICULUM100[subject]||CURRICULUM100['수학'];
 return Array.from({length:100},(_,i)=>{
   const z=Math.floor(i/10),k=i%10,info=zones[z];
   return {stage:i+1,zone:z+1,title:info[0],skill:info[1],mode:['탐색','찾기','움직이기','짝맞추기','선택','퍼즐','응용','이야기','도전','보스'][k],
    story:['토토가 새로운 지도를 발견했어.','별빛 문을 열 열쇠를 찾아보자.','친구가 길을 잃었어. 배운 힘으로 도와줘!','숨은 규칙을 찾으면 다리가 나타나.','알맞은 답을 골라 보물상자를 열자.','조각을 맞춰 다음 길을 만들자.','배운 방법을 다른 상황에도 써 보자.','이야기 속 단서를 찾아 해결하자.','힌트 없이 스스로 도전해 보자.','별지기 보스의 마지막 미션을 해결하자!'][k]};
 });
}
const LEARNING_SUBJECTS=['연산','수학','팩토','한글','영어','과학','코딩','한자'];
state.stage100=state.stage100||{};
LEARNING_SUBJECTS.forEach(n=>{if(!state.stage100[n])state.stage100[n]=1});
function stageQuestion(subject,stage){
 const n=stage;
 if(subject==='연산'){let a=(n*3)%80+10,b=(n*2)%9+1;return n<31?{q:(a%10)+' + '+b+' = ?',ans:String((a%10)+b),opts:[(a%10)+b,(a%10)+b+1,Math.max(0,(a%10)+b-1),(a%10)+b+2]}:n<61?{q:a+' - '+b+' = ?',ans:String(a-b),opts:[a-b,a-b+1,a-b-1,a+b]}:{q:(n%9+2)+' × '+(n%8+2)+' = ?',ans:String((n%9+2)*(n%8+2)),opts:[(n%9+2)*(n%8+2),(n%9+2)*(n%8+2)+2,(n%9+2)*(n%8+1),(n%9+1)*(n%8+2)]}}
 if(subject==='수학')return {q:['더 긴 것을 고르기','시계가 3시라면 짧은 바늘은?','100원짜리 3개는 얼마?','규칙 2,4,6 다음 수는?'][n%4],ans:['━━━━','3','300원','8'][n%4],opts:[['━━','━━━━','━','━━━'],['3','6','9','12'],['200원','300원','400원','500원'],['7','8','9','10']][n%4]};
 if(subject==='팩토')return {q:['🔴🔵🔴🔵 다음은?','▲ ▲ ● ▲ 에서 다른 것은?','□를 오른쪽으로 한 칸 옮기면 어느 방향?','1,2,4,8 다음 수는?'][n%4],ans:['🔴','●','→','16'][n%4],opts:[['🔴','🔵','🟢','🟡'],['▲','●','■','★'],['←','→','↑','↓'],['10','12','16','18']][n%4]};
 if(subject==='한글')return {q:['「가」로 시작하는 말은?','받침이 있는 낱말은?','자연스러운 문장은?','「기쁘다」와 뜻이 반대인 말은?'][n%4],ans:['가방','산','나는 학교에 가요.','슬프다'][n%4],opts:[['가방','나무','다리','모자'],['나','산','오이','우유'],['학교 나는 가요.','나는 학교에 가요.','가요 학교 나는.','나는 가요를 학교.'],['즐겁다','슬프다','빠르다','크다']][n%4]};
 if(subject==='영어')return {q:['A로 시작하는 단어는?','cat의 첫 소리는?','I ___ happy.','Where is the cat? 뜻은?'][n%4],ans:['Apple','c','am','고양이는 어디에 있나요?'][n%4],opts:[['Apple','Sun','Dog','Moon'],['c','m','s','t'],['is','am','are','be'],['고양이는 누구인가요?','고양이는 어디에 있나요?','고양이는 무엇을 먹나요?','고양이는 몇 살인가요?']][n%4]};
 if(subject==='과학')return {q:['살아 있는 것은?','자석에 붙는 것은?','그림자가 생기려면 필요한 것은?','식물이 자라려면 필요한 것은?'][n%4],ans:['나무','쇠못','빛과 물체','물과 빛'][n%4],opts:[['돌','나무','자동차','연필'],['종이','쇠못','나무','고무'],['바람','빛과 물체','냄새','소리'],['물과 빛','장난감','소리','플라스틱']][n%4]};
 if(subject==='한자')return {q:['산을 뜻하는 한자는?','물을 뜻하는 한자는?','큰 대(大)는?','위 상(上)은?'][n%4],ans:['山','水','大','上'][n%4],opts:[['山','水','木','日'],['火','水','月','人'],['小','中','大','下'],['下','上','左','右']][n%4]};
 return {q:'별까지 가장 알맞은 방향은?',ans:'→',opts:['→','←','↑','↓']};
}
function openStageMap(subject){
 const stages=build100(subject),cur=state.stage100[subject]||1,zone=Math.floor((cur-1)/10);
 gameBody.innerHTML='<div class="stageMap"><div class="stageMapHead"><button class="mapClose">← 학습 월드</button><div><small>'+subject+' · 100단계 모험</small><h2>'+stages[cur-1].title+'</h2><p>'+stages[cur-1].skill+'</p></div><b>'+cur+' / 100</b></div><div class="zoneTabs">'+Array.from({length:10},(_,z)=>'<button class="'+(z===zone?'on':'')+'" data-zone="'+z+'">'+(z*10+1)+'–'+(z*10+10)+'</button>').join('')+'</div><div class="stageStory">📖 '+stages[cur-1].story+'</div><div class="stageNodes"></div></div>';
 const nodes=gameBody.querySelector('.stageNodes');
 function drawZone(z){nodes.innerHTML=stages.slice(z*10,z*10+10).map(s=>'<button class="stageNode '+(s.stage<cur?'clear':s.stage===cur?'current':'locked')+'" data-stage="'+s.stage+'" '+(s.stage>cur?'disabled':'')+'><i>'+(s.stage<cur?'★':s.stage)+'</i><b>'+s.mode+'</b><small>'+s.title+'</small></button>').join('');nodes.querySelectorAll('.stageNode:not(.locked)').forEach(b=>b.onclick=()=>playStage100(subject,+b.dataset.stage))}
 gameBody.querySelectorAll('[data-zone]').forEach(b=>b.onclick=()=>{gameBody.querySelectorAll('[data-zone]').forEach(x=>x.classList.remove('on'));b.classList.add('on');drawZone(+b.dataset.zone)});
 gameBody.querySelector('.mapClose').onclick=()=>game.close();drawZone(zone);game.showModal();
}
function playStage100(subject,stage){
 if(subject==='코딩'){playCoding100(stage);return}
 const info=build100(subject)[stage-1],q=stageQuestion(subject,stage);
 gameBody.innerHTML='<div class="storyStage"><div class="stageTop"><button class="backMap">← 지도</button><b>'+subject+' '+stage+'/100</b></div><div class="storyPanel"><small>CHAPTER '+info.zone+' · '+info.mode+'</small><h2>'+info.title+'</h2><p>'+info.story+'</p></div><div class="questCard"><h3>'+q.q+'</h3><div class="choices">'+q.opts.map(x=>'<button class="choice">'+x+'</button>').join('')+'</div><div class="feedback">토토와 함께 생각해 봐!</div></div></div>';
 gameBody.querySelector('.backMap').onclick=()=>openStageMap(subject);
 gameBody.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{let f=gameBody.querySelector('.feedback');if(b.textContent===q.ans){f.innerHTML='⭐ 성공! 이야기의 다음 길이 열렸어!';gameBody.querySelectorAll('.choice').forEach(x=>x.disabled=true);state.stage100[subject]=Math.max(state.stage100[subject]||1,Math.min(100,stage+1));state.stars++;save();setTimeout(()=>{if(stage<100)playStage100(subject,stage+1);else openStageMap(subject)},650)}else{b.classList.add('wrongBrick');f.textContent='아직 아니야. 다른 단서를 찾아보자!';setTimeout(()=>b.classList.remove('wrongBrick'),300)}});game.showModal();
}
function playCoding100(stage){
 const size=stage<31?5:stage<71?6:7,start=[size-1,0],goal=[0,size-1],walls=[];
 for(let i=1;i<size-1;i++)if((i+stage)%3===0)walls.push([size-1-i,Math.min(size-2,i)]);
 const L={size,start,goal,walls,max:Math.min(16,6+Math.floor(stage/10)),name:'별길 '+stage,story:build100('코딩')[stage-1].story};
 let pos=[...start],queue=[],running=false;
 gameBody.innerHTML='<div class="codingGame"><div class="stageTop"><button class="backMap">← 지도</button><b>코딩 '+stage+'/100</b></div><div class="codingStory"><b>🤖 '+L.name+'</b><span>'+L.story+'</span></div><div class="codingStage"><div class="codingBoard" style="--n:'+size+'"></div></div><div class="codingPanel"><div class="commandQueue"><span class="emptyQueue">명령을 차례대로 넣어 줘</span></div><div class="codingControls"><button data-cmd="U">↑<small>위</small></button><button data-cmd="R">→<small>오른쪽</small></button><button data-cmd="D">↓<small>아래</small></button><button data-cmd="L">←<small>왼쪽</small></button><button class="undoCmd">↶<small>취소</small></button></div><div class="codingActions"><button class="resetCode">다시</button><button class="runCode">▶ 출발!</button></div><div class="codingFeedback">별까지 가는 길을 만들어 봐.</div></div></div>';
 const board=gameBody.querySelector('.codingBoard'),qb=gameBody.querySelector('.commandQueue'),fb=gameBody.querySelector('.codingFeedback');
 function draw(){board.innerHTML='';for(let r=0;r<size;r++)for(let c=0;c<size;c++){let e=document.createElement('div');e.className='codeCell';if(walls.some(w=>w[0]===r&&w[1]===c)){e.classList.add('wall');e.textContent='🌳'}if(goal[0]===r&&goal[1]===c)e.innerHTML='<span class="goalStar">⭐</span>';if(pos[0]===r&&pos[1]===c)e.innerHTML='<span class="robot">🤖</span>';board.appendChild(e)}}
 function rq(){qb.innerHTML=queue.length?queue.map(x=>'<span class="cmdChip">'+({U:'↑',R:'→',D:'↓',L:'←'}[x])+'</span>').join(''):'<span class="emptyQueue">명령을 차례대로 넣어 줘</span>'}
 gameBody.querySelector('.backMap').onclick=()=>openStageMap('코딩');gameBody.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>{if(!running&&queue.length<L.max){queue.push(b.dataset.cmd);rq()}});gameBody.querySelector('.undoCmd').onclick=()=>{queue.pop();rq()};gameBody.querySelector('.resetCode').onclick=()=>{queue=[];pos=[...start];rq();draw()};
 gameBody.querySelector('.runCode').onclick=async()=>{if(!queue.length||running)return;running=true;pos=[...start];draw();const d={U:[-1,0],R:[0,1],D:[1,0],L:[0,-1]};for(const cmd of queue){await new Promise(r=>setTimeout(r,220));let nr=pos[0]+d[cmd][0],nc=pos[1]+d[cmd][1];if(nr<0||nc<0||nr>=size||nc>=size||walls.some(w=>w[0]===nr&&w[1]===nc)){fb.textContent='🌳 길이 막혔어. 명령을 고쳐 보자!';running=false;return}pos=[nr,nc];draw();if(nr===goal[0]&&nc===goal[1]){fb.textContent='⭐ 성공! 다음 별길이 열렸어!';state.stage100['코딩']=Math.max(state.stage100['코딩']||1,Math.min(100,stage+1));state.stars++;save();running=false;setTimeout(()=>stage<100?playCoding100(stage+1):openStageMap('코딩'),600);return}}fb.textContent='조금 더 가야 해. 명령을 추가해 봐!';running=false};draw();rq();game.showModal();
}
/* replace subject-card learning click with 100-stage maps; add Math card */
const oldRender100=render;
render=function(){
 oldRender100();
 const fact=[...document.querySelectorAll('.subject[data-subject]')].find(b=>b.querySelector('h3')?.textContent==='팩토');
 if(fact&&!document.querySelector('.mathSubject'))fact.insertAdjacentHTML('beforebegin','<button class="subject mathSubject" style="background:#4aa6cf"><span class="ico">123</span><h3>수학</h3><p>측정·시간·자료·문제해결</p><em>→</em></button>');
 document.querySelector('.mathSubject')?.addEventListener('click',()=>openStageMap('수학'));
 document.querySelectorAll('.subject[data-subject]').forEach(b=>{const n=b.querySelector('h3')?.textContent;if(LEARNING_SUBJECTS.includes(n))b.onclick=()=>openStageMap(n)});
 const gw=document.querySelector('.gameWorldCard p');if(gw)gw.textContent='게임으로 신나게 놀며 배우기';
};
render();

/* keyboard-capable upgraded Tetris */
playTetris=function(){
 const W=10,H=18,board=Array.from({length:H},()=>Array(W).fill(0));
 const pieces=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]]];
 let piece,nextPiece=null,holdPiece=null,x,y,timer,score=0,lines=0,combo=0,level=1,over=false,canHold=true,downHandler;
 gameShell('🎮 게임월드  ›  테트리스',
 '<div class="tetrisHud"><div class="tStats"><div>🏆<small>점수</small><strong id="tScore">0</strong></div><div>⭐<small>레벨</small><strong id="tLevel">1</strong></div><div>🚩<small>라인</small><strong id="tLines">0</strong></div><div class="comboBox">🔥<small>콤보</small><strong id="tCombo">-</strong></div></div><div class="tetrisMain"><div class="tetrisBoard"></div><div class="tetrisSide"><b>다음 블록</b><div id="nextPreview" class="piecePreview"></div><b>보관 블록</b><div id="holdPreview" class="piecePreview"></div><button data-t="H">교체 (C)</button><p>← → 이동<br>↑ 회전<br>↓ 빠르게<br>Space 즉시 내리기<br>C 블록 교체</p></div></div></div><p class="gameStatus">여러 줄을 연속으로 지우면 콤보 점수가 올라가요!</p>',
 '<button data-t="L">◀</button><button data-t="R">▶</button><button data-t="D">▼</button><button data-t="X">↻</button><button data-t="H">교체</button><button data-t="DROP">⤓</button>');
 const el=gameBody.querySelector('.tetrisBoard'),msg=gameBody.querySelector('.gameStatus');
 function clone(p){return p.map(r=>[...r])}
 function randomPiece(){return clone(pieces[Math.floor(Math.random()*pieces.length)])}
 function preview(id,p){const e=gameBody.querySelector(id);if(!e)return;e.innerHTML=p?p.flatMap(r=>r.map(v=>'<i class="'+(v?'on':'')+'"></i>')).join(''):'';e.style.setProperty('--cols',p?p[0].length:4)}
 function spawn(p=null){piece=p?clone(p):(nextPiece||randomPiece());nextPiece=randomPiece();x=Math.floor((W-piece[0].length)/2);y=0;canHold=true;preview('#nextPreview',nextPiece);preview('#holdPreview',holdPiece);if(hit(0,0,piece)){over=true;clearInterval(timer);msg.textContent='게임 종료! 점수 '+score+'점'}}
 function hit(dx,dy,p=piece){return p.some((r,yy)=>r.some((v,xx)=>v&&(y+yy+dy>=H||x+xx+dx<0||x+xx+dx>=W||board[y+yy+dy]?.[x+xx+dx])))}
 function renderT(){let t=board.map(r=>[...r]);piece?.forEach((r,yy)=>r.forEach((v,xx)=>{if(v&&t[y+yy])t[y+yy][x+xx]=2}));el.innerHTML=t.flat().map(v=>'<i class="'+(v?'on ':'')+(v===2?'fall':'')+'"></i>').join('')}
 function updateHud(){gameBody.querySelector('#tScore').textContent=score;gameBody.querySelector('#tLines').textContent=lines;gameBody.querySelector('#tLevel').textContent=level;gameBody.querySelector('#tCombo').textContent=combo>1?combo+' COMBO!':'-'}
 function lock(){piece.forEach((r,yy)=>r.forEach((v,xx)=>{if(v&&board[y+yy])board[y+yy][x+xx]=1}));let cleared=0;for(let r=H-1;r>=0;r--)if(board[r].every(Boolean)){board.splice(r,1);board.unshift(Array(W).fill(0));cleared++;r++}if(cleared){lines+=cleared;combo++;level=1+Math.floor(lines/10);score+=cleared*100*level+(combo>1?(combo-1)*50:0);msg.textContent=combo>1?'🔥 '+combo+' COMBO! 연속으로 지웠어!':'⭐ 라인 클리어!';}else combo=0;updateHud();spawn();renderT()}
 function drop(){if(over)return;if(!hit(0,1))y++;else lock();renderT()}
 function rot(){let p=piece[0].map((_,i)=>piece.map(r=>r[i]).reverse());if(!hit(0,0,p))piece=p;renderT()}
 function hold(){if(over||!canHold)return;const old=clone(piece);if(holdPiece){piece=clone(holdPiece);holdPiece=old;x=Math.floor((W-piece[0].length)/2);y=0}else{holdPiece=old;piece=nextPiece;nextPiece=randomPiece();x=Math.floor((W-piece[0].length)/2);y=0}canHold=false;preview('#nextPreview',nextPiece);preview('#holdPreview',holdPiece);renderT()}
 function action(a){if(over)return;if(a==='L'&&!hit(-1,0))x--;if(a==='R'&&!hit(1,0))x++;if(a==='D')drop();if(a==='X')rot();if(a==='H')hold();if(a==='DROP'){while(!hit(0,1))y++;lock()}renderT()}
 gameBody.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>action(b.dataset.t));
 downHandler=e=>{if(!game.open)return;const m={ArrowLeft:'L',ArrowRight:'R',ArrowDown:'D',ArrowUp:'X',' ':'DROP',c:'H',C:'H'}[e.key];if(m){e.preventDefault();action(m)}};document.addEventListener('keydown',downHandler);
 const back=gameBody.querySelector('.backWorld');if(back)back.addEventListener('click',()=>{clearInterval(timer);document.removeEventListener('keydown',downHandler)},{once:true});
 spawn();updateHud();renderT();timer=setInterval(drop,650);
};
