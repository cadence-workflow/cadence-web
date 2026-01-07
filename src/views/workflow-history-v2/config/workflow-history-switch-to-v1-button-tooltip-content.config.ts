import { MdOutlineChat } from 'react-icons/md';

import { type ViewToggleTooltipContentConfig } from '../workflow-history-view-toggle-button/workflow-history-view-toggle-button.types';

const workflowHistorySwitchToV1ButtonTooltipContentConfig: ViewToggleTooltipContentConfig =
  {
    content: [
      `The purpose of the new History view is to provide a more compact and 
          informative overview, including previews, flexible grouped and ungrouped 
          layouts, deeplinking, and several additional enhancements for 
          improved navigation and usability.`,
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
