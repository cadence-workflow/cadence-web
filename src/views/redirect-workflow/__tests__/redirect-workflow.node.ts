import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import request from '@/utils/request';
import { RequestError } from '@/utils/request/request-error';

import RedirectWorkflow from '../redirect-workflow';

jest.mock('@/utils/request', () => jest.fn());

const mockRequest = jest.mocked(request);

const mockRedirect = jest.fn();
jest.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    // Server component stops rendering after a redirect is called
    throw new Error('Redirected');
  },
  notFound: () => {
    // Server component stops rendering after notFound is called
    throw new Error('Not found');
  },
}));

function mockDescribeWorkflowResponse(runId: string | null) {
  mockRequest.mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      workflowExecutionInfo: {
        workflowExecution: { runId },
      },
    } as Partial<DescribeWorkflowResponse>),
  } as any);
}

describe(RedirectWorkflow.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const tests: Array<{
    name: string;
    urlParams: Array<string>;
    queryParams?: { [key: string]: string | string[] | undefined };
    assertOnError?: (e: Error) => void;
    expectedRedirect?: string;
    expectedRequestUrl?: string;
  }> = [
    {
      name: 'should redirect to the current run',
      urlParams: ['mock-domain', 'mock-cluster', 'mock-wfid'],
      expectedRedirect:
        '/domains/mock-domain/mock-cluster/workflows/mock-wfid/mock-runid',
      expectedRequestUrl:
        '/api/domains/mock-domain/mock-cluster/workflows/mock-wfid',
    },
    {
      name: 'should redirect to a specific tab of the current run',
      urlParams: ['mock-domain', 'mock-cluster', 'mock-wfid', 'history'],
      expectedRedirect:
        '/domains/mock-domain/mock-cluster/workflows/mock-wfid/mock-runid/history',
    },
    {
      name: 'should redirect with query params preserved',
      urlParams: ['mock-domain', 'mock-cluster', 'mock-wfid', 'history'],
      queryParams: {
        hs: 'COMPLETED',
        ht: 'ACTIVITY',
      },
      expectedRedirect:
        '/domains/mock-domain/mock-cluster/workflows/mock-wfid/mock-runid/history?hs=COMPLETED&ht=ACTIVITY',
    },
    {
      name: 'should encode special characters exactly once',
      urlParams: ['mock domain', 'mock-cluster', 'mock/wfid@1'],
      expectedRedirect:
        '/domains/mock%20domain/mock-cluster/workflows/mock%2Fwfid%401/mock-runid',
      expectedRequestUrl:
        '/api/domains/mock%20domain/mock-cluster/workflows/mock%2Fwfid%401',
    },
  ];

  tests.forEach((test) =>
    it(test.name, async () => {
      mockDescribeWorkflowResponse('mock-runid');

      try {
        await RedirectWorkflow({
          params: { workflowParams: test.urlParams },
          searchParams: test.queryParams ?? undefined,
        });
      } catch (e) {
        if (e instanceof Error && e.message !== 'Redirected') {
          expect(test.assertOnError).toBeDefined();
          test.assertOnError?.(e);
        } else if (e instanceof Error && e.message === 'Redirected') {
          expect(mockRedirect).toHaveBeenCalledWith(test.expectedRedirect);
        } else {
          throw new Error(
            `test failure: ${e instanceof Error ? e.message : 'unknown reason'}`
          );
        }
      }

      if (test.expectedRequestUrl) {
        expect(mockRequest).toHaveBeenCalledWith(test.expectedRequestUrl);
      }
    })
  );

  it('should call notFound if the workflow is not found', async () => {
    mockRequest.mockRejectedValue(
      new RequestError('Not found', '/api/mock-url', 404)
    );

    await expect(
      RedirectWorkflow({
        params: {
          workflowParams: ['mock-domain', 'mock-cluster', 'mock-wfid'],
        },
      })
    ).rejects.toThrow('Not found');
  });

  it('should call notFound if the response has no runId', async () => {
    mockDescribeWorkflowResponse(null);

    await expect(
      RedirectWorkflow({
        params: {
          workflowParams: ['mock-domain', 'mock-cluster', 'mock-wfid'],
        },
      })
    ).rejects.toThrow('Not found');
  });

  it('should rethrow non-404 request errors', async () => {
    mockRequest.mockRejectedValue(
      new RequestError('Internal error', '/api/mock-url', 500)
    );

    await expect(
      RedirectWorkflow({
        params: {
          workflowParams: ['mock-domain', 'mock-cluster', 'mock-wfid'],
        },
      })
    ).rejects.toThrow('Internal error');
  });

  it('should throw if the workflow URL params are incomplete', async () => {
    await expect(
      RedirectWorkflow({
        params: { workflowParams: ['mock-domain', 'mock-cluster'] },
      })
    ).rejects.toThrow('Invalid workflow URL param');
    expect(mockRequest).not.toHaveBeenCalled();
  });
});
