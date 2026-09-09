import { motion } from 'framer-motion';
import DynamicIcon from './DynamicIcon.jsx';

export default function ServiceCard({ service, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-soft backdrop-blur-sm"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/15 text-primary-300">
        <DynamicIcon name={service.icon} className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-ink">{service.title}</h3>
      {service.description && <p className="text-sm leading-relaxed text-ink/60">{service.description}</p>}
    </motion.div>
  );
}
