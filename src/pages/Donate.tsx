import { useState } from 'react';
import HeroSection from '../components/HeroSection';

const donationTypes = [
  { value: 'one-time', label: 'One-time donation' },
  { value: 'monthly', label: 'Monthly giving' },
];

const sponsorProjects = [
  { value: 'cloth-kid', label: 'Cloth a Kid' },
  { value: 'sponsor-student', label: 'Sponsor a Student' },
  { value: 'free-victim', label: 'Free an Abuse Victim' },
];

const locations = [
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'uk', label: 'United Kingdom (UK)' },
];

const paymentMethods = [
  { value: 'paystack', label: 'Paystack', disabled: true },
  { value: 'bank-transfer', label: 'Bank Transfer', disabled: false },
  { value: 'direct-debit', label: 'Direct Debit', disabled: true },
  { value: 'international-card', label: 'International Card', disabled: true },
];

const bankDetails = {
  nigeria: {
    accountName: 'The Olanike Omopariola Foundation',
    accountNumber: '0123456789',
    bank: 'Zenith Bank',
  },
  uk: {
    accountName: 'The Olanike Omopariola Foundation',
    accountNumber: '12345678',
    bank: 'Barclays Bank',
    sortCode: '20-00-00',
  },
};

const Donate = () => {
  const [donationType, setDonationType] = useState('');
  const [sponsorProject, setSponsorProject] = useState('');
  const [location, setLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showSponsorOptions, setShowSponsorOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const isFormValid = (donationType || sponsorProject) && location && paymentMethod;

  const handleDonate = () => {
    if (paymentMethod === 'bank-transfer') {
      setShowModal(true);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const currentBank = location === 'uk' ? bankDetails.uk : bankDetails.nigeria;
  const donationLabel = sponsorProject 
    ? sponsorProjects.find(p => p.value === sponsorProject)?.label 
    : donationTypes.find(t => t.value === donationType)?.label;

  return (
    <>
      {/* Hero */}
      <HeroSection title="Donate" imageSrc="/assets/images/donate-hero.jpg" />

      {/* Intro */}
      <section className="py-12">
        <div className="container">
          <p className="text-xl lg:text-2xl text-center text-muted-foreground">
            Your gift fuels safety, dignity, and opportunity.
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-8 lg:py-16">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Donation Type */}
            <div className="bg-muted rounded-xl p-6">
              <h3 className="font-bold uppercase text-sm tracking-wide mb-4">Donation Type</h3>
              <div className="space-y-3">
                {donationTypes.map((type) => (
                  <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="donationType"
                      value={type.value}
                      checked={donationType === type.value}
                      onChange={(e) => {
                        setDonationType(e.target.value);
                        setSponsorProject('');
                      }}
                      className="w-5 h-5 accent-green"
                    />
                    <span className="text-foreground group-hover:text-green transition-colors">
                      {type.label}
                    </span>
                  </label>
                ))}

                {/* Sponsor a Project Toggle */}
                <button
                  onClick={() => setShowSponsorOptions(!showSponsorOptions)}
                  className="flex items-center justify-between w-full py-2 font-semibold text-foreground hover:text-green transition-colors"
                >
                  <span>SPONSOR A PROJECT</span>
                  <span className={`transition-transform ${showSponsorOptions ? 'rotate-180' : ''}`}>▾</span>
                </button>

                {showSponsorOptions && (
                  <div className="pl-4 space-y-3 border-l-2 border-green/30">
                    {sponsorProjects.map((project) => (
                      <label key={project.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="donationType"
                          value={project.value}
                          checked={sponsorProject === project.value}
                          onChange={(e) => {
                            setSponsorProject(e.target.value);
                            setDonationType('');
                          }}
                          className="w-5 h-5 accent-green"
                        />
                        <span className="text-foreground group-hover:text-green transition-colors">
                          {project.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-muted rounded-xl p-6">
              <h3 className="font-bold uppercase text-sm tracking-wide mb-4">Location</h3>
              <div className="space-y-3">
                {locations.map((loc) => (
                  <label key={loc.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="location"
                      value={loc.value}
                      checked={location === loc.value}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-5 h-5 accent-green"
                    />
                    <span className="text-foreground group-hover:text-green transition-colors">
                      {loc.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-muted rounded-xl p-6">
              <h3 className="font-bold uppercase text-sm tracking-wide mb-4">Payment Method</h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-3 ${
                      method.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled={method.disabled}
                      className="w-5 h-5 accent-green"
                    />
                    <span className={`text-foreground ${!method.disabled && 'group-hover:text-green'} transition-colors`}>
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Donate Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleDonate}
              disabled={!isFormValid}
              className={`btn text-lg px-12 py-4 ${
                isFormValid
                  ? 'btn-green'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              Donate
            </button>
          </div>
        </div>
      </section>

      {/* Bank Transfer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative animate-fade-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-2xl text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-foreground mb-6">Bank Transfer</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Account Name</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{currentBank.accountName}</span>
                  <button
                    onClick={() => copyToClipboard(currentBank.accountName, 'name')}
                    className="text-green text-sm hover:underline"
                  >
                    {copiedField === 'name' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">{currentBank.accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(currentBank.accountNumber, 'number')}
                    className="text-green text-sm hover:underline"
                  >
                    {copiedField === 'number' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Bank</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{currentBank.bank}</span>
                  <button
                    onClick={() => copyToClipboard(currentBank.bank, 'bank')}
                    className="text-green text-sm hover:underline"
                  >
                    {copiedField === 'bank' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {location === 'uk' && (
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Sort Code</span>
                  <span className="font-mono font-medium">{bankDetails.uk.sortCode}</span>
                </div>
              )}
            </div>

            <p className="text-muted-foreground mb-2">
              <strong>Donation Type:</strong> {donationLabel || 'Donation'}
            </p>

            <p className="text-sm text-muted-foreground">
              When making your transfer, please include this in the description:
            </p>
            <p className="font-mono bg-muted p-3 rounded mt-2 text-center">
              TOOF-{donationLabel?.toUpperCase().replace(/\s+/g, '-')}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Donate;
