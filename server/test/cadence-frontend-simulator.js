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

const supertest = require('supertest');
const Long = require('long');
const moment = require('moment');
const mockGRPC = require('./mock-grpc');
const mockTChannel = require('./mock-tchannel');

let app;
let closeClient;
let closeServer;
let setCurrentTest;

global.should = require('chai').should();

global.dateToLong = d => Long.fromValue(Number(new Date(d))).mul(1000000);

global.dateToTimestamp = d => ({
  seconds: moment(d).unix(),
});

before(function(done) {
  process.env.CADENCE_TCHANNEL_PEERS = '127.0.0.1:11343';
  process.env.TRANSPORT_CLIENT_TYPE = 'tchannel';

  switch (process.env.TRANSPORT_CLIENT_TYPE) {
    case 'tchannel': {
      mocks = mockTChannel(done);
      closeClient = mocks.closeClient;
      closeServer = mocks.closeServer;
      setCurrentTest = mocks.setCurrentTest;
      break;
    }
    case 'grpc': {
      mocks = mockGRPC(done);
      closeClient = mocks.closeClient;
      closeServer = mocks.closeServer;
      setCurrentTest = mocks.setCurrentTest;
      break;
    }
    default: {
      throw new Error(
        `Unsupported client type: "${process.env.TRANSPORT_CLIENT_TYPE}". Only support 'tchannel' or 'grpc'.`
      );
    }
  }

  app = require('../')
    .init({ useWebpack: false, logErrors: false })
    .listen();
  global.request = supertest.bind(supertest, app);
});

after(function() {
  app.close();
  closeClient();
  closeServer();
});

beforeEach(function() {
  setCurrentTest(this.currentTest);
});
