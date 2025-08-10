import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || ""
});

export interface ExcuseGenerationResponse {
  excuse: string;
  believability: number;
}

export async function generateExcuse(
  category: string,
  tone: string
): Promise<ExcuseGenerationResponse> {
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
      excuse: result.excuse || "I'm sorry, I need to leave immediately due to an unexpected situation.",
      believability: Math.max(1, Math.min(10, result.believability || 7))
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Fallback excuses if API fails
    const fallbackExcuses: Record<string, string> = {
      work: "Sorry, my boss just called about an urgent project deadline I forgot about. I need to head home to work on it right away!",
      family: "I just got a call from my family - there's an emergency and they need me to come home immediately.",
      health: "I'm not feeling well suddenly. I think I should head home and rest before it gets worse.",
      transport: "My ride just texted that they need to leave now, and it's my only way home tonight."
    };

    return {
      excuse: fallbackExcuses[category] || fallbackExcuses.family,
      believability: 7
    };
  }
}
