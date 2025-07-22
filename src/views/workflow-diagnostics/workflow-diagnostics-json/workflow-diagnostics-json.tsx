import { useMemo } from 'react';

import { Button } from 'baseui/button';
import { MdCopyAll, MdOutlineCloudDownload } from 'react-icons/md';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import downloadJson from '@/utils/download-json';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { styled, overrides } from './workflow-diagnostics-json.styles';
import { type Props } from './workflow-diagnostics-json.types';

export default function WorkflowDiagnosticsJson({
  workflowId,
  runId,
  diagnosticsResult,
}: Props) {
  const textToCopy = useMemo(() => {
    return losslessJsonStringify(diagnosticsResult, null, '\t');
  }, [diagnosticsResult]);

  return (
    <styled.ViewContainer>
      <PrettyJson json={diagnosticsResult as Record<string, any>} />
      <styled.ButtonsContainer>
        <Button
          data-testid="download-json-button"
          size="mini"
          kind="secondary"
          shape="circle"
          overrides={overrides.jsonButton}
          onClick={() =>
            downloadJson(
              diagnosticsResult,
              `diagnostics_${workflowId}_${runId}`
            )
          }
        >
          <MdOutlineCloudDownload size={16} />
        </Button>
        <CopyTextButton
          textToCopy={textToCopy}
          overrides={overrides.jsonButton}
        >
          <MdCopyAll size={16} />
        </CopyTextButton>
      </styled.ButtonsContainer>
    </styled.ViewContainer>
  );
}
