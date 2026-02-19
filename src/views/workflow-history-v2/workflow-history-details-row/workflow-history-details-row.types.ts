import { type ComponentType } from 'react';

import { type IconProps } from 'baseui/icon';

import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import { type EventDetailsEntries } from '../workflow-history-event-details/workflow-history-event-details.types';

export type DetailsRowValueComponentProps = {
  label: string;
  value: any;
  isNegative?: boolean;
} & WorkflowPageParams;

/**
 * Configuration object for parsing and rendering workflow history details row items.
 * Parsers are matched against event details entries to determine how they should be displayed.
 */
export type DetailsRowItemParser = {
  /** Human-readable name for this parser configuration */
  name: string;
  /**
   * Function that determines if this parser applies to a given path/value pair.
   * Returns true if the parser should handle this entry.
   */
  matcher: (path: string, value: unknown) => boolean;
  /**
   * Optional function that conditionally hides entries even if the matcher matches.
   * Returns true to hide the entry, false to show it.
   */
  hide?: (path: string, value: unknown) => boolean;
  /**
   * React component for the icon to display next to the value, or null for no icon.
   * The icon component should accept size and color props compatible with BaseUI IconProps.
   */
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }> | null;
  /**
   * Optional React component to use for rendering the value instead of the default string conversion.
   * Receives DetailsRowValueComponentProps.
   */
  customRenderValue?: ComponentType<DetailsRowValueComponentProps>;
  /**
   * Optional React component to use for rendering tooltip content instead of the default label.
   * Receives DetailsRowValueComponentProps.
   */
  customTooltipContent?: ComponentType<DetailsRowValueComponentProps>;
  /** Optional flag to invert the tooltip color scheme (default: dark tooltip in light mode). */
  invertTooltipColors?: boolean;
  /** Optional flag to remove padding and background from the details row item */
  omitWrapping?: boolean;
  /** Optional flag to stop click event propagation if the item has clickable content */
  hasClickableContent?: boolean;
};

export type DetailsRowItem = {
  path: string;
  label: string;
  value: any;
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }> | null;
  renderValue: ComponentType<DetailsRowValueComponentProps>;
  renderTooltip: ComponentType<DetailsRowValueComponentProps>;
  invertTooltipColors?: boolean;
  omitWrapping?: boolean;
  hasClickableContent?: boolean;
};

export type Props = {
  detailsEntries: EventDetailsEntries;
} & WorkflowPageParams;
