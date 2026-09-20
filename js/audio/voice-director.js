/* Display text and spoken scripts are separate. Content rules remain in curriculum models. */
(function(g){
 const ko=(spokenText,style='guide')=>({text:spokenText,spokenText,lang:'ko-KR',style});
 const feedback={success:['맞았어!','그래, 바로 그거야!','와, 찾았네!','정답! 잘했어!','멋진데?'],retry:['그림을 천천히 살펴보자.','한 번 더 생각해 볼까?','다른 방법으로 찾아볼까?'],stroke:['좋아. 다음 획!','잘하고 있어. 다음 획으로 가 보자.'],chapter:['오늘 배울 내용 완료! 잘했어!'],streak:['세 문제 연속 정답! 멋진데?']};const counts={};let streak=0;
 const jamo={'ㄱ':'기역','ㄴ':'니은','ㄷ':'디귿','ㄹ':'리을','ㅁ':'미음','ㅂ':'비읍','ㅅ':'시옷','ㅇ':'이응','ㅈ':'지읒','ㅊ':'치읓','ㅋ':'키읔','ㅌ':'티읕','ㅍ':'피읖','ㅎ':'히읗','ㄲ':'쌍기역','ㄸ':'쌍디귿','ㅃ':'쌍비읍','ㅆ':'쌍시옷','ㅉ':'쌍지읒','ㅏ':'아','ㅑ':'야','ㅓ':'어','ㅕ':'여','ㅗ':'오','ㅛ':'요','ㅜ':'우','ㅠ':'유','ㅡ':'으','ㅣ':'이','ㅐ':'애','ㅔ':'에','ㅚ':'외','ㅟ':'위','ㅘ':'와','ㅝ':'워','ㅙ':'왜','ㅞ':'웨','ㅢ':'의'};
 function cue(type){const pool=feedback[type]||feedback.success;return ko(pool[(counts[type]||0)%pool.length],type==='retry'?'encourage':'celebrate');}
 function nextCue(type){const p=cue(type);counts[type]=(counts[type]||0)+1;return p;}
 function lesson(subject,displayText,context={}){let parts;
  if(subject==='과학')parts=[ko('어떻게 될까? 직접 살펴보자!','curious'),ko(displayText,'curious')];
  else if(subject==='사고력 수학')parts=[ko('장난감 친구들을 잘 봐.'),ko(displayText,'rule'),ko('천천히 움직여 보자.','encourage')];
  else if(subject==='수학'||subject==='연산')parts=[ko('그림을 잘 봐.'),ko(displayText,'rule')];
  else if(subject==='한글')parts=[ko(displayText,'articulate')];
  else parts=[ko(displayText)];
  return {displayText,spokenText:parts,subject,...context};
 }
 function prepare(parts){return parts.map(p=>{let text=p.spokenText||p.text;if(p.lang!=='en-US'){text=String(text).replace(/[ㄱ-ㅎㅏ-ㅣ]/g,c=>jamo[c]||c);}return {...p,text};});}
 function respond(type,stage){if(type==='success'){streak++;if(stage&&stage%10===0){g.SianAudio?.effect('worldClear');return nextCue('chapter');}if(streak%3===0){g.SianAudio?.effect('wordComplete');return nextCue('streak');}}else if(type==='retry')streak=0;return nextCue(type);}
 function hanja(ch){const known={山:'뫼 산',水:'물 수',日:'날 일',月:'달 월',木:'나무 목',火:'불 화',川:'내 천'};return [ko(known[ch.character]||ch.meaning+' '+ch.reading,'articulate'),ko(ch.meaning+'을 뜻하는 글자야.','guide'),ko('시작점부터 천천히 써 볼까?','encourage')];}
 g.VoiceDirector={lesson,prepare,respond,cue:nextCue,hanja,feedback,jamo};
})(window);
