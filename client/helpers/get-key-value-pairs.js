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

import moment from 'moment';
import getJsonStringObject from './get-json-string-object';
import { jsonKeys, preKeys } from '~constants';

const getKeyValuePairs = ({ clusterName, excludes = [], item }) => {
  const kvps = [];
  const flatten = (prefix, obj, root) => {
    Object.entries(obj).forEach(([k, value]) => {
      if (value === null || value === undefined) {
        return;
      }

      const key = prefix ? `${prefix}.${k}` : k;

      if (excludes.includes(key)) {
        return;
      }

      if (value.routeLink) {
        kvps.push({
          key,
          routeLink: value.routeLink,
          value: value.text,
        });
      } else if (typeof value === 'object' && !jsonKeys.includes(key)) {
        flatten(key, value, root);
      } else if (key === 'newExecutionRunId') {
        kvps.push({
          key,
          routeLink: {
            name: 'workflow/summary',
            params: {
              clusterName,
              runId: value,
            },
          },
          value,
        });
      } else if (key === 'parentWorkflowExecution.runId') {
        kvps.push({
          key,
          routeLink: {
            name: 'workflow/summary',
            params: {
              clusterName,
              domain: root.parentWorkflowDomain,
              runId: value,
              workflowId: root.parentWorkflowExecution.workflowId,
            },
          },
          value,
        });
      } else if (key === 'workflowExecution.runId') {
        kvps.push({
          key,
          routeLink: {
            name: 'workflow/summary',
            params: {
              clusterName,
              domain: root.domain,
              runId: value,
              workflowId: root.workflowExecution.workflowId,
            },
          },
          value,
        });
      } else if (key === 'taskList.name' || key === 'Tasklist') {
        kvps.push({
          key,
          routeLink: {
            name: 'task-list',
            params: {
              clusterName,
              taskList: value,
            },
          },
          value,
        });
      } else if (/.+TimeoutSeconds/.test(key)) {
        kvps.push({
          key: key.replace(/Seconds$/, ''),
          value: moment.duration(value, 'seconds').format(),
        });
      } else if (preKeys.includes(k)) {
        kvps.push({
          key,
          value: getJsonStringObject(value),
        });
      } else {
        kvps.push({
          key,
          value,
        });
      }
    });
  };

  flatten('', item || {}, item);

  return kvps;
};

export default getKeyValuePairs;
