import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LeafletMap from '../components/LeafletMap';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Info,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Timer
} from 'lucide-react';

export default function BookingCheckout() {
  const {
    selectedVehicle,
    setActiveView,
    searchParams,
    pricingZones,
    currentUser
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
    hourlyPrice: 250,
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'],
    pickupLocation: 'Anna Nagar, Chennai',
    coordinates: [13.0850, 80.2101],
    zoneId: 'zone-anna-nagar'
  };

  // Find active zone
  const activeZone = pricingZones.find(z => z.id === vehicle.zoneId) || pricingZones[0];
  const multiplier = activeZone ? activeZone.multiplier : 1.12;

  // Determine rental mode (Hourly vs Daily)
  const isHourly = searchParams.rentalMode === 'hourly';
  const hours = searchParams.hours || 6;
  const days = searchParams.durationDays || 1;

  const basePrice = isHourly
    ? (vehicle.hourlyPrice || 250) * hours
    : (vehicle.dailyPrice || 1800) * days;

  const locationMultiplierFee = Math.round(basePrice * (multiplier - 1));
  const totalAmount = basePrice + locationMultiplierFee;

  const [driverName, setDriverName] = useState(currentUser?.name || 'Guest Traveler');
  const [driverPhone, setDriverPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [dlNumber, setDlNumber] = useState(currentUser?.dlNumber || 'DL-04202100892');

  const handleContinueToPayment = () => {
    setActiveView('payment');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 72px)', padding: '24px 0 60px' }}>
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Stepper (Mockup #4 Top) */}
        <div className="stepper-bar">
          <div className="step-node active">
            <div className="step-circle">1</div>
            <div className="step-label">Details</div>
          </div>
          <div className="step-divider" />
          <div className="step-node">
            <div className="step-circle">2</div>
            <div className="step-label">Payment</div>
          </div>
          <div className="step-divider" />
          <div className="step-node">
            <div className="step-circle">3</div>
            <div className="step-label">Confirmation</div>
          </div>
        </div>

        {/* Two Column Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'start' }}>
          {/* Left Card: Booking Summary */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
              Booking Summary
            </h3>

            {/* Vehicle Card Header */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                paddingBottom: '20px',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '20px'
              }}
            >
              <img
                src={vehicle.images[0]}
                alt={vehicle.name}
                style={{ width: '110px', height: '80px', objectFit: 'cover', borderRadius: '10px' }}
              />
              <div>
                <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  {vehicle.name}
                </h4>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {vehicle.type === 'car' ? 'Car' : 'Bike'} &bull; {vehicle.transmission} &bull; {vehicle.fuel} &bull; {vehicle.seats} Seats
                </div>
              </div>
            </div>

            {/* Rental Duration Details (Hourly or Daily) */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                Rental Duration & Mode
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isHourly ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} color="var(--primary)" />
                    <span>{hours} Hours ({searchParams.startDate || '12 Oct 2025'}, {searchParams.startTime || '10:00 AM'} - {searchParams.endTime || '04:00 PM'})</span>
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={15} color="var(--primary)" />
                    <span>{days} Day(s) ({searchParams.startDate || '12 Oct 2025'}, {searchParams.startTime || '10:00 AM'} - {searchParams.endDate || '13 Oct 2025'}, {searchParams.endTime || '10:00 AM'})</span>
                  </span>
                )}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>
                  Base Rental ({isHourly ? `${hours} hrs × ₹${vehicle.hourlyPrice}/hr` : `${days} day(s) × ₹${vehicle.dailyPrice}/day`})
                </span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>₹ {basePrice.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Location Multiplier ({multiplier}x demand)</span>
                  <span title="Demand multiplier for selected zone" style={{ cursor: 'pointer' }}>
                    <Info size={14} color="var(--primary)" />
                  </span>
                </span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>+ ₹ {locationMultiplierFee.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Taxes & GST (18%)</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Included</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0',
                  marginTop: '4px'
                }}
              >
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Total Amount</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹ {totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Verified Driver KYC Status */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileCheck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Driving Licence Verified</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>{dlNumber}</div>
                </div>
              </div>
              <span className="badge badge-confirmed">VERIFIED</span>
            </div>
          </div>

          {/* Right Card: Pickup Location & Policy */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
              Pickup Location
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <MapPin size={18} color="var(--primary)" />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                {vehicle.pickupLocation || 'Anna Nagar, Chennai'}
              </span>
            </div>

            {/* Interactive Map */}
            <div style={{ marginBottom: '18px' }}>
              <LeafletMap center={vehicle.coordinates || [13.0850, 80.2101]} height="210px" title={vehicle.pickupLocation} />
            </div>

            {/* Location Pricing Notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12.5px',
                fontWeight: 600,
                marginBottom: '20px'
              }}
            >
              <Info size={16} />
              <span>Location-based demand pricing applied ({activeZone.description})</span>
            </div>

            {/* Cancellation Policy */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                Cancellation Policy
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                Free cancellation up to 24 hours before pickup. 100% of rental amount will be credited back to your DriveEasy wallet.
              </p>
            </div>

            {/* CTA Button */}
            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={handleContinueToPayment}
            >
              <span>Continue to Payment</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
