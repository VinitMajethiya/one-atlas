# OneAtlas — Frontend Engineering Trial Project

> **Track: Frontend Engineer**
> Build the complete OneAtlas public-facing product experience.
> **Stack:** Next.js 15 · TypeScript · TailwindCSS · shadcn/ui · Zustand

---

## 1. Project Overview

OneAtlas is an AI-native platform for generating and deploying internal tools, operational dashboards, and workflow-based business applications. It is **not** a website builder or landing-page tool — it generates real operational apps (CRMs, HR dashboards, admin panels) from prompts and templates.

Your task is to build the **complete OneAtlas frontend** — the public-facing marketing site, the templates experience, and the builder interface shell — as if this were a real production launch.

**Core philosophy to express in every UI decision:**
- Apps remain editable after generation
- Reusable templates drive consistency
- Runtime schemas are the source of truth
- Mutations are targeted, not full rewrites

---

## 2. Design System

### 2.1 Brand Colors

```css
/* Primary */
--color-primary:        #635BFF;
--color-primary-light:  #7A73FF;
--color-dark-navy:      #0A2540;
--color-dark-surface:   #1A1F36;

/* Accent */
--color-accent-pink:    #FF5996;
--color-accent-orange:  #FFB17A;
--color-accent-teal:    #00D4B1;
--color-accent-cyan:    #00D4FF;
--color-accent-yellow:  #F8BC42;
--color-accent-lavender:#E8E7FF;
--color-accent-green:   #00A37A;
--color-accent-blue:    #00B8E6;

/* Text */
--color-heading:        #0A2540;
--color-body:           #425466;
--color-muted:          #697386;

/* Backgrounds */
--bg-default:           #FAFBFF;
--bg-subtle:            #F6F9FC;
--bg-muted:             #EFF3F8;
--bg-white:             #FFFFFF;

/* Borders */
--border-default:       #E3E8EE;
--border-subtle:        #EDF1F6;

/* Soft Tints */
--tint-teal:            #E0FBF4;
--tint-orange:          #FFE9DC;
--tint-pink:            #FFE3EE;
--tint-yellow:          #FFF4DE;

/* Gradient */
--gradient-hero: linear-gradient(135deg, #635BFF, #9B6CFB, #FF5996, #FF9173);

/* Navbar */
--nav-bg: rgba(255, 255, 255, 0.85);
--nav-blur: blur(12px);
```

### 2.2 Typography

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

- Use `Inter` from Google Fonts or `next/font/google`
- Heading weight: 700–800
- Body weight: 400–500
- Muted / label weight: 400

### 2.3 UI Philosophy

- Clean spacing hierarchy (8px grid)
- Glassmorphism navbar (`backdrop-blur` + semi-transparent bg)
- Modular cards with soft shadows (`shadow-sm` to `shadow-md`)
- Subtle hover interactions (scale, shadow lift, border color shift)
- No over-animation, no excessive gradients
- Feels like: Base44, Lovable, Replit, v0, Floot

---

## 3. Navigation — Mega Menu

Modeled after [cal.com](https://cal.com) and [supabase.com](https://supabase.com).

### Top Bar Order

```
[Logo] → Product → Use Cases → Templates → Enterprise → Security → Pricing → Resources → Community → Login → [Start Building]
```

### Navbar Behavior

- Background: `rgba(255,255,255,0.85)` + `backdrop-filter: blur(12px)`
- Sticky on scroll with subtle border-bottom
- Fully responsive — hamburger menu on mobile
- Keyboard accessible (focus trap in mega dropdown, `Escape` to close)

### Dropdowns

| Nav Item | Type | Notes |
|---|---|---|
| Product | Mega menu | Features, sub-products |
| Use Cases | Mega menu | By role / industry |
| Templates | 3-col mega menu | Like [supabase.com](https://supabase.com); content seeded from config |
| Enterprise | No dropdown | Links to `/enterprise` page |
| Security | No dropdown | Links to `/security` page |
| Pricing | No dropdown | Links to `/pricing` page |
| Resources | Dropdown | Docs · Help Center · Blog · Updates · YouTube |
| Community | Dropdown | Discord · LinkedIn · Twitter · Reddit · GitHub · Instagram |
| Login | Button | Links to `/login` |
| Start Building | CTA Button | Primary brand color, rounded |

### Templates Mega Menu — Columns

Column 1 — **By Category:** CRM · HR · Admin · Analytics · Inventory · Support  
Column 2 — **Featured Templates:** Cards with icon, name, complexity badge  
Column 3 — **Explore:** "View all templates →" + recently added

---

## 4. Pages to Build

### 4.1 Landing Page (`/`)

Sections in order:

1. **Hero** — Bold headline, sub-headline describing what OneAtlas does, primary CTA "Start Building", secondary CTA "Browse Templates". Background: gradient mesh or subtle animated grid. Reference: [replit.com](https://replit.com), [lovable.dev/home](https://lovable.dev/home)

2. **How OneAtlas Works** — 3-step visual flow: "Describe your app" → "Schema is generated" → "Deploy instantly". Reference: [lovable.dev/home](https://lovable.dev/home), [base44.com](https://base44.com)

3. **Build With Latest Models** — Horizontal auto-scrolling ticker/strip showing model logos or name chips: GPT-4o · Claude 3.5 · Gemini 1.5 · DeepSeek · Mistral · Llama 3. Infinite scroll loop.

4. **Templates Showcase** — Horizontally scrollable row of template cards. Data driven from `/data/templates.ts` config file. Each card: name, category tag, complexity badge, short description, CTA buttons ("Use Template" / "Preview").

5. **Atlas for Roles** — Grid of role cards (Developer, Product Manager, Operations, HR, Sales, Finance). Each card shows what they can build. Reference: [bolt.new](https://bolt.new)

6. **Enterprise Section** — Why teams choose OneAtlas at scale. Logos of hypothetical enterprise customers. Reference: [lovable.dev/enterprise-landing](https://lovable.dev/enterprise-landing)

7. **Security Section** — SOC 2 / GDPR / data isolation callouts. Reference: [lovable.dev/security](https://lovable.dev/security)

8. **Pricing Preview** — Brief 3-tier preview card row (Free / Pro / Enterprise). Links to full `/pricing` page.

9. **FAQs** — Accordion component, min 6 questions.

10. **Footer** — Logo, nav links grouped by column (Product / Resources / Company / Legal), social icons, copyright line.

---

### 4.2 Templates Page (`/templates`)

The templates page is **not a marketing gallery** — it is a real workflow entry point. It should feel operational, deployable, and AI-native.

**Layout:**
- Filter sidebar (left) or filter bar (top)
- Responsive grid: 3-col desktop / 2-col tablet / 1-col mobile

**Filter dimensions:**
- Category: CRM · HR · Admin · Analytics · Inventory · Support
- Complexity: Simple · Moderate · Advanced
- Filter state syncs to URL query params (e.g. `?category=crm&complexity=moderate`) for shareable filtered views

**Template Card:** name, category tag, complexity badge, short description, "Use Template" CTA, "Preview" CTA.

**Modal / Detail View:** Clicking a card opens a slide-over or modal with full description, list of included components, schema preview (mocked), and CTA.

**Template Data:** All template data must come from `/data/templates.ts` — never hardcoded in JSX.

**Example templates to seed:**

| Name | Category | Complexity |
|---|---|---|
| CRM Workspace | CRM | Moderate |
| HR Dashboard | HR | Simple |
| Admin Panel | Admin | Simple |
| Analytics Dashboard | Analytics | Advanced |
| Inventory System | Inventory | Moderate |
| Support Workspace | Support | Moderate |

Reference: [v0.app/templates](https://v0.app/templates), [lovable.dev/templates](https://lovable.dev/templates), [floot.com/en/showcase](https://floot.com/en/showcase), [base44.com/templates](https://base44.com/templates)

---

### 4.3 Enterprise Page (`/enterprise`)

Key sections:
- Hero: "OneAtlas for Teams" — bold claim + CTA ("Talk to Sales")
- Feature highlights: RBAC, SSO, Audit logs, Deployment isolation
- Testimonial / logo row (mocked)
- Security callout
- CTA banner

Reference: [lovable.dev/enterprise-landing](https://lovable.dev/enterprise-landing), [replit.com/enterprise](https://replit.com/enterprise), [cursor.com/enterprise](https://cursor.com/enterprise)

---

### 4.4 Security Page (`/security`)

Key sections:
- Hero: "Security at every layer"
- Compliance badges: SOC 2 Type II · GDPR · CCPA (mocked)
- Security pillars: Data Encryption · Tenant Isolation · Access Controls · Audit Logs
- FAQ (security-specific)

Reference: [lovable.dev/security](https://lovable.dev/security), [base44.com/security](https://base44.com/security)

---

### 4.5 Pricing Page (`/pricing`)

Key sections:
- Hero: headline + billing toggle (Monthly / Annual)
- 3-tier pricing cards: Free · Pro · Enterprise
- Feature comparison table
- FAQ (pricing-specific)
- CTA banner

Tiers (mock data):

| Tier | Price | Key limits |
|---|---|---|
| Free | $0/mo | 3 apps, community templates |
| Pro | $29/mo | Unlimited apps, all templates, custom domains |
| Enterprise | Custom | SSO, RBAC, SLA, audit logs |

Reference: [lovable.dev/pricing](https://lovable.dev/pricing), [replit.com/pricing](https://replit.com/pricing), [hercules.app/pricing](https://hercules.app/pricing)

---

### 4.6 Docs Page (`/docs`)

- Split layout: sidebar navigation (left) + content area (right)
- Sidebar sections: Getting Started · Concepts · Templates · API Reference · Deployment
- Content: prose with code blocks. Static markdown-rendered content (mocked).

---

### 4.7 Blog Page (`/blog`)

- Card grid of blog post previews (mocked data from `/data/blog.ts`)
- Each card: title, date, author, category tag, excerpt, "Read more" link
- Tags/category filter

---

### 4.8 Support Page (`/support`)

- Search bar (UI only)
- Category cards: Getting Started · Billing · Apps · Integrations · Security
- Recent articles list (mocked)
- "Contact us" CTA at bottom

---

## 5. Builder Interface Shell (`/builder/[appId]`)

When a user generates an app or picks a template, they land in the builder. This is the **UI shell** — not a code editor. It renders a meaningful mock layout based on the selected template schema.

### 5.1 Layout — Three-Panel

```
┌──────────────────────────────────────────────────────────┐
│  TOP BAR: [AppName (editable)] [Schema v2] [Share] [Deploy] │
├────────────┬─────────────────────────────┬───────────────┤
│            │                             │               │
│  LEFT      │     MAIN CANVAS             │  RIGHT        │
│  SIDEBAR   │   (template preview)        │  PANEL        │
│  (tree)    │                             │  (props)      │
│            │                             │               │
├────────────┴─────────────────────────────┴───────────────┤
│  BOTTOM: last modified · schema version · ● Connected     │
│  [Conversational input strip: "Edit this app..."] [Send]  │
└──────────────────────────────────────────────────────────┘
```

### 5.2 Top Bar

- App name: inline editable (`contentEditable` or input that looks like text)
- Schema version indicator: `v2` chip
- Share button: copies mock URL to clipboard
- Deploy button: primary CTA, opens mock deploy dialog
- All panels have independent collapse toggles (chevron icon)

### 5.3 Left Sidebar — Component Tree

Sourced from a mock schema object (e.g. `BUILDER_MOCK_SCHEMA` in `/data/builder.ts`).

Example tree for CRM template:
```
▼ CRM Workspace
  ▼ Header
      AppTitle
      UserAvatar
  ▼ Sidebar
      NavItem: Contacts
      NavItem: Deals
      NavItem: Activities
  ▼ MainContent
    ▼ ContactsTable
        Column: Name
        Column: Email
        Column: Status
    ▼ DealsKanban
        Stage: Lead
        Stage: Qualified
        Stage: Closed
```

Clicking a node in the tree highlights it on the canvas and loads its editable fields in the right panel.

### 5.4 Main Canvas

Renders a meaningful mock layout based on the selected template. Must NOT be a blank rectangle with placeholder text.

For CRM: render a mock data table with sample rows, a Kanban column, or a stat bar — using TailwindCSS, no actual data fetching needed.

For Analytics: render mock charts using static SVGs or a lightweight chart lib.

### 5.5 Right Panel — Props Editor

When a component is selected in the tree or canvas:
- Shows editable fields: label, type, visibility toggle
- Fields sourced from the mock schema
- Changes update the mock state via Zustand (no persistence needed)

### 5.6 Bottom Bar

```
Last modified: 2 min ago  ·  Schema: v2  ·  ● Connected
```

### 5.7 Conversational Input Strip

Fixed at the bottom of the canvas area.
```
[ Edit this app... e.g. "Add a priority column to tasks"   ] [Send →]
```
Mock only — no real AI. On submit, show a mock "Processing..." state then reset. Optionally append to a mock history list.

### 5.8 State Management

Use **Zustand** with clearly named slices:
- `useBuilderStore` — selected component, panel open/collapsed state, app name, schema version
- `useTemplateStore` — active template, components tree

---

## 6. Component Architecture

All components must be reusable. No copy-pasted JSX. No 500-line monolith files.

### Required Directory Structure

```
/
├── app/                          # Next.js 15 App Router
│   ├── (marketing)/
│   │   ├── page.tsx              # Landing page
│   │   ├── templates/page.tsx
│   │   ├── enterprise/page.tsx
│   │   ├── security/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── docs/page.tsx
│   │   ├── blog/page.tsx
│   │   └── support/page.tsx
│   ├── builder/
│   │   └── [appId]/page.tsx
│   ├── preview/
│   │   └── [token]/page.tsx
│   └── layout.tsx
│
├── components/
│   ├── nav/
│   │   ├── Navbar.tsx
│   │   ├── MegaMenu.tsx
│   │   ├── MobileMenu.tsx
│   │   └── NavDropdown.tsx
│   ├── ui/                       # shadcn/ui + custom primitives
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── ModelsTicker.tsx
│   │   ├── TemplatesShowcase.tsx
│   │   ├── AtlasForRoles.tsx
│   │   ├── PricingPreview.tsx
│   │   └── FAQSection.tsx
│   ├── templates/
│   │   ├── TemplateGrid.tsx
│   │   ├── TemplateCard.tsx
│   │   ├── TemplateFilters.tsx
│   │   └── TemplateModal.tsx
│   ├── builder/
│   │   ├── BuilderLayout.tsx
│   │   ├── TopBar.tsx
│   │   ├── ComponentTree.tsx
│   │   ├── CanvasPanel.tsx
│   │   ├── PropsPanel.tsx
│   │   ├── BottomBar.tsx
│   │   └── ConversationalInput.tsx
│   └── shared/
│       ├── Footer.tsx
│       ├── PricingCard.tsx
│       └── SectionWrapper.tsx
│
├── data/
│   ├── templates.ts              # All template data (NEVER in JSX)
│   ├── blog.ts
│   ├── builder.ts                # Mock schema for builder
│   └── nav.ts                    # Nav structure config
│
├── store/
│   ├── useBuilderStore.ts
│   └── useTemplateStore.ts
│
├── types/
│   ├── template.ts
│   ├── builder.ts
│   └── nav.ts
│
└── lib/
    └── utils.ts
```

---

## 7. TypeScript Rules

- **No `any`** anywhere in the codebase
- All component props typed with explicit interfaces
- Shared types live in `/types` — import from there, never redefine inline
- Use `as const` for config/data objects
- Zustand stores fully typed with generic type parameter

Example:

```typescript
// types/template.ts
export type Complexity = 'Simple' | 'Moderate' | 'Advanced';

export interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
  complexity: Complexity;
  description: string;
  components: string[];
  icon: string;
}
```

---

## 8. Responsiveness Requirements

Must be genuinely usable (not just "not broken") at:

| Breakpoint | Width |
|---|---|
| Mobile | 375px |
| Tablet | 768px |
| Desktop | 1280px |

- Mobile nav: hamburger menu with full-screen drawer
- Templates grid: 1-col at 375px, 2-col at 768px, 3-col at 1280px
- Builder: at mobile, stack panels vertically or collapse to tabs
- Hero text: responsive font sizes (`text-4xl md:text-6xl lg:text-7xl`)

---

## 9. Technical Constraints

| Constraint | Requirement |
|---|---|
| Framework | Next.js 15 with App Router — required |
| Language | TypeScript throughout — required |
| Styling | TailwindCSS — required |
| Component lib | shadcn/ui — allowed |
| State | Zustand — required for builder state |
| `'use client'` | Only where genuinely needed (interactivity/hooks) |
| Template data | Config file only — never hardcoded in JSX |
| Builder canvas | Must render a meaningful mock layout, not a blank box |
| Components | No copy-pasted JSX, no 500-line files |
| Deployment | Vercel or Cloudflare Pages |

---

## 10. Deliverables Checklist

- [ ] GitHub repository with clean, incremental commit history (≥ 5 commits)
- [ ] All 8 pages built and responsive
- [ ] Mega navigation with keyboard accessibility and mobile menu
- [ ] Templates page with filter logic, URL sync, and modal detail view
- [ ] Builder interface shell with 3-panel layout (tree · canvas · props)
- [ ] Builder state managed via Zustand with named slices
- [ ] All template data sourced from `/data/templates.ts`
- [ ] TypeScript: no `any`, all props typed, shared `/types` folder
- [ ] Live deployment on Vercel or Cloudflare Pages
- [ ] README: local setup in ≤ 5 commands, env vars listed, one architectural decision explained

---

## 11. Bonus Tasks (Optional)

- Dark mode support (Tailwind `dark:` variants + `next-themes`)
- Interactive builder preview with mock prompt-to-edit flow
- Template filtering with "Collections" grouping
- Command palette (`Cmd+K`) using `cmdk`

---

## 12. Evaluation Rubric

| Area | What is evaluated |
|---|---|
| **Product taste** | Spacing, typography, hover states — feels like a real product, not a starter kit |
| **Architecture** | Reusable components, shared layout primitives, no JSX duplication |
| **Responsiveness** | Actually usable at 375px, not just collapsed |
| **Navigation UX** | Mega nav with real dropdowns, keyboard accessible, mobile menu works |
| **Templates UX** | Filters work, URL sync works, cards communicate value |
| **Builder shell** | Panel layout stable, state sensible, canvas renders something meaningful |
| **TypeScript** | No `any`, props typed at component level, types in `/types` |
| **Execution quality** | README works in under 5 min, commits are incremental and readable |

---

## 13. Red Flags (Avoid)

- Generic SaaS clone or copy-pasted template UI
- Every component has `'use client'` for no reason
- No mobile layout consideration
- Template data hardcoded inside JSX
- Builder canvas is a blank rectangle with placeholder text
- Single massive component file with 500+ lines
- README missing or incomplete
- Single giant commit at the deadline
