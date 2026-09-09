import { motion } from 'framer-motion';

const dotTransition = (delay) => ({
  duration: 1,
  repeat: Infinity,
  ease: 'easeInOut',
  delay,
});

// A small row of pulsing dots orbiting in and out — lightweight (pure
// Framer Motion, no canvas/lottie), used both inline and as the full-page
// loading screen.
export default function Loader({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-16 ${className}`} role="status">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-primary-400"
            animate={{ scale: [0.5, 1, 0.5], opacity: [0.4, 1, 0.4] }}
            transition={dotTransition(i * 0.15)}
          />
        ))}
      </div>
      <span className="text-sm text-ink/50">{label}</span>
    </div>
  );
}
