import { useState } from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';
import LoginPage from './auth/login';
import SignUpPage from './auth/signUp';

function App() {
  const [view, setView] = useState<'home' | 'login' | 'signup'>('home');

  const renderContent = () => {
    if (view === 'login') {
      return (
        <LoginPage
          onSwitchToSignup={() => setView('signup')}
          onBackHome={() => setView('home')}
        />
      );
    }

    if (view === 'signup') {
      return (
        <SignUpPage
          onSwitchToLogin={() => setView('login')}
          onBackHome={() => setView('home')}
        />
      );
    }

    return (
      <main className="page-content">
        <section className="hero-panel" id="home">
          <div className="hero-copy">
            <span className="eyebrow">Konexio Africa Digi Pass</span>
            <h1>Build brighter futures through digital skills.</h1>
            <p>
              We connect ambitious learners, graduates and employers through practical training,
              community support and pathways into Africa’s digital economy.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary">Get involved</a>
              <a href="#programmes" className="btn btn-secondary">Explore programmes</a>
            </div>
          </div>
        </section>

        <section className="info-strip" aria-label="Key statistics">
          <article className="stat-card accent-cyan">
            <strong>1,248</strong>
            <span>Learners reached</span>
          </article>
          <article className="stat-card accent-orange">
            <strong>972</strong>
            <span>Graduates</span>
          </article>
          <article className="stat-card accent-rose">
            <strong>584</strong>
            <span>Employed or freelancing</span>
          </article>
          <article className="stat-card accent-indigo">
            <strong>28</strong>
            <span>Employer partners</span>
          </article>
        </section>

        <section className="content-section" id="about">
          <div className="section-heading">
            <span className="eyebrow eyebrow-soft">About</span>
            <h2>Practical learning designed for real opportunities.</h2>
          </div>
          <div className="feature-grid two-up">
            <div className="text-panel">
              <p>
                Konexio helps young people unlock digital careers through expert training, guided
                mentorship and community connection across the continent.
              </p>
              <p>
                Our programmes combine technical skills, confidence-building and career access so
                learners can turn potential into sustainable work.
              </p>
            </div>
            <div className="card-stack">
              <div className="mini-card">
                <span>Career-ready</span>
                <strong>Hands-on pathways</strong>
              </div>
              <div className="mini-card">
                <span>Community-first</span>
                <strong>Mentoring and network support</strong>
              </div>
              <div className="mini-card">
                <span>Impact-driven</span>
                <strong>Clear outcomes and trust</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section" id="programmes">
          <div className="section-heading">
            <span className="eyebrow eyebrow-soft">Programmes</span>
            <h2>Pathways built for growth.</h2>
          </div>
          <div className="feature-grid three-up">
            <article className="info-card">
              <span className="card-badge badge-cyan">Digital Skills</span>
              <h3>Tech foundations</h3>
              <p>Build confidence in digital literacy, productivity and practical problem solving.</p>
            </article>
            <article className="info-card">
              <span className="card-badge badge-orange">Work & Career</span>
              <h3>Job readiness</h3>
              <p>Develop professional skills, interview confidence and access to career opportunities.</p>
            </article>
            <article className="info-card">
              <span className="card-badge badge-rose">Community</span>
              <h3>Mentor network</h3>
              <p>Learn with peers and industry leaders that help you progress with purpose.</p>
            </article>
          </div>
        </section>

        <section className="content-section" id="impact">
          <div className="section-heading">
            <span className="eyebrow eyebrow-soft">Impact</span>
            <h2>Measured outcomes across the continent.</h2>
          </div>
          <div className="impact-panel">
            <div className="impact-metric">
              <strong>64%</strong>
              <span>Graduates employed or freelancing</span>
            </div>
            <div className="impact-metric">
              <strong>11</strong>
              <span>Pathways available</span>
            </div>
            <div className="impact-metric">
              <strong>18</strong>
              <span>Active locations</span>
            </div>
          </div>
        </section>

        <section className="content-section" id="alumni">
          <div className="section-heading">
            <span className="eyebrow eyebrow-soft">Alumni</span>
            <h2>Stories from young professionals in motion.</h2>
          </div>
          <div className="feature-grid three-up">
            <article className="profile-card">
              <div className="avatar avatar-cyan">HM</div>
              <h3>Halima M.</h3>
              <p>Digital product specialist</p>
            </article>
            <article className="profile-card">
              <div className="avatar avatar-orange">IK</div>
              <h3>Ibrahima K.</h3>
              <p>Freelance designer</p>
            </article>
            <article className="profile-card">
              <div className="avatar avatar-rose">AR</div>
              <h3>Amina R.</h3>
              <p>Community manager</p>
            </article>
          </div>
        </section>

        <section className="content-section" id="team">
          <div className="section-heading">
            <span className="eyebrow eyebrow-soft">Team</span>
            <h2>People who make the ecosystem work.</h2>
          </div>
          <div className="feature-grid four-up">
            <article className="team-card">
              <div className="avatar avatar-indigo">AD</div>
              <h3>Aissatou D.</h3>
              <p>Programmes Manager</p>
            </article>
            <article className="team-card">
              <div className="avatar avatar-cyan">MB</div>
              <h3>Malick B.</h3>
              <p>Partnerships Lead</p>
            </article>
            <article className="team-card">
              <div className="avatar avatar-orange">SL</div>
              <h3>Sarah L.</h3>
              <p>Alumni Community Manager</p>
            </article>
            <article className="team-card">
              <div className="avatar avatar-rose">NT</div>
              <h3>Noura T.</h3>
              <p>Country Director</p>
            </article>
          </div>
        </section>

        <section className="content-section" id="reports">
          <div className="section-heading">
            <span className="eyebrow eyebrow-soft">Reports</span>
            <h2>Annual insight and progress snapshots.</h2>
          </div>
          <div className="cta-banner">
            <div>
              <strong>2024 and 2025 progress reports</strong>
              <p>Explore the latest year-on-year figures, the vision behind the work and the impact we are tracking.</p>
            </div>
            <a href="#contact" className="btn btn-primary">View reports</a>
          </div>
        </section>

        <section className="content-section" id="newsletter">
          <div className="section-heading">
            <span className="eyebrow eyebrow-soft">Newsletter</span>
            <h2>Stay close to the latest stories and opportunities.</h2>
          </div>
          <div className="newsletter-box">
            <p>Receive programme updates, alumni spotlights and partner opportunities.</p>
            <button type="button" className="btn btn-primary">Sign up</button>
          </div>
        </section>

        <section className="content-section" id="contact">
          <div className="section-heading">
            <span className="eyebrow eyebrow-soft">Contact</span>
            <h2>Let’s explore the next step together.</h2>
          </div>
          <div className="contact-panel">
            <div>
              <p>Whether you want to partner, recruit talent or support the next cohort, we would love to hear from you.</p>
            </div>
            <a href="#" className="btn btn-primary">Get in touch</a>
          </div>
        </section>
      </main>
    );
  };

  return (
    <div className="site-shell">
      <Navbar
        onHome={() => setView('home')}
        onLogin={() => setView('login')}
        onSignup={() => setView('signup')}
      />
      {renderContent()}
      <Footer />
    </div>
  );
}

export default App;
