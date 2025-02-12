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

import moment from 'moment';
import { Timeline, timeline } from 'vis-timeline';
import { DataSet } from 'vis-data';

if (navigator.language === 'en-US') {
  timeline.TimeStep.FORMAT.minorLabels.minute = 'h:mm a';
  timeline.TimeStep.FORMAT.minorLabels.hour = 'h:mm a';
  timeline.TimeStep.FORMAT.majorLabels.millisecond = 'h:mm:ss a';
  timeline.TimeStep.FORMAT.majorLabels.second = 'D MMMM h:mm a';
  timeline.TimeStep.FORMAT.majorLabels.minute = 'ddd MMMM Do';
  timeline.TimeStep.FORMAT.majorLabels.hour = 'ddd MMMM Do';
}

export default {
  props: ['events', 'selectedEventId'],
  data() {
    return {
      margin: 10,
      minHeight: 50,
      unwatch: [],
    };
  },
  methods: {
    heightOption() {
      const height = this.$el.parentElement.offsetHeight - this.margin;

      if (height <= this.minHeight) {
        const parentMaxHeightStr = getComputedStyle(this.$el.parentElement)[
          'max-height'
        ];
        const parentMaxHeight = Number(
          parentMaxHeightStr.substr(0, parentMaxHeightStr.length - 2)
        );

        if (parentMaxHeight >= this.minHeight) {
          return { maxHeight: parentMaxHeight };
        }
      }

      return {
        height: Math.max(height || 0, this.minHeight),
        maxHeight: 'initial',
      };
    },
    initIfNeeded() {
      if (!this.timeline && this.items.length && this.$el) {
        this.timeline = new Timeline(this.$el, this.items, null, {
          verticalScroll: true,
          ...this.heightOption(),
        });
        this.$el.timeline = this.timeline; // expose for testing purposes

        let dontFocus;

        this.timeline.on('select', e => {
          const selectedItem = this.items.get(e.items[0]);

          if (selectedItem && selectedItem.eventIds) {
            dontFocus = true;
            this.$router.replaceQueryParam(
              'eventId',
              selectedItem.eventIds[selectedItem.eventIds.length - 1]
            );
          }
        });

        const highlightSelection = () => {
          const selectedEvent = this.findEvent(this.selectedEventId);

          this.timeline.setSelection(selectedEvent && selectedEvent.id);

          if (selectedEvent && !dontFocus) {
            this.timeline.focus(selectedEvent.id, true);
          }

          dontFocus = false;
        };

        this.unwatch.push(
          this.$watch('selectedEventId', highlightSelection, {
            immediate: true,
          })
        );
        this.unwatch.push(
          this.$watch('events', highlightSelection, { immediate: true })
        );
      }
    },
    findEvent(eventId) {
      return this.items
        .get()
        .find(i => i.eventIds && i.eventIds.some(id => id === eventId));
    },
  },
  created() {
    this.onResize = () => {
      if (this.timeline) {
        this.timeline.setOptions(this.heightOption());
        this.timeline.redraw();
      }
    };

    this.items = new DataSet();
    this.unwatch.push(
      this.$watch(
        'events',
        () => {
          const newIds = new DataSet(this.events).getIds();
          const removed = this.items.getIds().filter(i => !newIds.includes(i));

          this.items.update(this.events);
          this.items.remove(removed);
          this.initIfNeeded();
        },
        { immediate: true }
      )
    );
  },
  mounted() {
    this.initIfNeeded();
    window.addEventListener('resize', this.onResize);
    this.ongoingUpdater = setInterval(() => {
      this.items.forEach(i => {
        if (i.ongoing) {
          // eslint-disable-next-line no-param-reassign
          i.end = moment();
          this.items.update(i);
        }
      });
    }, 50);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    clearInterval(this.ongoingUpdater);
    while (this.unwatch.length) {
      this.unwatch.pop()();
    }

    if (this.timeline) {
      this.timeline.destroy();
    }
  },
};
</script>

<template>
  <div class="timeline"></div>
</template>

<style lang="stylus">
@require "../../../styles/definitions.styl"
@require "../../../styles/vis.styl"

div.timeline
  padding 0 10px
  margin-bottom inline-spacing-medium

  .vis-timeline {
    visibility: visible !important;
  }

  .vis-item
    border-color primary-color
    &.vis-selected
      box-shadow 2px 2px 2px rgba(0,0,0,0.3)
    &.vis-box
      history-item-state-color(10%)
    &.vis-range
      history-item-state-color(25%)

    &.timer
      border-top none
      border-bottom none
      background none
      border-left-width 2px
      border-right-width 2px
      .vis-item-visible-frame
        position absolute
        top 50%
        left 0
        height 3px
        width 100%
        opacity 0.4
        z-index -1
        background-position 0 5px
        background-size 20px 1px
        background-image linear-gradient(90deg, uber-blue-60, uber-blue-60 75%, transparent 75%, transparent 100%)

    &.marker
      border-color black
</style>
