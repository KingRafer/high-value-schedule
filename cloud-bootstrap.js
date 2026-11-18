(() => {
  const root = document.createElement("div");
  root.id = "hvos-auth-root";
  root.innerHTML = `
    <style>
      #hvos-auth-root{position:fixed;inset:0;z-index:99999;background:#0b1020;color:#f4f6fb;display:grid;place-items:center;padding:20px;font-family:Inter,system-ui,sans-serif}
      #hvos-auth-root *{box-sizing:border-box}
      .hvos-auth-card{width:min(100%,420px);background:#151d31;border:1px solid #2b3854;border-radius:20px;padding:28px;box-shadow:0 24px 80px #0008}
      .hvos-auth-logo{font-size:13px;letter-spacing:3px;color:#9fb4d8;font-weight:800}.hvos-auth-card h1{font-size:27px;margin:12px 0 6px}.hvos-auth-sub{color:#a9b5ca;font-size:13px;line-height:1.6;margin-bottom:22px}
      .hvos-auth-card label{display:block;font-size:12px;color:#c7d1e3;margin:14px 0 6px}.hvos-auth-card input{width:100%;padding:13px 14px;border-radius:10px;border:1px solid #34435f;background:#0d1527;color:white;outline:none}
      .hvos-auth-card input:focus{border-color:#8aa9e8}.hvos-auth-submit{width:100%;margin-top:20px;padding:13px;border:0;border-radius:10px;background:#d8e4ff;color:#14203a;font-weight:800;cursor:pointer}
      .hvos-auth-switch{background:none;border:0;color:#b8ccf6;cursor:pointer;margin-top:16px;width:100%;padding:8px}.hvos-auth-error{min-height:20px;color:#ff9f9f;font-size:12px;margin-top:12px}
      .hvos-auth-foot{font-size:11px;color:#8593aa;margin-top:18px;line-height:1.5}
      #hvos-cloud-status{font-size:11px;color:#9fb4d8;margin-left:10px}
      #hvos-cloud-logout{border:1px solid #34435f;background:transparent;color:inherit;border-radius:8px;padding:7px 10px;cursor:pointer;margin-left:8px}
    </style>
    <section class="hvos-auth-card">
      <div class="hvos-auth-logo">HVOS · PERSONAL OPERATING SYSTEM</div>
      <h1 id="hvos-auth-title">Masuk ke HVOS</h1>
      <p class="hvos-auth-sub">Data rutinitas dan progres tersimpan di cloud, sehingga dapat dibuka dari perangkat lain.</p>
      <form id="hvos-auth-form">
        <div id="hvos-name-wrap" hidden><label for="hvos-name">Nama</label><input id="hvos-name" maxlength="80" autocomplete="name"></div>
        <label for="hvos-email">Email</label><input id="hvos-email" type="email" required autocomplete="email">
        <label for="hvos-password">Password</label><input id="hvos-password" type="password" required minlength="10" autocomplete="current-password">
        <button class="hvos-auth-submit" id="hvos-auth-submit">Masuk</button>
        <div class="hvos-auth-error" id="hvos-auth-error" role="alert"></div>
      </form>
      <button class="hvos-auth-switch" id="hvos-auth-switch" type="button">Belum punya akun? Daftar</button>
      <p class="hvos-auth-foot">Gunakan password unik. HVOS tidak akan pernah meminta password melalui pesan atau chat.</p>
    </section>`;
  document.body.appendChild(root);

  let mode = "login";
  const $ = id => document.getElementById(id);
  const error = message => { $("hvos-auth-error").textContent = message || ""; };
  function renderMode() {
    const registering = mode === "register";
    $("hvos-auth-title").textContent = registering ? "Buat akun HVOS" : "Masuk ke HVOS";
    $("hvos-name-wrap").hidden = !registering;
    $("hvos-name").required = registering;
    $("hvos-password").autocomplete = registering ? "new-password" : "current-password";
    $("hvos-auth-submit").textContent = registering ? "Buat akun" : "Masuk";
    $("hvos-auth-switch").textContent = registering ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar";
    error("");
  }
  $("hvos-auth-switch").addEventListener("click", () => { mode = mode === "login" ? "register" : "login"; renderMode(); });
  async function request(url, options = {}) {
    const response = await fetch(url, { credentials: "same-origin", headers: { "Content-Type": "application/json" }, ...options });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Permintaan gagal.");
    return payload;
  }
  async function startApp(user) {
    try {
      const payload = await request("/api/data");
      const cloudData = payload.data || {};
      const localData = Object.fromEntries(
        Object.keys(localStorage).filter(key => key.startsWith("hvos_")).map(key => {
          try { return [key, JSON.parse(localStorage.getItem(key))]; }
          catch { return [key, localStorage.getItem(key)]; }
        })
      );
      if (Object.keys(cloudData).length === 0 && Object.keys(localData).length > 0) {
        const importLocal = confirm("Akun cloud ini belum memiliki data. Impor data HVOS yang tersimpan di browser ini ke akun Anda?");
        if (importLocal) {
          for (const [key, value] of Object.entries(localData)) {
            await request("/api/data", { method: "PUT", body: JSON.stringify({ key, value }) });
          }
        }
      }
      const finalData = Object.keys(cloudData).length ? cloudData : localData;
      Object.keys(localStorage).filter(key => key.startsWith("hvos_")).forEach(key => localStorage.removeItem(key));
      Object.entries(finalData).forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)));
      root.remove();
      const status = document.createElement("span");
      status.id = "hvos-cloud-status";
      status.textContent = "Cloud sync aktif";
      document.querySelector(".topbar-actions")?.appendChild(status);
      const logout = document.createElement("button");
      logout.id = "hvos-cloud-logout";
      logout.textContent = "Keluar";
      logout.addEventListener("click", async () => {
        logout.disabled = true;
        try { await request("/api/auth/logout", { method: "POST", body: "{}" }); location.reload(); }
        catch (e) { logout.disabled = false; alert(e.message); }
      });
      document.querySelector(".topbar-actions")?.appendChild(logout);
      const originalSet = Storage.prototype.setItem;
      const originalRemove = Storage.prototype.removeItem;
      let queue = Promise.resolve();
      const sync = (method, key, value) => {
        if (!key || !key.startsWith("hvos_")) return;
        queue = queue.then(() => fetch("/api/data", {
          method, credentials: "same-origin", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(method === "PUT" ? { key, value: (() => { try { return JSON.parse(value); } catch { return value; } })() } : { key })
        })).then(async r => { if (!r.ok) throw new Error("Cloud sync gagal"); })
          .catch(e => { console.warn("HVOS cloud sync:", e); status.textContent = "Sync tertunda"; });
      };
      Storage.prototype.setItem = function(key, value) {
        originalSet.call(this, key, value);
        if (this === localStorage && String(key).startsWith("hvos_")) sync("PUT", String(key), String(value));
      };
      Storage.prototype.removeItem = function(key) {
        originalRemove.call(this, key);
        if (this === localStorage && String(key).startsWith("hvos_")) sync("DELETE", String(key));
      };
      if (window.HVOS_CONTENT_READY) await window.HVOS_CONTENT_READY;
      const load = src => new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src; script.onload = resolve; script.onerror = () => reject(new Error("Gagal memuat " + src));
        document.body.appendChild(script);
      });
      for (const src of ["modules.js","modules2.js","modules3.js","modules4.js","app.js"]) await load(src);
    } catch (e) {
      error(e.message || "Gagal mengambil data cloud.");
      root.style.display = "grid";
    }
  }
  $("hvos-auth-form").addEventListener("submit", async event => {
    event.preventDefault();
    const button = $("hvos-auth-submit");
    button.disabled = true; button.textContent = "Memproses…"; error("");
    try {
      const body = { email: $("hvos-email").value, password: $("hvos-password").value };
      if (mode === "register") body.name = $("hvos-name").value;
      const result = await request("/api/auth/" + mode, { method: "POST", body: JSON.stringify(body) });
      await startApp(result.user);
    } catch (e) {
      error(e.message);
    } finally {
      button.disabled = false;
      button.textContent = mode === "register" ? "Buat akun" : "Masuk";
    }
  });
  request("/api/auth/me").then(({ user }) => startApp(user)).catch(() => {});
})();