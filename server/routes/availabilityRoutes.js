import express from 'express';
import { checkAvailability } from '../controllers/availabilityController.js';

const router = express.Router();

// POST /api/availability/check
router.post('/check', checkAvailability);

export default router;
