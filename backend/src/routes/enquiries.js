import { Router } from 'express';
import * as ctrl from '../controllers/enquiriesController.js';
import { validateBody } from '../middleware/validate.js';
import { enquirySchema, enquiryStatusSchema } from '../validators/enquiries.js';
import { contactLimiter } from '../middleware/rateLimit.js';

export const publicRouter = Router();
publicRouter.post('/', contactLimiter, validateBody(enquirySchema), ctrl.submit);

export const adminRouter = Router();
adminRouter.get('/', ctrl.listAdmin);
adminRouter.patch('/:id', validateBody(enquiryStatusSchema), ctrl.updateStatus);
adminRouter.delete('/:id', ctrl.remove);
