const content = `# Cadence Markdown Guide

This guide provides examples of how to use markdown to interact with Cadence workflows. 
You can use markdown format in your workflow queries to return actionable content. 
You can find an example in [cadence-samples repository](https://github.com/cadence-workflow/cadence-samples/tree/master/new_samples) under the query sample.
Learn more about Cadence markdown in [Cadence Docs](https://cadenceworkflow.io).

It can also be used as a test page to see if the markdown rendering is working correctly. 
If you see buttons for workflow start and signal, then the markdown rendering is working correctly. 

Cadence markdown support is implemented using [Markdoc](https://markdoc.io/). 
Markdoc is a markdown parser and renderer that is used to safely render the markdown content.


## Start Workflow

Start a new workflow execution using the \`start\` tag.

### Example: Basic Start

\`\`\`
{% start
  workflowType="MyWorkflow"
  label="Start Workflow"
  domain="my-domain"
  cluster="my-cluster"
  taskList="my-task-list"
/%}
\`\`\`

{% start
  workflowType="cadence_samples.SampleWorkflow"
  label="Start Workflow"
  domain="cadence-samples"
  cluster="cadence-samples"
  taskList="cadence-samples-worker"
/%}

### Example: Start with Options

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


## Signal Workflow

Send a signal to a running workflow using the \`signal\` tag.

### Example:

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

Note that input field is optional and can be omitted. For different value types, you can use the following syntax: 

- For booleans, use \`input=true\` or \`input=false\`
- For json objects, use \`input={"key": "value"}\`
- For strings, use \`input="string"\`

{% signal 
  signalName="approve"
  label="Signal Workflow"
  input={status: "approved", user: "john"}
  domain="cadence-samples"
  cluster="cadence-samples"
  workflowId="sample-workflow"
  runId="sample-run"
/%}

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
