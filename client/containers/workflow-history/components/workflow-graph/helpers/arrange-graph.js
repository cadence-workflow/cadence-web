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

import { orderBy } from 'lodash-es';
import { CYTOSCAPE_LAYOUT_NAME } from '../constants';
import arrangeNodes from './arrange-nodes';
import getTimeIndexPairKey from './get-time-index-pair-key';

const arrangeGraph = ({ nodes, edges }, options) => {
  const idToNode = {};
  const idToChildren = {};
  const timeIndices = {};
  const hasParent = {};
  const rootNodes = [];

  // Iterate through nodes and set `timeIndex` and `timeIndexSecondary` for every node
  // timeIndex is an index of the node timestamp in a sorted array of all timestamps
  // Which is used to keep the chronogical order of nodes but discard the scale of time intervals
  // when drawing the graph
  nodes.forEach(node => {
    idToNode[node.id()] = node;
    idToChildren[node.id()] = [];
    const timestamp = node.data().timestamp;

    if (timeIndices[timestamp] === undefined) {
      timeIndices[timestamp] = Object.keys(timeIndices).length;
    }

    node.scratch(CYTOSCAPE_LAYOUT_NAME, {
      timeIndex: timeIndices[timestamp],
      timeIndexSecondary: 0,
    });
  });

  // Find all roots (entry points with no parents) of the graph
  for (const edge of edges) {
    idToChildren[edge.data().source].push(idToNode[edge.data().target]);
    hasParent[edge.data().target] = true;
  }

  for (const node of nodes) {
    if (!hasParent[node.id()]) {
      rootNodes.push(node);
    }
  }

  // Arrange all nodes in the graph, starting from root entry points
  arrangeNodes({ idToChildren, nodes: rootNodes });

  // Calculate `tTimes` for all (timeIndex, timeIndexSecondary) pairs
  // which are the time (Y) coordinates nodes in the graph
  let t = 0;
  let prevT1 = 0;
  let prevT2 = 0;
  const tTimes = {};
  const times = orderBy(
    nodes.map(n => ({
      t1: n.scratch(CYTOSCAPE_LAYOUT_NAME).timeIndex,
      t2: n.scratch(CYTOSCAPE_LAYOUT_NAME).timeIndexSecondary,
    })),
    ['t1', 't2']
  );

  times.forEach(({ t1, t2 }) => {
    const key = getTimeIndexPairKey(t1, t2);

    if (t1 === prevT1) {
      t += (t2 - prevT2) * options.secondaryTimeStep;
    }

    t += (t1 - prevT1) * options.timeStep;
    prevT1 = t1;
    prevT2 = t2;

    tTimes[key] = t;
  });

  // Set the `position` for all nodes using the calculated `level` and `tTimes` values
  nodes.forEach(node => {
    const nodeScratch = node.scratch(CYTOSCAPE_LAYOUT_NAME);
    const key = getTimeIndexPairKey(
      nodeScratch.timeIndex,
      nodeScratch.timeIndexSecondary
    );

    nodeScratch.position = {
      x: nodeScratch.level * options.levelStep,
      y: tTimes[key],
    };
  });
};

export default arrangeGraph;
