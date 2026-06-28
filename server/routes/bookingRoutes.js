import express from 'express';
import { 
  createBooking, 
  getBookingsByPropertyId 
} from '../controllers/bookingController.js';

const router = express.Router();

// Routes mappings
router.post('/', createBooking);
router.get('/property/:propertyId', getBookingsByPropertyId);

export default router;
