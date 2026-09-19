(function (R) {
  R.createView = function (canvas, arena = false) {
    const T=THREE, renderer=new T.WebGLRenderer({canvas,antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=T.PCFSoftShadowMap;
    const scene=new T.Scene();scene.background=new T.Color('#0c1638');scene.fog=new T.Fog(0x0c1638,arena?18:9,arena?34:18);
    scene.add(new T.HemisphereLight(0xdbfaff,0x51478a,2.5));
    const light=new T.DirectionalLight(0xffffff,3);light.position.set(4,8,6);light.castShadow=true;scene.add(light);
    const rim=new T.DirectionalLight(0x9d76ff,2);rim.position.set(-4,3,-4);scene.add(rim);
    const floor=new T.Mesh(new T.CylinderGeometry(arena?11:2.3,arena?11:2.3,.2,64),new T.MeshStandardMaterial({color:0x354477,metalness:.3,roughness:.6}));
    floor.position.y=-.12;floor.receiveShadow=true;scene.add(floor);
    const grid=new T.GridHelper(arena?20:5,arena?20:10,0x67dfff,0x516190);grid.position.y=.01;scene.add(grid);
    const camera=new T.PerspectiveCamera(40,1,.1,100);camera.position.set(arena?11:4.8,arena?9.2:4.2,arena?15.5:7.2);camera.lookAt(0,arena?1.2:1.75,0);
    let model=null, signature='', disposed=false;
    const resize=()=>{const width=Math.max(1,canvas.clientWidth),height=Math.max(1,canvas.clientHeight);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();};
    const observer=new ResizeObserver(()=>{resize();renderer.render(scene,camera)});observer.observe(canvas);
    resize();
    return {scene,camera,renderer,
      show(build,yaw,zoom){const next=JSON.stringify([build.parts,build.colors]);if(next!==signature){if(model){scene.remove(model);R.disposeModel(model)}model=R.makeModel(build);scene.add(model);signature=next;}model.rotation.y=yaw;camera.zoom=zoom;camera.updateProjectionMatrix();renderer.render(scene,camera);},
      render(){if(!disposed)renderer.render(scene,camera)},
      dispose(){disposed=true;observer.disconnect();R.disposeModel(scene);renderer.dispose();renderer.forceContextLoss();}
    };
  };
})(window.SianRobot);
