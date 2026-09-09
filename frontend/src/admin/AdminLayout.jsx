import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  FileText,
  FolderKanban,
  Rocket,
  Star,
  Inbox,
  FileEdit,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { cn } from '../utils/cn.js';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/services', label: 'Services', icon: Briefcase },
  { to: '/admin/skills', label: 'Skills', icon: Layers },
  { to: '/admin/resume', label: 'Resume', icon: FileText },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/upcoming-projects', label: 'Upcoming Projects', icon: Rocket },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/admin/content', label: 'Website Content', icon: FileEdit },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function SidebarLinks({ onNavigate }) {
  return (
    <nav className="flex-1 space-y-1 px-3">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive ? 'bg-primary-50 text-primary-950' : 'text-ink/60 hover:bg-ink/5 hover:text-ink'
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-page">
      {/* Desktop sidebar — sticky full-height so it stays put on scroll */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink/10 bg-surface py-6 lg:flex">
        <div className="mb-6 px-6 text-lg font-bold text-ink">
          Admin Panel
        </div>
        <SidebarLinks />
        <div className="mt-6 border-t border-ink/10 px-3 pt-4">
          <p className="truncate px-3 pb-2 text-xs text-ink/40">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink/60 hover:bg-ink/5 hover:text-ink"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-surface py-6">
            <div className="mb-6 flex items-center justify-between px-6">
              <span className="text-lg font-bold text-ink">
                Admin<span className="text-primary-400">.</span>
              </span>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarLinks onNavigate={() => setDrawerOpen(false)} />
            <div className="mt-6 border-t border-ink/10 px-3 pt-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink/60 hover:bg-ink/5"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-ink/10 bg-surface/95 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-bold text-ink">Admin</span>
        </header>
        <main className="flex-1 overflow-x-hidden p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
