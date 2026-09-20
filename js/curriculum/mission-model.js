/* Pure, deterministic mission data. Rendering never decides mathematical truth. */
(function(global){
  const colors=['red','blue','yellow'],shapes=['circle','triangle','square','star'];
  const item=(id,color='red',shape='circle',extra={})=>({id:String(id),color,shape,size:'big',kind:'block',...extra});
  function rng(seed){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
  function shuffled(list,seed){const a=list.slice(),r=rng(seed);for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  const thinking=[['장난감 마을','색과 모양을 살펴 정리해요.',['sort','shapeSort','common','odd','matrix']],['사탕 개울','공통점과 반복 규칙으로 길을 이어요.',['pattern','path']],['순서 장난감방','크기와 수량의 순서를 만들어요.',['order','count']],['회전 마을','방향을 바꾸고 거울 모양을 찾아요.',['rotation','mirror','position']],['두 조건 빛의 정원','두 조건을 동시에 생각해요.',['matrix','venn','tree']],['도형 공방','조각을 맞추고 넓이를 비교해요.',['compose','area','mirror']],['갈림길 숲','조건을 차례대로 따라가요.',['tree','odd','path']],['선택의 광장','빠뜨리지 않고 짝과 길을 찾아요.',['pairs','board']],['자료 탐험대','그림 자료의 수량과 차이를 찾아요.',['chart','compare','matrix']],['별빛 전략 테이블','두 속성과 한 줄 완성 전략에 도전해요.',['board','path','venn','tree']]];
  const math=[['과일 시장','그림을 세고 수량을 비교해요.',['compare','count','order']],['장난감 마을','앞뒤·좌우와 순서를 알아봐요.',['position','order']],['블록 공장','모양을 분류하고 조각을 맞춰요.',['shapeSort','compose','rotation']],['측정 놀이터','길이·높이·무게·들이를 비교해요.',['length','weight','capacity']],['시계 광장','시계 바늘과 흐른 시간을 살펴요.',['clock']],['작은 가게','동전을 모아 물건을 사요.',['money']],['규칙 개울','규칙과 두 속성 표를 완성해요.',['pattern','matrix','chart']],['조각 빵집','전체와 부분을 나누어요.',['fraction']],['도형 정원','넓이·둘레·대칭을 살펴요.',['area','perimeter','mirror']],['자료 관측소','그림 그래프와 비율을 읽어요.',['chart','ratio']]];
  function descriptor(subject,stage){const rows=subject==='사고력 수학'?thinking:math;return rows[Math.floor((stage-1)/10)];}
  function make(subject,stage,variant=0){const ch=Math.floor((stage-1)/10),step=(stage-1)%10,desc=descriptor(subject,stage),seed=stage*101+variant*997;let mode=desc[2][step%desc[2].length];if(subject==='연산')mode=stage<11?'count':stage<21?'combine':'subtract';
    const q={id:`space:${subject}:${stage}:${variant}`,subject,stage,mode,theme:['market','toy','factory','forest','garden','candy','river','bakery','garden','table'][ch],title:desc[0],prompt:'그림을 살펴보고 움직여 봐.',items:[],targets:[],expected:{},explanation:'',difficulty:ch+1};
    const put=(it,t)=>{q.items.push(it);q.expected[it.id]=String(t);};const target=(id,label,sample,extra={})=>{q.targets.push({id:String(id),label,sample,...extra});};
    if(['sort','shapeSort','matrix','venn','tree','common'].includes(mode)){
      const n=mode==='matrix'?6:mode==='venn'?6:4;
      for(let i=0;i<n;i++){const it=item(i,colors[(i+stage)%3],shapes[(i+stage)%4],{size:i%2?'small':'big',kind:mode==='matrix'?'candy':'block'});q.items.push(it);}
      if(mode==='sort'){q.prompt='같은 색 상자에 장난감을 넣어 줘.';colors.forEach(c=>target(c,c,item('s',c,'square')));q.items.forEach(i=>q.expected[i.id]=i.color);}
      if(mode==='shapeSort'||mode==='common'){q.prompt='같은 모양 친구끼리 무대에 모아 줘.';shapes.forEach(s=>target(s,s,item('s','blue',s)));q.items.forEach(i=>q.expected[i.id]=i.shape);}
      if(mode==='matrix'){q.prompt='색과 포장 모양을 모두 보고 사탕 선반에 넣어 줘.';q.theme='candy';q.items=colors.flatMap((c,r)=>['circle','star'].map((s,k)=>item(r*2+k,c,s,{kind:'candy'})));colors.forEach(c=>['circle','star'].forEach(s=>target(c+'-'+s,c+' '+s,item('s',c,s,{kind:'candy'}))));q.items.forEach(i=>q.expected[i.id]=i.color+'-'+i.shape);}
      if(mode==='venn'){q.prompt='별은 왼쪽 빛, 노란색은 오른쪽 빛. 둘 다 맞으면 가운데에 놓아 줘.';q.items=[item(0,'red','star'),item(1,'yellow','star'),item(2,'yellow','circle'),item(3,'blue','triangle'),item(4,'yellow','square'),item(5,'blue','star')];[['left','별만',item('s','blue','star')],['both','둘 다',item('s','yellow','star')],['right','노란색만',item('s','yellow','circle')],['outside','둘 다 아니야',item('s','blue','triangle')]].forEach(a=>target(...a));q.items.forEach(i=>q.expected[i.id]=i.shape==='star'?(i.color==='yellow'?'both':'left'):(i.color==='yellow'?'right':'outside'));}
      if(mode==='tree'){q.prompt='별 모양 길을 고르고, 다음에는 큰지 작은지 살펴봐.';q.items=[item(0,'yellow','star'),item(1,'red','circle'),item(2,'blue','star',{size:'small'}),item(3,'yellow','triangle',{size:'small'})];for(const s of ['star','other'])for(const size of ['big','small'])target(s+'-'+size,(s==='star'?'별':'다른 모양')+' · '+(size==='big'?'큰':'작은'),item('s','blue',s==='star'?'star':'circle',{size}));q.items.forEach(i=>q.expected[i.id]=(i.shape==='star'?'star':'other')+'-'+i.size);}
      q.explanation='같은 기준을 쓰면 모양이 달라도 알맞은 자리를 찾을 수 있어.';
    }else if(['compare','count','combine','subtract','ratio','chart'].includes(mode)){
      q.a=2+(stage+variant)%4;q.b=q.a+1+(stage%2);q.operation=mode==='subtract'?'−':'+';
      q.prompt=mode==='compare'?'어느 바구니에 과일이 더 많을까? 하나씩 눌러 세어 봐.':mode==='count'?'과일을 하나씩 눌러 세고, 같은 수 블록을 놓아 줘.':mode==='chart'?'가장 많이 모인 장난감은 어느 줄일까?':mode==='ratio'?'파란 블록 한 개마다 노란 블록 두 개! 노란 블록은 몇 개일까?':mode==='subtract'?'과일을 나눠 주고 몇 개가 남는지 찾아 줘.':'두 접시의 과일을 모으면 모두 몇 개일까?';
      q.value=mode==='count'?q.a:mode==='subtract'?q.b-q.a:mode==='ratio'?q.a*2:q.a+q.b;
      if(mode==='compare'){q.groups=[q.a,q.b];q.correct=stage%2?'right':'left';if(q.correct==='left')q.groups.reverse();q.explanation=q.groups[0]+(q.groups[0]>q.groups[1]?' > ':' < ')+q.groups[1];}
      else if(mode==='chart'){q.groups=[q.a,q.b,1];q.correct='1';q.explanation=q.b+'개가 가장 많아.';}
      else{target('answer','같은 수');[q.value-1,q.value,q.value+1].forEach(v=>put(item('n'+v,'blue','square',{kind:'number',value:v}),v===q.value?'answer':'none'));q.explanation=mode==='count'?q.a+'개':mode==='ratio'?q.a+' × 2 = '+q.value:mode==='subtract'?q.b+' − '+q.a+' = '+q.value:q.a+' + '+q.b+' = '+q.value;q.required=1;}
    }else if(mode==='pattern'){
      const seq=step>5?['red','red','blue']:['red','blue'];q.sequence=Array.from({length:5},(_,i)=>item('p'+i,seq[i%seq.length],'circle',{kind:'candy'}));q.prompt='돌 위 사탕의 규칙을 보고 다음 사탕을 놓아 줘.';q.theme='river';target('answer','다음 돌');colors.forEach(c=>put(item(c,c,'circle',{kind:'candy'}),c===seq[5%seq.length]?'answer':'none'));q.required=1;q.explanation='앞에서 반복된 순서가 다시 이어져.';
    }else if(mode==='path'){
      q.theme='river';q.prompt='색이나 모양 중 딱 하나만 같은 사탕을 밟아 건너자.';
      q.items=[item('0','red','circle'),item('1','red','star'),item('2','blue','star'),item('3','blue','triangle'),item('4','yellow','triangle')].map(i=>({...i,kind:'candy'}));q.path=['0','1','2','3','4'];q.explanation='색만 같거나 모양만 같은 돌을 차례로 이었어!';
    }else if(mode==='odd'){
      q.prompt='친구들과 모양이 다른 장난감을 찾아 줘.';q.correct=String(stage%4);q.items=Array.from({length:4},(_,i)=>item(i,'blue',String(i)===q.correct?'triangle':'circle',{kind:'toy'}));q.explanation='색은 같아도 모양을 기준으로 다름을 찾을 수 있어.';
    }else if(mode==='order'){
      q.prompt='작은 것부터 큰 것까지 차례로 선반에 놓아 줘.';[1,2,3].forEach(n=>{put(item(n,'blue','circle',{scale:.5+n*.16,rank:n}),n);target(n,n+'번째');});q.explanation='크기를 나란히 비교하면 순서를 알 수 있어.';
    }else if(mode==='rotation'){
      q.prompt='노란 화살표와 같은 방향이 되도록 블록을 돌려 줘.';q.angle=(stage%3+1)*90;q.explanation='블록을 돌리면 모양은 같고 방향이 달라져.';
    }else if(mode==='mirror'){
      q.prompt='거울 선을 사이에 두고 같은 거리에 블록을 놓아 줘.';q.grid=4;q.filled=[0,5,8];q.correctCells=q.filled.map(i=>Math.floor(i/4)*4+3-i%4);q.explanation='거울 선에서 같은 거리의 자리가 짝이야.';
    }else if(mode==='position'){
      q.prompt='파란 집에서 오른쪽, 위쪽으로 한 칸씩 가는 길을 눌러 줘.';q.grid=3;q.path=['6','7','4'];q.explanation='오른쪽 한 칸, 위쪽 한 칸 이동했어.';
    }else if(['length','weight','capacity'].includes(mode)){
      q.prompt={length:'같은 출발선에서 더 긴 막대를 찾아 줘.',weight:'저울에서 더 무거운 쪽을 찾아 줘.',capacity:'가득 담으면 물이 더 많이 들어가는 컵을 찾아 줘.'}[mode];q.correct=stage%2?'left':'right';q.groups=q.correct==='left'?[6,3]:[3,6];q.explanation={length:'끝이 더 멀리 간 막대가 더 길어.',weight:'무거운 쪽 저울 접시가 아래로 내려가.',capacity:'폭이 같으면 더 높은 컵에 물이 많이 들어가.'}[mode];
    }else if(mode==='clock'){
      q.hour=1+stage%12;q.minute=step<5?0:30;q.prompt='시계의 짧은 바늘과 긴 바늘을 보고 같은 시각을 찾아 줘.';q.value=q.hour+':'+(q.minute?'30':'00');target('answer','시각');[q.value,(q.hour%12+1)+':00',q.hour+':'+(q.minute?'00':'30')].forEach((v,i)=>put(item(i,'blue','square',{kind:'number',value:v}),v===q.value?'answer':'none'));q.required=1;q.explanation=q.hour+'시'+(q.minute?' 30분':'');
    }else if(mode==='money'){
      q.value=(2+stage%4)*100;q.prompt='가격표만큼 동전을 계산대에 올려 줘.';target('till','계산대');q.items=Array.from({length:6},(_,i)=>item(i,'yellow','circle',{kind:'coin',value:100}));q.items.forEach(i=>q.expected[i.id]='till');q.required=q.value/100;q.explanation='100원 동전 '+q.required+'개는 '+q.value+'원이야.';
    }else if(mode==='fraction'){
      q.parts=step<5?4:8;q.numerator=1+stage%(q.parts-1);q.prompt='전체 빵을 똑같이 나눈 조각 중 '+q.numerator+'조각을 골라 줘.';q.explanation=q.parts+'조각 중 '+q.numerator+'조각 = '+q.numerator+'/'+q.parts;
    }else if(mode==='area'||mode==='perimeter'){
      q.rows=2+stage%2;q.cols=2+(stage+1)%3;q.value=mode==='area'?q.rows*q.cols:2*(q.rows+q.cols);q.prompt=mode==='area'?'바닥을 덮은 네모 타일은 모두 몇 개일까?':'한 칸이 1인 정원의 테두리 길이를 세어 봐.';target('answer','수 블록');[q.value-2,q.value,q.value+2].forEach(v=>put(item(v,'blue','square',{kind:'number',value:v}),v===q.value?'answer':'none'));q.required=1;q.explanation=mode==='area'?q.rows+' × '+q.cols+' = '+q.value:'('+q.rows+' + '+q.cols+') × 2 = '+q.value;
    }else if(mode==='compose'){
      q.prompt='두 삼각형을 빈자리에 옮겨 지붕을 완성해 줘.';[0,1].forEach(i=>{put(item(i,'yellow','triangle'),i);target(i,'지붕 조각 '+(i+1),item('s','yellow','triangle'));});q.explanation='작은 도형 두 개를 합쳐 큰 모양을 만들었어.';
    }else if(mode==='pairs'){
      q.prompt='빨강·파랑 모자와 동그라미·별 가방! 서로 다른 짝을 모두 만들어 줘.';colors.slice(0,2).forEach(c=>['circle','star'].forEach(s=>{const id=c+'-'+s;put(item(id,c,s,{kind:'toy'}),id);target(id,'새로운 짝',item('s',c,s));}));q.explanation='2가지 색 × 2가지 모양 = 서로 다른 4가지 짝.';
    }else if(mode==='board'){
      q.theme='table';q.required=1;q.prompt='같은 색 또는 같은 모양 네 개가 한 줄이 되게 마지막 블록을 놓아 줘.';q.grid=4;q.board=Array(16).fill(null);const row=stage%4;[0,1,3].forEach((c,i)=>q.board[row*4+c]=item('b'+c,'red',shapes[i]));q.board[(row+1)%4*4]=item('x','blue','triangle');q.items=[item('a','red','star'),item('b','yellow','circle'),item('c','blue','square')];for(let i=0;i<16;i++)if(!q.board[i])target(i,'빈 자리 '+(i+1));q.explanation='한 줄의 모든 블록에 같은 색이나 같은 모양이 있어!';
    }
    q.items=shuffled(q.items,seed);return q;
  }
  function boardWin(board){const lines=[];for(let n=0;n<4;n++){lines.push([0,1,2,3].map(i=>board[n*4+i]));lines.push([0,1,2,3].map(i=>board[i*4+n]));}lines.push([0,5,10,15].map(i=>board[i]),[3,6,9,12].map(i=>board[i]));return lines.some(l=>l.every(Boolean)&&['color','shape'].some(k=>l.every(i=>i[k]===l[0][k])));}
  function accepts(q,id,target){if(q.mode==='board'){const i=+target;if(!Number.isInteger(i)||i<0||i>15||q.board[i])return false;const it=q.items.find(x=>x.id===id);if(!it)return false;const b=q.board.slice();b[i]=it;return boardWin(b);}return q.expected[id]===String(target);}
  function pathNext(a,b){return Number(a.color===b.color)+Number(a.shape===b.shape)===1;}
  function validate(q){if(!q.prompt||new Set(q.items.map(i=>i.id)).size!==q.items.length)return false;if(q.mode==='path')return q.path.slice(1).every((id,i)=>pathNext(q.items.find(x=>x.id===q.path[i]),q.items.find(x=>x.id===id)));if(q.targets.length){const solvable=q.items.filter(i=>q.targets.some(t=>accepts(q,i.id,t.id)));return solvable.length>=(q.required||q.items.length)&&(q.mode==='board'||q.items.every(i=>q.targets.filter(t=>accepts(q,i.id,t.id)).length<=1));}return true;}
  global.MissionModel={make,accepts,boardWin,pathNext,validate,descriptor,thinking,math};
})(window);
