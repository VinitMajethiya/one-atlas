'use client';

import React, { useEffect, useState } from 'react';
import { Shield, ShieldCheck, ShieldAlert, CheckSquare, XSquare, Loader2 } from 'lucide-react';

interface PolicyRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'block' | 'warning' | string;
}

export function AdminPolicyEngine() {
  const [policies, setPolicies] = useState<PolicyRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolicies() {
      try {
        const res = await fetch('/api/admin/policies');
        if (res.ok) {
          const data = await res.json();
          setPolicies(data.policies || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPolicies();
  }, []);

  if (loading) {
    return (
      <div className="bg-bg-card border border-border-default rounded-3xl p-6 shadow-sm flex items-center justify-center py-12 text-xs font-mono text-text-muted gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span>Syncing policy rules...</span>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border-default rounded-3xl p-6 shadow-sm space-y-5 text-left">
      <div className="flex items-center gap-2 border-b border-border-subtle pb-4">
        <Shield className="w-5 h-5 text-indigo-500" />
        <h3 className="text-sm font-extrabold text-text-heading">Compliance Guardrails & Policy Rules</h3>
      </div>

      <div className="space-y-4">
        {policies.map(pol => (
          <div 
            key={pol.id} 
            className="p-4 border border-border-subtle bg-bg-subtle/20 hover:bg-bg-subtle/40 rounded-2xl flex justify-between items-start gap-4 transition-all"
          >
            <div className="space-y-1 text-left flex-grow">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-text-muted uppercase font-bold tracking-wider">
                  RULE {pol.id}
                </span>
                <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold border ${
                  pol.severity === 'block' ? 'bg-accent-pink/10 text-accent-pink border-accent-pink/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {pol.severity}
                </span>
              </div>
              <h4 className="text-xs md:text-sm font-extrabold text-text-heading leading-tight">{pol.name}</h4>
              <p className="text-xs text-text-muted font-semibold leading-relaxed">{pol.description}</p>
            </div>

            {/* Toggle mock switch status */}
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold font-mono ${pol.enabled ? 'text-primary' : 'text-text-muted'}`}>
                {pol.enabled ? 'ENFORCED' : 'DISABLED'}
              </span>
              <div className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                pol.enabled ? 'bg-primary' : 'bg-border-default'
              }`}>
                <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${
                  pol.enabled ? 'translate-x-4.5' : 'translate-x-0'
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPolicyEngine;
