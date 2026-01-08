import { type ViewToggleTooltipContentConfig } from '@/views/workflow-history-v2/workflow-history-view-toggle-button/workflow-history-view-toggle-button.types';

const workflowHistorySwitchToV2ButtonTooltipContentConfig: ViewToggleTooltipContentConfig =
  {
    content: [
      `The new Workflow History UI provides a table-based layout with a more compact
          overview of your workflow's history, including aggregated event summaries (shown 
          inline and in a Summary tab), color codes for different event types, a floating 
          navigation bar for quick event discovery, and a sticky header.`,
      `Click to try it out!`,
    ],
  };

export default workflowHistorySwitchToV2ButtonTooltipContentConfig;
