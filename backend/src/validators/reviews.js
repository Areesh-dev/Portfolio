import { z } from 'zod';
import { nonEmptyString, optionalText, optionalUrl } from './common.js';

export const reviewSchema = z.object({
  client_name: nonEmptyString(150),
  client_role: optionalText(150),
  company: optionalText(150),
  profile_image: optionalUrl,
  review_text: nonEmptyString(2000),
  rating: z.number().int().min(1).max(5),
});

