/* Deterministic simulation: no DOM, timers, storage, or animation ownership here. */
(function(HR){
  const hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  HR.overlaps=hit;
  HR.PLAYER_FORMS={small:{w:34,h:64},big:{w:46,h:96},star_power:{w:46,h:96}};
  // Both simulation and renderer use the same sole, never the atlas cell bottom.
  HR.playerRenderBounds=(p,s,height=p.h)=>{const sole=s.sole??s.h,scale=height/sole;return {x:p.x+p.w/2-s.w*scale/2,y:p.y+p.h-height,w:s.w*scale,h:s.h*scale,feet:p.y+p.h};};
  HR.Engine=class {
    constructor(stage,options={}) {
      this.stage=stage; this.onEvent=options.onEvent||(()=>{}); this.viewport=options.viewport||960;
      this.player={x:60,y:348,w:38,h:72,velocityX:0,velocityY:0,gravity:1500,jumpForce:650,isGrounded:true,hp:3,powerState:'small',facing:1,pose:'idle',invincible:0};
      this.collected=new Set();this.coins=0;this.stars=0;this.elapsed=0;this.cameraX=0;this.checkpoint=stage.checkpoints[0];this.deaths=0;this.combo=0;this.comboTime=0;this.enemyShots=[];this.projectiles=[];
      this.status='playing';this.jumpHeld=false;this.coyote=.1;this.jumpBuffer=0;this.poseTime=0;this.particles=[];this.goalHint=0;this.deathTimer=0;this.fireCooldown=0;this.events={};
    }
    emit(type,data={}) {this.events[type]=(this.events[type]||0)+1;this.onEvent({type,...data});}
    setForm(form){const p=this.player,shape=HR.PLAYER_FORMS[form],feet=p.y+p.h,center=p.x+p.w/2,next={x:center-shape.w/2,y:feet-shape.h,...shape};
      if(form==='big'&&p.powerState==='small'&&[...this.stage.platforms.filter(a=>!a.oneWay),...(this.stage.blocks||[]).filter(b=>!b.removed&&(!b.hidden||b.revealed))].some(a=>hit(next,a))){p.pendingGrowth=true;return false;}
      p.powerState=form;Object.assign(p,next);return true;}
    grow(){const p=this.player;if(p.powerState!=='small')return false;const old=p.h;if(!this.setForm('big'))return false;p.pendingGrowth=false;p.growthFrom=old;p.growthTime=.6;p.invincible=Math.max(p.invincible,.7);this.setPose('power-up',.6);this.burst(p.x+p.w/2,p.y+p.h/2);this.emit('growth');return true;}
    gainPowerStar(){const p=this.player;if(p.powerState==='small'){this.grow();this.emit('powerStarStep',{state:'big'});return;}if(p.powerState!=='star_power'){this.setForm('star_power');p.invincible=Math.max(p.invincible,.65);this.setPose('power-up',.65);this.burst(p.x+p.w/2,p.y+p.h*.45);this.emit('starPower',{state:'star_power'});}else this.emit('starPowerRefresh',{state:'star_power'});}
    fireStar(input={}){const p=this.player;if(p.powerState!=='star_power'||this.fireCooldown>0||this.projectiles.filter(q=>q.kind==='star-power').length>=3||this.status!=='playing')return false;let dx=p.facing,dy=0;if(this.freeMotion&&(input.jump||input.down)){dy=input.jump?-1:1;dx=input.left?-1:input.right?1:0;}const length=Math.max(1,Math.hypot(dx,dy));dx/=length;dy/=length;const speed=470,w=28,h=28;this.projectiles.push({kind:'star-power',team:'player',owner:'player',damage:1,direction:{x:dx,y:dy},speed,lifetime:1.7,x:p.x+p.w/2+dx*24-w/2,y:p.y+p.h*.38+dy*20-h/2,w,h,vx:dx*speed,vy:dy*speed,life:1.7});this.fireCooldown=.48;this.setPose('power-up',.16);this.emit('starShot',{direction:{x:dx,y:dy}});return true;}
    get playerState(){return this.status==='dead'?'DEAD':this.player.invincible>0?'INVINCIBLE_TEMP':this.player.powerState.toUpperCase();}
    setPose(p,time=0){this.player.pose=p;this.poseTime=time;}
    respawn(){const p=this.player;this.setForm('small');p.pendingGrowth=false;p.flight=false;p.flightTime=0;p.x=this.checkpoint.x;p.y=this.checkpoint.y-p.h;p.velocityX=p.velocityY=0;p.hp=Math.max(1,p.hp);p.isGrounded=true;p.invincible=2;p.powerState='small';this.projectiles=[];this.fireCooldown=0;this.status='playing';this.jumpBuffer=0;this.setPose('idle');this.emit('respawn');}
    die(){if(this.status!=='playing')return;this.deaths++;this.status='dead';this.deathTimer=.85;this.player.velocityX=0;this.player.velocityY=-210;this.player.flight=false;this.player.flightTime=0;this.player.pendingGrowth=false;this.setPose('dead');this.emit('death');}
    fatalFall(){if(this.status!=='playing')return;this.player.hp=Math.max(0,this.player.hp-1);this.die();}
    damage(lethalSmall=false){const p=this.player;if(p.invincible>0||this.status!=='playing')return;
      if(p.powerState==='big'||p.powerState==='star_power'){const lost=p.powerState;this.setForm('small');this.projectiles=this.projectiles.filter(q=>q.kind!=='star-power');this.setPose('small',.4);if(lost==='star_power')this.emit('powerLost');this.emit('shrink',{from:lost});}
      else {p.hp=Math.max(0,p.hp-1);this.setPose('hurt',.4);this.emit('hurt');if(lethalSmall)this.die();}
      p.invincible=1.4;if(p.hp<=0)this.die();
    }
    returnToMissing(){const m=this.stage.items.find(i=>i.kind==='letter'&&!this.collected.has(i.id));if(!m)return;this.checkpoint=[...this.stage.checkpoints].reverse().find(c=>c.x<=m.x)||this.stage.checkpoints[0];this.respawn();}
    burst(x,y){for(let n=0;n<12;n++)this.particles.push({x,y,vx:Math.cos(n*Math.PI/6)*100,vy:Math.sin(n*Math.PI/6)*100-60,life:.65});}
    tickPlayerProjectiles(dt){this.projectiles=this.projectiles.filter(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;q.lifetime=q.life;if(q.life<=0||q.x<-80||q.x>this.stage.length+80||q.y<-100||q.y>(this.stage.killY||720)+80)return false;
      if(this.boss&&HR.hitBossProjectile&&HR.hitBossProjectile(this,q))return false;
      for(const enemy of this.stage.enemies){if(enemy.defeated||enemy.retracted||!hit(q,enemy))continue;if(enemy.projectileShield){enemy.hitTime=.25;this.emit('enemyShield',{enemy,projectile:q});return false;}enemy.hp=(enemy.hp||1)-(q.damage||1);enemy.hitTime=.38;this.burst(q.x+q.w/2,q.y+q.h/2);if(enemy.hp<=0){enemy.defeated=true;enemy.defeatTime=.55;this.coins++;this.emit('enemyStarDefeat',{enemy,projectile:q});}else this.emit('enemyStarHit',{enemy,hp:enemy.hp,projectile:q});return false;}
      const solids=[...this.stage.platforms.filter(a=>!a.oneWay),...(this.stage.blocks||[]).filter(b=>!b.removed&&(!b.hidden||b.revealed))];if(solids.some(a=>hit(q,a)))return false;return true;});}
    step(dt,input={}) {
      dt=Math.min(.025,Math.max(0,dt));if(this.status==='clear'||this.status==='paused')return;
      this.particles=this.particles.filter(v=>{v.x+=v.vx*dt;v.y+=v.vy*dt;v.vy+=130*dt;v.life-=dt;return v.life>0;});for(const item of this.stage.items)item.pop=Math.max(0,(item.pop||0)-dt);this.comboTime=Math.max(0,this.comboTime-dt);if(!this.comboTime)this.combo=0;
      if(this.status==='dead'){this.player.velocityY+=680*dt;this.player.y+=this.player.velocityY*dt;this.deathTimer-=dt;if(this.deathTimer<=0){if(this.player.hp<=0)this.player.hp=3;this.respawn();}return;}
      this.elapsed+=dt;const p=this.player;if(p.pendingGrowth)this.grow();p.growthTime=Math.max(0,(p.growthTime||0)-dt);this.fireCooldown=Math.max(0,this.fireCooldown-dt);const oldY=p.y;const wasGrounded=p.isGrounded;
      p.invincible=Math.max(0,p.invincible-dt);this.poseTime=Math.max(0,this.poseTime-dt);this.goalHint=Math.max(0,this.goalHint-dt);
      this.coyote=p.isGrounded?.12:Math.max(0,this.coyote-dt);this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);
      if(input.jump&&!this.jumpHeld)this.jumpBuffer=.14;this.jumpHeld=!!input.jump;
      if(this.beforePhysics)this.beforePhysics(dt,input);if(input.fire)this.fireStar(input);
      p.velocityX=((input.right?1:0)-(input.left?1:0))*270;
      if(p.velocityX)p.facing=Math.sign(p.velocityX);
      if(!this.freeMotion&&this.jumpBuffer>0&&this.coyote>0){p.velocityY=-p.jumpForce;p.isGrounded=false;this.jumpBuffer=0;this.coyote=0;this.setPose('jump');this.emit('jump');}
      if(input.down&&p.isGrounded&&this.stage.platforms.some(a=>a.oneWay&&p.x+p.w>a.x&&p.x<a.x+a.w&&Math.abs(p.y+p.h-a.y)<2)){p.y+=9;p.isGrounded=false;this.coyote=0;}
      if(this.motion)this.motion(dt,input);
      p.x=Math.max(0,Math.min(this.stage.length-p.w,p.x+p.velocityX*dt));
      // Solid cliff sides prevent walking through land from below; floating ledges are one-way.
      for(const a of this.stage.platforms){if(a.oneWay||!hit(p,a)||oldY+p.h<=a.y+1)continue;
        if(p.velocityX>0)p.x=a.x-p.w;else if(p.velocityX<0)p.x=a.x+a.w;}
      for(const b of this.stage.blocks||[]){if(b.removed||b.hidden&&!b.revealed||!hit(p,b)||oldY+p.h<=b.y+2)continue;if(p.velocityX>0)p.x=b.x-p.w;else if(p.velocityX<0)p.x=b.x+b.w;}
      p.velocityY=Math.min(950,p.velocityY+p.gravity*dt);p.y+=p.velocityY*dt;p.isGrounded=false;
      for(const b of this.stage.blocks||[]){if(b.removed)continue;b.bump=Math.max(0,(b.bump||0)-dt);b.crack=Math.max(0,(b.crack||0)-dt);if(b.hidden&&!b.revealed&&p.velocityY>=0)continue;if(p.x+p.w<=b.x+3||p.x>=b.x+b.w-3)continue;
        if(p.velocityY<0&&oldY>=b.y+b.h-2&&p.y<=b.y+b.h){p.y=b.y+b.h;p.velocityY=90;b.revealed=true;b.bump=.22;this.emit('blockHit',{block:b});
          if(b.kind==='breakable'){if(p.powerState!=='small'){b.removed=true;this.burst(b.x+b.w/2,b.y+b.h/2);this.emit('blockBreak',{block:b});}else{b.cracked=true;b.crack=.35;this.emit('blockCrack',{block:b});}}
          if(b.kind==='reward'&&!b.used){b.used=true;const reward=this.stage.items.find(i=>i.id===b.rewardId);if(reward){reward.contained=false;reward.x=b.x+(b.w-reward.w)/2;reward.y=b.y-reward.h-8;reward.pop=.4;reward.velocityY=-130;reward.dropReward=true;reward.originBlock=b;}this.emit('rewardPop',{block:b,reward});}
        }}
      // Solid overhead reef edges stop upward swimming; one-way ledges stay passable.
      for(const a of this.stage.platforms){if(!a.oneWay&&p.velocityY<0&&p.x+p.w>a.x+2&&p.x<a.x+a.w-2&&oldY>=a.y+a.h-1&&p.y<a.y+a.h){p.y=a.y+a.h;p.velocityY=0;}}
      for(const a of this.stage.platforms){if(p.x+p.w>a.x+2&&p.x<a.x+a.w-2&&p.velocityY>=0&&oldY+p.h<=a.y+1&&p.y+p.h>=a.y){p.y=a.y-p.h;p.velocityY=0;p.isGrounded=true;break;}}
      for(const b of this.stage.blocks||[]){if(b.removed||(!b.revealed&&b.hidden))continue;if(p.x+p.w>b.x+2&&p.x<b.x+b.w-2&&p.velocityY>=0&&oldY+p.h<=b.y+1&&p.y+p.h>=b.y){p.y=b.y-p.h;p.velocityY=0;p.isGrounded=true;break;}}
      if(!wasGrounded&&p.isGrounded){this.setPose('land',.1);this.emit('land');}
      if(this.poseTime<=0)this.setPose(!p.isGrounded?(p.velocityY<0?'jump':'fall'):(p.velocityX?'run':'idle'));
      for(const item of this.stage.items){if(item.dropReward&&!this.collected.has(item.id)){
        const oldBottom=item.y+item.h;item.velocityY+=700*dt;item.y+=item.velocityY*dt;
        // Released rewards fall past their source block to an accessible lower route.
        for(const floor of this.stage.platforms.filter(a=>a.kind==='ground'||a.kind==='floating'&&a.w>500))if(item.x+item.w>floor.x&&item.x<floor.x+floor.w&&oldBottom<=floor.y&&item.y+item.h>=floor.y){item.y=floor.y-item.h;item.velocityY=0;item.dropReward=false;break;}
      }if(item.contained||this.collected.has(item.id)||!hit(p,item)||(this.canCollect&&!this.canCollect(item)))continue;this.collected.add(item.id);this.burst(item.x+item.w/2,item.y+item.h/2);
        if(item.kind==='coin')this.coins++;if(item.kind==='star')this.stars++;if(item.kind==='flight'){p.flight=true;p.flightTime=12;this.setPose('power-up',.45);}if(item.kind==='power')this.grow();if(item.kind==='powerStar')this.gainPowerStar();this.emit(item.kind,{item});}
      this.tickPlayerProjectiles(dt);
      this.enemyShots=this.enemyShots.filter(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;if(hit(p,s)){this.damage();this.emit('enemyShotHit',{shot:s});return false;}return s.life>0&&s.x>-80&&s.x<this.stage.length+80;});
      for(const e of this.stage.enemies){if(e.defeated){e.defeatTime-=dt;continue;}e.shotCooldown=(e.shotCooldown??(1.4+(e.phase||0)*.35))-dt;if(e.kind==='fire-imp'&&e.shotCooldown<=0&&Math.abs(p.x-e.x)<this.viewport*.85){const dir=p.x<e.x?-1:1;e.dir=dir;this.enemyShots.push({kind:'fire',x:e.x+e.w/2,y:e.y+12,w:24,h:18,vx:dir*(150+(e.level||1)*18),vy:0,life:3});e.shotCooldown=Math.max(1.7,3.4-(e.level||1)*.28);this.emit('enemyFire',{enemy:e});}const speed=e.state==='rolling'?(e.rollSpeed||330):e.speed;e.x+=e.dir*speed*dt;if(e.x>e.right){e.x=e.right;e.dir=-1;}if(e.x<e.left){e.x=e.left;e.dir=1;}if(e.state!=='shell'){const wave=Math.max(0,Math.sin(this.elapsed*(e.kind==='pipe-snapper'?2.1:2.7)+(e.phase||0)));if(e.kind==='pipe-snapper')e.y=e.baseY-wave*72;else if(['sprout','berry-bandit','bubble-puffer','storm-bat','ink-sprite','spark-drake','tunnel-bat'].includes(e.kind))e.y=e.baseY-wave*(e.flying?28:7);}if(e.retracted||!hit(p,e))continue;
        const stomp=e.stompable!==false&&p.velocityY>0&&oldY+p.h<=e.y+Math.min(12,e.h*.3);if(stomp){p.y=e.y-p.h;p.velocityY=-390;p.isGrounded=false;this.combo++;this.comboTime=2;this.burst(e.x+e.w/2,e.y+8);if((e.hp||1)>1){e.hp--;e.hitTime=.35;this.emit('enemyHit',{enemy:e,hp:e.hp});}else if(e.armored&&e.state!=='shell'){e.state='shell';e.speed=0;e.h=Math.max(28,e.h-12);e.y=e.baseY+12;this.emit('enemyShell',{enemy:e,combo:this.combo});}else if(e.state==='shell'){e.state='rolling';e.dir=p.x<e.x?1:-1;this.emit('enemyRoll',{enemy:e,combo:this.combo});}else{e.defeated=true;e.defeatTime=.45;this.coins++;this.emit('enemyStomp',{enemy:e,combo:this.combo});}continue;}
        if(e.state==='shell'){e.state='rolling';e.dir=p.x<e.x?1:-1;p.velocityX=-e.dir*110;this.emit('enemyRoll',{enemy:e,combo:this.combo});}else this.damage(e.kind==='cactus');}
      for(const roller of this.stage.enemies.filter(e=>!e.defeated&&e.state==='rolling')){for(const target of this.stage.enemies){if(target===roller||target.defeated||!hit(roller,target))continue;target.defeated=true;target.defeatTime=.45;roller.dir*=-1;this.combo++;this.comboTime=2;this.burst(target.x+target.w/2,target.y+target.h/2);this.emit('enemyCombo',{enemy:target,combo:this.combo});}for(const b of this.stage.blocks||[]){if(b.removed||b.kind!=='breakable'||!hit(roller,b))continue;b.removed=true;roller.dir*=-1;this.burst(b.x+b.w/2,b.y+b.h/2);this.emit('rollingBreak',{block:b});}}
      for(const h of this.stage.hazards){if(h.kind==='crate')h.x=h.origin+Math.sin(this.elapsed*1.5)*h.range;if(!h.inactive&&hit(p,h)){if(['lava','void','open-drain'].includes(h.kind))this.fatalFall();else this.damage();}}
      for(const cp of this.stage.checkpoints)if(p.x>=cp.x&&cp.x>this.checkpoint.x){this.checkpoint=cp;this.emit('checkpoint',{checkpoint:cp});}
      if(p.y>(this.stage.killY||720))this.fatalFall();
      if(this.afterPhysics)this.afterPhysics(dt,input);
      const lookAhead=p.facing>0?this.viewport*.31:this.viewport*.5,target=Math.max(0,Math.min(this.stage.length-this.viewport,p.x-lookAhead));this.cameraX+=(target-this.cameraX)*Math.min(1,dt*10);
      if(this.status==='playing'&&hit(p,this.stage.goal)){
        if(this.letterCount===this.stage.words.length&&(!this.canFinish||this.canFinish())){this.status='clear';p.velocityX=0;this.setPose('celebrate');this.emit('clear',{result:this.result()});}
        else if(this.goalHint<=0){this.goalHint=4;this.emit('missing');}
      }
    }
    get letterCount(){return this.stage.items.filter(i=>i.kind==='letter'&&this.collected.has(i.id)).length;}
    result(){return {stageId:this.stage.id,letters:this.stage.words.filter((_,i)=>this.collected.has('letter-'+i)),stars:this.stars,coins:this.coins,seconds:Math.round(this.elapsed),hp:this.player.hp,deaths:this.deaths,rating:this.deaths===0&&this.player.hp===3?3:this.deaths<=2?2:1};}
  };
  // Additive migration. No existing star, level, progress or game record is replaced.
  HR.readProgress=function(state){const r=state.records&&state.records.hangulRunner;return r&&r.version===1?r:{version:1,unlocked:1,stages:{},lastStage:1};};
  HR.recordClear=function(state,result){
    const old=HR.readProgress(state),previous=old.stages[result.stageId];
    const oldRating=previous?previous.rating||0:0,delta=Math.max(0,result.rating-oldRating);
    state.stars=(Number(state.stars)||0)+delta;
    state.records=state.records||{};
    state.records.hangulRunner={...old,version:1,unlocked:Math.max(old.unlocked,Math.min(HR.stages.length,result.stageId+1)),lastStage:Math.min(HR.stages.length,result.stageId+1),stages:{...old.stages,[result.stageId]:{...result,rating:Math.max(oldRating,result.rating),seconds:previous?Math.min(previous.seconds,result.seconds):result.seconds,updatedAt:Date.now()}}};
    return delta;
  };
})(HangulRunner);
