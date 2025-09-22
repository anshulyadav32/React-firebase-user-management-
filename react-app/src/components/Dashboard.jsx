import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    emailsSent: 0,
    lastLogin: 'Just now',
    userStatus: 'Active'
  });

  const [activities] = useState([
    {
      icon: '🎉',
      title: 'Welcome!',
      description: 'Your account has been successfully created.',
      time: 'Just now'
    },
    {
      icon: '🔐',
      title: 'Security',
      description: 'Two-factor authentication enabled.',
      time: '2 hours ago'
    },
    {
      icon: '📧',
      title: 'Email',
      description: 'Email verification completed.',
      time: '1 day ago'
    }
  ]);

  useEffect(() => {
    // Update last login time when component mounts
    setStats(prev => ({
      ...prev,
      lastLogin: new Date().toLocaleTimeString()
    }));
  }, []);

  const StatCard = ({ icon, title, value }) => (
    <div className="card">
      <div className="flex items-center">
        <div className="text-3xl mr-4">{icon}</div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          <p className="text-gray-600">{title}</p>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ icon, title, description, time }) => (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="text-xl">{icon}</div>
      <div className="flex-1">
        <p className="text-sm">
          <strong>{title}</strong> {description}
        </p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );

  return (
    <div className="main-content">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <nav className="text-sm text-gray-500 mb-2">
                <span>Dashboard</span>
                <span className="mx-2">&gt;</span>
                <span className="text-blue-600">Overview</span>
              </nav>
            <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex space-x-2">
          <button className="btn btn-primary">
            Overview
          </button>
          <button 
            onClick={() => navigate('/compose')}
            className="btn btn-secondary"
          >
            Compose Email
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="btn btn-secondary"
          >
            Profile
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon="📧" 
          title="Emails Sent" 
          value={stats.emailsSent} 
        />
        <StatCard 
          icon="⏰" 
          title="Last Login" 
          value={stats.lastLogin} 
        />
        <StatCard 
          icon="👤" 
          title="Account Status" 
          value={stats.userStatus} 
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {activities.map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))}
        </div>
      </div>

      {/* Welcome Message */}
      {currentUser && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            <strong>Welcome back, {currentUser.displayName || currentUser.email}!</strong>
            <br />
            You're successfully logged in and ready to send emails.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;