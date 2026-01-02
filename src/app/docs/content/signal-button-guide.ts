const content = `# Signal Button Guide

Signal buttons allow you to send signals to workflows directly from markdown content..

---

## Basic Syntax

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

### Required Attributes

- **\`signalName\`** - The name of the signal to send to the workflow
- **\`label\`** - The text displayed on the button
- **\`domain\`** - The Cadence domain
- **\`cluster\`** - The Cadence cluster
- **\`workflowId\`** - The target workflow ID
- **\`runId\`** - The target run ID

### Example

{% signal 
  signalName="complete" 
  label="Send Signal!"
  domain="cadence-samples"
  cluster="cluster0"
  workflowId="0c4a8579-33e8-4b58-984a-89d5aeac980f"
  runId="3d001c7a-793e-4efd-be3d-70dc0b0bdf20"
  input=false
/%}

---

## With Signal Payload

Send data along with your signal:

\`\`\`markdown
{% signal 
  signalName="approve" 
  label="Approve"
  domain="my-domain"
  cluster="my-cluster"
  workflowId="my-workflow-123"
  runId="my-run-456"
  input={status: "approved", user: "john"} 
/%}
\`\`\`

### Try it

{% signal 
  signalName="test_payload" 
  label="Send with Payload"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  input={status: "approved", timestamp: "2024-01-01", user: "demo"} 
/%}

---

## Multiple Buttons

Create multiple action buttons:

\`\`\`markdown
{% signal signalName="approve" label="Approve" /%}
{% signal signalName="reject" label="Reject" /%}
{% signal signalName="request_changes" label="Request Changes" /%}
\`\`\`

### Try it

{% signal 
  signalName="demo_approve" 
  label="✓ Approve"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
/%}
{% signal 
  signalName="demo_reject" 
  label="✗ Reject"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
/%}
{% signal 
  signalName="demo_changes" 
  label="📝 Request Changes"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
/%}

---

## Use in Workflows

### Go Example

\`\`\`go
func (w *MyWorkflow) GetStatus(domain, cluster, workflowId, runId string) (string, error) {
    return fmt.Sprintf(\\\`# Approval Required

Your workflow is waiting for approval.

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
\\\`, domain, cluster, workflowId, runId, domain, cluster, workflowId, runId), nil
}
\`\`\`

### Java Example

\`\`\`java
@QueryMethod
public String getStatus(String domain, String cluster, String workflowId, String runId) {
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
        
        {% signal 
          signalName="reject" 
          label="Reject"
          domain="%s"
          cluster="%s"
          workflowId="%s"
          runId="%s"
        /%}
        """, domain, cluster, workflowId, runId, domain, cluster, workflowId, runId);
}
\`\`\`

---

## Common Examples

### Approval Workflow

\`\`\`markdown
# Purchase Order #12345

**Amount**: $5,000  
**Vendor**: Acme Corp

{% signal 
  signalName="approve_order" 
  label="Approve Order"
  input={order_id: "12345", amount: 5000} 
/%}

{% signal 
  signalName="reject_order" 
  label="Reject Order"
  input={order_id: "12345", reason: "declined"} 
/%}
\`\`\`

### Try it

**Purchase Order #12345**

**Amount**: $5,000  
**Vendor**: Acme Corp

{% signal 
  signalName="approve_order" 
  label="Approve Order"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  input={order_id: "12345", amount: 5000} 
/%}

{% signal 
  signalName="reject_order" 
  label="Reject Order"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  input={order_id: "12345", reason: "declined"} 
/%}

---

### Priority Selection

\`\`\`markdown
# Set Priority

{% signal signalName="set_priority" label="Low" input={priority: 1} /%}
{% signal signalName="set_priority" label="Medium" input={priority: 2} /%}
{% signal signalName="set_priority" label="High" input={priority: 3} /%}
{% signal signalName="set_priority" label="Critical" input={priority: 4} /%}
\`\`\`

### Try it

**Set Priority:**

{% signal signalName="set_priority" label="P4 - Low" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" input={priority: 1} /%}
{% signal signalName="set_priority" label="P3 - Medium" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" input={priority: 2} /%}
{% signal signalName="set_priority" label="P2 - High" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" input={priority: 3} /%}
{% signal signalName="set_priority" label="P1 - Critical" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" input={priority: 4} /%}

---

### Deployment Control

\`\`\`markdown
# Deployment Ready: v2.5.0

**Tests**: ✅ All passing

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

{% signal 
  signalName="cancel" 
  label="❌ Cancel"
/%}
\`\`\`

### Try it

**Deployment Ready: v2.5.0**

**Tests**: ✅ All passing

{% signal 
  signalName="deploy" 
  label="🚀 Deploy Now"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  input={environment: "production", version: "v2.5.0"} 
/%}

{% signal 
  signalName="schedule" 
  label="📅 Schedule"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  input={delay_hours: 24} 
/%}

{% signal 
  signalName="cancel" 
  label="❌ Cancel"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
/%}

---

### Feedback Collection

\`\`\`markdown
# How was your experience?

{% signal signalName="feedback" label="⭐" input={rating: 1} /%}
{% signal signalName="feedback" label="⭐⭐" input={rating: 2} /%}
{% signal signalName="feedback" label="⭐⭐⭐" input={rating: 3} /%}
{% signal signalName="feedback" label="⭐⭐⭐⭐" input={rating: 4} /%}
{% signal signalName="feedback" label="⭐⭐⭐⭐⭐" input={rating: 5} /%}
\`\`\`

### Try it

**How was your experience?**

{% signal signalName="feedback" label="⭐" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" input={rating: 1} /%}
{% signal signalName="feedback" label="⭐⭐" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" input={rating: 2} /%}
{% signal signalName="feedback" label="⭐⭐⭐" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" input={rating: 3} /%}
{% signal signalName="feedback" label="⭐⭐⭐⭐" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" input={rating: 4} /%}
{% signal signalName="feedback" label="⭐⭐⭐⭐⭐" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" input={rating: 5} /%}

---

## All Attributes

### Required Attributes

- **\`signalName\`** - The name of the signal to send
- **\`label\`** - The button text
- **\`domain\`** - The Cadence domain
- **\`cluster\`** - The Cadence cluster  
- **\`workflowId\`** - The target workflow ID
- **\`runId\`** - The target run ID

### Optional Attributes

- **\`input\`** - JSON object to send with the signal

---

## Tips

1. **Use clear labels** - Users should understand what the button does
2. **Add emojis** - Makes buttons more visual (✓, ✗, 🚀, 📅, etc.)
3. **Provide context** - Include information above buttons to help users decide
4. **Group related actions** - Use headings to organize multiple buttons
5. **Include payload data** - Send relevant information with the signal

---

## Complete Example

Here's a full workflow query response with context and multiple buttons:

\`\`\`markdown
# Document Review Required

## Document Details
- **Title**: Q4 Financial Report
- **Author**: Finance Team
- **Pages**: 45
- **Submitted**: 2024-01-15

## Review Status
- ✅ Technical Review: Complete
- ✅ Legal Review: Complete
- ⏳ Executive Approval: Pending

## Your Action Required

Please review the document and take one of the following actions:

{% signal 
  signalName="approve_document" 
  label="✓ Approve & Publish"
  input={
    document_id: "fin-q4-2024",
    decision: "approved",
    reviewer: "executive"
  } 
/%}

{% signal 
  signalName="request_revision" 
  label="📝 Request Revision"
  input={
    document_id: "fin-q4-2024",
    decision: "revision_needed"
  } 
/%}

{% signal 
  signalName="reject_document" 
  label="✗ Reject"
  input={
    document_id: "fin-q4-2024",
    decision: "rejected"
  } 
/%}
\`\`\`

### Try it

**Document Review Required**

**Document Details:**
- **Title**: Q4 Financial Report
- **Author**: Finance Team
- **Pages**: 45

**Review Status:**
- ✅ Technical Review: Complete
- ✅ Legal Review: Complete
- ⏳ Executive Approval: Pending

**Your Action Required:**

{% signal 
  signalName="approve_document" 
  label="✓ Approve & Publish"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  input={
    document_id: "fin-q4-2024",
    decision: "approved",
    reviewer: "executive"
  } 
/%}

{% signal 
  signalName="request_revision" 
  label="📝 Request Revision"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  input={
    document_id: "fin-q4-2024",
    decision: "revision_needed"
  } 
/%}

{% signal 
  signalName="reject_document" 
  label="✗ Reject"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  input={
    document_id: "fin-q4-2024",
    decision: "rejected"
  } 
/%}

---

## Summary

Signal buttons make it easy to add interactivity to your workflow queries:

✅ Simple markdown syntax  
✅ Embed directly in content  
✅ Send signals with payloads  
✅ Standard markdown everywhere else  

**Start using signal buttons in your workflows today!**
`;

export default content;
