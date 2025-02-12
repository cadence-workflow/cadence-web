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

import Prism from 'vue-prism-component';
import {
  DynamicScroller,
  DynamicScrollerItem,
  RecycleScroller,
} from 'vue-virtual-scroller';
import debounce from 'lodash-es/debounce';
import omit from 'lodash-es/omit';
import {
  EventDetail,
  FooterToolbar,
  Timeline,
  WorkflowGraph,
} from './components';
import { GRAPH_VIEW_DAG, GRAPH_VIEW_TIMELINE } from './constants';
import { getDefaultSplitSize } from './helpers';
import {
  DetailList,
  FeatureFlag,
  HighlightToggle,
  SelectInput,
} from '~components';

import { httpService } from '~services';

export default {
  name: 'history',
  data() {
    return {
      compactDetails:
        localStorage.getItem(`${this.domain}:history-compact-details`) ===
        'true',
      scrolledToEventOnInit: false,
      splitEnabled: false,
      eventType: 'All',
      eventTypes: [
        { value: 'All', label: 'All' },
        { value: 'Decision', label: 'Decision' },
        { value: 'Activity', label: 'Activity' },
        { value: 'Signal', label: 'Signal' },
        { value: 'Timer', label: 'Timer' },
        { value: 'ChildWorkflow', label: 'ChildWorkflow' },
        { value: 'Workflow', label: 'Workflow' },
      ],
      splitSizeSet: [1, 99],
      splitSizeMinSet: [0, 0],
      unwatch: [],

      // allows render method to reference constants
      GRAPH_VIEW_DAG: GRAPH_VIEW_DAG,
      GRAPH_VIEW_TIMELINE: GRAPH_VIEW_TIMELINE,
    };
  },
  props: [
    'baseAPIURL',
    'clusterName',
    'domain',
    'eventId',
    'events',
    'format',
    'graphEnabled',
    'graphView',
    'isWorkflowRunning',
    'loading',
    'pendingTaskCount',
    'runId',
    'timelineEvents',
    'workflowHistoryEventHighlightList',
    'workflowHistoryEventHighlightListEnabled',
    'workflowId',
  ],
  created() {
    this.onResizeWindow = debounce(() => {
      const { scrollerCompact, scrollerGrid, viewSplit } = this.$refs;
      const scroller = this.isGrid ? scrollerGrid : scrollerCompact;

      if (!scroller) {
        return;
      }

      const offsetHeight = this.isGrid ? 60 + 38 : 0;
      const viewSplitHeight = viewSplit.$el.offsetHeight;
      const scrollerHeight = viewSplitHeight - offsetHeight;

      scroller.$el.style.height = `${scrollerHeight}px`;
    }, 5);
  },
  mounted() {
    this.setSplitSize();
    this.unwatch.push(
      this.$watch(
        () =>
          `${this.events.length}${this.$route.query.format}${this.compactDetails}`,
        this.onResizeWindow,
        { immediate: true }
      )
    );
    window.addEventListener('resize', this.onResizeWindow);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResizeWindow);
    while (this.unwatch.length) {
      this.unwatch.pop()();
    }
  },
  computed: {
    selectedViewingFormat() {
      return (
        this.format ||
        localStorage.getItem(`${this.domain}:history-viewing-format`) ||
        'compact'
      );
    },
    exportFilename() {
      return `${this.workflowId.replace(/[\\~#%&*{}/:<>?|"-]/g, ' ')} - ${
        this.runId
      }.json`;
    },
    filteredEvents() {
      const { eventId, eventType } = this;
      const formattedEvents = this.events.map(event => ({
        ...event,
        expanded: event.eventId === eventId,
      }));

      return eventType && eventType !== 'All'
        ? formattedEvents.filter(result => result.eventType.includes(eventType))
        : formattedEvents;
    },
    filteredEventIdToIndex() {
      return this.filteredEvents
        .map(({ eventId }) => eventId)
        .reduce((accumulator, eventId, index) => {
          accumulator[eventId] = index;

          return accumulator;
        }, {});
    },
    isGrid() {
      return this.selectedViewingFormat === 'grid';
    },
    selectedTimelineEvent() {
      return this.timelineEvents.find(te => te.eventIds.includes(this.eventId));
    },
    selectedEvent() {
      return this.events.find(e => e.eventId === this.eventId);
    },
    selectedEventDetails() {
      if (!this.selectedEvent) {
        return {};
      }

      return {
        timestamp: this.selectedEvent.timeStampDisplay,
        eventId: this.selectedEvent.eventId,
        ...this.selectedEvent.details,
      };
    },
    showTable() {
      return this.loading || this.events.length;
    },
    showNoResults() {
      return !this.loading && this.events.length === 0;
    },
    splitDirection() {
      return this.graphView === GRAPH_VIEW_DAG ? 'horizontal' : 'vertical';
    },
    timelineEventIdToIndex() {
      return this.timelineEvents
        .map(({ eventIds }) => eventIds)
        .reduce(
          (accumulator, eventIds, index) => ({
            ...accumulator,
            ...eventIds.reduce((acc, eventId) => {
              acc[eventId] = index;

              return acc;
            }, {}),
          }),
          {}
        );
    },
  },
  methods: {
    setSplitSize() {
      const { graphView } = this;

      this.splitSizeSet = getDefaultSplitSize({ graphView });
      this.onSplitResize();
    },
    deselectEvent() {
      this.$router.replace({ query: omit(this.$route.query, 'eventId') });
    },
    enableSplitting() {
      if (!this.splitEnabled && this.graphView === GRAPH_VIEW_TIMELINE) {
        const timelineHeightPct =
          (this.$refs.splitPanel.$el.firstElementChild.offsetHeight /
            this.$refs.splitPanel.$el.offsetHeight) *
          100;

        this.splitSizeSet = [timelineHeightPct, 100 - timelineHeightPct];
        this.splitEnabled = true;
      }
    },
    onSplitResize: debounce(() => {
      window.dispatchEvent(new Event('resize'));
    }, 5),
    onWorkflowHistoryEventParamToggle(event) {
      this.$emit('onWorkflowHistoryEventParamToggle', event);
    },
    setEventType(et) {
      this.eventType = et.value;
      setTimeout(() => this.scrollEventIntoView(this.eventId), 100);
    },
    setFormat(format) {
      this.$router.replace({
        query: { ...this.$route.query, format },
      });

      if (typeof format === 'string') {
        localStorage.setItem(`${this.domain}:history-viewing-format`, format);
      }

      setTimeout(() => this.scrollEventIntoView(this.eventId), 100);
    },
    setCompactDetails(compact) {
      const { scrollerGrid } = this.$refs;

      this.compactDetails = compact;
      localStorage.setItem(
        `${this.domain}:history-compact-details`,
        JSON.stringify(compact)
      );
      scrollerGrid.forceUpdate();
      setTimeout(() => this.scrollEventIntoView(this.eventId), 100);
    },
    scrollEventIntoView(eventId) {
      const index = this.isGrid
        ? this.filteredEventIdToIndex[eventId]
        : this.timelineEventIdToIndex[eventId];

      this.scrollToItem(index);

      if (this.isGrid) {
        // Need to fire twice as the scroller items can have dynamic height which causes the scrolling position to not be accurate.
        setTimeout(() => this.scrollToItem(index, true), 100);
      }
    },
    scrollToItem(index, forceUpdate) {
      const { scrollerCompact, scrollerGrid } = this.$refs;
      const scroller = this.isGrid ? scrollerGrid : scrollerCompact;

      if (index === undefined || !scroller) {
        return;
      }

      try {
        scroller.scrollToItem(index);

        if (forceUpdate) {
          scroller.forceUpdate();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('vue-virtual-scroller: Could not scrollToItem:', error);
      }
    },
    selectTimelineEvent(i) {
      this.$router.replaceQueryParam(
        'eventId',
        i.eventIds[i.eventIds.length - 1]
      );
    },
    toggleShowDagGraph() {
      if (this.graphView === GRAPH_VIEW_DAG) {
        this.$router.replace({
          query: omit(this.$route.query, 'graphView'),
        });
      } else {
        this.$router.replace({
          query: { ...this.$route.query, graphView: GRAPH_VIEW_DAG },
        });
      }
    },
    toggleShowTimeline() {
      if (this.graphView === GRAPH_VIEW_TIMELINE) {
        this.$router.replace({
          query: omit(this.$route.query, 'graphView'),
        });
      } else {
        this.$router.replace({
          query: { ...this.$route.query, graphView: GRAPH_VIEW_TIMELINE },
        });
      }
    },
    exportHistory(e) {
      const target = e.target;

      httpService.get(this.baseAPIURL + '/export').then(historyJson => {
        const blob = new Blob([JSON.stringify(historyJson)], {
          type: 'application/json',
        });

        target.href = window.URL.createObjectURL(blob);
        target.download = this.exportFilename;
        target.click();
      });

      return false;
    },
  },
  watch: {
    eventId(eventId) {
      this.scrollEventIntoView(eventId);
    },
    filteredEvents() {
      if (
        !this.scrolledToEventOnInit &&
        this.eventId !== undefined &&
        this.filteredEventIdToIndex[this.eventId] !== undefined
      ) {
        this.scrolledToEventOnInit = true;
        setTimeout(() => this.scrollEventIntoView(this.eventId), 100);
      }
    },
    graphView() {
      this.setSplitSize();
    },
  },
  components: {
    'detail-list': DetailList,
    DynamicScroller,
    DynamicScrollerItem,
    'event-detail': EventDetail,
    'feature-flag': FeatureFlag,
    'footer-toolbar': FooterToolbar,
    'highlight-toggle': HighlightToggle,
    prism: Prism,
    RecycleScroller,
    'select-input': SelectInput,
    WorkflowGraph,
    timeline: Timeline,
  },
};
</script>

<template>
  <section
    :class="{
      history: true,
      loading,
      'has-results': !!events.length,
      'split-enabled': true,
    }"
  >
    <header class="controls">
      <div class="view-format">
        <label for="format">View Format</label>
        <div class="view-formats">
          <a
            href="#"
            class="compact"
            @click.prevent="setFormat('compact')"
            :class="selectedViewingFormat === 'compact' ? 'active' : ''"
            >Compact</a
          >
          <a
            href="#"
            class="grid"
            @click.prevent="setFormat('grid')"
            :class="selectedViewingFormat === 'grid' ? 'active' : ''"
            >Grid</a
          >
          <a
            href="#"
            class="json"
            @click.prevent="setFormat('json')"
            :class="selectedViewingFormat === 'json' ? 'active' : ''"
            >JSON</a
          >
        </div>
      </div>
      <div class="actions">
        <feature-flag name="workflowGraph" v-if="graphEnabled">
          <a href="#" @click.prevent="toggleShowDagGraph()"
            >{{ graphView === GRAPH_VIEW_DAG ? 'hide' : 'show' }} graph</a
          >
        </feature-flag>
        <a
          href="#"
          @click.prevent="toggleShowTimeline()"
          class="show-timeline-btn"
          >{{ graphView === GRAPH_VIEW_TIMELINE ? 'hide' : 'show' }} timeline</a
        >
        <a class="export" href="#" @click.once.prevent="exportHistory"
          >Export</a
        >
      </div>
    </header>
    <Split
      class="split-panel"
      :class="graphView === GRAPH_VIEW_DAG ? 'dag-graph' : ''"
      :direction="splitDirection"
      @onDrag="onSplitResize"
      @onDragStart="enableSplitting"
      v-if="!showNoResults"
      ref="splitPanel"
    >
      <SplitArea
        class="timeline-split"
        :min-size="splitSizeMinSet[0]"
        :size="splitSizeSet[0]"
      >
        <feature-flag
          name="workflowGraph"
          v-if="graphEnabled && graphView === GRAPH_VIEW_DAG && events.length"
        >
          <WorkflowGraph
            :events="events"
            :isWorkflowRunning="isWorkflowRunning"
            :selected-event-id="eventId"
            class="tree-view"
          />
        </feature-flag>
        <timeline
          :events="timelineEvents"
          :selected-event-id="eventId"
          v-if="graphView === GRAPH_VIEW_TIMELINE"
        />
      </SplitArea>
      <SplitArea
        class="view-split"
        :min-size="splitSizeMinSet[1]"
        ref="viewSplit"
        :size="splitSizeSet[1]"
      >
        <section v-snapscroll class="results" ref="results">
          <div
            class="table"
            v-if="selectedViewingFormat === 'grid' && showTable"
            :class="{ compact: compactDetails }"
          >
            <div class="thead">
              <div class="th col-id">ID</div>
              <div class="th col-type">
                <select-input
                  background-color="rgb(248, 248, 249)"
                  label="Type"
                  min-width="150px"
                  :options="eventTypes"
                  :value="eventType"
                  @change="setEventType"
                />
              </div>
              <div class="th col-time">
                Time
              </div>
              <div class="th col-elapsed-time">
                Elapsed
              </div>
              <div class="th col-summary">
                <a
                  class="summary"
                  :href="compactDetails ? null : '#'"
                  @click.prevent="setCompactDetails(true)"
                  >Summary</a
                >
                /
                <a
                  class="details"
                  :href="compactDetails ? '#' : null"
                  @click.prevent="setCompactDetails(false)"
                  >Full Details</a
                >
              </div>
            </div>
            <div class="spacer" />
            <DynamicScroller
              key-field="eventId"
              :items="filteredEvents"
              :min-item-size="38"
              ref="scrollerGrid"
              style="height: 0px;"
            >
              <template v-slot="{ item, index, active }">
                <DynamicScrollerItem
                  class="scroller-item"
                  :active="active"
                  :data-active="active"
                  :data-index="index"
                  :item="item"
                >
                  <div
                    class="tr"
                    :class="{ active: item.expanded, odd: index % 2 === 1 }"
                    :data-event-type="item.eventType"
                    :data-event-id="item.eventId"
                    @click.prevent="
                      $router.replaceQueryParam('eventId', item.eventId)
                    "
                  >
                    <div class="td col-id">{{ item.eventId }}</div>
                    <div class="td col-type">
                      <highlight-toggle
                        :is-highlighted="item.details.isHighlighted"
                        :label="item.eventType"
                      />
                    </div>
                    <div class="td col-time">
                      {{ item.timeStampDisplay }}
                    </div>
                    <div class="td col-elapsed-time">
                      {{ item.timeElapsedDisplay }}
                    </div>
                    <div class="td col-summary">
                      <event-detail
                        :event="
                          compactDetails && !item.expanded
                            ? item.eventSummary
                            : item.eventFullDetails
                        "
                        :is-highlight-enabled="
                          compactDetails && !item.expanded
                            ? false
                            : workflowHistoryEventHighlightListEnabled
                        "
                        :compact="compactDetails && !item.expanded"
                        @onWorkflowHistoryEventParamToggle="
                          eventParam =>
                            onWorkflowHistoryEventParamToggle({
                              eventParam,
                              eventType: item.eventType,
                            })
                        "
                      />
                    </div>
                  </div>
                </DynamicScrollerItem>
              </template>
            </DynamicScroller>
            <footer-toolbar
              :cluster-name="clusterName"
              :pending-task-count="pendingTaskCount"
            />
          </div>
          <prism
            class="json"
            language="json"
            v-if="selectedViewingFormat === 'json' && events.length < 90"
            >{{ JSON.stringify(events, null, 2) }}</prism
          >
          <pre
            class="json"
            v-if="selectedViewingFormat === 'json' && events.length >= 90"
            >{{ JSON.stringify(events, null, 2) }}</pre
          >
          <div class="compact-view" v-if="selectedViewingFormat === 'compact'">
            <RecycleScroller
              class="scroller-compact"
              key-field="id"
              :items="timelineEvents"
              :item-size="70"
              ref="scrollerCompact"
              style="height: 0px;"
            >
              <template v-slot="{ item }">
                <div
                  :class="
                    `timeline-event ${item.className || ''} ${
                      item === selectedTimelineEvent ? ' vis-selected' : ''
                    }`
                  "
                  @click.prevent="selectTimelineEvent(item)"
                >
                  <span class="event-title">{{ item.content }}</span>
                  <detail-list
                    :compact="true"
                    :is-highlight-enabled="false"
                    :item="item.details"
                    :title="item.content"
                  />
                </div>
              </template>
            </RecycleScroller>
            <div
              class="selected-event-detail"
              v-if="selectedTimelineEvent"
              :class="{ active: !!selectedTimelineEvent }"
            >
              <a href="#" class="close" @click.prevent="deselectEvent"></a>
              <span
                class="event-title"
                v-if="!selectedTimelineEvent.titleLink"
                >{{ selectedTimelineEvent.content }}</span
              >
              <router-link
                class="event-title"
                v-if="selectedTimelineEvent.titleLink"
                :to="selectedTimelineEvent.titleLink"
                >{{ selectedTimelineEvent.content }}</router-link
              >
              <detail-list
                class="timeline-details"
                :is-highlight-enabled="false"
                :item="selectedTimelineEvent.details"
                :title="selectedTimelineEvent.content"
              />
              <div class="event-tabs">
                <span>Events</span>
                <a
                  href="#"
                  :class="'event' + (eventId === eid ? ' active' : '')"
                  v-for="eid in selectedTimelineEvent.eventIds"
                  :key="eid"
                  @click.prevent="$router.replaceQueryParam('eventId', eid)"
                  :data-event-id="eid"
                >
                  <highlight-toggle
                    :is-highlighted="
                      events.find(event => event.eventId === eid).details
                        .isHighlighted
                    "
                    :label="
                      events.find(event => event.eventId === eid).eventType
                    "
                  />
                </a>
              </div>
              <detail-list
                class="event-detail"
                :is-highlight-enabled="workflowHistoryEventHighlightListEnabled"
                :item="selectedEventDetails"
                :title="
                  `${selectedTimelineEvent.content} - ${selectedEvent.eventType}`
                "
                @onWorkflowHistoryEventParamToggle="
                  eventParam =>
                    onWorkflowHistoryEventParamToggle({
                      eventParam,
                      eventType: selectedEvent.eventType,
                    })
                "
              />
            </div>
          </div>
        </section>
      </SplitArea>
    </Split>

    <span class="no-results" v-if="showNoResults">No Results</span>
  </section>
</template>

<style lang="stylus">
@require '../../styles/definitions.styl';

section.history {
  brdr = 1px solid uber-black-60;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;

  header.controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: inline-spacing-large;
    flex: 0 0 auto;

    .field {
      flex: 1 1 auto;
    }

    & > div {
      display: flex;
      align-items: center;

      & > * {
        margin: inline-spacing-small;
      }
    }

    a {
      action-button();
    }
  }

  .view-formats {
    display: flex;

    a {
      flex: 0 0 auto;
      margin: 0;
      text-transform: none;

      &.active {
        background-color: darken(uber-blue, 20%);
      }
    }
  }

  paged-grid();

  &:not(.has-results) header .actions {
    display: none;
  }

  &.loading.has-results {
    &::after {
      content: none;
    }
  }

  a.export {
    icon-download();
  }

  .gutter.gutter-vertical {
    border-top: 1px solid uber-white-80;
    border-bottom: 1px solid uber-white-80;
    background-color: uber-white-20;
  }

  .split-panel.split.dag-graph {
    display: flex;
    flex-direction: row-reverse;
  }

  div.split-panel {
    .timeline-split {
      overflow: hidden;
      .feature-flag {
        height: 100%;
      }
    }

    .view-split {
      flex: 1;
      overflow: hidden;
      display: flex;
      position: relative;
      flex-direction: column;
    }
  }

  &:not(.split-enabled) div.split-panel {
    display: flex;
    flex-direction: column;
    flex: 1;

    .gutter {
      flex: 0 0 auto;
    }

    .timeline-split {
      flex: 0 0 auto;
      max-height: 350px;
    }
  }

  &.split-enabled div.split-panel {
    height: calc(100vh - 188px);
  }

  section pre {
    border: brdr;
    overflow: auto;
  }

  .table {
    .vue-recycle-scroller__slot, .vue-recycle-scroller__item-view, .scroller-item {
      display: flex;
      width: 100%;
      overflow-wrap: anywhere;
    }

    .col-id {
      min-width: 50px;
    }

    .col-summary {
      flex: 1;
    }

    .col-time, .col-elapsed-time {
      min-width: 150px;
    }

    .col-type {
      min-width: 212px;
    }

    .thead {
      background-color: uber-white-10;
      box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
      position: absolute;
      display: flex;
      top: 0;
      left: 0;
      z-index: 2;
      width: calc(100% - 10px);

      .th {
        color: rgb(0, 0, 0);
        display: inline-block;
        font-weight: 500;
        text-transform: uppercase;
      }

      & + .spacer {
        width: 100%;
        height: 60px;
      }
    }

    .tr {
      display: flex;
      flex: 1;
      border: 1px solid transparent;

      &.odd {
        background-color: #f8f8f9;
      }
    }

    .td, .th {
      flex-basis: auto;
      padding: 8px;
    }

    .th a:not([href]) {
      border-bottom: 1px solid black;
    }

    .td:nth-child(3), .td:nth-child(2) {
      one-liner-ellipsis();
    }

    .tr[data-event-type*='Started'] .td:nth-child(2) {
      color: uber-blue-120;
    }

    .tr[data-event-type*='Failed'], .tr[data-event-type*='TimedOut'] {
      .td:nth-child(2), [data-prop='reason'], [data-prop='details'] {
        color: uber-orange;
      }
    }

    .tr[data-event-type*='Completed'] {
      .td:nth-child(2), [data-prop='result'] dt {
        color: uber-green;
      }
    }

    .tr.active {
      border-top: brdr;
      border-bottom: brdr;
      background-color: alpha(uber-blue, 5%);
    }

    pre {
      max-height: 15vh;
    }

    &.compact .tr:not(.active) {
      .td:nth-child(4) {
        overflow: hidden;
      }

      dl.details {
        max-width: 50vw;
      }
    }
  }

  .table.compact .tr:not(.active), .compact-view .timeline-event {
    dl.details {
      white-space: nowrap;

      & > div {
        display: inline-block;
        padding: 0;

        &:nth-child(2n) {
          background: none;
        }
      }

      dt, dd {
        display: inline-block;
        vertical-align: middle;
        margin: 0 0.5em;
      }

      dt {
        font-family: primary-font-family;
        font-weight: 200;
        text-transform: uppercase;
      }

      pre {
        display: inline-block;
        max-width: 40vw;
        one-liner-ellipsis();
      }
    }
  }

  section.results {
    flex: 1;

    & > pre {
      margin: layout-spacing-small;
      padding: layout-spacing-small;
    }
  }

  wide-title-width = 400px;

  .hidden {
    display: none;
  }

  .compact-view {
    line-height: 1.5em;
    overflow-y: auto;

    .scroller-compact {
      padding: layout-spacing-small;
      padding-bottom: 0;
    }

    .event-title {
      padding: 4px;
      font-size: 16px;
    }

    pre {
      max-height: 15vh;
    }

    .timeline-event {
      border: 2px solid primary-color;
      cursor: pointer;
      padding: 6px;
      margin-bottom: layout-spacing-small;
      history-item-state-color(3%);

      dl.details dd {
        max-width: none;
      }

      @media (max-width: 1400px) {
        dl.details {
          display: none;
        }
      }

      @media (min-width: 1400px) {
        display: flex;
        align-items: center;

        .event-title {
          flex: 0 0 wide-title-width;
        }

        dl.details {
          flex: 1;
          align-items: center;
          overflow: hidden;

          pre {
            max-width: none;
          }
        }
      }
    }

    .selected-event-detail {
      position: absolute;
      width: 'calc(100vw - %s)' % (wide-title-width + 30px);
      height: 100%;
      top: 0;
      left: wide-title-width + 15px;
      overflow: auto;
      background-color: white;
      padding: layout-spacing-small;
      border-left: 1px solid uber-black-80;
      box-shadow: -5px 0 5px rgba(0, 0, 0, 0.25);

      .event-title {
        display: block;
        font-size: 1.4em;
        margin-bottom: 0.5em;
      }

      .event-tabs {
        // border-bottom 1px solid uber-black-60
        margin-bottom: layout-spacing-small;
        margin-top: layout-spacing-small;

        a {
          display: inline-block;
          padding: inline-spacing-medium;
          font-family: monospace-font-family;
          border-bottom: 2px solid transparent;

          &.active {
            border-bottom-color: primary-color;
          }
        }

        & > span {
          font-weight: 200;
          text-transform: uppercase;
          font-size: 11px;
        }
      }

      dl.details {
        background-color: alpha(uber-white-80, 0.2);

        &.timeline-details dt, dd {
          padding: 4px;
        }
      }

      a.close {
        top: layout-spacing-small;
      }
    }
  }
}
</style>
