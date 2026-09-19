(function(H){
 H.registerWorld({id:1,name:'한글 숲',theme:'forest',mode:'run',color:'#278957',description:'달리고 점프하며 첫 글자를 만나요',notes:[523,659,784]},[
 {number:1,name:'한글 숲 입구',words:[...'가나다라'],story:'← → 이동 · ↑ / Space 점프! 가, 나, 다, 라를 찾아요.',gap:65},
 {number:2,name:'깊은 숲',words:[...'마바사아'],story:'움직이는 다리에 올라 높은 글자를 찾아요.',moving:true,gap:120},
 {number:3,name:'고대 숲',words:[...'자차카타파하'],story:'높은 나무다리 너머에 숨은 별이 있어요.',moving:true,secret:true,gap:135},
 {number:4,name:'숲의 수호자',words:[...'가나다라'],story:'보스가 보여 주는 글자를 찾아 별빛을 보내요!',boss:{name:'씨앗지기 모루',style:'forest',attacks:['seed','vine','jump'],questions:[['가','가','나','다'],['나','나','다','라'],['다','다','가','라'],['라','라','가','나']]}}
 ]);
 const previous=H.decorateWorldStage;
 H.decorateWorldStage=s=>{previous?.(s);if(s.worldId!==1)return;
  s.words.forEach((_,i)=>{const x=i*(s.span||650);
   if(s.number>1){const a={x:x+300,y:300,w:180,h:35,kind:'bridge',oneWay:true};if(s.moving)Object.assign(a,{originX:a.x,originY:a.y,motion:{x:35,y:25,speed:1}});s.platforms.push(a);
    if(i%2===1){s.items.find(t=>t.id==='letter-'+i).y=240;s.items.find(t=>t.id==='letter-'+i).x=x+345;}
    s.enemies.push({x:x+430,y:376,w:44,h:44,left:x+380,right:x+500,dir:1,speed:45,kind:'sprout',baseY:376,phase:i});
   }else s.hazards.push({kind:'log',x:x+420,y:395,w:35,h:25});
   if(s.secret){s.platforms.push({x:x+90,y:230,w:150,h:35,kind:'floating',oneWay:true});s.items.push({id:'hidden-'+i,kind:'star',x:x+145,y:187,w:32,h:36});}
  });
 };
})(HangulRunner);
