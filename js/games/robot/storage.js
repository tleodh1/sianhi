(function(R){R.defaultBuild=()=>({id:"robot-"+Date.now(),name:"별빛 로봇",parts:Object.fromEntries(R.slots.map(s=>[s,R.parts[s][0].id])),colors:Object.fromEntries(R.slots.map(s=>[s,{primary:"#3bdcff",secondary:"#6754ff",accent:"#ffca3a"}])),record:{wins:0,losses:0}});R.stats=b=>{const o={hp:100,power:10,defense:10,speed:10,energy:100,jump:10};for(const s of R.slots){const p=R.parts[s].find(x=>x.id===b.parts[s]);for(const[k,v]of Object.entries(p?.stats||{}))o[k]+=v*3}return o};R.store={data(){state.records=state.records||{};return state.records.robotArena=state.records.robotArena||{version:1,robots:[],activeId:null}},saveRobot(b){const d=this.data(),c=JSON.parse(JSON.stringify(b)),i=d.robots.findIndex(x=>x.id===c.id);i<0?d.robots.push(c):d.robots[i]=c;d.activeId=c.id;save();return c},active(){const d=this.data();return d.robots.find(x=>x.id===d.activeId)||null}}})(window.SianRobot);

// Normalize a copy of legacy builds; never overwrite unrelated sianhi-v2 records.
(function(R){
  R.normalize=function(raw){
    const out=JSON.parse(JSON.stringify(raw)),base=R.defaultBuild();
    out.parts={...base.parts,...out.parts};out.colors=out.colors||{};
    for(const slot of R.slots){
      if(!R.parts[slot].some(p=>p.id===out.parts[slot]))out.parts[slot]=base.parts[slot];
      const old=out.colors[slot]||out.colors;
      out.colors[slot]=Object.fromEntries(['primary','secondary','accent'].map(ch=>[ch,/^#[\da-f]{6}$/i.test(old[ch])?old[ch]:base.colors[slot][ch]]));
    }
    out.record={wins:0,losses:0,...out.record};out.id=out.id||base.id;out.name=String(out.name||'별빛 로봇').slice(0,14);return out;
  };
})(window.SianRobot);
(function(R){
  R.recordBattle=function(build,difficulty,win){
    build.record[win?'wins':'losses']++;
    const key='robot-win-'+difficulty;let reward=0;
    if(win&&!state.completed[key]){reward=2;state.completed[key]=Date.now();state.stars+=reward;}
    R.store.saveRobot(build);return reward;
  };
})(window.SianRobot);
