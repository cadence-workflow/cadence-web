import { type ClusterConfig } from '@/config/dynamic/resolvers/clusters.types';

import getConfigValue from '../../config/get-config-value';
import { getClusterMethods } from '../grpc-client';
import GRPCService from '../grpc-service';

jest.mock('../grpc-service');
jest.mock('../../config/get-config-value');

// services are cached per cluster name, so each setup uses its own cluster
let clusterCount = 0;
const getMockCluster = (): ClusterConfig => ({
  clusterName: `batch-test-cluster-${clusterCount++}`,
  grpc: {
    peer: 'localhost:7833',
    serviceName: 'cadence-frontend',
  },
});

const BATCH_METHODS = [
  ['startBatchOperation', 'StartBatchOperation'],
  ['describeBatchOperation', 'DescribeBatchOperation'],
  ['listBatchOperations', 'ListBatchOperations'],
  ['stopBatchOperation', 'StopBatchOperation'],
  ['updateBatchOperation', 'UpdateBatchOperation'],
] as const;

describe(getClusterMethods.name, () => {
  it('creates the batch service from the BatchAPI proto', async () => {
    const { cluster } = await setup({});

    expect(GRPCService).toHaveBeenCalledWith(
      expect.objectContaining({
        peer: cluster.grpc.peer,
        schemaPath: 'uber/cadence/api/v1/service_batch.proto',
        servicePath: 'uber.cadence.api.v1.BatchAPI',
      })
    );
  });

  it.each(BATCH_METHODS)(
    'maps %s to the %s rpc and passes the metadata through',
    async (clusterMethod, rpcMethod) => {
      const { methods } = await setup({ metadata: { key: 'value' } });

      expect(methods[clusterMethod]).toEqual({
        method: rpcMethod,
        metadata: { key: 'value' },
      });
    }
  );

  it('leaves the batch method metadata undefined when none is provided', async () => {
    const { methods } = await setup({});

    expect(methods.startBatchOperation).toEqual({
      method: 'StartBatchOperation',
      metadata: undefined,
    });
  });
});

async function setup({ metadata }: { metadata?: Record<string, string> }) {
  const cluster = getMockCluster();
  jest.mocked(getConfigValue).mockResolvedValue([cluster]);
  // each mocked service echoes the request config it was asked to build
  jest.mocked(GRPCService).mockImplementation(function (this: GRPCService) {
    this.request = jest.fn((requestConfig) => requestConfig) as never;
    return this;
  } as never);

  const methods = await getClusterMethods(cluster.clusterName, metadata);
  return { cluster, methods };
}
