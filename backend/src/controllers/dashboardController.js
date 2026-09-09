import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const count = async (table, filters = {}) => {
  let query = supabaseAdmin.from(table).select('*', { count: 'exact', head: true });
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value);
  }
  const { count: total, error } = await query;
  if (error) throw new ApiError(500, error.message);
  return total || 0;
};

export const getStats = asyncHandler(async (req, res) => {
  const [
    totalServices,
    totalSkills,
    totalProjects,
    publishedProjects,
    upcomingProjects,
    approvedReviews,
    pendingReviews,
    totalEnquiries,
    newEnquiries,
  ] = await Promise.all([
    count('services'),
    count('skills'),
    count('projects'),
    count('projects', { is_published: true }),
    count('upcoming_projects', { is_published: true }),
    count('reviews', { is_approved: true }),
    count('reviews', { is_approved: false }),
    count('contact_enquiries'),
    count('contact_enquiries', { status: 'new' }),
  ]);

  res.json({
    totalServices,
    totalSkills,
    totalProjects,
    publishedProjects,
    upcomingProjects,
    approvedReviews,
    pendingReviews,
    totalEnquiries,
    newEnquiries,
  });
});
