import { type NextRequest, type NextResponse } from 'next/server';

import type routeHandlersDefaultMiddlewares from './config/route-handlers-default-middlewares.config';

export type MiddlewareContextReturn<K extends string = any, T = any> = [K, T];

export type MiddlewareReturn = NextResponse | [any, any] | null | undefined;

export type MiddlewareFunction<
  ReturnT extends MiddlewareReturn = MiddlewareReturn,
> = (
  request: NextRequest,
  options: { params: Record<string, string> },
  ctx: Record<string, unknown>
) => ReturnT;

export type GetAllMiddlewaresReturnTypes<M extends MiddlewareFunction[]> = {
  [K in keyof M]: M[K] extends MiddlewareFunction<infer ReturnT>
    ? ReturnT extends MiddlewareReturn
      ? ReturnT
      : never
    : never;
};

export type RequestHandlerFunction<
  MiddlewareFunctionsT extends MiddlewareFunction[],
  O extends { params: Record<string, string> },
> = (
  request: NextRequest,
  options: O,
  ctx: CombineMiddlewareContextType<
    GetAllMiddlewaresReturnTypes<MiddlewareFunctionsT>
  >
) => any;

type FilterValidMiddlewareContextTypes<M> = M extends [infer K, infer T]
  ? { [key in K & string]: T }
  : Record<string, never>; // Empty object if not valid

// Recursively combine the return values of middlewares into a single object
export type CombineMiddlewareContextType<
  M extends
    | readonly MiddlewareReturn[]
    | typeof routeHandlersDefaultMiddlewares,
> = M extends readonly [
  infer First,
  ...infer Rest extends readonly MiddlewareReturn[],
]
  ? FilterValidMiddlewareContextTypes<First> &
      CombineMiddlewareContextType<Rest>
  : Record<string, never>;

export type DefaultMiddlewaresContext = CombineMiddlewareContextType<
  GetAllMiddlewaresReturnTypes<typeof routeHandlersDefaultMiddlewares>
>;
