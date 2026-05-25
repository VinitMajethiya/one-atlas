import { ReactNode } from 'react';

export const metadata = {
  title: 'Developer Login — OneAtlas',
  description: 'Authenticate to access your sandboxes and workspace consoles.',
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
