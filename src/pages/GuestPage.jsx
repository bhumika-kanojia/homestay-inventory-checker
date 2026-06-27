import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Calendar, 
  Users, 
  Home, 
  Clock, 
  Wifi, 
  Coffee, 
  Car, 
  Flame, 
  Utensils, 
  Compass, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export default function GuestPage() {
  // 1. Availability check states
  const [checkIn, setCheckIn] = useState('');
  const [nights, setNights] = useState(1);
  const [checkout, setCheckout] = useState('');
  const [guests, setGuests] = useState(2);
  const [roomsNeeded, setRoomsNeeded] = useState(1);
  const [checked, setChecked] = useState(false);
  const [searching, setSearching] = useState(false);

  // Auto-calculate checkout date when checkin or nights changes
  useEffect(() => {
    if (checkIn && nights > 0) {
      const checkInDate = new Date(checkIn);
      const checkoutDate = new Date(checkInDate.getTime() + nights * 24 * 60 * 60 * 1000);
      const yyyy = checkoutDate.getFullYear();
      const mm = String(checkoutDate.getMonth() + 1).padStart(2, '0');
      const dd = String(checkoutDate.getDate()).padStart(2, '0');
      setCheckout(`${yyyy}-${mm}-${dd}`);
    } else {
      setCheckout('');
    }
  }, [checkIn, nights]);

  // Available Rooms Sample Data
  const sampleRooms = [
    {
      id: 'r1',
      name: 'Deluxe Room',
      price: 2800,
      mealType: 'Breakfast Included',
      available: 4,
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80',
      description: 'Spacious premium room featuring a private balcony and garden views.'
    },
    {
      id: 'r2',
      name: 'Standard Room',
      price: 1800,
      mealType: 'Only Room',
      available: 3,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
      description: 'Cozy and functional standard room perfect for budget-conscious travelers.'
    },
    {
      id: 'r3',
      name: 'Cottage',
      price: 3500,
      mealType: 'All Meals',
      available: 2,
      image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&q=80',
      description: 'Standalone wooden cottage nestled among plantations with full meal packages.'
    }
  ];

  const handleCheckAvailability = (e) => {
    e.preventDefault();
    if (!checkIn) {
      alert("Please select a check-in date.");
      return;
    }
    setSearching(true);
    // Simulate a quick network search feel
    setTimeout(() => {
      setSearching(false);
      setChecked(true);
      // Smooth scroll to rooms section after search completes
      const element = document.getElementById("available-rooms-section");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans">
      
      {/* HERO Banner Image */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80" 
          alt="Sunrise Homestay Coorg" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 md:-mt-24 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Header & Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Property Header Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200 mb-3">
                  Coorg Homestay
                </span>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  Sunrise Homestay
                </h1>
                <p className="text-slate-500 text-sm mt-1.5 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Misty Hills Estate, Madikeri, Coorg, Karnataka</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0">
                <a
                  href="tel:+919448210345"
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Us</span>
                </a>
                <a
                  href="https://wa.me/919448210345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Timings / Details list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Number</span>
                <span className="text-sm font-medium text-slate-700 mt-1 block">+91 94482 10345</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Number</span>
                <span className="text-sm font-medium text-slate-700 mt-1 block">+91 94482 10345</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</span>
                <span className="text-sm font-medium text-slate-700 mt-1 block">Coorg, Karnataka</span>
              </div>
            </div>
          </div>

          {/* 4. Property Information (Rendered below) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2.5">About the Homestay</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A serene homestay nestled in the lush hills of Coorg. Experience authentic Kodava hospitality with modern comforts. Surrounded by coffee and pepper estates, our property offers breathtaking views and a peaceful retreat from busy city life. Enjoy home-cooked traditional meals and misty plantation walks.
              </p>
            </div>

            {/* Timings */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" />
                <span>Timings</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center text-sm text-slate-600">
                  <span className="font-medium text-slate-500">Check-in:</span>
                  <span className="font-bold text-slate-800">12:00 PM</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center text-sm text-slate-600">
                  <span className="font-medium text-slate-500">Check-out:</span>
                  <span className="font-bold text-slate-800">11:00 AM</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Amenities Offered</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
                  { icon: <Wifi className="h-4.5 w-4.5" />, name: "Free Wi-Fi" },
                  { icon: <Car className="h-4.5 w-4.5" />, name: "Parking Space" },
                  { icon: <Utensils className="h-4.5 w-4.5" />, name: "Home Cooked Meals" },
                  { icon: <Coffee className="h-4.5 w-4.5" />, name: "Garden Estate Tour" },
                  { icon: <Flame className="h-4.5 w-4.5" />, name: "Evening Bonfire" },
                  { icon: <Compass className="h-4.5 w-4.5" />, name: "Nature Trails" },
                ].map((amenity, i) => (
                  <div key={i} className="flex items-center space-x-2.5 bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <div className="text-blue-600 bg-blue-50 p-1.5 rounded-lg shrink-0">
                      {amenity.icon}
                    </div>
                    <span className="text-slate-700 text-xs font-semibold">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Available Rooms Section (Only visible on availability checked) */}
          <div id="available-rooms-section">
            {checked ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Home className="h-5.5 w-5.5 text-blue-600" />
                    <span>Available Rooms</span>
                  </h2>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-1 rounded-full">
                    Rooms for {nights} nights ({guests} guests)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {sampleRooms.map((room) => (
                    <div key={room.id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div>
                        {/* Room Cover Image */}
                        <div className="h-44 bg-slate-100 relative">
                          <img 
                            src={room.image} 
                            alt={room.name} 
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200/50 shadow-sm">
                            {room.available} left
                          </span>
                        </div>

                        {/* Room details */}
                        <div className="p-5 space-y-3">
                          <div>
                            <h3 className="font-bold text-slate-800 text-base">{room.name}</h3>
                            <span className="inline-block mt-1 bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-medium border border-slate-200">
                              {room.mealType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {room.description}
                          </p>
                        </div>
                      </div>

                      {/* Room Price Footer */}
                      <div className="p-5 pt-0 mt-auto border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Per Night</span>
                          <span className="text-lg font-bold text-slate-800">₹{room.price}</span>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3.5 rounded-lg transition-colors shadow-xs cursor-pointer">
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">No Rooms Searched Yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Select dates and guest details above to view live available rooms and prices.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Float Calendar availability card */}
        <div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs sticky top-8">
            <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-5">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Check Availability</h2>
                <p className="text-xs text-slate-400">Lock your dates instantly</p>
              </div>
            </div>

            <form onSubmit={handleCheckAvailability} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Check-in Date</label>
                <input 
                  type="date" 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Number of Nights</label>
                <input 
                  type="number" 
                  value={nights}
                  onChange={(e) => setNights(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Checkout Date (Auto)</label>
                <input 
                  type="text" 
                  value={checkout || 'Select check-in...'}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium select-none cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Guests</label>
                  <input 
                    type="number" 
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Rooms Needed</label>
                  <input 
                    type="number" 
                    value={roomsNeeded}
                    onChange={(e) => setRoomsNeeded(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={searching}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm shadow-xs transition-colors mt-2 cursor-pointer flex items-center justify-center space-x-2"
              >
                {searching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Check Availability</span>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
