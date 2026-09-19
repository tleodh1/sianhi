(function (A) {
  A.escape = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  A.card = function (a, r, unlocked) {
    const rec = r?.works?.[a.id],
      stars = rec?.bestStars || 0,
      records = Object.entries(rec?.levels || {}),
      best = records.sort((a,b)=>(A.levels.findIndex(x=>x.id===b[0]))-(A.levels.findIndex(x=>x.id===a[0])))[0],
      detail = best ? `${A.levels.find(x=>x.id===best[0])?.cols * A.levels.find(x=>x.id===best[0])?.rows}조각 · ${best[1].bestSeconds}초` : "자유 선택 · 시작하기";
    return `<button class="art-card" data-art="${a.id}" data-artist="${A.escape(a.artist)}" data-search="${A.escape(`${a.title} ${a.originalTitle} ${a.artist}`.toLowerCase())}"><span class="art-frame"><img src="${a.image}" loading="lazy" crossorigin="anonymous" alt="${A.escape(a.title)}"></span><span class="art-card-copy"><strong>${A.escape(a.title)}</strong><small>${a.artist}</small><span class="art-card-status">${rec ? "✓ " + "★".repeat(stars) + " · " + detail : detail}</span><em>${(a.difficulty || "normal").toUpperCase()}</em></span></button>`;
  };
  A.gallery = function (root, record, onSelect, onBook, scope) {
    const artists=["전체",...new Set(A.artworks.map(a=>a.artist))];
    root.innerHTML = `<div class="art-heading"><div><small>SIANHi · WORLD MASTERPIECES</small><h2>세계 명화 컬렉션</h2><p>마음에 드는 작품과 조각 수를 자유롭게 골라요.</p></div><button data-book>▣ 나의 명화 도감 <b>${Object.keys(record?.works || {}).length}/${A.artworks.length}</b></button></div><div class="art-gallery-tools"><label>🔎 <input data-art-search type="search" placeholder="작품 또는 작가 검색" aria-label="명화 검색"></label><div class="art-filter">${artists.map((x,i)=>`<button data-filter="${A.escape(x)}" class="${i?"":"active"}">${A.escape(x)}</button>`).join("")}</div></div><div class="art-gallery">${A.artworks.map((a) => A.card(a, record, true)).join("")}</div><p class="art-note">퍼블릭 도메인으로 확인된 작품과 공개 이미지를 사용해요.</p>`;
    let filter="전체"; const apply=()=>{const q=root.querySelector("[data-art-search]").value.trim().toLowerCase();root.querySelectorAll(".art-card").forEach(c=>c.hidden=!(filter==="전체"||c.dataset.artist===filter)||!c.dataset.search.includes(q));};
    scope.on(root.querySelector("[data-art-search]"),"input",apply);
    root.querySelectorAll("[data-filter]").forEach(b=>scope.on(b,"click",()=>{filter=b.dataset.filter;root.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));apply()}));
    root
      .querySelectorAll("[data-art]")
      .forEach((b) =>
        scope.on(b, "click", () =>
          onSelect(A.artworks.find((a) => a.id === b.dataset.art)),
        ),
      );
    scope.on(root.querySelector("[data-book]"), "click", onBook);
  };
  A.loadImage = (src) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      if (/^https?:/.test(src)) image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = () =>
        reject(new Error("작품을 불러오지 못했어요. 다시 눌러 주세요."));
      image.src = src;
    });
  A.makeTiles = function (image, cols, rows) {
    const pieces = [];
    for (let i = 0; i < cols * rows; i++) {
      const c = document.createElement("canvas");
      c.width = 240;
      c.height = Math.round(
        (((240 * image.height) / image.width) * cols) / rows,
      );
      c.getContext("2d").drawImage(
        image,
        ((i % cols) * image.width) / cols,
        (Math.floor(i / cols) * image.height) / rows,
        image.width / cols,
        image.height / rows,
        0,
        0,
        c.width,
        c.height,
      );
      pieces.push(c.toDataURL("image/jpeg", 0.92));
    }
    return pieces;
  };
})(SianArt);