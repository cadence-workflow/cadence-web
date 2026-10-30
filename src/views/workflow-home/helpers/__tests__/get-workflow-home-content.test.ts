import { type RequestError } from '@/utils/request/request-error';

import getWorkflowHomeContent from '../get-workflow-home-content';

const homePageResponse = {
  result: {
    cadenceResponseType: 'formattedData',
    format: 'text/markdown',
    data: '# Hello',
  },
  rejected: null,
};

describe(getWorkflowHomeContent.name, () => {
  it('returns disabled when the feature is disabled', () => {
    expect(setup({ isEnabled: false })).toEqual({ state: 'disabled' });
  });

  it('returns archived for archived workflows', () => {
    expect(setup({ isArchived: true })).toEqual({ state: 'archived' });
  });

  it('returns not-set-up when the error lists the known query types', () => {
    expect(
      setup({
        homeQuery: {
          error: {
            message:
              'unknown queryType home. KnownQueryTypes=[__stack_trace other]',
          } as RequestError,
        },
      })
    ).toEqual({ state: 'not-set-up' });
  });

  it('returns not-set-up when the known query types list is empty', () => {
    expect(
      setup({
        homeQuery: {
          error: {
            message: 'unknown queryType. KnownQueryTypes=[]',
          } as RequestError,
        },
      })
    ).toEqual({ state: 'not-set-up' });
  });

  it('returns loading while the home page query loads', () => {
    expect(setup({ homeQuery: { isLoading: true } })).toEqual({
      state: 'loading',
    });
  });

  it('returns loading when the home page query has not started', () => {
    expect(setup({ homeQuery: {} })).toEqual({ state: 'loading' });
  });

  it('returns an error when the home page query fails', () => {
    expect(
      setup({
        homeQuery: { error: { message: 'timeout' } as RequestError },
      })
    ).toEqual({ state: 'error', description: 'timeout' });
  });

  it('returns an error when the home page query is rejected', () => {
    expect(
      setup({
        homeQuery: {
          data: {
            result: null,
            rejected: { closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED' },
          },
        },
      })
    ).toEqual({
      state: 'error',
      description:
        'The workflow is closed with status WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
    });
  });

  it('returns invalid-format when the result is not a home page', () => {
    expect(
      setup({
        homeQuery: { data: { result: { a: 1 }, rejected: null } },
      }).state
    ).toBe('invalid-format');
  });

  it('returns invalid-format for a text/plain result', () => {
    expect(
      setup({
        homeQuery: {
          data: {
            result: {
              cadenceResponseType: 'formattedData',
              format: 'text/plain',
              data: '# Hello',
            },
            rejected: null,
          },
        },
      }).state
    ).toBe('invalid-format');
  });

  it('returns invalid-format when the result is null', () => {
    expect(
      setup({
        homeQuery: { data: { result: null, rejected: null } },
      }).state
    ).toBe('invalid-format');
  });

  it('keeps the last good page when a background refetch fails', () => {
    expect(
      setup({
        homeQuery: {
          data: homePageResponse,
          error: { message: 'timeout' } as RequestError,
        },
      })
    ).toEqual({ state: 'ready', content: '# Hello' });
  });

  it('returns ready with the content', () => {
    expect(setup({})).toEqual({ state: 'ready', content: '# Hello' });
  });

  it('returns ready with the title', () => {
    expect(
      setup({
        homeQuery: {
          data: {
            ...homePageResponse,
            result: {
              ...homePageResponse.result,
              data: '# Hello',
              title: 'My page',
            },
          },
        },
      })
    ).toEqual({ state: 'ready', content: '# Hello', title: 'My page' });
  });
});

function setup(
  overrides: Partial<Parameters<typeof getWorkflowHomeContent>[0]>
) {
  return getWorkflowHomeContent({
    isEnabled: true,
    isArchived: false,
    homeQuery: { data: homePageResponse },
    ...overrides,
  });
}
