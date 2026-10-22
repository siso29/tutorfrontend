import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

function DemoRoleBar() {
  const { user, role, demoLogin, logout } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole, dashboardPath) => {
    demoLogin(newRole);
    addToast(`Switched view to ${newRole.toUpperCase()} mode`, 'info');
    navigate(dashboardPath);
  };

  return (
    <div className="demo-role-bar">
      <span>
        ⚡ <strong>Live Demo Mode:</strong> Active User: <strong>{user?.name || 'Guest'}</strong> (Role: {role})
      </span>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button
          type="button"
          className={`demo-role-pill-btn ${role === 'guardian' ? 'active' : ''}`}
          onClick={() => handleRoleSwitch('guardian', '/guardian-dashboard')}
        >
          Parent / Learner
        </button>
        <button
          type="button"
          className={`demo-role-pill-btn ${role === 'tutor' ? 'active' : ''}`}
          onClick={() => handleRoleSwitch('tutor', '/tutor-dashboard')}
        >
          Tutor (Dawit)
        </button>
        <button
          type="button"
          className={`demo-role-pill-btn ${role === 'admin' ? 'active' : ''}`}
          onClick={() => handleRoleSwitch('admin', '/admin-dashboard')}
        >
          Admin Portal
        </button>
        {user && (
          <button
            type="button"
            className="demo-role-pill-btn"
            style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#dc2626' }}
            onClick={() => {
              logout();
              addToast('Logged out of demo account', 'info');
            }}
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
}

export default DemoRoleBar;
