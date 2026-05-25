'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import EmptyState from '../../components/shared/EmptyState';
import ToastContainer from '../../components/shared/Toast';
import { useToast } from '../../hooks/useToast';
import { useRouter } from 'next/navigation';
import { Bell, ArrowLeft, Check, CheckSquare, Trash, MailOpen, Calendar, Loader2 } from 'lucide-react';

import { PageErrorBoundary } from '../../components/shared/PageErrorBoundary';

function NotificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?user_id=usr_seeded_developer');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        toast('Notification marked as read', 'success');
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAlertColor = (type: string) => {
    if (type.includes('error')) return 'border-accent-pink/30 bg-accent-pink/5';
    if (type.includes('success')) return 'border-emerald-500/30 bg-emerald-500/5';
    return 'border-border-default bg-bg-card';
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bg-default">
        <SectionWrapper className="pt-6 pb-28 text-left relative">
          <button 
            onClick={() => router.push('/templates')}
            className="flex items-center gap-2 text-text-muted hover:text-text-heading font-bold text-xs font-mono mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Marketplace</span>
          </button>

          <div className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-text-heading tracking-tight flex items-center gap-2.5">
                <Bell className="w-6 h-6 text-primary" />
                <span>Alert Inbox</span>
              </h1>
              <p className="text-xs text-text-muted font-bold font-mono uppercase mt-1">
                Real-time deployment outcomes, rollbacks, and clone logs
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-xs font-mono text-text-muted">Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState
              title="You're all caught up."
              description="You will receive alerts here once template clones or deployment jobs finish executing."
              icon={<Bell className="w-6 h-6" />}
            />
          ) : (
            <div className="space-y-4 max-w-3xl">
              {notifications.map((notif: any) => (
                <div 
                  key={notif.id} 
                  className={`p-5 rounded-3xl border transition-all flex justify-between items-start gap-4 ${getAlertColor(notif.type)} ${
                    notif.read ? 'opacity-60' : 'shadow-sm'
                  }`}
                >
                  <div className="space-y-1 text-left flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono text-text-muted uppercase">
                        {notif.type.replace('_', ' ')}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-border-default" />
                      <span className="text-[10px] font-bold font-mono text-text-muted flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-text-heading leading-tight">{notif.title}</h3>
                    <p className="text-xs text-text-muted font-semibold leading-relaxed">{notif.body}</p>
                    
                    {notif.metadata && Object.keys(notif.metadata).length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold font-mono text-text-muted block uppercase mb-1">Details</span>
                        <pre className="text-[9px] font-mono bg-bg-subtle p-2 rounded-xl border border-border-subtle overflow-x-auto text-text-muted max-h-24">
                          {JSON.stringify(notif.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-2 rounded-xl bg-bg-default border border-border-default hover:border-primary text-text-muted hover:text-primary transition-all shadow-sm"
                      title="Mark as Read"
                    >
                      <Check className="w-4.5 h-4.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <ToastContainer />
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}

export default function NotificationsPageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <NotificationsPage />
    </PageErrorBoundary>
  );
}
