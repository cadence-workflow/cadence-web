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
  name: 'notification-bar',
  props: [
    'message',
    'onClose',
    'show',
    'type', // 'error', 'success', 'warning'
  ],
};
</script>

<template>
  <transition name="fade">
    <div class="notification-bar" :class="type" v-if="show">
      <div class="message">
        {{ message }}
      </div>
      <span class="close icon icon_delete" @click="onClose" />
    </div>
  </transition>
</template>

<style scoped lang="stylus">
UberGreen = #3AA76D;
UberRed = #D44333;
UberOrange = #ED6E33;
DefaultColor = UberGreen;

.close {
  cursor: pointer;
  line-height: 60px;
  padding: 0 13px;
  position: absolute;
  right: 6px;
  top: 0;
}

.notification-bar {
  background-color: DefaultColor;
  color: #fff;
  font-size: 18px;
  height: 60px;
  left: 0;
  line-height: 60px;
  overflow: hidden;
  padding: 0 50px 0 24px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}

.error {
  background-color: UberRed;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.message {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.success {
  background-color: UberGreen;
}

.warning {
  background-color: UberOrange;
}
</style>
