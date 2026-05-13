'use client';
import { useEffect, useState } from 'react';

interface ProgressData {
  totalXP: number; currentLevel: number; creatorTier: string; tierDisplay: string;
  xpProgress: { current: number; required: number; percentage: number };
  xpForNextLevel: number; simulationsRun: number;
  badges: {
    earned: Array<{ id: string; name: string; description: string; iconEmoji: string; category: string; earnedAt: string }>;
    all: Array<{ id: string; name: string; description: string; iconEmoji: string; category: string; criteria: { type: string; threshold: number }; earned: boolean }>;
  };
  recentXP: Array<{ amount: number; source: string; createdAt: string }>;
}

const TIER_STYLES: Record<string, string> = {
  ROOKIE: 'tier-ROOKIE', RISING_STAR: 'tier-RISING_STAR', INFLUENCER: 'tier-INFLUENCER',
  VIRAL_MASTER: 'tier-VIRAL_MASTER', LEGEND: 'tier-LEGEND',
};

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/user/progress').then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div><div className="page-header"><h1>Progress</h1></div><div className="skeleton" style={{ height: 200 }} /></div>;
  if (!data) return <div className="card">Failed to load progress data</div>;

  const categories = ['ALL', ...new Set(data.badges.all.map(b => b.category))];
  const filteredBadges = filter === 'ALL' ? data.badges.all : data.badges.all.filter(b => b.category === filter);

  return (
    <div>
      <div className="page-header">
        <h1>Progress &amp; Badges</h1>
        <p>Track your journey from Rookie to Legend</p>
      </div>

      {/* Level card */}
      <div className="card animate-fade-in" style={{ marginBottom: 24, background: 'var(--gradient-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, boxShadow: 'var(--shadow-glow-lg)' }}>
            {data.currentLevel}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 800 }}>Level {data.currentLevel}</span>
              <span className={`tier-badge ${TIER_STYLES[data.creatorTier]}`}>{data.tierDisplay}</span>
            </div>
            <div className="progress-bar" style={{ height: 12, marginBottom: 8 }}>
              <div className="progress-fill" style={{ width: `${data.xpProgress.percentage}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>{data.xpProgress.current.toLocaleString()} / {data.xpProgress.required.toLocaleString()} XP</span>
              <span>{data.xpProgress.percentage}% to Level {data.currentLevel + 1}</span>
            </div>
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: 24, gap: 12 }}>
          <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-secondary)' }}>XP {data.totalXP.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Experience</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-success)' }}>SIM {data.simulationsRun}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Simulations</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-warning)' }}>BDG {data.badges.earned.length}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Badges</div>
          </div>
        </div>
      </div>

      {/* Badge Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} className={`btn ${filter === c ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setFilter(c)}>
            {c.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid-3" style={{ marginBottom: 32 }}>
        {filteredBadges.map(badge => (
          <div key={badge.id} className="card" style={{ textAlign: 'center', opacity: badge.earned ? 1 : 0.4, position: 'relative' }}>
            {!badge.earned && <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 800, color: 'var(--text-muted)' }}>LOCKED</div>}
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent-primary)', marginBottom: 12, height: 48, display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
              {badge.name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase()}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{badge.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{badge.description}</div>
            <span className={`badge ${badge.earned ? 'badge-teal' : 'badge-purple'}`}>
              {badge.earned ? 'COMPLETED' : `${badge.criteria.type.replace(/_/g, ' ')}: ${badge.criteria.threshold}`}
            </span>
          </div>
        ))}
      </div>

      {/* Recent XP */}
      {data.recentXP.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Experience Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.recentXP.map((xp, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
                <span>{xp.source.replace(/_/g, ' ')}</span>
                <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>+{xp.amount} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
