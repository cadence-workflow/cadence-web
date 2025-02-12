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

import { CYTOSCAPE_LAYOUT_NAME } from '../constants';

/**
 * Traverse the graph recursively and set `level` and `parentTimeIndexOffset` for all nodes
 * @method arrangeNodes
 * @param {object} options
 * @param {object} options.idToChildren - node id to child lookup hash
 * @param {object} options.level - horizontal offset of the tree-like graph node arranged to avoid overlapping.
 * @param {object} options.nodes
 * @param {object} options.parentTimeIndex
 * @param {object} options.parentTimeIndexOffset - secondary time coordinate:
 *    there are two connected nodes: A -----> B
 *    A.data.timeIndex === B.data.timeIndex
 *  then we set
 *    A.data.timeIndexSecondary = 0
 *    B.data.timeIndexSecondary = 1
 *  To display B node beflow the A node whilst they they have the same timestamp
 */
const arrangeNodes = ({
  idToChildren,
  level = 0,
  nodes,
  parentTimeIndex = -1,
  parentTimeIndexOffset = 0,
}) => {
  let levelOffset = level;

  nodes.forEach((node, index) => {
    levelOffset += index ? 1 : 0;
    const children = idToChildren[node.id()];
    const nodeScratch = node.scratch(CYTOSCAPE_LAYOUT_NAME);

    nodeScratch.level = levelOffset;
    nodeScratch.timeIndexSecondary =
      parentTimeIndex === nodeScratch.timeIndex ? parentTimeIndexOffset + 1 : 0;

    if (children.length) {
      const { level: newLevel } = arrangeNodes({
        idToChildren,
        level: levelOffset,
        nodes: children,
        parentTimeIndex: nodeScratch.timeIndex,
        parentTimeIndexOffset: nodeScratch.timeIndexSecondary,
      });

      levelOffset = newLevel;
    }
  });

  return {
    level: levelOffset,
  };
};

export default arrangeNodes;
