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

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Enable request/response compression
  decompress: true,
});

// Request queue for debouncing
const requestQueue = new Map();

// Simple debounce function for API calls
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  key: string
): T => {
  return ((...args: any[]) => {
    if (requestQueue.has(key)) {
      clearTimeout(requestQueue.get(key));
    }
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        requestQueue.delete(key);
        func(...args).then(resolve).catch(reject);
      }, delay);
      requestQueue.set(key, timeoutId);
    });
  }) as T;
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    (config as any).metadata = { startTime: Date.now() };
    
    // Add cache busting for GET requests in development
    if (import.meta.env.DEV && config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (import.meta.env.DEV && (response.config as any).metadata?.startTime) {
      const duration = Date.now() - (response.config as any).metadata.startTime;
      console.log(`API call to ${response.config.url} took ${duration}ms`);
    }
    
    return response;
  },
  (error) => {
    // Enhanced error handling
    console.error('API Error Response:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      }
    });
    
    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please check your connection.');
    }
    
    if (!error.response) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    if (error.response?.status === 401) {
      // Clear auth token on 401
      localStorage.removeItem('auth-token');
      throw new Error('Authentication failed. Please try again.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    if (error.response?.data?.error) {
      const apiError: ApiError = error.response.data;
      console.error('API Error:', apiError.error);
      throw new Error(typeof apiError.error === 'string' ? apiError.error : apiError.error.message || 'API Error');
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred'
    );
  }
);

// Memoization cache for frequently used data
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const generateResponses = debounce(
  async (request: GenerateResponsesRequest): Promise<GenerateResponsesResponse> => {
    const response = await api.post<GenerateResponsesResponse>(
      '/generate-responses',
      request
    );
    return response.data;
  },
  500, // 500ms debounce
  'generateResponses'
);

export const saveArgument = async (argument: Partial<Argument>): Promise<Argument> => {
  const response = await api.post<Argument>('/arguments', argument);
  return response.data;
};

export const getArguments = async (): Promise<Argument[]> => {
  const cacheKey = 'arguments';
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }
  
  const response = await api.get<{ arguments: Argument[] }>('/arguments');
  setCachedData(cacheKey, response.data.arguments);
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
  const cacheKey = `conversation-${conversationId}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }
  
  const response = await api.get<Conversation>(`/conversations/${conversationId}`);
  setCachedData(cacheKey, response.data);
  return response.data;
};

export const sendMessage = debounce(
  async (
    conversationId: string,
    message: { role: 'user' | 'opponent'; content: string }
  ): Promise<{ messages: Message[]; generatedResponses: string[] }> => {
    // Clear relevant cache entries
    cache.delete(`conversation-${conversationId}`);
    
    const response = await api.post<{ messages: Message[]; generatedResponses: string[] }>(
      `/conversations/${conversationId}/messages`,
      message
    );
    return response.data;
  },
  300, // 300ms debounce for messages
  'sendMessage'
);

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
