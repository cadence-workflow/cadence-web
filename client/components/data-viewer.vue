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

import 'prismjs';
import 'prismjs/components/prism-json';
import Prism from 'vue-prism-component';

export default {
  name: 'data-viewer',
  props: ['compact', 'item', 'title'],
  data() {
    return {};
  },
  created() {
    this.checkOverflow = () => {
      const el = this.$refs.codebox;

      if (!el) {
        return;
      }

      const action =
        el.scrollWidth > el.offsetWidth + 2 ||
        el.scrollHeight > el.offsetHeight + 2
          ? 'add'
          : 'remove';

      this.$el.classList[action]('overflow');
    };
    window.addEventListener('resize', this.checkOverflow);
    ['item', 'compact'].forEach(e => this.$watch(e, this.checkOverflow));
    this.$watch(() => this.$route, this.checkOverflow);
  },
  mounted() {
    this.checkOverflow();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkOverflow);
  },
  methods: {
    viewFullScreen() {
      this.$modal.show(
        {
          components: { prism: Prism },
          props: ['code', 'title'],
          template: `
            <div class="data-viewer-fullscreen">
              <header>
                <h3>{{title}}</h3>
                <copy :text="code.jsonStringFull" />
                <a class="close" href="#" @click="$emit('close')"></a>
              </header>
              <prism language="json">{{code.value}}</prism>
            </div>
          `,
        },
        {
          code: this.item,
          title: this.title,
        },
        {
          name: 'data-viewer-fullscreen',
        }
      );
    },
  },
  components: {
    prism: Prism,
  },
};
</script>

<template>
  <div class="data-viewer">
    <a
      href="#"
      class="view-full-screen"
      @click.stop.prevent="viewFullScreen"
    ></a>
    <prism language="json" ref="codebox">{{ item.jsonStringDisplay }}</prism>
  </div>
</template>

<style lang="stylus">
@require "../styles/definitions.styl"

.data-viewer
  position relative
  &:not(.overflow) a.view-full-screen
    display none
  a.view-full-screen
    position absolute
    top 1px
    right 0
    margin-right 10px
    width 28px
    height calc(100% - 6px)
    max-height 28px
    // background-color white
    // border 1px solid uber-black-80
    // border-radius 4px
    background-color alpha(uber-white-20, 70%)
    display flex
    justify-content center
    align-items center
    icon('\ea90')
    &::before
      margin 0
      font-size 18px

[data-modal="data-viewer-fullscreen"]
  .v--modal-box.v--modal
    max-width calc(100vw - 20px)
    max-height calc(100vh - 20px)
  div.data-viewer-fullscreen
    flex-exactly-to-parent(column)
    pre
      flex 1
      overflow auto
    header
      padding-right 30px
      h3
        one-liner-ellipsis()
    code.language-json
      display inline-block
      max-width calc(80vw)
      overflow-wrap break-word
      white-space pre-wrap
      overflow hidden
</style>
