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

import { CYTOSCAPE_LAYOUT_DEFAULTS, CYTOSCAPE_LAYOUT_NAME } from '../constants';
import arrangeGraph from './arrange-graph';

class CytoscapeLayout {
  constructor(options) {
    this.options = {
      ...CYTOSCAPE_LAYOUT_DEFAULTS,
      ...options,
    };
  }

  run() {
    const options = this.options;
    const eles = options.eles;
    const nodes = eles
      .nodes()
      .sort((n1, n2) => n1.data().timestamp - n2.data().timestamp);
    const edges = eles.edges();

    arrangeGraph({ nodes, edges }, options);

    nodes.layoutPositions(this, options, ele => {
      return ele.scratch(CYTOSCAPE_LAYOUT_NAME).position;
    });
  }
}

export default function(cytoscape) {
  if (!cytoscape) {
    return;
  }

  cytoscape('layout', 'cadence', CytoscapeLayout);
}
