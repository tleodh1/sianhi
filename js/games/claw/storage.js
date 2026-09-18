(function(C){
 C.progress=function(state){const r=state.records.clawMachine||{};state.records.clawMachine={...r,version:1,inventory:{...(r.inventory||{})},coins:Number.isFinite(r.coins)?r.coins:10,attempts:r.attempts||0,wins:r.wins||0,streak:r.streak||0,best:r.best||0};return state.records.clawMachine;};
 C.reward=function(state,id){const r=C.progress(state),d=C.catalog.find(d=>d.id===id);if(!d)return null;const isNew=!r.inventory[id];r.inventory[id]=(r.inventory[id]||0)+1;r.wins++;r.streak++;r.best=Math.max(r.best,r.streak);const stars=isNew?d.rarity+1:1;state.stars+=stars;return {isNew,stars,count:r.inventory[id]};};
})(SianClaw);
