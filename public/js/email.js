// Email Sending Functions

async function sendEmail() {
  const toEmail = document.getElementById('to-email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  const sendBtn = document.getElementById('send-btn');
  const sendStatus = document.getElementById('send-status');

  if (!toEmail || !subject || !message) {
    sendStatus.innerHTML = '<div class="status error">Please fill in all fields</div>';
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';
  sendStatus.innerHTML = '';

  try {
    const sendEmailFunction = functions.httpsCallable('sendEmail');
    const result = await sendEmailFunction({
      to: toEmail,
      subject: subject,
      text: message
    });

    sendStatus.innerHTML = '<div class="status success">Email sent successfully!</div>';
    
    // Update email count
    const emailsSentElement = document.getElementById('emails-sent');
    const currentCount = parseInt(emailsSentElement.textContent) || 0;
    emailsSentElement.textContent = currentCount + 1;
    
    // Add activity
    addActivity('📧', `Email sent to ${toEmail}`, 'Just now');
    
    // Clear form
    document.getElementById('to-email').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('message').value = '';
    
  } catch (error) {
    console.error('Send email error:', error);
    sendStatus.innerHTML = `<div class="status error">Failed to send email: ${error.message}</div>`;
    addActivity('❌', `Failed to send email to ${toEmail}`, 'Just now');
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send Email';
  }
}