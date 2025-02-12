<script>
// Copyright (c) 2020-2025 Uber Technologies Inc.
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

import cytoscape from 'cytoscape';
import omit from 'lodash-es/omit';
import { mapMutations } from 'vuex';
import { getGraphPanCenter, selectNode } from '../helpers';
import cytoscapeLayout from '../helpers/cytoscape-layout';
import {
  CYTOSCAPE_DEFAULT_OPTIONS,
  GRAPH_ZOOM_DEFAULT,
  GRAPH_ZOOM_MAX,
  GRAPH_ZOOM_MIN,
} from '../constants';

cytoscape.use(cytoscapeLayout);

export default {
  name: 'graph',
  props: ['events', 'selectedEventId'],
  watch: {
    selectedEventId(id) {
      this.selectNode(id);
    },
  },
  methods: {
    ...mapMutations(['childRoute', 'toggleChildBtn']),
    zoomToNode(node) {
      const pan = getGraphPanCenter({
        boundingBox: node.boundingBox(),
        height: this.cy.height(),
        width: this.cy.width(),
      });

      // Pan the graph to view node
      this.cy.animate({
        zoom: GRAPH_ZOOM_DEFAULT,
        pan,
      });
    },
    updateChildBtn(node) {
      const nodeData = node.data();

      if (nodeData.childRoute) {
        this.childRoute({ route: nodeData.childRoute, btnText: 'To child' });
      } else if (nodeData.newExecutionRunId) {
        this.childRoute({
          route: nodeData.newExecutionRunId,
          btnText: 'Next execution',
        });
      } else {
        this.toggleChildBtn();
      }
    },
    selectNode(id) {
      // Update graph to render nodes around the select one
      this.updateView(id);

      // Deselect all previously selected nodes
      this.cy.$(':selected').deselect();

      // Mark current node as selected
      const node =
        id !== null && id !== undefined ? this.cy.nodes('node#' + id) : null;

      if (node && node.length) {
        // Zoom to the selected node
        node.select();
        this.updateChildBtn(node);
        this.zoomToNode(node);
      }
    },
    initView(elements) {
      if (this.cy) {
        this.cy.unmount();
        this.cy.destroy();
        this.cy = null;
      }

      // Create cy instance
      const container = this.$refs.cy;
      const cy = cytoscape({
        ...CYTOSCAPE_DEFAULT_OPTIONS,
        container,
        elements,
      });

      cy.minZoom(GRAPH_ZOOM_MIN);
      cy.maxZoom(GRAPH_ZOOM_MAX);

      cy.on('mouseover', 'node', function(e) {
        container.style.cursor = 'pointer';
      });
      cy.on('mouseout', 'node', function(e) {
        container.style.cursor = 'default';
      });

      // Register click event
      cy.on('tap', ({ target: eventTarget }) => {
        // Tap on background
        if (eventTarget === cy) {
          if (this.selectedEventId) {
            this.$router.replace({ query: omit(this.$route.query, 'eventId') });
            this.$store.commit('toggleChildBtn');
          }
        }
        // Tap on a node that is not already selected
        else if (eventTarget.isNode() && !eventTarget.selected()) {
          const nodeData = eventTarget.data();

          this.$router.replace({
            query: { ...this.$route.query, eventId: nodeData.id },
          });
        }
      });
      cy.mount(container);
      this.cy = cy;
      this.cy.fit();
    },
    updateView(id = null) {
      if (this.cy && id === null) {
        // Do nothing if graph is rendered and user clicks somewhere between nodes
        return;
      }

      const {
        shouldRedraw,
        elements,
        previousExecutionRunId,
        parentWorkflowExecution,
        sliceIndices,
      } = selectNode({
        events: this.events,
        selectedEventId: id,
        sliceIndices: this.sliceIndices,
      });

      this.sliceIndices = sliceIndices;

      if (!shouldRedraw) {
        return;
      }

      // Currently viewing a child workflow, show parent button
      if (previousExecutionRunId) {
        this.$store.commit('previousExecutionRoute', previousExecutionRunId);
      } else if (parentWorkflowExecution) {
        this.$store.commit('parentRoute', parentWorkflowExecution);
      }

      this.initView(elements);
    },
  },
  mounted() {
    this.sliceIndices = null;
    this.selectNode(this.selectedEventId);
  },
};
</script>

<template>
  <div id="cytoscape">
    <div ref="cy" id="cy"></div>
  </div>
</template>

<style scoped>
#cytoscape {
  width: 100%;
  height: 100%;
}
#cy {
  width: 100%;
  height: 100%;
}
</style>
