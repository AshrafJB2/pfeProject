import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  token: null,
  loading: true,
  login: async () => false,
  logout: () => {},
  refreshToken: async () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshPromise, setRefreshPromise] = useState<Promise<string | null> | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    // If we're already refreshing, return the existing promise
    if (refreshPromise) return refreshPromise;

    const refreshTokenValue = localStorage.getItem('refresh');
    if (!refreshTokenValue) {
      logout();
      return null;
    }

    try {
      const promise = axios.post('http://localhost:8000/api/token/refresh/', {
        refresh: refreshTokenValue
      }).then(response => {
        const { access } = response.data;
        localStorage.setItem('access', access);
        setToken(access);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        
        const decoded: any = jwtDecode(access);
        setUser(decoded);
        setIsAuthenticated(true);
        return access;
      }).finally(() => {
        setRefreshPromise(null);
      });

      setRefreshPromise(promise);
      return await promise;
    } catch (error) {
      console.error('Refresh token error:', error);
      logout();
      return null;
    }
  }, [logout, refreshPromise]);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password
      });
      
      const { access, refresh } = response.data;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      
      const decoded: any = jwtDecode(access);
      setUser(decoded);
      setToken(access);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  // Set up axios interceptors and check auth state on mount
  useEffect(() => {
    let requestInterceptor: number;
    let responseInterceptor: number;

    const initializeAuth = async () => {
      // Check existing token validity
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            // Token expired, try to refresh
            await refreshToken();
          } else {
            // Token is valid, set user
            setUser(decoded);
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Token validation error:', error);
          logout();
        }
      }
      
      // Set up request interceptor
      requestInterceptor = axios.interceptors.request.use(
        (config) => {
          // Skip adding token for auth endpoints
          if (config.url?.includes('/api/token/')) {
            return config;
          }
          
          const currentToken = localStorage.getItem('access');
          if (currentToken) {
            config.headers.Authorization = `Bearer ${currentToken}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Set up response interceptor
      responseInterceptor = axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          
          // Skip interceptor for auth endpoints or already retried requests
          if (originalRequest.url?.includes('/api/token/') || 
              originalRequest._retry ||
              error.response?.status !== 401) {
            return Promise.reject(error);
          }
          
          originalRequest._retry = true;
          
          try {
            const newToken = await refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
            return Promise.reject(error);
          } catch (refreshError) {
            logout();
            return Promise.reject(error);
          }
        }
      );
      
      setLoading(false);
    };

    initializeAuth();

    return () => {
      // Cleanup interceptors when component unmounts
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, refreshToken, logout]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      token, 
      loading, 
      login, 
      logout, 
      refreshToken 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);