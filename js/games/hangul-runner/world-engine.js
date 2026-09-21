/* Reuses the proven runner simulation, collisions, checkpoints and damage immunity. */
(function(H){
 H.WorldEngine=class extends H.Engine{
  constructor(stage,options){super(stage,options);this.setForm('small');this.jumpBoostUnlocked=false;if(stage.worldId===2&&stage.oceanBiome){this.player.y=stage.checkpoints[0].y-this.player.h;this.player.isGrounded=false;}this.sequence=0;this.flowTime=0;this.mode=stage.mode;this.freeMotion=false;this.projectiles=[];this.bossAttacks=[];this.answerCooldown=0;this.sceneState='RUN_STAGE';this.sceneTimer=0;}
  damage(){super.damage(true);}
  beforePhysics(dt){const p=this.player;if(p.flightTime>0){p.flightTime=Math.max(0,p.flightTime-dt);if(!p.flightTime){p.flight=false;this.emit('flightEnd');}}this.flowTime+=dt;this.mode=this.stage.mode;
   if(this.stage.runZones&&this.stage.runZones.some(z=>this.player.x>=z.x&&this.player.x<z.x+z.w))this.mode='run';
   if(this.stage.waterZones){const p=this.player;this.mode=this.stage.waterZones.some(z=>p.x>=z.x&&p.x<z.x+z.w&&p.y+p.h>z.surface+Math.sin(this.elapsed*.6)*25)?'swim':'run';}
   if(this.stage.flightPickup&&this.mode==='fly'&&!this.player.flight)this.mode='run';
   if(this.stage.worldId!==4&&this.player.flight&&this.sceneState==='RUN_STAGE')this.mode='fly';
   if(this.sceneState!=='RUN_STAGE')this.mode='run';
   this.freeMotion=this.mode==='swim'||this.mode==='fly';this.player.gravity=this.freeMotion?0:1500;
   for(const a of this.stage.platforms){if(!a.motion)continue;const oldX=a.x,oldY=a.y;a.x=a.originX+Math.sin(this.elapsed*a.motion.speed)*a.motion.x;a.y=a.originY+Math.sin(this.elapsed*a.motion.speed)*a.motion.y;
    const p=this.player;if(p.isGrounded&&p.x+p.w>oldX&&p.x<oldX+a.w&&Math.abs(p.y+p.h-oldY)<3){p.x+=a.x-oldX;p.y+=a.y-oldY;}}
  }
  motion(dt,input){const p=this.player;
   if(this.sceneState==='TRANSITION'||this.sceneState==='BOSS_INTRO'){p.velocityX=p.velocityY=0;return;}
   if(this.freeMotion){const speed=this.mode==='swim'?175:230;p.velocityX=((!!input.right)-(!!input.left))*speed;
    const wanted=((!!input.down)-(!!input.jump))*speed;p.velocityY+=(wanted-p.velocityY)*Math.min(1,dt*(this.mode==='swim'?3:5));
    p.y=Math.max(32,Math.min((this.mode==='swim'?510:540)-p.h,p.y));if(p.y<=32&&p.velocityY<0)p.velocityY=0;
   }
   for(const c of this.stage.currents||[])if(p.x>=c.x&&p.x<c.x+c.w&&(c.y===undefined||p.y+p.h>c.y&&p.y<c.y+c.h)){p.velocityX+=c.vx;p.velocityY+=c.vy*dt;}
   // Ordered learning remains a collection rule, never an invisible movement wall.
   for(const gate of this.stage.gates||[])if(this.sequence<gate.required&&p.x+p.w>gate.x&&!gate.warned){gate.warned=true;this.emit('orderGuide',{text:this.stage.words[this.sequence],x:gate.x});}
  }
  canCollect(item){if(item.kind!=='letter'||(!this.stage.ordered&&!this.stage.boss))return true;
   if(item.index!==this.sequence){if(this.goalHint<=0){this.goalHint=2;this.emit('order',{text:this.stage.words[this.sequence]});}return false;}this.sequence++;return true;
  }
  afterPhysics(dt){if(this.freeMotion&&this.poseTime<=0){const p=this.player;p.pose=this.mode==='swim'?'swim':'run';p.swimPose=Math.abs(p.velocityY)>55?(p.velocityY<0?'up':'down'):Math.abs(p.velocityX)>80?'move':'idle';}if(H.tickBossScene&&this.stage.boss)H.tickBossScene(this,dt);}
  get letterCount(){return this._normalLetterCount??super.letterCount;}
  canFinish(){return !this.stage.boss||this.sceneState==='EXIT_OPEN';}
  result(){return {...super.result(),worldId:this.stage.worldId,boss:!!this.stage.boss};}
 };
})(HangulRunner);
