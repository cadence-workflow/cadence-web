'use client';
import React, { useMemo } from 'react';

import Blocks from '@/components/blocks/blocks';
import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import MarkdocRenderer from '@/components/markdoc/markdoc';
import PrettyJson from '@/components/pretty-json/pretty-json';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import getQueryResultContent from './helpers/get-query-result-content';
import { overrides, styled } from './workflow-queries-result.styles';
import { type Props } from './workflow-queries-result.types';

export default function WorkflowQueriesResult(props: Props) {
  const queryResultContent = useMemo(
    () => getQueryResultContent(props),
    [props]
  );

  const textToCopy = useMemo(() => {
    return losslessJsonStringify(queryResultContent.content, null, '\t');
  }, [queryResultContent]);

  return (
    <styled.ViewContainer $isError={queryResultContent.isError}>
      {queryResultContent.contentType === 'json' &&
        queryResultContent.content !== undefined && (
          <>
            <PrettyJson json={queryResultContent.content} />
            <CopyTextButton
              textToCopy={textToCopy}
              overrides={overrides.copyButton}
            />
          </>
        )}
      {queryResultContent.contentType === 'markdown' &&
        queryResultContent.content !== undefined && (
          <MarkdocRenderer content={queryResultContent.content} />
        )}
      {queryResultContent.contentType === 'blocks' &&
        queryResultContent.content !== undefined && (
          <Blocks
            blocks={queryResultContent.content}
            domain={props.domain}
            cluster={props.cluster}
            workflowId={props.workflowId}
            runId={props.runId}
          />
        )}
    </styled.ViewContainer>
  );
}
