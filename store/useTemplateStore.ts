import { create } from 'zustand';
import { Template, TemplateCategory, Complexity } from '../types/template';
import { TEMPLATES } from '../data/templates';

interface TemplateState {
  templates: Template[];
  selectedCategory: TemplateCategory | null;
  selectedComplexity: Complexity | null;
  selectedTemplate: Template | null;
  isModalOpen: boolean;

  setSelectedCategory: (category: TemplateCategory | null) => void;
  setSelectedComplexity: (complexity: Complexity | null) => void;
  openTemplateDetails: (template: Template) => void;
  closeTemplateDetails: () => void;
}

export const useTemplateStore = create<TemplateState>((set) => ({
  templates: TEMPLATES,
  selectedCategory: null,
  selectedComplexity: null,
  selectedTemplate: null,
  isModalOpen: false,

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedComplexity: (complexity) => set({ selectedComplexity: complexity }),
  openTemplateDetails: (template) => set({ selectedTemplate: template, isModalOpen: true }),
  closeTemplateDetails: () => set({ selectedTemplate: null, isModalOpen: false }),
}));
