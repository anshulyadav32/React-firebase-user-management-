// Authentication Functions

function updateUI() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const userSection = document.getElementById('user-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const chatSection = document.getElementById('chat-section');
  const userEmail = document.getElementById('user-email');

  // Check if elements exist before manipulating them
  if (!loginForm || !registerForm || !userSection || !dashboardSection || !chatSection) {
    console.log('Some UI elements not found, waiting for DOM to load...');
    return;
  }

  if (user) {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    userSection.classList.remove('hidden');
    dashboardSection.classList.remove('hidden');
    chatSection.classList.add('hidden'); // Hide chat initially, show dashboard
    if (userEmail) {
      userEmail.textContent = user.email;
    }
    
    // Update dashboard info
    updateDashboardInfo();
  } else {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    userSection.classList.add('hidden');
    dashboardSection.classList.add('hidden');
    chatSection.classList.add('hidden');
  }
}

function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  clearAuthStatus();
}

function showLogin() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  clearAuthStatus();
}

function showAuthStatus(message, isError = false) {
  const status = document.getElementById('auth-status');
  status.innerHTML = `<div class="status ${isError ? 'error' : 'success'}">${message}</div>`;
}

function clearAuthStatus() {
  document.getElementById('auth-status').innerHTML = '';
}

async function signInWithGoogle() {
  try {
    // Get the auth instance and google provider
    const auth = window.firebaseAuth();
    const googleProvider = window.googleAuthProvider();
    
    if (!auth || !googleProvider) {
      throw new Error('Firebase not initialized properly');
    }

    // Use redirect instead of popup for better compatibility
    showAuthStatus('Redirecting to Google sign-in...');
    await auth.signInWithRedirect(googleProvider);
    
  } catch (error) {
    console.error('Google sign-in error:', error);
    showAuthStatus('Google sign-in failed: ' + error.message, true);
  }
}

async function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showAuthStatus('Please fill in all fields', true);
    return;
  }

  try {
    const auth = window.firebaseAuth();
    if (!auth) {
      throw new Error('Firebase not initialized properly');
    }
    
    await auth.signInWithEmailAndPassword(email, password);
    showAuthStatus('Login successful!');
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
  } catch (error) {
    showAuthStatus(`Login failed: ${error.message}`, true);
  }
}

async function registerUser() {
  const name = document.getElementById('registerName').value;
  const surname = document.getElementById('registerSurname').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!name || !surname || !email || !password || !confirmPassword) {
    showAuthStatus('Please fill in all fields', true);
    return;
  }

  if (password !== confirmPassword) {
    showAuthStatus('Passwords do not match', true);
    return;
  }

  if (password.length < 6) {
    showAuthStatus('Password must be at least 6 characters', true);
    return;
  }

  try {
    const auth = window.firebaseAuth();
    if (!auth) {
      throw new Error('Firebase not initialized properly');
    }
    
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    
    // Update user profile with name
    await userCredential.user.updateProfile({
      displayName: `${name} ${surname}`
    });
    
    showAuthStatus('Account created successfully!');
    
    // Clear form fields
    document.getElementById('registerName').value = '';
    document.getElementById('registerSurname').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('confirmPassword').value = '';
  } catch (error) {
    showAuthStatus(`Registration failed: ${error.message}`, true);
  }
}

async function logout() {
  try {
    const auth = window.firebaseAuth();
    if (!auth) {
      throw new Error('Firebase not initialized properly');
    }
    
    await auth.signOut();
    showAuthStatus('Logged out successfully');
    
    // Clear all form fields
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerName').value = '';
    document.getElementById('registerSurname').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('confirmPassword').value = '';
  } catch (error) {
    showAuthStatus(`Logout failed: ${error.message}`, true);
  }
}