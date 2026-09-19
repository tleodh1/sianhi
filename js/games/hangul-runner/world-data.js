/* Public content registry. Add worlds/stages without branching the physics engine. */
(function(H){
 H.worlds=[];H.worldStages=[];
 H.registerWorld=function(world,stages){H.worlds.push(world);for(const s of stages)H.worldStages.push({...s,worldId:world.id,id:`${world.id}-${s.number}`,mode:s.mode||world.mode,theme:world.theme});};
 H.worldProgress=function(state){const old=H.readProgress(state),saved=old.adventure;
  if(saved)return {...saved,stages:{...saved.stages},worldRewards:{...saved.worldRewards}};
  // Legacy lessons do not mean the new bosses were defeated. Preserve evidence separately.
  return {version:1,stages:{},worldRewards:{},lastStage:'1-1',legacyStages:JSON.parse(JSON.stringify(old.stages||{}))};
 };
 H.recordWorldClear=function(state,result){const old=H.readProgress(state),p=H.worldProgress(state),prev=p.stages[result.stageId];
  let earned=Math.max(0,result.rating-(prev?.rating||0));
  p.stages[result.stageId]={...result,rating:Math.max(prev?.rating||0,result.rating),seconds:Math.min(prev?.seconds??Infinity,result.seconds)};
  if(result.boss&&!p.worldRewards[result.worldId]){p.worldRewards[result.worldId]={sticker:`world-${result.worldId}`,earnedAt:Date.now()};earned+=3;}
  const index=H.worldStages.findIndex(s=>s.id===result.stageId);p.lastStage=H.worldStages[index+1]?.id||result.stageId;
  state.records=state.records||{};state.records.hangulRunner={...old,adventure:p};state.stars=(Number(state.stars)||0)+earned;return earned;
 };
 H.buildWorldStage=function(id){const d=H.worldStages.find(s=>s.id===id);if(!d)throw Error('Unknown adventure stage '+id);
  const world=H.worlds.find(w=>w.id===d.worldId),span=d.span||900;
  const length=d.words.length*span+700,stage={...d,span,world,words:[...d.words],length,sections:[{id:'start',x:0},{id:'move',x:span*.55},{id:'enemy',x:span*1.25},{id:'blocks',x:span*2.05},{id:'platform',x:Math.min(length-1200,span*3.05)},{id:'final',x:length-700}],platforms:[],blocks:[],items:[],enemies:[],hazards:[],checkpoints:[{x:60,y:420,id:0}],currents:[],gates:[]};
  d.words.forEach((text,i)=>{const x=i*span,water=d.mode==='swim',flight=d.mode==='fly';
   stage.platforms.push({x,y:420,w:span-(d.gap||90),h:300,kind:'ground'});
   if(water)stage.platforms[stage.platforms.length-1].y=510;
   const ly=water||flight?160+(i%3)*85:329;
   stage.items.push({id:'letter-'+i,index:i,kind:'letter',text,x:x+215,y:ly,w:62,h:62});
   for(let j=0;j<3;j++)stage.items.push({id:`coin-${i}-${j}`,kind:'coin',x:x+310+j*45,y:ly-70,w:30,h:36});
   stage.items.push({id:'star-'+i,kind:'star',x:x+400,y:ly-110,w:32,h:36});
   if(i%2===0)stage.items.push({id:'power-'+i,kind:'power',x:x+110,y:ly,w:40,h:45});
   if(i>0&&i%2===0)stage.checkpoints.push({id:i/2,x:x+40,y:water?300:420});
  });
  stage.platforms.push({x:d.words.length*span,y:d.mode==='swim'?510:420,w:700,h:300,kind:'ground'});
  stage.goal={x:stage.length-155,y:d.mode==='swim'?335:330,w:54,h:90,kind:'beacon',active:false};
  if(H.decorateWorldStage)H.decorateWorldStage(stage);if(H.prepareBoss)H.prepareBoss(stage);return stage;
 };
})(HangulRunner);
