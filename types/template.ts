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
  color: string;          // tint class or color
  createdAt: string;      // ISO date string
}
