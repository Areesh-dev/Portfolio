import { Router } from 'express';
import * as ctrl from '../controllers/reviewsController.js';
import { validateBody } from '../middleware/validate.js';
import { reviewSchema } from '../validators/reviews.js';
import { contactLimiter } from '../middleware/rateLimit.js';

export const publicRouter = Router();
publicRouter.get('/', ctrl.listPublic);
publicRouter.post('/', contactLimiter, validateBody(reviewSchema), ctrl.submit);

export const adminRouter = Router();
adminRouter.get('/', ctrl.listAdmin);
adminRouter.patch('/:id/approve', ctrl.approve);
adminRouter.delete('/:id', ctrl.remove);
