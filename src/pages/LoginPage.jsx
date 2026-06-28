import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Home, CheckCircle2, ShieldAlert, KeyRound, Loader2, AlertCircle } from 'lucide-react';
import { isAuthenticated, login, saveAuthData } from '../utils/auth';
import { googleLogin } from '../utils/api';

export default function LoginPage() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" />;
  }

  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gsiLoaded, setGsiLoaded] = useState(false);

  const googleBtnRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  // console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)

  useEffect(() => {
    // Trigger entrance animation on mount
    setAnimate(true);

    if (!clientId) {
      return;
    }

    // Load Google Identity Services script dynamically
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGsiLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [clientId]);

  // Handle Google credential callback
  const handleCredentialResponse = async (response) => {
    setLoading(true);
    setError('');
    try {
      const res = await googleLogin(response.credential);
      if (res.success) {
        saveAuthData(res.token, res.user);
        navigate('/dashboard');
      } else {
        setError('Login failed. Invalid response from server.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gsiLoaded && clientId && googleBtnRef.current) {
      try {
        /* global google */
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
          googleBtnRef.current,
          {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: googleBtnRef.current.offsetWidth || 380
          }
        );
      } catch (err) {
        console.error('Error rendering Google button:', err);
      }
    }
  }, [gsiLoaded, clientId]);

  // Dev Mock fallback login
  const handleDevLogin = () => {
    setLoading(true);
    setError('');
    try {
      login('owner@sunrisehomestay.com', 'homestay123');
      showToastMessage('Dev Mode Mock Login successful!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError('Mock login failed.');
      setLoading(false);
    }
  };

  // Inline simple toast helper
  const [toastText, setToastText] = useState('');
  const showToastMessage = (msg) => {
    setToastText(msg);
    setTimeout(() => setToastText(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans overflow-hidden">
      {/* Toast message if any */}
      {toastText && (
        <div className="fixed top-4 right-4 z-50 flex items-center p-4 rounded-xl border shadow-lg bg-white transition-all duration-300 animate-slide-in">
          <div className="p-1 rounded-full mr-3 bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-slate-800">{toastText}</span>
        </div>
      )}

      {/* LEFT SIDE: Brand & Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 text-white flex-col justify-between p-12 overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-10000 ease-out"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80')",
            filter: "brightness(0.35) contrast(1.05)"
          }}
        />

        {/* Branding header */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="bg-blue-600/90 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 shadow-lg">
            <Home className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white/95">Inventory Checker</span>
        </div>

        {/* Content area */}
        <div className={`relative z-10 max-w-lg transition-all duration-1000 delay-100 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-block bg-blue-500/20 backdrop-blur-md text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/25 mb-6 uppercase tracking-widest">
            Homestay Management
          </span>
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight text-white mb-4">
            Manage Your Homestay Easily
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            Track rooms, manage bookings and check room availability from one place.
          </p>

          {/* Feature List */}
          <div className="space-y-4">
            {[
              "Organize Bookings",
              "Manage Rooms",
              "Share Property Link"
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="bg-emerald-500/20 backdrop-blur-xs p-1 rounded-full border border-emerald-400/30">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                </div>
                <span className="text-slate-200 font-medium text-base">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-slate-400/80 text-sm font-medium">
          &copy; {new Date().getFullYear()} Inventory Checker. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Card */}
        <div className={`w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/40 p-8 md:p-10 relative z-10 transition-all duration-700 ease-out delay-200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Mobile Branding (Shows only on small screens) */}
          <div className="lg:hidden flex items-center justify-center space-x-2.5 mb-8">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Home className="h-5.5 w-5.5" />
            </div>
            <span className="font-bold text-lg text-slate-800">Inventory Checker</span>
          </div>

          {/* Main Welcome Heading */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-2.5">
              Owner Portal
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Log in to access room settings, real-time inventory, and booking lists.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-6">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Button Container */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-6 text-slate-500 gap-2">
                <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
                <span className="text-sm font-semibold">Authenticating session...</span>
              </div>
            ) : clientId ? (
              <div className="flex flex-col gap-4">
                <div ref={googleBtnRef} className="w-full min-h-[44px]" />
                <div className="text-center text-xs text-slate-400 font-semibold my-1">OR</div>
                <button
                  onClick={handleDevLogin}
                  className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-sm border border-slate-200 shadow-xs transition-all cursor-pointer"
                >
                  <span>Bypass with Dev Mock Login</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-2 font-medium">
                  Google Client ID is not configured (VITE_GOOGLE_CLIENT_ID in .env). Falling back to developer mode.
                </div>
                <button
                  onClick={handleDevLogin}
                  className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 border border-slate-200 rounded-xl shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md cursor-pointer"
                >
                  {/* Google Premium Icon SVG */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Dev Login</span>
                </button>
              </div>
            )}

            {/* Security Badge / Disclaimer */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start space-x-3">
              <KeyRound className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-500 leading-normal">
                <span className="font-semibold text-slate-700 block mb-0.5">For Homestay Owners Only</span>
                Your session is secured using standard enterprise-grade OAuth verification.
              </div>
            </div>
          </div>

          {/* Minimal security footer message */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center space-x-2 text-xs text-slate-400">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Authorized access logs are monitored.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

