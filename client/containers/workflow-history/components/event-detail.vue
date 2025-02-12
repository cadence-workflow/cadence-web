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

import { DetailList } from '~components';

export default {
  name: 'event-detail',
  props: ['event', 'isHighlightEnabled', 'compact'],
  components: {
    'detail-list': DetailList,
  },
  render(h) {
    if (!this.event) {
      return null;
    }

    return h('detail-list', {
      props: {
        isHighlightEnabled: this.isHighlightEnabled,
        item: this.event,
        compact: this.compact,
        title: `Event #${this.event.eventId} ${this.event.eventType}`,
      },
      on: {
        onWorkflowHistoryEventParamToggle: event => {
          this.$emit('onWorkflowHistoryEventParamToggle', event);
        },
      },
    });
  },
};
</script>

<style lang="stylus">
@require "../../../styles/definitions.styl"

.event-node
  font-size 16px
  line-height 1.5em
  span
    vertical-align top
  &.DecisionTaskCompleted, &.DecisionTaskStarted, &.DecisionTaskScheduled
    > .event-id
      display none
    > .event-children > div
      margin-left 0
  &.ActivityTaskScheduled, &.TimerStarted, &.StartChildWorkflowExecutionInitiated
    position relative
    border input-border
    background-color uber-white-20
    padding 6px
    &.active
      border-color uber-black-60
  a.event-id
    display inline-block
    border-bottom 2px solid transparent
    font-family monospace-font-family
    font-weight normal
    margin-right inline-spacing-large
    padding 3px
    &::after
      content attr(data-event-id)
      margin-left 1em
      font-size 10px
      color base-text-color
      background-color uber-white-20
      border input-border
      padding 3px
      vertical-align top
    &.active
      border-bottom-color uber-blue

  span.group-title
    display block

  .event-children
    > div
      margin-left layout-spacing-medium

  dl.details
    width 100%
    > div
      display block
    dd
      max-width initial
      overflow visible
      white-space normal
      word-wrap break-word
</style>
