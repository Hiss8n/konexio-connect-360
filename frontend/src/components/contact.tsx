import { useState, type FormEvent } from 'react';

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setFeedback(null);

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${apiBaseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        const detail = responseData?.detail;
        const message = typeof detail === 'string' ? detail : 'Please check your details and try again.';
        throw new Error(message);
      }

      form.reset();
      setFeedback({ type: 'success', message: 'Your message has been sent. Thank you for getting in touch.' });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to send your message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="content-section contact-section" id="contact">
      <div className="section-heading">
        <span className="eyebrow eyebrow-soft">Contact</span>
        <h2>Let’s explore the next step together.</h2>
        <p>Tell us a little about what you need and our team will be in touch.</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-grid">
          <label>
            Name
            <input name="name" type="text" autoComplete="name" required maxLength={120} />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required maxLength={320} />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={32} />
          </label>
          <label>
            Topic
            <input name="topic" type="text" required minLength={2} maxLength={120} />
          </label>
          <label className="contact-message-field">
            Message
            <textarea name="message" rows={6} required maxLength={1500} />
          </label>
        </div>

        <div className="contact-form-actions">
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
          <p aria-live="polite" className={`contact-feedback ${feedback?.type ?? ''}`}>
            {feedback?.message ?? ''}
          </p>
        </div>
      </form>
    </section>
  );
};

export default ContactPage;
