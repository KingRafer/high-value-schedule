/* HVOS Modules 5 UI — Digital, Brand, Adventure, Security, Legacy */
(function () {
  function inject() {
    const nav = document.querySelector('.sidebar-nav');
    if (nav && !document.querySelector('[data-section="digital"]')) {
      const timer = nav.querySelector('[data-section="timer"]');
      const div = document.createElement('div');
      div.innerHTML =
        '<div class="nav-divider"></div>' +
        '<a href="#digital" class="nav-item" data-section="digital"><span class="nav-icon">⌘</span> Digital</a>' +
        '<a href="#brand" class="nav-item" data-section="brand"><span class="nav-icon">◎</span> Brand</a>' +
        '<a href="#adventure" class="nav-item" data-section="adventure"><span class="nav-icon">⛰</span> Adventure</a>' +
        '<a href="#security" class="nav-item" data-section="security"><span class="nav-icon">⛨</span> Security</a>' +
        '<a href="#legacy" class="nav-item" data-section="legacy"><span class="nav-icon">∞</span> Legacy</a>';
      const frag = document.createDocumentFragment();
      while (div.firstChild) frag.appendChild(div.firstChild);
      if (timer) nav.insertBefore(frag, timer); else nav.appendChild(frag);
    }

    const main = document.getElementById('main-content') || document.querySelector('main.content');
    if (!main || document.getElementById('digital')) return;

    main.insertAdjacentHTML('beforeend', `
<section id="digital" class="section">
  <div class="page-header"><div><h1>Digital Intelligence & Technology</h1><p class="subtitle">AI, skills, tools, security, portfolio</p></div></div>
  <div class="stats-row four">
    <div class="stat-card"><span class="stat-label">AI Tools</span><span class="stat-value" id="digi-tools">0</span></div>
    <div class="stat-card"><span class="stat-label">Skills</span><span class="stat-value" id="digi-skills">0</span></div>
    <div class="stat-card"><span class="stat-label">Active Projects</span><span class="stat-value" id="digi-projects">0</span></div>
    <div class="stat-card"><span class="stat-label">Websites</span><span class="stat-value" id="digi-sites">0</span></div>
  </div>
  <div class="mod-grid">
    <div class="panel"><div class="panel-header"><h2>AI Tools Library</h2><button class="btn btn-sm btn-outline" id="btn-add-ai-tool">+</button></div><div id="ai-tools-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>AI Learning</h2><button class="btn btn-sm btn-outline" id="btn-add-ai-learning">+</button></div><div id="ai-learning-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Digital Skills</h2><button class="btn btn-sm btn-outline" id="btn-add-digi-skill">+</button></div><div id="digi-skills-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Software Tools</h2><button class="btn btn-sm btn-outline" id="btn-add-software">+</button></div><div id="software-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Automation Planner</h2><button class="btn btn-sm btn-outline" id="btn-add-automation">+</button></div><div id="automation-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Digital Productivity</h2><button class="btn btn-sm btn-outline" id="btn-add-digi-prod">+</button></div><div id="digi-prod-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Cybersecurity Checklist</h2></div><div id="cyber-checklist" class="routine-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Digital Assets</h2><button class="btn btn-sm btn-outline" id="btn-add-digi-asset">+</button></div><div id="digi-assets-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Websites</h2><button class="btn btn-sm btn-outline" id="btn-add-website">+</button></div><div id="website-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Tech Projects</h2><button class="btn btn-sm btn-outline" id="btn-add-tech-project">+</button></div><div id="tech-project-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Digital Portfolio</h2><button class="btn btn-sm btn-outline" id="btn-add-digi-portfolio">+</button></div><div id="digi-portfolio-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Online Presence</h2><button class="btn btn-sm btn-outline" id="btn-add-online-presence">+</button></div><div id="online-presence-list"></div></div>
  </div>
</section>
<section id="brand" class="section">
  <div class="page-header"><div><h1>Personal Brand & Reputation</h1><p class="subtitle">Identity, content, audience, milestones</p></div></div>
  <div class="stats-row four">
    <div class="stat-card"><span class="stat-label">Scheduled Content</span><span class="stat-value" id="brand-content">0</span></div>
    <div class="stat-card"><span class="stat-label">Platforms</span><span class="stat-value" id="brand-social">0</span></div>
    <div class="stat-card"><span class="stat-label">Achievements</span><span class="stat-value" id="brand-achievements">0</span></div>
    <div class="stat-card"><span class="stat-label">Milestones Done</span><span class="stat-value" id="brand-milestones">0</span></div>
  </div>
  <div class="mod-grid">
    <div class="panel"><div class="panel-header"><h2>Branding Strategy</h2><button class="btn btn-sm btn-outline" id="btn-edit-brand-strategy">Edit</button></div><div id="brand-strategy-box"></div></div>
    <div class="panel"><div class="panel-header"><h2>Brand Identity</h2><button class="btn btn-sm btn-outline" id="btn-edit-brand-identity">Edit</button></div><div id="brand-identity-box"></div></div>
    <div class="panel"><div class="panel-header"><h2>Positioning</h2><button class="btn btn-sm btn-outline" id="btn-edit-positioning">Edit</button></div><div id="positioning-box"></div></div>
    <div class="panel"><div class="panel-header"><h2>Content Planning</h2><button class="btn btn-sm btn-outline" id="btn-add-content-plan">+</button></div><div id="content-plan-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Publishing Schedule</h2><button class="btn btn-sm btn-outline" id="btn-add-content-schedule">+</button></div><div id="content-schedule-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Social Media</h2><button class="btn btn-sm btn-outline" id="btn-add-social-media">+</button></div><div id="social-media-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Professional Portfolio</h2><button class="btn btn-sm btn-outline" id="btn-add-pro-portfolio">+</button></div><div id="pro-portfolio-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Reputation Tracker</h2><button class="btn btn-sm btn-outline" id="btn-add-reputation">+</button></div><div id="reputation-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Achievements Library</h2><button class="btn btn-sm btn-outline" id="btn-add-achievement">+</button></div><div id="achievements-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Public Image</h2><button class="btn btn-sm btn-outline" id="btn-add-public-image">+</button></div><div id="public-image-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Audience Growth</h2><button class="btn btn-sm btn-outline" id="btn-add-audience">+</button></div><div id="audience-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Brand Milestones</h2><button class="btn btn-sm btn-outline" id="btn-add-brand-milestone">+</button></div><div id="brand-milestone-list"></div></div>
  </div>
</section>
<section id="adventure" class="section">
  <div class="page-header"><div><h1>Adventure & Life Experiences</h1><p class="subtitle">Bucket list, travel, hobbies, challenges</p></div></div>
  <div class="stats-row four">
    <div class="stat-card"><span class="stat-label">Open Bucket</span><span class="stat-value" id="adv-bucket">0</span></div>
    <div class="stat-card"><span class="stat-label">Travel Goals</span><span class="stat-value" id="adv-travel">0</span></div>
    <div class="stat-card"><span class="stat-label">Experiences</span><span class="stat-value" id="adv-done">0</span></div>
    <div class="stat-card"><span class="stat-label">Hobbies</span><span class="stat-value" id="adv-hobbies">0</span></div>
  </div>
  <div class="mod-grid">
    <div class="panel"><div class="panel-header"><h2>Bucket List</h2><button class="btn btn-sm btn-outline" id="btn-add-bucket">+</button></div><div id="bucket-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Travel Goals</h2><button class="btn btn-sm btn-outline" id="btn-add-travel-goal">+</button></div><div id="travel-goals-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Adventure Planner</h2><button class="btn btn-sm btn-outline" id="btn-add-adventure">+</button></div><div id="adventure-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>New Experiences</h2><button class="btn btn-sm btn-outline" id="btn-add-experience">+</button></div><div id="experience-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Personal Challenges</h2><button class="btn btn-sm btn-outline" id="btn-add-adv-challenge">+</button></div><div id="challenge-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Outdoor Activities</h2><button class="btn btn-sm btn-outline" id="btn-add-outdoor">+</button></div><div id="outdoor-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Hobbies</h2><button class="btn btn-sm btn-outline" id="btn-add-hobby">+</button></div><div id="hobby-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Cultural Exploration</h2><button class="btn btn-sm btn-outline" id="btn-add-cultural">+</button></div><div id="cultural-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Experience Journal</h2><button class="btn btn-sm btn-outline" id="btn-add-exp-journal">+</button></div><div id="exp-journal-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Annual Adventure Goals</h2><button class="btn btn-sm btn-outline" id="btn-add-annual-adventure">+</button></div><div id="annual-adventure-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Achievement Archive</h2><button class="btn btn-sm btn-outline" id="btn-add-achievement-archive">+</button></div><div id="achievement-archive-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Dream Destinations</h2><button class="btn btn-sm btn-outline" id="btn-add-dream-dest">+</button></div><div id="dream-dest-list"></div></div>
  </div>
</section>
<section id="security" class="section">
  <div class="page-header"><div><h1>Security & Risk Management</h1><p class="subtitle">Emergency, insurance, privacy, preparedness</p></div></div>
  <div class="stats-row four">
    <div class="stat-card"><span class="stat-label">Emergency Contacts</span><span class="stat-value" id="sec-contacts">0</span></div>
    <div class="stat-card"><span class="stat-label">Insurance</span><span class="stat-value" id="sec-insurance">0</span></div>
    <div class="stat-card"><span class="stat-label">Doc Records</span><span class="stat-value" id="sec-docs">0</span></div>
    <div class="stat-card"><span class="stat-label">Risks Logged</span><span class="stat-value" id="sec-risks">0</span></div>
  </div>
  <div class="mod-grid">
    <div class="panel panel-wide"><div class="panel-header"><h2>Emergency Plan</h2><button class="btn btn-sm btn-outline" id="btn-edit-emergency-plan">Edit</button></div><div id="emergency-plan-box"></div></div>
    <div class="panel"><div class="panel-header"><h2>Emergency Contacts</h2><button class="btn btn-sm btn-outline" id="btn-add-emergency-contact">+</button></div><div id="emergency-contacts-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Document Records</h2><button class="btn btn-sm btn-outline" id="btn-add-doc-record">+</button></div><div id="doc-records-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Insurance</h2><button class="btn btn-sm btn-outline" id="btn-add-insurance">+</button></div><div id="insurance-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Password Manager Refs</h2><button class="btn btn-sm btn-outline" id="btn-add-password-ref">+</button></div><div id="password-refs-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Account Security</h2></div><div id="account-security-list" class="routine-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Data Backup Schedule</h2><button class="btn btn-sm btn-outline" id="btn-add-backup">+</button></div><div id="backup-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Risk Assessment</h2><button class="btn btn-sm btn-outline" id="btn-add-risk-assessment">+</button></div><div id="risk-assessment-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Property Protection</h2><button class="btn btn-sm btn-outline" id="btn-add-property-protect">+</button></div><div id="property-protect-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Digital Privacy</h2></div><div id="digi-privacy-list" class="routine-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Disaster Preparedness</h2><button class="btn btn-sm btn-outline" id="btn-add-disaster-prep">+</button></div><div id="disaster-prep-list"></div></div>
  </div>
</section>
<section id="legacy" class="section">
  <div class="page-header"><div><h1>Legacy & Life Achievement</h1><p class="subtitle">Lifetime goals, history, impact, philanthropy</p></div></div>
  <div class="stats-row four">
    <div class="stat-card"><span class="stat-label">Lifetime Goals</span><span class="stat-value" id="leg-goals">0</span></div>
    <div class="stat-card"><span class="stat-label">Milestones</span><span class="stat-value" id="leg-milestones">0</span></div>
    <div class="stat-card"><span class="stat-label">Lessons</span><span class="stat-value" id="leg-lessons">0</span></div>
    <div class="stat-card"><span class="stat-label">Philanthropy</span><span class="stat-value" id="leg-philanthropy">0</span></div>
  </div>
  <div class="mod-grid">
    <div class="panel panel-wide"><div class="panel-header"><h2>Legacy Statement</h2><button class="btn btn-sm btn-outline" id="btn-edit-legacy-statement">Edit</button></div><div id="legacy-statement-box"></div></div>
    <div class="panel"><div class="panel-header"><h2>Lifetime Goals</h2><button class="btn btn-sm btn-outline" id="btn-add-lifetime-goal">+</button></div><div id="lifetime-goals-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Family Legacy</h2><button class="btn btn-sm btn-outline" id="btn-add-family-legacy">+</button></div><div id="family-legacy-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Life Milestones</h2><button class="btn btn-sm btn-outline" id="btn-add-life-milestone">+</button></div><div id="life-milestones-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Major Decisions</h2><button class="btn btn-sm btn-outline" id="btn-add-major-decision">+</button></div><div id="major-decisions-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Personal History</h2><button class="btn btn-sm btn-outline" id="btn-add-personal-history">+</button></div><div id="personal-history-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Lessons Learned</h2><button class="btn btn-sm btn-outline" id="btn-add-lesson">+</button></div><div id="lessons-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Life Impact</h2><button class="btn btn-sm btn-outline" id="btn-add-life-impact">+</button></div><div id="life-impact-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Philanthropy</h2><button class="btn btn-sm btn-outline" id="btn-add-philanthropy">+</button></div><div id="philanthropy-list"></div></div>
    <div class="panel"><div class="panel-header"><h2>Lifetime Bucket List</h2><button class="btn btn-sm btn-outline" id="btn-add-lifetime-bucket">+</button></div><div id="lifetime-bucket-list"></div></div>
  </div>
</section>`);
  }

  function run() { inject(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  setTimeout(run, 700);
  setTimeout(run, 2000);
  setTimeout(run, 4000);
})();
