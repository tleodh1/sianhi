(function(global){
 const en=['apple','banana','cat','dog','rabbit','bear','fish','whale','car','ball'];
 const chapters={영어:['소리로 만나는 친구','그림과 소리','단어 연결 놀이터','색깔 풍선','별을 세어요','곰의 숨바꼭질','움직이는 친구','소리와 글자','작은 문장 극장','대화 속 미션'],과학:['오감 관찰 숲','동물의 집','날씨와 계절','물 실험실','자석 탐험','빛과 그림자','생명의 순서','낮과 밤','생태 탐험','조건을 바꿔 봐요']};
 const habitats={fish:'ocean',whale:'ocean',dog:'forest',rabbit:'forest',camel:'desert',polar:'ice'};
 function shuffle(a,seed){const b=a.slice();for(let i=b.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[b[i],b[j]]=[b[j],b[i]];}return b;}
 function make(subject,stage){if(!chapters[subject]||!Number.isInteger(stage)||stage<1||stage>100)throw new Error('Invalid discovery stage');const ch=Math.floor((stage-1)/10),k=(stage-1)%10,q={id:subject+':'+stage,subject,stage,title:chapters[subject][ch],difficulty:ch+1,theme:'garden',options:[],targets:[],expected:{},parts:[],explanation:''};const ko=t=>({text:t,lang:'ko-KR'}),eng=t=>({text:t,lang:'en-US'});
 if(subject==='영어'){
  const word=en[k];q.word=word;
  if(ch===0||ch===1){q.mode=ch?'soundChoice':'listen';q.correct=word;q.options=[word,...en.filter(x=>x!==word).slice(k%5,k%5+3)];q.prompt=ch?'그림을 보고, 같은 소리를 찾아 눌러 줘.':'소리를 듣고 알맞은 그림을 눌러 줘.';q.parts=ch?[ko(q.prompt)]:[ko('어떤 친구일까? 소리를 잘 들어 봐.'),eng(word),ko('그림을 찾아 눌러 줘.')];}
  if(ch===2){q.mode='match';q.items=[word,en[(k+3)%10],en[(k+6)%10]];q.targets=q.items.map(x=>({id:x,key:x}));q.items.forEach(x=>q.expected[x]=x);q.prompt='소리를 들어 보고, 그림 친구와 단어 블록을 연결해 줘.';q.parts=[ko(q.prompt),eng(q.items.join('. '))];}
  if(ch===3){q.mode='color';q.correct=['red','blue','yellow','green'][k%4];q.options=['red','blue','yellow','green'];q.prompt='소리를 듣고 풍선을 눌러 줘.';q.parts=[ko(q.prompt),eng('Touch the '+q.correct+' balloon.')];}
  if(ch===4){q.mode='count';q.correct=String(1+k%5);q.options=[1,2,3,4,5].map(String).filter(x=>x===q.correct||+x<4).slice(0,4);q.prompt='별이 몇 개인지 듣고 같은 그림을 골라 줘.';q.parts=[ko(q.prompt),eng(['','One star.','Two stars.','Three stars.','Four stars.','Five stars.'][+q.correct])];}
  if(ch===5){q.mode='position';q.relation=['on','under','in'][k%3];q.items=['bear'];q.targets=['on','under','in'].map(x=>({id:x,key:'box',relation:x}));q.expected.bear=q.relation;q.prompt='곰을 잡고 소리에 맞는 자리로 옮겨 줘.';q.parts=[ko(q.prompt),eng('Put the bear '+q.relation+' the box.')];}
  if(ch===6){q.mode='action';q.correct=['running','walking','sleeping'][k%3];q.options=['running','walking','sleeping'];q.prompt='움직임을 보고 소리에 맞는 친구를 찾아 줘.';q.parts=[ko(q.prompt),eng('Who is '+q.correct+'?')];}
  if(ch===7){q.mode='phonics';q.word=['cat','dog','fish','ball','hat'][k%5];q.correct=q.word[0];q.options=[q.correct,...['c','d','f','b','h'].filter(x=>x!==q.correct).slice(0,3)];q.prompt='단어를 듣고 첫 글자 친구를 찾아 줘.';q.parts=[ko(q.prompt),eng(q.word+'. '+q.correct+'. '+q.word)];}
  if(ch===8||ch===9){q.mode=ch===8?'sentence':'dialogue';q.animal=['cat','bear','rabbit'][k%3];q.relation=['under','on','in'][Math.floor(k/3)%3];q.correct=q.relation;q.options=['on','under','in'];q.prompt=ch===8?'이야기를 듣고 같은 장면을 골라 줘.':'두 친구의 대화를 듣고 그림을 찾아 줘.';q.parts=[ko(q.prompt),eng(ch===9?'Where is the '+q.animal+'? The '+q.animal+' is '+q.relation+' the box.':'The '+q.animal+' is '+q.relation+' the box.')];}
  q.explanation='소리와 그림을 잘 연결했어!';
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
 global.DiscoveryModel={make,validate,shuffle,chapters,floats,magnetic};
})(window);
