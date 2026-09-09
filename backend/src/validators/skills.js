import { z } from 'zod';
import { nonEmptyString, optionalText } from './common.js';

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Cloud', 'Tools', 'UI/UX', 'Other'];

export const skillSchema = z.object({
  name: nonEmptyString(100),
  category: z.enum(CATEGORIES),
  proficiency: z.number().int().min(0).max(100).optional().nullable(),
  icon: optionalText(100),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export const skillUpdateSchema = skillSchema.partial();
