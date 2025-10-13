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
import { googleAI } from '@genkit-ai/google-genai';

const GenerateSignGesturesInputSchema = z.object({
  spokenWords: z.string().describe('The spoken words to be translated into sign language gestures.'),
});
export type GenerateSignGesturesInput = z.infer<typeof GenerateSignGesturesInputSchema>;

const GenerateSignGesturesOutputSchema = z.object({
  signLanguageVideoDataUri: z.string().describe(
    'A data URI of a video representing the sign language gesture. Expected format: data:video/mp4;base64,<encoded_data>.'
  ),
});
export type GenerateSignGesturesOutput = z.infer<typeof GenerateSignGesturesOutputSchema>;

export async function generateSignGestures(input: GenerateSignGesturesInput): Promise<GenerateSignGesturesOutput> {
  return generateSignGesturesFlow(input);
}

const generateSignGesturesFlow = ai.defineFlow(
  {
    name: 'generateSignGesturesFlow',
    inputSchema: GenerateSignGesturesInputSchema,
    outputSchema: GenerateSignGesturesOutputSchema,
  },
  async ({spokenWords}) => {
    let { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: `A 3D animated avatar performing the sign language gesture for the words: "${spokenWords}". The background should be a clean, solid light gray. The avatar should be clearly visible.`,
        config: {
            durationSeconds: 5,
            aspectRatio: '1:1',
        },
    });

    if (!operation) {
        throw new Error('Video generation failed to start.');
    }

    // Poll for completion
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
        operation = await ai.checkOperation(operation);
    }
    
    if (operation.error) {
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }
    
    const videoPart = operation.output?.message?.content.find(p => !!p.media && p.media.contentType?.startsWith('video/'));

    if (!videoPart || !videoPart.media) {
        throw new Error('No video was generated.');
    }

    return {
        signLanguageVideoDataUri: videoPart.media.url
    };
  }
);
