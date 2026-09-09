import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sanitizeFields } from '../utils/sanitize.js';

export const listPublic = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('submitted_at', { ascending: false });
  if (error) throw new ApiError(500, error.message);
  res.json(data);
});

// Visitors can submit a testimonial; it stays pending until an admin
// approves it, so nothing unapproved is ever shown publicly.
export const submit = asyncHandler(async (req, res) => {
  const payload = sanitizeFields(req.body, ['client_name', 'client_role', 'company', 'review_text']);
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .insert({ ...payload, is_approved: false })
    .select()
    .single();
  if (error) throw new ApiError(400, error.message);
  res.status(201).json({ message: 'Thanks! Your review will appear once approved.', review: data });
});

export const listAdmin = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .order('submitted_at', { ascending: false });
  if (error) throw new ApiError(500, error.message);
  res.json(data);
});

export const approve = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .update({ is_approved: true })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) throw new ApiError(400, error.message);
  if (!data) throw new ApiError(404, 'Not found');
  res.json(data);
});

// Rejecting a pending review and deleting an approved one are the same
// operation — there's no separate "rejected" state to keep around.
export const remove = asyncHandler(async (req, res) => {
  const { error } = await supabaseAdmin.from('reviews').delete().eq('id', req.params.id);
  if (error) throw new ApiError(400, error.message);
  res.status(204).end();
});
