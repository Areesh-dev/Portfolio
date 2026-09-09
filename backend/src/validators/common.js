import { z } from 'zod';

export const uuid = z.string().uuid();

// Any DB column that's optional comes back from Supabase as `null` (not
// `undefined`) once it's been read and re-submitted unchanged by an admin
// form. Every "optional" field below must therefore accept null, undefined,
// AND '' — not just the latter two — or a round-tripped form save fails
// validation on every field the admin never touched.
const optional = (schema) => schema.optional().nullable().or(z.literal(''));

export const optionalUrl = optional(z.string().trim().url().max(2048));

export const optionalEmail = optional(z.string().trim().email().max(255));

export const optionalText = (max = 255) => optional(z.string().trim().max(max));

export const nonEmptyString = (max = 255) => z.string().trim().min(1).max(max);
