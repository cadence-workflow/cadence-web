'use client';
import React, { useState } from 'react';

import { Button } from 'baseui/button';
import { useSnackbar } from 'baseui/snackbar';

import Markdown from '@/components/markdown/markdown';
import PrettyJson from '@/components/pretty-json/pretty-json';
import losslessJsonStringify from '@/utils/lossless-json-stringify';
import request from '@/utils/request';

import { styled } from './blocks.styles';
import {
  type Props,
  type Block,
  type SectionBlock,
  type ActionsBlock,
  type ButtonElement,
} from './blocks.types';

export default function Blocks({
  blocks,
  domain,
  cluster,
  workflowId,
  runId,
}: Props) {
  const [loadingButtons, setLoadingButtons] = useState<Set<string>>(new Set());
  const { enqueue } = useSnackbar();

  const handleButtonClick = async (button: ButtonElement, index: number) => {
    // Only handle signal actions
    if (button.action.type !== 'signal') {
      enqueue({
        message: `Button action type '${button.action.type}' is not supported. Only 'signal' actions are currently handled.`,
        actionMessage: 'OK',
      });
      return;
    }

    const buttonKey = `${button.action.signal_name}-${index}`;

    if (loadingButtons.has(buttonKey)) {
      return; // Prevent double clicks
    }

    setLoadingButtons((prev) => new Set(prev).add(buttonKey));

    try {
      const targetWorkflowId = button.action.workflow_id || workflowId;
      const targetRunId = button.action.run_id || runId;

      const signalInput = button.action.signal_value
        ? losslessJsonStringify(button.action.signal_value)
        : undefined;

      const response = await request(
        `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(targetWorkflowId)}/${encodeURIComponent(targetRunId)}/signal`,
        {
          method: 'POST',
          body: JSON.stringify({
            signalName: button.action.signal_name,
            signalInput,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        enqueue({
          message: errorData.message || 'Failed to signal workflow',
          actionMessage: 'OK',
        });
        return;
      }

      // Optionally show success feedback here
    } catch (error: any) {
      enqueue({
        message: error.message || 'Failed to signal workflow',
        actionMessage: 'Dismiss',
      });
    } finally {
      setLoadingButtons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(buttonKey);
        return newSet;
      });
    }
  };

  const renderSection = (section: SectionBlock) => {
    const content = section.componentOptions.text;
    if (section.format === 'text/markdown') {
      return (
        <styled.SectionContainer>
          <Markdown markdown={content} />
        </styled.SectionContainer>
      );
    }

    // Fallback to JSON rendering for other formats
    try {
      const jsonContent = JSON.parse(content);
      return (
        <styled.SectionContainer>
          <PrettyJson json={jsonContent} />
        </styled.SectionContainer>
      );
    } catch {
      // If it's not valid JSON, render as plain text
      return (
        <styled.SectionContainer>
          <pre>{content}</pre>
        </styled.SectionContainer>
      );
    }
  };

  const renderActions = (actions: ActionsBlock) => {
    return (
      <styled.ActionsContainer>
        {actions.elements.map((element, index) => {
          if (element.type === 'button') {
            const buttonKey = `${element.action.type}-${element.action.signal_name}-${index}`;
            const isLoading = loadingButtons.has(buttonKey);

            return (
              <Button
                key={buttonKey}
                disabled={isLoading}
                onClick={() => handleButtonClick(element, index)}
                isLoading={isLoading}
              >
                {element.componentOptions.text}
              </Button>
            );
          }
          return null;
        })}
      </styled.ActionsContainer>
    );
  };

  const renderBlock = (block: Block, index: number) => {
    switch (block.type) {
      case 'section':
        return <div key={`section-${index}`}>{renderSection(block)}</div>;
      case 'divider':
        return <styled.DividerContainer key={`divider-${index}`} />;
      case 'actions':
        return <div key={`actions-${index}`}>{renderActions(block)}</div>;
      default:
        return null;
    }
  };

  return (
    <styled.ViewContainer>
      {blocks.map((block, index) => renderBlock(block, index))}
    </styled.ViewContainer>
  );
}
