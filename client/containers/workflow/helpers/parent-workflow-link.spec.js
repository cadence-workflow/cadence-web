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

import parentWorkflowLink from './parent-workflow-link';

describe('parentWorkflowLink', () => {
  describe('When passed wfStartDetails.parentWorkflowExecution', () => {
    let eventDetails;

    beforeEach(() => {
      eventDetails = {
        parentWorkflowDomain: 'parentWorkflowDomainValue',
        parentWorkflowExecution: {
          workflowId: 'workflowIdValue',
          runId: 'runIdValue',
        },
      };
    });

    it('should return an object with to.name.', () => {
      const output = parentWorkflowLink({ eventDetails });

      expect(output.to.name).toEqual('workflow/summary');
    });

    it('should return an object with to.params.domain.', () => {
      const output = parentWorkflowLink({ eventDetails });

      expect(output.to.params.domain).toEqual('parentWorkflowDomainValue');
    });

    it('should return an object with to.params.workflowId.', () => {
      const output = parentWorkflowLink({ eventDetails });

      expect(output.to.params.workflowId).toEqual('workflowIdValue');
    });

    it('should return an object with to.params.runId.', () => {
      const output = parentWorkflowLink({ eventDetails });

      expect(output.to.params.runId).toEqual('runIdValue');
    });

    it('should return an object with text.', () => {
      const output = parentWorkflowLink({ eventDetails });

      expect(output.text).toEqual('workflowIdValue');
    });
  });
});
