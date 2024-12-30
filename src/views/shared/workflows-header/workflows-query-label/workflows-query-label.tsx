import React from 'react';

import { Button, KIND, SHAPE, SIZE } from 'baseui/button';
import {
  ACCESSIBILITY_TYPE,
  PLACEMENT,
  StatefulPopover,
  TRIGGER_TYPE,
} from 'baseui/popover';
import { MdCopyAll, MdInfoOutline, MdOpenInNew } from 'react-icons/md';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';

import workflowsQueryTooltipConfig from '../config/workflows-query-tooltip.config';

import { overrides, styled } from './workflows-query-label.styles';

export default function WorkflowsQueryLabel() {
  return (
    <styled.LabelContainer>
      <div>Query</div>
      <StatefulPopover
        triggerType={TRIGGER_TYPE.hover}
        placement={PLACEMENT.bottom}
        accessibilityType={ACCESSIBILITY_TYPE.tooltip}
        content={() => (
          <styled.TooltipContentContainer>
            <styled.TooltipHeader>
              <styled.TooltipTitle>
                {workflowsQueryTooltipConfig.title}
              </styled.TooltipTitle>
              <styled.TooltipText>
                {workflowsQueryTooltipConfig.subtitle}
              </styled.TooltipText>
            </styled.TooltipHeader>
            <styled.SupportedOperatorsContainer>
              {workflowsQueryTooltipConfig.supportedOperators.map(
                (operator) => (
                  <styled.SupportedOperator key={operator}>
                    {operator}
                  </styled.SupportedOperator>
                )
              )}
            </styled.SupportedOperatorsContainer>
            <styled.TooltipText>
              {workflowsQueryTooltipConfig.docsCta}
            </styled.TooltipText>
            <styled.TooltipTitle>
              {workflowsQueryTooltipConfig.exampleQueriesTitle}
            </styled.TooltipTitle>
            {workflowsQueryTooltipConfig.exampleQueries.map((query) => (
              <styled.QueryContainer key={query.label}>
                <styled.QueryLabel>{query.label}</styled.QueryLabel>
                <styled.QueryText>
                  {query.text}
                  <CopyTextButton
                    textToCopy={query.text}
                    kind={KIND.tertiary}
                    overrides={overrides.copyButton}
                  >
                    <MdCopyAll size={16} display="block" />
                  </CopyTextButton>
                </styled.QueryText>
              </styled.QueryContainer>
            ))}
            <Button
              kind={KIND.secondary}
              shape={SHAPE.pill}
              size={SIZE.mini}
              overrides={overrides.docsLinkButton}
              $as="a"
              href={workflowsQueryTooltipConfig.docsLink}
              target="_blank"
              rel="noreferrer"
              endEnhancer={<MdOpenInNew />}
            >
              {workflowsQueryTooltipConfig.docsButtonText}
            </Button>
          </styled.TooltipContentContainer>
        )}
        overrides={overrides.popover}
      >
        <div data-testid="tooltip-hover-target">
          <MdInfoOutline size={16} display="block" />
        </div>
      </StatefulPopover>
    </styled.LabelContainer>
  );
}
