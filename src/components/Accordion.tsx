import { useState } from 'react';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion = ({ items }: AccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="border-b border-border pb-4">
          <h3>
            <button
              className="w-full flex items-center justify-between text-left py-4 group"
              onClick={() => toggle(item.id)}
              aria-expanded={openId === item.id}
            >
              <span className="text-lg md:text-xl font-medium text-foreground group-hover:text-green transition-colors">
                {item.question}
              </span>
              <svg
                className={`w-6 h-6 text-muted-foreground transition-transform duration-300 ${
                  openId === item.id ? 'rotate-90' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8.5 4.5L15 11l-6.5 6.5" />
              </svg>
            </button>
          </h3>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openId === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-muted-foreground leading-relaxed pb-4">
              {item.answer}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Accordion;
