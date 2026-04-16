const content = `# Cadence Markdown Guide

This guide provides examples of how to use markdown to interact with Cadence workflows.
You can use markdown format in your workflow queries to return actionable content.
You can find an example in [cadence-samples repository](https://github.com/cadence-workflow/cadence-samples/tree/master/new_samples) under the query sample.
Learn more about Cadence markdown in [Cadence Docs](https://cadenceworkflow.io).

It can also be used as a test page to see if the markdown rendering is working correctly.
If you see buttons for workflow start and signal, then the markdown rendering is working correctly.

Cadence markdown support is implemented using [Markdoc](https://markdoc.io/).
Markdoc is a markdown parser and renderer that is used to safely render the markdown content.

> **Note:** This docs page has no workflow context, so buttons that rely on inherited page params will appear disabled. On an actual workflow query page, \`domain\`, \`cluster\`, \`workflowId\`, and \`runId\` are inherited automatically and the buttons will be active.


## Signal Workflow

Send a signal to a running workflow using the \`signal\` tag.

When rendered on a workflow page (e.g. in a query response), \`domain\`, \`cluster\`, \`workflowId\`, and \`runId\` are inherited from the page automatically. You only need to specify \`signalName\` and \`label\`.

### Example: Minimal (inherits context from page)

\`\`\`
{% signal signalName="approve" label="Approve" /%}
\`\`\`

{% signal signalName="approve" label="Approve" /%}

### Example: Explicit target (overrides page context)

Use explicit attributes when you need to signal a different workflow than the one being viewed.

\`\`\`
{% signal
  signalName="approve"
  label="Approve"
  input={status: "approved", user: "john"}
  domain="my-domain"
  cluster="my-cluster"
  workflowId="workflow-123"
  runId="run-456"
/%}
\`\`\`

{% signal
  signalName="approve"
  label="Signal Workflow"
  input={status: "approved", user: "john"}
  domain="cadence-samples"
  cluster="cadence-samples"
  workflowId="sample-workflow"
  runId="sample-run"
/%}

### Signal Attributes

- \`signalName\` (string, **required**) -- name of the signal to send
- \`label\` (string, **required**) -- button text
- \`input\` (object, optional) -- signal payload
- \`domain\` (string, optional) -- inherited from page context if omitted
- \`cluster\` (string, optional) -- inherited from page context if omitted
- \`workflowId\` (string, optional) -- inherited from page context if omitted
- \`runId\` (string, optional) -- inherited from page context if omitted

The \`input\` field supports different value types:

- For booleans, use \`input=true\` or \`input=false\`
- For json objects, use \`input={"key": "value"}\`
- For strings, use \`input="string"\`


## Start Workflow

Start a new workflow execution using the \`start\` tag.

When rendered on a workflow page, \`domain\` and \`cluster\` are inherited from the page automatically.

### Example: Minimal (inherits context from page)

\`\`\`
{% start
  workflowType="MyWorkflow"
  label="Start Workflow"
  taskList="my-task-list"
/%}
\`\`\`

{% start
  workflowType="cadence_samples.SampleWorkflow"
  label="Start Workflow"
  taskList="cadence-samples-worker"
/%}

### Example: Explicit target with all options

\`\`\`
{% start
  workflowType="MyWorkflow"
  label="Start with Config"
  domain="my-domain"
  cluster="my-cluster"
  taskList="my-task-list"
  wfId="custom-workflow-id"
  input={key: "value"}
  timeoutSeconds=300
  sdkLanguage="GO"
/%}
\`\`\`

{% start
  workflowType="cadence_samples.ConfiguredWorkflow"
  label="Start with Config"
  domain="cadence-samples"
  cluster="cadence-samples"
  taskList="cadence-samples-worker"
  wfId="configured-wf-123"
  input={priority: "high", region: "us-west"}
  timeoutSeconds=120
  sdkLanguage="GO"
/%}

### Start Attributes

- \`workflowType\` (string, **required**) -- workflow type name
- \`label\` (string, **required**) -- button text
- \`taskList\` (string, **required**) -- task list for the workflow
- \`domain\` (string, optional) -- inherited from page context if omitted
- \`cluster\` (string, optional) -- inherited from page context if omitted
- \`wfId\` (string, optional) -- custom workflow ID
- \`input\` (object, optional) -- workflow input payload
- \`timeoutSeconds\` (number, optional, default: 60) -- execution timeout
- \`sdkLanguage\` (string, optional, default: "GO") -- worker SDK language


## Images

You can render images in your markdown using either the standard markdown syntax or the Markdoc \`{% image %}\` tag for more control.

### Standard Markdown Images

\`\`\`
![Alt text](https://example.com/image.png)
\`\`\`

### Sized Images with Markdoc Tag

Use the \`{% image %}\` tag to specify custom width or height:

\`\`\`
{% image src="https://example.com/image.png" alt="My Image" width="250" /%}
{% image src="https://example.com/image.png" alt="My Image" height="100" /%}
\`\`\`

Image with 250px width:
{% image src="https://cadenceworkflow.io/assets/images/workflow-84ef76d93c7ff138714a0aa7c9b92841.png" alt="Image with 250px width" width="250" /%}

Image with 100px height:
{% image src="https://cadenceworkflow.io/assets/images/workflow-84ef76d93c7ff138714a0aa7c9b92841.png" alt="Image with 100px height" height="100" /%}
 
Image with 100px width and 100px height:
{% image src="https://cadenceworkflow.io/assets/images/workflow-84ef76d93c7ff138714a0aa7c9b92841.png" alt="Image with 100px width and 100px height" width="100" height="100" /%}

`;

export default content;
