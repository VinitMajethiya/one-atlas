import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSchema } from '../types/builder';

interface PreviewSnapshot {
  token: string;
  schema: AppSchema;
  createdAt: string;
}

interface PreviewState {
  snapshots: Record<string, PreviewSnapshot>;
  saveSnapshot: (token: string, schema: AppSchema) => void;
}

export const usePreviewStore = create<PreviewState>()(
  persist(
    (set) => ({
      snapshots: {},
      saveSnapshot: (token, schema) =>
        set((state) => ({
          snapshots: {
            ...state.snapshots,
            [token]: {
              token,
              schema,
              createdAt: new Date().toISOString(),
            },
          },
        })),
    }),
    {
      name: 'oneatlas-preview-snapshots',
    }
  )
);
