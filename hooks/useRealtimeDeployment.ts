import { useState, useEffect } from 'react';

const POLL_INTERVAL = 2000; // exactly 2s — do not change
const STOP_STATES = ['success', 'error'] as const;

export function useRealtimeDeployment(deploymentId: string | null) {
  const [status, setStatus] = useState<string>('queued');
  const [buildLog, setBuildLog] = useState<string[]>([]);

  useEffect(() => {
    if (!deploymentId) return;

    setStatus('queued');
    setBuildLog([]);

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/deployments/${deploymentId}`);
        const data = await res.json();
        setBuildLog(data.build_log ?? []);
        setStatus(data.status);
        if (STOP_STATES.includes(data.status)) {
          clearInterval(interval);
        }
      } catch (error) {
        setStatus('error');
        clearInterval(interval);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [deploymentId]);

  return { status, buildLog };
}

export default useRealtimeDeployment;
