import Property from '../models/propertyModel.js';
import Room from '../models/roomModel.js';
import Booking from '../models/bookingModel.js';

/**
 * @desc    Check room availability for a property by slug and date range
 * @route   POST /api/availability/check
 * @access  Public
 */
export const checkAvailability = async (req, res, next) => {
  try {
    const { propertySlug, checkInDate, nights, guests, roomsNeeded } = req.body;

    // 1. Validate required fields
    if (!propertySlug) {
      res.status(400);
      throw new Error('propertySlug is required');
    }
    if (!checkInDate) {
      res.status(400);
      throw new Error('checkInDate is required');
    }
    if (!nights) {
      res.status(400);
      throw new Error('nights is required');
    }
    const parsedNights = parseInt(nights);
    if (isNaN(parsedNights) || parsedNights < 1) {
      res.status(400);
      throw new Error('nights must be a number of at least 1');
    }

    // 2. Parse check-in date
    const parsedCheckIn = new Date(checkInDate);
    if (isNaN(parsedCheckIn.getTime())) {
      res.status(400);
      throw new Error('Invalid checkInDate format. Use ISO 8601 (e.g. 2025-08-01)');
    }

    // 3. Calculate checkout date
    const parsedCheckout = new Date(
      parsedCheckIn.getTime() + parsedNights * 24 * 60 * 60 * 1000
    );

    // 4. Find property by slug
    const property = await Property.findOne({ slug: propertySlug });
    if (!property) {
      res.status(404);
      throw new Error(`Property not found for slug: "${propertySlug}"`);
    }

    // 5. Get all rooms for this property
    const rooms = await Room.find({ propertyId: property._id });
    if (!rooms.length) {
      return res.status(200).json({
        success: true,
        property: {
          propertyId: property._id,
          propertyName: property.propertyName,
          slug: property.slug,
          region: property.region,
          state: property.state,
          address: property.address,
          contactNumber: property.contactNumber,
          whatsappNumber: property.whatsappNumber
        },
        checkInDate: parsedCheckIn.toISOString().split('T')[0],
        checkoutDate: parsedCheckout.toISOString().split('T')[0],
        nights: parsedNights,
        guests: guests || null,
        roomsNeeded: roomsNeeded || null,
        rooms: []
      });
    }

    // 6. For each room, calculate availability
    const availabilityResults = await Promise.all(
      rooms.map(async (room) => {
        // Find overlapping bookings:
        // existing.checkInDate < newCheckout && existing.checkoutDate > newCheckIn
        const overlappingBookings = await Booking.find({
          roomId: room._id,
          status: { $ne: 'Cancelled' },
          checkInDate: { $lt: parsedCheckout },
          checkoutDate: { $gt: parsedCheckIn }
        });

        const bookedRooms = overlappingBookings.reduce(
          (sum, b) => sum + b.roomsBooked,
          0
        );
        const availableRooms = room.totalRooms - bookedRooms;

        return {
          roomId: room._id,
          roomName: room.roomName,
          totalRooms: room.totalRooms,
          availableRooms,
          pricePerNight: room.pricePerNight,
          mealType: room.mealType
        };
      })
    );

    // 7. Filter to only rooms with availability > 0
    const availableRooms = availabilityResults.filter((r) => r.availableRooms > 0);

    return res.status(200).json({
      success: true,
      property: {
        propertyId: property._id,
        propertyName: property.propertyName,
        slug: property.slug,
        region: property.region,
        state: property.state,
        address: property.address,
        contactNumber: property.contactNumber,
        whatsappNumber: property.whatsappNumber
      },
      checkInDate: parsedCheckIn.toISOString().split('T')[0],
      checkoutDate: parsedCheckout.toISOString().split('T')[0],
      nights: parsedNights,
      guests: guests || null,
      roomsNeeded: roomsNeeded || null,
      rooms: availableRooms
    });
  } catch (error) {
    next(error);
  }
};
