'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../auth.css';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      setMessage('Password successfully updated! You can now log in.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (!token) return <div className="auth-error">Invalid or missing reset token.</div>;

  return (
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
            <label>New Password</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input className="input" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', padding: '18px' }} disabled={loading}>
            {loading ? 'Updating...' : 'Set New Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">CL</div>
          <h1>New Password</h1>
          <p>Please enter your new password below.</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
