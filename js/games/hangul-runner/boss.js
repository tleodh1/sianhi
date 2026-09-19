(function(H){
 const hit=H.overlaps;
 H.prepareBoss=function(stage){if(!stage.boss)return stage;
  stage.length=Math.max(stage.length,stage.words.length*650+500);stage.goal.x=stage.length-170;
  stage.items=stage.items.filter(i=>i.kind!=='letter');
  stage.words.forEach((answer,i)=>{const x=360+i*650,y=stage.mode==='run'?330:145+(i%3)*80;
   stage.items.push({id:'letter-'+i,index:i,kind:'letter',text:answer,x,y,w:62,h:62});
   const q=stage.boss.questions[i],wrong=q.slice(2);
   wrong.forEach((text,j)=>stage.items.push({id:`decoy-${i}-${j}`,question:i,kind:'decoy',text,x:x+105+j*100,y:y+(j?70:-65),w:58,h:58}));
  });return stage;
 };
 H.tickBoss=function(e,dt){if(!e.boss)e.boss={hp:e.stage.words.length,maxHp:e.stage.words.length,question:0,attackClock:1.6,name:e.stage.boss.name};
  const b=e.boss;b.question=e.letterCount;b.attackClock-=dt;e.answerCooldown=Math.max(0,e.answerCooldown-dt);
  for(const d of e.stage.items.filter(i=>i.kind==='decoy'&&!e.collected.has(i.id))){if(d.question===b.question&&hit(e.player,d)&&e.answerCooldown<=0){e.collected.add(d.id);e.answerCooldown=1;e.damage();e.emit('wrong',{item:d});}}
  if(b.attackClock<=0&&b.hp>0){b.attackClock=Math.max(.8,2.2-b.question*.2);const fromRight=e.player.x+e.viewport*.65;e.projectiles.push({x:fromRight,y:70+Math.random()*340,w:34,h:34,vx:-130-b.question*18,kind:e.stage.boss.style});e.emit('bossAttack');}
  e.projectiles=e.projectiles.filter(p=>{p.x+=p.vx*dt;if(hit(e.player,p)){e.damage();return false;}return p.x>e.cameraX-80;});
  b.hp=Math.max(0,b.maxHp-e.letterCount);
 };
})(HangulRunner);
