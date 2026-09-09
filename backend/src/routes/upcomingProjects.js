import { Router } from 'express';
import { createCrudController } from '../controllers/crudFactory.js';
import { validateBody } from '../middleware/validate.js';
import { upcomingProjectSchema, upcomingProjectUpdateSchema } from '../validators/upcomingProjects.js';

const ctrl = createCrudController({
  table: 'upcoming_projects',
  orderBy: 'created_at',
  publicFilter: { is_published: true },
});

export const publicRouter = Router();
publicRouter.get('/', ctrl.listPublic);

export const adminRouter = Router();
adminRouter.get('/', ctrl.listAdmin);
adminRouter.post('/', validateBody(upcomingProjectSchema), ctrl.create);
adminRouter.put('/:id', validateBody(upcomingProjectUpdateSchema), ctrl.update);
adminRouter.delete('/:id', ctrl.remove);
