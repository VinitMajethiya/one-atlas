'use client';

import React, { useEffect, useState } from 'react';
import { Key, ShieldAlert, CheckCircle2, Server, Globe, Loader2 } from 'lucide-react';

interface SSOConfig {
  provider: string;
  metadataUrl: string;
  clientId: string;
  authEndpoint: string;
  tokenEndpoint: string;
  domainsWhitelisted: string[];
  status: string;
}

export function AdminSSOConfig() {
  const [config, setConfig] = useState<SSOConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSSO() {
      try {
        const res = await fetch('/api/admin/sso');
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
    fetchSSO();
  }, []);

  if (loading) {
    return (
      <div className="bg-bg-card border border-border-default rounded-3xl p-6 shadow-sm flex items-center justify-center py-12 text-xs font-mono text-text-muted gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span>Loading SSO federations...</span>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="bg-bg-card border border-border-default rounded-3xl p-6 shadow-sm space-y-6 text-left">
      <div className="flex justify-between items-center border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-accent-blue" />
          <h3 className="text-sm font-extrabold text-text-heading">SAML / OIDC Single Sign-On</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
          <span className="text-[10px] font-bold font-mono text-emerald-500 uppercase">Connected</span>
        </div>
      </div>

      <div className="space-y-4 text-xs font-semibold">
        <div className="space-y-1">
          <span className="text-[9px] font-bold font-mono text-text-muted uppercase tracking-wider block">IDP Identity Provider</span>
          <span className="text-text-heading text-sm font-extrabold block">
            {config.provider}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-bold font-mono text-text-muted uppercase tracking-wider block">Client ID Reference</span>
            <code className="font-mono text-text-heading bg-bg-subtle px-2.5 py-1.5 rounded-lg border border-border-subtle block select-all text-[11px] truncate">
              {config.clientId}
            </code>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-bold font-mono text-text-muted uppercase tracking-wider block">IDP Metadata Endpoint</span>
            <code className="font-mono text-text-heading bg-bg-subtle px-2.5 py-1.5 rounded-lg border border-border-subtle block select-all text-[11px] truncate" title={config.metadataUrl}>
              {config.metadataUrl}
            </code>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <span className="text-[9px] font-bold font-mono text-text-muted uppercase tracking-wider block">Whitelisted Domain Mappings</span>
          <div className="flex flex-wrap gap-1.5">
            {config.domainsWhitelisted.map((dom, idx) => (
              <span key={idx} className="bg-primary/5 text-primary border border-primary/20 px-2.5 py-0.5 rounded-md font-mono text-[10px]">
                @{dom}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSSOConfig;
