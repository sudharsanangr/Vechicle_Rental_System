import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Star,
  Heart,
  Car,
  Bike,
  ShieldCheck,
  Plane,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Timer
} from 'lucide-react';

export default function VehicleListings() {
  const {
    vehicles,
    setSelectedVehicle,
    setActiveView,
    searchParams,
    setSearchParams,
    pricingZones
  } = useApp();

  // Active Search Bar inputs
  const [location, setLocation] = useState(searchParams.location || 'Anna Nagar, Chennai');
  const [rentalMode, setRentalMode] = useState(searchParams.rentalMode || 'hourly');
  const [selectedHours, setSelectedHours] = useState(searchParams.hours || 6);
  const [selectedDays, setSelectedDays] = useState(searchParams.durationDays || 1);

  // Filter States
  const [selectedTypes, setSelectedTypes] = useState({
    car: searchParams.vehicleType === 'bike' ? false : true,
    bike: searchParams.vehicleType === 'car' ? false : true
  });

  // Sync category filter when searchParams.vehicleType changes (e.g. from header or home page)
  useEffect(() => {
    if (searchParams.vehicleType === 'bike') {
      setSelectedTypes({ car: false, bike: true });
    } else if (searchParams.vehicleType === 'car') {
      setSelectedTypes({ car: true, bike: false });
    } else {
      setSelectedTypes({ car: true, bike: true });
    }
  }, [searchParams.vehicleType]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTransmission, setSelectedTransmission] = useState('all'); // all | Automatic | Manual
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('recommended');
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSelectedTypes({ car: true, bike: true });
    setMaxPrice(5000);
    setSelectedBrands([]);
    setSelectedTransmission('all');
    setMinRating(0);
    setSortBy('recommended');
  };

  // Filtered and Sorted Vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // Type filter
      if (selectedTypes.car && !selectedTypes.bike && v.type !== 'car') return false;
      if (!selectedTypes.car && selectedTypes.bike && v.type !== 'bike') return false;

      // Price filter
      if (v.dailyPrice > maxPrice) return false;

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(v.brand)) return false;

      // Transmission
      if (selectedTransmission !== 'all' && v.transmission !== selectedTransmission) return false;

      // Rating
      if (minRating > 0 && v.rating < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        const pA = rentalMode === 'hourly' ? a.hourlyPrice : a.dailyPrice;
        const pB = rentalMode === 'hourly' ? b.hourlyPrice : b.dailyPrice;
        return pA - pB;
      }
      if (sortBy === 'price-high') {
        const pA = rentalMode === 'hourly' ? a.hourlyPrice : a.dailyPrice;
        const pB = rentalMode === 'hourly' ? b.hourlyPrice : b.dailyPrice;
        return pB - pA;
      }
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // recommended
    });
  }, [vehicles, selectedTypes, maxPrice, selectedBrands, selectedTransmission, minRating, sortBy, rentalMode]);

  const handleBookNow = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSearchParams(prev => ({
      ...prev,
      rentalMode,
      hours: selectedHours,
      durationDays: selectedDays,
      location
    }));
    setActiveView('details');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 72px)', padding: '24px 0 60px' }}>
      <div className="container">
        {/* Top Active Search Bar with Quick Duration Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid var(--border-light)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '28px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '14px',
              paddingBottom: '14px',
              borderBottom: '1px solid #f1f5f9'
            }}
          >
            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '220px' }}>
              <MapPin size={18} color="var(--primary)" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Chennai, Tamil Nadu"
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: '#0f172a',
                  width: '100%'
                }}
              />
            </div>

            <div style={{ width: '1px', height: '28px', backgroundColor: '#e2e8f0' }} />

            {/* Date and schedule preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1.2', minWidth: '240px' }}>
              <Calendar size={18} color="var(--primary)" />
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                12 Oct 2025, 10:00 AM &bull; {rentalMode === 'hourly' ? `${selectedHours} Hours Rental` : `${selectedDays} Day(s) Rental`}
              </span>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => {}}
              style={{ padding: '8px 24px' }}
            >
              <Search size={16} />
              <span>Update Search</span>
            </button>
          </div>

          {/* Category Quick Filter Strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingBottom: '14px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Vehicle Category:
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedTypes({ car: true, bike: true });
                  setSearchParams(prev => ({ ...prev, vehicleType: 'all' }));
                }}
                style={{
                  border: selectedTypes.car && selectedTypes.bike ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                  backgroundColor: selectedTypes.car && selectedTypes.bike ? 'var(--primary)' : '#ffffff',
                  color: selectedTypes.car && selectedTypes.bike ? '#ffffff' : 'var(--text-secondary)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>All Vehicles ({vehicles.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedTypes({ car: true, bike: false });
                  setSearchParams(prev => ({ ...prev, vehicleType: 'car' }));
                }}
                style={{
                  border: selectedTypes.car && !selectedTypes.bike ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                  backgroundColor: selectedTypes.car && !selectedTypes.bike ? 'var(--primary)' : '#ffffff',
                  color: selectedTypes.car && !selectedTypes.bike ? '#ffffff' : '#334155',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>Cars ({vehicles.filter(v => v.type === 'car').length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedTypes({ car: false, bike: true });
                  setSearchParams(prev => ({ ...prev, vehicleType: 'bike' }));
                }}
                style={{
                  border: !selectedTypes.car && selectedTypes.bike ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                  backgroundColor: !selectedTypes.car && selectedTypes.bike ? 'var(--primary)' : '#ffffff',
                  color: !selectedTypes.car && selectedTypes.bike ? '#ffffff' : '#334155',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>Bikes ({vehicles.filter(v => v.type === 'bike').length})</span>
              </button>
            </div>
          </div>

          {/* Quick Hourly vs Daily Presets Strip (Requested by User) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Rental Duration:
              </span>

              {/* 6 Hours */}
              <button
                type="button"
                onClick={() => {
                  setRentalMode('hourly');
                  setSelectedHours(6);
                }}
                style={{
                  border: rentalMode === 'hourly' && selectedHours === 6 ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                  backgroundColor: rentalMode === 'hourly' && selectedHours === 6 ? 'var(--primary-light)' : '#ffffff',
                  color: rentalMode === 'hourly' && selectedHours === 6 ? 'var(--primary)' : 'var(--text-secondary)',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                6 Hours
              </button>

              {/* 10 Hours */}
              <button
                type="button"
                onClick={() => {
                  setRentalMode('hourly');
                  setSelectedHours(10);
                }}
                style={{
                  border: rentalMode === 'hourly' && selectedHours === 10 ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                  backgroundColor: rentalMode === 'hourly' && selectedHours === 10 ? 'var(--primary-light)' : '#ffffff',
                  color: rentalMode === 'hourly' && selectedHours === 10 ? 'var(--primary)' : 'var(--text-secondary)',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                10 Hours
              </button>

              {/* 12 Hours */}
              <button
                type="button"
                onClick={() => {
                  setRentalMode('hourly');
                  setSelectedHours(12);
                }}
                style={{
                  border: rentalMode === 'hourly' && selectedHours === 12 ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                  backgroundColor: rentalMode === 'hourly' && selectedHours === 12 ? 'var(--primary-light)' : '#ffffff',
                  color: rentalMode === 'hourly' && selectedHours === 12 ? 'var(--primary)' : 'var(--text-secondary)',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                12 Hours
              </button>

              {/* 1 Day */}
              <button
                type="button"
                onClick={() => {
                  setRentalMode('daily');
                  setSelectedDays(1);
                }}
                style={{
                  border: rentalMode === 'daily' && selectedDays === 1 ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                  backgroundColor: rentalMode === 'daily' && selectedDays === 1 ? 'var(--primary-light)' : '#ffffff',
                  color: rentalMode === 'daily' && selectedDays === 1 ? 'var(--primary)' : 'var(--text-secondary)',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                1 Day (24 hrs)
              </button>

              {/* 2 Days */}
              <button
                type="button"
                onClick={() => {
                  setRentalMode('daily');
                  setSelectedDays(2);
                }}
                style={{
                  border: rentalMode === 'daily' && selectedDays === 2 ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                  backgroundColor: rentalMode === 'daily' && selectedDays === 2 ? 'var(--primary-light)' : '#ffffff',
                  color: rentalMode === 'daily' && selectedDays === 2 ? 'var(--primary)' : 'var(--text-secondary)',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                2 Days
              </button>
            </div>

            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Prices reflect: <strong>{rentalMode === 'hourly' ? `${selectedHours} hours total` : `${selectedDays} day(s) total`}</strong>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Left Filter Sidebar & Right Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '28px', alignItems: 'start' }}>
          {/* Left Filter Sidebar */}
          <aside
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid var(--border-light)',
              padding: '22px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>
                <SlidersHorizontal size={18} color="var(--primary)" />
                <span>Filters</span>
              </div>
              <button
                onClick={resetFilters}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'var(--primary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
            </div>

            {/* Vehicle Type Checkboxes */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                Vehicle Type
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.car}
                    onChange={(e) => setSelectedTypes(prev => ({ ...prev, car: e.target.checked }))}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <span>Cars ({vehicles.filter(v => v.type === 'car').length})</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.bike}
                    onChange={(e) => setSelectedTypes(prev => ({ ...prev, bike: e.target.checked }))}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <span>Bikes & Scooters ({vehicles.filter(v => v.type === 'bike').length})</span>
                </label>
              </div>
            </div>

            {/* Price Range Slider */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                  Max Daily Rate
                </label>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)' }}>
                  Up to ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>
                <span>₹200</span>
                <span>₹5,000+</span>
              </div>
            </div>

            {/* Brand Checkboxes */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                Brand
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Maruti', 'Hyundai', 'Toyota', 'Royal Enfield', 'Honda', 'Tata', 'Mahindra'].map(brand => (
                  <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleSelectBrand(brand)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                Transmission
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="transmission"
                    checked={selectedTransmission === 'all'}
                    onChange={() => setSelectedTransmission('all')}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>All Transmissions</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="transmission"
                    checked={selectedTransmission === 'Automatic'}
                    onChange={() => setSelectedTransmission('Automatic')}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>Automatic (15)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="transmission"
                    checked={selectedTransmission === 'Manual'}
                    onChange={() => setSelectedTransmission('Manual')}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>Manual (28)</span>
                </label>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                Rating
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === 4}
                    onChange={() => setMinRating(4)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    &nbsp;4★ & above
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === 0}
                    onChange={() => setMinRating(0)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>All Ratings</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Results Section */}
          <main>
            {/* Results Header Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  {filteredVehicles.length} vehicles found
                </h2>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Showing available cars & bikes in {location} for {rentalMode === 'hourly' ? `${selectedHours} hours` : `${selectedDays} day(s)`}
                </div>
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Horizontal Vehicle Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredVehicles.map(vehicle => {
                const totalEstimatedPrice = rentalMode === 'hourly'
                  ? vehicle.hourlyPrice * selectedHours
                  : vehicle.dailyPrice * selectedDays;

                return (
                  <div
                    key={vehicle.id}
                    className="card card-hover"
                    style={{
                      padding: '16px',
                      display: 'grid',
                      gridTemplateColumns: '220px 1fr auto',
                      gap: '20px',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleBookNow(vehicle)}
                  >
                    {/* Vehicle Image */}
                    <div style={{ height: '145px', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        onClick={(e) => toggleFavorite(vehicle.id, e)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Save to favorites"
                      >
                        <Heart
                          size={16}
                          color={favorites[vehicle.id] ? '#ef4444' : '#64748b'}
                          fill={favorites[vehicle.id] ? '#ef4444' : 'none'}
                        />
                      </button>
                    </div>

                    {/* Vehicle Specs & Details */}
                    <div>
                      <h3 style={{ fontSize: '17.5px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                        {vehicle.name}
                      </h3>

                      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                        {vehicle.type === 'car' ? 'Car' : 'Bike'} &bull; {vehicle.transmission} &bull; {vehicle.fuel} &bull; {vehicle.seats} Seats
                      </div>

                      {/* Star Rating */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '13px', fontWeight: 700 }}>
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <span>{vehicle.rating}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          ({vehicle.reviewsCount} reviews)
                        </span>
                      </div>

                      {/* Feature Badges matching mockup #2 */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {vehicle.airportPickup && (
                          <span className="badge badge-feature" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Plane size={12} color="var(--primary)" />
                            <span>Airport Pickup</span>
                          </span>
                        )}
                        {vehicle.freeCancellation && (
                          <span className="badge badge-feature" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ShieldCheck size={12} color="#10b981" />
                            <span>Free Cancellation</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & Book Now Column */}
                    <div
                      style={{
                        textAlign: 'right',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        gap: '4px',
                        paddingLeft: '16px',
                        borderLeft: '1px solid #f1f5f9',
                        minWidth: '160px'
                      }}
                    >
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>
                        ₹ {totalEstimatedPrice.toLocaleString('en-IN')}
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b' }}>
                          {' '}for {rentalMode === 'hourly' ? `${selectedHours}h` : `${selectedDays}d`}
                        </span>
                      </div>

                      <div style={{ fontSize: '11.5px', color: '#94a3b8', marginBottom: '12px' }}>
                        Rate: ₹ {vehicle.hourlyPrice}/hr &bull; ₹ {vehicle.dailyPrice}/day
                      </div>

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookNow(vehicle);
                        }}
                        style={{ padding: '8px 22px', fontSize: '13px' }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
