import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../CssPages/Auth.css';

function Auth() {
  const [role, setRole] = useState('learner');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();
  const { addToast } = useNotification();

  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');

  const switchMode = (loginMode) => {
    setIsLogin(loginMode);
    setMessage('');
    navigate(loginMode ? '/login' : '/register');
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = formData.get('email')?.toString().trim();
    const password = formData.get('password')?.toString();
    const fullName = formData.get('fullName')?.toString().trim();
    const confirmPassword = formData.get('confirmPassword')?.toString();

    if (!isLogin && password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      if (isLogin) {
        const result = await login(email, password);
        addToast(`Welcome back, ${result.user.name}!`, 'success');
        if (result.user.role === 'tutor') {
          navigate('/tutor-dashboard');
        } else if (result.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/guardian-dashboard');
        }
      } else {
        const result = await register({
          fullName,
          email,
          password,
          role,
        });
        addToast(`Account created successfully for ${result.user.name}!`, 'success');
        if (result.user.role === 'tutor') {
          navigate('/tutor-dashboard');
        } else {
          navigate('/guardian-dashboard');
        }
      }
    } catch (error) {
      setMessage(error.message || 'Authentication failed. Please try again.');
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <Link to="/" className="auth-logo">
          TutorConnect
        </Link>

        <div className="auth-intro-content">
          <span className="auth-tag">LEARN • TEACH • GROW</span>
          <h1>Your learning journey starts here.</h1>
          <p>
            Connect with qualified tutors, discover new skills, and make every
            learning session count.
          </p>

          <div className="auth-benefit">
            <span>✓</span>
            Find tutors for your learning goals
          </div>

          <div className="auth-benefit">
            <span>✓</span>
            Manage lessons and bookings
          </div>

          <div className="auth-benefit">
            <span>✓</span>
            Keep track of learning progress
          </div>
        </div>

        <p className="auth-footer-text">
          Helping learners reach their full potential.
        </p>
      </section>

      <section className="auth-form-section">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={isLogin ? 'auth-tab active' : 'auth-tab'}
              onClick={() => switchMode(true)}
            >
              Login
            </button>

            <button
              type="button"
              className={!isLogin ? 'auth-tab active' : 'auth-tab'}
              onClick={() => switchMode(false)}
            >
              Create Account
            </button>
          </div>

          <div className="auth-heading">
            <h2>{isLogin ? 'Welcome back!' : 'Join TutorConnect'}</h2>
            <p>
              {isLogin
                ? 'Enter your details to access your account.'
                : 'Create an account to get started.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <label>
                Full name
                <input
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label>
              Email address
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                minLength={6}
                required
              />
            </label>

            {!isLogin && (
              <>
                <label>
                  Confirm password
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </label>

                <label>
                  I want to join as
                  <select
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                  >
                    <option value="learner">Learner</option>
                    <option value="guardian">Parent / Guardian</option>
                    <option value="tutor">Tutor</option>
                  </select>
                </label>
              </>
            )}

            {isLogin && (
              <div className="auth-options">
                <label className="auth-remember">
                  <input type="checkbox" defaultChecked />
                  Remember me
                </label>

                <button
                  type="button"
                  className="auth-text-button"
                  onClick={() =>
                    setMessage(
                      'Password recovery will be available after backend setup.'
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? 'Processing...'
                : isLogin
                  ? 'Login to Account'
                  : 'Create My Account'}
            </button>

            {message && (
              <p className="auth-message" role="status">
                {message}
              </p>
            )}
          </form>

          <p className="auth-switch">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
              }}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>

          <p className="auth-terms">
            By continuing, you agree to the platform's terms and privacy policy.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Auth;
