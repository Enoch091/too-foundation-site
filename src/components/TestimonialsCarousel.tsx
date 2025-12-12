import { useState, useEffect } from 'react';

interface Testimonial {
  quote: string;
  author: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  title?: string;
}

const TestimonialsCarousel = ({ testimonials, title = 'Testimonials & Feedbacks' }: TestimonialsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="py-16 lg:py-20">
      <div className="container">
        <h2 className="section-title text-center mb-12">{title}</h2>

        <div className="flex items-center justify-center gap-8 max-w-4xl mx-auto">
          <button
            onClick={prev}
            className="w-12 h-12 flex items-center justify-center text-3xl text-muted-foreground hover:text-green transition-colors"
            aria-label="Previous testimonial"
          >
            ‹
          </button>

          <div className="flex-1 text-center px-4" aria-live="polite">
            <blockquote className="text-lg md:text-xl lg:text-2xl text-foreground italic leading-relaxed mb-6">
              "{testimonials[currentIndex].quote}"
            </blockquote>
            <div className="text-muted-foreground font-medium">
              — {testimonials[currentIndex].author}
            </div>
          </div>

          <button
            onClick={next}
            className="w-12 h-12 flex items-center justify-center text-3xl text-muted-foreground hover:text-green transition-colors"
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-green' : 'bg-muted-foreground/30'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
