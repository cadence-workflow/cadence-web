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

import { ROUTE_UPDATE_QUERY } from '../route/action-types';
import actions from './actions';
import { WORKFLOW_LIST_ON_FILTER_CHANGE } from './action-types';
import { STATUS_CLOSED } from './constants';

describe('workflow list actions', () => {
  describe('when calling actions[WORKFLOW_LIST_ON_FILTER_CHANGE]', () => {
    it('should call dispatch with ROUTE_UPDATE_QUERY & payload', () => {
      const dispatch = jest.fn();
      const payload = {
        status: STATUS_CLOSED,
      };

      actions[WORKFLOW_LIST_ON_FILTER_CHANGE]({ dispatch }, payload);
      expect(dispatch).toHaveBeenCalledWith(ROUTE_UPDATE_QUERY, payload);
    });
  });
});
