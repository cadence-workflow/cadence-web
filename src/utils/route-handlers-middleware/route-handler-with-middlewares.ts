import { type NextRequest, NextResponse } from 'next/server';

import { GRPCError, getHTTPStatusCode } from '../grpc/grpc-error';
import logger from '../logger';

import type {
  CombineMiddlewareContextType,
  GetAllMiddlewaresReturnTypes,
  MiddlewareFunction,
  RequestHandlerFunction,
} from './route-handlers-middleware.types';

export default async function routeHandlersWithMiddlewares<
  M extends MiddlewareFunction[],
  Options extends { params: Record<string, string> },
>(
  requestHandler: RequestHandlerFunction<M, Options>,
  request: NextRequest,
  options: Omit<Options, 'params'> & {
    params: Options['params'] | Promise<Options['params']>;
  },
  middlewares: M
) {
  // Next.js 15 passes route params as a Promise; resolve once so that
  // middlewares and handlers keep receiving plain params.
  const resolvedOptions = {
    ...options,
    params: await options.params,
  } as Options;
  let ctx: Partial<
    CombineMiddlewareContextType<GetAllMiddlewaresReturnTypes<M>>
  > = {};
  for (const middlewareFunction of middlewares) {
    try {
      const result = await middlewareFunction(request, resolvedOptions, ctx);
      if (result instanceof NextResponse) {
        return result;
      } else if (Array.isArray(result) && typeof result[0] === 'string') {
        const [key, value] = result;
        ctx = {
          ...ctx,
          [key]: value,
        };
      }
    } catch (e) {
      logger.error({ error: e }, `Error in Middlewares: ${request.url}`);

      return NextResponse.json(
        {
          message:
            e instanceof GRPCError ? e.message : 'Failed to handle request',
          cause: e,
        },
        { status: getHTTPStatusCode(e) }
      );
    }
  }
  return requestHandler(
    request,
    resolvedOptions,
    ctx as CombineMiddlewareContextType<GetAllMiddlewaresReturnTypes<M>>
  );
}
