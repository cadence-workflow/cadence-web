import React from 'react';

import { render, screen, waitFor } from '@/test-utils/rtl';

import AsyncPropsLoader from '../async-props-loader';

const MockComponent = (props: any) => <div>{JSON.stringify(props)}</div>;

const mockedFetchReturnValues = { message: 'Test Message' };
const mockFetchProps = jest.fn().mockResolvedValue(mockedFetchReturnValues);

describe('AsyncPropsLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls the getAsyncProps function', async () => {
    const jsxAsyncPropsLoader = await AsyncPropsLoader({
      component: MockComponent,
      getAsyncProps: mockFetchProps,
    });
    render(jsxAsyncPropsLoader);

    // Wait for async props to be resolved
    await waitFor(() => {
      expect(mockFetchProps).toHaveBeenCalledTimes(1);
    });
  });

  it('renders the component with exact props returned from getAsyncProps', async () => {
    const jsxAsyncPropsLoader = await AsyncPropsLoader({
      component: MockComponent,
      getAsyncProps: mockFetchProps,
    });

    render(jsxAsyncPropsLoader);

    // Wait for async props to be resolved
    await waitFor(() => {
      expect(mockFetchProps).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByText(JSON.stringify(mockedFetchReturnValues))
    ).toBeInTheDocument();
  });
});
