import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

type LoginPageProps = {
  onSwitchToSignup: () => void;
  onBackHome: () => void;
};

const LoginPage = ({ onSwitchToSignup, onBackHome }: LoginPageProps) => {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    account_type: 'learner' as 'learner' | 'alumni' | 'partner' | 'donor',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login({
        email: form.email,
        password: form.password,
        account_type: form.account_type,
      });
      navigate(`/${form.account_type}`);
    } catch {
      // error is surfaced by the store and shown below
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">Welcome back</span>
          <h1>Log in to your account</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </label>

          <label>
            Role
            <select
              name="account_type"
              value={form.account_type}
              onChange={handleChange}
            >
              <option value="learner">Learner</option>
              <option value="alumni">Alumni</option>
              <option value="partner">Partner</option>
              <option value="donor">Donor</option>
            </select>
          </label>

          <div className="auth-row">
            <label className="checkbox-row">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-link">Forgot password?</a>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account?{' '}
          <button type="button" className="text-button" onClick={onSwitchToSignup}>Sign up</button>
        </p>

        <button type="button" className="text-button secondary-link" onClick={onBackHome}>
          ← Back to home
        </button>
      </div>
    </main>
  );
};

export default LoginPage;