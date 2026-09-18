/* Content and terrain are independent of physics. Coordinates are world pixels. */
var HangulRunner = globalThis.HangulRunner || {};
(function (HR) {
  const lessons = [
    ['한글 숲의 첫 모험', '가나다라마바사아자차카타파하'.split(''), '흩어진 열네 글자를 찾아 별빛 문을 열어 줘!'],
    ['낱말 구름다리', ['나무','바다','오리','나비','사자','모자','포도','기차'], '받침 없는 낱말을 소리 내어 읽어 봐.'],
    ['받침 폭포 계곡', ['산','달','별','문','눈','밤','공','집'], '끝소리가 있는 글자를 찾아보자!'],
    ['우리 동네 탐험', ['학교','가방','우산','연필','공원','친구','시계','가족'], '우리 주변에서 만나는 낱말들이야.'],
    ['두 글자, 세 글자', ['하늘','구름','꽃밭','토끼','자전거','자동차','도서관','놀이터'], '낱말을 천천히 또박또박 읽어 봐.'],
    ['문장을 잇는 숲', ['나는','친구와','함께','공원에서','즐겁게','놀아요'], '모은 낱말을 이어 한 문장을 만들어 봐.'],
    ['마음이 자라는 성', ['고마워','미안해','괜찮아','반가워','도와줄게','사랑해'], '따뜻한 마음을 전하는 말을 모아 보자.']
  ];
  HR.stages = lessons.map(([name, words, story], index) => ({id:index+1, name, words, story, theme:index%3}));
  HR.buildStage = function (id) {
    const d = HR.stages.find(s=>s.id===id) || HR.stages[0];
    const platforms=[], items=[], enemies=[], hazards=[], checkpoints=[{x:60,y:420,id:0}];
    const span=620, groundY=420;
    d.words.forEach((text,i)=>{
      const x=i*span;
      platforms.push({x,y:groundY,w:505,h:300,kind:'ground'});
      if(i%3===1) platforms.push({x:x+505,y:groundY,w:115,h:32,kind:'bridge',oneWay:true});
      platforms.push({x:x+305,y:groundY-126,w:145,h:40,kind:'floating',oneWay:true});
      items.push({id:'letter-'+i,kind:'letter',text,x:x+212,y:groundY-91,w:62,h:62,index:i});
      for(let j=0;j<3;j++) items.push({id:`coin-${i}-${j}`,kind:'coin',x:x+285+j*53,y:groundY-200,w:30,h:36});
      items.push({id:'star-'+i,kind:'star',x:x+365,y:groundY-171,w:32,h:36});
      if(i%3===0) items.push({id:'power-'+i,kind:'power',x:x+310,y:groundY-55,w:40,h:45});
      if(i%3===0) hazards.push({x:x+406,y:groundY-38,w:42,h:38,kind:i%2?'log':'thorn'});
      if(i%3===1) hazards.push({x:x+385,y:groundY-42,w:42,h:42,kind:'crate',origin:x+385,range:23});
      if(i%3===2) enemies.push({x:x+363,y:groundY-44,w:44,h:44,left:x+322,right:x+445,dir:1,speed:36+(d.id-1)*3,kind:i%2?'sprout':'jelly',baseY:groundY-44,phase:i});
      if(i>0 && i%3===0) checkpoints.push({x:x+50,y:groundY,id:i/3});
    });
    const end=d.words.length*span;
    platforms.push({x:end,y:groundY,w:430,h:300,kind:'ground'});
    // The final gap is also a jump: no invisible floor bridges gaps.
    return {...d,length:end+430,platforms,items,enemies,hazards,checkpoints,goal:{x:end+235,y:groundY-170,w:105,h:170}};
  };
})(HangulRunner);
