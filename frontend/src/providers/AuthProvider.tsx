import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import api from '../services/apiClient';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/me');
        if (data?.data) {
          setUser(data.data);
        }
      } catch (err: any) {
        console.error('Failed to restore auth session:', err);
        // Only clear auth token on explicit 401 Unauthorized
        if (err.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
