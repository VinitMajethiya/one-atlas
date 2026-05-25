import { ReactNode } from 'react';

export const metadata = {
  title: 'Enterprise Portal — OneAtlas',
  description: 'Admin console for compliance rules, cluster configurations, and SSO settings.',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
