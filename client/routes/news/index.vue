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

import { getIFrameSrc, getUpdatedIFrameLocation } from './helpers';
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_ERROR_MESSAGE_DEFAULT,
} from '~constants';

export default {
  props: ['article', 'date', 'month', 'year'],
  data() {
    return {
      ignoreUpdate: false,
      src: this.getIFrameSrc(),
    };
  },
  computed: {
    url() {
      return this.getIFrameSrc();
    },
  },
  mounted() {
    const { iframe } = this.$refs;

    iframe.onload = this.onIFrameLoad;
    iframe.onerror = this.onIFrameError;
  },
  beforeDestroy() {
    this.unsubscribeToIFrameNavigationChange();
  },
  methods: {
    fadeInIFrame() {
      const { iframe } = this.$refs;

      iframe.style.opacity = 1;
    },
    fadeOutIFrame() {
      const { iframe } = this.$refs;

      iframe.style.opacity = 0;
    },
    getIFrameSrc() {
      const { origin } = window.location;
      const { article, date, month, year } = this;

      return getIFrameSrc({
        article,
        date,
        month,
        origin,
        year,
      });
    },
    onIFrameError() {
      this.$emit('onNotification', {
        message: NOTIFICATION_TYPE_ERROR_MESSAGE_DEFAULT,
        type: NOTIFICATION_TYPE_ERROR,
      });
    },
    onIFrameLoad() {
      if (this.ignoreUpdate) {
        return;
      }

      this.fadeInIFrame();
      this.subscribeToIFrameNavigationChange();
      // iframe.onload adds its iframe page to the history stack
      this.$router.go(-1);
    },
    onIFrameBodyChange() {
      const { location } = window;
      const {
        ignoreUpdate,
        $refs: { iframe },
      } = this;

      if (ignoreUpdate) {
        return;
      }

      const iframeLocation = getUpdatedIFrameLocation({ iframe, location });

      if (iframeLocation) {
        // means iframe has navigated to another page. Update browser url.
        this.$router.replace(iframeLocation);
      }
    },
    onBrowserUrlChange() {
      const { location } = window;
      const { iframe } = this.$refs;
      const iframeLocation = getUpdatedIFrameLocation({ iframe, location });

      if (iframeLocation) {
        // means browser url is out of sync with iframe url
        // this can happen when clicking on the news tab from a news story
        // -> need to force iframe to rerender
        this.reloadIFrame();
      }
    },
    reloadIFrame() {
      this.ignoreUpdate = true;
      this.fadeOutIFrame();
      this.src = '';

      setTimeout(() => {
        this.ignoreUpdate = false;
        this.src = this.url;
      }, 100);
    },
    subscribeToIFrameNavigationChange() {
      // need to observe iframe body change as there is no
      // event to subscribe to for iframe route change
      const { iframe } = this.$refs;

      if (this.observer) {
        this.unsubscribeToIFrameNavigationChange();
      }

      this.observer = new MutationObserver(this.onIFrameBodyChange);
      this.observer.observe(iframe.contentDocument.body, { childList: true });
    },
    unsubscribeToIFrameNavigationChange() {
      if (this.observer) {
        this.observer.disconnect();
      }
    },
  },
  watch: {
    url(url) {
      this.onBrowserUrlChange();
    },
  },
};
</script>

<template>
  <section class="news">
    <iframe ref="iframe" :src="src" />
  </section>
</template>

<style lang="stylus">
section.news {
  flex: 1;

  iframe {
    height: 100%
    width: 100%;
    opacity: 0;
    transition: opacity 0.25s;
  }
}
</style>
