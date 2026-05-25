'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import ToastContainer from '../../components/shared/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuthStore } from '../../store/useAuthStore';
import { Shield, Key, Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please enter credentials', 'error');
      return;
    }
    setLoading(true);
    try {
      // Simulate success
      const success = await login('credentials');
      if (success) {
        toast('Successfully signed in', 'success');
        router.push('/templates');
      } else {
        toast('Invalid email or password', 'error');
      }
    } catch {
      toast('Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOauthLogin = async (provider: string) => {
    setLoading(true);
    try {
      const success = await login(provider);
      if (success) {
        toast(`Signed in with ${provider}`, 'success');
        router.push('/templates');
      } else {
        toast(`Failed to sign in with ${provider}`, 'error');
      }
    } catch {
      toast('SSO Handshake error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bg-default flex items-center justify-center py-16">
        <SectionWrapper className="w-full max-w-md">
          <div className="bg-bg-card border border-border-default rounded-3xl p-8 shadow-xl text-center space-y-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Shield className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-text-heading">Welcome to OneAtlas</h1>
              <p className="text-xs text-text-muted font-semibold mt-1">
                Access your custom workspace and deployed AI tools
              </p>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono text-text-muted uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="developer@oneatlas.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-bg-subtle/50 border border-border-default focus:border-primary text-xs font-semibold rounded-2xl outline-none transition-all"
                  />
                  <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono text-text-muted uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-bg-subtle/50 border border-border-default focus:border-primary text-xs font-semibold rounded-2xl outline-none transition-all"
                  />
                  <Key className="w-4 h-4 text-text-muted absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In with Credentials</span>}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-border-subtle" />
              <span className="text-[10px] font-bold font-mono text-text-muted px-3 uppercase">or connect via sso</span>
              <div className="flex-grow h-px bg-border-subtle" />
            </div>

            {/* OAuth buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOauthLogin('google')}
                className="bg-bg-default border border-border-default hover:border-primary/50 text-text-heading font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>
              <button
                onClick={() => handleOauthLogin('github')}
                className="bg-bg-default border border-border-default hover:border-primary/50 text-text-heading font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            <p className="text-[10px] text-text-muted font-semibold leading-relaxed">
              By logging in, you agree to our Terms of Service. Sandbox isolation and multi-tenant security guarantees are enforced.
            </p>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
}
