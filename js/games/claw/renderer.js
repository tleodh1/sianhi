(function (C) {
  const src = "assets/claw/";
  function image(name) {
    return new Promise((ok, no) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => no(new Error("인형 친구들을 불러오지 못했어요."));
      i.src = src + name;
    });
  }
  C.loadArt = async () => {
    const [atlas, cabinet] = await Promise.all([
      image("plush-atlas.webp"),
      image("cabinet.webp"),
    ]);
    const toys = C.catalog.map((d) => {
      const rects = [
        [0, 0, 325, 448],
        [325, 0, 316, 448],
        [641, 0, 310, 448],
        [951, 0, 303, 448],
        [0, 460, 315, 373],
        [315, 460, 326, 373],
        [641, 455, 313, 378],
        [954, 460, 300, 373],
        [0, 833, 337, 406],
        [337, 833, 335, 406],
        [672, 833, 277, 406],
        [949, 833, 305, 406],
      ];
      const [x, y, w, h] = rects[d.sprite];
      const c = document.createElement("canvas");
      c.width = Math.ceil(w);
      c.height = Math.ceil(h);
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(atlas, x, y, w, h, 0, 0, w, h);
      const pixels = g.getImageData(0, 0, c.width, c.height).data;
      let left = c.width,
        top = c.height,
        right = 0,
        bottom = 0;
      for (let py = 0; py < c.height; py++)
        for (let px = 0; px < c.width; px++)
          if (pixels[(py * c.width + px) * 4 + 3] > 45) {
            left = Math.min(left, px);
            top = Math.min(top, py);
            right = Math.max(right, px);
            bottom = Math.max(bottom, py);
          }
      return {
        image: c,
        x: left,
        y: top,
        w: right - left + 1,
        h: bottom - top + 1,
      };
    });
    return { toys, cabinet };
  };
  C.project = (x, z, height = 0) => ({
    x: 400 + x * (1 - 0.17 * z),
    y: 389 - z * 124 - height,
    scale: 1 - z * 0.18,
  });
  C.Renderer = class {
    constructor(canvas, art) {
      this.canvas = canvas;
      this.g = canvas.getContext("2d", { alpha: false });
      this.art = art;
      this.resize();
    }
    resize() {
      this.dpr = Math.min(2, window.devicePixelRatio || 1);
      this.canvas.width = 800 * this.dpr;
      this.canvas.height = 533 * this.dpr;
    }
    toy(def, toy, extraHeight = 0, glow = false) {
      const g = this.g,
        p = C.project(toy.x, toy.z, toy.height + extraHeight),
        s = this.art.toys[def.sprite],
        h = def.radius * 2.9 * p.scale * (toy.scale || 1),
        w = (h * s.w) / s.h;
      g.save();
      // Rotate around the plush centre. Rotating around the feet made upside-down
      // large toys extend below the cabinet floor on narrow Safari screens.
      g.translate(p.x, p.y - h / 2);
      g.rotate((toy.tilt || 0)+(toy.pose==='upside-down'?Math.PI:0));
      if (glow) {
        g.shadowColor = C.rarities[def.rarity].color;
        g.shadowBlur = 20;
      }
      g.drawImage(s.image, s.x, s.y, s.w, s.h, -w / 2, -h / 2, w, h);
      g.restore();
      return { x: p.x, y: p.y, w, h };
    }
    paint(e) {
      const g = this.g,
        c = e.claw;
      g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      g.drawImage(this.art.cabinet, 0, 0, 800, 533);
      // Floor shadows are projected from true x/z, not arbitrary screen positions.
      for (const t of e.toys.filter((t) => !t.won && t !== e.held)) {
        const d = C.catalog.find((d) => d.id === t.id),
          p = C.project(t.x, t.z);
        g.fillStyle = "#154b5530";
        g.beginPath();
        g.ellipse(
          p.x,
          p.y - 2,
          d.radius * p.scale,
          10 * p.scale,
          0,
          0,
          Math.PI * 2,
        );
        g.fill();
      }
      const target = C.project(c.x, c.z);
      g.save();
      g.setLineDash([4, 5]);
      g.lineWidth = 1.5;
      g.strokeStyle = e.phase === "aim" ? "#fff2a4" : "#c6fbfa";
      g.beginPath();
      g.ellipse(
        target.x,
        target.y - 3,
        26 * target.scale,
        9 * target.scale,
        0,
        0,
        Math.PI * 2,
      );
      g.stroke();
      g.restore();
      const sorted = e.toys
        .filter((t) => !t.won && t !== e.held)
        .sort((a, b) => b.z - a.z);
      this.bounds = [];
      for (const t of sorted) {
        const d = C.catalog.find((d) => d.id === t.id);
        const b = this.toy(d, t);
        this.bounds.push({ ...b, toy: t });
      }
      if (e.held)
        this.toy(
          C.catalog.find((d) => d.id === e.held.id),
          e.held,
          0,
          true,
        );
      this.drawClaw(e);
      // Gentle glass highlights stay at the sides, leaving aiming unobstructed.
      g.save();
      g.globalAlpha = 0.14;
      g.fillStyle = "#fff";
      g.beginPath();
      g.moveTo(66, 96);
      g.lineTo(83, 88);
      g.lineTo(65, 331);
      g.lineTo(57, 352);
      g.fill();
      g.beginPath();
      g.moveTo(716, 113);
      g.lineTo(732, 101);
      g.lineTo(745, 336);
      g.lineTo(733, 348);
      g.fill();
      g.restore();
      const phaseLabels = {
        aim: "인형의 가운데를 맞춰요",
        descend: "집게가 내려가요",
        close: "세 발로 꼬옥!",
        lift: "조심조심 올려요",
        transport: "선물 출구로 이동해요",
        release: "선물 출구에 내려놓아요",
        reveal: "두근두근, 누구일까요?",
        result: "다시 만날 준비!",
      };
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = "800 16px Pretendard,sans-serif";
      g.fillStyle = "#654a33";
      g.fillText(phaseLabels[e.phase], 481, 479);
      g.fillStyle = "#48796d";
      g.font = "700 11px Pretendard,sans-serif";
      g.fillText("SIANHi · TOY ATELIER", 481, 501);
      if (e.phase === "release" && e.result?.success) {
        const d = C.catalog.find((d) => d.id === e.result.toyId),
          fall = C.clamp((e.phaseTime - 0.3) / 0.4, 0, 1);
        g.save();
        g.beginPath();
        g.rect(78, 310, 192, 80);
        g.clip();
        this.toy(d, {
          x: -199,
          z: 0.07,
          height: 150 * (1 - fall),
          tilt: fall * 0.2,
        });
        g.restore();
      }
      if (e.phase === "reveal" && e.result?.success) {
        const d = C.catalog.find((d) => d.id === e.result.toyId),
          p = e.phaseTime;
        g.save();
        g.translate(400, 250);
        g.rotate(Math.sin(p * 18) * 0.05);
        const gift = g.createLinearGradient(-65, -55, 65, 60);
        gift.addColorStop(0, "#fff7ce");
        gift.addColorStop(1, C.rarities[d.rarity].color);
        g.fillStyle = gift;
        g.shadowColor = "#fff7c6";
        g.shadowBlur = 24;
        g.beginPath();
        g.roundRect(-64, -30, 128, 94, 17);
        g.fill();
        g.fillStyle = "#fff5d5";
        g.fillRect(-9, -30, 18, 94);
        g.fillStyle = C.rarities[d.rarity].color;
        g.beginPath();
        g.roundRect(-70, -46 - p * 20, 140, 25, 8);
        g.fill();
        g.restore();
        g.save();
        g.globalAlpha = Math.sin((Math.min(1, p) * Math.PI) / 2) * 0.35;
        g.fillStyle = C.rarities[d.rarity].color;
        g.fillRect(0, 0, 800, 533);
        g.restore();
        for (let i = 0; i < 12 + d.rarity * 8; i++) {
          const a = i * 2.4,
            power = 25 + p * (60 + d.rarity * 25);
          this.star(
            400 + Math.cos(a) * power,
            240 + Math.sin(a) * power,
            4 + d.rarity,
            "#fff4b2",
          );
        }
      }
    }
    star(x, y, r, color) {
      const g = this.g;
      g.fillStyle = color;
      g.beginPath();
      for (let n = 0; n < 10; n++) {
        const a = (n * Math.PI) / 5 - Math.PI / 2,
          rr = n % 2 ? r * 0.43 : r;
        g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      g.closePath();
      g.fill();
    }
    drawClaw(e) {
      const g = this.g,
        c = e.claw,
        p = C.project(c.x, c.z, c.height),
        railY = 46 + c.z * 24;
      const sway = Math.sin(e.elapsed * 6) * c.sway * 17;
      // Articulated three-prong mechanism; metallic gradients and independent joints.
      const metal = g.createLinearGradient(p.x - 22, 0, p.x + 22, 0);
      metal.addColorStop(0, "#567580");
      metal.addColorStop(0.35, "#f0faf9");
      metal.addColorStop(0.6, "#9fb3bd");
      metal.addColorStop(1, "#52747f");
      g.strokeStyle = "#53757e";
      g.lineWidth = 5;
      g.beginPath();
      g.moveTo(153, railY);
      g.lineTo(647, railY);
      g.stroke();
      g.strokeStyle = "#e8f7f4";
      g.lineWidth = 2;
      g.stroke();
      g.fillStyle = metal;
      g.beginPath();
      g.roundRect(p.x - 22, railY - 12, 44, 25, 7);
      g.fill();
      g.fillStyle = "#f4a784";
      g.beginPath();
      g.roundRect(p.x - 9, railY - 7, 18, 13, 4);
      g.fill();
      g.strokeStyle = "#5b6976";
      g.lineWidth = 4;
      g.beginPath();
      g.moveTo(p.x, railY + 12);
      g.lineTo(p.x + sway, p.y - 22);
      g.stroke();
      g.strokeStyle = "#e8f3f4";
      g.lineWidth = 1;
      g.stroke();
      g.save();
      g.translate(p.x + sway, p.y - 15);
      g.rotate(Math.sin(e.elapsed * 6) * c.sway * 0.3);
      const spread = 16 + c.open * 36;
      // Rear finger is drawn behind the central housing.
      this.finger(
        [
          [0, -1],
          [8, 22 + c.open * 5],
          [0, 38 - c.open * 9],
        ],
        metal,
        7,
      );
      g.fillStyle = metal;
      g.beginPath();
      g.roundRect(-19, -17, 38, 31, 10);
      g.fill();
      g.fillStyle = "#61cfc9";
      g.beginPath();
      g.ellipse(0, -12, 18, 7, 0, 0, Math.PI * 2);
      g.fill();
      for (const dir of [-1, 1]) {
        this.finger(
          [
            [dir * 14, 2],
            [dir * spread, 28],
            [dir * (10 + c.open * 31), 57 - c.open * 10],
          ],
          metal,
          10,
        );
        g.fillStyle = "#536f78";
        g.beginPath();
        g.arc(dir * 14, 2, 4, 0, Math.PI * 2);
        g.fill();
      }
      g.restore();
    }
    finger(points, metal, w) {
      const g = this.g;
      g.lineJoin = "round";
      g.lineCap = "round";
      g.strokeStyle = "#35555f";
      g.lineWidth = w + 3;
      g.beginPath();
      points.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
      g.stroke();
      g.strokeStyle = metal;
      g.lineWidth = w;
      g.stroke();
      g.strokeStyle = "#f4fbfa";
      g.lineWidth = 2;
      g.stroke();
    }
    pick(px, py, e) {
      for (const b of [...(this.bounds || [])].reverse())
        if (
          px >= b.x - b.w / 2 &&
          px <= b.x + b.w / 2 &&
          py >= b.y - b.h &&
          py <= b.y
        )
          return { x: b.toy.x, z: b.toy.z };
      const z = C.clamp((389 - py) / 124, 0.08, 0.94);
      return { x: C.clamp((px - 400) / (1 - 0.17 * z), -240, 240), z };
    }
    card(def, size = 280) {
      const s = this.art.toys[def.sprite],
        c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const g = c.getContext("2d"),
        h = size * 0.9,
        w = (h * s.w) / s.h;
      g.drawImage(s.image, s.x, s.y, s.w, s.h, (size - w) / 2, size - h, w, h);
      return c.toDataURL("image/png");
    }
  };
})(SianClaw);
