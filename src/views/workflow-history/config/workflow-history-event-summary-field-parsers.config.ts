import {
  MdHourglassBottom,
  MdOutlineMonitorHeart,
  MdReplay,
} from 'react-icons/md';

import { type WorkflowHistoryEventSummaryFieldParser } from '../workflow-history-event-summary/workflow-history-event-summary.types';
import WorkflowHistoryEventSummaryJson from '../workflow-history-event-summary-json/workflow-history-event-summary-json';

const workflowHistoryEventSummaryFieldParsersConfig: Array<WorkflowHistoryEventSummaryFieldParser> =
  [
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
      customRenderValue: WorkflowHistoryEventSummaryJson,
      hideDefaultTooltip: true,
    },
    {
      name: 'Timeouts with timer icon',
      matcher: (name) =>
        new RegExp('(TimeoutSeconds|BackoffSeconds|InSeconds)$').test(name),
      icon: MdHourglassBottom,
    },
    {
      name: 'Retries with retry icon',
      matcher: (name) => name === 'attempt',
      shouldHide: (_, value) => typeof value === 'number' && value <= 0,
      icon: MdReplay,
      tooltipLabel: 'retries',
    },
  ];

export default workflowHistoryEventSummaryFieldParsersConfig;
