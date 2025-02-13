import * as grpc from '@grpc/grpc-js';
import type { ServiceClient } from '@grpc/grpc-js/build/src/make-client';
import * as protoLoader from '@grpc/proto-loader';
import get from 'lodash/get';
import merge from 'lodash/merge';

import GRPC_PROTO_DIR_BASE_PATH from '@/config/grpc/grpc-proto-dir-base-path';

import { GRPCError, type GRPCInputError } from './grpc-error';

const MAX_MESSAGE_SIZE = 64 * 1024 * 1024; //TODO: make this configurable for oss
const GRPC_OPTIONS = {
  'grpc.max_send_message_length': MAX_MESSAGE_SIZE,
  'grpc.max_receive_message_length': MAX_MESSAGE_SIZE,
};

export type GRPCMetadata = Record<string, string | never>;

export type GRPCRequestConfig = {
  serviceName: string;
  metadata?: GRPCMetadata;
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

  request<Req, Res>({
    method,
    metadata: methodMetadata,
  }: {
    method: string;
    metadata?: GRPCMetadata;
  }) {
    return (
      payload: Req,
      { metadata: reqMetadata }: { metadata?: GRPCMetadata } = {}
    ) => {
      const deadline = new Date();
      const metadata = merge({}, methodMetadata || {}, reqMetadata || {});
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
            this.meta(metadata),
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

  meta(reqMetadata?: GRPCMetadata) {
    const meta = new grpc.Metadata();
    const headers = merge(
      {
        'rpc-service': this.requestConfig.serviceName,
        'rpc-caller': 'cadence-web',
        'rpc-encoding': 'proto',
      },
      this.requestConfig.metadata,
      reqMetadata
    );
    Object.entries(headers).forEach(([key, value]) => {
      if (value) {
        meta.add(key, value);
      }
    });

    return meta;
  }
}

export default GRPCService;
