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

describe('Task List Pollers', function() {
  it('should aggregate decision and activity pollers together by instance', function() {
    this.test.DescribeTaskList = ({ request }) => {
      request.domain.should.equal('canary');
      request.taskList.name.should.equal('demo-task-list');

      const response = {
        tchannel: {
          pollers:
            request.taskListType === 'Activity'
              ? [
                  {
                    identity: '100@node1@demo-task-list',
                    lastAccessTime: dateToLong('2018-03-22T20:21:40.000Z'),
                  },
                  {
                    identity: '102@node3@demo-task-list',
                    lastAccessTime: dateToLong('2018-03-22T20:21:32.000Z'),
                  },
                ]
              : [
                  {
                    identity: '100@node1@demo-task-list',
                    lastAccessTime: dateToLong('2018-03-22T20:20:40.000Z'),
                  },
                  {
                    identity: '101@node2@demo-task-list',
                    lastAccessTime: dateToLong('2018-03-22T20:22:05.000Z'),
                  },
                ],
        },
        grpc: {
          pollers:
            request.taskListType === 'TASK_LIST_TYPE_ACTIVITY'
              ? [
                  {
                    identity: '100@node1@demo-task-list',
                    lastAccessTime: dateToTimestamp('2018-03-22T20:21:40.000Z'),
                  },
                  {
                    identity: '102@node3@demo-task-list',
                    lastAccessTime: dateToTimestamp('2018-03-22T20:21:32.000Z'),
                  },
                ]
              : [
                  {
                    identity: '100@node1@demo-task-list',
                    lastAccessTime: dateToTimestamp('2018-03-22T20:20:40.000Z'),
                  },
                  {
                    identity: '101@node2@demo-task-list',
                    lastAccessTime: dateToTimestamp('2018-03-22T20:22:05.000Z'),
                  },
                ],
        },
      };

      return response[process.env.TRANSPORT_CLIENT_TYPE];
    };

    return request()
      .get('/api/domains/canary/task-lists/demo-task-list/pollers')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        '100@node1@demo-task-list': {
          lastAccessTime: '2018-03-22T20:21:40.000Z',
          taskListTypes: ['decision', 'activity'],
        },
        '101@node2@demo-task-list': {
          lastAccessTime: '2018-03-22T20:22:05.000Z',
          taskListTypes: ['decision'],
        },
        '102@node3@demo-task-list': {
          lastAccessTime: '2018-03-22T20:21:32.000Z',
          taskListTypes: ['activity'],
        },
      });
  });
});
