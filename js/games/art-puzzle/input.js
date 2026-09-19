(function (A) {
  A.Input = class {
    constructor(root, engine, scope, onPlace, onSelect) {
      this.root = root;
      this.engine = engine;
      this.active = null;
      this.ghost = null;
      const reset = () => this.cancel();
      scope.cleanups.push(reset);
      scope.on(window, "blur", reset);
      scope.on(document, "visibilitychange", () => {
        if (document.hidden) reset();
      });
      scope.on(root, "pointerdown", (e) => {
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