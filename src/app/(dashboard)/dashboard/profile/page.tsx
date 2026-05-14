'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ProfileData {
  totalXP: number;
  currentLevel: number;
  tierDisplay: string;
  simulationsRun: number;
  xpProgress: { current: number; required: number; percentage: number };
  badges: { earned: any[] };
  recentXP: any[];
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/progress')
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="skeleton" style={{ height: 400, width: '100%' }} />;
  if (!data) return <div>Error loading profile</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Creator Profile</h1>
        <p>Manage your identity and track your growth</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 32, justifyContent: 'center' }}>
        {/* User Card */}
        <div className="card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center' }}>
          <div style={{ 
            width: 120, height: 120, borderRadius: 40, 
            background: 'var(--cl-coral)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center',
            fontSize: 48, fontWeight: 800, color: 'white',
            boxShadow: '0 20px 40px -10px rgba(255, 183, 178, 0.5)'
          }}>
            {session?.user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div>
                <h2 style={{ marginBottom: 4 }}>{session?.user?.name}</h2>
                <p style={{ color: 'var(--cl-stone-500)', fontSize: 16 }}>{session?.user?.email}</p>
              </div>
              <span className="badge badge-purple" style={{ padding: '8px 16px', fontSize: 13 }}>
                {data.tierDisplay}
              </span>
            </div>
            
            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                <span>Level {data.currentLevel} Progress</span>
                <span style={{ color: 'var(--cl-coral)' }}>{data.xpProgress.percentage}%</span>
              </div>
              <div className="progress-bar" style={{ height: 12 }}>
                <div className="progress-fill" style={{ width: `${data.xpProgress.percentage}%` }} />
              </div>
              <p style={{ fontSize: 12, color: 'var(--cl-stone-400)', marginTop: 8 }}>
                {data.xpProgress.current.toLocaleString()} / {data.xpProgress.required.toLocaleString()} XP to Level {data.currentLevel + 1}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="stat-card">
            <div className="stat-icon-text">TOTAL XP</div>
            <div className="stat-value">{data.totalXP.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-text">SIMS RUN</div>
            <div className="stat-value">{data.simulationsRun}</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Badges */}
        <div className="card">
          <h3 style={{ marginBottom: 24, fontSize: 16 }}>Achievements Unlocked</h3>
          {data.badges.earned.length === 0 ? (
            <p style={{ color: 'var(--cl-stone-400)', textAlign: 'center', padding: '40px 0' }}>No badges earned yet. Keep creating!</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 16 }}>
              {data.badges.earned.map(b => (
                <div key={b.id} style={{ textAlign: 'center' }} title={b.description}>
                  <div style={{ 
                    width: 64, height: 64, borderRadius: 20, 
                    background: 'var(--cl-stone-100)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, margin: '0 auto 8px',
                    border: '2px solid var(--cl-stone-200)'
                  }}>
                    {b.iconEmoji === 'SIM' ? '🎯' : b.iconEmoji === 'PRO' ? '💎' : '🏆'}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cl-stone-800)' }}>{b.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent XP History */}
        <div className="card">
          <h3 style={{ marginBottom: 24, fontSize: 16 }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.recentXP.map((event, i) => (
              <div key={i} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', background: 'var(--cl-stone-100)', borderRadius: 16,
                border: '1px solid var(--cl-stone-200)'
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cl-stone-800)' }}>
                    {event.source.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--cl-stone-500)' }}>
                    {new Date(event.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--cl-coral)' }}>
                  +{event.amount} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
