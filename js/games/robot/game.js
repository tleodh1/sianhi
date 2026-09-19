(function (R) {
  const palette=['#3bdcff','#6754ff','#ffca3a','#ff5f87','#56df83','#ffffff'];
  R.escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  R.start=function (loaded) {
    Session.begin();
    let build=R.normalize(loaded?.parts?loaded:R.store.active()||R.defaultBuild());
    let selected='head',yaw=0,zoom=1;
    gameBody.innerHTML=`<div class="robotApp"><header class="robotHeader"><h2>🤖 로봇 메이커</h2><button data-back>← 게임월드</button></header><main class="robotMaker"><section class="robotStage"><canvas aria-label="3D 로봇 미리보기"></canvas><div class="robotZoom"><button data-turn>90° 회전</button><button data-zoom="-1" aria-label="축소">−</button><button data-zoom="1" aria-label="확대">＋</button></div><p class="robotAngle" role="status"></p></section><section class="robotWorkshop"><label class="robotName">이름 <input maxlength="14"></label><div class="robotSlots">${R.slots.map(s=>`<button data-slot="${s}">${R.labels[s]}</button>`).join('')}</div><div class="robotOptions"></div><div class="robotPaint"></div><div class="robotStats"></div><button class="robotSave">격납고에 저장</button><button data-new>새 로봇 만들기</button><div class="robotBattleChoice"><select aria-label="AI 난이도"><option value="easy">EASY</option><option value="normal" selected>NORMAL</option><option value="hard">HARD</option></select><button class="robotBattleStart">저장하고 배틀 시작</button></div><div class="robotHangar"></div><p class="robotMessage" role="status"></p></section></main></div>`;
    const root=gameBody,canvas=root.querySelector('canvas');
    root.querySelector('[data-back]').onclick=openGameWorld;
    let view;
    try{view=R.createView(canvas);}catch(error){root.querySelector('.robotStage').innerHTML='<p style="padding:28px;color:white">3D 화면을 열지 못했어요. 다른 브라우저에서 다시 시도해 주세요.</p>';root.querySelector('.robotWorkshop').hidden=true;return;}
    const draw=()=>{view.show(build,yaw,zoom);root.querySelector('.robotAngle').textContent=`회전 ${Math.round(((yaw*180/Math.PI)%360+360)%360)}° · 드래그해서 돌려요`;};
    function refresh(){
      root.querySelectorAll('[data-slot]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.slot===selected));
      root.querySelector('.robotOptions').innerHTML=R.parts[selected].map(p=>`<button data-part="${p.id}" aria-pressed="${build.parts[selected]===p.id}">${p.name}</button>`).join('');
      root.querySelector('.robotPaint').innerHTML=['primary','secondary','accent'].map(ch=>`<label><b>${R.labels[selected]} · ${{primary:'기본',secondary:'보조',accent:'빛'}[ch]}</b><span>${palette.map((color,i)=>`<button data-channel="${ch}" data-color="${color}" style="--swatch:${color}" aria-label="${R.labels[selected]} ${ch} ${['하늘','보라','노랑','분홍','초록','하양'][i]}" aria-pressed="${build.colors[selected][ch]===color}"></button>`).join('')}</span></label>`).join('');
      root.querySelector('.robotStats').textContent=Object.entries(R.stats(build)).map(([k,v])=>`${k.toUpperCase()} ${v}`).join(' · ');
      root.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>{build.parts[selected]=b.dataset.part;refresh();});
      root.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{build.colors[selected][b.dataset.channel]=b.dataset.color;refresh();});draw();
    }
    function hangar(){root.querySelector('.robotHangar').innerHTML=R.store.data().robots.map(b=>`<button data-load="${R.escape(b.id)}">${R.escape(b.name)} · ${b.record?.wins||0}승</button>`).join('');root.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>R.start(R.store.data().robots.find(x=>x.id===b.dataset.load)));}
    root.querySelector('input').value=build.name;
    root.querySelector('input').oninput=e=>build.name=e.target.value;
    root.querySelector('[data-back]').onclick=openGameWorld;
    root.querySelector('[data-new]').onclick=()=>R.start(R.defaultBuild());
    root.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{selected=b.dataset.slot;refresh();});
    root.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>{zoom=Math.max(.7,Math.min(1.6,zoom+Number(b.dataset.zoom)*.1));draw();});
    root.querySelector('[data-turn]').onclick=()=>{yaw+=Math.PI/2;draw();};
    root.querySelector('.robotSave').onclick=()=>{build=R.store.saveRobot(build);hangar();root.querySelector('.robotMessage').textContent='격납고에 저장했어요!';};
    root.querySelector('.robotBattleStart').onclick=()=>{const difficulty=root.querySelector('select').value;build=R.store.saveRobot(build);R.startBattle(root,build,difficulty);};
    let pointer=null,lastX=0;
    canvas.onpointerdown=e=>{if(pointer!==null)return;pointer=e.pointerId;lastX=e.clientX;canvas.setPointerCapture(e.pointerId);};
    canvas.onpointermove=e=>{if(e.pointerId!==pointer)return;yaw+=(e.clientX-lastX)*.012;lastX=e.clientX;draw();};
    const clear=()=>{pointer=null;};canvas.onpointerup=canvas.onpointercancel=canvas.onlostpointercapture=clear;
    canvas.onwheel=e=>{e.preventDefault();zoom=Math.max(.7,Math.min(1.6,zoom-e.deltaY*.001));draw();};
    window.addEventListener('blur',clear);
    Session.cleanups.push(()=>{window.removeEventListener('blur',clear);canvas.onpointerdown=canvas.onpointermove=canvas.onpointerup=canvas.onpointercancel=canvas.onlostpointercapture=canvas.onwheel=null;view.dispose();});
    refresh();hangar();
  };
})(window.SianRobot);
