
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ContentItem {
  id: number;
  title?: string;
  auto_title?: string;
  summary: string;
  keywords: string | string[];
  original_text: string;
  summary_length: 'short' | 'medium' | 'long';
  created_at: string;
}

export interface ContentCreateRequest {
  original_text?: string;
  summary_length: 'short' | 'medium' | 'long';
  original_file?: File;
}

export interface ContentFilter {
  search: string;
  length: 'all' | 'short' | 'medium' | 'long';
}
