'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OverviewData {
  overview: {
    totalSimulations: number; avgEngagement: number; avgVirality: number;
    avgImpressions: number; avgLikes: number; badgesEarned: number;
    level: number; tier: string;
  };
  platformDistribution: { platform: string; count: number }[];
  recentSimulations: Array<{
    id: string; platform: string; engagementRate: number; viralityScore: number;
    impressions: number; likes: number; createdAt: string;
    post: { body: string; hashtags: string[] } | null;
  }>;
}

const PLATFORM_ICONS: Record<string, string> = {
  INSTAGRAM: 'IG', TWITTER: 'X', TIKTOK: 'TT', YOUTUBE: 'YT', LINKEDIN: 'LI', THREADS: 'TH',
};

export default function DashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header"><h1>Dashboard</h1><p>Your content creation command center</p></div>
        <div className="grid-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}
        </div>
      </div>
    );
  }

  const o = data?.overview;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your content creation command center</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <div className="stat-card animate-fade-in">
          <div className="stat-icon-text">SIM</div>
          <div className="stat-value">{o?.totalSimulations || 0}</div>
          <div className="stat-label">Simulations Run</div>
        </div>
        <div className="stat-card animate-fade-in stagger-1">
          <div className="stat-icon-text">ENG</div>
          <div className="stat-value">{o?.avgEngagement || 0}%</div>
          <div className="stat-label">Avg Engagement</div>
        </div>
        <div className="stat-card animate-fade-in stagger-2">
          <div className="stat-icon-text">VIR</div>
          <div className="stat-value">{o?.avgVirality || 0}</div>
          <div className="stat-label">Avg Virality Score</div>
        </div>
        <div className="stat-card animate-fade-in stagger-3">
          <div className="stat-icon-text">BDG</div>
          <div className="stat-value">{o?.badgesEarned || 0}</div>
          <div className="stat-label">Badges Earned</div>
        </div>
      </div>

      {/* Quick Actions + Platform Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div className="card animate-fade-in">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/dashboard/create" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
              Create New Simulation
            </Link>
            <Link href="/dashboard/progress" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              View Progress &amp; Badges
            </Link>
            <Link href="/dashboard/analytics" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              Full Analytics Dashboard
            </Link>
          </div>
        </div>

        <div className="card animate-fade-in stagger-1">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Platform Distribution</h3>
          {data?.platformDistribution && data.platformDistribution.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.platformDistribution.map(p => {
                const total = data.platformDistribution.reduce((a, b) => a + b.count, 0);
                const pct = total > 0 ? Math.round((p.count / total) * 100) : 0;
                return (
                  <div key={p.platform}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                      <span>{PLATFORM_ICONS[p.platform] || 'PH'} {p.platform}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{p.count} sims ({pct}%)</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Run simulations to see platform breakdown</p>
          )}
        </div>
      </div>

      {/* Recent Simulations */}
      <div className="card animate-fade-in">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Recent Simulations</h3>
        {data?.recentSimulations && data.recentSimulations.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.recentSimulations.slice(0, 5).map(sim => (
              <div key={sim.id} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px',
                background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}>
                <span style={{ fontSize: 14, fontWeight: 800, width: 30 }}>{PLATFORM_ICONS[sim.platform] || 'PH'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {sim.post?.body?.substring(0, 60) || 'Untitled'}...
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {new Date(sim.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                  <span title="Engagement">ENG {sim.engagementRate}%</span>
                  <span title="Virality">VIR {sim.viralityScore}</span>
                  <span title="Impressions">IMP {sim.impressions.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 16 }}>N/A</div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>No simulations yet</p>
            <Link href="/dashboard/create" className="btn btn-primary">Run Your First Simulation</Link>
          </div>
        )}
      </div>
    </div>
  );
}
