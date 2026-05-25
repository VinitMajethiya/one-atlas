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
  
  // v4/v5 metadata extensions
  subtitle?: string | null;
  features: string[];
  screenshots: string[];
  author: string;
  authorVerified: boolean;
  priceType: string;      // free | pro | enterprise
  priceAmount: number;
  cloneCount: number;
  rating: number;
  usageVelocity: number;
  version: string;
  aiReady: boolean;
  backendEnabled: boolean;
  realtimeEnabled: boolean;
  deploymentReady: boolean;
  permissionsRequired: string[];
  integrations: string[];
  workflows: string[];
  entities: string[];
  healthScore: number;
  status: 'draft' | 'validating' | 'published';
  visibility: boolean;
}

