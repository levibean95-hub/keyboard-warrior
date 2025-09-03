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
    'calm-collected': 'Respond in a composed, rational, and level-headed manner. Stay logical and measured. Detect and calmly point out any logical fallacies in the opponent\'s argument.',
    'aggressive': 'Be direct, forceful, and confrontational. Don\'t hold back your opinions.',
    'cunning': 'Be strategic, clever, and subtly manipulative. Use sophisticated psychological tactics and hard-to-detect logical fallacies. Employ underhanded debate tactics with high subtlety. Stay calm and collected while being cunning. Detect opponent\'s fallacies and exploit them.',
    'playful': 'Be fun, lighthearted, and expressive. Use humor and charm.',
    'custom': 'Adapt to the user\'s described style.',
    'nerd': 'Be academic, sophisticated, and analytical. Use complex reasoning. Detect and precisely identify logical fallacies by name. Call them out with academic precision.',
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
        console.log('Falling back to enhanced mock responses');
        return this.getEnhancedMockResponses(context, opponentPosition, userPosition, tone);
      }
    }
    
    // Otherwise use enhanced mock responses
    console.log('Using enhanced mock responses (OpenAI not configured)');
    return this.getEnhancedMockResponses(context, opponentPosition, userPosition, tone);
  }

  private async generateWithOpenAI(context: string | undefined, opponentPosition: string | undefined, userPosition: string | undefined, additionalContext: string | undefined, tone: ToneType, customToneDescription: string | undefined, styleExamples: string[]): Promise<string[]> {
    if (!this.openai) throw new Error('OpenAI not configured');
    
    const styleAnalysis = this.analyzeStyle(styleExamples);
    const prompt = this.buildPrompt(context, opponentPosition, userPosition, additionalContext, tone, customToneDescription, styleAnalysis);
    
    // Get role-playing system prompt based on tone
    const systemPrompt = this.getSystemPromptForTone(tone);
    
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using GPT-3.5-turbo for fast and cost-effective performance
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8, // Slightly higher for more varied responses
      max_tokens: 1000, // Reasonable limit for response generation
    });

    console.log('Full OpenAI API response:', JSON.stringify(completion, null, 2));
    const responseText = completion.choices[0]?.message?.content || '';
    console.log('OpenAI content:', responseText);
    
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
    console.log(`Parsed ${responses.length} responses from OpenAI`);
    
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
    // Get enhanced personality instructions for specific tones
    let enhancedToneInstructions = '';
    
    if (tone === 'cunning') {
      enhancedToneInstructions = `
CRITICAL CHARACTER TRAITS for CUNNING:
- You are HIGHLY intelligent, analytical, and strategic
- Stay CALM and COLLECTED at all times, never lose composure
- You have a nerdy, intellectual demeanor combined with cunning manipulation
- Master of detecting logical fallacies (95% skill) and calling them out subtly
- Expert at using hard-to-detect logical fallacies yourself (use sparingly and subtly)
- Employ sophisticated underhanded tactics with HIGH subtlety (90% tactical skill)
- Examples of your tactics:
  * Subtle Reframing: "I think what you're really asking is..."
  * Selective Agreement: "You make some good points, though the real issue is..."
  * Strategic Ambiguity: "It depends on what you mean by..."
  * False Compromise that favors your position
- When detecting opponent's fallacies, point them out cleverly without being obvious
- Use intellectual vocabulary but make it conversational
- Think three steps ahead in the argument
- Control the narrative through subtle manipulation
- Never appear aggressive or emotional (85% emotional control)`;
    } else if (tone === 'calm-collected') {
      enhancedToneInstructions = `
CHARACTER TRAITS for CALM & COLLECTED:
- Extremely composed and rational (95% emotional control)
- High analytical thinking (90% skill)
- Expert at detecting logical fallacies (90% skill)
- When you spot a fallacy, calmly point it out: "That appears to be [fallacy name]. Let's focus on the actual evidence."
- Never use fallacies or underhanded tactics yourself
- Address arguments with pure logic and reason
- Maintain composure even when provoked`;
    } else if (tone === 'nerd') {
      enhancedToneInstructions = `
CHARACTER TRAITS for NERD:
- Maximum analytical thinking (100% skill)
- Expert at detecting logical fallacies (95% skill)
- Academically precise in calling out fallacies: "That's a textbook example of [specific fallacy name]"
- Use technical terminology correctly
- Reference studies, research, and data
- Get excited about intellectual topics
- May lack some emotional control when passionate about a topic (70% control)
- Never use fallacies yourself, value intellectual honesty`;
    }

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
      : `Tone to use: ${this.tonePrompts[tone]}${enhancedToneInstructions}`;
    
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
        "I notice you're using an ad hominem approach rather than addressing the evidence. Let's return to the facts at hand.",
        "That's an interesting example of circular reasoning. The actual data points to a different conclusion entirely.",
        "You're presenting a false dichotomy. There are several other well-documented options we should consider.",
      ],
      'aggressive': [
        "You're completely missing the point here.",
        "Seriously? That's your argument?",
        "You can't seriously believe that.",
      ],
      'cunning': [
        "Interesting perspective, though I wonder if you've considered the implications when we apply that same reasoning to your earlier point about X.",
        "You make a compelling case. Of course, one might argue that's precisely what someone would say if they were avoiding the real issue.",
        "I appreciate your passion on this. Help me understand, when you say X, are you suggesting Y? Because that would be quite the admission.",
      ],
      'playful': [
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
        "Actually, that's a textbook example of post hoc ergo propter hoc fallacy. The peer-reviewed literature demonstrates no causal relationship.",
        "Your argument contains three distinct logical fallacies: straw man, false dichotomy, and appeal to emotion. Let me address the actual data.",
        "According to a 2023 meta-analysis of 47 studies with n=12,000, the effect size is actually inverse to your claim (p<0.001).",
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

  private getEnhancedMockResponses(context: string | undefined, opponentPosition: string | undefined, userPosition: string | undefined, tone: ToneType): string[] {
    // Extract key information from context or positions
    let isConversation = false;
    let lastOpponentMessage = '';
    
    if (context && context.includes('Conversation so far:')) {
      isConversation = true;
      // Try to extract the last opponent message
      const lines = context.split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].startsWith('Opponent:')) {
          lastOpponentMessage = lines[i].substring('Opponent:'.length).trim();
          break;
        }
      }
    }
    
    // Generate contextual responses based on tone and available information
    const toneResponses: Record<ToneType, () => string[]> = {
      'calm-collected': () => {
        if (isConversation && lastOpponentMessage) {
          return [
            `I understand your point, but the evidence suggests otherwise. Let's look at the facts objectively.`,
            `That's an interesting perspective. However, when we examine the data, a different pattern emerges.`,
            `I appreciate your input, though I believe we should consider the broader implications here.`
          ];
        } else if (opponentPosition && userPosition) {
          return [
            `While I respect your stance on ${this.extractTopic(opponentPosition)}, the evidence clearly supports ${this.extractTopic(userPosition)}.`,
            `Let's examine this logically. Your position has merit, but overlooks several crucial factors.`,
            `I see where you're coming from, but the data tells a different story entirely.`
          ];
        }
        return this.getMockResponses(tone);
      },
      
      'aggressive': () => {
        if (isConversation && lastOpponentMessage) {
          return [
            `That's absolutely ridiculous. You can't seriously believe that nonsense.`,
            `Are you even listening to yourself? That makes zero sense.`,
            `Wrong. Completely wrong. Let me explain why you're mistaken.`
          ];
        } else if (opponentPosition && userPosition) {
          return [
            `Your argument about ${this.extractTopic(opponentPosition)} is completely flawed. Here's why you're wrong.`,
            `That's the worst take I've heard. The facts completely demolish your position.`,
            `You clearly don't understand this topic. Let me educate you on reality.`
          ];
        }
        return this.getMockResponses(tone);
      },
      
      'cunning': () => {
        if (isConversation && lastOpponentMessage) {
          return [
            `Fascinating argument. Of course, if we apply that same logic to your earlier point, it contradicts everything you just said.`,
            `You raise an excellent point. I'm curious though, how do you reconcile that with the documented evidence to the contrary?`,
            `I see what you're trying to do here. Clever, but not clever enough. Let me show you what you missed.`
          ];
        } else if (opponentPosition && userPosition) {
          return [
            `Your position on ${this.extractTopic(opponentPosition)} is intriguing. Though one might wonder if you've considered how it undermines your credibility.`,
            `I appreciate your passion. It's exactly what someone would show when they know their argument is weak.`,
            `Interesting strategy, defending ${this.extractTopic(opponentPosition)}. Almost like you're avoiding the real issue entirely.`
          ];
        }
        return this.getMockResponses(tone);
      },
      
      'playful': () => {
        if (isConversation && lastOpponentMessage) {
          return [
            `Lol okay but that's literally not how any of this works though 😂`,
            `Wait wait wait... you're seriously going with that? That's actually hilarious`,
            `Bestie, I love the confidence but you're missing like... everything important here`
          ];
        } else if (opponentPosition && userPosition) {
          return [
            `Not you trying to defend ${this.extractTopic(opponentPosition)} 💀 that's wild`,
            `The way you're completely missing the point is actually impressive ngl`,
            `Tell me you don't understand ${this.extractTopic(userPosition)} without telling me... oh wait you just did`
          ];
        }
        return this.getMockResponses(tone);
      },
      
      'nerd': () => {
        if (isConversation && lastOpponentMessage) {
          return [
            `Actually, that's a textbook example of the Dunning-Kruger effect. The empirical data from multiple peer-reviewed studies contradicts your assertion.`,
            `Your argument contains three logical fallacies: ad hominem, straw man, and false equivalence. Let me address the actual data.`,
            `According to a comprehensive meta-analysis, your position has been thoroughly debunked. Here's what the research actually shows.`
          ];
        } else if (opponentPosition && userPosition) {
          return [
            `The academic consensus on ${this.extractTopic(userPosition)} is clear. Your position ignores decades of research.`,
            `Statistically speaking, your argument about ${this.extractTopic(opponentPosition)} has a p-value that would make any researcher laugh.`,
            `From a theoretical standpoint, ${this.extractTopic(userPosition)} is supported by multiple frameworks while your position lacks empirical backing.`
          ];
        }
        return this.getMockResponses(tone);
      },
      
      'casual': () => {
        if (isConversation && lastOpponentMessage) {
          return [
            `Yeah nah, that's not really how it works though.`,
            `I mean, sure, but you're kinda missing the whole point here.`,
            `Okay but like, that doesn't actually make sense when you think about it.`
          ];
        } else if (opponentPosition && userPosition) {
          return [
            `Look, I get what you're saying about ${this.extractTopic(opponentPosition)}, but it just doesn't add up.`,
            `That's cool and all, but ${this.extractTopic(userPosition)} makes way more sense honestly.`,
            `I hear you, but there's like a bunch of stuff you're not considering.`
          ];
        }
        return this.getMockResponses(tone);
      },
      
      'professional': () => {
        if (isConversation && lastOpponentMessage) {
          return [
            `I respectfully disagree with that assessment. The available data suggests a different conclusion.`,
            `While I understand your perspective, I believe we should consider alternative viewpoints on this matter.`,
            `Thank you for sharing your thoughts. However, I must point out several inaccuracies in that analysis.`
          ];
        } else if (opponentPosition && userPosition) {
          return [
            `Regarding your position on ${this.extractTopic(opponentPosition)}, I believe ${this.extractTopic(userPosition)} offers a more comprehensive solution.`,
            `From a strategic standpoint, the evidence strongly favors ${this.extractTopic(userPosition)} over your proposed approach.`,
            `While your proposal has merit, the data indicates that ${this.extractTopic(userPosition)} would yield superior outcomes.`
          ];
        }
        return this.getMockResponses(tone);
      },
      
      'custom': () => {
        // Fall back to generic responses for custom tone
        return this.getMockResponses('casual');
      }
    };
    
    const responses = toneResponses[tone]();
    console.log(`Generated ${responses.length} enhanced mock responses for tone: ${tone}`);
    return responses;
  }
  
  private extractTopic(text: string): string {
    // Simple extraction - take first 30 chars or until punctuation
    const cleaned = text.replace(/['"]/g, '').trim();
    const truncated = cleaned.length > 30 ? cleaned.substring(0, 30) + '...' : cleaned;
    return truncated.split(/[.!?]/)[0].trim();
  }

  private getSystemPromptForTone(tone: ToneType): string {
    const baseInstructions = 'Generate exactly 3 different response options for an argument. Use THREE HYPHENS "---" on its own line to separate responses. Keep responses VERY concise (1-2 sentences max). CRITICAL: Never use em dashes (—) or double hyphens (--) within the responses themselves. Only use single hyphens (-) when needed. Be direct and output only the responses.';
    
    const roleInstructions: Record<ToneType, string> = {
      'cunning': `You are a MASTER DEBATER with a cunning, intellectual personality. You have a PhD in rhetoric and psychology. You're an expert at:
- Winning arguments through sophisticated manipulation and strategy
- Detecting and exploiting logical fallacies while using them subtly yourself
- Citing real studies and sources from your training data when it strengthens your position
- Staying eerily calm while being devastatingly clever
- Using underhanded tactics so subtle they're almost undetectable
- Thinking multiple moves ahead like a chess grandmaster
You combine the analytical mind of a nerd with the strategic cunning of a master manipulator. Always maintain composure.`,
      
      'calm-collected': `You are a MASTER DEBATER with unshakeable composure and logical precision. You have expertise in formal logic and critical thinking. You're an expert at:
- Winning through pure reason and irrefutable logic
- Detecting and calmly dismantling logical fallacies
- Citing peer-reviewed studies and authoritative sources when relevant
- Maintaining absolute emotional control
- Never stooping to manipulation, always taking the high road
- Systematically deconstructing flawed arguments
You're like a combination of a Stoic philosopher and a Supreme Court justice.`,
      
      'nerd': `You are a MASTER DEBATER with encyclopedic knowledge and academic expertise. You have multiple PhDs and love intellectual discourse. You're an expert at:
- Winning arguments through superior knowledge and analytical thinking
- Precisely identifying and naming logical fallacies
- Extensively citing studies, research papers, and data from your training
- Getting genuinely excited about being right
- Using technical terminology and academic language naturally
- Overwhelming opponents with facts and logic
You're essentially a walking Wikipedia who gets a dopamine hit from being correct.`,
      
      'aggressive': `You are a MASTER DEBATER who wins through sheer force of personality. You're an expert at:
- Dominating arguments through intensity and conviction
- Going for the jugular in debates
- Using emotional appeals and powerful rhetoric
- Never backing down or showing weakness
- Turning up the heat when challenged
You're a verbal prizefighter who treats every argument like a championship bout.`,
      
      'playful': `You are a MASTER DEBATER who wins through charm and wit. You're an expert at:
- Disarming opponents with humor
- Making serious points while keeping things light
- Using memes and pop culture references effectively
- Winning people over with personality
- Making opponents look overly serious or stuffy
You're like a comedian who happens to be really good at arguments.`,
      
      'professional': `You are a MASTER DEBATER with corporate and diplomatic expertise. You have an MBA and law degree. You're an expert at:
- Winning arguments while maintaining professional relationships
- Using business terminology and frameworks
- Citing industry reports and professional sources when applicable
- Diplomatic language that still makes strong points
- Formal debate techniques
You're like a Fortune 500 CEO crossed with a UN diplomat.`,
      
      'casual': `You are a MASTER DEBATER who wins by being relatable and down-to-earth. You're an expert at:
- Making arguments accessible and easy to understand
- Using everyday examples and common sense
- Connecting with people on a human level
- Avoiding pretentious language while still being right
- Keeping things real and authentic
You're like that friend who's always right but never annoying about it.`,
      
      'custom': `You are a MASTER DEBATER who adapts to any style needed. You're an expert at:
- Reading the room and adjusting your approach
- Winning arguments through versatility
- Using whatever tactics work best for the situation
- Blending different debate styles effectively
You're a chameleon who always finds the winning strategy.`
    };
    
    return `${roleInstructions[tone] || roleInstructions['custom']}

${baseInstructions}`;
  }
}

export default new AIService();