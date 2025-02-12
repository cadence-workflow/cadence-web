<script>
// Copyright (c) 2017-2024 Uber Technologies Inc.
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

import { cliCommands } from './constants';

export default {
  props: ['hideDocs', 'hideSlack', 'hideStackOverflow'],
  data() {
    return {
      cliCommands,
    };
  },
};
</script>

<template>
  <section class="help">
    <section id="getting-started">
      <h1>Welcome to Cadence!</h1>
      <h3>
        <a href="#getting-started">
          Getting started
        </a>
      </h3>
      <p>
        If you are new to Cadence, here's some resources to get you started!
      </p>
      <div class="video-outer-container">
        <div class="video-inner-container">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/-BuIkhlc-RM?start=3"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/aLyRyNe5Ls0"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/5mBLspVKOAI"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      </div>
      <slot name="getting-started" />
      <div v-if="!hideDocs">
        <a
          href="https://cadenceworkflow.io/docs/get-started/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
        </a>
      </div>
      <div>
        <a
          href="https://github.com/cadence-workflow/cadence-samples"
          target="_blank"
          rel="noopener noreferrer"
        >
          Code Samples
        </a>
      </div>
      <div>
        <a
          href="https://github.com/uber/cadence"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cadence source code on GitHub
        </a>
      </div>
      <div>
        <a
          href="https://github.com/uber/cadence-web"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cadence UI source code on GitHub
        </a>
      </div>
    </section>
    <section id="cli">
      <h3>
        <a href="#cli">
          Common CLI commands
        </a>
      </h3>
      <p>
        Here are a some useful common CLI commands to get started with Cadence.
      </p>

      <section v-for="commandGroup in cliCommands" :key="commandGroup.header">
        <h5>{{ commandGroup.header }}</h5>
        <div
          class="cli-command"
          v-for="command in commandGroup.commands"
          :key="command.id"
        >
          <label :for="command.id">{{ command.label }}</label>
          <pre :id="command.id">{{ command.value }}</pre>
          <p v-for="(description, index) in command.description" :key="index">
            {{ description }}
          </p>
        </div>
      </section>

      <div>
        <a
          href="https://cadenceworkflow.io/docs/cli/"
          target="_blank"
          rel="noopener noreferrer"
        >
          See more CLI commands
        </a>
      </div>
    </section>
    <section id="release-notes">
      <h3>
        <a href="#release-notes">
          Latest release notes
        </a>
      </h3>
      <div>
        <a
          href="https://github.com/uber/cadence/releases/latest"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cadence
        </a>
      </div>
      <div>
        <a
          href="https://github.com/uber/cadence-web/releases/latest"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cadence UI
        </a>
      </div>
      <slot name="release-notes" />
    </section>
    <slot name="other" />
    <section id="contact-us">
      <h3>
        <a href="#contact-us">
          Contact us
        </a>
      </h3>
      <p>Our office hours are 9am - 5pm PDT</p>
      <div v-if="!hideStackOverflow">
        <a
          href="https://stackoverflow.com/questions/tagged/cadence-workflow"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ask a question on Stack Overflow
        </a>
      </div>
      <div v-if="!hideSlack">
        <a
          href="https://join.slack.com/t/uber-cadence/shared_invite/enQtNDczNTgxMjYxNDEzLTQyYjcxZDM2YTIxMTZkMzQ0NjgxYmI3OWY5ODhiOTliM2I5MzA4NTM4MjU4YzgzZDkwNGEzOTUzNTBlNDk3Yjc"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join our slack channel
        </a>
      </div>
      <slot name="contact-us" />
    </section>
  </section>
</template>

<style lang="stylus">
@require "../../styles/definitions"

iframe-height = 315px;
iframe-scrollbar-height = 15px;
iframe-margin = 20px;
iframe-width = 560px;
iframe-count = 3;
max-iframe-width = iframe-count * (iframe-width + iframe-margin) - iframe-margin;

section.help {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  margin: layout-spacing-large;

  @media (min-width max-iframe-width) {
    width: max-iframe-width;
    margin: layout-spacing-large auto;
  }

  .cli-command {
    margin-bottom: 25px;
  }

  .video-outer-container {
    height: iframe-height + iframe-scrollbar-height;
    margin: 20px 0;
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;

    .video-inner-container {
      width: max-iframe-width;
    }

    iframe {
      float: left;
      margin-right: iframe-margin;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  a {
    line-height: 2em;

    &:after {
      content: '';
      background: none;
    }

    &:nth-child(2n) {
      background: none;
    }
  }

  h1 {
    margin-bottom: base-font-size*2;
  }

  h3 {
    margin: 1em 0 0.5em;

    > a {
      color: #494949;
      line-height: 24px;
    }
  }

  h5 {
    margin: 1em 0 0.5em;
  }

  label {
    display: block;
    font-weight: 500;
    margin: 1em 0 0.5em;
  }

  p {
    margin: 0.5em 0 0.5em;
  }

  pre {
    display: inline-block;
  }
}
</style>
