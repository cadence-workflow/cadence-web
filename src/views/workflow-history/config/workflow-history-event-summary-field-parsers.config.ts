import {
  MdLabelImportantOutline,
  MdOutlineMonitorHeart,
  MdOutlineTimer,
  MdRadioButtonChecked,
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
          '(input|result|details|failureDetails|Error|lastCompletionResult|heartbeatDetails)$'
        ).test(name),
      icon: null,
      customRenderValue: WorkflowHistoryEventSummaryJson,
      hideDefaultTooltip: true,
    },
    {
      name: 'Timeouts with timer icon',
      matcher: (name) =>
        new RegExp('(TimeoutSeconds|BackoffSeconds|InSeconds)$').test(name),
      icon: MdOutlineTimer,
    },
    {
      name: 'Reason with radio button icon',
      matcher: (name) => new RegExp('(reason|failureReason)').test(name),
      icon: MdRadioButtonChecked,
    },
    {
      name: 'WorkflowExecution & RunIds as links',
      matcher: (name) =>
        new RegExp(
          '(parentWorkflowExecution|externalWorkflowExecution|workflowExecution|firstExecutionRunId|originalExecutionRunId|newExecutionRunId|continuedExecutionRunId)$'
        ).test(name),
      icon: MdLabelImportantOutline,
    },
  ];

export default workflowHistoryEventSummaryFieldParsersConfig;
