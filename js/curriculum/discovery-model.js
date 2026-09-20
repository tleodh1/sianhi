(function(global){
 const en=['apple','banana','cat','dog','rabbit','bear','fish','whale','car','ball'];
 const chapters={영어:['그림·단어 탐색','듣고 단어 찾기','그림과 영어 단어','같은 단어 연결','첫 알파벳','빈칸 알파벳','단어 조립','그림·단어 짝꿍','짧은 영어 표현','문장 속 그림'],과학:['오감 관찰 숲','동물의 집','날씨와 계절','물 실험실','자석 탐험','빛과 그림자','생명의 순서','낮과 밤','생태 탐험','조건을 바꿔 봐요']};
 const habitats={fish:'ocean',whale:'ocean',dog:'forest',rabbit:'forest',camel:'desert',polar:'ice'};
 function shuffle(a,seed){const b=a.slice();for(let i=b.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[b[i],b[j]]=[b[j],b[i]];}return b;}
 function make(subject,stage){if(!chapters[subject]||!Number.isInteger(stage)||stage<1||stage>100)throw new Error('Invalid discovery stage');const ch=Math.floor((stage-1)/10),k=(stage-1)%10,q={id:subject+':'+stage,subject,stage,title:chapters[subject][ch],difficulty:ch+1,theme:'garden',options:[],targets:[],expected:{},parts:[],explanation:''};const ko=t=>({text:t,lang:'ko-KR'}),eng=t=>({text:t,lang:'en-US'});
 if(subject==='영어'){
  const words=['apple','banana','cat','dog','rabbit','bear','fish','whale','car','ball'];
  q.word=stage===6?'cat':words[k];q.mode=['explore','listenWord','pictureWord','sameWord','initialLetter','missingLetter','buildWord','pictureMatch','phrase','sentenceMeaning'][ch];
  q.lexeme={image:q.word,spelling:q.word.toUpperCase(),pronunciation:{text:q.word,lang:'en-US'}};
  q.correct=q.word;q.options=[q.word,...words.filter(x=>x!==q.word).slice(0,3)];
  if(stage===6)q.options=['dog','banana','cat','apple'];
  q.prompt=ch===0?'그림 친구를 눌러 이름을 듣고, 이제 찾아볼까?':'그림과 글자를 보고 소리를 연결해 봐.';
  q.parts=[ko(q.prompt),eng('Find the '+q.word+'.')];
  if(ch===3||ch===7){q.options=[];q.items=[q.word,words[(k+3)%10],words[(k+6)%10]];q.targets=q.items.map(x=>({id:x,key:x}));q.items.forEach(x=>q.expected[x]=x);q.parts=[ko('그림과 영어 단어를 같은 친구끼리 연결해 줘.')];}
  if(ch===4||ch===5){q.letterIndex=ch===4?0:1+k%(q.word.length-1);q.correct=q.word[q.letterIndex].toUpperCase();q.options=[q.correct,...['A','B','C','D','E','F','T'].filter(x=>x!==q.correct).slice(0,3)];q.prompt=ch===4?'그림 이름의 첫 알파벳을 찾아 줘.':'빈자리에 들어갈 알파벳을 찾아 줘.';q.parts=[eng(q.word),ko(q.prompt)];}
  if(ch===6){q.options=[];q.tiles=shuffle([...q.word.toUpperCase()].map((letter,i)=>({id:'letter-'+i,letter})),stage*61);q.prompt='알파벳을 차례로 눌러 줘. 빈칸으로 옮겨도 돼.';q.parts=[eng(q.word),ko(q.prompt)];}
  if(ch===8){q.phraseKind=k%4;q.word=['apple','dog','car','cat'][q.phraseKind];q.correct=['red','big','blue','two'][q.phraseKind];q.options=[['red','blue','yellow'],['big','small'],['red','blue','yellow'],['one','two','three']][q.phraseKind];q.expression=q.correct+' '+q.word+(q.phraseKind===3?'s':'');q.parts=[ko('그림과 영어 표현을 연결해 봐.'),eng('Find '+q.expression+'.')];}
  if(ch===9){q.animal=k%2?'dog':'cat';q.word=q.animal;q.correct=k%2?'under':'running';q.options=k%2?['on','under','in']:['running','walking','sleeping'];q.expression='The '+q.animal+' is '+q.correct+(k%2?' the box.':'.');q.parts=[ko('문장을 듣고 같은 장면을 찾아 줘.'),eng(q.expression)];}
  q.lexeme={image:q.word,spelling:q.word.toUpperCase(),pronunciation:{text:q.word,lang:'en-US'}};
  // Interleave handwriting missions through the English curriculum.
  // Early stages write single alphabet letters; later stages write short words.
  const handwritingStage=stage%3===0;
  if(handwritingStage){
   if(stage<=30){
    const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ',letter=alphabet[(stage/3-1)%26|0];
    q.mode='writeLetter';q.writeText=letter;q.word=letter.toLowerCase();q.title='알파벳 손글씨';q.prompt=letter+'를 보고, 따라 쓰고, 기억해서 써 보자.';
    q.parts=[eng(letter),ko('손가락으로 알파벳 '+letter+'를 따라 써 보자.')];q.tracePhases=['A','B','C','D'];
   }else{
    const writingWords=['cat','dog','sun','map','pig','hat','bed','fox','cup','fish','ball','milk','car','bear','apple'];
    const word=writingWords[((stage/3|0)-11)%writingWords.length];
    q.mode='writeWord';q.writeText=word.toUpperCase();q.word=word;q.title=stage<=60?'짧은 단어 쓰기':'기억해서 단어 쓰기';q.prompt=word.toUpperCase()+'를 한 글자씩 손으로 써 보자.';
    q.parts=[eng(word),ko('단어 '+word.toUpperCase()+'를 손가락으로 써 보자.')];q.tracePhases=stage<=60?['B','C']:['C','D'];
   }
  }
  q.explanation='그림, 영어 글자, 소리를 함께 기억했어!';

 }else{
  if(ch===0){q.mode='sense';const pairs=[['flower','nose','향기를 맡으려면 어디를 사용할까?'],['bell','ear','종소리를 들으려면 어디를 사용할까?'],['balloon','eye','풍선의 색을 보려면 어디를 사용할까?'],['wood','hand','나무의 매끈함을 만져 보려면 어디를 사용할까?']];const p=pairs[k%4];q.scene=p[0];q.correct=p[1];q.options=['nose','ear','eye','hand'];q.prompt=p[2];q.explanation='몸의 감각으로 여러 특징을 알아볼 수 있어.';}
  if(ch===1||ch===8){q.mode='habitat';q.items=ch===1?['fish','dog','whale','rabbit']:['polar','camel','fish','rabbit'];q.targets=(ch===1?['ocean','forest']:['ice','desert','ocean','forest']).map(x=>({id:x,key:x,label:ch===1&&x==='forest'?'땅 위':null}));q.items.forEach(x=>q.expected[x]=habitats[x]);q.prompt='동물 친구를 알맞은 집으로 데려다 줘.';q.explanation='동물마다 살기에 알맞은 환경이 달라.';}
  if(ch===2){q.mode=k<5?'weather':'season';const p=[['rain','umbrella'],['snow','coat'],['sun','glasses'],['sun','shirt']][k%4];q.scene=p[0];q.correct=p[1];q.options=['umbrella','coat','glasses','shirt'];if(q.mode==='season'){const seasons=[['snow','coat'],['flower','shirt'],['sun','shirt'],['leaf','coat']];const v=seasons[k%4];q.scene=v[0];q.correct=v[1];q.options=['coat','shirt'];}q.prompt=q.scene==='sun'&&q.correct==='glasses'?'햇빛이 눈부셔. 눈을 보호할 물건을 골라 줘.':q.correct==='shirt'?'따뜻하거나 더운 날이야. 가볍게 입을 옷을 골라 줘.':q.correct==='umbrella'?'비가 내려. 비를 막아 줄 물건은 무엇일까?':'추운 바람이 불어. 따뜻하게 입을 옷을 골라 줘.';q.explanation='날씨와 기온에 맞는 물건을 사용할 수 있어.';}
  if(ch===3){q.mode='float';q.items=['wood','rock','ball','iron'];q.prompt='물에 넣어 보자. 뜰까, 가라앉을까? 먼저 예상하고 옮겨 봐.';q.explanation='이 나무토막과 공은 뜨고, 돌과 철 클립은 가라앉았어.';}
  if(ch===4){q.mode='magnet';q.items=['iron','wood','paper','ball'];q.prompt='자석을 물건 가까이 옮겨 봐. 어떤 물건이 따라올까?';q.explanation='철 클립은 자석에 붙고, 나무·종이·고무공은 붙지 않았어.';}
  if(ch===5){q.mode='shadow';q.light=k%2?'right':'left';q.correct=q.light==='left'?'right':'left';q.prompt='빛을 '+(q.light==='left'?'왼쪽':'오른쪽')+'으로 움직여 봐. 그림자는 어느 쪽으로 갈까?';q.explanation='빛이 오는 쪽의 반대쪽으로 그림자가 생겨.';}
  if(ch===6){q.mode='growth';q.items=k%2?['egg','chick','hen']:['seed','sprout','plant'];q.targets=q.items.map((x,i)=>({id:String(i),key:'slot'}));q.items.forEach((x,i)=>q.expected[x]=String(i));q.prompt='어떻게 자랄까? 처음부터 차례대로 놓아 줘.';q.explanation=q.items.includes('egg')?'알에서 병아리가 태어나 닭으로 자라.':'씨앗에서 싹이 나고 잎이 자라.';}
  if(ch===7){q.mode='dayNight';q.correct=k%2?'night':'day';q.prompt='지구를 돌려서 집이 '+(q.correct==='day'?'햇빛을 받게':'햇빛을 받지 않게')+' 해 줘.';q.explanation='지구가 스스로 돌아서 낮과 밤이 번갈아 와.';}
  if(ch===9){q.mode='experiment';q.condition=k%2?'wind':'light';q.goal=2;q.prompt=q.condition==='light'?'물과 흙은 같아. 햇빛만 늘리고 며칠 뒤 식물의 변화를 살펴봐.':'바람의 세기만 바꿔 봐. 바람개비가 더 빨리 돌게 해 줘.';q.explanation='조건 하나만 바꾸면 무엇 때문에 결과가 달라졌는지 비교할 수 있어.';}
  q.parts=[{text:q.prompt,lang:'ko-KR'}];
 }
 q.options=shuffle(q.options,stage*487);if(q.items)q.items=shuffle(q.items,stage*191);return q;
 }
 const floats=id=>['wood','ball'].includes(id),magnetic=id=>id==='iron';
 function validate(q){if(q.options.length&&q.options.filter(x=>x===q.correct).length!==1)return false;if(new Set(q.options).size!==q.options.length)return false;if(q.targets.length&&q.items.some(x=>!q.targets.some(t=>t.id===q.expected[x])))return false;return !!q.prompt&&q.parts.length>0;}
 const letterNames={A:"ay",B:"bee",C:"see",D:"dee",E:"ee",F:"ef",G:"jee",H:"aitch",I:"eye",J:"jay",K:"kay",L:"el",M:"em",N:"en",O:"oh",P:"pee",Q:"cue",R:"ar",S:"ess",T:"tee",U:"you",V:"vee",W:"double you",X:"ex",Y:"why",Z:"zee"};
 global.DiscoveryModel={letterNames,make,validate,shuffle,chapters,floats,magnetic};
})(window);
