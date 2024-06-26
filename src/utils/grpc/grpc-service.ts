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

import * as grpc from '@grpc/grpc-js';
import type { ServiceClient } from '@grpc/grpc-js/build/src/make-client';
import * as protoLoader from '@grpc/proto-loader';
import get from 'lodash/get';

import GRPC_PROTO_DIR_BASE_PATH from '@/config/grpc/grpc-proto-dir-base-path';

import { GRPCError, type GRPCInputError } from './grpc-error';

const MAX_MESSAGE_SIZE = 64 * 1024 * 1024; //TODO: make this configurable for oss
const GRPC_OPTIONS = {
  'grpc.max_send_message_length': MAX_MESSAGE_SIZE,
  'grpc.max_receive_message_length': MAX_MESSAGE_SIZE,
};

export type GRPCRequestConfig = {
  serviceName: string;
  metadata?: Record<string, string>;
};
export type GRPCServiceConfig = {
  peer: string;
  requestConfig: GRPCRequestConfig;
  schemaPath: string;
  servicePath: string;
};

class GRPCService {
  service: ServiceClient;
  requestConfig: GRPCRequestConfig;
  constructor({
    peer,
    requestConfig,
    schemaPath,
    servicePath,
  }: GRPCServiceConfig) {
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

  request<Req, Res>({ method }: { method: string }) {
    return (payload: Req) => {
      const deadline = new Date();

      deadline.setSeconds(deadline.getSeconds() + 2);
      return new Promise<Res>((resolve, reject) => {
        this.service.waitForReady(deadline, (error) => {
          if (error) {
            return reject(
              new GRPCError('Server unavailable', {
                cause: error,
                grpcStatusCode: grpc.status.UNAVAILABLE,
              })
            );
          }

          deadline.setSeconds(deadline.getSeconds() + 50);
          this.service[method](
            payload,
            this.meta(),
            { deadline },
            (error: GRPCInputError, response: any) => {
              try {
                if (error) {
                  throw new GRPCError(
                    error?.details ||
                      error?.message ||
                      response?.body ||
                      response,
                    {
                      grpcStatusCode: error.code,
                    }
                  );
                }
                return resolve(response);
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
    Object.entries(this.requestConfig.metadata || {}).forEach(
      ([key, value]) => {
        meta.add(key, value);
      }
    );
    /* Object.entries(this.ctx.authTokenHeaders || {}).forEach(([key, value]) => {
       meta.add(key, value);
     });
 */
    return meta;
  }
}

export default GRPCService;
