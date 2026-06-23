import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import SchedulePageInputJson from '../schedule-page-input-json';

jest.mock(
  '@/views/workflow-summary/workflow-summary-json-view/workflow-summary-json-view',
  () =>
    jest.fn(({ inputJson, hideTabToggle }) => (
      <div>
        WorkflowSummaryJsonView Mock
        {hideTabToggle ? ' hideTabToggle' : ''}
        {JSON.stringify(inputJson)}
      </div>
    ))
);

const mockInputPayload = {
  data: 'eyJ3b3JrZmxvd0FyZyI6InRlc3QtdmFsdWUifQ==',
};

describe(SchedulePageInputJson.name, () => {
  it('renders workflow summary JSON view when input is present', () => {
    setup({});
    expect(
      screen.getByText(/WorkflowSummaryJsonView Mock hideTabToggle/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/{"workflowArg":"test-value"}/)
    ).toBeInTheDocument();
  });

  it('renders nothing when input is missing', () => {
    setup({ input: null });
    expect(
      screen.queryByText(/WorkflowSummaryJsonView Mock/)
    ).not.toBeInTheDocument();
  });

  it('renders nothing when input payload has no data', () => {
    setup({ input: { data: null } });
    expect(
      screen.queryByText(/WorkflowSummaryJsonView Mock/)
    ).not.toBeInTheDocument();
  });
});

function setup({
  input = mockInputPayload,
}: {
  input?: { data?: string | null } | null;
}) {
  render(
    <SchedulePageInputJson
      input={input}
      domain="test-domain"
      cluster="test-cluster"
    />
  );
}
