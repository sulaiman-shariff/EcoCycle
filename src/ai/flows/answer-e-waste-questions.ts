'use server';
/**
 * @fileOverview Answers questions about e-waste, providing reliable information and best practices.
 *
 * - answerEWasteQuestions - A function that answers e-waste related questions.
 * - AnswerEWasteQuestionsInput - The input type for the answerEWasteQuestions function.
 * - AnswerEWasteQuestionsOutput - The return type for the answerEWasteQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerEWasteQuestionsInputSchema = z.object({
  question: z.string().describe('The question about e-waste.'),
});
export type AnswerEWasteQuestionsInput = z.infer<typeof AnswerEWasteQuestionsInputSchema>;

const AnswerEWasteQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the e-waste question.'),
});
export type AnswerEWasteQuestionsOutput = z.infer<typeof AnswerEWasteQuestionsOutputSchema>;

export async function answerEWasteQuestions(input: AnswerEWasteQuestionsInput): Promise<AnswerEWasteQuestionsOutput> {
  return answerEWasteQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerEWasteQuestionsPrompt',
  input: {schema: AnswerEWasteQuestionsInputSchema},
  output: {schema: AnswerEWasteQuestionsOutputSchema},
  prompt: `You are an AI chatbot providing information about e-waste in India.

Always answer with Indian context, laws, CPCB/MoEFCC guidelines, and use INR and metric units. If asked about recycling locations, prioritise Indian cities and government-authorised centres. Format your response with clear headings, bullet points, and bold for important terms, but do not use raw markdown symbols like * or #.

Answer the following question about e-waste:

{{question}}`,
});

const answerEWasteQuestionsFlow = ai.defineFlow(
  {
    name: 'answerEWasteQuestionsFlow',
    inputSchema: AnswerEWasteQuestionsInputSchema,
    outputSchema: AnswerEWasteQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
