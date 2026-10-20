import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, demoLogin } = useAuth();

  if (!user) {
    return (
      <main className="protected-fallback">
        <div className="protected-fallback-card">
          <h2>Sign in Required</h2>
          <p>You need to be logged in to view this dashboard.</p>
          <div className="fallback-actions">
            <Link to="/login" className="primary-btn">
              Go to Login
            </Link>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => demoLogin(allowedRoles?.[0] || 'guardian')}
            >
              Quick Demo Access as {allowedRoles?.[0] || 'User'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <main className="protected-fallback">
        <div className="protected-fallback-card">
          <h2>Access Restricted</h2>
          <p>
            Your current account role is <strong>{role}</strong>, but this page requires{' '}
            <strong>{allowedRoles.join(' or ')}</strong>.
          </p>
          <div className="fallback-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => demoLogin(allowedRoles[0])}
            >
              Switch Demo Role to {allowedRoles[0]}
            </button>
            <Link to="/" className="secondary-btn">
              Return Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return children;
}

export default ProtectedRoute;
