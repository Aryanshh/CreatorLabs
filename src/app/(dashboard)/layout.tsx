'use client';
import { usePathname } from 'next/navigation';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import './dashboard.css';

interface ProgressData {
  totalXP: number;
  currentLevel: number;
  creatorTier: string;
  tierDisplay: string;
}

function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    fetch('/api/user/progress').then(r => r.json()).then(setProgress).catch(() => {});
  }, []);

  const links = [
    { href: '/dashboard', icon: '○', label: 'Overview' },
    { href: '/dashboard/create', icon: '＋', label: 'Studio' },
    { href: '/dashboard/simulations', icon: '◷', label: 'History' },
    { href: '/dashboard/analytics', icon: '▤', label: 'Insights' },
    { href: '/dashboard/progress', icon: '☆', label: 'Progress' },
    { href: '/dashboard/leaderboard', icon: '△', label: 'Ranks' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-container">
          <div className="sidebar-logo-circle" />
        </div>
        <span className="sidebar-title">Creator Labs</span>
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-section">Main Menu</div>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
          >
            <span className="link-icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user-actions">
          <Link href="/dashboard/profile" className="user-action-link">Profile</Link>
          <Link href="/dashboard/settings" className="user-action-link">Settings</Link>
        </div>
        <div className="sidebar-user-card">
          <div className="sidebar-avatar">
            {session?.user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{session?.user?.name || 'Creator'}</div>
            <div className="sidebar-user-tier">
              {progress?.totalXP !== undefined ? `Lv.${progress.currentLevel} · ${progress.tierDisplay}` : 'Loading...'}
            </div>
          </div>
          <button className="logout-btn" onClick={() => signOut({ callbackUrl: '/' })} title="Sign out">
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}

function DashboardTopbar() {
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    fetch('/api/user/progress').then(r => r.json()).then(setProgress).catch(() => {});
  }, []);

  return (
    <div className="dashboard-topbar">
      <div className="topbar-title">Dashboard</div>
      <div className="topbar-actions">
        {progress?.totalXP !== undefined && (
          <div className="topbar-xp">XP {progress.totalXP.toLocaleString()}</div>
        )}
        <Link href="/dashboard/create" className="btn btn-accent btn-sm">
          New Simulation
        </Link>
      </div>
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <main className="dashboard-main">
        <DashboardTopbar />
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DashboardShell>{children}</DashboardShell>
    </SessionProvider>
  );
}
