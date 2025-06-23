'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import Markdown from '@/components/markdown/markdown';
import PrettyJson from '@/components/pretty-json/pretty-json';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import getQueryResultContent from './helpers/get-query-result-content';
import { overrides, styled } from './workflow-queries-result.styles';
import { type Props } from './workflow-queries-result.types';

export default function WorkflowQueriesResult(props: Props) {
  const { content, contentType, isError } = useMemo(
    () => getQueryResultContent(props),
    [props]
  );

  const textToCopy = useMemo(() => {
    return losslessJsonStringify(content, null, '\t');
  }, [content]);

  return (
    <styled.ViewContainer $isError={isError}>
      {contentType === 'json' && content !== undefined && (
        <>
          <PrettyJson json={content} />
          <CopyTextButton
            textToCopy={textToCopy}
            overrides={overrides.copyButton}
          />
        </>
      )}
      {contentType === 'markdown' && content !== undefined && (
        <Markdown markdown={content} />
      )}
    </styled.ViewContainer>
  );
}
