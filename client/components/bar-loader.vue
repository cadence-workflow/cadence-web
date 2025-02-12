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
  name: 'bar-loader',
};
</script>

<template>
  <loader class="bar"
    ><div></div>
    <div></div>
    <div></div
  ></loader>
</template>

<style lang="stylus">
@require "../styles/definitions.styl"

loader.bar
  display inline-block
  flex 0 0 auto
  > div
    display inline-block
    vertical-align middle
    border 1px solid uber-black-40
    background-color uber-white-40
    height 1em
    width 0.3em
    margin 0 1px
    animation wave 2s infinite ease-in-out
    &:nth-child(2)
      animation-delay 200ms
    &:nth-child(3)
      animation-delay 400ms

@keyframes wave
  0%, 35%
    opacity 0.5
  50%
    opacity 1
    transform scale(1.2)
  65%, 100%
    opacity 0.5
</style>
