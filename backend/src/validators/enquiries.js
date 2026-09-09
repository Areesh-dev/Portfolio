import { z } from 'zod';
import { nonEmptyString } from './common.js';

export const enquirySchema = z.object({
  name: nonEmptyString(150),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  company: z.string().trim().max(150).optional().or(z.literal('')),
  subject: nonEmptyString(200),
  message: nonEmptyString(3000),
});

export const enquiryStatusSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']),
});
