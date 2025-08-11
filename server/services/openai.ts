import OpenAI from "openai";
import { getRandomFallbackExcuse } from "../../shared/fallback-excuses.js";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || ""
});

export interface ExcuseGenerationResponse {
  excuse: string;
  believability: number;
  source: "ai" | "fallback";
}

export async function generateExcuse(
  category: string,
  tone: string
): Promise<ExcuseGenerationResponse> {
  // Always try fallback first for faster response and better reliability
  const fallbackExcuse = getRandomFallbackExcuse(category, tone);
  
  // Only use AI for extra variety occasionally (30% chance) and if API key exists
  const useAI = Math.random() < 0.3 && (process.env.OPENAI_API_KEY || process.env.OPENAI_KEY);
  
  if (!useAI) {
    return {
      excuse: fallbackExcuse,
      believability: Math.floor(Math.random() * 3) + 8, // 8-10 for high believability
      source: "fallback"
    };
  }
  const categoryPrompts: Record<string, string> = {
    work: "a work-related emergency that requires immediate attention",
    family: "a family emergency or urgent family matter",
    health: "a health concern or medical issue",
    transport: "a transportation problem or vehicle issue"
  };

  const tonePrompts: Record<string, string> = {
    friendly: "polite, apologetic, and understanding tone",
    urgent: "urgent and serious tone that conveys real emergency",
    subtle: "casual and understated tone that doesn't draw attention"
  };

  const prompt = `Generate a believable excuse for leaving a social situation immediately. 

Context: The person needs to leave because of ${categoryPrompts[category] || "an emergency situation"}.
Tone: Use a ${tonePrompts[tone] || "polite"}.

Requirements:
- Keep it under 50 words
- Make it sound natural and conversational
- Include enough detail to be believable but not overly specific
- Suitable for texting or speaking aloud
- Should feel authentic and not rehearsed

Respond with JSON in this exact format:
{
  "excuse": "the generated excuse text",
  "believability": number between 1-10 indicating how believable this excuse sounds
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at creating believable, helpful excuses for people who need to safely exit uncomfortable social situations. Your responses help people prioritize their safety and comfort."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      excuse: result.excuse || fallbackExcuse,
      believability: Math.max(1, Math.min(10, result.believability || 7)),
      source: "ai"
    };
  } catch (error) {
    console.error("OpenAI API error, using fallback:", error);
    return {
      excuse: fallbackExcuse,
      believability: Math.floor(Math.random() * 3) + 8, // 8-10 for high believability
      source: "fallback"
    };
  }
}
