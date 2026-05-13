'use client';
import { useState } from 'react';

const PLATFORMS = [
  { id: 'INSTAGRAM', icon: 'IG', name: 'Instagram', color: '#E4405F' },
  { id: 'TWITTER', icon: 'X', name: 'Twitter / X', color: '#1DA1F2' },
  { id: 'TIKTOK', icon: 'TT', name: 'TikTok', color: '#00F2EA' },
  { id: 'YOUTUBE', icon: 'YT', name: 'YouTube', color: '#FF0000' },
  { id: 'LINKEDIN', icon: 'LI', name: 'LinkedIn', color: '#0A66C2' },
  { id: 'THREADS', icon: 'TH', name: 'Threads', color: '#ffffff' },
];

const CONTENT_TYPES: Record<string, string[]> = {
  INSTAGRAM: ['IMAGE', 'CAROUSEL', 'REEL', 'STORY'],
  TWITTER: ['TEXT', 'IMAGE', 'THREAD'],
  TIKTOK: ['VIDEO', 'REEL'],
  YOUTUBE: ['VIDEO'],
  LINKEDIN: ['TEXT', 'IMAGE', 'CAROUSEL'],
  THREADS: ['TEXT', 'IMAGE', 'THREAD'],
};

interface SimResult {
  simulation: {
    impressions: number; reach: number; likes: number; comments: number;
    shares: number; saves: number; engagementRate: number; viralityScore: number;
    algorithmFactors: Record<string, { score: number; weight: number; feedback: string }>;
    recommendations: string[];
    timeline: { hour: number; impressions: number; likes: number; comments: number }[];
  };
  xpAwarded: number;
  newBadges: string[];
}

export default function CreatePage() {
  const [platform, setPlatform] = useState('INSTAGRAM');
  const [contentType, setContentType] = useState('IMAGE');
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);
  const [error, setError] = useState('');

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, '');
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => setHashtags(hashtags.filter(h => h !== tag));

  const runSimulation = async () => {
    if (!body.trim()) { setError('Write some content first!'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      // Create post
      const postRes = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform, contentType, body, title, hashtags,
          seoTitle, seoDescription: seoDesc,
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        }),
      });
      const post = await postRes.json();
      if (!postRes.ok) throw new Error(post.error);

      // Run simulation
      const simRes = await fetch('/api/simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      });
      const simData = await simRes.json();
      if (!simRes.ok) throw new Error(simData.error);
      setResult(simData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    }
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'var(--accent-success)';
    if (score >= 0.6) return 'var(--accent-secondary)';
    if (score >= 0.4) return 'var(--accent-warning)';
    return 'var(--accent-danger)';
  };

  return (
    <div>
      <div className="page-header">
        <h1>Simulation Studio</h1>
        <p>Create content and simulate algorithm performance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 24 }}>
        {/* Left: Creator */}
        <div>
          {/* Platform selector */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Select Platform</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  className={`platform-chip ${platform === p.id ? 'active' : ''}`}
                  data-platform={p.id}
                  onClick={() => { setPlatform(p.id); setContentType(CONTENT_TYPES[p.id][0]); }}
                >
                  <span style={{ fontWeight: 800, fontSize: 12, marginRight: 4 }}>{p.icon}</span> {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content type */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Content Type</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(CONTENT_TYPES[platform] || ['TEXT']).map(ct => (
                <button key={ct} className={`btn ${contentType === ct ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setContentType(ct)}>
                  {ct}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <label>Title / Hook (Optional)</label>
              <input className="input" placeholder="Catchy title or opening hook..." value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Content / Caption *</label>
              <textarea className="textarea" placeholder="Write your content here... Include engaging hooks, CTAs, and value-packed text." value={body} onChange={e => setBody(e.target.value)} style={{ minHeight: 160 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              {body.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          {/* Hashtags */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Hashtags</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input className="input" placeholder="Add hashtag..." value={hashtagInput} onChange={e => setHashtagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHashtag())} style={{ flex: 1 }} />
              <button className="btn btn-secondary" onClick={addHashtag}>Add</button>
            </div>
            {hashtags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {hashtags.map(tag => (
                  <span key={tag} className="badge badge-purple" style={{ cursor: 'pointer' }} onClick={() => removeHashtag(tag)}>
                    #{tag} ✕
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>SEO Optimization</h3>
            <div className="input-group" style={{ marginBottom: 12 }}>
              <label>SEO Title</label>
              <input className="input" placeholder="Optimized title for search..." value={seoTitle} onChange={e => setSeoTitle(e.target.value)} />
            </div>
            <div className="input-group" style={{ marginBottom: 12 }}>
              <label>Meta Description</label>
              <input className="input" placeholder="Brief description for search results..." value={seoDesc} onChange={e => setSeoDesc(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Keywords (comma-separated)</label>
              <input className="input" placeholder="keyword1, keyword2, keyword3" value={keywords} onChange={e => setKeywords(e.target.value)} />
            </div>
          </div>

          {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

          <button className="btn btn-primary btn-lg" onClick={runSimulation} disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Simulating Algorithm...' : 'Run Simulation'}
          </button>
        </div>

        {/* Right: Results */}
        {result && (
          <div className="animate-slide-right">
            {/* XP + Badge Notification */}
            {(result.xpAwarded > 0 || result.newBadges.length > 0) && (
              <div className="card" style={{ marginBottom: 16, background: 'rgba(108, 92, 231, 0.1)', borderColor: 'rgba(108, 92, 231, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span className="badge badge-purple">XP +{result.xpAwarded}</span>
                  {result.newBadges.map(b => (
                    <span key={b} className="badge badge-yellow">{b} UNLOCKED</span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Metrics */}
            <div className="grid-3" style={{ marginBottom: 16 }}>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div className="stat-icon-text">IMP</div>
                <div className="stat-value" style={{ fontSize: 22 }}>{result.simulation.impressions.toLocaleString()}</div>
                <div className="stat-label">Impressions</div>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div className="stat-icon-text">ENG</div>
                <div className="stat-value" style={{ fontSize: 22 }}>{result.simulation.engagementRate}%</div>
                <div className="stat-label">Engagement</div>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div className="stat-icon-text">VIR</div>
                <div className="stat-value" style={{ fontSize: 22, color: result.simulation.viralityScore > 70 ? 'var(--accent-success)' : 'inherit' }}>{result.simulation.viralityScore}</div>
                <div className="stat-label">Virality</div>
              </div>
            </div>

            {/* Engagement breakdown */}
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Engagement Breakdown</h3>
              <div className="grid-3" style={{ gap: 12 }}>
                {[
                  { label: 'Reach', value: result.simulation.reach, abbr: 'RCH' },
                  { label: 'Likes', value: result.simulation.likes, abbr: 'LKE' },
                  { label: 'Comments', value: result.simulation.comments, abbr: 'CMT' },
                  { label: 'Shares', value: result.simulation.shares, abbr: 'SHR' },
                  { label: 'Saves', value: result.simulation.saves, abbr: 'SAV' },
                ].map(m => (
                  <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)' }}>{m.abbr}</span>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{m.value.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithm Factors */}
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Algorithm Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(result.simulation.algorithmFactors).map(([key, val]) => (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                      <span style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                      <span style={{ color: getScoreColor(val.score), fontWeight: 600 }}>
                        {Math.round(val.score * 100)}% <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({Math.round(val.weight * 100)}% weight)</span>
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: 6 }}>
                      <div className="progress-fill" style={{ width: `${val.score * 100}%`, background: getScoreColor(val.score) }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{val.feedback}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Analysis & Recommendations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.simulation.recommendations.map((rec, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', fontSize: 13, lineHeight: 1.5, border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-primary)' }}>TIP</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Chart */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Performance Timeline</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 120 }}>
                {result.simulation.timeline.map((t) => {
                  const maxImp = Math.max(...result.simulation.timeline.map(x => x.impressions));
                  const height = maxImp > 0 ? (t.impressions / maxImp) * 100 : 0;
                  return (
                    <div key={t.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }} title={`${t.hour}:00 - ${t.impressions.toLocaleString()} impressions`}>
                      <div style={{
                        width: '100%', height: `${height}%`, minHeight: 2,
                        background: 'var(--gradient-primary)', borderRadius: '4px 4px 0 0',
                        opacity: 0.6 + (height / 250), transition: 'height 0.5s ease',
                      }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
