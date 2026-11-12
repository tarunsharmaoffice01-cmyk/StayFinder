import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { BookingProvider } from './context/BookingContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { PropertyDetails } from './pages/PropertyDetails';
import { Wishlist } from './pages/Wishlist';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { MyBookings } from './pages/MyBookings';
import { HostDashboard } from './pages/HostDashboard';
import { AddProperty } from './pages/AddProperty';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <BookingProvider>
          <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-rose-100 selection:text-rose-600">
            {/* Global Sticky Navigation Bar */}
            <Navbar />

            {/* Application Main Routes */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/bookings" element={<MyBookings />} />
                <Route path="/host/dashboard" element={<HostDashboard />} />
                <Route path="/host/new" element={<AddProperty />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Global Modern Footer */}
            <Footer />
          </div>
        </BookingProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;

