(function(H){
 H.registerWorld({id:1,name:'한글 숲',theme:'forest',mode:'run',color:'#278957',description:'달리고 점프하며 첫 글자를 만나요',notes:[523,659,784]},[
  {number:1,name:'한글 숲 입구',words:[...'가나다라'],story:'이동과 점프를 익히고 별빛 신호기까지 모험해요.',span:950,gap:70,layout:'tutorial'},
  {number:2,name:'깊은 숲',words:[...'마바사아'],story:'적을 밟고 보상 블록 속 글자를 찾아요.',span:1100,moving:true,gap:105,layout:'blocks'},
  {number:3,name:'고대 숲',words:[...'자차카타파하'],story:'높은 길과 움직이는 발판, 숨은 별길을 탐색해요.',span:1000,moving:true,secret:true,gap:125,layout:'vertical'},
  {number:4,name:'숲의 수호자',words:[...'가나다라'],story:'숲 모험을 마치고 수호괴수가 기다리는 성으로 향해요.',span:1100,gap:115,layout:'boss-run',boss:{name:'씨앗지기 모루',style:'forest',attacks:['seed','vine','jump'],questions:[['가','가','나','다'],['나','나','다','라'],['다','다','가','라'],['라','라','가','나']]}}
 ]);
 const previous=H.decorateWorldStage;
 H.decorateWorldStage=s=>{previous?.(s);if(s.worldId!==1)return;const span=s.span;
  s.words.forEach((_,i)=>{const x=i*span,letter=s.items.find(t=>t.id==='letter-'+i);letter.x=x+210+(i%2)*90;
   // Section A-E alternate between safe lower paths and optional elevated reward paths.
   s.platforms.push({x:x+115,y:332-(i%2)*34,w:155,h:28,kind:'floating',oneWay:true});
   if(s.number>=2){const moving={x:x+545,y:285-(i%2)*45,w:170,h:30,kind:'bridge',oneWay:true};if(s.moving)Object.assign(moving,{originX:moving.x,originY:moving.y,motion:{x:i%2?48:24,y:i%2?20:42,speed:.72+i*.05}});s.platforms.push(moving);}
   const letterReward=i===1&&s.number>1,rewardId=letterReward?`letter-${i}`:`block-reward-${i}`;const rowY=265-(i%2)*44;for(let j=0;j<3;j++)s.blocks.push({id:`block-${i}-${j}`,x:x+315+j*58,y:rowY,w:54,h:50,kind:j===0?'breakable':j===1?'reward':'hard',fragile:s.number===1&&i===0,rewardId:j===1?rewardId:null,revealed:true});
   if(s.number>=2&&i%2===1)s.blocks.push({id:`rolling-wall-${i}`,x:x+820,y:370,w:54,h:50,kind:'breakable',fragile:false,revealed:true});
   if(letterReward)letter.contained=true;else s.items.push({id:rewardId,kind:'coin',x:0,y:0,w:30,h:36,contained:true});
   const level=s.number,mainKind=level===1?'berry-bandit':level===2?'seed-shell':level===3?(i%2?'pipe-snapper':'seed-shell'):(i%3===0?'fire-imp':i%3===1?'pipe-snapper':'seed-shell');
   if(i===0||level>=2)s.enemies.push({id:`walker-${i}`,x:x+480,y:376,w:48,h:48,left:x+420,right:x+650,dir:1,speed:42+level*7,kind:level===1?'berry-bandit':i%2?'berry-bandit':mainKind,baseY:376,phase:i,state:'walk',level,hp:level>=4?2:1,flying:level===1&&i%2===1});
   if(i>0)s.enemies.push({id:`enemy-${i}`,x:x+690,y:376,w:52,h:48,left:x+610,right:x+span-70,dir:-1,speed:38+level*6,kind:mainKind,baseY:376,phase:i,state:'walk',armored:mainKind==='seed-shell',rollSpeed:330+level*18,level,hp:level>=3&&mainKind!=='seed-shell'?2:1});
   if(level>=3&&i%2===0)s.enemies.push({id:`ambush-${i}`,x:x+790,y:388,w:46,h:50,left:x+790,right:x+790,dir:-1,speed:0,kind:'pipe-snapper',baseY:408,phase:i+2,state:'ambush',level,hp:level>=4?2:1});
   if(s.number===1&&i<2)s.hazards.push({kind:'log',x:x+690,y:395,w:36,h:25});
   if(s.secret&&i%2===1){s.blocks.push({id:`hidden-${i}`,x:x+120,y:205,w:54,h:50,kind:'reward',hidden:true,revealed:false,rewardId:`secret-star-${i}`});s.items.push({id:`secret-star-${i}`,kind:'star',x:0,y:0,w:34,h:38,contained:true});s.platforms.push({x:x+70,y:255,w:175,h:28,kind:'floating',oneWay:true});}
   if(i>0&&i%2===0)s.checkpoints.push({id:10+i,x:x+45,y:420});
  });
  // The final challenge always leaves a generous landing area for young players.
  const fx=s.length-650;s.platforms.push({x:fx,y:335,w:180,h:28,kind:'bridge',oneWay:true});s.items.push({id:'final-bonus',kind:'star',x:fx+72,y:280,w:34,h:38});
 };
})(HangulRunner);
