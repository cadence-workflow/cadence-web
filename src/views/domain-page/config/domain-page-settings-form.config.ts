import { createElement } from 'react';

import { STYLE_TYPE, Checkbox } from 'baseui/checkbox';
import { Textarea, SIZE } from 'baseui/textarea';
import { z } from 'zod';

import formatDurationToSeconds from '@/utils/data-formatters/format-duration-to-seconds';
import { type SettingsFormField } from '@/views/shared/settings-form/settings-form.types';

import DomainPageSettingsRetentionPeriod from '../domain-page-settings-retention-period/domain-page-settings-retention-period';
import { type DomainInfo } from '../domain-page.types';

export const domainPageSettingsFormSchema = z.object({
  description: z.string(),
  retentionPeriodSeconds: z
    .number({ message: 'Retention period must be a positive integer' })
    .positive({ message: 'Retention period must be positive' }),
  visibilityArchival: z.boolean(),
  historyArchival: z.boolean(),
});

export const domainPageSettingsFormConfig: [
  SettingsFormField<
    DomainInfo,
    typeof domainPageSettingsFormSchema,
    'description'
  >,
  SettingsFormField<
    DomainInfo,
    typeof domainPageSettingsFormSchema,
    'retentionPeriodSeconds'
  >,
  SettingsFormField<
    DomainInfo,
    typeof domainPageSettingsFormSchema,
    'visibilityArchival'
  >,
  SettingsFormField<
    DomainInfo,
    typeof domainPageSettingsFormSchema,
    'historyArchival'
  >,
] = [
  {
    path: 'description',
    title: 'Description',
    description: 'Brief, high-level description of the Cadence domain',
    getInitialValue: (data) => data.description,
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
    path: 'retentionPeriodSeconds',
    title: 'Retention Period',
    description:
      'Duration for which the workflow execution history is kept in primary persistence store',
    getInitialValue: (data) =>
      formatDurationToSeconds(data.workflowExecutionRetentionPeriod) ?? 0,
    component: DomainPageSettingsRetentionPeriod,
  },
  {
    path: 'visibilityArchival',
    title: 'Visibility Archival',
    description: 'Flag to enable archival for visibility records',
    getInitialValue: (data) =>
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
    getInitialValue: (data) =>
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
