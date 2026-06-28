import express from 'express';
import { 
  createRoom, 
  getRoomsByPropertyId, 
  updateRoom, 
  deleteRoom 
} from '../controllers/roomController.js';

const router = express.Router();

// Routes mapping
router.post('/', createRoom);
router.get('/property/:propertyId', getRoomsByPropertyId);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
