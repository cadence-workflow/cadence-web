import { ActiveClusterSelectionStrategy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ActiveClusterSelectionStrategy';

/**
 * Normalizes a raw ActiveClusterSelectionPolicy before schema validation: returns null
 * when clusterAttribute is absent, otherwise returns the clusterAttribute with a hardcoded
 * INVALID strategy.
 *
 * In the new active-active design the policy is identified solely by clusterAttribute, so an
 * empty object means no policy (null). strategy is a legacy field, removed from the IDL upstream
 * but still typed as required by the current codegen, so we keep hardcoding it to INVALID. Drop
 * the strategy handling once the new IDL is pulled in.
 *
 * @see https://github.com/cadence-workflow/cadence-idl/pull/264
 */
export default function preprocessActiveClusterSelectionPolicy(data: unknown) {
  const clusterAttribute =
    data && typeof data === 'object' && 'clusterAttribute' in data
      ? data.clusterAttribute
      : null;

  if (!clusterAttribute) {
    return null;
  }

  return {
    clusterAttribute,
    strategy:
      ActiveClusterSelectionStrategy.ACTIVE_CLUSTER_SELECTION_STRATEGY_INVALID,
  };
}
