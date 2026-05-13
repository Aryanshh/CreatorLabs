'use client';
import { useEffect, useState } from 'react';

const PLATFORM_ICONS: Record<string, string> = {
  INSTAGRAM: 'IG', TWITTER: 'X', TIKTOK: 'TT', YOUTUBE: 'YT', LINKEDIN: 'LI', THREADS: 'TH',
};

interface AnalyticsData {
  overview: { totalSimulations: number; avgEngagement: number; avgVirality: number; avgImpressions: number; avgLikes: number; badgesEarned: number; level: number; tier: string };
  platformDistribution: { platform: string; count: number }[];
  dailyAnalytics: Array<{ date: string; simulationsRun: number; avgEngagement: number; avgVirality: number; xpEarned: number }>;
  recentSimulations: Array<{ id: string; platform: string; engagementRate: number; viralityScore: number; impressions: number; createdAt: string }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div><div className="page-header"><h1>Analytics</h1></div><div className="grid-4">{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}</div></div>;
  if (!data) return <div className="card">Failed to load analytics</div>;

  const totalPlatformSims = data.platformDistribution.reduce((a, b) => a + b.count, 0);

  return (
    <div>
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Comprehensive performance analysis of your simulations</p>
      </div>

      {/* Stats Overview */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-icon-text">SIM</div>
          <div className="stat-value">{data.overview.totalSimulations}</div>
          <div className="stat-label">Total Simulations</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-text">ENG</div>
          <div className="stat-value">{data.overview.avgEngagement}%</div>
          <div className="stat-label">Avg Engagement Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-text">VIR</div>
          <div className="stat-value">{data.overview.avgVirality}</div>
          <div className="stat-label">Avg Virality Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-text">IMP</div>
          <div className="stat-value">{(data.overview.totalImpressions / 1000).toFixed(1)}k</div>
          <div className="stat-label">Total Reach</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Performance Trend */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Performance Trend</h3>
          {data.dailyAnalytics.length > 0 ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 180, marginBottom: 12 }}>
                {data.dailyAnalytics.map((d, i) => {
                  const maxEng = Math.max(...data.dailyAnalytics.map(x => x.avgEngagement), 1);
                  const height = (d.avgEngagement / maxEng) * 100;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }} title={`${new Date(d.date).toLocaleDateString()} - ${d.avgEngagement}% engagement`}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.avgEngagement}%</div>
                      <div style={{ width: '100%', height: `${height}%`, minHeight: 4, background: 'var(--gradient-primary)', borderRadius: '4px 4px 0 0', opacity: 0.7 + (height / 300) }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>Engagement Rate Over Time</div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Run more simulations to see trends</p>
          )}
        </div>

        {/* Platform Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Platform Mix</h3>
          {data.platformDistribution.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {data.platformDistribution.map(p => {
                const pct = totalPlatformSims > 0 ? Math.round((p.count / totalPlatformSims) * 100) : 0;
                return (
                  <div key={p.platform}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
                      <span>{PLATFORM_ICONS[p.platform]} {p.platform}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 8 }}>
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No data yet</p>
          )}
        </div>
      </div>

      {/* Recent Performance Table */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Simulation Performance Log</h3>
        {data.recentSimulations.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 8px' }}>Date</th>
                  <th style={{ padding: '12px 8px' }}>Platform</th>
                  <th style={{ padding: '12px 8px' }}>Type</th>
                  <th style={{ padding: '12px 8px' }}>Eng %</th>
                  <th style={{ padding: '12px 8px' }}>Virality</th>
                  <th style={{ padding: '12px 8px' }}>Impressions</th>
                </tr>
              </thead>
              <tbody>
                {data.recentSimulations.map(sim => (
                  <tr key={sim.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{new Date(sim.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>{PLATFORM_ICONS[sim.platform]} {sim.platform}</td>
                    <td style={{ padding: '12px 8px' }}>{sim.post?.contentType}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--accent-success)' }}>{sim.engagementRate}%</td>
                    <td style={{ padding: '12px 8px' }}>{sim.viralityScore}</td>
                    <td style={{ padding: '12px 8px' }}>{sim.impressions.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No simulations to display</p>
        )}
      </div>
    </div>
  );
}
