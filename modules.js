/* HVOS Modules: Physical Excellence, Grooming, Finance */
(function () {
  const K = {
    workouts: 'hvos_workouts',
    exercises: 'hvos_exercises',
    bodyWeight: 'hvos_body_weight',
    measurements: 'hvos_measurements',
    nutrition: 'hvos_nutrition',
    sleep: 'hvos_sleep',
    recovery: 'hvos_recovery',
    progressNotes: 'hvos_progress_notes',
    skincare: 'hvos_skincare',
    haircare: 'hvos_haircare',
    hygiene: 'hvos_hygiene',
    groomingReminders: 'hvos_groom_reminders',
    fragrances: 'hvos_fragrances',
    wardrobe: 'hvos_wardrobe',
    outfits: 'hvos_outfits',
    appearGoals: 'hvos_appear_goals',
    transactions: 'hvos_transactions',
    budgets: 'hvos_budgets',
    debts: 'hvos_debts',
    assets: 'hvos_assets',
    finGoals: 'hvos_fin_goals',
    emergencyFund: 'hvos_emergency_fund',
  };

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function load(k, fb) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } }
  function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  function todayStr() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function formatRp(n) {
    const num = Number(n) || 0;
    return (num < 0 ? '-Rp ' : 'Rp ') + new Intl.NumberFormat('id-ID').format(Math.abs(num));
  }
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function formatDateID(s) {
    if (!s) return '—';
    return new Date(s + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const DEFAULT_EXERCISES = [
    { id: 'ex1', name: 'Bench Press', muscle: 'Chest' },
    { id: 'ex2', name: 'Squat', muscle: 'Legs' },
    { id: 'ex3', name: 'Deadlift', muscle: 'Back' },
    { id: 'ex4', name: 'Overhead Press', muscle: 'Shoulders' },
    { id: 'ex5', name: 'Barbell Row', muscle: 'Back' },
    { id: 'ex6', name: 'Pull Up', muscle: 'Back' },
    { id: 'ex7', name: 'Dumbbell Curl', muscle: 'Arms' },
    { id: 'ex8', name: 'Tricep Extension', muscle: 'Arms' },
    { id: 'ex9', name: 'Leg Press', muscle: 'Legs' },
    { id: 'ex10', name: 'Plank', muscle: 'Core' },
    { id: 'ex11', name: 'Running', muscle: 'Cardio' },
    { id: 'ex12', name: 'Face Pull', muscle: 'Shoulders' },
  ];

  const DEFAULT_SKINCARE = ['Cleanser', 'Toner', 'Serum / Niacinamide', 'Moisturizer', 'Sunscreen (AM)', 'Retinol (PM, optional)'];
  const DEFAULT_HAIRCARE = ['Shampoo', 'Conditioner', 'Hair oil / serum', 'Style product'];
  const DEFAULT_HYGIENE = ['Mandi 2x', 'Sikat gigi 2x', 'Floss', 'Deodorant', 'Cuci muka', 'Potong kuku (mingguan)'];

  let workouts = load(K.workouts, []);
  let exercises = load(K.exercises, DEFAULT_EXERCISES);
  let bodyWeight = load(K.bodyWeight, []);
  let measurements = load(K.measurements, []);
  let nutrition = load(K.nutrition, {}); // date -> { cal, protein, water }
  let sleepLog = load(K.sleep, []);
  let recoveryLog = load(K.recovery, []);
  let progressNotes = load(K.progressNotes, []);

  let skincare = load(K.skincare, DEFAULT_SKINCARE);
  let haircare = load(K.haircare, DEFAULT_HAIRCARE);
  let hygiene = load(K.hygiene, DEFAULT_HYGIENE);
  let groomChecks = load('hvos_groom_checks', {}); // date -> { skincare:[], haircare:[], hygiene:[] }
  let groomReminders = load(K.groomingReminders, []);
  let fragrances = load(K.fragrances, []);
  let wardrobe = load(K.wardrobe, []);
  let outfits = load(K.outfits, []);
  let appearGoals = load(K.appearGoals, []);

  let transactions = load(K.transactions, []);
  let budgets = load(K.budgets, []);
  let debts = load(K.debts, []);
  let assets = load(K.assets, []);
  let finGoals = load(K.finGoals, []);
  let emergencyFund = load(K.emergencyFund, { current: 0, target: 0 });

  // Expose render functions
  window.HVOSModules = {
    renderPhysical,
    renderGrooming,
    renderFinance,
    openWorkoutModal,

  };

  // ========== PHYSICAL ==========
  function renderPhysical() {
    const today = todayStr();
    const nut = nutrition[today] || { cal: 0, protein: 0, water: 0 };

    // Stats
    const lastBW = bodyWeight.length ? bodyWeight[bodyWeight.length - 1] : null;
    setText('phys-weight', lastBW ? lastBW.kg + ' kg' : '—');
    setText('phys-cal', nut.cal || 0);
    setText('phys-protein', (nut.protein || 0) + 'g');
    setText('phys-water', (nut.water || 0) + ' ml');

    // Workout list
    const wEl = document.getElementById('workout-list');
    if (wEl) {
      const sorted = [...workouts].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 20);
      wEl.innerHTML = sorted.length ? sorted.map(w => `
        <div class="data-row" data-id="${w.id}">
          <div class="data-main">
            <strong>${formatDateID(w.date)}</strong> · ${esc(w.name || 'Workout')}
            <div class="hint">${(w.exercises || []).map(e => e.name + ' ' + e.sets + 'x' + e.reps + (e.weight ? '@' + e.weight + 'kg' : '')).join(' · ') || '—'}</div>
          </div>
          <div class="task-actions">
            <button class="btn-icon" data-act="del-wo">✕</button>
          </div>
        </div>`).join('') : '<p class="empty-hint">Belum ada workout. Catat sesi gym pertama.</p>';

      wEl.querySelectorAll('[data-act="del-wo"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.closest('.data-row').dataset.id;
          if (confirm('Hapus workout?')) {
            workouts = workouts.filter(w => w.id !== id);
            save(K.workouts, workouts);
            renderPhysical();
          }
        });
      });
    }

    // Exercise library
    const exEl = document.getElementById('exercise-library');
    if (exEl) {
      exEl.innerHTML = exercises.map(e => `
        <div class="chip-item"><span>${esc(e.name)}</span><span class="hint">${esc(e.muscle)}</span></div>`).join('');
    }

    // Body weight history
    const bwEl = document.getElementById('bw-history');
    if (bwEl) {
      const recent = [...bodyWeight].reverse().slice(0, 10);
      bwEl.innerHTML = recent.length ? recent.map(b =>
        `<div class="mini-item"><strong>${b.kg} kg</strong> <span class="hint">${formatDateID(b.date)}</span></div>`
      ).join('') : '<p class="empty-hint">Belum ada data berat badan.</p>';
    }

    // Measurements
    const mEl = document.getElementById('measure-list');
    if (mEl) {
      const recent = [...measurements].reverse().slice(0, 5);
      mEl.innerHTML = recent.length ? recent.map(m =>
        `<div class="mini-item"><strong>${formatDateID(m.date)}</strong>
          <span class="hint">Dada ${m.chest || '—'} · Pinggang ${m.waist || '—'} · Lengan ${m.arm || '—'} · Paha ${m.thigh || '—'} cm</span></div>`
      ).join('') : '<p class="empty-hint">Belum ada pengukuran.</p>';
    }

    // Sleep
    const sEl = document.getElementById('sleep-list');
    if (sEl) {
      const recent = [...sleepLog].reverse().slice(0, 7);
      sEl.innerHTML = recent.length ? recent.map(s =>
        `<div class="mini-item"><strong>${s.hours}h</strong> <span class="hint">${formatDateID(s.date)} · kualitas ${s.quality || '—'}/5</span></div>`
      ).join('') : '<p class="empty-hint">Belum ada data tidur.</p>';
    }

    // Progress notes / transformation
    const pEl = document.getElementById('progress-notes');
    if (pEl) {
      pEl.innerHTML = progressNotes.length ? [...progressNotes].reverse().slice(0, 8).map(p =>
        `<div class="data-row"><div class="data-main"><strong>${formatDateID(p.date)}</strong><div class="hint">${esc(p.note)}</div>${p.photoUrl ? `<a href="${esc(p.photoUrl)}" target="_blank" class="hint">📷 Foto</a>` : ''}</div>
        <button class="btn-icon" data-act="del-prog" data-id="${p.id}">✕</button></div>`
      ).join('') : '<p class="empty-hint">Catat progress transformasi tubuh di sini.</p>';
      pEl.querySelectorAll('[data-act="del-prog"]').forEach(btn => {
        btn.addEventListener('click', () => {
          progressNotes = progressNotes.filter(p => p.id !== btn.dataset.id);
          save(K.progressNotes, progressNotes);
          renderPhysical();
        });
      });
    }

    // Recovery
    const rEl = document.getElementById('recovery-list');
    if (rEl) {
      const recent = [...recoveryLog].reverse().slice(0, 5);
      rEl.innerHTML = recent.length ? recent.map(r =>
        `<div class="mini-item"><strong>${formatDateID(r.date)}</strong> <span class="hint">${esc(r.note)} · sore ${r.soreness || '—'}/5</span></div>`
      ).join('') : '<p class="empty-hint">Belum ada recovery log.</p>';
    }
  }

  function openWorkoutModal() {
    const form = document.getElementById('form-workout');
    if (!form) return;
    form.reset();
    document.getElementById('wo-date').value = todayStr();
    document.getElementById('wo-exercises-area').innerHTML = exerciseRowHtml();
    openMod('modal-workout');
  }

  function exerciseRowHtml() {
    const opts = exercises.map(e => `<option value="${esc(e.name)}">${esc(e.name)}</option>`).join('');
    return `<div class="wo-ex-row form-row" style="margin-bottom:0.5rem">
      <div class="form-group" style="flex:2"><label>Exercise</label><select class="wo-ex-name">${opts}<option value="__custom">+ Custom...</option></select></div>
      <div class="form-group"><label>Sets</label><input type="number" class="wo-sets" value="3" min="1" /></div>
      <div class="form-group"><label>Reps</label><input type="number" class="wo-reps" value="10" min="1" /></div>
      <div class="form-group"><label>kg</label><input type="number" class="wo-weight" step="0.5" placeholder="0" /></div>
    </div>`;
  }

  function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }
  function openMod(id) {
    document.getElementById('modal-overlay').hidden = false;
    document.querySelectorAll('.modal').forEach(m => m.hidden = true);
    const m = document.getElementById(id);
    if (m) m.hidden = false;
  }

  // Scripts are loaded after cloud login, often after DOMContentLoaded has fired.
  // Bind immediately when the DOM is ready; otherwise wait once for it.
  function bindModuleEvents() {
    document.getElementById('btn-add-workout')?.addEventListener('click', openWorkoutModal);
    document.getElementById('btn-add-wo-ex')?.addEventListener('click', () => {
      const area = document.getElementById('wo-exercises-area');
      if (area) area.insertAdjacentHTML('beforeend', exerciseRowHtml());
    });

    document.getElementById('form-workout')?.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('wo-name').value.trim() || 'Workout';
      const date = document.getElementById('wo-date').value || todayStr();
      const rows = document.querySelectorAll('#wo-exercises-area .wo-ex-row');
      const exs = [];
      rows.forEach(row => {
        let n = row.querySelector('.wo-ex-name').value;
        if (n === '__custom') n = prompt('Nama exercise:') || 'Custom';
        exs.push({
          name: n,
          sets: Number(row.querySelector('.wo-sets').value) || 0,
          reps: Number(row.querySelector('.wo-reps').value) || 0,
          weight: Number(row.querySelector('.wo-weight').value) || 0,
        });
      });
      workouts.push({ id: uid(), name, date, exercises: exs });
      save(K.workouts, workouts);
      document.getElementById('modal-overlay').hidden = true;
      renderPhysical();
    });

    document.getElementById('btn-log-weight')?.addEventListener('click', () => {
      const kg = prompt('Berat badan (kg):');
      if (!kg) return;
      bodyWeight.push({ id: uid(), date: todayStr(), kg: Number(kg) });
      save(K.bodyWeight, bodyWeight);
      renderPhysical();
    });

    document.getElementById('btn-log-measure')?.addEventListener('click', () => {
      const chest = prompt('Dada (cm):') || '';
      const waist = prompt('Pinggang (cm):') || '';
      const arm = prompt('Lengan (cm):') || '';
      const thigh = prompt('Paha (cm):') || '';
      measurements.push({ id: uid(), date: todayStr(), chest, waist, arm, thigh });
      save(K.measurements, measurements);
      renderPhysical();
    });

    document.getElementById('btn-log-nutrition')?.addEventListener('click', () => {
      const today = todayStr();
      const cur = nutrition[today] || { cal: 0, protein: 0, water: 0 };
      const cal = prompt('Kalori hari ini:', cur.cal) || cur.cal;
      const protein = prompt('Protein (gram):', cur.protein) || cur.protein;
      const water = prompt('Air (ml):', cur.water) || cur.water;
      nutrition[today] = { cal: Number(cal) || 0, protein: Number(protein) || 0, water: Number(water) || 0 };
      save(K.nutrition, nutrition);
      renderPhysical();
    });

    document.getElementById('btn-log-sleep')?.addEventListener('click', () => {
      const hours = prompt('Jam tidur:');
      if (!hours) return;
      const quality = prompt('Kualitas (1-5):', '4') || '3';
      sleepLog.push({ id: uid(), date: todayStr(), hours: Number(hours), quality: Number(quality) });
      save(K.sleep, sleepLog);
      renderPhysical();
    });

    document.getElementById('btn-log-recovery')?.addEventListener('click', () => {
      const note = prompt('Recovery note (stretch, sauna, rest day...):') || '';
      const soreness = prompt('Soreness 1-5:', '2') || '2';
      recoveryLog.push({ id: uid(), date: todayStr(), note, soreness: Number(soreness) });
      save(K.recovery, recoveryLog);
      renderPhysical();
    });

    document.getElementById('btn-log-progress')?.addEventListener('click', () => {
      const note = prompt('Progress note / transformasi:');
      if (!note) return;
      const photoUrl = prompt('URL foto progress (opsional):') || '';
      progressNotes.push({ id: uid(), date: todayStr(), note, photoUrl });
      save(K.progressNotes, progressNotes);
      renderPhysical();
    });

    document.getElementById('btn-add-exercise')?.addEventListener('click', () => {
      const name = prompt('Nama exercise:');
      if (!name) return;
      const muscle = prompt('Muscle group:', 'Other') || 'Other';
      exercises.push({ id: uid(), name, muscle });
      save(K.exercises, exercises);
      renderPhysical();
    });

    // Grooming buttons
    document.getElementById('btn-add-fragrance')?.addEventListener('click', () => {
      const name = prompt('Nama parfum:');
      if (!name) return;
      const notes = prompt('Notes / season:', '') || '';
      fragrances.push({ id: uid(), name, notes });
      save(K.fragrances, fragrances);
      renderGrooming();
    });

    document.getElementById('btn-add-wardrobe')?.addEventListener('click', () => {
      const name = prompt('Item (mis. Kemeja putih Oxford):');
      if (!name) return;
      const cat = prompt('Kategori (shirt/pants/shoes/accessories):', 'shirt') || 'other';
      wardrobe.push({ id: uid(), name, category: cat });
      save(K.wardrobe, wardrobe);
      renderGrooming();
    });

    document.getElementById('btn-add-outfit')?.addEventListener('click', () => {
      const name = prompt('Nama outfit / occasion:');
      if (!name) return;
      const items = prompt('Items (pisah koma):') || '';
      outfits.push({ id: uid(), name, items, date: todayStr() });
      save(K.outfits, outfits);
      renderGrooming();
    });

    document.getElementById('btn-add-groom-reminder')?.addEventListener('click', () => {
      const name = prompt('Reminder (mis. Haircut, Beard trim):');
      if (!name) return;
      const everyDays = Number(prompt('Setiap berapa hari?', '30')) || 30;
      const last = prompt('Terakhir dilakukan (YYYY-MM-DD):', todayStr()) || todayStr();
      groomReminders.push({ id: uid(), name, everyDays, last });
      save(K.groomingReminders, groomReminders);
      renderGrooming();
    });

    document.getElementById('btn-add-appear-goal')?.addEventListener('click', () => {
      const title = prompt('Appearance goal:');
      if (!title) return;
      appearGoals.push({ id: uid(), title, progress: 0 });
      save(K.appearGoals, appearGoals);
      renderGrooming();
    });

    document.getElementById('btn-edit-skincare')?.addEventListener('click', () => {
      const raw = prompt('Skincare routine (satu per baris):', skincare.join('\n'));
      if (raw !== null) { skincare = raw.split('\n').map(s => s.trim()).filter(Boolean); save(K.skincare, skincare); renderGrooming(); }
    });
    document.getElementById('btn-edit-haircare')?.addEventListener('click', () => {
      const raw = prompt('Haircare routine (satu per baris):', haircare.join('\n'));
      if (raw !== null) { haircare = raw.split('\n').map(s => s.trim()).filter(Boolean); save(K.haircare, haircare); renderGrooming(); }
    });

    // Finance buttons
    document.getElementById('btn-add-income')?.addEventListener('click', () => openTxModal('income'));
    document.getElementById('btn-add-expense')?.addEventListener('click', () => openTxModal('expense'));
    document.getElementById('btn-add-debt')?.addEventListener('click', () => {
      const name = prompt('Nama utang:');
      if (!name) return;
      const amount = Number(prompt('Sisa utang (Rp):')) || 0;
      const rate = prompt('Bunga % / tahun (opsional):') || '';
      debts.push({ id: uid(), name, amount, rate });
      save(K.debts, debts);
      renderFinance();
    });
    document.getElementById('btn-add-asset')?.addEventListener('click', () => {
      const name = prompt('Nama aset / investasi:');
      if (!name) return;
      const value = Number(prompt('Nilai saat ini (Rp):')) || 0;
      const type = prompt('Tipe (cash/saham/crypto/properti/lainnya):', 'cash') || 'other';
      assets.push({ id: uid(), name, value, type });
      save(K.assets, assets);
      renderFinance();
    });
    document.getElementById('btn-add-fin-goal')?.addEventListener('click', () => {
      const title = prompt('Financial goal:');
      if (!title) return;
      const target = Number(prompt('Target (Rp):')) || 0;
      const current = Number(prompt('Saat ini (Rp):', '0')) || 0;
      finGoals.push({ id: uid(), title, target, current });
      save(K.finGoals, finGoals);
      renderFinance();
    });
    document.getElementById('btn-set-emergency')?.addEventListener('click', () => {
      const current = Number(prompt('Emergency fund sekarang (Rp):', emergencyFund.current)) || 0;
      const target = Number(prompt('Target emergency fund (Rp):', emergencyFund.target)) || 0;
      emergencyFund = { current, target };
      save(K.emergencyFund, emergencyFund);
      renderFinance();
    });
    document.getElementById('btn-add-budget')?.addEventListener('click', () => {
      const cat = prompt('Kategori budget (makan, transport, hiburan...):');
      if (!cat) return;
      const limit = Number(prompt('Limit bulanan (Rp):')) || 0;
      budgets.push({ id: uid(), category: cat, limit });
      save(K.budgets, budgets);
      renderFinance();
    });

    document.getElementById('form-tx')?.addEventListener('submit', e => {
      e.preventDefault();
      const type = document.getElementById('tx-type').value;
      const amount = Number(document.getElementById('tx-amount').value) || 0;
      const category = document.getElementById('tx-category').value.trim() || 'Lainnya';
      const note = document.getElementById('tx-note').value.trim();
      const date = document.getElementById('tx-date').value || todayStr();
      if (!amount) return;
      transactions.push({ id: uid(), type, amount, category, note, date });
      save(K.transactions, transactions);
      document.getElementById('modal-overlay').hidden = true;
      renderFinance();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindModuleEvents, { once: true });
  } else {
    bindModuleEvents();
  }

  function openTxModal(type) {
    const form = document.getElementById('form-tx');
    if (!form) return;
    form.reset();
    document.getElementById('tx-type').value = type;
    document.getElementById('tx-date').value = todayStr();
    document.getElementById('modal-tx-title').textContent = type === 'income' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran';
    openMod('modal-tx');
  }

  // ========== GROOMING ==========
  function renderGrooming() {
    const today = todayStr();
    if (!groomChecks[today]) groomChecks[today] = { skincare: [], haircare: [], hygiene: [] };

    renderCheckList('skincare-list', skincare, 'skincare');
    renderCheckList('haircare-list', haircare, 'haircare');
    renderCheckList('hygiene-list', hygiene, 'hygiene');

    // Reminders
    const remEl = document.getElementById('groom-reminders');
    if (remEl) {
      remEl.innerHTML = groomReminders.length ? groomReminders.map(r => {
        const last = new Date(r.last + 'T00:00:00');
        const next = new Date(last); next.setDate(next.getDate() + r.everyDays);
        const daysLeft = Math.ceil((next - new Date()) / 86400000);
        const due = daysLeft <= 0;
        return `<div class="data-row">
          <div class="data-main"><strong>${esc(r.name)}</strong>
            <div class="hint">Setiap ${r.everyDays} hari · terakhir ${formatDateID(r.last)}
              · ${due ? '<span style="color:var(--danger)">Jatuh tempo!</span>' : 'next in ' + daysLeft + ' hari'}</div>
          </div>
          <button class="btn btn-sm btn-outline" data-act="done-rem" data-id="${r.id}">Done</button>
          <button class="btn-icon" data-act="del-rem" data-id="${r.id}">✕</button>
        </div>`;
      }).join('') : '<p class="empty-hint">Belum ada reminder (haircut, beard, dll).</p>';

      remEl.querySelectorAll('[data-act="done-rem"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const r = groomReminders.find(x => x.id === btn.dataset.id);
          if (r) { r.last = todayStr(); save(K.groomingReminders, groomReminders); renderGrooming(); }
        });
      });
      remEl.querySelectorAll('[data-act="del-rem"]').forEach(btn => {
        btn.addEventListener('click', () => {
          groomReminders = groomReminders.filter(x => x.id !== btn.dataset.id);
          save(K.groomingReminders, groomReminders);
          renderGrooming();
        });
      });
    }

    // Fragrances
    const fEl = document.getElementById('fragrance-list');
    if (fEl) {
      fEl.innerHTML = fragrances.length ? fragrances.map(f =>
        `<div class="mini-item"><strong>${esc(f.name)}</strong> <span class="hint">${esc(f.notes)}</span>
          <button class="btn-icon" style="margin-left:auto" data-act="del-frag" data-id="${f.id}">✕</button></div>`
      ).join('') : '<p class="empty-hint">Belum ada parfum di koleksi.</p>';
      fEl.querySelectorAll('[data-act="del-frag"]').forEach(btn => {
        btn.addEventListener('click', () => {
          fragrances = fragrances.filter(f => f.id !== btn.dataset.id);
          save(K.fragrances, fragrances);
          renderGrooming();
        });
      });
    }

    // Wardrobe
    const wEl = document.getElementById('wardrobe-list');
    if (wEl) {
      wEl.innerHTML = wardrobe.length ? wardrobe.map(w =>
        `<div class="mini-item"><span class="tag tag-other">${esc(w.category)}</span> <strong>${esc(w.name)}</strong>
          <button class="btn-icon" style="margin-left:auto" data-act="del-ward" data-id="${w.id}">✕</button></div>`
      ).join('') : '<p class="empty-hint">Belum ada item wardrobe.</p>';
      wEl.querySelectorAll('[data-act="del-ward"]').forEach(btn => {
        btn.addEventListener('click', () => {
          wardrobe = wardrobe.filter(w => w.id !== btn.dataset.id);
          save(K.wardrobe, wardrobe);
          renderGrooming();
        });
      });
    }

    // Outfits
    const oEl = document.getElementById('outfit-list');
    if (oEl) {
      oEl.innerHTML = outfits.length ? [...outfits].reverse().slice(0, 10).map(o =>
        `<div class="mini-item"><strong>${esc(o.name)}</strong> <span class="hint">${esc(o.items)}</span></div>`
      ).join('') : '<p class="empty-hint">Belum ada outfit planner.</p>';
    }

    // Appearance goals
    const aEl = document.getElementById('appear-goals');
    if (aEl) {
      aEl.innerHTML = appearGoals.length ? appearGoals.map(g =>
        `<div class="data-row" data-id="${g.id}">
          <div class="data-main" style="flex:1"><strong>${esc(g.title)}</strong>
            <div class="goal-progress-bar" style="margin-top:0.35rem"><div class="goal-progress-fill" style="width:${g.progress || 0}%"></div></div>
          </div>
          <button class="btn btn-sm btn-outline" data-act="prog-appear">${g.progress || 0}%</button>
          <button class="btn-icon" data-act="del-appear">✕</button>
        </div>`
      ).join('') : '<p class="empty-hint">Set appearance improvement goals.</p>';
      aEl.querySelectorAll('[data-act="prog-appear"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.closest('.data-row').dataset.id;
          const g = appearGoals.find(x => x.id === id);
          if (!g) return;
          const p = Number(prompt('Progress %:', g.progress || 0));
          if (!isNaN(p)) { g.progress = Math.min(100, Math.max(0, p)); save(K.appearGoals, appearGoals); renderGrooming(); }
        });
      });
      aEl.querySelectorAll('[data-act="del-appear"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.closest('.data-row').dataset.id;
          appearGoals = appearGoals.filter(x => x.id !== id);
          save(K.appearGoals, appearGoals);
          renderGrooming();
        });
      });
    }
  }

  function renderCheckList(elId, items, type) {
    const el = document.getElementById(elId);
    if (!el) return;
    const today = todayStr();
    if (!groomChecks[today]) groomChecks[today] = { skincare: [], haircare: [], hygiene: [] };
    const checked = groomChecks[today][type] || [];
    el.innerHTML = items.map((item, idx) => {
      const done = checked.includes(idx);
      return `<div class="routine-item ${done ? 'done' : ''}" data-type="${type}" data-idx="${idx}">
        <div class="habit-toggle ${done ? 'checked' : ''}" data-act="groom-check"></div>
        <span>${esc(item)}</span></div>`;
    }).join('');
    el.querySelectorAll('[data-act="groom-check"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.routine-item');
        const t = row.dataset.type;
        const idx = Number(row.dataset.idx);
        const arr = groomChecks[today][t] || [];
        const pos = arr.indexOf(idx);
        if (pos >= 0) arr.splice(pos, 1); else arr.push(idx);
        groomChecks[today][t] = arr;
        save('hvos_groom_checks', groomChecks);
        renderGrooming();
      });
    });
  }

  // ========== FINANCE ==========
  function renderFinance() {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const assetTotal = assets.reduce((s, a) => s + (Number(a.value) || 0), 0);
    const debtTotal = debts.reduce((s, d) => s + (Number(d.amount) || 0), 0);
    const netWorth = assetTotal - debtTotal + (emergencyFund.current || 0);

    // This month
    const now = new Date();
    const ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    const monthTx = transactions.filter(t => (t.date || '').startsWith(ym));
    const monthIn = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const monthOut = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    setText('fin-income', formatRp(monthIn));
    setText('fin-expense', formatRp(monthOut));
    setText('fin-cashflow', formatRp(monthIn - monthOut));
    const cfEl = document.getElementById('fin-cashflow');
    if (cfEl) cfEl.className = 'stat-value ' + (monthIn - monthOut >= 0 ? 'positive' : 'negative');
    setText('fin-networth', formatRp(netWorth));
    const nwEl = document.getElementById('fin-networth');
    if (nwEl) nwEl.className = 'stat-value ' + (netWorth >= 0 ? 'positive' : 'negative');

    // Emergency fund
    const efPct = emergencyFund.target ? Math.min(100, Math.round((emergencyFund.current / emergencyFund.target) * 100)) : 0;
    setText('ef-current', formatRp(emergencyFund.current || 0));
    setText('ef-target', formatRp(emergencyFund.target || 0));
    const efBar = document.getElementById('ef-bar');
    if (efBar) efBar.style.width = efPct + '%';

    // Transactions
    const txEl = document.getElementById('tx-list');
    if (txEl) {
      const sorted = [...transactions].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 30);
      txEl.innerHTML = sorted.length ? sorted.map(t => `
        <div class="data-row" data-id="${t.id}">
          <div class="data-main">
            <span class="tag ${t.type === 'income' ? 'tag-health' : 'tag-other'}">${t.type}</span>
            <strong>${esc(t.category)}</strong>
            <span class="hint">${formatDateID(t.date)} ${t.note ? '· ' + esc(t.note) : ''}</span>
          </div>
          <strong class="${t.type === 'income' ? 'pnl-positive' : 'pnl-negative'}">${t.type === 'income' ? '+' : '-'}${formatRp(t.amount)}</strong>
          <button class="btn-icon" data-act="del-tx">✕</button>
        </div>`).join('') : '<p class="empty-hint">Belum ada transaksi.</p>';
      txEl.querySelectorAll('[data-act="del-tx"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.closest('.data-row').dataset.id;
          transactions = transactions.filter(t => t.id !== id);
          save(K.transactions, transactions);
          renderFinance();
        });
      });
    }

    // Budgets
    const bEl = document.getElementById('budget-list');
    if (bEl) {
      bEl.innerHTML = budgets.length ? budgets.map(b => {
        const spent = monthTx.filter(t => t.type === 'expense' && t.category.toLowerCase() === b.category.toLowerCase()).reduce((s, t) => s + t.amount, 0);
        const pct = b.limit ? Math.min(100, Math.round((spent / b.limit) * 100)) : 0;
        return `<div class="data-row">
          <div class="data-main" style="flex:1"><strong>${esc(b.category)}</strong>
            <div class="hint">${formatRp(spent)} / ${formatRp(b.limit)}</div>
            <div class="goal-progress-bar" style="margin-top:0.3rem"><div class="goal-progress-fill" style="width:${pct}%;background:${pct > 90 ? 'var(--danger)' : 'var(--accent)'}"></div></div>
          </div>
          <button class="btn-icon" data-act="del-budget" data-id="${b.id}">✕</button>
        </div>`;
      }).join('') : '<p class="empty-hint">Belum ada budget category.</p>';
      bEl.querySelectorAll('[data-act="del-budget"]').forEach(btn => {
        btn.addEventListener('click', () => {
          budgets = budgets.filter(b => b.id !== btn.dataset.id);
          save(K.budgets, budgets);
          renderFinance();
        });
      });
    }

    // Debts
    const dEl = document.getElementById('debt-list');
    if (dEl) {
      dEl.innerHTML = debts.length ? debts.map(d =>
        `<div class="data-row" data-id="${d.id}">
          <div class="data-main"><strong>${esc(d.name)}</strong> <span class="hint">${d.rate ? d.rate + '% p.a.' : ''}</span></div>
          <strong class="pnl-negative">${formatRp(d.amount)}</strong>
          <button class="btn-icon" data-act="del-debt">✕</button>
        </div>`
      ).join('') : '<p class="empty-hint">Tidak ada utang tercatat. Bagus.</p>';
      dEl.querySelectorAll('[data-act="del-debt"]').forEach(btn => {
        btn.addEventListener('click', () => {
          debts = debts.filter(d => d.id !== btn.closest('.data-row').dataset.id);
          save(K.debts, debts);
          renderFinance();
        });
      });
    }

    // Assets
    const aEl = document.getElementById('asset-list');
    if (aEl) {
      aEl.innerHTML = assets.length ? assets.map(a =>
        `<div class="data-row" data-id="${a.id}">
          <div class="data-main"><span class="tag tag-focus">${esc(a.type)}</span> <strong>${esc(a.name)}</strong></div>
          <strong class="pnl-positive">${formatRp(a.value)}</strong>
          <button class="btn-icon" data-act="del-asset">✕</button>
        </div>`
      ).join('') : '<p class="empty-hint">Belum ada aset / investasi.</p>';
      aEl.querySelectorAll('[data-act="del-asset"]').forEach(btn => {
        btn.addEventListener('click', () => {
          assets = assets.filter(a => a.id !== btn.closest('.data-row').dataset.id);
          save(K.assets, assets);
          renderFinance();
        });
      });
    }

    // Fin goals
    const gEl = document.getElementById('fin-goals-list');
    if (gEl) {
      gEl.innerHTML = finGoals.length ? finGoals.map(g => {
        const pct = g.target ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
        return `<div class="data-row" data-id="${g.id}">
          <div class="data-main" style="flex:1"><strong>${esc(g.title)}</strong>
            <div class="hint">${formatRp(g.current)} / ${formatRp(g.target)}</div>
            <div class="goal-progress-bar" style="margin-top:0.3rem"><div class="goal-progress-fill" style="width:${pct}%"></div></div>
          </div>
          <button class="btn btn-sm btn-outline" data-act="upd-fgoal">Update</button>
          <button class="btn-icon" data-act="del-fgoal">✕</button>
        </div>`;
      }).join('') : '<p class="empty-hint">Set financial goals (FI, rumah, dll).</p>';
      gEl.querySelectorAll('[data-act="upd-fgoal"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const g = finGoals.find(x => x.id === btn.closest('.data-row').dataset.id);
          if (!g) return;
          const c = Number(prompt('Current amount (Rp):', g.current));
          if (!isNaN(c)) { g.current = c; save(K.finGoals, finGoals); renderFinance(); }
        });
      });
      gEl.querySelectorAll('[data-act="del-fgoal"]').forEach(btn => {
        btn.addEventListener('click', () => {
          finGoals = finGoals.filter(g => g.id !== btn.closest('.data-row').dataset.id);
          save(K.finGoals, finGoals);
          renderFinance();
        });
      });
    }

    // Spending by category this month
    const spendEl = document.getElementById('spend-analytics');
    if (spendEl) {
      const byCat = {};
      monthTx.filter(t => t.type === 'expense').forEach(t => {
        byCat[t.category] = (byCat[t.category] || 0) + t.amount;
      });
      const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
      spendEl.innerHTML = entries.length ? entries.map(([cat, amt]) =>
        `<div class="mini-item"><strong>${esc(cat)}</strong> <span style="margin-left:auto" class="pnl-negative">${formatRp(amt)}</span></div>`
      ).join('') : '<p class="empty-hint">Belum ada pengeluaran bulan ini.</p>';
    }
  }
})();