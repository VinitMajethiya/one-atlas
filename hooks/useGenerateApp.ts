import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useGenerateApp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(prompt: string) {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error?.message || 'Could not match a template. Try rephrasing.');
        return;
      }

      // Navigate to builder — GeneratingOverlay handles the loading transition
      router.push(`/builder/${json.data.appId}?template=${json.data.templateUsed}`);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return { generate, loading, error };
}
