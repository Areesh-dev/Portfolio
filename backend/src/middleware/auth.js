import { supabaseAdmin } from '../config/supabase.js';
import { env } from '../config/env.js';
import { ApiError } from './errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Verifies the Supabase access token AND that the authenticated user's email
// matches ADMIN_EMAIL. Frontend-only role flags are never trusted — this is
// the single server-side gate every admin route passes through.
export const requireAdmin = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, 'Missing authorization token');
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    throw new ApiError(401, 'Invalid or expired session');
  }

  const email = data.user.email?.toLowerCase();
  if (email !== env.adminEmail) {
    throw new ApiError(403, 'Not authorized as admin');
  }

  req.admin = { id: data.user.id, email };
  next();
});
