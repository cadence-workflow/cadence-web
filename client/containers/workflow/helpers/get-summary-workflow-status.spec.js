// Copyright (c) 2017-2025 Uber Technologies Inc.
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

import getSummaryWorkflowStatus from './get-summary-workflow-status';

describe('getSummaryWorkflowStatus', () => {
  describe('When passed an event with isWorkflowRunning = true', () => {
    it('should return "running".', () => {
      const event = {
        isWorkflowRunning: true,
      };
      const output = getSummaryWorkflowStatus(event);

      expect(output).toEqual('running');
    });
  });

  describe('When passed an event with workflowCompletedEvent = false and workflow.workflowExecutionInfo.closeStatus is defined', () => {
    it('should return workflow.workflowExecutionInfo.closeStatus in lower case.', () => {
      const event = {
        workflow: {
          workflowExecutionInfo: {
            closeStatus: 'closeStatusValue',
          },
        },
        workflowCompletedEvent: false,
      };
      const output = getSummaryWorkflowStatus(event);

      expect(output).toEqual('closestatusvalue');
    });
  });

  describe('When passed an event with workflowCompletedEvent = false and workflow.workflowExecutionInfo.closeStatus is not defined', () => {
    it('should return "running".', () => {
      const event = {
        workflowCompletedEvent: false,
      };
      const output = getSummaryWorkflowStatus(event);

      expect(output).toEqual('running');
    });
  });

  describe('When passed an event with workflowCompletedEvent.eventType === "WorkflowExecutionContinuedAsNew" and workflowCompletedEvent.details.newExecutionRunId is defined', () => {
    let event;

    beforeEach(() => {
      event = {
        workflowCompletedEvent: {
          eventType: 'WorkflowExecutionContinuedAsNew',
          details: {
            newExecutionRunId: 'newExecutionRunIdValue',
          },
        },
      };
    });

    it('should return an object with to.name = "workflow/summary".', () => {
      const output = getSummaryWorkflowStatus(event);

      expect(output.to.name).toEqual('workflow/summary');
    });

    it('should return an object with to.params.runId.', () => {
      const output = getSummaryWorkflowStatus(event);

      expect(output.to.params.runId).toEqual('newExecutionRunIdValue');
    });

    it('should return an object with text = "Continued As New".', () => {
      const output = getSummaryWorkflowStatus(event);

      expect(output.text).toEqual('Continued As New');
    });

    it('should return an object with status = "continued-as-new".', () => {
      const output = getSummaryWorkflowStatus(event);

      expect(output.status).toEqual('continued-as-new');
    });
  });

  describe('When passed an workflowCompletedEvent.eventType !== "WorkflowExecutionContinuedAsNew"', () => {
    it('should return workflowCompletedEvent.eventType without WorkflowExecution and in lower case.', () => {
      const event = {
        workflowCompletedEvent: {
          eventType: 'NotWorkflowExecutionContinuedAsNew',
        },
      };
      const output = getSummaryWorkflowStatus(event);

      expect(output).toEqual('notcontinuedasnew');
    });
  });
});
