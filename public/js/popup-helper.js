// Popup Helper Functions for Authentication

/**
 * Check if popups are blocked and provide user guidance
 */
function checkPopupBlocked() {
  const testPopup = window.open('', '_blank', 'width=1,height=1');
  
  if (!testPopup || testPopup.closed || typeof testPopup.closed === 'undefined') {
    return true; // Popup is blocked
  }
  
  testPopup.close();
  return false; // Popup is allowed
}

/**
 * Show popup instructions to user
 */
function showPopupInstructions() {
  const instructions = `
    <div class="popup-instructions">
      <h3>🚫 Popup Blocked</h3>
      <p>To sign in with Google, please:</p>
      <ol>
        <li>Look for a popup blocker icon in your browser's address bar</li>
        <li>Click on it and select "Always allow popups from this site"</li>
        <li>Or disable your popup blocker temporarily</li>
        <li>Then try signing in again</li>
      </ol>
      <p><strong>Browser-specific instructions:</strong></p>
      <ul>
        <li><strong>Chrome:</strong> Click the popup icon in the address bar</li>
        <li><strong>Firefox:</strong> Click "Options" → "Allow popups for this site"</li>
        <li><strong>Safari:</strong> Safari → Preferences → Websites → Pop-up Windows</li>
        <li><strong>Edge:</strong> Click the popup icon in the address bar</li>
      </ul>
    </div>
  `;
  
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'popup-modal-overlay';
  modal.innerHTML = `
    <div class="popup-modal">
      ${instructions}
      <button onclick="closePopupModal()" class="btn btn-primary">Got it!</button>
    </div>
  `;
  
  document.body.appendChild(modal);
}

/**
 * Close popup instructions modal
 */
function closePopupModal() {
  const modal = document.querySelector('.popup-modal-overlay');
  if (modal) {
    modal.remove();
  }
}

/**
 * Enhanced Google sign-in with popup detection
 */
async function signInWithGoogleEnhanced() {
  // Since we're now using redirect, no need to check for popup blocking
  // Just proceed with the redirect-based sign-in
  await signInWithGoogle();
}

// Make functions globally available
window.checkPopupBlocked = checkPopupBlocked;
window.showPopupInstructions = showPopupInstructions;
window.closePopupModal = closePopupModal;
window.signInWithGoogleEnhanced = signInWithGoogleEnhanced;