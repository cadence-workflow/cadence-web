import { Suspense } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { HttpResponse } from 'msw';

import { render, screen } from '@/test-utils/rtl';

import { type AuthMeResponse } from '@/utils/auth/auth.types';

import useUserInfo, { userInfoQueryOptions } from '../use-user-info';

const mockAuthMeResponse: AuthMeResponse = {
  authEnabled: false,
  authStrategy: 'disabled',
  auth: { isValidToken: false },
  isAdmin: false,
};

function QueryConsumer() {
  const { data } = useUserInfo();
  return <div>{data ? 'query-loaded' : 'query-loading'}</div>;
}

function SuspenseConsumer() {
  const { data } = useSuspenseQuery(userInfoQueryOptions());
  return <div>{data ? 'suspense-loaded' : null}</div>;
}

describe('userInfoQueryOptions', () => {
  it('pins the shared auth-me query key', () => {
    expect(userInfoQueryOptions().queryKey).toEqual(['auth-me']);
  });

  it('shares a single /api/auth/me request between concurrent query and suspense consumers', async () => {
    const { requestSpy } = setup();

    expect(await screen.findByText('query-loaded')).toBeInTheDocument();
    expect(await screen.findByText('suspense-loaded')).toBeInTheDocument();
    expect(requestSpy).toHaveBeenCalledTimes(1);
  });
});

function setup() {
  const requestSpy = jest.fn();
  render(
    <>
      <QueryConsumer />
      <Suspense fallback={null}>
        <SuspenseConsumer />
      </Suspense>
    </>,
    {
      endpointsMocks: [
        {
          path: '/api/auth/me',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            requestSpy();
            return HttpResponse.json(mockAuthMeResponse);
          },
        },
      ],
    }
  );
  return { requestSpy };
}
