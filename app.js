// State Management
let state = {
    guests: [],
    expenses: [],
    budgetLimit: 1000,
    persona: {
        type: '',
        goal: '',
        dislike: '',
        timeline: ''
    },
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tutorialStep: 0
};

const categories = [
    { name: 'Birthday 🎉', color: '#ff9ff3' },
    { name: 'Playdate 🎈', color: '#feca57' },
    { name: 'School Event 🏫', color: '#48dbfb' },
    { name: 'Bake Sale 🍪', color: '#ff9f43' },
    { name: 'Family Dinner 🧺', color: '#1dd1a1' },
    { name: 'Sleepover 🌙', color: '#5f27cd' },
    { name: 'Sports Day ⚽', color: '#ee5253' },
    { name: 'Holiday Party 🎄', color: '#0abde3' },
    { name: 'Picnic 🍉', color: '#10ac84' },
    { name: 'Graduation 🎓', color: '#54a0ff' },
    { name: 'Anniversary 💖', color: '#f368e0' }
];

const templates = {
    'Birthday 🎉': ['Order Cake', 'Buy Goodie Bags', 'Send Paperless Post', 'Confirm RSVP Count'],
    'Playdate 🎈': ['Snack Prep', 'Safety Check Toys', 'Message Parents', 'Set End Time'],
    'School Event 🏫': ['Volunteer Signup', 'Permission Slips', 'Room Parent Sync', 'Decorations'],
    'Bake Sale 🍪': ['Ingredient Check', 'Packaging Labels', 'Cash Box', 'Folding Table'],
    'Family Dinner 🧺': ['Grocery List', 'Check Allergies', 'Set Playlist', 'Activity for Kids'],
    'Sleepover 🌙': ['Extra Pillows', 'Movie Selection', 'Breakfast Prep', 'Emergency Contact List'],
    'Sports Day ⚽': ['Water Bottles', 'Orange Slices', 'Team Jersey Check', 'First Aid Kit'],
    'Holiday Party 🎄': ['Theme Decorations', 'Gift Exchange Rules', 'Holiday Treats', 'Playlist'],
    'Picnic 🍉': ['Cooler Pack', 'Outdoor Blankets', 'Sunscreen', 'Bug Spray'],
    'Graduation 🎓': ['Cap and Gown', 'Invitations', 'Venue Booking', 'Photo Slideshow'],
    'Anniversary 💖': ['Reservation', 'Gift Selection', 'Flower Order']
};

const tutorialSteps = [
    { text: "Hi! This is your home base for planning amazing events.", element: "dashboard-section" },
    { text: "Select a Category to get a custom checklist for your event.", element: "category-selector" },
    { text: "Manage your guests and track allergies here.", element: "guests-section" },
    { text: "Keep your budget in check to avoid overspending.", element: "budget-section" },
    { text: "See your progress and guest breakdown in Analytics.", element: "analytics-section" }
];

// Initialize App
window.onload = () => {
    renderCategories();
    updateCountdown();
    requestNotificationPermission();
    setInterval(updateCountdown, 1000);
};

function initAfterAuth() {
    renderProfile();
    if (!localStorage.getItem('tutorialDone')) startTutorial();
}

function startTutorial() {
    state.tutorialStep = 0;
    document.getElementById('tutorial-overlay').classList.remove('hidden');
    nextTutorialStep();
}

function nextTutorialStep() {
    if (state.tutorialStep >= tutorialSteps.length) {
        document.getElementById('tutorial-overlay').classList.add('hidden');
        localStorage.setItem('tutorialDone', 'true');
        return;
    }
    
    const step = tutorialSteps[state.tutorialStep];
    document.getElementById('tutorial-text').innerText = step.text;
    
    // Remove previous highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));
    
    // Add new highlight (this is simplified for this demo)
    const target = document.getElementById(step.element);
    if (target) target.classList.add('tutorial-highlight');
    
    state.tutorialStep++;
}

function renderProfile() {
    const profile = JSON.parse(localStorage.getItem('userPersona')) || state.persona;
    document.getElementById('profile-content').innerHTML = `
        <p>✨ <strong>Goal:</strong> ${profile.goal || 'Stay organized'}</p>
        <p>🚫 <strong>Dislike:</strong> ${profile.dislike || 'Clutter'}</p>
        <p>📅 <strong>Timeline:</strong> ${profile.timeline || 'TBD'}</p>
    `;
}

function renderCategories() {
    const container = document.getElementById('category-selector');
    container.innerHTML = categories.map(cat => `
        <div class="cat-badge" style="background: ${cat.color}; box-shadow: 0 4px 0 rgba(0,0,0,0.1);" onclick="selectCategory('${cat.name}')">
            <span style="font-size: 1.2rem; display: block;">${cat.name.split(' ')[1]}</span>
            ${cat.name.split(' ')[0]}
        </div>
    `).join('');
    container.innerHTML = categories.map(cat => {
        const parts = cat.name.split(' ');
        const emoji = parts.pop();
        const label = parts.join(' ');
        return `
            <div class="cat-badge" style="background: ${cat.color}; box-shadow: 0 4px 0 rgba(0,0,0,0.1);" onclick="selectCategory('${cat.name}')">
                <span style="font-size: 1.2rem; display: block;">${emoji}</span>
                ${label}
            </div>
        `;
    }).join('');
}

function selectCategory(name, el) {
    const checklistItems = document.getElementById('checklist-items');
    const templateSection = document.getElementById('template-section');
    
    // Visual feedback
    document.querySelectorAll('.cat-badge').forEach(b => b.style.outline = 'none');
    if (event && event.currentTarget) event.currentTarget.style.outline = '3px solid var(--primary)';
    
    const tasks = templates[name] || [];
    checklistItems.innerHTML = tasks.map(task => `<li><input type="checkbox"> ${task}</li>`).join('');
    templateSection.classList.remove('hidden');
    showToast(`Loaded ${name} checklist`);
}

function showSection(id, btn) {
    ['dashboard', 'guests', 'budget', 'analytics'].forEach(s => {
        document.getElementById(`${s}-section`).classList.add('hidden');
    });
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const target = document.getElementById(`${id}-section`);
    if (target) target.classList.remove('hidden');
    if (id === 'analytics') updateAnalytics();
}

function openModal() {
    showToast("Opening Event Creator...");
}

function getAccounts() {
    return JSON.parse(localStorage.getItem('fep_accounts') || '{}');
}

function saveAccounts(accounts) {
    localStorage.setItem('fep_accounts', JSON.stringify(accounts));
}

function switchAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    tabs[0].classList.toggle('active', tab === 'signin');
    tabs[1].classList.toggle('active', tab === 'signup');
    document.getElementById('signin-form').style.display = tab === 'signin' ? '' : 'none';
    document.getElementById('signup-form').style.display = tab === 'signup' ? '' : 'none';
}

function authSuccess(name) {
    document.getElementById('auth-screen').classList.remove('visible');
    document.getElementById('auth-screen').classList.add('hidden');
    showToast(`Welcome, ${name}!`);
    initAfterAuth();
}

function handleSignIn() {
    const email = document.getElementById('signin-email').value.trim().toLowerCase();
    const password = document.getElementById('signin-password').value;
    const errEl = document.getElementById('signin-error');
    const accounts = getAccounts();
    if (accounts[email] && accounts[email].password === password) {
        errEl.style.display = 'none';
        localStorage.setItem('fep_current_user', email);
        authSuccess(accounts[email].name);
    } else {
        errEl.textContent = 'Incorrect email or password.';
        errEl.style.display = 'block';
    }
}

function handleSignUp() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const errEl = document.getElementById('signup-error');
    if (!name || !email || !password) {
        errEl.textContent = 'Please fill in all fields.';
        errEl.style.display = 'block';
        return;
    }
    if (password !== confirm) {
        errEl.textContent = 'Passwords do not match.';
        errEl.style.display = 'block';
        return;
    }
    const accounts = getAccounts();
    if (accounts[email]) {
        errEl.textContent = 'An account with that email already exists.';
        errEl.style.display = 'block';
        return;
    }
    accounts[email] = { name, password };
    saveAccounts(accounts);
    localStorage.setItem('fep_current_user', email);
    errEl.style.display = 'none';
    authSuccess(name);
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('fep_theme', next);
}

function initTheme() {
    const saved = localStorage.getItem('fep_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
}

// Guest & Allergy Logic
function addGuest() {
    const name = document.getElementById('guest-name').value;
    const rsvp = document.getElementById('guest-rsvp').value;
    const allergy = document.getElementById('guest-allergy').value;
    
    if (!name) return showToast("Please enter a name");
    
    state.guests.push({ name, rsvp, allergy });
    renderGuests();
    showToast(`Added ${name} to guest list`);
}

function renderGuests() {
    const tbody = document.getElementById('guest-body');
    tbody.innerHTML = state.guests.map((g, i) => `
        <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding:12px;"><strong>${g.name}</strong></td>
            <td><select onchange="updateRSVP(${i}, this.value)">
                <option value="Pending" ${g.rsvp === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Confirmed" ${g.rsvp === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="Declined" ${g.rsvp === 'Declined' ? 'selected' : ''}>Declined</option>
            </select></td>
            <td style="color:var(--muted);">${g.allergy || 'No allergies'}</td>
            <td><button class="btn-danger btn-sm" onclick="state.guests.splice(${i},1);renderGuests()">Remove</button></td>
        </tr>
    `).join('');
    updateRSVPCounts();
}

// Budget Logic
function addExpense() {
    const name = document.getElementById('expense-name').value;
    const cost = parseFloat(document.getElementById('expense-cost').value);
    
    if (!name || isNaN(cost)) return;
    
    state.expenses.push({ name, cost });
    updateBudget();
}

function updateBudget() {
    const limit = parseFloat(document.getElementById('budget-limit').value);
    const total = state.expenses.reduce((sum, e) => sum + e.cost, 0);
    
    const warning = document.getElementById('budget-warning');
    total > limit ? warning.classList.remove('hidden') : warning.classList.add('hidden');
    
    document.getElementById('expense-list').innerHTML = state.expenses.map(e => 
        `<li>${e.name}: $${e.cost}</li>`).join('');
}

// Analytics Logic
function updateAnalytics() {
    const confirmed = state.guests.filter(g => g.rsvp === 'Confirmed').length;
    const total = state.guests.length || 1;
    const rsvpPercent = (confirmed / total) * 100;
    
    document.getElementById('rsvp-chart').innerHTML = `
        <div class="bar" style="width: ${rsvpPercent}%">Confirmed: ${confirmed}</div>
    `;
    
    const totalCost = state.expenses.reduce((sum, e) => sum + e.cost, 0);
    const budgetPercent = Math.min((totalCost / (state.budgetLimit || 1)) * 100, 100);
    document.getElementById('budget-chart').innerHTML = `
        <div class="bar" style="width: ${budgetPercent}%; background: ${totalCost > state.budgetLimit ? 'red' : 'green'}">
            Spent: $${totalCost}
        </div>
    `;

    // Allergy Summary
    const allergies = state.guests
        .filter(g => g.allergy && g.allergy.trim() !== '')
        .map(g => `${g.name}: ${g.allergy}`);
    
    document.getElementById('allergy-summary').innerHTML = allergies.length > 0 
        ? `<ul>${allergies.map(a => `<li>${a}</li>`).join('')}</ul>`
        : "No allergies reported.";
}

// Utilities
function showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function updateCountdown() {
    const now = new Date();
    const diff = state.eventDate - now;
    if (diff <= 0) return;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    document.getElementById('countdown-timer').innerText = `${days}d ${hours}h left`;
}

function copyEventLink() {
    navigator.clipboard.writeText(window.location.href);
    showToast("Event link copied to clipboard!");
}

function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") showToast("Notifications enabled!");
        });
    }
}