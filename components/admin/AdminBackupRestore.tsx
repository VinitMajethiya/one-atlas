'use client';

import React, { useEffect, useState } from 'react';
import { HardDriveDownload, RefreshCw, Play, Plus, Loader2, Calendar } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface Backup {
  id: string;
  timestamp: string;
  size: string;
  description: string;
  status: string;
}

export function AdminBackupRestore() {
  const { toast } = useToast();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/backup');
      if (res.ok) {
        const data = await res.json();
        setBackups(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const createBackup = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/admin/backup', {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setBackups(prev => [data.backup, ...prev]);
        toast('Database backup snapshot created successfully', 'success');
      }
    } catch {
      toast('Failed to create snapshot', 'error');
    } finally {
      setCreating(false);
    }
  };

  const restoreBackup = async (id: string) => {
    setRestoringId(id);
    try {
      const res = await fetch(`/api/admin/backup/${id}/restore`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        toast(data.message, 'success');
      } else {
        toast('Partition restoration failed', 'error');
      }
    } catch {
      toast('Error executing partition restoration', 'error');
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="bg-bg-card border border-border-default rounded-3xl p-6 shadow-sm space-y-5 text-left">
      <div className="flex justify-between items-center border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2">
          <HardDriveDownload className="w-5 h-5 text-violet-500" />
          <h3 className="text-sm font-extrabold text-text-heading">Partition Snapshots & Backup Restore</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={createBackup}
            disabled={creating}
            className="bg-primary hover:bg-primary/95 disabled:opacity-50 text-white font-bold text-[10px] font-mono px-3.5 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1"
          >
            {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>Take Snapshot</span>
          </button>
          <button 
            onClick={fetchBackups}
            className="p-1.5 rounded-lg bg-bg-subtle hover:bg-bg-muted border border-border-subtle text-text-muted hover:text-text-heading transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center gap-2 text-text-muted font-mono text-xs">
          <Loader2 className="w-4.5 h-4.5 animate-spin text-violet-500" />
          <span>Syncing snapshots listing...</span>
        </div>
      ) : backups.length === 0 ? (
        <div className="py-8 text-center text-xs text-text-muted">No database snapshots saved.</div>
      ) : (
        <div className="space-y-3.5">
          {backups.map(bak => (
            <div 
              key={bak.id} 
              className="p-4 border border-border-subtle bg-bg-subtle/15 hover:bg-bg-subtle/35 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
            >
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-text-muted uppercase font-bold tracking-wider">
                    {bak.id}
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold">
                    {bak.status}
                  </span>
                </div>
                <h4 className="text-xs md:text-sm font-extrabold text-text-heading leading-tight">{bak.description}</h4>
                <div className="flex items-center gap-3 text-[10px] text-text-muted font-mono font-bold pt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(bak.timestamp).toLocaleString()}
                  </span>
                  <span>Size: {bak.size}</span>
                </div>
              </div>

              <button
                onClick={() => restoreBackup(bak.id)}
                disabled={restoringId !== null}
                className="bg-bg-default border border-border-default hover:border-primary disabled:opacity-50 text-text-heading hover:text-primary font-bold text-xs py-2 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0"
              >
                {restoringId === bak.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current text-text-muted hover:text-primary" />
                )}
                <span>Restore Sandbox</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminBackupRestore;
