const a=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const c={window:{}};vm.createContext(c);for(const f of ['discovery-model','discovery-art'])vm.runInContext(fs.readFileSync('js/curriculum/'+f+'.js','utf8'),c);
const M=c.window.DiscoveryModel,A=c.window.DiscoveryArt,modes=new Set(),positions=new Set();
for(const subject of ['영어','과학'])for(let stage=1;stage<=100;stage++){const q=M.make(subject,stage);a.ok(M.validate(q),q.id);modes.add(q.mode);a.ok(q.parts.every(x=>x.lang==='ko-KR'||x.lang==='en-US'));if(q.options.length){a.equal(q.options.filter(x=>x===q.correct).length,1);positions.add(q.options.indexOf(q.correct));}for(const k of [...q.options,...(q.items||[]),q.scene,q.word].filter(x=>A.labels[x])){const art=A.draw(k);a.match(art,/<svg/);a.doesNotMatch(art,/undefined|NaN/);}for(const [id,t] of Object.entries(q.expected))a.ok(q.targets.some(x=>x.id===t),q.id+' target '+id);}
a.ok(positions.size>=3);a.equal(M.floats('wood'),true);a.equal(M.floats('rock'),false);a.equal(M.magnetic('iron'),true);a.equal(M.magnetic('wood'),false);a.equal(M.make('과학',51).correct,'right');a.equal(M.make('과학',52).correct,'left');a.equal(M.make('과학',61).expected.seed,'0');a.equal(M.make('과학',62).expected.hen,'2');
// Ten spelling chapters preserve IDs and one-step stage progression.
const englishModes=['explore','listenWord','pictureWord','sameWord','initialLetter','missingLetter','buildWord','pictureMatch','phrase','sentenceMeaning'];
for(let chapter=0;chapter<10;chapter++)a.equal(M.make('영어',chapter*10+1).mode,englishModes[chapter]);
a.deepEqual([...M.make('영어',6).options].sort(),['apple','banana','cat','dog']);
for(let n=41;n<=60;n++){const q=M.make('영어',n);a.equal(q.correct,q.word[q.letterIndex].toUpperCase());}
for(let n=61;n<=70;n++){const q=M.make('영어',n);a.equal(new Set(q.tiles.map(t=>t.id)).size,q.word.length);a.equal(q.tiles.map(t=>t.letter).sort().join(''),[...q.word.toUpperCase()].sort().join(''));}
a.equal(M.make('영어',61).tiles.filter(t=>t.letter==='P').length,2);
a.equal(M.letterNames.C,'see');a.notEqual(M.letterNames.C,'cat');
// Speech callbacks are mocked here: validates lifecycle, never proves audible playback.
let calls=[],cancelled=0,resumed=0,voiceList=[],timers=new Map(),seq=0,listener;
const synth={getVoices:()=>voiceList,addEventListener:(n,fn)=>listener=fn,cancel:()=>cancelled++,resume:()=>resumed++,paused:true,speak:u=>calls.push(u)};
class U{constructor(text){this.text=text;}}
const sc={window:{speechSynthesis:synth,SpeechSynthesisUtterance:U},SpeechSynthesisUtterance:U,state:{sound:false},setTimeout:(fn)=>{timers.set(++seq,fn);return seq;},clearTimeout:id=>timers.delete(id)};vm.createContext(sc);vm.runInContext(fs.readFileSync('js/curriculum/speech.js','utf8'),sc);const V=sc.window.LearningSpeech;
const button={attrs:{},setAttribute(k,v){this.attrs[k]=v;}},status={dataset:{},textContent:''};
a.equal(V.speak([{text:'그림을 봐.',lang:'ko-KR'},{text:'Apple.',lang:'en-US'}],{button,status}),true);a.equal(calls.length,1,'explicit muted listen still speaks synchronously');a.equal(calls[0].lang,'ko-KR');a.equal(resumed,1);calls[0].onstart();a.equal(button.attrs['data-speech'],'speaking');calls[0].onend();a.equal(calls[1].lang,'en-US');calls[1].onstart();calls[1].onend();a.equal(status.dataset.speech,'ended');
voiceList=[{lang:'ko-KR',name:'Korean'},{lang:'en-US',name:'English'}];listener();V.speak([{text:'Cat',lang:'en-US'}],{button,status});const old=calls.at(-1);a.equal(old.voice.name,'English');V.speak([{text:'다시',lang:'ko-KR'}],{button,status});const count=calls.length;old.onend();a.equal(calls.length,count,'stale event must not play canceled tail');a.equal(calls.at(-1).voice.name,'Korean');V.stop();a.equal(status.dataset.speech,'idle');a.ok(cancelled>=4);const before=calls.length;a.equal(V.speak('자동',{automatic:true}),false);a.equal(calls.length,before);V.speak('실패',{button,status});calls.at(-1).onerror({error:'not-allowed'});a.equal(status.dataset.speech,'error');a.match(status.textContent,/다시/);a.ok(V.segments('그림을 봐. Cat. 고양이!').some(x=>x.lang==='en-US'&&x.text.includes('Cat')));
console.log('PASS 200 discovery missions / '+modes.size+' modes, unique picture answers, experiment outcomes, muted explicit speech, bilingual queue, voiceschanged, replacement, stale callbacks, stop and error feedback (audio not hardware-tested)');
