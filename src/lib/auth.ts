// Simple auth context - in production, use Firebase/Supabase
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  shopName: string;
  location: string;
  gstNumber?: string;
  verified: boolean;
  avatar?: string;
}

const AUTH_KEY = 'stockswap_user';

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(AUTH_KEY);
  if (!userStr) return null;
  return JSON.parse(userStr);
};

export const setCurrentUser = (user: User) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
