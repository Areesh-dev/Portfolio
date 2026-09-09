import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sanitizeFields } from '../utils/sanitize.js';

export const submit = asyncHandler(async (req, res) => {
  const payload = sanitizeFields(req.body, ['name', 'company', 'subject', 'message']);
  const { data, error } = await supabaseAdmin
    .from('contact_enquiries')
    .insert({ ...payload, status: 'new' })
    .select()
    .single();
  if (error) throw new ApiError(400, error.message);
  res.status(201).json({ message: 'Message sent — thanks for reaching out!', enquiry: { id: data.id } });
});

export const listAdmin = asyncHandler(async (req, res) => {
  let query = supabaseAdmin.from('contact_enquiries').select('*').order('created_at', { ascending: false });
  if (req.query.status) {
    query = query.eq('status', req.query.status);
  }
  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);
  res.json(data);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('contact_enquiries')
    .update({ status: req.body.status })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) throw new ApiError(400, error.message);
  if (!data) throw new ApiError(404, 'Not found');
  res.json(data);
});

export const remove = asyncHandler(async (req, res) => {
  const { error } = await supabaseAdmin.from('contact_enquiries').delete().eq('id', req.params.id);
  if (error) throw new ApiError(400, error.message);
  res.status(204).end();
});
