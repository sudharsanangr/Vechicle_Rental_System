import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MapPin, Phone, Mail, Clock, ShieldAlert, Award, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const { setActiveView, currentUser } = useApp();

  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        color: 'var(--text-primary)',
        borderTop: '1px solid var(--border-light)',
        marginTop: 'auto',
        paddingTop: '56px',
        paddingBottom: '32px'
      }}
    >
      <div className="container">
        {/* Main Footer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '36px', marginBottom: '40px' }}>
          {/* Brand Info & Contact */}
          <div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', cursor: 'pointer' }}
              onClick={() => setActiveView('home')}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 2px 6px rgba(36, 92, 69, 0.25)'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '18px' }}>
              On-demand self-drive car and bike rental platform. Flexible hourly and daily packages with verified digital verification and transparent pricing.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="var(--primary)" />
                <span>+91 94440 99881 (Support Desk)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="var(--primary)" />
                <span>support@driveeasy.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color="var(--primary)" />
                <span>Anna Nagar & MAA Airport, Chennai</span>
              </div>
            </div>
          </div>

          {/* Pickup Locations */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              Pickup Locations
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="var(--primary)" />
                <span>Anna Nagar Central Hub (1.12x)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="var(--primary)" />
                <span>MAA Chennai Airport Express (1.30x)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="var(--primary)" />
                <span>OMR IT Corridor & Sholinganallur (1.15x)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="var(--primary)" />
                <span>T. Nagar Shopping District (1.10x)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="var(--primary)" />
                <span>Tambaram Gateways (1.00x)</span>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantees */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              Trust & Guarantees
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={15} color="var(--primary)" />
                <span>Zero Security Deposit via DigiLocker</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={15} color="var(--primary)" />
                <span>100% Refund on Cancellations &gt; 24h</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={15} color="var(--primary)" />
                <span>Fully Insured & Maintained Fleet</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="var(--primary)" />
                <span>24/7 Roadside Assistance in Chennai</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-light)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '12.5px',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} DriveEasy Technologies Private Limited. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px', color: 'var(--text-secondary)' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms and Conditions</span>
            <span style={{ cursor: 'pointer' }}>Host Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
