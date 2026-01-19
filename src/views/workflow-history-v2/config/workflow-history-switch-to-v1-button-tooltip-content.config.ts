import { MdOutlineChat } from 'react-icons/md';

import { type ViewToggleTooltipContentConfig } from '../workflow-history-view-toggle-button/workflow-history-view-toggle-button.types';

const workflowHistorySwitchToV1ButtonTooltipContentConfig: ViewToggleTooltipContentConfig =
  {
    content: [
      `The new History view provides a more compact overview with a table-based 
          format designed for information density and easier scanning, helping you 
          find important events faster.`,
      `Please feel free to share any feedback if you encounter anything 
          that seems suboptimal in the new History view.`,
    ],
    linkButtons: [
      {
        label: 'Provide feedback',
        startEnhancer: MdOutlineChat,
        href: 'https://cloud-native.slack.com/archives/C09J2FQ7XU3',
      },
    ],
  };

export default workflowHistorySwitchToV1ButtonTooltipContentConfig;
