(function(global){
 function mount(host,subject,stage,back){
  const header=document.createElement('div');header.className='learningHeader';
  const b=document.createElement('button');b.type='button';b.className='learningBack';b.textContent='← 학습 월드';b.onclick=back;
  const badge=document.createElement('div');badge.className='learningProgress';badge.setAttribute('aria-label',subject+' '+stage+'/100');
  const title=document.createElement('span');title.textContent=subject;const count=document.createElement('strong');count.textContent=stage+'/100';badge.append(title,count);
  const close=document.createElement('button');close.type='button';close.className='learningClose';close.textContent='×';close.setAttribute('aria-label','학습 닫기');close.onclick=closeGame;
  header.append(b,badge,close);host.replaceWith(header);return header;
 }
 global.LearningHeader={mount};
})(window);
