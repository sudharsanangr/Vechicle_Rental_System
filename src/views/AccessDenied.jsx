import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, ArrowLeft, Home, LogOut } from 'lucide-react';

export default function AccessDenied({ requiredRole, attemptedView }) {
  const { currentUser, setActiveView, logout } = useApp();

  const handleReturnToSafeDashboard = () => {
    if (!currentUser) {
      setActiveView('home');
      return;
    }
    if (currentUser.role === 'admin') {
      setActiveView('admin-dashboard');
    } else if (currentUser.role === 'owner') {
      setActiveView('owner-dashboard');
    } else {
      setActiveView('dashboard');
    }
  };

  const roleLabels = {
    customer: 'Customer / Rider',
    owner: 'Vehicle Fleet Owner',
    admin: 'Platform Superadmin',
    guest: 'Unauthenticated Visitor'
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 160px)',
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
          maxWidth: '520px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-md)',
          padding: '40px 32px',
          textAlign: 'center'
        }}
      >
        {/* Shield Alert Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--danger)'
          }}
        >
          <ShieldAlert size={34} />
        </div>

        <div
          style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '20px',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            fontSize: '11.5px',
            fontWeight: 800,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}
        >
          403 Access Denied
        </div>

        <h1
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.3px',
            marginBottom: '10px'
          }}
        >
          Permission Required
        </h1>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '24px'
          }}
        >
          You do not have authorization to view this resource
          {attemptedView ? ` (${attemptedView})` : ''}.
          {requiredRole ? ` This area requires ${roleLabels[requiredRole] || requiredRole} privileges.` : ''}
        </p>

        {/* Current User Session Status Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            padding: '14px 16px',
            textAlign: 'left',
            marginBottom: '28px',
            fontSize: '13px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Signed in as:</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {currentUser?.name || 'Guest / Not Logged In'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Email:</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {currentUser?.email || 'None'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Assigned Role:</span>
            <span
              style={{
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)'
              }}
            >
              {currentUser?.role || 'guest'}
            </span>
          </div>
        </div>

        {/* Safe Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleReturnToSafeDashboard}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to {currentUser ? 'Your Dashboard' : 'Home'}</span>
          </button>

          {currentUser ? (
            <button
              type="button"
              className="btn btn-outline"
              onClick={logout}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: 'var(--danger)',
                borderColor: 'var(--danger-border)'
              }}
            >
              <LogOut size={15} />
              <span>Sign Out to Switch Account</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setActiveView('sign-in')}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px'
              }}
            >
              Sign In with Authorized Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
