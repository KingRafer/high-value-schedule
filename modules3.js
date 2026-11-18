/* HVOS Modules 3: Social, Leadership, Spiritual */
(function () {
  const K = {
    socialSkills: 'hvos_social_skills',
    socialConfidence: 'hvos_social_confidence',
    relationships: 'hvos_relationships',
    family: 'hvos_family',
    friends: 'hvos_friends',
    socialEvents: 'hvos_social_events',
    speaking: 'hvos_speaking',
    negotiation: 'hvos_negotiation',
    conflicts: 'hvos_conflicts',
    eqLog: 'hvos_eq_log',
    mentors: 'hvos_mentors',
    leadershipDev: 'hvos_leadership_dev',
    integrity: 'hvos_integrity',
    accountability: 'hvos_accountability',
    decisions: 'hvos_decisions',
    responsibilities: 'hvos_responsibilities',
    problemSolving: 'hvos_problem_solving',
    strategyNotes: 'hvos_strategy_notes',
    leadershipPrinciples: 'hvos_leadership_principles',
    codeOfConduct: 'hvos_code_of_conduct',
    characterEval: 'hvos_character_eval',
    courage: 'hvos_courage',
    leadMilestones: 'hvos_lead_milestones',
    purposeJournal: 'hvos_purpose_journal',
    values: 'hvos_values',
    spiritualRoutine: 'hvos_spiritual_routine',
    prayerLog: 'hvos_prayer_log',
    mindfulness: 'hvos_mindfulness',
    philosophy: 'hvos_philosophy',
    moralNotes: 'hvos_moral_notes',
    innerPeace: 'hvos_inner_peace',
    mission: 'hvos_mission',
    faith: 'hvos_faith',
    legacy: 'hvos_legacy',
  };

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function load(k, fb) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } }
  function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  function todayStr() { return new Date().toISOString().slice(0, 10); }
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function formatDateID(s) {
    if (!s) return '—';
    return new Date(s + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }

  let socialSkills = load(K.socialSkills, []);
  let socialConfidence = load(K.socialConfidence, []);
  let relationships = load(K.relationships, []);
  let family = load(K.family, []);
  let friends = load(K.friends, []);
  let socialEvents = load(K.socialEvents, []);
  let speaking = load(K.speaking, []);
  let negotiation = load(K.negotiation, []);
  let conflicts = load(K.conflicts, []);
  let eqLog = load(K.eqLog, []);
  let mentors = load(K.mentors, []);

  let leadershipDev = load(K.leadershipDev, []);
  let integrity = load(K.integrity, []);
  let accountability = load(K.accountability, []);
  let decisions = load(K.decisions, []);
  let responsibilities = load(K.responsibilities, []);
  let problemSolving = load(K.problemSolving, []);
  let strategyNotes = load(K.strategyNotes, []);
  let leadershipPrinciples = load(K.leadershipPrinciples, [
    'Lead by example',
    'Take ownership',
    'Serve first',
    'Communicate clearly',
    'Stay calm under pressure',
  ]);
  let codeOfConduct = load(K.codeOfConduct, [
    'Keep promises',
    'Tell the truth',
    'Respect time — yours and others',
    'No gossip',
    'Finish what you start',
  ]);
  let characterEval = load(K.characterEval, []);
  let courage = load(K.courage, []);
  let leadMilestones = load(K.leadMilestones, []);

  let purposeJournal = load(K.purposeJournal, []);
  let values = load(K.values, []);
  let spiritualRoutine = load(K.spiritualRoutine, ['Doa pagi', 'Baca kitab / renungan', 'Syukur malam']);
  let spiritualChecks = load('hvos_spiritual_checks', {});
  let prayerLog = load(K.prayerLog, []);
  let mindfulness = load(K.mindfulness, []);
  let philosophy = load(K.philosophy, []);
  let moralNotes = load(K.moralNotes, []);
  let innerPeace = load(K.innerPeace, []);
  let mission = load(K.mission, { text: '' });
  let faith = load(K.faith, []);
  let legacy = load(K.legacy, []);

  window.HVOSModules = window.HVOSModules || {};
  Object.assign(window.HVOSModules, {
    renderSocial,
    renderLeadership,
    renderSpiritual,
  });

  function renderList(elId, items, rowFn, onDel, emptyMsg, onExtra) {
    const el = document.getElementById(elId);
    if (!el) return;
    if (!items.length) {
      el.innerHTML = '<p class="empty-hint">' + (emptyMsg || 'Kosong.') + '</p>';
      return;
    }
    el.innerHTML = items.map(rowFn).join('');
    el.querySelectorAll('.data-row').forEach(row => {
      row.addEventListener('click', e => {
        const act = e.target.closest('[data-act]')?.dataset.act;
        const id = row.dataset.id;
        if (!act) return;
        if (act === 'del') { if (confirm('Hapus?')) onDel(id); }
        else if (onExtra) onExtra(id, act);
      });
    });
  }

  // ========== SOCIAL ==========
  function renderSocial() {
    setText('social-rel', relationships.length);
    setText('social-friends', friends.length);
    setText('social-events', socialEvents.filter(e => (e.date || '') >= todayStr()).length);
    setText('social-mentors', mentors.length);

    renderList('social-skills-list', socialSkills, s =>
      `<div class="data-row" data-id="${s.id}"><div class="data-main"><strong>${esc(s.title)}</strong>
        <div class="hint">${esc(s.notes || '')} · practice ${s.practices || 0}x</div></div>
        <button class="btn btn-sm btn-outline" data-act="practice">+Practice</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { socialSkills = socialSkills.filter(x => x.id !== id); save(K.socialSkills, socialSkills); renderSocial(); },
      'Tambah communication / social skills untuk dilatih.',
      (id, act) => {
        if (act === 'practice') {
          const s = socialSkills.find(x => x.id === id);
          if (s) { s.practices = (s.practices || 0) + 1; save(K.socialSkills, socialSkills); renderSocial(); }
        }
      }
    );

    renderList('social-confidence-list', [...socialConfidence].reverse().slice(0, 12), c =>
      `<div class="data-row" data-id="${c.id}"><div class="data-main"><strong>${formatDateID(c.date)}</strong>
        <div class="hint">Confidence ${c.score}/5 · ${esc(c.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { socialConfidence = socialConfidence.filter(x => x.id !== id); save(K.socialConfidence, socialConfidence); renderSocial(); },
      'Log social confidence setelah interaksi penting.'
    );

    renderList('relationship-list', relationships, r =>
      `<div class="data-row" data-id="${r.id}"><div class="data-main"><strong>${esc(r.name)}</strong>
        <div class="hint">${esc(r.type || 'relationship')} · last ${formatDateID(r.lastContact)}</div></div>
        <button class="btn btn-sm btn-outline" data-act="touch">Contacted</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { relationships = relationships.filter(x => x.id !== id); save(K.relationships, relationships); renderSocial(); },
      'Kelola hubungan penting (pasangan, mentor, partner).',
      (id, act) => {
        if (act === 'touch') {
          const r = relationships.find(x => x.id === id);
          if (r) { r.lastContact = todayStr(); save(K.relationships, relationships); renderSocial(); }
        }
      }
    );

    renderList('family-list', family, f =>
      `<div class="data-row" data-id="${f.id}"><div class="data-main"><strong>${esc(f.name)}</strong>
        <div class="hint">${esc(f.relation || '')} · ${esc(f.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { family = family.filter(x => x.id !== id); save(K.family, family); renderSocial(); },
      'Family relationship tracker.'
    );

    renderList('friend-list', friends, f =>
      `<div class="data-row" data-id="${f.id}"><div class="data-main"><strong>${esc(f.name)}</strong>
        <div class="hint">last ${formatDateID(f.lastContact)} · ${esc(f.notes || '')}</div></div>
        <button class="btn btn-sm btn-outline" data-act="touch">Hang out</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { friends = friends.filter(x => x.id !== id); save(K.friends, friends); renderSocial(); },
      'Friendship management.',
      (id, act) => {
        if (act === 'touch') {
          const f = friends.find(x => x.id === id);
          if (f) { f.lastContact = todayStr(); save(K.friends, friends); renderSocial(); }
        }
      }
    );

    renderList('social-event-list', [...socialEvents].sort((a, b) => (a.date || '').localeCompare(b.date || '')).slice(0, 15), e =>
      `<div class="data-row" data-id="${e.id}"><div class="data-main"><strong>${esc(e.title)}</strong>
        <div class="hint">${formatDateID(e.date)} · ${esc(e.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { socialEvents = socialEvents.filter(x => x.id !== id); save(K.socialEvents, socialEvents); renderSocial(); },
      'Social calendar kosong.'
    );

    renderList('speaking-list', [...speaking].reverse().slice(0, 10), s =>
      `<div class="data-row" data-id="${s.id}"><div class="data-main"><strong>${esc(s.title)}</strong>
        <div class="hint">${formatDateID(s.date)} · rating ${s.rating || '—'}/5 · ${esc(s.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { speaking = speaking.filter(x => x.id !== id); save(K.speaking, speaking); renderSocial(); },
      'Public speaking practice log.'
    );

    renderList('negotiation-list', [...negotiation].reverse().slice(0, 10), n =>
      `<div class="data-row" data-id="${n.id}"><div class="data-main"><strong>${esc(n.title)}</strong>
        <div class="hint">${formatDateID(n.date)} · ${esc(n.outcome || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { negotiation = negotiation.filter(x => x.id !== id); save(K.negotiation, negotiation); renderSocial(); },
      'Negotiation practice / debrief.'
    );

    renderList('conflict-list', [...conflicts].reverse().slice(0, 10), c =>
      `<div class="data-row" data-id="${c.id}"><div class="data-main"><strong>${esc(c.title)}</strong>
        <div class="hint">${formatDateID(c.date)} · resolved: ${c.resolved ? 'yes' : 'no'} · ${esc(c.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { conflicts = conflicts.filter(x => x.id !== id); save(K.conflicts, conflicts); renderSocial(); },
      'Conflict resolution journal.'
    );

    renderList('eq-list', [...eqLog].reverse().slice(0, 10), e =>
      `<div class="data-row" data-id="${e.id}"><div class="data-main"><strong>${formatDateID(e.date)}</strong>
        <div class="hint">EQ ${e.score}/5 · ${esc(e.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { eqLog = eqLog.filter(x => x.id !== id); save(K.eqLog, eqLog); renderSocial(); },
      'Emotional intelligence check-ins.'
    );

    renderList('mentor-list', mentors, m =>
      `<div class="data-row" data-id="${m.id}"><div class="data-main"><strong>${esc(m.name)}</strong>
        <div class="hint">${esc(m.role || 'mentor')} · last ${formatDateID(m.lastContact)}</div></div>
        <button class="btn btn-sm btn-outline" data-act="touch">Met</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { mentors = mentors.filter(x => x.id !== id); save(K.mentors, mentors); renderSocial(); },
      'Mentorship tracker.',
      (id, act) => {
        if (act === 'touch') {
          const m = mentors.find(x => x.id === id);
          if (m) { m.lastContact = todayStr(); save(K.mentors, mentors); renderSocial(); }
        }
      }
    );
  }

  // ========== LEADERSHIP ==========
  function renderLeadership() {
    setText('lead-open', accountability.filter(a => !a.done).length);
    setText('lead-decisions', decisions.length);
    setText('lead-courage', courage.length);
    setText('lead-milestones', leadMilestones.filter(m => m.done).length);

    renderList('leadership-dev-list', leadershipDev, d =>
      `<div class="data-row" data-id="${d.id}"><div class="data-main"><strong>${esc(d.title)}</strong>
        <div class="hint">${esc(d.notes || '')} · ${d.progress || 0}%</div>
        <div class="goal-progress-bar" style="margin-top:0.3rem"><div class="goal-progress-fill" style="width:${d.progress || 0}%"></div></div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { leadershipDev = leadershipDev.filter(x => x.id !== id); save(K.leadershipDev, leadershipDev); renderLeadership(); },
      'Leadership development goals.'
    );

    renderList('integrity-list', [...integrity].reverse().slice(0, 12), i =>
      `<div class="data-row" data-id="${i.id}"><div class="data-main"><strong>${formatDateID(i.date)}</strong>
        <div class="hint">${esc(i.entry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { integrity = integrity.filter(x => x.id !== id); save(K.integrity, integrity); renderLeadership(); },
      'Personal integrity tracker — catat saat diuji.'
    );

    renderList('accountability-list', accountability, a =>
      `<div class="data-row" data-id="${a.id}"><div class="data-main"><strong>${esc(a.title)}</strong>
        <div class="hint">${a.done ? '✓ Done' : 'Open'} · due ${formatDateID(a.due)}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${a.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { accountability = accountability.filter(x => x.id !== id); save(K.accountability, accountability); renderLeadership(); },
      'Accountability system — komitmen yang harus ditepati.',
      (id, act) => {
        if (act === 'toggle') {
          const a = accountability.find(x => x.id === id);
          if (a) { a.done = !a.done; save(K.accountability, accountability); renderLeadership(); }
        }
      }
    );

    renderList('decision-list', [...decisions].reverse().slice(0, 12), d =>
      `<div class="data-row" data-id="${d.id}"><div class="data-main"><strong>${esc(d.title)}</strong>
        <div class="hint">${formatDateID(d.date)} · ${esc(d.outcome || 'pending')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { decisions = decisions.filter(x => x.id !== id); save(K.decisions, decisions); renderLeadership(); },
      'Decision-making journal.'
    );

    renderList('responsibility-list', responsibilities, r =>
      `<div class="data-row" data-id="${r.id}"><div class="data-main"><strong>${esc(r.title)}</strong>
        <div class="hint">${esc(r.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { responsibilities = responsibilities.filter(x => x.id !== id); save(K.responsibilities, responsibilities); renderLeadership(); },
      'Responsibility tracker.'
    );

    renderList('problem-list', [...problemSolving].reverse().slice(0, 10), p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${esc(p.title)}</strong>
        <div class="hint">${formatDateID(p.date)} · ${esc(p.solution || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { problemSolving = problemSolving.filter(x => x.id !== id); save(K.problemSolving, problemSolving); renderLeadership(); },
      'Problem-solving development log.'
    );

    renderList('strategy-list', [...strategyNotes].reverse().slice(0, 10), s =>
      `<div class="data-row" data-id="${s.id}"><div class="data-main"><strong>${esc(s.title)}</strong>
        <div class="hint">${formatDateID(s.date)} · ${esc(s.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { strategyNotes = strategyNotes.filter(x => x.id !== id); save(K.strategyNotes, strategyNotes); renderLeadership(); },
      'Strategic thinking notes.'
    );

    const prinEl = document.getElementById('leadership-principles-list');
    if (prinEl) {
      prinEl.innerHTML = leadershipPrinciples.map((p, i) =>
        `<div class="routine-item"><span>${esc(p)}</span></div>`
      ).join('') || '<p class="empty-hint">Belum ada principles.</p>';
    }

    const codeEl = document.getElementById('code-of-conduct-list');
    if (codeEl) {
      codeEl.innerHTML = codeOfConduct.map(c =>
        `<div class="routine-item"><span>${esc(c)}</span></div>`
      ).join('') || '<p class="empty-hint">Belum ada code of conduct.</p>';
    }

    renderList('character-eval-list', [...characterEval].reverse().slice(0, 8), e =>
      `<div class="data-row" data-id="${e.id}"><div class="data-main"><strong>${formatDateID(e.date)}</strong>
        <div class="hint">Integrity ${e.integrity}/5 · Discipline ${e.discipline}/5 · ${esc(e.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { characterEval = characterEval.filter(x => x.id !== id); save(K.characterEval, characterEval); renderLeadership(); },
      'Character evaluation log.'
    );

    renderList('courage-list', [...courage].reverse().slice(0, 10), c =>
      `<div class="data-row" data-id="${c.id}"><div class="data-main"><strong>${esc(c.title)}</strong>
        <div class="hint">${formatDateID(c.date)} · ${esc(c.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { courage = courage.filter(x => x.id !== id); save(K.courage, courage); renderLeadership(); },
      'Courage development — catat tindakan berani.'
    );

    renderList('lead-milestone-list', leadMilestones, m =>
      `<div class="data-row" data-id="${m.id}"><div class="data-main"><strong>${esc(m.title)}</strong>
        <div class="hint">${m.done ? '✓' : 'In progress'} · ${formatDateID(m.date)}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${m.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { leadMilestones = leadMilestones.filter(x => x.id !== id); save(K.leadMilestones, leadMilestones); renderLeadership(); },
      'Leadership milestones.',
      (id, act) => {
        if (act === 'toggle') {
          const m = leadMilestones.find(x => x.id === id);
          if (m) { m.done = !m.done; save(K.leadMilestones, leadMilestones); renderLeadership(); }
        }
      }
    );
  }

  // ========== SPIRITUAL ==========
  function renderSpiritual() {
    setText('spirit-prayers', prayerLog.filter(p => p.date === todayStr()).length);
    setText('spirit-mindful', mindfulness.filter(m => m.date === todayStr()).length);
    setText('spirit-values', values.length);
    setText('spirit-peace', innerPeace.length ? (innerPeace[innerPeace.length - 1].score || '—') : '—');

    renderList('purpose-journal-list', [...purposeJournal].reverse().slice(0, 12), p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${formatDateID(p.date)}</strong>
        <div class="hint">${esc(p.entry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { purposeJournal = purposeJournal.filter(x => x.id !== id); save(K.purposeJournal, purposeJournal); renderSpiritual(); },
      'Life purpose journal.'
    );

    renderList('values-list', values, v =>
      `<div class="data-row" data-id="${v.id}"><div class="data-main"><strong>${esc(v.title)}</strong>
        <div class="hint">${esc(v.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { values = values.filter(x => x.id !== id); save(K.values, values); renderSpiritual(); },
      'Personal values — apa yang non-negotiable.'
    );

    // Spiritual routine checklist
    const today = todayStr();
    if (!spiritualChecks[today]) spiritualChecks[today] = [];
    const checked = spiritualChecks[today];
    const srEl = document.getElementById('spiritual-routine-list');
    if (srEl) {
      srEl.innerHTML = spiritualRoutine.map((item, idx) => {
        const done = checked.includes(idx);
        return `<div class="routine-item ${done ? 'done' : ''}" data-idx="${idx}">
          <div class="habit-toggle ${done ? 'checked' : ''}" data-act="spirit-check"></div>
          <span>${esc(item)}</span></div>`;
      }).join('') || '<p class="empty-hint">Edit spiritual routine.</p>';
      srEl.querySelectorAll('[data-act="spirit-check"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.closest('.routine-item').dataset.idx);
          const arr = spiritualChecks[today] || [];
          const pos = arr.indexOf(idx);
          if (pos >= 0) arr.splice(pos, 1); else arr.push(idx);
          spiritualChecks[today] = arr;
          save('hvos_spiritual_checks', spiritualChecks);
          renderSpiritual();
        });
      });
    }

    renderList('prayer-list', [...prayerLog].reverse().slice(0, 12), p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${formatDateID(p.date)}</strong>
        <div class="hint">${esc(p.notes || 'Prayer / ibadah')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { prayerLog = prayerLog.filter(x => x.id !== id); save(K.prayerLog, prayerLog); renderSpiritual(); },
      'Prayer / worship log.'
    );

    renderList('mindfulness-list', [...mindfulness].reverse().slice(0, 10), m =>
      `<div class="data-row" data-id="${m.id}"><div class="data-main"><strong>${m.minutes || 0} min</strong>
        <div class="hint">${formatDateID(m.date)} · ${esc(m.notes || 'mindfulness')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { mindfulness = mindfulness.filter(x => x.id !== id); save(K.mindfulness, mindfulness); renderSpiritual(); },
      'Mindfulness practice log.'
    );

    renderList('philosophy-list', [...philosophy].reverse().slice(0, 10), p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${esc(p.title)}</strong>
        <div class="hint">${formatDateID(p.date)} · ${esc(p.entry || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { philosophy = philosophy.filter(x => x.id !== id); save(K.philosophy, philosophy); renderSpiritual(); },
      'Life philosophy journal.'
    );

    renderList('moral-list', [...moralNotes].reverse().slice(0, 10), m =>
      `<div class="data-row" data-id="${m.id}"><div class="data-main"><strong>${formatDateID(m.date)}</strong>
        <div class="hint">${esc(m.entry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { moralNotes = moralNotes.filter(x => x.id !== id); save(K.moralNotes, moralNotes); renderSpiritual(); },
      'Moral development notes.'
    );

    renderList('peace-list', [...innerPeace].reverse().slice(0, 10), p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>Peace ${p.score}/5</strong>
        <div class="hint">${formatDateID(p.date)} · ${esc(p.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { innerPeace = innerPeace.filter(x => x.id !== id); save(K.innerPeace, innerPeace); renderSpiritual(); },
      'Inner peace tracker.'
    );

    const missionEl = document.getElementById('mission-statement');
    if (missionEl) {
      missionEl.innerHTML = mission.text
        ? `<div class="panel" style="background:var(--bg-elevated)"><p style="font-size:1.05rem;line-height:1.6">${esc(mission.text)}</p></div>`
        : '<p class="empty-hint">Belum ada personal mission statement. Klik Edit.</p>';
    }

    renderList('faith-list', [...faith].reverse().slice(0, 10), f =>
      `<div class="data-row" data-id="${f.id}"><div class="data-main"><strong>${formatDateID(f.date)}</strong>
        <div class="hint">${esc(f.entry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { faith = faith.filter(x => x.id !== id); save(K.faith, faith); renderSpiritual(); },
      'Faith development journal.'
    );

    renderList('legacy-list', legacy, l =>
      `<div class="data-row" data-id="${l.id}"><div class="data-main"><strong>${esc(l.title)}</strong>
        <div class="hint">${esc(l.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { legacy = legacy.filter(x => x.id !== id); save(K.legacy, legacy); renderSpiritual(); },
      'Legacy planning — apa yang ingin kamu tinggalkan.'
    );
  }

  // ---------- Wire buttons ----------
  function bind(id, fn) {
    const el = document.getElementById(id);
    if (el && !el.dataset.wired) { el.dataset.wired = '1'; el.addEventListener('click', fn); }
  }

  function wire() {
    // Social
    bind('btn-add-social-skill', () => {
      const title = prompt('Skill (mis. active listening, small talk):');
      if (!title) return;
      socialSkills.push({ id: uid(), title, notes: prompt('Notes:') || '', practices: 0 });
      save(K.socialSkills, socialSkills); renderSocial();
    });
    bind('btn-log-social-confidence', () => {
      const score = Number(prompt('Social confidence 1-5:', '3')) || 3;
      socialConfidence.push({ id: uid(), date: todayStr(), score, notes: prompt('Context:') || '' });
      save(K.socialConfidence, socialConfidence); renderSocial();
    });
    bind('btn-add-relationship', () => {
      const name = prompt('Name:');
      if (!name) return;
      relationships.push({ id: uid(), name, type: prompt('Type (partner/mentor/client...):') || '', lastContact: todayStr() });
      save(K.relationships, relationships); renderSocial();
    });
    bind('btn-add-family', () => {
      const name = prompt('Name:');
      if (!name) return;
      family.push({ id: uid(), name, relation: prompt('Relation:') || '', notes: '' });
      save(K.family, family); renderSocial();
    });
    bind('btn-add-friend', () => {
      const name = prompt('Friend name:');
      if (!name) return;
      friends.push({ id: uid(), name, lastContact: todayStr(), notes: '' });
      save(K.friends, friends); renderSocial();
    });
    bind('btn-add-social-event', () => {
      const title = prompt('Event:');
      if (!title) return;
      socialEvents.push({ id: uid(), title, date: prompt('Date YYYY-MM-DD:', todayStr()) || todayStr(), notes: '' });
      save(K.socialEvents, socialEvents); renderSocial();
    });
    bind('btn-add-speaking', () => {
      const title = prompt('Talk / practice title:');
      if (!title) return;
      speaking.push({ id: uid(), title, date: todayStr(), rating: Number(prompt('Self-rating 1-5:', '3')) || 3, notes: prompt('Notes:') || '' });
      save(K.speaking, speaking); renderSocial();
    });
    bind('btn-add-negotiation', () => {
      const title = prompt('Negotiation context:');
      if (!title) return;
      negotiation.push({ id: uid(), title, date: todayStr(), outcome: prompt('Outcome:') || '', notes: '' });
      save(K.negotiation, negotiation); renderSocial();
    });
    bind('btn-add-conflict', () => {
      const title = prompt('Conflict summary:');
      if (!title) return;
      conflicts.push({ id: uid(), title, date: todayStr(), resolved: confirm('Sudah resolved?'), notes: prompt('Lesson:') || '' });
      save(K.conflicts, conflicts); renderSocial();
    });
    bind('btn-add-eq', () => {
      const score = Number(prompt('EQ self-score 1-5:', '3')) || 3;
      eqLog.push({ id: uid(), date: todayStr(), score, notes: prompt('Reflection:') || '' });
      save(K.eqLog, eqLog); renderSocial();
    });
    bind('btn-add-mentor', () => {
      const name = prompt('Mentor / mentee name:');
      if (!name) return;
      mentors.push({ id: uid(), name, role: prompt('Role (mentor/mentee):', 'mentor') || 'mentor', lastContact: todayStr() });
      save(K.mentors, mentors); renderSocial();
    });

    // Leadership
    bind('btn-add-lead-dev', () => {
      const title = prompt('Leadership development goal:');
      if (!title) return;
      leadershipDev.push({ id: uid(), title, progress: Number(prompt('Progress %:', '0')) || 0, notes: '' });
      save(K.leadershipDev, leadershipDev); renderLeadership();
    });
    bind('btn-add-integrity', () => {
      const entry = prompt('Integrity moment / test:');
      if (!entry) return;
      integrity.push({ id: uid(), date: todayStr(), entry });
      save(K.integrity, integrity); renderLeadership();
    });
    bind('btn-add-accountability', () => {
      const title = prompt('Commitment:');
      if (!title) return;
      accountability.push({ id: uid(), title, due: prompt('Due YYYY-MM-DD:', todayStr()) || todayStr(), done: false });
      save(K.accountability, accountability); renderLeadership();
    });
    bind('btn-add-decision', () => {
      const title = prompt('Decision:');
      if (!title) return;
      decisions.push({ id: uid(), title, date: todayStr(), outcome: prompt('Reasoning / outcome:') || '' });
      save(K.decisions, decisions); renderLeadership();
    });
    bind('btn-add-responsibility', () => {
      const title = prompt('Responsibility:');
      if (!title) return;
      responsibilities.push({ id: uid(), title, notes: prompt('Notes:') || '' });
      save(K.responsibilities, responsibilities); renderLeadership();
    });
    bind('btn-add-problem', () => {
      const title = prompt('Problem:');
      if (!title) return;
      problemSolving.push({ id: uid(), title, date: todayStr(), solution: prompt('Approach / solution:') || '' });
      save(K.problemSolving, problemSolving); renderLeadership();
    });
    bind('btn-add-strategy', () => {
      const title = prompt('Strategy note title:');
      if (!title) return;
      strategyNotes.push({ id: uid(), title, date: todayStr(), notes: prompt('Thinking:') || '' });
      save(K.strategyNotes, strategyNotes); renderLeadership();
    });
    bind('btn-edit-principles', () => {
      const raw = prompt('Leadership principles (satu per baris):', leadershipPrinciples.join('\n'));
      if (raw !== null) {
        leadershipPrinciples = raw.split('\n').map(s => s.trim()).filter(Boolean);
        save(K.leadershipPrinciples, leadershipPrinciples);
        renderLeadership();
      }
    });
    bind('btn-edit-code', () => {
      const raw = prompt('Personal code of conduct (satu per baris):', codeOfConduct.join('\n'));
      if (raw !== null) {
        codeOfConduct = raw.split('\n').map(s => s.trim()).filter(Boolean);
        save(K.codeOfConduct, codeOfConduct);
        renderLeadership();
      }
    });
    bind('btn-add-character-eval', () => {
      characterEval.push({
        id: uid(), date: todayStr(),
        integrity: Number(prompt('Integrity 1-5:', '3')) || 3,
        discipline: Number(prompt('Discipline 1-5:', '3')) || 3,
        notes: prompt('Notes:') || '',
      });
      save(K.characterEval, characterEval); renderLeadership();
    });
    bind('btn-add-courage', () => {
      const title = prompt('Courageous act:');
      if (!title) return;
      courage.push({ id: uid(), title, date: todayStr(), notes: prompt('What happened:') || '' });
      save(K.courage, courage); renderLeadership();
    });
    bind('btn-add-lead-milestone', () => {
      const title = prompt('Leadership milestone:');
      if (!title) return;
      leadMilestones.push({ id: uid(), title, date: todayStr(), done: false });
      save(K.leadMilestones, leadMilestones); renderLeadership();
    });

    // Spiritual
    bind('btn-add-purpose', () => {
      const entry = prompt('Purpose reflection:');
      if (!entry) return;
      purposeJournal.push({ id: uid(), date: todayStr(), entry });
      save(K.purposeJournal, purposeJournal); renderSpiritual();
    });
    bind('btn-add-value', () => {
      const title = prompt('Core value:');
      if (!title) return;
      values.push({ id: uid(), title, notes: prompt('Why it matters:') || '' });
      save(K.values, values); renderSpiritual();
    });
    bind('btn-edit-spiritual-routine', () => {
      const raw = prompt('Spiritual routine (satu per baris):', spiritualRoutine.join('\n'));
      if (raw !== null) {
        spiritualRoutine = raw.split('\n').map(s => s.trim()).filter(Boolean);
        save(K.spiritualRoutine, spiritualRoutine);
        renderSpiritual();
      }
    });
    bind('btn-add-prayer', () => {
      prayerLog.push({ id: uid(), date: todayStr(), notes: prompt('Notes (opsional):') || '' });
      save(K.prayerLog, prayerLog); renderSpiritual();
    });
    bind('btn-add-mindfulness', () => {
      const minutes = Number(prompt('Minutes:', '10')) || 10;
      mindfulness.push({ id: uid(), date: todayStr(), minutes, notes: prompt('Type/notes:') || '' });
      save(K.mindfulness, mindfulness); renderSpiritual();
    });
    bind('btn-add-philosophy', () => {
      const title = prompt('Title / theme:');
      if (!title) return;
      philosophy.push({ id: uid(), title, date: todayStr(), entry: prompt('Reflection:') || '' });
      save(K.philosophy, philosophy); renderSpiritual();
    });
    bind('btn-add-moral', () => {
      const entry = prompt('Moral development note:');
      if (!entry) return;
      moralNotes.push({ id: uid(), date: todayStr(), entry });
      save(K.moralNotes, moralNotes); renderSpiritual();
    });
    bind('btn-add-peace', () => {
      const score = Number(prompt('Inner peace 1-5:', '3')) || 3;
      innerPeace.push({ id: uid(), date: todayStr(), score, notes: prompt('Notes:') || '' });
      save(K.innerPeace, innerPeace); renderSpiritual();
    });
    bind('btn-edit-mission', () => {
      const text = prompt('Personal mission statement:', mission.text || '');
      if (text !== null) { mission = { text }; save(K.mission, mission); renderSpiritual(); }
    });
    bind('btn-add-faith', () => {
      const entry = prompt('Faith reflection:');
      if (!entry) return;
      faith.push({ id: uid(), date: todayStr(), entry });
      save(K.faith, faith); renderSpiritual();
    });
    bind('btn-add-legacy', () => {
      const title = prompt('Legacy item:');
      if (!title) return;
      legacy.push({ id: uid(), title, notes: prompt('Details:') || '' });
      save(K.legacy, legacy); renderSpiritual();
    });
  }

  document.addEventListener('DOMContentLoaded', wire);
  setTimeout(wire, 1500);
  setTimeout(wire, 3500);
})();
