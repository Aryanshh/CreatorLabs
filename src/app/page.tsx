import Link from 'next/link';
import './landing.css';

export default function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-bg" />
      <div className="landing-grid" />

      {/* Navigation */}
      <nav className="landing-nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">CL</div>
          <span className="nav-logo-text">Creator Labs</span>
        </Link>
        <div className="nav-links">
          <Link href="/login" className="btn btn-ghost">Log In</Link>
          <Link href="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <span className="pulse-dot" />
          Flight Simulator for Social Media
        </div>
        <h1>
          Master the <span className="gradient-text">Algorithm</span> Before Going Live
        </h1>
        <p>
          Practice content creation, experiment with hashtags and SEO, and receive realistic performance 
          feedback — all without risking your actual social media presence.
        </p>
        <div className="hero-actions">
          <Link href="/register" className="btn btn-primary btn-lg">
            Start Your First Flight
          </Link>
          <Link href="/login" className="btn btn-secondary btn-lg">
            Demo Login
          </Link>
        </div>

        <div className="hero-orbit">
          <div className="orbit-ring">
            <div className="orbit-planet"><span className="orbit-label">IG</span></div>
            <div className="orbit-planet"><span className="orbit-label">TW</span></div>
            <div className="orbit-planet"><span className="orbit-label">TT</span></div>
            <div className="orbit-planet"><span className="orbit-label">YT</span></div>
          </div>
          <div className="orbit-ring" />
          <div className="orbit-ring" />
          <div className="orbit-center">CL</div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2>Everything You Need to <span className="gradient-text">Level Up</span></h2>
        <p>A complete training ground for aspiring creators, marketers, and businesses.</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box"><span>SIM</span></div>
            <h3>Algorithm Simulation</h3>
            <p>Our engine mimics real platform algorithms — Instagram, Twitter, TikTok, YouTube, LinkedIn, and Threads — so you know exactly how your content would perform.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box"><span>ANL</span></div>
            <h3>Real-Time Analytics</h3>
            <p>Get detailed breakdowns of predicted impressions, reach, engagement rates, and virality scores with 24-hour performance timelines.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box"><span>SEO</span></div>
            <h3>Hashtag &amp; SEO Lab</h3>
            <p>Experiment with hashtag strategies and SEO optimization. Our analyzer scores your choices and suggests improvements.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box"><span>XP</span></div>
            <h3>Gamified Learning</h3>
            <p>Earn XP, level up from Rookie to Legend, and unlock new platforms and features as you master content creation.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box"><span>CO</span></div>
            <h3>Collaborative Workspaces</h3>
            <p>Work with teams in shared workspaces. Collaborate on content strategies and learn from each other&apos;s simulations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box"><span>LB</span></div>
            <h3>Leaderboard &amp; Badges</h3>
            <p>Compete with other creators on the global leaderboard. Earn badges for milestones and showcase your achievements.</p>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="platforms">
        <h2>Simulate <span className="gradient-text">Every Platform</span></h2>
        <p>Master the unique algorithms of each social media platform.</p>
        <div className="platform-grid">
          {[
            { abbr: 'IG', name: 'Instagram', color: '#E4405F' },
            { abbr: 'X', name: 'Twitter / X', color: '#1DA1F2' },
            { abbr: 'TT', name: 'TikTok', color: '#00F2EA' },
            { abbr: 'YT', name: 'YouTube', color: '#FF0000' },
            { abbr: 'IN', name: 'LinkedIn', color: '#0A66C2' },
            { abbr: 'TH', name: 'Threads', color: '#ffffff' },
          ].map((p) => (
            <div key={p.name} className="platform-card" style={{ borderColor: `${p.color}20` }}>
              <div className="platform-abbr" style={{ color: p.color, borderColor: `${p.color}40` }}>{p.abbr}</div>
              <div className="platform-name" style={{ color: p.color }}>{p.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-box">
          <h2>Ready for <span className="gradient-text">Takeoff</span>?</h2>
          <p>Join thousands of creators mastering social media algorithms in a risk-free environment.</p>
          <Link href="/register" className="btn btn-primary btn-lg">
            Launch Your Creator Journey
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2026 Creator Labs. Built for the next generation of content creators.</p>
      </footer>
    </div>
  );
}
