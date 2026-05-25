'use client';

import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { ComponentNode, AppSchema } from '../../types/builder';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Columns, Plus, Loader2
} from 'lucide-react';

interface CanvasPanelProps {
  readOnly?: boolean;
  previewSchema?: AppSchema;
}

export function CanvasPanel({ readOnly = false, previewSchema }: CanvasPanelProps) {
  const storeSchema = useBuilderStore((state) => state.schema);
  const selectedNodeId = useBuilderStore((state) => state.selectedNodeId);
  const selectNode = useBuilderStore((state) => state.selectNode);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const activeSchema = previewSchema || storeSchema;

  if (!activeSchema) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-bg-subtle text-text-muted select-none">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-bold">Loading canvas schema editor...</p>
      </div>
    );
  }

  // Click handler to select node on canvas
  const handleSelectNode = (e: React.MouseEvent, id: string) => {
    if (readOnly) return;
    e.stopPropagation(); // Prevent bubble up
    selectNode(id);
  };

  const isSelected = (id: string) => {
    return !readOnly && selectedNodeId === id;
  };

  // ----------------------------------------------------
  // Mock Data definitions
  // ----------------------------------------------------
  const mockCrmContacts = [
    { name: 'Alice Smith', email: 'alice@hightech.com', status: 'Qualified', dealValue: 12000 },
    { name: 'Bob Johnson', email: 'bob@enterprise.com', status: 'Contacted', dealValue: 8500 },
    { name: 'Charlie Brown', email: 'charlie@salesgroup.io', status: 'Lead', dealValue: 3200 },
    { name: 'Diana Prince', email: 'diana@themiscira.org', status: 'Lost', dealValue: 0 },
    { name: 'Edward Stark', email: 'edward@winterfell.net', status: 'Qualified', dealValue: 25000 },
  ];

  const mockHrEmployees = [
    { name: 'David Lee', role: 'Staff Engineer', department: 'Engineering', status: 'Active' },
    { name: 'Emma Watson', role: 'UX Designer', department: 'Design', status: 'On Leave' },
    { name: 'Frank Miller', role: 'Marketing Lead', department: 'Marketing', status: 'Active' },
    { name: 'Grace Hopper', role: 'Sales rep', department: 'Sales', status: 'Remote' },
  ];

  const mockAdminLogs = [
    { timestamp: '10:42:01', level: 'INFO', message: 'API validation token verified successfully.' },
    { timestamp: '10:41:45', level: 'WARN', message: 'CPU temperature spike detected: 78°C.' },
    { timestamp: '10:40:12', level: 'ERROR', message: 'Failed to write cache entry for session oa_s1.' },
    { timestamp: '10:39:55', level: 'INFO', message: 'Database connection pools initialized.' },
  ];

  const mockAnalyticsChartData = [
    { date: 'May 20', volume: 4500, visitors: 12000, step: 'Landing' },
    { date: 'May 21', volume: 6200, visitors: 8400, step: 'Signup' },
    { date: 'May 22', volume: 5100, visitors: 6100, step: 'Verify' },
    { date: 'May 23', volume: 7800, visitors: 4300, step: 'Billing' },
    { date: 'May 24', volume: 8500, visitors: 1200, step: 'Upgrade' },
  ];

  const mockInventoryProducts = [
    { sku: 'SKU-1002', productName: 'Silicon Microchips A4', quantity: 450, reorderThreshold: 500, status: 'Low Stock' },
    { sku: 'SKU-3009', productName: 'Ceramic Capacitors 10uF', quantity: 1200, reorderThreshold: 200, status: 'In Stock' },
    { sku: 'SKU-4511', productName: 'Alloy Resistors 100 Ohm', quantity: 0, reorderThreshold: 100, status: 'Out of Stock' },
  ];

  const mockSupportTickets = [
    { ticketId: 'TCK-401', customerName: 'John Doe', subject: 'Billing billing failed on Pro upgrade', priority: 'Urgent', status: 'Open' },
    { ticketId: 'TCK-402', customerName: 'Sarah Conner', subject: 'Lockout warning: account disabled error', priority: 'High', status: 'New' },
    { ticketId: 'TCK-403', customerName: 'Kyle Reese', subject: 'Cannot query databases via CLI login', priority: 'Normal', status: 'On Hold' },
  ];

  // ----------------------------------------------------
  // Dynamic Node Renderers
  // ----------------------------------------------------
  const renderComponent = (node: ComponentNode): React.ReactNode => {
    const borderClass = isSelected(node.id) 
      ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-bg-default' 
      : 'hover:ring-1 hover:ring-primary/40';

    switch (node.type) {
      // 1. Layout Node
      case 'layout':
        return (
          <div
            key={node.id}
            onClick={(e) => handleSelectNode(e, node.id)}
            className={`w-full p-4 rounded-xl border border-dashed border-border-default/80 flex flex-col gap-6 ${borderClass}`}
          >
            {/* If it maps to system metrics grid */}
            {node.id.includes('metrics') || node.id.includes('stats') || node.id.includes('grid') ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                {node.fields.filter(f => f.visible).map((field) => (
                  <div key={field.id} className="bg-bg-card border border-border-default rounded-xl p-5 text-left shadow-sm">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                      {field.label}
                    </span>
                    <div className="text-xl md:text-2xl font-extrabold text-text-heading flex items-center gap-1.5">
                      {field.name.toLowerCase().includes('revenue') || field.name.toLowerCase().includes('arr') ? '$' : ''}
                      {field.name.toLowerCase().includes('revenue') ? '42,500' : 
                       field.name.toLowerCase().includes('arr') ? '1,240,000' : 
                       field.name.toLowerCase().includes('deals') || field.name.toLowerCase().includes('tickets') ? '18' : 
                       field.name.toLowerCase().includes('uptime') ? '99.98%' : 
                       field.name.toLowerCase().includes('cpu') ? '12.4%' : 
                       field.name.toLowerCase().includes('ram') ? '3.8 GB' : '150'}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Render nested children */}
            {node.children && node.children.length > 0 && (
              <div className="flex flex-col gap-6 w-full">
                {node.children.map((child) => renderComponent(child))}
              </div>
            )}
          </div>
        );

      // 2. Nav Node (Header or Navbar)
      case 'nav':
        return (
          <div
            key={node.id}
            onClick={(e) => handleSelectNode(e, node.id)}
            className={`w-full bg-bg-card border border-border-default rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm ${borderClass}`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-text-heading">
                  {node.props.title || 'Workspace Module'}
                </h3>
                <span className="text-[10px] font-mono text-text-muted">appId: {activeSchema.appId}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider bg-bg-subtle px-2 py-1 rounded">
                Live Server
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-accent-teal" />
            </div>
          </div>
        );

      // 3. Table Node
      case 'table': {
        const visibleFields = node.fields.filter((f) => f.visible);
        const title = (node.props.title as string) || 'Database List';

        // Select mock data based on template categories
        let dataRows: Record<string, string | number | boolean>[] = mockCrmContacts;
        if (activeSchema.templateId === 'hr-dashboard') dataRows = mockHrEmployees;
        else if (activeSchema.templateId === 'admin-panel') {
          dataRows = node.id.includes('logs') ? mockAdminLogs : mockHrEmployees;
        } else if (activeSchema.templateId === 'analytics-dashboard') dataRows = mockCrmContacts;
        else if (activeSchema.templateId === 'inventory-system') {
          dataRows = node.id.includes('orders') ? mockSupportTickets : mockInventoryProducts;
        } else if (activeSchema.templateId === 'support-workspace') dataRows = mockSupportTickets;

        return (
          <div
            key={node.id}
            onClick={(e) => handleSelectNode(e, node.id)}
            className={`w-full bg-bg-card border border-border-default rounded-xl overflow-hidden shadow-sm text-left ${borderClass}`}
          >
            <div className="p-4 border-b border-border-subtle bg-bg-subtle/30 flex justify-between items-center">
              <h4 className="font-extrabold text-sm text-text-heading">{title}</h4>
              <span className="text-[10px] font-bold text-text-muted">{dataRows.length} items</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle text-[10px] font-extrabold uppercase tracking-wider text-text-muted bg-bg-subtle/10">
                    {visibleFields.map((f) => (
                      <th key={f.id} className="p-3.5 pl-6">{f.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-xs font-semibold text-text-body">
                  {dataRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-bg-subtle/20 transition-colors">
                      {visibleFields.map((f) => {
                        let cellVal = row[f.name];
                        if (cellVal === undefined) cellVal = '-';

                        // Special color pill formatting for status/priority
                        if (f.name === 'status' || f.name === 'priority' || f.name === 'level') {
                          let color = 'bg-bg-muted text-text-body border-border-default';
                          const cellValStr = String(cellVal);
                          if (['Active', 'Qualified', 'In Stock', 'INFO'].includes(cellValStr)) {
                            color = 'bg-tint-teal text-accent-green border-accent-teal/30';
                          } else if (['On Leave', 'Contacted', 'Low Stock', 'WARN', 'Open', 'High'].includes(cellValStr)) {
                            color = 'bg-tint-yellow text-dark-navy border-accent-yellow/40';
                          } else if (['Lost', 'Out of Stock', 'ERROR', 'Urgent'].includes(cellValStr)) {
                            color = 'bg-tint-pink text-accent-pink border-accent-pink/30';
                          }
                          return (
                            <td key={f.id} className="p-3.5 pl-6">
                              <span className={`px-2 py-0.5 rounded-full border text-[10px] ${color}`}>
                                {cellVal}
                              </span>
                            </td>
                          );
                        }

                        // Currency formatting
                        if (f.name === 'dealValue' || f.name === 'amountPaid') {
                          return (
                            <td key={f.id} className="p-3.5 pl-6 font-bold text-text-heading">
                              ${cellVal.toLocaleString()}
                            </td>
                          );
                        }

                        return (
                          <td key={f.id} className="p-3.5 pl-6 truncate max-w-[200px]" title={String(cellVal)}>
                            {cellVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      // 4. Kanban Node
      case 'kanban': {
        const title = (node.props.title as string) || 'Pipeline Board';
        const columns = node.fields.filter(f => f.visible);

        interface KanbanCard {
          id: string;
          title: string;
          value: number;
          contact: string;
        }
        const mockKanbanCards: Record<string, KanbanCard[]> = {
          'lead': [
            { id: '1', title: 'Acme Corp Upgrade', value: 4500, contact: 'Carl Finch' },
          ],
          'qualified': [
            { id: '2', title: 'Stripe API Tunneling', value: 12000, contact: 'Elena Stark' },
            { id: '3', title: 'Figma Seats Renewal', value: 1800, contact: 'Alice Jones' },
          ],
          'proposal': [
            { id: '4', title: 'Retool Private Deploy', value: 25000, contact: 'Bob Watson' },
          ],
          'won': [
            { id: '5', title: 'Linear SSO Provision', value: 8500, contact: 'Marcus Finch' },
          ],
        };

        return (
          <div
            key={node.id}
            onClick={(e) => handleSelectNode(e, node.id)}
            className={`w-full bg-bg-card border border-border-default rounded-xl p-4 shadow-sm text-left flex flex-col gap-4 ${borderClass}`}
          >
            <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
              <h4 className="font-extrabold text-sm text-text-heading flex items-center gap-1.5">
                <Columns className="h-4 w-4 text-accent-yellow" />
                {title}
              </h4>
              <button className="p-1 rounded bg-bg-subtle border border-border-default text-text-muted hover:text-primary">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
              {columns.map((col) => {
                const cards = mockKanbanCards[col.name] || [];
                return (
                  <div key={col.id} className="bg-bg-subtle rounded-xl p-3 border border-border-subtle/80 flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-[10px] font-extrabold text-text-muted uppercase tracking-wider px-1">
                      <span>{col.label}</span>
                      <span className="bg-bg-card border border-border-subtle px-1.5 py-0.5 rounded-full">
                        {cards.length}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2 max-h-72 overflow-y-auto">
                      {cards.map((c) => (
                        <div key={c.id} className="bg-bg-card border border-border-default rounded-lg p-3 shadow-xs hover:border-primary/20 transition-all select-none">
                          <h5 className="font-bold text-xs text-text-heading truncate mb-1">{c.title}</h5>
                          <div className="flex justify-between items-center text-[10px] font-semibold text-text-muted">
                            <span>{c.contact}</span>
                            <span className="font-bold text-text-heading">${c.value.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      // 5. Chart Node
      case 'chart': {
        const title = (node.props.title as string) || 'Performance Charts';
        const chartType = (node.props.chartType as string) || 'area';

        return (
          <div
            key={node.id}
            onClick={(e) => handleSelectNode(e, node.id)}
            className={`w-full bg-bg-card border border-border-default rounded-xl p-5 shadow-sm text-left flex flex-col gap-4 ${borderClass}`}
          >
            <div>
              <h4 className="font-extrabold text-sm text-text-heading">{title}</h4>
              <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">{chartType} chart format</span>
            </div>

            <div className="w-full h-64 md:h-72">
              {!mounted ? (
                <div className="w-full h-full bg-bg-subtle/50 animate-pulse rounded-xl flex items-center justify-center text-xs font-bold text-text-muted">
                  Rendering interactive analytics...
                </div>
              ) : chartType === 'area' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockAnalyticsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#635BFF" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#697386" fontSize={10} tickLine={false} />
                    <YAxis stroke="#697386" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="volume" stroke="#635BFF" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : chartType === 'bar' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockAnalyticsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="step" stroke="#697386" fontSize={10} tickLine={false} />
                    <YAxis stroke="#697386" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Bar dataKey="visitors" fill="#FF5996" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : chartType === 'pie' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Engineering', value: 45 },
                        { name: 'Design', value: 15 },
                        { name: 'Marketing', value: 20 },
                        { name: 'Sales', value: 20 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#635BFF" />
                      <Cell fill="#00D4B1" />
                      <Cell fill="#FF5996" />
                      <Cell fill="#FFB17A" />
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </div>
        );
      }

      // 6. Form Node
      case 'form': {
        const fields = node.fields.filter(f => f.visible);
        const title = (node.props.formTitle as string) || 'Settings Editor';
        const buttonText = (node.props.submitButtonText as string) || 'Submit';

        return (
          <div
            key={node.id}
            onClick={(e) => handleSelectNode(e, node.id)}
            className={`w-full bg-bg-card border border-border-default rounded-xl p-5 shadow-sm text-left flex flex-col gap-4 max-w-lg ${borderClass}`}
          >
            <div>
              <h4 className="font-extrabold text-sm text-text-heading">{title}</h4>
              <span className="text-[10px] text-text-muted font-semibold leading-relaxed">Fill out input field variables.</span>
            </div>

            <div className="space-y-4">
              {fields.map((f) => {
                const isSelect = f.type === 'select';
                const isBoolean = f.type === 'boolean';
                const isDate = f.type === 'date';

                return (
                  <div key={f.id} className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-heading uppercase tracking-wide">
                      {f.label}
                    </label>

                    {isSelect ? (
                      <select className="w-full bg-bg-subtle border border-border-default rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none text-text-heading">
                        {f.options?.map((opt) => (
                          <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                        ))}
                      </select>
                    ) : isBoolean ? (
                      <div className="flex items-center gap-2.5">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary text-white rounded border-border-default" />
                        <span className="text-xs font-semibold text-text-body">Toggle switch active</span>
                      </div>
                    ) : isDate ? (
                      <input type="date" className="w-full bg-bg-subtle border border-border-default rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none text-text-heading" />
                    ) : (
                      <input type="text" placeholder={f.label} className="w-full bg-bg-subtle border border-border-default rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none text-text-heading" />
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => alert(`Submitted ${title} form payload!`)}
                className="bg-primary hover:bg-primary-light text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition-colors"
              >
                {buttonText}
              </button>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-bg-subtle/40 dark:bg-bg-subtle/10 grid-mesh min-h-full">
      {activeSchema.components.map((comp) => renderComponent(comp))}
    </div>
  );
}

export default CanvasPanel;
