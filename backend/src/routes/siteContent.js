import { Router } from 'express';
import * as ctrl from '../controllers/siteContentController.js';
import { createCrudController } from '../controllers/crudFactory.js';
import { validateBody } from '../middleware/validate.js';
import { siteSettingsSchema, socialLinkSchema, socialLinkUpdateSchema } from '../validators/siteContent.js';

const socialLinksCtrl = createCrudController({ table: 'social_links', publicFilter: { is_active: true } });

export const publicRouter = Router();
publicRouter.get('/', ctrl.getPublic);

export const adminRouter = Router();
adminRouter.get('/', ctrl.getAdmin);
adminRouter.put('/', validateBody(siteSettingsSchema), ctrl.updateSettings);

adminRouter.get('/social-links', socialLinksCtrl.listAdmin);
adminRouter.post('/social-links', validateBody(socialLinkSchema), socialLinksCtrl.create);
adminRouter.put('/social-links/:id', validateBody(socialLinkUpdateSchema), socialLinksCtrl.update);
adminRouter.delete('/social-links/:id', socialLinksCtrl.remove);
