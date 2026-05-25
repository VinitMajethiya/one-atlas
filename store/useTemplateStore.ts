import { create } from 'zustand';
import { Template, TemplateCategory, Complexity } from '../types/template';
import { TEMPLATES } from '../data/templates';

interface TemplateState {
  templates: Template[];
  selectedCategory: TemplateCategory | null;
  selectedComplexity: Complexity | null;
  selectedTemplate: Template | null;
  isModalOpen: boolean;
  
  // Extensions
  compareList: string[];
  savedTemplates: string[];
  sortBy: string;
  searchQuery: string;
  autocompleteResults: any[];
  infiniteScrollPage: number;
  trendingTemplates: Template[];
  featuredTemplates: Template[];

  setSelectedCategory: (category: TemplateCategory | null) => void;
  setSelectedComplexity: (complexity: Complexity | null) => void;
  openTemplateDetails: (template: Template) => void;
  closeTemplateDetails: () => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  toggleSave: (id: string) => void;
  setSortBy: (sortBy: string) => void;
  setSearchQuery: (query: string) => void;
  setAutocompleteResults: (results: any[]) => void;
  setInfiniteScrollPage: (page: number) => void;
  setTrendingTemplates: (templates: Template[]) => void;
  setFeaturedTemplates: (templates: Template[]) => void;
}

export const useTemplateStore = create<TemplateState>((set) => ({
  templates: TEMPLATES,
  selectedCategory: null,
  selectedComplexity: null,
  selectedTemplate: null,
  isModalOpen: false,
  compareList: [],
  savedTemplates: [],
  sortBy: 'newest',
  searchQuery: '',
  autocompleteResults: [],
  infiniteScrollPage: 1,
  trendingTemplates: [],
  featuredTemplates: [],

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedComplexity: (complexity) => set({ selectedComplexity: complexity }),
  openTemplateDetails: (template) => set({ selectedTemplate: template, isModalOpen: true }),
  closeTemplateDetails: () => set({ selectedTemplate: null, isModalOpen: false }),
  
  toggleCompare: (id) => set((state) => ({
    compareList: state.compareList.includes(id)
      ? state.compareList.filter(x => x !== id)
      : state.compareList.length < 3 
        ? [...state.compareList, id]
        : state.compareList
  })),
  clearCompare: () => set({ compareList: [] }),
  toggleSave: (id) => set((state) => ({
    savedTemplates: state.savedTemplates.includes(id)
      ? state.savedTemplates.filter(x => x !== id)
      : [...state.savedTemplates, id]
  })),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setAutocompleteResults: (autocompleteResults) => set({ autocompleteResults }),
  setInfiniteScrollPage: (infiniteScrollPage) => set({ infiniteScrollPage }),
  setTrendingTemplates: (trendingTemplates) => set({ trendingTemplates }),
  setFeaturedTemplates: (featuredTemplates) => set({ featuredTemplates }),
}));

export default useTemplateStore;
