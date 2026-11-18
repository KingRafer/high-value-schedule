/* HVOS Modules 4 UI injector — nav + sections for Strategic, Entrepreneur, Lifestyle */
(function () {
  function injectUI() {
    const nav = document.querySelector('.sidebar-nav');
    if (nav && !document.querySelector('[data-section="strategic"]')) {
      const timer = nav.querySelector('[data-section="timer"]');
      const frag = document.createDocumentFragment();
      const div = document.createElement('div');
      div.innerHTML = '<div class="nav-divider"></div>' +
        '<a href="#strategic" class="nav-item" data-section="strategic"><span class="nav-icon">◉</span> Strategic</a>' +
        '<a href="#entrepreneur" class="nav-item" data-section="entrepreneur"><span class="nav-icon">⚡</span> Entrepreneur</a>' +
        '<a href="#lifestyle" class="nav-item" data-section="lifestyle"><span class="nav-icon">⌂</span> Lifestyle</a>';
      while (div.firstChild) frag.appendChild(div.firstChild);
      if (timer) nav.insertBefore(frag, timer); else nav.appendChild(frag);
    }

    const main = document.getElementById('main-content') || document.querySelector('main.content');
    if (!main || document.getElementById('strategic')) return;

    main.insertAdjacentHTML('beforeend', `
<section id="strategic" class="section">
  <div class="page-header"><div><h1>Strategic Life Planning</h1><p class="subtitle">Vision, goals, opportunities, risks</p></div></div>
  <div class="stats-row four">
    <div class="stat-card"><span class="stat-label">Long Goals</span><span class="stat-value" id="strat-goals">0</span></div>
    <div class="stat-card"><span class="stat-label">Open Opportunities</span><span class="stat-value" id="strat-ops">0</span></div>
    <div class="stat-card"><span class="stat-label">Active Risks</span><span class="stat-value" id="strat-risks">0</span></div>
    <div class="stat-card"><span class="stat-label">Progress Logs</span><span class="stat-value" id="strat-progress">0</span></div>
  </div>
  <div class="mod-grid">
    <div class="panel"><div class="panel-header"><h2>1-Year Vision</h2><button class="btn btn-sm btn-outline" id="btn-edit-vision-1y">Edit</button></div><div id="vision-1y"></div></div>
    <div class="panel"><div class="panel-header"><h2>3-Year Vision</h2><button class="btn btn-sm btn-outline" id="btn-edit-vision-3y">Edit</button></div><div id="vision-3y"></div></div>
    <div class="panel"><div class="panel-header"><h2>5-Year Vision</h2><button class="btn btn-sm btn-outline" id="btn-edit-vision-5y">Edit</button></div><div id="vision-5y"></div></div>
    <div class="panel"><div class="panel-header"><h2>10-Year Vision</h2><button class="btn btn-sm btn-outline" id="btn-edit-vision-10y">Edit</button></div><div id="vision-10y"></div></div>
    <div class="panel"><div class="panel-header"><h2>Long-term Goals</h2><button class="btn btn-sm btn-outline" id="btn-add-long-goal">+</button></div><div id="long-goals-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Life Strategy</h2><button class="btn btn-sm btn-outline" id="btn-add-life-strategy">+</button></div><div id="life-strategy-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Opportunities</h2><button class="btn btn-sm btn-outline" id="btn-add-opportunity">+</button></div><div id="opportunity-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Risk Management</h2><button class="btn btn-sm btn-outline" id="btn-add-risk">+</button></div><div id="risk-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Scenario Planning</h2><button class="btn btn-sm btn-outline" id="btn-add-scenario">+</button></div><div id="scenario-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Decision Analysis</h2><button class="btn btn-sm btn-outline" id="btn-add-decision-analysis">+</button></div><div id="decision-analysis-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Vision Board</h2><button class="btn btn-sm btn-outline" id="btn-add-vision-board">+</button></div><div id="vision-board-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Life Progress</h2><button class="btn btn-sm btn-outline" id="btn-add-life-progress">+</button></div><div id="life-progress-list"></div></div>
  </div>
</section>
<section id="entrepreneur" class="section">
  <div class="page-header"><div><h1>Entrepreneurship & Wealth Creation</h1><p class="subtitle">Startups, sales, passive income, milestones</p></div></div>
  <div class="stats-row four">
    <div class="stat-card"><span class="stat-label">Active Ideas</span><span class="stat-value" id="ent-startups">0</span></div>
    <div class="stat-card"><span class="stat-label">Open Pipeline</span><span class="stat-value" id="ent-pipeline">0</span></div>
    <div class="stat-card"><span class="stat-label">Passive Projects</span><span class="stat-value" id="ent-passive">0</span></div>
    <div class="stat-card"><span class="stat-label">Milestones Done</span><span class="stat-value" id="ent-milestones">0</span></div>
  </div>
  <div class="mod-grid">
    <div class="panel"><div class="panel-header"><h2>Startup Ideas</h2><button class="btn btn-sm btn-outline" id="btn-add-startup">+</button></div><div id="startup-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Business Model Canvas</h2><button class="btn btn-sm btn-outline" id="btn-add-bmc">+</button></div><div id="bmc-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Market Research</h2><button class="btn btn-sm btn-outline" id="btn-add-market-research">+</button></div><div id="market-research-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Competitors</h2><button class="btn btn-sm btn-outline" id="btn-add-competitor">+</button></div><div id="competitor-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Product Development</h2><button class="btn btn-sm btn-outline" id="btn-add-product">+</button></div><div id="product-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Marketing Strategy</h2><button class="btn btn-sm btn-outline" id="btn-add-marketing">+</button></div><div id="marketing-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Sales Pipeline</h2><button class="btn btn-sm btn-outline" id="btn-add-deal">+</button></div><div id="sales-pipeline-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Customers (CRM)</h2><button class="btn btn-sm btn-outline" id="btn-add-customer">+</button></div><div id="customer-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Growth Strategy</h2><button class="btn btn-sm btn-outline" id="btn-add-growth">+</button></div><div id="growth-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Passive Income</h2><button class="btn btn-sm btn-outline" id="btn-add-passive">+</button></div><div id="passive-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Business Metrics</h2><button class="btn btn-sm btn-outline" id="btn-add-biz-metric">+</button></div><div id="biz-metrics-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Wealth Milestones</h2><button class="btn btn-sm btn-outline" id="btn-add-wealth-milestone">+</button></div><div id="wealth-milestone-list"></div></div>
  </div>
</section>
<section id="lifestyle" class="section">
  <div class="page-header"><div><h1>Lifestyle & Personal Management</h1><p class="subtitle">Home, travel, documents, subscriptions</p></div></div>
  <div class="stats-row four">
    <div class="stat-card"><span class="stat-label">Open Tasks</span><span class="stat-value" id="life-tasks">0</span></div>
    <div class="stat-card"><span class="stat-label">Shopping</span><span class="stat-value" id="life-shop">0</span></div>
    <div class="stat-card"><span class="stat-label">Subscriptions</span><span class="stat-value" id="life-subs">0</span></div>
    <div class="stat-card"><span class="stat-label">Reminders</span><span class="stat-value" id="life-reminders">0</span></div>
  </div>
  <div class="mod-grid">
    <div class="panel"><div class="panel-header"><h2>Life Admin</h2><button class="btn btn-sm btn-outline" id="btn-add-life-admin">+</button></div><div id="life-admin-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Personal Tasks</h2><button class="btn btn-sm btn-outline" id="btn-add-personal-task">+</button></div><div id="personal-task-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Home Management</h2><button class="btn btn-sm btn-outline" id="btn-add-home-task">+</button></div><div id="home-task-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Household Maintenance</h2><button class="btn btn-sm btn-outline" id="btn-add-household">+</button></div><div id="household-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Shopping List</h2><button class="btn btn-sm btn-outline" id="btn-add-shopping">+</button></div><div id="shopping-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Travel Planner</h2><button class="btn btn-sm btn-outline" id="btn-add-travel">+</button></div><div id="travel-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Documents Index</h2><button class="btn btn-sm btn-outline" id="btn-add-document">+</button></div><div id="document-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Subscriptions</h2><button class="btn btn-sm btn-outline" id="btn-add-subscription">+</button></div><div id="subscription-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Decluttering</h2><button class="btn btn-sm btn-outline" id="btn-add-declutter">+</button></div><div id="declutter-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Inventory</h2><button class="btn btn-sm btn-outline" id="btn-add-inventory">+</button></div><div id="inventory-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Vehicle Maintenance</h2><button class="btn btn-sm btn-outline" id="btn-add-vehicle">+</button></div><div id="vehicle-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Life Reminders</h2><button class="btn btn-sm btn-outline" id="btn-add-life-reminder">+</button></div><div id="life-reminder-list"></div></div>
  </div>
</section>`);
  }

  function tryInject() {
    injectUI();
    // Re-wire buttons after DOM exists (modules4 wire uses setTimeout already)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInject);
  } else {
    tryInject();
  }
  setTimeout(tryInject, 600);
  setTimeout(tryInject, 1500);
  setTimeout(tryInject, 3000);
})();
