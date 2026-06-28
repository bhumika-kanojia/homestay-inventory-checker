import React, { useState, useEffect } from 'react';
import {
  Building,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Share2,
  MapPin,
  Phone,
  Mail,
  Save,
  ExternalLink,
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { isAuthenticated, logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import {
  getProperty,
  saveProperty,
  getRooms,
  addRoom,
  updateRoom,
  deleteRoom,
  getBookings,
  createBooking
} from '../utils/api';

// Indian States list for dropdown
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// Map API room fields → local state fields
function mapRoom(r) {
  return {
    id: r._id,
    name: r.roomName,
    totalRooms: r.totalRooms,
    price: r.pricePerNight,
    mealType: r.mealType
  };
}

// Map API booking fields → local state fields
function mapBooking(b) {
  return {
    id: b._id,
    guestName: b.guestName,
    contact: b.guestContact,
    roomType: b.roomType,
    checkIn: b.checkInDate ? b.checkInDate.split('T')[0] : '',
    checkout: b.checkoutDate ? b.checkoutDate.split('T')[0] : '',
    nights: b.nights,
    rooms: b.roomsBooked,
    status: b.status
  };
}

export default function DashboardPage() {
  const navigate = useNavigate();

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // ── Property State ─────────────────────────────────────────────────────────
  const [propertyId, setPropertyId] = useState(null);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [property, setProperty] = useState({
    name: '',
    contact: '',
    whatsapp: '',
    state: 'Karnataka',
    region: '',
    address: '',
    email: ''
  });

  // ── Rooms State ────────────────────────────────────────────────────────────
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const [roomForm, setRoomForm] = useState({
    id: null,
    name: '',
    totalRooms: '',
    price: '',
    mealType: 'Only Room'
  });

  // ── Bookings State ─────────────────────────────────────────────────────────
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    guestName: '',
    guestContact: '',
    checkIn: '',
    nights: 1,
    checkout: '',
    roomType: '',
    roomId: '',
    rooms: 1,
    notes: ''
  });

  // ── Copied state ───────────────────────────────────────────────────────────
  const [copied, setCopied] = useState(false);

  // ══════════════════════════════════════════════════════════════════════════
  // ON MOUNT: Load property, then load rooms + bookings
  // ══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    async function loadData() {
      setPropertyLoading(true);
      try {
        const res = await getProperty('sunrise-homestay');
        const p = res.data;
        setPropertyId(p._id);
        setProperty({
          name: p.propertyName || '',
          contact: p.contactNumber || '',
          whatsapp: p.whatsappNumber || '',
          state: p.state || 'Karnataka',
          region: p.region || '',
          address: p.address || '',
          email: p.email || ''
        });

        // Load rooms and bookings in parallel
        setRoomsLoading(true);
        setBookingsLoading(true);

        const [roomsRes, bookingsRes] = await Promise.allSettled([
          getRooms(p._id),
          getBookings(p._id)
        ]);

        if (roomsRes.status === 'fulfilled') {
          const mappedRooms = roomsRes.value.data.map(mapRoom);
          setRooms(mappedRooms);
          // Set initial room type in booking form to first room
          if (mappedRooms.length > 0) {
            setBookingForm(prev => ({
              ...prev,
              roomType: mappedRooms[0].name,
              roomId: mappedRooms[0].id
            }));
          }
        }

        if (bookingsRes.status === 'fulfilled') {
          setBookings(bookingsRes.value.data.map(mapBooking));
        }

      } catch (err) {
        showToast('Could not load property data. Is the backend running?', 'error');
      } finally {
        setPropertyLoading(false);
        setRoomsLoading(false);
        setBookingsLoading(false);
      }
    }

    loadData();
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  // AUTO-CALC checkout date
  // ══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (bookingForm.checkIn && bookingForm.nights > 0) {
      const checkInDate = new Date(bookingForm.checkIn);
      const checkoutDate = new Date(checkInDate.getTime() + bookingForm.nights * 24 * 60 * 60 * 1000);
      const yyyy = checkoutDate.getFullYear();
      const mm = String(checkoutDate.getMonth() + 1).padStart(2, '0');
      const dd = String(checkoutDate.getDate()).padStart(2, '0');
      setBookingForm(prev => ({ ...prev, checkout: `${yyyy}-${mm}-${dd}` }));
    } else {
      setBookingForm(prev => ({ ...prev, checkout: '' }));
    }
  }, [bookingForm.checkIn, bookingForm.nights]);

  // ══════════════════════════════════════════════════════════════════════════
  // PROPERTY SAVE
  // ══════════════════════════════════════════════════════════════════════════
  const handlePropertySave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        propertyName: property.name,
        contactNumber: property.contact,
        whatsappNumber: property.whatsapp,
        state: property.state,
        region: property.region,
        address: property.address,
        email: property.email,
        slug: 'sunrise-homestay'
      };
      const res = await saveProperty(payload, propertyId);
      if (!propertyId) setPropertyId(res.data._id);
      showToast('Property details saved successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save property.', 'error');
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // ROOM ADD / UPDATE
  // ══════════════════════════════════════════════════════════════════════════
  const handleAddOrUpdateRoom = async (e) => {
    e.preventDefault();
    if (!roomForm.name || !roomForm.totalRooms || !roomForm.price) {
      showToast('Please fill in all room setup fields.', 'error');
      return;
    }

    try {
      if (roomForm.id) {
        // Edit mode
        const res = await updateRoom(roomForm.id, {
          roomName: roomForm.name,
          totalRooms: parseInt(roomForm.totalRooms),
          pricePerNight: parseFloat(roomForm.price),
          mealType: roomForm.mealType
        });
        setRooms(rooms.map(r => r.id === roomForm.id ? mapRoom(res.data) : r));
        showToast('Room updated successfully!');
      } else {
        // Add mode — need propertyId
        if (!propertyId) {
          showToast('Save property details first before adding rooms.', 'error');
          return;
        }
        const res = await addRoom({
          propertyId,
          roomName: roomForm.name,
          totalRooms: parseInt(roomForm.totalRooms),
          pricePerNight: parseFloat(roomForm.price),
          mealType: roomForm.mealType
        });
        const newRoom = mapRoom(res.data);
        setRooms(prev => [...prev, newRoom]);
        // Update booking form dropdown with first room if empty
        if (rooms.length === 0) {
          setBookingForm(prev => ({ ...prev, roomType: newRoom.name, roomId: newRoom.id }));
        }
        showToast('Room setup added successfully!');
      }
      setRoomForm({ id: null, name: '', totalRooms: '', price: '', mealType: 'Only Room' });
    } catch (err) {
      showToast(err.message || 'Failed to save room.', 'error');
    }
  };

  const handleEditRoom = (room) => {
    setRoomForm({
      id: room.id,
      name: room.name,
      totalRooms: room.totalRooms.toString(),
      price: room.price.toString(),
      mealType: room.mealType
    });
  };

  const handleDeleteRoom = async (id) => {
    try {
      await deleteRoom(id);
      setRooms(rooms.filter(r => r.id !== id));
      showToast('Room configuration deleted.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete room.', 'error');
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // BLOCK ROOM / BOOKING
  // ══════════════════════════════════════════════════════════════════════════
  const handleRoomTypeChange = (e) => {
    const selectedName = e.target.value;
    const selectedRoom = rooms.find(r => r.name === selectedName);
    setBookingForm(prev => ({
      ...prev,
      roomType: selectedName,
      roomId: selectedRoom ? selectedRoom.id : ''
    }));
  };

  const handleBlockRoom = async (e) => {
    e.preventDefault();
    if (!bookingForm.guestName || !bookingForm.guestContact || !bookingForm.checkIn) {
      showToast('Please fill in basic guest details and check-in date.', 'error');
      return;
    }
    if (!propertyId || !bookingForm.roomId) {
      showToast('Property or room data not loaded. Please refresh.', 'error');
      return;
    }

    try {
      const res = await createBooking({
        propertyId,
        roomId: bookingForm.roomId,
        guestName: bookingForm.guestName,
        guestContact: bookingForm.guestContact,
        checkInDate: bookingForm.checkIn,
        nights: parseInt(bookingForm.nights),
        roomsBooked: parseInt(bookingForm.rooms),
        notes: bookingForm.notes,
        status: 'Blocked'
      });

      setBookings(prev => [mapBooking(res.data), ...prev]);
      showToast('Booking blocked successfully!');

      setBookingForm({
        guestName: '',
        guestContact: '',
        checkIn: '',
        nights: 1,
        checkout: '',
        roomType: rooms[0]?.name || '',
        roomId: rooms[0]?.id || '',
        rooms: 1,
        notes: ''
      });
    } catch (err) {
      showToast(err.message || 'Failed to block booking.', 'error');
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // COPY PUBLIC LINK
  // ══════════════════════════════════════════════════════════════════════════
  const handleCopyLink = () => {
    const publicLink = `${window.location.origin}/property/sunrise-homestay`;
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    showToast('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // LOGOUT
  // ══════════════════════════════════════════════════════════════════════════
  const handleLogOut = () => {
    logout();
    showToast('Logged out successfully!', 'success');
    setTimeout(() => navigate('/login'), 1000);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">

      {/* Toast popup */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 flex items-center p-4 rounded-xl border shadow-lg bg-white transition-all duration-300 animate-slide-in">
          <div className={`p-1 rounded-full mr-3 ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
            {toast.type === 'success' ? <Check className="h-4 w-4" /> : <Info className="h-4 w-4" />}
          </div>
          <span className="text-sm font-semibold text-slate-800">{toast.message}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Hello, Owner 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {propertyLoading
              ? 'Loading property...'
              : <>Property: <span className="font-semibold text-slate-800">{property.name || 'Unnamed Property'}</span> &bull; {property.region}, {property.state}</>
            }
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all border border-slate-200 cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-500" />}
            <span>Copy Public Link</span>
          </button>

          <div className="h-10 w-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center border border-blue-500 shadow-sm cursor-pointer">
            OW
          </div>
          <div
            onClick={handleLogOut}
            className="h-10 min-w-20 rounded-full bg-red-600 text-white font-bold text-sm flex items-center justify-center border border-red-500 shadow-sm cursor-pointer hover:bg-red-500 active:bg-red-900 px-4"
          >
            Logout
          </div>
        </div>
      </div>

      {/* TWO COLUMN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Property & Setup forms */}
        <div className="lg:col-span-2 space-y-8">

          {/* SECTION 1: Property Details */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Property Details</h2>
                <p className="text-xs text-slate-400">Configure public listing info</p>
              </div>
            </div>

            {propertyLoading ? (
              <div className="flex items-center justify-center py-8 text-slate-400 gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading property details...</span>
              </div>
            ) : (
              <form onSubmit={handlePropertySave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Property Name</label>
                  <input
                    type="text"
                    value={property.name}
                    onChange={(e) => setProperty({ ...property, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email ID</label>
                  <input
                    type="email"
                    value={property.email}
                    onChange={(e) => setProperty({ ...property, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Contact Number</label>
                  <input
                    type="text"
                    value={property.contact}
                    onChange={(e) => setProperty({ ...property, contact: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">WhatsApp Number</label>
                  <input
                    type="text"
                    value={property.whatsapp}
                    onChange={(e) => setProperty({ ...property, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">State (India)</label>
                  <select
                    value={property.state}
                    onChange={(e) => setProperty({ ...property, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Region / City</label>
                  <input
                    type="text"
                    value={property.region}
                    onChange={(e) => setProperty({ ...property, region: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Address</label>
                  <input
                    type="text"
                    value={property.address}
                    onChange={(e) => setProperty({ ...property, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2 flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl text-sm shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Property</span>
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* SECTION 2: Room Setup */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Room Setup</h2>
                <p className="text-xs text-slate-400">Configure your rooms and price details</p>
              </div>
            </div>

            {/* Room setup form */}
            <form onSubmit={handleAddOrUpdateRoom} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Room Name</label>
                <input
                  type="text"
                  placeholder="e.g. Deluxe Suite"
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Number of Rooms</label>
                <input
                  type="number"
                  placeholder="Total rooms of this type"
                  value={roomForm.totalRooms}
                  onChange={(e) => setRoomForm({ ...roomForm, totalRooms: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Price Per Night (₹)</label>
                <input
                  type="number"
                  placeholder="Rate in INR"
                  value={roomForm.price}
                  onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Meal Type</label>
                <select
                  value={roomForm.mealType}
                  onChange={(e) => setRoomForm({ ...roomForm, mealType: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="Only Room">Only Room</option>
                  <option value="Breakfast Included">Breakfast Included</option>
                  <option value="Breakfast and Dinner">Breakfast and Dinner</option>
                  <option value="All Meals">All Meals</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                {roomForm.id && (
                  <button
                    type="button"
                    onClick={() => setRoomForm({ id: null, name: '', totalRooms: '', price: '', mealType: 'Only Room' })}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-5 rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl text-sm shadow-xs transition-colors cursor-pointer"
                >
                  <span>{roomForm.id ? 'Update Room' : 'Add Room'}</span>
                </button>
              </div>
            </form>

            {/* Room list */}
            {roomsLoading ? (
              <div className="flex items-center justify-center py-6 text-slate-400 gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading rooms...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-left">
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Room Name</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Total Rooms</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Price (Per Night)</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Meal Type</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 text-sm font-semibold text-slate-800">{room.name}</td>
                        <td className="py-4 text-sm text-slate-600">{room.totalRooms} Rooms</td>
                        <td className="py-4 text-sm text-slate-600 font-medium">₹{room.price}</td>
                        <td className="py-4">
                          <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium border border-slate-200">
                            {room.mealType}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditRoom(room)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rooms.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    No rooms added yet. Use the form above to add your first room.
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: Block Rooms & Share Link */}
        <div className="space-y-8">

          {/* SECTION 3: Block Room / Add Booking */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Block Room / Book</h2>
                <p className="text-xs text-slate-400">Instantly block or add a booking</p>
              </div>
            </div>

            <form onSubmit={handleBlockRoom} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Guest Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={bookingForm.guestName}
                  onChange={(e) => setBookingForm({ ...bookingForm, guestName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Guest Contact</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  value={bookingForm.guestContact}
                  onChange={(e) => setBookingForm({ ...bookingForm, guestContact: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Check-in Date</label>
                  <input
                    type="date"
                    value={bookingForm.checkIn}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nights</label>
                  <input
                    type="number"
                    value={bookingForm.nights}
                    onChange={(e) => setBookingForm({ ...bookingForm, nights: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Checkout Date (Auto)</label>
                <input
                  type="text"
                  value={bookingForm.checkout || 'Select check-in...'}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 select-none cursor-not-allowed font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Room Type</label>
                  <select
                    value={bookingForm.roomType}
                    onChange={handleRoomTypeChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    {rooms.map((room) => (
                      <option key={room.id} value={room.name}>{room.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Rooms Booked</label>
                  <input
                    type="number"
                    value={bookingForm.rooms}
                    onChange={(e) => setBookingForm({ ...bookingForm, rooms: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Notes (Optional)</label>
                <textarea
                  placeholder="Special instructions..."
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-16 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm shadow-xs transition-colors cursor-pointer"
              >
                Block Rooms
              </button>
            </form>
          </section>

          {/* SECTION 5: Share Property Link */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Share Property</h2>
                <p className="text-xs text-slate-400">Share the link with guests</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-xs font-mono text-slate-600 break-all select-all flex items-center justify-between">
              <span>{`${window.location.origin}/property/sunrise-homestay`}</span>
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-all border border-slate-200 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-500" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </section>

        </div>
      </div>

      {/* SECTION 4: Upcoming Bookings (Full Width Table) */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Upcoming Bookings</h2>
              <p className="text-xs text-slate-400">All upcoming and blocked reservations</p>
            </div>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2.5 py-1 rounded-full">
            {bookings.length} reservations
          </span>
        </div>

        {bookingsLoading ? (
          <div className="flex items-center justify-center py-8 text-slate-400 gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading bookings...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Guest Details</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Room Type</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Check-in</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Checkout</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Nights</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Rooms</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <div className="font-semibold text-slate-800 text-sm">{b.guestName}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{b.contact}</div>
                    </td>
                    <td className="py-4 text-slate-600 text-sm font-medium">{b.roomType}</td>
                    <td className="py-4 text-slate-600 text-sm">{b.checkIn}</td>
                    <td className="py-4 text-slate-600 text-sm">{b.checkout}</td>
                    <td className="py-4 text-slate-600 text-sm text-center font-medium">{b.nights}</td>
                    <td className="py-4 text-slate-600 text-sm text-center font-medium">{b.rooms}</td>
                    <td className="py-4 text-right">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${b.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No reservation details found.
              </div>
            )}
          </div>
        )}
      </section>

    </div>
  );
}
