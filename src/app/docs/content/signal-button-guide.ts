const content = `# Signal Button Guide

Signal buttons allow you to send signals to workflows directly from markdown content.

---

## Basic Syntax

\`\`\`markdown
{% signal-button 
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

### Try it

{% signal-button 
  signalName="complete" 
  label="Send Signal!"
  domain="cadence-samples"
  cluster="cluster0"
  workflowId="c59642fd-ba5b-42b2-abc0-03e4e6cb34b4"
  runId="ab1d37e4-29d9-44d1-87f9-576b21669422"
  signalValue=false
/%}

{% signal-button 
  signalName="test_basic" 
  label="Click Me!"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
/%}

---

## With Signal Payload

Send data along with your signal:

\`\`\`markdown
{% signal-button 
  signalName="approve" 
  label="Approve"
  domain="my-domain"
  cluster="my-cluster"
  workflowId="my-workflow-123"
  runId="my-run-456"
  signalValue={status: "approved", user: "john"} 
/%}
\`\`\`

### Try it

{% signal-button 
  signalName="test_payload" 
  label="Send with Payload"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  signalValue={status: "approved", timestamp: "2024-01-01", user: "demo"} 
/%}

---

## Multiple Buttons

Create multiple action buttons:

\`\`\`markdown
{% signal-button signalName="approve" label="Approve" /%}
{% signal-button signalName="reject" label="Reject" /%}
{% signal-button signalName="request_changes" label="Request Changes" /%}
\`\`\`

### Try it

{% signal-button 
  signalName="demo_approve" 
  label="✓ Approve"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
/%}
{% signal-button 
  signalName="demo_reject" 
  label="✗ Reject"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
/%}
{% signal-button 
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

{% signal-button 
  signalName="approve" 
  label="Approve"
  domain="%s"
  cluster="%s"
  workflowId="%s"
  runId="%s"
/%}

{% signal-button 
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
        
        {% signal-button 
          signalName="approve" 
          label="Approve"
          domain="%s"
          cluster="%s"
          workflowId="%s"
          runId="%s"
        /%}
        
        {% signal-button 
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

{% signal-button 
  signalName="approve_order" 
  label="Approve Order"
  signalValue={order_id: "12345", amount: 5000} 
/%}

{% signal-button 
  signalName="reject_order" 
  label="Reject Order"
  signalValue={order_id: "12345", reason: "declined"} 
/%}
\`\`\`

### Try it

**Purchase Order #12345**

**Amount**: $5,000  
**Vendor**: Acme Corp

{% signal-button 
  signalName="approve_order" 
  label="Approve Order"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  signalValue={order_id: "12345", amount: 5000} 
/%}

{% signal-button 
  signalName="reject_order" 
  label="Reject Order"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  signalValue={order_id: "12345", reason: "declined"} 
/%}

---

### Priority Selection

\`\`\`markdown
# Set Priority

{% signal-button signalName="set_priority" label="Low" signalValue={priority: 1} /%}
{% signal-button signalName="set_priority" label="Medium" signalValue={priority: 2} /%}
{% signal-button signalName="set_priority" label="High" signalValue={priority: 3} /%}
{% signal-button signalName="set_priority" label="Critical" signalValue={priority: 4} /%}
\`\`\`

### Try it

**Set Priority:**

{% signal-button signalName="set_priority" label="P4 - Low" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" signalValue={priority: 1} /%}
{% signal-button signalName="set_priority" label="P3 - Medium" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" signalValue={priority: 2} /%}
{% signal-button signalName="set_priority" label="P2 - High" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" signalValue={priority: 3} /%}
{% signal-button signalName="set_priority" label="P1 - Critical" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" signalValue={priority: 4} /%}

---

### Deployment Control

\`\`\`markdown
# Deployment Ready: v2.5.0

**Tests**: ✅ All passing

{% signal-button 
  signalName="deploy" 
  label="🚀 Deploy Now"
  signalValue={environment: "production", version: "v2.5.0"} 
/%}

{% signal-button 
  signalName="schedule" 
  label="📅 Schedule"
  signalValue={delay_hours: 24} 
/%}

{% signal-button 
  signalName="cancel" 
  label="❌ Cancel"
/%}
\`\`\`

### Try it

**Deployment Ready: v2.5.0**

**Tests**: ✅ All passing

{% signal-button 
  signalName="deploy" 
  label="🚀 Deploy Now"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  signalValue={environment: "production", version: "v2.5.0"} 
/%}

{% signal-button 
  signalName="schedule" 
  label="📅 Schedule"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  signalValue={delay_hours: 24} 
/%}

{% signal-button 
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

{% signal-button signalName="feedback" label="⭐" signalValue={rating: 1} /%}
{% signal-button signalName="feedback" label="⭐⭐" signalValue={rating: 2} /%}
{% signal-button signalName="feedback" label="⭐⭐⭐" signalValue={rating: 3} /%}
{% signal-button signalName="feedback" label="⭐⭐⭐⭐" signalValue={rating: 4} /%}
{% signal-button signalName="feedback" label="⭐⭐⭐⭐⭐" signalValue={rating: 5} /%}
\`\`\`

### Try it

**How was your experience?**

{% signal-button signalName="feedback" label="⭐" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" signalValue={rating: 1} /%}
{% signal-button signalName="feedback" label="⭐⭐" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" signalValue={rating: 2} /%}
{% signal-button signalName="feedback" label="⭐⭐⭐" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" signalValue={rating: 3} /%}
{% signal-button signalName="feedback" label="⭐⭐⭐⭐" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" signalValue={rating: 4} /%}
{% signal-button signalName="feedback" label="⭐⭐⭐⭐⭐" domain="demo-domain" cluster="demo-cluster" workflowId="demo-workflow-123" runId="demo-run-456" signalValue={rating: 5} /%}

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

- **\`signalValue\`** - JSON object to send with the signal

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

{% signal-button 
  signalName="approve_document" 
  label="✓ Approve & Publish"
  signalValue={
    document_id: "fin-q4-2024",
    decision: "approved",
    reviewer: "executive"
  } 
/%}

{% signal-button 
  signalName="request_revision" 
  label="📝 Request Revision"
  signalValue={
    document_id: "fin-q4-2024",
    decision: "revision_needed"
  } 
/%}

{% signal-button 
  signalName="reject_document" 
  label="✗ Reject"
  signalValue={
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

{% signal-button 
  signalName="approve_document" 
  label="✓ Approve & Publish"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  signalValue={
    document_id: "fin-q4-2024",
    decision: "approved",
    reviewer: "executive"
  } 
/%}

{% signal-button 
  signalName="request_revision" 
  label="📝 Request Revision"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  signalValue={
    document_id: "fin-q4-2024",
    decision: "revision_needed"
  } 
/%}

{% signal-button 
  signalName="reject_document" 
  label="✗ Reject"
  domain="demo-domain"
  cluster="demo-cluster"
  workflowId="demo-workflow-123"
  runId="demo-run-456"
  signalValue={
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
