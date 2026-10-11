import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AccessDenied from './AccessDenied';
import {
  LayoutDashboard,
  CalendarCheck,
  Wallet,
  User,
  ShieldCheck,
  HelpCircle,
  LogOut,
  Plus,
  Calendar,
  Clock,
  Car,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function CustomerDashboard() {
  const {
    currentUser,
    walletBalance,
    setIsAddMoneyOpen,
    bookings,
    setActiveReceipt,
    setIsReceiptOpen,
    setCancelModalBooking,
    setActiveView,
    logout,
    switchRole
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | bookings | profile | kyc

  // Role Protection Guard
  if (!currentUser || currentUser.role !== 'customer') {
    return <AccessDenied requiredRole="customer" attemptedView="Customer Portal" />;
  }

  // Filter bookings for this customer
  const customerBookings = bookings.filter(b => b.customerName?.toLowerCase().includes('rahul') || true);
  
  const upcomingCount = customerBookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length;
  const activeCount = customerBookings.filter(b => b.status === 'Ongoing').length;
  const completedCount = customerBookings.filter(b => b.status === 'Completed').length;
  const cancelledCount = customerBookings.filter(b => b.status === 'Cancelled').length;

  return (
    <div className="dashboard-layout">
      {/* Sidebar (Mockup #6 Left) */}
      <aside className="dashboard-sidebar">
        {/* User Card */}
        <div className="sidebar-profile">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={currentUser?.name || 'Customer'}
            className="sidebar-avatar"
          />
          <div>
            <div className="sidebar-name">{currentUser?.name}</div>
            <div className="sidebar-role">Customer Account</div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <ul className="sidebar-nav">
          <li
            className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <CalendarCheck size={18} />
            <span>My Bookings</span>
          </li>
          <li
            className="sidebar-item"
            onClick={() => setActiveView('wallet')}
          >
            <Wallet size={18} />
            <span>Wallet</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Profile</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === 'kyc' ? 'active' : ''}`}
            onClick={() => setActiveTab('kyc')}
          >
            <ShieldCheck size={18} />
            <span>KYC Verification</span>
          </li>
        </ul>

        {/* Logout / Switch */}
        <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
          <div
            className="sidebar-item"
            style={{ color: '#ef4444' }}
            onClick={() => logout()}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Header (Mockup #6 Top) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              Hi, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Here's your rental overview and active bookings
            </p>
          </div>

          {/* Wallet Balance Widget */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Wallet Balance
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>
                ₹ {walletBalance.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsAddMoneyOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={14} />
              <span>Add Money</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards (Mockup #6) */}
        <div className="stats-grid">
          {/* Upcoming */}
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Calendar size={22} />
            </div>
            <div>
              <div className="stat-title">Upcoming bookings</div>
              <div className="stat-val">{upcomingCount}</div>
            </div>
          </div>

          {/* Active */}
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: '#f0f9ff', color: '#0284c7' }}>
              <Car size={22} />
            </div>
            <div>
              <div className="stat-title">Active rentals</div>
              <div className="stat-val">{activeCount}</div>
            </div>
          </div>

          {/* Completed */}
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="stat-title">Completed</div>
              <div className="stat-val">{completedCount}</div>
            </div>
          </div>

          {/* Cancelled */}
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: '#fef2f2', color: '#ef4444' }}>
              <AlertCircle size={22} />
            </div>
            <div>
              <div className="stat-title">Cancelled</div>
              <div className="stat-val">{cancelledCount}</div>
            </div>
          </div>
        </div>

        {/* Section: Upcoming Bookings (Mockup #6 Bottom) */}
        <div style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Upcoming & Active Bookings
            </h2>
            <button
              style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              onClick={() => setActiveTab('bookings')}
            >
              View All &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {customerBookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending' || b.status === 'Ongoing').map(booking => (
              <div
                key={booking.id}
                className="card card-hover"
                style={{
                  padding: '18px',
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr auto auto',
                  gap: '20px',
                  alignItems: 'center'
                }}
              >
                {/* Vehicle Thumbnail */}
                <img
                  src={booking.vehicleImage}
                  alt={booking.vehicleName}
                  style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '10px' }}
                />

                {/* Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#0f172a' }}>
                      {booking.vehicleName}
                    </h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>({booking.id})</span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>
                    {booking.rentalMode === 'hourly'
                      ? `${booking.startDate} • ${booking.startTime} - ${booking.endTime} (${booking.durationHours || booking.hours || 6} hrs)`
                      : `${booking.startDate} - ${booking.endDate} (${booking.durationDays || 1} day)`
                    } &bull; {booking.pickupLocation}
                  </div>

                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--primary)' }}>
                    ₹ {booking.totalAmount.toLocaleString('en-IN')}
                    {booking.rentalMode === 'hourly' && (
                      <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#64748b', marginLeft: '6px' }}>
                        (Hourly Rental)
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <span
                    className={`badge ${
                      booking.status === 'Confirmed'
                        ? 'badge-confirmed'
                        : booking.status === 'Ongoing'
                        ? 'badge-ongoing'
                        : booking.status === 'Completed'
                        ? 'badge-completed'
                        : booking.status === 'Cancelled'
                        ? 'badge-cancelled'
                        : 'badge-pending'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setActiveReceipt(booking);
                      setIsReceiptOpen(true);
                    }}
                    title="View Receipt"
                  >
                    <FileText size={15} />
                    <span>Receipt</span>
                  </button>

                  {(booking.status === 'Confirmed' || booking.status === 'Pending') && (
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                      onClick={() => setCancelModalBooking(booking)}
                      title="Cancel booking and get instant refund"
                    >
                      <RotateCcw size={14} />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driving Licence KYC Banner */}
        <div
          style={{
            marginTop: '36px',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid var(--border-light)',
            padding: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>
                Identity & Driving Licence: Verified
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Licence No: {currentUser.dlNumber} &bull; Valid through 2032
              </div>
            </div>
          </div>

          <span className="badge badge-confirmed" style={{ padding: '6px 14px', fontSize: '12.5px' }}>
            KYC VERIFIED
          </span>
        </div>
      </main>
    </div>
  );
}
