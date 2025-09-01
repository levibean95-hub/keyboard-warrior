export type ToneType = 
  | 'calm-collected'
  | 'aggressive'
  | 'cunning'
  | 'girly'
  | 'custom'
  | 'nerd'
  | 'casual'
  | 'professional';

export interface Argument {
  id: string;
  userId?: string;
  title: string;
  context?: string; // Keep for backward compatibility
  opponentPosition: string;
  userPosition: string;
  tone: ToneType;
  customToneDescription?: string; // User's custom style description
  styleExamples: string[];
  responses: Response[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Response {
  id: string;
  argumentId: string;
  content: string;
  tone: ToneType;
  generatedAt: Date;
}

export interface ArgumentFormData {
  context?: string; // Keep for backward compatibility
  opponentPosition: string;
  userPosition: string;
  tone: ToneType;
  customToneDescription?: string; // User's custom style description
  styleExamples: string[];
  title?: string;
}

export interface GenerateResponsesRequest {
  context?: string; // Keep for backward compatibility
  opponentPosition?: string;
  userPosition?: string;
  tone: ToneType;
  customToneDescription?: string; // User's custom style description
  styleExamples?: string[];
}

export interface GenerateResponsesResponse {
  responses: string[];
  argumentId?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export const TONE_DESCRIPTIONS: Record<ToneType, string> = {
  'calm-collected': 'Composed, rational, and level-headed',
  'aggressive': 'Direct, forceful, and confrontational',
  'cunning': 'Strategic, clever, and manipulative',
  'girly': 'Playful, emotional, and expressive',
  'custom': 'Your unique style',
  'nerd': 'Academic, sophisticated, and analytical',
  'casual': 'Relaxed, informal, and conversational',
  'professional': 'Formal, diplomatic, and business-like'
};