export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  readTime: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Why Schema-First Architectures Win in Internal Tools',
    slug: 'schema-first-architectures-internal-tools',
    date: '2026-05-15T09:00:00Z',
    author: 'Elena Rostova (Lead Architect)',
    category: 'Engineering',
    excerpt: 'Writing code for internal dashboards is a waste of developer hours. See how generating state schemas creates highly maintainable tools.',
    readTime: '6 min read',
    content: 'Internal tools often require the same boilerplate: tables, forms, charts, and routing. When you hardcode these, you create technical debt. By representing interfaces as abstract schemas (JSON/YAML), you make mutations safe, version control simple, and updates fast.',
  },
  {
    id: 'post-2',
    title: 'Design Philosophy: Building Clean Interfaces for Data Density',
    slug: 'clean-interfaces-for-data-density',
    date: '2026-05-02T11:30:00Z',
    author: 'Marcus Vance (Product Designer)',
    category: 'Design',
    excerpt: 'SaaS interfaces require clarity, but internal operations demand data density. Learn how we balance grids, spacing, and micro-interactions.',
    readTime: '4 min read',
    content: 'Ops agents need to digest hundreds of records in seconds. A clean spacing hierarchy based on an 8px grid, combined with subtle shadows and border highlights, allows developers to achieve readability without reducing the volume of information on screen.',
  },
  {
    id: 'post-3',
    title: 'How AI Prompts Turn into Functional Database Schemas',
    slug: 'ai-prompts-to-database-schemas',
    date: '2026-04-18T14:00:00Z',
    author: 'Devon Patel (AI Engineer)',
    category: 'AI Native',
    excerpt: 'Discover the translation layers that turn natural language statements into rigid database schemas and clean, functional frontend panels.',
    readTime: '8 min read',
    content: 'When you ask OneAtlas to "add a priority column", our underlying engine does not write JavaScript. It validates the target schema node, appends the property to the relational tree, and pushes the updated schema to the rendering canvas. This guarantees code safety.',
  },
];
