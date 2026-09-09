import { Link } from 'react-router-dom';
import {
  Briefcase,
  Layers,
  FolderKanban,
  CheckCircle2,
  Rocket,
  Star,
  Clock,
  Inbox,
  Mail,
  ArrowUpRight,
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import { adminApi } from '../lib/api.js';
import { useAuth } from '../hooks/useAuth.jsx';
import Loader from '../components/Loader.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatDate } from '../utils/formatDate.js';

// Cyberminimalism: every tile uses the same neutral ink-on-surface
// treatment — no per-category accent colors, matching the grayscale-only
// reference palette (no hue anywhere, not even semantic green/blue/amber).
const CARDS = [
  { key: 'totalServices', label: 'Total Services', icon: Briefcase },
  { key: 'totalSkills', label: 'Total Skills', icon: Layers },
  { key: 'totalProjects', label: 'Total Projects', icon: FolderKanban },
  { key: 'publishedProjects', label: 'Published Projects', icon: CheckCircle2 },
  { key: 'upcomingProjects', label: 'Upcoming Projects', icon: Rocket },
  { key: 'approvedReviews', label: 'Approved Reviews', icon: Star },
  { key: 'pendingReviews', label: 'Pending Reviews', icon: Clock },
  { key: 'totalEnquiries', label: 'Total Enquiries', icon: Inbox },
  { key: 'newEnquiries', label: 'New Enquiries', icon: Mail },
];

const STATUS_TONE = { new: 'primary', read: 'neutral', replied: 'success', archived: 'warning' };

function initialsFrom(email = '') {
  const name = email.split('@')[0] || '';
  return name.slice(0, 2).toUpperCase() || 'AD';
}

function QuickAction({ to, title, description, count, cta }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary-900 to-black p-6 text-white shadow-glass transition hover:brightness-125"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          {count != null && <p className="mt-1 text-3xl font-extrabold">{count}</p>}
          <p className="mt-2 max-w-[16rem] text-sm text-white/70">{description}</p>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-white/70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <span className="relative mt-4 inline-block text-sm font-semibold text-white">{cta}</span>
    </Link>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: stats, loading } = useFetch(() => adminApi.dashboard(), []);
  const { data: enquiries, loading: enquiriesLoading } = useFetch(() => adminApi.enquiries.list(), []);
  const name = user?.email?.split('@')[0] || 'there';
  const recentEnquiries = (enquiries || []).slice(0, 5);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold capitalize text-ink">Welcome back, Muhammad Areesh Rashid</h1>
          <p className="mt-1 text-sm text-ink/50">Here's your content overview.</p>
        </div>
      </div>

      {loading && <Loader label="Loading stats…" />}

      {!loading && stats && (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center gap-4 rounded-2xl bg-surface p-6 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink/8 text-ink">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-ink">{stats[key]}</p>
                  <p className="text-xs text-ink/50">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickAction
              to="/admin/enquiries"
              title="Enquiries"
              count={stats.newEnquiries}
              description={stats.newEnquiries > 0 ? 'New messages waiting for a reply.' : 'You are all caught up.'}
              cta="View Enquiries"
            />
            <QuickAction
              to="/admin/reviews"
              title="Reviews"
              count={stats.pendingReviews}
              description={stats.pendingReviews > 0 ? 'Testimonials waiting for approval.' : 'Nothing pending review.'}
              cta="Moderate Reviews"
            />
            <QuickAction
              to="/admin/projects/new"
              title="Projects"
              description="Publish a new project to showcase your latest work."
              cta="Add a Project"
            />
          </div>

          <div className="rounded-2xl bg-surface p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-ink">Recent Enquiries</h2>
              <Link to="/admin/enquiries" className="text-sm font-medium text-ink/50 hover:text-ink">
                See all
              </Link>
            </div>
            {enquiriesLoading && <Loader label="Loading…" />}
            {!enquiriesLoading && recentEnquiries.length === 0 && (
              <EmptyState icon={Inbox} title="No enquiries yet." />
            )}
            {!enquiriesLoading && recentEnquiries.length > 0 && (
              <div className="divide-y divide-ink/5">
                {recentEnquiries.map((enq) => (
                  <Link
                    key={enq.id}
                    to="/admin/enquiries"
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 hover:opacity-70"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{enq.name}</p>
                      <p className="truncate text-xs text-ink/50">{enq.subject}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-xs text-ink/40">{formatDate(enq.created_at)}</span>
                      <Badge tone={STATUS_TONE[enq.status]}>{enq.status}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
