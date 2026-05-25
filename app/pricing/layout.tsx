import { ReactNode } from 'react';

export const metadata = {
  title: 'Pricing Plans — OneAtlas',
  description: 'Choose the best plan for your operational workflows. From free developer sandboxes to advanced enterprise isolation levels.',
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
