(function(A){
  function record(){
    state.records=state.records||{};
    state.records.englishFriends=state.records.englishFriends||{version:1,friends:{},levels:{}};
    return state.records.englishFriends;
  }
  A.isNew=(id)=>!record().friends[id];
  A.discover=function(monster,level){
    const r=record(),fresh=!r.friends[monster.id];
    if(fresh){r.friends[monster.id]={foundAt:Date.now(),stage:level};state.stars+=1;}
    save(); return fresh;
  };
  A.finish=function(level,moves,seconds){
    const r=record(),old=r.levels[level]||{};
    r.levels[level]={plays:(old.plays||0)+1,bestMoves:old.bestMoves?Math.min(old.bestMoves,moves):moves,bestSeconds:old.bestSeconds?Math.min(old.bestSeconds,seconds):seconds,complete:true};
    const rewardKey="memory-collection-level-"+level;
    if(!state.completed[rewardKey]){state.completed[rewardKey]=Date.now();state.stars+=1;}
    save();
  };
  A.getRecord=record;
})(SianMemory);
