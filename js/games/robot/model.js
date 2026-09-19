/* Shared, genuinely three-dimensional robot assembly used by maker and arena. */
(function (R) {
  const T = THREE;
  R.makeModel = function (build) {
    const root = new T.Group();
    root.userData.build = JSON.parse(JSON.stringify(build));
    const parts = {};
    function mesh(group, geometry, channel, pos, size) {
      const color = build.colors[group.name]?.[channel] || '#73dcff';
      const material = new T.MeshStandardMaterial({color, roughness:.32, metalness:.3,
        emissive:channel === 'accent' ? color : 0, emissiveIntensity:channel === 'accent' ? .35 : 0});
      const m = new T.Mesh(geometry, material);
      m.userData.channel = channel;
      m.position.set(...pos); if (size) m.scale.set(...size);
      m.castShadow = m.receiveShadow = true; group.add(m); return m;
    }
    const ball = (g,ch,p,s) => mesh(g,new T.SphereGeometry(1,20,14),ch,p,s);
    const box = (g,ch,p,s) => mesh(g,new T.BoxGeometry(1,1,1),ch,p,s);
    const tube = (g,ch,p,r,h) => mesh(g,new T.CylinderGeometry(r,r,h,16),ch,p);
    const cone = (g,ch,p,r,h) => mesh(g,new T.ConeGeometry(r,h,12),ch,p);
    for (const slot of R.slots) {
      const g = new T.Group(); g.name = slot; parts[slot] = g; root.add(g);
      const id = build.parts[slot]; g.userData.partId = id;
      if (slot === 'head') {
        g.position.y = 2.55;
        ball(g,'primary',[0,0,0],[.51,.43,.42]);
        box(g,'secondary',[0,-.02,.37],[.66,.25,.16]);
        for (const x of [-.18,.18]) ball(g,'accent',[x,.02,.47],[.08,.075,.04]);
        if (id === 'scout') { tube(g,'secondary',[.46,.35,0],.04,.45); ball(g,'accent',[.46,.6,0],[.08,.08,.08]); }
        if (id === 'space') { ball(g,'secondary',[-.53,0,0],[.13,.27,.28]); ball(g,'secondary',[.53,0,0],[.13,.27,.28]); }
        if (id === 'dino') { for (let z=-.3;z<=.3;z+=.2) cone(g,'accent',[0,.51,z],.15,.35); box(g,'primary',[0,-.2,.44],[.7,.25,.45]); }
        if (id === 'knight') { cone(g,'secondary',[0,.55,0],.45,.5); for(const x of [-.18,0,.18]) box(g,'accent',[x,-.12,.48],[.035,.23,.035]); }
        if (id === 'future') { for(const x of [-.5,.5]) { const fin=box(g,'secondary',[x,.23,-.05],[.1,.8,.3]);fin.rotation.z=x; } }
      } else if (slot === 'body') {
        g.position.y=1.83;
        const wide=id==='heavy'?1.35:id==='light'?.8:1;
        ball(g,'primary',[0,0,0],[.6*wide,.62,.4]);
        box(g,'secondary',[0,-.4,0],[.65*wide,.2,.55]);
        ball(g,'accent',[0,.05,.4],[id==='energy'?.3:.17,.2,.055]);
        if(id==='heavy')for(const x of [-.62,.62])box(g,'secondary',[x,.16,0],[.3,.65,.6]);
        if(id==='energy')for(const x of [-.35,.35])tube(g,'accent',[x,.1,.32],.065,.56);
      } else if (slot.endsWith('Arm')) {
        g.position.set(slot==='leftArm'?-.88:.88,2,0);
        ball(g,'secondary',[0,0,0],[.26,.25,.25]);
        const thick=id==='power'?.34:id==='speed'?.15:.23;
        ball(g,'primary',[0,-.36,0],[thick,.42,thick]);
        ball(g,'accent',[0,-.68,.05],[.23,.18,.22]);
        if(id==='shield')ball(g,'secondary',[0,-.36,.28],[.4,.48,.12]);
        if(id==='drill') {const d=cone(g,'secondary',[0,-.92,0],.25,.55);d.rotation.z=Math.PI;}
        if(id==='speed')cone(g,'secondary',[0,-.2,-.28],.13,.55);
      } else if(slot.endsWith('Leg')) {
        g.position.set(slot==='leftLeg'?-.34:.34,1.14,0);
        ball(g,'primary',[0,-.32,0],[id==='heavy'?.32:.23,.4,.25]);
        box(g,'secondary',[0,-.91,.14],[id==='heavy'?.65:.47,.35,.68]);
        if(id==='speed') {const wheel=tube(g,'accent',[0,-.8,0],.3,.57);wheel.rotation.z=Math.PI/2;}
        if(id==='jump')for(let y=-.67;y<-.12;y+=.12)tube(g,'accent',[0,y,0],.25,.05);
        if(id==='basic')box(g,'accent',[0,-.45,.23],[.23,.2,.04]);
      } else if(slot==='back') {
        g.position.set(0,1.9,-.48);
        if(id==='pack'){box(g,'primary',[0,0,-.14],[.8,.8,.35]);for(const x of [-.22,.22])tube(g,'accent',[x,0,-.35],.07,.6);}
        else for(const x of [-.32,.32]){tube(g,'primary',[x,0,-.14],.22,id==='jet'?.9:.55);cone(g,'accent',[x,-.52,-.14],.15,.3);}
        box(g,'secondary',[0,.25,-.16],[1,.13,.23]);
      } else {
        g.position.set(1.05,1.25,.35);
        tube(g,'secondary',[0,0,0],.1,.45);
        if(id==='blaster'){const barrel=tube(g,'primary',[0,.2,.3],.19,.7);barrel.rotation.x=Math.PI/2;ball(g,'accent',[0,.2,.66],[.12,.12,.03]);}
        if(id==='sword'){box(g,'secondary',[0,.24,0],[.5,.1,.16]);box(g,'accent',[0,.8,0],[.16,1.05,.07]);cone(g,'accent',[0,1.38,0],.12,.2);}
        if(id==='hammer')box(g,'primary',[0,.65,0],[.85,.4,.5]);
        if(id==='drill'){const d=cone(g,'primary',[0,.2,.42],.28,.9);d.rotation.x=Math.PI/2;}
        if(id==='guard') {ball(g,'primary',[0,.2,.18],[.46,.59,.15]);ball(g,'accent',[0,.2,.34],[.2,.28,.04]);}
      }
    }
    root.userData.parts=parts;
    return root;
  };
  R.disposeModel = function (model) {
    model.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of (Array.isArray(o.material)?o.material:[o.material]))m.dispose();});
  };
})(window.SianRobot);
