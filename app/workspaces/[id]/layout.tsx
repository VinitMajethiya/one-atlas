import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> | { id: string } | any }) {
  const resolvedParams = await params;
  return {
    title: `Workspace ${resolvedParams.id} — OneAtlas`,
    description: 'View your deployed workspace, build logs, and live app preview.',
  };
}

export default function WorkspaceDetailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
