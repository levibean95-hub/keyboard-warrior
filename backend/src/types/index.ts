export type ToneType = 
  | 'calm-collected'
  | 'aggressive'
  | 'cunning'
  | 'girly'
  | 'custom'
  | 'nerd'
  | 'casual'
  | 'professional';

export interface ArgumentData {
  id?: string;
  userId?: string;
  title: string;
  context?: string; // Keep for backward compatibility
  opponentPosition: string;
  userPosition: string;
  tone: ToneType;
  customToneDescription?: string; // User's custom style description
  styleExamples: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResponseData {
  id?: string;
  argumentId: string;
  content: string;
  tone: ToneType;
  generatedAt?: Date;
}

export interface GenerateResponsesRequest {
  context?: string; // Keep for backward compatibility
  opponentPosition?: string;
  userPosition?: string;
  tone: ToneType;
  customToneDescription?: string; // User's custom style description
  styleExamples?: string[];
  argumentId?: string;
  additionalContext?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface UserData {
  id: string;
  email?: string;
  createdAt: Date;
}