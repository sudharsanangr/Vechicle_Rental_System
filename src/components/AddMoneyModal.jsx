import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Wallet, ShieldCheck, Check, Smartphone, CreditCard, Building } from 'lucide-react';

export default function AddMoneyModal() {
  const { isAddMoneyOpen, setIsAddMoneyOpen, topUpWallet, walletBalance } = useApp();
  const [amount, setAmount] = useState(1000);
  const [method, setMethod] = useState('UPI');

  if (!isAddMoneyOpen) return null;

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount <= 0) return;
    topUpWallet(amount, `${method} Top-up`);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAddMoneyOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--primary-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Wallet size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '18px' }}>Top-up Wallet</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Current Balance: <strong>₹ {walletBalance.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>
          <button
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
            onClick={() => setIsAddMoneyOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Enter Amount to Add (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b' }}>
                  ₹
                </span>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="form-input"
                  style={{ paddingLeft: '32px', fontSize: '18px', fontWeight: 700 }}
                  placeholder="1000"
                  required
                />
              </div>
            </div>

            {/* Quick Amount Chips */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap' }}>
              {quickAmounts.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  style={{
                    border: amount === val ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                    backgroundColor: amount === val ? 'var(--primary-light)' : '#f8fafc',
                    color: amount === val ? 'var(--primary)' : '#334155',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + ₹{val.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            {/* Payment Method Selector */}
            <div className="form-group">
              <label className="form-label">Select Payment Method</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: method === 'UPI' ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                    backgroundColor: method === 'UPI' ? 'var(--primary-light)' : '#fff',
                    cursor: 'pointer'
                  }}
                  onClick={() => setMethod('UPI')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Smartphone size={18} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600 }}>UPI (GPay, PhonePe, Paytm)</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>Instant zero-fee transfer</div>
                    </div>
                  </div>
                  {method === 'UPI' && <Check size={16} color="var(--primary)" />}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: method === 'Debit/Credit Card' ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                    backgroundColor: method === 'Debit/Credit Card' ? 'var(--primary-light)' : '#fff',
                    cursor: 'pointer'
                  }}
                  onClick={() => setMethod('Debit/Credit Card')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCard size={18} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600 }}>Credit or Debit Card</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>Visa, Mastercard, RuPay</div>
                    </div>
                  </div>
                  {method === 'Debit/Credit Card' && <Check size={16} color="var(--primary)" />}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: method === 'Net Banking' ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                    backgroundColor: method === 'Net Banking' ? 'var(--primary-light)' : '#fff',
                    cursor: 'pointer'
                  }}
                  onClick={() => setMethod('Net Banking')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Building size={18} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600 }}>Net Banking</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>All major Indian banks</div>
                    </div>
                  </div>
                  {method === 'Net Banking' && <Check size={16} color="var(--primary)" />}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', marginTop: '16px' }}>
              <ShieldCheck size={16} color="#10b981" />
              <span>RBI compliant 256-bit encrypted payment gateway</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddMoneyOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add ₹ {amount.toLocaleString('en-IN')} to Wallet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
