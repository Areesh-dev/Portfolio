import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getPublic = asyncHandler(async (req, res) => {
  const [{ data: settings, error: settingsError }, { data: socialLinks, error: linksError }] = await Promise.all([
    supabaseAdmin.from('site_settings').select('*').eq('id', 1).single(),
    supabaseAdmin
      .from('social_links')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true }),
  ]);
  if (settingsError) throw new ApiError(500, settingsError.message);
  if (linksError) throw new ApiError(500, linksError.message);
  res.json({ ...settings, social_links: socialLinks || [] });
});

export const getAdmin = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin.from('site_settings').select('*').eq('id', 1).single();
  if (error) throw new ApiError(500, error.message);
  res.json(data);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .update(req.body)
    .eq('id', 1)
    .select()
    .single();
  if (error) throw new ApiError(400, error.message);
  res.json(data);
});
