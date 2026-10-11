import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LeafletMap from '../components/LeafletMap';
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  Car,
  Wind,
  Navigation,
  Bluetooth,
  Video,
  ShieldCheck,
  CheckCircle,
  Share2,
  Heart,
  User,
  ArrowLeft,
  Timer,
  Zap,
  Gauge,
  Fuel,
  Users,
  Settings
} from 'lucide-react';

export default function VehicleDetails() {
  const {
    selectedVehicle,
    setActiveView,
    searchParams,
    setSearchParams,
    pricingZones
  } = useApp();

  const vehicle = selectedVehicle || {
    id: 'v-1',
    name: 'Toyota Innova Crysta',
    type: 'car',
    brand: 'Toyota',
    model: 'Innova Crysta 2.4 VX',
    year: 2024,
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: 7,
    dailyPrice: 1800,
    hourlyPrice: 250,
    rating: 4.8,
    reviewsCount: 120,
    mileage: '13.5 km/l',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
    ],
    pickupLocation: 'Anna Nagar, Chennai',
    distance: '2.5 km',
    description: 'Spacious and comfortable 7-seater SUV perfect for family trips and long drives. Comes with all essential features and well-maintained by certified service team.',
    ownerName: 'Ravi Kumar',
    ownerRating: 4.7,
    ownerReviews: 50
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Rental Mode: 'hourly' vs 'daily'
  const [rentalMode, setRentalMode] = useState(searchParams.rentalMode || 'hourly');
  const [selectedHours, setSelectedHours] = useState(searchParams.hours || 6);
  const [selectedDays, setSelectedDays] = useState(searchParams.durationDays || 1);

  const [startDate, setStartDate] = useState(searchParams.startDate || '12 Oct 2025');
  const [startTime, setStartTime] = useState(searchParams.startTime || '10:00 AM');

  const calculateReturnTime = (startT, hours) => {
    if (hours === 6) return '04:00 PM';
    if (hours === 10) return '08:00 PM';
    if (hours === 12) return '10:00 PM';
    return '10:00 AM';
  };

  const [endDate, setEndDate] = useState(rentalMode === 'hourly' ? '12 Oct 2025' : '13 Oct 2025');
  const [endTime, setEndTime] = useState(rentalMode === 'hourly' ? calculateReturnTime('10:00 AM', selectedHours) : '10:00 AM');

  // Handle Hour Selection (e.g. 6 hours, 10 hours)
  const handleSelectHours = (hrs) => {
    setSelectedHours(hrs);
    setEndDate(hrs >= 24 ? '13 Oct 2025' : '12 Oct 2025');
    setEndTime(calculateReturnTime(startTime, hrs));
  };

  // Handle Day Selection
  const handleSelectDays = (days) => {
    setSelectedDays(days);
    const dayNum = 12 + days;
    setEndDate(`${dayNum} Oct 2025`);
    setEndTime(startTime);
  };

  // Price calculations
  const basePrice = rentalMode === 'hourly'
    ? vehicle.hourlyPrice * selectedHours
    : vehicle.dailyPrice * selectedDays;

  const handleProceedToCheckout = () => {
    setSearchParams(prev => ({
      ...prev,
      rentalMode,
      hours: selectedHours,
      durationDays: selectedDays,
      startDate,
      startTime,
      endDate,
      endTime
    }));
    setActiveView('checkout');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 72px)', padding: '24px 0 60px' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setActiveView('listings')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: 'none',
              color: 'var(--text-muted)',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Vehicle Listings</span>
          </button>
        </div>

        {/* Top Header Row with Name & Rate */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              {vehicle.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '14px', fontWeight: 700 }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span>{vehicle.rating}</span>
                <span style={{ color: '#64748b', fontWeight: 500 }}>({vehicle.reviewsCount} reviews)</span>
              </div>
              <span style={{ color: '#cbd5e1' }}>&bull;</span>
              <div style={{ fontSize: '13.5px', color: '#475569' }}>
                {vehicle.type === 'car' ? 'Car' : 'Bike'} &bull; {vehicle.transmission} &bull; {vehicle.fuel} &bull; {vehicle.seats} Seats
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary)' }}>
              ₹ {vehicle.hourlyPrice}
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}> / hour</span>
              <span style={{ fontSize: '18px', color: '#cbd5e1', margin: '0 8px' }}>|</span>
              ₹ {vehicle.dailyPrice.toLocaleString('en-IN')}
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}> / day</span>
            </div>
            <div style={{ fontSize: '12.5px', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
              ✓ Transparent location-based pricing applied
            </div>
          </div>
        </div>

        {/* Main Grid: Left Gallery & Content, Right Booking Widget */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Left Column */}
          <div>
            {/* Gallery Main Photo */}
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                height: '380px',
                backgroundColor: '#e2e8f0',
                marginBottom: '14px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <img
                src={vehicle.images[activeImageIndex] || vehicle.images[0]}
                alt={vehicle.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnail Carousel */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
              {vehicle.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: '96px',
                    height: '64px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: activeImageIndex === idx ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                    opacity: activeImageIndex === idx ? 1 : 0.7
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>

            {/* Feature Icon Badges Row (Mockup #3) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                marginBottom: '28px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                <Wind size={16} color="var(--primary)" />
                <span>Air Conditioning</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                <Navigation size={16} color="var(--primary)" />
                <span>GPS Navigation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                <Bluetooth size={16} color="var(--primary)" />
                <span>Bluetooth</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                <Video size={16} color="var(--primary)" />
                <span>Reverse Camera</span>
              </div>
            </div>

            {/* Technical Characteristics (Inspired by NEORIDE reference image) */}
            <div className="card" style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                Technical Characteristics & Verified Specifications
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px' }}>
                  <Gauge size={16} color="var(--primary)" />
                  <div>
                    <span style={{ color: '#64748b' }}>Transmission: </span>
                    <strong style={{ color: '#0f172a' }}>{vehicle.transmission}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px' }}>
                  <Fuel size={16} color="var(--primary)" />
                  <div>
                    <span style={{ color: '#64748b' }}>Fuel / Powertrain: </span>
                    <strong style={{ color: '#0f172a' }}>{vehicle.fuel}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px' }}>
                  <Users size={16} color="var(--primary)" />
                  <div>
                    <span style={{ color: '#64748b' }}>Seating Capacity: </span>
                    <strong style={{ color: '#0f172a' }}>{vehicle.seats} Passengers</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px' }}>
                  <Zap size={16} color="var(--primary)" />
                  <div>
                    <span style={{ color: '#64748b' }}>Fuel Efficiency: </span>
                    <strong style={{ color: '#0f172a' }}>{vehicle.mileage || '14.2 km/l'}</strong>
                  </div>
                </div>
              </div>

              {/* Rental Requirements */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Rental Requirements:
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12.5px', color: '#475569' }}>
                  <span>✓ Valid Driving Licence (Age 21+)</span>
                  <span>✓ Zero Security Deposit Option</span>
                  <span>✓ Free cancellation up to 24h prior</span>
                </div>
              </div>
            </div>

            {/* Pickup Location & Interactive Map Card */}
            <div className="card" style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Pickup Location
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    {vehicle.pickupLocation || 'Anna Nagar, Chennai'} ({vehicle.distance || '2.5 km'})
                  </div>
                </div>
                <span className="badge badge-verified">Verified Station</span>
              </div>

              {/* Interactive OpenStreetMap */}
              <LeafletMap center={vehicle.coordinates || [13.0850, 80.2101]} height="200px" title={vehicle.name} />
            </div>

            {/* Vehicle Description */}
            <div className="card" style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '10px', color: '#0f172a' }}>
                Vehicle Description
              </h3>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
                {vehicle.description}
              </p>
            </div>

            {/* Owner & Verified Reviews Section (Mockup #3 bottom) */}
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>
                Reviews & Ratings
              </h3>

              <div
                style={{
                  display: 'flex',
                  gap: '14px',
                  backgroundColor: '#f8fafc',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                  alt="Reviewer"
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                      Rani Kumar
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f59e0b', fontSize: '12.5px', fontWeight: 700 }}>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      <span>4.7 (50)</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginBottom: '6px' }}>
                    Great car and smooth booking experience. Highly recommended!
                  </p>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                    12 Oct 2025 &bull; Verified Rental
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget with Explicit Hourly / Daily Selector */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div
              className="card"
              style={{
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-light)'
              }}
            >
              {/* Header with Mode Toggle Tabs */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Select Rental Duration Mode
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setRentalMode('hourly');
                      setEndTime(calculateReturnTime(startTime, selectedHours));
                    }}
                    style={{
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      backgroundColor: rentalMode === 'hourly' ? 'var(--primary)' : 'transparent',
                      color: rentalMode === 'hourly' ? '#ffffff' : 'var(--text-secondary)'
                    }}
                  >
                    <Timer size={15} />
                    <span>Hourly</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRentalMode('daily');
                      setEndDate('13 Oct 2025');
                      setEndTime(startTime);
                    }}
                    style={{
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      backgroundColor: rentalMode === 'daily' ? 'var(--primary)' : 'transparent',
                      color: rentalMode === 'daily' ? '#ffffff' : 'var(--text-secondary)'
                    }}
                  >
                    <Calendar size={15} />
                    <span>Daily</span>
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons (6 Hours, 10 Hours, 12 Hours, etc.) */}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontSize: '13px' }}>
                  {rentalMode === 'hourly' ? 'Choose Rental Hours:' : 'Choose Rental Days:'}
                </label>

                {rentalMode === 'hourly' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectHours(6)}
                      style={{
                        border: selectedHours === 6 ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                        backgroundColor: selectedHours === 6 ? 'var(--primary-light)' : '#ffffff',
                        color: selectedHours === 6 ? 'var(--primary)' : 'var(--text-secondary)',
                        padding: '10px 4px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      <div>6 Hours</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>Quick Trip</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectHours(10)}
                      style={{
                        border: selectedHours === 10 ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                        backgroundColor: selectedHours === 10 ? 'var(--primary-light)' : '#ffffff',
                        color: selectedHours === 10 ? 'var(--primary)' : 'var(--text-secondary)',
                        padding: '10px 4px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      <div>10 Hours</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>Full Day</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectHours(12)}
                      style={{
                        border: selectedHours === 12 ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                        backgroundColor: selectedHours === 12 ? 'var(--primary-light)' : '#ffffff',
                        color: selectedHours === 12 ? 'var(--primary)' : 'var(--text-secondary)',
                        padding: '10px 4px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      <div>12 Hours</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>Day Outing</div>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectDays(1)}
                      style={{
                        border: selectedDays === 1 ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                        backgroundColor: selectedDays === 1 ? 'var(--primary-light)' : '#ffffff',
                        color: selectedDays === 1 ? 'var(--primary)' : 'var(--text-secondary)',
                        padding: '8px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      1 Day
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectDays(2)}
                      style={{
                        border: selectedDays === 2 ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                        backgroundColor: selectedDays === 2 ? 'var(--primary-light)' : '#ffffff',
                        color: selectedDays === 2 ? 'var(--primary)' : 'var(--text-secondary)',
                        padding: '8px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      2 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectDays(3)}
                      style={{
                        border: selectedDays === 3 ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                        backgroundColor: selectedDays === 3 ? 'var(--primary-light)' : '#ffffff',
                        color: selectedDays === 3 ? 'var(--primary)' : 'var(--text-secondary)',
                        padding: '8px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      3 Days
                    </button>
                  </div>
                )}
              </div>

              {/* Date & Time Selectors */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">Pickup Schedule</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        if (rentalMode === 'hourly') {
                          setEndTime(calculateReturnTime(e.target.value, selectedHours));
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    Return Schedule ({rentalMode === 'hourly' ? `${selectedHours} hrs duration` : `${selectedDays} day(s)`})
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Price Calculation (Itemized for Hourly or Daily) */}
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#64748b', marginBottom: '6px' }}>
                  {rentalMode === 'hourly' ? (
                    <>
                      <span>Base Rental ({selectedHours} hours &times; ₹{vehicle.hourlyPrice}/hr)</span>
                      <span>₹ {basePrice.toLocaleString('en-IN')}</span>
                    </>
                  ) : (
                    <>
                      <span>Base Rental ({selectedDays} day(s) &times; ₹{vehicle.dailyPrice}/day)</span>
                      <span>₹ {basePrice.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '10px',
                    borderTop: '1px solid #e2e8f0'
                  }}
                >
                  <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>Total Price</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹ {basePrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>
                  * Location demand multiplier calculated at checkout
                </div>
              </div>

              {/* CTA Button */}
              <button
                className="btn btn-primary btn-block btn-lg"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>

              {/* Trust Badges */}
              <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} color="#10b981" />
                  <span>Instant Booking &bull; No Waiting for Confirmation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="#10b981" />
                  <span>Free cancellation up to 24h before pickup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
