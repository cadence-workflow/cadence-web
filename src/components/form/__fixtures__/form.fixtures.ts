import { createElement } from 'react';

import { z } from 'zod';

import { type FormField } from '../form.types';

export const mockZodSchema = z.object({
  field1: z.string(),
  field2: z.number().positive(),
  field3: z.boolean(),
});

export const mockData = {
  fieldA: 'mock_data_A',
  fieldB: 1234,
  fieldC: 'MOCK_ENUM_VALID',
};

export const mockFormConfig: [
  FormField<typeof mockData, typeof mockZodSchema, 'field1'>,
  FormField<typeof mockData, typeof mockZodSchema, 'field2'>,
  FormField<typeof mockData, typeof mockZodSchema, 'field3'>,
] = [
  {
    path: 'field1',
    title: 'Field 1',
    description: 'Mock field #1',
    getDefaultValue: (d) => d.fieldA,
    component: (props) => createElement('input', props),
  },
  {
    path: 'field2',
    title: 'Field 2',
    description: 'Mock field #2',
    getDefaultValue: (d) => d.fieldB,
    component: (props) => createElement('input', props),
  },
  {
    path: 'field3',
    title: 'Field 3',
    description: 'Mock field #3',
    getDefaultValue: (d) => d.fieldC === 'MOCK_ENUM_VALID',
    component: (props) => createElement('input', props),
  },
] as const;
