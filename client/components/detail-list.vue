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

import DataViewer from './data-viewer';
import HighlightToggle from './highlight-toggle';
import { preKeys } from '~constants';

export default {
  name: 'detail-list',
  props: ['compact', 'isHighlightEnabled', 'item', 'title'],
  components: {
    'data-viewer': DataViewer,
    'highlight-toggle': HighlightToggle,
  },
  data() {
    return {};
  },
  methods: {
    format(val) {
      return val === null ? '' : String(val) || '""';
    },
  },
  render(h) {
    const { compact, title } = this;

    function dd(kvp) {
      if (kvp.routeLink) {
        return [h('router-link', { props: { to: kvp.routeLink } }, kvp.value)];
      }

      return preKeys.includes(kvp.key)
        ? [
            h('data-viewer', {
              props: {
                item: kvp.value,
                compact,
                title: `${title} - ${kvp.key}`,
              },
            }),
          ]
        : kvp.value;
    }

    return h(
      'dl',
      { class: 'details' },
      this.item.kvps.map(kvp =>
        h('div', { attrs: { 'data-prop': kvp.key } }, [
          h('highlight-toggle', {
            props: {
              isHighlighted: kvp.isHighlighted,
              isEnabled: this.isHighlightEnabled,
              label: kvp.key,
              tag: 'dt',
            },
            on: {
              click: () => {
                this.$emit('onWorkflowHistoryEventParamToggle', kvp);
              },
            },
          }),
          h('dd', null, dd(kvp)),
        ])
      )
    );
  },
};
</script>

<style lang="stylus">
@require "../styles/definitions.styl"

dl.details
  > div
    display flex
    padding 4px 0
    justify-content space-between
    min-width 0
    &:nth-child(2n)
      background-color rgba(0,0,0,0.03)
  dt
    flex 0 0 300px
    font-family monospace-font-family
    font-weight 200
    margin-right 1em
  dd
    flex 1 1 auto
    max-width calc(100vw - 700px)
    @media (max-width: 1000px)
      max-width 500px
    overflow-y: auto;
    max-height: 16vh;
</style>
