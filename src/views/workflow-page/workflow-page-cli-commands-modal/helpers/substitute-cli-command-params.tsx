import React from 'react';

import type { WorkflowPageParams } from '../../workflow-page.types';

const PLACEHOLDER_MAP: Record<string, keyof WorkflowPageParams> = {
  '{domain-name}': 'domain',
  '{workflow-id}': 'workflowId',
  '{run-id}': 'runId',
};

const PLACEHOLDER_REGEX = /(\{domain-name\}|\{workflow-id\}|\{run-id\})/g;

export default function substituteCliCommandParams(
  command: string,
  params: Partial<WorkflowPageParams>
): string {
  return command.replace(PLACEHOLDER_REGEX, (match) => {
    const paramKey = PLACEHOLDER_MAP[match];
    return (paramKey && params?.[paramKey]) ?? match;
  });
}

export function substituteCliCommandParamsJSX(
  command: string,
  params: Partial<WorkflowPageParams>,
  highlightClassName: string
): React.ReactNode {
  const parts = command.split(PLACEHOLDER_REGEX);

  return parts.map((part, index) => {
    const paramKey = PLACEHOLDER_MAP[part];
    if (paramKey) {
      const value = params?.[paramKey];
      if (!value) {
        return part;
      }
      return (
        <span key={index} className={highlightClassName}>
          {value}
        </span>
      );
    }
    return part;
  });
}
