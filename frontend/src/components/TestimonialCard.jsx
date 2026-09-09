import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import StarRating from './StarRating.jsx';

export default function TestimonialCard({ review, index = 0 }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <Quote className="mb-3 h-6 w-6 text-primary-300" />
      <StarRating rating={review.rating} />
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">&ldquo;{review.review_text}&rdquo;</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-primary-500/15">
          {review.profile_image && <img src={review.profile_image} alt="" className="h-full w-full object-cover" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{review.client_name}</p>
          <p className="text-xs text-ink/50">{[review.client_role, review.company].filter(Boolean).join(' · ')}</p>
        </div>
      </figcaption>
    </motion.figure>
  );
}
