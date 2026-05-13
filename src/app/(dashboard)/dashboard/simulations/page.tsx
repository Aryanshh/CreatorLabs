'use client';
import { useEffect, useState } from 'react';

const PLATFORM_ICONS: Record<string, string> = {
  INSTAGRAM: 'IG', TWITTER: 'X', TIKTOK: 'TT', YOUTUBE: 'YT', LINKEDIN: 'LI', THREADS: 'TH',
};

interface Sim {
  id: string; platform: string; engagementRate: number; viralityScore: number;
  impressions: number; reach: number; likes: number; comments: number; shares: number; saves: number;
  createdAt: string; recommendations: string[] | null;
  post: { body: string; hashtags: string[]; contentType: string } | null;
}

export default function SimulationsPage() {
  const [sims, setSims] = useState<Sim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Sim | null>(null);

  useEffect(() => {
    fetch('/api/simulations').then(r => r.json()).then(d => { setSims(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div><div className="page-header"><h1>My Simulations</h1></div><div className="grid-2">{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 160 }} />)}</div></div>;

  return (
    <div>
      <div className="page-header">
        <h1>My Simulations</h1>
        <p>{sims.length} simulation{sims.length !== 1 ? 's' : ''} completed</p>
      </div>

      {sims.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 16 }}>N/A</div>
          <h3 style={{ marginBottom: 8 }}>No simulations yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Head to the Simulation Studio to create your first one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sims.map(sim => (
              <div key={sim.id} className="card" style={{ cursor: 'pointer', borderColor: selected?.id === sim.id ? 'var(--accent-primary)' : undefined }} onClick={() => setSelected(sim)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, width: 40 }}>{PLATFORM_ICONS[sim.platform]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{sim.post?.body?.substring(0, 50) || 'Untitled'}...</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sim.platform} · {sim.post?.contentType} · {new Date(sim.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                  <span>IMP {sim.impressions.toLocaleString()}</span>
                  <span>ENG {sim.engagementRate}%</span>
                  <span style={{ color: sim.viralityScore > 70 ? 'var(--accent-success)' : 'inherit' }}>VIR {sim.viralityScore}</span>
                  <span>LKE {sim.likes.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="animate-slide-right">
              <div className="card" style={{ position: 'sticky', top: 100 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Simulation Detail</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
                </div>
                <div className="grid-2" style={{ gap: 10, marginBottom: 20 }}>
                  {[
                    { l: 'Impressions', v: selected.impressions.toLocaleString() },
                    { l: 'Reach', v: selected.reach.toLocaleString() },
                    { l: 'Likes', v: selected.likes.toLocaleString() },
                    { l: 'Comments', v: selected.comments.toLocaleString() },
                    { l: 'Shares', v: selected.shares.toLocaleString() },
                    { l: 'Saves', v: selected.saves.toLocaleString() },
                    { l: 'Engagement', v: `${selected.engagementRate}%` },
                    { l: 'Virality', v: String(selected.viralityScore) },
                  ].map(m => (
                    <div key={m.l} style={{ padding: '8px 12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{m.l}</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{m.v}</div>
                    </div>
                  ))}
                </div>
                {selected.recommendations && selected.recommendations.length > 0 && (
                  <>
                    <h4 style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>Analysis</h4>
                    {selected.recommendations.map((r, i) => (
                      <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '8px 12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent-primary)', marginRight: 6 }}>TIP</span>
                        {r}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
