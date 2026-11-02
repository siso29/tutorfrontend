import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../CssPages/Auth.css';
import { usePreferences } from '../context/PreferencesContext';

function Auth() {
  const [role, setRole] = useState('learner');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();
  const { addToast } = useNotification();
  const { t, language } = usePreferences();

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
          <span className="auth-tag">{language === 'am' ? 'ተማር • አስተምር • እደግ' : t('authTag')}</span>
          <h1>{t('authHeadline')}</h1>
          <p>
            {t('authIntro')}
          </p>

          <div className="auth-benefit">
            <span>✓</span>
            {t('authBenefit1')}
          </div>

          <div className="auth-benefit">
            <span>✓</span>
            {t('authBenefit2')}
          </div>

          <div className="auth-benefit">
            <span>✓</span>
            {t('authBenefit3')}
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
            <h2>{isLogin ? t('welcomeBack') : t('joinTutorConnect')}</h2>
            <p>
              {isLogin
                ? t('enterDetails')
                : t('createStart')}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <label>
                {t('fullName')}
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
                {t('email')}
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              {t('password')}
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
                  {t('confirmPassword')}
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
                  {t('joinAs')}
                  <select
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                  >
                    <option value="learner">{t('learner')}</option>
                    <option value="guardian">{t('guardian')}</option>
                    <option value="tutor">{t('tutor')}</option>
                  </select>
                </label>
              </>
            )}

            {isLogin && (
              <div className="auth-options">
                <label className="auth-remember">
                  <input type="checkbox" defaultChecked />
                  {t('rememberMe')}
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
                  {t('forgotPassword')}
                </button>
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? 'Processing...'
                : isLogin
                  ? t('loginAccount')
                  : t('createAccount')}
            </button>

            {message && (
              <p className="auth-message" role="status">
                {message}
              </p>
            )}
          </form>

          <p className="auth-switch">
            {isLogin ? t('noAccount') : t('alreadyAccount')}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
              }}
            >
              {isLogin ? (language === 'am' ? 'ይመዝገቡ' : t('registerButton')) : (language === 'am' ? 'ግባ' : t('loginButton'))}
            </button>
          </p>

          <p className="auth-terms">
            {t('terms')}
          </p>
        </div>
      </section>
    </main>
  );
}

export default Auth;
