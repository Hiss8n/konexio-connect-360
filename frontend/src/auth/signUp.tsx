import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuthStore } from '../store/authStore';

type SignUpPageProps = {
  onSwitchToLogin: () => void;
  onBackHome: () => void;
};

type RegistrationType = 'learner' | 'alumni' | 'partner' | 'donor';

type SignUpForm = {
  first_name: string;
  second_name: string;
  email: string;
  password: string;
  city: string;
  country: string;
  pathway_code: string;
  learning_goal: string;
  short_bio: string;
  skills: string;
  languages: string;
  availability: string;
  portfolio_title: string;
  portfolio_url: string;
  personal_website: string;
  linkedin_url: string;
  consent_to_publish: boolean;
  consent_to_show_photo: boolean;
  organisation: string;
  partner_type: 'Employer' | 'Client' | 'Training partner';
  description: string;
  website: string;
  phone: string;
};

const SignUpPage = ({ onSwitchToLogin, onBackHome }: SignUpPageProps) => {
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [registrationType, setRegistrationType] = useState<RegistrationType | ''>('');
  const [showDetails, setShowDetails] = useState(false);
  const [form, setForm] = useState<SignUpForm>({
    first_name: '',
    second_name: '',
    email: '',
    password: '',
    city: '',
    country: '',
    pathway_code: '',
    learning_goal: '',
    short_bio: '',
    skills: '',
    languages: '',
    availability: '',
    portfolio_title: '',
    portfolio_url: '',
    personal_website: '',
    linkedin_url: '',
    consent_to_publish: false,
    consent_to_show_photo: false,
    organisation: '',
    partner_type: 'Employer',
    description: '',
    website: '',
    phone: '',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const checked = event.target instanceof HTMLInputElement ? event.target.checked : false;
    setForm((prev) => ({
      ...prev,
      [name]: event.target instanceof HTMLInputElement && event.target.type === 'checkbox' ? checked : value,
    }));
    clearError();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await register({
        first_name: form.first_name,
        second_name: form.second_name,
        email: form.email,
        password: form.password,
        account_type: registrationType as RegistrationType,
        has_organisation: registrationType === 'partner' || registrationType === 'donor',
        ...(registrationType === 'learner' && {
          city: form.city,
          country: form.country,
          pathway_code: form.pathway_code,
          learning_goal: form.learning_goal,
        }),
        ...(registrationType === 'alumni' && {
          city: form.city,
          country: form.country,
          pathway_code: form.pathway_code,
          short_bio: form.short_bio,
          skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
          languages: form.languages.split(',').map((language) => language.trim()).filter(Boolean),
          availability: form.availability,
          portfolio_title: form.portfolio_title,
          portfolio_url: form.portfolio_url,
          personal_website: form.personal_website,
          linkedin_url: form.linkedin_url,
          consent_to_publish: form.consent_to_publish,
          consent_to_show_photo: form.consent_to_show_photo,
        }),
        ...((registrationType === 'partner' || registrationType === 'donor') && {
          organisation: form.organisation,
          country: form.country,
          partner_type: registrationType === 'donor' ? 'Donor' as const : form.partner_type,
          description: form.description,
          website: form.website,
          phone: form.phone,
        }),
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
          <h1>{showDetails ? 'Your account details' : 'Choose how to join'}</h1>
        </div>

        {!showDetails ? (
          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!registrationType) return;
              setShowDetails(true);
            }}
          >
            <label>
              I am joining as
              <select
                value={registrationType}
                onChange={(event) => {
                  setRegistrationType(event.target.value as RegistrationType | '');
                  clearError();
                }}
                required
              >
                <option value="" disabled>Select an account type</option>
                <option value="learner">Learner</option>
                <option value="alumni">Alumni</option>
                <option value="partner">Partner</option>
                <option value="donor">Donor</option>
              </select>
            </label>

            <button type="submit" className="btn btn-primary auth-submit" disabled={!registrationType}>
              Continue
            </button>
          </form>
        ) : (
          <form className="auth-form registration-details" onSubmit={handleSubmit}>
            <p className="registration-type-label">
              Registration type: <strong>{registrationType}</strong>
              <button type="button" className="text-button" onClick={() => setShowDetails(false)}>Change</button>
            </p>

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

          {(registrationType === 'learner' || registrationType === 'alumni') && (
            <>
              <div className="two-column">
                <label>
                  Country
                  <input name="country" value={form.country} onChange={handleChange} required />
                </label>
                <label>
                  City
                  <input name="city" value={form.city} onChange={handleChange} />
                </label>
              </div>
              <label>
                Pathway
                <select name="pathway_code" value={form.pathway_code} onChange={handleChange} required>
                  <option value="">Select a pathway</option>
                  {Array.from({ length: 11 }, (_, index) => `P${index + 1}`).map((pathway) => (
                    <option key={pathway} value={pathway}>{pathway}</option>
                  ))}
                </select>
              </label>
            </>
          )}

          {registrationType === 'learner' && (
            <label>
              What do you hope to learn or achieve?
              <textarea name="learning_goal" value={form.learning_goal} onChange={handleChange} rows={4} required maxLength={2000} />
            </label>
          )}

          {registrationType === 'alumni' && (
            <>
              <label>
                Short bio
                <textarea name="short_bio" value={form.short_bio} onChange={handleChange} rows={4} maxLength={2000} />
              </label>
              <div className="two-column">
                <label>
                  Skills (comma-separated)
                  <input name="skills" value={form.skills} onChange={handleChange} />
                </label>
                <label>
                  Languages (comma-separated)
                  <input name="languages" value={form.languages} onChange={handleChange} />
                </label>
              </div>
              <label>
                Availability
                <input name="availability" value={form.availability} onChange={handleChange} placeholder="For example: Open to work" />
              </label>
              <div className="two-column">
                <label>
                  Portfolio title
                  <input name="portfolio_title" value={form.portfolio_title} onChange={handleChange} />
                </label>
                <label>
                  Portfolio URL
                  <input type="url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange} />
                </label>
              </div>
              <div className="two-column">
                <label>
                  Personal website
                  <input type="url" name="personal_website" value={form.personal_website} onChange={handleChange} />
                </label>
                <label>
                  LinkedIn URL
                  <input type="url" name="linkedin_url" value={form.linkedin_url} onChange={handleChange} />
                </label>
              </div>
              <label className="checkbox-row">
                <input type="checkbox" name="consent_to_publish" checked={form.consent_to_publish} onChange={handleChange} />
                I agree that Konexio may publish my profile information.
              </label>
              <label className="checkbox-row">
                <input type="checkbox" name="consent_to_show_photo" checked={form.consent_to_show_photo} onChange={handleChange} />
                I agree that my photo or video may be shown.
              </label>
            </>
          )}

          {(registrationType === 'partner' || registrationType === 'donor') && (
            <>
              <label>
                Organisation name
                <input name="organisation" value={form.organisation} onChange={handleChange} required maxLength={160} />
              </label>
              {registrationType === 'partner' && (
                <label>
                  Partner type
                  <select name="partner_type" value={form.partner_type} onChange={handleChange}>
                    <option value="Employer">Employer</option>
                    <option value="Client">Client</option>
                    <option value="Training partner">Training partner</option>
                  </select>
                </label>
              )}
              <label>
                Country
                <input name="country" value={form.country} onChange={handleChange} required maxLength={120} />
              </label>
              <label>
                Organisation description
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} required maxLength={2000} />
              </label>
              <div className="two-column">
                <label>
                  Website
                  <input type="url" name="website" value={form.website} onChange={handleChange} />
                </label>
                <label>
                  Phone
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
                </label>
              </div>
            </>
          )}

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

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        )}

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