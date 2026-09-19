(function(R){
  R.createArenaView=function(canvas,engine){
    const view=R.createView(canvas,true),player=R.makeModel(engine.player.build),enemy=R.makeModel(engine.enemy.build);
    view.scene.add(player,enemy);
    const geometry=new THREE.SphereGeometry(.12,10,8),material=new THREE.MeshBasicMaterial({color:0xffe875});
    const pool=Array.from({length:100},()=>{const m=new THREE.Mesh(geometry,material);view.scene.add(m);return m;});
    return {dispose:()=>view.dispose(),render(){
      for(const [model,f] of [[player,engine.player],[enemy,engine.enemy]]){
        model.position.set(f.x,f.y,f.z);model.rotation.y=f.angle;model.rotation.z=f.hp<=0?.8:0;
        const p=model.userData.parts,walk=f.walking?Math.sin(engine.time*12)*.4:0;
        p.leftLeg.rotation.x=walk;p.rightLeg.rotation.x=-walk;p.leftArm.rotation.x=-walk;
        p.rightArm.rotation.x=f.attackPose>0?-1.1:walk;p.weapon.rotation.x=f.attackPose>0?-.7:0;
      }
      const effects=[...engine.projectiles,...engine.particles];pool.forEach((m,i)=>{m.visible=i<effects.length;if(m.visible){const q=effects[i];m.position.set(q.x,q.y,q.z);}});view.render();
    }};
  };
})(window.SianRobot);
