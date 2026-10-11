import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Car,
  Bike,
  ArrowRight,
  Star,
  CalendarDays,
  FileCheck,
  Layers,
  ChevronRight,
  Bookmark
} from 'lucide-react';

export default function HomePage() {
  const {
    vehicles,
    setSelectedVehicle,
    setActiveView,
    searchParams,
    setSearchParams,
    pricingZones,
    currentUser,
    isVehicleSaved,
    toggleSaveVehicle
  } = useApp();

  // Search Bar State
  const [vehicleTypeTab, setVehicleTypeTab] = useState(searchParams.vehicleType || 'all');
  const [rentalMode, setRentalMode] = useState(searchParams.rentalMode || 'hourly');
  const [selectedHours, setSelectedHours] = useState(searchParams.hours || 6);
  const [selectedDays, setSelectedDays] = useState(searchParams.durationDays || 1);

  const [location, setLocation] = useState(searchParams.location || 'Anna Nagar, Chennai');
  const [zoneId, setZoneId] = useState(searchParams.zoneId || 'zone-anna-nagar');
  const [startDate, setStartDate] = useState('12 Oct 2025');
  const [startTime, setStartTime] = useState('10:00 AM');

  const calculateReturnTime = (time, hours) => {
    if (hours === 6) return '04:00 PM';
    if (hours === 10) return '08:00 PM';
    if (hours === 12) return '10:00 PM';
    return '10:00 AM';
  };

  const [endTime, setEndTime] = useState(calculateReturnTime('10:00 AM', 6));
  const [endDate, setEndDate] = useState('12 Oct 2025');

  // Popular Vehicles category tab filter on homepage
  const [featuredTab, setFeaturedTab] = useState('all');

  const handleSelectHours = (hrs) => {
    setSelectedHours(hrs);
    setEndDate(hrs >= 24 ? '13 Oct 2025' : '12 Oct 2025');
    setEndTime(calculateReturnTime(startTime, hrs));
  };

  const handleSelectDays = (days) => {
    setSelectedDays(days);
    const dayNum = 12 + days;
    setEndDate(`${dayNum} Oct 2025`);
    setEndTime(startTime);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setSearchParams({
      location,
      zoneId,
      startDate,
      startTime,
      endDate,
      endTime,
      rentalMode,
      hours: selectedHours,
      durationDays: selectedDays,
      vehicleType: vehicleTypeTab
    });
    setActiveView('listings');
  };

  const navigateCategory = (typeFilter) => {
    setSearchParams(prev => ({ ...prev, vehicleType: typeFilter }));
    setActiveView('listings');
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
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
    setActiveView('details');
  };

  const handleListVehicle = () => {
    if (!currentUser) {
      setActiveView('sign-in');
    } else if (currentUser.role === 'owner') {
      setActiveView('add-vehicle');
    } else {
      setActiveView('owner-dashboard');
    }
  };

  // Filter featured vehicles (curated real items from Supabase fleet)
  const displayedFeaturedVehicles = useMemo(() => {
    let list = vehicles;
    if (featuredTab === 'car') list = list.filter(v => v.type === 'car');
    if (featuredTab === 'bike') list = list.filter(v => v.type === 'bike');
    return list.slice(0, 6);
  }, [vehicles, featuredTab]);

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      
      {/* SECTION 2: HERO — FIND YOUR NEXT RIDE */}
      <section
        style={{
          padding: '64px 0 48px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-light)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '48px',
              alignItems: 'center',
              marginBottom: '44px'
            }}
          >
            {/* Hero Left Content */}
            <div style={{ maxWidth: '580px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  marginBottom: '20px'
                }}
              >
                <span>Automotive Rental Marketplace</span>
              </div>

              <h1
                style={{
                  fontSize: '44px',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-1px',
                  color: 'var(--text-primary)',
                  marginBottom: '16px'
                }}
              >
                The Right Ride for Every Journey.
              </h1>

              <p
                style={{
                  fontSize: '17px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '28px'
                }}
              >
                Discover cars and bikes for your next trip. Choose your location, find the right vehicle, and manage your rentals in one place.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveView('sign-up')}
                  style={{
                    padding: '12px 26px',
                    fontSize: '14.5px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    const el = document.getElementById('vehicle-categories') || document.getElementById('vehicle-search');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    padding: '12px 22px',
                    fontSize: '14.5px',
                    fontWeight: 600,
                    borderRadius: '8px'
                  }}
                >
                  Explore the Experience
                </button>
              </div>
            </div>

            {/* Hero Right: Natural Automotive Photography */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-md)',
                  aspectRatio: '16/10',
                  backgroundColor: 'var(--bg-subtle)'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85"
                  alt="Premium modern car parked in a scenic natural environment"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>
          </div>

          {/* FUNCTIONAL VEHICLE SEARCH INTERFACE */}
          <div
            id="vehicle-search"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-md)',
              padding: '24px 28px'
            }}
          >
            {/* Search Toolbar: Vehicle Type Tabs & Rental Mode Toggle */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '16px',
                marginBottom: '18px',
                borderBottom: '1px solid var(--border-light)',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              {/* Vehicle Type Tabs: All, Cars, Bikes */}
              <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-main)', padding: '4px', borderRadius: '8px' }}>
                <button
                  type="button"
                  onClick={() => setVehicleTypeTab('all')}
                  style={{
                    border: 'none',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: vehicleTypeTab === 'all' ? '#FFFFFF' : 'transparent',
                    color: vehicleTypeTab === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
                    boxShadow: vehicleTypeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  All Vehicles
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleTypeTab('car')}
                  style={{
                    border: 'none',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: vehicleTypeTab === 'car' ? '#FFFFFF' : 'transparent',
                    color: vehicleTypeTab === 'car' ? 'var(--primary)' : 'var(--text-secondary)',
                    boxShadow: vehicleTypeTab === 'car' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  Cars
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleTypeTab('bike')}
                  style={{
                    border: 'none',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: vehicleTypeTab === 'bike' ? '#FFFFFF' : 'transparent',
                    color: vehicleTypeTab === 'bike' ? 'var(--primary)' : 'var(--text-secondary)',
                    boxShadow: vehicleTypeTab === 'bike' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  Bikes
                </button>
              </div>

              {/* Mode Switcher: Hourly vs Daily */}
              <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-main)', padding: '4px', borderRadius: '8px' }}>
                <button
                  type="button"
                  onClick={() => setRentalMode('hourly')}
                  style={{
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: rentalMode === 'hourly' ? 'var(--text-primary)' : 'transparent',
                    color: rentalMode === 'hourly' ? '#FFFFFF' : 'var(--text-secondary)'
                  }}
                >
                  Hourly Rental
                </button>
                <button
                  type="button"
                  onClick={() => setRentalMode('daily')}
                  style={{
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: rentalMode === 'daily' ? 'var(--text-primary)' : 'transparent',
                    color: rentalMode === 'daily' ? '#FFFFFF' : 'var(--text-secondary)'
                  }}
                >
                  Daily Rental
                </button>
              </div>
            </div>

            {/* Quick Presets row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Duration Presets:</span>
              {rentalMode === 'hourly' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSelectHours(6)}
                    style={{
                      border: selectedHours === 6 ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                      backgroundColor: selectedHours === 6 ? 'var(--primary-light)' : '#FFFFFF',
                      color: selectedHours === 6 ? 'var(--primary)' : 'var(--text-secondary)',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    6 Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectHours(10)}
                    style={{
                      border: selectedHours === 10 ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                      backgroundColor: selectedHours === 10 ? 'var(--primary-light)' : '#FFFFFF',
                      color: selectedHours === 10 ? 'var(--primary)' : 'var(--text-secondary)',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    10 Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectHours(12)}
                    style={{
                      border: selectedHours === 12 ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                      backgroundColor: selectedHours === 12 ? 'var(--primary-light)' : '#FFFFFF',
                      color: selectedHours === 12 ? 'var(--primary)' : 'var(--text-secondary)',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    12 Hours
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleSelectDays(1)}
                    style={{
                      border: selectedDays === 1 ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                      backgroundColor: selectedDays === 1 ? 'var(--primary-light)' : '#FFFFFF',
                      color: selectedDays === 1 ? 'var(--primary)' : 'var(--text-secondary)',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    1 Day
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDays(2)}
                    style={{
                      border: selectedDays === 2 ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                      backgroundColor: selectedDays === 2 ? 'var(--primary-light)' : '#FFFFFF',
                      color: selectedDays === 2 ? 'var(--primary)' : 'var(--text-secondary)',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    2 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDays(3)}
                    style={{
                      border: selectedDays === 3 ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                      backgroundColor: selectedDays === 3 ? 'var(--primary-light)' : '#FFFFFF',
                      color: selectedDays === 3 ? 'var(--primary)' : 'var(--text-secondary)',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    3 Days
                  </button>
                </>
              )}
            </div>

            {/* Main Search Inputs Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                alignItems: 'end'
              }}
            >
              {/* Field 1: Pickup Location */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                  <MapPin size={13} color="var(--primary)" />
                  <span>Pickup Location</span>
                </label>
                <select
                  value={zoneId}
                  onChange={(e) => {
                    setZoneId(e.target.value);
                    const selected = pricingZones.find(z => z.id === e.target.value);
                    if (selected) setLocation(selected.name);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {pricingZones.map(zone => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2: Pickup Date & Time */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                  <Calendar size={13} color="var(--primary)" />
                  <span>Pickup Date & Time</span>
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      width: '60%',
                      padding: '10px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      if (rentalMode === 'hourly') {
                        setEndTime(calculateReturnTime(e.target.value, selectedHours));
                      }
                    }}
                    style={{
                      width: '40%',
                      padding: '10px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Field 3: Return Date & Time */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                  <Clock size={13} color="var(--primary)" />
                  <span>Return Date & Time</span>
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      width: '60%',
                      padding: '10px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{
                      width: '40%',
                      padding: '10px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Action: Search Availability Button */}
              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSearch}
                  style={{
                    width: '100%',
                    padding: '11px 18px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Search size={16} />
                  <span>Search Availability</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: QUICK VEHICLE CATEGORIES */}
      <section id="vehicle-categories" style={{ padding: '64px 0 32px' }}>
        <div className="container">
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              Find the Ride That Fits Your Plans.
            </h2>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Browse curated vehicle types tailored to city commuting, weekend family road trips, or solo exploration.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px'
            }}
          >
            {/* Category 1: Everyday Cars */}
            <div
              onClick={() => navigateCategory('car')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              className="card-hover"
            >
              <div style={{ height: '140px', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80"
                  alt="Everyday Cars"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '16px 18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Everyday Cars
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Nimble hatchbacks and sedans for easy city errands & parking.
                </p>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Explore Everyday Cars</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>

            {/* Category 2: Premium Cars */}
            <div
              onClick={() => navigateCategory('car')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              className="card-hover"
            >
              <div style={{ height: '140px', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"
                  alt="Premium Cars"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '16px 18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Premium Cars
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Executive sedans and high-grade cruisers with elevated comfort.
                </p>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Explore Premium Cars</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>

            {/* Category 3: SUVs */}
            <div
              onClick={() => navigateCategory('car')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              className="card-hover"
            >
              <div style={{ height: '140px', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
                  alt="SUVs"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '16px 18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  SUVs
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Spacious 6-7 seaters built for family vacations and group trips.
                </p>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Explore SUVs</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>

            {/* Category 4: Motorcycles */}
            <div
              onClick={() => navigateCategory('bike')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              className="card-hover"
            >
              <div style={{ height: '140px', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
                  alt="Motorcycles"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '16px 18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Motorcycles
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Cruisers and economic scooters for nimble two-wheel commuting.
                </p>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Explore Motorcycles</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURED VEHICLES */}
      <section id="featured-vehicles" style={{ padding: '56px 0 64px' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '28px',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                Explore Your Next Ride.
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Discover the vehicles available for your next journey.
              </p>
            </div>

            {/* Tab toggles: All, Cars, Bikes */}
            <div style={{ display: 'flex', gap: '6px', backgroundColor: '#FFFFFF', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <button
                type="button"
                onClick={() => setFeaturedTab('all')}
                style={{
                  border: 'none',
                  background: featuredTab === 'all' ? 'var(--primary)' : 'transparent',
                  color: featuredTab === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                All Rides
              </button>
              <button
                type="button"
                onClick={() => setFeaturedTab('car')}
                style={{
                  border: 'none',
                  background: featuredTab === 'car' ? 'var(--primary)' : 'transparent',
                  color: featuredTab === 'car' ? '#FFFFFF' : 'var(--text-secondary)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cars Only
              </button>
              <button
                type="button"
                onClick={() => setFeaturedTab('bike')}
                style={{
                  border: 'none',
                  background: featuredTab === 'bike' ? 'var(--primary)' : 'transparent',
                  color: featuredTab === 'bike' ? '#FFFFFF' : 'var(--text-secondary)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Bikes Only
              </button>
            </div>
          </div>

          {/* Grid of Vehicles */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
              marginBottom: '36px'
            }}
          >
            {displayedFeaturedVehicles.map(vehicle => {
              const saved = isVehicleSaved(vehicle.id);
              return (
                <div
                  key={vehicle.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  className="card-hover"
                >
                  {/* Vehicle Image */}
                  <div style={{ position: 'relative', height: '190px', backgroundColor: 'var(--bg-subtle)' }}>
                    <img
                      src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
                      alt={vehicle.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#FFFFFF',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.4px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      {vehicle.type === 'car' ? 'Car' : 'Motorcycle'}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveVehicle(vehicle.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: '#FFFFFF',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: saved ? 'var(--primary)' : 'var(--text-muted)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
                      }}
                      title={saved ? 'Remove from saved' : 'Save vehicle'}
                    >
                      <Bookmark size={15} fill={saved ? 'var(--primary)' : 'none'} />
                    </button>
                  </div>

                  {/* Vehicle Information */}
                  <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {vehicle.name}
                      </h3>
                      {vehicle.reviewsCount > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          <Star size={13} fill="#f59e0b" color="#f59e0b" />
                          <span>{vehicle.rating}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({vehicle.reviewsCount})</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      <MapPin size={12} color="var(--primary)" />
                      <span>{vehicle.pickupLocation || 'Anna Nagar, Chennai'}</span>
                    </div>

                    {/* Spec Badges: Transmission, Fuel, Seats */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      <span style={{ fontSize: '11.5px', backgroundColor: 'var(--bg-main)', padding: '3px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                        {vehicle.transmission || 'Manual'}
                      </span>
                      <span style={{ fontSize: '11.5px', backgroundColor: 'var(--bg-main)', padding: '3px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                        {vehicle.fuel || 'Petrol'}
                      </span>
                      {vehicle.type === 'car' && (
                        <span style={{ fontSize: '11.5px', backgroundColor: 'var(--bg-main)', padding: '3px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                          {vehicle.seats || 5} Seats
                        </span>
                      )}
                    </div>

                    {/* Pricing & Booking Action */}
                    <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--primary)' }}>
                          ₹ {vehicle.hourlyPrice}
                          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>/hr</span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          ₹ {vehicle.dailyPrice?.toLocaleString('en-IN')}/day
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleSelectVehicle(vehicle)}
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSelectVehicle(vehicle)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Vehicles CTA */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchParams(prev => ({ ...prev, vehicleType: 'all' }));
                setActiveView('listings');
              }}
              style={{
                padding: '12px 28px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>View All Vehicles ({vehicles.length})</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section
        id="how-it-works"
        style={{
          padding: '64px 0',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)'
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 44px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '12px'
              }}
            >
              <span>Simple Booking Journey</span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              Your Next Ride in Three Simple Steps.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px'
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                backgroundColor: 'var(--bg-main)',
                borderRadius: '12px',
                padding: '28px 24px',
                border: '1px solid var(--border-light)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '15px',
                  marginBottom: '18px'
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Discover
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Explore available cars and bikes for your journey.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                backgroundColor: 'var(--bg-main)',
                borderRadius: '12px',
                padding: '28px 24px',
                border: '1px solid var(--border-light)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '15px',
                  marginBottom: '18px'
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Choose
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Select a vehicle, review its details, and choose your rental dates.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                backgroundColor: 'var(--bg-main)',
                borderRadius: '12px',
                padding: '28px 24px',
                border: '1px solid var(--border-light)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '15px',
                  marginBottom: '18px'
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Book
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Complete your booking and manage your trip from your personal dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY CHOOSE OUR PLATFORM? */}
      <section id="why-choose-us" style={{ padding: '64px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              A Better Way to Get Around.
            </h2>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
              A dependable marketplace built on clarity, flexibility, and straightforward vehicle access.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px'
            }}
          >
            {/* Benefit 1 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Clock size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Flexible Rentals
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Choose hourly or daily options where supported to match quick errands or full day trips.
              </p>
            </div>

            {/* Benefit 2 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <MapPin size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Easy Discovery
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Find vehicles that fit your requirements across key neighborhood hubs.
              </p>
            </div>

            {/* Benefit 3 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <FileCheck size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Transparent Pricing
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Review applicable charges before confirming with zero surprise fees.
              </p>
            </div>

            {/* Benefit 4 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <CalendarDays size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Simple Booking Management
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Access bookings and manage your trip details directly from your dashboard.
              </p>
            </div>

            {/* Benefit 5 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Layers size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Convenient Account Access
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Keep your rental information and trip history neatly organized in one place.
              </p>
            </div>

            {/* Benefit 6 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Bookmark size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Owner Opportunities
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Allow owners to list and manage vehicles if the owner portal is available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: BECOME A VEHICLE OWNER */}
      <section
        id="owner-section"
        style={{
          padding: '64px 0',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '44px',
              alignItems: 'center'
            }}
          >
            {/* Split layout: Editorial Photograph */}
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                aspectRatio: '16/10',
                backgroundColor: 'var(--bg-subtle)'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80"
                alt="Vehicle owner handing keys over"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Split layout: Copy & Actions */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '14px'
                }}
              >
                <span>Host Ecosystem</span>
              </div>

              <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: '14px' }}>
                Turn Your Vehicle into an Opportunity.
              </h2>

              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                List your vehicle, manage availability, set rental prices, and connect with people looking for their next ride.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleListVehicle}
                  style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 700, borderRadius: '8px' }}
                >
                  List Your Vehicle
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('how-it-works')}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Learn How It Works
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FINAL CALL TO ACTION */}
      <section style={{ padding: '72px 0 80px', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
              padding: '52px 32px',
              textAlign: 'center',
              maxWidth: '720px',
              margin: '0 auto',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: '10px' }}>
              Your Next Journey Starts Here.
            </h2>

            <p style={{ fontSize: '15.5px', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 28px', lineHeight: 1.5 }}>
              Find the right car or bike for your plans and manage your rentals from one convenient place.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveView('sign-up')}
                style={{
                  padding: '13px 28px',
                  fontSize: '15px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Create Your Account</span>
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveView('sign-in')}
                style={{
                  padding: '13px 24px',
                  fontSize: '15px',
                  fontWeight: 600,
                  borderRadius: '8px'
                }}
              >
                Already Have an Account? Sign In
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
