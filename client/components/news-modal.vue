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

import ButtonFill from './button-fill';
import ButtonIcon from './button-icon';
import FlexGrid from './flex-grid';
import FlexGridItem from './flex-grid-item';

export default {
  props: ['newsItems'],
  methods: {
    onLinkClick() {
      this.$modal.hide('news-modal');
    },
    onDismissClick() {
      this.$modal.hide('news-modal');
    },
    onBeforeClose() {
      this.$emit('before-close');
    },
  },
  components: {
    'button-fill': ButtonFill,
    'button-icon': ButtonIcon,
    'flex-grid': FlexGrid,
    'flex-grid-item': FlexGridItem,
  },
};
</script>

<template>
  <modal name="news-modal" @before-close="onBeforeClose">
    <div class="news-modal">
      <div class="header">
        <flex-grid align-items="center">
          <flex-grid-item grow="1">
            <h2>What's new</h2>
          </flex-grid-item>
          <flex-grid-item width="40px">
            <button-icon
              icon="icon_delete-thin"
              size="30px"
              @click="onDismissClick"
            />
          </flex-grid-item>
        </flex-grid>
      </div>
      <div class="content">
        <div
          class="news-item"
          :key="id"
          v-for="{ id, image, summary, title, url } in newsItems"
        >
          <h3>
            <router-link :to="url" v-on:click.native="onLinkClick">
              {{ title }}
            </router-link>
          </h3>
          <p>{{ summary }}</p>
          <img alt="news image" class="news-image" :src="image" v-if="image" />
        </div>
      </div>
      <div class="footer">
        <flex-grid align-items="center">
          <flex-grid-item grow="1">
            <router-link
              class="see-more"
              :to="{ name: 'news' }"
              v-on:click.native="onLinkClick"
            >
              See more news . . .
            </router-link>
          </flex-grid-item>
          <flex-grid-item width="102px">
            <button-fill label="DISMISS" @click="onDismissClick" />
          </flex-grid-item>
        </flex-grid>
      </div>
    </div>
  </modal>
</template>

<style lang="stylus">
.news-modal {
  .content {
    max-height: 650px
    overflow-y: auto;
  }

  .footer {
    padding-top: 15px;
  }

  .header {
    padding-bottom: 15px;
  }

  .news-item {
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }

    p {
      line-height: 22px;
    }
  }

  .news-image {
    max-width: 800px;
  }

  .see-more {
    font-size: 16px;
  }
}
</style>
