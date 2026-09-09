import { z } from 'zod';
import { optionalEmail, optionalText, optionalUrl } from './common.js';

export const siteSettingsSchema = z
  .object({
    site_title: optionalText(150),
    site_tagline: optionalText(300),
    hero_heading: optionalText(200),
    hero_subheading: optionalText(200),
    hero_intro: optionalText(1000),
    hero_image_url: optionalUrl,
    hero_video_url: optionalUrl,
    about_heading: optionalText(200),
    about_description: optionalText(3000),
    about_image_url: optionalUrl,
    about_philosophy: optionalText(2000),
    about_learning_journey: optionalText(2000),
    contact_email: optionalEmail,
    contact_phone: optionalText(50),
    contact_location: optionalText(200),
    resume_file_url: optionalUrl,
    seo_meta_description: optionalText(300),
  })
  .partial();

export const socialLinkSchema = z.object({
  platform: z.enum(['github', 'linkedin', 'instagram', 'twitter', 'facebook', 'email', 'website', 'other']),
  url: z.string().trim().min(1).max(2048),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export const socialLinkUpdateSchema = socialLinkSchema.partial();
