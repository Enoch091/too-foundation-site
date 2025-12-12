import HeroSection from '../components/HeroSection';
import Accordion from '../components/Accordion';

const faqItems = [
  {
    id: 'about',
    question: 'What is The Olanike Omopariola Foundation about?',
    answer: 'We\'re a nonprofit organization focused on advocacy, education, empowerment, and community development, especially for women, youth, and underserved groups in Nigeria.',
  },
  {
    id: 'based',
    question: 'Where are you based?',
    answer: 'We\'re headquartered in Nigeria, but our programs serve multiple communities across several states.',
  },
  {
    id: 'updates',
    question: 'How can I stay updated about your activities?',
    answer: 'Follow us on Instagram @olanikefoundation, subscribe to our newsletter, or check the Events section on our website.',
  },
  {
    id: 'volunteer-who',
    question: 'Who can volunteer with you?',
    answer: 'Anyone who is passionate, committed, and aligned with our mission is welcome. You don\'t need prior experience, just a willing heart.',
  },
  {
    id: 'paid',
    question: 'Are volunteers paid?',
    answer: 'No, volunteering is not paid. However, we occasionally offer stipends for travel or materials depending on the project and available funding.',
  },
  {
    id: 'remote',
    question: 'Can I volunteer remotely?',
    answer: 'Yes! Roles like social media advocacy, content creation, and virtual mentorship can be done remotely.',
  },
  {
    id: 'certificate',
    question: 'Will I receive a certificate or letter of service?',
    answer: 'Absolutely. Active volunteers are issued a certificate and recognition letter upon request.',
  },
  {
    id: 'donation-updates',
    question: 'Will I receive updates on how my donation was used?',
    answer: 'Yes. We send quarterly impact updates via email and post project highlights on our website and social media.',
  },
  {
    id: 'tax-deductible',
    question: 'Is my donation tax deductible?',
    answer: 'Currently, donations are not tax-deductible. We\'ll update you if this changes.',
  },
  {
    id: 'choose-funds',
    question: 'Can I choose what my donation funds?',
    answer: 'Yes, you can specify a focus area, for example GBV support, Education, or Events.',
  },
  {
    id: 'partners',
    question: 'Can my company or organization partner with you?',
    answer: 'Definitely. We welcome collaboration and sponsorships. Reach out via our Contact page or email us directly.',
  },
  {
    id: 'material-donations',
    question: 'Do you accept material donations (books, clothes, etc.)?',
    answer: 'Yes, we do, especially school supplies and hygiene kits. Please contact us to confirm current needs before sending.',
  },
];

const FAQ = () => {
  return (
    <>
      {/* Hero */}
      <HeroSection title="FAQ" imageSrc="/assets/images/faq-hero.jpg" />

      {/* Intro */}
      <section className="py-12">
        <div className="container">
          <p className="text-xl lg:text-2xl text-center text-muted-foreground">
            Your support reaches further than you think.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-8 lg:py-16">
        <div className="container max-w-4xl">
          <Accordion items={faqItems} />
        </div>
      </section>
    </>
  );
};

export default FAQ;
