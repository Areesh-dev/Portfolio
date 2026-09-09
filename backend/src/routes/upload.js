import { Router } from 'express';
import multer from 'multer';
import { upload } from '../controllers/uploadController.js';

// Multer's own cap just needs to be >= the largest per-bucket limit in
// storageService.js (currently the 60MB hero-video bucket) — the real,
// bucket-specific limit is enforced there.
const memoryUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 60 * 1024 * 1024 } });

export const adminRouter = Router();
adminRouter.post('/:bucket', memoryUpload.single('file'), upload);
