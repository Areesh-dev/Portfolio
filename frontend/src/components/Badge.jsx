import { cn } from '../utils/cn.js';


const tones = {
  neutral: 'bg-ink/5 text-ink/70',
  primary: 'bg-primary-50 text-primary-950',
  success: 'bg-emerald-500/15 text-emerald-400',
  warning: 'bg-amber-500/15 text-amber-400',
  danger: 'bg-red-500/15 text-red-400',
};

export default function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  );
}
