import { Star } from 'lucide-react';
import { cn } from '../utils/cn.js';

export default function StarRating({ rating, onChange, size = 'h-4 w-4' }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-0.5" role={onChange ? 'radiogroup' : undefined} aria-label="Rating">
      {stars.map((n) => (
        <button
          key={n}
          type={onChange ? 'button' : undefined}
          onClick={onChange ? () => onChange(n) : undefined}
          disabled={!onChange}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className={cn(!onChange && 'cursor-default')}
        >
          <Star className={cn(size, n <= rating ? 'fill-amber-400 text-amber-400' : 'text-ink/20')} />
        </button>
      ))}
    </div>
  );
}
