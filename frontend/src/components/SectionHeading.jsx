import { motion } from 'framer-motion';
import Container from './Container.jsx';
import { cn } from '../utils/cn.js';

export default function SectionHeading({ eyebrow, title, description, align = 'left', className = '' }) {
  return (
    <Container className={cn('mb-12', align === 'center' && 'text-center', className)}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        {eyebrow && (
          <span className="mb-3 inline-block rounded-full border border-primary-400/30 bg-primary-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary-300">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
        {description && <p className={cn('mt-4 max-w-2xl text-ink/60', align === 'center' && 'mx-auto')}>{description}</p>}
      </motion.div>
    </Container>
  );
}
