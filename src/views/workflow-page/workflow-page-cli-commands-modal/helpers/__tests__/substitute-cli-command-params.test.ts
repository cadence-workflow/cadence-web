import substituteCliCommandParams from '../substitute-cli-command-params';

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
