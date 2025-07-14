import { createElement } from 'react';

import type { WorkflowPageTabContentProps } from '../workflow-page-tab-content/workflow-page-tab-content.types';
import { type WorkflowPageTabsConfig } from '../workflow-page-tabs/workflow-page-tabs.types';

export const mockWorkflowPageTabsConfig: WorkflowPageTabsConfig<
  'summary' | 'history' | 'queries' | 'stack-trace' | 'diagnostics'
> = {
  summary: {
    title: 'Summary',
    artwork: () => createElement('div', { 'data-testid': 'summary-artwork' }),
    content: ({ params }: WorkflowPageTabContentProps) =>
      createElement('div', {}, JSON.stringify(params)),
    getErrorConfig: () => ({ message: 'summary error' }),
  },
  history: {
    title: 'History',
    artwork: () => createElement('div', { 'data-testid': 'history-artwork' }),
    endEnhancer: () =>
      createElement('div', { 'data-testid': 'history-end-enhancer' }),
    content: ({ params }: WorkflowPageTabContentProps) =>
      createElement('div', {}, JSON.stringify(params)),
    getErrorConfig: () => ({ message: 'history error' }),
  },
  diagnostics: {
    title: 'Diagnostics',
    artwork: () =>
      createElement('div', { 'data-testid': 'diagnostics-artwork' }),
    content: ({ params }: WorkflowPageTabContentProps) =>
      createElement('div', {}, JSON.stringify(params)),
    getErrorConfig: () => ({ message: 'diagnostics error' }),
  },
  queries: {
    title: 'Queries',
    artwork: () => createElement('div', { 'data-testid': 'queries-artwork' }),
    content: ({ params }: WorkflowPageTabContentProps) =>
      createElement('div', {}, JSON.stringify(params)),
    getErrorConfig: () => ({ message: 'queries error' }),
  },
  'stack-trace': {
    title: 'Stack Trace',
    artwork: () =>
      createElement('div', { 'data-testid': 'stack-trace-artwork' }),
    content: ({ params }: WorkflowPageTabContentProps) =>
      createElement('div', {}, JSON.stringify(params)),
    getErrorConfig: () => ({ message: 'stack trace error' }),
  },
} as const;
