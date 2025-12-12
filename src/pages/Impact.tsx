import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import TestimonialsCarousel from '../components/TestimonialsCarousel';

const focusAreas = [
  {
    id: 'gbv',
    title: 'Gender-Based Violence',
    subtitle: 'Creating safe spaces and support for survivors.',
    image: '/assets/images/area-gbv.jpg',
    description: 'Silence fuels abuse. We\'re breaking it—boldly. From school sensitization drives to survivor support sessions, our GBV advocacy includes awareness campaigns, trauma-informed workshops, and public conversations that dismantle shame and stigma. We help survivors find voice, strength, and access to safe channels for justice and healing.',
  },
  {
    id: 'education',
    title: 'Education Access',
    subtitle: 'Empowering children and youth through quality learning.',
    image: '/assets/images/area-education.jpg',
    description: 'Education is not a luxury—it\'s a right. We run school outreach programs that provide underprivileged students with learning materials, mentorship, and access to guidance resources. From early childhood to secondary school, we\'re ensuring that more children—especially girls—stay in school, dream bigger, and thrive.',
  },
  {
    id: 'women-empowerment',
    title: 'Women Empowerment',
    subtitle: 'Equipping women with skills, resources, and confidence.',
    image: '/assets/images/area-women.jpg',
    description: 'We believe that empowering women is key to transforming communities. Through leadership programs, entrepreneurship training, and confidence-building spaces, we help women reclaim their voice, pursue economic freedom, and take up meaningful roles in society. Our work includes mentorship circles, empowerment events, and advocacy that challenges harmful gender norms.',
  },
  {
    id: 'health-wellness',
    title: 'Health & Wellness',
    subtitle: 'Promoting mental, physical, and emotional well-being.',
    image: '/assets/images/area-health.jpg',
    description: 'True empowerment starts with well-being. We promote physical, mental, and emotional health through outreach clinics, hygiene drives, and wellness sessions tailored for women and youth. Our programs focus on menstrual health education, trauma healing, stress management, and fitness awareness—creating safe, supportive environments for individuals to thrive inside and out.',
  },
  {
    id: 'youth-mentorship',
    title: 'Youth Mentorship',
    subtitle: 'Raising the next generation of ethical leaders.',
    image: '/assets/images/area-youth.jpg',
    description: 'Every young person deserves guidance. Our youth mentorship programs pair teens and young adults with role models who help them navigate life, build character, and develop purpose. From career talks to life skills training, we are shaping a generation of responsible, ethical, and visionary Nigerian leaders.',
  },
  {
    id: 'community-development',
    title: 'Community Development',
    subtitle: 'Driving sustainable impact at the grassroots.',
    image: '/assets/images/area-community.jpg',
    description: 'We don\'t believe in one-off interventions. We believe in sustainable growth. Through clean water drives, health sensitization, economic empowerment training, and local partnerships, we help communities build long-term systems that improve daily life. Our goal is to leave each place better than we found it—structurally and socially.',
  },
];

const stats = [
  { num: 3000, label: 'Lives Touched', suffix: '+' },
  { num: 8, label: 'Active Volunteers' },
  { num: 15, label: 'Outreach Programs' },
  { num: 4, label: 'States Reached' },
  { num: 7, label: 'School Interventions' },
];

const testimonials = [
  { quote: 'TOOF gave me a second chance at life. I never thought I could escape my situation, but they showed me it was possible.', author: 'Survivor' },
  { quote: 'The mentorship program changed my perspective on education. Now I dream of becoming a lawyer.', author: 'Student Mentee' },
  { quote: 'Volunteering with TOOF has been life-changing. The impact we create together is incredible.', author: 'Volunteer' },
  { quote: 'Their health outreach program helped me understand my body better and take care of myself.', author: 'Program Beneficiary' },
];

const Impact = () => {
  const [counters, setCounters] = useState(stats.map(() => 0));
  const statsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          stats.forEach((stat, index) => {
            let current = 0;
            const step = Math.max(1, Math.round(stat.num / 60));
            const animate = () => {
              current += step;
              if (current >= stat.num) {
                setCounters((prev) => {
                  const newCounters = [...prev];
                  newCounters[index] = stat.num;
                  return newCounters;
                });
              } else {
                setCounters((prev) => {
                  const newCounters = [...prev];
                  newCounters[index] = current;
                  return newCounters;
                });
                requestAnimationFrame(animate);
              }
            };
            animate();
          });
        }
      },
      { threshold: 0.4 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero */}
      <HeroSection title="Impact" imageSrc="/assets/images/impact-hero.jpg" />

      {/* Intro */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <p className="text-xl lg:text-2xl text-center text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            At The Olanike Omopariola Foundation, our impact goes beyond numbers. Every outreach, every workshop,
            and every voice empowered is a story of transformation.
          </p>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-12 lg:py-20">
        <div className="container">
          <h2 className="section-title text-center mb-4">Our Mission & Focus Areas</h2>
          <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            We're on a mission to create safe, empowered, and educated communities—one life at a time.
          </p>

          <div className="space-y-16">
            {focusAreas.map((area, index) => (
              <div
                key={area.id}
                id={area.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
                    <img
                      src={area.image}
                      alt={area.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute left-6 right-6 bottom-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{area.title}</h3>
                      <p className="opacity-90">{area.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="bg-white py-16 lg:py-20" id="stats">
        <div className="container">
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8 lg:gap-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="flex flex-col items-center text-center px-4">
                <span className="font-coolvetica text-4xl lg:text-5xl text-green leading-none">
                  {counters[index]}{stat.suffix || ''}
                </span>
                <span className="text-foreground mt-2 text-sm lg:text-base">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 lg:py-24 bg-muted" id="featured-stories">
        <div className="container">
          <h2 className="section-title text-center mb-12">Featured Stories</h2>

          {/* Story 1 */}
          <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-start">
            <figure className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
              <img
                src="/assets/images/story1.jpg"
                alt="Smiling girl reading"
                className="w-full h-full object-cover"
              />
            </figure>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">A Mother's Victory</h3>
              <p className="text-green font-medium mb-4">How TOOF Helped Reunite Sarah With Her Children Across Borders</p>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm lg:text-base">
                <p>
                  When Sarah (name changed for privacy) first walked into The Olanike Omopariola Foundation (TOOF) office, 
                  her eyes were clouded with pain and exhaustion. Her two young children had been illegally taken abroad 
                  by her estranged husband, leaving her helpless and terrified.
                </p>
                <p>
                  That was when she found TOOF. Upon hearing her story, TOOF immediately sprang into action, rallying 
                  support from key government agencies, including the National Human Rights Commission, Interpol, and Nigerian Customs.
                </p>
                <p>
                  After months of painstaking effort, Sarah's perseverance paid off—her children were finally brought back home. 
                  "The day I held my children again, I knew hope was real," Sarah said. "TOOF gave me back my family and my voice."
                </p>
              </div>
            </div>
          </article>

          {/* Story 2 */}
          <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <figure className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden lg:order-2">
              <img
                src="/assets/images/story2.jpg"
                alt="Volunteer with child"
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="lg:order-1">
              <h3 className="text-2xl font-bold text-foreground mb-2">From Pain to Purpose</h3>
              <p className="text-green font-medium mb-4">How TOOF Helped Grace Rebuild Her Life and Business After Abuse</p>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm lg:text-base">
                <p>
                  For years, Grace (name changed) endured the torment of a violent marriage. Her husband not only 
                  physically and emotionally abused her but also refused to take financial responsibility for their children.
                </p>
                <p>
                  TOOF provided immediate intervention, rescuing Grace and her children from the abusive home and placing 
                  them in a safe location. Beyond physical safety, TOOF understood that true empowerment comes from economic independence.
                </p>
                <p>
                  Today, Grace's POS business is thriving. She has become financially independent, able to pay school fees, 
                  provide nutritious meals for her children, and even save for the future.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsCarousel testimonials={testimonials} />

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#14248A] to-[#1A3A8E] py-16 lg:py-20">
        <div className="container text-center">
          <h3 className="font-coolvetica text-3xl lg:text-4xl text-white mb-8">
            Your <span className="text-green">support</span> makes these stories possible.
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donate"
              className="btn bg-navy text-white px-8 py-4 text-lg font-semibold hover:bg-navy-dark transition-colors"
            >
              Donate Now
            </Link>
            <Link
              to="/volunteer"
              className="btn btn-green px-8 py-4 text-lg font-semibold"
            >
              Volunteer With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Impact;
