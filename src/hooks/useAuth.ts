import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.getSession().then((session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    const { data: listener } = authService.onAuthStateChange(setIsAuthenticated);
    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
  };

  const logout = async () => {
    await authService.logout();
  };

  return { isAuthenticated, isLoading, login, logout };
};