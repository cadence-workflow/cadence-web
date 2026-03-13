import React from 'react';

import { render } from '@/test-utils/rtl';

import substituteCliCommandParams, {
  substituteCliCommandParamsJSX,
} from '../substitute-cli-command-params';

describe('substituteCliCommandParams', () => {
  it('replaces all parameter placeholders with provided values', () => {
    const command =
      'cadence --domain {domain-name} workflow run -w {workflow-id} -r {run-id}';
    const result = substituteCliCommandParams(command, {
      domain: 'test-domain',
      workflowId: 'test-workflow-id',
      runId: 'test-run-id',
    });
    expect(result).toBe(
      'cadence --domain test-domain workflow run -w test-workflow-id -r test-run-id'
    );
  });

  it('keeps placeholders when params are missing', () => {
    const command = 'cadence --domain {domain-name} workflow run';
    const result = substituteCliCommandParams(command, {});
    expect(result).toBe('cadence --domain {domain-name} workflow run');
  });

  it('handles multiple occurrences of the same placeholder', () => {
    const command = '{domain-name} and {domain-name}';
    const result = substituteCliCommandParams(command, {
      domain: 'my-domain',
    });
    expect(result).toBe('my-domain and my-domain');
  });

  it('returns command unchanged when no placeholders are present', () => {
    const command = 'cadence list domains';
    const result = substituteCliCommandParams(command, {
      domain: 'test-domain',
    });
    expect(result).toBe('cadence list domains');
  });

  it('handles values with special characters without double-decoding', () => {
    const command = 'cadence --domain {domain-name} list';
    const result = substituteCliCommandParams(command, {
      domain: 'domain-with-%25-percent',
    });
    expect(result).toBe('cadence --domain domain-with-%25-percent list');
  });
});

describe('substituteCliCommandParamsJSX', () => {
  it('wraps substituted values in spans with the highlight class', () => {
    const command =
      'cadence --domain {domain-name} workflow run -w {workflow-id} -r {run-id}';
    const { container } = render(
      <div>
        {substituteCliCommandParamsJSX(
          command,
          {
            domain: 'test-domain',
            workflowId: 'test-workflow-id',
            runId: 'test-run-id',
          },
          'highlight'
        )}
      </div>
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
      <div>{substituteCliCommandParamsJSX(command, {}, 'highlight')}</div>
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
      <div>
        {substituteCliCommandParamsJSX(
          command,
          { domain: 'test-domain' },
          'highlight'
        )}
      </div>
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
      <div>
        {substituteCliCommandParamsJSX(
          command,
          { domain: 'test-domain' },
          'highlight'
        )}
      </div>
    );

    const spans = container.querySelectorAll('span.highlight');
    expect(spans).toHaveLength(0);
    expect(container.textContent).toBe('cadence list domains');
  });
});
