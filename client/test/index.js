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

if (module.hot) {
  module.hot.addStatusHandler(status => {
    if (status === 'apply') {
      window.location.reload();
    }
  });
}

require('mocha/mocha');

const mochaDiv = document.createElement('div');

mochaDiv.id = 'mocha';
document.body.appendChild(mochaDiv);

const mochaCss = document.createElement('link');

mochaCss.setAttribute('rel', 'stylesheet');
mochaCss.setAttribute(
  'href',
  'https://cdnjs.cloudflare.com/ajax/libs/mocha/3.4.2/mocha.css'
);
document.head.appendChild(mochaCss);

const extraStyling = document.createElement('style');

extraStyling.setAttribute('type', 'text/css');
extraStyling.textContent = `
#mocha li:nth-child(2n),
#mocha pre {
  background: none;
}

#mocha h2 {
  padding: 0;
}

main {
  width: 1800px;
  height: 900px;
}
`;
document.head.appendChild(extraStyling);
document.title = 'Cadence Tests';

const chai = require('chai');

window.chai = chai;

chai.should();
chai.use(require('chai-dom'));
chai.use(require('chai-string'));
chai.use(require('chai-things'));
chai.use(require('chai-spies'));

require('nathanboktae-browser-test-utils');

mocha.setup({
  ui: 'bdd',
  globals: ['Scenario', 'testEl', '__VUE_DEVTOOLS_TOAST__'],
  slow: 500,
});

beforeEach(() => {
  localStorage.clear();
});

// hack workaround for https://github.com/mochajs/mocha/issues/1635
const oldIt = window.it;

window.it = function it(...args) {
  const [name, func] = args;

  if (func) {
    const origFunc = func;

    const wrapperFunc = function wrapperFunc() {
      const result = func.call(this);

      if (result && typeof result.then === 'function') {
        const currScenario = this.test.scenario;

        return result.then(
          () => currScenario && currScenario.tearDown(this.test),
          e =>
            currScenario
              ? currScenario.tearDown(this.test).then(
                  () => Promise.reject(e),
                  () => Promise.reject(e)
                )
              : Promise.reject(e)
        );
      }

      return scenario && scenario.tearDown(this.test).then(() => result);
    };

    wrapperFunc.toString = origFunc.toString.bind(origFunc);

    return oldIt(name, wrapperFunc);
  }

  return oldIt(...args);
};

HTMLInputElement.prototype.input = function input(text) {
  this.value = text;
  this.trigger('input', { testTarget: this });
};

HTMLElement.prototype.selectItem = async function selectItem(text) {
  const openDropdown = new MouseEvent('mousedown');

  this.querySelector('.vs__dropdown-toggle').dispatchEvent(openDropdown);

  const itemToClick = Array.from(
    await this.waitUntilAllExist('ul.vs__dropdown-menu li')
  ).find(a => a.innerText.trim() === text);
  const selectedItem = new MouseEvent('click');

  itemToClick.dispatchEvent(selectedItem);
};

HTMLElement.prototype.selectOptions = async function selectOptions() {
  const openDropdown = new MouseEvent('mousedown');

  this.querySelector('.vs__dropdown-toggle').dispatchEvent(openDropdown);

  await this.waitUntilAllExist('ul.vs__dropdown-menu li');

  return this.textNodes('ul.vs__dropdown-menu li');
};

require('./scenario');

mocha.checkLeaks();

require('./domain.test');
require('./domain-search.test');
require('./help.test');
require('./workflow-list.test');
require('./workflow.test');
require('./domain-settings.test');
require('./task-list.test');

mocha.run();
