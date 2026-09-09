import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">404</p>
      <h1 className="text-3xl font-bold text-ink">Page not found</h1>
      <p className="max-w-sm text-ink/60">The page you're looking for doesn't exist or has been moved.</p>
      <Button as={Link} to="/">
        Back to Home
      </Button>
    </div>
  );
}
