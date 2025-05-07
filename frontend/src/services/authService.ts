
import axiosInstance from '@/lib/axios';
import { AuthTokens, LoginRequest, User } from '@/types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthTokens> => {
    const response = await axiosInstance.post<AuthTokens>('/token/', credentials);
    
    // Store tokens in localStorage with correct keys
    localStorage.setItem('access', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
    
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access');
  },

  refreshToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axiosInstance.post<{ access: string }>('/token/refresh/', {
      refresh: refreshToken,
    });
    
    localStorage.setItem('access', response.data.access);
    return response.data.access;
  }
};
