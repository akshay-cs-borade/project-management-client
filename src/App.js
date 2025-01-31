import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Login from './components/Login';
import axios from 'axios';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);

  useEffect(() => {
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      setUserRole(userRole);
    }
  }, [authToken]);

  const loginHandler = (token, user) => {
    setAuthToken(token);
    localStorage.setItem('token', token);
    setUserRole(user.role);
    localStorage.setItem('role', user.role);
  };

  const logoutHandler = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
    setUserRole(null);
  };

  return (
<Router>
      <Routes>
        {/* Root route: redirect based on authentication */}
        <Route
          path="/"
          element={authToken ? (
            userRole === 'admin' ? (
              <Navigate to="/admin" />
            ) : userRole === 'user' ? (
              <Navigate to="/user" />
            ) : (
              <Navigate to="/login" />
            )
          ) : (
            <Navigate to="/login" />
          )}
        />
        
        {/* Login Route */}
        <Route
          path="/login"
          element={authToken ? (
            userRole === 'admin' ? (
              <Navigate to="/admin" />
            ) : userRole === 'user' ? (
              <Navigate to="/user" />
            ) : (
              <Login onLogin={loginHandler} />
            )
          ) : (
            <Login onLogin={loginHandler} />
          )}
        />
        
        {/* Admin Route: Only accessible for admin users */}
        <Route
          path="/admin"
          element={authToken && userRole === 'admin' ? (
            <AdminDashboard token={authToken} onLogout={logoutHandler} />
          ) : (
            <Navigate to="/login" />
          )}
        />
        
        {/* User Route: Only accessible for regular users */}
        <Route
          path="/user"
          element={authToken && userRole === 'user' ? (
            <UserDashboard token={authToken} onLogout={logoutHandler} />
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
