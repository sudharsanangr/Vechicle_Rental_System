import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCcw,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Calendar,
  FileText
} from 'lucide-react';

export default function WalletPage() {
  const {
    walletBalance,
    setIsAddMoneyOpen,
    transactions,
    currentUser
  } = useApp();

  const [filter, setFilter] = useState('all'); // all | credits | debits

  const filteredTxns = transactions.filter(t => {
    if (filter === 'credits') return t.isCredit;
    if (filter === 'debits') return !t.isCredit;
    return true;
  });

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 72px)', padding: '32px 0 60px' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Wallet size={20} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
            Wallet
          </h1>
        </div>

        {/* Current Balance Banner (Mockup #10 Top) */}
        <div
          className="card"
          style={{
            padding: '28px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              Current Balance
            </div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
              ₹ {walletBalance.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12.5px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
              <ShieldCheck size={15} />
              <span>100% Insured digital wallet for fast 1-click checkout</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={() => setIsAddMoneyOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px' }}
          >
            <Plus size={18} />
            <span>Add Money</span>
          </button>
        </div>

        {/* Recent Transactions List (Mockup #10 Bottom) */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Recent Transactions
            </h2>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: filter === 'all' ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: filter === 'all' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                All
              </button>
              <button
                onClick={() => setFilter('credits')}
                style={{
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: filter === 'credits' ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: filter === 'credits' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Credits (+)
              </button>
              <button
                onClick={() => setFilter('debits')}
                style={{
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: filter === 'debits' ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: filter === 'debits' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Debits (-)
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTxns.map(t => (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #f1f5f9',
                  borderRadius: '12px',
                  transition: 'var(--transition)'
                }}
              >
                {/* Icon & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: t.isCredit ? '#ecfdf5' : '#fef2f2',
                      color: t.isCredit ? '#10b981' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {t.type.includes('Refund') ? (
                      <RefreshCcw size={20} />
                    ) : t.isCredit ? (
                      <ArrowDownLeft size={22} />
                    ) : (
                      <ArrowUpRight size={22} />
                    )}
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>
                      {t.type}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                      {t.date} &bull; {t.method}
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '17px',
                      fontWeight: 800,
                      color: t.isCredit ? '#10b981' : '#ef4444'
                    }}
                  >
                    {t.isCredit ? '+ ' : '- '}₹ {t.amount.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>
                    {t.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
