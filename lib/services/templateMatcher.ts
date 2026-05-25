// Scores each template against the user's prompt using keyword matching.
// Returns the best match above a 0.3 confidence threshold.
// Returns null with a suggestion string if no template matches.

interface MatchResult {
  templateId: string | null;
  templateSlug: string | null;
  confidence: number;
  matchedKeywords: string[];
  suggestion: string | null;
}

interface TemplateMeta {
  id: string;
  slug: string;
  name: string;
  tags: string[];
  description: string;
  category: string;
}

const KEYWORD_MAP: Record<string, string[]> = {
  'crm-workspace':       ['crm', 'customer', 'contact', 'deal', 'sales', 'pipeline', 'lead'],
  'hr-dashboard':        ['hr', 'human resources', 'employee', 'hiring', 'onboarding', 'payroll', 'staff'],
  'admin-panel':         ['admin', 'panel', 'management', 'control', 'settings', 'users', 'roles'],
  'analytics-dashboard': ['analytics', 'chart', 'metrics', 'dashboard', 'revenue', 'kpi', 'report', 'data'],
  'inventory-system':    ['inventory', 'stock', 'warehouse', 'product', 'supply', 'sku', 'items'],
  'support-workspace':   ['support', 'ticket', 'helpdesk', 'customer service', 'issue', 'request'],
};

export function matchTemplate(prompt: string, templates: TemplateMeta[]): MatchResult {
  const lower = prompt.toLowerCase();
  let bestMatch: MatchResult = {
    templateId: null,
    templateSlug: null,
    confidence: 0,
    matchedKeywords: [],
    suggestion: null,
  };

  for (const template of templates) {
    const keywords = KEYWORD_MAP[template.slug] ?? template.tags;
    const matched = keywords.filter((kw) => lower.includes(kw));
    const confidence = matched.length / (keywords.length || 1);

    if (confidence > bestMatch.confidence) {
      bestMatch = {
        templateId: template.id,
        templateSlug: template.slug,
        confidence,
        matchedKeywords: matched,
        suggestion: null,
      };
    }
  }

  if (bestMatch.confidence < 0.3) {
    return {
      templateId: null,
      templateSlug: null,
      confidence: 0,
      matchedKeywords: [],
      suggestion:
        'Try describing what your app manages — e.g. "a dashboard to track sales deals" or "an HR tool for employee onboarding".',
    };
  }

  return bestMatch;
}
