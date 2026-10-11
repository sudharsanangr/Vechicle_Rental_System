import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AccessDenied from './AccessDenied';
import {
  Layers,
  Car,
  CalendarCheck,
  TrendingUp,
  User,
  HelpCircle,
  LogOut,
  Plus,
  CheckCircle2,
  Clock,
  Settings,
  MoreVertical,
  Check,
  AlertTriangle
} from 'lucide-react';

export default function OwnerDashboard() {
  const {
    currentUser,
    vehicles,
    setVehicles,
    bookings,
    setActiveView,
    logout,
    switchRole,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | vehicles | bookings | earnings

  // Role Protection Guard
  if (!currentUser || currentUser.role !== 'owner') {
    return <AccessDenied requiredRole="owner" attemptedView="Vehicle Owner Portal" />;
  }

  // Filter vehicles owned by Ravi Kumar or current user
  const ownerVehicles = vehicles.filter(v => v.ownerId === currentUser?.id || v.ownerId === 'owner-1' || v.ownerName === currentUser?.name);

  // Recent bookings for owner's vehicles
  const ownerBookings = bookings.slice(0, 5);

  const toggleVehicleStatus = (vehicleId, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'maintenance' : 'available';
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, status: newStatus } : v));
    addToast(`Vehicle status updated to ${newStatus === 'available' ? 'Available' : 'Under Maintenance'}`);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar (Mockup #7 Left) */}
      <aside className="dashboard-sidebar">
        <div style={{ padding: '0 8px 16px', fontSize: '13px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Owner Portal
        </div>

        {/* User Card */}
        <div className="sidebar-profile">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
            alt={currentUser?.name || 'Owner'}
            className="sidebar-avatar"
          />
          <div>
            <div className="sidebar-name">{currentUser?.name}</div>
            <div className="sidebar-role">Vehicle Fleet Owner</div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <ul className="sidebar-nav">
          <li
            className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Layers size={18} />
            <span>Dashboard</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            <Car size={18} />
            <span>My Vehicles ({ownerVehicles.length})</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <CalendarCheck size={18} />
            <span>Bookings</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('earnings')}
          >
            <TrendingUp size={18} />
            <span>Earnings</span>
          </li>
        </ul>

        {/* Logout */}
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
        {/* Top Header with Add Vehicle Action */}
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
              Overview
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Monitor your vehicle fleet performance, upcoming rentals, and revenue
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setActiveView('add-vehicle')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* 3 Overview Stat Cards (Mockup #7) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}
        >
          {/* Card 1: Total Vehicles */}
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Car size={24} />
            </div>
            <div>
              <div className="stat-title">Total Vehicles</div>
              <div className="stat-val">{ownerVehicles.length || 5}</div>
            </div>
          </div>

          {/* Card 2: Active Rentals */}
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: '#f0f9ff', color: '#0284c7' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="stat-title">Active Rentals</div>
              <div className="stat-val">3</div>
            </div>
          </div>

          {/* Card 3: Total Earnings */}
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="stat-title">Total Earnings</div>
              <div className="stat-val" style={{ color: '#10b981' }}>
                ₹ 48,500
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings Table (Mockup #7 Bottom) */}
        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Recent Bookings
            </h2>
            <button
              style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              onClick={() => setActiveTab('bookings')}
            >
              View All &rarr;
            </button>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Customer</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {ownerBookings.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={b.vehicleImage}
                          alt={b.vehicleName}
                          style={{ width: '45px', height: '32px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{b.vehicleName}</div>
                          <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{b.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#334155' }}>{b.customerName || 'Priya S.'}</div>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Verified KYC</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', color: '#475569' }}>
                        {b.rentalMode === 'hourly'
                          ? `${b.startDate} • ${b.durationHours || b.hours || 6}h (${b.startTime} - ${b.endTime})`
                          : `${b.startDate} - ${b.endDate}`}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          b.status === 'Confirmed'
                            ? 'badge-confirmed'
                            : b.status === 'Ongoing'
                            ? 'badge-ongoing'
                            : b.status === 'Completed'
                            ? 'badge-completed'
                            : b.status === 'Cancelled'
                            ? 'badge-cancelled'
                            : 'badge-pending'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        ₹ {b.totalAmount.toLocaleString('en-IN')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Fleet Management Section */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              My Registered Fleet
            </h2>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveView('add-vehicle')}
            >
              <Plus size={14} />
              <span>Add Another Vehicle</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ownerVehicles.map(v => (
              <div
                key={v.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={v.images[0]}
                    alt={v.name}
                    style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#0f172a' }}>
                      {v.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Plate: {v.registrationNumber || 'TN 09 AB 1234'} &bull; ₹{v.hourlyPrice || Math.round(v.dailyPrice / 8)}/hr &bull; ₹{v.dailyPrice}/day
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span
                    className={`badge ${
                      v.status === 'available'
                        ? 'badge-confirmed'
                        : v.status === 'maintenance'
                        ? 'badge-cancelled'
                        : 'badge-pending'
                    }`}
                  >
                    {v.status === 'available' ? 'Available' : v.status === 'maintenance' ? 'Under Maintenance' : 'Under Review'}
                  </span>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggleVehicleStatus(v.id, v.status)}
                    style={{ fontSize: '12px' }}
                  >
                    {v.status === 'available' ? 'Set Maintenance' : 'Set Available'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
