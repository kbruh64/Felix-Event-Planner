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
    { name: 'Wedding', color: 'var(--cat-wedding)' },
    { name: 'Corporate', color: 'var(--cat-corporate)' },
    { name: 'Birthday', color: 'var(--cat-birthday)' },
    { name: 'Graduation', color: '#6366f1' },
    { name: 'Anniversary', color: '#ec4899' },
    { name: 'Game Night', color: '#8b5cf6' },
    { name: 'Workshop', color: 'var(--cat-workshop)' },
    { name: 'Concert', color: 'var(--cat-concert)' },
    { name: 'Dinner', color: 'var(--cat-dinner)' },
    { name: 'Picnic', color: 'var(--cat-picnic)' },
    { name: 'Holiday', color: 'var(--cat-holiday)' }
];

const templates = {
    'Wedding': ['Book Venue', 'Send Invitations', 'Choose Catering', 'Dress Fitting'],
    'Birthday': ['Buy Cake', 'Decorate Room', 'Prepare Games', 'Party Bags'],
    'Corporate': ['Rent AV Equipment', 'Confirm Speakers', 'Print Badges', 'Book Catering'],
    'Graduation': ['Order Gown', 'Invitations', 'Venue Booking', 'Photo Slideshow'],
    'Anniversary': ['Reservation', 'Gift Selection', 'Flower Order'],
    'Game Night': ['Select Games', 'Snack Prep', 'Scoreboard Setup'],
    'Workshop': ['Create Handouts', 'Set Up Projector', 'Email Reminders'],
    'Concert': ['Sound Check', 'Ticket Sales', 'Security Plan'],
    'Dinner': ['Menu Planning', 'Grocery Shopping', 'Set Table'],
    'Picnic': ['Pack Blanket', 'Prepare Sandwiches', 'Check Weather'],
    'Holiday': ['Buy Decorations', 'Plan Activities', 'Secret Santa']
};

const tutorialSteps = [
    { text: "Welcome! This is your Dashboard. Check your countdown here.", element: "dashboard-section" },
    { text: "Select a Category to get a custom checklist for your event.", element: "category-selector" },
    { text: "Manage your guests and track allergies here.", element: "guests-section" },
    { text: "Keep your budget in check to avoid overspending.", element: "budget-section" },
    { text: "See your progress and guest breakdown in Analytics.", element: "analytics-section" }
];

// Initialize App
window.onload = () => {
    if (!localStorage.getItem('onboarded')) {
        document.getElementById('onboarding-modal').classList.remove('hidden');
    } else {
        renderProfile();
        if (!localStorage.getItem('tutorialDone')) startTutorial();
    }
    renderCategories();
    updateCountdown();
    requestNotificationPermission();
    setInterval(updateCountdown, 1000);
};

function finishOnboarding() {
    state.persona = {
        type: document.getElementById('user-type').value,
        goal: document.getElementById('user-goal').value,
        dislike: document.getElementById('user-dislike').value,
        timeline: document.getElementById('user-timeline').value
    };
    
    localStorage.setItem('onboarded', 'true');
    localStorage.setItem('userPersona', JSON.stringify(state.persona));
    document.getElementById('onboarding-modal').classList.add('hidden');
    renderProfile();
    startTutorial();
    showToast(`Setup complete for ${state.persona.type} mode!`);
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
        <p><strong>Goal:</strong> ${profile.goal || 'Stay organized'}</p>
        <p><strong>Avoid:</strong> ${profile.dislike || 'Clutter'}</p>
        <p><strong>Timeline:</strong> ${profile.timeline || 'TBD'}</p>
    `;
}

function renderCategories() {
    const container = document.getElementById('category-selector');
    container.innerHTML = categories.map(cat => `
        <div class="cat-badge" style="background: ${cat.color}" onclick="selectCategory('${cat.name}')">
            ${cat.name}
        </div>
    `).join('');
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

    document.getElementById(`${id}-section`).classList.remove('hidden');
    if (id === 'analytics') updateAnalytics();
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
        <tr>
            <td>${g.name}</td>
            <td>${g.rsvp}</td>
            <td>${g.allergy || 'None'}</td>
            <td><button onclick="state.guests.splice(${i},1);renderGuests()">Delete</button></td>
        </tr>
    `).join('');
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