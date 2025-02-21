import type logger from '.';

export type Logger = typeof logger;

export type RouteHandlerErrorPayload = {
  cause?: any;
  requestParams?: object;
  queryParams?: object;
};
