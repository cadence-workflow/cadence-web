if (module.hot) {
  module.hot.addStatusHandler(function (status) {
    if (status === 'apply') {
      location.reload();
    }
  });
}

require('mocha/mocha');

const mochaDiv = document.createElement('div');
mochaDiv.id = 'mocha';
document.body.appendChild(mochaDiv);

const mochaCss = document.createElement('link');
mochaCss.setAttribute('rel', 'stylesheet');
mochaCss.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/mocha/3.4.2/mocha.css');
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

var chai = window.chai = require('chai');
chai.should();
chai.use(require('chai-dom'));
chai.use(require('chai-string'));
chai.use(require('chai-things'));

require('nathanboktae-browser-test-utils');

mocha.setup({
  ui: 'bdd',
  globals: ['Scenario', 'testEl'],
  slow: 500,
});

beforeEach(function () {
  localStorage.clear();
});

// hack workaround for https://github.com/mochajs/mocha/issues/1635
const oldIt = window.it;
window.it = function (name, func) {
  if (func) {
    const origFunc = func;

    const wrapperFunc = function () {
      const result = func.call(this);
      if (result && typeof result.then === 'function') {
        var currScenario = this.test.scenario;
        return result.then(
          () => currScenario && currScenario.tearDown(this.test),
          e => currScenario ? currScenario.tearDown(this.test).then(() => Promise.reject(e), () => Promise.reject(e)) : Promise.reject(e)
        );
      } else {
        return scenario && scenario.tearDown(this.test).then(() => result);
      }
    };
    wrapperFunc.toString = origFunc.toString.bind(origFunc);

    return oldIt(name, wrapperFunc);
  } else {
    return oldIt.apply(null, arguments);
  }
};

HTMLInputElement.prototype.input = function(text) {
  this.value = text;
  this.trigger('input', { testTarget: this });
}

HTMLElement.prototype.selectItem = async function(text) {
  const openDropdown = new MouseEvent('mousedown');
  this.querySelector('.dropdown-toggle').dispatchEvent(openDropdown);

  const itemToClick = Array.from(await this.waitUntilAllExist('ul.dropdown-menu li a')).find(a => a.innerText.trim() === text);
  const selectItem = new MouseEvent('mousedown');

  itemToClick.dispatchEvent(selectItem);
}

HTMLElement.prototype.selectOptions = async function(text) {
  const openDropdown = new MouseEvent('mousedown');
  this.querySelector('.dropdown-toggle').dispatchEvent(openDropdown);

  await this.waitUntilAllExist('ul.dropdown-menu li a');
  return this.textNodes('ul.dropdown-menu li a');
}

require('./scenario');

mocha.checkLeaks();

require('./intro.test');
require('./workflows.test');
require('./execution.test');
require('./domain-config.test');
require('./task-list.test');

mocha.run();