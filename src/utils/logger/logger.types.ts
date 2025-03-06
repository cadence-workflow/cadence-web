import type logger from '.';

export type Logger = typeof logger;

export type RouteHandlerErrorPayload = {
  error?: any;
  requestParams?: object;
  queryParams?: object;
};
