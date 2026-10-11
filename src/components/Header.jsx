import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  X,
  User,
  Shield,
  Layers,
  ChevronDown,
  LogOut,
  CalendarCheck,
  Bookmark,
  Settings,
  HelpCircle,
  Search,
  PlusCircle,
  Car
} from 'lucide-react';

export default function Header() {
  const {
    activeView,
    setActiveView,
    currentRole,
    currentUser,
    logout,
    searchParams,
    setSearchParams
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateToCategory = (type) => {
    setSearchParams(prev => ({ ...prev, vehicleType: type }));
    setActiveView('listings');
    setIsMobileMenuOpen(false);
  };

  const handleFindVehicle = () => {
    setSearchParams(prev => ({ ...prev, vehicleType: 'all' }));
    setActiveView('listings');
    setIsMobileMenuOpen(false);
  };

  const handleListVehicle = () => {
    setIsMobileMenuOpen(false);
    if (!currentUser) {
      setActiveView('sign-in');
    } else if (currentUser.role === 'owner') {
      setActiveView('add-vehicle');
    } else {
      setActiveView('owner-dashboard');
    }
  };

  return (
    <header
      className="navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: '0 1px 3px rgba(32, 33, 31, 0.04)'
      }}
    >
      <div className="container nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo & Distinctive Text-Based Brand Name */}
        <div
          className="brand-logo"
          onClick={() => { setActiveView('home'); setIsMobileMenuOpen(false); }}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: 'var(--primary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(36, 92, 69, 0.25)'
            }}
          >
            {/* Editorial Car Silhouette Icon */}
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
          <span style={{ fontSize: '21px', fontWeight: 800, letterSpacing: '-0.4px', fontFamily: 'var(--font-heading)' }}>
            <span style={{ color: 'var(--primary)' }}>Drive</span><span style={{ color: 'var(--text-primary)' }}>Easy</span>
          </span>
        </div>

        {/* Section 1 Required Desktop Nav Links */}
        <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '26px' }}>
          <ul style={{ display: 'flex', alignItems: 'center', gap: '22px', listStyle: 'none', margin: 0, padding: 0 }}>
            <li>
              <button
                type="button"
                onClick={() => setActiveView('home')}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '14px',
                  fontWeight: activeView === 'home' ? 700 : 500,
                  color: activeView === 'home' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px 2px',
                  transition: 'color 0.15s ease'
                }}
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setSearchParams(prev => ({ ...prev, vehicleType: 'all' }));
                  setActiveView('listings');
                }}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '14px',
                  fontWeight: activeView === 'listings' && searchParams?.vehicleType === 'all' ? 700 : 500,
                  color: activeView === 'listings' && searchParams?.vehicleType === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px 2px',
                  transition: 'color 0.15s ease'
                }}
              >
                Explore Vehicles
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigateToCategory('car')}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '14px',
                  fontWeight: activeView === 'listings' && searchParams?.vehicleType === 'car' ? 700 : 500,
                  color: activeView === 'listings' && searchParams?.vehicleType === 'car' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px 2px',
                  transition: 'color 0.15s ease'
                }}
              >
                Cars
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigateToCategory('bike')}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '14px',
                  fontWeight: activeView === 'listings' && searchParams?.vehicleType === 'bike' ? 700 : 500,
                  color: activeView === 'listings' && searchParams?.vehicleType === 'bike' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px 2px',
                  transition: 'color 0.15s ease'
                }}
              >
                Bikes
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setActiveView('how-it-works')}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '14px',
                  fontWeight: activeView === 'how-it-works' ? 700 : 500,
                  color: activeView === 'how-it-works' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px 2px',
                  transition: 'color 0.15s ease'
                }}
              >
                How It Works
              </button>
            </li>
            {currentUser?.role !== 'customer' && (
              <li>
                <button
                  type="button"
                  onClick={handleListVehicle}
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    padding: '6px 2px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>List Your Vehicle</span>
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Nav Actions (Sign In + Primary Find a Vehicle CTA) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: isUserMenuOpen ? 'var(--bg-subtle)' : '#FFFFFF'
                }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={currentUser.name}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {currentUser.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </div>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '240px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-light)',
                    padding: '6px',
                    zIndex: 200
                  }}
                >
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
                    <div style={{ marginTop: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-primary)', borderRadius: '6px' }}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (currentRole === 'customer') setActiveView('dashboard', 'overview');
                      else if (currentRole === 'owner') setActiveView('owner-dashboard');
                      else setActiveView('admin-dashboard');
                    }}
                  >
                    <CalendarCheck size={15} color="var(--primary)" />
                    <span>Dashboard</span>
                  </div>

                  {currentRole === 'customer' && (
                    <>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-primary)', borderRadius: '6px' }}
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveView('dashboard', 'bookings');
                        }}
                      >
                        <CalendarCheck size={15} color="var(--text-muted)" />
                        <span>My Bookings</span>
                      </div>

                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-primary)', borderRadius: '6px' }}
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveView('dashboard', 'saved');
                        }}
                      >
                        <Bookmark size={15} color="var(--text-muted)" />
                        <span>Saved Vehicles</span>
                      </div>

                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-primary)', borderRadius: '6px' }}
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveView('dashboard', 'profile');
                        }}
                      >
                        <Settings size={15} color="var(--text-muted)" />
                        <span>Profile Settings</span>
                      </div>
                    </>
                  )}

                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', fontSize: '13px', cursor: 'pointer', color: '#b91c1c', borderTop: '1px solid var(--border-light)', borderRadius: '6px' }}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveView('sign-in')}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  transition: 'background 0.15s ease'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveView('sign-up')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  borderRadius: '8px'
                }}
              >
                <span>Get Started</span>
              </button>
            </div>
          )}

          {/* When authenticated, show quick Find a Vehicle action */}
          {currentUser && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleFindVehicle}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                fontSize: '13.5px',
                fontWeight: 600,
                borderRadius: '8px'
              }}
            >
              <Search size={15} />
              <span>Find a Vehicle</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              border: 'none',
              background: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '6px'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--border-light)',
            padding: '16px 20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveView('home');
              setIsMobileMenuOpen(false);
            }}
            style={{ border: 'none', background: 'none', textAlign: 'left', fontSize: '15px', fontWeight: activeView === 'home' ? 700 : 600, color: activeView === 'home' ? 'var(--primary)' : 'var(--text-primary)', padding: '6px 0' }}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchParams(prev => ({ ...prev, vehicleType: 'all' }));
              setActiveView('listings');
              setIsMobileMenuOpen(false);
            }}
            style={{ border: 'none', background: 'none', textAlign: 'left', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}
          >
            Explore Vehicles
          </button>
          <button
            type="button"
            onClick={() => navigateToCategory('car')}
            style={{ border: 'none', background: 'none', textAlign: 'left', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}
          >
            Cars
          </button>
          <button
            type="button"
            onClick={() => navigateToCategory('bike')}
            style={{ border: 'none', background: 'none', textAlign: 'left', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}
          >
            Bikes
          </button>
          <button
            type="button"
            onClick={() => { setActiveView('how-it-works'); setIsMobileMenuOpen(false); }}
            style={{ border: 'none', background: 'none', textAlign: 'left', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}
          >
            How It Works
          </button>
          {currentUser?.role !== 'customer' && (
            <button
              type="button"
              onClick={handleListVehicle}
              style={{ border: 'none', background: 'none', textAlign: 'left', fontSize: '15px', fontWeight: 700, color: 'var(--primary)', padding: '6px 0' }}
            >
              List Your Vehicle
            </button>
          )}

          <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '4px 0' }} />

          {currentUser ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (currentRole === 'customer') setActiveView('dashboard', 'overview');
                  else if (currentRole === 'owner') setActiveView('owner-dashboard');
                  else setActiveView('admin-dashboard');
                }}
                style={{ border: 'none', background: 'none', textAlign: 'left', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}
              >
                Dashboard ({currentUser.name?.split(' ')[0]})
              </button>
              {currentRole === 'customer' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveView('dashboard', 'bookings');
                    }}
                    style={{ border: 'none', background: 'none', textAlign: 'left', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}
                  >
                    My Bookings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveView('dashboard', 'saved');
                    }}
                    style={{ border: 'none', background: 'none', textAlign: 'left', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}
                  >
                    Saved Vehicles
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveView('dashboard', 'profile');
                    }}
                    style={{ border: 'none', background: 'none', textAlign: 'left', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}
                  >
                    Profile Settings
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                style={{ border: 'none', background: 'none', textAlign: 'left', fontSize: '15px', fontWeight: 600, color: '#b91c1c', padding: '6px 0' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setActiveView('sign-in'); setIsMobileMenuOpen(false); }}
                style={{ flex: 1, padding: '10px' }}
              >
                Sign In
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => { setActiveView('sign-up'); setIsMobileMenuOpen(false); }}
                style={{ flex: 1, padding: '10px' }}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
