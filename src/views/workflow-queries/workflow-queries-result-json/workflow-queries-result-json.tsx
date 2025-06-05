'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import PrettyJson from '@/components/pretty-json/pretty-json';
import Md from '@/components/markdown/md';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import getQueryJsonContent from './helpers/get-query-json-content';
import { overrides, styled } from './workflow-queries-result-json.styles';
import { Markdown, type Props } from './workflow-queries-result-json.types';

export default function WorkflowQueriesResultJson(props: Props) {
  const { content, isError } = useMemo(
    () => getQueryJsonContent(props),
    [props]
  );

  const textToCopy = useMemo(() => {
    return losslessJsonStringify(content, null, '\t');
  }, [content]);

  if (isContentMarkdown(content)) {
    return (
      <Md markdown={content.content} />
    );
  }

  return (
    <styled.ViewContainer $isError={isError}>
      {content !== undefined && (
        <>
          <PrettyJson json={content} />
          <CopyTextButton
            textToCopy={textToCopy}
            overrides={overrides.copyButton}
          />
        </>
      )}
    </styled.ViewContainer>
  );
}

const isContentMarkdown = (content: any): content is Markdown => {
  if (content === undefined) {
    return false;
  }
  if (content.type === 'markdown') {
    return true;
  }
  return false;
};