import { RequestError } from '@/utils/request/request-error';

import {
  type QueryJsonContent,
  type Props,
} from '../../workflow-queries-result-json.types';
import getQueryJsonContent from '../get-query-json-content';

describe(getQueryJsonContent.name, () => {
  const tests: Array<{
    name: string;
    props: Props;
    expected: QueryJsonContent;
  }> = [
    {
      name: 'returns undefined/false for the loading state',
      props: {
        data: undefined,
        loading: true,
        error: undefined,
      },
      expected: {
        content: undefined,
        isError: false,
      },
    },
    {
      name: 'returns an error message/true for the error state',
      props: {
        data: undefined,
        loading: false,
        error: new RequestError('Something went wrong', 500),
      },
      expected: {
        content: { message: 'Something went wrong' },
        isError: true,
      },
    },
    {
      name: 'returns workflow close status/true when the query is rejected',
      props: {
        data: {
          result: null,
          rejected: {
            closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED',
          },
        },
        loading: false,
        error: undefined,
      },
      expected: {
        content:
          'Workflow is closed with status WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED',
        isError: true,
      },
    },
    {
      name: 'returns data/false for the success state',
      props: {
        data: {
          result: {
            test: 'test',
          },
          rejected: null,
        },
        loading: false,
        error: undefined,
      },
      expected: {
        content: {
          test: 'test',
        },
        isError: false,
      },
    },
    {
      name: 'returns undefined for the empty state',
      props: {
        data: undefined,
        loading: false,
        error: undefined,
      },
      expected: {
        content: undefined,
        isError: false,
      },
    },
  ];

  tests.forEach((test) => {
    it(test.name, () => {
      expect(getQueryJsonContent(test.props)).toEqual(test.expected);
    });
  });
});
