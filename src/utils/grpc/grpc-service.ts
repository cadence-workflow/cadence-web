// Copyright (c) 2022-2023 Uber Technologies Inc.
//
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import get from 'lodash/get';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import type { ServiceClient } from '@grpc/grpc-js/build/src/make-client';
import GRPC_PROTO_DIR_BASE_PATH from '@/configs/grpc/grpc-proto-dir-base-path';

const MAX_MESSAGE_SIZE = 64 * 1024 * 1024; //TODO: make this configurable for oss
const GRPC_OPTIONS = {
  'grpc.max_send_message_length': MAX_MESSAGE_SIZE,
  'grpc.max_receive_message_length': MAX_MESSAGE_SIZE,
};
const GRPC_ERROR_STATUS_TO_HTTP_ERROR_CODE_MAP: { [index: string]: number } = {
  [grpc.status.INVALID_ARGUMENT]: 400,
  [grpc.status.OUT_OF_RANGE]: 400,
  [grpc.status.FAILED_PRECONDITION]: 400,
  [grpc.status.UNAUTHENTICATED]: 401,
  [grpc.status.PERMISSION_DENIED]: 403,
  [grpc.status.NOT_FOUND]: 404,
  [grpc.status.UNIMPLEMENTED]: 404,
  [grpc.status.UNAVAILABLE]: 503,
  [grpc.status.DEADLINE_EXCEEDED]: 504,
};

export type GRPCRequestConfig = {
  serviceName: string;
  metadata?: Record<string, string>
}
export type GRPCServiceConfig = {
  peer: string;
  requestConfig: GRPCRequestConfig;
  schemaPath: string;
  servicePath: string;
}

class GRPCService {
  service: ServiceClient;
  requestConfig: GRPCRequestConfig;
  constructor({ peer, requestConfig, schemaPath, servicePath }: GRPCServiceConfig) {
    const ServiceDefinition: any = get(
      grpc.loadPackageDefinition(
        protoLoader.loadSync(schemaPath, {
          bytes: String,
          enums: String,
          longs: String,
          defaults: true,
          includeDirs: [GRPC_PROTO_DIR_BASE_PATH],
          oneofs: true,
        })
      ),
      servicePath
    );
    this.service = new ServiceDefinition(
      peer,
      grpc.credentials.createInsecure(),
      GRPC_OPTIONS
    );
    this.requestConfig = requestConfig;
  }

  request({
    formatRequest = (req) => req,
    formatResponse = (res) => res,
    method,
    transform = (payload) => payload,
  }: {
    method: string,
    formatRequest?: (req: any) => any,
    formatResponse?: (res: any) => any,
    transform?: (payload: any) => any,
  }) {
    return (payload: any) => {
      const deadline = new Date();

      deadline.setSeconds(deadline.getSeconds() + 2);
      return new Promise((resolve, reject) => {

        this.service.waitForReady(deadline, error => {
          if (error) {
            return reject(error);
          }

          deadline.setSeconds(deadline.getSeconds() + 50);
          this.service[method](
            formatRequest(transform(payload)),
            this.meta(),
            { deadline },
            (error: Error & { details: string, message: string, code: number }, response: any) => {
              try {
                if (error) {
                  const customError: Error & { httpStatusCode?: number, grpcStatusCode?: number } = new Error(error?.details || error?.message || response?.body || response)
                  customError.httpStatusCode = GRPC_ERROR_STATUS_TO_HTTP_ERROR_CODE_MAP[error.code] || 500;
                  customError.grpcStatusCode = error.code;
                  throw customError;
                }
                return resolve(formatResponse(response));
              } catch (e) {
                reject(e);
              }
            }
          );
        });
      });
    };
  }

  close() {
    grpc.getClientChannel(this.service).close();
  }

  meta() {
    const meta = new grpc.Metadata();
    meta.add('rpc-service', this.requestConfig.serviceName);
    meta.add('rpc-caller', 'cadence-web');
    meta.add('rpc-encoding', 'proto');
    Object.entries(this.requestConfig.metadata || {}).forEach(([key, value]) => {
      meta.add(key, value);
    });
    /* Object.entries(this.ctx.authTokenHeaders || {}).forEach(([key, value]) => {
       meta.add(key, value);
     });
 */
    return meta;
  }
}

export default GRPCService;
