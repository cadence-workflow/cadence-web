'use client';
import React, { useState } from 'react';

import Markdown from '@/components/markdown/markdown';
import PrettyJson from '@/components/pretty-json/pretty-json';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { styled } from './blocks.styles';
import { 
  type Props, 
  type Block, 
  type SectionBlock, 
  type ActionsBlock, 
  type ButtonElement 
} from './blocks.types';

export default function Blocks({ blocks, domain, cluster, workflowId, runId }: Props) {
  const [loadingButtons, setLoadingButtons] = useState<Set<string>>(new Set());

  const handleButtonClick = async (button: ButtonElement, index: number) => {
    const buttonKey = `${button.signal}-${index}`;
    
    if (loadingButtons.has(buttonKey)) {
      return; // Prevent double clicks
    }

    setLoadingButtons(prev => new Set(prev).add(buttonKey));

    try {
      const targetWorkflowId = button.workflow_id || workflowId;
      const targetRunId = button.run_id || runId;
      
      const signalInput = button.signal_value 
        ? losslessJsonStringify(button.signal_value)
        : undefined;

      const response = await fetch(
        `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(targetWorkflowId)}/${encodeURIComponent(targetRunId)}/signal`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            signalName: button.signal,
            signalInput,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to signal workflow');
      }

      // Optionally show success feedback here
      console.log('Signal sent successfully');
    } catch (error) {
      console.error('Error signaling workflow:', error);
      // Optionally show error feedback here
    } finally {
      setLoadingButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(buttonKey);
        return newSet;
      });
    }
  };

  const renderSection = (section: SectionBlock) => {
    const content = section.text.text;
    
    if (section.format === 'text/markdown' || section.text.type === 'text/markdown') {
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
            const buttonKey = `${element.signal}-${index}`;
            const isLoading = loadingButtons.has(buttonKey);
            
            return (
              <styled.Button
                key={buttonKey}
                $isLoading={isLoading}
                disabled={isLoading}
                onClick={() => handleButtonClick(element, index)}
              >
                {isLoading ? 'Sending...' : element.text.text}
              </styled.Button>
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
      {blocks.blocks.map((block, index) => renderBlock(block, index))}
    </styled.ViewContainer>
  );
}

