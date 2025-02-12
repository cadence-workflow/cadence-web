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

describe('Task List', () => {
  async function taskListTest(mochaTest, pollers) {
    const [testEl, scenario] = new Scenario(mochaTest)
      .withDomain('ci-test')
      .startingAt('/domains/ci-test/task-lists/ci_task_list')
      .withFeatureFlags()
      .withEmptyNewsFeed()
      .withTaskListPollers('ci_task_list', pollers)
      .go();

    const taskListEl = await testEl.waitUntilExists(
      'section.task-list-pollers'
    );

    return [taskListEl, scenario];
  }

  it('should show a table of the pollers of the task list', async function test() {
    const [taskListEl] = await taskListTest(this.test);

    await Promise.delay(1);

    taskListEl.querySelectorAll('table tbody tr').should.have.length(3);
    taskListEl
      .textNodes('tbody tr td:first-child')
      .should.deep.equal(['node1', 'node2', 'node3']);
    taskListEl.textNodes('tbody tr td:nth-child(2)').should.deep.equal(
      [5, 3, 4].map(m =>
        moment()
          .startOf('hour')
          .add(m, 'minutes')
          .format('MMM D, YYYY h:mm:ss A')
      )
    );
    taskListEl
      .attrValues('tbody td:nth-child(3)', 'data-handled')
      .should.deep.equal(['true', 'true', null]);
    taskListEl
      .attrValues('tbody td:nth-child(4)', 'data-handled')
      .should.deep.equal(['true', null, 'true']);
  });
});
