import { Github, Linkedin, Instagram, Mail, Twitter, Facebook, Globe } from 'lucide-react';
import Container from '../components/Container.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent.jsx';

const ICONS = { github: Github, linkedin: Linkedin, instagram: Instagram, twitter: Twitter, facebook: Facebook, email: Mail, website: Globe, other: Globe };


export default function Footer() {
  const { content } = useSiteContent();
  const links = content?.social_links || [];

  return (
    <footer className="px-4 pb-6 pt-4 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] px-6 py-12 shadow-glass backdrop-blur-2xl sm:px-12">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[32rem] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />

        <Container className="relative flex flex-col items-center gap-8 text-center">
          <div>
            <Link to="/" className="shrink-0">
          <img
            src="/logo.png"
            alt={content?.site_title || 'Portfolio'}
            className="h-14 w-auto object-contain"
          />
        </Link>
          </div>


          {links.length > 0 && (
            <div className="flex items-center gap-3">
              {links.map((link) => {
                const Icon = ICONS[link.platform] || Globe;
                const href = link.platform === 'email' && !link.url.startsWith('mailto:') ? `mailto:${link.url}` : link.url;
                return (
                  <a
                    key={link.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink/50 transition hover:border-primary-400/40 hover:text-primary-300"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}

          <p className="text-xs text-ink/40">
            &copy; {new Date().getFullYear()} {content?.site_title || 'Portfolio'}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
