import { Router } from 'express';
import { getStats } from '../controllers/dashboardController.js';

export const adminRouter = Router();
adminRouter.get('/', getStats);
