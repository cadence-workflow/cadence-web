const content = `# Workflow Actions Guide

Interactive buttons to signal and start workflows directly from markdown.

---

## Start Workflow

Start new workflow executions.

### Basic Start

\`\`\`markdown
{% start
  workflowType="MyWorkflow"
  label="Start Workflow"
  domain="my-domain"
  cluster="my-cluster"
  taskList="my-task-list"
/%}
\`\`\`

{% start
  workflowType="cadence_samples.MarkdownQueryWorkflow"
  label="Start Workflow Example"
  domain="cadence-samples"
  cluster="cluster0"
  taskList="cadence-samples-worker"
/%}

### Start with Input

\`\`\`markdown
{% start
  workflowType="MyWorkflow"
  label="Start with Configuration"
  domain="my-domain"
  cluster="my-cluster"
  taskList="my-task-list"
  wfId="custom-workflow-id"
  input={user: "john", priority: "high"}
  timeoutSeconds=120
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

### Basic Signal

\`\`\`markdown
{% signal 
  signalName="approve" 
  label="Approve"
  domain="my-domain"
  cluster="my-cluster"
  workflowId="my-workflow-123"
  runId="my-run-456"
/%}
\`\`\`

{% signal 
  signalName="complete" 
  label="Basic Signal Example"
  domain="cadence-samples"
  cluster="cluster0"
  workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f"
  runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20"
/%}

### Signal with Payload

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

---

## Common Use Cases

### Approval Workflow

\`\`\`markdown
# Purchase Order Approval

**Order #12345** - $5,000 from Acme Corp

{% signal 
  signalName="approve_order" 
  label="✓ Approve"
  domain="my-domain"
  cluster="my-cluster"
  workflowId="order-wf-123"
  runId="run-456"
  input={order_id: "12345", decision: "approved"}
/%}

{% signal 
  signalName="reject_order" 
  label="✗ Reject"
  domain="my-domain"
  cluster="my-cluster"
  workflowId="order-wf-123"
  runId="run-456"
  input={order_id: "12345", decision: "rejected"}
/%}
\`\`\`

**Purchase Order #12345** - $5,000 from Acme Corp

{% signal 
  signalName="approve_order" 
  label="✓ Approve"
  domain="cadence-samples"
  cluster="cluster0"
  workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f"
  runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20"
  input={order_id: "12345", decision: "approved"} 
/%}

{% signal 
  signalName="reject_order" 
  label="✗ Reject"
  domain="cadence-samples"
  cluster="cluster0"
  workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f"
  runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20"
  input={order_id: "12345", decision: "rejected"} 
/%}

### Priority Selection

\`\`\`markdown
# Set Task Priority

{% signal signalName="set_priority" label="P4 - Low" input={priority: 1} /%}
{% signal signalName="set_priority" label="P3 - Medium" input={priority: 2} /%}
{% signal signalName="set_priority" label="P2 - High" input={priority: 3} /%}
{% signal signalName="set_priority" label="P1 - Critical" input={priority: 4} /%}
\`\`\`

**Set Task Priority:**

{% signal signalName="set_priority" label="P4 - Low" domain="cadence-samples" cluster="cluster0" workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f" runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20" input={priority: 1} /%}
{% signal signalName="set_priority" label="P3 - Medium" domain="cadence-samples" cluster="cluster0" workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f" runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20" input={priority: 2} /%}
{% signal signalName="set_priority" label="P2 - High" domain="cadence-samples" cluster="cluster0" workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f" runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20" input={priority: 3} /%}
{% signal signalName="set_priority" label="P1 - Critical" domain="cadence-samples" cluster="cluster0" workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f" runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20" input={priority: 4} /%}

### Deployment Control

\`\`\`markdown
# Deployment Ready: v2.5.0

**Tests:** ✅ All passing

{% signal 
  signalName="deploy" 
  label="🚀 Deploy Now"
  input={environment: "production", version: "v2.5.0"} 
/%}

{% signal 
  signalName="schedule" 
  label="📅 Schedule"
  input={delay_hours: 24} 
/%}

{% signal signalName="cancel" label="❌ Cancel" /%}
\`\`\`

**Deployment Ready: v2.5.0** - All tests passing ✅

{% signal 
  signalName="deploy" 
  label="🚀 Deploy Now"
  domain="cadence-samples"
  cluster="cluster0"
  workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f"
  runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20"
  input={environment: "production", version: "v2.5.0"} 
/%}

{% signal 
  signalName="schedule" 
  label="📅 Schedule"
  domain="cadence-samples"
  cluster="cluster0"
  workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f"
  runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20"
  input={delay_hours: 24} 
/%}

{% signal 
  signalName="cancel" 
  label="❌ Cancel"
  domain="cadence-samples"
  cluster="cluster0"
  workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f"
  runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20"
/%}

### Feedback Rating

\`\`\`markdown
# How was your experience?

{% signal signalName="feedback" label="⭐" input={rating: 1} /%}
{% signal signalName="feedback" label="⭐⭐" input={rating: 2} /%}
{% signal signalName="feedback" label="⭐⭐⭐" input={rating: 3} /%}
{% signal signalName="feedback" label="⭐⭐⭐⭐" input={rating: 4} /%}
{% signal signalName="feedback" label="⭐⭐⭐⭐⭐" input={rating: 5} /%}
\`\`\`

**How was your experience?**

{% signal signalName="feedback" label="⭐" domain="cadence-samples" cluster="cluster0" workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f" runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20" input={rating: 1} /%}
{% signal signalName="feedback" label="⭐⭐" domain="cadence-samples" cluster="cluster0" workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f" runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20" input={rating: 2} /%}
{% signal signalName="feedback" label="⭐⭐⭐" domain="cadence-samples" cluster="cluster0" workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f" runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20" input={rating: 3} /%}
{% signal signalName="feedback" label="⭐⭐⭐⭐" domain="cadence-samples" cluster="cluster0" workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f" runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20" input={rating: 4} /%}
{% signal signalName="feedback" label="⭐⭐⭐⭐⭐" domain="cadence-samples" cluster="cluster0" workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f" runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20" input={rating: 5} /%}

### Start New Workflow

\`\`\`markdown
# Create New Analysis

{% start
  workflowType="DataAnalysisWorkflow"
  label="🚀 Start Analysis"
  domain="analytics"
  cluster="prod-cluster"
  taskList="analytics-workers"
  input={dataset: "sales-2024", format: "json"}
/%}
\`\`\`

**Create New Analysis:**

{% start
  workflowType="cadence_samples.MarkdownQueryWorkflow"
  label="🚀 Start Analysis"
  domain="cadence-samples"
  cluster="cluster0"
  taskList="cadence-samples-worker"
  input={dataset: "demo", format: "json"}
/%}

---

## Workflow Code Examples

### Returning Markdown from Go

\`\`\`go
func (w *MyWorkflow) GetStatus() (string, error) {
    domain := "my-domain"
    cluster := "my-cluster"
    wfID := workflow.GetInfo(ctx).WorkflowExecution.ID
    runID := workflow.GetInfo(ctx).WorkflowExecution.RunID
    
    return fmt.Sprintf(\\\`# Approval Required

{% signal 
  signalName="approve" 
  label="Approve"
  domain="%s"
  cluster="%s"
  workflowId="%s"
  runId="%s"
/%}

{% signal 
  signalName="reject" 
  label="Reject"
  domain="%s"
  cluster="%s"
  workflowId="%s"
  runId="%s"
/%}
\\\`, domain, cluster, wfID, runID, domain, cluster, wfID, runID), nil
}
\`\`\`

### Returning Markdown from Java

\`\`\`java
@QueryMethod
public String getStatus() {
    WorkflowInfo info = Workflow.getInfo();
    String domain = "my-domain";
    String cluster = "my-cluster";
    String wfId = info.getWorkflowId();
    String runId = info.getRunId();
    
    return String.format("""
        # Approval Required
        
        {% signal 
          signalName="approve" 
          label="Approve"
          domain="%s"
          cluster="%s"
          workflowId="%s"
          runId="%s"
        /%}
        """, domain, cluster, wfId, runId);
}
\`\`\`

---

## Tips

1. **Use clear labels** - Users should understand what each button does
2. **Add emojis** - Makes buttons more visual (✓, ✗, 🚀, 📅, ⭐)
3. **Provide context** - Include information to help users decide
4. **Group related actions** - Use headings to organize buttons
5. **Pass relevant data** - Include necessary information in payloads

---

## Summary

✅ **Simple syntax** - Clean markdown tags  
✅ **Two actions** - Signal existing workflows or start new ones  
✅ **Flexible** - Mix with any markdown content  
✅ **Interactive** - Fully functional buttons in the UI  

**Start using workflow actions in your queries today!**
`;

export default content;
