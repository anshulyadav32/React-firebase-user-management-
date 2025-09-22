import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import EmailComposer from './components/EmailComposer';
import './App.css';

// Toast notification component for better user feedback
function Toast({ message, type, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
  
  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        ✕
      </button>
    </div>
  );
}

function LogoutButton() {
  const { logout } = useAuth();
  
  return (
    <button
      onClick={logout}
      className="text-red-500 hover:text-red-700 text-sm transition-colors duration-200"
      title="Logout"
    >
      🚪
    </button>
  );
}

function AppContent() {
  const { currentUser } = useAuth();
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleSendEmail = async (emailData) => {
    // Simulate email sending
    try {
      console.log('Sending email:', emailData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Note: In real implementation, you would use Firebase Functions
      // const sendEmailFunction = httpsCallable(functions, 'sendEmail');
      // await sendEmailFunction(emailData);
      
      showToast('Email sent successfully!', 'success');
      return { success: true };
    } catch (error) {
      console.error('Failed to send email:', error);
      showToast('Failed to send email. Please try again.', 'error');
      throw error;
    }
  };

  const handleUpdateProfile = async (profileData) => {
    // This will be handled by the AuthContext
    try {
      // The actual profile update will be done through Firebase Auth
      console.log('Profile update:', profileData);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Profile update failed:', error);
      showToast('Failed to update profile. Please try again.', 'error');
      throw error;
    }
  };

  return (
    <div className="app-container">
      <Header />
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
      
      <main className="main-content">
        {!currentUser ? (
          <div className="form-container">
            <Auth />
          </div>
        ) : (
          <div>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/dashboard" 
                element={
                  <Dashboard 
                    user={currentUser} 
                  />
                } 
              />
              <Route 
                path="/compose" 
                element={
                  <EmailComposer 
                    onSendEmail={handleSendEmail}
                  />
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <Profile 
                    user={currentUser}
                    onUpdateProfile={handleUpdateProfile}
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        )}
      </main>
      
      {currentUser && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 flex items-center space-x-3 backdrop-blur-sm bg-white/95">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}
            </div>
            <span className="text-sm text-gray-700 font-medium">{currentUser.displayName || currentUser.email}</span>
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
