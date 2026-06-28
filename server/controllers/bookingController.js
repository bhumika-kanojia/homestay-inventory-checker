import Booking from '../models/bookingModel.js';
import Room from '../models/roomModel.js';
import Property from '../models/propertyModel.js';
import mongoose from 'mongoose';

/**
 * @desc    Create/block a room booking
 * @route   POST /api/bookings
 * @access  Public
 */
export const createBooking = async (req, res, next) => {
  try {
    const {
      propertyId,
      roomId,
      guestName,
      guestContact,
      checkInDate,
      checkoutDate,
      nights,
      roomsBooked,
      notes,
      status
    } = req.body;

    // 1. Validations
    if (!propertyId || !roomId || !guestName || !guestContact || !checkInDate || !nights || !roomsBooked) {
      res.status(400);
      throw new Error('Please fill in all required fields (propertyId, roomId, guestName, guestContact, checkInDate, nights, roomsBooked)');
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId) || !mongoose.Types.ObjectId.isValid(roomId)) {
      res.status(400);
      throw new Error('Invalid Property ID or Room ID format');
    }

    // Verify property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404);
      throw new Error('Property reference not found');
    }

    // Verify room exists
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error('Room reference not found');
    }

    // 2. Resolve check-in and checkout dates
    const parsedCheckIn = new Date(checkInDate);
    if (isNaN(parsedCheckIn.getTime())) {
      res.status(400);
      throw new Error('Invalid check-in date format');
    }

    let parsedCheckout;
    if (checkoutDate) {
      parsedCheckout = new Date(checkoutDate);
      if (isNaN(parsedCheckout.getTime())) {
        res.status(400);
        throw new Error('Invalid check-out date format');
      }
    } else {
      // Calculate checkoutDate from checkInDate + nights
      parsedCheckout = new Date(parsedCheckIn.getTime() + parseInt(nights) * 24 * 60 * 60 * 1000);
    }

    if (parsedCheckout <= parsedCheckIn) {
      res.status(400);
      throw new Error('Check-out date must be after check-in date');
    }

    const reqRoomsBooked = parseInt(roomsBooked);
    if (reqRoomsBooked <= 0) {
      res.status(400);
      throw new Error('Rooms booked count must be at least 1');
    }

    // 3. Availability and overlapping bookings calculation
    // Query condition: existingBooking.checkInDate < newCheckoutDate && existingBooking.checkoutDate > newCheckInDate
    const overlappingBookings = await Booking.find({
      roomId,
      status: { $ne: 'Cancelled' },
      checkInDate: { $lt: parsedCheckout },
      checkoutDate: { $gt: parsedCheckIn }
    });

    const alreadyBooked = overlappingBookings.reduce((sum, b) => sum + b.roomsBooked, 0);
    const availableRooms = room.totalRooms - alreadyBooked;

    if (reqRoomsBooked > availableRooms) {
      res.status(400);
      throw new Error(`Not enough rooms available for these dates. Requested: ${reqRoomsBooked}, Available: ${availableRooms}`);
    }

    // 4. Save the Booking
    const booking = await Booking.create({
      propertyId,
      roomId,
      guestName,
      guestContact,
      checkInDate: parsedCheckIn,
      checkoutDate: parsedCheckout,
      nights: parseInt(nights),
      roomType: room.roomName, // Map from roomName
      roomsBooked: reqRoomsBooked,
      notes: notes || '',
      status: status || 'Blocked'
    });

    res.status(201).json({
      success: true,
      data: booking
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings for a property
 * @route   GET /api/bookings/property/:propertyId
 * @access  Public
 */
export const getBookingsByPropertyId = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      res.status(400);
      throw new Error('Invalid Property ID format');
    }

    const bookings = await Booking.find({ propertyId }).sort({ checkInDate: 1 });

    res.status(200).json({
      success: true,
      data: bookings
    });

  } catch (error) {
    next(error);
  }
};
