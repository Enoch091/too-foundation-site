import HeroSection from '../components/HeroSection';
import TeamCard from '../components/TeamCard';

const teamMembers = [
  {
    name: 'Oluwatoyin Aanuoluwapo Omotayo Esq',
    role: 'FOUNDER & EXECUTIVE DIRECTOR',
    image: '/assets/images/founnder-story.jpg',
    bio: 'Oluwatoyin Aanuoluwapo Omotayo Esq. leads strategy and partnerships across all programs, with a focus on education access and GBV advocacy. She mentors volunteers, drives growth, and ensures every outreach is people-first and measurable.',
  },
  {
    name: 'Tolulope Raymond-Ayube',
    role: 'TRUSTEE TOOF',
    image: '/assets/images/Tolulope.jpg',
    bio: 'Tolulope Raymond-Ayube serves as a trustee of TOOF, bringing with her a deep passion for charitable work and a strong commitment to supporting vulnerable women and girls. Since joining the board, she has played an active role in advancing the foundation\'s mission. In 2023, she convened the "Caring for Your Menstrual Health" charity programme, through which TOOF distributed sanitary pads to 2,000 girls across three schools in the Federal Capital Territory, Abuja. Beyond her philanthropic engagements, Mrs. Tolulope is the General Manager of 1314 Hotel and Suites in Abuja.',
  },
  {
    name: 'Engr. Kolade Omotayo',
    role: 'TRUSTEE TOOF',
    image: '/assets/images/Kolade.jpg',
    bio: 'Engr. Kolade Omotayo is a devoted trustee of TOOF, a qualified engineer, accomplished businessman, and pastor. He brings his commitment to charity and advocacy against domestic violence into every aspect of his service with the foundation. In 2024, he anchored TOOF\'s Charity and Empowerment Programme, where 10 survivors of domestic violence and single mothers received seed funding to support their businesses and strengthen their economic independence. The programme also provided food items to more than 100 women, reflecting his passion for empowerment and community upliftment.',
  },
  {
    name: 'Ayo Ogunbuyide',
    role: 'TRUSTEE TOOF, UK',
    image: '/assets/images/Ogunbuyide.jpg',
    bio: 'Ayo Ogunbuyide is the Chief Executive Officer of Shine Development Concept CIC. A UK registered Organisation that supports people going through difficult times in Northampton. He bagged his masters degree in Youth & Community leadership from the University of Northampton. He\'s passionate about the wellbeing & welfare of marginalised communities.',
  },
  {
    name: 'Oluwaseun Awoyemi',
    role: 'TRUSTEE TOOF, UK',
    image: '/assets/images/Awoyemi.jpg',
    bio: 'Oluwaseun Awoyemi is an Accounting graduate and a dedicated Project Officer with a strong background in financial services, telecommunications, academic operations, and project management. She currently works at the University of Bradford, where she plays a key role in facilitating smooth faculty processes and supporting educational excellence.\n\nWith a passion for community development and a heart for service, Oluwaseun brings a wealth of experience in organisational coordination and stakeholder engagement. Her commitment to empowering individuals and fostering inclusive opportunities aligns deeply with the mission of The Olanike Omopariola Foundation. Oluwaseun is honoured to contribute her skills and insights to further the Foundation\'s work in uplifting lives and promoting sustainable impact.',
  },
];

const About = () => {
  return (
    <>
      {/* Hero */}
      <HeroSection
        title="About Us"
        imageSrc="/assets/images/hero-desktop.jpg"
      />

      {/* Mission / Vision / Founder */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Mission */}
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-green mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To combat domestic and gender-based violence by empowering survivors through 
                education, advocacy, and sustainable support systems, equipping women and 
                children with the tools to overcome trauma, achieve independence, and thrive.
              </p>
            </div>

            {/* Founder Photo */}
            <figure className="flex justify-center">
              <div className="w-[280px] h-[380px] md:w-[320px] md:h-[440px] rounded-xl overflow-hidden">
                <img
                  src="/assets/images/model-center.jpg"
                  alt="Founder portrait"
                  className="w-full h-full object-cover"
                />
              </div>
            </figure>

            {/* Vision */}
            <div className="text-center lg:text-right">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A just world where no woman or child lives in fear—where safety, 
                equality, and opportunity are not privileges, but fundamental rights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Story */}
      <section className="bg-muted py-16 lg:py-24" id="founder-story">
        <div className="container">
          <h2 className="section-title text-center mb-12">Founder's Story</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Founder Card */}
            <article className="relative h-[500px] lg:h-[700px] rounded-xl overflow-hidden">
              <img
                src="/assets/images/founder-story.jpg"
                alt="Oluwatoyin Omotayo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              <div className="absolute left-8 bottom-8 flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-green mt-2 flex-shrink-0" />
                <div>
                  <span className="text-white text-2xl font-bold block">
                    Oluwatoyin Aanuoluwapo Omotayo Esq.
                  </span>
                  <span className="text-white/80 text-lg font-light">FOUNDER</span>
                </div>
              </div>
            </article>

            {/* Story Text */}
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Oluwatoyin Aanuoluwapo Omotayo Esq. journey is one of resilience, 
                courage, and an unwavering commitment to empower others.
              </p>
              <p>
                Her empathy for women struggling to survive after domestic 
                violence began in childhood, inspired by the tireless 
                example of her mother's strength and dignity.
              </p>
              <p>
                These early lessons, combined with her own lived experiences of 
                domestic violence, shaped her conviction to transform pain into purpose.
              </p>
              <p>
                A dedicated advocate for women's rights, Oluwatoyin has become a strong voice 
                against domestic and gender-based violence, working to raise awareness and 
                challenge cultural and systemic barriers that silence survivors. Through her 
                advocacy, she has authored thought-provoking articles and essays on domestic violence, 
                women's empowerment, and the intersection of human rights and migration.
              </p>
              <p>
                Her writings reflect her deep commitment to ensuring that survivors not 
                only find justice but also access the education, resources, and opportunities 
                they need to rebuild their lives.
              </p>
              <p>
                Oluwatoyin holds a Law degree (LL.B) from Adekunle Ajasin University, was 
                called to the Nigerian Bar after the Nigerian Law School, and pursued advanced 
                studies at the University of Hull, UK, where she earned a Master's in 
                International Law (Conflicts, Security, and Human Rights). She is preparing to 
                further her research work through a Ph.D., focusing on Female Genital Mutilation 
                as a Violation of Human Rights and a Catalyst for Forced Migration.
              </p>
              <p>
                In 2020, she founded The Olanike Omopariola Foundation (TOOF), in honor of 
                her mother, as a platform to advocate for survivors of abuse, promote social 
                justice, and support vulnerable families. Building on this, she established 
                The Oluwatoyin Omotayo Initiative (TOOI), a program dedicated to empowering 
                young people from disadvantaged backgrounds through education, 
                mentorship, and access to opportunities.
              </p>
              <p>
                Beyond her professional and advocacy work, Oluwatoyin is the proud 
                mother of two amazing boys. Her story continues to inspire others as living 
                proof that from adversity can emerge strength, and from pain, 
                a powerful mission to uplift others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <h2 className="section-title text-center mb-12">Meet the Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {teamMembers.map((member) => (
              <TeamCard key={member.name} {...member} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
