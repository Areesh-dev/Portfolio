import { z } from 'zod';
import { nonEmptyString, optionalText, optionalUrl } from './common.js';

export const projectSchema = z.object({
  title: nonEmptyString(200),
  slug: optionalText(200),
  short_description: optionalText(500),
  full_description: optionalText(5000),
  featured_image: optionalUrl,
  category: optionalText(100),
  technologies: z.array(z.string().trim().min(1).max(50)).default([]),
  github_url: optionalUrl,
  live_url: optionalUrl,
  project_date: optionalText(50),
  featured: z.boolean().default(false),
  display_order: z.number().int().min(0).default(0),
  is_published: z.boolean().default(false),
});

export const projectUpdateSchema = projectSchema.partial();

export const projectImageSchema = z.object({
  image_url: z.string().trim().url().max(2048),
  caption: optionalText(300),
  display_order: z.number().int().min(0).default(0),
});
