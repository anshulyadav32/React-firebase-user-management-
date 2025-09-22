// Dashboard Functions

function updateDashboardInfo() {
  // Update last login time
  const lastLoginElement = document.getElementById('last-login');
  const now = new Date();
  lastLoginElement.textContent = now.toLocaleTimeString();
  
  // Add login activity
  addActivity('🔐', 'Successfully logged in', 'Just now');
}

function addActivity(icon, message, time) {
  const activityList = document.getElementById('activity-list');
  const activityItem = document.createElement('div');
  activityItem.className = 'activity-item';
  activityItem.innerHTML = `
    <div class="activity-icon">${icon}</div>
    <div class="activity-content">
      <p>${message}</p>
      <span class="activity-time">${time}</span>
    </div>
  `;
  
  // Add to top of list
  activityList.insertBefore(activityItem, activityList.firstChild);
  
  // Keep only last 5 activities
  while (activityList.children.length > 5) {
    activityList.removeChild(activityList.lastChild);
  }
}

function showDashboard() {
  const dashboardSection = document.getElementById('dashboard-section');
  const chatSection = document.getElementById('chat-section');
  const dashboardBtn = document.getElementById('dashboard-btn');
  const composeBtn = document.getElementById('compose-btn');
  
  dashboardSection.classList.remove('hidden');
  chatSection.classList.add('hidden');
  
  dashboardBtn.classList.add('active');
  composeBtn.classList.remove('active');
}

function showEmailComposer() {
  const dashboardSection = document.getElementById('dashboard-section');
  const chatSection = document.getElementById('chat-section');
  const dashboardBtn = document.getElementById('dashboard-btn');
  const composeBtn = document.getElementById('compose-btn');
  
  dashboardSection.classList.add('hidden');
  chatSection.classList.remove('hidden');
  
  dashboardBtn.classList.remove('active');
  composeBtn.classList.add('active');
}