import React from 'react';

import { render } from '@/test-utils/rtl';

import { workflowPageUrlParams } from '../../__fixtures__/workflow-page-url-params';
import { type WorkflowHistoryEventDetailsValueComponentProps } from '../../workflow-history-event-details/workflow-history-event-details.types';
import WorkflowHistoryEventDetailsEntry from '../workflow-history-event-details-entry';
import { type Props } from '../workflow-history-event-details-entry.types';

describe(WorkflowHistoryEventDetailsEntry.name, () => {
  it('renders the custom ValueComponent when provided', () => {
    const CustomComponent = ({
      entryKey,
      entryPath,
      entryValue,
    }: WorkflowHistoryEventDetailsValueComponentProps) => (
      <div>
        {entryKey} - {entryPath} - {entryValue}
      </div>
    );

    const props: Props = {
      entryKey: 'key1',
      entryPath: 'path1',
      entryValue: 'value1',
      renderConfig: {
        name: 'Mock render config with custom component',
        customMatcher: () => true,
        valueComponent: CustomComponent,
      },
      ...workflowPageUrlParams,
    };

    const { getByText } = render(
      <WorkflowHistoryEventDetailsEntry {...props} />
    );

    expect(getByText('key1 - path1 - value1')).toBeInTheDocument();
  });

  it('renders the entryValue as a string when ValueComponent is not provided', () => {
    const props: Props = {
      entryKey: 'key2',
      entryPath: 'path2',
      entryValue: 'value2',
      renderConfig: {
        name: 'Mock render config without custom component',
        customMatcher: () => true,
      },
      ...workflowPageUrlParams,
    };

    const { getByText } = render(
      <WorkflowHistoryEventDetailsEntry {...props} />
    );

    expect(getByText('value2')).toBeInTheDocument();
  });
});
