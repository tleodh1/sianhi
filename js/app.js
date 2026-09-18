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
 gameBody.innerHTML=`<div class="pixelWorld">
   <div class="pixelTitle"><span>★ ★ ★ ★ ★</span><h2>시안Hi 게임월드</h2><p>원하는 게임을 골라서 출발!</p></div>
   <div class="pixelGames">
    <button class="pixelGame pgMath" data-pg="brick"><b>🧱</b><strong>연산 벽돌깨기</strong><small>정답 벽돌을 깨뜨려요!</small></button>
    <button class="pixelGame pgHangul"><b>🏃</b><strong>한글 달리기</strong><small>글자를 먹으며 달려요!</small></button>
    <button class="pixelGame pgEnglish"><b>🃏</b><strong>영어 카드 뒤집기</strong><small>알파벳 짝을 찾아요!</small></button>
    <button class="pixelGame pgCoding" data-pg="maze"><b>🤖</b><strong>코딩 미로</strong><small>명령으로 별까지!</small></button>
    <button class="pixelGame pgShape"><b>🧩</b><strong>도형 퍼즐</strong><small>조각을 딱 맞춰요!</small></button>
    <button class="pixelGame pgTetris"><b>🟦</b><strong>블록 쌓기</strong><small>줄을 완성해요!</small></button>
   </div>
   <div class="pixelHint">★ 지금은 연산 벽돌깨기와 코딩 미로를 바로 플레이할 수 있어요.</div>
 </div>`;
 game.showModal();
 gameBody.querySelector('[data-pg="brick"]').onclick=playBrickMath;
 gameBody.querySelector('[data-pg="maze"]').onclick=()=>playCoding(state.progress['코딩']||0);
 gameBody.querySelectorAll('.pixelGame:not([data-pg])').forEach(b=>b.onclick=()=>{b.classList.add('lockedShake');setTimeout(()=>b.classList.remove('lockedShake'),350);gameBody.querySelector('.pixelHint').textContent='🚧 이 게임은 다음 업데이트에서 열려요!'});
}
function playBrickMath(){
 let score=0,lives=5,target=10,ballX=50,ballY=76,vx=1.25,vy=-1.35,paddle=50,raf,last=0,running=true;
 const nums=[4,6,3,7,5,5,8,2,9,1,6,4];
 gameBody.innerHTML=`<div class="brickGame">
  <div class="brickHud"><span>⭐ <b id="bScore">0</b></span><strong>10을 만드는 짝을 깨자!</strong><span>❤️ <b id="bLives">5</b></span></div>
  <div class="brickScene" tabindex="0"><div class="brickQuestion">🎯 <b id="needNum">6</b> + ? = 10</div><div class="brickField"></div><div class="pixelBall">⭐</div><div class="pixelPaddle"></div></div>
  <div class="brickControls"><button class="moveL">◀ 왼쪽</button><button class="brickStart">▶ 시작</button><button class="moveR">오른쪽 ▶</button></div>
  <p class="brickMsg">정답 숫자가 적힌 벽돌을 별로 맞혀 봐!</p><button class="backWorld">← 게임월드</button></div>`;
 const scene=gameBody.querySelector('.brickScene'),field=gameBody.querySelector('.brickField'),ball=gameBody.querySelector('.pixelBall'),pad=gameBody.querySelector('.pixelPaddle'),msg=gameBody.querySelector('.brickMsg');
 nums.forEach((n,i)=>{const e=document.createElement('div');e.className='mathBrick';e.textContent=n;e.dataset.n=n;e.style.left=(7+(i%4)*23)+'%';e.style.top=(14+Math.floor(i/4)*9)+'%';field.appendChild(e)});
 let a=4;function newQ(){a=1+Math.floor(Math.random()*9);document.getElementById('needNum').textContent=a;target=10-a}
 function draw(){ball.style.left=ballX+'%';ball.style.top=ballY+'%';pad.style.left=paddle+'%'}
 function step(t){if(!running)return;if(t-last<16){raf=requestAnimationFrame(step);return}last=t;ballX+=vx;ballY+=vy;if(ballX<2||ballX>96)vx*=-1;if(ballY<8)vy=Math.abs(vy);
  if(ballY>82&&ballY<88&&Math.abs(ballX-paddle)<12){vy=-Math.abs(vy);vx+=(ballX-paddle)*.015}
  const br=[...field.querySelectorAll('.mathBrick')];for(const e of br){const x=parseFloat(e.style.left),y=parseFloat(e.style.top);if(Math.abs(ballX-(x+8))<9&&Math.abs(ballY-y)<5){vy*=-1;const n=+e.dataset.n;if(n===target){score++;document.getElementById('bScore').textContent=score;e.classList.add('brickBoom');setTimeout(()=>{e.remove();if(!field.children.length)openGameWorld()},180);msg.textContent='정답! '+a+' + '+n+' = 10 ⭐';newQ()}else{lives--;document.getElementById('bLives').textContent=lives;msg.textContent='앗! '+n+' 말고 '+target+'을 찾아보자.';e.classList.add('wrongBrick');setTimeout(()=>e.classList.remove('wrongBrick'),300);if(lives<=0){running=false;msg.textContent='게임 종료! 점수 '+score+'점 — 다시 도전해 봐!';document.querySelector('.brickStart').textContent='↻ 다시하기'}}break}}
  if(ballY>96){lives--;document.getElementById('bLives').textContent=lives;ballX=50;ballY=76;vy=-1.35;if(lives<=0){running=false;msg.textContent='게임 종료! 점수 '+score+'점';document.querySelector('.brickStart').textContent='↻ 다시하기'}}
  draw();raf=requestAnimationFrame(step)}
 function move(d){paddle=Math.max(12,Math.min(88,paddle+d));draw()}
 gameBody.querySelector('.moveL').onpointerdown=()=>move(-10);gameBody.querySelector('.moveR').onpointerdown=()=>move(10);
 scene.onmousemove=e=>{const r=scene.getBoundingClientRect();paddle=Math.max(12,Math.min(88,(e.clientX-r.left)/r.width*100));draw()};
 gameBody.querySelector('.brickStart').onclick=()=>{if(!running){playBrickMath();return}cancelAnimationFrame(raf);raf=requestAnimationFrame(step)};
 gameBody.querySelector('.backWorld').onclick=()=>{running=false;cancelAnimationFrame(raf);openGameWorld()};
 newQ();draw();raf=requestAnimationFrame(step);
}
