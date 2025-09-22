// Profile Management Functions

function loadProfileData() {
  const user = auth.currentUser;
  if (user) {
    // Load basic user info
    document.getElementById('profile-name').value = user.displayName || '';
    document.getElementById('profile-email').value = user.email || '';
    document.getElementById('profile-phone').value = user.phoneNumber || '';
    
    // Load profile picture
    if (user.photoURL) {
      document.getElementById('profile-avatar').src = user.photoURL;
    }
    
    // Set account creation date
    if (user.metadata && user.metadata.creationTime) {
      const creationDate = new Date(user.metadata.creationTime).toLocaleDateString();
      document.getElementById('account-created').textContent = creationDate;
    }
    
    // Set last sign in
    if (user.metadata && user.metadata.lastSignInTime) {
      const lastSignIn = new Date(user.metadata.lastSignInTime).toLocaleDateString();
      document.getElementById('last-signin').textContent = lastSignIn;
    }
    
    // Set email verification status
    document.getElementById('email-verified').textContent = user.emailVerified ? 'Verified' : 'Not Verified';
    
    // Set provider info
    if (user.providerData && user.providerData.length > 0) {
      const provider = user.providerData[0].providerId;
      document.getElementById('auth-provider').textContent = provider === 'google.com' ? 'Google' : 'Email/Password';
    }
  }
}

function toggleEditMode() {
  const editBtn = document.getElementById('edit-profile-btn');
  const saveBtn = document.getElementById('save-profile-btn');
  const cancelBtn = document.getElementById('cancel-edit-btn');
  const inputs = document.querySelectorAll('.profile-section input[type="text"], .profile-section input[type="email"], .profile-section input[type="tel"]');
  
  const isEditing = editBtn.style.display === 'none';
  
  if (isEditing) {
    // Cancel edit mode
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    
    inputs.forEach(input => {
      input.disabled = true;
    });
    
    // Reload original data
    loadProfileData();
  } else {
    // Enter edit mode
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
    
    inputs.forEach(input => {
      input.disabled = false;
    });
  }
}

async function saveProfile() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const displayName = document.getElementById('profile-name').value;
    
    await updateProfile(user, {
      displayName: displayName
    });
    
    showNotification('Profile updated successfully!', 'success');
    toggleEditMode();
  } catch (error) {
    console.error('Profile update error:', error);
    showNotification('Failed to update profile: ' + error.message, 'error');
  }
}

// Password update functionality
function showPasswordForm() {
  const form = document.getElementById('password-form');
  const btn = document.getElementById('change-password-btn');
  
  form.style.display = 'block';
  btn.style.display = 'none';
  
  // Clear form
  document.getElementById('current-password').value = '';
  document.getElementById('new-password').value = '';
  document.getElementById('confirm-new-password').value = '';
  
  // Reset requirements
  resetPasswordRequirements();
  
  // Add password validation listeners
  document.getElementById('new-password').addEventListener('input', validatePassword);
}

function cancelPasswordChange() {
  const form = document.getElementById('password-form');
  const btn = document.getElementById('change-password-btn');
  
  form.style.display = 'none';
  btn.style.display = 'block';
  
  // Remove event listeners
  document.getElementById('new-password').removeEventListener('input', validatePassword);
}

function validatePassword() {
  const password = document.getElementById('new-password').value;
  
  // Check length
  const lengthReq = document.getElementById('req-length');
  if (password.length >= 8) {
    lengthReq.classList.add('valid');
  } else {
    lengthReq.classList.remove('valid');
  }
  
  // Check uppercase
  const uppercaseReq = document.getElementById('req-uppercase');
  if (/[A-Z]/.test(password)) {
    uppercaseReq.classList.add('valid');
  } else {
    uppercaseReq.classList.remove('valid');
  }
  
  // Check lowercase
  const lowercaseReq = document.getElementById('req-lowercase');
  if (/[a-z]/.test(password)) {
    lowercaseReq.classList.add('valid');
  } else {
    lowercaseReq.classList.remove('valid');
  }
  
  // Check number
  const numberReq = document.getElementById('req-number');
  if (/\d/.test(password)) {
    numberReq.classList.add('valid');
  } else {
    numberReq.classList.remove('valid');
  }
}

function resetPasswordRequirements() {
  const requirements = document.querySelectorAll('.password-requirements li');
  requirements.forEach(req => req.classList.remove('valid'));
}

async function updatePassword() {
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-new-password').value;
  
  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    showNotification('Please fill in all password fields', 'error');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showNotification('New passwords do not match', 'error');
    return;
  }
  
  // Check password requirements
  const requirements = document.querySelectorAll('.password-requirements li');
  const allValid = Array.from(requirements).every(req => req.classList.contains('valid'));
  
  if (!allValid) {
    showNotification('Password does not meet requirements', 'error');
    return;
  }
  
  try {
    const user = auth.currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    
    // Re-authenticate user
    await user.reauthenticateWithCredential(credential);
    
    // Update password
    await user.updatePassword(newPassword);
    
    showNotification('Password updated successfully!', 'success');
    cancelPasswordChange();
    
  } catch (error) {
    console.error('Password update error:', error);
    if (error.code === 'auth/wrong-password') {
      showNotification('Current password is incorrect', 'error');
    } else {
      showNotification('Failed to update password: ' + error.message, 'error');
    }
  }
}

// Email verification functionality
async function sendVerificationEmail() {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    await user.sendEmailVerification();
    showNotification('Verification email sent! Please check your inbox.', 'success');
    
    // Update UI to show email sent
    const btn = document.getElementById('verify-email-btn');
    btn.textContent = 'Email Sent';
    btn.disabled = true;
    
    // Re-enable after 60 seconds
    setTimeout(() => {
      btn.textContent = 'Send Verification Email';
      btn.disabled = false;
    }, 60000);
    
  } catch (error) {
    console.error('Email verification error:', error);
    showNotification('Failed to send verification email: ' + error.message, 'error');
  }
}

function updateEmailVerificationStatus() {
  const user = auth.currentUser;
  if (!user) return;
  
  const statusElement = document.getElementById('email-verification-status');
  const btnElement = document.getElementById('verify-email-btn');
  
  if (user.emailVerified) {
    statusElement.textContent = '✓ Email Verified';
    statusElement.className = 'status-verified';
    btnElement.style.display = 'none';
  } else {
    statusElement.textContent = '⚠ Email Not Verified';
    statusElement.className = 'status-unverified';
    btnElement.style.display = 'inline-block';
  }
}

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (file) {
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showProfileStatus('Image size must be less than 2MB', true);
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      showProfileStatus('Please select a valid image file', true);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('profile-avatar').src = e.target.result;
      showProfileStatus('Profile picture updated! Click Save to confirm changes.', false);
    };
    reader.readAsDataURL(file);
  }
}

function showProfileStatus(message, isError = false) {
  const status = document.getElementById('profile-status');
  status.innerHTML = `<div class="status ${isError ? 'error' : 'success'}">${message}</div>`;
  
  // Clear status after 3 seconds
  setTimeout(() => {
    status.innerHTML = '';
  }, 3000);
}