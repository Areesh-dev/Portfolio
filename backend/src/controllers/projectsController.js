import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify, uniqueSlug } from '../utils/slugify.js';

const slugExists = async (slug, excludeId) => {
  let query = supabaseAdmin.from('projects').select('id').eq('slug', slug).limit(1);
  if (excludeId) query = query.neq('id', excludeId);
  const { data } = await query;
  return Boolean(data?.length);
};

export const listPublic = asyncHandler(async (req, res) => {
  let query = supabaseAdmin
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });
  if (req.query.featured === 'true') {
    query = query.eq('featured', true);
  }
  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);
  res.json(data);
});

export const getBySlugPublic = asyncHandler(async (req, res) => {
  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('slug', req.params.slug)
    .eq('is_published', true)
    .single();
  if (error || !project) throw new ApiError(404, 'Project not found');

  const { data: images } = await supabaseAdmin
    .from('project_images')
    .select('*')
    .eq('project_id', project.id)
    .order('display_order', { ascending: true });

  res.json({ ...project, images: images || [] });
});

export const listAdmin = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw new ApiError(500, error.message);
  res.json(data);
});

export const getByIdAdmin = asyncHandler(async (req, res) => {
  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error || !project) throw new ApiError(404, 'Project not found');

  const { data: images } = await supabaseAdmin
    .from('project_images')
    .select('*')
    .eq('project_id', project.id)
    .order('display_order', { ascending: true });

  res.json({ ...project, images: images || [] });
});

export const create = asyncHandler(async (req, res) => {
  const { slug: requestedSlug, ...rest } = req.body;
  const base = requestedSlug ? slugify(requestedSlug) : slugify(rest.title);
  const slug = await uniqueSlug(base, (candidate) => slugExists(candidate));

  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert({ ...rest, slug })
    .select()
    .single();
  if (error) throw new ApiError(400, error.message);
  res.status(201).json(data);
});

export const update = asyncHandler(async (req, res) => {
  const { slug: requestedSlug, ...rest } = req.body;
  const payload = { ...rest };

  if (requestedSlug) {
    const base = slugify(requestedSlug);
    payload.slug = await uniqueSlug(base, (candidate) => slugExists(candidate, req.params.id));
  }

  const { data, error } = await supabaseAdmin
    .from('projects')
    .update(payload)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) throw new ApiError(400, error.message);
  if (!data) throw new ApiError(404, 'Not found');
  res.json(data);
});

export const remove = asyncHandler(async (req, res) => {
  const { error } = await supabaseAdmin.from('projects').delete().eq('id', req.params.id);
  if (error) throw new ApiError(400, error.message);
  res.status(204).end();
});

export const addImage = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('project_images')
    .insert({ ...req.body, project_id: req.params.id })
    .select()
    .single();
  if (error) throw new ApiError(400, error.message);
  res.status(201).json(data);
});

export const removeImage = asyncHandler(async (req, res) => {
  const { error } = await supabaseAdmin
    .from('project_images')
    .delete()
    .eq('id', req.params.imageId)
    .eq('project_id', req.params.id);
  if (error) throw new ApiError(400, error.message);
  res.status(204).end();
});
