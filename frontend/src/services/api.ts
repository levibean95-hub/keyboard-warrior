import axios from 'axios';
import { 
  GenerateResponsesRequest, 
  GenerateResponsesResponse,
  Argument,
  ApiError,
  ToneType
} from '../types';

export interface Message {
  id?: string;
  role: 'user' | 'opponent';
  content: string;
  createdAt?: string;
}

export interface StyleChange {
  id: string;
  fromTone: string;
  toTone: string;
  messageCount: number;
  changedAt: string;
}

export interface Conversation {
  id: string;
  context?: string; // For backward compatibility
  opponentPosition: string;
  userPosition: string;
  additionalContext?: string;
  tone: ToneType;
  currentTone?: ToneType;
  styleExamples?: string[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Response:', error.response);
    if (error.response?.data?.error) {
      const apiError: ApiError = error.response.data;
      console.error('API Error:', apiError.error);
      throw new Error(apiError.error.message || apiError.error);
    }
    throw error;
  }
);

export const generateResponses = async (
  request: GenerateResponsesRequest
): Promise<GenerateResponsesResponse> => {
  const response = await api.post<GenerateResponsesResponse>(
    '/generate-responses',
    request
  );
  return response.data;
};

export const saveArgument = async (argument: Partial<Argument>): Promise<Argument> => {
  const response = await api.post<Argument>('/arguments', argument);
  return response.data;
};

export const getArguments = async (): Promise<Argument[]> => {
  const response = await api.get<{ arguments: Argument[] }>('/arguments');
  return response.data.arguments;
};

export const getArgument = async (id: string): Promise<Argument> => {
  const response = await api.get<{ argument: Argument }>(`/arguments/${id}`);
  return response.data.argument;
};

export const deleteArgument = async (id: string): Promise<void> => {
  await api.delete(`/arguments/${id}`);
};

export const regenerateResponses = async (
  argumentId: string,
  additionalContext?: string
): Promise<GenerateResponsesResponse> => {
  const response = await api.post<GenerateResponsesResponse>(
    '/generate-responses',
    { argumentId, additionalContext }
  );
  return response.data;
};

export const createConversation = async (data: {
  context?: string; // For backward compatibility
  opponentPosition?: string;
  userPosition?: string;
  additionalContext?: string;
  tone: ToneType;
  customToneDescription?: string; // User's custom style description
  styleExamples?: string[];
  firstOpponentMessage?: string; // Made optional
}): Promise<Conversation> => {
  const response = await api.post<Conversation>('/conversations', data);
  return response.data;
};

export const updateConversation = async (
  conversationId: string,
  data: {
    opponentPosition?: string;
    userPosition?: string;
    additionalContext?: string;
  }
): Promise<Conversation> => {
  const response = await api.patch<Conversation>(`/conversations/${conversationId}`, data);
  return response.data;
};

export const getConversation = async (conversationId: string): Promise<Conversation> => {
  const response = await api.get<Conversation>(`/conversations/${conversationId}`);
  return response.data;
};

export const sendMessage = async (
  conversationId: string,
  message: { role: 'user' | 'opponent'; content: string }
): Promise<{ messages: Message[]; generatedResponses: string[] }> => {
  const response = await api.post<{ messages: Message[]; generatedResponses: string[] }>(
    `/conversations/${conversationId}/messages`,
    message
  );
  return response.data;
};

export const changeConversationTone = async (
  conversationId: string,
  tone: ToneType
): Promise<{
  id: string;
  currentTone: ToneType;
  previousTone: ToneType;
  styleHistory: StyleChange[];
}> => {
  const response = await api.patch(
    `/conversations/${conversationId}/tone`,
    { tone }
  );
  return response.data;
};