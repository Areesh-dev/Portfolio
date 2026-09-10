import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Instagram, Mail, Twitter, Facebook, Globe } from 'lucide-react';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import { useSiteContent } from '../hooks/useSiteContent.jsx';
import { cn } from '../utils/cn.js';

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  email: Mail,
  website: Globe,
  other: Globe,
};

export default function Hero() {
  const { content } = useSiteContent();
  const links = content?.social_links || [];
  const hasVideo = !!content?.hero_video_url;

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      className={cn(
        'relative overflow-hidden pb-20 sm:pb-28',
        hasVideo ? '-mt-16 pt-40' : 'pt-16 sm:pt-24'
      )}
    >
      {hasVideo ? (
        <>
          <video
            key={content.hero_video_url}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            src={content.hero_video_url}
            poster={content.hero_image_url || undefined}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 -z-10 bg-primary-900/10 bg-gradient-to-b from-page/100 via-page/100 to-page opacity-70" />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-x-0 -top-32 -z-10 flex justify-center blur-3xl">
          <div className="h-72 w-[78rem] rounded-full bg-white/5" />
        </div>
      )}

      <Container className={hasVideo ? 'flex min-h-[70vh] flex-col justify-center' : 'grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]'}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="mb-5 inline-block rounded-full border border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-sm font-semibold text-primary-300">
            {content?.site_tagline || 'Available for new projects'}
          </span>
          <h1 className="text-3xl font-rowdies font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl">
  {content?.hero_heading || "Hi, I'm a"}{' '}
  <span className="font-rowdies text-primary-400">
    {content?.hero_subheading || 'Full-Stack Developer'}
  </span>
</h1>
          <p className="mt-6 max-w-xl text-lg text-ink/60">
            {content?.hero_intro ||
              'I design and build fast, reliable web applications from front to back — clean interfaces backed by solid engineering.'}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button size="lg" onClick={() => scrollTo('projects')}>
              View My Work <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollTo('contact')}>
              Let&apos;s Work Together
            </Button>
          </div>

          {links.length > 0 && (
            <div className="mt-10 flex items-center gap-4">
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
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition hover:border-primary-300 hover:text-primary-300"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
        </motion.div>

        {!hasVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative mx-auto aspect-[4/5] w-full max-w-sm"
          >
            <div className="absolute inset-0 rounded-[2rem] from-primary-800 to-primary-800 opacity-90" />
            {content?.hero_image_url ? (
              <img
                src={content.hero_image_url}
                alt="Profile"
                className="absolute inset-2 rounded-[1.7rem] object-cover shadow-soft"
              />
            ) : (
              <div className="absolute inset-2 flex items-center justify-center rounded-[1.7rem] bg-black/10 text-white/80">
                <span className="text-sm">Profile photo</span>
              </div>
            )}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
