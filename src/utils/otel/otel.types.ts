import { type Sampler } from '@opentelemetry/api';

export type OtelRegisterConfig = {
  sampler?: Sampler;
};
