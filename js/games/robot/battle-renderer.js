(function(R){
 R.createArenaView=function(canvas,engine){
  const view=R.createView(canvas,true),player=R.makeModel(engine.player.build),enemy=R.makeModel(engine.enemy.build),baseCamera=view.camera.position.clone();view.scene.add(player,enemy);
  const geometry=new THREE.SphereGeometry(.12,10,8),pool=Array.from({length:160},()=>{const material=new THREE.MeshBasicMaterial({color:0xffe875,transparent:true,opacity:1}),mesh=new THREE.Mesh(geometry,material);view.scene.add(mesh);return mesh;});
  function fighter(model,f){model.position.set(f.x,f.y,f.z);model.rotation.y=f.angle;model.rotation.z=f.hp<=0?.8:f.hurt>0?Math.sin(engine.time*55)*.12:0;const p=model.userData.parts,walk=f.walking?Math.sin(engine.time*12)*.4:0,attack=f.attackState,phase=attack?Math.sin((1-f.attackPose/attack.duration)*Math.PI):0;p.leftLeg.rotation.x=walk;p.rightLeg.rotation.x=-walk;p.leftArm.rotation.x=-walk;
   p.rightArm.rotation.x=attack?-(.55+phase*1.35):walk;p.rightArm.rotation.z=attack?.3*phase:0;p.weapon.rotation.x=attack?-(.45+phase*1.45):0;p.weapon.rotation.z=attack?.55*phase:0;
   model.traverse(o=>{if(!o.material)return;const accent=o.userData.channel==='accent';o.material.emissiveIntensity=f.flash>0?2.8:accent?.35:0;});
  }
  return {dispose:()=>view.dispose(),render(){fighter(player,engine.player);fighter(enemy,engine.enemy);const effects=[...engine.projectiles,...engine.particles];pool.forEach((m,i)=>{const q=effects[i];m.visible=!!q;if(!q)return;m.position.set(q.x,q.y,q.z);const scale=q.kind==='energyBall'?.42:q.kind==='shockwave'?1.15:q.kind==='barrier'?1.35:q.scale||.16;m.scale.set(q.kind==='shockwave'?scale*2:scale,q.kind==='shockwave'?.12:scale,q.kind==='shockwave'?scale*2:scale);m.material.opacity=Math.min(1,q.life*4);m.material.color.set(q.kind==='guard'||q.kind==='barrier'?0x66eaff:q.kind==='blast'?0xff7b45:q.kind==='wave'?0xb576ff:q.kind==='muzzle'?0xffffff:q.kind==='trail'?0x76f5ff:0xffe875);});
   if(engine.shake>0){const amount=engine.shake*.45;view.camera.position.set(baseCamera.x+(Math.random()-.5)*amount,baseCamera.y+(Math.random()-.5)*amount,baseCamera.z+(Math.random()-.5)*amount);view.camera.lookAt(0,0,0);}else view.camera.position.copy(baseCamera);view.render();
  }};
 };
})(window.SianRobot);
