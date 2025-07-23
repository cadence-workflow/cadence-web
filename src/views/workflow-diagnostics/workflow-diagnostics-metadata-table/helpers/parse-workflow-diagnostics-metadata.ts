import { createElement } from 'react';

import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import workflowDiagnosticsMetadataParsersConfig from '../../config/workflow-diagnostics-metadata-parsers.config';
import { type ParsedWorkflowDiagnosticsMetadataField } from '../workflow-diagnostics-metadata-table.types';

export default function parseWorkflowDiagnosticsMetadata({
  metadata,
  ...routeParams
}: {
  metadata: any;
} & WorkflowPageParams): Array<ParsedWorkflowDiagnosticsMetadataField> {
  return Object.entries(metadata).map(([key, value]) => {
    const renderConfig = workflowDiagnosticsMetadataParsersConfig.find((c) =>
      c.matcher(key, value)
    );

    return {
      key,
      label: key,
      value: renderConfig
        ? createElement(renderConfig.renderValue, { value, ...routeParams })
        : String(value),
      forceWrap: renderConfig?.forceWrap,
    };
  });
}
