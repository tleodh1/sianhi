(function(R){
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const weapons={blaster:{range:10,damage:9,cooldown:.48,shot:true},sword:{range:2,damage:15,cooldown:.5},hammer:{range:2.2,damage:25,cooldown:1.1},drill:{range:1.8,damage:7,cooldown:.2},guard:{range:1.6,damage:8,cooldown:.55}};
  class Fighter {
    constructor(build,x,z){this.build=JSON.parse(JSON.stringify(build));this.stats=R.stats(build);Object.assign(this,{x,z,y:0,vy:0,angle:0,hp:this.stats.hp,energy:this.stats.energy,cooldown:0,hurt:0,dash:0,dashCooldown:0,guard:false,attackPose:0,walking:false});}
  }
  R.BattleEngine=class {
    constructor(build,difficulty='normal'){
      this.difficulty=difficulty;this.player=new Fighter(build,-4,0);
      const enemy=R.defaultBuild();enemy.name='스파크봇';for(const slot of R.slots){enemy.parts[slot]=R.parts[slot][Math.floor(Math.random()*R.parts[slot].length)].id;enemy.colors[slot]={primary:'#ff668e',secondary:'#744db8',accent:'#ffdf69'};}
      this.enemy=new Fighter(enemy,4,0);this.enemy.angle=-Math.PI/2;this.player.angle=Math.PI/2;
      this.input={x:0,z:0,guard:false};this.projectiles=[];this.particles=[];this.time=0;this.over=false;this.result=null;this.aiTimer=0;this.aiMove={x:0,z:0};
    }
    jump(f){if(!this.over&&f.y===0){f.vy=6+f.stats.jump*.04;return true;}return false;}
    dash(f){if(this.over||f.dashCooldown>0||f.energy<16)return false;f.energy-=16;f.dash=.2;f.dashCooldown=1;return true;}
    hit(target,amount){if(target.hurt>0||target.dash>0)return false;target.hp=clamp(target.hp-Math.max(1,amount-target.stats.defense*.12)*(target.guard?.22:1),0,target.stats.hp);target.hurt=.18;for(let i=0;i<9;i++)this.particles.push({x:target.x,y:target.y+1.4,z:target.z,life:.4,vx:(Math.random()-.5)*4,vz:(Math.random()-.5)*4});return true;}
    attack(f,skill=false){
      if(this.over||f.cooldown>0||f.guard||(skill&&f.energy<30))return false;
      const w=weapons[f.build.parts.weapon]||weapons.blaster;const target=f===this.player?this.enemy:this.player;
      f.cooldown=w.cooldown*(skill?1.3:1);f.attackPose=.22;if(skill)f.energy-=30;
      const damage=w.damage+f.stats.power*.2;
      if(w.shot){this.projectiles.push({owner:f,x:f.x+Math.sin(f.angle)*.6,z:f.z+Math.cos(f.angle)*.6,y:f.y+1.4,vx:Math.sin(f.angle)*12,vz:Math.cos(f.angle)*12,life:1.7,damage:damage*(skill?2:1)});}
      else {
        const dx=target.x-f.x,dz=target.z-f.z,d=Math.hypot(dx,dz),front=d===0?1:(dx*Math.sin(f.angle)+dz*Math.cos(f.angle))/d;
        if(d<w.range+(skill?.6:0)&&front>.2&&Math.abs(target.y-f.y)<1.4)this.hit(target,damage*(skill?1.8:1));
        if(f.build.parts.weapon==='guard'&&skill){f.guard=true;f.shieldTime=1;}
      }return true;
    }
    move(f,x,z,dt){const n=Math.hypot(x,z);f.walking=n>.05;if(n>.05){x/=Math.max(1,n);z/=Math.max(1,n);f.angle=Math.atan2(x,z);}const speed=(2.5+f.stats.speed*.045)*(f.guard?.35:1);const boost=f.dash>0?4:1;if(f.dash>0){x=Math.sin(f.angle);z=Math.cos(f.angle);}f.x=clamp(f.x+x*speed*boost*dt,-8,8);f.z=clamp(f.z+z*speed*boost*dt,-6,6);}
    ai(dt){
      const a=this.enemy,p=this.player,dx=p.x-a.x,dz=p.z-a.z,d=Math.hypot(dx,dz)||1;a.angle=Math.atan2(dx,dz);this.aiTimer-=dt;
      if(this.aiTimer<=0){this.aiTimer={easy:.7,normal:.4,hard:.2}[this.difficulty];const ranged=a.build.parts.weapon==='blaster',ideal=ranged?4:1.2;let dir=d>ideal?1:d<ideal*.6?-1:0;this.aiMove={x:dx/d*dir,z:dz/d*dir};a.guard=p.attackPose>0&&d<2.6&&Math.random()<.65;
        if(d<6&&Math.random()>.2)this.attack(a,a.energy>50&&Math.random()<.35);
        if(this.difficulty!=='easy'&&this.projectiles.some(q=>q.owner===p&&Math.hypot(q.x-a.x,q.z-a.z)<3)){this.aiMove={x:-dz/d,z:dx/d};this.dash(a);}
        if(this.difficulty==='hard'&&Math.random()<.16)this.jump(a);
      }this.move(a,this.aiMove.x,this.aiMove.z,dt);a.angle=Math.atan2(p.x-a.x,p.z-a.z);
    }
    tick(dt){if(this.over)return;dt=clamp(dt,0,.05);this.time+=dt;this.player.guard=this.input.guard||this.player.shieldTime>0;this.move(this.player,this.input.x,this.input.z,dt);this.ai(dt);
      for(const f of [this.player,this.enemy]){for(const key of ['cooldown','hurt','dash','dashCooldown','attackPose','shieldTime'])f[key]=Math.max(0,(f[key]||0)-dt);f.energy=clamp(f.energy+7*dt,0,f.stats.energy);if(f.y>0||f.vy>0){f.vy-=15*dt;f.y=Math.max(0,f.y+f.vy*dt);if(f.y===0)f.vy=0;}}
      for(const q of this.projectiles){const ox=q.x,oz=q.z;q.x+=q.vx*dt;q.z+=q.vz*dt;q.life-=dt;const t=q.owner===this.player?this.enemy:this.player;const vx=q.x-ox,vz=q.z-oz,den=vx*vx+vz*vz;const f=den?clamp(((t.x-ox)*vx+(t.z-oz)*vz)/den,0,1):0;if(Math.hypot(ox+f*vx-t.x,oz+f*vz-t.z)<.65&&q.y>=t.y+.1&&q.y<=t.y+2.8){this.hit(t,q.damage);q.life=0;}}
      this.projectiles=this.projectiles.filter(q=>q.life>0);this.particles=this.particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.z+=p.vz*dt;p.y+=dt;return p.life>0;});
      if(this.player.hp<=0||this.enemy.hp<=0){this.over=true;this.result=this.enemy.hp<=0?'win':'lose';}
    }
  };
})(window.SianRobot);
