import {
  type Path,
  type http,
  type HttpResponseResolver,
  type JsonBodyType,
} from 'msw';

export type HttpEndpointMock = {
  path: Path;
  httpMethod: Uppercase<keyof typeof http>;
  jsonResponse?: JsonBodyType;
  httpResolver?: HttpResponseResolver;
  mockOnce?: boolean;
};

export type Props = {
  endpointsMocks?: Array<HttpEndpointMock>;
};
