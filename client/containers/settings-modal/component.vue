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

import { container as SettingsWorkflowHistory } from '../settings-workflow-history';
import SettingsDateFormat from './components/settings-date-format';
import SettingsHeader from './components/settings-header';
import SettingsList from './components/settings-list';
import { SETTINGS_VIEW_LIST } from './constants';
import { FlexGrid, FlexGridItem } from '~components';

export default {
  data() {
    return {
      activeView: {},
      viewList: SETTINGS_VIEW_LIST,
    };
  },
  props: {
    dateFormat: {
      type: String,
    },
    dateFormatOptions: {
      type: Array,
    },
    timeFormat: {
      type: String,
    },
    timeFormatOptions: {
      type: Array,
    },
    timezone: {
      type: String,
    },
    timezoneOptions: {
      type: Array,
    },
    workflowHistoryEventHighlightList: {
      type: Array,
    },
    workflowHistoryEventHighlightListEnabled: {
      type: Boolean,
    },
  },
  computed: {
    settingsDateFormatViewActive() {
      return this.activeView.name === 'settings-date-format';
    },
    settingsWorkflowHistoryViewActive() {
      return this.activeView.name === 'settings-workflow-history';
    },
  },
  methods: {
    close() {
      this.$modal.hide('settings-modal');
    },
    onClose() {
      this.close();
    },
    onBeforeClose() {
      this.activeView = {};
    },
    onBeforeOpen() {
      this.activeView = this.viewList[0];
    },
    onSettingsChange(event) {
      this.$emit('change', event);
      this.close();
    },
    onSettingsListChange({ view }) {
      this.activeView = view;
    },
  },
  components: {
    'flex-grid': FlexGrid,
    'flex-grid-item': FlexGridItem,
    'settings-date-format': SettingsDateFormat,
    'settings-list': SettingsList,
    'settings-workflow-history': SettingsWorkflowHistory,
    'settings-header': SettingsHeader,
  },
};
</script>

<template>
  <modal
    name="settings-modal"
    @before-close="onBeforeClose"
    @before-open="onBeforeOpen"
  >
    <div class="settings-modal">
      <settings-header
        :title="activeView.displayName"
        title-suffix="Settings"
        @close="onClose"
      />
      <flex-grid>
        <flex-grid-item margin="20px">
          <settings-list
            :active-view-name="activeView.name"
            :view-list="viewList"
            @change="onSettingsListChange"
          />
        </flex-grid-item>
        <flex-grid-item>
          <settings-date-format
            :date-format="dateFormat"
            :date-format-options="dateFormatOptions"
            :time-format="timeFormat"
            :time-format-options="timeFormatOptions"
            :timezone="timezone"
            :timezone-options="timezoneOptions"
            v-if="settingsDateFormatViewActive"
            @change="onSettingsChange"
            @close="onClose"
          />
          <settings-workflow-history
            :workflow-history-event-highlight-list="
              workflowHistoryEventHighlightList
            "
            :workflow-history-event-highlight-list-enabled="
              workflowHistoryEventHighlightListEnabled
            "
            v-if="settingsWorkflowHistoryViewActive"
            @change="onSettingsChange"
            @close="onClose"
          />
        </flex-grid-item>
      </flex-grid>
    </div>
  </modal>
</template>

<style lang="stylus">
.settings-modal {
  .content {
    min-height: 320px;
    min-width: 630px;
    overflow-y: auto;
  }

  .content-item {
    margin: 10px 0 15px;
  }

  .dropdown-menu {
    min-width: 90px !important;
  }

  label {
    display: inline-block;
    margin-bottom: 5px;
  }
}
</style>
