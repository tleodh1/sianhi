(function(R){
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const weapons={blaster:{range:10,damage:9,cooldown:.55,shot:true},sword:{range:2,damage:15,cooldown:.58},hammer:{range:2.25,damage:25,cooldown:1.1},drill:{range:1.8,damage:7,cooldown:.28},guard:{range:1.6,damage:8,cooldown:.6}};
 class Fighter{constructor(build,x,z){this.build=JSON.parse(JSON.stringify(build));this.stats=R.stats(build);Object.assign(this,{x,z,y:0,vy:0,angle:0,hp:this.stats.hp,energy:this.stats.energy,cooldown:0,hurt:0,flash:0,dash:0,dashCooldown:0,guard:false,attackPose:0,attackState:null,walking:false,knockX:0,knockZ:0});}}
 R.BattleEngine=class{
  constructor(build,difficulty='normal'){
   this.difficulty=difficulty;this.player=new Fighter(build,-4,0);const enemy=R.defaultBuild();enemy.name='스파크봇';for(const slot of R.slots){enemy.parts[slot]=R.parts[slot][Math.floor(Math.random()*R.parts[slot].length)].id;enemy.colors[slot]={primary:'#ff668e',secondary:'#744db8',accent:'#ffdf69'};}
   this.enemy=new Fighter(enemy,4,0);this.enemy.angle=-Math.PI/2;this.player.angle=Math.PI/2;this.input={x:0,z:0,guard:false};this.projectiles=[];this.particles=[];this.pending=[];this.events={};this.time=0;this.shake=0;this.over=false;this.result=null;this.aiTimer=0;this.aiMove={x:0,z:0};
  }
  emit(type){this.events[type]=(this.events[type]||0)+1;}
  jump(f){if(!this.over&&f.y===0){f.vy=6+f.stats.jump*.04;return true;}return false;}
  dash(f){if(this.over||f.dashCooldown>0||f.energy<16)return false;f.energy-=16;f.dash=.2;f.dashCooldown=1;return true;}
  burst(x,y,z,color='spark',amount=18){for(let i=0;i<amount;i++)this.particles.push({kind:color,x,y,z,life:.25+Math.random()*.3,vx:(Math.random()-.5)*6,vy:1+Math.random()*4,vz:(Math.random()-.5)*6,scale:.07+Math.random()*.13});}
  hit(target,amount,source){if(target.hurt>0||target.dash>0)return false;const guarded=target.guard;target.hp=clamp(target.hp-Math.max(1,amount-target.stats.defense*.12)*(guarded?.22:1),0,target.stats.hp);target.hurt=.25;target.flash=.15;if(source){const dx=target.x-source.x,dz=target.z-source.z,d=Math.hypot(dx,dz)||1;target.knockX=dx/d*(guarded?1.2:3.5);target.knockZ=dz/d*(guarded?1.2:3.5);}this.burst(target.x,target.y+1.45,target.z,guarded?'guard':'spark',guarded?10:22);this.shake=guarded?.08:.18;this.emit(guarded?'guardHit':'hit');return true;}
  schedule(time,run){this.pending.push({time,run});}
  projectile(f,damage,kind='energy',speed=12){this.projectiles.push({owner:f,kind,x:f.x+Math.sin(f.angle)*.75,z:f.z+Math.cos(f.angle)*.75,y:f.y+(kind==='shockwave'?.18:1.45),vx:Math.sin(f.angle)*speed,vz:Math.cos(f.angle)*speed,life:2,damage,radius:kind==='shockwave'?1:.68});this.burst(f.x,f.y+1.4,f.z,kind==='shockwave'?'wave':'muzzle',10);this.emit('launch');}
  melee(f,target,w,skill,multiplier=1){const dx=target.x-f.x,dz=target.z-f.z,d=Math.hypot(dx,dz),front=d===0?1:(dx*Math.sin(f.angle)+dz*Math.cos(f.angle))/d;const bonus=skill?(f.build.parts.weapon==='sword'?1.1:.7):0;if(d<w.range+bonus&&front>.2&&Math.abs(target.y-f.y)<1.35){this.hit(target,(w.damage+f.stats.power*.2)*(skill?1.8:1)*multiplier,f);return true;}this.emit('miss');return false;}
  attack(f,skill=false){
   if(this.over||f.cooldown>0||f.guard||(skill&&f.energy<30))return false;const weapon=f.build.parts.weapon,w=weapons[weapon]||weapons.blaster,target=f===this.player?this.enemy:this.player,damage=w.damage+f.stats.power*.2;
   f.cooldown=w.cooldown*(skill?1.55:1);f.attackPose=skill?.62:.34;f.attackState={weapon,skill,phase:skill?'charge':'windup',duration:f.attackPose};if(skill){f.energy-=30;this.emit('skillCharge');}else this.emit('attack');
   if(weapon==='guard'&&skill){f.shieldTime=1.5;this.particles.push({kind:'barrier',owner:f,x:f.x,y:f.y+1.4,z:f.z,life:1.5,scale:1.2});this.emit('guard');return true;}
   if(weapon==='blaster')this.schedule(skill?.38:.14,()=>this.projectile(f,damage*(skill?2.15:1),skill?'energyBall':'energy',skill?9:13));
   else if(weapon==='hammer'&&skill)this.schedule(.34,()=>this.projectile(f,damage*1.85,'shockwave',8));
   else if(weapon==='drill'&&skill)for(let i=0;i<4;i++)this.schedule(.16+i*.1,()=>this.melee(f,target,w,true,.48));
   else this.schedule(skill?.3:.16,()=>this.melee(f,target,w,skill));return true;
  }
  move(f,x,z,dt){const n=Math.hypot(x,z);f.walking=n>.05;if(n>.05){x/=Math.max(1,n);z/=Math.max(1,n);f.angle=Math.atan2(x,z);}const speed=(2.5+f.stats.speed*.045)*(f.guard?.35:1),boost=f.dash>0?4:1;if(f.dash>0){x=Math.sin(f.angle);z=Math.cos(f.angle);}f.x=clamp(f.x+(x*speed*boost+f.knockX)*dt,-8,8);f.z=clamp(f.z+(z*speed*boost+f.knockZ)*dt,-6,6);f.knockX*=Math.exp(-dt*11);f.knockZ*=Math.exp(-dt*11);}
  ai(dt){const a=this.enemy,p=this.player,dx=p.x-a.x,dz=p.z-a.z,d=Math.hypot(dx,dz)||1;a.angle=Math.atan2(dx,dz);this.aiTimer-=dt;if(this.aiTimer<=0){this.aiTimer={easy:.7,normal:.4,hard:.2}[this.difficulty];const ranged=a.build.parts.weapon==='blaster',ideal=ranged?4:1.2,dir=d>ideal?1:d<ideal*.6?-1:0;this.aiMove={x:dx/d*dir,z:dz/d*dir};a.guard=p.attackPose>0&&d<2.6&&Math.random()<.65;if(d<6&&Math.random()>.2)this.attack(a,a.energy>50&&Math.random()<.35);if(this.difficulty!=='easy'&&this.projectiles.some(q=>q.owner===p&&Math.hypot(q.x-a.x,q.z-a.z)<3)){this.aiMove={x:-dz/d,z:dx/d};this.dash(a);}if(this.difficulty==='hard'&&Math.random()<.16)this.jump(a);}this.move(a,this.aiMove.x,this.aiMove.z,dt);a.angle=Math.atan2(p.x-a.x,p.z-a.z);}
  tick(dt){if(this.over)return;dt=clamp(dt,0,.05);this.time+=dt;this.shake=Math.max(0,this.shake-dt);this.player.guard=this.input.guard||this.player.shieldTime>0;this.move(this.player,this.input.x,this.input.z,dt);this.ai(dt);
   for(const f of [this.player,this.enemy]){for(const key of ['cooldown','hurt','flash','dash','dashCooldown','attackPose','shieldTime'])f[key]=Math.max(0,(f[key]||0)-dt);if(f.attackPose===0)f.attackState=null;f.energy=clamp(f.energy+7*dt,0,f.stats.energy);if(f.y>0||f.vy>0){f.vy-=15*dt;f.y=Math.max(0,f.y+f.vy*dt);if(f.y===0)f.vy=0;}}
   for(const action of this.pending){action.time-=dt;if(action.time<=0&&!action.done){action.done=true;action.run();}}this.pending=this.pending.filter(a=>!a.done);
   for(const q of this.projectiles){const ox=q.x,oz=q.z;q.x+=q.vx*dt;q.z+=q.vz*dt;q.life-=dt;this.particles.push({kind:'trail',x:q.x,y:q.y,z:q.z,life:.16,vx:0,vy:0,vz:0,scale:q.kind==='energyBall'?.2:.08});const target=q.owner===this.player?this.enemy:this.player,vx=q.x-ox,vz=q.z-oz,den=vx*vx+vz*vz,f=den?clamp(((target.x-ox)*vx+(target.z-oz)*vz)/den,0,1):0,close=Math.hypot(ox+f*vx-target.x,oz+f*vz-target.z)<q.radius;const vertical=q.kind==='shockwave'?target.y<.45:q.y>=target.y+.1&&q.y<=target.y+2.8;if(close&&vertical){if(this.hit(target,q.damage,q.owner)){this.burst(target.x,target.y+1.4,target.z,q.kind==='shockwave'?'wave':'blast',28);}q.life=0;}}
   this.projectiles=this.projectiles.filter(q=>q.life>0);this.particles=this.particles.filter(p=>{p.life-=dt;if(p.owner){p.x=p.owner.x;p.y=p.owner.y+1.4;p.z=p.owner.z;}else{p.x+=(p.vx||0)*dt;p.z+=(p.vz||0)*dt;p.y+=(p.vy||0)*dt;if(p.vy)p.vy-=7*dt;}return p.life>0;});if(this.player.hp<=0||this.enemy.hp<=0){this.over=true;this.result=this.enemy.hp<=0?'win':'lose';}
  }
 };
})(window.SianRobot);
