import { type CliCommandConfig } from '../workflow-page-cli-commands-modal/workflow-page-cli-commands-modal.types';

const workflowPageCliCommandsConfig: CliCommandConfig[] = [
  {
    label: 'Register a domain (local only)',
    command:
      'cadence --domain {domain-name} domain register --global_domain false',
    group: 'domain',
  },
  {
    label: 'List domain settings',
    command:
      'cadence --env {staging|prod|prod02} --domain {domain-name} domain describe',
    group: 'domain',
  },
  {
    label: 'Update domain active cluster',
    description: 'Make sure the domain_data has UberIgnoringLisa:true',
    command:
      'cadence --env {staging|prod|prod02} --domain {domain-name} domain update -active_cluster {cluster-name}',
    group: 'domain',
  },
  {
    label: 'Update domain bad binary',
    command:
      'cadence --env {staging|prod|prod02} --domain {domain-name} domain update --add_bad_binary {bad-binary-SHA} --reason \'"{reason}"\'',
    group: 'domain',
  },
  // workflow commands
  {
    label: 'Run a workflow',
    command:
      'cadence --env {staging|prod|prod02} --domain {domain-name} workflow run --tl {task-list-name} --wt {workflow-type-name} --et 60 -i \'"{input-string}"\'',
    group: 'workflow',
  },
  {
    label: 'See workflow settings',
    command:
      'cadence --env {staging|prod|prod02} --domain {domain-name} workflow describe -w {workflow-id} -r {run-id}',
    group: 'workflow',
  },
  {
    label: 'See workflow history',
    command:
      'cadence --env {staging|prod|prod02} --domain {domain-name} workflow show -w {workflow-id} -r {run-id}',
    group: 'workflow',
  },
  {
    label: 'Signal a workflow',
    command:
      'cadence --env {staging|prod|prod02} --domain {domain-name} workflow signal -w {workflow-id} -r {run-id} --name {signal-name} --input \'"{signal-payload}"\'',
    group: 'workflow',
  },
  {
    label: 'Reset a workflow',
    command:
      'cadence workflow reset -w {workflow-id} -r {run-id} --event_id {event-id} --reason \'"{reason}"\' --reset_type {reset-type} --reset_bad_binary_checksum {bad-binary-SHA}',
    description: `Use event_id to reset from specific event or reset_type with one of the following values BadBinary, DecisionCompletedTime, FirstDecisionScheduled, FirstDecisionCompleted, LastDecisionScheduled, LastDecisionCompleted, LastContinuedAsNew`,
    group: 'workflow',
  },
  {
    label: 'Reset a batch of workflows',
    command:
      'cadence workflow reset-batch --query \'"{query}"\' --only_non_deterministic --reason \'"{reason}"\' --reset_type {reset-type}',
    description: `Where query can be any query that returns a list of workflows and reset_type can be BadBinary, DecisionCompletedTime, FirstDecisionScheduled, FirstDecisionCompleted, LastDecisionScheduled, LastDecisionCompleted, LastContinuedAsNew`,
    group: 'workflow',
  },
  {
    label: 'Restart a workflow',
    command: 'cadence workflow restart -w {workflow-id} -r {run-id}',
    description:
      'Starts a new execution using the same input & terminates previous execution',
    group: 'workflow',
  },
  {
    label: 'List closed workflows',
    command:
      'cadence --env {staging|prod|prod02} --domain {domain-name} workflow {list|listall}',
    group: 'workflow',
  },
  {
    label: 'List open workflows',
    command:
      'cadence --env {staging|prod|prod02} --domain {domain-name} workflow {list|listall} --open',
    group: 'workflow',
  },
  {
    label: 'Query for a workflow',
    command:
      'cadence workflow {list|listall} --query \'(CustomKeywordField = "keyword1" and CustomIntField >= 5) or CustomKeywordField = "keyword2" and CloseTime = missing\'',
    group: 'workflow',
  },
];

export default workflowPageCliCommandsConfig;
