# 🚗 DriveEasy — Vehicle Rental Platform

> A modern, high-performance, on-demand self-drive car and bike rental platform built with **React 19**, **Vite**, and **Supabase**.

---

## 📌 Overview

**DriveEasy** is a full-featured vehicle rental web application designed for seamless customer bookings, vehicle owner fleet management, and administrative control. It supports both **hourly** and **daily** rentals, real-time location-based surge pricing zones, digital wallet transactions, instant KYC simulation, and automated celebration effects with verified booking receipts.

---

## ✨ Key Features

### 🚘 Vehicle Discovery & Booking
- **Dual Rental Modes**: Choose between **Hourly** (flexible short trips) or **Daily** (multi-day journeys) booking options.
- **Smart Filtering & Search**: Filter by vehicle category (Cars, Bikes, SUVs, Sedans), transmission (Automatic, Manual), fuel type (Petrol, Diesel, EV), seating capacity, and price range.
- **Zone Multiplier Dynamic Pricing**: Automatic location-based pricing adjustment depending on pickup hubs (e.g., Anna Nagar, Airport Express, OMR IT Corridor).
- **Interactive Pickup Hubs**: Visual location mapping powered by Leaflet.

### 💳 Seamless Checkout & Payments
- **Integrated Digital Wallet**: Use pre-funded wallet credits with one-click toggles, partial wallet split-payments, and automated cancellation refunds.
- **Multiple Payment Gateways**: Simulated checkout supporting UPI, Credit/Debit Cards, Net Banking, and Digital Wallet.
- **Celebration Feedback**: Automatic multi-burst confetti celebration upon order confirmation.
- **Order Confirmation & Digital Receipts**: Instant booking reference ID with one-click copy, verified schedule summary, printable receipts, and a direct **"Done (Return to Home)"** navigation button.

### 👥 Role-Based Access Control (RBAC)
- **Customer**: Browse listings, book vehicles, manage reservations, cancel bookings with refund calculations, and manage wallet balance.
- **Vehicle Owner / Host**: List new vehicles, edit fleet details, track rental status, and monitor earnings.
- **Admin**: Platform-wide metrics, oversee registered users, verify driver licenses/KYC, and manage pricing zones.
- **Dev Auth Bar**: Built-in floating developer toolbar to switch seamlessly between roles (`Guest`, `Customer`, `Owner`, `Admin`) for rapid testing.

### 🛡️ Reliability & Security
- **React Error Boundary**: Top-level error boundary preventing blank/white-screen crashes with instant one-click recovery.
- **Supabase Integration**: Cloud persistence for vehicle listings, bookings, and user profiles with graceful offline fallback to local mock data.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) |
| **Backend & Database** | [Supabase](https://supabase.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animations & Effects** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Maps** | [Leaflet](https://leafletjs.com/) |
| **Styling** | Custom Vanilla CSS (Design system, responsive layouts, glassmorphism) |
| **Linter** | [Oxlint](https://oxc.rs/) |

---

## 📁 Project Structure

```text
vechicle/
├── public/                 # Static assets & public files
├── src/
│   ├── assets/             # Branding and graphic assets
│   ├── components/         # Reusable UI components
│   │   ├── AddMoneyModal.jsx       # Wallet top-up modal
│   │   ├── AuthModal.jsx           # Sign in & registration popup
│   │   ├── CancelBookingModal.jsx  # Cancellation & refund breakdown modal
│   │   ├── DevAuthBar.jsx          # Developer role switcher toolbar
│   │   ├── Footer.jsx              # Global footer
│   │   ├── Header.jsx              # Responsive navigation bar & user menu
│   │   ├── LeafletMap.jsx          # Interactive pickup hub map
│   │   └── ReceiptModal.jsx        # Printable invoice & receipt modal
│   ├── context/
│   │   └── AppContext.jsx          # Global state management (Auth, Vehicles, Bookings, Wallet)
│   ├── data/
│   │   └── mockData.js             # Initial seed data for vehicles, users, and hubs
│   ├── lib/
│   │   └── supabase.js             # Supabase client configuration
│   ├── views/
│   │   ├── AccessDenied.jsx        # 403 Forbidden screen
│   │   ├── AddEditVehicle.jsx      # Owner vehicle creation & edit form
│   │   ├── AdminDashboard.jsx      # Admin management dashboard
│   │   ├── BookingCheckout.jsx     # Step 1: Booking review & driver details
│   │   ├── HomePage.jsx            # Landing page with hero, search, & featured fleet
│   │   ├── HowItWorksPage.jsx      # Rental guide & platform FAQ
│   │   ├── OwnerDashboard.jsx      # Vehicle owner fleet management
│   │   ├── PaymentPage.jsx         # Step 2 & 3: Payment selection & Success confirmation
│   │   ├── SignInPage.jsx          # User authentication login view
│   │   ├── SignUpPage.jsx          # User registration view
│   │   ├── UserDashboard.jsx       # Customer profile, bookings, saved vehicles
│   │   ├── VehicleDetails.jsx      # Detailed vehicle specifications & price estimator
│   │   ├── VehicleListings.jsx     # Fleet search catalog with interactive filters
│   │   └── WalletPage.jsx          # Transaction history & wallet balance management
│   ├── App.css
│   ├── App.jsx                     # Root application view router & ErrorBoundary
│   ├── index.css                   # Global design tokens and styles
│   └── main.jsx                    # React DOM entry point
├── .env.local              # Local environment variables (Supabase URL & Keys)
├── index.html              # HTML shell
├── package.json            # Project manifest & scripts
└── vite.config.js          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd vechicle
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   *(Note: The application includes full mock fallbacks and works out of the box even without active Supabase credentials)*.

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server with HMR. |
| `npm run build` | Compiles and optimizes assets for production deployment into `/dist`. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs the Oxlint linter for code quality checks. |

---

## 🧪 Testing User Roles

A built-in **Dev Auth Suite** bar is docked at the bottom of the screen in development mode. You can instantly test different role permissions:
- **Guest**: Browse cars/bikes, inspect pricing, view details.
- **Customer (`Rahul Sharma`)**: Complete reservations, review wallet, cancel bookings, view receipts.
- **Owner (`Priya Patel`)**: Add new vehicles to fleet, toggle availability, review earnings.
- **Admin (`Vikram Malhotra`)**: View overall bookings, approve KYC documents, manage zone surge multipliers.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
