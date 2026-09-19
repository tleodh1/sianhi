/* Shared original SianHi hero-mecha assembly. Maker and battle use this exact model. */
(function(R){
 const T=THREE;
 R.makeModel=function(build){
  const root=new T.Group(),parts={};root.userData.build=JSON.parse(JSON.stringify(build));
  function material(slot,channel){const selected=build.colors[slot]?.[channel]||'#73dcff';if(channel==='mechanical')return new T.MeshStandardMaterial({color:0x111827,roughness:.48,metalness:.82});if(channel==='rubber')return new T.MeshStandardMaterial({color:0x090d18,roughness:.92,metalness:.06});if(channel==='glass')return new T.MeshPhysicalMaterial({color:selected,roughness:.08,metalness:.15,transparent:true,opacity:.72,transmission:.18,emissive:selected,emissiveIntensity:.7});return new T.MeshStandardMaterial({color:selected,roughness:channel==='primary'?.24:.38,metalness:channel==='accent'?.45:.72,emissive:channel==='accent'?selected:0,emissiveIntensity:channel==='accent'?1.25:0});}
  function add(g,geo,ch,pos,scale,rot){const m=new T.Mesh(geo,material(g.name,ch));m.userData.channel=ch;m.position.set(...pos);m.scale.set(...(scale||[1,1,1]));if(rot)m.rotation.set(...rot);m.castShadow=m.receiveShadow=true;g.add(m);return m;}
  const box=(g,ch,p,s,r)=>add(g,new T.BoxGeometry(1,1,1),ch,p,s,r),ball=(g,ch,p,s)=>add(g,new T.SphereGeometry(1,18,12),ch,p,s),tube=(g,ch,p,rad,h,r)=>add(g,new T.CylinderGeometry(rad,rad,h,14),ch,p,[1,1,1],r),cone=(g,ch,p,rad,h,r)=>add(g,new T.ConeGeometry(rad,h,12),ch,p,[1,1,1],r),torus=(g,ch,p,rad,t,r)=>add(g,new T.TorusGeometry(rad,t,8,18),ch,p,[1,1,1],r);
  function panel(g,ch,p,s,tilt=0){return box(g,ch,p,s,[tilt,0,0]);}
  function bolt(g,x,y,z){return tube(g,'mechanical',[x,y,z],.035,.035,[Math.PI/2,0,0]);}
  function vent(g,p,w=.28){for(let i=-1;i<=1;i++)box(g,'mechanical',[p[0]+i*w*.28,p[1],p[2]],[w*.18,.035,.08],[.2,0,0]);}
  for(const slot of R.slots){const g=new T.Group();g.name=slot;g.userData.partId=build.parts[slot];parts[slot]=g;root.add(g);const id=build.parts[slot];
   if(slot==='head'){
    g.position.y=3.12;box(g,'primary',[0,0,0],[.62,.42,.46]);panel(g,'secondary',[0,-.08,.28],[.72,.25,.18],-.18);box(g,'glass',[0,.05,.32],[.48,.105,.08]);for(const x of [-.2,.2]){box(g,'accent',[x,.05,.375],[.11,.045,.035]);bolt(g,x,-.16,.38);}box(g,'mechanical',[0,-.29,0],[.32,.17,.3]);
    if(id==='scout'){tube(g,'secondary',[.4,.3,0],.045,.55);ball(g,'accent',[.4,.59,0],[.08,.08,.08]);}
    if(id==='space'){for(const x of [-.42,.42]){ball(g,'secondary',[x,0,0],[.15,.27,.28]);torus(g,'accent',[x,0,.03],.13,.025,[Math.PI/2,0,0]);}}
    if(id==='dino'){for(let z=-.24;z<=.24;z+=.16)cone(g,'accent',[0,.36,z],.12,.34);panel(g,'primary',[0,-.22,.3],[.74,.23,.38],-.16);}
    if(id==='knight'){cone(g,'secondary',[0,.45,-.02],.38,.62);for(const x of [-.16,0,.16])box(g,'accent',[x,-.04,.39],[.025,.22,.035]);}
    if(id==='future')for(const x of [-.42,.42]){const fin=panel(g,'secondary',[x,.18,-.03],[.1,.78,.32]);fin.rotation.z=x>0?-.28:.28;}
   }else if(slot==='body'){
    g.position.y=2.22;const wide=id==='heavy'?1.22:id==='light'?.88:1;box(g,'primary',[0,.12,0],[1.12*wide,.76,.58]);panel(g,'secondary',[0,.2,.34],[.76*wide,.43,.16],-.16);panel(g,'primary',[0,-.37,.04],[.72*wide,.28,.5],.08);const core=torus(g,'accent',[0,.15,.45],id==='energy'?.24:.17,.055,[Math.PI/2,0,0]);ball(g,'glass',[0,.15,.45],[id==='energy'?.18:.11,id==='energy'?.18:.11,.06]);root.userData.core=core;
    for(const x of [-.42*wide,.42*wide]){panel(g,'secondary',[x,.19,.16],[.3,.58,.42],x*.18);bolt(g,x,.38,.4);}vent(g,[0,-.35,.31],.42);box(g,'mechanical',[0,-.58,0],[.44,.18,.36]);
    if(id==='heavy')for(const x of [-.68,.68]){panel(g,'primary',[x,.25,0],[.34,.72,.68],x*.18);box(g,'secondary',[x,.46,.04],[.38,.18,.72]);}
    if(id==='light')for(const x of [-.55,.55])cone(g,'secondary',[x,.12,-.08],.12,.55,[0,0,x>0?-.35:.35]);
    if(id==='energy')for(const x of [-.37,.37])tube(g,'accent',[x,.08,.32],.055,.5,[0,0,0]);
   }else if(slot.endsWith('Arm')){
    const left=slot==='leftArm',side=left?-1:1;g.position.set(side*.86,2.62,0);ball(g,'mechanical',[0,0,0],[.22,.22,.22]);torus(g,'accent',[0,0,0],.22,.035,[0,0,Math.PI/2]);panel(g,'primary',[side*.18,.02,0],[.5,.44,.58],0);panel(g,'secondary',[side*.25,.08,-.02],[.28,.3,.64],0);const thick=id==='power'?.34:id==='speed'?.2:.27;box(g,'primary',[0,-.48,0],[thick*1.65,.62,thick*1.55]);box(g,'mechanical',[0,-.83,0],[.25,.18,.24]);for(const x of [-.1,.1])tube(g,'mechanical',[x,-.42,.25],.035,.38,[Math.PI/2,0,0]);
    if(id==='power'){panel(g,'secondary',[side*.12,-.46,.2],[.48,.7,.2],-.12);bolt(g,0,-.31,.34);}
    if(id==='speed'){cone(g,'secondary',[0,-.2,-.34],.13,.7,[.3,0,0]);panel(g,'accent',[0,-.48,.22],[.15,.45,.05]);}
    if(id==='shield'){const shield=panel(g,'primary',[side*.05,-.47,.38],[.75,.88,.14]);shield.rotation.z=side*.1;torus(g,'accent',[side*.05,-.47,.47],.24,.04,[Math.PI/2,0,0]);}
    if(id==='drill'){cone(g,'secondary',[0,-1.02,0],.27,.68,[0,0,Math.PI]);for(let y=-.73;y>-.98;y-=.1)torus(g,'accent',[0,y,0],.18+(Math.abs(y+.73)*.25),.018);}
   }else if(slot.endsWith('Leg')){
    const left=slot==='leftLeg',side=left?-1:1;g.position.set(side*.37,1.62,0);ball(g,'mechanical',[0,0,0],[.22,.25,.22]);panel(g,'primary',[0,-.34,.02],[id==='heavy'?.5:.38,.58,.42],-.04);box(g,'mechanical',[0,-.7,0],[.23,.2,.25]);panel(g,'secondary',[0,-.98,.04],[id==='heavy'?.56:.42,.55,.48],.04);panel(g,'primary',[0,-1.31,.18],[id==='heavy'?.68:.54,.26,.82],-.08);box(g,'rubber',[0,-1.43,.22],[id==='heavy'?.7:.57,.12,.86]);for(const x of [-.13,.13])tube(g,'mechanical',[x,-.35,.25],.035,.35,[Math.PI/2,0,0]);
    if(id==='speed'){const wheel=tube(g,'rubber',[side*.28,-.93,0],.31,.18,[0,0,Math.PI/2]);torus(g,'accent',[side*.38,-.93,0],.2,.035,[0,Math.PI/2,0]);wheel.userData.wheel=true;}
    if(id==='heavy')for(const x of [-.22,.22])box(g,'mechanical',[x,-1.3,.2],[.12,.17,.76]);
    if(id==='jump')for(let y=-.92;y<-.65;y+=.1)torus(g,'accent',[0,y,0],.18,.025,[Math.PI/2,0,0]);
    if(id==='basic')vent(g,[0,-1,.3],.32);
   }else if(slot==='back'){
    g.position.set(0,2.28,-.42);box(g,'mechanical',[0,0,0],[.62,.72,.25]);
    if(id==='pack'){panel(g,'primary',[0,.02,-.18],[.92,.82,.34]);for(const x of [-.28,.28]){tube(g,'accent',[x,0,-.42],.075,.62);vent(g,[x,.22,-.38],.22);}}
    else for(const x of [-.36,.36]){tube(g,'primary',[x,-.06,-.22],.21,id==='jet'?.95:.68);cone(g,'accent',[x,-.62,-.22],.16,.38);const wing=panel(g,'secondary',[x*1.72,.12,-.12],[.62,.12,.78]);wing.rotation.z=x>0?-.18:.18;}
    panel(g,'secondary',[0,.3,-.12],[1.15,.14,.32]);
   }else{
    g.position.set(1.16,1.86,.28);box(g,'mechanical',[0,0,0],[.22,.48,.22]);
    if(id==='blaster'){panel(g,'primary',[0,.22,.28],[.42,.48,.95],-.08);tube(g,'mechanical',[0,.2,.86],.15,.8,[Math.PI/2,0,0]);tube(g,'accent',[0,.2,1.31],.11,.08,[Math.PI/2,0,0]);for(const x of [-.18,.18])box(g,'secondary',[x,.28,.28],[.1,.56,.74]);}
    if(id==='sword'){panel(g,'secondary',[0,.24,0],[.62,.13,.24]);box(g,'accent',[0,1.02,0],[.17,1.55,.075]);cone(g,'accent',[0,1.87,0],.13,.26);for(const x of [-.25,.25])cone(g,'primary',[x,.23,0],.1,.28,[0,0,x>0?Math.PI/2:-Math.PI/2]);}
    if(id==='hammer'){box(g,'primary',[0,.76,0],[1.08,.55,.62]);panel(g,'secondary',[0,.77,.35],[.78,.34,.15]);for(const x of [-.38,.38])bolt(g,x,.78,.43);}
    if(id==='drill'){const d=cone(g,'primary',[0,.24,.67],.34,1.25,[Math.PI/2,0,0]);for(let z=.28;z<.9;z+=.16)torus(g,'accent',[0,.24,z],.22-(z-.28)*.16,.025,[Math.PI/2,0,0]);d.userData.drill=true;}
    if(id==='guard'){ball(g,'primary',[0,.25,.28],[.58,.7,.16]);torus(g,'accent',[0,.25,.45],.34,.055,[Math.PI/2,0,0]);panel(g,'secondary',[0,.25,.43],[.24,.7,.08]);}
   }
  }
  root.userData.parts=parts;return root;
 };
 R.disposeModel=function(model){model.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of(Array.isArray(o.material)?o.material:[o.material]))m.dispose();});};
})(window.SianRobot);
