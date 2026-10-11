import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ReceiptModal from './components/ReceiptModal';
import AddMoneyModal from './components/AddMoneyModal';
import CancelBookingModal from './components/CancelBookingModal';
import AuthModal from './components/AuthModal';

// Views
import HomePage from './views/HomePage';
import VehicleListings from './views/VehicleListings';
import VehicleDetails from './views/VehicleDetails';
import BookingCheckout from './views/BookingCheckout';
import PaymentPage from './views/PaymentPage';
import UserDashboard from './views/UserDashboard';
import SignInPage from './views/SignInPage';
import SignUpPage from './views/SignUpPage';
import OwnerDashboard from './views/OwnerDashboard';
import AddEditVehicle from './views/AddEditVehicle';
import AdminDashboard from './views/AdminDashboard';
import WalletPage from './views/WalletPage';
import HowItWorksPage from './views/HowItWorksPage';
import AccessDenied from './views/AccessDenied';
import DevAuthBar from './components/DevAuthBar';

import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <AlertCircle size={36} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Something went wrong</h2>
          <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '440px', fontSize: '14.5px' }}>
            An unexpected error occurred while loading this view. You can return safely to the home page.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            style={{ padding: '12px 24px', fontWeight: 700 }}
          >
            Return to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const { activeView, setActiveView, toasts, accessDeniedInfo } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage />;
      case 'listings':
        return <VehicleListings />;
      case 'details':
        return <VehicleDetails />;
      case 'checkout':
        return <BookingCheckout />;
      case 'payment':
        return <PaymentPage />;
      case 'sign-in':
        return <SignInPage />;
      case 'sign-up':
        return <SignUpPage />;
      case 'dashboard':
      case 'customer-dashboard':
        return <UserDashboard />;
      case 'owner-dashboard':
        return <OwnerDashboard />;
      case 'add-vehicle':
        return <AddEditVehicle />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'wallet':
        return <WalletPage />;
      case 'how-it-works':
        return <HowItWorksPage />;
      case 'access-denied':
        return <AccessDenied requiredRole={accessDeniedInfo?.requiredRole} attemptedView={accessDeniedInfo?.attemptedView} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Top Header Navbar */}
      <Header />

      {/* Main Page Content */}
      <main style={{ flex: 1 }}>
        <ErrorBoundary onReset={() => setActiveView('home')}>
          {renderActiveView()}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />

      {/* Dev Environment Scenario Tester (DEV ONLY) */}
      <DevAuthBar />

      {/* Modals */}
      <ReceiptModal />
      <AddMoneyModal />
      <CancelBookingModal />
      <AuthModal />

      {/* Live Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={18} color="#ef4444" />
            ) : toast.type === 'info' ? (
              <Info size={18} color="var(--primary)" />
            ) : (
              <CheckCircle2 size={18} color="#10b981" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
