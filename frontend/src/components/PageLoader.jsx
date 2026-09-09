import { motion } from 'framer-motion';

export default function PageLoader({ label = 'Portfolio' }) {
  const letters = label.split('');

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-page"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex text-2xl font-extrabold tracking-[0.2em] text-ink sm:text-3xl">
        {letters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.15, y: 6 }}
            animate={{ opacity: [0.15, 1, 0.15], y: [6, 0, 6] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.06, ease: 'easeInOut' }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        ))}
      </div>
      <div className="h-px w-24 overflow-hidden bg-white/10">
        <motion.div
          className="h-full w-1/3 bg-primary-400"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
