import {
  MdHourglassBottom,
  MdOutlineMonitorHeart,
  MdReplay,
} from 'react-icons/md';

import { type DetailsRowItemParser } from '../workflow-history-details-row/workflow-history-details-row.types';
import WorkflowHistoryDetailsRowJson from '../workflow-history-details-row-json/workflow-history-details-row-json';
import WorkflowHistoryDetailsRowTooltipJson from '../workflow-history-details-row-tooltip-json/workflow-history-details-row-tooltip-json';

const workflowHistoryDetailsRowParsersConfig: Array<DetailsRowItemParser> = [
  {
    name: 'Heartbeat time',
    matcher: (name) => name === 'lastHeartbeatTime',
    icon: MdOutlineMonitorHeart,
  },
  {
    name: 'Json as PrettyJson',
    matcher: (name, value) =>
      value !== null &&
      new RegExp(
        '(input|result|details|failureDetails|Error|lastCompletionResult|heartbeatDetails|lastFailureDetails)$'
      ).test(name),
    icon: null,
    customRenderValue: WorkflowHistoryDetailsRowJson,
    customTooltipContent: WorkflowHistoryDetailsRowTooltipJson,
    invertTooltipColors: true,
  },
  {
    name: 'Timeouts with timer icon',
    matcher: (name) =>
      new RegExp('(TimeoutSeconds|BackoffSeconds|InSeconds)$').test(name),
    icon: MdHourglassBottom,
  },
  {
    name: '"attempt" greater than 0, as "retries"',
    matcher: (name) => name === 'attempt',
    hide: (_, value) => typeof value === 'number' && value <= 0,
    icon: MdReplay,
    customTooltipContent: () => 'retries',
  },
];

export default workflowHistoryDetailsRowParsersConfig;
