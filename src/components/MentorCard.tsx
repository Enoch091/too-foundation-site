import { useState } from 'react';

interface MentorCardProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const MentorCard = ({ name, role, image, bio }: MentorCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
        aria-expanded={isOpen}
      >
        <div className="relative h-[250px] md:h-[280px] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-foreground mb-1">{name}</h3>
          <p className="text-xs uppercase tracking-wide text-green font-semibold">
            {role}
          </p>
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5">
          <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
            {bio}
          </p>
        </div>
      </div>
    </article>
  );
};

export default MentorCard;
