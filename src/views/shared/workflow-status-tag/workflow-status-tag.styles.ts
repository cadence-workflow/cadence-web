import { type Theme } from 'baseui';
import type { TagOverrides } from 'baseui/tag/types';
import { type StyleObject } from 'styletron-react';

import { WORKFLOW_STATUSES } from './workflow-status-tag.constants';
import { type OverridesArgs } from './workflow-status-tag.types';

export function overrides(args: OverridesArgs) {
  return {
    tag: {
      Root: {
        style: ({ $theme }: { $theme: Theme }): StyleObject => {
          let tagColor: string;
          if (args.isArchived) {
            tagColor = $theme.colors.warning100;
          } else {
            switch (args.status) {
              case WORKFLOW_STATUSES.running:
                tagColor = $theme.colors.accent100;
                break;
              case WORKFLOW_STATUSES.completed:
                tagColor = $theme.colors.positive100;
                break;
              case WORKFLOW_STATUSES.failed:
              case WORKFLOW_STATUSES.timedOut:
                tagColor = $theme.colors.negative100;
                break;
              case WORKFLOW_STATUSES.canceled:
              case WORKFLOW_STATUSES.terminated:
                tagColor = $theme.colors.warning100;
                break;
              case WORKFLOW_STATUSES.continuedAsNew:
                tagColor = $theme.colors.primary100;
                break;
              default:
                tagColor = $theme.colors.negative100;
                break;
            }
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
