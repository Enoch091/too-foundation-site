import { useState } from 'react';

interface TeamCardProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const TeamCard = ({ name, role, image, bio }: TeamCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
        aria-expanded={isOpen}
      >
        <div className="relative h-[280px] md:h-[320px] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
          <p className="text-sm uppercase tracking-wide text-green font-semibold">
            {role}
          </p>
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">
          <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
            {bio}
          </p>
        </div>
      </div>
    </article>
  );
};

export default TeamCard;
