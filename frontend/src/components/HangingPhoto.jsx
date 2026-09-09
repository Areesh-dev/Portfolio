import { motion, useMotionValue, useTransform } from 'framer-motion';

// A photo "pinned" at the top that can be nudged side to side and swings
// back like it's hanging from a string — drag physics via Framer Motion,
// no extra library. Rotation pivots from the top edge (transformOrigin) so
// it reads as swinging from the pin rather than spinning in place.
export default function HangingPhoto({ src, alt = '' }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-60, 60], [-10, 10]);

  return (
    <div className="relative mx-auto w-full max-w-sm select-none pt-9">
      {/* pin */}
      <div className="absolute left-1/2 top-1 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-ink/70 shadow-[0_2px_6px_rgba(0,0,0,0.4)]" />
      {/* string */}
      <div className="absolute left-1/2 top-2 h-8 w-px -translate-x-1/2 bg-gradient-to-b from-ink/50 to-ink/10" />

      <motion.div
        style={{ x, rotate, transformOrigin: 'top center' }}
        drag="x"
        dragConstraints={{ left: -50, right: 50 }}
        dragElastic={0.65}
        dragTransition={{ bounceStiffness: 320, bounceDamping: 11 }}
        whileTap={{ cursor: 'grabbing' }}
        className="relative aspect-[4/5] w-full cursor-grab overflow-hidden rounded-[1.75rem] border border-white/10 shadow-glass active:cursor-grabbing"
      >
        {src ? (
          <img src={src} alt={alt} draggable={false} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-500 to-primary-800 text-white/80">Photo</div>
        )}
      </motion.div>
    </div>
  );
}
