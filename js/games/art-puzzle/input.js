(function (A) {
  A.Input = class {
    constructor(root, engine, scope, onPlace, onSelect, onZoom = () => {}) {
      this.root = root;
      this.engine = engine;
      this.active = null;
      this.ghost = null;
      this.pinch = new Map();
      this.pinchDistance = 0;
      const reset = () => this.cancel();
      scope.cleanups.push(reset);
      scope.on(window, "blur", reset);
      scope.on(document, "visibilitychange", () => {
        if (document.hidden) reset();
      });
      scope.on(root, "pointerdown", (e) => {
        if (e.pointerType === "touch" && e.target.closest(".art-board-stage")) {
          this.pinch.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (this.pinch.size === 2) {
            const p=[...this.pinch.values()];
            this.pinchDistance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);
            this.cancel();
            return;
          }
        }
        const piece = e.target.closest("[data-piece]");
        if (!piece || piece.disabled || this.active !== null) return;
        e.preventDefault();
        const id = +piece.dataset.piece;
        if (!engine.select(id)) return;
        onSelect();
        piece.setPointerCapture(e.pointerId);
        this.active = {
          id: e.pointerId,
          piece,
          x: e.clientX,
          y: e.clientY,
          moved: false,
        };
        piece.classList.add("art-picked");
      });
      scope.on(root, "pointermove", (e) => {
        if (this.pinch.has(e.pointerId)) {
          this.pinch.set(e.pointerId,{x:e.clientX,y:e.clientY});
          if(this.pinch.size===2){
            e.preventDefault();
            const p=[...this.pinch.values()], next=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);
            if(this.pinchDistance>0&&Math.abs(next-this.pinchDistance)>8){onZoom(next/this.pinchDistance);this.pinchDistance=next;}
            return;
          }
        }
        const a = this.active;
        if (!a || a.id !== e.pointerId) return;
        e.preventDefault();
        if (Math.hypot(e.clientX - a.x, e.clientY - a.y) > 6) a.moved = true;
        if (a.moved) {
          if (!this.ghost) {
            this.ghost = a.piece.cloneNode(true);
            this.ghost.removeAttribute("data-piece");
            this.ghost.removeAttribute("id");
            this.ghost.className = "art-drag-ghost";
            this.ghost.setAttribute("aria-hidden", "true");
            const r = a.piece.getBoundingClientRect();
            this.ghost.style.width = r.width + "px";
            this.ghost.style.height = r.height + "px";
            root.append(this.ghost);
          }
          this.ghost.style.left = e.clientX + "px";
          this.ghost.style.top = e.clientY + "px";
          const tilt=Math.max(-7,Math.min(7,(e.clientX-a.x)/18));
          this.ghost.style.setProperty("--tilt",tilt+"deg");
        }
      });
      scope.on(root, "pointerup", (e) => {
        this.pinch.delete(e.pointerId);
        if(this.pinch.size<2)this.pinchDistance=0;
        const a = this.active;
        if (!a || a.id !== e.pointerId) return;
        if (a.moved) {
          const board = root.querySelector(".art-board"),
            index = A.snap(
              e.clientX,
              e.clientY,
              board.getBoundingClientRect(),
              engine.cols,
              engine.rows,
            );
          onPlace(index);
        }
        this.cancel();
      });
      scope.on(root, "pointercancel", (e) => {
        this.pinch.delete(e.pointerId);
        if (this.active?.id === e.pointerId) reset();
      });
      scope.on(root, "lostpointercapture", (e) => {
        if (this.active?.id === e.pointerId) reset();
      });
      scope.on(root, "click", (e) => {
        const slot = e.target.closest("[data-slot]");
        if (slot) onPlace(+slot.dataset.slot);
        const piece = e.target.closest("[data-piece]");
        if (piece && e.detail === 0) {
          engine.select(+piece.dataset.piece);
          onSelect();
        }
      });
      scope.on(root, "keydown", (e) => {
        if (e.key === "Escape") {
          engine.selected = null;
          this.cancel();
          onSelect();
        }
      });
    }
    cancel() {
      if (this.active) {
        const { piece, id } = this.active;
        this.active = null;
        if (piece.hasPointerCapture?.(id)) piece.releasePointerCapture(id);
        piece.classList.remove("art-picked");
      }
      this.ghost?.remove();
      this.ghost = null;
    }
  };
})(SianArt);
