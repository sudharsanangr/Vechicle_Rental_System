import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Wallet,
  Smartphone,
  CreditCard,
  Building,
  CheckCircle2,
  ShieldCheck,
  Check,
  FileText,
  CalendarCheck,
  ArrowRight,
  Home,
  Sparkles,
  Copy,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';

export default function PaymentPage() {
  const {
    selectedVehicle,
    searchParams,
    pricingZones,
    walletBalance,
    createBooking,
    setActiveReceipt,
    setIsReceiptOpen,
    setActiveView,
    currentUser,
    login,
    addToast
  } = useApp();

  const vehicle = selectedVehicle || {
    id: 'v-1',
    name: 'Toyota Innova Crysta',
    type: 'car',
    brand: 'Toyota',
    model: 'Innova Crysta 2.4 VX',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: 7,
    dailyPrice: 1800,
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'],
    pickupLocation: 'Anna Nagar, Chennai',
    zoneId: 'zone-anna-nagar'
  };

  const activeZone = pricingZones.find(z => z.id === vehicle.zoneId) || pricingZones[0];
  const multiplier = activeZone ? activeZone.multiplier : 1.12;

  const isHourly = searchParams.rentalMode === 'hourly';
  const hours = searchParams.hours || 6;
  const days = searchParams.durationDays || 1;
  const durationText = isHourly ? `${hours} Hours` : `${days} Day(s)`;

  const basePrice = isHourly
    ? (vehicle.hourlyPrice || 250) * hours
    : (vehicle.dailyPrice || 1800) * days;

  const locationMultiplierFee = Math.round(basePrice * (multiplier - 1));
  const totalAmount = basePrice + locationMultiplierFee;

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('wallet'); // wallet | upi | card | netbanking
  const [useWalletBalance, setUseWalletBalance] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Compute final amounts
  const walletDeduction = useWalletBalance ? Math.min(walletBalance, totalAmount) : 0;
  const remainingAmountToPay = Math.max(0, totalAmount - walletDeduction);

  const handleCopyId = (id) => {
    if (!id) return;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(id);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (e) {
      console.log('Copy error', e);
    }
  };

  // Spectacular cracker blast celebration effect
  const triggerCrackerBlast = () => {
    try {
      // Blast 1: Center blast
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
        disableForReducedMotion: false
      });

      // Blast 2: Left cannon cracker blast
      setTimeout(() => {
        confetti({
          particleCount: 90,
          angle: 60,
          spread: 75,
          origin: { x: 0.15, y: 0.7 },
          colors: ['#3b82f6', '#10b981', '#fbbf24', '#f43f5e', '#a855f7']
        });
      }, 250);

      // Blast 3: Right cannon cracker blast
      setTimeout(() => {
        confetti({
          particleCount: 90,
          angle: 120,
          spread: 75,
          origin: { x: 0.85, y: 0.7 },
          colors: ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#3b82f6']
        });
      }, 500);

      // Blast 4: Gold & stars finale blast
      setTimeout(() => {
        confetti({
          particleCount: 110,
          spread: 120,
          origin: { y: 0.45 },
          shapes: ['star', 'circle'],
          scalar: 1.25,
          colors: ['#ffd700', '#ff6b6b', '#48bb78', '#38b2ac', '#9f7aea']
        });
      }, 800);
    } catch (e) {
      console.log('Confetti effect trigger:', e);
    }
  };

  const handlePay = async () => {
    setIsProcessing(true);

    try {
      // If user was not logged in, establish authenticated customer session
      if (!currentUser) {
        login('customer@driveeasy.com', 'user123');
      }

      // Small realistic processing wait
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newBooking = await createBooking({
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleType: `${vehicle.type === 'car' ? 'Car' : 'Bike'} • ${vehicle.transmission} • ${vehicle.fuel} • ${vehicle.seats} Seats`,
        vehicleImage: vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        pickupLocation: vehicle.pickupLocation || 'Anna Nagar, Chennai',
        startDate: searchParams.startDate || '12 Oct 2025',
        startTime: searchParams.startTime || '10:00 AM',
        endDate: searchParams.endDate || '12 Oct 2025',
        endTime: searchParams.endTime || (isHourly ? (hours === 10 ? '08:00 PM' : hours === 6 ? '04:00 PM' : '10:00 PM') : '10:00 AM'),
        rentalMode: isHourly ? 'hourly' : 'daily',
        durationDays: isHourly ? Math.max(1, Math.round(hours / 24)) : days,
        durationHours: hours,
        hours: hours,
        durationText: durationText,
        hourlyRate: vehicle.hourlyPrice || 250,
        dailyRate: vehicle.dailyPrice || 1800,
        basePrice: basePrice,
        multiplier: multiplier,
        locationMultiplierFee: locationMultiplierFee,
        totalAmount: totalAmount,
        walletApplied: walletDeduction,
        paymentMethod: useWalletBalance && remainingAmountToPay > 0
          ? `Wallet (₹${walletDeduction}) + ${paymentMethod.toUpperCase()} (₹${remainingAmountToPay})`
          : useWalletBalance && remainingAmountToPay === 0
          ? 'Digital Wallet'
          : paymentMethod.toUpperCase()
      });

      // Fire crackers blast celebration!
      triggerCrackerBlast();

      const resolvedBooking = newBooking || {
        id: `DRV-${Math.floor(10000 + Math.random() * 90000)}`,
        vehicleName: vehicle.name,
        vehicleType: `${vehicle.type === 'car' ? 'Car' : 'Bike'} • ${vehicle.transmission}`,
        vehicleImage: vehicle.images?.[0],
        totalAmount: totalAmount,
        startDate: searchParams.startDate || '12 Oct 2025',
        startTime: searchParams.startTime || '10:00 AM',
        pickupLocation: vehicle.pickupLocation || 'Anna Nagar, Chennai',
        rentalMode: isHourly ? 'hourly' : 'daily',
        durationHours: hours,
        durationDays: days,
        paymentMethod: paymentMethod.toUpperCase(),
        status: 'Confirmed'
      };

      setConfirmedBooking(resolvedBooking);
      setIsProcessing(false);
      addToast(`Booking confirmed successfully! Booking ID: ${resolvedBooking.id}`);
    } catch (err) {
      console.error('Payment processing failed:', err);
      setIsProcessing(false);
      addToast('Payment processing failed. Please try again.', 'error');
    }
  };

  // Step 3: Order Success & Confirmation Screen
  if (confirmedBooking) {
    const bookingTotal = Number(confirmedBooking?.totalAmount ?? totalAmount ?? 0);

    return (
      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 72px)', padding: '40px 0 60px' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          {/* Stepper (All 3 Completed) */}
          <div className="stepper-bar">
            <div className="step-node completed">
              <div className="step-circle"><Check size={16} /></div>
              <div className="step-label">Details</div>
            </div>
            <div className="step-divider active" />
            <div className="step-node completed">
              <div className="step-circle"><Check size={16} /></div>
              <div className="step-label">Payment</div>
            </div>
            <div className="step-divider active" />
            <div className="step-node active">
              <div className="step-circle"><Check size={16} /></div>
              <div className="step-label">Confirmed</div>
            </div>
          </div>

          {/* Success Card */}
          <div
            className="card"
            style={{
              padding: '36px 32px',
              border: '1px solid #bbf7d0',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
              borderRadius: '20px',
              background: '#ffffff',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top decorative accent gradient bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)'
              }}
            />

            {/* Success Icon & Heading */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                  border: '3px solid #a7f3d0',
                  boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.35)',
                  position: 'relative'
                }}
              >
                <CheckCircle2 size={50} strokeWidth={2.4} />
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 14px',
                  borderRadius: '20px',
                  background: '#ecfdf5',
                  color: '#059669',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  border: '1px solid #a7f3d0'
                }}
              >
                <Sparkles size={14} />
                <span>Payment Received & Verified</span>
              </div>

              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Order Placed Successfully! 🎉
              </h2>
              <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.5 }}>
                Your booking is confirmed and secured. The vehicle is reserved for your journey with instant verification.
              </p>
            </div>

            {/* Booking Details Box */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                marginBottom: '26px'
              }}
            >
              {/* Reference ID Header banner */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #e2e8f0',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Booking Reference ID
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span>{confirmedBooking?.id || 'DRV-RESERVED'}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(confirmedBooking?.id || '')}
                      title="Copy Booking ID"
                      style={{
                        background: isCopied ? '#dcfce7' : '#e0e7ff',
                        color: isCopied ? '#166534' : 'var(--primary)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isCopied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Confirmed & Active</span>
                </div>
              </div>

              {/* Vehicle Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 14px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #edf2f7',
                  marginBottom: '16px'
                }}
              >
                <img
                  src={confirmedBooking?.vehicleImage || vehicle.images[0]}
                  alt={confirmedBooking?.vehicleName || vehicle.name}
                  style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    {confirmedBooking?.vehicleName || vehicle.name}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                    {confirmedBooking?.vehicleType || `${vehicle.type === 'car' ? 'Car' : 'Bike'} • ${vehicle.transmission} • ${vehicle.fuel}`}
                  </div>
                </div>
              </div>

              {/* Key Spec Lines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#64748b" />
                    <span>Pickup Schedule</span>
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>
                    {confirmedBooking?.startDate || '12 Oct 2025'} &bull; {confirmedBooking?.startTime || '10:00 AM'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#64748b" />
                    <span>Rental Duration</span>
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--primary)' }}>
                    {confirmedBooking?.rentalMode === 'hourly'
                      ? `${confirmedBooking?.durationHours || confirmedBooking?.hours || 6} Hours (${confirmedBooking?.startTime || '10:00 AM'} - ${confirmedBooking?.endTime || '04:00 PM'})`
                      : `${confirmedBooking?.durationDays || 1} Day(s)`}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#64748b" />
                    <span>Pickup Hub</span>
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b', textAlign: 'right' }}>
                    {confirmedBooking?.pickupLocation || vehicle.pickupLocation || 'Anna Nagar, Chennai'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wallet size={14} color="#64748b" />
                    <span>Payment Mode</span>
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    {confirmedBooking?.paymentMethod || 'Online Payment'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e2e8f0', marginTop: '4px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    Total Amount Paid
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#059669' }}>
                    ₹ {bookingTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Instruction banner */}
            <div
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '26px',
                fontSize: '13px',
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textAlign: 'left'
              }}
            >
              <ShieldCheck size={20} color="#2563eb" style={{ flexShrink: 0 }} />
              <div>
                <strong>Pickup Verification:</strong> Please carry your original driving license and show your booking ID at the pickup hub.
              </div>
            </div>

            {/* Main Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
              {/* PRIMARY DONE BUTTON: Returns to Home */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveView('home')}
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  padding: '15px 28px',
                  fontSize: '16px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <Home size={19} />
                <span>Done (Return to Home)</span>
              </button>

              {/* Secondary Navigation Row */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActiveView('dashboard', 'bookings')}
                  style={{
                    padding: '11px 18px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CalendarCheck size={16} />
                  <span>View in My Bookings</span>
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setActiveReceipt(confirmedBooking);
                    setIsReceiptOpen(true);
                  }}
                  style={{
                    padding: '11px 18px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FileText size={16} />
                  <span>View / Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 72px)', padding: '24px 0 60px' }}>
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Stepper (Mockup #5 Top) */}
        <div className="stepper-bar">
          <div className="step-node completed" onClick={() => setActiveView('checkout')}>
            <div className="step-circle"><Check size={16} /></div>
            <div className="step-label">Details</div>
          </div>
          <div className="step-divider active" />
          <div className="step-node active">
            <div className="step-circle">2</div>
            <div className="step-label">Payment</div>
          </div>
          <div className="step-divider" />
          <div className="step-node">
            <div className="step-circle">3</div>
            <div className="step-label">Confirmation</div>
          </div>
        </div>

        {/* Two Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'start' }}>
          {/* Left Column: Choose Payment Method (Mockup #5 Left) */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
              Choose Payment Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Option 1: Wallet Balance */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '12px',
                  border: paymentMethod === 'wallet' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                  backgroundColor: paymentMethod === 'wallet' ? '#f0f7ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                onClick={() => setPaymentMethod('wallet')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Wallet size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Wallet Balance</div>
                    <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                      Available balance: <strong>₹ {walletBalance.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'wallet'}
                  onChange={() => setPaymentMethod('wallet')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              {/* Option 2: UPI */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '12px',
                  border: paymentMethod === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                  backgroundColor: paymentMethod === 'upi' ? 'var(--primary-light)' : '#ffffff',
                  cursor: 'pointer'
                }}
                onClick={() => setPaymentMethod('upi')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Smartphone size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>UPI</div>
                    <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                      Pay using UPI ID, QR or apps (GPay, PhonePe, Paytm)
                    </div>
                  </div>
                </div>

                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              {/* Option 3: Credit / Debit Card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '12px',
                  border: paymentMethod === 'card' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                  backgroundColor: paymentMethod === 'card' ? 'var(--primary-light)' : '#ffffff',
                  cursor: 'pointer'
                }}
                onClick={() => setPaymentMethod('card')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <CreditCard size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Credit / Debit Card</div>
                    <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                      Visa, Mastercard, RuPay
                    </div>
                  </div>
                </div>

                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              {/* Option 4: Net Banking */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '12px',
                  border: paymentMethod === 'netbanking' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                  backgroundColor: paymentMethod === 'netbanking' ? 'var(--primary-light)' : '#ffffff',
                  cursor: 'pointer'
                }}
                onClick={() => setPaymentMethod('netbanking')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Building size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Net Banking</div>
                    <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                      All major Indian banks
                    </div>
                  </div>
                </div>

                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'netbanking'}
                  onChange={() => setPaymentMethod('netbanking')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#64748b', marginTop: '24px' }}>
              <ShieldCheck size={18} color="#10b981" />
              <span>Payments are protected with RBI approved 256-bit encryption</span>
            </div>
          </div>

          {/* Right Column: Payment Summary (Mockup #5 Right) */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
              Payment Summary
            </h3>

            {/* Vehicle preview */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                paddingBottom: '16px',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '16px'
              }}
            >
              <img
                src={vehicle.images[0]}
                alt={vehicle.name}
                style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '14.5px', color: '#0f172a' }}>
                  {vehicle.name}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {isHourly
                    ? `${hours} Hours (${searchParams.startTime || '10:00 AM'} - ${searchParams.endTime || '04:00 PM'})`
                    : `${days} Day(s) (${searchParams.startDate || '12 Oct'} - ${searchParams.endDate || '13 Oct'})`}
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                ₹ {basePrice.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Price lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Location Multiplier ({multiplier}x)</span>
                <span>₹ {locationMultiplierFee.toLocaleString('en-IN')}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid #e2e8f0',
                  fontWeight: 800,
                  fontSize: '16px',
                  color: '#0f172a'
                }}
              >
                <span>Total Amount</span>
                <span>₹ {totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Use Wallet Balance Toggle (Mockup #5 exact feature) */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '16px',
                marginBottom: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                  Use Wallet Balance
                </div>
                {/* Switch toggle */}
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={useWalletBalance}
                    onChange={(e) => setUseWalletBalance(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: useWalletBalance ? 'var(--primary)' : '#cbd5e1',
                      borderRadius: '24px',
                      transition: '0.2s'
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        height: '18px',
                        width: '18px',
                        left: useWalletBalance ? '22px' : '3px',
                        bottom: '3px',
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        transition: '0.2s'
                      }}
                    />
                  </span>
                </label>
              </div>

              <div style={{ fontSize: '13.5px', color: 'var(--primary)', fontWeight: 600 }}>
                ₹ {walletBalance.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {useWalletBalance
                  ? remainingAmountToPay > 0
                    ? `₹ ${walletDeduction.toLocaleString('en-IN')} will be deducted from wallet. Remaining to pay: ₹ ${remainingAmountToPay.toLocaleString('en-IN')}`
                    : `Full payment covered by wallet. Balance after payment: ₹ ${(walletBalance - totalAmount).toLocaleString('en-IN')}`
                  : 'Wallet balance not applied'}
              </div>
            </div>

            {/* Pay Button */}
            <button
              className="btn btn-primary btn-block btn-lg"
              disabled={isProcessing}
              onClick={handlePay}
            >
              {isProcessing ? (
                <span>Processing Secure Payment...</span>
              ) : remainingAmountToPay > 0 ? (
                <span>Pay ₹ {remainingAmountToPay.toLocaleString('en-IN')}</span>
              ) : (
                <span>Pay ₹ {totalAmount.toLocaleString('en-IN')} with Wallet</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
