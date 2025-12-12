const GetInvolved = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[400px] lg:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/images/hero-get-involved.jpg"
            alt="Smiling student in class"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-5xl lg:text-7xl font-coolvetica font-light">
            Get Involved
          </h1>
        </div>
      </section>

      {/* Strapline */}
      <div className="container py-12 lg:py-16">
        <p className="text-center text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Join the Movement for a Violence-Free Future. Every woman and child deserves safety, dignity, and hope.
          Together, we can break the cycle of abuse and empower survivors to thrive.
        </p>
      </div>

      {/* Cards Band */}
      <section className="bg-navy py-16 lg:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Volunteer Card */}
            <article className="bg-white rounded-xl p-8 lg:p-12">
              <h2 className="text-green text-3xl lg:text-4xl font-coolvetica mb-6">
                Volunteer With Us
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Our programs are fueled by compassionate, committed individuals like you.
                Whether you're available for one event or want to stay long-term, there's a place for you here.
              </p>
              <a
                href="/volunteer"
                className="inline-flex items-center justify-center px-8 py-4 bg-green text-white rounded-full text-lg font-medium hover:bg-green-dark transition-colors"
              >
                Send Application
              </a>
            </article>

            {/* Donate Card */}
            <article className="bg-white rounded-xl p-8 lg:p-12">
              <h2 className="text-green text-3xl lg:text-4xl font-coolvetica mb-6">
                Donate to the Mission
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Every gift — big or small — makes it possible for us to educate, empower, and protect lives.
                Your donation goes directly to the field to fund materials, sessions, and outreach efforts.
              </p>
              <a
                href="/donate"
                className="inline-flex items-center justify-center px-8 py-4 bg-navy text-white rounded-full text-lg font-medium hover:bg-navy-dark transition-colors"
              >
                Donate Now
              </a>
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetInvolved;
