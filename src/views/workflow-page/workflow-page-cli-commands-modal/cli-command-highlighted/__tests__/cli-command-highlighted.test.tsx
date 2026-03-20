import React from 'react';

import { render } from '@/test-utils/rtl';

import CliCommandHighlighted from '../cli-command-highlighted';

describe('CliCommandHighlighted', () => {
  it('wraps substituted values in spans with the highlight class', () => {
    const command =
      'cadence --domain {domain-name} workflow run -w {workflow-id} -r {run-id}';
    const { container } = render(
      <CliCommandHighlighted
        command={command}
        params={{
          domain: 'test-domain',
          workflowId: 'test-workflow-id',
          runId: 'test-run-id',
        }}
        highlightClassName="highlight"
      />
    );

    const spans = container.querySelectorAll('span.highlight');
    expect(spans).toHaveLength(3);
    expect(spans[0].textContent).toBe('test-domain');
    expect(spans[1].textContent).toBe('test-workflow-id');
    expect(spans[2].textContent).toBe('test-run-id');
    expect(container.textContent).toBe(
      'cadence --domain test-domain workflow run -w test-workflow-id -r test-run-id'
    );
  });

  it('keeps original placeholders when params are missing', () => {
    const command = 'cadence --domain {domain-name} workflow run';
    const { container } = render(
      <CliCommandHighlighted
        command={command}
        params={{}}
        highlightClassName="highlight"
      />
    );

    const spans = container.querySelectorAll('span.highlight');
    expect(spans).toHaveLength(0);
    expect(container.textContent).toBe(
      'cadence --domain {domain-name} workflow run'
    );
  });

  it('highlights provided params and keeps placeholders for missing ones', () => {
    const command =
      'cadence --domain {domain-name} workflow run -w {workflow-id} -r {run-id}';
    const { container } = render(
      <CliCommandHighlighted
        command={command}
        params={{ domain: 'test-domain' }}
        highlightClassName="highlight"
      />
    );

    const spans = container.querySelectorAll('span.highlight');
    expect(spans).toHaveLength(1);
    expect(spans[0].textContent).toBe('test-domain');
    expect(container.textContent).toBe(
      'cadence --domain test-domain workflow run -w {workflow-id} -r {run-id}'
    );
  });

  it('returns plain text when no placeholders are present', () => {
    const command = 'cadence list domains';
    const { container } = render(
      <CliCommandHighlighted
        command={command}
        params={{ domain: 'test-domain' }}
        highlightClassName="highlight"
      />
    );

    const spans = container.querySelectorAll('span.highlight');
    expect(spans).toHaveLength(0);
    expect(container.textContent).toBe('cadence list domains');
  });
});
