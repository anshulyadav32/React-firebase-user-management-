// Firebase Configuration and Initialization
let auth, functions, user = null;

// Initialize Firebase when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Firebase
  auth = firebase.auth();
  functions = firebase.functions();

  // Connect to emulators in development
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    auth.useEmulator('http://127.0.0.1:9099');
    functions.useEmulator('127.0.0.1', 5001);
  }

  // Initialize Google Auth Provider
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  googleProvider.addScope('email');
  googleProvider.addScope('profile');

  // Initialize auth functions for password updates
  window.updateProfile = firebase.auth.updateProfile;
  window.updatePassword = firebase.auth.updatePassword;
  window.reauthenticateWithCredential = firebase.auth.reauthenticateWithCredential;
  window.EmailAuthProvider = firebase.auth.EmailAuthProvider;
  window.sendEmailVerification = firebase.auth.sendEmailVerification;

  // Listen for auth state changes
  auth.onAuthStateChanged((firebaseUser) => {
    user = firebaseUser;
    updateUI();
    
    if (user) {
      loadProfileData();
      updateEmailVerificationStatus();
    }
  });
});

// Export auth and functions for use in other modules
window.firebaseAuth = auth;
window.firebaseFunctions = functions;
window.currentUser = () => user;