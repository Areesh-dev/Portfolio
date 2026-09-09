import { Router } from 'express';
import { createCrudController } from '../controllers/crudFactory.js';
import { validateBody } from '../middleware/validate.js';
import { skillSchema, skillUpdateSchema } from '../validators/skills.js';

const ctrl = createCrudController({ table: 'skills', publicFilter: { is_active: true } });

export const publicRouter = Router();
publicRouter.get('/', ctrl.listPublic);

export const adminRouter = Router();
adminRouter.get('/', ctrl.listAdmin);
adminRouter.post('/', validateBody(skillSchema), ctrl.create);
adminRouter.put('/:id', validateBody(skillUpdateSchema), ctrl.update);
adminRouter.delete('/:id', ctrl.remove);
