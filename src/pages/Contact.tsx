import { useState } from 'react';
import HeroSection from '../components/HeroSection';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone &&
    formData.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setStatus('sending');

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('success');

    // Reset form after success
    setTimeout(() => {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
      });
      setStatus('idle');
    }, 3000);
  };

  return (
    <>
      {/* Hero */}
      <HeroSection title="Contact" imageSrc="/assets/images/contact-hero.jpg" />

      {/* Intro */}
      <section className="py-12">
        <div className="container">
          <p className="text-xl lg:text-2xl text-center text-muted-foreground">
            Let's stay connected — your message matters.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-8 lg:py-16">
        <div className="container max-w-2xl">
          <div className="bg-muted rounded-2xl p-8 lg:p-12">
            <form onSubmit={handleSubmit} noValidate>
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="w-full bg-white rounded-xl px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name*"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="w-full bg-white rounded-xl px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-white rounded-xl px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green"
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <input
                  type="tel"
                  placeholder="Phone Number*"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full bg-white rounded-xl px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green"
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <textarea
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full bg-white rounded-xl px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isFormValid || status === 'sending'}
                className={`btn w-full py-4 text-lg ${
                  isFormValid && status !== 'sending'
                    ? 'btn-green'
                    : 'bg-muted-foreground/30 text-muted-foreground cursor-not-allowed'
                }`}
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>

              {/* Status Message */}
              {status === 'success' && (
                <p className="mt-4 text-center text-green font-medium">
                  Message sent successfully! We'll get back to you soon.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-4 text-center text-red-500 font-medium">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Get in Touch */}
      <section className="py-16 lg:py-20">
        <div className="container text-center">
          <h2 className="section-title mb-8">Get in Touch</h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              <a
                href="mailto:info@olanikeomopariolafoundation.org"
                className="text-green hover:underline"
              >
                info@olanikeomopariolafoundation.org
              </a>
            </p>
            <p>+234 812 345 6789</p>
            <p>
              Instagram:{' '}
              <a
                href="https://www.instagram.com/too.foundation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green hover:underline"
              >
                @olanikefoundation
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
