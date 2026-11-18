/* HVOS app loader — base + all module hooks */
(async function () {
  const BASE = 'https://cdn.jsdelivr.net/gh/KingRafer/high-value-schedule@4901078a95734cfe51520a9cbad504c280225c95/app.js';
  try {
    const res = await fetch(BASE);
    const code = await res.text();
    const patched = code.replace(
      "if (id === 'timer') renderTimerStats();\n}",
      "if (id === 'timer') renderTimerStats();\n" +
      "  if (id === 'physical' && window.HVOSModules) window.HVOSModules.renderPhysical();\n" +
      "  if (id === 'grooming' && window.HVOSModules) window.HVOSModules.renderGrooming();\n" +
      "  if (id === 'finance' && window.HVOSModules) window.HVOSModules.renderFinance();\n" +
      "  if (id === 'career' && window.HVOSModules) window.HVOSModules.renderCareer();\n" +
      "  if (id === 'intellect' && window.HVOSModules) window.HVOSModules.renderIntellect();\n" +
      "  if (id === 'mental' && window.HVOSModules) window.HVOSModules.renderMental();\n" +
      "  if (id === 'social' && window.HVOSModules) window.HVOSModules.renderSocial();\n" +
      "  if (id === 'leadership' && window.HVOSModules) window.HVOSModules.renderLeadership();\n" +
      "  if (id === 'spiritual' && window.HVOSModules) window.HVOSModules.renderSpiritual();\n" +
      "  if (id === 'strategic' && window.HVOSModules) window.HVOSModules.renderStrategic();\n" +
      "  if (id === 'entrepreneur' && window.HVOSModules) window.HVOSModules.renderEntrepreneur();\n" +
      "  if (id === 'lifestyle' && window.HVOSModules) window.HVOSModules.renderLifestyle();\n" +
      "}"
    );
    const s = document.createElement('script');
    s.textContent = patched;
    document.head.appendChild(s);
  } catch (e) {
    console.error('Failed to load base app.js', e);
    document.body.insertAdjacentHTML('beforeend', '<p style="color:red;padding:2rem">Gagal load app.js. Refresh atau cek koneksi.</p>');
  }
})();
