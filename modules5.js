/* HVOS Modules 5: Digital, Brand, Adventure, Security, Legacy */
(function () {
  const K = {
    aiTools: 'hvos_ai_tools', aiLearning: 'hvos_ai_learning', digiSkills: 'hvos_digi_skills',
    software: 'hvos_software', automation: 'hvos_automation', digiProductivity: 'hvos_digi_prod',
    cyberCheck: 'hvos_cyber_check', digiAssets: 'hvos_digi_assets', websites: 'hvos_websites',
    techProjects: 'hvos_tech_projects', digiPortfolio: 'hvos_digi_portfolio', onlinePresence: 'hvos_online_presence',
    brandStrategy: 'hvos_brand_strategy', brandIdentity: 'hvos_brand_identity', contentPlan: 'hvos_content_plan',
    contentSchedule: 'hvos_content_schedule', socialMedia: 'hvos_social_media', proPortfolio: 'hvos_pro_portfolio',
    reputation: 'hvos_reputation', achievements: 'hvos_achievements', publicImage: 'hvos_public_image',
    positioning: 'hvos_positioning', audienceGrowth: 'hvos_audience_growth', brandMilestones: 'hvos_brand_milestones',
    bucketList: 'hvos_bucket_list', travelGoals: 'hvos_travel_goals', adventures: 'hvos_adventures',
    experiences: 'hvos_experiences', challenges: 'hvos_adventure_challenges', outdoor: 'hvos_outdoor',
    hobbies: 'hvos_hobbies', cultural: 'hvos_cultural', expJournal: 'hvos_exp_journal',
    annualAdventure: 'hvos_annual_adventure', achievementArchive: 'hvos_achievement_archive', dreamDest: 'hvos_dream_dest',
    emergencyPlan: 'hvos_emergency_plan', emergencyContacts: 'hvos_emergency_contacts', docRecords: 'hvos_doc_records',
    insurance: 'hvos_insurance', passwordRefs: 'hvos_password_refs', accountSecurity: 'hvos_account_security',
    backups: 'hvos_backups', riskAssessment: 'hvos_risk_assessment', propertyProtect: 'hvos_property_protect',
    digiPrivacy: 'hvos_digi_privacy', disasterPrep: 'hvos_disaster_prep',
    lifetimeGoals: 'hvos_lifetime_goals', legacyStatement: 'hvos_legacy_statement', familyLegacy: 'hvos_family_legacy',
    lifeMilestones: 'hvos_life_milestones', majorDecisions: 'hvos_major_decisions', personalHistory: 'hvos_personal_history',
    lessonsLearned: 'hvos_lessons_learned', lifeImpact: 'hvos_life_impact', philanthropy: 'hvos_philanthropy',
    lifetimeBucket: 'hvos_lifetime_bucket',
  };

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function load(k, fb) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } }
  function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  function todayStr() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function formatDateID(s) {
    if (!s) return '—';
    return new Date(s + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }

  // Digital
  let aiTools = load(K.aiTools, []);
  let aiLearning = load(K.aiLearning, []);
  let digiSkills = load(K.digiSkills, []);
  let software = load(K.software, []);
  let automation = load(K.automation, []);
  let digiProductivity = load(K.digiProductivity, []);
  let cyberCheck = load(K.cyberCheck, ['2FA enabled', 'Password manager', 'Software updated', 'Backups verified', 'Phishing awareness']);
  let cyberChecks = load('hvos_cyber_checks', {});
  let digiAssets = load(K.digiAssets, []);
  let websites = load(K.websites, []);
  let techProjects = load(K.techProjects, []);
  let digiPortfolio = load(K.digiPortfolio, []);
  let onlinePresence = load(K.onlinePresence, []);

  // Brand
  let brandStrategy = load(K.brandStrategy, { text: '' });
  let brandIdentity = load(K.brandIdentity, { text: '' });
  let contentPlan = load(K.contentPlan, []);
  let contentSchedule = load(K.contentSchedule, []);
  let socialMedia = load(K.socialMedia, []);
  let proPortfolio = load(K.proPortfolio, []);
  let reputation = load(K.reputation, []);
  let achievements = load(K.achievements, []);
  let publicImage = load(K.publicImage, []);
  let positioning = load(K.positioning, { text: '' });
  let audienceGrowth = load(K.audienceGrowth, []);
  let brandMilestones = load(K.brandMilestones, []);

  // Adventure
  let bucketList = load(K.bucketList, []);
  let travelGoals = load(K.travelGoals, []);
  let adventures = load(K.adventures, []);
  let experiences = load(K.experiences, []);
  let challenges = load(K.challenges, null);
  if (!Array.isArray(challenges)) {
    const legacyChallenges = load('hvos_challenges', []);
    challenges = legacyChallenges.filter(item => item && (item.title || item.notes !== undefined));
    save('hvos_challenges', legacyChallenges.filter(item => !item || (!item.title && item.notes === undefined)));
    save(K.challenges, challenges);
  }
  let outdoor = load(K.outdoor, []);
  let hobbies = load(K.hobbies, []);
  let cultural = load(K.cultural, []);
  let expJournal = load(K.expJournal, []);
  let annualAdventure = load(K.annualAdventure, []);
  let achievementArchive = load(K.achievementArchive, []);
  let dreamDest = load(K.dreamDest, []);

  // Security
  let emergencyPlan = load(K.emergencyPlan, { text: '' });
  let emergencyContacts = load(K.emergencyContacts, []);
  let docRecords = load(K.docRecords, []);
  let insurance = load(K.insurance, []);
  let passwordRefs = load(K.passwordRefs, []);
  let accountSecurity = load(K.accountSecurity, ['Email recovery set', '2FA on critical accounts', 'Recovery codes stored offline', 'No reused passwords']);
  let accountChecks = load('hvos_account_checks', {});
  let backups = load(K.backups, []);
  let riskAssessment = load(K.riskAssessment, []);
  let propertyProtect = load(K.propertyProtect, []);
  let digiPrivacy = load(K.digiPrivacy, ['Review app permissions', 'Limit data sharing', 'Private browsing when needed', 'Check privacy settings quarterly']);
  let privacyChecks = load('hvos_privacy_checks', {});
  let disasterPrep = load(K.disasterPrep, []);

  // Legacy
  let lifetimeGoals = load(K.lifetimeGoals, []);
  let legacyStatement = load(K.legacyStatement, { text: '' });
  let familyLegacy = load(K.familyLegacy, []);
  let lifeMilestones = load(K.lifeMilestones, []);
  let majorDecisions = load(K.majorDecisions, []);
  let personalHistory = load(K.personalHistory, []);
  let lessonsLearned = load(K.lessonsLearned, []);
  let lifeImpact = load(K.lifeImpact, []);
  let philanthropy = load(K.philanthropy, []);
  let lifetimeBucket = load(K.lifetimeBucket, []);

  window.HVOSModules = window.HVOSModules || {};
  Object.assign(window.HVOSModules, {
    renderDigital, renderBrand, renderAdventure, renderSecurity, renderLegacy,
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
      row.addEventListener('click', async e => {
        const act = e.target.closest('[data-act]')?.dataset.act;
        const id = row.dataset.id;
        if (!act) return;
        if (act === 'del') { if (window.HVOSDialogs ? await window.HVOSDialogs.confirm('Hapus item ini?') : confirm('Hapus?')) onDel(id); }
        else if (onExtra) onExtra(id, act);
      });
    });
  }

  function setBox(id, data) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = data.text
      ? '<p style="line-height:1.55;white-space:pre-wrap">' + esc(data.text) + '</p>'
      : '<p class="empty-hint">Belum diisi. Klik Edit.</p>';
  }

  function renderChecklist(elId, items, checksKey, checksObj, saveKey) {
    const el = document.getElementById(elId);
    if (!el) return;
    const today = todayStr();
    if (!checksObj[today]) checksObj[today] = [];
    const checked = checksObj[today];
    el.innerHTML = items.map((item, idx) => {
      const done = checked.includes(idx);
      return `<div class="routine-item ${done ? 'done' : ''}" data-idx="${idx}">
        <div class="habit-toggle ${done ? 'checked' : ''}" data-act="check"></div>
        <span>${esc(item)}</span></div>`;
    }).join('') || '<p class="empty-hint">Kosong.</p>';
    el.querySelectorAll('[data-act="check"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.closest('.routine-item').dataset.idx);
        const arr = checksObj[today] || [];
        const pos = arr.indexOf(idx);
        if (pos >= 0) arr.splice(pos, 1); else arr.push(idx);
        checksObj[today] = arr;
        save(saveKey, checksObj);
        renderChecklist(elId, items, checksKey, checksObj, saveKey);
      });
    });
  }

  // ========== DIGITAL ==========
  function renderDigital() {
    setText('digi-tools', aiTools.length);
    setText('digi-skills', digiSkills.length);
    setText('digi-projects', techProjects.filter(p => p.status !== 'done').length);
    setText('digi-sites', websites.length);

    renderList('ai-tools-list', aiTools, t =>
      `<div class="data-row" data-id="${t.id}"><div class="data-main"><strong>${esc(t.name)}</strong>
        <div class="hint">${esc(t.use || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { aiTools = aiTools.filter(x => x.id !== id); save(K.aiTools, aiTools); renderDigital(); },
      'AI tools library.'
    );
    renderList('ai-learning-list', [...aiLearning].reverse().slice(0, 12), a =>
      `<div class="data-row" data-id="${a.id}"><div class="data-main"><strong>${esc(a.title)}</strong>
        <div class="hint">${formatDateID(a.date)} · ${esc(a.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { aiLearning = aiLearning.filter(x => x.id !== id); save(K.aiLearning, aiLearning); renderDigital(); },
      'AI learning tracker.'
    );
    renderList('digi-skills-list', digiSkills, s =>
      `<div class="data-row" data-id="${s.id}"><div class="data-main"><strong>${esc(s.name)}</strong>
        <div class="hint">${s.progress || 0}% · ${esc(s.notes || '')}</div>
        <div class="goal-progress-bar" style="margin-top:0.3rem"><div class="goal-progress-fill" style="width:${s.progress || 0}%"></div></div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { digiSkills = digiSkills.filter(x => x.id !== id); save(K.digiSkills, digiSkills); renderDigital(); },
      'Digital skills development.'
    );
    renderList('software-list', software, s =>
      `<div class="data-row" data-id="${s.id}"><div class="data-main"><strong>${esc(s.name)}</strong>
        <div class="hint">${esc(s.category || '')} · ${esc(s.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { software = software.filter(x => x.id !== id); save(K.software, software); renderDigital(); },
      'Software tools management.'
    );
    renderList('automation-list', automation, a =>
      `<div class="data-row" data-id="${a.id}"><div class="data-main"><strong>${esc(a.title)}</strong>
        <div class="hint">${esc(a.status || 'idea')} · ${esc(a.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { automation = automation.filter(x => x.id !== id); save(K.automation, automation); renderDigital(); },
      'Automation planner.'
    );
    renderList('digi-prod-list', digiProductivity, p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${esc(p.title)}</strong>
        <div class="hint">${esc(p.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { digiProductivity = digiProductivity.filter(x => x.id !== id); save(K.digiProductivity, digiProductivity); renderDigital(); },
      'Digital productivity system.'
    );
    renderChecklist('cyber-checklist', cyberCheck, 'cyber', cyberChecks, 'hvos_cyber_checks');
    renderList('digi-assets-list', digiAssets, a =>
      `<div class="data-row" data-id="${a.id}"><div class="data-main"><strong>${esc(a.name)}</strong>
        <div class="hint">${esc(a.type || '')} · ${esc(a.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { digiAssets = digiAssets.filter(x => x.id !== id); save(K.digiAssets, digiAssets); renderDigital(); },
      'Digital asset management.'
    );
    renderList('website-list', websites, w =>
      `<div class="data-row" data-id="${w.id}"><div class="data-main"><strong>${esc(w.name)}</strong>
        <div class="hint">${esc(w.url || '')} · ${esc(w.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { websites = websites.filter(x => x.id !== id); save(K.websites, websites); renderDigital(); },
      'Personal website management.'
    );
    renderList('tech-project-list', techProjects, p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><span class="tag tag-focus">${esc(p.status || 'active')}</span>
        <strong>${esc(p.name)}</strong><div class="hint">${esc(p.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { techProjects = techProjects.filter(x => x.id !== id); save(K.techProjects, techProjects); renderDigital(); },
      'Technology project tracker.'
    );
    renderList('digi-portfolio-list', digiPortfolio, p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${esc(p.title)}</strong>
        <div class="hint">${esc(p.link || '')} · ${esc(p.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { digiPortfolio = digiPortfolio.filter(x => x.id !== id); save(K.digiPortfolio, digiPortfolio); renderDigital(); },
      'Digital portfolio.'
    );
    renderList('online-presence-list', onlinePresence, o =>
      `<div class="data-row" data-id="${o.id}"><div class="data-main"><strong>${esc(o.platform)}</strong>
        <div class="hint">${esc(o.handle || '')} · ${esc(o.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { onlinePresence = onlinePresence.filter(x => x.id !== id); save(K.onlinePresence, onlinePresence); renderDigital(); },
      'Online presence management.'
    );
  }

  // ========== BRAND ==========
  function renderBrand() {
    setText('brand-content', contentSchedule.filter(c => !c.done).length);
    setText('brand-social', socialMedia.length);
    setText('brand-achievements', achievements.length);
    setText('brand-milestones', brandMilestones.filter(m => m.done).length);

    setBox('brand-strategy-box', brandStrategy);
    setBox('brand-identity-box', brandIdentity);
    setBox('positioning-box', positioning);

    renderList('content-plan-list', contentPlan, c =>
      `<div class="data-row" data-id="${c.id}"><div class="data-main"><strong>${esc(c.title)}</strong>
        <div class="hint">${esc(c.pillar || '')} · ${esc(c.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { contentPlan = contentPlan.filter(x => x.id !== id); save(K.contentPlan, contentPlan); renderBrand(); },
      'Content planning.'
    );
    renderList('content-schedule-list', contentSchedule, c =>
      `<div class="data-row" data-id="${c.id}"><div class="data-main"><strong>${esc(c.title)}</strong>
        <div class="hint">${formatDateID(c.date)} · ${c.done ? '✓ published' : 'scheduled'}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${c.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { contentSchedule = contentSchedule.filter(x => x.id !== id); save(K.contentSchedule, contentSchedule); renderBrand(); },
      'Content publishing schedule.',
      (id, act) => {
        if (act === 'toggle') {
          const c = contentSchedule.find(x => x.id === id);
          if (c) { c.done = !c.done; save(K.contentSchedule, contentSchedule); renderBrand(); }
        }
      }
    );
    renderList('social-media-list', socialMedia, s =>
      `<div class="data-row" data-id="${s.id}"><div class="data-main"><strong>${esc(s.platform)}</strong>
        <div class="hint">${esc(s.handle || '')} · focus: ${esc(s.focus || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { socialMedia = socialMedia.filter(x => x.id !== id); save(K.socialMedia, socialMedia); renderBrand(); },
      'Social media management.'
    );
    renderList('pro-portfolio-list', proPortfolio, p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${esc(p.title)}</strong>
        <div class="hint">${esc(p.link || '')} · ${esc(p.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { proPortfolio = proPortfolio.filter(x => x.id !== id); save(K.proPortfolio, proPortfolio); renderBrand(); },
      'Professional portfolio.'
    );
    renderList('reputation-list', [...reputation].reverse().slice(0, 12), r =>
      `<div class="data-row" data-id="${r.id}"><div class="data-main"><strong>${formatDateID(r.date)}</strong>
        <div class="hint">${esc(r.entry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { reputation = reputation.filter(x => x.id !== id); save(K.reputation, reputation); renderBrand(); },
      'Online reputation tracker.'
    );
    renderList('achievements-list', achievements, a =>
      `<div class="data-row" data-id="${a.id}"><div class="data-main"><strong>${esc(a.title)}</strong>
        <div class="hint">${formatDateID(a.date)} · ${esc(a.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { achievements = achievements.filter(x => x.id !== id); save(K.achievements, achievements); renderBrand(); },
      'Personal achievements library.'
    );
    renderList('public-image-list', publicImage, p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${esc(p.title)}</strong>
        <div class="hint">${esc(p.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { publicImage = publicImage.filter(x => x.id !== id); save(K.publicImage, publicImage); renderBrand(); },
      'Public image development.'
    );
    renderList('audience-list', [...audienceGrowth].reverse().slice(0, 12), a =>
      `<div class="data-row" data-id="${a.id}"><div class="data-main"><strong>${esc(a.platform)}</strong>
        <div class="hint">${formatDateID(a.date)} · ${esc(String(a.count))} followers/subs</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { audienceGrowth = audienceGrowth.filter(x => x.id !== id); save(K.audienceGrowth, audienceGrowth); renderBrand(); },
      'Audience growth analytics.'
    );
    renderList('brand-milestone-list', brandMilestones, m =>
      `<div class="data-row" data-id="${m.id}"><div class="data-main"><strong>${esc(m.title)}</strong>
        <div class="hint">${m.done ? '✓' : 'Open'}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${m.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { brandMilestones = brandMilestones.filter(x => x.id !== id); save(K.brandMilestones, brandMilestones); renderBrand(); },
      'Brand development milestones.',
      (id, act) => {
        if (act === 'toggle') {
          const m = brandMilestones.find(x => x.id === id);
          if (m) { m.done = !m.done; save(K.brandMilestones, brandMilestones); renderBrand(); }
        }
      }
    );
  }

  // ========== ADVENTURE ==========
  function renderAdventure() {
    setText('adv-bucket', bucketList.filter(b => !b.done).length);
    setText('adv-travel', travelGoals.filter(t => !t.done).length);
    setText('adv-done', experiences.length);
    setText('adv-hobbies', hobbies.length);

    renderList('bucket-list', bucketList, b =>
      `<div class="data-row" data-id="${b.id}"><div class="data-main"><strong>${esc(b.title)}</strong>
        <div class="hint">${b.done ? '✓ done' : 'open'} · ${esc(b.notes || '')}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${b.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { bucketList = bucketList.filter(x => x.id !== id); save(K.bucketList, bucketList); renderAdventure(); },
      'Bucket list.',
      (id, act) => {
        if (act === 'toggle') {
          const b = bucketList.find(x => x.id === id);
          if (b) { b.done = !b.done; save(K.bucketList, bucketList); renderAdventure(); }
        }
      }
    );
    renderList('travel-goals-list', travelGoals, t =>
      `<div class="data-row" data-id="${t.id}"><div class="data-main"><strong>${esc(t.destination)}</strong>
        <div class="hint">${t.done ? '✓' : 'goal'} · ${esc(t.notes || '')}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${t.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { travelGoals = travelGoals.filter(x => x.id !== id); save(K.travelGoals, travelGoals); renderAdventure(); },
      'Travel goals.',
      (id, act) => {
        if (act === 'toggle') {
          const t = travelGoals.find(x => x.id === id);
          if (t) { t.done = !t.done; save(K.travelGoals, travelGoals); renderAdventure(); }
        }
      }
    );
    renderList('adventure-list', adventures, a =>
      `<div class="data-row" data-id="${a.id}"><div class="data-main"><strong>${esc(a.title)}</strong>
        <div class="hint">${formatDateID(a.date)} · ${esc(a.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { adventures = adventures.filter(x => x.id !== id); save(K.adventures, adventures); renderAdventure(); },
      'Adventure planner / log.'
    );
    renderList('experience-list', experiences, e =>
      `<div class="data-row" data-id="${e.id}"><div class="data-main"><strong>${esc(e.title)}</strong>
        <div class="hint">${formatDateID(e.date)} · ${esc(e.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { experiences = experiences.filter(x => x.id !== id); save(K.experiences, experiences); renderAdventure(); },
      'New experiences tracker.'
    );
    renderList('challenge-list', challenges, c =>
      `<div class="data-row" data-id="${c.id}"><div class="data-main"><strong>${esc(c.title)}</strong>
        <div class="hint">${c.done ? '✓' : 'in progress'} · ${esc(c.notes || '')}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${c.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { challenges = challenges.filter(x => x.id !== id); save(K.challenges, challenges); renderAdventure(); },
      'Personal challenges.',
      (id, act) => {
        if (act === 'toggle') {
          const c = challenges.find(x => x.id === id);
          if (c) { c.done = !c.done; save(K.challenges, challenges); renderAdventure(); }
        }
      }
    );
    renderList('outdoor-list', outdoor, o =>
      `<div class="data-row" data-id="${o.id}"><div class="data-main"><strong>${esc(o.title)}</strong>
        <div class="hint">${formatDateID(o.date)} · ${esc(o.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { outdoor = outdoor.filter(x => x.id !== id); save(K.outdoor, outdoor); renderAdventure(); },
      'Outdoor activities.'
    );
    renderList('hobby-list', hobbies, h =>
      `<div class="data-row" data-id="${h.id}"><div class="data-main"><strong>${esc(h.name)}</strong>
        <div class="hint">${esc(h.level || '')} · ${esc(h.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { hobbies = hobbies.filter(x => x.id !== id); save(K.hobbies, hobbies); renderAdventure(); },
      'Hobbies development.'
    );
    renderList('cultural-list', cultural, c =>
      `<div class="data-row" data-id="${c.id}"><div class="data-main"><strong>${esc(c.title)}</strong>
        <div class="hint">${formatDateID(c.date)} · ${esc(c.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { cultural = cultural.filter(x => x.id !== id); save(K.cultural, cultural); renderAdventure(); },
      'Cultural exploration.'
    );
    renderList('exp-journal-list', [...expJournal].reverse().slice(0, 12), j =>
      `<div class="data-row" data-id="${j.id}"><div class="data-main"><strong>${formatDateID(j.date)}</strong>
        <div class="hint">${esc(j.entry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { expJournal = expJournal.filter(x => x.id !== id); save(K.expJournal, expJournal); renderAdventure(); },
      'Experience journal.'
    );
    renderList('annual-adventure-list', annualAdventure, a =>
      `<div class="data-row" data-id="${a.id}"><div class="data-main"><strong>${esc(a.title)}</strong>
        <div class="hint">${esc(a.year || '')} · ${a.done ? '✓' : 'planned'}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${a.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { annualAdventure = annualAdventure.filter(x => x.id !== id); save(K.annualAdventure, annualAdventure); renderAdventure(); },
      'Annual adventure goals.',
      (id, act) => {
        if (act === 'toggle') {
          const a = annualAdventure.find(x => x.id === id);
          if (a) { a.done = !a.done; save(K.annualAdventure, annualAdventure); renderAdventure(); }
        }
      }
    );
    renderList('achievement-archive-list', achievementArchive, a =>
      `<div class="data-row" data-id="${a.id}"><div class="data-main"><strong>${esc(a.title)}</strong>
        <div class="hint">${formatDateID(a.date)} · ${esc(a.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { achievementArchive = achievementArchive.filter(x => x.id !== id); save(K.achievementArchive, achievementArchive); renderAdventure(); },
      'Personal achievement archive.'
    );
    renderList('dream-dest-list', dreamDest, d =>
      `<div class="data-row" data-id="${d.id}"><div class="data-main"><strong>${esc(d.place)}</strong>
        <div class="hint">${esc(d.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { dreamDest = dreamDest.filter(x => x.id !== id); save(K.dreamDest, dreamDest); renderAdventure(); },
      'Dream destinations.'
    );
  }

  // ========== SECURITY ==========
  function renderSecurity() {
    setText('sec-contacts', emergencyContacts.length);
    setText('sec-insurance', insurance.length);
    setText('sec-docs', docRecords.length);
    setText('sec-risks', riskAssessment.length);

    setBox('emergency-plan-box', emergencyPlan);
    renderChecklist('account-security-list', accountSecurity, 'account', accountChecks, 'hvos_account_checks');
    renderChecklist('digi-privacy-list', digiPrivacy, 'privacy', privacyChecks, 'hvos_privacy_checks');

    renderList('emergency-contacts-list', emergencyContacts, c =>
      `<div class="data-row" data-id="${c.id}"><div class="data-main"><strong>${esc(c.name)}</strong>
        <div class="hint">${esc(c.relation || '')} · ${esc(c.phone || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { emergencyContacts = emergencyContacts.filter(x => x.id !== id); save(K.emergencyContacts, emergencyContacts); renderSecurity(); },
      'Emergency contacts.'
    );
    renderList('doc-records-list', docRecords, d =>
      `<div class="data-row" data-id="${d.id}"><div class="data-main"><strong>${esc(d.title)}</strong>
        <div class="hint">loc: ${esc(d.location || '—')} · exp ${formatDateID(d.expiry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { docRecords = docRecords.filter(x => x.id !== id); save(K.docRecords, docRecords); renderSecurity(); },
      'Important document records (metadata only).'
    );
    renderList('insurance-list', insurance, i =>
      `<div class="data-row" data-id="${i.id}"><div class="data-main"><strong>${esc(i.type)}</strong>
        <div class="hint">${esc(i.provider || '')} · exp ${formatDateID(i.expiry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { insurance = insurance.filter(x => x.id !== id); save(K.insurance, insurance); renderSecurity(); },
      'Insurance management.'
    );
    renderList('password-refs-list', passwordRefs, p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${esc(p.account)}</strong>
        <div class="hint">Manager: ${esc(p.manager || '—')} · note: ${esc(p.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { passwordRefs = passwordRefs.filter(x => x.id !== id); save(K.passwordRefs, passwordRefs); renderSecurity(); },
      'Password manager reference — JANGAN simpan password asli.'
    );
    renderList('backup-list', backups, b =>
      `<div class="data-row" data-id="${b.id}"><div class="data-main"><strong>${esc(b.what)}</strong>
        <div class="hint">Last: ${formatDateID(b.lastBackup)} · every ${b.interval || '?'} days</div></div>
        <button class="btn btn-sm btn-outline" data-act="done">Backed up</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { backups = backups.filter(x => x.id !== id); save(K.backups, backups); renderSecurity(); },
      'Data backup schedule.',
      (id, act) => {
        if (act === 'done') {
          const b = backups.find(x => x.id === id);
          if (b) { b.lastBackup = todayStr(); save(K.backups, backups); renderSecurity(); }
        }
      }
    );
    renderList('risk-assessment-list', riskAssessment, r =>
      `<div class="data-row" data-id="${r.id}"><div class="data-main"><strong>${esc(r.title)}</strong>
        <div class="hint">Level ${r.level || '—'}/5 · ${esc(r.mitigation || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { riskAssessment = riskAssessment.filter(x => x.id !== id); save(K.riskAssessment, riskAssessment); renderSecurity(); },
      'Personal risk assessment.'
    );
    renderList('property-protect-list', propertyProtect, p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${esc(p.title)}</strong>
        <div class="hint">${esc(p.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { propertyProtect = propertyProtect.filter(x => x.id !== id); save(K.propertyProtect, propertyProtect); renderSecurity(); },
      'Property protection checklist.'
    );
    renderList('disaster-prep-list', disasterPrep, d =>
      `<div class="data-row" data-id="${d.id}"><div class="data-main"><strong>${esc(d.title)}</strong>
        <div class="hint">${d.done ? '✓' : 'todo'} · ${esc(d.notes || '')}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${d.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { disasterPrep = disasterPrep.filter(x => x.id !== id); save(K.disasterPrep, disasterPrep); renderSecurity(); },
      'Disaster preparedness.',
      (id, act) => {
        if (act === 'toggle') {
          const d = disasterPrep.find(x => x.id === id);
          if (d) { d.done = !d.done; save(K.disasterPrep, disasterPrep); renderSecurity(); }
        }
      }
    );
  }

  // ========== LEGACY ==========
  function renderLegacy() {
    setText('leg-goals', lifetimeGoals.length);
    setText('leg-milestones', lifeMilestones.length);
    setText('leg-lessons', lessonsLearned.length);
    setText('leg-philanthropy', philanthropy.length);

    setBox('legacy-statement-box', legacyStatement);

    renderList('lifetime-goals-list', lifetimeGoals, g =>
      `<div class="data-row" data-id="${g.id}"><div class="data-main"><strong>${esc(g.title)}</strong>
        <div class="hint">${g.progress || 0}% · ${esc(g.notes || '')}</div>
        <div class="goal-progress-bar" style="margin-top:0.3rem"><div class="goal-progress-fill" style="width:${g.progress || 0}%"></div></div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { lifetimeGoals = lifetimeGoals.filter(x => x.id !== id); save(K.lifetimeGoals, lifetimeGoals); renderLegacy(); },
      'Lifetime achievement goals.'
    );
    renderList('family-legacy-list', familyLegacy, f =>
      `<div class="data-row" data-id="${f.id}"><div class="data-main"><strong>${esc(f.title)}</strong>
        <div class="hint">${esc(f.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { familyLegacy = familyLegacy.filter(x => x.id !== id); save(K.familyLegacy, familyLegacy); renderLegacy(); },
      'Family legacy planning.'
    );
    renderList('life-milestones-list', lifeMilestones, m =>
      `<div class="data-row" data-id="${m.id}"><div class="data-main"><strong>${esc(m.title)}</strong>
        <div class="hint">${formatDateID(m.date)} · ${esc(m.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { lifeMilestones = lifeMilestones.filter(x => x.id !== id); save(K.lifeMilestones, lifeMilestones); renderLegacy(); },
      'Life milestones.'
    );
    renderList('major-decisions-list', majorDecisions, d =>
      `<div class="data-row" data-id="${d.id}"><div class="data-main"><strong>${esc(d.title)}</strong>
        <div class="hint">${formatDateID(d.date)} · ${esc(d.outcome || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { majorDecisions = majorDecisions.filter(x => x.id !== id); save(K.majorDecisions, majorDecisions); renderLegacy(); },
      'Major life decisions.'
    );
    renderList('personal-history-list', [...personalHistory].reverse().slice(0, 15), h =>
      `<div class="data-row" data-id="${h.id}"><div class="data-main"><strong>${formatDateID(h.date)}</strong>
        <div class="hint">${esc(h.entry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { personalHistory = personalHistory.filter(x => x.id !== id); save(K.personalHistory, personalHistory); renderLegacy(); },
      'Personal history journal.'
    );
    renderList('lessons-list', [...lessonsLearned].reverse().slice(0, 15), l =>
      `<div class="data-row" data-id="${l.id}"><div class="data-main"><strong>${esc(l.title)}</strong>
        <div class="hint">${formatDateID(l.date)} · ${esc(l.lesson || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { lessonsLearned = lessonsLearned.filter(x => x.id !== id); save(K.lessonsLearned, lessonsLearned); renderLegacy(); },
      'Lessons learned.'
    );
    renderList('life-impact-list', lifeImpact, i =>
      `<div class="data-row" data-id="${i.id}"><div class="data-main"><strong>${esc(i.title)}</strong>
        <div class="hint">${esc(i.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { lifeImpact = lifeImpact.filter(x => x.id !== id); save(K.lifeImpact, lifeImpact); renderLegacy(); },
      'Life impact tracker / contribution to society.'
    );
    renderList('philanthropy-list', philanthropy, p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${esc(p.title)}</strong>
        <div class="hint">${formatDateID(p.date)} · ${esc(p.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { philanthropy = philanthropy.filter(x => x.id !== id); save(K.philanthropy, philanthropy); renderLegacy(); },
      'Philanthropy tracker.'
    );
    renderList('lifetime-bucket-list', lifetimeBucket, b =>
      `<div class="data-row" data-id="${b.id}"><div class="data-main"><strong>${esc(b.title)}</strong>
        <div class="hint">${b.done ? '✓' : 'open'}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${b.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { lifetimeBucket = lifetimeBucket.filter(x => x.id !== id); save(K.lifetimeBucket, lifetimeBucket); renderLegacy(); },
      'Lifetime bucket list.',
      (id, act) => {
        if (act === 'toggle') {
          const b = lifetimeBucket.find(x => x.id === id);
          if (b) { b.done = !b.done; save(K.lifetimeBucket, lifetimeBucket); renderLegacy(); }
        }
      }
    );
  }

  function bind(id, fn) {
    const el = document.getElementById(id);
    if (el && !el.dataset.wired) { el.dataset.wired = '1'; el.addEventListener('click', fn); }
  }

  function wire() {
    // Digital
    bind('btn-add-ai-tool', () => { const name = prompt('AI tool name:'); if (!name) return; aiTools.push({ id: uid(), name, use: prompt('Use case:') || '' }); save(K.aiTools, aiTools); renderDigital(); });
    bind('btn-add-ai-learning', () => { const title = prompt('What did you learn about AI?'); if (!title) return; aiLearning.push({ id: uid(), title, date: todayStr(), notes: prompt('Notes:') || '' }); save(K.aiLearning, aiLearning); renderDigital(); });
    bind('btn-add-digi-skill', () => { const name = prompt('Digital skill:'); if (!name) return; digiSkills.push({ id: uid(), name, progress: Number(prompt('Progress %:', '0')) || 0, notes: '' }); save(K.digiSkills, digiSkills); renderDigital(); });
    bind('btn-add-software', () => { const name = prompt('Software/tool:'); if (!name) return; software.push({ id: uid(), name, category: prompt('Category:') || '', notes: '' }); save(K.software, software); renderDigital(); });
    bind('btn-add-automation', () => { const title = prompt('Automation idea:'); if (!title) return; automation.push({ id: uid(), title, status: 'idea', notes: prompt('Details:') || '' }); save(K.automation, automation); renderDigital(); });
    bind('btn-add-digi-prod', () => { const title = prompt('Productivity system/note:'); if (!title) return; digiProductivity.push({ id: uid(), title, notes: prompt('Details:') || '' }); save(K.digiProductivity, digiProductivity); renderDigital(); });
    bind('btn-add-digi-asset', () => { const name = prompt('Digital asset:'); if (!name) return; digiAssets.push({ id: uid(), name, type: prompt('Type:') || '', notes: '' }); save(K.digiAssets, digiAssets); renderDigital(); });
    bind('btn-add-website', () => { const name = prompt('Site name:'); if (!name) return; websites.push({ id: uid(), name, url: prompt('URL:') || '', notes: '' }); save(K.websites, websites); renderDigital(); });
    bind('btn-add-tech-project', () => { const name = prompt('Project:'); if (!name) return; techProjects.push({ id: uid(), name, status: 'active', notes: prompt('Notes:') || '' }); save(K.techProjects, techProjects); renderDigital(); });
    bind('btn-add-digi-portfolio', () => { const title = prompt('Portfolio item:'); if (!title) return; digiPortfolio.push({ id: uid(), title, link: prompt('Link:') || '', notes: '' }); save(K.digiPortfolio, digiPortfolio); renderDigital(); });
    bind('btn-add-online-presence', () => { const platform = prompt('Platform:'); if (!platform) return; onlinePresence.push({ id: uid(), platform, handle: prompt('Handle/URL:') || '', notes: '' }); save(K.onlinePresence, onlinePresence); renderDigital(); });

    // Brand
    bind('btn-edit-brand-strategy', () => { const t = prompt('Personal branding strategy:', brandStrategy.text || ''); if (t !== null) { brandStrategy = { text: t }; save(K.brandStrategy, brandStrategy); renderBrand(); } });
    bind('btn-edit-brand-identity', () => { const t = prompt('Brand identity (voice, visuals, values):', brandIdentity.text || ''); if (t !== null) { brandIdentity = { text: t }; save(K.brandIdentity, brandIdentity); renderBrand(); } });
    bind('btn-edit-positioning', () => { const t = prompt('Personal positioning statement:', positioning.text || ''); if (t !== null) { positioning = { text: t }; save(K.positioning, positioning); renderBrand(); } });
    bind('btn-add-content-plan', () => { const title = prompt('Content pillar/idea:'); if (!title) return; contentPlan.push({ id: uid(), title, pillar: prompt('Pillar:') || '', notes: '' }); save(K.contentPlan, contentPlan); renderBrand(); });
    bind('btn-add-content-schedule', () => { const title = prompt('Content to publish:'); if (!title) return; contentSchedule.push({ id: uid(), title, date: prompt('Date YYYY-MM-DD:', todayStr()) || todayStr(), done: false }); save(K.contentSchedule, contentSchedule); renderBrand(); });
    bind('btn-add-social-media', () => { const platform = prompt('Platform:'); if (!platform) return; socialMedia.push({ id: uid(), platform, handle: prompt('Handle:') || '', focus: prompt('Content focus:') || '' }); save(K.socialMedia, socialMedia); renderBrand(); });
    bind('btn-add-pro-portfolio', () => { const title = prompt('Portfolio piece:'); if (!title) return; proPortfolio.push({ id: uid(), title, link: prompt('Link:') || '', notes: '' }); save(K.proPortfolio, proPortfolio); renderBrand(); });
    bind('btn-add-reputation', () => { const entry = prompt('Reputation note / mention:'); if (!entry) return; reputation.push({ id: uid(), date: todayStr(), entry }); save(K.reputation, reputation); renderBrand(); });
    bind('btn-add-achievement', () => { const title = prompt('Achievement:'); if (!title) return; achievements.push({ id: uid(), title, date: todayStr(), notes: prompt('Notes:') || '' }); save(K.achievements, achievements); renderBrand(); });
    bind('btn-add-public-image', () => { const title = prompt('Public image goal/action:'); if (!title) return; publicImage.push({ id: uid(), title, notes: prompt('Notes:') || '' }); save(K.publicImage, publicImage); renderBrand(); });
    bind('btn-add-audience', () => { const platform = prompt('Platform:'); if (!platform) return; audienceGrowth.push({ id: uid(), platform, date: todayStr(), count: prompt('Follower/sub count:') || '0' }); save(K.audienceGrowth, audienceGrowth); renderBrand(); });
    bind('btn-add-brand-milestone', () => { const title = prompt('Brand milestone:'); if (!title) return; brandMilestones.push({ id: uid(), title, done: false }); save(K.brandMilestones, brandMilestones); renderBrand(); });

    // Adventure
    bind('btn-add-bucket', () => { const title = prompt('Bucket list item:'); if (!title) return; bucketList.push({ id: uid(), title, notes: prompt('Notes:') || '', done: false }); save(K.bucketList, bucketList); renderAdventure(); });
    bind('btn-add-travel-goal', () => { const destination = prompt('Destination:'); if (!destination) return; travelGoals.push({ id: uid(), destination, notes: '', done: false }); save(K.travelGoals, travelGoals); renderAdventure(); });
    bind('btn-add-adventure', () => { const title = prompt('Adventure:'); if (!title) return; adventures.push({ id: uid(), title, date: prompt('Date YYYY-MM-DD:', todayStr()) || todayStr(), notes: '' }); save(K.adventures, adventures); renderAdventure(); });
    bind('btn-add-experience', () => { const title = prompt('New experience:'); if (!title) return; experiences.push({ id: uid(), title, date: todayStr(), notes: prompt('How was it?') || '' }); save(K.experiences, experiences); renderAdventure(); });
    bind('btn-add-adv-challenge', async () => {
      const values = await window.HVOSDialogs?.form('Adventure Challenge', [
        { name: 'title', label: 'Nama challenge', required: true },
        { name: 'notes', label: 'Catatan', type: 'textarea' }
      ]);
      if (!values || !values.title.trim()) return;
      challenges.push({ id: uid(), title: values.title.trim(), notes: values.notes || '', done: false });
      save(K.challenges, challenges); renderAdventure();
    });
    bind('btn-add-outdoor', () => { const title = prompt('Outdoor activity:'); if (!title) return; outdoor.push({ id: uid(), title, date: todayStr(), notes: '' }); save(K.outdoor, outdoor); renderAdventure(); });
    bind('btn-add-hobby', () => { const name = prompt('Hobby:'); if (!name) return; hobbies.push({ id: uid(), name, level: prompt('Level:') || 'beginner', notes: '' }); save(K.hobbies, hobbies); renderAdventure(); });
    bind('btn-add-cultural', () => { const title = prompt('Cultural experience:'); if (!title) return; cultural.push({ id: uid(), title, date: todayStr(), notes: '' }); save(K.cultural, cultural); renderAdventure(); });
    bind('btn-add-exp-journal', () => { const entry = prompt('Experience journal entry:'); if (!entry) return; expJournal.push({ id: uid(), date: todayStr(), entry }); save(K.expJournal, expJournal); renderAdventure(); });
    bind('btn-add-annual-adventure', () => { const title = prompt('Annual adventure goal:'); if (!title) return; annualAdventure.push({ id: uid(), title, year: prompt('Year:', String(new Date().getFullYear())) || '', done: false }); save(K.annualAdventure, annualAdventure); renderAdventure(); });
    bind('btn-add-achievement-archive', () => { const title = prompt('Achievement:'); if (!title) return; achievementArchive.push({ id: uid(), title, date: todayStr(), notes: '' }); save(K.achievementArchive, achievementArchive); renderAdventure(); });
    bind('btn-add-dream-dest', () => { const place = prompt('Dream destination:'); if (!place) return; dreamDest.push({ id: uid(), place, notes: prompt('Why?') || '' }); save(K.dreamDest, dreamDest); renderAdventure(); });

    // Security
    bind('btn-edit-emergency-plan', () => { const t = prompt('Personal emergency plan:', emergencyPlan.text || ''); if (t !== null) { emergencyPlan = { text: t }; save(K.emergencyPlan, emergencyPlan); renderSecurity(); } });
    bind('btn-add-emergency-contact', () => { const name = prompt('Name:'); if (!name) return; emergencyContacts.push({ id: uid(), name, relation: prompt('Relation:') || '', phone: prompt('Phone:') || '' }); save(K.emergencyContacts, emergencyContacts); renderSecurity(); });
    bind('btn-add-doc-record', () => { const title = prompt('Document:'); if (!title) return; docRecords.push({ id: uid(), title, location: prompt('Where stored:') || '', expiry: prompt('Expiry YYYY-MM-DD:') || '' }); save(K.docRecords, docRecords); renderSecurity(); });
    bind('btn-add-insurance', () => { const type = prompt('Insurance type:'); if (!type) return; insurance.push({ id: uid(), type, provider: prompt('Provider:') || '', expiry: prompt('Expiry YYYY-MM-DD:') || '' }); save(K.insurance, insurance); renderSecurity(); });
    bind('btn-add-password-ref', () => { const account = prompt('Account (NO password):'); if (!account) return; passwordRefs.push({ id: uid(), account, manager: prompt('Password manager used:') || '', notes: prompt('Hint only:') || '' }); save(K.passwordRefs, passwordRefs); renderSecurity(); });
    bind('btn-add-backup', () => { const what = prompt('What to backup:'); if (!what) return; backups.push({ id: uid(), what, interval: Number(prompt('Every N days:', '7')) || 7, lastBackup: '' }); save(K.backups, backups); renderSecurity(); });
    bind('btn-add-risk-assessment', () => { const title = prompt('Risk:'); if (!title) return; riskAssessment.push({ id: uid(), title, level: Number(prompt('Level 1-5:', '3')) || 3, mitigation: prompt('Mitigation:') || '' }); save(K.riskAssessment, riskAssessment); renderSecurity(); });
    bind('btn-add-property-protect', () => { const title = prompt('Protection item:'); if (!title) return; propertyProtect.push({ id: uid(), title, notes: prompt('Notes:') || '' }); save(K.propertyProtect, propertyProtect); renderSecurity(); });
    bind('btn-add-disaster-prep', () => { const title = prompt('Prep item:'); if (!title) return; disasterPrep.push({ id: uid(), title, notes: '', done: false }); save(K.disasterPrep, disasterPrep); renderSecurity(); });

    // Legacy
    bind('btn-edit-legacy-statement', () => { const t = prompt('Personal legacy statement:', legacyStatement.text || ''); if (t !== null) { legacyStatement = { text: t }; save(K.legacyStatement, legacyStatement); renderLegacy(); } });
    bind('btn-add-lifetime-goal', () => { const title = prompt('Lifetime goal:'); if (!title) return; lifetimeGoals.push({ id: uid(), title, progress: Number(prompt('Progress %:', '0')) || 0, notes: '' }); save(K.lifetimeGoals, lifetimeGoals); renderLegacy(); });
    bind('btn-add-family-legacy', () => { const title = prompt('Family legacy item:'); if (!title) return; familyLegacy.push({ id: uid(), title, notes: prompt('Details:') || '' }); save(K.familyLegacy, familyLegacy); renderLegacy(); });
    bind('btn-add-life-milestone', () => { const title = prompt('Life milestone:'); if (!title) return; lifeMilestones.push({ id: uid(), title, date: prompt('Date YYYY-MM-DD:', todayStr()) || todayStr(), notes: '' }); save(K.lifeMilestones, lifeMilestones); renderLegacy(); });
    bind('btn-add-major-decision', () => { const title = prompt('Major decision:'); if (!title) return; majorDecisions.push({ id: uid(), title, date: todayStr(), outcome: prompt('Outcome / reasoning:') || '' }); save(K.majorDecisions, majorDecisions); renderLegacy(); });
    bind('btn-add-personal-history', () => { const entry = prompt('History entry:'); if (!entry) return; personalHistory.push({ id: uid(), date: todayStr(), entry }); save(K.personalHistory, personalHistory); renderLegacy(); });
    bind('btn-add-lesson', () => { const title = prompt('Lesson title:'); if (!title) return; lessonsLearned.push({ id: uid(), title, date: todayStr(), lesson: prompt('What you learned:') || '' }); save(K.lessonsLearned, lessonsLearned); renderLegacy(); });
    bind('btn-add-life-impact', () => { const title = prompt('Impact / contribution:'); if (!title) return; lifeImpact.push({ id: uid(), title, notes: prompt('Details:') || '' }); save(K.lifeImpact, lifeImpact); renderLegacy(); });
    bind('btn-add-philanthropy', () => { const title = prompt('Philanthropy act / cause:'); if (!title) return; philanthropy.push({ id: uid(), title, date: todayStr(), notes: prompt('Notes:') || '' }); save(K.philanthropy, philanthropy); renderLegacy(); });
    bind('btn-add-lifetime-bucket', () => { const title = prompt('Lifetime bucket item:'); if (!title) return; lifetimeBucket.push({ id: uid(), title, done: false }); save(K.lifetimeBucket, lifetimeBucket); renderLegacy(); });
  }

  document.addEventListener('DOMContentLoaded', wire);
  setTimeout(wire, 1500);
  setTimeout(wire, 3500);
  setTimeout(wire, 6000);
})();
