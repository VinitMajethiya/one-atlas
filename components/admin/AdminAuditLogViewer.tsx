'use client';

import React, { useEffect, useState } from 'react';
import { History, Calendar, User, Database, RefreshCw, Loader2 } from 'lucide-react';

interface AuditLog {
  id: string;
  userId: string;
  user: { name: string | null; email: string } | null;
  template: { name: string } | null;
  workspaceId: string | null;
  action: string;
  metadata: any;
  createdAt: string;
}

export function AdminAuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="bg-bg-card border border-border-default rounded-3xl p-6 shadow-sm space-y-4 text-left">
      <div className="flex justify-between items-center border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-accent-pink" />
          <h3 className="text-sm font-extrabold text-text-heading">Enterprise Compliance Audit Trail</h3>
        </div>
        <button 
          onClick={fetchLogs}
          className="p-1.5 rounded-lg bg-bg-subtle hover:bg-bg-muted border border-border-subtle text-text-muted hover:text-text-heading transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center gap-2 text-text-muted font-mono text-xs">
          <Loader2 className="w-4.5 h-4.5 animate-spin text-accent-pink" />
          <span>Syncing audit logs...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-8 text-center text-xs text-text-muted">No security events logged.</div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {logs.map(log => (
            <div key={log.id} className="p-3.5 border border-border-subtle bg-bg-subtle/30 rounded-2xl flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <span className="bg-bg-card border border-border-default px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase text-primary">
                  {log.action}
                </span>
                <span className="font-mono text-[9px] text-text-muted flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="text-text-heading leading-relaxed pt-1 flex flex-wrap items-center gap-1">
                <User className="w-3.5 h-3.5 text-text-muted" />
                <span className="font-bold">{log.user?.name || log.userId}</span>
                <span className="text-text-muted font-normal">mutated partition.</span>
                {log.template?.name && (
                  <>
                    <Database className="w-3.5 h-3.5 text-text-muted ml-1" />
                    <span className="font-bold text-primary">{log.template.name}</span>
                  </>
                )}
              </div>
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <pre className="text-[9px] font-mono bg-black/5 dark:bg-black/45 p-2 rounded-lg border border-border-subtle overflow-x-auto text-text-muted max-h-20 mt-1">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminAuditLogViewer;
