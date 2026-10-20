import { useState, useRef, useEffect } from 'react';
import ScrollToTopLink from './ScrollToTopLink.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../CssPages/Navbar.css';

function Navbar() {
  const { user, role, logout } = useAuth();
  const { inbox, unreadCount, markAllAsRead } = useNotification();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDashboardPath = () => {
    if (role === 'tutor') return '/tutor-dashboard';
    if (role === 'admin') return '/admin-dashboard';
    return '/guardian-dashboard';
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-logo">
          Tutor<span>Connect</span>
        </Link>

        <nav className={`site-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ScrollToTopLink to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </ScrollToTopLink>
          <ScrollToTopLink to="/find-tutors" onClick={() => setMobileMenuOpen(false)}>
            Find Tutors
          </ScrollToTopLink>
          <ScrollToTopLink to="/how-it-works" onClick={() => setMobileMenuOpen(false)}>
            How it works
          </ScrollToTopLink>
          <ScrollToTopLink to="/about" onClick={() => setMobileMenuOpen(false)}>
            About
          </ScrollToTopLink>
          <ScrollToTopLink to="/contact" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </ScrollToTopLink>
        </nav>

        <div className="site-header-actions">
          {/* In-app Notification Bell */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="notification-bell-btn"
              onClick={() => {
                setNotifOpen(!notifOpen);
                if (!notifOpen) markAllAsRead();
              }}
              aria-label="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="notification-counter-badge">{unreadCount}</span>
              )}
            </button>

            {notifOpen && (
              <div
                className="user-dropdown-menu"
                style={{ width: '300px', right: 0, padding: '12px' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    paddingBottom: '6px',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                    Notifications
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {inbox.length} total
                  </span>
                </div>
                {inbox.length === 0 ? (
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '12px 0' }}>
                    No new notifications
                  </p>
                ) : (
                  <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    {inbox.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          padding: '8px',
                          borderBottom: '1px solid #f8fafc',
                          fontSize: '0.82rem',
                          color: '#334155',
                          borderRadius: '6px',
                          background: n.unread ? '#f0f7ff' : 'transparent',
                        }}
                      >
                        <p style={{ margin: '0 0 4px' }}>{n.text}</p>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                          {n.time}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User state */}
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <div
                className="user-menu-pill"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar-badge">
                  {user.avatar || user.name?.slice(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="user-info-text">
                  <span className="user-name-label">{user.name}</span>
                  <span className="user-role-tag">{role}</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>▼</span>
              </div>

              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setDropdownOpen(false)}
                  >
                    📊 My Dashboard
                  </Link>
                  <Link
                    to="/find-tutors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    🔍 Find Tutors
                  </Link>
                  {role === 'guardian' && (
                    <Link
                      to="/guardian-dashboard"
                      onClick={() => setDropdownOpen(false)}
                    >
                      🎓 My Learners & Bookings
                    </Link>
                  )}
                  {role === 'tutor' && (
                    <Link
                      to="/tutor-dashboard"
                      onClick={() => setDropdownOpen(false)}
                    >
                      📅 My Teaching Sessions
                    </Link>
                  )}
                  {role === 'admin' && (
                    <Link
                      to="/admin-dashboard"
                      onClick={() => setDropdownOpen(false)}
                    >
                      ⚙️ Administration
                    </Link>
                  )}
                  <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />
                  <button
                    type="button"
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    🚪 Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-login">
                Log in
              </Link>
              <Link to="/register" className="nav-register">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
