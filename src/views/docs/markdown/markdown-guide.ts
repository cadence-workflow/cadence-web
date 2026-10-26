const content = `# Cadence Markdown Guide

This guide provides examples of how to use markdown to interact with Cadence workflows.
You can use markdown format in your workflow queries to return actionable content.
You can find an example in [cadence-samples repository](https://github.com/cadence-workflow/cadence-samples/tree/master/new_samples) under the query sample.
Learn more about Cadence markdown in [Cadence Docs](https://cadenceworkflow.io).

It can also be used as a test page to see if the markdown rendering is working correctly.
If you see live buttons for the explicit examples below, then the markdown rendering is working correctly.

Cadence markdown support is implemented using [Markdoc](https://markdoc.io/).
Markdoc is a markdown parser and renderer that is used to safely render the markdown content.


## Home Page Result

The \`home\` query of a workflow returns a result with the format \`text/markdown\`. The Home tab shows it.

\`\`\`json
{
  "cadenceResponseType": "formattedData",
  "format": "text/markdown",
  "data": "## Details ...",
  "title": "Expense report EXP-1001",
  "badgeName": "Expense report"
}
\`\`\`

- \`data\` (string, required) -- the Markdown page
- \`title\` (string, optional) -- heading at the top of the home page
- \`badgeName\` (string, optional) -- short, descriptive name of the page, shown in a badge next to the Home tab name


## Signal Workflow

Send a signal to a running workflow using the \`signal\` tag.

When rendered on a workflow page (e.g. in a query response), \`domain\`, \`cluster\`, \`workflowId\`, and \`runId\` are inherited from the page automatically. You only need to specify \`signalName\` and \`label\`.

### Example: Minimal (inherits context from page)

\`\`\`
{% signal signalName="approve" label="Signal Workflow" /%}
\`\`\`

### Example: Explicit target (overrides page context)

Use explicit attributes when you need to signal a different workflow than the one being viewed.

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
- \`runId\` (string, optional) -- inherited from page context only if \`workflowId\` is also omitted. If \`workflowId\` is specified explicitly without \`runId\`, the signal targets the current run of that workflow (per Cadence API semantics), not the page's run

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

### Example: Explicit target with all options

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


## Input Fields

Let the viewer type a value that a \`signal\` or \`start\` button sends. An \`input-field\` tag defines a variable with the same name. Use \`$name\` in any button attribute.

### Example

\`\`\`
{% input-field name="amount" label="Amount (USD)" type="number" default=84.5 required=true placeholder="0.00" /%}

{% signal
  signalName="approve_partial"
  label="Approve amount"
  input={"reviewer":"finance-ops","amount":$amount}
/%}

{% start
  workflowType="MyWorkflow"
  label="Start"
  taskList="my-task-list"
  input={"items":[{"amount":$amount}]}
/%}
\`\`\`

### Field Attributes

- \`name\` (string, **required**) -- variable name, used as \`$name\`. Must be unique within a page
- \`label\` (string, optional) -- text above the input
- \`type\` (string, optional, default: "text") -- \`text\` or \`number\`
- \`default\` (string or number, optional) -- starting value
- \`required\` (boolean, optional) -- buttons that use this field stay disabled until it has a value
- \`placeholder\` (string, optional) -- hint text

### Using Field Values

Number fields are numbers. An empty optional field leaves its variable undefined, so its key is left out. A button that uses an undefined or empty required field stays disabled. Use \`{% $name %}\` in text to show the current value.


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
