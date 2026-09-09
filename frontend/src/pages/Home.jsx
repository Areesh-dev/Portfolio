import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Hero from '../sections/Hero.jsx';
import About from '../sections/About.jsx';
import Services from '../sections/Services.jsx';
import Skills from '../sections/Skills.jsx';
import Resume from '../sections/Resume.jsx';
import Projects from '../sections/Projects.jsx';
import UpcomingProject from '../sections/UpcomingProject.jsx';
import NextProjectCountdown from '../sections/NextProjectCountdown.jsx';
import Testimonials from '../sections/Testimonials.jsx';
import Contact from '../sections/Contact.jsx';
import { useSiteContent } from '../hooks/useSiteContent.jsx';
import { setPageMeta } from '../utils/seo.js';

export default function Home() {
  const { hash } = useLocation();
  const { content } = useSiteContent();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [hash]);

  useEffect(() => {
    setPageMeta({
      title: content?.site_title ? `${content.site_title} — Portfolio` : 'Portfolio',
      description: content?.seo_meta_description || content?.hero_intro,
    });
  }, [content]);

  return (
    <Layout>
      <Hero />
      <About />
      <Services />
      <Skills />
      <Resume />
      <Projects />
      <UpcomingProject />
      <NextProjectCountdown />
      <Testimonials />
      <Contact />
    </Layout>
  );
}
