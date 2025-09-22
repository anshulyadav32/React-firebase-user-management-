import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { currentUser, updateUserProfile, updateUserPassword } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState({});
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.displayName?.split(' ')[0] || '',
        lastName: currentUser.displayName?.split(' ')[1] || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || '',
        bio: currentUser.bio || ''
      });
    }
  }, [currentUser]);

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSave = (field) => {
    setIsEditing({ ...isEditing, [field]: false });
    // Here you would typically call an API to update the user profile
    if (updateUserProfile) {
      updateUserProfile(profileData);
    }
  };

  const handleCancel = (field) => {
    setIsEditing({ ...isEditing, [field]: false });
    // Reset the field to original value
    if (currentUser) {
      setProfileData(prev => ({
        ...prev,
        [field]: field === 'firstName' ? currentUser.displayName?.split(' ')[0] || '' :
                field === 'lastName' ? currentUser.displayName?.split(' ')[1] || '' :
                field === 'email' ? currentUser.email || '' :
                field === 'phone' ? currentUser.phoneNumber || '' :
                field === 'bio' ? currentUser.bio || '' : prev[field]
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const getInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return currentUser?.email?.[0]?.toUpperCase() || 'U';
  };

  const InfoItem = ({ label, field, value, editable = true }) => (
    <div className="border-b border-gray-200 py-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center justify-between">
        {isEditing[field] ? (
          <div className="flex-1 flex items-center space-x-2">
            <input
              type={field === 'email' ? 'email' : 'text'}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
            <button
              onClick={() => handleSave(field)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => handleCancel(field)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-gray-900">{value || '-'}</span>
            {editable && (
              <button
                onClick={() => handleEdit(field)}
                className="text-blue-600 hover:text-blue-700 ml-2"
                title="Edit"
              >
                ✏️
              </button>
            )}
          </div>
        )}
      </div>
      {field === 'email' && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
          ✓ Verified
        </span>
      )}
    </div>
  );

  return (
    <div className="main-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">User Profile</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-secondary"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="mb-4">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile Picture"
                  className="w-32 h-32 rounded-full mx-auto object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                  {getInitials()}
                </div>
              )}
            </div>
            <button className="btn btn-primary">
              Change Photo
            </button>
          </div>

          {/* Account Stats */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Member since</span>
                <span className="font-medium">
                  {currentUser?.metadata?.creationTime ? 
                    new Date(currentUser.metadata.creationTime).toLocaleDateString() : 
                    'Recently'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last login</span>
                <span className="font-medium">
                  {currentUser?.metadata?.lastSignInTime ? 
                    new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() : 
                    'Today'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Emails sent</span>
                <span className="font-medium">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>
            
            <div className="space-y-1">
              <InfoItem 
                label="First Name" 
                field="firstName" 
                value={profileData.firstName} 
              />
              <InfoItem 
                label="Last Name" 
                field="lastName" 
                value={profileData.lastName} 
              />
              <InfoItem 
                label="Email Address" 
                field="email" 
                value={profileData.email} 
                editable={false}
              />
              <InfoItem 
                label="Phone Number" 
                field="phone" 
                value={profileData.phone} 
              />
              <InfoItem 
                label="Bio" 
                field="bio" 
                value={profileData.bio} 
              />
            </div>
          </div>

          {/* Security Section */}
          <div className="card mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Password</h4>
                  <p className="text-sm text-gray-600">Last updated 30 days ago</p>
                </div>
                <button className="btn btn-primary">
                  Change Password
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <button className="btn btn-primary">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;