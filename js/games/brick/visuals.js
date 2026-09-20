/* Shared pixel geometry for star rendering and circle/rectangle collisions. */
(function(B){
  B.ballRadius=w=>Math.max(10,Math.min(15,w*.038));
  B.circleContact=(x,y,r,box)=>{const nx=Math.max(box.x,Math.min(x,box.x+box.w)),ny=Math.max(box.y,Math.min(y,box.y+box.h)),dx=x-nx,dy=y-ny,d=Math.hypot(dx,dy);if(d>=r)return null;if(d>0)return{x:dx/d,y:dy/d,depth:r-d};const sides=[{x:-1,y:0,d:x-box.x},{x:1,y:0,d:box.x+box.w-x},{x:0,y:-1,d:y-box.y},{x:0,y:1,d:box.y+box.h-y}].sort((a,b)=>a.d-b.d);return{...sides[0],depth:r+sides[0].d};};
  B.StarRenderer=class{
    constructor(scene){this.scene=scene;this.canvas=document.createElement('canvas');this.canvas.className='brickStarsCanvas';this.canvas.setAttribute('aria-hidden','true');scene.append(this.canvas);this.g=this.canvas.getContext('2d');this.sparks=[];this.resize();this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(scene);}
    resize(){const w=this.scene.clientWidth,h=this.scene.clientHeight,dpr=Math.min(2,window.devicePixelRatio||1);if(!w||!h)return;this.w=w;this.h=h;this.dpr=dpr;const pw=Math.round(w*dpr),ph=Math.round(h*dpr);if(this.canvas.width!==pw||this.canvas.height!==ph){this.canvas.width=pw;this.canvas.height=ph;}}
    impact(x,y){for(let i=0;i<6;i++){if(this.sparks.length>=48)this.sparks.shift();this.sparks.push({x,y,vx:Math.cos(i*Math.PI/3)*70,vy:Math.sin(i*Math.PI/3)*70,life:.22});}}
    paint(balls,dt=0){const g=this.g,w=this.w,h=this.h;if(!w||!h)return;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.shadowBlur=0;g.clearRect(0,0,this.canvas.width,this.canvas.height);g.setTransform(this.canvas.width/w,0,0,this.canvas.height/h,0,0);
      for(const b of balls){const x=b.x*w/100,y=b.y*h/100,r=B.ballRadius(w),trail=b.trail||(b.trail=[]);if(dt>0){trail.push({x,y});if(trail.length>7)trail.shift();}g.save();for(let i=1;i<trail.length;i++){g.globalAlpha=i/trail.length*.3;g.strokeStyle='#fff3b1';g.lineWidth=r*i/trail.length;g.lineCap='round';g.beginPath();g.moveTo(trail[i-1].x,trail[i-1].y);g.lineTo(trail[i].x,trail[i].y);g.stroke();}g.globalAlpha=1;
      const glow=g.createRadialGradient(x,y,r*.2,x,y,r*1.7);glow.addColorStop(0,'#fffaddaa');glow.addColorStop(1,'#fff5b000');g.fillStyle=glow;g.beginPath();g.arc(x,y,r*1.7,0,Math.PI*2);g.fill();g.fillStyle='#fff4a8';g.strokeStyle='#fff';g.lineWidth=1.5;g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.5:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}g.closePath();g.fill();g.stroke();g.restore();}
      this.sparks=this.sparks.filter(s=>{s.life-=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;g.globalAlpha=Math.max(0,s.life/.22);g.fillStyle='#fff0a0';g.fillRect(s.x-1.5,s.y-1.5,3,3);return s.life>0});g.globalAlpha=1;
    }
    destroy(){this.observer.disconnect();this.canvas.remove();}
  };
})(SianBrick);
