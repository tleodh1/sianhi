/* QA entry uses the production adapter, art loader, controls and simulation; saves disabled. */
(function(){
 const width=document.getElementById('review-width'),stage=document.getElementById('review-stage'),metrics=document.getElementById('review-metrics');
 let frames=0,total=0,max=0,previous=0,interval=0,lastText=0;
 const paint=HangulRunner.Renderer.prototype.paint;
 HangulRunner.Renderer.prototype.paint=function(e){const t=performance.now();paint.call(this,e);const cost=performance.now()-t;frames++;total+=cost;max=Math.max(max,cost);if(previous)interval+=Math.min(1000,t-previous);previous=t;if(t-lastText>1000){lastText=t;const r=document.querySelector('.hr-shell'),canvas=r?.querySelector('canvas'),touch=r?.querySelector('.hr-touch'),cr=canvas?.getBoundingClientRect(),tr=touch?.getBoundingClientRect();metrics.textContent=`${e.stage.id} · ${width.value}px · 그리기 ${(total/frames).toFixed(1)}ms · ${frames}프레임 · ${r?.dataset.playerState||''}`;metrics.dataset.stage=e.stage.id;metrics.dataset.paintMeanMs=(total/frames).toFixed(2);metrics.dataset.paintMaxMs=max.toFixed(2);metrics.dataset.frames=frames;metrics.dataset.canvasWidth=cr?.width.toFixed(1);metrics.dataset.controlsOverlap=String(!!(cr&&tr&&tr.top<cr.bottom));metrics.dataset.contentOverflow=String(r?r.scrollWidth>r.clientWidth+1:false);}};
 function applyWidth(){game.style.setProperty('width',width.value+'px','important');}
 async function restart(){frames=total=max=previous=interval=0;applyWidth();await HangulRunner.start({reviewStage:stage.value});}
 width.onchange=applyWidth;stage.onchange=restart;document.getElementById('review-restart').onclick=restart;
 window.openGameWorld=restart;window.render=()=>{};
 restart();
})();
