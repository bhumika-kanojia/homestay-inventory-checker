import express from 'express';
import { 
  createProperty, 
  getPropertyBySlug, 
  updateProperty 
} from '../controllers/propertyController.js';

const router = express.Router();

// Route mappings
router.post('/', createProperty);
router.get('/:slug', getPropertyBySlug);
router.put('/:id', updateProperty);

export default router;
