'use client';

import React, { useEffect, useState } from 'react';
import { Server, Activity, Cpu, HardDrive, RefreshCw, Loader2 } from 'lucide-react';

interface EnvironmentNode {
  name: string;
  nodeType: string;
  activeContainersCount: number;
  cpuUsage: string;
  ramUsage: string;
  region: string;
  status: string;
}

export function AdminEnvironmentIsolation() {
  const [nodes, setNodes] = useState<EnvironmentNode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/environments');
      if (res.ok) {
        const data = await res.json();
        setNodes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  return (
    <div className="bg-bg-card border border-border-default rounded-3xl p-6 shadow-sm space-y-4 text-left">
      <div className="flex justify-between items-center border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-teal-500" />
          <h3 className="text-sm font-extrabold text-text-heading">VPC Cluster Environment Isolation</h3>
        </div>
        <button 
          onClick={fetchNodes}
          className="p-1.5 rounded-lg bg-bg-subtle hover:bg-bg-muted border border-border-subtle text-text-muted hover:text-text-heading transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center gap-2 text-text-muted font-mono text-xs">
          <Loader2 className="w-4.5 h-4.5 animate-spin text-teal-500" />
          <span>Syncing isolation nodes...</span>
        </div>
      ) : nodes.length === 0 ? (
        <div className="py-8 text-center text-xs text-text-muted">No isolated containers active.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {nodes.map((node, idx) => (
            <div 
              key={idx} 
              className="p-4 border border-border-subtle bg-bg-subtle/15 rounded-2xl space-y-4 shadow-inner"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-text-muted uppercase font-bold tracking-wider">
                  NODE REGION: {node.region}
                </span>
                <h4 className="text-xs md:text-sm font-extrabold text-text-heading leading-tight">
                  {node.name}
                </h4>
                <code className="text-[10px] font-mono text-primary font-bold block">
                  {node.nodeType}
                </code>
              </div>

              <div className="space-y-2 text-xs font-semibold text-text-body pt-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-text-muted flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    Containers
                  </span>
                  <span className="font-bold">{node.activeContainersCount} running</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-text-muted flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    CPU Load
                  </span>
                  <span className="font-bold text-emerald-500">{node.cpuUsage}</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-text-muted flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5" />
                    Memory RAM
                  </span>
                  <span className="font-bold">{node.ramUsage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminEnvironmentIsolation;
