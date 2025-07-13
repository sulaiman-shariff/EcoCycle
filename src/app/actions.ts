'use server';

import { answerEWasteQuestions, type AnswerEWasteQuestionsInput, type AnswerEWasteQuestionsOutput } from '@/ai/flows/answer-e-waste-questions';
import { getImpactInsights, type GetImpactInsightsOutput, type GetImpactInsightsInput } from '@/ai/flows/get-impact-insights';
import { analyzeDeviceImage, type VisionAnalysisResult } from '@/lib/vision-api';
import { saveDeviceAnalysis } from '@/lib/firebase/firestore';

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
    return { error: "Failed to get insights. Please check your input and try again." };
  }
}

export async function analyzeDeviceAction(imageUrl: string, userId: string): Promise<{ result?: VisionAnalysisResult, error?: string}> {
  try {
    const result = await analyzeDeviceImage(imageUrl);
    
    // Save analysis to Firestore
    await saveDeviceAnalysis({
      userId: userId,
      imageUrl: imageUrl, // In a real app, you'd upload this and get a persistent URL
      analysisResult: result
    });

    return { result };
  } catch (e) {
    console.error(e);
    return { error: "Failed to analyze the device image." };
  }
}
