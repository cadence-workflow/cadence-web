const content = `# Cadence Markdown Guide

This guide provides examples of how to use markdown to interact with Cadence workflows. 
You can use markdown format in your workflow queries to return actionable content. 
You can find an example in [cadence-samples repository](https://github.com/cadence-workflow/cadence-samples/tree/master/new_samples) under the query sample.
Learn more about Cadence markdown in [Cadence Docs](https://cadenceworkflow.io).

It can also be used as a test page to see if the markdown rendering is working correctly. 
If you see buttons for workflow start and signal, then the markdown rendering is working correctly. 

Cadence markdown support is implemented using [Markdoc](https://markdoc.io/). 
Markdoc is a markdown parser and renderer that is used to safely render the markdown content.
---

## Start Workflow

Start new workflow executions.

##### Usage:

\`\`\`markdown
{% start
  workflowType="cadence_samples.HelloWorldWorkflow"
  label="Start a HelloWorld Workflow"
  domain="cadence-samples"
  cluster="cluster0"
  taskList="cadence-samples-worker"
  sdkLanguage="GO"
  input={message: "Cadence"}
  timeoutSeconds=7200
/%}
\`\`\`

{% start
  workflowType="cadence_samples.HelloWorldWorkflow"
  label="Start a HelloWorld Workflow"
  domain="cadence-samples"
  cluster="cluster0"
  taskList="cadence-samples-worker"
  sdkLanguage="GO"
  input={message: "Cadence"}
  timeoutSeconds=7200
/%}

### Start Attributes

**Required:**
- \`workflowType\` - Workflow type name
- \`label\` - Button text
- \`domain\` - Cadence domain
- \`cluster\` - Cadence cluster
- \`taskList\` - Task list name

**Optional:**
- \`wfId\` - Custom workflow ID (random UUID if not provided)
- \`input\` - JSON object payload
- \`timeoutSeconds\` - Execution timeout (default: 60)
- \`sdkLanguage\` - Worker SDK language (default: "GO")

---

## Signal Workflow

Send signals to running workflows.

##### Usage:

\`\`\`markdown
{% signal 
  signalName="update_status" 
  label="Update Status"
  domain="my-domain"
  cluster="my-cluster"
  workflowId="my-workflow-123"
  runId="my-run-456"
  input={status: "approved", user: "john"} 
/%}
\`\`\`

{% signal 
  signalName="test_payload" 
  label="Signal with Payload Example"
  domain="cadence-samples"
  cluster="cluster0"
  workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f"
  runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20"
  input={status: "approved", timestamp: "2024-01-01"} 
/%}

### Signal Attributes

**Required:**
- \`signalName\` - Signal name
- \`label\` - Button text
- \`domain\` - Cadence domain
- \`cluster\` - Cadence cluster
- \`workflowId\` - Target workflow ID
- \`runId\` - Target run ID

**Optional:**
- \`input\` - JSON object payload

`;

export default content;
