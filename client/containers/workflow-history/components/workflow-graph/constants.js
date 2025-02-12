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

export const CYTOSCAPE_LAYOUT_DEFAULTS = {
  // Horizontal `x` offset between same level nodes
  levelStep: 300,

  // Offset between primary chronological layers
  timeStep: 90,

  // Offset between primary and secondary chronological layers (having the same timestamps)
  secondaryTimeStep: 65,
};
export const CYTOSCAPE_LAYOUT_NAME = 'cadence';
export const CYTOSCAPE_GRAPH_STYLES = [
  {
    selector: 'node',
    style: {
      height: 'label',
      width: 'label',
      padding: '10px',
      'font-weight': '200',
      'font-family': 'Avenir, Helvetica, Arial, sans-serif',
      'background-color': 'white',
      'border-radius': 5,
      'min-zoomed-font-size': 8,
      shape: 'round-rectangle',
      'border-color': '#d1d1d1',
      'border-width': 1.2,
      label: 'data(name)',
      'text-valign': 'center',
      'text-halign': 'center',
    },
  },
  {
    selector: "node[status = 'completed']",
    style: {
      'border-color': '#26bd77',
      'border-width': 1,
      'background-color': '#dcffe6',
    },
  },
  {
    selector: "node[status = 'failed']",
    style: {
      'border-color': '#ff6c6c',
      'border-width': 1,
      'background-color': '#ffcccc',
    },
  },
  {
    selector: 'node:selected',
    style: { 'border-color': '#11939A', 'border-width': 2 },
  },
  {
    selector: "node[status = 'failed']:selected",
    style: { 'border-color': '#ff6c6c', 'border-width': 2.5 },
  },
  {
    selector: "node[status = 'completed']:selected",
    style: { 'border-color': '#26bd77', 'border-width': 2.5 },
  },
  {
    selector: 'edge',
    style: {
      'border-color': '#26bd77',
      'border-width': 2.5,
      'target-arrow-shape': 'triangle',
      'target-arrow-color': '#2c3e50',
      'line-color': '#2c3e50',
      width: 1.5,
      'curve-style': 'bezier', //'hay-stack' <- set to improve perfomance
    },
  },
  {
    selector: "edge[type = 'inferred']",
    style: {
      'target-arrow-color': '#ECAB20',
      'line-color': '#ECAB20',
    },
  },
  {
    selector: "edge[type = 'chronological']",
    style: {
      'target-arrow-color': '#5879DA',
      'line-color': '#5879DA',
    },
  },
];
export const CYTOSCAPE_DEFAULT_OPTIONS = {
  autoungrabify: true,
  headless: true,
  hideEdgesOnViewport: true,
  layout: {
    name: CYTOSCAPE_LAYOUT_NAME,
  },
  style: CYTOSCAPE_GRAPH_STYLES,
  styleEnabled: true,

  // NOTE: Uncomment the two lines below for better performance
  // textureOnViewport: true,
  // pixelRatio: 1,
};

export const GRAPH_SLICE_SIZE = 300;
export const GRAPH_SLICE_DELTA_MAX = GRAPH_SLICE_SIZE * 0.3;
export const GRAPH_SHOW_DELAY = 400;
export const GRAPH_ZOOM_DEFAULT = 1.1;
export const GRAPH_ZOOM_MAX = 10;
export const GRAPH_ZOOM_MIN = 0.1;

export const LEGEND_CONNECTION_LIST = [
  {
    name: 'direct',
    text:
      'Represents direct connections, when a child has the id of the parent',
  },
  { name: 'chron', text: 'Represents chronological connections' },
  {
    name: 'inferred',
    text: 'Represents connections between a signal and its triggered child ',
  },
];
