import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle
} from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    login,
    loginWithGoogle,
    register
  } = useApp();

  const [mode, setMode] = useState(authModalMode === 'register' ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = () => {
    setErrorMsg('');
    loginWithGoogle();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      if (!email || !password) {
        setErrorMsg('Please enter both email and password.');
        return;
      }
      const success = login(email, password);
      if (!success) {
        setErrorMsg('Invalid email or password. Please verify your credentials.');
      }
    } else {
      if (!name || !email || !password) {
        setErrorMsg('Name, email, and password are required.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }

      // Normal sign-up registers as customer by default
      const res = register({
        name,
        email,
        password,
        phone: phone || '+91 98765 00000',
        role: 'customer'
      });

      if (!res.success) {
        setErrorMsg(res.message || 'Failed to create account.');
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid var(--border-light)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--primary)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <path d="M19 16.5H5V12.2L6.8 6.5C7 5.9 7.6 5.5 8.3 5.5H15.7C16.4 5.5 17 5.9 17.2 6.5L19 12.2V16.5Z" />
                <circle cx="8" cy="14" r="1.5" fill="white" />
                <circle cx="16" cy="14" r="1.5" fill="white" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {mode === 'login' ? 'Sign In to DriveEasy' : 'Create DriveEasy Account'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {mode === 'login'
                  ? 'Access your rental bookings or fleet dashboard'
                  : 'Start renting cars & bikes with instant keyless pickup'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            style={{
              border: 'none',
              background: '#f1f5f9',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-subtle)' }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '12px 14px',
              border: 'none',
              background: mode === 'login' ? '#ffffff' : 'transparent',
              borderBottom: mode === 'login' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
              fontWeight: 700,
              fontSize: '13.5px',
              color: mode === 'login' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '12px 14px',
              border: 'none',
              background: mode === 'register' ? '#ffffff' : 'transparent',
              borderBottom: mode === 'register' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
              fontWeight: 700,
              fontSize: '13.5px',
              color: mode === 'register' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
          >
            Create Account
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '22px 24px', maxHeight: '75vh', overflowY: 'auto' }}>
          {errorMsg && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '10px 16px',
              border: '1px solid var(--border-light)',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              fontSize: '13.5px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              marginBottom: '18px'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>or with email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '13.5px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '13.5px' }}
                    />
                  </div>
                </div>
              </>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '13.5px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '13.5px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontWeight: 700, borderRadius: '8px' }}
            >
              {mode === 'login' ? 'Sign In' : 'Create Customer Account'}
            </button>
          </form>

          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <span
                  style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                >
                  Create one now
                </span>
              </>
            ) : (
              <>
                Already registered?{' '}
                <span
                  style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                >
                  Sign in here
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
