import { cn } from '../utils/cn.js';

export default function Container({ children, className = '' }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-6', className)}>{children}</div>;
}
