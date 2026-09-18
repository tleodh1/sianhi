(function (R) {
  let root, canvas, selected = "head", yaw = .4, zoom = 1, build;
  const defaults = () => ({ parts: Object.fromEntries(R.slots.map((s) => [s, R.parts[s][0].id])), colors: { primary: "#3bdcff", secondary: "#6754ff", accent: "#ffca3a" } });
  const draw = () => R.render(canvas, build, yaw, zoom, selected);
  function optionButtons() { return R.parts[selected].map((p) => `<button data-part="${p.id}" class="${build.parts[selected] === p.id ? "on" : ""}">${p.name}<small>${Object.entries(p.stats).map(([k,v]) => `${k.toUpperCase()} ${v>0?"+":""}${v}`).join(" · ")}</small></button>`).join(""); }
  function refresh() { root.querySelector("[data-options]").innerHTML = optionButtons(); root.querySelectorAll("[data-part]").forEach((b) => b.onclick = () => { build.parts[selected] = b.dataset.part; refresh(); draw(); }); draw(); }
  R.start = function () {
    Session.begin(); root = gameBody; build = defaults();
    root.innerHTML = `<div class="robotApp"><header class="robotHeader"><div><small>SIANHi ROBOT ARENA</small><h2>🤖 로봇 메이커</h2></div><button data-back>← 게임월드</button></header><main class="robotMaker"><section class="robotStage"><canvas width="520" height="520" aria-label="조립한 로봇 360도 미리보기"></canvas><div class="robotZoom"><button data-zoom="-1">−</button><b>360°</b><button data-zoom="1">＋</button></div></section><section class="robotWorkshop"><h3>어느 부품을 바꿀까요?</h3><div class="robotSlots">${R.slots.map((s) => `<button data-slot="${s}" class="${s === selected ? "on" : ""}">${R.labels[s]}</button>`).join("")}</div><div class="robotOptions" data-options></div><button class="robotNext" disabled>색칠하고 저장하기 · 다음 단계 준비 중</button></section></main></div>`;
    canvas = root.querySelector("canvas"); root.querySelector("[data-back]").onclick = openGameWorld;
    root.querySelectorAll("[data-slot]").forEach((b) => b.onclick = () => { selected = b.dataset.slot; root.querySelectorAll("[data-slot]").forEach((x)=>x.classList.toggle("on",x===b)); refresh(); });
    root.querySelectorAll("[data-zoom]").forEach((b)=>b.onclick=()=>{zoom=Math.max(.75,Math.min(1.3,zoom+Number(b.dataset.zoom)*.1));draw();});
    let pointer = null, lastX = 0; canvas.onpointerdown=(e)=>{pointer=e.pointerId;lastX=e.clientX;canvas.setPointerCapture?.(pointer)}; canvas.onpointermove=(e)=>{if(e.pointerId!==pointer)return;yaw+=e.clientX-lastX;lastX=e.clientX;draw()}; canvas.onpointerup=canvas.onpointercancel=(e)=>{if(e.pointerId===pointer)pointer=null}; canvas.onwheel=(e)=>{e.preventDefault();zoom=Math.max(.75,Math.min(1.3,zoom-e.deltaY*.001));draw()};
    Session.cleanup(()=>{canvas.onpointerdown=canvas.onpointermove=canvas.onpointerup=canvas.onpointercancel=canvas.onwheel=null}); refresh();
  };
})(window.SianRobot);
