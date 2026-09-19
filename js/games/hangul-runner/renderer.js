(function(HR){
  const BASE='assets/hangul-runner/';
  function load(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('모험 그림을 불러오지 못했어요.'));i.src=BASE+src;});}
  // Crop only at rendering time; the original generated atlas remains unaltered.
  function crop(image,r){const [x,y,w,h]=r.map(n=>Math.round(n*image.width/1254));const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(image,x,y,w,h,0,0,w,h);
    const d=g.getImageData(0,0,w,h).data;let l=w,t=h,rr=0,b=0;for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(d[(yy*w+xx)*4+3]>45){l=Math.min(l,xx);t=Math.min(t,yy);rr=Math.max(rr,xx);b=Math.max(b,yy);}
    return {image:c,x:l,y:t,w:rr-l+1,h:b-t+1};}
  HR.loadArt=async()=>{
    const [character,objects,scenery]=await Promise.all(['character.webp','objects.webp','scenery.webp'].map(load));
    const frames=Array.from({length:16},(_,i)=>crop(character,[i%4*313.5,Math.floor(i/4)*313.5,313.5,313.5]));
    const rects=[[0,70,387,295],[387,110,251,255],[640,130,305,230],[945,0,309,375],
      [0,378,312,267],[313,370,312,274],[628,377,307,268],[937,400,317,245],
      [0,648,313,287],[316,665,304,270],[630,665,299,266],[937,638,317,302],
      [0,949,312,290],[315,957,311,282],[630,963,300,260],[936,942,318,297]];
    const sprites=rects.map(r=>crop(objects,r));
    const back=[crop(scenery,[0,0,700,584]),crop(scenery,[704,0,550,650]),crop(scenery,[0,602,595,645]),crop(scenery,[600,807,654,433])];
    return {frames,sprites,back};
  };
  function draw(g,s,x,y,w,h,flip=false){if(!s||s.w<=0)return;g.save();if(flip){g.translate(x+w,y);g.scale(-1,1);x=0;y=0;}g.drawImage(s.image,s.x,s.y,s.w,s.h,x,y,w,h);g.restore();}
  HR.Renderer=class {
    constructor(canvas,art){this.canvas=canvas;this.g=canvas.getContext('2d',{alpha:false});this.art=art;this.width=960;this.height=540;this.dpr=1;}
    resize(width){this.width=width<620?640:960;this.height=540;this.dpr=Math.min(2,window.devicePixelRatio||1);this.canvas.width=this.width*this.dpr;this.canvas.height=this.height*this.dpr;}
    sprite(i,x,y,w,h,flip){draw(this.g,this.art.sprites[i],x,y,w,h,flip);}
    paint(e){const g=this.g,w=this.width,h=this.height,c=e.cameraX,t=e.elapsed,theme=e.stage.theme||'forest';g.setTransform(this.dpr,0,0,this.dpr,0,0);
      const palettes={forest:['#68c6f7','#b5e7f5','#ecf9fa'],ocean:['#075f9d','#13a9bd','#063c72'],sky:['#7999f4','#d6c2ff','#fff0d0'],underground:['#241c3a','#493052','#141d2c']},colors=palettes[theme]||palettes.forest;
      const sky=g.createLinearGradient(0,0,0,h);sky.addColorStop(0,colors[0]);sky.addColorStop(.62,colors[1]);sky.addColorStop(1,colors[2]);g.fillStyle=sky;g.fillRect(0,0,w,h);
      if(theme==='ocean'){g.fillStyle='#d5ffff55';for(let i=0;i<16;i++){g.beginPath();g.arc((i*173-c*.12)%1100,60+(i*83+t*22)%430,5+i%4*3,0,Math.PI*2);g.fill();}}
      if(theme==='sky'){for(let i=-1;i<6;i++){const x=i*210-(c*.1+t*12)%210;g.fillStyle='#fff9';g.beginPath();g.ellipse(x,95+(i%3)*85,95,30,0,0,Math.PI*2);g.fill();}}
      if(theme==='underground'){g.fillStyle='#89ffd555';for(let i=0;i<12;i++){g.beginPath();g.arc((i*127-c*.2)%1050,90+(i%5)*90,4+i%3*2,0,Math.PI*2);g.fill();}}
      // Independent layers, camera ratios: cloud .06, mountain .13, castle .21,
      // waterfall .34, forest .53, platform 1, foreground 1.12.
      if(theme==='forest'){for(let i=-1;i<5;i++){const x=i*420-(c*.06+t*4)%420;this.sprite(13,x,35+(i%2)*55,185,92);}
      for(let i=-1;i<4;i++)draw(g,this.art.back[0],i*760-(c*.13)%760,75,850,470);
      draw(g,this.art.back[1],560-(c*.21)%1500,65,245,294);
      for(let i=-1;i<4;i++){let x=i*680-(c*.34)%680;draw(g,this.art.back[2],x,170,320,410);
        // Subtle moving highlights give waterfalls a continuous flow.
        g.save();g.globalAlpha=.15;g.fillStyle='#fff';for(let k=0;k<6;k++)g.fillRect(x+125+k*12,280+(t*100+k*29)%210,3,26);g.restore();}
      for(let i=-1;i<5;i++)draw(g,this.art.back[3],i*460-(c*.53)%460,242,520,287);}
      for(const a of e.stage.platforms){const x=a.x-c;if(x+a.w<-40||x>w+40)continue;
        if(a.kind==='ground'){
          // Texture tiles meet exactly at collider tops; split terrain leaves real holes.
          const n=Math.ceil(a.w/260);for(let j=0;j<n;j++){const tw=a.w/n;this.sprite(0,x+j*tw-1,a.y-9,tw+2,a.h);}
          if(Math.floor(a.x/620)%2===0){this.sprite(3,x+25,a.y-182,148,192);this.sprite(14,x+165,a.y-35,73,44);}
        }else if(a.kind==='bridge'){this.sprite(2,x-5,a.y-32,a.w+10,73);}
        else this.sprite(1,x-3,a.y-9,a.w+6,66);
      }
      for(const cp of e.stage.checkpoints){if(cp.id===0)continue;const x=cp.x-c;if(x<-70||x>w+70)continue;
        this.sprite(15,x-20,346,62,77);g.fillStyle=cp.id<=e.checkpoint.id?'#076b79':'#fff';g.font='bold 12px Pretendard, sans-serif';g.textAlign='center';g.fillText('쉼터 '+cp.id,x+10,333);}
      for(const a of e.stage.hazards){const x=a.x-c;if(x<-80||x>w+80)continue;const i={thorn:8,rock:6,log:7,crate:9}[a.kind];this.sprite(i,x-10,a.y-16,a.w+20,a.h+20);}
      for(const a of e.stage.enemies){const x=a.x-c;if(x<-80||x>w+80)continue;const bounce=Math.sin(t*7+a.phase)*2;this.sprite(a.kind==='jelly'?4:5,x-6,a.y-9+bounce,a.w+12,a.h+12,a.dir<0);}
      for(const item of e.stage.items){if(e.collected.has(item.id))continue;const x=item.x-c;if(x<-100||x>w+100)continue;const bob=Math.sin(t*3+item.x)*3;
        if(item.kind==='letter'||item.kind==='decoy'){
          g.save();g.shadowColor='#f7d465';g.shadowBlur=12;const grad=g.createLinearGradient(x,item.y,x+62,item.y+62);grad.addColorStop(0,'#fff8c7');grad.addColorStop(.5,'#ffe5a0');grad.addColorStop(1,'#e9ac47');g.fillStyle=grad;g.beginPath();g.roundRect(x,item.y+bob,62,62,13);g.fill();g.shadowBlur=0;g.strokeStyle='#fff9dd';g.lineWidth=3;g.stroke();g.fillStyle='#573c28';g.textAlign='center';g.textBaseline='middle';g.font=`800 ${item.text.length>3?16:item.text.length>1?21:34}px Pretendard, sans-serif`;g.fillText(item.text,x+31,item.y+32+bob);g.restore();
        }else {const i={coin:10,star:11,power:12}[item.kind];const cw=item.kind==='coin'?item.w*(.7+.3*Math.abs(Math.cos(t*2))):item.w;this.sprite(i,x+(item.w-cw)/2,item.y+bob,cw,item.h);}
      }
      for(const q of e.projectiles||[]){g.fillStyle=theme==='ocean'?'#8eeaff':theme==='sky'?'#fff18d':'#ff8d79';g.beginPath();g.arc(q.x-c+17,q.y+17,17,0,Math.PI*2);g.fill();}
      if(e.boss&&(!e.boss.unlocked||e.boss.defeatTime>0)){const bx=w-125,by=155,hit=e.boss.hitTime>0,fade=e.boss.unlocked?Math.max(0,e.boss.defeatTime/1.2):1;g.save();g.globalAlpha=fade;g.translate(bx+(hit?Math.sin(t*55)*7:0),by);g.shadowColor=hit?'#fff':e.stage.world.color;g.shadowBlur=hit?42:25;g.fillStyle=hit?'#fff8d1':e.stage.world.color;g.beginPath();g.ellipse(0,0,82+Math.sin(t*3)*3,70,0,0,Math.PI*2);g.fill();g.shadowBlur=0;g.fillStyle='#263147';g.fillRect(-64,-22,128,42);g.fillStyle='#8ff8ff';g.fillRect(-45,-8,26,8);g.fillRect(19,-8,26,8);g.fillStyle=e.stage.world.color;g.beginPath();g.moveTo(-64,-12);g.lineTo(-103,14);g.lineTo(-72,38);g.moveTo(64,-12);g.lineTo(103,14);g.lineTo(72,38);g.lineWidth=18;g.strokeStyle=e.stage.world.color;g.stroke();g.fillStyle='#fff';g.textAlign='center';g.font='900 16px Pretendard';g.fillText(e.stage.boss.name,0,8);g.fillStyle='#261b35';g.fillRect(-78,86,156,15);g.fillStyle='#ffdb55';g.fillRect(-75,89,150*(e.boss.hp/e.boss.maxHp),9);const question=e.stage.boss.questions[Math.min(e.boss.question,e.stage.boss.questions.length-1)];g.font='900 28px Pretendard';g.fillStyle='#fff';g.fillText(question?.[0]||'격파!',0,-91);if(hit){g.font='900 34px Pretendard';g.fillStyle='#fff5a8';g.fillText('정답 공격!',-30,55);}g.restore();}
      const goal=e.stage.goal,gx=goal.x-c,locked=!!(e.stage.boss&&!e.boss?.unlocked);g.save();g.translate(gx+goal.w/2,goal.y+goal.h/2);g.shadowColor=locked?'#e05a55':'#7bfff0';g.shadowBlur=locked?10:28;g.fillStyle=locked?'#4c3542':'#e6fff5';g.strokeStyle=locked?'#f08a7f':'#63dac8';g.lineWidth=6;g.beginPath();g.roundRect(-goal.w/2-8,-goal.h/2-18,goal.w+16,goal.h+28,16);g.fill();g.stroke();g.fillStyle=locked?'#ff9b83':'#37aa94';g.font='900 30px Pretendard';g.textAlign='center';g.fillText(locked?'🔒':'✦',0,10);g.restore();
      g.textAlign='center';g.font='800 15px Pretendard, sans-serif';g.fillStyle=locked?'#7b3340':'#155773';g.fillText(locked?'보스를 물리치면 열려요':'열린 별빛 문',gx+goal.w/2,goal.y-30);
      const p=e.player;let frame={idle:8,jump:9,fall:10,land:11,hurt:12,'power-up':13,small:12,dead:14,celebrate:15}[p.pose];if(p.pose==='run')frame=Math.floor(t*12)%8;
      const scale=p.powerState==='big'?1.2:1,hh=(p.pose==='land'?80:p.pose==='dead'?77:102)*scale;const s=this.art.frames[frame??8],ww=hh*s.w/s.h;
      if(p.invincible<=0||Math.floor(t*13)%2===0||e.status==='dead'){
        g.save();if(p.powerState==='big'){g.shadowColor='#ffe26c';g.shadowBlur=22;}draw(g,s,p.x-c+p.w/2-ww/2,p.y+p.h-hh+3,ww,hh,p.facing<0);g.restore();}
      for(const v of e.particles){g.globalAlpha=Math.min(1,v.life*2);this.sprite(11,v.x-c-5,v.y-5,10,10);}g.globalAlpha=1;
      for(let i=0;i<5;i++){const x=i*340-(c*1.12)%340;this.sprite(14,x,502+Math.sin(i)*7,105,55);}
      // Draw distance/position in the scene so assistive status matches visible gameplay.
      g.fillStyle='rgba(255,255,255,.82)';g.beginPath();g.roundRect(16,16,170,30,15);g.fill();g.fillStyle='#235570';g.textAlign='left';g.font='700 13px Pretendard, sans-serif';g.fillText(e.stage.world.name+' · '+Math.floor(p.x/10)+' m',29,36);
    }
  };
})(HangulRunner);
