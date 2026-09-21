/* Stage previews are rendered from the actual stage so the map matches gameplay. */
(function(H){
 const shots=new Map();
 const PLACEHOLDER={forest:'#77b86a',ocean:'#12628f',sky:'#87bff2',underground:'#3a2b4c',dinosaur:'#5c7c4c',ice:'#9cc9dd',fire:'#8c4436',lightning:'#4a4f7d',space:'#2a2350'};
 H.stagePreview=function(stage){
  const shot=shots.get(stage.id);
  return shot?'background-image:url('+shot+');background-size:cover;background-position:center':'background-color:'+(PLACEHOLDER[stage.theme]||'#43506e');
 };
 H.fillStagePreviews=function(root,art){
  if(!art)return;
  const pending=H.worldStages.filter(s=>!shots.has(s.id));
  const apply=()=>root.querySelectorAll('[data-world-stage]').forEach(button=>{
   const stage=H.worldStages.find(s=>s.id===button.dataset.worldStage),shot=stage&&shots.get(stage.id);
   if(shot)button.querySelector('.hr-shot')?.setAttribute('style','background-image:url('+shot+');background-size:cover;background-position:center');
  });
  if(!pending.length)return apply();
  let i=0;
  const step=()=>{
   const deadline=performance.now()+10;
   while(i<pending.length&&performance.now()<deadline){try{shots.set(pending[i].id,snapshot(pending[i],art));}catch{shots.set(pending[i].id,'');}i++;}
   apply();if(i<pending.length)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
 };
 function snapshot(meta,art){
  const full=document.createElement('canvas'),renderer=new H.Renderer(full,art);
  renderer.width=960;renderer.height=540;renderer.dpr=1;full.width=960;full.height=540;
  const stage=H.buildWorldStage(meta.id),engine=new H.WorldEngine(stage,{viewport:960});
  const spot=stage.length*(meta.boss?.62:.24),base=stage.mode==='swim'?330:420;
  engine.player.x=spot+150;engine.player.y=base-engine.player.h;engine.player.facing=1;engine.player.pose='run';
  engine.cameraX=Math.max(0,Math.min(stage.length-960,spot));engine.elapsed=1.35;engine.status='playing';
  renderer.paint(engine);
  const card=document.createElement('canvas');card.width=360;card.height=240;
  card.getContext('2d').drawImage(full,120,40,720,480,0,0,360,240);
  return card.toDataURL('image/webp',.82);
 }
})(HangulRunner);
