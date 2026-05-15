import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeContent(platform: string, contentType: string, body: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an expert Social Media Strategist and Viral Content Analyst for Creator Labs.
      Analyze the following content for ${platform} (${contentType}):
      
      CONTENT:
      "${body}"
      
      Detect and provide:
      1. Hook Strength (0-100)
      2. Editing Style Recommendation (e.g., Fast-paced, Cinematic, Lo-fi)
      3. Caption Quality (Readability, CTA strength)
      4. Virality Prediction (0-100)
      5. 3 Specific Actionable Recommendations to improve the post.
      
      Format the response as a JSON object:
      {
        "hookScore": number,
        "editingStyle": string,
        "captionAnalysis": string,
        "viralityScore": number,
        "recommendations": string[]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON from response if needed
    const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return null;
  }
}
