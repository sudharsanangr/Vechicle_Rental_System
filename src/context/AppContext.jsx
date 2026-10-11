import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_VEHICLES,
  INITIAL_BOOKINGS,
  INITIAL_TRANSACTIONS,
  PRICING_ZONES,
  USERS
} from '../data/mockData';
import { supabase } from '../lib/supabase';

const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const formatVehicleFromDB = (v) => ({
  ...v,
  id: v.id,
  name: v.name,
  type: v.type,
  brand: v.brand,
  model: v.model,
  dailyPrice: Number(v.daily_price ?? v.dailyPrice ?? 1500),
  hourlyPrice: Number(v.hourly_price ?? v.hourlyPrice ?? 200),
  rating: Number(v.rating ?? 4.8),
  reviewsCount: Number(v.reviews_count ?? v.reviewsCount ?? 0),
  images: Array.isArray(v.images) && v.images.length > 0
    ? v.images
    : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
  pickupLocation: v.pickup_location ?? v.pickupLocation ?? 'Anna Nagar, Chennai',
  zoneId: v.zone_id ?? v.zoneId ?? 'zone-anna-nagar',
  status: v.status || 'available',
  isApproved: v.is_approved !== undefined ? Boolean(v.is_approved) : (v.isApproved ?? true),
  transmission: v.transmission || (v.type === 'bike' ? 'Manual' : 'Automatic'),
  fuel: v.fuel || (v.name?.includes('EV') ? 'Electric' : 'Petrol'),
  seats: v.seats || (v.type === 'bike' ? 2 : 5),
  features: v.features || ['Air Conditioning', 'GPS Navigation', 'Fast Charger'],
  mileage: v.mileage || (v.type === 'bike' ? '45 km/l' : '15 km/l'),
  year: v.year || 2024,
});

export const OFFICIAL_ACCOUNTS = [
  {
    id: 'admin-1',
    name: 'Priya Sundaram',
    email: 'admin@driveeasy.com',
    aliases: ['admin@driveeasy.in'],
    password: 'admin123',
    role: 'admin',
    phone: '+91 94440 99881',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    stats: {
      totalUsers: 245,
      totalVehicles: 78,
      totalBookings: 532,
      totalRevenue: 248500
    }
  },
  {
    id: 'owner-1',
    name: 'Ravi Kumar',
    email: 'owner@driveeasy.com',
    aliases: ['ravi.kumar@fleet.in'],
    password: 'owner123',
    role: 'owner',
    phone: '+91 98401 23456',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    walletBalance: 48500,
    earnings: 48500,
    vehiclesCount: 5,
    activeRentals: 3,
    rating: 4.7,
    kycStatus: 'Verified'
  },
  {
    id: 'user-c1',
    name: 'Rahul Sharma',
    email: 'customer@driveeasy.com',
    aliases: ['rahul@driveeasy.in'],
    password: 'user123',
    role: 'customer',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    walletBalance: 1250,
    kycStatus: 'Verified',
    dlNumber: 'DL-04202100892',
    dlExpiry: '2032-12-31'
  }
];

const AppContext = createContext();

export function AppProvider({ children }) {
  // Current logged in user (starts with null / Guest by default, or loaded from storage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('driveeasy_current_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error(e);
    }
    return null; // Visitors start as Guests to explore features
  });

  // Current Role: 'customer' | 'owner' | 'admin' | 'guest'
  const [currentRole, setCurrentRole] = useState(() => {
    return currentUser ? currentUser.role : 'guest';
  });

  // Active Navigation & View
  const [activeView, setActiveViewRaw] = useState('home');

  // Sub-tab for User Dashboard: 'overview' | 'bookings' | 'saved' | 'profile' | 'support'
  const [dashboardSubTab, setDashboardSubTab] = useState('overview');

  // Intended destination after authentication redirect
  const [intendedDestination, setIntendedDestination] = useState(null);

  // Access Denied Information for 403 route guard
  const [accessDeniedInfo, setAccessDeniedInfo] = useState({ requiredRole: '', attemptedView: '' });

  // Saved / Favorited Vehicle IDs
  const [savedVehicleIds, setSavedVehicleIds] = useState(() => {
    try {
      const saved = localStorage.getItem('driveeasy_saved_vehicles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleSaveVehicle = (vehicleId) => {
    setSavedVehicleIds(prev => {
      const updated = prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId];
      localStorage.setItem('driveeasy_saved_vehicles', JSON.stringify(updated));
      return updated;
    });
  };

  const isVehicleSaved = (vehicleId) => savedVehicleIds.includes(vehicleId);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  // Role-guarded setActiveView function
  const setActiveView = (viewName, subTab = null) => {
    if (subTab) {
      setDashboardSubTab(subTab);
    }

    // Direct redirect shortcuts for dashboard tabs
    if (viewName === 'my-bookings') {
      if (!currentUser) {
        setIntendedDestination('my-bookings');
        addToast('Please sign in to view your bookings', 'info');
        setActiveViewRaw('sign-in');
        return;
      }
      setDashboardSubTab('bookings');
      setActiveViewRaw('dashboard');
      return;
    }

    if (viewName === 'saved-vehicles') {
      if (!currentUser) {
        setIntendedDestination('saved-vehicles');
        addToast('Please sign in to view your saved vehicles', 'info');
        setActiveViewRaw('sign-in');
        return;
      }
      setDashboardSubTab('saved');
      setActiveViewRaw('dashboard');
      return;
    }

    if (viewName === 'profile-settings') {
      if (!currentUser) {
        setIntendedDestination('profile-settings');
        addToast('Please sign in to access your profile', 'info');
        setActiveViewRaw('sign-in');
        return;
      }
      setDashboardSubTab('profile');
      setActiveViewRaw('dashboard');
      return;
    }

    // Authenticated users visiting sign-in or sign-up redirect to dashboard
    if ((viewName === 'sign-in' || viewName === 'sign-up') && currentUser) {
      if (currentUser.role === 'admin') setActiveViewRaw('admin-dashboard');
      else if (currentUser.role === 'owner') setActiveViewRaw('owner-dashboard');
      else setActiveViewRaw('dashboard');
      return;
    }

    // Unified customer dashboard
    if (viewName === 'dashboard' || viewName === 'customer-dashboard') {
      if (!currentUser) {
        setIntendedDestination('dashboard');
        addToast('Please sign in to access your private dashboard', 'info');
        setActiveViewRaw('sign-in');
        return;
      }
      if (currentUser.role === 'admin') {
        setActiveViewRaw('admin-dashboard');
        return;
      }
      if (currentUser.role === 'owner') {
        setActiveViewRaw('owner-dashboard');
        return;
      }
      setActiveViewRaw('dashboard');
      return;
    }

    // If Admin dashboard is requested
    if (viewName === 'admin-dashboard') {
      if (!currentUser) {
        setIntendedDestination('admin-dashboard');
        addToast('Please sign in to access the Admin Panel', 'info');
        setActiveViewRaw('sign-in');
        return;
      }
      if (currentUser.role !== 'admin') {
        setAccessDeniedInfo({
          requiredRole: 'admin',
          attemptedView: 'Admin Control Center'
        });
        setActiveViewRaw('access-denied');
        return;
      }
    }

    // If Owner dashboard or Add vehicle is requested
    if (viewName === 'owner-dashboard' || viewName === 'add-vehicle') {
      if (!currentUser) {
        setIntendedDestination(viewName);
        addToast('Please sign in as a Vehicle Owner to access this area', 'info');
        setActiveViewRaw('sign-in');
        return;
      }
      if (currentUser.role !== 'owner' && currentUser.role !== 'admin') {
        setAccessDeniedInfo({
          requiredRole: 'owner',
          attemptedView: viewName === 'add-vehicle' ? 'Vehicle Listing Page' : 'Vehicle Owner Portal'
        });
        setActiveViewRaw('access-denied');
        return;
      }
    }

    // If Wallet is requested
    if (viewName === 'wallet') {
      if (!currentUser) {
        addToast('Please sign in to view your digital wallet', 'info');
        setActiveViewRaw('sign-in');
        return;
      }
    }

    setActiveViewRaw(viewName);
  };

  // Vehicles dataset (editable by Owner & Admin, synced with Supabase)
  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('driveeasy_vehicles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_VEHICLES;
  });

  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(true);

  // Selected vehicle for details & checkout
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);

  // Fetch live vehicles from Supabase
  const refreshVehicles = useCallback(async () => {
    setIsLoadingVehicles(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const formatted = data.map(formatVehicleFromDB);
        setVehicles(formatted);
        localStorage.setItem('driveeasy_vehicles', JSON.stringify(formatted));
        setSupabaseConnected(true);
      } else if (!error) {
        setSupabaseConnected(true);
      }
    } catch (err) {
      console.warn('Supabase vehicle sync notice:', err);
    } finally {
      setIsLoadingVehicles(false);
    }
  }, []);

  useEffect(() => {
    refreshVehicles();
  }, [refreshVehicles]);

  // Pricing Zones (Admin configurable)
  const [pricingZones, setPricingZones] = useState(() => {
    const saved = localStorage.getItem('driveeasy_zones');
    return saved ? JSON.parse(saved) : PRICING_ZONES;
  });

  // Customer search parameters with explicit Hourly and Daily support
  const [searchParams, setSearchParams] = useState({
    location: 'Anna Nagar, Chennai',
    zoneId: 'zone-anna-nagar',
    startDate: '12 Oct 2025',
    startTime: '10:00 AM',
    endDate: '12 Oct 2025',
    endTime: '04:00 PM',
    rentalMode: 'hourly', // 'hourly' | 'daily'
    hours: 6, // default 6 hours (with 6h, 10h, 12h presets)
    durationDays: 1,
    vehicleType: 'all' // all | car | bike
  });

  // Calculate rental cost accurately for any vehicle and duration
  const calculateRentalCost = (vehicle, mode = 'hourly', duration = 6, multiplier = 1.12) => {
    if (!vehicle) return { basePrice: 0, locationFee: 0, totalAmount: 0 };
    
    let base = 0;
    if (mode === 'hourly') {
      base = (vehicle.hourlyPrice || 250) * duration;
    } else {
      base = (vehicle.dailyPrice || 1800) * duration;
    }

    const locationFee = Math.round(base * (multiplier - 1));
    const total = base + locationFee;

    return {
      basePrice: base,
      locationFee,
      totalAmount: total,
      mode,
      duration
    };
  };

  // Active bookings list
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('driveeasy_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Active Customer Wallet Balance & Transactions
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('driveeasy_wallet');
    return saved ? Number(saved) : USERS.customer.walletBalance;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('driveeasy_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Add Money Modal State
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);

  // Cancel Booking Modal State
  const [cancelModalBooking, setCancelModalBooking] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('driveeasy_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('driveeasy_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('driveeasy_wallet', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('driveeasy_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('driveeasy_zones', JSON.stringify(pricingZones));
  }, [pricingZones]);

  // Authentication Methods
  const login = (emailInput, passwordInput) => {
    const trimmedEmail = emailInput.trim().toLowerCase();
    
    // Check official accounts first
    let found = OFFICIAL_ACCOUNTS.find(
      acc => (acc.email.toLowerCase() === trimmedEmail || (acc.aliases && acc.aliases.some(al => al.toLowerCase() === trimmedEmail))) &&
             acc.password === passwordInput
    );

    // If not found in official, check custom registered users in storage
    if (!found) {
      try {
        const registered = JSON.parse(localStorage.getItem('driveeasy_registered_users') || '[]');
        found = registered.find(u => u.email.toLowerCase() === trimmedEmail && u.password === passwordInput);
      } catch (e) {
        console.error(e);
      }
    }

    if (found) {
      setCurrentUser(found);
      setCurrentRole(found.role);
      localStorage.setItem('driveeasy_current_user', JSON.stringify(found));
      setIsAuthModalOpen(false);

      if (found.role === 'admin') {
        setActiveViewRaw('admin-dashboard');
        addToast(`Welcome Superadmin ${found.name}! Signed into Admin Panel.`);
      } else if (found.role === 'owner') {
        setActiveViewRaw('owner-dashboard');
        addToast(`Welcome Host ${found.name}! Signed into Vehicle Owner Portal.`);
      } else {
        if (intendedDestination) {
          const dest = intendedDestination;
          setIntendedDestination(null);
          setActiveView(dest);
        } else {
          setActiveViewRaw('dashboard');
        }
        addToast(`Welcome ${found.name}! Signed in successfully.`);
      }
      return true;
    }
    return false;
  };

  const loginWithGoogle = () => {
    // Google OAuth is exclusively for Customer riders
    const googleUser = {
      id: `google-${Date.now()}`,
      name: 'Google Verified Customer',
      email: 'customer.google@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'customer',
      walletBalance: 2000,
      phone: '+91 98840 12345',
      kycStatus: 'Verified (Google OAuth)',
      isGoogleAuth: true
    };

    setCurrentUser(googleUser);
    setCurrentRole('customer');
    localStorage.setItem('driveeasy_current_user', JSON.stringify(googleUser));
    setIsAuthModalOpen(false);

    if (intendedDestination) {
      const dest = intendedDestination;
      setIntendedDestination(null);
      setActiveView(dest);
    } else {
      setActiveViewRaw('dashboard');
    }

    addToast('Signed in with Google ID! Welcome to DriveEasy.');
    return true;
  };

  const register = ({ name, email, password, phone, role = 'customer', businessName = '', fleetSize = '' }) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Admin role CANNOT be assigned or registered publicly under ANY circumstances
    if (role === 'admin' || trimmedEmail === 'admin@driveeasy.com' || trimmedEmail.includes('admin@')) {
      return { success: false, message: 'Superadmin accounts cannot be registered publicly. They must be provisioned by server administrators.' };
    }

    // Check if email already in use
    const existsOfficial = OFFICIAL_ACCOUNTS.some(a => a.email.toLowerCase() === trimmedEmail);
    let registeredList = [];
    try {
      registeredList = JSON.parse(localStorage.getItem('driveeasy_registered_users') || '[]');
    } catch {
      registeredList = [];
    }
    
    const existsRegistered = registeredList.some(u => u.email.toLowerCase() === trimmedEmail);
    if (existsOfficial || existsRegistered) {
      return { success: false, message: 'An account with this email already exists. Please sign in.' };
    }

    // Role is strictly 'customer' by default, or 'owner' via dedicated Host onboarding
    const assignedRole = role === 'owner' ? 'owner' : 'customer';

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: trimmedEmail,
      password,
      phone: phone || '+91 98765 00000',
      role: assignedRole,
      avatar: assignedRole === 'owner'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      walletBalance: assignedRole === 'owner' ? 0 : 1000,
      kycStatus: 'Verified',
      ...(assignedRole === 'owner' ? {
        businessName: businessName || `${name}'s Fleet`,
        fleetSize: fleetSize || '1-3 vehicles',
        earnings: 0,
        vehiclesCount: 0,
        activeRentals: 0,
        rating: 5.0
      } : {})
    };

    registeredList.push(newUser);
    localStorage.setItem('driveeasy_registered_users', JSON.stringify(registeredList));

    setCurrentUser(newUser);
    setCurrentRole(assignedRole);
    localStorage.setItem('driveeasy_current_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    
    if (assignedRole === 'owner') {
      setActiveViewRaw('owner-dashboard');
      addToast(`Host Account created! Welcome to DriveEasy Fleet Host, ${name}!`);
    } else {
      if (intendedDestination) {
        const dest = intendedDestination;
        setIntendedDestination(null);
        setActiveView(dest);
      } else {
        setActiveViewRaw('dashboard');
      }
      addToast(`Account created successfully! Welcome to DriveEasy, ${name}!`);
    }
    return { success: true };
  };

  const logout = async () => {
    try {
      if (supabase && supabase.auth) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Supabase sign-out notice:', e);
    }
    setCurrentUser(null);
    setCurrentRole('guest');
    localStorage.removeItem('driveeasy_current_user');
    setActiveViewRaw('home');
    addToast('You have signed out successfully.', 'info');
  };

  // Switch Role (for rapid switching between official test accounts)
  const switchRole = (role) => {
    const target = OFFICIAL_ACCOUNTS.find(a => a.role === role);
    if (target) {
      setCurrentUser(target);
      setCurrentRole(role);
      localStorage.setItem('driveeasy_current_user', JSON.stringify(target));
      if (role === 'customer') {
        setActiveViewRaw('customer-dashboard');
        addToast(`Switched to Customer Account (${target.name})`);
      } else if (role === 'owner') {
        setActiveViewRaw('owner-dashboard');
        addToast(`Switched to Vehicle Owner Account (${target.name})`);
      } else if (role === 'admin') {
        setActiveViewRaw('admin-dashboard');
        addToast(`Switched to Admin Panel (${target.name})`);
      }
    }
  };

  // Add money to wallet
  const topUpWallet = (amount, method = 'UPI (Instant)') => {
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) return false;

    setWalletBalance(prev => prev + parsedAmount);

    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Wallet Top-up',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      amount: parsedAmount,
      isCredit: true,
      method: method,
      status: 'Completed',
      refId: `TOPUP-${Date.now().toString().slice(-6)}`
    };

    setTransactions(prev => [newTxn, ...prev]);
    addToast(`₹ ${parsedAmount.toLocaleString('en-IN')} added to wallet successfully!`);
    setIsAddMoneyOpen(false);
    return true;
  };

  // Complete a booking and record in Supabase
  const createBooking = async (bookingData) => {
    const bookingId = `DRV-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      ...bookingData,
      id: bookingId,
      customerId: currentUser?.id || 'user-c1',
      customerName: currentUser?.name || 'Rahul Sharma',
      customerEmail: currentUser?.email || 'customer@driveeasy.com',
      status: 'Confirmed',
      bookingDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      cancellationPolicy: 'Free cancellation up to 24 hours before pickup.',
      qrCode: `${bookingId}-VERIFIED`
    };

    // If wallet was applied
    if (bookingData.walletApplied && bookingData.walletApplied > 0) {
      setWalletBalance(prev => Math.max(0, prev - bookingData.walletApplied));
    }

    // Add debit transaction
    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Booking Payment',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      amount: bookingData.totalAmount,
      isCredit: false,
      method: bookingData.paymentMethod || 'Wallet / Online',
      status: 'Completed',
      refId: bookingId
    };

    setBookings(prev => [newBooking, ...prev]);
    setTransactions(prev => [newTxn, ...prev]);

    // Save to Supabase bookings table
    try {
      const dbBooking = {
        rental_mode: bookingData.rentalMode || 'hourly',
        duration: Number(bookingData.duration || (bookingData.rentalMode === 'daily' ? bookingData.durationDays : bookingData.hours) || 1),
        start_date: String(bookingData.startDate || 'Today'),
        start_time: String(bookingData.startTime || '10:00 AM'),
        end_date: String(bookingData.endDate || 'Today'),
        end_time: String(bookingData.endTime || '04:00 PM'),
        total_amount: Number(bookingData.totalAmount || 0),
        status: 'Confirmed'
      };

      const vehId = bookingData.vehicleId || bookingData.vehicle?.id;
      if (isUUID(vehId)) {
        dbBooking.vehicle_id = vehId;
      }
      if (isUUID(currentUser?.id)) {
        dbBooking.customer_id = currentUser.id;
      }

      const { data, error } = await supabase.from('bookings').insert([dbBooking]).select();
      if (!error && data?.[0]) {
        newBooking.supabaseId = data[0].id;
      }
    } catch (err) {
      console.warn('Supabase booking sync notice:', err);
    }

    return newBooking;
  };

  // Cancel booking and calculate refund based on cancellation policy
  const cancelBooking = async (bookingId, reason = 'Customer requested cancellation') => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Refund policy: 100% refund if cancelled > 24 hours
    const refundAmount = booking.totalAmount;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled', cancellationReason: reason, refundAmount } : b));
    
    // Credit refund back to wallet
    setWalletBalance(prev => prev + refundAmount);

    const refundTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Refund',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      amount: refundAmount,
      isCredit: true,
      method: `Cancellation Refund (#${bookingId})`,
      status: 'Completed',
      refId: bookingId
    };

    setTransactions(prev => [refundTxn, ...prev]);
    setCancelModalBooking(null);
    addToast(`Booking ${bookingId} cancelled. ₹ ${refundAmount.toLocaleString('en-IN')} refunded to your wallet!`, 'info');

    // Update in Supabase
    if (booking.supabaseId || isUUID(bookingId)) {
      try {
        await supabase.from('bookings').update({ status: 'Cancelled' }).eq('id', booking.supabaseId || bookingId);
      } catch (err) {
        console.warn('Supabase booking cancel notice:', err);
      }
    }
  };

  // Owner adds new vehicle (saved to Supabase & local state)
  const addVehicle = async (newVehicleData) => {
    if (currentUser?.role !== 'owner' && currentUser?.role !== 'admin') {
      addToast('Unauthorized: Only registered Vehicle Owners can list vehicles.', 'error');
      return false;
    }

    const tempId = `v-${Date.now().toString().slice(-4)}`;
    const vehicle = {
      ...newVehicleData,
      id: tempId,
      ownerId: currentUser?.id || 'owner-1',
      ownerName: currentUser?.name || 'Ravi Kumar',
      ownerRating: 4.8,
      ownerTrips: 0,
      status: 'under_review',
      isApproved: false,
      rating: 5.0,
      reviewsCount: 0
    };

    // Optimistic UI update
    setVehicles(prev => [vehicle, ...prev]);
    addToast('Vehicle submitted! Syncing with Supabase database...', 'info');
    setActiveView('owner-dashboard');

    try {
      const dbPayload = {
        name: newVehicleData.name,
        type: newVehicleData.type || 'car',
        brand: newVehicleData.brand || 'Custom',
        model: newVehicleData.model || newVehicleData.name,
        daily_price: Number(newVehicleData.dailyPrice || 1500),
        hourly_price: Number(newVehicleData.hourlyPrice || 200),
        rating: 5.0,
        reviews_count: 0,
        images: Array.isArray(newVehicleData.images) && newVehicleData.images.length > 0
          ? newVehicleData.images
          : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
        pickup_location: newVehicleData.pickupLocation || 'Anna Nagar, Chennai',
        zone_id: newVehicleData.zoneId || 'zone-anna-nagar',
        status: 'under_review',
        is_approved: false
      };

      if (isUUID(currentUser?.id)) {
        dbPayload.owner_id = currentUser.id;
      }

      const { data, error } = await supabase.from('vehicles').insert([dbPayload]).select();
      if (!error && data?.[0]) {
        const syncedVehicle = formatVehicleFromDB(data[0]);
        setVehicles(prev => prev.map(v => v.id === tempId ? syncedVehicle : v));
        addToast('Vehicle securely saved in Supabase database!');
      }
    } catch (err) {
      console.warn('Supabase add vehicle notice:', err);
    }
  };

  // Owner or Admin updates existing vehicle (with ownership check)
  const updateVehicle = async (vehicleId, updatedVehicleData) => {
    const target = vehicles.find(v => v.id === vehicleId);
    if (!target) {
      addToast('Vehicle not found.', 'error');
      return false;
    }
    // Verify ownership
    if (currentUser?.role !== 'admin' && target.ownerId !== currentUser?.id && target.ownerEmail !== currentUser?.email) {
      addToast('Unauthorized: You can only edit your own vehicles.', 'error');
      return false;
    }

    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, ...updatedVehicleData } : v));
    addToast('Vehicle updated successfully!');

    if (isUUID(vehicleId)) {
      try {
        await supabase.from('vehicles').update({
          name: updatedVehicleData.name,
          daily_price: updatedVehicleData.dailyPrice,
          hourly_price: updatedVehicleData.hourlyPrice,
          pickup_location: updatedVehicleData.pickupLocation,
          status: updatedVehicleData.status
        }).eq('id', vehicleId);
      } catch (err) {
        console.warn('Supabase update notice:', err);
      }
    }
    return true;
  };

  // Admin approves vehicle (Superadmin check)
  const approveVehicle = async (vehicleId) => {
    if (currentUser?.role !== 'admin') {
      addToast('Unauthorized: Only Superadmin can approve vehicles.', 'error');
      return false;
    }

    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, isApproved: true, status: 'available' } : v));
    addToast(`Vehicle approved and is now live on marketplace!`);

    if (isUUID(vehicleId)) {
      try {
        await supabase.from('vehicles').update({ is_approved: true, status: 'available' }).eq('id', vehicleId);
      } catch (err) {
        console.warn('Supabase approve notice:', err);
      }
    }
  };

  // Admin updates pricing multiplier (Superadmin check)
  const updateZoneMultiplier = (zoneId, newMultiplier) => {
    if (currentUser?.role !== 'admin') {
      addToast('Unauthorized: Only Superadmin can modify pricing zones.', 'error');
      return false;
    }

    setPricingZones(prev => prev.map(z => z.id === zoneId ? { ...z, multiplier: Number(newMultiplier) } : z));
    addToast(`Pricing zone updated! New multiplier is ${newMultiplier}x`);
  };

  // User Profile Settings Updates
  const updateProfile = (updatedFields) => {
    if (!currentUser) return false;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    localStorage.setItem('driveeasy_current_user', JSON.stringify(updated));

    // Also update in registered users cache if applicable
    try {
      const reg = JSON.parse(localStorage.getItem('driveeasy_registered_users') || '[]');
      const idx = reg.findIndex(u => u.email.toLowerCase() === updated.email.toLowerCase());
      if (idx !== -1) {
        reg[idx] = { ...reg[idx], ...updatedFields };
        localStorage.setItem('driveeasy_registered_users', JSON.stringify(reg));
      }
    } catch (e) {
      console.warn('Profile cache update notice:', e);
    }

    addToast('Profile updated successfully!');
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        dashboardSubTab,
        setDashboardSubTab,
        intendedDestination,
        setIntendedDestination,
        savedVehicleIds,
        toggleSaveVehicle,
        isVehicleSaved,
        updateProfile,
        currentRole,
        switchRole,
        currentUser,
        login,
        loginWithGoogle,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        vehicles,
        setVehicles,
        selectedVehicle,
        setSelectedVehicle,
        pricingZones,
        updateZoneMultiplier,
        searchParams,
        setSearchParams,
        bookings,
        createBooking,
        cancelBooking,
        walletBalance,
        topUpWallet,
        transactions,
        calculateRentalCost,
        addVehicle,
        approveVehicle,
        activeReceipt,
        setActiveReceipt,
        isReceiptOpen,
        setIsReceiptOpen,
        isAddMoneyOpen,
        setIsAddMoneyOpen,
        cancelModalBooking,
        setCancelModalBooking,
        toasts,
        addToast,
        accessDeniedInfo,
        updateVehicle,
        supabase,
        supabaseConnected,
        isLoadingVehicles,
        refreshVehicles
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
