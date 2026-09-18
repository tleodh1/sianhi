(function (R) {
  const rr = (c, x, y, w, h, r, fill, stroke = "#18365f") => { c.beginPath(); c.roundRect(x, y, w, h, r); c.fillStyle = fill; c.fill(); c.lineWidth = 3; c.strokeStyle = stroke; c.stroke(); };
  R.render = function (canvas, build, yaw = 0, zoom = 1, selected = "head") {
    const c = canvas.getContext("2d"), w = canvas.width, h = canvas.height;
    c.clearRect(0, 0, w, h); const sky = c.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, "#162757"); sky.addColorStop(1, "#5a35a4"); c.fillStyle = sky; c.fillRect(0, 0, w, h);
    c.save(); c.translate(w / 2, h * .57); c.scale(zoom * (yaw < 0 ? -1 : 1), zoom); c.translate(0, 8);
    const P = build.colors || { primary: "#3bdcff", secondary: "#6754ff", accent: "#ffca3a" };
    const glow = selected === "body" ? "#fff" : "#18365f";
    rr(c, -56, -62, 112, 112, 28, P.primary, glow); rr(c, -42, -50, 84, 36, 18, "#122344");
    c.fillStyle = P.accent; c.beginPath(); c.arc(-18, -32, 7, 0, 7); c.arc(18, -32, 7, 0, 7); c.fill();
    rr(c, -68, 45, 55, 95, 22, P.secondary, selected.includes("left") ? "#fff" : "#18365f"); rr(c, 13, 45, 55, 95, 22, P.secondary, selected.includes("right") ? "#fff" : "#18365f");
    rr(c, -118, -48, 48, 112, 20, P.primary, selected === "leftArm" ? "#fff" : "#18365f"); rr(c, 70, -48, 48, 112, 20, P.primary, selected === "rightArm" ? "#fff" : "#18365f");
    rr(c, -50, -150, 100, 82, 28, "#f7fbff", selected === "head" ? "#fff" : "#18365f"); rr(c, -37, -131, 74, 39, 18, "#102142");
    c.fillStyle = P.accent; c.beginPath(); c.arc(-16, -112, 7, 0, 7); c.arc(16, -112, 7, 0, 7); c.fill();
    rr(c, 108, -24, 75, 30, 14, P.accent, selected === "weapon" ? "#fff" : "#18365f");
    c.shadowColor = P.accent; c.shadowBlur = 18; c.fillStyle = P.accent; c.beginPath(); c.arc(0, -5, 18, 0, 7); c.fill(); c.shadowBlur = 0;
    c.restore(); c.fillStyle = "#ffffffaa"; c.font = "700 14px Pretendard"; c.textAlign = "center"; c.fillText("드래그해서 360°로 살펴봐요", w / 2, h - 18);
  };
})(window.SianRobot);
