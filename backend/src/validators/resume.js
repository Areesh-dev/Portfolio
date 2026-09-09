import { z } from 'zod';
import { nonEmptyString, optionalText } from './common.js';

export const experienceSchema = z.object({
  position: nonEmptyString(150),
  organization: nonEmptyString(150),
  start_date: z.string().trim().min(1),
  end_date: optionalText(50),
  description: optionalText(2000),
  location: optionalText(150),
  display_order: z.number().int().min(0).default(0),
});
export const experienceUpdateSchema = experienceSchema.partial();

export const educationSchema = z.object({
  degree: nonEmptyString(150),
  institution: nonEmptyString(150),
  start_date: z.string().trim().min(1),
  end_date: optionalText(50),
  description: optionalText(2000),
  location: optionalText(150),
  display_order: z.number().int().min(0).default(0),
});
export const educationUpdateSchema = educationSchema.partial();
