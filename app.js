/* HVOS application bootstrap — modules and core are loaded once after cloud auth */
(async function () {
  if (window.HVOS_APP_BOOTING || window.HVOS_APP_READY) return;
  window.HVOS_APP_BOOTING = true;
  const loadScript = src => new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-hvos-src="' + src + '"]');
    if (existing?.dataset.loaded === "true") return resolve();
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", () => reject(new Error("Gagal memuat " + src)), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.dataset.hvosSrc = src;
    script.onload = () => { script.dataset.loaded = "true"; resolve(); };
    script.onerror = () => reject(new Error("Gagal memuat " + src));
    document.head.appendChild(script);
  });
  try {
    if (window.HVOS_CONTENT_READY) await window.HVOS_CONTENT_READY;
    for (const file of ["modules.js", "modules2.js", "modules3.js", "modules4.js", "modules5.js", "modules4-ui.js", "modules5-ui.js"]) {
      await loadScript(file);
    }
    await loadScript("core.js");
    window.HVOS_APP_READY = true;
  } catch (error) {
    console.error("[HVOS bootstrap]", error);
    const main = document.getElementById("main-content");
    if (main) {
      const box = document.createElement("div");
      box.className = "panel";
      box.setAttribute("role", "alert");
      const title = document.createElement("strong");
      title.textContent = "HVOS gagal memuat sebagian fitur.";
      const message = document.createElement("p");
      message.className = "empty-hint";
      message.textContent = error.message || "Periksa koneksi lalu muat ulang.";
      const retry = document.createElement("button");
      retry.className = "btn btn-sm btn-outline";
      retry.textContent = "Coba muat ulang";
      retry.addEventListener("click", () => location.reload());
      box.append(title, message, retry);
      main.prepend(box);
    }
    window.HVOS_APP_BOOTING = false;
  }
})();
