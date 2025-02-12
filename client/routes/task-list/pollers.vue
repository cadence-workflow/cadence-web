<script>
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

import { getDatetimeFormattedString } from '~helpers';
import { httpService } from '~services';

export default {
  props: ['dateFormat', 'domain', 'taskList', 'timeFormat', 'timezone'],
  data() {
    return {
      pollers: undefined,
      error: undefined,
      loading: true,
    };
  },
  computed: {
    formattedPollers() {
      const { dateFormat, pollers, timeFormat, timezone } = this;

      return (
        pollers &&
        pollers.map(poller => ({
          ...poller,
          lastAccessTime: getDatetimeFormattedString({
            date: poller.lastAccessTime,
            dateFormat,
            timeFormat,
            timezone,
          }),
        }))
      );
    },
  },
  created() {
    httpService
      .get(`/api/domains/${this.domain}/task-lists/${this.taskList}/pollers`)
      .then(
        p => {
          this.pollers = Object.keys(p).map(identity => ({
            identity,
            lastAccessTime: p[identity].lastAccessTime,
            handlesDecisions: p[identity].taskListTypes.includes('decision'),
            handlesActivities: p[identity].taskListTypes.includes('activity'),
          }));
        },
        e => {
          this.error = (e.json && e.json.message) || e.status || e.message;
        }
      )
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {},
};
</script>

<template>
  <section :class="{ 'task-list-pollers': true, loading }">
    <table v-if="pollers">
      <thead>
        <th>Identity</th>
        <th>Last Access Time</th>
        <th>Decision Handler</th>
        <th>Activity Handler</th>
      </thead>
      <tbody>
        <tr v-for="p in formattedPollers" :key="p.identity">
          <td>{{ p.identity }}</td>
          <td>{{ p.lastAccessTime }}</td>
          <td class="decision" :data-handled="p.handlesDecisions"></td>
          <td class="activity" :data-handled="p.handlesActivities"></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style lang="stylus">
@require "../../styles/definitions.styl"

section.task-list-pollers
  > header
    padding inline-spacing-medium
  table
    max-width 1600px
  td:nth-child(3), td:nth-child(4)
    width 230px
  td[data-handled="true"]
    padding-left 75px
    icon-check()
</style>
