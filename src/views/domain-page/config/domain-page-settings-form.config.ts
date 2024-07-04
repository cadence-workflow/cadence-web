import { createElement } from 'react';

import { STYLE_TYPE, Checkbox } from 'baseui/checkbox';
import { Textarea, SIZE } from 'baseui/textarea';
import { z } from 'zod';

import { type FormField } from '@/components/form/form.types';
import formatDurationToDays from '@/utils/data-formatters/format-duration-to-days';

import DomainPageSettingsRetentionPeriod from '../domain-page-settings-retention-period/domain-page-settings-retention-period';
import { type DomainInfo } from '../domain-page.types';

export const settingsFormSchema = z.object({
  description: z.string(),
  retentionPeriodDays: z
    .number({ message: 'Retention period must be a positive integer' })
    .positive({ message: 'Retention period must be positive' }),
  visibilityArchival: z.boolean(),
  historyArchival: z.boolean(),
});

export const settingsFormConfig: [
  FormField<DomainInfo, typeof settingsFormSchema, 'description'>,
  FormField<DomainInfo, typeof settingsFormSchema, 'retentionPeriodDays'>,
  FormField<DomainInfo, typeof settingsFormSchema, 'visibilityArchival'>,
  FormField<DomainInfo, typeof settingsFormSchema, 'historyArchival'>,
] = [
  {
    path: 'description',
    title: 'Description',
    description: 'Brief, high-level description of the Cadence domain',
    getDefaultValue: (data) => data.description,
    component: ({ onBlur, onChange, value, error }) =>
      createElement(Textarea, {
        onBlur,
        onChange,
        value,
        error: Boolean(error),
        size: SIZE.compact,
      }),
  },
  {
    path: 'retentionPeriodDays',
    title: 'Retention Period',
    description:
      'Duration for which the workflow execution history is kept in primary persistence store',
    getDefaultValue: (data) =>
      formatDurationToDays(data.workflowExecutionRetentionPeriod) ?? 0,
    component: DomainPageSettingsRetentionPeriod,
  },
  {
    path: 'visibilityArchival',
    title: 'Visibility Archival',
    description: 'Flag to enable archival for visibility records',
    getDefaultValue: (data) =>
      data.visibilityArchivalStatus === 'ARCHIVAL_STATUS_ENABLED',
    component: ({ onBlur, onChange, value, error }) =>
      createElement(Checkbox, {
        onBlur,
        onChange,
        checked: value,
        error: Boolean(error),
        checkmarkType: STYLE_TYPE.toggle_round,
      }),
  },
  {
    path: 'historyArchival',
    title: 'History Archival',
    description: 'Flag to enable archival for workflow history data',
    getDefaultValue: (data) =>
      data.historyArchivalStatus === 'ARCHIVAL_STATUS_ENABLED',
    component: ({ onBlur, onChange, value, error }) =>
      createElement(Checkbox, {
        onBlur,
        onChange,
        checked: value,
        error: Boolean(error),
        checkmarkType: STYLE_TYPE.toggle_round,
      }),
  },
] as const;
