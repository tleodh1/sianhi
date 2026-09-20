(function(R){
  R.startBattle=function(root,build,difficulty='normal'){
    Session.begin();build=R.normalize(build);const engine=new R.BattleEngine(build,difficulty);
    root.innerHTML=`<div class="robotBattle"><header class="robotBattleHead"><b>${R.escape(build.name)} · 3D 아레나</b><button data-exit>← 메이커</button></header><div class="battleHud"><span>나 <i data-php></i></span><strong data-state></strong><span>AI <i data-ehp></i></span></div><p class="battleEnergy" role="status"></p><canvas aria-label="3D 실시간 로봇 배틀"></canvas><div class="battleMobile"><div class="battleStick" data-stick aria-label="이동 조이스틱"><i></i></div><div class="battleActions">${[['attack','공격 J'],['skill','스킬 K'],['jump','점프'],['guard','방어 L'],['dash','대시']].map(([a,t])=>`<button data-act="${a}">${t}</button>`).join('')}</div></div><p class="battleKeys">WASD 이동 · Space 점프 · J 공격 · K 스킬 · L 가드 · Shift 대시</p><div class="battleResult" hidden></div></div>`;
    const canvas=root.querySelector('canvas');let view,audio;const heard={};
    root.querySelector('[data-exit]').onclick=()=>R.start(build);
    try{view=R.createArenaView(canvas,engine);}catch(e){root.querySelector('.battleEnergy').textContent='3D 화면을 열 수 없어요. 메이커로 돌아가 다시 시도해 주세요.';return;}
    window.SianAudio?.start('robot');
    const sound=kind=>window.SianAudio?.effect(({hit:'enemyStarHit',skillCharge:'starPower',launch:'starShot',attack:'bossAttack',guard:'blockHit'})[kind]||'blockHit');
    const disposeControls=R.bindBattleControls(root,engine);let last=performance.now(),ended=false;
    Session.cleanups.push(()=>{ended=true;disposeControls();view.dispose();audio?.close();});
    function loop(now){if(ended)return;const dt=(now-last)/1000;last=now;if(!document.hidden)engine.tick(dt);for(const kind of ['attack','skillCharge','launch','hit','guardHit','guard'])if((engine.events[kind]||0)>(heard[kind]||0)){heard[kind]=engine.events[kind];sound(kind==='guardHit'?'hit':kind);}view.render();
      root.querySelector('[data-php]').style.setProperty('--hp',`${engine.player.hp/engine.player.stats.hp*100}%`);
      root.querySelector('[data-ehp]').style.setProperty('--hp',`${engine.enemy.hp/engine.enemy.stats.hp*100}%`);
      root.querySelector('[data-state]').textContent=engine.player.attackState?.skill?`CHARGE · ${engine.player.attackState.skillType}`:engine.player.guard?'ENERGY SHIELD':difficulty.toUpperCase();
      root.querySelector('.battleEnergy').textContent=`HP ${Math.ceil(engine.player.hp)} · 에너지 ${Math.floor(engine.player.energy)} · 공격 대기 ${engine.player.cooldown.toFixed(1)}초`;
      if(engine.over){window.SianAudio?.stopMusic();window.SianAudio?.effect(engine.result==='win'?'worldClear':'fail');const win=engine.result==='win',reward=R.recordBattle(build,difficulty,win),result=root.querySelector('.battleResult');result.hidden=false;result.innerHTML=`<h2>${win?'아레나 승리!':'멋진 도전이었어요!'}</h2><p>${reward?`별 ${reward}개를 얻었어요!`:'배틀 기록을 저장했어요.'}</p><button data-again>다시 배틀</button><button data-maker>메이커로</button>`;disposeControls();result.querySelector('[data-again]').onclick=()=>R.startBattle(root,build,difficulty);result.querySelector('[data-maker]').onclick=()=>R.start(build);return;}
      Session.frame(loop);
    }Session.frame(loop);
  };
})(window.SianRobot);
