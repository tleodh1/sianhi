/* Adapter: only this game touches its record. Shared site/menu code is unchanged. */
(function(HR){
  let active=null,artPromise=null;
  HR.start=async function(){
    if(active)active();
    Session.begin();game.classList.add('hangul-runner-dialog');
    gameBody.innerHTML='<section class="hr-shell"><div class="hr-loading"><b>시안이의 한글 모험</b><p>구름 너머, 새로운 모험을 준비하고 있어요…</p></div></section>';
    if(!game.open)game.showModal();
    const root=gameBody.querySelector('.hr-shell');let alive=true,frame=0,controls=null,observer=null,audio=null,engine=null,renderer=null,last=0,accumulator=0,paused=false,reported=false;
    const stop=()=>{if(!alive)return;alive=false;cancelAnimationFrame(frame);controls?.destroy();observer?.disconnect();audio?.close().catch(()=>{});game.classList.remove('hangul-runner-dialog');root.dataset.activeLoops='0';root.dataset.inputListeners='0';if(active===stop)active=null;};
    active=stop;Session.cleanups.push(stop);
    let art;
    try{art=await(artPromise||(artPromise=HR.loadArt()));}catch(error){artPromise=null;if(alive){root.querySelector('.hr-loading p').textContent=error.message;const retry=document.createElement('button');retry.textContent='다시 불러오기';retry.onclick=HR.start;root.querySelector('.hr-loading').append(retry);}return;}
    if(!alive)return;
    root.innerHTML=`<div class="hr-top"><div><small>SIANHi · LETTER ADVENTURE</small><h2>한글 달리기</h2></div><div class="hr-top-actions"><button data-action="sound" aria-label="게임 소리 켜기">소리</button><button data-action="pause">잠깐 멈춤</button><button data-action="back">게임 월드</button></div></div>
      <div class="hr-hud"><b class="hr-stage-name"></b><span class="hr-health"></span><span class="hr-treasure"></span><span class="hr-clock"></span></div>
      <div class="hr-viewport"><canvas tabindex="0" aria-label="한글 달리기 게임 화면. 방향키로 이동하고 위 방향키 또는 스페이스로 점프하세요."></canvas><div class="hr-overlay"></div><div class="hr-toast" role="status"></div></div>
      <div class="hr-letters" aria-label="모은 글자"></div>
      <div class="hr-bottom"><div class="hr-touch"><button data-control="left" aria-label="왼쪽으로 이동">←</button><button data-control="right" aria-label="오른쪽으로 이동">→</button><button data-control="jump" aria-label="점프">↑ <span>점프</span></button></div><p class="hr-help">← → 이동 · ↑ / Space 점프<br>글자를 모두 모아 별빛 문으로!</p><button data-action="return" hidden>못 찾은 글자 찾으러 가기</button></div>`;
    const $=s=>root.querySelector(s),overlay=$('.hr-overlay'),toast=$('.hr-toast'),canvas=$('canvas');let toastUntil=0,lastHud='',sound=!!state.sound;
    renderer=new HR.Renderer(canvas,art);
    function soundLabel(){const b=$('[data-action="sound"]');b.textContent=sound?'♪ 소리 켜짐':'♪ 소리 꺼짐';b.setAttribute('aria-label',sound?'게임 소리 끄기':'게임 소리 켜기');}soundLabel();
    function gesture(){if(sound&&!audio){const Audio=window.AudioContext||window.webkitAudioContext;if(Audio)audio=new Audio();}if(audio?.state==='suspended')audio.resume().catch(()=>{});}
    function chime(kind){if(!sound||!audio||audio.state!=='running')return;const o=audio.createOscillator(),v=audio.createGain();o.type='sine';o.frequency.setValueAtTime(kind==='hurt'?170:kind==='letter'?784:523,audio.currentTime);o.frequency.exponentialRampToValueAtTime(kind==='hurt'?85:1046,audio.currentTime+.12);v.gain.setValueAtTime(.055,audio.currentTime);v.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.22);o.connect(v);v.connect(audio.destination);o.start();o.stop(audio.currentTime+.23);o.onended=()=>{o.disconnect();v.disconnect();};}
    function message(text){toast.textContent=text;toastUntil=performance.now()+2600;toast.classList.add('visible');}
    function start(id){controls?.reset();engine=new HR.Engine(HR.buildStage(id),{viewport:renderer.width,onEvent:event});paused=false;reported=false;last=0;accumulator=0;lastHud='';overlay.hidden=true;overlay.innerHTML='';$('[data-action="return"]').hidden=true;$('[data-action="pause"]').textContent='잠깐 멈춤';$('.hr-stage-name').textContent=`${id} · ${engine.stage.name}`;$('.hr-letters').innerHTML=engine.stage.words.map((word,i)=>`<span data-letter="${i}" aria-label="${word} 아직 못 찾음">□</span>`).join('');message(engine.stage.story);canvas.focus();updateHud();}
    function menu(){$('.hr-stage-name').textContent='시안이의 별빛 숲';paused=true;controls?.reset();const progress=HR.readProgress(state);overlay.hidden=false;overlay.innerHTML=`<div class="hr-panel"><small>작은 발견, 커다란 모험</small><h3>글자들이 별빛 숲에<br>숨어 있어!</h3><p>달리고, 점프하고, 글자를 모아<br>저 멀리 별빛 문을 열어 보자.</p><div class="hr-stage-list">${HR.stages.map(s=>`<button data-stage="${s.id}" ${s.id>progress.unlocked?'disabled':''}>${s.id} · ${s.name}${s.id>progress.unlocked?' · 잠김':''}</button>`).join('')}</div><p class="hr-instructions">방향키로 이동 · ↑ / Space 점프<br>휴대폰에서는 아래 큰 버튼을 꾹 눌러요.</p></div>`;overlay.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>{gesture();start(Number(b.dataset.stage));});}
    function pause(force){if(!engine||engine.status==='clear'||(!overlay.hidden&&paused&&overlay.querySelector('[data-stage]')))return;if(force===true&&paused)return;paused=!paused;controls?.reset();last=0;accumulator=0;$('[data-action="pause"]').textContent=paused?'계속하기':'잠깐 멈춤';if(paused){overlay.hidden=false;overlay.innerHTML='<div class="hr-panel"><small>TAKE A LITTLE BREAK</small><h3>잠깐 쉬어 가도 괜찮아.</h3><p>다시 준비되면 모험을 이어 가자!</p><button data-resume>계속하기</button><button data-menu>스테이지 선택</button></div>';overlay.querySelector('[data-resume]').onclick=()=>{paused=false;overlay.hidden=true;$('[data-action="pause"]').textContent='잠깐 멈춤';canvas.focus();};overlay.querySelector('[data-menu]').onclick=menu;}else overlay.hidden=true;}
    function event(e){chime(e.type);if(e.type==='letter'){const i=e.item.index,el=$(`[data-letter="${i}"]`);el.textContent=e.item.text;el.classList.add('collected');el.setAttribute('aria-label',e.item.text+' 모음');el.scrollIntoView({block:'nearest',inline:'nearest'});message(e.item.text+'! 잘 찾았어!');if(sound)say(e.item.text);}
      if(e.type==='power')message('별열매의 힘! 몸이 커지고 한 번 보호받아요.');
      if(e.type==='shrink')message('보호막이 시안이를 지켜 줬어! 다시 작아졌어요.');
      if(e.type==='hurt')message('앗! 잠깐 반짝일 때는 안전해요. 다시 도전!');
      if(e.type==='checkpoint')message('쉼터에 도착! 여기서 다시 시작할 수 있어요.');
      if(e.type==='death')message('괜찮아! 가장 가까운 쉼터에서 다시 시작해요.');
      if(e.type==='missing'){message('아직 찾지 못한 글자가 있어요!');$('[data-action="return"]').hidden=false;}
      if(e.type==='clear'&&!reported){reported=true;const result=e.result,earned=HR.recordClear(state,result);save();controls.reset();overlay.hidden=false;overlay.innerHTML=`<div class="hr-panel hr-clear"><small>STAGE CLEAR</small><h3>시안아, 해냈어!</h3><div class="hr-rating">${'★'.repeat(result.rating)}${'☆'.repeat(3-result.rating)}</div><p class="hr-result-letters">${result.letters.join(' · ')}</p><dl><div><dt>모험 별</dt><dd>${result.stars}</dd></div><div><dt>코인</dt><dd>${result.coins}</dd></div><div><dt>걸린 시간</dt><dd>${result.seconds}초</dd></div><div><dt>남은 HP</dt><dd>${result.hp} / 3</dd></div></dl><p>보관함에 별 ${earned}개 추가${earned===0?' · 이미 받은 최고 기록 보상이에요':''}</p>${result.stageId<HR.stages.length?'<button data-next>다음 스테이지 →</button>':'<p>일곱 번의 모험을 모두 완주했어!</p>'}<button data-again>한 번 더 도전</button><button data-menu>스테이지 선택</button></div>`;overlay.querySelector('[data-next]')?.addEventListener('click',()=>start(result.stageId+1));overlay.querySelector('[data-again]').onclick=()=>start(result.stageId);overlay.querySelector('[data-menu]').onclick=menu;}
    }
    function updateHud(){if(!engine)return;const p=engine.player,key=[p.hp,p.powerState,engine.letterCount,engine.coins,engine.stars,Math.floor(engine.elapsed),Math.floor(p.x/10)].join('|');if(lastHud===key)return;lastHud=key;$('.hr-health').textContent=`HP ${p.hp}/3 · ${p.powerState==='big'?'큰 시안':'작은 시안'}`;$('.hr-treasure').textContent=`별 ${engine.stars} · 코인 ${engine.coins}`;$('.hr-clock').textContent=Math.floor(engine.elapsed/60)+':'+String(Math.floor(engine.elapsed%60)).padStart(2,'0');canvas.setAttribute('aria-description',`위치 ${Math.floor(p.x/10)}m, ${p.pose}, HP ${p.hp}, 글자 ${engine.letterCount}/${engine.stage.words.length}, 쉼터 ${engine.checkpoint.id}`);root.dataset.activeLoops='1';root.dataset.inputListeners=String(controls.listeners.length);root.dataset.camera=String(Math.round(engine.cameraX));}
    controls=new HR.Controls(root,pause,gesture);
    $('[data-action="pause"]').onclick=()=>pause();$('[data-action="back"]').onclick=openGameWorld;
    $('[data-action="sound"]').onclick=()=>{sound=!sound;state.sound=sound;gesture();soundLabel();save();};
    $('[data-action="return"]').onclick=()=>{engine.returnToMissing();$('[data-action="return"]').hidden=true;message('못 찾은 글자 앞의 쉼터로 돌아왔어요.');};
    observer=new ResizeObserver(entries=>{renderer.resize(entries[0].contentRect.width);if(engine)engine.viewport=renderer.width;});observer.observe($('.hr-viewport'));renderer.resize($('.hr-viewport').clientWidth);
    engine=new HR.Engine(HR.buildStage(1),{viewport:renderer.width});menu();
    function loop(t){if(!alive)return;frame=0;if(!last)last=t;const dt=Math.min(.08,(t-last)/1000);last=t;if(!paused&&engine.status!=='clear'){accumulator+=dt;while(accumulator>=1/120){engine.step(1/120,controls.read());accumulator-=1/120;}}else accumulator=0;renderer.paint(engine);updateHud();if(t>toastUntil)toast.classList.remove('visible');frame=requestAnimationFrame(loop);}
    frame=requestAnimationFrame(loop);
  };
})(HangulRunner);
