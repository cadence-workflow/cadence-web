import { HttpResponse, http } from 'msw';

import { server } from '@/utils/msw/node';

import { type HttpEndpointMock } from '../msw-mock-handlers.types';

export default function mswMockEndpoints(
  endpointsMocks: Array<HttpEndpointMock>
) {
  if (endpointsMocks?.length) {
    const handlers = endpointsMocks.map((m) => {
      const method = m.httpMethod.toLowerCase() as Lowercase<
        typeof m.httpMethod
      >;
      if (m.httpResolver)
        return http[method](m.path, m.httpResolver, {
          once: m.mockOnce ?? true,
        });
      else
        return http[method](m.path, () => HttpResponse.json(m.jsonResponse), {
          once: m.mockOnce ?? true,
        });
    });
    server.use(...handlers);
  }
}
