import { ZodError } from 'zod';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { mockWorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/__fixtures__/mock-workflow-diagnostics-result';
import { type DiagnoseWorkflowResponse } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';

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

const mockDiagnosticsResponse = {
  result: mockWorkflowDiagnosticsResult,
  parsingError: null,
};

describe(WorkflowDiagnosticsJson.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the PrettyJson component with diagnostics result', () => {
    setup({});
    expect(screen.getByTestId('pretty-json')).toBeInTheDocument();
    expect(screen.getByTestId('pretty-json')).toHaveTextContent(
      '"DiagnosticsResult"'
    );
  });

  it('renders copy text button with text to copy', () => {
    setup({});
    const copyButton = screen.getByTestId('copy-text-button');
    expect(copyButton).toBeInTheDocument();
    expect(copyButton).toHaveTextContent('"DiagnosticsResult"');
  });

  it('downloads JSON when download button is clicked', async () => {
    const { user } = setup({});
    const downloadButton = screen.getByTestId('download-json-button');
    await user.click(downloadButton);

    expect(mockDownloadJson).toHaveBeenCalledWith(
      mockDiagnosticsResponse.result,
      'diagnostics_test-workflow-id_test-run-id'
    );
  });

  it('renders with empty diagnostics result', () => {
    setup({
      diagnosticsResponse: {
        result: {
          DiagnosticsResult: {},
          DiagnosticsCompleted: true,
        },
        parsingError: null,
      },
    });

    expect(screen.getByTestId('pretty-json')).toBeInTheDocument();
    expect(screen.getByTestId('pretty-json')).toHaveTextContent(
      '"DiagnosticsResult"'
    );
  });

  it('renders JSON even if there is a parsing error', () => {
    setup({
      diagnosticsResponse: {
        result: {
          DiagnosticsResult: {
            invalidParsedField: 'invalid-value',
          },
          DiagnosticsCompleted: true,
        },
        parsingError: new ZodError([]),
      },
    });

    expect(screen.getByTestId('pretty-json')).toBeInTheDocument();
    expect(screen.getByTestId('pretty-json')).toHaveTextContent(
      '"invalid-value"'
    );
  });
});

function setup({
  diagnosticsResponse = mockDiagnosticsResponse,
}: {
  diagnosticsResponse?: DiagnoseWorkflowResponse;
}) {
  const user = userEvent.setup();
  const defaultProps = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
    diagnosticsResponse,
  };

  const view = render(<WorkflowDiagnosticsJson {...defaultProps} />);
  return { user, ...view };
}
