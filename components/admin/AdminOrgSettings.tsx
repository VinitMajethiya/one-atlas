'use client';

import React, { useEffect, useState } from 'react';
import { Settings, ShieldCheck, Activity, BarChart3, Loader2 } from 'lucide-react';

interface OrgConfig {
  id: string;
  name: string;
  tier: string;
  limits: {
    maxUsers: number;
    activeUsersCount: number;
    sandboxesAllowed: number;
    activeSandboxesCount: number;
    aiGenerationsLimit: string;
  };
  security: {
    ssoEnabled: boolean;
    mfaRequired: boolean;
    encryptionAtRest: boolean;
    logRetentionDays: number;
  };
}

export function AdminOrgSettings() {
  const [config, setConfig] = useState<OrgConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await fetch('/api/admin/org');
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrg();
  }, []);

  if (loading) {
    return (
      <div className="bg-bg-card border border-border-default rounded-3xl p-6 shadow-sm flex items-center justify-center py-12 text-xs font-mono text-text-muted gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span>Loading org configurations...</span>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="bg-bg-card border border-border-default rounded-3xl p-6 shadow-sm space-y-6 text-left">
      <div className="flex items-center gap-2 border-b border-border-subtle pb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-extrabold text-text-heading">Organizational Boundaries</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* Limits */}
        <div className="space-y-3.5">
          <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-accent-blue" />
            Resource Boundaries
          </h4>
          <div className="space-y-2 bg-bg-subtle/50 p-4 border border-border-subtle rounded-2xl">
            <div className="flex justify-between font-mono">
              <span className="text-text-muted">Seats Allocated</span>
              <span className="font-bold text-text-heading">{config.limits.activeUsersCount} / {config.limits.maxUsers}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-text-muted">Sandbox Partitions</span>
              <span className="font-bold text-text-heading">{config.limits.activeSandboxesCount} / {config.limits.sandboxesAllowed}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-text-muted">AI Tokens limit</span>
              <span className="font-bold text-primary capitalize">{config.limits.aiGenerationsLimit}</span>
            </div>
          </div>
        </div>

        {/* Security policies */}
        <div className="space-y-3.5">
          <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-accent-teal" />
            Compliance Configurations
          </h4>
          <div className="space-y-2 bg-bg-subtle/50 p-4 border border-border-subtle rounded-2xl">
            <div className="flex justify-between font-mono">
              <span className="text-text-muted">SSO Federation</span>
              <span className={`font-bold ${config.security.ssoEnabled ? 'text-emerald-500' : 'text-accent-pink'}`}>
                {config.security.ssoEnabled ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-text-muted">Force MFA Checks</span>
              <span className="font-bold text-text-heading">{config.security.mfaRequired ? 'YES' : 'NO'}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-text-muted">Audit Log Retention</span>
              <span className="font-bold text-text-heading">{config.security.logRetentionDays} Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrgSettings;
