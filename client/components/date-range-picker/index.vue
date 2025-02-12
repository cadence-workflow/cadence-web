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

import moment from 'moment';
import DatePicker from 'vue2-datepicker';
import {
  getDateString,
  getMaxEndDate,
  getRange,
  getRangeDisplayText,
  getShortcuts,
  getTimePanelLabel,
  isDateValid,
  isDayDisabled,
} from './helpers';

export default {
  props: ['dateRange', 'maxDays', 'minStartDate'],
  data() {
    const range = getRange(this.dateRange);

    return {
      interval: undefined,
      range,
      startTimeString: getDateString(range[0]),
      endTimeString: getDateString(range[1]),
      now: new Date(),
      open: false,
      showTimePanel: false,
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      this.now = new Date();
    }, 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  computed: {
    endTime() {
      return moment(this.endTimeString);
    },
    endTimeInvalid() {
      return !isDateValid(this.endTime, this.minStartDate, this.maxEndDate);
    },
    isDayDisabled() {
      return isDayDisabled(this.minStartDate);
    },
    maxEndDate() {
      return getMaxEndDate(this.now);
    },
    rangeDisplayText() {
      return getRangeDisplayText(this.dateRange);
    },
    shortcuts() {
      return getShortcuts(this.maxDays, this.minStartDate);
    },
    startTime() {
      return moment(this.startTimeString);
    },
    startTimeInvalid() {
      return !isDateValid(this.startTime, this.minStartDate, this.maxEndDate);
    },
    startOrEndTimeInvalid() {
      return this.startTimeInvalid || this.endTimeInvalid;
    },
    timePanelLabel() {
      return getTimePanelLabel(this.showTimePanel);
    },
  },
  methods: {
    onShortcutClick(shortcut) {
      this.$emit('change', shortcut.value);
      this.open = false;
    },
    onDateRangeChange(range) {
      const [startTime, endTime] = range;

      if (!startTime || !endTime) {
        return;
      }

      this.$emit('change', { startTime, endTime });
    },
    onCustomRangeSubmit() {
      let { startTime, endTime } = this;

      if (this.startOrEndTimeInvalid) {
        return;
      }

      if (endTime.isBefore(startTime)) {
        startTime = this.endTime;
        endTime = this.startTime;
      }

      this.$emit('change', {
        startTime,
        endTime,
      });
      this.open = false;
    },
    onClickTimePanelLabel() {
      this.showTimePanel = !this.showTimePanel;
    },
  },
  components: {
    DatePicker,
  },
  watch: {
    dateRange() {
      this.range = getRange(this.dateRange);
      this.startTimeString = getDateString(this.range[0]);
      this.endTimeString = getDateString(this.range[1]);
    },
  },
};
</script>

<template>
  <div class="date-range-picker">
    <date-picker
      range
      type="datetime"
      v-model="range"
      :clearable="false"
      :disabled-date="isDayDisabled"
      :showTimePanel="showTimePanel"
      :open.sync="open"
      @change="onDateRangeChange"
    >
      <template v-slot:input>
        <input
          placeholder="Date Range"
          readonly
          type="text"
          :value="rangeDisplayText"
        />
      </template>
      <template v-slot:sidebar>
        <div class="sidebar-column sidebar-column-shortcuts">
          <h5>Quick ranges</h5>
          <button
            class="mx-btn mx-btn-text mx-btn-shortcut"
            type="button"
            v-for="shortcut in shortcuts"
            :key="shortcut.value"
            @click="onShortcutClick(shortcut)"
          >
            {{ shortcut.text }}
          </button>
        </div>
        <div class="sidebar-column sidebar-column-custom-range">
          <form @submit.prevent="onCustomRangeSubmit">
            <h5>Custom range</h5>
            <div>
              <label for="custom-range-from">From:</label>
              <input
                id="custom-range-from"
                maxlength="19"
                v-model="startTimeString"
                :class="{ invalid: startTimeInvalid }"
              />
            </div>
            <div>
              <label for="custom-range-to">To:</label>
              <input
                id="custom-range-to"
                maxlength="19"
                v-model="endTimeString"
                :class="{ invalid: endTimeInvalid }"
              />
            </div>
            <div>
              <button
                class="sidebar-button"
                type="submit"
                :disabled="startOrEndTimeInvalid"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      </template>
      <template v-slot:footer>
        <button class="mx-btn mx-btn-text" @click="onClickTimePanelLabel">
          {{ timePanelLabel }}
        </button>
      </template>
    </date-picker>
  </div>
</template>

<style lang="stylus">
sidebarColumnCustomRangeWidth = 181px;
sidebarColumnShortcutsWidth = 130px;
sidebarColumnPadding = 12px;
sidebarWidth = sidebarColumnShortcutsWidth + sidebarColumnCustomRangeWidth;

.mx-datepicker-popup {
  td {
    text-align: center;
  }

  .mx-datepicker-sidebar {
    padding: 6px 0;
    width: sidebarWidth;

    &+ .mx-datepicker-content {
      margin-left: sidebarWidth;
    }
  }

  .sidebar-column {
    float: left;
    height: 100%;
    padding: 0 sidebarColumnPadding;

    &+ .sidebar-column {
      border-left: 1px solid #e8e8e8;
    }

    label {
      display: block;
      font-weight: 500;
    }

    button {
      padding: 0;
    }

    input {
      margin: 0 0 8px 0;
      padding: 8px 10px;
      width: 156px;

      &.invalid {
        border: 1px solid #D44333;

        &:focus {
          outline: #D44333 auto 3px;
        }
      }
    }

    h5 {
      text-transform: none;
    }
  }

  .sidebar-column-shortcuts {
    width: sidebarColumnShortcutsWidth;
  }

  .sidebar-column-custom-range {
    width: sidebarColumnCustomRangeWidth;
  }

  button.sidebar-button {
    background-color: #11939a;
    border: none;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    float: right;
    font-size: 12px;
    font-weight: bold;
    padding: 8px 12px;

    &:disabled {
      background-color: #75F7FE;
      cursor: not-allowed;
    }
  }
}

.date-range-picker {
  input {
    border: 1px solid #e5e5e4;
    border-radius: 0;
    box-shadow: none;
    cursor: pointer;
    height: auto;
    margin: 0;
    padding: 8px 30px 8px 10px;
    width: 325px;
  }

  .mx-datepicker-range {
    width: auto;
  }
}
</style>
