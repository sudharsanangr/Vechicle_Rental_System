import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Compass,
  Bookmark,
  Settings,
  HelpCircle,
  LogOut,
  Calendar,
  Clock,
  Car,
  Bike,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Trash2,
  Edit3,
  Lock,
  Phone,
  Mail,
  User,
  Plus
} from 'lucide-react';

export default function UserDashboard() {
  const {
    currentUser,
    bookings,
    vehicles,
    savedVehicleIds,
    toggleSaveVehicle,
    isVehicleSaved,
    updateProfile,
    dashboardSubTab,
    setDashboardSubTab,
    setActiveView,
    setSelectedVehicle,
    setSearchParams,
    setActiveReceipt,
    setIsReceiptOpen,
    setCancelModalBooking,
    logout,
    addToast
  } = useApp();

  // Active sub-tab: 'overview' | 'bookings' | 'saved' | 'profile' | 'support'
  const activeTab = dashboardSubTab || 'overview';
  const setActiveTab = (tab) => setDashboardSubTab(tab);

  // Booking filter state: 'all' | 'upcoming' | 'active' | 'completed' | 'cancelled'
  const [bookingFilter, setBookingFilter] = useState('all');

  // Profile edit form state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editCity, setEditCity] = useState(currentUser?.city || 'Chennai, Tamil Nadu');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Unauthenticated guard
  if (!currentUser) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto', background: '#FFFFFF', padding: '36px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
          <AlertCircle size={36} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Sign In Required</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Please sign in to access your personal dashboard and bookings.
          </p>
          <button className="btn btn-primary" onClick={() => setActiveView('sign-in')}>
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  // Role routing guard: redirect owners and admins to their dedicated dashboards
  if (currentUser.role === 'admin') {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto', background: '#FFFFFF', padding: '36px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Superadmin Portal</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>You are signed in as Platform Superadmin.</p>
          <button className="btn btn-primary" onClick={() => setActiveView('admin-dashboard')}>Go to Admin Panel</button>
        </div>
      </div>
    );
  }

  if (currentUser.role === 'owner') {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto', background: '#FFFFFF', padding: '36px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Vehicle Owner Portal</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>You are signed in as Vehicle Fleet Owner.</p>
          <button className="btn btn-primary" onClick={() => setActiveView('owner-dashboard')}>Go to Owner Portal</button>
        </div>
      </div>
    );
  }

  // Calculate user-specific records
  // Match by customer email, customerId, or if customerName matches
  const userBookings = bookings.filter(b => {
    if (b.customerId && b.customerId === currentUser.id) return true;
    if (b.customerEmail && b.customerEmail.toLowerCase() === currentUser.email?.toLowerCase()) return true;
    if (b.customerName && b.customerName.toLowerCase() === currentUser.name?.toLowerCase()) return true;
    // For demo/registered customer, show their bookings
    return currentUser.role === 'customer';
  });

  // Calculate metrics dynamically from actual booking data
  const upcomingBookings = userBookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
  const activeRentals = userBookings.filter(b => b.status === 'Ongoing');
  const completedTrips = userBookings.filter(b => b.status === 'Completed');
  const cancelledBookings = userBookings.filter(b => b.status === 'Cancelled');

  // Saved vehicles list
  const savedVehicles = vehicles.filter(v => savedVehicleIds.includes(v.id));

  // Filtered bookings for the "My Bookings" tab
  const displayedBookings = userBookings.filter(b => {
    if (bookingFilter === 'upcoming') return b.status === 'Confirmed' || b.status === 'Pending';
    if (bookingFilter === 'active') return b.status === 'Ongoing';
    if (bookingFilter === 'completed') return b.status === 'Completed';
    if (bookingFilter === 'cancelled') return b.status === 'Cancelled';
    return true; // 'all'
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (newPassword && newPassword.length < 6) {
      addToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    updateProfile({
      name: editName,
      phone: editPhone,
      city: editCity,
      ...(newPassword ? { password: newPassword } : {})
    });

    setNewPassword('');
    setConfirmPassword('');
  };

  const openVehicleDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setActiveView('details');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 140px)', padding: '32px 0 60px' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Sidebar Navigation */}
        <aside
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid var(--border-light)',
            padding: '20px 16px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* User mini badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)', marginBottom: '14px' }}>
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser.name}
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.email}
              </div>
            </div>
          </div>

          {/* Sidebar Menu items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'overview' ? 'var(--primary-light)' : 'transparent',
                color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: activeTab === 'overview' ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchParams(prev => ({ ...prev, vehicleType: 'all' }));
                setActiveView('listings');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Compass size={17} />
              <span>Explore Vehicles</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchParams(prev => ({ ...prev, vehicleType: 'car' }));
                setActiveView('listings');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Car size={17} />
              <span>Cars</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchParams(prev => ({ ...prev, vehicleType: 'bike' }));
                setActiveView('listings');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Bike size={17} />
              <span>Bikes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'bookings' ? 'var(--primary-light)' : 'transparent',
                color: activeTab === 'bookings' ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: activeTab === 'bookings' ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CalendarCheck size={17} />
                <span>My Bookings</span>
              </div>
              {upcomingBookings.length > 0 && (
                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: 'var(--primary)', color: '#FFFFFF', padding: '2px 6px', borderRadius: '10px' }}>
                  {upcomingBookings.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'saved' ? 'var(--primary-light)' : 'transparent',
                color: activeTab === 'saved' ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: activeTab === 'saved' ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bookmark size={17} />
                <span>Saved Vehicles</span>
              </div>
              {savedVehicles.length > 0 && (
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {savedVehicles.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'profile' ? 'var(--primary-light)' : 'transparent',
                color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: activeTab === 'profile' ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Settings size={17} />
              <span>Profile Settings</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('support')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'support' ? 'var(--primary-light)' : 'transparent',
                color: activeTab === 'support' ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: activeTab === 'support' ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <HelpCircle size={17} />
              <span>Help and Support</span>
            </button>

            <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '12px 0 6px' }} />

            <button
              type="button"
              onClick={() => logout()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: '#b91c1c',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <LogOut size={17} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main style={{ minWidth: 0 }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              {/* Personalized Welcome Message with prominent Find a Vehicle Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: '4px' }}>
                    Welcome back, {currentUser.name?.split(' ')[0]}.
                  </h1>
                  <p style={{ fontSize: '14.5px', color: 'var(--text-muted)' }}>
                    Manage your trips, vehicle reservations, and account details in one place.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setSearchParams(prev => ({ ...prev, vehicleType: 'all' }));
                    setActiveView('listings');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: 700,
                    borderRadius: '8px'
                  }}
                >
                  <Search size={16} />
                  <span>Find a Vehicle</span>
                </button>
              </div>

              {/* Summary Sections: 4 Calculated Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Upcoming Bookings</span>
                    <Calendar size={18} color="var(--primary)" />
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {upcomingBookings.length}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Confirmed & ready for pickup
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Active Rentals</span>
                    <Car size={18} color="var(--primary)" />
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {activeRentals.length}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Vehicles currently on the road
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Completed Trips</span>
                    <CheckCircle2 size={18} color="var(--primary)" />
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {completedTrips.length}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Past journeys fulfilled
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Saved Vehicles</span>
                    <Bookmark size={18} color="var(--primary)" />
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {savedVehicles.length}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Rides in your wishlist
                  </div>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid var(--border-light)', padding: '20px 24px', marginBottom: '28px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
                  Quick Actions
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setSearchParams(prev => ({ ...prev, vehicleType: 'all' }));
                      setActiveView('listings');
                    }}
                    style={{ fontSize: '13px', padding: '9px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Search size={14} />
                    <span>Find a Vehicle</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveTab('bookings')}
                    style={{ fontSize: '13px', padding: '9px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <CalendarCheck size={14} />
                    <span>View My Bookings</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchParams(prev => ({ ...prev, vehicleType: 'car' }));
                      setActiveView('listings');
                    }}
                    style={{ fontSize: '13px', padding: '9px 16px' }}
                  >
                    <span>Browse Cars</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchParams(prev => ({ ...prev, vehicleType: 'bike' }));
                      setActiveView('listings');
                    }}
                    style={{ fontSize: '13px', padding: '9px 16px' }}
                  >
                    <span>Browse Bikes</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveTab('profile')}
                    style={{ fontSize: '13px', padding: '9px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Edit3 size={14} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* My Upcoming Bookings Section */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    My Upcoming Bookings
                  </h2>
                  {upcomingBookings.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('bookings')}
                      style={{ border: 'none', background: 'none', color: 'var(--primary)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>View All ({userBookings.length})</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>

                {upcomingBookings.length === 0 ? (
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1px solid var(--border-light)',
                      padding: '40px 24px',
                      textAlign: 'center'
                    }}
                  >
                    <Car size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      No Upcoming Bookings
                    </h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 20px' }}>
                      You don't have any confirmed reservations right now. Browse our cars and bikes to plan your next journey.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        setSearchParams(prev => ({ ...prev, vehicleType: 'all' }));
                        setActiveView('listings');
                      }}
                    >
                      Explore Vehicles
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {upcomingBookings.map(booking => (
                      <div
                        key={booking.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid var(--border-light)',
                          padding: '18px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '16px',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <img
                            src={booking.vehicleImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'}
                            alt={booking.vehicleName}
                            style={{ width: '84px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                                {booking.vehicleName}
                              </h4>
                              <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                                {booking.status}
                              </span>
                            </div>
                            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                              <span>Ref: #{booking.id}</span>
                              <span>&bull;</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={12} />
                                {booking.pickupLocation || 'Anna Nagar, Chennai'}
                              </span>
                            </div>
                            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              {booking.startDate} ({booking.startTime}) &rarr; {booking.endDate} ({booking.endTime})
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                              ₹ {booking.totalAmount?.toLocaleString('en-IN')}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                              {booking.rentalMode === 'hourly' ? `${booking.duration || 6} hrs` : `${booking.duration || 1} day(s)`}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setActiveReceipt(booking);
                                setIsReceiptOpen(true);
                              }}
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
                              onClick={() => setCancelModalBooking(booking)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Rentals Section */}
              {activeRentals.length > 0 && (
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
                    Active Rentals
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {activeRentals.map(booking => (
                      <div
                        key={booking.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid var(--primary)',
                          padding: '18px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <img
                            src={booking.vehicleImage}
                            alt={booking.vehicleName}
                            style={{ width: '84px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                              {booking.vehicleName}
                            </div>
                            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                              Active Trip &bull; Return by: {booking.endDate} ({booking.endTime})
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setActiveReceipt(booking);
                            setIsReceiptOpen(true);
                          }}
                        >
                          Trip Digital Pass
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY BOOKINGS */}
          {activeTab === 'bookings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    My Bookings
                  </h1>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Review confirmed, active, and completed journeys
                  </p>
                </div>

                {/* Filter Tabs: All, Upcoming, Active, Completed, Cancelled */}
                <div style={{ display: 'flex', gap: '6px', backgroundColor: '#FFFFFF', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  {['all', 'upcoming', 'active', 'completed', 'cancelled'].map(filterKey => (
                    <button
                      key={filterKey}
                      type="button"
                      onClick={() => setBookingFilter(filterKey)}
                      style={{
                        border: 'none',
                        background: bookingFilter === filterKey ? 'var(--primary)' : 'transparent',
                        color: bookingFilter === filterKey ? '#FFFFFF' : 'var(--text-secondary)',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {filterKey}
                    </button>
                  ))}
                </div>
              </div>

              {displayedBookings.length === 0 ? (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '48px 24px', textAlign: 'center' }}>
                  <CalendarCheck size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    No {bookingFilter !== 'all' ? bookingFilter : ''} bookings found
                  </h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
                    Ready to book your next vehicle? Explore available cars and bikes with instant booking.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setSearchParams(prev => ({ ...prev, vehicleType: 'all' }));
                      setActiveView('listings');
                    }}
                  >
                    Explore Vehicles
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {displayedBookings.map(booking => (
                    <div
                      key={booking.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid var(--border-light)',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img
                          src={booking.vehicleImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'}
                          alt={booking.vehicleName}
                          style={{ width: '84px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                              {booking.vehicleName}
                            </h4>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: booking.status === 'Cancelled' ? 'var(--danger-bg)' : 'var(--primary-light)',
                                color: booking.status === 'Cancelled' ? 'var(--danger)' : 'var(--primary)'
                              }}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span>Booking ID: #{booking.id}</span>
                            <span>&bull;</span>
                            <span>{booking.pickupLocation || 'Anna Nagar, Chennai'}</span>
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {booking.startDate} ({booking.startTime}) &rarr; {booking.endDate} ({booking.endTime})
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--primary)' }}>
                            ₹ {booking.totalAmount?.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {booking.rentalMode === 'hourly' ? `${booking.duration || 6} Hours` : `${booking.duration || 1} Day(s)`}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setActiveReceipt(booking);
                              setIsReceiptOpen(true);
                            }}
                          >
                            Details & Pass
                          </button>
                          {(booking.status === 'Confirmed' || booking.status === 'Pending') && (
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
                              onClick={() => setCancelModalBooking(booking)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED VEHICLES */}
          {activeTab === 'saved' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Saved Vehicles ({savedVehicles.length})
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Vehicles you have bookmarked for future trips
                </p>
              </div>

              {savedVehicles.length === 0 ? (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '48px 24px', textAlign: 'center' }}>
                  <Bookmark size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    No Saved Vehicles Yet
                  </h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
                    Click the bookmark icon on any vehicle card to save it here for quick access later.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setSearchParams(prev => ({ ...prev, vehicleType: 'all' }));
                      setActiveView('listings');
                    }}
                  >
                    Browse Vehicles
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {savedVehicles.map(vehicle => (
                    <div
                      key={vehicle.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid var(--border-light)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ position: 'relative', height: '170px' }}>
                        <img
                          src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
                          alt={vehicle.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => toggleSaveVehicle(vehicle.id)}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            backgroundColor: '#FFFFFF',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--primary)',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                          }}
                          title="Remove from saved"
                        >
                          <Bookmark size={16} fill="var(--primary)" />
                        </button>
                      </div>

                      <div style={{ padding: '16px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                          {vehicle.name}
                        </h4>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          {vehicle.pickupLocation || 'Anna Nagar, Chennai'}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                          <div>
                            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                              ₹ {vehicle.dailyPrice?.toLocaleString('en-IN')}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}> / day</span>
                          </div>

                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => openVehicleDetails(vehicle)}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid var(--border-light)', padding: '28px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Profile Settings
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Update your contact details and account security
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '520px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-muted)',
                      fontSize: '14px',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    City / Primary Region
                  </label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '4px 0' }} />

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Change Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '14px',
                      outline: 'none',
                      marginBottom: '10px'
                    }}
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: '13.5px', fontWeight: 700 }}
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: HELP & SUPPORT */}
          {activeTab === 'support' && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid var(--border-light)', padding: '28px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Help and Support
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Frequently asked questions and direct assistance for your rentals
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    How do I pick up my booked vehicle?
                  </h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Navigate to your confirmed booking in <strong>My Bookings</strong>, click <strong>Details & Pass</strong>, and present your digital QR code to the on-site station host at your pickup zone.
                  </p>
                </div>

                <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    What is the cancellation and refund policy?
                  </h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Free cancellations are permitted up to 24 hours prior to the scheduled start time. The full rental amount is immediately credited back to your digital wallet for instant reuse.
                  </p>
                </div>

                <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Need urgent assistance or roadside support?
                  </h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Our Chennai fleet operations desk is reachable 24/7 at <strong>support@driveeasy.com</strong> or via phone at <strong>+91 (044) 4900-2100</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
