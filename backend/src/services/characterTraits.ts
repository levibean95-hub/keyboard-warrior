export interface LogicalFallacy {
  name: string;
  description: string;
  example: string;
  detection: string;
}

export interface UnderhandedTactic {
  name: string;
  description: string;
  subtlety: 'high' | 'medium' | 'low';
  usage: string;
}

export const logicalFallacies: LogicalFallacy[] = [
  {
    name: 'Ad Hominem',
    description: 'Attacking the person rather than the argument',
    example: 'You only say that because you work for them',
    detection: 'Focus on whether the argument addresses the actual point, not the person'
  },
  {
    name: 'Straw Man',
    description: 'Misrepresenting someone\'s argument to make it easier to attack',
    example: 'So you\'re saying we should just let everyone do whatever they want?',
    detection: 'Check if the response actually addresses your real position'
  },
  {
    name: 'False Dichotomy',
    description: 'Presenting only two options when more exist',
    example: 'Either you support this or you don\'t care about progress',
    detection: 'Look for artificial limitations in choices presented'
  },
  {
    name: 'Slippery Slope',
    description: 'Assuming one event will lead to extreme consequences',
    example: 'If we allow this, soon everything will be chaos',
    detection: 'Examine if the chain of events is actually probable'
  },
  {
    name: 'Appeal to Authority',
    description: 'Using authority as evidence without actual proof',
    example: 'This expert said it, so it must be true',
    detection: 'Check if expertise is relevant and if evidence is provided'
  },
  {
    name: 'Circular Reasoning',
    description: 'Using the conclusion as part of the premise',
    example: 'It\'s true because it says it\'s true',
    detection: 'Look for arguments that assume what they\'re trying to prove'
  },
  {
    name: 'Red Herring',
    description: 'Introducing irrelevant information to distract',
    example: 'But what about this completely different issue?',
    detection: 'Stay focused on the original topic being discussed'
  },
  {
    name: 'Bandwagon',
    description: 'Arguing something is true because many believe it',
    example: 'Everyone knows this is how it works',
    detection: 'Popular opinion doesn\'t equal truth'
  },
  {
    name: 'Moving the Goalposts',
    description: 'Changing criteria for proof when original criteria are met',
    example: 'Okay but that doesn\'t prove this other thing',
    detection: 'Track if requirements keep changing after being satisfied'
  },
  {
    name: 'Gaslighting',
    description: 'Making someone question their own perception or memory',
    example: 'You never said that, you\'re imagining things',
    detection: 'Trust your memory and keep records of what was said'
  }
];

export const underhandedTactics: UnderhandedTactic[] = [
  {
    name: 'Subtle Reframing',
    description: 'Slightly shifting the context to favor your position',
    subtlety: 'high',
    usage: 'I think what you\'re really asking is...'
  },
  {
    name: 'Selective Agreement',
    description: 'Agreeing with minor points while undermining the main argument',
    subtlety: 'high',
    usage: 'You make some good points, though the real issue is...'
  },
  {
    name: 'Concern Trolling',
    description: 'Pretending to be worried while actually criticizing',
    subtlety: 'medium',
    usage: 'I\'m just concerned that this approach might...'
  },
  {
    name: 'Poisoning the Well',
    description: 'Preemptively discrediting opposing arguments',
    subtlety: 'medium',
    usage: 'Before you bring up the usual talking points...'
  },
  {
    name: 'Sealioning',
    description: 'Persistent requests for evidence in bad faith',
    subtlety: 'low',
    usage: 'Can you provide sources for every single claim?'
  },
  {
    name: 'Gish Gallop',
    description: 'Overwhelming with many weak arguments',
    subtlety: 'low',
    usage: 'First, second, third, fourth... (rapid-fire points)'
  },
  {
    name: 'False Compromise',
    description: 'Suggesting a middle ground that actually favors your position',
    subtlety: 'high',
    usage: 'How about we meet in the middle... (but closer to my side)'
  },
  {
    name: 'Weaponized Empathy',
    description: 'Using emotional appeals to avoid logical scrutiny',
    subtlety: 'medium',
    usage: 'I just feel like you\'re not considering the human element'
  },
  {
    name: 'Strategic Ambiguity',
    description: 'Being intentionally vague to avoid commitment',
    subtlety: 'high',
    usage: 'It depends on what you mean by...'
  },
  {
    name: 'Kafkatrapping',
    description: 'Denial of accusation is taken as evidence of guilt',
    subtlety: 'medium',
    usage: 'The fact you\'re denying it proves my point'
  }
];

export interface CharacterTraits {
  detectsFallacies: boolean;
  usesFallacies: boolean;
  usesUnderhandedTactics: boolean;
  fallacyDetectionSkill: number; // 0-100
  tacticalSubtlety: number; // 0-100
  emotionalControl: number; // 0-100
  analyticalThinking: number; // 0-100
}

export const characterTraitsMap: Record<string, CharacterTraits> = {
  'cunning': {
    detectsFallacies: true,
    usesFallacies: true,
    usesUnderhandedTactics: true,
    fallacyDetectionSkill: 95,
    tacticalSubtlety: 90,
    emotionalControl: 85,
    analyticalThinking: 85
  },
  'calm-collected': {
    detectsFallacies: true,
    usesFallacies: false,
    usesUnderhandedTactics: false,
    fallacyDetectionSkill: 90,
    tacticalSubtlety: 20,
    emotionalControl: 95,
    analyticalThinking: 90
  },
  'nerd': {
    detectsFallacies: true,
    usesFallacies: false,
    usesUnderhandedTactics: false,
    fallacyDetectionSkill: 95,
    tacticalSubtlety: 10,
    emotionalControl: 70,
    analyticalThinking: 100
  },
  'aggressive': {
    detectsFallacies: false,
    usesFallacies: true,
    usesUnderhandedTactics: false,
    fallacyDetectionSkill: 30,
    tacticalSubtlety: 10,
    emotionalControl: 20,
    analyticalThinking: 50
  },
  'playful': {
    detectsFallacies: false,
    usesFallacies: false,
    usesUnderhandedTactics: false,
    fallacyDetectionSkill: 40,
    tacticalSubtlety: 30,
    emotionalControl: 60,
    analyticalThinking: 60
  },
  'professional': {
    detectsFallacies: true,
    usesFallacies: false,
    usesUnderhandedTactics: false,
    fallacyDetectionSkill: 70,
    tacticalSubtlety: 40,
    emotionalControl: 90,
    analyticalThinking: 80
  },
  'casual': {
    detectsFallacies: false,
    usesFallacies: false,
    usesUnderhandedTactics: false,
    fallacyDetectionSkill: 30,
    tacticalSubtlety: 10,
    emotionalControl: 70,
    analyticalThinking: 50
  },
  'custom': {
    detectsFallacies: false,
    usesFallacies: false,
    usesUnderhandedTactics: false,
    fallacyDetectionSkill: 50,
    tacticalSubtlety: 50,
    emotionalControl: 50,
    analyticalThinking: 50
  }
};

export function getRandomFallacy(): LogicalFallacy {
  return logicalFallacies[Math.floor(Math.random() * logicalFallacies.length)];
}

export function getRandomTactic(subtletyLevel?: 'high' | 'medium' | 'low'): UnderhandedTactic {
  const filtered = subtletyLevel 
    ? underhandedTactics.filter(t => t.subtlety === subtletyLevel)
    : underhandedTactics;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function detectFallacyInText(text: string): LogicalFallacy | null {
  // Simple pattern matching for common fallacy indicators
  const patterns = [
    { pattern: /you only|because you|you're just/i, fallacy: 'Ad Hominem' },
    { pattern: /so you're saying|so you think/i, fallacy: 'Straw Man' },
    { pattern: /either.*or|you're either/i, fallacy: 'False Dichotomy' },
    { pattern: /if we allow|this will lead to|soon.*will/i, fallacy: 'Slippery Slope' },
    { pattern: /expert.*said|authority.*says|studies show/i, fallacy: 'Appeal to Authority' },
    { pattern: /everyone knows|most people|common knowledge/i, fallacy: 'Bandwagon' },
    { pattern: /what about|but.*instead/i, fallacy: 'Red Herring' },
    { pattern: /you never said|didn't happen|imagining/i, fallacy: 'Gaslighting' }
  ];
  
  for (const { pattern, fallacy } of patterns) {
    if (pattern.test(text)) {
      const found = logicalFallacies.find(f => f.name === fallacy);
      if (found) return found;
    }
  }
  
  return null;
}