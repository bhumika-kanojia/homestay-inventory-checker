import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property reference is required'],
    index: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room reference is required'],
    index: true
  },
  guestName: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true
  },
  guestContact: {
    type: String,
    required: [true, 'Guest contact is required']
  },
  checkInDate: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  checkoutDate: {
    type: Date,
    required: [true, 'Check-out date is required']
  },
  nights: {
    type: Number,
    required: [true, 'Number of nights is required'],
    min: [1, 'Booking must be at least for 1 night']
  },
  roomType: {
    type: String,
    required: [true, 'Room type name is required']
  },
  roomsBooked: {
    type: Number,
    required: [true, 'Number of rooms booked is required'],
    min: [1, 'Must book at least 1 room']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['Pending', 'Active', 'Blocked', 'Cancelled'],
      message: '{VALUE} is not a supported booking status'
    },
    default: 'Blocked'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
