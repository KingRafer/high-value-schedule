(() => {
  const root = document.createElement("div");
  root.id = "hvos-auth-root";
  root.innerHTML = `
    <style>
      #hvos-auth-root{position:fixed;inset:0;z-index:99999;background:radial-gradient(ellipse at 18% 18%,rgba(61,111,201,.22),transparent 34%),radial-gradient(ellipse at 88% 82%,rgba(34,211,238,.10),transparent 30%),#080d18;color:#f4f7ff;display:grid;place-items:center;padding:28px;font-family:Inter,system-ui,sans-serif;overflow:auto}
      #hvos-auth-root *{box-sizing:border-box}
      .hvos-auth-shell{width:min(100%,1040px);display:grid;grid-template-columns:1.08fr .92fr;gap:64px;align-items:center}
      .hvos-auth-intro{padding:24px 0}
      .hvos-auth-mark{display:inline-flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid #263958;border-radius:999px;background:#101b2d;color:#c5d8ff;font-size:11px;font-weight:800;letter-spacing:2px}
      .hvos-auth-mark span{width:8px;height:8px;border-radius:50%;background:#6ee7d8;box-shadow:0 0 16px #6ee7d8}
      .hvos-auth-intro h2{font-size:clamp(38px,5vw,58px);line-height:1.04;letter-spacing:-2.8px;margin:28px 0 18px;max-width:560px}
      .hvos-auth-intro h2 em{font-style:normal;color:#8fb5ff}
      .hvos-auth-intro>p{max-width:450px;color:#9baecb;font-size:15px;line-height:1.8}
      .hvos-auth-points{display:grid;gap:13px;margin-top:34px;color:#c8d5e9;font-size:13px}
      .hvos-auth-point{display:flex;align-items:center;gap:12px}
      .hvos-auth-point i{display:grid;place-items:center;width:28px;height:28px;border:1px solid #2b4265;border-radius:9px;background:#111f35;color:#8fb5ff;font-style:normal}
      .hvos-auth-card{width:100%;background:linear-gradient(145deg,rgba(23,35,57,.98),rgba(13,22,39,.98));border:1px solid #2a3d5d;border-radius:24px;padding:34px;box-shadow:0 30px 100px #0008, inset 0 1px 0 #ffffff0b}
      .hvos-auth-logo{font-size:11px;letter-spacing:2.5px;color:#9fb9e6;font-weight:800}
      .hvos-auth-card h1{font-size:28px;letter-spacing:-.8px;margin:16px 0 7px}
      .hvos-auth-sub{color:#9eafc9;font-size:13px;line-height:1.7;margin-bottom:25px}
      .hvos-auth-card label{display:block;font-size:12px;color:#c7d5eb;margin:16px 0 7px;font-weight:600}
      .hvos-auth-card input{width:100%;padding:14px 15px;border-radius:12px;border:1px solid #304563;background:#0a1425;color:white;outline:none;font:inherit;font-size:14px;transition:border-color .2s,box-shadow .2s}
      .hvos-auth-card input:focus{border-color:#82aaff;box-shadow:0 0 0 4px #82aaff1c}
      .hvos-auth-submit{width:100%;margin-top:22px;padding:14px;border:1px solid #a8c4ff;border-radius:12px;background:linear-gradient(135deg,#dce8ff,#a9c5ff);color:#101d35;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 8px 24px #6e9eff25;transition:transform .2s,filter .2s}
      .hvos-auth-submit:hover{filter:brightness(1.05);transform:translateY(-1px)}
      .hvos-auth-submit:disabled{opacity:.65;cursor:wait;transform:none}
      .hvos-auth-switch{background:none;border:0;color:#a9c6ff;cursor:pointer;margin-top:17px;width:100%;padding:9px;font:inherit;font-size:13px}
      .hvos-auth-switch:hover{color:#fff}
      .hvos-auth-error{min-height:20px;color:#ff9f9f;font-size:12px;margin-top:12px;line-height:1.5}
      .hvos-auth-foot{font-size:11px;color:#8294af;margin-top:20px;line-height:1.7;border-top:1px solid #263752;padding-top:15px}
      #hvos-cloud-status{font-size:11px;color:#9fb4d8;margin-left:10px}
      #hvos-cloud-logout{border:1px solid #34435f;background:transparent;color:inherit;border-radius:8px;padding:7px 10px;cursor:pointer;margin-left:8px}
      @media(max-width:760px){#hvos-auth-root{padding:18px;align-items:start}.hvos-auth-shell{grid-template-columns:1fr;gap:18px;max-width:460px}.hvos-auth-intro{padding:8px 2px 0}.hvos-auth-intro h2{font-size:34px;letter-spacing:-1.5px;margin:18px 0 9px}.hvos-auth-intro>p{font-size:13px}.hvos-auth-points{display:none}.hvos-auth-card{padding:25px 22px;border-radius:20px}.hvos-auth-card h1{font-size:25px}}
      @media(prefers-reduced-motion:reduce){.hvos-auth-submit{transition:none}}
    </style>
    <div class="hvos-auth-shell">
      <section class="hvos-auth-intro">
        <div class="hvos-auth-mark"><span></span> HVOS / PERSONAL OS</div>
        <h2>Rancang hari ini.<br><em>Bangun versi terbaikmu.</em></h2>
        <p>Satu ruang untuk mengatur waktu, menjaga konsistensi, mencatat progres, dan mengelola tujuan hidup dengan lebih terarah.</p>
        <div class="hvos-auth-points">
          <div class="hvos-auth-point"><i>01</i> Atur jadwal, tugas, dan rutinitas</div>
          <div class="hvos-auth-point"><i>02</i> Pantau progres dan tujuan pribadi</div>
          <div class="hvos-auth-point"><i>03</i> Sinkronkan data melalui akun cloud</div>
        </div>
      </section>
      <section class="hvos-auth-card">
        <div class="hvos-auth-logo">WELCOME TO YOUR WORKSPACE</div>
        <h1 id="hvos-auth-title">Masuk ke HVOS</h1>
        <p class="hvos-auth-sub">Masuk untuk melanjutkan perjalanan dan membuka workspace pribadimu.</p>
        <form id="hvos-auth-form">
          <div id="hvos-name-wrap" hidden><label for="hvos-name">Nama</label><input id="hvos-name" maxlength="80" autocomplete="name"></div>
          <label for="hvos-email">Email</label><input id="hvos-email" type="email" required autocomplete="email" placeholder="nama@email.com">
          <label for="hvos-password">Password</label><input id="hvos-password" type="password" required minlength="10" autocomplete="current-password" placeholder="Minimal 10 karakter">
          <button class="hvos-auth-submit" id="hvos-auth-submit">Masuk</button>
          <div class="hvos-auth-error" id="hvos-auth-error" role="alert"></div>
        </form>
        <button class="hvos-auth-switch" id="hvos-auth-switch" type="button">Belum punya akun? Daftar</button>
        <p class="hvos-auth-foot">Privasi tetap penting. Gunakan password unik dan jangan bagikan informasi login kepada siapa pun.</p>
      </section>
    </div>`;
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
      let finalData = cloudData;
      if (Object.keys(cloudData).length === 0 && Object.keys(localData).length > 0) {
        const importLocal = confirm("Akun cloud ini belum memiliki data. Impor data HVOS yang tersimpan di browser ini ke akun Anda?");
        if (importLocal) {
          for (const [key, value] of Object.entries(localData)) {
            await request("/api/data", { method: "PUT", body: JSON.stringify({ key, value }) });
          }
          finalData = localData;
        }
      }
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
        try {
          await request("/api/auth/logout", { method: "POST", body: "{}" });
          Object.keys(localStorage).filter(key => key.startsWith("hvos_")).forEach(key => originalRemove.call(localStorage, key));
          location.reload();
        }
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
      await load("app.js");
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