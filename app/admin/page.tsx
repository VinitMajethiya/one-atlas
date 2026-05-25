'use client';

import React, { useState } from 'react';
import { PageErrorBoundary } from '@/components/shared/PageErrorBoundary';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import SectionWrapper from '../../components/shared/SectionWrapper';
import ToastContainer from '../../components/shared/Toast';

// Admin Components
import AdminUserTable from '@/components/admin/AdminUserTable';
import AdminAuditLogViewer from '@/components/admin/AdminAuditLogViewer';
import AdminOrgSettings from '@/components/admin/AdminOrgSettings';
import AdminSSOConfig from '@/components/admin/AdminSSOConfig';
import AdminPolicyEngine from '@/components/admin/AdminPolicyEngine';
import AdminBackupRestore from '@/components/admin/AdminBackupRestore';
import AdminEnvironmentIsolation from '@/components/admin/AdminEnvironmentIsolation';

import { ShieldAlert, ArrowLeft, Users, Shield, History, Server, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

type AdminTab = 'directory' | 'security' | 'infrastructure';

function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('directory');

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bg-default">
        <SectionWrapper className="pt-6 pb-28 text-left relative space-y-8">
          {/* Return link */}
          <button 
            onClick={() => router.push('/templates')}
            className="flex items-center gap-2 text-text-muted hover:text-text-heading font-bold text-xs font-mono transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Marketplace</span>
          </button>

          {/* Page Title */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-text-heading tracking-tight flex items-center gap-2.5">
                <ShieldAlert className="w-6 h-6 text-primary" />
                <span>Enterprise Governance & Administration</span>
              </h1>
              <p className="text-xs text-text-muted font-bold font-mono uppercase mt-1">
                Configure corporate identity maps, isolated clusters, and sandbox policy engines
              </p>
            </div>
          </div>

          {/* Org Limits Overview Banner */}
          <AdminOrgSettings />

          {/* Tab Navigation Menu */}
          <div className="flex border-b border-border-default shrink-0 gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('directory')}
              className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 font-mono transition-all flex items-center gap-1.5 ${
                activeTab === 'directory' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-muted hover:text-text-heading'
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              <span>Identity & Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 font-mono transition-all flex items-center gap-1.5 ${
                activeTab === 'security' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-muted hover:text-text-heading'
              }`}
            >
              <Shield className="w-4.5 h-4.5" />
              <span>Policies & Controls</span>
            </button>

            <button
              onClick={() => setActiveTab('infrastructure')}
              className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 font-mono transition-all flex items-center gap-1.5 ${
                activeTab === 'infrastructure' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-muted hover:text-text-heading'
              }`}
            >
              <Server className="w-4.5 h-4.5" />
              <span>Backups & Infrastructure</span>
            </button>
          </div>

          {/* Tab Content Rendering */}
          <div className="space-y-8">
            {activeTab === 'directory' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <AdminUserTable />
                </div>
                <div className="lg:col-span-1">
                  <AdminSSOConfig />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="grid grid-cols-1 gap-8">
                <AdminPolicyEngine />
                <AdminAuditLogViewer />
              </div>
            )}

            {activeTab === 'infrastructure' && (
              <div className="grid grid-cols-1 gap-8">
                <AdminBackupRestore />
                <AdminEnvironmentIsolation />
              </div>
            )}
          </div>
        </SectionWrapper>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default function AdminPageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <AdminPage />
    </PageErrorBoundary>
  );
}
