import React, { useState, useEffect } from 'react';
import './Admin.css';

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // Start with users tab
  const [error, setError] = useState('');
  
  // Dashboard data
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    adminUsers: 0,
    todayLogins: 0,
    weekLogins: 0,
    recentSignups: 0
  });
  
  // Users data
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [adminFilter, setAdminFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Login history data
  const [loginHistory, setLoginHistory] = useState([]);

  const adminPassword = 'admin123'; // You can move this to environment variables

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/admin/dashboard-stats', {
        headers: { 'x-admin-password': adminPassword }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setLoading(false);
  };

  const loadUsers = async (page = 1, search = '', verified = 'all', admin = 'all') => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        verified,
        admin
      });
      
      
      const res = await fetch(`http://localhost:5001/api/admin/users?${params}`, {
        headers: { 'x-admin-password': adminPassword }
      });
      
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setPagination(data.pagination || {});
      } else {
        setError('Failed to load users. Please check if the backend server is running.');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to connect to server. Please make sure the backend is running on port 5001.');
    }
    setLoading(false);
  };

  const loadLoginHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/admin/user-logins', {
        headers: { 'x-admin-password': adminPassword }
      });
      if (res.ok) {
        const data = await res.json();
        setLoginHistory(data);
      }
    } catch (error) {
      console.error('Error loading login history:', error);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers(1, searchTerm, verificationFilter, adminFilter);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadUsers(page, searchTerm, verificationFilter, adminFilter);
  };

  const handleFilterClick = (filterType, filterValue) => {
    setCurrentPage(1);
    if (filterType === 'verified') {
      setVerificationFilter(filterValue);
      setAdminFilter('all');
    } else if (filterType === 'admin') {
      setAdminFilter(filterValue);
      setVerificationFilter('all');
    }
  };

  const toggleAdminStatus = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/admin/user/${userId}/toggle-admin`, {
        method: 'PATCH',
        headers: { 
          'x-admin-password': adminPassword,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        loadUsers(currentPage, searchTerm, verificationFilter, adminFilter);
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
    }
  };


  const verifyUserEmail = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/admin/user/${userId}/verify-email`, {
        method: 'PATCH',
        headers: { 
          'x-admin-password': adminPassword,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        alert('Email verified successfully! A notification email has been sent to the user.');
        loadUsers(currentPage, searchTerm, verificationFilter, adminFilter);
        loadDashboardData();
      } else {
        alert('Failed to verify email');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      alert('Error verifying email');
    }
  };

  const resendVerificationEmail = async (userId, userEmail) => {
    try {
      const res = await fetch(`http://localhost:5001/api/resend-verification`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail })
      });
      
      if (res.ok) {
        alert('Verification email sent successfully!');
      } else {
        alert('Failed to send verification email');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      alert('Error sending verification email');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`http://localhost:5001/api/admin/user/${userId}`, {
          method: 'DELETE',
          headers: { 'x-admin-password': adminPassword }
        });
        
        if (res.ok) {
          loadUsers(currentPage, searchTerm, verificationFilter, adminFilter);
          loadDashboardData();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadUsers(); // Load users by default
    if (activeTab === 'logins') {
      loadLoginHistory();
    }
  }, [activeTab]);

  // Update users when filters change
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers(1, searchTerm, verificationFilter, adminFilter);
      setCurrentPage(1);
    }
  }, [verificationFilter, adminFilter, activeTab]);

  // Update users when search term changes
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers(1, searchTerm, verificationFilter, adminFilter);
      setCurrentPage(1);
    }
  }, [searchTerm]);


  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h1>Admin Dashboard</h1>
        <button 
          className="admin-panel__logout"
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </button>
      </div>

      <div className="admin-panel__tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'logins' ? 'active' : ''}
          onClick={() => setActiveTab('logins')}
        >
          Login History
        </button>
      </div>

      {loading && <div className="admin-panel__loading">Loading...</div>}
      {error && <div className="admin-panel__error" style={{color: 'red', padding: '1rem', textAlign: 'center', backgroundColor: '#ffe6e6', border: '1px solid red', borderRadius: '4px', margin: '1rem 0'}}>{error}</div>}

      {activeTab === 'dashboard' && (
        <div className="admin-panel__dashboard">
          <div className="admin-panel__stats">
            <div className="admin-panel__stat" onClick={() => setActiveTab('users')}>
              <span className="admin-panel__count">{stats.totalUsers}</span>
              <span className="admin-panel__label">Total Users</span>
            </div>
            <div 
              className="admin-panel__stat clickable" 
              onClick={() => handleFilterClick('verified', 'verified')}
              style={{cursor: 'pointer'}}
            >
              <span className="admin-panel__count">{stats.verifiedUsers}</span>
              <span className="admin-panel__label">Verified Users</span>
            </div>
            <div 
              className="admin-panel__stat clickable" 
              onClick={() => handleFilterClick('verified', 'unverified')}
              style={{cursor: 'pointer'}}
            >
              <span className="admin-panel__count">{stats.unverifiedUsers}</span>
              <span className="admin-panel__label">Unverified Users</span>
            </div>
            <div 
              className="admin-panel__stat clickable" 
              onClick={() => handleFilterClick('admin', 'admin')}
              style={{cursor: 'pointer'}}
            >
              <span className="admin-panel__count">{stats.adminUsers}</span>
              <span className="admin-panel__label">Admin Users</span>
            </div>
            <div className="admin-panel__stat">
              <span className="admin-panel__count">{stats.todayLogins}</span>
              <span className="admin-panel__label">Today's Logins</span>
            </div>
            <div className="admin-panel__stat">
              <span className="admin-panel__count">{stats.weekLogins}</span>
              <span className="admin-panel__label">This Week's Logins</span>
            </div>
            <div className="admin-panel__stat">
              <span className="admin-panel__count">{stats.recentSignups}</span>
              <span className="admin-panel__label">Recent Signups (30 days)</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-panel__users">
          <div className="admin-panel__filters">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select 
              value={verificationFilter}
              onChange={e => {
                setVerificationFilter(e.target.value);
                setAdminFilter('all'); // Reset admin filter when verification filter changes
              }}
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
            <select 
              value={adminFilter}
              onChange={e => {
                setAdminFilter(e.target.value);
                setVerificationFilter('all'); // Reset verification filter when admin filter changes
              }}
            >
              <option value="all">All User Types</option>
              <option value="admin">Admin Users Only</option>
              <option value="user">Regular Users Only</option>
            </select>
            <button onClick={handleSearch}>Search</button>
          </div>

          <div className="admin-panel__table-container">
            <table className="admin-panel__table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Verified</th>
                  <th>Admin</th>
                  <th>Login Count</th>
                  <th>Last Login</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>
                      <span className={`status ${user.isEmailVerified ? 'verified' : 'unverified'}`}>
                        {user.isEmailVerified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${user.isAdmin ? 'admin' : 'user'}`}>
                        {user.isAdmin ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>{user.loginCount || 0}</td>
                    <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-panel__actions">
                        {!user.isEmailVerified && (
                          <>
                            <button 
                              className="btn-verify"
                              onClick={() => verifyUserEmail(user._id)}
                              style={{marginRight: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px'}}
                            >
                              Verify Email
                            </button>
                            <button 
                              className="btn-resend"
                              onClick={() => resendVerificationEmail(user._id, user.email)}
                              style={{marginRight: '5px', backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px'}}
                            >
                              Resend Verification Email
                            </button>
                          </>
                        )}
                        <button 
                          className={`btn-admin ${user.isAdmin ? 'remove' : 'add'}`}
                          onClick={() => toggleAdminStatus(user._id)}
                          style={{marginRight: '5px', backgroundColor: user.isAdmin ? '#dc3545' : '#ffc107', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px'}}
                        >
                          {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => deleteUser(user._id)}
                          style={{backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px'}}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="admin-panel__pagination">
              <button 
                disabled={!pagination.hasPrev}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button 
                disabled={!pagination.hasNext}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'logins' && (
        <div className="admin-panel__logins">
          <div className="admin-panel__table-container">
            <table className="admin-panel__table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Login Time</th>
                  <th>Logout Time</th>
                  <th>Session Duration</th>
                  <th>IP Address</th>
                  <th>Login Count</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map(user =>
                  user.loginHistory.map((log, idx) => (
                    <tr key={`${user._id}-${idx}`}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{log.loginAt ? new Date(log.loginAt).toLocaleString() : '-'}</td>
                      <td>{log.logoutAt ? new Date(log.logoutAt).toLocaleString() : 'Active'}</td>
                      <td>
                        {log.sessionDuration ? `${log.sessionDuration}m` : '-'}
                      </td>
                      <td>{log.ipAddress || '-'}</td>
                      <td>{user.loginCount || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;