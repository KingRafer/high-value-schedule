/* =========================
   High Value Dashboard
   ========================= */

const STORAGE_KEYS = {
  tasks: 'hv_tasks',
  trades: 'hv_trades',
  goals: 'hv_goals',
  dailyTarget: 'hv_daily_target',
};

// ---------- Helpers ----------
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatRp(n) {
  const num = Number(n) || 0;
  const abs = Math.abs(num);
  const formatted = new Intl.NumberFormat('id-ID').format(abs);
  return (num < 0 ? '-Rp ' : 'Rp ') + formatted;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateID(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ---------- State ----------
let tasks = load(STORAGE_KEYS.tasks, []);
let trades = load(STORAGE_KEYS.trades, []);
let goals = load(STORAGE_KEYS.goals, []);
let dailyTarget = load(STORAGE_KEYS.dailyTarget, 0);
let taskFilter = 'all';

// ---------- Navigation ----------
function showSection(id) {
  document.querySelectorAll('.section').forEach((s) => s.classList.remove('section-active'));
  document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
  const section = document.getElementById(id);
  if (section) section.classList.add('section-active');
  const link = document.querySelector(`.nav-link[data-section="${id}"]`);
  if (link) link.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(link.dataset.section);
  });
});

document.getElementById('btn-go-tasks')?.addEventListener('click', () => showSection('tasks'));
document.getElementById('btn-go-goals')?.addEventListener('click', () => showSection('goals'));

// ---------- Clock ----------
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const el = document.getElementById('header-time');
  if (el) el.textContent = `${h}:${m}`;

  const dateEl = document.getElementById('today-date');
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}

// ---------- Tasks ----------
function saveTasks() {
  save(STORAGE_KEYS.tasks, tasks);
  renderTasks();
  renderToday();
}

function renderTasks() {
  const list = document.getElementById('task-list');
  const empty = document.getElementById('tasks-empty');
  if (!list) return;

  let filtered = tasks;
  if (taskFilter === 'pending') filtered = tasks.filter((t) => !t.done);
  if (taskFilter === 'done') filtered = tasks.filter((t) => t.done);

  // Sort: pending first, then by created
  filtered = [...filtered].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (b.created || 0) - (a.created || 0);
  });

  list.innerHTML = filtered
    .map(
      (t) => `
    <div class="task-item ${t.done ? 'done' : ''}" data-id="${t.id}">
      <div class="task-check ${t.done ? 'checked' : ''}" data-action="toggle"></div>
      <div class="task-body">
        <div class="task-title">${escapeHtml(t.title)}</div>
        <div class="task-meta">
          <span class="tag tag-${t.category || 'other'}">${categoryLabel(t.category)}</span>
        </div>
        ${t.notes ? `<div class="task-notes">${escapeHtml(t.notes)}</div>` : ''}
      </div>
      <div class="task-actions">
        <button class="btn-icon" data-action="edit" title="Edit">✎</button>
        <button class="btn-icon" data-action="delete" title="Hapus">✕</button>
      </div>
    </div>
  `
    )
    .join('');

  if (empty) empty.hidden = filtered.length > 0;

  list.querySelectorAll('.task-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      const id = item.dataset.id;
      if (action === 'toggle') toggleTask(id);
      if (action === 'edit') openTaskModal(id);
      if (action === 'delete') deleteTask(id);
    });
  });
}

function categoryLabel(cat) {
  const map = {
    focus: 'Focus',
    body: 'Body',
    mind: 'Mind',
    rest: 'Rest',
    other: 'Lainnya',
  };
  return map[cat] || 'Lainnya';
}

function toggleTask(id) {
  const t = tasks.find((x) => x.id === id);
  if (t) {
    t.done = !t.done;
    t.doneAt = t.done ? Date.now() : null;
    saveTasks();
  }
}

function deleteTask(id) {
  if (!confirm('Hapus aktivitas ini?')) return;
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
}

function openTaskModal(id = null) {
  const modal = document.getElementById('modal-task');
  const form = document.getElementById('form-task');
  const titleEl = document.getElementById('modal-task-title');
  form.reset();
  document.getElementById('task-id').value = id || '';

  if (id) {
    const t = tasks.find((x) => x.id === id);
    if (t) {
      titleEl.textContent = 'Edit Aktivitas';
      document.getElementById('task-title').value = t.title;
      document.getElementById('task-category').value = t.category || 'focus';
      document.getElementById('task-notes').value = t.notes || '';
    }
  } else {
    titleEl.textContent = 'Tambah Aktivitas';
  }
  openModal('modal-task');
}

document.getElementById('btn-add-task')?.addEventListener('click', () => openTaskModal());

document.getElementById('form-task')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('task-id').value;
  const title = document.getElementById('task-title').value.trim();
  const category = document.getElementById('task-category').value;
  const notes = document.getElementById('task-notes').value.trim();

  if (!title) return;

  if (id) {
    const t = tasks.find((x) => x.id === id);
    if (t) {
      t.title = title;
      t.category = category;
      t.notes = notes;
    }
  } else {
    tasks.push({
      id: uid(),
      title,
      category,
      notes,
      done: false,
      created: Date.now(),
    });
  }
  saveTasks();
  closeModal();
});

document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    taskFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ---------- Trading ----------
function saveTrades() {
  save(STORAGE_KEYS.trades, trades);
  renderTrades();
  renderToday();
}

function renderTrades() {
  const tbody = document.getElementById('trade-tbody');
  const empty = document.getElementById('trades-empty');
  if (!tbody) return;

  const sorted = [...trades].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  tbody.innerHTML = sorted
    .map(
      (t) => `
    <tr data-id="${t.id}">
      <td>${formatDateID(t.date)}</td>
      <td><strong>${escapeHtml(t.pair)}</strong></td>
      <td class="side-${t.side}">${t.side === 'long' ? 'Long' : 'Short'}</td>
      <td>${t.entry || '—'}</td>
      <td>${t.exit || '—'}</td>
      <td class="${t.pnl >= 0 ? 'pnl-positive' : 'pnl-negative'}">${formatRp(t.pnl)}</td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(t.notes || '—')}</td>
      <td>
        <button class="btn-icon" data-action="edit-trade" title="Edit">✎</button>
        <button class="btn-icon" data-action="delete-trade" title="Hapus">✕</button>
      </td>
    </tr>
  `
    )
    .join('');

  if (empty) empty.hidden = trades.length > 0;

  // Summary
  const totalPnl = trades.reduce((s, t) => s + (Number(t.pnl) || 0), 0);
  const wins = trades.filter((t) => Number(t.pnl) > 0).length;
  const winRate = trades.length ? Math.round((wins / trades.length) * 100) : 0;

  const totalEl = document.getElementById('total-pnl');
  if (totalEl) {
    totalEl.textContent = formatRp(totalPnl);
    totalEl.className = 'stat-value ' + (totalPnl >= 0 ? 'positive' : 'negative');
  }
  const wrEl = document.getElementById('win-rate');
  if (wrEl) wrEl.textContent = winRate + '%';
  const countEl = document.getElementById('trade-count');
  if (countEl) countEl.textContent = trades.length;

  tbody.querySelectorAll('tr').forEach((row) => {
    row.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      const id = row.dataset.id;
      if (action === 'edit-trade') openTradeModal(id);
      if (action === 'delete-trade') deleteTrade(id);
    });
  });
}

function deleteTrade(id) {
  if (!confirm('Hapus trade ini?')) return;
  trades = trades.filter((t) => t.id !== id);
  saveTrades();
}

function openTradeModal(id = null) {
  const form = document.getElementById('form-trade');
  const titleEl = document.getElementById('modal-trade-title');
  form.reset();
  document.getElementById('trade-id').value = id || '';
  document.getElementById('trade-date').value = todayStr();

  if (id) {
    const t = trades.find((x) => x.id === id);
    if (t) {
      titleEl.textContent = 'Edit Trade';
      document.getElementById('trade-date').value = t.date || todayStr();
      document.getElementById('trade-pair').value = t.pair || '';
      document.getElementById('trade-side').value = t.side || 'long';
      document.getElementById('trade-pnl').value = t.pnl ?? '';
      document.getElementById('trade-entry').value = t.entry || '';
      document.getElementById('trade-exit').value = t.exit || '';
      document.getElementById('trade-notes').value = t.notes || '';
    }
  } else {
    titleEl.textContent = 'Catat Trade';
  }
  openModal('modal-trade');
}

document.getElementById('btn-add-trade')?.addEventListener('click', () => openTradeModal());

document.getElementById('form-trade')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('trade-id').value;
  const data = {
    date: document.getElementById('trade-date').value,
    pair: document.getElementById('trade-pair').value.trim(),
    side: document.getElementById('trade-side').value,
    pnl: Number(document.getElementById('trade-pnl').value) || 0,
    entry: document.getElementById('trade-entry').value.trim(),
    exit: document.getElementById('trade-exit').value.trim(),
    notes: document.getElementById('trade-notes').value.trim(),
  };

  if (!data.pair) return;

  if (id) {
    const t = trades.find((x) => x.id === id);
    if (t) Object.assign(t, data);
  } else {
    trades.push({ id: uid(), ...data, created: Date.now() });
  }
  saveTrades();
  closeModal();
});

// Daily target
document.getElementById('input-daily-target').value = dailyTarget || '';
document.getElementById('btn-save-target')?.addEventListener('click', () => {
  dailyTarget = Number(document.getElementById('input-daily-target').value) || 0;
  save(STORAGE_KEYS.dailyTarget, dailyTarget);
  renderToday();
  alert('Target harian disimpan: ' + formatRp(dailyTarget));
});

// ---------- Goals ----------
function saveGoals() {
  save(STORAGE_KEYS.goals, goals);
  renderGoals();
  renderToday();
}

function renderGoals() {
  const grid = document.getElementById('goals-grid');
  const empty = document.getElementById('goals-empty');
  if (!grid) return;

  grid.innerHTML = goals
    .map(
      (g) => `
    <div class="goal-card" data-id="${g.id}">
      <div class="goal-card-header">
        <h3>${escapeHtml(g.title)}</h3>
        <div class="task-actions">
          <button class="btn-icon" data-action="edit-goal" title="Edit">✎</button>
          <button class="btn-icon" data-action="delete-goal" title="Hapus">✕</button>
        </div>
      </div>
      ${g.desc ? `<p class="goal-desc">${escapeHtml(g.desc)}</p>` : ''}
      <div class="goal-progress-bar">
        <div class="goal-progress-fill" style="width:${g.progress || 0}%"></div>
      </div>
      <div class="goal-meta">
        <span class="tag tag-${g.category || 'other'}">${goalCategoryLabel(g.category)}</span>
        <span>${g.progress || 0}% ${g.year ? '· ' + g.year : ''}</span>
      </div>
    </div>
  `
    )
    .join('');

  if (empty) empty.hidden = goals.length > 0;

  grid.querySelectorAll('.goal-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      const id = card.dataset.id;
      if (action === 'edit-goal') openGoalModal(id);
      if (action === 'delete-goal') deleteGoal(id);
    });
  });
}

function goalCategoryLabel(cat) {
  const map = {
    finance: 'Keuangan',
    business: 'Bisnis',
    health: 'Kesehatan',
    relationship: 'Hubungan',
    skill: 'Skill',
    lifestyle: 'Lifestyle',
    other: 'Lainnya',
  };
  return map[cat] || 'Lainnya';
}

function deleteGoal(id) {
  if (!confirm('Hapus impian ini?')) return;
  goals = goals.filter((g) => g.id !== id);
  saveGoals();
}

function openGoalModal(id = null) {
  const form = document.getElementById('form-goal');
  const titleEl = document.getElementById('modal-goal-title');
  form.reset();
  document.getElementById('goal-id').value = id || '';
  document.getElementById('goal-progress').value = 0;

  if (id) {
    const g = goals.find((x) => x.id === id);
    if (g) {
      titleEl.textContent = 'Edit Impian';
      document.getElementById('goal-title').value = g.title;
      document.getElementById('goal-desc').value = g.desc || '';
      document.getElementById('goal-year').value = g.year || '';
      document.getElementById('goal-progress').value = g.progress || 0;
      document.getElementById('goal-category').value = g.category || 'finance';
    }
  } else {
    titleEl.textContent = 'Tambah Impian';
  }
  openModal('modal-goal');
}

document.getElementById('btn-add-goal')?.addEventListener('click', () => openGoalModal());

document.getElementById('form-goal')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('goal-id').value;
  const data = {
    title: document.getElementById('goal-title').value.trim(),
    desc: document.getElementById('goal-desc').value.trim(),
    year: document.getElementById('goal-year').value || null,
    progress: Math.min(100, Math.max(0, Number(document.getElementById('goal-progress').value) || 0)),
    category: document.getElementById('goal-category').value,
  };

  if (!data.title) return;

  if (id) {
    const g = goals.find((x) => x.id === id);
    if (g) Object.assign(g, data);
  } else {
    goals.push({ id: uid(), ...data, created: Date.now() });
  }
  saveGoals();
  closeModal();
});

// ---------- Today Overview ----------
function renderToday() {
  // Tasks summary
  const doneCount = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;
  const statTasks = document.getElementById('stat-tasks');
  if (statTasks) statTasks.textContent = `${doneCount}/${totalTasks}`;

  // Today tasks list
  const todayTasksEl = document.getElementById('today-tasks');
  const todayEmpty = document.getElementById('today-tasks-empty');
  if (todayTasksEl) {
    const pending = tasks.filter((t) => !t.done).slice(0, 6);
    const done = tasks.filter((t) => t.done).slice(0, 3);
    const show = [...pending, ...done].slice(0, 8);

    todayTasksEl.innerHTML = show
      .map(
        (t) => `
      <div class="task-item ${t.done ? 'done' : ''}" data-id="${t.id}">
        <div class="task-check ${t.done ? 'checked' : ''}" data-action="toggle"></div>
        <div class="task-body">
          <div class="task-title">${escapeHtml(t.title)}</div>
        </div>
      </div>
    `
      )
      .join('');

    todayTasksEl.querySelectorAll('.task-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="toggle"]')) {
          toggleTask(item.dataset.id);
        }
      });
    });

    if (todayEmpty) todayEmpty.hidden = show.length > 0;
  }

  // Profit today
  const today = todayStr();
  const todayTrades = trades.filter((t) => t.date === today);
  const todayPnl = todayTrades.reduce((s, t) => s + (Number(t.pnl) || 0), 0);

  const statProfit = document.getElementById('stat-profit');
  if (statProfit) {
    statProfit.textContent = formatRp(todayPnl);
    statProfit.className = 'stat-value ' + (todayPnl >= 0 ? 'positive' : 'negative');
  }

  // Target
  const targetDailyEl = document.getElementById('target-daily');
  const targetRealizedEl = document.getElementById('target-realized');
  const progressEl = document.getElementById('target-progress');
  const statusEl = document.getElementById('target-status');

  if (targetDailyEl) targetDailyEl.textContent = formatRp(dailyTarget);
  if (targetRealizedEl) {
    targetRealizedEl.textContent = formatRp(todayPnl);
    targetRealizedEl.className = todayPnl >= 0 ? 'positive' : 'negative';
  }

  let pct = 0;
  if (dailyTarget > 0) {
    pct = Math.min(100, Math.max(0, (todayPnl / dailyTarget) * 100));
  }
  if (progressEl) {
    progressEl.style.width = pct + '%';
    progressEl.style.background = todayPnl >= dailyTarget && dailyTarget > 0 ? 'var(--success)' : 'var(--accent)';
  }
  if (statusEl) {
    if (dailyTarget <= 0) statusEl.textContent = 'Set target profit harian di tab Trading';
    else if (todayPnl >= dailyTarget) statusEl.textContent = 'Target tercapai! 🔥';
    else if (todayTrades.length === 0) statusEl.textContent = 'Belum ada trade hari ini';
    else statusEl.textContent = `Progress ${Math.round(pct)}% dari target`;
  }

  // Goals count + preview
  const statGoals = document.getElementById('stat-goals');
  if (statGoals) statGoals.textContent = goals.length;

  const goalsPreview = document.getElementById('today-goals');
  if (goalsPreview) {
    const top = goals.slice(0, 4);
    goalsPreview.innerHTML =
      top
        .map(
          (g) => `
      <div class="goal-preview-item">
        <h4>${escapeHtml(g.title)}</h4>
        <div class="goal-progress-bar">
          <div class="goal-progress-fill" style="width:${g.progress || 0}%"></div>
        </div>
        <div class="goal-meta" style="margin-top:0.4rem">
          <span class="tag tag-${g.category || 'other'}">${goalCategoryLabel(g.category)}</span>
          <span>${g.progress || 0}%</span>
        </div>
      </div>
    `
        )
        .join('') || '<p class="empty-hint" style="padding:1rem 0">Belum ada impian.</p>';
  }
}

// ---------- Schedule templates ----------
const scheduleTemplates = {
  builder: [
    { time: '05:30', title: 'Bangun & Movement' },
    { time: '06:00', title: 'Journal & Priorities' },
    { time: '06:30', title: 'Deep Work 1' },
    { time: '09:00', title: 'Break + Fuel' },
    { time: '09:30', title: 'Deep Work 2' },
    { time: '12:00', title: 'Training + Lunch' },
    { time: '13:30', title: 'Deep Work 3' },
    { time: '16:30', title: 'Admin / Learning' },
    { time: '18:00', title: 'Dinner & Recover' },
    { time: '20:00', title: 'Review & Plan' },
  ],
  athlete: [
    { time: '05:00', title: 'Bangun & Mobility' },
    { time: '05:30', title: 'Strength Training' },
    { time: '07:00', title: 'Fuel & Recover' },
    { time: '08:00', title: 'Deep Work' },
    { time: '11:00', title: 'Active Recovery' },
    { time: '12:00', title: 'Lunch + Nap' },
    { time: '13:00', title: 'Skill / Cardio' },
    { time: '15:00', title: 'Work / Learning' },
    { time: '19:00', title: 'Wind Down' },
    { time: '20:30', title: 'Sleep Prep' },
  ],
  balanced: [
    { time: '06:00', title: 'Bangun & Journal' },
    { time: '06:30', title: 'Training' },
    { time: '08:30', title: 'Deep Work' },
    { time: '11:30', title: 'Lunch' },
    { time: '12:30', title: 'Meetings / Collab' },
    { time: '15:00', title: 'Admin & Learning' },
    { time: '16:30', title: 'Family / Social' },
    { time: '18:00', title: 'Dinner' },
    { time: '19:30', title: 'Hobby / Wind Down' },
    { time: '21:00', title: 'Review' },
  ],
};

document.querySelectorAll('.apply-template').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.closest('.template-card')?.dataset.template;
    const items = scheduleTemplates[key];
    if (!items) return;
    if (!confirm(`Tambahkan ${items.length} aktivitas dari template "${key}" ke daftar aktivitas?`)) return;

    items.forEach((item) => {
      tasks.push({
        id: uid(),
        title: `${item.time} – ${item.title}`,
        category: 'focus',
        notes: '',
        done: false,
        created: Date.now(),
      });
    });
    saveTasks();
    showSection('tasks');
  });
});

// Simple schedule display
function renderScheduleRef() {
  const grid = document.getElementById('schedule-grid');
  if (!grid) return;
  const items = [
    { time: '05:00 – 06:30', title: 'Morning Routine', desc: 'Bangun, movement, journal', tag: 'mind' },
    { time: '06:30 – 11:30', title: 'Deep Work Blocks', desc: 'Fokus penuh tanpa distraksi', tag: 'focus' },
    { time: '11:30 – 13:30', title: 'Training + Lunch', desc: 'Body first, then fuel', tag: 'body' },
    { time: '13:30 – 17:00', title: 'Work / Meetings', desc: 'Kolaborasi & admin', tag: 'focus' },
    { time: '17:00 – 21:00', title: 'Evening', desc: 'Social, family, wind down', tag: 'rest' },
    { time: '21:00 – 22:00', title: 'Review & Sleep', desc: 'Evaluasi hari + recovery', tag: 'mind' },
  ];
  grid.innerHTML = items
    .map(
      (i) => `
    <div class="block">
      <div class="block-time">${i.time}</div>
      <div class="block-content">
        <h3>${i.title}</h3>
        <p>${i.desc}</p>
      </div>
      <span class="tag tag-${i.tag}">${i.tag}</span>
    </div>
  `
    )
    .join('');
}

// ---------- Modal helpers ----------
function openModal(id) {
  document.getElementById('modal-overlay').hidden = false;
  document.querySelectorAll('.modal').forEach((m) => (m.hidden = true));
  document.getElementById(id).hidden = false;
}

function closeModal() {
  document.getElementById('modal-overlay').hidden = true;
  document.querySelectorAll('.modal').forEach((m) => (m.hidden = true));
}

document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
  if (e.target.id === 'modal-overlay' || e.target.hasAttribute('data-close')) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ---------- Utils ----------
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"');
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 30000);
  renderTasks();
  renderTrades();
  renderGoals();
  renderToday();
  renderScheduleRef();

  // Hash navigation
  const hash = location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    showSection(hash);
  }
});