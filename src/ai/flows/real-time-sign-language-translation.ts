'use server';
/**
 * @fileOverview A real-time sign language translation AI agent.
 *
 * - translateSignLanguage - A function that translates sign language gestures into text.
 * - TranslateSignLanguageInput - The input type for the translateSignLanguage function.
 * - TranslateSignLanguageOutput - The return type for the translateSignLanguage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateSignLanguageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A frame from the live video feed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranslateSignLanguageInput = z.infer<typeof TranslateSignLanguageInputSchema>;

const TranslateSignLanguageOutputSchema = z.object({
  detectedText: z.string().describe('The text translated from the sign language gestures.'),
});
export type TranslateSignLanguageOutput = z.infer<typeof TranslateSignLanguageOutputSchema>;

export async function translateSignLanguage(input: TranslateSignLanguageInput): Promise<TranslateSignLanguageOutput> {
  return translateSignLanguageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateSignLanguagePrompt',
  input: {schema: TranslateSignLanguageInputSchema},
  output: {schema: TranslateSignLanguageOutputSchema},
  prompt: `You are an expert in sign language translation.

You will receive a frame from a live video feed. Your task is to identify the sign language gestures in the frame and translate them into text.

Here is the frame:
{{media url=imageDataUri}}

Translation:`, //Just translate the gesture into text, nothing else.
});

const translateSignLanguageFlow = ai.defineFlow(
  {
    name: 'translateSignLanguageFlow',
    inputSchema: TranslateSignLanguageInputSchema,
    outputSchema: TranslateSignLanguageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
