import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AccessDenied from './AccessDenied';
import {
  Shield,
  Users,
  Car,
  CalendarCheck,
  TrendingUp,
  MapPin,
  AlertCircle,
  FileText,
  Settings,
  LogOut,
  Check,
  X,
  Edit2,
  CheckCircle2,
  Sliders,
  DollarSign
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    currentUser,
    vehicles,
    bookings,
    pricingZones,
    updateZoneMultiplier,
    approveVehicle,
    setActiveView,
    logout,
    switchRole,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // overview | approvals | zones | users
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [tempMultiplier, setTempMultiplier] = useState(1.0);

  // Role Protection Guard
  if (!currentUser || currentUser.role !== 'admin') {
    return <AccessDenied requiredRole="admin" attemptedView="Admin Platform Control Center" />;
  }

  const pendingVehicles = vehicles.filter(v => !v.isApproved || v.status === 'under_review');

  const handleSaveMultiplier = (zoneId) => {
    updateZoneMultiplier(zoneId, tempMultiplier);
    setEditingZoneId(null);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar (Mockup #9 Left) */}
      <aside className="dashboard-sidebar">
        <div style={{ padding: '0 8px 16px', fontSize: '13px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Admin Panel
        </div>

        {/* User Card */}
        <div className="sidebar-profile">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'}
            alt={currentUser?.name || 'Admin'}
            className="sidebar-avatar"
          />
          <div>
            <div className="sidebar-name">{currentUser?.name}</div>
            <div className="sidebar-role">Platform Superadmin</div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <ul className="sidebar-nav">
          <li
            className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Shield size={18} />
            <span>Dashboard</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            <Car size={18} />
            <span>Vehicle Approvals {pendingVehicles.length > 0 && `(${pendingVehicles.length})`}</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === 'zones' ? 'active' : ''}`}
            onClick={() => setActiveTab('zones')}
          >
            <MapPin size={18} />
            <span>Pricing Zones</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            <span>Users & KYC</span>
          </li>
        </ul>

        {/* Exit Admin */}
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
        {/* Top Title Bar */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Platform Administration
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            System-wide statistics, vehicle listing approvals, and dynamic location pricing controls
          </p>
        </div>

        {/* 4 Stat Cards (Mockup #9 Top) */}
        <div className="stats-grid">
          {/* Total Users */}
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Users size={22} />
            </div>
            <div>
              <div className="stat-title">Total Users</div>
              <div className="stat-val">245</div>
            </div>
          </div>

          {/* Total Vehicles */}
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: '#f0f9ff', color: '#0284c7' }}>
              <Car size={22} />
            </div>
            <div>
              <div className="stat-title">Total Vehicles</div>
              <div className="stat-val">78</div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <CalendarCheck size={22} />
            </div>
            <div>
              <div className="stat-title">Total Bookings</div>
              <div className="stat-val">532</div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
              <TrendingUp size={22} />
            </div>
            <div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-val" style={{ color: '#0f172a' }}>
                ₹ 2,48,500
              </div>
            </div>
          </div>
        </div>

        {/* Tab 1: Overview / Recent Bookings (Mockup #9 Bottom) */}
        {activeTab === 'overview' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                Recent Bookings
              </h2>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Live booking ledger</span>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Vehicle</th>
                    <th>Dates</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 6).map(b => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                        #{b.id.replace('DRV-', 'BK')}
                      </td>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>
                        {b.customerName || 'Priya S.'}
                      </td>
                      <td>{b.vehicleName}</td>
                      <td>{b.startDate} - {b.endDate}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Vehicle Approvals Queue (PRD Requirement 4.9 & FR8) */}
        {activeTab === 'approvals' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                Pending Vehicle Approvals
              </h2>
              <span className="badge badge-pending">
                {pendingVehicles.length} Awaiting Verification
              </span>
            </div>

            {pendingVehicles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>All Listings Approved!</div>
                <div style={{ fontSize: '13px', marginTop: '4px' }}>No vehicles currently pending admin review.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pendingVehicles.map(v => (
                  <div
                    key={v.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img
                        src={v.images[0]}
                        alt={v.name}
                        style={{ width: '80px', height: '54px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>
                          {v.name}
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                          Owner: <strong>{v.ownerName || 'Ravi Kumar'}</strong> &bull; Plate: {v.registrationNumber || 'TN 09 AB 1234'} &bull; ₹{v.hourlyPrice || Math.round(v.dailyPrice / 8)}/hr / ₹{v.dailyPrice}/day
                        </div>
                        <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
                          Documents: RC & Comprehensive Insurance Verified
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => approveVehicle(v.id)}
                      >
                        <Check size={14} />
                        <span>Approve Listing</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Dynamic Pricing Zones Configurator (PRD Requirement 4.5 & FR8) */}
        {activeTab === 'zones' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  Location-Based Dynamic Pricing Zones
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  Configure demand multipliers across supported regions in Chennai
                </p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Pricing Zone</th>
                    <th>Zone Description</th>
                    <th>Demand Multiplier</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingZones.map(zone => (
                    <tr key={zone.id}>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MapPin size={16} color="var(--primary)" />
                          <span>{zone.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px', color: '#64748b' }}>
                        {zone.description}
                      </td>
                      <td>
                        {editingZoneId === zone.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="number"
                              step="0.05"
                              min="0.8"
                              max="3.0"
                              value={tempMultiplier}
                              onChange={(e) => setTempMultiplier(e.target.value)}
                              style={{ width: '70px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--primary)', fontWeight: 700 }}
                            />
                            <span>x</span>
                          </div>
                        ) : (
                          <span className="badge badge-verified" style={{ fontSize: '13px', fontWeight: 800 }}>
                            {zone.multiplier}x
                          </span>
                        )}
                      </td>
                      <td>
                        {editingZoneId === zone.id ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleSaveMultiplier(zone.id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setEditingZoneId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setEditingZoneId(zone.id);
                              setTempMultiplier(zone.multiplier);
                            }}
                          >
                            <Edit2 size={13} />
                            <span>Edit Multiplier</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Users & KYC */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
              Registered Platform Users & KYC Status
            </h2>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Driving Licence / Identity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>Rahul Sharma</td>
                    <td>rahul@driveeasy.in</td>
                    <td><span className="badge badge-feature">Customer</span></td>
                    <td>DL-04202100892</td>
                    <td><span className="badge badge-confirmed">KYC Verified</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>Ravi Kumar</td>
                    <td>ravi.kumar@fleet.in</td>
                    <td><span className="badge badge-feature">Vehicle Owner</span></td>
                    <td>TN-FLEET-88319</td>
                    <td><span className="badge badge-confirmed">Verified Fleet</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>Priya Sundaram</td>
                    <td>admin@driveeasy.in</td>
                    <td><span className="badge badge-verified">Superadmin</span></td>
                    <td>ADMIN-AUTH-001</td>
                    <td><span className="badge badge-confirmed">Verified</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>Arjun M.</td>
                    <td>arjun.m@gmail.com</td>
                    <td><span className="badge badge-feature">Customer</span></td>
                    <td>DL-08201944512</td>
                    <td><span className="badge badge-confirmed">KYC Verified</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
