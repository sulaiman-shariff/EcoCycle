'use server';

import { answerEWasteQuestions, type AnswerEWasteQuestionsInput, type AnswerEWasteQuestionsOutput } from '@/ai/flows/answer-e-waste-questions';
import { getImpactInsights, type GetImpactInsightsOutput, type GetImpactInsightsInput } from '@/ai/flows/get-impact-insights';

export async function askAiAction(data: AnswerEWasteQuestionsInput): Promise<{ result?: AnswerEWasteQuestionsOutput; error?: string }> {
  try {
    const response = await answerEWasteQuestions(data);
    return { result: response };
  } catch (e) {
    console.error(e);
    return { error: "Failed to get an answer. The AI model might be unavailable. Please try again later." };
  }
}

export async function calculateImpactAction(data: GetImpactInsightsInput): Promise<{ result?: GetImpactInsightsOutput; error?: string }> {
  try {
    const insights = await getImpactInsights(data);
    return { result: insights };
  } catch (e) {
    console.error(e);
    return { error: "Failed to get insights. The AI model might be unavailable. Please try again later." };
  }
}
