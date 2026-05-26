'use client';

import React, { useState } from 'react';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/shared/Footer';
import { BookOpen, ChevronRight, Copy, Check } from 'lucide-react';

interface DocArticle {
  id: string;
  title: string;
  category: string;
  content: React.ReactNode;
}

export default function DocsPage() {
  const [activeArticleId, setActiveArticleId] = useState('getting-started');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    {
      title: 'Getting Started',
      items: [
        { id: 'getting-started', label: 'Introduction' },
        { id: 'cli-setup', label: 'CLI & Local Setup' },
        { id: 'deployment', label: 'Cloud Deployment' },
      ],
    },
    {
      title: 'Concepts',
      items: [
        { id: 'schemas', label: 'App State Schemas' },
        { id: 'mutation-engine', label: 'Mutation Actions' },
        { id: 'data-connectors', label: 'Database Connections' },
      ],
    },
    {
      title: 'API Reference',
      items: [
        { id: 'rest-endpoints', label: 'Platform REST API' },
        { id: 'auth-tokens', label: 'Access Tokens' },
      ],
    },
  ];

  const articles: Record<string, DocArticle> = {
    'getting-started': {
      id: 'getting-started',
      title: 'Introduction to OneAtlas',
      category: 'Getting Started',
      content: (
        <div className="space-y-6">
          <p className="text-text-body font-semibold leading-relaxed">
            OneAtlas is an AI-native developer workspace designed to accelerate internal application building. Instead of spending hours styling table grids, writing form validation patterns, or arranging layout divs, you declare interface states via abstract JSON schemas.
          </p>
          <div className="bg-bg-subtle border border-border-default p-5 rounded-2xl">
            <h4 className="font-bold text-text-heading text-sm mb-2">Core Philosophy</h4>
            <ul className="list-disc list-inside text-xs md:text-sm text-text-muted space-y-2 font-medium">
              <li><strong>Schema as Truth:</strong> UI components render dynamically from abstract schema declarations.</li>
              <li><strong>Targeted Mutations:</strong> Prompts mutate targeted schema nodes instead of rebuilding from scratch.</li>
              <li><strong>Strict Isolation:</strong> Applications run inside secure virtualization layers with private DB connections.</li>
            </ul>
          </div>
          <p className="text-text-body font-medium leading-relaxed">
            Once generated, applications are completely editable visually on our canvas, or directly via the code terminal.
          </p>
        </div>
      ),
    },
    'cli-setup': {
      id: 'cli-setup',
      title: 'CLI Setup & Local Workspace Runner',
      category: 'Getting Started',
      content: (
        <div className="space-y-6">
          <p className="text-text-body font-semibold leading-relaxed">
            You can synchronize local schemas with your IDE editor using the OneAtlas CLI. Follow these terminal steps:
          </p>
          
          <div className="relative bg-dark-navy text-white/90 p-5 rounded-2xl font-mono text-xs md:text-sm shadow-inner group">
            <button
              onClick={() => handleCopyCode('npm i -g @oneatlas/cli\noneatlas login --token=oa_test_xyz123\noneatlas pull crm-workspace --dir=./my-app', 'cli-inst')}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              aria-label="Copy code snippet"
            >
              {copiedCode === 'cli-inst' ? <Check className="h-4 w-4 text-accent-teal" /> : <Copy className="h-4 w-4" />}
            </button>
            <pre className="overflow-x-auto leading-relaxed">
{`# 1. Install the CLI tool
npm i -g @oneatlas/cli

# 2. Login to your cloud console
oneatlas login --token=oa_test_xyz123

# 3. Pull a schema snapshot locally
oneatlas pull crm-workspace --dir=./my-app`}
            </pre>
          </div>

          <p className="text-text-body font-medium leading-relaxed">
            Once pulled, the schema is saved as a structured `atlas.json` file. You can commit this file to Git, share it with colleagues, or execute it locally via `oneatlas dev`.
          </p>
        </div>
      ),
    },
    'deployment': {
      id: 'deployment',
      title: 'Deploying Schemas to Production',
      category: 'Getting Started',
      content: (
        <div className="space-y-6">
          <p className="text-text-body font-semibold leading-relaxed">
            Deploying a OneAtlas app compiles the state schema and provisions secure Postgres clusters instantly.
          </p>
          <div className="bg-bg-subtle border border-border-default p-5 rounded-2xl">
            <h4 className="font-bold text-text-heading text-sm mb-2">Production Targets</h4>
            <p className="text-xs md:text-sm text-text-muted leading-relaxed mb-4 font-medium">
              We support two deployment modes:
            </p>
            <ul className="list-disc list-inside text-xs md:text-sm text-text-muted space-y-2 font-medium">
              <li><strong>Hosted Cloud (Default):</strong> Managed server compute and isolated Postgres clusters hosted in our SOC 2 certified AWS region.</li>
              <li><strong>Self-Hosted VPC (Enterprise):</strong> provision and run containers in your own AWS/GCP accounts using custom Terraform configurations.</li>
            </ul>
          </div>
          <p className="text-text-body font-medium leading-relaxed">
            Simply click the &quot;Deploy&quot; button on the builder shell or push your changes using `git push origin main` after enabling our GitHub Integration.
          </p>
        </div>
      ),
    },
    'schemas': {
      id: 'schemas',
      title: 'App State Schemas Specification',
      category: 'Concepts',
      content: (
        <div className="space-y-6">
          <p className="text-text-body font-semibold leading-relaxed">
            Every application generated by OneAtlas is governed by a rigid abstract structure. Below is an overview of the component configuration spec:
          </p>

          <div className="relative bg-dark-navy text-white/90 p-5 rounded-2xl font-mono text-xs md:text-sm shadow-inner">
            <button
              onClick={() => handleCopyCode('{\n  "appId": "crm-app-1",\n  "appName": "CRM Workspace",\n  "version": 2,\n  "components": [\n    {\n      "id": "crm-root",\n      "name": "Root Layout",\n      "type": "layout",\n      "children": [],\n      "fields": []\n    }\n  ]\n}', 'schema-json')}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              {copiedCode === 'schema-json' ? <Check className="h-4 w-4 text-accent-teal" /> : <Copy className="h-4 w-4" />}
            </button>
            <pre className="overflow-x-auto leading-relaxed">
{`{
  "appId": "crm-app-1",
  "appName": "CRM Workspace",
  "version": 2,
  "components": [
    {
      "id": "crm-root",
      "name": "Root Layout",
      "type": "layout",
      "children": [],
      "fields": []
    }
  ]
}`}
            </pre>
          </div>

          <p className="text-text-body font-medium leading-relaxed">
            The schema editor maps components to layout panels, grids, tables, and buttons. When these schemas are mutated, the client-side renderer instantly shifts without full code updates.
          </p>
        </div>
      ),
    },
    'mutation-engine': {
      id: 'mutation-engine',
      title: 'Targeted Schema Mutation Engine',
      category: 'Concepts',
      content: (
        <div className="space-y-6">
          <p className="text-text-body font-semibold leading-relaxed">
            Traditional AI coding builders re-write the entire codebase when a prompt changes. OneAtlas implements **targeted schema mutations**.
          </p>
          <p className="text-text-body font-medium leading-relaxed">
            If you submit a prompt like &quot;add a status column to contacts&quot;, our compiler parses the target node in the schema, appends a new field to the Contacts table, and updates the local state.
          </p>
          <div className="bg-bg-subtle border border-border-default p-4 rounded-xl text-xs font-bold text-primary">
            Benefit: 100% deterministic edits, zero code regressions, and immediate canvas redraws.
          </div>
        </div>
      ),
    },
    'data-connectors': {
      id: 'data-connectors',
      title: 'Database Connections & API Bindings',
      category: 'Concepts',
      content: (
        <div className="space-y-6">
          <p className="text-text-body font-semibold leading-relaxed">
            OneAtlas generated apps can bind directly to external API sources and database engines.
          </p>
          <p className="text-text-body font-medium leading-relaxed">
            You declare database connectors inside your global configuration. Component properties (such as table rows) can query SQL statements or trigger REST endpoints dynamically using authorization headers saved securely in our vault.
          </p>
        </div>
      ),
    },
    'rest-endpoints': {
      id: 'rest-endpoints',
      title: 'Platform REST API endpoints',
      category: 'API Reference',
      content: (
        <div className="space-y-6">
          <p className="text-text-body font-semibold leading-relaxed">
            Integrate OneAtlas with external deployment pipelines using our REST API:
          </p>

          <div className="relative bg-dark-navy text-white/90 p-5 rounded-2xl font-mono text-xs md:text-sm shadow-inner">
            <button
              onClick={() => handleCopyCode('curl -X POST https://api.oneatlas.com/v1/apps \\\n  -H "Authorization: Bearer oa_key_123" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"templateId": "crm-workspace", "appName": "My CRM"}\'', 'curl-post')}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              {copiedCode === 'curl-post' ? <Check className="h-4 w-4 text-accent-teal" /> : <Copy className="h-4 w-4" />}
            </button>
            <pre className="overflow-x-auto leading-relaxed">
{`# Create a new application from schema template
curl -X POST https://api.oneatlas.com/v1/apps \\
  -H "Authorization: Bearer oa_key_123" \\
  -H "Content-Type: application/json" \\
  -d '{"templateId": "crm-workspace", "appName": "My CRM"}'`}
            </pre>
          </div>
          
          <p className="text-text-body font-medium leading-relaxed">
            The endpoint returns the newly generated application ID, initial schema configurations, and deployment endpoint URL.
          </p>
        </div>
      ),
    },
    'auth-tokens': {
      id: 'auth-tokens',
      title: 'Authenticating API Requests',
      category: 'API Reference',
      content: (
        <div className="space-y-6">
          <p className="text-text-body font-semibold leading-relaxed">
            All API calls must contain a Bearer access token inside the Authorization request header.
          </p>
          <p className="text-text-body font-medium leading-relaxed">
            Generate tokens from your User Settings dashboard under the API Keys tab. Protect these tokens carefully.
          </p>
        </div>
      ),
    },
  };

  const activeArticle = articles[activeArticleId] || articles['getting-started'];

  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 shrink-0 text-left border-r border-border-default/50 pr-4 lg:sticky lg:top-24 h-fit">
          <div className="flex items-center gap-2 text-text-heading font-bold text-base mb-6 border-b border-border-subtle pb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Developer Guides</span>
          </div>

          <div className="space-y-6">
            {sections.map((sec) => (
              <div key={sec.title}>
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5 px-3">
                  {sec.title}
                </h4>
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const isActive = activeArticleId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveArticleId(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors flex items-center justify-between group ${
                          isActive
                            ? 'bg-primary/10 text-primary  '
                            : 'text-text-body hover:bg-bg-subtle hover:text-primary'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100 text-primary' : 'text-text-muted'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <article className="flex-1 text-left max-w-3xl pb-16">
          <div className="border-b border-border-subtle pb-6 mb-6">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
              {activeArticle.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-heading tracking-tight leading-tight">
              {activeArticle.title}
            </h1>
          </div>

          {activeArticle.content}
        </article>

      </main>
      <Footer />
    </>
  );
}
