/* English spelling is a learning object, never a hidden answer-only caption. */
(function(global){
 const S=global.LearningSpace,A=global.DiscoveryArt,V=global.LearningSpeech,M=global.DiscoveryModel;
 const en=text=>({text,lang:'en-US'}),ko=text=>({text,lang:'ko-KR'});
 function render({q,root,area,audio}){
  let solved=false,picked=null,exploring=q.mode==='explore';
  const feedback=root.querySelector('.spaceFeedback');
  const spelling=w=>`<strong class="englishSpelling">${S.esc(w.toUpperCase())}</strong>`;
  const caption=w=>spelling(w)+`<span class="wordPronunciation">${V.icon}</span><small class="wordMeaning">${S.esc(A.labels[w]||'')}</small>`;
  function pronounce(w,b){V.speak([en(w)],{button:b,status:audio});b?.classList.remove('wordBounce');if(b){void b.offsetWidth;b.classList.add('wordBounce');}}
  function celebrate(word=q.word){if(solved)return;solved=true;const panel=document.createElement('div');panel.className='englishCompletion';panel.innerHTML=A.draw(q.word)+spelling(word);area.append(panel);S.burst(panel);V.speak([en(word),ko(A.labels[q.word]||'잘했어!'),...(global.VoiceDirector?[VoiceDirector.respond('success',q.stage)]:[])],{button:panel,status:audio});Session.timeout(()=>S.complete(root,'영어',q.stage,q.explanation),1400);}
  function retry(word,b){b?.classList.add('spaceShake');Session.timeout(()=>b?.classList.remove('spaceShake'),350);feedback.textContent='이 친구는 '+word.toUpperCase()+'. 다시 찾아볼까?';V.speak([en(word),ko('다시 찾아볼까?'),...q.parts.filter(p=>p.lang==='en-US')],{button:b,status:audio});}
  function hero(word){return `<button class="englishHero" aria-label="${word.toUpperCase()} 발음 듣기">${A.draw(word)}${caption(word)}</button>`;}
  function bindHero(){area.querySelector('.englishHero')?.addEventListener('click',e=>pronounce(q.word,e.currentTarget));}
  const optionText=id=>q.mode==='phrase'?id+' '+q.word+(q.phraseKind===3&&id!=='one'?'s':''):q.mode==='sentenceMeaning'?'The '+q.animal+' is '+id+(q.stage%2===0?' the box.':'.'):id;
  function optionArt(id){if(q.mode==='phrase'){if(q.phraseKind===0||q.phraseKind===2)return A.draw(q.word,{color:id});if(q.phraseKind===1)return '<span class="sizeExample '+id+'">'+A.draw(q.word)+'</span>';return '<span class="wordCount">'+Array.from({length:{one:1,two:2,three:3}[id]},()=>A.draw(q.word)).join('')+'</span>';}
   if(q.mode==='sentenceMeaning')return ['on','under','in'].includes(id)?A.position(q.animal,'box',id):'<span class="animalAction '+id+'">'+A.draw(q.animal)+'</span>';return A.draw(id);}
  if(['explore','listenWord','pictureWord','phrase','sentenceMeaning'].includes(q.mode)){
   area.innerHTML=(q.mode==='pictureWord'?hero(q.word):'')+'<div class="englishPhase">'+(exploring?'친구들을 만나볼까? 그림을 눌러 봐.':'그림을 눌러 들어 보고, 선택한 친구를 확인해 줘.')+'</div><div class="pictureChoices englishChoices">'+q.options.map(id=>`<button class="pictureChoice englishCard" data-word="${id}" aria-label="${optionText(id).toUpperCase()} 발음 듣고 선택" aria-pressed="false">${optionArt(id)}${caption(optionText(id))}</button>`).join('')+'</div><button class="spaceCheck englishConfirm" '+(exploring?'':'disabled')+'>'+(exploring?'이제 찾아볼까? →':'이 친구예요 ✓')+'</button>';
   bindHero();const check=area.querySelector('.englishConfirm');area.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{if(solved)return;pronounce(optionText(b.dataset.word),b);if(!exploring){picked=b.dataset.word;area.querySelectorAll('[data-word]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));check.disabled=false;}});
   check.onclick=()=>{if(solved)return;if(exploring){exploring=false;area.querySelector('.englishPhase').textContent='이제 찾아볼까? 그림을 누른 다음 확인해 줘.';check.textContent='이 친구예요 ✓';check.disabled=true;V.speak(q.parts,{status:audio});return;}if(picked===q.correct)celebrate(optionText(picked));else retry(optionText(picked),area.querySelector('[aria-pressed="true"]'));};
  }else if(['initialLetter','missingLetter','buildWord'].includes(q.mode)){
   const letters=[...q.word.toUpperCase()];area.innerHTML=hero(q.word)+'<div class="letterReference" aria-label="알파벳 이름 듣기">'+letters.map(l=>`<button data-letter="${l}" aria-label="알파벳 ${l} 이름 듣기">${l}</button>`).join('')+'</div><p class="alphabetHint">위 글자: 알파벳 이름 · 그림: 단어 발음</p><div class="spellingSlots">'+letters.map((l,i)=>`<button data-slot="${i}" data-target="${i}" aria-label="${i+1}번째 글자 자리">${q.mode==='buildWord'||i===q.letterIndex?'_':l}</button>`).join('')+'</div>';
   bindHero();area.querySelectorAll('[data-letter]').forEach(b=>b.onclick=()=>V.speak([en(M.letterNames[b.dataset.letter])],{button:b,status:audio}));
   if(q.mode!=='buildWord'){
    const tray=document.createElement('div');tray.className='letterTray';tray.innerHTML=q.options.map(l=>`<button data-choice="${l}" aria-label="${l} 알파벳 선택">${l}</button>`).join('');area.append(tray);tray.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(solved)return;const l=b.dataset.choice;if(l===q.correct){area.querySelector('[data-slot="'+q.letterIndex+'"]').textContent=l;celebrate();}else retry(M.letterNames[l],b);});
   }else{
    const tray=document.createElement('div');tray.className='letterTray';tray.innerHTML=q.tiles.map(t=>`<button class="alphabetTile" data-tile="${t.id}" aria-label="${t.letter} 글자 블록">${t.letter}</button>`).join('');area.append(tray);let next=0,active=null;
    const place=(b,slot)=>{if(solved||b.disabled)return;const tile=q.tiles.find(t=>t.id===b.dataset.tile);if(slot!==next||tile.letter!==letters[next]){retry(M.letterNames[tile.letter],b);return;}area.querySelector('[data-slot="'+next+'"]').textContent=tile.letter;b.disabled=true;next++;if(next===letters.length)celebrate();else V.speak([en(M.letterNames[tile.letter])],{status:audio});};
    tray.onpointerdown=e=>{const b=e.target.closest('[data-tile]');if(!b||b.disabled||active||e.button>0)return;e.preventDefault();active={id:e.pointerId,b,x:e.clientX,y:e.clientY};b.setPointerCapture(e.pointerId);b.classList.add('lifted');};
    tray.onpointermove=e=>{if(active?.id!==e.pointerId)return;active.b.style.transform=`translate(${e.clientX-active.x}px,${e.clientY-active.y-8}px)`;};
    const release=()=>{if(active){active.b.style.removeProperty('transform');active.b.classList.remove('lifted');}active=null;};
    tray.onpointerup=e=>{if(active?.id!==e.pointerId)return;const {b,x,y}=active;const tap=Math.hypot(e.clientX-x,e.clientY-y)<8;const slot=[...area.querySelectorAll('[data-slot]')].find(el=>{const r=el.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;});release();if(tap||slot)place(b,tap?next:+slot.dataset.slot);};tray.onpointercancel=release;
    tray.onclick=e=>{if(e.detail===0){const b=e.target.closest('[data-tile]');if(b)place(b,next);}};
    Session.cleanup(()=>{release();tray.onpointerdown=tray.onpointermove=tray.onpointerup=tray.onpointercancel=tray.onclick=null;});
   }
  }else if(['sameWord','pictureMatch'].includes(q.mode)){
   area.innerHTML='<div class="discoveryTargets englishMatches">'+q.targets.map(t=>`<button class="missionTarget discoveryTarget" data-target="${t.id}" aria-label="${t.id.toUpperCase()} 자리">${A.draw(t.id)}${caption(t.id)}<span class="targetContents"></span></button>`).join('')+'</div><div class="pieceTray">'+q.items.map(w=>`<button class="missionPiece discoveryPiece englishMatchPiece" data-piece="${w}" aria-label="${w.toUpperCase()} 단어 옮기기">${q.mode==='pictureMatch'?A.draw(w):''}${spelling(w)}${V.icon}</button>`).join('')+'</div>';
   const placed=new Set();S.drag(area,{onSelect:id=>pronounce(id,area.querySelector('[data-piece="'+id+'"]')),onDrop:(id,t,b,box)=>{if(solved||placed.has(id))return false;if(id!==t){retry(id,b);return false;}placed.add(id);b.disabled=true;box.classList.add('targetFilled');box.querySelector('.targetContents').textContent='✓';S.burst(box);if(placed.size===q.items.length)celebrate();return true;}});
  }
 }
 global.EnglishSpace={render};
})(window);
