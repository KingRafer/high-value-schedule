/* HVOS Modules 2: Career, Intellectual, Mental */
(function () {
  const K = {
    careerGoals: 'hvos_career_goals',
    projects: 'hvos_projects',
    skills: 'hvos_skills',
    network: 'hvos_network',
    meetings: 'hvos_meetings',
    ideas: 'hvos_ideas',
    revenue: 'hvos_revenue',
    milestones: 'hvos_milestones',
    workPriorities: 'hvos_work_priorities',
    books: 'hvos_books',
    bookNotes: 'hvos_book_notes',
    courses: 'hvos_courses',
    learnGoals: 'hvos_learn_goals',
    knowledge: 'hvos_knowledge',
    thinkJournal: 'hvos_think_journal',
    journals: 'hvos_journals',
    gratitude: 'hvos_gratitude',
    meditation: 'hvos_meditation',
    wellness: 'hvos_wellness',
    boundaries: 'hvos_boundaries',
    weeklyEval: 'hvos_weekly_eval',
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
  function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }

  let careerGoals = load(K.careerGoals, []);
  let projects = load(K.projects, []);
  let skills = load(K.skills, []);
  let network = load(K.network, []);
  let meetings = load(K.meetings, []);
  let ideas = load(K.ideas, []);
  let revenue = load(K.revenue, []);
  let milestones = load(K.milestones, []);
  let workPriorities = load(K.workPriorities, []);

  let books = load(K.books, []);
  let bookNotes = load(K.bookNotes, []);
  let courses = load(K.courses, []);
  let learnGoals = load(K.learnGoals, []);
  let knowledge = load(K.knowledge, []);
  let thinkJournal = load(K.thinkJournal, []);

  let journals = load(K.journals, []);
  let gratitude = load(K.gratitude, []);
  let meditation = load(K.meditation, []);
  let wellness = load(K.wellness, []);
  let boundaries = load(K.boundaries, []);
  let weeklyEval = load(K.weeklyEval, []);

  function extendModules() {
    window.HVOSModules = window.HVOSModules || {};
    Object.assign(window.HVOSModules, {
      renderCareer,
      renderIntellect,
      renderMental,
    });
  }
  extendModules();

  // ========== CAREER ==========
  function renderCareer() {
    const month = todayStr().slice(0, 7);
    const monthRev = revenue.filter(r => (r.date || '').startsWith(month)).reduce((s, r) => s + (Number(r.amount) || 0), 0);
    setText('career-revenue', formatRp(monthRev));
    setText('career-projects', projects.filter(p => p.status !== 'done').length);
    setText('career-skills', skills.length);
    setText('career-network', network.length);

    renderList('career-goals-list', careerGoals, g =>
      `<div class="data-row" data-id="${g.id}"><div class="data-main" style="flex:1"><strong>${esc(g.title)}</strong>
        <div class="hint">${esc(g.notes || '')}</div>
        <div class="goal-progress-bar" style="margin-top:0.3rem"><div class="goal-progress-fill" style="width:${g.progress || 0}%"></div></div></div>
        <span class="hint">${g.progress || 0}%</span>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { careerGoals = careerGoals.filter(x => x.id !== id); save(K.careerGoals, careerGoals); renderCareer(); },
      'Belum ada professional goals.'
    );

    renderList('project-list', projects, p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><span class="tag tag-${p.status === 'done' ? 'health' : 'focus'}">${esc(p.status || 'active')}</span>
        <strong>${esc(p.name)}</strong><div class="hint">${esc(p.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { projects = projects.filter(x => x.id !== id); save(K.projects, projects); renderCareer(); },
      'Belum ada project.'
    );

    renderList('skill-list', skills, s =>
      `<div class="data-row" data-id="${s.id}"><div class="data-main"><strong>${esc(s.name)}</strong>
        <div class="hint">Level: ${esc(s.level || 'beginner')} · ${esc(s.notes || '')}</div>
        <div class="goal-progress-bar" style="margin-top:0.3rem"><div class="goal-progress-fill" style="width:${s.progress || 0}%"></div></div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { skills = skills.filter(x => x.id !== id); save(K.skills, skills); renderCareer(); },
      'Belum ada skill tracker.'
    );

    renderList('network-list', network, n =>
      `<div class="data-row" data-id="${n.id}"><div class="data-main"><strong>${esc(n.name)}</strong>
        <div class="hint">${esc(n.role || '')} · last contact ${formatDateID(n.lastContact)}</div></div>
        <button class="btn btn-sm btn-outline" data-act="touch">Contacted</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { network = network.filter(x => x.id !== id); save(K.network, network); renderCareer(); },
      'Belum ada networking contacts.',
      (id, act) => {
        if (act === 'touch') {
          const n = network.find(x => x.id === id);
          if (n) { n.lastContact = todayStr(); save(K.network, network); renderCareer(); }
        }
      }
    );

    renderList('meeting-list', meetings, m =>
      `<div class="data-row" data-id="${m.id}"><div class="data-main"><strong>${esc(m.title)}</strong>
        <div class="hint">${formatDateID(m.date)} ${m.time || ''} · ${esc(m.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { meetings = meetings.filter(x => x.id !== id); save(K.meetings, meetings); renderCareer(); },
      'Belum ada meeting.'
    );

    renderList('idea-list', ideas, i =>
      `<div class="data-row" data-id="${i.id}"><div class="data-main"><strong>${esc(i.title)}</strong>
        <div class="hint">${esc(i.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { ideas = ideas.filter(x => x.id !== id); save(K.ideas, ideas); renderCareer(); },
      'Business idea library kosong.'
    );

    renderList('revenue-list', [...revenue].reverse().slice(0, 15), r =>
      `<div class="data-row" data-id="${r.id}"><div class="data-main"><strong>${formatRp(r.amount)}</strong>
        <div class="hint">${formatDateID(r.date)} · ${esc(r.source || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { revenue = revenue.filter(x => x.id !== id); save(K.revenue, revenue); renderCareer(); },
      'Belum ada revenue entry.'
    );

    renderList('milestone-list', milestones, m =>
      `<div class="data-row" data-id="${m.id}"><div class="data-main"><strong>${esc(m.title)}</strong>
        <div class="hint">${m.done ? '✓ Done' : 'In progress'} · ${formatDateID(m.date)}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${m.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { milestones = milestones.filter(x => x.id !== id); save(K.milestones, milestones); renderCareer(); },
      'Belum ada career milestone.',
      (id, act) => {
        if (act === 'toggle') {
          const m = milestones.find(x => x.id === id);
          if (m) { m.done = !m.done; save(K.milestones, milestones); renderCareer(); }
        }
      }
    );

    renderList('work-priority-list', workPriorities, p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${esc(p.title)}</strong>
        <div class="hint">${p.done ? '✓' : 'Pending'} · ${formatDateID(p.date)}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${p.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { workPriorities = workPriorities.filter(x => x.id !== id); save(K.workPriorities, workPriorities); renderCareer(); },
      'Set daily work priorities.',
      (id, act) => {
        if (act === 'toggle') {
          const p = workPriorities.find(x => x.id === id);
          if (p) { p.done = !p.done; save(K.workPriorities, workPriorities); renderCareer(); }
        }
      }
    );
  }

  // ========== INTELLECT ==========
  function renderIntellect() {
    const reading = books.filter(b => b.status === 'reading').length;
    const finished = books.filter(b => b.status === 'done').length;
    const pages = books.reduce((s, b) => s + (Number(b.pagesRead) || 0), 0);
    setText('intel-reading', reading);
    setText('intel-finished', finished);
    setText('intel-pages', pages);
    setText('intel-courses', courses.filter(c => c.status !== 'done').length);

    renderList('book-list', books, b =>
      `<div class="data-row" data-id="${b.id}"><div class="data-main"><span class="tag tag-mind">${esc(b.status || 'to-read')}</span>
        <strong>${esc(b.title)}</strong><div class="hint">${esc(b.author || '')} · ${b.pagesRead || 0}/${b.pages || '?'} pages</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { books = books.filter(x => x.id !== id); save(K.books, books); renderIntellect(); },
      'Belum ada buku di library.'
    );

    renderList('book-notes-list', [...bookNotes].reverse().slice(0, 20), n =>
      `<div class="data-row" data-id="${n.id}"><div class="data-main"><strong>${esc(n.book || 'Note')}</strong>
        <div class="hint">${esc(n.note)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { bookNotes = bookNotes.filter(x => x.id !== id); save(K.bookNotes, bookNotes); renderIntellect(); },
      'Belum ada book notes.'
    );

    renderList('course-list', courses, c =>
      `<div class="data-row" data-id="${c.id}"><div class="data-main"><strong>${esc(c.title)}</strong>
        <div class="hint">${esc(c.platform || '')} · ${c.progress || 0}%</div>
        <div class="goal-progress-bar" style="margin-top:0.3rem"><div class="goal-progress-fill" style="width:${c.progress || 0}%"></div></div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { courses = courses.filter(x => x.id !== id); save(K.courses, courses); renderIntellect(); },
      'Belum ada course.'
    );

    renderList('learn-goal-list', learnGoals, g =>
      `<div class="data-row" data-id="${g.id}"><div class="data-main"><strong>${esc(g.title)}</strong>
        <div class="hint">${formatDateID(g.date)} · ${g.done ? '✓' : 'Open'}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${g.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { learnGoals = learnGoals.filter(x => x.id !== id); save(K.learnGoals, learnGoals); renderIntellect(); },
      'Set daily learning goals.',
      (id, act) => {
        if (act === 'toggle') {
          const g = learnGoals.find(x => x.id === id);
          if (g) { g.done = !g.done; save(K.learnGoals, learnGoals); renderIntellect(); }
        }
      }
    );

    renderList('knowledge-list', knowledge, k =>
      `<div class="data-row" data-id="${k.id}"><div class="data-main"><span class="tag tag-focus">${esc(k.topic || 'note')}</span>
        <strong>${esc(k.title)}</strong><div class="hint">${esc(k.body || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { knowledge = knowledge.filter(x => x.id !== id); save(K.knowledge, knowledge); renderIntellect(); },
      'Personal knowledge base kosong.'
    );

    renderList('think-journal-list', [...thinkJournal].reverse().slice(0, 15), j =>
      `<div class="data-row" data-id="${j.id}"><div class="data-main"><strong>${formatDateID(j.date)}</strong>
        <div class="hint">${esc(j.entry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { thinkJournal = thinkJournal.filter(x => x.id !== id); save(K.thinkJournal, thinkJournal); renderIntellect(); },
      'Critical thinking journal kosong.'
    );
  }

  // ========== MENTAL ==========
  function renderMental() {
    const today = todayStr();
    const medToday = meditation.filter(m => m.date === today).reduce((s, m) => s + (Number(m.minutes) || 0), 0);
    const gratToday = gratitude.filter(g => g.date === today).length;
    const journalToday = journals.filter(j => j.date === today).length;
    setText('mental-meditate', medToday + ' min');
    setText('mental-gratitude', gratToday);
    setText('mental-journals', journalToday);
    setText('mental-streak', calcMedStreak() + '🔥');

    renderList('journal-list', [...journals].reverse().slice(0, 15), j =>
      `<div class="data-row" data-id="${j.id}"><div class="data-main"><strong>${formatDateID(j.date)}</strong> <span class="tag tag-mind">${esc(j.type || 'journal')}</span>
        <div class="hint">${esc(j.entry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { journals = journals.filter(x => x.id !== id); save(K.journals, journals); renderMental(); },
      'Belum ada journal entry.'
    );

    renderList('gratitude-list', [...gratitude].reverse().slice(0, 15), g =>
      `<div class="data-row" data-id="${g.id}"><div class="data-main"><strong>${formatDateID(g.date)}</strong>
        <div class="hint">${esc(g.text)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { gratitude = gratitude.filter(x => x.id !== id); save(K.gratitude, gratitude); renderMental(); },
      'Tulis 3 hal yang kamu syukuri hari ini.'
    );

    renderList('meditation-list', [...meditation].reverse().slice(0, 10), m =>
      `<div class="data-row" data-id="${m.id}"><div class="data-main"><strong>${m.minutes} min</strong>
        <div class="hint">${formatDateID(m.date)} · ${esc(m.type || 'meditation')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { meditation = meditation.filter(x => x.id !== id); save(K.meditation, meditation); renderMental(); },
      'Belum ada sesi meditasi / breathing.'
    );

    renderList('wellness-list', [...wellness].reverse().slice(0, 10), w =>
      `<div class="data-row" data-id="${w.id}"><div class="data-main"><strong>${formatDateID(w.date)}</strong>
        <div class="hint">Mood ${w.mood || '—'}/5 · Stress ${w.stress || '—'}/5 · ${esc(w.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { wellness = wellness.filter(x => x.id !== id); save(K.wellness, wellness); renderMental(); },
      'Belum ada mental wellness check-in.'
    );

    renderList('boundary-list', boundaries, b =>
      `<div class="data-row" data-id="${b.id}"><div class="data-main"><strong>${esc(b.title)}</strong>
        <div class="hint">${esc(b.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { boundaries = boundaries.filter(x => x.id !== id); save(K.boundaries, boundaries); renderMental(); },
      'Definisikan personal boundaries.'
    );

    renderList('weekly-eval-list', [...weeklyEval].reverse().slice(0, 8), e =>
      `<div class="data-row" data-id="${e.id}"><div class="data-main"><strong>Week of ${formatDateID(e.date)}</strong>
        <div class="hint">${esc(e.entry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { weeklyEval = weeklyEval.filter(x => x.id !== id); save(K.weeklyEval, weeklyEval); renderMental(); },
      'Belum ada weekly self-evaluation.'
    );
  }

  function calcMedStreak() {
    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      if (meditation.some(m => m.date === key)) streak++;
      else if (i > 0) break;
      else break;
    }
    if (!meditation.some(m => m.date === todayStr())) {
      streak = 0;
      for (let i = 1; i < 60; i++) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        if (meditation.some(m => m.date === key)) streak++;
        else break;
      }
    }
    return streak;
  }

  function renderList(elId, items, rowFn, onDel, emptyMsg, onExtra) {
    const el = document.getElementById(elId);
    if (!el) return;
    if (!items.length) {
      el.innerHTML = `<p class="empty-hint">${emptyMsg || 'Kosong.'}</p>`;
      return;
    }
    el.innerHTML = items.map(rowFn).join('');
    el.querySelectorAll('.data-row').forEach(row => {
      row.addEventListener('click', e => {
        const act = e.target.closest('[data-act]')?.dataset.act;
        const id = row.dataset.id;
        if (!act) return;
        if (act === 'del') {
          if (confirm('Hapus?')) onDel(id);
        } else if (onExtra) onExtra(id, act);
      });
    });
  }

  // ---------- Button wiring ----------
  document.addEventListener('DOMContentLoaded', wireButtons);
  // Also wire after delayed boot
  setTimeout(wireButtons, 1500);
  setTimeout(wireButtons, 3000);

  let wired = false;
  function wireButtons() {
    if (wired && document.getElementById('btn-add-career-goal')) return;
    // Career
    bind('btn-add-career-goal', () => {
      const title = prompt('Professional goal:');
      if (!title) return;
      const progress = Number(prompt('Progress %:', '0')) || 0;
      careerGoals.push({ id: uid(), title, progress, notes: '' });
      save(K.careerGoals, careerGoals); renderCareer();
    });
    bind('btn-add-project', () => {
      const name = prompt('Project name:');
      if (!name) return;
      projects.push({ id: uid(), name, status: 'active', notes: prompt('Notes:') || '' });
      save(K.projects, projects); renderCareer();
    });
    bind('btn-add-skill', () => {
      const name = prompt('Skill name:');
      if (!name) return;
      const level = prompt('Level (beginner/intermediate/advanced):', 'beginner') || 'beginner';
      const progress = Number(prompt('Progress %:', '0')) || 0;
      skills.push({ id: uid(), name, level, progress, notes: '' });
      save(K.skills, skills); renderCareer();
    });
    bind('btn-add-network', () => {
      const name = prompt('Contact name:');
      if (!name) return;
      network.push({ id: uid(), name, role: prompt('Role / company:') || '', lastContact: todayStr() });
      save(K.network, network); renderCareer();
    });
    bind('btn-add-meeting', () => {
      const title = prompt('Meeting title:');
      if (!title) return;
      meetings.push({ id: uid(), title, date: prompt('Date YYYY-MM-DD:', todayStr()) || todayStr(), time: prompt('Time:') || '', notes: '' });
      save(K.meetings, meetings); renderCareer();
    });
    bind('btn-add-idea', () => {
      const title = prompt('Business idea:');
      if (!title) return;
      ideas.push({ id: uid(), title, notes: prompt('Detail:') || '' });
      save(K.ideas, ideas); renderCareer();
    });
    bind('btn-add-revenue', async () => {
      const values = await window.HVOSDialogs?.form('Tambah Pendapatan', [
        { name: 'amount', label: 'Nominal (Rp)', type: 'number', min: 0, required: true },
        { name: 'source', label: 'Sumber pendapatan', required: true }
      ]);
      if (!values) return;
      const amount = Number(values.amount);
      if (!Number.isFinite(amount) || amount <= 0 || !values.source.trim()) return;
      revenue.push({ id: uid(), amount, date: todayStr(), source: values.source.trim() });
      save(K.revenue, revenue); renderCareer();
    });
    bind('btn-add-milestone', () => {
      const title = prompt('Career milestone:');
      if (!title) return;
      milestones.push({ id: uid(), title, date: todayStr(), done: false });
      save(K.milestones, milestones); renderCareer();
    });
    bind('btn-add-work-prio', async () => {
      const values = await window.HVOSDialogs?.form('Work Priority', [
        { name: 'title', label: 'Prioritas kerja', required: true }
      ]);
      if (!values || !values.title.trim()) return;
      workPriorities.push({ id: uid(), title: values.title.trim(), date: todayStr(), done: false });
      save(K.workPriorities, workPriorities); renderCareer();
    });

    // Intellectual
    bind('btn-add-book', () => {
      const title = prompt('Judul buku:');
      if (!title) return;
      books.push({
        id: uid(), title,
        author: prompt('Author:') || '',
        status: prompt('Status (to-read/reading/done):', 'reading') || 'reading',
        pages: Number(prompt('Total pages:', '0')) || 0,
        pagesRead: Number(prompt('Pages read:', '0')) || 0,
      });
      save(K.books, books); renderIntellect();
    });
    bind('btn-add-book-note', () => {
      const book = prompt('Dari buku:');
      const note = prompt('Note / highlight:');
      if (!note) return;
      bookNotes.push({ id: uid(), book: book || '', note, date: todayStr() });
      save(K.bookNotes, bookNotes); renderIntellect();
    });
    bind('btn-add-course', () => {
      const title = prompt('Course title:');
      if (!title) return;
      courses.push({
        id: uid(), title,
        platform: prompt('Platform (Udemy, YT...):') || '',
        progress: Number(prompt('Progress %:', '0')) || 0,
        status: 'active',
      });
      save(K.courses, courses); renderIntellect();
    });
    bind('btn-add-learn-goal', () => {
      const title = prompt('Learning goal hari ini:');
      if (!title) return;
      learnGoals.push({ id: uid(), title, date: todayStr(), done: false });
      save(K.learnGoals, learnGoals); renderIntellect();
    });
    bind('btn-add-knowledge', () => {
      const title = prompt('Judul knowledge:');
      if (!title) return;
      knowledge.push({ id: uid(), title, topic: prompt('Topic/tag:') || 'note', body: prompt('Isi:') || '' });
      save(K.knowledge, knowledge); renderIntellect();
    });
    bind('btn-add-think', () => {
      const entry = prompt('Critical thinking entry:');
      if (!entry) return;
      thinkJournal.push({ id: uid(), date: todayStr(), entry });
      save(K.thinkJournal, thinkJournal); renderIntellect();
    });

    // Mental
    bind('btn-add-journal', () => {
      const entry = prompt('Journal entry:');
      if (!entry) return;
      const type = prompt('Type (journal/reflection/emotion):', 'journal') || 'journal';
      journals.push({ id: uid(), date: todayStr(), entry, type });
      save(K.journals, journals); renderMental();
    });
    bind('btn-add-gratitude', () => {
      const text = prompt('Saya bersyukur untuk:');
      if (!text) return;
      gratitude.push({ id: uid(), date: todayStr(), text });
      save(K.gratitude, gratitude); renderMental();
    });
    bind('btn-add-meditation', () => {
      const minutes = Number(prompt('Menit meditasi / breathing:', '10')) || 10;
      const type = prompt('Type (meditation/breathing):', 'meditation') || 'meditation';
      meditation.push({ id: uid(), date: todayStr(), minutes, type });
      save(K.meditation, meditation); renderMental();
    });
    bind('btn-add-wellness', () => {
      const mood = Number(prompt('Mood 1-5:', '3')) || 3;
      const stress = Number(prompt('Stress 1-5:', '3')) || 3;
      const notes = prompt('Notes:') || '';
      wellness.push({ id: uid(), date: todayStr(), mood, stress, notes });
      save(K.wellness, wellness); renderMental();
    });
    bind('btn-add-boundary', () => {
      const title = prompt('Boundary (mis. No work after 9pm):');
      if (!title) return;
      boundaries.push({ id: uid(), title, notes: prompt('Detail:') || '' });
      save(K.boundaries, boundaries); renderMental();
    });
    bind('btn-add-weekly-eval', () => {
      const entry = prompt('Weekly self-evaluation:');
      if (!entry) return;
      weeklyEval.push({ id: uid(), date: todayStr(), entry });
      save(K.weeklyEval, weeklyEval); renderMental();
    });

    wired = true;
  }

  function bind(id, fn) {
    const el = document.getElementById(id);
    if (el && !el.dataset.bound) {
      el.addEventListener('click', fn);
      el.dataset.bound = '1';
    }
  }
})();
