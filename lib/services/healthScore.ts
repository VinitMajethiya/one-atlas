import { Template } from '../../types/template';

/**
 * Computes a template's composite health score (0-100) based on 5 P0 sub-metrics:
 * 1. Template completeness (25%)
 * 2. Preview quality (20%)
 * 3. Usability (20%)
 * 4. Trust (20%)
 * 5. Composite score (15%) - average of above 4
 */
export function calculateHealthScore(template: Partial<Template>): number {
  // 1. Template completeness (25%)
  // Count how many metadata fields are fully populated
  const fieldsToCheck: (keyof Template)[] = [
    'subtitle', 'features', 'screenshots', 'author', 'priceType',
    'version', 'aiReady', 'backendEnabled', 'realtimeEnabled', 'deploymentReady',
    'permissionsRequired', 'integrations', 'workflows', 'entities', 'complexity',
    'category', 'description', 'longDescription', 'components', 'tags'
  ];

  let filledCount = 0;
  fieldsToCheck.forEach(field => {
    const val = template[field];
    if (val !== undefined && val !== null) {
      if (Array.isArray(val)) {
        if (val.length > 0) filledCount++;
      } else if (typeof val === 'string') {
        if (val.trim().length > 0) filledCount++;
      } else {
        filledCount++;
      }
    }
  });
  const completenessScore = (filledCount / fieldsToCheck.length) * 100;

  // 2. Preview quality (20%)
  const hasScreenshots = (template.screenshots && template.screenshots.length > 0) ? 100 : 0;
  const longDescLen = template.longDescription ? template.longDescription.length : 0;
  const descriptionScore = longDescLen > 100 ? 100 : (longDescLen / 100) * 100;
  const hasFeatures = (template.features && template.features.length > 0) ? 100 : 0;
  const previewScore = (hasScreenshots * 0.4) + (descriptionScore * 0.3) + (hasFeatures * 0.3);

  // 3. Usability (20%)
  let complexityScore = 50;
  if (template.complexity === 'Simple') complexityScore = 70;
  if (template.complexity === 'Moderate') complexityScore = 90;
  if (template.complexity === 'Advanced') complexityScore = 100;

  const componentsCount = template.components ? template.components.length : 0;
  const componentsScore = componentsCount >= 4 ? 100 : (componentsCount / 4) * 100;

  const tagsCount = template.tags ? template.tags.length : 0;
  const tagsScore = tagsCount >= 3 ? 100 : (tagsCount / 3) * 100;

  const usabilityScore = (complexityScore * 0.4) + (componentsScore * 0.3) + (tagsScore * 0.3);

  // 4. Trust (20%)
  const authorVerified = template.authorVerified ? 100 : 50;
  const cloneCount = template.cloneCount || 0;
  const clonesScore = cloneCount > 10 ? 100 : (cloneCount / 10) * 100;
  const rating = template.rating || 0;
  const ratingScore = rating >= 3.5 ? (rating / 5) * 100 : 50;
  const trustScore = (authorVerified * 0.4) + (clonesScore * 0.3) + (ratingScore * 0.3);

  // P1 sub-metrics
  const ai_ready = template.aiReady !== undefined ? template.aiReady : (template as any).ai_ready;
  const entities = template.entities !== undefined ? template.entities : (template as any).entities;
  const deployment_ready = template.deploymentReady !== undefined ? template.deploymentReady : (template as any).deployment_ready;
  const permissions_required = template.permissionsRequired !== undefined ? template.permissionsRequired : (template as any).permissions_required;

  const aiReadiness = ai_ready && entities && entities.length > 0 ? 100 : 50; // weight: 10%
  const deployability = deployment_ready ? 100 : 0; // weight: 10%  
  const enterpriseReadiness = (
    ((permissions_required?.includes('rbac') || permissions_required?.includes('RBAC')) ? 1 : 0) +
    ((permissions_required?.includes('sso') || permissions_required?.includes('SSO')) ? 1 : 0) +
    ((permissions_required?.includes('audit') || permissions_required?.includes('AUDIT')) ? 1 : 0)
  ) / 3 * 100; // weight: 5%

  const p1Score = (aiReadiness * 0.10) + (deployability * 0.10) + (enterpriseReadiness * 0.05);

  // 8. Composite average of all sub-metrics (10%)
  const averageSubmetrics = (completenessScore + previewScore + usabilityScore + trustScore + aiReadiness + deployability + enterpriseReadiness) / 7;

  // Weighted sum:
  // Completeness (20%) + Preview (15%) + Usability (15%) + Trust (15%) + p1Score (10% + 10% + 5%) + Average (10%)
  const rawScore = 
    (completenessScore * 0.20) + 
    (previewScore * 0.15) + 
    (usabilityScore * 0.15) + 
    (trustScore * 0.15) + 
    p1Score +
    (averageSubmetrics * 0.10);

  return Math.round(Math.min(100, Math.max(0, rawScore)));
}
