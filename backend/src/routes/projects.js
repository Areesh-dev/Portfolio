import { Router } from 'express';
import * as ctrl from '../controllers/projectsController.js';
import { validateBody } from '../middleware/validate.js';
import { projectSchema, projectUpdateSchema, projectImageSchema } from '../validators/projects.js';

export const publicRouter = Router();
publicRouter.get('/', ctrl.listPublic);
publicRouter.get('/:slug', ctrl.getBySlugPublic);

export const adminRouter = Router();
adminRouter.get('/', ctrl.listAdmin);
adminRouter.get('/:id', ctrl.getByIdAdmin);
adminRouter.post('/', validateBody(projectSchema), ctrl.create);
adminRouter.put('/:id', validateBody(projectUpdateSchema), ctrl.update);
adminRouter.delete('/:id', ctrl.remove);
adminRouter.post('/:id/images', validateBody(projectImageSchema), ctrl.addImage);
adminRouter.delete('/:id/images/:imageId', ctrl.removeImage);
