/**
 * Seed Script — Homestay Inventory Checker
 * Usage: node seed.js  (or: npm run seed from server/)
 *
 * Creates sample property, rooms, and one optional booking.
 * Safe to run multiple times — checks for existing data first.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

// ── Models ─────────────────────────────────────────────────────────────────
import Property from './models/propertyModel.js';
import Room from './models/roomModel.js';
import Booking from './models/bookingModel.js';

// ── Seed Data ──────────────────────────────────────────────────────────────
const PROPERTY_SLUG = 'sunrise-homestay';

const PROPERTY_DATA = {
  propertyName: 'Sunrise Homestay',
  contactNumber: '+91 94482 10345',
  whatsappNumber: '+91 94482 10345',
  state: 'Karnataka',
  region: 'Coorg',
  address: 'Misty Hills Estate, Madikeri, Coorg, Karnataka',
  email: 'hello@sunrisehomestay.com',
  slug: PROPERTY_SLUG
};

const ROOMS_DATA = [
  {
    roomName: 'Deluxe Room',
    totalRooms: 4,
    pricePerNight: 2800,
    mealType: 'Breakfast Included'
  },
  {
    roomName: 'Standard Room',
    totalRooms: 3,
    pricePerNight: 1800,
    mealType: 'Only Room'
  },
  {
    roomName: 'Cottage',
    totalRooms: 2,
    pricePerNight: 3500,
    mealType: 'All Meals'
  }
];

const BOOKING_DATA = {
  guestName: 'Rahul Sharma',
  guestContact: '+91 98765 43210',
  checkInDate: new Date('2026-07-10'),
  nights: 2,
  roomsBooked: 1,
  status: 'Blocked',
  notes: 'Sample seed booking'
};

// ── Main Seed Function ─────────────────────────────────────────────────────
async function seed() {
  const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('❌  MONGODB_URI not found in .env');
    process.exit(1);
  }

  console.log('🔗 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  // 1. Upsert Property ──────────────────────────────────────────────────────
  let property = await Property.findOne({ slug: PROPERTY_SLUG });
  if (property) {
    console.log(`ℹ️  Property already exists: "${property.propertyName}" (${property._id})`);
  } else {
    property = await Property.create(PROPERTY_DATA);
    console.log(`✅ Created property: "${property.propertyName}" (${property._id})`);
  }

  // 2. Upsert Rooms ─────────────────────────────────────────────────────────
  let deluxeRoom = null;
  for (const roomData of ROOMS_DATA) {
    const existing = await Room.findOne({
      propertyId: property._id,
      roomName: roomData.roomName
    });

    if (existing) {
      console.log(`ℹ️  Room already exists: "${roomData.roomName}" (${existing._id})`);
      if (!deluxeRoom && roomData.roomName === 'Deluxe Room') deluxeRoom = existing;
    } else {
      const newRoom = await Room.create({ propertyId: property._id, ...roomData });
      console.log(`✅ Created room: "${roomData.roomName}" (${newRoom._id})`);
      if (!deluxeRoom && roomData.roomName === 'Deluxe Room') deluxeRoom = newRoom;
    }
  }

  // 3. Optional Sample Booking ──────────────────────────────────────────────
  if (deluxeRoom) {
    const checkoutDate = new Date(
      BOOKING_DATA.checkInDate.getTime() + BOOKING_DATA.nights * 24 * 60 * 60 * 1000
    );

    const existingBooking = await Booking.findOne({
      propertyId: property._id,
      roomId: deluxeRoom._id,
      guestName: BOOKING_DATA.guestName,
      checkInDate: BOOKING_DATA.checkInDate
    });

    if (existingBooking) {
      console.log(`ℹ️  Sample booking already exists for "${BOOKING_DATA.guestName}"`);
    } else {
      await Booking.create({
        propertyId: property._id,
        roomId: deluxeRoom._id,
        guestName: BOOKING_DATA.guestName,
        guestContact: BOOKING_DATA.guestContact,
        checkInDate: BOOKING_DATA.checkInDate,
        checkoutDate,
        nights: BOOKING_DATA.nights,
        roomType: deluxeRoom.roomName,
        roomsBooked: BOOKING_DATA.roomsBooked,
        status: BOOKING_DATA.status,
        notes: BOOKING_DATA.notes
      });
      console.log(`✅ Created sample booking for "${BOOKING_DATA.guestName}"`);
    }
  }

  console.log('\n🎉 Seed complete!\n');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
