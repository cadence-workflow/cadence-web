'use client';

import React, { useEffect, useState } from 'react';

import { Segment, SegmentedControl } from 'baseui/segmented-control';
import { MdCode, MdSort } from 'react-icons/md';

import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';

import useDiagnoseWorkflow from '../hooks/use-diagnose-workflow/use-diagnose-workflow';
import WorkflowDiagnosticsJson from '../workflow-diagnostics-json/workflow-diagnostics-json';
import WorkflowDiagnosticsList from '../workflow-diagnostics-list/workflow-diagnostics-list';

import { overrides, styled } from './workflow-diagnostics-content.styles';
import { type Props } from './workflow-diagnostics-content.types';

export default function WorkflowDiagnosticsContent({
  domain,
  cluster,
  workflowId,
  runId,
}: Props) {
  const { data, error, status } = useDiagnoseWorkflow({
    domain,
    cluster,
    workflowId,
    runId,
  });

  const [activeView, setActiveView] = useState<'list' | 'json'>('list');
  useEffect(() => {
    if (data?.parsingError) {
      setActiveView('json');
    }
  }, [data?.parsingError]);

  if (status === 'pending') {
    return <SectionLoadingIndicator />;
  }

  if (status === 'error') {
    throw error;
  }

  const ViewComponent =
    activeView === 'list' ? WorkflowDiagnosticsList : WorkflowDiagnosticsJson;

  return (
    <styled.PageSection>
      <styled.ButtonsContainer>
        <SegmentedControl
          activeKey={activeView}
          onChange={({ activeKey }) => {
            setActiveView(activeKey === 'list' ? 'list' : 'json');
          }}
          overrides={overrides.viewToggle}
        >
          <Segment
            key="list"
            disabled={Boolean(data.parsingError)}
            artwork={() => <MdSort />}
            label="List"
            overrides={overrides.viewToggleSegment}
          />
          <Segment
            key="json"
            artwork={() => <MdCode />}
            label="JSON"
            overrides={overrides.viewToggleSegment}
          />
        </SegmentedControl>
        {/* Add a button here to expand all diagnostics issues, hide in JSON mode ofc */}
      </styled.ButtonsContainer>
      <ViewComponent
        domain={domain}
        cluster={cluster}
        workflowId={workflowId}
        runId={runId}
        diagnosticsResponse={data}
      />
    </styled.PageSection>
  );
}
