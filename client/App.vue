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

import { version } from '../package.json';
import logo from './assets/logo.svg';
import {
  ButtonIcon,
  FeatureFlag,
  FlexGrid,
  FlexGridItem,
  NewsModal,
  NotificationBar,
  SelectInput,
} from '~components';
import {
  ActiveStatus,
  CrossRegion,
  Domain,
  DomainAutocomplete,
  SettingsModal,
} from '~containers';
import {
  DATE_FORMAT_MMM_D_YYYY,
  DATE_FORMAT_OPTIONS,
  ENVIRONMENT_LIST,
  LOCAL_STORAGE_NEWS_LAST_VIEWED_AT,
  LOCAL_STORAGE_SETTINGS,
  NOTIFICATION_TIMEOUT,
  NOTIFICATION_TYPE_SUCCESS,
  TIME_FORMAT_12,
  TIME_FORMAT_OPTIONS,
  TIMEZONE_LOCAL,
  TIMEZONE_OPTIONS,
} from '~constants';
import {
  getEnvironment,
  getEnvironmentList,
  getLatestNewsItems,
  parseStringToBoolean,
  workflowHistoryEventHighlightListAddOrUpdate,
} from '~helpers';
import { httpService } from '~services';

export default {
  components: {
    'active-status': ActiveStatus,
    'button-icon': ButtonIcon,
    'cross-region': CrossRegion,
    domain: Domain,
    'domain-autocomplete': DomainAutocomplete,
    'feature-flag': FeatureFlag,
    'flex-grid': FlexGrid,
    'flex-grid-item': FlexGridItem,
    'news-modal': NewsModal,
    'notification-bar': NotificationBar,
    'select-input': SelectInput,
    'settings-modal': SettingsModal,
  },
  data() {
    const { origin } = window.location;
    const environmentList = ENVIRONMENT_LIST;

    return {
      environment: {
        list: getEnvironmentList({
          environmentList,
          origin,
        }),
        value: getEnvironment({
          environmentList,
          origin,
        }),
      },
      isSearchingDomain: false,
      newsLastUpdated: localStorage.getItem(LOCAL_STORAGE_NEWS_LAST_VIEWED_AT),
      newsItems: [],
      logo,
      notification: {
        message: '',
        show: false,
        type: '',
        timeout: undefined,
      },
      // TODO - refactor App to store these in vuex store
      settings: {
        dateFormat:
          localStorage.getItem(LOCAL_STORAGE_SETTINGS.dateFormat) ||
          DATE_FORMAT_MMM_D_YYYY,
        dateFormatOptions: DATE_FORMAT_OPTIONS,
        timeFormat:
          localStorage.getItem(LOCAL_STORAGE_SETTINGS.timeFormat) ||
          TIME_FORMAT_12,
        timeFormatOptions: TIME_FORMAT_OPTIONS,
        timezone:
          localStorage.getItem(LOCAL_STORAGE_SETTINGS.timezone) ||
          TIMEZONE_LOCAL,
        timezoneOptions: TIMEZONE_OPTIONS,
        workflowHistoryEventHighlightList:
          JSON.parse(
            localStorage.getItem(
              LOCAL_STORAGE_SETTINGS.workflowHistoryEventHighlightList
            )
          ) || [],
        workflowHistoryEventHighlightListEnabled: parseStringToBoolean(
          localStorage.getItem(
            LOCAL_STORAGE_SETTINGS.workflowHistoryEventHighlightListEnabled
          ),
          true
        ),
      },
    };
  },
  beforeDestroy() {
    clearTimeout(this.notification.timeout);
  },
  async mounted() {
    await this.fetchLatestNewsItems();

    if (this.newsItems.length) {
      this.$modal.show('news-modal');
    }
  },
  methods: {
    async fetchLatestNewsItems() {
      const { newsLastUpdated } = this;
      const response = await httpService.get('/feed.json');

      this.newsItems = getLatestNewsItems({ newsLastUpdated, response });
    },
    globalClick(e) {
      // Code required for mocha tests to run correctly without infinite looping.
      if (window.mocha !== undefined && e.target.tagName === 'A') {
        const href = e.target.getAttribute('href');

        if (
          href &&
          href.startsWith('/') &&
          !e.target.getAttribute('download') &&
          !e.target.getAttribute('target')
        ) {
          e.preventDefault();
          e.stopPropagation();
          this.$router.push(href);
        }
      }
    },
    onDomainAutocompleteChange() {
      this.isSearchingDomain = false;
    },
    onEditDomainClick() {
      this.isSearchingDomain = !this.isSearchingDomain;
    },
    onEnvironmentSelectChange(environment) {
      if (environment === this.environment.value) {
        return;
      }

      window.location = environment.value;
    },
    onNewsDismiss() {
      localStorage.setItem(
        LOCAL_STORAGE_NEWS_LAST_VIEWED_AT,
        this.newsItems[0].date_modified
      );
    },
    onNotification({ message, type = NOTIFICATION_TYPE_SUCCESS }) {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.show = true;
    },
    onNotificationClose() {
      this.notification.show = false;
    },
    onSettingsChange(values) {
      for (const key in values) {
        const value = values[key];
        const storeValue =
          typeof value === 'object' ? JSON.stringify(value) : value;

        localStorage.setItem(LOCAL_STORAGE_SETTINGS[key], storeValue);

        this.settings[key] = value;
      }
    },
    onSettingsClick() {
      this.$modal.show('settings-modal');
    },
    onWorkflowHistoryEventParamToggle({
      eventParam: { key: eventParamName, isHighlighted },
      eventType,
    }) {
      const {
        settings: { workflowHistoryEventHighlightList },
      } = this;

      this.settings.workflowHistoryEventHighlightList = workflowHistoryEventHighlightListAddOrUpdate(
        {
          eventParamName,
          eventType,
          isEnabled: !isHighlighted,
          workflowHistoryEventHighlightList,
        }
      );

      localStorage.setItem(
        LOCAL_STORAGE_SETTINGS.workflowHistoryEventHighlightList,
        JSON.stringify(this.settings.workflowHistoryEventHighlightList)
      );
    },
  },
  watch: {
    'notification.show'(value) {
      clearTimeout(this.notification.timeout);

      if (value) {
        this.notification.timeout = setTimeout(
          this.onNotificationClose,
          NOTIFICATION_TIMEOUT
        );
      }
    },
  },
  computed: {
    version() {
      return `v${version}`;
    },
  },
};
</script>

<template>
  <main @click="globalClick">
    <notification-bar
      :message="notification.message"
      :onClose="onNotificationClose"
      :show="notification.show"
      :type="notification.type"
    />
    <header class="top-bar">
      <flex-grid align-items="center" width="100%">
        <flex-grid-item>
          <a href="/domains" class="logo">
            <div v-html="logo"></div>
            <span class="version">{{ version }}</span>
          </a>
        </flex-grid-item>

        <feature-flag name="environmentSelect">
          <flex-grid-item>
            <select-input
              class="environment-select"
              :options="environment.list"
              :value="environment.value"
              @change="onEnvironmentSelectChange"
            />
          </flex-grid-item>
        </feature-flag>

        <flex-grid-item v-if="$route.params.domain" margin="15px">
          <flex-grid align-items="center">
            <flex-grid-item>
              <router-link
                class="workflows"
                :to="{
                  name: 'workflow-list',
                  params: { clusterName: $route.params.clusterName },
                }"
                v-if="!isSearchingDomain"
              >
                {{ $route.params.domain }}
              </router-link>
              <domain-autocomplete
                :focus="true"
                height="slim"
                v-if="isSearchingDomain"
                width="500px"
                @onChange="onDomainAutocompleteChange"
              />
            </flex-grid-item>
            <flex-grid-item>
              <button-icon
                color="primary"
                :icon="`${isSearchingDomain ? 'icon_delete' : 'icon_search'}`"
                size="18px"
                width="22px"
                @click="onEditDomainClick"
              />
            </flex-grid-item>
            <flex-grid-item>
              <active-status
                :cluster-name="$route.params.clusterName"
                :domain="$route.params.domain"
                :workflow-id="$route.params.workflowId"
              />
            </flex-grid-item>
          </flex-grid>
        </flex-grid-item>

        <flex-grid-item v-if="$route.params.workflowId">
          <span>{{ $route.params.workflowId }}</span>
        </flex-grid-item>

        <flex-grid-item v-if="$route.params.taskList">
          <span>{{ $route.params.taskList }}</span>
        </flex-grid-item>

        <flex-grid-item grow="1">
          <button-icon
            color="primary"
            icon="icon_settings"
            label="SETTINGS"
            size="30px"
            style="float: right"
            @click="onSettingsClick"
          />
        </flex-grid-item>
      </flex-grid>
    </header>
    <cross-region>
      <domain>
        <router-view
          :date-format="settings.dateFormat"
          :time-format="settings.timeFormat"
          :timezone="settings.timezone"
          :workflow-history-event-highlight-list="
            settings.workflowHistoryEventHighlightList
          "
          :workflow-history-event-highlight-list-enabled="
            settings.workflowHistoryEventHighlightListEnabled
          "
          @onWorkflowHistoryEventParamToggle="onWorkflowHistoryEventParamToggle"
          @onNotification="onNotification"
        ></router-view>
      </domain>
    </cross-region>
    <modals-container />
    <v-dialog />
    <news-modal :news-items="newsItems" @before-close="onNewsDismiss" />
    <settings-modal
      :date-format="settings.dateFormat"
      :date-format-options="settings.dateFormatOptions"
      :time-format="settings.timeFormat"
      :time-format-options="settings.timeFormatOptions"
      :timezone="settings.timezone"
      :timezone-options="settings.timezoneOptions"
      :workflow-history-event-highlight-list="
        settings.workflowHistoryEventHighlightList
      "
      :workflow-history-event-highlight-list-enabled="
        settings.workflowHistoryEventHighlightListEnabled
      "
      @change="onSettingsChange"
    />
  </main>
</template>

<style src="vue-select/dist/vue-select.css"></style>
<style src="vue-virtual-scroller/dist/vue-virtual-scroller.css"></style>
<style src="vue2-datepicker/index.css"></style>
<style lang="stylus">
@import "https://d1a3f4spazzrp4.cloudfront.net/uber-fonts/4.0.0/superfine.css"
@import "https://d1a3f4spazzrp4.cloudfront.net/uber-icons/3.14.0/uber-icons.css"
@require "./styles/definitions"
@require "./styles/reset"

global-reset()

@import "./styles/base"
@import "./styles/modal"
@import "./styles/code"

header.top-bar
  display flex
  flex 0 0 auto
  align-items center
  background-color uber-black
  padding 0 page-margin-x
  color base-ui-color
  height top-nav-height
  h2
    font-size 18px
    margin-right inline-spacing-large
    padding page-margin-y inline-spacing-large page-margin-y 0
  a
    display inline-block
    h2
      color uber-white-80
    &.config
      margin-left inline-spacing-medium
      icon('\ea5f')
    &.logo {
      margin-right: layout-spacing-medium;
      position: relative;
    }

  svg
    display inline-block
    height top-nav-height - 20px

  spacing = 1.3em
  nav-label-color = uber-white-40
  nav-label-font-size = 11px

  .detail-view span::before
    font-size nav-label-font-size
    color nav-label-color
    margin-right spacing
  div.workflow-id span::before
      content 'WORKFLOW ID'
  div.task-list span::before
      content 'TASK LIST'
  .version {
    color: #c6c6c6;
    font-size: 10px;
    position: absolute;
    right: 4px;
    bottom: 0;
  }

  .environment-select {
    color: #000;

    .vs__dropdown-toggle {
      border-color: transparent;
    }

    .vs__open-indicator {
      height: 10px;
      fill: uber-blue;
    }

    .vs__selected {
      color: white;
      font-weight: bold;
    }
  }
html, body {
  height: 100%;
}
body, main {
  display: flex;
  flex-direction: column;
}
body {
  overscroll-behavior: none;
}
main {
  flex:1
}
main
  > section
    display flex
    flex-direction column
    flex 1 1 auto
    > header:last-of-type
      margin-bottom layout-spacing-small
    > header
      display flex
      align-items: start;
      flex 0 0 auto
      > *
        margin inline-spacing-small

area-loader, section.loading
  size = 32px
  &::after
    content ''
    display block
    position absolute
    width size
    height size
    border-radius size
    left "calc(50% - %s)" % (size/2)
    top 300px;
    border 3px solid uber-blue
    border-bottom-color transparent
    animation spin 800ms linear infinite
</style>
