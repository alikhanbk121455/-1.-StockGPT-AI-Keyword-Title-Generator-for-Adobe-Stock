
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A compelling, SEO-optimized title for an Adobe Stock image, under 150 characters."
    },
    keywords: {
      type: Type.ARRAY,
      description: "An array of 30 to 50 relevant and specific keywords, ranked by importance, for the stock image. Include conceptual, technical, and descriptive keywords.",
      items: {
        type: Type.STRING
      }
    },
    categories: {
      type: Type.ARRAY,
      description: "An array of 2-3 suitable Adobe Stock categories for the image.",
      items: {
        type: Type.STRING
      }
    }
  },
  required: ["title", "keywords", "categories"]
};


export const generateTagsForImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart] },
        config: {
            systemInstruction: `You are an expert AI assistant for Adobe Stock contributors. Your task is to analyze the provided image and generate metadata that will maximize its visibility and sales potential. Analyze the image's content, style, mood, composition, and potential use cases. Based on this analysis, provide the requested JSON object.`,
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
            temperature: 0.7,
        }
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
