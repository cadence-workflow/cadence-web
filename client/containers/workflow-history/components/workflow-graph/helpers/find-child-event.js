// Copyright (c) 2020-2025 Uber Technologies Inc.
//
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * Looks for a chronological or inferred child.
 * It is inferred if a DecisionTaskScheduled, otherwise its chronological.
 * External signals are not children and therefore they are skipped.
 * @method findChildEvent
 * @param {object} event
 * @param {string} event.eventId
 * @param {string} event.eventType
 * @param {array} workflowList
 */
function findChildEvent({ eventId, eventType }, workflowList) {
  const slicedWorkflowList = workflowList.slice(eventId);

  // We are at the end of the workflow, no children!
  if (!slicedWorkflowList.length) {
    return {};
  }

  if (slicedWorkflowList[0].eventType === 'DecisionTaskScheduled') {
    return {
      inferredChild: slicedWorkflowList[0].eventId,
    };
  }

  if (eventType === 'WorkflowExecutionSignaled') {
    for (const targetEvent of slicedWorkflowList) {
      switch (targetEvent.eventType) {
        case 'WorkflowExecutionSignaled':
        case 'WorkflowExecutionCancelRequested':
          break;
        case 'DecisionTaskScheduled':
          return {
            inferredChild: targetEvent.eventId,
          };
      }
    }
  } else {
    for (const targetEvent of slicedWorkflowList) {
      switch (targetEvent.eventType) {
        case 'WorkflowExecutionSignaled':
        case 'WorkflowExecutionCancelRequested':
          break;
        default:
          return {
            chronologicalChild: targetEvent.eventId,
          };
      }
    }
  }

  return {};
}

export default findChildEvent;
