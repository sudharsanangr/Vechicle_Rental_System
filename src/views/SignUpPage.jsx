import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ArrowRight,
  AlertCircle,
  Briefcase,
  Layers,
  Car
} from 'lucide-react';

export default function SignUpPage() {
  const { register, loginWithGoogle, setActiveView } = useApp();

  // Account Type: 'customer' (default) | 'owner'
  const [accountType, setAccountType] = useState('customer');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [fleetSize, setFleetSize] = useState('1-3 vehicles');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full legal name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    if (!agreedTerms) {
      setError('You must accept the Terms and Conditions to create an account.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || '+91 98765 43210',
        role: accountType,
        businessName: businessName.trim(),
        fleetSize
      });

      setIsLoading(false);

      if (!res.success) {
        setError(res.message);
      }
    }, 450);
  };

  const handleGoogleSignUp = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle();
      setIsLoading(false);
    }, 350);
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 140px)',
        backgroundColor: 'var(--bg-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-lg)',
          padding: '36px 32px'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: 'var(--primary)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 2px 8px rgba(36, 92, 69, 0.25)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 16.5H5V12.2L6.8 6.5C7 5.9 7.6 5.5 8.3 5.5H15.7C16.4 5.5 17 5.9 17.2 6.5L19 12.2V16.5Z"
                stroke="white"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="13.8" r="1.4" fill="white" />
              <circle cx="16" cy="13.8" r="1.4" fill="white" />
              <path d="M10 9H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px', marginBottom: '6px' }}>
            {accountType === 'owner' ? 'Register as Vehicle Fleet Host' : 'Create Customer Account'}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
            {accountType === 'owner'
              ? 'List your personal or commercial fleet and earn daily rental revenue'
              : 'Join DriveEasy to book cars & bikes across Chennai'}
          </p>
        </div>

        {/* Account Type Selector (Customer vs Controlled Fleet Host Application) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            backgroundColor: 'var(--bg-main)',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            onClick={() => { setAccountType('customer'); setError(''); }}
            style={{
              border: 'none',
              padding: '9px 12px',
              borderRadius: '7px',
              fontSize: '13px',
              fontWeight: accountType === 'customer' ? 700 : 500,
              cursor: 'pointer',
              backgroundColor: accountType === 'customer' ? '#FFFFFF' : 'transparent',
              color: accountType === 'customer' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: accountType === 'customer' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <User size={15} />
            <span>Customer (Rider)</span>
          </button>

          <button
            type="button"
            onClick={() => { setAccountType('owner'); setError(''); }}
            style={{
              border: 'none',
              padding: '9px 12px',
              borderRadius: '7px',
              fontSize: '13px',
              fontWeight: accountType === 'owner' ? 700 : 500,
              cursor: 'pointer',
              backgroundColor: accountType === 'owner' ? '#FFFFFF' : 'transparent',
              color: accountType === 'owner' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: accountType === 'owner' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Car size={15} />
            <span>Apply as Host</span>
          </button>
        </div>

        {/* Customer Google OAuth Option */}
        {accountType === 'customer' && (
          <>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-light)',
                padding: '11px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                marginBottom: '18px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Sign up with Google ID</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>or with email</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
            </div>
          </>
        )}

        {/* Error Banner */}
        {error && (
          <div
            style={{
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              borderRadius: '8px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--danger)',
              fontSize: '13px',
              marginBottom: '18px'
            }}
          >
            <AlertCircle size={16} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
              Full Legal Name *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="Alex Morgan"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-primary)'
                }}
              />
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="alex@example.com"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-primary)'
                }}
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-primary)'
                }}
              />
              <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Host Specific Application Fields */}
          {accountType === 'owner' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                  Fleet / Business Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Morgan Luxury Rentals"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Briefcase size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                  Fleet Size Estimate
                </label>
                <select
                  value={fleetSize}
                  onChange={(e) => setFleetSize(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="1-2 vehicles">1 - 2 vehicles</option>
                  <option value="3-5 vehicles">3 - 5 vehicles</option>
                  <option value="6-10 vehicles">6 - 10 vehicles</option>
                  <option value="10+ vehicles">10+ vehicles (Fleet Partner)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
              Password (min 6 characters) *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Create a strong password"
                required
                style={{
                  width: '100%',
                  padding: '10px 38px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-primary)'
                }}
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
              Confirm Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                placeholder="Confirm your password"
                required
                style={{
                  width: '100%',
                  padding: '10px 38px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-primary)'
                }}
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms and conditions acceptance */}
          <div style={{ marginTop: '2px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', cursor: 'pointer', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => { setAgreedTerms(e.target.checked); setError(''); }}
                style={{ accentColor: 'var(--primary)', cursor: 'pointer', marginTop: '2px' }}
              />
              <span>
                I agree to the <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Privacy Policy</span>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{
              padding: '12px',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '6px'
            }}
          >
            {isLoading ? <span>Creating Account...</span> : (
              <>
                <span>{accountType === 'owner' ? 'Register Host Account' : 'Create Customer Account'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Link to Sign In */}
        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setActiveView('sign-in')}
            style={{
              border: 'none',
              background: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
