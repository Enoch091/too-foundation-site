import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import MentorCard from '../components/MentorCard';

const areasOfInterest = [
  'Teaching / Mentoring',
  'Organizing Events',
  'Community Outreach',
  'Media / Communications',
  'Advocacy',
  'Administrative Tasks',
];

const testimonials = [
  { quote: 'Volunteering with TOOF has been one of the most fulfilling experiences of my life. The team is incredible and the impact is real.', author: 'Chioma A.' },
  { quote: 'I found purpose in serving others through TOOF. Every outreach reminds me why this work matters.', author: 'Emeka O.' },
  { quote: 'TOOF gave me the platform to use my skills for good. I\'ve grown so much as a person.', author: 'Fatima M.' },
];

const mentors = [
  {
    name: 'Bamisope Adeyanju',
    role: 'VOLUNTEER MENTOR',
    image: '/assets/images/mentor-1.jpg',
    bio: 'We are proud to introduce Bamisope Adeyanju as one of the dedicated volunteer mentors for The Oluwatoyin Omotayo Initiative (TOOI).\n\nBami\'s journey from being the best graduating law student at Adekunle Ajasin University to becoming a Baker McKenzie Scholar at Columbia Law School, and now serving as a Corporate Governance and Securities Associate at Day Pitney LLP, is nothing short of inspiring.\n\nHer career spans Nigeria and the U.S., where she has represented clients in complex commercial transactions and public interest litigation, worked with UN institutions and the Inter-American Commission to advance racial and economic justice, and advised on international financial accountability and ESG strategies.\n\nThrough TOOI, Bami brings her wealth of knowledge and global perspective to mentor secondary school students, guiding them to discover their potential and confidently navigate their career paths.',
  },
  {
    name: 'Oluwatobi Adetona',
    role: 'VOLUNTEER MENTOR',
    image: '/assets/images/mentor-2.jpg',
    bio: 'We are delighted to introduce Oluwatobi Adetona as one of our inspiring volunteer mentors at The Oluwatoyin Omotayo Initiative (TOOI). In this role, she is dedicated to guiding secondary school students as they explore their strengths, identify their passions, and navigate their career paths with clarity and confidence.\n\nOluwatobi is a legal professional with extensive experience in corporate and energy law. She currently serves as Legal and Compliance Manager in the energy sector, where she provides strategic counsel on complex regulatory and contractual matters.\n\nHer passion for social justice and youth empowerment extends far beyond her corporate work. She is the founder of The Bonafide Advocator Initiative (BOFAI), a youth-led nonprofit that mentors, educates, and provides reintegration support to juveniles and young persons in correctional centers across Nigeria.\n\nIn 2021, Oluwatobi authored Law for the Layman, a book designed to promote legal literacy, featuring a foreword by renowned human rights lawyer Femi Falana, SAN.',
  },
  {
    name: 'Dr Gideon Ogunniye',
    role: 'VOLUNTEER MENTOR',
    image: '/assets/images/mentor-3.jpg',
    bio: 'Dr Gideon Ogunniye is a Lecturer at the University of Aberdeen, United Kingdom, where he combines teaching, research, and mentorship with a deep passion for community service. He has fifteen years of cognate experience in academia and has mentored over 100 students.\n\nHis academic work is complemented by a strong commitment to empowering young people through webinars, online tutorials, workshops, and talk shows beyond the university setting.\n\nThrough his involvement with several charitable initiatives, Gideon has supported projects that promote education, well-being, and social empowerment. He brings valuable expertise, integrity, and vision to the organisation, helping to guide its mission of making a lasting difference in people\'s lives.',
  },
  {
    name: 'Azeezat Alaka',
    role: 'VOLUNTEER MENTOR',
    image: '/assets/images/mentor-4.jpg',
    bio: 'We are excited to introduce Azeezat Alaka as one of our passionate volunteer mentors at The Oluwatoyin Omotayo Initiative (TOOI). Azeezat is a dedicated legal practitioner, human rights advocate, and future social worker with a deep commitment to empowering vulnerable populations and combating social injustices.\n\nHer work spans advocacy, social work, counselling, mentoring, and policy reform, reflecting her holistic approach to creating meaningful and lasting change.\n\nAs a proud mother of four, Azeezat is driven by a vision to build a more just and compassionate world for future generations. Through her role at TOOI, she mentors secondary school students, inspiring them to rise above challenges, embrace their potential, and pursue purposeful career paths.',
  },
];

const Volunteer = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    interests: [] as string[],
    availability: '',
    why: '',
    consent: false,
  });
  const [showThankYou, setShowThankYou] = useState(false);

  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.phone &&
    formData.interests.length > 0 &&
    formData.availability &&
    formData.why &&
    formData.consent;

  const handleInterestChange = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // In production, this would submit to a backend
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 4000);

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      interests: [],
      availability: '',
      why: '',
      consent: false,
    });
  };

  return (
    <>
      {/* Hero */}
      <HeroSection title="Volunteer" imageSrc="/assets/images/volunteer-hero.jpg" />

      {/* Intro */}
      <section className="py-12">
        <div className="container">
          <p className="text-xl lg:text-2xl text-center text-muted-foreground">
            Because real change needs real people.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-8 lg:py-16">
        <div className="container max-w-3xl">
          <div className="bg-muted rounded-2xl p-8 lg:p-12">
            <form onSubmit={handleSubmit} noValidate>
              {/* Name / Email / Phone */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="bg-white rounded-full px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white rounded-full px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (e.g., +2348012345678)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-white rounded-full px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green"
                />
              </div>

              {/* Area of Interest */}
              <div className="mb-8">
                <h3 className="font-bold mb-4">Area of Interest</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {areasOfInterest.map((interest) => (
                    <label key={interest} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          formData.interests.includes(interest)
                            ? 'bg-green border-green'
                            : 'border-muted-foreground group-hover:border-green'
                        }`}
                      >
                        {formData.interests.includes(interest) && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 6l3 3 5-6" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                        className="sr-only"
                      />
                      <span className="text-foreground group-hover:text-green transition-colors">
                        {interest}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-8">
                <h3 className="font-bold mb-4">Availability</h3>
                <div className="flex gap-6">
                  {['Weekdays', 'Flexible'].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          formData.availability === option
                            ? 'border-green'
                            : 'border-muted-foreground group-hover:border-green'
                        }`}
                      >
                        {formData.availability === option && (
                          <div className="w-2.5 h-2.5 rounded-full bg-green" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="availability"
                        value={option}
                        checked={formData.availability === option}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                        className="sr-only"
                      />
                      <span className="text-foreground group-hover:text-green transition-colors">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Why */}
              <div className="mb-8">
                <textarea
                  placeholder="Why do you want to volunteer?"
                  value={formData.why}
                  onChange={(e) => setFormData({ ...formData, why: e.target.value })}
                  required
                  rows={4}
                  className="w-full bg-white rounded-xl px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green resize-none"
                />
              </div>

              {/* Consent */}
              <div className="mb-8">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-0.5 flex-shrink-0 ${
                      formData.consent
                        ? 'bg-green border-green'
                        : 'border-muted-foreground group-hover:border-green'
                    }`}
                  >
                    {formData.consent && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 6l3 3 5-6" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="sr-only"
                  />
                  <span className="text-foreground text-sm">
                    I agree to be contacted regarding volunteer opportunities.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`btn w-full py-4 text-lg ${
                  isFormValid
                    ? 'btn-green'
                    : 'bg-muted-foreground/30 text-muted-foreground cursor-not-allowed'
                }`}
              >
                Send Application
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsCarousel testimonials={testimonials} title="Volunteers Testimonials" />

      {/* Mentors */}
      <section className="py-16 lg:py-24 bg-muted" id="volunteer-mentors">
        <div className="container">
          <h2 className="section-title text-center mb-12">Volunteer Mentors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.name} {...mentor} />
            ))}
          </div>
        </div>
      </section>

      {/* Thank You Overlay */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-12 text-center animate-fade-in">
            <h3 className="text-3xl font-bold text-foreground mb-4">Thank You!</h3>
            <p className="text-lg text-muted-foreground">Application Received.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Volunteer;
