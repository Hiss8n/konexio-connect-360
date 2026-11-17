import { useState } from 'react';
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

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login({
        email: form.email,
        password: form.password,
      });
      onBackHome();
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