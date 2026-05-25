import { prisma } from '../lib/db';

async function main() {
  const templates = [
    {
      name: 'CRM Workspace',
      slug: 'crm-workspace',
      category: 'CRM',
      complexity: 'Moderate',
      description: 'A full CRM workspace with contacts, deals pipeline, and activity feed.',
      components: ['ContactsTable', 'DealsKanban', 'ActivityFeed', 'StatsBar'],
      tags: ['crm', 'customer', 'contact', 'deal', 'sales', 'pipeline', 'lead'],
      schemaDefaults: {
        appName: 'CRM Workspace',
        templateSlug: 'crm-workspace',
        components: [
          {
            id: 'stats-bar',
            name: 'StatsBar',
            type: 'layout',
            children: [],
            fields: [],
            props: { title: 'Overview' },
          },
          {
            id: 'contacts-table',
            name: 'ContactsTable',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'name',   type: 'text',   label: 'Name',   required: true,  visible: true },
              { id: 'f2', name: 'email',  type: 'text',   label: 'Email',  required: true,  visible: true },
              { id: 'f3', name: 'status', type: 'select', label: 'Status', required: false, visible: true },
            ],
            props: { title: 'Contacts' },
          },
          {
            id: 'deals-kanban',
            name: 'DealsKanban',
            type: 'kanban',
            children: [],
            fields: [
              { id: 'f4', name: 'deal',  type: 'text',   label: 'Deal',  required: true,  visible: true },
              { id: 'f5', name: 'value', type: 'number', label: 'Value', required: false, visible: true },
            ],
            props: { title: 'Deals Pipeline' },
          },
        ],
      },
    },
    {
      name: 'HR Dashboard',
      slug: 'hr-dashboard',
      category: 'HR',
      complexity: 'Simple',
      description: 'Manage employees, track hiring status, and run onboarding workflows.',
      components: ['EmployeeTable', 'HiringTracker', 'OnboardingChecklist'],
      tags: ['hr', 'human resources', 'employee', 'hiring', 'onboarding', 'payroll', 'staff'],
      schemaDefaults: {
        appName: 'HR Dashboard',
        templateSlug: 'hr-dashboard',
        components: [
          {
            id: 'employee-table',
            name: 'EmployeeTable',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'name',       type: 'text',   label: 'Name',       required: true,  visible: true },
              { id: 'f2', name: 'department', type: 'select', label: 'Department', required: false, visible: true },
              { id: 'f3', name: 'startDate',  type: 'date',   label: 'Start Date', required: false, visible: true },
            ],
            props: { title: 'Employees' },
          },
        ],
      },
    },
    {
      name: 'Admin Panel',
      slug: 'admin-panel',
      category: 'Admin',
      complexity: 'Simple',
      description: 'User management, role assignments, and system settings in one place.',
      components: ['UsersTable', 'RoleManager', 'SettingsPanel'],
      tags: ['admin', 'panel', 'management', 'control', 'settings', 'users', 'roles'],
      schemaDefaults: {
        appName: 'Admin Panel',
        templateSlug: 'admin-panel',
        components: [
          {
            id: 'users-table',
            name: 'UsersTable',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'name',  type: 'text',   label: 'Name',  required: true,  visible: true },
              { id: 'f2', name: 'email', type: 'text',   label: 'Email', required: true,  visible: true },
              { id: 'f3', name: 'role',  type: 'select', label: 'Role',  required: false, visible: true },
            ],
            props: { title: 'Users' },
          },
        ],
      },
    },
    {
      name: 'Analytics Dashboard',
      slug: 'analytics-dashboard',
      category: 'Analytics',
      complexity: 'Advanced',
      description: 'Revenue charts, KPI metrics, and user growth analytics with Recharts.',
      components: ['RevenueChart', 'KPIBar', 'UserGrowthLine', 'TrafficPie'],
      tags: ['analytics', 'chart', 'metrics', 'dashboard', 'revenue', 'kpi', 'report', 'data'],
      schemaDefaults: {
        appName: 'Analytics Dashboard',
        templateSlug: 'analytics-dashboard',
        components: [
          {
            id: 'kpi-bar',
            name: 'KPIBar',
            type: 'layout',
            children: [],
            fields: [],
            props: { title: 'KPIs' },
          },
          {
            id: 'revenue-chart',
            name: 'RevenueChart',
            type: 'chart',
            children: [],
            fields: [
              { id: 'f1', name: 'month',   type: 'text',   label: 'Month',   required: true, visible: true },
              { id: 'f2', name: 'revenue', type: 'number', label: 'Revenue', required: true, visible: true },
            ],
            props: { title: 'Revenue Over Time', chartType: 'area' },
          },
        ],
      },
    },
    {
      name: 'Inventory System',
      slug: 'inventory-system',
      category: 'Inventory',
      complexity: 'Moderate',
      description: 'Track stock levels, manage SKUs, and monitor warehouse supply.',
      components: ['ProductsTable', 'StockAlerts', 'WarehouseMap'],
      tags: ['inventory', 'stock', 'warehouse', 'product', 'supply', 'sku', 'items'],
      schemaDefaults: {
        appName: 'Inventory System',
        templateSlug: 'inventory-system',
        components: [
          {
            id: 'products-table',
            name: 'ProductsTable',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'sku',      type: 'text',   label: 'SKU',      required: true,  visible: true },
              { id: 'f2', name: 'name',     type: 'text',   label: 'Name',     required: true,  visible: true },
              { id: 'f3', name: 'quantity', type: 'number', label: 'Quantity', required: false, visible: true },
              { id: 'f4', name: 'status',   type: 'select', label: 'Status',   required: false, visible: true },
            ],
            props: { title: 'Products' },
          },
        ],
      },
    },
    {
      name: 'Support Workspace',
      slug: 'support-workspace',
      category: 'Support',
      complexity: 'Moderate',
      description: 'Helpdesk ticket management, customer request tracking, and issue resolution.',
      components: ['TicketsTable', 'StatusKanban', 'ResponseForm'],
      tags: ['support', 'ticket', 'helpdesk', 'customer service', 'issue', 'request'],
      schemaDefaults: {
        appName: 'Support Workspace',
        templateSlug: 'support-workspace',
        components: [
          {
            id: 'tickets-table',
            name: 'TicketsTable',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'subject',  type: 'text',   label: 'Subject',  required: true,  visible: true },
              { id: 'f2', name: 'status',   type: 'select', label: 'Status',   required: false, visible: true },
              { id: 'f3', name: 'priority', type: 'select', label: 'Priority', required: false, visible: true },
            ],
            props: { title: 'Support Tickets' },
          },
        ],
      },
    },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: t as any,
      create: t as any,
    });
    console.log(`✓ Seeded: ${t.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
