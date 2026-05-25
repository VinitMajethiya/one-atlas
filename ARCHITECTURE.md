# OneAtlas — Architecture Document

> **Track:** Frontend Engineer (3-Day Trial)
> This document defines the system architecture, folder structure, data models, state design, and key engineering decisions for the OneAtlas frontend project.

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER / CLIENT                         │
│                                                                 │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Marketing  │  │  Templates   │  │   Builder Shell      │   │
│  │  Site       │  │  Experience  │  │   /builder/[appId]   │   │
│  │  (SSG)      │  │  (SSG+CSR)   │  │   (CSR, Zustand)     │   │
│  └────────────┘  └──────────────┘  └──────────────────────┘   │
│         │                │                    │                 │
│         └────────────────┴────────────────────┘                │
│                          │                                      │
│               Next.js 15 App Router                             │
│            (React Server Components default)                    │
└─────────────────────────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
      ┌───────▼───────┐       ┌─────────▼──────────┐
      │  Static Data   │       │   Mock API / Data   │
      │  /data/*.ts    │       │   (no real backend  │
      │  (templates,   │       │    in FE trial)     │
      │   blog, nav)   │       └────────────────────┘
      └───────────────┘
```

---

## 2. Next.js 15 App Router Strategy

### Rendering Modes per Route

| Route | Rendering | Reason |
|---|---|---|
| `/` (landing) | Static (SSG) | No dynamic data; max performance |
| `/templates` | Static + Client filters | Template list static; filter/URL state is client-side |
| `/enterprise` | Static | Pure content page |
| `/security` | Static | Pure content page |
| `/pricing` | Static | Content page with mock pricing data |
| `/docs` | Static | Mock markdown content |
| `/blog` | Static | Mock posts from data file |
| `/support` | Static | Mock content |
| `/builder/[appId]` | Client (CSR) | All interactive — state, panels, canvas |
| `/preview/[token]` | Client | Renders frozen schema, uses token param |

### `'use client'` Rule

Only add `'use client'` when the component uses:
- `useState` / `useEffect` / `useRef`
- Browser APIs (`window`, `document`)
- Event handlers that need client reactivity
- Zustand store access

Never add `'use client'` to layout wrappers, page shells, or purely presentational components.

---

## 3. Folder Structure

```
oneatlas/
├── app/                              # Next.js 15 App Router
│   ├── layout.tsx                    # Root layout: fonts, providers, Navbar, Footer
│   ├── page.tsx                      # Landing page (SSG)
│   │
│   ├── templates/
│   │   └── page.tsx                  # Templates listing page
│   │
│   ├── enterprise/
│   │   └── page.tsx
│   │
│   ├── security/
│   │   └── page.tsx
│   │
│   ├── pricing/
│   │   └── page.tsx
│   │
│   ├── docs/
│   │   └── page.tsx
│   │
│   ├── blog/
│   │   └── page.tsx
│   │
│   ├── support/
│   │   └── page.tsx
│   │
│   ├── builder/
│   │   └── [appId]/
│   │       └── page.tsx              # Builder shell (CSR)
│   │
│   └── preview/
│       └── [token]/
│           └── page.tsx              # Frozen preview renderer
│
├── components/
│   ├── nav/
│   │   ├── Navbar.tsx                # Root nav bar (glassmorphism)
│   │   ├── MegaMenu.tsx              # Product / Use Cases / Templates dropdowns
│   │   ├── NavDropdown.tsx           # Resources / Community dropdowns
│   │   └── MobileMenu.tsx            # Hamburger drawer for mobile
│   │
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── ModelsTicker.tsx          # Horizontal auto-scroll model strip
│   │   ├── TemplatesShowcase.tsx     # Horizontal scroll cards (data-driven)
│   │   ├── AtlasForRoles.tsx
│   │   ├── EnterpriseTeaser.tsx
│   │   ├── SecurityTeaser.tsx
│   │   ├── PricingPreview.tsx
│   │   └── FAQSection.tsx
│   │
│   ├── templates/
│   │   ├── TemplateGrid.tsx          # Responsive 3/2/1-col grid
│   │   ├── TemplateCard.tsx          # Single card: name, category, complexity, CTAs
│   │   ├── TemplateFilters.tsx       # Filter bar/sidebar; syncs to URL params
│   │   └── TemplateModal.tsx         # Detail modal / slide-over
│   │
│   ├── builder/
│   │   ├── BuilderLayout.tsx         # 3-panel grid container
│   │   ├── TopBar.tsx                # App name, schema version, share, deploy
│   │   ├── ComponentTree.tsx         # Left sidebar: tree from mock schema
│   │   ├── CanvasPanel.tsx           # Main canvas: renders template mock
│   │   ├── PropsPanel.tsx            # Right panel: editable fields
│   │   ├── BottomBar.tsx             # Status bar
│   │   └── ConversationalInput.tsx   # Fixed bottom chat strip
│   │
│   ├── shared/
│   │   ├── Footer.tsx
│   │   ├── SectionWrapper.tsx        # Max-width + padding wrapper
│   │   ├── Badge.tsx                 # Category / complexity badges
│   │   ├── PricingCard.tsx
│   │   └── CTABanner.tsx
│   │
│   └── ui/                           # shadcn/ui components (auto-generated)
│
├── data/
│   ├── templates.ts                  # Template[] array — single source of truth
│   ├── nav.ts                        # Nav structure config (links, dropdowns)
│   ├── blog.ts                       # Mock blog post array
│   ├── pricing.ts                    # Mock pricing tiers
│   └── builder.ts                    # Mock schema for builder canvas
│
├── store/
│   ├── useBuilderStore.ts            # Builder panel state, selected component
│   └── useTemplateStore.ts           # Active template, filter state
│
├── types/
│   ├── template.ts                   # Template, Complexity, Category
│   ├── builder.ts                    # Schema, ComponentNode, BuilderState
│   ├── nav.ts                        # NavItem, MegaMenuColumn
│   └── index.ts                      # Re-exports all types
│
├── lib/
│   └── utils.ts                      # cn() helper + misc utilities
│
├── styles/
│   └── globals.css                   # Tailwind directives + CSS variables
│
├── public/
│   └── (images, icons, og images)
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 4. Data Models (TypeScript)

### Template

```typescript
// types/template.ts

export type Complexity = 'Simple' | 'Moderate' | 'Advanced';
export type TemplateCategory =
  | 'CRM'
  | 'HR'
  | 'Admin'
  | 'Analytics'
  | 'Inventory'
  | 'Support';

export interface Template {
  id: string;
  slug: string;
  name: string;
  category: TemplateCategory;
  complexity: Complexity;
  description: string;
  longDescription: string;
  components: string[];
  tags: string[];
  icon: string;           // lucide-react icon name or emoji
  color: string;          // tint color for card bg
  createdAt: string;      // ISO date string
}
```

### Builder Schema (Mock)

```typescript
// types/builder.ts

export interface SchemaField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'select';
  label: string;
  required: boolean;
  visible: boolean;
}

export interface ComponentNode {
  id: string;
  name: string;
  type: 'layout' | 'table' | 'kanban' | 'chart' | 'form' | 'nav';
  children: ComponentNode[];
  fields: SchemaField[];
  props: Record<string, string | number | boolean>;
}

export interface AppSchema {
  appId: string;
  appName: string;
  version: number;
  templateId: string;
  templateName: string;
  components: ComponentNode[];
  createdAt: string;
  updatedAt: string;
}
```

### Nav Structure

```typescript
// types/nav.ts

export interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface NavMegaMenuColumn {
  heading: string;
  items: NavDropdownItem[];
}

export interface NavItem {
  label: string;
  href?: string;
  dropdown?: NavDropdownItem[];
  megaMenu?: NavMegaMenuColumn[];
}
```

---

## 5. State Management — Zustand

### useBuilderStore

```typescript
// store/useBuilderStore.ts
import { create } from 'zustand';
import type { AppSchema, ComponentNode } from '@/types/builder';

interface BuilderState {
  schema: AppSchema | null;
  selectedNodeId: string | null;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  conversationHistory: { instruction: string; timestamp: string }[];

  // Actions
  setSchema: (schema: AppSchema) => void;
  selectNode: (id: string | null) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  updateAppName: (name: string) => void;
  addConversationEntry: (instruction: string) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  schema: null,
  selectedNodeId: null,
  leftPanelOpen: true,
  rightPanelOpen: true,
  conversationHistory: [],

  setSchema: (schema) => set({ schema }),
  selectNode: (id) => set({ selectedNodeId: id }),
  toggleLeftPanel: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
  updateAppName: (name) =>
    set((s) => ({
      schema: s.schema ? { ...s.schema, appName: name } : null,
    })),
  addConversationEntry: (instruction) =>
    set((s) => ({
      conversationHistory: [
        ...s.conversationHistory,
        { instruction, timestamp: new Date().toISOString() },
      ],
    })),
}));
```

### useTemplateStore

```typescript
// store/useTemplateStore.ts
import { create } from 'zustand';
import type { Template, Complexity, TemplateCategory } from '@/types/template';

interface TemplateState {
  templates: Template[];
  selectedCategory: TemplateCategory | null;
  selectedComplexity: Complexity | null;
  selectedTemplate: Template | null;

  setSelectedCategory: (c: TemplateCategory | null) => void;
  setSelectedComplexity: (c: Complexity | null) => void;
  openTemplate: (t: Template) => void;
  closeTemplate: () => void;
}
```

---

## 6. URL State Sync — Templates Page

Template filters sync to URL params so filtered views are shareable.

```typescript
// Pattern: use useSearchParams + useRouter from next/navigation

// Reading filters
const searchParams = useSearchParams();
const category = searchParams.get('category') as TemplateCategory | null;
const complexity = searchParams.get('complexity') as Complexity | null;

// Writing filters
const router = useRouter();
const pathname = usePathname();

function setFilter(key: string, value: string | null) {
  const params = new URLSearchParams(searchParams.toString());
  if (value) params.set(key, value);
  else params.delete(key);
  router.push(`${pathname}?${params.toString()}`);
}
```

This means `/templates?category=crm&complexity=moderate` always renders the correct filtered state on load.

---

## 7. Component Patterns

### SectionWrapper

Every landing page section uses a shared `SectionWrapper` to maintain consistent spacing and max-width:

```tsx
// components/shared/SectionWrapper.tsx
interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className, id }: SectionWrapperProps) {
  return (
    <section id={id} className={`w-full py-20 md:py-28 ${className ?? ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
```

### Badge

```tsx
// components/shared/Badge.tsx
type BadgeVariant = 'category' | 'complexity' | 'tag';

export function Badge({ label, variant }: { label: string; variant: BadgeVariant }) {
  const colorMap: Record<string, string> = {
    Simple: 'bg-teal-50 text-teal-700',
    Moderate: 'bg-yellow-50 text-yellow-700',
    Advanced: 'bg-red-50 text-red-600',
    CRM: 'bg-indigo-50 text-indigo-700',
    // ...
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorMap[label] ?? 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  );
}
```

---

## 8. Builder Panel Layout — CSS Grid

```tsx
// components/builder/BuilderLayout.tsx

<div className="h-screen flex flex-col overflow-hidden">
  {/* Top Bar */}
  <TopBar />

  {/* Three-panel body */}
  <div className="flex flex-1 overflow-hidden">
    {leftPanelOpen && (
      <aside className="w-64 border-r overflow-y-auto flex-shrink-0">
        <ComponentTree />
      </aside>
    )}

    <main className="flex-1 overflow-hidden flex flex-col">
      <CanvasPanel />
      <ConversationalInput />
    </main>

    {rightPanelOpen && (
      <aside className="w-72 border-l overflow-y-auto flex-shrink-0">
        <PropsPanel />
      </aside>
    )}
  </div>

  {/* Bottom Bar */}
  <BottomBar />
</div>
```

---

## 9. Key Architecture Decisions

### Decision 1: Static Data in `/data` Files

All template data, blog posts, nav structure, and pricing tiers live in TypeScript config files under `/data`. They are never hardcoded inline in JSX.

**Why:** Separation of concerns. Data changes don't require touching component files. Enables future migration to a real API with no JSX changes — just swap the import source.

### Decision 2: Zustand over Context for Builder State

Builder state (selected node, panel open/closed, schema, conversation history) uses Zustand instead of React Context.

**Why:** Builder has frequent state updates across deeply nested components. Context rerenders the entire tree on every update. Zustand uses fine-grained subscriptions — only components that read the specific slice rerender. Named slices also make the store self-documenting.

### Decision 3: URL Sync for Template Filters

Template filter state syncs to URL query params rather than living only in React state.

**Why:** Users can share filtered views (e.g. "here are all Advanced CRM templates"). Refreshing the page preserves filter state. Enables back/forward navigation through filter states.

### Decision 4: Server Components by Default

All page and layout files are React Server Components unless they explicitly need client-side interactivity.

**Why:** Better performance, smaller JS bundle, faster initial paint. Only components that need `useState`/`useEffect`/event handlers are marked `'use client'`.

### Decision 5: Mock Schema for Builder Canvas

The builder canvas renders a meaningful mock layout from a static schema object in `/data/builder.ts` rather than a blank placeholder.

**Why:** The trial evaluates whether the builder shell communicates the product concept. A blank box communicates nothing. A rendered CRM table with sample data communicates exactly what the product will do.

---

## 10. Tech Stack Summary

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js | 15 (App Router) |
| Language | TypeScript | 5.x |
| Styling | TailwindCSS | 3.x |
| Components | shadcn/ui | latest |
| State | Zustand | 4.x |
| Icons | lucide-react | latest |
| Fonts | next/font/google (Inter) | — |
| Deployment | Vercel | — |

---

## 11. Deployment

### Vercel (Recommended)

```bash
# One-time setup
npm i -g vercel
vercel

# Set env vars in Vercel dashboard or:
vercel env add NEXT_PUBLIC_APP_URL
```

Output: `https://oneatlas-[hash].vercel.app`

### Cloudflare Pages (Alternative)

```bash
# Build for Cloudflare
npm run build
# Deploy /out or configure Pages for Next.js
```

---

## 12. Local Setup

```bash
# 1. Clone
git clone https://github.com/your-username/oneatlas.git && cd oneatlas

# 2. Install
npm install

# 3. Configure env
cp .env.example .env.local
# Set NEXT_PUBLIC_APP_URL=http://localhost:3000

# 4. Run
npm run dev

# 5. Open
open http://localhost:3000
```

---

## 13. What Would Come Next (Post-Trial)

If this were production development, the next engineering priorities would be:

1. **Real backend integration** — Connect to the OneAtlas runtime API (POST /apps, GET /templates) replacing mock data
2. **Auth layer** — Clerk integration for `/builder` route protection
3. **Real conversational editing** — Connect the input strip to POST /api/apps/:id/edit
4. **Preview snapshot system** — POST /api/apps/:id/preview → shareable frozen URL
5. **Schema diff visualization** — Show what changed between versions
6. **Dark mode** — Tailwind `dark:` variants + `next-themes`
7. **Command palette** — `cmdk` for power-user navigation
