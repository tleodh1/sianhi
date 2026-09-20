(function(){
  const standalone =
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    window.navigator.standalone === true ||
    window.Capacitor?.isNativePlatform?.() === true;

  document.documentElement.classList.toggle("appStandalone", !!standalone);

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }, { once: true });
  }
})();
