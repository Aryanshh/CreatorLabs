'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../auth.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { 
        setError(data.details ? `${data.error}: ${data.details}` : data.error || 'Registration failed'); 
      }
      else {
        setSuccess('Account created! Please check your email to verify your account before logging in.');
      }
    } catch (err: any) { 
      setError('Something went wrong: ' + err.message); 
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">CL</div>
          <h1>Create Account</h1>
          <p>Join the next generation of creators and master the algorithm with precision.</p>
        </div>
        
        <div className="auth-content">
          {error && <div className="auth-error">{error}</div>}
          
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ padding: 24, borderRadius: 12, background: '#ECFDF5', border: '1px solid #D1FAE5', color: '#065F46', fontSize: 15, fontWeight: 600, lineHeight: 1.6, marginBottom: 32 }}>
                {success}
              </div>
              <Link href="/login" className="btn btn-primary" style={{ width: '100%', padding: '18px' }}>
                Go to Login
              </Link>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Full Name</label>
                <input className="input" type="text" placeholder="Alex Reed" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8, padding: '18px' }}>
                {loading ? 'Creating account...' : 'Start Your Flight'}
              </button>
            </form>
          )}
          
          {!success && (
            <div className="auth-footer">
              Already have an account? <Link href="/login">Log in</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
