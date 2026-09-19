/* Pure, deterministic fixed-step crane simulation. No random success gate. */
(function (C) {
  const approach = (a, b, s) =>
    Math.abs(b - a) <= s ? b : a + Math.sign(b - a) * s;
  C.evaluateGrip = function (claw, toy, def) {
    const scale=toy.scale||1,effectiveRadius=def.radius*scale;
    const distance = Math.hypot(claw.x - toy.x, (claw.z - toy.z) * 210);
    const enclosure = C.clamp(1 - distance / C.grabReach(toy, def), 0, 1);
    const sizeFit = C.clamp(1 - Math.abs(effectiveRadius - 48) / 95, 0.58, 1);
    const force = claw.strength * enclosure * sizeFit;
    const load = def.mass * Math.pow(scale,1.35) * (0.65 + claw.sway * 0.7);
    const interference=toy.interference||0;
    return { distance, enclosure, sizeFit, force, load, interference, margin: force - load-interference };
  };
  C.Engine = class {
    constructor(options = {}) {
      this.onEvent = options.onEvent || (() => {});
      this.toys = C.layout();
      this.claw = {
        x: 0,
        z: 0.55,
        height: 180,
        open: 1,
        strength: 1.7,
        sway: 0,
      };
      this.phase = "aim";
      this.phaseTime = 0;
      this.elapsed = 0;
      this.held = null;
      this.target = null;
      this.targetHeight = 0;
      this.aimTarget = null;
      this.round = 0;
      this.attempts = options.attempts ?? 10;
      this.grip = null;
      this.result = null;
      this.events = {};
    }
    emit(type, detail = {}) {
      this.events[type] = (this.events[type] || 0) + 1;
      this.onEvent({ type, ...detail });
    }
    enter(phase) {
      this.phase = phase;
      this.phaseTime = 0;
      this.emit("phase", { phase });
    }
    aim(x, z) {
      if (this.phase === "aim")
        this.aimTarget = {
          x: C.clamp(x, -240, 240),
          z: C.clamp(z, 0.08, 0.94),
        };
    }
    refill() {
      if (this.phase === "aim" && this.attempts === 0) {
        this.attempts = 10;
        this.emit("refill");
        return true;
      }
      return false;
    }
    drop() {
      if (this.phase !== "aim" || this.attempts <= 0) return false;
      this.attempts--;
      this.round++;
      this.aimTarget = null;
      this.result = null;
      this.held = null;
      this.target = null;
      this.grip = null;
      const candidates = this.toys
        .filter((t) => !t.won)
        .map((t) => ({
          t,
          d: C.catalog.find((d) => d.id === t.id),
          distance: Math.hypot(this.claw.x - t.x, (this.claw.z - t.z) * 210),
        }))
        .filter((o) => o.distance < C.grabReach(o.t, o.d))
        .sort((a, b) => a.distance - b.distance);
      this.target = candidates[0]?.t || null;
      if(this.target){const d=C.catalog.find(d=>d.id===this.target.id);this.target.interference=this.toys.filter(t=>t!==this.target&&!t.won&&Math.hypot(t.x-this.target.x,(t.z-this.target.z)*210)<(d.radius*(this.target.scale||1)+C.catalog.find(x=>x.id===t.id).radius*(t.scale||1))*.72).length*.055;}
      this.targetHeight = this.target
        ? C.catalog.find((d) => d.id === this.target.id).radius * (this.target.scale||1) * 0.7 + 8
        : 10;
      this.enter("descend");
      this.emit("attempt");
      return true;
    }
    resetRound() {
      if (this.phase !== "result") return;
      this.claw.open = 1;
      this.claw.height = 180;
      this.claw.sway = 0;
      this.held = null;
      this.result = null;
      this.enter("aim");
    }
    restock() {
      if (this.phase === "aim" && this.toys.every((t) => t.won)) {
        this.toys = C.layout();
        this.emit("restock");
      }
    }
    step(dt, input = {}) {
      dt = C.clamp(dt, 0, 0.025);
      this.elapsed += dt;
      this.phaseTime += dt;
      for (const t of this.toys) {
        if (t === this.held || t.won) continue;
        if (t.height > 0 || t.vy !== 0) {
          t.vy -= 450 * dt;
          t.height += t.vy * dt;
          if (t.height < 0) {
            t.height = 0;
            t.vy = Math.abs(t.vy) > 35 ? -t.vy * 0.22 : 0;
          }
        }
        t.tilt *= Math.exp(-dt * 3);
        C.constrainToy(t);
      }
      const c = this.claw;
      if (this.phase === "aim") {
        let dx = (input.right ? 1 : 0) - (input.left ? 1 : 0),
          dz = (input.back ? 1 : 0) - (input.front ? 1 : 0);
        if (dx || dz) this.aimTarget = null;
        const oldX = c.x,
          oldZ = c.z;
        if (this.aimTarget) {
          c.x = approach(c.x, this.aimTarget.x, 155 * dt);
          c.z = approach(c.z, this.aimTarget.z, 0.48 * dt);
          if (c.x === this.aimTarget.x && c.z === this.aimTarget.z)
            this.aimTarget = null;
        } else {
          c.x = C.clamp(c.x + dx * 155 * dt, -240, 240);
          c.z = C.clamp(c.z + dz * 0.48 * dt, 0.08, 0.94);
        }
        const moving = Math.abs(c.x - oldX) + Math.abs(c.z - oldZ) > 0;
        c.sway = approach(c.sway, moving ? 0.16 : 0, dt * 0.55);
        return;
      }
      if (this.phase === "descend") {
        c.height = approach(c.height, this.targetHeight, 155 * dt);
        c.sway *= Math.exp(-dt * 2);
        if (c.height === this.targetHeight) this.enter("close");
      } else if (this.phase === "close") {
        c.open = C.clamp(1 - this.phaseTime / 0.65, 0.18, 1);
        if (this.target)
          this.target.tilt += Math.sin(this.phaseTime * 13) * 0.018;
        if (this.phaseTime >= 0.65) {
          if (this.target) {
            this.grip = C.evaluateGrip(
              c,
              this.target,
              C.catalog.find((d) => d.id === this.target.id),
            );
            if (this.grip.enclosure > 0.2 && this.grip.margin > -0.3) {
              this.held = this.target;
              this.emit("grip", { quality: this.grip });
            } else {this.target.x+=(this.claw.x-this.target.x)*.16;this.target.z+=(this.claw.z-this.target.z)*.08;this.target.vy=18;C.constrainToy(this.target);this.emit("miss", { reason: "off-center" });}
          } else this.emit("miss", { reason: "empty" });
          this.enter("lift");
        }
      } else if (this.phase === "lift") {
        c.height = approach(c.height, 180, 132 * dt);
        c.sway = 0.08 + Math.abs(Math.sin(this.phaseTime * 4)) * 0.08;
        if (this.held) {
          const d = C.catalog.find((d) => d.id === this.held.id),
            dynamicLoad = d.mass * (0.83 + c.sway * 0.7);
          if (this.phaseTime > 0.22 && this.grip.force < dynamicLoad) {
            this.releaseToy("lift");
          }
        }
        if (c.height === 180) {
          this.transportStart = { x: c.x, z: c.z };
          this.enter("transport");
        }
      } else if (this.phase === "transport") {
        const t = C.clamp(this.phaseTime / 1.9, 0, 1),
          ease = t * t * (3 - 2 * t);
        c.x = this.transportStart.x + (-199 - this.transportStart.x) * ease;
        c.z = this.transportStart.z + (0.07 - this.transportStart.z) * ease;
        c.sway = Math.abs(Math.sin(t * Math.PI * 3)) * 0.19;
        if (this.held) {
          const d = C.catalog.find((d) => d.id === this.held.id);
          if (this.grip.force < d.mass * (0.92 + c.sway * 0.7))
            this.releaseToy("transport");
        }
        if (t === 1) this.enter("release");
      } else if (this.phase === "release") {
        c.open = C.clamp(0.18 + this.phaseTime * 1.8, 0.18, 1);
        if (this.held && this.phaseTime > 0.3) {
          const toy = this.held;
          this.held = null;
          toy.won = true;
          this.result = { success: true, toyId: toy.id, round: this.round };
          this.emit("delivery", { toyId: toy.id });
        }
        if (this.phaseTime > 0.9) {
          if (!this.result) this.result = { success: false, round: this.round };
          this.enter("reveal");
        }
      } else if (this.phase === "reveal") {
        if (this.phaseTime > 1.05) {
          this.enter("result");
          this.emit("result", { result: this.result });
        }
      }
      if (this.held) {
        this.held.x = c.x;
        this.held.z = c.z;
        this.held.height = Math.max(0, c.height - this.targetHeight);
        this.held.tilt = Math.sin(this.elapsed * 7) * c.sway;
      }
    }
    releaseToy(phase) {
      const t = this.held;
      if (!t) return;
      t.height = Math.max(0, this.claw.height - this.targetHeight);
      t.vy = 15;
      t.x += this.claw.sway * 30;
      C.constrainToy(t);
      this.held = null;
      this.emit("slip", { phase, toyId: t.id });
    }
  };
})(SianClaw);
