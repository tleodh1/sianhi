/** Offline production asset generation only. No secret or paid endpoint in browser code. */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const box={window:{}};vm.createContext(box);
for(const f of ['js/audio/voice-director.js','js/curriculum/discovery-model.js'])vm.runInContext(await readFile(f,'utf8'),box);
const {VoiceDirector:D,DiscoveryModel:M}=box.window,parts=[];
for(const [style,texts] of Object.entries(D.feedback))for(const text of texts)parts.push({text,lang:'ko-KR',style});
for(const [symbol,name] of Object.entries(D.jamo))parts.push({text:name,lang:'ko-KR',style:'articulate'});
for(const subject of ['영어','과학'])for(let i=1;i<=100;i++){const q=M.make(subject,i);parts.push(...q.parts);if(subject==='영어'){parts.push({text:q.word,lang:'en-US'});for(const w of q.options)if(/^[a-z]+$/.test(w))parts.push({text:w,lang:'en-US'});}}
for(const text of Object.values(M.letterNames))parts.push({text,lang:'en-US',style:'letter name'});
const catalog=[...new Map(parts.map(p=>[p.lang+'|'+p.text,p])).values()];const chars=catalog.reduce((n,p)=>n+p.text.length,0);
console.log(JSON.stringify({clips:catalog.length,characters:chars,model:'gpt-4o-mini-tts',voice:'marin',mode:process.argv.includes('--write')?'generate':'dry-run',note:'Paid API generation requires OPENAI_API_KEY. Preview and pronunciation review required before release.'}));
if(!process.argv.includes('--write'))process.exit(0);
if(!process.env.OPENAI_API_KEY)throw new Error('OPENAI_API_KEY is not configured; no generation or cost incurred.');
if(chars>30000)throw new Error('Generation budget: at most 30,000 input characters per batch.');
await mkdir('assets/audio/voice',{recursive:true});let manifest={};
const old=(await readFile('assets/audio/voice-manifest.js','utf8')).match(/window.SianVoiceClips=(\{[\s\S]*\});/);if(old)manifest=JSON.parse(old[1]);
for(const p of catalog){const key=p.lang+'|'+p.text;if(manifest[key])continue;const id=createHash('sha256').update(key).digest('hex').slice(0,20),path='assets/audio/voice/'+id+'.mp3';
 const response=await fetch('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:'gpt-4o-mini-tts',voice:'marin',input:p.text,response_format:'mp3',instructions:`You are SianHi's warm adult learning guide speaking to a child. ${p.lang==='en-US'?'Use clear natural American English.':'Use accurate native Korean; never Chinese readings for Korean Hanja.'} Style: ${p.style||'friendly guide'}. Natural meaning-based pauses, gentle energy, no exaggerated baby voice. Do not add or omit words. Pronunciation and teaching accuracy come first.`})});
 if(!response.ok)throw new Error('Voice generation stopped: HTTP '+response.status);await writeFile(path,Buffer.from(await response.arrayBuffer()));manifest[key]=path;
 await writeFile('assets/audio/voice-manifest.js','/* AI-generated guide voice. Generated with OpenAI API; review required. */\nwindow.SianVoiceClips='+JSON.stringify(manifest,null,2)+';\n');
}
console.log('Assets created. Review Korean/English pronunciation and confirm licensing/AI disclosure before publishing.');
