import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import futLogo from '../assets/fut_minna_logo.png';

const Layout = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-inner">
            <div className="sidebar-logo-icon">
              <img src={futLogo} alt="FUT Minna Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div className="sidebar-logo-text">
               <div className="sidebar-logo-name" style={{ fontSize: '1rem', lineHeight: '1.2' }}>FEDERAL UNIVERSITY OF TECHNOLOGY MINNA</div>
              <div className="sidebar-logo-sub">Result Portal</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            Dashboard
          </NavLink>
          <NavLink to="/students" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            Students
          </NavLink>
          <NavLink to="/results-entry" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            Record Results
          </NavLink>
          <NavLink to="/reports" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            Report Cards
          </NavLink>
          <NavLink to="/analytics" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            Analytics
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleLogout} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="mobile-toggle" onClick={() => setIsSidebarOpen(true)}>☰</button>
            <div className="top-header-title">Student Result Management</div>
          </div>
          <div className="topbar-actions">
            <div className="topbar-user">
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {user?.user_metadata?.name || user?.email}
              </span>
              <div className="topbar-avatar">
                {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
