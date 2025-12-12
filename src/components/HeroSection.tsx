interface HeroSectionProps {
  title: string;
  imageSrc: string;
  imageAlt?: string;
}

const HeroSection = ({ title, imageSrc, imageAlt = '' }: HeroSectionProps) => {
  return (
    <section className="relative w-full">
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden mx-auto max-w-[1280px]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <h1 className="absolute left-8 md:left-12 bottom-8 md:bottom-12 text-white font-coolvetica text-4xl md:text-6xl lg:text-7xl font-light">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
