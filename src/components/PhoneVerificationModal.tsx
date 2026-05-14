'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phone: string) => void;
}

export default function PhoneVerificationModal({ isOpen, onClose, onSuccess }: PhoneVerificationModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, [isOpen]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
    } catch (err: any) {
      console.error('OTP Send Error:', err);
      setError(err.message || 'Failed to send OTP. Check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (confirmationResult) {
        await confirmationResult.confirm(verificationCode);
        onSuccess(phoneNumber);
        onClose();
      }
    } catch (err: any) {
      setError('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: 40, textAlign: 'center' }}>
        <h2 style={{ marginBottom: 12 }}>{step === 'phone' ? 'Phone Verification' : 'Enter OTP'}</h2>
        <p style={{ color: 'var(--cl-stone-500)', fontSize: 14, marginBottom: 32 }}>
          {step === 'phone' 
            ? 'Enter your mobile number with country code (e.g., +1...)' 
            : `We sent a 6-digit code to ${phoneNumber}`}
        </p>

        {error && <div style={{ color: '#EF4444', background: '#FEF2F2', padding: 12, borderRadius: 12, marginBottom: 24, fontSize: 13, fontWeight: 600 }}>{error}</div>}

        <form onSubmit={step === 'phone' ? handleSendOTP : handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {step === 'phone' ? (
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--cl-stone-400)', marginBottom: 8, display: 'block' }}>MOBILE NUMBER (E.164 FORMAT)</label>
              <input 
                type="tel" 
                placeholder="+91 98765 43210" 
                className="input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                autoFocus
              />
              <p style={{ fontSize: 11, color: 'var(--cl-stone-400)', marginTop: 8 }}>Must include + and country code (e.g., +91 for India).</p>
            </div>
          ) : (
            <input 
              type="text" 
              placeholder="000000" 
              className="input"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              maxLength={6}
              autoFocus
            />
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Processing...' : step === 'phone' ? 'Send Code' : 'Verify & Continue'}
          </button>
          
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--cl-stone-400)', fontSize: 13, cursor: 'pointer' }}>
            Cancel
          </button>
        </form>

        {/* Firebase Recaptcha Anchor */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}

// Global declaration for TypeScript
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
