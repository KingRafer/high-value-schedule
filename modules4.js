/* HVOS Modules 4: Strategic Planning, Entrepreneurship, Lifestyle */
(function () {
  const K = {
    vision1y: 'hvos_vision_1y',
    vision3y: 'hvos_vision_3y',
    vision5y: 'hvos_vision_5y',
    vision10y: 'hvos_vision_10y',
    longGoals: 'hvos_long_goals',
    lifeStrategy: 'hvos_life_strategy',
    opportunities: 'hvos_opportunities',
    risks: 'hvos_risks',
    scenarios: 'hvos_scenarios',
    decisionAnalysis: 'hvos_decision_analysis',
    visionBoard: 'hvos_vision_board',
    lifeProgress: 'hvos_life_progress',
    startups: 'hvos_startups',
    businessModels: 'hvos_business_models',
    marketResearch: 'hvos_market_research',
    competitors: 'hvos_competitors',
    products: 'hvos_products',
    marketing: 'hvos_marketing',
    salesPipeline: 'hvos_sales_pipeline',
    customers: 'hvos_customers',
    growthStrategy: 'hvos_growth_strategy',
    passiveIncome: 'hvos_passive_income',
    businessMetrics: 'hvos_business_metrics',
    wealthMilestones: 'hvos_wealth_milestones',
    lifeAdmin: 'hvos_life_admin',
    personalTasks: 'hvos_personal_tasks',
    homeTasks: 'hvos_home_tasks',
    household: 'hvos_household',
    shopping: 'hvos_shopping',
    travel: 'hvos_travel',
    documents: 'hvos_documents',
    subscriptions: 'hvos_subscriptions',
    declutter: 'hvos_declutter',
    inventory: 'hvos_inventory',
    vehicle: 'hvos_vehicle',
    lifeReminders: 'hvos_life_reminders',
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
  function formatRp(n) {
    const num = Number(n) || 0;
    return (num < 0 ? '-Rp ' : 'Rp ') + new Intl.NumberFormat('id-ID').format(Math.abs(num));
  }

  let vision1y = load(K.vision1y, { text: '' });
  let vision3y = load(K.vision3y, { text: '' });
  let vision5y = load(K.vision5y, { text: '' });
  let vision10y = load(K.vision10y, { text: '' });
  let longGoals = load(K.longGoals, []);
  let lifeStrategy = load(K.lifeStrategy, []);
  let opportunities = load(K.opportunities, []);
  let risks = load(K.risks, []);
  let scenarios = load(K.scenarios, []);
  let decisionAnalysis = load(K.decisionAnalysis, []);
  let visionBoard = load(K.visionBoard, []);
  let lifeProgress = load(K.lifeProgress, []);

  let startups = load(K.startups, []);
  let businessModels = load(K.businessModels, []);
  let marketResearch = load(K.marketResearch, []);
  let competitors = load(K.competitors, []);
  let products = load(K.products, []);
  let marketing = load(K.marketing, []);
  let salesPipeline = load(K.salesPipeline, []);
  let customers = load(K.customers, []);
  let growthStrategy = load(K.growthStrategy, []);
  let passiveIncome = load(K.passiveIncome, []);
  let businessMetrics = load(K.businessMetrics, []);
  let wealthMilestones = load(K.wealthMilestones, []);

  let lifeAdmin = load(K.lifeAdmin, []);
  let personalTasks = load(K.personalTasks, []);
  let homeTasks = load(K.homeTasks, []);
  let household = load(K.household, []);
  let shopping = load(K.shopping, []);
  let travel = load(K.travel, []);
  let documents = load(K.documents, []);
  let subscriptions = load(K.subscriptions, []);
  let declutter = load(K.declutter, []);
  let inventory = load(K.inventory, []);
  let vehicle = load(K.vehicle, []);
  let lifeReminders = load(K.lifeReminders, []);

  window.HVOSModules = window.HVOSModules || {};
  Object.assign(window.HVOSModules, {
    renderStrategic,
    renderEntrepreneur,
    renderLifestyle,
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

  function setVisionBox(id, data) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = data.text
      ? '<p style="line-height:1.55;white-space:pre-wrap">' + esc(data.text) + '</p>'
      : '<p class="empty-hint">Belum diisi. Klik Edit.</p>';
  }

  // ========== STRATEGIC ==========
  function renderStrategic() {
    setText('strat-goals', longGoals.length);
    setText('strat-ops', opportunities.filter(o => o.status !== 'closed').length);
    setText('strat-risks', risks.filter(r => r.status !== 'mitigated').length);
    setText('strat-progress', lifeProgress.length);

    setVisionBox('vision-1y', vision1y);
    setVisionBox('vision-3y', vision3y);
    setVisionBox('vision-5y', vision5y);
    setVisionBox('vision-10y', vision10y);

    renderList('long-goals-list', longGoals, g =>
      `<div class="data-row" data-id="${g.id}"><div class="data-main"><strong>${esc(g.title)}</strong>
        <div class="hint">Horizon: ${esc(g.horizon || 'long')} · ${g.progress || 0}%</div>
        <div class="goal-progress-bar" style="margin-top:0.3rem"><div class="goal-progress-fill" style="width:${g.progress || 0}%"></div></div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { longGoals = longGoals.filter(x => x.id !== id); save(K.longGoals, longGoals); renderStrategic(); },
      'Long-term goal planner kosong.'
    );

    renderList('life-strategy-list', lifeStrategy, s =>
      `<div class="data-row" data-id="${s.id}"><div class="data-main"><strong>${esc(s.title)}</strong>
        <div class="hint">${esc(s.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { lifeStrategy = lifeStrategy.filter(x => x.id !== id); save(K.lifeStrategy, lifeStrategy); renderStrategic(); },
      'Life strategy notes.'
    );

    renderList('opportunity-list', opportunities, o =>
      `<div class="data-row" data-id="${o.id}"><div class="data-main"><span class="tag tag-focus">${esc(o.status || 'open')}</span>
        <strong>${esc(o.title)}</strong><div class="hint">${esc(o.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { opportunities = opportunities.filter(x => x.id !== id); save(K.opportunities, opportunities); renderStrategic(); },
      'Opportunity tracker kosong.'
    );

    renderList('risk-list', risks, r =>
      `<div class="data-row" data-id="${r.id}"><div class="data-main"><strong>${esc(r.title)}</strong>
        <div class="hint">Impact ${r.impact || '—'}/5 · Likelihood ${r.likelihood || '—'}/5 · ${esc(r.mitigation || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { risks = risks.filter(x => x.id !== id); save(K.risks, risks); renderStrategic(); },
      'Risk management log.'
    );

    renderList('scenario-list', scenarios, s =>
      `<div class="data-row" data-id="${s.id}"><div class="data-main"><strong>${esc(s.title)}</strong>
        <div class="hint">${esc(s.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { scenarios = scenarios.filter(x => x.id !== id); save(K.scenarios, scenarios); renderStrategic(); },
      'Scenario planning.'
    );

    renderList('decision-analysis-list', [...decisionAnalysis].reverse().slice(0, 12), d =>
      `<div class="data-row" data-id="${d.id}"><div class="data-main"><strong>${esc(d.title)}</strong>
        <div class="hint">${formatDateID(d.date)} · ${esc(d.analysis || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { decisionAnalysis = decisionAnalysis.filter(x => x.id !== id); save(K.decisionAnalysis, decisionAnalysis); renderStrategic(); },
      'Decision analysis journal.'
    );

    renderList('vision-board-list', visionBoard, v =>
      `<div class="data-row" data-id="${v.id}"><div class="data-main"><strong>${esc(v.title)}</strong>
        <div class="hint">${esc(v.category || 'vision')} · ${esc(v.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { visionBoard = visionBoard.filter(x => x.id !== id); save(K.visionBoard, visionBoard); renderStrategic(); },
      'Vision board items.'
    );

    renderList('life-progress-list', [...lifeProgress].reverse().slice(0, 15), p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${formatDateID(p.date)}</strong>
        <div class="hint">${esc(p.entry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { lifeProgress = lifeProgress.filter(x => x.id !== id); save(K.lifeProgress, lifeProgress); renderStrategic(); },
      'Life progress tracker — catat milestone hidup.'
    );
  }

  // ========== ENTREPRENEUR ==========
  function renderEntrepreneur() {
    const openDeals = salesPipeline.filter(s => s.stage !== 'won' && s.stage !== 'lost').length;
    setText('ent-startups', startups.filter(s => s.status !== 'closed').length);
    setText('ent-pipeline', openDeals);
    setText('ent-passive', passiveIncome.length);
    setText('ent-milestones', wealthMilestones.filter(m => m.done).length);

    renderList('startup-list', startups, s =>
      `<div class="data-row" data-id="${s.id}"><div class="data-main"><span class="tag tag-focus">${esc(s.status || 'idea')}</span>
        <strong>${esc(s.name)}</strong><div class="hint">${esc(s.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { startups = startups.filter(x => x.id !== id); save(K.startups, startups); renderEntrepreneur(); },
      'Startup idea management.'
    );

    renderList('bmc-list', businessModels, b =>
      `<div class="data-row" data-id="${b.id}"><div class="data-main"><strong>${esc(b.name)}</strong>
        <div class="hint">${esc(b.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { businessModels = businessModels.filter(x => x.id !== id); save(K.businessModels, businessModels); renderEntrepreneur(); },
      'Business model canvas notes.'
    );

    renderList('market-research-list', marketResearch, m =>
      `<div class="data-row" data-id="${m.id}"><div class="data-main"><strong>${esc(m.title)}</strong>
        <div class="hint">${formatDateID(m.date)} · ${esc(m.findings || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { marketResearch = marketResearch.filter(x => x.id !== id); save(K.marketResearch, marketResearch); renderEntrepreneur(); },
      'Market research log.'
    );

    renderList('competitor-list', competitors, c =>
      `<div class="data-row" data-id="${c.id}"><div class="data-main"><strong>${esc(c.name)}</strong>
        <div class="hint">${esc(c.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { competitors = competitors.filter(x => x.id !== id); save(K.competitors, competitors); renderEntrepreneur(); },
      'Competitor analysis.'
    );

    renderList('product-list', products, p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${esc(p.name)}</strong>
        <div class="hint">Stage: ${esc(p.stage || 'idea')} · ${esc(p.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { products = products.filter(x => x.id !== id); save(K.products, products); renderEntrepreneur(); },
      'Product development tracker.'
    );

    renderList('marketing-list', marketing, m =>
      `<div class="data-row" data-id="${m.id}"><div class="data-main"><strong>${esc(m.title)}</strong>
        <div class="hint">${esc(m.channel || '')} · ${esc(m.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { marketing = marketing.filter(x => x.id !== id); save(K.marketing, marketing); renderEntrepreneur(); },
      'Marketing strategy.'
    );

    renderList('sales-pipeline-list', salesPipeline, s =>
      `<div class="data-row" data-id="${s.id}"><div class="data-main"><span class="tag tag-${s.stage === 'won' ? 'health' : 'focus'}">${esc(s.stage || 'lead')}</span>
        <strong>${esc(s.name)}</strong><div class="hint">${formatRp(s.value)} · ${esc(s.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { salesPipeline = salesPipeline.filter(x => x.id !== id); save(K.salesPipeline, salesPipeline); renderEntrepreneur(); },
      'Sales pipeline kosong.'
    );

    renderList('customer-list', customers, c =>
      `<div class="data-row" data-id="${c.id}"><div class="data-main"><strong>${esc(c.name)}</strong>
        <div class="hint">${esc(c.status || 'active')} · last ${formatDateID(c.lastContact)}</div></div>
        <button class="btn btn-sm btn-outline" data-act="touch">Contacted</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { customers = customers.filter(x => x.id !== id); save(K.customers, customers); renderEntrepreneur(); },
      'Customer relationship management.',
      (id, act) => {
        if (act === 'touch') {
          const c = customers.find(x => x.id === id);
          if (c) { c.lastContact = todayStr(); save(K.customers, customers); renderEntrepreneur(); }
        }
      }
    );

    renderList('growth-list', growthStrategy, g =>
      `<div class="data-row" data-id="${g.id}"><div class="data-main"><strong>${esc(g.title)}</strong>
        <div class="hint">${esc(g.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { growthStrategy = growthStrategy.filter(x => x.id !== id); save(K.growthStrategy, growthStrategy); renderEntrepreneur(); },
      'Business growth strategy.'
    );

    renderList('passive-list', passiveIncome, p =>
      `<div class="data-row" data-id="${p.id}"><div class="data-main"><strong>${esc(p.title)}</strong>
        <div class="hint">${formatRp(p.monthly)} / bln · ${esc(p.status || 'idea')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { passiveIncome = passiveIncome.filter(x => x.id !== id); save(K.passiveIncome, passiveIncome); renderEntrepreneur(); },
      'Passive income projects.'
    );

    renderList('biz-metrics-list', [...businessMetrics].reverse().slice(0, 12), m =>
      `<div class="data-row" data-id="${m.id}"><div class="data-main"><strong>${esc(m.metric)}</strong>
        <div class="hint">${formatDateID(m.date)} · ${esc(String(m.value))} · ${esc(m.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { businessMetrics = businessMetrics.filter(x => x.id !== id); save(K.businessMetrics, businessMetrics); renderEntrepreneur(); },
      'Business performance analytics.'
    );

    renderList('wealth-milestone-list', wealthMilestones, m =>
      `<div class="data-row" data-id="${m.id}"><div class="data-main"><strong>${esc(m.title)}</strong>
        <div class="hint">${m.done ? '✓' : 'Open'} · target ${formatRp(m.target)}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${m.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { wealthMilestones = wealthMilestones.filter(x => x.id !== id); save(K.wealthMilestones, wealthMilestones); renderEntrepreneur(); },
      'Wealth creation milestones.',
      (id, act) => {
        if (act === 'toggle') {
          const m = wealthMilestones.find(x => x.id === id);
          if (m) { m.done = !m.done; save(K.wealthMilestones, wealthMilestones); renderEntrepreneur(); }
        }
      }
    );
  }

  // ========== LIFESTYLE ==========
  function renderLifestyle() {
    setText('life-tasks', personalTasks.filter(t => !t.done).length);
    setText('life-shop', shopping.filter(s => !s.done).length);
    setText('life-subs', subscriptions.length);
    setText('life-reminders', lifeReminders.filter(r => !r.done).length);

    renderList('life-admin-list', lifeAdmin, a =>
      `<div class="data-row" data-id="${a.id}"><div class="data-main"><strong>${esc(a.title)}</strong>
        <div class="hint">${esc(a.category || 'admin')} · ${esc(a.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { lifeAdmin = lifeAdmin.filter(x => x.id !== id); save(K.lifeAdmin, lifeAdmin); renderLifestyle(); },
      'Daily life administration.'
    );

    renderList('personal-task-list', personalTasks, t =>
      `<div class="data-row" data-id="${t.id}"><div class="data-main"><strong>${esc(t.title)}</strong>
        <div class="hint">${t.done ? '✓' : 'Open'} · ${formatDateID(t.date)}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${t.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { personalTasks = personalTasks.filter(x => x.id !== id); save(K.personalTasks, personalTasks); renderLifestyle(); },
      'Personal task manager.',
      (id, act) => {
        if (act === 'toggle') {
          const t = personalTasks.find(x => x.id === id);
          if (t) { t.done = !t.done; save(K.personalTasks, personalTasks); renderLifestyle(); }
        }
      }
    );

    renderList('home-task-list', homeTasks, t =>
      `<div class="data-row" data-id="${t.id}"><div class="data-main"><strong>${esc(t.title)}</strong>
        <div class="hint">${t.done ? '✓' : 'Open'}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${t.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { homeTasks = homeTasks.filter(x => x.id !== id); save(K.homeTasks, homeTasks); renderLifestyle(); },
      'Home management tasks.',
      (id, act) => {
        if (act === 'toggle') {
          const t = homeTasks.find(x => x.id === id);
          if (t) { t.done = !t.done; save(K.homeTasks, homeTasks); renderLifestyle(); }
        }
      }
    );

    renderList('household-list', household, h =>
      `<div class="data-row" data-id="${h.id}"><div class="data-main"><strong>${esc(h.title)}</strong>
        <div class="hint">Last: ${formatDateID(h.lastDone)} · every ${h.interval || '?'} days</div></div>
        <button class="btn btn-sm btn-outline" data-act="done">Done today</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { household = household.filter(x => x.id !== id); save(K.household, household); renderLifestyle(); },
      'Household maintenance schedule.',
      (id, act) => {
        if (act === 'done') {
          const h = household.find(x => x.id === id);
          if (h) { h.lastDone = todayStr(); save(K.household, household); renderLifestyle(); }
        }
      }
    );

    renderList('shopping-list', shopping, s =>
      `<div class="data-row" data-id="${s.id}"><div class="data-main"><strong>${esc(s.item)}</strong>
        <div class="hint">${s.done ? '✓ bought' : 'needed'} · ${esc(s.notes || '')}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${s.done ? 'Undo' : 'Bought'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { shopping = shopping.filter(x => x.id !== id); save(K.shopping, shopping); renderLifestyle(); },
      'Personal shopping list.',
      (id, act) => {
        if (act === 'toggle') {
          const s = shopping.find(x => x.id === id);
          if (s) { s.done = !s.done; save(K.shopping, shopping); renderLifestyle(); }
        }
      }
    );

    renderList('travel-list', travel, t =>
      `<div class="data-row" data-id="${t.id}"><div class="data-main"><strong>${esc(t.destination)}</strong>
        <div class="hint">${formatDateID(t.start)} → ${formatDateID(t.end)} · ${esc(t.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { travel = travel.filter(x => x.id !== id); save(K.travel, travel); renderLifestyle(); },
      'Travel planner.'
    );

    renderList('document-list', documents, d =>
      `<div class="data-row" data-id="${d.id}"><div class="data-main"><strong>${esc(d.title)}</strong>
        <div class="hint">${esc(d.category || 'doc')} · loc: ${esc(d.location || '—')} · exp ${formatDateID(d.expiry)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { documents = documents.filter(x => x.id !== id); save(K.documents, documents); renderLifestyle(); },
      'Important document index (nama & lokasi, bukan file).'
    );

    renderList('subscription-list', subscriptions, s =>
      `<div class="data-row" data-id="${s.id}"><div class="data-main"><strong>${esc(s.name)}</strong>
        <div class="hint">${formatRp(s.cost)} / ${esc(s.cycle || 'month')} · next ${formatDateID(s.nextBill)}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { subscriptions = subscriptions.filter(x => x.id !== id); save(K.subscriptions, subscriptions); renderLifestyle(); },
      'Subscription management.'
    );

    renderList('declutter-list', declutter, d =>
      `<div class="data-row" data-id="${d.id}"><div class="data-main"><strong>${esc(d.area)}</strong>
        <div class="hint">${d.done ? '✓' : 'todo'} · ${esc(d.notes || '')}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${d.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { declutter = declutter.filter(x => x.id !== id); save(K.declutter, declutter); renderLifestyle(); },
      'Digital / physical decluttering.',
      (id, act) => {
        if (act === 'toggle') {
          const d = declutter.find(x => x.id === id);
          if (d) { d.done = !d.done; save(K.declutter, declutter); renderLifestyle(); }
        }
      }
    );

    renderList('inventory-list', inventory, i =>
      `<div class="data-row" data-id="${i.id}"><div class="data-main"><strong>${esc(i.name)}</strong>
        <div class="hint">${esc(i.category || '')} · qty ${i.qty || 1} · ${esc(i.notes || '')}</div></div>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { inventory = inventory.filter(x => x.id !== id); save(K.inventory, inventory); renderLifestyle(); },
      'Personal inventory.'
    );

    renderList('vehicle-list', vehicle, v =>
      `<div class="data-row" data-id="${v.id}"><div class="data-main"><strong>${esc(v.title)}</strong>
        <div class="hint">Due ${formatDateID(v.due)} · last ${formatDateID(v.lastDone)}</div></div>
        <button class="btn btn-sm btn-outline" data-act="done">Done</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { vehicle = vehicle.filter(x => x.id !== id); save(K.vehicle, vehicle); renderLifestyle(); },
      'Vehicle maintenance schedule.',
      (id, act) => {
        if (act === 'done') {
          const v = vehicle.find(x => x.id === id);
          if (v) { v.lastDone = todayStr(); save(K.vehicle, vehicle); renderLifestyle(); }
        }
      }
    );

    renderList('life-reminder-list', lifeReminders, r =>
      `<div class="data-row" data-id="${r.id}"><div class="data-main"><strong>${esc(r.title)}</strong>
        <div class="hint">${formatDateID(r.date)} · ${r.done ? '✓' : 'pending'}</div></div>
        <button class="btn btn-sm btn-outline" data-act="toggle">${r.done ? 'Undo' : 'Done'}</button>
        <button class="btn-icon" data-act="del">✕</button></div>`,
      id => { lifeReminders = lifeReminders.filter(x => x.id !== id); save(K.lifeReminders, lifeReminders); renderLifestyle(); },
      'Life administration reminders.',
      (id, act) => {
        if (act === 'toggle') {
          const r = lifeReminders.find(x => x.id === id);
          if (r) { r.done = !r.done; save(K.lifeReminders, lifeReminders); renderLifestyle(); }
        }
      }
    );
  }

  function bind(id, fn) {
    const el = document.getElementById(id);
    if (el && !el.dataset.wired) { el.dataset.wired = '1'; el.addEventListener('click', fn); }
  }

  function wire() {
    // Strategic visions
    bind('btn-edit-vision-1y', () => {
      const t = prompt('1-year vision:', vision1y.text || '');
      if (t !== null) { vision1y = { text: t }; save(K.vision1y, vision1y); renderStrategic(); }
    });
    bind('btn-edit-vision-3y', () => {
      const t = prompt('3-year vision:', vision3y.text || '');
      if (t !== null) { vision3y = { text: t }; save(K.vision3y, vision3y); renderStrategic(); }
    });
    bind('btn-edit-vision-5y', () => {
      const t = prompt('5-year vision:', vision5y.text || '');
      if (t !== null) { vision5y = { text: t }; save(K.vision5y, vision5y); renderStrategic(); }
    });
    bind('btn-edit-vision-10y', () => {
      const t = prompt('10-year vision:', vision10y.text || '');
      if (t !== null) { vision10y = { text: t }; save(K.vision10y, vision10y); renderStrategic(); }
    });
    bind('btn-add-long-goal', () => {
      const title = prompt('Long-term goal:');
      if (!title) return;
      longGoals.push({ id: uid(), title, horizon: prompt('Horizon (1y/3y/5y/10y):', '3y') || '3y', progress: Number(prompt('Progress %:', '0')) || 0 });
      save(K.longGoals, longGoals); renderStrategic();
    });
    bind('btn-add-life-strategy', () => {
      const title = prompt('Strategy pillar / note:');
      if (!title) return;
      lifeStrategy.push({ id: uid(), title, notes: prompt('Details:') || '' });
      save(K.lifeStrategy, lifeStrategy); renderStrategic();
    });
    bind('btn-add-opportunity', () => {
      const title = prompt('Opportunity:');
      if (!title) return;
      opportunities.push({ id: uid(), title, status: 'open', notes: prompt('Notes:') || '' });
      save(K.opportunities, opportunities); renderStrategic();
    });
    bind('btn-add-risk', () => {
      const title = prompt('Risk:');
      if (!title) return;
      risks.push({ id: uid(), title, impact: Number(prompt('Impact 1-5:', '3')) || 3, likelihood: Number(prompt('Likelihood 1-5:', '3')) || 3, mitigation: prompt('Mitigation:') || '', status: 'open' });
      save(K.risks, risks); renderStrategic();
    });
    bind('btn-add-scenario', () => {
      const title = prompt('Scenario name:');
      if (!title) return;
      scenarios.push({ id: uid(), title, notes: prompt('What if / plan:') || '' });
      save(K.scenarios, scenarios); renderStrategic();
    });
    bind('btn-add-decision-analysis', () => {
      const title = prompt('Decision:');
      if (!title) return;
      decisionAnalysis.push({ id: uid(), title, date: todayStr(), analysis: prompt('Pros/cons / analysis:') || '' });
      save(K.decisionAnalysis, decisionAnalysis); renderStrategic();
    });
    bind('btn-add-vision-board', () => {
      const title = prompt('Vision board item:');
      if (!title) return;
      visionBoard.push({ id: uid(), title, category: prompt('Category:') || 'vision', notes: '' });
      save(K.visionBoard, visionBoard); renderStrategic();
    });
    bind('btn-add-life-progress', () => {
      const entry = prompt('Life progress note:');
      if (!entry) return;
      lifeProgress.push({ id: uid(), date: todayStr(), entry });
      save(K.lifeProgress, lifeProgress); renderStrategic();
    });

    // Entrepreneur
    bind('btn-add-startup', () => {
      const name = prompt('Startup / idea name:');
      if (!name) return;
      startups.push({ id: uid(), name, status: prompt('Status (idea/validating/building/live):', 'idea') || 'idea', notes: prompt('Notes:') || '' });
      save(K.startups, startups); renderEntrepreneur();
    });
    bind('btn-add-bmc', () => {
      const name = prompt('Business / BMC name:');
      if (!name) return;
      businessModels.push({ id: uid(), name, notes: prompt('Key partners, value prop, channels, revenue...') || '' });
      save(K.businessModels, businessModels); renderEntrepreneur();
    });
    bind('btn-add-market-research', () => {
      const title = prompt('Research title:');
      if (!title) return;
      marketResearch.push({ id: uid(), title, date: todayStr(), findings: prompt('Findings:') || '' });
      save(K.marketResearch, marketResearch); renderEntrepreneur();
    });
    bind('btn-add-competitor', () => {
      const name = prompt('Competitor:');
      if (!name) return;
      competitors.push({ id: uid(), name, notes: prompt('Strengths / weaknesses / pricing:') || '' });
      save(K.competitors, competitors); renderEntrepreneur();
    });
    bind('btn-add-product', () => {
      const name = prompt('Product / feature:');
      if (!name) return;
      products.push({ id: uid(), name, stage: prompt('Stage (idea/mvp/beta/live):', 'idea') || 'idea', notes: '' });
      save(K.products, products); renderEntrepreneur();
    });
    bind('btn-add-marketing', () => {
      const title = prompt('Campaign / strategy:');
      if (!title) return;
      marketing.push({ id: uid(), title, channel: prompt('Channel:') || '', notes: prompt('Plan:') || '' });
      save(K.marketing, marketing); renderEntrepreneur();
    });
    bind('btn-add-deal', () => {
      const name = prompt('Deal / lead name:');
      if (!name) return;
      salesPipeline.push({ id: uid(), name, stage: prompt('Stage (lead/qualified/proposal/won/lost):', 'lead') || 'lead', value: Number(prompt('Value Rp:', '0')) || 0, notes: '' });
      save(K.salesPipeline, salesPipeline); renderEntrepreneur();
    });
    bind('btn-add-customer', () => {
      const name = prompt('Customer name:');
      if (!name) return;
      customers.push({ id: uid(), name, status: 'active', lastContact: todayStr() });
      save(K.customers, customers); renderEntrepreneur();
    });
    bind('btn-add-growth', () => {
      const title = prompt('Growth initiative:');
      if (!title) return;
      growthStrategy.push({ id: uid(), title, notes: prompt('Details:') || '' });
      save(K.growthStrategy, growthStrategy); renderEntrepreneur();
    });
    bind('btn-add-passive', () => {
      const title = prompt('Passive income project:');
      if (!title) return;
      passiveIncome.push({ id: uid(), title, monthly: Number(prompt('Est. monthly Rp:', '0')) || 0, status: prompt('Status:', 'idea') || 'idea' });
      save(K.passiveIncome, passiveIncome); renderEntrepreneur();
    });
    bind('btn-add-biz-metric', () => {
      const metric = prompt('Metric name (MRR, users, churn...):');
      if (!metric) return;
      businessMetrics.push({ id: uid(), metric, date: todayStr(), value: prompt('Value:') || '', notes: '' });
      save(K.businessMetrics, businessMetrics); renderEntrepreneur();
    });
    bind('btn-add-wealth-milestone', () => {
      const title = prompt('Wealth milestone:');
      if (!title) return;
      wealthMilestones.push({ id: uid(), title, target: Number(prompt('Target Rp:', '0')) || 0, done: false });
      save(K.wealthMilestones, wealthMilestones); renderEntrepreneur();
    });

    // Lifestyle
    bind('btn-add-life-admin', () => {
      const title = prompt('Admin item:');
      if (!title) return;
      lifeAdmin.push({ id: uid(), title, category: prompt('Category:') || 'admin', notes: '' });
      save(K.lifeAdmin, lifeAdmin); renderLifestyle();
    });
    bind('btn-add-personal-task', () => {
      const title = prompt('Task:');
      if (!title) return;
      personalTasks.push({ id: uid(), title, date: todayStr(), done: false });
      save(K.personalTasks, personalTasks); renderLifestyle();
    });
    bind('btn-add-home-task', () => {
      const title = prompt('Home task:');
      if (!title) return;
      homeTasks.push({ id: uid(), title, done: false });
      save(K.homeTasks, homeTasks); renderLifestyle();
    });
    bind('btn-add-household', () => {
      const title = prompt('Maintenance item (AC, filter, cleaning...):');
      if (!title) return;
      household.push({ id: uid(), title, interval: Number(prompt('Every N days:', '30')) || 30, lastDone: '' });
      save(K.household, household); renderLifestyle();
    });
    bind('btn-add-shopping', () => {
      const item = prompt('Item:');
      if (!item) return;
      shopping.push({ id: uid(), item, notes: prompt('Notes:') || '', done: false });
      save(K.shopping, shopping); renderLifestyle();
    });
    bind('btn-add-travel', () => {
      const destination = prompt('Destination:');
      if (!destination) return;
      travel.push({ id: uid(), destination, start: prompt('Start YYYY-MM-DD:', todayStr()) || todayStr(), end: prompt('End YYYY-MM-DD:') || '', notes: prompt('Notes:') || '' });
      save(K.travel, travel); renderLifestyle();
    });
    bind('btn-add-document', () => {
      const title = prompt('Document name (KTP, passport, kontrak...):');
      if (!title) return;
      documents.push({ id: uid(), title, category: prompt('Category:') || 'doc', location: prompt('Where stored:') || '', expiry: prompt('Expiry YYYY-MM-DD (optional):') || '' });
      save(K.documents, documents); renderLifestyle();
    });
    bind('btn-add-subscription', () => {
      const name = prompt('Service name:');
      if (!name) return;
      subscriptions.push({ id: uid(), name, cost: Number(prompt('Cost Rp:', '0')) || 0, cycle: prompt('Cycle (month/year):', 'month') || 'month', nextBill: prompt('Next bill YYYY-MM-DD:') || '' });
      save(K.subscriptions, subscriptions); renderLifestyle();
    });
    bind('btn-add-declutter', () => {
      const area = prompt('Area (email inbox, wardrobe, desk...):');
      if (!area) return;
      declutter.push({ id: uid(), area, notes: '', done: false });
      save(K.declutter, declutter); renderLifestyle();
    });
    bind('btn-add-inventory', () => {
      const name = prompt('Item:');
      if (!name) return;
      inventory.push({ id: uid(), name, category: prompt('Category:') || '', qty: Number(prompt('Qty:', '1')) || 1, notes: '' });
      save(K.inventory, inventory); renderLifestyle();
    });
    bind('btn-add-vehicle', () => {
      const title = prompt('Maintenance (oli, ban, STNK...):');
      if (!title) return;
      vehicle.push({ id: uid(), title, due: prompt('Due YYYY-MM-DD:') || '', lastDone: '' });
      save(K.vehicle, vehicle); renderLifestyle();
    });
    bind('btn-add-life-reminder', () => {
      const title = prompt('Reminder:');
      if (!title) return;
      lifeReminders.push({ id: uid(), title, date: prompt('Date YYYY-MM-DD:', todayStr()) || todayStr(), done: false });
      save(K.lifeReminders, lifeReminders); renderLifestyle();
    });
  }

  document.addEventListener('DOMContentLoaded', wire);
  setTimeout(wire, 1500);
  setTimeout(wire, 4000);
})();
