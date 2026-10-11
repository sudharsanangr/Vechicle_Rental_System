import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Car,
  Search,
  CheckCircle2,
  TrendingUp,
  Wallet,
  ShieldCheck,
  RefreshCcw,
  ArrowRight,
  FileCheck
} from 'lucide-react';

export default function HowItWorksPage() {
  const { setActiveView } = useApp();

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 72px)', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-verified" style={{ marginBottom: '12px' }}>
            TRANSPARENT & RELIABLE RENTALS
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
            How DriveEasy Works
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            A complete guide to booking, location-based dynamic pricing, digital wallet refunds, and fleet onboarding.
          </p>
        </div>

        {/* 3 Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '50px' }}>
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <Search size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>
              1. Search & Filter Fleet
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
              Pick your location zone in Chennai (Anna Nagar, Airport Express, OMR, etc.) and your exact rental schedule. Browse cars and bikes with instant verified availability.
            </p>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>
              2. Dynamic Pricing & Multiplier
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
              Our server validates location demand multipliers transparently before checkout. Base daily rates and location adjustments are clearly itemized with zero hidden fees.
            </p>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <Wallet size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>
              3. Wallet & Instant Handover
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
              Pay via your DriveEasy Wallet balance or UPI/Cards. Receive your digital QR handover pass instantly. If plans change, free cancellation provides 100% wallet refund.
            </p>
          </div>
        </div>

        {/* Roles overview */}
        <div className="card" style={{ padding: '36px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '24px', textAlign: 'center' }}>
            3 Dedicated Experiences Built for Every User
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '16px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Customers</h4>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
                Browse verified vehicles, pay via digital wallet, track active rentals, and download official booking receipts.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '16px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Vehicle Owners</h4>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
                List your cars and bikes, upload RC and insurance certificates, manage calendar availability, and track rental earnings.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '16px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Platform Admin</h4>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
                Approve newly submitted vehicles, adjust location pricing multipliers, verify user driving licences, and monitor revenue.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setActiveView('listings')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Explore All Vehicles Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
