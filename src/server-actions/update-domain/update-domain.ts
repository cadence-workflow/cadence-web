'use server';

import { snakeCase } from 'lodash';

import ADMIN_SECURITY_TOKEN from '@/config/auth/admin-security-token';
import * as grpcClient from '@/utils/grpc/grpc-client';

import updateDomainValuesSchema from './schemas/update-domain-values-schema';
import { type Params, type UpdateDomainResponse } from './update-domain.types';

export default async function updateDomain(
  params: Params
): Promise<UpdateDomainResponse> {
  const { data: values, error } = updateDomainValuesSchema.safeParse(
    params.values
  );
  if (error) {
    throw new Error('Invalid values: ' + error.message);
  }

  try {
    const res = await grpcClient
      .getClusterMethods(params.cluster)
      .updateDomain({
        ...values,
        name: params.domain,
        securityToken: ADMIN_SECURITY_TOKEN,
        updateMask: {
          paths: Object.keys(values).map(snakeCase),
        },
      });

    if (!res.domain) {
      throw new Error('Received empty response');
    }
    return res.domain;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Unknown');
  }
}
