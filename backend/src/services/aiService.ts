import { ToneType } from '../types';
import OpenAI from 'openai';

interface GenerateOptions {
  context?: string; // For backward compatibility
  opponentPosition?: string;
  userPosition?: string;
  additionalContext?: string;
  tone: ToneType;
  customToneDescription?: string; // User's custom style description
  styleExamples?: string[];
}

class AIService {
  private openai: OpenAI | null = null;
  
  private tonePrompts: Record<ToneType, string> = {
    'calm-collected': 'Respond in a composed, rational, and level-headed manner. Stay logical and measured.',
    'aggressive': 'Be direct, forceful, and confrontational. Don\'t hold back your opinions.',
    'cunning': 'Be strategic, clever, and subtly manipulative. Use psychological tactics.',
    'girly': 'Be playful, emotional, and expressive. Use casual language with personality.',
    'custom': 'Adapt to the user\'s described style.',
    'nerd': 'Be academic, sophisticated, and analytical. Use complex reasoning.',
    'casual': 'Be relaxed, informal, and conversational. Keep it simple and friendly.',
    'professional': 'Be formal, diplomatic, and business-like. Maintain professionalism.',
  };

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('OpenAI API Key configured:', !!apiKey && apiKey !== 'your-openai-api-key-here');
    
    if (apiKey && apiKey !== 'your-openai-api-key-here') {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
      console.log('OpenAI client initialized successfully');
    } else {
      console.log('OpenAI not configured, using mock responses');
    }
  }

  async generateResponses(options: GenerateOptions): Promise<string[]> {
    const { context, opponentPosition, userPosition, additionalContext, tone, customToneDescription, styleExamples = [] } = options;
    
    // If OpenAI is configured, use it
    if (this.openai) {
      console.log('Using OpenAI API for response generation...');
      try {
        const responses = await this.generateWithOpenAI(context, opponentPosition, userPosition, additionalContext, tone, customToneDescription, styleExamples);
        console.log(`Generated ${responses.length} responses via OpenAI`);
        return responses;
      } catch (error: any) {
        console.error('OpenAI API error:', error.message || error);
        console.log('Falling back to mock responses');
        return this.getMockResponses(tone);
      }
    }
    
    // Otherwise use mock responses
    console.log('Using mock responses (OpenAI not configured)');
    return this.getMockResponses(tone);
  }

  private async generateWithOpenAI(context: string | undefined, opponentPosition: string | undefined, userPosition: string | undefined, additionalContext: string | undefined, tone: ToneType, customToneDescription: string | undefined, styleExamples: string[]): Promise<string[]> {
    if (!this.openai) throw new Error('OpenAI not configured');
    
    const styleAnalysis = this.analyzeStyle(styleExamples);
    const prompt = this.buildPrompt(context, opponentPosition, userPosition, additionalContext, tone, customToneDescription, styleAnalysis);
    
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-5-mini', // Using GPT-5-mini for fastest/cheapest performance
      messages: [
        {
          role: 'system',
          content: 'Generate exactly 3 different response options for an argument. Use THREE HYPHENS "---" on its own line to separate responses. Keep responses VERY concise (1-2 sentences max). CRITICAL: Never use em dashes (—) or double hyphens (--) within the responses themselves. Only use single hyphens (-) when needed. Be direct and output only the responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      // GPT-5 only supports default temperature (1.0)
      max_completion_tokens: 2000, // Increased for GPT-5's reasoning process
    });

    console.log('Full GPT-5 API response:', JSON.stringify(completion, null, 2));
    const responseText = completion.choices[0]?.message?.content || '';
    console.log('GPT-5 content:', responseText);
    
    const responses = responseText.split('---')
      .map(r => r.trim())
      .filter(r => r.length > 0)
      .map(r => {
        // Remove any em dashes or double hyphens that slipped through
        return r.replace(/—/g, ',') // Replace em dash with comma
                .replace(/--/g, ',') // Replace double hyphen with comma
                .replace(/\s,\s/g, ', ') // Clean up spacing around commas
                .replace(/,,/g, ','); // Remove double commas
      });
    console.log(`Parsed ${responses.length} responses from GPT-5`);
    
    // Ensure we have exactly 3 responses
    if (responses.length < 3) {
      console.log(`Only got ${responses.length} responses, padding with mock responses`);
      // Pad with mock responses if needed
      const mockResponses = this.getMockResponses(tone);
      while (responses.length < 3 && mockResponses.length > 0) {
        responses.push(mockResponses.shift()!);
      }
    }
    
    return responses.slice(0, 3);
  }

  private analyzeStyle(examples: string[]): string {
    if (examples.length === 0) return '';
    
    const avgLength = examples.reduce((sum, ex) => sum + ex.length, 0) / examples.length;
    const hasEmojis = examples.some(ex => /[\u{1F300}-\u{1F9FF}]/u.test(ex));
    const hasQuestions = examples.some(ex => ex.includes('?'));
    const hasExclamations = examples.some(ex => ex.includes('!'));
    const hasCapsWords = examples.some(ex => /\b[A-Z]{2,}\b/.test(ex));
    
    let style = 'User writes ';
    if (avgLength < 50) style += 'short, concise messages. ';
    else if (avgLength > 150) style += 'detailed, longer messages. ';
    else style += 'medium-length messages. ';
    
    if (hasEmojis) style += 'Uses emojis occasionally. ';
    if (hasQuestions) style += 'Often asks questions. ';
    if (hasExclamations) style += 'Uses exclamation marks for emphasis. ';
    if (hasCapsWords) style += 'Sometimes uses CAPS for emphasis. ';
    
    return style;
  }

  private buildPrompt(context: string | undefined, opponentPosition: string | undefined, userPosition: string | undefined, additionalContext: string | undefined, tone: ToneType, customToneDescription: string | undefined, styleAnalysis: string): string {
    // Check if this is a conversation context (has "Conversation so far:" in it)
    const isConversation = context && context.includes('Conversation so far:');
    
    // Common AI tells to avoid
    const avoidPatterns = `
CRITICAL - DO NOT use these common AI writing patterns:
- ABSOLUTELY NO em-dashes (—) ANYWHERE. Use commas, periods, or just start a new sentence instead
- ABSOLUTELY NO double hyphens (--) ANYWHERE
- If you need a dash, use only a single hyphen (-) sparingly
- NO "It's important to note/remember/consider"
- NO "However, ..." at the start of sentences
- NO "Furthermore," "Moreover," "Additionally," as transitions
- NO "In conclusion," "To summarize," "In essence,"
- NO "It's worth mentioning/noting"
- NO "That being said," or "With that said,"
- NO perfectly balanced sentence structures
- NO "On one hand... on the other hand"
- NO "While I understand..." openings
- NO "I appreciate your..." politeness formulas
- NO excessive hedging ("perhaps," "might," "could potentially")
- NO academic transitions ("Thus," "Therefore," "Hence")
- NO "Let me..." or "Allow me to..." phrases
- NO perfectly structured lists or bullet points in responses
- NO overly formal vocabulary when casual words work
- NO "nuanced" or "multifaceted" or similar academic terms
- NO symmetrical paragraph structures

INSTEAD, write like real people:
- Use casual contractions (can't, won't, doesn't)
- Start sentences with "And," "But," "So" sometimes
- Use simple words over complex ones
- Include minor typos or casual misspellings occasionally if matching user style
- Vary sentence length dramatically 
- Sometimes use fragments. Like this.
- Use "yeah," "nah," "honestly," "literally," naturally
- Express genuine emotion without formal distance`;
    
    const toneInstruction = tone === 'custom' && customToneDescription 
      ? `Tone to use: ${customToneDescription}`
      : `Tone to use: ${this.tonePrompts[tone]}`;
    
    if (isConversation && context) {
      return `${context}

${toneInstruction}
${styleAnalysis ? `User's communication style: ${styleAnalysis}` : ''}

${avoidPatterns}

You are helping the user in this argument. Generate 3 different response options that the user could send next:
- Respond directly to the opponent's latest message
- Stay consistent with the conversation flow
- Sound like an actual human wrote it
- Match the specified tone effectively
- Each option should take a slightly different approach or angle
- Keep responses VERY concise (1-2 sentences MAX, shorter is better)
- Write how people actually text/type, not how AIs write
- NEVER use em dashes (—) or double hyphens (--) in your responses
- Use commas, periods, or new sentences instead of dashes

Separate each response with exactly three hyphens "---" on its own line.`;
    } else if (opponentPosition && userPosition) {
      return `Opponent's position: ${opponentPosition}

Your position: ${userPosition}${additionalContext ? `

Additional context: ${additionalContext}` : ''}

${toneInstruction}
${styleAnalysis ? `User's communication style: ${styleAnalysis}` : ''}

${avoidPatterns}

Generate 3 different response options that:
- Sound like an actual human wrote them
- Match the specified tone effectively
- Help make the point persuasively
- Are conversational and authentic
- Each take a slightly different approach or angle
- Feel natural, not generated
- NEVER include em dashes (—) or double hyphens (--)
- Use commas or periods instead of dashes

Separate each response with exactly three hyphens "---" on its own line.`;
    } else if (context) {
      // Fallback for backward compatibility
      return `Context of the argument: ${context}

${toneInstruction}
${styleAnalysis ? `User's communication style: ${styleAnalysis}` : ''}

${avoidPatterns}

Generate 3 different response options that:
- Sound like an actual human wrote them
- Match the specified tone effectively
- Help make the point persuasively
- Are conversational and authentic
- Each take a slightly different approach or angle
- Feel natural, not generated
- NEVER include em dashes (—) or double hyphens (--)
- Use commas or periods instead of dashes

Separate each response with exactly three hyphens "---" on its own line.`;
    } else {
      throw new Error('Must provide either context or both positions');
    }
  }

  private getMockResponses(tone: ToneType): string[] {
    const responses: Record<ToneType, string[]> = {
      'calm-collected': [
        "The facts show something different than what you're suggesting.",
        "We need to consider the broader implications here.",
        "Let me share some information that clarifies this.",
      ],
      'aggressive': [
        "You're completely missing the point here.",
        "Seriously? That's your argument?",
        "You can't seriously believe that.",
      ],
      'cunning': [
        "Fascinating point. Reminds me of something similar with an unexpected outcome.",
        "Have you considered what happens when we apply that logic elsewhere?",
        "So you're saying that... *subtly exposes the flaw*",
      ],
      'girly': [
        "Okay but that's literally not what happened lol",
        "Wait are you seriously saying that? That's wild",
        "Idk about that one bestie, you're missing key details",
      ],
      'custom': [
        "Your response here, tailored to your unique style.",
        "Express yourself in your own distinctive way.",
        "Share your perspective with your personal touch.",
      ],
      'nerd': [
        "The research demonstrates a completely different causal relationship.",
        "Your analysis contains several logical inconsistencies.",
        "Multiple studies show the opposite effect.",
      ],
      'casual': [
        "Yeah but that's not how it works in practice.",
        "Nah man, that's not quite right.",
        "There's more to it than that.",
      ],
      'professional': [
        "I must respectfully disagree based on the available data.",
        "I'd like to offer an alternative viewpoint.",
        "We should consider the long-term implications of that approach.",
      ],
    };

    return responses[tone] || responses['casual'];
  }
}

export default new AIService();