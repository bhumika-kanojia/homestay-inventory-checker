import Room from '../models/roomModel.js';
import Property from '../models/propertyModel.js';
import mongoose from 'mongoose';

/**
 * @desc    Add a new room type
 * @route   POST /api/rooms
 * @access  Public
 */
export const createRoom = async (req, res, next) => {
  try {
    const { propertyId, roomName, totalRooms, pricePerNight, mealType } = req.body;

    // Field validations
    if (!propertyId || !roomName || totalRooms === undefined || pricePerNight === undefined || !mealType) {
      res.status(400);
      throw new Error('Please fill in all required fields (propertyId, roomName, totalRooms, pricePerNight, mealType)');
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      res.status(400);
      throw new Error('Invalid Property ID format');
    }

    // Check if property exists
    const propertyExists = await Property.findById(propertyId);
    if (!propertyExists) {
      res.status(404);
      throw new Error('Property reference not found');
    }

    // Check if room name is already defined for this property
    const roomExists = await Room.findOne({ propertyId, roomName });
    if (roomExists) {
      res.status(400);
      throw new Error(`A room configuration with the name '${roomName}' already exists for this property`);
    }

    const room = await Room.create({
      propertyId,
      roomName,
      totalRooms,
      pricePerNight,
      mealType
    });

    res.status(201).json({
      success: true,
      data: room
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all rooms for a property
 * @route   GET /api/rooms/property/:propertyId
 * @access  Public
 */
export const getRoomsByPropertyId = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      res.status(400);
      throw new Error('Invalid Property ID format');
    }

    const rooms = await Room.find({ propertyId });

    res.status(200).json({
      success: true,
      data: rooms
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update room details
 * @route   PUT /api/rooms/:id
 * @access  Public
 */
export const updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roomName, totalRooms, pricePerNight, mealType } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid Room ID format');
    }

    const room = await Room.findById(id);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    // If changing name, verify unique combination index
    if (roomName && roomName !== room.roomName) {
      const roomExists = await Room.findOne({ propertyId: room.propertyId, roomName });
      if (roomExists) {
        res.status(400);
        throw new Error(`A room configuration with the name '${roomName}' already exists for this property`);
      }
      room.roomName = roomName;
    }

    if (totalRooms !== undefined) room.totalRooms = totalRooms;
    if (pricePerNight !== undefined) room.pricePerNight = pricePerNight;
    if (mealType) room.mealType = mealType;

    const updatedRoom = await room.save();

    res.status(200).json({
      success: true,
      data: updatedRoom
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a room
 * @route   DELETE /api/rooms/:id
 * @access  Public
 */
export const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid Room ID format');
    }

    const room = await Room.findById(id);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    await Room.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};
