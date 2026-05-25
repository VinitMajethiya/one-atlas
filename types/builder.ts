export interface SchemaField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'select';
  label: string;
  required: boolean;
  visible: boolean;
  options?: string[]; // Options for select fields
}

export interface ComponentNode {
  id: string;
  name: string;
  type: 'layout' | 'table' | 'kanban' | 'chart' | 'form' | 'nav';
  children: ComponentNode[];
  fields: SchemaField[];
  props: Record<string, string | number | boolean>;
}

export interface AppSchema {
  appId: string;
  appName: string;
  version: number;
  templateId: string;
  templateName: string;
  components: ComponentNode[];
  createdAt: string;
  updatedAt: string;
}
