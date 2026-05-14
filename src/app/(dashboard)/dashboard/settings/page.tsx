'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PhoneVerificationModal from '@/components/PhoneVerificationModal';
import '../../dashboard.css';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    phone: false,
    phoneNumber: ''
  });

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/user/progress');
      const data = await res.json();
      setVerificationStatus({
        email: !!data.emailVerified,
        phone: !!data.phoneVerified,
        phoneNumber: data.phoneNumber || ''
      });
    } catch (error) {
      console.error('Failed to fetch verification status');
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handlePhoneSuccess = async (phoneNumber: string) => {
    try {
      await fetch('/api/user/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      fetchStatus();
    } catch (error) {
      console.error('Failed to update DB after phone verification');
    }
  };
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Theme & Experience State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [grain, setGrain] = useState(true);
  const [notifications, setNotifications] = useState({ sim: true, xp: false, news: false });

  useEffect(() => {
    // Load settings from localStorage
    const savedTheme = localStorage.getItem('cl-theme') as 'light' | 'dark';
    const savedGrain = localStorage.getItem('cl-grain');
    if (savedTheme) setTheme(savedTheme);
    if (savedGrain !== null) setGrain(savedGrain === 'true');
  }, []);

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('cl-theme', newTheme);
    if (newTheme === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  };

  const toggleGrain = () => {
    const newState = !grain;
    setGrain(newState);
    localStorage.setItem('cl-grain', String(newState));
    if (!newState) document.body.classList.add('no-grain');
    else document.body.classList.remove('no-grain');
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setMessage('Settings updated successfully!');
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your account and platform preferences</p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
        {/* Appearance Section */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 24, fontSize: 18 }}>Display & Experience</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--cl-stone-100)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Theme Preference</div>
              <div style={{ fontSize: 13, color: 'var(--cl-stone-500)' }}>Switch between high-contrast light and charcoal-grey dark mode.</div>
            </div>
            <div style={{ display: 'flex', gap: 8, background: 'var(--cl-stone-200)', padding: 4, borderRadius: 100 }}>
              <button 
                onClick={() => toggleTheme('light')}
                style={{ 
                  padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700,
                  background: theme === 'light' ? 'var(--cl-stone-800)' : 'transparent',
                  color: theme === 'light' ? 'white' : 'var(--cl-stone-500)',
                  transition: 'all 0.2s ease'
                }}
              >Light</button>
              <button 
                onClick={() => toggleTheme('dark')}
                style={{ 
                  padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700,
                  background: theme === 'dark' ? 'white' : 'transparent',
                  color: theme === 'dark' ? 'black' : 'var(--cl-stone-500)',
                  transition: 'all 0.2s ease'
                }}
              >Dark</button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Analog Grain Overlay</div>
              <div style={{ fontSize: 13, color: 'var(--cl-stone-500)' }}>Toggle the atmospheric noise texture across the app.</div>
            </div>
            <div 
              onClick={toggleGrain}
              style={{ 
                width: 44, height: 24, background: grain ? 'var(--cl-coral)' : 'var(--cl-stone-200)', 
                borderRadius: 100, position: 'relative', cursor: 'pointer',
                transition: 'background 0.3s ease'
              }}
            >
              <div style={{ 
                width: 18, height: 18, background: 'white', borderRadius: '50%', 
                position: 'absolute', top: 3, left: grain ? 23 : 3,
                transition: 'left 0.2s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 24, fontSize: 18 }}>Notifications</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { id: 'sim', label: 'Simulation Completion', desc: 'Get notified when your simulation analysis is ready.' },
              { id: 'xp', label: 'Level Up Alerts', desc: 'Receive a notification when you reach a new creator tier.' },
              { id: 'news', label: 'Platform Updates', desc: 'Stay informed about new algorithm features and tools.' },
            ].map(n => (
              <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--cl-stone-100)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{n.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--cl-stone-500)' }}>{n.desc}</div>
                </div>
                <div 
                  onClick={() => setNotifications({ ...notifications, [n.id]: !notifications[n.id as keyof typeof notifications] })}
                  style={{ 
                    width: 44, height: 24, background: notifications[n.id as keyof typeof notifications] ? 'var(--cl-coral)' : 'var(--cl-stone-200)', 
                    borderRadius: 100, position: 'relative', cursor: 'pointer',
                    transition: 'background 0.3s ease'
                  }}
                >
                  <div style={{ 
                    width: 18, height: 18, background: 'white', borderRadius: '50%', 
                    position: 'absolute', top: 3, left: notifications[n.id as keyof typeof notifications] ? 23 : 3,
                    transition: 'left 0.2s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Verification Section */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 24, fontSize: 18 }}>Security & Verification</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Email Verification */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--cl-stone-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📧</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Email Address</div>
                  <div style={{ fontSize: 13, color: 'var(--cl-stone-500)' }}>{session?.user?.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={`badge ${verificationStatus.email ? 'badge-teal' : 'badge-yellow'}`}>
                  {verificationStatus.email ? 'Verified' : 'Unverified'}
                </span>
                {!verificationStatus.email && (
                  <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: 12 }}>Verify Now</button>
                )}
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--cl-stone-100)' }} />

            {/* Phone Verification */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--cl-stone-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📱</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Phone Number</div>
                  <div style={{ fontSize: 13, color: 'var(--cl-stone-500)' }}>
                    {verificationStatus.phoneNumber || 'No phone number linked'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={`badge ${verificationStatus.phone ? 'badge-teal' : 'badge-yellow'}`}>
                  {verificationStatus.phone ? 'Verified' : 'Unverified'}
                </span>
                {!verificationStatus.phone && (
                  <button 
                    onClick={() => setIsPhoneModalOpen(true)}
                    className="btn btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: 12 }}
                  >
                    {verificationStatus.phoneNumber ? 'Verify Code' : 'Add Phone'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 24, fontSize: 18 }}>Account Security</h3>
          
          <div className="grid-2" style={{ marginBottom: 24 }}>
            <div className="input-group">
              <label>Display Name</label>
              <input className="input" defaultValue={session?.user?.name || ''} />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input className="input" defaultValue={session?.user?.email || ''} disabled style={{ opacity: 0.6 }} />
            </div>
          </div>

          <button className="btn btn-secondary">Change Password</button>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{ padding: '16px 48px' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          {message && <span style={{ color: '#059669', fontWeight: 600, fontSize: 14 }}>{message}</span>}
        </div>
        <PhoneVerificationModal 
          isOpen={isPhoneModalOpen} 
          onClose={() => setIsPhoneModalOpen(false)}
          onSuccess={handlePhoneSuccess}
        />
      </div>
    </div>
  );
}
