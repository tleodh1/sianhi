/* One context, one music scheduler, bounded voices, independent music/SFX/voice mix. */
(function(g){
 const score=g.SianScores;let ctx=null,master,music,fx,analyser,timer=0,next=0,step=0,bar=0,track=null,paused=false,hidden=false,ducked=false,intensity=0,owner=null,serial=0;const voices=new Set(),recent=new Map();let panel=null;
 const settings=()=>{state.audio ||= {master:true,bgm:state.sound!==false,sfx:state.sound!==false,voice:true,musicVolume:.48,effectVolume:.65};return state.audio;};
 const clamp=x=>Math.max(0,Math.min(1,Number(x)||0));
 function ramp(node,value,seconds=.35){if(!ctx||!node)return;const p=node.gain,t=ctx.currentTime;p.cancelScheduledValues(t);p.setValueAtTime(p.value,t);p.linearRampToValueAtTime(value,t+seconds);}
 function mix(){const s=settings();ramp(master,s.master&&!hidden? .65:0,.08);ramp(music,s.bgm&&!paused?(s.musicVolume??.48)*(ducked?.25:1)*(['learning','memory'].includes(owner)?.48:1):0,ducked?.12:.4);ramp(fx,s.sfx?(s.effectVolume??.65)*(ducked?.4:1):0,.12);}
 function diagnostics(){const d=document.documentElement.dataset;d.audioTrack=track||'none';d.audioState=ctx?.state||'locked';d.audioOwner=owner||'none';d.audioPaused=String(paused);d.audioDucked=String(ducked);d.audioSchedulers=timer?'1':'0';d.audioNodes=String(voices.size);d.audioMusicGain=String(music?.gain.value??0);d.audioEffectsGain=String(fx?.gain.value??0);if(analyser&&ctx?.state==='running'){const a=new Float32Array(128);analyser.getFloatTimeDomainData(a);d.audioLevel=String(Math.sqrt(a.reduce((s,v)=>s+v*v,0)/a.length).toFixed(6));}else d.audioLevel='0';}
 // iOS Safari routes Web Audio through the "ambient" session by default, which the
 // physical ring/silent switch mutes. Asking for "playback" keeps music audible.
 function claimPlaybackSession(){try{const s=navigator.audioSession;if(s&&s.type!=='playback')s.type='playback';}catch{}}
 // iOS also needs a silent HTMLAudio element started inside a gesture before the
 // AudioContext is treated as a real playback source on some versions.
 let primer=null;
 function primeElement(){try{if(!primer){primer=new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA=');primer.loop=true;primer.volume=0;primer.setAttribute('playsinline','');}primer.play?.().catch(()=>{});}catch{}}
 function unlock(){if(!settings().master)return Promise.resolve(false);try{claimPlaybackSession();primeElement();if(!ctx){const C=g.AudioContext||g.webkitAudioContext;if(!C)return Promise.resolve(false);ctx=new C();master=ctx.createGain();music=ctx.createGain();fx=ctx.createGain();analyser=ctx.createAnalyser();analyser.fftSize=256;const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-12;limiter.ratio.value=8;music.connect(master);fx.connect(master);master.connect(limiter);limiter.connect(analyser);analyser.connect(ctx.destination);ctx.onstatechange=()=>{diagnostics();if(ctx.state==='running'&&track&&!paused&&!hidden)schedule();};}mix();
  // 'interrupted' is an iOS-only state (a call, Siri, another app); resume() clears it.
  const p=ctx.state!=='running'?ctx.resume():Promise.resolve();
  return p.then(()=>{if(ctx.state==='running'){if(track&&!paused&&!hidden){next=ctx.currentTime+.04;schedule();}}else retryUnlock();diagnostics();return ctx.state==='running';}).catch(()=>{retryUnlock();return false;});}catch{return Promise.resolve(false);}}
 // If the very first attempt happened outside a gesture, latch on to the next real touch.
 let retryArmed=false;
 function retryUnlock(){if(retryArmed)return;retryArmed=true;const go=()=>{retryArmed=false;for(const t of ['pointerdown','touchend','click','keydown'])g.removeEventListener(t,go,true);unlock();};for(const t of ['pointerdown','touchend','click','keydown'])g.addEventListener(t,go,{capture:true,once:true,passive:true});}
 function tone(note,time,duration,amp,instrument='sine',bus='music'){
  if(!ctx||voices.size>=64)return;const o=ctx.createOscillator(),gain=ctx.createGain();const freq=440*Math.pow(2,(note-69)/12);o.type=['sine','triangle','sawtooth','square'].includes(instrument)?instrument:instrument==='synth'?'triangle':'sine';o.frequency.setValueAtTime(instrument==='kick'?125:instrument==='hat'?7600:freq,time);
  if(instrument==='kick')o.frequency.exponentialRampToValueAtTime(42,time+.1);if(instrument==='pluck'||instrument==='marimba')o.frequency.exponentialRampToValueAtTime(freq*.997,time+duration);
  const attack=instrument==='flute'?.025:.008;gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,amp),time+attack);gain.gain.exponentialRampToValueAtTime(.0001,time+duration+.06);o.connect(gain);gain.connect(bus==='music'?music:fx);const v={o,gain,bus};voices.add(v);o.onended=()=>{o.disconnect();gain.disconnect();voices.delete(v);};o.start(time);o.stop(time+duration+.07);
  if(['bell','marimba','flute'].includes(instrument)&&voices.size<62){const h=ctx.createOscillator(),hg=ctx.createGain();h.frequency.value=freq*(instrument==='bell'?2.76:2);hg.gain.setValueAtTime(.0001,time);hg.gain.exponentialRampToValueAtTime(amp*(instrument==='flute'?.14:.28),time+.006);hg.gain.exponentialRampToValueAtTime(.0001,time+duration*.6+.04);h.connect(hg);hg.connect(bus==='music'?music:fx);const hv={o:h,gain:hg,bus};voices.add(hv);h.onended=()=>{h.disconnect();hg.disconnect();voices.delete(hv);};h.start(time);h.stop(time+duration*.6+.06);}
 }
 function kill(bus,fade=0){if(!ctx)return;for(const v of [...voices])if(!bus||v.bus===bus){try{if(fade){ramp(v.gain,0,fade);v.o.stop(ctx.currentTime+fade+.01);}else{v.o.stop();v.o.disconnect();v.gain.disconnect();voices.delete(v);}}catch{voices.delete(v);}}}
 function clearTimer(){if(timer)clearInterval(timer);timer=0;}
 function tick(){if(!track||paused||hidden||ctx?.state!=='running')return;const t=score.tracks[track];if(next<ctx.currentTime-.25)next=ctx.currentTime+.03;while(next<ctx.currentTime+.14){if(settings().master&&settings().bgm)for(const n of score.notes(track,bar,step,intensity))tone(n.note,next,n.duration,n.amp,n.instrument);const rate=t.bpm*(owner==='tetris'?1+intensity*.22:1);next+=30/rate*(step%2?1-t.swing:1+t.swing);if(++step===8){step=0;bar=(bar+1)%t.bars;}}diagnostics();}
 function schedule(){if(timer||!track||paused||hidden||ctx?.state!=='running')return;next=Math.max(next,ctx.currentTime+.035);timer=setInterval(tick,40);tick();}
 function stopMusic(fade=.2){clearTimer();kill('music',fade);track=null;diagnostics();}
 function musicTo(id,delay=0){if(!score.tracks[id])return;if(track===id){mix();schedule();return;}clearTimer();kill('music',.22);track=id;bar=step=0;next=(ctx?.currentTime||0)+Math.max(.25,delay);mix();schedule();diagnostics();}
 function stop(){serial++;clearTimer();kill();track=null;owner=null;paused=false;ducked=false;recent.clear();panel?.remove();panel=null;diagnostics();}
 function start(id,host){stop();owner=id;paused=false;hidden=!!document.hidden;musicTo(score.tracks[id]?id:'learning');mount(host||document.getElementById('gameBody'));unlock();}
 function pause(value=true){paused=value;clearTimer();if(paused){kill(undefined,.05);g.LearningSpeech?.stop();}else{next=(ctx?.currentTime||0)+.04;schedule();}mix();diagnostics();}
 function duck(value){ducked=value;mix();diagnostics();}
 const sfxNotes={jump:[60,72],land:[43,38],growth:[60,64,67,76],starPower:[67,74,78,83],starShot:[88,79],enemyStarHit:[76,88],enemyStarDefeat:[72,79,88],shrink:[64,55,48],hurt:[52,45],powerLost:[71,59,47],death:[64,60,55,43],fall:[79,67,55,43],coin:[88,95],star:[79,86,90,95],letter:[72,76],wordComplete:[72,79,83,88],power:[64,71,76],flight:[72,76,83,88],blockHit:[48,52],blockBreak:[45,40,34],rewardPop:[67,79],goal:[72,79,83,88],clear:[72,79,83,88,86,88],worldClear:[60,67,71,76,79,83,88],enemyStomp:[55,67],bossHit:[43,55,72],bossAttack:[40,47],bossDefeat:[48,55,59,64,72,79,83,88],transition:[55,62,59,50],clawDrop:[76,72,67],clawGrip:[60,64],fail:[60,57],launch:[72,84],paddle:[67,72],rotate:[60,67],lock:[48,55],line:[67,74,78,83],match:[72,76,83],snap:[67,74],select:[72],start:[72,79,83,88]};
 const aliases={blockCrack:'blockHit',rollingBreak:'blockBreak',enemyCombo:'enemyStomp',enemyHit:'enemyStomp',enemyShell:'blockHit',enemyShield:'blockHit',enemyShotHit:'hurt',enemyFire:'bossAttack',bossAttackHit:'hurt',bossAnswer:'starShot',bossShield:'blockHit',bossTelegraph:'transition',doorUnlock:'goal',checkpoint:'star',powerStarStep:'growth',starPowerRefresh:'starPower',clam:'rewardPop',starPickup:'star',item:'power',wrong:'fail'};
 Object.assign(sfxNotes,{pang3:[76,83],pang4:[79,86,91],pang5:[72,84,88,95],pang6:[60,72,79,84,91],pang7:[72,84,91,96],pangFever:[72,79,84,88,91],pangLast:[84,79,91,96]});
 function effect(kind,pitch=1){kind=aliases[kind]||kind;const notes=sfxNotes[kind];if(!notes||!settings().master||!settings().sfx||hidden||paused||ctx?.state!=='running')return;const now=ctx.currentTime;if(now-(recent.get(kind)??-100)<.085)return;recent.set(kind,now);const gap=['clear','worldClear','bossDefeat'].includes(kind)?.135:.075;notes.forEach((n,i)=>tone(n+12*Math.log2(Math.max(.8,Math.min(1.6,pitch))),now+i*gap,.13,kind==='land'?.025:.085,['star','coin','letter','worldClear'].includes(kind)?'bell':kind==='blockBreak'?'triangle':'marimba','fx'));diagnostics();}
 function event(e,world=1){const kind=typeof e==='string'?e:e.type,w=score.worlds[Math.max(0,Math.min(8,world-1))];
  if(kind==='bossTransition'){stopMusic(.35);effect('transition');return;}
  if(kind==='bossArena'||kind==='bossStart'){musicTo('boss-'+w,.55);return;}
  if(kind==='bossHit'){intensity=e.hp<=2?1:.35;}
  if(kind==='bossDefeat'){stopMusic(.25);effect('bossDefeat');return;}
  if(kind==='death'){stopMusic(.15);if(e.reason==='fall')effect('fall');effect('death');return;}
  if(kind==='respawn'){musicTo(w);return;}
  if(kind==='clear'){stopMusic(.2);effect(e.result?.boss?'worldClear':'clear');return;}
  effect(kind);
 }
 function configure(key,value){const s=settings();s[key]=key.endsWith('Volume')?clamp(value):!!value;if(key==='master'){state.sound=s.master;if(!s.master){g.LearningSpeech?.stop();kill();}else unlock();}if(key==='bgm'&&!value)kill('music');if(key==='sfx'&&!value)kill('fx');if(key==='voice'&&!value)g.LearningSpeech?.stop();document.getElementById('soundToggle')?.setAttribute('aria-label',s.master?'소리 끄기':'소리 켜기');save();mix();updatePanel();diagnostics();}
 function updatePanel(){if(!panel)return;const s=settings();panel.querySelectorAll('[data-audio-setting]').forEach(el=>{const k=el.dataset.audioSetting;if(el.type==='checkbox')el.checked=!!s[k];else el.value=s[k];});}
 function mount(host){if(!host)return;panel?.remove();panel=document.createElement('details');panel.className='sianAudioSettings';panel.innerHTML='<summary>♪ 소리 설정</summary><div>'+[['master','전체 소리'],['bgm','배경 음악'],['sfx','효과음'],['voice','학습 음성']].map(([k,l])=>`<label><input type="checkbox" data-audio-setting="${k}">${l}</label>`).join('')+'<label>음악 크기<input type="range" min="0" max="1" step=".05" data-audio-setting="musicVolume"></label><label>효과음 크기<input type="range" min="0" max="1" step=".05" data-audio-setting="effectVolume"></label></div>';panel.onchange=e=>{const k=e.target.dataset.audioSetting;if(k)configure(k,e.target.type==='checkbox'?e.target.checked:e.target.value);};host.prepend(panel);updatePanel();}
 // Capture phase so a game's own preventDefault/stopPropagation can never swallow the unlock.
 for(const type of ['pointerdown','touchstart','touchend','click'])document.addEventListener(type,()=>{if(owner&&!hidden&&ctx?.state!=='running')unlock();},{passive:true,capture:true});
 document.addEventListener('keydown',()=>{if(owner&&!hidden&&ctx?.state!=='running')unlock();},{capture:true});
 document.addEventListener('visibilitychange',()=>{hidden=document.hidden;if(hidden){clearTimer();kill();g.LearningSpeech?.stop();ctx?.suspend().catch(()=>{});}else if(owner)unlock();mix();diagnostics();});
 g.addEventListener('pagehide',()=>{stop();g.LearningSpeech?.stop();ctx?.suspend().catch(()=>{});});
 g.SianAudio={start,stop,pause,unlock,music:musicTo,stopMusic,effect,event,duck,configure,settings,mount,intensity:v=>{intensity=clamp(v);},voiceAllowed:()=>settings().master&&settings().voice};
})(window);
