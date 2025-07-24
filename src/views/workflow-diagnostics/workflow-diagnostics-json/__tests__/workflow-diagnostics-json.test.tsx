import { render, screen, userEvent } from '@/test-utils/rtl';

import { mockWorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/__fixtures__/mock-workflow-diagnostics-result';

import WorkflowDiagnosticsJson from '../workflow-diagnostics-json';

const mockDownloadJson = jest.fn();
jest.mock('@/utils/download-json', () =>
  jest.fn((json, filename) => mockDownloadJson(json, filename))
);

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }) => (
    <div data-testid="copy-text-button">{textToCopy}</div>
  ))
);

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(({ json }) => (
    <div data-testid="pretty-json">{JSON.stringify(json)}</div>
  ))
);

describe(WorkflowDiagnosticsJson.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the PrettyJson component with diagnostics result', () => {
    setup({});
    expect(screen.getByTestId('pretty-json')).toBeInTheDocument();
    expect(screen.getByTestId('pretty-json')).toHaveTextContent('"result"');
  });

  it('renders copy text button with text to copy', () => {
    setup({});
    const copyButton = screen.getByTestId('copy-text-button');
    expect(copyButton).toBeInTheDocument();
    expect(copyButton).toHaveTextContent('"result"');
  });

  it('downloads JSON when download button is clicked', async () => {
    const { user } = setup({});
    const downloadButton = screen.getByTestId('download-json-button');
    await user.click(downloadButton);

    expect(mockDownloadJson).toHaveBeenCalledWith(
      mockWorkflowDiagnosticsResult,
      'diagnostics_test-workflow-id_test-run-id'
    );
  });

  it('renders with empty diagnostics result', () => {
    setup({
      diagnosticsResult: {
        result: {},
        completed: true,
      },
    });

    expect(screen.getByTestId('pretty-json')).toBeInTheDocument();
    expect(screen.getByTestId('pretty-json')).toHaveTextContent('"result"');
  });

  it('renders JSON with invalid data structure', () => {
    setup({
      diagnosticsResult: {
        result: {
          invalidParsedField: 'invalid-value',
        },
        completed: true,
      },
    });

    expect(screen.getByTestId('pretty-json')).toBeInTheDocument();
    expect(screen.getByTestId('pretty-json')).toHaveTextContent(
      '"invalid-value"'
    );
  });
});

function setup({
  diagnosticsResult = mockWorkflowDiagnosticsResult,
}: {
  diagnosticsResult?: any;
}) {
  const user = userEvent.setup();
  const defaultProps = {
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
    diagnosticsResult,
  };

  const view = render(<WorkflowDiagnosticsJson {...defaultProps} />);
  return { user, ...view };
}
