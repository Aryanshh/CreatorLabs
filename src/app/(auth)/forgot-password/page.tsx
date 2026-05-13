'use client';
import { useState } from 'react';
import Link from 'next/link';
import '../auth.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reset link');
      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">CL</div>
          <h1>Reset Password</h1>
          <p>Enter your email and we'll send you a link to get back into your lab.</p>
        </div>

        <div className="auth-content">
          {error && <div className="auth-error">{error}</div>}
          {message && (
            <div style={{ padding: 20, background: '#ECFDF5', border: '1px solid #D1FAE5', color: '#065F46', borderRadius: 12, marginBottom: 24, fontSize: 14, fontWeight: 600 }}>
              {message}
            </div>
          )}

          {!message && (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email Address</label>
                <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button className="btn btn-primary" style={{ width: '100%', padding: '18px' }} disabled={loading}>
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="auth-footer">
            Remember your password? <Link href="/login">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
