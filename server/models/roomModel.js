import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property reference is required'],
    index: true
  },
  roomName: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true
  },
  totalRooms: {
    type: Number,
    required: [true, 'Total rooms count is required'],
    min: [1, 'Must have at least 1 room']
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: [0, 'Price per night cannot be negative']
  },
  mealType: {
    type: String,
    required: [true, 'Meal type is required'],
    enum: {
      values: ['Only Room', 'Breakfast Included', 'Breakfast and Dinner', 'All Meals'],
      message: '{VALUE} is not a valid meal type option'
    }
  }
}, {
  timestamps: true
});

// Unique room config name per property
roomSchema.index({ propertyId: 1, roomName: 1 }, { unique: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;
