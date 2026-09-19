/* Deterministic simulation: no DOM, timers, storage, or animation ownership here. */
(function(HR){
  const hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  HR.overlaps=hit;
  HR.Engine=class {
    constructor(stage,options={}) {
      this.stage=stage; this.onEvent=options.onEvent||(()=>{}); this.viewport=options.viewport||960;
      this.player={x:60,y:348,w:38,h:72,velocityX:0,velocityY:0,gravity:1500,jumpForce:650,isGrounded:true,hp:3,powerState:'small',facing:1,pose:'idle',invincible:0};
      this.collected=new Set();this.coins=0;this.stars=0;this.elapsed=0;this.cameraX=0;this.checkpoint=stage.checkpoints[0];this.deaths=0;
      this.status='playing';this.jumpHeld=false;this.coyote=.1;this.jumpBuffer=0;this.poseTime=0;this.particles=[];this.goalHint=0;this.deathTimer=0;this.events={};
    }
    emit(type,data={}) {this.events[type]=(this.events[type]||0)+1;this.onEvent({type,...data});}
    setPose(p,time=0){this.player.pose=p;this.poseTime=time;}
    respawn(){const p=this.player;p.x=this.checkpoint.x;p.y=this.checkpoint.y-p.h;p.velocityX=p.velocityY=0;p.hp=Math.max(1,p.hp);p.isGrounded=true;p.invincible=2;p.powerState='small';this.status='playing';this.jumpBuffer=0;this.setPose('idle');this.emit('respawn');}
    die(){if(this.status!=='playing')return;this.deaths++;this.status='dead';this.deathTimer=.85;this.setPose('dead');this.emit('death');}
    damage(){const p=this.player;if(p.invincible>0||this.status!=='playing')return;
      if(p.powerState==='big'){p.powerState='small';this.setPose('small',.35);this.emit('shrink');}
      else {p.hp--;this.setPose('hurt',.4);this.emit('hurt');}
      p.invincible=1.6;if(p.hp<=0)this.die();
    }
    returnToMissing(){const m=this.stage.items.find(i=>i.kind==='letter'&&!this.collected.has(i.id));if(!m)return;this.checkpoint=[...this.stage.checkpoints].reverse().find(c=>c.x<=m.x)||this.stage.checkpoints[0];this.respawn();}
    burst(x,y){for(let n=0;n<12;n++)this.particles.push({x,y,vx:Math.cos(n*Math.PI/6)*100,vy:Math.sin(n*Math.PI/6)*100-60,life:.65});}
    step(dt,input={}) {
      dt=Math.min(.025,Math.max(0,dt));if(this.status==='clear'||this.status==='paused')return;
      this.particles=this.particles.filter(v=>{v.x+=v.vx*dt;v.y+=v.vy*dt;v.vy+=130*dt;v.life-=dt;return v.life>0;});
      if(this.status==='dead'){this.deathTimer-=dt;if(this.deathTimer<=0){if(this.player.hp<=0)this.player.hp=3;this.respawn();}return;}
      this.elapsed+=dt;const p=this.player;const oldY=p.y;const wasGrounded=p.isGrounded;
      p.invincible=Math.max(0,p.invincible-dt);this.poseTime=Math.max(0,this.poseTime-dt);this.goalHint=Math.max(0,this.goalHint-dt);
      this.coyote=p.isGrounded?.12:Math.max(0,this.coyote-dt);this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);
      if(input.jump&&!this.jumpHeld)this.jumpBuffer=.14;this.jumpHeld=!!input.jump;
      if(this.beforePhysics)this.beforePhysics(dt,input);
      p.velocityX=((input.right?1:0)-(input.left?1:0))*270;
      if(p.velocityX)p.facing=Math.sign(p.velocityX);
      if(!this.freeMotion&&this.jumpBuffer>0&&this.coyote>0){p.velocityY=-p.jumpForce;p.isGrounded=false;this.jumpBuffer=0;this.coyote=0;this.setPose('jump');this.emit('jump');}
      if(input.down&&p.isGrounded&&this.stage.platforms.some(a=>a.oneWay&&p.x+p.w>a.x&&p.x<a.x+a.w&&Math.abs(p.y+p.h-a.y)<2)){p.y+=9;p.isGrounded=false;this.coyote=0;}
      if(this.motion)this.motion(dt,input);
      p.x=Math.max(0,Math.min(this.stage.length-p.w,p.x+p.velocityX*dt));
      // Solid cliff sides prevent walking through land from below; floating ledges are one-way.
      for(const a of this.stage.platforms){if(a.oneWay||!hit(p,a)||oldY+p.h<=a.y+1)continue;
        if(p.velocityX>0)p.x=a.x-p.w;else if(p.velocityX<0)p.x=a.x+a.w;}
      p.velocityY=Math.min(950,p.velocityY+p.gravity*dt);p.y+=p.velocityY*dt;p.isGrounded=false;
      for(const a of this.stage.platforms){if(p.x+p.w>a.x+2&&p.x<a.x+a.w-2&&p.velocityY>=0&&oldY+p.h<=a.y+1&&p.y+p.h>=a.y){p.y=a.y-p.h;p.velocityY=0;p.isGrounded=true;break;}}
      if(!wasGrounded&&p.isGrounded){this.setPose('land',.1);this.emit('land');}
      if(this.poseTime<=0)this.setPose(!p.isGrounded?(p.velocityY<0?'jump':'fall'):(p.velocityX?'run':'idle'));
      for(const item of this.stage.items){if(this.collected.has(item.id)||!hit(p,item)||(this.canCollect&&!this.canCollect(item)))continue;this.collected.add(item.id);this.burst(item.x+item.w/2,item.y+item.h/2);
        if(item.kind==='coin')this.coins++;if(item.kind==='star')this.stars++;if(item.kind==='power'){p.powerState='big';this.setPose('power-up',.45);}this.emit(item.kind,{item});}
      for(const e of this.stage.enemies){e.x+=e.dir*e.speed*dt;if(e.x>e.right){e.x=e.right;e.dir=-1;}if(e.x<e.left){e.x=e.left;e.dir=1;}e.y=e.baseY-(e.kind==='sprout'?Math.max(0,Math.sin(this.elapsed*2.5+e.phase))*65:0);if(hit(p,e))this.damage();}
      for(const h of this.stage.hazards){if(h.kind==='crate')h.x=h.origin+Math.sin(this.elapsed*1.5)*h.range;if(hit(p,h))this.damage();}
      for(const cp of this.stage.checkpoints)if(p.x>=cp.x&&cp.x>this.checkpoint.x){this.checkpoint=cp;this.emit('checkpoint',{checkpoint:cp});}
      if(p.y>720){p.hp--;this.die();}
      if(this.afterPhysics)this.afterPhysics(dt,input);
      const target=Math.max(0,Math.min(this.stage.length-this.viewport,p.x-this.viewport*.4));this.cameraX+=(target-this.cameraX)*Math.min(1,dt*10);
      if(hit(p,this.stage.goal)){
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
