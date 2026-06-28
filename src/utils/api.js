// Central API helper for Homestay Inventory Checker
// All backend calls go through this file.

const BASE_URL = 'http://localhost:5000';

/**
 * Generic fetch wrapper with error handling.
 */
async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };

  // Attach JWT token if present
  const token = localStorage.getItem('inventory_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...(options.headers || {}) }
  });

  const data = await res.json();

  if (!res.ok) {
    // Bubble up backend error message
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
}

// ─── PROPERTY APIs ──────────────────────────────────────────────────────────

/** GET /api/properties/:slug */
export async function getProperty(slug) {
  return apiFetch(`/api/properties/${slug}`);
}

/** POST /api/properties — create property */
export async function createProperty(propertyData) {
  return apiFetch('/api/properties', {
    method: 'POST',
    body: JSON.stringify(propertyData)
  });
}

/** PUT /api/properties/:id — update property */
export async function updateProperty(id, propertyData) {
  return apiFetch(`/api/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(propertyData)
  });
}

/**
 * Smart save: creates if no id, updates if id provided.
 */
export async function saveProperty(propertyData, id = null) {
  if (id) {
    return updateProperty(id, propertyData);
  }
  return createProperty(propertyData);
}

// ─── ROOM APIs ───────────────────────────────────────────────────────────────

/** GET /api/rooms/property/:propertyId */
export async function getRooms(propertyId) {
  return apiFetch(`/api/rooms/property/${propertyId}`);
}

/** POST /api/rooms */
export async function addRoom(roomData) {
  return apiFetch('/api/rooms', {
    method: 'POST',
    body: JSON.stringify(roomData)
  });
}

/** PUT /api/rooms/:id */
export async function updateRoom(id, roomData) {
  return apiFetch(`/api/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(roomData)
  });
}

/** DELETE /api/rooms/:id */
export async function deleteRoom(id) {
  return apiFetch(`/api/rooms/${id}`, { method: 'DELETE' });
}

// ─── BOOKING APIs ────────────────────────────────────────────────────────────

/** GET /api/bookings/property/:propertyId */
export async function getBookings(propertyId) {
  return apiFetch(`/api/bookings/property/${propertyId}`);
}

/** POST /api/bookings */
export async function createBooking(bookingData) {
  return apiFetch('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });
}

// ─── AVAILABILITY API ────────────────────────────────────────────────────────

/**
 * POST /api/availability/check
 * @param {{ propertySlug, checkInDate, nights, guests, roomsNeeded }} params
 */
export async function checkAvailability(params) {
  return apiFetch('/api/availability/check', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

// ─── AUTH API ────────────────────────────────────────────────────────────────

/** POST /api/auth/google — exchange Google credential for JWT */
export async function googleLogin(credential) {
  return apiFetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential })
  });
}
