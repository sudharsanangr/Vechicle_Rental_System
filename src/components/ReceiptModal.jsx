import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Printer, X, QrCode } from 'lucide-react';

export default function ReceiptModal() {
  const { isReceiptOpen, setIsReceiptOpen, activeReceipt, setActiveView } = useApp();

  if (!isReceiptOpen || !activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={() => setIsReceiptOpen(false)}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ color: 'var(--success)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-primary)' }}>
                Official Rental Receipt
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Booking Reference: {activeReceipt.id}
              </div>
            </div>
          </div>
          <button
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
            onClick={() => setIsReceiptOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body (Printable Receipt) */}
        <div className="modal-body" id="printable-receipt">
          {/* Header Banner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '16px',
              borderBottom: '2px dashed #e2e8f0',
              marginBottom: '20px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="36" height="36" rx="8" fill="var(--primary)" />
                  <path d="M10 24.5C9.44772 24.5 9 24.0523 9 23.5V20C9 18.8954 9.89543 18 11 18H12L13.5 13.5C13.8 12.6 14.6 12 15.6 12H20.4C21.4 12 22.2 12.6 22.5 13.5L24 18H25C26.1046 18 27 18.8954 27 20V23.5C27 24.0523 26.5523 24.5 26 24.5H25C24.4477 24.5 24 24.0523 24 23.5V22H12V23.5C12 24.0523 11.5523 24.5 11 24.5H10Z" fill="white" />
                  <circle cx="13" cy="20" r="1.5" fill="var(--primary)" />
                  <circle cx="23" cy="20" r="1.5" fill="var(--primary)" />
                  <line x1="15.5" y1="20" x2="20.5" y2="20" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M14 14H22L21 17H15L14 14Z" fill="white" opacity="0.8" />
                </svg>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>DriveEasy</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Vehicle Rental Platform &bull; GSTIN: 33AAACD1234F1Z5
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-confirmed" style={{ fontSize: '12px', padding: '4px 10px' }}>
                CONFIRMED &bull; PAID
              </span>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                Date: {activeReceipt.bookingDate || '12 Oct 2025'}
              </div>
            </div>
          </div>

          {/* Vehicle & Customer Summary */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              backgroundColor: '#f8fafc',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              marginBottom: '20px'
            }}
          >
            {activeReceipt.vehicleImage && (
              <img
                src={activeReceipt.vehicleImage}
                alt={activeReceipt.vehicleName}
                style={{ width: '90px', height: '65px', objectFit: 'cover', borderRadius: '8px' }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>
                {activeReceipt.vehicleName}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {activeReceipt.vehicleType}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginTop: '4px' }}>
                Customer: {activeReceipt.customerName || 'Rahul Sharma'} ({activeReceipt.customerPhone || '+91 98765 43210'})
              </div>
            </div>
          </div>

          {/* Rental Schedule & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
                <Calendar size={14} />
                <span>Pickup Schedule</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a' }}>
                {activeReceipt.startDate} &bull; {activeReceipt.startTime}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                Location: {activeReceipt.pickupLocation}
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
                <Clock size={14} />
                <span>Dropoff Schedule</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a' }}>
                {activeReceipt.endDate} &bull; {activeReceipt.endTime}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                Duration: {activeReceipt.rentalMode === 'hourly'
                  ? `${activeReceipt.durationHours || activeReceipt.hours || 6} Hour(s)`
                  : `${activeReceipt.durationDays || 1} Day(s)`}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Payment Breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>
                  Base Rental ({activeReceipt.rentalMode === 'hourly'
                    ? `${activeReceipt.durationHours || activeReceipt.hours || 6} hrs rental`
                    : `${activeReceipt.durationDays || 1} day`})
                </span>
                <span>₹ {Number(activeReceipt.basePrice || 1800).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Location Multiplier ({activeReceipt.multiplier || 1.12}x demand adjustment)</span>
                <span>+ ₹ {Number(activeReceipt.locationMultiplierFee || 216).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Taxes & Comprehensive Insurance</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Included</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid #e2e8f0',
                  fontWeight: 800,
                  fontSize: '17px',
                  color: '#0f172a'
                }}
              >
                <span>Total Amount Paid</span>
                <span style={{ color: 'var(--primary)' }}>₹ {Number(activeReceipt.totalAmount || 2016).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Handover QR Code verification */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px',
              background: 'var(--primary-light)',
              borderRadius: '10px',
              border: '1px solid var(--primary-border)'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--primary)' }}>
                Digital Handover Pass
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Show this QR pass or code to owner: <strong>{activeReceipt.qrCode || activeReceipt.id}</strong>
              </div>
            </div>
            <div style={{ width: '48px', height: '48px', background: '#fff', border: '1px solid var(--border-light)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={36} color="var(--primary)" />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setIsReceiptOpen(false);
              setActiveView('dashboard', 'bookings');
            }}
          >
            <span>Go to My Bookings</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={() => setIsReceiptOpen(false)}>
              Close
            </button>
            <button className="btn btn-outline" onClick={handlePrint}>
              <Printer size={16} />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
