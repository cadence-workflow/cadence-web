export type WorkflowHomeContent =
  | { mode: 'loading' }
  | { mode: 'disabled' }
  | { mode: 'archived' }
  | { mode: 'not-set-up' }
  | { mode: 'error'; description: string }
  | { mode: 'invalid-format'; description: string }
  | { mode: 'ready'; content: string; title?: string };

export type HomePage = {
  content: string;
  title?: string;
};
