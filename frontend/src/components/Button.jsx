import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn.js';

// Cyberminimalism: no accent hue anywhere. Primary is a fixed bright
// off-white pill (max contrast against the dark public site, still reads
// fine with its shadow on the light admin panel). Secondary is a subtle
// theme-reactive glass chip. Outline/ghost lean on the `ink` token so they
// adapt automatically between the dark and light contexts.
const variants = {
  primary: 'bg-primary-50 text-primary-950 shadow-soft hover:bg-white',
  secondary: 'border border-white/10 bg-white/10 text-ink hover:bg-white/15',
  outline: 'border border-ink/15 text-ink hover:border-ink/40',
  ghost: 'text-ink hover:bg-ink/5',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </Component>
  );
}
