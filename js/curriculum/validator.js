/* Semantic checks run before finalization and immediately before display. */
(function(B){
 const consonants='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ',vowels='ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
 const final=x=>/^[가-힣]$/.test(x)&&(x.charCodeAt(0)-44032)%28!==0;
 function predicate(q){switch(q.category||q.templateId){case 'consonant':return x=>x.length===1&&consonants.includes(x);case 'vowel':return x=>x.length===1&&vowels.includes(x);case 'finalSound':return final;case 'doubleInitial':return x=>/^[가-힣]$/.test(x)&&[1,4,8,10,13].includes(Math.floor((x.charCodeAt(0)-44032)/588));case 'complexVowel':return x=>/^[가-힣]$/.test(x)&&[1,3,5,7,9,10,11,14,15,16,19].includes(Math.floor((x.charCodeAt(0)-44032)%588/28));case 'syllableCount':return x=>/^[가-힣]+$/.test(x)&&[...x].length===q.count;case 'seaAnimal':return x=>['고래','상어','문어','조개','해파리','새우'].includes(x);default:return q.semanticAnswers?x=>q.semanticAnswers.includes(x):x=>x===q.ans;}}
 function validate(q){const errors=[];if(!q.q||!q.ans||!q.explanation||!q.category||!q.difficulty)errors.push('metadata');if(q.questionType==='HANGUL_TRACING')return {valid:!errors.length&&!!window.HangulTrace?.paths(q.ans).length,errors};if(!Array.isArray(q.opts)||q.opts.length!==4||new Set(q.opts.map(x=>String(x).normalize('NFC').trim())).size!==4)errors.push('choices');const validCorrectChoices=(q.opts||[]).filter(predicate(q));if(validCorrectChoices.length!==1||validCorrectChoices[0]!==q.ans)errors.push('semantic-answer');return {valid:!errors.length,errors,validCorrectChoices};}
 B.validateQuestion=validate;B.hangulRules={consonants,vowels,final};
})(LearningBank);
