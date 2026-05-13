'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) { setError('Invalid email or password'); }
      else { router.push('/dashboard'); }
    } catch { setError('Something went wrong'); }
    setLoading(false);
  };

  const handleDemo = async () => {
    setLoading(true);
    // Seed database first
    await fetch('/api/seed', { method: 'POST' }).catch(() => {});
    const result = await signIn('credentials', { email: 'demo@creatorlabs.com', password: 'demo123', redirect: false });
    if (result?.error) { setError('Demo login failed. Try registering instead.'); }
    else { router.push('/dashboard'); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">CL</div>
          <h1>Welcome Back</h1>
          <p>Log in to your Creator Labs account</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="auth-divider">or</div>
        <button className="btn btn-secondary btn-lg" onClick={handleDemo} disabled={loading} style={{ width: '100%' }}>
          Try Demo Account
        </button>
        <div className="auth-footer">
          Don&apos;t have an account? <Link href="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
