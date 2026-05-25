import { create } from 'zustand';
import { AppSchema, ComponentNode } from '../types/builder';

interface BuilderState {
  schema: AppSchema | null;
  selectedNodeId: string | null;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  conversationHistory: { instruction: string; timestamp: string }[];
  activeTab: 'tree' | 'canvas' | 'props'; // Mobile navigation tab

  // Actions
  setSchema: (schema: AppSchema) => void;
  selectNode: (id: string | null) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  updateAppName: (name: string) => void;
  addConversationEntry: (instruction: string) => void;
  setActiveTab: (tab: 'tree' | 'canvas' | 'props') => void;
  updateComponentProps: (nodeId: string, props: Record<string, string | number | boolean>) => void;
  updateComponentFieldVisibility: (nodeId: string, fieldId: string, visible: boolean) => void;
  updateComponentFieldLabel: (nodeId: string, fieldId: string, label: string) => void;
}

// Recursive helper to update props on a matching node in the component tree
const updateNodePropsInTree = (
  nodes: ComponentNode[],
  targetId: string,
  newProps: Record<string, string | number | boolean>
): ComponentNode[] => {
  return nodes.map((node) => {
    if (node.id === targetId) {
      return {
        ...node,
        props: {
          ...node.props,
          ...newProps,
        },
      };
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: updateNodePropsInTree(node.children, targetId, newProps),
      };
    }
    return node;
  });
};

// Recursive helper to update field visibility on a matching node
const updateFieldVisibilityInTree = (
  nodes: ComponentNode[],
  targetNodeId: string,
  fieldId: string,
  visible: boolean
): ComponentNode[] => {
  return nodes.map((node) => {
    if (node.id === targetNodeId) {
      return {
        ...node,
        fields: node.fields.map((f) => (f.id === fieldId ? { ...f, visible } : f)),
      };
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: updateFieldVisibilityInTree(node.children, targetNodeId, fieldId, visible),
      };
    }
    return node;
  });
};

// Recursive helper to update field label on a matching node
const updateFieldLabelInTree = (
  nodes: ComponentNode[],
  targetNodeId: string,
  fieldId: string,
  label: string
): ComponentNode[] => {
  return nodes.map((node) => {
    if (node.id === targetNodeId) {
      return {
        ...node,
        fields: node.fields.map((f) => (f.id === fieldId ? { ...f, label } : f)),
      };
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: updateFieldLabelInTree(node.children, targetNodeId, fieldId, label),
      };
    }
    return node;
  });
};

export const useBuilderStore = create<BuilderState>((set) => ({
  schema: null,
  selectedNodeId: null,
  leftPanelOpen: true,
  rightPanelOpen: true,
  conversationHistory: [],
  activeTab: 'canvas',

  setSchema: (schema) => set({ schema }),
  selectNode: (id) => set({ selectedNodeId: id }),
  toggleLeftPanel: () => set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  updateAppName: (name) =>
    set((state) => ({
      schema: state.schema ? { ...state.schema, appName: name, updatedAt: new Date().toISOString() } : null,
    })),
  addConversationEntry: (instruction) =>
    set((state) => ({
      conversationHistory: [
        ...state.conversationHistory,
        { instruction, timestamp: new Date().toISOString() },
      ],
    })),
  setActiveTab: (tab) => set({ activeTab: tab }),

  updateComponentProps: (nodeId, props) =>
    set((state) => {
      if (!state.schema) return {};
      const updatedComponents = updateNodePropsInTree(state.schema.components, nodeId, props);
      return {
        schema: {
          ...state.schema,
          components: updatedComponents,
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  updateComponentFieldVisibility: (nodeId, fieldId, visible) =>
    set((state) => {
      if (!state.schema) return {};
      const updatedComponents = updateFieldVisibilityInTree(state.schema.components, nodeId, fieldId, visible);
      return {
        schema: {
          ...state.schema,
          components: updatedComponents,
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  updateComponentFieldLabel: (nodeId, fieldId, label) =>
    set((state) => {
      if (!state.schema) return {};
      const updatedComponents = updateFieldLabelInTree(state.schema.components, nodeId, fieldId, label);
      return {
        schema: {
          ...state.schema,
          components: updatedComponents,
          updatedAt: new Date().toISOString(),
        },
      };
    }),
}));
