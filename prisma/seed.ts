import { prisma } from '../lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Clearing database tables for clean seeding...');
  await prisma.featuredCollection.deleteMany();
  
  const templates = [
    {
      name: 'CRM Workspace',
      slug: 'crm-workspace',
      category: 'CRM',
      complexity: 'Moderate',
      description: 'A comprehensive operational space to track leads, manage accounts, and monitor sales pipelines.',
      components: ['StatsBar', 'ContactsTable', 'DealsKanban', 'ActivityFeed'],
      tags: ['Sales', 'Pipeline', 'Operations'],
      subtitle: 'Streamline your sales pipeline and lead tracking',
      features: ['Kanban Deal Board', 'Lead Scoring', 'Activity Timeline', 'Export Reports'],
      screenshots: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'],
      author: 'OneAtlas CRM Labs',
      author_verified: true,
      price_type: 'free',
      price_amount: 0,
      clone_count: 1240,
      rating: 4.8,
      usage_velocity: 85,
      version: '1.2.0',
      ai_ready: true,
      backend_enabled: true,
      realtime_enabled: true,
      deployment_ready: true,
      permissions_required: ['ReadContacts', 'WriteDeals', 'SendEmails'],
      integrations: ['Slack', 'Google Sheets', 'Gmail'],
      workflows: ['Lead Created -> Send Slack Notification', 'Deal Closed -> Generate Invoice'],
      entities: ['Lead', 'Contact', 'Deal', 'Activity'],
      health_score: 96,
      status: 'published',
      visibility: true,
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
      description: 'An internal dashboard to manage employee listings, monitor leave requests, and track department heads.',
      components: ['EmployeeTable', 'LeaveRequestForm', 'DepartmentChart'],
      tags: ['People', 'Directory', 'Admin'],
      subtitle: 'Manage directory listings and time-off requests',
      features: ['Employee Directory', 'Time-off Approval Flow', 'Department Headcount Chart'],
      screenshots: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'],
      author: 'OneAtlas People Labs',
      author_verified: true,
      price_type: 'free',
      price_amount: 0,
      clone_count: 840,
      rating: 4.5,
      usage_velocity: 45,
      version: '1.0.1',
      ai_ready: true,
      backend_enabled: true,
      realtime_enabled: false,
      deployment_ready: true,
      permissions_required: ['ReadEmployees', 'ApproveLeave'],
      integrations: ['Slack', 'BambooHR'],
      workflows: ['Leave Approved -> Calendar Invite Created'],
      entities: ['Employee', 'LeaveRequest', 'Department'],
      health_score: 92,
      status: 'published',
      visibility: true,
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
      description: 'A clean console for system administrators to view logs, toggle feature flags, and manage user roles.',
      components: ['SystemMetricsGrid', 'FeatureFlagToggle', 'UserAccessList', 'SystemLogsViewer'],
      tags: ['Systems', 'Logs', 'Management'],
      subtitle: 'System logs, feature flags, and configuration panel',
      features: ['Live System Logs', 'Feature Flag Switcher', 'RBAC User Management'],
      screenshots: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'],
      author: 'OneAtlas Ops',
      author_verified: true,
      price_type: 'free',
      price_amount: 0,
      clone_count: 950,
      rating: 4.6,
      usage_velocity: 60,
      version: '2.0.0',
      ai_ready: false,
      backend_enabled: true,
      realtime_enabled: true,
      deployment_ready: true,
      permissions_required: ['ManageSettings', 'ReadLogs', 'WriteFlags'],
      integrations: ['Datadog', 'Logstash'],
      workflows: ['Error Fired -> Alert Pagerduty'],
      entities: ['LogEntry', 'FeatureFlag', 'UserRole'],
      health_score: 98,
      status: 'published',
      visibility: true,
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
      description: 'A high-fidelity reporting dashboard with interactive charts, key performance metrics, and funnel logs.',
      components: ['SalesChart', 'ConversionFunnel', 'TopMetricsGrid', 'RevenueTable'],
      tags: ['Charts', 'Revenue', 'Reporting'],
      subtitle: 'Track KPIs, revenue pools, and conversions',
      features: ['Funnel Analysis', 'Cohort Retention Grid', 'Realtime Map View', 'PDF Export'],
      screenshots: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'],
      author: 'Atlas Intelligence',
      author_verified: true,
      price_type: 'pro',
      price_amount: 29.0,
      clone_count: 3100,
      rating: 4.9,
      usage_velocity: 195,
      version: '3.1.0',
      ai_ready: true,
      backend_enabled: true,
      realtime_enabled: true,
      deployment_ready: true,
      permissions_required: ['ReadBilling', 'ReadAnalytics', 'WriteDashboards'],
      integrations: ['Stripe', 'Segment', 'Google Analytics'],
      workflows: ['Revenue Threshold Met -> Send Celebration Slack'],
      entities: ['PageView', 'ConversionRate', 'RevenueSnapshot'],
      health_score: 99,
      status: 'published',
      visibility: true,
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
      description: 'A stock management application to audit warehouse inventory levels, monitor suppliers, and check order queues.',
      components: ['ProductStockTable', 'SupplierDirectory', 'ReorderForm', 'PendingOrdersQueue'],
      tags: ['Stock', 'Supply Chain', 'Orders'],
      subtitle: 'Manage warehouse counts and supply pipelines',
      features: ['Supplier Database', 'Auto-reorder Thresholds', 'Barcode Scanner API'],
      screenshots: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'],
      author: 'SupplyChain Labs',
      author_verified: false,
      price_type: 'free',
      price_amount: 0,
      clone_count: 520,
      rating: 4.2,
      usage_velocity: 35,
      version: '1.0.0',
      ai_ready: true,
      backend_enabled: true,
      realtime_enabled: false,
      deployment_ready: true,
      permissions_required: ['ReadInventory', 'WriteInventory', 'ManageSuppliers'],
      integrations: ['Shopify', 'ShipStation'],
      workflows: ['Stock Below 10 -> Create Supplier PO'],
      entities: ['Product', 'Supplier', 'Order', 'StockMovement'],
      health_score: 88,
      status: 'published',
      visibility: true,
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
      description: 'An SLA-driven ticketing desk containing support queues, customer history, and response triggers.',
      components: ['TicketList', 'TicketDetailPanel', 'SLATimerGrid', 'CustomerHistoryCard'],
      tags: ['Tickets', 'SLA', 'Helpdesk'],
      subtitle: 'SLA-driven customer ticketing workspace',
      features: ['SLA Timers', 'Macro Responses', 'Multi-channel Queue Merger'],
      screenshots: ['https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=800&q=80'],
      author: 'Atlas Helpdesk Inc.',
      author_verified: true,
      price_type: 'free',
      price_amount: 0,
      clone_count: 710,
      rating: 4.4,
      usage_velocity: 50,
      version: '1.4.0',
      ai_ready: true,
      backend_enabled: true,
      realtime_enabled: true,
      deployment_ready: true,
      permissions_required: ['ReadTickets', 'WriteTickets', 'ResolveIncidents'],
      integrations: ['Zendesk', 'Intercom', 'Slack'],
      workflows: ['Ticket Unresolved 24h -> Escalate to Manager'],
      entities: ['Ticket', 'Customer', 'SLAConfig', 'IncidentEvent'],
      health_score: 94,
      status: 'published',
      visibility: true,
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
    {
      name: 'Marketing Tracker',
      slug: 'marketing-tracker',
      category: 'Analytics',
      complexity: 'Moderate',
      description: 'Monitor active ad spend, campaign CTRs, and ROI across multiple social networks.',
      components: ['CampaignMetrics', 'AdSpendChart', 'RoiCalculator'],
      tags: ['Marketing', 'ROI', 'Ads'],
      subtitle: 'Aggregated marketing KPIs and ad-spend control',
      features: ['Campaign Comparison', 'Cost-per-acquisition Calculator', 'Excel Exporter'],
      screenshots: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80'],
      author: 'Atlas Growth Labs',
      author_verified: true,
      price_type: 'free',
      price_amount: 0,
      clone_count: 460,
      rating: 4.3,
      usage_velocity: 28,
      version: '1.0.0',
      ai_ready: true,
      backend_enabled: true,
      realtime_enabled: false,
      deployment_ready: true,
      permissions_required: ['ReadAnalytics'],
      integrations: ['Facebook Ads', 'Google Ads', 'Mailchimp'],
      workflows: ['ROI drops below 1.5 -> Pause Adset Alert'],
      entities: ['Campaign', 'Adgroup', 'ClickEvent'],
      health_score: 90,
      status: 'published',
      visibility: true,
      schemaDefaults: {
        appName: 'Marketing Tracker',
        templateSlug: 'marketing-tracker',
        components: [
          {
            id: 'campaign-metrics',
            name: 'CampaignMetrics',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'campaign', type: 'text', label: 'Campaign', required: true, visible: true },
              { id: 'f2', name: 'roi', type: 'number', label: 'ROI', required: false, visible: true },
            ],
            props: { title: 'Campaign Metrics' },
          }
        ]
      }
    },
    {
      name: 'Bug Tracker',
      slug: 'bug-tracker',
      category: 'Support',
      complexity: 'Simple',
      description: 'An agile task board tailored specifically for logging, assigning, and resolving application bugs.',
      components: ['BugKanban', 'ErrorMetricsSummary', 'AssigneeSelector'],
      tags: ['DevOps', 'QA', 'Agile'],
      subtitle: 'Track software defects and engineering workflows',
      features: ['Agile Kanban Board', 'Crash Log Uploader', 'Assigned Notifications'],
      screenshots: ['https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80'],
      author: 'OneAtlas Dev',
      author_verified: true,
      price_type: 'free',
      price_amount: 0,
      clone_count: 680,
      rating: 4.6,
      usage_velocity: 42,
      version: '1.1.0',
      ai_ready: true,
      backend_enabled: true,
      realtime_enabled: true,
      deployment_ready: true,
      permissions_required: ['ManageBugs', 'ReadCodeMetadata'],
      integrations: ['GitHub', 'Jira', 'Sentry'],
      workflows: ['Bug Severity High -> Ping Pagerduty'],
      entities: ['BugReport', 'Developer', 'ReleaseVersion'],
      health_score: 95,
      status: 'published',
      visibility: true,
      schemaDefaults: {
        appName: 'Bug Tracker',
        templateSlug: 'bug-tracker',
        components: [
          {
            id: 'bug-kanban',
            name: 'BugKanban',
            type: 'kanban',
            children: [],
            fields: [
              { id: 'f1', name: 'issue', type: 'text', label: 'Issue', required: true, visible: true },
              { id: 'f2', name: 'severity', type: 'select', label: 'Severity', required: true, visible: true },
            ],
            props: { title: 'Bugs Board' }
          }
        ]
      }
    },
    {
      name: 'Knowledge Base',
      slug: 'knowledge-base',
      category: 'Admin',
      complexity: 'Simple',
      description: 'A markdown-powered wiki portal for hosting internal policies, guidelines, and company resources.',
      components: ['WikiReader', 'MarkdownEditor', 'ArticleTree'],
      tags: ['Wiki', 'Content', 'Internal'],
      subtitle: 'Host employee handbooks and technical wikis',
      features: ['Markdown Editor', 'Hierarchical Article Trees', 'FTS Text Search'],
      screenshots: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'],
      author: 'Atlas Content Inc.',
      author_verified: true,
      price_type: 'free',
      price_amount: 0,
      clone_count: 390,
      rating: 4.1,
      usage_velocity: 18,
      version: '1.0.0',
      ai_ready: false,
      backend_enabled: false,
      realtime_enabled: false,
      deployment_ready: true,
      permissions_required: ['ReadArticles', 'WriteArticles'],
      integrations: ['Confluence', 'Notion'],
      workflows: ['Article Published -> Broadcast on Slack General'],
      entities: ['Article', 'Category', 'RevisionLog'],
      health_score: 89,
      status: 'published',
      visibility: true,
      schemaDefaults: {
        appName: 'Knowledge Base',
        templateSlug: 'knowledge-base',
        components: [
          {
            id: 'wiki-reader',
            name: 'WikiReader',
            type: 'layout',
            children: [],
            fields: [],
            props: { title: 'Articles Wiki' }
          }
        ]
      }
    },
    {
      name: 'E-Commerce Console',
      slug: 'e-commerce-backend',
      category: 'Inventory',
      complexity: 'Advanced',
      description: 'Control retail orders, manage catalog variants, audit payouts, and track delivery logs.',
      components: ['StoreCatalog', 'OrdersFulfillment', 'RevenueTimeline', 'DeliveryScheduler'],
      tags: ['Sales', 'Retail', 'Shipping'],
      subtitle: 'Storefront manager for scaling online businesses',
      features: ['Stripe Connector', 'Shipping Label generator', 'Refund Processing Desk'],
      screenshots: ['https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80'],
      author: 'Atlas Commerce Labs',
      author_verified: true,
      price_type: 'enterprise',
      price_amount: 99.0,
      clone_count: 1820,
      rating: 4.9,
      usage_velocity: 110,
      version: '2.4.0',
      ai_ready: true,
      backend_enabled: true,
      realtime_enabled: true,
      deployment_ready: true,
      permissions_required: ['ManageOrders', 'RefundPayments', 'ReadTaxLogs'],
      integrations: ['Stripe', 'FedEx', 'Quickbooks'],
      workflows: ['Order Paid -> Trigger Warehouse label generation'],
      entities: ['CartItem', 'CustomerOrder', 'Invoice', 'PaymentTransaction'],
      health_score: 97,
      status: 'published',
      visibility: true,
      schemaDefaults: {
        appName: 'E-Commerce Console',
        templateSlug: 'e-commerce-backend',
        components: [
          {
            id: 'catalog-table',
            name: 'StoreCatalog',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'product', type: 'text', label: 'Product', required: true, visible: true },
              { id: 'f2', name: 'price', type: 'number', label: 'Price', required: true, visible: true },
            ],
            props: { title: 'Product Catalog' }
          }
        ]
      }
    },
    {
      name: 'Task Manager',
      slug: 'task-manager',
      category: 'CRM',
      complexity: 'Simple',
      description: 'Organize team queues using interactive lists, custom tags, and task calendars.',
      components: ['TaskGrid', 'SubtaskChecklist', 'DeadlinesCalendar'],
      tags: ['Productivity', 'Tasking', 'Workflow'],
      subtitle: 'High-speed team task alignment tool',
      features: ['Inline Tasks Creator', 'Custom Tag Badges', 'Deadline Reminders'],
      screenshots: ['https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&w=800&q=80'],
      author: 'Atlas Productivity',
      author_verified: false,
      price_type: 'free',
      price_amount: 0,
      clone_count: 1540,
      rating: 4.7,
      usage_velocity: 78,
      version: '1.0.0',
      ai_ready: true,
      backend_enabled: true,
      realtime_enabled: true,
      deployment_ready: true,
      permissions_required: ['ManageTasks'],
      integrations: ['Slack', 'Trello'],
      workflows: ['Task Overdue -> Send DM Alert to Owner'],
      entities: ['TaskItem', 'ProjectCategory', 'Subtask'],
      health_score: 93,
      status: 'published',
      visibility: true,
      schemaDefaults: {
        appName: 'Task Manager',
        templateSlug: 'task-manager',
        components: [
          {
            id: 'task-grid',
            name: 'TaskGrid',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'task', type: 'text', label: 'Task Name', required: true, visible: true },
              { id: 'f2', name: 'completed', type: 'boolean', label: 'Done', required: false, visible: true },
            ],
            props: { title: 'Active Tasks' }
          }
        ]
      }
    },
    {
      name: 'Billing Portal',
      slug: 'billing-portal',
      category: 'Admin',
      complexity: 'Moderate',
      description: 'Track organization subscriptions, generate pro-forma invoices, and verify transaction streams.',
      components: ['SubscribersTable', 'PaymentHistoryLogs', 'PricingTierEditor'],
      tags: ['Finance', 'Invoices', 'SaaS'],
      subtitle: 'Manage recurring SaaS streams and payouts',
      features: ['Refund Handler Desk', 'Invoice PDF Renderer', 'Dunning Flow Logs'],
      screenshots: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'],
      author: 'Atlas Finance Desk',
      author_verified: true,
      price_type: 'pro',
      price_amount: 19.0,
      clone_count: 620,
      rating: 4.4,
      usage_velocity: 33,
      version: '1.2.0',
      ai_ready: false,
      backend_enabled: true,
      realtime_enabled: false,
      deployment_ready: true,
      permissions_required: ['ReadTransactions', 'ProcessRefunds'],
      integrations: ['Stripe', 'PayPal', 'Xero'],
      workflows: ['Subscription Canceled -> Start Winback Email Sequence'],
      entities: ['Subscription', 'BillingInvoice', 'SaaSProduct'],
      health_score: 91,
      status: 'published',
      visibility: true,
      schemaDefaults: {
        appName: 'Billing Portal',
        templateSlug: 'billing-portal',
        components: [
          {
            id: 'subscribers-table',
            name: 'SubscribersTable',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'user', type: 'text', label: 'User', required: true, visible: true },
              { id: 'f2', name: 'plan', type: 'select', label: 'Plan', required: true, visible: true },
            ],
            props: { title: 'Subscribers' }
          }
        ]
      }
    },
    {
      name: 'Event Planner',
      slug: 'event-planner',
      category: 'HR',
      complexity: 'Simple',
      description: 'Register attendees, compile event schedules, and audit speaker schedules.',
      components: ['EventScheduleTimeline', 'AttendeeList', 'SpeakerBioGrid'],
      tags: ['Events', 'Schedules', 'Coordination'],
      subtitle: 'Coordinate internal summits and external meetups',
      features: ['Attendee Registry Table', 'Drag-and-drop Schedule Editor', 'Email Invitations API'],
      screenshots: ['https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'],
      author: 'Atlas Engagement Labs',
      author_verified: false,
      price_type: 'free',
      price_amount: 0,
      clone_count: 310,
      rating: 4.0,
      usage_velocity: 15,
      version: '1.0.0',
      ai_ready: true,
      backend_enabled: true,
      realtime_enabled: false,
      deployment_ready: true,
      permissions_required: ['ManageEvents', 'InviteAttendees'],
      integrations: ['Zoom', 'Google Calendar'],
      workflows: ['Attendee Registered -> Send Zoom Link'],
      entities: ['SummitEvent', 'Registrant', 'SpeakerSlot'],
      health_score: 86,
      status: 'published',
      visibility: true,
      schemaDefaults: {
        appName: 'Event Planner',
        templateSlug: 'event-planner',
        components: [
          {
            id: 'attendee-list',
            name: 'AttendeeList',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'name', type: 'text', label: 'Name', required: true, visible: true },
              { id: 'f2', name: 'status', type: 'select', label: 'Attendance', required: true, visible: true },
            ],
            props: { title: 'Registered Guests' }
          }
        ]
      }
    },
    {
      name: 'Asset Manager',
      slug: 'asset-manager',
      category: 'Inventory',
      complexity: 'Moderate',
      description: 'Register enterprise IT equipment, track device leases, and oversee software license logs.',
      components: ['AssetInventoryTable', 'LeaseDetailsPanel', 'WarrantyTimerCard'],
      tags: ['Assets', 'Hardware', 'Licensing'],
      subtitle: 'Enterprise IT asset registry and leasing logs',
      features: ['Warranty Expiry Alerts', 'License Allocator Grid', 'FTS Search Index'],
      screenshots: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'],
      author: 'Atlas IT Operations',
      author_verified: true,
      price_type: 'pro',
      price_amount: 39.0,
      clone_count: 480,
      rating: 4.5,
      usage_velocity: 24,
      version: '1.1.1',
      ai_ready: false,
      backend_enabled: true,
      realtime_enabled: false,
      deployment_ready: true,
      permissions_required: ['ManageAssets', 'AllocateLicenses'],
      integrations: ['Microsoft Intune', 'Jamf'],
      workflows: ['Warranty Expired 30d -> Trigger Replacement PO'],
      entities: ['HardwareAsset', 'SoftwareLicense', 'AssetAssignment'],
      health_score: 92,
      status: 'published',
      visibility: true,
      schemaDefaults: {
        appName: 'Asset Manager',
        templateSlug: 'asset-manager',
        components: [
          {
            id: 'assets-table',
            name: 'AssetInventoryTable',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'device', type: 'text', label: 'Device', required: true, visible: true },
              { id: 'f2', name: 'serial', type: 'text', label: 'Serial Number', required: true, visible: true },
            ],
            props: { title: 'IT Assets Registry' }
          }
        ]
      }
    },
    {
      name: 'Sales Dashboard',
      slug: 'sales-dashboard',
      category: 'Analytics',
      complexity: 'Moderate',
      description: 'Visualize outbound sales logs, manager performance rankings, and monthly quotas.',
      components: ['LeaderboardGrid', 'QuotaProgressBar', 'OutboundLogsTable'],
      tags: ['Sales', 'Charts', 'Motivation'],
      subtitle: 'Outbound pipeline leaderboards and quotas dashboard',
      features: ['Rep Leaderboard', 'Realtime Call log aggregators', 'Target progress indicators'],
      screenshots: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80'],
      author: 'Atlas Incentives',
      author_verified: true,
      price_type: 'free',
      price_amount: 0,
      clone_count: 920,
      rating: 4.7,
      usage_velocity: 68,
      version: '2.1.0',
      ai_ready: true,
      backend_enabled: true,
      realtime_enabled: true,
      deployment_ready: true,
      permissions_required: ['ReadSalesMetrics', 'ManageSalesGoals'],
      integrations: ['Salesforce', 'Hubspot', 'Slack'],
      workflows: ['Monthly Quota Achieved -> Post Alert on Slack Sales'],
      entities: ['SalesRep', 'CallLog', 'QuotaGoal'],
      health_score: 96,
      status: 'published',
      visibility: true,
      schemaDefaults: {
        appName: 'Sales Dashboard',
        templateSlug: 'sales-dashboard',
        components: [
          {
            id: 'rep-leaderboard',
            name: 'LeaderboardGrid',
            type: 'layout',
            children: [],
            fields: [],
            props: { title: 'Representative Ranking' }
          }
        ]
      }
    },
    {
      name: 'Recruitment Portal',
      slug: 'recruitment-portal',
      category: 'HR',
      complexity: 'Moderate',
      description: 'Track candidate applications, schedule interview logs, and record reviewer scores.',
      components: ['CandidatesPipelineBoard', 'InterviewLogsTable', 'ScorecardForm'],
      tags: ['Hiring', 'ATS', 'Talent'],
      subtitle: 'Agile hiring pipeline and interviewer scorecard hub',
      features: ['ATS Kanban pipeline', 'Interviewer Scorecards', 'Background Checks dashboard'],
      screenshots: ['https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=800&q=80'],
      author: 'Atlas People Labs',
      author_verified: true,
      price_type: 'pro',
      price_amount: 29.0,
      clone_count: 780,
      rating: 4.6,
      usage_velocity: 55,
      version: '1.2.0',
      ai_ready: true,
      backend_enabled: true,
      realtime_enabled: false,
      deployment_ready: true,
      permissions_required: ['ManageApplications', 'ReadATSLogs'],
      integrations: ['Lever', 'Greenhouse', 'Slack'],
      workflows: ['Candidate Reached Offer -> Create Background Check Job'],
      entities: ['Candidate', 'JobPosting', 'InterviewScorecard', 'BackgroundCheck'],
      health_score: 94,
      status: 'published',
      visibility: true,
      schemaDefaults: {
        appName: 'Recruitment Portal',
        templateSlug: 'recruitment-portal',
        components: [
          {
            id: 'candidates-pipeline',
            name: 'CandidatesPipelineBoard',
            type: 'kanban',
            children: [],
            fields: [
              { id: 'f1', name: 'candidate', type: 'text', label: 'Candidate', required: true, visible: true },
              { id: 'f2', name: 'stage', type: 'select', label: 'Stage', required: true, visible: true },
            ],
            props: { title: 'Hiring Funnel' }
          }
        ]
      }
    }
  ];

  console.log('Inserting templates...');
  const seededTemplates: any[] = [];
  for (const t of templates) {
    const record = await prisma.template.upsert({
      where: { slug: t.slug },
      update: t as any,
      create: t as any,
    });
    seededTemplates.push(record);
    console.log(`✓ Seeded: ${t.name}`);
  }

  console.log('Seeding FeaturedCollection rows...');
  // Seed 3 FeaturedCollection rows referencing 'crm-workspace', 'analytics-dashboard', 'e-commerce-backend'
  const featuredSlugs = ['crm-workspace', 'analytics-dashboard', 'e-commerce-backend'];
  for (let i = 0; i < featuredSlugs.length; i++) {
    const slug = featuredSlugs[i];
    const match = seededTemplates.find(t => t.slug === slug);
    if (match) {
      await prisma.featuredCollection.create({
        data: {
          templateId: match.id,
          position: i + 1,
          metadata: { note: `Featured item at position ${i + 1}` },
          active: true,
        }
      });
      console.log(`✓ Seeded FeaturedCollection position ${i + 1} for ${slug}`);
    }
  }

  console.log('Seeding admin user...');
  const hash = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD ?? 'changeme_on_first_login', 
    12
  );

  await prisma.user.upsert({
    where: { email: 'admin@oneatlas.io' },
    update: {},
    create: {
      email: 'admin@oneatlas.io',
      name: 'Admin',
      role: 'admin',
      plan: 'enterprise',
      verified: true,
      passwordHash: hash,
    }
  });

  console.log('Seeding finished successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
