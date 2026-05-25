import { z } from 'zod';

export const GenerateAppSchema = z.object({
  prompt: z.string().min(3).max(500),
});

export const EditInstructionSchema = z.object({
  instruction: z.string().min(2).max(300),
});

export const MutationPayloadSchema = z.object({
  type: z.enum([
    'add_field',
    'remove_field',
    'rename_field',
    'update_component_prop',
    'reorder_components',
  ]),
  componentId: z.string().optional(),
  fieldName: z.string().optional(),
  newFieldName: z.string().optional(),
  fieldType: z.string().optional(),
  propKey: z.string().optional(),
  propValue: z.unknown().optional(),
  order: z.array(z.string()).optional(),
});

export type GenerateAppInput = z.infer<typeof GenerateAppSchema>;
export type EditInstructionInput = z.infer<typeof EditInstructionSchema>;
export type MutationPayload = z.infer<typeof MutationPayloadSchema>;
