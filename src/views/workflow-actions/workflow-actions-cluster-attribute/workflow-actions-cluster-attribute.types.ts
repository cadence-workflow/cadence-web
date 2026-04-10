import { type ClusterAttributeScope } from '@/__generated__/proto-ts/uber/cadence/api/v1/ClusterAttributeScope';

export type ClusterAttributeValue = {
  scope: string;
  name: string;
};

export type Props = {
  clusterAttributesByScope: Record<string, ClusterAttributeScope>;
  value?: ClusterAttributeValue;
  onChange: (value: ClusterAttributeValue | undefined) => void;
  error?: boolean;
};
