'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';

import getQueryJsonContent from './helpers/get-query-json-content';
import { styled } from './workflow-queries-result-json.styles';
import { type Props } from './workflow-queries-result-json.types';

export default function WorkflowQueriesResultJson(props: Props) {
  const { content, isError } = useMemo(
    () => getQueryJsonContent(props),
    [props]
  );

  const textToCopy = useMemo(() => {
    return JSON.stringify(content, null, '\t');
  }, [content]);

  return (
    <styled.ViewContainer $isError={isError}>
      {content !== undefined && (
        <>
          <PrettyJson json={content} />
          <CopyTextButton textToCopy={textToCopy} />
        </>
      )}
    </styled.ViewContainer>
  );
}
