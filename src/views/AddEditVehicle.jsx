import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AccessDenied from './AccessDenied';
import {
  Car,
  Bike,
  Upload,
  Check,
  ArrowRight,
  ArrowLeft,
  FileText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function AddEditVehicle() {
  const { addVehicle, pricingZones, setActiveView, currentUser, switchRole } = useApp();

  const [step, setStep] = useState(1);
  const [vehicleType, setVehicleType] = useState('car'); // car | bike
  const [brand, setBrand] = useState('Toyota');
  const [model, setModel] = useState('Innova Crysta');
  const [registrationNumber, setRegistrationNumber] = useState('TN 09 AB 1234');
  const [fuelType, setFuelType] = useState('Diesel');
  const [transmission, setTransmission] = useState('Automatic');
  const [seats, setSeats] = useState(7);
  const [dailyPrice, setDailyPrice] = useState(1800);
  const [hourlyPrice, setHourlyPrice] = useState(250);
  const [zoneId, setZoneId] = useState('zone-anna-nagar');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');
  const [rcDocUploaded, setRcDocUploaded] = useState(true);
  const [insuranceUploaded, setInsuranceUploaded] = useState(true);

  // Role Protection Guard
  if (!currentUser || (currentUser.role !== 'owner' && currentUser.role !== 'admin')) {
    return <AccessDenied requiredRole="owner" attemptedView="Add / Edit Vehicle" />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedZone = pricingZones.find(z => z.id === zoneId) || pricingZones[0];

    addVehicle({
      name: `${brand} ${model}`,
      type: vehicleType,
      brand,
      model,
      year: 2024,
      transmission,
      fuel: fuelType,
      seats: Number(seats),
      dailyPrice: Number(dailyPrice),
      hourlyPrice: Number(hourlyPrice),
      images: [imageUrl],
      pickupLocation: selectedZone.name,
      zoneId: selectedZone.id,
      coordinates: selectedZone.coordinates,
      registrationNumber,
      description: `Premium well-maintained ${brand} ${model} with valid insurance and regular authorized service checkups.`
    });
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 72px)', padding: '32px 0 60px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Header with back */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              Add Vehicle
            </h1>
            <p style={{ fontSize: '13.5px', color: '#64748b' }}>
              Create a new vehicle rental listing for verified customers
            </p>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveView('owner-dashboard')}
          >
            Cancel
          </button>
        </div>

        {/* Multi-step Container */}
        <div className="card" style={{ padding: '32px' }}>
          {/* Form Stepper */}
          <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '28px', overflowX: 'auto' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: step === 1 ? 'var(--primary-light)' : 'transparent',
                color: step === 1 ? 'var(--primary)' : '#64748b',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
              onClick={() => setStep(1)}
            >
              <span>1. Basic Details</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: step === 2 ? 'var(--primary-light)' : 'transparent',
                color: step === 2 ? 'var(--primary)' : '#64748b',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
              onClick={() => setStep(2)}
            >
              <span>2. Images & Photos</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: step === 3 ? 'var(--primary-light)' : 'transparent',
                color: step === 3 ? 'var(--primary)' : '#64748b',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
              onClick={() => setStep(3)}
            >
              <span>3. Documents</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: step === 4 ? 'var(--primary-light)' : 'transparent',
                color: step === 4 ? 'var(--primary)' : '#64748b',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
              onClick={() => setStep(4)}
            >
              <span>4. Pricing & Zone</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Details (Mockup #8) */}
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
                  Vehicle Details
                </h3>

                {/* Vehicle Type Radio (Mockup #8 exact) */}
                <div className="form-group">
                  <label className="form-label">Vehicle Type</label>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="vehicleType"
                        checked={vehicleType === 'car'}
                        onChange={() => setVehicleType('car')}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span>Car</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="vehicleType"
                        checked={vehicleType === 'bike'}
                        onChange={() => setVehicleType('bike')}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span>Bike</span>
                    </label>
                  </div>
                </div>

                {/* Brand & Model Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <select
                      className="form-select"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    >
                      <option value="Toyota">Toyota</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Maruti">Maruti Suzuki</option>
                      <option value="Tata">Tata Motors</option>
                      <option value="Mahindra">Mahindra</option>
                      <option value="Royal Enfield">Royal Enfield</option>
                      <option value="Honda">Honda</option>
                      <option value="Yamaha">Yamaha</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Model</label>
                    <input
                      type="text"
                      className="form-input"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. Innova Crysta"
                      required
                    />
                  </div>
                </div>

                {/* Registration Number & Fuel Type Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label">Registration Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="TN 09 AB 1234"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fuel Type</label>
                    <select
                      className="form-select"
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                    >
                      <option value="Diesel">Diesel</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Electric">Electric (EV)</option>
                      <option value="CNG">CNG</option>
                    </select>
                  </div>
                </div>

                {/* Transmission & Seating */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label">Transmission</label>
                    <select
                      className="form-select"
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Seating Capacity</label>
                    <input
                      type="number"
                      className="form-input"
                      value={seats}
                      onChange={(e) => setSeats(e.target.value)}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setStep(2)}
                  >
                    <span>Next: Vehicle Images</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Images */}
            {step === 2 && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                  Vehicle Photo Gallery
                </h3>

                <div className="form-group">
                  <label className="form-label">Primary Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    required
                  />
                </div>

                {/* Image Preview Box */}
                <div style={{ marginBottom: '24px' }}>
                  <label className="form-label">Live Preview</label>
                  <div
                    style={{
                      height: '240px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setStep(3)}
                  >
                    <span>Next: Documents</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                  Verification Documents
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                  Upload valid vehicle registration (RC) and insurance certificate to ensure compliance with transport regulations.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' }}>
                  {/* RC Card */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <FileText size={20} color="var(--primary)" />
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>RC Certificate</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
                      Registration book or Smart Card copy
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '12.5px', fontWeight: 600 }}>
                      <CheckCircle2 size={16} />
                      <span>RC-VERIFIED.PDF (Attached)</span>
                    </div>
                  </div>

                  {/* Insurance Card */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <ShieldCheck size={20} color="var(--primary)" />
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>Comprehensive Insurance</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
                      Valid third-party & bumper-to-bumper policy
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '12.5px', fontWeight: 600 }}>
                      <CheckCircle2 size={16} />
                      <span>INSURANCE-POLICY-2026.PDF</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setStep(4)}
                  >
                    <span>Next: Pricing & Zone</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Pricing & Zone */}
            {step === 4 && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                  Pricing & Availability Zone
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Daily Rental Rate (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={dailyPrice}
                      onChange={(e) => setDailyPrice(Number(e.target.value))}
                      min="100"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hourly Rental Rate (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={hourlyPrice}
                      onChange={(e) => setHourlyPrice(Number(e.target.value))}
                      min="20"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Pickup & Pricing Zone</label>
                  <select
                    className="form-select"
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                  >
                    {pricingZones.map(zone => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} &bull; Multiplier: {zone.multiplier}x
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--primary-light)',
                    border: '1px solid var(--primary-border)',
                    borderRadius: '10px',
                    padding: '14px',
                    fontSize: '13px',
                    color: 'var(--primary)',
                    marginBottom: '24px'
                  }}
                >
                  Once submitted, the vehicle enters <strong>Under Review</strong> status. Our platform admin will verify the registration documents within 2-4 hours before making it live for booking.
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(3)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                  >
                    <span>Submit Listing for Review</span>
                    <Check size={18} />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
