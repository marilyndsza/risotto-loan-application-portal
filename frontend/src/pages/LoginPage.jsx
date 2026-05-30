import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

const demoCredentials = {
  email: 'agent@risotto.local',
  password: 'risotto123'
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = location.state?.from || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  function updateValue(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function preloadDemoUser() {
    setError('');
    setValues(demoCredentials);
  }

  async function submitLogin(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(values);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="login-brand">
          <span>Risotto</span>
          <h1>Agent Login</h1>
          <p>Sign in to review borrower applications and manage loan decisions.</p>
        </div>

        <button className="demo-button" type="button" onClick={preloadDemoUser}>
          Preload Demo Agent
        </button>

        <form className="login-form" onSubmit={submitLogin}>
          <label className="field" htmlFor="email">
            <span>Email</span>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={updateValue}
              placeholder="agent@risotto.local"
              autoComplete="username"
            />
          </label>

          <label className="field" htmlFor="password">
            <span>Password</span>
            <input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={updateValue}
              placeholder="risotto123"
              autoComplete="current-password"
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button" type="submit" disabled={!values.email || !values.password || isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  );
}
