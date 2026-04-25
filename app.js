let state = {
    guests: [],
    expenses: [],
    budgetLimit: 0,
    selectedCategory: null,
    persona: { goal: "", dislike: "", timeline: "" },
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tutorialStep: 0,
    calendarEvents: [],
    calendarYear: new Date().getFullYear(),
    calendarMonth: new Date().getMonth(),
    income: 0,
    savingsGoal: 0,
    savingsMonths: 3,
    notes: [],
    currentUser: null
};

const categories = [
    { id: "birthday", label: "Birthday", icon: "🎂", color: "#ff9ff3" },
    { id: "playdate", label: "Playdate", icon: "🧸", color: "#feca57" },
    { id: "school-event", label: "School Event", icon: "🏫", color: "#48dbfb" },
    { id: "bake-sale", label: "Bake Sale", icon: "🧁", color: "#ff9f43" },
    { id: "family-dinner", label: "Family Dinner", icon: "🍽️", color: "#1dd1a1" },
    { id: "sleepover", label: "Sleepover", icon: "🌙", color: "#5f27cd" },
    { id: "sports-day", label: "Sports Day", icon: "⚽", color: "#ee5253" },
    { id: "holiday-party", label: "Holiday Party", icon: "🎄", color: "#0abde3" },
    { id: "picnic", label: "Picnic", icon: "🧺", color: "#10ac84" },
    { id: "graduation", label: "Graduation", icon: "🎓", color: "#54a0ff" },
    { id: "anniversary", label: "Anniversary", icon: "💍", color: "#f368e0" }
];

const templates = {
    birthday: {
        tasks: ["Order cake", "Buy goodie bags", "Send invitations", "Confirm RSVP count"],
        description: "A cheerful birthday setup with gifts, food, and guest management already mapped out.",
        tips: ["Lock the guest count early.", "Order the cake at least one week ahead.", "Keep a backup indoor activity ready."],
        spec: { vibe: "Bright and playful", guests: "10 to 20 guests", budget: "$250 to $600", location: "Backyard, home, or party room" },
        timeline: ["2 weeks out: choose theme and guest list", "1 week out: order cake and decor", "3 days out: confirm RSVPs", "Event day: setup stations and food table"],
        stores: ["Party City for balloons and banners", "Target for tableware and party favors", "Walmart for snacks, candles, and basics"]
    },
    playdate: {
        tasks: ["Prep snacks", "Safety check toys", "Message parents", "Set end time"],
        description: "A simple playdate flow focused on timing, snacks, and parent communication.",
        tips: ["Share pickup details before guests arrive.", "Keep one calm-down activity nearby.", "Double-check allergy notes."],
        spec: { vibe: "Easygoing and kid-friendly", guests: "4 to 8 guests", budget: "$40 to $120", location: "Home playroom or local park" },
        timeline: ["3 days out: text parents", "1 day out: prep snacks and toys", "Before guests arrive: safety check area", "Event day: rotate between activities"],
        stores: ["Target for snacks and crafts", "Dollar Tree for simple activities", "Walmart for quick household basics"]
    },
    "school-event": {
        tasks: ["Volunteer signup", "Permission slips", "Room parent sync", "Decorations"],
        description: "A school-friendly template for organizing responsibilities and classroom logistics.",
        tips: ["Assign one point person.", "Track approvals in one place.", "Set setup and teardown windows clearly."],
        spec: { vibe: "Organized and community-focused", guests: "25 to 100 attendees", budget: "$150 to $800", location: "School gym, cafeteria, or classroom" },
        timeline: ["3 weeks out: confirm approvals", "2 weeks out: fill volunteer roles", "1 week out: prep decorations and supplies", "Event day: assign check-in and cleanup"],
        stores: ["Staples for signage and printouts", "Target for decor and snacks", "Costco for bulk food and drinks"]
    },
    "bake-sale": {
        tasks: ["Ingredient check", "Packaging labels", "Cash box", "Folding table"],
        description: "A sales-focused template for prep, pricing, packaging, and day-of setup.",
        tips: ["Label allergens clearly.", "Bring small change.", "Display best sellers at eye level."],
        spec: { vibe: "Warm and community-driven", guests: "Foot traffic event", budget: "$75 to $250", location: "School entrance, market, or community table" },
        timeline: ["1 week out: confirm bakers and quantities", "2 days out: package and label items", "Night before: prep cash box and signs", "Event day: organize display by price"],
        stores: ["Costco for bulk baking supplies", "Dollar Tree for labels and trays", "Walmart for table setup essentials"]
    },
    "family-dinner": {
        tasks: ["Build grocery list", "Check allergies", "Set playlist", "Plan kids activity"],
        description: "A relaxed dinner template that balances meal prep with a comfortable guest experience.",
        tips: ["Prep one dish ahead of time.", "Set the table early.", "Have a simple cleanup plan."],
        spec: { vibe: "Cozy and welcoming", guests: "6 to 14 guests", budget: "$120 to $320", location: "Dining room or patio" },
        timeline: ["5 days out: finalize menu", "2 days out: shop and prep ingredients", "Morning of: set table and music", "Dinner time: serve easy first course"],
        stores: ["Trader Joe's for appetizers and desserts", "Target for candles and table details", "Walmart for pantry staples"]
    },
    sleepover: {
        tasks: ["Set out extra pillows", "Choose movie", "Prep breakfast", "Collect emergency contacts"],
        description: "A sleepover checklist for comfort, entertainment, and parent peace of mind.",
        tips: ["Share pickup time in advance.", "Create a quiet lights-out plan.", "Keep chargers accessible."],
        spec: { vibe: "Fun and cozy", guests: "4 to 8 guests", budget: "$90 to $220", location: "Living room or basement setup" },
        timeline: ["3 days out: confirm pickups and allergies", "1 day out: gather bedding and snacks", "Event evening: rotate activities", "Morning after: serve easy breakfast"],
        stores: ["Target for blankets and snacks", "Walmart for breakfast supplies", "Five Below for games and extras"]
    },
    "sports-day": {
        tasks: ["Pack water bottles", "Bring orange slices", "Check team jerseys", "Prep first aid kit"],
        description: "A game-day planner built around hydration, timing, and team essentials.",
        tips: ["Pack shade if outdoors.", "Label reusable bottles.", "Bring a printed schedule."],
        spec: { vibe: "Active and high-energy", guests: "Teams, parents, and coaches", budget: "$100 to $300", location: "Field, school yard, or rec center" },
        timeline: ["1 week out: confirm team schedule", "2 days out: prep equipment and snacks", "Night before: pack hydration and first aid", "Event day: assign stations and volunteers"],
        stores: ["Dick's Sporting Goods for gear", "Costco for drinks and snacks", "Target for first aid and setup items"]
    },
    "holiday-party": {
        tasks: ["Theme decorations", "Gift exchange rules", "Holiday treats", "Create playlist"],
        description: "A festive party setup with decor, food, and entertainment ready to go.",
        tips: ["Share dress code early.", "Keep the menu simple.", "Plan one anchor activity."],
        spec: { vibe: "Festive and polished", guests: "12 to 30 guests", budget: "$220 to $700", location: "Home, office, or rented room" },
        timeline: ["3 weeks out: pick theme and guest list", "1 week out: buy decor and menu items", "2 days out: prep gift exchange details", "Event day: decorate before food setup"],
        stores: ["Michaels for seasonal decor", "Target for serveware and lighting", "Trader Joe's for easy party snacks"]
    },
    picnic: {
        tasks: ["Pack cooler", "Bring blankets", "Add sunscreen", "Pack bug spray"],
        description: "An outdoor event planner for comfort, weather prep, and easy food handling.",
        tips: ["Check the weather the night before.", "Bring a trash bag.", "Pack wipes and napkins."],
        spec: { vibe: "Relaxed and outdoorsy", guests: "6 to 18 guests", budget: "$80 to $240", location: "Park, beach, or backyard lawn" },
        timeline: ["3 days out: confirm weather backup plan", "1 day out: prep food and cooler", "Morning of: pack blankets and sunscreen", "At the park: set up food in shade"],
        stores: ["Target for picnic gear", "Walmart for drinks and sunscreen", "Costco for bulk sandwich items"]
    },
    graduation: {
        tasks: ["Confirm cap and gown", "Send invitations", "Book venue", "Prepare photo slideshow"],
        description: "A graduation event plan that keeps milestones, guests, and celebration details organized.",
        tips: ["Confirm the ceremony schedule first.", "Reserve photo time.", "Plan parking instructions."],
        spec: { vibe: "Proud and celebratory", guests: "15 to 40 guests", budget: "$250 to $900", location: "Home, hall, or restaurant room" },
        timeline: ["3 weeks out: confirm ceremony details", "2 weeks out: send invitations", "1 week out: prep slideshow and signage", "Event day: schedule food around ceremony timing"],
        stores: ["Staples for photo prints and signs", "Party City for banners and balloons", "Costco for catering trays"]
    },
    anniversary: {
        tasks: ["Make reservation", "Choose gift", "Order flowers"],
        description: "A smaller celebration template focused on the key moments that make the day feel special.",
        tips: ["Book early if it is a weekend.", "Add one personal touch.", "Keep timing relaxed."],
        spec: { vibe: "Elegant and intimate", guests: "2 to 10 guests", budget: "$150 to $500", location: "Restaurant, patio dinner, or home setup" },
        timeline: ["2 weeks out: reserve venue or dinner plan", "1 week out: choose gift and flowers", "2 days out: confirm details", "Celebration day: keep the schedule light"],
        stores: ["Target for candles and dinner details", "Trader Joe's for flowers and dessert", "Local florist for a custom bouquet"]
    }
};

const tutorialSteps = [
    { text: "This is your home base for planning events.", element: "dashboard-section" },
    { text: "Choose a template to open a full event planning view.", element: "category-selector" },
    { text: "Manage your guests and allergy notes here.", element: "guests-section" },
    { text: "Track expenses and watch your budget here.", element: "budget-section" },
    { text: "See RSVP progress and budget summary here.", element: "analytics-section" }
];

window.onload = () => {
    initTheme();
    loadStateFromStorage();
    bindUI();
    renderProfile();
    renderCategories();
    renderGuests();
    updateBudget();
    updateAnalytics();
    updateCountdown();
    loadCustomTemplates();
    renderNotes();

    const currentUser = localStorage.getItem("fep_current_user");
    const accounts = getAccounts();
    if (currentUser && accounts[currentUser]) {
        authSuccess(accounts[currentUser].name, currentUser, true);
    } else if (currentUser === "guest") {
        authSuccess("Guest", "guest", true);
    }

    setInterval(updateCountdown, 1000);
};

function loadStateFromStorage() {
    const saved = localStorage.getItem("fep_state");
    if (saved) {
        const parsed = JSON.parse(saved);
        state.guests = parsed.guests || [];
        state.expenses = parsed.expenses || [];
        state.budgetLimit = parsed.budgetLimit ?? 0;
        state.calendarEvents = parsed.calendarEvents || [];
        state.income = parsed.income || 0;
        state.savingsGoal = parsed.savingsGoal || 0;
        state.savingsMonths = parsed.savingsMonths || 3;
        state.notes = parsed.notes || [];
        if (parsed.eventDate) state.eventDate = new Date(parsed.eventDate);
        if (parsed.persona) state.persona = parsed.persona;
    }
}

function saveStateToStorage() {
    localStorage.setItem("fep_state", JSON.stringify({
        guests: state.guests,
        expenses: state.expenses,
        budgetLimit: state.budgetLimit,
        calendarEvents: state.calendarEvents,
        income: state.income,
        savingsGoal: state.savingsGoal,
        savingsMonths: state.savingsMonths,
        notes: state.notes,
        eventDate: state.eventDate,
        persona: state.persona
    }));
}

function bindUI() {
    document.querySelectorAll("[data-auth-tab]").forEach((btn) => {
        btn.addEventListener("click", () => switchAuthTab(btn.dataset.authTab));
    });

    document.querySelectorAll(".nav-item[data-section]").forEach((btn) => {
        btn.addEventListener("click", () => showSection(btn.dataset.section, btn));
    });

    document.getElementById("signin-submit").addEventListener("click", handleSignIn);
    document.getElementById("signup-submit").addEventListener("click", handleSignUp);
    document.getElementById("guest-btn").addEventListener("click", handleGuest);
    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    document.getElementById("share-button").addEventListener("click", copyEventLink);
    document.getElementById("back-home-button").addEventListener("click", goHome);
    document.getElementById("add-guest-button").addEventListener("click", addGuest);
    document.getElementById("add-expense-button").addEventListener("click", addExpense);
    document.getElementById("help-btn").addEventListener("click", startTutorial);
    document.getElementById("dashboard-custom-template-button").addEventListener("click", () => {
        const btn = document.querySelector('.nav-item[data-section="custom-template"]');
        showSection("custom-template", btn);
    });
    document.getElementById("save-custom-template-button").addEventListener("click", saveCustomTemplate);

    // Calendar
    document.getElementById("toggle-cal-form-btn").addEventListener("click", toggleCalForm);
    document.getElementById("save-cal-event-btn").addEventListener("click", saveCalendarEvent);
    document.getElementById("cal-prev").addEventListener("click", () => { state.calendarMonth--; if (state.calendarMonth < 0) { state.calendarMonth = 11; state.calendarYear--; } renderCalendar(); });
    document.getElementById("cal-next").addEventListener("click", () => { state.calendarMonth++; if (state.calendarMonth > 11) { state.calendarMonth = 0; state.calendarYear++; } renderCalendar(); });

    // Savings
    document.getElementById("update-savings-btn").addEventListener("click", updateSavings);

    // Notes
    document.getElementById("add-note-btn").addEventListener("click", addNote);

    // Settings
    document.getElementById("settings-theme-btn").addEventListener("click", toggleTheme);
    document.getElementById("save-event-date-btn").addEventListener("click", saveEventDate);
    document.getElementById("save-persona-btn").addEventListener("click", savePersona);
    document.getElementById("settings-logout-btn").addEventListener("click", handleLogout);
    document.getElementById("sidebar-logout").addEventListener("click", handleLogout);
}

// ── AUTH ──────────────────────────────────────────────────────────────────────

function initAfterAuth() {
    renderProfile();
    if (!localStorage.getItem("tutorialDone")) startTutorial();
}

function getAccounts() {
    return JSON.parse(localStorage.getItem("fep_accounts") || "{}");
}

function saveAccounts(accounts) {
    localStorage.setItem("fep_accounts", JSON.stringify(accounts));
}

function switchAuthTab(tab) {
    document.querySelectorAll(".auth-tab").forEach((t, i) => t.classList.toggle("active", (i === 0) === (tab === "signin")));
    document.getElementById("signin-form").style.display = tab === "signin" ? "" : "none";
    document.getElementById("signup-form").style.display = tab === "signup" ? "" : "none";
}

function authSuccess(name, email, skipToast = false) {
    state.currentUser = email;
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("sidebar-user-name").textContent = name;
    document.getElementById("sidebar-user-avatar").textContent = name.charAt(0).toUpperCase();
    document.getElementById("settings-account-info").textContent = email === "guest" ? "Signed in as Guest" : `Signed in as ${email}`;
    if (!skipToast) showToast(`Welcome, ${name}!`);
    initAfterAuth();
}

function handleSignIn() {
    const email = document.getElementById("signin-email").value.trim().toLowerCase();
    const password = document.getElementById("signin-password").value;
    const errEl = document.getElementById("signin-error");
    const accounts = getAccounts();

    if (accounts[email] && accounts[email].password === password) {
        errEl.textContent = "";
        localStorage.setItem("fep_current_user", email);
        authSuccess(accounts[email].name, email);
        return;
    }
    errEl.textContent = "Incorrect email or password.";
}

function handleSignUp() {
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim().toLowerCase();
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;
    const errEl = document.getElementById("signup-error");

    if (!name || !email || !password) { errEl.textContent = "Please fill in all fields."; return; }
    if (password !== confirm) { errEl.textContent = "Passwords do not match."; return; }

    const accounts = getAccounts();
    if (accounts[email]) { errEl.textContent = "An account with that email already exists."; return; }

    accounts[email] = { name, password };
    saveAccounts(accounts);
    localStorage.setItem("fep_current_user", email);
    errEl.textContent = "";
    authSuccess(name, email);
}

function handleGuest() {
    localStorage.setItem("fep_current_user", "guest");
    authSuccess("Guest", "guest");
}

function handleLogout() {
    localStorage.removeItem("fep_current_user");
    state.currentUser = null;
    document.getElementById("auth-screen").style.display = "";
    showToast("Signed out.");
}

// ── THEME ─────────────────────────────────────────────────────────────────────

function toggleTheme() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("fep_theme", next);
    updateThemeBtn(next);
}

function updateThemeBtn(theme) {
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

function initTheme() {
    const saved = localStorage.getItem("fep_theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    updateThemeBtn(saved);
}

// ── NAVIGATION ────────────────────────────────────────────────────────────────

function showSection(id, btn) {
    document.querySelectorAll(".app-section").forEach((s) => s.classList.add("hidden"));
    const target = document.getElementById(`${id}-section`);
    if (target) target.classList.remove("hidden");

    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    if (btn) btn.classList.add("active");

    if (id === "analytics") updateAnalytics();
    if (id === "calendar") renderCalendar();
    if (id === "savings") renderSavings();
}

function goHome() {
    const homeBtn = document.querySelector('.nav-item[data-section="dashboard"]');
    showSection("dashboard", homeBtn);
}

// ── TUTORIAL ──────────────────────────────────────────────────────────────────

function startTutorial() {
    state.tutorialStep = 0;
    document.getElementById("tutorial-overlay").classList.remove("hidden");
    nextTutorialStep();
}

function nextTutorialStep() {
    if (state.tutorialStep >= tutorialSteps.length) {
        document.getElementById("tutorial-overlay").classList.add("hidden");
        localStorage.setItem("tutorialDone", "true");
        return;
    }
    const step = tutorialSteps[state.tutorialStep];
    document.getElementById("tutorial-text").textContent = step.text;
    document.querySelectorAll(".tutorial-highlight").forEach((el) => el.classList.remove("tutorial-highlight"));
    const target = document.getElementById(step.element);
    if (target) target.classList.add("tutorial-highlight");
    state.tutorialStep += 1;
}

// ── PROFILE ───────────────────────────────────────────────────────────────────

function renderProfile() {
    const profile = JSON.parse(localStorage.getItem("userPersona")) || state.persona;
    document.getElementById("profile-content").innerHTML = `
        <p><strong>Goal:</strong> ${profile.goal || "Stay organized"}</p>
        <p><strong>Dislike:</strong> ${profile.dislike || "Clutter"}</p>
        <p><strong>Timeline:</strong> ${profile.timeline || "TBD"}</p>
    `;
}

function savePersona() {
    const goal = document.getElementById("settings-goal").value.trim();
    const dislike = document.getElementById("settings-dislike").value.trim();
    const timeline = document.getElementById("settings-timeline").value.trim();
    state.persona = { goal, dislike, timeline };
    localStorage.setItem("userPersona", JSON.stringify(state.persona));
    renderProfile();
    saveStateToStorage();
    showToast("Planning style saved.");
}

// ── CATEGORIES / TEMPLATES ────────────────────────────────────────────────────

function renderCategories() {
    const dashGrid = document.getElementById("category-selector");
    const eventsGrid = document.getElementById("events-template-grid");

    const markup = categories.map((cat) => `
        <button type="button" class="cat-badge" data-category-id="${cat.id}"
            style="background: ${cat.color}; box-shadow: 0 4px 0 rgba(0,0,0,0.1);">
            <span class="cat-icon">${cat.icon}</span>
            <span>${cat.label}</span>
        </button>
    `).join("");

    dashGrid.innerHTML = markup;
    if (eventsGrid) eventsGrid.innerHTML = markup;

    document.querySelectorAll(".cat-badge").forEach((btn) => {
        btn.addEventListener("click", () => selectCategory(btn.dataset.categoryId, btn));
    });
}

function selectCategory(categoryId, btnEl) {
    state.selectedCategory = categoryId;
    highlightSelectedCategory(categoryId, btnEl);
    renderTemplatePreview(categoryId);
    renderTemplateDetail(categoryId);
    showSection("template-detail");
    showToast("Opened planner template");
}

function highlightSelectedCategory(categoryId, btnEl) {
    document.querySelectorAll(".cat-badge").forEach((b) => b.classList.remove("selected"));
    if (btnEl) { btnEl.classList.add("selected"); return; }
    document.querySelectorAll(`.cat-badge[data-category-id="${categoryId}"]`).forEach((b) => b.classList.add("selected"));
}

function renderTemplatePreview(categoryId) {
    const preview = document.getElementById("template-section");
    const checklistItems = document.getElementById("checklist-items");
    const template = templates[categoryId];
    checklistItems.innerHTML = template.tasks.map((task) => `
        <label class="checklist-row">
            <input type="checkbox">
            <span>${task}</span>
        </label>
    `).join("");
    preview.classList.remove("hidden");
}

function renderTemplateDetail(categoryId) {
    const category = categories.find((c) => c.id === categoryId);
    const template = templates[categoryId];
    if (!category || !template) return;

    document.getElementById("template-title").textContent = `${category.label} Planner`;
    document.getElementById("template-subtitle").textContent = "A dedicated planning section for this template.";
    document.getElementById("template-emoji").textContent = category.icon;
    document.getElementById("template-hero-title").textContent = `${category.label} Template`;
    document.getElementById("template-description").textContent = template.description;
    document.getElementById("template-detail-list").innerHTML = template.tasks.map((t) => `<li>${t}</li>`).join("");
    document.getElementById("template-tips").innerHTML = template.tips.map((t) => `<p>${t}</p>`).join("");
    document.getElementById("template-timeline").innerHTML = template.timeline.map((t) => `<p>${t}</p>`).join("");
    document.getElementById("template-stores").innerHTML = template.stores.map((s) => `<div class="store-card">${s}</div>`).join("");
    document.getElementById("template-spec-grid").innerHTML = `
        <div class="spec-card"><span>Vibe</span><strong>${template.spec.vibe}</strong></div>
        <div class="spec-card"><span>Guests</span><strong>${template.spec.guests}</strong></div>
        <div class="spec-card"><span>Budget</span><strong>${template.spec.budget}</strong></div>
        <div class="spec-card"><span>Best Venue</span><strong>${template.spec.location}</strong></div>
    `;
    document.getElementById("template-hero").style.borderColor = category.color;
}

// ── CUSTOM TEMPLATES ──────────────────────────────────────────────────────────

function getCustomTemplates() {
    return JSON.parse(localStorage.getItem("fep_custom_templates") || "[]");
}

function saveCustomTemplates(items) {
    localStorage.setItem("fep_custom_templates", JSON.stringify(items));
}

function loadCustomTemplates() {
    const custom = getCustomTemplates();
    custom.forEach((t) => {
        templates[t.id] = t;
        if (!categories.find((c) => c.id === t.id)) {
            categories.push({ id: t.id, label: t.label, icon: "✨", color: t.color || "#f97316" });
        }
    });
    renderCategories();
    renderCustomTemplateList();
}

function renderCustomTemplateList() {
    const container = document.getElementById("custom-template-list");
    if (!container) return;
    const custom = getCustomTemplates();
    if (!custom.length) {
        container.innerHTML = `<div class="empty-state">No custom templates yet. Build one above.</div>`;
        return;
    }
    container.innerHTML = `<div class="custom-template-grid">${custom.map((t) => `
        <div class="custom-template-item">
            <button type="button" class="cat-badge" data-custom-template-id="${t.id}" style="background:${t.color || "#f97316"}; width:100%;">
                <span class="cat-icon">✨</span>
                <span>${t.label}</span>
            </button>
            <button type="button" class="btn-remove-template" onclick="removeCustomTemplate('${t.id}')" title="Delete template">✕</button>
        </div>
    `).join("")}</div>`;
    container.querySelectorAll("[data-custom-template-id]").forEach((btn) => {
        btn.addEventListener("click", () => selectCategory(btn.dataset.customTemplateId, btn));
    });
}

function removeCustomTemplate(id) {
    const updated = getCustomTemplates().filter((t) => t.id !== id);
    saveCustomTemplates(updated);
    delete templates[id];
    const catIndex = categories.findIndex((c) => c.id === id);
    if (catIndex !== -1) categories.splice(catIndex, 1);
    renderCategories();
    renderCustomTemplateList();
    showToast("Template deleted.");
}

function saveCustomTemplate() {
    const name = document.getElementById("custom-template-name").value.trim();
    const vibe = document.getElementById("custom-template-vibe").value.trim();
    const guests = document.getElementById("custom-template-guests").value.trim();
    const budget = document.getElementById("custom-template-budget").value.trim();
    const location = document.getElementById("custom-template-location").value.trim();
    const description = document.getElementById("custom-template-description").value.trim();
    const supplies = document.getElementById("custom-template-supplies").value.trim();
    const timelineInput = document.getElementById("custom-template-timeline-input").value.trim();
    const tipsInput = document.getElementById("custom-template-tips-input").value.trim();
    const storesInput = document.getElementById("custom-template-stores-input").value.trim();

    if (!name || !description || !supplies) {
        showToast("Add a template name, description, and supplies first.");
        return;
    }

    const id = `custom-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const customTemplate = {
        id, label: name, color: "#f97316",
        tasks: splitCommaList(supplies),
        description,
        tips: splitCommaList(tipsInput, ["Confirm your schedule", "Prep supplies early", "Leave room for day-of adjustments"]),
        timeline: splitCommaList(timelineInput, ["1 week out: finalize details", "2 days out: shop and prep", "Event day: set up and host"]),
        stores: splitCommaList(storesInput, ["Target for basics", "Walmart for last-minute supplies", "Dollar Tree for extras"]),
        spec: {
            vibe: vibe || "Custom event style",
            guests: guests || "Flexible guest count",
            budget: budget || "Set your own budget",
            location: location || "Choose the best venue"
        }
    };

    const existing = getCustomTemplates().filter((t) => t.id !== id);
    existing.push(customTemplate);
    saveCustomTemplates(existing);

    if (!categories.find((c) => c.id === id)) categories.push({ id, label: name, icon: "✨", color: "#f97316" });
    templates[id] = customTemplate;

    renderCategories();
    renderCustomTemplateList();
    clearCustomTemplateForm();
    showToast("Custom template saved.");
}

function clearCustomTemplateForm() {
    ["custom-template-name","custom-template-vibe","custom-template-guests","custom-template-budget",
     "custom-template-location","custom-template-description","custom-template-supplies",
     "custom-template-timeline-input","custom-template-tips-input","custom-template-stores-input"
    ].forEach((id) => { const el = document.getElementById(id); if (el) el.value = ""; });
}

function splitCommaList(value, fallback = []) {
    const items = value.split(",").map((s) => s.trim()).filter(Boolean);
    return items.length ? items : fallback;
}

// ── GUESTS ────────────────────────────────────────────────────────────────────

function addGuest() {
    const name = document.getElementById("guest-name").value.trim();
    const rsvp = document.getElementById("guest-rsvp").value;
    const allergy = document.getElementById("guest-allergy").value.trim();
    if (!name) { showToast("Please enter a guest name."); return; }
    state.guests.push({ name, rsvp, allergy });
    document.getElementById("guest-name").value = "";
    document.getElementById("guest-allergy").value = "";
    renderGuests();
    updateAnalytics();
    saveStateToStorage();
    showToast(`Added ${name} to the guest list.`);
}

function renderGuests() {
    const tbody = document.getElementById("guest-body");
    tbody.innerHTML = state.guests.map((guest, i) => `
        <tr>
            <td><strong>${guest.name}</strong></td>
            <td>
                <select onchange="updateRSVP(${i}, this.value)">
                    <option value="Pending" ${guest.rsvp === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Confirmed" ${guest.rsvp === "Confirmed" ? "selected" : ""}>Confirmed</option>
                    <option value="Declined" ${guest.rsvp === "Declined" ? "selected" : ""}>Declined</option>
                </select>
            </td>
            <td>${guest.allergy || "No allergies"}</td>
            <td><button type="button" class="btn btn-danger" onclick="removeGuest(${i})">Remove</button></td>
        </tr>
    `).join("");
    updateRSVPCounts();
}

function removeGuest(index) {
    state.guests.splice(index, 1);
    renderGuests();
    updateAnalytics();
    saveStateToStorage();
}

function updateRSVP(index, value) {
    if (!state.guests[index]) return;
    state.guests[index].rsvp = value;
    updateRSVPCounts();
    updateAnalytics();
    saveStateToStorage();
}

function updateRSVPCounts() {
    const total = state.guests.length;
    const confirmed = state.guests.filter((g) => g.rsvp === "Confirmed").length;
    const percent = total === 0 ? 0 : Math.round((confirmed / total) * 100);
    countUp(document.getElementById("rsvp-stat"), percent, "", "%");
}

// ── BUDGET ────────────────────────────────────────────────────────────────────

function addExpense() {
    const name = document.getElementById("expense-name").value.trim();
    const cost = parseFloat(document.getElementById("expense-cost").value);
    const limit = parseFloat(document.getElementById("budget-limit").value);
    if (!name || Number.isNaN(cost)) { showToast("Add both an expense name and amount."); return; }
    state.budgetLimit = Number.isNaN(limit) ? state.budgetLimit : limit;
    state.expenses.push({ name, cost });
    document.getElementById("expense-name").value = "";
    document.getElementById("expense-cost").value = "";
    updateBudget();
    updateAnalytics();
    saveStateToStorage();
}

function updateBudget() {
    const inputLimit = parseFloat(document.getElementById("budget-limit").value);
    if (!Number.isNaN(inputLimit)) state.budgetLimit = inputLimit;

    const total = state.expenses.reduce((sum, e) => sum + e.cost, 0);
    const remaining = state.budgetLimit - total;
    const over = total > state.budgetLimit;

    document.getElementById("budget-warning").classList.toggle("hidden", !over);

    const summaryEl = document.getElementById("budget-summary");
    if (summaryEl) {
        summaryEl.innerHTML = `
            <div class="budget-row"><span>Budget limit</span><strong>$${state.budgetLimit.toFixed(2)}</strong></div>
            <div class="budget-row"><span>Total spent</span><strong style="color:${over ? "var(--red)" : "var(--text)"}">$${total.toFixed(2)}</strong></div>
            <div class="budget-row"><span>Remaining</span><strong style="color:${over ? "var(--red)" : "var(--green)"}">$${remaining.toFixed(2)}</strong></div>
        `;
    }

    document.getElementById("expense-list").innerHTML = state.expenses.length
        ? state.expenses.map((e, i) => `
            <li class="expense-row">
                <span>${e.name}</span>
                <span>$${e.cost.toFixed(2)}</span>
                <button type="button" class="btn-icon-remove" onclick="removeExpense(${i})" title="Remove expense">✕</button>
            </li>
          `).join("")
        : `<li class="empty-state">No expenses yet.</li>`;

    const left = remaining;
    const budgetStatEl = document.getElementById("budget-stat");
    if (budgetStatEl) {
        budgetStatEl.style.color = over ? "var(--red)" : "var(--green)";
        countUp(budgetStatEl, Math.max(left, 0), "$", "", 500);
    }

    renderSavings();
}

function removeExpense(index) {
    state.expenses.splice(index, 1);
    updateBudget();
    updateAnalytics();
    saveStateToStorage();
}

// ── SAVINGS ───────────────────────────────────────────────────────────────────

function updateSavings() {
    state.income = parseFloat(document.getElementById("savings-income").value) || 0;
    state.savingsGoal = parseFloat(document.getElementById("savings-goal").value) || 0;
    state.savingsMonths = parseFloat(document.getElementById("savings-months").value) || 3;
    saveStateToStorage();
    renderSavings();
    showToast("Savings updated.");
}

function renderSavings() {
    const totalSpent = state.expenses.reduce((sum, e) => sum + e.cost, 0);
    const moneyLeft = state.income - totalSpent;
    const neededPerMonth = state.savingsMonths > 0 ? (state.savingsGoal / state.savingsMonths) : state.savingsGoal;

    const incomeEl = document.getElementById("savings-income-display");
    const expEl = document.getElementById("savings-expenses-display");
    const leftEl = document.getElementById("savings-left-display");
    if (!incomeEl) return;

    countUp(incomeEl, state.income, "$", "", 500);
    countUp(expEl, totalSpent, "$", "", 500);
    leftEl.style.color = moneyLeft < 0 ? "var(--red)" : "var(--green)";
    countUp(leftEl, Math.abs(moneyLeft), moneyLeft < 0 ? "-$" : "$", "", 500);

    // Populate inputs with current values if empty
    const incInput = document.getElementById("savings-income");
    const goalInput = document.getElementById("savings-goal");
    const monthsInput = document.getElementById("savings-months");
    if (incInput && !incInput.value && state.income) incInput.value = state.income;
    if (goalInput && !goalInput.value && state.savingsGoal) goalInput.value = state.savingsGoal;
    if (monthsInput && state.savingsMonths) monthsInput.value = state.savingsMonths;

    // Broke-o-meter
    const spentPercent = state.income > 0 ? Math.min(Math.round((totalSpent / state.income) * 100), 100) : 0;
    let brokeLabel, brokeColor;
    if (spentPercent >= 100) { brokeLabel = "🚨 Maximum broke. Time to potluck."; brokeColor = "#ef4444"; }
    else if (spentPercent >= 80) { brokeLabel = "😬 Very tight. Cut one expense."; brokeColor = "#fd9644"; }
    else if (spentPercent >= 60) { brokeLabel = "😅 Getting there. Watch it."; brokeColor = "#feca57"; }
    else if (spentPercent >= 40) { brokeLabel = "🙂 Manageable. Keep tracking."; brokeColor = "#1dd1a1"; }
    else { brokeLabel = "😎 Doing well. Save more!"; brokeColor = "#22c55e"; }

    const meterEl = document.getElementById("broke-meter");
    if (meterEl) {
        meterEl.innerHTML = `
            <div class="broke-track">
                <div class="broke-fill" style="width:${spentPercent}%;background:${brokeColor};"></div>
            </div>
            <div style="margin-top:8px;font-weight:700;color:${brokeColor};">${brokeLabel}</div>
            <div style="margin-top:4px;color:var(--muted);font-size:0.85rem;">${spentPercent}% of income spent on event</div>
        `;
    }

    // Savings advice
    const adviceEl = document.getElementById("savings-advice");
    if (adviceEl) {
        const canSavePerMonth = state.income > 0 ? Math.max(moneyLeft / state.savingsMonths, 0) : 0;
        const monthsNeeded = state.savingsGoal > 0 && canSavePerMonth > 0 ? Math.ceil(state.savingsGoal / canSavePerMonth) : null;
        adviceEl.innerHTML = `
            <div class="advice-row">Save <strong>$${neededPerMonth.toFixed(2)}/mo</strong> to hit your goal</div>
            ${monthsNeeded ? `<div class="advice-row">At current rate: <strong>${monthsNeeded} months</strong></div>` : ""}
        `;
    }

    // Progress bar
    const progressEl = document.getElementById("savings-progress-bar");
    const progressLabel = document.getElementById("savings-progress-label");
    if (progressEl && state.savingsGoal > 0) {
        const savedSoFar = Math.max(moneyLeft, 0);
        const pct = Math.min(Math.round((savedSoFar / state.savingsGoal) * 100), 100);
        progressEl.innerHTML = `
            <div class="broke-track">
                <div class="broke-fill" style="width:${pct}%;background:var(--green);"></div>
            </div>
        `;
        if (progressLabel) progressLabel.textContent = `$${savedSoFar.toFixed(2)} of $${state.savingsGoal.toFixed(2)} goal (${pct}%)`;
    } else if (progressEl) {
        progressEl.innerHTML = `<div class="empty-state">Set a savings goal above to track progress.</div>`;
    }
}

// ── ANALYTICS ─────────────────────────────────────────────────────────────────

function updateAnalytics() {
    const confirmed = state.guests.filter((g) => g.rsvp === "Confirmed").length;
    const totalGuests = state.guests.length || 1;
    const rsvpPct = Math.round((confirmed / totalGuests) * 100);
    document.getElementById("rsvp-chart").innerHTML = `
        <div class="bar" style="width:${Math.max(rsvpPct, 8)}%">Confirmed: ${confirmed}</div>
    `;

    const totalCost = state.expenses.reduce((sum, e) => sum + e.cost, 0);
    const budgetPct = state.budgetLimit === 0 ? 0 : Math.min(Math.round((totalCost / state.budgetLimit) * 100), 100);
    document.getElementById("budget-chart").innerHTML = `
        <div class="bar" style="width:${Math.max(budgetPct, 8)}%;background:${totalCost > state.budgetLimit ? "var(--red)" : "var(--green)"}">
            Spent: $${totalCost.toFixed(2)}
        </div>
    `;

    const allergies = state.guests.filter((g) => g.allergy);
    document.getElementById("allergy-summary").innerHTML = allergies.length
        ? `<ul>${allergies.map((g) => `<li>${g.name}: ${g.allergy}</li>`).join("")}</ul>`
        : "No allergies reported.";

    const checklistEl = document.getElementById("checklist-progress");
    if (checklistEl) {
        const checkboxes = document.querySelectorAll("#checklist-items input[type=checkbox]");
        const checked = [...checkboxes].filter((c) => c.checked).length;
        const total = checkboxes.length || 1;
        const pct = Math.round((checked / total) * 100);
        checklistEl.innerHTML = `
            <div class="bar" style="width:${Math.max(pct, 8)}%;background:var(--primary)">
                ${checked} / ${checkboxes.length} tasks done
            </div>
        `;
    }
}

// ── CALENDAR ──────────────────────────────────────────────────────────────────

function toggleCalForm() {
    const form = document.getElementById("cal-event-form");
    form.style.display = form.style.display === "none" ? "" : "none";
}

function saveCalendarEvent() {
    const title = document.getElementById("cal-event-title").value.trim();
    const date = document.getElementById("cal-event-date").value;
    const color = document.getElementById("cal-event-color").value;
    if (!title || !date) { showToast("Enter a title and date."); return; }
    state.calendarEvents.push({ title, date, color });
    state.calendarEvents.sort((a, b) => a.date.localeCompare(b.date));
    document.getElementById("cal-event-title").value = "";
    document.getElementById("cal-event-date").value = "";
    saveStateToStorage();
    renderCalendar();
    showToast(`Event "${title}" added.`);
}

function removeCalendarEvent(index) {
    state.calendarEvents.splice(index, 1);
    saveStateToStorage();
    renderCalendar();
}

function renderCalendar() {
    const year = state.calendarYear;
    const month = state.calendarMonth;
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    document.getElementById("cal-month-label").textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

    // Map events by date
    const eventsByDate = {};
    state.calendarEvents.forEach((ev) => {
        if (!eventsByDate[ev.date]) eventsByDate[ev.date] = [];
        eventsByDate[ev.date].push(ev);
    });

    let cells = "";
    for (let i = 0; i < firstDay; i++) cells += `<div class="cal-cell cal-empty"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        const isToday = dateStr === todayStr;
        const dayEvents = eventsByDate[dateStr] || [];
        const dots = dayEvents.map((ev) => `<span class="cal-dot" style="background:${ev.color}"></span>`).join("");
        cells += `
            <div class="cal-cell ${isToday ? "cal-today" : ""}">
                <span class="cal-day-num">${d}</span>
                <div class="cal-dots">${dots}</div>
            </div>
        `;
    }

    document.getElementById("cal-grid").innerHTML = cells;

    // Render scrollable events list
    const upcoming = state.calendarEvents.filter((ev) => ev.date >= todayStr);
    const past = state.calendarEvents.filter((ev) => ev.date < todayStr);
    const scrollEl = document.getElementById("events-scroll");

    if (!state.calendarEvents.length) {
        scrollEl.innerHTML = `<div class="empty-state">No events yet. Click + Add Event to get started.</div>`;
        return;
    }

    const renderEventItem = (ev, i) => `
        <div class="event-item">
            <div class="event-dot" style="background:${ev.color}"></div>
            <div class="event-info">
                <strong>${ev.title}</strong>
                <span>${formatDate(ev.date)}</span>
            </div>
            <button type="button" class="btn-icon-remove" onclick="removeCalendarEvent(${i})" title="Remove event">✕</button>
        </div>
    `;

    scrollEl.innerHTML = `
        ${upcoming.length ? `<div class="events-group-label">Upcoming</div>` + upcoming.map((ev) => renderEventItem(ev, state.calendarEvents.indexOf(ev))).join("") : ""}
        ${past.length ? `<div class="events-group-label" style="margin-top:12px;opacity:0.6;">Past</div>` + past.map((ev) => renderEventItem(ev, state.calendarEvents.indexOf(ev))).join("") : ""}
    `;
}

function formatDate(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

// ── NOTES ─────────────────────────────────────────────────────────────────────

function addNote() {
    const title = document.getElementById("note-title").value.trim();
    const body = document.getElementById("note-body").value.trim();
    const color = document.getElementById("note-color").value;
    if (!title && !body) { showToast("Write something first."); return; }
    state.notes.unshift({ title: title || "Note", body, color, date: new Date().toLocaleDateString() });
    document.getElementById("note-title").value = "";
    document.getElementById("note-body").value = "";
    saveStateToStorage();
    renderNotes();
}

function removeNote(index) {
    state.notes.splice(index, 1);
    saveStateToStorage();
    renderNotes();
}

function renderNotes() {
    const grid = document.getElementById("notes-grid");
    if (!grid) return;
    if (!state.notes.length) {
        grid.innerHTML = `<div class="empty-state">No notes yet. Add one above.</div>`;
        return;
    }
    grid.innerHTML = state.notes.map((note, i) => `
        <div class="note-card" style="background:${note.color}">
            <div class="note-header">
                <strong>${note.title}</strong>
                <button type="button" class="btn-icon-remove" onclick="removeNote(${i})" title="Remove note">✕</button>
            </div>
            <div class="note-body">${note.body || ""}</div>
            <div class="note-date">${note.date}</div>
        </div>
    `).join("");
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────

function saveEventDate() {
    const val = document.getElementById("settings-event-date").value;
    if (!val) { showToast("Pick a date first."); return; }
    state.eventDate = new Date(val + "T12:00:00");
    saveStateToStorage();
    updateCountdown();
    showToast("Event date saved.");
}

// ── COUNTDOWN ─────────────────────────────────────────────────────────────────

function updateCountdown() {
    const now = new Date();
    const diff = state.eventDate - now;
    const el = document.getElementById("countdown-timer");
    if (diff <= 0) { el.textContent = "Event day!"; return; }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    el.textContent = `${days}d ${hours}h left`;
}

// ── MISC ──────────────────────────────────────────────────────────────────────

function showToast(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("toast-out");
        setTimeout(() => toast.remove(), 260);
    }, 2800);
}

function countUp(el, target, prefix = "", suffix = "", duration = 600) {
    if (!el) return;
    const start = 0;
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;
    const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = start + (target - start) * eased;
        el.textContent = prefix + (isFloat ? value.toFixed(2) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function copyEventLink() {
    navigator.clipboard.writeText(window.location.href);
    showToast("Event link copied to clipboard.");
}

function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then((p) => {
            if (p === "granted") showToast("Notifications enabled.");
        });
    }
}
