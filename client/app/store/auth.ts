import { create } from "zustand";

export interface Permission {
  id: number;
  resource: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  designation: string;
  section: string;
  roles: {
    id: number;
    name: string;
    permissions: Permission[];
  }[];
  permissions: Permission[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
