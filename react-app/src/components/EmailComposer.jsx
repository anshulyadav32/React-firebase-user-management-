import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const EmailComposer = () => {
  const navigate = useNavigate();
  const { currentUser, sendEmail } = useAuth();
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

  const handleInputChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSendStatus(null);

    try {
      if (sendEmail) {
        await sendEmail(emailData);
        setSendStatus({ type: 'success', message: 'Email sent successfully!' });
        setEmailData({ to: '', subject: '', message: '' });
      } else {
        // Simulate email sending
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSendStatus({ type: 'success', message: 'Email sent successfully!' });
        setEmailData({ to: '', subject: '', message: '' });
      }
    } catch (error) {
      setSendStatus({ type: 'error', message: 'Failed to send email. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  const isFormValid = emailData.to && emailData.subject && emailData.message;

  return (
    <div className="main-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-sm text-gray-500 mb-2">
              <span>Dashboard</span>
              <span className="mx-2">&gt;</span>
              <span className="text-blue-600">Compose Email</span>
            </nav>
          <h2 className="text-3xl font-bold text-gray-800">Compose Email</h2>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-secondary"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Email Composer Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* To Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="to"
              value={emailData.to}
              onChange={handleInputChange}
              placeholder="recipient@example.com"
              required
              className="form-input"
            />
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={emailData.subject}
              onChange={handleInputChange}
              placeholder="Enter email subject"
              required
              className="form-input"
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={emailData.message}
              onChange={handleInputChange}
              placeholder="Enter your message here..."
              required
              rows={8}
              className="form-input resize-vertical"
            />
          </div>

          {/* Status Message */}
          {sendStatus && (
            <div className={`p-4 rounded-md ${
              sendStatus.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                <span className="mr-2">
                  {sendStatus.type === 'success' ? '✅' : '❌'}
                </span>
                {sendStatus.message}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={!isFormValid || isSending}
                className={`btn ${
                  isFormValid && !isSending
                    ? 'btn-primary'
                    : 'btn-secondary cursor-not-allowed'
                }`}
              >
                {isSending ? (
                  <div className="flex items-center">
                    <div className="loading-spinner mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Email'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setEmailData({ to: '', subject: '', message: '' })}
                className="btn btn-secondary"
              >
                Clear
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              <span className="mr-4">Characters: {emailData.message.length}</span>
              <span>Words: {emailData.message.split(/\s+/).filter(word => word.length > 0).length}</span>
            </div>
          </div>
        </form>
      </div>

      {/* Email Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">📧 Email Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Make sure the recipient's email address is correct</li>
          <li>• Use a clear and descriptive subject line</li>
          <li>• Keep your message concise and professional</li>
          <li>• Double-check your message before sending</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailComposer;