import heroHome1 from '../assets/hero_home_1.png';
import PartnersPage from './partners';
import { useEffect, useRef, useState } from 'react';

const AnimatedCount = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = countRef.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value);
      return;
    }

    let frameId = 0;
    let startTime: number | undefined;
    const duration = 1400;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      observer.disconnect();
      const animate = (time: number) => {
        startTime ??= time;
        const progress = Math.min((time - startTime) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        setCount(Math.round(value * easedProgress));

        if (progress < 1) frameId = requestAnimationFrame(animate);
      };

      frameId = requestAnimationFrame(animate);
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [value]);

  return <span ref={countRef}>{count}</span>;
};

const HomePage = () => {



  return (
    <main className="page-content">
      <section
        className="hero-panel"
        id="home"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(58, 61, 130, 0.82), rgba(58, 61, 130, 0.4)), url(${heroHome1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
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
          <strong><AnimatedCount value={28} /></strong>
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

      <PartnersPage />
    </main>
  );
};

export default HomePage;