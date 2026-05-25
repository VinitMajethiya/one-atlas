'use client';

import React, { useEffect, useState } from 'react';
import { Users, Mail, ShieldAlert, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  plan: string;
  verified: boolean;
  createdAt: string;
}

export function AdminUserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-bg-card border border-border-default rounded-3xl p-6 shadow-sm space-y-4 text-left">
      <div className="flex justify-between items-center border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-extrabold text-text-heading">SCIM User Directory</h3>
        </div>
        <button 
          onClick={fetchUsers}
          className="p-1.5 rounded-lg bg-bg-subtle hover:bg-bg-muted border border-border-subtle text-text-muted hover:text-text-heading transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center gap-2 text-text-muted font-mono text-xs">
          <Loader2 className="w-4.5 h-4.5 animate-spin text-primary" />
          <span>Syncing directory...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="py-8 text-center text-xs text-text-muted">No developer profiles registered in database.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-text-muted font-mono uppercase tracking-wider border-b border-border-subtle">
                <th className="pb-3 font-bold">Developer</th>
                <th className="pb-3 font-bold">Access Role</th>
                <th className="pb-3 font-bold">Plan status</th>
                <th className="pb-3 font-bold">Verified</th>
                <th className="pb-3 font-bold">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-bg-subtle/30">
                  <td className="py-3 font-semibold text-text-heading">
                    <div>{u.name || 'Atlas Developer'}</div>
                    <div className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {u.email}
                    </div>
                  </td>
                  <td className="py-3 font-mono font-bold uppercase text-[10px]">{u.role}</td>
                  <td className="py-3 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                      u.plan === 'enterprise' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-bg-subtle border-border-subtle text-text-muted'
                    }`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="py-3">
                    {u.verified ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-accent-pink" />
                    )}
                  </td>
                  <td className="py-3 font-mono text-[10px] text-text-muted">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUserTable;
