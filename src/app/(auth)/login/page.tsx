'use client';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verified = searchParams.get('verified');
    const err = searchParams.get('error');
    if (verified === 'true') {
      setSuccess('Email verified successfully! You can now log in.');
    }
    if (err) {
      if (err === 'InvalidToken') setError('The verification link is invalid or has expired.');
      if (err === 'TokenNotFound') setError('Verification token not found.');
      if (err === 'ServerError') setError('An error occurred during verification.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) { 
        setError(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error); 
      }
      else { router.push('/dashboard'); }
    } catch { setError('Something went wrong'); }
    setLoading(false);
  };

  const handleDemo = async () => {
    setLoading(true);
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
          <p>Sign in to your simulator dashboard and continue your journey.</p>
        </div>
        
        <div className="auth-content">
          {error && <div className="auth-error">{error}</div>}
          {success && (
            <div style={{ padding: 14, borderRadius: 12, background: '#ECFDF5', border: '1px solid #D1FAE5', color: '#065F46', fontSize: 13, fontWeight: 600, textAlign: 'center', marginBottom: 24 }}>
              {success}
            </div>
          )}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8, padding: '18px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="auth-divider">or</div>
          <button className="btn btn-secondary" onClick={handleDemo} disabled={loading} style={{ width: '100%', padding: '16px' }}>
            Explore with Demo Account
          </button>
          <div className="auth-footer">
            Don&apos;t have an account? <Link href="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
