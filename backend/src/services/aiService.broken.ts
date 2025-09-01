import { ToneType } from '../types';

interface GenerateOptions {
  context: string;
  tone: ToneType;
  styleExamples?: string[];
}

class AIService {
  private tonePrompts: Record<ToneType, string> = {
    'calm-collected': 'Respond in a composed, rational, and level-headed manner. Stay logical and measured.',
    'aggressive': 'Be direct, forceful, and confrontational. Don\'t hold back your opinions.',
    'cunning': 'Be strategic, clever, and subtly manipulative. Use psychological tactics.',
    'girly': 'Be playful, emotional, and expressive. Use casual language with personality.',
    'sarcastic': 'Be witty, ironic, and mocking. Use clever sarcasm to make your points.',
    'intellectual': 'Be academic, sophisticated, and analytical. Use complex reasoning.',
    'casual': 'Be relaxed, informal, and conversational. Keep it simple and friendly.',
    'professional': 'Be formal, diplomatic, and business-like. Maintain professionalism.',
  };

  async generateResponses(options: GenerateOptions): Promise<string[]> {
    const { context, tone, styleExamples = [] } = options;
    
    // Analyze user's style if examples provided
    // const styleAnalysis = this.analyzeStyle(styleExamples);
    
    // Create the prompt (for future OpenAI API integration)
    // const prompt = this.buildPrompt(context, tone, styleAnalysis);
    
    // For development, return mock responses
    // In production, this would call OpenAI API
    return this.getMockResponses(tone, context);
  }

  private analyzeStyle(examples: string[]): string {
    if (examples.length === 0) return '';
    
    // Simple style analysis (in production, this would be more sophisticated)
    const avgLength = examples.reduce((sum, ex) => sum + ex.length, 0) / examples.length;
    const hasEmojis = examples.some(ex => /[\u{1F300}-\u{1F9FF}]/u.test(ex));
    const hasQuestions = examples.some(ex => ex.includes('?'));
    
    let style = 'User writes ';
    if (avgLength < 50) style += 'short, concise messages. ';
    else if (avgLength > 150) style += 'detailed, longer messages. ';
    else style += 'medium-length messages. ';
    
    if (hasEmojis) style += 'Uses emojis occasionally. ';
    if (hasQuestions) style += 'Often asks questions. ';
    
    return style;
  }

  // For future OpenAI API integration
  // private buildPrompt(context: string, tone: ToneType, styleAnalysis: string): string {
    return `You are helping someone craft responses in an argument.

Context: ${context}
Tone: ${this.tonePrompts[tone]}
${styleAnalysis ? `User's Style: ${styleAnalysis}` : ''}

Generate 3 different response options that:
- Sound completely natural and human
- Avoid AI writing patterns (no em dashes, overly formal language, etc.)
- Match the specified tone effectively
- Help make the point persuasively
- Are conversational and authentic

Responses should be varied in approach but all effective.`;
  // }

  private getMockResponses(tone: ToneType, _context: string): string[] {
    // Mock responses for development
    const responses: Record<ToneType, string[]> = {
      'calm-collected': [
        "I understand your perspective, but let's look at the facts here. The evidence clearly shows a different picture than what you're suggesting.",
        "That's an interesting point, however, I think we need to consider the broader implications of what you're proposing.",
        "I appreciate your passion on this topic. Let me share some information that might help clarify the situation.",
      ],
      'aggressive': [
        "You're completely missing the point here. This is exactly the kind of thinking that causes these problems.",
        "Seriously? That's your argument? Come on, you know that doesn't make any sense when you actually think about it.",
        "No, just no. You can't seriously believe that. Let me explain why that's completely wrong.",
      ],
      'cunning': [
        "You know, you make a fascinating point. It reminds me of something similar... though the outcome wasn't quite what people expected.",
        "That's one way to look at it, certainly. Though I wonder if you've considered what happens when we apply that same logic elsewhere?",
        "Interesting. So if I understand correctly, you're saying... *rephrases in a way that subtly exposes flaws*",
      ],
      'girly': [
        "Okay but like, that's literally not what happened though? I was there and it was completely different lol",
        "Wait wait wait... are you seriously saying that? That's actually wild, no offense but that makes zero sense",
        "Hmm idk about that one bestie... sounds like you might be missing some pretty important details here",
      ],
      'sarcastic': [
        "Oh wow, what a groundbreaking observation. Nobody's ever thought of that before. Truly revolutionary.",
        "Right, because that worked out so well the last time someone tried it. What could possibly go wrong?",
        "Ah yes, the classic 'ignore all evidence to the contrary' approach. Bold strategy.",
      ],
      'intellectual': [
        "Your argument appears to rest on a fundamental misunderstanding of the underlying principles at play here. The research clearly demonstrates a different causal relationship.",
        "While your position has some superficial appeal, a deeper analysis reveals several logical inconsistencies that undermine your conclusion.",
        "The empirical evidence contradicts your assertion. Multiple peer-reviewed studies have consistently shown the opposite effect.",
      ],
      'casual': [
        "Yeah, I get where you're coming from, but honestly that's not really how it works in practice.",
        "Nah man, that's not quite right. From what I've seen, it actually goes more like this...",
        "I hear you, but there's more to it than that. The thing is...",
      ],
      'professional': [
        "I appreciate your input on this matter. However, I must respectfully disagree based on the available data and established best practices.",
        "Thank you for sharing your perspective. I'd like to offer an alternative viewpoint that takes into account several additional factors.",
        "While I understand your position, I believe we should consider the long-term implications and potential risks associated with that approach.",
      ],
    };

    return responses[tone] || responses['casual'];
  }
}

export default new AIService();