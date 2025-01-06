import { RequestError } from '@/utils/request/request-error';

import getArchivalErrorPanelProps from '../get-archival-error-panel-props';

describe(getArchivalErrorPanelProps.name, () => {
  it('returns default error panel props for regular error', () => {
    expect(
      getArchivalErrorPanelProps({
        inputType: 'search',
        error: new RequestError('Test error', 500),
        queryString: 'mock_query_string',
      })
    ).toEqual({
      message: 'Failed to fetch archived workflows',
      actions: [{ kind: 'retry', label: 'Retry' }],
    });
  });

  it('returns error message directly for bad request error for queries', () => {
    expect(
      getArchivalErrorPanelProps({
        inputType: 'query',
        error: new RequestError('Incorrect query', 400),
        queryString: 'mock_query_string',
      })
    ).toEqual({
      message: 'Error in query: Incorrect query',
    });
  });

  it('returns custom error message for empty query', () => {
    expect(
      getArchivalErrorPanelProps({
        inputType: 'query',
        error: new RequestError('Incorrect query', 400),
        queryString: '',
      })
    ).toEqual({
      message: 'Please enter a valid query with a CloseTime filter',
    });
  });
});
