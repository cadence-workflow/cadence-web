import React from 'react';

import {
  PLACEHOLDER_MAP,
  PLACEHOLDER_REGEX,
} from '../workflow-page-cli-commands-modal.constants';

import type { Props } from './cli-command-highlighted.types';

export default function CliCommandHighlighted({
  command,
  params,
  highlightClassName,
}: Props) {
  const parts = command.split(PLACEHOLDER_REGEX);

  return (
    <>
      {parts.map((part, index) => {
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
      })}
    </>
  );
}
