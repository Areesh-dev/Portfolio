import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, FileText } from 'lucide-react';
import Button from '../components/Button.jsx';
import { useSiteContent } from '../hooks/useSiteContent.jsx';
import { cn } from '../utils/cn.js';


const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'skills', label: 'Skills' },
  { id: 'resume', label: 'Resume' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const { content } = useSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';
  const resumeUrl = content?.resume_file_url;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onHome, content]);

  const goTo = (id) => {
    setMenuOpen(false);
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <header className="sticky top-4 z-40 mx-4 sm:mx-6">
      <div
        className={cn(
          'relative mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-white/10 px-4 shadow-glass backdrop-blur-2xl transition-colors duration-300 sm:px-6',
          scrolled ? 'bg-white/[0.08]' : 'bg-white/[0.05]'
        )}
      >
        <Link to="/" className="shrink-0">
          <img
            src="/logo.png"
            alt={content?.site_title || 'Portfolio'}
            className="h-10 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => goTo(link.id)}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                onHome && active === link.id
                  ? 'bg-primary-50 text-primary-950'
                  : 'text-ink/60 hover:text-ink'
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block">
          {resumeUrl ? (
            <Button as={Link} to="/resume" size="sm">
              <FileText className="h-4 w-4" /> View Resume
            </Button>
          ) : (
            <Button size="sm" onClick={() => goTo('contact')}>
              Let&apos;s Talk
            </Button>
          )}
        </div>

        <button
          className="rounded-full p-2 text-ink lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {menuOpen && (
          <nav className="absolute inset-x-0 top-[calc(100%+0.5rem)] flex flex-col gap-1 rounded-3xl border border-white/10 bg-page/90 p-3 shadow-glass backdrop-blur-2xl lg:hidden">
            {LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => goTo(link.id)}
                className="rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-ink/70 hover:bg-white/5 hover:text-ink"
              >
                {link.label}
              </button>
            ))}
            {resumeUrl ? (
              <Button as={Link} to="/resume" onClick={() => setMenuOpen(false)} className="mt-1">
                <FileText className="h-4 w-4" /> View Resume
              </Button>
            ) : (
              <Button className="mt-1" onClick={() => goTo('contact')}>
                Let&apos;s Talk
              </Button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
