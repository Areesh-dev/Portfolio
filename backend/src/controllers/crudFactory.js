import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Generic CRUD handlers for the simple admin-managed lists (services,
// skills, experiences, education, upcoming_projects, social_links) that all
// share the same shape: a table with display_order, optional visibility
// flag, and no cross-table relations. Resources with real relations or
// extra behaviour (projects, reviews, enquiries) get dedicated controllers.
export const createCrudController = ({ table, orderBy = 'display_order', publicFilter = null }) => {
  const listPublic = asyncHandler(async (req, res) => {
    let query = supabaseAdmin.from(table).select('*').order(orderBy, { ascending: true });
    if (publicFilter) {
      for (const [key, value] of Object.entries(publicFilter)) {
        query = query.eq(key, value);
      }
    }
    const { data, error } = await query;
    if (error) throw new ApiError(500, error.message);
    res.json(data);
  });

  const listAdmin = asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin.from(table).select('*').order(orderBy, { ascending: true });
    if (error) throw new ApiError(500, error.message);
    res.json(data);
  });

  const create = asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin.from(table).insert(req.body).select().single();
    if (error) throw new ApiError(400, error.message);
    res.status(201).json(data);
  });

  const update = asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin
      .from(table)
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw new ApiError(400, error.message);
    if (!data) throw new ApiError(404, 'Not found');
    res.json(data);
  });

  const remove = asyncHandler(async (req, res) => {
    const { error } = await supabaseAdmin.from(table).delete().eq('id', req.params.id);
    if (error) throw new ApiError(400, error.message);
    res.status(204).end();
  });

  return { listPublic, listAdmin, create, update, remove };
};
