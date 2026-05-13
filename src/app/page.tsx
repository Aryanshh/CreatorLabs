'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import './theme.css';

export default function CreatorLabsLanding() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const platformStats = [
    { platform: 'Instagram', metric: '94% Accuracy' },
    { platform: 'Twitter / X', metric: 'Real-time Trends' },
    { platform: 'TikTok', metric: 'Hook Analysis' },
    { platform: 'YouTube', metric: 'CTR Prediction' },
    { platform: 'LinkedIn', metric: 'B2B Strategy' },
  ];

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setJoined(true);
  };

  return (
    <div className="creator-labs-theme">
      <div className="grain-overlay" />
      
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* Navigation */}
      <nav className="nav-container">
        <div className="logo">
          <div className="logo-circle">
            <div className="logo-dot" />
          </div>
          <span style={{ fontWeight: 700, letterSpacing: -1, fontSize: 18 }}>creator labs</span>
        </div>
        <div className="nav-links">
          <a href="#simulator" className="nav-link">Simulator</a>
          <a href="#features" className="nav-link">Features</a>
          <Link href="/login" className="nav-link">Log In</Link>
        </div>
        <Link href="/dashboard" className="nav-cta">Go to Dashboard</Link>
      </nav>

      {/* Hero Section */}
      <section className="section hero">
        <div className="hero-split">
          <div className="hero-content">
            <h1 className="reveal">
              Master the <br />
              algorithm, <span className="cursive cursive-word">intentionally</span>
            </h1>
            <p className="reveal" style={{ transitionDelay: '0.2s' }}>
              The flight simulator for social media platforms. Practice content strategy, test hashtags, and receive realistic performance feedback in a risk-free environment.
            </p>
            <div className="cta-group reveal" style={{ transitionDelay: '0.4s' }}>
              <Link href="/dashboard" className="btn btn-primary">Enter Simulator</Link>
              <a href="#features" className="btn btn-secondary">Learn More</a>
            </div>
          </div>
          
          <div className="hero-visual reveal" style={{ transitionDelay: '0.6s' }}>
            <div className="mockup-container">
              <div className="phone-mockup phone-back" />
              <div className="phone-mockup phone-main">
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--cl-coral)', marginBottom: 8 }}>PREDICTED REACH</div>
                  <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: -2 }}>12.4k</div>
                  <div className="breathe-circle" style={{ marginTop: 24 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Marquee Section */}
      <div id="simulator" className="marquee-container reveal">
        <div className="marquee-content">
          {[...platformStats, ...platformStats].map((s, i) => (
            <div key={i} className="scenario-card">
              <span className="scenario-time">{s.platform}</span>
              <span className="scenario-text">{s.metric}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="section">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 80 }}>
          <h2 style={{ fontSize: 56, fontWeight: 800, letterSpacing: -2, marginBottom: 24 }}>A simulator that <span className="cursive" style={{ color: 'var(--cl-coral)', fontSize: 72 }}>predicts</span></h2>
          <p style={{ color: 'var(--cl-stone-500)', maxWidth: 600, margin: '0 auto', fontSize: 20 }}>
            We built Creator Labs to be your digital training ground. Every simulation is backed by weighted platform-specific variables.
          </p>
        </div>

        <div className="grid-2">
          <div className="card reveal" style={{ padding: 60 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--cl-coral)', marginBottom: 16 }}>01 / SIMULATE</div>
            <h3 style={{ fontSize: 32, marginBottom: 20 }}>Realistic Algorithms</h3>
            <p style={{ color: 'var(--cl-stone-500)', lineHeight: 1.6, fontSize: 18 }}>
              Our engine mimics the complex behaviors of 6 major platforms, from Instagram Reels to LinkedIn B2B posts.
            </p>
          </div>
          <div className="card reveal" style={{ padding: 60, transitionDelay: '0.2s' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--cl-coral)', marginBottom: 16 }}>02 / ANALYZE</div>
            <h3 style={{ fontSize: 32, marginBottom: 20 }}>Data-Driven Insights</h3>
            <p style={{ color: 'var(--cl-stone-500)', lineHeight: 1.6, fontSize: 18 }}>
              Get detailed breakdowns of impressions, engagement rates, and virality scores before you ever hit publish.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1 }}>Creator Stories</h2>
          <p style={{ color: 'var(--cl-stone-500)', fontSize: 18 }}>How creators are mastering the game.</p>
        </div>
        
        <div className="diary-grid">
          <div className="diary-card reveal">
            <p className="diary-text">"Creator Labs has completely changed my workflow. I test all my hooks here first, and my actual engagement has tripled since I started using the simulator."</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 1, background: 'var(--cl-stone-400)' }} />
              <span className="cursive" style={{ fontSize: 28, color: 'var(--cl-stone-500)' }}>Marcus D.</span>
            </div>
          </div>
          <div className="diary-card reveal" style={{ transitionDelay: '0.2s' }}>
            <p className="diary-text">"The feedback loop is incredible. It's like having a senior social media strategist looking over your shoulder every time you write a caption."</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 1, background: 'var(--cl-stone-400)' }} />
              <span className="cursive" style={{ fontSize: 28, color: 'var(--cl-stone-500)' }}>Elena K.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion - Waitlist Form */}
      <section className="section">
        <div className="waitlist-card reveal">
          <h2 style={{ fontSize: 56, fontWeight: 800, letterSpacing: -2 }}>Ready for takeoff?</h2>
          <p style={{ color: 'var(--cl-stone-500)', fontSize: 20, marginTop: 16 }}>Join thousands of creators mastering the algorithm.</p>
          
          {joined ? (
            <div className="animate-scale-in" style={{ marginTop: 40, padding: '24px', background: 'var(--cl-sage)', borderRadius: '100px', color: '#065F46', fontWeight: 700 }}>
              You're on the list! We'll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="waitlist-form">
              <input 
                type="email" 
                placeholder="Enter your email address..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Join Waitlist</button>
            </form>
          )}
          
          <p style={{ marginTop: 32, fontSize: 14, color: 'var(--cl-stone-400)', fontWeight: 600 }}>
            Risk-free simulation. Real-world results.
          </p>
        </div>
      </section>

      <footer style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--cl-stone-400)', fontSize: 14, borderTop: '1px solid var(--cl-stone-100)' }}>
        <p style={{ fontWeight: 600 }}>&copy; 2026 Creator Labs. Built for the next generation of content creators.</p>
      </footer>
    </div>
  );
}
