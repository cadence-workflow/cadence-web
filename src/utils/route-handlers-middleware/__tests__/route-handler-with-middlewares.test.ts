import { type NextRequest, NextResponse } from 'next/server';

import logger from '../../logger';
import routeHandlerWithMiddlewares from '../route-handler-with-middlewares';
import type {
  MiddlewareFunction,
  RequestHandlerFunction,
} from '../route-handlers-middleware.types';

jest.mock('@/utils/logger');

const mockRequest = {} as NextRequest;
const mockOptions = { params: {} };
const mockResponse = NextResponse.json({ message: 'Success' });

const mockRequestHandler: RequestHandlerFunction<any, any> = jest
  .fn()
  .mockResolvedValue(mockResponse);

describe('routeHandlerWithMiddlewares', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return response from middleware if it returns NextResponse', async () => {
    const mockMiddleware: MiddlewareFunction<any>[] = [
      jest.fn().mockResolvedValue(mockResponse),
    ];

    const result = await routeHandlerWithMiddlewares(
      mockRequestHandler,
      mockRequest,
      mockOptions,
      mockMiddleware
    );

    expect(result).toBe(mockResponse);
    expect(mockRequestHandler).not.toHaveBeenCalled();
  });

  it('should call request handler if no middleware returns NextResponse', async () => {
    const mockMiddleware: MiddlewareFunction<any>[] = [
      jest.fn().mockResolvedValue(['key', 'value']),
    ];

    const result = await routeHandlerWithMiddlewares(
      mockRequestHandler,
      mockRequest,
      mockOptions,
      mockMiddleware
    );

    expect(result).toBe(mockResponse);
    expect(mockRequestHandler).toHaveBeenCalledWith(mockRequest, mockOptions, {
      key: 'value',
    });
  });

  it('should log error and return error response if middleware throws', async () => {
    const mockError = new Error('Test error');
    const mockMiddleware: MiddlewareFunction<any>[] = [
      jest.fn().mockRejectedValue(mockError),
    ];

    const result = await routeHandlerWithMiddlewares(
      mockRequestHandler,
      mockRequest,
      mockOptions,
      mockMiddleware
    );

    expect(result).toBeInstanceOf(NextResponse);
    expect(result.status).toBe(500);
    expect(logger.error).toHaveBeenCalledWith(
      { cause: mockError },
      `Error in Middlewares: ${mockRequest.url}`
    );
    expect(mockRequestHandler).not.toHaveBeenCalled();
  });

  it('should call request handler with context if middleware returns context', async () => {
    const mockMiddleware: MiddlewareFunction<any>[] = [
      jest.fn().mockResolvedValue(['grpcClusterMethods', {}]),
    ];

    const result = await routeHandlerWithMiddlewares(
      mockRequestHandler,
      mockRequest,
      mockOptions,
      mockMiddleware
    );

    expect(result).toBe(mockResponse);
    expect(mockRequestHandler).toHaveBeenCalledWith(mockRequest, mockOptions, {
      grpcClusterMethods: {},
    });
  });
});
