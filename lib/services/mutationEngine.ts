// Pure mutation engine — no DB access, no HTTP.
// Takes an existing schema object + a mutation payload.
// Returns a NEW schema object (never mutates in place).
// Also contains the instruction parser that maps natural language to MutationPayload.

import type { MutationPayload } from '@/lib/validations/appSchema';

// ── Types ──────────────────────────────────────────────────────────────────

export interface SchemaField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'select';
  label: string;
  required: boolean;
  visible: boolean;
  options?: string[];
}

export interface ComponentNode {
  id: string;
  name: string;
  type: string;
  children: ComponentNode[];
  fields: SchemaField[];
  props: Record<string, string | number | boolean>;
}

export interface AppSchemaContent {
  appName: string;
  templateSlug: string;
  components: ComponentNode[];
}

// ── Instruction Parser ─────────────────────────────────────────────────────
// Maps natural language instructions to typed MutationPayload objects.

export function parseInstruction(instruction: string): MutationPayload | null {
  const lower = instruction.toLowerCase().trim();

  // Pattern 1: "add a <fieldName> field" / "add <fieldName> column"
  const addMatch = lower.match(/add (?:a |an )?(.+?) (?:field|column)/);
  if (addMatch) {
    return {
      type: 'add_field',
      fieldName: addMatch[1].trim(),
      fieldType: 'text',
    };
  }

  // Pattern 2: "remove the <fieldName> field" / "delete <fieldName> column"
  const removeMatch = lower.match(/(?:remove|delete) (?:the )?(.+?) (?:field|column)/);
  if (removeMatch) {
    return { type: 'remove_field', fieldName: removeMatch[1].trim() };
  }

  // Pattern 3: "rename <oldName> to <newName>"
  const renameMatch = lower.match(/rename (.+?) to (.+)/);
  if (renameMatch) {
    return {
      type: 'rename_field',
      fieldName: renameMatch[1].trim(),
      newFieldName: renameMatch[2].trim(),
    };
  }

  // Pattern 4: "update <componentId> <propKey> to <propValue>"
  const updateMatch = lower.match(/update (.+?) (.+?) to (.+)/);
  if (updateMatch) {
    return {
      type: 'update_component_prop',
      componentId: updateMatch[1].trim(),
      propKey: updateMatch[2].trim(),
      propValue: updateMatch[3].trim(),
    };
  }

  // Pattern 5: "move <componentId> to top" / "reorder ..."
  const reorderMatch = lower.match(/(?:move|reorder) (.+?) to (top|bottom)/);
  if (reorderMatch) {
    return {
      type: 'reorder_components',
      componentId: reorderMatch[1].trim(),
      propValue: reorderMatch[2].trim(),
    };
  }

  return null;
}

// ── Mutation Applier ───────────────────────────────────────────────────────

export function applyMutation(
  schema: AppSchemaContent,
  mutation: MutationPayload
): AppSchemaContent {
  // Deep clone — never mutate in place
  const next: AppSchemaContent = JSON.parse(JSON.stringify(schema));

  switch (mutation.type) {
    case 'add_field': {
      if (!mutation.fieldName) break;
      const newField: SchemaField = {
        id: `field_${Date.now()}`,
        name: mutation.fieldName,
        type: (mutation.fieldType as SchemaField['type']) ?? 'text',
        label: mutation.fieldName.charAt(0).toUpperCase() + mutation.fieldName.slice(1),
        required: false,
        visible: true,
      };
      // Add to first component that has a fields array
      const target = next.components.find((c) => Array.isArray(c.fields));
      if (target) target.fields.push(newField);
      break;
    }

    case 'remove_field': {
      if (!mutation.fieldName) break;
      for (const comp of next.components) {
        if (Array.isArray(comp.fields)) {
          comp.fields = comp.fields.filter(
            (f) => f.name.toLowerCase() !== mutation.fieldName!.toLowerCase()
          );
        }
      }
      break;
    }

    case 'rename_field': {
      if (!mutation.fieldName || !mutation.newFieldName) break;
      for (const comp of next.components) {
        if (Array.isArray(comp.fields)) {
          for (const field of comp.fields) {
            if (field.name.toLowerCase() === mutation.fieldName!.toLowerCase()) {
              field.name = mutation.newFieldName!;
              field.label =
                mutation.newFieldName!.charAt(0).toUpperCase() +
                mutation.newFieldName!.slice(1);
            }
          }
        }
      }
      break;
    }

    case 'update_component_prop': {
      if (!mutation.componentId || !mutation.propKey) break;
      const comp = next.components.find(
        (c) => c.id === mutation.componentId || c.name.toLowerCase() === mutation.componentId!.toLowerCase()
      );
      if (comp && mutation.propValue !== undefined) {
        comp.props[mutation.propKey] = mutation.propValue as string | number | boolean;
      }
      break;
    }

    case 'reorder_components': {
      if (!mutation.componentId) break;
      const idx = next.components.findIndex(
        (c) => c.id === mutation.componentId || c.name.toLowerCase() === mutation.componentId!.toLowerCase()
      );
      if (idx === -1) break;
      const [moved] = next.components.splice(idx, 1);
      if (String(mutation.propValue) === 'top') next.components.unshift(moved);
      else next.components.push(moved);
      break;
    }
  }

  return next;
}
