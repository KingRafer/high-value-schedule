const defaultSchedule = [
  { time: "05:00 – 05:30", title: "Bangun & Hydrate", desc: "Air, sunlight, tidak cek HP dulu", tag: "mind", tagLabel: "Mind" },
  { time: "05:30 – 06:30", title: "Movement / Training", desc: "Strength, mobility, atau run", tag: "body", tagLabel: "Body" },
  { time: "06:30 – 07:00", title: "Cold Shower + Journal", desc: "3 gratitude + top 3 priority hari ini", tag: "mind", tagLabel: "Mind" },
  { time: "07:00 – 09:00", title: "Deep Work Block 1", desc: "Tugas paling penting (no meeting, no chat)", tag: "focus", tagLabel: "Focus" },
  { time: "09:00 – 09:30", title: "Break & Fuel", desc: "Protein-heavy breakfast, short walk", tag: "body", tagLabel: "Body" },
  { time: "09:30 – 11:30", title: "Deep Work Block 2", desc: "Lanjutkan project utama", tag: "focus", tagLabel: "Focus" },
  { time: "11:30 – 12:30", title: "Training / Gym", desc: "Kalau belum pagi, atau active recovery", tag: "body", tagLabel: "Body" },
  { time: "12:30 – 13:30", title: "Lunch & Reset", desc: "Makan tenang, tanpa layar", tag: "rest", tagLabel: "Rest" },
  { time: "13:30 – 15:30", title: "Deep Work / Meetings", desc: "Collaboration atau creative work", tag: "focus", tagLabel: "Focus" },
  { time: "15:30 – 16:00", title: "Walk & Think", desc: "Clear mind, ide, atau call penting", tag: "mind", tagLabel: "Mind" },
  { time: "16:00 – 18:00", title: "Admin & Learning", desc: "Email, admin, baca / course", tag: "focus", tagLabel: "Focus" },
  { time: "18:00 – 19:30", title: "Dinner & Family/Social", desc: "Hubungan yang penting", tag: "rest", tagLabel: "Rest" },
  { time: "19:30 – 21:00", title: "Wind Down", desc: "Hobby ringan, baca, no intense work", tag: "rest", tagLabel: "Rest" },
  { time: "21:00 – 22:00", title: "Review & Plan", desc: "Review hari ini + plan besok", tag: "mind", tagLabel: "Mind" },
  { time: "22:00", title: "Sleep", desc: "Target 7–8 jam. Konsisten.", tag: "rest", tagLabel: "Rest" },
];

const templates = {
  builder: [
    { time: "05:30 – 06:00", title: "Bangun & Movement", desc: "Hydrate + light mobility", tag: "body", tagLabel: "Body" },
    { time: "06:00 – 06:30", title: "Journal & Priorities", desc: "Top 3 outcomes hari ini", tag: "mind", tagLabel: "Mind" },
    { time: "06:30 – 09:00", title: "Deep Work 1", desc: "Core project – highest leverage", tag: "focus", tagLabel: "Focus" },
    { time: "09:00 – 09:30", title: "Break", desc: "Walk + protein", tag: "rest", tagLabel: "Rest" },
    { time: "09:30 – 12:00", title: "Deep Work 2", desc: "Continue building", tag: "focus", tagLabel: "Focus" },
    { time: "12:00 – 13:30", title: "Training + Lunch", desc: "Lift + fuel", tag: "body", tagLabel: "Body" },
    { time: "13:30 – 16:30", title: "Deep Work 3", desc: "Second major block", tag: "focus", tagLabel: "Focus" },
    { time: "16:30 – 18:00", title: "Admin / Light Tasks", desc: "Email, ops, learning", tag: "focus", tagLabel: "Focus" },
    { time: "18:00 – 20:00", title: "Dinner & Recover", desc: "Social or solo recharge", tag: "rest", tagLabel: "Rest" },
    { time: "20:00 – 21:00", title: "Review & Plan", desc: "What worked, what next", tag: "mind", tagLabel: "Mind" },
    { time: "21:30", title: "Sleep", desc: "Protect recovery", tag: "rest", tagLabel: "Rest" },
  ],
  athlete: [
    { time: "05:00 – 05:30", title: "Bangun & Mobility", desc: "Activate body", tag: "body", tagLabel: "Body" },
    { time: "05:30 – 07:00", title: "Strength Training", desc: "Main lift session", tag: "body", tagLabel: "Body" },
    { time: "07:00 – 08:00", title: "Fuel & Recover", desc: "High protein meal", tag: "body", tagLabel: "Body" },
    { time: "08:00 – 11:00", title: "Deep Work", desc: "Focused productive block", tag: "focus", tagLabel: "Focus" },
    { time: "11:00 – 12:00", title: "Active Recovery", desc: "Walk / stretch / sauna", tag: "body", tagLabel: "Body" },
    { time: "12:00 – 13:00", title: "Lunch + Nap", desc: "Optional short nap", tag: "rest", tagLabel: "Rest" },
    { time: "13:00 – 15:00", title: "Skill / Cardio", desc: "Sport specific or conditioning", tag: "body", tagLabel: "Body" },
    { time: "15:00 – 17:00", title: "Work / Learning", desc: "Lighter cognitive work", tag: "focus", tagLabel: "Focus" },
    { time: "17:00 – 19:00", title: "Evening & Social", desc: "Relationships", tag: "rest", tagLabel: "Rest" },
    { time: "19:00 – 20:30", title: "Wind Down", desc: "No screens intense", tag: "rest", tagLabel: "Rest" },
    { time: "20:30", title: "Sleep Prep", desc: "Early bed for recovery", tag: "rest", tagLabel: "Rest" },
  ],
  balanced: [
    { time: "06:00 – 06:30", title: "Bangun & Journal", desc: "Gratitude + intention", tag: "mind", tagLabel: "Mind" },
    { time: "06:30 – 07:30", title: "Training", desc: "Strength or cardio", tag: "body", tagLabel: "Body" },
    { time: "07:30 – 08:30", title: "Breakfast & Prep", desc: "Fuel + plan day", tag: "rest", tagLabel: "Rest" },
    { time: "08:30 – 11:30", title: "Deep Work", desc: "Most important work", tag: "focus", tagLabel: "Focus" },
    { time: "11:30 – 12:30", title: "Lunch", desc: "Mindful meal", tag: "rest", tagLabel: "Rest" },
    { time: "12:30 – 15:00", title: "Meetings / Collab", desc: "People work", tag: "focus", tagLabel: "Focus" },
    { time: "15:00 – 16:30", title: "Admin & Learning", desc: "Catch up + growth", tag: "focus", tagLabel: "Focus" },
    { time: "16:30 – 18:00", title: "Family / Social", desc: "Be present", tag: "rest", tagLabel: "Rest" },
    { time: "18:00 – 19:30", title: "Dinner", desc: "Unhurried", tag: "rest", tagLabel: "Rest" },
    { time: "19:30 – 21:00", title: "Hobby / Wind Down", desc: "Joy without screens overload", tag: "rest", tagLabel: "Rest" },
    { time: "21:00 – 21:30", title: "Review", desc: "Quick daily review", tag: "mind", tagLabel: "Mind" },
    { time: "22:00", title: "Sleep", desc: "Consistent bedtime", tag: "rest", tagLabel: "Rest" },
  ],
};

function renderSchedule(schedule) {
  const grid = document.getElementById("schedule-grid");
  if (!grid) return;

  grid.innerHTML = schedule
    .map(
      (item) => `
    <div class="block" data-time="${item.time}">
      <div class="block-time">${item.time}</div>
      <div class="block-content">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </div>
      <span class="block-tag ${item.tag}">${item.tagLabel}</span>
    </div>
  `
    )
    .join("");
}

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const timeEl = document.getElementById("current-time");
  const statusEl = document.getElementById("current-block");

  if (timeEl) timeEl.textContent = `${h}:${m}`;

  // Simple status based on hour
  const hour = now.getHours();
  let status = "Siapkan hari terbaikmu";
  if (hour >= 5 && hour < 7) status = "Morning routine — Win the morning";
  else if (hour >= 7 && hour < 12) status = "Deep work window";
  else if (hour >= 12 && hour < 14) status = "Fuel & recover";
  else if (hour >= 14 && hour < 18) status = "Afternoon focus";
  else if (hour >= 18 && hour < 21) status = "Evening — connect & wind down";
  else if (hour >= 21 || hour < 5) status = "Protect your sleep";

  if (statusEl) statusEl.textContent = status;
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  renderSchedule(defaultSchedule);
  updateClock();
  setInterval(updateClock, 30000);

  // Template buttons
  document.querySelectorAll(".apply-template").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".template-card");
      const key = card?.dataset.template;
      if (key && templates[key]) {
        renderSchedule(templates[key]);
        document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Header CTA
  document.getElementById("cta-header")?.addEventListener("click", () => {
    document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" });
  });
});