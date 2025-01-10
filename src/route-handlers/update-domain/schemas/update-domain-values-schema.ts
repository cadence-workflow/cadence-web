import { z } from 'zod';

import { ArchivalStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/ArchivalStatus';

import { type UpdateDomainFields } from '../update-domain.types';

const updateDomainValuesSchema = (
  z.object({
    description: z.string(),
    ownerEmail: z.string(),
    data: z.record(z.string(), z.string()),
    workflowExecutionRetentionPeriod: z.object({
      seconds: z.number(),
      nanos: z.number().optional(),
    }),
    // TODO @adhitya.mamallan - revisit this when working with bad binaries
    badBinaries: z.never(),
    historyArchivalStatus: z.nativeEnum(ArchivalStatus),
    historyArchivalUri: z.string(),
    visibilityArchivalStatus: z.nativeEnum(ArchivalStatus),
    visibilityArchivalUri: z.string(),
    activeClusterName: z.string(),
    clusters: z.array(z.object({ clusterName: z.string() })),
    deleteBadBinary: z.string(),
    failoverTimeout: z.object({
      seconds: z.number(),
      nanos: z.number().optional(),
    }),
  }) satisfies z.ZodSchema<Required<UpdateDomainFields>>
).partial();

export default updateDomainValuesSchema;
