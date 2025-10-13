'use server';

/**
 * @fileOverview An AI assistant that summarizes conversations.
 *
 * - summarizeConversation - A function that summarizes a conversation.
 * - SummarizeConversationInput - The input type for the summarizeConversation function.
 * - SummarizeConversationOutput - The return type for the summarizeConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConversationInputSchema = z.object({
  conversationText: z
    .string()
    .describe('The complete text of the conversation to summarize.'),
});
export type SummarizeConversationInput = z.infer<
  typeof SummarizeConversationInputSchema
>;

const SummarizeConversationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the conversation.'),
});
export type SummarizeConversationOutput = z.infer<
  typeof SummarizeConversationOutputSchema
>;

export async function summarizeConversation(
  input: SummarizeConversationInput
): Promise<SummarizeConversationOutput> {
  return summarizeConversationFlow(input);
}

const summarizeConversationPrompt = ai.definePrompt({
  name: 'summarizeConversationPrompt',
  input: {schema: SummarizeConversationInputSchema},
  output: {schema: SummarizeConversationOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing conversations.

  Please provide a concise summary of the following conversation:

  {{conversationText}}
  `,
});

const summarizeConversationFlow = ai.defineFlow(
  {
    name: 'summarizeConversationFlow',
    inputSchema: SummarizeConversationInputSchema,
    outputSchema: SummarizeConversationOutputSchema,
  },
  async input => {
    const {output} = await summarizeConversationPrompt(input);
    return output!;
  }
);
