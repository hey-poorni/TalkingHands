'use server';

/**
 * @fileOverview Generates sign language gestures from spoken words using a 3D virtual hand avatar.
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
    'A data URI containing the 3D virtual hand avatar animation representing the sign language gestures. Expected format: data:<mimetype>;base64,<encoded_data>.'
  ),
});
export type GenerateSignGesturesOutput = z.infer<typeof GenerateSignGesturesOutputSchema>;

export async function generateSignGestures(input: GenerateSignGesturesInput): Promise<GenerateSignGesturesOutput> {
  return generateSignGesturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSignGesturesPrompt',
  input: {schema: GenerateSignGesturesInputSchema},
  output: {schema: GenerateSignGesturesOutputSchema},
  prompt: `You are a sign language expert. Generate the sign language gestures using a 3D virtual hand avatar animation in the form of data URI, given the spoken words: {{{spokenWords}}}. Return the data URI. Adhere to the output schema. If you cannot fulfill the request, return an empty data URI.`,
});

const generateSignGesturesFlow = ai.defineFlow(
  {
    name: 'generateSignGesturesFlow',
    inputSchema: GenerateSignGesturesInputSchema,
    outputSchema: GenerateSignGesturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
