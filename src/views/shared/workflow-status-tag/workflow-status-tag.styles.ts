import { type Theme } from 'baseui';
import type { TagOverrides } from 'baseui/tag/types';
import { type StyleObject } from 'styletron-react';

import { OverridesArgs } from './workflow-status-tag.types';

export function overrides(args: OverridesArgs) {
  return {
    tag: {
      Root: {
        style: ({ $theme }: { $theme: Theme }): StyleObject => {
          let tagColor: string;
          switch (args.status) {
            case 'WORKFLOW_EXECUTION_STATUS_RUNNING':
              tagColor = $theme.colors.accent100;
              break;
            case 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED':
              tagColor = $theme.colors.positive100;
              break;
            case 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED':
            case 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT':
              tagColor = $theme.colors.negative100;
              break;
            case 'WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED':
            case 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED':
              tagColor = $theme.colors.warning100;
              break;
            case 'WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW':
              tagColor = $theme.colors.primary100;
              break;
            default:
              tagColor = $theme.colors.negative100;
              break;
          }

          return {
            color: $theme.colors.contentPrimary,
            backgroundColor: tagColor,
            borderRadius: $theme.borders.radius200,
            height: $theme.sizing.scale600,
            paddingRight: $theme.sizing.scale100,
            paddingLeft: $theme.sizing.scale100,
            paddingTop: 0,
            paddingBottom: 0,
            margin: 0,
          };
        },
        ...(args.link && {
          props: {
            $as: 'a',
            target: '_blank',
            rel: 'noreferrer',
            href: args.link,
          },
        }),
      },
      Text: {
        style: ({ $theme }: { $theme: Theme }) => ({
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: $theme.sizing.scale100,
          ...$theme.typography.LabelXSmall,
        }),
      },
    } satisfies TagOverrides,
  };
}
