'use server';

/**
 * @fileOverview Generates sign language gestures from spoken words.
 *
 * - generateSignGestures - A function that generates sign language gestures from text.
 * - GenerateSignGesturesInput - The input type for the generateSignGestures function.
 * - GenerateSignGesturesOutput - The return type for the generateSignGestures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSignGesturesInputSchema = z.object({
  spokenWords: z.string().describe('The spoken words to be translated into sign language gestures.'),
});
export type GenerateSignGesturesInput = z.infer<typeof GenerateSignGesturesInputSchema>;

const GenerateSignGesturesOutputSchema = z.object({
  signLanguageGesturesDataUri: z.string().describe(
    'A data URI of an image representing the sign language gesture. Expected format: data:image/png;base64,<encoded_data>.'
  ),
});
export type GenerateSignGes...