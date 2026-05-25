import { ReactNode } from 'react';

export const metadata = {
  title: 'Activity Audit Trail — OneAtlas',
  description: 'Immutable log of template clones, updates, and deployments.',
};

export default function ActivityLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
