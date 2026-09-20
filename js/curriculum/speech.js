/* Explicit listening is independent of optional game sound. One owner and queue. */
(function(global){
 let serial=0,current=null,voices=[],watchdog=0,clip=null;
 const synth=global.speechSynthesis;
 const icon='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 12H10L18 6V26L10 20H4Z" fill="currentColor"/><path d="M22 11Q28 16 22 21M25 6Q36 16 25 26" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
 function refresh(){voices=synth?.getVoices()||[];}
 refresh();synth?.addEventListener?.('voiceschanged',refresh);
 function segments(text){return (String(text).match(/[A-Za-z][A-Za-z0-9\s'’.,!?-]*|[^A-Za-z]+/g)||[]).map(t=>({text:t.trim(),lang:/[A-Za-z]/.test(t)?'en-US':'ko-KR'})).filter(x=>/[\p{L}\p{N}]/u.test(x.text));}
 function mark(ctx,phase,message){if(!ctx)return;ctx.button?.setAttribute('data-speech',phase);ctx.button?.setAttribute('aria-busy',String(phase==='speaking'));if(ctx.status){ctx.status.textContent=message;ctx.status.dataset.speech=phase;}}
 function stop(){if(clip){clip.pause();clip.removeAttribute("src");clip=null;}global.SianAudio?.duck(false);serial++;clearTimeout(watchdog);watchdog=0;const old=current;current=null;synth?.cancel();mark(old,'idle','');}
 function speak(parts,options={}){
  if(options.automatic&&!state.sound)return false;
  stop();global.SianAudio?.unlock();const token=serial;let queue=(typeof parts==='string'?segments(parts):parts).filter(p=>p.text?.trim());if(global.VoiceDirector)queue=global.VoiceDirector.prepare(queue);
  const ctx=current={button:options.button,status:options.status,utterance:null,started:false};if(ctx.status)delete ctx.status.dataset.speechError;
  if(global.SianAudio&&!global.SianAudio.voiceAllowed()){mark(ctx,'idle','소리 설정에서 학습 음성을 켜 주세요.');return false;}
  if((!synth||!global.SpeechSynthesisUtterance)&&!queue.every(p=>global.SianVoiceClips?.[(p.lang||'ko-KR')+'|'+p.text])){mark(ctx,'error','이 기기는 음성 읽기를 지원하지 않아요.');return false;}
  refresh();if(synth?.paused)synth.resume();mark(ctx,'loading','소리를 준비하고 있어요.');
  function next(){if(token!==serial)return;const part=queue.shift();if(!part){global.SianAudio?.duck(false);mark(ctx,'ended','다시 들으려면 스피커를 눌러 줘.');current=null;return;}
   const clipPath=global.SianVoiceClips?.[(part.lang||'ko-KR')+'|'+part.text];
   if(clipPath){clip=new Audio(clipPath);const media=clip;media.onplaying=()=>{if(token!==serial)return;global.SianAudio?.duck(true);mark(ctx,'speaking','이야기를 듣고 있어요.');};media.onended=()=>{if(token!==serial)return;clip=null;next();};media.onerror=()=>{if(token!==serial)return;global.SianAudio?.duck(false);mark(ctx,'error','음성을 불러오지 못했어요. 다시 눌러 주세요.');clip=null;};media.play().catch(()=>{if(token!==serial)return;global.SianAudio?.duck(false);mark(ctx,'error','스피커를 다시 눌러 주세요.');});return;}
   const u=new SpeechSynthesisUtterance(part.text);ctx.utterance=u;u.lang=part.lang||'ko-KR';u.rate=u.lang.startsWith('en')?.82:.9;u.volume=1;
   u.voice=voices.find(v=>v.lang.replace('_','-')===u.lang)||voices.find(v=>v.lang.slice(0,2)===u.lang.slice(0,2))||null;
   u.onstart=()=>{if(token!==serial)return;clearTimeout(watchdog);ctx.started=true;global.SianAudio?.duck(true);mark(ctx,'speaking',u.lang.startsWith('en')?'영어 소리를 듣고 있어요.':'이야기를 듣고 있어요.');};
   u.onend=()=>{if(token!==serial)return;clearTimeout(watchdog);next();};
   u.onerror=e=>{if(token!==serial)return;clearTimeout(watchdog);queue.length=0;global.SianAudio?.duck(false);if(ctx.status)ctx.status.dataset.speechError=e.error||'unknown';mark(ctx,'error','소리를 시작하지 못했어요. 스피커를 다시 눌러 주세요.');current=null;};
   watchdog=setTimeout(()=>{if(token!==serial)return;stop();mark(ctx,'error','소리가 시작되지 않았어요. 기기 음량을 확인하고 다시 눌러 주세요.');},7000);
   // First speak remains inside the user's click event, including when voices are still loading.
   synth.speak(u);
  }
  next();return true;
 }
 function bind(button,parts,status){button.innerHTML=icon+'<span>문제 듣기</span>';button.classList.add('learningSpeaker');button.onclick=()=>speak(typeof parts==='function'?parts():parts,{button,status});}
 global.LearningSpeech={speak,stop,segments,bind,icon};
})(window);
