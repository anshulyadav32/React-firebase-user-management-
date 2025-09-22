import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  updatePassword,
  sendEmailVerification
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    return result;
  };

  // Sign in with email and password
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
  };

  // Sign out
  const logout = async () => {
    await signOut(auth);
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (currentUser) {
      await updateProfile(currentUser, profileData);
    }
  };

  // Update password
  const updateUserPassword = async (newPassword) => {
    if (currentUser) {
      await updatePassword(currentUser, newPassword);
    }
  };

  // Send email verification
  const sendVerificationEmail = async () => {
    if (currentUser) {
      await sendEmailVerification(currentUser);
    }
  };

  // Clear auth status
  const clearAuthStatus = () => {
    // This function is kept for backward compatibility but does nothing
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Simple email sending function (placeholder)
  const sendEmail = async (emailData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Email would be sent with data:', emailData);
    return { success: true, message: 'Email sent successfully!' };
  };

  const value = {
    currentUser,
    signup,
    login,
    signInWithGoogle,
    logout,
    updateUserProfile,
    updateUserPassword,
    sendVerificationEmail,
    sendEmail,
    clearAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}