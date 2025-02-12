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

export default {
  name: 'copy',
  props: ['text'],
  methods: {
    copy() {
      const element = document.createElement('div');

      element.textContent = this.text;
      document.body.appendChild(element);

      const range = document.createRange();

      range.selectNode(element);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);

      if (window.Mocha) {
        window.Mocha.copiedText = this.text;
      } else {
        document.execCommand('copy');
      }

      element.remove();

      this.$el.classList.add('copied');
      setTimeout(() => this.$el.classList.remove('copied'), 1000);
    },
  },
};
</script>

<template>
  <a href="#" class="copy" @click.prevent="copy"></a>
</template>

<style lang="stylus">
@require "../styles/definitions.styl"

@keyframes copied
  40%
    transform scale(1.4)
  60%
    transform scale(0.8)
  75%
    transform scale(1.2)
  100%
    transform scale(1)

a.copy
  icon('\ea16')
  &.copied
    animation copied 500ms ease-in-out
</style>
