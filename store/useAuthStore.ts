import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: 'free' | 'pro' | 'enterprise';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  plan: 'free' | 'pro' | 'enterprise' | null;
  loading: boolean;
  login: (provider: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  checkEntitlements: (feature: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  plan: null,
  loading: true,

  login: async (provider) => {
    try {
      // Simulate auth or hit endpoint. Writes to AuthAttempt log via /api/events or /api/auth/me
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          set({ user: data.user, plan: data.user.plan, isAuthenticated: true, loading: false });
          
          // Track login_prompt_shown success or login success
          await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_type: 'login_prompt_shown',
              user_id: data.user.id,
              metadata: { provider, success: true }
            })
          });
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  },

  logout: async () => {
    set({ user: null, plan: null, isAuthenticated: false });
  },

  checkSession: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          set({ user: data.user, plan: data.user.plan, isAuthenticated: true });
        } else {
          set({ user: null, plan: null, isAuthenticated: false });
        }
      } else {
        set({ user: null, plan: null, isAuthenticated: false });
      }
    } catch (err) {
      set({ user: null, plan: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },

  checkEntitlements: (feature) => {
    const user = get().user;
    if (!user) return false;

    // Entitlement checks
    if (feature === 'enterprise_deploy') {
      return user.plan === 'enterprise';
    }
    if (feature === 'ai_generation' || feature === 'custom_integrations') {
      return user.plan === 'pro' || user.plan === 'enterprise';
    }
    return true; // Default free entitlements
  }
}));

export default useAuthStore;
