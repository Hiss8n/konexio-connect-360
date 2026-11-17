import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

type SignUpPageProps = {
  onSwitchToLogin: () => void;
  onBackHome: () => void;
};

const SignUpPage = ({ onSwitchToLogin, onBackHome }: SignUpPageProps) => {
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [form, setForm] = useState({
    first_name: '',
    second_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      useAuthStore.setState({ error: 'Passwords do not match.' });
      return;
    }

    try {
      await register({
        first_name: form.first_name,
        second_name: form.second_name,
        email: form.email,
        password: form.password,
        has_organisation: false,
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
          <span className="eyebrow">Join the community</span>
          <h1>Create your account</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="two-column">
            <label>
              First name
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="First name"
                required
              />
            </label>

            <label>
              Last name
              <input
                type="text"
                name="second_name"
                value={form.second_name}
                onChange={handleChange}
                placeholder="Last name"
                required
              />
            </label>
          </div>

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
              placeholder="Create a password"
              required
            />
          </label>

          <label>
            Confirm password
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button type="button" className="text-button" onClick={onSwitchToLogin}>Log in</button>
        </p>

        <button type="button" className="text-button secondary-link" onClick={onBackHome}>
          ← Back to home
        </button>
      </div>
    </main>
  );
};

export default SignUpPage;