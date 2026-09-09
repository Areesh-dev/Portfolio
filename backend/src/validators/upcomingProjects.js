import { z } from 'zod';
import { nonEmptyString, optionalText, optionalUrl } from './common.js';

export const upcomingProjectSchema = z.object({
  title: nonEmptyString(200),
  description: optionalText(2000),
  image_url: optionalUrl,
  technologies: z.array(z.string().trim().min(1).max(50)).default([]),
  status: z.enum(['planning', 'in-progress', 'on-hold']).default('planning'),
  timeline: optionalText(150),
  launch_date: optionalText(50),
  progress: z.number().int().min(0).max(100).default(0),
  is_published: z.boolean().default(false),
});

export const upcomingProjectUpdateSchema = upcomingProjectSchema.partial();
