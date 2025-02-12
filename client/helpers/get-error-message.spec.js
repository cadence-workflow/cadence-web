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

import getErrorMessage from './get-error-message';
import { NOTIFICATION_TYPE_ERROR_MESSAGE_DEFAULT } from '~constants';

describe('getErrorMessage', () => {
  describe('When passing error.json.message', () => {
    it('should return error.json.message', () => {
      const error = {
        json: {
          message: 'error.json.message value',
        },
      };
      const output = getErrorMessage(error);

      expect(output).toEqual('error.json.message value');
    });
  });

  describe('When passing error.status', () => {
    it('should return error.status', () => {
      const error = {
        status: 'error.status value',
      };
      const output = getErrorMessage(error);

      expect(output).toEqual('error.status value');
    });
  });

  describe('When passing error.message', () => {
    it('should return error.message', () => {
      const error = {
        message: 'error.message value',
      };
      const output = getErrorMessage(error);

      expect(output).toEqual('error.message value');
    });
  });

  describe('When passing no error', () => {
    it('should return NOTIFICATION_TYPE_ERROR_MESSAGE_DEFAULT', () => {
      const error = undefined;
      const output = getErrorMessage(error);

      expect(output).toEqual(NOTIFICATION_TYPE_ERROR_MESSAGE_DEFAULT);
    });
  });
});
