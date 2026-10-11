import React, { useState } from 'react';
import { useApp, OFFICIAL_ACCOUNTS } from '../context/AppContext';
import { Code, Trash2, UserPlus, LogIn, Shield, Layers, User, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';

export default function DevAuthBar() {
  // Only render in Vite development mode
  if (!import.meta.env.DEV) return null;

  const {
    currentUser,
    currentRole,
    activeView,
    setActiveView,
    logout,
    login,
    addToast
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);

  const handleTestVisitor = () => {
    logout();
    setActiveView('home');
    addToast('Scenario 1: Reset to First-Time Visitor (no active session)', 'info');
  };

  const handleTestSignUp = () => {
    logout();
    setActiveView('sign-up');
    addToast('Scenario 2: Ready to test New Customer Registration', 'info');
  };

  const handleTestCustomer = () => {
    login('customer@driveeasy.com', 'user123');
    addToast('Scenario 3: Signed in as Customer (Rahul Sharma)', 'success');
  };

  const handleTestOwner = () => {
    login('owner@driveeasy.com', 'owner123');
    addToast('Scenario 4: Signed in as Vehicle Fleet Owner (Ravi Kumar)', 'success');
  };

  const handleTestAdmin = () => {
    login('admin@driveeasy.com', 'admin123');
    addToast('Scenario 5: Signed in as Superadmin (Priya Sundaram)', 'success');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        borderTop: '2px solid var(--primary)',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.18)',
        fontSize: '12px',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      {/* Dev Bar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 16px',
          cursor: 'pointer',
          backgroundColor: '#0f172a'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '10.5px',
              letterSpacing: '0.4px',
              textTransform: 'uppercase'
            }}
          >
            <Code size={12} />
            <span>DEV AUTH SUITE</span>
          </div>
          <span style={{ color: '#94a3b8', fontSize: '11.5px' }}>
            Current: <strong style={{ color: '#ffffff' }}>{currentUser ? currentUser.name : 'Visitor (Guest)'}</strong> &bull; Role:{' '}
            <span
              style={{
                color: currentRole === 'admin' ? '#ef4444' : currentRole === 'owner' ? '#f59e0b' : currentRole === 'customer' ? '#10b981' : '#94a3b8',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              {currentRole}
            </span> &bull; View: <code style={{ color: '#38bdf8' }}>{activeView}</code>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
          <span style={{ fontSize: '11px' }}>{isExpanded ? 'Collapse Tester' : 'Click to test 6 Auth Scenarios'}</span>
          {isExpanded ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
        </div>
      </div>

      {/* Expanded Quick Scenario Actions */}
      {isExpanded && (
        <div
          style={{
            padding: '12px 16px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1e293b'
          }}
        >
          <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', marginRight: '4px' }}>
            Test Scenarios:
          </span>

          {/* Scenario 1: Visitor */}
          <button
            type="button"
            onClick={handleTestVisitor}
            style={{
              backgroundColor: '#334155',
              border: '1px solid #475569',
              borderRadius: '6px',
              padding: '6px 10px',
              color: '#f8fafc',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={13} color="#f87171" />
            <span>1. Reset Visitor (No Session)</span>
          </button>

          {/* Scenario 2: New Customer Sign Up */}
          <button
            type="button"
            onClick={handleTestSignUp}
            style={{
              backgroundColor: '#334155',
              border: '1px solid #475569',
              borderRadius: '6px',
              padding: '6px 10px',
              color: '#f8fafc',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={13} color="#38bdf8" />
            <span>2. Customer Registration</span>
          </button>

          {/* Scenario 3: Customer Login */}
          <button
            type="button"
            onClick={handleTestCustomer}
            style={{
              backgroundColor: currentRole === 'customer' ? 'var(--primary)' : '#334155',
              border: '1px solid #475569',
              borderRadius: '6px',
              padding: '6px 10px',
              color: '#ffffff',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <User size={13} color="#a7f3d0" />
            <span>3. Customer Login</span>
          </button>

          {/* Scenario 4: Owner Login */}
          <button
            type="button"
            onClick={handleTestOwner}
            style={{
              backgroundColor: currentRole === 'owner' ? '#d97706' : '#334155',
              border: '1px solid #475569',
              borderRadius: '6px',
              padding: '6px 10px',
              color: '#ffffff',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={13} color="#fde68a" />
            <span>4. Owner Login</span>
          </button>

          {/* Scenario 5: Admin Login */}
          <button
            type="button"
            onClick={handleTestAdmin}
            style={{
              backgroundColor: currentRole === 'admin' ? '#dc2626' : '#334155',
              border: '1px solid #475569',
              borderRadius: '6px',
              padding: '6px 10px',
              color: '#ffffff',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Shield size={13} color="#fca5a5" />
            <span>5. Admin Login</span>
          </button>

          {/* Scenario 6: Sign Out */}
          {currentUser && (
            <button
              type="button"
              onClick={logout}
              style={{
                backgroundColor: '#dc2626',
                border: '1px solid #ef4444',
                borderRadius: '6px',
                padding: '6px 10px',
                color: '#ffffff',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginLeft: 'auto'
              }}
            >
              <RefreshCw size={12} />
              <span>6. Sign Out ({currentUser.name.split(' ')[0]})</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
