import { motion } from 'framer-motion';
import { Compass, Sprout } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import Container from '../components/Container.jsx';
import HangingPhoto from '../components/HangingPhoto.jsx';
import { useSiteContent } from '../hooks/useSiteContent.jsx';

export default function About() {
  const { content } = useSiteContent();

  return (
    <section id="about" className="py-24">
      <SectionHeading eyebrow="About Me" title={content?.about_heading || 'A bit about how I work'} />
      <Container className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <HangingPhoto src={content?.about_image_url} alt="About" />
        </motion.div>

        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-ink/70">
            {content?.about_description || 'Add a description of yourself from the admin panel.'}
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {content?.about_philosophy && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <Compass className="mb-3 h-5 w-5 text-primary-400" />
                <h3 className="mb-2 font-semibold text-ink">Development Philosophy</h3>
                <p className="text-sm text-ink/60">{content.about_philosophy}</p>
              </div>
            )}
            {content?.about_learning_journey && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <Sprout className="mb-3 h-5 w-5 text-primary-400" />
                <h3 className="mb-2 font-semibold text-ink">Learning Journey</h3>
                <p className="text-sm text-ink/60">{content.about_learning_journey}</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
