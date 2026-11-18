/* High Value OS — Full Dashboard */
const KEYS = {
  tasks: 'hvos_tasks',
  trades: 'hvos_trades',
  goals: 'hvos_goals',
  habits: 'hvos_habits',
  habitLog: 'hvos_habit_log',
  blocks: 'hvos_blocks',
  challenges: 'hvos_challenges',
  dailyTarget: 'hvos_daily_target',
  pomoStats: 'hvos_pomo_stats',
  morningRoutine: 'hvos_morning',
  eveningRoutine: 'hvos_evening',
  workoutDays: 'hvos_workout_days',
  routineChecks: 'hvos_routine_checks',
};

const DEFAULT_HABITS = [
  { id: 'h1', name: 'Bangun sebelum 06:00', icon: '🌅', category: 'discipline', target: 7 },
  { id: 'h2', name: 'Workout / Training', icon: '💪', category: 'health', target: 5 },
  { id: 'h3', name: 'Deep work 2+ jam', icon: '🎯', category: 'work', target: 6 },
  { id: 'h4', name: 'Baca / Belajar', icon: '📖', category: 'mind', target: 7 },
  { id: 'h5', name: 'No junk food', icon: '🥗', category: 'health', target: 7 },
  { id: 'h6', name: 'Journal malam', icon: '✍️', category: 'mind', target: 7 },
];

const DEFAULT_MORNING = [
  'Minum air + sunlight',
  'Movement / stretch 10 menit',
  'Cold shower',
  'Journal: 3 gratitude + top 3 priority',
  'Tidak buka HP sebelum selesai routine',
];

const DEFAULT_EVENING = [
  'Review hari ini (apa yang berhasil)',
  'Plan 3 prioritas besok',
  'Screen-off 30 menit sebelum tidur',
  'Siapkan pakaian / tools besok',
  'Tidur sebelum 22:30',
];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
function load(k, fb) {
  try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; }
}
function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function todayStr() { return new Date().toISOString().slice(0, 10); }
function formatRp(n) {
  const num = Number(n) || 0;
  return (num < 0 ? '-Rp ' : 'Rp ') + new Intl.NumberFormat('id-ID').format(Math.abs(num));
}
function formatDateID(s) {
  if (!s) return '—';
  return new Date(s + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
}
function daysAgo(n) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// State
let tasks = load(KEYS.tasks, []);
let trades = load(KEYS.trades, []);
let goals = load(KEYS.goals, []);
let habits = load(KEYS.habits, DEFAULT_HABITS);
let habitLog = load(KEYS.habitLog, {}); // { 'YYYY-MM-DD': { habitId: true } }
let blocks = load(KEYS.blocks, []);
let challenges = load(KEYS.challenges, []);
let dailyTarget = load(KEYS.dailyTarget, 0);
let pomoStats = load(KEYS.pomoStats, {}); // { 'YYYY-MM-DD': { count, minutes } }
let morningItems = load(KEYS.morningRoutine, DEFAULT_MORNING);
let eveningItems = load(KEYS.eveningRoutine, DEFAULT_EVENING);
let workoutDays = load(KEYS.workoutDays, [1, 3, 5]); // 0=Sun
let routineChecks = load(KEYS.routineChecks, {}); // { 'YYYY-MM-DD': { morning: [], evening: [] } }
let taskFilter = 'all';
let viewDate = new Date();
let calendarMonth = new Date();

// ---------- NAV ----------
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('section-active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('section-active');
  const nav = document.querySelector(`.nav-item[data-section="${id}"]`);
  if (nav) nav.classList.add('active');
  document.getElementById('sidebar')?.classList.remove('open');
  if (id === 'dashboard') renderDashboard();
  if (id === 'schedule') renderSchedule();
  if (id === 'habits') renderHabits();
  if (id === 'tasks') renderTasks();
  if (id === 'trading') renderTrades();
  if (id === 'goals') renderGoals();
  if (id === 'timer') renderTimerStats();
}

document.querySelectorAll('.nav-item').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); showSection(el.dataset.section); });
});
document.querySelectorAll('[data-goto]').forEach(el => {
  el.addEventListener('click', () => showSection(el.dataset.goto));
});
document.getElementById('menu-toggle')?.addEventListener('click', () => {
  document.getElementById('sidebar')?.classList.toggle('open');
});

// ---------- CLOCK & GREETING ----------
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const clock = document.getElementById('sidebar-clock');
  if (clock) clock.textContent = `${h}:${m}`;
  const dateEl = document.getElementById('sidebar-date');
  if (dateEl) dateEl.textContent = now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });

  const hour = now.getHours();
  let greet = 'Selamat datang';
  if (hour < 11) greet = 'Selamat pagi';
  else if (hour < 15) greet = 'Selamat siang';
  else if (hour < 18) greet = 'Selamat sore';
  else greet = 'Selamat malam';

  const g1 = document.getElementById('greeting');
  if (g1) g1.textContent = `${greet}, High Value Man`;
  const g2 = document.getElementById('dash-greeting');
  if (g2) g2.textContent = `${greet} — fokusikan hari ini dengan disiplin`;
  const d2 = document.getElementById('dash-date');
  if (d2) d2.textContent = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// ---------- PERFORMANCE SCORE ----------
function calcScore() {
  const today = todayStr();
  const log = habitLog[today] || {};
  const habitDone = habits.filter(h => log[h.id]).length;
  const habitPct = habits.length ? habitDone / habits.length : 0;

  const taskDone = tasks.filter(t => t.done).length;
  const taskPct = tasks.length ? taskDone / tasks.length : 0;

  const rc = routineChecks[today] || { morning: [], evening: [] };
  const mornPct = morningItems.length ? (rc.morning?.length || 0) / morningItems.length : 0;
  const evePct = eveningItems.length ? (rc.evening?.length || 0) / eveningItems.length : 0;

  const score = Math.round((habitPct * 40 + taskPct * 30 + mornPct * 15 + evePct * 15));
  return Math.min(100, score);
}

function updateScoreUI(score) {
  const el = document.getElementById('perf-score');
  if (el) el.textContent = score;
  const circle = document.getElementById('score-circle');
  if (circle) {
    const offset = 264 - (264 * score) / 100;
    circle.style.strokeDashoffset = offset;
  }
}

// ---------- DASHBOARD ----------
function renderDashboard() {
  const score = calcScore();
  updateScoreUI(score);

  const today = todayStr();
  const log = habitLog[today] || {};
  const habitDone = habits.filter(h => log[h.id]).length;
  document.getElementById('dash-habits').textContent = `${habitDone}/${habits.length}`;

  const taskDone = tasks.filter(t => t.done).length;
  document.getElementById('dash-tasks').textContent = `${taskDone}/${tasks.length}`;

  // Best streak
  let best = 0;
  habits.forEach(h => { best = Math.max(best, getStreak(h.id)); });
  document.getElementById('dash-streak').textContent = best + '🔥';

  // PnL today
  const todayPnl = trades.filter(t => t.date === today).reduce((s, t) => s + (Number(t.pnl) || 0), 0);
  const pnlEl = document.getElementById('dash-pnl');
  if (pnlEl) {
    pnlEl.textContent = formatRp(todayPnl);
    pnlEl.className = 'stat-value ' + (todayPnl >= 0 ? 'positive' : 'negative');
  }

  // Priorities
  const prios = tasks.filter(t => !t.done && t.priority).slice(0, 5);
  const pending = tasks.filter(t => !t.done && !t.priority).slice(0, 5 - prios.length);
  const showTasks = [...prios, ...pending];
  const prioEl = document.getElementById('dash-priorities');
  if (prioEl) {
    prioEl.innerHTML = showTasks.length
      ? showTasks.map(t => `
        <div class="mini-item ${t.done ? 'done' : ''}" data-id="${t.id}">
          <div class="mini-check ${t.done ? 'checked' : ''}" data-action="toggle-task"></div>
          <span>${escapeHtml(t.title)}</span>
        </div>`).join('')
      : '<p class="hint">Belum ada prioritas. Tambah task dengan flag prioritas.</p>';
    prioEl.querySelectorAll('[data-action="toggle-task"]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.closest('.mini-item').dataset.id;
        toggleTask(id);
        renderDashboard();
      });
    });
  }

  // Habits mini
  const hEl = document.getElementById('dash-habit-list');
  if (hEl) {
    hEl.innerHTML = habits.slice(0, 6).map(h => {
      const done = !!(log[h.id]);
      return `<div class="mini-item ${done ? 'done' : ''}" data-hid="${h.id}">
        <div class="mini-check ${done ? 'checked' : ''}" data-action="toggle-habit"></div>
        <span>${h.icon || ''} ${escapeHtml(h.name)}</span>
      </div>`;
    }).join('');
    hEl.querySelectorAll('[data-action="toggle-habit"]').forEach(el => {
      el.addEventListener('click', () => {
        toggleHabit(el.closest('.mini-item').dataset.hid);
        renderDashboard();
      });
    });
  }

  // Schedule today
  const dayBlocks = getBlocksForDate(today).slice(0, 6);
  const sEl = document.getElementById('dash-schedule');
  if (sEl) {
    sEl.innerHTML = dayBlocks.length
      ? dayBlocks.map(b => `<div class="mini-item"><strong style="color:var(--accent);margin-right:0.5rem">${b.start}</strong> ${escapeHtml(b.title)}</div>`).join('')
      : '<p class="hint">Belum ada time block hari ini. Tambah di Schedule.</p>';
  }

  // Week bars
  renderWeekBars();
  renderMonthStats();
}

function renderWeekBars() {
  const el = document.getElementById('week-bars');
  if (!el) return;
  const labels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const today = new Date();
  const dayOfWeek = today.getDay();
  let html = '';
  let totalDone = 0, totalPossible = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - dayOfWeek + i);
    const key = d.toISOString().slice(0, 10);
    const log = habitLog[key] || {};
    const done = habits.filter(h => log[h.id]).length;
    const pct = habits.length ? (done / habits.length) * 100 : 0;
    totalDone += done;
    totalPossible += habits.length;
    const isToday = key === todayStr();
    html += `<div class="week-bar-col">
      <div class="week-bar ${pct > 0 ? 'filled' : ''}" style="height:${Math.max(4, pct * 0.7)}px"></div>
      <span class="week-bar-label" style="${isToday ? 'color:var(--accent);font-weight:700' : ''}">${labels[i]}</span>
    </div>`;
  }
  el.innerHTML = html;
  const sum = document.getElementById('week-summary');
  if (sum) {
    const rate = totalPossible ? Math.round((totalDone / totalPossible) * 100) : 0;
    sum.textContent = `Minggu ini: ${totalDone}/${totalPossible} check-ins (${rate}%)`;
  }
}

function renderMonthStats() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  let taskDone = 0, habitChecks = 0, pomos = 0, daysWithData = 0, daysFull = 0;

  // Tasks completed this month (approx by doneAt)
  tasks.forEach(t => {
    if (t.done && t.doneAt) {
      const d = new Date(t.doneAt);
      if (d.getFullYear() === year && d.getMonth() === month) taskDone++;
    }
  });

  for (let day = 1; day <= now.getDate(); day++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const log = habitLog[key] || {};
    const c = Object.keys(log).filter(k => log[k]).length;
    if (c > 0) daysWithData++;
    if (c >= habits.length && habits.length > 0) daysFull++;
    habitChecks += c;
    if (pomoStats[key]) pomos += pomoStats[key].count || 0;
  }

  document.getElementById('ms-tasks').textContent = taskDone;
  document.getElementById('ms-habits').textContent = habitChecks;
  document.getElementById('ms-pomos').textContent = pomos;
  const rate = now.getDate() ? Math.round((daysFull / now.getDate()) * 100) : 0;
  document.getElementById('ms-discipline').textContent = rate + '%';
}

// ---------- HABITS ----------
function getStreak(habitId) {
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const key = daysAgo(i);
    const log = habitLog[key] || {};
    if (log[habitId]) streak++;
    else if (i > 0) break; // allow today not done yet
    else break;
  }
  // If today not done, still count previous
  if (!(habitLog[todayStr()] || {})[habitId]) {
    streak = 0;
    for (let i = 1; i < 365; i++) {
      const key = daysAgo(i);
      if ((habitLog[key] || {})[habitId]) streak++;
      else break;
    }
  }
  return streak;
}

function getBestStreak(habitId) {
  let best = 0, cur = 0;
  for (let i = 60; i >= 0; i--) {
    const key = daysAgo(i);
    if ((habitLog[key] || {})[habitId]) { cur++; best = Math.max(best, cur); }
    else cur = 0;
  }
  return best;
}

function toggleHabit(id) {
  const today = todayStr();
  if (!habitLog[today]) habitLog[today] = {};
  habitLog[today][id] = !habitLog[today][id];
  if (!habitLog[today][id]) delete habitLog[today][id];
  save(KEYS.habitLog, habitLog);
  renderHabits();
}

function renderHabits() {
  const today = todayStr();
  const log = habitLog[today] || {};
  document.getElementById('habit-date-label').textContent = formatDateID(today);

  const done = habits.filter(h => log[h.id]).length;
  document.getElementById('habit-today-count').textContent = `${done}/${habits.length}`;

  let activeStreaks = 0, bestAll = 0;
  habits.forEach(h => {
    const s = getStreak(h.id);
    if (s > 0) activeStreaks++;
    bestAll = Math.max(bestAll, getBestStreak(h.id), s);
  });
  document.getElementById('habit-active-streaks').textContent = activeStreaks;
  document.getElementById('habit-best-streak').textContent = bestAll;

  // Discipline rate last 7 days
  let checks = 0, possible = 0;
  for (let i = 0; i < 7; i++) {
    const key = daysAgo(i);
    const l = habitLog[key] || {};
    checks += habits.filter(h => l[h.id]).length;
    possible += habits.length;
  }
  const rate = possible ? Math.round((checks / possible) * 100) : 0;
  document.getElementById('habit-discipline-rate').textContent = rate + '%';

  // Tracker
  const tracker = document.getElementById('habit-tracker');
  if (tracker) {
    tracker.innerHTML = habits.map(h => {
      const isDone = !!log[h.id];
      const streak = getStreak(h.id);
      return `<div class="habit-row ${isDone ? 'done' : ''}" data-id="${h.id}">
        <div class="habit-toggle ${isDone ? 'checked' : ''}" data-action="toggle"></div>
        <span class="habit-icon">${h.icon || '◆'}</span>
        <div class="habit-info">
          <div class="habit-name">${escapeHtml(h.name)}</div>
          <div class="habit-meta"><span class="tag tag-${h.category || 'other'}">${h.category || 'other'}</span> · target ${h.target || 7}x/minggu</div>
        </div>
        <div class="habit-streak">${streak > 0 ? streak + ' 🔥' : '—'}</div>
        <button class="btn-icon" data-action="edit" title="Edit">✎</button>
        <button class="btn-icon" data-action="delete" title="Hapus">✕</button>
      </div>`;
    }).join('') || '<p class="empty-hint">Belum ada habit. Tambah custom habit.</p>';

    tracker.querySelectorAll('.habit-row').forEach(row => {
      row.addEventListener('click', e => {
        const action = e.target.closest('[data-action]')?.dataset.action;
        const id = row.dataset.id;
        if (action === 'toggle') { toggleHabit(id); }
        if (action === 'edit') openHabitModal(id);
        if (action === 'delete') {
          if (confirm('Hapus habit ini?')) {
            habits = habits.filter(h => h.id !== id);
            save(KEYS.habits, habits);
            renderHabits();
          }
        }
      });
    });
  }

  // Morning / Night checklists
  renderRoutineCheck('morning', morningItems, 'morning-check');
  renderRoutineCheck('evening', eveningItems, 'night-check');

  // Consistency chart
  renderConsistency();
  renderChallenges();
}

function renderRoutineCheck(type, items, elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const today = todayStr();
  if (!routineChecks[today]) routineChecks[today] = { morning: [], evening: [] };
  const checked = routineChecks[today][type] || [];

  el.innerHTML = items.map((item, idx) => {
    const isDone = checked.includes(idx);
    return `<div class="routine-item ${isDone ? 'done' : ''}" data-type="${type}" data-idx="${idx}">
      <div class="habit-toggle ${isDone ? 'checked' : ''}" data-action="toggle-routine"></div>
      <span>${escapeHtml(item)}</span>
    </div>`;
  }).join('');

  el.querySelectorAll('[data-action="toggle-routine"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.routine-item');
      const t = row.dataset.type;
      const idx = Number(row.dataset.idx);
      if (!routineChecks[today]) routineChecks[today] = { morning: [], evening: [] };
      const arr = routineChecks[today][t] || [];
      const pos = arr.indexOf(idx);
      if (pos >= 0) arr.splice(pos, 1);
      else arr.push(idx);
      routineChecks[today][t] = arr;
      save(KEYS.routineChecks, routineChecks);
      renderHabits();
      renderDashboard();
    });
  });
}

function renderConsistency() {
  const el = document.getElementById('consistency-chart');
  if (!el) return;
  const labels = [];
  let html = '';
  for (let i = 6; i >= 0; i--) {
    const key = daysAgo(i);
    const d = new Date(key + 'T00:00:00');
    labels.push(d.toLocaleDateString('id-ID', { weekday: 'short' }));
    const log = habitLog[key] || {};
    const done = habits.filter(h => log[h.id]).length;
    const pct = habits.length ? (done / habits.length) * 100 : 0;
    let cls = 'low';
    if (pct >= 80) cls = 'good';
    else if (pct >= 40) cls = 'mid';
    html += `<div class="cons-col">
      <div class="cons-bar ${cls}" style="height:${Math.max(4, pct * 0.9)}px"></div>
      <span class="cons-label">${labels[6 - i]}</span>
    </div>`;
  }
  el.innerHTML = html;
}

function renderChallenges() {
  const el = document.getElementById('challenges-list');
  if (!el) return;
  if (!challenges.length) {
    el.innerHTML = '<p class="empty-hint">Belum ada challenge. Mulai 30-day challenge.</p>';
    return;
  }
  el.innerHTML = challenges.map(c => {
    const start = new Date(c.start);
    const elapsed = Math.floor((Date.now() - start.getTime()) / 86400000) + 1;
    const progress = Math.min(100, Math.round((elapsed / c.days) * 100));
    const remaining = Math.max(0, c.days - elapsed);
    return `<div class="challenge-card" data-id="${c.id}">
      <div class="challenge-info">
        <div class="challenge-name">${escapeHtml(c.name)}</div>
        <div class="challenge-progress"><div class="challenge-fill" style="width:${progress}%"></div></div>
      </div>
      <div class="challenge-days">Hari ${Math.min(elapsed, c.days)}/${c.days}${remaining === 0 ? ' ✓' : ''}</div>
      <button class="btn-icon" data-action="del-challenge">✕</button>
    </div>`;
  }).join('');

  el.querySelectorAll('[data-action="del-challenge"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.closest('.challenge-card').dataset.id;
      if (confirm('Hapus challenge?')) {
        challenges = challenges.filter(c => c.id !== id);
        save(KEYS.challenges, challenges);
        renderChallenges();
      }
    });
  });
}

// Habit modal
function openHabitModal(id = null) {
  const form = document.getElementById('form-habit');
  form.reset();
  document.getElementById('habit-id').value = id || '';
  document.getElementById('modal-habit-title').textContent = id ? 'Edit Habit' : 'Tambah Habit';
  if (id) {
    const h = habits.find(x => x.id === id);
    if (h) {
      document.getElementById('habit-name').value = h.name;
      document.getElementById('habit-category').value = h.category || 'discipline';
      document.getElementById('habit-target').value = h.target || 7;
      document.getElementById('habit-icon').value = h.icon || '';
    }
  }
  openModal('modal-habit');
}

document.getElementById('btn-add-habit')?.addEventListener('click', () => openHabitModal());
document.getElementById('btn-quick-habit')?.addEventListener('click', () => openHabitModal());

document.getElementById('form-habit')?.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('habit-id').value;
  const data = {
    name: document.getElementById('habit-name').value.trim(),
    category: document.getElementById('habit-category').value,
    target: Number(document.getElementById('habit-target').value) || 7,
    icon: document.getElementById('habit-icon').value.trim() || '◆',
  };
  if (!data.name) return;
  if (id) {
    const h = habits.find(x => x.id === id);
    if (h) Object.assign(h, data);
  } else {
    habits.push({ id: uid(), ...data });
  }
  save(KEYS.habits, habits);
  closeModal();
  renderHabits();
  renderDashboard();
});

document.getElementById('btn-add-challenge')?.addEventListener('click', () => openModal('modal-challenge'));
document.getElementById('form-challenge')?.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('challenge-name').value.trim();
  const days = Number(document.getElementById('challenge-days').value) || 30;
  if (!name) return;
  challenges.push({ id: uid(), name, days, start: todayStr() });
  save(KEYS.challenges, challenges);
  closeModal();
  renderChallenges();
});

// ---------- SCHEDULE ----------
function getBlocksForDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0 Sun
  return blocks.filter(b => {
    if (b.date === dateStr) return true;
    if (b.recur === 'daily') return true;
    if (b.recur === 'weekdays' && day >= 1 && day <= 5) return true;
    if (b.recur === 'weekly' && b.date) {
      const orig = new Date(b.date + 'T00:00:00');
      return orig.getDay() === day;
    }
    return false;
  }).sort((a, b) => (a.start || '').localeCompare(b.start || ''));
}

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

function renderSchedule() {
  renderDayView();
  renderWeekView();
  renderMonthView();
  renderRoutinesView();
}

function renderDayView() {
  const key = dateKey(viewDate);
  const isToday = key === todayStr();
  const label = document.getElementById('day-label');
  if (label) {
    label.textContent = isToday ? 'Hari Ini' : viewDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  const list = document.getElementById('time-blocks');
  if (!list) return;
  const items = getBlocksForDate(key);
  list.innerHTML = items.length
    ? items.map(b => `
      <div class="tblock" data-id="${b.id}">
        <div class="tblock-time">${b.start} – ${b.end}</div>
        <div class="tblock-title">${escapeHtml(b.title)}</div>
        <div style="display:flex;gap:0.4rem;align-items:center">
          <span class="tblock-type type-${b.type || 'focus'}">${b.type || 'focus'}</span>
          <button class="btn-icon" data-action="edit-block">✎</button>
          <button class="btn-icon" data-action="del-block">✕</button>
        </div>
      </div>`).join('')
    : '<p class="empty-hint">Belum ada time block. Klik "+ Time Block" untuk menambah.</p>';

  list.querySelectorAll('.tblock').forEach(row => {
    row.addEventListener('click', e => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      const id = row.dataset.id;
      if (action === 'edit-block') openBlockModal(id);
      if (action === 'del-block') {
        if (confirm('Hapus block ini?')) {
          blocks = blocks.filter(b => b.id !== id);
          save(KEYS.blocks, blocks);
          renderSchedule();
        }
      }
    });
  });
}

document.getElementById('day-prev')?.addEventListener('click', () => {
  viewDate.setDate(viewDate.getDate() - 1);
  renderDayView();
});
document.getElementById('day-next')?.addEventListener('click', () => {
  viewDate.setDate(viewDate.getDate() + 1);
  renderDayView();
});
document.getElementById('day-today')?.addEventListener('click', () => {
  viewDate = new Date();
  renderDayView();
});

// Schedule tabs
document.querySelectorAll('#schedule-tabs .view-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#schedule-tabs .view-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    ['day', 'week', 'month', 'routines'].forEach(v => {
      const el = document.getElementById('view-' + v);
      if (el) el.hidden = v !== tab.dataset.view;
    });
  });
});

function renderWeekView() {
  const el = document.getElementById('week-grid');
  if (!el) return;
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  const labels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  let html = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = dateKey(d);
    const isToday = key === todayStr();
    const items = getBlocksForDate(key).slice(0, 4);
    html += `<div class="week-day ${isToday ? 'today' : ''}">
      <div class="week-day-header">${labels[i]} ${d.getDate()}</div>
      ${items.map(b => `<div class="week-event">${b.start} ${escapeHtml(b.title)}</div>`).join('') || '<span class="hint" style="font-size:0.7rem">—</span>'}
    </div>`;
  }
  el.innerHTML = html;
}

function renderMonthView() {
  const el = document.getElementById('calendar');
  const label = document.getElementById('month-label');
  if (!el) return;
  const y = calendarMonth.getFullYear();
  const m = calendarMonth.getMonth();
  if (label) label.textContent = calendarMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const first = new Date(y, m, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today = todayStr();

  let html = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d => `<div class="cal-head">${d}</div>`).join('');
  for (let i = 0; i < startDay; i++) html += `<div class="cal-cell other"></div>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const count = getBlocksForDate(key).length;
    const isToday = key === today;
    html += `<div class="cal-cell ${isToday ? 'today' : ''}" data-date="${key}">
      <span class="cal-num">${day}</span>
      <div class="cal-dots">${Array(Math.min(count, 3)).fill('<span class="cal-dot"></span>').join('')}</div>
    </div>`;
  }
  el.innerHTML = html;
  el.querySelectorAll('.cal-cell[data-date]').forEach(cell => {
    cell.addEventListener('click', () => {
      viewDate = new Date(cell.dataset.date + 'T00:00:00');
      document.querySelectorAll('#schedule-tabs .view-tab').forEach(t => t.classList.remove('active'));
      document.querySelector('#schedule-tabs [data-view="day"]')?.classList.add('active');
      ['day','week','month','routines'].forEach(v => {
        const e = document.getElementById('view-' + v);
        if (e) e.hidden = v !== 'day';
      });
      renderDayView();
    });
  });
}

document.getElementById('month-prev')?.addEventListener('click', () => {
  calendarMonth.setMonth(calendarMonth.getMonth() - 1);
  renderMonthView();
});
document.getElementById('month-next')?.addEventListener('click', () => {
  calendarMonth.setMonth(calendarMonth.getMonth() + 1);
  renderMonthView();
});

function renderRoutinesView() {
  const mEl = document.getElementById('morning-routine');
  if (mEl) mEl.innerHTML = morningItems.map(i => `<div class="routine-item"><span>${escapeHtml(i)}</span></div>`).join('');
  const eEl = document.getElementById('evening-routine');
  if (eEl) eEl.innerHTML = eveningItems.map(i => `<div class="routine-item"><span>${escapeHtml(i)}</span></div>`).join('');

  const wEl = document.getElementById('workout-days');
  if (wEl) {
    const names = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
    wEl.innerHTML = names.map((n, i) =>
      `<button class="chip ${workoutDays.includes(i) ? 'active' : ''}" data-day="${i}">${n}</button>`
    ).join('');
    wEl.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const day = Number(chip.dataset.day);
        if (workoutDays.includes(day)) workoutDays = workoutDays.filter(d => d !== day);
        else workoutDays.push(day);
        save(KEYS.workoutDays, workoutDays);
        renderRoutinesView();
      });
    });
  }

  const wb = document.getElementById('work-blocks');
  if (wb) {
    wb.innerHTML = [
      '06:30 – 09:00 Deep Work 1',
      '09:30 – 12:00 Deep Work 2',
      '13:30 – 16:00 Deep Work / Meetings',
      '16:00 – 17:30 Admin & Learning',
    ].map(t => `<div class="mini-item">${t}</div>`).join('');
  }
}

document.getElementById('btn-edit-morning')?.addEventListener('click', () => {
  const raw = prompt('Edit Morning Routine (satu item per baris):', morningItems.join('\n'));
  if (raw !== null) {
    morningItems = raw.split('\n').map(s => s.trim()).filter(Boolean);
    save(KEYS.morningRoutine, morningItems);
    renderRoutinesView();
    renderHabits();
  }
});
document.getElementById('btn-edit-evening')?.addEventListener('click', () => {
  const raw = prompt('Edit Evening Routine (satu item per baris):', eveningItems.join('\n'));
  if (raw !== null) {
    eveningItems = raw.split('\n').map(s => s.trim()).filter(Boolean);
    save(KEYS.eveningRoutine, eveningItems);
    renderRoutinesView();
    renderHabits();
  }
});

function openBlockModal(id = null) {
  const form = document.getElementById('form-block');
  form.reset();
  document.getElementById('block-id').value = id || '';
  document.getElementById('block-date').value = dateKey(viewDate);
  document.getElementById('modal-block-title').textContent = id ? 'Edit Block' : 'Time Block';
  if (id) {
    const b = blocks.find(x => x.id === id);
    if (b) {
      document.getElementById('block-title').value = b.title;
      document.getElementById('block-date').value = b.date || dateKey(viewDate);
      document.getElementById('block-type').value = b.type || 'focus';
      document.getElementById('block-start').value = b.start || '';
      document.getElementById('block-end').value = b.end || '';
      document.getElementById('block-recur').value = b.recur || 'none';
    }
  }
  openModal('modal-block');
}

document.getElementById('btn-add-block')?.addEventListener('click', () => openBlockModal());
document.getElementById('btn-add-event')?.addEventListener('click', () => openBlockModal());

document.getElementById('form-block')?.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('block-id').value;
  const data = {
    title: document.getElementById('block-title').value.trim(),
    date: document.getElementById('block-date').value,
    type: document.getElementById('block-type').value,
    start: document.getElementById('block-start').value,
    end: document.getElementById('block-end').value,
    recur: document.getElementById('block-recur').value,
  };
  if (!data.title) return;
  if (id) {
    const b = blocks.find(x => x.id === id);
    if (b) Object.assign(b, data);
  } else {
    blocks.push({ id: uid(), ...data });
  }
  save(KEYS.blocks, blocks);
  closeModal();
  renderSchedule();
  renderDashboard();
});

// ---------- TASKS ----------
function saveTasks() { save(KEYS.tasks, tasks); renderTasks(); renderDashboard(); }

function renderTasks() {
  const list = document.getElementById('task-list');
  const empty = document.getElementById('tasks-empty');
  if (!list) return;
  let filtered = tasks;
  if (taskFilter === 'pending') filtered = tasks.filter(t => !t.done);
  if (taskFilter === 'done') filtered = tasks.filter(t => t.done);
  if (taskFilter === 'priority') filtered = tasks.filter(t => t.priority && !t.done);
  filtered = [...filtered].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.priority !== b.priority) return b.priority ? 1 : -1;
    return (b.created || 0) - (a.created || 0);
  });

  list.innerHTML = filtered.map(t => `
    <div class="task-item ${t.done ? 'done' : ''} ${t.priority ? 'priority' : ''}" data-id="${t.id}">
      <div class="task-check ${t.done ? 'checked' : ''}" data-action="toggle"></div>
      <div class="task-body">
        <div class="task-title">${escapeHtml(t.title)}</div>
        <div class="task-meta">
          <span class="tag tag-${t.category || 'other'}">${t.category || 'other'}</span>
          ${t.priority ? '<span class="tag tag-other">Prioritas</span>' : ''}
        </div>
        ${t.notes ? `<div class="task-notes">${escapeHtml(t.notes)}</div>` : ''}
      </div>
      <div class="task-actions">
        <button class="btn-icon" data-action="edit">✎</button>
        <button class="btn-icon" data-action="delete">✕</button>
      </div>
    </div>`).join('');

  if (empty) empty.hidden = filtered.length > 0;
  list.querySelectorAll('.task-item').forEach(item => {
    item.addEventListener('click', e => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      const id = item.dataset.id;
      if (action === 'toggle') toggleTask(id);
      if (action === 'edit') openTaskModal(id);
      if (action === 'delete') { if (confirm('Hapus?')) { tasks = tasks.filter(t => t.id !== id); saveTasks(); } }
    });
  });
}

function toggleTask(id) {
  const t = tasks.find(x => x.id === id);
  if (t) {
    t.done = !t.done;
    t.doneAt = t.done ? Date.now() : null;
    saveTasks();
  }
}

function openTaskModal(id = null) {
  const form = document.getElementById('form-task');
  form.reset();
  document.getElementById('task-id').value = id || '';
  document.getElementById('modal-task-title').textContent = id ? 'Edit Task' : 'Tambah Task';
  if (id) {
    const t = tasks.find(x => x.id === id);
    if (t) {
      document.getElementById('task-title').value = t.title;
      document.getElementById('task-category').value = t.category || 'focus';
      document.getElementById('task-priority').value = t.priority ? '1' : '0';
      document.getElementById('task-notes').value = t.notes || '';
    }
  }
  openModal('modal-task');
}

document.getElementById('btn-add-task')?.addEventListener('click', () => openTaskModal());
document.getElementById('btn-quick-task')?.addEventListener('click', () => openTaskModal());
document.getElementById('qa-add-task')?.addEventListener('click', () => openTaskModal());

document.getElementById('form-task')?.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('task-id').value;
  const data = {
    title: document.getElementById('task-title').value.trim(),
    category: document.getElementById('task-category').value,
    priority: document.getElementById('task-priority').value === '1',
    notes: document.getElementById('task-notes').value.trim(),
  };
  if (!data.title) return;
  if (id) {
    const t = tasks.find(x => x.id === id);
    if (t) Object.assign(t, data);
  } else {
    tasks.push({ id: uid(), ...data, done: false, created: Date.now() });
  }
  saveTasks();
  closeModal();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    taskFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ---------- TRADING ----------
function saveTrades() { save(KEYS.trades, trades); renderTrades(); renderDashboard(); }

function renderTrades() {
  const tbody = document.getElementById('trade-tbody');
  const empty = document.getElementById('trades-empty');
  if (!tbody) return;
  const sorted = [...trades].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  tbody.innerHTML = sorted.map(t => `
    <tr data-id="${t.id}">
      <td>${formatDateID(t.date)}</td>
      <td><strong>${escapeHtml(t.pair)}</strong></td>
      <td class="side-${t.side}">${t.side === 'long' ? 'Long' : 'Short'}</td>
      <td>${t.entry || '—'}</td>
      <td>${t.exit || '—'}</td>
      <td class="${t.pnl >= 0 ? 'pnl-positive' : 'pnl-negative'}">${formatRp(t.pnl)}</td>
      <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(t.notes || '—')}</td>
      <td>
        <button class="btn-icon" data-action="edit-trade">✎</button>
        <button class="btn-icon" data-action="del-trade">✕</button>
      </td>
    </tr>`).join('');
  if (empty) empty.hidden = trades.length > 0;

  const total = trades.reduce((s, t) => s + (Number(t.pnl) || 0), 0);
  const wins = trades.filter(t => Number(t.pnl) > 0).length;
  const wr = trades.length ? Math.round((wins / trades.length) * 100) : 0;
  const totalEl = document.getElementById('total-pnl');
  if (totalEl) { totalEl.textContent = formatRp(total); totalEl.className = 'stat-value ' + (total >= 0 ? 'positive' : 'negative'); }
  document.getElementById('win-rate').textContent = wr + '%';
  document.getElementById('trade-count').textContent = trades.length;

  tbody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', e => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      const id = row.dataset.id;
      if (action === 'edit-trade') openTradeModal(id);
      if (action === 'del-trade') {
        if (confirm('Hapus trade?')) { trades = trades.filter(t => t.id !== id); saveTrades(); }
      }
    });
  });
}

function openTradeModal(id = null) {
  const form = document.getElementById('form-trade');
  form.reset();
  document.getElementById('trade-id').value = id || '';
  document.getElementById('trade-date').value = todayStr();
  document.getElementById('modal-trade-title').textContent = id ? 'Edit Trade' : 'Catat Trade';
  if (id) {
    const t = trades.find(x => x.id === id);
    if (t) {
      document.getElementById('trade-date').value = t.date || todayStr();
      document.getElementById('trade-pair').value = t.pair || '';
      document.getElementById('trade-side').value = t.side || 'long';
      document.getElementById('trade-pnl').value = t.pnl ?? '';
      document.getElementById('trade-entry').value = t.entry || '';
      document.getElementById('trade-exit').value = t.exit || '';
      document.getElementById('trade-notes').value = t.notes || '';
    }
  }
  openModal('modal-trade');
}

document.getElementById('btn-add-trade')?.addEventListener('click', () => openTradeModal());
document.getElementById('form-trade')?.addEventListener('submit', e => {
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
  if (id) { const t = trades.find(x => x.id === id); if (t) Object.assign(t, data); }
  else trades.push({ id: uid(), ...data, created: Date.now() });
  saveTrades();
  closeModal();
});

document.getElementById('input-daily-target').value = dailyTarget || '';
document.getElementById('btn-save-target')?.addEventListener('click', () => {
  dailyTarget = Number(document.getElementById('input-daily-target').value) || 0;
  save(KEYS.dailyTarget, dailyTarget);
  alert('Target disimpan: ' + formatRp(dailyTarget));
});

// ---------- GOALS ----------
function saveGoals() { save(KEYS.goals, goals); renderGoals(); }

function renderGoals() {
  const grid = document.getElementById('goals-grid');
  const empty = document.getElementById('goals-empty');
  if (!grid) return;
  grid.innerHTML = goals.map(g => `
    <div class="goal-card" data-id="${g.id}">
      <div class="goal-card-header">
        <h3>${escapeHtml(g.title)}</h3>
        <div class="task-actions">
          <button class="btn-icon" data-action="edit-goal">✎</button>
          <button class="btn-icon" data-action="del-goal">✕</button>
        </div>
      </div>
      ${g.desc ? `<p class="goal-desc">${escapeHtml(g.desc)}</p>` : ''}
      <div class="goal-progress-bar"><div class="goal-progress-fill" style="width:${g.progress || 0}%"></div></div>
      <div class="goal-meta">
        <span class="tag tag-${g.category || 'other'}">${g.category || 'other'}</span>
        <span>${g.progress || 0}%${g.year ? ' · ' + g.year : ''}</span>
      </div>
    </div>`).join('');
  if (empty) empty.hidden = goals.length > 0;
  grid.querySelectorAll('.goal-card').forEach(card => {
    card.addEventListener('click', e => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      const id = card.dataset.id;
      if (action === 'edit-goal') openGoalModal(id);
      if (action === 'del-goal') {
        if (confirm('Hapus?')) { goals = goals.filter(g => g.id !== id); saveGoals(); }
      }
    });
  });
}

function openGoalModal(id = null) {
  const form = document.getElementById('form-goal');
  form.reset();
  document.getElementById('goal-id').value = id || '';
  document.getElementById('goal-progress').value = 0;
  document.getElementById('modal-goal-title').textContent = id ? 'Edit Impian' : 'Tambah Impian';
  if (id) {
    const g = goals.find(x => x.id === id);
    if (g) {
      document.getElementById('goal-title').value = g.title;
      document.getElementById('goal-desc').value = g.desc || '';
      document.getElementById('goal-year').value = g.year || '';
      document.getElementById('goal-progress').value = g.progress || 0;
      document.getElementById('goal-category').value = g.category || 'finance';
    }
  }
  openModal('modal-goal');
}

document.getElementById('btn-add-goal')?.addEventListener('click', () => openGoalModal());
document.getElementById('form-goal')?.addEventListener('submit', e => {
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
  if (id) { const g = goals.find(x => x.id === id); if (g) Object.assign(g, data); }
  else goals.push({ id: uid(), ...data, created: Date.now() });
  saveGoals();
  closeModal();
});

// ---------- TIMER ----------
let timerInterval = null;
let timerRemaining = 25 * 60;
let timerTotal = 25 * 60;
let timerRunning = false;
let timerMode = 'Focus';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function updateTimerUI() {
  document.getElementById('timer-time').textContent = formatTime(timerRemaining);
  document.getElementById('timer-mode').textContent = timerMode;
}

function renderTimerStats() {
  const today = todayStr();
  const s = pomoStats[today] || { count: 0, minutes: 0 };
  document.getElementById('pomo-count').textContent = s.count;
  document.getElementById('focus-minutes').textContent = s.minutes;
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  document.getElementById('timer-start').hidden = true;
  document.getElementById('timer-pause').hidden = false;
  document.getElementById('timer-status').textContent = 'Sedang fokus...';
  timerInterval = setInterval(() => {
    timerRemaining--;
    updateTimerUI();
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      document.getElementById('timer-start').hidden = false;
      document.getElementById('timer-pause').hidden = true;
      document.getElementById('timer-status').textContent = 'Selesai! 🔥';
      // Record
      if (timerMode === 'Focus' || timerMode === 'Deep Work') {
        const today = todayStr();
        if (!pomoStats[today]) pomoStats[today] = { count: 0, minutes: 0 };
        pomoStats[today].count++;
        pomoStats[today].minutes += Math.round(timerTotal / 60);
        save(KEYS.pomoStats, pomoStats);
        renderTimerStats();
        renderDashboard();
      }
      try { new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp6KhX1mY3qRmJmMhH1oZnmTmpqOg3xtaneUnJyQhH5wbHqVnJ2Rh4B0b3yXnZ6SiIJ3coCZoJ+UioR6dYKaoqGWjId9eIWdpKOYj4mA').play(); } catch {}
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  document.getElementById('timer-start').hidden = false;
  document.getElementById('timer-pause').hidden = true;
  document.getElementById('timer-status').textContent = 'Paused';
}

function resetTimer() {
  pauseTimer();
  timerRemaining = timerTotal;
  updateTimerUI();
  document.getElementById('timer-status').textContent = 'Siap dimulai';
}

document.getElementById('timer-start')?.addEventListener('click', startTimer);
document.getElementById('timer-pause')?.addEventListener('click', pauseTimer);
document.getElementById('timer-reset')?.addEventListener('click', resetTimer);

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    pauseTimer();
    timerMode = btn.dataset.mode;
    timerTotal = Number(btn.dataset.min) * 60;
    timerRemaining = timerTotal;
    updateTimerUI();
    document.getElementById('timer-status').textContent = 'Siap dimulai';
  });
});

// ---------- MODAL ----------
function openModal(id) {
  document.getElementById('modal-overlay').hidden = false;
  document.querySelectorAll('.modal').forEach(m => m.hidden = true);
  document.getElementById(id).hidden = false;
}
function closeModal() {
  document.getElementById('modal-overlay').hidden = true;
  document.querySelectorAll('.modal').forEach(m => m.hidden = true);
}
document.getElementById('modal-overlay')?.addEventListener('click', e => {
  if (e.target.id === 'modal-overlay' || e.target.hasAttribute('data-close')) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 20000);
  // Seed default blocks if empty
  if (blocks.length === 0) {
    const t = todayStr();
    blocks = [
      { id: uid(), title: 'Morning Routine', date: t, type: 'routine', start: '05:30', end: '06:30', recur: 'daily' },
      { id: uid(), title: 'Deep Work 1', date: t, type: 'focus', start: '06:30', end: '09:00', recur: 'weekdays' },
      { id: uid(), title: 'Deep Work 2', date: t, type: 'focus', start: '09:30', end: '12:00', recur: 'weekdays' },
      { id: uid(), title: 'Training', date: t, type: 'workout', start: '12:00', end: '13:00', recur: 'none' },
      { id: uid(), title: 'Deep Work 3', date: t, type: 'focus', start: '14:00', end: '16:30', recur: 'weekdays' },
      { id: uid(), title: 'Evening Review', date: t, type: 'routine', start: '21:00', end: '21:30', recur: 'daily' },
    ];
    save(KEYS.blocks, blocks);
  }
  renderDashboard();
  updateTimerUI();
});