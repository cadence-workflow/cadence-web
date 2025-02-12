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

const tasklistPollerListHandler = async function(ctx) {
  const descTaskList = async taskListType =>
    (
      await ctx.cadence.describeTaskList({
        domain: ctx.params.domain,
        taskList: { name: ctx.params.taskList },
        taskListType,
      })
    ).pollers || [];

  const r = type => (o, poller) => {
    const i = o[poller.identity] || {};

    o[poller.identity] = {
      lastAccessTime:
        !i.lastAccessTime || i.lastAccessTime < poller.lastAccessTime
          ? poller.lastAccessTime
          : i.lastAccessTime,
      taskListTypes: i.taskListTypes ? i.taskListTypes.concat([type]) : [type],
    };

    return o;
  };

  const activityL = await descTaskList('Activity'),
    decisionL = await descTaskList('Decision');

  ctx.body = activityL.reduce(
    r('activity'),
    decisionL.reduce(r('decision'), {})
  );
};

module.exports = tasklistPollerListHandler;
