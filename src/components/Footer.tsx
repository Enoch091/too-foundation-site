import { Link } from 'react-router-dom';

const socialLinks = [
  { href: 'https://www.instagram.com/too.foundation', icon: 'instagram.png', label: 'Instagram' },
  { href: 'https://www.facebook.com/share/1FJnW1cmfu/', icon: 'facebook.png', label: 'Facebook' },
  { href: 'https://www.tiktok.com/@toofoundation', icon: 'x.png', label: 'TikTok' },
  { href: 'https://wa.me/447769494810', icon: 'whatsapp.png', label: 'WhatsApp' },
  { href: 'https://www.youtube.com/@TOOFoundationtv', icon: 'youtube.png', label: 'YouTube' },
  { href: 'https://www.linkedin.com/in/oluwatoyin-omotayo-ll-b-bl-ll-m-8708bab8', icon: 'linkedin.png', label: 'LinkedIn' },
];

const footerLinks1 = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/donate', label: 'Donate' },
];

const footerLinks2 = [
  { href: '/#events', label: 'Events' },
  { href: '/impact#featured-stories', label: 'Impact Stories' },
  { href: '/contact', label: 'Contact' },
  { href: '/about#mission', label: 'Our Mission' },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 lg:col-span-2">
            <img
              src="/assets/images/logo.png"
              alt="The Olanike Omopariola Foundation"
              className="h-10 w-auto mb-4"
            />
            <p className="text-muted-foreground text-lg mb-6">
              <a
                href="mailto:info@olanikeomopariolafoundation.org"
                className="hover:text-green transition-colors"
              >
                info@olanikeomopariolafoundation.org
              </a>
            </p>

            {/* Social Links */}
            <ul className="flex gap-5 list-none p-0 m-0">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-9 h-9 border border-gray-300 rounded-full hover:border-green transition-colors"
                    aria-label={social.label}
                  >
                    <img
                      src={`/assets/icons/${social.icon}`}
                      alt=""
                      className="w-5 h-5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 1 */}
          <nav aria-label="Footer Navigation 1">
            <ul className="list-none p-0 m-0 space-y-3">
              {footerLinks1.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-foreground font-medium hover:text-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Links Column 2 */}
          <nav aria-label="Footer Navigation 2">
            <ul className="list-none p-0 m-0 space-y-3">
              {footerLinks2.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-foreground font-medium hover:text-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border text-center py-8 text-muted-foreground">
        © 2025 The Olanike Omopariola Foundation. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
