import { Router } from 'express';

// Lets the frontend confirm a session is a valid, authorized admin session
// right after login (requireAdmin has already run by the time this executes).
export const adminRouter = Router();
adminRouter.get('/', (req, res) => res.json({ admin: req.admin }));
