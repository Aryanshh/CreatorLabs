'use client';
import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  rank: number; id: string; name: string; totalXP: number;
  level: number; tier: string; simulations: number; badges: number;
}

const TIER_STYLES: Record<string, string> = {
  ROOKIE: 'tier-ROOKIE', RISING_STAR: 'tier-RISING_STAR', INFLUENCER: 'tier-INFLUENCER',
  VIRAL_MASTER: 'tier-VIRAL_MASTER', LEGEND: 'tier-LEGEND',
};

const RANK_ICONS = ['1ST', '2ND', '3RD'];

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard').then(r => r.json()).then(d => { setEntries(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div><div className="page-header"><h1>Leaderboard</h1></div><div className="skeleton" style={{ height: 400 }} /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Global Leaderboard</h1>
        <p>Top performing creators across all platforms</p>
      </div>

      {entries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 16 }}>N/A</div>
          <h3>No creators yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Be the first to claim the top spot!</p>
        </div>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {['Rank', 'Creator', 'Level', 'Tier', 'XP', 'Sims', 'Badges'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 800, width: 60 }}>
                    {entry.rank === 1 ? '1ST' : entry.rank === 2 ? '2ND' : entry.rank === 3 ? '3RD' : entry.rank}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white' }}>
                        {entry.name[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{entry.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: 16 }}>Lvl {entry.level}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`tier-badge ${TIER_STYLES[entry.tier]}`}>{entry.tier.replace(/_/g, ' ')}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--accent-secondary)' }}>{entry.totalXP.toLocaleString()} XP</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{entry.simulations}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{entry.badges}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
