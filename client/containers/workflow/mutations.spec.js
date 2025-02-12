// Copyright (c) 2021-2025 Uber Technologies Inc.
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

import {
  WORKFLOW_CLEAR_EXECUTION,
  WORKFLOW_SET_EXECUTION,
} from './mutation-types';
import mutations from './mutations';

const initState = (workflow = {}) => {
  return {
    workflow,
  };
};

describe('workflow mutations', () => {
  describe('when calling mutations[WORKFLOW_CLEAR_EXECUTION]', () => {
    describe('and state.workflow.execution is defined and state.workflow.isLoading is false', () => {
      let state;

      beforeEach(() => {
        state = initState({
          execution: {},
          isLoading: false,
        });
      });

      it('should set state.workflow.execution to null', () => {
        expect(state.workflow.execution).toEqual({});
        mutations[WORKFLOW_CLEAR_EXECUTION](state);
        expect(state.workflow.execution).toEqual(null);
      });

      it('should set state.workflow.isLoading to true', () => {
        expect(state.workflow.isLoading).toEqual(false);
        mutations[WORKFLOW_CLEAR_EXECUTION](state);
        expect(state.workflow.isLoading).toEqual(true);
      });
    });
  });

  describe('when calling mutations[WORKFLOW_SET_EXECUTION]', () => {
    describe('and state.workflow.execution is not defined and state.workflow.isLoading is true', () => {
      let state;

      beforeEach(() => {
        state = initState({
          execution: null,
          isLoading: true,
        });
      });

      it('should set state.workflow.execution to what is in the payload', () => {
        expect(state.workflow.execution).toEqual(null);
        mutations[WORKFLOW_SET_EXECUTION](state, { key: 'value' });
        expect(state.workflow.execution).toEqual({ key: 'value' });
      });

      it('should set state.workflow.isLoading to false', () => {
        expect(state.workflow.isLoading).toEqual(true);
        mutations[WORKFLOW_SET_EXECUTION](state, { key: 'value' });
        expect(state.workflow.isLoading).toEqual(false);
      });
    });
  });
});
