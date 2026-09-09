import { z } from 'zod';
import { nonEmptyString, optionalText, optionalUrl } from './common.js';

export const serviceSchema = z.object({
  title: nonEmptyString(150),
  description: optionalText(2000),
  icon: optionalText(100),
  image_url: optionalUrl,
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export const serviceUpdateSchema = serviceSchema.partial();
