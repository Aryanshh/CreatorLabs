'use client';
import { useState, useEffect } from 'react';
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
  const [strength, setStrength] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Password strength logic
    let s = 0;
    if (password.length > 7) s += 25;
    if (/[A-Z]/.test(password)) s += 25;
    if (/[0-9]/.test(password)) s += 25;
    if (/[^A-Za-z0-9]/.test(password)) s += 25;
    setStrength(s);
  }, [password]);

  const getStrengthColor = () => {
    if (strength < 26) return '#ef4444'; // Red
    if (strength < 51) return '#f59e0b'; // Amber
    if (strength < 76) return '#3b82f6'; // Blue
    return '#10b981'; // Green
  };

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
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) { 
          setError(data.details ? `${data.error}: ${data.details}` : data.error || 'Registration failed'); 
        } else {
          setSuccess('Account created! Please check your email to verify your account before logging in.');
        }
      } else {
        setError('Server returned an unexpected response. Please try again.');
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
          
          <div className="password-guidelines" style={{ marginTop: 32, textAlign: 'left', padding: '20px', background: 'var(--cl-stone-100)', borderRadius: '12px' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--cl-stone-500)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Security Guidelines</div>
            <ul style={{ fontSize: 13, color: 'var(--cl-stone-500)', paddingLeft: 16, margin: 0, lineHeight: 1.6 }}>
              <li>At least 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
              <li>Include a special character (!@#$%^&*)</li>
            </ul>
          </div>
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
                
                {password.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div className="progress-bar" style={{ height: 4, background: 'var(--cl-stone-100)' }}>
                      <div className="progress-fill" style={{ width: `${strength}%`, background: getStrengthColor(), transition: 'all 0.3s ease' }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: getStrengthColor(), marginTop: 6, textTransform: 'uppercase' }}>
                      {strength < 26 ? 'Weak' : strength < 51 ? 'Fair' : strength < 76 ? 'Strong' : 'Exceptional'}
                    </div>
                  </div>
                )}
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
