import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';

import * as services from './services.js';
import * as skills from './skills.js';
import * as resume from './resume.js';
import * as projects from './projects.js';
import * as upcomingProjects from './upcomingProjects.js';
import * as reviews from './reviews.js';
import * as enquiries from './enquiries.js';
import * as siteContent from './siteContent.js';
import * as upload from './upload.js';
import * as dashboard from './dashboard.js';
import * as adminMeta from './adminMeta.js';

export const apiRouter = Router();

// ── Public routes (read-only, filtered to active/published/approved rows) ──
apiRouter.use('/services', services.publicRouter);
apiRouter.use('/skills', skills.publicRouter);
apiRouter.use('/resume', resume.publicRouter);
apiRouter.use('/projects', projects.publicRouter);
apiRouter.use('/upcoming-projects', upcomingProjects.publicRouter);
apiRouter.use('/reviews', reviews.publicRouter);
apiRouter.use('/enquiries', enquiries.publicRouter);
apiRouter.use('/site-content', siteContent.publicRouter);

// ── Admin routes — every one of these requires a valid Supabase session
// belonging to ADMIN_EMAIL, enforced server-side by requireAdmin. ──
apiRouter.use('/admin/me', requireAdmin, adminMeta.adminRouter);
apiRouter.use('/admin/dashboard', requireAdmin, dashboard.adminRouter);
apiRouter.use('/admin/services', requireAdmin, services.adminRouter);
apiRouter.use('/admin/skills', requireAdmin, skills.adminRouter);
apiRouter.use('/admin/resume', requireAdmin, resume.adminRouter);
apiRouter.use('/admin/projects', requireAdmin, projects.adminRouter);
apiRouter.use('/admin/upcoming-projects', requireAdmin, upcomingProjects.adminRouter);
apiRouter.use('/admin/reviews', requireAdmin, reviews.adminRouter);
apiRouter.use('/admin/enquiries', requireAdmin, enquiries.adminRouter);
apiRouter.use('/admin/site-content', requireAdmin, siteContent.adminRouter);
apiRouter.use('/admin/upload', requireAdmin, upload.adminRouter);
