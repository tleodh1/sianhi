(function(A){
  const esc=(s)=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const sprite=(m,extra="")=>`<span class="friendSprite ${extra}" style="--mx:${m.index%5};--my:${Math.floor(m.index/5)}" aria-hidden="true"></span>`;
  function shuffled(a){for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function sides(m,kind){
    if(kind==="case")return [{label:m.letter,type:"letter"},{label:m.letter.toLowerCase(),type:"letter"}];
    if(kind==="word")return [{label:m.letter,type:"letter"},{label:m.word,type:"word"}];
    if(kind==="phonics")return [{label:m.letter,type:"letter"},{label:`/${m.letter.toLowerCase()}/`,type:"sound"}];
    if(kind==="cvc"){const word=["cat","dog","sun","pig","hat","fox"][m.index%6];return [{label:word,type:"word"},{label:word,type:"monster"}];}
    return [{label:m.word,type:"word"},{label:m.name,type:"monster"}];
  }
  function showCollection(){
    const r=A.getRecord();
    gameBody.querySelector(".memoryApp").innerHTML=`<div class="memoryHead"><button data-back>← 게임</button><b>시안Hi 친구 도감</b><span>${Object.keys(r.friends).length} / ${A.catalog.length}</span></div><div class="friendBook">${A.catalog.map(m=>{const got=r.friends[m.id];return `<article class="friendEntry ${got?"":"locked"}">${sprite(m)}<strong>${got?esc(m.name):"???"}</strong><span>${got?`${m.letter} · ${esc(m.word)}`:"아직 만나지 못했어요"}</span><small>${got?`STAGE ${got.stage} · ${m.rarity}`:"✦ 실루엣 친구"}</small></article>`}).join("")}</div>`;
    gameBody.querySelector("[data-back]").onclick=()=>start();
  }
  function start(){
    const r=A.getRecord();
    gameShell("🃏 영어 카드 뒤집기",`<div class="memoryApp"><div class="memoryLobby"><div><small>SIANHi MONSTER ENGLISH</small><h3>친구를 만나러 갈까요?</h3><p>카드를 맞히면 새로운 몬스터가 도감에 찾아와요.</p></div><button data-book>친구 도감 ${Object.keys(r.friends).length}/${A.catalog.length}</button></div><div class="memoryLevels">${A.levels.map(l=>`<button data-level="${l.id}"><b>LEVEL ${l.id}</b><strong>${l.label}</strong><span>${l.help}</span></button>`).join("")}</div></div>`);
    gameBody.querySelector("[data-book]").onclick=showCollection;
    gameBody.querySelectorAll("[data-level]").forEach(b=>b.onclick=()=>play(Number(b.dataset.level)));
  }
  function play(levelId){
    const level=A.levels.find(x=>x.id===levelId)||A.levels[0];
    const offset=((levelId-1)*4)%A.catalog.length;
    const monsters=Array.from({length:6},(_,i)=>A.catalog[(offset+i)%A.catalog.length]);
    const cards=shuffled(monsters.flatMap(m=>sides(m,level.kind).map((side,n)=>({m,side,n,key:m.id}))));
    let first=null,lock=false,matched=0,moves=0,startAt=Date.now();
    gameShell("🃏 영어 카드 뒤집기",`<div class="memoryApp"><div class="memoryStageBar"><button data-lobby>LEVEL ${levelId}</button><strong>${level.label}</strong><button data-book>도감</button></div><p class="memoryGuide">${level.help}</p><div class="monsterMemoryGrid">${cards.map((c,i)=>`<button class="monsterCard" data-i="${i}" data-key="${c.key}" aria-label="뒤집히지 않은 카드"><span class="cardInner"><span class="cardBack"><i>✦</i></span><span class="cardFront">${c.side.type==="monster"?sprite(c.m):sprite(c.m,"mini")}<b>${esc(c.side.label)}</b><small>${esc(c.m.name)}</small></span></span></button>`).join("")}</div><p class="gameStatus">짝을 맞혀 새로운 친구를 발견해요!</p><div class="friendReveal" hidden></div></div>`);
    const root=gameBody.querySelector(".memoryApp"),status=root.querySelector(".gameStatus"),reveal=root.querySelector(".friendReveal");
    root.querySelector("[data-lobby]").onclick=start; root.querySelector("[data-book]").onclick=showCollection;
    const open=(card)=>{card.classList.add("open");card.setAttribute("aria-label",card.querySelector(".cardFront b").textContent);};
    const close=(card)=>{card.classList.remove("open");card.setAttribute("aria-label","뒤집히지 않은 카드");};
    function newFriend(m){
      lock=true; reveal.hidden=false; reveal.innerHTML=`<div><small>NEW FRIEND!</small>${sprite(m,"large")}<h3>${esc(m.name)}</h3><b>${m.letter} · ${esc(m.word)}</b><p>${esc(m.korean)}에서 만난 ${m.rarity} 친구예요.</p><button>도감에 등록</button></div>`;
      reveal.querySelector("button").onclick=()=>{A.discover(m,levelId);reveal.hidden=true;lock=false;status.textContent=`${m.name} 친구가 도감에 등록됐어요!`;};
    }
    root.querySelectorAll(".monsterCard").forEach(card=>card.onclick=()=>{
      if(lock||card.classList.contains("matched")||card===first)return;
      open(card); say(card.querySelector(".cardFront b").textContent,"en-US");
      if(!first){first=card;return;}
      moves++;
      if(first.dataset.key===card.dataset.key){const a=first;first=null;a.classList.add("matched","friendPop");card.classList.add("matched","friendPop");matched+=2;window.SianAudio?.effect("match");status.textContent="반짝! 영어 친구를 찾았어요 ✦";const m=cards[Number(card.dataset.i)].m;if(A.isNew(m.id))newFriend(m);if(matched===cards.length){window.SianAudio?.stopMusic();window.SianAudio?.effect("clear");A.finish(levelId,moves,Math.round((Date.now()-startAt)/1000));status.textContent=`STAGE CLEAR · ${moves}번 만에 모두 찾았어요!`;}}
      else{lock=true;const a=first;first=null;Session.timeout(()=>{close(a);close(card);lock=false;},720);}
    });
  }
  A.start=start;
})(SianMemory);
