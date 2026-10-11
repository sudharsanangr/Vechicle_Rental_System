import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, X, CheckCircle, RefreshCcw, Wallet } from 'lucide-react';

export default function CancelBookingModal() {
  const { cancelModalBooking, setCancelModalBooking, cancelBooking } = useApp();
  const [reason, setReason] = useState('Change of travel plans');

  if (!cancelModalBooking) return null;

  const handleConfirmCancel = () => {
    cancelBooking(cancelModalBooking.id, reason);
  };

  return (
    <div className="modal-overlay" onClick={() => setCancelModalBooking(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: '#fef2f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
              <AlertCircle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '18px' }}>Cancel Booking</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Booking ID: {cancelModalBooking.id}
              </div>
            </div>
          </div>
          <button
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
            onClick={() => setCancelModalBooking(null)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
              {cancelModalBooking.vehicleName}
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
              Rental Schedule: {cancelModalBooking.startDate} &bull; {cancelModalBooking.startTime}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600, marginTop: '6px' }}>
              Paid Amount: ₹ {cancelModalBooking.totalAmount.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Refund Guarantee Box */}
          <div style={{ padding: '14px', backgroundColor: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46', fontWeight: 700, fontSize: '13.5px' }}>
              <CheckCircle size={16} />
              <span>Full Refund Eligible (Free Cancellation Policy)</span>
            </div>
            <div style={{ fontSize: '12px', color: '#047857', marginTop: '4px', lineHeight: 1.5 }}>
              Since you are cancelling 24+ hours ahead of pickup time, <strong>100% of ₹ {cancelModalBooking.totalAmount.toLocaleString('en-IN')}</strong> will be instantly credited to your <strong>DriveEasy Wallet</strong>.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Please select a reason for cancellation</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="form-select"
            >
              <option value="Change of travel plans">Change of travel plans</option>
              <option value="Booked another vehicle on DriveEasy">Booked another vehicle on DriveEasy</option>
              <option value="Personal emergency">Personal emergency</option>
              <option value="Incorrect pickup time or location">Incorrect pickup time or location</option>
              <option value="Other reasons">Other reasons</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setCancelModalBooking(null)}>
            Keep Booking
          </button>
          <button className="btn btn-danger" onClick={handleConfirmCancel}>
            <RefreshCcw size={15} />
            <span>Confirm Cancellation & Refund</span>
          </button>
        </div>
      </div>
    </div>
  );
}
