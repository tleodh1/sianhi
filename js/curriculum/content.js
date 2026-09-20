(function(global){
 const B=global.LearningBank,R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,P=a=>a[Math.floor(Math.random()*a.length)],ctx=['별','공룡','로봇','자동차','사탕','블록','동물','연필'];
 const zone=(title,objective,tags,templates,types=['multiple-choice'])=>({title,objective,tags,templates,types,generator:templates.join('|'),explanation:objective});
 const Z={
  연산:[
   zone('작은 수 탐험','10까지 수를 세고 비교하며 5 이하 덧셈·뺄셈을 이해해요.',['수 세기','비교','5 이하 연산'],['count','compare','tiny']),
   zone('10 만들기','10까지 가르기와 모으기, 덧셈·뺄셈을 익혀요.',['가르기','모으기','10 만들기'],['make10','within10','story10']),
   zone('20 숫자길','20까지 받아올림·받아내림 없는 계산을 해요.',['20까지 수','덧셈','뺄셈'],['within20','tensOnes','story20']),
   zone('두 자리 수 문','100까지 자리값과 받아올림·받아내림 기초를 익혀요.',['자리값','두 자리 수'],['place100','carryIntro','borrowIntro']),
   zone('100 계산성','두 자리 수 덧셈과 뺄셈을 정확히 계산해요.',['100까지 연산'],['add2','sub2','money100']),
   zone('천의 계곡','세 자리 수의 자리값과 덧셈·뺄셈을 익혀요.',['세 자리 수','1000까지 연산'],['place1000','add3','sub3']),
   zone('큰 수 사막','10,000까지 수의 자리값·비교·덧셈·뺄셈을 익혀요.',['큰 수','10000'],['place10000','bigCompare','bigCalc']),
   zone('곱셈 공장','같은 수 묶기와 2단부터 9단까지의 곱셈을 이해해요.',['묶어 세기','곱셈구구'],['groups','times','array']),
   zone('나눗셈 항구','똑같이 나누기와 몇 묶음인지 알아봐요.',['등분제','포함제','곱셈 관계'],['share','grouping','factFamily']),
   zone('연산 챌린지','큰 수 사칙연산과 짧은 생활 문장제를 해결해요.',['혼합 연산','문장제'],['mixed','bigMixed','lifeProblem'])
  ],
  수학:[
   zone('수와 양','수 세기·일대일 대응·크기 비교를 해요.',['수와 양'],['quantity','compare','order']),
   zone('위치와 순서','앞뒤·좌우·서수를 이해해요.',['위치','순서'],['position','ordinal','route']),
   zone('모양 탐험','평면도형의 특징을 찾고 분류해요.',['도형','분류'],['shape','sides','compose']),
   zone('측정 놀이터','길이·높이·무게·들이를 비교해요.',['측정'],['length','weight','capacity']),
   zone('시간과 달력','시각·시간·요일·달력을 읽어요.',['시간','달력'],['clock','elapsed','calendar']),
   zone('돈과 생활','동전과 지폐의 값을 이해하고 계산해요.',['화폐','생활 수학'],['money','change','shopping']),
   zone('규칙과 자료','수·모양 규칙과 표를 읽어요.',['규칙','표'],['sequence','table','classification']),
   zone('분수와 소수','전체와 부분, 간단한 분수와 소수를 이해해요.',['분수','소수'],['fraction','decimal','equivalent']),
   zone('도형의 측정','각도·둘레·넓이·대칭을 탐구해요.',['각도','둘레','넓이','대칭'],['angle','perimeter','area','symmetry']),
   zone('자료 해석','그래프·평균·비와 비율의 기초를 활용해요.',['그래프','평균','비율'],['graph','average','ratio'])
  ],
  '사고력 수학':[
   zone('분류 탐정','같은 점과 다른 점을 찾아 분류해요.',['분류','공통점'],['odd','common','sort'],['picture-choice','multiple-choice']),
   zone('패턴 기차','반복되는 그림과 수의 규칙을 찾아요.',['패턴'],['colorPattern','shapePattern','numberPattern']),
   zone('순서 연구소','사건과 수를 알맞은 순서로 배열해요.',['순서 추론'],['orderStory','numberOrder','beforeAfter']),
   zone('공간 미로','방향·회전·위치를 머릿속으로 바꿔 봐요.',['공간 감각'],['turn','route','mirror']),
   zone('두 조건 탐정','두 가지 조건을 동시에 만족하는 답을 찾아요.',['조건 추론'],['twoClues','logicGrid','exclude']),
   zone('도형 공방','도형을 나누고 합치며 대칭을 완성해요.',['도형 조합','대칭'],['compose','cut','symmetry']),
   zone('논리 다리','필요한 정보와 필요 없는 정보를 구별해요.',['논리','정보 선별'],['usefulInfo','ifThen','ranking']),
   zone('경우의 수 섬','빠뜨리지 않고 가능한 경우를 세어 봐요.',['경우의 수'],['outfits','paths','pairs']),
   zone('자료 추론대','표와 그림 자료에서 숨은 관계를 찾아요.',['자료 추론'],['tableLogic','chartLogic','sequence2']),
   zone('캥거루 챌린지','여러 단계를 거쳐 새로운 방법으로 해결해요.',['다단계 문제 해결'],['multiStep','reverse','constraint'])
  ],
  한글:[
   zone('자음·모음 숲','기본 자음과 모음의 모양과 소리를 구별해요.',['자음','모음'],['consonant','vowel','sound']),
   zone('가나다 마을','기본 자음과 ㅏ가 만나 생기는 음절을 읽어요.',['기본 음절'],['gaSeries','firstSound','syllable']),
   zone('모음 변신길','여러 모음과 자음을 결합한 글자를 읽어요.',['모음 결합'],['vowelFamily','combine','readSyllable']),
   zone('섞어 읽기 광장','배운 음절을 순서 없이 빠르게 알아봐요.',['음절 인식'],['randomSyllable','soundMatch','letterMatch']),
   zone('쌍자음 동굴','ㄲ·ㄸ·ㅃ·ㅆ·ㅉ의 센소리를 구별해요.',['쌍자음'],['doubleInitial','strongSound','doubleWord']),
   zone('복합 모음 호수','ㅐ·ㅔ·ㅘ·ㅙ·ㅚ·ㅝ·ㅞ·ㅟ·ㅢ를 읽어요.',['복합 모음'],['complexVowel','completeVowel','vowelWord']),
   zone('받침 성','기초 받침의 소리를 듣고 글자를 완성해요.',['받침'],['finalSound','completeFinal','finalCompare']),
   zone('생활 낱말 정원','생활 낱말의 뜻과 범주를 이해해요.',['어휘','낱말 완성'],['wordPicture','wordComplete','category']),
   zone('문장 기차','짧은 문장을 자연스러운 순서로 읽어요.',['문장','주어','서술어'],['sentenceMeaning','sentenceOrder','predicate']),
   zone('이야기 독해 왕국','짧은 전래 이야기에서 인물·장소·원인·순서를 찾아요.',['읽기 이해','전래동화'],['storyWho','storyWhere','storyWhy','storyOrder'])
  ],
  영어:[
   zone('Capital ABC','A부터 Z까지 대문자를 알아봐요.',['대문자'],['upper','upperOrder']),
   zone('small abc','a부터 z까지 소문자를 알아봐요.',['소문자'],['lower','lowerOrder']),
   zone('Letter Partners','대문자와 소문자 짝을 연결해요.',['대소문자 대응'],['caseMatch','caseOdd']),
   zone('Sound Forest','글자와 대표적인 첫소리를 연결해요.',['파닉스','첫소리'],['initialSound','soundWord']),
   zone('CVC Lake','짧은 모음이 들어간 CVC 낱말을 읽어요.',['CVC'],['cvcRead','cvcVowel','rhyme']),
   zone('Word Town','색·동물·숫자·가족·음식 낱말을 읽어요.',['생활 어휘'],['vocabMeaning','categoryWord','pictureWord']),
   zone('Word Builder','낱글자를 합치고 빈 글자를 찾아 단어를 완성해요.',['단어 조합'],['spell','missingLetter','blend']),
   zone('Expression Train','I am·I like·This is·It is 표현을 사용해요.',['기초 표현'],['expression','completeSentence']),
   zone('Sentence Garden','짧은 영어 문장의 뜻을 이해해요.',['문장 읽기'],['sentenceMeaning','whoWhat','trueFalse']),
   zone('Dialogue Stars','짧은 대화와 글에서 필요한 정보를 찾아요.',['대화','독해'],['dialogue','reading','sequence'])
  ],
  과학:[
   zone('관찰 숲','오감으로 특징을 관찰하고 비교해요.',['관찰','비교'],['observe','sense','compare']),
   zone('분류 정원','살아 있는 것과 없는 것, 동물과 식물을 분류해요.',['분류','생물'],['living','animalPlant','classify']),
   zone('날씨 마을','날씨와 계절에 따른 생활 모습을 알아봐요.',['날씨','계절'],['weather','season','clothes']),
   zone('물과 물질','고체·액체와 여러 재료의 성질을 비교해요.',['물질','물'],['state','material','float']),
   zone('힘과 자석','밀기·당기기와 자석의 성질을 탐구해요.',['힘','자석'],['force','magnet','motion']),
   zone('빛·소리 연구소','빛·그림자·소리의 특징을 관찰해요.',['빛','그림자','소리'],['shadow','light','sound']),
   zone('생명 성장길','동물과 식물의 성장 과정과 특징을 알아봐요.',['생명','성장'],['growth','lifeCycle','needs']),
   zone('지구와 우주','지구·달·태양과 낮과 밤을 알아봐요.',['지구','달','태양'],['earth','moon','dayNight']),
   zone('생태와 환경','생물과 환경의 관계를 이해해요.',['생태계','환경'],['foodChain','habitat','environment']),
   zone('과학 탐정단','실험의 조건·결과·원인을 자료로 추론해요.',['실험','변인','자료 해석'],['experiment','variable','result'])
  ],
  코딩:[
   zone('방향 명령','앞·왼쪽·오른쪽 명령으로 이동해요.',['명령','방향'],['direction']),
   zone('순서 다리','여러 명령을 순서대로 연결해요.',['순차'],['sequence']),
   zone('긴 순서 길','목표까지 필요한 명령을 계획해요.',['순차','계획'],['longSequence']),
   zone('반복 동굴','같은 명령 묶음을 찾아요.',['패턴','반복'],['pattern']),
   zone('Loop 공장','반복 횟수를 사용해 명령을 줄여요.',['반복'],['loop']),
   zone('조건 마을','만약 조건이 맞으면 행동해요.',['조건'],['condition']),
   zone('조건+반복 성','조건과 반복을 함께 생각해요.',['조건','반복'],['conditionLoop']),
   zone('Event 광장','사건이 일어날 때 실행할 행동을 정해요.',['이벤트'],['event']),
   zone('Debug 연구소','잘못된 명령을 찾고 고쳐요.',['디버깅'],['debug']),
   zone('Algorithm 별','효율적인 명령 순서를 설계해요.',['알고리즘','최단경로'],['algorithm'])
  ],
  한자:[
   zone('그림 한자','자연과 닮은 기초 한자의 뜻을 알아봐요.',['상형자'],['natureChar','pictureChar']),
   zone('수와 크기','숫자와 大·小 한자를 익혀요.',['숫자 한자'],['numberChar','sizeChar']),
   zone('방향 한자','上·下·左·右·中의 뜻을 구별해요.',['방향'],['directionChar','opposite']),
   zone('사람과 가족','사람·몸·가족과 관련된 한자를 익혀요.',['사람','가족'],['personChar','familyChar']),
   zone('자연 마을','하늘·땅·비·돌·밭·숲 한자를 익혀요.',['자연'],['nature2','natureMeaning']),
   zone('학교생활','학교와 생활에서 만나는 한자를 익혀요.',['학교','생활'],['schoolChar','lifeChar']),
   zone('시간 한자','해·달·해마다·먼저와 같은 시간 한자를 익혀요.',['시간'],['timeChar','calendarChar']),
   zone('음과 뜻 연결','한자의 음과 뜻을 함께 연결해요.',['음','뜻'],['soundMeaning','readingChar']),
   zone('한자어 짝','기초 한자 두 글자의 뜻을 합쳐 봐요.',['한자어'],['wordChar','combineChar']),
   zone('한자 챌린지','비슷한 글자와 반대 한자를 종합해 구별해요.',['종합'],['similarChar','oppositeChar','reviewChar'])
  ]
 };
 const curricula=Object.fromEntries(Object.entries(Z).map(([s,z])=>[s,B.makeCurriculum(s,z)]));
 function numOptions(ans,...extras){return [ans,...extras,ans+1,Math.max(0,ans-1),ans+2];}
 function arithmetic(stage,attempt){const ch=Math.floor((stage-1)/10),boost=B.adaptive('연산'),t=P(ctx),seed=stage+attempt*7;let a,b,ans,q,id,ex;
  if(ch===0){a=R(1,Math.max(3,5+boost));b=R(1,Math.max(1,Math.min(5-a,4)));if(stage%3===1){ans=a;q=t+'이 '+a+'개 있어요. 모두 몇 개인가요?';id='count';}else if(stage%3===2){ans=Math.max(a,b);q=a+'와 '+b+' 중 더 큰 수는?';id='compare';}else{ans=a+b;q=a+' + '+b+' = ?';id='tiny';}ex='수를 하나씩 세거나 수직선에서 비교해요.';}
  else if(ch===1){a=R(1,9);b=10-a;ans=stage%2?10:a+b;q=stage%2?a+'와 몇을 모으면 10일까요?':t+' '+a+'개에 '+b+'개를 더하면?';id=stage%2?'make10':'story10';ex=a+' + '+b+' = 10이에요.';}
  else if(ch===2){a=R(10,19);b=R(1,Math.min(9,20-a));if(stage%2){ans=a+b;q=a+' + '+b+' = ?';id='within20';}else{ans=a-b;q=a+' − '+b+' = ?';id='story20';}ex='십의 자리와 일의 자리를 나누어 계산해요.';}
  else if(ch===3){a=R(20,99);if(stage%3===0){ans=Math.floor(a/10);q=a+'에서 십의 자리 숫자는?';id='place100';}else{b=R(2,9);ans=stage%2?a+b:a-b;q=a+(stage%2?' + ':' − ')+b+' = ?';id=stage%2?'carryIntro':'borrowIntro';}ex='자리값을 먼저 보고 계산해요.';}
  else if(ch===4){a=R(20,89);b=R(10,Math.min(49,99-a));ans=stage%2?a+b:a-b;q=a+(stage%2?' + ':' − ')+b+' = ?';id=stage%2?'add2':'sub2';ex='같은 자리끼리 맞추어 계산해요.';}
  else if(ch===5){a=R(120,850);b=R(20,Math.min(149,a-1));ans=stage%2?a+b:a-b;q=a+(stage%2?' + ':' − ')+b+' = ?';id=stage%2?'add3':'sub3';ex='백·십·일의 자리 순서로 계산해요.';}
  else if(ch===6){a=R(1000,8999);b=R(100,999);if(stage%3===0){ans=Math.floor(a/1000);q=a+'의 천의 자리 숫자는?';id='place10000';}else{ans=stage%2?a+b:a-b;q=a+(stage%2?' + ':' − ')+b+' = ?';id='bigCalc';}ex='각 숫자가 나타내는 자리값을 확인해요.';}
  else if(ch===7){a=R(2,9);b=R(2,9);ans=a*b;q=stage%3===0?a+'개씩 '+b+'묶음은 모두 몇 개인가요?':a+' × '+b+' = ?';id=stage%3===0?'groups':'times';ex=a+'를 '+b+'번 더한 값과 같아요.';}
  else if(ch===8){b=R(2,9);a=b*R(2,9);ans=a/b;q=stage%2?t+' '+a+'개를 '+b+'명에게 똑같이 나누면 한 명당 몇 개인가요?':a+' ÷ '+b+' = ?';id=stage%2?'share':'factFamily';ex=ans+' × '+b+' = '+a+'로 확인할 수 있어요.';}
  else{const op=stage%4;a=R(120,9999);b=R(2,49);if(op===0){ans=a+b;q=t+' '+a+'개에 '+b+'개가 더 왔어요. 모두 몇 개인가요?';id='lifeAdd';}else if(op===1){ans=a-b;q=a+' − '+b+' = ?';id='bigMixed';}else if(op===2){a=R(12,99);b=R(2,9);ans=a*b;q=a+' × '+b+' = ?';id='mixedMul';}else{b=R(2,9);ans=R(10,99);a=ans*b;q=a+' ÷ '+b+' = ?';id='mixedDiv';}ex='문장에서 필요한 수와 연산을 먼저 찾아요.';}
  return {templateId:id,q,ans,opts:numOptions(ans,ans+(b||2),Math.abs(ans-(b||2))),explanation:ex};
 }
 const shapes=['원','삼각형','사각형','오각형'],colors=['빨강','파랑','노랑','초록'],animals=['고양이','강아지','토끼','판다'];
 function math(stage,attempt){const ch=Math.floor((stage-1)/10),k=(stage+attempt)%3;let q,ans,opts,id,ex;if(ch===0){const a=R(3,20),b=R(3,20);ans=a>b?String(a):String(b);q=a+'개와 '+b+'개 중 더 많은 쪽의 수는?';opts=[a,b,a+1,Math.max(0,b-1)];id='quantity';ex='수를 각각 세고 크기를 비교해요.';}else if(ch===1){ans=P(['왼쪽','오른쪽','앞','뒤']);q='로봇이 '+ans+'으로 한 칸 이동했어요. 어느 방향인가요?';opts=['왼쪽','오른쪽','앞','뒤'];id='position';ex='기준이 되는 로봇에서 방향을 살펴봐요.';}else if(ch===2){const s=P(shapes),side={원:0,삼각형:3,사각형:4,오각형:5}[s];ans=String(side);q=s+'의 곧은 변은 몇 개인가요?';opts=[side,side+1,Math.max(0,side-1),side+2];id='sides';ex=s+'의 테두리를 따라 세어 봐요.';}else if(ch===3){const a=R(5,30),b=R(5,30);ans=a>b?'첫 번째':'두 번째';q='리본 두 개의 길이는 '+a+'cm, '+b+'cm예요. 더 긴 것은?';opts=['첫 번째','두 번째','같다','알 수 없다'];id='length';ex='cm 수가 큰 쪽이 더 길어요.';}else if(ch===4){const h=R(1,11);ans=h+'시';q='짧은바늘이 '+h+', 긴바늘이 12를 가리켜요. 몇 시인가요?';opts=[ans,((h%12)+1)+'시',h+'시 30분',((h+10)%12+1)+'시'];id='clock';ex='긴바늘이 12이면 정각이에요.';}else if(ch===5){const n=R(2,9);ans=(n*100)+'원';q='100원 동전 '+n+'개의 값은?';opts=[ans,(n*10)+'원',((n+1)*100)+'원',((n-1)*100)+'원'];id='money';ex='100을 '+n+'번 더해요.';}else if(ch===6){const a=R(1,5),d=R(2,5);ans=String(a+d*3);q=[a,a+d,a+d*2,'?'].join(', ')+' 규칙의 다음 수는?';opts=[ans,String(a+d*2+1),String(a+d*4),String(a+d*2)];id='sequence';ex='앞 수에서 '+d+'씩 커져요.';}else if(ch===7){const den=P([2,3,4,5,8]),num=R(1,den-1);ans=num+'/'+den;q='전체 '+den+'조각 중 '+num+'조각을 색칠했어요. 분수로 나타내면?';opts=[ans,(den-num)+'/'+den,num+'/'+(den+1),'1/'+den];id='fraction';ex='색칠한 수를 위에, 전체 조각 수를 아래에 써요.';}else if(ch===8){const w=R(3,12),h=R(2,9);ans=String(2*(w+h))+'cm';q='가로 '+w+'cm, 세로 '+h+'cm인 직사각형의 둘레는?';opts=[ans,String(w*h)+'cm',String(w+h)+'cm',String(2*w+h)+'cm'];id='perimeter';ex='가로와 세로를 각각 두 번 더해요.';}else{const values=[R(4,12),R(4,12),R(4,12),R(4,12)],sum=values.reduce((a,b)=>a+b,0);values[3]+=4-sum%4;ans=String(values.reduce((a,b)=>a+b,0)/4);q=values.join(', ')+'의 평균은?';opts=[ans,String(Number(ans)+1),String(Math.max(0,Number(ans)-1)),String(values[0])];id='average';ex='모두 더한 뒤 자료의 수 4로 나눠요.';}return {templateId:id,q,ans,opts,explanation:ex};}
 function reasoning(stage,attempt){const ch=Math.floor((stage-1)/10),n=stage+attempt,R4=(q,a,o,id,e)=>({templateId:id,q,ans:a,opts:o,explanation:e,questionType:ch<2?'picture-choice':'multiple-choice'});if(ch===0){const odd=P(['★','▲','●','■']),base=P(['🍎','🚗','🐰']);return R4(base+' '+base+' '+odd+' '+base+'에서 다른 것은?',odd,[base,odd,'◆','🌙'],'odd','모양이 하나만 다른 것을 찾아요.');}if(ch===1){const a=P(colors),b=P(colors.filter(x=>x!==a));return R4(a+'·'+b+'·'+a+'·'+b+'·?',a,[a,b,'흰색','검정'],'colorPattern','두 색이 번갈아 나와요.');}if(ch===2)return R4('아침에 일어나기 → 세수하기 → ? → 유치원 가기','아침 먹기',['아침 먹기','잠자기','목욕하기','저녁 먹기'],'orderStory','시간의 흐름을 생각해요.');if(ch===3){const dirs=['↑','→','↓','←'],i=R(0,3);return R4(dirs[i]+' 방향에서 오른쪽으로 한 번 돌면?',dirs[(i+1)%4],dirs,'turn','시계 방향으로 90도 돌려 봐요.');}if(ch===4){const name=P(animals);return R4('네 발이고, 야옹 소리를 내요. 누구일까요?','고양이',animals,'twoClues','두 조건을 모두 만족해야 해요.');}if(ch===5)return R4('정사각형 두 개를 한 변끼리 붙이면 가장 알맞은 모양은?','직사각형',['직사각형','원','삼각형','오각형'],'compose','붙인 뒤 바깥 테두리만 생각해요.');if(ch===6)return R4('민수는 지수보다 크고, 지수는 시안보다 커요. 가장 작은 사람은?','시안',['민수','지수','시안','알 수 없음'],'ranking','크기 관계를 차례로 연결해요.');if(ch===7){const top=R(2,4),bottom=R(2,4);return R4('모자 '+top+'개와 신발 '+bottom+'켤레 중 하나씩 고르는 방법은? ',String(top*bottom)+'가지',[top*bottom+'가지',(top+bottom)+'가지',(top*bottom-1)+'가지',(top+bottom-1)+'가지'],'outfits','각 모자마다 모든 신발을 고를 수 있어 곱해요.');}if(ch===8){const a=R(2,6),b=R(2,6);return R4('표: 빨강 '+a+'개, 파랑 '+b+'개. 모두 몇 개인가요?',String(a+b)+'개',[a+b+'개',Math.abs(a-b)+'개',(a+b+1)+'개',a*b+'개'],'tableLogic','표의 두 값을 더해요.');}const a=R(2,8),b=R(2,8);return R4('상자에 별이 '+a+'개 있었어요. '+b+'개를 더 넣고 3개를 꺼냈어요. 남은 별은?',String(a+b-3)+'개',[a+b-3+'개',a+b+'개',a+b+3+'개',Math.max(0,a-b)+'개'],'multiStep','넣은 것은 더하고 꺼낸 것은 빼요.');}
 const initials=['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],vowels=['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ'],bases=['가','나','다','라','마','바','사','아','자','차','카','타','파','하'],syllables=['겨','무','티','샤','코','브','누','헤','지','료','푸','개','워','의'],words=['학교','가방','자동차','강아지','고양이','하늘','바다','친구','엄마','아빠','공룡','로봇'];
 function korean(stage,attempt){const ch=Math.floor((stage-1)/10),i=(stage+attempt)%14,mc=(q,a,o,id,e,type)=>({templateId:id,q,ans:a,opts:o,explanation:e,questionType:type||'multiple-choice'});if(ch===0){const a=stage%2?initials[i]:vowels[i%vowels.length];return mc('다음 중 '+(stage%2?'자음':'모음')+'은?',a,[a,...(stage%2?vowels:initials).filter(x=>x!==a).slice(i%5,i%5+3)],stage%2?'consonant':'vowel','입 모양과 소리를 함께 떠올려요.');}if(ch===1){const a=bases[i];return mc('「'+a[0]+'」로 시작하는 글자는?',a,[a,bases[(i+3)%14],bases[(i+7)%14],bases[(i+10)%14]],'gaSeries','첫소리가 같은 글자를 찾아요.');}if(ch===2){const rows=['갸','겨','거','고','구','그','기'],a=rows[(stage+attempt)%rows.length];return mc('「'+a+'」를 소리 내어 읽고 같은 글자를 찾아요.',a,[a,...syllables.filter(x=>x!==a).slice(0,3)],'vowelFamily','자음과 모음 소리를 이어서 읽어요.');}if(ch===3){const a=syllables[i];return mc('「'+a+'」와 같은 글자를 찾아요.',a,[a,...syllables.filter(x=>x!==a).slice((i+2)%8,(i+2)%8+3)],'randomSyllable','글자의 첫소리와 모양을 모두 살펴봐요.');}if(ch===4){const set=['까','따','빠','싸','짜'],a=P(set);return mc('센소리 글자는?',a,[a,'가','다','바'],'doubleInitial','쌍자음은 더 힘주어 소리 내요.');}if(ch===5){const set=['개','게','과','괘','괴','궈','궤','귀','긔'],a=P(set);return mc('복합 모음 글자를 찾아요.',a,[a,'가','고','구'],'complexVowel','모음의 모양을 살펴보고 기본 모음과 구별해요.');}if(ch===6){const a=P(['각','간','갈','감','갑','강']);return mc('받침이 있는 글자는?',a,[a,'가','나','마'],'finalSound','글자 아래의 받침을 확인해요.');}if(ch===7){const a=words[(stage+attempt)%words.length];return mc('생활 낱말 「'+a+'」를 찾아요.',a,[a,...words.filter(x=>x!==a).slice(i%6,i%6+3)],'wordPicture','글자를 끝까지 읽고 뜻을 떠올려요.','word-picture');}if(ch===8){const sentences=['강아지가 달려요.','하늘에 구름이 있어요.','나는 책을 읽어요.','친구와 공을 차요.'];const a=P(sentences);return mc('누가 먼저 나오도록 바르게 배열한 문장은?',a,[a,'달려요 강아지가.','책을 나는요 읽어.','구름 하늘 있어가.'],'sentenceOrder','누가 무엇을 하는지 자연스러운 순서를 찾아요.');}const stories=[{t:'흥부는 다친 제비를 정성껏 돌보았어요. 제비는 봄이 되자 다시 날아갔어요.',q:'누가 제비를 돌보았나요?',a:'흥부',o:['흥부','놀부','토끼','자라']},{t:'토끼는 자라를 따라 바닷속 궁전으로 갔어요. 위험을 알아챈 토끼는 지혜롭게 육지로 돌아왔어요.',q:'토끼는 어디로 갔나요?',a:'바닷속 궁전',o:['바닷속 궁전','학교','산꼭대기','시장']},{t:'오누이는 호랑이를 피해 하늘로 올라갔어요. 오빠는 달이 되고 동생은 해가 되었어요.',q:'오누이는 왜 하늘로 올라갔나요?',a:'호랑이를 피하려고',o:['호랑이를 피하려고','놀러 가려고','별을 따려고','비를 맞으려고']}],s=P(stories);return mc(s.t+'\n'+s.q,s.a,s.o,'storyWhy','글에서 인물·장소·까닭을 나타내는 문장을 다시 찾아요.','reading');}
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),cvc=['cat','dog','sun','run','map','pig','hat','bed','fox','cup'],vocab={red:'빨강',blue:'파랑',dog:'강아지',cat:'고양이',one:'하나',two:'둘',mom:'엄마',dad:'아빠',milk:'우유',rice:'밥'};
 function english(stage,attempt){const ch=Math.floor((stage-1)/10),i=(stage+attempt)%26,a=alphabet[i],pick=(q,ans,opts,id,e)=>({templateId:id,q,ans,opts,explanation:e});if(ch===0)return pick('대문자 '+a+'를 찾아요.',a,[a,...alphabet.filter(x=>x!==a).slice(i%10,i%10+3)],'upper','대문자의 모양을 살펴봐요.');if(ch===1)return pick('소문자 '+a.toLowerCase()+'를 찾아요.',a.toLowerCase(),[a.toLowerCase(),...alphabet.filter(x=>x!==a).slice(i%10,i%10+3).map(x=>x.toLowerCase())],'lower','소문자의 모양을 살펴봐요.');if(ch===2)return pick(a+'의 소문자 짝은?',a.toLowerCase(),[a.toLowerCase(),...alphabet.filter(x=>x!==a).slice(i%10,i%10+3).map(x=>x.toLowerCase())],'caseMatch','같은 알파벳의 대문자와 소문자를 연결해요.');if(ch===3){const w=P(['apple','ball','cat','dog','fish','goat','hat','jam']);return pick(w+'의 첫소리는?',w[0],[w[0],...['b','c','d','f','g','h','j'].filter(x=>x!==w[0]).slice(0,3)],'initialSound','단어의 첫 글자 소리를 들어요.');}if(ch===4){const w=P(cvc);return pick(w[0]+' _ '+w[2]+'에 들어갈 모음은?',w[1],[w[1],...['a','e','i','o','u'].filter(x=>x!==w[1]).slice(0,3)],'cvcVowel','가운데 짧은 모음 소리를 들어요.');}if(ch===5){const keys=Object.keys(vocab),w=P(keys);return pick(w+'의 뜻은?',vocab[w],[vocab[w],...keys.filter(x=>x!==w).slice(0,3).map(x=>vocab[x])],'vocabMeaning','낱말의 소리와 뜻을 연결해요.');}if(ch===6){const w=P(cvc),blank=R(0,2);return pick(w.slice(0,blank)+'_'+w.slice(blank+1),w[blank],[w[blank],...alphabet.map(x=>x.toLowerCase()).filter(x=>x!==w[blank]).slice(0,3)],'missingLetter','앞뒤 소리를 이어 단어를 완성해요.');}if(ch===7){const pairs=[['I ___ happy.','am'],['I ___ cats.','like'],['This ___ a ball.','is'],['It ___ red.','is']],x=P(pairs);return pick(x[0],x[1],[x[1],'are','be','likes'],'expression','주어와 알맞은 표현을 연결해요.');}if(ch===8){const pairs=[['The cat is blue.','고양이는 파란색이에요.'],['I like apples.','나는 사과를 좋아해요.'],['This is my dad.','이분은 우리 아빠예요.']],x=P(pairs);return pick(x[0]+' 뜻은?',x[1],[x[1],'나는 강아지를 좋아해요.','사과가 파란색이에요.','우리 엄마는 어디에 있나요?'],'sentenceMeaning','아는 낱말을 먼저 찾고 문장 전체 뜻을 생각해요.');}const x=P([{q:'A: What is this? B: It is a cat. 무엇에 대한 대화인가요?',a:'고양이',o:['고양이','사과','학교','가족']},{q:'Tom has a red ball. 공의 색은?',a:'빨강',o:['빨강','파랑','노랑','초록']}]);return pick(x.q,x.a,x.o,'dialogue','대화나 문장에서 묻는 정보를 찾아요.');}
 function science(stage,attempt){const ch=Math.floor((stage-1)/10),items=[['나무','살아 있음'],['돌','살아 있지 않음'],['강아지','살아 있음'],['연필','살아 있지 않음']],pick=(q,a,o,id,e,type)=>({templateId:id,q,ans:a,opts:o,explanation:e,questionType:type||'multiple-choice'});if(ch===0)return pick('향기를 알아보는 데 주로 사용하는 감각은?','후각',['후각','시각','청각','촉각'],'sense','코로 냄새를 맡는 감각이 후각이에요.');if(ch===1){const x=P(items);return pick(x[0]+'은/는 어떤 것인가요?',x[1],[x[1],...items.map(y=>y[1]).filter(y=>y!==x[1]),'알 수 없음','둘 다'],'living','스스로 자라고 필요한 것을 얻는지 살펴봐요.');}if(ch===2){const season=P([['겨울','두꺼운 외투'],['여름','반소매'],['비 오는 날','우산']]);return pick(season[0]+'에 알맞은 것은?',season[1],[season[1],'수영복만 입기','눈썰매','선풍기 끄기'],'weather','날씨에 안전하고 알맞은 생활을 골라요.');}if(ch===3)return pick('컵에 담긴 물의 상태는?','액체',['액체','고체','기체만','생물'],'state','물은 담는 그릇에 따라 모양이 달라지는 액체예요.');if(ch===4)return pick('자석에 붙는 물체는?','쇠못',['쇠못','종이','나무젓가락','고무공'],'magnet','철로 된 물체는 자석에 붙어요.');if(ch===5)return pick('그림자가 생기려면 필요한 것은?','빛과 물체',['빛과 물체','냄새와 바람','소리와 물','자석과 철'],'shadow','빛이 물체에 막히면 뒤쪽에 그림자가 생겨요.');if(ch===6)return pick('씨앗이 싹튼 다음에 주로 나타나는 것은?','잎',['잎','달','돌','눈사람'],'growth','싹이 자라 줄기와 잎이 생겨요.');if(ch===7)return pick('낮과 밤이 생기는 것과 가장 관련 깊은 것은?','지구의 자전',['지구의 자전','비가 내림','자석의 힘','식물의 성장'],'dayNight','지구가 스스로 돌면서 햇빛을 받는 곳이 달라져요.');if(ch===8)return pick('물고기가 살기에 가장 알맞은 곳은?','물이 있는 하천',['물이 있는 하천','마른 사막','뜨거운 용암','진공 우주'],'habitat','생물에게 필요한 물·공기·먹이가 있는 환경을 찾아요.');return pick('콩 세 화분 중 물의 양만 다르게 하려면 같게 해야 할 조건은?','빛과 흙의 양',['빛과 흙의 양','물의 양','결과','콩의 키'],'variable','비교하려는 조건 하나만 다르게 하고 나머지는 같게 해요.','experiment');}
 const chars=[['日','해','일'],['月','달','월'],['山','산','산'],['川','내','천'],['木','나무','목'],['火','불','화'],['水','물','수'],['土','흙','토'],['人','사람','인'],['口','입','구'],['大','큰','대'],['小','작은','소'],['上','위','상'],['下','아래','하'],['左','왼쪽','좌'],['右','오른쪽','우'],['中','가운데','중'],['父','아버지','부'],['母','어머니','모'],['子','아이','자'],['學','배울','학'],['校','학교','교'],['年','해','년'],['時','때','시']];
 function hanja(stage,attempt){const ch=Math.floor((stage-1)/10),pool=ch<2?chars.slice(0,14):ch<4?chars.slice(8,20):chars,x=P(pool),mode=(stage+attempt)%3;if(mode===0)return {templateId:'meaningChar',q:x[1]+'을 뜻하는 한자는?',ans:x[0],opts:[x[0],...chars.filter(y=>y[0]!==x[0]).slice((stage+attempt)%15,(stage+attempt)%15+3).map(y=>y[0])],explanation:x[0]+'은/는 '+x[1]+'이라는 뜻이에요.'};if(mode===1)return {templateId:'charMeaning',q:x[0]+'의 뜻은?',ans:x[1],opts:[x[1],...chars.filter(y=>y[1]!==x[1]).slice((stage+attempt)%15,(stage+attempt)%15+3).map(y=>y[1])],explanation:x[0]+'의 뜻은 '+x[1]+'이에요.'};return {templateId:'soundMeaning',q:x[0]+'의 음은?',ans:x[2],opts:[x[2],...chars.filter(y=>y[2]!==x[2]).slice((stage+attempt)%15,(stage+attempt)%15+3).map(y=>y[2])],explanation:x[0]+'은/는 「'+x[2]+'」라고 읽어요.'};}
 const generators={연산:arithmetic,수학:math,'사고력 수학':reasoning,한글:korean,영어:english,과학:science,한자:hanja};
 function question(subject,stage){const info=curricula[subject][stage-1],fn=generators[subject]||reasoning;return B.generate(subject,stage,attempt=>({...info,...(subject==='한글'&&B.koreanQuestion?B.koreanQuestion(stage,attempt,fn):fn(stage,attempt)),learningObjective:info.learningObjective,difficulty:Math.max(1,Math.min(10,info.difficulty+B.adaptive(subject))),conceptTags:info.conceptTags,questionPool:info.questionPool}));}
 global.SianCurriculum={curricula,question,zones:Z};
})(window);
